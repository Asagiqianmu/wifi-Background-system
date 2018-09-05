<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ page import="java.util.Date"  %>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<c:set var="curPath" value="${ctx}/allstyle/admins" />
<c:set var="cssPath" value="${ctx}/allstyle/newEditionSkin/css" />
<c:set var="jsPath" value="${ctx}/allstyle/newEditionSkin" />
<c:set var="imgPath" value="${ctx}/allstyle/newEditionSkin/img" />
<c:set var="upLoadPath" value="http://realnameauth.oss-cn-shanghai.aliyuncs.com/user_picture/"/>
<!DOCTYPE html>
<html>
<%
long getTimestamp=new Date().getTime(); //时间戳
%>
<head>
 
<meta name="renderer" content="webkit">
	<title></title>
	<link rel="stylesheet" type="text/css" href="${cssPath}/font-icon.css?<%=getTimestamp%>">
	<link rel="stylesheet" type="text/css" href="${cssPath}/style.css?<%=getTimestamp%>">
	<link rel="stylesheet" type="text/css" href="${cssPath}/autonym.css?<%=getTimestamp%>">
	<script type="text/javascript" src="${jsPath}/js/jquery-2.1.4.min.js"></script>
	<script type="text/javascript">
		var ctx="${ctx}";
		var imgPath="${imgPath}";
		var upLoadPath="${upLoadPath}";
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
	<h2 class="list on"><a href="${ctx}/siteCustomer/toChurnUserList"><i class="icon icon-user"></i>用户管理<i class="icon icon-goLeft"></i></a></h2>
		<ul>
		<li><a href="${ctx}/siteCustomer/toChurnUserList">流失用户</a></li>
		<li><a href="${ctx}/siteCustomer/toCustomerPay">缴费/解锁/停用</a></li>
		<li class="on"><a href="${ctx}/siteCustomer/toAutoUserName">实名认证</a></li>
	</ul>
	<h2 class="list"><a href="${ctx}/siteIncome/toSiteCustomerList"><i class="icon icon-fund"></i>资金管理<i class="icon icon-goLeft"></i></a></h2>
	<h2 class="list"><a href="${ctx}/personalCenter/toPersonalCenter"><i class="icon icon-personage"></i>个人中心</a></h2>
</nav>
<div class="container">
	<div class="content withdraw">
		<h3 class="title">实名认证</h3>
		<ul class="label">
			<li class="on">实名审核</li>
			<li>手动绑定</li>
			<li>已认证列表</li>
			<li>未认证列表</li>
		</ul>

		<div class="ui-content">
			<div class="surplus">剩余审核人数<span id="pepNum">0</span><em>-1</em>人</div>
			<div class="details">
				<img class="pas" src="${jsPath}/img/pass.png" width=200px>
				<img class="refuse" src="${jsPath}/img/refuse.png" width=200px>
				<div class="userinfo">
					<p class="phone"><label>手机号：</label><span></span></p>
					<p class="name"><label>姓&nbsp;&nbsp;&nbsp;名：</label><span></span></p>
					<p class="userId"><label>身份证号：</label><span></span></p>
				</div>
				<div class="identityCard">
					<h6>用户上传身份证照片</h6>
					<p class="image rotate0">
						
					</p>
					<button class="anticlockwise"></button>
					<button class="clockwise"></button>
				</div>
				<div class="userPhoto">
					<h6>用户上传自拍头像</h6>
					<p class="image rotate0">
						
					</p>
					<button class="anticlockwise"></button>
					<button class="clockwise"></button>
				</div>
			</div>
			<p class="operation"><button disabled="disabled" class="pass">通过审核</button><button disabled="disabled" class="fail">拒绝通过</button></p>
		</div>
		<div class="ui-content" style="display:none;">
			<hr>
			<form  id="binding">
				<p><label>要绑定的手机号</label><input name="userNum" id="userNum" maxlength="11" type="tel" value="" onkeyup="this.value=this.value.replace(/\D/g,'')" onafterpaste="this.value=this.value.replace(/\D/g,'')"><span style="color:red"></span></p>
				<p><label>真实姓名</label><input name="userName" id="userName" type="text" value=""><span style="color:red"></span></p>
				<p><label>身份证号</label><input name="userId" maxlength="18" id="userId" type="tel" value=""><span style="color:red"></span></p>
				<p><label>宿舍位置</label><input name="userLocat" id="userLocat" type="text" value=""><span style="color:red"></span></p>
				<p><button type="button" id="bindingSub">绑定</button></p>
			</form>
		</div>
		<div class="ui-content passr" style="display:none;">
			<p class="rzTit"><span>姓名</span><span>身份证号</span><span>电话号</span><span>地址</span></p>
			<ul class="rzList">
				<!-- <li><span></span><span></span><span></span><span></span></li> -->
			</ul>
			<ul class="paging" >
				<li class="zong" id="daiLog"></li>
				<li class="goLeft on"><i class="icon icon-left"></i></li>
				<li class="goRight on"><i class="icon icon-right"></i></li>
				<p>跳转至<input onkeyup="value=value.replace(/[^\d]/g,'') "  style="width:50px;height:20px;border:1px solid skyblue"  id="numToPage"  type="tel">页 <button id="jumpToPage" class="jumpGoToNum">跳转</button></p>
			</ul>
		</div>
		<div class="ui-content wei" style="display:none;">
			<p class="wrzTit"><span>姓名</span><span>身份证号</span><span>电话号</span><span>地址</span></p>
			<ul class="wrzList">
				<!-- <li><span></span><span></span><span></span><span></span></li> -->
			</ul>
			<ul class="paging" >
				<li class="zong" id="wdaiLog"></li>
				<li class="goLeft on"><i class="icon icon-left"></i></li>
				<li class="goRight on"><i class="icon icon-right"></i></li>
				<p>跳转至<input onkeyup="value=value.replace(/[^\d]/g,'') "  style="width:50px;height:20px;border:1px solid skyblue"  id="numToPage"  type="tel">页 <button id="jumpToPage" class="jumpGoToNum">跳转</button></p>
			</ul>
		</div>
	</div>
</div>
<div class="mask" style="background: none">
	<div class="bigImg">
		<button class="gbimg"><i class="icon icon-false"></i></button>
		<p class="rotate0"></p>
		<button class="rotaten"></button>
		<button class="rotates"></button>
	</div>
</div>
<div class="win">
	<span>操作成功</span>
</div>
<div class="whether">
	<span>是否确定当前操作？</span>
	<button>是</button><button>否</button>
</div>
<script type="text/javascript" src="${jsPath}/js/jquery.validate.min.js"></script>
<script type="text/javascript" src="${jsPath}/js/jquery.validate.messages_cn.js"></script>
<script type="text/javascript" src="${jsPath}/js/customerPay/autoUserName.js?<%=getTimestamp%>"></script>
</body>
</html>