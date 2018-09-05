package com.fxwx.controller;

import java.sql.Timestamp;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fxwx.entity.CloudSite;
import com.fxwx.entity.CloudUser;
import com.fxwx.entity.PortalUser;
import com.fxwx.entity.SiteCustomerInfo;
import com.fxwx.entity.SitePriceConfig;
import com.fxwx.service.impl.CloudSiteServiceImpl;
import com.fxwx.service.impl.RealnameAuthImpl;
import com.fxwx.service.impl.SiteCustomerInfoServiceImpl;
import com.fxwx.service.impl.SiteCustomerServiceImpl;
import com.fxwx.service.impl.SitePriceConfigServiceImpl;
import com.fxwx.service.impl.UserServiceImpl;
import com.fxwx.util.ExecuteResult;
import com.fxwx.util.ExportExcelOverlayUtils;
import com.fxwx.util.MD5;
import com.fxwx.util.SHA256;

/**
 * @ToDoWhat 用户管理操作，查询场所注册用户，消费统计等
 * @author dengfei E-mail:dengfei200857@163.com
 */
@Controller
@RequestMapping("/siteCustomer")
public class SiteCustomerInfoController {

	@Autowired
	public UserServiceImpl userServiceImpl;
	@Autowired
	public SiteCustomerInfoServiceImpl infoServiceImpl;
	@Autowired
	public SitePriceConfigServiceImpl sitePriceConfigServiceImpl;
	@Autowired
	public SiteCustomerServiceImpl siteCustomerServiceImpl;
	@Autowired
	public CloudSiteServiceImpl cloudSiteServiceImpl;
	@Autowired
	public UserServiceImpl userserviceimpl;
	@Autowired
	public RealnameAuthImpl realnameAuthImpl;

	private int pageSize = 5;

	@RequestMapping("toSiteCustomerList")
	public String toSiteCustomerList(HttpSession session, Model model, HttpServletRequest request) {

		CloudUser user = (CloudUser) session.getAttribute("user");
		int userId = user.getId();
		List<Map<String, Object>> list = null;
		if (user.getUserName().equals("18292059695")) {
			CloudUser cu = userServiceImpl.getCloudUserByTelphone("15810954539");
			list = sitePriceConfigServiceImpl.getAppUserSiet(cu.getId());
			session.setAttribute("masterAccount", cu);

		} else {
			list = sitePriceConfigServiceImpl.getUserSiet(userId);
		}
		session.setAttribute("appList", list);
		model.addAttribute("siteList", list);
		try {
			int state = Integer.valueOf(request.getParameter("state"));
			if (state == 1) {
				model.addAttribute("state", state);
			}
		} catch (Exception e) {
			// TODO: handle exception
		}
		session.setAttribute("page", "/newstylejsp/userMange/userMangement");
		return "index";
	}

	/**
	 * 获取计费规则
	 * 
	 * @param curPage
	 * @param pageSize
	 * @param session
	 * @return toCustomerPay
	 */
	@RequestMapping("doCustomerPay")
	@ResponseBody
	public String doCustomerPay(@RequestParam(defaultValue = "0") int chargeType,
			@RequestParam(defaultValue = "0") int siteId, HttpSession session) {
		ExecuteResult result = new ExecuteResult();
		result.setCode(200);
		List<SitePriceConfig> custem = userserviceimpl.sitePriceConfigAll(siteId, chargeType);
		if (custem.size() == 0) {// 判断是否存在融合套餐计费规则
			custem = userserviceimpl.sitePriceConfigAll(siteId, 0);// 使用普通计费规则，
		}
		result.setData(custem);
		result.setMsg("数据获取成功，请继续操作");
		return result.toJsonString();
	}

