/**
 * 
 */

Date.prototype.Format = function(fmt) { // author: meizz
	var o = {
		"M+" : this.getMonth() + 1, // 月份
		"d+" : this.getDate(), // 日
		"h+" : this.getHours(), // 小时
		"m+" : this.getMinutes(), // 分
		"s+" : this.getSeconds(), // 秒
		"q+" : Math.floor((this.getMonth() + 3) / 3), // 季度
		"S" : this.getMilliseconds()
	// 毫秒
	};
	if (/(y+)/.test(fmt))
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "")
				.substr(4 - RegExp.$1.length));
	for ( var k in o)
		if (new RegExp("(" + k + ")").test(fmt))
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k])
					: (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
}

// 默认筛选条件
var _val = 1;
var _text = "请输入您要搜索的店铺名称";

$(function() {

	$("#storeList").addClass("active");

	var pointer = $("<div/>").addClass("pointer");
	var arrow = $("<div/>").addClass("arrow").appendTo(pointer);
	var arrow_border = $("<div/>").addClass("arrow_border").appendTo(pointer);
	$("#storeList").prepend(pointer);

	// select2 plugin for select elements
	$(".select2").select2({
		placeholder : "Select a State"
	});

	getStoreList(1);

	// 搜索按钮执行事件
	$(".searchBtn").click(function() {
		getStoreList(1);
	});

	// 筛选列表改变，执行事件
	$("#storeSelect").change(function() {
		_val = $("#storeSelect").val();
		if (_val == "3") {
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
			_text = $("select[name=storeSelect]").find("option:selected").text();
			$("#searchInput").val("").attr("placeholder", "请输入您要搜索的" + _text);
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
function getStoreList(num) {

	showLoading();

	if (num == undefined)
		return;
	if (isNaN(num))
		return;

	var _val = $("#storeSelect").val();
	var text = $("#searchInput").val();
	if (_val == "3") {
		var shengId = $("#shengSelect").val();
		var shiId = $("#shiSelect").val();
		var quId = $("#quSelect").val();
		var text = shengId + "," + shiId + "," + quId;
	} else {
		var text = $("#searchInput").val();
	}

	$.ajax({
		type : "POST",
		url : "getStoreList",
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
				pageHandle("pager", "storeTbody", data.data, num, getStoreList,
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

		var tr = $("<tr/>").attr("id", data[i].id).appendTo(tbody);
		if (i == 0) {
			tr.addClass("first");
		}

		var tdStoreName = $("<td/>").text(data[i].name).appendTo(tr);
		var tdTele = $("<td/>").text(data[i].tele).appendTo(tr);
		var tdAddress = $("<td/>").text(data[i].address).appendTo(tr);
		var tdContact = $("<td/>").text(data[i].contact).appendTo(tr);

		var num = data[i].num;
		if (num <30 ) {
			var tdStatus = $("<td/>").addClass("status").html("<span class='label label-success'>空闲</span>").appendTo(tr);
		} else if (num >=30 && num<=60) {
			var tdStatus = $("<td/>").addClass("status").html("<span class='label label-important'>繁忙</span>").appendTo(tr);
		}else{
			var tdStatus = $("<td/>").addClass("status").html("<span class='label label-warning'>拥堵</span>").appendTo(tr);
		}
		var tdCreatime = $("<td/>").text(new Date(data[i].createTime.time).Format("yyyy-MM-dd hh:mm:ss")).appendTo(tr);
		var tdOperate = $("<td/>").appendTo(tr);
		var ul = $("<ul/>").addClass("actions ul").appendTo(tdOperate);
		var li2 = $("<li/>").appendTo(ul);
		var i2 = $("<i/>").attr("data-toggle", "tooltip").attr("title", "修改")
				.addClass("table-edit msg toEditStoreBtn").css("cursor", "pointer").appendTo(
						li2);
//		var li3 = $("<li/>").appendTo(ul);
//		var i3 = $("<i/>").attr("data-toggle", "tooltip").attr("title", "删除")
//				.addClass("table-delete msg").css("cursor", "pointer")
//				.appendTo(li3);

	}

}

function initEvent() {
	$('.msg').tooltip('hide');
	// 修改图标，click事件
	$(".toEditStoreBtn").click(function() {
		var id = $(this).closest("tr").attr("id");
		window.location.href = "goEditStore/" + id;
	});
}