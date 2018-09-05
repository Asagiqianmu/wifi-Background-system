package com.fxwx.controller;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fxwx.service.impl.DataStatisticsImpl;
import com.fxwx.util.ExecuteResult;

@Controller
@RequestMapping(value="dataStatistics")
public class ReportStatisticsController {

	@Autowired
	public DataStatisticsImpl dataStatisticsImpl;

	/**
	 *  获得场所下总钱数与当天的总额
	 * @param siteId
	 * @return
	 */
	@SuppressWarnings("rawtypes")
	@RequestMapping(value="/getTotalMoneyTotal")
	@ResponseBody
	public String getTotalMoneyAndPeopleCount(@RequestParam String siteId){
		ExecuteResult result = new ExecuteResult();
		List<Map> list = dataStatisticsImpl.getTotalMoneyAndPeopleCount(siteId);
		if(list.size()!=0&&list!=null){
			result.setCode(200);
			result.setData(list);
		}else{
			result.setCode(201);
			result.setMsg("暂无数据···");
		}
		return result.toJsonString();
	}
	
	/**
	 *  获得场所下获得支付类型的各个比例
	 * @param siteId
	 * @return
	 */
	@RequestMapping(value="/getTypeProportion")
	@ResponseBody
	public String getPayTypeTotalNum(@RequestParam String siteId){
		ExecuteResult result = new ExecuteResult();
		List<Map<String, Object>> list = dataStatisticsImpl.getTypeEvery(siteId);
		if(list!=null&&list.size()!=0){
			result.setCode(200);
			result.setData(list);
		}else{
			result.setCode(201);
			result.setMsg("暂无数据···");
		}
		return result.toJsonString();
	}
	
	/**
	 * 当前的场所 12天的支付总额
	 * @param siteId
	 * @return
	 */
	@RequestMapping(value="/getTwelveDaysBeforeRevenue")
	@ResponseBody
	public String getTwelveDaysBeforeRevenue(@RequestParam String siteId){
		ExecuteResult result = new ExecuteResult();
		List<Map<String, Object>> map = dataStatisticsImpl.getTwelveDaysBeforeRevenue(siteId);
		if(map!=null&&map.size()!=0){
			result.setCode(200);
			result.setData(map);
		}else{
			result.setCode(201);
			result.setMsg("暂无数据···");
		}
		return result.toJsonString();
	}
	
	/**
	 * 查询当前场所下某一时间段每天的收入总和
	 * @param siteId
	 * @return
	 * @throws ParseException 
	 */
	@RequestMapping(value="/getDayIncome")
	@ResponseBody
	public String getDayIncome(@RequestParam String siteId,@RequestParam(defaultValue="00:00:00") String startTime,@RequestParam(defaultValue="00:00:01") String endTime) throws ParseException{
		ExecuteResult result = new ExecuteResult();
		List<Map<String, Object>> map = dataStatisticsImpl.getQueryInCome(siteId,startTime,endTime);
		if(map!=null&&map.size()!=0){
			result.setCode(200);
			result.setData(map);
		}else{
			result.setCode(201);
			result.setMsg("暂无数据···");
		}
		return result.toJsonString();
	}
	/**
	 * 获得每月的总收入
	 * @param siteId
	 * @return
	 */
	@RequestMapping(value="/getTotalMonthlyIncome")
	@ResponseBody
	public String getTotalMonthlyIncome(@RequestParam String siteId){
		ExecuteResult result = new ExecuteResult();
		if(siteId.equals("0")){
			List<Map<String, Object>> map = dataStatisticsImpl.getTotalMonthlyIncome();
			if(map!=null&&map.size()!=0){
				result.setCode(200);
				result.setData(map);
			}else{
				result.setCode(201);
				result.setMsg("暂无数据···");
			}
		}else{
			List<Map<String, Object>> map = dataStatisticsImpl.getTotalMonthlyIncome(siteId);
			if(map!=null&&map.size()!=0){
				result.setCode(200);
				result.setData(map);
			}else{
				result.setCode(201);
				result.setMsg("暂无数据···");
			}
		}
		
		return result.toJsonString();
	}
	
