package com.fxwx.service.impl;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.log4j.Logger;
import org.nutz.dao.Cnd;
import org.nutz.dao.Dao;
import org.nutz.dao.impl.NutDao;
import org.nutz.lang.Strings;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

import com.fxwx.bean.AjaxPageBean;
import com.fxwx.bean.ChargeBillingBean;
import com.fxwx.bean.ComparatorBilling;
import com.fxwx.entity.CloudSite;
import com.fxwx.entity.CloudSiteRouters;
import com.fxwx.entity.SiteIncome;
import com.fxwx.entity.SitePriceConfig;
import com.fxwx.util.InitContext;
import com.fxwx.util.PagingFactory;
import com.sun.org.apache.xml.internal.security.Init;

/**
 * 计费管理
 * @author Administrator
 *
 */
@Repository
@Service
public class SitePriceConfigServiceImpl {
	
	private static Logger log=Logger.getLogger(SitePriceConfigServiceImpl.class);
	
	@Resource(name="jdbcTemplate")
	private JdbcTemplate jdbcTemplate;
	
	@Resource(name="nutDao")
	private Dao nutDao;
	/**
	 * 根据用户名id和场所名查询余额并且清零(此处不用用户名是因为,线下交钱的话用户名前会加0来区别)
	 * @param userName
	 * @param siteId
	 * @return
	 */
	public SiteIncome setIncomReset(int portUserId,int siteId){
 
		List<SiteIncome> list =nutDao.query(SiteIncome.class, Cnd.where("portal_user_id", "=",portUserId).and("site_id","=",siteId));
 
		if(list == null){
			return null;
		}
		SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		Long dat =list.get(0).getCreateTime().getTime();
		int m = 0;
		BigDecimal bd = new BigDecimal(0);
 		for(int i = 1 ; i < list.size(); i++){
 			if(dat < list.get(i).getCreateTime().getTime()){
 				dat = list.get(i).getCreateTime().getTime();
 				m = list.get(i).getId(); 
 				bd = list.get(i).getTransactionAmount();
 			}
		}
 		SiteIncome si =nutDao.fetch(SiteIncome.class, Cnd.where("id", "=", m));
 		if(si==null){
 			return null;
 		}
 		si.setTransactionAmount(new BigDecimal("-"+bd));
 		nutDao.insert(si);

		return si;
	}
	 
	/**
	 * 查用用户计费规则 需要
	 * @param condition
	 * @return
	 * @throws Exception
	 */
	public AjaxPageBean getChargeRule(HashMap<String, String> condition) throws Exception{
		AjaxPageBean ab=null;
		String siteName=condition.get("siteName");//名称
		String uid=condition.get("uid");//用户ID
		int curPage= Integer.parseInt(condition.get("curPage"));//当前页
		int pageSize=Integer.parseInt(condition.get("pageSize"));//当前条码
		StringBuffer str=new StringBuffer();
		if(!Strings.isEmpty(siteName)){
			str.append(" and b.site_name='"+siteName+"'");
		}
		String sql="select a.id,a.site_id,a.price_type,a.unit_price,a.charge_type,"
				+ "a.name,a.is_stoped,a.create_time,b.address,b.site_name from"
				+ " t_site_price_config a inner  JOIN t_cloud_site b ON a.site_id=b.id "
				+ "WHERE b.user_id="+uid+str.toString();
		ab=PagingFactory.getPageNationResultList(jdbcTemplate, new BeanPropertyRowMapper<SitePriceConfig>(SitePriceConfig.class), sql,curPage,pageSize);
		return ab;
	}
	
 

	
	/**
	 * 返回用户的场所名称
	 * @param uid
	 * @return
	 */
	public List<Map<String, Object>> getSite(HashMap<String, String> condition){
		int uid=Integer.parseInt(condition.get("uid"));//用户ID
		String sql;
		String siteName=condition.get("siteName");
		if(!Strings.isEmpty(siteName)){
			sql="SELECT id,site_name,address from t_cloud_site where user_id="+uid+" and site_name like'%"+siteName+"%' order by create_time desc";
		}else{																		
			
			sql="SELECT id,site_name,address from t_cloud_site where user_id="+uid+" order by create_time desc";
		}
		List<Map<String, Object>> list=jdbcTemplate.queryForList(sql);
		return list;
	}
	
