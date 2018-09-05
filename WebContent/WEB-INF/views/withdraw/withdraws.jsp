<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ page import="java.util.Date"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<c:set var="cssPath" value="${ctx}/allstyle/newEditionSkin/css" />
<c:set var="publicPath" value="${ctx}/allstyle/newEditionSkin/js" />
<c:set var="jsPath" value="${publicPath}/withdraw" />
<!DOCTYPE html>
<html>
<%
	long getTimestamp = new Date().getTime(); //时间戳
%>
<head>
<meta name="renderer" content="webkit">
<title></title>
<link rel="stylesheet" type="text/css"
	href="${cssPath}/font-icon.css?<%=getTimestamp%>">
<link rel="stylesheet" type="text/css"
	href="${cssPath}/style.css?<%=getTimestamp%>">
<link rel="stylesheet" type="text/css"
	href="${cssPath}/withdraw.css?<%=getTimestamp%>">
<script type="text/javascript"
	src="${publicPath}/jquery-2.1.4.min.js?<%=getTimestamp%>"></script>
<script type="text/javascript">
	var ctx = "${ctx}";
</script>
<style type="text/css">
 
button{
	padding: 5px 10px;
	border-radius: 10px;
}
.withdraw>ul:hover {
	background-color: #F7F7F7;
}
.selec2 > h6 > span{
	width:12%;
}
.editFloa {
	background: #fff none repeat scroll 0 0;
	box-shadow: 0 0 5px rgba(14, 33, 35, 0.53);
	display: none;
	height: 120px;
	left: 88px;
	position: absolute;
	top: 130px;
	width: 188px;
}

.cause {
	padding: 6px 20px;
	height: 20px;
	line-height: 20px;
	box-shadow: 0 0 5px #999;
	background: #fff;
	position: absolute;
	left: 850px;
	font-size: 12px;
	top: 26px;
	z-index: 2;
	display: none;
}
#accountRecordLog li span{
	width: 12%;
}
</style>
</head>
<body oncontextmenu=self.event.returnValue=false>
	<header class="ui-header">
		<h1>
			<span class="first"></span> <span class="sun">Wi-Fi运营系统&nbsp;·&nbsp;</span>
			<span class="back">后台管理员</span>
		</h1>
		<span class="icon icon-ask"></span>
		<p class="admin">
			<i class="icon icon-admin"></i> <span class="adname">${user.userName}</span>
			<i class="icon icon-down"></i>
		<ul class="menu">
			<li class="exit">退出</li>
		</ul>
		</p>
	</header>
	<div class="namelike" style="margin-top:65px;margin-left:20px">
		用户名查询
		<form action="${pageContext.request.contextPath}/withDraw/toWaitWithdrawLog">
			<input type="text" value="" name="name" style="width: 180px;height: 25px"> <input type="submit"
				value="查询" id="submit" style="width: 50px;height: 28px; background-color: #57C6D4;color: #fff"/>
		</form>
	</div>
	<div class="withdraw" style="display: block; width: 300px; margin-top: 10px; margin-left: 10px;left:20px">
		<h6 style="background-color: #F7F7F7; width:300px; height: 35px;">
			<span style="color: #666666; width: 150px; text-align: center; display: inline-block; float: left; line-height: 35px">用户名</span>
			<span style="color: #666666; width: 150px; text-align: center; display: inline-block; float: left; line-height: 35px">操作</span>
		</h6>
		<c:forEach items="${list.list}" var="u">
			<ul data="${u.id}" style="height: 35px">
				<span style="color: #666666; width: 150px; text-align: center; display: inline-block; float: left; line-height: 35px">${u.userName}</span>
				<span style="color: #666666; width: 150px; text-align: center; display: inline-block; float: left; line-height: 35px">
				<button data="${u.id}"  style="height: 30px;background-color: #57C6D4;border: none"class="recordLog" att="${u.userName}" ><p style="color: #fff">查看提现记录</p></button></span>
			</ul>

		</c:forEach>
