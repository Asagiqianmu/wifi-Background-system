/**
 * 店铺应用js
 */

var routerNum = 0;
var flag = false;
var flagToMain = 1;// 返回应用首页，是否刷新页面1:不刷新，2刷新
$(function() {

	// --------------------左侧菜单---------------------------//
	$("#webManage").addClass("active");
	$("#sApply").addClass("active");
	$("#webFlag").removeClass("icon-chevron-right").addClass(
			"icon-chevron-down");
	if (navigator.appName == "Microsoft Internet Explorer"
			&& navigator.appVersion.match(/8./i) == "8.") {

		$("#ie81").css("width", "848px");
		$("#ie82").css("width", "828px");
		$("#ie83").css("width", "828px");
	}
	// 左侧菜单：网站管理
	var flag = 1;
	$("#webManage").click(
			function() {
				if (flag == 2) {
					$("#webFlag").removeClass("icon-chevron-right").addClass(
							"icon-chevron-down");
					$("#webManage").css("margin-bottom", "0px");
					$("#webManage").find("a").css("border-radius",
							"5px 5px 0px 0px");
					flag = 1;
				} else {
					$("#webFlag").removeClass("icon-chevron-down").addClass(
							"icon-chevron-right");
					$("#webManage").css("margin-bottom", "4px");
					$("#webManage").find("a").css("border-radius",
							"5px 5px 5px 5px");
					flag = 2;
				}
				$("#sAuth").toggle();
				$("#sDecorate").toggle();
				$("#sApply").toggle();
			});

	getMyStoreProduct(1);// 我的应用
	getApplyStore(1);// 应用商店、推荐应用
	getApplySort(1, 1);// 最新应用
	getApplySort(1, 2);// 最热应用

	// 获取其他数据
	getOtherData();

	// 确认付款按钮
	$(".toPayApplyBtn")
			.click(
					function() {
						
						var type = $(this).attr("type");
						var productId = $(this).attr("productId");
						if (type == 1) {// 立即使用
							var url = $(this).attr("url");
							flagToMain = 2;
							$
									.ajax({
										type : "POST",
										url : "doBuyFreeApply",
										data : {
											productId : productId
										},
										success : function(data) {
											eval("data = " + data);
											if (data.code == 200) {
												if (productId == 5
														|| productId == 8) {
													toastr.success("开启成功！");
													setTimeout(
															function() {
																window.location.href = "gotoAppStore";
															}, 500);
												} else {
													toastr.success("开启成功！");
													setTimeout(
															function() {
																window.location.href = url;
															}, 500);
												}
											} else {
												toastr.error(data.msg);
											}
										},
										error : function() {
											toastr.error("系统繁忙");
										}
									});
						} else if (type == 3) {// 没有路由，不能确认支付
							toastr.warning("您的店铺当前没有路由，请添加路由");
						} else {// 确认支付
							var chargeType = $(this).attr("chargeType");
							if (chargeType == 1) {
								$("#num").val(1);
							} else {
								var month = ($("#timesInput").val() == "") ? ($("input[name=times]:checked")
										.val())
										: ($("#timesInput").val());
								month = parseInt(month);
								$("#num").val(month);
							}
							if(productId == 18){//id为18的应用也就是“离线通”需要在支付完成后进行回调,为其可用短信增加数量
								$("#notifyUrl").val("http://localhost:8080/sun/notify/addMsgNum");
							}
							$("#buyForm").submit();
							$('#payMsg').modal({
								backdrop : 'static'
							});
						}
					});

	// 返回店铺应用主页面
	$(".toBackToApply1Btn").click(function() {
		if (flagToMain == 1) {
			$("#applyDiv2").hide();
			$("#applyDiv1").show();
		} else {
			window.location.href = ctx + "/appManage/gotoAppStore";
		}

	});

	// 显示最新排行
	$(".toSortNewBtn").click(
			function() {
				$("#sortHot").hide();
				$("#sortNew").show();
				$(".toSortNewBtn").removeClass("sortH3Border2").addClass(
						"sortH3Border");
				$(".toSortHotBtn").removeClass("sortH3Border").addClass(
						"sortH3Border2");
			});

	// 显示热门排行
	$(".toSortHotBtn").click(
			function() {
				$("#sortNew").hide();
				$("#sortHot").show();
				$(".toSortNewBtn").removeClass("sortH3Border").addClass(
						"sortH3Border2");
				$(".toSortHotBtn").removeClass("sortH3Border2").addClass(
						"sortH3Border");
			});

	$(".payOkBtn").click(function() {
		window.location.href = ctx + "/appManage/gotoAppStore";
	});

	$(".payErrorBtn").click(function() {
		window.location.href = ctx + "/comm/faq";
	});

});

