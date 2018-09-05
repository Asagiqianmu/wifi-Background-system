package com.fxwx.bean;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.List;

import com.fxwx.entity.Appeal;

public class SettlementAuditBean {

	private int id;	 //提现单号ID
	private String acctID; //工单号
	private String userId;		//提现用户ID
	private BigDecimal accountIncome;	//申请提现金额
	private BigDecimal accountPlatformIncome; //平台收入
	private BigDecimal accountOfflineIncome; //线下收益
	private BigDecimal accountBalanceAfter;	//实际提现金额
	private BigDecimal accountRefund;	//退款
	private String accountStatus;			//状态
	private String realName;				//真实姓名
	private String userTel;				//客户联系电话
	private String userMail;			//用户邮箱
	private String userAddress;		//用户地址
	private String companyName; //公司名称
	private String startTime;	//开始时间
	private String endTime; //结束时间
	private BigDecimal chargeRate;//技术支持费比例
	private String applean;//获取申诉原因
	private String flowId; //支付流水编号
	private String bankCard;//收款账号
	public String getFlowId() {
		return flowId;
	}
	public void setFlowId(String flowId) {
		this.flowId = flowId;
	}
	public String getAcctID() {
		return acctID;
	}
	public void setAcctID(String acctID) {
		this.acctID = acctID;
	}
	public BigDecimal getChargeRate() {
		return chargeRate;
	}
	public void setChargeRate(BigDecimal chargeRate) {
		this.chargeRate = chargeRate;
	}
	private List<Appeal> appeals;	//申诉  修改
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	
	public String getUserId() {
		return userId;
	}
	public void setUserId(String userId) {
		this.userId = userId;
	}
	public void setAccountStatus(String accountStatus) {
		this.accountStatus = accountStatus;
	}
	public BigDecimal getAccountIncome() {
		return accountIncome;
	}
	public void setAccountIncome(BigDecimal accountIncome) {
		this.accountIncome = accountIncome;
	}
	public BigDecimal getAccountPlatformIncome() {
		return accountPlatformIncome;
	}
	public void setAccountPlatformIncome(BigDecimal accountPlatformIncome) {
		this.accountPlatformIncome = accountPlatformIncome;
	}
	public BigDecimal getAccountOfflineIncome() {
		return accountOfflineIncome;
	}
	public void setAccountOfflineIncome(BigDecimal accountOfflineIncome) {
		this.accountOfflineIncome = accountOfflineIncome;
	}
	public BigDecimal getAccountBalanceAfter() {
		return accountBalanceAfter;
	}
	public void setAccountBalanceAfter(BigDecimal accountBalanceAfter) {
		this.accountBalanceAfter = accountBalanceAfter;
	}
	public BigDecimal getAccountRefund() {
		return accountRefund;
	}
	public void setAccountRefund(BigDecimal accountRefund) {
		this.accountRefund = accountRefund;
	}
	public String getAccountStatus() {
		return accountStatus;
	}
	public void setAccountStatus(int accountStatus) {
		String status="";
		switch (accountStatus) {
		case 801:
			status="待审核";
			break;
		case 802:
			status="已审核";
			break;
		case 803:
			status="已确认";
			break;
		case 804:
			status="待支付";
			break;
		case 805:
			status="已支付";
			break;
		case 806:
			status="被申诉";
			break;
		case 807:
			status="已处理";
			break;
		case 808:
			status="完成";
			break;
		default:
			break;
		}
		this.accountStatus = status;
	}
	public String getRealName() {
		return realName;
	}
	public void setRealName(String realName) {
		this.realName = realName;
	}
	public String getUserTel() {
		return userTel;
	}
	public void setUserTel(String userTel) {
		this.userTel = userTel;
	}
	public String getUserMail() {
		return userMail;
	}
	public void setUserMail(String userMail) {
		this.userMail = userMail;
	}
	public String getUserAddress() {
		return userAddress;
	}
	public void setUserAddress(String userAddress) {
		this.userAddress = userAddress;
	}
	public String getCompanyName() {
		return companyName;
	}
	public void setCompanyName(String companyName) {
		this.companyName = companyName;
	}
	public String getStartTime() {
		return startTime;
	}
	public void setStartTime(String startTime) {
		this.startTime =startTime==null?null:startTime ;
	}
	public String getEndTime() {
		return endTime;
	}
	public void setEndTime(String endTime) {
		this.endTime =  endTime==null?null:endTime;
	}
	public List<Appeal> getAppeals() {
		return appeals;
	}
	public void setAppeals(List<Appeal> appeals) {
		this.appeals = appeals;
	}
	public String getApplean() {
		return applean;
	}
	public void setApplean(String applean) {
		this.applean = applean;
	}
	public String getBankCard() {
		return bankCard;
	}
	public void setBankCard(String bankCard) {
		this.bankCard = bankCard;
	}
	
	
//	private int pagecount ;
//	private int page;
}