	/**
	 * 新的获取收费规则
	 * 
	 * @param siteId
	 * @param username
	 * @param session
	 * @param model
	 * @return
	 */
	@RequestMapping("getPaymentType")
	@ResponseBody
	public String getPaymentType(@RequestParam(defaultValue = "0") int siteId,
			@RequestParam(defaultValue = "") String userName, HttpSession session, Model model) {
		ExecuteResult result = new ExecuteResult();
		List<SitePriceConfig> spcList = infoServiceImpl.getSitePriceConfigAll(siteId, userName);
		result.setData(spcList);
		return result.toJsonString();
	}

	/**
	 * 快速注册用户
	 * 
	 * @param curPage
	 * @param pageSize
	 * @param session
	 * @return
	 */
	@RequestMapping("doRegistSD")
	@ResponseBody
	public String doRegistSD(@RequestParam int gender, @RequestParam int siteId,
			@RequestParam(defaultValue = "") String pwd, @RequestParam(defaultValue = "") String uname,
			@RequestParam String dates, HttpServletRequest req) {
		ExecuteResult result = new ExecuteResult();

		PortalUser u = new PortalUser();
		u.setUserName(uname);
		u.setPassWord(SHA256.getUserPassword(uname, MD5.encode(pwd).toLowerCase()));
		u.setSex(gender);
		u.setCreateTime(new Timestamp(Long.parseLong(dates)));
		boolean registerIsSucess = userserviceimpl.userRegistByAdmin(u);
		boolean insertIntoUse = userserviceimpl.updateIntermediateChart(siteId, u.getId());
		Map<String, String> map = new HashMap<>();
		map.put("userId", u.getId() + "");
		map.put("storeId", siteId + "");
		boolean insertRecod = userserviceimpl.savePaymentinfo("1111" + new Date().getTime(), map, 0);
		if (registerIsSucess == true && insertIntoUse == true && insertRecod == true) {
			result.setCode(200);
		} else {
			result.setCode(201);
		}
		return result.toJsonString();
	}

	/**
	 * 根据电话号码解锁
	 * 
	 * @param userName
	 */
	@RequestMapping("unLock")
	@ResponseBody
	public String unLock(@RequestParam String userName, @RequestParam int siteId) {
		ExecuteResult er = new ExecuteResult();
		boolean isSuccess = userServiceImpl.toJieLuck(userName, siteId);
		if (isSuccess == true) {
			userServiceImpl.unLock(userName);
			er.setCode(200);
			er.setMsg("解锁成功!");
			return er.toJsonString();
		}
		er.setCode(201);
		er.setMsg("解锁失败!");
		return er.toJsonString();
	}

	/**
	 * 把用户停用
	 * 
	 * @param username
	 * @param siteId
	 * @return
	 */
	@RequestMapping("blockUp")
	@ResponseBody
	public String blockUp(@RequestParam String username, @RequestParam int siteId, @RequestParam int status) {
		ExecuteResult res = new ExecuteResult();

		// 因为手机号已经验证,所以此处不做判空处理
		PortalUser portalUser = userserviceimpl.getIdByUserName(username);
		if (portalUser == null) {
			res.setCode(202);
			res.setMsg("查无该用户");
			return res.toJsonString();
		}
		SiteCustomerInfo siteCustomer = infoServiceImpl.getExpirationTime(siteId, portalUser.getId());
		if (siteCustomer != null) {
			boolean falg = infoServiceImpl.updateUserStop(siteCustomer, status);
			if (falg) {
				res.setCode(200);
				if (status == 0) {
					res.setMsg("启用成功");
				} else {

					res.setMsg("停用成功");
				}
			} else {
				res.setCode(201);
				res.setMsg("网络繁忙,请稍后重试");
			}
		} else {
			res.setCode(203);
			res.setMsg("停用成功");
		}

		return res.toJsonString();
	}

