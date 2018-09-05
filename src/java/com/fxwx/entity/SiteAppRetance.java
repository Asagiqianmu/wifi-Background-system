package com.fxwx.entity;

import org.nutz.dao.entity.annotation.Column;
import org.nutz.dao.entity.annotation.Id;
import org.nutz.dao.entity.annotation.Table;

/**
 * 
 * @author zsk
 * app对应关联表
 */
@Table("t8_site_app_retance")
public class SiteAppRetance {
	
	@Id
	private int id;
	@Column("site_id")
	private int siteId;
	@Column("user_id")
	private int userId;
	@Column("app_id")
	private int appId;
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public int getSiteId() {
		return siteId;
	}
	public void setSiteId(int siteId) {
		this.siteId = siteId;
	}
	public int getUserId() {
		return userId;
	}
	public void setUserId(int userId) {
		this.userId = userId;
	}
	public int getAppId() {
		return appId;
	}
	public void setAppId(int appId) {
		this.appId = appId;
	}
	@Override
	public String toString() {
		return "SiteAppRetance [id=" + id + ", siteId=" + siteId + ", userId=" + userId + ", appId=" + appId + "]";
	}
}
