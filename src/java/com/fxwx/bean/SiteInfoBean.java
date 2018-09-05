package com.fxwx.bean;

import java.sql.Timestamp;


/**
 * @ToDoWhat 
 * @author xmm
 */
public class SiteInfoBean {
	
	private int id;
	private String site_name;
	private String address;
	private int is_probative;
	private int allow_client_num;
	private String create_time;
	private String macs;
	private long mac_num;
	private long portalUserNum;
	private int state;
	private String yiChang;
	private int exTime;
	private String site_admin;
	private String site_type;
	
	private int siteNum;
	
    public int getState() {
		return state;
	}


	public void setState(int state) {
		this.state = state;
	}


	public String getMacs() {
    	return macs;
    }

	
    public void setMacs(String macs) {
    	this.macs = macs;
    }

	
    public long getMac_num() {
    	return mac_num;
    }

	
    public void setMac_num(long mac_num) {
    	this.mac_num = mac_num;
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
	
   
	
    public String getCreate_time() {
		return create_time;
	}


	public void setCreate_time(String create_time) {
		this.create_time = create_time;
	}


	public long getPortalUserNum() {
    	return portalUserNum;
    }

    public void setPortalUserNum(long portalUserNum) {
    	this.portalUserNum = portalUserNum;
    }


	public String getYiChang() {
		return yiChang;
	}


	public void setYiChang(String yiChang) {
		this.yiChang = yiChang;
	}


	public String getSite_type() {
		return site_type;
	}


	public void setSite_type(String site_type) {
		this.site_type = site_type;
	}


	public int getSiteNum() {
		return siteNum;
	}


	public void setSiteNum(int siteNum) {
		this.siteNum = siteNum;
	}


	public int getExTime() {
		return exTime;
	}


	public void setExTime(int exTime) {
		this.exTime = exTime;
	}


	public String getSite_admin() {
		return site_admin;
	}


	public void setSite_admin(String site_admin) {
		this.site_admin = site_admin;
	}
	
 
}
