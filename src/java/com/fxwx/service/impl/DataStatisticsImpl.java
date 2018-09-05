package com.fxwx.service.impl;
import java.text.DecimalFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import mockit.Mock;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.apache.log4j.Logger;
import org.aspectj.weaver.patterns.ThisOrTargetAnnotationPointcut;
import org.nutz.dao.Cnd;
import org.nutz.dao.Dao;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import com.alibaba.druid.sql.ast.expr.SQLAllColumnExpr;
import com.fxwx.bean.SiteIncomeBean;
import com.fxwx.entity.CloudSite;
import com.fxwx.entity.SiteIncome;
import com.fxwx.entity.SitePriceConfig;
import com.fxwx.util.CalendarUtil;
import com.fxwx.util.ExportExcelUtils;
import com.fxwx.util.InitContext;
@Service
@SuppressWarnings("all")
public class DataStatisticsImpl{

	private static Logger log = Logger.getLogger(DataStatisticsImpl.class);

	@Resource(name = "jdbcTemplate")
	private JdbcTemplate jdbcTemplate;

	@Resource(name = "nutDao")
	private Dao nutDao;

	/**
	 * 获得场所下总钱数与当天的总额
	 * 
	 * @param siteId
	 * @return
	 */
	 
	public List<Map>  getTotalMoneyAndPeopleCount(String siteId){
		List<Map> listPut = new ArrayList<>();
		Map map = new HashMap();
		String sql = "SELECT SUM(transaction_amount) todayMoney FROM t_site_income WHERE site_id = ? AND create_time BETWEEN DATE_FORMAT(NOW(),'%Y-%m-%d 00:00:00') AND NOW()";
		String sqls =" SELECT  SUM(transaction_amount) totalMoney from t_site_income WHERE site_id=?";
		try {
			String list = jdbcTemplate.queryForObject(sql,new Object[]{siteId},String.class);
			if(list!=null&&!"".equals(list)){
				map.put("todayMoney", list+"");
			}else{
				map.put("todayMoney", "0.0000");
			}
		} catch (Exception e) {
			map.put("todayMoney", "0.0000");
		}
		try {
			String lists = jdbcTemplate.queryForObject(sqls,new Object[]{siteId},String.class);
			if(lists!=null&&!"".equals(lists)){
				map.put("totalMoney", lists+"");
			}else{
				map.put("totalMoney", "0.0000");
			}
		} catch (Exception e) {
			map.put("totalMoney", "0.0000");
		}
        map.put("siteNum", String.valueOf(getSiteNum(siteId)));
		map.put("tryNotTry", getTryNotTryPoepleCount(siteId));
		map.put("payNotPay", getPayNotPay(siteId));
		map.put("regiterNotRe", getRegisterNum(siteId));
        listPut.add(map);
        return listPut==null?null:listPut;
	}
	/**
	 * 获得当前场所下的已经支付的人数
	 * 
	 * @param siteId
	 * @return
	 */
	 
	public int getPayPeople(String siteId) {

		String sql = "SELECT COUNT(id) FROM t_site_customer_info WHERE site_id=?";
		int payCount = jdbcTemplate.queryForInt(sql, new Object[] { siteId });
		if (payCount > 0) {
			return payCount;
		} else {
			return 0;
		}
	}
	/**
	 * 当前场所的试用人数
	 * 
	 * @param siteId
	 * @return
	 */
	 
	public int getTryPoepleCount(String siteId) {
		String sql = "SELECT COUNT(id) FROM t_portal_user_trial_records WHERE site_id =?";
		int tryCount = jdbcTemplate.queryForInt(sql, new Object[] { siteId });
		if (tryCount > 0) {
			return tryCount;
		} else {
			return 0;
		}
	}
	/**
	 * 获得前十二天的每天的收入总和
	 * 
	 * @param siteId
	 */
 
	public List<Map<String,Object>> getTwelveDaysBeforeRevenue(String siteId){
		String sql = "SELECT DATE_FORMAT(create_time,'%Y-%m-%d') date ,SUM(transaction_amount) totalMoney from t_site_income"
				+ " WHERE site_id =? GROUP BY DATE_FORMAT(create_time,'%Y-%m-%d') ORDER BY DATE_FORMAT(create_time,'%Y-%m-%d') DESC LIMIT 0,12";
		List<Map<String,Object>> listtime = jdbcTemplate.queryForList(sql,new Object[]{siteId});
		List<String> list = CalendarUtil.getDateList();
		List<Map<String,Object>> dateMaps = new ArrayList();
		Map dateMap = null;
		for (int i = 0; i < listtime.size(); i++) {
				if(list.contains(listtime.get(i).get("date").toString().trim())){
					for (int j = 0; j <list.size(); j++) {
						if(list.get(j).equals(listtime.get(i).get("date").toString())){
							dateMap = new HashMap();
							dateMap.put("date",listtime.get(i).get("date").toString());
							dateMap.put("totalMoney", listtime.get(i).get("totalMoney"));
							dateMaps.add(dateMap);
							list.remove(j);
							break;
						}
					}
				} 
		}
		for (int i = 0; i < list.size(); i++) {
			dateMap = new HashMap();
			dateMap.put("date",list.get(i).toString());
			dateMap.put("totalMoney",0.0000);
			dateMaps.add(dateMap);
		}
		CalendarUtil.sorts(dateMaps);
		return dateMaps;
	}
	
	/**
	 * 
	 * 
	 * 
	 * 按时间段查询每天的收入总和
	 * @param siteId ,startTime,endTime
	 * @throws ParseException 
	 */
	 
	public List<Map<String,Object>> getQueryInCome(String siteId,String startTime,String endTime) throws ParseException{
		String sql = "SELECT DATE_FORMAT(create_time,'%Y-%m-%d') date,SUM(transaction_amount) totalMoney FROM t_site_income"
				+ " WHERE site_id = ? AND create_time BETWEEN ? AND ? GROUP BY  DATE_FORMAT(create_time,'%Y-%m-%d')";
		List<Map<String,Object>> listtime = jdbcTemplate.queryForList(sql,new Object[]{siteId,startTime+" 00:00:00",endTime+" 23:59:59"});
		List<String> list = CalendarUtil.getDayBetween(startTime,endTime);
		List<Map<String,Object>> dateMaps = new ArrayList();
		Map dateMap = null;
		for (int i = 0; i < listtime.size(); i++) {
				if(list.contains(listtime.get(i).get("date").toString().trim())){
					for (int j = 0; j <list.size(); j++) {
						if(list.get(j).equals(listtime.get(i).get("date").toString())){
							dateMap = new HashMap();
							dateMap.put("date",listtime.get(i).get("date").toString());
							dateMap.put("totalMoney", listtime.get(i).get("totalMoney"));
							dateMaps.add(dateMap);
							list.remove(j);
							break;
						}
					}
				} 
		}
		for (int i = 0; i < list.size(); i++) {
			dateMap = new HashMap();
			dateMap.put("date",list.get(i).toString());
			dateMap.put("totalMoney",0.0000);
			dateMaps.add(dateMap);
		}
		CalendarUtil.sorts(dateMaps);
		return dateMaps;
	 
	}
	
	
	/**
	 * 
	 * 按时间段查询每天的收入总和场所线上总和
	 * @param siteId ,startTime,endTime
	 * @throws ParseException 
	 */
	 
