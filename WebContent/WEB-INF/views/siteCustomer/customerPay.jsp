<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ page import="java.util.Date"  %>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<c:set var="curPath" value="${ctx}/allstyle/admins" />
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
	<link href="${cssPath}/user.css?<%=getTimestamp%>" type="text/css" rel="stylesheet" />
	<script type="text/javascript" src="${jsPath}/js/jquery-2.1.4.min.js"></script>
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
<body>
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
	<%-- <h2 class="list  on"><a href="${ctx}/siteCustomer/toSiteCustomerList"><i class="icon icon-user"></i>用户管理<i class="icon icon-goLeft"></i></a></h2> --%>
	<h2 class="list on"><a href="${ctx}/siteCustomer/toChurnUserList"><i class="icon icon-user"></i>用户管理<i class="icon icon-goLeft"></i></a></h2>
	  <ul>
		<li><a href="${ctx}/siteCustomer/toChurnUserList">流失用户</a></li>
		<li class="on"><a href="${ctx}/siteCustomer/toCustomerPay">缴费/解锁/停用</a></li>
			<li><a href="${ctx}/siteCustomer/toAutoUserName">实名认证</a></li>
	  </ul>
	<h2 class="list"><a href="${ctx}/siteIncome/toSiteCustomerList"><i class="icon icon-fund"></i>资金管理<i class="icon icon-goLeft"></i></a></h2>
	<h2 class="list"><a href="${ctx}/personalCenter/toPersonalCenter"><i class="icon icon-personage"></i>个人中心</a></h2>
	
	
</nav>
<div class="container">
	<div class="content user">
		<div class="user-pay" style="display:block">
			<h3 class="title">缴费/解锁/停用</h3>
				<ul class="site">
				<li>按场所查询<span class="college" id="userPay">请选择场所<i class="icon icon-down"></i></span>
				 <input id="siteId" type="hidden" >
					<ul  class="pullD">
							<c:forEach var="p" items="${siteList }">
							<li value="${p.id}" class="siteChorses">${p.site_name }</li>
						    </c:forEach>
					</ul>
				</li>
				<li>
					<input class="user-college" id="userName" name="userName" type="text" onkeyup="this.value=this.value.replace(/\D/g,'')" value="" placeholder="请输入手机号">
					<!-- <i id="query" class="icon icon-seek"></i> --><i id="query" class="icon icon-seek"></i>
				</li>
				<li><span id="tiShi" style="color: red"></span></li>
			</ul>
			<span class="ui-addUser fn-addUser"><i class="icon icon-add"></i>新增用户</span>
			<hr style="height:6px; border:none; background:#e5e5e5; margin-left:2%; width:100%; margin-top:20px;">
			<div class="ui-userAccount"></div>
		</div>
	</div>
</div>
<div class="mask">
	<div class="newly">
	<form id="customerPay" method="post">
		<div class="new premises" style="display:none">
			<h2>充值<i class="icon icon-false"></i></h2>
			<ul>
				<div class="group">充值类型<span id="je"></span> 
					<i class="icon icon-down"></i>
					<ul id="riqi">
					 <li id="riqidate">请选择付费类型</li>
					</ul>
				</div>
				<li>充值数量<input type="text" id="pay_no" onkeyup="this.value=this.value.replace(/\D/g,'')" name="pay" value="1"><em></em></li>
				<li>充值总额<p id="je2"></p>元</li>
				<input type="hidden" id="amount" name="amount" value="1" />
			</ul>
			<div class="btns">
				<p>
					<button type="button" id="sub" >立即充值</button>
					<button id="payCancel" type="button">取消</button>
				</p>
			</div>
		</div>
		</form>
		<form id="addRegistForm" method="post" class="validate">
		<div class="new addUser" style="display:block">
			<h2>注册<i class="icon icon-false"></i></h2>
			<ul>
				<li>手机号<input type="text" value="" onkeyup="this.value=this.value.replace(/\D/g,'')" id="uname" name="uname" placeholder="请输入手机号"><em></em></li>
				<li>密&nbsp;&nbsp;&nbsp;码<input type="text" id="pwd" name="pwd" placeholder="请输入密码"><em></em></li>
				<li class="sexList"><em>性&nbsp;&nbsp;&nbsp;别</em>
					<ul class="fn-sex" >
						<li class="on" value="1"><span><i class="icon icon-circle"></i></span>男</li>
						<li value="0"><span><i class="icon icon-circle"></i></span>女</li>
					</ul>
				</li>
			</ul>
			<div class="btns">
				<p>
					<button type="button" id="doAddRegisteBtn">立即创建</button>
				<button id="regCancel" type="button">取消</button> 
				</p>
			</div>
		</div>
		</form>
	</div>
</div>
<div class="win">
	<span>操作成功</span>
</div>
<div class="whether">
	<span>是否确定当前操作？</span>
	<button>是</button><button style="border:none">否</button>
</div>
<div class="barcontainer"><div class="meter"></div></div>
<script src="${curPath}/js/jquery.validate.min.js" type="text/javascript"></script>
<script src="${curPath}/js/jquery.validate.messages_cn.js" type="text/javascript"></script> 
<%-- <script type="text/javascript" src="${jsPath}/js/customerPay/unuser.js?<%=getTimestamp%>"></script> --%>
<script type="text/javascript" src="${jsPath}/js/customerPay/userPay.js?<%=getTimestamp%>"></script>
<script type="text/javascript" src="${jsPath}/js/customerPay/customerPay.js?<%=getTimestamp%>"></script>
<%-- <script type="text/javascript" src="${jsPath}/js/customerPay/cloudUserList.js?<%=getTimestamp%>"></script> --%>
</body>
</html>