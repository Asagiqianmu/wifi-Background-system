package com.fxwx.controller;

import java.text.DecimalFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fxwx.entity.CloudSite;
import com.fxwx.entity.CloudUser;
import com.fxwx.entity.UserTotalTimeHave;
import com.fxwx.service.impl.CloudSiteServiceImpl;
import com.fxwx.service.impl.SiteCustomerInfoServiceImpl;
import com.fxwx.service.impl.SitePriceConfigServiceImpl;
import com.fxwx.service.impl.UserAllSiteDataStatisticsImpl;
import com.fxwx.service.impl.UserServiceImpl;
import com.fxwx.util.DateUtil;
import com.fxwx.util.ExecuteResult;

@Controller
@RequestMapping(value = "allSiteOfReportStatistics")
public class AllSiteOfReportStatisticsController {

	@Autowired
	public UserAllSiteDataStatisticsImpl userAllSiteDataStatisticsImpl;

	@Autowired
	public SitePriceConfigServiceImpl sitePriceConfigServiceImpl;

	@Autowired
	private SiteCustomerInfoServiceImpl siteCustomerInfoServiceImpl;

	@Autowired
	public UserServiceImpl userServiceImpl;

	@Autowired
	public CloudSiteServiceImpl cloudsiteserviceimpl;
	
	
	@RequestMapping("index")
	public String toManageIndex(HttpSession session, Model model) {
		CloudUser user = (CloudUser) session.getAttribute("user");
		int userId = user.getId();
		List<Map<String, Object>> list = null;
		String userNamePA = session.getAttribute("userNamePA").toString();
		if (user.getUserName().equals(userNamePA)) {
			CloudUser cu = userServiceImpl.getCloudUserByTelphone("15810954539");
			list = sitePriceConfigServiceImpl.getAppUserSiet(cu.getId());
			session.setAttribute("masterAccount", cu);
		} else {
			list = sitePriceConfigServiceImpl.getUserSiet(userId);
		}
		session.setAttribute("appList", list);
		model.addAttribute("siteList", list);
		session.setAttribute("page", "/newstylejsp/operation/operation");
		return "index";
	}

	/**
	 * @Description 修改高频次的在前边
	 * @date 2016年10月12日上午10:10:16
	 * @author guoyingjie
	 * @param siteId
	 * @param session
	 * @return
	 */
	@RequestMapping("updateSiteFrequency")
	@ResponseBody
	public String updateSiteFrequency(@RequestParam int siteId, HttpSession session) {
		int userId = ((CloudUser) session.getAttribute("user")).getId();
		sitePriceConfigServiceImpl.updateSiteFrequency(siteId, userId);
		return null;
	}

	/**
	 * 用户下获得所有场所下总钱数与当天的总额
	 * 
	 * @param siteId
	 * @return
	 */
	@RequestMapping(value = "/getAllSiteTotalMoneyAndPeopleCount")
	@ResponseBody
	public String getAllSiteTotalMoneyAndPeopleCount(HttpSession session) {
		ExecuteResult result = new ExecuteResult();
		int userId = ((CloudUser) session.getAttribute("user")).getId();
		List<Map> list = userAllSiteDataStatisticsImpl.getAllSiteTotalMoneyAndCurrentPay(userId);
		if (list.size() != 0 && list != null) {
			result.setCode(200);
			result.setData(list);
		} else {
			result.setCode(201);
			result.setMsg("暂无数据···");
		}
		return result.toJsonString();
	}

