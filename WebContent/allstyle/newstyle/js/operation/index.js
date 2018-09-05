function buffers() {
	$('.barcontainer').css('display', 'block');
	$('.barcontainer').fadeOut(800);
}

window.onload = function() {
	buffers();
	$('.fn_select > span').click(function() {
		$(this).next().toggle();
		return false;
	});

	$('.t_tit>button').click(
			function() {
				window.location.href = ctx
						+ "/siteCustomer/toSiteCustomerList?state=1";
			});

	$('.fn_select ul').click(function() {
		return false;
	});
	var siteid = $('.allsite>li').eq(1).attr('value');
	if (siteid == undefined) {// 说明没有场所信息呢.
		init();
	} else {
		$('#swicthdm').next().remove();
		$('.chorsesite').attr('id', siteid);
		$('.chorsesite').text($('.allsite>li').eq(1).text());

		var html = "<span><input type='text' readonly='readonly' onclick=\"WdatePicker({dateFmt:\'yyyy-MM-dd\'})\" class='Wdate' id='startTime'> 至 <input type='text' readonly='readonly' onclick=\"WdatePicker({dateFmt:'yyyy-MM-dd'})\" class=\"Wdate\" id=\"endTime\"><button class='a_btn' id='dayquery'>查询</button></span>";
		$('#swicthdm').after(html);
		var startTime = new Date((new Date().getTime() - 11 * 24 * 60 * 60
				* 1000)).Format('yyyy-MM-dd');
		var endTime = new Date().Format('yyyy-MM-dd');
		$("#startTime").val(startTime);
		$("#endTime").val(endTime);
		// 走单一流程
		$('.info_txt').removeClass('all');
		getBusinessData(siteid);
		getDataStatistics(siteid)
		getSubscriberGrowth(siteid);

		getTwelveDaysBeforeRevenue(siteid);
		pie(siteid);
		var date = getDangDate();
		getDataChart(date);

		chorseDayorMonth();

	}
	goToPage();

	/*
	 * 日期查询按钮
	 */
	$('#userGrow').click(function() {

		var start = $('#userStartDate').val();
		var end = $('#userEndDate').val();
		if (start == '') {
			msg("起始日期不能为空", false);
			return;
		}

		if (end == '') {
			msg("终止日期不能为空", false);
			return;
		}

		if (!duibi(start, end)) {
			msg("终止日期不能大于或等于起始日期", false);
			return;
		} else {
			var date = [ start, end ];
			getDataChart(date);
		}

	});

	$('.wh_ts').hover(function() {
		$(this).next().css('display', 'block');
	}, function() {
		$(this).next().css('display', 'none');
	});

	var text = $('.chorsesite').text();
	if (text == '全部') {
		$(".pay_type").css("display", "none");
	} else {
		$(".pay_type").css("display", "block");
	}

	$('.swicth').unbind('click');
	$('.swicth')
			.click(
					function() {

						$('#swicthdm').next().remove();
						var str = $(this).attr('class');
						var html = "";
						var startTime = new Date((new Date().getTime() - 11
								* 24 * 60 * 60 * 1000)).Format('yyyy-MM-dd');
						var endTime = new Date().Format('yyyy-MM-dd');
						$("#startTime").val(startTime);
						$("#endTime").val(endTime);

						if (str == 'swicth d') {
							// 切换到月
							$(this).attr('class', 'swicth m');
							$(this).children().animate({
								left : '1px'
							}, 80);
							var siteid = $(".chorsesite").attr("id");
							html = "<span><input type='text' readonly='readonly' onclick=\"WdatePicker({dateFmt:\'yyyy-MM\'})\" class='Wdate' id='yearfan'><button class='a_btn' id='monthquery'>查询</button></span>";
							$('#swicthdm').after(html);
							var endTime = new Date().Format('yyyy-MM');
							$("#yearfan").val(endTime);
							if (siteid == 'all') {
								getAllSiteTotalMonthlyIncome()
							} else {
								getTotalMonthlyIncome(siteid)
							}
						} else {
							// 切换到日
							$(this).attr('class', 'swicth d');
							$(this).children().animate({
								left : '23px'
							}, 80);
							var siteid = $(".chorsesite").attr("id");
							html = "<span><input type='text' readonly='readonly' onclick=\"WdatePicker({dateFmt:\'yyyy-MM-dd\'})\" class='Wdate' id='startTime'> 至 <input type='text' readonly='readonly' onclick=\"WdatePicker({dateFmt:'yyyy-MM-dd'})\" class=\"Wdate\" id=\"endTime\"><button class='a_btn' id='dayquery'>查询</button></span>";
							$('#swicthdm').after(html);
							var startTime = new Date((new Date().getTime() - 11
									* 24 * 60 * 60 * 1000))
									.Format('yyyy-MM-dd');
							var endTime = new Date().Format('yyyy-MM-dd');
							$("#startTime").val(startTime);
							$("#endTime").val(endTime);

							if (siteid == 'all') {
								getAllSiteOfTwelveDaysBeforeRevenue();
							} else {
								getTwelveDaysBeforeRevenue(siteid);
							}
						}

						chorseDayorMonth();

					});

	// 退出按钮
	$('.menu > li.exit').click(function() {
		window.location.href = ctx + "/logOut";
	});
	$('.menu > li.personageCenter').click(function() {
		window.location.href = ctx + "/personalCenter/toPersonalCenter";
	});

	$('.fn_select ul > li')
			.click(
					function() {
						$('.swicth').attr('class', 'swicth d');
						$('.swicth').children().animate({
							left : '23px'
						}, 80);
						$('.swicth.d:before').css('content', '日');
						$('#swicthdm').next().remove();
						var html = "<span><input type='text' readonly='readonly' onclick=\"WdatePicker({dateFmt:\'yyyy-MM-dd\'})\" class='Wdate' id='startTime'> 至 <input type='text' readonly='readonly' onclick=\"WdatePicker({dateFmt:'yyyy-MM-dd'})\" class=\"Wdate\" id=\"endTime\"><button class='a_btn' id='dayquery'>查询</button></span>";
						$('#swicthdm').after(html);

						var startTime = new Date((new Date().getTime() - 11
								* 24 * 60 * 60 * 1000)).Format('yyyy-MM-dd');
						var endTime = new Date().Format('yyyy-MM-dd');
						$("#startTime").val(startTime);
						$("#endTime").val(endTime);

						var str = $(this).text();
						$(this).parent().prev().text(str);
						$(this).parent().css('display', 'none');
						var n = $('.fn_select ul > li').index(this);
						var siteId = $('.fn_select ul > li').eq(n)
								.attr("value");
						var text = $('.fn_select ul > li').eq(n).text();
						if (text == '全部') {
							$(".pay_type").css("display", "none");
							$(this).parent().prev().attr("siteid", "all");
						} else {
							$(this).parent().prev().attr("siteid", siteId);
							$(".pay_type").css("display", "block");
							$
									.ajax({
										type : 'post',
										url : ctx
												+ '/allSiteOfReportStatistics/updateSiteFrequency',
										data : {
											siteId : siteId
										},
										success : function() {
										}
									})
						}
						if (siteId == undefined) {
							// 走全部的流程
							$('.info_txt').addClass('all');
							getAllSiteTotalMoneyAndPeopleCount();
							getBusinessData(-1)
							getAllSiteSubscriberGrowth();
							getAllSiteOfTwelveDaysBeforeRevenue();
						} else {
							// 走单一流程
							$('.info_txt').removeClass('all');
							getBusinessData(siteId);
							getDataStatistics(siteId)
							getSubscriberGrowth(siteId);
							Thenetuser(siteid);

							getTwelveDaysBeforeRevenue(siteId);
							pie(siteId);
						}
						chorseDayorMonth();
						var date = getDangDate();
						getDataChart(date);
					});

	/* 事件绑定 */
}

