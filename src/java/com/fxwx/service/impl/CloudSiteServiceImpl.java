package com.fxwx.service.impl;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.math.BigDecimal;
import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
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
import org.nutz.dao.FieldFilter;
import org.nutz.dao.util.Daos;
import org.nutz.trans.Atom;
import org.nutz.trans.Trans;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.simple.ParameterizedBeanPropertyRowMapper;
import org.springframework.stereotype.Repository;

import com.fxwx.bean.AjaxPageBean;
import com.fxwx.bean.CloudRouterBean;
import com.fxwx.bean.SiteInfoBean;
import com.fxwx.bean.UserTemporaryTotalLog;
import com.fxwx.entity.AuthType;
import com.fxwx.entity.CloudSite;
import com.fxwx.entity.CloudSiteRouters;
import com.fxwx.entity.RoutersAuthRetance;
import com.fxwx.entity.SiteAppRetance;
import com.fxwx.entity.SitePortalAuthRetance;
import com.fxwx.entity.SitePriceConfig;
import com.fxwx.entity.UserTotalTimeHave;
import com.fxwx.util.CalendarUtil;
import com.fxwx.util.DateUtil;
import com.fxwx.util.MemcachedUtils;
import com.fxwx.util.PagingFactory;

import sun.misc.BASE64Decoder;

@Repository
@SuppressWarnings("all")
public class CloudSiteServiceImpl {

	private static Logger log = Logger.getLogger(CloudSiteServiceImpl.class);

	@Resource(name = "jdbcTemplate")
	private JdbcTemplate jdbcTemplate;

	@Resource(name = "nutDao")
	private Dao nutDao;

	@Resource(name = "authenticationMethodImpl")
	private AuthenticationMethodImpl authenticationMethodImpl;
	@Autowired 
	private UserAllSiteDataStatisticsImpl userAllSiteDataStatisticsImpl;

	/**
	 * 添加场所
	 * 
	 * @param user
	 * @return
	 */
	public CloudSite addCloudSite(final String siteType, final String siteName, final String address, final int userId,
			final String siteNum, final int zd_num, final int sy_time, final int state, final int exTime,
			final String tel, final String autnStates, final String appName, final String appId,
			final String appSecretKey, final String appInfoId) {
		final Object[] objs = new Object[1];
		try {
			Trans.exec(new Atom() {
				public void run() {
					// 开启事务 保存user表
					CloudSite cloudsite = new CloudSite();
					cloudsite.setSiteType(siteType);
					cloudsite.setUser_id(userId);
					cloudsite.setSite_name(siteName);
					cloudsite.setAddress(address);
					cloudsite.setSiteNum(Integer.valueOf(siteNum));
					cloudsite.setAllow_client_num(zd_num);
					cloudsite.setIs_probative(sy_time);
					cloudsite.setState(state);
					cloudsite.setExTime((exTime == 1 ? 3600 : exTime * 60));
					cloudsite.setAdminer(tel);
					String bannerUrl = "school_pic/yd_banner1.jpg,school_pic/yd_banner2.jpg";
					cloudsite.setBannerUrl(bannerUrl);// 插入bannerUrl
					CloudSite siteTemp = nutDao.insert(cloudsite);

					// 添加场所认证方式
					SitePortalAuthRetance spar = new SitePortalAuthRetance();
					spar.setCreateTime(DateUtil.currentTimestamp());
					spar.setSiteId(cloudsite.getId());
					spar.setAuthTypeId(Integer.parseInt(autnStates));
					spar.setChargingState(0);
					nutDao.insert(spar);
					// 进行APP认证进行添加操作
					if (autnStates.equals("7")) {// APP认证等于7
						if (appInfoId.equals("0")) {// 自定义APP信息并且未关联用户
							authenticationMethodImpl.insertAppInfo(userId, cloudsite.getId(), appName, appId,
									appSecretKey);
						} else {// 如果APPname等于null不是自定义APP信息
							authenticationMethodImpl.insertAppInfoNull(appInfoId, userId, cloudsite.getId());
						}
					}
					objs[0] = siteTemp;
					// 保存SitePriceConfig表
					// 按小时收费
					SitePriceConfig spchour = new SitePriceConfig();
					spchour.setSite_id(cloudsite.getId());
					spchour.setPrice_type(0);
					spchour.setUnit_price(new BigDecimal(1));
					spchour.setCharge_type(0);
					spchour.setName("时");

					// 按天收费
					SitePriceConfig spcday = new SitePriceConfig();
					spcday.setSite_id(cloudsite.getId());
					spcday.setPrice_type(1);
					spcday.setUnit_price(new BigDecimal(10));
					spcday.setCharge_type(0);
					spcday.setName("天");
					// 按月收费
					SitePriceConfig spcmonth = new SitePriceConfig();
					spcmonth.setSite_id(cloudsite.getId());
					spcmonth.setPrice_type(2);
					spcmonth.setUnit_price(new BigDecimal(100));
					spcmonth.setCharge_type(0);
					spcmonth.setName("月");
					List<SitePriceConfig> spclist = new ArrayList<SitePriceConfig>();
					spclist.add(spchour);
					spclist.add(spcday);
					spclist.add(spcmonth);

					Daos.ext(nutDao, FieldFilter.create(SitePriceConfig.class, "^site_id|price_type|unit_price|name$"))
							.insert(spclist);
				}
			});
		} catch (Exception e) {
			log.error("userRegist 事务报错--", e);
			return (CloudSite) objs[0];
		}
		return (CloudSite) objs[0];
	}

	/**
	 * 更新场所信息
	 * 
	 * @param user
	 * @return
	 */
	public int updateCloudSite(final String siteType, final String siteName, final String address, final int siteId,
			final String siteNum, final int zd_num, final int sy_time, final int state, int exTime, String tel,
			final String autnStates, final String appName, final String appId, final String appSecretKey,
			final String appInfoId, final int userId) {
		int count = 0;
		try {
			CloudSite cloudsite = this.getCloudSiteById(siteId);
			cloudsite.setSiteType(siteType);
			cloudsite.setUser_id(cloudsite.getUser_id());
			cloudsite.setSite_name(siteName);
			cloudsite.setAddress(address);
			cloudsite.setSiteNum(Integer.valueOf(siteNum));
			cloudsite.setAllow_client_num(zd_num);
			cloudsite.setIs_probative(sy_time);
			cloudsite.setState(state);
			cloudsite.setBannerUrl(cloudsite.getBannerUrl());// 插入bannerUrl
			cloudsite.setExTime((exTime == 1 ? 3600 : exTime * 60));// 更该用户过期重复认证时间
			cloudsite.setAdminer(tel);
			count = nutDao.update(cloudsite);
			// 更新场所的认证状态
			SitePortalAuthRetance spa = nutDao.fetch(SitePortalAuthRetance.class, Cnd.where("siteId", "=", siteId));
			if (spa != null) {
				spa.setSiteId(siteId);
				spa.setAuthTypeId(Integer.parseInt(autnStates));
				spa.setCreateTime(DateUtil.currentTimestamp());
				nutDao.update(spa);
			}
			// 进行APP认证进行添加操作
			if (autnStates.equals("7")) {// APP认证等于7
				SiteAppRetance sar = nutDao.fetch(SiteAppRetance.class, Cnd.where("siteId", "=", cloudsite.getId()));
				if (sar != null) {// 根据场所ID查询当前是否有关联APP
					if (appInfoId.equals("0")) {// 自定义APP信息并且关联用户进行APP信息录入并更新对应APP
						authenticationMethodImpl.updateAppInfo(sar.getId(), appName, appId, appSecretKey);
					} else {// 如果APPname等于null不是自定义APP信息，更新操作
						authenticationMethodImpl.updateAppInfoNull(appInfoId, sar.getId());
					}
				} else {
					if (appInfoId.equals("0")) {// 自定义APP信息并且未关联用户
						authenticationMethodImpl.insertAppInfo(userId, cloudsite.getId(), appName, appId, appSecretKey);
					} else {// 如果APPname等于null不是自定义APP信息
						authenticationMethodImpl.insertAppInfoNull(appInfoId, userId, cloudsite.getId());
					}
				}
			}
			this.updateExTime((exTime == 1 ? 3600 : exTime * 60), siteId);
		} catch (Exception e) {
			log.error("更新场所信息失败");
		}
		return count;
	}

	/**
	 * 查询当前登录用户下是否还有未绑定设备的场所
	 * 
	 * @param userId
	 * @return
	 */
	public int querySiteConfigBySiteIdAndUserID(int userId) {
		String sql = "select count(site.id) from t_cloud_site site where site.user_id=" + userId
				+ " and site.id not in(select routers.site_id from t_cloud_site_routers routers)";
		int count = jdbcTemplate.queryForInt(sql);
		return count;
	}

