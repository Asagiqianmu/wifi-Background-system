<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ page import="java.util.Date"  %>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<c:set var="cssPath" value="${ctx}/allstyle/finance/css" />
<c:set var="jsPath" value="${ctx}/allstyle/finance/js" />
<c:set var="imgPath" value="${ctx}/allstyle/finance/img" />
<!DOCTYPE html>
<html>
<%
long getTimestamp=new Date().getTime(); //时间戳
%>
<head>
<meta charset="utf-8">
	<title>后台管理</title>
	<link rel="stylesheet" type="text/css" href="${cssPath }/common.css?<%=getTimestamp%>">
	<link rel="stylesheet" type="text/css" href="${cssPath }/finance.css?<%=getTimestamp%>">
	<link rel="stylesheet" type="text/css" href="${cssPath}/pages.css">
	<script type="text/javascript">
		var ctx="${ctx}";
		var imgPath="${imgPath}";
	</script>
</head>
<body>
<div id="header">
	<div class="fl msg_title">
		<img src="${imgPath }/fxwx.png" class="fl"/>
		<span><i>Wi-Fi 运营系统 &#149;</i>后台管理员 </span>
	</div>
	<div class="fr user_msg">
		<div class="user_phone tip"><img src="${imgPath }/new_cont_06.png" class="fl"/>${user.userName}
			<ul class="menu">
				<!-- <li class="personageCenter">个人中心</li> -->
				<li class="exit">退出</li>
			</ul>
		</div>
		<img src="${imgPath }/new_cont_09.png" class="fr msg_tip tip"/>
	</div>
</div>
<div id="leftNav" class="on">
	<span class="module tip"></span>
	<ul class="linkList">
		<li class="tip"><img class="fl" src="${imgPath}/pandect.png"><span>收入总览</span><p>收入总览</p></li>
		<li class="tip on"><img class="fl" src="${imgPath }/ratio.png"><span>结算比例</span><p>结算比例</p></li>
		<li class="tip"><img class="fl" src="${imgPath }/settle.png"><span>结算审核</span><p>结算审核</p></li>
		<li class="tip"><img class="fl" src="${imgPath }/query.png"><span>财务数据查询</span><p>财务数据查询</p></li>
		<li class="tip"><img class="fl icon-size" src="${imgPath}/siftings2.png"><span>用户收入明细</span><p>用户收入明细</p></li>
		<li class="tip"><img class="fl icon-size" src="${imgPath}/dls.png"><span>代理商信息总览</span><p>代理商信息总览</p></li>
		
	</ul>
	<p class="incline"></p>
	<!-- <p class="incline"><span class="fl"></span><span class="inBtn tip on"></span></p> -->
</div>
<div class="container">
	<p class="cTitle"><span>结算比例</span></p>
	<div class="content">
		<div class="tabBox">
			<p class="tab fl"><span class="tip on">代理商比例</span><span class="tip">内容提供商结算比例</span></p>
		</div>
		<div class="queryInp">
			<p class="fl"><input class="qInp" type="text" onkeyup="this.value=this.value.replace(/\D/g,'')"  onafterpaste="this.value=this.value.replace(/\D/g,'')" name=""  value="" placeholder="请输入代理商账号"><button class="queryBtn"></button></p>
			<div class="default fr">
				<p>代理商默认结算比例：<span class="sett"></span><button class="setDef">设置</button></p>
				<div class="deBox">
					<span class="drt">结算比例</span>
					<p><input class="fl dinp" type="text" onkeyup="this.value=this.value.replace(/\D/g,'')"  onafterpaste="this.value=this.value.replace(/\D/g,'')" name="" placeholder="请输入结算比例">%</p>
					<span class="msg">注：范围0-100整数</span>
					<p><button class="fl tip dqd" type="button">应用</button><button class="fr tip dqx" type="button">取消</button></p>
				</div>
			</div>
		</div>
		<div class="pljs">
			<button class="setBtn setAgency tip fl">批量结算比例</button>
			<div class="agBox">
				<span class="art">结算比例</span>
				<p><input class="fl ainp" type="text"  onkeyup="this.value=this.value.replace(/\D/g,'')"  onafterpaste="this.value=this.value.replace(/\D/g,'')" name="" placeholder="请输入结算比例">%</p>
				<span class="msg">注：范围0-100整数</span>
				<p><button class="fl tip aqd" type="button">应用</button><button class="fr tip aqx" type="button">取消</button></p>
			</div>
		</div>
		<table class="contList agency">
			<thead>
				<tr>
					<th class="short"></th>
					<th class="short"></th>
					<th class="long">代理商姓名</th>
					<th class="long">代理商账号</th>
					<th class="long">场所</th>
					<th class="long">结算比例</th>
				</tr>
			</thead>
			<tbody>
			</tbody>
		</table>
	</div>
	<div id="pages">
		
	
	</div>	
	<!-- <div class="pager">
		<span class="gong"></span>
		<a href="javascript:page(false)" class="page_pre">◄ 上一页</a>
		<a href="javascript:page(true)" class="page_next">下一页 ►</a>
		<span>到	<input type="text" onkeyup="this.value=this.value.replace(/\D/g,'')"  onafterpaste="this.value=this.value.replace(/\D/g,'')" maxlength="3" class="page_to"/> 页</span>
		<span class="tip skip">跳 转</span>
	</div> -->
</div>
<div class="win">
	<span></span>
</div>
<script type="text/javascript" src="${ctx}/allstyle/newEditionSkin/js/jquery-2.1.4.min.js"></script>
<script type="text/javascript" src="${jsPath}/pages.js"></script>
<script type="text/javascript" src="${jsPath}/finance.js"></script>
<script type="text/javascript" src="${jsPath}/common.js"></script>
</body>
</html>