function init() {
	/*
	 * canvas(0,'perception'); canvas(0,'tryOut'); canvas(0,'register');
	 */

	line_chart3();

	// pie();

	bar_chart('日');

	// line();
}

/*
 * function canvas(pre,canvasId){//环形图 var bg =
 * document.getElementById(canvasId); var ctx = bg.getContext('2d'); bg.width =
 * bg.width; var circ = Math.PI * 2; var quart = Math.PI / 2; var imd = null;
 * var circ = Math.PI * 2; var quart = Math.PI / 2; var
 * round=bg.previousSibling.previousSibling; ctx.beginPath();
 * if(canvasId=='perception'){ ctx.strokeStyle = '#03A1B9';
 * round.style.color='#03A1B9'; }else if(canvasId=='tryOut'){ ctx.strokeStyle =
 * '#03A1B9'; round.style.color='#03A1B9'; }else{ ctx.strokeStyle = '#03A1B9';
 * round.style.color='#03A1B9'; } ctx.lineCap = 'square'; ctx.closePath();
 * ctx.fill(); ctx.lineWidth = 20.0;
 * 
 * imd = ctx.getImageData(0, 0, 240, 240); function draw(current){
 * ctx.putImageData(imd, 0, 0); ctx.beginPath(); ctx.arc(100, 100, 60, -(quart),
 * ((circ) * current) - quart, false); ctx.stroke(); } //draw(0.6); var t; var
 * timer=null; function loadCanvas(now){ timer = setInterval(function(){
 * if(t>now){ clearInterval(timer); }else if(t<=1){ draw(t);
 * round.innerHTML=parseInt(t*100)+'%'; t+=0.01; }else{ clearInterval(timer); }
 * },10); } loadCanvas(pre); timer=null; }
 */

function line_chart3() {// 折线图
	$('#userLineDraw').highcharts({
		title : {
			text : '',
			x : -20
		// center
		},
		subtitle : {
			text : '',
			x : -20
		},
		xAxis : {
			categories : []
		},
		yAxis : {
			title : {
				text : ''
			},
			plotLines : [ {
				value : 0,
				width : 1,
				color : '#808080'
			} ]
		},
		tooltip : {
			pointFormat : '{series.name}: <b>{point.y}</b><br/>',
			valueSuffix : ' %',
			shared : true
		},
		legend : {
			layout : 'horizontal',
			align : 'center',
			verticalAlign : 'top',
			borderWidth : 0
		},
		series : [ {
			name : '用户渗透率',
			data : adata
		}, {
			name : '注册转换率',
			data : bdata
		}, {
			name : '付费转换率',
			data : cdata
		} ],
		navigation : {
			buttonOptions : {
				enabled : false
			}
		}
	});
}

function pie(siteId) {// 饼图
	var type = {
		chart : {
			renderTo : 'pieChart',
			type : 'pie'
		},
		title : {
			text : ''
		},
		tooltip : {
			pointFormat : '{series.name}: <b>{point.percentage:.2f}%</b>'
		},
		plotOptions : {
			pie : {
				allowPointSelect : false, // 选中某块区域是否允许分离
				cursor : 'pointer',
				dataLabels : {
					enabled : true, // 是否直接呈现数据 也就是外围显示数据与否
					format : '<b>{point.name}</b>',
					distance : -80

				},
				showInLegend : true
			}
		},
		colors : [ '#6bbdec', '#c5d6e7', '#567bc3', '#6b96ec', '#492970',
				'#f28f43', '#77a1e5', '#c42525', '#a6c96a' ],
		series : [ {
			name : "缴费类型占比",
			colorByPoint : true,
			dataLabels : {
				formatter : function() {
					return this.y > 5 ? this.point.name : null;
				},
				color : 'black',
				distance : -30
			},
			data : []
		} ],
		navigation : {
			buttonOptions : {
				enabled : false
			}
		}
	};

	$
			.ajax({
				type : "post",
				url : ctx + "/dataStatistics/getTypeProportion?time="
						+ Math.random(),
				data : {
					siteId : siteId
				},
				async : false,
				success : function(data) {
					/* console.log(data); */
					if (data == "loseSession") {
						window.location.href = ctx + "/toLogin";
						return;
					}
					eval("data = " + data);
					if (data.code == 200) {
						$("#pieChart").text("");
						// [{finalBili=0.36, finalName=医院收费, finalCount=5},
						for (var i = 0; i < data.data.length; i++) {
							type.series[0].data.push({
								name : data.data[i].finalName,
								y : parseFloat(data.data[i].finalBili)
							});
						}
						new Highcharts.Chart(type);
					} else {
						htmls = "<p style='color:#707070;font-size:16px;font-weight:bold;position: absolute;margin-top: 125px;margin-left: 51px;'>暂无数据</p>";
						$("#pieChart").html(htmls);
					}
				}
			});
}

