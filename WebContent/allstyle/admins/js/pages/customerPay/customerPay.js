$(function() {
	//缴费按钮
	$('#sub').on('click', function() { // 绑定缴费操作按钮的缴费操作
		//获得缴费类型
		getPayType();
		submitUpdate();
	});
	//查询按钮
	
	 document.onkeydown=function(event){
         var e = event || window.event || arguments.callee.caller.arguments[0];
                   
          if(e && e.keyCode==13){ // enter 键
              //要做的事情
        	  getCustomerList(1);
     		 setTimeout(function(){
     			 location.reload();	
     		 }, 150);
         }
     }; 
	
	$("#refresh").click(function(){
		getCustomerList(1);
		 setTimeout(function(){
			 location.reload();	
		 }, 150);
	});
   getCustomerLists(1);//为了刷新显示
	
	$('.pay_no').css('height',$(window).height()+'px');
	setPriceType();
	//缴费类型的选择
	$("#rq option").click(function(){
		s=$("#rq option").index(this);
		$('#rq option').removeClass('on').eq(s).addClass('on');
		var cc=$(".on").html();
		$("#CustomerPayConfig").val($(".on").attr("value"));
		$(".yu").val(cc);
		sumMoney();
	});
	//数量的输入框失去焦点
	$("#pay_no").keyup(function() {
		sumMoney();
	});
});

function submitUpdate(){  //进行缴费
	$("#customerPay").submit();
}

//查询按钮
function getCustomerList(num) {
	
	var userName=$("#userName").val().trim();
	var siteId=$("#siteId").val();
	if(userName==""||siteId==""){
		return;
	}
	var addressRule = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
	if(userName!=""&&!(addressRule.test(userName)&&userName.length==11)){
		$("#userName").val(userName);
		return ;
	}
	showLoading();
	if (num == undefined){
		return;
	}
	if (isNaN(num)){
		return;
	}
	$.ajax({
		type : "POST",
		url : "getUserInfo",
		data : {
			curPage : num,
			username : userName,
			siteId : siteId,
			pageSize : 10,
		},
		success : function(data) {
			eval("data = " + data);
			if (data.code == 200) {
				// 去缴费
				pageHandleCustomerPay("pager", "ComPayTbody", data.data, num, getCustomerList, buildTable);
				changeToSuccess(0);
				//获得缴费类型
				getPayType();
			} else if(data.code == 202) {
				// 去注册
				pageHandleCustomerPay("pager", "ComPayTbody", data.data, num, getCustomerList, buildTable);
				
				changeToSuccess(0);
			}else{
				//去缴费
				pageHandleCustomerPay("pager", "ComPayTbody", data, num, getCustomerList, buildTablePay);
				changeToSuccess(0);
				//获得缴费类型
				getPayType();
			}
		},
		error : function() {
			changeToError(1);
		}
	});
}
//查询按钮
function getCustomerLists(num) {
	var userName=$("#userName").val().trim();
	var siteId=$("#siteId").val();
	if(userName==""||siteId==""){
		return;
	}

	var addressRule = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
	if(userName!=""&&!(addressRule.test(userName)&&userName.length==11)){
		$("#userName").val(userName);
		document.getElementById('tiShi').innerHTML = "请输入正确手机号";
		return ;
	}
	if (num == undefined){
		return;
	}
	if (isNaN(num)){
		return;
	}
	$.ajax({
		type : "POST",
		url : "getUserInfo",
		data : {
			curPage : num,
			username : userName,
			siteId : siteId,
			pageSize : 10,
		},
		success : function(data) {
			eval("data = " + data);
			if (data.code == 200) {
				// 去缴费
				pageHandleCustomerPay("pager", "ComPayTbody", data.data, num, getCustomerList, buildTable);
				changeToSuccess(0);
				
				//获得缴费类型
				getPayType();
			} else if(data.code == 202) {
				// 去注册
				pageHandleCustomerPay("pager", "ComPayTbody", data.data, num, getCustomerList, buildTable);
				
				changeToSuccess(0);
			}else{
				//去缴费
				pageHandleCustomerPay("pager", "ComPayTbody", data, num, getCustomerList, buildTablePay);
				changeToSuccess(0);
				//获得缴费类型
				getPayType();
			}
		},
		error : function() {
			changeToError(1);
		}
	});
}
Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "H+": this.getHours(), //小时 
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
//注册完成跳转到的创建缴费的表格
function buildTablePay(data, tableId) {
	var tbody = $("#" + tableId);
	var time2 = new Date().Format("yyyy-MM-dd HH:mm:ss");  
	tbody.empty();
	var tableHtml="";
		tableHtml+="<tr>" +
				"<td>"+data.data.userName+"</td>" +
				"<td>" +time2+"</td>" +
				"<td>" +
				"<button  class='btn btn-primary  btn-mini dropdown-toggle' onclick='CustomerPayClick()'>缴费</button></td>" +
				"</tr>";
	tbody.html(tableHtml);
}

//查询到手机号后跳转到的生成缴费表格
function buildTable(data, tableId) {
	//获得缴费类型
	getPayType();
	var tbody = $("#" + tableId);
	tbody.empty();
	data = data.data;
	var tableHtml="";
	for (var i = 0; i < data.length; i++) {
		tableHtml+="<tr>" +
				"<td>"+data[i].userName+"</td>" +
				"<td>"+data[i].expirationTime+"</td>" +
				"<td>" +
				"<button  class='btn btn-primary  btn-mini dropdown-toggle' onclick='CustomerPayClick()'>缴费</button></td>" +
				"</tr>";
	}
	tbody.html(tableHtml);
}

