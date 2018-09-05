
var isDayOrMonth = 0;
$(function () {
	reset ();
	
	$('.swicth').click(function(){
		var str = $(this).attr('class');
		if(str=='swicth d'){
			 reset ()
			isDayOrMonth=0;
			var html = "<input type='text' readonly='readonly' placeholder='请输入查询时间' onclick=\"WdatePicker({dateFmt:\'yyyy-MM-dd\'})\" value='' id='startAt2' class='Wdate'> 至<input type='text' readonly='readonly' placeholder='请输入查询时间' onclick=\"WdatePicker({dateFmt:\'yyyy-MM-dd\'})\" value='' id='endAt2' class='Wdate'>";
			$('.dayormonth').html(html);
		}else{
			 reset ()
			var html = "<input type='text' readonly='readonly' placeholder='请输入查询时间' onclick=\"WdatePicker({dateFmt:\'yyyy-MM\'})\" value='' id='month1' class='Wdate'>";
			$('.dayormonth').html(html);
			isDayOrMonth=1;
		}
	});
	
	$('.export-data').click(function(){
		var agentName = $("#agentname").val();
		if(agentName==''){
			$(".win>span").html("请输入运营商账号");
			winHint();
			return;
		}
		var text = $('.seleType').text();
		if(text=='请选择'){
			$(".win>span").html("请选择场所");
			winHint();
			return;
		}
		var startTime = $('#startAt2').val() ;
		var endTime = $('#endAt2').val() ;
		if(startTime==''||endTime==''){
			$(".win>span").html("请输入查询时间");
			winHint();
    		return;
		}
		if(text=='查看全部'){
			if(isDayOrMonth==0){//天
				var startTimes = startTime.replace(/-/g,"/");
				var endTimes = endTime.replace(/-/g,"/");
				var sTime = new Date(startTimes).getTime();
				var eTime = new Date(endTimes).getTime();
				var time31 = 31*24*60*60*1000;
				if(eTime-sTime>time31){
					$(".win>span").html("时间不能大于31天");
					winHint();
					return;
				}
				window.location.href = ctx+"/SettlementRatio/exportExcelAll?agentName="+agentName+"&startTime="+startTime+"&endTime="+endTime;
			}else{
				var year = $('#month1').val();
				if(year==''){
					$(".win>span").html("请输入查询时间");
					winHint();
					return;
				}
				window.location.href = ctx+"/SettlementRatio/exportExcelAM?agentName="+agentName+"&year="+year;
			}
		}else{
			var siteId = $('.seleType').attr('siteid');
			if(isDayOrMonth==0){
				var startTimes = startTime.replace(/-/g,"/");
				var endTimes = endTime.replace(/-/g,"/");
				var sTime = new Date(startTimes).getTime();
				var eTime = new Date(endTimes).getTime();
				var time31 = 31*24*60*60*1000;
				if(eTime-sTime>time31){
					$(".win>span").html("时间不能大于31天");
					winHint();
					return;
				}
				window.location.href = ctx+"/SettlementRatio/exportExcelSite?siteId="+siteId+"&startTime="+startTime+"&endTime="+endTime;
			}else{
				var year = $('#month1').val();
				if(year==''){
					$(".win>span").html("请输入查询时间");
					winHint();
					return;
				}
				window.location.href = ctx+"/SettlementRatio/exportExcelM?siteId="+siteId+"&year="+year;
			}
		}
	});
	
	$('#dayincome').click(function(){
		var state = 0;
		var startTime = $('#startAt2').val() ;
		var endTime = $('#endAt2').val() ;
		var siteid = $('.seleType').attr('siteid');
    	if((siteid==undefined||siteid=='')&&$('.seleType').text()!='查看全部'){
    		$(".win>span").html("请先选择场所");
			winHint();
    		return;
    	} 
		if($('.seleType').text()=='查看全部'){
			var agentName = $('#agentname').val();
			if(agentName==''){
				$(".win>span").html("请填入商户名");
				winHint();
	    		return;
			}
			 state = -2
		}else{
			var agentName = $('#agentname').val();
			if(agentName==''){
				$(".win>span").html("请填入商户名");
				winHint();
	    		return;
			}
			 state = siteid;
		}
		if(startTime==''||endTime==''){
			$(".win>span").html("请输入查询时间");
			winHint();
    		return;
		}else{
			if(state==-2){
				var agentName = $('#agentname').val();
				if(agentName==''){
					$(".win>span").html("请填入商户名");
					winHint();
		    		return;
				}
				if(isDayOrMonth==0){
					findAllByDayIncome(startTime,endTime,agentName);
				}else{
					var month = $('#month1').val();
					findByAllMonthIncome(month,agentName)
				}
			}else{
				if(isDayOrMonth==0){
					findByDayIncome(startTime,endTime,state);
				}else{
					var month = $('#month1').val();
					findByMonthIncome(month,state);
				}
			}
		}
	});
});

