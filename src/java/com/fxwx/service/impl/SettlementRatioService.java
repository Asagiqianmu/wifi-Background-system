package com.fxwx.service.impl;

import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.text.DecimalFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Random;

import javax.annotation.Resource;

import org.apache.log4j.Logger;
import org.nutz.dao.Cnd;
import org.nutz.dao.Dao;
import org.nutz.dao.FieldFilter;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementCreator;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fxwx.bean.CloudUserAccount;
import com.fxwx.bean.FinanceBean;
import com.fxwx.bean.FinanceRecord;
import com.fxwx.bean.SettlementAuditBean;
import com.fxwx.bean.UserRecordsBankBean;
import com.fxwx.entity.Appeal;
import com.fxwx.entity.CloudSite;
import com.fxwx.entity.CommonConfig;
import com.fxwx.util.BigDecimalUtil;
import com.fxwx.util.DateUtil;
import com.fxwx.util.InitContext;
import com.fxwx.util.ReflectUtil;
import com.fxwx.util.UUIDUtils;

/**
 * 财务模块--结算比例
 * 
 * @author Administrator 更新新客户提成比例
 */

@Service
@SuppressWarnings("all")
@Transactional
public class SettlementRatioService {

	private static Logger log = Logger.getLogger(RealnameAuthImpl.class);

	@Resource(name = "jdbcTemplate")
	private JdbcTemplate jdbcTemplate;
	@Resource(name = "nutDao")
	private Dao nutDao;

	/**
	 * 更新新接入客户缴纳技术支持费用的比例，根据配置类型更新（881）
	 * 
	 * @param values
	 *            要跟新的数值 double
	 * @return boolean
	 */
	public boolean updateRatio(double values) {
		String sql = "UPDATE `t4_common_config` SET commonchagrge=? WHERE ident=881";
		int backnum = jdbcTemplate.update(sql, new Object[] { values });
		if (backnum > 0) {
			return true;
		} else {
			return false;
		}
	}

	/**
	 * 
	 * @Description:获取公共配置比例
	 * @author songyanbiao
	 * @date 2016年7月15日 上午11:23:59
	 * @param
	 * @return
	 */
	public String getRatioConfig() {

		try {
			CommonConfig comfig = nutDao.fetch(CommonConfig.class,
					Cnd.where("ident", "=", "881"));
			return comfig.getCommonChagrge() + "";
		} catch (Exception e) {
			log.error("查询公共配置手续费出错", e);
			return "";
		}
	}

	/**
	 * 设置单客户需要缴纳的技术支持费用比例，根据账户id更新
	 */
	public boolean updateCharge(int user_id, double charge_rate) {
		String sql = "UPDATE t4_income_collect SET charge_rate=?  WHERE user_id =?";
		int backnum = jdbcTemplate.update(sql, new Object[] { charge_rate,
				user_id });
		if (backnum > 0) {
			return true;
		} else {
			return false;
		}
	}

	/**
	 * 财务结算审核---------806 --被申诉       805(808)---已支付      803--待支付      801--未审核----------------------
	 */
	/**
	 * 财务核算分页查询
	 */
	public List<SettlementAuditBean> getOrderList(int status, int page,
			int pagenum) {
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String sql = "SELECT acct.bank_info_id,acct.id,acct.account_id,(SELECT user_name FROM t_cloud_user tus WHERE tus.id=acct.user_id) AS userid,acct.account_income,acct.account_platform_income,acct.account_offline_income,";
		sql += "acct.account_balance_after,acct.account_refund,acct.account_status,acct.start_time as start_time,acct.end_time as end_time,cloudu.real_name,cloudu.user_tel,cloudu.user_mail,cloudu.user_address,cloudu.company_name,coll.charge_rate";
		if (status == 806) {
			sql += ",app.appeal_content ";
		} else if (status == 805) {
			sql += ",acct.flow_code";
		}
		sql += " FROM t_user_account_log acct LEFT JOIN t4_cloud_user_detail cloudu ON acct.user_id=cloudu.user_id ";
		if (status == 806) {
			sql += "  LEFT JOIN t4_appeal app ON acct.account_id=app.account_id  ";
		}
		if (status == 805)
			sql += " LEFT JOIN t4_income_collect coll ON acct.user_id=coll.user_id WHERE  account_status IN (805,808)";
		else {
			sql += " LEFT JOIN t4_income_collect coll ON acct.user_id=coll.user_id WHERE  account_status="
					+ status;

		}
		sql += " LIMIT  ?,?";
		List<Map<String, Object>> auditBeans = jdbcTemplate
				.queryForList(sql,
						new Object[] {
								((page * pagenum - pagenum) > -1 ? (page
										* pagenum - pagenum) : 0), pagenum });
		List<SettlementAuditBean> beans = new ArrayList<>();
		for (Map<String, Object> map : auditBeans) {
			SettlementAuditBean bean = new SettlementAuditBean();
			bean.setId((int) map.get("id"));
			bean.setAcctID((String) map.get("account_id"));
			bean.setUserId((String) map.get("userid"));
			bean.setAccountIncome((BigDecimal) map.get("account_income"));
			bean.setAccountPlatformIncome((BigDecimal) map
					.get("account_platform_income"));
			bean.setAccountOfflineIncome((BigDecimal) map
					.get("account_offline_income"));
			bean.setAccountBalanceAfter((BigDecimal) map
					.get("account_balance_after"));
			bean.setAccountRefund((BigDecimal) map.get("account_refund"));
			bean.setAccountStatus(Integer.parseInt((String) map
					.get("account_status")));
			long startTime = (long) map.get("start_time");
			bean.setStartTime(sdf.format(startTime));
			long endTime = (long) map.get("end_time");
			bean.setEndTime(sdf.format(endTime));
			bean.setRealName((String) map.get("real_name"));
			bean.setUserTel((String) map.get("user_tel"));
			bean.setUserMail((String) map.get("user_mail"));
			bean.setUserAddress((String) map.get("user_address"));
			bean.setCompanyName((String) map.get("company_name"));
			bean.setChargeRate((BigDecimal) map.get("charge_rate"));
			bean.setBankCard((String) map.get("bank_info_id"));
			if (status == 806)
				bean.setApplean((String) map.get("appeal_content"));
			else if (status == 805)
				bean.setFlowId((String) map.get("flow_code"));
			beans.add(bean);
		}
		return beans;
	}

