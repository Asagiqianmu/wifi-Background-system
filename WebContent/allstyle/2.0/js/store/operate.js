/**
 * 运营概况
 */

$(function() {

	$("#operate").addClass("active");

	// 左侧菜单：网站管理
	var flag = 1;
	$("#webManage").click(
			function() {
				if (flag == 1) {
					$("#webFlag").removeClass("icon-chevron-right").addClass(
							"icon-chevron-down");
					$("#webManage").css("margin-bottom", "0px");
					$("#webManage").find("a").css("border-radius",
							"5px 5px 0px 0px");
					flag = 2;
				} else {
					$("#webFlag").removeClass("icon-chevron-down").addClass(
							"icon-chevron-right");
					$("#webManage").css("margin-bottom", "4px");
					$("#webManage").find("a").css("border-radius",
							"5px 5px 5px 5px");
					flag = 1;

				}
				$("#sAuth").toggle();
				$("#sDecorate").toggle();
				$("#sApply").toggle();
			});

	// 初始化时段人气分析
	initHourCustomer();

	// 初始化近7天趋势分析
	initWeekCustomer();

	// 初始化月客流量分析
	initMonthCustomer();

	// 初始化来源分析
	initLoginMethod();

});

function labelFormatter(label, series) {
	return "<div style='font-size:8pt; text-align:center; padding:2px; color:white;'>"
			+ label + "<br/>" + Math.round(series.percent) + "%</div>";
}

// 初始化时段人气分析
function initHourCustomer() {

	var data = [], ticks = [], max = 0, tickSize = 1;

	for (var i = 0; i < hours.length; i++) {
		if (hours[i] > max) {
			max = hours[i];
		}
		data.push([ i, hours[i] ]);
		ticks.push([ i, i + 1 + "h" ]);
	}

	if (max > 10) {
		tickSize = max / 100;
		tickSize = Math.ceil(tickSize) * 10;
	}

	var hoursLength = hours.length;
	if (hoursLength < 23) {
		var difference = 23 - hoursLength;
		for (var i = hoursLength; i <= 23; i++) {
			data.push([ i, 0 ]);
			ticks.push([ i, i + 1 + "h" ]);
		}
	}

	var dataset = [ {
		data : data,
	} ];

	var options = {
		series : {
			bars : {
				show : true
			}
		},
		bars : {
			align : "center",
			barWidth : 1
		},
		xaxis : {
			ticks : ticks
		},
		yaxis : {
			tickSize : tickSize,
			minTickSize : 1,
			tickDecimals : 0,
			min : 0
		},
		grid : {
			hoverable : true,
			borderWidth : 1,
		},
		colors : [ "#4BCDD9", "#BF6000" ],
	};

	$.plot($("#bar-chart"), dataset, options);

}

// 初始化近7天趋势分析
function initWeekCustomer() {

	var date = [], uv7s = [], pv7s = [], uv_maxValue = 0, pv_maxValue = 0;

	for (var i = 0; i < uv7.length; i++) {
		date.push([ i + 1, [ uv7[uv7.length - i - 1].proper1 ] ]);// X轴日期显示数组
		var _val = uv7[uv7.length - i - 1].proper2;
		if (typeof (_val) == "undefined" || _val == null || _val == "") {
			_val = 0;
		} else {
			if (_val > uv_maxValue) {
				uv_maxValue = _val;
			}
		}
		uv7s.push([ i + 1, _val ]);
	}

	for (var i = 0; i < pv7.length; i++) {
		var _val = pv7[pv7.length - i - 1].proper2;
		if (typeof (_val) == "undefined" || _val == null || _val == "") {
			_val = 0;
		} else {
			if (_val > pv_maxValue) {
				pv_maxValue = _val;
			}
		}
		pv7s.push([ i + 1, _val ]);
	}

	var tickSize = 1;
	var max = pv_maxValue > uv_maxValue ? pv_maxValue : uv_maxValue;

	if (max > 10) {
		tickSize = max / 100;
		tickSize = Math.ceil(tickSize) * 10;
	}

	$.plot($("#line-chart"), [ {
		label : "PV(网站访问量)",
		data : pv7s
	}, {

		label : "UV(独立用户数)",
		data : uv7s
	} ], {

		series : {
			lines : {
				show : true
			},
			points : {
				show : true
			}
		},
		grid : {
			hoverable : true,
			clickable : true
		},
		colors : [ "#2EAFBB", "#884400", "#4BCDD9", "#BF6000" ],
		xaxis : {
			ticks : date,
			min : 1,
			max : 7
		},
		yaxis : {
			tickSize : tickSize,
			tickDecimals : 0,
			min : 0,

		}
	});

}

