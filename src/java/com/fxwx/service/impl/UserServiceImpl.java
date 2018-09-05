package com.fxwx.service.impl;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;
import org.nutz.dao.Cnd;
import org.nutz.dao.Dao;
import org.nutz.dao.FieldFilter;
import org.nutz.dao.util.Daos;
import org.nutz.lang.Lang;
import org.nutz.trans.Atom;
import org.nutz.trans.Trans;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.util.Base64Utils;

import com.alibaba.fastjson.JSON;
import com.fxwx.bean.ChurnUserBean;
import com.fxwx.entity.CloudSite;
import com.fxwx.entity.CloudUser;
import com.fxwx.entity.CloudUserInfo;
import com.fxwx.entity.CommonConfig;
import com.fxwx.entity.IncomeCollect;
import com.fxwx.entity.MsgLog;
import com.fxwx.entity.PortalUser;
import com.fxwx.entity.Role;
import com.fxwx.entity.SiteCustomerInfo;
import com.fxwx.entity.SiteIncome;
import com.fxwx.entity.SiteIncomeCollect;
import com.fxwx.entity.SitePaymentRecord;
import com.fxwx.entity.SitePriceConfig;
import com.fxwx.entity.UserLock;
import com.fxwx.util.BigDecimalUtil;
import com.fxwx.util.DateUtil;
import com.fxwx.util.FengKongUtil;
import com.fxwx.util.MD5;
import com.fxwx.util.SHA256;


/**
 * @ToDoWhat 
 * @author xmm
 */
@Service
public class UserServiceImpl {
	
	private static Logger log=Logger.getLogger(UserServiceImpl.class);
	private static String lock="1";
	@Resource(name="jdbcTemplate")
	private JdbcTemplate jdbcTemplate;
	@Resource(name="nutDao")
	private Dao nutDao;
	
	
	@Autowired
	public SitePriceConfigServiceImpl  sitePriceConfigServiceImpl;
	/**
	 * 更新到期时间
	 * @param sci
	 */
	public void resetExpirationTime(SiteCustomerInfo sci){
		nutDao.update(sci);
	}
	/**
	 * 根据电话号码查询是否被锁
	 * @param userName
	 * @return
	 */
	public UserLock getState(String userName){
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd 00:00:00");
		SimpleDateFormat sdf1 = new SimpleDateFormat("yyyy-MM-dd 23:59:59");
		UserLock ul = nutDao.fetch(UserLock.class, Cnd.where("telephone", "=", userName).and("logintime", ">", sdf.format(new Date())).and("logintime", "<", sdf1.format(new Date())).and("state","=","0"));
		
		return ul;
	}
	/**
	 * @Description 搜索用户是否被锁定
	 * @param portalId
	 * @param siteId
	 * @return
	 */
	public boolean isLuckforUser(int portalId,int siteId){
		SiteCustomerInfo info = nutDao.fetch(SiteCustomerInfo.class,Cnd.where("portal_user_id","=",portalId).and("site_id", "=", siteId));
		Date date = info.getLuckTime();
		Date nowDate = new Date();
		long time24 = 24*60*60*1000;
		if(null==date||"".equals(date)){
			return false;
		}else{
			long betw = nowDate.getTime()-date.getTime();
			if(time24>betw){
				return true;
			}else{
				return false;
			}
		}
	}
	
	/**
	 * @Description  给用户解锁
	 * @param portalId
	 * @param siteId
	 */
	public boolean toJieLuck(String userName,int siteId){
		try {
			PortalUser user = getIdByUserName(userName);
			if(user==null){
				return false;
			}
			SiteCustomerInfo info = nutDao.fetch(SiteCustomerInfo.class,Cnd.where("portal_user_id","=",user.getId()).and("site_id", "=", siteId));
			info.setExpirationTime(info.getExpirationTime());
			info.setLuckTime(null);
			info.setPortalUserId(user.getId());
			info.setSiteId(siteId);
			nutDao.update(info);
			return true;
		} catch (Exception e) {
			// TODO: handle exception
			return false;
		}
	}
	/**
	 * 根据电话号码解锁
	 * @param userLock
	 * @return
	 */
	public boolean setStateOpen(UserLock userlock){
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd 00:00:00");
		SimpleDateFormat sdf1 = new SimpleDateFormat("yyyy-MM-dd 23:59:59");
		try{
			UserLock ul = nutDao.fetch(UserLock.class, Cnd.where("telephone", "=", userlock.getTelephone()).and("logintime", ">", sdf.format(new Date())).and("logintime", "<", sdf1.format(new Date())).and("state","=","0"));
			if(ul != null){	
			userlock.setState(1);
			nutDao.update(userlock);
			return true;
			}else{
				return false;
			}
		}catch(Exception e){
			return false;
		}
		
	}
	 
	/**
	 * 根据用户名查找portal用户id
	 * @param id
	 * @return
	 */
	public PortalUser getIdByUserName(String userName){
		return nutDao.fetch(PortalUser.class, Cnd.where("user_name", "=", userName));
	}
	/**
	 * 根据场所id和用户名查找场所客户账户信息
	 * 
	 * @param id
	 * @return
	 */
	
	public SiteCustomerInfo getSiteNameById(int siteId,int PortalUserId){
		SiteCustomerInfo sci=null;
		try {
			sci =nutDao.fetch(SiteCustomerInfo.class, Cnd.where("site_id", "=", siteId).and("portal_user_id", "=", PortalUserId));
		} catch (Exception e) {
			log.error("查询出错");
		}
		return sci ;
	}

	/**
	 * 根据用户id查找用户
	 * @param id
	 * @return
	 */
	public CloudUser getUserById(int userId){
		return nutDao.fetch(CloudUser.class, userId);
	}
	
	/**
	 *  * 查找userName用户
	 * @param userName
	 * @return ture 如果用户名不存在
	 */
	public boolean noUserName(String userName){
		return nutDao.fetch(CloudUser.class, Cnd.where("user_name", "=", userName))==null;
	}
	/**
	 *  * 查找userName用户
	 * @param userName
	 * @return ture 如果用户名不存在
	 */
	public PortalUser getUserNameByTelphone(String userName){
		PortalUser cu =	null;
		try{
			 cu =	nutDao.fetch(PortalUser.class, Cnd.where("user_name", "=", userName));
		}catch(NullPointerException e){
			e.printStackTrace();
		}
		return cu;
	}
	/**
	 *  * 查找userName用户
	 * @param userName
	 * @return ture 如果用户名不存在
	 */
	public CloudUser getCloudUserByTelphone(String userName){
		CloudUser cu =	null;
		try{
			 cu =	nutDao.fetch(CloudUser.class, Cnd.where("user_name", "=", userName));
		}catch(NullPointerException e){
			e.printStackTrace();
		}
		return cu;
	}
	/**
	 * 根据用户名和密码查找用户
	 * @param id
	 * @param passWord  md5(password明码)
	 * @return
	 */
	public CloudUser getUserByUserNameAndPassword(String userName,String passWord){
		passWord =MD5.encode(passWord).toLowerCase();
		String newPw=SHA256.getUserPassword(userName,passWord);
		CloudUser u=nutDao.fetch(CloudUser.class, Cnd.where("user_name", "=", userName).and("pass_word", "=", newPw));
		return u;
	}
	
	/**
	 * 获取用户角色
	 * @param userId
	 * @return
	 */
	public List<Role> getUserRole(int userId){
		return nutDao.query(Role.class,Cnd.where("userId", "=", userId));
	}
	
	/**
	 * 判断用户是否有角色
	 * @param roleId
	 * @return
	 */
	public boolean hasRole(int userId,int roleId){
		List<Role> roles=getUserRole(userId);
		if(roles==null||roles.size()==0){return false;}
		for(Role r:roles){
			if(r.getId()==roleId)return true;
		}
		return false;
	}
	
	
	
