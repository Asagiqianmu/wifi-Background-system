package com.fxwx.entity;
import java.sql.Timestamp;

import org.nutz.dao.entity.annotation.Column;
import org.nutz.dao.entity.annotation.Id;
import org.nutz.dao.entity.annotation.Table;

@Table("t9_routers_auth_retance")
public class RoutersAuthRetance {
	
	@Id
	private int id;// 主键
	
	@Column("nasid")
	private String nasid;//路由标识即归属场所
	
	@Column("auth_type_id")
	private int authTypeId;//认证方式库id
	@Column("cycle_time")
	private int cycleTime;//周期时间，若为0时无周期限制（单位：小时）
	@Column("create_time")
	private Timestamp createTime;//创建时间
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getNasid() {
		return nasid;
	}
	public void setNasid(String nasid) {
		this.nasid = nasid;
	}
	public int getAuthTypeId() {
		return authTypeId;
	}
	public void setAuthTypeId(int authTypeId) {
		this.authTypeId = authTypeId;
	}
	public int getCycleTime() {
		return cycleTime;
	}
	public void setCycleTime(int cycleTime) {
		this.cycleTime = cycleTime;
	}
	public Timestamp getCreateTime() {
		return createTime;
	}
	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}
	
	@Override
	public String toString() {
		return "RoutersAuthRetance [id=" + id + ", nasid=" + nasid + ", authTypeId=" + authTypeId + ", cycleTime=" + cycleTime + ", createTime=" + createTime + "]";
	}
	
	
}