	/**
	 * 导出excel
	 * 
	 * @param siteId
	 * @param startTime
	 * @param endTime
	 * @param pageSize
	 * @param session
	 * @return
	 */
	@SuppressWarnings("rawtypes")
	@RequestMapping("exportExport")
	public void exportExport(@RequestParam(defaultValue = "0") int siteId,
			@RequestParam(defaultValue = "") String startTime, HttpServletRequest request, HttpServletResponse response,
			@RequestParam(defaultValue = "") String endTime, HttpSession session) throws Exception {
		int pageSize = 1000;
		Map<String, String> map = new HashMap<>();
		map.put("siteId", siteId + "");
		map.put("startTime", startTime);
		map.put("endTime", endTime);
		int counts = userserviceimpl.getRunOffCount(siteId, startTime, endTime);
		ExportExcelOverlayUtils excel = new ExportExcelOverlayUtils();
		String[] title = { "用户名", "到期时间", "归属场所" };
		excel.exportExcel("流失用户详情.xls", title, response, request,
				((counts % pageSize) > 0 ? (counts / pageSize + 1) : (counts / pageSize)), map, pageSize,
				userserviceimpl);

	}

	/**
	 * 对指定用户进行缴费
	 * 
	 * @param siteId
	 * @param username
	 * @param paytype
	 * @param payno
	 * @param orderNum
	 * @param tradeNum
	 * @param paramJson
	 * @param isFinish
	 * @param failReson
	 * @return
	 * @throws ParseException
	 */

	@RequestMapping("updateCustomerPay")
	@ResponseBody
	public String updateCustomerPay(@RequestParam(defaultValue = "") int siteId,
			@RequestParam(defaultValue = "") String username, @RequestParam(defaultValue = "") int configId,
			@RequestParam(defaultValue = "") String amount, // 购买总金额
			@RequestParam(defaultValue = "") int buyNum, // 购买数量
			@RequestParam(defaultValue = "") String payName, @RequestParam String priceNum,
			@RequestParam String giveNum, @RequestParam int mealType, @RequestParam String giveUnit,
			HttpSession session) throws ParseException {
		Map<String, String> map = new HashMap<String, String>();

		ExecuteResult result = new ExecuteResult();
		map.put("storeId", siteId + "");// 场所Id
		map.put("payType", configId + "");// 场所收费配置Id
		map.put("buyNum", buyNum + "");// 购买数量
		map.put("priceNum", priceNum);// 套餐
		map.put("amount", amount);// 总金额
		map.put("priceName", payName);// 套餐名称
		map.put("addMealNum", giveNum);
		map.put("addMealUnit", giveUnit);
		map.put("mealType", mealType + "");// 选择的套餐类型 1----时间，2-----流量
		CloudSite site = cloudSiteServiceImpl.getCloudSiteById(siteId);
		map.put("tenantId", site.getUser_id() + "");// 商户Id
		PortalUser portalUser = userserviceimpl.getIdByUserName(username);
		if (portalUser == null) {
			result.setCode(201);
			result.setMsg("该用户没有注册,请点击新增用户");
			return result.toJsonString();
		}
		map.put("userId", portalUser.getId() + "");// 用户Id
		// 根据场所id和priceInfoId获取场所对应的价格配置信息
		SitePriceConfig spcf = sitePriceConfigServiceImpl.getSitePriceInfos(siteId, configId);
		// 如果价格配置信息为空的话
		if (spcf == null) {
			return result.toJsonString();
		}
		// 根据场所id和用户id查询场所账户表
		boolean ok = userServiceImpl.checkParam(map, spcf);
		if (ok) {
			SiteCustomerInfo sci = userServiceImpl.getSiteNameById(siteId, portalUser.getId());
			String riqi = userServiceImpl.getUserCustomer(sci, spcf, map);
			if ("1".equals(map.get("mealType"))) {// 用户购买的是时间套餐
				map.put("expireDate", riqi);
			} else {
				map.put("expireFlow", riqi);
			}
			// 订单号
			String out_trade_no = "0000" + new Date().getTime();
			// 保存支付信息
			userServiceImpl.savePaymentinfo(out_trade_no, map, 4);

			boolean isOk = userServiceImpl.dealUserMess(map, out_trade_no, "0" + portalUser.getUserName());
			if (isOk) {
				result.setCode(200);
				result.setData(riqi);
			}
		} else {
			result.setCode(202);
			result.setMsg("购买套餐与后台不匹配");
		}
		return result.toJsonString();

	}

