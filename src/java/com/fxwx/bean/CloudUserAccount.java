package com.fxwx.bean;

import java.util.List;
import java.util.Map;

import com.fxwx.entity.CloudSite;

public class CloudUserAccount {
	private String userId;
	private String userAccount;
	private List<String> siteList;
	private String scale;
	private String realName;
	
	
	public String getRealName() {
		return realName;
	}
	public void setRealName(String realName) {
		this.realName = realName;
	}
	public String getUserId() {
		return userId;
	}
	public void setUserId(String userId) {
		this.userId = userId;
	}
	public String getUserAccount() {
		return userAccount;
	}
	public void setUserAccount(String userAccount) {
		this.userAccount = userAccount;
	}
	public List<String> getSiteList() {
		return siteList;
	}
	public void setSiteList(List<String> siteList) {
		this.siteList = siteList;
	}
	public String getScale() {
		return scale;
	}
	public void setScale(String scale) {
		this.scale = scale;
	}
	@Override
	public String toString() {
		return "CloudUserAccount [userId=" + userId + ", userAccount="
				+ userAccount + ", siteList=" + siteList + ", scale=" + scale
				+ ", realName=" + realName + "]";
	}

	
	
}
