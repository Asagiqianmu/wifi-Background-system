package com.fxwx.entity;

import java.sql.Date;

import org.nutz.dao.entity.annotation.Column;
import org.nutz.dao.entity.annotation.Id;
import org.nutz.dao.entity.annotation.Table;

@Table("t3_business_data")
public class BusinessData {
	@Id
	private int id;
	@Column
	private Integer siteId;
	@Column
	private Integer uvNum;//昨日独立用户数（访问认证客户端）
	@Column
	private Integer registerNum;//昨日注册用户数
	@Column
	private Integer payNum;//昨日付费用户总数
	@Column
	private Integer loginNum;//昨日登录用户数
	@Column
	private Integer totalUV;//总独立用户数（访问认证客户端）
	@Column
	private Integer totalNum;//总注册用户数
	@Column
	private Integer totalPay;//总付费用户数
	@Column
	private Date createTime;//创建时间
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public Integer getSiteId() {
		return siteId;
	}
	public void setSiteId(Integer siteId) {
		this.siteId = siteId;
	}
	public Integer getUvNum() {
		return uvNum;
	}
	public void setUvNum(Integer uvNum) {
		this.uvNum = uvNum;
	}
	public Integer getRegisterNum() {
		return registerNum;
	}
	public void setRegisterNum(Integer registerNum) {
		this.registerNum = registerNum;
	}
	public Integer getPayNum() {
		return payNum;
	}
	public void setPayNum(Integer payNum) {
		this.payNum = payNum;
	}
	public Integer getLoginNum() {
		return loginNum;
	}
	public void setLoginNum(Integer loginNum) {
		this.loginNum = loginNum;
	}
	public Date getCreateTime() {
		return createTime;
	}
	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}
	public Integer getTotalUV() {
		return totalUV;
	}
	public void setTotalUV(Integer totalUV) {
		this.totalUV = totalUV;
	}
	public Integer getTotalNum() {
		return totalNum;
	}
	public void setTotalNum(Integer totalNum) {
		this.totalNum = totalNum;
	}
	public Integer getTotalPay() {
		return totalPay;
	}
	public void setTotalPay(Integer totalPay) {
		this.totalPay = totalPay;
	}
	
	
}
