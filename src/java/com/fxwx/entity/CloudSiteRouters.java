package com.fxwx.entity;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.nutz.dao.entity.annotation.Column;
import org.nutz.dao.entity.annotation.Id;
import org.nutz.dao.entity.annotation.Table;

/**
 * @ToDoWhat
 * @author xmm
 */
@Table("t_cloud_site_routers")
public class CloudSiteRouters {
	@Id
	private int id;// '主键',

	@Column("site_id")
	private int siteId;// '场所id',

	@Column("mac")
	private String mac;// '路由器mac',

	@Column("ip")
	private String ip;// 'ip地址',

	@Column("create_time")
	private Date createTime;// '创建时间',

	@Column("router_type")
	private String routerType;// '路由类型',

	@Column("secret_key")
	private String secretKey;// '密钥',

	@Column("install_position")
	private String installPosition;// '安装地址',

	@Column("nasid")
	private String nasid;

	@Column("startup_time")
	private Date startupTime;// '路由器启动时间',

	@Column("last_time")
	private Date lastTime;// '最后一次心跳时间',

	@Column("cpu_rate") // cup占用率
	private String cpuRate;

	@Column("run_time") // 运行时间
	private String runTime;

	private String secretype;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public int getSiteId() {
		return siteId;
	}

	public void setSiteId(int siteId) {
		this.siteId = siteId;
	}

	public String getMac() {
		return mac;
	}

	public void setMac(String mac) {
		this.mac = mac;
	}

	public Date getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}

	public String getIp() {
		return ip;
	}

	public void setIp(String ip) {
		this.ip = ip;
	}

	public String getRouterType() {
		return routerType;
	}

	public void setRouterType(String routerType) {
		this.routerType = routerType;
	}

	public String getSecretKey() {
		return secretKey;
	}

	public void setSecretKey(String secretKey) {
		this.secretKey = secretKey;
	}

	public String getInstallPosition() {
		return installPosition;
	}

	public void setInstallPosition(String installPosition) {
		this.installPosition = installPosition;
	}

	public String getNasid() {
		return nasid;
	}

	public void setNasid(String nasid) {
		this.nasid = nasid;
	}

	public Date getStartupTime() {
		return startupTime;
	}

	public void setStartupTime(Date startupTime) {
		this.startupTime = startupTime;
	}

	public Date getLastTime() {
		return lastTime;
	}

	public void setLastTime(Date lastTime) {
		this.lastTime = lastTime;
	}

	public String getCpuRate() {
		return cpuRate;
	}

	public void setCpuRate(String cpuRate) {
		this.cpuRate = cpuRate;
	}

	public String getRunTime() {
		return runTime;
	}

	public void setRunTime(String runTime) {
		this.runTime = runTime;
	}

	public String getSecretype() {
		return secretype;
	}

	public void setSecretype(String secretype) {
		this.secretype = secretype;
	}

	@Override
	public String toString() {
		return "CloudSiteRouters [id=" + id + ", siteId=" + siteId + ", mac=" + mac + ", ip=" + ip + ", createTime=" + createTime + ", routerType=" + routerType + ", secretKey=" + secretKey
				+ ", installPosition=" + installPosition + ", nasid=" + nasid + ", startupTime=" + startupTime + ", lastTime=" + lastTime + ", cpuRate=" + cpuRate + ", runTime=" + runTime
				+ ", secretype=" + secretype + "]";
	}

}
