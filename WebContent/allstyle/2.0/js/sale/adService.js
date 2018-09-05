/**
 * 广告营销模块
 */

// 当前时间
var myDate = new Date().format('yyyy-MM-dd');

$(function() {

	// 广告列表之外的div隐藏
	$(".adServiceOperate").hide();

	// 返回广告列表(广告列表显示，其余div隐藏)
	$(".toAdsListBtn").click(function() {
		toAdServiceList();
	});

	// ---------------------短信营销列表-------------------------------------//
	// "创建广告"，按钮事件(创建广告DIV显示，广告列表隐藏)
	$(".toAddAdsBtn").click(function() {
		$("#adsList").fadeOut();
		$("#addAds").fadeIn();
	});

	// "修改广告"，按钮事件(修改广告DIV显示，短信列表隐藏)
	$(".toUpdateAdsBtn").click(function() {
		$("#adsList").fadeOut();
		$("#updateAds").fadeIn();
	});

	// "放弃投放广告"，按钮事件(弹出确认提示框)
	$(".toDeleteAdsBtn").click(function() {
		$('#deleteAds').modal({
			backdrop : 'static'
		});
	});

	// "暂停投放广告"，按钮事件(暂停投放提示DIV显示，广告列表隐藏)
	$(".toStopAdsBtn").click(function() {
		$("#adsList").fadeOut();
		$("#stopAds").fadeIn();
	});
	// "查看统计"，按钮事件
	$(".toAdSendListBtn").click(function() {
		$("#adsList").fadeOut();
		$("#adSendList").fadeIn();
		getChart2();// 获取终端类型
	});

	// “继续投放”按钮，click事件
	$(".toStartAdsBtn").click(function() {
		toastr.success('投放成功');
	});

	// ---------------------短信营销列表-------------------------------------//

	// ---------------------创建广告-------------------------------------//

	// 保存事件
	$(".doAddAdsBtn").click(function() {
		toastr.success('保存成功');
		window.location.href = "/merchant/personal/pCashier.jsp";
	});

	// ---------------------创建广告-------------------------------------//

	// ---------------------修改广告-------------------------------------//

	// 保存事件
	$(".doUpdateAdsBtn").click(function() {
		toastr.success('保存成功');
		toAdServiceList();
	});

	// ---------------------修改广告-------------------------------------//

	// ---------------------放弃投放广告-------------------------------------//
	// 确认放弃
	$(".doDeleteAdsBtn").click(function() {
		toastr.success('操作成功');
		$('#deleteAds').modal("hide");
	});
	// ---------------------放弃投放广告-------------------------------------//

	// ---------------------暂停投放-------------------------------------//

	// 确认暂停投放事件
	$(".doStopAdsBtn").click(function() {
		toastr.success('操作成功');
		toAdServiceList();
	});

	// ---------------------暂停投放-------------------------------------//

	// --------广告统计-----//
	// 日历控件初始化
	$('.form_datetime').datepicker({
		format : 'yyyy-mm-dd',
		autoclose : true
	});

	getChart1();// 获取图表
//	getChart2();// 获取终端类型
	// 在投放区域为全国时，显示
	getMapData();// 获取地图分布

	// 开始时间，结束时间赋值
	$("#startTime").attr("value", myDate);
	$("#endTime").attr("value", new Date('2114/01/01').format('yyyy-MM-dd'));// 结束时间赋值

	// 开始时间、结束时间改变执行事件
	$("#startTime").change(function() {
		changeDateDiff();
	});
	$("#endTime").change(function() {
		changeDateDiff();
	});

	// 开始日期校验
	$('#startTime').datepicker().on('changeDate', function(ev) {
		var endTime = $("#endTime").val();
		var startTime = ev.date.format("yyyy-MM-dd");
		checkDateIsOk(startTime, endTime);
	});

	// 结束日期校验
	$('#endTime').datepicker().on('changeDate', function(ev) {
		var startTime = $("#startTime").val();
		var endTime = ev.date.format("yyyy-MM-dd");
		checkDateIsOk(startTime, endTime);
	});
	// ----------广告统计-------------//

});