	/**
	 * 总页数 806 --被申诉       805(808)---已支付          803--待支付          801--未审核
	 */
	public int getPageCount(int status, String userName) {
		String sql = "";
		if (status != 0) {
			if (status == 805||status==808) {
				sql = "SELECT COUNT(1) as pagecount FROM t_user_account_log acct WHERE  account_status in(805,808)";
			} else {
				sql = "SELECT COUNT(1) as pagecount FROM t_user_account_log acct WHERE  account_status = ? ";
			}
		} else {
			sql = "SELECT COUNT(*) FROM t4_income_collect";
			if (!userName.equals("")) {
				sql = "SELECT COUNT(*) FROM t4_income_collect t INNER JOIN t_cloud_user u WHERE t.user_id=u.id AND u.user_name="
						+ userName;
			}
			return jdbcTemplate.queryForInt(sql);
		}
		List<Map<String, Object>> mappage = null;
		if (status == 805) {
			mappage = jdbcTemplate.queryForList(sql);
		} else {
			mappage = jdbcTemplate.queryForList(sql, new Object[] { status });
		}
		return mappage.get(0).get("pagecount") == null ? 0 : Integer
				.parseInt(mappage.get(0).get("pagecount").toString());
	}

	/**
	 * 修改金额
	 */
	public boolean updateAcctlog(final BigDecimal accountBalanceAfter,
			final String accountId, List<FinanceRecord> listfinance,
			final BigDecimal bfMoney) {
		String sql = "update t_user_account_log set account_balance_after=?  where account_id=? ";
		if (jdbcTemplate.update(sql, new Object[] { accountBalanceAfter,
				accountId }) < 1)
			throw new NullPointerException("keyHolder 空值异常");
		final String insertchange = "insert into t4_money_change(account_id,before_money,after_money) values (?,?,?)";
		KeyHolder keyHolder = new GeneratedKeyHolder();
		jdbcTemplate.update(new PreparedStatementCreator() {
			@Override
			public PreparedStatement createPreparedStatement(Connection con)
					throws SQLException {
				PreparedStatement ps = con.prepareStatement(insertchange,
						PreparedStatement.RETURN_GENERATED_KEYS);
				ps.setString(1, accountId);
				ps.setBigDecimal(2, bfMoney);
				ps.setBigDecimal(3, accountBalanceAfter);
				return ps;
			}
		}, keyHolder);
		if (keyHolder.getKey() == null)
			throw new NullPointerException("keyHolder 空值异常");
		int backnum = 0;
		for (FinanceRecord financeRecord : listfinance) {
			String fileurl = financeRecord.getImgBase1()
					+ (financeRecord.getImgBase2().length() > 1 ? (";" + financeRecord
							.getImgBase2()) : "");
			String insert = "insert into t4_finance_record(accound_id,reason_type,reason_content,reason_fileurl,create_time,change_id) values(?,?,?,?,NOW(),?)";
			backnum = jdbcTemplate.update(insert, new Object[] { accountId,
					financeRecord.getMoneyType(), financeRecord.getRemark(),
					fileurl, keyHolder.getKey().intValue() });
		}
		if (backnum > 0) {
			return true;
		} else {
			return false;
		}
	}

	/**
	 * 提取申诉 申诉状态标示 806
	 */
	public boolean updateAppealStatus(String account_id, String reson) {
		String sql = "update t_user_account_log set account_status=806  where  account_id= "
				+ account_id;
		String insert = "insert into t4_appeal(appeal_id,account_id,appeal_content,appeal_status,create_time) values(?,?,?,20,NOW())";
		jdbcTemplate.update(sql, new Object[] { UUIDUtils.getUUID(),
				account_id, reson });
		int backnum = jdbcTemplate.update(insert);
		if (backnum > 0) {
			return true;
		} else {
			return false;
		}
	}

	/**
	 * 提取申诉 查询最近一条申诉内容
	 * 
	 * @throws ParseException
	 */
	public Appeal selectAppeal(String account_id) throws ParseException {
		String sql = "SELECT * FROM t4_appeal WHERE account_id =? ORDER BY id desc limit 1";
		List<Map<String, Object>> auditBeans = jdbcTemplate.queryForList(sql,
				new Object[] { account_id });
		Appeal appeal = new Appeal();
		if (auditBeans.size() > 0) {
			appeal.setAccountId((String) auditBeans.get(0).get("account_id"));
			appeal.setAppealId((String) auditBeans.get(0).get("appeal_id"));
			appeal.setAppealReason((String) auditBeans.get(0).get(
					"appeal_content"));
			appeal.setAppealStatus((String) auditBeans.get(0).get(
					"appeal_status"));
			appeal.setStartTime(new SimpleDateFormat("yyyy-M-dd HH:mm:ss")
					.parse((String) auditBeans.get(0).get("create_time")));
		}
		return appeal;
	}

	/**
	 * 财务审核----修改提现工单状态
	 */
	public boolean updateAcctStatus(int status, String account_id, int newstatus) {
		String sql = "update t_user_account_log set account_status=? where account_id=? and account_status=?";
		int backnum = jdbcTemplate.update(sql, new Object[] { newstatus,
				account_id, status });
		if (backnum > 0) {
			return true;
		} else {
			return false;
		}
	}

	/**
	 * 财务审核----修改应付金额-- 查询原因
	 */
	public String[] getResonType() {
		String sql = "SELECT resontype FROM `t4_common_config`";
		String resontype = jdbcTemplate.queryForObject(sql, String.class);
		return resontype == null ? null : resontype.split(",");
	}

	/**
	 * 财务审核----修改应付金额--添加原因类型
	 */
	public boolean saveResonType(String type) {
		String sql = "UPDATE `t4_common_config` SET resontype=CONCAT(resontype,',"
				+ type + "' )";
		int backnum = jdbcTemplate.update(sql);
		if (backnum > 0) {
			return true;
		} else {
			return false;
		}
	}

