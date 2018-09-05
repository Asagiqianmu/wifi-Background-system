/**
 * 优惠券
 */

// 获取当天日期
var d = new Date();
var year = d.getFullYear();
var mon = d.getMonth() + 1;
if (mon < 10) {
	mon = "0" + mon;
}
var day = d.getDate();
if (day < 10) {
	day = "0" + day;
}
var myDate = year + "-" + mon + "-" + day;
//$("#dateStart").attr("data-date", myDate);
//$("#dateEnd").attr("data-date", myDate);

$("#startTime").attr("value", myDate);// 开始时间赋值
$("#endTime").attr("value", myDate);// 结束时间赋值

$(function() {

	// --------------------左侧菜单---------------------------//
	$("#webManage").addClass("active");
	var flag = 1;
	$("#webManage").css("margin-bottom", "0px");
	$("#webManage").find("a").css("border-radius", "5px 5px 0px 0px");
	$("#webManage").click(function() {
		if (flag == 1) {
			$("#webManage").css("margin-bottom", "4px");
			$("#webManage").find("a").css("border-radius", "5px 5px 5px 5px");
			flag = 2;
		} else {
			$("#webManage").css("margin-bottom", "0px");
			$("#webManage").find("a").css("border-radius", "5px 5px 0px 0px");
			flag = 1;
		}
		$("#sAuth").toggle();
		$("#sDecorate").toggle();
		$("#sApply").toggle();
	});
	// --------------------左侧菜单---------------------------//

	// 初始化，左侧菜单中“设备管理”选中状态
	$("#sApply").addClass("active");

	// -------------------------------------------▼优惠券检阅模块▼--------------------------------------------//

	// 辅助页面隐藏
//	$(".reviewOperate").hide();
	// "立即检阅"按钮，click事件
//	$(".goConsumBtn").click(function() {
//		$(".reviewOperate").hide();
//		$("#couponDetail").fadeIn();
//	});

//	$(".cancelCouponDetailBtn").click(function() {
//		$("#couponDetail").fadeOut();
//	});

//	$(".doReviewCouponBtn").click(function() {
//		$("#couponDetail").fadeOut();
//		$("#reviewList").fadeIn();
//	});
	// -------------------------------------------▲优惠券检阅模块▲-------------------------------------------//

	// -------------------------------------------▼优惠券管理模块▼--------------------------------------------//
	// 辅助页面隐藏
//	$(".manageOperate").hide();
	// "新增优惠券"按钮，click事件
	$(".toAddCouponBtn").click(function() {
		$("#cManage").hide();
		$("#addCoupon").fadeIn();
		$("#couponExplainSelect").val("0");
		changeCouponExplain();
		$("#cpTitle").val("");
//		$("#couponType").val("");
		$("#couponDiscount").val("");
		$("#couponAmont").val("");
		$("#startTime").val("");
		$("#endTime").val("");
		$("#couponNums").val("");
		$("#cpRules").val("");
		$("#couponExplain").val("");
		$("font").each(function(){
			$(this).text('');
		});
		
	});
	// 回到优惠券管理列表，click事件
	$(".toManageListBtn").click(function() {
		getSelfTab(1);
	});
	// "暂停投放"按钮，click事件
	$(".toStopCouponBtn").click(function() {
		$("#manageList").fadeOut();
		$("#stopCoupon").fadeIn();
		// 并将原来数据显示
	});
	// "继续投放"按钮，click事件
	$(".toStartCouponBtn").click(function() {
		alert("投放成功");
	});
	// "加券"按钮，click事件
	$(".toAddCouponNumBtn").click(function() {
		$("#manageList").fadeOut();
		$("#addCouponNum").fadeIn();
	});
	// 返回店铺应用click事件
	$(".toApplyMainBtn").click(function() {
		window.location.href = "../appManage/gotoAppStore";
	});
	// -------------------------------------------▲优惠券管理模块▲-------------------------------------------//

	// -------------------------------------------▼新增优惠券模块▼--------------------------------------------//
	// 日历控件设置
	$('.form_datetime').datepicker({
		format : 'yyyy-mm-dd',
		 autoclose: true
	});
	
	$('#startTime').datepicker().on('changeDate', function(ev) {
		checkDateIsOk($('#startTime').val(),$('#endTime').val(), 'date');
	});
	
	
	$('#endTime').datepicker().on('changeDate', function(ev) {
		checkDateIsOk($('#startTime').val(),$('#endTime').val(), 'date');
	});
	// 初始化优惠券类型
	//initCouponType();
	// 初始化优惠券使用说明
	initCouponExplain();
	// 使用说明，选择不同模板，触发事件
	$("#couponExplainSelect").change(function() {
		changeCouponExplain();
	});
	// 初始化，折扣额度隐藏
	$("#couponDiscountDiv").hide();

	// 优惠券类型，选择不同类型，出现相对于的折扣、金额
	$("#couponType").change(function() {
		changeCouponTypen();
	});
	// "保存"按钮，click事件
	$(".doSaveAddCouponBtn").click(function() {
//		$("#addCoupon").fadeOut();
//		$("#manageList").fadeIn();
		
//		var flag=checkAddCoupon();
//		if(!flag){
//			toastr.error("信息填写错误！");
//			return ;
//		}
		
		
		doAddCoupon();
		
	});
	// -------------------------------------------▲新增优惠券模块▲-------------------------------------------//

	// -------------------------------------------▼暂停优惠券模块▼--------------------------------------------//
	// "确认暂停"click事件
	$(".doStopCouponBtn").click(function() {
		doCouponManage($("#stopCouponId").val(),"stopUse",0);
	});
	// -------------------------------------------▲暂停优惠券模块▲-------------------------------------------//

	// -------------------------------------------▼加券模块▼--------------------------------------------//
	// "保存"click事件
	$("#addNumButton").click(function() {
		var flag = checkAddNumCoupon(1);
		if (!flag) {
			return false;
		}
		doCouponManage($("#addNumCouponId").val(),"addNum",$("#plusNum").val());
	});
	// -------------------------------------------▲加券模块▲-------------------------------------------//
	$("#proof").keyup(
			function() {
				if(!checkInput(document.getElementById("proof"), 0, reg1)){
					$("#proofError").html("<font color='red'>请输入数字！</font>");
				}else{
					$("#proofError").html("");
				}
			});
	getCouponUsedLog(1);//获取优惠券使用记录
});

