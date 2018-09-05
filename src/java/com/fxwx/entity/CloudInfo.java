package com.fxwx.entity;

import java.util.Date;

import org.nutz.dao.entity.annotation.Column;
import org.nutz.dao.entity.annotation.Id;
import org.nutz.dao.entity.annotation.Table;

@Table("t_cloud_userinfo")
public class CloudInfo {

	@Id
	private int id;
	
	@Column("user_id")
	private int userId;
	
	@Column("real_name")
	private String realName;
	
	
	@Column("img")
	private String img;
	
	@Column("telephone")
	private String telephone;
	
	
	@Column("email")
	private String email;
	
	
	@Column("company")
	private String company;
	

	@Column("address")
	private String address;
	
	
	@Column("update_time")
	private Date updateTime;
	
	@Column("create_time")
	private Date createTime;
	
	@Column
	private int gender;
	
	@Column("id_card_num")
	private String idCardNum;
	
	@Column("support_tel")
	private String supportTel;//技术支持手机
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public int getUserId() {
		return userId;
	}
	public void setUserId(int userId) {
		this.userId = userId;
	}
	public String getRealName() {
		return realName;
	}
	public void setRealName(String realName) {
		this.realName = realName;
	}
	public String getImg() {
		return img;
	}
	public void setImg(String img) {
		this.img = img;
	}
	public String getTelephone() {
		return telephone;
	}
	public void setTelephone(String telephone) {
		this.telephone = telephone;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getCompany() {
		return company;
	}
	public void setCompany(String company) {
		this.company = company;
	}
	public String getAddress() {
		return address;
	}
	public void setAddress(String address) {
		this.address = address;
	}
	public Date getUpdateTime() {
		return updateTime;
	}
	public void setUpdateTime(Date updateTime) {
		this.updateTime = updateTime;
	}
	public Date getCreateTime() {
		return createTime;
	}
	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}
	public int getGender() {
		return gender;
	}
	public void setGender(int gender) {
		this.gender = gender;
	}
	public String getIdCardNum() {
		return idCardNum;
	}
	public void setIdCardNum(String idCardNum) {
		this.idCardNum = idCardNum;
	}
	public String getSupportTel() {
		return supportTel;
	}
	public void setSupportTel(String supportTel) {
		this.supportTel = supportTel;
	}
	@Override
	public String toString() {
		return "CloudInfo [id=" + id + ", userId=" + userId + ", realName="
				+ realName + ", img=" + img + ", telephone=" + telephone
				+ ", email=" + email + ", company=" + company + ", address="
				+ address + ", updateTime=" + updateTime + ", createTime="
				+ createTime + ", gender=" + gender + ", idCardNum="
				+ idCardNum + ", supportTel=" + supportTel + "]";
	}
	 
}
