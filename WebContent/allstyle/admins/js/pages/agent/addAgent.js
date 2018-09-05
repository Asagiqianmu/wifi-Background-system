/**
 * 
 */

var stepDiv = 1;
var $wizard = $('#fuelux-wizard'), $btnPrev = $('.wizard-actions .btn-prev'), $btnNext = $('.wizard-actions .btn-next'), $btnFinish = $(".wizard-actions .btn-finish");

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
$("#startTime").attr("value", year + "-" + mon + "-" + day);
$("#endTime").attr("value", (year + 1) + "-" + mon + "-" + day);

$(function() {

	$("#agent").addClass("active");
	$("#agent").find("ul").addClass("active");
	$("#addAgent").addClass("active");

	var pointer = $("<div/>").addClass("pointer");
	var arrow = $("<div/>").addClass("arrow").appendTo(pointer);
	var arrow_border = $("<div/>").addClass("arrow_border").appendTo(pointer);
	$("#agent").prepend(pointer);

	$wizard.wizard().on('finished', function(e) {
		// wizard complete code

	}).on("changed", function(e) {

		var step = $wizard.wizard("selectedItem");
		// reset states
		$btnNext.removeAttr("disabled");
		$btnPrev.removeAttr("disabled");
		$btnNext.show();
		$btnFinish.hide();

		stepDiv = step.step;

		if (step.step === 1) {

			$btnPrev.attr("disabled", "disabled");

		} else if (step.step === 4) {

			$btnNext.hide();
			$btnFinish.show();
		}
	});

	$btnPrev.on('click', function() {

		$wizard.wizard('previous');

	});

	$btnNext.on('click', function() {

		 if (stepDiv == 1) {
		 $("#step1Form").submit();
		 return;
		 }
		
		 if (stepDiv == 2) {
		 $("#step2Form").submit();
		 return;
		 }
		 if (stepDiv == 3) {
		 $("#step3Form").submit();
		 return;
		 }


	});

	$btnFinish.on('click', function() {

		$("#step4Form").submit();

	});

	// datepicker plugin
	$('.datepicker').datepicker({
		format : "yyyy-mm-dd",
		autoclose : true
	});

	$('#startTime').datepicker().on('changeDate', function(ev) {
		checkDateIsOk($('#startTime').val(), $('#endTime').val(), 'dateError');
	});

	$('#endTime').datepicker().on('changeDate', function(ev) {
		checkDateIsOk($('#startTime').val(), $('#endTime').val(), 'dateError');
	});

	// select2 plugin for select elements
	$(".select2").select2({
		placeholder : "请选择"
	});

	$(".select2-container").css("margin-left", "0px")
			.css("margin-right", "5px");

	loadChannel();

	$("#pic1").change(function() {
		checkFile($("#pic1"), $("#pic1Error"));
	});
	$("#pic2").change(function() {
		checkFile($("#pic2"), $("#pic2Error"));
	});

});

// 加载渠道经理
function loadChannel() {
	$.ajax({
		url : "getChannelList",
		success : function(data) {
			eval("data = " + data);
			if (data.code == 200) {
				if (data.data == null || data.data == undefined
						|| data.data == "") {
					alert("暂无渠道经理");
				} else {
					var select = $("#channelId1");
					for (var i = 0; i < data.data.length; i++) {
						var obj = data.data[i];
						var option = $("<option/>").attr("value", obj.id).text(
								obj.name).appendTo(select);
					}
				}
			} else {
				alert("获取渠道经理失败");
			}
		},
		error : function() {
			alert("获取渠道经理失败");
		}
	});
}