// -------------------------------------------▼新增优惠券模块▼--------------------------------------------//

// 初始化优惠券类型
//function initCouponType() {
//	// 优惠券类型
//	var couponType = [ {
//		"id" : 2,
//		"name" : "代金券",
//	}, {
//		"id" : 3,
//		"name" : "优惠券",
//	}, {
//		"id" : 1,
//		"name" : "折扣券",
//	} ];
//	var couponSelect = $("#couponType");
//	couponSelect.empty();
//	for (var i = 0; i < couponType.length; i++) {
//		var param = couponType[i];
//		var option = $("<option>").val(param['id']).text(param['name'])
//				.appendTo(couponSelect);
//		
//	}
//	$("#couponType").val(3);
//}

// 初始化优惠券使用说明
function initCouponExplain() {
	// 使用说明下拉列表内容
	var couponExplainJson = [ {
		"key" : "0",
		"value" : "选择模板",
		"content" : "如果您在本店购买后发生退款行为，本店只退还您交易中实际支付的金额，优惠券金额不退回"
	}, {
		"key" : "1",
		"value" : "限店使用",
		"content" : "此优惠券仅限本店使用"
	}, {
		"key" : "2",
		"value" : "酒水除外",
		"content" : "海鲜类、酒水饮料、特价菜除外"
	}, {
		"key" : "3",
		"value" : "限每桌",
		"content" : "此券每桌每次限用一张，不可累计使用"
	}, {
		"key" : "4",
		"value" : "需预约",
		"content" : "优惠券使用需提前电话预约"
	}, {
		"key" : "5",
		"value" : "不同享",
		"content" : "两优惠不同时享用"
	}, {
		"key" : "6",
		"value" : "限堂吃",
		"content" : "限堂吃，不打包，不外卖，不兑现金"
	}, {
		"key" : "7",
		"value" : "不累计",
		"content" : "不可累计使用"
	}, {
		"key" : "8",
		"value" : "日限",
		"content" : " 本活动周一至周四全天使用，周五至周日全天不得使用 "
	}, {
		"key" : "9",
		"value" : "时限",
		"content" : " 限晚市使用，不得与其他优惠共享 "
	}, {
		"key" : "10",
		"value" : "提前出示",
		"content" : " 需点单前出示 "
	} ];
	var select = $("#couponExplainSelect");
	select.empty();
	for (var i = 0; i < couponExplainJson.length; i++) {
		var param = couponExplainJson[i];
		var option = $("<option>").val(param['key']).text(param['value']).attr(
				"marker", param['content']).appendTo(select);
	}
}