/**
 * 按天查询时间段的收入情况
 * @param startTime
 * @param endTime
 * @param state
 */
function findByDayIncome(startTime,endTime,state){

	var startTimes = startTime.replace(/-/g,"/");
	var endTimes = endTime.replace(/-/g,"/");
	var sTime = new Date(startTimes).getTime();
	var eTime = new Date(endTimes).getTime();
	var time31 = 31*24*60*60*1000;
	if(eTime-sTime>time31){
		$(".win>span").html("时间不能大于31天");
		winHint();
		return;
	}else{
		Highcharts.setOptions({
			colors: ['#ffd189','#7bd3d4','#ffa89c']
		});
            var hostory = {
	        chart: {
	        	renderTo : 'histogram',
	            type: 'column'
	        },
	        title: {
	            text: ' '
	        },
	        xAxis: {
	            categories: []
	        },
	        yAxis: {
	            min: 0,
	            title: {
	                text: ''
	            }
	        },
	        legend: {
	            align: 'right',
	            x: -30,
	            verticalAlign: 'top',
	            y: 25,
	            floating: true,
	            backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
	            borderColor: '#CCC',
	            borderWidth: 1,
	            shadow: false
	        },
	        tooltip: {
	            formatter: function () {
	                return '<b>' + this.x + '</b><br/>' +
	                    this.series.name + ': ' + this.y + '<br/>';
	            }
	        },
	        plotOptions: {
	            column: {
	                stacking: 'normal',
	                dataLabels: {
	                    enabled: true,
	                    color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
	                    style: {
	                        textShadow: '0 0 3px black'
	                    }
	                }
	            }
	        },
	        series: [{
	            name: '当日总收入',
	            data: []
	        }, {
	            name: '线上收入',
	            data: []
	        }, {
	            name: '线下收入',
	            data: []
	        }],
	         navigation: {
	            buttonOptions: {
	                enabled: false
	            }
	        }
	    }
		 $.ajax({
			 url:ctx+'/SettlementRatio/getOffLineTotal',
				data:{
					siteId:state,
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
						var d0 = [];
						var d1 = [];
						var d2 = [];
						var x = [];
						
						var ser0 = data.data[0];
						var ser1 = data.data[2];
						var ser2 = data.data[1];
						
						for (var i = 0; i < ser0.length; i++) {
							d0.push(ser0[i].totalMoney);
							x.push(ser0[i].date);
						}
						for (var j = 0; j < ser1.length; j++) {
							d1.push(ser1[j].totalMoney);
						}
						for (var z = 0; z < ser2.length; z++) {
							d2.push(ser2[z].totalMoney);
						}
						hostory.series[0].data=d0;
						hostory.series[1].data=d1;
						hostory.series[2].data=d2;
						hostory.xAxis.categories=x;
					} else {
						$(".win>span").html("暂无数据");
						winHint();
						return;
					}
					new Highcharts.Chart(hostory);
				},
				error:function(){}
		 });
	 }
}

/**
 * 按天查询时间段的收入情况
 * @param startTime
 * @param endTime
 * @param state
 */
