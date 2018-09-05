package com.fxwx.service.impl;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.log4j.Logger;
import org.nutz.dao.Dao;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.simple.ParameterizedBeanPropertyRowMapper;
import org.springframework.stereotype.Service;

import com.fxwx.bean.UserTemporaryTotalLog;
import com.fxwx.entity.BusinessData;
import com.fxwx.entity.UserTotalTimeHave;
import com.fxwx.util.CalendarUtil;
import com.fxwx.util.DateUtil;
import com.fxwx.util.InitContext;

/**
 * 主要用来编写定时器任务函数
 * 
 * @author Administrator
 *
 */
@Service
public class TimingtaskServiceImpl {
	@Resource(name = "jdbcTemplate")
	private JdbcTemplate jdbcTemplate;

	@Resource(name = "nutDao")
	private Dao nutDao;

	Logger log = Logger.getLogger(TimingtaskServiceImpl.class);

	public synchronized void lockUserTime() {
		log.error("------------开始统计用户数据----------");
		String date = CalendarUtil.yesteday();
		String radacct_table = "radacct_" + date;
		String table = "select TABLE_NAME from INFORMATION_SCHEMA.TABLES where TABLE_NAME='" + radacct_table + "'";
		List<String> isTable = jdbcTemplate.queryForList(table, String.class);
		if (isTable != null && isTable.size() != 0) {
		} else {
			radacct_table = "radacct";
		}
		statistical(radacct_table, date);
		deleteLog4j();
		String sql = "SELECT username,siteid,count(*) as num FROM(SELECT username,(SELECT t.site_id FROM t_cloud_site_routers t WHERE nasid=r.nasid) AS siteid FROM  " + radacct_table
				+ " r GROUP BY username,callingstationid,siteid) a GROUP BY a.username,a.siteid HAVING num>(SELECT allow_client_num FROM t_cloud_site t_c WHERE t_c.id=a.siteid)";
		try {
			List rs = jdbcTemplate.queryForList(sql);
			for (int i = 0; i < rs.size(); i++) {
				Map userMap = (Map) rs.get(i);
				String username = (String) userMap.get("username");
				Long siteid = (Long) userMap.get("siteid");
				String upsql = "UPDATE t_site_customer_info SET lock_time=NOW() WHERE site_id=" + siteid + " AND portal_user_id=(select id FROM t_portal_user where user_name='" + username
						+ "') AND (lock_time<DATE_SUB(NOW(),INTERVAL 1 DAY) OR lock_time IS NULL)";
				int num = jdbcTemplate.update(upsql);
			}
		} catch (Exception e) {
			log.error(e);
		}
	}

	/**
	 * @Description: 删除前一天认证日志列表信息
	 * @Date 2016年10月18日 下午3:04:24
	 * @Author liuzhao
	 */
	public void deleteLog4j() {
		String date = new SimpleDateFormat("yyyy-MM-dd 00:01:00").format(new Date());
		try {
			String delsql = "DELETE FROM radpostauth  WHERE authdate < ?";
			jdbcTemplate.update(delsql, new Object[] { date });
		} catch (Exception e) {
			log.error(e);
		}

	}

