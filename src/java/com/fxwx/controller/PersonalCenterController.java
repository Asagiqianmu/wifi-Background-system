package com.fxwx.controller;

import java.io.UnsupportedEncodingException;
import java.util.Date;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSON;
import com.fxwx.entity.CloudInfo;
import com.fxwx.entity.CloudUser;
import com.fxwx.entity.UserBankInfo;
import com.fxwx.entity.UserWithdrawInfo;
import com.fxwx.service.impl.PersonalCenterServiceImpl;
import com.fxwx.service.impl.UserServiceImpl;
import com.fxwx.service.impl.WithdrawServiceImpl;
import com.fxwx.util.ExecuteResult;
import com.fxwx.util.MD5;
import com.fxwx.util.SHA256;

@Controller
@RequestMapping("/personalCenter")
public class PersonalCenterController {
	private static Logger log = Logger.getLogger(PersonalCenterController.class);
	VerifyCodeController vcc = new VerifyCodeController();
	@Autowired
	public PersonalCenterServiceImpl personalCenterServiceImpl;
	@Autowired
	public WithdrawServiceImpl withdrawServiceImpl;
	@Autowired
	public UserServiceImpl userServiceImpl;

	@RequestMapping("toPersonalCenter")
	public String toPersonalCenter(HttpSession session, Model model) {

		session.setAttribute("page", "/newstylejsp/personal/personal");
		return "index";
	}

	/**
	 * 获得用户的用户名
	 * 
	 * @param session
	 * @return
	 */
	@RequestMapping("getUserName")
	@ResponseBody
	public String getUserName(HttpSession session) {
		ExecuteResult excute = new ExecuteResult();
		String withdrawPhone = null;
		String userName = ((CloudUser) session.getAttribute("user")).getUserName();
		int id = ((CloudUser) session.getAttribute("user")).getId();
		try {

			UserWithdrawInfo u = personalCenterServiceImpl.getUserWithdrawInfo(id);
			if ("".equals(u.getWithdrawPhone()) || null == u.getWithdrawPhone()) {
				withdrawPhone = userName;
			} else {
				withdrawPhone = u.getWithdrawPhone();
			}

		} catch (Exception e) {
			log.info("提現金額表里無記錄");
			withdrawPhone = userName;
		}
		excute.setData(userName);
		excute.setMsg(withdrawPhone);
		return excute.toJsonString();
	}

	/**
	 * 获得用户提现账号的手机号 和银行卡账号
	 * 
	 * @param session
	 * @return
	 */
	@RequestMapping("getUserWithdrawInfo")
	@ResponseBody
	public String getUserWithdrawInfo(HttpSession session) {
		ExecuteResult excute = new ExecuteResult();
		int id = ((CloudUser) session.getAttribute("user")).getId();
		// List<String> ls=personalCenterServiceImpl.getUserBankInfo(id);
		List<UserBankInfo> ls = withdrawServiceImpl.getUserBankInfos(id);
		if (ls != null && ls.size() != 0) {
			excute.setCode(200);
			excute.setData(ls);
		} else {
			excute.setCode(201);
		}
		return excute.toJsonString();
	}

	/**
	 * 获得前台传入的验证码和后台验证码比较
	 * 
	 * @param authCode
	 *            验证码
	 * @param session
	 * @return
	 */
	@RequestMapping("valiateAuthCode")
	@ResponseBody
	public String valiateAuthCode(@RequestParam(defaultValue = "") String authCode, @RequestParam String telphone,
			HttpSession session) {
		ExecuteResult excute = new ExecuteResult();
		String randCode = (String) session.getAttribute(telphone);
		if ("".equals(authCode)) {
			excute.setCode(202);
		} else {

			if (authCode.equals(randCode)) {
				excute.setCode(200);
			} else {
				excute.setCode(201);
			}
		}
		return excute.toJsonString();
	}

