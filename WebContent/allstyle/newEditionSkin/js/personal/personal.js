var time;
var kjsmoney=0;
var gunTime;
var key=0;
window.onload=function(){
	getUserName();
	getUserWithdrawInfo();
	/**
	* 新增账号 银行卡号input 事件
	* onfocus--判断input框有没有值
	* onkeypress--往input框键入时候的操作
	* onblur--隐藏bigNum回显框
	*/
	$('#bankcarNums').focus(function(){
		if($('#bankcarNums').val().length>0){
			$('.bigNum').css('display','block');
			var str=$('#bankcarNums').val();
			$('.bigNum').text(bankNumSpace(str));
		}else{
			$('.bigNum').css('display','none');
			$('.bigNum').text('');
		}
	});
	$('#bankcarNums').blur(function(){
		$('.bigNum').css('display','none');
		$('.bigNum').text('');
		var str=$(this).val();
		getBankName(str);
	});
	$('#bankcarNums').bind('input propertychange',function(){
		$('.bigNum').css('display','block');
		
		setTimeout(function(){
			var str=$('#bankcarNums').val();
			$('.bigNum').text(bankNumSpace(str));
		},100);
	});
	/**
	 * 驗證碼input框回車事件
	 */
	$('#verifyNum').keypress(function(event){
	    var e = event || window.event || arguments.callee.caller.arguments[0];
	     if(e && e.keyCode==13){ 
	    	 var val=$("#newPhone").val();
	    	var wordLength=$("#newPwd").val().length;
	         //要做的事情
	    	 if(key==4){
	    		if(addressRule.test(val)){
	 				
	 				modAccountSub();
	 			}else{
	 				win("请输入正确的手机号");
	 			}
	 		}else if(key==3){
	 			if(addressRule.test(val)){
					modUserPhoneSub();
	 			}else{
	 				win("请输入正确的手机号");
	 			}
	 		}else if(key==5){
	 			if(wordLength>=4){
					updateUserPassWord();
				}else{
					win("密码不能少于四位");
				}
	 		}else if(key==6){
	 			if(wordLength>=4){
					updatePaaWord();
				}else{
					win("密码不能少于四位");
				}
	 		}else{
	 			withdrawVerify($('#verifyNum'));
	 		}
	    }
	});

	// 获取验证码
	$('.fn-gain').click(function(){
		clearInterval(time);
		countDown($('.fn-gain'),90);//获取验证码方法
		toTelCode();
	});

	$('.fn-gain1').click(function(){

		if(addressRule.test($('#newPhone').val())){
			countDown($('.fn-gain1'),90);//获取验证码方法
			toTelCode();
		}else{
			win('请输入正确的手机号');
		}
		
	});
	btnBind();

	// 新增账号按钮
	$('.fn-add').click(function(){
		var obj=new dfgsWithdraw();
		obj.show3();
	});
	
	/* 新增支付宝账号按钮 */
	$('#addAlipay').click(function(){
		var obj=new dfgsWithdraw();
		obj.show4();
	});

	// 新增账号提交按钮
	$('#newAddCard').click(function(){
		$('#newAddCardName').submit();
		//subajax();TODO
	});
	
	//新增支付宝绑定提交
	$('#newAddAlipay').click(function(){
		subajax();
	});
	
	$('.show>h4>i').click(function(){
		var obj=new dfgsWithdraw();
		obj.close();
		$(".error").html("");
	});
	
	$('.menu > li.exit').click(function(){
		window.location.href=ctx+"/logOut";
	});
	$('.menu > li.personageCenter').click(function(){
		window.location.href=ctx+"/personalCenter/toPersonalCenter";
	});
	
	/**
	*修改登陆账号按钮 
	*/
	$('#modUserPhone').click(function(){
		key=0;
		var obj=new dfgsWithdraw();
		obj.verifyAlert(toTelCode);
	});
	/**
	*修改登录密码按钮
	*/
	$('#modUserPwd').click(function(){
		key=2;
		var obj=new dfgsWithdraw();
		obj.verifyAlert(toTelCode);
	});
	/**
	*修改提现验证手机号按钮
	*/
	$('#modWithPhone').click(function(){
		key=1;
		var obj=new dfgsWithdraw();
		obj.verifyAlert(toTelCode);
	});
	/**
	*新增银行卡号按钮
	*/
	$('#addBankCard').click(function(){
		var obj=new dfgsWithdraw();
		obj.show3();
	});
};

