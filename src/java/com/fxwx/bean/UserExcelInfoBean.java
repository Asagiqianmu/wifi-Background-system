package com.fxwx.bean;

import java.math.BigDecimal;
import java.util.Date;

/**
 * 用户列表Bean
 * @author dengfei E-mail:dengfei200857@163.com 
 *
 */
public class UserExcelInfoBean {
	private String userName;//联系电话,用户名
	private BigDecimal payAmount;//充值金额
	private int buyNum;//购买数量
	private String payType;//交易类型
	private String payName;//充值类型
	private Date createTime;//注册时间
	 
	
	
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

	public BigDecimal getPayAmount() {
		return payAmount;
	}

	public void setPayAmount(BigDecimal payAmount) {
		this.payAmount = payAmount;
	}
	

	public int getBuyNum() {
		return buyNum;
	}


	public String getPayName() {
		return payName;
	}

	public void setPayName(String payName) {
		this.payName = payName;
	}

	public void setBuyNum(int buyNum) {
		this.buyNum = buyNum;
	}
	
	 
	public String getPayType() {
		if(payType==null||"".equals(payType)){
			return null;
		}
		return payType;
	}

	public void setPayType(String payType) {
		this.payType = payType;
	}

	@Override
	public String toString() {
		return "UserExcelInfoBean [userName=" + userName + ", payAmount="
				+ payAmount + ", buyNum=" + buyNum + ", payName=" + payName
				+ ", createTime=" + createTime + ", payType=" + payType + "]";
	}
}
