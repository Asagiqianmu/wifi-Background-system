/**
 * 
 */
// 默认筛选条件
var _val = 1;
var _text = "请输入您要搜索的MAC地址";
var curMac = 0;// 当前操作MAC
var curTr = 1;// 当前操作行
var curModel = 0;// 当前设备型号
var curDetails = "暂无更新";// 当前设备更新详情
var curWhiteMac = 0;// mac白名单中，当前操作mac
var curIpScope = 0;

$(function() {

	$("#deviceList").addClass("active");

	var pointer = $("<div/>").addClass("pointer");
	var arrow = $("<div/>").addClass("arrow").appendTo(pointer);
	var arrow_border = $("<div/>").addClass("arrow_border").appendTo(pointer);
	$("#deviceList").prepend(pointer);

	// select2 plugin for select elements
	$(".select2").select2({
		placeholder : "Select a State"
	});

	getDeviceList(1);

	// 搜索按钮执行事件
	$(".searchBtn").click(function() {
		// 校验输入
		getDeviceList(1);
	});

	// 筛选列表改变，执行事件
	$("#deviceSelect").change(function() {
		_val = $("#deviceSelect").val();
		_text = $("select[name=deviceSelect]").find("option:selected").text();
		$("#searchInput").val("").attr("placeholder", "请输入您要搜索的" + _text);

	});

});

/**
 * 加载广告列表
 */
function getDeviceList(num) {

	showLoading();

	if (num == undefined)
		return;
	if (isNaN(num))
		return;

	var _val = $("#deviceSelect").val();
	var text = $("#searchInput").val();

	$.ajax({
		type : "POST",
		url : "findStoreRouterList",
		data : {
			curPage : num,
			pageSize : 30,
			val : _val,
			text : text

		},
		success : function(data) {
			eval("data = " + data);
			if (data.code == 200) {
				$('body,html').animate({
					scrollTop : 0
				}, 1000);
				// 调用分页
				pageHandle("pager", "deviceTbody", data.data, num,
						getDeviceList, buildTable);
				changeToSuccess(1);
				initEvent();
			} else {
				changeToError(1);
			}
		},
		error : function() {
			changeToError(1);
		}
	});

}

/**
 * 生成店铺列表table
 * 
 * @param data
 * @param tableId
 */
