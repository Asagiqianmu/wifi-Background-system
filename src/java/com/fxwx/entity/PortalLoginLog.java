package com.fxwx.entity;

import java.sql.Timestamp;

public class PortalLoginLog {
	private int id;
	private int siteId;
	private String user_name;
	private int state;//登录状态，1为成功，0，为失败
	private Timestamp createTime;//创建时间
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
	public String getUser_name() {
		return user_name;
	}
	public void setUser_name(String user_name) {
		this.user_name = user_name;
	}
	public int getState() {
		return state;
	}
	public void setState(int state) {
		this.state = state;
	}
	public Timestamp getCreateTime() {
		return createTime;
	}
	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}
	@Override
	public String toString() {
		return "PortalLoginLog [id=" + id + ", siteId=" + siteId + ", user_name=" + user_name + ", state=" + state + ", createTime=" + createTime + "]";
	}
	
}