	/**
	 * 更换用户名时 ,如果验证码正确 则伪修改用户账号,等用户需改密码时一并修改,防止用户修改完账户名时出现意外中断修改密码操作 例如断网等
	 * 
	 * @param telephone
	 *            用户名
	 * @param authCode
	 *            验证码
	 * @param session
	 * @return
	 */
	@RequestMapping("updateUserName")
	@ResponseBody
	public String updateUserName(@RequestParam(defaultValue = "") String telephone,
			@RequestParam(defaultValue = "") String authCode, HttpSession session, HttpServletRequest request) {
		ExecuteResult excute = new ExecuteResult();
		if ("".equals(telephone)) {
			excute.setCode(203);
			excute.setMsg("请输入手机号");
			return excute.toJsonString();
		}
		if ("".equals(authCode)) {
			excute.setCode(204);
			excute.setMsg("请输入验证码");
			return excute.toJsonString();
		}
		CloudUser user = personalCenterServiceImpl.selCloudUser(telephone);
		if (user != null) {
			excute.setCode(205);
			excute.setMsg("该号码已注册");
			request.getSession().removeAttribute(telephone);
			request.getSession().removeAttribute("randCodeTime");
			return excute.toJsonString();
		}

		String randCode = (String) session.getAttribute(telephone);
		boolean isOk = vcc.checkCode(authCode, randCode);
		if (!isOk) {
			excute.setCode(201);
			excute.setMsg("验证码不正确");
			return excute.toJsonString();
		}
		// 5分钟
		Long oldTime = (Long) request.getSession().getAttribute("randCodeTime");
		oldTime = oldTime == null ? 0 : oldTime;
		long newTime = new Date().getTime();
		if ((newTime - 5 * 60 * 1000) <= oldTime) {// 通过
			request.getSession().removeAttribute(telephone);
			request.getSession().removeAttribute("randCodeTime");
		} else {
			excute.setCode(202);
			excute.setMsg("验证码失效，请重新获取");
			return excute.toJsonString();
		}

		excute.setCode(200);
		excute.setMsg("修改成功");
		session.setAttribute("newTel", telephone);
		return excute.toJsonString();
	}

	/**
	 * 同时更改用户名密码,防止出现用户中断修改过程
	 * 
	 * @param passWord
	 * @param session
	 * @return
	 */
	@RequestMapping("updateUserPassWord")
	@ResponseBody
	public String updateUserPassWord(@RequestParam(defaultValue = "") String passWord, HttpSession session) {
		ExecuteResult excute = new ExecuteResult();
		if ("".equals(passWord)) {
			excute.setCode(202);
			excute.setMsg("请输入密码");
			return excute.toJsonString();
		}
		if (passWord.length() < 4) {
			excute.setCode(203);
			excute.setMsg("密码长度不能少于四位");
			return excute.toJsonString();
		}
		String newUserName = (String) session.getAttribute("newTel");
		int id = ((CloudUser) session.getAttribute("user")).getId();
		CloudUser user = (CloudUser) session.getAttribute("user");
		String newPassWord = SHA256.getUserPassword(newUserName, MD5.encode(passWord).toLowerCase());
		int result = personalCenterServiceImpl.updateUserName(id, newUserName, newPassWord);
		if (result == 1) {
			excute.setCode(200);
			excute.setMsg("修改成功");
			// 根据userName和MD5(password)查询用户
			CloudUser newUser = userServiceImpl.getUserByUserNameAndPassword(newUserName, passWord);
			session.setAttribute("user", newUser);
		} else {
			excute.setCode(201);
			excute.setMsg("修改失败,请稍后再试");
		}
		return excute.toJsonString();
	}