/* 
*正则 校验手机号是否正确
*/
var addressRule = /^(((13[0-9]{1})|(14[4-7]{1})|(15[0-9]{1})|(170)|(17[1-8]{1})|(18[0-9]{1}))+\d{8})$/;
var on=function(obj,n){//自用方法---用来区分当前的焦点元素
	obj.removeClass('on').eq(n).addClass('on');
};
var numdisp=function(n){
	if(n==0){
		$('.num').css('display','none');
		$('.num').eq(0).css('display','block');
		$('.num').eq(1).css('display','block');
		$('.num').eq(2).css('display','block');
		$('.num').eq(3).css('display','block');
	}else if(n==$('.num').length-1){
		$('.num').css('display','none');
		$('.num').eq(n-3).css('display','block');
		$('.num').eq(n-2).css('display','block');
		$('.num').eq(n-1).css('display','block');
		$('.num').eq(n).css('display','block');
	}else if(n==$('.num').length-2){
		$('.num').css('display','none');
		$('.num').eq(n-1).css('display','block');
		$('.num').eq(n).css('display','block');
		$('.num').eq(n+1).css('display','block');
		$('.num').eq(n-2).css('display','block');
	}else{
		$('.num').css('display','none');
		$('.num').eq(n-1).css('display','block');
		$('.num').eq(n).css('display','block');
		$('.num').eq(n+1).css('display','block');
		$('.num').eq(n+2).css('display','block');
	}
};

/**
*初始化获取验证码按钮
*/
function initBtn(){
	clearInterval(time);
	$('.fn-gain1').html('获取验证码');
	$('.fn-gain1').removeAttr('disabled');
	$('.fn-gain1').addClass('on');
}
/**
*获取验证码等待时间
*/
var countDown=function(obj,n){
	obj.html('('+n+')秒后重新获取');
	obj.removeClass('on');
	time=setInterval(function(){
		n--;
		obj.html('('+n+')秒后重新获取');
		obj.attr({"disabled":"true"});
		if(n==0){
			clearInterval(time);
			obj.html('重新获取验证码');
			obj.removeAttr("disabled");
			obj.addClass('on');
		}
	},1000);
};
/**
*东方高盛，提现系列弹窗
*/
function dfgsWithdraw(){
	/**
	*打开验证码输入框
	*/
	this.verifyAlert=function(callback){
		$('.mask').css('display','block');
		$('.show').css('display','none');
		$('.alertPhoneVerify').css('display','none');
		$('.pwdMod').css('display','none');
		$('.alertVerify').css('display','block');
		countDown($('.fn-gain'),90);//
		if(callback)callback();//执行回掉函数
	};
	/**
	*所有关闭操作
	*/
	this.close=function(){
		$('.mask').css('display','none');
		clearInterval(time);
		clear();
	};
	/**
	*通过验证码验证后的显示
	*/
	this.show1=function(callback){
		key=4;
		$('.mask').css('display','block');
		$('.show').css('display','none');
		$('.alertVerify').css('display','none');
		$('.alertPhoneVerify').css('display','block');
		$('.pwdMod').css('display','none');
		if(callback)callback();//执行回掉函数
	};
	/**
	*选择收款账号
	*/
	this.show2=function(callback){
		$('.mask').css('display','block');
		$('.show').css('display','none');
		$('.alertVerify').css('display','none');
		$('.alertPhoneVerify').css('display','none');
		$('.pwdMod').css('display','block');
		if(callback)callback();//执行回掉函数
	};
	/**
	*新增账号
	*/
	this.show3=function(callback){
		$('.mask').css('display','block');
		$('.show').css('display','none').eq(2).css('display','block');
		$('.alertPhoneVerify').css('display','none');
		$('.pwdMod').css('display','none');
		if(callback)callback();//执行回掉函数
	};
	/**
	*新增支付宝账号
	*/
	this.show4 = function(callback){
		$('.mask').css('display','block');
		$('.show').css('display','none').eq(3).css('display','block');
		$('.alertPhoneVerify').css('display','none');
		$('.pwdMod').css('display','none');
		if(callback)callback();//执行回掉函数
	}
}
/**
* 处理字符串显示几位中间以‘*’号显示
* 只能用作回显银行卡号
*/
function substrDemo(str,n,l){//接受需要处理的字符串
	return (str.substr(0,n)+'****'+str.substr(str.length-l,l));//直接返回处理好的字符串
}
/**
* 处理银行卡号4为加一个空格
* 只能用作回显银行卡号
*/
function bankNumSpace(str){
	var arr=new Array(),
		str1='',
		len=parseInt(str.length/4);
	if(str.length!=16){
		for(var i=0;i<len+1;i++){
			if(i==len){
				arr.push(str.substr(i*4,4));
			}else{
				arr.push(str.substr(i*4,4)+" ");
			}
		}
	}else{
		for(var i=0;i<len;i++){
			if(i==len-1){
				arr.push(str.substr(i*4,4));
			}else{
				arr.push(str.substr(i*4,4)+" ");
			}
		}
	}
	for(var i=0;i<arr.length;i++){
		str1+=arr[i];
	}
	return str1;
}

