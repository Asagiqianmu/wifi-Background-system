/**
 * 短信营销模块
 */
$(function() {

	// 短信列表之外的div隐藏
	$(".smsOperate").hide();

	// 返回短信列表(短信列表显示，其余div隐藏)
	$(".toSmsListBtn").click(function() {
		toSmsList();
	});

	// ---------------------短信营销列表-------------------------------------//
	// "创建短信"，按钮事件(创建短信DIV显示，短信列表隐藏)
	$(".toAddSmsBtn").click(function() {
		$("#smsList").fadeOut();
		$("#addSms").fadeIn();
	});

	// "修改短信"，按钮事件(修改短信DIV显示，短信列表隐藏)
	$(".toUpdateSmsBtn").click(function() {
		$("#smsList").fadeOut();
		$("#updateSms").fadeIn();
	});

	// 发送成功后，"再次发送"，按钮事件(再次发送DIV显示，短信列表隐藏)
	$(".toAgainSend1Btn").click(function() {
		$("#smsList").fadeOut();
		$("#againSend1").fadeIn();
	});

	// 发送失败后，"再次发送"，按钮事件
	$(".toAgainSend2Btn").click(function() {
		toastr.success('发送成功');
	});

	// "放弃发送短信"，按钮事件(弹出确认提示框)
	$(".toDeleteMessBtn").click(function() {
		$('#deleteSms').modal({
			backdrop : 'static'
		});
	});

	// "查看发送记录"，按钮事件(发送记录列表DIV显示，短信列表隐藏)
	$(".toSmsSendListBtn").click(function() {
		$("#smsList").fadeOut();
		$("#smsSendList").fadeIn();
	});
	// ---------------------短信营销列表-------------------------------------//

	// ---------------------创建短信-------------------------------------//
	// 选择客户人数拖拉效果
	var $slider = $('.clientSum');
	var clientTotal = $("#clientTotal").text();
	var maxVal = 0;
	if (clientTotal != "" && typeof (clientTotal) != "undefined") {
		maxVal = parseInt(clientTotal);
	}
	if ($slider.length > 0) {
		$slider.slider({
			animate : true,
			min : 0,
			max : maxVal,
			value : 1,
			orientation : 'horizontal',
			range : 'min',
			number : '1'
		});
	}

	// 改变客户人数事件
	$slider.bind('slide', function(event, ui) {
		var _this = ui.value;
		var unit = 0.1;
		var total = parseInt(_this) * 0.1;
		total = total.toFixed(2);
		$("#CurClientTotal").text(_this);
		$("#CurMoneyTotal").text(total);
	});

	// 保存事件
	$(".doAddSmsBtn").click(function() {
		toastr.success('保存成功');
		window.location.href = "/merchant/personal/pCashier.jsp";
	});

	// ---------------------创建短信-------------------------------------//

	// ---------------------发送成功后，再次发送-------------------------------------//
	// 保存
	$(".doAgainSend1Btn").click(function() {
		toastr.success('发送成功');
		toSmsList();
	});

	// ---------------------发送成功后，再次发送-------------------------------------//

	// ---------------------修改短信-------------------------------------//
	// 保存
	$(".doUpdateSmsBtn").click(function() {
		toastr.success('保存成功');
		toSmsList();
	});
	// ---------------------修改短信-------------------------------------//

	// ---------------------放弃发送短信-------------------------------------//
	// 确认删除
	$(".doDeleteMessBtn").click(function() {
		toastr.success('操作成功');
		$('#deleteSms').modal("hide");
	});
	// ---------------------放弃发送短信-------------------------------------//

});

// 返回短信列表(短信列表显示，其余div隐藏)
function toSmsList() {
	$(".smsOperate").fadeOut();
	$("#smsList").fadeIn();
}
