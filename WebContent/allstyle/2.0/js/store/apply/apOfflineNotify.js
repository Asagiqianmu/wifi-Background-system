/**
*	对“离线通”应用界面所有的js操作
*/
var apOfflineNotifyId= "";//用来接收主表id

$(function() {
	//初始化页面相关元素的事件

	initData();
	// 返回店铺应用click事件
	$(".toApplyMainBtn").click(function() {
		window.location.href = "../appManage/gotoAppStore";
	});
	//取消添加通知人事件
	$(".cancel").click(function(){
		
		$('#myModal').modal('hide');
	});
	
	//确定添加通知人事件
	$(".doAddUser").click(function(){
		$("#notifyUserForm").submit();
	});
	
	
	//取消新增短信条数
	$(".cancelAddMsg").click(function(){
		
		$('#addMsgNumModel').modal('hide');
	});
	
	$(".doAddMsg").click(function(){
		$("#productId").val(19);//id为19的产品为《离线通》
		$("#notifyUrl").val("http://localhost:8080/sun/notify/addMsgNum");
		$("#addMsgNumModel").modal('hide');
		$("#addMsgNumForm").submit();
		$("#payMsg").modal('show');
	});
	//确定新增短信条数
	
	//初始化滑动插件及相关事件处理方法
	// 选择客户人数拖拉效果
	var $slider = $('.clientSum');
	var clientTotal = $("#clientTotal").text();
	var maxVal = 0;
	if (clientTotal != "" && typeof (clientTotal) != "undefined") {
		maxVal = parseInt(clientTotal);
	}
	if ($slider.length > 0) {
		$slider.slider({
			animate : true,
			min : 10,
			max : maxVal,
			value : 10,
			orientation : 'horizontal',
			range : 'min',
			number : '10'
		});
	}

	// 改变客户人数事件
	$slider.bind('slide', function(event, ui) {
		var _this = ui.value;
		var total = parseInt(_this) * 0.1;
		total = total.toFixed(2);
		$("#CurClientTotal").text(_this);
		$("#buyNum").val(_this);
		$("#CurMoneyTotal").text(total);
	});
	
	$(".payOkBtn").click(function() {
		window.location.href = window.location.href.replace(/#/g,''); 
	});

	$(".payErrorBtn").click(function() {
		window.location.href = ctx + "/comm/faq";
	});
	
	
	
});
/**
 * 初始化页面数据
 */
function initData(){
	showLoading2("加载中...");
	$.ajax({
		type : "POST",
		url : "../notify/findApOfflineNotify",
		success : function(data) {			
			eval("data = " + data);
			//将apOfflineNotifyId赋值给全局变量apOfflineNotifyId,当新增时用来关联主表
			apOfflineNotifyId = data.id;
			//初始化“使用状况”模块
			$("#msg_num").text(data.msgNum);
			$("#send_msg_num").text(data.sendMsgNum);
			
			//初始化“ap故障通知人”模块
			var notifyUsers = data.notifyUsers;
			if(notifyUsers.length > 0 ){
				var mod = notifyUsers.length % 3;
				var rowCount = parseInt(notifyUsers.length/3) ;
				if(mod != 0){//判断是否有余数，如果有余数则代表在整数行之上再增加一行
					rowCount = rowCount + 1;
				}
				for(var n = 0; n <rowCount;n++){
					var ulObj = createUlTemplate();
					$("#notifyUsers").append(ulObj);//jqueryObj.appandTo();
					var br=$("<br/>");
					$("#notifyUsers").append(br);
					for(var i = (n*3); i < (n*3+3); i++){
						if(notifyUsers[i]){
							var userObj = createUserTemplate(notifyUsers[i]);
							ulObj.append(userObj);
						}else{
							break;
						}
					}
				}
	
				//通知人总数除3取余数，如果余数为零则再追加一个ul标签，否则直接在最后ui中追加一个li将"新增"按钮增加在其中
				if(mod == 0){
					var ulObj = createUlTemplate();
					$("#notifyUsers").append(ulObj);
					ulObj.append(createAddUserTemplate());
				}else{//如果有余数则直接在最后一个ul元素之后直接追加增加按钮
					var lastUl = $("ul").last();
					lastUl.append(createAddUserTemplate());
				}
			}else{
				//没有任何通知人则直接显示"新增联系人按钮"
				var ulObj = createUlTemplate();
				$("#notifyUsers").append(ulObj);
				ulObj.append(createAddUserTemplate());
			}
			
			//初始化相关事件
			initEvent();
			changeToSuccess(1);
				

		},
		error : function() {
			changeToError(1);
		}
	});
	
}
/**
 * 创建ui末班
 * @returns
 */
function createUlTemplate(){
	var template = '<ul style="list-style:none;text-decoration:underline;margin-bottom: 80px;"></ul>';
	
	return $(template);
	
	
	
}

function createAddUserTemplate(){
	var template = "";
	template = template + '<li  id="addUserLi" style=" text-align:center;color:#ffffff;line-height:50px;width:170px;height:48px;background-color:#999999;float:left;margin-right: 50px;">';
	template = template + '<a href="javascript:void(0)" onclick="addUser()"   style="color:#ffffff;;cursor:pointer"><i class="icon-plus icon-white"  style="font-size:20px;"></i> ';
	template = template + '<font style="font-size:13px;font-weight:bold;font-family: \'微软雅黑\'">新增通知人</font></a>';
	template = template + '</li>';
	var t = $(template);
	template = null;//释放内存
	return $(t);
}
/**
 * 创建li通知人模板
 * @param userInfo
 * @returns
 */
function createUserTemplate(userInfo){
	
	var template ='<li style=" background-color:#3a87ad;float:left;margin-right: 70px;width:170px;height:48px;">';
	template = template + '<span><img src="'+curPath+'/img/logo.jpg"/>';
	
	template = template + '<span style="float:right;margin-right:20px;margin-top:7px;">';
	template = template + '<span style="float:right;">';
	
	template = template + '<font style="color:#FFFFFF;font-weight:bold;font-family: \'微软雅黑\' " >' +userInfo.name+'</font>';
	
	template = template + '</span>';
	template = template + '<br>';
	template = template +'	<font style="color:#FFFFFF;">' +userInfo.tel +'</font>';
	template = template + '	</span>';
	
	
	template = template + '<span style="float:right;">';
	template = template + '<a href="javascript:void(0)" onclick="deleteUser(' +userInfo.id+ ')"  class="btn btn-warning"  style="display:none;"> <i class=" icon-minus-sign"></i> 删除</a>';
	template = template + '	</span>';
	
	
	template = template + '	</span>';
	template = template + '	</li>';
	var t = $(template);
	template = null;//释放内存
	return $(t);
}
/**
 * 初始化页面元素事件
 */
function initEvent(){
	$(".widget-content").find("li").each(function() {
		if( this.id !="addUserLi" ){
			$(this).mouseenter(function() {//鼠标移入事件
				
				$(this).css("background-color", "#FF6666");
				$(this).find("a").show();
				$(this).css("border", "1px solid red");
			}).mouseleave(function() {//鼠标移除事件
				
				$(this).find("a").hide();
				$(this).css("background-color", "#3a87ad");
				$(this).css("border", "none");
			});
		}else{
			$(this).mouseenter(function() {//鼠标移入事件
				
				$(this).css("background-color", "#51a351");
			}).mouseleave(function() {//鼠标移除事件
				
				$(this).css("background-color", "#999999");
			});

		//	$(this).css("border", "1px solid red");
		}
		
	});
}

/**
 * 新增用户
 */
function addUser(){

	$('#myModal').modal('show');
	$("#notifyUserForm")[0].reset();
	notifyUserForm.resetForm(); 
}

/**
 * 删除用户
 */
function deleteUser(userId){

	$.ajax({
		type : "POST",
		url : "../notify/deleteUser",
		data : {
			notifyUserId : userId
			
		},
		success : function(data) {			
			if(data == "success"){
				toastr.success('ok, 删除成功');
				//保存成功后移除通知人div中的所有元素重新调用初始化initData()方法，以便及时显示更新后的数据
				$("#notifyUsers").children().remove();
				initData();
			}else{
				toastr.error("删除失败，请重新再试!");
			}
		},
		error : function() {
			toastr.error("系统异常，请稍后再试!");
		}
	});
}

/**
 * 手机号校验
 */
jQuery.validator.addMethod("mobile", function(value,
		element) {
	var length = value.length;
	var mobile = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
	return this.optional(element)
			|| (length == 11 && mobile.test(value));
}, "请正确填写您的手机号码");
var notifyUserForm = $("#notifyUserForm").validate({ 
	errorPlacement : function(error, element) {
		$('<br/>').appendTo(element.parent()); // 有这句就在下方提示错误信息
		error.css({
			display : "inline",
			color : "#ee7676",
			position : "relative",
		}).appendTo(element.parent().addClass("error"));

	},
	submitHandler : function() {
		//组织form提交需要的数据
		var name = $("#name").val();
		var tel = $("#tel").val();
		var today = new Date();
		var month = today.getMonth() + 1;
		var nowDate = today.getFullYear() +"-"+month  + "-" +today.getDate() + "  " + today.getHours() + ":" + today.getMinutes()+  ":" + today.getSeconds();
		$.ajax({
			type : "POST",
			datatype:"json",
		    contentType:'application/json;charset=UTF-8',
			url : "../notify/addUser",
			data : $.toJSON({
				name : name,
				tel:tel,
				createTime : nowDate,
				apOfflineNotify:{id:apOfflineNotifyId}
				
			}),
			success : function(data) {	
				if(data=="success"){
					toastr.success('ok, 接收人添加成功');
					$('#myModal').modal('hide');
					//刷新界面数据
					$("#notifyUsers").children().remove();
					initData();
					
				}else{
					toastr.error('接收人添加失败，请重新尝试!');
				}
			},
			error : function() {
				toastr.error("系统异常，请稍后再试!");
			}
		});
	},
	rules : {
		name : {
			required : true,
			maxlength : 32
		},
		tel : {
			required : true,
			mobile:true
		}
	},
	messages : {
		name : {
			required : "请输入接受通知人的姓名",
			maxlength : "这个名字太难记了吧，您还是换个名字吧"
		},
		tel : {
			required : "请输入接收通知的手机号",
			mobile : "只能使用手机号接收通知"
		}
	}

});
/**
 * 增加可发送短信数量
 */
function addMsgNum(){
	$("#addMsgNumModel").modal('show');
	
}