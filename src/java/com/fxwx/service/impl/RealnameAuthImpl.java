package com.fxwx.service.impl;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.management.RuntimeErrorException;

import org.apache.log4j.Logger;
import org.nutz.dao.Cnd;
import org.nutz.dao.Dao;
import org.nutz.lang.Lang;
import org.nutz.trans.Atom;
import org.nutz.trans.Trans;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.interceptor.TransactionAspectSupport;

import com.fxwx.bean.AjaxPageBean;
import com.fxwx.bean.SiteUserRealNameBean;
import com.fxwx.entity.PortalUser;
import com.fxwx.entity.SiteUserRealNameAuth;
import com.fxwx.util.InitContext;
import com.fxwx.util.PagingFactory;

@Service
public class RealnameAuthImpl {

	private static Logger log = Logger.getLogger(RealnameAuthImpl.class);
	
	@Resource(name="jdbcTemplate")
	private JdbcTemplate jdbcTemplate;
	@Resource(name="nutDao")
	private Dao nutDao;
	/**
	 * 获得需要审核的记录
	 * @param id
	 * @return
	 */
	public List<SiteUserRealNameBean> selRealNameUserNum(List<Map<String, Object>> listId,int curPage,int pageSize){
		List<SiteUserRealNameBean> ls = new ArrayList<SiteUserRealNameBean>();
		String siteId="";
		if(listId.size()==1){
			siteId=listId.get(0).get("id")+"";
		}else{
			for (int i = 0; i < listId.size(); i++) {
				if(i==listId.size()-1){
					siteId+=listId.get(i).get("id");
				}else{
					siteId+=listId.get(i).get("id")+",";
				}
			}
		}
		try {
			String sql="SELECT u.id,u.site_id,u.user_name,u.telephone,u.id_card,u.address,u.img_url,site.site_name FROM t_user_realname_auth u LEFT JOIN t_cloud_site site ON u.site_id=site.id WHERE u.state=1  AND u.site_id IN ("+siteId+") limit ?,?";
			List<Map<String, Object>> list=jdbcTemplate.queryForList(sql,new Object[]{(curPage-1)*pageSize,pageSize});
			if(list.size()!=0){
				for (int i = 0; i < list.size(); i++) {
					SiteUserRealNameBean surn=new SiteUserRealNameBean();
					surn.setId((int)list.get(i).get("id"));
					surn.setAddress(list.get(i).get("address")+"");
					surn.setSiteId((int)list.get(i).get("site_id"));
					surn.setIdCard(list.get(i).get("id_card")+"");
					surn.setTelephone(list.get(i).get("telephone")+"");
					surn.setUserName(list.get(i).get("user_name")+"");
					String[] allImg= list.get(i).get("img_url").toString().split(",");
					surn.setCardImg(allImg[0]);
					surn.setUserImg(allImg[1]);
					surn.setSiteName(list.get(i).get("site_name")+"");
					ls.add(surn);
				}
			}
		} catch (Exception e) {
			log.error("查询审核记录失败---"+e);
		}
		return ls; 
	}
	
	/**
	 * 获取已认证列表
	 * @Description: TODO
	 * @param id
	 * @param curPage
	 * @param pageSize
	 * @param state 审核状态 1/未审核 2/已审核
	 * @return
	 * @Date		2016年7月1日 上午11:34:54
	 * @Author		cuimiao
	 */
	public List<Map<String,Object>> getRealList(int id, int state ,int curPage, int pageSize){
		AjaxPageBean  ap = null;
		try {
//			String sql="SELECT * FROM t_user_realname_auth u WHERE u.state=1  AND site_id IN (SELECT id FROM t_cloud_site c WHERE user_id=? AND c.state=0) LIMIT 0,1";
			StringBuffer sql = new StringBuffer();
			sql.append(" SELECT id,site_id,user_name,telephone,id_card,address ");
			sql.append(" FROM t_user_realname_auth");
			sql.append(" where site_id in ");
			sql.append(" (SELECT id FROM t_cloud_site where user_id = ?)");
			sql.append(" and state = ?");//已审核
//			sql.append(" limit 0,5");
			ap=PagingFactory.getPageNationResultListMap(jdbcTemplate, new Object[]{id,state}, sql.toString(), curPage, pageSize);
		} catch (Exception e) {
			log.error("查询审核记录失败---"+e);
		}
		return ap.getData();
	}
	
