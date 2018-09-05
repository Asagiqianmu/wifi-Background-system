package com.fxwx.entity;

import java.sql.Timestamp;
import org.nutz.dao.entity.annotation.Column;
import org.nutz.dao.entity.annotation.Id;
import org.nutz.dao.entity.annotation.Table;


/**后台用户信息
 * @ToDoWhat 
 * @author xmm
 */
@Table("t_cloud_userinfo")
public class CloudUserInfo {
	
	@Id
	private int id;
	
	@Column("user_id")
	private int userId;//'用户id',
	
	@Column("real_name")
	private String realName;// '用户真实姓名',
	
	@Column("gender")
	private int gender;// '性别，0不明，1男，2女',
	
	@Column("telephone")
	private String telephone;// '用户手机号码',
	
	@Column("email")
	private String email;// '用户电子邮箱',
	
	@Column("id_card_num")
	private String idCardNum;// '身份证号码',
	
	@Column("update_time")
	private Timestamp updateTime;// '更新时间',
	
	@Column("create_time")
	private Timestamp createTime;// '创建时间',
	
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

	
    public int getGender() {
    	return gender;
    }

	
    public void setGender(int gender) {
    	this.gender = gender;
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

	
    public String getIdCardNum() {
    	return idCardNum;
    }

	
    public void setIdCardNum(String idCardNum) {
    	this.idCardNum = idCardNum;
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
    
	public String getSupportTel() {
		return supportTel;
	}

	public void setSupportTel(String supportTel) {
		this.supportTel = supportTel;
	}

	@Override
	public String toString() {
		return "CloudUserInfo [id=" + id + ", userId=" + userId + ", realName="
				+ realName + ", gender=" + gender + ", telephone=" + telephone
				+ ", email=" + email + ", idCardNum=" + idCardNum
				+ ", updateTime=" + updateTime + ", createTime=" + createTime
				+ ", supportTel=" + supportTel + "]";
	}

}