	/************************ 新的用户管理 ******************************/

	/**
	 * 
	 * @Description:获取注册用户列表 付费用户列表 status 1代注册用户,2代表付费用户
	 * @author songyanbiao
	 * @date 2016年8月18日 上午11:26:11
	 * @param
	 * @return
	 */
	@RequestMapping("getUserInfos")
	@ResponseBody
	public String getUserInfo(HttpSession session, @RequestParam(defaultValue = "0") int siteId,
			@RequestParam(defaultValue = "") String userName, @RequestParam int curPage, @RequestParam String status,
			@RequestParam(defaultValue = "") String times) {
		ExecuteResult res = new ExecuteResult();
		int userId = ((CloudUser) session.getAttribute("user")).getId();
		List<Map<String, Object>> ls = null;
		if (status.equals("1")) {
			ls = userServiceImpl.getUserInfoList(siteId, userName, userId, pageSize, curPage, times, 0);
		} else {
			ls = userServiceImpl.getUserPayInfoList(siteId, userName, userId, pageSize, curPage, times, 0);
		}
		if (ls == null) {
			res.setCode(202);
			res.setMsg("网络出错了,请稍后查询");
		} else if (ls.size() == 0) {
			res.setCode(201);
			switch (status) {
			case "1":
				res.setMsg("场所下无注册用户");
				break;

			default:
				res.setMsg("场所下无付费用户");
				break;
			}
		} else {
			res.setCode(200);
			res.setData(ls);
		}
		return res.toJsonString();
	}

	/**
	 * 
	 * @Description:获取在线用户列表
	 * @author songyanbiao
	 * @date 2016年8月18日 上午11:36:21
	 * @param
	 * @return
	 */
	@RequestMapping("getOnlineUser")
	@ResponseBody
	public String getOnlineUser(HttpSession session, @RequestParam(defaultValue = "0") int siteId,
			@RequestParam(defaultValue = "") String userName, @RequestParam int curPage,
			@RequestParam(defaultValue = "") String times) {
		ExecuteResult res = new ExecuteResult();
		int userId = ((CloudUser) session.getAttribute("user")).getId();
		List<Map<String, Object>> ls = userServiceImpl.getOnlineUserList(siteId, userName, userId, pageSize, curPage,
				times, 0);
		if (ls == null) {
			res.setCode(202);
			res.setMsg("网络出错了,请稍后查询");
		} else if (ls.size() == 0) {
			res.setCode(201);
			res.setMsg("场所下无在线用户");
		} else {
			res.setCode(200);
			res.setData(ls);
		}
		return res.toJsonString();
	}

	/**
	 * 
	 * @Description:获取注册未付费用户列表
	 * @author songyanbiao
	 * @date 2016年8月18日 上午11:39:55
	 * @param
	 * @return
	 */
	@RequestMapping("getUserNoPay")
	@ResponseBody
	public String getUserNoPay(HttpSession session, @RequestParam(defaultValue = "0") int siteId,
			@RequestParam(defaultValue = "") String userName, @RequestParam int curPage,
			@RequestParam(defaultValue = "") String times) {
		ExecuteResult res = new ExecuteResult();
		int userId = ((CloudUser) session.getAttribute("user")).getId();
		List<Map<String, Object>> ls = userServiceImpl.getUserNoPayList(siteId, userName, userId, pageSize, curPage,
				times, 0);
		if (ls == null) {
			res.setCode(202);
			res.setMsg("网络出错了,请稍后查询");
		} else if (ls.size() == 0) {
			res.setCode(201);
			res.setMsg("场所下无未付费用户");
		} else {
			res.setCode(200);
			res.setData(ls);
		}
		return res.toJsonString();
	}

