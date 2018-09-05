<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ page import="java.util.Date"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<c:set var="curPath" value="${ctx}/allstyle/newEditionSkin" />
<c:set var="jsPath" value="${curPath}/js" />
<c:set var="imgPath" value="${curPath}/img" />
<c:set var="cssPath" value="${curPath}/css" />
<c:set var="curJsp" value="/commonJsp/" />
<%
	long getTimestamp = new Date().getTime(); //时间戳
%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta name="renderer" content="webkit">

<title>登录</title>
<link rel="stylesheet" type="text/css" href="${cssPath}/font-icon.css">
<link rel="stylesheet" type="text/css" href="${cssPath}/style.css">
<script src="${jsPath}/jquery-2.1.4.min.js"></script>
<script src="${jsPath}/jquery.validate.min.js" type="text/javascript"></script>
<script src="${jsPath}/jquery.validate.messages_cn.js"
	type="text/javascript"></script>
<script src="${jsPath}/logins.js"></script>
<script src="${jsPath}/verify.js"></script>
<script type="text/javascript" src="${jsPath}/floatAlert.js"></script>
<script type="text/javascript" src="${ctx}/allstyle/newstyle/DES.js"></script>

<!-- 此段必须要引入 t为小时级别的时间戳 -->
<link type="text/css" href="//g.alicdn.com/sd/ncpc/nc.css?t=?<%=getTimestamp%>"
	rel="stylesheet" />
<script type="text/javascript"
	src="//g.alicdn.com/sd/ncpc/nc.js?t=?<%=getTimestamp%>"></script>
<!-- 引入结束 -->
<style type="text/css">
.nc-container {
	width: 279px;
	height: 40px;
}

@media print {
	body {
		display: none
	}
}
</style>
</head>
<script type="text/javascript">
	var ctx = "${ctx}";

	(function() {
		if (!
		/*@cc_on!@*/
		0)
			return;
		var e = "abbr, article, aside, audio, canvas, datalist, details, dialog, eventsource, figure, footer, header, hgroup, mark, menu, meter, nav, output, progress, section, time, video"
				.split(', ');
		var i = e.length;
		while (i--) {
			document.createElement(e[i])
		}
	})()
</script>
<%
	String name = "";
	String psw = "";
	Cookie[] cookies = request.getCookies();
	if (cookies != null && cookies.length > 0) {
		//遍历Cookie  
		for (int i = 0; i < cookies.length; i++) {
			Cookie cookie = cookies[i];
			//此处类似与Map有name和value两个字段,name相等才赋值,并处理编码问题   
			if ("username".equals(cookie.getName())) {
				name = cookie.getValue();
			}
			if ("password".equals(cookie.getName())) {
				psw = cookie.getValue();
			}
		}
	}
%>
<!--禁止网页另存为： -->
<body style="background:#F4F2F2;"
       <%-- <body style="background:url(${imgPath}/login-bg.png) repeat;" --%>
	oncontextmenu="return false" onselectstart="return false">

	<!-- 此段必须要引入 滑动验证码-->
	<div id="_umfp"
		style="display: inline; width: 1px; height: 1px; overflow: hidden; display: none"></div>
	<!-- 引入结束 -->
	<!-- 此段必须要引入 滑动验证码-->
	<input type='hidden' id='csessionid' name='csessionid' />
	<input type='hidden' id='sig' name='sig' />
	<input type='hidden' id='token' name='token' />
	<input type='hidden' id='scene' name='scene' />
	<!-- 引入结束 -->

	<header class="ui-header">
		
			<div class="fl msg_title" style="float: left; width:65px;  position:absolute;">
				<img src="${imgPath}/fxwx.png" style=" margin-left: 10px;margin-top: 13px; width:60px;" />
			</div>
			<div style=" float: left; margin-left:90px; margin-top:5px ; color: #FFF; width:370px; height:50px;;position:absolute;">
			
				<div style="line-height: 75px; font-size: 26px;">
					无 线 网 络 解 决 方 案 提 供 商
				</div>
			</div>
			<div style="clear: both;">
			</div>
		
	</header>
	<!-- <header class="ui-header">
	<h1>
		<span class="first"></span>
		<span class="sun">Wi-Fi运营系统&nbsp;·&nbsp;</span>
		<span class="back">后台管理员</span>
	</h1>
	
	
