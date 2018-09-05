package com.fxwx.service.impl;
import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import javax.annotation.Resource;
import org.apache.log4j.Logger;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import com.fxwx.bean.UserInfoBean;
import com.fxwx.util.ExecuteResult;
import com.fxwx.util.InitContext;

@Service
public class SiteCustomerServiceImpl {
	
	private static Logger log=Logger.getLogger(SiteCustomerServiceImpl.class);
	
	@Resource(name="jdbcTemplate")
	private JdbcTemplate jdbcTemplate;
	
	

	/**
	 * 获取用户列表
	 * @param userId 当前登录用户
	 * @param siteId  场所id,若要查询某个单一场所的所有用户则为该参数设置，否则传递零即可，零显示的是当前登录用户的所有场所
	 * @param username
	 * @param curPage
	 * @param pageSize
	 * @return
	 */
	public List<UserInfoBean> getUserInfoList(int userId, int siteId, String username, int curPage, int pageSize){
		
		List<Map<String,Object>> list = null;
		 List<UserInfoBean> ls=new ArrayList<UserInfoBean>();
		StringBuffer sql = new StringBuffer("");
		sql.append("select expiration_time,s.create_time,s.portal_user_id,s.site_id,user_name ,c.site_name from t_cloud_site c INNER JOIN t_site_customer_info  s ON c.id=s.site_id ");
        sql.append( "LEFT JOIN t_portal_user p on s.portal_user_id=p.id ");
		sql.append(" where  user_id=").append(userId);
		
		if(siteId !=0){//如果存在场所id参数，则代表用户是要查询某个场所的注册用户数据
			sql.append(" and c.id=").append(siteId);
		}
		//如果username参数存在值则表示是按用户名精确查询
		if(!"".equals(username) && username!=null){
			sql.append(" and p.user_name like ").append("'%"+username+"%'");
		}
		sql.append(" order by create_time desc");
		try{
			if(!"".equals(username) && username!=null){
			//查询到非统计的数据
				list=getPageNationByNameResultList(sql.toString(), curPage, pageSize);
			}else{
				list=getPageNationResultList(sql.toString(),curPage,pageSize);
			}
			SimpleDateFormat sdf =   new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			//查询统计数据，并从ab中获取List集合便利并更新统计数据
			for(int i=0;i< list.size(); i++){
				 String expiration_time = list.get(i).get("expiration_time")+"";
				 String create_time = list.get(i).get("create_time")+"";
				 String site_name = list.get(i).get("site_name")+"";
				 String user_name = list.get(i).get("user_name")+"";
				 String site_id=list.get(i).get("site_id")+"";
				//用username作为检索最后支付金额和总消费金额的条件
				UserInfoBean uib = new UserInfoBean();
				uib.setExpirationTime(sdf.parse(expiration_time));
				uib.setCreateTime(sdf.parse(create_time));
				uib.setSiteName(site_name);
				uib.setUserName(user_name);
			    //查询最后一次消费的金额,并更新view bean
				String oneSql="";
				List<Map<String, Object>> result=null;
				if(siteId !=0){//如果存在场所id参数，则代表用户是要查询某个场所的注册用户数据

					 oneSql = "SELECT transaction_amount from t_site_income WHERE portal_user_name="+user_name+" AND site_id="+siteId+" order  by create_time desc limit 0,1";
					 result =  jdbcTemplate.queryForList(oneSql);//.get("transaction_amount");
				}else{
					 oneSql ="SELECT transaction_amount from t_site_income WHERE portal_user_name="+user_name+" AND site_id="+site_id+" order  by create_time desc limit 0,1";
					 result =  jdbcTemplate.queryForList(oneSql);//.get("transaction_amount");
				}
				if(result.size() != 0){//uib 更新数据
					Object amountObj = result.get(0).get("transaction_amount");
					uib.setTransactionAmount((BigDecimal)amountObj);
				
				}
				//查询消费总金额,并更新view bean
				String countSql="";
				List<Map<String, Object>> result2= new ArrayList<Map<String, Object>>();
				if(siteId !=0){//如果存在场所id参数，则代表用户是要查询某个场所的注册用户数据
					
					countSql = "select sum(transaction_amount) as amount_count from t_site_income where portal_user_name=" + user_name + " and site_id="+siteId;
					result2 =  jdbcTemplate.queryForList(countSql);
				}else{
					countSql =  "select sum(transaction_amount) as amount_count from t_site_income where portal_user_name=" + user_name + " and site_id="+site_id;
					result2 =  jdbcTemplate.queryForList(countSql);
				}
				
				
				if(result2.size() != 0){//uib 更新数据
					Object amountCount =  jdbcTemplate.queryForMap(countSql).get("amount_count");
					uib.setCountAmount((BigDecimal)amountCount);
				
				}
				ls.add(uib);
			}
		}catch (Exception e) {
			log.error("getUserRouterList---"+sql, e);	        
	        return ls;
	    }
		return  ls;
	}
	
	
	