/**
*页面加载执行
*获取登录用户名
*/
function getUserName(){
	$.ajax({
		url: ctx+"/personalCenter/getUserName",
		type: "post",
		success: function(data){
			eval("data="+data);
			$('.userP').text(data.data);
			$('#txPhone').text(substrDemo(data.msg,3,4));
			$('#txPhone').attr('data',data.msg);
			$(".adname").html($(".userP").html());
		}
	});
};
/**
*页面加载执行
*加载银行卡信息列表和提现手机号
*/
function getUserWithdrawInfo(){
	var htmls="";
	$.ajax({
		url: ctx+'/personalCenter/getUserWithdrawInfo',
		type: 'post',
		success: function(data){
			eval("data="+data);
			if(data.code==200){
				$('#WithdrawInfo>LI').remove();
				for(var i=0,len=data.data.length;i<len;i++){
					htmls+='<li data="'+data.data[i].id+'">'+
								'<span>'+data.data[i].accountName+'</span>'+
								'<span>'+substrDemo(data.data[i].bankcarNum,4,4)+'</span>'+
								'<span>'+data.data[i].bankDeposit+'</span>'+
								'<span>'+data.data[i].branchName+'</span>'+
								'<span><i class="icon icon-trash delectBank"></i></span>'+
							'</li>';
				}
				$('#WithdrawInfo>h6').after(htmls);
				// 删除账号按钮
				$('.delectBank').click(function(){
					var n=$('.delectBank').index(this);
					
					var i=$('#WithdrawInfo>li').eq(n).attr('data');
					if(confirm("你确定要删除该提现账号？"))deleteBankCard(i);
					//$('.whether').css('display','block');
					return false;
				});
			}else{
				$('#WithdrawInfo>LI').remove();
			}
		}
	});
};

/**
 * 发送验证码ajax
 */
