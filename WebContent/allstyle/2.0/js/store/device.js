/**
 * 设备管理js
 */

//公共的变量
var mac200 = 0;
var haoduan = "";	//保存限速的号段
var whiteListMac = "";	//保存要删除的白名单
$(function() {

	getStoreDeviceList(1);//获取分页数据
	
	initFunc();
	// 初始化，左侧菜单中“设备管理”选中状态
	$("#device").addClass("active");
	
	// 左侧菜单：网站管理
	var flag = 1;
	$("#webManage").click(function() {
		if (flag == 1) {
			$("#webFlag").removeClass("icon-chevron-right").addClass("icon-chevron-down");
			$("#webManage").css("margin-bottom", "0px");
			$("#webManage").find("a").css("border-radius", "5px 5px 0px 0px");
			flag = 2;
		} else {
			$("#webFlag").removeClass("icon-chevron-down").addClass("icon-chevron-right");
			$("#webManage").css("margin-bottom", "4px");
			$("#webManage").find("a").css("border-radius", "5px 5px 5px 5px");
			flag = 1;

		}
		$("#sAuth").toggle();
		$("#sDecorate").toggle();
		$("#sApply").toggle();
	});
});


function initFunc(){
	// 初始化，左侧菜单中“设备管理”选中状态
	$("#device").addClass("active");
	// 初始化，设备管理的一系列操作html隐藏
	$(".deviceOperate").hide();

	// 取消按钮，返回设备管理页面
	$(".toDeviceListBtn").unbind("click");
	$(".toDeviceListBtn").click(function() {
		$(".deviceOperate").fadeOut();
		$("#deviceList").fadeIn();
	});

	// -----------------设备管理----begin-----------------//
	// “添加设备”按钮，点击显示该模块
	$(".toCreateDeviceBtn").unbind("click");
	$(".toCreateDeviceBtn").click(function() {
		$("#addStoreRouterForm")[0].reset();	//重置form
		checkAddStoreRouterForm.resetForm();	//重置验证信息，即清空验证信息
		$("#deviceList").fadeOut();
		$("#addDevice").fadeIn();
	});

	// “修改热点名称”按钮，点击显示该模块
	$(".toUpdateSsidBtn").unbind("click");
	$(".toUpdateSsidBtn").click(function() {
		var ssid = $(this).attr("title");
		$("#updateSsidForm")[0].reset();	//重置form
		checkSsidForm.resetForm();
		$("#oldSsid").text(ssid);
		$("#deviceList").fadeOut();
		$("#updateSsid").fadeIn();
	});
	
	

	// “白名单”按钮，点击显示该模块
	$(".toMacWhiteListBtn").unbind("click");
	$(".toMacWhiteListBtn").click(function() {
		$("#deviceList").fadeOut();
		$("#macWhite").fadeIn();
		
		
		getWhiteNameList(1);
	});

	// “超时时间”按钮，点击显示添加该模块
	$(".toTimeOutBtn").unbind("click");
	$(".toTimeOutBtn").click(function() {
		var timeout = $(this).attr("title");
		$("#updateTimeoutForm")[0].reset();
		checkUpdateTimeoutForm.resetForm();
		$("#oldTimeout").val(timeout);
		$("#deviceList").fadeOut();
		$("#timeout").fadeIn();
	});

	// “重启路由”按钮，点击显示添加该模块
	$(".toResetRouterBtn").unbind("click");
	$(".toResetRouterBtn").click(function() {
		$("#deviceList").fadeOut();
		$("#resetRouter").fadeIn();
	});

	// “带宽控制”按钮，点击显示添加该模块
	$(".toBandwidthBtn").unbind("click");
	$(".toBandwidthBtn").click(function() {
		$("#deviceList").fadeOut();
		$("#bandwidth").fadeIn();
		getLimitedList(1);
	});

	// “修改路由密码”按钮，点击显示添加该模块
	$(".toUpdateRouterPwdBtn").unbind("click");
	$(".toUpdateRouterPwdBtn").click(function() {
		checkPasswordForm.resetForm();
		$("#password").val("");
		$("#querenPassword").val("");
		$("#deviceList").fadeOut();
		$("#updateRouterPwd").fadeIn();
	});

	// “固件升级”按钮，点击显示添加该模块
	$(".toRouterUpgradeBtn").unbind("click");
	$(".toRouterUpgradeBtn").click(function() {
		var vers = $(this).attr("title");
		var a = new Array();
		a = vers.split(",");
//		alert("a:"+a[0]+ "," + a[1] + "," + a[2] + "," + a[3]);
		$("#curVersion").text(a[0]);
		$("#newVersion").text(a[1]);
		$("#model").val(a[2]);	//将路由器的型号保存到页面的作用域
		$("#details").text(a[3]);
		
		$("#deviceList").fadeOut();
		$("#routerUpgrade").fadeIn();
	});

	// “删除设备”按钮，点击显示添加该模块
	$(".toDeleteRouterBtn").unbind("click");
	$(".toDeleteRouterBtn").click(function() {
		$('#deleteRouter').modal({
			backdrop : 'static'
		});
	});

	// -----------------设备管理---end-----------------//

	// -----------------添加设备----begin-----------------//
	// 保存设备
	$(".doCreateDeviceBtn").unbind("click");
	$(".doCreateDeviceBtn").click(function() {
		$("#addStoreRouterForm").submit();
	});

	// -----------------添加设备----end-----------------//

	// -----------------修改热点名称----begin-----------------//
	// 保存热点名称
	$(".doUpdateSsidBtn").unbind("click");
	$(".doUpdateSsidBtn").click(function() {
		$("#updateSsidForm").submit();
	});

	// -----------------修改热点名称----end-----------------//

	// -----------------MAC白名单----begin-----------------//
	// “添加MAC白名单”按钮，点击显示添加白名单表单
	$(".toAddMacBtn").unbind("click");
	$(".toAddMacBtn").click(function() {
		$("#mac2").val("");	//跳到添加白名单前，先将文本框置空
		$("#deviceName2").val("");
		$("#macWhite").fadeOut();
		$("#addMac").fadeIn();
	});

	$(".cancelSaveMacBtn").unbind("click");
	$(".cancelSaveMacBtn").click(function() {
		$("#addWhiteListForm")[0].reset();
		checkAddWhiteListForm.resetForm();
		$("#addMac").fadeOut();
		$("#macWhite").fadeIn();
	});
	
	$(".doSaveMacBtn").unbind("click");
	$(".doSaveMacBtn").click(function() {
		$("#addWhiteListForm").submit();
//		toastr.success('保存成功');
//		$("#addMac").fadeOut();
//		$("#macWhite").fadeIn();
	});

	$(".doDeleteMacBtn").unbind("click");
	$(".doDeleteMacBtn").click(function() {
		$.ajax({
	 		type : "POST",
	 		url : ctx +"/storeRouter/deleteWhiteList",
	 		data : {
	 			mac : mac200,
	 			delMac : whiteListMac
	 		},
	 		success : function(msg) {
	 			if (msg=="true") {
	 				$("#deleteMac").modal("hide");
	 				toastr.success('白名单删除成功');
	 				
	 				getWhiteNameList(1);
	 			} else {//添加失败
	 				toastr.error('删除失败');
	 			};
	 		}
	 	}); 
	});
	// -----------------MAC白名单----end-----------------//

	// -----------------超时时间----begin-----------------//
	// 保存超时时间
	$(".doTimeoutBtn").unbind("click");
	$(".doTimeoutBtn").click(function() {
		$("#updateTimeoutForm").submit();
	});

	// -----------------超时时间----end-----------------//

	// -----------------重启路由----begin-----------------//
	// 确认重启
	$(".doResetRouterBtn").unbind("click");
	$(".doResetRouterBtn").click(function() {
		showLoading2("重启中···");
		$.ajax({
	 		type : "POST",
	 		url : ctx +"/storeRouter/resetRouter",
	 		data : {
	 			mac : mac200,
	 		},
	 		success : function(msg) {
	 			if (msg=="success") {
//					location = ctx + "/storeRouter/goDeviceManage?curPage="+curPage;
	 				//
	 				changeToSuccess(120);
	 				setTimeout(function(){
	 					$("#resetRouter").fadeOut();
	 					$("#deviceList").fadeIn();
	 				},120*1000);
	 			} else {//添加失败
	 				toastr.error('重启失败，请检测网络是否连通');
//	 				changeToError(5);
	 			};
	 		}
	 	}); 
//		toastr.success('操作成功');
//		$("#resetRouter").fadeOut();
//		$("#deviceList").fadeIn();
	});

	// -----------------重启路由----end-----------------//

	// -----------------带宽控制----begin-----------------//
	// 添加规则按钮，click事件
	$(".toAddIpBtn").unbind("click");
	$(".toAddIpBtn").click(function() {
		$("#startIp").val("");	//置空原有文本框
		$("#endIp").val("");
		$("#ipSpan").val("");
//		$("#maxUpload").val("");
//		$("#maxDownLoad").val("");
		checkAddXianSuRuler.resetForm();
		$("#addXianSuRuler")[0].reset();
		$("#bandwidth").fadeOut();
		$("#addIp").fadeIn();	//显示
	});

	// 确认保存IP规则
	$(".doSaveIpBtn").unbind("click");
	$(".doSaveIpBtn").click(function() {
		$("#addXianSuRuler").submit();
	});

	// 添加IP规则时，取消按钮，click事件
	$(".cancelSaveIpBtn").unbind("click");
	$(".cancelSaveIpBtn").click(function() {
		$("#addIp").fadeOut();
		$("#bandwidth").fadeIn();
	});
	
	// 删除弹框中，确认删除，click事件
	$(".doDeleteIpBtn").unbind("click");
	$(".doDeleteIpBtn").click(function() {
		$.ajax({
	 		type : "POST",
	 		url : ctx +"/storeRouter/delRuler",
	 		data : {
	 			mac : mac200,
	 			haoduan : haoduan	//haoduan是公共变量
	 		},
	 		success : function(msg) {//返回需有用户名、密码
	 			if (msg=="true") {//删除成功
	 				toastr.success('删除成功');
	 				getLimitedList(1);	
	 			} else {//添加失败
	 				toastr.error('删除失败');
	 			};
	 		}
	 	}); 
		
		$('#deleteIp').modal("hide");
	});

	// -----------------带宽控制----end-----------------//

	// -----------------路由密码----begin-----------------//
	// 保存路由器密码
	$(".doUpdateRouterPwdBtn").unbind("click");
	$(".doUpdateRouterPwdBtn").click(function() {
//		toastr.success('保存成功');
//		$("#updateRouterPwd").fadeOut();
//		$("#deviceList").fadeIn();
		$("#updatePasswordForm").submit();
		
	});

	// -----------------路由密码----end-----------------//

	// -----------------固件升级----begin-----------------//
	$(".doRouterUpgradeBtn").unbind("click");
	$(".doRouterUpgradeBtn").click(function() {
		var curV = $("#curVersion").text();
		var newV = $("#newVersion").text();
		if(curV==newV){
			toastr.success('已经是最新版本!');
			return false;
		}
		
		
		
		//将升级数据写到后台
		$.ajax({
	 		type : "POST",
	 		url : ctx +"/storeRouter/updateVersion",
	 		data : {
	 			mac : mac200,
	 			model : $("#model").val()
	 		},
	 		success : function(msg) {//返回需有用户名、密码
	 			if (msg=="success") {//删除成功
	 				showLoading2("升级中···");
	 				changeToSuccess(300);
	 				setTimeout(function(){
	 					$("#routerUpgrade").fadeOut();
	 					$("#deviceList").fadeIn();
	 				},300*1000);
//					location = ctx + "/storeRouter/goDeviceManage?curPage="+curPage;
	 			} else {//添加失败
	 				//hideLoading();
	 				//changeToError(3);
	 				toastr.error('服务器忙，请稍后重试');
	 			};
	 		}
	 	}); 
		
		
	});

	// -----------------固件升级----end-----------------//

	// -----------------删除设备----begin-----------------//
	$(".doDeleteRouterBtn").unbind("click");
	$(".doDeleteRouterBtn").click(function() {
		$.ajax({
	 		type : "POST",
	 		url : ctx +"/storeRouter/deleteStoreRouter",
	 		data : {
	 			mac : mac200
	 		},
	 		success : function(msg) {//返回需有用户名、密码
	 			if (msg=="success") {//删除成功
	 				toastr.success('删除成功');
	 				
					location = ctx + "/storeRouter/goDeviceManage?curPage="+curPage;
	 			} else {//添加失败
	 				toastr.error('删除失败');
	 			};
	 		}
	 	}); 
		$('#deleteRouter').modal("hide");
	});

	// -----------------删除设备----end-----------------//
}
//---------------------分页相关-----------------------//
function getStoreDeviceList(num){
	if(num==undefined)return;
	if(isNaN(num))return;
	//showLoading();
	$.ajax({
        type: "POST",
        url: "getDeviceList",
        data: {
        	curPage:num,
        	pageSize:5
        	
        },
        success: function(data){
        	//changeToSuccess(1);
        	eval("data = " + data);
        	if(data.code==200){
        		//调用分页
				pageHandle("pager","deviceTable",data.data,num,getStoreDeviceList,buildTable);
        	}else {
        		toastr.error(data.msg);
        	}
        },
        error : function() {
        	//changeToError(1);
        	toastr.error('提交失败！');
		}
    });
}


