package com.fxwx.controller;

import java.io.InputStream;
import java.math.BigDecimal;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.nutz.json.Json;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fxwx.bean.CloudUserAccount;
import com.fxwx.bean.FinanceBean;
import com.fxwx.bean.FinanceRecord;
import com.fxwx.bean.SettlementAuditBean;
import com.fxwx.bean.WithdrawDetailBean;
import com.fxwx.entity.CloudSite;
import com.fxwx.entity.CloudUser;
import com.fxwx.service.impl.DataStatisticsImpl;
import com.fxwx.service.impl.SettlementRatioService;
import com.fxwx.service.impl.UserAllSiteDataStatisticsImpl;
import com.fxwx.service.impl.UserServiceImpl;
import com.fxwx.service.impl.WithdrawServiceImpl;
import com.fxwx.util.CommonExportExcelImpl;
import com.fxwx.util.DateUtil;
import com.fxwx.util.ExcelSheetVO;
import com.fxwx.util.ExecuteResult;
import com.fxwx.util.ExportExcelUtils;
import com.fxwx.util.OssManage;
import com.fxwx.util.ReflectUtil;
import com.fxwx.util.StringUtils;

/*
 * 财务结算比例
 */
@RequestMapping("SettlementRatio")
@Controller
@SuppressWarnings("all")
public class SettlementRatioController {
	@Autowired
	private SettlementRatioService ratioService;
	@Autowired
	private UserServiceImpl userService;
	@Autowired
	private WithdrawServiceImpl withdrawServiceImpl;
	@Autowired
	private DataStatisticsImpl dataStatisticsImpl;
	@Autowired
	private UserAllSiteDataStatisticsImpl userAllSiteDataStatisticsImpl;
	
	
	private int pagenum = 5;

	/**
	 * 
	 * @Description:跳转财务页面
	 * @author songyanbiao
	 * @date 2016年7月19日 下午5:12:00
	 * @param
	 * @return
	 */
	@RequestMapping("jumpFance")
	public String jumpFance() {
		return "/finance/finance";
	}

	@RequestMapping("getPageHtml")
	public String getPageHtml() {
		return "/finance/settle";
	}

	@RequestMapping("getAccount")
	public String getAccount() {
		return "/finance/fDateSelect";
	}

	@RequestMapping("getAgency")
	public String getAgency() {
		return "/finance/agency";
	}

	@RequestMapping("getTotalIncome")
	public String getTotalIncome() {
		return "/finance/totals";
	}

	@RequestMapping("getSiftings")
	public String getSiftings() {
		return "/finance/siftings";
	}

	/**
	 * 结算审核 --- 未审核
	 */
	@RequestMapping("getSettlement")
	@ResponseBody
	public String getSettlement(int status, int page) {
		List<SettlementAuditBean> auditbeans = ratioService.getOrderList(
				status, page, pagenum);
		ExecuteResult result = new ExecuteResult();
		result.setCode(200);
		result.setData(auditbeans);
		result.setTotoalNum(auditbeans.size());
		return result.toJsonString();
	}

	/**
	 * 数据总页数
	 */
	@RequestMapping("getPageCount")
	@ResponseBody
	public String getPageCount(@RequestParam(defaultValue = "0") int status,
			@RequestParam(defaultValue = "") String userName,
			HttpSession session) {
		int pagecount = ratioService.getPageCount(status, userName);
		int totalPageNum = (pagecount % pagenum) > 0 ? (pagecount / pagenum + 1)
				: pagecount / pagenum;
		ExecuteResult result = new ExecuteResult();
		if (status == 0) {
			if (totalPageNum != 0) {
				result.setCode(200);
				result.setData(totalPageNum);
			} else {
				result.setCode(201);
			}
		} else {
			result.setCode(200);
			result.setData(totalPageNum);
		}
		return result.toJsonString();
	}

