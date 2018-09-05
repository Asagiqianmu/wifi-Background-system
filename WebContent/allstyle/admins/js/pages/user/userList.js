/**
 * 
 */
var curId = 0;// 当前操作用户ID

$(function() {

	$("#userList").addClass("active");

	var pointer = $("<div/>").addClass("pointer");
	var arrow = $("<div/>").addClass("arrow").appendTo(pointer);
	var arrow_border = $("<div/>").addClass("arrow_border").appendTo(pointer);
	$("#userList").prepend(pointer);

	// select2 plugin for select elements
	$(".select2").select2({
		placeholder : "Select a State"
	});

	getUserList(1);

	// 搜索按钮执行事件
	$(".searchBtn").click(function() {
		// 校验输入数据
		getUserList(1);
	});

	// 筛选列表改变，执行事件
	$("#userSelect").change(
			function() {
				var _val = $("#userSelect").val();
				if (_val == "3") {
					$("#searchInput").hide();
					$("#roleSeletDiv").show();
				} else {
					$("#searchInput").show();
					$("#roleSeletDiv").hide();
					var _text = $("select[name=userSelect]").find(
							"option:selected").text();
					$("#searchInput").val("").attr("placeholder", "请输入您要搜索的" + _text);
				}
			});

});

/**
 * 加载用户列表
 */
function getUserList(num) {

	showLoading();

	if (num == undefined)
		return;
	if (isNaN(num))
		return;

	var _val = $("#userSelect").val();
	var text = $("#searchInput").val();
	if (_val == "3") {
		text = $("#roleSelect").val();
	}

	$.ajax({
		type : "POST",
		url : "getUserList",
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
				pageHandle("pager", "userTbody", data.data, num, getUserList,
						buildTable);

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

		var tr = $("<tr/>").attr("id", data[i].userId).appendTo(tbody);
		if (i == 0) {
			tr.addClass("first");
		}
		var tdUserId = $("<td/>").text(data[i].userId).appendTo(tr);
		var tdRealName = $("<td/>").text(data[i].realName).appendTo(tr);
		var tdTel = $("<td/>").text(data[i].tel).appendTo(tr);
		var tdEmail = $("<td/>").text(data[i].email).appendTo(tr);

		var role = data[i].roleId;
		if (role == 1) {
			var tdRoleId = $("<td/>").text("管理员").appendTo(tr);
		} else if (role == 2) {
			var tdRoleId = $("<td/>").text("商家").appendTo(tr);
		} else if (role == 3) {
			var tdRoleId = $("<td/>").text("代理商").appendTo(tr);
		} else if (role == 4) {
			var tdRoleId = $("<td/>").text("推广员").appendTo(tr);
		}else{
			var tdRoleId = $("<td/>").text("未知").appendTo(tr); 
		}

		var tdAmount = $("<td/>").text(data[i].amountS).appendTo(tr);
		var tdAreaName = $("<td/>").text(data[i].areaName).appendTo(tr);
		var tdOperate = $("<td/>").appendTo(tr);
		var ul = $("<ul/>").addClass("actions ul").appendTo(tdOperate);
//		var li1 = $("<li/>").appendTo(ul);
//		var i1 = $("<i/>").attr("data-toggle", "tooltip").attr("title", "充值")
//				.addClass("icon-credit-card msg toRechargeBtn").css("cursor", "pointer")
//				.appendTo(li1);
//		var li2 = $("<li/>").appendTo(ul);
//		var i2 = $("<i/>").attr("data-toggle", "tooltip").attr("title", "编辑")
//				.addClass("icon-pencil msg").css("cursor", "pointer").appendTo(
//						li2);
//		var li5 = $("<li/>").appendTo(ul);
//		var i5 = $("<i/>").attr("data-toggle", "tooltip").attr("title", "冻结")
//				.addClass("icon-off msg").css("cursor", "pointer").appendTo(
//						li5);
//		var li3 = $("<li/>").appendTo(ul);
//		var i3 = $("<i/>").attr("data-toggle", "tooltip").attr("title", "删除")
//				.addClass("icon-remove msg").css("cursor", "pointer").appendTo(
//						li3);
		var li4 = $("<li/>").appendTo(ul);
		var i4 = $("<i/>").attr("data-toggle", "tooltip").attr("title", "重置密码")
				.addClass("icon-lock msg toResetPwdBtn").css("cursor",
						"pointer").appendTo(li4);

	}

}

function initEvent() {
	$('.msg').tooltip('hide');

	// 点击"充值"图标，click事件
	$(".toRechargeBtn").click(function() {

//		curId = $(this).closest("tr").attr("id");
//	
//		window.location.href = "recharge/" + curId;

	});
	
	
	// 点击"重置密码"图标，click事件
	$(".toResetPwdBtn").click(function() {

		$('#resetPwd').modal({
			backdrop : 'static'
		});

		curId = $(this).closest("tr").attr("id");
		$(".doResetPwdBtn").removeAttr("disabled").text("确定");

	});

	// 重置密码中，确定按钮，click事件
	$(".doResetPwdBtn").click(function() {

		showLoading2("重置中...");
		$(".doResetPwdBtn").attr("disabled", "disabled").text("重置中...");

		$.ajax({
			type : "POST",
			url : "resetPwd",
			data : {
				userId : curId
			},
			success : function(msg) {
				if (msg == "true") {// 删除成功
					changeToSuccess(1);
					$(".doResetPwdBtn").removeAttr("disabled").text("确定");
					$('#resetPwd').modal("hide");
				} else {// 添加失败
					changeToError(1);
					$(".doResetPwdBtn").removeAttr("disabled").text("确定");
				}
			},
			error : function() {
				changeToError(1);
				$(".doResetPwdBtn").removeAttr("disabled").text("确定");
			}
		});

	});

}