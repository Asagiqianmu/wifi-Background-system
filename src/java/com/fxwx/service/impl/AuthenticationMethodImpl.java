package com.fxwx.service.impl;

import java.util.Date;
import java.util.List;
import java.util.UUID;

import javax.annotation.Resource;

import org.nutz.dao.Cnd;
import org.nutz.dao.Dao;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.simple.ParameterizedBeanPropertyRowMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fxwx.entity.AppInfo;
import com.fxwx.entity.PortalAuthType;
import com.fxwx.entity.SiteAppRetance;
import com.fxwx.entity.SitePortalAuthRetance;

/**
 * 
 * 版本信息:
 * 
 * @author:E-mail:dengfei200857@163.com
 * @date: 2017年8月18日 上午9:54:16
 * @Description:认证方式
 * @version: V1.0 版权所有
 */
@Service
@Transactional
public class AuthenticationMethodImpl {

	@Resource(name = "nutDao")
	private Dao nutDao;

	@Resource(name = "jdbcTemplate")
	private JdbcTemplate jdbcTemplate;

	/**
	 * 
	 * @author:E-mail:dengfei200857@163.com
	 * @date: 2017年8月18日 上午9:58:29
	 * @Description: 查询认证状态
	 * @param:
	 * @return
	 */
	public List<PortalAuthType> pAuthList() {
		// 查询所有认证状态，进行展示
		return nutDao.query(PortalAuthType.class, null);
	}

	public SitePortalAuthRetance findAuth(String siteId) {
		return nutDao.fetch(SitePortalAuthRetance.class, Cnd.where("site_id", "=", siteId));
	}

	/**
	 * 
	 * @author:E-mail:dengfei200857@163.com
	 * @date: 2017年10月26日 上午9:58:29
	 * @Description: 场所绑定APP信息为新用户绑定并且为自定义APP信息
	 * @param:
	 * @return
	 */
	public boolean insertAppInfo(int userId, int siteId, String appName, String appId, String appSecretKey) {
		// 进行APP信息的添加
		AppInfo appInfo = new AppInfo();
		appInfo.setAppId(appId);
		appInfo.setAppName(appName);
		appInfo.setSercetKey(appSecretKey);
		appInfo = nutDao.insert(appInfo);
		if (appInfo != null) {
			// app对应关系表添加对应场所’用户
			SiteAppRetance sar = new SiteAppRetance();
			sar.setAppId(appInfo.getId());
			sar.setSiteId(siteId);
			sar.setUserId(userId);
			sar = nutDao.insert(sar);
			if (sar != null) {
				return true;
			}
		}
		return false;
	}

	/**
	 * 
	 * @author:E-mail:dengfei200857@163.com
	 * @date: 2017年10月26日 上午9:58:29
	 * @Description: 存在绑定APP信息，更新为自定义的APP信息
	 * @param:
	 * @return
	 */
	public boolean updateAppInfo(int sarId, String appName, String appId, String appSecretKey) {
		// 进行APP信息的添加
		AppInfo appInfo = new AppInfo();
		appInfo.setAppId(appId);
		appInfo.setAppName(appName);
		appInfo.setSercetKey(appSecretKey);
		appInfo = nutDao.insert(appInfo);
		if (appInfo != null) {
			String sql = "UPDATE t8_site_app_retance SET app_id = ? WHERE id = ? ";
			int i = jdbcTemplate.update(sql, new Object[] { appInfo.getId(), sarId });
			if (i > 0) {
				return true;
			}
		}
		return false;
	}

	/**
	 * 
	 * @author:E-mail:dengfei200857@163.com
	 * @date: 2017年10月26日 上午9:58:29
	 * @Description: 存在绑定APP信息，并且不为为自定义的APP信息，直接更新对应APP
	 * @param:
	 * @return
	 */
	public boolean updateAppInfoNull(String appInfoId, int sarId) {
		String sql = "UPDATE t8_site_app_retance SET app_id = ? WHERE id = ? ";
		int i = jdbcTemplate.update(sql, new Object[] { appInfoId, sarId });
		if (i > 0) {
			return true;
		}
		return false;
	}

	/**
	 * 
	 * @author:E-mail:dengfei200857@163.com
	 * @date: 2017年10月26日 上午9:58:29
	 * @Description: 不存在绑定APP，并且不是自定义，直接进行添加
	 * @param:
	 * @return
	 */
	public boolean insertAppInfoNull(String appInfoId, int userId, int siteId) {
		// app对应关系表添加对应场所’用户
		SiteAppRetance sar = new SiteAppRetance();
		sar.setSiteId(siteId);
		sar.setUserId(userId);
		sar.setAppId(Integer.parseInt(appInfoId));
		sar = nutDao.insert(sar);
		if (sar != null) {
			return true;
		}
		return false;
	}

	/**
	 * 
	 * @author:E-mail:dengfei200857@163.com
	 * @date: 2017年10月26日 上午9:58:29
	 * @Description: 根据用户ID查询对应用户的APP信息
	 * @param:
	 * @return
	 */
	public List<AppInfo> findAppInfo(int userId) {
		String totalSql = "SELECT*FROM t8_app_info WHERE id IN (SELECT app_id FROM t8_site_app_retance WHERE user_id=?)";
		Object[] param = null;
		RowMapper rm = ParameterizedBeanPropertyRowMapper.newInstance(AppInfo.class);
		param = new Object[] { userId };
		return jdbcTemplate.query(totalSql, param, rm);
	}

	public static void main(String[] args) {
		UUID uuid = UUID.randomUUID();
		String sercetKey = uuid.toString().replace("-", "");
		System.out.println(sercetKey);
		String appId = "fxwx" + new Date().getTime();
		System.out.println(appId);
	}
}