	/**
	 * 更新应结算总金额
	 */
	@RequestMapping("saveTotalAmount")
	@ResponseBody
	public String UpdateTotalAmount(BigDecimal money, String acctId,
			String data, BigDecimal bfMoney) {
		List<FinanceRecord> listfinance = Json.fromJsonAsList(
				FinanceRecord.class, data.toString());
		for (int i = 0; i < listfinance.size(); i++) {
			FinanceRecord financeRecord = listfinance.get(i);
			InputStream baseInputOne = null;
			InputStream baseInputTwo = null;
			if (!financeRecord.getImgBase1().equals("")) {
				baseInputOne = StringUtils.getInputStream(financeRecord
						.getImgBase1());
			}
			if (!financeRecord.getImgBase2().equals("")
					&& financeRecord.getImgBase2().length() > 20) {
				baseInputTwo = StringUtils.getInputStream(financeRecord
						.getImgBase2());
			}
			OssManage oss = new OssManage();
			// 文件以时间命名
			if (baseInputOne != null) {
				try {
					String names = DateUtil.getStringDateForName(new Date());
					String fileUrl = "financial_pic/" + acctId + "/" + names
							+ "01.jpg";
					String isOk = oss.uploadFile(baseInputOne, fileUrl,
							"image/jpeg");
					if (isOk != null) {
						listfinance.get(i).setImgBase1(fileUrl);
					} else {
						listfinance.get(i).setImgBase1("");
					}
				} catch (Exception e) {
				}
			}
			if (baseInputTwo != null) {
				try {
					String names = DateUtil.getStringDateForName(new Date());
					String fileUrl2 = "financial_pic/" + acctId + "/" + names
							+ "02.jpg";
					String isOk = oss.uploadFile(baseInputTwo, fileUrl2,
							"image/jpeg");
					if (isOk != null) {
						listfinance.get(i).setImgBase2(fileUrl2);
					} else {
						listfinance.get(i).setImgBase2("");
					}
				} catch (Exception e) {
				}
			}
		}
		ExecuteResult result = new ExecuteResult();
		result.setCode(200);
		ratioService.updateAcctlog(money, acctId, listfinance, bfMoney);
		result.setMsg("修改成功！");
		return result.toJsonString();
	}

	/**
	 * 获取场所金额及结算配置
	 */
	@RequestMapping("getCommonMoney")
	@ResponseBody
	public String getCommonMoney() {
		ExecuteResult result = new ExecuteResult();
		result.setCode(200);
		result.setData(ratioService.selectSettlement());
		return result.toJsonString();
	}

	/**
	 * 修改用户提现最低金额和结算周期
	 */
	@RequestMapping("saveCommonMoney")
	@ResponseBody
	public String saveCommonMoney(String money, String timeday) {
		ExecuteResult result = new ExecuteResult();
		result.setCode(200);
		result.setData(ratioService.saveSettlementlimit(money, timeday));
		return result.toJsonString();
	}

	/**
	 * 修改审核状态
	 */
	@RequestMapping("saveOrderStatus")
	@ResponseBody
	public String saveOrderStatus(int status, String acctoudID) {
		int newStatus = 0;
		ExecuteResult result = new ExecuteResult();
		result.setCode(200);
		switch (status) {
		case 801:
			newStatus = 803;//到底是802还是803具体的注释也没有
			break;
		case 806:
			newStatus = 807;
			break;
		default:
			return result.toJsonString();
		}

		result.setData(ratioService.updateAcctStatus(status, acctoudID,
				newStatus));
		return result.toJsonString();
	}

	/**
	 * 提交工单支付序号凭证
	 */
	@RequestMapping("saveOrderEvidence")
	@ResponseBody
	public String saveOrderEvidence(@RequestParam String paytype,
			@RequestParam String account_from, @RequestParam String account_id) {
		ExecuteResult result = new ExecuteResult();
		result.setCode(200);
		result.setData(ratioService.updatePayProof(account_from, account_id));
		return result.toJsonString();
	}

	/**
	 * 查询工单所有的金额修改凭证
	 */
	@RequestMapping("getOrderEvidence")
	@ResponseBody
	public String getOrderEvidence(String account_id) {
		ExecuteResult result = new ExecuteResult();
		result.setCode(200);
		result.setData(ratioService.selectFinanceRecord(account_id));
		return result.toJsonString();
	}

	/**
	 * 获取修改金额的费用类型
	 */
	@RequestMapping("getMoneyType")
	@ResponseBody
	public String getMoneyType() {
		ExecuteResult result = new ExecuteResult();
		result.setCode(200);
		result.setData(ratioService.getResonType());
		return result.toJsonString();
	}

