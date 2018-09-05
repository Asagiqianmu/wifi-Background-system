<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ page import="java.util.Date"  %>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<c:set var="cssPath" value="${ctx}/allstyle/newEditionSkin/css" />
<c:set var="jsPath" value="${ctx}/allstyle/newEditionSkin" />
<!DOCTYPE html>
<html>
<%
long getTimestamp=new Date().getTime(); //时间戳
%>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta name="renderer" content="webkit">
	<title></title>
	<link rel="stylesheet" type="text/css" href="${cssPath}/font-icon.css?<%=getTimestamp%>">
	<link rel="stylesheet" type="text/css" href="${cssPath}/style.css?<%=getTimestamp%>">
	<link rel="stylesheet" type="text/css" href="${cssPath}/personal.css?<%=getTimestamp%>">
	<script type="text/javascript" src="${jsPath}/js/jquery-2.1.4.min.js"></script>
	<script type="text/javascript" src="${jsPath}/js/floatAlert.js"></script>
	<script type="text/javascript">
		var ctx="${ctx}";
	</script>
	<script> 
	   (function() {
			 if (! 
			 /*@cc_on!@*/
			 0) return;
			 var e = "abbr, article, aside, audio, canvas, datalist, details, dialog, eventsource, figure, footer, header, hgroup, mark, menu, meter, nav, output, progress, section, time, video".split(', ');
			 var i= e.length;
			 while (i--){
				 document.createElement(e[i])
			 } 
		})() 
	</script>
	
</head>
<body oncontextmenu=self.event.returnValue=false>
<header class="ui-header">
	<h1>
		<span class="first"></span>
		<span class="sun">Wi-Fi运营系统&nbsp;·&nbsp;</span>
		<span class="back">后台管理员</span>
	</h1>
	<span class="icon icon-ask"></span>
	<div class="admin">
		<i class="icon icon-admin"></i>
		<span class="adname">${user.userName}</span>
		<i class="icon icon-down"></i>
		<ul class="menu">
			<li class="personageCenter">个人中心</li>
			<li class="exit">退出</li>
		</ul>
	</div>
</header>
<nav class="ui-nav">
	<h2 class="list"><a href="${ctx}/allSiteOfReportStatistics/index"><i class="icon icon-oper"></i>运营概览</a></h2>
	<h2 class="list"><a href="${ctx}/CloudSiteManage/index"><i class="icon icon-place"></i>场所管理</a></h2>
	<h2 class="list"><a href="${ctx}/SitePriceBilling/toSiteBilling"><i class="icon icon-billing"></i>计费管理</a></h2>
	<h2 class="list"><a href="${ctx}/siteCustomer/toChurnUserList"><i class="icon icon-user"></i>用户管理<i class="icon icon-goLeft"></i></a></h2>
	<h2 class="list"><a href="${ctx}/siteIncome/toSiteCustomerList"><i class="icon icon-fund"></i>资金管理<i class="icon icon-goLeft"></i></a></h2>
	<h2 class="list  on"><a href="${ctx}/personalCenter/toPersonalCenter"><i class="icon icon-personage"></i>个人中心</a></h2>
</nav>
<div class="container">
	<div class="content">
		<h3 class="title">个人中心</h3>
		<div class="userAndPwd">
			<p>登录账号&nbsp;:&nbsp;&nbsp;&nbsp;<span class="userP"></span><i class="icon icon-edit" id="modUserPhone"></i></p>
			<p>登录密码&nbsp;:&nbsp;&nbsp;&nbsp;<span class="pwdP">******</span><i class="icon icon-edit" id="modUserPwd"></i></p>
			<hr>
			<div>提现验证手机号&nbsp;:&nbsp;&nbsp;&nbsp;<span id="txPhone">135***2119</span><i class="icon icon-edit" id="modWithPhone"></i></div>
			<em>（默认为您的登录账号）</em>
		</div>
		<div class="bankCardList">
			<span>我的银行卡</span>
			<button id="addBankCard"><i class="icon icon-add"></i>银行卡号</button><button id="addAlipay"><i class="icon icon-add"></i>支付宝账号</button>
			<ul id="WithdrawInfo">
				<h6>
					<span>收款人</span>
					<span>收款账号</span>
					<span>开户银行</span>
					<span>支行名称</span>
					<span>操作</span>
				</h6>
				
			</ul>
		</div>
	</div>
