/**
 * 
 */

// 默认筛选条件
var _val = 1;
var _text = "请输入您要搜索的代理商名称";
var curAgentId = 0;
$(function() {

	$("#agent").addClass("active");
	$("#agent").find("ul").addClass("active");
	$("#agentList").addClass("active");

	var pointer = $("<div/>").addClass("pointer");
	var arrow = $("<div/>").addClass("arrow").appendTo(pointer);
	var arrow_border = $("<div/>").addClass("arrow_border").appendTo(pointer);
	$("#agent").prepend(pointer);

	// select2 plugin for select elements
	$(".select2").select2({
		placeholder : "Select a State"
	});

	getUserList(1);

	// 搜索按钮执行事件
	$(".searchBtn").click(function() {
		getUserList(1);
	});

	// 筛选列表改变，执行事件
	$("#agentSelect").change(
			function() {
				_val = $("#agentSelect").val();
				if (_val == "2") {
					$("#searchInput").hide();
					$("#areaSeletDiv").show();
					$("#shengSelect").select2("val", -1);
					$("#shiSelect").empty();
					$("#quSelect").empty();
					$("<option/>").val(-1).text("请选择市/区").appendTo(
							$("#shiSelect"));
					$("<option/>").val(-1).text("请选择县/街道").appendTo(
							$("#quSelect"));
					$("#shiSelect").select2("val", -1);
					$("#quSelect").select2("val", -1);
				} else {
					$("#searchInput").show();
					$("#areaSeletDiv").hide();
					var _text = $("select[name=agentSelect]").find(
							"option:selected").text();
					$("#searchInput").val("").attr("placeholder",
							"请输入您要搜索的" + _text);
				}
			});

	// 省，change事件
	$("#shengSelect").change(function() {
		var shengId = $("#shengSelect").val();
		changeCity(shengId);
	});

	// 市，change事件
	$("#shiSelect").change(function() {
		var shiId = $("#shiSelect").val();
		changeXian(shiId);
	});

});

function changeCity(val) {

	if (val != -1) {
		$
				.ajax({
					url : ctx + "/store/changeCity/" + val,
					success : function(shi) {

						var aa = new Array();
						aa = shi.split(":");

						$("#quSelect").empty();
						$("<option/>").val(-1).text("请选择县/街道").appendTo(
								$("#quSelect"));
						$("#quSelect").select2("val", -1);
						$("#shiSelect").empty();
						$("<option/>").val(-1).text("请选择市/区").appendTo(
								$("#shiSelect"));
						$("#shiSelect").select2("val", -1);
						for (var i = 0; i < aa.length; i++) {
							var bb = new Array();
							bb = aa[i].split(",");
							$("<option/>").val(bb[0]).text(bb[1]).appendTo(
									$("#shiSelect"));
						}

					}
				});
	} else {
		$("#shiSelect").empty();
		$("#quSelect").empty();
		$("<option/>").val(-1).text("请选择市/区").appendTo($("#shiSelect"));
		$("<option/>").val(-1).text("请选择县/街道").appendTo($("#quSelect"));
		$("#shiSelect").select2("val", -1);
		$("#quSelect").select2("val", -1);
	}
}

// 改变县，同时将乡制空
function changeXian(val) {
	if (val != -1) {
		$
				.ajax({
					url : ctx + "/store/changeXian/" + val,
					success : function(shi) {
						var aa = new Array();
						aa = shi.split(":");

						$("#quSelect").empty();
						$("<option/>").val(-1).text("请选择县/街道").appendTo(
								$("#quSelect"));
						$("#quSelect").select2("val", -1);
						for (var i = 0; i < aa.length; i++) {
							var bb = new Array();
							bb = aa[i].split(",");
							$("<option/>").val(bb[0]).text(bb[1]).appendTo(
									$("#quSelect"));
						}
					}
				});
	} else {
		$("#quSelect").empty();
		$("<option/>").val(-1).text("请选择县/街道").appendTo($("#quSelect"));
		$("#quSelect").select2("val", -1);
	}
}

/**
 * 加载用户列表
 */
