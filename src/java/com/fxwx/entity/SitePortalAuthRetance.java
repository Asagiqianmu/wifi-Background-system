package com.fxwx.entity;
import java.sql.Date;
import java.sql.Timestamp;

import org.nutz.dao.entity.annotation.Column;
import org.nutz.dao.entity.annotation.Id;
import org.nutz.dao.entity.annotation.Table;

@Table("t8_site_portal_auth_retance")
public class SitePortalAuthRetance {
	
	@Id
	private int id;// 主键
	
	@Column("site_id")
	private int siteId;//场所id
	
	@Column("auth_type_id")
	private int authTypeId;//认证库id
	
	@Column("charging_state")
	private int chargingState;//是否计费 0计费 1不计费
	
	@Column("create_time")
	private Timestamp createTime;//认证方式 
	

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

	public int getAuthTypeId() {
		return authTypeId;
	}

	public void setAuthTypeId(int authTypeId) {
		this.authTypeId = authTypeId;
	}

	public int getChargingState() {
		return chargingState;
	}

	public void setChargingState(int chargingState) {
		this.chargingState = chargingState;
	}

	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@Override
	public String toString() {
		return "SitePortalAuthRetance [id=" + id + ", siteId=" + siteId
				+ ", authTypeId=" + authTypeId + ", chargingState="
				+ chargingState + ", createTime=" + createTime + "]";
	}
	
}