function findByMonthIncome(month,state){
 
	if(month==''){
		$(".win>span").html("请输入查询时间");
		winHint();
		return;
	}else{
		Highcharts.setOptions({
			colors: ['#ffd189','#7bd3d4','#ffa89c']
		});
            var hostory = {
	        chart: {
	        	renderTo : 'histogram',
	            type: 'column'
	        },
	        title: {
	            text: ' '
	        },
	        xAxis: {
	            categories: []
	        },
	        yAxis: {
	            min: 0,
	            title: {
	                text: ''
	            }
	        },
	        legend: {
	            align: 'right',
	            x: -30,
	            verticalAlign: 'top',
	            y: 25,
	            floating: true,
	            backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
	            borderColor: '#CCC',
	            borderWidth: 1,
	            shadow: false
	        },
	        tooltip: {
	            formatter: function () {
	                return '<b>' + this.x + '</b><br/>' +
	                    this.series.name + ': ' + this.y + '<br/>';
	            }
	        },
	        plotOptions: {
	            column: {
	                stacking: 'normal',
	                dataLabels: {
	                    enabled: true,
	                    color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
	                    style: {
	                        textShadow: '0 0 3px black'
	                    }
	                }
	            }
	        },
	        series: [{
	            name: '当月总收入',
	            data: []
	        }, {
	            name: '线上收入',
	            data: []
	        }, {
	            name: '线下收入',
	            data: []
	        }],
	         navigation: {
	            buttonOptions: {
	                enabled: false
	            }
	        }
	    }
		 $.ajax({
			 url:ctx+'/SettlementRatio/getOffLineTotalMonth',
				data:{
					siteId:state,
					year:month
				},
				success : function(data) {
					if(data=="loseSession"){
						 window.location.href=ctx+"/toLogin";
						 return;
					}	
					eval("data = " + data);
					if (data.code == 200) {
						var d0 = [];
						var d1 = [];
						var d2 = [];
						var x = [];
						
						var ser0 = data.data[0];
						var ser1 = data.data[2];
						var ser2 = data.data[1];
						
						for (var i = 0; i < ser0.length; i++) {
							d0.push(ser0[i].totalMoney);
							x.push(ser0[i].date);
						}
						for (var j = 0; j < ser1.length; j++) {
							d1.push(ser1[j].totalMoney);
						}
						for (var z = 0; z < ser2.length; z++) {
							d2.push(ser2[z].totalMoney);
						}
						hostory.series[0].data=d0;
						hostory.series[1].data=d1;
						hostory.series[2].data=d2;
						hostory.xAxis.categories=x;
					} else {
						$(".win>span").html("暂无数据");
						winHint();
						return;
					}
					new Highcharts.Chart(hostory);
				},
				error:function(){}
		 });
	 }
}
/**
 * 按天查询时间段的收入情况
 * @param startTime
 * @param endTime
 * @param state
 */
function findAllByDayIncome(startTime,endTime,agentName){

	var startTimes = startTime.replace(/-/g,"/");
	var endTimes = endTime.replace(/-/g,"/");
	var sTime = new Date(startTimes).getTime();
	var eTime = new Date(endTimes).getTime();
	var time31 = 31*24*60*60*1000;
	if(eTime-sTime>time31){
		$(".win>span").html("时间不能大于31天");
		winHint();
		return;
	}else{
		Highcharts.setOptions({
			colors: ['#ffd189','#7bd3d4','#ffa89c']
		});
            var hostory = {
	        chart: {
	        	renderTo : 'histogram',
	            type: 'column'
	        },
	        title: {
	            text: ' '
	        },
	        xAxis: {
	            categories: []
	        },
	        yAxis: {
	            min: 0,
	            title: {
	                text: ''
	            }
	        },
	        legend: {
	            align: 'right',
	            x: -30,
	            verticalAlign: 'top',
	            y: 25,
	            floating: true,
	            backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
	            borderColor: '#CCC',
	            borderWidth: 1,
	            shadow: false
	        },
	        tooltip: {
	            formatter: function () {
	                return '<b>' + this.x + '</b><br/>' +
	                    this.series.name + ': ' + this.y + '<br/>';
	            }
	        },
	        plotOptions: {
	            column: {
	                stacking: 'normal',
	                dataLabels: {
	                    enabled: true,
	                    color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
	                    style: {
	                        textShadow: '0 0 3px black'
	                    }
	                }
	            }
	        },
	        series: [{
	            name: '当日总收入',
	            data: []
	        }, {
	            name: '线上收入',
	            data: []
	        }, {
	            name: '线下收入',
	            data: []
	        }],
	         navigation: {
	            buttonOptions: {
	                enabled: false
	            }
	        }
	    }
		 $.ajax({
			 url:ctx+'/SettlementRatio/getAllOffLineTotal',
				data:{
					agentName:agentName,
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
						var d0 = [];
						var d1 = [];
						var d2 = [];
						var x = [];
						
						var ser0 = data.data[0];
						var ser1 = data.data[2];
						var ser2 = data.data[1];
						
						for (var i = 0; i < ser0.length; i++) {
							d0.push(ser0[i].totalMoney);
							x.push(ser0[i].date);
						}
						for (var j = 0; j < ser1.length; j++) {
							d1.push(ser1[j].totalMoney);
						}
						for (var z = 0; z < ser2.length; z++) {
							d2.push(ser2[z].totalMoney);
						}
						hostory.series[0].data=d0;
						hostory.series[1].data=d1;
						hostory.series[2].data=d2;
						hostory.xAxis.categories=x;
					} else {
						$(".win>span").html("暂无数据");
						winHint();
						return;
					}
					new Highcharts.Chart(hostory);
				},
				error:function(){}
		 });
	 }
}
/**
 * 按月查询时间段的收入情况
 * @param startTime
 * @param endTime
 * @param state
 */