<br/>
		<c:choose>
			<c:when test="${pager.pageNumber<=1}">
				<a
					href="${pageContext.request.contextPath}/withDraw/toWaitWithdrawLog?curPage=1">上一页</a>
			</c:when>
			<c:otherwise>
				<a
					href="${pageContext.request.contextPath}/withDraw/toWaitWithdrawLog?curPage=${pager.pageNumber-1}">上一页</a>
			</c:otherwise>
		</c:choose>
		&nbsp; 当前页${pager.pageNumber}&nbsp; 
		<c:choose>
			<c:when test="${pager.pageNumber>=pager.pageCount}">
				<a
					href="${pageContext.request.contextPath}/withDraw/toWaitWithdrawLog?curPage=${pager.pageCount}">下一页</a>
			</c:when>
			<c:otherwise>
				<a
					href="${pageContext.request.contextPath}/withDraw/toWaitWithdrawLog?curPage=${pager.pageNumber+1}">下一页</a>
			</c:otherwise>
		</c:choose>
		<form action="${pageContext.request.contextPath}/withDraw/toWaitWithdrawLog">跳转至<input type="text" style="width: 50px" value="" name="curPage"
				id="curPage" onkeyup="value=value.replace(/[^\d]/g,'')">页 <input
				type="submit" value="跳转" id="submit" style="width: 50px;height:23px;background-color: #57C6D4;color: #fff"/>
		</form>
	</div>
	
	<div style="margin-top:20px;margin-left:20px">
		<p style="font-size: 20px">当前用户:</p>
		<p style="color: green; font-size:20px;margin-left: 100px;margin-top: -25px" id="curUserName"></p>
	</div>

	<div class="withdraw" style="display: block; width:1300px; margin-top: 10px; margin-left:20px">
		<div class="condition">
			<p>
				日期范围&nbsp;&nbsp;<input type="text" placeholder='请输入查询时间'
					readonly="readonly" onclick="WdatePicker({dateFmt:'yyyy-MM-dd'})"
					class="Wdate" id="dateStart2" style="text-align: center">
				&nbsp;至&nbsp; <input type="text" placeholder='请输入查询时间'
					readonly="readonly" onclick="WdatePicker({dateFmt:'yyyy-MM-dd'})"
					class="Wdate" id="dateEnd2" style="text-align: center;">
				<button id="setStateList">查询</button>
			</p>
		</div>
		<div class="watercourse selec2" style="width:1300px;">
			<h6>
				<span>时间</span> <span>提现金额(元)</span> <span>收款人</span> <span>提现账号</span>
				<span>开户银行</span> <span>支行名称</span> <span>提现状态</span><span>操作</span>
			</h6>
			<ul id="accountRecordLog"></ul>
		</div>
	</div>
	<div class="editFloa" style="display: none; position: fixed; top: 500px; left: 1000px">
		<input id="resason" class="cloudnums" type="text" class="Wdate" placeholder="请输入原因" style="margin-left: 20px; text-align: center;">
		<p>
			<button class="btnnum" style="margin-left: 28px">确定</button>
			<button class="btn">取消</button>
		</p>
	</div>