	/**
	 * 把缴费记录插入场所收入信息表中
	 * @param sicom
	 * @return
	 */
	
	public int InsertIncome(BigDecimal amount,int siteId,int userId,String userName,int buy_num,String payName,int state){
		SiteIncome si=new SiteIncome();
		si.setSiteId(siteId);
		si.setPortalUserId(userId);
		si.setPortalUserName(userName);
		si.setTransactionAmount(amount);
		si.setPayName(payName);
		si.setBuyNum(buy_num);
		si.setPayType(state);
		nutDao.insert(si);
		return si.getId()>0?1:0;
	}
	/**
	 * 把CloudUser插入数据库
	 * @param cu
	 * @return
	 */
	public boolean UpdateCloudUser(CloudUser cu){
		
		try{
			nutDao.update(cu);
		}catch(Exception e){
			e.printStackTrace();
			return false;
		}
		
		return true;
	}
	/**
	 * 管理员注册用户把信息插入到消费支付表中
	 * @param username
	 * @param pwd
	 * @param gender 用户性别   1代表男,0代表女
	 * @return
	 */
	
	public boolean UpDateConsumerPay(SiteCustomerInfo sci ){
		try {
	        // 保存PortalUser表
			nutDao.insert(sci);
        }catch (Exception e) {
        	e.printStackTrace();
        	return false;
        }
		return true;
	}
	
	/**
	 * 插入场所用户中间表
	 * @param siteId
	 * @param portalId
	 * @return
	 */
	public boolean updateIntermediateChart(Integer siteId,Integer portalId ){
		try {
			String sql = "INSERT INTO t_cloud_site_portal(site_id,portal_id)  VALUES (?,?) ";
			jdbcTemplate.update(sql,new Object[]{siteId,portalId});
			addTryTimeToUser(siteId, portalId);
			return true;
		} catch (Exception e) {
			return false;
		}
		
	}
	
	/**
	 * @Description  判断是否有试用时间,有则加上没有则不加
	 * @date 2016年5月24日下午4:20:06
	 * @author guoyingjie
	 * @param siteId
	 * @param userId
	 */
	public void addTryTimeToUser(int siteId,int userId){
		SimpleDateFormat sdf= new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		try {
			CloudSite site =nutDao.fetch(CloudSite.class,Cnd.where("id","=",siteId));
			SiteCustomerInfo info = new SiteCustomerInfo();
			info.setIsTry(0);
			info.setSiteId(siteId);
			info.setPortalUserId(userId);
			if(site.getIs_probative()==30){
				info.setExpirationTime(sdf.format(new Date(new Date().getTime()+site.getIs_probative()*60*1000)));
			}else{
				info.setExpirationTime(sdf.format(new Date(new Date().getTime()+site.getIs_probative()*60*60*1000)));
			}
			nutDao.insert(info);
		} catch (Exception e) {
			log.error(this.getClass().getCanonicalName()+"--addTryTimeToUser");
		}
	}
	
	/**
	 * 管理员注册用户
	 * @param username
	 * @param pwd
	 * @param gender 用户性别   1代表男,0代表女
	 * @return
	 */
	
	public boolean userRegistByAdmin(PortalUser user ){
		try {
			
			// 保存PortalUser表
			nutDao.insert(user);
			return true;
		}catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}

	
	/**
	 * 用户注册
	 * @param user
	 * @returnfinal CloudUserInfo userInf
	 */
	public boolean userRegist(final CloudUser user,final String agent ,final int roleId,final String telephone){
		//设置用户密码
		try {
	        Trans.exec(new Atom(){
	            public void run() {
	        		//开启事务 保存user表
	            	nutDao.insert(user);
	        		//保存userInfo表，关闭事务
	            	CloudUserInfo uInfo=new CloudUserInfo();
	            	uInfo.setUserId(user.getId());
	            	uInfo.setTelephone(telephone);
	            	uInfo.setRealName(agent);
	            	uInfo.setUpdateTime(new Timestamp(new Date().getTime()));
	            	Daos.ext(nutDao, FieldFilter.create(CloudUserInfo.class, "^userId|realName|telephone$")).insert(uInfo);
	            }
	        });
        }catch (Exception e) {
        	log.error("userRegist 事务报错--", e);
        	return false;
        }
		return true;
	}
	
	/**
	 * 返回场所有收费规则
	 * @param siteid,chargeType 规则归属集团（0无归属，1归属电信）
	 * @return
	 */
	public List<SitePriceConfig> sitePriceConfigAll(int siteid,int chargeType){
		return  nutDao.query(SitePriceConfig.class,Cnd.where("site_id","=",siteid).and("is_stoped","=","0").and("charge_type","=",chargeType));
	}
	
	/**
	 * 更新用户到期套餐 时间或者流量
	 * @param expireFlow
	 * @param siteId
	 * @param userId
	 * @return
	 */
	public int changeUserExpireMeal(Map<String,String> map){
		SimpleDateFormat sdf= new SimpleDateFormat("YYYY-MM-dd HH:mm:ss");
		SiteCustomerInfo sci=nutDao.fetch(SiteCustomerInfo.class, Cnd.where("siteId","=",Integer.parseInt(map.get("storeId"))).and("portal_user_id","=",Integer.parseInt(map.get("userId"))));
		try {
			if(sci==null){
				sci=new SiteCustomerInfo();
				if("1".equals(map.get("mealType"))){
					sci.setExpirationTime(map.get("expireDate"));
					sci.setTotalFlow("0");
					sci.setLastFlow("0");
				}else{
					sci.setExpirationTime(sdf.format(new Date()));
					sci.setTotalFlow(map.get("expireFlow"));
					sci.setLastFlow(map.get("expireFlow"));
				}
				sci.setSiteId(Integer.parseInt(map.get("storeId")));
				sci.setPortalUserId(Integer.parseInt(map.get("userId")));
				sci.setCreateTime(new Timestamp(new Date().getTime()));
				sci.setIsTry(1);
				sci.setPayWay(0);
				sci.setUpdateTime(new Timestamp(new Date().getTime()));
				nutDao.insert(sci);
			}else{
				if("1".equals(map.get("mealType"))){
					sci.setExpirationTime(map.get("expireDate"));
					if(sci.getTotalFlow()==null){
						sci.setTotalFlow("0");
					}
				}else{
					sci.setTotalFlow(map.get("expireFlow"));
					sci.setLastFlow(map.get("expireFlow"));
					if(sci.getExpirationTime()==null){
						sci.setExpirationTime(sdf.format(new Date()));
					}
				}
				sci.setSiteId(Integer.parseInt(map.get("storeId")));
				sci.setPortalUserId(Integer.parseInt(map.get("userId")));
				sci.setIsTry(0);
				nutDao.update(sci);
			}
			return sci.getId()>0?1:0;
		} catch (Exception e) {
			log.error("更新用户到期套餐 时间或者流量失败");
			return 0;
		}
		
	}

	/**
	 * 插入场所客户账户信息(t_site_customer_info)
	 * @param sci
	 * @return
	 */
	
	public boolean insertSpc(SiteCustomerInfo sci){
		try {
	        // 保存SiteCustomerInfo
			nutDao.insert(sci);
        }catch (Exception e) {
        	e.printStackTrace();
        	return false;
        }
		return true;
	}
	
	public void insertConf(String siteId,String portalId){
		String sql = "insert into ";
	}
	
	/**
	 * 通过用户名查询账户密码
	 * @Description: 
	 * @param userName
	 * @return
	 * @Date		2016年6月24日 上午10:24:29
	 * @Author		cuimiao
	 */
	public String getPassByUsername(String userName){
		String sql = "SELECT pass_word FROM t_cloud_user where user_name = ?";
		String pass = jdbcTemplate.queryForObject(sql, new Object[]{userName} , String.class);
		return pass;
	}
	
