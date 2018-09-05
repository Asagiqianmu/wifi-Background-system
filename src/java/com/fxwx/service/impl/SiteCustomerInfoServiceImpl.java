package com.fxwx.service.impl;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;
import org.nutz.dao.Cnd;
import org.nutz.dao.Dao;
import org.nutz.dao.Sqls;
import org.nutz.dao.sql.Sql;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.simple.ParameterizedBeanPropertyRowMapper;
import org.springframework.stereotype.Service;

import com.fxwx.bean.AjaxPageBean;
import com.fxwx.bean.ChurnUserBean;
import com.fxwx.bean.UserInfoBean;
import com.fxwx.bean.userDataBean;
import com.fxwx.entity.CloudSite;
import com.fxwx.entity.SiteCustomerInfo;
import com.fxwx.entity.SitePriceConfig;
import com.fxwx.entity.UserTotalTimeHave;
import com.fxwx.util.ExecuteResult;
import com.fxwx.util.PagingFactory;

@Service
public class SiteCustomerInfoServiceImpl {
	
	private  Logger log=Logger.getLogger(SiteCustomerInfoServiceImpl.class);
	
	@Resource(name="jdbcTemplate")
	private  JdbcTemplate jdbcTemplate;
	
	@Resource(name="nutDao")
	private Dao nutDao;

	/**
	 * 获取用户列表
	 * @param userId 当前登录用户
	 * @param siteId  场所id,若要查询某个单一场所的所有用户则为该参数设置，否则传递零即可，零显示的是当前登录用户的所有场所
	 * @param username
	 * @param curPage
	 * @param pageSize
	 * @return
	 */
	public AjaxPageBean getUserInfoList(int userId, int siteId, String username, int curPage, int pageSize){
		
		AjaxPageBean ab=null;
		StringBuffer sql = new StringBuffer("");
		sql.append("select expiration_time,s.create_time,s.portal_user_id,user_name ,c.site_name from t_cloud_site c INNER JOIN t_site_customer_info  s ON c.id=s.site_id ");
        sql.append( "LEFT JOIN t_portal_user p on s.portal_user_id=p.id ");
		sql.append(" where  user_id=").append(userId);
		
		if(siteId !=0){//如果存在场所id参数，则代表用户是要查询某个场所的注册用户数据
			sql.append(" and c.id=").append(siteId);
		}
		//如果username参数存在值则表示是按用户名精确查询
		if(!"".equals(username) && username!=null){
			sql.append(" and p.user_name=? ");//.append("'"+username+"'");
		}
		
		//sql.append(" limit ").append(curPage).append(",").append(pageSize);
		try{
			if(!"".equals(username) && username!=null){
			//查询到非统计的数据
				ab=PagingFactory.getPageNationResultList(jdbcTemplate,new Object[]{username},new BeanPropertyRowMapper<UserInfoBean>(UserInfoBean.class), sql.toString(), curPage, pageSize);
			}else
			ab=PagingFactory.getPageNationResultList(jdbcTemplate,new BeanPropertyRowMapper<UserInfoBean>(UserInfoBean.class), sql.toString(), curPage, pageSize);

			
			
			//查询统计数据，并从ab中获取List集合便利并更新统计数据
			for(int i=0;i< ab.getData().size(); i++){
				
				//用username作为检索最后支付金额和总消费金额的条件
				UserInfoBean uib = (UserInfoBean)ab.getData().get(i);
				String un = uib.getUserName();
				
			    //查询最后一次消费的金额,并更新view bean
				String oneSql = "select transaction_amount from t_site_income  where portal_user_name='" + un + "' order  by create_time desc limit 0,1";
				List<Map<String, Object>> result =  jdbcTemplate.queryForList(oneSql);//.get("transaction_amount");

				
				if(result.size() != 0){//uib 更新数据
					Object amountObj = result.get(0).get("transaction_amount");
					uib.setTransactionAmount((BigDecimal)amountObj);
				
				}
				
				//查询消费总金额,并更新view bean
				String countSql = "select sum(transaction_amount) as amount_count from t_site_income where portal_user_name='" + un + "'";
				List<Map<String, Object>> result2 =  jdbcTemplate.queryForList(oneSql);

				
				if(result2.size() != 0){//uib 更新数据
					Object amountCount =  jdbcTemplate.queryForMap(countSql).get("amount_count");
					uib.setCountAmount((BigDecimal)amountCount);
				
				}

			}
		}catch (Exception e) {
			log.error("getUserRouterList---"+sql, e);	        
	        return ab;
	    }
		return ab;
	}
	
	////////////////////////////////////////////
	
	
	//查询该场所下所有非停用的套餐规则
		public List<Map<String, Object>> getChargeNumber(int id){
			String sql="SELECT * FROM t_site_price_config WHERE site_id=? AND is_stoped=0 AND comboNumber is NOT NULL";
			List<Map<String, Object>> list=jdbcTemplate.queryForList(sql, new Object[]{id});
			
			return list;
		}
		//查询该场所下所有非停用的非融合套餐规则
		public List<Map<String, Object>> getCommonNumber(int id){
			String sql="SELECT * FROM t_site_price_config WHERE site_id=? AND is_stoped=0 AND comboNumber is  NULL";
			List<Map<String, Object>> list=jdbcTemplate.queryForList(sql, new Object[]{id});
			return list;
		}
	
