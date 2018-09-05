package com.fxwx.bean;

import java.sql.Timestamp;


/**
 * @ToDoWhat 
 * @author xmm
 */
public class SiteInfosBean {
	
	private int id;
	private String site_name;
	private String address;
	private int is_probative;
	private int allow_client_num;
	private int  tryNum;
	private int  macNum;
	private int  p_num;
	private int  onlineNum;
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
	public int getTryNum() {
		return tryNum;
	}
	public void setTryNum(int tryNum) {
		this.tryNum = tryNum;
	}
	public int getMacNum() {
		return macNum;
	}
	public void setMacNum(int macNum) {
		this.macNum = macNum;
	}
	public int getP_num() {
		return p_num;
	}
	public void setP_num(int p_num) {
		this.p_num = p_num;
	}
	public int getOnlineNum() {
		return onlineNum;
	}
	public void setOnlineNum(int onlineNum) {
		this.onlineNum = onlineNum;
	}
	@Override
	public String toString() {
		return "SiteInfosBean [id=" + id + ", site_name=" + site_name
				+ ", address=" + address + ", is_probative=" + is_probative
				+ ", allow_client_num=" + allow_client_num + ", tryNum="
				+ tryNum + ", macNum=" + macNum + ", p_num=" + p_num
				+ ", onlineNum=" + onlineNum + "]";
	}
	 
}
