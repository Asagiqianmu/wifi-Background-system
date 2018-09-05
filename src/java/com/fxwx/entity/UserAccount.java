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
@Table("t_user_account")
public class UserAccount {
	@Id
	private int id;

	@Column("user_id")
	private int userId;
	
	@Column("withdraw_monery")
	private BigDecimal withdrawMonery;
	
	@Column("frozen_monery")
	private BigDecimal frozenMonery;
	
	@Column("settlement_time")
	private Timestamp settlementTime;
	
	@Column("withdraw_phone")
	private String withdrawPhone;
	
	@Column("create_time")
	private Timestamp createTime;

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

	public BigDecimal getWithdrawMonery() {
		return withdrawMonery;
	}

	public void setWithdrawMonery(BigDecimal withdrawMonery) {
		this.withdrawMonery = withdrawMonery;
	}

	public BigDecimal getFrozenMonery() {
		return frozenMonery;
	}

	public void setFrozenMonery(BigDecimal frozenMonery) {
		this.frozenMonery = frozenMonery;
	}

	public Timestamp getSettlementTime() {
		return settlementTime;
	}

	public void setSettlementTime(Timestamp settlementTime) {
		this.settlementTime = settlementTime;
	}

	public String getWithdrawPhone() {
		return withdrawPhone;
	}

	public void setWithdrawPhone(String withdrawPhone) {
		this.withdrawPhone = withdrawPhone;
	}

	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@Override
	public String toString() {
		return "UserAccount [id=" + id + ", userId=" + userId
				+ ", withdrawMonery=" + withdrawMonery + ", frozenMonery="
				+ frozenMonery + ", settlementTime=" + settlementTime
				+ ", withdrawPhone=" + withdrawPhone + ", createTime="
				+ createTime + "]";
	}
	

	
}