	/**
	 * 获取分页
	 * @param us 数据库持久化实现类
	 * @param sqlStr sql查询语句，条件用？替代
	 * @param pageNum 页面提交的页码数
	 * @param pageSize 页面提交的每页记录数
	 * @return
	 * @throws Exception
	 */
	public List<Map<String, Object>> getPageNationResultList(String sqlStr,int pageNum,int pageSize) throws Exception{
//		int totalNum=jdbcTemplate.queryForInt(getTotalRecordSQL(sqlStr));//get totalNum
		int totalNum=0;
		List<Map<String, Object>> lm=jdbcTemplate.queryForList(getTotalRecordSQL(sqlStr));//get totalNum
		if(lm.size()!=0&&lm.get(0).get("totalNum")!=null){totalNum=Integer.parseInt(lm.get(0).get("totalNum")+"");}
		
		pageNum=pageNum<1?1:pageNum;
		int totalPageNum=(totalNum%pageSize)>0?(totalNum/pageSize+1):totalNum/pageSize;
		pageNum=(pageNum>totalPageNum)?totalPageNum:pageNum;
		List<Map<String, Object>> ls=jdbcTemplate.queryForList(getPagingSQL(sqlStr,pageNum,pageSize));
		return ls;
	}
	
	/**
	 * 带参数查询
	 * @param jdbcTemplate
	 * @param params
	 * @param rm
	 * @param sqlStr
	 * @param pageNum
	 * @param pageSize
	 * @return
	 * @throws Exception
//	 */
	public List<Map<String, Object>> getPageNationByNameResultList(String sqlStr,int pageNum,int pageSize) throws Exception{
//		int totalNum=jdbcTemplate.queryForInt(getTotalRecordSQL(sqlStr),params);//get totalNum
		int totalNum=0;
		
		List<Map<String, Object>> lm=jdbcTemplate.queryForList(getTotalRecordSQL(sqlStr));//get totalNum
		
		if(lm.size()!=0&&lm.get(0).get("totalNum")!=null){totalNum=Integer.parseInt(lm.get(0).get("totalNum")+"");}
		
		pageNum=pageNum<1?1:pageNum;
		int totalPageNum=(totalNum%pageSize)>0?(totalNum/pageSize+1):totalNum/pageSize;
		pageNum=(pageNum>totalPageNum)?totalPageNum:pageNum;
		List<Map<String, Object>> ls=jdbcTemplate.queryForList(getPagingSQL(sqlStr,pageNum,pageSize));
		
		return ls;
	}
	
	

	/**获取总记录数
	 * @param sql
	 * @return
	 */
	public String getTotalRecordSQL(String sql){
		return "select sum(1) totalNum from("+sql+") Tname";
	}
	
	/**
	 * 获取分页sql语句
	 * @param sql
	 * @param pageNum
	 * @param pageSize
	 * @return
	 */
	public String getPagingSQL(String sql,int pageNum,int pageSize){
		pageNum=(pageNum-1)<0?0:(pageNum-1);
		return "select Tname.* from ("+sql+") Tname limit "+pageNum*pageSize+","+pageSize;
	}
	/**
	 * 获取总页数
	 * @param userId
	 * @param siteId
	 * @param username
	 * @param pageNum
	 * @param pageSize
	 * @return
	 */
	public int getSiteNum(int userId, int siteId, String username, int pageSize){
	
		StringBuffer sql = new StringBuffer("");
		sql.append("select expiration_time,s.create_time,s.portal_user_id,user_name ,c.site_name from t_cloud_site c INNER JOIN t_site_customer_info  s ON c.id=s.site_id ");
        sql.append( "LEFT JOIN t_portal_user p on s.portal_user_id=p.id ");
		sql.append(" where  user_id=").append(userId);
		
		if(siteId !=0){//如果存在场所id参数，则代表用户是要查询某个场所的注册用户数据
			sql.append(" and c.id=").append(siteId);
		}
		//如果username参数存在值则表示是按用户名精确查询
		if(!"".equals(username) && username!=null){
			sql.append(" and p.user_name like").append("'%"+username+"%'");
		}
		int totalNum=0;
		List<Map<String, Object>> lm=jdbcTemplate.queryForList(getTotalRecordSQL(sql.toString()));//get totalNum
		if(lm.size()!=0&&lm.get(0).get("totalNum")!=null){totalNum=Integer.parseInt(lm.get(0).get("totalNum")+"");}
		int totalPageNum=(totalNum%pageSize)>0?(totalNum/pageSize+1):totalNum/pageSize;
		return totalPageNum;
	}
	
	
	public static void main(String[] args) {
		ExecuteResult result=new ExecuteResult();
		result.setCode(200);

		InitContext.init();
		SiteCustomerServiceImpl scisi=InitContext.getBean("siteCustomerInfoServiceImpl", SiteCustomerServiceImpl.class);
		result.setData(scisi.getUserInfoList(1, 0,"",0, 5));
		System.out.println(result.toJsonString());
    }
}