	/**
	 * 更换用户提现手机号
	 * 
	 * @param accountPhone
	 *            新的提现手机号
	 * @param authCode
	 *            验证码
	 * @param session
	 * @param request
	 * @return
	 */
	@RequestMapping("updateAccountNumber")
	@ResponseBody
	public String updateAccountNumber(@RequestParam(defaultValue = "") String accountPhone,
			@RequestParam(defaultValue = "") String authCode, HttpSession session, HttpServletRequest request) {
		ExecuteResult excute = new ExecuteResult();
		if ("".equals(accountPhone)) {
			excute.setCode(204);
			excute.setMsg("请输入手机号");
			return excute.toJsonString();
		}
		if ("".equals(accountPhone)) {
			excute.setCode(205);
			excute.setMsg("请输入验证码");
			return excute.toJsonString();
		}
		int id = ((CloudUser) session.getAttribute("user")).getId();
		String randCode = (String) session.getAttribute(accountPhone);
		boolean isOk = vcc.checkCode(authCode, randCode);
		if (!isOk) {
			excute.setCode(201);
			excute.setMsg("验证码不正确");
			return excute.toJsonString();
		}
		// 5分钟
		Long oldTime = (Long) request.getSession().getAttribute("randCodeTime");
		oldTime = oldTime == null ? 0 : oldTime;
		long newTime = new Date().getTime();
		if ((newTime - 5 * 60 * 1000) <= oldTime) {// 通过
			request.getSession().removeAttribute(accountPhone);
			request.getSession().removeAttribute("randCodeTime");
		} else {
			excute.setCode(202);
			excute.setMsg("验证码失效，请重新获取");
			return excute.toJsonString();
		}

		int i = personalCenterServiceImpl.updateAccountPhone(id, accountPhone);
		if (i == 1) {
			excute.setCode(200);
			excute.setMsg("修改成功");
		} else {
			excute.setCode(203);
			excute.setMsg("修改失败,请稍后重试");
		}
		return excute.toJsonString();
	}

	/**
	 * 添加银行卡
	 * 
	 * @param bankcarNum
	 *            用户银行卡账号
	 * @param accountName
	 *            收款人名称
	 * @param bankDeposit
	 *            开户银行
	 * @param branchName
	 *            支行名称
	 * @param sesson
	 * @return
	 */
	@RequestMapping("addBankInfo")
	@ResponseBody
	public String addBankInfo(@RequestParam String bankcarNum, @RequestParam String accountName,
			@RequestParam String bankDeposit, @RequestParam String branchName, HttpSession session) {
		ExecuteResult excute = new ExecuteResult();
		int id = ((CloudUser) session.getAttribute("user")).getId();
		UserBankInfo userBankInfo = new UserBankInfo();
		userBankInfo.setAccountName(accountName);
		userBankInfo.setBankcarNum(bankcarNum);
		userBankInfo.setBankDeposit(bankDeposit);
		userBankInfo.setState(0);
		userBankInfo.setUserId(id);
		int i = personalCenterServiceImpl.addBnakCard(userBankInfo);
		if (i == 1) {
			excute.setCode(200);
		} else {
			excute.setCode(201);
		}
		return excute.toJsonString();
	}

	/**
	 * 修改用户密码
	 * 
	 * @param userName
	 *            用户名
	 * @param passWord
	 *            密码
	 * @param session
	 * @return
	 */
	@RequestMapping("updatePassWord")
	@ResponseBody
	public String updatePassWord(@RequestParam String userName, @RequestParam(defaultValue = "") String passWord,
			HttpSession session) {
		ExecuteResult excute = new ExecuteResult();
		String name = ((CloudUser) session.getAttribute("user")).getUserName();
		int id = ((CloudUser) session.getAttribute("user")).getId();
		if ("".equals(passWord)) {
			excute.setCode(203);
			return excute.toJsonString();
		}
		if (!userName.equals(name)) {
			excute.setCode(201);
			return excute.toJsonString();
		}
		if (passWord.length() < 4) {
			excute.setCode(204);
			return excute.toJsonString();
		}
		String newPassWord = SHA256.getUserPassword(userName, MD5.encode(passWord).toLowerCase());
		int result = personalCenterServiceImpl.updateUserName(id, userName, newPassWord);
		if (result == 1) {
			excute.setCode(200);
		} else {
			excute.setCode(202);
		}
		return excute.toJsonString();
	}