		public List<SitePriceConfig> SitePriceConfigAll(int siteid,int chargeType){
			return  nutDao.query(SitePriceConfig.class,Cnd.where("site_id","=",siteid).and("is_stoped","=","0").and("charge_type","=",chargeType).asc("price_type"));
		}
		public SitePriceConfig getSitePriceConfig(int siteid,String chargeType){
			
			return  nutDao.fetch(SitePriceConfig.class,Cnd.where("site_id","=",siteid).and("is_stoped","=","0").and("id","=",chargeType).asc("price_type"));
		}
	
	/*********************************************新的查新计费规则****************************************************/
	

		/**
		 * 根据路由器Mac设置该路由所隶属场所的价格信息到seesion中，用以将价格信息传递到缴费页面
		 * 
		 * @param id
		 *            路由器Mac
		 * @param chargeType
		 *            用来表示是否是融合套餐计费规则(0,表示普通计费，1表示套餐计费)
		 * @param isSerchSite
		 *            是否查询site信息，
		 * @param session
		 */
		/*public SitePriceConfigAll setPriceToSession(CloudSite site,
				String chargeType) {
			// 根据路由Mac获得场所信息
			// 根据场所信息获得场所关联价格信息
			SitePriceConfigAll siteConfigAll = new SitePriceConfigAll();
			siteConfigAll.setSiteInof(site);
			List<SitePriceConfig> spcList = new ArrayList<SitePriceConfig>();
			Set<String> nameSet = new HashSet<String>();
			if ("0".equals(chargeType)) {
				spcList = siteservice.SitePriceConfigAll(site.getId(), 0);// 使用普通计费规则，
			} else {
				for (int i = 0; i < chargeType.split(",").length; i++) {
					nameSet.add(chargeType.split(",")[i]);
				}
				for (String chargeId : nameSet) {
					SitePriceConfig sitePriceConfig = siteservice
							.getSitePriceConfig(site.getId(), chargeId);
					if (sitePriceConfig != null) {

						spcList.add(sitePriceConfig);
					}
				}
			}
			for (int i = 0; i < spcList.size() - 1; i++) {
				for (int j = 1; j < spcList.size() - i; j++) {
					SitePriceConfig a;
					if ((spcList.get(j - 1)).getPrice_type() > (spcList.get(j)
							.getPrice_type())) { // 比较两个整数的大小

						a = spcList.get(j - 1);
						spcList.set((j - 1), spcList.get(j));
						spcList.set(j, a);
					}
				}
			}
			// 将价格信息存放至session中
			siteConfigAll.setList(spcList);
			return siteConfigAll;// 添加场所所有收费规则session
		}

		*//**
		 * @Description 获得场所下的全部的消费配置
		 * @param siteId
		 * @param portalId
		 * @return
		 *//*
		public SitePriceConfigAll getSitePriceConfigAll(int siteId, int portalId) {
			SitePriceConfigAll siteAll = null;
			try {
				// 查询改场所下所有非停用的融合套餐规则
				List<Map<String, Object>> chargeList = getIsActiveRule(siteId);
				// 查询改场所下所有非停用的非融合套餐规则
				List<Map<String, Object>> commonList = getNotActiveRule(siteId);
				// 根据userId 获取PortalUser对象
				PortalUser portal = getPortalUserById(portalId);
				// 根据场所id获得场所信息
				CloudSite site = findCloudSite(siteId);
				// 用户有费时,续费时获取缴费类型
				String chargeType = accordTel(chargeList, commonList,
						portal.getUserName());
				// 根据路由器Mac设置该路由所隶属场所的价格信息到seesion中，用以将价格信息传递到缴费页面
				siteAll = setPriceToSession(site, chargeType);
			} catch (Exception e) {
				log.error(this.getClass().getCanonicalName()
						+ "===getSitePriceConfigAll", e);
				return null;
			}
			return siteAll;

		}
*/
		
		
		
		
	/*********************************************新的查新计费规则stop****************************************************/

	
	////////////////////////////////////////////
	
	
	/**
	 * 获取指定场所下的指定用户的过期时间
	 * @param siteId
	 * @param username
	 * @return
	 */
	public SiteCustomerInfo getExpirationTime(int siteId,int userId){
		SiteCustomerInfo cui = nutDao.fetch(SiteCustomerInfo.class, Cnd.where("portal_user_id","=",userId).and("site_id","=",siteId));
		return cui;
	}
	/**
	 * 
	 * @Description:停用场所下的该用户	
	 * @author songyanbiao
	 * @date 2016年8月23日 上午11:03:06
	 * @param
	 * @return
	 */
	public boolean updateUserStop(SiteCustomerInfo cus,int status){
		cus.setIsTry(status);
		return nutDao.update(cus)>0? true:false;
	}
	/**
	 * siteId = -1 则表示前端没有传入siteId的值,默认值为-1,表示执行全部场所,反之执行单一场所
	 * @param siteId
	 * @param startTime
	 * @param endTime
	 * @param state
	 * @return
	 */
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public List<ChurnUserBean> getChurnUserList(String siteId,String startTime,String endTime,Integer userId, int curPage, int pageSize){
		long s = System.currentTimeMillis();
		System.out.println("开始时间 ： "+s);
		AjaxPageBean  ap = null;
		if("-1".equals(siteId)){
			if(startTime!=null&&!("".equals(startTime))&&endTime!=null&&!("".equals(endTime))){
				StringBuffer sb = new StringBuffer();
				sb.append("SELECT d.portal_user_name,expiration_time,d.transaction_amount,SUM(d.transaction_amount) total,COUNT(d.portal_user_id) count,site_name FROM (");
				sb.append("SELECT transaction_amount,site_id,portal_user_id,portal_user_name FROM t_site_income WHERE site_id in (SELECT id FROM t_cloud_site WHERE user_id=?) ) d LEFT  JOIN (");
				sb.append("SELECT  c.site_name,m.site_id,m.portal_user_id,m.expiration_time FROM t_cloud_site c RIGHT JOIN (");
				sb.append("SELECT site_id,portal_user_id,expiration_time from t_site_customer_info WHERE expiration_time  < date_sub(now(),interval 14 day)) m  ON c.id = m.site_id");
				sb.append(") k ON d.portal_user_id = k.portal_user_id where k.site_id in (SELECT id FROM t_cloud_site WHERE user_id=?) AND expiration_time BETWEEN ? AND ? GROUP BY k.portal_user_id ORDER BY expiration_time DESC");
				System.out.println(sb.toString());
				try {
					ap=PagingFactory.getPageNationResultList(jdbcTemplate,new Object[]{userId,userId,startTime+" 00:00:00",endTime+" 23:59:59"},new BeanPropertyRowMapper<ChurnUserBean>(ChurnUserBean.class), sb.toString(), curPage, pageSize);
				} catch (Exception e) {
					e.printStackTrace();
					ap.setCode(201);
				}
				 
			}else{
				StringBuffer sb = new StringBuffer();
				sb.append("SELECT d.portal_user_name,expiration_time,d.transaction_amount,SUM(d.transaction_amount) total,COUNT(d.portal_user_id) count,site_name FROM (");
				sb.append("SELECT transaction_amount,site_id,portal_user_id,portal_user_name FROM t_site_income WHERE site_id  in (SELECT id FROM t_cloud_site WHERE user_id=?) ) d LEFT  JOIN (");
				sb.append("SELECT  c.site_name,m.site_id,m.portal_user_id,m.expiration_time FROM t_cloud_site c RIGHT JOIN (");
				sb.append("SELECT site_id,portal_user_id,expiration_time from t_site_customer_info WHERE expiration_time  < date_sub(now(),interval 14 day)) m  ON c.id = m.site_id");
				sb.append(") k ON d.portal_user_id = k.portal_user_id where k.site_id in (SELECT id FROM t_cloud_site WHERE user_id=?)  GROUP BY k.portal_user_id ORDER BY expiration_time DESC");
				try {
					ap=PagingFactory.getPageNationResultList(jdbcTemplate,new Object[]{userId,userId},new BeanPropertyRowMapper<ChurnUserBean>(ChurnUserBean.class), sb.toString(), curPage, pageSize);
				} catch (Exception e) {
					e.printStackTrace();
					ap.setCode(201);
				}
			}
			
		}else{
				if(startTime!=null&&!("".equals(startTime))&&endTime!=null&&!("".equals(endTime))){
					StringBuffer sb = new StringBuffer();
					sb.append("SELECT d.portal_user_name,expiration_time,d.transaction_amount,SUM(d.transaction_amount) total,COUNT(d.portal_user_id) count,site_name FROM (");
					sb.append("SELECT transaction_amount,site_id,portal_user_id,portal_user_name FROM t_site_income WHERE site_id=? ) d LEFT  JOIN (");
					sb.append("SELECT  c.site_name,m.site_id,m.portal_user_id,m.expiration_time FROM t_cloud_site c RIGHT JOIN (");
					sb.append("SELECT site_id,portal_user_id,expiration_time from t_site_customer_info WHERE expiration_time  < date_sub(now(),interval 14 day)) m  ON c.id = m.site_id");
					sb.append(") k ON d.portal_user_id = k.portal_user_id where k.site_id =? AND expiration_time BETWEEN ? AND ? GROUP BY k.portal_user_id ORDER BY expiration_time DESC");
					try {
						ap=PagingFactory.getPageNationResultList(jdbcTemplate,new Object[]{siteId,siteId,startTime+" 00:00:00",endTime+" 23:59:59"},new BeanPropertyRowMapper<ChurnUserBean>(ChurnUserBean.class), sb.toString(), curPage, pageSize);
					} catch (Exception e) {
						e.printStackTrace();
						ap.setCode(201);
					}
				}else{
					StringBuffer sb = new StringBuffer();
					sb.append("SELECT d.portal_user_name,expiration_time,d.transaction_amount,SUM(d.transaction_amount) total,COUNT(d.portal_user_id) count,site_name FROM (");
					sb.append("SELECT transaction_amount,site_id,portal_user_id,portal_user_name FROM t_site_income WHERE site_id =? ) d LEFT  JOIN (");
					sb.append("SELECT  c.site_name,m.site_id,m.portal_user_id,m.expiration_time FROM t_cloud_site c RIGHT JOIN (");
					sb.append("SELECT site_id,portal_user_id,expiration_time from t_site_customer_info WHERE expiration_time  < date_sub(now(),interval 14 day)) m  ON c.id = m.site_id");
					sb.append(") k ON d.portal_user_id = k.portal_user_id where k.site_id=? GROUP BY k.portal_user_id ORDER BY expiration_time DESC");
					try {
						ap=PagingFactory.getPageNationResultList(jdbcTemplate,new Object[]{siteId,siteId},new BeanPropertyRowMapper<ChurnUserBean>(ChurnUserBean.class), sb.toString(), curPage, pageSize);
					} catch (Exception e) {
						e.printStackTrace();
						ap.setCode(201);
					}
				}
		   }
		long e = System.currentTimeMillis();
		System.out.println("结束时间 ： "+e);
		System.out.println("耗时 ： " + (e-s));
		return ap.getData();
	}
 
	 
	
