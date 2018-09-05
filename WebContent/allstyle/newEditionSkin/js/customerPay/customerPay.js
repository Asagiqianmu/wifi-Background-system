$(function() {
	buffer();
	$('.admin').click(function(){
		var str=$('.menu').css('display');
		if(str=='none'){
			$('.menu').css('display','block');
		}else{
			$('.menu').css('display','none');
		}
	});
	// 退出按钮
	$('.menu > li.exit').click(function(){
		window.location.href=ctx+"/logOut";
	});
	$('.menu > li.personageCenter').click(function(){
		window.location.href=ctx+"/personalCenter/toPersonalCenter";
	});
	
});
var siteId = "";
 
//回车触发查询事件

$('#userName').keydown(function(event){
    var e = event || window.event || arguments.callee.caller.arguments[0];
              
     if(e && e.keyCode==13){ 
         //要做的事情
    	var va  = $("#userPay").text();
    	if($.trim(va)==$.trim('请选择场所')){
    		document.getElementById('tiShi').innerHTML = "请先选择场所";
    		return false;
    	}else{
    		queryExpiration();
    	}
    }
}); 
//立即充值
//输入缴费数量时失去焦点时触发
	$("#pay_no").keyup(function() {
		sumMoney();
	});
	
//查询按钮
	$("#query").click(function(){
		var va  = $("#userPay").text();
    	if($.trim(va)==$.trim('请选择场所')){
    		document.getElementById('tiShi').innerHTML = "请先选择场所";
    		return false;
    	}else{
    		queryExpiration();
    	}
	});
//点击付费类型
function fufei(){
	$("#riqi>li").click(function(){
 		var s=$("#riqi>li").index(this);
 		$("#riqi>li").removeClass("selected").eq(s).addClass("selected");
 		var str=$("#riqi>li").eq(s).html();
 		$("#CustomerPayConfig").val($(".selected").attr("value"));
 		$('#je').html(str);
 		sumMoney();
 	});
}

//得到消费类型
function getPayType(){
	
	var userName=$("#userName").val().trim();
	var siteId =$(".college").attr("sites");
		$('.mask').css('display','block');
	$.ajax({
		type : "POST",
		url : "getPaymentType",
		data : {
			username : userName,
			siteId : siteId,
		},
		success : function(data) {
			if(data=="loseSession"){
				 window.location.href=ctx+"/toLogin";
				 return;
			}	
			eval("data = " + data);
			if (data.code == 200) {
				 
				buffer();
		 		$('.premises').css('display','block');
		 		$('.addUser').css('display','none');

		 		$('.newly').animate({left:'20%'},1000);
		 		$('.btns').animate({left:'20%'},1000);
				var htmls = "";
				for(var i=0; i<data.data.length; i++){
					 var sitePrice = data.data[i];
					 var priceType = sitePrice.price_type;
					 //暂时没有处理按流量计费的计费类型
					// if(priceType<4){
						 htmls += "<li value='"+sitePrice.id+"' priceType='"+sitePrice.price_type+"' addNum='"+sitePrice.giveMeal+"' descript='"+sitePrice.describe+"' addUnit='"+sitePrice.giveMealUnit+"' prices='"+sitePrice.unit_price+"' priceNum='"+sitePrice.price_num+"'>" + sitePrice.name +"</li>";
					// }
				}
				htmls+=" <input type='hidden' id='CustomerPayConfig' name='CustomerPayConfig' value=''/>";
				$("#riqi").html(htmls);
				$("#je").text($("#riqi>li").eq(0).text());
				$("#riqi>li").eq(0).addClass("selected");
				$("#je2").text($("#riqi>li").eq(0).attr("prices"));
				fufei();
			}
		},
		error : function() {
		}
	});
}
//进度条
function buffer(){
	$('.barcontainer').css('display','block');
	$('.barcontainer').fadeOut(800);
}
// 计算价格
	function sumMoney(price) {
		
		price = $(".selected").attr("prices");
//		alert(price);
		var nums = $("#pay_no").val();
		var sumMoney = 1;
		if (nums == "" || nums == null ) {
			sumMoney=0;
			return;
		}
		    sumMoney = price * nums;
		$("#je2").text(sumMoney.toFixed(2)+"");
//		alert($("#je2").text());
		$("#amount").val(sumMoney.toFixed(2));
	};
