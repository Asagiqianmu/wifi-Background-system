package com.fxwx.controller;

import java.text.DecimalFormat;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fxwx.entity.CloudSite;
import com.fxwx.service.impl.CloudSiteServiceImpl;
import com.fxwx.service.impl.NewEditionSkinServiceImpl;
import com.fxwx.util.ExecuteResult;

@Controller
@RequestMapping(value = "newEditionSkin")
public class NewEditionSkinController {
	private Logger logger = LoggerFactory.getLogger(NewEditionSkinController.class);
	@Autowired
	private NewEditionSkinServiceImpl newEditionSkinServiceImpl;
	@Autowired
	public CloudSiteServiceImpl cloudsiteserviceimpl;
	
	/**
	 * 获取所有场所信息,显示首页面
	 * 
	 * @param session
	 * @param model
	 * @return
	 */
	@RequestMapping("index")
	public String index(HttpSession session, Model model) {
		List<Map<String, Object>> list = newEditionSkinServiceImpl.queryCloudSiteList();
		model.addAttribute("siteList", list);
		session.setAttribute("page", "/operation");
		return "newEditionSkin/index";
	}

	/**
	 * 查询总人数、今日收益、总收益
	 * 
	 * @param siteId
	 * @return
	 */
	@RequestMapping(value = "/getTotalMoneyAndPeopleCount")
	@ResponseBody
	public String getTotalMoneyAndPeopleCount(int siteId) {
		ExecuteResult result = new ExecuteResult();
		List<Map> list = newEditionSkinServiceImpl.getTotalMoneyAndTotalCount(siteId);
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
	 * 获取 独立用户总数 、 注册用户数 、 付费用户总数 、 昨日登录用户数 用户渗透率 、 注册转换率 、 付费转换率
	 * 
	 * @Description:
	 * @param session
	 * @return
	 * @Author cuimiao
	 */
	@RequestMapping(value = "/getAllBusinessData")
	@ResponseBody
	public String getAllBusinessData(HttpSession session, Integer siteId) {
		// 1.获取businessDataList
		List<Map<String, Object>> businessDataList = newEditionSkinServiceImpl.getBusinessData(siteId, session);
		System.out.println("=============getAllBusinessData==" + businessDataList);
		// 付费用户数
		int payUserNum = newEditionSkinServiceImpl.getPayUserNum(siteId);
		// 上线AP数量
		int apNum = newEditionSkinServiceImpl.getAPNum(siteId);
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
		data.put("payNum", payUserNum);// 付费用户
		data.put("apNum", apNum);// 上线AP数量
		data.put("uvNum", businessData.get("uv_num"));// 独立用户总数
		data.put("registerNum", businessData.get("register_num"));// 注册用户数
		data.put("loginNum", businessData.get("login_num"));// 昨日登录用户数
		data.put("permeateRate", permeateRate);// 用户渗透率
		data.put("tryRegisterRate", registerRate);// 注册转换率
		data.put("registerPayRate", payRate);// 付费转换率
		result.setCode(200);
		result.setData(data);

		System.out.println("============data=getAllBusinessData=" + data);
		return result.toJsonString();
	}

	/**
	 * 场所下获得缴费类型的各个比例
	 * 
	 * @param siteId
	 * @return
	 */
	@RequestMapping(value = "/getTypeProportion")
	@ResponseBody
	public String getPayTypeTotalNum(int siteId) {
		ExecuteResult result = new ExecuteResult();
		List<Map<String, Object>> list = newEditionSkinServiceImpl.getTypeEvery(siteId);
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
	 * 场所 前12天的日收入统计
	 * 
	 * @param siteId
	 * @return
	 */
	@RequestMapping(value = "/getTwelveDaysBeforeRevenue")
	@ResponseBody
	public String getTwelveDaysBeforeRevenue(int siteId) {
		ExecuteResult result = new ExecuteResult();
		List<Map<String, Object>> map = newEditionSkinServiceImpl.getTwelveDaysBeforeRevenue(siteId);
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
	 * 获得当月增长人数趋势
	 * 
	 * @param siteId
	 * @return
	 */
	@SuppressWarnings({ "unchecked", "rawtypes" })
	@RequestMapping(value = "/getSubscriberGrowth")
	@ResponseBody
	public String getSubscriberGrowth(int siteId) {
		ExecuteResult result = new ExecuteResult();
		List<Map<String, Object>> list = newEditionSkinServiceImpl.getSubscriberGrowth(siteId);
		String name = newEditionSkinServiceImpl.getSiteName(siteId);
		Map map = new HashMap<>();
		map.put("name", name);
		if (list != null && list.size() != 0) {
			result.setCode(200);
			list.add(map);
			result.setData(list);
		} else {
			result.setCode(201);
			result.setMsg("暂无数据···");
		}
		return result.toJsonString();
	}

}