var toTelCode = function(){
	//修改登录账 号 key=0或者key=3   修改密码key=2   修改提现手机号key=1 或者key=4
	/*if(key==0){
		var userName = $('.userP').text(),
		content = "。您正在使用飞讯无限的修改登录账号功能，需要进行校验，此码5分钟内有效，请勿转发他人。";
		var templateCode = "SMS_12876348";
	}else if(key==1){
		var userName = $('#txPhone').attr('data'),
		content = "。您正在使用飞讯无限的修改提现账号功能，需要进行校验，此码5分钟内有效，请勿转发他人。";
		var templateCode = "SMS_12911534";
	}else if(key==2){
		var userName = $('.userP').text(),
		content = "。您正在使用飞讯无限的修改登录密码功能，需要进行校验，此码5分钟内有效，请勿转发他人。";
		var templateCode = "SMS_12921441";
	}else if(key==3){
		var userName = $('#newPhone').val(),
		content = "。您正在使用飞讯无限的修改登录账号功能，需要进行校验，此码5分钟内有效，请勿转发他人。";
		var templateCode = "SMS_12876348";
	}else if(key==4){
		var userName = $('#newPhone').val(),
		content = "。您正在使用飞讯无限的修改提现账号功能，需要进行校验，此码5分钟内有效，请勿转发他人。";
		//SMS_12911534
		var templateCode = "SMS_12911534";
	}*/
	var templateCode = "SMS_136855624"; 
	content = "已弃用";
	$.ajax({
		type:"post",
		url:ctx+"/TelCodeManage/sendTelCode",
		dataType: "json",
		data:{
			tel:userName,
			//content:content
			templateCode:templateCode,
			msgtext:'平台:'+contend
		},
		success:function(data){
			eval("data="+data);
			if(data==-2){
				clearInterval(time);
				$('.alertPhoneVerify .fn-gain1').removeClass("on");
				$('.alertPhoneVerify .fn-gain1').html('重新获取验证码');
				$('.alertPhoneVerify .fn-gain1').removeAttr("disabled");
				$('.alertPhoneVerify .fn-gain1').addClass('on');
				
				
				$('.fn-gain').removeClass("on");
				$('.fn-gain').html('重新获取验证码');
				$('.fn-gain').removeAttr("disabled");
				$('.fn-gain').addClass('on');
				floatAlert(300,60,'请不要频繁发送验证码,谢谢您的配合与支持!',2500);
			}
		},
		error:function(){
			win("网络服务忙,请稍后重新发送···");
		}
	});
};

/**
*绑定确定取消单击事件
*/
var btnBind=function(){
	$('.fn-pass').unbind('click');
	$('.fn-close').unbind('click');
	// 验证码确定按钮
	$('.fn-pass').click(function(){
		var val=$("#newPhone").val().replace(/\ +/g,"");
		var wordLength=$("#newPwd").val().replace(/\ +/g,"").length;
		if(key==4){
			if(addressRule.test(val)){
				
				modAccountSub();
			}else{
				win("请输入正确的手机号");
			}
		}else if(key==3){
			if(addressRule.test(val)){
					modUserPhoneSub();
			}else{
				win("请输入正确的手机号");
			}
		}else if(key==5){
			if(wordLength>=4){
				updateUserPassWord();
			}else{
				win("密码不能少于四位");
			}
		}else if(key==6){
			if(wordLength>=4){
				updatePaaWord();
			}else{
				win("密码不能少于四位");
			}
		}else{
			withdrawVerify($('#verifyNum'));
		}
		
	});
	// 验证码 取消按钮
	$('.fn-close').click(function(){
		var obj=new dfgsWithdraw();
		obj.close();
		initBtn();
	});
};