function buildTable(data, tableId) {
	var tbody = $("#" + tableId);
	tbody.empty();
	data = data.data;
	for (var i = 0; i < data.length; i++) {

		var tr = $("<tr/>").attr("id", data[i].id).attr("ssid", data[i].ssid)
				.attr("versions", data[i].versions).attr("timeout",
						data[i].timeout).attr("mac", data[i].mac).attr(
						"details", data[i].details)
				.attr("model", data[i].model).appendTo(tbody);
		if (i == 0) {
			tr.addClass("first");
		}
		var tdStoreName = $("<td/>").text(data[i].storeName).appendTo(tr);
		var tdOnLine = $("<td/>").text(data[i].authcount).appendTo(tr);
		var tdInstallPosition = $("<td/>").text(data[i].installPosition)
				.appendTo(tr);
		var tdMac = $("<td/>").text(data[i].mac).appendTo(tr);
		var tdWanIp = $("<td/>").text(data[i].wanIp).appendTo(tr);

		var status = data[i].status;
		if (status == 1) {
			var tdStatus = $("<td/>").addClass("status").html(
					"<span class='label label-success'>在线</span>").appendTo(tr);
		} else if (status == 2) {
			var tdStatus = $("<td/>").html("<span class='label'>离线</span>")
					.appendTo(tr);
		}
		var tdOnlineTime = $("<td/>").text(
				data[i].shi + " 时 " + data[i].fen + " 分").appendTo(tr);
		if (status == 1) {

			var tdOperate = $("<td/>").appendTo(tr);
			var ul = $("<ul/>").addClass("actions ul").appendTo(tdOperate);
			var li1 = $("<li/>").appendTo(ul);
			var i1 = $("<i/>").attr("data-toggle", "tooltip").attr("title",
					"热点名称").addClass("icon-pencil msg toEditSsidBtn").css(
					"cursor", "pointer").appendTo(li1);
			var li2 = $("<li/>").appendTo(ul);
			var i2 = $("<i/>").attr("data-toggle", "tooltip").attr("title",
					"白名单").addClass("icon-road msg toMacWhiteBtn").css(
					"cursor", "pointer").appendTo(li2);
			var li3 = $("<li/>").appendTo(ul);
			var i3 = $("<i/>").attr("data-toggle", "tooltip").attr("title",
					"超时时间").addClass("icon-time msg toEditTimeOutBtn").css(
					"cursor", "pointer").appendTo(li3);
			var li4 = $("<li/>").appendTo(ul);
			var i4 = $("<i/>").attr("data-toggle", "tooltip").attr("title",
					"重启路由").addClass("icon-refresh msg toResetRouterBtn").css(
					"cursor", "pointer").appendTo(li4);
			var li5 = $("<li/>").appendTo(ul);
			var i5 = $("<i/>").attr("data-toggle", "tooltip").attr("title",
					"带宽控制").addClass("icon-signal msg toIpRulesBtn").css(
					"cursor", "pointer").appendTo(li5);
			var li6 = $("<li/>").appendTo(ul);
			var i6 = $("<i/>").attr("data-toggle", "tooltip").attr("title",
					"固件升级").addClass("icon-arrow-up msg toUpFirmwareBtn").css(
					"cursor", "pointer").appendTo(li6);
			var li7 = $("<li/>").appendTo(ul);
			var i7 = $("<i/>").attr("data-toggle", "tooltip").attr("title",
					"路由密码").addClass("icon-lock msg toEditRouterPwdBtn").css(
					"cursor", "pointer").appendTo(li7);
			var li8 = $("<li/>").appendTo(ul);
			var i8 = $("<i/>").attr("data-toggle", "tooltip").attr("title",
					"删除设备").addClass("icon-remove msg toDeleteRouterBtn").css(
					"cursor", "pointer").appendTo(li8);

		} else if (status == 2) {
			var tdOperate = $("<td/>").text("").appendTo(tr);
			var ul = $("<ul/>").addClass("actions ul").appendTo(tdOperate);
			var li8 = $("<li/>").appendTo(ul);
			var i8 = $("<i/>").attr("data-toggle", "tooltip").attr("title",
					"删除设备").addClass("icon-remove msg toDeleteRouterBtn").css(
					"cursor", "pointer").appendTo(li8);
		}

	}

}

