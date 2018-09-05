package com.fxwx.entity;

import java.util.Date;

import org.nutz.dao.entity.annotation.Column;
import org.nutz.dao.entity.annotation.Id;
import org.nutz.dao.entity.annotation.Table;
@Table("t_cloud_site")
public class CloudSite {
	@Id
	private int id;
	@Column
	private String site_name;
	@Column
	private String address;
	@Column
	private int user_id;
	@Column
	private int is_probative;
	@Column
	private int allow_client_num;
	@Column
	private int state; 
	@Column
	private Date create_time;
	@Column
	private int siteNum;
	
	@Column
	private int systemtype;
	
	@Column("site_admin")
	private String adminer;
	
	@Column("banner_url")
	private String bannerUrl;
	
	@Column("site_type")
	private String siteType;
	
	@Column("exTime")
	private int exTime;//用户多长时间需要重复认证,默认600s
	
	
	public String getBannerUrl() {
		return bannerUrl;
	}
	public void setBannerUrl(String bannerUrl) {
		this.bannerUrl = bannerUrl;
	}
	public int getState() {
		return state;
	}
	public void setState(int state) {
		this.state = state;
	}
	public int getSiteNum() {
		return siteNum;
	}
	public void setSiteNum(int siteNum) {
		this.siteNum = siteNum;
	}
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getSite_name() {
		return site_name;
	}
	public void setSite_name(String site_name) {
		this.site_name = site_name;
	}
	public String getAddress() {
		return address;
	}
	public void setAddress(String address) {
		this.address = address;
	}
	public int getUser_id() {
		return user_id;
	}
	public void setUser_id(int user_id) {
		this.user_id = user_id;
	}
	public int getIs_probative() {
		return is_probative;
	}
	public void setIs_probative(int is_probative) {
		this.is_probative = is_probative;
	}
	public int getAllow_client_num() {
		return allow_client_num;
	}
	public void setAllow_client_num(int allow_client_num) {
		this.allow_client_num = allow_client_num;
	}
	public Date getCreate_time() {
		return create_time;
	}
	public void setCreate_time(Date create_time) {
		this.create_time = create_time;
	}
	public int getSystemtype() {
		return systemtype;
	}
	public void setSystemtype(int systemtype) {
		this.systemtype = systemtype;
	}
	public String getSiteType() {
		return siteType;
	}
	public void setSiteType(String siteType) {
		this.siteType = siteType;
	}
	public int getExTime() {
		return exTime;
	}
	public void setExTime(int exTime) {
		this.exTime = exTime;
	}
	public String getAdminer() {
		return adminer;
	}
	public void setAdminer(String adminer) {
		this.adminer = adminer;
	}
	@Override
	public String toString() {
		return "CloudSite [id=" + id + ", site_name=" + site_name
				+ ", address=" + address + ", user_id=" + user_id
				+ ", is_probative=" + is_probative + ", allow_client_num="
				+ allow_client_num + ", state=" + state + ", create_time="
				+ create_time + ", siteNum=" + siteNum + ", systemtype="
				+ systemtype + ", adminer=" + adminer + ", bannerUrl="
				+ bannerUrl + ", siteType=" + siteType + ", exTime=" + exTime
				+ "]";
	}
	 
}