function buildTable(data,tableId){
	var table="";
	data=data.data;
	for(var i=0;i<data.length;i++){
		table += "<tr> "
				+ "<td>"+(i+1)+"</td> "
				+ "<td>"+subStr(data[i].model)+"</td> "
				+ "<td>"+data[i].authcount+"</td> "
				+ "<td>"+data[i].mac+"</td> "
				+ "<td>"+data[i].wanIp+"</td> "
				+ "<td>"+data[i].shi+"&nbsp;h&nbsp;"+data[i].fen+"&nbsp;m</td> "
				+ "<td>"+subStr(data[i].installPosition)+"</td> "
				+ "<td>"+getStatus(data[i].status)+"</td> "
				+ "<td> "
				+ "<div class='btn-group'> "
//				+ "<button data-toggle='dropdown' "
//				+ "class='btn dropdown-toggle' onclick=\"javascript:mac200='"+data[i].mac+"'\">更多设置<span class='caret'></span> "
//				+ "</button> "
//				+ "<ul class='dropdown-menu'> "
				+ getMenu(data[i])
//				+ "</ul> " 
				+ "</div> " + "</td> " + "</tr>";
	}
	$("#"+tableId).html(table);
	$('.tooltipMsg').tooltip();
	$("#deviceList").fadeIn();
	initFunc();
}