// 检验验证码ajax
var withdrawVerify=function(obj){
	var code=obj.val().replace(/\ +/g,"");
	var tel = $('.userP').text();
	if(key==1){
	   tel = $('#txPhone').attr('data');	
	}
	$.ajax({
		type: "post",
		url: ctx+"/CheckVierifyCode/checkedCode",
		data: {
			yzmNumber: code,
			telephone:tel
		},
		success:function(data){
			eval("data="+data);
			if(data.code==200){
				if(key==0){
					var obj=new dfgsWithdraw();
					obj.show1();
					$('.modPhone').text($('.userP').text());
					key=3;
				}else if(key==1){
					var obj=new dfgsWithdraw();
					obj.show1();
					$('.modPhone').text($('#txPhone').attr('data'));
					key=4;
				}else if(key==2){
					var obj=new dfgsWithdraw();
					obj.show2(function(){
					$('#btns>button').remove();
						var buttons='<button class="ui-btn fn-pass">确定</button><button class="ui-btn fn-close">取消</button>';
						$('.pwdText').text('');
						$('#btns').html(buttons);
						btnBind();
						key=6;
					});
				}
				initBtn();
			}else if(data.code==201){
				$('#verifyNum').val('');
				win("验证码失效，请重新获取");
			}else if(data.code==203){
				$('#verifyNum').val('');
				win("请输入验证码");
			}else{
				$('#verifyNum').val('');
				win("验证码错误");
			}
		},
		error:function(){
			$('#verifyNum').val('');
			win("网络服务忙,请稍后重新发送···");
		}
	});
};
/**
*提交修改登陆账号 ajax
*/
function modUserPhoneSub(){
	var telephone = $('#newPhone').val(),
		authCode= $('.kzmg').val();
	$.ajax({
		url: ctx+"/personalCenter/updateUserName",
		type: "post",
		data: {
			authCode : authCode,
			telephone : telephone
		},
		success: function(data){
			eval('data='+data);
			if(data.code==200){
				$('#btns>button').remove();
				$('.pwdText').text('变更登录账号已成功！原有密码已失效，请重新设置账号密码。');
				var buttons='<button class="ui-btn fn-pass">确定</button>';
				var obj=new dfgsWithdraw();
				obj.show2();
				$('#btns').html(buttons);
				btnBind();
				key=5;
				initBtn();
			}else if(data.code==201){
				win(data.msg);
			}else if(data.code==202){
				win(data.msg);
			}else if(data.code==203){
				win(data.msg);
			}else if(data.code==204){
				win(data.msg);
			}else{
				win(data.msg);
				initBtn();
				$(".kzmg").val("");
			}
		},
		error: function(){

		}
	});
};
/**
*提交修改提现账号 ajax
*/
function modAccountSub(){
	 var telephone = $('#newPhone').val().replace(/\ +/g,"");
	 var authCode = $('.kzmg').val().replace(/\ +/g,"");
	$.ajax({
		url: ctx+"/personalCenter/updateAccountNumber",
		type: "post",
		data: {
			authCode : authCode,
			accountPhone : telephone
		},
		success: function(data){
			eval('data='+data);
			if(data.code==200){
				getUserName();
				var obj=new dfgsWithdraw();
				obj.close();
				win(data.msg);
				initBtn();
			}else if(data.code==201){
				win(data.msg);
			}else if(data.code==202){
				win(data.msg);
			}else if(data.code==203){
				win(data.msg);
			}else if(data.code==204){
				win(data.msg);
			}else{
				win(data.msg);
			}
		},
		error: function(){
		}
	});
};
/**
* 修改密码方法
*/
function updateUserPassWord(){
	var passWord = $('#newPwd').val().replace(/\ +/g,"");
	$.ajax({
		url: ctx+"/personalCenter/updateUserPassWord",
		type: "post",
		data: {
			passWord : passWord
		},
		success: function(data){
			eval('data='+data);
			if(data.code==200){
				var obj=new dfgsWithdraw();
				obj.close();
				win(data.msg);
				key=0;
				getUserName();
			}else if(data.code==201){
				win(data.msg);
			}else if(data.code==202){
				win(data.msg);
			}else if(data.code==203){
				win(data.msg);
			}
		}
	});
};
function updatePaaWord(){
	var passWord = $('#newPwd').val().replace(/\ +/g,"");
	var userName=$(".userP").html();
	$.ajax({
		url: ctx+"/personalCenter/updatePassWord",
		type: "post",
		data: {
			passWord : passWord,
			userName :userName
		},
		success: function(data){
			eval('data='+data);
			if(data.code==200){
				var obj=new dfgsWithdraw();
				obj.close();
				win('密码修改成功');
				key=0;
			}else if(data.code==203){
				win("请输入密码");
			}else if(data.code==201){
				win("该账号不存在");
			}else if(data.code==204){
				win("密码长度不能少于四位");
			}else{
				win("修改失败,请稍后重试");
			}
		}
	});
}
// 新增账号提交按钮ajax
function subajax(){
	var accountNames=$('#accountNames').val() != '' ? $('#accountNames').val() : $('#alAccountNames').val(),
		bankcarNums=$('#bankcarNums').val() != '' ? $('#bankcarNums').val() : $('#alipayNums').val(),
		bankDeposits=$('#bankDeposits').val(),
		branchNames=$('#branchNames').val();
		var telReg = /^(((13[0-9]{1})|(14[4-7]{1})|(15[0-9]{1})|(170)|(17[1-8]{1})|(18[0-9]{1}))+\d{8})$/;//验证手机号
		var mailReg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
		if( (bankDeposits == undefined || bankDeposits == '') && (branchNames == undefined || branchNames == '')){
			//若 bankDeposits 和 branchNames 都为空则视为支付宝账号
			if(!(telReg.test(bankcarNums) || mailReg.test(bankcarNums))){
				alert('请输入正确支付宝账号');
				return ;
			}
		}
		
		if(accountNames != '' && bankcarNums != ''){
			$.ajax({
				url: ctx+"/withDraw/insertBankInfo",
				type: "post",
				data:{
					accountNames:accountNames,
					bankcarNums:bankcarNums,
					bankDeposits:branchNames,
					branchNames:bankDeposits
				},
				success: function(data){
					eval('data='+data);
					if (data.code==200) {
						var obj=new dfgsWithdraw();
						obj.close();
						getUserWithdrawInfo();
						clear();
					}else{
						win("保存失败 系统繁忙，请稍后再试！",2500);
					};
		      	},
		      	error: function(){

		      	}
			});
		}else{
			alert("请正确输入信息");
		}
	
}
// 选择银行卡删除按钮ajax
//选择银行卡删除按钮ajax
var deleteBankCard=function(n){
	$.ajax({
		url: ctx+"/withDraw/deleteBankInfo",
		type: "POST",
		 data:{
			 id:n
		 },
		success: function(data){
			eval('data='+data);
			if(data.code==200){
				getUserWithdrawInfo();
			}else{
				win("删除失败",2500);
			}
		},
		error: function(){
			win("系统繁忙请稍后再试！",2500);
		}
	});
};


