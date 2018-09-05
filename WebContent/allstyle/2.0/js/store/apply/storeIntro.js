/**
 * 商家简介
 * 
 * @author PengL
 */

// 原有信息，用以判断页面数据是否未做修改
var welcome = "", address = "", tel = "", description = "";

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

	initData(store);

	// 返回店铺应用click事件
	$(".toApplyMainBtn").unbind("click");
	$(".toApplyMainBtn").click(function() {
		window.location.href = "../appManage/gotoAppStore";
	});

	// 保存按钮，click事件
	$(".doSaveStoreIntroBtn").unbind("click");
	$(".doSaveStoreIntroBtn").click(function() {
		$("#storeIntroForm").submit();
	});

	$("#welcome").unbind("keyup");
	$("#welcome").keyup(function() {
		if ($(this).val() == "") {
			$("#welcomeDiv").html();
		} else {
			if ($(this).val().length > 10) {
				$("#welcomeDiv").html("&nbsp;最新活动：" + $(this).val().substr(0, 10));
			} else {
				$("#welcomeDiv").html("&nbsp;最新活动：" + $(this).val());
			}
		}
	});

	$("#address").unbind("keyup");
	$("#address").keyup(function() {
		if ($(this).val() == "") {
			$("#adressDiv").html();
		} else {
			if ($(this).val().length > 32) {
				$("#adressDiv").html("&nbsp;" + $(this).val().substr(0, 32));
			} else {
				$("#adressDiv").html("&nbsp;" + $(this).val());
			}
		}
	});

	$("#tel").unbind("keyup");
	$("#tel").keyup(function() {
		if ($(this).val() == "") {
			$("#telDiv").html();
		} else {
			if ($(this).val().length > 14) {
				$("#telDiv").html("&nbsp;" + $(this).val().substr(0, 14));
			} else {
				$("#telDiv").html("&nbsp;" + $(this).val());
			}
		}
	});

	$("#description").unbind("keyup");
	$("#description").keyup(function() {
		if ($(this).val() == "") {
			$("#descriptionDiv").html("老板最近比较忙，还没有时间添加简介");
		} else {
			if ($(this).val().length > 70) {
				$("#descriptionDiv").html("&nbsp;" + $(this).val().substr(0, 70)+ "...");
			} else {
				$("#descriptionDiv").html("&nbsp;" + $(this).val());
			}
		}
	});
});

// 我添加的新规则（验证 详细地址是否合法）
jQuery.validator.addMethod("checkAddress", function(value, element) {
	var reg = /^[\u4E00-\u9FA5A-Z0-9a-z_-]+$/;
	return this.optional(element) || reg.test(value);
}, "详细地址不能包含特殊字符");

// 校验14位的tel，只能是-和数字
jQuery.validator.addMethod("check14Tel", function(value, element) {
	var flag = true;
	for (var i = 0; i < value.length; i++) {
		var s = value.substring(i, i + 1);
		if (!(s == '0' || s == '1' || s == '2' || s == '3' || s == '4'
				|| s == '5' || s == '6' || s == '7' || s == '8' || s == '9'
				|| s == '+' || s == '-')) {
			flag = false;
		}
	}
	return this.optional(element) || flag;
}, "联系电话格式不对");

$("#storeIntroForm").validate({
	errorPlacement : function(error, element) {
		$('<br/>').appendTo(element.parent()); // 有这句就在下方提示错误信息
		error.css({
			display : "inline",
			color : "#ee7676",
			position : "relative",
		}).appendTo(element.parent().addClass("error"));
	},
	submitHandler : function() {
		if ($("#welcome").val().replace(/^\s+|\s+$/g, "") == welcome
				&& $("#address").val() == address
				&& $("#tel").val() == tel
				&& $("#description").val() == description) {
			toastr.warning("您当前未做修改");
			return;
		}
		showLoading2("保存中...");
		$.ajax({
			type : "POST",
			url : "saveStoreIntro",
			data : {
				welcome : $("#welcome").val().replace(/^\s+|\s+$/g, ""), // 店铺活动
				address : $("#address").val(), // 地址
				tel : $("#tel").val(), // 联系电话
				description : $("#description").val()// 商家简介
			},
			success : function(data) {
				eval("data = " + data);
				if (data.code == 200) {
					changeToSuccess(1);
					toastr.success("保存成功！");
					welcome = $("#welcome").val();
					address = $("#address").val();
					tel = $("#tel").val();
					description = $("#description").val();
				} else {
					toastr.error(data.msg);
					changeToError(1);
				}
			},
			error : function() {
				changeToError(1);
			}
		});
	},
			rules : {
				// 联系方式（可以是手机、电话）
				tel : {
					required : true,
					maxlength : 14,
					check14Tel : true
				},
				// 详细地址
				address : {
					required : true,
					maxlength : 32,
					checkAddress : true
				},
				// 活动描述
				welcome : {
					maxlength : 10
				},
				// 商家简介
				description : {
					maxlength : 500
				}
			},
			messages : {
				tel : {
					required : "请输入联系方式",
					maxlength : "联系方式最大长度是14"
				},
				address : {
					required : "请填写店铺详细地址",
					maxlength : "详细地址最大为32",
					checkAddress : "详细地址不能包含特殊字符"
				},
				welcome : {
					maxlength : "活动描述最大长度为10"
				},
				description : "商家简介最大长度是500"
			}

		});

function initData(store) {
	if (store != null) {
		welcome = store.welcome;
		address = store.company.address;
		tel = store.company.tel;
		description = store.company.description;
		$("#welcome").val(welcome);
		if (welcome == "") {
			$("#welcomeDiv").html();
		} else {
			if (welcome.length > 10) {
				$("#welcomeDiv").html("&nbsp;最新活动：" + welcome.substr(0, 10));
			} else {
				$("#welcomeDiv").html("&nbsp;最新活动：" + welcome);
			}
		}
		$("#address").val(address);
		if (address == "") {
			$("#adressDiv").html();
		} else {
			if (address.length > 32) {
				$("#adressDiv").html("&nbsp;" + address.substr(0, 32));
			} else {
				$("#adressDiv").html("&nbsp;" + address);
			}
		}
		$("#tel").val(tel);
		if (tel == "") {
			$("#telDiv").html();
		} else {
			if (address.length > 14) {
				$("#telDiv").html("&nbsp;" + tel.substr(0, 14));
			} else {
				$("#telDiv").html("&nbsp;" + tel);
			}
		}
		$("#description").val(description);
		if (description == "") {
			$("#descriptionDiv").html("老板最近比较忙，还没有时间添加简介");
		} else {
			if (description.length > 70) {
				$("#descriptionDiv").html(
						"&nbsp;" + description.substr(0, 70) + "...");
			} else {
				$("#descriptionDiv").html("&nbsp;" + description);
			}
		}
	}
}