function subStr(str){
	if(str.length<6){return str;}
	return "<span data-toggle='tooltip' class='tooltipMsg' title='"+str+"'>"+ str.substring(0,4)+"..."+"</span>";
}

function getStatus(type){
	if(type==1){
		return "<span class='label label-success'>正常</span>";
	}else{
		return "<span class='label label-important'>离线</span>";
	}
}

function getMenu(data){
	if(data.status==1){
		var str= 
				"<button data-toggle='dropdown' "
				+ "class='btn dropdown-toggle' onclick=\"javascript:mac200='"+data.mac+"'\">更多设置<span class='caret'></span> "
				+ "</button> "
				+ "<ul class='dropdown-menu'><li><a href='javascript:;' class='toUpdateSsidBtn' title='"+data.ssid+"'><i class='icon-pencil'></i> 热点名称</a>  "
				+ "<a href='javascript:;' class='toMacWhiteListBtn'><i class='icon-road'></i> 白名单</a>  "
				+ "<a href='javascript:;' class='toTimeOutBtn'  title='"+data.timeout+"'><i class='icon-time'></i> 超时时间</a>   "
				+ "<a href='javascript:;' class='toResetRouterBtn'><i class='icon-refresh'></i> 重启路由</a>  "
				+ "<a href='javascript:;' class='toBandwidthBtn'><i class='icon-signal'></i> 带宽控制</a>  "
				+ "<a href='javascript:;' class='toUpdateRouterPwdBtn'><i class='icon-lock'></i> 路由密码</a>  "
				+ "<a href='javascript:;' class='toRouterUpgradeBtn' title='"+data.versions + "," + data.model + ","+ data.details + "'><i class='icon-arrow-up'></i> 固件升级</a>  "
				+ "<a href='javascript:;' class='toDeleteRouterBtn'><i class='icon-trash'></i> 删除设备</a></li></ul>";
	return str;
	}else{
//		return "<li><a href='javascript:;' class='toDeleteRouterBtn'><i class='icon-trash'></i>删除设备</a></li>";
//		return "<li><label>设备离线,不能操作</label></li>";
		return "<button data-toggle='dropdown' "
				+ "class='btn dropdown-toggle' onclick=\"javascript:mac200='"+data.mac+"'\">更多设置<span class='caret'></span> "
				+ "</button> "
				+"<ul class='dropdown-menu'><li><a href='javascript:;' class='toDeleteRouterBtn'><i class='icon-trash'></i>删除设备</a></li></li>";
	}
}