function bar_chart(type) {// 柱形图
	if (type == '日') {
		Highcharts.setOptions({
			colors : [ '#6bbdec' ]
		});
	} else {
		Highcharts.setOptions({
			colors : [ '#fec66e' ]
		});
	}

	var charConfigLine = {
		chart : {
			renderTo : 'histogram',
			type : 'column'
		},
		title : {
			text : ''
		},
		subtitle : {
			text : ''
		},
		navigation : {
			buttonOptions : {
				enabled : false
			}
		},
		xAxis : {
			categories : [],
			crosshair : true,
			labels : {
				rotation : -45
			// 坐标刻度垂直显示
			}
		},
		yAxis : {
			min : 0,
			title : {
				text : '日收入统计 (元)'
			}
		},
		tooltip : {
			headerFormat : '<span style="font-size:10px">{point.key}</span><table>',
			pointFormat : '<tr><td style="color:{series.color};padding:0">{series.name}: </td>'
					+ '<td style="padding:0"><b>{point.y:.2f} 元</b></td></tr>',
			footerFormat : '</table>',
			shared : true,
			useHTML : true
		},
		plotOptions : {
			column : {
				pointPadding : 0.2,
				borderWidth : 0
			}
		},
		series : [ {
			name : '日收入',
			data : []

		} ],

	}/* ) */;
}

function getSubscriberGrowth(siteId) {// 折线图
	Highcharts.setOptions({
		colors : [ '#57c6d4' ]
	});
	var charConfigData = {

		chart : {
			renderTo : 'lineChart',
			type : 'line'
		},
		title : {
			text : '',
			x : -20
		// center
		},
		subtitle : {
			text : '',
			x : -20
		},
		xAxis : {
			categories : [],
			labels : {
				rotation : -45
			// 坐标刻度45度显示
			}
		},
		navigation : {
			buttonOptions : {
				enabled : false
			}
		},
		yAxis : {
			title : {
				text : '有效用户总人数'
			},
			plotLines : [ {
				value : 0,
				width : 1,
				color : '#808080'
			} ]
		},
		tooltip : {
			pointFormat : '<b>有效用户总人数: {point.y}</b>',
			valueSuffix : '',
			shared : true
		},
		legend : {
			layout : 'vertical',
			align : 'center',
			verticalAlign : 'bottom',
			borderWidth : 0
		},
		series : [ {
			name : '',
			data : []
		} ],
	}/* ) */;
	$
			.ajax({
				type : "get",
				url : ctx + "/dataStatistics/getSubscriberGrowth?time="
						+ Math.random(),
				data : {
					siteId : siteId
				},
				success : function(data) {
					/* console.log(data); */
					if (data == "loseSession") {
						window.location.href = ctx + "/toLogin";
						return;
					}
					eval("data = " + data);
					if (data.code == 200) {
						var d = [];
						var x = [];
						var name = '';
						$.each(data.data, function(i, item) {
							if (item.name) {
								name = item.name;
							} else {
								d.push(item.num);
								x.push(item.date);
							}
						});
						charConfigData.series[0].name = name;
						charConfigData.series[0].data = d;
						charConfigData.xAxis.categories = x;
						// chart.series[0].name=name;
						// chart.series[0].setData(d);

					} else {
					}
					new Highcharts.Chart(charConfigData);
				},
				error : function() {

				}
			});

}

/** *******************获得当前用户所有场所的当天的充值数,与总钱数****************************************************** */

function getAllSiteTotalMoneyAndPeopleCount() {

	$
			.ajax({
				type : "get",
				url : ctx
						+ "/allSiteOfReportStatistics/getAllSiteTotalMoneyAndPeopleCount?time="
						+ Math.random(),
				success : function(data) {
					if (data == "loseSession") {
						window.location.href = ctx + "/toLogin";
						return;
					}
					eval("data = " + data);
					if (data.code == 200) {
						$("#totalpeople").text(data.data[0].siteNum);
						$("#todayincome")
								.text(
										(data.data[0].todayMoney + "")
												.substr(
														0,
														(data.data[0].todayMoney + "").length - 2)
												+ "元");
						$("#totalincome")
								.text(
										(data.data[0].totalMoney + "")
												.substr(
														0,
														(data.data[0].totalMoney + "").length - 2)
												+ "元");
					}
				},
				error : function() {

				}
			});
}
/** *******************获得当前用户所有场所的当天的充值数结束的位置****************************************************** */

/** *******************获得独立用户与其他数据开始的位置****************************************************** */
var adata = "";
var bdata = "";
var cdata = "";
function getBusinessData(siteId) {
	$.ajax({
		type : "post",
		url : ctx + "/allSiteOfReportStatistics/getAllBusinessData",
		data : {
			siteId : siteId
		},
		success : function(data) {
			/* console.log(data); */
			data = JSON.parse(data);
			if (data.code == 200) {
				// console.log(data.data.tryRegisterRate)
				$('.independent > span').text(
						data.data.ylineNum == null ? 0 : data.data.ylineNum);
				$('.register > span').text(
						data.data.registerNum == null ? 0
								: data.data.registerNum);
				$('.pay > span').text(
						data.data.payNum == null ? 0 : data.data.payNum);
				$('.yesterday > span').text(
						data.data.APNum == null ? 0 : data.data.APNum);
				$('.real_time > span').text(data.data.onlinenum);

				adata = (data.data.permeateRate * 100);// 用户渗透率 (t*100)+'%';
				bdata = (data.data.tryRegisterRate * 100);// 用户渗透率  (t*100)+'%';
				cdata = (data.data.registerPayRate * 100);// 用户渗透率 (t*100)+'%';
				/* console.log(adata,bdata,cdata); */

				getdataaccesstothenetwork();// 入网情况图表1
				getdataaccesstothenetworko();// 入网情况图表2
				getdataaccesstothenetworkt();// 入网情况图表3
				/*
				 * canvas(data.data.permeateRate,'perception'); // 用户渗透率
				 * canvas(data.data.tryRegisterRate,'tryOut'); // 新增注册转换
				 * canvas(data.data.registerPayRate,'register'); // 新增付费转换率
				 */}
		},
		error : function() {

		}
	});

}
/** *******************获得独立用户与其他数据结束的位置****************************************************** */

/**
 * *******************获得单一场所当天的充值数,与总钱数
 * 开始的位置******************************************************
 */