	/**
	 * 获取总页数 
	 * siteId = -1 则表示前端没有传入siteId的值,默认值为-1,表示执行全部场所,反之执行单一场所
	 * @param siteId
	 * @param startTime
	 * @param endTime
	 * @param state
	 * @return
	 */
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public int  totalPage(String siteId,String startTime,String endTime,Integer userId,int pageSize){
		//用于存储参数
		List paramList = new ArrayList();
		StringBuffer sql = new StringBuffer();
		sql.append(" SELECT 1 FROM ");
		sql.append(" (SELECT portal_user_id");
		sql.append(" FROM t_site_income WHERE site_id");
		sql.append(" IN (SELECT id FROM t_cloud_site ");
		if("-1".equals(siteId)){
			sql.append(" WHERE user_id = ?");
			paramList.add(userId);
		}else{
			sql.append(" WHERE site_id = ?");
			paramList.add(siteId);
		}
		sql.append(" )) d ");
		sql.append(" LEFT JOIN");
		sql.append(" (select site_id,portal_user_id");
		sql.append(" from t_site_customer_info");
		sql.append(" WHERE expiration_time < date_sub(now(), INTERVAL 14 DAY)) k");
		sql.append(" ON k.portal_user_id = d.portal_user_id ");
		if("-1".equals(siteId)){
			sql.append(" WHERE k.site_id IN (SELECT id FROM t_cloud_site WHERE user_id = ?) ");
			paramList.add(userId);
		}else{
			sql.append(" WHERE k.site_id = ? ");
			paramList.add(siteId);
		}
		if(startTime!=null&&!("".equals(startTime))&&endTime!=null&&!("".equals(endTime))){
			sql.append(" AND expiration_time BETWEEN ? AND ?");
			paramList.add(startTime);
			paramList.add(endTime);
		}
		sql.append(" GROUP BY k.portal_user_id ORDER BY null");
		Object[] param = new Object[paramList.size()];
		for (int i = 0; i < param.length; i++) {
			param[i] = paramList.get(i);
		}
		int totalNum =jdbcTemplate.queryForObject(getTotalRecordSQL(sql.toString()),param,Integer.class);//get totalNum
		int totalPageNum=(totalNum%pageSize)>0?(totalNum/pageSize+1):totalNum/pageSize;
		return totalPageNum;
	}
	/**获取总记录数
	 * @param sql
	 * @return
	 */
	private static String getTotalRecordSQL(String sql){
		return "select sum(1) totalNum from("+sql+") Tname";
	}
	/**
	 * siteId = -1 则表示前端没有传入siteId的值,默认值为-1,表示执行全部场所,反之执行单一场所
	 * @param siteId
	 * @param startTime
	 * @param endTime
	 * @param state
	 * @return
	 */
	public List<ChurnUserBean> exportExcel(String siteId,String startTime,String endTime,Integer userId){
		List<ChurnUserBean> list = null;
		if("-1".equals(siteId)){
			if(startTime!=null&&!("".equals(startTime))&&endTime!=null&&!("".equals(endTime))){
				StringBuffer sb = new StringBuffer();
				sb.append("SELECT d.portal_user_name,expiration_time,d.transaction_amount,SUM(d.transaction_amount) total,COUNT(d.portal_user_id) count,site_name FROM (");
				sb.append("SELECT transaction_amount,site_id,portal_user_id,portal_user_name FROM t_site_income WHERE site_id in (SELECT id FROM t_cloud_site WHERE user_id=?) ) d LEFT  JOIN (");
				sb.append("SELECT  c.site_name,m.site_id,m.portal_user_id,m.expiration_time FROM t_cloud_site c RIGHT JOIN (");
				sb.append("SELECT site_id,portal_user_id,expiration_time from t_site_customer_info WHERE expiration_time  < date_sub(now(),interval 14 day)) m  ON c.id = m.site_id");
				sb.append(") k ON d.portal_user_id = k.portal_user_id where k.site_id in (SELECT id FROM t_cloud_site WHERE user_id=?) AND expiration_time BETWEEN ? AND ? GROUP BY k.portal_user_id ORDER BY expiration_time DESC");
				try {
				     list = jdbcTemplate.query(sb.toString(),new Object[]{userId,userId,startTime+" 00:00:00",endTime+" 23:59:59"},new BeanPropertyRowMapper<ChurnUserBean>(ChurnUserBean.class));
				} catch (Exception e) {
					 log.error(this.getClass().getCanonicalName(),e);
				}
				 
			}else{
				StringBuffer sb = new StringBuffer();
				sb.append("SELECT d.portal_user_name,expiration_time,d.transaction_amount,SUM(d.transaction_amount) total,COUNT(d.portal_user_id) count,site_name FROM (");
				sb.append("SELECT transaction_amount,site_id,portal_user_id,portal_user_name FROM t_site_income WHERE site_id in (SELECT id FROM t_cloud_site WHERE user_id=?) ) d LEFT  JOIN (");
				sb.append("SELECT  c.site_name,m.site_id,m.portal_user_id,m.expiration_time FROM t_cloud_site c RIGHT JOIN (");
				sb.append("SELECT site_id,portal_user_id,expiration_time from t_site_customer_info WHERE expiration_time  < date_sub(now(),interval 14 day)) m  ON c.id = m.site_id");
				sb.append(") k ON d.portal_user_id = k.portal_user_id where k.site_id in (SELECT id FROM t_cloud_site WHERE user_id=?)  GROUP BY k.portal_user_id ORDER BY expiration_time DESC");
				try {
					 list = jdbcTemplate.query(sb.toString(), new Object[]{userId,userId}, new BeanPropertyRowMapper<ChurnUserBean>(ChurnUserBean.class));
				} catch (Exception e) {
					 log.error(this.getClass().getCanonicalName(),e);
				}
			}
			
		}else{
				if(startTime!=null&&!("".equals(startTime))&&endTime!=null&&!("".equals(endTime))){
					try {
						StringBuffer sb = new StringBuffer();
						sb.append("SELECT d.portal_user_name,expiration_time,d.transaction_amount,SUM(d.transaction_amount) total,COUNT(d.portal_user_id) count,site_name FROM (");
						sb.append("SELECT transaction_amount,site_id,portal_user_id,portal_user_name FROM t_site_income WHERE site_id=? ) d LEFT  JOIN (");
						sb.append("SELECT  c.site_name,m.site_id,m.portal_user_id,m.expiration_time FROM t_cloud_site c RIGHT JOIN (");
						sb.append("SELECT site_id,portal_user_id,expiration_time from t_site_customer_info WHERE expiration_time  < date_sub(now(),interval 14 day)) m  ON c.id = m.site_id");
						sb.append(") k ON d.portal_user_id = k.portal_user_id where k.site_id =? AND expiration_time BETWEEN ? AND ? GROUP BY k.portal_user_id ORDER BY expiration_time DESC");
						list = jdbcTemplate.query(sb.toString(), new Object[]{siteId,siteId,startTime+" 00:00:00",endTime+" 23:59:59"}, new BeanPropertyRowMapper<ChurnUserBean>(ChurnUserBean.class));
					} catch (Exception e) {
						 log.error(this.getClass().getCanonicalName(),e); 
					}
				}else{
					try {
						StringBuffer sb = new StringBuffer();
						sb.append("SELECT d.portal_user_name,expiration_time,d.transaction_amount,SUM(d.transaction_amount) total,COUNT(d.portal_user_id) count,site_name FROM (");
						sb.append("SELECT transaction_amount,site_id,portal_user_id,portal_user_name FROM t_site_income WHERE site_id=? ) d LEFT  JOIN (");
						sb.append("SELECT  c.site_name,m.site_id,m.portal_user_id,m.expiration_time FROM t_cloud_site c RIGHT JOIN (");
						sb.append("SELECT site_id,portal_user_id,expiration_time from t_site_customer_info WHERE expiration_time  < date_sub(now(),interval 14 day)) m  ON c.id = m.site_id");
						sb.append(") k ON d.portal_user_id = k.portal_user_id where k.site_id=? GROUP BY k.portal_user_id ORDER BY expiration_time DESC");
						list = jdbcTemplate.query(sb.toString(), new Object[]{siteId,siteId}, new BeanPropertyRowMapper<ChurnUserBean>(ChurnUserBean.class));
					} catch (Exception e) {
						 log.error(this.getClass().getCanonicalName(),e);
					}
				}
		   }
		
		return list;
	}
	
	
	/**
	 * @Description 获得场所下的全部的消费配置
	 * @param siteId
	 * @param portalId
	 * @return
	 */
	public List<SitePriceConfig> getSitePriceConfigAll(int siteId,String userName) {
		List<SitePriceConfig> spcList = new ArrayList<SitePriceConfig>();
		try {
			// 根据场所id获得场所信息
			List<Map<String, Object>> listMeal=getMealList(siteId);
			if( listMeal.size()!=0){
				for (int i = 0; i < listMeal.size(); i++) {
					boolean flag=false;
					if(listMeal.get(i).get("comboNumber")!=null&&!(listMeal.get(i).get("comboNumber")+"").equals("")){
						for (int j = 0; j < (listMeal.get(i).get("comboNumber")+"").split(";").length; j++) {
							if(userName.indexOf((listMeal.get(i).get("comboNumber")+"").split(";")[j])==0){
								SitePriceConfig spc=new SitePriceConfig();
								spc.setCharge_type(Integer.valueOf((listMeal.get(i).get("charge_type")+"").split(",")[1]));
								spc.setDescribe(listMeal.get(i).get("v2_describe")+"");
								spc.setGiveMeal(Integer.valueOf(listMeal.get(i).get("v2_give_meal")+""));
								spc.setGiveMealUnit(Integer.valueOf(listMeal.get(i).get("v2_givemeal_unit")+""));
								spc.setId(Integer.valueOf((listMeal.get(i).get("ids")+"").split(",")[1]));
								spc.setName(listMeal.get(i).get("name")+"");
								spc.setPrice_num(Integer.valueOf(listMeal.get(i).get("price_num")+""));
								spc.setPrice_type(Integer.valueOf(listMeal.get(i).get("price_type")+""));
								spc.setRecommendState(Integer.valueOf(listMeal.get(i).get("v2_recommend_state")+""));
								spc.setUnit_price(new BigDecimal((listMeal.get(i).get("price")+"").split(",")[1]));
								spc.setSite_id(siteId);
								spcList.add(spc);
								flag=false;
								break;
							}else{
								flag=true;
							}
						}
						if(flag){
							SitePriceConfig spc=new SitePriceConfig();
							spc.setCharge_type(Integer.valueOf((listMeal.get(i).get("charge_type")+"").split(",")[0]));
							spc.setDescribe(listMeal.get(i).get("v2_describe")+"");
							spc.setGiveMeal(Integer.valueOf(listMeal.get(i).get("v2_give_meal")+""));
							spc.setGiveMealUnit(Integer.valueOf(listMeal.get(i).get("v2_givemeal_unit")+""));
							spc.setId(Integer.valueOf((listMeal.get(i).get("ids")+"").split(",")[0]));
							spc.setName(listMeal.get(i).get("name")+"");
							spc.setPrice_num(Integer.valueOf(listMeal.get(i).get("price_num")+""));
							spc.setPrice_type(Integer.valueOf(listMeal.get(i).get("price_type")+""));
							spc.setRecommendState(Integer.valueOf(listMeal.get(i).get("v2_recommend_state")+""));
							spc.setUnit_price(new BigDecimal((listMeal.get(i).get("price")+"").split(",")[0]));
							spc.setSite_id(siteId);
							spcList.add(spc);
					  }
					}else{
						SitePriceConfig spc=new SitePriceConfig();
						spc.setCharge_type(Integer.valueOf(listMeal.get(i).get("charge_type")+""));
						spc.setDescribe(listMeal.get(i).get("v2_describe")+"");
						spc.setGiveMeal(Integer.valueOf(listMeal.get(i).get("v2_give_meal")+""));
						spc.setGiveMealUnit(Integer.valueOf(listMeal.get(i).get("v2_givemeal_unit")+""));
						spc.setId(Integer.valueOf(listMeal.get(i).get("ids")+""));
						spc.setName(listMeal.get(i).get("name")+"");
						spc.setPrice_num(Integer.valueOf(listMeal.get(i).get("price_num")+""));
						spc.setPrice_type(Integer.valueOf(listMeal.get(i).get("price_type")+""));
						spc.setRecommendState(Integer.valueOf(listMeal.get(i).get("v2_recommend_state")+""));
						spc.setUnit_price(new BigDecimal(listMeal.get(i).get("price")+""));
						spc.setSite_id(siteId);
						spcList.add(spc);
					}
					
				}
			}
		} catch (Exception e) {
			log.error(this.getClass().getCanonicalName()
					+ "===getSitePriceConfigAll", e);
			return null;
		}
		return spcList;

	}
	