	/**获取总记录数
	 * @param sql
	 * @return
	 */
	public int getSiteNum(int pageSize,int uid){
		String sql="select count(*) from t_cloud_site where user_id="+uid;
		int totalSiteNum=jdbcTemplate.queryForInt(sql);
		int totalPageNum=(totalSiteNum%pageSize)>0?(totalSiteNum/pageSize+1):totalSiteNum/pageSize;
		return totalPageNum;
	}
	/**根据名字模糊查询获取总记录数
	 * @param sql
	 *  @param name
	 * @return
	 */
	public int getSiteNameNum(int pageSize,int uid,String name){
		String sql="select count(*) from t_cloud_site where site_name like'%"+name+"%'";
		int totalSiteNum=jdbcTemplate.queryForInt(sql);								
		int totalPageNum=(totalSiteNum%pageSize)>0?(totalSiteNum/pageSize+1):totalSiteNum/pageSize;
		return totalPageNum;
	}
	/**
	 * 
	 * @Description:获取用户设置套餐	
	 * @author songyanbiao
	 * @date 2016年8月30日 下午4:36:17
	 * @param
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public List<ChargeBillingBean>  getTypePrice(int id){
//		String sql="SELECT * FROM t_site_price_config WHERE site_id=?  ORDER BY is_stoped,price_type ASC";
		String sql="SELECT id,GROUP_CONCAT(unit_price ORDER BY id ASC) price,name,price_type,is_stoped,GROUP_CONCAT(charge_type ORDER BY charge_type ASC) charge_type,price_num,GROUP_CONCAT(comboNumber) comboNumber,v2_recommend_state,v2_give_meal,v2_givemeal_unit,v2_describe"+
		" FROM t_site_price_config WHERE site_id=? GROUP BY name ORDER BY is_stoped ,price_type ASC";
		List<Map<String, Object>>  ls= new ArrayList<Map<String, Object>>();
		List<ChargeBillingBean> list=new ArrayList<ChargeBillingBean>();
		try {
//			ls=jdbcTemplate.queryForList(sql, new Object[]{id});
//			if(ls.size()>0){
//				String[] num=new String[ls.size()];
//				for (int i = 0; i < ls.size(); i++) {
//					ChargeBillingBean c= new ChargeBillingBean();
//					for (int j =0; j < ls.size(); j++) {
//						if(ls.get(i).get("name").equals(ls.get(j).get("name"))&&ls.get(i).get("comboNumber")==null&&ls.get(j).get("comboNumber")!=null){
//							c.setChargeName(ls.get(i).get("name")+"");
//							c.setChargeType(Integer.valueOf(ls.get(i).get("price_type")+""));
//							c.setCommPrice(ls.get(i).get("unit_price")+"");
//							c.setFusePrice(ls.get(j).get("unit_price")+"");
//							c.setGroupType(Integer.valueOf(ls.get(j).get("charge_type")+""));
//							c.setDescribe(ls.get(i).get("v2_describe")+"");
//							c.setIsStoped(Integer.valueOf(ls.get(i).get("is_stoped")+""));
//							c.setComboTpe(Integer.valueOf(ls.get(i).get("price_type")+"")>3?"流量":"时长");
//							c.setRecommend(Integer.valueOf(ls.get(i).get("v2_recommend_state")+""));
//							c.setGiveNum(Integer.valueOf(ls.get(i).get("v2_give_meal")+""));
//							c.setGiveType(Integer.valueOf(ls.get(i).get("v2_givemeal_unit")+""));
//							c.setPriceNum(Integer.valueOf(ls.get(i).get("price_num")+""));
//							c.setComder(ls.get(j).get("comboNumber")+"");
//							c.setSiteId(id);
//							list.add(c);
//							num[i]=i+"";
//							num[j]=j+"";
//							break;
//						}
//					}
//					
//				}
//				
//				for (int i = 0; i < num.length; i++) {
//					if(num[i]==null){
//						ChargeBillingBean c= new ChargeBillingBean();
//						c.setChargeName(ls.get(i).get("name")+"");
//						c.setChargeType(Integer.valueOf(ls.get(i).get("price_type")+""));
//						c.setCommPrice(ls.get(i).get("unit_price")+"");
//						c.setGroupType(Integer.valueOf(ls.get(i).get("charge_type")+""));
//						c.setDescribe(ls.get(i).get("v2_describe")+"");
//						c.setIsStoped(Integer.valueOf(ls.get(i).get("is_stoped")+""));
//						c.setComboTpe(Integer.valueOf(ls.get(i).get("price_type")+"")>3?"流量":"时长");
//						c.setRecommend(Integer.valueOf(ls.get(i).get("v2_recommend_state")+""));
//						c.setGiveNum(Integer.valueOf(ls.get(i).get("v2_give_meal")+""));
//						c.setGiveType(Integer.valueOf(ls.get(i).get("v2_givemeal_unit")+""));
//						c.setPriceNum(Integer.valueOf(ls.get(i).get("price_num")+""));
//						c.setSiteId(id);
//						list.add(c);
//					}
//				}
//				ComparatorBilling com=new ComparatorBilling();
//				Collections.sort(list, com);
//			
//			}
			ls=jdbcTemplate.queryForList(sql, new Object[]{id});
			if(ls.size()>0){
				for (int i = 0; i < ls.size(); i++) {
					ChargeBillingBean c= new ChargeBillingBean();
					c.setChargeName(ls.get(i).get("name")+"");
					c.setChargeType(Integer.valueOf(ls.get(i).get("price_type")+""));
					c.setCommPrice((ls.get(i).get("price")+"").split(",")[0]);
					c.setFusePrice((ls.get(i).get("price")+"").split(",").length==1?null:(ls.get(i).get("price")+"").split(",")[1]);
					c.setGroupType((ls.get(i).get("charge_type")+"").split(",").length==1?Integer.valueOf((ls.get(i).get("charge_type")+"").split(",")[0]):Integer.valueOf((ls.get(i).get("charge_type")+"").split(",")[1]));
					c.setDescribe(ls.get(i).get("v2_describe")+"");
					c.setIsStoped(Integer.valueOf(ls.get(i).get("is_stoped")+""));
					c.setComboTpe(Integer.valueOf(ls.get(i).get("price_type")+"")>3?"流量":"时长");
					c.setRecommend(Integer.valueOf(ls.get(i).get("v2_recommend_state")+""));
					c.setGiveNum(Integer.valueOf(ls.get(i).get("v2_give_meal")+""));
					c.setGiveType(Integer.valueOf(ls.get(i).get("v2_givemeal_unit")+""));
					c.setPriceNum(Integer.valueOf(ls.get(i).get("price_num")+""));
					c.setComder(ls.get(i).get("comboNumber")+"");
					c.setSiteId(id);
					list.add(c);
				}
			}
		} catch (Exception e) {
			log.error("获取用户设置套餐出错",e);
		}
		
		return list;
	}
	/**
	 * 获得用户已停用付费类型
	 * @param id
	 * @return
	 */
	public List<Map<String, Object>>  getIsStopedTypePrice(int id){
		//String sql="select *, count(distinct name) from t_site_price_config WHERE site_id=? group by name ORDER BY is_stoped ASC,price_type ASC";
		//String sql="SELECT * FROM t_site_price_config WHERE site_id=? AND is_stoped=1 AND charge_type=0 GROUP BY name ORDER BY is_stoped ASC";
		String sql="SELECT * FROM t_site_price_config WHERE site_id=? AND is_stoped=1 ORDER BY is_stoped ASC";
		return jdbcTemplate.queryForList(sql, new Object[]{id});
	}
	/**
	 * 添加号码段
	 * @param priceName
	 * @param comboNumber
	 * @param siteId
	 */
	public boolean addComber(String priceName,String comboNumber,int siteId){
		boolean flag=true;
		String sql1="SELECT * FROM t_site_price_config WHERE site_id=? AND name=? AND comboNumber is not null";
		String sql="UPDATE t_site_price_config SET comboNumber=? WHERE site_id=? AND name=? AND comboNumber is not null";
		List<Map<String, Object>> list=jdbcTemplate.queryForList(sql, new Object[]{comboNumber,siteId,priceName});
		if(list.size()==0){
			flag=false;
		}else{
			jdbcTemplate.queryForList(sql, new Object[]{siteId,priceName,comboNumber});
		}
		return flag;
	}
	