	/**
	 * 根据用户名查询角色集合字符串，返回多个角色时以半角','隔开
	 * @Description: 
	 * @param userName
	 * @return
	 * @Date		2016年6月24日 上午11:59:18
	 * @Author		cuimiao
	 */
	public String getRoleByUsername(String userName){
		StringBuffer sql = new StringBuffer();
		sql.append(" SELECT role.role_name FROM t_cloud_user user");
		sql.append(" left join t3_cloud_role role on role.id = user.role_id");
		sql.append(" where user.user_name = ?");
		String roles = jdbcTemplate.queryForObject(sql.toString(), new Object[]{userName} , String.class);
		return roles;
	}
	
	public List<String> getPermissionByRole(String roleName){
		StringBuffer sql = new StringBuffer();
		sql.append(" select perm.perm_name from t4_role_permission perm");
		sql.append(" left join t3_cloud_role role on role.role_name = perm.role_name");
		sql.append(" where perm.role_name = ?");
		List<String> listPer = jdbcTemplate.queryForList(sql.toString(), new Object[]{roleName} , String.class);
		return listPer;
	}
	
	public boolean checkParam( Map<String,String> map,SitePriceConfig spcf){
		if(map.containsValue(null)||map.containsValue("")||map.containsValue("null"))return false;
		//校验金额  BigDecimal
		BigDecimal pageAmount=new BigDecimal(map.get("amount"));
		BigDecimal calculateResult=BigDecimalUtil.multiply(spcf.getUnit_price(), Integer.parseInt(map.get("buyNum")));
		if(!BigDecimalUtil.doubleValueEquals(pageAmount, calculateResult)){
			return false;
		}
		//校验赠送的套餐
		if(!map.get("addMealNum").equals("0")){
			
			if(spcf.getGiveMeal()!=Integer.parseInt(map.get("addMealNum"))||spcf.getGiveMealUnit()!=Integer.parseInt(map.get("addMealUnit"))){
				return false;
			}
		}
		return true;
	}
	
	/**
	 * 
	 *	@Description:用户缴费时计算用户的到期套餐
	 *  @author songyanbiao
	 *	@Date 2016年6月30日 
	 *	@param scii
	 *	@param scf
	 *	@param map
	 *	@return
	 * @throws ParseException 
	 */
	public String getUserCustomer(SiteCustomerInfo scii,SitePriceConfig scf,Map<String ,String>map) throws ParseException{
		String riqi="";
		int flow=0;
		if("1".equals(map.get("mealType"))){//用户购买的是时间套餐
			
			//根据和当前时间的比较计算到期时间
			//没缴过费的话
			SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			Date now = new Date();
			
			String str1 = sdf.format(now.getTime());//当前时间
			String str2 = "";
			if(scii==null){
				str2=sdf.format(now.getTime());
			}else{
				//如果用户有记录但是只有购买流量的记录,这时用户的过期时间为null
				if(scii.getExpirationTime()==null||scii.getExpirationTime().equals("null")||"".equals(scii.getExpirationTime())){
					str2=sdf.format(now.getTime());
				}else{
					str2 = sdf.format( DateUtil.parse(scii.getExpirationTime()).getTime());
				}
			}
			int cmp =DateUtil.compareDate(str1,str2);
			if(cmp==1){
				//到期时间小于等于当前时间时，在当前时间的基础上计算新的到期时间
				riqi = DateUtil.newDatePluss(scf.getPrice_type(), Integer.parseInt(map.get("buyNum")),str1,map.get("priceNum"));	
			}else{
				//到期时间大于当前时间时，在到期时间基础上计算新的到期时间
				riqi = DateUtil.newDatePluss(scf.getPrice_type(), Integer.parseInt(map.get("buyNum")),str2,map.get("priceNum"));	
			}
			if(map.get("addMealNum")!="0"&&map.get("addMealNum")!=null&&map.get("addMealUnit")!=null){
				riqi=DateUtil.newDatePluss(Integer.parseInt(map.get("addMealUnit")), Integer.parseInt(map.get("addMealNum")),riqi,"1");
			}
		}else{
			
			if(scii!=null){
				//如果用户有记录但是只有购买时间的记录,这时用户的流量为null
				if(scii.getTotalFlow()!=null&&!scii.getTotalFlow().equals("null")){
					flow=Integer.parseInt(scii.getTotalFlow());
				}
				if(scf.getPrice_type()==4){//购买的套餐是M
					flow=flow+Integer.parseInt(map.get("buyNum"))*Integer.parseInt(map.get("priceNum"))*1024;
				}else{//购买的套餐时G
					flow=flow+Integer.parseInt(map.get("buyNum"))*Integer.parseInt(map.get("priceNum"))*1024*1024;
				}
				//如果用户购买的套餐有赠送流量
				if(map.get("addMealNum")!=null&&map.get("addMealUnit")!=null){
					if("4".equals(map.get("addMealUnit"))){
						flow=flow+Integer.parseInt(map.get("addMealNum"))*1024;
					}else{
						flow=flow+Integer.parseInt(map.get("addMealNum"))*1024*1024;
					}
				}
				
			}else{
				if(scf.getPrice_type()==4){//购买的套餐是M
					flow=flow+Integer.parseInt(map.get("buyNum"))*Integer.parseInt(map.get("priceNum"))*1024;
				}else{//购买的套餐时G
					flow=flow+Integer.parseInt(map.get("buyNum"))*Integer.parseInt(map.get("priceNum"))*1024*1024;
				}
				//如果用户购买的套餐有赠送流量
				if(map.get("addMealNum")!=null&&map.get("addMealUnit")!=null){
					if("4".equals(map.get("addMealUnit"))){
						flow=flow+Integer.parseInt(map.get("addMealNum"))*1024;
					}else{
						flow=flow+Integer.parseInt(map.get("addMealNum"))*1024*1024;
					}
				}
			}
			riqi=String.valueOf(flow);
		}
		return riqi;
	}
	