// 改变优惠券使用说明
function changeCouponExplain() {
	var id = $("#couponExplainSelect").val();
	$("#couponExplain").val("");
	var content = $("#couponExplainSelect").find("option[value=" + id + "]")
			.attr("marker");
	if ("0" == id) {
		$("#couponExplain").attr("placeholder", content).text("");
	} else {
		$("#couponExplain").val(content);
	}
}
// 改变优惠券类型
function changeCouponTypen() {
	var _this = $("#couponType").val();
	$("#couponDiscount").val("");
	$("#couponAmont").val("");
	switch (_this) {
	case "1":// 折扣券
		$("#couponAmontDiv").hide();
		$("#couponDiscountDiv").show();
		break;
	default:// 代金券，优惠券
		$("#couponAmontDiv").show();
		$("#couponDiscountDiv").hide();
		break;
	}
}

// -------------------------------------------▲新增优惠券模块▲-------------------------------------------//

//获取优惠券使用纪录
function getCouponUsedLog(num){
	if(num==undefined)return;
	if(isNaN(num))return;
	$("#couponDetail").hide();//查看消费优惠券div隐藏
	$.ajax({
		type : "POST",
		async:false,
		url : "./getCouponUsedLogList" ,
		data:{
			curPage:num,
			pageSize:5
		},
		success:function(data) {
			eval("data = " + data);
			if(data.code==200){
				//调用分页
				pageHandle("proofPagLook","couponLogUsedlist",data,num,getCouponUsedLog,showCouponLogtTable);
				$("#cManage").hide();
				$("#addCoupon").hide();
//				$("#manageCouponListTable").hide();
			}else{
				toastr.error('没有查询到优惠券');
				$("#reviewList").hide();//隐藏表头
			}
		},
		error : function(XMLHttpRequest, textStatus, errorThrown) {
			toastr.error('数据获取失败');
			$("#reviewList").hide();
		}
	});
}
function showCouponLogtTable(data,tableId){
	data=data.data;
	var table="";
	for(var i=0;i<data.length;i++){//data[i].
		table+="<tr>" +
			"<td>"+data[i].schedule+"</td>"+
//			"<td onmouseover='javascript:bundLayer(\""+data[i].title+"\",this);' onmouseout='layer.closeAll();'>"+subStr8(data[i].title)+"</td>"+
			"<td>"+subStr(data[i].title)+"</td>"+
			"<td>"+data[i].type+"</td>"+
			"<td>"+(data[i].rules==1?"折扣券":(data[i].rules==2?"代金券":"优惠券"))+"</td>"+
			"<td>"+data[i].reciveNum+"&nbsp;&nbsp;(元/折)</td>"+
			"<td>"+data[i].start_end+"</td>"+
			"<td>"+data[i].remaing+"</td>";
		table+="</tr>";
	}
	$("#"+tableId).html(table);
	
	if(table.indexOf("<td>")==-1){
		$("#reviewList").hide();
	}else{
		$("#reviewList").show();
	}
	
	
	$('.tooltipMsg').tooltip();
	
}

function subStr(str){
	if(str.length<6){return str;}
	return "<span data-toggle='tooltip' class='tooltipMsg' title='"+str+"'>"+ str.substring(0,4)+"..."+"</span>";
}