// 自定义银行卡号validate
jQuery.validator.addMethod("bank", function(value, element) { 
    return this.optional(element) || luhmCheck(value);
}, "请输入正确的银行卡号");

// validate 新增账号校验
var newAddCardName =$("#newAddCardName").validate({
	
	errorPlacement : function(error, element) {
		
		//$(".error").html("");
			error.css({
			}).appendTo(element.next().addClass("error"));
		},
	submitHandler : function(form) {
		//提交表单
		subajax();
	},
	rules : {
		accountNames: {
			required:true,
			maxlength:25
		},
		bankcarNums: {
			required:true,
			digits:true,
			rangelength:[16,19],
			bank:true,
			remote:{
				type: "post",               //数据发送方式
			    url: ctx+"/withDraw/isHaveBank",     //后台处理程序
			    data: {                     //要传递的数据
			    	bankcarNums: function() {
			            return $("#bankcarNums").val();
			        }
			    }
			}
		},
		branchNames: {
			required:true,
			minlength:4
		}
	},
	messages : {
		accountNames: {
			required:'请输入收款账号名称',
			maxlength:'收款账号名称不能大于25个字符'
		},
		bankcarNums: {
			required:'请输入银行卡号',
			digits:'只能输入数字',
			rangelength:'请输入正确的卡号位数',
			bank:'请输入正确的银行卡号',
			remote: '该银行卡号已存在'
		},
		branchNames: {
			required:'请输入开户行支行名称',
			minlength:'支行名称不能少于4个字符'
		}
	}
});
$("#bankcarNums").change(function(){
	$("#bankcarNums").removeData("previousValue");
	}); 