	/**保存用户支付的记录信息
	 * @param orderNum
	 * @param map
	 * @return 0失败。1成功
	 */
	public boolean savePaymentinfo(String orderNum,Map<String,String> map,int payType){
		try {
			
			String json=JSON.toJSONString(map);
			String payUser="";
			String tel="";
			SitePaymentRecord paymentRecord =new SitePaymentRecord(); 
			paymentRecord.setOrderNum(orderNum);
			paymentRecord.setUserId(Integer.parseInt(map.get("userId")));
			paymentRecord.setSiteId(Integer.parseInt(map.get("storeId")));
			paymentRecord.setParamJson(json);
			paymentRecord.setTradeNum("");
			paymentRecord.setFailReason("");
			paymentRecord.setPayType(payType);
			paymentRecord.setOutPayUser(tel=map.get("payUser")==null?null:map.get("payUser"));
			paymentRecord.setInputPayUser(payUser=map.get("tel")==null?null:map.get("tel"));
			nutDao.insert(paymentRecord);
			return paymentRecord.getId()>0;
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
		}
		return false;
	}
	/**
	 * 更新支付记录为成功
	 * @param tradeNum
	 * @param orderNum
	 * @return 1成功
	 */
	public int updateToFinish(String orderNum){
		SitePaymentRecord spr=nutDao.fetch(SitePaymentRecord.class, Cnd.where("order_num", "=", orderNum));
		spr.setIsFinish(1);
		spr.setFinishTime(new Date())   ;
		spr.setFailReason("");
		return nutDao.update(spr);
	}
	/**
	 * 
	 *	@Description:用户人工缴费时，修改用户的计费信息，以及商户的进账
	 *  @author songyanbiao
	 *	@Date 2016年6月30日 
	 *	@return
	 */
	public boolean dealUserMess(final Map<String,String> map,final String orderNum ,final String userName){
		
		try {
			Trans.exec(new Atom() {
				
				@Override
				public void run() {
					int  i = changeUserExpireMeal(map);
					if (i != 1) {
						log.error("修改支付用户的到期 时间失败--orderNum:" + orderNum);
						throw Lang.makeThrow("修改用户到期时间失败--orderNum:"
								+ orderNum);
					}
					// 校园卡账务信息表添加记录
	        		i=InsertIncome(new BigDecimal(map.get("amount")),Integer.parseInt(map.get("storeId")),Integer.parseInt(map.get("userId")),userName,Integer.parseInt(map.get("buyNum")),map.get("priceName"),4);
					if (i != 1) {
						log.error("校园卡账务信息表添加记录失败--orderNum:" + orderNum);
						throw Lang.makeThrow("校园卡账务信息表添加记录失败--orderNum:"
								+ orderNum);
					}
					// 校园卡支付记录表状态修改为支付成功
					i =updateToFinish(orderNum);
					if (i != 1) {// 执行不成功
						log.error("校园卡支付记录表状态修改失败--orderNum:" + orderNum);
						throw Lang.makeThrow("校园卡支付记录表状态修改失败--orderNum:"
								+ orderNum);
					}
					boolean y=updateCollect(new BigDecimal(map.get("amount")), Integer.parseInt(map.get("storeId")), Integer.parseInt(map.get("tenantId")));
					if(!y){
						throw Lang.makeThrow("计费表用户统计或场所统计插入或更新未成功"+ orderNum);
					}
					
				}
			});
			
		} catch (Exception e) {
			log.error("支付过程事务故障",e);
			return false;
		}
		return true;
	}
	/**
	 * 
	 * @Description:更新商户汇总表和场所收入表	
	 * @author songyanbiao
	 * @date 2016年7月15日 下午3:32:40
	 * @param
	 * @return
	 */
//	public int updateCollect(BigDecimal amount, int siteId, int userId) {
//		int upback = 0;
//		IncomeCollect incomeCollect = nutDao.fetch(IncomeCollect.class,Cnd.where("user_id", "=", userId));
//		if(incomeCollect!=null&&incomeCollect.getId()>0){
//			incomeCollect.setOfflineIncome(BigDecimalUtil.add(amount, incomeCollect.getOfflineIncome()));
//			incomeCollect.setAccountIncome(BigDecimalUtil.add(incomeCollect.getAccountIncome(),amount));
//			upback =nutDao.update(incomeCollect);
//		}else{
//			incomeCollect=new IncomeCollect();
//			CommonConfig comconfig = nutDao.fetch(CommonConfig.class,Cnd.where("ident","=","881"));
//			incomeCollect.setUserId(userId+"");
//			incomeCollect.setAccountRefund(new BigDecimal("0"));
//			incomeCollect.setOfflineIncome(amount);
//			incomeCollect.setWithdrawTime(new Date().getTime()); 
//			incomeCollect.setPlatformIncome(new BigDecimal("0"));
//			incomeCollect.setLowestMoney(comconfig.getCommonMinMoney());
//			incomeCollect.setShortestCycle(comconfig.getCommonBalanceday());
//			incomeCollect.setChargeRate(comconfig.getCommonChagrge());
//			incomeCollect.setAccountIncome(amount);
//			upback = nutDao.insert(incomeCollect).getId();
//		}
//		SiteIncomeCollect sitincomeCollect = nutDao.fetch(SiteIncomeCollect.class,Cnd.where("site_id", "=", siteId));
//		if(sitincomeCollect!=null&&sitincomeCollect.getId()>0){
//			sitincomeCollect.setOfflineIncome(BigDecimalUtil.add(amount, sitincomeCollect.getOfflineIncome()));
//			sitincomeCollect.setAccountIncome(BigDecimalUtil.add(amount, sitincomeCollect.getAccountIncome()));
//			upback =nutDao.update(sitincomeCollect);
//		}else{
//			sitincomeCollect=new SiteIncomeCollect();
//			sitincomeCollect.setSiteId(siteId+"");
//			sitincomeCollect.setUserId(userId+"");
//			sitincomeCollect.setOfflineIncome(amount);
//			sitincomeCollect.setAccountIncome(amount);
//			sitincomeCollect.setPlatformIncome(new BigDecimal("0"));
//			sitincomeCollect.setAccounRrefund(new BigDecimal("0"));
//			upback = nutDao.insert(sitincomeCollect).getId();
//		}
//		return upback;
////		if(upback<1)
////				throw new NullPointerException("计费表用户统计或场所统计插入或更新未成功");
////		Sql sql = Sqls.create("UPDATE t4_income_collect SET platform_income=platform_income+@masterId where user_id=@userid");
////	    sql.params().set("masterId", amount);
////	    sql.params().set("userid", userId);
////	    nutDao.execute(sql);
////	    sql = Sqls.create("UPDATE t4_site_income_collect SET platform_income=platform_income+@masterId where site_id=@siteid");
////	    sql.params().set("masterId", amount);
////	    sql.params().set("siteid", siteId);
////	    nutDao.execute(sql);
//	}

	
	/**
	 * 
	 * @Description:更新商户汇总表和场所收入表	
	 * @author songyanbiao
	 * @date 2016年7月15日 下午3:32:06
	 * @param
	 * @return
	 */
	public boolean updateCollect(BigDecimal amount, int siteId, int userId) {
		int upback = 0;
		int upback1=0;
		try {
			String sql="UPDATE t4_income_collect SET offline_income=offline_income+?,account_income=account_income+? WHERE user_id=?";
			String sql1="UPDATE t4_site_income_collect SET offline_income=offline_income+?,account_income=account_income+? WHERE user_id=? AND site_id=?";
			upback=jdbcTemplate.update(sql,new Object[]{amount,amount,userId});
			upback1=jdbcTemplate.update(sql1,new Object[]{amount,amount,userId,siteId});
			if(upback==0&&upback1==0){
				synchronized (lock) {
					IncomeCollect incomeCollect = nutDao.fetch(IncomeCollect.class,Cnd.where("user_id", "=", userId));
					if(incomeCollect==null){
						incomeCollect=new IncomeCollect();
						CommonConfig comconfig = nutDao.fetch(CommonConfig.class,Cnd.where("ident","=","881"));
						incomeCollect.setUserId(userId+"");
						incomeCollect.setPlatformIncome(new BigDecimal("0"));
						incomeCollect.setAccountRefund(new BigDecimal("0"));
						incomeCollect.setOfflineIncome(amount);
						incomeCollect.setWithdrawTime(new Date().getTime());
						incomeCollect.setLowestMoney(comconfig.getCommonMinMoney());
						incomeCollect.setShortestCycle(comconfig.getCommonBalanceday());
						incomeCollect.setChargeRate(comconfig.getCommonChagrge());
						incomeCollect.setAccountIncome(amount);
						upback = nutDao.insert(incomeCollect).getId();

					}else{
						upback=jdbcTemplate.update(sql,new Object[]{amount,amount,userId});

					}
					SiteIncomeCollect sitincomeCollect = nutDao.fetch(SiteIncomeCollect.class,Cnd.where("site_id", "=", siteId).and("user_id","=",userId));
					if(sitincomeCollect==null){
						sitincomeCollect=new SiteIncomeCollect();
						sitincomeCollect.setSiteId(siteId+"");
						sitincomeCollect.setUserId(userId+"");
						sitincomeCollect.setPlatformIncome(new BigDecimal("0"));
						sitincomeCollect.setAccountIncome(amount);
						sitincomeCollect.setOfflineIncome(amount);
						sitincomeCollect.setAccounRrefund(new BigDecimal("0"));
						upback1 = nutDao.insert(sitincomeCollect).getId();

					}else{
						upback1=jdbcTemplate.update(sql1,new Object[]{amount,amount,userId,siteId});

					}
				}
			}
			if(upback==0&&upback1!=0){
				IncomeCollect incomeCollect = nutDao.fetch(IncomeCollect.class,Cnd.where("user_id", "=", userId));
				if(incomeCollect==null){
					incomeCollect=new IncomeCollect();
					CommonConfig comconfig = nutDao.fetch(CommonConfig.class,Cnd.where("ident","=","881"));
					incomeCollect.setUserId(userId+"");
					incomeCollect.setPlatformIncome(new BigDecimal("0"));
					incomeCollect.setAccountRefund(new BigDecimal("0"));
					incomeCollect.setOfflineIncome(amount);
					incomeCollect.setWithdrawTime(new Date().getTime());
					incomeCollect.setLowestMoney(comconfig.getCommonMinMoney());
					incomeCollect.setShortestCycle(comconfig.getCommonBalanceday());
					incomeCollect.setChargeRate(comconfig.getCommonChagrge());
					incomeCollect.setAccountIncome(amount);
					upback = nutDao.insert(incomeCollect).getId();
				}else{
					upback=jdbcTemplate.update(sql,new Object[]{amount,amount,userId});

				}
			}
			if(upback!=0&&upback1==0){
				SiteIncomeCollect sitincomeCollect = nutDao.fetch(SiteIncomeCollect.class,Cnd.where("site_id", "=", siteId).and("user_id","=",userId));
				if(sitincomeCollect==null){
					sitincomeCollect=new SiteIncomeCollect();
					sitincomeCollect.setSiteId(siteId+"");
					sitincomeCollect.setUserId(userId+"");
					sitincomeCollect.setPlatformIncome(new BigDecimal("0"));
					sitincomeCollect.setAccountIncome(amount);
					sitincomeCollect.setOfflineIncome(amount);
					sitincomeCollect.setAccounRrefund(new BigDecimal("0"));
					upback1 = nutDao.insert(sitincomeCollect).getId();
				}else{
					upback1=jdbcTemplate.update(sql1,new Object[]{amount,amount,userId,siteId});

				}
			}
		} catch (Exception e) {
			log.error("用户缴费插入汇总表报错,缴费金额==="+amount+"商户id==="+userId+"场所id==="+siteId);
		}
		if(upback>0&&upback1>0){
			return true;
		}else{
			return false;

		}
	}
	
	
	/*************************新的用户管理**************************************/
	/**
	 * 
	 * @Description:获取平安在线用户列表	
	 * @author songyanbiao
	 * @date 2016年8月18日 上午10:38:04
	 * @param
	 * @return
	 */
	public List<Map<String,Object>> getOnlineAppUserList(int siteId,String userName,int uId,int pageSize,int curPage,String times,int status,HttpSession session){
		SimpleDateFormat sdf= new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String sql="SELECT r.username,u.state,site.site_name,site.id siteid,u.id userid FROM radacct r "+
					" LEFT JOIN t_cloud_site_routers routers ON routers.nasid=r.nasid"+
					" LEFT JOIN t_cloud_site site ON site.id=routers.site_id"+
					" LEFT JOIN t_portal_user u ON u.user_name=r.username";	
				if(siteId==0){
					List<Map<String, Object>> data=(List<Map<String, Object>>) session.getAttribute("appList");
					Map<String, Object> map=null;
					String par="";
					for (int i = 0; i < data.size(); i++) {
						map=data.get(i);
						if(map!=null){
							par+=map.get("id")+",";
						}
					}
					
					sql+=" WHERE site.id in("+par.substring(0,par.length()-1)+")";
				}else{
					sql+=" WHERE site.id="+siteId;
				}
				if(!userName.equals("")){
					sql+=" AND r.username="+userName;
				}
				if(status==1){
					sql+=" AND r.acctstarttime>"+"'"+sdf.format(Long.parseLong(times))+"'";
				}else{
					sql+=" AND r.acctstarttime<"+"'"+sdf.format(Long.parseLong(times))+"'";
				}
				sql+=" AND r.acctstoptime IS NULL GROUP BY r.username limit ?,?";
				return this.getUserList(sql, curPage, pageSize);

				
	} 
	/**
	 * 
	 * @Description:获取在线用户列表	
	 * @author songyanbiao
	 * @date 2016年8月18日 上午10:38:04
	 * @param
	 * @return
	 */
	public List<Map<String,Object>> getOnlineUserList(int siteId,String userName,int uId,int pageSize,int curPage,String times,int status){
		SimpleDateFormat sdf= new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String sql="SELECT r.username,u.state,site.site_name,site.id siteid,u.id userid FROM radacct r "+
					" LEFT JOIN t_cloud_site_routers routers ON routers.nasid=r.nasid"+
					" LEFT JOIN t_cloud_site site ON site.id=routers.site_id"+
					" LEFT JOIN t_portal_user u ON u.user_name=r.username";	
				if(siteId==0){
					sql+=" WHERE site.user_id ="+uId;
				}else{
					sql+=" WHERE site.id="+siteId;
				}
				if(!userName.equals("")){
					sql+=" AND r.username="+userName;
				}
				if(status==1){
					sql+=" AND r.acctstarttime>"+"'"+sdf.format(Long.parseLong(times))+"'";
				}else{
					sql+=" AND r.acctstarttime<"+"'"+sdf.format(Long.parseLong(times))+"'";
				}
				sql+=" AND r.acctstoptime IS NULL GROUP BY r.username limit ?,?";
				return this.getUserList(sql, curPage, pageSize);

				
	} 
	/**
	 * 
	 * @Description:获取在线用户总数	
	 * @author songyanbiao
	 * @date 2016年8月18日 上午10:53:03
	 * @param
	 * @return
	 */
	public int getOnlineUserCount(int siteId,String userName,int uId,int pageSize){
		String sql="SELECT COUNT(DISTINCT username) FROM radacct WHERE nasid IN ("+
					" SELECT routers.nasid FROM t_cloud_site_routers routers LEFT JOIN t_cloud_site site ON site.id=routers.site_id";
			
					if(siteId==0){
						sql+=" WHERE site.user_id ="+uId;
					}else{
						sql+=" WHERE site.id="+siteId;
					}
					if(!userName.equals("")){
						sql+=" AND username="+userName;
					}
					sql+=" )AND acctstoptime IS NULL";
					int totalPageNum=0;
					try {
						int pageNum=jdbcTemplate.queryForInt(sql);
						totalPageNum=this.getTotalNum(pageNum, pageSize);
					} catch (Exception e) {
						log.error("获取在线用户总数出错",e);
					}
				return totalPageNum;
	}
	