	/**
	 * 获取用户名下的所有场所
	 * 
	 * @param userId
	 * @param curPage
	 * @param pageSize
	 * @return
	 */
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public AjaxPageBean getUserSiteListInfo(int userId, int curPage, int pageSize) {
		AjaxPageBean ab = null;
		StringBuilder sbd = new StringBuilder();
		sbd.append(" select m.id,max(m.site_name)site_name ,m.state,max(m.address)address, ");
		sbd.append(
				" max(m.is_probative)is_probative,max(m.allow_client_num)allow_client_num,max(m.create_time)create_time,count(m.mac)mac_num,group_concat(m.mac separator ',')macs,m.site_type,m.siteNum,m.exTime,m.site_admin from ( ");
		sbd.append(
				" select a.id,a.site_name,a.address,a.is_probative,a.allow_client_num,a.state,a.create_time,b.mac,a.site_type,a.siteNum,a.exTime,a.site_admin from t_cloud_site a LEFT JOIN t_cloud_site_routers b on a.id=b.site_id ");
		sbd.append(" where a.user_id =" + userId
				+ " order by a.create_time desc ) m GROUP BY m.id ORDER BY m.create_time desc");
		String sql = sbd.toString();
		try {
			ab = PagingFactory.getPageNationResultList(jdbcTemplate,
					new BeanPropertyRowMapper<SiteInfoBean>(SiteInfoBean.class), sql, curPage, pageSize);
			StringBuffer sb = new StringBuffer();
			for (int i = 0; i < ab.getData().size(); i++) {
				SiteInfoBean sib = (SiteInfoBean) ab.getData().get(i);
				sb.append(sib.getId()).append(",");
			}

			if (sb.length() > 0) {
				String in = sb.substring(0, sb.length() - 1);
				String portalNumSQL = "select a.site_id,count(DISTINCT a.portal_user_id) p_num from t_site_income a where a.site_id in ("
						+ in + ") group by a.site_id ";
				List<Map<String, Object>> result = jdbcTemplate.queryForList(portalNumSQL);
				if (result.size() > 0) {
					for (int i = 0; i < ab.getData().size(); i++) {
						SiteInfoBean sib = (SiteInfoBean) ab.getData().get(i);
						for (int j = 0; j < result.size(); j++) {
							int n = Integer.parseInt(result.get(j).get("site_id") + "");
							if (sib.getId() == n) {
								sib.setPortalUserNum(Long.parseLong(
										(result.get(j).get("p_num") == null ? 0 : result.get(j).get("p_num")) + ""));
							}
						}
					}
				}
				List<SiteInfoBean> list = new ArrayList();
				for (int i = 0; i < ab.getData().size(); i++) {
					SiteInfoBean sib = (SiteInfoBean) ab.getData().get(i);
					// 获取在线人数
					sib.setCreate_time(getOnlineNum((sib.getId() + "").trim()) + "");
					list.add(sib);
				}
				ab.setData(list);
			}
			System.out.println("=================getUserSiteListInfo===="+sql);
			System.out.println("================getUserSiteListInfo====="+ab);
			
			return ab;
		} catch (Exception e) {
			log.error(this.getClass().getCanonicalName(), e);
			return ab;
		}
	}

	/**
	 * 获取平安app场景
	 * 
	 * @param userId
	 * @param curPage
	 * @param pageSize
	 * @return
	 */
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public AjaxPageBean getUserSiteAppListInfo(int userId, int curPage, int pageSize, HttpSession session) {
		AjaxPageBean ab = null;
		StringBuilder sbd = new StringBuilder();
		sbd.append(" select m.id,max(m.site_name)site_name ,m.state,max(m.address)address, ");
		sbd.append(
				" max(m.is_probative)is_probative,max(m.allow_client_num)allow_client_num,max(m.create_time)create_time,count(m.mac)mac_num,group_concat(m.mac separator ',')macs,m.site_type,m.siteNum,m.exTime,m.site_admin from ( ");
		sbd.append(
				" select a.id,a.site_name,a.address,a.is_probative,a.allow_client_num,a.state,a.create_time,b.mac,a.site_type,a.siteNum,a.exTime,a.site_admin from t_cloud_site a LEFT JOIN t_cloud_site_routers b on a.id=b.site_id ");
		List<Map<String, Object>> data = (List<Map<String, Object>>) session.getAttribute("appList");
		Map<String, Object> map = null;
		String par = "";
		for (int i = 0; i < data.size(); i++) {
			map = data.get(i);
			if (map != null) {
				par += "'" + map.get("id") + "',";
			}
		}
		sbd.append(" where a.id in (" + par.substring(0, par.length() - 1)
				+ ") order by a.create_time desc ) m GROUP BY m.id ORDER BY m.create_time desc");
		String sql = sbd.toString();
		try {
			ab = PagingFactory.getPageNationResultList(jdbcTemplate,
					new BeanPropertyRowMapper<SiteInfoBean>(SiteInfoBean.class), sql, curPage, pageSize);
			StringBuffer sb = new StringBuffer();
			for (int i = 0; i < ab.getData().size(); i++) {
				SiteInfoBean sib = (SiteInfoBean) ab.getData().get(i);
				sb.append(sib.getId()).append(",");
			}
			System.out.println("场景集合====" + ab);

			if (sb.length() > 0) {
				String in = sb.substring(0, sb.length() - 1);
				String portalNumSQL = "select a.site_id,count(DISTINCT a.portal_user_id) p_num from t_site_income a where a.site_id in ("
						+ in + ") group by a.site_id ";
				List<Map<String, Object>> result = jdbcTemplate.queryForList(portalNumSQL);
				if (result.size() > 0) {
					for (int i = 0; i < ab.getData().size(); i++) {
						SiteInfoBean sib = (SiteInfoBean) ab.getData().get(i);
						for (int j = 0; j < result.size(); j++) {
							int n = Integer.parseInt(result.get(j).get("site_id") + "");
							if (sib.getId() == n) {
								sib.setPortalUserNum(Long.parseLong(
										(result.get(j).get("p_num") == null ? 0 : result.get(j).get("p_num")) + ""));
							}
						}
					}
				}
				List<SiteInfoBean> list = new ArrayList();
				for (int i = 0; i < ab.getData().size(); i++) {
					SiteInfoBean sib = (SiteInfoBean) ab.getData().get(i);
					// 获取在线人数
					sib.setCreate_time(getOnlineNum((sib.getId() + "").trim()) + "");
					list.add(sib);
				}
				ab.setData(list);
			}
			System.out.println("======================getUserSiteAppListInfo=="+sql);
			System.out.println("======================getUserSiteAppListInfo=="+ab);
			return ab;
		} catch (Exception e) {
			log.error(this.getClass().getCanonicalName(), e);
			return ab;
		}
	}

