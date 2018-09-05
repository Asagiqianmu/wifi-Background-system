package com.fxwx.entity;

import java.util.Date;

import org.nutz.dao.entity.annotation.Column;
import org.nutz.dao.entity.annotation.Id;
import org.nutz.dao.entity.annotation.Table;

@Table("t_user_lock")
public class UserLock {
	@Column("id")
	@Id
	private int id;
	@Column("telephone")
	private String telephone;
	@Column("logintime")
	private Date loginTime;
	@Column("state")
	private int state;
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getTelephone() {
		return telephone;
	}
	public void setTelephone(String telephone) {
		this.telephone = telephone;
	}
	public Date getLoginTime() {
		return loginTime;
	}
	public void setLoginTime(Date loginTime) {
		this.loginTime = loginTime;
	}
	public int getState() {
		return state;
	}
	public void setState(int state) {
		this.state = state;
	}
	@Override
	public String toString() {
		return "UserLock [id=" + id + ", telephone=" + telephone
				+ ", loginTime=" + loginTime + ", state=" + state + "]";
	}
	
}
