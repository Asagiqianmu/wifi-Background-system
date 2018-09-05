package com.fxwx.controller;

import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fxwx.entity.CloudUser;
import com.fxwx.entity.IncomeCollect;
import com.fxwx.entity.UserBankInfo;
import com.fxwx.service.impl.SettlementRatioService;
import com.fxwx.service.impl.WithdrawServiceImpl;
import com.fxwx.util.ExecuteResult;
import com.fxwx.util.ExportExcelUtils;
import com.fxwx.util.SendMailUtil;

/**
 * 
 * Copyright (c) All Rights Reserved, 2016. 版权所有 dfgs Information Technology Co
 * .,Ltd
 * 
 * @Project newCloud
 * @File WithDrawController.java
 * @Date 2016年1月5日 下午5:18:59
 * @Author gyj
 */
@Controller
@RequestMapping("withDraw")
public class WithDrawController {
	@Resource(name = "withdrawServiceImpl")
	private WithdrawServiceImpl withdrawServiceImpl;
	@Resource(name = "settlementRatioService")
	private SettlementRatioService settlementRatioService;
	private int pageSize = 5;

	/**
	 * @Description 跳转到提现管理页面
	 * @return
	 */
	@RequestMapping("toWithDrawIndex")
	public String toWithDrawIndex(HttpSession session) {
		session.setAttribute("page", "/newstylejsp/withdraw/withdraw");
		return "index";
	}

	/**
	 * @Description 获得用户下的银行卡信息
	 * @param session
	 * @return
	 */
	@RequestMapping("getUserBankInfos")
	@ResponseBody
	public String getUserBankInfos(HttpSession session) {
		ExecuteResult er = new ExecuteResult();
		int userId = ((CloudUser) session.getAttribute("user")).getId();
		List<UserBankInfo> ub = withdrawServiceImpl.getUserBankInfos(userId);

		if (ub != null && ub.size() > 0) {
			for (int i = 0; i < ub.size(); i++) {
				if (ub.get(i).getBankDeposit() == null || ub.get(i).getBankDeposit().equals("")) {
					ub.get(i).setBankDeposit("支付宝");
				}
			}
			er.setCode(200);
			er.setData(ub);
			return er.toJsonString();
		} else {
			er.setCode(201);
			er.setMsg("暂无银行卡信息,请新添银行卡");
			return er.toJsonString();
		}
	}

	/********************** 新的提现方式 *****************************/

	/**
	 * 
	 * @Description:查询是否可以提现
	 * @author songyanbiao
	 * @date 2016年7月21日 下午5:17:03
	 * @param
	 * @return
	 */
	@RequestMapping("selCanWithDraw")
	@ResponseBody
	public String selCanWithDraw(HttpSession session) {
		CloudUser user = (CloudUser) session.getAttribute("user");
		ExecuteResult ex = withdrawServiceImpl.canWithdraw(user.getId(), session);
		return ex.toJsonString();
	}

	/**
	 * 
	 * @Description:商户点击提现
	 * @author songyanbiao
	 * @date 2016年7月21日 下午5:17:20
	 * @param
	 * @return
	 */
	@RequestMapping("getCanWithDraw")
	@ResponseBody
	public String getCanWithDraw(HttpSession session, @RequestParam BigDecimal withdrawMoney, @RequestParam String code,
			@RequestParam int bankNumId, HttpServletRequest request) {
		ExecuteResult ex = new ExecuteResult();
		CloudUser user = (CloudUser) session.getAttribute("user");
		IncomeCollect col = (IncomeCollect) session.getAttribute("col");
		Long withDrawTime = (Long) session.getAttribute("withDrawTime");
		Map<String, Object> map = new HashMap<>();
		Long oldTime = (Long) session.getAttribute("randCodeTime");
		String randCode = "";
		if (user.getWithdrawPhone().equals("")) {
			randCode = (String) session.getAttribute(user.getUserName());
		} else {
			randCode = (String) session.getAttribute(user.getWithdrawPhone());
		}
		if (code == null || "".equals(code)) {
			ex.setCode(205);
			ex.setMsg("验证码不能为空");
			return ex.toJsonString();
		}
		if (randCode == null || "".equals(randCode)) {
			ex.setCode(206);
			ex.setMsg("验证码与提现手机不匹配");
			return ex.toJsonString();
		}
		if (!randCode.equals(code)) {
			ex.setCode(207);
			ex.setMsg("验证码错误");
			return ex.toJsonString();
		}
		boolean checkResult = withdrawServiceImpl.checkUserCode(code, oldTime, randCode);
		if (checkResult) {
			request.getSession().removeAttribute(user.getWithdrawPhone());
			request.getSession().removeAttribute("randCodeTime");
		} else {
			ex.setCode(208);
			ex.setMsg("验证码失效，请重新获取");
			request.getSession().removeAttribute(user.getWithdrawPhone());
			request.getSession().removeAttribute("randCodeTime");
			return ex.toJsonString();
		}
		if (col == null) {
			ex.setCode(201);
			ex.setMsg("数据丢失请重新登录");
			return ex.toJsonString();
		}
		if (!withdrawServiceImpl.checkAccount(user.getId(), withdrawMoney)) {
			ex.setCode(209);
			ex.setMsg("未达到提现要求");
			return ex.toJsonString();
		}
		;
		if (col.getPlatformIncome().compareTo(withdrawMoney) != 0) {
			ex.setCode(202);
			ex.setMsg("申请提现金额校验不一致");
			return ex.toJsonString();
		}
		UserBankInfo ub = withdrawServiceImpl.getUserBankInfoById(user.getId(), bankNumId);
		if (ub == null) {
			ex.setCode(203);
			ex.setMsg("银行卡不存在");
			return ex.toJsonString();
		}

		map.put("col", col);
		boolean res = withdrawServiceImpl.getUserWithdraw(user.getId(), withdrawMoney, map, ub.getBankcarNum(),
				withDrawTime);
		if (res) {
			SendMailUtil.sendMail(801);
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			ex.setCode(200);
			ex.setData(sdf.format(withDrawTime));
			return ex.toJsonString();
		} else {
			ex.setCode(204);
			ex.setMsg("服务器忙,请稍后重试");
			return ex.toJsonString();
		}
	}

