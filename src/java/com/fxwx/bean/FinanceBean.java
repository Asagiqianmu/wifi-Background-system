package com.fxwx.bean;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class FinanceBean {

	private String user_name;
	
	private String site_name;
	
	private String param_json;
	
	private String pay_type;
	
	private String finish_time;

	public String getUser_name() {
		return user_name;
	}

	public void setUser_name(String user_name) {
		this.user_name = user_name;
	}

	public String getSite_name() {
		return site_name;
	}

	public void setSite_name(String site_name) {
		this.site_name = site_name;
	}

	public String getParam_json() {
		return param_json;
	}

	public void setParam_json(String param_json) {
		String json = "";
		String amount =  param_json.split(",")[0];
		Pattern numPattern = Pattern.compile("[0-9\\.]+");
		Matcher ap = numPattern.matcher(amount);
		while (ap.find()) {
			json = ap.group();
		}
		this.param_json = json;
	}

	public String getPay_type() {
		return pay_type;
	}

	public void setPay_type(String pay_type) {
		this.pay_type = pay_type;
	}

	public String getFinish_time() {
		return finish_time;
	}

	public void setFinish_time(String finish_time) {
		this.finish_time = finish_time;
	}

	@Override
	public String toString() {
		return "FinanceBean [user_name=" + user_name + ", site_name="
				+ site_name + ", param_json=" + param_json + ", pay_type="
				+ pay_type + ", finish_time=" + finish_time + "]";
	}
}