	/**
	 * 绑定设备 重载 by:cuimiao 该方法向t_cloud_site_routers表和radgroupreply表中插入数据
	 * 
	 * @param userId
	 * @param mac
	 * @return
	 */
	public boolean bindDeviceToUser(CloudSiteRouters router, String maxUpSpeed, String maxDownSpeed) {
		boolean flag = false;

		// RouterOs的速度是 为100时，存1M以此类推
		if ("ros".equals(router.getRouterType())) {
			maxUpSpeed = ((Integer.parseInt(maxUpSpeed) / 100) != 0 ? (Integer.parseInt(maxUpSpeed) / 100) : 1) + "M";
			maxDownSpeed = ((Integer.parseInt(maxDownSpeed) / 100) != 0 ? (Integer.parseInt(maxDownSpeed) / 100) : 1)
					+ "M";
		}

		// 插入操作：t_cloud_site_routers
		CloudSiteRouters ur = nutDao.fetch(CloudSiteRouters.class,
				Cnd.where("siteId", "=", router.getSiteId()).and("nasid", "=", router.getNasid()));
		if (ur == null) {
			flag = true;
			ur = new CloudSiteRouters();
			ur.setSiteId(router.getSiteId());
			ur.setMac(router.getMac().toUpperCase());
			ur.setIp(router.getIp());
			ur.setRouterType(router.getRouterType());
			ur.setSecretKey(router.getSecretKey());
			ur.setNasid(router.getNasid());
			ur.setInstallPosition(router.getInstallPosition());
			ur.setLastTime(new Date());
			ur = nutDao.insert(ur);
		}

		if (flag && !"wifidog".equals(router.getRouterType()) && !"ros".equals(router.getRouterType())
				&& !"h3c".equals(router.getRouterType()) && !"moto".equals(router.getRouterType())) {

			// 小辣椒上传速度以bit计算，所以在maxUpSpeed和maxDownSpeed
			if ("coovachilli".equals(router.getRouterType())) {
				maxUpSpeed = (Integer.parseInt(maxUpSpeed) * 8) + "";
				maxDownSpeed = (Integer.parseInt(maxDownSpeed) * 8) + "";
			}

			/** 操作radgroupreply进行限速配置 */
			// 查询上传 t2_router_type的router_attribute，router_op
			StringBuffer sqlSelectUp = new StringBuffer();
			sqlSelectUp.append(" SELECT ");
			sqlSelectUp.append(" router_attribute,router_op");
			sqlSelectUp.append(" FROM t2_router_type");
			sqlSelectUp.append(" where router_type = ? ");
			sqlSelectUp.append(" and router_attribute_name = 'max_up_speed'");
			List<Map<String, Object>> mapUp = new ArrayList<Map<String, Object>>();
			try {
				mapUp = jdbcTemplate.queryForList(sqlSelectUp.toString(), new Object[] { router.getRouterType() });
			} catch (Exception e) {
				e.printStackTrace();
			}
			// 查询下载 t2_router_type的router_attribute，router_op
			if (!"ros".equals(router.getRouterType())) {
				StringBuffer sqlSelectDown = new StringBuffer();
				sqlSelectDown.append(" SELECT ");
				sqlSelectDown.append(" router_attribute,router_op");
				sqlSelectDown.append(" FROM t2_router_type");
				sqlSelectDown.append(" where router_type = ? ");
				sqlSelectDown.append(" and router_attribute_name = 'max_down_speed'");
				List<Map<String, Object>> mapDown = new ArrayList<Map<String, Object>>();
				try {
					mapDown = jdbcTemplate.queryForList(sqlSelectDown.toString(),
							new Object[] { router.getRouterType() });
				} catch (Exception e) {
					e.printStackTrace();
				}

				// 插入下载：radgroupreply 隐患：没有事务处理
				StringBuffer sqlInsertDown = new StringBuffer();
				sqlInsertDown.append(" insert into ");
				sqlInsertDown.append(" radgroupreply(groupname,attribute,op,value)");
				sqlInsertDown.append(" values(?,?,?,?)");
				try {
					jdbcTemplate.update(sqlInsertDown.toString(), new Object[] { router.getNasid(),
							mapDown.get(0).get("router_attribute"), mapDown.get(0).get("router_op"), maxDownSpeed });
				} catch (Exception e) {
					e.printStackTrace();
				}
			}

			// 插入上传：radgroupreply 隐患：没有事务处理
			StringBuffer sqlInsertUp = new StringBuffer();
			sqlInsertUp.append(" insert into ");
			sqlInsertUp.append(" radgroupreply(groupname,attribute,op,value)");
			sqlInsertUp.append(" values(?,?,?,?)");
			try {
				jdbcTemplate.update(sqlInsertUp.toString(), new Object[] { router.getNasid(),
						mapUp.get(0).get("router_attribute"), mapUp.get(0).get("router_op"), maxUpSpeed });
			} catch (Exception e) {
				e.printStackTrace();
			}
			// 插入下载：radgroupreply
			StringBuffer sqlInsertCoova = new StringBuffer();
			sqlInsertCoova.append(" insert into ");
			sqlInsertCoova.append(" radgroupreply(groupname,attribute,op,value)");
			sqlInsertCoova.append(" values(?,?,?,?)");
			try {
				jdbcTemplate.update(sqlInsertCoova.toString(), new Object[] { router.getNasid(), "Idle-Timeout", ":=",
						this.getExpirationTime(router.getSiteId()) });
			} catch (Exception e) {
				e.printStackTrace();
			}

			// 除wifidog 向radcheck插入一条数据 Simultaneous-Use
			StringBuffer sqlInsertUse = new StringBuffer();
			sqlInsertUse.append(" insert into ");
			sqlInsertUse.append(" radcheck(groupname,attribute,op,value)");
			sqlInsertUse.append(" values(?,?,?,?)");
			try {
				jdbcTemplate.update(sqlInsertUse.toString(),
						new Object[] { router.getNasid(), "Simultaneous-Use", ":=", "1" });
			} catch (Exception e) {
				e.printStackTrace();
			}
		}

		if ("ros".equals(router.getRouterType())) {
			// 插入下载：radgroupreply
			StringBuffer sqlInsertCoova = new StringBuffer();
			sqlInsertCoova.append(" insert into ");
			sqlInsertCoova.append(" radgroupreply(groupname,attribute,op,value)");
			sqlInsertCoova.append(" values(?,?,?,?)");
			try {
				// TODO
				jdbcTemplate.update(sqlInsertCoova.toString(), new Object[] { router.getNasid(), "Mikrotik-Rate-Limit",
						":=", maxUpSpeed + "/" + maxDownSpeed });
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		// 新增h3c设备,由于上面写的太乱,不集成一起,看完以后我自己感觉蒙蒙哒!
		if (flag && "h3c".equals(router.getRouterType())) {
			CloudSite site = nutDao.fetch(CloudSite.class, Cnd.where("id", "=", router.getSiteId()));
			maxUpSpeed = (Integer.parseInt(maxUpSpeed) * 8) + "";
			maxDownSpeed = (Integer.parseInt(maxDownSpeed) * 8) + "";
			String sql = "SELECT router_attribute,router_op FROM t2_router_type where router_type = ? ";
			List<Map<String, Object>> ls = jdbcTemplate.queryForList(sql, new Object[] { router.getRouterType() });
			String insertSql = "INSERT INTO radgroupreply(groupname,attribute,op,value) VALUES";
			for (int i = 0; i < ls.size(); i++) {
				if (ls.get(i).get("router_attribute").equals("Huawei-Input-Burst-Size")) {
					insertSql += "('" + router.getNasid() + "','" + ls.get(i).get("router_attribute") + "','"
							+ ls.get(i).get("router_op") + "'," + maxUpSpeed + "),";
				} else if (ls.get(i).get("router_attribute").equals("Huawei-Output-Burst-Size")) {
					insertSql += "('" + router.getNasid() + "','" + ls.get(i).get("router_attribute") + "','"
							+ ls.get(i).get("router_op") + "'," + maxDownSpeed + "),";
				} else if (ls.get(i).get("router_attribute").equals("Acct-Interim-Interval")) {
					insertSql += "('" + router.getNasid() + "','" + ls.get(i).get("router_attribute") + "','"
							+ ls.get(i).get("router_op") + "'," + 300 + "),";
				} else {
					insertSql += "('" + router.getNasid() + "','" + ls.get(i).get("router_attribute") + "','"
							+ ls.get(i).get("router_op") + "'," + site.getExTime() + "),";
				}
			}
			System.out.println(insertSql.substring(0, insertSql.length() - 1));
			jdbcTemplate.update(insertSql.substring(0, insertSql.length() - 1));
			// jdbcTemplate.batchUpdate(insertSql.substring(0,
			// insertSql.length()-1));
		}
		// 新增moto设备,由于上面写的太乱,不集成一起,看完以后我自己感觉蒙蒙哒!
		// 摩托设备不能做上下行限制
		if (flag && "moto".equals(router.getRouterType())) {
			// CloudSite site=nutDao.fetch(CloudSite.class,
			// Cnd.where("id","=",router.getSiteId()));
			// maxUpSpeed = (Integer.parseInt(maxUpSpeed)*8)+"";
			// maxDownSpeed = (Integer.parseInt(maxDownSpeed)*8)+"";
			// String sql="SELECT router_attribute,router_op FROM t2_router_type
			// where router_type = ? ";
			// List<Map<String, Object>> ls=jdbcTemplate.queryForList(sql, new
			// Object[]{router.getRouterType()});
			// String insertSql="INSERT INTO
			// radgroupreply(groupname,attribute,op,value) VALUES";
			// for (int i = 0; i < ls.size(); i ++) {
			// if(ls.get(i).get("router_attribute").equals("Motorola-Canopy-ULBL")){
			// insertSql+="('"+router.getNasid()+"','"+ls.get(i).get("router_attribute")+"','"+ls.get(i).get("router_op")+"',"+maxUpSpeed+"),";
			// }else
			// if(ls.get(i).get("router_attribute").equals("Motorola-Canopy-DLBL")){
			// insertSql+="('"+router.getNasid()+"','"+ls.get(i).get("router_attribute")+"','"+ls.get(i).get("router_op")+"',"+maxDownSpeed+"),";
			// }else
			// if(ls.get(i).get("router_attribute").equals("Motorola-Canopy-VLAGETO")){
			// insertSql+="('"+router.getNasid()+"','"+ls.get(i).get("router_attribute")+"','"+ls.get(i).get("router_op")+"',"+300+"),";
			// }else{
			// insertSql+="('"+router.getNasid()+"','"+ls.get(i).get("router_attribute")+"','"+ls.get(i).get("router_op")+"',"+site.getExTime()+"),";
			// }
			// }
			// System.out.println(insertSql.substring(0, insertSql.length()-1));
			// jdbcTemplate.update(insertSql.substring(0,
			// insertSql.length()-1));
			// jdbcTemplate.batchUpdate(insertSql.substring(0,
			// insertSql.length()-1));
			flag = true;
		}
		return flag;// 绑定路由操作成功视为该操作执行成功
	}

	public static void main(String[] args) {
		System.out.println(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date(1496964446790L)));

	}

	/**
	 * @Description 获得用户过期时间,避免重复认证默认600s
	 * @date 2016年10月12日上午11:16:41
	 * @author guoyingjie
	 * @param siteId
	 */
	public int getExpirationTime(int siteId) {
		int exTime = 600;
		try {
			CloudSite site = nutDao.fetch(CloudSite.class, Cnd.where("id", "=", siteId));
			exTime = site.getExTime();
		} catch (Exception e) {
			log.error(this.getClass().getCanonicalName());
		}
		return exTime;
	}

	/**
	 * 
	 * @Description 更改用户过期时间,避免重复认证默认600s
	 * @date 2016年10月12日上午11:50:36
	 * @author guoyingjie
	 * @param value
	 * @param siteId
	 */
	public void updateExTime(int value, int siteId) {
		try {
			String sql = "UPDATE radgroupreply SET value=? WHERE groupname IN (SELECT nasid FROM t_cloud_site_routers where site_id = ?) AND attribute = 'Idle-Timeout'";
			jdbcTemplate.update(sql, new Object[] { value, siteId });
		} catch (Exception e) {
			log.error(this.getClass().getCanonicalName());
		}
	}

	/**
	 * @Description 更改绑定设备
	 * @date 2016年9月2日上午9:44:03
	 * @author guoyingjie
	 * @param router
	 * @param maxUpSpeed--上传速度
	 *            (wifidog不限速)
	 * @param maxDownSpeed--下载速度
	 * @return
	 */
	public boolean updateDeviceToUser(final CloudSiteRouters router, final String maxUpSpeed,
			final String maxDownSpeed) {
		try {
			Trans.exec(new Atom() {
				public void run() {
					nutDao.update(router);
					// RouterOs的速度是 为100时，存1M以此类推
					if ("ros".equals(router.getRouterType())) {
						String maxUpSpeeds = ((Integer.parseInt(maxUpSpeed) / 100) != 0
								? (Integer.parseInt(maxUpSpeed) / 100) : 1) + "M";
						String maxDownSpeeds = ((Integer.parseInt(maxDownSpeed) / 100) != 0
								? (Integer.parseInt(maxDownSpeed) / 100) : 1) + "M";
						String sql = "UPDATE radgroupreply SET value = ? WHERE groupname = ? AND attribute = 'Mikrotik-Rate-Limit'";
						jdbcTemplate.update(sql, new Object[] { maxUpSpeeds + "/" + maxDownSpeeds, router.getNasid() });
					}
					// 小辣椒上传速度以bit计算，所以在maxUpSpeed和maxDownSpeed
					if ("coovachilli".equals(router.getRouterType())) {
						String maxUpSpeeds = (Integer.parseInt(maxUpSpeed) * 8) + "";
						String maxDownSpeeds = (Integer.parseInt(maxDownSpeed) * 8) + "";
						String upSpeed = "UPDATE radgroupreply SET value = ? WHERE groupname = ? AND attribute = 'ChilliSpot-Bandwidth-Max-Up'";
						String downSpeed = "UPDATE radgroupreply SET value = ? WHERE groupname = ? AND attribute = 'ChilliSpot-Bandwidth-Max-Down'";
						jdbcTemplate.update(upSpeed, new Object[] { maxUpSpeeds, router.getNasid() });
						jdbcTemplate.update(downSpeed, new Object[] { maxDownSpeeds, router.getNasid() });
					}
					// ikuai的限速单位为kb,前端穿过来就是kb单位
					if ("ikuai".equals(router.getRouterType())) {
						String upSpeed = "UPDATE radgroupreply SET value = ? WHERE groupname = ? AND attribute = 'RP-Upstream-Speed-Limit'";
						String downSpeed = "UPDATE radgroupreply SET value = ? WHERE groupname = ? AND attribute = 'RP-Downstream-Speed-Limit'";
						jdbcTemplate.update(upSpeed, new Object[] { maxUpSpeed, router.getNasid() });
						jdbcTemplate.update(downSpeed, new Object[] { maxDownSpeed, router.getNasid() });
					}
				}
			});
			return true;
		} catch (Exception e) {
			log.error("updateDeviceToUser 事务报错--", e);
			return false;
		}
	}

	/**
	 * @Description 返回设备信息
	 * @date 2016年9月1日上午10:38:26
	 * @author guoyingjie
	 * @param pageNumber
	 * @param pageSize
	 * @return
	 */
	public List<CloudRouterBean> getDeviceList(int siteId, int pageNumber, int pageSize) {
		List<CloudRouterBean> routers = new LinkedList<CloudRouterBean>();
		pageNumber = (pageNumber - 1) < 0 ? 0 : (pageNumber - 1);
		pageNumber = pageNumber * pageSize;
		try {
			String sql1 = "SELECT router.*,type.secretype FROM t_cloud_site_routers router LEFT JOIN t7_auth_type type ON router.nasid=type.nasid WHERE site_id=? ORDER BY create_time DESC  LIMIT ?,? ";
			String sql = "SELECT * FROM t_cloud_site_routers where site_id =? ORDER BY create_time DESC  LIMIT ?,?";
			List<CloudSiteRouters> list = jdbcTemplate.query(sql1, new Object[] { siteId, pageNumber, pageSize },
					new BeanPropertyRowMapper(CloudSiteRouters.class));
			if (list.size() > 0 && list != null && list.get(0) != null) {
				for (int i = 0; i < list.size(); i++) {
					CloudSiteRouters cst = list.get(i);
					CloudRouterBean bean = new CloudRouterBean();
					bean.setId(cst.getId());
					bean.setSiteId(cst.getSiteId());
					bean.setNasid(cst.getNasid());
					bean.setDeviceType(cst.getRouterType());
					bean.setPosition(cst.getInstallPosition());
					bean.setSecretKey(cst.getSecretKey());
					bean.setCpu(cst.getCpuRate() == null ? "0%" : cst.getCpuRate() + "%");
					bean.setSecretType(cst.getSecretype());
					String runTime = cst.getRunTime();
					if (runTime != null) {
						String[] str = runTime.split(":");
						runTime = str[0] + "小时" + str[1] + "分";
					} else {
						runTime = "未知";
					}
					bean.setRunTime(runTime);
					Date lastTime = cst.getLastTime();
					if (lastTime != null) {
						if (new Date().getTime() - lastTime.getTime() > 4 * 60 * 1000) {// 大于4倍心跳异常
							bean.setState(1);// 1--异常
						} else {
							bean.setState(0);
						}
					}
					String[] str = this.getUpAndDown(cst.getNasid(), cst.getRouterType());
					bean.setMaxup(str[0]);
					bean.setMaxdown(str[1]);
					routers.add(bean);
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
			log.error("返回设备信息");
		}
		return routers;
	}

	/**
	 * @Description 获取场所设备总页数
	 * @date 2016年9月1日上午11:57:34
	 * @author guoyingjie
	 * @param siteId
	 * @return
	 */
	public int deviceTotalPage(int siteId, int pageSize) {
		int totalPage = 0;
		try {
			String sql = "SELECT COUNT(id) FROM t_cloud_site_routers where site_id = ?";
			long total = jdbcTemplate.queryForObject(sql, new Object[] { siteId }, Long.class);
			int totalCount = Integer.valueOf((total + "").trim());
			totalPage = (totalCount % pageSize) > 0 ? (totalCount / pageSize + 1) : totalCount / pageSize;
		} catch (Exception e) {
			log.error("返回设备信息总页数异常");
		}
		return totalPage;
	}

	/**
	 * 获得场所列表总页数
	 * 
	 * @param pageSize
	 * @param userId
	 * @return
	 */
	public int getTotalPage(int pageSize, int userId) {
		int totalPageNum = 0;
		try {
			String sql = "SELECT COUNT(*) from (select m.id,max(m.site_name)site_name ,max(m.address)address, "
					+ "max(m.is_probative)is_probative,max(m.allow_client_num)allow_client_num,max(m.create_time)create_time,count(m.mac)mac_num,group_concat(m.mac separator ',')macs from ( "
					+ "select a.id,a.site_name,a.address,a.is_probative,a.allow_client_num,a.create_time,b.mac from t_cloud_site a LEFT JOIN t_cloud_site_routers b on a.id=b.site_id "
					+ "where a.user_id=" + userId + " order by a.create_time desc ) m GROUP BY m.id) k";
			long count = jdbcTemplate.queryForObject(sql, Long.class);
			int totalCount = Integer.valueOf((count + "").trim());
			totalPageNum = (totalCount % pageSize) > 0 ? (totalCount / pageSize + 1) : totalCount / pageSize;
		} catch (Exception e) {
			totalPageNum = 0;
			log.error("获取场所总页数异常");
		}
		return totalPageNum;
	}

	/**
	 * 获得在线人数
	 * 
	 * @param siteId
	 * @return
	 */
	@SuppressWarnings("deprecation")
	public int getOnlineNum(String siteId) {
		Integer onlineCoova = 0;
		StringBuffer sqlCoova = new StringBuffer();
		sqlCoova.append("  select count(1) from radacct");
		sqlCoova.append("  where ");
		sqlCoova.append("  nasid in (SELECT nasid FROM t_cloud_site_routers WHERE site_id=?) ");
		sqlCoova.append("  AND acctstoptime IS NULL");
		onlineCoova = jdbcTemplate.queryForInt(sqlCoova.toString(), new Object[] { siteId });
		return onlineCoova;
	}

	/**
	 * 获得在nasid
	 * 
	 * @param siteId
	 * @return
	 */
	public List<Map<String, Object>> getNasidList() {
		String sql = "SELECT nasid FROM t_cloud_site_routers";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		return list;
	}

	/**
	 * 
	 * @Description: 获取该场所下所有路由
	 * @param siteId
	 * @return
	 * @Date 2016年6月18日 下午6:17:40
	 * @Author cuimiao
	 */
	public List<Map<String, Object>> getRouterList(String siteId) {
		String sql = "SELECT id,secret_key FROM t_cloud_site_routers where site_id = ?";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql, new Object[] { siteId });
		return list;
	}

	/**
	 * @Description 删除设备异常的设备
	 * @date 2016年9月1日下午4:57:01
	 * @author guoyingjie
	 * @param nasid
	 * @param id===设备id
	 * @return
	 */
	public boolean deleteErrorDevice(final String nasid, final int id) {
		try {
			Trans.exec(new Atom() {
				public void run() {
					String sql = "DELETE FROM t_cloud_site_routers WHERE nasid = ? AND id = ?";
					jdbcTemplate.update(sql, new Object[] { nasid, id });

					// 删除设备相关配置（4.1.1版主要针对于爱快和小辣椒的配置）
					// 通用配置（小辣椒和爱快）
					String sqlCommon = "delete from radgroupreply where groupname = ?";
					jdbcTemplate.update(sqlCommon, new Object[] { nasid });
					// 小辣椒配置
					String sqlCoova = "delete from radcheck where groupname = ?";
					jdbcTemplate.update(sqlCoova, new Object[] { nasid });
				}
			});
			return true;
		} catch (Exception e) {
			log.error("删除设备异常的设备 事务报错--", e);
			return false;
		}
	}

	/**
	 * 根据id查询场所是否存在
	 * 
	 * @param id
	 * @return
	 */
	public CloudSite getCloudSiteById(int id) {
		CloudSite c = nutDao.fetch(CloudSite.class, Cnd.where("id", "=", id));
		return c;
	}

	/**
	 * @Description 将传过来的base64转化为图片流
	 * @date 2016年5月24日上午9:06:45
	 * @author guoyingjie
	 * @param base64String
	 * @return
	 */
	public static InputStream getInputStream(String base64String) {
		InputStream in = null;
		if (base64String != null && !"".equals(base64String)) {
			String formateStr = base64String.substring(base64String.indexOf("base64") + 7);
			BASE64Decoder decoder = new BASE64Decoder();
			try {
				// Base64解码
				byte[] bytes = decoder.decodeBuffer(formateStr);
				for (int i = 0; i < bytes.length; ++i) {
					if (bytes[i] < 0) {// 调整异常数据
						bytes[i] += 256;
					}
				}
				in = new ByteArrayInputStream(bytes);
			} catch (Exception e) {
				log.error("获得图片流失败", e);
			}
		}
		return in;
	}

	/**
	 * 生成十二位随机数
	 */
	public static String randCode() {
		String code = "";
		for (int i = 0; i < 3; i++) {
			Random rand = new Random();
			code += rand.nextInt(9);
		}
		return code.trim() + new Date().getTime();
	}

	/**
	 * 
	 * @Description:用户radius登陆表更换名称
	 * @author songyanbiao
	 * @Date 2016年6月14日
	 */
	public void updateLoginTable() {
		try {

			String tableName = "radacct_" + CalendarUtil.yesteday();
			String sql = "INSERT INTO " + tableName + " (SELECT * FROM radacct )";
			String delSql = "DELETE FROM radacct WHERE acctstoptime IS NOT NULL AND DATE_FORMAT(acctstoptime,'%m-%d-%y') < DATE_FORMAT(NOW(),'%m-%d-%y') OR DATE_ADD(acctupdatetime,INTERVAL 20 MINUTE)<NOW()";
			if (updateTable(tableName)) {
				System.out.println("开始----" + new Date().getTime());
				totalTime();
				System.out.println("结束----" + new Date().getTime());
				jdbcTemplate.update(sql);
				jdbcTemplate.update(delSql);
				System.out.println("成功");
			}

		} catch (Exception e) {
			log.error("用户登陆表更换名称出错", e);
		}

	}

	/**
	 * zsk 累计时长统计插入 （每天晚上0点进行数据的运算操作）
	 */
	public void totalTime() throws ParseException {
		System.out.println("开始----" + new Date().getTime());
		String totalSql = "SELECT ss.id AS siteId,ss.site_name,c.* FROM (SELECT s.site_name,r.nasid,s.id FROM t_cloud_site_routers r LEFT JOIN t_cloud_site s ON r.site_id=s.id WHERE s.id IN(SELECT site_id FROM t8_site_portal_auth_retance WHERE auth_type_id=7)) AS ss LEFT JOIN  (SELECT  GROUP_CONCAT(username) usernames,GROUP_CONCAT(acctstarttime) AS acctstarttimes,GROUP_CONCAT(acctupdatetime) AS acctupdatetimes,GROUP_CONCAT(acctstoptime) AS acctstoptimes,nasid FROM radacct WHERE acctstoptime IS NOT NULL  GROUP BY username) AS c ON ss.nasid=c.nasid GROUP BY ss.id";
		Object[] param = null;
		RowMapper rm = ParameterizedBeanPropertyRowMapper.newInstance(UserTemporaryTotalLog.class);
		List<UserTemporaryTotalLog> listUTT = jdbcTemplate.query(totalSql, param, rm);
		String start = "";
		String stop = "";
		long totalTime = 0;
		if (listUTT.size() > 0) {
			// 进行运算进行数据库录入操作
			String sql = "INSERT INTO t8_user_total_time_have (site_id,site_name,user_name,total_time,start_date,end_date,create_time) VALUES ";
			StringBuffer sbf = new StringBuffer();
			for (int i = 0; i < listUTT.size(); i++) {
				if (listUTT.get(i).getUsernames() != null && !"".equals(listUTT.get(i).getUsernames())
						&& listUTT.get(i).getNasid() != null && !"".equals(listUTT.get(i).getNasid())) {
					long totaHour = 0;
					UserTotalTimeHave utt = new UserTotalTimeHave();
					UserTemporaryTotalLog userTTotalLog = listUTT.get(i);
					if (userTTotalLog.getAcctstarttimes() != "") {
						String stops = userTTotalLog.getAcctstoptimes() == "" ? userTTotalLog.getAcctupdatetimes()
								: userTTotalLog.getAcctstoptimes();
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
								totaHour = totalTime < 0 ? 0 : totalTime;
								sbf.append("(" + "'" + userTTotalLog.getSiteId() + "'" + "," + "'"
										+ userTTotalLog.getSite_name() + "'" + "," + "'"
										+ userTTotalLog.getUsernames().split(",")[0] + "'" + "," + "'"
										+ DateUtil.dayHour(totaHour) + "'" + "," + "'" + start + "'" + "," + "'" + stop
										+ "'" + "," + "'" + CalendarUtil.outingday() + "'" + ")" + ",");

							}
						}
					}
				}
			}
			if (!sbf.equals("") && sbf.length() > 2) {
				int res = jdbcTemplate.update(sql + sbf.toString().substring(0, sbf.toString().length() - 1));
				System.out.println("结束----" + new Date().getTime());
			}

		}
	}

