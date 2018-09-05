package com.fxwx.service.impl;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.log4j.Logger;
import org.nutz.dao.Cnd;
import org.nutz.dao.Dao;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import com.fxwx.entity.CloudInfo;
import com.fxwx.entity.CloudSite;
import com.fxwx.entity.CloudUser;
import com.fxwx.entity.UserBankInfo;
import com.fxwx.entity.UserWithdrawInfo;


/**
 * @ToDoWhat 
 * @author xmm
 */
@Service
public class PersonalCenterServiceImpl {
	
	private static Logger log=Logger.getLogger(PersonalCenterServiceImpl.class);
	
	@Resource(name="jdbcTemplate")
	private JdbcTemplate jdbcTemplate;
	@Resource(name="nutDao")
	private Dao nutDao;
	
	/**
	 * 获得用户提现的手机号
	 * @param userId 用户id
	 * @return
	 */
	public UserWithdrawInfo getUserWithdrawInfo(int userId){
		UserWithdrawInfo userWithdrawInfo=nutDao.fetch(UserWithdrawInfo.class,Cnd.where("user_id","=",userId));
			
		return userWithdrawInfo;
	}
	/**
	 * 获得用户的提现银行账号
	 * @param userId 用户id
	 * @return
	 */
	public List<String> getUserBankInfo(int userId){
		
		String sql="SELECT bankcar_num FROM t_user_bank_info WHERE user_id=? and state=0";
		List<String> ls=jdbcTemplate.queryForList(sql,new Object[]{userId},String.class);
		return ls;
	}
	/**
	 * 修改用户账号密码
	 * @param id
	 * @param telephne  用户账号
	 * @return
	 */
	public int updateUserName(int id,String telephne,String passWord){
		CloudUser cloudUser=nutDao.fetch(CloudUser.class,Cnd.where("id","=",id));
		cloudUser.setUserName(telephne);
		cloudUser.setPassWord(passWord);
		try {
			nutDao.update(cloudUser);
			
			return 1;
		} catch (Exception e) {
			return 0;
		}
	}
	/**
	 * 查询用户
	 * @param telephne
	 * @return
	 */
	public CloudUser selCloudUser(String telephne){
		CloudUser user=nutDao.fetch(CloudUser.class,Cnd.where("user_name","=",telephne));
		return user;
	}
	/**
	 * 
	 * @param id 用户id
	 * @param phone 提款手机号
	 * @return
	 */
	public int updateAccountPhone(int id, String phone){
		try {
			
			UserWithdrawInfo uwInfo=nutDao.fetch(UserWithdrawInfo.class,Cnd.where("user_id","=",id));
			if(uwInfo==null){//添加記錄	
				UserWithdrawInfo u=new UserWithdrawInfo();
				u.setFrozenMonery(new BigDecimal("0.0000"));
				u.setWithdrawMonery(new BigDecimal("0.0000"));
				u.setUserId(id);
				u.setCreateTime(new Date());
				u.setWithdrawPhone(phone);
				nutDao.insert(u);
			}else{
				
				uwInfo.setWithdrawPhone(phone);
				nutDao.update(uwInfo);
			}
			return 1;
		} catch (Exception e) {
			return 0;
		}
	}
	/**
	 * 添加银行卡
	 * @param u
	 * @return
	 */
	public int addBnakCard(UserBankInfo u){
		try{
			nutDao.insert(u);
			return 1;
		}catch(Exception e){
			log.error("添加银行卡失败", e);
			return 0;
		}
	}
	/**
	 * 查询银行卡信息表里是否存在这条记录
	 * @param bankCardNum
	 * @param accountName
	 * @return
	 */
	public UserBankInfo selByCardAndName(String bankCardNum,int id){
		UserBankInfo u = null;
		try {
			u = nutDao.fetch(UserBankInfo.class, Cnd.where("user_id","=",id).and("bankcar_num","=",bankCardNum));
		} catch (Exception e) {
			log.error("查询银行卡信息表里是否存在这条记录");
		}
		return u;
	}
	
	/**
	 * 查询银行卡信息表里是否存在这条记录
	 * @param bankCardNum
	 * @param accountName
	 * @return
	 */
	public UserBankInfo getByCardAndName(String bankCardNum,int userId){
		UserBankInfo u = null;
		try {
			u = nutDao.fetch(UserBankInfo.class, Cnd.where("user_id","=",userId).and("bankcar_num","=",bankCardNum).and("state", "=","0"));
		} catch (Exception e) {
			log.error("查询银行卡信息表里是否存在这条记录");
		}
		return u;
	}
	
	/**
	 * 删除银行卡信息表的一条数据记录 做伪删除,以防止提现记录日志的不准确性
	 * @param u
	 * @return
	 */
	public int delUserBankInfo(UserBankInfo u){
		int i=nutDao.update(u);
		if(i==1){
			return 1;
		}else{
			return 0;
		}
	}
	/**
	 * @Description  根据用户id查找用户详细信息
	 * @date 2016年8月25日上午10:52:30
	 * @author guoyingjie
	 * @param userId
	 * @return
	 */
    public CloudInfo getCloudInfoByUserId(int userId){
    	CloudInfo info = null;
    	try {
			info = nutDao.fetch(CloudInfo.class, Cnd.where("user_id","=",userId));
		} catch (Exception e) {
			log.error(" 根据用户id查找用户详细信息异常");
		}
    	return info;
    }
    