	public List<Map<String,Object>> getSiteOffInCome(String siteId,String startTime,String endTime) throws ParseException{
		String sql = "SELECT DATE_FORMAT(create_time,'%Y-%m-%d') date,SUM(transaction_amount) totalMoney FROM t_site_income"
				+ " WHERE site_id = ? and portal_user_name like '0%' AND create_time BETWEEN ? AND ? GROUP BY  DATE_FORMAT(create_time,'%Y-%m-%d')";
		List<Map<String,Object>> listtime = jdbcTemplate.queryForList(sql,new Object[]{siteId,startTime+" 00:00:00",endTime+" 23:59:59"});
		List<String> list = CalendarUtil.getDayBetween(startTime,endTime);
		List<Map<String,Object>> dateMaps = new ArrayList();
		Map dateMap = null;
		for (int i = 0; i < listtime.size(); i++) {
				if(list.contains(listtime.get(i).get("date").toString().trim())){
					for (int j = 0; j <list.size(); j++) {
						if(list.get(j).equals(listtime.get(i).get("date").toString())){
							dateMap = new HashMap();
							dateMap.put("date",listtime.get(i).get("date").toString());
							dateMap.put("totalMoney", listtime.get(i).get("totalMoney"));
							dateMaps.add(dateMap);
							list.remove(j);
							break;
						}
					}
				} 
		}
		for (int i = 0; i < list.size(); i++) {
			dateMap = new HashMap();
			dateMap.put("date",list.get(i).toString());
			dateMap.put("totalMoney",0.0000);
			dateMaps.add(dateMap);
		}
		CalendarUtil.sorts(dateMaps);
		return dateMaps;
	 
	}
	
	/**
	 * 
	 * 按时间段查询每天的收入总和场所线下总和
	 * @param siteId ,startTime,endTime
	 * @throws ParseException 
	 */
	 
	public List<Map<String,Object>> getSiteLineInCome(String siteId,String startTime,String endTime) throws ParseException{
		String sql = "SELECT DATE_FORMAT(create_time,'%Y-%m-%d') date,SUM(transaction_amount) totalMoney FROM t_site_income"
				+ " WHERE site_id = ? AND portal_user_name NOT LIKE '0%' AND create_time BETWEEN ? AND ? GROUP BY  DATE_FORMAT(create_time,'%Y-%m-%d')";
		List<Map<String,Object>> listtime = jdbcTemplate.queryForList(sql,new Object[]{siteId,startTime+" 00:00:00",endTime+" 23:59:59"});
		List<String> list = CalendarUtil.getDayBetween(startTime,endTime);
		List<Map<String,Object>> dateMaps = new ArrayList();
		Map dateMap = null;
		for (int i = 0; i < listtime.size(); i++) {
				if(list.contains(listtime.get(i).get("date").toString().trim())){
					for (int j = 0; j <list.size(); j++) {
						if(list.get(j).equals(listtime.get(i).get("date").toString())){
							dateMap = new HashMap();
							dateMap.put("date",listtime.get(i).get("date").toString());
							dateMap.put("totalMoney", listtime.get(i).get("totalMoney"));
							dateMaps.add(dateMap);
							list.remove(j);
							break;
						}
					}
				} 
		}
		for (int i = 0; i < list.size(); i++) {
			dateMap = new HashMap();
			dateMap.put("date",list.get(i).toString());
			dateMap.put("totalMoney",0.0000);
			dateMaps.add(dateMap);
		}
		CalendarUtil.sorts(dateMaps);
		return dateMaps;
	 
	}
	/**
	 * 获得前十二个的每月的收入总和
	 * 
	 * @param siteId
	 */
	 
	public List<Map<String,Object>> getTotalMonthlyIncome(String siteId){
		String sql = "SELECT DATE_FORMAT(create_time,'%Y-%m') date ,SUM(transaction_amount) totalMoney from t_site_income"
				+ " WHERE site_id =? GROUP BY DATE_FORMAT(create_time,'%Y-%m') ORDER BY DATE_FORMAT(create_time,'%Y-%m') DESC LIMIT 0,12";
		List<Map<String,Object>> listtime = jdbcTemplate.queryForList(sql,new Object[]{siteId});
		List<String> list = CalendarUtil.getDateMonthList();
		List<Map<String,Object>> dateMaps = new ArrayList();
		Map dateMap = null;
		for (int i = 0; i < listtime.size(); i++) {
				if(list.contains(listtime.get(i).get("date").toString().trim())){
					for (int j = 0; j <list.size(); j++) {
						if(list.get(j).equals(listtime.get(i).get("date").toString())){
							dateMap = new HashMap();
							dateMap.put("date",(listtime.get(i).get("date").toString()+"月"));
							dateMap.put("totalMoney", listtime.get(i).get("totalMoney"));
							dateMaps.add(dateMap);
							list.remove(j);
							break;
						}
					}
				} 
		}
		for (int i = 0; i < list.size(); i++) {
			dateMap = new HashMap();
			dateMap.put("date",(list.get(i).toString()+"月"));
			dateMap.put("totalMoney",0.0000);
			dateMaps.add(dateMap);
		}
		CalendarUtil.sort(dateMaps);
		return dateMaps;
	}
	
	public List<Map<String,Object>> getTotalMonthlyIncome(){
		String sql = "SELECT DATE_FORMAT(create_time,'%Y-%m') date ,SUM(transaction_amount) totalMoney from t_site_income"
				+ " GROUP BY DATE_FORMAT(create_time,'%Y-%m') ORDER BY DATE_FORMAT(create_time,'%Y-%m') DESC LIMIT 0,12";
		List<Map<String,Object>> listtime = jdbcTemplate.queryForList(sql,new Object[]{});
		List<String> list = CalendarUtil.getDateMonthList();
		List<Map<String,Object>> dateMaps = new ArrayList();
		Map dateMap = null;
		for (int i = 0; i < listtime.size(); i++) {
				if(list.contains(listtime.get(i).get("date").toString().trim())){
					for (int j = 0; j <list.size(); j++) {
						if(list.get(j).equals(listtime.get(i).get("date").toString())){
							dateMap = new HashMap();
							dateMap.put("date",(listtime.get(i).get("date").toString()+"月"));
							dateMap.put("totalMoney", listtime.get(i).get("totalMoney"));
							dateMaps.add(dateMap);
							list.remove(j);
							break;
						}
					}
				} 
		}
		for (int i = 0; i < list.size(); i++) {
			dateMap = new HashMap();
			dateMap.put("date",(list.get(i).toString()+"月"));
			dateMap.put("totalMoney",0.0000);
			dateMaps.add(dateMap);
		}
		CalendarUtil.sort(dateMaps);
		return dateMaps;
	}
	
	/**
	 * 查询传入的年份每月的总收入
	 * 
	 * @param siteId
	 * @throws ParseException 
	 */
	 
	public List<Map<String,Object>> getMonthlyIncome(String siteId,String year) throws ParseException{
		String sql = "SELECT DATE_FORMAT(create_time,'%Y-%m') date,SUM(transaction_amount) totalMoney from t_site_income WHERE site_id=? AND (DATE_FORMAT(create_time,'%Y')=?  OR  DATE_FORMAT(create_time,'%Y')=?) and create_time<?  GROUP BY DATE_FORMAT(create_time,'%Y-%m')";
		List<Map<String,Object>> listtime = jdbcTemplate.queryForList(sql,new Object[]{siteId,year.split("-")[0],Integer.valueOf(year.split("-")[0])-1,this.reYearAndMonth(year)});
		List<String> list = CalendarUtil.getMonth(year);
		List<Map<String,Object>> dateMaps = new ArrayList();
		Map dateMap = null;
		for (int i = 0; i < listtime.size(); i++) {
				if(list.contains(listtime.get(i).get("date").toString().trim())){
					for (int j = 0; j <list.size(); j++) {
						if(list.get(j).equals(listtime.get(i).get("date").toString())){
							dateMap = new HashMap();
							dateMap.put("date",(listtime.get(i).get("date").toString()+"月"));
							dateMap.put("totalMoney", listtime.get(i).get("totalMoney"));
							dateMaps.add(dateMap);
							list.remove(j);
							break;
						}
					}
				} 
		    }
		
		for (int i = 0; i < list.size(); i++) {
			dateMap = new HashMap();
			dateMap.put("date",(list.get(i).toString()+"月"));
			dateMap.put("totalMoney",0.0000);
			dateMaps.add(dateMap);
		}
		CalendarUtil.sort(dateMaps);
		return dateMaps;
	}
	