	/**
	 * 提现记录查询
	 * 
	 * @Description: TODO
	 * @param status
	 * @param page
	 * @return
	 * @throws ParseException
	 * @Date 2016年7月14日 下午5:02:16
	 * @Author cuimiao
	 */
	@RequestMapping("getWithdrawList")
	@ResponseBody
	public String getWithdrawList(
			@RequestParam(defaultValue = "1") int pageIndex,
			@RequestParam(defaultValue = "") String userId,
			@RequestParam(defaultValue = "") String startDate,
			@RequestParam(defaultValue = "") String endDate)
			throws ParseException {
		// pageIndex ++;
		List<SettlementAuditBean> withdrawBeans = ratioService.getWithdrawList(
				pageIndex, userId, startDate, endDate, pagenum);
		ExecuteResult result = new ExecuteResult();
		result.setCode(200);
		result.setData(withdrawBeans);
		result.setTotoalNum(withdrawBeans.size());
		return result.toJsonString();
	}

	/**
	 * 提现记录查询
	 * 
	 * @Description: TODO
	 * @param status
	 * @param page
	 * @return
	 * @Date 2016年7月14日 下午5:02:16
	 * @Author cuimiao
	 */
	@RequestMapping("getWithdrawInfo")
	@ResponseBody
	public String getWithdrawInfo(
			@RequestParam(defaultValue = "-1") String userId) {
		Map<String, Object> withdrawMap = ratioService.getWithdrawInfo(userId);
		ExecuteResult result = new ExecuteResult();
		result.setCode(200);
		result.setData(withdrawMap);
		return result.toJsonString();
	}

	@RequestMapping("getWithdrawPageNum")
	@ResponseBody
	public String getWithdrawPageNum(
			@RequestParam(defaultValue = "") String userId,
			@RequestParam(defaultValue = "") String startDate,
			@RequestParam(defaultValue = "") String endDate)
			throws ParseException {
		int pageNum = ratioService.getWithdrawPageNum(userId, startDate,
				endDate);
		int totalPageNum = (pageNum % pagenum) > 0 ? (pageNum / pagenum + 1)
				: pageNum / pagenum;
		ExecuteResult result = new ExecuteResult();
		result.setCode(200);
		result.setData(totalPageNum);
		return result.toJsonString();
	}

	@RequestMapping("getWithdrawDetail")
	@ResponseBody
	public void getWithdrawDetail(
			@RequestParam(defaultValue = "-1") int userId,
			@RequestParam String startDate, @RequestParam String endDate,
			HttpServletRequest request, HttpServletResponse response) {
		ReflectUtil reflectUtil = new ReflectUtil();
		List<Map<String, Object>> withdrawList = ratioService
				.getWithdrawDetail(userId, startDate, endDate);
		List<Object> beanList = new ArrayList<Object>();
		for (int i = 0; i < withdrawList.size(); i++) {
			WithdrawDetailBean bean = new WithdrawDetailBean();
			reflectUtil.mapToBean(bean, withdrawList.get(i));
			beanList.add(bean);
		}
		ExportExcelUtils excel = new ExportExcelUtils();
		String[] title = { "缴费金额", "场所名称", "缴费用户", "收费类型", "购买数量", "支付类型",
				"创建时间" };

		// if(withdrawList!=null&&withdrawList.size()>0){
		excel.exportExcel("账单详情.xls", title, beanList, response, request);
		// }
	}

	/**
	 * 
	 * @Description:获取商户结算比例
	 * @author songyanbiao
	 * @date 2016年7月14日 下午3:30:44
	 * @param
	 * @return
	 */
	@RequestMapping("getUserRadiao")
	@ResponseBody
	public String getUserRadiao(@RequestParam int curPage,
			@RequestParam(defaultValue = "") String userName) throws Exception {
		ExecuteResult result = new ExecuteResult();
		List<CloudUserAccount> ls = ratioService.getUserList(curPage, pagenum,
				userName);
		if (ls.size() == 0) {
			result.setCode(201);
		} else {
			result.setCode(200);
			result.setData(ls);
		}
		return result.toJsonString();
	}

	/**
	 * 
	 * @Description:保存商户手续比例
	 * @author songyanbiao
	 * @date 2016年7月14日 下午3:32:21
	 * @param
	 * @return
	 */
	@RequestMapping("saveUserRatio")
	@ResponseBody
	public String saveUserRatio(@RequestParam(defaultValue = "") String userId,
			@RequestParam String radiao) {
		ExecuteResult result = new ExecuteResult();
		String[] names = {};
		// 如果namse为空则认为更改全部用户比例
		if (!userId.equals("")) {
			names = userId.split(",");
		}
		boolean isOk = ratioService.updateChoiceAgent(names, radiao);
		if (isOk) {
			result.setCode(200);
		}
		return result.toJsonString();
	}

