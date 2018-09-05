<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ page import="java.util.Date"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<c:set var="cssPath" value="${ctx}/allstyle/newEditionSkin/newcss" />
<c:set var="jsPath" value="${ctx}/allstyle/newstyle" />
<c:set var="jsPatht" value="${ctx}/allstyle/newstyle/js" />
<c:set var="jsPathv" value="${ctx}/allstyle/newEditionSkin" />
<c:set var="imgPath" value="${ctx}/allstyle/newstyle/img" />
<!DOCTYPE html>
<html>
<%
	long getTimestamp = new Date().getTime(); //时间戳
%>
<head>
<meta charset="utf-8">
<title>后台管理</title>

<style type="text/css">
.ab_btn{
	min-width: 80px;
	height: 30px;
	border: none;
	background: #57c6d4;
	color: #fff;
	cursor: pointer;
}
</style>
<script type="text/javascript">
	var ctx = "${ctx}";
</script>
</head>
<body>
	<div class="container">
		<p class="cTitle">
			<span>运营概览</span>
		</p>
		<div class="content">
			<div class="device_info">
				<div class="dev_se fn_select">
					场所 <span value=0 class="chorsesite" id="all">全部</span>
					<ul class="allsite">
						<li value=0 title="全部">全部</li>
						<c:forEach var="p" items="${siteList}">
							<li value="${p.id}" title="${p.site_name}">${p.site_name}</li>
						</c:forEach>
					</ul>
				</div>
				<div class="info_txt all">
					<p class="user_num">人数：<span id="totalpeople">0</span><img class="wh_ts"
							src="${imgPath}/wh.png"><i class="float">该值表示您覆盖场所的总人数，即若
							您覆盖的是学校，该值为全校师生的 总人数。</i></p>
					<c:if test="${user.userName != userNamePA}">
					<p class="today_income">今日收益：<span id="todayincome">0.00元</span>
					</p>
					<p class="all_income">总收入：<span id="totalincome">0.00元</span></p>
					</c:if>
				</div>
			</div>
			<div class="various">
				<div class="var_box">
				<div class="independent">
					<p>独立用户总数</p>
					<span>0</span>
				</div>
			</div>
			<div class="var_box">
				<div class="register">
					<p>今日新增用户数</p>
					<span>0</span>
				</div>
			</div>
			<div class="var_box">
				<div class="pay">
					<p>付费用户总数</p>
					<span>0</span>
				</div>
			</div>
			<div class="var_box">
				<div class="yesterday">
					<p>上线AP总数</p>
					<span>0</span>
				</div>
			</div>
			<div class="var_box">
				<div class="real_time">
					<p>昨日注册用户数</p>
					<span>0</span>
				</div>
			</div>
			</div>
			<div class="annular_chart">
				<span>用户入网情况概览</span>
				<div class="both">
					<!-- <p class="round" id="tryNOtTry">0%</p> -->
					<div id="mychatuser" style="width:200px ;height:200px"></div>
					<div class="perception">
						用户渗透率<img class="wh_ts" src="${imgPath}/ts.png">
						<p class="float">该值表示您覆盖场所用户对您部署无 线的知晓程度。(若全场所的人都知道
							，则为100%。若全不知道，则为0% 需要加大宣传力度)</p>
					</div>
				</div>
				<div class="both">

					<div id="mychatusero" style="width:200px ;height:200px"></div>
					<div class="tryOut">
						注册转换率<img class="wh_ts" src="${imgPath}/ts.png">
						<p class="float">该值表示您覆盖场所用户对您网络速 度的满意程度。(越高表示网络体验越 让人满意)</p>
					</div>
				</div>
				<div class="both">
				<%-- 	<p class="round" id="payNotPay" style="color:#03A1B9 ! important">0%</p>
					<canvas id='register' width='200' height='200'></canvas> --%>
					<div id="mychatusert" style="width:200px ;height:200px"></div>
					<div class="registers">
						付费转换率<img class="wh_ts" src="${imgPath}	/ts.png">
						<p class="float">该值表示您覆盖场所用户对您网络速度及及格的满意程度。(如果指标过低则您需要优化网络稳定性、及提升网速，也有可能是该场所有竞争对手存在)</p>
					</div>
				</div>
			</div>
			<div class="pay_type">
				<span>缴费类型占比</span>
				<div id="pieChart" style="width: 400px; height: 300px; margin: 30px auto;"></div>
			</div>
			
		<c:if test="${user.userName != userNamePA}">
			<div class="income">
				<div class="slsq">
					收入统计(元)<img class="wh_ts" src="${imgPath}/ts.png">
					<p class="float">获得展示最近12个月每月的总收入，请选取结束月份</p>
					<span class="swicth d" id="swicthdm"><i></i></span> 
					<input type="text" readonly="readonly"
						onclick="WdatePicker({dateFmt:'yyyy-MM-dd'})" class="Wdate"
						id="startTime"> 至 <input type="text" readonly="readonly"
						onclick="WdatePicker({dateFmt:'yyyy-MM-dd'})" class="Wdate"
						id="endTime">
						<button class="a_btn" id="dayquery">查询</button>
				</div>
				<div id="histogram" style="width: 100%; margin-top: 10px;"></div>
			</div>
			</c:if>
			<div class="user_add"> 
				<div class="t_tit">
					用户增长趋势<img class="wh_ts" src="${imgPath}/ts.png">
					<p class="float">用户增长趋势=总付费用户数-流失付 费用户数（用户过期后近两年内若无
						缴费行为视为流失用户，学校排除寒 暑假、工厂排除春节。）</p>
					<button class="a_btn big">流失用户详情</button>
				</div>
				<div id="lineChart" style="width: 100%; margin-top: 10px"></div>
				
			</div>
		</div>
	</div>
	<div class="barcontainer"><div class="meter"></div></div>
<script src="${jsPatht}/operation/line/highcharts.js"></script>
<script src="${jsPatht}/operation/line/exporting.js"></script>

<script type="text/javascript" src="${jsPath}/jquery-2.1.4.min.js"></script>
<script type="text/javascript" src="${jsPath}/general.js"></script>
<script class="resources library" type="text/javascript" src="${jsPath}/js/cloudsite/area.js"></script>
<script type="text/javascript" src="${jsPathv}/js/echarts.min.js"></script>
<script type="text/javascript" src="${jsPathv}/newjs/index.js"></script>
<script type="text/javascript" src="${ctx}/allstyle/newstyle/My97DatePicker/WdatePicker.js"></script>
<link rel="stylesheet" type="text/css" href="${cssPath}/common.css">
<link rel="stylesheet" type="text/css" href="${cssPath}/general.css">
<link rel="stylesheet" type="text/css" href="${cssPath}/index.css">

<script type="text/javascript">
$(document).ready(function(){
	$(function() {
		$(".index").addClass("on");	
		})
});
</script>
</body>
</html>