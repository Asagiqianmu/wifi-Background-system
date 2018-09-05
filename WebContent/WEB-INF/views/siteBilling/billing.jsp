<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ page import="java.util.Date"  %>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<c:set var="cssPath" value="${ctx}/allstyle/newEditionSkin/css" />
<c:set var="jsPath" value="${ctx}/allstyle/newEditionSkin" />
<!DOCTYPE html>
<html>
<%
long getTimestamp=new Date().getTime(); //时间戳
%>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta name="renderer" content="webkit">
	<title></title>
	<link rel="stylesheet" type="text/css" href="${cssPath}/font-icon.css?<%=getTimestamp%>">
	<link rel="stylesheet" type="text/css" href="${cssPath}/style.css?<%=getTimestamp%>">
	<script type="text/javascript" src="${jsPath}/js/jquery-2.1.4.min.js"></script>
	<script type="text/javascript">
		var ctx="${ctx}";
	</script>
	<script> 
	   (function() {
			 if (! 
			 /*@cc_on!@*/
			 0) return;
			 var e = "abbr, article, aside, audio, canvas, datalist, details, dialog, eventsource, figure, footer, header, hgroup, mark, menu, meter, nav, output, progress, section, time, video".split(', ');
			 var i= e.length;
			 while (i--){
				 document.createElement(e[i])
			 } 
		})() 
	</script>
	
</head>
<body>
<header class="ui-header">
	<h1>
		<span class="first"></span>
		<span class="sun">Wi-Fi运营系统&nbsp;·&nbsp;</span>
		<span class="back">后台管理员</span>
	</h1>
	<span class="icon icon-ask"></span>
	<div class="admin">
		<i class="icon icon-admin"></i>
		<span class="adname">${user.userName}</span>
		<i class="icon icon-down"></i>
		<ul class="menu">
			<li class="personageCenter">个人中心</li>
			<li class="exit">退出</li>
		</ul>
	</div>
</header>
<nav class="ui-nav">
    <h2 class="list"><a href="${ctx}/allSiteOfReportStatistics/index"><i class="icon icon-oper"></i>运营概览</a></h2>
	<h2 class="list"><a href="${ctx}/CloudSiteManage/index"><i class="icon icon-place"></i>场所管理</a></h2>
	<h2 class="list  on"><a href="${ctx}/SitePriceBilling/toSiteBilling"><i class="icon icon-billing"></i>计费管理</a></h2>
	<%-- <h2 class="list"><a href="${ctx}/siteCustomer/toSiteCustomerList"><i class="icon icon-user"></i>用户管理<i class="icon icon-goLeft"></i></a></h2> --%>
	<h2 class="list"><a href="${ctx}/siteCustomer/toChurnUserList"><i class="icon icon-user"></i>用户管理<i class="icon icon-goLeft"></i></a></h2>
	<h2 class="list"><a href="${ctx}/siteIncome/toSiteCustomerList"><i class="icon icon-fund"></i>资金管理<i class="icon icon-goLeft"></i></a></h2>
	<h2 class="list"><a href="${ctx}/personalCenter/toPersonalCenter"><i class="icon icon-personage"></i>个人中心</a></h2>
</nav>
<div class="container">
	<div class="content billing">
		<h3 class="title">计费管理</h3>
		<ul class="site">
			<li>按场所名称查询<input class="college" type="text" value="" placeholder="请输入场所名称" onkeypress="goFindSite(event)"><i class="icon icon-seek"></i></li>
		</ul>
		<!-- <input id="sss" type="button" value="查询"> -->
		<div class="siteList">
			<p>场所列表</p>
			<ul class="siteListAdd" id="ulConfig">
				<li id="firstLi"><span>场所名称</span><span>场所地址</span></li>
			</ul>
			<div class="fessNorm">
				<p><span class="siteName">场所名称</span><span class="siteAddress">场所地址</span><span class="newAdd">新增计费<i class="icon icon-add"></i></span></p>
				<ul class="state">
					<li class="on">已启用</li>
					<li value="0">未启用</li>
				</ul>
				<!-- 未停用的套餐类型 -->
				<div class="stateList useList">
				</div>
				<!-- 未已停用的套餐类型 -->
				<div class="stateList blockList">
				</div>
		  </div>
		</div>
	</div>