	/**
	 * 
	 * @Description:获取商户配置收费比例
	 * @author songyanbiao
	 * @date 2016年7月19日 下午5:12:22
	 * @param
	 * @return
	 */
	@RequestMapping("getRatioConfig")
	@ResponseBody
	public String getRatioConfig() {
		ExecuteResult result = new ExecuteResult();
		String ratio = ratioService.getRatioConfig();
		if (!"".equals(ratio)) {
			result.setCode(200);
			result.setData(ratio);
		} else {
			result.setCode(201);
		}
		return result.toJsonString();
	}

	/**
	 * 
	 * @Description:获取账期明细
	 * @author songyanbiao
	 * @date 2016年9月19日 上午10:39:05
	 * @param
	 * @return
	 */
	@RequestMapping("importExcle")
	public void importExcle(HttpSession session,
			@RequestParam String startTime, @RequestParam String endTime,
			@RequestParam String userName, HttpServletRequest request,
			HttpServletResponse response) {
		CloudUser cUser = userService.getCloudUserByTelphone(userName);
		if (cUser != null) {
			List ls = withdrawServiceImpl.getDrawExcle(cUser.getId(),
					startTime, endTime);
			ExportExcelUtils excel = new ExportExcelUtils();
			String[] title = { "场所名称", "缴费用户", "创建时间", "支付类型", "购买数量", "收费类型",
					"缴费金额(元)", };
			excel.exportExcel("账期流水明细.xls", title, ls, response, request);
		}
	}

	/**
	 * @Description 获得昨天今天的收入
	 * @date 2016年9月22日下午4:02:26
	 * @author guoyingjie
	 * @return
	 */
	@RequestMapping("getYesTodincome")
	@ResponseBody
	public String getYesTodincome(
			@RequestParam(defaultValue = "-2") int siteId,
			@RequestParam(defaultValue = "") String agentName,
			@RequestParam String startTime,
			@RequestParam String endTime
			) {
		ExecuteResult result = new ExecuteResult();
		Map map = ratioService.getTotalIncome(siteId, agentName,startTime,endTime);
		result.setCode(200);
		result.setData(map);
		return result.toJsonString();
	}
 
	/**
	 * @Description 根据代理商账号获得所有的场所
	 * @date 2016年9月30日上午10:19:24
	 * @author guoyingjie
	 * @param username
	 * @return
	 */
	@RequestMapping("getCloudSiteByName")
	@ResponseBody
	public String getCloudSiteByName(@RequestParam String username) {
		ExecuteResult result = new ExecuteResult();
		List<CloudSite> clouds = ratioService.getSiteListByName(username);
		if (clouds.size() > 0 && clouds != null && clouds.get(0) != null) {
			result.setCode(200);
			result.setData(clouds);
		} else {
			result.setCode(201);
		}
		return result.toJsonString();
	}

	/**
	 * @Description 财务明细查询
	 * @date 2016年10月9日上午11:13:36
	 * @author guoyingjie
	 * @param siteId
	 * @param username
	 * @param paytype
	 * @param startTime
	 * @param endTime
	 * @param curpage
	 * @param pagesize
	 * @return
	 */
	@RequestMapping("getIncomeByType")
	@ResponseBody
	public String getIncomeByType(@RequestParam int siteId,
			@RequestParam(defaultValue = "") String username,
			@RequestParam(defaultValue = "1") int paytype,
			@RequestParam(defaultValue = "") String startTime,
			@RequestParam(defaultValue = "") String endTime,
			@RequestParam(defaultValue = "1") int curpage,
			@RequestParam(defaultValue = "5") int pagesize) {
		ExecuteResult result = new ExecuteResult();
		List<FinanceBean> list = ratioService.getIncomeByType(siteId, username,
				paytype, startTime, endTime, curpage, pagesize);
		if (list.size() > 0 && list != null) {
			result.setCode(200);
			result.setData(list);
		} else {
			result.setCode(201);
		}
		return result.toJsonString();
	}

