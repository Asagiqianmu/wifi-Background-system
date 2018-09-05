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
	<div id="header">
		<header class="ui-header">
	  		<div class="fl msg_title">
		     	<div class="fl msg_title" style="float:left;">
		       		<img src="${imgPath}/fxwx.png" style="margin-top: -10px;width:60px;" />
		     	</div>
		      	<div style="float:left;margin-left:20px;color:#FFF;margin-top:10px">
			        <div style="line-height:32px;font-size:20px;">飞讯WiFi计费管理后台</div>
			        <div style="line-height:28px;font-size:16px;">无线网络解决方案提供商</div>
		     	</div>
		    	<div style="clear:both;"></div>
		   	</div>
		</header>
		<div class="fr user_msg">
			<div class="user_phone tip"><img src="${imgPath }/new_cont_06.png" class="fl" />${user.userName }
				<ul class="menu">
					<li class="personageCenter">个人中心</li>
					<li class="exit">退出</li>
				</ul>
			</div>
			<img src="${imgPath }/new_cont_09.png" class="fr msg_tip tip" />
		</div>
	</div>
<script type="text/javascript" src="${ctx}/allstyle/newstyle/jquery-2.1.4.min.js"></script>
<script type="text/javascript" src="${ctx}/allstyle/newstyle/general.js"></script>
</body>
</html>
	