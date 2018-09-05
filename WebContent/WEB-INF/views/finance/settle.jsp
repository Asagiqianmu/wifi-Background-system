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
<meta charset="utf-8">
	<title>后台管理</title>
	<link rel="stylesheet" type="text/css" href="${cssPath}/common.css">
	<link rel="stylesheet" type="text/css" href="${cssPath}/settle.css">
	<link rel="stylesheet" type="text/css" href="${cssPath}/pages.css">
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
		<div class="user_phone tip"><img src="${imgPath}/new_cont_06.png" class="fl"/>${user.userName }
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
		<li class="tip on"><img class="fl" src="${imgPath}/settle.png"><span>结算审核</span><p>结算审核</p></li>
		<li class="tip"><img class="fl" src="${imgPath}/query.png"><span>财务数据查询</span><p>财务数据查询</p></li>
		<li class="tip"><img class="fl icon-size" src="${imgPath}/siftings2.png"><span>用户收入明细</span><p>用户收入明细</p></li>
		<li class="tip"><img class="fl icon-size" src="${imgPath}/dls.png"><span>代理商信息总览</span><p>代理商信息总览</p></li>
		
	</ul>
	<p class="incline"></p>
	<!-- <p class="incline"><span class="fl"></span><span class="inBtn tip on"></span></p> -->
</div>
<div class="container">
	<p class="cTitle"><span>结算审核</span></p>
	<div class="content">
		<p class="tab"><span class="tip on" data-if="dl">代理商结算审核</span><span class="tip" data-if="nr">内容提供商结算审核</span></p>
		<div class="tabBox">
			<p class="ptab fl"><span class="on" data-if="w">未审核</span><span data-if="d">待支付</span><span data-if="y">已支付</span><span data-if="b">被申诉</span></p>
			<div class="setMD fr">
				<p>起结金额：<span class="configMoney"></span>元&nbsp;&nbsp;&nbsp;&nbsp;最短结算周期：<span class="configDay"></span>天 </p><img class="cRatio fr" src="${imgPath}/wrench.png">
				<div class="MDinp">
					<p style="margin-top: 15px;"><label>起结金额</label><input class="startMoney" type="text" name="" onkeyup="this.value=this.value.replace(/\D/g,'')">元</p>
					<p><label>最短结算周期</label><input class="period" type="text" name="" onkeyup="this.value=this.value.replace(/\D/g,'')" >天</p>
					<p style="width: 154px; margin: 0 auto"><button class="setMDbtn fl">应用</button><button class="cleMDbtn fr">取消</button></p>
				</div>
			</div>
		</div>
		<div class="company"><p>单位:元</p></div>
		<!--未审核tab-->
		<table class="contList agency_notAudit">
			<tbody class="p-pdg-10">
				
			</tbody>
		</table>
		<!--未审核tab结束-->
		<!--待支付tab-->
		<table class="contList agency_notPay">
			<tbody class="p-pdg-10">
			
			</tbody>
		</table>
		<!--待支付tab结束-->
		<!--已支付tab-->
		<table class="contList agency_endPay">
			<tbody class="p-pdg-10">
			
			</tbody>
		</table>
		<!--已支付tab结束-->
		<!--被申诉-->
		<table class="contList by_appeal">
			<tbody class="p-pdg-10">
			
			</tbody>
		</table>
		<!--被申诉结束-->
	</div>
	<div id="pages">
		
	
	</div>	
	<!-- <div class="pager">
		<span class="gong"></span>
		<a href="javascript:page(false)" class="page_pre">◄ 上一页</a>
	
		<a href="javascript:page(true)" class="page_next">下一页 ►</a>
		<span>到	<input type="text" class="page_to"/> 页</span>
		<span class="tip skip">跳 转</span>
	</div> -->
</div>
<div class="mask">
	<div id="closeMask"></div>
	<div id="payDetails" class="m_content">
		<p class="m_title">调价详情<span class="tip"><img src="${imgPath}/gb.png"></span></p>
		<div id="content_m">
		</div>
	</div>

	<!--未审核弹出->修改金额-->
	<div id="edit-money" class="m_content">
		<p class="m_title">修改金额<span class="tip"><img src="${imgPath}/gb.png"></span></p>
		<p class="change_money">修改金额：<input class="money_c" type="text" value="" name="" placeholder="修改待结算金额为"></p>
		<button class="add_zf tip"><span>+</span> 添加其他资费</button>
		<div class="mod1">
	
		</div>
		<div class="btns"><button class="saveCgMoney" type="button">保存</button><button type="button">取消</button></div>
	</div>
</div>
<div class="win">
	<span></span>
</div>
<script type="text/javascript" src="${ctx}/allstyle/newEditionSkin/js/jquery-2.1.4.min.js"></script>
<script type="text/javascript" src="${jsPath}/pages.js"></script>
<script type="text/javascript" src="${jsPath}/common.js"></script>
<script type="text/javascript" src="${jsPath}/settle.js"></script>
</html>