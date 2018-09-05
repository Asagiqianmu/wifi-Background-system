package com.fxwx.bean;

import java.math.BigDecimal;
import java.util.Date;

public class WithDrawBean {

	private BigDecimal withDrawMoney;
	private String withDrawTime;
	public BigDecimal getWithDrawMoney() {
		return withDrawMoney;
	}
	public void setWithDrawMoney(BigDecimal withDrawMoney) {
		this.withDrawMoney = withDrawMoney;
	}
	public String getWithDrawTime() {
		return withDrawTime;
	}
	public void setWithDrawTime(String withDrawTime) {
		this.withDrawTime = withDrawTime;
	}
	@Override
	public String toString() {
		return "WithDrawBean [withDrawMoney=" + withDrawMoney
				+ ", withDrawTime=" + withDrawTime + "]";
	}
	
	
}
