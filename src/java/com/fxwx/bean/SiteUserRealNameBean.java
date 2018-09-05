package com.fxwx.bean;

public class SiteUserRealNameBean {
	private int id;
	private int siteId;//场所id
	private String userName; //用户名
	private String telephone;//用户电话号码
	private String idCard;//身份证号
	private String address;//用户地址
	private String UserImg; //用户图片
	private String cardImg; //身份证图片
	private String siteName;//场所名称
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
	public String getUserName() {
		return userName;
	}
	public void setUserName(String userName) {
		this.userName = userName;
	}
	public String getTelephone() {
		return telephone;
	}
	public void setTelephone(String telephone) {
		this.telephone = telephone;
	}
	public String getIdCard() {
		return idCard;
	}
	public void setIdCard(String idCard) {
		this.idCard = idCard;
	}
	public String getAddress() {
		return address;
	}
	public void setAddress(String address) {
		this.address = address;
	}
	public String getUserImg() {
		return UserImg;
	}
	public void setUserImg(String userImg) {
		UserImg = userImg;
	}
	public String getCardImg() {
		return cardImg;
	}
	public void setCardImg(String cardImg) {
		this.cardImg = cardImg;
	}
	
	public String getSiteName() {
		return siteName;
	}
	public void setSiteName(String siteName) {
		this.siteName = siteName;
	}
	@Override
	public String toString() {
		return "SiteUserRealNameBean [id=" + id + ", siteId=" + siteId
				+ ", userName=" + userName + ", telephone=" + telephone
				+ ", idCard=" + idCard + ", address=" + address + ", UserImg="
				+ UserImg + ", cardImg=" + cardImg + ", siteName=" + siteName
				+ "]";
	}

	

}