	/**
	 * 查询传入的年份每月的线下总收入
	 * 
	 * @param siteId
	 * @throws ParseException 
	 */
	 
	public List<Map<String,Object>> getOffMonthlyIncome(String siteId,String year) throws ParseException{
		String sql = "SELECT DATE_FORMAT(create_time,'%Y-%m') date,SUM(transaction_amount) totalMoney from t_site_income WHERE site_id=? AND portal_user_name like '0%' AND (DATE_FORMAT(create_time,'%Y')=? OR  DATE_FORMAT(create_time,'%Y')=?) and create_time<?  GROUP BY DATE_FORMAT(create_time,'%Y-%m')";
		List<Map<String,Object>> listtime = jdbcTemplate.queryForList(sql,new Object[]{siteId,year.split("-")[0],Integer.valueOf(year.split("-")[0])-1,this.reYearAndMonth(year)});
		List<String> list = CalendarUtil.getMonth(year);
		List<Map<String,Object>> dateMaps = new ArrayList();
		Map dateMap = null;
		for (int i = 0; i < listtime.size(); i++) {
				if(list.contains(listtime.get(i).get("date").toString().trim())){
					for (int j = 0; j <list.size(); j++) {
						if(list.get(j).equals(listtime.get(i).get("date").toString())){
							dateMap = new HashMap();
							dateMap.put("date",(listtime.get(i).get("date").toString()+"月"));
							dateMap.put("totalMoney", listtime.get(i).get("totalMoney"));
							dateMaps.add(dateMap);
							list.remove(j);
							break;
						}
					}
				} 
		    }
		
		for (int i = 0; i < list.size(); i++) {
			dateMap = new HashMap();
			dateMap.put("date",(list.get(i).toString()+"月"));
			dateMap.put("totalMoney",0.0000);
			dateMaps.add(dateMap);
		}
		CalendarUtil.sort(dateMaps);
		return dateMaps;
	}
	/**
	 * 查询传入的年份每月的线上总收入
	 * 
	 * @param siteId
	 * @throws ParseException 
	 */
	 
	public List<Map<String,Object>> getLineMonthlyIncome(String siteId,String year) throws ParseException{
		String sql = "SELECT DATE_FORMAT(create_time,'%Y-%m') date,SUM(transaction_amount) totalMoney from t_site_income WHERE site_id=? and portal_user_name not like '0%' AND (DATE_FORMAT(create_time,'%Y')=? OR  DATE_FORMAT(create_time,'%Y')=?) and create_time<?  GROUP BY DATE_FORMAT(create_time,'%Y-%m')";
		List<Map<String,Object>> listtime = jdbcTemplate.queryForList(sql,new Object[]{siteId,year.split("-")[0],Integer.valueOf(year.split("-")[0])-1,this.reYearAndMonth(year)});
		List<String> list = CalendarUtil.getMonth(year);
		List<Map<String,Object>> dateMaps = new ArrayList();
		Map dateMap = null;
		for (int i = 0; i < listtime.size(); i++) {
				if(list.contains(listtime.get(i).get("date").toString().trim())){
					for (int j = 0; j <list.size(); j++) {
						if(list.get(j).equals(listtime.get(i).get("date").toString())){
							dateMap = new HashMap();
							dateMap.put("date",(listtime.get(i).get("date").toString()+"月"));
							dateMap.put("totalMoney", listtime.get(i).get("totalMoney"));
							dateMaps.add(dateMap);
							list.remove(j);
							break;
						}
					}
				} 
		    }
		
		for (int i = 0; i < list.size(); i++) {
			dateMap = new HashMap();
			dateMap.put("date",(list.get(i).toString()+"月"));
			dateMap.put("totalMoney",0.0000);
			dateMaps.add(dateMap);
		}
		CalendarUtil.sort(dateMaps);
		return dateMaps;
	}
	 /**
	 * @Description  将传过来的字符串时间加上一个月
	 * @date 2016年8月18日下午4:26:45
	 * @author guoyingjie
	 * @param year
	 * @return
	 */
	public static String reYearAndMonth(String year){
		try {
			Date date = new SimpleDateFormat("yyyy-MM").parse(year);
			Calendar d = Calendar.getInstance();
			d.setTime(date);
			d.add(Calendar.MONTH, 1);
			return new SimpleDateFormat("yyyy-MM").format(d.getTime());
		} catch (ParseException e) {
		   log.error("转化失败");
		   return null;
		}
		
	}
	
	/**
	 * 根据场所获得场所名字
	 * 
	 * @param siteId
	 * @return siteName;
	 */
	public String getSiteName(String siteId) {
		CloudSite cloudSite = nutDao.fetch(CloudSite.class,
				Cnd.where("id", "=", siteId));
		return cloudSite.getSite_name();
	}
	
	/**
	 * 被多台设备登录用户列表
	 * 
	 * @param siteId
	 * @return list or null
	 */
	public List<Map<String, Object>> getManyPoepleUserTelephone(String siteId) {
		List<Map<String, Object>> list = null;
		String tablename = "radacct" ;
		try {
			String sql = "select COUNT(DISTINCT callingstationid) marchNum,username,COUNT(DISTINCT callingstationid) peoNum ,(SELECT site_id from t_cloud_site_routers where nasid=ra.nasid) userId  from "
					+ tablename 
					+ " ra  where  nasid in (SELECT nasid FROM t_cloud_site_routers WHERE site_id ="
					+ siteId
					+ ") GROUP BY username HAVING peoNum>1 ORDER BY marchNum DESC LIMIT 0,5";
			list = jdbcTemplate.queryForList(sql);

		} catch (Exception e) {
			log.error("获取被多台设备登录用户列表-----" + e);
		}
		return list;
	}

	/**
	 * 当前的场所下昨天登录的人数
	 * 
	 * @param siteId
	 * @return
	 */
	 
	public Integer getYesterdayLoginPeopleNum(String siteId) {
		Integer count = 0;
		Calendar clendar = Calendar.getInstance();
		clendar.add(Calendar.DATE, -1);
		SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");
		String tablename = "radacct_" + sdf.format(clendar.getTime());
		String table = "select TABLE_NAME from INFORMATION_SCHEMA.TABLES where TABLE_NAME='"+tablename+"'";
		List<String> isTable = jdbcTemplate.queryForList(table,String.class);
		if(isTable!=null&&isTable.size()!=0){
		   try {
			   String sql = "SELECT COUNT(radacctid) as num FROM "+tablename+" WHERE nasid in(SELECT nasid  FROM t_cloud_site_routers WHERE site_id = ?)";
			count = jdbcTemplate.queryForInt(sql,new Object[] { siteId });
	    	} catch (Exception e) {
			    return 0;
		    }
	    }
		return count;
	}

