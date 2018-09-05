package com.fxwx.bean;

import java.math.BigDecimal;
import java.util.Date;


public class SiteIncomeBean {

	private int id;
	
	private String site_name;
	
	private BigDecimal transaction_amount;
	
	private String portal_user_name;
	
	private int buy_num;
	
	private String pay_name;
	
	private Date create_time;
	
	private String pay_type;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public BigDecimal getTransaction_amount() {
		return transaction_amount;
	}

	public void setTransaction_amount(BigDecimal transaction_amount) {
		this.transaction_amount = transaction_amount;
	}

	public String getSite_name() {
		return site_name;
	}

	public void setSite_name(String site_name) {
		this.site_name = site_name;
	}

	public String getPortal_user_name() {
		return portal_user_name;
	}

	public void setPortal_user_name(String portal_user_name) {
		this.portal_user_name = portal_user_name;
	}

	public int getBuy_num() {
		return buy_num;
	}

	public void setBuy_num(int buy_num) {
		this.buy_num = buy_num;
	}

	public String getPay_name() {
		return pay_name;
	}

	public void setPay_name(String pay_name) {
		this.pay_name = pay_name;
	}

	public Date getCreate_time() {
		return create_time;
	}

	public void setCreate_time(Date create_time) {
		this.create_time = create_time;
	}

	public String getPay_type() {
	 
		return pay_type;
	}
	
	public void setPay_type(String pay_type) {
		this.pay_type = pay_type;
	}
}