	/**
	 * 用户下获得所有场所当前的场所 12天的支付总额
	 * 
	 * @param siteId
	 * @return
	 */
	@RequestMapping(value = "/getAllSiteOfTwelveDaysBeforeRevenue")
	@ResponseBody
	public String getAllSiteOfTwelveDaysBeforeRevenue(HttpSession session) {
		CloudUser user = (CloudUser) session.getAttribute("user");
		int userId = user.getId();
		ExecuteResult result = new ExecuteResult();
		if(user.getRoleId().equals("1")){
			List<Map<String, Object>> map = userAllSiteDataStatisticsImpl.getAllSiteOfTwelveDaysBeforeRevenue();
			if (map != null && map.size() != 0) {
				result.setCode(200);
				result.setData(map);
			} else {
				result.setCode(201);
				result.setMsg("暂无数据···");
			}
		}else{
			List<Map<String, Object>> map = userAllSiteDataStatisticsImpl.getAllSiteOfTwelveDaysBeforeRevenue(userId);
			if (map != null && map.size() != 0) {
				result.setCode(200);
				result.setData(map);
			} else {
				result.setCode(201);
				result.setMsg("暂无数据···");
			}
		}
		
		return result.toJsonString();
	}

	/**
	 * 查询当前用户下的所有场所某时间段的每天的收入情况
	 * 
	 * @param siteId
	 * @return
	 * @throws ParseException
	 */
	@RequestMapping(value = "/getAllSiteOfInCome")
	@ResponseBody
	public String getAllSiteOfInCome(HttpSession session, @RequestParam(defaultValue = "00:00:00") String startTime, @RequestParam(defaultValue = "00:00:00") String endTime) throws ParseException {
		int userId = ((CloudUser) session.getAttribute("user")).getId();
		ExecuteResult result = new ExecuteResult();
		List<Map<String, Object>> map = userAllSiteDataStatisticsImpl.getAllSiteOfInCome(userId, startTime, endTime);
		if (map != null && map.size() != 0) {
			result.setCode(200);
			result.setData(map);
		} else {
			result.setCode(201);
			result.setMsg("暂无数据···");
		}
		return result.toJsonString();
	}

	/**
	 * 用户下获得所有场所 每月的总收入
	 * 
	 * @param siteId
	 * @return
	 */
	@RequestMapping(value = "/getAllSiteTotalMonthlyIncome")
	@ResponseBody
	public String getAllSiteTotalMonthlyIncome(HttpSession session) {
		CloudUser user = (CloudUser) session.getAttribute("user");
		int userId = user.getId();
		ExecuteResult result = new ExecuteResult();
		if(user.getRoleId().equals("1")){
			List<Map<String, Object>> map = userAllSiteDataStatisticsImpl.getAllSiteTotalMonthlyIncome();
			if (map != null && map.size() != 0) {
				result.setCode(200);
				result.setData(map);
			} else {
				result.setCode(201);
				result.setMsg("暂无数据···");
			}
		}else{
			List<Map<String, Object>> map = userAllSiteDataStatisticsImpl.getAllSiteTotalMonthlyIncome(userId);
			if (map != null && map.size() != 0) {
				result.setCode(200);
				result.setData(map);
			} else {
				result.setCode(201);
				result.setMsg("暂无数据···");
			}
		}
		return result.toJsonString();
	}

	
	/**
	 * 查询用户下获得所有场所截止某年某月的总收入
	 * @author dengfei E-mail:dengfei200857@163.com
	 * @time 2018年6月25日 上午11:32:17
	 * @param session
	 * @param years
	 * @return
	 */
	@RequestMapping(value = "/getAllSiteMonthlyIncome")
	@ResponseBody
	public String getAllSiteMonthlyIncome(HttpSession session, @RequestParam String years) {
		int userId = ((CloudUser) session.getAttribute("user")).getId();
		ExecuteResult result = new ExecuteResult();
		List<Map<String, Object>> map = userAllSiteDataStatisticsImpl.getAllSiteMonthlyIncome(userId, years);
		if (map != null && map.size() != 0) {
			result.setCode(200);
			result.setData(map);
		} else {
			result.setCode(201);
			result.setMsg("暂无数据···");
		}
		return result.toJsonString();
	}

	/**
	 * 用户下获得所有场所当月增长人数趋势
	 * 
	 * @param siteId
	 * @return
	 */

