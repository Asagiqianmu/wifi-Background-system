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
    <meta charset="UTF-8">
    <title>财务总览</title>
    <link rel="stylesheet" type="text/css" href="${cssPath}/common.css">
    <link rel="stylesheet" type="text/css" href="${cssPath}/total.css">
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
        <div class="user_phone tip"><img src="${imgPath}/new_cont_06.png" class="fl"/>${user.userName}
            <ul class="menu">
                <li class="exit">退出</li>
            </ul>
        </div>
        <img src="${imgPath}/new_cont_09.png" class="fr msg_tip tip"/>
    </div>
</div>
<div id="leftNav" class="on">
    <span class="module tip"></span>
    <ul class="linkList">
        <li class="tip on"><img class="fl" src="${imgPath}/pandect.png"><span>收入总览</span><p>收入总览</p></li>
        <li class="tip"><img class="fl" src="${imgPath}/ratio.png"><span>结算比例</span><p>结算比例</p></li>
        <li class="tip"><img class="fl" src="${imgPath}/settle.png"><span>结算审核</span><p>结算审核</p></li>
        <li class="tip"><img class="fl" src="${imgPath}/query.png"><span>财务数据查询</span><p>财务数据查询</p></li>
        <li class="tip"><img class="fl icon-size" src="${imgPath}/siftings2.png"><span>用户收入明细</span><p>用户收入明细</p></li>
   		<li class="tip"><img class="fl icon-size" src="${imgPath}/dls.png"><span>代理商信息总览</span><p>代理商信息总览</p></li>
   		
    </ul>
    <p class="incline"></p>
</div>

<div class="container">
    <p class="cTitle"><span>财务总览</span>
    </p>
    <div class="cs-info">
    	<span class="csTitle">按代理商查询</span>
    	<div class="input-value">
            <input type="text" id="agentname" placeholder="请输入代理商名" maxlength="11" onkeyup="this.value=this.value.replace(/\D/g,'')"/>
        </div>
    	<span class="csTitle" style="position: absolute;left: 260px;top: -4px;">场所</span>
    	<div class="costType" style="position: absolute;left: 370px;top: 0;">
            <span class="seleType tip">请选择</span>
            <ul class="sitelist">
                 
            </ul>
        </div>
    </div>
    <p class="sTitle">收入总览</p>
    <div class="content">
        <div class="overflowH">
            <div class="income-box">
                <div class="tactful bg-b">昨</div>
                <p class="income-title">昨日总收入(元) : <span id="yesterday">--</span></p>
            </div>
            <div class="income-box mgn-60">
                <div class="tactful bg-r">今</div>
                <p class="income-title">今日总收入(元) : <span id="today">--</span></p>
            </div>
        </div>
        <div class="date daili">日期范围
            <input type="text" readonly="readonly" placeholder="请输入查询时间" onclick="WdatePicker({dateFmt:'yyyy-MM-dd',maxDate:'%y-%M-%d'})" value="" id="startAt" class="Wdate"> 至
            <input type="text" readonly="readonly" placeholder="请输入查询时间" onclick="WdatePicker({dateFmt:'yyyy-MM-dd',maxDate:'%y-%M-%d'})" value="" id="endAt" class="Wdate">
            <button class="date-btn" id="incomebtn">查 询</button>
        </div>
        <div class="overflowH">
            <div class="income-box">
                <div class="tactful bg-y">总</div>
                <p class="income-title">历史收入总数(元) : <span id="total">--</span></p>
            </div>
        </div>
        <p class="sTitle" style="margin-left: 0px;margin-top: 20px;">运营数据</p>
        <div class="date daili">日期范围
            <input type="text" readonly="readonly" placeholder="请输入查询时间" onclick="WdatePicker({dateFmt:'yyyy-MM-dd',maxDate:'%y-%M-%d'})" value="" id="startAts" class="Wdate"> 至
            <input type="text" readonly="readonly" placeholder="请输入查询时间" onclick="WdatePicker({dateFmt:'yyyy-MM-dd',maxDate:'%y-%M-%d'})" value="" id="endAts" class="Wdate">
            <button class="date-btn" id="zhuanhua">查 询</button>
        </div>
        <div class="data-show">
        	<div class="user-conver"><p class="border-red"></p><span class="show-num">0%</span><span>用户转化率</span></div>
        	<div class="pay-conversion"><p class="border-yellow"></p><span class="show-num">0%</span><span>付费转化率</span></div>
        	<div class="using-earnings"><p class="border-blue"></p><span class="show-num">0</span><span>宽带使用收益(元)</span></div>
        	<div class="using-earnings"><p class="border-qing"></p><span class="show-num">0</span><span>提现次数(次)</span></div>
        </div>
    </div>
</div>
<div class="win">
	<span></span>
</div>
</body>
<script type="text/javascript" src="${jsPath}/WdatePicker.js"></script>
<script type="text/javascript" src="${ctx}/allstyle/newEditionSkin/js/jquery-2.1.4.min.js"></script>
<script type="text/javascript" src="${jsPath}/total.js"></script>
<script type="text/javascript" src="${jsPath}/common.js"></script>
</html>