	/**
	 * 返回用户的场所名称
	 * @param uid
	 * @return
	 */
	public List<Map<String, Object>> getUserSiet(int uid){
		String sql="SELECT id,site_name,address from t_cloud_site where user_id= "+uid+" ORDER BY systemtype DESC";
		List<Map<String, Object>> list=jdbcTemplate.queryForList(sql);
		return list;
	}
	/**
	 * 返回平安用户的场所名称
	 * @param uid
	 * @return
	 */
	public List<Map<String, Object>> getAppUserSiet(int uid){
		String sql="SELECT site.id,site.site_name,site.address from t_cloud_site site"+ 
					" LEFT JOIN t_cloud_site_routers r ON site.id = r.site_id"+
					" LEFT JOIN t7_newPortalid newid ON newid.nasid=r.nasid"+
					" WHERE site.user_id="+uid+" AND newid.user_type=7 GROUP BY site_id ORDER BY site.systemtype DESC";
		List<Map<String, Object>> list=jdbcTemplate.queryForList(sql);
		return list;
	}
	
	
	/**
	 * 
	 * @Description   高频率的场所排在前边
	 * @date 2016年10月12日上午10:01:52
	 * @author guoyingjie
	 * @param siteId
	 */
	public void updateSiteFrequency(int siteId,int userId){
		String uSql = "UPDATE t_cloud_site SET systemtype = 0 where user_id = ?";
		String sSql = "UPDATE t_cloud_site SET systemtype = 2 where id = ?";
		jdbcTemplate.update(uSql,new Object[]{userId});
		jdbcTemplate.update(sSql,new Object[]{siteId});
	}
	
	
	/**
	 * 
	 * @Description:获取商户下的所有场所列表	
	 * @author songyanbiao
	 * @date 2016年8月10日 上午10:20:56
	 * @param
	 * @return
	 */
	public List<Map<String, Object>> getUsersite(int userId,int pageSize,int curPage,String siteName){
		List<Map<String, Object>> list=new ArrayList<Map<String,Object>>();
		try {
			String sql="SELECT config.nums,site.id,site.site_name,site.address,site.status,site.site_type,router.router_type FROM ("+
					" SELECT COUNT(DISTINCT name) nums,site_id  FROM t_site_price_config WHERE site_id IN "+
					
					"(SELECT id FROM t_cloud_site WHERE user_id=?";
					if(!siteName.equals("")){
						sql+=" AND site_name like"+"'%"+siteName+"%'";
					}
					sql+= ") GROUP BY site_id) config "+
					" LEFT JOIN t_cloud_site site ON site.id=config.site_id "+
					" LEFT JOIN t_cloud_site_routers router ON site.id=router.site_id GROUP BY router.site_id"+
					" LIMIT ?,?";
			 list=jdbcTemplate.queryForList(sql,new Object[]{userId,(curPage-1)*pageSize,pageSize});
		} catch (Exception e) {
			log.error("获取商户场所列表出错",e);
			return null;
		}
		return list;
	}
	/**
	 * 
	 * @Description:获取场所总页数	
	 * @author songyanbiao
	 * @date 2016年8月30日 下午1:24:08
	 * @param
	 * @return
	 */
	public int getSitePage(String siteName,int userId,int pageSize){
		String sql="SELECT COUNT(*) FROM t_cloud_site WHERE user_id=?";
				if(!siteName.equals("")){
					sql+=" AND site_name LIKE"+"'%"+siteName+"%'";
				}
			int pageNum=0;
			try {
				pageNum=jdbcTemplate.queryForInt(sql,new Object[]{userId});
			} catch (Exception e) {
				log.error("获取场所总页数出错",e);
			}
			int totalPage=(pageNum%pageSize>0?pageNum/pageSize+1:pageNum/pageSize);
			return totalPage;
	}
	
