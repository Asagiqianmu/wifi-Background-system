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
    <p class="cTitle"><span>财务总览</span></p>
    	<div class="account">
    		<div class="dev_se fn_select">
    			<div class="di-name">代理商账号</div>
    			<input type="text" class="dl-code" id="agentname" placeholder="请输入代理商名" maxlength="11" onkeyup="this.value=this.value.replace(/\D/g,'')"/> 
			</div>
    		<div class="dev_se fn_select grap-left">
    			<div class="di-name">场所</div>
				<span class="seleType">请选择</span>
				<ul class="sitelist"> 
					<!-- <li>四惠大厦</li>
					<li>山西同文学院</li> -->
				</ul>
			</div>
     	</div>
    <p class="sTitle">收入总览</p>
    <div class="content">
        
        <div class="date daili">日期范围
            <input type="text" readonly="readonly" placeholder="请输入查询时间" onclick="WdatePicker({dateFmt:'yyyy-MM-dd'})" value="" id="startAt" class="Wdate"> 至
            <input type="text" readonly="readonly" placeholder="请输入查询时间" onclick="WdatePicker({dateFmt:'yyyy-MM-dd'})" value="" id="endAt" class="Wdate">
            <button class="date-btn" id="history">查 询</button>
        </div>
        <div class="overflowH">
            <div class="income-box">
                <div class="tactful bg-y">总</div>
                <p class="income-title">
                	历史收入总数(元) : <span id="total" class="total-num">--</span>
                	<p class="xq-show">（线上<span id="lineincome">--</span>&nbsp;&nbsp;线下<span id="offincome">--</span>）</p>
                </p>
            </div>
        </div>
    <div class="income">
			<div class="slsq">
				<span class="sr-title">收入统计(元)</span>
				<span class="swicth d"><i></i></span>
				<span class="dayormonth">
					<input type="text" readonly="readonly" placeholder="请输入查询时间" onclick="WdatePicker({dateFmt:'yyyy-MM-dd'})" value="" id="startAt2" class="Wdate"> 至
		           	<input type="text" readonly="readonly" placeholder="请输入查询时间" onclick="WdatePicker({dateFmt:'yyyy-MM-dd'})" value="" id="endAt2" class="Wdate">
                </span>
				<button class="date-btn" id="dayincome">查 询</button><button class="export-data">导出excel</button>
			</div>
			<div id="histogram" style="width:100%;margin-top: 10px;"></div>
	</div>
    <div class="date daili">日期范围
            <input type="text" readonly="readonly" placeholder="请输入查询时间" onclick="WdatePicker({dateFmt:'yyyy-MM-dd'})" value="" id="startAt3" class="Wdate"> 至
            <input type="text" readonly="readonly" placeholder="请输入查询时间" onclick="WdatePicker({dateFmt:'yyyy-MM-dd'})" value="" id="endAt3" class="Wdate">
            <button class="date-btn" id="zhuanhua">查 询</button>
    </div>
    <div class="yh-show">
    	<ul>
    		<li><div class="wl-width"><span>用户注册转化率</span><p  class="show-num3">0%</p></div></li>
    		<li><div class="wl-width"><span>付费转化率</span><p  class="show-num3">0%</p></div></li>
    		<li><div class="wl-width"><span>宽带使用收益(元)</span><p  class="show-num3">0.00</p></div></li>
    		<li><div class="wl-width"><span>提现次数</span><p  class="show-num3">0</p></div></li>
    	</ul>
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
<script type="text/javascript" src="${jsPath}/highcharts.js"></script>
 <script type="text/javascript" src="${jsPath}/index.js"></script> 
 <script type="text/javascript" src="${jsPath}/common.js"></script> 
</html>