function changeCity(val) {

	$("#areaId1").val(val);
	if (val != -1) {
		$.ajax({
			url : ctx + "/store/changeCity/" + val,
			success : function(shi) {
				// alert("返回数据"+shi);

				var aa = new Array();
				aa = shi.split(":");
				document.getElementById("shi1").options.length = 0;
				document.getElementById("xian1").options.length = 0;

				document.getElementById("shi1").options.add(new Option(
						"请选择市/区", -1));
				document.getElementById("xian1").options.add(new Option(
						"请选择县/街道", -1));

				for (var i = 0; i < aa.length; i++) {
					var bb = new Array();
					bb = aa[i].split(",");
					document.getElementById("shi1").options.add(new Option(
							bb[1], bb[0]));
				}
			}
		});
	} else {
		document.getElementById("shi1").options.length = 0;
		document.getElementById("xian1").options.length = 0;
		document.getElementById("shi1").options.add(new Option("请选择市/区", -1));
		document.getElementById("xian1").options.add(new Option("请选择县/街道", -1));
	}
}
// 改变县，同时将乡制空
function changeXian(val) {
	$("#areaId1").val(val);
	if (val != -1) {
		$.ajax({
			url : ctx + "/store/changeXian/" + val,
			success : function(shi) {
				var aa = new Array();
				aa = shi.split(":");
				document.getElementById("xian1").options.length = 0;

				document.getElementById("xian1").options.add(new Option(
						"请选择县/街道", -1));
				for (var i = 0; i < aa.length; i++) {
					var bb = new Array();
					bb = aa[i].split(",");
					document.getElementById("xian1").options.add(new Option(
							bb[1], bb[0]));
				}
			}
		});
	} else {
		document.getElementById("xian1").options.length = 0;
		document.getElementById("xian1").options.add(new Option("请选择县/街道", -1));
	}
}

// 县,3级改变时，将三级的id给areaId
function xianChange(val) {
	if (val > 0) {
		$("#areaId1").val(val);
	} else {
		$("#areaId1").val($("#shi1").val());
	}

	$("#areaId1").val(val);
}

// 自定义校验：手机号
jQuery.validator
		.addMethod(
				"telephone",
				function(value, element) {
					var tel = /^(((13[0-9]{1})|(14[4-7]{1})|(15[0-9]{1})|(170)|(17[6-8]{1})|(18[0-9]{1}))+\d{8})$/;
					return this.optional(element) || tel.test(value);
				}, "手机号格式不正确");

// 自定义校验：详细地址
jQuery.validator.addMethod("address", function(value, element) {
	var reg = /^[\u4E00-\u9FA5A-Z0-9a-z_-]+$/;
	return this.optional(element) || reg.test(value);
}, "详细地址不能包含特殊字符");

// 第一步表单提交校验
$("#step1Form").validate({
	errorPlacement : function(error, element) {
		element.parent().append(error.css({
			display : "inline",
			color : "#ee7676",
			position : "relative",
			float : "right"
		}));
	},
	submitHandler : function(form) {
		$("#telephone").val($("#telephone1").val());
		$("#email").val($("#email1").val());
		$("#password").val($("#password1").val());
		$wizard.wizard('next');
	},
	rules : {
		telephone1 : {
			required : true,
			telephone : true,
			remote : {
				type : "POST",
				url : ctx + "/comm/checkAgentTelephone",
				data : {
					telephone : function() {
						return $("#telephone1").val();
					}
				}
			}
		},
		email1 : {
			required : true,
			email : true,
			remote : {
				type : "POST",
				url : ctx + "/comm/checkAgentEmail",
				data : {
					email : function() {
						return $("#email1").val();
					}
				}
			}
		},
		password1 : {
			required : true,
			rangelength : [ 3, 16 ]
		},
		rePassword1 : {
			required : true,
			rangelength : [ 3, 16 ],
			equalTo : "#password1"
		}
	},
	messages : {
		telephone1 : {
			required : "请输入手机号",
			telephone : "手机号格式不正确",
			remote : "该手机号已存在"
		},
		email1 : {
			required : "请输入邮箱",
			email : "邮箱格式不正确",
			remote : "该邮箱已存在"
		},
		password1 : {
			required : "请输入密码",
			rangelength : "密码长度在{0}与{1}之间"
		},
		rePassword1 : {
			required : "请输入确认密码",
			rangelength : "密码长度在{0}与{1}之间",
			equalTo : "两次密码输入不一致"
		}
	}
});

//校验14位的tel，只能是-和数字
jQuery.validator.addMethod("check14Tel", function(value, element) {
	var flag = true;
	for(var i=0;i<value.length;i++){
		var s = value.substring(i,i+1);
		if(!(s=='0' || s=='1' || s=='2' || s=='3' || s=='4' || s=='5' || s=='6' || s=='7' || s=='8' || s=='9' || s=='+' || s=='-')){
			flag = false;
		}
	}
	return this.optional(element) || flag;
}, "联系电话格式不对");

