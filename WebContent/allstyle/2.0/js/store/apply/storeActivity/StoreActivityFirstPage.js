$(function(){
	// --------------------左侧菜单---------------------------//
	$("#webManage").addClass("active");
	var flag = 1;
	$("#webManage").css("margin-bottom", "0px");
	$("#webManage").find("a").css("border-radius", "5px 5px 0px 0px");
	$("#webManage").click(function() {
		if (flag == 1) {
			$("#webManage").css("margin-bottom", "4px");
			$("#webManage").find("a").css("border-radius", "5px 5px 5px 5px");
			flag = 2;
		} else {
			$("#webManage").css("margin-bottom", "0px");
			$("#webManage").find("a").css("border-radius", "5px 5px 0px 0px");
			flag = 1;
		}
		$("#sAuth").toggle();
		$("#sDecorate").toggle();
		$("#sApply").toggle();
	});
	// --------------------左侧菜单---------------------------//

	

	////加载过期活动列表
	getOutTimeActivity(1);
	//加载TOP5列表
	getTop5Activity("浏览量");
	//返回
	$(".toCreateStoreBtn").click(function() {
		window.location.href = "../appManage/gotoAppStore";
	});
	//新增
	$(".goaddactivity").click(function() {
		window.location.href = ctx+"/storeActivity/addStoreActivity";
	});
	//所有
	$(".goactivitylist").click(function() {
		window.location.href = ctx+"/storeActivity/storeActivityList";
	});
	//下拉
	$(".dropdown_zan").on("click",function(){
		var x_val=$("#dropdown_read").html();
		$("#dropdown_read").html("");
		$("#dropdown_read").html($(".dropdown_zan").html());
		$(".dropdown_zan").html("");
		$(".dropdown_zan").html(x_val);
		getTop5Activity($("#dropdown_read").html());
	});
	$(".dropdown_share").on("click",function(){
		var x_val=$("#dropdown_read").html();
		$("#dropdown_read").html("");
		$("#dropdown_read").html($(".dropdown_share").html());
		$(".dropdown_share").html("");
		$(".dropdown_share").html(x_val);
		getTop5Activity($("#dropdown_read").html());
	});
	//加载结尾。。。。。
	
});
//点击删除时执行方法
function deleteModel(a){
	var id=$(a).attr("num");

	$('#myModal_delete').modal('show');
	$('#val_del').val(id);
}
function yesDelete(){
	var id=$('#val_del').val();
	$.ajax({
		type : "POST",
		url : ctx+"/storeActivity/delActivity",
		data : {
			id:id
		},
		success : function(msg) {
			if(msg=="true"){
				toastr.success("删除成功");
				getOutTimeActivity(1);
			}else{
				toastr.error("删除失败！");
			}
			
		},
		error : function() {
			toastr.error("与服务器通讯故障，删除失败！");
		}
	});
}
//点击延期执行
function lastTimeModel(a){
	var id=$(a).attr("num");
	$('#myModal_date').modal('show');
	$('#val_del').val(id);
}
function lastTime(){
	if($("#selTime").val()=="请选择"){
		$("#dateMsg").html("请选择活动结束日期！");
	}else{	
		if(checkDate()){
			$('#myModal_date').modal('hide');
			var id=$('#val_del').val();
			var endDate = $("#selTime").val();
			$.ajax({
				type : "POST",
				url : ctx+"/storeActivity/lastActivityEndTime",
				data : {
					id:id,
					endDate:endDate
				},
				success : function(msg) {
					if(msg=="true"){
						$("#selTime").val("请选择");
						$("#dateMsg").html("");
						toastr.success("延时成功");
						getOutTimeActivity(1);
					}else{
						toastr.error("操作失败！");
					}
					
				},
				error : function() {
					toastr.error("与服务器通讯故障，操作失败！");
				}
			});
		}else{
			$("#dateMsg").html("结束日期须大于当前日期及已设定日期！");
			return;
		}
	}
}
function checkDate(){
	var myDate =parseInt( new Date().getTime());
	var endDate = $("#selTime").val();
	var endDate1 =parseInt( new Date(endDate).getTime());
	var endDate2= $(".activity_td3").attr("name");
	var endDate3=parseInt(new Date(endDate2).getTime());
	if (myDate < endDate1&&endDate1>endDate3) {
		return true;
	} else {
		return false;
	}
	
	}
//格式化日期
function getdate(date){
	 var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
        var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var seconds = date.getSeconds();
        var milliseconds = date.getMilliseconds();
        return date.getFullYear() + "年" + month + "月" + day + "日";
}
//日期格式
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

/**
 * 获取过期活动列表
 * @param num 默认页数
 */