// 返回广告列表(广告列表显示，其余div隐藏)
function toAdServiceList() {
	$(".adServiceOperate").fadeOut();
	$("#adsList").fadeIn();
}



//比较两个日期大小
function checkDateIsOk(startTime, endTime) {
	var flag = false;
	if ("" != startTime) {
		if ("" != endTime) {
			startTime = startTime.replace(/-/g, "/");
			endTime = endTime.replace(/-/g, "/");
			var startTime = new Date(startTime).getTime();
			var endTime = new Date(endTime).getTime();
			if (startTime > endTime) {
				flag = false;
				$("#endTimeError").text("结束日期不能小于开始日期");
			} else {
				flag = true;
			}
		} else {
			flag = false;
		}
	} else {
		flag = true;
	}
	if (flag) {
		$("#endTimeDiv").removeClass("error");
		$("#endTimeError").text("");
	} else {
		$("#endTimeDiv").addClass("error");
	}
}

//比较两个时间段
function checkHourIsOk(startHour, endHour) {
	startHour = parseInt(startHour);
	endHour = parseInt(endHour);
	var flag = false;
	if ("" != startHour) {
		if ("" != endHour) {
			if (startHour == endHour) {
				flag = false;
				$("#hourError").text("时间段不能相等");
			} else if (startHour > endHour) {
				flag = false;
				$("#hourError").text("结束时间需大于开始时间");
			} else {
				flag = true;
			}
		} else {
			flag = false;
		}
	} else {
		flag = true;
	}
	if (flag) {
		$("#hourDiv").removeClass("error");
		$("#hourError").text("");
	} else {
		$("#hourDiv").addClass("error");
	}
}

