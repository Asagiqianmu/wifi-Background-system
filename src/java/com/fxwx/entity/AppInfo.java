package com.fxwx.entity;
import java.sql.Timestamp;

import org.nutz.dao.entity.annotation.Column;
import org.nutz.dao.entity.annotation.Id;
import org.nutz.dao.entity.annotation.Table;

/**
 * 
 * @author zsk
 * app信息表
 */
@Table("t8_app_info")
public class AppInfo {
	
	@Id
	private int id;// 主键
	@Column("appname")
	private String appName;//app名称
	
	@Column("appid")
	private String appId;//appId 系统分配
	
	@Column("sercetKey")
	private String sercetKey;//密钥

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getAppName() {
		return appName;
	}

	public void setAppName(String appName) {
		this.appName = appName;
	}

	public String getAppId() {
		return appId;
	}

	public void setAppId(String appId) {
		this.appId = appId;
	}

	public String getSercetKey() {
		return sercetKey;
	}

	public void setSercetKey(String sercetKey) {
		this.sercetKey = sercetKey;
	}

	@Override
	public String toString() {
		return "AppInfo [id=" + id + ", appName=" + appName + ", appId=" + appId + ", sercetKey=" + sercetKey + "]";
	}
	

}