function getUserList(num) {

	showLoading();

	if (num == undefined)
		return;
	if (isNaN(num))
		return;

	var _val = $("#agentSelect").val();
	if (_val == "2") {
		var shengId = $("#shengSelect").val();
		var shiId = $("#shiSelect").val();
		var quId = $("#quSelect").val();
		var text = shengId + "," + shiId + "," + quId;
	} else {
		var text = $("#searchInput").val();
	}

	$.ajax({
		type : "POST",
		url : "getAgentList",
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
 * 生成代理商列表table
 * 
 * @param data
 * @param tableId
 */
function buildTable(data, tableId) {
	var tbody = $("#" + tableId);
	tbody.empty();
	data = data.data;
	for (var i = 0; i < data.length; i++) {

		var tr = $("<tr/>").attr("id", data[i].id).appendTo(tbody);
		if (i == 0) {
			tr.addClass("first");
		}
		var tdUserId = $("<td/>").text(data[i].realName).appendTo(tr);
		var tdRealName = $("<td/>").text(data[i].areaName).appendTo(tr);
		var tdTel = $("<td/>").text(data[i].tel).appendTo(tr);
		var tdEmail = $("<td/>").text(data[i].routerNum).appendTo(tr);

		var status = data[i].status;
		if (status == 1||status == 2) {
			var tdStatus = $("<td/>").html(
					"<span class='label label-success'>正常</span>").appendTo(tr);
			var tdOperate = $("<td/>").appendTo(tr);
			var ul = $("<ul/>").addClass("actions ul").appendTo(tdOperate);
			var li1 = $("<li/>").appendTo(ul);
			var i1 = $("<i/>").attr("data-toggle", "tooltip").attr("title",
					"停用").addClass("icon-off msg toStopAgentBtn").css("cursor",
					"pointer").appendTo(li1);
			var li2 = $("<li/>").appendTo(ul);
			var i2 = $("<i/>").attr("data-toggle", "tooltip").attr("title",
					"修改").addClass("table-edit msg toEditAgentBtn").css(
					"cursor", "pointer").appendTo(li2);
		} else if (status == 4) {
			var tdStatus = $("<td/>").html(
					"<span class='label label-important'>停用</span>").appendTo(
					tr);
			var tdOperate = $("<td/>").appendTo(tr);
			var ul = $("<ul/>").addClass("actions ul").appendTo(tdOperate);
			var li1 = $("<li/>").appendTo(ul);
			var i1 = $("<i/>").attr("data-toggle", "tooltip").attr("title",
					"开启").addClass("icon-play msg toStartAgentBtn").css(
					"cursor", "pointer").appendTo(li1);
			var li2 = $("<li/>").appendTo(ul);
			var i2 = $("<i/>").attr("data-toggle", "tooltip").attr("title",
					"修改").addClass("table-edit msg toEditAgentBtn").css(
					"cursor", "pointer").appendTo(li2);
		} else if (status == 5) {
			var tdStatus = $("<td/>").html("<span class='label'>已过期</span>")
					.appendTo(tr);
			var tdOperate = $("<td/>").appendTo(tr);
			var ul = $("<ul/>").addClass("actions ul").appendTo(tdOperate);
		} else if (status == 6) {
			var tdStatus = $("<td/>").html(
					"<span class='label label-info'>未开始</span>").appendTo(tr);
			var tdOperate = $("<td/>").appendTo(tr);
			var ul = $("<ul/>").addClass("actions ul").appendTo(tdOperate);
		} else {
			var tdStatus = $("<td/>").html("").appendTo(tr);
			var tdOperate = $("<td/>").appendTo(tr);
			var ul = $("<ul/>").addClass("actions ul").appendTo(tdOperate);
		}

	}

}

function initEvent() {
	$('.msg').tooltip('hide');
	// 修改图标，click事件
	$(".toEditAgentBtn").click(function() {
		var id = $(this).closest("tr").attr("id");
		window.location.href = "goEditAgent/" + id;
	});

	// 停用图标，click事件
	$(".toStopAgentBtn").click(function() {
		curAgentId = $(this).closest("tr").attr("id");
		$(".doStopAgentBtn").removeAttr("disabled").text("确定");
		$('#stopAgent').modal({
			backdrop : 'static'
		});
	});

	// 开启图标，click事件
	$(".toStartAgentBtn").click(function() {
		curAgentId = $(this).closest("tr").attr("id");
		$(".doStartAgentBtn").removeAttr("disabled").text("确定");
		$('#startAgent').modal({
			backdrop : 'static'
		});
	});

	// 停用提示弹框中，确定按钮click事件
	$(".doStopAgentBtn")
			.click(
					function() {
						showLoading2("停用中...");
						$(".doStopAgentBtn").attr("disabled", "disable").text(
								"停用中...");
						$
								.ajax({
									type : "POST",
									url : "editAgentStatus",
									data : {
										agentId : curAgentId,
										status : 4		//将原先的2改为4，auto:wanglei
									},
									success : function(data) {
										if (data == "true") {
											var tdStatus = $($("#" + curAgentId)
													.find("td")[4]);
											tdStatus
													.html('<span class="label label-important">停用</span>');
											var li = $($("#" + curAgentId)
													.find("ul").find("li")[0]);
											li.remove();
											var ul = $($("#" + curAgentId)
													.find("ul"));
											var li1 = $("<li/>").prependTo(ul);
											var i1 = $("<i/>")
													.attr("data-toggle",
															"tooltip")
													.attr("title", "开启")
													.addClass(
															"icon-play msg toStartAgentBtn")
													.css("cursor", "pointer")
													.appendTo(li1);
											initEvent();
											$('#stopAgent').modal("hide");
											changeToSuccess(1);
										} else {
											changeToError(1);
										}
									},
									error : function() {
										changeToError(1);
									}
								});
					});

	// 开启提示弹框中，确定按钮click事件
	$(".doStartAgentBtn")
			.click(
					function() {
						showLoading2("开启中...");
						$(".doStartAgentBtn").attr("disabled", "disable").text(
								"开启中...");
						$
								.ajax({
									type : "POST",
									url : "editAgentStatus",
									data : {
										agentId : curAgentId,
										status : 1
									},
									success : function(data) {
										if (data == "true") {
											var tdStatus = $($("#" + curAgentId)
													.find("td")[4]);
											tdStatus
													.html('<span class="label label-success">正常</span>');
											var li = $($("#" + curAgentId)
													.find("ul").find("li")[0]);
											li.remove();
											var ul = $($("#" + curAgentId)
													.find("ul"));
											var li1 = $("<li/>").prependTo(ul);
											var i1 = $("<i/>")
													.attr("data-toggle",
															"tooltip")
													.attr("title", "停用")
													.addClass(
															"icon-off msg toStopAgentBtn")
													.css("cursor", "pointer")
													.appendTo(li1);
											initEvent();
											$('#startAgent').modal("hide");
											changeToSuccess(1);
										} else {
											changeToError(1);
										}
									},
									error : function() {
										changeToError(1);
									}
								});
					});

}