	/**
	 * 重点推广用户列表
	 * 
	 * @param siteId
	 *            在jsp循环的时候把t.id自定义属性循环进去,方便拿到用户的id;
	 */
	public List<Map<String, Object>> getKeyEscrowUser(String siteId) {
		String sqlkey = "SELECT portal_user_name user_name ,COUNT(id) frequency,site_id siteId, portal_user_id id FROM t_site_income"
				+ " WHERE site_id = ?  GROUP BY portal_user_id  ORDER BY COUNT(id) DESC LIMIT 0,5";
		return jdbcTemplate.queryForList(sqlkey, new Object[] { siteId }) == null ? null
				: jdbcTemplate.queryForList(sqlkey, new Object[] { siteId });
	}

	/**
	 * 获的用户下的缴费记录
	 * 
	 * @param userId
	 * @return
	 */
	public List<Map<String, Object>> getPayRecord(Integer userId, String siteId) {
		String sql = "SELECT transaction_amount amount ,create_time time from t_site_income WHERE site_id =? "
				+ " AND portal_user_id = ? ORDER BY create_time DESC LIMIT 0,5";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql,new Object[] {siteId ,userId});
		List<Map<String, Object>> lists = new ArrayList<>();
		int size = list.size();
		for (int i = 0; i < size; i++) {
			Map<String, Object> map = new HashMap<>();
				String time = String.valueOf(list.get(i).get("time")).replace(".0", "").trim();
				String amount = String.valueOf(list.get(i).get("amount")).trim();
				map.put("time", time);
				map.put("amount", amount);
			lists.add(map);
		}
		return lists != null ? lists : null;
	}

	/**
	 * 根据场所id和paytype获取场所对应的价格配置信息,该配置必须is_stoped=0
	 * 
	 * @param siteId
	 * @param paytype
	 * @return
	 */
	public SitePriceConfig getSitePriceInfos(int siteId, int paytype) {
		SitePriceConfig priceInfo = nutDao.fetch(
				SitePriceConfig.class,
				Cnd.where("site_id", "=", siteId).and("id", "=", paytype)
						.and("is_stoped", "=", 0));
		return priceInfo;
	}

	/**
	 * 获得场所下的价格配置表的价格配置
	 * 
	 * @param siteId
	 */
	 
	public List<Map<String, Object>> getTypeProportion(String siteId) {
		List<Map<String, Object>> type = new ArrayList<Map<String, Object>>();
		try {
			// 获得场所下的缴费记录
			String sql = "SELECT param_json json FROM t_sitepayment_records WHERE  site_id=? AND finish_time IS NOT NULL AND param_json REGEXP '^{' ORDER BY  finish_time DESC LIMIT 0,500";
			List<Map<String, Object>> list = jdbcTemplate.queryForList(sql,new Object[] { siteId });
			// 场所下的未停用的计费规格
			List<SitePriceConfig> priceInfo = nutDao.query(SitePriceConfig.class, Cnd.where("site_id", "=", siteId).and("is_stoped", "=", 0));
			if (priceInfo.size() > 0 && priceInfo != null) {
				for (int i = 0; i < priceInfo.size(); i++) {
					Map map = new HashMap();
					int index = 1;
					if (list.size() > 0 && list != null) {
						for (int j = 0; j < list.size(); j++) {
							String jsonparam = String.valueOf(list.get(j).get("json"));
							if (jsonparam != null && !("".equals(jsonparam))) {
								JSONObject json = JSONObject.fromObject(jsonparam);
								//获得价格配置变的id从而获得本条记录
								int payType = Integer.valueOf((json.get("payType") + "").trim());
								SitePriceConfig sc = nutDao.fetch(SitePriceConfig.class,Cnd.where("id", "=", payType));
								if(sc!=null){
								//是否有融合套餐号码段
								String comboNum = sc.getComboNumber();
								if(comboNum!=null){
									if (priceInfo.get(i).getId() == payType) {
										// 记录每个缴费类型 如果有融合套餐缴费类型名字加上融合套餐
										// priceInfo.get(i).getName() 值是唯一的
										map.put(priceInfo.get(i).getName()+"(融合套餐)", index++);
									}
								}else{
									if (priceInfo.get(i).getId() == payType) {
										// 记录每个缴费类型 如果没有融合套餐就是普通的套餐
										// priceInfo.get(i).getName() 值是唯一的
										map.put(priceInfo.get(i).getName(), index++);
									}
								}
     						  }
						   }
						}
					}
					// 只有计费类型不为空的情况下才可以加入
					if (map.size() > 0 && map != null) {
						type.add(map);
					}
				}
			}
			// 装载计费规则
			List<Map<String, Object>> count = new ArrayList();
			if (type.size() > 0 && type != null) {
				int a = 0;
				Map mapcount = new HashMap();
				for (int i = 0; i < type.size(); i++) {
					Map maps = new HashMap();
					for (Entry<String, Object> entry : type.get(i).entrySet()) {
						maps.put("payType", entry.getKey());
						maps.put("payCount", entry.getValue());
						a += Integer.valueOf((entry.getValue() + "").trim());
					}
					count.add(maps);
				}
				// 存入总的缴费人数
				mapcount.put("totalCount", a);
				count.add(mapcount);
				// return count;
			}
			List finalResult = new ArrayList();
			if (count.size() > 0 && count != null) {
				for (int i = 0; i < count.size() - 1; i++) {
					Map mapFinalResult = new HashMap();
					mapFinalResult.put("finalName", count.get(i).get("payType"));
					mapFinalResult.put("finalCount",count.get(i).get("payCount"));
					int f = Integer.valueOf((count.get(i).get("payCount") + "").trim());
					int fina = Integer.valueOf((count.get(count.size() - 1).get("totalCount") + "").trim());
					double finalB = f * 0.01 / fina;
					DecimalFormat df = new DecimalFormat("######0.0000");
					String finalBili = df.format(finalB * 100);
					mapFinalResult.put("finalBili", Float.valueOf(finalBili));
					finalResult.add(mapFinalResult);
				}
				return finalResult;
			}
		} catch (Exception e) {
			log.error("场所下的价格配置表的价格配置异常", e);
			return null;
		}
		return null;
	}

	/**
	 * @Description  获得缴费类型占比
	 * @date 2016年10月21日下午12:11:41
	 * @author guoyingjie
	 * @param siteId
	 * @return
	 */
	public List<Map<String, Object>> getTypeEvery(String siteId){
		String sqlSite = "SELECT COUNT(pay_name) finalCount,pay_name finalName FROM t_site_income where  site_id =? AND pay_name NOT IN(SELECT NAME FROM t_site_price_config  WHERE  site_id=? AND is_stoped=1) and pay_name <> '0' GROUP BY pay_name ";
		String sqlSiteAll = "SELECT SUM(s.num) totalCount FROM (SELECT COUNT(pay_name) num FROM t_site_income where  site_id = ? and pay_name <> '0' AND pay_name NOT IN(SELECT NAME FROM t_site_price_config  WHERE  site_id=? AND is_stoped=1) GROUP BY pay_name) s";
		List<Map<String, Object>> sitecount = null;
		List<Map<String, Object>> allcount = null;
		
		int sum = 0;
		try {
			List<Map<String, Object>> finalResult = new ArrayList();
			sitecount = jdbcTemplate.queryForList(sqlSite,siteId,siteId);
			allcount = jdbcTemplate.queryForList(sqlSiteAll,siteId,siteId);// 场所下所有缴费类型总数   new Object[] { siteId }
			sum = Integer.valueOf(allcount.get(0).get("totalCount")==null?"0":allcount.get(0).get("totalCount") + "");
			for (int i = 0; i < sitecount.size(); i++) {
				int count = Integer.valueOf(sitecount.get(i).get("finalCount")+"");
				String name = sitecount.get(i).get("finalName") + "";
				Map mapFinalResult = new HashMap();
				mapFinalResult.put("finalName", name);
				mapFinalResult.put("finalCount", count);
				double finalB = count * 0.01 / sum;
				DecimalFormat df = new DecimalFormat("######0.0000");
				String finalBili = df.format(finalB * 100);
				mapFinalResult.put("finalBili", Float.valueOf(finalBili));
				finalResult.add(mapFinalResult);
			}
			return finalResult;
		} catch (Exception e) {
			e.printStackTrace();
			log.error(this.getClass().getCanonicalName());
		}
		return null;
	}
	
	
	
	/**
	 * 定时添加缴费类型的数据(定时的方法)
	 */
	public void TiminggetTypeData() {
		try {
			getGrowthDataTimmer();// 当前用户下所有场所的每天的用户增长趋势
			String sql = "SELECT id FROM t_cloud_site";
			List<String> list = jdbcTemplate.queryForList(sql, String.class);
			for (int i = 0; i < list.size(); i++) {
				String siteId = list.get(i);
				addSubscriberGrowths(siteId);// 单一场所每天的用户增长趋势
				/*List<Map<String, Object>> json = getTypeProportion(siteId);
				if (json != null) {
					JSONArray jsons = JSONArray.fromObject(json);
					String jsonss = jsons.toString();
					String sqls = "SELECT id FROM type_datas WHERE site_id = ?";
					List<Map<String, Object>> typeId = jdbcTemplate.queryForList(sqls, new Object[] { siteId });
					if (typeId.size() > 0 && typeId != null) {
						String sqlup = "UPDATE type_datas SET type_data=?,create_time=? WHERE site_id = ?  AND create_time < DATE_SUB(NOW(),INTERVAL 2 HOUR)";
						jdbcTemplate.update(sqlup,new Object[] {jsonss,new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date()), siteId });
					} else {
						String sqlup = "INSERT INTO type_datas (type_data,site_id,create_time) VALUES(?,?,?)";
						jdbcTemplate.update(sqlup,new Object[] {jsonss,siteId,new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date())});
					}
				}*/
			}
		} catch (Exception e) {
			log.error("定时获取数据类型出错!" + e);
		}
		 
	}
	/**
	 * 当前用户下的所有场所每天的用户增长数据(定时的方法)
	 */
	public void getGrowthDataTimmer() {
		try {
			List<Map<String,Object>> lists = null;
			StringBuffer sbNew = null;
			StringBuffer sbs = null;    
			StringBuffer sb = null;
			Map map = null;
			String sql = "SELECT user_id FROM t_cloud_site GROUP BY user_id";
			List<Integer> list = jdbcTemplate.queryForList(sql, Integer.class);
			for (int i = 0; i < list.size(); i++) {
				sb = new StringBuffer();
				lists = new ArrayList<>();
				Integer userId = list.get(i);
			    List<Map<String,Object>> grow = queryGrowDate(userId);
			    if(grow.size()!=0&&grow!=null){
			    	 Integer num = Integer.valueOf((grow.get(0).get("num")+"").trim());
			    	 String date = String.valueOf(grow.get(0).get("date"));
			    	 sb.append(num).append("=").append(date);
				     map = new HashMap();
				     map.put("date", date);
				     map.put("num",num);
				     lists.add(map);
					 List<Map<String, Object>> userGrow = getGrowDate(userId);
					 if(userGrow.size()!=0&&userGrow!=null&&userGrow.get(0).get("grow")!=null&&!("".equals(userGrow.get(0).get("grow")))){
						    String[] str = (userGrow.get(0).get("grow")+"").trim().split(",");
							for (int j = 0; j < str.length; j++) {
								map = new HashMap();
								String dates = String.valueOf((str[j].split("=")[1]+"").trim());
								Integer nums = Integer.valueOf((str[j].split("=")[0]+"").trim());
								map.put("date",dates);
								map.put("num", nums);
								lists.add(map);
							}
							if(lists.size()>14){
								//按时间升序排列
							     CalendarUtil.sorts(lists);
								 sbs = new StringBuffer();    
								 sbNew = new StringBuffer();
								 for (int k = lists.size()-1; k >=0 ; k--) {
										 String datek = String.valueOf((lists.get(k).get("date")+"").trim());
										 Integer numk = Integer.valueOf((lists.get(k).get("num")+"").trim());
										 sbs.append(numk).append("=").append(datek).append(",");
								 }
								 String strNew[] = sbs.toString().split(",");
								 for (int j = 0; j < strNew.length; j++) {
									 if(j>13){
										 break;
									 }
									 sbNew.append(strNew[j]).append(",");
								 }
								 updateSql(sbNew.toString(),userId);
							 }else{
								 updateCurrentSql(sb.toString(),userId);
							 }
				 }else{
					 insertCurrentSql(sb.toString()+",",userId);
				 }
			   }
			}   
		} catch (Exception e) {
			log.error(this.getClass().getCanonicalName()+":获取用户下所有场所用户增长趋势数据异常!" + e);
		}
	}
	
	/**
	 * @Description  获得当前的用户增长趋势
	 * @param userId
	 * @return
	 */
	@Mock
	public List<Map<String, Object>> getGrowDate(int userId){
		try {
			String isUserData = "SELECT user_growth_data grow from type_datas WHERE user_id = ?";
			List<Map<String, Object>> userGrow = jdbcTemplate.queryForList(isUserData,new Object[]{userId});
			return userGrow;
		} catch (Exception e) {
			log.error("获得用户增长数据异常",e);
			return null;
		}
	}
	/**
	 * @Description 获得用户当天的增长趋势
	 * @param userId
	 * @return
	 */
	public List<Map<String,Object>> queryGrowDate(int userId){
		try {
			String sqls = "SELECT COUNT(*) num,DATE_FORMAT(NOW(),'%Y-%m-%d') date from t_site_customer_info "
					+ "WHERE expiration_time  >= date_sub(now(),interval 14 day) AND site_id IN (SELECT id"
					+ " FROM t_cloud_site WHERE user_id =?)"; 
			List<Map<String,Object>> grow = jdbcTemplate.queryForList(sqls,new Object[]{userId});
			return grow;
		} catch (Exception e) {
			log.error("获得用户当天的增长数据出现错误",e);
			return null;
		}
	}
	/**
	 * @Description  更新定时数据 定时时重新组装数据更换原来的数据,以防字段过长抛出异常
	 * @param data
	 * @param userId
	 */
	 public void updateSql(String data,int userId){
		 try {
			 String updateSql = "UPDATE type_datas  SET user_growth_data=?,create_time=NOW() WHERE user_id = ? AND create_time < DATE_SUB(NOW(),INTERVAL 2 HOUR) ";
			 jdbcTemplate.update(updateSql,new Object[]{data,userId});
		} catch (Exception e) {
		   log.error("更新定时数据出现错误",e);
		}
	 }
	 /**
		 * @Description  更新定时数据在原来的字段上增加当天的数据
		 * @param data
		 * @param userId
		 */
		 public void updateCurrentSql(String data,int userId){
			 try {
				 String updateSql = "UPDATE type_datas  SET user_growth_data=CONCAT(user_growth_data,?,','),create_time=NOW() WHERE user_id = ? AND create_time < DATE_SUB(NOW(),INTERVAL 2 HOUR)";
				 jdbcTemplate.update(updateSql,new Object[]{data,userId});
			} catch (Exception e) {
			   log.error("更新定时数据在原来的字段递增数据出现错误",e);
			}
		 }
		/**
		 * @Description  当前用户没有增长数据时添加新的数据
		 * @param data
		 * @param userId
		 */
		 public void insertCurrentSql(String data,int userId){
				 try {
					 String insertSql = "INSERT INTO type_datas (type_data,site_id,create_time,user_growth_data,user_id) VALUES ('none','allsite',NOW(),?,?)";
					 jdbcTemplate.update(insertSql,new Object[]{data,userId});
				} catch (Exception e) {
				   log.error("添加增长数据出现错误",e);
				}
			 }
	/**
	 * 获取按类型缴费的数据
	 * 
	 * @param siteId
	 * @return
	 */
 
	public List<Map<String, Object>> getTypeDataJson(String siteId) {
		try {
			String sql = "SELECT type_data from type_datas WHERE site_id = ?";
			String json = jdbcTemplate.queryForObject(sql, String.class,new Object[] { siteId });
			if (json != null && !("".equals(json))) {
				List<Map<String, Object>> list = null;
				JSONArray arr = JSONArray.fromObject(json);
				list = arr.toList(arr, Map.class);
				if (list.size() > 0 && list != null) {
					return list;
				}
			}
			return null;
		} catch (Exception e) {
			return null;
		}
	}

	 
	/**
	 * 获得用户增长趋势数据
	 * 
	 * @param siteId
	 */
	 
	public List<Map<String, Object>> getSubscriberGrowth(String siteId) {
		List<Map<String, Object>> list = new ArrayList();
		Map map = null;
				
		String sqlinsert = "SELECT user_growth_data grow from type_datas WHERE site_id = ?";
		List<Map<String,Object>> userGrow = jdbcTemplate.queryForList(sqlinsert, new Object[]{siteId});
		if(userGrow!=null&&userGrow.size()>0&&userGrow.get(0).get("grow")!=null&&!("".equals(userGrow.get(0).get("grow")))){
			for (int i = 0; i < userGrow.size(); i++) {
				String grow = (userGrow.get(i).get("grow")+"").trim();
				String[] str = grow.split(",");
				for (int j = 0; j < str.length; j++) {
					map = new HashMap();
					String date = String.valueOf((str[j].split("=")[1]+"").trim());
					Integer num = Integer.valueOf((str[j].split("=")[0]+"").trim());
					map.put("date",date);
					map.put("num", num);
					list.add(map);
				}
			}
			CalendarUtil.sorts(list);//按时间升序排列
			return list;
		}else{
			map = new HashMap();
			map.put("num",0);
			map.put("date", new SimpleDateFormat("yyyy-MM-dd").format(new Date()));
			list.add(map);
			return list;
		}
	}

	/**
	 * 添加当前场所的用户增长趋势数据入type_datas库
	 * @param siteId
	 */
	public void addSubscriberGrowths(String siteId) {
		try {
			String sql = "SELECT COUNT(*) num,DATE_FORMAT(NOW(),'%Y-%m-%d') date from t_site_customer_info WHERE "
					+ "expiration_time  >= date_sub(now(),interval 14 day) AND site_id=?";
			log.error(siteId+"------------siteId----------"+sql);
			List<Map<String,Object>> list = jdbcTemplate.queryForList(sql,new Object[]{siteId});
			StringBuffer sb = new StringBuffer();
			Map map = new HashMap();
			if(list.size()!=0&&list!=null){
				for (int i = 0; i <list.size(); i++) {
					String num = String.valueOf((list.get(i).get("num")+"").trim());
					String date = (list.get(i).get("date")+"").trim();
					sb.append(num).append("=").append(date);
					map.put("date",date);
					map.put("num", num);
				}
				String data = sb.toString();//这个是没有逗号的数据
				inserOrUpdateGrowDate(data,siteId,map);
			} 
		} catch (Exception e) {
			log.error(this.getClass().getCanonicalName()+" : addSubscriberGrowths定时增加用户增长趋式数据异常!",e);
		}
	}
	
	/**
	 * 判断是否有用户增加趋势数据,如果有在原来的基础上添加,没有则直接insert
	 * @param siteId
	 */
	public void inserOrUpdateGrowDate(String data,String siteId,Map map){
		//判断是否有增长数据
		  List<Map<String,Object>> lists = new ArrayList();
		  lists.add(map);
		  String sqlinsert = "SELECT user_growth_data grow from type_datas WHERE site_id = ?";
		  List<Map<String,Object>> userGrow = jdbcTemplate.queryForList(sqlinsert, new Object[]{siteId});
		  if(userGrow!=null&&userGrow.size()!=0&&userGrow.get(0).get("grow")!=null&&!("".equals(userGrow.get(0).get("grow")))){
			    String[] str = (userGrow.get(0).get("grow")+"").trim().split(",");
				for (int j = 0; j < str.length; j++) {
					map = new HashMap();
					if(str[j].contains("=")){
						String date = String.valueOf((str[j].split("=")[1]+"").trim());
						Integer num = Integer.valueOf((str[j].split("=")[0]+"").trim());
						map.put("date",date);
						map.put("num", num);
						lists.add(map);
					}
					
				}
				if(lists.size()>14){
					//按时间升序排列
				     CalendarUtil.sorts(lists);
					 StringBuffer sbs = new StringBuffer();    
					 StringBuffer sbNew = new StringBuffer();
					 for (int k = lists.size()-1; k >=0 ; k--) {
							 String datek = String.valueOf((lists.get(k).get("date")+"").trim());
							 Integer numk = Integer.valueOf((lists.get(k).get("num")+"").trim());
							 sbs.append(numk).append("=").append(datek).append(",");
					 }
					 String strNew[] = sbs.toString().split(",");
					 for (int j = 0; j < strNew.length; j++) {
						 if(j>13){
							 break;
						 }
						 sbNew.append(strNew[j]).append(",");
					 }
					 String updateSql = "UPDATE type_datas  SET user_growth_data=?,create_time=NOW() WHERE site_id = ? AND create_time < DATE_SUB(NOW(),INTERVAL 2 HOUR)";
					 jdbcTemplate.update(updateSql,new Object[]{sbNew.toString(),siteId});
				}else{
					updateTypeDate(data,siteId);
				}
		  }else{
			 insertTypeDate(data+",",siteId);
		  }
	}
	
	/**
	 * 如果用户增长数据存在执行此方法
	 * @param siteId
	 */
	public void updateTypeDate(String data,String siteId){
		 String sqlupdate = "UPDATE type_datas  SET user_growth_data=CONCAT(user_growth_data,?,','),create_time=NOW() WHERE site_id = ? AND create_time < DATE_SUB(NOW(),INTERVAL 2 HOUR)";
		  jdbcTemplate.update(sqlupdate,new Object[]{data,siteId});
	}
	/**
	 * 如果用户增长数据不存在在执行此方法
	 * @param siteId
	 */
	public void insertTypeDate(String data,String siteId){
		String sqlinsert="INSERT INTO type_datas (site_id,user_growth_data,create_time) VALUES (?,?,NOW())";
		 //String sqlupdate = "UPDATE type_datas SET user_growth_data = ? WHERE site_id = ?";
		  jdbcTemplate.update(sqlinsert,new Object[]{siteId,data});
	}
	
	
	
	
	/**
	 * 获得当前场所下的已经支付的人数未支付人数
	 * 
	 * @param siteId
	 * @return
	 */
	 
	public String getPayNotPay(String siteId) {
		String payAndNotPay = "";
		String sqlTotal = "SELECT siteNum from t_cloud_site WHERE id=?";
		int siteNum = jdbcTemplate.queryForInt(sqlTotal,
				new Object[] { siteId });
		String sql = "SELECT COUNT(id) FROM t_site_customer_info WHERE site_id=?";
		int payCount = jdbcTemplate.queryForInt(sql, new Object[] { siteId });
		if (payCount > 0) {
			payAndNotPay = String.valueOf(payCount) + "/"
					+ String.valueOf(siteNum - payCount);
		} else {
			payAndNotPay = "0/" + String.valueOf(siteNum);
		}
		return payAndNotPay;
	}
	 
	
	/**
	 * 缴费注册率 = 昨天注册并且缴费的人数/昨天注册人数
	 * 
	 * @param siteId
	 * @return
	 */
 
	public Map getPayOrNotPay(String siteId) {
		String payNotPay = "";
		Float f = 0.00f;
		// 获得昨天已经注册并且缴费的人数
		int payCount = getYesterdayPayAndRegisterNum(siteId);
		// 获得昨天注册人数
		int registerNum = getTotalYesterdayRegisterNum(siteId);
		Map map = new HashMap();
		if (payCount > 0 && registerNum > 0) {
			double d = payCount * 0.01 / registerNum;
			DecimalFormat df = new DecimalFormat("######0.0000");
			payNotPay = df.format(d * 100);
			f = Float.valueOf(payNotPay);
			map.put("pay", f);
			// map.put("notPay",1-f);
		} else {
			map.put("pay", 0.00);
		}
		return map;
	}

	/**
	 * 当前场所的体验终端数
	 * 
	 * @param siteId
	 * @return
	 */
	 
	public String getTryNotTryPoepleCount(String siteId) {
		String tryAndNotTry = "";
		String sql = "select ttt.num from (SELECT COUNT(id) as num from t_site_customer_info tt,(SELECT id as portal_id from t_portal_user where id in(select portal_id from t_cloud_site_portal WHERE site_id =?)) tu WHERE tt.portal_user_id=tu.portal_id AND tt.is_try = 1) ttt";
		int tryCount = jdbcTemplate.queryForInt(sql, new Object[] { siteId });
		if (tryCount > 0) {
			tryAndNotTry = String.valueOf(tryCount);
		} else {
			tryAndNotTry = "0";
		}
		return tryAndNotTry;

	}

	/**
	 * 当前场所的试用人数未试用人数 网络感知度
	 * 
	 * @param siteId
	 * @return
	 */
 
	public Map getTryOrNot(String siteId) {
		String tryAndNotTry = "";
		String sqlTotal = "SELECT siteNum from t_cloud_site WHERE id=?";
		int siteNum = jdbcTemplate.queryForInt(sqlTotal,
				new Object[] { siteId });
		// 获得体验终端数
		int tryCount = Integer.valueOf(getTryNotTryPoepleCount(siteId));
		Map map = new HashMap<>();
		if (tryCount > 0 && siteNum > 0) {
			double d = tryCount * 0.01 / siteNum;
			DecimalFormat df = new DecimalFormat("######0.0000");
			tryAndNotTry = df.format(d * 100);
			Float yesTry = Float.valueOf(tryAndNotTry);
			map.put("yesTry", yesTry);
		} else {
			map.put("yesTry", 0.00);
		}
		return map;
	}

	/**
	 * 获得场所总人数
	 * 
	 * @param siteId
	 * @return
	 */
	 
	public int getSiteNum(String siteId) {
		String sqlTotal = "SELECT siteNum from t_cloud_site WHERE id=?";
		return jdbcTemplate.queryForInt(sqlTotal, new Object[] { siteId });
	}

	/**
	 * 获得场所的已注册/未注册人员
	 * 
	 * @param siteId
	 * @return registerOrNot;
	 */
	public String getRegisterNum(String siteId) {
		String registerOrNot = "";
		int okRegisterNum = getTotalRegisterNum(siteId);
		int noRegisers = getSiteNum(siteId) - okRegisterNum;
		if (okRegisterNum > 0) {
			registerOrNot = String.valueOf(okRegisterNum) + "/"
					+ String.valueOf(noRegisers);
		} else {
			registerOrNot = "0/" + String.valueOf(getSiteNum(siteId));
		}
		return registerOrNot;
	}

	/**
	 * 当前场所的注册人数未注册人数 试用注册率 = 注册人数/试用总人数
	 * 
	 * @param siteId
	 * @return
	 */
	 
	public Map getRegisteOrNot(String siteId) {
		String regisers = "";
		Map map = new HashMap<>();
		// 注册总人数
		int regsterNum = getTotalRegisterNum(siteId);
		// 试用总人数
		int tryCount = Integer.valueOf(getTryNotTryPoepleCount(siteId));
		if (regsterNum > 0 && tryCount > 0) {
			double d = regsterNum * 0.01 / tryCount;
			DecimalFormat df = new DecimalFormat("######0.0000");
			regisers = df.format(d * 100);
			Float regisersYes = Float.valueOf(regisers);
			map.put("regisersYes", regisersYes);
		} else {
			map.put("regisersYes", 0.00);
		}
		return map;
	}
    
	/**
	 * 获得场所注册总人数
	 * 
	 * @param siteId
	 */
	 
	public int getTotalRegisterNum(String siteId) {
		String sql = "SELECT COUNT(d.id) num FROM t_cloud_site_portal d  WHERE d.site_id=?";
		int registerNum = 0;
		try {
			registerNum = jdbcTemplate.queryForInt(sql, new Object[] { siteId });
		} catch (Exception e) {
			log.error("获得场所注册总人数异常" + e);
		}
		return registerNum;
	}

	/**
	 * 获得场所昨日注册的人数
	 * 
	 * @param siteId
	 * @return
	 */
	 
	public int getTotalYesterdayRegisterNum(String siteId) {
		int yesterdayRegisterNum = 0;
		String sql = "SELECT COUNT(id) FROM t_cloud_site_portal WHERE site_id =? "
				   + "and create_time BETWEEN (SELECT date_sub(DATE_FORMAT(now(),"
				   + "'%Y-%m-%d 00:00:00'),interval 1 day))  AND (SELECT date_sub(DATE_FORMAT(now(),'%Y-%m-%d 23:59:59'),interval 1 day))";
		String sqls = "SELECT COUNT(id) from t_cloud_site_portal WHERE create_time BETWEEN date_sub(DATE_FORMAT(now(),'%Y-%m-%d 00:00:00'),interval 1 day) AND date_sub(DATE_FORMAT(now(),'%Y-%m-%d 23:59:59'),interval 1 day) AND site_id=?";
		
		try {
			yesterdayRegisterNum = jdbcTemplate.queryForInt(sqls,new Object[] { siteId});
		} catch (Exception e) {
			log.error("获得场所昨日注册的总人数异常" + e);
		}
		return yesterdayRegisterNum;
	}

	/**
	 * 获得昨天已经注册并且缴费的人数
	 * 
	 * @param siteId
	 * @return
	 */
 
	public int getYesterdayPayAndRegisterNum(String siteId) {
		int yesterdayPayAndRegisterNum = 0;
		String sql = "SELECT COUNT(id) FROM t_site_customer_info WHERE  portal_user_id in (SELECT portal_id from t_cloud_site_portal) "
				+ "AND create_time BETWEEN (select date_sub(DATE_FORMAT(now(),'%Y-%m-%d 00:00:00'),interval 1 day)) AND (select date_sub(DATE_FORMAT(now(),'%Y-%m-%d 23:59:59'),interval 1 day)) AND site_id = ?";
		String sqls ="SELECT COUNT(id) FROM t_site_income WHERE create_time BETWEEN date_sub(DATE_FORMAT(now(),'%Y-%m-%d 00:00:00'),interval 1 day) AND date_sub(DATE_FORMAT(now(),'%Y-%m-%d 23:59:59'),interval 1 day) AND site_id=? AND portal_user_id in(SELECT portal_id from t_cloud_site_portal WHERE create_time BETWEEN date_sub(DATE_FORMAT(now(),'%Y-%m-%d 00:00:00'),interval 1 day) AND date_sub(DATE_FORMAT(now(),'%Y-%m-%d 23:59:59'),interval 1 day) AND site_id=?)";
		try {
			yesterdayPayAndRegisterNum = jdbcTemplate.queryForInt(sqls,new Object[] { siteId ,siteId});
		} catch (Exception e) {
			log.error("获得昨天已经注册并且缴费的人数异常" + e);
		}
		return yesterdayPayAndRegisterNum;
	}
	
	/**
	 * @Description  单一场所时间段查询导出excel
	 * @date 2016年12月13日下午1:26:39
	 * @author guoyingjie
	 * @param startTime
	 * @param endTime
	 * @param siteId
	 */
	public void exportExcels(String startTime,String endTime,int siteId,HttpServletRequest request,HttpServletResponse response){
		String sql = "SELECT i.id,s.site_name,i.transaction_amount,i.portal_user_name,i.buy_num,i.pay_name,i.create_time,case i.pay_type WHEN 1 THEN '支付宝' WHEN 2 THEN '银行卡' WHEN 3 THEN '微信' WHEN 4 THEN '人工' WHEN 0 THEN '未知' END as pay_type FROM t_site_income i LEFT JOIN t_cloud_site s ON i.site_id = s.id where s.id = ? and i.create_time BETWEEN ? AND ? ";
		try {
			List list = jdbcTemplate.query(sql, new BeanPropertyRowMapper(SiteIncomeBean.class),new Object[]{siteId,startTime+" 00:00:00",endTime+" 23:59:59"});
			if(list.size()>0&&list!=null){
				ExportExcelUtils excel = new ExportExcelUtils();
				String[] title = {"记录编号","归属场所","缴费金额","用户名","购买数量","套餐类型","创建时间","购买方式"};
				excel.exportExcel("缴费记录详情.xls", title, list, response, request);
			}
		} catch (Exception e) {
			log.error(this.getClass().getCanonicalName());
		}
	}
	
	/**
	 * @Description  单一场所时间段查询导出excel
	 * @date 2016年12月13日下午1:26:39
	 * @author guoyingjie
	 * @param startTime
	 * @param endTime
	 * @param siteId
	 */
	public void exportExcelM(String year,int siteId,HttpServletRequest request,HttpServletResponse response){
		String stime = year.trim()+"-01 00:00:00";
		String etime = year.trim()+"-31 23:59:59";
		String sql = "SELECT i.id,s.site_name,i.transaction_amount,i.portal_user_name,i.buy_num,i.pay_name,i.create_time,case i.pay_type WHEN 1 THEN '支付宝' WHEN 2 THEN '银行卡' WHEN 3 THEN '微信' WHEN 4 THEN '人工' WHEN 0 THEN '未知' END as pay_type FROM t_site_income i LEFT JOIN t_cloud_site s ON i.site_id = s.id where s.id = ? and i.create_time BETWEEN ? AND ? ";
		try {
			List list = jdbcTemplate.query(sql, new BeanPropertyRowMapper(SiteIncomeBean.class),new Object[]{siteId,stime,etime});
			if(list.size()>0&&list!=null){
				ExportExcelUtils excel = new ExportExcelUtils();
				String[] title = {"记录编号","归属场所","缴费金额","用户名","购买数量","套餐类型","创建时间","购买方式"};
				excel.exportExcel("缴费记录详情.xls", title, list, response, request);
			}
		} catch (Exception e) {
			log.error(this.getClass().getCanonicalName());
		}
	}
	
	/**
	 * @Description  全部场所下时间段查询导出excel
	 * @date 2016年12月13日下午1:45:59
	 * @author guoyingjie
	 * @param startTime
	 * @param endTime
	 * @param agentName
	 * @param request
	 * @param response
	 */
    public void exportExcels(String startTime,String endTime,String agentName,HttpServletRequest request,HttpServletResponse response){
		String sql = "SELECT s.id,c.site_name,s.transaction_amount,s.portal_user_name,s.buy_num,s.pay_name,s.create_time,case s.pay_type WHEN 1 THEN '支付宝' WHEN 2 THEN '银行卡' WHEN 3 THEN '微信' WHEN 4 THEN '人工' WHEN 0 THEN '未知' END as pay_type FROM t_cloud_site c LEFT JOIN t_cloud_user u ON c.user_id = u.id LEFT JOIN t_site_income s ON s.site_id = c.id where u.user_name =? and s.create_time BETWEEN ? AND ?";
		try {
			List lists = jdbcTemplate.query(sql, new BeanPropertyRowMapper(SiteIncomeBean.class),new Object[]{agentName,startTime+" 00:00:00",endTime+" 23:59:59"});
			if(lists.size()>0&&lists!=null){
				ExportExcelUtils excel = new ExportExcelUtils();
				String[] titles = { "记录编号","归属场所","缴费金额","用户名","购买数量","套餐类型","创建时间","购买方式"};
				excel.exportExcel("缴费详情记录.xls", titles, lists, response, request);
			}
		} catch (Exception e) {
			log.error(this.getClass().getCanonicalName());
		}
	}
    /**
	 * @Description  全部场所下时间段查询导出excel
	 * @date 2016年12月13日下午1:45:59
	 * @author guoyingjie
	 * @param startTime
	 * @param endTime
	 * @param agentName
	 * @param request
	 * @param response
	 */
    public void exportExcelAM(String year,String agentName,HttpServletRequest request,HttpServletResponse response){
    	String stime = year.trim()+"-01 00:00:00";
		String etime = year.trim()+"-31 23:59:59";
		String sql = "SELECT s.id,c.site_name,s.transaction_amount,s.portal_user_name,s.buy_num,s.pay_name,s.create_time,case s.pay_type WHEN 1 THEN '支付宝' WHEN 2 THEN '银行卡' WHEN 3 THEN '微信' WHEN 4 THEN '人工' WHEN 0 THEN '未知' END as pay_type FROM t_cloud_site c LEFT JOIN t_cloud_user u ON c.user_id = u.id LEFT JOIN t_site_income s ON s.site_id = c.id where u.user_name =? and s.create_time BETWEEN ? AND ?";
		try {
			List lists = jdbcTemplate.query(sql, new BeanPropertyRowMapper(SiteIncomeBean.class),new Object[]{agentName,stime,etime});
			if(lists.size()>0&&lists!=null){
				ExportExcelUtils excel = new ExportExcelUtils();
				String[] titles = { "记录编号","归属场所","缴费金额","用户名","购买数量","套餐类型","创建时间","购买方式"};
				excel.exportExcel("缴费详情记录.xls", titles, lists, response, request);
			}
		} catch (Exception e) {
			log.error(this.getClass().getCanonicalName());
		}
	}
	
  }