	/**
	 * 
	 * @Description:获取注册用户,付费用户列表
	 * @author songyanbiao
	 * @date 2016年8月16日 下午5:40:08
	 * @param
	 * @return
	 */
	public List<Map<String,Object>> getUserInfoList(int siteId,String userName,int uId,int pageSize,int curPage,String times,int status){
		SimpleDateFormat sdf= new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String sql="SELECT user.user_name,user.id userid,user.state,site.site_name,site.id siteid FROM t_portal_user user "+
					" LEFT JOIN t_cloud_site_portal p ON user.id=p.portal_id"+
					" LEFT JOIN t_cloud_site site ON site.id=p.site_id";
		if(siteId==0){
			sql+=" WHERE site.user_id ="+uId;
		}else{
			sql+=" WHERE site.id="+siteId;
		}
		if(!userName.equals("")){
			sql+=" AND user.user_name="+userName;
		}
		if(status==1){//status为1代表是请求是否更新的ajax，
			sql+=" AND user.create_time>"+"'"+sdf.format(Long.parseLong(times))+"'";
		}else{
			sql+=" AND user.create_time<"+"'"+sdf.format(Long.parseLong(times))+"'";
		}
		sql+=" ORDER BY user.create_time DESC limit ?,?";
		
		return this.getUserList(sql, curPage, pageSize);

	}
	/**
	 * 
	 * @Description:获取付费用户列表
	 * @author songyanbiao
	 * @date 2016年8月16日 下午5:40:08
	 * @param
	 * @return
	 */
	public List<Map<String,Object>> getUserPayInfoList(int siteId,String userName,int uId,int pageSize,int curPage,String times,int status){
		SimpleDateFormat sdf= new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
//		String	sql="SELECT user.id userid,user.state,user.user_name,site.id siteid,site.site_name,info.lock_time,info.is_try ,info.expiration_time,info.total_flow,info.used_flow FROM t_portal_user user "+
//					" LEFT JOIN  t_site_customer_info  info ON info.portal_user_id=user.id "+
//				" LEFT JOIN t_cloud_site site ON site.id=info.site_id";
		String	sql="SELECT user.id userid,user.state,user.user_name,site.id siteid,site.site_name FROM t_portal_user user"+ 
				" LEFT JOIN t_site_income income ON  income.portal_user_id= user.id"+ 
				" LEFT JOIN t_cloud_site site ON site.id=income.site_id ";
		
		if(siteId==0){
			sql+=" WHERE site.user_id ="+uId;
		}else{
			sql+=" WHERE site.id="+siteId;
		}
		if(!userName.equals("")){
			sql+=" AND user.user_name="+userName;
		}
		System.out.println(times);
		if(status==1){
			if(!"".equals(times)){
				sql+=" AND income.create_time>"+"'"+sdf.format(Long.parseLong(times))+"'";
			}
		}else{
			if(!"".equals(times)){
				sql+=" AND income.create_time<"+"'"+sdf.format(Long.parseLong(times))+"'";
			}
		}
		sql+=" GROUP BY income.portal_user_id ORDER BY user.create_time DESC limit ?,?";

		//sql+=" ORDER BY info.update_time DESC limit ?,?"; 
		 String sql1="SELECT SUM(transaction_amount) AS allmoney,COUNT(id) allnum FROM t_site_income WHERE portal_user_id=? AND site_id=?";
		 String sql2="SELECT transaction_amount FROM t_site_income WHERE portal_user_id=? AND site_id=? ORDER BY create_time DESC LIMIT 0,1";
		 String sql3="SELECT info.lock_time,info.is_try ,info.expiration_time,info.total_flow,info.used_flow FROM t_site_customer_info info WHERE info.portal_user_id=? AND info.site_id=?";
		List<Map<String, Object>>  ls=new ArrayList<Map<String, Object>>();
		try {
			ls=	jdbcTemplate.queryForList(sql,new Object[]{(curPage-1)*pageSize>0?(curPage-1)*pageSize:0,pageSize});
			if(ls.size()!=0){
				for (int i = 0; i < ls.size(); i++) {
					List<Map<String, Object>> lsMoney=jdbcTemplate.queryForList(sql1,new Object[]{Integer.valueOf(ls.get(i).get("userid")+""),Integer.valueOf(ls.get(i).get("siteid")+"")});
					if(lsMoney.size()!=0){
						ls.get(i).put("allNum", lsMoney.get(0).get("allnum")==null?0:lsMoney.get(0).get("allnum")+"");
						ls.get(i).put("allMoney", lsMoney.get(0).get("allmoney")==null?0:lsMoney.get(0).get("allmoney")+"");
					}else{
						ls.get(i).put("allNum", "0");
						ls.get(i).put("allMoney", "0");
					}
					List<Map<String, Object>> lastMoney=jdbcTemplate.queryForList(sql2,new Object[]{Integer.valueOf(ls.get(i).get("userid")+""),Integer.valueOf(ls.get(i).get("siteid")+"")});
					if(lastMoney.size()!=0){
						ls.get(i).put("transaction_amount", lastMoney.get(0).get("transaction_amount")==null?0:lastMoney.get(0).get("transaction_amount")+"");
					}else{
						ls.get(i).put("transaction_amount","0");

					}
					List<Map<String, Object>> listTime=jdbcTemplate.queryForList(sql3,new Object[]{Integer.valueOf(ls.get(i).get("userid")+""),Integer.valueOf(ls.get(i).get("siteid")+"")});
					if(listTime.size()!=0){
						ls.get(i).put("is_try",listTime.get(0).get("is_try")+"");
						ls.get(i).put("expiration_time",listTime.get(0).get("expiration_time")+"");
						ls.get(i).put("total_flow",listTime.get(0).get("total_flow")+"");
						ls.get(i).put("used_flow",listTime.get(0).get("used_flow")+"");
						if(listTime.get(0).get("lock_time")==null){
							ls.get(i).put("isLock", 0);
						}else{
							Date lockTime=(Date) listTime.get(0).get("lock_time");
							if((lockTime.getTime()+24*60*60*1000)>new Date().getTime()){
								ls.get(i).put("isLock", 1);
							}else{
								ls.get(i).put("isLock", 0);
							}
						}
						
					}
					
				}
			}
		} catch (Exception e) {
			log.error("查询用户状态出错",e);
			return null;
		}
		return ls;
			
	//	return this.getUserList(sql, curPage, pageSize);

	}
	
