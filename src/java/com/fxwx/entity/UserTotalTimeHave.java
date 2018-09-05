package com.fxwx.entity;

import java.sql.Timestamp;

import org.nutz.dao.entity.annotation.Column;
import org.nutz.dao.entity.annotation.Id;
import org.nutz.dao.entity.annotation.Table;

/**
 * 
 * @author zsk
 *  用户累计时长
 */
@Table("t8_user_total_time_have")
public class UserTotalTimeHave {

	@Id
	private int id;
	@Column("site_id")
	private int siteId;
	@Column("site_name")
	private String siteName;
	@Column("user_name")
	private String userName;
	@Column("total_time")
	private String total_time;
	@Column("start_date")
	private String startDate;
	@Column("end_date")
	private String endDate;
	@Column("create_time")
	private String create_time;
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
	public String getSiteName() {
		return siteName;
	}
	public void setSiteName(String siteName) {
		this.siteName = siteName;
	}
	public String getUserName() {
		return userName;
	}
	public void setUserName(String userName) {
		this.userName = userName;
	}
	public String getTotal_time() {
		return total_time;
	}
	public void setTotal_time(String total_time) {
		this.total_time = total_time;
	}
	
	public String getStartDate() {
		return startDate;
	}
	public void setStartDate(String startDate) {
		this.startDate = startDate;
	}
	public String getEndDate() {
		return endDate;
	}
	public void setEndDate(String endDate) {
		this.endDate = endDate;
	}
	public String getCreate_time() {
		return create_time;
	}
	public void setCreate_time(String create_time) {
		this.create_time = create_time;
	}
	@Override
	public String toString() {
		return "UserTotalTimeHave [id=" + id + ", siteId=" + siteId + ", siteName=" + siteName + ", userName="
				+ userName + ", total_time=" + total_time + ", startDate=" + startDate + ", endDate=" + endDate
				+ ", create_time=" + create_time + "]";
	}
}
