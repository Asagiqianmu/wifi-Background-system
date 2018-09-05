package com.fxwx.service.impl;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Random;

import javax.annotation.Resource;
import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;
import org.nutz.dao.Cnd;
import org.nutz.dao.Dao;
import org.nutz.dao.QueryResult;
import org.nutz.dao.pager.Pager;
import org.nutz.lang.Lang;
import org.nutz.trans.Atom;
import org.nutz.trans.Trans;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import com.fxwx.bean.UserAccountLogBean;
import com.fxwx.bean.UserRecordsBankBean;
import com.fxwx.bean.UserRecordsBean;
import com.fxwx.bean.WithDrawAccountBean;
import com.fxwx.bean.WithDrawBean;
import com.fxwx.bean.WithdrawDetailBean;
import com.fxwx.entity.CloudSite;
import com.fxwx.entity.CloudUser;
import com.fxwx.entity.IncomeCollect;
import com.fxwx.entity.SiteIncome;
import com.fxwx.entity.UserAccount;
import com.fxwx.entity.UserAccountLog;
import com.fxwx.entity.UserBankInfo;
import com.fxwx.entity.UserWithdrawInfo;
import com.fxwx.entity.UserWithdrawRecords;
import com.fxwx.util.BigDecimalUtil;
import com.fxwx.util.DESUtil;
import com.fxwx.util.ExecuteResult;
import com.fxwx.util.ExportExcel4Java;
import com.fxwx.util.FTPUtil;
import com.fxwx.util.UUIDUtils;
 

/**
 * Copyright (c) All Rights Reserved, 2016.
 * 版权所有                   dfgs Information Technology Co .,Ltd
 * @Project		newCloud
 * @File		WithdrawServiceImpl.java
 * @Date		2016年1月7日 上午8:47:05
 * @Author		gyj
 */
@Service
@SuppressWarnings("all")
public class WithdrawServiceImpl {

 
	private static Logger log = Logger.getLogger(WithdrawServiceImpl.class);
	@Resource(name="jdbcTemplate")
	private JdbcTemplate jdbcTemplate;
	@Resource(name="nutDao")
	private Dao nutDao;
	@Resource
	private SettlementRatioService settlementRatioService;
	/**
	 * @Description  根据用户id获得当前用户的提现金额
	 * @param userId
	 * @return
	 */
	public UserWithdrawInfo getUserWithdrawInfo(int userId){
		UserWithdrawInfo userInfo = null;
		try {
			userInfo = nutDao.fetch(UserWithdrawInfo.class, Cnd.where("user_id","=",userId));
		} catch (Exception e) {
			log.error(this.getClass().getCanonicalName()+"--method--getUserWithdrawInfo",e);
		}
		return userInfo;
	}
	/**
	 * @Description  获得用户下的银行卡信息
	 * @param userId
	 * @return  
	 */
	public UserBankInfo getUserBankInfo(int userId){
		List<UserBankInfo> bankInfo = null;
		try {
			 bankInfo = nutDao.query(UserBankInfo.class,Cnd.where("user_id","=",userId).and("state","=","0").desc("create_time"));
			 if(bankInfo!=null&&bankInfo.size()>0){
				 return bankInfo.get(0);
			 }else{
				 return null;
			 }
		} catch (Exception e) {
			log.error(this.getClass().getCanonicalName()+"--getUserBankInfo",e);
		}
		return null;
	}
	/**
	 * @Description 根据银行卡id获取银行卡信息
	 * @param userId
	 * @return
	 */
	public UserBankInfo getUserBankInfoById(int userId,int cardId){
		UserBankInfo bankInfo = null;
		try {
			 bankInfo = nutDao.fetch(UserBankInfo.class,Cnd.where("user_id","=",userId).and("id","=",cardId).and("state","=","0"));
			
		} catch (Exception e) {
			log.error(this.getClass().getCanonicalName()+"--getUserBankInfoById",e);
		}
		return bankInfo;
	}
	/**
	 * @Description 判断添加的银行卡是否存在
	 * @param bankNum
	 * @return
	 */
	public boolean isHaveBank(String bankNum){
		UserBankInfo ub = nutDao.fetch(UserBankInfo.class,Cnd.where("bankcar_num","=",bankNum.trim()).and("state","=","0"));
		String sql = "select * from t_user_bank_info where bankcar_num=? and state=0";
		List<UserBankInfo> ubs = jdbcTemplate.query(sql, new BeanPropertyRowMapper<UserBankInfo>(UserBankInfo.class),new Object[]{bankNum});
		if(ubs!=null&&ubs.size()>0){
			return false;
		}else{
			return true;
		}
	}
	
	/**
	 * @Description  获得用户下的所有银行卡信息
	 * @param userId
	 * @return
	 */
	public List<UserBankInfo> getUserBankInfos(int userId){
		List<UserBankInfo> bankInfo = null;
		try {
			 bankInfo = nutDao.query(UserBankInfo.class,Cnd.where("user_id","=",userId).and("state","=","0").desc("create_time"));
			 if(bankInfo!=null&&bankInfo.size()>0){
				 return bankInfo;
			 }else{
				 return null;
			 }
		} catch (Exception e) {
			log.error(this.getClass().getCanonicalName()+"--getUserBankInfos",e);
		}
		return null;
	}
	