	/**
	 * 
	 * @Description:获取注册用户总数	
	 * @author songyanbiao
	 * @date 2016年8月17日 上午10:43:04
	 * @param
	 * @return
	 */
	@SuppressWarnings("deprecation")
	public int getUserInfoCount(int siteId,String userName,int uId,int pageSize){
		String sql="SELECT count(*) FROM t_portal_user u"+
					" LEFT JOIN t_cloud_site_portal p ON u.id=p.portal_id"+
					" LEFT JOIN t_cloud_site site ON site.id=p.site_id";
		
		if(siteId==0){
			sql+=" WHERE site.user_id ="+uId;
		}else{
			sql+=" WHERE site.id="+siteId;
		}
		if(!userName.equals("")){
			sql+=" AND u.user_name="+userName;
		}
		int totalPageNum=0;
		try {
			int pageNum=jdbcTemplate.queryForInt(sql);
			totalPageNum=this.getTotalNum(pageNum, pageSize);
		} catch (Exception e) {
			log.error("获取注册用户付费用户总数",e);
		}
		return totalPageNum;
	}
	/**
	 * 
	 * @Description:获取付费用户总数	
	 * @author songyanbiao
	 * @date 2016年8月17日 上午10:43:04
	 * @param
	 * @return
	 */
	@SuppressWarnings("deprecation")
	public int getUserPayInfoCount(int siteId,String userName,int uId,int pageSize){
//		String sql="SELECT COUNT(info.id) FROM t_portal_user user"+
//			" LEFT JOIN t_site_customer_info  info ON info.portal_user_id=user.id "+
//			" LEFT JOIN t_cloud_site site ON site.id=info.site_id";
		String	sql="SELECT COUNT(DISTINCT income.portal_user_id) FROM t_portal_user user"+ 
				" LEFT JOIN t_site_income income ON  income.portal_user_id= user.id"+ 
				" LEFT JOIN t_cloud_site site ON site.id=income.site_id ";
		
		if(siteId==0){
			sql+=" WHERE site.user_id ="+uId;
		}else{
			sql+=" WHERE site.id="+siteId;
		}
		if(!userName.equals("")){
			sql+=" AND user.user_name="+userName;
		}
		int totalPageNum=0;
		try {
			int pageNum=jdbcTemplate.queryForInt(sql);
			totalPageNum=this.getTotalNum(pageNum, pageSize);
		} catch (Exception e) {
			log.error("获取注册用户付费用户总数",e);
		}
		return totalPageNum;
	}
	
