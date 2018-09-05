/**
 * 提现模块
 */
var phones = /^(((13[0-9]{1})|(14[4-7]{1})|(15[0-9]{1})|(170)|(17[6-8]{1})|(18[0-9]{1}))+\d{8})$/;// 手机号码
var numberMoney=/^[1-9]{1,1}\d{0,9}$/;//钱^[1-9]\d*$
var code=/^\d{4,4}$/;
var phoneOrEmail =/^(((13[0-9]{1})|(14[4-7]{1})|(15[0-9]{1})|(170)|(17[6-8]{1})|(18[0-9]{1}))+\d{8})$|(^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$)/;//邮箱或手机号

var x = 60;
$(function() {
	loadBank();
	loadMent();
	// 左侧菜单中，用户中心选中
	$("#personal").addClass("active");

	// 初始化单选按钮
	$('[data-toggle="radio"]').radiocheck();

	// 初始化按钮下拉
	$('.dropdown-toggle').dropdown();

	// 点击"提现记录"链接，执行事件
	$(".toWithdrawRecordBtn").click(function() {
		location.href = "../personal/goPersonal/1";
	});

	// --------------------------------▼提现到银行卡▼------------------------------------------------------//

	// 鼠标移上，显示提示信息
	$('.tooltipMsg').tooltip("hide");

	// 提现到银行卡模块中，第二步中，“返回修改”按钮click事件
	$(".toBankMentStep1Btn").click(function() {
		$("#bank_step2").hide();
		$("#bank_step1").show();
	});
	
	// --------------------------------▲体现到银行卡▲------------------------------------------------------//


	// 提现到支付宝模块中，填写完账号信息之后，“下一步”按钮click事件
	$(".toPayMentStep2Btn").click(function() {
		$("#ment_step1").hide();
		$("#ment_step2").show();
	});

	// 提现到支付宝模块中，第二步中，“返回修改”按钮click事件
	$(".toPayMentStep1Btn").click(function() {
		$("#ment_step1").show();
		$("#ment_step2").hide();
	});
	// 验证码--绑定银行卡
	$("#btn_sms").on("click", function() {
		$("#bankForm").submit();// 开启验证
		if (phones.test($("#telephone").val()) && $("#telephone").val() != "") {
			// $("#div_tell").empty();
			// $("#div_tell").html('<input type="text" class="input-large"
			// id="telephone" name="telephone" placeholder="请输入手机号" />');
			$.ajax({
				type : "POST",
				url : "sendBankPhoneCode",
				data : {
					tel : $("#telephone").val()
				},
				success : function(msg) {
					if(msg=="true"){
						// 倒计时
						$("#btn_sms").attr("disabled", "disabled");
						mytimer = setInterval("timer()", 1000);
					}else{
						alert("发送失败，请核对您填写的手机号。");
					} 
				}
			});
		}
	});

	// 验证码--修改卡信息
	$("#btn_sms_edit").on( "click",
			function() {
				$("#editBankForm").submit();// 开启验证
				if (phones.test($("#telFromBack").attr("name"))
						&& $("#telFromBack").attr("name") != "") {
					$.ajax({
						type : "POST",
						url : "sendBankPhoneCode",
						data : {
							tel : $("#telFromBack").attr("name")
						},
						success : function(msg) {
							if(msg=="true"){
								// 倒计时
								$("#btn_sms_edit").attr("disabled", "disabled");
								mytimer = setInterval("timer1()", 1000);
							}else{
								alert("发送失败，请核对您填写的手机号。");
							} 
						}
					});
				} else {
					toastr.error('网络通讯故障，未获得绑定手机，刷新后重试！');
				}
			});
	// 验证码--银行卡修改手机 $("#btn_phone_edit").on
	$("#btn_phone_edit").on("click", function() {
		if ($("#telFromBack").attr("name") == "") {
			return;
		} else {
			$.ajax({
				type : "POST",
				url : "sendBankPhoneCode",
				data : {
					tel : $("#telFromBack").attr("name")
				},
				success : function(msg) {
					if(msg=="true"){
						// 倒计时
						$("#btn_phone_edit").attr("disabled", "disabled");
						mytimer = setInterval("timer2()", 1000);
					}else{
						alert("发送失败，请核对您填写的手机号。");
					} 
				}
			});
		}
	});
	// 验证码--支付宝修改手机 $("#btn_phone_edit").on
	$("#ment_btn_phone_edit").on("click", function() {
		alert(1);
		if ($("#telFromBack").attr("name") == "") {
			return;
		} else {
			$.ajax({
				type : "POST",
				url : "sendBankPhoneCode",
				data : {
					tel : $("#telFromBack").attr("name")
				},
				success : function(msg) {
					if(msg=="true"){
						// 倒计时
						$("#ment_btn_phone_edit").attr("disabled", "disabled");
						mytimer = setInterval("timer6()", 1000);
					}else{
						alert("发送失败，请核对您填写的手机号。");
					} 
				}
			});
		}
	});
	// 验证码--确认提现
	$("#sms_Yes_btn").on("click", function() {
		var tel=$("#sms_money_confirm").attr("name");
		if (!phones.test(tel)) {
			toastr.error("手机号码缺失，请先绑定手机号");
			return;
		} else {
			$("#sms_msg").removeAttr("style");
			$.ajax({
				type : "POST",
				url : "sendBankPhoneCode",
				data : {
					tel : tel
				},
				success : function(msg) {
					if(msg=="true"){
						// 倒计时
						$("#sms_Yes_btn").attr("disabled", "disabled");
						mytimer = setInterval("timer3()", 1000);
					}else{
						alert("发送失败，请核对您填写的手机号。");
					} 
				}
			});
		}
	});
	
	$("#money").on("keyup",function(){
		
		if(!numberMoney.test($("#money").val())){
			$("#money_errormsg").html("请输入整数金额,不超过1,000,000,000");
		}else
			$("#money_errormsg").html("");
	});
	
	$("#edit_money").on("keyup",function(){
		
		if(!numberMoney.test($("#edit_money").val())){
			$("#money_errormsg1").html("请输入整数金额,不超过1,000,000,000");
		}else
			$("#money_errormsg1").html("");
	});
	
	
	// 下一步前，后台金额验证--银行卡
	$("#toPayBankStep2Btn").on("click", function() {
		var rmb = 0;
		rmb = $("#money").val();
		if(!numberMoney.test($("#money").val()))return;
		$.ajax({
			type : "POST",
			url : "checkMoney",
			data : {
				money : rmb,
				type : 1
			},
			success : function(data) {

				eval("data = " + data);
				if (data.code ==200) {
					$("#getMoney").html(Number(data.data.money));// 提现金额
					$("#getMoney_poundage").html(Number(data.data.poundage));// 手续费mouse_acount
					$("#mouse_acount").html(Number(data.data.poundage) + Number(data.data.money));// 扣款总额
					$("#leftMoney").html(Number(data.data.leftMoney));// 余额
					$("#money_errormsg").html();
					$("#bank_step1").hide();
					$("#bank_step2").show();
				} else {
					toastr.error(data.msg);
				}
			},
			error : function() {
				toastr.error('网络通信故障，请稍后重试！');
			}
		});
	});
	// 下一步前，金额验证--支付宝
	$("#toPayMentStep2Btn").on("click", function() {
		var rmb = 0;
		rmb = $("#edit_money").val();
		$.ajax({
			type : "POST",
			url : "../personal/gg",
			data : {
				money : rmb
			},
			success : function(data) {
				// eval("data = " + data);
				$("#ment_step1").hide();
				$("#ment_step2").show();
				// if (data[0].msg == "true") {
				// $("#edit_ment_getMoney").html(data[0].money);//提现金额
				// $("#edit_ment_getMoney_poundage").html(data[0].poundage);//手续费mouse_acount
				// $("#edit_ment_mouse_acount").html(data[0].poundage+data[0].money);//扣款总额
				// $("#edit_ment_leftMoney").html(data[0].leftMoney);//余额
				// $("#edit_ment_money_errormsg").html();
				// $("#bank_step1").hide();
				// $("#bank_step2").show();
				// } else {
				// $("#money_errormsg1").html(data[0].msg);
				// }
			},
			error : function() {
				toastr.error('网络通信故障，请稍后重试！');
			}
		});
	});
	// 验证码--绑定支付宝
	$("#btn_sms_ment").on(
			"click",
			function() {
				$("#mentForm").submit();// 开启验证
				if (phones.test($("#ment_telephone").val())
						&& $("#ment_telephone").val() != "") {

					$.ajax({
						type : "POST",
						url : "sendBankPhoneCode",
						data : {
							tel : $("#ment_telephone").val()
						},
						success : function(msg) {
							if(msg=="true"){
								// 倒计时
								$("#btn_sms_ment").attr("disabled", "disabled");
								mytimer = setInterval("timer4()", 1000);
							}else{
								alert("发送失败，请核对您填写的手机号。");
							}
							
						}
					});
				}
			});
	// 验证码--修改支付宝
	$("#btn_sms_ment_edit").on(
			"click",
			function() {
				$("#editmentForm").submit();// 开启验证
				if (phones.test($("#edit_ment_telephone").val())
						&& $("#edit_ment_telephone").val() != "") {

					$.ajax({
						type : "POST",
						url : "sendBankPhoneCode",
						data : {
							tel : $("#edit_ment_telephone").val()
						},
						success : function(msg) {
							if(msg=="true"){
								// 倒计时
								$("#btn_sms_ment_edit")
										.attr("disabled", "disabled");
								mytimer = setInterval("timer5()", 1000);
							}else{
								alert("发送失败，请核对您填写的手机号。");
							}
						}
					});
				}
			});
	// --------------------------------▲体现到支付宝▲------------------------------------------------------//

});

