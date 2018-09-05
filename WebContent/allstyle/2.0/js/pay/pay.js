/**
 * 支付、充值js
 */

var payPlatform = 1;// 支付方式1、支付宝2、财付通

$(function() {

	$('.tooltipMsg').tooltip({
		placement : 'bottom'
	});

	$('[data-toggle="checkbox"]').radiocheck();

	$("#personal").addClass("active");
	// 支付平台，选择支付方式
	// $("#payMent img").each(function() {
	// var _this = $(this);
	// var id = _this.attr("name");
	// _this.click(function() {
	// _this.parent().parent().find("img").css("border-color", "#DDDDDD");
	// _this.css("border-color", "green");
	// payPlatform = id;
	// });
	// });
	// $($("#payMent img")[0]).click();
	$($("#payMent img")[1]).click(function() {
		toastr.warning("暂不提供财付通支付，后续版本将陆续开放！");
	});

	// 支付页面，去支付
	$(".cashierToPayBtn").click(function() {
		$("#cashierForm").submit();
		$('#payMsg').modal({
			backdrop : 'static'
		});
	});

	// 充值，去支付
	$(".toPayBtn").click(function() {
		if (!checkPayMoney()) {
//			toastr.error("请输入您要充值的金额！");
			$("#payMoney").focus();
			return;
		} else {
			$("#rechargeForm").submit();
			$('#payMsg').modal({
				backdrop : 'static'
			});
		}
	});

	$(".payOkBtn").click(function() {
		window.location.href = ctx + "/personal/goPersonal/1";
	});

	$(".payErrorBtn").click(function() {
		window.location.href = ctx + "/comm/faq";
	});

	$("#payMoney").keyup(function() {
		checkPayMoney();
	});

	// 使用余额支付,余额不够，提示按钮，click事件
	$(".toNotBalancePaidBtn").unbind("click");
	$(".toNotBalancePaidBtn").click(function() {
		toastr.warning("您的余额不足，请使用在线支付，或先去充值！");
	});

	// 使用余额支付按钮，click事件
	$(".toBalancePaidBtn").unbind("click");
	$(".toBalancePaidBtn").click(function() {
		$(".toBalancePaidBtn").addClass("disabled").unbind("click");
		var orderNumber = $("#orderNumber").val();
		$.ajax({
			type : "POST",
			url : ctx+"/appManage/balancePaid",
			data : {
				orderNumber : orderNumber
			},
			success : function(data) {
				eval("data = " + data);
				if (data.code == 200) {
					toastr.success("支付成功！");
					setTimeout(function() {
						window.location.href = ctx + "/personal/goPersonal/3";
					}, 1000);
				} else {
					toastr.error(data.msg);
				}
			},
			error : function() {
				toastr.error("系统繁忙");
			}
		});
	});

});
// 校验充值金额
function checkPayMoney() {
	var flag = false;
	var _val = $("#payMoney").val();
	if (_val != "") {
		var reg1 = /^\d+$/;// 非负正整数
		if (reg1.test(_val)) {// 是
			_val = parseInt(_val);
			if (_val > 100000 || _val == 0) {
				$("#payMoneyMsg").text("充值金额在1-100000之间");
				flag = false;
			} else {
				flag = true;
				$("#payMoneyMsg").text("");
			}
		} else {
			$("#payMoneyMsg").text("只能输入正整数");
			flag = false;
		}
	} else {
		$("#payMoneyMsg").text("请输入充值金额");
		flag = false;
	}
	return flag;
}