//消费优惠券
function proofCoupon() {
	var now=new Date().getTime();
	$("#doUseCoupon").attr("disabled",true);//重置按钮为不可用
	
	if(!checkInput(document.getElementById("proof"), 1, reg1)){
		$("#proofError").html("<font color='red'>请输入数字！</font>");
		$("#proof").focus();
		return false;
	}else{
		$("#proofError").html("");
	}

	$.ajax({
		type : "post",
		url : "./getOneReciveLog",
		data:{
			couponNum:$('#proof').val()
		},
		success : function(data) {
			if ("" != data) {
				eval("data = " + data);
				if(data.code==200){
					// 弹出“checkCoupon”提示弹框
					
					$("#reviewList").hide();
					$("#couponDetail").fadeIn();
					
//					$('#checkCoupon').modal({backdrop : 'static'});
	//				reloadTable(data);// 动态刷新表格数据doUseCouponId
					//data.data[0].
					var b=false;
					$("#doUseCouponId").val(data.data[0].id);
					$("#couponTitleCheck").html(data.data[0].cp.title);
					$("#typeNameCheck").html(data.data[0].cp.coupontypeId==1?"折扣券":(data.data[0].cp.coupontypeId==2?"代金券":"优惠券"));
					$("#couponDiscountCheck").html(data.data[0].cp.couponAmont!=0?data.data[0].cp.couponAmont+"&nbsp;元":data.data[0].cp.couponDiscount+"&nbsp;折");
					$("#startTimeCheck").html((parseInt(data.data[0].cp.activityStart.year)+1900)+"-"+(parseInt(data.data[0].cp.activityStart.month)+1)+"-"+parseInt(data.data[0].cp.activityStart.date));
					$("#endTimeCheck").html((parseInt(data.data[0].cp.activityEnd.year)+1900)+"-"+(parseInt(data.data[0].cp.activityEnd.month)+1)+"-"+parseInt(data.data[0].cp.activityEnd.date));
					$("#couponRulesCheck").html(data.data[0].cp.couponRules);
					$("#couponInfoCheck").html(data.data[0].cp.couponInfo);
					
					$("#userTel").html(data.data[0].telNum);
					$("#reciveDate").html((parseInt(data.data[0].receiveTime.year)+1900)+"-"+(parseInt(data.data[0].receiveTime.month)+1)+"-"+parseInt(data.data[0].receiveTime.date));
					$("#useDate").html(data.data[0].applyTime!=null?((parseInt(data.data[0].applyTime.year)+1900)+"-"+(parseInt(data.data[0].applyTime.month)+1)+"-"+parseInt(data.data[0].applyTime.date)):"");
					$("#couponLogId").html(data.data[0].id);
					
					if(now<parseInt(data.data[0].cp.activityStart.time)){
//						$("#couponCheckResult").attr("class","text-danger");
						$("#couponCheckResult").html("<span style='color:red;'>未到优惠券使用期！请耐心等待~~~</span>");
						}else if(now>parseInt(data.data[0].cp.activityEnd.time)){
//							$("#couponCheckResult").attr("class","text-danger");
							$("#couponCheckResult").html("<span style='color:red;'>该优惠券已过期，不能使用！<span>");
							}else if(data.data[0].applyTime!=null){
//								$("#couponCheckResult").attr("class","text-danger");
								$("#couponCheckResult").html("<span style='color:red;'>该优惠券已使用过！<span>");
								}else{
									$("#couponCheckResult").attr("class","text-success");
									$("#couponCheckResult").html("<span style='color:#2EAFBB;'>该优惠券可以使用！<span>");
									$("#doUseCoupon").attr("disabled",false);
								}
				}else{
					toastr.error(data.msg);
				}
			} else {
				toastr.error('未获取到优惠券领取记录');
			}
		},
		error : function(XMLHttpRequest, textStatus, errorThrown) {
			toastr.error(errorThrown);
		}
	});
}

function doUseCouponFunc(){
		$.ajax({
			type : "post",
			url : "./doUseCoupon",
			data:{
				couponLogId:$("#doUseCouponId").val()
			},
			success : function(data) {
					eval("data = " + data);
					if(data.code==200){
						toastr.success("优惠券使用成功！");
						setTimeout('getCouponUsedLog(1)',500);
					}else{
						toastr.error("优惠券使用失败！请重新登录再试.");
					}
			},
			error : function(XMLHttpRequest, textStatus, errorThrown) {
				toastr.error("优惠券使用失败！");
			}
		});
		
}