	/**
	 * 更新融合套餐规则
	 * @param pc
	 * @return
	 */
	public void UpdatePriceConfig(String priceName,BigDecimal price,int newCharge_type,int siteid,String comboNumber,int price_num,int price_type,int giveNum,int giveType,String describe ){
		String sql="update t_site_price_config set unit_price=?,comboNumber=?,charge_type=?,price_num=?,price_type=?,v2_give_meal=?,v2_givemeal_unit=?,v2_describe=? where name=? and site_id=? and comboNumber is not null";
		jdbcTemplate.update(sql, new Object[]{price,comboNumber,newCharge_type,price_num,price_type,giveNum,giveType,describe,priceName,siteid});
	}
	/** 
	 * 
	 * 更新非融合套餐规则
	 * @param priceName
	 * @param price
	 * @param stoped
	 */
	public boolean UpdateChargePriceConfig(String priceName,BigDecimal price,int siteId,int price_type,int price_num,int giveNum,int giveType,String describe ){
		String sql="update t_site_price_config set unit_price=?,price_num=?,price_type=?,v2_give_meal=?,v2_givemeal_unit=?,v2_describe=? where name=? and site_id=? and comboNumber is null";
		try {
			int i=jdbcTemplate.update(sql, new Object[]{price,price_num,price_type,giveNum,giveType,describe,priceName,siteId});
			return i>0?true:false;
		} catch (Exception e) {
			log.error("更新非融合套餐规则出错",e);
		}
		return false;
	}


