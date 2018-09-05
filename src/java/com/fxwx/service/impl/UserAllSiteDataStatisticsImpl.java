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

import javax.annotation.Resource;
import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;
import org.nutz.dao.Dao;
import org.nutz.dao.entity.annotation.SQL;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import com.aliyuncs.jaq.model.v20161123.ActivityPreventionResponse.Data;
import com.fxwx.util.CalendarUtil;
import com.fxwx.util.DateUtil;

/**
 * 用户下的所有场所数据统计
 * @author dengfei E-mail:dengfei200857@163.com
 * @time 2018年7月30日 下午1:38:48
 */
@Service
@SuppressWarnings({ "all" })
public class UserAllSiteDataStatisticsImpl {

	private static Logger log = Logger.getLogger(UserAllSiteDataStatisticsImpl.class);

	@Resource(name = "jdbcTemplate")
	private JdbcTemplate jdbcTemplate;

	@Resource(name = "nutDao")
	private Dao nutDao;


	/**
	 * 获得用户下的场所下总钱数与当天的总额
	 * 
	 * @param siteId
	 * @return
	 */
	public List<Map> getAllSiteTotalMoneyAndCurrentPay(Integer userId) {
		List<Map> listPut = new ArrayList<>();
		Map map = new HashMap();
		String sql = "SELECT SUM(transaction_amount) todayMoney FROM t_site_income WHERE site_id IN(SELECT id FROM t_cloud_site WHERE user_id=?)   AND create_time BETWEEN DATE_FORMAT(NOW(),'%Y-%m-%d 00:00:00') AND NOW()";
		String sqls = "SELECT  SUM(transaction_amount) totalMoney from t_site_income WHERE site_id IN(SELECT id FROM t_cloud_site WHERE user_id=?)";
		try {
			String list = jdbcTemplate.queryForObject(sql, new Object[] { userId }, String.class);
			if (list != null && !"".equals(list)) {
				map.put("todayMoney", list);
			} else {
				map.put("todayMoney", "0.0000");
			}

		} catch (Exception e) {
			map.put("todayMoney", "0.0000");
		}
		try {
			String lists = jdbcTemplate.queryForObject(sqls, new Object[] { userId }, String.class);
			if (lists != null && !"".equals(lists)) {
				map.put("totalMoney", lists);
			} else {
				map.put("totalMoney", "0.0000");
			}
		} catch (Exception e) {
			map.put("totalMoney", "0.0000");
		}
		map.put("regiterNotRe", getAllSiteRegisterNum(userId));
		map.put("payNotPay", getAllSitePayPeople(userId));
		map.put("siteNum", String.valueOf(getSiteNum(userId)));
		map.put("tryNotTry", getAllSiteTryPoepleCount(userId));
		listPut.add(map);
		return listPut == null ? null : listPut;
	}

	/**
	 * 当前的用户下所有的归属场所
	 * 
	 * @param userId
	 * @return
	 */
	public String getUserAllSiteId(Integer userId) {
		String sql = "SELECT id FROM t_cloud_site WHERE user_id= ?";
		String arrayStr = null;
		try {
			List<Map<String, Object>> list = jdbcTemplate.queryForList(sql, new Object[] { userId });
			List<Integer> str = new ArrayList();
			if (list.size() > 0 && list != null) {
				for (int i = 0; i < list.size(); i++) {
					str.add(Integer.valueOf(list.get(i).get("id") + ""));
				}
				arrayStr = str.toString().replace("[", "").replace("]", "");
			}
		} catch (Exception e) {
			log.error(this.getClass().getCanonicalName() + "--方法:getUserAllSiteId中出现的异常", e);
			return null;
		}
		return arrayStr;

	}