	/**
	 * @Description  添加用户下的银行信息
	 * @param ub
	 */
	public void insertBankInfo(final UserBankInfo ub){
		try {
	        Trans.exec(new Atom(){
	        	@Override
	            public void run() {
	            	nutDao.insert(ub);
	            }
	        });
        }catch (Exception e) {
           log.error(this.getClass().getCanonicalName()+"--method--insertBankInfo",e);
        }
	}
	/**
	 * @Description  删除银行信息 伪删除 1--代表已删除
	 * @param id
	 */
	public void deleteBankInfo(final int id,final int userId){
		try {
	        Trans.exec(new Atom(){
	        	@Override
	            public void run() {
	            	UserBankInfo ub = nutDao.fetch(UserBankInfo.class,Cnd.where("id","=",id).and("user_id","=",userId));
	            	ub.setState(1);
	            	nutDao.update(ub);
	            }
	        });
        }catch (Exception e) {
           log.error(this.getClass().getCanonicalName()+"--method--deleteBankInfo",e);
        }
	}
	/**
	 * @Description   提现后添加到资金审批流程,保存提现记录
	 * @param uwr
	 * @return
	 */
	public int insertAccountRecord(final UserWithdrawRecords uwr){
		try {
			nutDao.insert(uwr);
			return 1;
		} catch (Exception e) {
			return 0;
		}
	}
	/** 提现成功后更新用户资金
	 * @Description 提现完成时修改用户资金账户表,将可提现的金额-用户提现的金额  冻结金额字段+用户的提现金额
	 * @param userId  
	 * @return
	 */
	public int updateUserWithDarwInfo(UserWithdrawRecords uwr,int userId){
		try {
		    UserWithdrawInfo udf = nutDao.fetch(UserWithdrawInfo.class,Cnd.where("user_id","=",userId));
		    //可提现的余额-用户提现的金额  
			BigDecimal finalAccount = BigDecimalUtil.subtract(udf.getWithdrawMonery(),uwr.getWithdrawMoney());
			udf.setWithdrawMonery(finalAccount);
			//冻结金额+用户的提现金额
			udf.setFrozenMonery(BigDecimalUtil.add(udf.getFrozenMonery(), uwr.getWithdrawMoney()));
			return  nutDao.update(udf);
		} catch (Exception e) {
			return 0;
		}
	}
	/**
	 * @Description  提现后添加到资金审批流程,保存提现记录
	 * * 具体逻辑: 当定时生成上个月的资金情况时.获得本人的上个月的可提现实际资金,在账户可提现字段中加上资金余额,加入他的提现时间
	 * 当进行提现操作时,将提现的额度插入资金冻结字段,在可提现的资金的上减去提现的额度,
	 * 当运营人员没有通过审批的时候在将冻结的金额加人到可提现的余额上,冻结金额清零
	 * @param uwr
	 */
	public void insertAccountRecords(final UserWithdrawRecords uwr,final int userId){
		try {
	        Trans.exec(new Atom(){
	        	@Override
	            public void run() {
	                   
	            		int  i = insertAccountRecord(uwr);
	            		if(i==0){
	            			throw Lang.makeThrow("添加待提现记录表失败--method--insertAccountRecords");
	            		}
		            	i = updateUserWithDarwInfo(uwr,userId);
		            	if(i==0){
		            		throw Lang.makeThrow("更新资金账户信息失败--method--insertAccountRecords");
	              }
	        	}
	        });
        }catch (Exception e) {
           log.error(this.getClass().getCanonicalName()+"--method--insertAccountRecords",e);
        }
	}
	/**
	 * @Description 当运营人员没有通过审批的时候在将冻结的金额-本次失败记录用户提现的金额 ,可提现的余额+本次失败记录用户提现的金额 
	 * @param userId
	 */
    public int failUserAccountDarw(int userId,UserWithdrawRecords uw){
    	try {
    		UserWithdrawInfo udf = null;
    		//UserWithdrawRecords uw = nutDao.fetch(UserWithdrawRecords.class,Cnd.where("user_id","=",userId).and("id","=",recordLogId));
    		if(uw!=null){
    		    udf = nutDao.fetch(UserWithdrawInfo.class,Cnd.where("user_id","=",userId));
    			if(udf!=null){
    				//待提现记录表失败时用户提取现金额
    				BigDecimal recordFail = uw.getWithdrawMoney();
    				
    				//获得用户当前的冻结金额
    				BigDecimal fro = udf.getFrozenMonery();
    				//获得用户的当前的可提现的余额
    				BigDecimal wdm = udf.getWithdrawMonery();
    				//冻结的金额-本次失败记录用户提现的金额
    				udf.setFrozenMonery(BigDecimalUtil.subtract(fro, recordFail));
    				//可提现的余额+本次失败记录用户提现的金额 
    				udf.setWithdrawMonery(BigDecimalUtil.add(recordFail,wdm));
    			}
    		}
    		return nutDao.update(udf);
		} catch (Exception e) {
			return 0;
		}
    }
    /**
     * @Description  获得待提现记录列表封装bean
     * @param list
     * @return
     */
	public List<UserRecordsBean> getUserRecordsBean(List<UserWithdrawRecords> list){
    	List<UserRecordsBean> uList = new LinkedList<>();
    	for (int i = 0; i < list.size(); i++) {
    		UserWithdrawRecords use = list.get(i);
    		UserBankInfo u = nutDao.fetch(UserBankInfo.class,Cnd.where("id","=",use.getUserBankInfoId()));
    		if(u!=null){
    			UserRecordsBean urb = new UserRecordsBean();
    			urb.setId(use.getId());
    			urb.setUserBankInfoId(use.getUserBankInfoId());
    			urb.setNotPassResason(use.getNotPassResason());
    			urb.setCreateTime(use.getCreateTime());
    			urb.setUserId(use.getUserId());
    			urb.setWithdrawMoney(use.getWithdrawMoney());
    			urb.setWithdrawState(use.getWithdrawState());
    			urb.setBankCardNum(u.getBankcarNum());
    			uList.add(urb);
    		}
		}
    	if(uList!=null){
    		return uList;
    	}else{
    		return null;
    	}
    }
    
    /**
     * @Description  获得待提现记录表以及时间查询
     * @param userId
     * @param startTime
     * @param endTime
     */
	public List<UserRecordsBean> getUserAccountLogInfo(int userId,String startTime,String endTime,int curPage,int pageSize){
		List<UserWithdrawRecords> list = null;
		List<UserRecordsBean> ulist = null;
		String beginSelTime=startTime+" 00:00:00";
		String endSelTime=endTime+" 23:59:59";
		try {
			Pager pager = nutDao.createPager(curPage, pageSize);
			if("".equals(startTime)&&!"".equals(endTime)){
				 list = nutDao.query(UserWithdrawRecords.class,
						 Cnd.where("create_time","<",endSelTime).
						 and("withdraw_state","<>", "1").
						 and("user_id","=",userId).desc("create_time"),pager);
			}
			if(!"".equals(startTime)&&"".equals(endTime)){
				list = nutDao.query(UserWithdrawRecords.class,
						Cnd.where("create_time",">",beginSelTime).
						and("withdraw_state","<>", "1").
						and("user_id","=",userId).desc("create_time"),pager);
			}
			if("".equals(startTime)&&"".equals(endTime)){
				list = nutDao.query(UserWithdrawRecords.class,
						Cnd.where("withdraw_state","<>", "1").
						and("user_id","=",userId).desc("create_time"),pager);
			}
			if(!"".equals(startTime)&&!"".equals(endTime)){
				list = nutDao.query(UserWithdrawRecords.class,
						Cnd.where("withdraw_state","<>", "1").
						and("user_id","=",userId).
						and("create_time",">",beginSelTime).
						and("create_time","<",endSelTime).desc("create_time"),pager);
			}
			pager.setRecordCount(nutDao.count(UserWithdrawRecords.class));
			QueryResult qu = new QueryResult(list, pager);
			list = qu.getList(UserWithdrawRecords.class);
			ulist = getUserRecordsBean(list);
		} catch (Exception e) {
			 log.error(this.getClass().getCanonicalName()+"--method--getUserAccountLogInfo",e);
		}
		
		return ulist;
	}
	/**
	 * 获得待提现记录表以及时间查询总页数
	 */
	public int getAllPage(int userId,String startTime,String endTime,int pageSize){
		List<UserWithdrawRecords> list = null;
		String beginSelTime=startTime+" 00:00:00";
		String endSelTime=endTime+" 23:59:59";
		try {
			if("".equals(startTime)&&!"".equals(endTime)){
				 list = nutDao.query(UserWithdrawRecords.class,
						 Cnd.where("create_time","<",endSelTime).
						 and("withdraw_state","<>", "1").
						 and("user_id","=",userId).desc("create_time"));
			}
			if(!"".equals(startTime)&&"".equals(endTime)){
				list = nutDao.query(UserWithdrawRecords.class,
						Cnd.where("create_time",">",endSelTime).
						and("withdraw_state","<>", "1").
						and("user_id","=",userId).desc("create_time"));
			}
			if("".equals(startTime)&&"".equals(endTime)){
				list = nutDao.query(UserWithdrawRecords.class,
						Cnd.where("withdraw_state","<>", "1").
						and("user_id","=",userId).desc("create_time"));
			}
			if(!"".equals(startTime)&&!"".equals(endTime)){
				list = nutDao.query(UserWithdrawRecords.class,
						Cnd.where("withdraw_state","<>", "1").
						and("user_id","=",userId).
						and("create_time",">",beginSelTime).
						and("create_time","<",endSelTime).desc("create_time"));
			}
			if(list==null){
				return 0;
			}
			int totalNum = list.size();
			int totalPageNum=(totalNum%pageSize)>0?(totalNum/pageSize+1):totalNum/pageSize;
			return totalPageNum;
		} catch (Exception e) {
			log.error(this.getClass().getCanonicalName()+"--method--getAllPage",e);
			return 0;
		}
	}
	/**
	 * @Description 审批人员提现成功后生成提现的记录表
	 * @param uwr
	 * @param userId
	 *  @param realMoney  实际收入   BigDecimal yu 添加了提取时剩余的余额
	 * @return  
	 * @throws Exception 
	 */
	public int eviewSuccessPay(int bankId,int userId,BigDecimal realMoney,BigDecimal yu){
		try {
		
			  UserAccountLog uw = new UserAccountLog();
			  uw.setUserId(userId);
			  //用户id
			//  uw.setBankInfoId(bankId);
			  //结算时间
			  uw.setCreateTime(new Date());
			  //流水账号 
			  String flowCode = DESUtil.encrypt(""+userId+new Date().getTime(),DESUtil.key,"UTF-8");
			  uw.setFlowCode(flowCode);
			  //资金动向
			  uw.setAccountFrom("提现");
			  //实际收入
			  uw.setAccountIncome(realMoney);
			  //余额
			  BigDecimal balance = yu;
			  uw.setAccountBalanceAfter(balance);
			  
			  //交易类型
			  uw.setAccountBusinessType(1);
			 
			  nutDao.insert(uw);
			  return 1;
		} catch (Exception e) {
		  return 0;
		}
	}
	