	/**
	 * 财务审核----查询结算限制
	 */
	public List selectSettlement() {
		String sql = "SELECT commonbalanceday,commonminmoney,resontype FROM `t4_common_config` WHERE ident=881";
		List<Map<String, Object>> listMap = jdbcTemplate.queryForList(sql);
		return listMap;
	}

	/**
	 * 财务审核----修改应付金额--修改结算限制
	 */
	public boolean saveSettlementlimit(String minmoney, String mintime) {
		String sql = "UPDATE `t4_common_config` SET ";
		if (minmoney != null && minmoney.length() > 0) {
			sql += " commonminmoney=" + minmoney;
			if (mintime != null && mintime.length() > 0) {
				sql += ", commonbalanceday=" + mintime;
			}
		} else if (mintime != null && mintime.length() > 0) {
			sql += " commonbalanceday=" + mintime;
		} else {
			return false;
		}
		sql += " where ident=881";
		int backnum = jdbcTemplate.update(sql);
		if (backnum > 0) {
			return true;
		} else {
			return false;
		}
	}

	/**
	 * 财务审核----提交支付凭证
	 */
	public boolean updatePayProof(String account_from, String account_id) {
		String sql = "update t_user_account_log set flow_code='" + account_from
				+ "',account_status=805 where account_id= '" + account_id + "'";
		int backnum = jdbcTemplate.update(sql);
		if (backnum > 0) {
			return true;
		} else {
			return false;
		}
	}

	/**
	 * 通过订单号查询该订单的所有修改凭证
	 */
	public List selectFinanceRecord(String acctound_id) {
		String sql = "SELECT id,account_id,before_money,after_money FROM t4_money_change WHERE account_id='"
				+ acctound_id + "'";
		List<Map<String, Object>> maplist = jdbcTemplate.queryForList(sql);
		for (int i = 0; i < maplist.size(); i++) {
			String sql2 = "SELECT * FROM t4_finance_record where change_id="
					+ (Integer) maplist.get(i).get("id");
			List<Map<String, Object>> maplist2 = jdbcTemplate
					.queryForList(sql2);
			maplist.get(i).put("list", maplist2);
		}
		return maplist;
	}

	/**
	 * 生成提现工单
	 */
	public boolean saveWithdrawal(BigDecimal moneyplatform,
			BigDecimal moneyoffline, long timec, int userid) {
		String upsql = "UPDATE t4_income_collect SET platform_income=platform_income-?,offline_income=offline_income-?,withdraw_time=?  WHERE user_id=? AND  ?-withdraw_time>604800000";
		int backnum = jdbcTemplate.update(upsql, new Object[] { moneyplatform,
				moneyoffline, timec, userid, timec });
		if (backnum > 0) {
			String sql = "insert into t_user_account_log(account_id,user_id,bank_info_id,account_income,";
			sql += "account_platform_income,account_offline_income,account_refund,";
			sql += "account_status,create_time,end_time,start_time) values('"
					+ getRandomUUID()
					+ "',345,88855,154,100,54,0,801,NOW(),1468477490,1468487490)";
		}
		return false;
	}

	public static String getRandomUUID() {
		// 1、创建时间戳
		java.util.Date dateNow = new java.util.Date();
		SimpleDateFormat dateFormat = new SimpleDateFormat("yyyyMMddHHmmss");
		String dateNowStr = dateFormat.format(dateNow);
		StringBuffer sb = new StringBuffer(dateNowStr);
		// 2、创建随机对象
		Random rd = new Random();
		// 3、产生4位随机数
		String n = "";
		int rdGet; // 取得随机数
		do {
			rdGet = Math.abs(rd.nextInt()) % 10 + 48; // 产生48到57的随机数(0-9的键位值)
			// rdGet=Math.abs(rd.nextInt())%26+97; //产生97到122的随机数(a-z的键位值)
			char num1 = (char) rdGet;
			String dd = Character.toString(num1);
			n += dd;
		} while (n.length() < 4);// 假如长度小于4
		sb.append(n);
		// 4、返回唯一码
		return sb.toString();
	}

	/**
	 * 
	 * @Description:获取商户场所分页查询
	 * @author songyanbiao
	 * @date 2016年7月14日 上午11:28:13
	 * @param
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public List<CloudUserAccount> getUserList(int curPage, int pageSize,
			String userName) throws Exception {
		List<CloudUserAccount> list = new ArrayList<>();
		try {
			StringBuffer sbf = new StringBuffer();
			sbf.append("SELECT u.user_name,s.site_name ,c.charge_rate ,c.user_id,d.real_name FROM t_cloud_user u INNER JOIN  t4_cloud_user_detail d INNER JOIN t_cloud_site s "
					+ "INNER JOIN t4_income_collect c  WHERE d.user_id=u.id AND s.user_id=u.id AND c.user_id=u.id AND u.id IN "
					+ "(SELECT c.user_id FROM (SELECT * FROM t4_income_collect LIMIT ?,?) AS c)");
			if (!userName.equals("")) {
				sbf.append(" AND u.user_name=").append(userName);
			}
			String sql = "SELECT user.id,user.user_name,GROUP_CONCAT(site.site_name) names,income.charge_rate,ud.real_name from t4_income_collect income"
					+ " LEFT JOIN t_cloud_user  user ON income.user_id=user.id "
					+ " LEFT JOIN t_cloud_site site ON site.user_id=income.user_id"
					+ " LEFT JOIN t4_cloud_user_detail ud ON ud.user_id=income.user_id";
			if (!userName.equals("")) {
				sql += " WHERE user.user_name=" + userName;
			}
			sql += " GROUP BY income.user_id ORDER BY income.user_id ASC LIMIT ?,?";

			sbf.append(" ORDER BY user_id ASC");
			List<Map<String, Object>> ls = jdbcTemplate.queryForList(sql,
					new Object[] { (curPage * pageSize - pageSize), pageSize });
			for (int i = 0; i < ls.size(); i++) {
				CloudUserAccount cua = new CloudUserAccount();
				List<String> lsName = new ArrayList<String>();
				// lsName.add(ls.get(i).get("site_name")+"");
				cua.setScale(ls.get(i).get("charge_rate") + "");
				cua.setUserAccount(ls.get(i).get("user_name") + "");
				if (!(ls.get(i).get("site_name") + "").equals("")) {
					for (int j = 0; j < (ls.get(i).get("names") + "")
							.split(",").length; j++) {
						lsName.add((ls.get(i).get("names") + "").split(",")[j]);
						lsName.removeAll(Collections.singleton(null));
					}
				}
				cua.setSiteList(lsName);
				cua.setUserId(ls.get(i).get("user_id") + "");
				cua.setRealName(ls.get(i).get("real_name") + "");
				// for (int j = i+1; j < ls.size(); j++) {
				// if((ls.get(i).get("user_id")+"").equals((ls.get(j).get("user_id")+""))){
				// lsName.add(ls.get(j).get("site_name")+"");
				// i=i+1;
				// }
				// }
				list.add(cua);
			}
		} catch (Exception e) {
			log.error("查询所有商户列表出错", e);
		}

		return list;
	}

	/**
	 * 
	 * @Description:修改代理商收费比例
	 * @author songyanbiao
	 * @date 2016年7月14日 上午11:29:50
	 * @param
	 * @return
	 */
	public boolean updateChoiceAgent(String[] arr, String ratio) {
		try {
			String sql = "UPDATE t4_income_collect SET charge_rate=? WHERE user_id=?";
			if (arr.length == 0) {
				sql = "UPDATE t4_common_config SET commonchagrge =? WHERE ident=881";
				jdbcTemplate.update(sql,
						new Object[] { Double.parseDouble(ratio) / 100 });
			} else {
				for (int i = 0; i < arr.length; i++) {
					jdbcTemplate.update(sql,
							new Object[] { Double.parseDouble(ratio) / 100,
									arr[i] });
				}
			}
		} catch (Exception e) {
			log.error("更改用户收费比例出错", e);
			return false;
		}
		return true;
	}

