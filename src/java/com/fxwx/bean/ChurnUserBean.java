package com.fxwx.bean;
public class ChurnUserBean {

	private String portal_user_name;
	private String expiration_time;
	private String site_name;
	private String transaction_amount;
	private String total;
	private String count;
	public String getPortal_user_name() {
		return portal_user_name;
	}
	public void setPortal_user_name(String portal_user_name) {
		this.portal_user_name = portal_user_name;
	}
	 
	public String getExpiration_time() {
		return expiration_time;
	}
	public void setExpiration_time(String expiration_time) {
		this.expiration_time = expiration_time;
	}
	
	
	public String getTransaction_amount() {
		return transaction_amount;
	}
	public void setTransaction_amount(String transaction_amount) {
		if( transaction_amount==null||"".equals(transaction_amount)){
			this.transaction_amount = "0";
		}else{
			this.transaction_amount = transaction_amount;
		}
	}
	public String getTotal() {
		return total;
	}
	public void setTotal(String total) {
		if(total==null||"".equals(total)){
			this.total = "0";
		}else{
			this.total = total;
		}
	}
	public String getCount() {
		return count;
	}
	public void setCount(String count) {
		if(count==null||"".equals(count)){
			this.count = "0";
		}else{
			this.count = count;
		}
	}
	public String getSite_name() {
		return site_name;
	}
	public void setSite_name(String site_name) {
		this.site_name = site_name;
	}
	@Override
	public String toString() {
		return "ChurnUserBean [portal_user_name=" + portal_user_name
				+ ", expiration_time=" + expiration_time
				+ ", transaction_amount=" + transaction_amount + ", total="
				+ total + ", count=" + count + ", site_name=" + site_name + "]";
	}
	
	
	
}