	public boolean updateTable(String tableName) {
		boolean flag = true;
		String table = "select TABLE_NAME from INFORMATION_SCHEMA.TABLES where TABLE_NAME='" + tableName + "'";
		String sql = "CREATE TABLE " + tableName + "(" + "`radacctid` bigint(21) NOT NULL AUTO_INCREMENT,"
				+ "`terminal_device` text COMMENT '设备类型'," + "`acctsessionid` varchar(64) NOT NULL DEFAULT '',"
				+ "`acctuniqueid` varchar(32) NOT NULL DEFAULT ''," + "`username` varchar(64) NOT NULL DEFAULT '',"
				+ "`groupname` varchar(64) NOT NULL DEFAULT ''," + "`realm` varchar(64) DEFAULT '',"
				+ "`nasipaddress` varchar(15) NOT NULL DEFAULT ''," + "`nasportid` varchar(15) DEFAULT NULL,"
				+ "`nasporttype` varchar(32) DEFAULT NULL," + "`acctstarttime` datetime DEFAULT NULL,"
				+ "`acctupdatetime` datetime DEFAULT NULL," + "`acctstoptime` datetime DEFAULT NULL,"
				+ "`acctinterval` int(12) DEFAULT NULL," + "`acctsessiontime` int(12) unsigned DEFAULT NULL,"
				+ "`acctauthentic` varchar(32) DEFAULT NULL," + "`connectinfo_start` varchar(50) DEFAULT NULL,"
				+ "`connectinfo_stop` varchar(50) DEFAULT NULL," + "`acctinputoctets` bigint(20) DEFAULT NULL,"
				+ "`acctoutputoctets` bigint(20) DEFAULT NULL," + "`calledstationid` varchar(50) NOT NULL DEFAULT '',"
				+ "`callingstationid` varchar(50) NOT NULL DEFAULT '',"
				+ "`acctterminatecause` varchar(32) NOT NULL DEFAULT ''," + "`servicetype` varchar(32) DEFAULT NULL,"
				+ "`framedprotocol` varchar(32) DEFAULT NULL," + "`framedipaddress` varchar(15) NOT NULL DEFAULT '',"
				+ "`acctstartdelay` int(12) DEFAULT NULL," + "`acctstopdelay` int(12) DEFAULT NULL,"
				+ "`xascendsessionsvrkey` varchar(10) DEFAULT NULL," + "`nasid` varchar(45) DEFAULT NULL,"
				+ "PRIMARY KEY (`radacctid`)," + "UNIQUE KEY `acctuniqueid` (`acctuniqueid`),"
				+ "KEY `username` (`username`)," + "KEY `framedipaddress` (`framedipaddress`),"
				+ "KEY `acctsessionid` (`acctsessionid`)," + "KEY `acctsessiontime` (`acctsessiontime`),"
				+ "KEY `acctstarttime` (`acctstarttime`)," + "KEY `acctinterval` (`acctinterval`),"
				+ "KEY `acctstoptime` (`acctstoptime`)," + "KEY `nasipaddress` (`nasipaddress`)" + ");";
		try {
			List<String> isTable = jdbcTemplate.queryForList(table, String.class);

			if (isTable != null && isTable.size() != 0) {
				log.error("该表已存在");
				flag = false;
			} else {
				jdbcTemplate.update(sql);
			}
		} catch (Exception e) {
			log.error("修改用户登陆表时出错", e);
			flag = false;
		}

		return flag;
	}