	/**
	 * @Description  
	 * @param accountLogId 审批记录id
	 * @param failResason 失败原因
	 * @param userId 用户id
	 * @param 传入state=1--代表已打款   state=2 --代表审核未通过
	 */
	public void updateRecordResasonAndState(final int accountLogId,final String failResason,final int userId,final int state){
		try {
			Trans.exec(new Atom() {
				@Override
				public void run() {
					UserWithdrawRecords userWithdrawRecords = nutDao.fetch(
							UserWithdrawRecords.class,
							Cnd.where("id", "=", accountLogId).and("user_id",
									"=", userId));
					if(userWithdrawRecords!=null){
					if (state == 1) {
						// 审批通过 记录资金动向日志
						int su = eviewSuccessPay(
								userWithdrawRecords.getUserBankInfoId(),
								userId, userWithdrawRecords.getWithdrawMoney(),
								//添加了余额
								userWithdrawRecords.getAccountBalanceAfter()
								);
						if (su != 1) {
							throw Lang
									.makeThrow("添加提现日志表失败--method--updateRecordResasonAndState");
						}
						userWithdrawRecords.setWithdrawState(1);
						userWithdrawRecords.setCreateTime(new Date());
						// 审批通过更改状态码为1--已打款
						int j = nutDao.update(userWithdrawRecords);
						if (j != 1) {
							throw Lang
									.makeThrow("更新待提现状态失败--method--updateRecordResasonAndState");
						}
						 UserWithdrawInfo info = getUserWithdrawInfo(userId);
						 if(info!=null){
							 info.setFrozenMonery(BigDecimalUtil.subtract(info.getFrozenMonery(),userWithdrawRecords.getWithdrawMoney()));
							 int k = nutDao.update(info);
							 if(k!=1){
								 throw Lang.makeThrow("更新资金表失败--method--updateRecordResasonAndState");
							 }
						 }
					} else {
						int i = failUserAccountDarw(userId, userWithdrawRecords);
						if (i != 1) {
							throw Lang
									.makeThrow("更新资金账户信息失败--method--updateRecordResasonAndState");
						}
						userWithdrawRecords.setNotPassResason(failResason);
						userWithdrawRecords.setWithdrawState(2);
						userWithdrawRecords.setCreateTime(new Date());
						int j = nutDao.update(userWithdrawRecords);
						if (j != 1) {
							throw Lang
									.makeThrow("更新待提现记录失败原因错误--method--updateRecordResasonAndState");
						}
					 }
				   }
				}
			});
		} catch (Exception e) {
			log.error(this.getClass().getCanonicalName()
					+ "--method--updateRecordResasonAndState", e);
		}
	}
	/**
	 * @Description  获得场所下上个月平台总收入
	 * @param siteId
	 */
	public List<Map<String,Object>> getPlatformIncome(String siteId){
		List<Map<String, Object>> list = null;
		try {
//			String sql = "SELECT SUM(transaction_amount) sumincome FROM t_site_income WHERE site_id =? and portal_user_name not REGEXP '^0' and "
//					+ "create_time  BETWEEN  (SELECT DATE_FORMAT(DATE_ADD(NOW(),interval -1 month),'%y-%m-1 00:00:00')) AND (SELECT DATE_FORMAT(DATE_ADD(NOW(),interval -1 month),'%y-%m-31 23:59:59'))";
			String sql ="SELECT SUM(transaction_amount) sumincome from t_site_income WHERE site_id = ?  and portal_user_name not REGEXP '^0' AND create_time BETWEEN   (SELECT DATE_FORMAT(date_add(NOW(),interval -1 month),'%Y-%m-01 00:00:00'))  and "
					+ "(select date_sub(date_sub(date_format(now(),'%y-%m-%d 23:59:59'),interval extract(day from now()) day),interval 0 month))";
			list = jdbcTemplate.queryForList(sql, new Object[] { siteId });
			if (!list.isEmpty() && list.get(0).get("sumincome") != null && !"".equals(list.get(0).get("sumincome"))) {
				return list;
			} else {
				return null;
			}
		} catch (Exception e) {
			log.error(this.getClass().getCanonicalName()
					+ "--method--getPlatformIncome", e);
			return null;
		}
	}
	/**
	 * @Description  获得场所下上个月线下总收入
	 * @param siteId
	 */
	public List<Map<String,Object>> getOfflineiIncome(String siteId){
		List<Map<String,Object>> list = null;
		try {
//			String sql = "SELECT SUM(transaction_amount) sumincome FROM t_site_income WHERE site_id =? and"
//					   + " portal_user_name  REGEXP '^0' and create_time  BETWEEN  (SELECT DATE_FORMAT(DATE_ADD(NOW(),interval -1 month),"
//					   + "'%y-%m-1 00:00:00')) AND (SELECT DATE_FORMAT(DATE_ADD(NOW(),interval -1 month),'%y-%m-31 23:59:59'))";
			String sql = "SELECT SUM(transaction_amount) sumincome from t_site_income WHERE site_id = ?  and portal_user_name  REGEXP '^0' AND create_time BETWEEN   (SELECT DATE_FORMAT(date_add(NOW(),interval -1 month),'%Y-%m-01 00:00:00'))  and "
			+ "(select date_sub(date_sub(date_format(now(),'%y-%m-%d 23:59:59'),interval extract(day from now()) day),interval 0 month))";
			list = jdbcTemplate.queryForList(sql, new Object[]{siteId});
			if(!list.isEmpty()&&list.get(0).get("sumincome")!=null&&!"".equals(list.get(0).get("sumincome"))){
				return list;
			}else{
				return null;
			}
		} catch (Exception e) {
		    log.error(this.getClass().getCanonicalName()+"--method--getOfflineiIncome",e);
		    return null;
		}
	}
	/**
	 * @Description  获得用户实际总收入
	 * @param siteId
	 */
	public BigDecimal getAccountIncome(String siteId){
		BigDecimal accountIncome = new BigDecimal(0.0000);
		try {
			List<Map<String, Object>> platform = getPlatformIncome(siteId);
			List<Map<String, Object>> offline = getOfflineiIncome(siteId);
			//平台总收入
			BigDecimal platforms = null;
			//线下总收入
			BigDecimal offlines = null;
			if(platform!=null){
				platforms = new BigDecimal(String.valueOf(platform.get(0).get("sumincome")));
			}else{
				platforms = new BigDecimal(0.0000);
			}
			if(offline!=null){
				offlines = new BigDecimal(String.valueOf(offline.get(0).get("sumincome")));
			}else{
				offlines = new BigDecimal(0.0000);
			}
			//实际总收入
			return accountIncome = BigDecimalUtil.subtract(platforms,BigDecimalUtil.multiply(BigDecimalUtil.add(platforms,offlines),0.05));
		} catch (Exception e) {
			log.error(this.getClass().getCanonicalName()+"--Method--getAccountIncome",e);
			return accountIncome;
		}
	}
	/**
	 * @Description  获得用户下可提现余额
	 * @param userId
	 * @return
	 */
	public BigDecimal getBalancesMoney(int userId){
		try {
			UserWithdrawInfo uwf = nutDao.fetch(UserWithdrawInfo.class,Cnd.where("user_id","=",userId));
			if(uwf!=null){
				return uwf.getWithdrawMonery();
			}else{
				return new BigDecimal(0.0000);
			}
		} catch (Exception e) {
			log.error(this.getClass().getCanonicalName()+"--method--getBalancesMoney",e);
			return new BigDecimal(0.0000);
		}
	}
	/**
	 * @Description  获得场所的平台总收入详细
	 * @param siteId
	 * @return
	 */
	public List<SiteIncome> getSiteIncomeInfo(String siteId){
		String sql ="SELECT * from t_site_income WHERE site_id = ?  and portal_user_name not REGEXP '^0' AND create_time BETWEEN   (SELECT DATE_FORMAT(date_add(NOW(),interval -1 month),'%Y-%m-01 00:00:00'))  and "
				+ "(select date_sub(date_sub(date_format(now(),'%y-%m-%d 23:59:59'),interval extract(day from now()) day),interval 0 month))";
		//String sql = "SELECT * from t_site_income WHERE site_id = ?  and portal_user_name not REGEXP '^0'";
		List<SiteIncome> list = null;
		try {
			list = jdbcTemplate.query(sql,new Object[]{siteId},new BeanPropertyRowMapper<SiteIncome>(SiteIncome.class));
			if(list!=null&&list.size()>0){
				return list;
			}else{
				return null;
			}
		} catch (Exception e) {
			log.error(this.getClass().getCanonicalName()+"--method--getSiteIncome",e);
			return null;
		}
	}
	