    /**
     * @Description  查找用户详细信息异常
     * @date 2016年8月25日上午11:51:34
     * @author guoyingjie
     * @param userId
     * @return
     */
    public List<Map<String,Object>> getCloudInfoAndPhone(int userId){
    	List<Map<String,Object>> list = null;
    	try {
    		String sql = "SELECT c.id,c.user_name,c.pass_word,u.img,u.real_name,u.company,u.telephone,u.email,u.address,u.support_tel,c.withdraw_phone FROM t_cloud_user  c LEFT JOIN t_cloud_userinfo u on c.id=u.user_id where c.id=?";
    		list = jdbcTemplate.queryForList(sql,new Object[]{userId});
		} catch (Exception e) {
			log.error("查找用户详细信息异常");
		}
    	return list;
    }
    /**
     * @Description 通过用户id查找归属的银行卡信息
     * @date 2016年8月25日下午1:24:53
     * @author guoyingjie
     * @param userId
     */
    public List<UserBankInfo>  getBandInfoByUserId(int userId){
    	List<UserBankInfo> list = null;
    	try {
			list = nutDao.query(UserBankInfo.class, Cnd.where("user_id","=",userId).and("state","=","0").asc("dstate").desc("create_time"));
		} catch (Exception e) {
			log.error("通过用户id查找归属的银行卡信息异常");
		}
    	return list;
    }
    
    /**
     * @Description  修改用户信息
     * @date 2016年8月25日下午2:33:44
     * @author guoyingjie
     * @param info
     */
    public void updateUserInfo(CloudInfo info,int state){
    	if(state==1){
    		nutDao.update(info);
    	}else{
    		nutDao.insert(info);
    	}
    }
    
    /**
     * @Description  更改用户提现手机号
     * @date 2016年8月25日下午3:32:58
     * @author guoyingjie
     * @param user
     */
    public void updateCloudUser(CloudUser user){
    	nutDao.update(user);
    }
    
    /**
     * @Description  检测是否有默认的银行卡(只有一个默认的银行卡)
     * @date 2016年8月25日下午4:40:27
     * @author guoyingjie
     * @param userId
     * @return
     */
    public UserBankInfo checkDefaultBank(int userId,int bankId){
    	UserBankInfo user = null;
    	try {
    		if(bankId==-1){
    			user = nutDao.fetch(UserBankInfo.class, Cnd.where("dstate", "=", "0"));
    		}else{
    			user = nutDao.fetch(UserBankInfo.class, Cnd.where("user_id","=",userId).and("id", "=",bankId));
    		}
		} catch (Exception e) {
			log.error("检测是否有默认的银行卡异常");
		}
    	return user;
    }
    
    /**
     * @Description  修改默认的银行卡
     * @date 2016年8月25日下午4:46:32
     * @author guoyingjie
     * @param userId
     * @param bankId
     */
    public void changeDefaultBank(int userId,int bankId){
    	
    	String sql = "UPDATE t_user_bank_info SET dstate = 1 where user_id = ?";
    	jdbcTemplate.update(sql,new Object[]{userId});
    	
    	String usql = "UPDATE t_user_bank_info SET dstate = 0 where user_id =? and id = ?";
    	jdbcTemplate.update(usql,new Object[]{userId,bankId});
    	 
    }
    
    /**
     * @Description  删除银行卡
     * @date 2016年8月25日下午5:55:18
     * @author guoyingjie
     * @param userId
     * @param bankId
     */
    public void deleteBand(int userId,int bankId){
    	UserBankInfo user = this.checkDefaultBank(userId, bankId);
    	if(user!=null){
    		user.setUserId(userId);
    		user.setState(1);
    		nutDao.update(user);
    	}
    }
    
    /**
     * @Description  添加银行卡或者支付包
     * @date 2016年8月25日下午7:45:14
     * @author guoyingjie
     * @param userId
     * @param state---1(支付宝) 反正银行卡
     * @param usName
     * @param usCard
     * @param uskhAds
     * @param uszhName
     */
    public void insertBankAndZhi(int userId,int state,String usName,String usCard,String uskhAds,String uszhName){
    	UserBankInfo b = new UserBankInfo();
    	if(state==1){
    		b.setUserId(userId);
    		b.setAccountName(usName);
    		b.setBankcarNum(usCard);
    		b.setBankDeposit("");
    		b.setBranchName("");
    		b.setCreateTime(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date()));
    		b.setDstate(1);
    		nutDao.insert(b);
    	}else{
    		b.setUserId(userId);
    		b.setAccountName(usName);
    		b.setBankcarNum(usCard);
    		b.setBankDeposit(uskhAds);
    		b.setBranchName(uszhName);
    		b.setCreateTime(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date()));
    		b.setDstate(1);
    		nutDao.insert(b);
    	}
    	
    	
    }
    /**
     * 更改用户场所技术支持电话
     * @author songyb
     * @2017年5月25日
     */
    public boolean updateSiteAdmin(int userId,String adminTel){
    	String sql = "UPDATE t_cloud_site SET site_admin = ? where user_id = ?";
    	int i=jdbcTemplate.update(sql,new Object[]{adminTel,userId});
    	return i>0?true:false;
    }
}
