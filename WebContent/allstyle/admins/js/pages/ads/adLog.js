/**
 * 广告报表js
 * 
 * @author PengL
 * @date 2014-12-17
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

// 当前时间
var myDate = new Date().Format('yyyy-MM-dd');

$(function() {

	// 审核广告选中状态
	$("#reviewAds").addClass("active");
	// 左侧箭头指向审核广告菜单
	var pointer = $("<div/>").addClass("pointer");
	var arrow = $("<div/>").addClass("arrow").appendTo(pointer);
	var arrow_border = $("<div/>").addClass("arrow_border").appendTo(pointer);
	$("#reviewAds").prepend(pointer);

	// 返回广告管理主页面
	$(".toAdManageBtn").click(function() {
		window.location.href = ctx + "/admins/auditAdList";
	});

	// 日历控件初始化
	$('.form_datetime').datepicker({
		format : 'yyyy-mm-dd',
		autoclose : true
	});
	
	getAdInfo(adId);
	
	//getChart1();// 获取图表
	//getChart2();// 获取终端类型
	// 在投放区域为全国时，显示
	//getMapData();// 获取地图分布

	// 开始时间，结束时间赋值
	$("#startTime").attr("value", myDate);
	$("#endTime").attr("value", new Date('2114/01/01').Format('yyyy-MM-dd'));// 结束时间赋值

	// 开始日期校验
	$('#startTime').datepicker().on('changeDate', function(ev) {
		var endTime = $("#endTime").val();
		var startTime = ev.date.Format("yyyy-MM-dd");
		checkDateIsOk(startTime, endTime);
	}); // 结束日期校验
	$('#endTime').datepicker().on('changeDate', function(ev) {
		var startTime = $("#startTime").val();
		var endTime = ev.date.Format("yyyy-MM-dd");
		checkDateIsOk(startTime, endTime);
	});

});

// 比较两个日期大小
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

// 比较两个时间段
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

	// var data =
	// {"aomen":"120","hk":"1020","taiwan":"2560","guangdong":"11321","gx":"3123","hainan":"851",
	// "yunnan":"651","fujian":"1352","jiangxi":"810","hunan":"2362","guizhou":"281","zhejiang":"3865",
	// "anhui":"671","shanghai":"12586","jiangsu":"9865","hubei":"361","xizang":"121","qinghai":"21",
	// "gansu":"321","xinjiang":"158","shanxi":"2561","henan":"1246","shanxis":"781","shandong":"5415",
	// "hebei":"1562","tianjin":"691","beijing":"9891","ningxia":"236","neimeng":"863","liaoning":"794",
	// "jilin":"892","heilongjiang":"1851","chongqing":"3158","sichuan":"4214"}
	// ;

	var data1, data2;

	$.ajax({
		type : "POST",
		async : true,
		url : ctx+"/ad/getAdsLogData",
		success : function(msg) {
			eval("msg = " + msg);
			if (msg.code == 200) {
				data1 = msg.data[0];
				data2 = msg.data[1];
			} else {
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

			st.hover(function(e) {// 鼠标滑向
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
				//xmm/$("#tip").hide();
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



function getAdAllLogs(num){
	if (num == undefined)
		return;
	if (isNaN(num))
		return;
	$.ajax({
		type : "POST",
		async : true,
		url : ctx+"/admins/getAdsLogList",
		data : {
			curPage : num,
			pageSize : 10,
			adId:adId
		},
		success : function(data) {
			eval("data = " + data);
			if (data.code == 200) {
				$("#detailData").show();
				// 调用分页
				pageHandle("pager", "adLogList", data.data, num, getAdAllLogs,
						getAdLogTableHTML);
			} else {
				toastr.error('没有信息');
			}
		},
		error : function(XMLHttpRequest, textStatus, errorThrown) {
			toastr.error('数据获取失败');
		}
	});
}

function getAdLogTableHTML(data, tableId){
	data = data.data;
	var table = "";
	for (var i = 0; i < data.length; i++) {// data[i].
		table += "<tr> "+
					"<td>"+data[i].mac+"</td> "+
					"<td>"+data[i].storeName+"</td> "+
					"<td>"+data[i].areaName+"</td> "+
					"<td>"+data[i].createTime+"</td> "+
					"<td>"+data[i].clientType+"</td> "+
					"<td>"+(data[i].status==1?"浏览":"点击")+"</td> "+
				"</tr>";
	}
	$("#" + tableId).html(table);
}


var adData;
function getAdInfo(adId){
	$.ajax({
		type : "POST",
		async : true,
		url : ctx+"/admins/getAdInfo",
		data : {
			adId:adId
		},
		success : function(data) {
			eval("data = " + data);
			if (data.code == 200) {
				// 调用分页
				adData=data.data;
				$("#orderNum").html(adData.orderNum);
				$("#areaName").html(adData.areaName);
				$("#unit").html(adData.unit);
				$("#showNum").html(adData.num);
				$("#clickNum").html(adData.pnum);
				$("#startTimes").html(adData.startTime);
				$("#endTimes").html(adData.endTime);
				$("#startHours").html(getStringHour(adData.startHour));
				$("#endHours").html(getStringHour(adData.endHour));
				//广告状态。1审核中，2投放中，3未通过审核，4暂停中，5投放结束
				if (adData.status==2||adData.status==4||adData.status==5) {
					getAdAllLogs(1);//日志列表
				}
			} else {
				toastr.error('广告信息获取失败');
			}
		},
		error : function(XMLHttpRequest, textStatus, errorThrown) {
			toastr.error('数据获取失败');
		}
	});
}

function getStringHour(hour) {
	hour = "000" + hour;
	hour = hour.substring(hour.length - 4);
	hour = hour.substring(0, 2) + ":" + hour.substring(2);
	return hour;
}