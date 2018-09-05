package com.fxwx.entity;

import java.sql.Timestamp;
import org.nutz.dao.entity.annotation.Column;
import org.nutz.dao.entity.annotation.Id;
import org.nutz.dao.entity.annotation.Table;


/**角色表
 * @ToDoWhat 
 * @author xmm
 */
@Table("t_manage_role")
public class Role {
	
	@Id
	private int id ;// '主键',
	
	@Column("role_name")
	private String roleName;//'角色名称',
	
	@Column("role_des")
	private String roleDes;//'角色描述',
	
	@Column("create_time")
	private Timestamp createTime;//'创建时间',

	
    public int getId() {  
    	
    	return id;
    }

	
    public void setId(int id) {
    	this.id = id;
    }

	
    public String getRoleName() {
    	return roleName;
    }

	
    public void setRoleName(String roleName) {
    	this.roleName = roleName;
    }

	
    public String getRoleDes() {
    	return roleDes;
    }

	
    public void setRoleDes(String roleDes) {
    	this.roleDes = roleDes;
    }

	
    public Timestamp getCreateTime() {
    	return createTime;
    }

	
    public void setCreateTime(Timestamp createTime) {
    	this.createTime = createTime;
    }


	@Override
    public String toString() {
	    return "Role [id=" + id + ", roleName=" + roleName + ", roleDes=" + roleDes + ", createTime=" + createTime + "]";
    }
	
}
