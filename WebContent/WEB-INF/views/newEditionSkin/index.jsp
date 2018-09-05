<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ page import="java.util.Date"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<c:set var="cssPath" value="${ctx}/allstyle/newstyle/css" />
<%-- <c:set var="jsPath" value="${ctx}/allstyle/newstyle/js" />
<c:set var="imgPath" value="${ctx}/allstyle/newstyle/img" /> --%>
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
	var page = "${page}";
</script>
</head>
<body>
		
		<jsp:include page="./head.jsp" flush="true"></jsp:include>
		<jsp:include page="./left.jsp" flush="true"></jsp:include>
		<jsp:include page=".${page}.jsp" flush="true"></jsp:include>

</body>
</html>