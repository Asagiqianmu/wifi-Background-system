/**
 * 支付、充值js
 */

var payPlatform = 1;// 支付方式1、支付宝2、财付通

$(function() {

	$('.tooltipMsg').tooltip({
		placement : 'right'
	});

	$('[data-toggle="checkbox"]').radiocheck();

	$("#personal").addClass("active");
	// 支付平台，选择支付方式
	$("#payMent img").each(function() {
		var _this = $(this);
		var id = _this.attr("name");
		_this.click(function() {
			_this.parent().parent().find("img").css("border-color", "#DDDDDD");
			_this.css("border-color", "green");
			payPlatform = id;
		});
	});

	$(".toPayBtn").click(function() {
		window.open("http://www.baidu.com", "_blank");
		$('#payMsg').modal({
			backdrop : 'static'
		});
	});

	$(".payOkBtn").click(function() {
		window.location.href = "/merchant/personal/personal.jsp?type=3";
	});

	$(".payErrorBtn").click(function() {
		window.location.href = "http://www.baidu.com";
	});

});