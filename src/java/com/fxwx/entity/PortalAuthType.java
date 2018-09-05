package com.fxwx.entity;
import java.sql.Date;
import java.sql.Timestamp;

import org.nutz.dao.entity.annotation.Column;
import org.nutz.dao.entity.annotation.Id;
import org.nutz.dao.entity.annotation.Table;

@Table("t8_protal_auth_type")
public class PortalAuthType {
	
	@Id
	private int id;// 主键
	
	@Column("type_name")
	private String name;//认证方式名称
	
	@Column("create_time")
	private Date createTime;//认证方式 
	

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Date getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}

	@Override
	public String toString() {
		return "PortalAuthType [id=" + id + ", name=" + name + ", createTime="
				+ createTime + "]";
	}

}
