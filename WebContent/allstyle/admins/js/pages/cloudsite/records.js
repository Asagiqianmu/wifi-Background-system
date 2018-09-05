
$(function() {
	
	jQuery.validator.addMethod("siteNameRule",function(value, element) {
		 var addressRule = /^[\u4E00-\u9FA5A-Za-z0-9]+$/;
		return this.optional(element) || addressRule.test(value);
	}, "名称格式为数字字母或中文，4~64位长度");
	
	jQuery.validator.addMethod("addressRule",function(value, element) {
		 var addressRule = /^[\u4E00-\u9FA5A-Za-z0-9]+$/;
		return this.optional(element) || addressRule.test(value);
	}, "地址格式为数字字母或中文，6~100位长度");
	
	jQuery.validator.addMethod("macRule",function(value, element) {
		 var mac = /^[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}$/;
		return this.optional(element) || mac.test(value);
	}, "MAC地址格式为AB:01:CD:02:EF:03");
	
	
	getsitesList(1);
	
	$("#addCloudSite").click(function(){
		$("#siteName").val("");
		$("#address").val("");
		$('#addCloudSiteModel').modal({
			backdrop : 'static'
		});
	});
	
	$(".doAddCloudSiteBtn").click(function(){
		$("#addCloudSiteForm").submit();
	});
	
	
	
	$(".doAddMacBtn").click(function(){
		$("#addMacForm").submit();
	});
	
	/*********************************验证添加场所表单**********************************/
	
	var addCloudSiteFormValid=$("#addCloudSiteForm").validate({
		// 错误提示样式,在下方提示
		errorPlacement : function(error, element) {
			$('<br/>').appendTo(element.parent());
			error.css({
				display : "inline",
				color : "#ee7676",
				position : "relative",
			}).appendTo(element.parent().addClass("error"));
		},
		submitHandler : function(form) {
			
			$.ajax({
				type : "POST",
				url : ctx+"/CloudSiteManage/addCloudSite?time="+ Math.random(),
				data : {
					siteName : $("#siteName").val(),
					address : $("#address").val()
				},
				success : function(data) {
					eval("data = " + data);
					if (data.code == 200) {
						// 调用分页
						toastr.success("添加场所成功");
						getsitesList(1);
						$('#addCloudSiteModel').modal("hide");
					} else {
						toastr.warning(data.msg);
					}
				},
				error : function() {
					toastr.error("服务不可用，请稍后再试");
				}
			});
			
		},
		// 校验规则
		rules : {
			siteName : {
				required : true,
				rangelength:[4,64],
				siteNameRule:true
			},
			address : {
				required : true,
				rangelength:[6,100],
				addressRule:true
			}
		},
		// 提示文本
		messages : {
			siteName : {
				required : "请输入场所名称",
				siteNameRule : "名称格式为数字字母或中文，4~64位长度"
			},
			address : {
				required : "请输入场所地址",
				rangelength:"地址为6~100位长度",
				addressRule : "地址格式为数字字母或中文，6~100位长度"
			}
		}
	});
	
	/*********************************验证添加设备表单**********************************/
	
	var addMacValid=$("#addMacForm").validate({
		// 错误提示样式,在下方提示
		errorPlacement : function(error, element) {
			$('<br/>').appendTo(element.parent());
			error.css({
				display : "inline",
				color : "#ee7676",
				position : "relative",
			}).appendTo(element.parent().addClass("error"));
		},
		submitHandler : function(form) {
			
			$.ajax({
				type : "POST",
				url : ctx+"/CloudSiteManage/addDevice?time="+ Math.random(),
				data : {
					mac : $("#mac").val(),
					siteId : $("#curSiteId").val(),
				},
				success : function(data) {
					eval("data = " + data);
					if (data.code == 200) {
						// 调用分页
						toastr.success('添加设备成功!');
						getsitesList(1);
						$('#addMacModel').modal("hide");
					} else {
						toastr.error(data.msg+"错误码："+data.code);
					}
				},
				error : function() {
					toastr.error("服务不可用，请稍后再试");
				}
			});
			
		},
		// 校验规则
		rules : {
			mac : {
				required : true,
				macRule:true
			}
		},
		// 提示文本
		messages : {
			mac : {
				required : "请输入场所名称",
				macRule : "MAC地址格式为AB:01:CD:02:EF:03"
			}
		}
	});
});