	/**
	 * 提现记录
	 * 
	 * @throws ParseException
	 */
	public List<SettlementAuditBean> getWithdrawList(int pageIndex,
			String userId, String startDate, String endDate, int pageNum)
			throws ParseException {
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:ss:mm");
		StringBuffer sql = new StringBuffer();
		sql.append(" select ");
		sql.append(" log.user_id,detail.real_name,");
		sql.append(" log.account_income,");
		sql.append(" log.account_platform_income,");
		sql.append(" log.account_offline_income,");
		sql.append(" log.account_refund,");
		sql.append(" log.account_balance_after,");
		sql.append(" log.start_time as start_time,");
		sql.append(" log.end_time as end_time,");
		sql.append(" collect.charge_rate");
		sql.append(" from t_user_account_log log");
		sql.append(" left join t4_income_collect collect on collect.user_id = log.user_id");
		sql.append(" left join t_cloud_user user on user.id = log.user_id");
		sql.append(" left join t4_cloud_user_detail detail on detail.user_id = log.user_id");
		sql.append(" where log.account_status IN (805,808) ");
		if (!startDate.equals("")) {
			startDate = startDate + " 00:00:00";
			Date sTime = sdf.parse(startDate);
			sql.append(" and log.start_time > ").append(
					"'" + sTime.getTime() + "'");
		}
		if (!endDate.equals("")) {
			endDate = endDate + " 23:59:59";
			Date eTime = sdf.parse(endDate);
			sql.append(" and log.end_time < ").append(
					"'" + eTime.getTime() + "'");
		}
		if (!userId.equals("")) {
			sql.append(" and user.user_name = " + userId);
		}
		sql.append(" order by log.start_time desc");
		sql.append(" limit ?,?");// TODO 分页
		List<Map<String, Object>> withdrawList = jdbcTemplate.queryForList(
				sql.toString(), (pageIndex - 1) * pageNum, pageNum);
		List<SettlementAuditBean> beans = new ArrayList<>();
		ReflectUtil reflectUtil = new ReflectUtil();
		for (Map<String, Object> map : withdrawList) {
			SettlementAuditBean bean = new SettlementAuditBean();
			bean.setAccountIncome((BigDecimal) map.get("account_income"));
			bean.setAccountPlatformIncome((BigDecimal) map
					.get("account_platform_income"));
			bean.setAccountOfflineIncome((BigDecimal) map
					.get("account_offline_income"));
			bean.setAccountRefund((BigDecimal) map.get("account_refund"));
			bean.setChargeRate((BigDecimal) map.get("charge_rate"));
			bean.setAccountBalanceAfter((BigDecimal) map
					.get("account_balance_after"));
			Long sTime = new Long(map.get("start_time") + "");
			bean.setStartTime(sdf.format(sTime));
			Long eTime = new Long(map.get("end_time") + "");
			bean.setEndTime(sdf.format(eTime));
			bean.setRealName(map.get("real_name") + "");
			bean.setUserId(map.get("user_id") + "");
			// reflectUtil.mapToBean(bean, map);
			beans.add(bean);
		}
		return beans;
	}

	/**
	 * 获取提现信息
	 * 
	 * @Description: TODO
	 * @param userId
	 * @return
	 * @Date 2016年7月15日 下午3:11:16
	 * @Author cuimiao
	 */
	public Map<String, Object> getWithdrawInfo(String userId) {
		StringBuffer sql = new StringBuffer();
		Object[] param = new Object[0];
		sql.append(" select ");
		sql.append(" coll.user_id,");
		sql.append(" detail.real_name,");
		sql.append(" coll.platform_income,");
		sql.append(" coll.offline_income,");
		sql.append(" coll.account_refund,");
		sql.append(" coll.withdraw_time as withdraw_time");
		sql.append(" from");
		sql.append(" t4_income_collect coll");
		sql.append(" left join t_cloud_user user on user.id = coll.user_id");
		sql.append(" left join t4_cloud_user_detail detail on detail.user_id = coll.user_id");
		sql.append(" where");
		sql.append(" user.user_name = ?");
		sql.append(" order by withdraw_time desc");
		sql.append(" limit 0 , 1");
		param = new Object[] { userId };
		List<Map<String, Object>> withdrawList = jdbcTemplate.queryForList(
				sql.toString(), param);
		if (withdrawList.size() != 0) {
			return withdrawList.get(0);
		} else {
			Map map = new HashMap<String, Object>();
			map.put("user_name", "");
			map.put("platform_income", 0);
			map.put("offline_income", 0);
			map.put("account_refund", 0);
			map.put("withdraw_time", "");
			return map;
		}
	}