	/**
	 * 用户设置推荐套餐
	 * @param name
	 * @param siteId
	 * @return
	 */
	public int updateRecommendMeal(String name,int siteId){
		try {
			String sql="UPDATE t_site_price_config SET v2_recommend_state =1 WHERE name=? AND site_id=? and is_stoped=0";
			jdbcTemplate.update(sql, new Object[]{name,siteId});
			return 1;
		} catch (Exception e) {
			log.error("用户推荐套餐出错",e);
			return 0;
		}
	}
	/**
	 * 在用户设置推荐套餐时先去查看是否已经设置过，推荐套餐的原则用户只能设置一个
	 * @param name
	 * @param siteId
	 * @return
	 */
	@SuppressWarnings("deprecation")
	public boolean selRecommendMeal(int siteId){
		try {
			String sql="SELECT COUNT(v2_recommend_state) FROM t_site_price_config WHERE  v2_recommend_state=1 AND site_id=? and is_stoped=0";
			return jdbcTemplate.queryForInt(sql,new Object[]{siteId})>0?false:true;
		} catch (Exception e) {
			log.error("查询是否有推荐套餐出错",e);
		}
		return false;
	}
	/**
	 * 用户取消推荐套餐
	 * @param name 套餐名称
	 * @param siteId 场所id
	 * @return
	 */
	public boolean removeRecommend(String name,int siteId,int type){
		try {
			String sql="UPDATE t_site_price_config SET v2_recommend_state =0 WHERE name=? AND site_id=? and is_stoped=0";
			if(type==1){
				sql="UPDATE t_site_price_config SET v2_recommend_state =1 WHERE name=? AND site_id=? and is_stoped=0";
			}
			return jdbcTemplate.update(sql, new Object[]{name,siteId})>0?true:false;
		} catch (Exception e) {
			log.error("取消用户推荐套餐出错",e);
		}
		return false;
	}
	
	/**
	 * 查询场所的收费类型是否有同名
	 */
	public boolean selPriceConfig(String name,int siteId){
		boolean flag = false;
		String sql="select * from t_site_price_config where name=? and site_id=?";
		List<Map<String, Object>> list1=jdbcTemplate.queryForList(sql,new Object[]{name,siteId});
		if(list1.size()==0){
			flag = true;
		}else{
			flag=false;
		}
		return flag;
	}