//操作菜单的初始化
function init(){
	$(".addMac").unbind("click");
	$(".addMac").click(function(){
		$("#curSiteId").val($(this).attr("siteId"));
		$("#mac").val("");
		$('#addMacModel').modal({
			backdrop : 'static'
		});
	});
	//.updataSite //绑定更改操作 更改试用开关终端数
	$(".updataSites").unbind("click");
	$(".updataSites").click(function(){
		$("#SiteIdUpdate").val($(this).attr("siteId"));  
		 $("#updateNum").val($(this).attr("num"));
		 $("#probatives").val($(this).attr("probative"));
		 $("#editSiteName").val($(this).attr("siteName"));
		 $("#editSiteAddress").val($(this).attr("siteaddress"));
		 
		 var  probatives= $("#probatives").val();
		 if(probatives==1){
				$("#probatives").find("option").eq(0).attr("selected","selected");
			}else{
				$("#probatives").find("option").eq(1).attr("selected","selected");
			}
		$('#updataSitediv').modal({
			backdrop : 'static'
		});
	});
	//更新终端 试用开关
	$("#updataSiteFun").unbind("click");
	$("#updataSiteFun").click(function(){
		$("#updataSiteform").submit();
	});
	
	//设备详细信息  
	$(".OndeviceInfo").unbind("click");
	$(".OndeviceInfo").click(function(){
		var macNumDevice=$(this).attr("macNumDevice");
		if(macNumDevice<=0){
			toastr.error("此场所没有添加设备！");
			return;
		}
		$('#deviceDIv').modal({
			backdrop : 'static'
		});
	var siteid=$(this).attr("siteId");
	$("#siteIdDevice").val(siteid);
	DeviceInfoList(1);
	});
	
}

function getsitesList(num) {
	showLoading();
	if (num == undefined)
		return;
	if (isNaN(num))
		return;
	$.ajax({
		type : "POST",
		url :  ctx+"/CloudSiteManage/getUserSiteList?time="+ Math.random(),
		data : {
			curPage : num,
			pageSize : 5
		},
		success : function(data) {
			eval("data = " + data);
			if (data.code == 200) {
				// 调用分页
				pageHandle("pager", "recordsTbody", data.data, num, getsitesList, buildTable);
				changeToSuccess(1);
				init();
			} else {
				changeToError(1);
			}
		},
		error : function() {
			changeToError(1);
		}
	});
}

function buildTable(data, tableId) {
	var tbody = $("#" + tableId);
	tbody.empty();
	data = data.data;
	var tableHtml="";
	for (var i = 0; i < data.length; i++) {
		tableHtml+="<tr>" +
				"<td>"+data[i].site_name+"</td>" +
				"<td>"+data[i].address+"</td>" +
				"<td>"+data[i].mac_num+"</td>" +
				"<td>"+(data[i].is_probative==0?"关闭":"开启")+"</td>" +
				"<td>"+data[i].allow_client_num+"</td>" +
				"<td>"+500+"</td>" +
				"<td>"+data[i].portalUserNum+"</td>" +
				"<td>"+500+"</td>" +
				"<td>"+buildButtons(data[i])+"</td>"+
				"</tr>";
	}
	tbody.html(tableHtml);
}