	/**
	 * 
	 * @Description:获取场所套餐包	
	 * @author songyanbiao
	 * @date 2016年9月19日 下午2:03:06
	 * @param
	 * @return
	 */
	public List<Map<String, Object>> getMealList(int siteId){
		String sql=	"SELECT GROUP_CONCAT(id ORDER BY id ASC) ids,GROUP_CONCAT(unit_price ORDER BY id ASC) price,name,price_type,is_stoped,GROUP_CONCAT(charge_type ORDER BY charge_type ASC) charge_type,"+
				 	" price_num,GROUP_CONCAT(comboNumber) comboNumber,v2_recommend_state,v2_give_meal,v2_givemeal_unit,v2_describe"+
					" FROM t_site_price_config WHERE site_id=? AND is_stoped=0  GROUP BY name ORDER BY is_stoped ,price_type ASC";
		List<Map<String, Object>> list=new ArrayList<Map<String, Object>>();
		try {
			list = jdbcTemplate.queryForList(sql,new Object[] { siteId });
		} catch (Exception e) {
			log.error("查询场所套餐包出错",e);
		}
		return list;
	}
	
	
	/**
	 * 
	* @author:E-mail:dengfei200857@163.com  
	* @date: 2017年9月11日 下午2:29:28 
	* @Description: 根据用户获取场所ID
	* @param:    
	* @return
	 */
	public List<CloudSite> listCloudUser(int userId){
		Object[] param = null;
		String sqlUserInfo =" SELECT * FROM t_cloud_site WHERE user_id=?";
		param = new Object[]{userId};
		RowMapper rm = ParameterizedBeanPropertyRowMapper.newInstance(CloudSite.class);
		List<CloudSite> listWSU=jdbcTemplate.query(sqlUserInfo, param, rm);
		return listWSU;
	}
    /**
     * 
     * @author  zhangsongkun
                E-mail: zhangsk@fxwxlink.com
     * @date 创建时间：2017年10月28日 下午3:11:05
     * @version 1.0 
     * @parameter  获取累计用户的列表
     * @since  
     * @return
     */
	public List<UserTotalTimeHave> listUTT(String siteId,int userId,String userName,String startDate,String endDate,int pageNum,int pageSize){
		String siteIdUrl="";
		if(siteId.equals("0")){
			siteIdUrl="SELECT id FROM t_cloud_site WHERE user_id="+userId;
		}else{
			siteIdUrl=siteId;
		}
		Object[] param = null;
		String sqlUserInfo = "";
		if(userName != ""){
			 sqlUserInfo =" SELECT * FROM t8_user_total_time_have WHERE site_id IN ("+siteIdUrl+") AND user_name = ?  AND DATE_FORMAT(create_time,'%Y-%m-%d')  BETWEEN ? AND ? LIMIT ?,?";
			 param = new Object[]{userName,startDate,endDate,(pageNum-1)*pageSize,pageSize};
		}else{
			 sqlUserInfo =" SELECT * FROM t8_user_total_time_have WHERE site_id IN ("+siteIdUrl+")  AND DATE_FORMAT(create_time,'%Y-%m-%d') BETWEEN ? AND ? LIMIT ?,?";
			 param = new Object[]{startDate,endDate,(pageNum-1)*pageSize,pageSize};
		}
		RowMapper<UserTotalTimeHave> rm = ParameterizedBeanPropertyRowMapper.newInstance(UserTotalTimeHave.class);
		List<UserTotalTimeHave> listUTT=jdbcTemplate.query(sqlUserInfo, param, rm);
		return listUTT;
	}
	  /**
     * 
     * @author  zhangsongkun
                E-mail: zhangsk@fxwxlink.com
     * @date 创建时间：2017年10月28日 下午3:11:05
     * @version 1.0 
     * @parameter  获取平安app累计用户的列表
     * @since  
     * @return
     */
	public List<UserTotalTimeHave> listAppUTT(String siteId,int userId,String userName,String startDate,String endDate,int pageNum,int pageSize,HttpSession session){
		String siteIdUrl="";
		if(siteId.equals("0")){
			List<Map<String, Object>> data=(List<Map<String, Object>>) session.getAttribute("appList");
			Map<String, Object> map=null;
			for (int i = 0; i < data.size(); i++) {
				map=data.get(i);
				if(map!=null){
					siteIdUrl+=map.get("id")+",";
				}
			}
			siteIdUrl=siteIdUrl.substring(0,siteIdUrl.length()-1);
		}else{
			siteIdUrl=siteId;
		}
		Object[] param = null;
		String sqlUserInfo = "";
		if(userName != ""){
			 sqlUserInfo =" SELECT * FROM t8_user_total_time_have WHERE site_id IN ("+siteIdUrl+") AND user_name = ?  AND DATE_FORMAT(create_time,'%Y-%m-%d')  BETWEEN ? AND ? ORDER BY id DESC LIMIT ?,?";
			 param = new Object[]{userName,startDate,endDate,(pageNum-1)*pageSize,pageSize};
		}else{
			 sqlUserInfo =" SELECT * FROM t8_user_total_time_have WHERE site_id IN ("+siteIdUrl+")  AND DATE_FORMAT(create_time,'%Y-%m-%d') BETWEEN ? AND ? ORDER BY id DESC LIMIT ?,?";
			 param = new Object[]{startDate,endDate,(pageNum-1)*pageSize,pageSize};
		}
		RowMapper<UserTotalTimeHave> rm = ParameterizedBeanPropertyRowMapper.newInstance(UserTotalTimeHave.class);
		List<UserTotalTimeHave> listUTT=jdbcTemplate.query(sqlUserInfo, param, rm);
		return listUTT;
	}
	
