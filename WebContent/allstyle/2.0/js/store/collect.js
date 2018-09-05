/**
 * 数据统计js
 */

// 获取当天日期
var d = new Date();
var year = d.getFullYear();
var mon = d.getMonth() + 1;
if (mon < 10) {
	mon = "0" + mon;
}
var day = d.getDate();
if (day < 10) {
	day = "0" + day;
}
var myDate = year + "-" + mon + "-" + day;
var starteTime="2012-01-01";

$(function() {
	
	// 左侧菜单：网站管理
	var flag = 1;
	$("#webManage").click(function() {
		if (flag == 1) {
			$("#webFlag").removeClass("icon-chevron-right").addClass("icon-chevron-down");
			$("#webManage").css("margin-bottom", "0px");
			$("#webManage").find("a").css("border-radius", "5px 5px 0px 0px");
			flag = 2;
		} else {
			$("#webFlag").removeClass("icon-chevron-down").addClass("icon-chevron-right");
			$("#webManage").css("margin-bottom", "4px");
			$("#webManage").find("a").css("border-radius", "5px 5px 5px 5px");
			flag = 1;

		}
		$("#sAuth").toggle();
		$("#sDecorate").toggle();
		$("#sApply").toggle();
	});

	// 日历控件设置
	$('.form_datetime').datepicker({
		format : 'yyyy-mm-dd',
		 autoclose: true
	});
	
$("#dateselect").val( myDate);
$('#dateselect').datepicker().on('changeDate', function(ev) {
	getCollectTables(1);
});

	// 初始化，左侧菜单中“设备管理”选中状态
	$("#collect").addClass("active");

	// 取消按钮，返回设备管理页面
	$(".toCollectListBtn").click(function() {
		$(".collectOperate").fadeOut();
		$("#collectList").fadeIn();
	});

	
	getCollectTables(1);
	// -----------------数据统计----begin-----------------//
	// “查看详细”按钮，点击显示该模块
	

	// -----------------数据统计---end-----------------//

});

var pnum;
var mac;
function getCollectTables(num){
	var date=$("#dateselect").val();
	date=date.replace(/-/g,"");
	if(num==undefined)return;
	if(isNaN(num))return;
	//showLoading();
	$.ajax({
        type: "POST",
        url: "getDaliyLog",
        data: {
        	curPage:num,
        	pageSize:10,
        	riqi:date
        },
        success: function(data){
        	//changeToSuccess(1);
        	eval("data = " + data);
        	if(data.code==200){
        		pnum=num;
        		//调用分页
				pageHandle("pagers","storeCollectTable",data.data,num,getCollectTables,getCollectTableHTML);
        	}else {
        		//changeToError(1);
        		toastr.error(data.msg);
        	}
        },
        error : function() {
        	//changeToError(1);
        	toastr.error('提交失败！');
		}
    });
}

function getCollectTableHTML(data,tableId){
	var table="";
	data=data.data;
	for(var i=0;i<data.length;i++){
		table += "<tr>" + "<td>"+(i+1)+"</td>" + "<td>"+data[i].mac+"</td>"
				+ "<td>"+data[i].userName+"</td>" + "<td>"+data[i].authMethod+"</td>" + "<td>"+data[i].sex+"</td>"
				+ "<td>"+data[i].deviceType+"</td>" + "<td>"+data[i].lanIp+"</td>"
				+ "<td>"+data[i].loginDate+"</td>" + "<td>"
				+ "<button class='btn toCollectDetailBtn' id='"+data[i].mac+"' >查看详细</button>"
				+ "</td>" + "</tr>";
	}
	$("#"+tableId).html(table);
	$(".toCollectDetailBtn").click(function(){
		mac=this.id;
		getDetaildata(1);
	});
	
}



function getDetaildata(num){
	var date=$("#dateselect").val();
	date=date.replace(/-/g,"");
	if(num==undefined)return;
	if(isNaN(num))return;
	//showLoading();
	$.ajax({
        type: "POST",
        url: "getDetailTable",
        data: {
        	curPage:num,
        	pageSize:10,
        	riqi:date,
        	mac:mac
        },
        success: function(data){
        	$("#collectList").fadeOut();
    		$("#collectDetail").fadeIn();
        	//changeToSuccess(1);
        	eval("data = " + data);
        	if(data.code==200){
        		pnum=num;
        		//调用分页
				pageHandle("Detailpager","ProtalLonginDetail",data.data,num,getDetaildata,getDetailTable);
        	}else {
        		//changeToError(1);
        		toastr.error(data.msg);
        	}
        },
        error : function() {
        	//changeToError(1);
        	toastr.error('提交失败！');
		}
    });
}

function getDetailTable(data,tableId){
	var table="";
	data=data.data;
	for(var i=0;i<data.length;i++){
		table += "<tr>"+
					"<td>"+(i+1)+"</td>"+
					"<td>"+data[i].mac+"</td>"+
					"<td>"+data[i].lanIp+"</td>"+
					"<td>"+data[i].loginDate+"</td>"+
					"<td>"+data[i].deviceType+"</td>"+
				"</tr>";
	}
	$("#"+tableId).html(table);
//	$(".toCollectDetailBtn").click(function() {
//		alert(this.id);
//		$("#collectList").fadeOut();
//		$("#collectDetail").fadeIn();
//		getCollectTables(pnum);
//	});

}