// 初始化事件
function initEvent() {

	// 鼠标移栽应用上，显示购买按钮
	$(".buyDiv").find("button").hide();
	$(".buyDiv").find(".span2").each(function() {
		$(this).mouseenter(function() {
			$(this).css("background-color", "#CFE9EB");
			$(this).find("p").hide();
			$(this).find("button").show();
		}).mouseleave(function() {
			$(this).css("background-color", "none");
			$(this).find("p").show();
			$(this).find("button").hide();
		});
	});

	// 应用商城，购买按钮，事件
	$(".toBuyApplyBtn").unbind("click");
	$(".toBuyApplyBtn").each(
			function() {
				var _this = $(this);
				_this.click(function() {
					flagToMain = 1;
					$("#applyDiv1").hide();
					$("#applyDiv2").show();
					var id = $(this).attr("id");
					$("#productId").val(id);
					var name = $(this).attr("name");
					var latestVersion = $(this).attr("latestVersion");
					var chargeType = $(this).attr("chargeType");
					var updateTime = $(this).attr("updateTime");
					var content = $(this).attr("content");
					var imageUrl = $(this).attr("imageUrl");
					var unitPrice = $(this).attr("unitPrice");
					var url = $(this).attr("url");
					var applicationsProvider = $(this).attr(
							"applicationsProvider");
					$("#imageUrl").attr("src", imageUrl);
					$("#unitPrice").text("￥" + unitPrice);
					$("#name").text(name);
					$("#applicationsProvider").text(applicationsProvider);
					$("#chargeType").text(chargeType == 1 ? "一次性付费" : "按月付费");
					if (chargeType == 2) {
						$("#byMonth").show();
						$("#byOnce").hide();
						$("input[name=times][value=1]").prop("checked",
								"checked");
						$("#timesInput").val("");
						$("#routerNum").text(routerNum);
						$("#payMoney").text("￥" + routerNum * unitPrice);
						$("#type").val(2);
					} else {
						$("#type").val(1);
						$("#byOnce").show();
						$("#byMonth").hide();
						$("#payMoney2").text("￥" + unitPrice);
					}
					$("#routerNumF").val(routerNum);
					$("#latestVersion").text(latestVersion);
					$("#updateTime").text(updateTime);
					$("#applyContent").text(content);
					if (routerNum == 0) {
						$(".toPayApplyBtn").attr("productId", id).addClass("disabled")
								.attr("type", 3).html(
										"&nbsp;&nbsp;确认付款&nbsp;&nbsp;");
					} else if (unitPrice == 0) {
						$(".toPayApplyBtn").attr("productId", id).attr("type",
								1).attr("url", url).html(
								"&nbsp;&nbsp;立即使用&nbsp;&nbsp;");
					} else {
						$(".toPayApplyBtn").attr("type", 2).attr("productId", id).attr("chargeType",
								chargeType)
								.html("&nbsp;&nbsp;确认付款&nbsp;&nbsp;");
					}
					flag = true;
				});
			});

	// 按月付费应用，进入自己管理页面
	$(".toObjApply").each(function() {
		var _this = $(this);
		_this.unbind("click");
		_this.click(function() {
			var url = $(this).attr("url");
			window.location.href = url;
		});
	});

	// 一次性付费应用，进入自己管理页面
	$(".toManageApply").each(function() {
		var _this = $(this);
		_this.unbind("click");
		_this.click(function() {
			var url = $(this).attr("url");
			window.location.href = url;
		});
	});

	// 购买应用时，选择时长，radioclick事件
	$("input[name=times]").each(function() {
		var _this = $(this);
		_this.unbind("click");
		_this.click(function() {
			$("#timesInput").val("");
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
					toastr.error("最多只能选择24个月");
					flag = false;
				} else {
					flag = true;
				}
			} else {
				toastr.error("只能输入正整数");
				flag = false;
			}
		} else {
			flag = false;
		}
		if (flag) {
			$("input[name=times]").prop("checked", false);
		} else {
			$(this).val("");
			$("input[name=times][value=1]").prop("checked", "checked");
		}
		calculateDate();
	});

	// "已启用”、“未启用”按钮click事件
	$(".status").each(function() {
		var _this = $(this);
		var name = $(this).attr("name");
		var storeId = $(this).attr("storeId");
		var productId = $(this).attr("productId");
		_this.unbind("click");
		_this.click(function() {
				if ($(this).hasClass("status2")) {// 当前是已启用，将其切换为未启用
					setStoreProductStatus(storeId, productId, 1, name);
					$(this).prev().addClass("disabled");
					$(this).removeClass("status2 btn-info").addClass("status1").text("未启用");
				} else if ($(this).hasClass("status1")) {// 当前是未启用，将其切换为已启用
					if ($("#myApply").find(".status2").length==6) {
						toastr.warning("portal端最多展示6个应用");
					}else{
						setStoreProductStatus(storeId, productId, 2, name);
						$(this).prev().removeClass("disabled");
						$(this).removeClass("status1").addClass("status2 btn-info").text("已启用");
					}
				}
		});
	});

	// "去支付”按钮click事件
	$(".toCashierBtn").each(function() {
		var _this = $(this);
		var orderNumber = $(this).attr("orderNumber");
		_this.unbind("click");
		_this.click(function() {
			$("#orderNumber").val(orderNumber);
			$("#gotoCashierForm").submit();
			$('#payMsg').modal({
				backdrop : 'static'
			});
		});
	});

	// 暂无详细配置的管理，点击提示信息
	$(".toManageDisabledApply").unbind("click");
	$(".toManageDisabledApply").click(function() {
		toastr.warning("当前应用暂不提供详细信息，后期将陆续开放");
	});

	// 会员管理：启用按钮不可点击，提示
	$(".noStatusBtn").unbind("click");
	$(".noStatusBtn").click(function() {
		toastr.warning("请去认证方式设置里关闭");
	});

}