// 初始化事件
function initEvent() {

	// 列表中，操作列，鼠标移在图标上，显示提示信息
	$('.msg').tooltip('hide');

	$(".toEditSsidBtn").unbind("click");
	// 点击"修改热点名称"图标，执行事件
	$(".toEditSsidBtn").click(function() {

		$('#editSsid').modal({
			backdrop : 'static'
		});

		$(".doSaveSsidBtn").removeAttr("disabled").text("保存");

		$("#editSsidForm")[0].reset(); // 重置form

		var oldSsid = $(this).closest("tr").attr("ssid");
		$("#oldSsid").val(oldSsid);

		curMac = $(this).closest("tr").attr("mac");
		curTr = $(this).closest("tr").attr("id");

	});

	$(".doSaveSsidBtn").unbind("click");
	// 修改热点名称弹框中，点击"保存"按钮执行事件
	$(".doSaveSsidBtn").click(function() {

		$("#editSsidForm").submit();

	});
	
	$(".toDeleteRouterBtn").unbind("click");
	// 点击"删除设备"图标，执行事件
	$(".toDeleteRouterBtn").click(function() {

		$('#deleteRouter').modal({
			backdrop : 'static'
		});

		curMac = $(this).closest("tr").attr("mac");
		curTr = $(this).closest("tr").attr("id");
		$(".doDeleteRouterBtn").removeAttr("disabled").text("删除");

	});

	$(".doDeleteRouterBtn").unbind("click");
	// 确认删除
	$(".doDeleteRouterBtn").click(function() {

		showLoading2("删除中···");
		$(".doDeleteRouterBtn").attr("disabled", "disabled").text("删除中...");
		$.ajax({
			type : "POST",
			url : "delMac",
			data : {
				mac : curMac,
			},
			success : function(msg) {
				if (msg == "success") {
					$("#"+curTr).remove();
					changeToSuccess(1);
					$('#deleteRouter').modal("hide");
					curMac = 0;
					$(".doDeleteRouterBtn").removeAttr("disabled").text("删除");
				} else {// 添加失败
					changeToError(1);
					$(".doDeleteRouterBtn").removeAttr("disabled").text("删除");
				}
			},
			error : function() {
				changeToError(30);
				$(".doDeleteRouterBtn").removeAttr("disabled").text("删除");
			}
		});
	});

	$(".toMacWhiteBtn").unbind("click");
	// 点击"mac白名单"图标，执行事件
	$(".toMacWhiteBtn").click(function() {

		$('#macWhite').modal({
			backdrop : 'static'
		});

		$("#macModelLabel").text("MAC白名单管理");
		$("#addMacWhiteForm")[0].reset(); // 重置form
		

		curMac = $(this).closest("tr").attr("mac");
		getMacWhiteList(1);

	});

	$(".toEditTimeOutBtn").unbind("click");
	// 点击"修改超时时间"图标，执行事件
	$(".toEditTimeOutBtn").click(function() {

		$('#editTimeOut').modal({
			backdrop : 'static'
		});

		$(".doSaveTimeOutBtn").removeAttr("disabled").text("保存");

		$("#editTimeOutForm")[0].reset(); // 重置form

		var timeout = $(this).closest("tr").attr("timeout");
		$("#oldTimeout").val(timeout);

		curMac = $(this).closest("tr").attr("mac");
		curTr = $(this).closest("tr").attr("id");

	});

	$(".doSaveTimeOutBtn").unbind("click");
	// 修改超时时间弹框中，点击"保存"按钮执行事件
	$(".doSaveTimeOutBtn").click(function() {

		$("#editTimeOutForm").submit();

	});

	$(".toResetRouterBtn").unbind("click");
	// 点击"重启路由"图标，执行事件
	$(".toResetRouterBtn").click(function() {

		$('#resetRouter').modal({
			backdrop : 'static'
		});

		$(".doResetRouterBtn").removeAttr("disabled").text("确认");

		curMac = $(this).closest("tr").attr("mac");

	});
	$(".doResetRouterBtn").unbind("click");

	// 确认重启
	$(".doResetRouterBtn").click(function() {

		showLoading2("重启中···");
		$(".doResetRouterBtn").attr("disabled", "disabled").text("重启中...");
		$.ajax({
			type : "POST",
			url : ctx + "/storeRouter/resetRouter",
			data : {
				mac : curMac,
			},
			success : function(msg) {
				if (msg == "success") {
					changeToSuccess(30);
					setTimeout(function() {
						$('#resetRouter').modal("hide");
					}, 30 * 1000);
					curMac = 0;
				} else {// 添加失败
					changeToError(30);
					$(".doResetRouterBtn").removeAttr("disabled").text("确认");
				}
			},
			error : function() {
				changeToError(30);
				$(".doResetRouterBtn").removeAttr("disabled").text("确认");
			}
		});
	});

	$(".toIpRulesBtn").unbind("click");
	// 点击"带宽控制"图标，执行事件
	$(".toIpRulesBtn").click(function() {

		$('#ipRules').modal({
			backdrop : 'static'
		});

		curMac = $(this).closest("tr").attr("mac");

		getIpRulesList(1);

	});

	$(".toUpFirmwareBtn").unbind("click");
	// 点击"固件升级"图标，执行事件
	$(".toUpFirmwareBtn").click(function() {

		$('#upFirmware').modal({
			backdrop : 'static'
		});

		$(".doUpFirmwareBtn").removeAttr("disabled").text("确定升级");

		curMac = $(this).closest("tr").attr("mac");
		var versions = $(this).closest("tr").attr("versions").split(",");
		$("#curVersion").text(versions[0]);
		$("#newVersion").text(versions[1]);
		curModel = $(this).closest("tr").attr("model");
		curDetails = $(this).closest("tr").attr("details");
		$("#details").text(curDetails);

		if (versions[0] == versions[1]) {
			$(".doUpFirmwareBtn").attr("disabled", "true").text("暂无更新");
		}

	});

	$(".doUpFirmwareBtn").unbind("click");
	// 修改热点名称弹框中，点击"保存"按钮执行事件
	$(".doUpFirmwareBtn").click(function() {

		showLoading2("升级中···");
		$(".doUpFirmwareBtn").attr("disabled", "disabled").text("升级中...");

		$.ajax({
			type : "POST",
			url : ctx + "/storeRouter/updateVersion",
			data : {
				mac : curMac,
				model : curModel
			},
			success : function(msg) {// 返回需有用户名、密码
				if (msg == "success") {// 删除成功
					changeToSuccess(300);
					setTimeout(function() {
						$('#upFirmware').modal("hide");
						curMac = 0;
						curModel = 0;
						curDetails = "暂无更新";
					}, 300 * 1000);
				} else {// 添加失败
					changeToError(300);
					$(".doUpFirmwareBtn").removeAttr("disabled").text("确定升级");
				}
			},
			error : function() {
				changeToError(3);
				$(".doUpFirmwareBtn").removeAttr("disabled").text("确定升级");
			}
		});

	});

	$(".toEditRouterPwdBtn").unbind("click");
	// 点击"路由密码"图标，执行事件
	$(".toEditRouterPwdBtn").click(function() {

		$('#editRouterPwd').modal({
			backdrop : 'static'
		});

		$(".doSaveRouterPwdBtn").removeAttr("disabled").text("保存");

		$("#editRouterPwdForm")[0].reset(); // 重置form

		curMac = $(this).closest("tr").attr("mac");

	});

	$(".doSaveRouterPwdBtn").unbind("click");
	// 修改热点名称弹框中，点击"保存"按钮执行事件
	$(".doSaveRouterPwdBtn").click(function() {

		$("#editRouterPwdForm").submit();

	});

}