//---------------------获取白名单列表-开始-------------------//
function getWhiteNameList(num){
	if(num==undefined)return;
	if(isNaN(num))return;
	//showLoading();
	$.ajax({
        type: "POST",
        url: "whiteList",
        data: {
        	condition :"",
        	mac :mac200,
//        	mac : "A8:15:4D:B1:9F:2F",
        	curPage:num,
        	pageSize:5
        },
        success: function(data){
        	//changeToSuccess(1);
        	eval("data = " + data);
        	if(data.code==200){
//        		alert(data.data.data[0].tele);
        		//调用分页
				pageHandle("whiteNamePager","whiteNametable",data.data,num,getWhiteNameList,getTableHTML);
        	}else {
        		//changeToError(1);
        		toastr.error(data.msg);
        	}
        },
        error : function() {
        	//changeToError(1);
        	toastr.error('提交失败！');
		}
    });
}

function getTableHTML(data,tableId){
	data=data.data;
	var table="";
	for(var i=0;i<data.length;i++){
		table+= "<tr>"+
					"<td>"+(i+1)+"</td>"+
					"<td>"+data[i].mac+"</td>"+
					"<td>mac</td>"+
					"<td>"+data[i].deviceName+"</td>"+
					"<td><button class='btn toDeleteMacBtn' title='"+data[i].mac+"'>&nbsp;移&nbsp;&nbsp;除&nbsp;</button></td>"+
				"</tr>";
	}
	
	$("#"+tableId).html(table);
	$(".toDeleteMacBtn").click(function() {
		whiteListMac = $(this).attr("title");
		$('#deleteMac').modal({
			backdrop : 'static'
		});
	});
	//隐藏“添加白名单”div
	$("#macWhite").fadeIn();
	$("#addMac").fadeOut();
	
	
	
}
//---------------------获取白名单列表-结束-------------------//