	/**
	 * @Description  获得场所的线下总收入详细
	 * @param siteId
	 * @return
	 */
	public List<SiteIncome> getSiteIncomeOffLine(String siteId){
		String sql = "SELECT * from t_site_income WHERE site_id = ?  and portal_user_name  REGEXP '^0' AND create_time BETWEEN   (SELECT DATE_FORMAT(date_add(NOW(),interval -1 month),'%Y-%m-01 00:00:00'))  and "
				+ "(select date_sub(date_sub(date_format(now(),'%y-%m-%d 23:59:59'),interval extract(day from now()) day),interval 0 month))";
		//String sql = "SELECT * from t_site_income WHERE site_id = ?  and portal_user_name  REGEXP '^0'";
		List<SiteIncome> list = null;
		try {
			list = jdbcTemplate.query(sql,new Object[]{siteId},new BeanPropertyRowMapper<SiteIncome>(SiteIncome.class));
			if(list!=null&&list.size()>0){
				return list;
			}else{
				return null;
			}
		} catch (Exception e) {
			log.error(this.getClass().getCanonicalName()+"--method--getSiteIncome",e);
			return null;
		}
	}
	
	/**
	 * @Description  获得流水账号
	 * @param siteId
	 * @param userId  siteId+userId+Date().getTime
	 * @return 1--返回不加密的字符串   否则为加密的字符串
	 * @throws Exception 
	 */
	public String getFlowAccount(String siteId,int userId,int state){
		long flow = new Date().getTime();
		String userCode = "";
		String siteCode = "";
		if(userId<10){
			userCode="0"+userId;
		}else{
			userCode= String.valueOf(userId);
		}
		if(Integer.parseInt(siteId)<10){
			siteCode= "0"+siteId;
		}else{
			siteCode = siteId;
		}
		String flownum = siteCode+userCode+new Date().getTime();
		if(state==1){
			return flownum;
		}else{
			try {
				String flownums = DESUtil.encrypt(flownum,DESUtil.key,"UTF-8");
				return flownums;
			} catch (Exception e) {
				log.error(this.getClass().getCanonicalName()+"--method--getFlowAccount",e);
				return null;
			}
		}
		
	}
	/**
	 * @Description  更改账户资金结算时间,更改提现余额 ,如果用户下的账户资金没有记录的话则新添加记录,否则直接在当前的用户下更新
	 * @param userId
	 * @param date
	 *  @param balance 余额
	 * @return
	 */
	public int updateUserWithdrawInfo(int userId,Date date,BigDecimal balance){
		 try {
			UserWithdrawInfo uf = nutDao.fetch(UserWithdrawInfo.class,Cnd.where("user_id","=",userId));
			System.out.println("uf====="+uf+"---------------userId="+userId);
			if (uf != null) {
				uf.setSettlementTime(date);
				uf.setWithdrawMonery(balance);
				nutDao.update(uf);
			} else {
				uf = new UserWithdrawInfo();
				uf.setUserId(userId);
				uf.setWithdrawMonery(balance);
				uf.setFrozenMonery(new BigDecimal(0.0000));
				uf.setSettlementTime(date);
				uf.setCreateTime(new Date());
				nutDao.insert(uf);
			}
			return 1;
		} catch (Exception e) {
			return 0;
		}
			
	}
	/**
	 * @Description  导出excel并且上传到ftp
	 * @param siteId
	 * @param filename 上传到FTP的文件名
	 */
	public void exportExcel(String siteId,String url,String filename) {
		 ExportExcel4Java exBean = new ExportExcel4Java();
		 List<List<Object>> list = new LinkedList<>();
		 //平台总收入
		 List listContent = getSiteIncomeInfo(siteId);
		 //线下总收入
		 List offLine = getSiteIncomeOffLine(siteId);
		 if(listContent!=null&&listContent.size()>0){
			 list.add(listContent);
		 }
		 if(offLine!=null&&offLine.size()>0){
			 list.add(offLine);
		 }
		 String[] Title = {"编号","交易金额","场所编号","充值用户编号","用户名","用户购买数量","收费类型","创建时间"};
		 try {
			 if(list!=null&&list.size()>0){
				 exBean.exportExcel(url, list, Title, null);
				 FTPUtil.getInstance().uploadFile(filename,url);
			 }
		} catch (Exception e) {
			 log.error("导出excel失败");
		}
	}
	
	    /**
		 * @Description 生成上个月的平台线下收入明细excel表格
		 */
		public void exportExcelJob(){
			Trans.exec(new Atom() {
				@Override
				public void run() {
					String sql = "SELECT user_id FROM t_cloud_site GROUP BY user_id";
					// 定时获得用户下的用户id
					List<Map<String, Object>> ids = jdbcTemplate.queryForList(sql);
					if (ids.size() > 0 && ids != null) {
						for (int i = 0; i < ids.size(); i++) {
							// 用户id
							final int userId = Integer.valueOf(ids.get(i).get("user_id")+ "");
							// 获得用户下的所有归属场所的id
							String sqls = "SELECT id FROM t_cloud_site WHERE user_id=?";
							List<Map<String, Object>> siteIds = jdbcTemplate.queryForList(sqls, new Object[] { userId });
							if (siteIds.size() > 0 && siteIds != null) {
								for (int j = 0; j < siteIds.size(); j++) {
									// 场所id
									final String siteId = String.valueOf(siteIds.get(j).get("id"));
									String filename = getAccountFrom(siteId)+".xls";
									//获得项目所在路径
									String url = System.getProperty("user.dir")+"\\"+filename; 
									exportExcel(siteId, url, filename);
								}
							}// 循环场所id end
						}// 循环用户id end
					}
				}
			});
		}
		
	/**	
	 * @Description  定时生成上个月的收入明细excel表格
	 */
	 public void exportsJob(){
		try {
			for (int i = 0; true; i++) {
				try {
					exportExcelJob();
				} catch (Exception ex) {
					if (i <= 1) {
						Thread.sleep(2000);
						continue;
					} else {
						throw Lang.makeThrow("定时生成上个月的收入明细excel异常",ex);
					}
				}
				break;
			}
		} catch (Exception e) {
			log.error(this.getClass().getCanonicalName() + "定时生成上个月的收入明细excel异常",e);
		}
	 }
		/**
		 * @Description  生成定时生成的提现日志记录
		 * @param userId  用户id
		 * @param siteId  场所id
		 * @param date 结算时间
		 * @param balance 实际总收入
		 * @param income  余额
		 * @return
		 */
		 public int insertUserAccountLog(int userId,String siteId,Date date, BigDecimal balance,BigDecimal income){
			 try {
				  UserAccountLog uw = new UserAccountLog();
				  uw.setUserId(userId);
				  uw.setCreateTime(date); //结算时间
				  String flowCode = getFlowAccount(siteId,userId,2);  //流水账号
				  uw.setFlowCode(flowCode);
				  String flowing = getAccountFrom(siteId);//资金动向
				  uw.setAccountFrom(flowing);
				  uw.setAccountIncome(income); //实际收入
				  List<Map<String,Object>> list = getPlatformIncome(siteId); //平台代收
				  BigDecimal platform = new BigDecimal(0.0000);
				  if(list!=null){
					  platform = new BigDecimal(String.valueOf(list.get(0).get("sumincome")));
				  } 
				  uw.setAccountPlatformIncome(platform);
				  BigDecimal offline = new BigDecimal(0.0000);
				  List<Map<String, Object>> offlines = getOfflineiIncome(siteId);  //线下收入
				  if(offlines!=null){
					  offline = new BigDecimal(String.valueOf(offlines.get(0).get("sumincome")));
				  }
				  uw.setAccountOfflineIncome(offline); //余额
				  uw.setAccountBalanceAfter(balance);
				  //交易类型是默认值 不需要添加
				  String filename = getAccountFrom(siteId)+".xls"; //下载路径文件名
				  //获得项目所在路径
				  //String url = System.getProperty("user.dir")+"\\"+filename;
				  uw.setDetailedUrl(filename);
				  nutDao.insert(uw);
				  //exportExcel(siteId,url,filename);
				  return 1;
			} catch (Exception e) {
			      return 0;
			}
		 }
		  