	/**
	 * 
	 * @Description:获取流失用户列表
	 * @author songyanbiao
	 * @date 2016年8月18日 上午11:43:48
	 * @param
	 * @return
	 */
	@RequestMapping("getRunOffUser")
	@ResponseBody
	public String getRunOffUser(HttpSession session, @RequestParam(defaultValue = "0") int siteId,
			@RequestParam(defaultValue = "") String times, @RequestParam int curPage,
			@RequestParam(defaultValue = "") String startTime, @RequestParam(defaultValue = "") String endTime)
			throws ParseException {
		ExecuteResult res = new ExecuteResult();
		int userId = ((CloudUser) session.getAttribute("user")).getId();
		List<Map<String, Object>> ls = userServiceImpl.getRunOffUserList(siteId, userId, pageSize, curPage, startTime,
				endTime, times, 0);
		if (ls == null) {
			res.setCode(202);
			res.setMsg("网络出错了,请稍后查询");
		} else if (ls.size() == 0) {
			res.setCode(201);
			res.setMsg("场所下无流失用户");
		} else {
			res.setCode(200);
			res.setData(ls);
		}
		return res.toJsonString();
	}

	/**
	 * 
	 * @Description:获取在线用户总数
	 * @author songyanbiao
	 * @date 2016年8月18日 上午11:50:24
	 * @param
	 * @return
	 */
	@RequestMapping("getOnlineUserCount")
	@ResponseBody
	public String getOnlineUserCount(HttpSession session, @RequestParam(defaultValue = "0") int siteId,
			@RequestParam(defaultValue = "") String userName) {
		ExecuteResult res = new ExecuteResult();
		int userId = ((CloudUser) session.getAttribute("user")).getId();
		int pageNum = userServiceImpl.getOnlineUserCount(siteId, userName, userId, pageSize);
		res.setTotoalNum(pageNum);
		return res.toJsonString();
	}

	/**
	 * 
	 * @Description:获取注册用户,付费用户总数
	 * @author songyanbiao
	 * @date 2016年8月18日 上午11:51:01
	 * @param
	 * @return
	 */
	@RequestMapping("getUserInfoCount")
	@ResponseBody
	public String getUserInfoCount(HttpSession session, @RequestParam(defaultValue = "0") int siteId,
			@RequestParam(defaultValue = "") String userName, @RequestParam String status) {
		ExecuteResult res = new ExecuteResult();

		int userId = ((CloudUser) session.getAttribute("user")).getId();
		int pageNum = 0;
		if (status.equals("1")) {
			pageNum = userServiceImpl.getUserInfoCount(siteId, userName, userId, pageSize);
		} else {
			pageNum = userServiceImpl.getUserPayInfoCount(siteId, userName, userId, pageSize);
		}
		res.setTotoalNum(pageNum);
		return res.toJsonString();
	}

	/**
	 * 
	 * @Description:获取注册未付费的用户总数
	 * @author songyanbiao
	 * @date 2016年8月18日 下午12:08:40
	 * @param
	 * @return
	 */
	@RequestMapping("getUserNoPayCount")
	@ResponseBody
	public String getUserNoPayCount(HttpSession session, @RequestParam(defaultValue = "0") int siteId,
			@RequestParam(defaultValue = "") String userName) {
		ExecuteResult res = new ExecuteResult();

		int userId = ((CloudUser) session.getAttribute("user")).getId();
		int pageNum = userServiceImpl.getUserNoPayCount(siteId, userName, userId, pageSize);
		res.setTotoalNum(pageNum);
		return res.toJsonString();
	}

	/**
	 * 
	 * @Description:获取流失用户总数
	 * @author songyanbiao
	 * @date 2016年8月18日 下午12:13:28
	 * @param
	 * @return
	 */
	@RequestMapping("getRunOffUserCount")
	@ResponseBody
	public String getRunOffUserCount(HttpSession session, @RequestParam(defaultValue = "0") int siteId,
			@RequestParam(defaultValue = "") String startTime, @RequestParam(defaultValue = "") String endTime)
			throws ParseException {
		ExecuteResult res = new ExecuteResult();
		int userId = ((CloudUser) session.getAttribute("user")).getId();
		int pages = userServiceImpl.getRunOffUserCount(siteId, userId, pageSize, startTime, endTime);
		int totalPage = (pages % pageSize) > 0 ? (pages / pageSize + 1) : (pages / pageSize);
		res.setData(pages);
		res.setTotoalNum(totalPage);
		return res.toJsonString();
	}

