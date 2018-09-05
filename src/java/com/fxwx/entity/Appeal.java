package com.fxwx.entity;

import java.util.Date;

import org.nutz.dao.entity.annotation.Column;
import org.nutz.dao.entity.annotation.Id;

/**
 * 申诉表
 * Copyright (c) All Rights Reserved, 2016.
 * 版权所有                  fxwx Information Technology Co .,Ltd
 * @Project		newCloud
 * @File		Appeal.java
 * @Date		2016年7月13日 下午3:58:42
 * @Author		cuimiao
 */
public class Appeal {
	@Id
	private String id;
	/**申诉id*/
	@Column
	private String appealId;
	/**提现单号*/
	@Column
	private String accountId;
	/**申诉原因*/
	@Column
	private String appealReason;
	/**申诉答复*/
	@Column
	private String appealResult;
	/**申诉状态 0-申诉中 1-结束*/
	@Column
	private String appealStatus;
	/**申诉发起时间*/
	@Column
	private Date startTime;
	/**申诉结束时间*/
	@Column
	private String endTime;
	/**申诉最后确认金额*/
	@Column
	private String confirmMoney;
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getAppealId() {
		return appealId;
	}
	public void setAppealId(String appealId) {
		this.appealId = appealId;
	}
	public String getAccountId() {
		return accountId;
	}
	public void setAccountId(String accountId) {
		this.accountId = accountId;
	}
	public String getAppealReason() {
		return appealReason;
	}
	public void setAppealReason(String appealReason) {
		this.appealReason = appealReason;
	}
	public String getAppealResult() {
		return appealResult;
	}
	public void setAppealResult(String appealResult) {
		this.appealResult = appealResult;
	}
	public String getAppealStatus() {
		return appealStatus;
	}
	public void setAppealStatus(String appealStatus) {
		this.appealStatus = appealStatus;
	}
	public Date getStartTime() {
		return startTime;
	}
	public void setStartTime(Date startTime) {
		this.startTime = startTime;
	}
	public String getEndTime() {
		return endTime;
	}
	public void setEndTime(String endTime) {
		this.endTime = endTime;
	}
	public String getConfirmMoney() {
		return confirmMoney;
	}
	public void setConfirmMoney(String confirmMoney) {
		this.confirmMoney = confirmMoney;
	}
	
	
	
}