</body>
<script type="text/javascript">
//18513037030
	var userId = "";
	$(function() {
		$(".btn").click(function() {
			$('.editFloa').css("display", "none");
			$('.cloudnums').val("");
			});
		$(".barcontainer").hide();
		// 用户信息下拉菜单
		$('.admin').click(function() {
			var str = $('.menu').css('display');
			//alert(str)
			if (str == 'none') {
				$('.menu').css('display', 'block');
			} else {
				$('.menu').css('display', 'none');
			}
		});
		// 退出按钮
		$('.menu > li.exit').click(function() {
			window.location.href = ctx + "/logOut";
		});
		$("#submit").click(function() {
			var zong = parseInt($("#zong").text());
			if ($("#zong").text() == "") {
				$("#curPage").val(1);
			} else {
				var val = parseInt($("#curPage").val());
				if (val >= zong) {
					val = zong;
					$("#curPage").val(val);
				}
			}
		});
		recordLog();
	});
	//点击获得待提现列表
	function recordLog() {
		$(".recordLog").click(function() {
			var n = $(".recordLog").index(this);
			var logId = $(".recordLog").eq(n).attr("data");
			var username = $(".recordLog").eq(n).attr("att");
			$("#curUserName").text(username);
			withdrawStateLists(logId);
			//设置全局变量userId
			userId = logId;
			 
		});

	}
	//待提现列表
	var withdrawStateLists = function(n) {
		var startTime = $('#dateStart2').val(), //开始日期
		endTime = $('#dateEnd2').val();//结束日期
	     	$.ajax({
					url : ctx + "/withDraw/getUserAccountLogInfos",
					type : "POST",
					data : {
						startTime : startTime,
						endTime : endTime,
						curPage : 1,//当前
						pageSize : 20,
						userId : n
					},
					success : function(data) {
						eval("data=" + data);
						if (data.code == 200) {

							var htmls = '';
							for (var i = 0, len = data.data.length; i < len; i++) {
								if (data.data[i].withdrawState == 0) {

									htmls += '<li>'
											+ '<span>'
											+ data.data[i].createTime
											+ '</span>'
											+ '<span>'
											+ parseInt(data.data[i].withdrawMoney * 100)/ 100
											+ '</span>'
											+ '<span>'
											+ data.data[i].accountName
											+ '</span>'
											+ '<span>'
											+ data.data[i].bankCardNum
											+ '</span>'
											+ '<span>'
											+ data.data[i].bankDeposit
											+ '</span>'
											+ '<span>'
											+ data.data[i].branchName
											+ '</span>'
											+ '<span style="color:#6bbdec">审核中<i></i></span>'
											+ '<span><button class="pass" data='+data.data[i].id+' style="background-color: #57C6D4;border: none;color:#fff">通过</button><button class="nopass" data='+data.data[i].id+' style="height: 30px;background-color: #57C6D4;border: none;color:#fff;margin-left: 10px">未通过</button></span>'
											+ '</li>';
								} else {
									htmls += '<li>'
											+ '<span>'
											+ data.data[i].createTime
											+ '</span>'
											+ '<span>'
											+ parseInt(data.data[i].withdrawMoney * 100)
											/ 100
											+ '</span>'
											+ '<span>'
											+ data.data[i].accountName
											+ '</span>'
											+ '<span>'
											+ data.data[i].bankCardNum
											+ '</span>'
											+ '<span>'
											+ data.data[i].bankDeposit
											+ '</span>'
											+ '<span>'
											+ data.data[i].branchName
											+ '</span>'
											+ '<span style="color:#d25e5e">审核未通过（<i class="why">原因</i>）</span>'
											+ '<p class="cause">'
											+ data.data[i].notPassResason
											+ '</p>' + '</li>';
								}
							}
							$('#accountRecordLog').html(htmls);
							addResason();
							addFailResason();
							setStateList();
							/**
							 *数据渲染上之后绑定hover事件
							 */
							$('.why').hover(
									function() {
										var n = $('.why').index(this);
										$('.cause').css('display', 'none')
												.eq(n).css('display', 'block');
									}, function() {
										$('.cause').css('display', 'none');
									});
						} else {
							alert("暂无数据");
							$('.selec2>ul>li').remove();
						}
					},
					error : function() {

					}
				});
	};
	//添加失败原因
	function addResason() {
		$('.pass').click(function() {
			var a = $('.pass').index(this);
			var lgId = $('.pass').eq(a).attr("data");
			$.ajax({
				type : "post",
				url : ctx + "/withDraw/updateRecordResasonAndState",
				data : {
					state : 1,
					userId : userId,
					accountLogId : parseInt(lgId),

				},
				success : function(data) {
					eval("data=" + data);
					if (data.code == 200) {
						alert("成功,若没有打款请及时打款");
						withdrawStateLists(userId);
					} else {
						alert("失败,请联系商家");
					}
				}
			});
		});
	};
	//确定失败原因输入
	function addFailResason() {
		$('.nopass').click(function() {
			var a = $('.nopass').index(this);
			var lgId = $('.nopass').eq(a).attr("data");
			$(".editFloa").css("display", "block");
			addResasonOk(userId, lgId);

		});
	};
	//添加失败原因
	function addFailRes(userId, lgId, failResason) {
		$.ajax({
			type : "post",
			url : ctx + "/withDraw/updateRecordResasonAndState",
			data : {
				state : 2,
				userId : userId,
				accountLogId : parseInt(lgId),
				failResason : failResason,
			},
			success : function(data) {
				eval("data=" + data);
				if (data.code == 200) {

					$(".editFloa").css("display", "none");
					withdrawStateLists(userId);
				} else {
					alert("操作失败");
				}
			}
		});
	}
	//点击添加失败原因确定的时候调用
	function addResasonOk(userId, lgId, failResason) {
		$('.btnnum').click(function() {
			var failResason = $('.cloudnums').val();
			if (failResason == "") {
				return false;
			} else {
				$('.cloudnums').val("");
				addFailRes(userId, lgId, failResason);
			}
		});
	}
	//待提现记录查询按钮失败按钮
	function setStateList() {
		$('#setStateList').click(function() {
			withdrawStateLists(userId);
		});
	}

 
</script>
<script type="text/javascript"
	src="${publicPath}/My97DatePicker/WdatePicker.js?<%=getTimestamp%>"></script>
</html>