	/**
	 * 
	 * @Description:获取注册未付费用户列表	
	 * @author songyanbiao
	 * @date 2016年8月16日 下午4:09:03
	 * @param
	 * @return
	 */
	public List<Map<String,Object>> getUserNoPayList(int siteId,String userName,int uId,int pageSize,int curPage,String times,int status){
		SimpleDateFormat sdf= new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String sql="SELECT u.user_name,u.state,site.site_name FROM t_portal_user u "+
			" LEFT JOIN t_cloud_site_portal portal ON u.id=portal.portal_id"+
			" LEFT JOIN t_cloud_site site ON site.id=portal.site_id";
		if(siteId==0){
		   sql+=" WHERE site.user_id="+uId+" AND u.id NOT IN ("+
				" SELECT income.portal_user_id FROM t_site_income income "+
				" LEFT JOIN t_cloud_site site ON site.id=income.site_id"+
				" WHERE site.user_id="+uId+
				" AND income.create_time<"+"'"+sdf.format(Long.parseLong(times))+"'";
		   sql+=" GROUP BY income.portal_user_id)";
		}else{
		   sql+=" WHERE site.id="+siteId+" AND u.id NOT IN ("+
				" SELECT portal_user_id FROM t_site_income WHERE site_id="+siteId+
				" AND create_time<"+"'"+sdf.format(Long.parseLong(times))+"'";
		   sql+=" GROUP BY portal_user_id)";
		
		}
		if(!userName.equals("")){
		   sql+=" AND u.user_name="+userName;
		}
		
		   sql+=" ORDER BY u.create_time DESC limit ?,?"; 
		if(status==1){
		   sql="SELECT * FROM t_site_income income "
				+ " LEFT JOIN t_cloud_site site  ON income.site_id=site.id  ";
				if(siteId==0){
					sql+=" WHERE site.user_id="+uId;
				}else{
					sql+=" WHERE site.id="+siteId;
				}	
			sql+= " AND income.create_time>"+"'"+sdf.format(Long.parseLong(times))+"'";
			sql+=" limit ?,?";
		}
		List<Map<String, Object>>  ls=new ArrayList<Map<String, Object>>();
		
		try {
			ls=jdbcTemplate.queryForList(sql,new Object[]{(curPage-1)*pageSize,pageSize});	
		
		} catch (Exception e) {
			log.error("获取注册未付费用户出错",e);
			return null;
		}
		System.out.println("==================getUserNoPayList=="+sql.toString());
		return ls;
	}
	/**
	 * 
	 * @Description:获取注册未付费的用户总数	
	 * @author songyanbiao
	 * @date 2016年8月17日 上午10:23:07
	 * @param
	 * @return
	 */
	@SuppressWarnings("deprecation")
	public int getUserNoPayCount(int siteId,String userName,int uId,int pageSize ){
		String sql="SELECT count(u.id) FROM t_portal_user u "+
				" LEFT JOIN t_cloud_site_portal p ON u.id=p.portal_id "+
				" LEFT JOIN t_cloud_site site ON site.id=p.site_id ";
			if(siteId==0){
				sql+=" WHERE site.user_id="+uId+
					 " AND p.portal_id NOT IN (SELECT portal_user_id FROM t_site_income WHERE site_id IN "+
					 " (SELECT id FROM t_cloud_site WHERE user_id="+uId+" ) GROUP BY portal_user_id)";
			}else{
				sql+=" WHERE site.id="+siteId+
					 " AND p.portal_id NOT IN (SELECT portal_user_id FROM t_site_income WHERE site_id ="+siteId+" GROUP BY portal_user_id)";
			}
			if(!userName.equals("")){
				sql+=" AND u.user_name="+userName;
			}
			int totalPageNum=0;
			  try {
				 int pageNum=jdbcTemplate.queryForInt(sql);	
				 totalPageNum=getTotalNum(pageNum, pageSize);
			 } catch (Exception e) {
					log.error("获取注册未付费的用户总数",e);
			 }
			 return totalPageNum;
	}
	/**
	 * 
	 * @Description:获取流失用户列表	
	 * @author songyanbiao
	 * @date 2016年8月17日 下午5:12:09
	 * @param
	 * @return
	 */
	public List<Map<String,Object>> getRunOffUserList(int siteId,int uId,int pageSize,int curPage,String startTime,String endTime,String times,int status) throws ParseException{
		SimpleDateFormat sdf= new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String sql="SELECT u.user_name,cus.portal_user_id userid,cus.site_id siteid,cus.expiration_time,site.site_name FROM t_site_customer_info cus"+			
					" LEFT JOIN t_cloud_site site ON site.id=cus.site_id"+
		 			" LEFT JOIN t_portal_user u ON u.id=cus.portal_user_id";
		 
		 if(siteId==0){
					sql+=" WHERE site.user_id="+uId;
				}else{
					sql+=" WHERE site.id="+siteId;
				}
				sql+=" AND cus.expiration_time<=ADDDATE(NOW(),-14)";
				if(!startTime.equals("")){
					startTime=startTime+" 00:00:00";
					sql+=" AND  cus.expiration_time>"+"'"+startTime+"'";
				}	  
				if(!endTime.equals("")){
					endTime=endTime+" 23:59:59";
					sql+=" AND cus.expiration_time<"+"'"+endTime+"'";
				}
				if(status==1){
					long s=Long.parseLong(times)-14*24*60*60*1000;
					sql+=" AND cus.expiration_time>"+"'"+sdf.format(s)+"'";
				}else{
					long s=Long.parseLong(times)-14*24*60*60*1000;
					sql+=" AND cus.expiration_time<"+"'"+sdf.format(s)+"'";
				}
				sql+=" ORDER BY cus.expiration_time DESC LIMIT ?,?";
				return this.getUserList(sql, curPage, pageSize);
	}
	/**
	 * 
	 * @Description:获取流失用户总数	
	 * @author songyanbiao
	 * @date 2016年8月17日 下午5:25:10
	 * @param
	 * @return
	 */
	@SuppressWarnings("deprecation")
	public int getRunOffUserCount(int siteId,int uId,int pageSize,String startTime,String endTime) throws ParseException{
		SimpleDateFormat sdf =  new SimpleDateFormat("yyyy-MM-dd HH:ss:mm"); 
		String sql="SELECT COUNT(cus.id) FROM t_site_customer_info cus"+			
					" LEFT JOIN t_cloud_site site ON site.id=cus.site_id"+
		 			" LEFT JOIN t_portal_user u ON u.id=cus.portal_user_id ";
		if(siteId==0){
					sql+=" WHERE site.user_id="+uId;
				}else{
					sql+=" WHERE site.id="+siteId;
				}
				sql+=" AND cus.expiration_time<=ADDDATE(NOW(),-14)";
				if(!startTime.equals("")){
					startTime=startTime+" 00:00:00";
					sql+=" AND  cus.expiration_time>"+"'"+startTime+"'";
				}	  
				if(!endTime.equals("")){
					endTime=endTime+" 23:59:59";
					sql+=" AND cus.expiration_time<"+"'"+endTime+"'";
				}
				int pageNum=0;
				try {
					 pageNum =jdbcTemplate.queryForInt(sql);
				} catch (Exception e) {
					log.error("获取流失用户总数出错",e);
				}
				return pageNum;
	}
	/**
	 * 
	 * @Description:获取用户管理各状态列表	
	 * @author songyanbiao
	 * @date 2016年8月18日 上午11:03:45
	 * @param
	 * @return
	 */
	public List<Map<String,Object>> getUserList(String sql,int curPage,int pageSize){
		 String selSql="SELECT COUNT(*) AS allNum,SUM(transaction_amount) AS allMoney, (SELECT transaction_amount FROM t_site_income WHERE site_id=? AND portal_user_id=? ORDER BY create_time DESC LIMIT 0,1 )"+ 
			      " AS transaction_amount FROM t_site_income t WHERE site_id=? AND portal_user_id=?";
		
		 String sql1="SELECT SUM(transaction_amount) AS allmoney,COUNT(id) allnum FROM t_site_income WHERE portal_user_id=? AND site_id=?";
		 String sql2="SELECT transaction_amount FROM t_site_income WHERE portal_user_id=? AND site_id=? ORDER BY create_time DESC LIMIT 0,1";
		List<Map<String, Object>>  ls=new ArrayList<Map<String, Object>>();
		try {
			ls=	jdbcTemplate.queryForList(sql,new Object[]{(curPage-1)*pageSize>0?(curPage-1)*pageSize:0,pageSize});
			if(ls.size()!=0){

				for (int i = 0; i < ls.size(); i++) {
					if(ls.get(i).get("userid") != null){
						List<Map<String, Object>> lsMoney=jdbcTemplate.queryForList(sql1,new Object[]{Integer.valueOf(ls.get(i).get("userid")+""),Integer.valueOf(ls.get(i).get("siteid")+"")});
						if(lsMoney.size()!=0){
							ls.get(i).put("allNum", lsMoney.get(0).get("allnum")==null?0:lsMoney.get(0).get("allnum")+"");
							ls.get(i).put("allMoney", lsMoney.get(0).get("allmoney")==null?0:lsMoney.get(0).get("allmoney")+"");
						}else{
							ls.get(i).put("allNum", "0");
							ls.get(i).put("allMoney", "0");
						}
						List<Map<String, Object>> lastMoney=jdbcTemplate.queryForList(sql2,new Object[]{Integer.valueOf(ls.get(i).get("userid")+""),Integer.valueOf(ls.get(i).get("siteid")+"")});
						if(lastMoney.size()!=0){
							ls.get(i).put("transaction_amount", lastMoney.get(0).get("transaction_amount")==null?0:lastMoney.get(0).get("transaction_amount")+"");
						}else{
							ls.get(i).put("transaction_amount","0");

						}
						if(ls.get(i).get("lock_time")==null){
							ls.get(i).put("isLock", 0);
						}else{
							Date lockTime=(Date) ls.get(i).get("lock_time");
							if((lockTime.getTime()+24*60*60*1000)>new Date().getTime()){
								ls.get(i).put("isLock", 1);
							}else{
								ls.get(i).put("isLock", 0);
							}
						}
					}
				}
			}
		} catch (Exception e) {
			log.error("查询用户状态出错",e);
			return null;
		}
		return ls;
	}
	/**
	 * 
	 * @Description:获取总页数	
	 * @author songyanbiao
	 * @date 2016年8月18日 上午10:54:13
	 * @param
	 * @return
	 */
	public int getTotalNum(int pages,int pageSize){
		return (pages%pageSize)>0?(pages/pageSize+1):(pages/pageSize);
	}
	/**
	 * 
	 * @Description:修改用户离线时间	
	 * @author songyanbiao
	 * @date 2016年8月23日 上午10:08:33
	 * @param
	 * @return
	 */
	public boolean updateUserLogOff(String userName){
		String sql="UPDATE radacct SET acctstoptime =? WHERE username=? AND acctstoptime IS NULL ";
		int i=0;
		try {
			i=jdbcTemplate.update(sql,new Object[]{new Date(),userName});
		} catch (Exception e) {
			log.error("修改用户离线时间出错",e);
		}
		return i>0?true:false;
	}
	
