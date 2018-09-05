package com.fxwx.service.impl;

import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;
import org.nutz.dao.Cnd;
import org.nutz.dao.Dao;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import com.fxwx.entity.CloudSite;
import com.fxwx.util.CalendarUtil;
import com.fxwx.util.DateUtil;

@Service
public class NewEditionSkinServiceImpl {
	private Logger log = Logger.getLogger(SiteCustomerInfoServiceImpl.class);

	@Resource(name = "jdbcTemplate")
	private JdbcTemplate jdbcTemplate;
	@Resource(name = "nutDao")
	private Dao nutDao;

	/**
	 * 查询所有场所信息
	 * 
	 * @return
	 */
	public List<Map<String, Object>> queryCloudSiteList() {
		String sql = "SELECT id,site_name,address from t_cloud_site  ORDER BY systemtype DESC";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		return list;
	}

	/**
	 * 查询总人数、今日收益、总收益
	 * 
	 * @param siteId
	 * @return
	 */
	public List<Map> getTotalMoneyAndTotalCount(int siteId) {
		List<Map> listPut = new ArrayList<>();
		Map<String, Object> map = new HashMap<String, Object>();
		String data = "";
		String data2 = "";
		StringBuffer sql = new StringBuffer();
		StringBuffer sql2 = new StringBuffer();
		sql.append("SELECT SUM(transaction_amount) todayMoney FROM t_site_income ");
		sql2.append("SELECT  SUM(transaction_amount) totalMoney from t_site_income ");
		if (siteId == 0) {// 查看全部数据
			sql.append(" WHERE DATE_FORMAT(create_time,'%Y-%m-%d') = ?");
		} else {// 查看选择的场所信息
			sql.append(" WHERE site_id = ? AND DATE_FORMAT(create_time,'%Y-%m-%d') = ?");
			sql2.append(" WHERE site_id=?");
		}
		String today = DateUtil.date2StringShort(new Date());
		if (siteId == 0) {
			data = jdbcTemplate.queryForObject(sql.toString(), new Object[] { today }, String.class);
			data2 = jdbcTemplate.queryForObject(sql2.toString(), String.class);
		} else {
			data = jdbcTemplate.queryForObject(sql.toString(), new Object[] { siteId, today }, String.class);
			data2 = jdbcTemplate.queryForObject(sql2.toString(), new Object[] { siteId }, String.class);
		}
		if (data != null && !"".equals(data)) {
			map.put("todayMoney", data);
		} else {
			map.put("todayMoney", "0.0000");
		}
		if (data2 != null && !"".equals(data2)) {
			map.put("totalMoney", data2);
		} else {
			map.put("totalMoney", "0.0000");
		}
		map.put("siteNum", getSiteNum(siteId));
		listPut.add(map);
		System.out.println("==================getTotalMoneyAndTotalCount==" + listPut);
		return listPut;
	}