	/**
	 * 获取Ros配置文件字符串
	 * 
	 * @Description:
	 * @return
	 * @Date 2016年6月27日 下午3:25:04
	 * @Author cuimiao
	 */
	public String getConfigStrForRos(String wanPort, String lanPort, String nasid, String secret) {
		StringBuffer sb = new StringBuffer();
		/** --------------配置文件----------- */
		sb.append("/interface set " + wanPort + " name=\"" + wanPort + "-gateway\";");
		sb.append("\r\n");// 换行符
		sb.append(
				"/ip dhcp-client add interface=" + wanPort + "-gateway disabled=no comment=\"default configuration\";");
		sb.append("\r\n");// 换行符
		sb.append("/interface bridge add name=bridge-local disabled=no auto-mac=yes protocol-mode=rstp;");
		sb.append("\r\n");// 换行符
		sb.append("/ip address add address=192.168.88.1/24 interface=bridge-local comment=\"default configuration\";");
		sb.append("\r\n");// 换行符
		sb.append("/ip pool add name=\"default-dhcp\" ranges=192.168.88.10-192.168.88.254;");
		sb.append("\r\n");// 换行符
		sb.append(
				"/ip dhcp-server add name=default address-pool=\"default-dhcp\" interface=bridge-local lease-time=10m disabled=no;");
		sb.append("\r\n");// 换行符
		sb.append(
				"/ip dhcp-server network add address=192.168.88.0/24 gateway=192.168.88.1 comment=\"default configuration\";");
		sb.append("\r\n");// 换行符
		sb.append("/ip dns set allow-remote-requests=yes");
		sb.append("\r\n");// 换行符
		sb.append("/ip dns static add name=router address=192.168.88.1");
		sb.append("\r\n");// 换行符
		sb.append("/ip dns static add name=alidns1 address=223.5.5.5");
		sb.append("\r\n");// 换行符
		sb.append("/ip dns static add name=alidns2 address=223.6.6.6");
		sb.append("\r\n");// 换行符
		sb.append("/ip firewall nat add chain=srcnat out-interface=" + wanPort
				+ "-gateway action=masquerade comment=\"default configuration\"");
		sb.append("\r\n");// 换行符
		sb.append("/ip neighbor discovery set [find name=\"" + wanPort + "-gateway\"] discover=no");
		sb.append("\r\n");// 换行符
		sb.append("/ip hotspot profile add hotspot-address=10.5.50.1 name=hsprof1");
		sb.append("\r\n");// 换行符
		sb.append("/ip pool add name=hs-pool-3 ranges=10.5.48.1-10.5.63.254");
		sb.append("\r\n");// 换行符
		sb.append("/interface bridge add name=\"HS_bridge\" disabled=no auto-mac=yes protocol-mode=rstp");
		sb.append("\r\n");// 换行符
		sb.append(
				"/interface wireless set wlan1 mode=ap-bridge ssid=FXWX_HOTSPOT default-forwarding=no disabled=no band=2ghz-b/g/n");
		sb.append("\r\n");// 换行符
		sb.append(
				"/interface wireless set wlan2 mode=ap-bridge ssid=@FXWX_HOTSPOT default-forwarding=no disabled=no band=5ghz-a/n/ac");
		sb.append("\r\n");// 换行符
		sb.append(
				"/ip dhcp-server add address-pool=hs-pool-3 disabled=no interface=HS_bridge lease-time=1h name=dhcp1");
		sb.append("\r\n");// 换行符
		sb.append(
				"/ip hotspot add address-pool=hs-pool-3 disabled=no interface=HS_bridge name=hotspot1 profile=hsprof1");
		sb.append("\r\n");// 换行符
		sb.append(
				"/ip address add address=10.5.50.1/20 comment=\"fxwx network\" interface=HS_bridge network=10.5.48.0");
		sb.append("\r\n");// 换行符
		sb.append("/ip dhcp-server network add address=10.5.48.0/20 comment=\"hotspot network\" gateway=10.5.50.1");
		sb.append("\r\n");// 换行符
		sb.append(
				"/ip firewall nat add action=masquerade chain=srcnat comment=\"masquerade hotspot network\" src-address=10.5.48.0/20");
		sb.append("\r\n");// 换行符
		sb.append("/ip hotspot user add name=admin");
		sb.append("\r\n");// 换行符
		sb.append("/ip hotspot profile set hsprof1 use-radius=yes");
		sb.append("\r\n");// 换行符
		sb.append("/ip hotspot profile set hsprof1 login-by=http-pap,http-chap,https");
		sb.append("\r\n");// 换行符
		sb.append("/radius add service=hotspot address=60.205.123.78 secret=" + secret + " timeout=3000ms");
		sb.append("\r\n");// 换行符
		sb.append("/radius add service=hotspot address=182.92.149.4 secret=" + secret + " timeout=3000ms");
		sb.append("\r\n");// 换行符
		sb.append("/ip hotspot walled-garden add dst-host=portal.fxwxwifi.com");
		sb.append("\r\n");// 换行符
		sb.append("/ip hotspot walled-garden add dst-host=school-pic.oss-cn-beijing.aliyuncs.com");
		sb.append("\r\n");// 换行符
		sb.append("/ip hotspot walled-garden add dst-host=cache.fxwxwifi.cn");
		sb.append("\r\n");// 换行符
		sb.append("/ip hotspot walled-garden add dst-host=edu.solarsys.cn");
		sb.append("\r\n");// 换行符
		sb.append("/ip hotspot walled-garden add dst-host=oss.fxwxwl.com");
		sb.append("\r\n");// 换行符
		sb.append("/ip hotspot walled-garden add dst-host=oss.solarsys.cn");
		sb.append("\r\n");// 换行符
		sb.append("/ip hotspot walled-garden add dst-host=m.jdpay.com");
		sb.append("\r\n");// 换行符
		sb.append("/ip hotspot walled-garden add dst-host=ss.symcd.com");
		sb.append("\r\n");// 换行符
		sb.append("/ip hotspot walled-garden add dst-host=tongjissl.jdpay.com");
		sb.append("\r\n");// 换行符
		sb.append("/ip hotspot walled-garden add dst-host=plus.jdpay.com");
		sb.append("\r\n");// 换行符
		sb.append("/ip hotspot walled-garden add dst-host=static.jdpay.com");
		sb.append("\r\n");// 换行符
		sb.append("/ip hotspot walled-garden add dst-host=img14.360buyimg.com");
		sb.append("\r\n");// 换行符
		sb.append("/ip hotspot walled-garden add dst-host=img11.360buyimg.com");
		sb.append("\r\n");// 换行符
		sb.append("/ip hotspot walled-garden add dst-host=img30.360buyimg.com");
		sb.append("\r\n");// 换行符
		sb.append("/ip hotspot walled-garden add dst-host=img13.360buyimg.com");
		sb.append("\r\n");// 换行符
		sb.append("/ip hotspot walled-garden add dst-host=img20.360buyimg.com");
		sb.append("\r\n");// 换行符
		sb.append("/ip hotspot walled-garden add dst-host=img12.360buyimg.com");
		sb.append("\r\n");// 换行符
		sb.append("/ip hotspot walled-garden add dst-host=m.wangyin.com");
		sb.append("\r\n");// 换行符
		sb.append("/ip hotspot walled-garden add dst-host=wappaygw.alipay.com");
		sb.append("\r\n");// 换行符
		sb.append("/ip hotspot walled-garden add dst-host=c.cnzz.com");
		sb.append("\r\n");// 换行符
		sb.append("/ip hotspot walled-garden add dst-host=as.alipayobjects.com");
		sb.append("\r\n");// 换行符
		sb.append("/ip hotspot walled-garden add dst-host=a.alipayobjects.com");
		sb.append("\r\n");// 换行符
		sb.append("/ip hotspot walled-garden add dst-host=bb.ahjem.com");
		sb.append("\r\n");// 换行符
		sb.append("/ip hotspot walled-garden add dst-host=sd.symcd.com");
		sb.append("\r\n");// 换行符
		sb.append("/ip hotspot walled-garden add dst-host=g.alicdn.com");
		sb.append("\r\n");// 换行符
		sb.append("/ip hotspot walled-garden add dst-host=ocsp2.globalsign.com");
		sb.append("\r\n");// 换行符
		sb.append("/ip hotspot walled-garden add dst-host=ynuf.alipay.com");
		sb.append("\r\n");// 换行符
		sb.append("/ip hotspot walled-garden add dst-host=ss.symcd.com");
		sb.append("\r\n");// 换行符
		sb.append("/ip hotspot walled-garden add dst-host=mclient.alipay.com");
		sb.append("\r\n");// 换行符
		sb.append("/ip hotspot walled-garden add dst-host=rds.alipay.com");
		sb.append("\r\n");// 换行符
		sb.append("/ip hotspot walled-garden add dst-host=i.alipayobjects.com");
		sb.append("\r\n");// 换行符
		sb.append("/ip hotspot walled-garden add dst-host=t.alipayobjects.com");
		sb.append("\r\n");// 换行符
		sb.append("/ip hotspot walled-garden add dst-host=mapi.alipay.com");
		sb.append("\r\n");// 换行符
		sb.append("/ip hotspot walled-garden add dst-host=unitradeadapter.alipay.com");
		sb.append("\r\n");// 换行符
		sb.append("/ip hotspot walled-garden add dst-host=excashier.alipay.com");
		sb.append("\r\n");// 换行符
		sb.append("/ip hotspot walled-garden add dst-host=assets.alicdn.com");
		sb.append("\r\n");// 换行符
		sb.append("/ip hotspot walled-garden add dst-host=kcart.alipay.com");
		sb.append("\r\n");// 换行符
		sb.append("/ip hotspot walled-garden add dst-host=log.mmstat.com");
		sb.append("\r\n");// 换行符
		sb.append("/ip hotspot walled-garden add dst-host=acjs.aliyun.com");
		sb.append("\r\n");// 换行符
		sb.append("/ip hotspot walled-garden add dst-host=omeo.alipay.com");
		sb.append("\r\n");// 换行符
		sb.append("/ip hotspot walled-garden add dst-host=unitradeprod.alipay.com");
		sb.append("\r\n");// 换行符
		sb.append("/ip hotspot walled-garden ip add dst-address=58.211.137.192");
		sb.append("\r\n");// 换行符
		sb.append("/ip hotspot walled-garden ip add dst-address=58.216.10.24");
		sb.append("\r\n");// 换行符
		sb.append("/ip hotspot walled-garden ip add dst-address=23.59.139.27");
		sb.append("\r\n");// 换行符
		sb.append("/ip hotspot walled-garden ip add dst-address=23.13.171.27");
		sb.append("\r\n");// 换行符
		sb.append("/ip hotspot walled-garden ip add dst-address=23.49.139.27");
		sb.append("\r\n");// 换行符
		sb.append("/ip hotspot walled-garden ip add dst-address=122.225.34.223/24");
		sb.append("\r\n");// 换行符
		sb.append("/ip hotspot walled-garden ip add dst-address=122.228.95.95/24");
		sb.append("\r\n");// 换行符
		sb.append("/ip hotspot walled-garden ip add dst-address=117.34.112.192/27");
		sb.append("\r\n");// 换行符
		sb.append("/ip hotspot walled-garden ip add dst-address=117.71.17.110/27");
		sb.append("\r\n");// 换行符
		sb.append("/ip hotspot walled-garden ip add dst-address=124.193.226.240/27");
		sb.append("\r\n");// 换行符
		sb.append("/ip hotspot walled-garden ip add dst-address=140.205.153.72/16");
		sb.append("\r\n");// 换行符
		sb.append("/ip hotspot walled-garden ip add dst-address=110.76.18.203/16");
		sb.append("\r\n");// 换行符
		sb.append("/ip hotspot walled-garden ip add dst-address=110.75.158.71/16");
		sb.append("\r\n");// 换行符
		sb.append("/ip hotspot walled-garden ip add dst-address=202.108.250.240/24");
		sb.append("\r\n");// 换行符
		sb.append("/ip hotspot profile set radius-interim-update=5m numbers=hsprof1");
		sb.append("\r\n");// 换行符
		sb.append(
				"/ip firewall filter add action=accept chain=input disabled=no dst-port=8291 protocol=tcp place-before=0 comment=\"Allow WinBox from WAN\"");
		sb.append("\r\n");// 换行符
		sb.append("/system clock set time-zone-autodetect=no time-zone-name=manual");
		sb.append("\r\n");// 换行符
		sb.append("/system clock manual set time-zone=gmt dst-delta=+00:00");
		sb.append("\r\n");// 换行符
		sb.append("/system ntp client set enabled=yes server-dns-names=cn.pool.ntp.org");
		sb.append("\r\n");// 换行符
		sb.append(
				"/system scheduler add interval=1h name=up on-event=\"/tool fetch keep-result=no mode=http address=edu1.solarsys.cn host=edu1.solarsys.cn src-path=(\\\"cloud/rh\\\\\\?mac=\\\".[/interface ethernet get 0 mac-address].\\\"&nasid=\\\".[/system identity get name].\\\"&os_date=Mikrotik&uptime=\\\".[/system clock get time].\\\"%20up%20\\\".[/system resource get uptime].\\\",%20load%20average:%20\\\".[/system resource get cpu-load].\\\"%25\\\")\" policy=ftp,reboot,read,write,policy,test,password,sniff,sensitive start-date=jan/01/1970 start-time=01:00:00");
		sb.append("\r\n");// 换行符
		sb.append("/ip hotspot user profile set default shared-users=5");
		sb.append("\r\n");// 换行符
		sb.append("/system identity set name=" + nasid + "");
		sb.append("\r\n");// 换行符
		sb.append("/interface bridge port add bridge=HS_bridge interface=" + lanPort + "");
		sb.append("\r\n");// 换行符
		sb.append(
				":if ([:len [/file find name=flash]] > 0) do={/ip hotspot profile set html-directory=/flash/hotspot;/tool fetch url=http://oss.solarsys.cn/firmware/mikrotik/login.html dst-path=/flash/hotspot/login.html mode=http;/tool fetch url=http://oss.solarsys.cn/firmware/mikrotik/alogin.html dst-path=/flash/hotspot/alogin.html mode=http;} else={/ip hotspot profile set html-directory=/hotspot;/tool fetch url=http://oss.solarsys.cn/firmware/mikrotik/login.html dst-path=/hotspot/login.html mode=http;/tool fetch url=http://oss.solarsys.cn/firmware/mikrotik/alogin.html dst-path=/hotspot/alogin.html mode=http;}");
		return sb.toString();
	}