function buildButtons(data){
	
	var buttons="<div class='btn-group'>"+
		"<button class='btn btn-primary  btn-mini dropdown-toggle' data-toggle='dropdown'>操作<span class='caret'></span></button>"+
		"<ul class='dropdown-menu' style='min-width: 100px;'>"+
	/*	"<li><a style='padding:1px 5px; text-decoration:none; margin-left:10px;' href='javascript:void(0);'><i style='margin-right:10px;' class='icon-pencil'></i>修改名称</a></li>"+
		"<li><a style='padding:1px 5px; text-decoration:none; margin-left:10px;' href='javascript:void(0);'><i style='margin-right:10px;' class='icon-road'></i>修改地址</a></li>"+*/
		"<li><a style='padding:1px 5px; text-decoration:none; margin-left:10px;' href='javascript:void(0);' siteId='"+data.id+"' class='addMac'><i style='margin-right:10px;' class='icon-time'></i>添加设备</a></li>"+
		"<li><a style='padding:1px 5px; text-decoration:none; margin-left:10px;' href='javascript:void(0);' siteId='"+data.id+"' num='"+data.allow_client_num+"' probative='"+data.is_probative+"' siteName='"+data.site_name+"' siteAddress='"+data.address+"' class='updataSites'><i style='margin-right:10px;' class='icon-edit'></i>修改场所</a></li>"+
		"<li><a style='padding:1px 5px; text-decoration:none; margin-left:10px;' href='javascript:void(0);' siteId='"+data.id+"' macNumDevice='"+data.mac_num+"' class='OndeviceInfo' ><i style='margin-right:10px;' class='icon-signal'></i>设备详情</a></li>"+
		
//		"<li><a style='padding:1px 5px; text-decoration:none; margin-left:10px;' href='#'><i style='margin-right:10px;' class='icon-arrow-up'></i>固件升级</a></li>"+
//		"<li><a style='padding:1px 5px; text-decoration:none; margin-left:10px;' href='#'><i style='margin-right:10px;' class='icon-lock'></i>路由密码</a></li>"+
//		"<li><a style='padding:1px 5px; text-decoration:none; margin-left:10px;' href='#'><i style='margin-right:10px;' class='icon-edit'></i>修改位置</a></li>"+
//		"<li><a style='padding:1px 5px; text-decoration:none; margin-left:10px;' href='#'><i style='margin-right:10px;' class='icon-random'></i>接口设置</a></li>"+
//		"<li><a style='padding:1px 5px; text-decoration:none; margin-left:10px;' href='#'><i style='margin-right:10px;' class='icon-list'></i>查看AP</a></li>";
		"</ul></div>";
	
	return buttons;
	
}
//更改终端数量 试用开关
$("#updataSiteform").validate({
	errorPlacement : function(error, element) {
		error.css({
			display : "inline",
			color : "#F00",
			position : "relative",
		}).appendTo(element.parent().addClass("error"));
	},
	submitHandler : function() {
		//SiteIdUpdate updateNum probatives
		var id= $("#SiteIdUpdate").val();
		var editSiteName=	$("#editSiteName").val();
		var editSiteAddress=$("#editSiteAddress").val();
		var updateNum=	$("#updateNum").val();
		var probatives=$("#probatives").val();
		
		$.post(ctx+"/updatesite", {
			"SiteIdUpdate" : id,
			"editSiteName" : editSiteName,
			"editSiteAddress" : editSiteAddress,
			"probatives" : probatives,
			"updateNum" : updateNum
		}, function(data) {
			eval("data = " + data);
			if (data.code == 1) {
				$('#updataSitediv').modal("hide");
				toastr.success('更改成功');
				getsitesList(1);
			} else {
				toastr.error("服务不可用，请稍后再试");
			}
		});
	},	
	rules : { //验证
		editSiteName:{
			required : true,
			rangelength:[4,64],
			siteNameRule:true
		},
		editSiteAddress:{
			required : true,
			rangelength:[6,100],
			addressRule:true
		},
		
		updateNum : {
			required : true,
			digits:true,
			maxlength : 10
		}
		
	},
	messages : { //错误提示
		
		editSiteName : {
			required : "请输入场所名称",
			siteNameRule : "名称格式为数字字母或中文，4~64位长度"
		},
		editSiteAddress : {
			required : "请输入场所地址",
			rangelength:"地址为6~100位长度",
			addressRule : "地址格式为数字字母或中文，6~100位长度"
		},
		updateNum : {
			required : "请输入数字",
			digits : "请输入数字",
			maxlength : "最大输入长度为10"
		},
	},
	
});

//设备详细信息   
function DeviceInfoList(num){
	$("#DeviceInforecordsTbody").html("");
	showLoading();
	var siteid=$("#siteIdDevice").val();
	if (num == undefined)
		return;
	if (isNaN(num))
		return;
	$.ajax({
		type : "POST",
		url : ctx+"/CloudSiteManage/getaDeviceInfo",
		data : {
			curPage : num,
			pageSize : 5,
			siteId:siteid
			
		},
		success : function(data) {
			eval("data = " + data);
			if (data.code == 200) {
				// 调用分页
				pageHandle("DeviceInfopager", "DeviceInforecordsTbody", data.data, num, DeviceInfoList, htmlDeviceInfo);
				changeToSuccess(1);
				init();
			} else {
				changeToError(1);
				toastr.error("数据有误请刷新页面后重新查询！");
				
			}
		},
		error : function() {
			changeToError(1);
		}
	});
	
}

function htmlDeviceInfo(data, tableId) {
	var tbody = $("#" + tableId);
	tbody.empty();
	data = data.data;
	var tableHtml="";
	for (var i = 0; i < data.length; i++) {
		tableHtml+="<tr>" +
				"<td>"+data[i].mac+"</td>" +
				"<td>"+data[i].authcount+"</td>" +
				"<td>"+data[i].install_position+"</td>" +
				"<td>"+data[i].ssid+"</td>" +
				"<td>"+data[i].startup_time+"</td>" +
				"<td>"+data[i].version+"</td>" +
				"<td>"+data[i].homeurl+"</td>" +
				"<td>"+data[i].authStatue+"</td>" +
				"<td>"+statueColor(data[i].statue)+"</td>"+
				"</tr>";
	}
	tbody.html(tableHtml);
}
function statueColor(statu){//正常":(fen<60?"离线":"异常
	if(statu=="正常"){return "<span class='label label-success'>正常</span>";}
	else if(statu=="异常"){return "<span class='label label-warning'>异常</span>";}
	else{return "<span class='label'>离线</span>";}
}