// 获取银行卡信息
function loadBank() {
	$
			.ajax({
				type : "POST",
				url : "../Account/BankInfo",
				data : {
					type : "1"
				},
				success : function(data) {
					//eval("data = " + data);
					if (data!="no") {
						eval("data = " + data);
						// 提现到银行卡
						// 初始化提现确认部分数据
						$("#BankRealname").html(data.realName);
						$("#bank_imgForYes").attr(
								"src",
								curPath+"/img/pay/bank/b"
										+ data.bankType + ".png");
						$("#bank_cardForYes").html(
								"（**** **** ****"
										+ data.cardNum.substring(12) + ")");
						$("#sms_money_confirm").attr("name", data.telephone);
						$("#sms_money_confirm").html(
								data.telephone.substring(0, 3) + "****"
										+ data.telephone.substring(7));
						// 初始化修改银行卡页面数据
						$("#editNameInput").val(data.realName);
						$("#address_edit").val(data.bankAdress);
						$("#sel_edit").val(data.bankType);
						$("#editCardInput").val(data.cardNum);
						$("#telFromBack").attr("name", data.telephone);
						$("#telFromBack").html(
								data.telephone.substring(0, 3) + "****"
										+ data.telephone.substring(7));
						// 初始化提现首页面数据
						var lastnum = data.cardNum + "";
						var lastnum1 = lastnum.substring(lastnum.length - 4);
						$("#theBank").html(
								'<img  src="'+curPath+'/img/pay/bank/b'+ data.bankType+ '.png">&nbsp;&nbsp;&nbsp;&nbsp;尾号：'+ lastnum1 + '<a href="javascript:void(0); "id="bank_editBtn" bc_id="'+data.id+'" onclick="showEditBank()">修改</a>');

					} else {
						$("#theBank")
								.html(
										'<a href="javascript:void(0);" id="doAddbank" onclick="showAddBank();"><i class="icon-plus"></i>绑定银行卡</a>');
					}
				},
				error : function() {
					$("#doAddbank").html('银行卡信息加载失败，刷新重试！');
				}
			});
}
// 获取支付宝信息
function loadMent() {
	$
			.ajax({
				type : "POST",
				url : "../Account/BankInfo",
				data : {
					type : "2"
				},
				success : function(data) {
					//eval("data = " + data);
					if (data!="no") {
						// 提现到银行卡
						$("#mentInfo")
						.html(
								data.cardNum+'<a href="javascript:void(0);" onclick="showEditMent()">修改</a>');
						// 初始化提现确认部分数据
						
						$("#ment_num").html(data.cardNum);
						$("#ment_realName").html("{备注] 姓名 "+data.realName);

					} else {
						$("#mentInfo")
								.html(
										'<a href="javascript:void(0);" id="doAddment" onclick="showAddMent()"><i class="icon-plus"></i>绑定支付宝</a>');
					}
				},
				error : function() {
					$("#mentInfo").html('支付宝账户信息加载失败，刷新重试！');
				}
			});
}
// 自定义1
jQuery.validator.addMethod("selBank", function() {
	if ($("#selbank").val() == "-1") {
		return false;
	} else {
		return true;
	}
});
//自定义1
jQuery.validator.addMethod("sel_edit", function() {
	if ($("#sel_edit").val() == "-1") {
		return false;
	} else {
		return true;
	}
});
// 自定义2
jQuery.validator.addMethod("valPhone", function() {
	if (phones.test($("#telephone").val())) {
		return true;
	} else {
		return false;
	}
});
//自定义3
jQuery.validator.addMethod("humanName", function() {
	var humanNames=/^[\u4E00-\u9FA5A-Za-z]+$/;
	return humanNames.test($("#firstname").val());
});
//自定义3
jQuery.validator.addMethod("humanName2", function() {
	var humanNames=/^[\u4E00-\u9FA5A-Za-z]+$/;
	return humanNames.test($("#editNameInput").val());
});