	/**
	 * 将banner_url追加至数据库
	 * 
	 * @Description:
	 * @param bannerUrl
	 * @param siteId
	 * @return
	 * @Date 2016年6月29日 下午2:22:52
	 * @Author cuimiao
	 */
	public int updateBanner(String bannerUrl, String siteId) {
		// 更新条数，当为0时表示更新失败
		int count = 0;
		// 查询该场所下的bannerUrl
		StringBuffer sqlSelect = new StringBuffer();
		sqlSelect.append(" select banner_url");

		sqlSelect.append(" from t_cloud_site");
		sqlSelect.append(" where id = ?");

		String oldUrls = jdbcTemplate.queryForObject(sqlSelect.toString(), String.class, new Object[] { siteId });

		StringBuffer sqlUpdate = new StringBuffer();
		sqlUpdate.append(" update t_cloud_site ");
		sqlUpdate.append(" set banner_url = ? ");
		sqlUpdate.append(" where id = ?");
		// 没有老url
		count = jdbcTemplate.update(sqlUpdate.toString(), new Object[] { bannerUrl, siteId });
		return count;
	}

	/**
	 * 获取bannerUrls
	 * 
	 * @Description:
	 * @param siteId
	 * @return
	 * @Date 2016年6月29日 下午5:48:46
	 * @Author cuimiao
	 */
	public String getBannerUrls(String siteId) {
		// 查询该场所下的bannerUrl
		StringBuffer sqlSelect = new StringBuffer();
		sqlSelect.append(" select banner_url");
		sqlSelect.append(" from t_cloud_site");
		sqlSelect.append(" where id = ?");
		String urls = jdbcTemplate.queryForObject(sqlSelect.toString(), String.class, new Object[] { siteId });
		return urls;
	}

