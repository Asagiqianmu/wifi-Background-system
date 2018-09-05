package com.fxwx.service.impl;
import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.log4j.Logger;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import com.fxwx.bean.UserExcelInfoBean;
import com.fxwx.bean.UserInfoBean;
import com.fxwx.bean.UserpaymentInfoBean;
import com.fxwx.util.ExecuteResult;
import com.fxwx.util.InitContext;

@Service
@SuppressWarnings("all")
public class SiteIncomeInfoServiceImpl {
	
	private static Logger log=Logger.getLogger(SiteIncomeInfoServiceImpl.class);
	
	@Resource(name="jdbcTemplate")
	private JdbcTemplate jdbcTemplate;
	
	
	public List<Map<String, Object>> getName(int id){
		String sql="SELECT name FROM t_site_price_config WHERE site_id=? group by name";
		
		List<Map<String, Object>> list=jdbcTemplate.queryForList(sql,new Object[]{id});
		return list;
	}
	/**
	 * 获取用户列表
	 * @param userId 当前登录用户
	 * @param siteId  场所id,若要查询某个单一场所的所有用户则为该参数设置，否则传递零即可，零显示的是当前登录用户的所有场所
	 * @param username
	 * @param curPage
	 * @param pageSize
	 * @return
	 */
	public List getIncomeInfoList(int userId, int siteId,String beginSelTime,String endSelTime,int curPage, int pageSize,String payName,String userName){
		List<Map<String,Object>> list = null;
		 List<UserpaymentInfoBean> ls=new ArrayList<UserpaymentInfoBean>();
		StringBuffer sql = new StringBuffer("");
		sql.append("SELECT t.transaction_amount,t.pay_name,t.buy_num,t.portal_user_name,t.create_time from t_site_income t  INNER JOIN t_cloud_site c  ON t.site_id=c.id ");
		sql.append(" WHERE c.user_id=").append(userId); 
		String startTime=beginSelTime+" 00:00:00";
		String endTime=endSelTime+" 23:59:59";
		/*if(siteId !=0){//如果存在场所id参数，则代表用户是要查询某个场所的注册用户数据
			sql.append(" AND c.id=").append(siteId);
		}*/
		if(!"".equals(beginSelTime)){
			sql.append(" and t.create_time>= ").append("'"+startTime+"'");
		}
		if(!"".equals(endSelTime)){
			sql.append(" and t.create_time<= ").append("'"+endTime+"'");
		}
		if(!"".equals(payName)){
			sql.append(" and t.pay_name=").append("'"+payName+"'");
		}
		if(!"".equals(userName)){
			sql.append(" and t.portal_user_name like").append("'%"+userName+"%'");
		}
		sql.append(" order by create_time desc");
		try{
			//查询到非统计的数据
				list=getPageNationByNameResultList(sql.toString(), curPage, pageSize);
				SimpleDateFormat sdf =   new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			//查询统计数据，并从ab中获取List集合便利并更新统计数据
			for(int i=0;i< list.size(); i++){
				 String create_time = list.get(i).get("create_time")+"";
				 String buy_num = list.get(i).get("buy_num")+"";
				 String pay_name=list.get(i).get("pay_name")+"";
				 Object amountObj= list.get(i).get("transaction_amount");
				 String user_name=list.get(i).get("portal_user_name")+"";
				 
				 UserpaymentInfoBean uib = new UserpaymentInfoBean();
				 uib.setCreateTime(sdf.parse(create_time));
				 uib.setUserName(user_name);
				 uib.setPayAmount((BigDecimal)amountObj);
				 uib.setPayName(pay_name);
				 uib.setBuyNum(Integer.valueOf(buy_num));
				 
				 ls.add(uib);
			}
		}catch (Exception e) {
			log.error("getUserRouterList---"+sql, e);	        
	        return ls;
	    }
		System.out.println("================getIncomeInfoList==="+sql);
		System.out.println(ls);
		return  ls;
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
	public int getSiteNum(int userId, int siteId, String startDate,String endDate,String payName,String userName, int pageSize){
	
		StringBuffer sql = new StringBuffer("");
		sql.append("SELECT t.transaction_amount,t.pay_name,t.buy_num,t.portal_user_name,t.create_time from t_site_income t  INNER JOIN t_cloud_site c  ON t.site_id=c.id ");
		sql.append(" WHERE c.user_id=").append(userId); 
		String startTime=startDate+" 00:00:00";
		String endTime=endDate+" 23:59:59";
		
		if(siteId !=0){//如果存在场所id参数，则代表用户是要查询某个场所的注册用户数据
			sql.append(" and c.id=").append(siteId);
		}
		if(siteId !=0){//如果存在场所id参数，则代表用户是要查询某个场所的注册用户数据
			sql.append(" AND c.id=").append(siteId);
		}
		if(!"".equals(startDate)){
			sql.append(" and t.create_time>= ").append("'"+startTime+"'");
		}
		if(!"".equals(endDate)){
			sql.append(" and t.create_time<= ").append("'"+endTime+"'");
		}
		if(!"".equals(payName)){
			sql.append(" and t.pay_name=").append("'"+payName+"'");
		}
		if(!"".equals(userName)){
			sql.append(" and t.portal_user_name like").append("'%"+userName+"%'");
		}
		try{
			
			int totalNum=0;
			List<Map<String, Object>> lm=jdbcTemplate.queryForList(getTotalRecordSQL(sql.toString()));//get totalNum
			if(lm.size()!=0&&lm.get(0).get("totalNum")!=null){totalNum=Integer.parseInt(lm.get(0).get("totalNum")+"");}
			int totalPageNum=(totalNum%pageSize)>0?(totalNum/pageSize+1):totalNum/pageSize;
			return totalPageNum;
		}catch(Exception e){
			log.error("SiteIncomeInfoServiceImpl 175行"+e);
			return 0;
		}
	}
	/**
	 * 根据条件查询获取总金额
	 * @param userId 用户id
	 * @param siteId  场所id
	 * @param beginSelTime  开始查询时间
	 * @param endSelTime	结束查询时间
	 * @param payType  付费类型
	 * @return
	 */
	public List<UserpaymentInfoBean> getTotalAmount(int userId, int siteId,String beginSelTime,String endSelTime,String payName,String userName){
		List<UserpaymentInfoBean> list=new ArrayList<UserpaymentInfoBean>();
		UserpaymentInfoBean uib = new UserpaymentInfoBean();
		StringBuffer sql = new StringBuffer("");
		sql.append("SELECT SUM(transaction_amount) as all_moeny from t_site_income t  INNER JOIN t_cloud_site c  ON t.site_id=c.id ");
		sql.append(" WHERE c.user_id=").append(userId); 
		String startTime=beginSelTime+" 00:00:00";
		String endTime=endSelTime+" 23:59:59";
		if(siteId !=0){//如果存在场所id参数，则代表用户是要查询某个场所的注册用户数据
			sql.append(" AND c.id=").append(siteId);
		}
		if(!"".equals(beginSelTime)){
			sql.append(" and t.create_time>= ").append("'"+startTime+"'");
		}
		if(!"".equals(endSelTime)){
			sql.append(" and t.create_time<= ").append("'"+endTime+"'");
		}
		if(!"".equals(payName)){
			sql.append(" and t.pay_name=").append("'"+payName+"'");
		}
		if(!"".equals(userName)){
			sql.append(" and t.portal_user_name like").append("'%"+userName+"%'");
		}
		
		try{
			
			Object obMoney =jdbcTemplate.queryForMap(sql.toString()).get("all_moeny");
			uib.setTotalAmount((BigDecimal)obMoney);
			list.add(uib);
			return list;
		}catch(Exception e){
			log.error("SiteIncomeInfoServiceImpl 214行"+e);
			return list;
		}
	}
	/**
	 * 导出excel表格
	 * @param siteId 场所id
	 * @param startTime 开始查询时间
	 * @param endTime 结束查询时间
	 * @param userId 用户id
	 * @param payType 付费类型
	 * @return
	 * @throws ParseException
	 * @throws UnsupportedEncodingException 
	 */
	public List<UserExcelInfoBean> exportExcel(int siteId, String startTime, String endTime, int userId,String payName,String userName) throws Exception{
		 List<UserExcelInfoBean> ls=new ArrayList<UserExcelInfoBean>();
		StringBuffer sql = new StringBuffer("");
		sql.append("SELECT t.transaction_amount,t.pay_name,t.buy_num,t.portal_user_name,t.create_time from t_site_income t  INNER JOIN t_cloud_site c  ON t.site_id=c.id ");
		sql.append(" WHERE c.user_id=").append(userId); 
		String beginSelTime=startTime+" 00:00:00";
		String endSelTime=endTime+" 23:59:59";
		if(siteId !=0){//如果存在场所id参数，则代表用户是要查询某个场所的注册用户数据
			sql.append(" AND c.id=").append(siteId);
		}
		if(!"".equals(startTime)){
			sql.append(" and t.create_time>= ").append("'"+beginSelTime+"'");
		}
		if(!"".equals(endTime)){
			sql.append(" and t.create_time<= ").append("'"+endSelTime+"'");
		}
		if(!"".equals(payName)){
			sql.append(" and t.pay_name=").append("'"+payName+"'");
		}
		if(!"".equals(userName)){
			sql.append(" and t.portal_user_name like").append("'%"+userName+"%'");
		}
		sql.append(" order by create_time desc");
		List<Map<String,Object>> list=jdbcTemplate.queryForList(sql.toString());
		SimpleDateFormat sdf =   new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		for (int i = 0; i < list.size(); i++) {
			 String create_time = list.get(i).get("create_time")+"";
			 String buy_num = list.get(i).get("buy_num")+"";
			 String pay_name=list.get(i).get("pay_name")+"";
			 Object amountObj= list.get(i).get("transaction_amount");
			 String user_name=list.get(i).get("portal_user_name")+"";
			 
			 UserExcelInfoBean uib = new UserExcelInfoBean();
			 uib.setUserName(user_name);
			 uib.setPayAmount((BigDecimal)amountObj);
			 uib.setBuyNum(Integer.valueOf(buy_num));
			 if(user_name.trim().startsWith("0")){
				 uib.setPayType(new String("营业厅充值".getBytes(),"utf-8"));
			 }else{
				 uib.setPayType(new String("自助充值".getBytes(),"utf-8"));
			 }
			 uib.setPayName(pay_name);
			 uib.setCreateTime(sdf.parse(create_time));
			ls.add(uib);
		}
		return ls;
	}
	 
}