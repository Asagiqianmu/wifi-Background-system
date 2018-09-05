package com.fxwx.bean;

/**
 * 
 * @author zsk
 * 临时存储日志
 */
public class UserTemporaryTotalLog {
  
	
	private int siteId;//场所ID
	private String site_name;//场所名称
	private String usernames;//账户名称
	private String acctupdatetimes;//更新时间
	private String acctstoptimes;//结束时间
	private String acctstarttimes;//上线时间
	private String nasid;//nasid
	
	
	public int getSiteId() {
		return siteId;
	}
	public void setSiteId(int siteId) {
		this.siteId = siteId;
	}
	public String getSite_name() {
		return site_name;
	}
	public void setSite_name(String site_name) {
		this.site_name = site_name;
	}
	public String getUsernames() {
		return usernames;
	}
	public void setUsernames(String usernames) {
		this.usernames = usernames;
	}
	public String getAcctupdatetimes() {
		return acctupdatetimes;
	}
	public void setAcctupdatetimes(String acctupdatetimes) {
		this.acctupdatetimes = acctupdatetimes;
	}
	public String getAcctstoptimes() {
		return acctstoptimes;
	}
	public void setAcctstoptimes(String acctstoptimes) {
		this.acctstoptimes = acctstoptimes;
	}
	public String getAcctstarttimes() {
		return acctstarttimes;
	}
	public void setAcctstarttimes(String acctstarttimes) {
		this.acctstarttimes = acctstarttimes;
	}
	public String getNasid() {
		return nasid;
	}
	public void setNasid(String nasid) {
		this.nasid = nasid;
	}
	@Override
	public String toString() {
		return "UserTemporaryTotalLog [siteId=" + siteId + ", site_name=" + site_name + ", usernames=" + usernames + ", acctupdatetimes=" + acctupdatetimes + ", acctstoptimes=" + acctstoptimes
				+ ", acctstarttimes=" + acctstarttimes + ", nasid=" + nasid + "]";
	}
	
	
}
