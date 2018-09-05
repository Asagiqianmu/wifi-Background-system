//加载条
function buffer(){
	$('.barcontainer').css('display','block');
	$('.barcontainer').fadeOut(800);
}
buffer();
/************************************************时间格式********************************************************/
Date.prototype.Format = function (fmt) { //author: meizz 
	    var o = {
	        "M+": this.getMonth() + 1, //月份 
	        "d+": this.getDate(), //日 
	        "h+": this.getHours(), //小时 
	        "m+": this.getMinutes(), //分 
	        "s+": this.getSeconds(), //秒 
	        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
	        "S": this.getMilliseconds() //毫秒 
	    };
	    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	    for (var k in o)
	    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	    return fmt;
	};
/************************************************时间格式化方法******************************************************/

// /*线型图 */
$(function() {
	$('html').contextmenu(function(){
		return false;
	});
	
	buffer();
	var win = function() {
		$('.win').css('display', 'block').fadeOut(5000);
	};
	Highcharts.setOptions({
        colors: ['#6bbdec','#c5d6e7','#567bc3','#6b96ec']
    });
	/*********************初始化数据开始*******************************************************/
	 init();
	 /*********************初始化数据结束*******************************************************/
	 /*********************点击全部获得全部数据开始*******************************************************/
	 
	 $(".pullD li.allSiteClass").click(function() {
		$("#startTime").val("");
		$("#endTime").val("");
		$("#monthTime").val("");
		 init();
	 }); 
	 /*********************点击全部获得全部数据结束*******************************************************/
	
	 /*********************点击获得单一场所数据开始*******************************************************/
	 
	 $(".pullD>li.on").click(function() {
		    $("#startTime").val("");
			$("#endTime").val("");
			$("#monthTime").val("");
			 
		 var siteId = "";
		 buffer();
		 $(".occupie").css('display','block');
		 var i = $(".pullD>li.on").index(this);
		 $(".pullD>li.on").removeClass('siteChorse').eq(i).addClass("siteChorse"); 
		 var name = $('#theChorceDayAndMonth>p>span.on ').text();
		 siteId = $(".pullD>li.on.siteChorse").attr("value");
		 if(name=='按月'){
			    var html = "";
		    	html+="<input type='text' placeholder='请输入年份' readonly='readonly' id='monthTime' onclick=\"WdatePicker({dateFmt:'yyyy-MM'})\" class='Wdate' value='"+new Date().Format('yyyy-MM')+"'>"
		    	html+="<button class='queryButton' type='button' id='chakan'>查看</button>";
		    	$("#dateSelect").html(html);
			    getTotalMonthlyIncome(siteId);//最近十二 个月每月的查询总收入
		 }else{
			    var html = "";
		    	html+="<input type='text' readonly='readonly' placeholder='请输入开始时间' id='startTime' onclick=\"WdatePicker({dateFmt:'yyyy-MM-dd',maxDate:new Date()})\" class='Wdate' value='"+new Date((new Date().getTime()-11*24*60*60*1000)).Format('yyyy-MM-dd')+"'> &nbsp;至&nbsp;";
		    	html+="<input type='text' readonly='readonly' placeholder='请输入结束时间' id='endTime' onclick=\"WdatePicker({dateFmt:'yyyy-MM-dd',maxDate:new Date()})\" class='Wdate' value='"+new Date().Format('yyyy-MM-dd')+"'>";
		    	html+="<button class='queryButton' type='button' id='chakan'>查看</button>";
		    	$("#dateSelect").html(html);
			    getTwelveDaysBeforeRevenue(siteId);//最近十二天每天的总收入
		 } 
		// var text = $('.college').text();
			var date = getDangDate();
		 getBusinessData();//注册缴费网络感知度试用率
		 getDataChart(date);//获取图表 TODO
		 
		 getDataStatistics(siteId);//获得每天的收入和总的收入
		 theAllSiteMonthOrDayPayTotal();//选择是月还是天的方法
		 getPayTypeTotalNum(siteId);//获得各种支付类型
		 getSubscriberGrowth(siteId);//用户增长趋势
		 getManyPoepleUserTelephone(siteId);//获得多个用户登录的设备
		 getKeyEscrowUser(siteId);//重点推广用户
		 isMonthOrDay(siteId,name);
	 });
	 /*********************点击获得单一场所数据结束*******************************************************/
	// getDataChart()
	 
	 /*
	  * 日期查询按钮
	  */
	 $('#getUserDate').click(function(){
		 var start = $('#userStartDate').val();
		 var end = $('#userEndDate').val();
		 if(start==''){
			 $(".win>span").html("起始日期不能为空");
			 win();
		 }else if(end==''){
			 $(".win>span").html("终止日期不能为空");
			 win();
		 }else if(!duibi(start,end)){
			 $(".win>span").html("终止日期不能大于或等于起始日期");
			 win();
		 }else{
			 var date = [start,end];
			 getDataChart(date);
		 }
		
		 //console.log(end-start)
	 });
	 
});
/*********************初始化数据开始*******************************************************/
function init(){	
	var date = getDangDate();
	 getDataChart(date);
	 buffer();
	 var name = $('#theChorceDayAndMonth>p>span.on ').text(); 
	if(name=='按月'){
		    var html = "";
		    html+="<input type='text' placeholder='请输入年份' readonly='readonly' id='monthTime' onclick=\"WdatePicker({dateFmt:'yyyy-MM'})\" class='Wdate' value='"+new Date().Format('yyyy-MM')+"'>";
	    	html+="<button class='queryButton' type='button' id='chakanMonth'>查看</button>";
	    	$("#dateSelect").html(html);
		getAllSiteTotalMonthlyIncome();//当前的管理员下所有场所的最近十二个月的收入总和
	 }else{
		    var html = "";
	    	html+="<input type='text' placeholder='请输入开始时间' readonly='readonly' id='startTime' onclick=\"WdatePicker({dateFmt:'yyyy-MM-dd',maxDate:new Date()})\" class='Wdate' value='"+new Date((new Date().getTime()-11*24*60*60*1000)).Format('yyyy-MM-dd')+"'> &nbsp;至&nbsp;";
	    	html+="<input type='text' placeholder='请输入结束时间' readonly='readonly' id='endTime' onclick=\"WdatePicker({dateFmt:'yyyy-MM-dd',maxDate:new Date()})\" class='Wdate'  value='"+new Date().Format('yyyy-MM-dd')+"'>";
	    	html+="<button class='queryButton' type='button' id='chakanMonth'>查看</button>";
	    	$("#dateSelect").html(html);
		 getAllSiteOfTwelveDaysBeforeRevenue();//当前管理员下所有场所的最近十二天每天的总收入
	 } 
	
	var text = $('.college').text();
	 if(text=="查看全部"){
		 getBusinessData();//注册缴费网络感知度,使用注册率
	 }
	    getAllSiteTotalMoneyAndPeopleCount();//当前管理员下所有场所的每天的收入和总收入
	    theAllSiteMonthOrDayPayTotal();//选择最近十二天每天的收入和最近十二个月的总收入
	    getAllSiteSubscriberGrowth();//当前管理员下所有场所的用户下的趋势
		getAllSiteKeyEscrowUser();//当前管理员下所有场所重点推广用户
		getAllSiteManyPoepleUserTelephone();//当前管理员下所有场所台登陆的用户列表
		 $(".occupie").css('display','none');//缴费类型占比(所有的场所下不需要)
		 isAllMonthOrDay(name);
}
/*********************初始化结束*******************************************************/
 //单一场所按时间查询每月的总收入
 function isMonthOrDay(siteId,name){
	 $("#chakan").click(function(){
		 var text = $('.college').text();
		 var siteId = $(".pullD>li.on.siteChorse").attr("value");
		 if(text=="查看全部"){
		 }else{
             if(name=='按月'){
            	 getMonthlyIncome(siteId);
			 }else{
				 getDayIncome(siteId);
			 }
		 }
	 });
 }
 //用户下所有场所按时间查询每月的总收入
 function isAllMonthOrDay(name){
	 $("#chakanMonth").click(function(){
		 var text = $('.college').text();
		 if(text=="查看全部"){
			 if(name=='按月'){
				 getAllSiteMonthlyIncome();
			 }else{
				 getAllSiteOfInCome();
			 }
		 }
	 });
 }