	/**
	 * @Description  定时结算上个月的可提现的金额
	 */
	public void timingJob(){
		Trans.exec(new Atom() {
			@Override
			public void run() {
				String sql = "SELECT user_id FROM t_cloud_site GROUP BY user_id";
				// 定时获得用户下的用户id
				List<Map<String, Object>> ids = jdbcTemplate.queryForList(sql);
				System.out.println("定时获得用户下的用户id==="+ids);
				if (ids.size() > 0 && ids != null) {
					for (int i = 0; i < ids.size(); i++) {
						// 用户id
						final int userId = Integer.valueOf(ids.get(i).get("user_id")+ "");
						// 获得用户下的所有归属场所的id
						String sqls = "SELECT id FROM t_cloud_site WHERE user_id=?";
						List<Map<String, Object>> siteIds = jdbcTemplate
								.queryForList(sqls, new Object[] { userId });
						System.out.println("定时获得用户下的用户siteIds==="+siteIds);
						
						if (siteIds.size() > 0 && siteIds != null) {
							for (int j = 0; j < siteIds.size(); j++) {
								final String siteId = String.valueOf(siteIds.get(j).get("id"));
								Date date = new Date();
								BigDecimal income = getAccountIncome(siteId);
								BigDecimal big = getBalancesMoney(userId);
								BigDecimal balance = BigDecimalUtil.add(big,income);
								int isOk = insertUserAccountLog(userId, siteId,date, balance, income);
								if (isOk == 0) {
									throw Lang.makeThrow("添加资金账户流动记录失败--method--timingJob");
								}
								int is = updateUserWithdrawInfo(userId, date,balance);
								if (is == 0) {
									throw Lang.makeThrow("更新账户资金变动失败--method--timingJob");
								}
							}
						}// 循环场所id end
					}// 循环用户id end
				}
			}
		});
	}
	/**
	 * @throws InterruptedException 
	 * @Description 定时结算方法
	 */
	public void timerOk() throws InterruptedException{
		try {
			timingJob();
			System.out.println("chengong");
		} catch (Exception e) {
			System.out.println("shibai");
			log.error(this.getClass().getCanonicalName() + "--method--timerOk",e);
		}
	}
	
	/**
	 * @Description 取得资金动向
	 * @param siteId  场所id
	 * @return
	 */
	public String getAccountFrom(String siteId){
		CloudSite site = nutDao.fetch(CloudSite.class, Cnd.where("id","=",siteId));
		Calendar cla = Calendar.getInstance();
		cla.add(Calendar.MONTH,-1);
		String sim = new SimpleDateFormat("yyyy-MM").format(cla.getTime());
		if(site!=null){
			return site.getSite_name()+sim.split("-")[0]+"年"+sim.split("-")[1]+"月收入";
		}
		return null;
	}
	 
 
	/**
	 * 
	 * @Description  获取用户提现的记录日志
	 * @param id	用户id
	 * @param startTime  开始查询时间
	 * @param endTime	结束查询时间	
	 * @param pageSize	页数
	 * @param curPage	当前页
	 * @return
	 * @throws Exception 
	 */
	public List<UserAccountLogBean> getUserAccountLog(int id,String startTime,String endTime,int pageSize,int curPage ) throws Exception{
		SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		List<UserAccountLog> ls=null;
		List<UserAccountLogBean> AccountList=new ArrayList<UserAccountLogBean>();
		String beginSelTime=startTime+" 00:00:00";
		String endSelTime=endTime+" 23:59:59";
		int totalNum=getUserAccountLogPage(id,startTime,endTime,pageSize);
		if(curPage>totalNum){
			curPage=totalNum;
		}
		if(curPage<=0){
			curPage=1;
		}
		Pager pager = nutDao.createPager(curPage, pageSize);
		if("".equals(startTime)&&!"".equals(endTime)){
			ls=nutDao.query(UserAccountLog.class, Cnd.where("user_id","=",id).and("create_time","<",endSelTime).desc("create_time"),pager);
		}
		if("".equals(endTime)&&!"".equals(startTime)){
			ls=nutDao.query(UserAccountLog.class, Cnd.where("user_id","=",id).and("create_time",">",beginSelTime).desc("create_time"),pager);
		}
		if("".equals(startTime)&&"".equals(endTime)){
			ls=nutDao.query(UserAccountLog.class, Cnd.where("user_id","=",id).desc("create_time"),pager);
		}
		if(!"".equals(startTime)&&!"".equals(endTime)){
			ls=nutDao.query(UserAccountLog.class, Cnd.where("user_id","=",id).and("create_time",">",beginSelTime).and("create_time","<",endSelTime).desc("create_time"),pager);
		}
		if(ls.size()==0){
			return AccountList;
		}else{
			for (int i = 0; i < ls.size(); i++) {//遍历查询的提现记录日志并赋值给bean
				UserAccountLogBean userAccountLogBean=new UserAccountLogBean();
				userAccountLogBean.setAccountBalanceAfter(ls.get(i).getAccountBalanceAfter());
				userAccountLogBean.setAccountBusinessType(ls.get(i).getAccountBusinessType());
				userAccountLogBean.setAccountFrom(ls.get(i).getAccountFrom());
				userAccountLogBean.setAccountIncome(ls.get(i).getAccountIncome());
				userAccountLogBean.setAccountOfflineIncome(ls.get(i).getAccountOfflineIncome());
				userAccountLogBean.setAccountPlatformIncome(ls.get(i).getAccountPlatformIncome());
				userAccountLogBean.setCreateTime(sdf.format(ls.get(i).getCreateTime()));
				userAccountLogBean.setDetailedUrl(ls.get(i).getDetailedUrl());
				//查出流水账号,解密成明文
				userAccountLogBean.setFlowCode(DESUtil.decrypt(ls.get(i).getFlowCode(), DESUtil.key, "UTF-8"));
				if(ls.get(i).getAccountBusinessType()==1){//判断状态是否为支出状态,1代表支出,状态为1时查询银行卡信息表,查到银行卡账号
					UserBankInfo ubf=nutDao.fetch(UserBankInfo.class, Cnd.where("id","=",ls.get(i).getBankInfoId()));
					if(ubf!=null){
						userAccountLogBean.setBankInfo(ubf.getBankcarNum());
					}
				}
				
				AccountList.add(userAccountLogBean);
			}
		}
		
		return AccountList;
	}
	/**
	 * 
	 * @Description  查询用户提现记录日志总页数
	 * @param id	用户id
	 * @param startTime  开始查询时间
	 * @param endTime  结束查询时间
	 * @param pageSize 页数大小
	 * @return
	 */
	public int getUserAccountLogPage(int id,String startTime,String endTime,int pageSize){
		List<UserAccountLog> ls=null;
		int totalPageNum;
		String beginSelTime=startTime+" 00:00:00";
		String endSelTime=endTime+" 23:59:59";
		if("".equals(startTime)&&!"".equals(endTime)){
			ls=nutDao.query(UserAccountLog.class, Cnd.where("user_id","=",id).and("create_time","<",endSelTime).desc("create_time"));
		}
		if("".equals(endTime)&&!"".equals(startTime)){
			ls=nutDao.query(UserAccountLog.class, Cnd.where("user_id","=",id).and("create_time",">",beginSelTime).desc("create_time"));
		}
		if("".equals(startTime)&&"".equals(endTime)){
			ls=nutDao.query(UserAccountLog.class, Cnd.where("user_id","=",id).desc("create_time"));
		}
		if(!"".equals(startTime)&&!"".equals(endTime)){
			ls=nutDao.query(UserAccountLog.class, Cnd.where("user_id","=",id).and("create_time",">",beginSelTime).and("create_time","<",endSelTime).desc("create_time"));
		}
		if(ls.size()==0){
			totalPageNum=0;
		}else{
			int totalNum=ls.size();
			totalPageNum=totalNum%pageSize==0?totalNum/pageSize:(totalNum/pageSize+1);
		}
		return totalPageNum;
	} 