	/**
	 * 获得前十二天的每天的收入总和
	 * 
	 * @param siteId
	 */
	public List<Map<String, Object>> getAllSiteOfTwelveDaysBeforeRevenue(Integer userId) {
		String sql = "SELECT DATE_FORMAT(create_time,'%Y-%m-%d') date ,SUM(transaction_amount) totalMoney from t_site_income WHERE site_id IN(SELECT id FROM t_cloud_site WHERE user_id = ?) GROUP BY DATE_FORMAT(create_time,'%Y-%m-%d') ORDER BY DATE_FORMAT(create_time,'%Y-%m-%d') DESC LIMIT 0,12";
		List<Map<String, Object>> listtime = jdbcTemplate.queryForList(sql, new Object[] { userId });
		System.out.println("======="+listtime);
		List<String> list = CalendarUtil.getDateList();
		List<Map<String, Object>> dateMaps = new ArrayList();
		Map dateMap = null;
		for (int i = 0; i < listtime.size(); i++) {
			if (list.contains(listtime.get(i).get("date").toString().trim())) {
				for (int j = 0; j < list.size(); j++) {
					if (list.get(j).equals(listtime.get(i).get("date").toString())) {
						dateMap = new HashMap();
						dateMap.put("date", listtime.get(i).get("date").toString());
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
			dateMap.put("date", list.get(i).toString());
			dateMap.put("totalMoney", 0.0000);
			/*dateMap.put("totalMoney",dateMaps.get(i).get("totalMoney").toString());*/
			dateMaps.add(dateMap);
		}
		CalendarUtil.sorts(dateMaps);
		System.out.println("=========="+dateMaps);
		return dateMaps;
	}

	public List<Map<String, Object>> getAllSiteOfTwelveDaysBeforeRevenue() {
		String sql = "SELECT DATE_FORMAT(create_time,'%Y-%m-%d') date ,SUM(transaction_amount) totalMoney from t_site_income WHERE site_id IN(SELECT id FROM t_cloud_site) GROUP BY DATE_FORMAT(create_time,'%Y-%m-%d') ORDER BY DATE_FORMAT(create_time,'%Y-%m-%d') DESC LIMIT 0,12";
		List<Map<String, Object>> listtime = jdbcTemplate.queryForList(sql, new Object[] { });
		System.out.println("======="+listtime);
		List<String> list = CalendarUtil.getDateList();
		List<Map<String, Object>> dateMaps = new ArrayList();
		Map dateMap = null;
		for (int i = 0; i < listtime.size(); i++) {
			if (list.contains(listtime.get(i).get("date").toString().trim())) {
				for (int j = 0; j < list.size(); j++) {
					if (list.get(j).equals(listtime.get(i).get("date").toString())) {
						dateMap = new HashMap();
						dateMap.put("date", listtime.get(i).get("date").toString());
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
			dateMap.put("date", list.get(i).toString());
			dateMap.put("totalMoney", 0.0000);
			/*dateMap.put("totalMoney",dateMaps.get(i).get("totalMoney").toString());*/
			dateMaps.add(dateMap);
		}
		CalendarUtil.sorts(dateMaps);
		System.out.println("=========="+dateMaps);
		return dateMaps;
	}
	
	
	/**
	 * 查询某一时间段的每天的收入总和
	 * 
	 * @param siteId
	 * @throws ParseException
	 */

	public List<Map<String, Object>> getAllSiteOfInCome(Integer userId, String startTime, String endTime) throws ParseException {
		String sql = "SELECT DATE_FORMAT(create_time,'%Y-%m-%d') date ,SUM(transaction_amount) totalMoney from t_site_income WHERE site_id IN(SELECT id FROM t_cloud_site WHERE user_id =?) AND create_time BETWEEN ? AND ? GROUP BY DATE_FORMAT(create_time,'%Y-%m-%d') ORDER BY DATE_FORMAT(create_time,'%Y-%m-%d')";
		List<Map<String, Object>> listtime = jdbcTemplate.queryForList(sql, new Object[] { userId, startTime + " 00:00:00", endTime + " 23:59:59" });
		List<String> list = CalendarUtil.getDayBetween(startTime, endTime);
		List<Map<String, Object>> dateMaps = new ArrayList();
		Map dateMap = null;
		for (int i = 0; i < listtime.size(); i++) {
			if (list.contains(listtime.get(i).get("date").toString().trim())) {
				for (int j = 0; j < list.size(); j++) {
					if (list.get(j).equals(listtime.get(i).get("date").toString())) {
						dateMap = new HashMap();
						dateMap.put("date", listtime.get(i).get("date").toString());
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
			dateMap.put("date", list.get(i).toString());
			dateMap.put("totalMoney", 0.0000);
			dateMaps.add(dateMap);
		}
		CalendarUtil.sorts(dateMaps);
		return dateMaps;

	}

	///////////////////////////////////
	/**
	 * 查询某一时间段的每天的线上收入总和
	 * 
	 * @param siteId
	 * @throws ParseException
	 */

	public List<Map<String, Object>> getAllSiteLineInCome(int agentName, String startTime, String endTime) throws ParseException {
		String sql = "SELECT DATE_FORMAT(create_time,'%Y-%m-%d') date ,SUM(transaction_amount) totalMoney from t_site_income WHERE site_id IN(SELECT id FROM t_cloud_site WHERE user_id =?) AND create_time BETWEEN ? AND ? and portal_user_name not like '0%' GROUP BY DATE_FORMAT(create_time,'%Y-%m-%d') ORDER BY DATE_FORMAT(create_time,'%Y-%m-%d')";
		List<Map<String, Object>> listtime = jdbcTemplate.queryForList(sql, new Object[] { agentName, startTime + " 00:00:00", endTime + " 23:59:59" });
		List<String> list = CalendarUtil.getDayBetween(startTime, endTime);
		List<Map<String, Object>> dateMaps = new ArrayList();
		Map dateMap = null;
		for (int i = 0; i < listtime.size(); i++) {
			if (list.contains(listtime.get(i).get("date").toString().trim())) {
				for (int j = 0; j < list.size(); j++) {
					if (list.get(j).equals(listtime.get(i).get("date").toString())) {
						dateMap = new HashMap();
						dateMap.put("date", listtime.get(i).get("date").toString());
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
			dateMap.put("date", list.get(i).toString());
			dateMap.put("totalMoney", 0.0000);
			dateMaps.add(dateMap);
		}
		CalendarUtil.sorts(dateMaps);
		return dateMaps;

	}

	/////////////////////////////////////
	/**
	 * 查询某一时间段的每天的线下收入总和
	 * 
	 * @param siteId
	 * @throws ParseException
	 */

	public List<Map<String, Object>> getAllSiteOffInCome(int agentName, String startTime, String endTime) throws ParseException {
		String sql = "SELECT DATE_FORMAT(create_time,'%Y-%m-%d') date ,SUM(transaction_amount) totalMoney from t_site_income WHERE site_id IN(SELECT id FROM t_cloud_site WHERE user_id =?) AND create_time BETWEEN ? AND ? and portal_user_name like '0%' GROUP BY DATE_FORMAT(create_time,'%Y-%m-%d') ORDER BY DATE_FORMAT(create_time,'%Y-%m-%d')";
		List<Map<String, Object>> listtime = jdbcTemplate.queryForList(sql, new Object[] { agentName, startTime + " 00:00:00", endTime + " 23:59:59" });
		List<String> list = CalendarUtil.getDayBetween(startTime, endTime);
		List<Map<String, Object>> dateMaps = new ArrayList();
		Map dateMap = null;
		for (int i = 0; i < listtime.size(); i++) {
			if (list.contains(listtime.get(i).get("date").toString().trim())) {
				for (int j = 0; j < list.size(); j++) {
					if (list.get(j).equals(listtime.get(i).get("date").toString())) {
						dateMap = new HashMap();
						dateMap.put("date", listtime.get(i).get("date").toString());
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
			dateMap.put("date", list.get(i).toString());
			dateMap.put("totalMoney", 0.0000);
			dateMaps.add(dateMap);
		}
		CalendarUtil.sorts(dateMaps);
		return dateMaps;

	}

	/////////////////////

	/**
	 * 获得每月的总收入
	 * 
	 * @param siteId
	 * @return
	 */

	public List<Map<String, Object>> getAllSiteTotalMonthlyIncome(Integer userId) {
		String sql = "SELECT DATE_FORMAT(create_time,'%Y-%m') date ,SUM(transaction_amount) totalMoney from t_site_income WHERE site_id IN(SELECT id FROM t_cloud_site WHERE user_id = ?) GROUP BY DATE_FORMAT(create_time,'%Y-%m') ORDER BY DATE_FORMAT(create_time,'%Y-%m') DESC LIMIT 0,12";
		List<Map<String, Object>> listtime = jdbcTemplate.queryForList(sql, new Object[] { userId });
		List<String> list = CalendarUtil.getDateMonthList();
		List<Map<String, Object>> dateMaps = new ArrayList();
		Map dateMap = null;
		for (int i = 0; i < listtime.size(); i++) {
			if (list.contains(listtime.get(i).get("date").toString().trim())) {
				for (int j = 0; j < list.size(); j++) {
					if (list.get(j).equals(listtime.get(i).get("date").toString())) {
						dateMap = new HashMap();
						dateMap.put("date", (listtime.get(i).get("date").toString() + "月"));
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
			dateMap.put("date", (list.get(i).toString() + "月"));
			dateMap.put("totalMoney", 0.0000);
			dateMaps.add(dateMap);
		}
		CalendarUtil.sort(dateMaps);
		return dateMaps;
	}
	
	public List<Map<String, Object>> getAllSiteTotalMonthlyIncome() {
		String sql = "SELECT DATE_FORMAT(create_time,'%Y-%m') date ,SUM(transaction_amount) totalMoney from t_site_income WHERE site_id IN(SELECT id FROM t_cloud_site) GROUP BY DATE_FORMAT(create_time,'%Y-%m') ORDER BY DATE_FORMAT(create_time,'%Y-%m') DESC LIMIT 0,12";
		List<Map<String, Object>> listtime = jdbcTemplate.queryForList(sql, new Object[] {});
		List<String> list = CalendarUtil.getDateMonthList();
		List<Map<String, Object>> dateMaps = new ArrayList();
		Map dateMap = null;
		for (int i = 0; i < listtime.size(); i++) {
			if (list.contains(listtime.get(i).get("date").toString().trim())) {
				for (int j = 0; j < list.size(); j++) {
					if (list.get(j).equals(listtime.get(i).get("date").toString())) {
						dateMap = new HashMap();
						dateMap.put("date", (listtime.get(i).get("date").toString() + "月"));
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
			dateMap.put("date", (list.get(i).toString() + "月"));
			dateMap.put("totalMoney", 0.0000);
			dateMaps.add(dateMap);
		}
		CalendarUtil.sort(dateMaps);
		return dateMaps;
	}

	/**
	 * 查询用户下的某年得每月的总收入
	 * 
	 * @param siteId
	 * @return
	 * @throws ParseException
	 */

	public List<Map<String, Object>> getAllSiteMonthlyIncome(Integer userId, String years) {
		String sql = "SELECT DATE_FORMAT(create_time,'%Y-%m') date,SUM(transaction_amount) totalMoney from t_site_income WHERE site_id IN(SELECT id FROM t_cloud_site WHERE user_id=?) AND (DATE_FORMAT(create_time,'%Y')=? or DATE_FORMAT(create_time,'%Y')=?)  GROUP BY DATE_FORMAT(create_time,'%Y-%m')";
		List<Map<String, Object>> listtime = jdbcTemplate.queryForList(sql, new Object[] { userId, years.split("-")[0], Integer.valueOf(years.split("-")[0]) - 1 });
		List<String> list = null;
		try {
			list = CalendarUtil.getMonth(years);
			List<Map<String, Object>> dateMaps = new ArrayList();
			Map dateMap = null;
			for (int i = 0; i < listtime.size(); i++) {
				if (list.contains(listtime.get(i).get("date").toString().trim())) {
					for (int j = 0; j < list.size(); j++) {
						if (list.get(j).equals(listtime.get(i).get("date").toString())) {
							dateMap = new HashMap();
							dateMap.put("date", (listtime.get(i).get("date").toString() + "月"));
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
				dateMap.put("date", (list.get(i).toString() + "月"));
				dateMap.put("totalMoney", 0.0000);
				dateMaps.add(dateMap);
			}
			CalendarUtil.sort(dateMaps);
			return dateMaps;
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return null;
		
	}

	////////////////////////////////////////
	/**
	 * 查询用户下的截止某年某月的线上总收入
	 * 
	 * @param siteId
	 * @return
	 * @throws ParseException
	 */

	public List<Map<String, Object>> getAllSiteMonthLineIncome(Integer userId, String years) throws ParseException {
		String sql = "SELECT DATE_FORMAT(create_time,'%Y-%m') date,SUM(transaction_amount) totalMoney from t_site_income WHERE site_id IN(SELECT id FROM t_cloud_site WHERE user_id=?) AND (DATE_FORMAT(create_time,'%Y')=? or DATE_FORMAT(create_time,'%Y')=?) and portal_user_name not like '0%'  GROUP BY DATE_FORMAT(create_time,'%Y-%m')";
		List<Map<String, Object>> listtime = jdbcTemplate.queryForList(sql, new Object[] { userId, years.split("-")[0], Integer.valueOf(years.split("-")[0]) - 1 });
		List<String> list = CalendarUtil.getMonth(years);
		List<Map<String, Object>> dateMaps = new ArrayList();
		Map dateMap = null;
		for (int i = 0; i < listtime.size(); i++) {
			if (list.contains(listtime.get(i).get("date").toString().trim())) {
				for (int j = 0; j < list.size(); j++) {
					if (list.get(j).equals(listtime.get(i).get("date").toString())) {
						dateMap = new HashMap();
						dateMap.put("date", (listtime.get(i).get("date").toString() + "月"));
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
			dateMap.put("date", (list.get(i).toString() + "月"));
			dateMap.put("totalMoney", 0.0000);
			dateMaps.add(dateMap);
		}
		CalendarUtil.sort(dateMaps);
		return dateMaps;
	}

	/**
	 * 查询用户截止某年某月的线下总收入
	 * 
	 * @param siteId
	 * @return
	 * @throws ParseException
	 */

	public List<Map<String, Object>> getAllSiteMonthOffIncome(Integer userId, String years) throws ParseException {
		String sql = "SELECT DATE_FORMAT(create_time,'%Y-%m') date,SUM(transaction_amount) totalMoney from t_site_income WHERE site_id IN(SELECT id FROM t_cloud_site WHERE user_id=?) AND (DATE_FORMAT(create_time,'%Y')=? or DATE_FORMAT(create_time,'%Y')=?) and portal_user_name  like '0%'  GROUP BY DATE_FORMAT(create_time,'%Y-%m')";
		List<Map<String, Object>> listtime = jdbcTemplate.queryForList(sql, new Object[] { userId, years.split("-")[0], Integer.valueOf(years.split("-")[0]) - 1 });
		List<String> list = CalendarUtil.getMonth(years);
		List<Map<String, Object>> dateMaps = new ArrayList();
		Map dateMap = null;
		for (int i = 0; i < listtime.size(); i++) {
			if (list.contains(listtime.get(i).get("date").toString().trim())) {
				for (int j = 0; j < list.size(); j++) {
					if (list.get(j).equals(listtime.get(i).get("date").toString())) {
						dateMap = new HashMap();
						dateMap.put("date", (listtime.get(i).get("date").toString() + "月"));
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
			dateMap.put("date", (list.get(i).toString() + "月"));
			dateMap.put("totalMoney", 0.0000);
			dateMaps.add(dateMap);
		}
		CalendarUtil.sort(dateMaps);
		return dateMaps;
	}

	////////////////////////////////////////
	/**
	 * 当前用户下的所有场所被多台设备登录用户列表
	 * 
	 * @param siteId
	 * @return list or null
	 */

	public List<Map<String, Object>> getAllSiteManyPoepleUserTelephone(Integer userId) {
		String str = getUserAllSiteId(userId);
		String tablename = "radacct";
		List<Map<String, Object>> list = null;
		try {
			String sql = "select COUNT(DISTINCT callingstationid) marchNum,username,COUNT(DISTINCT callingstationid) peoNum ,(SELECT site_id from t_cloud_site_routers where nasid=ra.nasid) userId  from "
					+ tablename + "       ra     where  nasid in (SELECT nasid FROM t_cloud_site_routers WHERE site_id in(" + str
					+ ")) GROUP BY username HAVING peoNum>1 ORDER BY marchNum DESC LIMIT 0,5";
			list = jdbcTemplate.queryForList(sql);

		} catch (Exception e) {
			log.error("获取被多台设备登录用户列表-----" + e);
		}
		// }
		return list;
	}

	/**
	 * 当前用户的场所下昨天登录的人数
	 * 
	 * @param siteId
	 * @return
	 */

	public int getAllSiteYesterdayLoginPeopleNum(Integer userId) {
		String str = getUserAllSiteId(userId);
		List<Map<String, Object>> counts = null;
		Calendar clendar = Calendar.getInstance();
		clendar.add(Calendar.DATE, -1);
		SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");
		String tablename = "radacct_" + sdf.format(clendar.getTime());
		String table = "select TABLE_NAME from INFORMATION_SCHEMA.TABLES where TABLE_NAME='" + tablename + "'";
		List<String> isTable = jdbcTemplate.queryForList(table, String.class);
		if (isTable != null && isTable.size() != 0) {
			String sql = "SELECT COUNT(m.b) as totalCount FROM (SELECT DISTINCT username as b,(SELECT site_id from t_cloud_site_routers where nasid=ra.nasid) as id FROM " + tablename
					+ " ra ) m WHERE m.id IN (" + str + ")";
			counts = jdbcTemplate.queryForList(sql);
			return Integer.valueOf(counts.get(0).get("totalCount") + "");
		} else {
			return 0;
		}
	}

	/**
	 * 获的用户下的缴费记录
	 * 
	 * @param userId
	 * @return
	 */
	public List<Map<String, Object>> getAllSitePayRecord(Integer siteId, Integer portalId) {
		String sql = "SELECT transaction_amount amount ,create_time time from t_site_income WHERE site_id =? AND portal_user_id = ? ORDER BY create_time DESC LIMIT 0,5";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql, new Object[] { siteId, portalId });
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
	 * 当前用户下的所有场所下的用户增长趋势
	 * 
	 * @param siteId
	 */

	public List<Map<String, Object>> getAllSiteSubscriberGrowth(Integer userId) {
		List<Map<String, Object>> list = new ArrayList();
		Map map = null;
		String sqlinsert = "SELECT user_growth_data grow from type_datas WHERE user_id = ?";
		List<Map<String, Object>> userGrow = jdbcTemplate.queryForList(sqlinsert, new Object[] { userId });
		if (userGrow != null && userGrow.size() > 0 && userGrow.get(0).get("grow") != null && !("".equals(userGrow.get(0).get("grow")))) {
			String[] str = (userGrow.get(0).get("grow") + "").trim().split(",");
			for (int j = 0; j < str.length; j++) {
				map = new HashMap();
				String date = String.valueOf((str[j].split("=")[1] + "").trim());
				Integer num = Integer.valueOf((str[j].split("=")[0] + "").trim());
				map.put("date", date);
				map.put("num", num);
				list.add(map);
			}
			CalendarUtil.sorts(list);// 按时间升序排列
			return list;
		} else {
			map = new HashMap();
			map.put("num", 0);
			map.put("date", new SimpleDateFormat("yyyy-MM-dd").format(new Date()));
			list.add(map);
			return list;
		}
	}

	/**
	 * 重点推广用户列表
	 * 
	 * @param siteId
	 *            在jsp循环的时候把t.id自定义属性循环进去,方便拿到用户的id;
	 */
	public List<Map<String, Object>> getAllSiteKeyEscrowUser(Integer userId) {
		String sql = "SELECT portal_user_name user_name ,COUNT(id) frequency,site_id siteId, portal_user_id id FROM t_site_income WHERE site_id in(SELECT id FROM t_cloud_site WHERE user_id=?)  GROUP BY portal_user_id  ORDER BY COUNT(id) DESC LIMIT 0,5";
		return jdbcTemplate.queryForList(sql, new Object[] { userId });
	}

	/**
	 * 当前用户下的所有场所的体验终端数
	 * 
	 * @param siteId
	 * @return
	 */

	public String getAllSiteTryPoepleCount(Integer userId) {
		// String sql = "SELECT COUNT(DISTINCT mac) from
		// t_portal_user_trial_records WHERE site_id IN (SELECT id FROM
		// t_cloud_site WHERE user_id=?)";
		String sql = "SELECT COUNT(id) from t_site_customer_info tt,(SELECT id as portal_id from t_portal_user where id in(select portal_id from t_cloud_site_portal WHERE site_id in(SELECT id FROM t_cloud_site WHERE user_id= ? ))) tu WHERE tt.portal_user_id=tu.portal_id AND tt.is_try = 1";
		int tryCount = jdbcTemplate.queryForInt(sql, new Object[] { userId });
		if (tryCount > 0) {
			String tryAndNotTry = String.valueOf(tryCount);
			return tryAndNotTry;
		} else {
			String tryAndNotTry = "0";
			return tryAndNotTry;
		}

	}

	/**
	 * 获得当前用户下的所有场所下的已经支付的人数/未支付人数
	 * 
	 * @param siteId
	 * @return
	 */

	public String getAllSitePayPeople(Integer userId) {
		int siteNum = getSiteNum(userId);
		String sql = "SELECT COUNT(id) FROM t_site_customer_info WHERE site_id IN (SELECT id FROM t_cloud_site WHERE user_id=?)";
		int payCount = jdbcTemplate.queryForInt(sql, new Object[] { userId });
		if (payCount > 0) {
			String payAndNotPay = String.valueOf(payCount) + "/" + String.valueOf(siteNum - payCount);
			return payAndNotPay;
		} else {
			String payAndNotPay = "0/" + String.valueOf(siteNum);
			return payAndNotPay;
		}

	}

	/**
	 * 缴费注册率 昨天新注册的用户/昨天新注册的用户并且缴费
	 * 
	 * @param siteId
	 * @return
	 */

	public Map getAllSitePayOrNotPay(Integer userId) {
		Map map = new HashMap();
		// 昨天注册并且支付的用户人数
		int payAndRegisterNum = getAllSiteYesterdayPayAndRegisterNum(userId);
		// 昨天的注册人数
		int payCount = getAllSiteTotalYesterdayRegisterNum(userId);
		if (payAndRegisterNum > 0 && payCount > 0) {
			double d = payAndRegisterNum * 0.01 / payCount;
			DecimalFormat df = new DecimalFormat("######0.0000");
			String payNotPay = df.format(d * 100);
			Float f = Float.valueOf(payNotPay);
			map.put("pay", f);
		} else {
			map.put("pay", 0.00);
		}
		return map;
	}

	/**
	 * @param siteId
	 *            网络感知度
	 * @return
	 */

	public Map getAllSiteTryOrNot(Integer userId) {
		Map map = new HashMap<>();
		int siteNum = getSiteNum(userId);
		int tryCount = Integer.valueOf(getAllSiteTryPoepleCount(userId));
		if (tryCount > 0 && siteNum > 0) {
			double d = tryCount * 0.01 / siteNum;
			DecimalFormat df = new DecimalFormat("######0.0000");
			String tryAndNotTry = df.format(d * 100);
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

	public int getSiteNum(Integer userId) {
		String sqlTotal = "SELECT SUM(siteNum) from t_cloud_site WHERE user_id=?";
		return jdbcTemplate.queryForInt(sqlTotal, new Object[] { userId });
	}

	/**
	 * 获得当前用户下的所有场所的注册人数与未注册人数
	 * 
	 * @param siteId
	 * @return
	 */
	public String getAllSiteRegisterNum(Integer userId) {
		// 获得总注册人数
		int registerNum = getAllSiteTotalRegisterNum(userId);
		// 总人数
		int siteNum = getSiteNum(userId);
		if (registerNum > 0) {
			String registerOrNot = String.valueOf(registerNum) + "/" + String.valueOf((siteNum - registerNum));
			return registerOrNot;
		} else {
			String registerOrNot = "0/" + String.valueOf(siteNum);
			return registerOrNot;
		}
	}

	/**
	 * 
	 * @param siteId
	 *            试用注册率 = 注册人数/试用总人数
	 * @return
	 */

	public Map getAllSiteRegisteOrNot(Integer userId) {
		Map map = new HashMap<>();
		int tryNum = Integer.valueOf(getAllSiteTryPoepleCount(userId));
		int regisersNum = getAllSiteTotalRegisterNum(userId);
		if (regisersNum > 0 && tryNum > 0) {
			double d = regisersNum * 0.01 / tryNum;
			DecimalFormat df = new DecimalFormat("######0.0000");
			String regisers = df.format(d * 100);
			Float regisersYes = Float.valueOf(regisers);
			map.put("regisersYes", regisersYes);
		} else {
			map.put("regisersYes", 0.00);
		}
		return map;
	}

	/**
	 * 获得用户下的所有场所注册总人数
	 * 
	 * @param siteId
	 */

	public int getAllSiteTotalRegisterNum(Integer userId) {
		String sql = "SELECT COUNT(d.id) FROM t_cloud_site_portal d " + "WHERE d.site_id IN(SELECT id FROM t_cloud_site WHERE user_id=?)";
		int registerNum = 0;
		try {
			registerNum = jdbcTemplate.queryForInt(sql, new Object[] { userId });
		} catch (Exception e) {
			log.error("获得场所注册总人数异常" + e);
		}
		return registerNum;
	}

	/**
	 * 获得当前用户下的所有场所昨日注册的人数
	 * 
	 * @param siteId
	 * @return
	 */

	public int getAllSiteTotalYesterdayRegisterNum(Integer userId) {
		int yesterdayRegisterNum = 0;
		String sql = "SELECT COUNT(id) FROM t_cloud_site_portal WHERE site_id IN(SELECT id FROM t_cloud_site WHERE user_id=?)"
				+ "and create_time BETWEEN (SELECT date_sub(DATE_FORMAT(now(),'%Y-%m-%d 00:00:00'),interval 1 day))  AND (SELECT date_sub(DATE_FORMAT(now(),'%Y-%m-%d 23:59:59'),interval 1 day))";
		String sqls = "SELECT COUNT(id) from t_cloud_site_portal WHERE create_time BETWEEN date_sub(DATE_FORMAT(now(),'%Y-%m-%d 00:00:00'),interval 1 day) AND date_sub(DATE_FORMAT(now(),'%Y-%m-%d 23:59:59'),interval 1 day) AND site_id IN(SELECT id FROM t_cloud_site where user_id=?)";
		try {
			yesterdayRegisterNum = jdbcTemplate.queryForInt(sqls, new Object[] { userId });
		} catch (Exception e) {
			log.error("获得场所昨日注册的总人数异常" + e);
		}
		return yesterdayRegisterNum;
	}

	/**
	 * 获得用户下的所有场所昨天已经注册并且缴费的人数
	 * 
	 * @param siteId
	 * @return
	 */

	public int getAllSiteYesterdayPayAndRegisterNum(Integer userId) {
		int yesterdayPayAndRegisterNum = 0;
		String sql = "SELECT COUNT(id) FROM t_site_customer_info WHERE  portal_user_id in (SELECT portal_id from t_cloud_site_portal WHERE site_id IN(SELECT id FROM t_cloud_site WHERE user_id=?))"
				+ "AND create_time BETWEEN (select date_sub(DATE_FORMAT(now(),'%Y-%m-%d 00:00:00'),interval 1 day)) AND (select date_sub(DATE_FORMAT(now(),'%Y-%m-%d 23:59:59'),interval 1 day))";
		String sqls = "SELECT COUNT(id) FROM t_site_income WHERE create_time BETWEEN date_sub(DATE_FORMAT(now(),'%Y-%m-%d 00:00:00'),interval 1 day) AND date_sub(DATE_FORMAT(now(),'%Y-%m-%d 23:59:59'),interval 1 day) AND site_id IN(SELECT id FROM t_cloud_site where user_id=?) AND portal_user_id in(SELECT portal_id from t_cloud_site_portal WHERE create_time BETWEEN date_sub(DATE_FORMAT(now(),'%Y-%m-%d 00:00:00'),interval 1 day) AND date_sub(DATE_FORMAT(now(),'%Y-%m-%d 23:59:59'),interval 1 day) AND site_id IN(SELECT id FROM t_cloud_site where user_id=?))";
		try {
			yesterdayPayAndRegisterNum = jdbcTemplate.queryForInt(sqls, new Object[] { userId, userId });
		} catch (Exception e) {
			log.error("获得昨天已经注册并且缴费的人数异常" + e);
		}
		return yesterdayPayAndRegisterNum;
	}

	/**
	 * 获取businessData
	 * 
	 * @Description:
	 * @param siteId
	 * @return
	 * @Date 2016年7月5日 下午3:00:41
	 * @Author cuimiao
	 */
	public List<Map<String, Object>> getBusinessDataBySiteId(Integer siteId, int userId, HttpSession session) {
		// Map<String,String> businessData = new HashMap<String, String>();
		List<Map<String, Object>> list = new ArrayList();
		Object[] param = null;
		StringBuffer sql = new StringBuffer();
		sql.append(" SELECT * FROM t3_business_data bus where date_format(bus.create_time,'%Y-%m-%d') = ?");
		if (siteId != -1) {
			sql.append(" and bus.site_id = ? group by bus.site_id");
			param = new Object[] { DateUtil.date2StringShort(DateUtil.dateSub(new Date(), 0)), siteId };
		} else {
			if (userId == 1341) {// 临时处理 为平安账户后台处理数据
				List<Map<String, Object>> data = (List<Map<String, Object>>) session.getAttribute("appList");
				Map<String, Object> map = null;
				String par = "";
				for (int i = 0; i < data.size(); i++) {
					map = data.get(i);
					if (map != null) {
						par += map.get("id") + ",";
					}
				}
				sql.append(" and bus.site_id in (?) group by bus.site_id");
				System.out.println("app site====" + par);
				// 查询全部
				param = new Object[] { DateUtil.date2StringShort(DateUtil.dateSub(new Date(), 0)), par.substring(0, par.length() - 1) };
			} else {
				sql.append(" and bus.site_id in (SELECT id FROM t_cloud_site where user_id = ?) group by bus.site_id");
				// 查询全部
				param = new Object[] { DateUtil.date2StringShort(DateUtil.dateSub(new Date(), 0)), userId };
			}
		}
		try {
			list = jdbcTemplate.queryForList(sql.toString(), param);
		} catch (Exception e) {
			// 这里应该捕获空值异常，不应该捕获全部异常 TODO
			list.add(new HashMap());
			// e.printStackTrace();
		}
		System.out.println("====================getBusinessDataBySiteId=="+sql);
		return list;
	}

	/**
	 * 获取 用户渗透率 list，默认当前日期推10天
	 * 
	 * @Description:
	 * @param siteId
	 * @return
	 * @Date 2016年7月5日 下午5:38:37
	 * @Author cuimiao
	 */
	public List<Map<String, Object>> getPermeateList(Integer siteId, int userId, String startDate, String endDate) {
		System.out.println(startDate+"========="+endDate);
		Object[] param = null;
		StringBuffer sql = new StringBuffer();
		sql.append(" select sum(total_uv) as total_uv,bus.create_time ");
		sql.append(" from t3_business_data bus");
		sql.append(" where bus.create_time <= ? and bus.create_time >= ?");
		if (siteId != -1) {
			sql.append(" and bus.site_id = ?");
			param = new Object[] { endDate, startDate, siteId };
		} else {
			// 查询全部
			sql.append(" and bus.site_id in (SELECT id FROM t_cloud_site where user_id = ?)");
			param = new Object[] { endDate, startDate, userId };
		}
		sql.append(" group by DATE_FORMAT(bus.create_time,'%Y-%m-%d')");
		sql.append(" order by bus.create_time ");
		System.out.println("=====getPermeateList=="+sql);
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql.toString(), param);
		return list;
	}

	/**
	 * 获取 注册转换率 list，默认当前日期推10天
	 * 
	 * @Description:
	 * @param siteId
	 * @return
	 * @Date 2016年7月5日 下午5:38:37
	 * @Author cuimiao
	 */
	public List<Map<String, Object>> getTryRegisterList(Integer siteId, int userId, String startDate, String endDate) {
		Object[] param = null;
		StringBuffer sql = new StringBuffer();
		sql.append(" select sum(total_num) as total_num,sum(total_uv) as total_uv");
		sql.append(" from t3_business_data bus");
		sql.append(" where bus.create_time <= ? and bus.create_time >= ?");
		if (siteId != -1) {
			sql.append(" and bus.site_id = ?");
			param = new Object[] { endDate, startDate, siteId };
		} else {
			// 查询全部
			sql.append(" and bus.site_id in (SELECT id FROM t_cloud_site where user_id = ?)");
			param = new Object[] { endDate, startDate, userId };
		}
		sql.append(" group by DATE_FORMAT(bus.create_time,'%Y-%m-%d')");
		sql.append(" order by bus.create_time ");
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql.toString(), param);
		return list;
	}

	/**
	 * 获取 付费转换率 list，默认当前日期推10天
	 * 
	 * @Description:
	 * @param siteId
	 * @return
	 * @Date 2016年7月5日 下午5:38:37
	 * @Author cuimiao
	 */
	public List<Map<String, Object>> getRegisterPayList(Integer siteId, int userId, String startDate, String endDate) {
		Object[] param = null;
		StringBuffer sql = new StringBuffer();
		sql.append(" select sum(total_pay) as total_pay, sum(total_num) as total_num");
		sql.append(" from t3_business_data bus");
		sql.append(" where bus.create_time <= ? and bus.create_time >= ?");
		if (siteId != -1) {
			sql.append(" and bus.site_id = ?");
			param = new Object[] { endDate, startDate, siteId };
		} else {
			// 查询全部
			sql.append(" and bus.site_id in (SELECT id FROM t_cloud_site where user_id = ?)");
			param = new Object[] { endDate, startDate, userId };
		}
		sql.append(" group by DATE_FORMAT(bus.create_time,'%Y-%m-%d')");
		sql.append(" order by bus.create_time ");
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql.toString(), param);
		return list;
	}

	/**
	 * @Description 获得场所的时实用户数量 (-1 按用户的所有场所查询)
	 * @date 2016年8月17日下午4:58:02
	 * @author guoyingjie
	 * @param siteId
	 */
	public int getNowonlineNum(int siteId, int userId) {
		int count = 0;
		try {
			String sql = "";
			if (-1 == siteId) {
				sql = "SELECT COUNT(DISTINCT callingstationid) FROM (SELECT callingstationid FROM radacct WHERE nasid IN (SELECT nasid FROM t_cloud_site_routers WHERE site_id IN (SELECT id FROM t_cloud_site WHERE user_id = ?))  AND DATE_FORMAT(acctstarttime,'%Y-%m-%d')=? GROUP BY callingstationid) AS a";
				String today = DateUtil.date2StringShort(new Date());
				count = jdbcTemplate.queryForInt(sql, userId,today);
			} else {
				sql = "SELECT COUNT(DISTINCT callingstationid) FROM (SELECT callingstationid FROM radacct WHERE nasid IN (SELECT nasid FROM t_cloud_site_routers WHERE site_id = ?)  AND DATE_FORMAT(acctstarttime,'%Y-%m-%d')=? GROUP BY callingstationid) AS a";
				System.out.println(sql);
				String today = DateUtil.date2StringShort(new Date());
				count = jdbcTemplate.queryForInt(sql, siteId,today);
			}
		} catch (Exception e) {
			e.printStackTrace();
			log.error("获得场所时实数据失败");
		}
		return count;
	}
	
	/**
	 * 获得场所的今天新增注册用户数 (-1 按用户的所有场所查询)
	 * @author dengfei E-mail:dengfei200857@163.com
	 * @time 2018年3月22日 下午5:25:46
	 * @param siteId
	 * @param userId
	 * @return
	 */
	public int getNewRegisterUserNum(int siteId, int userId) {
		int count = 0;
		try {
			String sql = "";
			if (-1 == siteId) {
				sql = "SELECT COUNT(DISTINCT user_name) FROM t_portal_user WHERE t7_site_id IN (SELECT id FROM t_cloud_site WHERE user_id = ?) AND DATE_FORMAT(create_time,'%Y-%m-%d') = ?";
				String today = DateUtil.date2StringShort(new Date());
				count = jdbcTemplate.queryForInt(sql, userId, today);
			} else {
				sql = "SELECT COUNT(DISTINCT user_name) FROM t_portal_user WHERE t7_site_id = ? AND DATE_FORMAT(create_time,'%Y-%m-%d') = ?";
				String today = DateUtil.date2StringShort(new Date());
				count = jdbcTemplate.queryForInt(sql, siteId, today);
			}
			System.out.println("===========getNewRegisterUserNum===="+sql);
		} catch (Exception e) {
			e.printStackTrace();
			log.error("获得场所今天新增注册用户数失败");
		}
		
		return count;
	}

	/**
	 * 获得场所的昨日上线用户数
	 * @author dengfei E-mail:dengfei200857@163.com
	 * @time 2018年3月22日 下午5:35:13
	 * @param siteId
	 * @param userId
	 * @return
	 */
	public int getYestodayUplineUserNum(int siteId, int userId) {
		int count = 0;
		try {
			String sql = "";
			if (-1 == siteId) {
				sql = "SELECT COUNT(DISTINCT username) FROM t7_authuser WHERE nasid IN (SELECT nasid FROM t_cloud_site_routers WHERE site_id IN (SELECT id FROM t_cloud_site WHERE user_id = ?))  AND DATE_FORMAT(create_time,'%Y-%m-%d')=?";
				String yestoday = DateUtil.date2StringShort(DateUtil.dateSub(new Date(), 1));
				count = jdbcTemplate.queryForInt(sql, userId, yestoday);
			} else {
				sql = "SELECT COUNT(DISTINCT username) FROM t7_authuser WHERE nasid IN (SELECT nasid FROM t_cloud_site_routers WHERE site_id = ?)  AND DATE_FORMAT(create_time,'%Y-%m-%d')=?";
				String yestoday = DateUtil.date2StringShort(DateUtil.dateSub(new Date(), 1));
				count = jdbcTemplate.queryForInt(sql, siteId, yestoday);
			}
		} catch (Exception e) {
			e.printStackTrace();
			log.error("获得场所的昨日上线用户数失败");
		}
		return count;
	}
	
	/**
	 *  获得场所的AP数量
	 * @param siteId
	 * @param userId
	 * @return
	 */
	public int getAPNum(int siteId, int userId) {
		int count = 0;
		try {
			String sql = "";
			if (-1 == siteId) {
				sql = "SELECT COUNT(DISTINCT a1.calledstationid) FROM (SELECT * FROM radacct WHERE DATE_FORMAT(acctstarttime,'%Y-%m-%d') = ? GROUP BY calledstationid) AS a1 WHERE a1.nasid IN (SELECT nasid FROM t_cloud_site_routers WHERE site_id IN (SELECT id FROM t_cloud_site WHERE user_id = ?))";
				String today = DateUtil.date2StringShort(new Date());
				count = jdbcTemplate.queryForInt(sql, today, userId);
			} else {
				sql = "SELECT COUNT(DISTINCT a1.calledstationid) FROM (SELECT * FROM radacct WHERE DATE_FORMAT(acctstarttime,'%Y-%m-%d') = ? GROUP BY calledstationid) AS a1 WHERE a1.nasid IN (SELECT nasid FROM t_cloud_site_routers WHERE site_id = ?)";
				String today = DateUtil.date2StringShort(new Date());
				count = jdbcTemplate.queryForInt(sql, today, siteId);
			}
		} catch (Exception e) {
			e.printStackTrace();
			log.error("获得场所的AP数量失败");
		}
		return count;
	}
	
	/**
	 *  获得场所的付费用户数量
	 * @author dengfei E-mail:dengfei200857@163.com
	 * @time 2018年3月22日 下午5:44:35
	 * @param siteId
	 * @param userId
	 * @return
	 */
	public int getPayUserNum(int siteId, int userId) {
		int count = 0;
		try {
			String sql = "";
			if (-1 == siteId) {
				sql = "SELECT COUNT(DISTINCT user_name) FROM t_portal_user WHERE id IN (SELECT user_id FROM t_sitepayment_records WHERE is_finish=1 AND  site_id IN(SELECT id FROM t_cloud_site WHERE user_id = ?))";
				String today = DateUtil.date2StringShort(new Date());
				count = jdbcTemplate.queryForInt(sql,userId);
			} else {
				sql = "SELECT COUNT(DISTINCT user_name) FROM t_portal_user WHERE id IN (SELECT user_id FROM t_sitepayment_records WHERE is_finish=1 AND site_id=?)";
				String today = DateUtil.date2StringShort(new Date());
				count = jdbcTemplate.queryForInt(sql,siteId);
			}
			
		} catch (Exception e) {
			e.printStackTrace();
			log.error("获得场所的昨日上线用户数失败");
		}
		return count;
	}
}