// 加载iP规则列表
function getIpRulesList(num) {

	showLoading2("加载中..");

	if (num == undefined)
		return;
	if (isNaN(num))
		return;

	$.ajax({
		type : "POST",
		url : ctx + "/storeRouter/rulerList",
		data : {
			curPage : num,
			pageSize : 10,
			mac : curMac,
			condition : ""
		},
		success : function(data) {
			eval("data = " + data);
			if (data.code == 200) {
				// 调用分页
				pageHandle("pager3", "ipRulesTbody", data.data, num,
						getIpRulesList, buildIpRulesTable);
				initIpRulesEvent();
				changeToSuccess(1);
			} else {
				changeToError(1);
			}
		},
		error : function() {
			changeToError(1);
		}
	});

}

// 生成ip带宽控制表格
function buildIpRulesTable(data, tableId) {
	var tbody = $("#" + tableId);
	tbody.empty();
	data = data.data;
	for (var i = 0; i < data.length; i++) {

		var tr = $("<tr/>").attr("ipScope", data[i].ipScope).appendTo(tbody);
		if (i == 0) {
			tr.addClass("first");
		}

		var tdStoreName = $("<td/>").text(data[i].ipScope).appendTo(tr);
		var tdOnLine = $("<td/>").text(data[i].maxDownLoad + "KB/S").appendTo(
				tr);
		var tdInstallPosition = $("<td/>").text(data[i].maxUpLoad + "KB/S")
				.appendTo(tr);
		var tdOperate = $("<td/>").appendTo(tr);
		var ul = $("<ul/>").addClass("actions").appendTo(tdOperate);
		var li1 = $("<li/>").appendTo(ul);
		var i1 = $("<i/>").attr("data-toggle", "tooltip").attr("title", "移除")
				.addClass("icon-trash msg toDeteleIpRulesBtn").css("cursor",
						"pointer").appendTo(li1);
	}
}
// ip带宽控制：初始化事件
function initIpRulesEvent() {

	$("#startIp").keyup(function() {
		checkStartIp();
	});

	$("#endIp").keyup(function() {
		checkStartIp();
	});

	// 列表中，操作列，鼠标移在图标上，显示提示信息
	$('.msg').tooltip('hide');

	$(".toAddRulesBtn").unbind("click");
	// 点击”添加规则“按钮，执行事件
	$(".toAddRulesBtn").click(function() {
		$("#addIpRulesForm")[0].reset(); // 重置form
		$("#ipRulesTable").hide();
		$("#addIpRules").show();
		$("#ipModelLabel").text("添加规则");
	});
	$(".doAddIpRulesBtn").unbind("click");
	// ”添加规则“中，保存按钮，执行事件
	$(".doAddIpRulesBtn").click(function() {
		checkStartIp(); // 调用校验ip的方法
		$("#addIpRulesForm").submit();
	});
	$(".toIpRulesTableBtn").unbind("click");
	// 返回IP规则列表
	$(".toIpRulesTableBtn").click(function() {
		$("#addIpRules").hide();
		$("#deleteIpRules").hide();
		$("#ipRulesTable").show();
		$("#ipModelLabel").text("IP带宽控制");
	});
	$(".toDeteleIpRulesBtn").unbind("click");
	// 点击”移除图标“，执行事件
	$(".toDeteleIpRulesBtn").click(function() {
		$("#ipRulesTable").hide();
		$("#deleteIpRules").show();
		$("#ipModelLabel").text("移除IP规则");
		curIpScope = $(this).closest("tr").attr("ipscope");
		$("#deleteIp").text(curIpScope);
	});
	$(".doDeleteIpRulesBtn").unbind("click");
	// 删除IP中，确定按钮，执行事件
	$(".doDeleteIpRulesBtn").click(function() {
		showLoading2("删除中...");

		$.ajax({
			type : "POST",
			url : ctx + "/storeRouter/delRuler",
			data : {
				mac : curMac,
				haoduan : curIpScope
			},
			success : function(msg) {// 返回需有用户名、密码
				if (msg == "true") {// 删除成功
					alert('删除成功');
					$("#deleteIpRules").hide();
					$("#ipRulesTable").show();
					$("#ipModelLabel").text("IP带宽控制");
					getIpRulesList(1);
					changeToSuccess(1);
				} else {// 添加失败
					alert('删除失败');
					changeToError(1);
				}
			},
			error : function() {
				changeToError(1);
			}
		});

	});

}