// 第二步表单提交校验
$("#step2Form").validate({
	errorPlacement : function(error, element) {
		element.parent().append(error.css({
			display : "inline",
			color : "#ee7676",
			position : "relative",
			float : "right"
		}));
	},
	submitHandler : function(form) {
		$("#name").val($("#name1").val());
		$("#simpleName").val($("#simpleName1").val());
		$("#tel").val($("#tel1").val());
		$("#address").val($("#address1").val());
		$wizard.wizard('next');
	},
	rules : {
		name1 : {
			required : true,
			rangelength : [ 3, 32 ]
		},
		simpleName1 : {
			required : true,
			rangelength : [ 2, 6 ]
		},
		tel1 : {
			required : true,
			maxlength : 14,
			check14Tel : true
		},
		address1 : {
			required : true,
			address : true
		}
	},
	messages : {
		name1 : {
			required : "请输入公司名称",
			rangelength : "公司名称长度在{0}与{1}之间"
		},
		simpleName1 : {
			required : "请输入公司简称",
			rangelength : "公司简称长度在{0}与{1}之间"
		},
		tel1 : {
			required : "请输入联系电话",
			maxlength : "联系方式最大长度是14"
		},
		address1 : {
			required : "请输入通讯地址",
			address : "通讯地址不能包含特殊字符"
		}
	}
});

// 第三步表单提交校验
$("#step3Form").validate({
	errorPlacement : function(error, element) {
		element.parent().append(error.css({
			display : "inline",
			color : "#ee7676",
			position : "relative",
			float : "right"
		}));
	},
	submitHandler : function(form) {
		$("#realname").val($("#realname1").val());
		$("#areaId").val($("#areaId1").val());
//		$("#perMille").val($("#perMille1").val());
		$("#channelId").val($("#channelId1").val());
		$wizard.wizard('next');
	},
	rules : {
		realname1 : {
			required : true,
			rangelength : [ 2, 6 ]
		},
//		perMille1 : {
//			required : true,
//			number : true,
//			range : [ 0.01, 1000 ]
//		},
		sheng1 : {
			required : true,
			min : 0
		},
		shi1 : {
			required : true,
			min : 0
		}
	},
	messages : {
		realname1 : {
			required : "请输入公司联系人",
			rangelength : "公司联系人长度在{0}与{1}之间"
		},
//		perMille1 : {
//			required : "请输入广告分成比例，千分比",
//			number : "请输入数字或小数",
//			range : "分成比例在{0}与{1}之间"
//		},
		sheng1 : {
			required : "请选择省",
			min : "请选择省"
		},
		shi1 : {
			required : "请选择市",
			min : "请选择市"
		}
	}
});

// 第四步表单提交校验
$("#step4Form").validate(
		{
			errorPlacement : function(error, element) {
				element.parent().append(error.css({
					display : "inline",
					color : "#ee7676",
					position : "relative",
					float : "right"
				}));
			},
			submitHandler : function(form) {

				if ($("#pic1").val() == "") {
					$("#pic1Error").text("请上传代理商的营业执照");
					return;
				}
				if ($("#pic2").val() == "") {
					$("#pic2Error").text("请上传合同文件");
					return;
				}
				var flag = checkDateIsOk($('#startTime').val(), $('#endTime')
						.val(), 'dateError');
				if (!flag) {
					return;
				} else {
					showLoading2("保存中...");
					form.submit();
				}
			},
			rules : {
				note : {
					maxlength : 128
				}
			},
			messages : {
				note : {
					maxlength : "备注最大长度为{0}"
				}
			}
		});

// 比较两个日期大小
function checkDateIsOk(startTime, endTime, divId) {
	var flag = false;
	if ("" != startTime) {
		if ("" != endTime) {

			var myDate = new Date();
			var dateStr = myDate.getFullYear() + "/" + (myDate.getMonth() + 1)
					+ "/" + myDate.getDate();

			startTime = startTime.replace(/-/g, "/");
			endTime = endTime.replace(/-/g, "/");
			var startTime = new Date(startTime).getTime();
			var endTime = new Date(endTime).getTime();
			/*if (startTime < new Date(dateStr).getTime()
					|| endTime < new Date(dateStr).getTime()) {
				flag = false;
				$("#" + divId).text("日期不能小于当前时间");
			} else*/
				
				if (startTime > endTime) {
				$("#" + divId).text("结束日期不能小于开始日期");
				flag = false;
			} else {
				$("#" + divId).text("");
				flag = true;
			}
		} else {
			$("#" + divId).text("结束日期未填写");
			flag = false;
		}
	} else {
		$("#" + divId).text("开始日期未填写");
		flag = false;
	}
	return flag;
}

function checkFile(file, errorDiv) {
	var flag = false;
	if (file.val() == "") {
		errorDiv.text("请上传文件");
		flag = false;
	} else {
		errorDiv.text("");
		flag = true;
	}
	return flag;
}