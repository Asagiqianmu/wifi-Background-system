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

	
 //返回
 $(".toCreateStoreBtn").click(function() {
 window.location.href = ctx+"/storeActivity/storeActivityFirstPage";
 });
	// 日期格式
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
	// 新增
	$(".toCreateStoreBtn").click(function() {
		window.location.href = ctx+"/storeActivity/storeActivityFirstPage";
	});
	/**
	 * 搜索日期校验
	 */
	$('.startTime').datepicker().on('changeDate', function() {
		var startTime = $('.startTime').val();
		var endTime = $(".endTime").val();
		var searchBtn =$(".selectBtns");
		var alertMsg = $(".alert");
		var flag = checkDateIsOk(startTime, endTime, alertMsg);
		if (flag) {
			searchBtn.attr("disabled", false);
		} else {
			searchBtn.attr("disabled", true);
		}

	});
	$('.endTime').datepicker().on('changeDate', function() {
		var startTime = $(".startTime").val();
		var endTime = $('.endTime').val();
		var searchBtn =$(".selectBtns");
		var alertMsg = $("#searchAlertDiv");
		var flag = checkDateIsOk(startTime, endTime, alertMsg);
		if (flag) {
			searchBtn.attr("disabled", false);
		} else {
			searchBtn.attr("disabled", true);
		}
	});
	//排序1
	$("#td_read").on("click",function(){$("#td_sort").val("read");getAllactivityList(1);});
	//排序2
	$("#td_share").on("click",function(){$("#td_sort").val("share");getAllactivityList(1);});
	//排序3
	$("#td_like").on("click",function(){$("#td_sort").val("like");getAllactivityList(1);});
	//搜索
	$("#selectBtns").on("click",function(){$("#td_sort").val("all");getAllactivityList(1);});
	//初始化
	getAllactivityList(1);
});
/*******************加载执行↑***************************/
// 高亮灰色


// 比较两个日期大小
function checkDateIsOk(startTime, endTime, alertMsg) {

	var myDate = new Date();
	var dateStr=myDate.getFullYear()+"/"+(myDate.getMonth()+1)+"/"+myDate.getDate();
	startTime=startTime.replace(/-/g, "/");
	endTime=endTime.replace(/-/g, "/");
	var startTime = new Date(startTime).getTime();
	var endTime = new Date(endTime).getTime();
	var searchAlertDiv = alertMsg;
	var searchAlertSpan = alertMsg.find("strong");
	var serchAlertContent = alertMsg.find("span");
	if (startTime > endTime) {
		searchAlertDiv.addClass("alert-error");
		searchAlertSpan.text("错误!");
		serchAlertContent.text("请重新选择查询日期,结束日期不能小于开始日期")
		return false;
	} else {
		searchAlertDiv.removeClass("alert-error");
		searchAlertSpan.text("注意!");
		serchAlertContent.text("查询开始时间不能大于查询结束时间")
		return true;
	}
}
// 加载
/**
 * 获取活动列表
 * 
 * @param num
 *            默认页数
 */
