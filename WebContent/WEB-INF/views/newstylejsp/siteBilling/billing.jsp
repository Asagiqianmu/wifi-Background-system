<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ page import="java.util.Date"  %>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<c:set var="cssPath" value="${ctx}/allstyle/newstyle/css" />
<c:set var="jsPath" value="${ctx}/allstyle/newstyle/js" />
<c:set var="imgPath" value="${ctx}/allstyle/newstyle/img" />
<c:set var="jsPathv" value="${ctx}/allstyle/newEditionSkin/js" />
<!DOCTYPE html>
<html>
<%
long getTimestamp=new Date().getTime(); //时间戳
%>
<head>
	<head>
		<meta charset="utf-8">
		<title>后台管理</title>
		<link rel="stylesheet" type="text/css" href="${cssPath }/common.css">
		<link rel="stylesheet" type="text/css" href="${cssPath }/general.css">
		<link rel="stylesheet" type="text/css" href="${cssPath }/chargeManage.css">
	</head>
	<script type="text/javascript">
		var ctx="${ctx}";
		var imgPath="${imgPath}";
	</script>
</head>
<body>
	<!-- 此段必须要引入 滑动验证码-->
	<div id="_umfp" style="display:inline;width:1px;height:1px;overflow:hidden;display: none"></div>
	<!-- 引入结束 -->
	<!-- 此段必须要引入 滑动验证码-->
	<input type='hidden' id='csessionid' name='csessionid'/>
	<input type='hidden' id='sig' name='sig'/>
	<input type='hidden' id='token' name='token'/>
	<input type='hidden' id='scene' name='scene'/>
	<!-- 引入结束 -->
		<div class="mask opacity opacity1"></div>
		

		<div class="imgShow">
			<div><img src="${imgPath}/shit.jpg"></div>
			<div class="marked"></div>
			<div class="newSite"><button> <span>+</span> 新建场所</button></div>
		</div>
		<div class="container">
			<p class="cTitle"><span>计费管理</span></p>
			<div class="content">
				<p class="con-title">场所下计费列表</p>
				<span class="searck-box"><input class="place-search" id="" value="" placeholder="请输入场所名称"/><img class="searchPic" src="${imgPath }/search.png"/></span>
				<div class="changeManage">
					<ul class="cm-list">
					</ul>
				</div>
				<div class="pager">
					<span class="page_first bt">首页</span>
					<span class="page_pre bt">◀</span>
					<span class="page_cont"><i></i>/<i></i></span>
					<span class="page_next bt">▶</span>
					<span class="page_last bt">尾页</span>
					<input class="page_to" type="text" name="" onkeyup="this.value=this.value.replace(/\D/g,'')">
					<span class="skip bt">跳转</span>
				</div>
			</div>
		</div>
		<div class="user_list" style="display: none;">
					<ul class="ul_cont">
						
						
					</ul>
					<!--详细信息页码-->
					<p class="page_show">
							<img src="${imgPath }/top-page.png" class="page-btn left-to" />
							<span class="page-num current-page"></span>/
							<span class="page-num total-page"></span>
							<img src="${imgPath }/next-page.png" class="page-btn right-to" />
					</p>
				</div>
				<!--右侧滑出菜单栏-新增计费-->
				<div class="new-billing">
					<p class="rl-name"><span class="newadd-charge">新 增 计 费</span><span class="rl-exit">&times;</span></p>
					<div class="right-box">
						<p class="bill-style">
						<span class="bs-name">资费类型</span>
						<span class="bs-item shi"><img src="${imgPath }/sele1.png"/></span>
						<span class="bs-time shi">时长</span>
						<span class="liu" class="bs-item"><img src="${imgPath }/sele2.png"/></span>
						<span class="liu bs-flow bs-time">流量</span>
						<span class="yj" class="bs-item"><img src="${imgPath }/sele2.png"/></span>
						<span class="yj bs-flow">押金</span></p>
						<p class="bs-contInputt"><span class="bs-name"><i>*</i>资费名称</span><span class="zf-name"><input maxlength="6" type="text" name="" class="charge-name cn-input charge-design" id="" value="" disabled="disabled" /></span></p>
						<p class="bs-contInputt"><span class="bs-name"><i>*</i>收费单价</span><span><input type="text" name=""  class="charge-name cn-input charge-price" id="priceMeal"  onkeyup="value=value.replace(/\.\d{2,}$/,value.substr(value.indexOf('.'),3)),value=value.replace(/[^\d.]/g,'')" /></span>&nbsp;元</p>
						<p class="bs-contInput">
							<span class="bs-name"><i>*</i>计费数量</span><span><input type="text" name=""  class="charge-num cn-input" id="priceNum" value="" onkeyup="this.value=this.value.replace(/\D/g,'')" onafterpaste="this.value=this.value.replace(/\D/g,'')" /></span>
							<span class="bsUin">
							<span>单位</span>
								<select name="" class="bs-unit" id="sel1">
									<option value="0">时</option>
									<option value="1">天</option>
									<option value="2">月</option>
								</select>
							</span>
						</p>
						<p class="bs-contInput">
							<span class="bs-name">赠送数量</span><span><input type="text" name="" class="charge-num giving-num" id="" value="" onkeyup="this.value=this.value.replace(/\D/g,'')" onafterpaste="this.value=this.value.replace(/\D/g,'')" /></span>
							<span class="bsUin">
							<span>单位</span>
								<select name="" class="bs-unit1">
									<option value="0">时</option>
									<option value="1">天</option>
									<option value="2">月</option>
								</select>
							</span>
						</p>
						<div class="bs-contInput" style="margin: 5px auto;">
							<span class="ask-item">如何设置融合套餐？</span><span class="qu-pic"><img src="${imgPath }/ask.png"/></span>
							<p class="ask-answer">
								第一步：设置一个相对该计费类型原价便宜的价格；<br>
								第二步：选择与您合作的运营商该选项只是为了方便您区分合作方对系统并无实际意义，如果您不清楚合作方可任意选择；<br>
								第三步：新增套餐号段；<br>
								第四步：点击'保存'即可完成操作。
							</p>
						</div>
						<div class="bs-contInput" style="margin: 5px auto;">
							<span class="ask-item">如何设置收费价格？</span><span class="qu-pic"><img src="${imgPath }/ask.png"/></span>
							<p class="ask-answer">
								第一步：给收费项目起个简短的名称；<br>
								第二步：设置一个合理的收费价格；<br>
								第三步：是否有融合套餐的需求？如果没有该需求点击"保存"即可，完成设置后在用户续费界面即可看到你设置的收费名称及价格。
							</p>
						</div>
						<div class="bs-contInput" style="margin: 5px auto;">
							<span class="ask-item">什么是融合套餐？</span><span class="qu-pic"><img src="${imgPath }/ask.png"/></span>
							<p class="ask-answer">
								融合套餐是指不同登陆用户续费时相同收费类型收取不同收费价格，如您跟中国联通有合作协议，该运营商要求该集团的入网用户在使用宽带上网时费用要比非该集团用户便宜。
							</p>
						</div>
						<div class="package-switch">
							<span class="bs-name" style="float: left;">融合套餐</span>
							<div class="yesOrNo">
								<span class="yes">ON</span>
								<div class="bal"></div>
								<span class="no">OFF</span>
							</div>
						</div>
						<div class="package-cont">
							<p class="bs-contInput"><span class="bs-name"><i>*</i>套餐收费</span><span><input type="text" name="" class="charge-package" id="" onkeyup="value=value.replace(/\.\d{2,}$/,value.substr(value.indexOf('.'),3)),value=value.replace(/[^\d.]/g,'')" /></span>&nbsp;元</p>
							<p class="bs-contInput">
								<span class="bs-name">所属集团</span><span class="bsUin"><select name="" class="bs-group">
									<option value="中国电信">中国电信</option>
									<option value="中国移动">中国移动</option>
									<option value="中国联通">中国联通</option>
								</select>
								<!--<span class="se-downPic1"><img src="img/se-down.png"/></span>-->	
							</span>
							</p>
							<p class="addCodeBtn"><span style="line-height: 23px;">+</span>新增号段</p>
							<div class="bs-contCode">
								<span class="bs-name">套餐号段</span>
								<p class="number-list"><span class="code-detail"><input type="text" maxlength='7' placeholder="如:138211" class="package-num" id="" value="" onkeyup="this.value=this.value.replace(/\D/g,'')"/><span class="dele-code">X</span></span></p>
							</div>
						</div>
						<p class="bs-contInput"><span class="bs-name" style="float: left;">资费说明</span><span><textarea placeholder="请填写资费说明(最多25字)" maxlength="25" class="charge-instro" rows="" cols=""></textarea></span></p>
						<p class="add-btn"><button class="btn-sureAdd">保 存</button><button class="btn-cancle">取  消</button></p>
					</div>
				</div>
				<!--新增资费保存提示框-->
				<div class="charge-tipBox">	
					<p class="ct-name"><span class="new-detailName">新增资费明细</span><span class="ct-exit">&times;</span></p>
					<div class="box-cont">
						<p class="ct-first"><span class="ct-leftName">资费名称</span><span class="ct-rightName ct-chargeName"></span></p>
						<p><span class="ct-leftName">收费单价</span><span class="ct-rightName ct-chargePrice ct-common"></span></p>
						<p class="ct-fuck"><span class="ct-leftName">套餐收费</span><span class="ct-rightName ct-charge"></span></p>
						<p><span class="ct-leftName">资费类型</span><span class="ct-rightName ct-chargeStyle"></span></p>
						<p><span class="ct-leftName">计费数量/单位</span><span class="ct-rightName ct-chargeNum"></span></p>
						<p><span class="ct-leftName">优惠数量/单位</span><span class="ct-rightName ct-preferNum"></span></p>
						<p><span class="ct-leftName">资费说明</span><span class="ct-rightName ct-chargeIntro"></span></p>
						<p class="fusion-meal">已开通<span class="tc-style"></span>融合套餐</p>
						<p class="ct-btn"><span class="sureAdd-btn">确认添加</span><span class="giveUp-save">放弃保存</span></p>
					</div>
				</div>
				<!--按钮操作提示-->
				<div class="btn-tipBox">
					<p class="tip-word">是否执行此操作？</p>
					<p class="tw-btn"><span class="btbtn-sure">是</span><span class="btbtn-cancle">否</span></p>
				</div>

	<script type="text/javascript" src="${ctx}/allstyle/newstyle/jquery-2.1.4.min.js"></script>
	<script type="text/javascript" src="${ctx}/allstyle/newstyle/general.js"></script>
	<script type="text/javascript" src="${jsPath}/billing/changeManage.js"></script>
	<script type="text/javascript">
	$(document).ready(function(){
		$(function() {
			$(".billing").addClass("on");	
		})
	});
		                    
</script>
</body>
</html>