	@RequestMapping(value = "/getAllSiteSubscriberGrowth")
	@ResponseBody
	public String getAllSiteSubscriberGrowth(HttpSession session) {
		int userId = ((CloudUser) session.getAttribute("user")).getId();
		ExecuteResult result = new ExecuteResult();
		List<Map<String, Object>> list = userAllSiteDataStatisticsImpl.getAllSiteSubscriberGrowth(userId);
		if (list != null && list.size() != 0) {
			result.setCode(200);
			result.setData(list);
		} else {
			result.setCode(201);
			result.setMsg("暂无数据···");
		}
		return result.toJsonString();
	}

	/**
	 * 被多台设备登录用户列表
	 * 
	 * @param siteId
	 * @return
	 */
	@SuppressWarnings({ "unused", "unchecked", "rawtypes" })
	@RequestMapping(value = "/getAllSiteManyPoepleUserTelephone")
	@ResponseBody
	public String getAllSiteManyPoepleUserTelephone(HttpSession session) {
		int userId = ((CloudUser) session.getAttribute("user")).getId();
		ExecuteResult result = new ExecuteResult();
		List<Map<String, Object>> map = userAllSiteDataStatisticsImpl.getAllSiteManyPoepleUserTelephone(userId);
		Integer loginNum = userAllSiteDataStatisticsImpl.getAllSiteYesterdayLoginPeopleNum(userId);
		Map<String, Object> nameCount = new HashMap();
		nameCount.put("count", loginNum);
		if (map != null && map.size() != 0) {
			map.add(nameCount);
			result.setCode(200);
			result.setData(map);
		} else {
			List maps = new ArrayList();
			maps.add(loginNum);
			result.setCode(201);
			result.setData(maps);
			result.setMsg("暂无数据···");
		}
		return result.toJsonString();
	}

	/**
	 * 重点推广用户列表
	 * 
	 * @param siteId
	 * @return
	 */
	@RequestMapping(value = "/getAllSiteKeyEscrowUser")
	@ResponseBody
	public String getAllSiteKeyEscrowUser(HttpSession session) {
		int userId = ((CloudUser) session.getAttribute("user")).getId();
		ExecuteResult result = new ExecuteResult();
		List<Map<String, Object>> map = userAllSiteDataStatisticsImpl.getAllSiteKeyEscrowUser(userId);
		if (map != null && map.size() != 0) {
			result.setCode(200);
			result.setData(map);
		} else {
			result.setCode(201);
			result.setMsg("暂无数据···");
		}
		return result.toJsonString();
	}

	/**
	 * 获的用户下的缴费记录
	 * 
	 * @param siteId
	 * @return
	 */
	@RequestMapping(value = "/getAllSitePayRecord")
	@ResponseBody
	public String getAllSitePayRecord(HttpSession session, @RequestParam Integer siteId, @RequestParam Integer portalId) {
		ExecuteResult result = new ExecuteResult();
		List<Map<String, Object>> map = userAllSiteDataStatisticsImpl.getAllSitePayRecord(siteId, portalId);
		if (map != null && map.size() != 0) {
			result.setCode(200);
			result.setData(map);
		} else {
			result.setCode(201);
			result.setMsg("暂无数据···");
		}
		return result.toJsonString();
	}

	/**
	 * 获的用户下的缴费记录
	 * 
	 * @param siteId
	 * @return
	 */
	@SuppressWarnings({ "unused", "unchecked", "rawtypes" })
	@RequestMapping(value = "/getAllSitePayTryPay")
	@ResponseBody
	public String getAllSitePayTryPay(HttpSession session) {
		int userId = ((CloudUser) session.getAttribute("user")).getId();
		ExecuteResult result = new ExecuteResult();
		List list = new ArrayList();
		Map allPayOrNotPay = userAllSiteDataStatisticsImpl.getAllSitePayOrNotPay(userId);
		Map allTryNotTry = userAllSiteDataStatisticsImpl.getAllSiteTryOrNot(userId);
		Map reNotRe = userAllSiteDataStatisticsImpl.getAllSiteRegisteOrNot(userId);
		list.add(allPayOrNotPay);
		list.add(allTryNotTry);
		list.add(reNotRe);
		if (list != null) {
			result.setCode(200);
			result.setData(list);
		} else {
			result.setCode(201);
			result.setMsg("暂无数据···");
		}
		return result.toJsonString();
	}