// 设置我的应用的状态
function setStoreProductStatus(storeId, productId, status, name) {

	$.ajax({
		type : "POST",
		url : "setStoreProductStatus",
		data : {
			storeId : storeId,
			productId : productId,
			status : status
		},
		success : function(data) {
			eval("data = " + data);
			if (data.code == 200) {
				if (status == 1) {
					toastr.success('操作成功，' + name + '应用已关闭');
				} else if (status == 2) {
					toastr.success('操作成功，' + name + '应用已开启');
				}
			} else {
				toastr.error(data.msg);
			}
		},
		error : function() {
			toastr.error("系统繁忙");
		}
	});
}

// 获取我的应用列表
function getMyStoreProduct(num) {
	if (num == undefined)
		return;
	if (isNaN(num))
		return;

	$.ajax({
		type : "POST",
		url : "getMyStoreProduct",
		data : {
			curPage : num,
			pageSize : 10
		},
		success : function(data) {
			eval("data = " + data);
			if (data.code == 200) {
				buildTable3(data.data.data, "myApply");// 我的应用
				initEvent();
			} else {
				toastr.error(data.msg);
			}
		},
		error : function() {
			toastr.error("系统繁忙");
		}
	});
}

// 获取应用商店数据
function getApplyStore(num) {

	if (num == undefined)
		return;
	if (isNaN(num))
		return;

	$.ajax({
		type : "POST",
		url : "getApplyStore",
		data : {
			curPage : num,
			pageSize : 12,
		},
		success : function(data) {
			eval("data = " + data);
			if (data.code == 200) {
				buildTable1(data.data, "applyStore");// 应用商店
				buildTable1(data.data, "recommendApply");// 推荐应用
				initEvent();
			} else {
				toastr.error(data.msg);
			}
		},
		error : function() {
			toastr.error("系统繁忙");
		}
	});

}