	/**
	 * 删除银行卡
	 * 
	 * @param bankCardNum
	 *            银行卡号
	 * @param session
	 * @return
	 * @throws UnsupportedEncodingException
	 */
	@RequestMapping("delBankInfo")
	@ResponseBody
	public String delBankInfo(@RequestParam String bankCardNum, HttpServletRequest request,
			HttpServletResponse response, HttpSession session) throws UnsupportedEncodingException {
		request.setCharacterEncoding("UTF-8");
		response.setCharacterEncoding("UTF-8");
		ExecuteResult excute = new ExecuteResult();
		int id = ((CloudUser) session.getAttribute("user")).getId();
		UserBankInfo u = personalCenterServiceImpl.selByCardAndName(bankCardNum, id);
		if (u != null) {
			u.setState(1);
			int i = personalCenterServiceImpl.delUserBankInfo(u);
			if (i == 1) {
				excute.setCode(200);
			} else {
				excute.setCode(201);
			}
		} else {
			excute.setCode(202);
		}
		return excute.toJsonString();
	}

	/**
	 * @Description 根据用户id查找用户详细信息
	 * @date 2016年8月25日上午11:00:57
	 * @author guoyingjie
	 * @param session
	 * @return
	 */
	@RequestMapping("getCloudInfoAndPhone")
	@ResponseBody
	public String getCloudInfoAndPhone(HttpSession session) {
		int id = ((CloudUser) session.getAttribute("user")).getId();
		ExecuteResult excute = new ExecuteResult();
		List<Map<String, Object>> info = personalCenterServiceImpl.getCloudInfoAndPhone(id);
		List<UserBankInfo> bank = personalCenterServiceImpl.getBandInfoByUserId(id);
		excute.setCode(200);
		excute.setMsg(JSON.toJSONStringWithDateFormat(bank, "yyyy-MM-dd HH:mm:ss"));
		excute.setData(info);
		return excute.toJsonString();
	}

	/**
	 * @Description 更改用户信息
	 * @date 2016年8月25日下午2:36:36
	 * @author guoyingjie
	 * @param sessoin
	 * @param username
	 * @param company
	 * @param telephone
	 * @param email
	 * @param address
	 * @return
	 */
	@RequestMapping("updateUserInfo")
	@ResponseBody
	public String updateUserInfo(HttpSession session, @RequestParam String username,
			@RequestParam(defaultValue = "") String company, @RequestParam(defaultValue = "") String telephone,
			@RequestParam(defaultValue = "") String email, @RequestParam(defaultValue = "") String address,
			@RequestParam(defaultValue = "") String imgpath) {
		int id = ((CloudUser) session.getAttribute("user")).getId();
		ExecuteResult excute = new ExecuteResult();
		try {
			CloudInfo info = personalCenterServiceImpl.getCloudInfoByUserId(id);
			if (info != null) {
				info.setUserId(id);
				info.setRealName(username);
				info.setAddress(address);
				info.setCompany(company);
				info.setEmail(email);
				info.setImg(imgpath);
				info.setTelephone(telephone);
				info.setUpdateTime(new Date());
				info.setCreateTime(info.getCreateTime());
				personalCenterServiceImpl.updateUserInfo(info, 1);
			} else {
				CloudInfo infos = new CloudInfo();
				infos.setUserId(id);
				infos.setRealName(username);
				infos.setAddress(address);
				infos.setCompany(company);
				infos.setEmail(email);
				infos.setImg(imgpath);
				infos.setTelephone(telephone);
				infos.setUpdateTime(new Date());
				infos.setCreateTime(new Date());
				personalCenterServiceImpl.updateUserInfo(infos, 0);
			}
			// personalCenterServiceImpl.updateSiteAdmin(id, supTel);
			excute.setCode(200);
		} catch (Exception e) {
			excute.setCode(201);
		}
		return excute.toJsonString();
	}