//---------------------获取限速列表-开始-------------------//
function getLimitedList(num){
	if(num==undefined)return;
	if(isNaN(num))return;
	//showLoading();
	$.ajax({
        type: "POST",
        url: "rulerList",
        data: {
        	condition :"",
        	mac :mac200,
//        	mac : "40:D8:55:16:68:06",
        	curPage:num,
        	pageSize:5
        },
        success: function(data){
        	//changeToSuccess(1);
        	eval("data = " + data);
        	if(data.code==200){
        		//调用分页
				pageHandle("limitedTablePager","limitedList",data.data,num,getLimitedList,getLimitedListTable);
        	}else {
        		//changeToError(1);
        		toastr.error(data.msg);
        	}
        },
        error : function() {
        	//changeToError(1);
        	toastr.error('提交失败！');
		}
    });
}

function getLimitedListTable(data,tableId){
	data=data.data;
	var table="";
	for(var i=0;i<data.length;i++){
		table+= "<tr>"+
					"<td>"+(i+1)+"</td>"+
					"<td>"+data[i].ipScope+"</td>"+
					"<td>"+data[i].maxDownLoad+"</td>"+
					"<td>"+data[i].maxUpLoad+"</td>"+
					"<td><button class='btn toDeleteIpBtn' title='"+ data[i].ipScope +"'>&nbsp;移&nbsp;&nbsp;除&nbsp;</button></td>"+
				"</tr>";
	}
	
	
	
	$("#"+tableId).html(table);
	$(".toDeleteIpBtn").click(function() {
		haoduan = $(this).attr("title");
		$('#deleteIp').modal({
			backdrop : 'static'
		});
	});
}

//---------------------获取限速列表-结束-------------------//






















// ---------------------分页相关-----------------------//








//-------------------------------------一下都是校验------------------------------------------------------------

