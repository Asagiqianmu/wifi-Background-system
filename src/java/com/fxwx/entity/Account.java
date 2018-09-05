package com.fxwx.entity;

import java.math.BigDecimal;
import java.util.Date;
import org.nutz.dao.entity.annotation.Column;
import org.nutz.dao.entity.annotation.Id;
import org.nutz.dao.entity.annotation.Table;


/**
 * @ToDoWhat 
 * @author xmm
 */
@Table("t_account")
public class Account {
	@Id
	private int id;									// '主键',
	
	@Column("user_id")
	private int userId;								// '用户id',
	
	@Column("amonut")
	private BigDecimal amonut;						// '账户金额，单位元',
	
	@Column("total_freeze_amount")
	private BigDecimal totalFreezeAmount;			// '总冻结金额，元',
	
	@Column("total_penny_score")
	private long totalPennyScore;					// '总积分，1分=1人民币分',
	
	@Column("update_time")
	private Date updateTime;						// '更新时间',
	
	@Column("create_time")
	private Date createTime; 						//'创建时间',
	
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
	
    public BigDecimal getAmonut() {
    	return amonut;
    }
	
    public void setAmonut(BigDecimal amonut) {
    	this.amonut = amonut;
    }
    
    public void setAmonut(String amonut) {
    	this.amonut =new BigDecimal(amonut);
    }
	
    public BigDecimal getTotalFreezeAmount() {
    	return totalFreezeAmount;
    }
	
    public void setTotalFreezeAmount(BigDecimal totalFreezeAmount) {
    	this.totalFreezeAmount = totalFreezeAmount;
    }
    
    public void setTotalFreezeAmount(String totalFreezeAmount) {
    	this.totalFreezeAmount =new BigDecimal(totalFreezeAmount);
    }
	
    public long getTotalPennyScore() {
    	return totalPennyScore;
    }
	
    public void setTotalPennyScore(long totalPennyScore) {
    	this.totalPennyScore = totalPennyScore;
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

	@Override
    public String toString() {
	    return "Account [id=" + id + ", userId=" + userId + ", amonut=" + amonut + ", totalFreezeAmount=" + totalFreezeAmount + ", totalPennyScore=" + totalPennyScore + ", updateTime=" + updateTime + ", createTime=" + createTime + "]";
    }

	
	
}
