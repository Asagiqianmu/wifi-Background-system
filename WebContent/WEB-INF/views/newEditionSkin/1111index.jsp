<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ page import="java.util.Date"%>
<%@ taglib prefix="shiro" uri="http://shiro.apache.org/tags" %>   
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<c:set var="cssPath" value="${ctx}/allstyle/newEditionSkin/css" />
<c:set var="jsPath" value="${ctx}/allstyle/newEditionSkin/js" />
<c:set var="dataPath" value="${jsPath}/dataStatisticsReports" />
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
		<%-- <link rel="stylesheet" type="text/css" href="${cssPath}/user.css?<%=getTimestamp%>"> --%>
	    <script type="text/javascript" src="${jsPath}/jquery-2.1.4.min.js"></script>
	  
	    <style type="text/css">${demo.css}</style>
	    <script type="text/javascript">
            var ctx="${ctx}";
        </script>
</head>
<body>
<%-- <script type="text/javascript" src="${jsPath}/line/highcharts.js?<%=getTimestamp%>"></script>
<script type="text/javascript" src="${jsPath}/line/exporting.js?<%=getTimestamp%>"></script>
<script> 
	   (function() {
			 if (! 
			 /*@cc_on!@*/
			 0) return;
			 var e = "abbr, article, aside, audio, canvas, datalist, details, dialog, eventsource, figure, footer, header, hgroup, mark, menu, meter, nav, output, progress, section, time, video".split(', ');
			 var i= e.length;
			 while (i--){
				 document.createElement(e[i]);
			 } 
			 $('html').contextmenu(function(){
					return false;
				});
		});
	</script> --%>
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
	<h2 class="list  on"><a href="${ctx}/newEditionSkin/index"><i class="icon icon-oper"></i>运营概览</a></h2>
	<h2 class="list"><a href="${ctx}/cloudsite/cloudSiteLists"><i class="icon icon-place"></i>场所管理</a></h2>
	<h2 class="list"><a href="${ctx}/SitePriceBilling/toSiteBilling"><i class="icon icon-billing"></i>计费管理</a></h2>
	<%-- <h2 class="list"><a href="${ctx}/siteCustomer/toSiteCustomerList"><i class="icon icon-user"></i>用户管理<i class="icon icon-goLeft"></i></a></h2> --%>
	<h2 class="list"><a href="${ctx}/siteCustomer/toChurnUserList"><i class="icon icon-user"></i>用户管理<i class="icon icon-goLeft"></i></a></h2>
	<%-- <shiro:hasAnyRoles name="admin"> --%>
		<h2 class="list"><a href="${ctx}/siteIncome/toSiteCustomerList"><i class="icon icon-fund"></i>资金管理<i class="icon icon-goLeft"></i></a></h2>
	<%-- </shiro:hasAnyRoles> --%>
	<h2 class="list"><a href="${ctx}/personalCenter/toPersonalCenter"><i class="icon icon-personage"></i>个人中心</a></h2>	