function getAllactivityList(num) {

	showLoading();

	if (num == undefined)
		return;
	if (isNaN(num))
		return;
	var starttime=$(".startTime").val();
	var endtime=$(".endTime").val();
	var sort=$("#td_sort").val();
//	alert($(".startTime").val());
//	alert($(".endTime").val());
	$.ajax({
		type : "POST",
		url : ctx+"/storeActivity/getAllactivityList",
		data : {
			curPage : num,
			pageSize : 10,
			sort:sort,
			startTime:starttime,
			endTime:endtime
		},
		success : function(data) {
			eval("data = " + data);
			if (data.code == 200) {
				//返回顶部
				
				$('body,html').animate({
					scrollTop : 0
				}, 1000);

				// 调用分页
				pageHandle("pager", "activity_all", data.data, num, getAllactivityList,buildtable);

				changeToSuccess(1);

			} else {
				changeToError(1);
			}
		},
		error : function() {
			changeToError(1);
		}
	});
}
//组建表格
function buildtable(data,tableId){
	var tbody = $("#" + tableId);
	
	tbody.empty();
	data = data.data;
	for (var i = 0; i < data.length; i++) {
		var tr = $("<tr/>").attr("id", data[i].id).attr("class","activity_tr").appendTo(tbody);
		var activityname=$("<td/>").text(data[i].name).appendTo(tr);
		var activitysign=$("<td/>").text(data[i].sign).appendTo(tr);
		var activitystate=$("<td/>").text(data[i].state).appendTo(tr);
		var activityreadCount=$("<td/>").text(data[i].readCount).appendTo(tr);
		var activityshareCount=$("<td/>").text(data[i].shareCount).appendTo(tr);
		var activitylikeCount=$("<td/>").text(data[i].likeCount).appendTo(tr);
		var td1=$("<td/>").attr("style","width:85px;").appendTo(tr);
		var div=$("<div/>").addClass("btn-group").attr("style","width:85px;").appendTo(td1);
		var a=$("<a/>").addClass("btn").addClass("dropdown-toggle").attr("data-toggle","dropdown").text("更多操作").attr("href","#").appendTo(div);/////////////
		var span=$("<span/>").addClass("caret").appendTo(a);
		var ul=$("<ul/>").addClass("dropdown-menu").appendTo(div);
//		var li1=$("<li/>").appendTo(ul);
//		var a1=$("<a/>").attr("id","read_All").attr("href","javascript:;").attr("onclick","goReadDetial(this)").text("查看详情").appendTo(li1);
		var li2=$("<li/>").appendTo(ul);
		if(data[i].state=="正常"){
			var a2=$("<a/>").attr("id","activity_stop").attr("name","stop").attr("href","javascript:;").attr("onclick","stopActivity(this)").text("暂停").appendTo(li2);	
		}else if(data[i].state=="暂停"){
			var a2=$("<a/>").attr("id","activity_stop").attr("name","begin").attr("href","javascript:;").attr("onclick","stopActivity(this)").text("启用").appendTo(li2);
		}
		var li3=$("<li/>").appendTo(ul);
		var a3=$("<a/>").attr("id","activity_update").attr("href","javascript:;").text("编辑").attr("onclick","goUpdateDetial(this)").appendTo(li3);
		var li4=$("<li/>").appendTo(ul);
		var a4=$("<a/>").attr("id","activity_del").attr("onclick","DelActivity(this)").attr("href","javascript:;").text("删除").appendTo(li4);
	}
	
}
// <tr class="activity_tr">
// <td >活动名称</td>
// <td >标签</td>
// <td >状态</td>
// <td >浏览量</td>
// <td >分享量</td>
// <td >点赞量</td>
// <td style="width:85px;">
// <div class="btn-group" style="width:85px;">
// <a class="btn dropdown-toggle" data-toggle="dropdown" href="#">更多操作 <span class="caret"></span></a>
// <ul class="dropdown-menu">
// <li><a id="read_ALL" href="javascript:;">查看详情</a></li>
// <li><a id="activity_stop" href="javascript:;">暂停</a></li>
// <li><a id="activity_update" href="javascript:;">编辑</a></li>
// <li><a id="activity_del" href="javascript:;">删除</a></li>
// </ul>
// </div>
// </td>
// </tr>
//删除
function DelActivity(a){
	var tr=$(a).closest("tr").attr("id");
	$("#delete_id").val(tr);
	$("#deleteask").modal('show');
	
//	alert(tr);
//	var x=$(a).parent().parent().parent().parent().parent().attr("id");
//	alert(x);
}
//删除
function del_activity(){
	$("#deleteask").modal('hide');
	var id=$("#delete_id").val();
	$.ajax({
		type : "POST",
		url : ctx+"/storeActivity/delActivity",
		data : {
			id:id
		},
		success : function(msg) {
			if(msg=="true"){
				toastr.success("删除成功");
				getAllactivityList(1);	
			}else{
				toastr.error("删除失败！");
			}
			
		},
		error : function() {
			toastr.error("与服务器通讯故障，删除失败！");
		}
	});
}

//查看详情
function goReadDetial(a){
	var tr=$(a).closest("tr").attr("id");
	window.location.href=ctx+"/storeActivity/getADetial?sign='rd'&&aId="+tr;
}
//编辑
function goUpdateDetial(a){
	var tr=$(a).closest("tr").attr("id");
	window.location.href=ctx+"/storeActivity/getADetial?sign='up'&&aId="+tr;
}

//暂停活动
function stopActivity(a){
	var id=$(a).closest("tr").attr("id");
	var sign=a.name;
	$.ajax({
		type : "POST",
		url : ctx+"/storeActivity/stopActivity",
		data : {
			id:id,
			sign:sign
		},
		success : function(msg) {
			if(msg=="true"){
				toastr.success("操作成功");
				getAllactivityList(1);	
			}else{
				toastr.error("操作失败！");
			}
			
		},
		error : function() {
			toastr.error("与服务器通讯故障，操作失败！");
		}
	});
}












