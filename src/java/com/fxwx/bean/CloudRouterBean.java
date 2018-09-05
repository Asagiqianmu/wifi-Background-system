package com.fxwx.bean;

import org.nutz.dao.entity.annotation.Column;

public class CloudRouterBean {

	private int id;
	
	private int siteId;
	
	private String nasid;
	 
	private String deviceType;
	
	private String secretKey;
	
	private int state;
	
	private String position;
	
	private String runTime;
	
	private String cpu;

	private String maxup;
	
	private String maxdown;
	
	private String secretType;//仅作为h3c认证方式
	
	public String getMaxup() {
		return maxup;
	}

	public void setMaxup(String maxup) {
		this.maxup = maxup;
	}

	public String getMaxdown() {
		return maxdown;
	}

	public void setMaxdown(String maxdown) {
		this.maxdown = maxdown;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getNasid() {
		return nasid;
	}

	public void setNasid(String nasid) {
		this.nasid = nasid;
	}

	public String getDeviceType() {
		return deviceType;
	}

	public void setDeviceType(String deviceType) {
		this.deviceType = deviceType;
	}

	public String getSecretKey() {
		return secretKey;
	}

	public void setSecretKey(String secretKey) {
		this.secretKey = secretKey;
	}

	public int getState() {
		return state;
	}

	public void setState(int state) {
		this.state = state;
	}

	public String getPosition() {
		return position;
	}

	public void setPosition(String position) {
		this.position = position;
	}

	public String getRunTime() {
		return runTime;
	}

	public void setRunTime(String runTime) {
		this.runTime = runTime;
	}

	public String getCpu() {
		return cpu;
	}

	public void setCpu(String cpu) {
		this.cpu = cpu;
	}

	public int getSiteId() {
		return siteId;
	}

	public void setSiteId(int siteId) {
		this.siteId = siteId;
	}
	
	public String getSecretType() {
		return secretType;
	}

	public void setSecretType(String secretType) {
		this.secretType = secretType;
	}

	@Override
	public String toString() {
		return "CloudRouterBean [id=" + id + ", siteId=" + siteId + ", nasid="
				+ nasid + ", deviceType=" + deviceType + ", secretKey="
				+ secretKey + ", state=" + state + ", position=" + position
				+ ", runTime=" + runTime + ", cpu=" + cpu + ", maxup=" + maxup
				+ ", maxdown=" + maxdown + ", secretType=" + secretType + "]";
	}

}