// 获取最新排行、最热排行数据
function getApplySort(num, orderType) {

	if (num == undefined)
		return;
	if (isNaN(num))
		return;

	$.ajax({
		type : "POST",
		url : "getApplySort",
		data : {
			curPage : num,
			pageSize : 10,
			orderByValue : orderType
		},
		success : function(data) {
			eval("data = " + data);
			if (data.code == 200) {
				if (orderType == 1) {// 最新排行
					buildTable2(data.data, "sortNew");
				} else if (orderType == 2) {// 最热排行
					buildTable2(data.data, "sortHot");
				}
				initEvent();
			} else {
				toastr.error(data.msg);
			}
		},
		error : function() {
			toastr.error("系统繁忙");
		}
	});

}

// 构建表格1
function buildTable1(data, tableId) {
	var tBody = $("#" + tableId);
	tBody.empty();
	if (data.length > 0) {
		var div1 = $("<div/>").addClass("row-fluid").appendTo(tBody);
		var div2 = $("<div/>").addClass("row-fluid").appendTo(tBody);
		for (var i = 0; i < data.length; i++) {
			if (i > 5) {
				div1 = div2;
			}
			var updateTime = new Date(data[i].updateTime.time)
					.format("yyyy-MM-dd");
			var div = $("<div/>").addClass("span2").appendTo(div1);
			var img = $("<img/>").addClass("apply_img").attr("src", data[i].imageUrl).appendTo(div);
			var button = $("<button/>").attr("type", "button").attr("id",
					data[i].id).attr("name", data[i].name).attr(
					"latestVersion", data[i].latestVersion).attr("chargeType",
					data[i].chargeType).attr("updateTime", updateTime).attr(
					"applicationsProvider", data[i].applicationsProvider).attr(
					"content", data[i].content).attr("unitPrice",
					data[i].unitPrice).attr("imageUrl", data[i].imageUrl).attr(
					"url", data[i].url).addClass("btn btn-info toBuyApplyBtn")
					.text("购买").appendTo(div);
			var p = $("<p/>").text(data[i].name).appendTo(div);
			if (i == 5) {
				$("<br/>").appendTo(tableId);
			}
		}
	} else {
		tBody.parent().hide();
	}
}
// 构建表格2
function buildTable2(data, tableId) {
	var tBody = $("#" + tableId);
	tBody.empty();
	if (data.length > 0) {
		for (var i = 0; i < data.length; i++) {
			var div = $("<div/>").addClass("row-fluid rowBorder").appendTo(
					tBody);
			var div1 = $("<div/>").addClass("span5").appendTo(div);
			var img = $("<img/>").addClass("apply_img").attr("src", data[i].imageUrl).appendTo(div1);
			var div2 = $("<div/>").addClass("span7").html(
					"<span>" + data[i].name + "</span><br/><span>已有"
							+ data[i].buyNum + "人购买</span>").appendTo(div);
		}
	} else {
		tBody.html("暂无排行");
	}
}

