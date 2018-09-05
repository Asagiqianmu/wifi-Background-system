<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
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
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="renderer" content="webkit">
	<title></title>
	<link rel="stylesheet" type="text/css" href="${cssPath}/font-icon.css?<%=getTimestamp%>">
	<link rel="stylesheet" type="text/css" href="${cssPath}/style.css?<%=getTimestamp%>">
	<link rel="stylesheet" type="text/css" href="${cssPath}/user.css?<%=getTimestamp%>">
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
	<h2 class="list  on"><a href="${ctx}/siteCustomer/toChurnUserList"><i class="icon icon-user"></i>用户管理<i class="icon icon-goLeft"></i></a></h2>
    <ul>
		<li  class="on"><a href="${ctx}/siteCustomer/toChurnUserList">流失用户</a></li>
		<li><a href="${ctx}/siteCustomer/toCustomerPay">缴费/解锁/停用</a></li>
		<li><a href="${ctx}/siteCustomer/toAutoUserName">实名认证</a></li>
	</ul>
	 
	<h2 class="list"><a href="${ctx}/siteIncome/toSiteCustomerList"><i class="icon icon-fund"></i>资金管理<i class="icon icon-goLeft"></i></a></h2>
	<h2 class="list"><a href="${ctx}/personalCenter/toPersonalCenter"><i class="icon icon-personage"></i>个人中心</a></h2>
</nav>
<div class="container">
	<div class="content user">
		<div class="user-income">
			<h3 class="title">流失用户</h3>
			<ul class="site">
				<li>按场所查询<span class="college" value="all">查看全部<i class="icon icon-down"></i></span>
					<ul class="pullDD">
						<li class="allsiteChorse">查看全部</li>
						<c:forEach var="p" items="${siteList }">
							<li value="${p.id}">${p.site_name }</li>
						</c:forEach>
					</ul>
				</li>
			</ul>
			<ul class="date">
				<li>
				<input  type="text" placeholder="请输入开始时间" readonly="readonly" id="start" onclick="WdatePicker({dateFmt:'yyyy-MM-dd',maxDate:new Date(),isShowClear:false})" class="Wdate">到
				<input  type="text" placeholder='请输入结束时间' readonly="readonly" id="end" onclick="WdatePicker({dateFmt:'yyyy-MM-dd',maxDate:new Date(),isShowClear:false})" class="Wdate">
				</li>
				<li><button id="queryForList">查询</button></li>
				<li>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<button id="reset">重置</button></li>
			</ul>
			<div class="user-list">
				<p>流失总人数&nbsp;<span style="color:skyblue" id="churnUserCount"></span>（如果用户上网时间到期后，两周内没有续费则视为流失用户）</p>
				<ul>
					<h6>
						<span>用户名</span>
						<span>到期时间</span>
						<span>最后一次充值金额(元)</span>
						<span>总消费金额(元)</span>
						<span>消费次数</span>
						<span>归属场所</span>
					</h6>
					<li></li>
				</ul>
			</div>
			<div class="down">
				<button class="download">导出EXCEL</button>
				<ul class="paging">
					 
				</ul>
			</div>
		</div>
	</div>
</div>
<div class="win">
	<span>操作成功</span>
</div>
<div class="whether">
	<span>是否确定当前操作？</span>
	<button>是</button><button>否</button>
</div>
<div class="barcontainer"><div class="meter"></div></div>
<script type="text/javascript" src="${jsPath}/js/customerPay/user.js?<%=getTimestamp%>"></script>
<script type="text/javascript" src="${jsPath}/js/My97DatePicker/WdatePicker.js?<%=getTimestamp%>"></script>
</body>
</html>