package com.fxwx.bean;

import java.util.Date;


/**路由器信息bean
 * @ToDoWhat 
 * @author xmm
 */
public class RouterInfoBean {
	
	private String mac;
	private Integer authcount;
	private String install_position;
	private String ssid;
	private Date startup_time;
	private String version;
	private String homeurl;
	private Integer auth_status;
	private String authStatue;
	private Integer interval_time;
	private Date last_time;
	private String statue;
	private Integer userId;
	private String userName;
	private String nasid;
  

	public String getUserName() {
    	return userName;
    }

    public void setUserName(String userName) {
    	this.userName = userName;
    }

	public String getNasid() {
		return nasid;
	}

	public void setNasid(String nasid) {
		this.nasid = nasid;
	}

	public Integer getUserId() {
    	return userId;
    }
	
    public void setUserId(Integer userId) {
    	this.userId = userId;
    }

	public String getAuthStatue() {
    	return authStatue;
    }

    public void setAuthStatue(String authStatue) {
    	this.authStatue = authStatue;
    }

	public String getMac() {
    	return mac;
    }
	
    public void setMac(String mac) {
    	this.mac = mac;
    }
	
    public Integer getAuthcount() {
    	return authcount;
    }
	
    public void setAuthcount(Integer authcount) {
    	this.authcount = authcount;
    }
	
    public String getInstall_position() {
    	return install_position;
    }
	
    public void setInstall_position(String install_position) {
    	this.install_position = install_position;
    }
	
    public String getSsid() {
    	return ssid;
    }
	
    public void setSsid(String ssid) {
    	this.ssid = ssid;
    }
	
    public Date getStartup_time() {
    	return startup_time;
    }
	
    public void setStartup_time(Date startup_time) {
    	this.startup_time = startup_time;
    }
	
    public String getVersion() {
    	return version;
    }
	
    public void setVersion(String version) {
    	this.version = version;
    }
	
    public String getHomeurl() {
    	return homeurl;
    }
	
    public void setHomeurl(String homeurl) {
    	this.homeurl = homeurl;
    }
	
    public Integer getAuth_status() {
    	return auth_status;
    }
	
    public void setAuth_status(Integer auth_status) {
    	this.auth_status = auth_status;
    }
	
    public Integer getInterval_time() {
    	return interval_time;
    }
	
    public void setInterval_time(Integer interval_time) {
    	this.interval_time = interval_time;
    }
	
    public Date getLast_time() {
    	return last_time;
    }
	
    public void setLast_time(Date last_time) {
    	this.last_time = last_time;
    }
    
    public String getStatue() {
    	return statue;
    }
	
    public void setStatue(String statue) {
    	this.statue = statue;
    }

    /**
     * 处理空数据为展示友好的文字
     * @Description: TODO
     * @Date		2016年6月14日 上午9:48:37
     * @Author		cuimiao
     */
    public void handleSelf(){
    	if(mac==null)mac="未知";
    	if(authcount==null)authcount=0;
    	if(install_position==null)install_position="未知";
    	if(ssid==null)ssid="未知";
    	if(startup_time==null)startup_time=new Date(0);
    	if(version==null)version="";
    	if(homeurl==null)homeurl="0天0小时0分";
    	if(auth_status==null)auth_status=0;
    	if(interval_time==null)interval_time=1;
//    	if(last_time==null)last_time=
    	
    	//authStatue=auth_status==0?"关闭":"开启";
    	authStatue=(auth_status+"").trim();
    	if(last_time==null){
    		statue="异常";
    	}else{
			long fen=(System.currentTimeMillis()-last_time.getTime())/1000/60;//距上次心跳间隔分钟数
			int heartbeat=interval_time==null?1:interval_time;//分钟数
			statue= fen<heartbeat*3?"正常":(fen<60?"离线":"异常");//3倍心跳分钟数，一个小时
    	}
		userName=userName==null?"无":userName;
		
    	
    }
    
    /**
     * 检查设备是否在线
     * @return true if online
     */
    public boolean isOnline(){
    	if(last_time==null){return false;}
		long fen=(System.currentTimeMillis()-last_time.getTime())/1000/60;//距上次心跳间隔分钟数
		int heartbeat=interval_time==null?1:interval_time;//分钟数
		return fen<heartbeat*3?true:(fen<60?false:false);//3倍心跳分钟数，一个小时
    }

    
	@Override
	public String toString() {
		return "RouterInfoBean [mac=" + mac + ", authcount=" + authcount + ", install_position=" + install_position + ", ssid=" + ssid + ", startup_time=" + startup_time + ", version=" + version
				+ ", homeurl=" + homeurl + ", auth_status=" + auth_status + ", authStatue=" + authStatue + ", interval_time=" + interval_time + ", last_time=" + last_time + ", statue=" + statue
				+ ", userId=" + userId + ", userName=" + userName + ", nasid=" + nasid + "]";
	}

	public void copyValue(RouterInfoBean rib){
		this.authcount=rib.authcount;
		this.install_position=rib.install_position;
		this.ssid=rib.ssid;
		this.startup_time=new Date(rib.startup_time.getTime());
		this.version=rib.version;
		this.homeurl=rib.homeurl;
		this.auth_status=rib.auth_status;
		this.authStatue=rib.authStatue;
		this.interval_time=rib.interval_time;
		this.last_time=new Date(rib.last_time.getTime());
		this.statue=rib.statue;
		this.userId=rib.userId;
		this.userName=rib.userName;
	}
  
	
	
}
