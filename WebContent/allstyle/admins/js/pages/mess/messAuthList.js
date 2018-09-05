/**
 * 认证短信审核
 */

// 默认筛选条件
var _val = 1;
var curId;
var _text = "请输入您要搜索的店铺名称";

$(function() {

	$("#mess").addClass("active");
	$("#mess").find("ul").addClass("active");
	$("#messAuth").addClass("active");

	var pointer = $("<div/>").addClass("pointer");
	var arrow = $("<div/>").addClass("arrow").appendTo(pointer);
	var arrow_border = $("<div/>").addClass("arrow_border").appendTo(pointer);
	$("#mess").prepend(pointer);

	// select2 plugin for select elements
	$(".select2").select2({
		placeholder : "Select a State"
	});

	getMessAuthList(1);

	// 搜索按钮执行事件
	$(".searchBtn").click(function() {
		getMessAuthList(1);
	});

	// 筛选列表改变，执行事件
	$("#messAuthSelect").change(
			function() {
				_val = $("#messAuthSelect").val();
				if (_val == 2) {
					$("#searchInput").hide();
					$("#statusSelectDiv").show();
					$("#statusSelect").select2("val", 0);
				} else {
					$("#searchInput").show();
					$("#statusSelectDiv").hide();
					var _text = $("select[name=messAuthSelect]").find(
							"option:selected").text();
					$("#searchInput").val("").attr("placeholder",
							"请输入您要搜索的" + _text);
				}

			});

});

/**
 * 加载用户列表
 */
function getMessAuthList(num) {

	showLoading();

	if (num == undefined)
		return;
	if (isNaN(num))
		return;

	var _val = $("#messAuthSelect").val();
	var text = $("#searchInput").val();
	if (_val == 2) {
		text = $("#statusSelect").val();
	}

	$.ajax({
		type : "POST",
		url : "getMessAuthList",
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
				pageHandle("pager", "messAuthTbody", data.data, num,
						getMessAuthList, buildTable);

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

		var tr = $("<tr/>").attr("id", data[i].id).appendTo(tbody);
		if (i == 0) {
			tr.addClass("first");
		}

		var tdStoreName = $("<td/>").text(data[i].name).appendTo(tr);
		var tdContact = $("<td/>").text(data[i].contact).appendTo(tr);
		var tdTele = $("<td/>").text(data[i].tel).appendTo(tr);
		var tdContent = $("<td/>").text(data[i].content).appendTo(tr);

		var status = data[i].status;
		if (status == 1) {// 1待审核
			var tdStatus = $("<td/>").addClass("status").html(
					"<span class='label label-info'>待审核</span>").appendTo(tr);
			var tdOperate = $("<td/>").appendTo(tr);
			var ul = $("<ul/>").addClass("actions ul operate").appendTo(
					tdOperate);
			var li1 = $("<li/>").appendTo(ul);
			var i1 = $("<i/>").attr("data-toggle", "tooltip").attr("title",
					"通过").addClass("icon-ok msg ok").css("cursor", "pointer")
					.appendTo(li1);
			var li2 = $("<li/>").appendTo(ul);
			var i2 = $("<i/>").attr("data-toggle", "tooltip").attr("title",
					"不通过").addClass("icon-remove msg fail").css("cursor",
					"pointer").appendTo(li2);
		} else if (status == 2) {// 2已通过
			var tdStatus = $("<td/>").addClass("status").html(
					"<span class='label label-success'>已通过</span>")
					.appendTo(tr);
			var tdOperate = $("<td/>").appendTo(tr);
			var ul = $("<ul/>").addClass("actions ul operate").appendTo(
					tdOperate);
		} else if (status == 3) {// 3已驳回
			var tdStatus = $("<td/>").addClass("status").html(
					"<span class='label'>已驳回</span>").appendTo(tr);
			var tdOperate = $("<td/>").appendTo(tr);
			var ul = $("<ul/>").addClass("actions operate").appendTo(tdOperate);
		} else {
			var tdStatus = $("<td/>").addClass("status").html("未知")
					.appendTo(tr);
			var tdOperate = $("<td/>").appendTo(tr);
			var ul = $("<ul/>").addClass("actions").appendTo(tdOperate);
		}
	}

}

function initEvent() {
	$('.msg').tooltip('hide');

	$(".ok").unbind("click");
	$(".ok").click(function() {
		curId = $(this).closest("tr").attr("id");
		$("#okModal").modal({
			backdrop : "static"
		});
	});

	$(".doOkBtn").unbind("click");
	$(".doOkBtn")
			.click(
					function() {
						$
								.ajax({
									async : false,
									type : "post",
									url : "setAuthMessStatus",
									data : {
										id : curId,
										status : 2,
										messOption : ""
									},
									success : function(msg) {
										if ("true" == msg) {
											alert("操作成功");
											$("#" + curId)
													.find(".status")
													.html(
															"<span class='label label-success'>已通过</span>");
											$("#" + curId).find(".ul").empty();
											$("#okModal").modal("hide");
										} else {
											alert("操作失败");
										}
									}
								});
					});

	$(".fail").unbind("click");
	$(".fail").click(function() {
		curId = $(this).closest("tr").attr("id");
		$("#failModal").modal({
			backdrop : "static"
		});
	});

	$(".doFailBtn").unbind("click");
	$(".doFailBtn").click(
			function() {
				var messOption = $("#messOption").val();
				if (messOption.length < 1 || messOption.length > 250) {
					alert("意见长度限制在0-250字符内！");
					return false;
				}
				$.ajax({
					async : false,
					type : "post",
					url : "setAuthMessStatus",
					data : {
						id : curId,
						status : 3,
						messOption : $("#messOption").val()
					},
					success : function(msg) {
						if ("true" == msg) {
							toastr.success("操作成功");
							$("#" + curId).find(".status").html(
									"<span class='label'>已驳回</span>");
							$("#" + curId).find(".ul").empty();
							$("#failModal").modal("hide");
							$("#messOption").val("");
						} else {
							toastr.error("操作失败");
						}
					},
					error : function() {
						toastr.error("操作失败");
					}
				});
			});
}