//立即充值按钮 doRegistSD
	$('#sub').click(function() { 
		submitUpdate();
		$("#je").val("");
		$("#pay_no").val("1");
		$("#je2").html("");
		buffer();
		queryExpiration();//查询
	});
	//提交表单
	function submitUpdate(){  //进行缴费
		$("#customerPay").submit();
	}	
	
//充值按钮
function butt(){
	$('.recharge').click(function(){
		$("#je").html("");
		$("#pay_no").val("1");
		$("#je2").html("");
		//var da =/* new dfgsAlert();
		//da.open(function(){
			getPayType();
	//	});
 	});
}
//点击场所时触发的方法

	$(".pullDs>li").click(function(){
		var i = $(".pullDs>li").index(this);
		$(".pullDs>li").removeClass('siteChorses').eq(i).addClass("siteChorses");
	});
	 
//立即创建按钮
 
$("#doAddRegisteBtn").click(function(){
	//清除validate缓存
	$("#uname").change(function(){  
        $("#uname").removeData("previousValue").valid();  
    }); 
	createButton();
});
//立即充值取消按钮
$('#payCancel').click(function(){
	var da = new dfgsAlert();
	da.open(function(){
		disableAjax();
	});
});
//注册的取消
$('#regCancel').click(function(){
	$(".error").html("");
	var da = new dfgsAlert();
	da.open(function(){
		$('.whether').css('display','none');
		$('.newly').animate({left:2000},1000);
		$('.btns').animate({left:2000},1000);
		$('.win>span').html("操作成功！");
		win();
		setTimeout(function(){
			$('.mask').css('display','none');
		},500);
		
	});
});

//立即创建按钮提交按钮
function createButton(){
	$("#addRegistForm").submit();
}
//-----------------------------------------------注册start----------------------------------------------
//注册

jQuery.validator.addMethod("phone", function(value, element) { 
    return this.optional(element) || /^(((13[0-9]{1})|(14[4-7]{1})|(15[0-9]{1})|(170)|(17[1-8]{1})|(18[0-9]{1}))+\d{8})$/.test(value);         
}, "请输入正确手机账号！");
$("#addRegistForm").validate({
	errorPlacement : function(error, element) {
		$(".error").val("");
		error.css({
			display : "inline",
			color : "#F00",
			position : "relative",
		}).appendTo(element.next().addClass("error"));
	},
	
	submitHandler : function() {
		var siteId =$(".college").attr("sites");
		var uname= $.trim($("#uname").val());
		var pwd=$.trim($("#pwd").val());
		var gender = $('.fn-sex>li.on').attr("value");
		$.ajax({
			type : "POST",
			url : ctx+"/siteCustomer/doRegistSD",
			data : {
				uname : uname,
				pwd : pwd,
				gender : gender,
				siteId:siteId
			},
			success : function(data) {
				if(data=="loseSession"){
					 window.location.href=ctx+"/toLogin";
					 return;
				}	
				eval("data = " + data);
				if (data.code == 200) {
					/*var da = new dfgsAlert();*/
					//da.open(function(){
						$('.newly').animate({left:2000},1000);
						$('.btns').animate({left:2000},1000);
						$('.win>span').html("注册成功！");
						win();
						setTimeout(function(){
							$('.mask').css('display','none');
						},500);
						$(".error").html("");
					//});
					$(".error").html("");
					buffer();
				} else {
					$('.win>span').html("注册失败！");
					win();
				}
			},
			error : function() {
			}
		});
	},	
	rules : {
		uname : {
			required : true,
			rangelength:[11,11],
			phone:true,
			remote:{
				type: "POST",               //数据发送方式
			    url: ctx+"/RegistCheckTel?time="+Math.random(),     //后台处理程序  请修正该字段
			    data: {                     //要传递的数据
			    	telephone: function() {
			            return $.trim($("#uname").val());
			        }
			    }
			}
		},
		pwd : {
			required : true,
			rangelength:[4,16],
		},
	},
	messages : {
		uname : {
			required : "请输入手机号",
			rangelength:"请输入正确的手机号！",
			phone:"请输入正确的手机号！",
			remote:"该手机号已经注册"
		},
		pwd : {
			required : "请输入密码",
			rangelength:"用户密码为4~16位长度"
		},
	}
});
//-----------------------------------------------注册end----------------------------------------------