//自定义4
jQuery.validator.addMethod("addressCheck", function() {
	var addressChecks=/^[\u4E00-\u9FA5A-Za-z0-9]+$/;
	return addressChecks.test($("#bankaddress").val());
});
//自定义4
jQuery.validator.addMethod("addressCheck2", function() {
	var addressChecks=/^[\u4E00-\u9FA5A-Za-z0-9]+$/;
	return addressChecks.test($("#address_edit").val());
});


// 绑定银行卡 验证

var savebank = $("#bankForm").validate({
	submitHandler : function(form) {
		// 提交保存
		//showLoading2("保存中...");
		$.ajax({
			type : "post",
			url : "saveBankCard",
			data : {
				realName : $("#firstname").val(),
				bankAddress : $("#bankaddress").val(),
				bankType : $("#selbank").val(),
				cardNum : $("#cardNum").val(),
				telephone : $("#telephone").val(),
				smscode : $("#smscode").val()
			},
			success : function(data) {
				eval("data = " + data);
				if (data.code == 200) {
					toastr.success("银行卡绑定成功！");
					$('#addBankModal').modal("hide");// 关闭弹出层
					closes();// 重置表单
				}else{
					toastr.error(data.msg);
				}
			},
			error : function() {
				toastr.error('银行卡绑定失败！请稍后再试。');
			}
		});
		
	},
	errorPlacement : function(error, element) {
		// 错误提示样式,在下方提示
		$('<br/>').appendTo(element.parent()); // 有这句就在下方提示错误信息
		error.css({
			display : "inline",
			color : "#F00",
			position : "relative",
		}).appendTo(element.parent().addClass("error"));
	},
	rules : {
		firstname : {
			required : true,
			rangelength:[2,16],
			humanName:true
		},
		bankaddress : {
			required : true,
			rangelength : [5,50],
			addressCheck:true
		},
		cardNum : {
			required : true,
			digits : true,
			rangelength : [12,19]
		},
		selbank : {
			selBank : true
		},
		telephone : {
			required : true,
			valPhone : true
		},
		smscode : {
			required : true,
			digits:true,
			rangelength:[4,4],
			remote : {
				url : "checkSmsCode", // 后台处理程序
				type : "POST", // 数据发送方式
				data : {
					smscode : function() {return $("#smscode").val();}
				}
			}
		}
	},
	messages : {
		firstname : {
			required : "请填写开户人真实姓名",
			rangelength : "输入名称长度请控制在2~16字以内",
			humanName:"请输入中英文字符"
		},
		bankaddress : {
			required : "请填写开户行地址",
			rangelength : "输入地址长度请控制在5~50字以内",
			addressCheck:"请输入中英文字符或数字"
		},
		cardNum : {
			required : "请输入银行卡号",
			digits : "银行卡号必须为数字",
			rangelength : "银行卡卡号长度为12~19位"
		},
		selbank : {
			selBank : "请选择银行"
		},
		telephone : {
			required : "请输入手机号",
			valPhone : "手机号格式有误"
		},
		smscode : {
			required : "请输入验证码",
			digits:"验证码为4位数字",
			rangelength:"验证码为4位数字",
			remote : "验证码输入有误，请重新输入"
		}
	}
});