// 校验起始ip
function checkStartIp() {
	$("#ipSpan").text("");
	var startIp = $.trim($("#startIp").val());
	if (isNaN(startIp)) { // 条件成立则不是数字
		$("#ipSpan").text("ip起始号段必须是1~253之间的整数");
		return false;
	}

	if (startIp == "") {
		$("#ipSpan").text("请填写ip起始号段");
		return false;
	}
	var reg = /^[1-9]+[0-9]*]*$/;

	if (!reg.test(startIp)) { // 不是正整数就不合法
		$("#ipSpan").text("ip起始号段必须是1~253之间的整数");
		return false;
	} else {
		startIp = parseInt(startIp);
	}
	if (startIp < 1 || startIp > 253) {
		$("#ipSpan").text("ip起始号段必须是1~253之间的整数");
		return false;
	}
	var endIp = $.trim($("#endIp").val());
	if (isNaN(endIp)) { // 条件成立则不是数字
		$("#ipSpan").text("ip结束号段必须是1~253之间的整数");
		return false;
	}
	if (endIp == "") { // 如果结束号段不为空，则校验是否大于结束号段。
		$("#ipSpan").text("请填写ip结束号段");
		return false;
	} else {
		if (!reg.test(endIp)) {
			$("#ipSpan").text("ip结束号段必须是2~254之间的整数");
			return false;
		} else {
			endIp = parseInt(endIp);
		}

		if (endIp < 2 || endIp > 254) { // 判断结束ip是否在2~254之间
			$("#ipSpan").text("ip结束号段必须是2~254之间的整数");
			return false;
		} else { // 判断startIp是否小于endIp
			if (startIp >= endIp) {
				$("#ipSpan").text("ip开始号段必须小于结束号段");
				return false;
			} else {
				return true;
			}
		}
	}

}