	/**
	 * @Description 财务明细查询分页
	 * @date 2016年10月9日下午1:10:08
	 * @author guoyingjie
	 * @param siteId
	 * @param username
	 * @param paytype
	 * @param startTime
	 * @param endTime
	 * @param pagesize
	 * @return
	 */
	@RequestMapping("getIncomeByTypePage")
	@ResponseBody
	public String getIncomeByTypePage(@RequestParam int siteId,
			@RequestParam(defaultValue = "") String username,
			@RequestParam(defaultValue = "1") int paytype,
			@RequestParam(defaultValue = "") String startTime,
			@RequestParam(defaultValue = "") String endTime,
			@RequestParam(defaultValue = "5") int pagesize) {
		ExecuteResult result = new ExecuteResult();
		try {
			int totalPage = ratioService.getIncomeByTypePage(siteId, username,
					paytype, startTime, endTime, pagesize);
			result.setCode(200);
			result.setData(totalPage);
		} catch (Exception e) {
			result.setCode(201);
		}
		return result.toJsonString();
	}

	/***
	 * @Description 导出明细
	 * @date 2016年10月9日下午3:38:44
	 * @author guoyingjie
	 * @param siteId
	 * @param username
	 * @param paytype
	 * @param startTime
	 * @param endTime
	 * @return
	 */
	@RequestMapping("exportIncomeByType")
	public String exportIncomeByType(HttpServletResponse response,
			@RequestParam int siteId,
			@RequestParam(defaultValue = "") String username,
			@RequestParam(defaultValue = "1") int paytype,
			@RequestParam(defaultValue = "") String startTime,
			@RequestParam(defaultValue = "") String endTime) {
		ExecuteResult result = new ExecuteResult();
		CommonExportExcelImpl s2 = new CommonExportExcelImpl();
		List<ExcelSheetVO> sheetList = new ArrayList<ExcelSheetVO>();
		ExcelSheetVO ec = new ExcelSheetVO();
		try {
			List<FinanceBean> list = ratioService.exportIncomeByType(siteId,
					username, paytype, startTime, endTime);
			List<List<String>> sheet = new ArrayList<>();
			for (int i = 0; i < list.size(); i++) {
				List<String> list1 = new ArrayList();
				FinanceBean bean = (FinanceBean) list.get(i);
				list1.add(bean.getUser_name() + "");
				list1.add(bean.getSite_name() + "");
				list1.add(bean.getParam_json() + "");
				list1.add(bean.getPay_type() + "");
				list1.add(bean.getFinish_time() + "");
				sheet.add(list1);
			}
			List<String> tile = new ArrayList<>();
			tile.add("用户名");
			tile.add("场所");
			tile.add("充值金额(元)");
			tile.add("支付方式");
			tile.add("充值时间");
			ec.setDataList(sheet);
			ec.setSheetName("支付方式明细");
			ec.setTitleList(tile);
			sheetList.add(ec);
			s2.createExcel("支付方式明细.xls", sheetList, response);
		} catch (Exception e) {
		}
		return null;
	}

	/**
	 * @Description 获得各种比例
	 * @date 2016年10月11日下午4:38:07
	 * @author guoyingjie
	 * @param userName
	 * @param startTime
	 * @param endTime
	 * @return
	 */
	@RequestMapping("getOtherBili")
	@ResponseBody
	public String getOtherBili(@RequestParam String username,
			@RequestParam String startTime, @RequestParam String endTime) {
		ExecuteResult result = new ExecuteResult();
		try {
			List<Map> list = ratioService.getTiCuntAndSiteIncome(username,
					startTime, endTime);
			String payBili = ratioService.getPayResterBili(username, startTime,
					endTime);
			String uvbili = ratioService
					.getUvBili(username, startTime, endTime);
			Map map = new HashMap<>();
			map.put("payBili", payBili);
			map.put("uvbili", uvbili);
			list.add(map);
			result.setCode(200);
			result.setData(list);
		} catch (Exception e) {
			result.setCode(201);
		}
		return result.toJsonString();
	}

