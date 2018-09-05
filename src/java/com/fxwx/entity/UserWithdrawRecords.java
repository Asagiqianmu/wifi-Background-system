package com.fxwx.entity;

import java.math.BigDecimal;
import java.util.Date;

import org.nutz.dao.entity.annotation.Column;
import org.nutz.dao.entity.annotation.Id;
import org.nutz.dao.entity.annotation.Table;
/**
 * Copyright (c) All Rights Reserved, 2016.
 * 版权所有                   dfgs Information Technology Co .,Ltd
 * @Project		newCloud
 * @File		UserWithdrawRecords.java ---提现记录表
 * @Date		2016年1月7日 上午9:14:01
 * @Author		gyj
 */
@Table("t_user_account_records_log")
public class UserWithdrawRecords {

	@Id
	private int id;
	@Column("user_id")
	private int userId;
	@Column("user_bank_info_id")
	private int userBankInfoId;
	@Column("withdraw_money")
	private BigDecimal withdrawMoney;
	@Column("withdraw_state")
	private int withdrawState;
	@Column("not_pass_resason")
	private String notPassResason;
	@Column("create_time")
	private Date createTime;
	@Column("account_balance_after")
	private BigDecimal accountBalanceAfter;
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public int getUserId() {
		return userId;
	}
	public void setUserId(int userId) {
		this.userId = userId;
	}
	public int getUserBankInfoId() {
		return userBankInfoId;
	}
	public void setUserBankInfoId(int userBankInfoId) {
		this.userBankInfoId = userBankInfoId;
	}
	public BigDecimal getWithdrawMoney() {
		return withdrawMoney;
	}
	public void setWithdrawMoney(BigDecimal withdrawMoney) {
		this.withdrawMoney = withdrawMoney;
	}
	public int getWithdrawState() {
		return withdrawState;
	}
	public void setWithdrawState(int withdrawState) {
		this.withdrawState = withdrawState;
	}
	public String getNotPassResason() {
		return notPassResason;
	}
	public void setNotPassResason(String notPassResason) {
		this.notPassResason = notPassResason;
	}
	public Date getCreateTime() {
		return createTime;
	}
	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}
	public BigDecimal getAccountBalanceAfter() {
		return accountBalanceAfter;
	}
	public void setAccountBalanceAfter(BigDecimal accountBalanceAfter) {
		this.accountBalanceAfter = accountBalanceAfter;
	}
	@Override
	public String toString() {
		return "UserWithdrawRecords [id=" + id + ", userId=" + userId
				+ ", userBankInfoId=" + userBankInfoId + ", withdrawMoney="
				+ withdrawMoney + ", withdrawState=" + withdrawState
				+ ", notPassResason=" + notPassResason + ", createTime="
				+ createTime + ", accountBalanceAfter=" + accountBalanceAfter
				+ "]";
	}
	 
    
}