</header> -->
	<div class="banner">
	</div>
	<div class="ui-cont">
		<form class="form" id="loginForm" action="${ctx}/doLogin"
			method="post">
			<div class="form-user" style="margin-bottom: 30px">
				<label for="user_name">手机号</label> <input class="user_name"
					onkeyup="this.value=this.value.replace(/\D/g,'')" name="user_name"
					id="user_login_name" type="tel" placeholder="请输入手机号"
					value="<%=name%>" maxlength="11"> <span style="top: 40px"></span>
			</div>
			<div class="form-pwd" style="margin-bottom: 30px">
				<label for="user_pwd">密&nbsp;&nbsp;&nbsp;码</label> <input
					class="user_pwd"
					onkeyup="this.value=this.value.replace( /\s+/g,'')" name="user_pwd"
					id="user_login_pwd" type="password" placeholder="请输入密码"
					value="<%=psw%>" maxlength="16"> <span style="top: 40px"
					id="errorText"></span>
				<!-- <input type="hidden"   placeholder="请输入密码" name="passwordMd5"  id="passwordMd5"/> -->
			</div>
			<!-- <div class="form-pwd" style="margin-bottom: 30px">
				<label for="user_pwd" style="display: inline-block;">验&nbsp;&nbsp;&nbsp;证</label>
				<div id="dom_id" style="margin-left: 70px"></div>
				<span style="top: 40px" id="yan"></span>
			</div> -->

			<div class="remember">
				<p class="rememberPWD">
					<span><i class="icon icon-true" id="rememberMe"></i></span>记住密码
				</p>
				<p class="forget">忘记密码？</p>
			</div>
			<div class="form-login">
				<button class="fn-login" type="button" id="fn-login">登录</button>
			</div>
			<div class="form-register">
				<button class="fn-register" type="button" id="fn-register">注册</button>
			</div>
		</form>
	</div>
	<div class="mask">
		<div class="newly">
			<div class="new register" style="display: none;">
				<h2>
					<p>注册</p>
					<i class="icon icon-false"></i>
				</h2>
				<form class="register-form" id="register-form">
					<div class="form-user">
						<label for="user_name">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;手机号</label>
						<input class="user_name"
							onkeyup="this.value=this.value.replace(/\D/g,'')"
							id="user_register_name" name="user_name" type="tel"
							placeholder="可用于登录和找回密码" value="" maxlength="11"> <span></span>
						<div class="tishi">*其他用户不可见</div>
					</div>
					<div class="form-agent">
						<label for="agent_name">代理商姓名</label> <input class="agent_name"
							id="agent_register_name" name="agent_name" type="text"
							placeholder="请输入代理商姓名" value=""> <span></span>
						<div class="tishi">*请填写你身份证上的真实姓名</div>
					</div>
					<div class="form-pwd">
						<label for="user_pwd">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;密码</label>
						<input class="user_pwd"
							onkeyup="this.value=this.value.replace( /\s+/g,'')"
							name="user_pwd" id="user_register_pwd" type="password"
							placeholder="6-20个字符区分大小写" value="" maxlength="20"> <span></span>
						<input class="user_pwd" name="user_pwd" id="passwordMd5"
							type="hidden" placeholder="请输入密码" value="" maxlength="16">
						<p class="pwdStrong" style="display: none">弱</p>
						<div class="pwdStrongDiv">
							<div></div>
							<div style="margin: 0 20px"></div>
							<div></div>
						</div>
					</div>

					<div class="form-pwd">
						<label for="user_pwd">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;验证</label>
						 <div id="mpanel" style="margin-left: 70px; height: 37px;"></div>
					</div>

					<div class="form-verify" style="margin-top: 190px;">
						<label for="user_verify">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;验证码</label>
						<button class="gain" id="registGain" type="button">获取验证码</button>
						<input class="user_verify" maxlength="4" name="user_verify"
							onkeyup="this.value=this.value.replace(/\D/g,'')"
							onkeyup="this.value=this.value.replace( /\s+/g,'')"
							id="user_register_verify" type="password" placeholder="请输入验证码"
							value=""> <span id="errorCode"></span>
						<div
							style="float: left; margin-top: 7px; margin-left: 8px; position: relative; height: 24px">
							<input id="checkbox" aria-checked="true"
								class="place-checkbox radio" name="type" type="checkbox" />
							<div class="radio"></div>
							<p style="float: left; font-size: 14px; margin-left: 5px">
								阅读并接受<a href="${ctx}/UserManage/goRule" style="color: #57c6d4">《飞讯无限用户协议》</a>
							</p>
						</div>
					</div>
					<div class="btns">
						<button type="button" id="register">注 册</button>
					</div>
				</form>
			</div>
			<div class="new fn-forget" style="display: none;">
				<h2>
					<p>忘记密码</p>
					<i class="icon icon-false"></i>
				</h2>
				<form class="forget-form" id="forget-form">
					<div class="form-user" style="margin-bottom: 30px">
						<label for="user_name">手机号</label> <input class="user_name"
							maxlength="11" onkeyup="this.value=this.value.replace(/\D/g,'')"
							name="user_name" id="user_forget_name" type="tel"
							placeholder="请输入手机号" value="" /> <span style="top: 40px"></span>
					</div>
					<div class="form-pwd" style="margin-bottom: 30px">
						<label for="user_pwd">新密码</label> <input class="user_pwd"
							maxlength="16"
							onkeyup="this.value=this.value.replace( /\s+/g,'')"
							name="user_pwd" id="user_forget_pwd" type="password"
							placeholder="请输入密码" value=""> <span style="top: 40px"></span>
					</div>
					<div class="form-pwd" style="margin-bottom: 30px">
						<label for="user_repeat_pwd">确认密码</label> <input
							class="user_repeat_pwd" maxlength="16"
							onkeyup="this.value=this.value.replace( /\s+/g,'')"
							name="user_repeat_pwd" id="user_repeat_pwd" type="password"
							placeholder="请再次输入密码" value=""> <span style="top: 40px"></span>
					</div>

					<div class="form-pwd" style="margin-bottom: 30px">
						<label for="user_repeat_pwd">请验证</label>
						<div id="formpanel" style="margin-left: 70px; height: 37px;text-align: center;"></div>
					</div>


					<div class="form-verify" style="margin-bottom: 30px;margin-top: 185px">
						<label for="user_verify">验证码</label>
						<button class="gain" id="forgetGain" type="button">获取验证码</button>
						<input class="user_verify" maxlength="4"
							onkeyup="this.value=this.value.replace(/\D/g,'')"
							onkeyup="this.value=this.value.replace( /\s+/g,'')"
							name="user_verify" id="user_forget_verify" type="password"
							placeholder="输入数字验证码" value=""> <span style="top: 40px"
							id="errorMsg"></span>
					</div>
					<div class="btns">
						<button type="button" id="retrievePassword">立即修改</button>
					</div>
				</form>
			</div>
		</div>
	</div>
	<div class="win">
		<span>操作成功</span>
	</div>
	<div class="whether">
		<span>是否确定当前操作？</span>
		<button>是</button>
		<button style="border: none">否</button>
	</div>

	<script type="text/javascript">
		/* function click(e) {
		
		 if (document.all) {
		 if (event.button == 2 || event.button == 3) {
		 oncontextmenu = 'return false';
		 }
		 }
		 if (document.layers) {
		 if (e.which == 3) {
		 oncontextmenu = 'return false';
		 }
		 }
		 }
		 if (document.layers) {
		 document.captureEvents(Event.MOUSEDOWN);
		 }
		 document.onmousedown = click;
		 document.oncontextmenu = new Function("return false;")
		 document.onkeydown = document.onkeyup = document.onkeypress = function() {
		 if (window.event.keyCode == 123) {
		 window.event.returnValue = false;
		 return (false);
		 }
		 } */
	</script>
</body>

</html>