package com.fxwx.bean;


import java.math.BigDecimal;
import java.util.Date;

import org.nutz.dao.entity.annotation.Column;
import org.nutz.dao.entity.annotation.Id;
import org.nutz.dao.entity.annotation.Table;
/**
 * 
 * Copyright (c) All Rights Reserved, 2016.
 * 版权所有                   dfgs Information Technology Co .,Ltd
 * @Project		newCloud
 * @File		UserAccount.java -- 提现日志表
 * @Date		2016年1月7日 上午9:01:33
 * @Author		gyj
 */
public class UserAccountLogBean {
	private String bankInfo;		//银行卡号
	private String accountFrom;	//资金动向
	private String flowCode;	//流水编号 
	private BigDecimal accountIncome;//实际总收入
	private BigDecimal accountPlatformIncome;//平台收入
	private BigDecimal accountOfflineIncome;//线下收益
	private BigDecimal accountBalanceAfter;//变动之后的余额
	private int accountBusinessType;//0--收入  1--支出
	private String detailedUrl;	//结算明细下载url
	private String createTime;

	public String getBankInfo() {
		return bankInfo;
	}
	public void setBankInfo(String bankInfo) {
		this.bankInfo = bankInfo;
	}
	public String getAccountFrom() {
		return accountFrom;
	}
	public void setAccountFrom(String accountFrom) {
		this.accountFrom = accountFrom;
	}
	public String getFlowCode() {
		return flowCode;
	}
	public void setFlowCode(String flowCode) {
		this.flowCode = flowCode;
	}
	public BigDecimal getAccountIncome() {
		return accountIncome;
	}
	public void setAccountIncome(BigDecimal accountIncome) {
		this.accountIncome = accountIncome;
	}
	public BigDecimal getAccountPlatformIncome() {
		return accountPlatformIncome;
	}
	public void setAccountPlatformIncome(BigDecimal accountPlatformIncome) {
		this.accountPlatformIncome = accountPlatformIncome;
	}
	public BigDecimal getAccountOfflineIncome() {
		return accountOfflineIncome;
	}
	public void setAccountOfflineIncome(BigDecimal accountOfflineIncome) {
		this.accountOfflineIncome = accountOfflineIncome;
	}
	public BigDecimal getAccountBalanceAfter() {
		return accountBalanceAfter;
	}
	public void setAccountBalanceAfter(BigDecimal accountBalanceAfter) {
		this.accountBalanceAfter = accountBalanceAfter;
	}
	public int getAccountBusinessType() {
		return accountBusinessType;
	}
	public void setAccountBusinessType(int accountBusinessType) {
		this.accountBusinessType = accountBusinessType;
	}
	public String getDetailedUrl() {
		return detailedUrl;
	}
	public void setDetailedUrl(String detailedUrl) {
		this.detailedUrl = detailedUrl;
	}
	
	public String getCreateTime() {
		return createTime;
	}
	public void setCreateTime(String createTime) {
		this.createTime = createTime;
	}
	@Override
	public String toString() {
		return "UserAccountLogBean [bankInfo=" + bankInfo + ", accountFrom="
				+ accountFrom + ", flowCode=" + flowCode + ", accountIncome="
				+ accountIncome + ", accountPlatformIncome="
				+ accountPlatformIncome + ", accountOfflineIncome="
				+ accountOfflineIncome + ", accountBalanceAfter="
				+ accountBalanceAfter + ", accountBusinessType="
				+ accountBusinessType + ", detailedUrl=" + detailedUrl
				+ ", createTime=" + createTime + "]";
	}

}
