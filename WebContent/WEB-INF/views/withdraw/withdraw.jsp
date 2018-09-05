<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ page import="java.util.Date"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<c:set var="cssPath" value="${ctx}/allstyle/newEditionSkin/css" />
<c:set var="publicPath" value="${ctx}/allstyle/newEditionSkin/js" />
<c:set var="imgPath" value="${ctx}/allstyle/newEditionSkin/img" />
<c:set var="jsPath" value="${publicPath}/withdraw" />
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
	<link rel="stylesheet" type="text/css" href="${cssPath}/withdraw.css?<%=getTimestamp%>">
	<script type="text/javascript" src="${publicPath}/jquery-2.1.4.min.js?<%=getTimestamp%>"></script>
	<script type="text/javascript" src="${publicPath}/floatAlert.js?<%=getTimestamp%>"></script>
	<script type="text/javascript">
            var ctx="${ctx}";
            var imgPath="${imgPath}";
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
		<li><a href="${ctx}/siteIncome/toSiteCustomerList">收入明细</a></li>
	    <li  class="on"><a href="${ctx}/withDraw/toWithDrawIndex">提现管理</a></li>
	  </ul>
	<h2 class="list"><a href="${ctx}/personalCenter/toPersonalCenter"><i class="icon icon-personage"></i>个人中心</a></h2>
	
</nav>
<div class="container">
	<div class="content withdraw">
		<h3 class="title"><span class="on">提现申请</span><span>账户流水</span></h3>
		<div class="ui-content">
			<div class="Withdraw" id="userPone">
				<p>&nbsp;&nbsp;可提余额&nbsp;：&nbsp;<span class="sumMoney"></span><button class="extract">提&nbsp;&nbsp;现</button></p>
				<p>&nbsp;&nbsp;已结算至&nbsp;：&nbsp;<span class="closeTime"></span></p>
			</div>
			<div class="condition">
				<p class="con_tabel"><span data-status="all" class="on">全部</span><span data-status="djs">待结算</span><span data-status="yzf">已支付</span><span data-status="suz">申诉中</span></p> 
				<p class="date_box">日期范围&nbsp;&nbsp;<input type="text" placeholder='请输入查询时间' readonly="readonly" onclick="WdatePicker({dateFmt:'yyyy-MM-dd'})" class="Wdate" id="dateStart1" style="text-align: center"> &nbsp;至&nbsp; <input type="text" placeholder='请输入查询时间' readonly="readonly" onclick="WdatePicker({dateFmt:'yyyy-MM-dd'})" class="Wdate" id="dataEnd1" style="text-align: center"><button id="setAccountLog">查询</button></p>
			</div>
			<div class="watercourse selec1" style="display: block">
				<h6>
					<span>结算周期</span>
					<span>线上缴费(元)</span>
					<span>线下缴费(元)</span>
					<span>用户退费(元)</span>
					<span>技术支持费(元)</span>
					<span>应结算总额(元)</span>
					<span>状态</span>
					<span>操作</span>
				</h6>
				<ul>
					
				</ul>
			</div>
			<ul class="paging">
				<li class="zong" id="zongLog"></li>
				<li class="goLeft on"><i class="icon icon-left"></i></li>
				
				<li class="goRight on"><i class="icon icon-right"></i></li>
				<p>跳转至<input style="width:50px;height:20px;border:1px solid skyblue" id="numLog" onkeyup="value=value.replace(/[^\d]/g,'')"  type="tel" >页 <button class="jumpGoToNum" id="jumpToLog">跳转</button></p>
			</ul>
		</div>
		<div class="ui-content" style="display:none;">
			<div class="ui-await">
				<div class="condition">
					<p class="date_box">日期范围&nbsp;&nbsp;<input type="text" placeholder='请输入查询时间' readonly="readonly" onclick="WdatePicker({dateFmt:'yyyy-MM-dd'})" class="Wdate" id="dateStart2" style="text-align: center"> &nbsp;至&nbsp; <input type="text" placeholder='请输入查询时间' readonly="readonly" onclick="WdatePicker({dateFmt:'yyyy-MM-dd'})" class="Wdate" id="dateEnd2"  style="text-align:center"><button id="setStateList">查询</button></p>
				</div>
				<div class="watercourse selec5">
					<h6>
						<span>时间</span>
						<span>流水账号</span>
						<span>线上平台收益(元)</span>
						<span>线下收益(元)</span>
						<span>用户退费(元)</span>
						<span>技术支持费(元)</span>
						<span>实际总收入(元)</span>
						<span>操作</span>
					</h6>
					<ul>
						
					</ul>
				</div>
				<ul class="paging" >
					<li class="zong" id="daiLog"></li>
					<li class="goLeft on"><i class="icon icon-left"></i></li>
					<li class="goRight on"><i class="icon icon-right"></i></li>
					<p>跳转至<input onkeyup="value=value.replace(/[^\d]/g,'') "  style="width:50px;height:20px;border:1px solid skyblue"  id="numToPage"  type="tel">页 <button id="jumpToPage" class="jumpGoToNum">跳转</button></p>
				</ul>
			</div>
		</div>
	</div>
</div>
<div class="mask">
	<div class="alertVerify">
		<p class="verifyinput"><label for="">验证码已发送至您的手机</label><input id="verifyNum" type="tel" maxlength="4" placeholder="请输入手机验证码" onkeyup="this.value=this.value.replace(/\D/g,'')" onafterpaste="this.value=this.value.replace(/\D/g,'')"><button class="fn-gain" disabled>60</button></p>
		<p class="verifyBtn"><button class="ui-btn fn-pass">确定</button><button class="ui-btn fn-close">取消</button></p>
	</div>
	<div class="show">
		<h4>选择账号<i class="icon icon-false"></i></h4>
		<div class="listClosedid">
			<ul class="closedidList">
				
			</ul>
			<button id="selectBankCard" class="ensure">确定</button>
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
<script type="text/javascript" src="${publicPath}/jquery.validate.min.js"></script>
<script type="text/javascript" src="${publicPath}/jquery.validate.messages_cn.js"></script>
<script type="text/javascript" src="${jsPath}/withdraw.js?<%=getTimestamp%>"></script>
<script type="text/javascript" src="${publicPath}/My97DatePicker/WdatePicker.js?<%=getTimestamp%>"></script>
</body>
</html>