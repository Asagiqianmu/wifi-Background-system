<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ page import="java.util.Date"  %>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<c:set var="cssPath" value="${ctx}/allstyle/finance/css" />
<c:set var="jsPath" value="${ctx}/allstyle/finance/js" />
<c:set var="imgPath" value="${ctx}/allstyle/finance/img" />
<html>

<head>
    <meta charset="UTF-8">
    <title>财务总览</title>
    <link rel="stylesheet" type="text/css" href="${cssPath}/common.css">
    <link rel="stylesheet" type="text/css" href="${cssPath}/siftings1.css">
    <link rel="stylesheet" type="text/css" href="${cssPath}/agency.css">
</head>

<script type="text/javascript">
	var ctx="${ctx}";
	var imgPath="${imgPath}";
</script>
<body>
<div id="header">
    <div class="fl msg_title">
        <img src="${imgPath}/fxwx.png" class="fl"/>
        <span><i>Wi-Fi 运营系统 &#149;</i>后台管理员 </span>
    </div>
    <div class="fr user_msg">
        <div class="user_phone tip"><img src="${imgPath}/new_cont_09.png" class="fl"/>${user.userName}
            <ul class="menu">
                <li class="personageCenter">个人中心</li>
                <li class="exit">退出</li>
            </ul>
        </div>
        <img src="${imgPath}/new_cont_09.png" class="fr msg_tip tip"/>
    </div>
</div>
<div id="leftNav" class="on">
    <span class="module tip"></span>
    <ul class="linkList">
        <li class="tip"><img class="fl" src="${imgPath}/pandect.png"><span>收入总览</span><p>收入总览</p></li>
        <li class="tip"><img class="fl" src="${imgPath}/ratio.png"><span>结算比例</span><p>结算比例</p></li>
        <li class="tip"><img class="fl" src="${imgPath}/settle.png"><span>结算审核</span><p>结算审核</p></li>
        <li class="tip"><img class="fl" src="${imgPath}/query.png"><span>财务数据查询</span><p>财务数据查询</p></li>
        <li class="tip"><img class="fl icon-size" src="${imgPath}/siftings2.png"><span>用户收入明细</span><p>收入总览</p></li>
        <li class="tip on"><img class="fl icon-size" src="${imgPath}/dls.png"><span>代理商信息总览</span><p>代理商信息总览</p></li>
    </ul>
    <p class="incline"></p>
</div>
<div class="container">
    <p class="cTitle"><span>代理商信息总览</span></p>
    <div class="topBox">
        <div class="fl ag-style">
            <input type="text" id="ag-input" class="ag-input" maxlength="11" placeholder="请输入代理商姓名或电话"/>
            <button id="search" class="ag-search"></button>
        </div>
    </div>
    <div class="age-list">
    	<table id="dataList" class="al-table">
    		<!-- <tr>
    			<th>代理商姓名</th>
    			<th>电话</th>
    			<th>运营场所</th>
    			<th>支付宝</th>
    			<th>银行卡</th>
    			<th>管理员</th>
    			<th>管理员电话</th>
    		</tr> -->
    
<!-- 	    <tr>
	    		<td></td>
	    			<td>18230358987</td>
	    			<td>山西同文学院</td>
	    			<td>18230358987</td>
	    			<td>6222020200108314822</td>
	    			<td>曾天石</td>
	    			<td>18210153856</td>
	    		</tr> -->
    	
    	</table>
    </div>
    <div class="pageW">
     <div id="pages"></div>
    </div>
   
   <div id="ku" style="display:none" class="ku">
        <img src="${imgPath}/ku.jpg">
        <p class="ku-p">请输入筛选条件</p>
    </div>
</div>
<div class="win">
	<span></span>
</div>
</body>
<script type="text/javascript" src="${ctx}/allstyle/newEditionSkin/js/jquery-2.1.4.min.js"></script>
<script type="text/javascript" src="${ctx}/allstyle/finance/js/common.js"></script>
<script type="text/javascript" src="${ctx}/allstyle/finance/js/pages.js"></script>
<script type="text/javascript" src="${ctx}/allstyle/finance/js/agency.js"></script>
</html>