// 提交按钮
function addBankSubmit() {
	$("#bankForm").submit();
}
function closes() {
	// 关闭弹出层，重置表单
	$("#bankForm")[0].reset();// 重置表单
	savebank.resetForm();
}
// 倒计时
function timer() {

	x = x - 1;

	$("#btn_sms").html(x + "秒后重新发送");
	if (x < 1) {
		x = 60;
		$("#btn_sms").html("获取手机验证码");
		$("#btn_sms").removeAttr("disabled");
		clearTimeout(mytimer);
	}

}

// 修改银行卡 验证

var editbank = $("#editBankForm").validate({
	submitHandler : function(form) {
		
		// 提交保存
		//showLoading2("保存中...");
		var bc_id=$("#bank_editBtn").attr("bc_id");
		$.ajax({
			type : "POST",
			url : "updateBankCard",
			data : {
				realName : $("#editNameInput").val(),
				bankAddress : $("#address_edit").val(),
				bankType : $("#sel_edit").val(),
				cardNum : $("#editCardInput").val(),
				smscode : $("#smscode").val(),
				id : bc_id
			},
			success : function(data) {
//				if (data == "true") {
//					toastr.success("银行卡修改成功！");
//					$('#EditBankModal').modal("hide");// 关闭弹出层
//					closes();// 重置表单
//				}
				eval("data = " + data);
				if (data.code == 200) {
					toastr.success("银行卡修改成功！");
					$('#EditBankModal').modal("hide");// 关闭弹出层
					loadBank();//重新加载
					closes();// 重置表单
				}else{
					toastr.error(data.msg);
				}
			},
			error : function() {
				toastr.error('银行卡修改失败！请稍后再试。');
			}
		});
	},
	errorPlacement : function(error, element) {
		// 错误提示样式,在下方提示
		$('<br/>').appendTo(element.parent()); // 有这句就在下方提示错误信息
		error.css({
			display : "inline",
			color : "#F00",
			position : "relative",
		}).appendTo(element.parent().addClass("error"));
	},
	rules : {
		editNameInput : {
			required : true,
			rangelength:[2,16],
			humanName2:true
		},
		address_edit : {
			required : true,
			rangelength : [5,50],
			addressCheck2:true
		},
		editCardInput : {
			required : true,
			digits : true,
			rangelength : [12,19]
		},
		sel_edit : {
			sel_edit : true
		},
		smscode_edit : {
			required : true,
			digits:true,
			rangelength:[4,4],
			remote : {
				url : "checkSmsCode", // 后台处理程序
				type : "POST", // 数据发送方式
				data : {
					smscode : function() {return $("#smscode_edit").val();}
				}
			}
		}
	},
	messages : {
		editNameInput : {
			required : "请填写开户人真实姓名",
			rangelength : "输入名称长度请控制在2~16字以内",
			humanName2:"请输入中英文字符"
		},
		address_edit : {
			required : "请填写开户行地址",
			rangelength : "输入地址长度请控制在5~50字以内",
			addressCheck2:"请输入中英文字符或数字"
		},
		editCardInput : {
			required : "请输入银行卡号",
			digits : "银行卡号必须为数字",
			rangelength : "银行卡卡号长度为12~19位"
		},
		sel_edit : {
			sel_edit : "请选择银s行"
		},
		smscode_edit : {
			required : "请输入验证码",
			digits:"验证码为4位数字",
			rangelength:"验证码为4位数字",
			remote : "验证码输入有误，请重新输入"
		}
	}
});