</div>
<div class="mask">
	<div class="newly">
		<div class="new charging" style="display:none;">
			<h2>新增计费<i class="icon icon-false"></i></h2>
			<ul>
				<li><em>*</em>资费类型 <p><input id="liul" name="Fruit" type="radio" value="流量" /><label for="liul">流量</label></p><p style="margin-right:10px;"><input id="shic" name="Fruit" type="radio" value="时长" /><label for="shic">时长</label></p></li>
				<li class="addName"><em>*</em>收费名称<input maxlength="6"  style="margin-left: 59px;" type="text" onkeyup="this.value=this.value.replace(/^ +| +$/g,'')"></li>
				<li class="addPrice"><em>*</em>收费单价<input  onkeyup="value=value.replace(/\.\d{2,}$/,value.substr(value.indexOf('.'),3)),value=value.replace(/[^\d.]/g,'')" style="margin-left: 59px;" type="text">元</li>
				<li class="payMold"><em>*</em>计费数量/单位<input id="addNum"  onkeyup="value=value.replace(/[^\d]/g,'') " onbeforepaste="clipboardData.setData('text',clipboardData.getData('text').replace(/[^\d]/g,''))"  type="text" value="1">
					<span>时</span>
					<input class="add_price_type" type="hidden" value="0">
					<i class="icon icon-down"></i>
					<ul class="payList jiu">
						<li value="0">时</li>
						<li value="1">天</li>
						<li value="2">月</li>
					</ul>
				</li>
				<li class="favorable">赠送数量<input id="favorablePrice" type="text" onkeyup="value=value.replace(/[^\d]/g,'') " onbeforepaste="clipboardData.setData('text',clipboardData.getData('text').replace(/[^\d]/g,''))" name="" value="0">
					<span>时</span>
					<input class="add_give_type" type="hidden" value="0">
					<i class="icon icon-down"></i>
					<ul class="payList xin">
						<li value="0">时</li>
						<li value="1">天</li>
						<li value="2">月</li>
					</ul>
				</li>
				<div class='problem'>如何设置收费价格?<p class='proText'>第一步：给收费项目起个简短的名称；<br>第二步：设置一个合理的收费价格；<br>第三步：是否有融合套餐的需求？如果没有该需求点击"保存"即可，完成设置后在用户续费界面即可看到你设置的收费名称及价格。</p></div>
				<div class='problem'>什么是融合套餐?<p class='proText'>融合套餐是指不同登陆用户续费时相同收费类型收取不同收费价格，如您跟中国联通有合作协议，该运营商要求该集团的入网用户在使用宽带上网时费用要比非该集团用户便宜。</p></div>
				<div class='problem'>如何设置融合套餐?<p class='proText'>第一步：设置一个相对该计费类型原价便宜的价格；<br>第二步：选择与您合作的运营商该选项只是为了方便您区分合作方对系统并无实际意义，如果您不清楚合作方可任意选择；<br>第三步：新增套餐号段；<br>第四步：点击'保存'即可完成操作。</p></div>
			</ul>
			
			<div class="fuseAdd">
				<span>融合套餐</span>
				<div class="yesOrNo">
					<span class="yes">ON</span>
					<div class="bal"></div>
					<span class="no">OFF</span>
				</div>
				<div class="PackageDetails">
					<div class="setMeal">
						<label for="num"><em>*</em>套餐收费</label>
						<input id="mPrice" type="text" onkeyup="value=value.replace(/\.\d{2,}$/,value.substr(value.indexOf('.'),3)),value=value.replace(/[^\d.]/g,'')" value="" id="num">元
					</div>
					<div class="teamGroup">
						<input class="add_charge_type" type="hidden" value="1">
						<label for="fn-group"><em>*</em>所属集团</label>
						<button class="groupList" id="fn-group">中国电信</button>
						<i class="icon icon-down"></i>
						<ul>
							<li>中国电信</li>
							<li>中国移动</li>
							<li>中国联通</li>
						</ul>
					</div>
					<div class="comboNum">
						<span><em>*</em>套餐号段</span>
						<div class="comboNumList">
							<input class="appNum" maxlength="7"  type="text" value="" placeholder="如:138211"
							onkeyup="this.value=this.value.replace(/\D/g,'')" onafterpaste="this.value=this.value.replace(/\D/g,'')">
							<button class="appendNum"><i class="icon icon-add"></i>新增号段</button>
						</div>
					</div>
					
				</div>
			</div>
			<div class="zifeiSm">
				<h6>资费说明</h6>
				<textarea maxlength="40" placeholder="请填写资费说明"></textarea>
			</div>
			<div class="btns">
				<p>
					<button id="save" type="button">保存</button>
					<button type="button">取消</button>
				</p>
			</div>
		</div>
		<div class="new amend">
			<h2>修改计费<i class="icon icon-false"></i></h2>
			<ul>
				<li><em>*</em>资费类型 <p class="p1"></p></li>
				<li class="xName"><em>*</em>收费名称<input disabled="disabled" style="margin-left: 59px;" type="text" onkeyup="this.value=this.value.replace(/^ +| +$/g,'')"></li>
				<li class="xPrice"><em>*</em>收费单价<input id="copyPrice" onkeyup="value=value.replace(/\.\d{2,}$/,value.substr(value.indexOf('.'),3)),value=value.replace(/[^\d.]/g,'')" style="margin-left: 59px;" type="text">元</li>
				<li class="payMold"><em>*</em>计费数量/单位<input onkeyup="value=value.replace(/[^\d]/g,'') " onbeforepaste="clipboardData.setData('text',clipboardData.getData('text').replace(/[^\d]/g,''))" type="text" value="1">
					<span>时</span>
					<input class="new_price_type" type="hidden" value="0">
					<i class="icon icon-down"></i>
					<ul class="payList jiu">
						<!-- <li>时</li>
						<li>天</li>
						<li>月</li>
						<li>年</li> -->
					</ul>
				</li>
				<li class="favorable">赠送数量<input onkeyup="value=value.replace(/[^\d]/g,'') " onbeforepaste="clipboardData.setData('text',clipboardData.getData('text').replace(/[^\d]/g,''))" type="text" name="" value="1">
					<span></span>
					<input class="new_yprice_type" type="hidden" value="0">
					<i class="icon icon-down"></i>
					<ul class="payList xin">
						<li>时</li>
						<li>天</li>
						<li>月</li>
						<li>年</li>
					</ul>
				</li>
				<div class='problem'>如何设置收费价格?<p class='proText'>第一步：给收费项目起个简短的名称；<br>第二步：设置一个合理的收费价格；<br>第三步：是否有融合套餐的需求？如果没有该需求点击"保存"即可，完成设置后在用户续费界面即可看到你设置的收费名称及价格。</p></div>
				<div class='problem'>什么是融合套餐?<p class='proText'>融合套餐是指不同登陆用户续费时相同收费类型收取不同收费价格，如您跟中国联通有合作协议，该运营商要求该集团的入网用户在使用宽带上网时费用要比非该集团用户便宜。</p></div>
				<div class='problem'>如何设置融合套餐?<p class='proText'>第一步：设置一个相对该计费类型原价便宜的价格；<br>第二步：选择与您合作的运营商该选项只是为了方便您区分合作方对系统并无实际意义，如果您不清楚合作方可任意选择；<br>第三步：新增套餐号段；<br>第四步：点击'保存'即可完成操作。</p></div>
			</ul>
			
			<div class="fuseAdd">
				<span>融合套餐</span>
				<div class="yesOrNo">
					<span class="yes">ON</span>
					<div class="bal"></div>
					<span class="no">OFF</span>
				</div>
				<div class="PackageDetails">
					<div class="setMeal">
						<label for="num"><em>*</em>套餐收费</label>
						<input type="text" onkeyup="value=value.replace(/\.\d{2,}$/,value.substr(value.indexOf('.'),3)),value=value.replace(/[^\d.]/g,'')" value="" id="num">元
					</div>
					<div class="teamGroup">
						<label for="fn-group"><em>*</em>所属集团</label>
						<button class="groupList" id="fn-group">中国电信</button>
						<input class="new_charge_type" type="hidden" value="1">
						<i class="icon icon-down"></i>
						<ul>
							<li>中国电信</li>
							<li>中国移动</li>
							<li>中国联通</li>
						</ul>
					</div>
					<div class="comboNum">
						<span><em>*</em>套餐号段</span>
						<div class="comboNumList">
							<input type="text" maxlength="7" value="" placeholder="如:138211"
							onkeyup="this.value=this.value.replace(/\D/g,'')" onafterpaste="this.value=this.value.replace(/\D/g,'')">
							<button class="appendNum"><i class="icon icon-add"></i>新增号段</button>
						</div>
					</div>
					
				</div>
			</div>
			<div class="zifeiSm">
				<h6>资费说明</h6>
				<textarea maxlength="40" placeholder="请填写资费说明"></textarea>
			</div>
			<div class="btns">
				<p>
					<button type="button">保存</button>
					<button type="button">取消</button>
				</p>
			</div>
		</div>
	</div>
</div>
<div class="win">
	<span></span>
</div>
<div class="whether">
	<span>是否执行当前操作？</span>
	<button>是</button><button style="border:none;">否</button>
</div>
<div class="wether">
	<span>是否执行当前操作？</span>
	<button>是</button><button style="border:none;">否</button>
</div>
<div class="barcontainer"><div class="meter"></div></div>	
<script type="text/javascript" src="${jsPath}/js/billing/billing.js?<%=getTimestamp%>"></script>
<script src="${jsPath}/js/billing/GetSiteBlling.js?<%=getTimestamp%>" type="text/javascript"></script>
   
</body>
</html>