	/**
	 * @Description  后台用户列表
	 * @return
	 */
	public QueryResult getCloudUserList(int curPage,int pageSize,String name){
		List<Integer> ids = new ArrayList();
		String idArr = "";
		List<UserWithdrawRecords> lists = nutDao.query(UserWithdrawRecords.class, Cnd.where("withdraw_state","=","0").groupBy("user_id"));
		if(lists.size()>0&&lists!=null){
			for (int i = 0; i < lists.size(); i++) {
				ids.add(lists.get(i).getUserId());
			}
			idArr = ids.toString().replace("[","").replace("]","");
		}
		if(name==null||"".equals(name)){
			name = "%%";
		}else{
			name = "%"+name+"%";
		}
		Pager pager = nutDao.createPager(curPage, pageSize);
		if(!"".equals(idArr)){
			List<CloudUser> list = nutDao.query(CloudUser.class,Cnd.where("is_stoped","=","0").and("user_name", "like",name).and("id","in",idArr),pager);
			pager.setRecordCount(nutDao.count(CloudUser.class));
			QueryResult qu = new QueryResult(list, pager);
			if(qu!=null){
				return qu;
			}else{
				return null;
			}
		}else{
			return null;
		}
	}
	 /**
     * @Description  获得待提现记录表以及时间查询
     * @param userId
     * @param startTime
     * @param endTime
     */
	public QueryResult getUserAccountLogInfos(int userId,String startTime,String endTime,int curPage,int pageSize){
		List<UserWithdrawRecords> list = null;
		List<UserRecordsBankBean> ulist = null;
		QueryResult qu = null;
		String beginSelTime=startTime+" 00:00:00";
		String endSelTime=endTime+" 23:59:59";
		try {
			Pager pager = nutDao.createPager(curPage, pageSize);
			if("".equals(startTime)&&!"".equals(endTime)){
				 list = nutDao.query(UserWithdrawRecords.class,
						 Cnd.where("create_time","<",endSelTime).
						 and("withdraw_state","<>", "1").
						 and("user_id","=",userId).desc("create_time"),pager);
			}
			if(!"".equals(startTime)&&"".equals(endTime)){
				list = nutDao.query(UserWithdrawRecords.class,
						Cnd.where("create_time",">",beginSelTime).
						and("withdraw_state","<>", "1").
						and("user_id","=",userId).desc("create_time"),pager);
			}
			if("".equals(startTime)&&"".equals(endTime)){
				list = nutDao.query(UserWithdrawRecords.class,
						Cnd.where("withdraw_state","<>", "1").
						and("user_id","=",userId).desc("create_time"),pager);
			}
			if(!"".equals(startTime)&&!"".equals(endTime)){
				list = nutDao.query(UserWithdrawRecords.class,
						Cnd.where("withdraw_state","<>", "1").
						and("user_id","=",userId).
						and("create_time",">",beginSelTime).
						and("create_time","<",endSelTime).desc("create_time"),pager);
			}
			pager.setRecordCount(nutDao.count(UserWithdrawRecords.class));
			qu = new QueryResult(list, pager);
			list = qu.getList(UserWithdrawRecords.class);
			ulist = getUserRecordsBankBean(list);
			qu.setList(ulist);
		} catch (Exception e) {
			 log.error(this.getClass().getCanonicalName()+"--method--getUserAccountLogInfo",e);
		}
		
		return qu;
	}
	
	  /**
     * @Description  获得待提现记录列表封装bean
     * @param list
     * @return
     */
	public List<UserRecordsBankBean> getUserRecordsBankBean(List<UserWithdrawRecords> list){
    	List<UserRecordsBankBean> uList = new LinkedList<>();
    	for (int i = 0; i < list.size(); i++) {
    		UserWithdrawRecords use = list.get(i);
    		UserBankInfo u = nutDao.fetch(UserBankInfo.class,Cnd.where("id","=",use.getUserBankInfoId()));
    		if(u!=null){
    			UserRecordsBankBean urb = new UserRecordsBankBean();
    			urb.setId(use.getId());
    			urb.setUserBankInfoId(use.getUserBankInfoId());
    			urb.setNotPassResason(use.getNotPassResason());
    			urb.setCreateTime(use.getCreateTime());
    			urb.setUserId(use.getUserId());
    			urb.setWithdrawMoney(use.getWithdrawMoney());
    			urb.setWithdrawState(use.getWithdrawState());
    			urb.setBankCardNum(u.getBankcarNum());
    			urb.setAccountName(u.getAccountName());
    			urb.setBankDeposit(u.getBankDeposit());
    			urb.setBranchName(u.getBranchName());
    			uList.add(urb);
    		}
		}
    	if(uList!=null){
    		return uList;
    	}else{
    		return null;
    	}
    }
	/******************新的提现规则**************************/
	
	/**
	 * 
	 * @Description:查看用户是否可以提现	
	 * @author songyanbiao
	 * @date 2016年7月21日 下午4:40:17
	 * @param
	 * @return
	 */
	public ExecuteResult canWithdraw(int userId,HttpSession session){
		ExecuteResult er = new ExecuteResult();
		WithDrawBean wdb=new WithDrawBean();
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");  
		try {
			IncomeCollect col=nutDao.fetch(IncomeCollect.class, Cnd.where("user_id","=",userId));
			Date selTime=new Date();
			if(col==null){
				er.setCode(201);
				wdb.setWithDrawMoney(new BigDecimal("0"));
				wdb.setWithDrawTime(sdf.format(selTime));
			}else{
				
				Calendar ca=Calendar.getInstance();
				ca.add(Calendar.DATE, -col.getShortestCycle());
				long nowTime= ca.getTime().getTime();
				BigDecimal subOfflineIncome = col.getOfflineIncome().setScale(2, BigDecimal.ROUND_DOWN);
				BigDecimal subPlatformIncome = col.getPlatformIncome().setScale(2, BigDecimal.ROUND_DOWN);
				BigDecimal accountRefund=col.getAccountRefund()==null?new BigDecimal("0"):col.getAccountRefund();
				accountRefund=accountRefund.setScale(2, BigDecimal.ROUND_DOWN);
				if(col.getWithdrawTime()<nowTime&&col.getPlatformIncome().compareTo(col.getLowestMoney())>-1){
					er.setCode(200);
					col.setAccountRefund(accountRefund);
					col.setOfflineIncome(subOfflineIncome);
					col.setPlatformIncome(subPlatformIncome);
					session.setAttribute("col", col);//尽可能减小提现时有人充值造成的误差
					session.setAttribute("withDrawTime", selTime.getTime());//减小对账时收入明细的误差
				}else{
					er.setCode(201);
				}
				wdb.setWithDrawMoney(subPlatformIncome);
				wdb.setWithDrawTime(sdf.format(col.getWithdrawTime()));
			}
			
			er.setData(wdb);
		} catch (Exception e) {
			e.printStackTrace();
			log.error("查询用户是否可以提现出错",e);
		}
		
		return er;
	}
	