	public int getRunOffCount(int siteId,String startTime,String endTime){
		 String sql="SELECT count(cus.id) FROM t_site_customer_info cus"+
					" LEFT JOIN t_cloud_site site ON site.id=cus.site_id"+
		 			" LEFT JOIN t_portal_user u ON u.id=cus.portal_user_id"+
					" WHERE site.id="+siteId+
					" AND cus.expiration_time<=ADDDATE(NOW(),-14)"+
					" AND  cus.expiration_time>"+"'"+startTime+"'"+
					" AND cus.expiration_time<"+"'"+endTime+"'";
		 return jdbcTemplate.queryForInt(sql);
	}
	
	public List<ChurnUserBean> exportExcel(int siteId,String startTime,String endTime,int curPage,int pageSize) throws ParseException{
		List<Map<String, Object>>  ls=new ArrayList<Map<String, Object>>();
		List<ChurnUserBean> list =new ArrayList<ChurnUserBean>();  
		startTime=startTime+" 00:00:00";
		endTime=endTime+" 23:59:59";
		 String sql="SELECT u.user_name,cus.portal_user_id userid,cus.site_id siteid,cus.expiration_time,site.site_name FROM t_site_customer_info cus"+
					" LEFT JOIN t_cloud_site site ON site.id=cus.site_id"+
		 			" LEFT JOIN t_portal_user u ON u.id=cus.portal_user_id"+
					" WHERE site.id="+siteId+
					" AND cus.expiration_time<=ADDDATE(NOW(),-14)"+
					" AND  cus.expiration_time>"+"'"+startTime+"'"+
					" AND cus.expiration_time<"+"'"+endTime+"'"+
					" ORDER BY cus.expiration_time DESC limit ?,?";
				try {
					ls=	jdbcTemplate.queryForList(sql,new Object[]{(curPage-1)*pageSize,pageSize});
				} catch (Exception e) {
					log.error("查询用户状态出错",e);
				}
				if(ls.size()!=0){
					for (int i = 0; i < ls.size(); i++) {
						ChurnUserBean cu = new ChurnUserBean();
						cu.setPortal_user_name(ls.get(i).get("user_name")+"");
						cu.setExpiration_time(ls.get(i).get("expiration_time")+"");
						cu.setSite_name(ls.get(i).get("site_name")+"");
						list.add(cu);
					}
				}
			return list;
	}
	
	/**
	 * @Description  插入短信记录
	 * @date 2017年1月5日下午4:10:04
	 * @author guoyingjie
	 * @param username--注册这账号
	 * @param templet--短信模板
	 * @param msgtext--短信描述,是注册还是忘记密码
	 */
	public void updateOrInsertMsg(String username,String templet,String msgtext,HttpServletRequest request){
		try {
			MsgLog logs = new MsgLog();
			logs.setAddIp(FengKongUtil.getIpAddr(request));
			logs.setMsgId(new String(Base64Utils.decodeFromString(templet)));
			logs.setMsgText(msgtext);
			logs.setUserName(username);
			logs.setCreateTime(new Timestamp(new Date().getTime()));
			nutDao.insert(logs);
		} catch (Exception e) {
			log.error(this.getClass().getCanonicalName());
		}
	}
	/**
	 * 新版本解锁所需要的操作
	 * @param userName
	 * @return
	 */
	public boolean unLock(String userName){
		String sql="DELETE FROM radacct WHERE username=?";
		int i=jdbcTemplate.update(sql, new Object[]{userName});
		return i>0?true:false;
	}
	
	public int getCountUserDeviceInfo(int siteId) {
		String getSql1 = "SELECT COUNT(a.id) AS num FROM (SELECT * FROM t_user_device_info WHERE site_id=? GROUP BY mac) AS a";
		String getSql2 = "SELECT COUNT(a.id) AS num FROM (SELECT * FROM t_user_device_info GROUP BY mac) AS a";
		if(siteId > 0){
			return jdbcTemplate.queryForInt(getSql1,siteId);
		}else{
			return jdbcTemplate.queryForInt(getSql2);
		}
	}
	public static void main(String[] args) {
		System.out.println(MD5.encode("QAZwsx123.,").toLowerCase());
		String newPw=SHA256.getUserPassword("15661959697",MD5.encode("123456").toLowerCase());
//		String newPw=SHA256.getUserPassword("15972935811",MD5.encode("QAZwsx123.,").toLowerCase());
		System.out.println(newPw);
		
		System.out.println(Long.parseLong("12"));
	}
	
}
