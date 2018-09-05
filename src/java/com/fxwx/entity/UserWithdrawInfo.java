package com.fxwx.entity;

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
 * @File		UserWithdrawInfo.java ---提现信息表
 * @Date		2016年1月7日 上午9:12:28
 * @Author		gyj
 */
@Table("t_user_account")
public class UserWithdrawInfo {

	@Id
	private int id;
	@Column("user_id")
	private int userId;
	@Column("withdraw_monery")
	private BigDecimal withdrawMonery;
	@Column("frozen_monery")
	private BigDecimal frozenMonery;
	@Column("settlement_time")
	private Date settlementTime;
	@Column("withdraw_phone")
	private String withdrawPhone;
	@Column("create_time")
	private Date createTime;
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
	public Date getSettlementTime() {
		return settlementTime;
	}
	public void setSettlementTime(Date settlementTime) {
		this.settlementTime = settlementTime;
	}
	
	public String getWithdrawPhone() {
		return withdrawPhone;
	}
	public void setWithdrawPhone(String withdrawPhone) {
		this.withdrawPhone = withdrawPhone;
	}
	public Date getCreateTime() {
		return createTime;
	}
	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}
	@Override
	public String toString() {
		return "UserWithdrawInfo [id=" + id + ", userId=" + userId
				+ ", withdrawMonery=" + withdrawMonery + ", frozenMonery="
				+ frozenMonery + ", settlementTime=" + settlementTime
				+ ", withdrawPhone=" + withdrawPhone + ", createTime="
				+ createTime + "]";
	}
	
	
}