	/**
	 * 获取提现信息
	 * 
	 * @Description: TODO
	 * @param userId
	 * @return
	 * @throws ParseException
	 * @Date 2016年7月15日 下午3:11:16
	 * @Author cuimiao
	 */
	public int getWithdrawPageNum(String userId, String startDate,
			String endDate) throws ParseException {
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		StringBuffer sql = new StringBuffer();
		sql.append(" select ");
		sql.append(" count(*)");
		sql.append(" from t_user_account_log log");
		sql.append(" left join t4_income_collect collect on collect.user_id = log.user_id");
		sql.append(" left join t_cloud_user user on user.id = log.user_id");
		sql.append(" where log.account_status IN (805,808) ");
		if (!startDate.equals("")) {
			startDate = startDate + " 00:00:00";
			Date sTime = sdf.parse(startDate);
			sql.append(" and log.start_time >").append(
					"'" + sTime.getTime() + "'");
		}
		if (!endDate.equals("")) {
			endDate = endDate + " 23:59:59";
			Date eTime = sdf.parse(endDate);
			sql.append(" and log.end_time< ").append(
					"'" + eTime.getTime() + "'");
		}
		if (!userId.equals("")) {
			sql.append(" and  user.user_name =" + userId);
		}
		int pageNum = jdbcTemplate
				.queryForObject(sql.toString(), Integer.class);
		return pageNum;

	}

	public List<Map<String, Object>> getWithdrawDetail(int userId,
			String startDate, String endDate) {
		if (startDate.equals("")) {
			startDate = DateUtil.getStringDateShort();
		}
		if (endDate.equals("")) {
			endDate = DateUtil.getStringDateShort();
		}
		Object[] param = new Object[0];
		StringBuffer sql = new StringBuffer();
		sql.append(" SELECT ");
		sql.append(" income.transaction_amount,");// 缴费金额
		sql.append(" site.site_name,");// 场所名称
		sql.append(" income.portal_user_name,");// 缴费用户用户名
		sql.append(" income.pay_name,");// 收费类型
		sql.append(" income.buy_num,");// 购买数量
		sql.append(" case when pay_type=0 then '未知支付类型'");
		sql.append(" when pay_type=1 then '支付宝支付'");
		sql.append(" when pay_type=2 then '银行卡快捷支付'");
		sql.append(" when pay_type=2 then '微信支付'");
		sql.append(" when pay_type=2 then '人工支付' else '' end as pay_type_name,");
		sql.append(" income.pay_type,");// 支付类型
		sql.append(" income.create_time");// 创建时间
		sql.append(" FROM t_site_income income");
		sql.append(" left join t_cloud_site site on income.site_id = site.id");
		sql.append(" where site.user_id = ?");
		sql.append(" and income.create_time >= ?");
		sql.append(" and income.create_time <= ?");
		param = new Object[] { userId, startDate, endDate };
		// param = new Object[]{userId};
		List<Map<String, Object>> withdrawList = jdbcTemplate.queryForList(
				sql.toString(), param);

		return withdrawList;
	}

	/**
	 * @Description  获得时间段的总收入
	 * @date 2016年12月12日下午3:26:43
	 * @author guoyingjie
	 * @param siteId
	 * @param agentName
	 * @param startTime
	 * @param endTime
	 */
	public Map getTotalIncome(int siteId,String agentName,String startTime,String endTime){
		String startTimes = startTime + " 00:00:00";
		String endTimes = endTime + " 23:59:59";
		List<Map<String, Object>> list = null;
		Map map = new HashMap(1);
		if(-2==siteId){//查询全部
			String sql = "SELECT SUM(transaction_amount) income,portal_user_name name FROM t_site_income where site_id in(SELECT id FROM t_cloud_site where user_id = (SELECT id from t_cloud_user where user_name = ?)) AND create_time BETWEEN ? AND ? GROUP BY  portal_user_name not LIKE '0%'";
			list = jdbcTemplate.queryForList(sql,new Object[]{agentName,startTimes,endTimes});
		}else{
			String ssql = "SELECT SUM(transaction_amount) income,portal_user_name name FROM t_site_income where site_id = ? AND create_time BETWEEN ? AND ? GROUP BY  portal_user_name not LIKE '0%'";
			list = jdbcTemplate.queryForList(ssql,new Object[]{siteId,startTimes,endTimes});
		}
		
		if(list.size()==2){
			String username = list.get(0).get("name")+"";
			String endName = username.substring(0, 1);
			if(endName.equals("0")){//线下收入
				map.put("off",list.get(0).get("income"));
			} 
			map.put("line",list.get(1).get("income"));
			BigDecimal off = new BigDecimal(list.get(0).get("income").toString());
			BigDecimal line = new BigDecimal(list.get(0).get("income").toString());
			map.put("total",BigDecimalUtil.add(off,line));
		}else if(list.size()==1&&list.get(0).get("income") != null && !"".equals(list.get(0).get("income"))){
			String username = list.get(0).get("name")+"";
			String endName = username.substring(0, 1);
			if(endName.equals("0")){//线下收入
				map.put("off",list.get(0).get("income"));
			}
			map.put("line",0.00);
			map.put("total",list.get(0).get("income"));
		}else{
			map.put("line",0);
			map.put("off",0);
			map.put("total",0);
		}
		return map;
	}
	
	
	
	
	
	public static void main(String[] args) {
		SettlementRatioService a = InitContext.getBean("settlementRatioService", SettlementRatioService.class);
		Map m = a.getTotalIncome(111111, "","2016-07-08 15:09:53", "2017-07-08 15:09:53");
		System.out.println(m);
	}
	
	
	