//计算天数差的函数，通用  
function  DateDiff(sDate1,  sDate2){    //sDate1和sDate2是2006-12-18格式  
    var  aDate,  oDate1,  oDate2,  iDays;  
    aDate  =  sDate1.split("-");  
    oDate1  =  new  Date(aDate[1]  +  '/'  +  aDate[2]  +  '/'  +  aDate[0]) ;   //转换为12-18-2006格式  
    aDate  =  sDate2.split("-") ; 
    oDate2  =  new  Date(aDate[1]  +  '/'  +  aDate[2]  +  '/'  +  aDate[0]);  
    iDays  =  parseInt(Math.abs(oDate1  -  oDate2)  /  1000  /  60  /  60  /24) ;   //把相差的毫秒数转换为天数  
    return  iDays  ;
}    

/*********************获得当天的充值数,与总钱数*******************************************************/

	function getAllSiteTotalMoneyAndPeopleCount(){
		 
		$.ajax({
			type : "get",
			url : ctx+"/allSiteOfReportStatistics/getAllSiteTotalMoneyAndPeopleCount?time="+ Math.random(),
			success : function(data) {
				if(data=="loseSession"){
					 window.location.href=ctx+"/toLogin";
					 return;
				}	
				eval("data = " + data);
				if (data.code == 200) {
 					 //$("#today").text(data.data[0].todayMoney+"元");
					 $("#jts").html("(总)今日收益：<span class='money' id='today'>"+(data.data[0].todayMoney+"").substr(0,(data.data[0].todayMoney+"").length-2)+"元"+"</span>");
 					 $("#total").text((data.data[0].totalMoney+"").substr(0,(data.data[0].totalMoney+"").length-2)+"元");
 					 $("#zong").html("(总)人数<span class='numpe' id='siteNumTotal'>&nbsp;&nbsp;"+data.data[0].siteNum+"&nbsp;&nbsp;</span><div class='problem'><i class='icon icon-ask'></i><p class='proText'>该值表示您覆盖的场所的总人数，即若您覆盖的是学校，该校师生总共5000人，则该值为5000人，也是运营数据分析的关键对比指标，为了获取真实的运营数据，请您务必在“新增场所”时真实填写该数值。</p></div>"); 					 //$("#siteNumTotal").text(data.data[2]);
 					 $("#tryNOtTry").text(data.data[0].tryNotTry);
 					 $("#payNotPay").text(data.data[0].payNotPay);
 					 $("#reNotRe").text(data.data[0].regiterNotRe);
				}
			},
			error:function(){
				$(".win>span").html("网络服务忙,请稍后···");
				 win();
			}
		});
	}
	/*********************获得当天的充值数,与总钱数结束的位置*******************************************************/
	
	
	/*********************获得全部的场所的各种支付类型数量与比例*******************************************************/
	function getAllSitePayTypeTotalNum(){
		
				var	charConfigPie =	{
					chart : {
						 renderTo : 'pieChart',
						 plotBackgroundColor : null,
						 plotBorderWidth : null,
						 plotShadow : false,
						 type : 'pie'
						},
						title : {
							text : ''
						},
						navigation: {
			                buttonOptions: {
			                    enabled: false
			                }
			            },
						tooltip : {
							pointFormat : '{series.name}: <b>{point.percentage:.1f}%</b>'
						},
						plotOptions : {
							pie : {
								allowPointSelect : true,
								cursor : 'pointer',
								dataLabels : {
									enabled : false
								},
								showInLegend : true
							}
						},
						series : [ {
							name : "缴费类型占比",
							colorByPoint : true,
							data : [ {
								name : "按小时",
								y : 0
							}, {
								name : "按天",
								y : 0,
								sliced : false,
								selected : true
							}, {
								name : "按月",
								y : 0
							}, {
								name : "按年",
								y : 0
							} ]
						} ]
					};
		 $.ajax({
				type : "get",
				url : ctx + "/allSiteOfReportStatistics/getAllSitePayTypeTotalNum?time="+ Math.random(),
				success : function(data) {
					if(data=="loseSession"){
						 window.location.href=ctx+"/toLogin";
						 return;
					}	
					eval("data = " + data);
					if (data.code == 200) {
						buffer();//加载条
						var month = parseInt(data.data[0].month);
						var year = parseInt(data.data[0].year);
						var day = parseInt(data.data[0].day);
						var hour = parseInt(data.data[0].hour);
						charConfigPie.series[0].data[0].y=hour;
						charConfigPie.series[0].data[1].y=day;
						charConfigPie.series[0].data[2].y=month;
						charConfigPie.series[0].data[3].y=year;
					} else {
					}
					new Highcharts.Chart(charConfigPie);
				},
				error:function(){
					$(".win>span").html("网络服务忙,请稍后···");
					 win();
				}
			});
	}
	/*********************获得全部的场所的各种支付类型数量与比例结束的位置*******************************************************/
	/*********************获得每天的试用人数增加趋势*******************************************************/
	function getAllSiteSubscriberGrowth(){
		var	charConfigData =	{
					
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
					navigation: {
		                buttonOptions: {
		                    enabled: false
		                }
		            },
					xAxis : {
						categories : [],
						labels: {
						     rotation: -45 //坐标刻度垂直显示
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
					},series :[{
						name:'用户归属场所',
						data:[]
						
					}]

				};
//				);
		 $.ajax({
				type : "get",
				url : ctx + "/allSiteOfReportStatistics/getAllSiteSubscriberGrowth?time="+ Math.random(),
				success : function(data) {
					if(data=="loseSession"){
						 window.location.href=ctx+"/toLogin";
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
						charConfigData.series[0].data=d;
						charConfigData.xAxis.categories=x;
 					//	 chart.series[0].name=name; 
 					//	chart.series[0].setData(d);
					} else {}
					new Highcharts.Chart(charConfigData);
				},
				error:function(){
					$(".win>span").html("网络服务忙,请稍后···");
					 win();
				}
			});
	}
	/*********************获得每天的试用人数增加趋势结束的位置*******************************************************/
	/*********************获得最近12天每天的收入的总计开始的位置*******************************************************/
	function  getAllSiteOfTwelveDaysBeforeRevenue() {
		/*var chart;
		chart = new Highcharts.Chart(
				{*/
				var	charConfigLine = {
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
					navigation: {
		                buttonOptions: {
		                    enabled: false
		                }
		            },
					xAxis : {
						categories : [],
						crosshair : true,
						labels: {
						     rotation: -45 //坐标刻度垂直显示
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
//				//);
		 $.ajax({
			type : "get",
			url : ctx + "/allSiteOfReportStatistics/getAllSiteOfTwelveDaysBeforeRevenue?time="+ Math.random(),
			success : function(data) {
				if(data=="loseSession"){
					 window.location.href=ctx+"/toLogin";
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
					charConfigLine.series[0].data=d;
					charConfigLine.xAxis.categories=x;
				} else {}
				new Highcharts.Chart(charConfigLine);
			},
			error:function(){
				$(".win>span").html("网络服务忙,请稍后···");
				 win();
			}
		});
	}
	/*********************获得最近12天每天的收入的总计结束的位置*******************************************************/
	
	/*********************查询某时间段的每天的收入总和开始的位置*******************************************************/
	function getAllSiteOfInCome() {
		var startTime = $("#startTime").val();
		var endTime = $("#endTime").val();
		var eDate = new Date(endTime.replace(/-/g, '/'));
		var nowTime = new Date(new Date().Format("yyyy-MM-dd 00:00:00").replace(/-/g, '/'));
		var compare = DateDiff(startTime,endTime);
		if(startTime==""&&endTime==""){
			 $(".win>span").html("温馨提示:起始时间不能为空");
			 win();
		  return false;
		}else{
			  var sDate = new Date(startTime.replace(/-/g, '/'));
			  var eDate = new Date(endTime.replace(/-/g, '/'));
			  if(sDate>eDate){
				  $(".win>span").html("温馨提示:开始时间不能大于结束时间");
					 win();
				  return false;
			  }
		} 
		if(compare<11){
			$(".win>span").html("温馨提示:日期跨度不能小于12天");
			 win();
	    	return false;
		}
		if(compare>29){
			$(".win>span").html("温馨提示:日期跨度不能大于30天");
			 win();
	    	return false;
		}
		if(eDate>nowTime){
			 $(".win>span").html("温馨提示:结束时间不能大于今天的日期");
			 win();
	    	return false;
		}
		if(startTime==""&&endTime!=''){
			  $(".win>span").html("温馨提示:开始时间不能为空");
				 win();
			return false;
		}
		if(startTime!=""&&endTime==''){
			$(".win>span").html("温馨提示:结束时间不能为空");
			 win();
			return false;
		}
		
		var	totalMonth = {
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
					navigation: {
		                buttonOptions: {
		                    enabled: false
		                }
		            },
					xAxis : {
						categories : [],
						crosshair : true,
						labels: {
						     rotation: -45 //坐标刻度垂直显示
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
								+ '<td style="padding:0"><b>{point.y:.2f} 元</b></td></tr>', //point.y:.4f 保留四位小数
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
			url : ctx + "/allSiteOfReportStatistics/getAllSiteOfInCome?time="+ Math.random(),
			data:{
				startTime:startTime,
				endTime:endTime
			},
			success : function(data) {
				if(data=="loseSession"){
					 window.location.href=ctx+"/toLogin";
					 return;
				}	
				eval("data = " + data);
				if (data.code == 200) {
					var d = [];
					var x=[];
					$.each(data.data, function(i, item) {
						d.push(parseFloat(item.totalMoney));
						x.push(item.date);
					});
					totalMonth.series[0].data=d;
					totalMonth.xAxis.categories=x;
				} else {}
				new Highcharts.Chart(totalMonth);
			},
			error:function(){
				$(".win>span").html("网络服务忙,请稍后···");
				 win();
			}
		});
	}
	/*********************查询某时间段的每天的收入总和结束的位置*******************************************************/
	
	
	
	/*********************获得最近12个月每月收入的总计开始的位置*******************************************************/
function getAllSiteTotalMonthlyIncome() {
	/*var chart;
	chart = new Highcharts.Chart(
			{*/
	var	totalMonth = {
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
				navigation: {
	                buttonOptions: {
	                    enabled: false
	                }
	            },
				xAxis : {
					categories : [],
					crosshair : true,
					labels: {
					     rotation: -45 //坐标刻度垂直显示
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
	/*)*/;
	 $.ajax({
		type : "get",
		url : ctx + "/allSiteOfReportStatistics/getAllSiteTotalMonthlyIncome?time="+ Math.random(),
		success : function(data) {
			if(data=="loseSession"){
				 window.location.href=ctx+"/toLogin";
				 return;
			}	
			eval("data = " + data);
			if (data.code == 200) {
				var d = [];
				var x=[];
				$.each(data.data, function(i, item) {
					d.push(parseFloat(item.totalMoney));
					x.push(item.date);
				});
				totalMonth.series[0].data=d;
				totalMonth.xAxis.categories=x;
			} else {}
			new Highcharts.Chart(totalMonth);
		},
		error:function(){
			$(".win>span").html("网络服务忙,请稍后···");
			 win();
		}
	});
}
/*********************获得最近12个月每月收入的总计结束的位置*******************************************************/

/*********************查询当前用户下所有场所某年的每月的总收入开始的位置*******************************************************/
function getAllSiteMonthlyIncome() {
	 var years = $.trim($("#monthTime").val());
	 if(years==""){
		 $(".win>span").html("温馨提示:查询日期不能为空");
	     win();
		 return false;
		}
	 var nowTime = new Date().Format("yyyy");
		if(parseInt(years)>parseInt(nowTime)){
			$(".win>span").html("温馨提示:查询日期不能大于现在日期");
			 win();
			 return false;
		}
	var	totalMonth = {
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
				navigation: {
	                buttonOptions: {
	                    enabled: false
	                }
	            },
				xAxis : {
					categories : [],
					crosshair : true,
					labels: {
					     rotation: -45 //坐标刻度垂直显示
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
		url : ctx + "/allSiteOfReportStatistics/getAllSiteMonthlyIncome?time="+ Math.random(),
		data:{
			years:years
		},
		success : function(data) {
			if(data=="loseSession"){
				 window.location.href=ctx+"/toLogin";
				 return;
			}	
			eval("data = " + data);
			if (data.code == 200) {
				var d = [];
				var x=[];
				$.each(data.data, function(i, item) {
					d.push(parseFloat(item.totalMoney));
					x.push(item.date);
				});
				totalMonth.series[0].data=d;
				totalMonth.xAxis.categories=x;
			} else {}
			new Highcharts.Chart(totalMonth);
		},
		error:function(){
			$(".win>span").html("网络服务忙,请稍后···");
			 win();
		}
	});
}
/*********************查询当前用户下所有的场所下某年的每月的总收入结束的位置*******************************************************/


/*********************选择按月还是按天  开始的位置*******************************************************/
function theAllSiteMonthOrDayPayTotal(){
	 $("#theChorceDayAndMonth>p").unbind('click');
	 $('#theChorceDayAndMonth>p').click(function(){
		    var index = $('#theChorceDayAndMonth>p').index(this);
			$('#theChorceDayAndMonth>p>span').removeClass('on').eq(index).addClass('on');
			$("#startTime").val("");
			$("#endTime").val("");
			$("#monthTime").val("");
		});
		$('#theChorceDayAndMonth>p').click(function(){
			 var siteId = $(".pullD>li.on.siteChorse").attr("value");
			 var name = $('#theChorceDayAndMonth>p>span.on ').text();
			 var text = $('.college').text();
			 if(text=="查看全部"){
			    if(name=='按月'){
			    	var html = "";
			    	html+="<input type='text' placeholder='请输入年份' readonly='readonly' id='monthTime' onclick=\"WdatePicker({dateFmt:'yyyy-MM'})\" class='Wdate' value='"+new Date().Format('yyyy-MM')+"'>";
			    	html+="<button class='queryButton' type='button' id='chakanMonth'>查看</button>";
			    	$("#dateSelect").html(html);
					getAllSiteTotalMonthlyIncome();
			    }else{
			    	var html = "";
			    	html+="<input type='text' value='"+new Date((new Date().getTime()-11*24*60*60*1000)).Format('yyyy-MM-dd')+"'  placeholder='请输入开始时间' readonly='readonly' id='startTime' onclick=\"WdatePicker({dateFmt:'yyyy-MM-dd',maxDate:new Date()})\" class='Wdate'> &nbsp;至&nbsp;";
			    	html+="<input type='text' value='"+new Date().Format('yyyy-MM-dd')+"'  placeholder='请输入结束时间' readonly='readonly' id='endTime' onclick=\"WdatePicker({dateFmt:'yyyy-MM-dd',maxDate:new Date()})\" class='Wdate'>"
			    	html+="<button class='queryButton' type='button' id='chakanMonth'>查看</button>";
			    	$("#dateSelect").html(html);
			    	getAllSiteOfTwelveDaysBeforeRevenue();
			    }
			    isAllMonthOrDay(name);
			 }else{
				 if(name=='按月'){
					    var html = "";
				    	html+="<input type='text' placeholder='请输入年份' readonly='readonly' id='monthTime' onclick=\"WdatePicker({dateFmt:'yyyy-MM'})\" class='Wdate' value='"+new Date().Format('yyyy-MM')+"'>"
				    	html+="<button class='queryButton' type='button' id='chakan'>查看</button>";
				    	$("#dateSelect").html(html);
					    getTotalMonthlyIncome(siteId);
					    
			    }else{
				    	var html = "";
				    	html+="<input type='text' value='"+new Date((new Date().getTime()-11*24*60*60*1000)).Format('yyyy-MM-dd')+"' placeholder='请输入开始时间'readonly='readonly' id='startTime' onclick=\"WdatePicker({dateFmt:'yyyy-MM-dd',maxDate:new Date()})\" class='Wdate'> &nbsp;至&nbsp;";
				    	html+="<input type='text' value='"+new Date().Format('yyyy-MM-dd')+"' placeholder='请输入结束时间' readonly='readonly' id='endTime' onclick=\"WdatePicker({dateFmt:'yyyy-MM-dd',maxDate:new Date()})\" class='Wdate'>"
				    	html+="<button class='queryButton' type='button' id='chakan'>查看</button>";
				    	$("#dateSelect").html(html);
			    	    getTwelveDaysBeforeRevenue(siteId);
			    }
				 isMonthOrDay(siteId,name);
			 }
		});
}
/*********************选择按月还是按天  结束的位置*******************************************************/

/*********************被多台设备登录用户列表 开始的位置*******************************************************/
function getAllSiteManyPoepleUserTelephone(){
	 $.ajax({
			type : "get",
			url : ctx + "/allSiteOfReportStatistics/getAllSiteManyPoepleUserTelephone?time="+ Math.random(),
			success : function(data) {
				if(data=="loseSession"){
					 window.location.href=ctx+"/toLogin";
					 return;
				}	
				eval("data = " + data);
				if (data.code == 200) {
					buffer();
					var htmls = '';
					var loginCount = 0;
					$.each(data.data, function(i, item) {
					     loginCount = $.trim(item.count);
					});
					htmls+="<span>被多台设备登录用户列表</span><h5 class='allNum'><span>"+"</span></h5>";
					htmls+="<h4><span>设备数量</span><span>账号(联系电话)</span><span>人数</span></h4>";
					$.each(data.data, function(i, item) {
						if(i==data.data.length-1){
							return false;
						}
						htmls+="<div><span>"+item.marchNum+"</span><span>"+item.username+"</span><span>"+item.peoNum+"</span></div>";
					});
					$(".numPeople").html(htmls);
				 
				} else {
						var htmls ="<span>被多台设备登录用户列表</span><h5 class='allNum'><span>"+"</span></h5>";
						htmls+="<h4><span>设备数量</span><span>账号(联系电话)</span><span>人数</span></h4>";
						htmls+="<p style='color:#707070'>暂无数据</p>";
						$(".numPeople").html(htmls);
						return false;
				}
			},
			error:function(){
				$(".win>span").html("网络服务忙,请稍后···");
				 win();
			}
		});
}
	/*********************被多台设备登录用户列表 结束的位置*******************************************************/

/*********************重点推广用户列表 开始的位置*******************************************************/
function getAllSiteKeyEscrowUser(){
	 $.ajax({
			type : "get",
			url : ctx + "/allSiteOfReportStatistics/getAllSiteKeyEscrowUser?time="+ Math.random(),
			  async: false,
			success : function(data) {
				if(data=="loseSession"){
					 window.location.href=ctx+"/toLogin";
					 return;
				}	
				eval("data = " + data);
				 
				if (data.code == 200) {
					buffer();
				
					 var htmls = "<div class='problem'><i class='icon icon-ask'></i><p class='proText'>若一个用户频繁按基础类型付费(如按日、月)，并且从未购买过套餐则视为重点推广用户，您应该定期针对该部分用户采用电话或地推的方式鼓励其完成套餐付费</p></div><span>重点推广用户列表</span>";
					     htmls+="<h4><span>排名</span><span>联系电话</span><span>付费频次</span></h4>";
					     $.each(data.data, function(i, item) {
					    	 i=i+1;
					    	 if(item.user_name.charAt(0)=="0"){
					    		var user_name = item.user_name.substr(1,item.user_name.length);
					    		htmls+="<div class='sale' id='"+item.id+"' value='"+item.siteId+"'><span>"+i+"</span><span>"+user_name+"</span><span>"+item.frequency+"</span>";
					    		htmls+="<div class='detail'></div></div>";
					    	 }else{
					    		 htmls+="<div class='sale' id='"+item.id+"' value='"+item.siteId+"'><span>"+i+"</span><span>"+item.user_name+"</span><span>"+item.frequency+"</span>";
						    	 htmls+="<div class='detail'></div></div>";
					    	 }
							});
					     $(".emphasis").html(htmls);
					    getAllSitePayRecord();
				} else {
						 var htmls = "<div class='problem'><i class='icon icon-ask'></i><p class='proText'>若一个用户频繁按基础类型付费(如按日、月)，并且从未购买过套餐则视为重点推广用户，您应该定期针对该部分用户采用电话或地推的方式鼓励其完成套餐付费</p></div><span>重点推广用户列表</span>";
					     htmls+="<h4><span>排名</span><span>联系电话</span><span>付费频次</span></h4>";
				    	 htmls += "<p style='color:#707070'>暂无数据</p>";
				    	 $(".emphasis").html(htmls);
				}
			},
			error:function(){
				$(".win>span").html("网络服务忙,请稍后···");
				 win();
			}
		});
    }
var  pid="";//临时变量用以解决mouseenter连续被触发的went
/*********************重点推广用户列表 结束的位置*******************************************************/
/*********************获得用户下的缴费记录 开始的位置*******************************************************/
	 function getAllSitePayRecord(){
		 $('.emphasis>div.sale').mousemove(function(e){
			 
			    var index = $(".emphasis>div.sale").index(this);
				var portalId = parseInt($(".emphasis>div.sale").eq(index).attr("id"));
				var siteId = parseInt($(".emphasis>div.sale").eq(index).attr("value"));
			 
				var n=$('.emphasis>div.sale').index(this);
				var offTop=$('.emphasis>div.sale').eq(n).offset();
				var initL=e.pageX;
				var initT=e.pageY;
				$('.detail').css({'left':initL-offTop.left+'px','top':initT-offTop.top+'px'});
				if(pid!=portalId){//阻止事件连续被触发
					pid = portalId;
					getUserPayRecord(siteId,portalId);
				}
				return false;
			});
	 }
	 
	 function getUserPayRecord(siteId,portalId){
		 
		 $.ajax({
				type : "get",
				url : ctx + "/allSiteOfReportStatistics/getAllSitePayRecord",
				data:{
					siteId:siteId,
					portalId:portalId
				},
				 // async: false,
				success : function(data) {
					if(data=="loseSession"){
						 window.location.href=ctx+"/toLogin";
						 return;
					}	
					eval("data = " + data);
					if (data.code == 200) {
						 var h = "<p><span>缴费时间</span><span>缴费金额</span></p>";
						     $.each(data.data, function(i, item) {
						    	 h+="<p><span>"+item.time+"</span><span>"+item.amount+"</span></p>";
								});
						     $(".detail").html(h);
					} else {
					}
				},
				error:function(){
					$(".win>span").html("网络服务忙,请稍后···");
					 win();
				}
			});
	 }
	 /*********************获得用户下的缴费记录 结束的位置*******************************************************/
	
	 /*********************获得当天的充值数,与总钱数 开始的位置*******************************************************/
	
		function getDataStatistics(siteId){
			 
			$.ajax({
				type : "get",
				url : ctx+"/dataStatistics/getTotalMoneyTotal?time="+ Math.random(),
				data : {
					 siteId:siteId
				},
				success : function(data) {
					if(data=="loseSession"){
						 window.location.href=ctx+"/toLogin";
						 return;
					}	
					eval("data = " + data);
					if (data.code == 200) {
						//$("#today").text(data.data[0].todayMoney+"元");
						 $("#jts").html("今日收益：<span class='money' id='today'>"+ (data.data[0].todayMoney+"").substr(0,(data.data[0].todayMoney+"").length-2)+"元"+"</span>");
	 					 $("#total").text((data.data[0].totalMoney+"").substr(0,(data.data[0].totalMoney+"").length-2)+"元");
	 					
	 					 $("#zong").html("人数<span class='numpe' id='siteNumTotal'>&nbsp;&nbsp;"+data.data[0].siteNum+"&nbsp;&nbsp;</span><div class='problem'><i class='icon icon-ask'></i><p class='proText'>该值表示您覆盖的场所的总人数，即若您覆盖的是学校，该校师生总共5000人，则该值为5000人，也是运营数据分析的关键对比指标，为了获取真实的运营数据，请您务必在“新增场所”时真实填写该数值。</p></div>");			 //$("#siteNumTotal").text(data.data[2]);
	 					 $("#tryNOtTry").text(data.data[0].tryNotTry);
	 					 $("#payNotPay").text(data.data[0].payNotPay);
	 					 $("#reNotRe").text(data.data[0].regiterNotRe);
					}else{
					}
				},
				error:function(){
					$(".win>span").html("网络服务忙,请稍后···");
					 win();
				}
			});
		}
/*********************获得当天的充值数,与总钱数 开始的位置*******************************************************/
		/*********************获得有效增减趋势 开始的位置*******************************************************/
		function getSubscriberGrowth(siteId){
			//var chart;
		//	chart = new Highcharts.Chart(
			var	charConfigData =	{
						
						chart : {
							renderTo : 'lineChart',
							type : 'line'
						},
						title : {
							text : ' ',
							x : -20
						// center
						},
						subtitle : {
							text : '',
							x : -20
						},
						xAxis : {
							categories : [],
							labels: {
							     rotation: -45 //坐标刻度垂直显示
							 }
						},
						navigation: {
			                buttonOptions: {
			                    enabled: false
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
						},series :[{
							name:'',
							data:[]
							
						}]

					};
					//);
			 $.ajax({
					type : "get",
					url : ctx + "/dataStatistics/getSubscriberGrowth?time="+ Math.random(),
					data : {
						siteId : siteId
					},
					success : function(data) {
						if(data=="loseSession"){
							 window.location.href=ctx+"/toLogin";
							 return;
						}	
						eval("data = " + data);
						if (data.code == 200) {
							var d = [];
							var x = [];
							var name = '';
							$.each(data.data, function(i, item) {
								if(item.name){
									name = item.name;
								}else{
									d.push(item.num);
									x.push(item.date);
								}
							});
							charConfigData.series[0].name=name;
							charConfigData.series[0].data=d;
							charConfigData.xAxis.categories=x;
						//	 chart.series[0].name=name; 
						//	chart.series[0].setData(d);
							 
						} else {}
						new Highcharts.Chart(charConfigData);
					},
					error:function(){
						$(".win>span").html("网络服务忙,请稍后···");
						 win();
					}
				});
		}
/*********************获得有效增减趋势 结束的位置*******************************************************/
		
		
/*********************获得各种支付类型的比例与人数 结束的位置*******************************************************/
		function getPayTypeTotalNum(siteId){
			   
				var type = {
						chart : {
							 renderTo : 'pieChart',
							 type: 'pie',
							 
			            },
			            title: {
			                text: ''
			            },
			            tooltip: {
			                pointFormat: '{series.name}: <b>{point.percentage:.2f}%</b>'
			            },
			           
			            navigation: {
			                buttonOptions: {
			                    enabled: false
			                }
			            },
			            colors:[
                               '#6bbdec',
                               '#c5d6e7',
                               '#567bc3',
                               '#6b96ec',
                               '#492970',
                               '#f28f43', 
                               '#77a1e5', 
                               '#c42525', 
                               '#a6c96a'
		                      ],
			            plotOptions: { 
			                pie: { 
			                allowPointSelect: false, //选中某块区域是否允许分离 
			                cursor: 'pointer', 
			                dataLabels: { 
			                	enabled: true, //是否直接呈现数据 也就是外围显示数据与否 
			                     format: '<b>{point.name}</b>',
			                     distance: -80
                        
			                }, 
			                showInLegend: true 
			                } 
			            },
			           
			            series: [{
			                name: "缴费类型占比",
				                colorByPoint: true,
				                dataLabels: {
				                formatter: function() {
				                    return this.y > 5 ? this.point.name : null;
				                },
				                color: 'black',
				                distance: -30
				               },
							data : []
					      }],
						};
			
			 $.ajax({
					type : "get",
					url : ctx + "/dataStatistics/getTypeProportion?time="+ Math.random(),
					data : {
						siteId : siteId
					},
					async: false,
					success : function(data) {
						if(data=="loseSession"){
							 window.location.href=ctx+"/toLogin";
							 return;
						}	
						eval("data = " + data);
						if (data.code == 200) {
							buffer();
							$("#pie").text("");
							//[{finalBili=0.36, finalName=医院收费, finalCount=5},
							for(var i=0;i<data.data.length;i++){
								type.series[0].data.push(
										{
									       name : data.data[i].finalName,
									       y : parseFloat(data.data[i].finalBili)
										}
								);
							}
						} else {
							htmls = "<p style='color:#707070;font-size:16px;font-weight:bold'>暂无数据</p>";
							$("#pie").html(htmls);
						}
						new Highcharts.Chart(type);
					},
					error:function(){
						$(".win>span").html("网络服务忙,请稍后···");
						 win();
					}
				});
			
		}
/*********************获得各种支付类型的比例与人数 结束的位置*******************************************************/

/*********************获得最近12个天每天的总收入开始的位置*******************************************************/
		function  getTwelveDaysBeforeRevenue(siteId) {
			/*var chart;
			chart = new Highcharts.Chart(
					{*/
					var	charConfigLine = {
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
						navigation: {
			                buttonOptions: {
			                    enabled: false
			                }
			            },
						xAxis : {
							categories : [],
							crosshair : true,
							labels: {
							     rotation: -45 //坐标刻度垂直显示
							 }
						},
						yAxis : {
							min : 0,
							title : {
						    text : '日收入统计 (元)'
							},
							  allowDecimals:false
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
					//);
			 $.ajax({
				type : "get",
				url : ctx + "/dataStatistics/getTwelveDaysBeforeRevenue?time="+ Math.random(),
				data : {
					siteId : siteId
				},
				success : function(data) {
					if(data=="loseSession"){
						 window.location.href=ctx+"/toLogin";
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
						charConfigLine.series[0].data=d;
						charConfigLine.xAxis.categories=x;
					} else {
					}
					new Highcharts.Chart(charConfigLine);
				},
				error:function(){
					$(".win>span").html("网络服务忙,请稍后···");
					 win();
				}
			});
		}
		
/*********************获得最近12个天每天的总收入结束的位置*******************************************************/
/*********************获得查询每天的总收入开始的位置*******************************************************/
		function  getDayIncome(siteId) {
			var startTime = $("#startTime").val();
			var endTime = $("#endTime").val();
			var eDate = new Date(endTime.replace(/-/g, '/'));
			var nowTime = new Date(new Date().Format("yyyy-MM-dd 00:00:00").replace(/-/g, '/'));
			var compare = DateDiff(startTime,endTime);
			if(startTime==""&&endTime==''){
//				startTime = '00:00:00';
//				endTime = "00:00:00"
	 			 $(".win>span").html("温馨提示:起始时间不能为空");
				 win();
			  return false;
			}else{
				 var sDate = new Date(startTime.replace(/-/g, '/'));
				  var eDate = new Date(endTime.replace(/-/g, '/'));
				  if(sDate>eDate){
					  $(".win>span").html("温馨提示:开始时间不能大于结束时间");
						 win();
					  return false;
				  }
			}
				if(compare<11){
					$(".win>span").html("温馨提示:日期跨度不能小于12天");
					 win();
			    	return false;
				}
				if(compare>29){
					$(".win>span").html("温馨提示:两个日期相差不能大于30天");
					 win();
			    	return false;
				}
				if(eDate>nowTime){
					 $(".win>span").html("温馨提示:结束时间不能大于今天的日期");
					 win();
			    	return false;
				}
			if(startTime==""&&endTime!=''){
				  $(".win>span").html("温馨提示:开始时间不能为空");
					 win();
				return false;
			}
			if(startTime!=""&&endTime==''){
				$(".win>span").html("温馨提示:结束时间不能为空");
				 win();
				return false;
			}
	 		
					var	charConfigLine = {
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
						navigation: {
			                buttonOptions: {
			                    enabled: false
			                }
			            },
						xAxis : {
							categories : [],
							crosshair : true,
							labels: {
							     rotation: -45 //坐标刻度垂直显示
							 }
						},
						yAxis : {
							min : 0,
							title : {
						    text : '日收入统计 (元)'
							},
							  allowDecimals:false
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
					//);
			 $.ajax({
				type : "get",
				url : ctx + "/dataStatistics/getDayIncome?time="+ Math.random(),
				data : {
					siteId : siteId,
					startTime:startTime,
					endTime:endTime
				},
				success : function(data) {
					if(data=="loseSession"){
						 window.location.href=ctx+"/toLogin";
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
						charConfigLine.series[0].data=d;
						charConfigLine.xAxis.categories=x;
					} else {
					}
					new Highcharts.Chart(charConfigLine);
				},
				error:function(){
					$(".win>span").html("网络服务忙,请稍后···");
					 win();
				}
			});
		}
/*********************查询某时间段的收入结束的位置*******************************************************/
		
		
/*********************获得最近12个月每月的总收入开始的位置*******************************************************/
	function getTotalMonthlyIncome(siteId) {
		var	totalMonth = {
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
					navigation: {
		                buttonOptions: {
		                    enabled: false
		                }
		            },
					xAxis : {
						categories : [],
						crosshair : true,
						labels: {
						     rotation: -45 //坐标刻度垂直显示
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
		 ;
		 $.ajax({
			type : "get",
			url : ctx + "/dataStatistics/getTotalMonthlyIncome?time="+ Math.random(),
			data : {
				siteId : siteId
			},
			success : function(data) {
				if(data=="loseSession"){
					 window.location.href=ctx+"/toLogin";
					 return;
				}	
				eval("data = " + data);
				if (data.code == 200) {
					var d = [];
					var x=[];
					$.each(data.data, function(i, item) {
						d.push(parseFloat(item.totalMoney));
						x.push(item.date);
					});
					totalMonth.series[0].data=d;
					totalMonth.xAxis.categories=x;
				} else {
				}
				new Highcharts.Chart(totalMonth);
			},
			error:function(){
				$(".win>span").html("网络服务忙,请稍后···");
				 win();
			}
		});
	}
	/*********************获得最近12个月每月的总收入结束的位置*******************************************************/
	
	
	
	/*********************查看某年的每月的收入总和开始的位置*******************************************************/
		function getMonthlyIncome(siteId) {
			var year = $.trim($("#monthTime").val());
			if(year==""){
				$(".win>span").html("温馨提示:查询日期不能为空");
				 win();
				 return false;
			}
			var nowTime = new Date().Format("yyyy");
			if(parseInt(year)>parseInt(nowTime)){
				$(".win>span").html("温馨提示:查询日期不能大于现在日期");
				 win();
				 return false;
			}
			var	totalMonth = {
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
						navigation: {
			                buttonOptions: {
			                    enabled: false
			                }
			            },
						xAxis : {
							categories : [],
							crosshair : true,
							labels: {
							     rotation: -45 //坐标刻度垂直显示
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
			 ;
			 $.ajax({
				type : "get",
				url : ctx + "/dataStatistics/getMonthlyIncome?time="+ Math.random(),
				data : {
					siteId : siteId,
					year:year
				},
				success : function(data) {
					if(data=="loseSession"){
						 window.location.href=ctx+"/toLogin";
						 return;
					}	
					eval("data = " + data);
					if (data.code == 200) {
						var d = [];
						var x=[];
						$.each(data.data, function(i, item) {
							d.push(parseFloat(item.totalMoney));
							x.push(item.date);
						});
						totalMonth.series[0].data=d;
						totalMonth.xAxis.categories=x;
					} else {
					}
					new Highcharts.Chart(totalMonth);
				},
				error:function(){
					$(".win>span").html("网络服务忙,请稍后···");
					 win();
				}
			});
		}
		/*********************查看某年的每月的收入总和结束的位置*******************************************************/
	 
	/*********************获得被多台设备登录用户列表 开始的位置*******************************************************/
	function getManyPoepleUserTelephone(siteId){
		 $.ajax({
				type : "get",
				url : ctx + "/dataStatistics/getManyPoepleUserTelephone?time="+ Math.random(),
				data : {
					siteId : siteId
				},
				  async: false,
				success : function(data) {
					if(data=="loseSession"){
						 window.location.href=ctx+"/toLogin";
						 return;
					}	
					eval("data = " + data);
					if (data.code == 200) {
						 
						var htmls = '';
						var loginCount = 0;
						$.each(data.data, function(i, item) {
						     loginCount = $.trim(item.count);
						});
						htmls+="<span>被多台设备登录用户列表</span><h5 class='allNum'><span>"+"</span></h5>";
						htmls+="<h4><span>设备数量</span><span>账号(联系电话)</span><span>人数</span></h4>";
						$.each(data.data, function(i, item) {
							if(i==data.data.length-1){
								return false;
							}
							htmls+="<div><span>"+item.marchNum+"</span><span>"+item.username+"</span><span>"+item.peoNum+"</span></div>";
						});
					 
						$(".numPeople").html(htmls);
						
					} else {
							var htmls ="<span>被多台设备登录用户列表</span><h5 class='allNum'> <span>"+"</span></h5>";
							htmls+="<h4><span>设备数量</span><span>账号(联系电话)</span><span>人数</span></h4>";
							htmls+="<p style='color:#707070'>暂无数据</p>";
							$(".numPeople").html(htmls);
					}
				},
				error:function(){
					$(".win>span").html("网络服务忙,请稍后···");
					 win();
				}
			});
		}
	/*********************获得被多台设备登录用户列表 结束的位置*******************************************************/
	/*********************获得重点推广用户列表 开始的位置*******************************************************/	 
	function getKeyEscrowUser(siteId){
		 $.ajax({
				type : "get",
				url : ctx + "/dataStatistics/getKeyEscrowUser?time="+ Math.random(),
				data : {
					siteId : siteId
				},
				success : function(data) {
					if(data=="loseSession"){
						 window.location.href=ctx+"/toLogin";
						 return;
					}	
					eval("data = " + data);
					if (data.code == 200) {
						 
						 var htmls = "<div class='problem'><i class='icon icon-ask'></i><p class='proText'>若一个用户频繁按基础类型付费(如按日、月)，并且从未购买过套餐则视为重点推广用户，您应该定期针对该部分用户采用电话或地推的方式鼓励其完成套餐付费</p></div><span>重点推广用户列表</span>";
						     htmls+="<h4><span>排名</span><span>联系电话</span><span>付费频次</span></h4>";
						     $.each(data.data, function(i, item) {
						    	 i=i+1;
						    	 if(item.user_name.charAt(0)=="0"){
							    		var user_name = item.user_name.substr(1,item.user_name.length);
							    		htmls+="<div class='sale' id='"+item.id+"' value='"+item.siteId+"'><span>"+i+"</span><span>"+user_name+"</span><span>"+item.frequency+"</span>";
							    		htmls+="<div class='detail'></div></div>";
							    	 }else{
							    		 htmls+="<div class='sale' id='"+item.id+"' value='"+item.siteId+"'><span>"+i+"</span><span>"+item.user_name+"</span><span>"+item.frequency+"</span>";
								    	 htmls+="<div class='detail'></div></div>";
							    	 }
								});
						     $(".emphasis").html(htmls);
						    	 getPayRecord();
					} else {
							 var htmls = "<div class='problem'><i class='icon icon-ask'></i><p class='proText'>若一个用户频繁按基础类型付费(如按日、月)，并且从未购买过套餐则视为重点推广用户，您应该定期针对该部分用户采用电话或地推的方式鼓励其完成套餐付费</p></div><span>重点推广用户列表</span>";
						     htmls+="<h4><span>排名</span><span>联系电话</span><span>付费频次</span></h4>";
					    	 htmls += "<p style='color:#707070'>暂无数据</p>";
					    	 $(".emphasis").html(htmls);
					    	 
						 
					}
				},
				error:function(){
					$(".win>span").html("网络服务忙,请稍后···");
					 win();
				}
			});
	    }
	/*********************获得重点推广用户列表 结束的位置*******************************************************/
	
/*********************获得用户缴费记录 开始的位置*******************************************************/
	var sing = "";
		 function getPayRecord(){
			 $('.emphasis>div.sale').mousemove(function(e){
					var index = $(".emphasis>div.sale").index(this);
					var userId = parseInt($(".emphasis>div.sale").eq(index).attr("id"));
					var siteId = parseInt($(".emphasis>div.sale").eq(index).attr("value"));
					var n=$('.emphasis>div.sale').index(this);
					var offTop=$('.emphasis>div.sale').eq(n).offset();
					var initL=e.pageX;
					var initT=e.pageY;
					$('.detail').css({'left':initL-offTop.left+'px','top':initT-offTop.top+'px'});
					if(sing!=userId){//阻止事件连续被触发
						sing = userId;
						getUserPayReport(siteId,userId);
					}

					return false;
				});
		 } 
		 
		 function getUserPayReport(siteId,userId){
			 $.ajax({
					type : "get",
					url : ctx + "/dataStatistics/getPayRecord?time="+ Math.random(),
					data : {
						siteId : siteId,
						userId:userId
					},
					success : function(data) {
						if(data=="loseSession"){
							 window.location.href=ctx+"/toLogin";
							 return;
						}	
						eval("data = " + data);
						if (data.code == 200) {
							 var h = "<p><span>缴费时间</span><span>缴费金额</span></p>";
							     $.each(data.data, function(i, item) {
							    	 h+="<p><span>"+item.time+"</span><span>"+item.amount+"</span></p>";
							    	 
									});
							     $(".detail").html(h);
						} else {
						}
					},
					error:function(){
						$(".win>span").html("网络服务忙,请稍后···");
						 win();
					}
				});
		 }
/*********************获得用户缴费记录 结束的位置*******************************************************/
/*********************获得缴费,注册,试用数据 开始的位置*******************************************************/	 
		 function getRegistrationPayments(siteId){
			 
			 $.ajax({
					type : "get",
					url : ctx + "/dataStatistics/getEveryRatio?time="+ Math.random(),
					data : {
						siteId : siteId
					},
					success : function(data) {
						if(data=="loseSession"){
							 window.location.href=ctx+"/toLogin";
							 return;
						}	
						eval("data = " + data);
						if (data.code == 200) {
							buffer();
							canvas(data.data[0].pay,'register');
						    canvas(data.data[2].regisersYes,'tryOut');
							canvas(data.data[1].yesTry,'perception');
						} else {
						}
					},
					error:function(){
						$(".win>span").html("网络服务忙,请稍后···");
						 win();
					}
				}); 
		}
 
/*********************获得支付类型的各种比例 开始的位置*******************************************************/
function getRegistrationPayment(){
	 $.ajax({
			type : "POST",
			url : ctx + "/allSiteOfReportStatistics/getAllSitePayTryPay?time="+ Math.random(),
			success : function(data) {
				if(data=="loseSession"){
					 window.location.href=ctx+"/toLogin";
					 return;
				}	
				eval("data = " + data);
				if (data.code == 200) {
					buffer();
					 canvas(data.data[0].pay,'register');
					 canvas(data.data[2].regisersYes,'tryOut');
					 canvas(data.data[1].yesTry,'perception'); 
				}
			},
			error:function(){
				$(".win>span").html("网络服务忙,请稍后···");
				 win();
			}
		}); 
}
/*********************获得支付类型的各种比例 结束的位置*******************************************************/
/*********************获得缴费,注册,试用图标 结束的位置*******************************************************/
function buffer(){
	$('.barcontainer').css('display','block');
	$('.barcontainer').fadeOut(800);
}
function canvas(pre,canvasId){
	if(pre==undefined){
		pre=0;
	}
    var bg = document.getElementById(canvasId);
    var ctx = bg.getContext('2d');
    bg.width = bg.width;
    var circ = Math.PI * 2;
    var quart = Math.PI / 2;
    var imd = null;
    var circ = Math.PI * 2;
    var quart = Math.PI / 2;
    var round=bg.previousSibling.previousSibling;
    ctx.beginPath();
    if(pre>0.8){
        ctx.strokeStyle = '#68d15a';
        round.style.color='#68d15a';
    }else if(pre<0.2){
        ctx.strokeStyle = '#e94e4e';
        round.style.color='#e94e4e';
    }else{
        ctx.strokeStyle = '#4bc1f8';
        round.style.color='#4bc1f8';
    }
    ctx.lineCap = 'square';
    ctx.closePath();
    ctx.fill();
    ctx.lineWidth = 20.0;

    imd = ctx.getImageData(0, 0, 240, 240);
    function draw(current){
        ctx.putImageData(imd, 0, 0);
        ctx.beginPath();
        ctx.arc(100, 100, 60, -(quart), ((circ) * current) - quart, false);
        ctx.stroke();
    }
    var t=0;
    var timer=null;
    function loadCanvas(now){
    	//console.log(now)
        timer = setInterval(function(){
        		if(t>now){//0.0278
        			clearInterval(timer);
        			//round.innerHTML=(now*100).toFixed(2)+'%';
	            }else if(t<=1){
	            	draw(t);
	            	t+=0.01;
	            	var time = parseFloat((t)*100);
	            	var finaltime = time.toFixed(2);
	            	if(finaltime==1.0){
	            		draw(0);
	            		round.innerHTML='0.00%';
	            	}else{
	            		 if(t>now){
	            			 round.innerHTML=(now*100).toFixed(2)+'%';
	            			 clearInterval(timer);
	            		 }else{
	            			 round.innerHTML=finaltime+'%';
	            		 }
	            		 
	            	}
	            }else{
	                clearInterval(timer);
	            }
        },10);
    }
    loadCanvas(pre);
    timer=null;
}

function getBusinessData(){
	if($('.college').text().split('<')[0]=='查看全部'){
		//alert(1)
		var n = -1;
	}
	//TODO businessData ajax请求 
	 $.ajax({
			type : "get",
			url : ctx+"/allSiteOfReportStatistics/getAllBusinessData",
			data:{
				siteId : n?n:$(".pullD>li.on.siteChorse").attr("value")
			},
			success : function(data) {
				data = JSON.parse(data);
				if(data.code==200){
					//console.log(data.data.tryRegisterRate)
					$('.independent > span').text(data.data.uvNum);
					$('.register > span').text(data.data.registerNum);
					$('.pay > span').text(data.data.payNum);
					$('.yesterday > span').text(data.data.loginNum);
					canvas(data.data.permeateRate,'perception'); // 用户渗透率
				    canvas(data.data.tryRegisterRate,'tryOut'); // 新增注册转换
					canvas(data.data.registerPayRate,'register'); // 新增付费转换率
				}
			},
			error:function(){
				
			}
		});
	 
}
//TODO 折线图数据 ajax请求（共三个ajax）
function getDataChart(date){
	if($('.college').text().split('<')[0]=='查看全部'){
		var n = -1;
	}
	$.ajax({
		type: 'post',
		url: ctx+"/allSiteOfReportStatistics/getDataChart",
		data: {
			startDate: date[0],
			endDate: date[1],
			siteId : n?n:$(".pullD>li.on.siteChorse").attr("value")
		},
		success: function(data){
			data = JSON.parse(data);
			if(data.code==200){
				console.log(data.code);
				
				
				/* 折线图----1 */
				 $('#userLineDraw').highcharts({
				        title: {
				            text: '',
				            x: -20 //center
				        },
				        subtitle: {
				            text: '',
				            x: -20
				        },
				        xAxis: {
				            categories: data.data.dateList
				        },
				        yAxis: {
				            title: {
				                text: ''
				            },
				            plotLines: [{
				                value: 0,
				                width: 1,
				                color: '#808080'
				            }]
				        },
				        tooltip: {
				            pointFormat: '{series.name}: <b>{point.y}</b><br/>',
				            valueSuffix: ' %',
				            shared: true
				        },
				        legend: {
				            layout: 'horizontal',
				            align: 'center',
				            verticalAlign: 'top',
				            borderWidth: 0
				        },
				        series: [{
				            name: '用户渗透率',
				            data: data.data.permeateList
				        }, {
				            name: '注册转换率',
				            data: data.data.tryRegisterList
				        }, {
				            name: '付费转换率',
				            data: data.data.registerPayList
				        }],
						navigation: {
			                buttonOptions: {
			                    enabled: false
			                }
			            }
				    });
				 /* 折线图----1 */
				 if(data.data.registerPayList.length==0){
					 $('.userLineDraw').css('display','none');
				 }
			}
		}
	});
}

function getDangDate(){
	var myDate = new Date();
	var y = myDate.getFullYear();
	var m = myDate.getMonth()+1<10?'0'+(myDate.getMonth()+1):myDate.getMonth()+1;
	var d = myDate.getDate()<10?'0'+myDate.getDate():myDate.getDate();
	var enddate = y+'-'+m+'-'+d;
	var d = new Date(enddate);
	var e = new Date(enddate);
	e.setDate(d.getDate()-1);
	var mmm = e.getMonth()+1<10?'0'+(e.getMonth()+1):e.getMonth()+1;
	enddate = e.getFullYear()+'-'+mmm+'-'+(e.getDate()<10?'0'+e.getDate():e.getDate());
	d.setDate(d.getDate()-13);
	var mm = d.getMonth()+1<10?'0'+(d.getMonth()+1):d.getMonth()+1;
	var startdate = d.getFullYear()+'-'+mm+'-'+(d.getDate()<10?'0'+d.getDate():d.getDate());
	var dataArr = [startdate,enddate]
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
    }
    else{
    	var c = true;
    }
        return c;

}