//注册按钮点击
$("#doAddRegisteBtn").click(function(){
	registAdmin();
});
//管理员注册用户
function registAdmin(){
	var uname= $("#uname").val().trim();
	var pwd=$("#pwd").val().trim();
	var gender = $('input:radio:checked').val();
	$.ajax({
		type : "POST",
		url : "doRegistSD",
		data : {
			uname : uname,
			pwd : pwd,
			gender : gender,
		},
		success : function(data) {
			eval("data = " + data);
			if (data.code == 200) {
				//动态模框隐藏
				$('#addRegistModel').modal("hide");
				//绿色成功框
//				showLoading();
				toastr.success('注册成功');
				//刷新
				setTimeout('myrefresh()',1000); 
			} else {
				changeToError(1);
			}
		},
		error : function() {
			changeToError(1);
		}
	});
}


function RegistClick(){
	$("#addRegistForm")[0].reset();
	$('#addRegistModel').modal({
	});
	var tel = $("#userName").val();
	$("#uname").val(tel);
	$("#pwd").val("123456");
}

function submitRegist(){  //进行注册
	$("#addRegistForm").submit();
}
//缴费按钮
function CustomerPayClick(){
	$("#customerPay")[0].reset();
	$('#CoustmerPayModel').modal({
	});
	var price = $("#rq option:selected").attr("prices");
	sumMoney(price);
}
//得到消费类型
function getPayType(){
	var userName = $("#userName").val();
	var siteId = $("#siteId option:selected").attr("value");
	var chargeType = 0;//默认计费类型为普通计费模式
	if(checkPhoneType(userName)){//如果是电信手机号则传递chargeType到后台标明为计费规则归属为电信既：chargeType = 1
		chargeType = 1;
	}
	$.ajax({
		type : "POST",
		url : "doCustomerPay",
		async: false,//改成同步依然不能解决好取不到付费规则
		data : {
			curPage : 1,
			username : userName,
			siteId : siteId,
			pageSize : 10,
			chargeType : chargeType
		},
		success : function(data) {
			eval("data = " + data);
			if (data.code == 200) {
				// 调用分页
//				pageHandleCustomerPay("pager", "ComPayTbody", data.data, getCustomerList, buildTable);
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

// 计算价格
function sumMoney(price) {
	price = $("#rq option:selected").attr("prices");
	var nums = $("#pay_no").val();
	var sumMoney = 1;
	if (nums == "" || nums == null ) {
		sumMoney=0;
		return;
	}
	    sumMoney = price * nums;
	$("#je2").html(sumMoney.toFixed(2)+"");
	$("#amount").val(sumMoney.toFixed(2));
};

function setPriceType() { // 设置续费类型
	var price =$(".pay_no").attr("prices");
	$("#unitPrice").html((price*1).toFixed(2)+"&nbsp;");//(price*1)是为了转换格式，懒得用方法转了
}
//定时刷新
function myrefresh() 
{ 
       window.location.reload(); 
} 

jQuery.validator.addMethod("lrunlv", function(value, element) {         
    return this.optional(element) || /^\d+(\.\d{1,2})?$/.test(value);         
}, "小数位不能超过三位"); 
$("#customerPay").validate({
	errorPlacement : function(error, element) {
		error.css({
			display : "inline",
			color : "#F00",
			position : "relative",
		}).appendTo(element.parent().addClass("error"));
	},
	submitHandler : function() {
		var paytype = $("#rq option:selected").val();
		var payno=	$("#pay_no").val();
		var siteId = $("#siteId option:selected").attr("value");
		var userName = $("#userName").val();
		var amount =$("#amount").val();
		$.ajax({
			type : "POST",
			url : ctx+"/updateCustomerPay",
			data : {
				paytype : paytype,
				payno : payno,
				siteId : siteId,
				username : userName,
				amount:amount
			},
			success : function(data) {
				eval("data = " + data);
				if (data.code == 1) {
					//动态模隐藏
					$('#CoustmerPayModel').modal("hide");
					//绿色成功框
					toastr.success('缴费成功');
					//刷新页面
					setTimeout('myrefresh()',1000); 
				} else{
					$('#CoustmerPayModel').modal("hide");
					toastr.error("服务不可用，请稍后再试");
				}
			},
			error : function() {
				$('#CoustmerPayModel').modal("hide");
				toastr.error("服务不可用，请稍后再试");
			}
		});
	},	
	rules : { //验证
		pay : {
			required : true,
			number:true,
			min:1,
			max:9999
		},
	},
	messages : { //错误提示
		pay : {
			required : "请输入合法的数字(不能小于0.01)",
			min:"不能再便宜了！",
			max:"太贵了！",
		},
	}
});
var phoneNum = $("#userName").val();
function checkPhoneType(phoneNum){
	var flag = false;
	var subPhone = phoneNum.substr(0,7);
	switch(subPhone) {
		case "1775580" :
			flag = true;
		break;
		case "1775589" :
			flag = true;
		break;
		case "1895674" :
			flag = true;
		break;
		case "1895673" :
			flag = true;
		break;
		case "1894908" :
			flag = true;
		break;
		case "1890968" :
			flag = true;
		break;
		case "1813310" :
			flag = true;
		break;
		case "1815627" :
			flag = true;
		break;
		case "1809677" :
			flag = true;
		break;
		case "1811051" :
			flag = true;
		break;
		case "1805697" :
			flag = true;
		break;
		case "1805588" :
			flag = true;
		break;
	}
	return flag;
}
