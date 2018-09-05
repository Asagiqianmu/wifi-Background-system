package com.fxwx.bean;

import java.math.BigDecimal;
import java.util.Date;

/**
 * 用户列表Bean
 * @author dengfei E-mail:dengfei200857@163.com 
 *
 */
public class UserInfoBean {
	private String userName;//联系电话,用Portal_user的us
	private Date createTime;//注册时间
	private Date expirationTime ;//到期时间
	private BigDecimal transactionAmount;//最后一次充值金额
	private BigDecimal countAmount;//总消费金额
	private String siteName;
	public String getUserName() {
		return userName;
	}
	public void setUserName(String userName) {
		this.userName = userName;
	}
	
	public Date getCreateTime() {
		return createTime;
	}
	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}
	public Date getExpirationTime() {
		return expirationTime;
	}
	public void setExpirationTime(Date expirationTime) {
		this.expirationTime = expirationTime;
	}
	public BigDecimal getTransactionAmount() {
		return transactionAmount;
	}
	public void setTransactionAmount(BigDecimal transactionAmount) {
		this.transactionAmount = transactionAmount;
	}
	public BigDecimal getCountAmount() {
		return countAmount;
	}

	public void setCountAmount(BigDecimal countAmount) {
		this.countAmount = countAmount;
	}
	
	
    public String getSiteName() {
    	return siteName;
    }
	
    public void setSiteName(String siteName) {
    	this.siteName = siteName;
    }
	@Override
    public String toString() {
	    return "UserInfoBean [userName=" + userName + ", createTime=" + createTime + ", expirationTime=" + expirationTime + ", transactionAmount=" + transactionAmount + ", countAmount=" + countAmount + ", siteName=" + siteName + "]";
    }

	
}