//验证银行卡号
function luhmCheck(bankno){
    var lastNum=bankno.substr(bankno.length-1,1);//取出最后一位（与luhm进行比较）
 
    var first15Num=bankno.substr(0,bankno.length-1);//前15或18位
    var newArr=new Array();
    for(var i=first15Num.length-1;i>-1;i--){    //前15或18位倒序存进数组
        newArr.push(first15Num.substr(i,1));
    }
    var arrJiShu=new Array();  //奇数位*2的积 <9
    var arrJiShu2=new Array(); //奇数位*2的积 >9
     
    var arrOuShu=new Array();  //偶数位数组
    for(var j=0;j<newArr.length;j++){
        if((j+1)%2==1){//奇数位
            if(parseInt(newArr[j])*2<9)
            arrJiShu.push(parseInt(newArr[j])*2);
            else
            arrJiShu2.push(parseInt(newArr[j])*2);
        }
        else //偶数位
        arrOuShu.push(newArr[j]);
    }
     
    var jishu_child1=new Array();//奇数位*2 >9 的分割之后的数组个位数
    var jishu_child2=new Array();//奇数位*2 >9 的分割之后的数组十位数
    for(var h=0;h<arrJiShu2.length;h++){
        jishu_child1.push(parseInt(arrJiShu2[h])%10);
        jishu_child2.push(parseInt(arrJiShu2[h])/10);
    }        
     
    var sumJiShu=0; //奇数位*2 < 9 的数组之和
    var sumOuShu=0; //偶数位数组之和
    var sumJiShuChild1=0; //奇数位*2 >9 的分割之后的数组个位数之和
    var sumJiShuChild2=0; //奇数位*2 >9 的分割之后的数组十位数之和
    var sumTotal=0;
    for(var m=0;m<arrJiShu.length;m++){
        sumJiShu=sumJiShu+parseInt(arrJiShu[m]);
    }
     
    for(var n=0;n<arrOuShu.length;n++){
        sumOuShu=sumOuShu+parseInt(arrOuShu[n]);
    }
     
    for(var p=0;p<jishu_child1.length;p++){
        sumJiShuChild1=sumJiShuChild1+parseInt(jishu_child1[p]);
        sumJiShuChild2=sumJiShuChild2+parseInt(jishu_child2[p]);
    }      
    //计算总和
    sumTotal=parseInt(sumJiShu)+parseInt(sumOuShu)+parseInt(sumJiShuChild1)+parseInt(sumJiShuChild2);
     
    //计算Luhm值
    var k= parseInt(sumTotal)%10==0?10:parseInt(sumTotal)%10;        
    var luhm= 10-k;
     
    if(lastNum==luhm){
    	return true;
    }
    else{
    	return false;
    }        
}

// 显示提示信息
var win=function(str,num){
	$('.win > span').text(str);
	var disappearTime=parseInt(str.length/3)*500+1000;
	$('.win').css('display','block').fadeOut(num==null?disappearTime:num);
};

// 清空已输入的数据

var clear=function(){
	$('.mask input').val("");
//	$('#accountNames').val("");
//	$('#bankcarNums').val("");
//	$('#bankDeposits').val("工商银行");
//	$('#branchNames').val("");
//	$('#moneyGeg').val("");
//	$('#verifyNum').val("");
//	$('#newPwd').val("");
}
/**
*根据银行卡号获取发卡行名称
*/
var getBankName = function (bankCard) {
            if (bankCard == null || bankCard == "") {
                return "";
            }
            $.ajax({
            	url: ctx+"/allstyle/newEditionSkin/js/withdraw/bankData.json",
            	type: "post",
				dataType: "json",
            	success: function(data){
            		
            		var bankBin = 0;
		            var isFind = false;
		            for (var key = 10; key >= 2; key--) {
		                bankBin = bankCard.substring(0, key);
		                $.each(data, function (i, item) {
		                    if (item.bin == bankBin) {
		                        isFind = true;
		                        $('#bankDeposits').val(item.bankName);
		                    }
		                });
		            }
		            if (!isFind) {
		                win("未知发卡银行,请输入发卡银行名称");
		            }
            	},
            	error: function(){
            		 win("网络服务忙,请稍后再试····");
            	}
            });
        }