function getDataStatistics(siteId) {

	$.ajax({
		type : "get",
		url : ctx + "/dataStatistics/getTotalMoneyTotal?time=" + Math.random(),
		data : {
			siteId : siteId
		},
		success : function(data) {
			if (data == "loseSession") {
				window.location.href = ctx + "/toLogin";
				return;
			}
			eval("data = " + data);
			if (data.code == 200) {
				$("#totalpeople").text(data.data[0].siteNum);
				$("#todayincome").text(
						(data.data[0].todayMoney + "").substr(0,
								(data.data[0].todayMoney + "").length - 2)
								+ "元");
				$("#totalincome").text(
						(data.data[0].totalMoney + "").substr(0,
								(data.data[0].totalMoney + "").length - 2)
								+ "元");
			} else {
			}
		},
		error : function() {
		}
	});
}
/**
 * *******************获得单一场所当天的充值数,与总钱数
 * 结束的位置******************************************************
 */

/** *******************获得每天的试用人数增加趋势****************************************************** */
function getAllSiteSubscriberGrowth() {

	Highcharts.setOptions({
		colors : [ '#57c6d4' ]
	});
	var charConfigData = {

		chart : {
			renderTo : 'lineChart',
			type : 'line'
		},
		title : {
			text : ' ',
			x : -20
		},
		subtitle : {
			text : '',
			x : -20
		},
		navigation : {
			buttonOptions : {
				enabled : false
			}
		},
		xAxis : {
			categories : [],
			labels : {
				rotation : -45
			// 坐标刻度垂直显示
			}
		},
		yAxis : {
			title : {
				text : '有效用户总人数'
			},
			plotLines : [ {
				value : 0,
				width : 1,
				color : '#808080'
			} ]
		},
		tooltip : {
			valueSuffix : '--有效用户总人数'
		},
		legend : {
			layout : 'vertical',
			align : 'right',
			verticalAlign : 'middle',
			borderWidth : 0
		},
		series : [ {
			name : '用户归属场所',
			data : []

		} ]

	};
	// );
	$.ajax({
		type : "get",
		url : ctx
				+ "/allSiteOfReportStatistics/getAllSiteSubscriberGrowth?time="
				+ Math.random(),
		success : function(data) {

			if (data == "loseSession") {
				window.location.href = ctx + "/toLogin";
				return;
			}
			eval("data = " + data);
			if (data.code == 200) {
				var d = [];
				var x = [];
				$.each(data.data, function(i, item) {
					d.push(item.num);
					x.push(item.date);
				});
				charConfigData.series[0].data = d;
				charConfigData.xAxis.categories = x;
			} else {
			}
			new Highcharts.Chart(charConfigData);
		},
		error : function() {

		}
	});
}
/** *******************获得每天的试用人数增加趋势结束的位置****************************************************** */

/** *******************获得最近12天每天的收入的总计开始的位置****************************************************** */
function getAllSiteOfTwelveDaysBeforeRevenue() {
	/*
	 * var chart; chart = new Highcharts.Chart( {
	 */
	var charConfigLine = {
		chart : {
			renderTo : 'histogram',
			type : 'column'
		},
		title : {
			text : ''
		},
		subtitle : {
			text : ''
		},
		navigation : {
			buttonOptions : {
				enabled : false
			}
		},
		xAxis : {
			categories : [],
			crosshair : true,
			labels : {
				rotation : -45
			// 坐标刻度垂直显示
			}
		},
		yAxis : {
			min : 0,
			title : {
				text : '日收入统计 (元)'
			}
		},
		tooltip : {
			headerFormat : '<span style="font-size:10px">{point.key}</span><table>',
			pointFormat : '<tr><td style="color:{series.color};padding:0">{series.name}: </td>'
					+ '<td style="padding:0"><b>{point.y:.2f} 元</b></td></tr>',
			footerFormat : '</table>',
			shared : true,
			useHTML : true
		},
		plotOptions : {
			column : {
				pointPadding : 0.2,
				borderWidth : 0
			}
		},
		series : [ {
			name : '日收入',
			data : []
		} ]
	};
	// //);
	$
			.ajax({
				type : "get",
				url : ctx
						+ "/allSiteOfReportStatistics/getAllSiteOfTwelveDaysBeforeRevenue?time="
						+ Math.random(),
				success : function(data) {

					if (data == "loseSession") {
						window.location.href = ctx + "/toLogin";
						return;
					}
					eval("data = " + data);
					if (data.code == 200) {
						var d = [];
						var x = [];
						$.each(data.data, function(i, item) {
							d.push(parseFloat(item.totalMoney));
							x.push(item.date);
						});
						charConfigLine.series[0].data = d;
						charConfigLine.xAxis.categories = x;
					} else {
					}
					new Highcharts.Chart(charConfigLine);
				},
				error : function() {

				}
			});
}
/** *******************获得最近12天每天的收入的总计结束的位置****************************************************** */
/** **********************************************时间格式******************************************************* */
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
};
/** **********************************************时间格式化方法***************************************************** */

/** *******************获得最近12个天每天的总收入开始的位置****************************************************** */
function getTwelveDaysBeforeRevenue(siteId) {
	/*
	 * var chart; chart = new Highcharts.Chart( {
	 */
	var charConfigLine = {
		chart : {
			renderTo : 'histogram',
			type : 'column'
		},
		title : {
			text : ''
		},
		subtitle : {
			text : ''
		},
		navigation : {
			buttonOptions : {
				enabled : false
			}
		},
		xAxis : {
			categories : [],
			crosshair : true,
			labels : {
				rotation : -45
			// 坐标刻度垂直显示
			}
		},
		yAxis : {
			min : 0,
			title : {
				text : '日收入统计 (元)'
			},
			allowDecimals : false
		},
		colors : [ "#57C6D4" ],
		tooltip : {
			headerFormat : '<span style="font-size:10px">{point.key}</span><table>',
			pointFormat : '<tr><td style="color:{series.color};padding:0">{series.name}: </td>'
					+ '<td style="padding:0"><b>{point.y:.2f} 元</b></td></tr>',
			footerFormat : '</table>',
			shared : true,
			useHTML : true
		},
		plotOptions : {
			column : {
				pointPadding : 0.2,
				borderWidth : 0
			}
		},
		series : [ {
			name : '日收入',
			data : []
		} ]
	};
	// );
	$.ajax({
		type : "get",
		url : ctx + "/dataStatistics/getTwelveDaysBeforeRevenue?time="
				+ Math.random(),
		data : {
			siteId : siteId
		},
		success : function(data) {
			/* console.log(data); */
			if (data == "loseSession") {
				window.location.href = ctx + "/toLogin";
				return;
			}
			eval("data = " + data);
			if (data.code == 200) {
				var d = [];
				var x = [];
				$.each(data.data, function(i, item) {
					d.push(item.totalMoney);
					x.push(item.date);
				});
				charConfigLine.series[0].data = d;
				charConfigLine.xAxis.categories = x;
			} else {
			}
			new Highcharts.Chart(charConfigLine);
		},
		error : function() {

		}
	});
}