	/**
	 * 获得场所总人数
	 * 
	 * @param siteId
	 * @return
	 */
	public int getSiteNum(int siteId) {
		StringBuffer sql = new StringBuffer();
		int count = 0;
		if (siteId == 0) {
			sql.append("SELECT SUM(siteNum) from t_cloud_site");
			count = jdbcTemplate.queryForInt(sql.toString());
		} else {
			sql.append("SELECT siteNum from t_cloud_site WHERE id=?");
			count = jdbcTemplate.queryForInt(sql.toString(), new Object[] { siteId });
		}
		return count;
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
	public List<Map<String, Object>> getBusinessData(Integer siteId, HttpSession session) {
		List<Map<String, Object>> list = new ArrayList();
		Object[] param = null;
		StringBuffer sql = new StringBuffer();
		sql.append(" SELECT ");
		sql.append(" uv_num,register_num,pay_num,login_num, permeate_ratenum,");
		sql.append(" permeate_rateden,try_register_ratenum,try_register_rateden,");
		sql.append(" register_pay_ratenum,register_pay_rateden");
		sql.append(" FROM t3_business_data bus");
		sql.append(" where  date_format(bus.create_time,'%Y-%m-%d') = ?");
		try {
			if (siteId != 0) {// 选择场所时查询的数据
				sql.append(" AND bus.site_id = ? group by bus.site_id");
				list = jdbcTemplate.queryForList(sql.toString(),
						DateUtil.date2StringShort(DateUtil.dateSub(new Date(), 0)), siteId);
			} else {// 超级管理员查询全部数据
				sql.append(" group by bus.site_id");
				list = jdbcTemplate.queryForList(sql.toString(),
						DateUtil.date2StringShort(DateUtil.dateSub(new Date(), 0)));
			}
		} catch (Exception e) {
			// 这里应该捕获空值异常，不应该捕获全部异常 TODO
			list.add(new HashMap());
			// e.printStackTrace();
		}
		System.out.println("=========getBusinessData==" + sql);
		return list;
	}

	/**
	 * 获得付费用户数量
	 * 
	 * @param siteId
	 * @param userId
	 * @return
	 */
	public int getPayUserNum(int siteId) {
		int count = 0;
		try {
			String sql = "";
			if (0 == siteId) {
				sql = "SELECT COUNT(user_name) FROM t_portal_user WHERE id IN (SELECT user_id FROM t_sitepayment_records WHERE is_finish=1)";
				count = jdbcTemplate.queryForInt(sql);
			} else {
				sql = "SELECT COUNT(user_name) FROM t_portal_user WHERE id IN (SELECT user_id FROM t_sitepayment_records WHERE is_finish=1 AND site_id=?)";
				count = jdbcTemplate.queryForInt(sql, siteId);
			}

		} catch (Exception e) {
			e.printStackTrace();
			log.error("获得付费用户数量失败");
		}
		return count;
	}

	/***
	 * 获得场所的AP数量
	 * 
	 * @param siteId
	 * @param userId
	 * @return
	 */
	public int getAPNum(int siteId) {
		int count = 0;
		try {
			String sql = "";
			if (0 == siteId) {
				sql = "SELECT COUNT(a1.calledstationid) FROM (SELECT * FROM radacct WHERE DATE_FORMAT(acctstarttime,'%Y-%m-%d') = ? GROUP BY calledstationid) AS a1";
				String today = DateUtil.date2StringShort(new Date());
				count = jdbcTemplate.queryForInt(sql, today);
			} else {
				sql = "SELECT COUNT(a1.calledstationid) FROM (SELECT * FROM radacct WHERE DATE_FORMAT(acctstarttime,'%Y-%m-%d') = ? GROUP BY calledstationid) AS a1 WHERE a1.nasid IN (SELECT nasid FROM t_cloud_site_routers WHERE site_id=?) ";
				String today = DateUtil.date2StringShort(new Date());
				count = jdbcTemplate.queryForInt(sql, today, siteId);
			}
		} catch (Exception e) {
			e.printStackTrace();
			log.error("获得场所上线用户数失败");
		}
		return count;
	}

	/**
	 * 获得缴费类型占比
	 * 
	 * @param siteId
	 * @return
	 */
	public List<Map<String, Object>> getTypeEvery(int siteId) {
		String sqlSite = "";
		String sqlSiteAll = "";
		if (siteId == 0) {
			sqlSite = "SELECT COUNT(pay_name) finalCount,pay_name finalName FROM t_site_income WHERE pay_name IN(SELECT NAME FROM t_site_price_config  WHERE is_stoped=0 GROUP BY NAME) GROUP BY pay_name";
			sqlSiteAll = "SELECT SUM(s.num) totalCount FROM (SELECT COUNT(pay_name) num FROM t_site_income WHERE pay_name IN(SELECT NAME FROM t_site_price_config WHERE is_stoped=0 GROUP BY NAME) GROUP BY pay_name) s";
		} else {
			sqlSite = "SELECT COUNT(pay_name) finalCount,pay_name finalName FROM t_site_income WHERE site_id =? AND pay_name IN(SELECT NAME FROM t_site_price_config  WHERE is_stoped=0 GROUP BY NAME) GROUP BY pay_name";
			sqlSiteAll = "SELECT SUM(s.num) totalCount FROM (SELECT COUNT(pay_name) num FROM t_site_income WHERE site_id =? AND pay_name IN(SELECT NAME FROM t_site_price_config WHERE is_stoped=0 GROUP BY NAME) GROUP BY pay_name) s";
		}
		List<Map<String, Object>> sitecount = null;
		List<Map<String, Object>> allcount = null;

		int sum = 0;
		try {
			List<Map<String, Object>> finalResult = new ArrayList();
			if (siteId != 0) {
				sitecount = jdbcTemplate.queryForList(sqlSite, siteId);
				allcount = jdbcTemplate.queryForList(sqlSiteAll, siteId);// 单个场所下所有缴费类型总数
			} else {
				sitecount = jdbcTemplate.queryForList(sqlSite);
				allcount = jdbcTemplate.queryForList(sqlSiteAll);// 所有场所下的缴费类型总数
			}

			sum = Integer
					.valueOf(allcount.get(0).get("totalCount") == null ? "0" : allcount.get(0).get("totalCount") + "");
			for (int i = 0; i < sitecount.size(); i++) {
				int count = Integer.valueOf(sitecount.get(i).get("finalCount") + "");
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
			System.out.println(sqlSite);
			System.out.println(sqlSiteAll);
			return finalResult;
		} catch (Exception e) {
			e.printStackTrace();
			log.error(this.getClass().getCanonicalName());
		}
		return null;
	}

	/**
	 * 获得前十二天的每天的收入总和
	 * 
	 * @param siteId
	 */
	public List<Map<String, Object>> getTwelveDaysBeforeRevenue(int siteId) {
		StringBuffer sql = new StringBuffer();
		StringBuffer sql2 = new StringBuffer();
		List<Map<String, Object>> listtime = null;
		if (siteId == 0) {
			sql.append(
					"SELECT DATE_FORMAT(create_time,'%Y-%m-%d') date ,SUM(transaction_amount) totalMoney from t_site_income"
							+ " GROUP BY DATE_FORMAT(create_time,'%Y-%m-%d') ORDER BY DATE_FORMAT(create_time,'%Y-%m-%d') DESC LIMIT 0,12");
		} else {
			sql2.append(
					"SELECT DATE_FORMAT(create_time,'%Y-%m-%d') date ,SUM(transaction_amount) totalMoney from t_site_income"
							+ " WHERE site_id =? GROUP BY DATE_FORMAT(create_time,'%Y-%m-%d') ORDER BY DATE_FORMAT(create_time,'%Y-%m-%d') DESC LIMIT 0,12");
		}
		if (sql.length() != 0) {
			listtime = jdbcTemplate.queryForList(sql.toString());
		} else {
			listtime = jdbcTemplate.queryForList(sql2.toString(), new Object[] { siteId });
		}
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
			dateMaps.add(dateMap);
		}
		CalendarUtil.sorts(dateMaps);
		return dateMaps;
	}

	/**
	 * 获得用户增长趋势数据
	 * 
	 * @param siteId
	 */
	public List<Map<String, Object>> getSubscriberGrowth(int siteId) {
		List<Map<String, Object>> list = new ArrayList();
		Map map = null;
		String sql = "";
		List<Map<String, Object>> userGrow = null;
		if (siteId == 0) {
			sql = "SELECT user_growth_data grow from type_datas";
			userGrow = jdbcTemplate.queryForList(sql);
		} else {
			sql = "SELECT user_growth_data grow from type_datas WHERE site_id = ?";
			userGrow = jdbcTemplate.queryForList(sql, new Object[] { siteId });
		}
		if (siteId == 0) {
			if (userGrow != null && userGrow.size() > 0 && userGrow.get(0).get("grow") != null
					&& !("".equals(userGrow.get(0).get("grow")))) {
				for (int i = 0; i < userGrow.size(); i++) {
					String grow = (userGrow.get(i).get("grow") + "").trim();
					String[] str = grow.split(",");
					for (int j = 0; j < str.length; j++) {
						boolean flag = false;
						map = new HashMap();
						String date = String.valueOf((str[j].split("=")[1] + "").trim());
						Integer num = Integer.valueOf((str[j].split("=")[0] + "").trim());
						for (int n = 0; n < list.size(); n++) {
							if (list.get(n).get("date").equals(date)) {
								list.get(n).put("num", (Integer) list.get(n).get("num") + num);
								flag = true;
								break;
							}
						}
						if (flag) {
							continue;
						}
						map.put("date", date);
						map.put("num", num);
						list.add(map);
					}
				}
				System.out.println("==================getSubscriberGrowth" + sql);
				System.out.println("==================getSubscriberGrowth" + list);
				CalendarUtil.sorts(list);// 按时间升序排列
				return list;
			} else {
				map = new HashMap();
				map.put("num", 0);
				map.put("date", new SimpleDateFormat("yyyy-MM-dd").format(new Date()));
				list.add(map);
				return list;
			}
		} else {
			if (userGrow != null && userGrow.size() > 0 && userGrow.get(0).get("grow") != null
					&& !("".equals(userGrow.get(0).get("grow")))) {
				for (int i = 0; i < userGrow.size(); i++) {
					String grow = (userGrow.get(i).get("grow") + "").trim();
					String[] str = grow.split(",");
					for (int j = 0; j < str.length; j++) {
						map = new HashMap();
						String date = String.valueOf((str[j].split("=")[1] + "").trim());
						Integer num = Integer.valueOf((str[j].split("=")[0] + "").trim());
						map.put("date", date);
						map.put("num", num);
						list.add(map);
					}
				}
				System.out.println("==================getSubscriberGrowth" + sql);
				System.out.println("==================getSubscriberGrowth" + list);
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
	}

	/**
	 * 根据场所获得场所名字
	 * 
	 * @param siteId
	 * @return siteName;
	 */
	public String getSiteName(int siteId) {
		if (siteId != 0) {
			CloudSite cloudSite = nutDao.fetch(CloudSite.class, Cnd.where("id", "=", siteId));
			return cloudSite.getSite_name();
		} else {
			return "全部场所";
		}
	}
}
