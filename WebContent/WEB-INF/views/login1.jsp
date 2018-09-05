<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@taglib prefix="sf" uri="http://www.springframework.org/tags/form"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<c:set var="cssPath" value="${ctx}/assets/css" />
<c:set var="imgPath" value="${ctx}/assets/img" />
<c:set var="jsPath" value="${ctx}/assets/js" />
<!DOCTYPE html>
<html lang="en" class="no-js">

<head>
<script type="text/javascript">
	var ctx="${ctx}";
</script>
<meta charset="utf-8">
<title>Fullscreen Login</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="">
<meta name="author" content="">

<!-- CSS -->
<link rel='stylesheet' href='http://fonts.googleapis.com/css?family=PT+Sans:400,700'>
<link rel="stylesheet" href="${cssPath}/reset.css">
<link rel="stylesheet" href="${cssPath}/supersized.css">
<link rel="stylesheet" href="${cssPath}/style.css">


</head>

<body>
	<div class="page-container">
		<h1>登陆</h1>
		<form>
			<input type="text" name="userName" id="userName" class="username" placeholder="用户">
			<input type="password" name="passWord" id="passWord" class="password"	placeholder="密码">
			<button type="button" id="sub_btn">登录</button>
			<div class="error"><span>+</span></div>
		</form>
	</div>
	<!-- Javascript -->
	<script src="${jsPath}/jquery-1.8.2.min.js"></script>
	<script src="${jsPath}/supersized.3.2.7.min.js"></script>
	<script src="${jsPath}/supersized-init.js"></script>
	<script src="${jsPath}/scripts.js"></script>
	<script src="${jsPath}/login.js"></script>

</body>

</html>

