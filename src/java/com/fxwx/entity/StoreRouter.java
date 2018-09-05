package com.fxwx.entity;

import java.util.Date;
import org.nutz.dao.entity.annotation.Column;
import org.nutz.dao.entity.annotation.Id;
import org.nutz.dao.entity.annotation.Table;


/**
 * @ToDoWhat 
 * @author xmm
 */
@Table("v1_store_router")
public class StoreRouter {
	@Id
	private int id;
	
	@Column("create_time")
	private Date createTime;// '路由器创建时间',
	
	@Column("allowdomain")
	private String allowdomain;//'域名白名单',
	
	@Column("authcount")
	private int authcount;// '已认证放行人数',
	
	@Column("filterver")
	private String filterver;//'过滤器版本号',
	
	@Column("install_position")
	private String installPosition;//'安装位置',
	
	@Column("interval_time")
	private int intervalTime;//'路由汇报信息心跳间隔(以分钟为单位）',
	
	@Column("lan_ip")
	private String lanIp;// '内网ip',
	
	@Column("last_time")
	private Date lastTime;// '最后一次心跳时间，若(当前时间-3分钟) > last_time 则表示该设备已经离线',
	
	@Column("limited")
	private String limited;// '限速规则，文本格式：100-200,100,50;201-202,100,100;',
	
	@Column("mac")
	private String mac;// '路由器Mac',
	
	@Column("model")
	private String model;//'路由器硬件型号',
	
	@Column("promoter_id")
	private int promoterId;// '推广员Id(新平台暂时无用可随时删除)',
	
	@Column("ssid")
	private String ssid;// '路由器热点名称',
	
	@Column("startup_time")
	private Date startupTime;// '路由器启动时间',
	
	@Column("timeout")
	private int timeout;// '用户超时时间时长(以分钟为基本单位）',
	
	@Column("trustedmac")
	private String trustedmac;// '设备mac白名单',
	
	@Column("usercount")
	private int usercount;// '当前在线设备总和(不管设备是否认证成功)',
	
	@Column("version")
	private int version;// '路由器固件版本号',
	
	@Column("wanport")
	private String wanport;// '当前只支持ssh和http端口，中间以逗号分隔',
	
	@Column("homeurl")
	private String homeurl;//'路由器的弹窗地址(重启有效)',
	
	@Column("wanip")
	private String wanip;// '路由器wan口IP地址',
	
	@Column("device_name")
	private String deviceName;// '设备别名',
	
	@Column("auth_status")
	private int authStatus;// '0代表关闭认证，1代表开启认证，默认为0关闭认证功能',

	
    public int getId() {
    	return id;
    }

	
    public void setId(int id) {
    	this.id = id;
    }

	
    public Date getCreateTime() {
    	return createTime;
    }

	
    public void setCreateTime(Date createTime) {
    	this.createTime = createTime;
    }

	
    public String getAllowdomain() {
    	return allowdomain;
    }

	
    public void setAllowdomain(String allowdomain) {
    	this.allowdomain = allowdomain;
    }

	
    public int getAuthcount() {
    	return authcount;
    }

	
    public void setAuthcount(int authcount) {
    	this.authcount = authcount;
    }

	
    public String getFilterver() {
    	return filterver;
    }

	
    public void setFilterver(String filterver) {
    	this.filterver = filterver;
    }

	
    public String getInstallPosition() {
    	return installPosition;
    }

	
    public void setInstallPosition(String installPosition) {
    	this.installPosition = installPosition;
    }

	
    public int getIntervalTime() {
    	return intervalTime;
    }

	
    public void setIntervalTime(int intervalTime) {
    	this.intervalTime = intervalTime;
    }

	
    public String getLanIp() {
    	return lanIp;
    }

	
    public void setLanIp(String lanIp) {
    	this.lanIp = lanIp;
    }

	
    public Date getLastTime() {
    	return lastTime;
    }

	
    public void setLastTime(Date lastTime) {
    	this.lastTime = lastTime;
    }

	
    public String getLimited() {
    	return limited;
    }

	
    public void setLimited(String limited) {
    	this.limited = limited;
    }

	
    public String getMac() {
    	return mac;
    }

	
    public void setMac(String mac) {
    	this.mac = mac;
    }

	
    public String getModel() {
    	return model;
    }

	
    public void setModel(String model) {
    	this.model = model;
    }

	
    public int getPromoterId() {
    	return promoterId;
    }

	
    public void setPromoterId(int promoterId) {
    	this.promoterId = promoterId;
    }

	
    public String getSsid() {
    	return ssid;
    }

	
    public void setSsid(String ssid) {
    	this.ssid = ssid;
    }

	
    public Date getStartupTime() {
    	return startupTime;
    }

	
    public void setStartupTime(Date startupTime) {
    	this.startupTime = startupTime;
    }

	
    public int getTimeout() {
    	return timeout;
    }

	
    public void setTimeout(int timeout) {
    	this.timeout = timeout;
    }

	
    public String getTrustedmac() {
    	return trustedmac;
    }

	
    public void setTrustedmac(String trustedmac) {
    	this.trustedmac = trustedmac;
    }

	
    public int getUsercount() {
    	return usercount;
    }

	
    public void setUsercount(int usercount) {
    	this.usercount = usercount;
    }

	
    public int getVersion() {
    	return version;
    }

	
    public void setVersion(int version) {
    	this.version = version;
    }

	
    public String getWanport() {
    	return wanport;
    }

	
    public void setWanport(String wanport) {
    	this.wanport = wanport;
    }

	
    public String getHomeurl() {
    	return homeurl;
    }

	
    public void setHomeurl(String homeurl) {
    	this.homeurl = homeurl;
    }

	
    public String getWanip() {
    	return wanip;
    }

	
    public void setWanip(String wanip) {
    	this.wanip = wanip;
    }

	
    public String getDeviceName() {
    	return deviceName;
    }

	
    public void setDeviceName(String deviceName) {
    	this.deviceName = deviceName;
    }

	
    public int getAuthStatus() {
    	return authStatus;
    }

	
    public void setAuthStatus(int authStatus) {
    	this.authStatus = authStatus;
    }


	@Override
    public String toString() {
	    return "StoreRouter [id=" + id + ", createTime=" + createTime + ", allowdomain=" + allowdomain + ", authcount=" + authcount + ", filterver=" + filterver + ", installPosition=" + installPosition + ", intervalTime=" + intervalTime + ", lanIp=" + lanIp + ", lastTime=" + lastTime + ", limited=" + limited + ", mac=" + mac + ", model=" + model + ", promoterId=" + promoterId + ", ssid=" + ssid + ", startupTime=" + startupTime + ", timeout=" + timeout + ", trustedmac=" + trustedmac + ", usercount=" + usercount + ", version=" + version + ", wanport=" + wanport + ", homeurl=" + homeurl + ", wanip=" + wanip + ", deviceName=" + deviceName + ", authStatus=" + authStatus + "]";
    }
	
	
}
