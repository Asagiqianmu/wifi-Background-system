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
 
<meta name="renderer" content="webkit">
	<title></title>
	<link rel="stylesheet" type="text/css" href="${cssPath}/font-icon.css?<%=getTimestamp%>">
	<link rel="stylesheet" type="text/css" href="${cssPath}/style.css?<%=getTimestamp%>">
	<link href="${cssPath}/earning.css?<%=getTimestamp%>" type="text/css" rel="stylesheet" />
	<script type="text/javascript" src="${jsPath}/js/jquery-2.1.4.min.js"></script>
	<script type="text/javascript">
		var ctx="${ctx}";
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
	<%-- <h2 class="list  on"><a href="${ctx}/siteCustomer/toSiteCustomerList"><i class="icon icon-user"></i>用户管理<i class="icon icon-goLeft"></i></a></h2> --%>
	<h2 class="list"><a href="${ctx}/siteCustomer/toChurnUserList"><i class="icon icon-user"></i>用户管理<i class="icon icon-goLeft"></i></a></h2>
	<h2 class="list on"><a href="${ctx}/siteIncome/toSiteCustomerList"><i class="icon icon-fund"></i>资金管理<i class="icon icon-goLeft"></i></a></h2>
	  <ul>
		<li class="on"><a href="${ctx}/siteIncome/toSiteCustomerList">收入明细</a></li>
	    <li><a href="${ctx}/withDraw/toWithDrawIndex">提现管理</a></li>  
	  </ul>
	<h2 class="list"><a href="${ctx}/personalCenter/toPersonalCenter"><i class="icon icon-personage"></i>个人中心</a></h2>
</nav>
<div class="container">
	<div class="content user">
		<div class="user-income">
			<h3 class="title">收入明细</h3>
			<ul class="site">
				<li style="margin-right:20px;">按场所查询<span class="college" id="collegeSite"><i class="icon icon-down"></i></span>
					<input id="site_id" type="hidden">
					<ul class="pullD"id="pullDsite">
						<c:forEach var="p" items="${siteList }">
							<li value="${p.id}">${p.site_name }</li>
						</c:forEach>
					</ul>
				</li>
				<li class="dateSelect" style="margin-right:20px;">
					日期范围
					<input id="startDate" style="width:140px;" type="text" readonly="readonly" placeholder="请输入查询时间" onclick="WdatePicker({dateFmt:'yyyy-MM-dd'})" class="Wdate">
					&nbsp;至&nbsp;
					<input id="endDate" style="width:140px;" type="text" readonly="readonly" placeholder="请输入查询时间" onclick="WdatePicker({dateFmt:'yyyy-MM-dd'})" class="Wdate">
				</li>
				<li class="rechargeType">按充值类型查询<span class="college collegeType">全部<i class="icon icon-down"></i></span>
					<ul class="pullD pullDtype">
							<li>全部</li>
					<c:forEach var="n" items="${sitels }">
							<c:if test="${n.name!='' }"><li id="temp" >${n.name }</li></c:if>
						</c:forEach>
					</ul>
					<p class="switch">按用户名查询</p>
				</li>
				<li class="names">
					按用户名查询<input id="selByUserName" type="text" value="" placeholder="请输入用户名">
					<p class="switch">按时间段查询</p>
				</li>
				<li style="margin-left:10px;">
					<button id="selBtn">查询</button>
				</li>
			</ul>
			<div class="user-list">
				<p>总收入额&nbsp;&nbsp;<span id="money" style="color:skyblue"></span></p>
				<ul>
					<h6>
						<span>充值金额(元)</span>
						<span>充值类型</span>
						<span>购买数量</span>
						<span>交易类型</span>
						<span>用户名</span>
						<span>充值时间</span>
					</h6>
					<li>
						<!-- <p>5.00</p>
						<p>按月</p>
						<p>10</p>
						<p>18248113320</p>
						<p>2015-10-24 17:25</p> -->
					</li>
				</ul>
			</div>
			<div class="down">
				<button class="download">导出EXCEL</button>
				<ul class="paging">
					<li class="zong"></li>
					<li class="goLeft on"><i class="icon icon-left"></i></li>
					<li class="goRight on"><i class="icon icon-right"></i></li>
					<p>跳转至<input style="width:50px;height:20px;border:1px solid skyblue" id="num" onkeyup="value=value.replace(/[^\d]/g,'')"   type="tel" >页&nbsp;<label id="jump"><Button class="jumpGoToNum">跳转</Button></label></p>
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
 <script type="text/javascript" src="${jsPath}/js/customerPay/earning.js?<%=getTimestamp%>"></script>
<script type="text/javascript" src="${jsPath}/js/My97DatePicker/WdatePicker.js?<%=getTimestamp%>"></script>
 </body>
</html>