	/**
	 * 获取 独立用户总数 、 注册用户数 、 付费用户总数 、 昨日登录用户数 用户渗透率 、 注册转换率 、 付费转换率
	 * 
	 * @Description:
	 * @param session
	 * @return
	 * @Date 2016年7月5日 下午2:46:35
	 * @Author cuimiao
	 */
	@RequestMapping(value = "/getAllBusinessData")
	@ResponseBody
	public String getAllBusinessData(HttpSession session, @RequestParam(defaultValue = "-1") Integer siteId) {
		int userId = ((CloudUser) session.getAttribute("user")).getId();// 1341---36
		// 1.根据siteId获取businessDataList
		List<Map<String, Object>> businessDataList = userAllSiteDataStatisticsImpl.getBusinessDataBySiteId(siteId, userId, session);
		System.out.println("=============getAllBusinessData==" + businessDataList);
		// 今日新增注册数
		int newRegisterUserNum = userAllSiteDataStatisticsImpl.getNewRegisterUserNum(siteId, userId);
		// 在线用户数
		int onlinenum = userAllSiteDataStatisticsImpl.getNowonlineNum(siteId, userId);
		// 昨日上线用户数
		int yestodayuplineUserNum = userAllSiteDataStatisticsImpl.getYestodayUplineUserNum(siteId, userId);
		// AP上线数量
		int totalAPNum = userAllSiteDataStatisticsImpl.getAPNum(siteId, userId);
		// 付费用户数
		int payUserNum = userAllSiteDataStatisticsImpl.getPayUserNum(siteId, userId);

		int totalsiteNum = 0;
		// 处理businessDataList 获取businessData（即，若有多条数据，整合为一条）
		Map<String, Object> businessData = new HashMap<String, Object>();
		for (int i = 0; i < businessDataList.size(); i++) {
			int site_id = Integer.parseInt(businessDataList.get(i).get("site_id")+"");
			CloudSite site = cloudsiteserviceimpl.getCloudSiteById(site_id);
			int siteNum = site.getSiteNum();
			totalsiteNum += siteNum;
			// 处理昨日独立用户总数
			if (businessDataList.get(i).get("uv_num") != null) {
				if (businessData.get("uv_num") != null) {
					// 不为空累加
					businessData.put("uv_num", Integer.parseInt(businessDataList.get(i).get("uv_num") + "") + Integer.parseInt(businessData.get("uv_num") + ""));
				} else {
					// 为空赋值
					businessData.put("uv_num", 0);
				}
			}else {
				// 为空赋值
				businessData.put("uv_num", 0);
			}

			// 处理 昨日注册用户数
			if (businessDataList.get(i).get("register_num") != null) {
				if (businessData.get("register_num") != null) {
					// 不为空累加
					businessData.put("register_num", Integer.parseInt(businessDataList.get(i).get("register_num") + "") + Integer.parseInt(businessData.get("register_num") + ""));
				} else {
					// 为空赋值
					businessData.put("register_num", 0);
				}
			}else {
				// 为空赋值
				businessData.put("register_num", 0);
			}

			// 处理 昨日付费用户总数
			if (businessDataList.get(i).get("pay_num") != null) {
				if (businessData.get("pay_num") != null) {
					// 不为空累加
					businessData.put("pay_num", Integer.parseInt(businessDataList.get(i).get("pay_num") + "") + Integer.parseInt(businessData.get("pay_num") + ""));
				} else {
					// 为空赋值
					businessData.put("pay_num", 0);
				}
			}else {
				// 为空赋值
				businessData.put("pay_num", 0);
			}

			// 处理 昨日登录用户数
			if (businessDataList.get(i).get("login_num") != null) {
				if (businessData.get("login_num") != null) {
					// 不为空累加
					businessData.put("login_num", Integer.parseInt(businessDataList.get(i).get("login_num") + "") + Integer.parseInt(businessData.get("login_num") + ""));
				} else {
					// 为空赋值
					businessData.put("login_num", 0);
				}
			}else {
				// 为空赋值
				businessData.put("login_num", 0);
			}

			// 处理 总独立用户数（访问认证客户端）)
			if (businessDataList.get(i).get("total_uv") != null) {
				if (businessData.get("total_uv") != null) {
					// 不为空累加
					businessData.put("total_uv", Integer.parseInt(businessDataList.get(i).get("total_uv") + "") + Integer.parseInt(businessData.get("total_uv") + ""));
				} else {
					// 为空赋值
					businessData.put("total_uv", 0);
				}
			}else {
				// 为空赋值
				businessData.put("total_uv", 0);
			}

			// 处理总注册用户数
			if (businessDataList.get(i).get("total_num") != null) {
				if (businessData.get("total_num") != null) {
					// 不为空累加
					businessData.put("total_num", Integer.parseInt(businessDataList.get(i).get("total_num") + "") + Integer.parseInt(businessData.get("total_num") + ""));
				} else {
					// 为空赋值
					businessData.put("total_num", 0);
				}
			}else {
				// 为空赋值
				businessData.put("total_num", 0);
			}

			// 处理 总付费用户数
			if (businessDataList.get(i).get("total_pay") != null) {
				if (businessData.get("total_pay") != null) {
					// 不为空累加
					businessData.put("total_pay",
							Integer.parseInt(businessDataList.get(i).get("total_pay") + "") + Integer.parseInt(businessData.get("total_pay") + ""));
				} else {
					// 为空赋值
					businessData.put("total_pay", 0);
				}
			}

		}

		// 2.处理businessData
		// Double保留两位小数format
		DecimalFormat df = new DecimalFormat("#.00");
		// 用户渗透率=总独立用户数/场景登记总人数,保留两位小数
		double total_uv = businessData.isEmpty()?0:Double.parseDouble(businessData.get("total_uv")+ "");
		Double permeateRate = totalsiteNum==0?0:Double.parseDouble(df.format(total_uv/totalsiteNum));

		// 注册转换率=总注册用户数/总独立用户数,保留两位小数
		double total_num = businessData.isEmpty()?0:Double.parseDouble(businessData.get("total_num")+ "");
		Double registerRate = total_uv==0?0:Double.parseDouble(df.format(total_num/total_uv));

		// 付费转换率=总付费用户数/总独注册用户数,保留两位小数
		double total_pay = businessData.isEmpty()?0:Double.parseDouble(businessData.get("total_pay")+ "");
		Double payRate = total_num==0?0:Double.parseDouble(df.format(total_pay/total_num));

		// 3.将处理后的数据传到前端展示
		ExecuteResult result = new ExecuteResult();
		Map<String, Object> data = new HashMap<String, Object>();
		data.put("ylineNum", yestodayuplineUserNum);
		data.put("registerNum", newRegisterUserNum);
		/* data.put("payNum", businessData.get("pay_num")); */
		data.put("payNum", payUserNum);
		data.put("APNum", totalAPNum);
		data.put("permeateRate", permeateRate);// 用户渗透率
		data.put("tryRegisterRate", registerRate);// 注册转换率
		data.put("registerPayRate", payRate);// 付费转换率
		data.put("onlinenum", onlinenum);
		result.setCode(200);
		result.setData(data);
		System.out.println("============data=getAllBusinessData=" + data);
		return result.toJsonString();
	}