	/**
	 * @Description 获得代理商下的所有的场所
	 * @date 2016年9月30日上午9:39:36
	 * @author guoyingjie
	 * @param username
	 *            --代理商账号
	 * @return
	 */
	public List<CloudSite> getSiteListByName(String username) {
		List<CloudSite> clouds = null;
		try {
			String sql = "SELECT c.* FROM t_cloud_site c LEFT JOIN t_cloud_user u ON c.user_id = u.id where u.user_name = ?";
			clouds = jdbcTemplate.query(sql, new Object[] { username },
					new BeanPropertyRowMapper<>(CloudSite.class));
		} catch (Exception e) {
			log.error(this.getClass().getCanonicalName());
		}
		return clouds;
	}

	/**
	 * @Description 财务管理查看明细
	 * @date 2016年10月9日上午10:41:37
	 * @author guoyingjie
	 * @param siteId
	 * @param username
	 * @param paytype
	 * @param startTime
	 * @param endTime
	 * @param curpage
	 * @param pagesize
	 */
	public List<FinanceBean> getIncomeByType(int siteId, String username,
			int paytype, String startTime, String endTime, int curpage,
			int pagesize) {
		boolean sflag = false;
		boolean eflag = false;
		boolean uflag = false;
		String startTimes = "";
		String endTimes = "";
		if (!"".equals(startTime) && startTime != null) {
			startTimes = startTime + " 00:00:00";
			sflag = true;
		}
		if (!"".equals(endTime) && endTime != null) {
			endTimes = endTime + " 23:59:59";
			eflag = true;
		}
		if (username != null && !"".equals(username)) {
			uflag = true;
		}
		int current = ((curpage - 1) < 0 ? 0 : (curpage - 1)) * pagesize;
		List<FinanceBean> list = null;
		try {
			String sql = "SELECT u.user_name,k.site_name,k.param_json,k.pay_type,k.finish_time FROM t_portal_user u LEFT JOIN (SELECT r.param_json,s.id,r.user_id,s.site_name,r.finish_time,r.pay_type FROM t_sitepayment_records r RIGHT JOIN t_cloud_site s ON r.site_id=s.id  where is_finish in(-1,1) and param_json REGEXP '^{') k ON u.id = k.user_id where k.id = ? AND k.pay_type=? "; 
			if (uflag && !sflag && !eflag) {// 说明没有时间的条件
				sql += " and u.user_name = ? limit ?,?";
				list = jdbcTemplate.query(sql, new Object[] { siteId, paytype,
						username, current, pagesize },
						new BeanPropertyRowMapper(FinanceBean.class));
			}
			if (!uflag && sflag && eflag) {// 说明没有用户的查询条件
				sql += " and k.finish_time > ? and k.finish_time < ? limit ?,?";
				list = jdbcTemplate.query(sql, new Object[] { siteId, paytype,
						startTimes, endTimes, current, pagesize },
						new BeanPropertyRowMapper(FinanceBean.class));
			}
			if (!uflag && !sflag && eflag) {
				sql += " and k.finish_time < ? limit ?,?";
				list = jdbcTemplate.query(sql, new Object[] { siteId, paytype,
						endTimes, current, pagesize },
						new BeanPropertyRowMapper(FinanceBean.class));
			}
			if (!uflag && sflag && !eflag) {
				sql += " and k.finish_time > ? limit ?,?";
				list = jdbcTemplate.query(sql, new Object[] { siteId, paytype,
						startTimes, current, pagesize },
						new BeanPropertyRowMapper(FinanceBean.class));
			}
			if (uflag && sflag && eflag) {
				sql += " and k.finish_time > ? and k.finish_time < ? and u.user_name = ? limit ?,?";
				list = jdbcTemplate.query(sql, new Object[] { siteId, paytype,
						startTimes, endTimes, username, current, pagesize },
						new BeanPropertyRowMapper(FinanceBean.class));
			}
			if (!uflag && !sflag && !eflag) {
				sql += " limit ?,?";
				list = jdbcTemplate.query(sql, new Object[] { siteId, paytype,
						current, pagesize }, new BeanPropertyRowMapper(
						FinanceBean.class));
			}
		} catch (Exception e) {
			log.error("财务管理查看明细异常", e);
		}
		return list;
	}