// 提交按钮
function editBankSubmit() {
	$("#editBankForm").submit();
}
function closes1() {
	// 关闭弹出层，重置表单
	$("#editBankForm")[0].reset();// 重置表单
	savebank.resetForm();
}
// 倒计时
function timer1() {

	x = x - 1;

	$("#btn_sms_edit").html(x + "秒后重新发送");
	if (x < 1) {
		x = 60;
		$("#btn_sms_edit").html("获取手机验证码");
		$("#btn_sms_edit").removeAttr("disabled");
		clearTimeout(mytimer);
	}

}
// 修改绑定手机
function changePhone() {
	$('#EditBankModal').modal("hide");// 关闭弹出层
	$('#changePhone').modal();
	var telephone=$("#telFromBack").attr("name");
	$("#tel_last").html(telephone.substring(0, 3) + "****" + telephone.substring(7));
}
// 倒计时
function timer2() {

	x = x - 1;

	$("#btn_phone_edit").html(x + "秒后重新发送");
	if (x < 1) {
		x = 60;
		$("#btn_phone_edit").html("获取手机验证码");
		$("#btn_phone_edit").removeAttr("disabled");
		clearTimeout(mytimer);
	}

}
function timer6() {

	x = x - 1;

	$("#ment_btn_phone_edit").html(x + "秒后重新发送");
	if (x < 1) {
		x = 60;
		$("#ment_btn_phone_edit").html("获取手机验证码");
		$("#ment_btn_phone_edit").removeAttr("disabled");
		clearTimeout(mytimer);
	}

}
// 更换绑定手机
function savenewphone() {
	if (phones.test($("#newPhone").val()) && $("#newPhone").val() != "") {
		// 通知后台修改
		$.ajax({
			type : "POST",
			url : "changeTelePhone",
			data : {
				type:1,
				tel : $("#newPhone").val()
			},
			success : function(data) {
				eval("data = " + data);
				if (data.code==200) {
					toastr.success("新手机绑定成功！");
				}
			},
			error : function() {
				toastr.error('新手机绑定失败！请稍后再试。');
			}
		});
		// 重置页面
		loadBank();
		$("#editphoneForm")[0].reset();
		$("#controls_phone_edit").empty();
		$("#controls_phone_edit")
				.html(
						'<input type="text" class="input-large" id="newPhone" name="newPhone" placeholder="请输入新手机号"/>');
		$('#changePhone').modal("hide");// 关闭弹出层
	} else {
		$("#controls_phone_edit").empty();
		$("#controls_phone_edit")
				.html(
						'<input type="text" class="input-large" id="newPhone" name="newPhone" placeholder="请输入新手机号"/>');
		var x = $("<br/>").appendTo($("#controls_phone_edit"));
		var y = $("<span/>").css({
			display : "inline",
			color : "#F00",
			position : "relative"
		}).html("手机号输入有误").appendTo($("#controls_phone_edit"));
	}
}