	/**
	 * 获取认证/未认证 总页数
	 * @Description: TODO
	 * @param id
	 * @param state
	 * @return
	 * @Date		2016年7月1日 上午11:56:34
	 * @Author		cuimiao
	 */
	public int getRealListPageNum(int id,int state){
		StringBuffer sql = new StringBuffer();
		sql.append(" SELECT count(*) ");
		sql.append(" FROM t_user_realname_auth");
		sql.append(" where site_id in (SELECT id FROM t_cloud_site where user_id = ? )");
		sql.append(" and state = ?");
		int pageNum = jdbcTemplate.queryForInt(sql.toString(), new Object[]{id,state});
		return pageNum;
	}
	
	
	/**
	 * 查询该用户是否开启实名认证
	 * @param id
	 * @return
	 */
	public List<Map<String, Object>> selSiteSwitch(int id){
		List<Map<String, Object>> ls=null;
		try {
			String sql="SELECT * FROM t_cloud_site WHERE user_id=? and state!=1";
			ls=jdbcTemplate.queryForList(sql,new Object[]{id});
		} catch (Exception e) {
			log.error("查询实名认证开关出错---"+e);
		}
		return ls;
	}
	/**
	 * 获得待审核总人数
	 * @param id
	 * @return
	 */
	public int selRealNameNum(int id){
		try {
			String sql="SELECT COUNT(*) FROM t_user_realname_auth u WHERE u.state=1 AND site_id IN (SELECT id FROM t_cloud_site c WHERE user_id=? AND c.state=0)";
			int i=jdbcTemplate.queryForInt(sql, new Object[]{id});
			return i;
		} catch (Exception e) {
			log.error("查询待审核人数出错"+e);
			return 0;
		}
	}
	/**
	 * 根据手机号查询该商户下所有场所中是否有该用户
	 * @param telephone
	 * @return
	 */
	public List<Map<String, Object>> getPortalUserByName(String telephone,int id){
		List<Map<String, Object>> ls=new ArrayList<Map<String, Object>>();
		String sql="SELECT * FROM t_cloud_site_portal WHERE portal_id=? AND site_id IN (SELECT id FROM t_cloud_site WHERE user_id=?)";
		try {
			PortalUser pu=nutDao.fetch(PortalUser.class,Cnd.where("user_name","=",telephone));
			if(pu!=null){
				ls=jdbcTemplate.queryForList(sql,new Object[]{pu.getId(),id});
			}
			
		} catch (Exception e) {
			log.error("查询用户时出错----"+e);
		}
		return ls;
	}
	/**
	 * 查询实名认证表用户是否已经认证
	 * @param telephone
	 * @return
	 */
	public List<Map<String, Object>> getRealNameList(String telephone){
		String sql="SELECT * FROM t_user_realname_auth WHERE telephone=?";
		List<Map<String, Object>> ls=new ArrayList<Map<String, Object>>();
		try {
		ls=jdbcTemplate.queryForList(sql,new Object[]{telephone});
			
		} catch (Exception e) {
			log.error("查询出错---method---getRealNameList"+e);
		}	
		return ls;
	}
	/**
	 * 添加用户实名认证
	 * @param telephone 用户手机
	 * @param idCard 用户身份证
	 * @param userName 用户真实姓名
	 * @param positation 宿舍地址
	 * @param siteId 场所id
	 * @param state 验证状态
	 */
	