	/**
	 * @Description 一句话描述此方法的功能
	 * @date 2016年8月25日下午3:34:22
	 * @author guoyingjie
	 * @param session
	 * @param username
	 * @return
	 */
	@RequestMapping("updateCloudUser")
	@ResponseBody
	public String updateCloudUser(HttpServletRequest request, HttpSession session, @RequestParam String jphone,
			@RequestParam String username, @RequestParam String code) {
		CloudUser user = (CloudUser) session.getAttribute("user");
		ExecuteResult excute = new ExecuteResult();
		user.setUserName(user.getUserName());
		user.setPassWord(user.getPassWord());
		user.setWithdrawPhone(username);
		String randCode = (String) session.getAttribute(jphone);
		boolean isOk = vcc.checkCode(code, randCode);
		if (!isOk) {
			excute.setCode(201);
			excute.setMsg("验证码不正确");
			return excute.toJsonString();
		}
		// 5分钟
		Long oldTime = (Long) request.getSession().getAttribute("randCodeTime");
		oldTime = oldTime == null ? 0 : oldTime;
		long newTime = new Date().getTime();
		if ((newTime - 5 * 60 * 1000) <= oldTime) {// 通过
			request.getSession().removeAttribute(jphone);
			request.getSession().removeAttribute("randCodeTime");
		} else {
			excute.setCode(201);
			excute.setMsg("验证码失效，请重新获取");
			return excute.toJsonString();
		}
		try {
			personalCenterServiceImpl.updateCloudUser(user);
			excute.setCode(200);
		} catch (Exception e) {
			excute.setCode(201);
		}
		return excute.toJsonString();
	}

	/**
	 * @Description 修改默认银行卡
	 * @date 2016年8月25日下午5:11:09
	 * @author guoyingjie
	 * @param session
	 * @param userId
	 * @param bandId
	 * @return
	 */
	@RequestMapping("changeDefaltBank")
	@ResponseBody
	public String changeDefaltBank(HttpSession session, @RequestParam int bankId) {
		ExecuteResult e = new ExecuteResult();
		int id = ((CloudUser) session.getAttribute("user")).getId();
		try {
			personalCenterServiceImpl.changeDefaultBank(id, bankId);
			e.setCode(200);
		} catch (Exception es) {
			e.setCode(201);
		}
		return e.toJsonString();
	}

	/**
	 * @Description 删除银行卡
	 * @date 2016年8月25日下午5:59:07
	 * @author guoyingjie
	 * @param session
	 * @param bankId
	 * @return
	 */
	@RequestMapping("deleteBand")
	@ResponseBody
	public String deleteBand(HttpSession session, @RequestParam int bankId) {
		ExecuteResult e = new ExecuteResult();
		int id = ((CloudUser) session.getAttribute("user")).getId();
		try {
			personalCenterServiceImpl.deleteBand(id, bankId);
			e.setCode(200);
		} catch (Exception es) {
			e.setCode(201);
		}
		return e.toJsonString();
	}

	/**
	 * @Description 添加银行卡或者是支付宝
	 * @date 2016年8月25日下午7:53:30
	 * @author guoyingjie
	 * @param state
	 * @param usName
	 * @param usCard
	 * @param uskhAds
	 * @param uszhName
	 * @return
	 */
	@RequestMapping("insertBankAndZhi")
	@ResponseBody
	public String insertBankAndZhi(HttpSession session, @RequestParam int state, @RequestParam String usName,
			@RequestParam String usCard, @RequestParam(defaultValue = "") String uskhAds,
			@RequestParam(defaultValue = "") String uszhName) {
		ExecuteResult e = new ExecuteResult();
		int id = ((CloudUser) session.getAttribute("user")).getId();

		UserBankInfo u = personalCenterServiceImpl.getByCardAndName(usCard.trim(), id);
		if (u != null) {
			e.setCode(202);
			return e.toJsonString();
		}

		try {
			personalCenterServiceImpl.insertBankAndZhi(id, state, usName, usCard, uskhAds, uszhName);
			e.setCode(200);
		} catch (Exception es) {
			e.setCode(201);
		}
		return e.toJsonString();
	}

}