	/**
	 * 
	 * @Description:修改用户离线时间
	 * @author songyanbiao
	 * @date 2016年8月23日 上午10:01:01
	 * @param
	 * @return
	 */
	@RequestMapping("updateUserOut")
	@ResponseBody
	public String updateUserOut(HttpSession session, @RequestParam String userName) {
		ExecuteResult res = new ExecuteResult();
		boolean falg = userServiceImpl.updateUserLogOff(userName);
		if (falg) {
			res.setCode(200);
			res.setMsg("故障维修成功");
		} else {
			res.setCode(201);
			res.setMsg("网络繁忙,请稍后重试");
		}
		return res.toJsonString();
	}

	/**
	 * 
	 * @Description:校验用户是否已经注册
	 * @author songyanbiao
	 * @date 2016年8月23日 下午1:35:16
	 * @param
	 * @return
	 */
	@RequestMapping("checkUser")
	@ResponseBody
	public String checkUser(@RequestParam String userName) {
		ExecuteResult res = new ExecuteResult();
		PortalUser portalUser = userserviceimpl.getIdByUserName(userName);
		if (portalUser == null) {
			res.setCode(200);
		} else {
			res.setCode(201);
			res.setMsg("该用户已注册");
		}
		return res.toJsonString();
	}

	/**
	 * 
	 * @Description:
	 * @author songyanbiao
	 * @date 2016年10月17日 下午5:35:49
	 * @param types
	 *            0代表在线用户,1代表注册用户,2代表付费用户,3代表注册未付费用户,4代表流失用户
	 * @return
	 * @throws ParseException
	 */
	@RequestMapping("checkNewJson")
	@ResponseBody
	public String checkNewJson(@RequestParam String times, @RequestParam int types, HttpSession session)
			throws ParseException {
		ExecuteResult res = new ExecuteResult();
		List<Map<String, Object>> ls = new ArrayList<>();
		CloudUser user = (CloudUser) session.getAttribute("user");
		int userId = user.getId();
		if (user.getUserName().equals("18292059695")) {
			switch (types) {
			case 0:
				ls = userServiceImpl.getOnlineAppUserList(0, "", userId, pageSize, 1, times, 1, session);
				break;
			case 1:
				ls = userServiceImpl.getUserInfoList(0, "", userId, pageSize, 1, times, 1);
				break;
			case 2:
				ls = userServiceImpl.getUserPayInfoList(0, "", userId, pageSize, 1, times, 1);
				break;
			case 3:
				ls = userServiceImpl.getUserNoPayList(0, "", userId, pageSize, 1, times, 1);
				break;
			case 4:
				ls = userServiceImpl.getRunOffUserList(0, userId, pageSize, 1, "", "", times, 1);
				break;
			}
			if (ls == null || ls.size() == 0) {
				res.setCode(0);
			} else {
				res.setCode(1);
			}

		} else {

			switch (types) {
			case 0:
				ls = userServiceImpl.getOnlineUserList(0, "", userId, pageSize, 1, times, 1);
				break;
			case 1:
				ls = userServiceImpl.getUserInfoList(0, "", userId, pageSize, 1, times, 1);
				break;
			case 2:
				ls = userServiceImpl.getUserPayInfoList(0, "", userId, pageSize, 1, times, 1);
				break;
			case 3:
				ls = userServiceImpl.getUserNoPayList(0, "", userId, pageSize, 1, times, 1);
				break;
			case 4:
				ls = userServiceImpl.getRunOffUserList(0, userId, pageSize, 1, "", "", times, 1);
				break;
			}
			if (ls == null || ls.size() == 0) {
				res.setCode(0);
			} else {
				res.setCode(1);
			}
		}
		return res.toJsonString();
	}

}