	/**
	 * 
	 * @Description:新增计费套餐包	
	 * @author songyanbiao
	 * @date 2016年9月7日 上午11:48:42
	 * @param
	 * @return
	 */
	public boolean  AddPriceConfig(int charge_type,String name,int price_type,BigDecimal unit_price,int site_id,int price_num,
			String describe,int giveNum,int giveType,String comboNumber){
		try {
			//增加非融合套餐
			SitePriceConfig sitePriceConfig=new SitePriceConfig();
			sitePriceConfig.setCharge_type(charge_type);
			sitePriceConfig.setIs_stoped(0);
			sitePriceConfig.setName(name);
			sitePriceConfig.setPrice_type(price_type);
			sitePriceConfig.setUnit_price(unit_price);
			sitePriceConfig.setSite_id(site_id);
			sitePriceConfig.setPrice_num(price_num);
			sitePriceConfig.setDescribe(describe);
			sitePriceConfig.setGiveMeal(giveNum);
			sitePriceConfig.setGiveMealUnit(giveType);
			sitePriceConfig.setComboNumber(comboNumber);
			return nutDao.insert(sitePriceConfig).getId()>0?true:false;
		} catch (Exception e) {
			log.error("新增计费套餐包出错",e);
			return false;
		}
		
	}
	/**
	 * 
	 * @Description:查询是否已有融合套餐	
	 * @author songyanbiao
	 * @date 2016年9月6日 下午2:35:18
	 * @param
	 * @return
	 */
	public List<Map<String, Object>> getSitePriceConfig(int siteId,String name){
		List<Map<String, Object>> ls=new ArrayList<Map<String, Object>>();
		try {
			String sql="SELECT * FROM t_site_price_config WHERE site_id=? AND name=? AND comboNumber IS NOT NULL ";
			ls=jdbcTemplate.queryForList(sql,new Object[]{siteId,name});
		} catch (Exception e) {
			log.error("查询融合套餐出错",e);
			return null;
		}
		return ls;
	}
	/**
	 *更新场所设置（是否开启试用 +终端数）
	 * 更新 成功=1  失败=-1
	 * @param SiteId
	 * @param userId
	 * @param isProbative
	 * @param sumClinet
	 * @return
	 */
	public int UpdateSite(int SiteId,int userId,int isProbative,int sumClinet,String siteName,String siteAddress){
		 CloudSite site=nutDao.fetch(CloudSite.class,SiteId);
		 site.setIs_probative(isProbative);  
		 site.setAllow_client_num(sumClinet);
		 site.setSite_name(siteName);
		 site.setAddress(siteAddress);
		 int i=nutDao.update(site);
		 if(i!=1){
			i=-1;
		 }
		return i;
	}
	/**
	 * 根据场所id和paytype获取场所对应的价格配置信息,该配置必须is_stoped=0
	 * @param siteId
	 * @param paytype
	 * @return
	 */
	 
	 
	public SitePriceConfig getSitePriceInfos(int siteId,int paytype){
		SitePriceConfig priceInfo=nutDao.fetch(SitePriceConfig.class, Cnd.where("site_id","=",siteId)
				.and("id", "=", paytype).and("is_stoped", "=", 0));
		return priceInfo;
	}
	/**
	 * 
	 * @Description:启用套餐或停用套餐	
	 * @author songyanbiao
	 * @date 2016年8月31日 下午2:38:17
	 * @param
	 * @return
	 */

	public boolean upateStop(int siteId, String name,int status){
		try {
			String sql="update t_site_price_config SET is_stoped=1,v2_recommend_state=0 WHERE site_id=? AND name=?";
			if(status==0){
				sql="update t_site_price_config SET is_stoped=0 WHERE site_id=? AND name=?";
			}
			return jdbcTemplate.update(sql, new Object[]{siteId,name})>0?true:false;
		} catch (Exception e) {
			log.error("启用或停用套餐出错",e);
		}
		return false;
	}
	/**
	 * 
	 * @Description:查看该场所下开启的套餐数量	
	 * @author songyanbiao
	 * @date 2016年8月31日 下午2:13:13
	 * @param
	 * @return
	 */
	public boolean findStopNum(int siteId, int state){
		try {
			String sql="SELECT count(DISTINCT name) FROM t_site_price_config WHERE site_id=? AND comboNumber IS NULL AND IS_stoped=0";
			int nums=jdbcTemplate.queryForInt(sql, new Object[]{siteId});
			if(state==0){
				return nums>1?true:false;
			}else{
				return nums<16?true:false;
			}
		} catch (Exception e) {
			log.error("查看套餐开启数量出错",e);
		}
		return false;
	}
	public int findStopChargeNum(int id){
		String sql="SELECT count(DISTINCT name) FROM t_site_price_config WHERE site_id=? AND is_stoped=0 AND comboNumber IS not NULL";
		int stopNum=jdbcTemplate.queryForInt(sql, new Object[]{id});
		return stopNum;
	}
	/**
	 * 
	 * @Description:修改场计费状态	
	 * @author songyanbiao
	 * @date 2016年8月31日 下午1:34:29
	 * @param
	 * @return
	 */
	public boolean updatePay(int siteId,int userId,int status){
		String sql="UPDATE t_cloud_site SET STATUS =? WHERE id=? AND user_id=?";
		try {
			return jdbcTemplate.update(sql,new Object[]{status,siteId,userId})>0?true:false;
		} catch (Exception e) {
			log.error("修改场计费状态出错",e);
		}
		return false;
	}
	/**
	 * 
	 * @Description:查询用户下归属场所	
	 * @author songyanbiao
	 * @date 2016年9月5日 下午12:24:58
	 * @param
	 * @return
	 */
	public boolean selSiteByUserId(int userId,int siteId){
		CloudSite site=null;
		try {
			site=nutDao.fetch(CloudSite.class,Cnd.where("id","=",siteId).and("user_id","=",userId));
		} catch (Exception e) {
			log.error("查询场所出错",e);
		}
		if(site==null){
			return false;
		}
		return true;
	}
}
