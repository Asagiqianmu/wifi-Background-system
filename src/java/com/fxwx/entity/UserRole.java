package com.fxwx.entity;

import java.sql.Timestamp;
import org.nutz.dao.entity.annotation.Column;
import org.nutz.dao.entity.annotation.Id;
import org.nutz.dao.entity.annotation.Table;


/**用户角色表
 * @ToDoWhat 
 * @author xmm
 */
@Table("t_manage_user_role")
public class UserRole {
	@Id
	private int id ;// '主键',
	
	@Column("user_id")
	private int userId ;//'用户id',
	
	@Column("role_id")
	private int roleId ;//'角色id',
	
	@Column("is_use")
	private int isUse  ;//'是否使用，1是，0否',
	
	@Column("create_time")
	private Timestamp createTime  ;// '创建时间',

	
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

	
    public int getRoleId() {
    	return roleId;
    }

	
    public void setRoleId(int roleId) {
    	this.roleId = roleId;
    }

	
    public int getIsUse() {
    	return isUse;
    }

	
    public void setIsUse(int isUse) {
    	this.isUse = isUse;
    }

	
    public Timestamp getCreateTime() {
    	return createTime;
    }

	
    public void setCreateTime(Timestamp createTime) {
    	this.createTime = createTime;
    }


	@Override
    public String toString() {
	    return "UserRole [id=" + id + ", userId=" + userId + ", roleId=" + roleId + ", isUse=" + isUse + ", createTime=" + createTime + "]";
    }
	
}