function getChart1() {
	var visits = [ [ 1, 50 ], [ 2, 40 ], [ 3, 45 ], [ 4, 23 ], [ 5, 55 ],
			[ 6, 65 ], [ 7, 61 ], [ 8, 70 ], [ 9, 65 ], [ 10, 75 ], [ 11, 57 ],
			[ 12, 59 ], [ 13, 50 ], [ 14, 40 ], [ 15, 45 ], [ 16, 23 ],
			[ 17, 55 ], [ 18, 65 ], [ 19, 61 ], [ 20, 70 ], [ 21, 65 ],
			[ 22, 50 ], [ 23, 40 ], [ 24, 45 ], [ 25, 23 ], [ 26, 55 ],
			[ 27, 65 ], [ 28, 61 ], [ 29, 70 ], [ 30, 65 ], [ 31, 55 ] ];
	var visitors = [ [ 1, 25 ], [ 2, 50 ], [ 3, 23 ], [ 4, 48 ], [ 5, 38 ],
			[ 6, 40 ], [ 7, 47 ], [ 8, 55 ], [ 9, 43 ], [ 10, 50 ], [ 11, 47 ],
			[ 12, 39 ], [ 13, 25 ], [ 14, 50 ], [ 15, 23 ], [ 16, 48 ],
			[ 17, 38 ], [ 18, 40 ], [ 19, 47 ], [ 20, 55 ], [ 21, 43 ],
			[ 22, 50 ], [ 23, 47 ], [ 24, 39 ], [ 25, 25 ], [ 26, 50 ],
			[ 27, 23 ], [ 28, 48 ], [ 29, 38 ], [ 30, 40 ], [ 31, 47 ] ];

	var plot = $.plot($("#adsLogChart"), [ {
		data : visits,
		label : "点击次数"
	}, {
		data : visitors,
		label : "浏览次数"
	} ], {
		series : {
			lines : {
				show : true,
				lineWidth : 1,
				fill : true,
				fillColor : {
					colors : [ {
						opacity : 0.05
					}, {
						opacity : 0.09
					} ]
				}
			},
			points : {
				show : true,
				lineWidth : 2,
				radius : 3
			},
			shadowSize : 0,
			stack : true
		},
		grid : {
			hoverable : true,
			clickable : true,
			tickColor : "#f9f9f9",
			borderWidth : 0
		},
		legend : {
			// show: false
			labelBoxBorderColor : "#fff"
		},
		colors : [ "#a7b5c5", "#30a0eb" ],
		xaxis : {
			ticks : [ [ 1, "30" ], [ 2, "30" ], [ 3, "30" ], [ 4, "30" ],
					[ 5, "30" ], [ 6, "30" ], [ 7, "30" ], [ 8, "30" ],
					[ 9, "30" ], [ 10, "30" ], [ 11, "30" ], [ 12, "30" ],
					[ 13, "30" ], [ 14, "30" ], [ 15, "30" ], [ 16, "30" ],
					[ 17, "30" ], [ 18, "30" ], [ 19, "30" ], [ 20, "30" ],
					[ 21, "30" ], [ 22, "30" ], [ 23, "30" ], [ 24, "30" ],
					[ 25, "30" ], [ 26, "30" ], [ 27, "30" ], [ 28, "30" ],
					[ 29, "30" ], [ 30, "30" ], [ 31, "30" ] ],
			font : {
				size : 12,
				family : "Open Sans, Arial",
				variant : "small-caps",
				color : "#9da3a9"
			}
		},
		yaxis : {
			ticks : 3,
			tickDecimals : 0,
			font : {
				size : 12,
				color : "#9da3a9"
			}
		}
	});

	function showTooltip(x, y, contents) {
		$('<div id="tooltip">' + contents + '</div>').css({
			position : 'absolute',
			display : 'none',
			top : y - 30,
			left : x - 50,
			color : "#fff",
			padding : '2px 5px',
			'border-radius' : '6px',
			'background-color' : '#000',
			opacity : 0.80
		}).appendTo("body").fadeIn(200);
	}

	var previousPoint = null;
	$("#adsLogChart")
			.bind(
					"plothover",
					function(event, pos, item) {
						if (item) {
							if (previousPoint != item.dataIndex) {
								previousPoint = item.dataIndex;

								$("#tooltip").remove();
								var x = item.datapoint[0].toFixed(0), y = item.datapoint[1]
										.toFixed(0);

								var month = item.series.xaxis.ticks[item.dataIndex].label;

								showTooltip(item.pageX, item.pageY,
										item.series.label + " of " + month
												+ ": " + y);
							}
						} else {
							$("#tooltip").remove();
							previousPoint = null;
						}
					});
}

function getChart2() {
	// Morris Bar Chart
	Morris.Bar({
		element : 'deviceChart1',
		data : [ {
			device : '1',
			sells : 136
		}, {
			device : '3G',
			sells : 1037
		}, {
			device : '3GS',
			sells : 275
		}, {
			device : '4',
			sells : 380
		}, {
			device : '4S',
			sells : 655
		}, {
			device : '5',
			sells : 1571
		} ],
		xkey : 'device',
		ykeys : [ 'sells' ],
		labels : [ 'Sells' ],
		barRatio : 0.4,
		xLabelMargin : 10,
		hideHover : 'auto',
		barColors : [ "#3d88ba" ]
	});

	// Morris Donut Chart
	Morris.Donut({
		element : 'deviceChart2',
		data : [ {
			label : 'Direct',
			value : 25
		}, {
			label : 'Referrals',
			value : 40
		}, {
			label : 'Search engines',
			value : 25
		}, {
			label : 'Unique visitors',
			value : 10
		} ],
		colors : [ "#30a1ec", "#76bdee", "#c4dafe" ],
		formatter : function(y) {
			return y + "%"
		}
	});
}