	/**
	 * @Description 获得 财务管理总页数
	 * @date 2016年10月9日下午12:48:03
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
	public int getIncomeByTypePage(int siteId, String username, int paytype,
			String startTime, String endTime, int pagesize) {
		int totalpage = 0;
		boolean sflag = false;
		boolean eflag = false;
		boolean uflag = false;
		String startTimes = "";
		String endTimes = "";
		if (!"".equals(startTime) && startTime != null) {
			startTimes = startTime + " 00:00:00";
			sflag = true;
		}
		if (!"".equals(endTime) && endTime != null) {
			endTimes = endTime + " 23:59:59";
			eflag = true;
		}
		if (username != null && !"".equals(username)) {
			uflag = true;
		}
		try {
			String sql = "SELECT count(u.user_name) as total FROM t_portal_user u LEFT JOIN (SELECT r.param_json,s.id,r.user_id,s.site_name,r.finish_time,r.pay_type FROM t_sitepayment_records r RIGHT JOIN t_cloud_site s ON r.site_id=s.id  where is_finish in(-1,1) and param_json REGEXP '^{') k ON u.id = k.user_id where k.id = ? AND k.pay_type=? ";/*
																																																																																							 * LIMIT
																																																																																							 * ?
																																																																																							 * ,
																																																																																							 * ?
																																																																																							 * ";
																																																																																							 */
			if (uflag && !sflag && !eflag) {// 说明没有时间的条件
				sql += " and u.user_name = ?";
				totalpage = jdbcTemplate.queryForInt(sql, new Object[] {
						siteId, paytype, username });
			}
			if (!uflag && sflag && eflag) {// 说明没有用户的查询条件
				sql += " and k.finish_time > ? and k.finish_time < ?";
				totalpage = jdbcTemplate.queryForInt(sql, new Object[] {
						siteId, paytype, startTimes, endTimes });
			}
			if (!uflag && !sflag && eflag) {
				sql += " and k.finish_time < ?";
				totalpage = jdbcTemplate.queryForInt(sql, new Object[] {
						siteId, paytype, endTimes });
			}
			if (!uflag && sflag && !eflag) {
				sql += " and k.finish_time > ?";
				totalpage = jdbcTemplate.queryForInt(sql, new Object[] {
						siteId, paytype, startTimes });
			}
			if (uflag && sflag && eflag) {
				sql += " and k.finish_time > ? and k.finish_time < ? and u.user_name = ?";
				totalpage = jdbcTemplate.queryForInt(sql, new Object[] {
						siteId, paytype, startTimes, endTimes, username });
			}
			if (!uflag && !sflag && !eflag) {
				totalpage = jdbcTemplate.queryForInt(sql, new Object[] {
						siteId, paytype });
			}
			totalpage = totalpage < 1 ? 0 : totalpage;
			int totalPageNum = (totalpage % pagesize) > 0 ? (totalpage
					/ pagesize + 1) : totalpage / pagesize;
			return totalPageNum;
		} catch (Exception e) {
			log.error("财务管理查看明细分页异常", e);
		}
		return totalpage;
	}

	/**
	 * @Description 导出财务管理明细
	 * @date 2016年10月9日下午3:37:14
	 * @author guoyingjie
	 * @param siteId
	 * @param username
	 * @param paytype
	 * @param startTime
	 * @param endTime
	 * @return
	 */
	public List<FinanceBean> exportIncomeByType(int siteId, String username,
			int paytype, String startTime, String endTime) {
		boolean sflag = false;
		boolean eflag = false;
		boolean uflag = false;
		String startTimes = "";
		String endTimes = "";
		if (!"".equals(startTime) && startTime != null) {
			startTimes = startTime + " 00:00:00";
			sflag = true;
		}
		if (!"".equals(endTime) && endTime != null) {
			endTimes = endTime + " 23:59:59";
			eflag = true;
		}
		if (username != null && !"".equals(username)) {
			uflag = true;
		}
		List<FinanceBean> list = null;
		try {
			String sql = "SELECT u.user_name,k.site_name,k.param_json,case k.pay_type  WHEN 1 THEN '支付宝' WHEN 2 THEN '京东' WHEN 3 THEN '微信' ELSE '未知' END pay_type,k.finish_time FROM t_portal_user u LEFT JOIN (SELECT r.param_json,s.id,r.user_id,s.site_name,r.finish_time,r.pay_type FROM t_sitepayment_records r RIGHT JOIN t_cloud_site s ON r.site_id=s.id  where is_finish in(-1,1) and param_json REGEXP '^{') k ON u.id = k.user_id where k.id = ? AND k.pay_type=? ";/*
																																																																																																																				 * LIMIT
																																																																																																																				 * ?
																																																																																																																				 * ,
																																																																																																																				 * ?
																																																																																																																				 * ";
																																																																																																																				 */
			if (uflag && !sflag && !eflag) {// 说明没有时间的条件
				sql += " and u.user_name = ?";
				list = jdbcTemplate.query(sql, new Object[] { siteId, paytype,
						username },
						new BeanPropertyRowMapper(FinanceBean.class));
			}
			if (!uflag && sflag && eflag) {// 说明没有用户的查询条件
				sql += " and k.finish_time > ? and k.finish_time < ?";
				list = jdbcTemplate.query(sql, new Object[] { siteId, paytype,
						startTimes, endTimes }, new BeanPropertyRowMapper(
						FinanceBean.class));
			}
			if (!uflag && !sflag && eflag) {
				sql += " and k.finish_time < ?";
				list = jdbcTemplate.query(sql, new Object[] { siteId, paytype,
						endTimes },
						new BeanPropertyRowMapper(FinanceBean.class));
			}
			if (!uflag && sflag && !eflag) {
				sql += " and k.finish_time > ?";
				list = jdbcTemplate.query(sql, new Object[] { siteId, paytype,
						startTimes }, new BeanPropertyRowMapper(
						FinanceBean.class));
			}
			if (uflag && sflag && eflag) {
				sql += " and k.finish_time > ? and k.finish_time < ? and u.user_name = ?";
				list = jdbcTemplate.query(sql, new Object[] { siteId, paytype,
						startTimes, endTimes, username },
						new BeanPropertyRowMapper(FinanceBean.class));
			}
			if (!uflag && !sflag && !eflag) {
				list = jdbcTemplate.query(sql,
						new Object[] { siteId, paytype },
						new BeanPropertyRowMapper(FinanceBean.class));
			}
		} catch (Exception e) {
			log.error("财务管理查看明细异常", e);
		}
		return list;
	}

	/**
	 * @Description获得宽带使用收益(元)提现次数(次)
	 * @date 2016年10月9日下午5:21:26
	 * @author guoyingjie
	 * @param username
	 * @param sTime
	 * @param endTime
	 */
	public List<Map> getTiCuntAndSiteIncome(String username, String sTime,
			String endTime) {
		List<Map> list = new LinkedList<Map>();
		Map map = new HashMap<>();
		try {
			String sql = "SELECT COUNT(1) count FROM t_user_account_log where user_id =(select id from t_cloud_user where user_name=?) AND create_time BETWEEN ? AND ?";
			int count = jdbcTemplate.queryForInt(sql, new Object[] { username,
					sTime + " 00:00:00", endTime + " 23:59:59" });
			String sqls = "SELECT SUM(transaction_amount) suma FROM t_site_income where site_id in (select id from t_cloud_site where user_id = (select id from t_cloud_user where user_name=?)) AND create_time BETWEEN ? AND ?";
			int suma = jdbcTemplate.queryForInt(sqls, new Object[] { username,
					sTime + " 00:00:00", endTime + " 23:59:59" });
			map.put("count", count);
			map.put("suma", suma);
			list.add(map);
		} catch (Exception e) {
			map.put("count", 0);
			map.put("suma", 0);
			list.add(map);
		}
		return list;
	}

	/**
	 * @Description 获得运营商下新增注册用户
	 * @date 2016年10月11日下午3:46:58
	 * @author guoyingjie
	 * @param userName
	 * @param startTime
	 * @param endTime
	 */
	public int getNewRegter(String username, String startTime, String endTime) {
		int count = 0;
		try {
			String sql = "SELECT COUNT(id) count FROM t_cloud_site_portal where create_time > ?  AND create_time < ? AND site_id in (select id from t_cloud_site where user_id = (select id from t_cloud_user where user_name=?))";
			count = jdbcTemplate.queryForObject(sql, new Object[] {
					startTime + " 00:00:00", endTime + " 23:59:59", username },
					Integer.class);
		} catch (Exception e) {
			log.error(this.getClass().getCanonicalName());
		}
		return count;
	}

	/**
	 * @Description 获得运营商下新增缴费用户
	 * @date 2016年10月11日下午3:46:58
	 * @author guoyingjie
	 * @param userName
	 * @param startTime
	 * @param endTime
	 */
	public int getNewPayUser(String username, String startTime, String endTime) {
		int count = 0;
		try {
			String sql = "SELECT COUNT(DISTINCT portal_user_id) count FROM t_site_income i LEFT JOIN t_cloud_site_portal s ON i.portal_user_id = s.portal_id where s.create_time >?  AND s.create_time < ? AND s.site_id in (select id from t_cloud_site where user_id = (select id from t_cloud_user where user_name=?))";
			count = jdbcTemplate.queryForObject(sql, new Object[] {
					startTime + " 00:00:00", endTime + " 23:59:59", username },
					Integer.class);
		} catch (Exception e) {
			log.error(this.getClass().getCanonicalName());
		}
		return count;
	}

	/**
	 * @Description 获得运营商下 uv
	 * @date 2016年10月11日下午3:46:58
	 * @author guoyingjie
	 * @param userName
	 * @param startTime
	 * @param endTime
	 */
	public int getUserUV(String username, String startTime, String endTime) {
		int count = 0;
		try {
			String sql = "SELECT SUM(uv_num) count FROM t3_business_data where create_time >?  AND create_time <? and site_id in (select id from t_cloud_site where user_id = (select id from t_cloud_user where user_name=?))";
			count = jdbcTemplate.queryForObject(sql, new Object[] {
					startTime + " 00:00:00", endTime + " 23:59:59", username },
					Integer.class);
		} catch (Exception e) {
			log.error(this.getClass().getCanonicalName());
		}
		return count;
	}

	/**
	 * @Description 获得付费转换率
	 * @date 2016年10月11日下午4:10:20
	 * @author guoyingjie
	 * @param userName
	 * @param startTime
	 * @param endTime
	 */
	public String getPayResterBili(String username, String startTime,
			String endTime) {
		String regisers = "";
		int r = this.getNewRegter(username, startTime, endTime);
		int p = this.getNewPayUser(username, startTime, endTime);
		if (r == 0) {
			return 0 + "%";
		}
		if (p == 0 && r != 0) {
			return 0 + "%";
		}
		double d = p * 0.01 / r;
		DecimalFormat df = new DecimalFormat("######0.00");
		regisers = df.format(d * 100 * 100);
		Float regisersYes = Float.valueOf(regisers);
		return Float.valueOf(regisers) + "%";
	}

	/**
	 * @Description 获得用户转换率
	 * @date 2016年10月11日下午4:10:20
	 * @author guoyingjie
	 * @param userName
	 * @param startTime
	 * @param endTime
	 */
	public String getUvBili(String username, String startTime, String endTime) {
		String regisers = "";
		int r = this.getNewRegter(username, startTime, endTime);
		int p = this.getUserUV(username, startTime, endTime);
		if (r == 0) {
			return 0 + "%";
		}
		if (p == 0 && r != 0) {
			return 0 + "%";
		}
		double d = r * 0.01 / p;
		DecimalFormat df = new DecimalFormat("######0.00");
		regisers = df.format(d * 100 * 100);
		Float regisersYes = Float.valueOf(regisers);
		return Float.valueOf(regisers) + "%";
	}

	/**
	 * 根据代理商名字或者手机号返回信息
	 * 
	 * @Description:
	 * @param username
	 *            代理商号码
	 * @param realname
	 *            代理商姓名
	 * @Date 2016年10月27日 下午3:08:27
	 * @Author liuzhao
	 */
	public List<Map<String, Object>> queryByNameOrTel(int currentPage,
			String username, String realname,int pageNum) {
		StringBuffer sql = new StringBuffer("");
		sql.append("SELECT u.user_name,c.site_name,b.bankcar_num,f.real_name,f.telephone FROM t_cloud_site c");
		sql.append(" LEFT JOIN t_cloud_user u ON c.user_id = u.id");
		sql.append(" LEFT JOIN t_user_bank_info b  ON b.user_id = u.id");
		sql.append(" LEFT JOIN t_cloud_userinfo f  on f.user_id = u.id ");
		if (username.equals("") && !"".equals(realname)) {
			sql.append("where f.real_name =").append("'").append(realname).append("'");
		} else if (realname.equals("") && !"".equals(username)){
			sql.append("where u.user_name = ").append(username);
		} else if (username.equals("") && realname.equals("")) {}
		sql.append(" limit ?,?");
		List<Map<String, Object>> list=new ArrayList<Map<String,Object>>();
		try {
			list = jdbcTemplate.queryForList(sql.toString(), ((currentPage-1)*pageNum<=0?1:(currentPage-1)*pageNum), pageNum);
		} catch (Exception e) {
			log.error("查询出错",e);
			return null;
		}
		return list;
		
	}
	/**
	 * @Description: 根据条件获取总条数
	 * @return
	 * @Date		2016年10月31日 上午11:41:36
	 * @Author		liuzhao
	 */
	public int getTotalCount(String username, String realname){
		int total = 0;
        String sql = "SELECT COUNT(*) FROM t_cloud_site c LEFT JOIN t_cloud_user u ON c.user_id = u.id LEFT JOIN t_user_bank_info b  ON b.user_id = u.id LEFT JOIN t_cloud_userinfo f  on f.user_id = u.id";
        if (username.equals("") && !"".equals(realname)) {
        	sql += " where f.real_name = "+ "'"+realname+"'";
	//		sql.append("where f.real_name =").append("'").append(realname).append("'");
		} else if (realname.equals("") && !"".equals(username)){
			sql += "  where u.user_name = "+username;
	//		sql.append("where u.user_name = ").append(username);
		} else if (username.equals("") && realname.equals("")) {}

    	try {
    		total = jdbcTemplate.queryForInt(sql);
		} catch (Exception e) {
			log.error("查询出错",e);
			return 0;
		}
		return total;
		
	}
}