// 验证限速的参数
$("#addIpRulesForm").validate({
	errorPlacement : function(error, element) {
		$('<br/>').appendTo(element.parent()); // 有这句就在下方提示错误信息
		error.css({
			display : "inline",
			color : "#F00",
			position : "relative",
		}).appendTo(element.parent().addClass("error"));
	},
	submitHandler : function() {
		$.ajax({
			type : "POST",
			url : ctx + "/storeRouter/saveRuler",
			data : {
				mac : curMac,
				startIp : $.trim($("#startIp").val()),
				endIp : $.trim($("#endIp").val()),
				maxDownLoad : $.trim($("#maxDownLoad").val()),
				maxUpload : $.trim($("#maxUpload").val())
			},
			success : function(msg) {// 返回需有用户名、密码
				if (msg == "true") {// 删除成功
					$("#ipRulesTable").show();
					$("#addIpRules").hide();
					$("#bandwidth").text("IP带宽设置");
					alert('保存成功');
					getIpRulesList(1);
					changeToSuccess(1);
				} else if (msg == "isContain") {
					alert('ip号段错误');
				} else {// 添加失败
					alert('保存失败');
				}
			},
			error : function() {
				changeToError(1);
			}
		});
	},
	rules : {
		maxDownLoad : {
			required : true,
			digits : true, // 必须是整数
			min : 1,
			max : 10000
		// 最大上传10000K
		},
		maxUpload : {
			required : true,
			digits : true, // 必须是整数
			min : 1,
			max : 10000
		// 最大上传10000K
		}
	},
	messages : {
		maxDownLoad : {
			required : "请填写最大下载值:1~10000",
			digits : "下载值必须是整数",
			min : "下载值最小为1",
			max : "下载值最大为10000"
		},
		maxUpload : {
			required : "请填写最大上传值:1~10000",
			digits : "上传值必须是整数",
			min : "上传值最小为1",
			max : "上传值最大为10000"
		}
	}
});

// 校验热点名称
$("#editSsidForm").validate({
	errorPlacement : function(error, element) {
		$('<br/>').appendTo(element.parent()); // 有这句就在下方提示错误信息
		error.css({
			display : "inline",
			color : "#F00",
			position : "relative",
		}).appendTo(element.parent().addClass("error"));
	},
	submitHandler : function() {

		showLoading2("保存中");

		var ssid = $("#newSsid").val();
		$(".doSaveSsidBtn").attr("disabled", "disabled").text("保存中...");
		$.ajax({
			type : "POST",
			url : ctx + "/storeRouter/saveSsid",
			data : {
				mac : curMac,
				ssid : ssid
			},
			success : function(msg) {// 返回需有用户名、密码
				if (msg == "success") {// 删除成功
					$('#editSsid').modal("hide");
					$("#" + curTr).attr("ssid", ssid);
					changeToSuccess(1);
					curMac = 0;
					curTr = 1;
					$(".doSaveSsidBtn").removeAttr("disabled").text("保存");
				} else {// 添加失败
					changeToError(1);
					$(".doSaveSsidBtn").removeAttr("disabled").text("保存");
				}
			},
			error : function() {
				changeToError(1);
				$(".doSaveSsidBtn").removeAttr("disabled").text("保存");
			}
		});
	},
	rules : {
		newSsid : {
			required : true,
			maxlength : 16
		},
	},
	messages : {
		newSsid : {
			required : "请输入新名称",
			maxlength : "名称最大长度是16"
		},
	}
});

/**
 * 加载mac白名单列表
 */
function getMacWhiteList(num) {

	showLoading2("加载中..");

	if (num == undefined)
		return;
	if (isNaN(num))
		return;

	$.ajax({
		type : "POST",
		url : ctx + "/storeRouter/whiteList",
		data : {
			curPage : num,
			pageSize : 10,
			mac : curMac
		},
		success : function(data) {
			eval("data = " + data);
			if (data.code == 200) {
				// 调用分页
				pageHandle("pager2", "macTbody", data.data, num,
						getMacWhiteList, buildMacWhiteTable);
				initMacWhiteEvent();
				changeToSuccess(1);
			} else {
				changeToError(1);
			}
		},
		error : function() {
			changeToError(1);
		}
	});

}