//校验新密码（使用jquery的validate，每单击一个按钮就去调用submit方法，然后jquery会自动调用submitHandler方法，可以处理原先的单击操作）
var checkPasswordForm = $("#updatePasswordForm").validate(
		{
			errorPlacement : function(error, element) {
		        //错误提示样式,在下方提示
				  //  $('<br/>').appendTo(element.parent());	//有这句就在下方提示错误信息
				
				    error.css({
							display : "inline",
							color : "#F00",
							position : "relative",
						}).appendTo(element.parent().addClass(
							"error"));
			},
			submitHandler:function() {
				var password = $("#password").val();
				$.ajax({
			 		type : "POST",
			 		url : ctx +"/storeRouter/saveNewPass",
			 		data : {
			 			mac : mac200,
			 			password : password
			 		},
			 		success : function(msg) {
			 			if (msg=="success") {
			 				toastr.success('修改成功');
							location = ctx + "/storeRouter/goDeviceManage?curPage="+curPage;
			 			} else if(msg=="notVersion"){//添加失败
			 				toastr.error('路由器版本信息出错');
			 			}else{
			 				toastr.error('修改失败');
			 			};
			 		}
			 	}); 
			},
			rules : {
				password : {
					required : true,
					maxlength : 16
				},
				querenPassword : {
					required : true,
					equalTo : "#password",
					maxlength : 16
				}
			},
			messages : {
				password : {
					required : "请输入新密码",
					maxlength :"密码最大长度是16"
				},
				querenPassword : {
					required : "请再次输入密码",
					equalTo : "两次密码输入不一致",
					maxlength : "密码最大长度是16"
				}
			}
		});

//校验热点名称
var checkSsidForm = $("#updateSsidForm").validate(
		{
			errorPlacement : function(error, element) {
		        //错误提示样式,在下方提示
				  //  $('<br/>').appendTo(element.parent());	//有这句就在下方提示错误信息
				    error.css({
							display : "inline",
							color : "#F00",
							position : "relative",
						}).appendTo(element.parent().addClass(
							"error"));
			},
			submitHandler:function() {
				var ssid = $("#newSsid").val();
				$.ajax({
			 		type : "POST",
			 		url : ctx +"/storeRouter/saveSsid",
			 		data : {
			 			mac : mac200,
						ssid : ssid
			 		},
			 		success : function(msg) {//返回需有用户名、密码
			 			if (msg=="success") {//删除成功
			 				toastr.success('保存成功');
			 				getStoreDeviceList(1);
			 			} else {//添加失败
			 				toastr.error('保存失败');
			 			};
			 		}
			 	}); 
			},
			rules : {
				newSsid : {
					required : true,
					maxlength : 16
				},
				chinesemaxlength:true,	//判断是否是20个字符以内，最多10个汉字
			},
			messages : {
				newSsid : {
					required : "请输入新名称",
					maxlength :"名称最大长度是16"
				},
			}
		});

//校验超时时间
var checkUpdateTimeoutForm = $("#updateTimeoutForm").validate(
		{
			errorPlacement : function(error, element) {
		        //错误提示样式,在下方提示
				  //  $('<br/>').appendTo(element.parent());	//有这句就在下方提示错误信息
				    error.css({
							display : "inline",
							color : "#F00",
							position : "relative",
						}).appendTo(element.parent().addClass(
							"error"));
			},
			submitHandler:function() {
				var timeout = $("#oldTimeout").val();
				$.ajax({
			 		type : "POST",
			 		url : ctx +"/storeRouter/saveTimeout",
			 		data : {
			 			mac : mac200,
						timeout : timeout
			 		},
			 		success : function(msg) {
			 			if (msg=="success") {
			 				toastr.success('保存成功');
							location = ctx + "/storeRouter/goDeviceManage?curPage="+curPage;
			 			} else {//添加失败
			 				toastr.error('保存失败');
			 			};
			 		}
			 	}); 
			},
			rules : {
				oldTimeout : {
					required : true,
					digits:true,
					range:[10,1440] 
				},
			},
			messages : {
				oldTimeout : {
					required : "请输入超时时间",
					digits:	"请输入正整数",
					range :"超时时间最少为10分钟，最多为一天"
						
				},
			}
		});





//验证mac是否存在于数据库
jQuery.validator.addMethod("macIsExist", function(value, element) {  
	var macFlag = true;
	 $.ajax({
			type:"POST",
			async: false,
			url:ctx + "/storeRouter/macIsExist",                
			data:{
				mac:value,
			},
			success:function(shi) {//如果为true说明已经存在
				if(shi=="true"){
					macFlag = false;
				}else{
					macFlag = true;
				}
			}
		});
	  return this.optional(element) || macFlag;       
}, "mac地址已经存在");

//校验是否mac地址是否在线
jQuery.validator.addMethod("macIsOnline", function(value, element) { 
	var flag = false;
	$.ajax({
		type:"POST",
		async: false,
		url:ctx + "/storeRouter/macIsOnline",                
		data:{
			mac:value,
		},
		success:function(shi) {//如果为true说明已经存在
			if(shi=="true"){
				flag = true;
			}else{
				flag = false;
			}
		}
	});
	return this.optional(element) || flag;  
}, "请确认路由器已启动并且网络正常，然后重试!");