/** *******************获得最近12个天每天的总收入结束的位置****************************************************** */

/** *******************获得最近12个月每月的总收入开始的位置****************************************************** */
function getTotalMonthlyIncome(siteId) {
	var totalMonth = {
		chart : {
			renderTo : 'histogram',
			type : 'column'
		},
		title : {
			text : ''
		},
		subtitle : {
			text : ''
		},
		navigation : {
			buttonOptions : {
				enabled : false
			}
		},
		colors : [ "#FEC66E" ],
		xAxis : {
			categories : [],
			crosshair : true,
			labels : {
				rotation : -45
			// 坐标刻度垂直显示
			}
		},

		yAxis : {
			min : 0,
			title : {
				text : '月收入统计 (元)'
			}
		},
		tooltip : {
			headerFormat : '<span style="font-size:10px">{point.key}</span><table>',
			pointFormat : '<tr><td style="color:{series.color};padding:0">{series.name}: </td>'
					+ '<td style="padding:0"><b>{point.y:.2f} 元</b></td></tr>',
			footerFormat : '</table>',
			shared : true,
			useHTML : true
		},
		plotOptions : {
			column : {
				pointPadding : 0.2,
				borderWidth : 0
			}
		},
		series : [ {
			name : '月收入',
			data : []
		} ]
	};
	$.ajax({
		type : "get",
		url : ctx + "/dataStatistics/getTotalMonthlyIncome?time="
				+ Math.random(),
		data : {
			siteId : siteId
		},
		success : function(data) {
			if (data == "loseSession") {
				window.location.href = ctx + "/toLogin";
				return;
			}
			eval("data = " + data);
			if (data.code == 200) {
				var d = [];
				var x = [];
				$.each(data.data, function(i, item) {
					d.push(parseFloat(item.totalMoney));
					x.push(item.date);
				});
				totalMonth.series[0].data = d;
				totalMonth.xAxis.categories = x;
			} else {
			}
			new Highcharts.Chart(totalMonth);
		},
		error : function() {
		}
	});
}
/** *******************获得最近12个月每月的总收入结束的位置****************************************************** */

/** *******************获得最近12个月每月收入的总计开始的位置****************************************************** */
function getAllSiteTotalMonthlyIncome() {
	/*
	 * var chart; chart = new Highcharts.Chart( {
	 */
	var totalMonth = {
		chart : {
			renderTo : 'histogram',
			type : 'column'
		},
		title : {
			text : ''
		},
		subtitle : {
			text : ''
		},
		navigation : {
			buttonOptions : {
				enabled : false
			}
		},
		colors : [ "#FEC66E" ],
		xAxis : {
			categories : [],
			crosshair : true,
			labels : {
				rotation : -45
			// 坐标刻度垂直显示
			}
		},

		yAxis : {
			min : 0,
			title : {
				text : '月收入统计 (元)'
			}
		},
		tooltip : {
			headerFormat : '<span style="font-size:10px">{point.key}</span><table>',
			pointFormat : '<tr><td style="color:{series.color};padding:0">{series.name}: </td>'
					+ '<td style="padding:0"><b>{point.y:.2f} 元</b></td></tr>',
			footerFormat : '</table>',
			shared : true,
			useHTML : true
		},
		plotOptions : {
			column : {
				pointPadding : 0.2,
				borderWidth : 0
			}
		},
		series : [ {
			name : '月收入',
			data : []
		} ]
	}
	/* ) */;
	$
			.ajax({
				type : "get",
				url : ctx
						+ "/allSiteOfReportStatistics/getAllSiteTotalMonthlyIncome?time="
						+ Math.random(),
				success : function(data) {
					if (data == "loseSession") {
						window.location.href = ctx + "/toLogin";
						return;
					}
					eval("data = " + data);
					if (data.code == 200) {
						var d = [];
						var x = [];
						$.each(data.data, function(i, item) {
							d.push(parseFloat(item.totalMoney));
							x.push(item.date);
						});
						totalMonth.series[0].data = d;
						totalMonth.xAxis.categories = x;
					} else {
					}
					new Highcharts.Chart(totalMonth);
				},
				error : function() {

				}
			});
}
/** *******************获得最近12个月每月收入的总计结束的位置****************************************************** */

// 计算天数差的函数，通用
function DateDiff(sDate1, sDate2) { // sDate1和sDate2是2006-12-18格式
	var aDate, oDate1, oDate2, iDays;
	aDate = sDate1.split("-");
	oDate1 = new Date(aDate[1] + '/' + aDate[2] + '/' + aDate[0]); // 转换为12-18-2006格式
	aDate = sDate2.split("-");
	oDate2 = new Date(aDate[1] + '/' + aDate[2] + '/' + aDate[0]);
	iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24); // 把相差的毫秒数转换为天数
	return iDays;
}

// 点击查询的时候.判断是月还是天
function chorseDayorMonth() {
	$("#dayquery").click(function() {
		var siteid = $('.chorsesite').attr('id');
		if ('all' == siteid) {// 查看当前用户的所有场所的收入
			getAllSiteOfInCome();
		} else {
			getDayIncome(siteid);
		}
	});
	$('#monthquery').click(function() {
		var siteid = $('.chorsesite').attr('id');
		if ('all' == siteid) {// 查看当前用户的所有场所的收入
			getAllSiteMonthlyIncome()
		} else {
			getMonthlyIncome(siteid);
		}
		/*
		 * if(siteid=='all'){ getAllSiteTotalMonthlyIncome() }else{
		 * getTotalMonthlyIncome(siteid) }
		 */

	});

	/*
	 * $('.a_btn').click(function(){ var n = $('.a_btn').index(this); var
	 * dayormonth = $('.a_btn').eq(n).attr('attr');
	 * if('all'==siteid){//查看当前用户的所有场所的收入 if('day'==dayormonth){//按天查询
	 * getAllSiteOfInCome(); }else{ getAllSiteMonthlyIncome() }
	 * 
	 * }else{ if('day'==dayormonth){//按天查询 getDayIncome(siteid); }else{
	 * getMonthlyIncome(siteid); } }
	 * 
	 * });
	 */
}

