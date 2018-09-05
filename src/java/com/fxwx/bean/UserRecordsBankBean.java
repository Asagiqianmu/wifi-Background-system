package com.fxwx.bean;

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
 
public class UserRecordsBankBean {
 
	private int id;
	 
	private int userId;
	 
	private int userBankInfoId;
	
	private String bankCardNum;
	 
	private BigDecimal withdrawMoney;
	 
	private int withdrawState;
	 
	private String notPassResason;
	
	private String accountName;
	private String bankDeposit;
	private String branchName;
	private Date createTime;
	
	public String getAccountName() {
		return accountName;
	}
	public void setAccountName(String accountName) {
		this.accountName = accountName;
	}
	public String getBankDeposit() {
		return bankDeposit;
	}
	public void setBankDeposit(String bankDeposit) {
		this.bankDeposit = bankDeposit;
	}
	public String getBranchName() {
		return branchName;
	}
	public void setBranchName(String branchName) {
		this.branchName = branchName;
	}
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
	
	public String getBankCardNum() {
		return bankCardNum;
	}
	public void setBankCardNum(String bankCardNum) {
		this.bankCardNum = bankCardNum;
	}
	@Override
	public String toString() {
		return "UserRecordsBean [id=" + id + ", userId=" + userId
				+ ", userBankInfoId=" + userBankInfoId + ", bankCardNum="
				+ bankCardNum + ", withdrawMoney=" + withdrawMoney
				+ ", withdrawState=" + withdrawState + ", notPassResason="
				+ notPassResason + ", accountName=" + accountName
				+ ", bankDeposit=" + bankDeposit + ", branchName=" + branchName
				+ ", createTime=" + createTime + "]";
	}
    
}