//我添加的新规则（验证mac地址）
jQuery.validator.addMethod("isMac", function(value, element) {   
    var mac = /^[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}$/;
   
    return this.optional(element) || mac.test(value);       
 }, "请输入正确格式的mac地址，例：15:22:44:6a:22:77");

//验证该mac地址是否已经存在于白名单
jQuery.validator.addMethod("macIsInWhiteList", function(value, element) {   
	var flag = false;
	$.ajax({
		type:"POST",
		async: false,
		url:ctx + "/storeRouter/isExistInWhiteList",                
		data:{
			mac:mac200,
			checkMac:value
		},
		success:function(shi) {//如果为true说明已经存在
			if(shi=="true"){
				flag = false;
			}else{
				flag = true;
			}
		}
	});
    return this.optional(element) || flag;     	//true是通过验证  
 }, "该mac地址已经存在于白名单");

//热点名称长度的校验
jQuery.validator.addMethod(	"chinesemaxlength",	function(value, element) {
		var text =  $.trim(value);
		var n = 0;
		for(var i = 0; i< text.length; i ++){
			if(text.charCodeAt(i)>=10000){
				n++;
			}
		}
	var strLength =  n * 2 + (text.length - n);
	return this.optional(element) || strLength > 20 ? false : true;
}, "热点名称最多为10个汉字或20个字母，如果您输入的是汉字及字母的组合则一个汉字相当于两个字母");





//添加路由器时校验mac地址和安装位置
var checkAddStoreRouterForm = $("#addStoreRouterForm").validate(
		{
			errorPlacement : function(error, element) {
		        //错误提示样式,在下方提示
				  //  $('<br/>').appendTo(element.parent());	//有这句就在下方提示错误信息
				    error.css({
							display : "inline",
							color : "#F00",
							position : "relative",
						}).appendTo(element.parent().addClass(
							"error"));
			},
			submitHandler:function() {
				var installPosition = $("#installPosition").val();
				$.ajax({
			 		type : "POST",
			 		url : ctx +"/storeRouter/addRouter",
			 		data : {
			 			mac : $("#mac").val(),
			 			installPosition : installPosition
			 		},
			 		success : function(msg) {//返回需有用户名、密码
			 			if (msg=="success") {//删除成功
			 				toastr.success('保存成功');
							location = ctx + "/storeRouter/goDeviceManage?curPage="+curPage;
			 				
			 			} else {//添加失败
			 				toastr.error('保存失败');
			 			};
			 		}
			 	}); 
			},
			rules : {
				mac : {
					required : true,
					maxlength : 17,
					isMac : true,
					macIsExist : true,
					macIsOnline : true
				},
				installPosition : {
					required : true,
					maxlength : 17
				}
			},
			messages : {
				mac : {
					required : "请输入mac地址",
					maxlength :"名称最大长度是17",
					isMac : "请输入正确格式的mac地址，例：15:22:44:6a:22:77"
				},
				installPosition : {
					required : "请输入安装位置",
					maxlength :"安装位置最大长度是17"
				}
			}
		});

//验证mac白名单
var checkAddWhiteListForm = $("#addWhiteListForm").validate(
		{
			errorPlacement : function(error, element) {
		        //错误提示样式,在下方提示
				  //  $('<br/>').appendTo(element.parent());	//有这句就在下方提示错误信息
				    error.css({
							display : "inline",
							color : "#F00",
							position : "relative",
						}).appendTo(element.parent().addClass(
							"error"));
			},
			submitHandler:function() {
				$.ajax({
			 		type : "POST",
			 		url : ctx +"/storeRouter/addMacWhiteList",
			 		data : {
			 			storeRouterMac : mac200,
			 			mac:$("#mac2").val(),
			 			deviceName : $("#deviceName2").val()
			 		},
			 		success : function(msg) {//返回需有用户名、密码
			 			if (msg=="true") {
			 				toastr.success('保存成功');
//							location = ctx + "/storeRouter/goDeviceManage?curPage="+curPage;
			 				getWhiteNameList(1);
			 			} else {//添加失败
			 				toastr.error('保存失败');
			 			};
			 		}
			 	}); 
			},
			rules : {
				mac2 : {
					required : true,
					maxlength : 17,
					isMac : true,
					macIsInWhiteList : true
					
				},
				deviceName2 : {
					required : true,
					maxlength : 10
				}
			},
			messages : {
				mac2 : {
					required : "请输入mac地址",
					maxlength :"mac最大长度是17",
					isMac : "请输入正确格式的mac地址，例：15:22:44:6a:22:77",
					macIsInWhiteList : "该mac地址已经存在于白名单",
					
				},
				deviceName2 : {
					required : "请输入备注名称",
					maxlength :"备注名称最大长度是10"
				}
			}
		});