</div>
<div class="mask">
	<div class="alertVerify">
		<p class="verifyinput"><label for="">验证码已发送至您的手机</label><input id="verifyNum" type="tel" maxlength="4" placeholder="请输入手机验证码" onkeyup="this.value=this.value.replace(/\D/g,'')" onafterpaste="this.value=this.value.replace(/\D/g,'')"><button class="fn-gain" disabled>60</button></p>
		<p class="verifyBtn"><button class="ui-btn fn-pass">确定</button><button class="ui-btn fn-close">取消</button></p>
		<span>若无法获取验证码或手机已丢失，请联系客服<i>400-666-0050</i></span>
	</div>
	<div class="alertPhoneVerify">
		<p class="alertText">当前验证手机号</p>
		<span class="modPhone"></span>
		<hr>
		<div><label>请输入新的验证手机号</label><button type="button" class="fn-gain1 on">获取验证码</button><input id="newPhone" type="tel" value="" maxlength="11" onkeyup="this.value=this.value.replace(/\D/g,'')" onafterpaste="this.value=this.value.replace(/\D/g,'')"></div>
		<div><label>请输入手机验证码</label><input class="kzmg" type="tel" maxlength="4" value="" onkeyup="this.value=this.value.replace(/\D/g,'')" onafterpaste="this.value=this.value.replace(/\D/g,'')"></div>
		<p class="verifyBtn"><button class="ui-btn fn-pass">确定</button><button class="ui-btn fn-close">取消</button></p>
	</div>
	<div class="pwdMod">
		<p class="pwdText"></p>
		<p><label>请输入新密码</label><input id="newPwd" onkeyup="this.value=this.value.replace( /\s+/g,'')" type="text" value=""></p>
		<p class="verifyBtn" id="btns"></p>
	</div>
	<div class="show" style="display:none;">
		<h4>提现<i class="icon icon-false"></i></h4>
		<form id="withdrawForm">
			<p><label>可提现金额：</label><span class="mayMoneyGeg" id="mayMoneyGeg" style="font-size:16px">10000元</span></p>
			<p><label for="moneyGeg">提现金额</label><input id="moneyGeg"  type="tel" value="" name="moneryGeg"/><span></span></p>
			<p><label>收款人</label><input style="background:#e6e6e6;border:none;" class="reveal" type="text" value="公司对账账号" disabled name="accountName" id="accountName"></p>
			<p><label>收款账号</label><input class="reveal" disabled type="text" value="" name="bankcarNum" id="bankcarNum"><em class="selecter fn-select">选择收款账号</em></p>
			<p><label>开户银行</label><input class="reveal" disabled type="text" value="" name="bankDeposit" id="bankDeposit"></p>
			<p><label>支行名称</label><input class="reveal" disabled type="text" value="" name="branchName" id="branchName"></p>
			<button class="refer" id="wihdrawSubmit" type="button">提交</button>
		</form>
	</div>
	<div class="show" style="display:none;">
		<h4>选择账号<i class="icon icon-false"></i></h4>
		<div class="listClosedid">
			<button class="addClosedid fn-add">银行账号</button>
			<ul class="closedidList">
				<li class="on">
					<span class="ico"><i class="icon icon-true"></i></span>
					<span class="text">风行第七分</span>
					<span class="text">1564***216</span>
					<span class="ico"><i id="trash" class="icon icon-trash"></i></span>
				</li>
				<li>
					<span class="ico"><i class="icon icon-true"></i></span>
					<span class="text">风行第七分</span>
					<span class="text">1564***216</span>
					<span class="ico"><i class="icon icon-trash"></i></span>
				</li>
			</ul>
			<button id="selectBankCard" class="ensure">确定</button>
		</div>
	</div>
	<div class="show" style="display:none;">
		<h4>银行账号<i class="icon icon-false"></i></h4>
		<form style="margin-top:40px;" method="POST" id="newAddCardName">
			<p><label for="">收款人</label><input type="tel" value="" name="accountNames" id="accountNames" maxlength="10"/><span class="error"></span></p>
			<p><label for="">收款账号</label><input type="tel" value="" name="bankcarNums" id="bankcarNums" maxlength="19" /><span class="error"></span></p>
			<p><label for="">开户银行</label><input name="bankDeposits" id="bankDeposits" maxlength="20"><span class="error"></span></p>
			<p><label for="">支行名称</label><input type="tel" value="" name="branchNames"  maxlength="20" id="branchNames"/><span class="error"></span></p>
			<button class="refer" type="button" id="newAddCard">提交</button>
			<div class="bigNum"></div>
		</form>
	</div>
	<div class="show" style="display:none;">
		<h4>支付宝账号<i class="icon icon-false"></i></h4>
		<form style="margin-top:40px;" method="POST" id="newAddAlipayName">
			<p><label for="">收款人</label><input type="tel" value="" name="alAccaccountNamesountNames" maxlength="10" id="alAccountNames"/><span class="error"></span></p>
			<p><label for="">支付宝账号</label><input type="tel" value="" name="alipayNums" id="alipayNums" maxlength="19" /><span class="error"></span></p>
			<button class="refer" type="button" id="newAddAlipay">提交</button>
			<div class="bigNum"></div>
		</form>
	</div>
</div>
<div class="win">
	<span>操作成功</span>
</div>
<div class="whether">
	<span>是否确定当前操作？</span>
	<button>是</button><button>否</button>
</div>
<script type="text/javascript" src="${jsPath }/js/jquery.validate.min.js"></script>
<script type="text/javascript" src="${jsPath }/js/jquery.validate.messages_cn.js"></script>
<script type="text/javascript" src="${jsPath }/js/personal/personal.js?<%=getTimestamp%>"></script>
</body>
</html>