function getMapData() {

//	var data =  {"aomen":"120","hk":"1020","taiwan":"2560","guangdong":"11321","gx":"3123","hainan":"851",
//			"yunnan":"651","fujian":"1352","jiangxi":"810","hunan":"2362","guizhou":"281","zhejiang":"3865",
//			"anhui":"671","shanghai":"12586","jiangsu":"9865","hubei":"361","xizang":"121","qinghai":"21",
//			"gansu":"321","xinjiang":"158","shanxi":"2561","henan":"1246","shanxis":"781","shandong":"5415",
//			"hebei":"1562","tianjin":"691","beijing":"9891","ningxia":"236","neimeng":"863","liaoning":"794",
//			"jilin":"892","heilongjiang":"1851","chongqing":"3158","sichuan":"4214"} ;
	
	var data1,data2;
	
	$.ajax({
		type : "POST",
		async:true,
		url : "getAdsLogData",
		success:function(msg) {
			eval("msg = " + msg);
			if(msg.code==200){
				data1=msg.data[0];
				data2=msg.data[1];
			}else{
				toastr.error("没有查询到数据");
			}
		},
		error : function(XMLHttpRequest, textStatus, errorThrown) {
			toastr.error("数据获取失败");
		}
	});
	
	// 绘制地图
	var R = Raphael("map", 600, 500);// 将地图载入到id为map的div中，并设置区域为600x500px大小。
	paintMap(R);
	var textAttr = {
		"fill" : "#000",
		"font-size" : "12px",
		"cursor" : "pointer"
	};
	var i = 0;
	for ( var state in china) {


		china[state]['path'].color = Raphael.getColor(0.9);
		(function(st, state) {
			var fillcolor = Raphael.getColor(0.9);

			// 获取当前图形的中心坐标
			var xx = st.getBBox().x + (st.getBBox().width / 2);
			var yy = st.getBBox().y + (st.getBBox().height / 2);

			// 写入文字
			if (china[state]['name'] == '香港') {
				china[state]['text'] = R.text(xx + 15, yy + 5,
						china[state]['name']).attr(textAttr);
			} else if (china[state]['name'] == '澳门') {
				china[state]['text'] = R.text(xx - 5, yy + 10,
						china[state]['name']).attr(textAttr);
			} else if (china[state]['name'] == '广东') {
				china[state]['text'] = R
						.text(xx, yy - 15, china[state]['name']).attr(textAttr);
			} else if (china[state]['name'] == '北京') {
				china[state]['text'] = R.text(xx + 2, yy - 10,
						china[state]['name']).attr(textAttr);
			} else if (china[state]['name'] == '河北') {
				china[state]['text'] = R.text(xx - 10, yy + 10,
						china[state]['name']).attr(textAttr);
			} else if (china[state]['name'] == '天津') {
				china[state]['text'] = R.text(xx + 15, yy + 8,
						china[state]['name']).attr(textAttr);
			} else if (china[state]['name'] == '上海') {
				china[state]['text'] = R
						.text(xx + 20, yy, china[state]['name']).attr(textAttr);
			} else {
				china[state]['text'] = R.text(xx, yy, china[state]['name'])
						.attr(textAttr);
			}

			st.hover(
					function(e) {// 鼠标滑向
						st.animate({
							fill : "#fdd",
							stroke : "#eee"
						}, 100);
						R.safari();
						$("#tip").css({
							"top" : e.clientY + "px",
							"left" : e.clientX - 190 + "px"
						}).show().html(
								"<h4>" + china[state]['name'] + "</h4><p>浏览量："
										+ data1[state] + "</p><p>点击量：" + data2[state]
										+ "</p>");
					}, function() {// 鼠标离开
						st.animate({
							fill : fillcolor,
							stroke : "#eee"
						}, 100);
						R.safari();
						$("#tip").hide();
					});
			st.mousemove(function(e) {// 鼠标移动
				$("#tip").css({
					"top" : e.clientY + "px",
					"left" : e.clientX - 190 + "px"
				});
				R.safari();
			});
			i++;
		})(china[state]['path'], state);
	}
}