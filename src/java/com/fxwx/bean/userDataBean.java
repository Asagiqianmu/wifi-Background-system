package com.fxwx.bean;

import java.sql.Timestamp;


/**
 * @ToDoWhat 
 * @author syb
 */
public class userDataBean {
	private int id;
	private String appid;
	private String android_homepage_pv;
	private String ios_homepage_pv;
	private String android_homepage_uv;
	private String ios_homepage_uv;
	private String android_button_pv;
	private String ios_button_pv;
	private String android_button_uv;
	private String ios_button_uv;
	private String jump_down__page_pv;
	private String auth_user_uv;
	private String create_time;
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getAppid() {
		return appid;
	}
	public void setAppid(String appid) {
		this.appid = appid;
	}
	public String getAndroid_homepage_pv() {
		return android_homepage_pv;
	}
	public void setAndroid_homepage_pv(String android_homepage_pv) {
		this.android_homepage_pv = android_homepage_pv;
	}
	public String getIos_homepage_pv() {
		return ios_homepage_pv;
	}
	public void setIos_homepage_pv(String ios_homepage_pv) {
		this.ios_homepage_pv = ios_homepage_pv;
	}
	public String getAndroid_homepage_uv() {
		return android_homepage_uv;
	}
	public void setAndroid_homepage_uv(String android_homepage_uv) {
		this.android_homepage_uv = android_homepage_uv;
	}
	public String getIos_homepage_uv() {
		return ios_homepage_uv;
	}
	public void setIos_homepage_uv(String ios_homepage_uv) {
		this.ios_homepage_uv = ios_homepage_uv;
	}
	public String getAndroid_button_pv() {
		return android_button_pv;
	}
	public void setAndroid_button_pv(String android_button_pv) {
		this.android_button_pv = android_button_pv;
	}
	public String getIos_button_pv() {
		return ios_button_pv;
	}
	public void setIos_button_pv(String ios_button_pv) {
		this.ios_button_pv = ios_button_pv;
	}
	public String getAndroid_button_uv() {
		return android_button_uv;
	}
	public void setAndroid_button_uv(String android_button_uv) {
		this.android_button_uv = android_button_uv;
	}
	public String getIos_button_uv() {
		return ios_button_uv;
	}
	public void setIos_button_uv(String ios_button_uv) {
		this.ios_button_uv = ios_button_uv;
	}
	public String getJump_down__page_pv() {
		return jump_down__page_pv;
	}
	public void setJump_down__page_pv(String jump_down__page_pv) {
		this.jump_down__page_pv = jump_down__page_pv;
	}
	public String getAuth_user_uv() {
		return auth_user_uv;
	}
	public void setAuth_user_uv(String auth_user_uv) {
		this.auth_user_uv = auth_user_uv;
	}
	public String getCreate_time() {
		return create_time;
	}
	public void setCreate_time(String create_time) {
		this.create_time = create_time;
	}
	@Override
	public String toString() {
		return "userDataBean [id=" + id + ", appid=" + appid
				+ ", android_homepage_pv=" + android_homepage_pv
				+ ", ios_homepage_pv=" + ios_homepage_pv
				+ ", android_homepage_uv=" + android_homepage_uv
				+ ", ios_homepage_uv=" + ios_homepage_uv
				+ ", android_button_pv=" + android_button_pv
				+ ", ios_button_pv=" + ios_button_pv + ", android_button_uv="
				+ android_button_uv + ", ios_button_uv=" + ios_button_uv
				+ ", jump_down__page_pv=" + jump_down__page_pv
				+ ", auth_user_uv=" + auth_user_uv + ", create_time="
				+ create_time + "]";
	}
}