	/**
	 * 传入年份每月的收入总和
	 * @param siteId
	 * @return
	 * @throws ParseException 
	 */
	@RequestMapping(value="/getMonthlyIncome")
	@ResponseBody
	public String getTotalMonthlyIncome(@RequestParam String siteId,@RequestParam String year) throws ParseException{
		ExecuteResult result = new ExecuteResult();
		List<Map<String, Object>> map = dataStatisticsImpl.getMonthlyIncome(siteId,year);
		if(map!=null&&map.size()!=0){
			result.setCode(200);
			result.setData(map);
		}else{
			result.setCode(201);
			result.setMsg("暂无数据···");
		}
		return result.toJsonString();
	}
	
	/**
	 * 获得当月增长人数趋势
	 * @param siteId
	 * @return
	 */
	@SuppressWarnings({ "unchecked", "rawtypes" })
	@RequestMapping(value="/getSubscriberGrowth")
	@ResponseBody
	public String getSubscriberGrowth(@RequestParam String siteId){
		ExecuteResult result = new ExecuteResult();
		List<Map<String, Object>> list = dataStatisticsImpl.getSubscriberGrowth(siteId);
		String name = dataStatisticsImpl.getSiteName(siteId);
		Map map  = new HashMap<>();
		map.put("name",name);
		if(list!=null&&list.size()!=0){
			result.setCode(200);
			list.add(map);
			result.setData(list);
		}else{
			result.setCode(201);
			result.setMsg("暂无数据···");
		}
		return result.toJsonString();
	}
	/**
	 *  被多台设备登录用户列表
	 * @param siteId
	 * @return
	 */
	@SuppressWarnings({"unchecked", "rawtypes" })
	@RequestMapping(value="/getManyPoepleUserTelephone")
	@ResponseBody
	public String getManyPoepleUserTelephone(@RequestParam String siteId){
		ExecuteResult result = new ExecuteResult();
		List<Map<String, Object>> map = dataStatisticsImpl.getManyPoepleUserTelephone(siteId);
		Integer loginNum = dataStatisticsImpl.getYesterdayLoginPeopleNum(siteId);
		Map nameCount = new HashMap();
		nameCount.put("count",loginNum);
		if(map!=null&&map.size()!=0){
			map.add(nameCount);
			result.setCode(200);
			result.setData(map);
		}else{
			List lists = new ArrayList();
			lists.add(loginNum);
			result.setCode(201);
			result.setData(lists);
			result.setMsg("暂无数据···");
		}
		return result.toJsonString();
	}
	
	/**
	 *  重点推广用户列表
	 * @param siteId
	 * @return
	 */
	@RequestMapping(value="/getKeyEscrowUser")
	@ResponseBody
	public String getKeyEscrowUser(@RequestParam String siteId){
		ExecuteResult result = new ExecuteResult();
		List<Map<String, Object>> map = dataStatisticsImpl.getKeyEscrowUser(siteId);
		if(map!=null&&map.size()!=0){
			result.setCode(200);
			result.setData(map);
		}else{
			result.setCode(201);
			result.setMsg("暂无数据···");
		}
		
		return result.toJsonString();
	}
	
	/**
	 * 获的用户下的缴费记录
	 * @param siteId
	 * @return
	 */
	@RequestMapping(value="/getPayRecord")
	@ResponseBody
	public String getPayRecord(@RequestParam String siteId,@RequestParam Integer userId){
		ExecuteResult result = new ExecuteResult();
		List<Map<String, Object>> map = dataStatisticsImpl.getPayRecord(userId,siteId);
		if(map!=null&&map.size()!=0){
			result.setCode(200);
			result.setData(map);
		}else{
			result.setCode(201);
			result.setMsg("暂无数据···");
		}
		return result.toJsonString();
	}
	/**
	 * 获的用户下的各种比例
	 * @param siteId
	 * @return
	 */
	@SuppressWarnings({ "rawtypes", "unused" })
	@RequestMapping(value="/getEveryRatio")
	@ResponseBody
	public String getEveryRatio(@RequestParam String siteId){
		ExecuteResult result = new ExecuteResult();
		List<Map> list = new ArrayList<>();
		Map payNotPay = dataStatisticsImpl.getPayOrNotPay(siteId);
		Map tryNotTry = dataStatisticsImpl.getTryOrNot(siteId);
		Map registerNot = dataStatisticsImpl.getRegisteOrNot(siteId);
		list.add(payNotPay);
		list.add(tryNotTry);
		list.add(registerNot);
		if(list!=null){
			result.setCode(200);
			result.setData(list);
		}else{
			result.setCode(201);
			result.setMsg("暂无数据···");
		}
		return result.toJsonString();
	}
}
