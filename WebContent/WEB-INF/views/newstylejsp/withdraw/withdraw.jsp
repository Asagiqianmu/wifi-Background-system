<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ page import="java.util.Date"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<c:set var="cssPath" value="${ctx}/allstyle/newstyle/css" />
<c:set var="jsPath" value="${ctx}/allstyle/newstyle/js" />
<c:set var="imgPath" value="${ctx}/allstyle/newstyle/img" />
<!DOCTYPE html>
<html>
<%
long getTimestamp=new Date().getTime(); //时间戳
%>
<head>
<meta name="format-detection" content="telephone=no">
	<title></title>
	<link rel="stylesheet" type="text/css" href="${cssPath}/common.css?<%=getTimestamp%>">
	<link rel="stylesheet" type="text/css" href="${cssPath}/general.css?<%=getTimestamp%>">
	<link rel="stylesheet" type="text/css" href="${cssPath}/withdraw.css?<%=getTimestamp%>">
	<link type="text/css" href="//g.alicdn.com/sd/ncpc/nc.css?t=?<%=getTimestamp%>" rel="stylesheet"/>
	<script type="text/javascript" src="${ctx}/allstyle/newstyle/jquery-2.1.4.min.js?<%=getTimestamp%>"></script>
	<script type="text/javascript">
            var ctx="${ctx}";
        	var imgPath="${imgPath}";
        	var upLoadPath="${upLoadPath}";
	     </script>
	<style type="text/css">
		.nc-container {
		    display:inline-block;
			width: 245px;
			height:32px;
			float: right;
			margin-right: 20px;
			z-index:0
		}
		
		@media print {
			body {
				display: none
			}
		}
	</style>