// 倒计时
function timer3() {

	x = x - 1;

	$("#sms_Yes_btn").html(x + "秒后重新发送");
	if (x < 1) {
		x = 60;
		$("#sms_Yes_btn").html("获取手机验证码");
		$("#sms_Yes_btn").removeAttr("disabled");
		clearTimeout(mytimer);
	}

}

// 确认提现
function Confirm_the_present() {
	
	if (code.test($("#sms_code_YesConfirm").val())) {
		$("#sms_YesComfirm_errormsg").html("");
		$.ajax({
			type : "POST",
			url : "",
			data : {
				smsCode : $("#sms_code_YesConfirm").val()
			},
			success : function(msg) {
				if (msg == "true") {
					toastr.success("已成功提交提现申请，请随时注意您的账号余额变化。");
					location.href = "../personal/goPersonal/1";
				} else {
					toastr.error(data.msg);
				}
			},
			error : function() {
				toastr.error('提现申请提交失败，请稍后重试。');
			}
		});
	} else {
		$("#sms_YesComfirm_errormsg").html("请输入四位短信验证码！");
	}
}

// 绑定支付宝 验证
// 自定义1
jQuery.validator.addMethod("valPhone1", function() {
	if (phones.test($("#ment_telephone").val())) {
		return true;
	} else {
		return false;
	}
});