function findByAllMonthIncome(month,agentName){
 
	if(month==''){
		$(".win>span").html("请输入查询时间");
		winHint();
		return;
	}else{
		Highcharts.setOptions({
			colors: ['#ffd189','#7bd3d4','#ffa89c']
		});
            var hostory = {
	        chart: {
	        	renderTo : 'histogram',
	            type: 'column'
	        },
	        title: {
	            text: ' '
	        },
	        xAxis: {
	            categories: []
	        },
	        yAxis: {
	            min: 0,
	            title: {
	                text: ''
	            }
	        },
	        legend: {
	            align: 'right',
	            x: -30,
	            verticalAlign: 'top',
	            y: 25,
	            floating: true,
	            backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
	            borderColor: '#CCC',
	            borderWidth: 1,
	            shadow: false
	        },
	        tooltip: {
	            formatter: function () {
	                return '<b>' + this.x + '</b><br/>' +
	                    this.series.name + ': ' + this.y + '<br/>';
	            }
	        },
	        plotOptions: {
	            column: {
	                stacking: 'normal',
	                dataLabels: {
	                    enabled: true,
	                    color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
	                    style: {
	                        textShadow: '0 0 3px black'
	                    }
	                }
	            }
	        },
	        series: [{
	            name: '当月总收入',
	            data: []
	        }, {
	            name: '线上收入',
	            data: []
	        }, {
	            name: '线下收入',
	            data: []
	        }],
	         navigation: {
	            buttonOptions: {
	                enabled: false
	            }
	        }
	    }
		 $.ajax({
			 url:ctx+'/SettlementRatio/getAllOffLineTotalMonth',
				data:{
					agentName:agentName,
					year:month
				},
				success : function(data) {
					if(data=="loseSession"){
						 window.location.href=ctx+"/toLogin";
						 return;
					}	
					eval("data = " + data);
					if (data.code == 200) {
						var d0 = [];
						var d1 = [];
						var d2 = [];
						var x = [];
						
						var ser0 = data.data[0];
						var ser1 = data.data[2];
						var ser2 = data.data[1];
						
						for (var i = 0; i < ser0.length; i++) {
							d0.push(ser0[i].totalMoney);
							x.push(ser0[i].date);
						}
						for (var j = 0; j < ser1.length; j++) {
							d1.push(ser1[j].totalMoney);
						}
						for (var z = 0; z < ser2.length; z++) {
							d2.push(ser2[z].totalMoney);
						}
						hostory.series[0].data=d0;
						hostory.series[1].data=d1;
						hostory.series[2].data=d2;
						hostory.xAxis.categories=x;
					} else {
						$(".win>span").html("暂无数据");
						winHint();
						return;
					}
					new Highcharts.Chart(hostory);
				},
				error:function(){}
		 });
	 }
}

 function reset (){
	 
	 $('#histogram').highcharts({
	        chart: {
	            type: 'column'
	        },
	        title: {
	            text: ' '
	        },
	        xAxis: {
	            categories: []
	        },
	        yAxis: {
	            min: 0,
	            title: {
	                text: ''
	            }
	        },
	        legend: {
	            align: 'right',
	            x: -30,
	            verticalAlign: 'top',
	            y: 25,
	            floating: true,
	            backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
	            borderColor: '#CCC',
	            borderWidth: 1,
	            shadow: false
	        },
	        tooltip: {
	            formatter: function () {
	                return '<b>' + this.x + '</b><br/>' +
	                    this.series.name + ': ' + this.y + '<br/>';
	            }
	        },
	        plotOptions: {
	            column: {
	                stacking: 'normal',
	                dataLabels: {
	                    enabled: true,
	                    color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
	                    style: {
	                        textShadow: '0 0 3px black'
	                    }
	                }
	            }
	        },
	        series: [{
	            name: '当前总收入',
	            data: [0]
	        }, {
	            name: '线上收入',
	            data: [0]
	        }, {
	            name: '线下收入',
	            data: [0]
	        }],
	         navigation: {
	            buttonOptions: {
	                enabled: false
	            }
	        }
	    });
 }



function win(){
	$('.win').css('display','block').fadeOut(3000);
};
function winHint(){
	$('.win').css('display','block').fadeOut(2000);
};