// 构建表格3
function buildTable3(data, tableId) {
	var tBody = $("#" + tableId);
	if (data.length > 0) {
		$("#msgToBuyApply").remove();
		tBody.empty();
		var div;
		for (var i = 0; i < data.length; i++) {
			var productId = data[i].productId;
			var orderStatus = data[i].orderStatus;// 订单状态：1.未完成,2.已经完成,3.已经取消
			if ((i + 1) % 2 != 0) {// 奇数
				div = $("<div/>").addClass("row-fluid rowBorder").appendTo(
						tBody);
			}
			var div1 = $("<div/>").addClass("span6").appendTo(div);
			var div2 = $("<div/>").addClass("row-fluid").appendTo(div1);
			if (orderStatus == 1) {// 未完成，图片为灰色
				var div3 = $("<div/>").addClass("span6").html(
						"<img class='apply_img' src='" + data[i].imageUrl2 + "' />"
								+ data[i].name).appendTo(div2);
			} else if (orderStatus == 2) {// 已完成，图片为彩色
				var div3 = $("<div/>").addClass("span6")
						.html(
								"<img class='apply_img' src='" + data[i].imageUrl + "' />"
										+ data[i].name).appendTo(div2);
			}
			var div4 = $("<div/>").addClass("span6 span6Btn").appendTo(div2);
			if (orderStatus == 1) {// 未完成，提示去支付
				var span1 = $("<span/>")
						.html(
								"<i class='icon-warning-sign' style='color:orange;'></i> 未支付")
						.appendTo(div4);
				var span = $("<span/>").html("&nbsp;&nbsp;").appendTo(div4);
				var button2 = $("<button/>").attr("type", "button").attr(
						"orderNumber", data[i].orderNumber).addClass(
						"btn toCashierBtn").html("去支付").appendTo(div4);
			} else if (orderStatus == 2) {// 已完成
				var chargeType = data[i].chargeType;// 付费类型
				var status = data[i].status;// 应用状态：1、未启用，2、已启用
				if (chargeType == 1) {// 一次性付费
					if (productId == 7) {// 会员管理应用，没有“启用未启用”按钮
						var button1 = $("<button/>").attr("type", "button")
								.attr("url", data[i].url).addClass(
										"btn toManageApply").html("管理")
								.appendTo(div4);
						var span = $("<span/>").html("&nbsp;&nbsp;").appendTo(
								div4);
						var button2 = $("<button/>").attr("type", "button")
								.attr("data-toggle", "button").addClass(
										"btn disabled noStatusBtn").html("----------")
								.appendTo(div4);
					} else {
						var button1 = $("<button/>").attr("type", "button")
								.attr("url", data[i].url).addClass(
										"btn toManageApply").html("管理")
								.appendTo(div4);
						var span = $("<span/>").html("&nbsp;&nbsp;").appendTo(
								div4);
						if (status == 1) {
							var button2 = $("<button/>").attr("type", "button")
									.attr("name", data[i].name).attr(
											"data-toggle", "button").attr(
											"storeId", data[i].storeId).attr(
											"productId", productId).addClass(
											"btn status status1").html("未启用")
									.appendTo(div4);
						} else if (status == 2) {
							var button2 = $("<button/>").attr("type", "button")
									.attr("name", data[i].name).attr(
											"data-toggle", "button").attr(
											"storeId", data[i].storeId).attr(
											"productId", productId).addClass(
											"btn status status2 btn-info active").html(
											"已启用").appendTo(div4);
						}
					}
				} else if (chargeType == 2) {// 按月付费
					var expirationDate = data[i].expirationDate;// 截止日期
					var now = data[i].now;// 当前时间毫秒数
					if (now.time < expirationDate.time) {// 未到截止日期
						var span1 = $("<span/>")
								.html(
										"&nbsp;&nbsp;&nbsp;<i class='icon-time color1'></i>&nbsp;&nbsp;&nbsp;")
								.appendTo(div4);
						var span1 = $("<span/>").html(
								new Date(expirationDate.time)
										.format("yyyy-MM-dd")).appendTo(div4);
					} else {// 已到截止日期
						img = div3.find("img");
						img.addClass("apply_img").attr("src", data[i].imageUrl2);
						var span1 = $("<span/>").html(
								"<i class='icon-time color1'></i> 已到期")
								.appendTo(div4);
						var span = $("<span/>").html("&nbsp;&nbsp;&nbsp;")
								.appendTo(div4);
						var button2 = $("<button/>").attr("type", "button")
								.attr("url", data[i].url).addClass(
										"btn toObjApply").html("续费").appendTo(
										div4);
					}
				}
			}
		}
	}
}
// 初始化会员管理应用是否开启
function getOtherData(method) {

	$.ajax({
		type : "POST",
		url : "getOtherData",
		success : function(data) {
			eval("data = " + data);
			if (data.code == 200) {
				var method = data.data.authMethod;
				routerNum = data.data.routerNum;
				if (method == 16) {
					$("#5").find(".toSettingBtn").removeClass("disabled");
					$("#5").find(".status").removeClass("status2").addClass(
							"status1 active").text("已启用");
				}
			} else {
				toastr.error(data.msg);
			}
		},
		error : function() {
			toastr.error("系统繁忙");
		}
	});

}

function calculateDate() {
	var month = ($("#timesInput").val() == "") ? ($("input[name=times]:checked")
			.val())
			: ($("#timesInput").val());
	var unitPrice = $("#unitPrice").text();
	unitPrice = unitPrice.substr(1, unitPrice.length);
	var fix = unitPrice.split(".");
	var fix_length = 0;
	if (fix.length > 1) {
		fix_length = fix[1].length;
	}
	$("#payMoney").text(
			"￥" + (routerNum * unitPrice * month).toFixed(fix_length));

}
