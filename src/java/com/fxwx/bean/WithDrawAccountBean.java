package com.fxwx.bean;

import java.math.BigDecimal;
import java.util.Date;

public class WithDrawAccountBean {
	private String siteName;
	private String portalUserName;
	private Date createTime;
	private String payTypeName;
	private String buyNum;
	private String payName;
	private BigDecimal transactionAmount;
	public BigDecimal getTransactionAmount() {
		return transactionAmount;
	}
	public void setTransactionAmount(BigDecimal transactionAmount) {
		this.transactionAmount = transactionAmount;
	}
	public String getSiteName() {
		return siteName;
	}
	public void setSiteName(String siteName) {
		this.siteName = siteName;
	}
	public String getPortalUserName() {
		return portalUserName;
	}
	public void setPortalUserName(String portalUserName) {
		this.portalUserName = portalUserName;
	}
	public String getPayName() {
		return payName;
	}
	public void setPayName(String payName) {
		this.payName = payName;
	}
	public String getBuyNum() {
		return buyNum;
	}
	public void setBuyNum(String buyNum) {
		this.buyNum = buyNum;
	}
	public String getPayTypeName() {
		return payTypeName;
	}
	public void setPayTypeName(String payTypeName) {
		this.payTypeName = payTypeName;
	}
	public Date getCreateTime() {
		return createTime;
	}
	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}
	@Override
	public String toString() {
		return "WithdrawDetailBean [siteName=" + siteName + ", portalUserName="
				+ portalUserName + ", createTime=" + createTime
				+ ", payTypeName=" + payTypeName + ", buyNum=" + buyNum
				+ ", payName=" + payName + ", transactionAmount="
				+ transactionAmount + "]";
	}
	
}