// 初始化月客流量分析
function initMonthCustomer() {

	// 当月总天数
	var days = getDays();
	var day = new Date().getDate();

	var _30Pv = thirtyDayPv;

	var data = [], totalPoints = days;

	var max = 0;// 最大值

	data.push([ 0, 0 ]);
	if (_30Pv.length > 0) {
		for (var i = 0; i < _30Pv.length; i++) {
			data.push([ i + 1, _30Pv[i].proper2 ]);
			if (max < _30Pv[i].proper2) {
				max = _30Pv[i].proper2;
			}
		}
	} else {

		for (var i = 0; i < day; i++) {
			data.push([ i + 1, 0 ]);
			max = 0;
		}

	}

	var options = {
		yaxis : {
			min : 0,
			max : max + 10
		},
		xaxis : {
			min : 0,
			max : days,
			tickSize : 1
		},
		colors : [ "#4BCDD9", "#BF6000", "#2EAFBB", "#884400" ],
		series : {
			lines : {
				lineWidth : 2,
				fill : true,
				fillColor : {
					colors : [ {
						opacity : 0.6
					}, {
						opacity : 0.2
					} ]
				},
				steps : false

			}
		}
	};

	var plot = $.plot($("#area-chart"), [ data ], options);

}

// 初始化来源分析
function initLoginMethod() {

	var data = [];
	var j = 0;
	var placeholder = $("#pie-chart");

	if (typeof (methods) != "undefined" && methods != null
			&& methods.length > 0) {

		if (typeof (methods[0]) != "undefined" && methods[0] != null
				&& methods[0] != "") {

			var sum = 0;
			for (var i = 0; i < methods.length; i++) {
				sum += methods[i].proper2;
			}
			for (var i = 0; i < methods.length; i++) {

				if (methods[i].proper2 != 0) {
					var label;
					switch (methods[i].proper1) {
					case 1:
						label = "Q Q";
						break;
					case 2:
						label = "微信";
						break;
					case 4:
						label = "微博";
						break;
					case 8:
						label = "手机号";
						break;
					case 16:
						label = "校园卡";
						break;
					case 0:
						label = "一键登录";
						break;
					case 32:
						label = "密码登录";
						break;
					}
					var percent = Math.round(methods[i].proper2 / sum * 10000)
							/ 100.00 + "%";
					data[j] = {
						label : label + "：" + percent,
						data : methods[i].proper2,
					}
					j++;
				}
			}

			placeholder.unbind();

			if (data != null && data.length > 0) {

				$.plot(placeholder, data, {
					series : {
						pie : {
							show : true
						}
					}
				});

			} else {

				var h3 = $("<h3/>").text("您的店铺暂无详细数据!").css("text-align",
						"center").css("padding-top", "100px").appendTo(
						placeholder);

			}

		} else {

			var h3 = $("<h3/>").text("您的店铺暂无详细数据!").css("text-align", "center")
					.css("padding-top", "100px").appendTo(placeholder);

		}

	} else {

		var h3 = $("<h3/>").text("您的店铺暂无详细数据!").css("text-align", "center")
				.css("padding-top", "100px").appendTo(placeholder);

	}

}

// 根据年月判断当月天数
function getDays() {
	var _year = new Date().getDate();
	var _month = new Date().getMonth() + 1;
	var days;
	switch (_month) {
	case 1:
	case 3:
	case 5:
	case 7:
	case 8:
	case 10:
	case 12:
		days = 31;
		break;
	// 对于2月份需要判断是否为闰年
	case 2:
		if ((_year % 4 == 0 && _year % 100 != 0) || (_year % 400 == 0)) {
			days = 29;
			break;
		} else {
			days = 28;
			break;
		}
	case 4:
	case 6:
	case 9:
	case 11:
		days = 30;
		break;
	default:
		days = 30;
		break;
	}
	return days;
}