package com.fxwx.entity;

import org.nutz.dao.entity.annotation.Column;
import org.nutz.dao.entity.annotation.Id;
import org.nutz.dao.entity.annotation.Table;
/**
 * 
 * Copyright (c) All Rights Reserved, 2016.
 * 版权所有                   dfgs Information Technology Co .,Ltd
 * @Project		newCloud
 * @File		UserBankInfo.java ---提现银行卡信息表
 * @Date		2016年1月7日 上午9:07:33
 * @Author		gyj
 */
@Table("t_user_bank_info")
public class UserBankInfo {

	@Id
	private int id;
	@Column("user_id")
	private int userId;
	@Column("bankcar_num")
	private String bankcarNum;
	@Column("account_name")
	private String accountName;
	@Column("bank_deposit")
	private String bankDeposit;
	@Column("branch_name")
	private String branchName;
	@Column("create_time")
	private String createTime;
	@Column("state")
	private int state;
	
	@Column("dstate")
	private int dstate;
	
	public int getState() {
		return state;
	}
	public void setState(int state) {
		this.state = state;
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
	public String getBankcarNum() {
		return bankcarNum;
	}
	public void setBankcarNum(String bankcarNum) {
		this.bankcarNum = bankcarNum;
	}
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
	 
	public String getCreateTime() {
		return createTime;
	}
	public void setCreateTime(String createTime) {
		this.createTime = createTime;
	}
	
	
	public int getDstate() {
		return dstate;
	}
	public void setDstate(int dstate) {
		this.dstate = dstate;
	}
	@Override
	public String toString() {
		return "UserBankInfo [id=" + id + ", userId=" + userId
				+ ", bankcarNum=" + bankcarNum + ", accountName=" + accountName
				+ ", bankDeposit=" + bankDeposit + ", branchName=" + branchName
				+ ", createTime=" + createTime + ", state=" + state + "]";
	}
}
