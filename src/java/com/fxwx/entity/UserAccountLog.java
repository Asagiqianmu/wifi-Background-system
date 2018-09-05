package com.fxwx.entity;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.Date;

import org.nutz.dao.entity.annotation.Column;
import org.nutz.dao.entity.annotation.Id;
import org.nutz.dao.entity.annotation.Table;

/**
 * 
 * Copyright (c) All Rights Reserved, 2016. 版权所有 dfgs Information Technology Co
 * .,Ltd
 * 
 * @Project newCloud
 * @File UserAccount.java -- 提现日志表
 * @Date 2016年1月7日 上午9:01:33
 * @Author gyj
 */
@Table("t_user_account_log")
public class UserAccountLog {
	@Id
	private int id;
	/** 提现单号 */
	@Column("account_id")
	private String accountId;

	@Column("user_id")
	private int userId;
	@Column("bank_info_id")
	private String bankInfoId;
	@Column("account_from")
	private String accountFrom;
	@Column("flow_code")
	private String flowCode;
	@Column("account_income")
	private BigDecimal accountIncome;
	@Column("account_platform_income")
	private BigDecimal accountPlatformIncome;
	@Column("account_offline_income")
	private BigDecimal accountOfflineIncome;
	@Column("account_balance_after")
	private BigDecimal accountBalanceAfter;
	@Column("account_business_type")
	private int accountBusinessType;
	@Column("detailed_url")
	private String detailedUrl;
	@Column("create_time")
	private Date createTime;
	/** 结束时间 */
	@Column("end_time")
	private long endTime;
	/** 手续费*/
	@Column("account_poundage")
	private BigDecimal accountPoundage;
	/** 退款 */
	@Column("account_refund")
	private BigDecimal accountRefund;
	/** 开始时间 */
	@Column("start_time")
	private long startTime;
	/**到账时间*/
	@Column("to_account_time")
	private Timestamp toAccountTime;
	/**
	 * 801-初始提现状态(户发起提现，即未审核状态) 802-财务已确认 803-商户已确认(订单不能再次修改) 804-打款中（待支付）
	 * 805-订单完成状态（已支付） 806-商户发起申诉 807-商户确认申诉结果
	 */
	@Column("account_status")
	private String accountStatus;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getAccountId() {
		return accountId;
	}

	public void setAccountId(String accountId) {
		this.accountId = accountId;
	}

	public int getUserId() {
		return userId;
	}

	public void setUserId(int userId) {
		this.userId = userId;
	}

	public String getBankInfoId() {
		return bankInfoId;
	}

	public void setBankInfoId(String bankInfoId) {
		this.bankInfoId = bankInfoId;
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


	public Date getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}

	public long getEndTime() {
		return endTime;
	}

	public BigDecimal getAccountRefund() {
		return accountRefund;
	}

	public void setAccountRefund(BigDecimal accountRefund) {
		this.accountRefund = accountRefund;
	}
	
	public String getAccountStatus() {
		return accountStatus;
	}

	public void setAccountStatus(String accountStatus) {
		this.accountStatus = accountStatus;
	}

	
	public long getStartTime() {
		return startTime;
	}

	public void setStartTime(long startTime) {
		this.startTime = startTime;
	}


	public void setEndTime(long endTime) {
		this.endTime = endTime;
	}
	
	public BigDecimal getAccountPoundage() {
		return accountPoundage;
	}

	public void setAccountPoundage(BigDecimal accountPoundage) {
		this.accountPoundage = accountPoundage;
	}

	public Timestamp getToAccountTime() {
		return toAccountTime;
	}

	public void setToAccountTime(Timestamp toAccountTime) {
		this.toAccountTime = toAccountTime;
	}

	@Override
	public String toString() {
		return "UserAccountLog [id=" + id + ", accountId=" + accountId
				+ ", userId=" + userId + ", bankInfoId=" + bankInfoId
				+ ", accountFrom=" + accountFrom + ", flowCode=" + flowCode
				+ ", accountIncome=" + accountIncome
				+ ", accountPlatformIncome=" + accountPlatformIncome
				+ ", accountOfflineIncome=" + accountOfflineIncome
				+ ", accountBalanceAfter=" + accountBalanceAfter
				+ ", accountBusinessType=" + accountBusinessType
				+ ", detailedUrl=" + detailedUrl + ", createTime=" + createTime
				+ ", endTime=" + endTime + ", accountPoundage="
				+ accountPoundage + ", accountRefund=" + accountRefund
				+ ", startTime=" + startTime + ", toAccountTime="
				+ toAccountTime + ", accountStatus=" + accountStatus + "]";
	}

	
}
