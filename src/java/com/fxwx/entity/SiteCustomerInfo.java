package com.fxwx.entity;

import java.sql.Timestamp;
import java.util.Date;

import org.nutz.dao.entity.annotation.Column;
import org.nutz.dao.entity.annotation.Id;
import org.nutz.dao.entity.annotation.Table;


/**
 * 场所客户账户信息
 * @author dengfei E-mail:dengfei200857@163.com 
 */
@Table("t_site_customer_info")
public class SiteCustomerInfo {
	
	@Id
	private int id;//'主键',
	
	@Column("expiration_time")
	private String expirationTime;// 过期时间
	
	@Column("site_id")
	private int siteId;// 场所id
	
	@Column("portal_user_id")
	private int portalUserId;// portal用户id
	
	@Column("total_flow")
	private String totalFlow;//总流量
	
	@Column("used_flow")
	private String usedFlow;//已用流量
	
	@Column("pay_way")
	private int payWay;  //用户购买的方式 0只购买时间,1既购买时间又购买流量,2只购买流量
	
	@Column("update_time")
	private Timestamp updateTime;// 更新时间
	
	@Column("create_time")
	private Timestamp createTime;// 创建时间
 
	@Column("lock_time")
	private Date luckTime;
	@Column("is_try")
	private int isTry;
	@Column("last_flow")
	private String lastFlow;
	@Column("t5_lottery_time")
	private Date lottertTime;
	
	@Column("t5_total_time")
	private String totalTime;
	
	@Column("t7_all_day")
	private String allDay;//用户购买的总时长
	
	@Column("t7_pass_acount")
	private int passAccount;//用户一天临时放行的次数为3次
	
	@Column("t7_pass_time")
	private String passTime;//用户临时放行的时间
	
	public Date getLuckTime() {
		return luckTime;
	}
	public void setLuckTime(Date luckTime) {
		this.luckTime = luckTime;
	}
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getExpirationTime() {
		return expirationTime;
	}
	public void setExpirationTime(String expirationTime) {
		this.expirationTime = expirationTime;
	}
	public int getSiteId() {
		return siteId;
	}
	public void setSiteId(int siteId) {
		this.siteId = siteId;
	}
	public int getPortalUserId() {
		return portalUserId;
	}
	public void setPortalUserId(int portalUserId) {
		this.portalUserId = portalUserId;
	}
	public Timestamp getUpdateTime() {
		return updateTime;
	}
	public void setUpdateTime(Timestamp updateTime) {
		this.updateTime = updateTime;
	}
	public Timestamp getCreateTime() {
		return createTime;
	}
	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}
	
	
	
	public String getTotalFlow() {
		return totalFlow;
	}
	public void setTotalFlow(String totalFlow) {
		this.totalFlow = totalFlow;
	}
	public String getUsedFlow() {
		return usedFlow;
	}
	public void setUsedFlow(String usedFlow) {
		this.usedFlow = usedFlow;
	}
	public int getPayWay() {
		return payWay;
	}
	public void setPayWay(int payWay) {
		this.payWay = payWay;
	}
	public SiteCustomerInfo() {
		super();
	}
	public int getIsTry() {
		return isTry;
	}
	public void setIsTry(int isTry) {
		this.isTry = isTry;
	}
	public String getLastFlow() {
		return lastFlow;
	}
	public void setLastFlow(String lastFlow) {
		this.lastFlow = lastFlow;
	}
	public Date getLottertTime() {
		return lottertTime;
	}
	public void setLottertTime(Date lottertTime) {
		this.lottertTime = lottertTime;
	}
	public String getTotalTime() {
		return totalTime;
	}
	public void setTotalTime(String totalTime) {
		this.totalTime = totalTime;
	}
	public String getAllDay() {
		return allDay;
	}
	public void setAllDay(String allDay) {
		this.allDay = allDay;
	}
	public int getPassAccount() {
		return passAccount;
	}
	public void setPassAccount(int passAccount) {
		this.passAccount = passAccount;
	}
	public String getPassTime() {
		return passTime;
	}
	public void setPassTime(String passTime) {
		this.passTime = passTime;
	}
	@Override
	public String toString() {
		return "SiteCustomerInfo [id=" + id + ", expirationTime="
				+ expirationTime + ", siteId=" + siteId + ", portalUserId="
				+ portalUserId + ", totalFlow=" + totalFlow + ", usedFlow="
				+ usedFlow + ", payWay=" + payWay + ", updateTime="
				+ updateTime + ", createTime=" + createTime + ", luckTime="
				+ luckTime + ", isTry=" + isTry + ", lastFlow=" + lastFlow
				+ ", lottertTime=" + lottertTime + ", totalTime=" + totalTime
				+ ", allDay=" + allDay + ", passAccount=" + passAccount
				+ ", passTime=" + passTime + "]";
	}
}
