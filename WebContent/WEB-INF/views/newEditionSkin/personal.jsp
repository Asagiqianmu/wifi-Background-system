<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ page import="java.util.Date"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<c:set var="cssPath" value="${ctx}/allstyle/newEditionSkin/newcss" />
<c:set var="jsPath" value="${ctx}/allstyle/newstyle/js" />
<c:set var="jsPathv" value="${ctx}/allstyle/newEditionSkin/js" />
<c:set var="imgPath" value="${ctx}/allstyle/newstyle/img" />

<!DOCTYPE html>
<html>
<%
	long getTimestamp = new Date().getTime(); //时间戳
%>
<head>
<meta charset="utf-8">
<title>后台管理</title>
<link rel="stylesheet" type="text/css" href="${cssPath}/common.css">
<link rel="stylesheet" type="text/css" href="${cssPath}/general.css">
<link rel="stylesheet" type="text/css" href="${cssPath}/personal.css">
<link type="text/css" href="//g.alicdn.com/sd/ncpc/nc.css?t=?<%=getTimestamp%>" rel="stylesheet"/>
<style type="text/css">${ demo.css}</style>
<script type="text/javascript">
	var ctx = "${ctx}";
	
</script>
<style type="text/css">
.nc-container {
	width: 256px;
	height:32px;
	float: right;
}