/** *******************查询某时间段的每天的收入总和开始的位置****************************************************** */
function getAllSiteOfInCome() {
	var startTime = $("#startTime").val();
	var endTime = $("#endTime").val();
	var eDate = new Date(endTime.replace(/-/g, '/'));
	var nowTime = new Date(new Date().Format("yyyy-MM-dd 00:00:00").replace(
			/-/g, '/'));
	var compare = DateDiff(startTime, endTime);
	if (startTime == "" && endTime == "") {
		msg("温馨提示:起始时间不能为空", false);

		return false;
	} else {
		var sDate = new Date(startTime.replace(/-/g, '/'));
		var eDate = new Date(endTime.replace(/-/g, '/'));
		if (sDate > eDate) {
			msg("温馨提示:开始时间不能大于结束时间", false);
			return false;
		}
	}
	if (compare < 11) {
		msg("温馨提示:日期跨度不能小于12天", false);
		return false;
	}
	if (compare > 29) {
		msg("温馨提示:日期跨度不能大于30天", false);
		return false;
	}
	if (eDate > nowTime) {
		msg("温馨提示:结束时间不能大于今天的日期", false);
		return false;
	}
	if (startTime == "" && endTime != '') {
		msg("温馨提示:开始时间不能为空", false);
		return false;
	}
	if (startTime != "" && endTime == '') {
		msg("温馨提示:结束时间不能为空", false);
		return false;
	}

	var totalMonth = {
		chart : {
			renderTo : 'histogram',
			type : 'column'
		},
		title : {
			text : ''
		},
		subtitle : {
			text : ''
		},
		navigation : {
			buttonOptions : {
				enabled : false
			}
		},
		xAxis : {
			categories : [],
			crosshair : true,
			labels : {
				rotation : -45
			// 坐标刻度垂直显示
			}
		},

		yAxis : {
			min : 0,
			title : {
				text : '日收入统计 (元)'
			}
		},
		colors : [ "#57C6D4" ],
		tooltip : {
			headerFormat : '<span style="font-size:10px">{point.key}</span><table>',
			pointFormat : '<tr><td style="color:{series.color};padding:0">{series.name}: </td>'
					+ '<td style="padding:0"><b>{point.y:.2f} 元</b></td></tr>', // point.y:.4f
																				// 保留四位小数
			footerFormat : '</table>',
			shared : true,
			useHTML : true
		},
		plotOptions : {
			column : {
				pointPadding : 0.2,
				borderWidth : 0
			}
		},
		series : [ {
			name : '日收入',
			data : []
		} ]
	};
	$.ajax({
		type : "post",
		url : ctx + "/allSiteOfReportStatistics/getAllSiteOfInCome?time="
				+ Math.random(),
		data : {
			startTime : startTime,
			endTime : endTime
		},
		success : function(data) {
			if (data == "loseSession") {
				window.location.href = ctx + "/toLogin";
				return;
			}
			eval("data = " + data);
			if (data.code == 200) {
				var d = [];
				var x = [];
				$.each(data.data, function(i, item) {
					d.push(parseFloat(item.totalMoney));
					x.push(item.date);
				});
				totalMonth.series[0].data = d;
				totalMonth.xAxis.categories = x;
			} else {
			}
			new Highcharts.Chart(totalMonth);
		},
		error : function() {
			msg("网络服务忙,请稍后···", false);
		}
	});
}
/** *******************查询某时间段的每天的收入总和结束的位置****************************************************** */