// 初始化事件
function initMacWhiteEvent() {

	// 列表中，操作列，鼠标移在图标上，显示提示信息
	$('.msg').tooltip('hide');
	$(".toDeleteMacBtn").unbind("click");
	// 点击"移除"图标，执行事件
	$(".toDeleteMacBtn").click(function() {

		$("#whiteMaTable").hide();
		$('#deleteMacWhite').show();
		$("#macModelLabel").text("移除MAC白名单");

		curWhiteMac = $(this).closest("tr").attr("mac");
		$("#deleteWhiteMac").text(curWhiteMac);
	});
	$(".doDeleteMacWhiteBtn").unbind("click");
	$(".doDeleteMacWhiteBtn").click(function() {

		showLoading2("删除中...");

		$.ajax({
			type : "POST",
			url : ctx + "/storeRouter/deleteWhiteList",
			data : {
				mac : curMac,
				delMac : curWhiteMac
			},
			success : function(msg) {
				if (msg == "true") {

					$("#whiteMaTable").show();
					$('#deleteMacWhite').hide();
					$("#macModelLabel").text("MAC白名单管理");

					getMacWhiteList(1);
					changeToSuccess(1);
					curWhiteMac = 0;
					curWhiteMacTr = 1;

				} else {// 添加失败
					changeToError(1);
				}
			},
			error : function() {
				changeToError(1);
			}
		});

	});
	$(".toAddMacWhiteBtn").unbind("click");
	// 点击”添加mac白名单“按钮，执行事件
	$(".toAddMacWhiteBtn").click(function() {
		$("#whiteMaTable").hide();
		$('#addMacWhite').show();
		$("#macModelLabel").text("添加MAC白名单");
		$("#editRouterPwdForm")[0].reset(); // 重置form
	});
	$(".toMacWhiteBtn").unbind("click");
	// ”mac白名单“中，点击取消按钮，执行事件
	$(".toMacWhiteBtn").click(function() {
		$('#whiteMaTable').show();
		$("#addMacWhite").hide();
		$("#deleteMacWhite").hide();
		$("#macModelLabel").text("MAC白名单管理");
	});
	$(".doAddMacWhiteBtn").unbind("click");
	// ”添加mac白名单“中，”保存“按钮执行事件
	$(".doAddMacWhiteBtn").click(function() {
		$("#addMacWhiteForm").submit();
	});

}

// （验证mac地址）
jQuery.validator
		.addMethod(
				"isMac",
				function(value, element) {
					var mac = /^[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}$/;
					return this.optional(element) || mac.test(value);
				}, "请输入正确格式的mac地址，例：15:22:44:6a:22:77");

// 验证该mac地址是否已经存在于白名单
jQuery.validator.addMethod("macIsInWhiteList", function(value, element) {
	var flag = false;
	$.ajax({
		type : "POST",
		async : false,
		url : ctx + "/storeRouter/isExistInWhiteList",
		data : {
			mac : curMac,
			checkMac : value
		},
		success : function(shi) {// 如果为true说明已经存在
			if (shi == "true") {
				flag = false;
			} else {
				flag = true;
			}
		}
	});
	return this.optional(element) || flag; // true是通过验证
}, "该mac地址已经存在于白名单");