//-----------------------------------------------缴费start----------------------------------------------
//缴费
$("#customerPay").validate({
	errorPlacement : function(error, element) {
		$(".error").val("");
		error.css({
			display : "inline",
			color : "#F00",
			position : "relative",
		}).appendTo(element.parent().addClass("error"));
	},
	submitHandler : function() {
		var paytype = $(".selected").attr("value");
		var siteId = $(".college").attr("sites");
		var userName =$("#userName").val();
		var amount =$("#je2").text();
		var priceNum=$(".selected").attr("priceNum");
		var giveNum=$(".selected").attr("addnum");//赠送的套餐数量
		var giveUnit=$(".selected").attr("addunit");//赠送的套餐单位
		var priceType=$(".selected").attr("pricetype");//套餐单位
		var buyNum=$("#pay_no").val();
		var payName =$(".selected").html();
		var mealType=1;
		if(priceType>3){
			mealType=2;
		}
		$.ajax({
			type : "POST",
			url : ctx+"/siteCustomer/updateCustomerPay",
			data : {
				siteId : siteId,
				username : userName,
				paytype : paytype,
				amount : amount,
				priceNum:priceNum,
				payName : payName,
				buyNum : buyNum,
				giveNum : giveNum,
				mealType : mealType,
				giveUnit : giveUnit,
				priceType : priceType
			},
			success : function(data) {
				if(data=="loseSession"){
					 window.location.href=ctx+"/toLogin";
					 return;
				}	
				eval("data = " + data);
				//缴费成功
				if (data.code == 200) {
						$('.newly').animate({left:2000},1000);
						$('.btns').animate({left:2000},1000);
						$('.win>span').html("充值成功！");
						win();
						setTimeout(function(){
							$('.mask').css('display','none');
						},500);
						$(".error").html("");
					$(".error em").html("");
					queryExpiration();
				} else{
					$('.win>span').html("充值失败！");
					win();
				}
			},
			error : function() {
			}
		});
	},	
	rules : { //验证付费数量
		pay : {
			required : true,
			min:1,
			max:9999
		},
	},
	messages : { //错误提示
		pay : {
			required : "请输入合法的数字(不能小于1)",
			min:"不能再便宜了！",
			max:"太贵了！",
		},
	}
});
//-----------------------------------------------缴费end----------------------------------------------
//-----------------------------------------------查询start----------------------------------------------
//查询按钮
function queryExpiration() {
	document.getElementById('tiShi').innerHTML = "";
	 
	 
	var userName=$("#userName").val().trim();
	//场所信息的获取
	var siteId =$(".college").attr("sites");
	//查不到数据时结束
	if(userName==""||siteId==""){
		document.getElementById('tiShi').innerHTML = "手机号不能为空!";
		return false;
	}
    
	var addressRule = /^(((13[0-9]{1})|(14[4-7]{1})|(15[0-9]{1})|(170)|(17[1-8]{1})|(18[0-9]{1}))+\d{8})$/;
	if(userName!=""&&!(addressRule.test(userName)&&userName.length==11)){
		document.getElementById('tiShi').innerHTML = "请输入正确手机号";
		return false;
	}
	$.ajax({
		type : "POST",
		url : "getUserInfo",
		data : {
			username : userName,
			siteId : siteId,
		},
		success : function(data) {
			if(data=="loseSession"){
				 window.location.href=ctx+"/toLogin";
				 return;
			}	
			eval("data = " + data);
			//查询成功后
			if (data.code == 201) {
				$('.ui-userAccount').html(data.msg);
			}else{
				buffer();
				htmls = "";
				htmls+="<p><label>用户账号</label>&gt;<span >"+data.data[0]+"</span></p>";
				htmls+="<p><label>到期时间</label>&gt;<span>"+data.data[1]+"</span></p>";
				if(data.data[2]!=null){
				htmls+="<p><label>剩余流量</label>&gt;<span>"+data.data[2]+"</span></p>";
				}
				htmls+="<p><label>用户状态</label>&gt;<span id='state'>正常</span></p>";
				htmls+="<button class='recharge'>充值</button>";
				htmls+="<button  class='deblocking'>解锁</button>";
				htmls+="<button  class='blockUp'>停用</button>";
				$('.ui-userAccount').html(htmls);
				$('#state').html(data.msg);
				//202欠费
				if(data.code==202){
					$(".blockUp").css("background-color","#ccc"); //停用失效
					$(".deblocking").css("background-color","#ccc");
					$(".blockUp").attr("disabled", true); //停用失效
					$(".deblocking").attr("disabled", true); //解锁失效
					//被锁定
				}else if(data.code==203){
					
					$(".deblocking").attr("disabled",false); //解锁有效
				}else{
					$(".deblocking").css("background-color","#ccc");
					$(".deblocking").attr("disabled",true);
				}
				butt();
				//解锁按钮点击事件
				$(".deblocking").click(function(){
					var da = new dfgsAlert();
					da.open(function(){
						unlockAjax();
					});
					
				});
				//停用按钮点击事件
				$(".blockUp").click(function(){
					var da = new dfgsAlert();
					da.open(function(){
						disableAjax();
					});
					
				});
				
			}
		},
		error : function() {
			 
		}
	});
	$('.newly').animate({left:2000},1000);
	$('.btns').animate({left:2000},1000);
	setTimeout(function(){
		$('.mask').css('display','none');
	},500);
} 
//充值的取消
$("#payCancel").click(function(){
		var da = new dfgsAlert();
		da.open(function(){
			$('.newly').animate({left:2000},1000);
			$('.btns').animate({left:2000},1000);
			$('.win>span').html("操作成功！");
			win();
			setTimeout(function(){
				$('.mask').css('display','none');
			},500)
		});
	});
