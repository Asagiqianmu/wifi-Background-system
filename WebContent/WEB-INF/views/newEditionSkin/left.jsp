<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ page import="java.util.Date"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<c:set var="cssPath" value="${ctx}/allstyle/newstyle/css" />
<c:set var="jsPath" value="${ctx}/allstyle/newstyle/js" />
<c:set var="imgPath" value="${ctx}/allstyle/newstyle/img" />
<!DOCTYPE html>
<html>
<%
	long getTimestamp = new Date().getTime(); //时间戳
%>
<head>
<meta charset="utf-8">
<title>后台管理</title>
<link rel="stylesheet" type="text/css" href="${cssPath}/common.css">
<link rel="stylesheet" type="text/css" href="${cssPath}/general.css">
<link rel="stylesheet" type="text/css" href="${cssPath}/personal.css">
<link type="text/css" href="//g.alicdn.com/sd/ncpc/nc.css?t=?<%=getTimestamp%>" rel="stylesheet"/>
<style type="text/css">${ demo.css}</style>
<script type="text/javascript">
	var ctx = "${ctx}";
</script>
</head>
<body>
<div id="leftNav" class="on">
	<span class="module tip"></span>
	<ul class="linkList">
		<li class="index tip"><span>运营概览</span><p>运营概览</p></li>
		<li class="place tip"><span>场所管理</span><p>场所管理</p></li>
		<li class="billing tip "><span>计费管理</span><p>计费管理</p></li>
		<li class="user tip"><span>用户管理</span><p>用户管理</p></li>
		
		<li class="data tip"  ><span>数据中心</span><p>数据中心</p></li>
	
		<li class="withdraw tip"><span>资金管理</span><p>资金管理</p></li>
		<li class="personal tip"><span>个人中心</span><p>个人中心</p></li>
	</ul>
	<p class="incline"></p>
</div>
</body>
</html>
	