function getOutTimeActivity(num) {

	showLoading();

	if (num == undefined)
		return;
	if (isNaN(num))
		return;

	$.ajax({
		type : "POST",
		url : ctx+"/storeActivity/getOutTimeActivity",
		data : {
			curPage : num,
			pageSize : 5,
		},
		success : function(data) {
			eval("data = " + data);
			if (data.code == 200) {

				$('body,html').animate({
					scrollTop : 0
				}, 1000);

				// 调用分页
				pageHandle("pager", "activity_outtime", data.data, num, getOutTimeActivity,
						buildTable);

				changeToSuccess(1);

			} else {
				changeToError(1);
			}
		},
		error : function() {
			changeToError(1);
		}
	});
	
//-----------------------getorderlist结尾-------------
/**
 * 生成过期活动列表
 * @param data 数据集合
 * @param tableID 
 */
function buildTable(data, tableId) {
		var tbody = $("#" + tableId);
		tbody.empty();
		data = data.data;
		for (var i = 0; i < data.length; i++) {
			var datestart=getdate(new Date(data[i].start.time));
			var dateend=getdate(new Date(data[i].end.time));
			var tr = $("<tr/>").addClass("activity_tr").appendTo(tbody);
			var td1=$("<td/>").addClass("activity_td1").text(data[i].name).appendTo(tr);
			var td2=$("<td/>").addClass("activity_td2").text(datestart).appendTo(tr);
			var td3=$("<td/>").addClass("activity_td3").text(dateend).attr("name",new Date(data[i].end.time)).appendTo(tr);
			var td4=$("<td/>").addClass("activity_td4").appendTo(tr);
			var span1=$("<span/>").appendTo(td4);
			var a1=$("<a/>").attr("href","javascript:;").attr("num", data[i].id).attr("style","color:red;").attr("onclick","deleteModel(this)").text("删除").appendTo(span1);
			var span3=$("<span/>").appendTo(td4);
			var a3=$("<a/>").attr("href","javascript:;").attr("num", data[i].id).attr("style","color:#f99d26;").attr("onclick","lastTimeModel(this)").text("延期").appendTo(span3);
		}
		//依据此结构
//		<tr class="activity_tr">
//		<td class="activity_td1 ">活动名称活动名称活动名名名名名</td>
//		<td class="activity_td2 ">2014-12-12</td>
//		<td class="activity_td3">2014-12-12</td>
//		<td class="activity_td4 ">
		//<span><a href="javascript:;" style="color: red;">删除</a></span>
//		<span><a href="javascript:;" style="color: green;">保留</a></span>
//		<span><a href="javascript:;" style="color: #f99d26;">延期</a></span>
//		</td>
//	</tr>
	}
}
/**
 * TOP列表
 * @param num
 */
function getTop5Activity(orderby) {
	var orderby=orderby;
	if(orderby=="浏览量"){
		orderby="readCount";
	}else if(orderby=="分享量"){
		orderby="shareCount";
	}else if(orderby=="点赞量"){
		orderby="likeCount";
	}

	$.ajax({
		type : "POST",
		url : ctx+"/storeActivity/getTop5Activity",
		data : {
				orderby:orderby
		},
		success : function(data) {
			eval("data = " + data);
			if (data.code == 200) {

				//组建列表
				buildTop5Table(data,"activity_top_table");

			} else {
				changeToError(1);
			}
		},
		error : function() {
			changeToError(1);
		}
	});
	
//-----------------------getTop5Activity结尾-------------
/**
 * 生成top5列表
 * @param data 数据集合
 * @param tableID 
 */
function buildTop5Table(data, tableId) {
		var tbody = $("#" + tableId);
		tbody.empty();
		data = data.data;
		if(data.length<1){
			var tr=$("<tr/>").appendTo(tbody);
			var td=$("<td/>").text("暂无").appendTo(tr);
		}else{
			for (var i = 0; i < data.length; i++) {
				
				var tr = $("<tr/>").attr("id", data[i].id).attr("onclick","get3Count(this)").appendTo(tbody);
				var td1=$("<td/>").appendTo(tr);
				var div1=$("<div/>").addClass("circle").html(i+1).appendTo(td1);
				var td2=$("<td/>").text(data[i].name).appendTo(tr);
				var td3=$("<td/>").text(data[i].day).appendTo(tr);
				var td4=$("<td/>").text(data[i].counts).appendTo(tr);
			}
		}
		//参照格式
//		<tr class="">
	//		<td><div class="circle">1</div></td>
	//		<td class=" ">活动名称活动名称活动名名名名名</td>
	//		<td class=" ">999999999</td>
	//		<td class="">999999999</td>
//		</tr>
	}
}


//获取指定ID三量
function get3Count(a){
	var id=a.id;
	$.ajax({
		type : "POST",
		url : ctx+"/storeActivity/getTop3Count",
		data : {
				id:id
		},
		success : function(data) {
			eval("data = " + data);
			if (data.code == 200) {
				//组建
				 data=data.data;
				$("#activity_hotshow_world1_1").html("");
				$("#activity_hotshow_world1_1").html(data.storeActivityReadCount.readCount);
				$("#activity_hotshow_world2_1").html("");
				$("#activity_hotshow_world2_1").html(data.storeActivityLikeCount.likeCount);
				$("#activity_hotshow_world3_1").html("");
				$("#activity_hotshow_world3_1").html(data.storeActivityShareCount.shareCount);

			} else {
				changeToError(1);
			}
		},
		error : function() {
			changeToError(1);
		}
	});
}