// 验证添加mac白名单表单
$("#addMacWhiteForm").validate({
	errorPlacement : function(error, element) {
		$('<br/>').appendTo(element.parent()); // 有这句就在下方提示错误信息
		error.css({
			display : "inline",
			color : "#F00",
			position : "relative",
		}).appendTo(element.parent().addClass("error"));
	},
	submitHandler : function() {
		showLoading2("保存中");
		$(".doAddMacWhiteBtn").attr("disabled", "disabled").text("保存中...");
		$.ajax({
			type : "POST",
			url : ctx + "/storeRouter/addMacWhiteList",
			data : {
				storeRouterMac : curMac,
				mac : $("#mac2").val(),
				deviceName : $("#deviceName2").val()
			},
			success : function(msg) {// 返回需有用户名、密码
				if (msg == "true") {
					$(".doAddMacWhiteBtn").removeAttr("disabled").text("确定");
					$('#whiteMaTable').show();
					$("#addMacWhite").hide();
					$("#macModelLabel").text("MAC白名单管理");
					getMacWhiteList(1);
					changeToSuccess(1);
					$(".doAddMacWhiteBtn").removeAttr("disabled").text("保存");
				} else {// 添加失败
					changeToError(1);
					$(".doAddMacWhiteBtn").removeAttr("disabled").text("保存");
				}
			},
			error : function() {
				changeToError(1);
				$(".doAddMacWhiteBtn").removeAttr("disabled").text("保存");
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
			maxlength : "mac最大长度是17",
			isMac : "请输入正确格式的mac地址，例：15:22:44:6a:22:77",
			macIsInWhiteList : "该mac地址已经存在于白名单",

		},
		deviceName2 : {
			required : "请输入备注名称",
			maxlength : "备注名称最大长度是10"
		}
	}
});
// 构建mac白名单表格
function buildMacWhiteTable(data, tableId) {
	var tbody = $("#" + tableId);
	tbody.empty();
	data = data.data;
	for (var i = 0; i < data.length; i++) {

		var tr = $("<tr/>").attr("mac", data[i].mac).appendTo(tbody);
		if (i == 0) {
			tr.addClass("first");
		}

		var tdStoreName = $("<td/>").text(data[i].mac).appendTo(tr);
		var tdOnLine = $("<td/>").text("mac").appendTo(tr);
		var tdInstallPosition = $("<td/>").text(data[i].deviceName)
				.appendTo(tr);

		var tdOperate = $("<td/>").appendTo(tr);
		var ul = $("<ul/>").addClass("actions").appendTo(tdOperate);
		var li1 = $("<li/>").appendTo(ul);
		var i1 = $("<i/>").attr("data-toggle", "tooltip").attr("title", "移除")
				.addClass("icon-trash msg toDeleteMacBtn").css("cursor",
						"pointer").appendTo(li1);
	}
}

// 校验超时时间
$("#editTimeOutForm").validate({
	errorPlacement : function(error, element) {
		$('<br/>').appendTo(element.parent()); // 有这句就在下方提示错误信息
		error.css({
			display : "inline",
			color : "#F00",
			position : "relative",
		}).appendTo(element.parent().addClass("error"));
	},
	submitHandler : function() {

		showLoading2("保存中");

		$(".doSaveTimeOutBtn").attr("disabled", "disabled").text("保存中...");
		var timeout = $("#newTimeout").val();
		$.ajax({
			type : "POST",
			url : ctx + "/storeRouter/saveTimeout",
			data : {
				mac : curMac,
				timeout : timeout
			},
			success : function(msg) {
				if (msg == "success") {
					$('#editTimeOut').modal("hide");
					$("#" + curTr).attr("timeout", timeout);
					changeToSuccess(1);
					curMac = 0;
					curTr = 1;
				} else {// 添加失败
					changeToError(1);
				}
			},
			error : function() {
				changeToError(1);
			}
		});
	},
	rules : {
		newTimeout : {
			required : true,
			digits:true,
			range:[10,1440] 
		},
	},
	messages : {
		newTimeout : {
			required : "请输入超时时间",
			digits : "请输入正整数",
			range : "超时时间最少为10分钟，最多为一天"
		},
	}
});

// 校验路由密码
$("#editRouterPwdForm").validate({
	errorPlacement : function(error, element) {
		error.css({
			display : "inline",
			color : "#F00",
			position : "relative",
		}).appendTo(element.parent().addClass("error"));
	},
	submitHandler : function() {
		showLoading2("保存中...");
		$(".doSaveRouterPwdBtn").attr("disabled", "disabled").text("保存中...");
		var password = $("#password").val();
		$.ajax({
			type : "POST",
			url : ctx + "/storeRouter/saveNewPass",
			data : {
				mac : curMac,
				password : password
			},
			success : function(msg) {
				if (msg == "success") {
					$('#editRouterPwd').modal("hide");
					changeToSuccess(1);
					curMac = 0;
					$(".doSaveRouterPwdBtn").removeAttr("disabled").text("保存");
				} else if (msg == "notVersion") {
					changeToError(1);
					$(".doSaveRouterPwdBtn").removeAttr("disabled").text("保存");
				} else {
					changeToError(1);
					$(".doSaveRouterPwdBtn").removeAttr("disabled").text("保存");
				}
			},
			error : function() {
				changeToError(1);
				$(".doSaveRouterPwdBtn").removeAttr("disabled").text("保存");
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
			maxlength : "密码最大长度是16"
		},
		querenPassword : {
			required : "请再次输入密码",
			equalTo : "两次密码输入不一致",
			maxlength : "密码最大长度是16"
		}
	}
});