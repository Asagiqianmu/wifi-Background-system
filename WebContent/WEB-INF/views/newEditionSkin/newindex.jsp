<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@taglib prefix="sf" uri="http://www.springframework.org/tags/form"%>
<%
	String basePath = request.getScheme() + "://" + request.getServerName() + ":" +request.getServerPort() + request.getContextPath() + "/";
%>
<html class=" js csstransforms3d">
<head>
<base href="<%=basePath%>">
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Insert title here</title>
</head>
<body>
	123
	<a href="newEditionSkin/getAllBusinessData?siteId=0">0</a>
	<a href="newEditionSkin/getAllBusinessData?siteId=36">1</a>
	<a href="newEditionSkin/getTotalMoneyAndPeopleCount?siteId=36">2</a>
	<a href="newEditionSkin/getTotalMoneyAndPeopleCount?siteId=0">3</a>
	<a href="newEditionSkin/getTypeProportion?siteId=0">4</a>
	<a href="newEditionSkin/getTypeProportion?siteId=36">5</a>
	<a href="newEditionSkin/getSubscriberGrowth?siteId=0">6</a>
	<a href="newEditionSkin/getSubscriberGrowth?siteId=36">7</a>
</body>
</html>