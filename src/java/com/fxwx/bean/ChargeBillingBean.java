package com.fxwx.bean;

import java.util.Comparator;

public class ChargeBillingBean{
	/*场所id*/
	private int siteId;
	/*资费名称*/
	private String chargeName;
	/*资费类型*/
	private int chargeType;
	/*非融合套餐价格*/
	private String commPrice;
	/*融合套餐*/
	private String fusePrice;
	/*归属集团类型*/
	private int groupType;
	/*套餐是否停用*/
	private int isStoped;
	/*资费说明*/
	private String describe;
	/*套餐类型*/
	private String comboTpe;
	/*推荐套餐*/
	private int recommend;
	/*计费数量*/
	private int priceNum;
	/*赠送数量*/
	private int giveNum;
	/*赠送单位*/
	private int giveType;
	/*套餐号码段*/
	private String comder;
	
	public int getSiteId() {
		return siteId;
	}
	public void setSiteId(int siteId) {
		this.siteId = siteId;
	}
	public String getChargeName() {
		return chargeName;
	}
	public void setChargeName(String chargeName) {
		this.chargeName = chargeName;
	}
	public int getChargeType() {
		return chargeType;
	}
	public void setChargeType(int chargeType) {
		this.chargeType = chargeType;
	}
	public String getCommPrice() {
		return commPrice;
	}
	public void setCommPrice(String commPrice) {
		this.commPrice = commPrice;
	}
	public String getFusePrice() {
		return fusePrice;
	}
	public void setFusePrice(String fusePrice) {
		this.fusePrice = fusePrice;
	}
	public int getGroupType() {
		return groupType;
	}
	public void setGroupType(int groupType) {
		this.groupType = groupType;
	}
	public String getDescribe() {
		return describe;
	}
	public void setDescribe(String describe) {
		this.describe = describe;
	}
	
	public int getIsStoped() {
		return isStoped;
	}
	public void setIsStoped(int isStoped) {
		this.isStoped = isStoped;
	}
	
	public String getComboTpe() {
		return comboTpe;
	}
	public void setComboTpe(String comboTpe) {
		this.comboTpe = comboTpe;
	}
	
	public int getRecommend() {
		return recommend;
	}
	public void setRecommend(int recommend) {
		this.recommend = recommend;
	}
	
	public int getPriceNum() {
		return priceNum;
	}
	public void setPriceNum(int priceNum) {
		this.priceNum = priceNum;
	}
	public int getGiveNum() {
		return giveNum;
	}
	public void setGiveNum(int giveNum) {
		this.giveNum = giveNum;
	}
	public int getGiveType() {
		return giveType;
	}
	public void setGiveType(int giveType) {
		this.giveType = giveType;
	}
	
	public String getComder() {
		return comder;
	}
	public void setComder(String comder) {
		this.comder = comder;
	}
	@Override
	public String toString() {
		return "ChargeBillingBean [siteId=" + siteId + ", chargeName="
				+ chargeName + ", chargeType=" + chargeType + ", commPrice="
				+ commPrice + ", fusePrice=" + fusePrice + ", groupType="
				+ groupType + ", isStoped=" + isStoped + ", describe="
				+ describe + ", comboTpe=" + comboTpe + ", recommend="
				+ recommend + ", priceNum=" + priceNum + ", giveNum=" + giveNum
				+ ", giveType=" + giveType + ", comder=" + comder + "]";
	}
	

	
	



	
	
}