	/**
	 * 分页查询代理商信息
	 * 
	 * @Description: TODO
	 * @param username
	 * @param realname
	 * @return
	 * @Date 2016年10月28日 下午2:56:31
	 * @Author liuzhao
	 */
	@RequestMapping("queryByNameOrTel")
	@ResponseBody
	public String queryByNameOrTel(
			@RequestParam(defaultValue = "") int currentPage,
			@RequestParam(defaultValue = "") String username,
			@RequestParam(defaultValue = "") String realname) {
		int pageNum = 5;
		ExecuteResult result = new ExecuteResult();
		// 每页显示的数据
		List<Map<String, Object>> list = ratioService.queryByNameOrTel(
				currentPage, username, realname, pageNum);
		// 总条数
		// int totalCount = ratioService.getTotalCount( username, realname);
		// // 总页数
		// int totoalNum = (int) Math.ceil(totalCount * 1.0 / pageNum);
		if (list == null) {
			result.setCode(201);
		} else if (list.size() == 0) {
			result.setCode(202);
		} else {
			result.setCode(200);
		//	getTotalPage(currentPage, realname,username);
		//	result.setTotoalNum();
			result.setData(list);
		}
		System.out.println(result.toJsonString());
		return result.toJsonString();

	}

	/**
	 * 获得总页数
	 * 
	 * @return
	 */
	@RequestMapping("getTotalPage")
	@ResponseBody
	public String getTotalPage(
			@RequestParam(defaultValue = "") int currentPage,
			@RequestParam(defaultValue = "") String username,
			@RequestParam(defaultValue = "") String realname) {
		int pageNum = 5;
		ExecuteResult result = new ExecuteResult();
		// int userId=((CloudUser)session.getAttribute("user")).getId();
		// 总条数
		int totalCount = ratioService.getTotalCount(username, realname);
		// int totoalNum=siteIncomeInfoServiceImpl.getSiteNum(userId, siteId,
		// startDate, endDate,payName,userName,pageSize);
		// 总页数
		int totoalNum = (int) Math.ceil(totalCount * 1.0 / pageNum);
		result.setTotoalNum(totoalNum);
		result.setCode(200);
		return result.toJsonString();
	}
	
	/**
	 * @Description  获得时间段内线上线下总收入
	 * @date 2016年12月12日下午5:25:31
	 * @author guoyingjie
	 * @param siteId
	 * @param startTime
	 * @param endTime
	 * @throws ParseException 
	 */
	@RequestMapping("getOffLineTotal")
	@ResponseBody
	public String getOffLineTotal(@RequestParam String siteId,@RequestParam String startTime,@RequestParam String endTime) throws ParseException{
		List list = new LinkedList();
		ExecuteResult result = new ExecuteResult();
		try {
			List<Map<String, Object>> totalList= dataStatisticsImpl.getQueryInCome(siteId, startTime, endTime);
			List<Map<String, Object>> offList = dataStatisticsImpl.getSiteOffInCome(siteId, startTime, endTime);
			List<Map<String, Object>> lineList = dataStatisticsImpl.getSiteLineInCome(siteId, startTime, endTime);
			list.add(totalList);
			list.add(offList);
			list.add(lineList);
			result.setCode(200);
			result.setData(list);
		} catch (Exception e) {
			result.setCode(201);
		}
		System.out.println(result.toJsonString());
		return result.toJsonString();
	}
	/**
	 * @Description  获得时间段内线上线下总收入
	 * @date 2016年12月12日下午5:25:31
	 * @author guoyingjie
	 * @param siteId
	 * @param startTime
	 * @param endTime
	 * @throws ParseException 
	 */
	@RequestMapping("getOffLineTotalMonth")
	@ResponseBody
	public String getOffLineTotalMonth(@RequestParam String siteId,@RequestParam String year) throws ParseException{
		List list = new LinkedList();
		ExecuteResult result = new ExecuteResult();
		try {
			List<Map<String, Object>> totalList= dataStatisticsImpl.getMonthlyIncome(siteId,year);
			List<Map<String, Object>> offList = dataStatisticsImpl.getOffMonthlyIncome(siteId, year);
			List<Map<String, Object>> lineList = dataStatisticsImpl.getLineMonthlyIncome(siteId,year);
			list.add(totalList);
			list.add(offList);
			list.add(lineList);
			result.setCode(200);
			result.setData(list);
		} catch (Exception e) {
			result.setCode(201);
		}
		System.out.println(result.toJsonString());
		return result.toJsonString();
	}
	
