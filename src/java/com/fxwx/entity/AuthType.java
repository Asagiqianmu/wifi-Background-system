package com.fxwx.entity;
import java.sql.Timestamp;

import org.nutz.dao.entity.annotation.Column;
import org.nutz.dao.entity.annotation.Id;
import org.nutz.dao.entity.annotation.Table;

@Table("t7_auth_type")
public class AuthType {
	
	@Id
	private int id;// 主键
	
	@Column("nasid")
	private String nasid;//路由标识即归属场所
	
	@Column("secretype")
	private int secreType;//认证方式

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

	public int getSecreType() {
		return secreType;
	}

	public void setSecreType(int secreType) {
		this.secreType = secreType;
	}

	@Override
	public String toString() {
		return "AuthType [id=" + id + ", nasid=" + nasid + ", secreType=" + secreType + "]";
	}
	
	
}