//优惠券管理，获取优惠券发布记录
function getSelfTab(num){
	if(num==undefined)return;
	if(isNaN(num))return;
	$.ajax({
		type : "POST",
		async:false,
		url : "./getCouponList",
		data:{
			curPage:num,
			pageSize:5
		},
		success:function(data) {
			eval("data = " + data);
			if(data.code==200){
				//调用分页
				pageHandle("couponPag","couponTable",data,num,getSelfTab,getTableHTML);
//				setTimeout(function(){
					$("#cManage").show();
					$("#stopCoupon").hide();
					$("#addCouponNum").hide();
					$("#addCoupon").hide();
//				},1000);
				
			}else{
				toastr.error('没有查询到优惠券');
				$("#manageCouponListTable").hide();
			}
		},
		error : function(XMLHttpRequest, textStatus, errorThrown) {
			toastr.error('数据获取失败');
			$("#manageCouponListTable").hide();
		}
	});
}
function getTableHTML(data,tableId){
	data=data.data;
	var table="";
	for(var i=0;i<data.length;i++){//data[i].
		//dt[i]=data[i].rules;
		table+="<tr><td>"+data[i].type+"</td>"+
			"<td>"+data[i].num+"</td>"+
			"<td><span class=\"text-danger\">"+data[i].reciveNum+"</span>&nbsp;/&nbsp;<span class=\"text-success\">"+data[i].remaing+"</span></td>"+
			"<td>"+subStr(data[i].title)+"</td>"+
			"<td>"+subStr(data[i].rules)+"</td>"+
			"<td>"+data[i].start_end+"</td>";
		
		if(data[i].status==1){
			table+="<td><span class=\"label label-success\">投放中</span></td>";
		}else if(data[i].status==2){
			table+="<td><span class=\"label label-warning\">暂停中</span></td>";
		}else{
			table+="<td><span class='label label-inverse'>已结束</span></td>";
		}
		table+="<td><div class='btn-group'><button data-toggle='dropdown' class='btn dropdown-toggle'>"+
					"更多设置<span class='caret'></span></button><ul class='dropdown-menu'>";
		
		if(data[i].status==1){//停止发放/加券onclick=\"toStopUse("+data[i].id+")\"  onclick=\"toAddCouponNum("+data[i].id+")\"
			table+="<li>" +
					"<a href='javascript:;' class='toStopCouponBtn' onclick=\"toStopUse("+data[i].id+")\"><i class='icon-stop'></i> 暂停投放</a> " +
					//暂时屏蔽加券功能，因为优惠券记录里有个订单号。改变了的话会影响优惠券显示
//					"<a href='javascript:;' class='toAddCouponNumBtn' onclick=\"toAddCouponNum("+data[i].id+")\"><i class='icon-arrow-up'></i> 加券</a>" +
					"</li>";
		}else if(data[i].status==2){//继续发放/加券onclick=\"toStartUse("+data[i].id+")\"  onclick=\"toAddCouponNum("+data[i].id+")\"
			table+="<li>" +
					"<a href='javascript:;' class='toStartCouponBtn' onclick=\"toStartUse("+data[i].id+")\"><i class='icon-play'></i> 继续投放</a> " +
					//暂时屏蔽加券功能，因为优惠券记录里有个订单号。改变了的话会影响优惠券显示
//					"<a href='javascript:;' class='toAddCouponNumBtn' onclick=\"toAddCouponNum("+data[i].id+")\"><i class='icon-arrow-up'></i> 加券</a>" +
					"</li>";
			
		}else{//重新使用/删除onclick=\"toRepeatUse("+data[i].id+")\"
			table+="<li><a href='javascript:;' class='toRepeatCouponBtn' onclick=\"toRepeatUse("+data[i].id+")\"><i "+
					"class='icon-repeat'></i> 重新使用</a></li>";
		}
		table+="</ul></div></td></tr>";
	}
	$("#"+tableId).html(table);
	if(table.indexOf("<td>")==-1){
		$("#manageCouponListTable").hide();
	}else{
		$("#manageCouponListTable").show();
	}
	
	$('.tooltipMsg').tooltip();//初始化tips
	
}