</style>
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


		
		<div class="container">
		<p class="cTitle"><span>个人中心</span></p>
		<div class="content">
			<p class="cont_title">个人资料 <button class="a_btn big fr edit_info_btn"><img src="${imgPath}/edit.png">&nbsp;&nbsp;&nbsp;编辑个人资料</button></p>
			<div class="inform">
				<div class="photo"><label>头像：</label><span><img src="${imgPath}/photo_03.png"></span></div>
				<div class="name"><label>使用者姓名：</label><span></span></div>
				<div class="com"><label>所在公司：</label><span></span></div>
				<div class="tel"><label>联系电话：</label><span></span></div>
				<div class="email"><label>联系邮箱：</label><span></span></div>
				<div class="ads"><label>联系地址：</label><span></span></div>
			</div>
			<c:if test="${user.userName != userNamePA}">
			<p class="cont_title">账户安全</p>
			<div class="safety">
				<div class="userName"><img class="tou" src="${imgPath}/usn.png"><!-- 登录账号：12365241555 --></div>
				<div class="userPass"><img class="tou" src="${imgPath}/ups.png">登录密码：**********<img class="tip edit_pas" src="${imgPath}/edit_l.png"></div>
				<div class="tx_phone">提现验证手机号：<i class="txPhone" data-phone=""></i><img src="${imgPath}/edit_l.png" class="tip edit_txp"><br><i class="l_txt">默认为您的登录账号</i></div>
			</div>
			<p class="cont_title">我的收款账号 <button class="a_btn big fr add_card"><img src="${imgPath}/add.png">&nbsp;&nbsp;&nbsp;新增收款账号</button></p>
			<div class="sk_info">
				<p><span>收款人</span><span>收款账号</span><span>操作</span></p>
				<ul class="sk_list">
					<%-- <li><span>郑复生</span><span>中国建设银行 四惠支行 62227****1125</span><span><i class="l_txt set_mr">默认收款账号</i><img class="tip det_zh" src="${imgPath}/delete.png"></span></li>
					<li><span>郑复生</span><span>支付宝 125****5425</span><span><i class="i_btn set_mr">设为默认收款账号</i><img class="tip det_zh" src="${imgPath}/delete.png"></span></li>
					<li><span>郑复生</span><span>支付宝 125****5425</span><span><i class="i_btn set_mr">设为默认收款账号</i><img class="tip det_zh" src="${imgPath}/delete.png"></span></li>
					<li><span>郑复生</span><span>支付宝 125****5425</span><span><i class="i_btn set_mr">设为默认收款账号</i><img class="tip det_zh" src="${imgPath}/delete.png"></span></li> --%>
				</ul>
			</div>
			</c:if>
		</div>
	</div>
	<div class="mask"></div>
	<div class="edit_info">
		<p class="e_title">编辑个人资料<img class="tip ed_close" src="${imgPath}/gb.png"></p>
		<div class="sel_photo">
			头像：
			<ul class="photo_list">
				<li class="tip on" imgadd="photo_01.png"><img class="pt_img" src="${imgPath}/photo_01.png"><img class="pd_xd" src="${imgPath}/strue.png"></li>
				<li class="tip" imgadd="photo_02.png"><img class="pt_img" src="${imgPath}/photo_02.png"><img class="pd_xd" src="${imgPath}/sfalse.png"></li>
				<li class="tip" imgadd="photo_03.png"><img class="pt_img" src="${imgPath}/photo_03.png"><img class="pd_xd" src="${imgPath}/sfalse.png"></li>
				<li class="tip" imgadd="photo_04.png"><img class="pt_img" src="${imgPath}/photo_04.png"><img class="pd_xd" src="${imgPath}/sfalse.png"></li>
			</ul>
		</div>
		<p class="edit_inp"><label>使用者姓名：</label><input id="cg_name" type="text" name="" maxlength="20"></p>
		<p class="edit_inp"><label>所在公司：</label><input id="cg_com" type="text" name=""  maxlength="20"></p>
		<p class="edit_inp"><label>联系电话：</label><input id="cg_tel" type="text" name=""  maxlength="11"></p>
		<p class="edit_inp"><label>联系邮箱： </label><input id="cg_email" type="text" name=""  maxlength="30"></p>
		<p class="edit_inp"><label>联系地址：</label><input id="cg_ads" type="text" name=""  maxlength="20"></p>
		<div class="btn_box">
			<button class="a_btn bc_edit">保存</button>
			<button class="q_btn qx_edit">取消</button>
		</div>
	</div>
	<div class="add_ask_for">
		<p class="ax_tit">添加收款账号<img class="tip qx_add" src="${imgPath}/gb.png"></p>
		<p class="add_p"><label>收款账号类型</label><span class="tx_type"><i class="on">银行卡</i><i>支付宝</i></span></p>
		<p class="add_p yh"><label>收款人</label><input type="text" name=""  id="givename" /></p>
		<p class="add_p yh"><label>收款账号</label><input type="text" name="" onkeyup="this.value=this.value.replace(/\D/g,'')" id="cardnum" maxlength="19"></p>
		<p class="add_p yh"><label>开户银行</label><input type="text" name="" id="bankDeposits"  maxlength="20"></p>
		<p class="add_p yh"><label>支行名称</label><input type="text" name=""  maxlength="20"></p>
		<p class="add_p zf"><label>收款人</label><input type="text" name=""  maxlength="16" id="zhifuname"></p>
		<p class="add_p zf"><label>支付宝账号</label><input type="text" name="" maxlength="20"></p>
		<p class="btns"><button class="a_btn qr_add">确认添加</button><button class="q_btn qx_add">取消</button></p>
	</div>
	<div class="cg_pass">
		<p class="ax_tit">修改密码<img class="tip qx_cg" src="${imgPath}/gb.png"></p>
		<p class="cg_inp"><label>新密码</label><input id="fpass" type="password" maxlength="20" name=""></p>
		<div class="vd_pass"><p><span class="one"></span><span class="tow"></span><span class="three"></span><i class="state"></i></p></div>
		<p class="cg_inp" style="margin-top: 10px;"><label>确认密码</label><input id="spass" type="password" maxlength="20" name=""></p>
		<p class="btns"><button class="a_btn cg_add">确定</button><button class="q_btn qx_cg">取消</button></p>
	</div>
	<div class="cg_tx_phone">
		<p class="ax_tit">修改提现手机号<img class="tip pqx_cg" src="${imgPath}/gb.png"></p>
		<p class="cg_inp"><label>旧号码</label><input id="jphone" placeholder="请输入旧手机号" type="text" maxlength="11" readonly="readonly" onkeyup="this.value=this.value.replace(/\D/g,'')" name=""></p>
		<p class="cg_inp"><label>新号码</label><input id="nphone" placeholder="请输入新手机号" type="text" maxlength="11" onkeyup="this.value=this.value.replace(/\D/g,'')" name=""></p>
		<p class="cg_inp"><label>请验证</label><div id="mpanel" style="margin-top: -20px;margin-left: 127px;text-align:center;"></div></p>
		<p class="cg_inp"><label>验证码</label><input id="code" type="text" maxlength="4" placeholder="请输入手机验证码" name=""><button class="a_btn get_code">获取验证码</button></p>
		<p class="btns"><button class="a_btn pcg_add">确定</button><button class="q_btn pqx_cg">取消</button></p>
	</div>
	<div class="dhk">
		<p class="d_txt">对话文本</p>
		<p class="d_btns"><button class="a_btn dhqd_btn">确定</button><button class="q_btn dhqx_btn">取消</button></p>
	</div>
	<script type="text/javascript" src="${ctx}/allstyle/newstyle/jquery-2.1.4.min.js"></script>
	<script type="text/javascript" src="${ctx}/allstyle/newstyle/general.js"></script>
	<script type="text/javascript" src="${ctx}/allstyle/newstyle/DES.js"></script>
	<script type="text/javascript" src="${jsPath}/personal/personal.js"></script>
	<script type="text/javascript" src="${jsPathv}/verify.js"></script>
	<!-- 此段必须要引入 t为小时级别的时间戳 -->
	
	<script type="text/javascript" src="//g.alicdn.com/sd/ncpc/nc.js?t=?<%=getTimestamp%>"></script>
	<script type="text/javascript">
		$(document).ready(function(){
			$(function() {
				$(".personal").addClass("on");	
				})
		});
		
	</script>
</body>
</html>