	/**
	 * 
	* @author:E-mail:dengfei200857@163.com  
	* @date: 2017年9月28日 下午3:59:58 
	* @Description:获取累计用户总条数
	* @param:    
	* @return
	 */
	public int listUserTotalTimeNumber(String siteId,int userId,String userName,String startDate,String endDate){
		String siteIdUrl="";
		if(siteId.equals("0")){
			siteIdUrl="SELECT id FROM t_cloud_site WHERE user_id="+userId;
		}else{
			siteIdUrl=siteId;
		}
		
		Sql sql = null;
		if(userName != ""){
			 sql =  Sqls.fetchInt(" SELECT COUNT(*) FROM t8_user_total_time_have WHERE site_id IN ("+siteIdUrl+") AND user_name = @userName AND DATE_FORMAT(create_time,'%Y-%m-%d')  BETWEEN @startDate AND @endDate");
			 sql.params().set("userName",userName); 
		}else{
			 sql =  Sqls.fetchInt(" SELECT COUNT(*) FROM t8_user_total_time_have WHERE site_id IN ("+siteIdUrl+") AND DATE_FORMAT(create_time,'%Y-%m-%d')  BETWEEN @startDate AND @endDate");
		}
		sql.params().set("startDate",startDate); 
		sql.params().set("endDate",endDate);
		nutDao.execute(sql); 
		return  sql.getInt();
	}
	
