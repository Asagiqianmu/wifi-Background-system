<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ page import="java.util.Date"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<c:set var="cssPath" value="${ctx}/allstyle/finance/css" />
<c:set var="jsPath" value="${ctx}/allstyle/finance/js" />
<c:set var="imgPath" value="${ctx}/allstyle/finance/img" />
<!DOCTYPE html>
<html>
<script type="text/javascript">
	var ctx="${ctx}";
	var imgPath="${imgPath}";
</script>
<head>
<meta charset="utf-8">
	<title>后台管理</title>
	<link rel="stylesheet" type="text/css" href="${cssPath}/pages.css">
	<link rel="stylesheet" type="text/css" href="${cssPath}/common.css">
	<link rel="stylesheet" type="text/css" href="${cssPath}/fDateSelect.css">
	<link rel="stylesheet" type="text/css" href="${jsPath}/skin/WdatePicker.css">
</head>
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
		<li class="tip"><img class="fl" src="${imgPath}/pandect.png"><span>收入总览</span><p>收入总览</p></li>
		<li class="tip"><img class="fl" src="${imgPath}/ratio.png"><span>结算比例</span><p>结算比例</p></li>
		<li class="tip"><img class="fl" src="${imgPath}/settle.png"><span>结算审核</span><p>结算审核</p></li>
		<li class="tip on"><img class="fl" src="${imgPath}/query.png"><span>财务数据查询</span><p>财务数据查询</p></li>
		<li class="tip"><img class="fl icon-size" src="${imgPath}/siftings2.png"><span>用户收入明细</span><p>用户收入明细</p></li>
        <li class="tip"><img class="fl icon-size" src="${imgPath}/dls.png"><span>代理商信息总览</span><p>代理商信息总览</p></li>
	</ul>
	<p class="incline"></p>
	<!-- <p class="incline"><span class="fl"></span><span class="inBtn tip on"></span></p> -->
</div>
<div class="container">
	<p class="cTitle"><span>财务数据查询</span></p>
	<div class="content">
		<p class="tab"><span class="tip on">代理商结算数据</span><span class="tip">内容提供商结算数据</span></p>
		<div class="query">
			<p>按代理商查询<input class="qInp1"  onkeyup="this.value=this.value.replace(/\D/g,'')"  onafterpaste="this.value=this.value.replace(/\D/g,'') type="text" value="" name="" placeholder="请输入代理商账号"> <button class="dlSelect">查询</button></p>
		</div>
		<div class="inDay daili">
			<span>提现信息</span>
			<p class="tabTi"><span>代理商姓名</span><span>当前余额(元)</span><span>上次提现时间</span></p>
			<p class="tabNr"><span></span><span></span><span></span></p>
		</div>
		<p class="date daili">日期范围<input type="text" readonly="readonly" placeholder="请输入查询时间" onclick="WdatePicker({dateFmt:'yyyy-MM-dd'})" class="Wdate"> 至 <input type="text" readonly="readonly" placeholder="请输入查询时间" onclick="WdatePicker({dateFmt:'yyyy-MM-dd'})" class="Wdate"> <button class="dateQuery">查询</button></p>
		<div class="bygoneDay daili">
			<span>提现记录</span>
			<p class="byTabTi"><span>代理商姓名</span><span>账期总收入(元)</span><span>线上缴费(元)</span><span>线下缴费(元)</span><span>用户退费(元)</span><span>技术支持费(元)</span><span>应结算总金额(元)</span><span>结算周期</span><span>详情</span></p>
			<ul class="byList">
			</ul>
		</div>
		<div class="zonge neiro">收入总额：<span>80135</span>元</div>
		<div class="info neiro">
			<span>内容提供商基本信息</span>
			<div><img src="${imgPath}/photo.png"><p>内容提供商账号：<span>18210153856</span></p><p>企业名称：<span>飞讯无限信息科技有限公司</span></p><p>账号使用者：<span>曾天石</span></p></div>
		</div>
		<div class="inDay neiro">
			<span>提现信息</span>
			<p class="tabTi"><span>当前余额(元)</span><span>可提现金额(元)</span><span>上次提现时间</span></p>
			<p class="tabNr"><span>200</span><span>100</span><span>2016-06</span></p>
		</div>
		<p class="date neiro">日期范围<input type="text" readonly="readonly" placeholder="请输入查询时间" onclick="WdatePicker({dateFmt:'yyyy-MM-dd'})" class="Wdate"> 至 <input type="text" readonly="readonly" placeholder="请输入查询时间" onclick="WdatePicker({dateFmt:'yyyy-MM-dd'})" class="Wdate"></p>
		<div class="bygoneDay neiro">
			<span>过往账期</span>
			<p class="byTabTi"><span>总点击次数</span><span>总浏览次数</span><span>总下载次数</span><span>结算方式</span><span>待结算金额(元)</span><span>到账时间</span><span>详情</span></p>
			<ul class="byList">
				<li><span>200</span><span>100</span><span>100</span><span>20</span><span>银行卡</span><span>2016-06</span><span><button>查询明细</button></span></li>
			</ul>
		</div>
	</div>
	<div id="pages">
		
	
	</div>	
	<!-- <div class="pager">
		<span class="gong"></span>
		<span onclick="page(false)" class="page_pre">◄ 上一页</span>
		<span onclick="page(true)" class="page_next">下一页 ►</span>
		<span>到	<input type="text"  onkeyup="this.value=this.value.replace(/\D/g,'')"  onafterpaste="this.value=this.value.replace(/\D/g,'') " class="page_to"/> 页</span>
		<span class="tip skip">跳 转</span>
	</div> -->
</div>
<div class="win">
	<span></span>
</div>
<script type="text/javascript" src="${ctx}/allstyle/newEditionSkin/js/jquery-2.1.4.min.js"></script>
<script type="text/javascript" src="${jsPath}/WdatePicker.js"></script>
<script type="text/javascript" src="${jsPath}/pages.js"></script>
<script type="text/javascript" src="${jsPath}/fDateSelect.js"></script>
<script type="text/javascript" src="${jsPath}/common.js"></script>
</body>
</html>