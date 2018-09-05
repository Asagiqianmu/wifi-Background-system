package com.fxwx.entity;

import java.sql.Timestamp;

import org.nutz.dao.entity.annotation.Column;
import org.nutz.dao.entity.annotation.Id;
import org.nutz.dao.entity.annotation.Table;


@Table("t6_msg_log")
public class MsgLog {
	
	@Id
	private int id;
	@Column("add_ip")
	private String addIp;//外网ip
	@Column("msg_id")
	private String msgId;//短信模板id
	@Column("user_name")
	private String userName;//用户名
	@Column("msg_text")
	private String msgText;//短信描述
	@Column("create_time")
	private Timestamp createTime;//创建时间
	 
	 
	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getAddIp() {
		return addIp;
	}

	public void setAddIp(String addIp) {
		this.addIp = addIp;
	}

	public String getMsgId() {
		return msgId;
	}

	public void setMsgId(String msgId) {
		this.msgId = msgId;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getMsgText() {
		return msgText;
	}

	public void setMsgText(String msgText) {
		this.msgText = msgText;
	}

	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}
 
}