	/**
	 * @Description 检测nasid是否存在
	 * @date 2016年8月31日下午2:42:26
	 * @author guoyingjie
	 * @param nasid
	 * @return
	 */
	public boolean getNasid(String nasid) {
		String sql = "SELECT nasid FROM t_cloud_site_routers where nasid=?";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql, nasid);
		if (list.size() > 0 && list != null && list.get(0).get("nasid") != null
				&& !"".equals(list.get(0).get("nasid"))) {
			return true;
		} else {
			return false;
		}
	}

	/**
	 * @Description nasid获得路由表
	 * @date 2016年8月31日下午2:42:26
	 * @author guoyingjie
	 * @param nasid
	 * @return
	 */
	public CloudSiteRouters getRouterByNasid(String nasid) {
		CloudSiteRouters router = null;
		try {
			router = nutDao.fetch(CloudSiteRouters.class, Cnd.where("nasid", "=", nasid));
		} catch (Exception e) {
			log.error("获得nasid获得路由表异常");
		}
		return router;
	}

	/**
	 * @Description 获得场所的上传与下载速度
	 * @date 2016年9月2日下午5:10:14
	 * @author guoyingjie
	 * @param nasid
	 * @param type
	 * @return
	 */
	public String[] getUpAndDown(String nasid, String type) {
		String[] str = new String[2];
		if ("ros".equals(type)) {
			String sql = "SELECT value FROM  radgroupreply  WHERE groupname = ? AND attribute = 'Mikrotik-Rate-Limit'";
			String updown = jdbcTemplate.queryForObject(sql, new Object[] { nasid }, String.class);
			if (updown != null && !"".equals(updown)) {
				str[0] = updown.split("/")[0];
				str[1] = updown.split("/")[1];
			}
		} else if ("coovachilli".equals(type)) {// 小辣椒上传速度以bit计算，所以在maxUpSpeed和maxDownSpeed
			String upSpeed = "SELECT value FROM  radgroupreply  WHERE groupname = ? AND attribute = 'ChilliSpot-Bandwidth-Max-Up'";
			String downSpeed = "SELECT value FROM  radgroupreply  WHERE groupname = ? AND attribute = 'ChilliSpot-Bandwidth-Max-Down'";
			str[0] = jdbcTemplate.queryForObject(upSpeed, new Object[] { nasid }, String.class) + "B";
			str[1] = jdbcTemplate.queryForObject(downSpeed, new Object[] { nasid }, String.class) + "B";
		} else if ("ikuai".equals(type)) {// ikuai的限速单位为kb,前端穿过来就是kb单位
			String upSpeed = "SELECT value FROM  radgroupreply  WHERE groupname = ? AND attribute = 'RP-Upstream-Speed-Limit'";
			String downSpeed = "SELECT value FROM  radgroupreply  WHERE groupname = ? AND attribute = 'RP-Downstream-Speed-Limit'";
			str[0] = jdbcTemplate.queryForObject(upSpeed, new Object[] { nasid }, String.class) + "KB";
			str[1] = jdbcTemplate.queryForObject(downSpeed, new Object[] { nasid }, String.class) + "KB";
		} else if ("h3c".equals(type)) {
			String upSpeed = "SELECT value FROM  radgroupreply  WHERE groupname = ? AND attribute = 'Huawei-Input-Burst-Size'";
			String downSpeed = "SELECT value FROM  radgroupreply  WHERE groupname = ? AND attribute = 'Huawei-Output-Burst-Size'";
			str[0] = jdbcTemplate.queryForObject(upSpeed, new Object[] { nasid }, String.class) + "B";
			str[1] = jdbcTemplate.queryForObject(downSpeed, new Object[] { nasid }, String.class) + "B";
		} else if ("moto".equals(type)) {
			// String upSpeed = "SELECT value FROM radgroupreply WHERE groupname
			// = ?";
			// String downSpeed = "SELECT value FROM radgroupreply WHERE
			// groupname = ?";
			str[0] = "无限制";
			str[1] = "无限制";
		}
		return str;
	}

	/**
	 * 删除场所缓存
	 * 
	 * @param siteId
	 * @return
	 */
	public void delMemcachedSite(int siteId) {
		String sql = "SELECT nasid FROM t_cloud_site_routers WHERE site_id=?";
		List<String> lsNasid = jdbcTemplate.queryForList(sql, new Object[] { siteId }, String.class);
		if (lsNasid.size() > 0) {
			for (int i = 0; i < lsNasid.size(); i++) {
				MemcachedUtils.delete(lsNasid.get(i));
			}
		}
		MemcachedUtils.delete(siteId + "");
	}

	/**
	 * h3c设备绑定加入认证方式
	 * 
	 * @param nasid
	 * @param type
	 * @return
	 */
	public boolean addDeviceSecretType(String nasid, int type) {
		AuthType at = new AuthType();
		at.setNasid(nasid);
		at.setSecreType(type);
		return nutDao.insert(at).getId() > 0 ? true : false;
	}

	/**
	 * 获取场所下AP总数
	 * @return
	 */
	public int getSiteAPCount(int siteId)
	{
		/*String sql="SELECT COUNT(client_mac) FROM `t_portal_user` WHERE t7_site_id=?";*/
		String sql="SELECT SUM(mac) FROM `t_cloud_site_routers`  WHERE site_id =?";
		return jdbcTemplate.queryForInt(sql, new Object[] { siteId });
	}
	
	/**
	 * 获取场所上线AP
	 * @param userId
	 */
	public void getAPNum(int userId,int siteId){
		/*String sql="select id from t_cloud_site WHERE user_id=?";
		StringBuffer sf=new StringBuffer();
		sf.append("SELECT COUNT(a1.calledstationid) FROM (SELECT * FROM radacct WHERE DATE_FORMAT(acctstarttime,'%Y-%m-%d') = DATE_FORMAT(NOW(),'%Y-%m-%d')  GROUP BY calledstationid) AS a1 WHERE a1.nasid IN (SELECT nasid FROM t_cloud_site_routers WHERE site_id in  (");
		List<Map<String, Object>> queryForList = jdbcTemplate.queryForList(sql,userId);
		for(int i=0;i<queryForList.size();i++){
			Integer siteId=(Integer) queryForList.get(i).get("id");
			sf.append(siteId); 
			sf.append(",");
		}
		sf.append(")");
		return jdbcTemplate.queryForInt(sf.toString());*/
	}
	
	/**
	 * h3c设备加入无感知认证
	 * 
	 * @param nasid
	 * @param type
	 * @return
	 */
	public boolean addDevicePerceptualAuthentication(String nasid, int typeId, int cycleTime) {
		RoutersAuthRetance routersAuthRetance = new RoutersAuthRetance();
		routersAuthRetance.setNasid(nasid);
		routersAuthRetance.setAuthTypeId(typeId);
		routersAuthRetance.setCycleTime(cycleTime);
		routersAuthRetance.setCreateTime(Timestamp.valueOf(DateUtil.getStringDate()));
		return nutDao.insert(routersAuthRetance).getId() > 0 ? true : false;
	}
	 
	
	
	/*
	int count = 0;
	try {
		String sql = "";
		if (-1 == siteId) {
			sql = "SELECT COUNT(a1.calledstationid) FROM (SELECT * FROM radacct WHERE DATE_FORMAT(acctstarttime,'%Y-%m-%d') = ? GROUP BY calledstationid) AS a1 WHERE a1.nasid IN (SELECT nasid FROM t_cloud_site_routers WHERE site_id IN (SELECT id FROM t_cloud_site WHERE user_id = ?))";
			String today = DateUtil.date2StringShort(new Date());
			count = jdbcTemplate.queryForInt(sql, today, userId);
		} else {
			sql = "SELECT COUNT(a1.calledstationid) FROM (SELECT * FROM radacct WHERE DATE_FORMAT(acctstarttime,'%Y-%m-%d') = ? GROUP BY calledstationid) AS a1 WHERE a1.nasid IN (SELECT nasid FROM t_cloud_site_routers WHERE site_id = ?)";
			String today = DateUtil.date2StringShort(new Date());
			count = jdbcTemplate.queryForInt(sql, today, siteId);
		}
	} catch (Exception e) {
		e.printStackTrace();
		log.error("获得场所的AP数量失败");
	}
	return count;*/
}