	/**
	 * 
	* @author:E-mail:dengfei200857@163.com  
	* @date: 2017年9月28日 下午3:59:58 
	* @Description:获取平安app累计用户总条数
	* @param:    
	* @return
	 */
	public int listUserAppTotalTimeNumber(String siteId,int userId,String userName,String startDate,String endDate,HttpSession session){
		String siteIdUrl="";
		if(siteId.equals("0")){
			List<Map<String, Object>> data=(List<Map<String, Object>>) session.getAttribute("appList");
			Map<String, Object> map=null;
			for (int i = 0; i < data.size(); i++) {
				map=data.get(i);
				if(map!=null){
					siteIdUrl+=map.get("id")+",";
				}
			}
			siteIdUrl=siteIdUrl.substring(0,siteIdUrl.length()-1);
		}else{
			siteIdUrl=siteId;
		}
		
		Sql sql = null;
		if(userName != ""){
			 sql =  Sqls.fetchInt(" SELECT COUNT(*) FROM t8_user_total_time_have WHERE site_id IN ("+siteIdUrl+") AND user_name = @userName AND DATE_FORMAT(create_time,'%Y-%m-%d')  BETWEEN @startDate AND @endDate");
			 sql.params().set("userName",userName); 
		}else{
			 sql =  Sqls.fetchInt(" SELECT COUNT(*) FROM t8_user_total_time_have WHERE site_id IN ("+siteIdUrl+") AND DATE_FORMAT(create_time,'%Y-%m-%d')  BETWEEN @startDate AND @endDate");
		}
		sql.params().set("startDate",startDate); 
		sql.params().set("endDate",endDate);
		nutDao.execute(sql); 
		return  sql.getInt();
	}
	
	/**
	 * 获取平安买点数据
	 * @return
	 */
	public ExecuteResult getUserData(String startDate,String endDate,int curPage,int pageSize){
		ExecuteResult ex= new ExecuteResult();
		ex.setCode(200);
		String sql="SELECT * FROM t9_pv_uv WHERE create_time BETWEEN ? AND ? LIMIT ?,?" ;
		RowMapper<userDataBean> rm = ParameterizedBeanPropertyRowMapper.newInstance(userDataBean.class);
		List<userDataBean> ls=jdbcTemplate.query(sql, new Object[]{startDate,endDate,(curPage-1<0?0:curPage-1)*pageSize,pageSize}, rm);
		if(ls==null||ls.size()==0){
			ex.setCode(201);
			ex.setMsg("暂无数据");
			return ex;
		}
		ex.setData(ls);
		if(curPage==0||curPage==1){
			sql="SELECT count(id) FROM t9_pv_uv WHERE create_time BETWEEN ? AND ?" ;
			int totalNum=jdbcTemplate.queryForInt(sql,new Object[]{startDate,endDate});
			totalNum=totalNum%pageSize>0?(totalNum/pageSize+1):totalNum/pageSize;
			ex.setTotoalNum(totalNum);
		}
		return ex;
	}
}