//充值
$(".icon-false").click(function(){
	if($.trim($(".college").text())=="请选择场所"){
		$(".win>span").html("请先选择场所");
		win();
		return false;
	}
	var da = new dfgsAlert();
	da.open(function(){
		$('.newly').animate({left:2000},1000);
		$('.btns').animate({left:2000},1000);
		setTimeout(function(){
			$('.mask').css('display','none');
		},500)
	});
});
//停用
function disableAjax(){
	var uname= $("#userName").val().trim();
	var siteId =$(".college").attr("sites");
	$.ajax({
		type : "post",
		url : "blockUp?data="+Math.random(),
		data : {
			username : uname,
			siteId : siteId
		},
		success : function(data){
			if(data=="loseSession"){
				 window.location.href=ctx+"/toLogin";
				 return;
			}	
			eval("data="+data);
			htmls = "";
			htmls+="<p><label>用户账号</label>&gt;<span >"+uname+"</span></p>";
			htmls+="<p><label>到期时间</label>&gt;<span>"+data.data+"</span></p>";
			htmls+="<p><label>用户状态</label>&gt;<span id='state'>正常</span></p>";
			htmls+="<button class='recharge'>充值</button>";
			htmls+="<button  class='deblocking'>解锁</button>";
			htmls+="<button  class='blockUp'>停用</button>";
			$('.win>span').html("停用成功！");
			win();
			$('.ui-userAccount').html(htmls);
			$('#state').html("欠费");
			$(".blockUp").css("background-color","#ccc"); //停用失效
			$(".deblocking").css("background-color","#ccc");
			queryExpiration();//查询
		},
		error : function(){
			$('.win>span').html("停用失败！");
			win();
		}
		
	});
}
//解锁ajax
function unlockAjax(){
	var uname= $("#userName").val().trim();
	var siteId = $(".college").attr("sites");
	$.ajax({
		type : "POST",
		url : "unLock",
		data : {
			userName : uname,
			siteId:siteId
		},
		success : function(data){
			if(data=="loseSession"){
				 window.location.href=ctx+"/toLogin";
				 return;
			}	
			eval("data="+data);
			if(data.code==200){
				
				$('.win>span').html("解锁成功！");
				win();
				$('#state').html("正常");
				//查询是否欠费
				$(".deblocking").css("background-color","#ccc");
				$(".deblocking").attr("disabled", true);//解锁失效
				queryExpiration();//查询
			}else{
				$('.win>span').html("解锁失败！");
				win();
			}
			
		},
		error : function(){
			$('.win>span').html("服务错误,请稍后·····");
			win();
		}
	
	});
}
//-----------------------------------------------查询end----------------------------------------------

/**
 * 东方高盛独属提示框
 */
function dfgsAlert(){
	/**
	 * 打开提示框
	 * @parameter alertText 提示框显示的自定义提示文本
	 */
	this.open  = function(enterCallBack){
		
		$('.whether').css('display','block');
		$('.whether>button').unbind('click');
		//为确定按钮绑定用户自定义事件
		$('.whether>button').eq(0).click(function(){
			$('.whether').css('display','none');
			enterCallBack()
			
		});
		
		//为取消按钮绑定标准事件
		$('.whether>button').eq(1).click(function(){
			//解绑按钮事件
			
			$('.whether').css('display','none');
		});
	}
}