</head>
<body oncontextmenu=self.event.returnValue=false>
<div id="_umfp" style="display:inline;width:1px;height:1px;overflow:hidden;display: none"></div>
<!-- 引入结束 -->
<!-- 此段必须要引入 滑动验证码-->
<input type='hidden' id='csessionid' name='csessionid'/>
<input type='hidden' id='sig' name='sig'/>
<input type='hidden' id='token' name='token'/>
<input type='hidden' id='scene' name='scene'/>
<!-- 引入结束 -->

		
	<div class="container">
		<p class="cTitle"><span>资金管理</span></p>
		<div class="content">
			<p class="cn_table"><span class="on" value="txsq">提现申请</span><span value="txmx">提现明细</span><span value="srmx">收入明细</span></p>
			<div class="with_info">
				<p><img src="${imgPath}/wt.png">可提余额：<span></span>元<button class="a_btn big getWithdraw">申请提现</button></p>
				<p><img src="${imgPath}/sj.png">已结算至：<span></span></p>
			</div>
			<div class="tx_cont">
				<p class="tx_tab"><span class="on" data-status="all">全部</span><span data-status="djs">待结算</span><span data-status="yzf">已支付</span><span data-status="suz">申诉中</span></p>
				<p class="date_query">日期范围<input type="text" readonly="readonly" onclick="WdatePicker({dateFmt:'yyyy-MM-dd'})" id="dateStart1" class="Wdate"> 至 <input type="text" readonly="readonly" onclick="WdatePicker({dateFmt:'yyyy-MM-dd'})" id="dataEnd1" class="Wdate"><button class="a_btn seldate">查询</button></p>
			</div>
			<div class="tx_list">
				<p><span class="tx1">结算周期</span><span class="tx2">收款账号</span><span class="tx3">线上缴费</span><span class="tx4">线下缴费</span><span class="tx5">用户退费</span><span class="tx6">技术支持费</span><span class="tx7">应结算总金额</span><span class="tx8">状态</span><span class="tx9">操作</span></p>
				<ul class="tx_list_info">
				</ul>
			</div>
			<p class="ls_date">日期范围<input type="text" readonly="readonly" onclick="WdatePicker({dateFmt:'yyyy-MM-dd'})" class="Wdate"> 至 <input type="text" readonly="readonly" onclick="WdatePicker({dateFmt:'yyyy-MM-dd'})" class="Wdate"><button class="a_btn">查询</button></p>
			<div class="ls_list">
				<p><span class="tx1 date_span">时间</span><span class="tx2">流水账号</span><span class="tx3">线上缴费</span><span class="tx4">线下缴费</span><span class="tx5">用户退费</span><span class="tx6">技术支持费</span><span class="tx7">实际总收入</span><span class="tx9">操作</span></p>
				<ul class="ls_list_info">
				</ul>
			</div>
			<div class="mx_box">
				<div class="dev_se fn_select ">按场所查询<br> 
					<span class='collegeType1'></span>
					<ul class='pullDtype1'>
					</ul>
				</div>
				<p class="mx_date">日期范围<br><span><input type="text" readonly="readonly" onclick="WdatePicker({dateFmt:'yyyy-MM-dd'})" class="Wdate incomeDate1">&nbsp;&nbsp;&nbsp;至&nbsp;&nbsp;&nbsp;<input type="text" readonly="readonly" onclick="WdatePicker({dateFmt:'yyyy-MM-dd'})" class="Wdate incomeDate2"></span></p>
				<div class="type_se fn_select">充值类型<br>
					<span class='collegeType'>全部</span>
					<ul class='pullDtype'>
						<li>全部</li>
					</ul>
				</div>
				<p class="mx_unquery">用户名查询<br><input type="text" placeholder="请输入用户名"  onkeyup="this.value=this.value.replace(/\D/g,'')"></p>
				<br><button class="a_btn">查询</button>
			</div>
	
			<div class="ms_list">
				<span>总收入：<i></i>元</span>
				<p><span>用户名</span><span>充值金额</span><span>充值类型</span><span>购买数量</span><span>交易类型</span><span>充值时间</span></p>
				<ul class="ms_list_info">
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
	<div class="mask"></div>
	<div class="ask_for">
		<p class="ax_tit">申请提现<img class="tip sqtx" src="${imgPath}/gb.png"></p>
		<p class="code_box">验&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;证<span id="dom_id"></span></p>
		<p class="code_box">手机验证码 <input type="text" style="text-align: center" placeholder="请输入手机验证码" class="codeNum" name=""><input type="hidden" id="txtel" value="${user.withdrawPhone==''?user.userName:user.withdrawPhone==null?user.userName:user.withdrawPhone}"><button class="a_btn getcode">获取验证码</button></p>
		<div class="gath_box">
			收款账号
			<ul class="gath_list tip"> 
			</ul>
		</div>
		<p class="btns"><button class="a_btn calltx">申请提现</button><button class="q_btn calloff">取消</button></p>
		<div class="ask_mask">
		</div>
		
		<div class="add_ask_for">
			<p class="add_p"><label>收款账号类型</label><span class="tx_type"><i class="on">银行卡</i><i>支付宝</i></span></p>
			<p class="add_p yh"><label>收款人</label><input type="text" id="inuser" name=""></p>
			<p class="add_p yh"><label>收款账号</label><input maxlength="19" id="bankcarNums" type="text" name=""  onkeyup="this.value=this.value.replace(/\D/g,'')"></p>
			<p class="add_p yh"><label>开户银行</label><input id="bankDeposits" type="text" name=""></p>
			<p class="add_p yh"><label>支行名称</label><input type="text" id="banktype" name=""></p>
			<p class="add_p zf"><label>收款人</label><input type="text" id="zfuser" name=""></p>
			<p class="add_p zf"><label>支付宝账号</label><input type="text" id="zfcard" name=""></p>
			<p class="btns"><button class="a_btn qr_add">确认添加</button><button class="q_btn qx_add">取消</button></p>
		</div>
	</div>
	<div class="cause">
		<p class="txt_box">
			<textarea class="cause_txt" maxlength='50'></textarea>
			<span class="xz"><i></i>/<i></i></span>
		</p>
		<p class="sm">注：若情况复杂，请直接拨打<span>400-666-0050</span></p>
		<p class="btns">
		<input type="hidden" value="" class="hid">
		<input type="hidden" value="" class="hsta">
		<button class="a_btn ss_qd">申诉</button><button class="q_btn ss_qx">取消</button>
		</p>
	</div>
	<div class="change_info">
		<p class="c_title">调价详情<img class="tip ch_close" src="${imgPath}/gb.png"></p>
		<p class="ss_cause">申诉原因：价格与之前计算有差</p>
		<p class="cg_money"><span>改前金额:<i>100.00</i>元</span><span>改后金额:<i>200.00</i>元</span></p>
		<div class="zf_sm">
			<p>新增资费1</p>
			<div>
				费用类型：打车报销
				<p><img src="${imgPath}/fp.jpg"><img class="fr" src="${imgPath}/fp.jpg"></p>
				备注：因设备检修，需派检修人员及时处理，所以产生出打车费用。
			</div>
		</div>
	</div>
	<div class="imgShow">
			<div><img src="${imgPath}/shit.jpg"></div>
			<div class="marked"></div>
	</div>
	<script type="text/javascript" src="${ctx}/allstyle/newstyle/general.js"></script>
	<script type="text/javascript" src="${ctx}/allstyle/newstyle/DES.js"></script>
	<script type="text/javascript" src="${jsPath}/withdraw/withdraw.js?<%=getTimestamp%>"></script>
	<script type="text/javascript" src="${ctx}/allstyle/newstyle/My97DatePicker/WdatePicker.js"></script>
	<!-- 此段必须要引入 t为小时级别的时间戳 -->
	<script type="text/javascript" src="//g.alicdn.com/sd/ncpc/nc.js?t=?<%=getTimestamp%>"></script>
	<script type="text/javascript">
	$(document).ready(function(){
		$(function() {
			$(".withdraw").addClass("on");	
			})
	});
	</script>
	</body>
</html>