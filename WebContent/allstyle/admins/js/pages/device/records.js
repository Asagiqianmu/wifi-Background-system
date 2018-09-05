
$(function() {
	
	jQuery.validator.addMethod("macRule",function(value, element) {
		 var mac = /^[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}$/;
		return this.optional(element) || mac.test(value);
	}, "MAC地址格式为AB:01:CD:02:EF:03");
	
	jQuery.validator.addMethod("addressRule",function(value, element) {
		 var addressRule = /^[\u4E00-\u9FA5A-Za-z0-9]+$/;
		return this.optional(element) || addressRule.test(value);
	}, "地址格式为数字字母或中文，6~100位长度");
	
	
	getRecordsList(1);
	
	$("#addDevice").click(function(){
		$("#addRouterForm")[0].reset();
		addDeviceFormValid.resetForm();
		$('#addDeviceModel').modal({
			backdrop : 'static'
		});
		
//		$('#addDeviceModel').modal("hide");
		
//		window.open("downLoadRecordsExcel");
		
	});
	
	
	$(".doAddDeviceBtn").click(function(){
		$("#addRouterForm").submit();
	});
	
	
	var addDeviceFormValid=$("#addRouterForm").validate({
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
				url : "addDevice",
				data : {
					mac : $("#mac").val(),
					address : $("#address").val()
				},
				success : function(data) {
					eval("data = " + data);
					if (data.code == 200) {
						// 调用分页
						toastr.success('添加设备成功');
						getRecordsList(1);
						$('#addDeviceModel').modal("hide");
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
			},
			address : {
				required : true,
				rangelength:[6,100],
				addressRule:true
			}
		},
		// 提示文本
		messages : {
			mac : {
				required : "请输入MAC地址",
				macRule : "MAC地址格式为AB:01:CD:02:EF:03"
			},
			address : {
				required : "请输入地址",
				rangelength:"地址为6~100位长度",
				addressRule : "地址格式为数字字母或中文，6~100位长度"
			}
		}
	});
	
});

function init(){
	
	$('.msg').tooltip('hide');
	
}



function getRecordsList(num) {
	showLoading();
	if (num == undefined)
		return;
	if (isNaN(num))
		return;
	$.ajax({
		type : "POST",
		url : "getUserDeviceList",
		data : {
			curPage : num,
			pageSize : 2
		},
		success : function(data) {
			eval("data = " + data);
			if (data.code == 200) {
				// 调用分页
				pageHandle("pager", "recordsTbody", data.data, num, getRecordsList, buildTable);
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
				"<td>"+data[i].mac+"</td>" +
				"<td>"+data[i].authcount+"</td>" +
				"<td>"+subStr(data[i].install_position)+"</td>" +
				"<td>"+data[i].ssid+"</td>" +
				"<td>"+data[i].startup_time+"</td>" +
				"<td>"+data[i].version+"</td>" +
				"<td>"+subStr(data[i].homeurl,20)+"</td>" +
				"<td>"+data[i].authStatue+"</td>" +
				"<td>"+statueColor(data[i].statue)+"</td>" +
				"<td>"+data[i].userName+"</td>" +
				"<td>"+buildButtons(data[i].statu)+"</td>" +
				"</tr>";
	}
	tbody.html(tableHtml);
}

function statueColor(statu){//正常":(fen<60?"离线":"异常
	if(statu=="正常"){return "<span class='label label-success'>正常</span>";}
	else if(statu=="异常"){return "<span class='label label-warning'>异常</span>";}
	else{return "<span class='label'>离线</span>";}
}

//字符太多，显示几个，鼠标移上显示全部字符
//num：显示字数，str待截取字符串
function subStr(str,num) {
	if(num==0||num==undefined)num=6;
	if (str==null||str==undefined||str.length < (num+3)) {
		return str;
	}
	return "<span data-toggle='tooltip' class='msg' title='" + str + "'>"
			+ str.substring(0, num) + "..." + "</span>";
}

function buildButtons(statu){
	
//	var buttons="<div class='btn-group'>"+
//                "<button class='btn btn-primary  btn-mini dropdown-toggle' data-toggle='dropdown'>操作<span class='caret'></span></button>"+
//               "<ul class='dropdown-menu'>"+
//                  "<li><a href='#'>Action</a></li>"+
//                  "<li><a href='#'>Another action</a></li>"+
//                  "<li><a href='#'>Something else here</a></li>"+
////                  "<li class='divider'></li>"+
//                  "<li><a href='#'>Separated link</a></li>"+
//                "</ul>"+
//              "</div>";  
	
	var buttons="<div class='btn-group'>"+
		"<button class='btn btn-primary  btn-mini dropdown-toggle' data-toggle='dropdown'>操作<span class='caret'></span></button>"+
		"<ul class='dropdown-menu' style='min-width: 100px;'>";
		
	if(statu=="正常"){
		buttons+="<li><a style='padding:1px 5px; text-decoration:none; margin-left:10px;' href='#'><i style='margin-right:10px;' class='icon-pencil'></i>热点名称</a></li>"+
		  "<li><a style='padding:1px 5px; text-decoration:none; margin-left:10px;' href='#'><i style='margin-right:10px;' class='icon-road'></i>白名单</a></li>"+
		  "<li><a style='padding:1px 5px; text-decoration:none; margin-left:10px;' href='#'><i style='margin-right:10px;' class='icon-time'></i>超时时间</a></li>"+
		  "<li><a style='padding:1px 5px; text-decoration:none; margin-left:10px;' href='#'><i style='margin-right:10px;' class='icon-refresh'></i>重启路由</a></li>"+
		  "<li><a style='padding:1px 5px; text-decoration:none; margin-left:10px;' href='#'><i style='margin-right:10px;' class='icon-signal'></i>带宽控制</a></li>"+
		  "<li><a style='padding:1px 5px; text-decoration:none; margin-left:10px;' href='#'><i style='margin-right:10px;' class='icon-arrow-up'></i>固件升级</a></li>"+
		  "<li><a style='padding:1px 5px; text-decoration:none; margin-left:10px;' href='#'><i style='margin-right:10px;' class='icon-lock'></i>路由密码</a></li>"+
		  "<li><a style='padding:1px 5px; text-decoration:none; margin-left:10px;' href='#'><i style='margin-right:10px;' class='icon-edit'></i>修改位置</a></li>"+
		  "<li><a style='padding:1px 5px; text-decoration:none; margin-left:10px;' href='#'><i style='margin-right:10px;' class='icon-random'></i>接口设置</a></li>"+
		  "<li><a style='padding:1px 5px; text-decoration:none; margin-left:10px;' href='#'><i style='margin-right:10px;' class='icon-list'></i>查看AP</a></li>";
		
	}
		  
	buttons+= "<li><a style='padding:1px 5px; text-decoration:none; margin-left:10px;' href='#'><i style='margin-right:10px;' class='icon-remove'></i>删除设备</a></li>"+
		"</ul></div>";
	
	return buttons;
	
}
