function toStopUse(id){
	$("#cManage").hide();
	$("#stopCoupon").fadeIn();
	$("#stopCouponId").val(id);// 给隐藏域赋予该条数据ID
}

function toStartUse(id){
	doCouponManage(id,"recoverUse",0);
}

function toAddCouponNum(id){
	$("#cManage").hide();
	$("#addNumCouponId").val(id);
	$.ajax({
		type : "POST",
		async:false,
		url : "./getCoupon" ,
		data:{
			id: id
		},
		success:function(data) {
			eval("data = " + data);
			if(data.code==200){
				$("#adnCouponName").html(data.data.title);
				$("#adnType").html(data.data.coupontypeId==1?"折扣券":(data.data.coupontypeId==2?"代金券":"优惠券"));
				$("#adnMount").html(data.data.couponAmont!=0?data.data.couponAmont+"&nbsp;元":data.data.couponDiscount+"&nbsp;折");
				$("#adnRules").html(data.data.couponRules);
				$("#adnInfo").html(data.data.couponInfo);
				$("#adnStartEnd").html((parseInt(data.data.activityStart.year)+1900)+"-"+(parseInt(data.data.activityStart.month)+1)+"-"+parseInt(data.data.activityStart.date)+"&nbsp;至&nbsp;"+
						(parseInt(data.data.activityEnd.year)+1900)+"-"+(parseInt(data.data.activityEnd.month)+1)+"-"+parseInt(data.data.activityEnd.date));
				$("#adnNum").html(data.data.couponNum+"&nbsp;张");
				$("#adnRecive").html((data.data.couponNum-data.data.remainingNum)+"&nbsp;张");
				$("#addCouponNum").fadeIn();
			}else{
				toastr.error(data.msg);
			}
		},
		error : function(XMLHttpRequest, textStatus, errorThrown) {
			toastr.error('操作失败，请稍后再试');
		}
	});
	
}


/**
 * 修改优惠券状态
 * @param id
 * @param method
 * @param num
 */
function doCouponManage(id,method,num){//非添加数量方法时num为0
	$.ajax({
		type : "POST",
		async:false,
		url : "./couponManage" ,
		data:{
			couponId: id,
			method: method,
			num: num
		},
		success:function(data) {
			eval("data = " + data);
			if(data.code==200){
				toastr.success(data.msg);
			}else{
				toastr.error(data.msg);
			}
		},
		error : function(XMLHttpRequest, textStatus, errorThrown) {
			toastr.error('操作失败，请稍后再试');
		}
	});
	//刷新分页
	getSelfTab(1);
}

function checkAddNumCoupon(type){
	// 优惠券数量
	var couponNumFlag = checkInput($("#plusNum")[0],type, reg4,str4);
//	if (couponNumFlag) {
//		$("#plusNumError").html("");
//		return true;
//	} else {
//		$("#plusNumError").html("<font color='red'>请输入数字，不能超过10000</font>");
//		return false;
//	}
	return couponNumFlag;
	
}

function toRepeatUse(id){
	$.ajax({
		type : "POST",
		async:false,
		url : "./getCoupon" ,
		data:{
			id: id
		},
		success:function(data) {
			eval("data = " + data);
			if(data.code==200){
				$("#cpTitle").val(data.data.title);
				$("#couponType").val(data.data.coupontypeId);
				$("#couponDiscount").val(data.data.couponDiscount);
				$("#couponAmont").val(data.data.couponAmont);
//				$("#startTime").val((parseInt(data.data.activityStart.year)+1900)+"-"+(parseInt(data.data.activityStart.month)+1)+"-"+parseInt(data.data.activityStart.date));
//				$("#endTime").val((parseInt(data.data.activityEnd.year)+1900)+"-"+(parseInt(data.data.activityEnd.month)+1)+"-"+parseInt(data.data.activityEnd.date));
				$("#couponNums").val(data.data.couponNum);
				$("#cpRules").val(data.data.couponRules);
				$("#couponExplain").val(data.data.couponInfo);
				
				$("#cManage").hide();
				$("#addCoupon").fadeIn();
				$("font").each(function(){
					$(this).text('');
				});
			}else{
				toastr.error(data.msg);
			}
		},
		error : function(XMLHttpRequest, textStatus, errorThrown) {
			toastr.error('操作失败，请稍后再试');
		}
	});
}

