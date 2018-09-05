<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ page import="java.util.Date"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<c:set var="cssPath" value="${ctx}/allstyle/newstyle/css" />
<c:set var="jsPath" value="${ctx}/allstyle/newstyle/js" />
<c:set var="imgPath" value="${ctx}/allstyle/newstyle/img" />
<c:set var="upLoadPath" value="http://realnameauth.oss-cn-shanghai.aliyuncs.com/user_picture/"/>
<!DOCTYPE html>
<html>
<%
long getTimestamp=new Date().getTime(); //时间戳
%>
<script type="text/javascript">
	var ctx="${ctx}";
	var imgPath="${imgPath}";
	var upLoadPath="${upLoadPath}";
	var state = "${state}";
</script>
<head>
	<meta charset="utf-8">
	<title>后台管理</title>
	<link rel="stylesheet" type="text/css" href="${cssPath }/common.css"/>
	<link rel="stylesheet" type="text/css" href="${cssPath }/general.css"/>
	<link rel="stylesheet" type="text/css" href="${cssPath }/user_mana.css"/>
	<style>
	.ls_list_info>li{
		text-align: center;
		float:left;
		}
		
	.sn_user_table > p{
		height: 30px;
		background: #f7f7f7;
		color: #666;
		font-size: 12px;
		font-weight: bold;
		line-height: 30px;
	}	
	
	.sn_user_table span,
	.sn_user_table > p > span{
		float: left;
		width: 13% !important;
		text-align: center;
	}
	.sn_user_table > p > .t1{
	 margin-left:80px;
	}
	.sn_user_table {
	    margin-top: 40px;
	}
	.ta_list .sup-li{
		margin-left:80px;
	}
	</style>
</head>
<body>

	<div class="container">
	<p class="cTitle"><span>数据中心</span></p>
	<div class="content">
	<!-- 	<p class="cn_table"><span class="on"></span>
		</p> -->
		<div class="us_query">
		</div>
		<div class="l_us_query">
			<p><input id="sTime" type="text" readonly="readonly" onclick="WdatePicker({dateFmt:'yyyy-MM-dd'})" class="Wdate"> 至 <input id="eTime" type="text" readonly="readonly" onclick="WdatePicker({dateFmt:'yyyy-MM-dd'})" class="Wdate"><button class="a_btn date_query">查询</button><button class="a_btn rebeat">重置</button></p>
		</div>
		
		<div class="s_us_query" style="display:none">
	</div>
	<p style="margin-left:20px;float:right">日期： <input id="sTime1" value="" type="text" readonly="readonly" onclick="WdatePicker({dateFmt:'yyyy-MM-dd'})" class="Wdate"> 至<input id="ueTime" type="text" readonly="readonly" onclick="WdatePicker({dateFmt:'yyyy-MM-dd'})" class="Wdate"><button id="a_btn" class="a_btn_total" style="min-width: 80px; height: 30px;line-height: 30px; border: none;background: #57c6d4;color: #fff; cursor: pointer;">查询</button></p>
	</div>
		
		<p class="l_num">流失总人数<span></span>(如果用户上网时间到期后，两周内没有续费则视为流失用户)<button class="a_btn big">导出Excel</button></p>
		<p class="s_num">剩余带审核人数<span></span>人<button class="a_btn  nowAuth">+ 现场认证</button></p>
		<div class="in_user_table">
			<p>
				<span class="t1">用户名</span>
				<span class="t2">实名认证</span>
				<span class="t3">最后一次充值金额</span>
				<span class="t4">总消费金额</span>
				<span class="t5">消费次数</span>
				<span class="t6">归属场所</span>
				<span class="t7">操作</span>
			</p>
			<ul class="ta_list">
				
			</ul>
		</div>
		
		<div class="sn_user_table" style="display:none">
			<p>
				<span class="t1">日期</span>
				<span class="t2">PV(IOS/安卓)</span>
				<span class="t3">UV(IOS/安卓)</span>
				<span class="t5">点击次数(IOS/安卓)</span>
				<span class="t6">点击人数(IOS/安卓)</span>
				<span class="t7">跳转下载人数</span>
				<span class="t4">认证成功</span>
			</p>
			<div id="total_time_list">
			
			</div>
		</div>
		
		<div class="user_table">
			<p>
				<span class="t1">用户名</span>
				<span class="t2">账户余量</span>
				<span class="t3">最后一次充值金额</span>
				<span class="t4">总消费金额</span>
				<span class="t5">消费次数</span>
				<span class="t6">归属场所</span>
				<span class="t7">操作</span>
			</p>
			<ul class="ta_list">
				
			</ul>
		</div>
		<div class="w_user_table">
			<p>
				<span class="t1">用户名</span>
				<span class="t2">实名认证</span>
				<span class="t7">归属场所</span>
				<!-- <span class="">操作</span> -->
			</p>
			<ul class="ta_list">
			</ul>
		</div>
		<div class="l_user_table">
			<p>
				<span class="t1">用户名</span>
				<span class="t3">到期时间</span>
				<span class="t4">最后一次充值金额</span>
				<span class="t5">总消费金额</span>
				<span class="t6">消费次数</span>
				<span class="t7">归属场所</span>
			</p>
			<ul class="ta_list">
			</ul>
		</div>
		<div class="s_user_table">
			<p>
				<span>用户名(手机号)</span>
				<span>姓名</span>
				<span>身份证号</span>
				<span>所属场所</span>
				<span>地址</span>
				<span>身份证正反面照片</span>
				<span>操作</span>
			</p>
			<ul class="ta_list">
				
			</ul>
		</div>
		<div id="cloudpage" class="pager" style="display: none;">
			<span class="page_first bt">首页</span>
			<span class="page_pre bt">◀</span>
			<span class="page_cont"><i>1</i>/<i id="count"></i></span>
			<span class="page_next bt">▶</span>
			<span class="page_last bt">尾页</span>
			<input class="page_to" type="text" name="" onkeyup="this.value=this.value.replace(/\D/g,'')">
			<span class="skip bt">跳转</span>
		</div>
	</div>