	/**
	 * 
	 * @Description:商户获取所有提现记录
	 * @author songyanbiao
	 * @date 2016年7月25日 下午5:03:49
	 * @param
	 * @return
	 */
	@RequestMapping("selUserAllDraw")
	@ResponseBody
	public String selUserAllDraw(@RequestParam(defaultValue = "") String startTime,
			@RequestParam(defaultValue = "") String endTime, @RequestParam int curPage,
			@RequestParam(defaultValue = "") String status, HttpSession session) {
		ExecuteResult ex = new ExecuteResult();
		CloudUser user = (CloudUser) session.getAttribute("user");
		List<Map<String, Object>> ls = withdrawServiceImpl.getWithdrawTable(user.getId(), startTime, endTime, curPage,
				pageSize, status);
		if (ls.size() != 0) {
			ex.setCode(200);
			ex.setData(ls);
		} else {
			ex.setCode(201);
		}
		return ex.toJsonString();
	}

	/**
	 * 
	 * @Description:商户点击确认提现,申诉，确认已支付修改状态
	 * @author songyanbiao
	 * @date 2016年7月25日 下午3:36:02
	 * @param
	 * @return
	 */
	@RequestMapping("userAgree")
	@ResponseBody
	public String userAgree(@RequestParam String accountId, @RequestParam String status,
			@RequestParam(defaultValue = "") String content) {
		ExecuteResult ex = new ExecuteResult();
		boolean result = withdrawServiceImpl.updateUserAgree(accountId, status, content);
		if (result) {
			if (status.equals("806")) {
				SendMailUtil.sendMail(806);
			}
			ex.setCode(200);
		} else {
			ex.setCode(201);
		}
		return ex.toJsonString();
	}

	/**
	 * 
	 * @Description:根据工单号查询所有修改的金额记录
	 * @author songyanbiao
	 * @date 2016年7月25日 下午4:47:42
	 * @param
	 * @return
	 */
	@RequestMapping("getChangeAccount")
	@ResponseBody
	public String getChangeAccount(@RequestParam String accountId) {
		ExecuteResult result = new ExecuteResult();
		result.setCode(200);
		result.setData(withdrawServiceImpl.getChange(accountId));
		return result.toJsonString();
	}

	/**
	 * 
	 * @Description:获取总页数
	 * @author songyanbiao
	 * @date 2016年7月26日 下午4:24:02
	 * @param
	 * @return
	 */
	@RequestMapping("getPageCount")
	@ResponseBody
	public String getPageCount(HttpSession session, @RequestParam(defaultValue = "") String startTime,
			@RequestParam(defaultValue = "") String endTime, @RequestParam(defaultValue = "") String status)
			throws ParseException {
		ExecuteResult result = new ExecuteResult();
		CloudUser user = (CloudUser) session.getAttribute("user");
		int pagecount = withdrawServiceImpl.getPageCount(user.getId(), startTime, endTime, status);
		int totalPageNum = (pagecount % pageSize) > 0 ? (pagecount / pageSize + 1) : pagecount / pageSize;
		result.setData(totalPageNum);
		return result.toJsonString();
	}

	/**
	 * 
	 * @Description:获取商户的账户流水
	 * @author songyanbiao
	 * @date 2016年8月3日 下午12:00:02
	 * @param
	 * @return
	 */
	@RequestMapping("getWithDrawFlow")
	@ResponseBody
	public String getWithDrawFlow(HttpSession session, @RequestParam(defaultValue = "") String startTime,
			@RequestParam(defaultValue = "") String endTime, @RequestParam int curPage) throws ParseException {
		ExecuteResult result = new ExecuteResult();
		CloudUser user = (CloudUser) session.getAttribute("user");
		List<Map<String, Object>> ls = withdrawServiceImpl.getAccount(user.getId(), startTime, endTime, curPage,
				pageSize);
		if (ls.size() != 0) {
			result.setCode(200);
			result.setData(ls);
		} else {
			result.setCode(201);
		}
		return result.toJsonString();
	}

	/**
	 * 
	 * @Description:导出商户账户流水明细下载excle
	 * @author songyanbiao
	 * @date 2016年7月27日 上午9:38:36
	 * @param
	 * @return
	 */
	@RequestMapping("importExcle")
	public void importExcle(HttpSession session, @RequestParam String startTime, @RequestParam String endTime,
			HttpServletRequest request, HttpServletResponse response) {
		CloudUser user = (CloudUser) session.getAttribute("user");
		List ls = withdrawServiceImpl.getDrawExcle(user.getId(), startTime, endTime);
		ExportExcelUtils excel = new ExportExcelUtils();
		String[] title = { "场所名称", "缴费用户", "创建时间", "支付类型", "购买数量", "收费类型", "缴费金额(元)", };
		excel.exportExcel("账期流水明细.xls", title, ls, response, request);
	}

}