/** *******************获得查询每天的总收入开始的位置****************************************************** */
function getDayIncome(siteId) {
	var startTime = $("#startTime").val();
	var endTime = $("#endTime").val();
	var eDate = new Date(endTime.replace(/-/g, '/'));
	var nowTime = new Date(new Date().Format("yyyy-MM-dd 00:00:00").replace(
			/-/g, '/'));
	var compare = DateDiff(startTime, endTime);
	if (startTime == "" && endTime == '') {
		// startTime = '00:00:00';
		// endTime = "00:00:00"
		msg("温馨提示:起始时间不能为空", false);
		return false;
	} else {
		var sDate = new Date(startTime.replace(/-/g, '/'));
		var eDate = new Date(endTime.replace(/-/g, '/'));
		if (sDate > eDate) {
			msg("温馨提示:开始时间不能大于结束时间", false);
			return false;
		}
	}
	if (compare < 11) {
		msg("温馨提示:日期跨度不能小于12天", false);
		return false;
	}
	if (compare > 29) {
		msg("温馨提示:两个日期相差不能大于30天", false);
		return false;
	}
	if (eDate > nowTime) {
		msg("温馨提示:结束时间不能大于今天的日期", false);
		return false;
	}
	if (startTime == "" && endTime != '') {
		msg("温馨提示:开始时间不能为空", false);
		return false;
	}
	if (startTime != "" && endTime == '') {
		msg("温馨提示:结束时间不能为空", false);
		return false;
	}

	var charConfigLine = {
		chart : {
			renderTo : 'histogram',
			type : 'column'
		},
		title : {
			text : ''
		},
		subtitle : {
			text : ''
		},
		navigation : {
			buttonOptions : {
				enabled : false
			}
		},
		xAxis : {
			categories : [],
			crosshair : true,
			labels : {
				rotation : -45
			// 坐标刻度垂直显示
			}
		},
		yAxis : {
			min : 0,
			title : {
				text : '日收入统计 (元)'
			},
			allowDecimals : false
		},
		colors : [ "#57C6D4" ],
		tooltip : {
			headerFormat : '<span style="font-size:10px">{point.key}</span><table>',
			pointFormat : '<tr><td style="color:{series.color};padding:0">{series.name}: </td>'
					+ '<td style="padding:0"><b>{point.y:.2f} 元</b></td></tr>',
			footerFormat : '</table>',
			shared : true,
			useHTML : true
		},
		plotOptions : {
			column : {
				pointPadding : 0.2,
				borderWidth : 0
			}
		},
		series : [ {
			name : '日收入',
			data : []
		} ]
	};
	// );
	$.ajax({
		type : "get",
		url : ctx + "/dataStatistics/getDayIncome?time=" + Math.random(),
		data : {
			siteId : siteId,
			startTime : startTime,
			endTime : endTime
		},
		success : function(data) {
			/* console.log(data); */
			if (data == "loseSession") {
				window.location.href = ctx + "/toLogin";
				return;
			}
			eval("data = " + data);
			if (data.code == 200) {
				var d = [];
				var x = [];
				$.each(data.data, function(i, item) {
					d.push(item.totalMoney);
					x.push(item.date);
				});
				charConfigLine.series[0].data = d;
				charConfigLine.xAxis.categories = x;
			} else {
			}
			new Highcharts.Chart(charConfigLine);
		},
		error : function() {
			msg("网络服务忙,请稍后···", false);
		}
	});
}
/** *******************查询某时间段的收入结束的位置****************************************************** */
/** *******************查看某年的每月的收入总和开始的位置****************************************************** */
function getMonthlyIncome(siteId) {
	var year = $.trim($("#yearfan").val());
	if (year == "") {
		msg("温馨提示:查询日期不能为空", false);
		return false;
	}
	var nowTime = new Date().Format("yyyy");
	if (parseInt(year) > parseInt(nowTime)) {
		msg("温馨提示:查询日期不能大于现在日期", false);
		return false;
	}
	var totalMonth = {
		chart : {
			renderTo : 'histogram',
			type : 'column'
		},
		title : {
			text : ''
		},
		subtitle : {
			text : ''
		},
		navigation : {
			buttonOptions : {
				enabled : false
			}
		},
		xAxis : {
			categories : [],
			crosshair : true,
			labels : {
				rotation : -45
			// 坐标刻度垂直显示
			}
		},

		yAxis : {
			min : 0,
			title : {
				text : '月收入统计 (元)'
			}
		},
		colors : [ "#FEC66E" ],
		tooltip : {
			headerFormat : '<span style="font-size:10px">{point.key}</span><table>',
			pointFormat : '<tr><td style="color:{series.color};padding:0">{series.name}: </td>'
					+ '<td style="padding:0"><b>{point.y:.2f} 元</b></td></tr>',
			footerFormat : '</table>',
			shared : true,
			useHTML : true
		},
		plotOptions : {
			column : {
				pointPadding : 0.2,
				borderWidth : 0
			}
		},
		series : [ {
			name : '月收入',
			data : []
		} ]
	};
	$.ajax({
		type : "get",
		url : ctx + "/dataStatistics/getMonthlyIncome?time=" + Math.random(),
		data : {
			siteId : siteId,
			year : year
		},
		success : function(data) {
			if (data == "loseSession") {
				window.location.href = ctx + "/toLogin";
				return;
			}
			eval("data = " + data);
			if (data.code == 200) {
				var d = [];
				var x = [];
				$.each(data.data, function(i, item) {
					d.push(parseFloat(item.totalMoney));
					x.push(item.date);
				});
				totalMonth.series[0].data = d;
				totalMonth.xAxis.categories = x;
			} else {
			}
			new Highcharts.Chart(totalMonth);
		},
		error : function() {
			msg("网络服务忙,请稍后···", false);
		}
	});
}
/** *******************查看某年的每月的收入总和结束的位置****************************************************** */

/** *******************查询当前用户下所有场所某年的每月的总收入开始的位置****************************************************** */
function getAllSiteMonthlyIncome() {
	var years = $.trim($("#yearfan").val());
	if (years == "") {
		msg("温馨提示:查询日期不能为空", false);
		return false;
	}
	var nowTime = new Date().Format("yyyy");
	if (parseInt(years) > parseInt(nowTime)) {
		msg("温馨提示:查询日期不能大于现在日期", false);
		return false;
	}
	var totalMonth = {
		chart : {
			renderTo : 'histogram',
			type : 'column'
		},
		title : {
			text : ''
		},
		subtitle : {
			text : ''
		},
		navigation : {
			buttonOptions : {
				enabled : false
			}
		},
		xAxis : {
			categories : [],
			crosshair : true,
			labels : {
				rotation : -45
			// 坐标刻度垂直显示
			}
		},

		yAxis : {
			min : 0,
			title : {
				text : '月收入统计 (元)'
			}
		},
		colors : [ "#FEC66E" ],
		tooltip : {
			headerFormat : '<span style="font-size:10px">{point.key}</span><table>',
			pointFormat : '<tr><td style="color:{series.color};padding:0">{series.name}: </td>'
					+ '<td style="padding:0"><b>{point.y:.2f} 元</b></td></tr>',
			footerFormat : '</table>',
			shared : true,
			useHTML : true
		},
		plotOptions : {
			column : {
				pointPadding : 0.2,
				borderWidth : 0
			}
		},
		series : [ {
			name : '月收入',
			data : []
		} ]
	};
	$.ajax({
		type : "get",
		url : ctx + "/allSiteOfReportStatistics/getAllSiteMonthlyIncome?time="
				+ Math.random(),
		data : {
			years : years
		},
		success : function(data) {
			if (data == "loseSession") {
				window.location.href = ctx + "/toLogin";
				return;
			}
			eval("data = " + data);
			if (data.code == 200) {
				var d = [];
				var x = [];
				$.each(data.data, function(i, item) {
					d.push(parseFloat(item.totalMoney));
					x.push(item.date);
				});
				totalMonth.series[0].data = d;
				totalMonth.xAxis.categories = x;
			} else {
			}
			new Highcharts.Chart(totalMonth);
		},
		error : function() {
			msg("网络服务忙,请稍后···", false);
		}
	});
}
/** *******************查询当前用户下所有的场所下某年的每月的总收入结束的位置****************************************************** */