</nav>
<div class="container">
	<div class="content operation">
		<h3 class="title">运营概览</h3>
		<ul class="site">
			<li>场所<span class="college">查看全部<i class="icon icon-down"></i></span>
				<ul class="pullD">
				    <li class="allSiteClass" title="查看全部">查看全部</li>
                    <c:forEach var="p" items="${siteList}">
					     <li value="${p.id}" class="on" title="${p.site_name}">${p.site_name}</li>
					</c:forEach>
				</ul>
			</li>
			<li id='zong'>人数<span class="numpe" id="siteNumTotal">&nbsp;&nbsp;5000&nbsp;&nbsp;</span></li>
			<li id="jts">今日收益：<span class="money" id="today">0元</span></li>
			<li>总收入：<span class="money" id="total">0元</span></li>
		</ul>
		<div class="contrast">
			<div class="independent">
				<p>独立用户总数</p>
				<span>0</span>
			</div>
			<div class="register">
				<p>注册用户数</p>
				<span>0</span>
			</div>
			<div class="pay">
				<p>付费用户数</p>
				<span>0</span>
			</div>
			<div class="yesterday">
				<p>昨日登录用户数</p>
				<span>0</span>
			</div>
		</div>
		<p class="userAnn">用户入网情况概览</p>
		<div class="annular">
			<div class="both">
				<p class="round" >0%</p>
				<canvas id='perception' width='200' height='200'></canvas>
				<div>用户渗透率<p class="float">该值越高表示您部署的无线网络被更多的用户知晓，反之则表示您场所的用户还不太知道您的无线信号，请您注意加大线下宣传力度</p></div>
			</div>
			<div class="both">
				<p class="round">0%</p>
				<canvas id='tryOut' width='200' height='200'></canvas>
				<div>注册转换率   <p class="float">该指标值越高表示覆盖场所用户对网络速度表示满意，反之表示网络体验较差需要提高网络体验。</p></div>
			</div>
			<div class="both">
				<p class="round">0%</p>
				<canvas id='register' width='200' height='200'></canvas>
				<div>付费转换率<p class="float">该值越高表示用户对您无线网络的稳定性、网速及价格的高度认可，反之则表示您需优化网络稳定性、及提升网速，也有可能是该场所有竞争对手存在，请视情况酌情处理。</p></div>
			</div>
		</div>
		<div class="userLineDraw">
			<p>起始时间<input id="userStartDate" type="text" readonly="readonly" onclick="WdatePicker({dateFmt:'yyyy-MM-dd'})" class="Wdate"> 至 <input id="userEndDate" type="text" readonly="readonly" onclick="WdatePicker({dateFmt:'yyyy-MM-dd'})" class="Wdate"><span id="getUserDate">查看</span></p>
			<div id="userLineDraw" style="width:95%;margin-left:2%;"></div>
		</div> 
		<div class="occupie">
			<p class="userOcc">缴费类型占比</p>
			<div id="pie"></div>
			<div id="pieChart" style="width: 300px; height: 300px;"></div>
		</div>
		<div class="income" id="theChorceDayAndMonth">
			<span>近12天/月收入统计（元）</span>
			<div class="dateSelect" id="dateSelect">
				
			</div>
			<p class="month"><span><i class="icon icon-true">按月</i></span>按月</p>
			<p class="day"><span class="on"><i class="icon icon-true">按日</i></span>按日</p>
		</div>
		<div id="histogram" style="width:100%;margin-left:2%;"></div>
		<div class="income">
			用户增长趋势<div class='problem'><i class='icon icon-ask'></i>
			<p class='proText'>用户增长趋势计算指标是按照（总付费用户数-流失付费用户数)的结果统计而来，流失付费用户按照用户过期后近两周内若无缴费行为视为流失(学校用户排除署寒假、工厂排除春节)</p>
			</div>
			 <a style="color:#57c6d4; margin-left:20px;display:inline-block;" href="${ctx}/siteCustomer/toChurnUserList">流失用户详情</a>
		</div>
		<div id="lineChart" style="width:100%;margin-left:2%;"></div>
		<!-- 重点推广用户列表 -->
		<div class="emphasis"></div>
		<!-- 被多台设备登录用户列表 -->
		<div class="numPeople"></div>
	</div>
</div>
<div class="win">
	<span>操作成功</span>
</div>
<div class="barcontainer"><div class="meter"></div></div>
<%-- <script type="text/javascript" src="${dataPath}/index.js?<%=getTimestamp%>"></script>
<script type="text/javascript" src="${dataPath}/dataStatisticsReports.js?<%=getTimestamp%>"></script>
<script type="text/javascript" src="${jsPath}/My97DatePicker/WdatePicker.js?<%=getTimestamp%>"></script> --%>
<%-- <script type="text/javascript" src="${jsPath}/customerPay/user.js"></script> --%>
</body>
</html>