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
		window.location.href = "../storeActivity/storeActivityList";
	});
	
	//标签选择
	$("#save_sign_img").on("click",function(){
//		if($("#input_modal_world").val()==""||$("#input_modal_world").val()==null){
//			$("#input_modal_msg").html("");
//			$("#input_modal_msg").attr("style","color:red");
//			$("#input_modal_msg").html("请填写标签内容！");
//		}else{
		if($("#input_modal_world").val()==""||$("#input_modal_world").val()==null){
			$("#img_hot_world").addClass("world_signs").html("无");
		}else{
			$("#img_hot_world").addClass("world_signs").html($("#input_modal_world").val());	
		}
			
		$("#img_hot_img").removeAttr("src");
		for(var i=1;i<=12;i++){
			if($(".hot"+i+1).html()!=""){
				$("#img_hot_img").attr("src",$("#hot"+i+1).attr("src"));
			}
		}
		$('#setSign').modal('hide');
//		}
		
	});
	
	//日期控件
	$('.startTime').datepicker().on('changeDate', function() {
		var startTime = $('.startTime').val();
		var endTime = $(".endTime").val();
		var alertMsg = $(".alert_msg");
		var flag = checkDateIsOk(startTime, endTime, alertMsg);
		if (flag) {
			$("#add_activity_submit").attr("disabled", false);
		} else {
			$("#add_activity_submit").attr("disabled", true);
		}

	});
	$('.endTime').datepicker().on('changeDate', function() {
		var startTime = $(".startTime").val();
		var endTime = $('.endTime').val();
		var alertMsg = $(".alert_msg");
		var flag = checkDateIsOk(startTime, endTime, alertMsg);
		if (flag) {
			$("#add_activity_submit").attr("disabled", false);
		} else {
			$("#add_activity_submit").attr("disabled", true);
		}
	});

	//多行
	$("#question_txt").on("keyup",function(){
		var leng=$("#question_txt").val();
		var maxleng=leng.length;
		if(maxleng>=199){
			$("#question_txt").val("");
			var world=leng.substring(0, 200);
			$("#question_txt").val(world);
			maxleng=200;
		} 
		$(".question_msg").html("");
		 $("#question_num").html(maxleng);
	});
	//提交内容
	$("#add_activity_submit").on("click",function(){
		//alert($("#add_activity_submit").attr("name"));
		if(checkform()){
			$.ajax({
				url : ctx+"/storeActivity/updateActivity", // 请求的url地址
				type : "post",
				data : {
					id:$("#add_activity_submit").attr("name"),
					start:$("#startTime").val(),
					end:$("#endTime").val(),
					decision:$("#question_txt").val(),
					imgUrl:$("#img_addactivity").attr("src"),
					name:$("#input_activity_name").val(),
					topical:$("#input_activity_topic").val(),
					sign:$("#img_hot_world").html(),
					signUrl:$("#img_hot_img").attr("src")
				},
				success : function(req) {
					if (req == "false") {
						changeToError(1);
						toastr.error('修改失败！');
					} else {
						changeToSuccess(1);
						toastr.success('修改成功！');
						$("#add_activity_submit").attr("display",false);
					}
					//imgAreaSelectApi.cancelSelection();
				},
				error : function()// 服务器响应失败处理函数
				{
					changeToError(1);
					toastr.error('修改失败！');
				}
			});
		}
		
	});
	///////////////////////////////////////////////////////
});


//验证
function checkform(){
	if($("#img_addactivity").attr("src")==(curpath+"/img/storeActivity/add2_03.png")){
		toastr.error('请上传活动图片！');
		return false;
	}else if($("#input_activity_topic").val()==""||$("#input_activity_topic").val()==null){
		error1("input_activity_topic",3);
		$("#input_activity_topic").focus();
		return false;
	}else if($("#input_activity_name").val()==""||$("#input_activity_name").val()==null){
		error1("input_activity_name",3);
		$("#input_activity_name").focus();
		return false;
	}else if($("#startTime").val()=="开始时间"||$("#question_txt").val()==null){
		$(".alert_msg").html("");
		$(".alert_msg").addClass("world_red");
		$(".alert_msg").html("请选择活动开始时间");
		return false;
	}else if($("#endTime").val()=="结束时间"||$("#question_txt").val()==null){
		$(".alert_msg").html("");
		$(".alert_msg").addClass("world_red");
		$(".alert_msg").html("请选择活动结束时间");
		return false;
	}else if($("#question_txt").val()==""||$("#question_txt").val()==null){
		error1("question_txt",3);
		$("#question_txt").focus();
		return false;
	}
	return true;
}
//<img  alt="" width="30px" height="30px" src="${curPath}/img/storeActivity/hot_choose.png">
//标签互斥
function check_sign(a){

	for(var i=1;i<=12;i++){

		$(".hot"+i+1).html("");
		$(".hot"+i+1).removeClass("hot1_img");
	}
	//alert(a.id);
	var a_img=$("<img/>").attr("width","30px").attr("height","30px").attr("src",curpath+"/img/storeActivity/ccs2.png");
	var a_sp=$("."+a.id+"1").append(a_img);
	$("."+a.id+"1").addClass("hot1_img");
	
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
//比较两个日期大小
function checkDateIsOk(startTime, endTime, alertMsg) {
	var flag = false;	
	var myDate = new Date();
	var dateStr=myDate.getFullYear()+"/"+(myDate.getMonth()+1)+"/"+myDate.getDate();
	startTime=startTime.replace(/-/g, "/");
	endTime=endTime.replace(/-/g, "/");
	var startTime = new Date(startTime).getTime();
	var endTime = new Date(endTime).getTime();
	var searchAlertDiv = alertMsg;
	if (startTime > endTime) {
		searchAlertDiv.addClass("world_red");
		searchAlertDiv.html("结束日期不能小于开始日期");
		return false;
	} else {
		searchAlertDiv.html("");
		return true;
	}
}

//文本框闪动
function normal(id,times)
{
        var obj=$("#"+id);
        obj.css("background-color","#FFF");
        if(times<0)
        {
                return;
        }
        times=times-1;
        setTimeout("error1('"+id+"',"+times+")",150);
}
function error1(id,times)
{
        var obj=$("#"+id);
        obj.css("background-color","#F6CECE");
        times=times-1;
        setTimeout("normal('"+id+"',"+times+")",150);
}

//


//