	/**
	 * 获取 付费转换率 折线图
	 * 
	 * @Description:
	 * @param session
	 * @return
	 * @Date 2016年7月5日 下午5:02:53
	 * @Author cuimiao
	 */
	@RequestMapping(value = "/getDataChart")
	@ResponseBody
	public String getRegisterPayDataChart(HttpSession session, @RequestParam(defaultValue = "-1") Integer siteId, @RequestParam String startDate, @RequestParam String endDate) {

		// 判断endDate，若等于或大于今天，则置为昨天
		if (DateUtil.compareDate(DateUtil.string2DateShort(DateUtil.getStringDateShort()), DateUtil.string2DateShort(endDate)) < 0) {
			// 置为昨天
			endDate = DateUtil.date2StringShort(DateUtil.dateSub(DateUtil.getStringDateShort(), 1));
		}

		int userId = ((CloudUser) session.getAttribute("user")).getId();

		// 存放 用户渗透率、注册转换率、付费转换率 和 显示日期 的map，放入json的data中传到前端显示
		Map<String, List> dataMap = new HashMap<String, List>();

		// Double格式化，保留两位小数
		DecimalFormat df = new DecimalFormat("#.00");

		// 查询 用户渗透率 list
		List<Map<String, Object>> perInfoList = userAllSiteDataStatisticsImpl.getPermeateList(siteId, userId, startDate, endDate);

		// 查询 注册转换率 list
		List<Map<String, Object>> tryInfoList = userAllSiteDataStatisticsImpl.getTryRegisterList(siteId, userId, startDate, endDate);

		// 查询 付费转换率 list
		List<Map<String, Object>> regInfoList = userAllSiteDataStatisticsImpl.getRegisterPayList(siteId, userId, startDate, endDate);

		// 用户渗透率 结果list
		List<Double> permeateList = new ArrayList<Double>();

		// 注册转换率 结果list
		List<Double> tryRegisterList = new ArrayList<Double>();

		// 付费转换率 结果list
		List<Double> registerPayList = new ArrayList<Double>();

		// TODO 还有获取时间list方法
		List dateList = new ArrayList();
		CloudSite site = cloudsiteserviceimpl.getCloudSiteById(siteId);
		int siteNum = site.getSiteNum();
		int totalsiteNum = 0;
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		try {
			int days = (int) ((sdf.parse(endDate).getTime() - sdf.parse(startDate).getTime()) / (1000*3600*24));
			totalsiteNum = siteNum * days;
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		// 用户渗透率 list 遍历
		for (int i = 0; i < perInfoList.size(); i++) {
			dateList.add(DateUtil.getStringDateShort((Date) perInfoList.get(i).get("create_time")));
			// 用户渗透率(分子)
			Double permeateRatenum = 0.0;
			if (perInfoList.get(i).get("total_uv") != null) {
				permeateRatenum = Double.parseDouble(perInfoList.get(i).get("total_uv").toString());
			}
			// 用户渗透率
			Double permeateRate = 0.0;
			permeateRate = permeateRatenum / totalsiteNum;
			// 用户渗透率 格式化两位小数
			Double permeateRateFormat = Double.parseDouble(df.format(permeateRate * 100));
			permeateList.add(permeateRateFormat);
		}
		dataMap.put("permeateList", permeateList);
		
		// 注册转换率 list 遍历
		for (int i = 0; i < tryInfoList.size(); i++) {
			// 总用户数(分子)
			Double tryRegisterRatenum = 0.0;
			if (tryInfoList.get(i).get("total_num") != null) {
				tryRegisterRatenum = Double.parseDouble(tryInfoList.get(i).get("total_num").toString());
			}
			// 总独立用户数(分母)
			Double tryRegisterRateden = 0.0;
			if (tryInfoList.get(i).get("total_uv") != null) {
				tryRegisterRateden = Double.parseDouble(tryInfoList.get(i).get("total_uv").toString());
			}
			// 注册转换率
			Double tryRegisterRate = 0.0;
			if (tryRegisterRateden != 0.0) {
				tryRegisterRate = tryRegisterRatenum / tryRegisterRateden;
			}
			// 注册转换率字符串显示 例0.8964 --> 89.64(字符串)
			Double tryRegisterRateFormate = Double.parseDouble(df.format(tryRegisterRate * 100));
			tryRegisterList.add(tryRegisterRateFormate);
		}
		dataMap.put("tryRegisterList", tryRegisterList);

		// 付费转换率 list 遍历
		for (int i = 0; i < regInfoList.size(); i++) {
			// 总付费用户数(分子)
			Double registerPayRatenum = 0.0;
			if (regInfoList.get(i).get("total_pay") != null) {
				registerPayRatenum = Double.parseDouble(regInfoList.get(i).get("total_pay").toString());
			}
			// 总用户数(分母)
			Double registerPayRateden = 0.0;
			if (regInfoList.get(i).get("total_num") != null) {
				registerPayRateden = Double.parseDouble(regInfoList.get(i).get("total_num").toString());
			}
			// 新增付费转换率
			Double registerPayRate = 0.0;
			if (registerPayRateden != 0.0) {
				registerPayRate = registerPayRatenum / registerPayRateden;
			}
			// 付费转换率格式化保留两位小数
			Double registerPayRateFormate = Double.parseDouble(df.format(registerPayRate * 100));
			registerPayList.add(registerPayRateFormate);
		}
		dataMap.put("registerPayList", registerPayList);

		// 将时间list放入map
		dataMap.put("dateList", dateList);

		// 封装结果，返回前端
		ExecuteResult result = new ExecuteResult();
		result.setCode(200);
		result.setData(dataMap);
		return result.toJsonString();
	}

	/**
	 * zsk 根据场所，根据账号，根据时间段进行查询筛选 （用户的累计使用时长）
	 * 
	 * @return
	 */
	@RequestMapping(value = "/findUserTotalTime")
	@ResponseBody
	public String findUserTotalTime(@RequestParam("siteId") String siteId, @RequestParam("userName") String userName, @RequestParam("startDate") String startDate,
			@RequestParam("endDate") String endDate, @RequestParam(defaultValue = "1") int curPage, @RequestParam(defaultValue = "10") int pageSize, HttpSession session) {

		ExecuteResult result = new ExecuteResult();
		Map<String, Object> map = new HashMap<String, Object>();
		CloudUser user = (CloudUser) session.getAttribute("user");

		List<Map<String, Object>> list = null;
		List<UserTotalTimeHave> listUserTotalTime = null;
		if (user.getUserName().equals("18292059695")) {
			listUserTotalTime = siteCustomerInfoServiceImpl.listAppUTT(siteId, user.getId(), userName, startDate, endDate, curPage, pageSize, session);
			if (listUserTotalTime.size() > 0 && curPage == 1) {
				// 获取总页数
				int number = siteCustomerInfoServiceImpl.listUserAppTotalTimeNumber(siteId, user.getId(), userName, startDate, endDate, session);
				int cout = (number % pageSize) > 0 ? (number / pageSize + 1) : number / pageSize;
				map.put("cout", cout);
				map.put("listUserTotalTime", listUserTotalTime);
				result.setData(map);
				result.setCode(200);
			} else {
				result.setCode(201);
			}
		} else {

			// 进行查询操作
			listUserTotalTime = siteCustomerInfoServiceImpl.listUTT(siteId, user.getId(), userName, startDate, endDate, curPage, pageSize);
			if (listUserTotalTime.size() > 0) {
				// 获取总页数
				int number = siteCustomerInfoServiceImpl.listUserTotalTimeNumber(siteId, user.getId(), userName, startDate, endDate);
				int cout = (number % pageSize) > 0 ? (number / pageSize + 1) : number / pageSize;
				map.put("cout", cout);
				map.put("listUserTotalTime", listUserTotalTime);
				result.setData(map);
				result.setCode(200);
			} else {
				result.setCode(201);
			}
		}
		return result.toJsonString();
	}

	/**
	 * 跳转平安用户数据中心
	 * 
	 * @return
	 */
	@RequestMapping("toUserOnlineData")
	public String toUserOnlineData(HttpSession session) {
		session.setAttribute("page", "/newstylejsp/dataCenter/userDataCenter");
		return "index";
	}

	/**
	 * 获取平安数据中心数据
	 * 
	 * @param sDate
	 * @param eDate
	 * @return
	 */
	@RequestMapping("getUserOnlineData")
	@ResponseBody
	public String getUserOnlineData(String sDate, String eDate, int curPage, int pageSize) {
		ExecuteResult result = siteCustomerInfoServiceImpl.getUserData(sDate, eDate, curPage, pageSize);
		return result.toJsonString();
	}

}