	public void statistical(String acct_table, String date) {

		// 昨日付费用户数
		String sqlopenporta = "SELECT COUNT(*) AS num,site_id FROM (SELECT site_id FROM t_site_customer_info WHERE portal_user_id IN (SELECT id FROM t_portal_user WHERE  DATE_FORMAT(create_time,'%Y%m%d')='"
				+ date + "') GROUP BY portal_user_id) AS info GROUP BY site_id";

		// 昨日注册用户数
		String sqlnew = "SELECT COUNT(*) AS num,t7_site_id FROM t_portal_user WHERE DATE_FORMAT(create_time,'%Y%m%d')='" + date + "' GROUP BY t7_site_id";

		// 昨日独立用户数（访问认证客户端）
		String sqlopencount = "SELECT COUNT(DISTINCT clientmac) as num,(SELECT site_id FROM t_cloud_site_routers tc WHERE tc.nasid= t2.nasid) as site_id  FROM t2_portallog_" + date
				+ " t2 GROUP BY site_id";

		// 昨日登录用户数
		String sqllogcount = "SELECT COUNT(*) AS num,site_id FROM (SELECT DISTINCT ra.user_name, tc.site_id FROM t_portalloginlog_" + date
				+ " ra,t_cloud_site_routers tc WHERE ra.site_id=tc.site_id) logn GROUP BY site_id";
		// 昨日付费用户数、昨日注册用户数、昨日独立用户数（访问认证客户端）、昨日登录用户数
		String sqldata1 = "SELECT p.num AS paynum,r.num AS regnum,d.num AS dnum,l.num AS lnum,p.site_id FROM " + "(" + sqlopenporta + ") AS p,(" + sqlnew + ") AS r,(" + sqlopencount + ") AS d,("
				+ sqllogcount + ") AS l WHERE p.site_id=r.t7_site_id AND p.site_id=d.site_id AND p.site_id=l.site_id";

		// 总注册用户数
		String sqlregistnum = "SELECT COUNT(*) as num, site_id FROM(SELECT site_id FROM t_cloud_site_portal GROUP BY portal_id) site GROUP BY site_id";

		// 总付费用户数
		String sqlpaycount = "SELECT COUNT(DISTINCT portal_user_id) as num,site_id FROM t_site_income GROUP BY site_id";

		List<BusinessData> business = new ArrayList<>();
		try {
			// 昨日付费用户数、昨日注册用户数、昨日独立用户数（访问认证客户端）、昨日登录用户数
			List rs = jdbcTemplate.queryForList(sqldata1);
			log.error("------------昨日付费用户数、昨日注册用户数、昨日独立用户数（访问认证客户端）、昨日登录用户数----------"+sqldata1);
			for (int i = 0; i < rs.size(); i++) {
				Map map = (Map) rs.get(i);
				Number pnum = (Number) map.get("pnum");
				Number rnum = (Number) map.get("rnum");
				Number dnum = (Number) map.get("dnum");
				Number lnum = (Number) map.get("lnum");
				Number siteid = (Number) map.get("site_id");
				BusinessData bd = new BusinessData();
				bd.setSiteId(siteid == null ? 0 : siteid.intValue());
				bd.setPayNum(pnum == null ? 0 : pnum.intValue());
				bd.setRegisterNum(rnum == null ? 0 : rnum.intValue());
				bd.setUvNum(dnum == null ? 0 : dnum.intValue());
				bd.setLoginNum(lnum == null ? 0 : lnum.intValue());
				business.add(bd);
			}
			Calendar start = Calendar.getInstance();
			start.set(2018, 7, 18);
			Long startTIme = start.getTimeInMillis();
			Calendar end = Calendar.getInstance();
			end.setTime(new SimpleDateFormat("yyyyMMdd").parse(date));
			Long endTime = end.getTimeInMillis();
			Long oneDay = 1000 * 60 * 60 * 24l;
			// 总独立用户数（访问认证客户端）
			Map<String, String> totaldmap = new HashMap<String, String>();
			Long time = startTIme;
			while (time <= endTime) {
				Date d = new Date(time);
				DateFormat df = new SimpleDateFormat("yyyyMMdd");
				String date1 = df.format(d);
				time += oneDay;
				String sqlnet = "SELECT DISTINCT t2.clientmac,tc.site_id FROM t2_portallog_" + date1 + " AS t2,t_cloud_site_routers AS tc WHERE t2.nasid= tc.nasid";
				try {
					rs = jdbcTemplate.queryForList(sqlnet);
					for (int i = 0; i < rs.size(); i++) {
						BusinessData bd = null;
						Map numMap = (Map) rs.get(i);
						String siteid = (String) numMap.get("site_id");
						String clientmac = (String) numMap.get("clientmac");
						if (clientmac.indexOf("-") > 0) {
							clientmac = clientmac.replaceAll("-", ":");
						}
						totaldmap.put(clientmac, siteid);
					}
				} catch (Exception e) {
					// TODO: handle exception
					continue;
				}

			}
			// 总独立用户数（访问认证客户端）
			for (int j = 0; j < business.size(); j++) {
				int totalnum = 0;
				for (Map.Entry<String, String> entry : totaldmap.entrySet()) {
					// Map.entry<Integer,String> 映射项（键-值对） 有几个方法：用上面的名字entry
					// entry.getKey() ;entry.getValue(); entry.setValue();
					// map.entrySet() 返回此映射中包含的映射关系的 Set视图。
					System.out.println("key= " + entry.getKey() + " and value= " + entry.getValue());
					if (entry.getValue().equals(business.get(j).getSiteId())) {
						totalnum++;
					}
				}
				business.get(j).setTotalUV(totalnum);
			}
			// 总注册用户数
			rs = jdbcTemplate.queryForList(sqlregistnum);
			for (int i = 0; i < rs.size(); i++) {
				BusinessData bd = null;
				Map numMap = (Map) rs.get(i);
				Number siteid = (Number) numMap.get("site_id");
				if (siteid == null)
					continue;
				for (int j = 0; j < business.size(); j++) {
					if (siteid.intValue() == business.get(j).getSiteId().intValue()) {
						bd = business.get(j);
						Number num = (Number) numMap.get("num");
						business.get(j).setTotalNum(num == null ? 0 : num.intValue());
					}
				}
			}
			// 总付费用户数
			rs = jdbcTemplate.queryForList(sqlpaycount);
			for (int i = 0; i < rs.size(); i++) {
				BusinessData bd = null;
				Map numMap = (Map) rs.get(i);
				Number siteid = (Number) numMap.get("site_id");
				if (siteid == null)
					continue;
				for (int j = 0; j < business.size(); j++) {
					if (siteid.intValue() == business.get(j).getSiteId().intValue()) {
						bd = business.get(j);
						Number num = (Number) numMap.get("num");
						business.get(j).setTotalPay(num == null ? 0 : num.intValue());
					}
				}
			}

			for (int i = 0; i < business.size(); i++) {
				BusinessData bd = business.get(i);
				String selSql = "SELECT * FROM t3_business_data WHERE DATE_FORMAT(create_time,'%Y-%m-%d')=? AND site_id=?";
				List<Map<String, Object>> ls = jdbcTemplate.queryForList(selSql, new Object[] { new SimpleDateFormat("yyyy-MM-dd").format(new Date()), bd.getSiteId() });
				if (ls.size() == 0) {
					String insertsql = "INSERT INTO t3_business_data(site_id," + "uv_num,register_num,pay_num,login_num," + "total_uv,total_num,total_pay, create_time)VALUES(" + bd.getSiteId() + ","
							+ bd.getUvNum() + "," + bd.getRegisterNum() + "," + bd.getPayNum() + "," + bd.getLoginNum() + "," + bd.getTotalUV() + "," + bd.getTotalNum() + "," + bd.getTotalPay() + ","
							+ "'" + DateUtil.getStringDate() + "')";
					jdbcTemplate.update(insertsql);
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
			log.error(e);
		}

	}

	public void s() {
		String selSql = "SELECT * FROM t3_business_data WHERE DATE_FORMAT(create_time,'%Y-%m-%d')=? AND site_id=?";
		List<Map<String, Object>> ls = jdbcTemplate.queryForList(selSql, new Object[] { new SimpleDateFormat("yyyy-MM-dd").format(new Date()), 560 });
		if (ls.size() == 0) {
			String insertsql = "INSERT INTO t3_business_data(site_id," + "uv_num,register_num,pay_num,login_num," + "permeate_ratenum,permeate_rateden," + "try_register_ratenum,try_register_rateden,"
					+ "register_pay_ratenum,register_pay_rateden," + "create_time)VALUES(" + 560 + "," + 1 + "," + 3 + "," + 2 + "," + 3 + "," + 1 + "," + 1 + "," + 1 + "," + 1 + "," + 1 + "," + 1
					+ "," + "'" + CalendarUtil.currentTime() + "')";
			jdbcTemplate.update(insertsql);
		} else {
			System.out.println(1);
		}
	}

	public void testx() throws ParseException {

		String totalSql = "SELECT ss.id AS siteId,ss.site_name,c.* FROM (SELECT s.site_name,r.nasid,s.id FROM t_cloud_site_routers r LEFT JOIN t_cloud_site s ON r.site_id=s.id WHERE s.id IN(1059)) AS ss LEFT JOIN  (SELECT  GROUP_CONCAT(username) usernames,GROUP_CONCAT(acctstarttime) AS acctstarttimes,GROUP_CONCAT(acctupdatetime) AS acctupdatetimes,GROUP_CONCAT(acctstoptime) AS acctstoptimes,nasid FROM radacct_20171024 WHERE acctstoptime IS NOT NULL  GROUP BY username) AS c ON ss.nasid=c.nasid";
		Object[] param = null;
		RowMapper rm = ParameterizedBeanPropertyRowMapper.newInstance(UserTemporaryTotalLog.class);
		List<UserTemporaryTotalLog> listUTT = jdbcTemplate.query(totalSql, param, rm);
		System.out.println("查询时间----" + new Date().getTime());
		String start = "";
		String stop = "";
		long totalTime = 0;
		if (listUTT.size() > 0) {
			String sql = "INSERT INTO t8_user_total_time_have (site_id,site_name,user_name,total_time,start_date,end_date,create_time) VALUES ";
			StringBuffer sbf = new StringBuffer();
			// 进行运算进行数据库录入操作
			for (int i = 0; i < listUTT.size(); i++) {
				System.out.println(i);
				long totaHour = 0;
				UserTotalTimeHave utt = new UserTotalTimeHave();
				UserTemporaryTotalLog userTTotalLog = listUTT.get(i);
				if (userTTotalLog.getAcctstarttimes() != "") {
					String stops = userTTotalLog.getAcctstoptimes() == "" ? userTTotalLog.getAcctupdatetimes() : userTTotalLog.getAcctstoptimes();
					// 起始时间获取分割
					String[] startArray = userTTotalLog.getAcctstarttimes().split(",");
					String[] stopArray = stops.split(",");
					if (startArray.length != 0 && stopArray.length != 0) {// 起始时间
						for (int j = 0; j < startArray.length; j++) {
							start = startArray[j];
							stop = stopArray[j];
							// 进行换算
							totalTime = DateUtil.subtractTime(stop, start);
							// 最终换算成小时
							totaHour += totalTime < 0 ? 0 : totalTime;

						}
					}
					// 结束
					utt.setStartDate(start);
					// 起始
					utt.setEndDate(stop);
					utt.setSiteId(userTTotalLog.getSiteId());
					utt.setSiteName(userTTotalLog.getSite_name());
					utt.setUserName(userTTotalLog.getUsernames().split(",")[0]);
					// 换算成小时、分钟
					utt.setTotal_time(DateUtil.dayHour(totaHour));
					utt.setCreate_time(DateUtil.date2StringShort(new Date()));
					sbf.append("(" + "'" + userTTotalLog.getSiteId() + "'" + "," + "'" + userTTotalLog.getSite_name() + "'" + "," + "'" + userTTotalLog.getUsernames().split(",")[0] + "'" + "," + "'"
							+ DateUtil.dayHour(totaHour) + "'" + "," + "'" + start + "'" + "," + "'" + stop + "'" + "," + "'" + DateUtil.date2StringShort(new Date()) + "'" + ")" + ",");
					// 数据库插入
					// nutDao.insert(utt);
				}
			}

			int res = jdbcTemplate.update(sql + sbf.toString().substring(0, sbf.toString().length() - 1));
			System.out.println(res);
		}
	}

	public static void main(String[] args) throws ParseException {
		System.err.println(new SimpleDateFormat("yyyy-MM-dd").format(new Date()));
		TimingtaskServiceImpl t = InitContext.getBean("timingtaskServiceImpl", TimingtaskServiceImpl.class);
		System.out.println("开始----" + new Date().getTime());
		t.testx();
		System.out.println("结束----" + new Date().getTime());
	}
}