jQuery.validator.addMethod("ment_id", function() {
	return phoneOrEmail.test($("#ment_id").val());
});

jQuery.validator.addMethod("ment_firstname", function() {
	var humanNames=/^[\u4E00-\u9FA5A-Za-z]+$/;
	return humanNames.test($("#ment_firstname").val());
});

jQuery.validator.addMethod("ment_telephone", function() {
	return phones.test($("#ment_telephone").val());
});

var savement = $("#mentForm").validate({
	submitHandler : function(form) {
		
		// 提交保存
		//showLoading2("保存中...");
		$.ajax({
			type : "POST",
			url : "",
			data : {
				realName : $("#ment_firstname").val(),
				mentId : $("#ment_id").val(),
				phoneNum : $("#ment_telephone").val(),
				smscode : $("#ment_smscode").val()
			},
			success : function(data) {
				if (data == "true") {
					toastr.success("支付宝绑定成功！");
					$('#addmentModal').modal("hide");// 关闭弹出层
					closesOFment();// 重置表单
				}
			},
			error : function() {
				toastr.error('支付宝绑定失败！请稍后再试。');
			}
		});
	},
	errorPlacement : function(error, element) {
		// 错误提示样式,在下方提示
		$('<br/>').appendTo(element.parent()); // 有这句就在下方提示错误信息
		error.css({
			display : "inline",
			color : "#F00",
			position : "relative",
		}).appendTo(element.parent().addClass("error"));
	},
	rules : {
		ment_firstname : {
			required : true,
			rangelength:[2,16],
			ment_firstname:true
		},
		ment_id : {
			required : true,
			ment_id : true
		},
		ment_telephone : {
			required : true,
			ment_telephone : true
		},
		ment_smscode : {
			required : true,
			digits:true,
			rangelength:[4,4],
			remote : {
				url : "checkSmsCode", // 后台处理程序
				type : "POST", // 数据发送方式
				data : {
					smscode : function() {return $("#ment_smscode").val();}
				}
			}
		}
	},
	messages : {
		ment_firstname : {
			required : "请填写开户人真实姓名",
			rangelength : "输入名称长度请控制在2~16字以内",
			ment_firstname:"请输入中英文字符"
		},
		ment_id : {
			required : "请填写支付宝账号",
			ment_id : "支付宝账号为手机号或邮箱"
		},
		ment_telephone : {
			required : "请输入手机号",
			ment_telephone : "手机号格式有误"
		},
		ment_smscode : {
			required : "请输入验证码",
			digits:"验证码为4位数字",
			rangelength:"验证码为4位数字",
			remote : "验证码输入有误，请重新输入"
		}
	}
});

