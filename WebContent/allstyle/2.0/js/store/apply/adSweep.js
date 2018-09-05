/**
 * 屏蔽广告模块
 */

// 表格样式微调
$("#shieldForm").find(".control-label").css("width", "70px");
$("#shieldForm").find(".controls").css("margin-left", "90px");

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

	$('[data-toggle="radio"]').radiocheck();

	// 返回店铺应用click事件
	$(".toApplyMainBtn").click(function() {
		window.location.href = ctx + "/appManage/gotoAppStore";
	});

	$(".payOkBtn").click(function() {
		window.location.href = ctx + "/appManage/gotoAppStore";
	});

	$(".payErrorBtn").click(function() {
		window.location.href = ctx + "/comm/faq";
	});

	// 购买应用时，选择时长，radioclick事件
	$("input[name=times]").each(function() {
		var _this = $(this);
		_this.unbind("click");
		_this.click(function() {
			$("#timesInput").val("");
			$("#errorMsg").text("").hide();
			calculateDate();
		});
	});

	// 购买应用时，选择时长，radioclick事件
	$("#timesInput").unbind("keyup");
	$("#timesInput").keyup(function() {
		if ($(this).val() != "") {
			var _val = $(this).val();
			var reg1 = /^\d+$/;// 非负正整数
			if (reg1.test(_val)) {// 是
				_val = parseInt(_val);
				if (_val > 24 || _val == 0) {
					$("#errorMsg").text("最多只能选择24个月").show();
					flag = false;
				} else {
					flag = true;
				}
			} else {
				$("#errorMsg").text("只能输入正整数").show();
				flag = false;
			}
		} else {
			$("#errorMsg").text("您至少要选择一个月").show();
			flag = false;
		}
		if (flag) {
			$("#errorMsg").text("").hide();
			$("input[name=times]").prop("checked", false);
		} else {
//			$("input[name=times][value=1]").prop("checked", "checked");
		}
		calculateDate();
	});

	// 立即屏蔽并付款，按钮，click事件
	$(".doSweepBtn").click(function() {
		var routerNum = $("#routerNum").val();
		if (routerNum==0) {
			toastr.warning("您的店铺当前没有路由，请添加路由");
			return ;
		}
		$(".doSweepBtn").unbind("click");
		var month = ($("#timesInput").val() == "") ? ($("input[name=times]:checked")
				.val())
				: ($("#timesInput").val());
		$("#num").val(month);
		$("#buyForm").submit();
		$('#payMsg').modal({
			backdrop : 'static'
		});
	});

});

function calculateDate() {
	var month = ($("#timesInput").val() == "") ? ($("input[name=times]:checked")
			.val())
			: ($("#timesInput").val());
	var unitPrice = $("#unitPrice").text();
	var routerNum = $("#routerNum").val();
	var fix = unitPrice.split(".");
	var fix_length = 0;
	if (fix.length > 1) {
		fix_length = fix[1].length;
	}
	$("#payMoney").text(
			"￥" + (routerNum * unitPrice * month).toFixed(fix_length));

}