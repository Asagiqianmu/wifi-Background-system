package com.fxwx.entity;

import org.nutz.dao.entity.annotation.Column;
import org.nutz.dao.entity.annotation.Id;

/**
 * 商户详细信息
 * Copyright (c) All Rights Reserved, 2016.
 * 版权所有                  fxwx Information Technology Co .,Ltd
 * @Project		newCloud
 * @File		CloudUserDetail.java
 * @Date		2016年7月13日 下午5:47:12
 * @Author		cuimiao
 */
public class CloudUserDetail {
	/**主键*/
	@Id
	private String id;
	/**商户id*/
	@Column
	private String userId;
	/**真实姓名*/
	@Column
	private String realName;
	/**联系电话*/
	@Column
	private String userTel;
	/**电子邮件*/
	@Column
	private String userMail;
	/**商户地址*/
	@Column
	private String userAddress;
	/**公司名称*/
	@Column
	private String companyName;
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getUserId() {
		return userId;
	}
	public void setUserId(String userId) {
		this.userId = userId;
	}
	public String getRealName() {
		return realName;
	}
	public void setRealName(String realName) {
		this.realName = realName;
	}
	public String getUserTel() {
		return userTel;
	}
	public void setUserTel(String userTel) {
		this.userTel = userTel;
	}
	public String getUserMail() {
		return userMail;
	}
	public void setUserMail(String userMail) {
		this.userMail = userMail;
	}
	public String getUserAddress() {
		return userAddress;
	}
	public void setUserAddress(String userAddress) {
		this.userAddress = userAddress;
	}
	public String getCompanyName() {
		return companyName;
	}
	public void setCompanyName(String companyName) {
		this.companyName = companyName;
	}
	
	
	
}