//创建优惠券之前校验
function checkAddCoupon() {
	//优惠券名称
	var couponTitleFlag=checkInput($("#cpTitle")[0],1,reg5,str5);
	// 折扣额度校验
	var couponDiscountFlag = checkInput($("#couponDiscount")[0],1,reg2,str2 );
	// 优惠金额校验
	var couponAmontFlag = checkInput($("#couponAmont")[0],1,reg3,str3 );
	// 时间空值校验
	var dateDiv = $("#dateError");
	var dateFlag = false;
	var startTimeFlag = checkDateInput($("#startTime"),"date" );
	var endTimeFlag = checkDateInput($("#endTime"), "date");
	var dateEq=checkDateIsOk($("#startTime").val(),$("#endTime").val(), "date");
	
	if (endTimeFlag && startTimeFlag&&dateEq) {
		dateFlag = true;
		dateDiv.text("");
	} else {
		dateFlag = false;
		//dateDiv.text("日期不符合要求");
	}
	// 优惠券数量
	var couponNumFlag = checkInput($("#couponNums")[0],1,reg4,str4);
	// 优惠券使用规则
	var couponRulesFlag = checkInput($("#cpRules")[0],1,reg5,str5);
	// 优惠券使用说明
	var couponInfoFlag = checkInput($("#couponExplain")[0],1,reg6,str6);
	
	var _type = $("#couponType").val();
	if ("1" == _type) {// 折扣券
		if (couponDiscountFlag && dateFlag && couponNumFlag && couponRulesFlag&&couponTitleFlag
				&& couponInfoFlag) {
			return true;
		} else {
			return false;
		}
	} else {// 其它券
		if (couponAmontFlag && dateFlag && couponNumFlag && couponRulesFlag&&couponTitleFlag
				&& couponInfoFlag) {
			return true;
		} else {
			return false;
		}
	}

}

/**
 * 计算优惠券发送短信冻结款
 */
function caculateMessRePay(){
	var buyNum=$("#couponNums").val();
	if(isNaN(buyNum)){//不是数字
		$("#messRePay").text(0);
		return;
	}
	$("#messRePay").text(buyNum/10);
//	var data="success#123456";
//	alert(data.substring(8));
//	setTimeout("window.location.href='"+ctx+"/appManage/gotoCashier?orderNum="+data.substring(8)+"';",500);
}

function doAddCoupon(){
	var flag = checkAddCoupon();
	caculateMessRePay();//计算优惠券发送短信冻结款
	if (!flag) {
		return false;
	}
	// 弹框隐藏
	//$('#addCoupon').modal("hide");
//	$("#saveCouponbb:)" +
	document.getElementById("saveCouponbb").disabled=true;
	// ajax 执行true，成功，false，失败
	$.ajax({
		type : "post",
		url : "./addCoupon",
		data:{
			title:$("#cpTitle").val(),
			coupontypeId:$("#couponType").val(),
			couponDiscount:$("#couponDiscount").val(),
			couponAmont:($("#couponAmont").val()==""?0:$("#couponAmont").val()),
			activityStart:$("#startTime").val(),
			activityEnd:$("#endTime").val(),
			couponNum:$("#couponNums").val(),
			remainingNum:$("#couponNums").val(),
			couponRules:$("#cpRules").val(),
			couponInfo:$("#couponExplain").val()
//			repayMoney:$("#messRePay").text()
		},
		success : function(data) {
			if (data.indexOf("success")!=-1) {
//				getSelfTab(1);//调用分页方法
				setTimeout("toastr.success('创建成功');",500);
				setTimeout("window.location.href='"+ctx+"/appManage/gotoCashier?orderNumber="+data.substring(8)+"';",800);
			} else {
				toastr.error('创建失败,请重新登录！');
			}
//			document.getElementById("saveCouponbb").disabled=false;
			setTimeout('document.getElementById("saveCouponbb").disabled=false;',1000);
		},
		error : function(XMLHttpRequest, textStatus, errorThrown) {
			toastr.error('操作失败，请稍后再试');
		}
	});
	setTimeout('document.getElementById("saveCouponbb").disabled=false;',3000);
}