	/**
	 * @Description  获得时间段内线上线下总收入
	 * @date 2016年12月12日下午5:25:31
	 * @author guoyingjie
	 * @param siteId
	 * @param startTime
	 * @param endTime
	 * @throws ParseException 
	 */
	@RequestMapping("getAllOffLineTotal")
	@ResponseBody
	public String getAllOffLineTotal(@RequestParam String agentName,@RequestParam String startTime,@RequestParam String endTime) throws ParseException{
		List list = new LinkedList();
		ExecuteResult result = new ExecuteResult();
		try {
			CloudUser user = userService.getCloudUserByTelphone(agentName);
			List<Map<String, Object>> totalList= userAllSiteDataStatisticsImpl.getAllSiteOfInCome(user.getId(), startTime, endTime);
			List<Map<String, Object>> offList = userAllSiteDataStatisticsImpl.getAllSiteOffInCome(user.getId(), startTime, endTime);
			List<Map<String, Object>> lineList = userAllSiteDataStatisticsImpl.getAllSiteLineInCome(user.getId(), startTime, endTime);
			list.add(totalList);
			list.add(offList);
			list.add(lineList);
			result.setCode(200);
			result.setData(list);
		} catch (Exception e) {
			result.setCode(201);
		}
		System.out.println(result.toJsonString());
		return result.toJsonString();
	}
	/**
	 * @Description  获得时间段内线上线下总收入
	 * @date 2016年12月12日下午5:25:31
	 * @author guoyingjie
	 * @param siteId
	 * @param startTime
	 * @param endTime
	 * @throws ParseException 
	 */
	@RequestMapping("getAllOffLineTotalMonth")
	@ResponseBody
	public String getAllOffLineTotalMonth(@RequestParam String agentName,@RequestParam String year) throws ParseException{
		List list = new LinkedList();
		ExecuteResult result = new ExecuteResult();
		try {
			CloudUser user = userService.getCloudUserByTelphone(agentName);
			List<Map<String, Object>> totalList= userAllSiteDataStatisticsImpl.getAllSiteMonthlyIncome(user.getId(),year);
			List<Map<String, Object>> offList = userAllSiteDataStatisticsImpl.getAllSiteMonthOffIncome(user.getId(), year);
			List<Map<String, Object>> lineList = userAllSiteDataStatisticsImpl.getAllSiteMonthLineIncome(user.getId(),year);
			list.add(totalList);
			list.add(offList);
			list.add(lineList);
			result.setCode(200);
			result.setData(list);
		} catch (Exception e) {
			result.setCode(201);
		}
		System.out.println(result.toJsonString());
		return result.toJsonString();
	}
	/**
	 * @Description  一句话描述此方法的功能
	 * @date 2016年12月13日下午1:49:49
	 * @author guoyingjie
	 * @param agentName
	 * @param siteId
	 * @param startTime
	 * @param endTime
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping("exportExcelSite")
	public String exportExcel(
			@RequestParam(defaultValue="") int siteId,
			@RequestParam String startTime,
			@RequestParam String endTime,HttpServletRequest request,HttpServletResponse response){
		try {
			dataStatisticsImpl.exportExcels(startTime, endTime,siteId, request, response);
		} catch (Exception e) {
		}
		return null;
	}
	@RequestMapping("exportExcelM")
	public String exportExcelM(
			@RequestParam(defaultValue="") int siteId,
			@RequestParam String year,HttpServletRequest request,HttpServletResponse response){
		try {
			dataStatisticsImpl.exportExcelM(year,siteId, request, response);
		} catch (Exception e) {
		}
		return null;
	}
	
	/**
	 * @Description  一句话描述此方法的功能
	 * @date 2016年12月13日下午1:49:49
	 * @author guoyingjie
	 * @param agentName
	 * @param siteId
	 * @param startTime
	 * @param endTime
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping("exportExcelAll")
	public String exportExcel(@RequestParam(defaultValue="") String agentName,
			@RequestParam String startTime,
			@RequestParam String endTime,HttpServletRequest request,HttpServletResponse response){
		try {
			dataStatisticsImpl.exportExcels(startTime, endTime, agentName, request, response);
		} catch (Exception e) {
		}
		return null;
	}
	
	@RequestMapping("exportExcelAM")
	public String exportExcelAM(@RequestParam(defaultValue="") String agentName,
			@RequestParam String year,HttpServletRequest request,HttpServletResponse response){
		try {
			dataStatisticsImpl.exportExcelAM(year, agentName, request, response);
		} catch (Exception e) {
		}
		return null;
	}
	
}
