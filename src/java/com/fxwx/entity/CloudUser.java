package com.fxwx.entity;

import java.sql.Timestamp;
import org.nutz.dao.entity.annotation.Column;
import org.nutz.dao.entity.annotation.Id;
import org.nutz.dao.entity.annotation.Table;



/**后台用户表实体类
 * @ToDoWhat 
 * @author xmm
 */
@Table("t_cloud_user")
public class CloudUser {
	
	@Id
	private int id;//'主键',
	
	@Column("user_name")
	private String userName;// '用户名称',
	
	@Column("pass_word")
	private String passWord;// '密码',
	
	@Column("is_stoped")
	private int isStoped;// '是否停用，0不是，1是',
	
	@Column("create_time")
	private Timestamp createTime;// '注册时间',
	@Column("role_id")
	private String roleId;//角色id
	
	@Column("withdraw_phone")
	private String withdrawPhone;
	
    public int getId() {
    	return id;
    }
	
    public void setId(int id) {
    	this.id = id;
    }
	
    public String getWithdrawPhone() {
		return withdrawPhone;
	}

	public void setWithdrawPhone(String withdrawPhone) {
		this.withdrawPhone = withdrawPhone;
	}

	public String getUserName() {
    	return userName;
    }
	
    public void setUserName(String userName) {
    	this.userName = userName;
    }
	
    public String getPassWord() {
    	return passWord;
    }
	
    public void setPassWord(String passWord) {
    	this.passWord = passWord;
    }
	
    public int getIsStoped() {
    	return isStoped;
    }
	
    public void setIsStoped(int isStoped) {
    	this.isStoped = isStoped;
    }
	
    public Timestamp getCreateTime() {
    	return createTime;
    }
	
    public void setCreateTime(Timestamp createTime) {
    	this.createTime = createTime;
    }
    
	public String getRoleId() {
		return roleId;
	}

	public void setRoleId(String roleId) {
		this.roleId = roleId;
	}

	@Override
    public String toString() {
	    return "User [id=" + id + ", userName=" + userName + ", passWord=" + passWord + ", isStoped=" + isStoped + ", createTime=" + createTime + "]";
    }

}