	/**
	 * 
	 * @Description:用户点击提现	
	 * @author songyanbiao
	 * @date 2016年7月21日 下午2:39:17
	 * @param
	 * @return
	 */
	public boolean getUserWithdraw(final int userId,final BigDecimal withdrawMoney,final Map<String,Object> map,final String bankNum,final long withDrawTime ){
		try {
			
			Trans.exec(new Atom() {
				@Override
				public void run() {
					UserAccount uact=nutDao.fetch(UserAccount.class, Cnd.where("user_id","=",userId));
					
					IncomeCollect incol=(IncomeCollect) map.get("col");
					//如果总收入超过最低提现金额并且体现是周期大于规定的周期，则允许用户提现，否则不能提现
					BigDecimal allMoney=BigDecimalUtil.add(withdrawMoney,incol.getOfflineIncome());
					UserAccountLog ua=new UserAccountLog();
					ua.setAccountIncome(allMoney);
					ua.setAccountPlatformIncome(withdrawMoney);
					ua.setAccountOfflineIncome(incol.getOfflineIncome());
					if(uact!=null){
						ua.setAccountBalanceAfter(BigDecimalUtil.add(BigDecimalUtil.subtract(withdrawMoney, BigDecimalUtil.add(BigDecimalUtil.multiply(incol.getChargeRate(), allMoney), incol.getAccountRefund()==null?new BigDecimal("0"):incol.getAccountRefund())),uact.getWithdrawMonery()));
					}else{
						//用户实际可提现金额为线上收入减去总收入乘以手续费
						ua.setAccountBalanceAfter(BigDecimalUtil.subtract(withdrawMoney, BigDecimalUtil.add(BigDecimalUtil.multiply(incol.getChargeRate(), allMoney), incol.getAccountRefund()==null?new BigDecimal("0"):incol.getAccountRefund())));
					}
					ua.setAccountPoundage(incol.getChargeRate());
					ua.setAccountStatus("801");
					ua.setAccountRefund(incol.getAccountRefund()==null?new BigDecimal("0"):incol.getAccountRefund());
					ua.setCreateTime(new Date());
					ua.setBankInfoId(bankNum);
					ua.setStartTime(incol.getWithdrawTime());
					ua.setEndTime(withDrawTime);
					ua.setAccountId(settlementRatioService.getRandomUUID());
					ua.setUserId(userId);
					int i=nutDao.insert(ua).getId();
					if(i<1)
						throw Lang.makeThrow("添加提现日志表失败--method--getUserWithdraw");
					
					String sql="UPDATE t4_income_collect SET platform_income=platform_income-?,offline_income=offline_income-?,withdraw_time=? WHERE user_id= ?";
					i=jdbcTemplate.update(sql,new Object[]{withdrawMoney,incol.getOfflineIncome(),withDrawTime,userId});
					
//					IncomeCollect col=nutDao.fetch(IncomeCollect.class, Cnd.where("user_id","=",userId));
//					col.setOfflineIncome(BigDecimalUtil.subtract(col.getOfflineIncome(),incol.getOfflineIncome()));
//					col.setPlatformIncome(BigDecimalUtil.subtract(col.getPlatformIncome(),withdrawMoney));
//					col.setWithdrawTime(withDrawTime);
//					i=nutDao.update(col);
					if(i<1)
						throw Lang.makeThrow("修改商户汇总表失败--method--getUserWithdraw");
					if(uact!=null){
						uact.setWithdrawMonery(new BigDecimal("0"));
						i=nutDao.update(uact);
						if(i<1)
							throw Lang.makeThrow("修改商户提现表失败--method--getUserWithdraw");
					}	
				}
			});
			
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
		
		return true;
	}
	
	/**
	 * 
	 * @Description:获取用户全部提现信息	
	 * @author songyanbiao
	 * @date 2016年7月25日 下午4:01:45
	 * @param
	 * @return
	 */
	public List<Map<String, Object>> getWithdrawTable(int userId,String startTime,String endTime,int curPage,int pageSize,String status){
		 SimpleDateFormat sdf =  new SimpleDateFormat("yyyy-MM-dd HH:mm:ss"); 

		List<Map<String, Object>>  ls=new ArrayList<Map<String, Object>>();
		try {
			StringBuffer sbf= new StringBuffer();
			sbf.append("SELECT ulog.account_id,ulog.bank_info_id,ulog.flow_code,ulog.account_offline_income,ulog.account_platform_income,ulog.account_status AS status,ulog.account_balance_after,ulog.account_refund,(ulog.account_offline_income+ulog.account_platform_income)* ulog.account_poundage AS charge_rate,");
			sbf.append(" ulog.start_time,ulog.end_time,app.appeal_content,mone.after_money");
			sbf.append(" FROM t_user_account_log ulog LEFT JOIN t4_income_collect inc ON ulog.user_id=inc.user_id");
			sbf.append(" LEFT JOIN t4_appeal app ON app.account_id=ulog.account_id");
			sbf.append(" LEFT JOIN t4_money_change mone ON mone.account_id=ulog.account_id");
			sbf.append(" LEFT JOIN t_user_bank_info bank ON  ulog.bank_info_id=bank.id");
			sbf.append(" WHERE ulog.account_status");
			switch (status) {
				case "802":sbf.append(" IN (801,802)");break;
				case "805":sbf.append(" IN (805,808)");break;
				case "807":sbf.append(" IN (806,807)");break;
				case "808":sbf.append(" IN (805,808)");break;
				default:sbf.append(" NOT IN (800)");break;
			}
			if(!startTime.equals("")){
				startTime=startTime+" 00:00:00";
				Date sTime=sdf.parse(startTime);
				sbf.append(" AND ulog.start_time>").append("'"+sTime.getTime()+"'");
			}
			if(!endTime.equals("")){
				endTime=endTime+" 23:59:59";
				Date eTime=sdf.parse(endTime);
				sbf.append(" AND ulog.start_time<").append("'"+eTime.getTime()+"'");
			}
			sbf.append(" AND inc.user_id=?");
			sbf.append(" GROUP BY ulog.account_id");
			sbf.append(" ORDER BY ulog.account_status ASC LIMIT ?,?");
			
			ls=jdbcTemplate.queryForList(sbf.toString(), new Object[]{userId,(curPage-1)*pageSize,pageSize});
			if(ls.size()!=0){
				
				for (int i = 0; i < ls.size(); i++) {
					long wdStartTime=(long)ls.get(i).get("start_time");
					long wdEndTime=(long)ls.get(i).get("end_time");
					ls.get(i).put("start_time", sdf.format(wdStartTime));
					ls.get(i).put("end_time", sdf.format(wdEndTime));
					
				}
			}
		} catch (Exception e) {
			log.error("查询商户提现记录失败");
		}
		return ls;
	}
	/**
	 * 
	 * @Description:用户同意财务审核结果点击确认提现	
	 * @author songyanbiao
	 * @date 2016年7月25日 下午3:33:29
	 * @param
	 * @return
	 */
	public boolean updateUserAgree(final String accountId,final String status,final String content){
		try {
			
			Trans.exec(new Atom() {
				@Override
				public void run() {
					int i=0;
					// TODO Auto-generated method stub
					String sql="UPDATE t_user_account_log SET account_status=? WHERE account_id=?";
					i =jdbcTemplate.update(sql, new Object[]{status,accountId});
					if(i<1)
						throw Lang.makeThrow("修改用户同意提现时的状态失败");
					if(status.equals("806")){
						sql="INSERT INTO t4_appeal(appeal_id ,account_id,appeal_content,appeal_status,create_time ) VALUES(?,?,?,?,?)";
						i=jdbcTemplate.update(sql, new Object[]{UUIDUtils.getUUID(),accountId,content,status,new Date()});
						if(i<1)
							throw Lang.makeThrow("添加用户申诉时记录");
					}
				}
			});
		} catch (Exception e) {
			log.error("用户同意提现修改错误",e);
			return false;
		}
		return true;
	}
	/**
	 * 
	 * @Description:通过提现单号获取商户可提现金额修改记录	
	 * @author songyanbiao
	 * @date 2016年7月25日 下午4:45:08
	 * @param
	 * @return
	 */
	public List getChange(String accountId){
		return settlementRatioService.selectFinanceRecord(accountId);
	}
	/**
	 * 
	 * @Description:校验汇总表金额,防止双击	
	 * @author songyanbiao
	 * @date 2016年9月12日 上午9:17:35
	 * @param
	 * @return
	 */
	public boolean checkAccount(int userId,BigDecimal withdrawMoney){
		boolean flag=false;
		try {
			IncomeCollect col=nutDao.fetch(IncomeCollect.class, Cnd.where("user_id","=",userId));
			if(col==null){
				flag= false;
			}else if(withdrawMoney.compareTo(col.getPlatformIncome())>0){//校验提现金额与汇总表的金额
				flag= false;
			}else if(col.getPlatformIncome().compareTo( col.getLowestMoney())<0){//校验提现金额和最低提现金额
				flag= false;
			}else{
				flag= true;
			}
		} catch (Exception e) {
			log.error(":校验汇总表金额出错",e);
		}
		return flag;
	}
	
	/**
	 * 
	 * @Description:获取该商户提现记录的总数	
	 * @author songyanbiao
	 * @date 2016年7月26日 上午9:14:53
	 * @param
	 * @return
	 */
	public int getPageCount(int userId,String startTime,String endTime,String status) throws ParseException{
		int i=0;
		try {
			SimpleDateFormat sdf =  new SimpleDateFormat("yyyy-MM-dd HH:mm:ss"); 
			StringBuffer sbf= new StringBuffer();
			sbf.append("SELECT COUNT(*) FROM t_user_account_log WHERE user_id=").append(userId);
			if(!startTime.equals("")){
				startTime=startTime+" 00:00:00";
				Date sTime=sdf.parse(startTime);
				sbf.append(" AND start_time>").append(sTime.getTime());
			}
			if(!endTime.equals("")){
				endTime=endTime+" 23:59:59";
				Date eTime=sdf.parse(endTime);
				sbf.append(" AND start_time<").append(eTime.getTime());
			}
			sbf.append(" AND account_status");
			switch (status) {
			case "802":sbf.append(" IN (801,802)");break;
			case "805":sbf.append(" IN (805,808)");break;
			case "807":sbf.append(" IN (806,807)");break;
			case "808":sbf.append(" IN (805,808)");break;
			default:sbf.append(" NOT IN (800)");break;
			}
			sbf.append(" ORDER BY account_status ASC");
			i=jdbcTemplate.queryForInt(sbf.toString());
			 
		} catch (Exception e) {
			log.error("查询商户提现总记录数出错",e);
		}
		return i;
	}
	/**
	 * 
	 * @Description:获取商户流水账	
	 * @author songyanbiao
	 * @date 2016年7月26日 下午4:50:46
	 * @param
	 * @return
	 */
	public List<Map<String, Object>> getAccount(int userId,String startTime,String endTime,int curPage,int pageSize) throws ParseException{
		List<Map<String, Object>>  ls=new ArrayList<Map<String, Object>>();
		SimpleDateFormat sdf1 = new SimpleDateFormat("yyyy-MM-dd");  
		try {
			SimpleDateFormat sdf =  new SimpleDateFormat("yyyy-MM-dd HH:mm:ss"); 
			StringBuffer sbf= new StringBuffer();
			sbf.append("SELECT ulog.flow_code,ulog.account_platform_income,ulog.account_offline_income, ulog.account_refund ,");
			sbf.append(" (ulog.account_platform_income+ulog.account_offline_income)* ulog.account_poundage  AS poundage, (ulog.account_balance_after+ulog.account_offline_income) AS accountincome");
			sbf.append(" ,ulog.start_time,ulog.end_time FROM t_user_account_log ulog");
			sbf.append(" WHERE user_id=").append(userId);
			sbf.append(" AND ulog.account_status IN (805,808)");
			if(!startTime.equals("")){
				startTime=startTime+" 00:00:00";
				Date sTime=sdf.parse(startTime);
				sbf.append(" AND ulog.start_time>").append(sTime.getTime());
			}
			if(!endTime.equals("")){
				endTime=endTime+" 23:59:59";
				Date eTime=sdf.parse(endTime);
				sbf.append(" AND ulog.start_time<").append(eTime.getTime());
			}
			sbf.append(" ORDER BY start_time DESC LIMIT ?,?");
			ls=jdbcTemplate.queryForList(sbf.toString(),new Object[]{(curPage-1)*pageSize,pageSize});
			if(ls.size()!=0){
				for (int i = 0; i < ls.size(); i++) {
					long wdStartTime=(long)ls.get(i).get("start_time");
					long wdEndTime=(long)ls.get(i).get("end_time");
					ls.get(i).put("start_time1", sdf.format(wdStartTime));
					ls.get(i).put("end_time1", sdf.format(wdEndTime));
					ls.get(i).put("start_time", sdf1.format(wdStartTime));
					ls.get(i).put("end_time", sdf1.format(wdEndTime));
				}
			}
			System.out.println(sbf.toString());
		} catch (Exception e) {
			log.error("查询商户账户流水出错",e);
		}
		return ls;
	}
	/**
	 * 
	 * @Description:查询商户账户流水收入明细	
	 * @author songyanbiao
	 * @date 2016年7月27日 上午9:34:43
	 * @param
	 * @return
	 */
	public List<WithDrawAccountBean> getDrawExcle(int userId,String startDate,String endDate){
		SimpleDateFormat sdf =   new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		List<WithDrawAccountBean> beanLs= new ArrayList<WithDrawAccountBean>();
		try {
			StringBuffer sbf= new StringBuffer();
			sbf.append("SELECT");
			sbf.append(" c.transaction_amount,s.site_name,c.portal_user_name,c.pay_name,c.buy_num,c.create_time");
	/*		sbf.append(" CASE WHEN c.pay_type=0 THEN '未知类型'");
			sbf.append(" WHEN c.pay_type=1 THEN '支付宝支付'");
			sbf.append(" WHEN c.pay_type=2 THEN '银行卡支付'");
			sbf.append(" WHEN c.pay_type=3 THEN '微信支付'");
			sbf.append(" WHEN c.pay_type=4 THEN '人工支付'");
			sbf.append(" END AS pay_way_name");*/
			sbf.append(" FROM t_site_income c LEFT JOIN t_cloud_site s ON s.id=c.site_id");
			sbf.append(" WHERE s.user_id=").append(userId);
			sbf.append(" AND c.create_time >= ").append("'"+startDate+"'");
			sbf.append(" AND c.create_time < ").append("'"+endDate+"'");
			sbf.append(" ORDER BY c.create_time DESC");
			List<Map<String, Object>> ls=jdbcTemplate.queryForList(sbf.toString());
			if(ls.size()>0){
				for (int i = 0; i < ls.size(); i++) {
					WithDrawAccountBean wdb=new WithDrawAccountBean();
					wdb.setBuyNum(ls.get(i).get("buy_num")+"");
					wdb.setPayName(ls.get(i).get("pay_name")+"");
					wdb.setCreateTime(sdf.parse(ls.get(i).get("create_time")+""));
					String name=ls.get(i).get("portal_user_name")+"";
					if(name.indexOf("0")==0){
						wdb.setPayTypeName("营业厅充值");
						wdb.setPortalUserName(name.replaceFirst("0",""));
					}else{
						wdb.setPayTypeName("自助充值");
						wdb.setPortalUserName(name);
					}
					wdb.setSiteName(ls.get(i).get("site_name")+"");
					wdb.setTransactionAmount((BigDecimal)ls.get(i).get("transaction_amount"));
					beanLs.add(wdb);
				}
			}
		} catch (Exception e) {
			log.error("导出excle出错",e);
		}
		return beanLs;
	}
	/**
	 * 
	 * @Description:校验验证码	
	 * @author songyanbiao
	 * @date 2016年8月26日 下午3:01:28
	 * @param
	 * @return
	 */
	public boolean checkUserCode(String yzmNumber,Long oldTime,String imageNumber){
		// 5分钟
		oldTime = oldTime == null ? 0 : oldTime;
		long newTime = new Date().getTime();
		if ((newTime - 5 * 60 * 1000) <= oldTime) {// 通过
				return true;
		} else {
			return false;
		}
	}
	

}