function getDangDate() {
	var myDate = new Date();
	var y = myDate.getFullYear();
	var m = myDate.getMonth() + 1 < 10 ? '0' + (myDate.getMonth() + 1) : myDate
			.getMonth() + 1;
	var d = myDate.getDate() < 10 ? '0' + myDate.getDate() : myDate.getDate();
	var enddate = y + '-' + m + '-' + d;
	var d = new Date(enddate);
	var e = new Date(enddate);
	e.setDate(d.getDate() - 1);
	var mmm = e.getMonth() + 1 < 10 ? '0' + (e.getMonth() + 1)
			: e.getMonth() + 1;
	enddate = e.getFullYear() + '-' + mmm + '-'
			+ (e.getDate() < 10 ? '0' + e.getDate() : e.getDate());
	d.setDate(d.getDate() - 13);
	var mm = d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1)
			: d.getMonth() + 1;
	var startdate = d.getFullYear() + '-' + mm + '-'
			+ (d.getDate() < 10 ? '0' + d.getDate() : d.getDate());
	var dataArr = [ startdate, enddate ]
	return dataArr;
}

function duibi(a, b) {
	var arr = a.split("-");
	var starttime = new Date(arr[0], arr[1], arr[2]);
	var starttimes = starttime.getTime();

	var arrs = b.split("-");
	var lktime = new Date(arrs[0], arrs[1], arrs[2]);
	var lktimes = lktime.getTime();

	if (starttimes >= lktimes) {
		var c = false;
	} else {
		var c = true;
	}
	return c;
}

// 饼图 用户入网情况 入网情况图表1
function getdataaccesstothenetwork() {
	var myChart = echarts.init(document.getElementById('mychatuser'));
	var ndata = 100 - adata;

	myChart.setOption({
		tooltip : {
			show : false,
			fontSize : '16',
			trigger : 'item',
			formatter : "{a} <br/>{b}: {c} ({d}%)"
		},
		color : [ "#03A1B9", "#cecece" ],
		/*
		 * legend: { orient: 'vertical', x: 'left', data:['直接访问','邮件营销'] },
		 */

		series : [ {
			name : '渗透率',
			type : 'pie',
			radius : [ '50%', '70%' ],
			avoidLabelOverlap : false,
			label : {
				normal : {
					show : true,
					position : 'center',

				},
				emphasis : {
					show : true,
					textStyle : {
						fontSize : '18',
						fontWeight : 'bold'
					}
				}
			},
			labelLine : {
				normal : {
					show : false
				}
			},
			data : [ {
				value : adata,
				name : adata + '%'
			}, {
				value : ndata,
				name : ''
			} ]
		} ]
	});
	myChart.hideLoading();
}

// ////////入网情况图表2
function getdataaccesstothenetworko() {

	var myChart = echarts.init(document.getElementById('mychatusero'));
	var ndata = 100 - bdata;
	myChart.setOption({
		tooltip : {
			show : false,
			trigger : 'item',
			formatter : "{a} <br/>{b}: {c} ({d}%)"
		},
		color : [ "#03A1B9", "#cecece" ],
		/*
		 * legend: { orient: 'vertical', x: 'left', data:['直接访问','邮件营销'] },
		 */
		series : [ {
			name : '注册转换率',
			type : 'pie',
			radius : [ '50%', '70%' ],
			avoidLabelOverlap : false,
			label : {
				normal : {
					show : true,
					position : 'center'
				},
				emphasis : {
					show : true,
					textStyle : {
						fontSize : '18',
						fontWeight : 'bold'
					}
				}
			},
			labelLine : {
				normal : {
					show : false
				}
			},
			data : [ {
				value : bdata,
				name : bdata + '%'
			}, {
				value : ndata,
				name : ''
			} ]
		} ]
	});
}

// /////////入网情况图表3
function getdataaccesstothenetworkt() {

	var myChart = echarts.init(document.getElementById('mychatusert'));
	var ndata = 100 - cdata;
	myChart.setOption({
		tooltip : {
			show : false,
			trigger : 'item',
			formatter : "{a} <br/>{b}: {c} ({d}%)"
		},
		color : [ "#03A1B9", "#cecece" ],
		/*
		 * legend: { orient: 'vertical', x: 'left', data:['直接访问','邮件营销'] },
		 */
		series : [ {
			name : '付费转换率',
			type : 'pie',
			radius : [ '50%', '70%' ],
			avoidLabelOverlap : false,
			label : {
				normal : {
					show : true,
					position : 'center'
				},
				emphasis : {
					show : true,
					textStyle : {
						fontSize : '18',
						fontWeight : 'bold'
					}
				}
			},
			labelLine : {
				normal : {
					show : false
				}
			},
			data : [ {
				value : cdata,
				name : cdata + '%'
			}, {
				value : ndata,
				name : ''
			} ]
		} ]
	});
}

// TODO 折线图数据 ajax请求（共三个ajax）
function getDataChart(date) {
	var n = '';
	if ($(".chorsesite").attr("id") == 'all') {
		n = -1;
	} else {
		n = $(".chorsesite").attr("id");
	}
	$.ajax({
		type : 'post',
		url : ctx + "/allSiteOfReportStatistics/getDataChart",
		data : {
			startDate : date[0],
			endDate : date[1],
			siteId : n
		},
		success : function(data) {
			data = JSON.parse(data);
			if (data.code == 200) {
				$('.barcontainer').css('display', 'none');
				/* 折线图----1 */

				var chart = new Highcharts.Chart({
					chart : {
						renderTo : 'userLineDraw'
					},

					title : {
						text : '',
						x : -20
					// center
					},
					subtitle : {
						text : '',
						x : -20
					},
					xAxis : {
						categories : data.data.dateList,
						labels : {
							rotation : -45
						// 坐标刻度垂直显示
						}
					},
					colors : [ '#03A1B9', '#03A1B9', '#03A1B9' ],
					yAxis : {
						title : {
							text : ''
						},
						plotLines : [ {
							value : 0,
							width : 1,
							color : '#808080'
						} ]
					},
					tooltip : {
						pointFormat : '{series.name}: <b>{point.y}</b><br/>',
						valueSuffix : ' %',
						shared : true
					},
					legend : {
						layout : 'horizontal',
						align : 'center',
						verticalAlign : 'top',
						borderWidth : 0
					},
					series : [ {
						name : '用户渗透率',
						data : data.data.permeateList
					}, {
						name : '注册转换率',
						data : data.data.tryRegisterList
					}, {
						name : '付费转换率',
						data : data.data.registerPayList
					} ],
					navigation : {
						buttonOptions : {
							enabled : false
						}
					}
				});
				/* 折线图----1 */
				if (data.data.registerPayList.length == 0) {
					$('.userLineDraw').css('display', 'none');
				}
			}
		}
	});
}