	public boolean insertSiteUserRealNameAuth(final String telephone,final String idCard,final String userName,final String positation,final int siteId,final int state){
		try {
			Trans.exec(new Atom() {
				@Override
				public void run() {
					//当手动实名认证成功时,在user_realname_auth添加该记录，并修改portal-user用户表的认证状态为2；
					int i=insertUserNameAuth(telephone, idCard, userName, positation, siteId,state);
					if(i!=1){
						throw Lang.makeThrow("user_realname_auth表添加用户认证失败");
					}
					int j=updatePortalUser(telephone,state);
					if(j!=1){
						throw Lang.makeThrow("修改portal-user表用户认证状态失败");
					}
				}
			});
			return true;
		} catch (Exception e) {
			log.error(e+"-----绑定用户实名认证记录失败----methoed---- insertSiteUserRealNameAuth");
			return false;
		}
	}
	/**
	 * 添加认证记录
	 * @param telephone 用户手机
	 * @param idCard 用户身份证
	 * @param userName 用户真实姓名
	 * @param positation 宿舍地址
	 * @param siteId 场所id
	 * @return
	 */
	public int insertUserNameAuth(String telephone,String idCard,String userName,String positation,int siteId,int state){
		try {
			SiteUserRealNameAuth srn=new SiteUserRealNameAuth();
			srn.setAddress(positation);
			srn.setIdCard(idCard);
			srn.setSiteId(siteId);
			srn.setTelephone(telephone);
			srn.setUserName(userName);
			srn.setState(state);
			nutDao.insert(srn);
			return 1;
		} catch (Exception e) {
			log.error("添加认证失败");
			return 0;
		}
	}
	/**
	 * 修改用户认证状态
	 * @param telephone
	 * @return
	 */
	public int updatePortalUser(String telephone,int state){
		PortalUser pu=nutDao.fetch(PortalUser.class,Cnd.where("user_name","=",telephone));
		pu.setState(state);
		int i=nutDao.update(pu);
		return i;
	}
	/**
	 * 实名认证失败，删除此条记录 并修改potaluser表用户状态改为3
	 * @param id
	 * @param telepone
	 * @param state
	 */
	public boolean checkFail(final int id,final String telepone,final int state){
		try {
			Trans.exec(new Atom() {
				@Override
				public void run() {
					//当用户认证失败时删除user_realname_auth的该条记录，并且修改portal-user表用户的认证状态为1
					SiteUserRealNameAuth surn =nutDao.fetch(SiteUserRealNameAuth.class,Cnd.where("id","=",id));
					int i=nutDao.delete(surn);
					if(i!=1){
						throw Lang.makeThrow("删除user_realname_auth表数据失败");
					}
					int j=updatePortalUser(telepone, state);
					if(j!=1){
						throw Lang.makeThrow("修改portal-user表状态为1时失败");
					}
				}
			});
			return true;
		} catch (Exception e) {
			log.error(e+"---实名认证审核失败时出错----methoed---- checkFail");
			return false;
		}
	}
	
	/**
	 * 实名认证审核通过
	 * @param telephone 手机号
	 * @param id 
	 * @param state 状态
	 */
	public boolean checkSuccess(final String telephone,final int id,final int state ){
		try {
			Trans.exec(new Atom() {
				@Override
				public void run() {
					//当用户认证成功时修改user_realname_auth的该用户的认证状态为2，并且修改portal-user表用户的认证状态为2
					SiteUserRealNameAuth surn=nutDao.fetch(SiteUserRealNameAuth.class,Cnd.where("id","=",id));
					surn.setState(state);;
					int i =nutDao.update(surn);
					if(i!=1){
						throw Lang.makeThrow("实名认证审核通过修改user_realname_auth表的状态码失败");
					} 
					int j=updatePortalUser(telephone, state);
					if(j!=1){
						throw Lang.makeThrow("实名认证审核通过修改protal-user表的状态码失败");
					}
				}
			});
			return true;
		} catch (Exception e) {
			log.error(e+"-----实名认证审核通过时出错----methoed---- checkSuccess");
			return false;
			
		}
	}
	/**
	 * @Description  检查是否有重复的身份证号
	 * @param idCard
	 * @return  false--代表没有    true--代表有
	 */
	public boolean isHaveIdCard(String idCard){
		boolean flag = false;
		try {
			SiteUserRealNameAuth  siteIdCard = nutDao.fetch(SiteUserRealNameAuth.class,Cnd.where("id_card","=",idCard));
			if(siteIdCard!=null){
				flag = true;
			}else{
				flag = false;
			}
			
		} catch (Exception e) {
			 log.error(this.getClass().getCanonicalName()+"检查重复身份证失败--method--isHaveIdCard",e);
		}
		return flag;
	}
	
}