//验证限速的参数
var checkAddXianSuRuler = $("#addXianSuRuler").validate({
			errorPlacement : function(error, element) {
		        //错误提示样式,在下方提示
				  //  $('<br/>').appendTo(element.parent());	//有这句就在下方提示错误信息
				    error.css({
							display : "inline",
							color : "#F00",
							position : "relative",
						}).appendTo(element.parent().addClass(
							"error"));
			},
			submitHandler:function() {
				checkStartIp();	//调用校验ip的方法
				$.ajax({
			 		type : "POST",
			 		url : ctx +"/storeRouter/saveRuler",
			 		data : {
			 			mac : mac200,
			 			startIp:$.trim($("#startIp").val()),
			 			endIp:$.trim($("#endIp").val()),
			 			maxDownLoad:$.trim($("#maxDownLoad").val()),
			 			maxUpload:$.trim($("#maxUpload").val())
			 		},
			 		success : function(msg) {//返回需有用户名、密码
			 			if (msg=="true") {//删除成功
			 				$("#addIp").fadeOut();
			 				$("#bandwidth").fadeIn();
			 				toastr.success('保存成功');
			 				getLimitedList(1);	
			 			}else if(msg=="isContain"){
			 				toastr.error('ip号段错误');
			 			} else {//添加失败
			 				toastr.error('保存失败');
			 			};
			 		}
			 	}); 
			},
			rules : {
				maxDownLoad:{
					required : true,
					digits:true ,	//必须是整数
					min : 1,
					max : 10000	//最大上传10000K
				},
				maxUpload:{
					required : true,
					digits:true, 	//必须是整数
					min : 1,
					max : 10000	//最大上传10000K
				}
			},
			messages : {
				maxDownLoad:{
					required :"请填写最大下载值:1~10000",
					digits:"下载值必须是整数",
					min : "下载值最小为1",
					max : "下载值最大为10000"
				},
				maxUpload:{
					required : "请填写最大上传值:1~10000",
					digits:"上传值必须是整数",
					min : "上传值最小为1",
					max : "上传值最大为10000"
				}
			}
		});

//校验起始ip
function checkStartIp(){
	$("#ipSpan").text("");
	var startIp = $.trim($("#startIp").val());
	if(isNaN(startIp)){	//条件成立则不是数字
		$("#ipSpan").text("ip起始号段必须是1~253之间的整数");
		return false;
	}
	
	if(startIp==""){
		$("#ipSpan").text("请填写ip起始号段");
		return false;
	}
	var reg =/^[1-9]+[0-9]*]*$/;  
	
	if (!reg.test(startIp)){  //不是正整数就不合法
		$("#ipSpan").text("ip起始号段必须是1~253之间的整数");
		return false;
	}else{
		startIp = parseInt(startIp);
	}
	if(startIp<1 || startIp>253){
		$("#ipSpan").text("ip起始号段必须是1~253之间的整数");
		return false;
	}
	var endIp = $.trim($("#endIp").val());
	if(isNaN(endIp)){	//条件成立则不是数字
		$("#ipSpan").text("ip结束号段必须是1~253之间的整数");
		return false;
	}
	if(endIp==""){	//如果结束号段不为空，则校验是否大于结束号段。
		$("#ipSpan").text("请填写ip结束号段");
		return false;
	}else{
		if(!reg.test(endIp)){
			$("#ipSpan").text("ip结束号段必须是2~254之间的整数");
			return false;
		}else{
			endIp = parseInt(endIp);
		}
		
		if(endIp<2 || endIp>254){	//判断结束ip是否在2~254之间
			$("#ipSpan").text("ip结束号段必须是2~254之间的整数");
			return false;
		}else{	//判断startIp是否小于endIp
			if(startIp>=endIp){
				$("#ipSpan").text("ip开始号段必须小于结束号段");
				return false;
			}else{
				return true;
			}
		}
	}
		
	
	
}