</div>
<div class="mask"></div>
<div class="us_card">
	<span class="close tip"><img src="${imgPath }/close.png"></span>
	<div class="card1">
		身份证正面照
		<img src="${imgPath }/photo.png">
	</div>
	<div class="card2">
		身份证反面照
		<img src="${imgPath }/photo.png">
	</div>
</div>
<div class="pay">
	<p class="p_tit">充值<img class="tip gb_close" src="${imgPath }/gb.png"></p>
	<p class="pay_user">充值用户<span></span></p>
	<div class="dv_query fn_select payType">充值类型 
		<span id="p_type"></span>
		<ul>
		</ul>
	</div>
	<p class="pay_num">充值数量<input id="p_num" type="text" name=""  onkeyup="this.value=this.value.replace(/\D/g,'')" value="1"></p>
	<p class="pay_all">充值总额<span><i id="p_allNum"></i>元</span></p>
	<p class="btns"><button class="a_btn lj_pay">立即充值</button><button class="q_btn qx_pay">取消</button></p>
</div>
<div class="sb_bd">
	<p class="p_tit">现场认证<img class="tip gb_close" src="${imgPath }/gb.png"></p>
	<p class="bd_inp">绑定手机号<input id="x_phone" type="text" onkeyup="this.value=this.value.replace(/\D/g,'')" maxlength="11" name=""></p>
	<p class="bd_inp">&nbsp;&nbsp;&nbsp;真实姓名<input id="x_name" type="text" name=""></p>
	<p class="bd_inp">&nbsp;&nbsp;&nbsp;身份证号<input id="x_card" type="text" name=""></p>
	<p class="bd_inp">&nbsp;&nbsp;&nbsp;宿舍位置<input id="x_ads" type="text" name=""></p>
	<p class="btns"><button class="a_btn lj_bd">绑定</button><button class="q_btn qx_bd">取消</button></p>
</div>
<div class="add_user">
	<p class="p_tit">新增用户<img class="tip gb_close" src="${imgPath }/gb.png"></p>
	<p class="sex">&nbsp;&nbsp;&nbsp;性别<span id="sex"><i class="boy on">男</i><i class="girl">女</i></span></p>
	<p class="bd_inp">手机号<input id="cj_phone" type="text" maxlength="11" name=""></p>
	<p class="bd_inp">&nbsp;&nbsp;&nbsp;密码<input id="cj_pwd" type="text" name=""></p>
	<p class="btns"><button class="a_btn lj_cj">立即创建</button><button class="q_btn qx_cj">取消</button></p>
</div>
<div class="dhk">
	<p class="d_txt">对话文本</p>
	<p class="d_btns"><button class="a_btn dhqd_btn">确定</button><button class="q_btn dhqx_btn">取消</button></p>
</div>
<div class="imgShow">
		<div><img src="${imgPath}/shit.jpg"></div>
		<div class="marked"></div>
</div>

<script type="text/javascript" src="${ctx}/allstyle/newstyle/jquery-2.1.4.min.js"></script>
<script type="text/javascript" src="${ctx}/allstyle/newstyle/general.js"></script>
<script type="text/javascript" src="${jsPath}/userDataCenter/user_data.js"></script>
<script type="text/javascript" src="${ctx}/allstyle/newstyle/My97DatePicker/WdatePicker.js"></script>

<script type="text/javascript">
		 var d = new Date();
	     function addzero(v) {if (v < 10) return '0' + v;return v.toString();}
	     var s = d.getFullYear().toString() +'-'+ addzero(d.getMonth() + 1) +'-'+ addzero(d.getDate());
	     $("#sTime1").val(s);
	     $("#ueTime").val(s);
	     
</script>
</body>
</html>