// 提交按钮
function addmentSubmit() {
	$("#mentForm").submit();
}
function closesOFment() {
	// 关闭弹出层，重置表单
	$("#mentForm")[0].reset();// 重置表单
	savement.resetForm();
}
// 倒计时
function timer4() {

	x = x - 1;

	$("#btn_sms_ment").html(x + "秒后重新发送");
	if (x < 1) {
		x = 60;
		$("#btn_sms_ment").html("获取手机验证码");
		$("#btn_sms_ment").removeAttr("disabled");
		clearTimeout(mytimer);
	}

}
// 验证--修改支付宝信息
// 自定义1
jQuery.validator.addMethod("valPhone2", function() {
	if (phones.test($("#edit_ment_telephone").val())) {
		return true;
	} else {
		return false;
	}
});
var editment = $("#editmentForm").validate({
	submitHandler : function(form) {
		
		// 提交保存
		//showLoading2("保存中...");
		$.ajax({
			type : "POST",
			url : "",
			data : {
				realName : $("#edit_ment_firstname").val(),
				mentId : $("#edit_ment_id").val(),
				phoneNum : $("#edit_ment_telephone").val(),
				smscode : $("#edit_ment_smscode").val()
			},
			success : function(data) {
				if (data == "true") {
					toastr.success("支付宝绑定成功！");
					$('#editmentModal').modal("hide");// 关闭弹出层
					closesOFment();// 重置表单
				}
			},
			error : function() {
				toastr.error('支付宝绑定失败！请稍后再试。');
			}
		});
	},
	errorPlacement : function(error, element) {
		// 错误提示样式,在下方提示
		$('<br/>').appendTo(element.parent()); // 有这句就在下方提示错误信息
		error.css({
			display : "inline",
			color : "#F00",
			position : "relative",
		}).appendTo(element.parent().addClass("error"));
	},
	rules : {
		edit_ment_firstname : {
			required : true,
			maxlength : 16
		},
		edit_ment_id : {
			required : true,
			maxlength : 20
		},
		edit_ment_telephone : {
			required : true,
			valPhone2 : true
		},
		edit_ment_smscode : {
			required : true,
			remote : {
				url : "checkSmsCode", // 后台处理程序
				type : "POST", // 数据发送方式
				data : {
					smscode : $("#edit_ment_smscode").val()
				}
			}
		}
	},
	messages : {
		edit_ment_firstname : {
			required : "请填写开户人真实姓名",
			maxlength : "输入名称过长，请控制是16字以内"
		},
		edit_ment_id : {
			required : "请填写支付宝账号",
			maxlength : "输入账号过长，请检查后重新输入"
		},
		edit_ment_telephone : {
			required : "请输入手机号",
			valPhone2 : "手机号格式有误"
		},
		edit_ment_smscode : {
			required : "请输入验证码",
			remote : "验证码输入有误，请重新输入"
		}
	}
});

// 提交按钮
function editmentSubmit() {
	$("#editmentForm").submit();
}
function closesOFeditment() {
	// 关闭弹出层，重置表单
	$("#editmentForm")[0].reset();// 重置表单
	editment.resetForm();
}
// 倒计时
function timer5() {

	x = x - 1;

	$("#btn_sms_ment_edit").html(x + "秒后重新发送");
	if (x < 1) {
		x = 60;
		$("#btn_sms_ment_edit").html("获取手机验证码");
		$("#btn_sms_ment_edit").removeAttr("disabled");
		clearTimeout(mytimer);
	}

}

//修改支付宝绑定手机
function ment_changePhone() {
	$('#editmentModal').modal("hide");// 关闭弹出层
	$('#ment_changePhone').modal();
}

//打开新增银行卡页面
function showAddBank(){
	$("#addBankModal").modal();
}
//打开修改银行卡页面
function showEditBank(){
	$("#EditBankModal").modal();
}
//打开修改支付宝页面
function showEditMent(){
	$("#editmentModal").modal();
}
//打开新增支付宝页面
function showAddMent(){
	$("#addmentModal").modal();	
}