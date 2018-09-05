/**
 * 登录js
 */
//定义一个防止重复提交的全局变量
var flag=false;
// =====默认获取验证码==开始===
var img = document.getElementById("img");
// img.src = 'http://login.solarsys.cn/UserPrj/code.yzmImage.jpg?id='+
// Math.random();
img.src = ctx+'/CheckVierifyCode/createCode?id=' + Math.random();
// =====默认获取验证码==结束===
/**
 * 重新获取验证码图片
 */

$(function() {
	readCookies();
});

function changeImg() {
	var img = document.getElementById("img");
	// img.src = 'http://login.solarsys.cn/UserPrj/code.yzmImage.jpg?id='+
	// Math.random();
	img.src = ctx+'/CheckVierifyCode/createCode?id='
			+ Math.random();
}

function changeForFindPwd() {
	var img = document.getElementById("findPwdImg");
	// img.src = 'http://login.solarsys.cn/UserPrj/code.yzmImage.jpg?id='+
	// Math.random();
	img.src = 'http://v3.solarsys.cn/UserPrj/code.yzmImage.jpg?id='
			+ Math.random();
}
var emailAlertText;
var emailType = [ "@qq", "@aliyun", "@163", "@126", "@sina", "@189", "@139",
		"@263", "@sohu", "@foxmail" ];
var emailLoginUrl = [
		"https://mail.qq.com/cgi-bin/loginpage",
		"https://passport.alipay.com/login/login.htm?return_url=https%3A%2F%2Fmail.aliyun.com%2Falimail%2Fauth%2FcallbackForHavana%3Freurl%3D%252Falimail%252F&fromSite=9",
		"http://mail.163.com",
		"http://www.126.com",
		"http://mail.sina.com.cn",
		"http://webmail30.189.cn",
		"http://mail.10086.cn",
		"http://www.263.net",
		"http://mail.sohu.com",
		"http://mail.sohu.com",
		"http://mail.qq.com/cgi-bin/loginpage?t=fox_loginpage&sid=,2,zh_CN&r=a5df221d27ddbb13cc2182e934baa805" ];
// 发送短信验证码
function sendMessageCode() {
	$.ajax({
		type : "post",
		data : {
			tel : $("#findUsername").val()
		},
		url : "http://v3.solarsys.cn/UserPrj/sendRandCode",
		success : function(msg) {
			var time = 99;// 倒计时时间
			$("#sendMessageCodeBtn").text(time + "秒后重新获取");
			$("#sendMessageCodeBtn").attr("disabled", "disabled"); // 移除“忘记密码”click事件
			var autotime = setInterval(function() {// 定时器
				time--;
				if (time == -1) {
					$("#sendMessageCodeBtn").text("获取密码");
					$("#sendMessageCodeBtn").removeAttr("disabled");
					time = 99;
					clearInterval(autotime);// 清除定时器
				} else {
					$("#sendMessageCodeBtn").text(time + "秒后重新获取");
					$("#sendMessageCodeBtn").attr("disabled", "disabled"); // 移除“忘记密码”click事件
				}
			}, 1000);
		}
	});
};

/**
 * 用户点击键盘enter键时处罚登录
 * 
 * @returns
 */
function enterKeyDown(e) {
	var eventIns = e ? e : window.event;
	if (eventIns.keyCode == 13) {
		// 提交登录表单
		$("#loginForm").submit();
	}
}
$(function() {

	// 显示登录模块
	$(".toLoginBtn").click(function() {
		$(".loginS").hide();
		$("#login-container").fadeIn();
	});

	// 显示注册模块
	$(".toRegisterBtn").click(function() {
		$(".loginS").hide();
		$("#register-container").fadeIn();
	});

	// 显示忘记密码模块
	$(".toForgetBtn").click(
			function() {
				$(".loginS").hide();
				// =====默认获取验证码==开始===
				var img = document.getElementById("findPwdImg");
				// img.src =
				// 'http://login.solarsys.cn/UserPrj/code.yzmImage.jpg?id='+
				// Math.random();
				img.src = 'http://v3.solarsys.cn/UserPrj/code.yzmImage.jpg?id='
						+ Math.random();
				// =====默认获取验证码==结束===
				$("#forget-container").fadeIn();
			});

	// ----------------------------------------------登录-------------------------------------//
	$(".doLoginBtn").click(function() {
		$("#loginForm").submit();
	});
	// ----------------------------------------------登录-------------------------------------//

	// ----------------------------------------------注册-------------------------------------//
	$(".doRegisterBtn").click(function() {
		$("#registerForm").submit();
	});
	// ----------------------------------------------注册-------------------------------------//

	// ----------------------------------------------忘记密码-------------------------------------//
	// 下一步按钮
	$(".toForget2Btn").click(function() {
		$("#findPasswordForm").submit();
		// alert($("#findUsername").val());
		//
	});

	// 验证手机短信验证码是否正确
	$(".toForger3TelBtn").click(function() {

		$("#findPwdPhoneForm").submit();
	});
	$(".doSendEmailBtn").click(function() {
		$.ajax({
			url : "http://v3.solarsys.cn/UserPrj/findPwd", // 请求的url地址
			dataType : "json", // 返回格式为json
			// async: true, //请求是否异步，默认为异步，这也是ajax重要特性
			data : {
				"userName" : $("#findUsername").val()
			}, // 参数值
			type : "post",
			success : function(req) {
				// 请求成功时处理
				if (req.sendMailState) {// 发送成功跳转到
					toastr.success('发送成功');
					$("#forget2-email-container").hide();
					$("#sendMailAdd").text(emailAlertText);
					var lowerStr = $("#findUsername").val().toLowerCase();
					var n = -1;
					for (var i = 0; i < emailType.length; i++) {
						n = lowerStr.indexOf(emailType[i]);
						if (n > 0) {
							$("#loginEmailDiv").attr("style", "display:block");
							$("#loginEmail").attr("href", emailLoginUrl[i]);
							break;
						}
					}
					$("#forget3-email-container").fadeIn();
				} else {// 发送邮件失败
					toastr.success('发送失败：' + req.msg);
				}
			}
		});
	});
	$(".doUpdatePwdBtn").click(function() {
		$("#findPwdForMobileForm").submit();
		toastr.success('修改成功');
	});
	// ----------------------------------------------忘记密码-------------------------------------//

	// ----------------------------------------------登录校验-------------------------------------------//
	// 添加自定义校验规则，验证账号是否是手机号或email


jQuery.validator.addMethod("userNameType",function(value, element) {
	var tel = /^[A-Za-z0-9_]+$/;
	return this.optional(element) || tel.test(value);
}, "用户账号为数字字母下划线，6~16位长度");


	$("#loginForm").validate({
		// 错误提示样式,在下方提示
		errorPlacement : function(error, element) {
			$('<br/>').appendTo(element.parent());
			error.css({
				display : "inline",
				color : "#ee7676",
				position : "relative",
			}).appendTo(element.parent().addClass("error"));
		},
		submitHandler : function(form) {
			//setCookie();
//			var testobj = form;
			$("#passwordMd5").val(hex_md5($("#password").val()));
			$("#password").val("");//密码置空，防止http提交明码
			form.submit();
			$("#denglu").text("登录中• • •");
			$("#denglu").attr("disabled", "true");
		},
		// 校验规则
		rules : {
			username : {
				required : true,
				rangelength:[6,16],
				userNameType : true
			// ,
			/*
			 * remote : { //验证用户名是否存在 type : "POST",
			 * url:"http://c.solarsys.cn/UserPrj/checkUser", // url :
			 * "http://login.solarsys.cn/UserPrj/checkUser", //servlet data : {
			 * account : function() { return $("#loginUsername").val(); },
			 * checkType : "login" } }
			 */
			},
			password : {
				required : true,
				rangelength:[6,16],
				userNameType:true
			}
		},
		// 提示文本
		messages : {
			username : {
				required : "请输入账号",
				rangelength:"用户账号为6~16位长度",
				userNameType : "用户账号为数字字母下划线，6~16位长度"

			},
			password : {
				required : "请输入密码",
				rangelength:"用户密码为6~16位长度",
				userNameType : "用户密码为数字字母下划线，6~16位长度"
			}
		}
	});
	// ----------------------------------------------登录校验-------------------------------------------//

	// ----------------------------------------------注册校验-------------------------------------------//
	jQuery.validator
	.addMethod(
			"telephoneRule",
			function(value, element) {
				var tel = /^(((13[0-9]{1})|(14[4-7]{1})|(15[0-9]{1})|(170)|(17[6-8]{1})|(18[0-9]{1}))+\d{8})$/;
				return this.optional(element) || tel.test(value);
			}, "请输入正确的手机号码");
	
	$("#registerForm").validate({
		errorPlacement : function(error, element) {
			// 错误提示样式,在下方提示
			$('<br/>').appendTo(element.parent());
			error.css({
				display : "inline",
				color : "#ee7676",
				position : "relative",
			}).appendTo(element.parent().addClass("error"));

		},
		submitHandler : function(form) {
			$("#submitInput").disabled=true;
			var registerName=$("#registerName").val();
			var yzmNumber=$("#yzmNumber").val();
			var password=$("#signupPwd").val();
			var telephone=$("#telephone").val();
			var md5Password=hex_md5(password);
			$("#md5SignupPwd").val(md5Password);
			$("#signupPwd").val("");
			$("#repeatPwd").val("");
			$("#telephone").val("");
			
			$.ajax({
				type:"POST",
				url:ctx+"/UserManage/userRegister",
				data:"registerName="+registerName+"&md5SignupPwd="+md5Password+"&yzmNumber="+yzmNumber+"&telephone="+telephone,
				success:function(e){
					if(e!=null){
						if(e=="1a"){
							$("#errorInfo").html("<div class='alert alert-error input-medium controls'><button class='close' data-dismiss='alert'>×</button>此用户名已被占用!</div>");
						}
						if(e=="1b"){
							$("#errorInfo").html("<div class='alert alert-error input-medium controls'><button class='close' data-dismiss='alert'>×</button>验证码校验失败!</div>");
						}
						if(e=="2"){
							$("#errorInfo").html("<div class='alert alert-error input-medium controls'><button class='close' data-dismiss='alert'>×</button>服务器拒绝访问，请稍后重试!</div>");
						}
						if(e=="3"){
							window.location.href=ctx+"/toLogin";
						}
					}
				},
				error:function(e){
					$("#errorInfo").html("<div class='alert alert-error input-medium controls'><button class='close' data-dismiss='alert'>×</button>操作失败!</div>");
				}
			});
		},
		rules : {
			registerName : {
				required : true,
				minlength : 6,
				maxlength : 16,
			},

			signupPwd : {
				required : true,
				minlength : 6,
				maxlength : 16
			},
			repeatPwd : {
				required : true,
				equalTo : "#signupPwd",
				minlength : 6
			},
			telephone : {
				required : true,
				telephoneRule : true
			},
		
			yzmNumber : {
				required : true,
				remote : { // 验证验证码输入是否正确
					type : "POST",
					url : ctx+"/CheckVierifyCode/checkCode",
					data : {
						yzmNumber : function() {
							return $("#yzmNumber").val();
						}
					}
				}
			}
		},
		messages : {
			registerName : {
				required : "请输入账号",
				minlength : "账号长度不能少于6位",
				maxlength : "账号长度最多为16位",
				remote : "该账号已经被注册,请换个再试试"
			},
			signupPwd : {
				required : "请输入密码",
				minlength : "密码长度不能少于6位",
				maxlength : "密码长度最多为16位"
			},
			repeatPwd : {
				required : "请再次输入密码",
				equalTo : "两次密码输入不一致",
				minlength : "密码长度不能少于6位"
			},
			telephone :{
				required : "请输入手机号码",
				telephoneRule : "请输入正确的手的号码"
			},
			yzmNumber : {
				required : "请输入验证码",
				remote : "验证码输入错误"
			}
		}
	});
	// ----------------------------------------------注册校验-------------------------------------------//

	// ----------------------------------------------找回密码第一步校验--------------------------------//
	$("#findPasswordForm")
			.validate(
					{
						// 错误提示样式,在下方提示
						errorPlacement : function(error, element) {
							$('<br/>').appendTo(element.parent());
							error.css({
								display : "inline",
								color : "#ee7676",
								position : "relative",
							}).appendTo(element.parent().addClass("error"));
						},
						submitHandler : function() {
							// 隐藏”忘记密码”域
							$("#forget-container").hide();
							// 判断显示手机号还是邮箱
							var inputVal = ($("#findUsername").val());
							var phoneReg = /^(((13[0-9]{1})|(14[4-7]{1})|(15[0-9]{1})|(170)|(17[6-8]{1})|(18[0-9]{1}))+\d{8})$/;// 手机号正则
							if (phoneReg.test(inputVal)) { // 手机号
								var mphone = inputVal.substr(3, 4);
								var lphone = inputVal.replace(mphone, "****");
								$("#findPwdPhone").text(lphone);
								$("#forget2-tel-container").fadeIn();// 手机号
							} else {// 邮箱
								var realyText = inputVal.split("@");
								var textLength = realyText[0].length;
								var mEmail;
								var iEmail;
								if (textLength >= 3) {
									mEmail = realyText[0].substr(1,
											textLength - 2);
									iEmail = realyText[0].replace(mEmail,
											"****")
											+ "@" + realyText[1];
									;
								} else if (textLength == 2) {
									mEmail = realyText[0].substr(0, 1);
									iEmail = mEmail + "*@" + realyText[1];
								} else {
									iEmail = "*" + "@" + realyText[1];
								}
								emailAlertText = iEmail;
								$("#findPwdForEmailText").text(iEmail);
								$("#forget2-email-container").fadeIn();// 邮箱
							}
						},
						// 校验规则
						rules : {
							findUsername : {
								required : true,
								emailOrPhone : true,
								remote : { // 验证用户名是否存在
									type : "POST",
									url : "http://v3.solarsys.cn/UserPrj/checkUser",
									// url :
									// "http://login.solarsys.cn/UserPrj/checkUser",
									// //servlet
									data : {
										account : function() {
											return $("#findUsername").val();
										},
										checkType : "login"
									}
								}
							},
							yzmNumber : {
								required : true,
								remote : { // 验证验证码输入是否正确
									type : "POST",
									url : "http://v3.solarsys.cn/UserPrj/checkCode", // servlet
									data : {
										account : function() {
											return $("#findPwdYzm").val();
										}
									}
								}
							}
						},
						// 提示文本
						messages : {
							findUsername : {
								required : "请输入要找回的账号",
								emailOrPhone : "请输入账号",
								remote : "该找回账号不存在"
							},
							yzmNumber : {
								required : "请输入验证码",
								remote : "请输入正确的验证码"
							}
						}
					});
	// ----------------------------------------------找回密码第一步校验--------------------------------//

	// ----------------------------------------------手机找回密码，校验短信验证码是否正确--------------------------------//
	$("#findPwdPhoneForm")
			.validate(
					{
						errorPlacement : function(error, element) {
							// 错误提示样式,在下方提示
							$('<br/>').appendTo(element.parent());
							error.css({
								display : "inline",
								color : "#ee7676",
								position : "relative",
							}).appendTo(element.parent().addClass("error"));

						},
						submitHandler : function() {

							$("#forget2-tel-container").hide();
							$("#findPwdForMobilePhone").val(
									$("#findUsername").val());
							$("#findPwdForMobileAlert")
									.text(
											"您正在找回" + $("#findPwdPhone").text()
													+ "的密码");
							$("#forget3-tel-container").fadeIn();
						},
						rules : {
							messageCode : {
								required : true,
								remote : { // 验证验证码输入是否正确
									type : "POST",
									// url :
									// "http://login.solarsys.cn/UserPrj/checkCode",
									// //servlet
									url : "http://v3.solarsys.cn/UserPrj/checkMessageCode",
									data : {
										messageCode : function() {
											return $("#findPwdPhoneCode").val();
										}
									}
								}
							}
						},
						messages : {
							messageCode : {
								required : "请输入短信验证码",
								remote : "验证码输入错误"
							}
						}
					});

	// ----------------------------------------------手机找回密码，校验短信验证码是否正确--------------------------------//

	// ----------------------------------------------手机找回密码，重置密码校验--------------------------------------------//
	$("#findPwdForMobileForm").validate({
		errorPlacement : function(error, element) {
			// 错误提示样式,在下方提示
			$('<br/>').appendTo(element.parent());
			error.css({
				display : "inline",
				color : "#ee7676",
				position : "relative",
			}).appendTo(element.parent().addClass("error"));

		},
		rules : {
			password : {
				required : true
			},
			repeatPwd : {
				required : true,
				equalTo : "#upwfmPassword"
			}
		},
		messages : {
			password : {
				required : "请输入新密码"
			},
			repeatPwd : {
				required : "请再次输入密码",
				equalTo : "两次密码输入不一致",
			}
		}
	});
	// ----------------------------------------------手机找回密码，重置密码校验--------------------------------------------//
});

var Base64 = {
	// 转码表
	table : [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
			'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
			'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
			'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
			'0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '/' ],
	UTF16ToUTF8 : function(str) {
		var res = [], len = str.length;
		for (var i = 0; i < len; i++) {
			var code = str.charCodeAt(i);
			if (code > 0x0000 && code <= 0x007F) {
				// 单字节，这里并不考虑0x0000，因为它是空字节
				// U+00000000 – U+0000007F 0xxxxxxx
				res.push(str.charAt(i));
			} else if (code >= 0x0080 && code <= 0x07FF) {
				// 双字节
				// U+00000080 – U+000007FF 110xxxxx 10xxxxxx
				// 110xxxxx
				var byte1 = 0xC0 | ((code >> 6) & 0x1F);
				// 10xxxxxx
				var byte2 = 0x80 | (code & 0x3F);
				res
						.push(String.fromCharCode(byte1), String
								.fromCharCode(byte2));
			} else if (code >= 0x0800 && code <= 0xFFFF) {
				// 三字节
				// U+00000800 – U+0000FFFF 1110xxxx 10xxxxxx 10xxxxxx
				// 1110xxxx
				var byte1 = 0xE0 | ((code >> 12) & 0x0F);
				// 10xxxxxx
				var byte2 = 0x80 | ((code >> 6) & 0x3F);
				// 10xxxxxx
				var byte3 = 0x80 | (code & 0x3F);
				res.push(String.fromCharCode(byte1),
						String.fromCharCode(byte2), String.fromCharCode(byte3));
			} else if (code >= 0x00010000 && code <= 0x001FFFFF) {
				// 四字节
				// U+00010000 – U+001FFFFF 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
			} else if (code >= 0x00200000 && code <= 0x03FFFFFF) {
				// 五字节
				// U+00200000 – U+03FFFFFF 111110xx 10xxxxxx 10xxxxxx 10xxxxxx
				// 10xxxxxx
			} else /** if (code >= 0x04000000 && code <= 0x7FFFFFFF) */
			{
				// 六字节
				// U+04000000 – U+7FFFFFFF 1111110x 10xxxxxx 10xxxxxx 10xxxxxx
				// 10xxxxxx 10xxxxxx
			}
		}

		return res.join('');
	},
	UTF8ToUTF16 : function(str) {
		var res = [], len = str.length;
		var i = 0;
		for (var i = 0; i < len; i++) {
			var code = str.charCodeAt(i);
			// 对第一个字节进行判断
			if (((code >> 7) & 0xFF) == 0x0) {
				// 单字节
				// 0xxxxxxx
				res.push(str.charAt(i));
			} else if (((code >> 5) & 0xFF) == 0x6) {
				// 双字节
				// 110xxxxx 10xxxxxx
				var code2 = str.charCodeAt(++i);
				var byte1 = (code & 0x1F) << 6;
				var byte2 = code2 & 0x3F;
				var utf16 = byte1 | byte2;
				res.push(Sting.fromCharCode(utf16));
			} else if (((code >> 4) & 0xFF) == 0xE) {
				// 三字节
				// 1110xxxx 10xxxxxx 10xxxxxx
				var code2 = str.charCodeAt(++i);
				var code3 = str.charCodeAt(++i);
				var byte1 = (code << 4) | ((code2 >> 2) & 0x0F);
				var byte2 = ((code2 & 0x03) << 6) | (code3 & 0x3F);
				var utf16 = ((byte1 & 0x00FF) << 8) | byte2
				res.push(String.fromCharCode(utf16));
			} else if (((code >> 3) & 0xFF) == 0x1E) {
				// 四字节
				// 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
			} else if (((code >> 2) & 0xFF) == 0x3E) {
				// 五字节
				// 111110xx 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx
			} else /** if (((code >> 1) & 0xFF) == 0x7E) */
			{
				// 六字节
				// 1111110x 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx
			}
		}

		return res.join('');
	},
	encode : function(str) {
		if (!str) {
			return '';
		}
		var utf8 = this.UTF16ToUTF8(str); // 转成UTF8
		var i = 0; // 遍历索引
		var len = utf8.length;
		var res = [];
		while (i < len) {
			var c1 = utf8.charCodeAt(i++) & 0xFF;
			res.push(this.table[c1 >> 2]);
			// 需要补2个=
			if (i == len) {
				res.push(this.table[(c1 & 0x3) << 4]);
				res.push('==');
				break;
			}
			var c2 = utf8.charCodeAt(i++);
			// 需要补1个=
			if (i == len) {
				res.push(this.table[((c1 & 0x3) << 4) | ((c2 >> 4) & 0x0F)]);
				res.push(this.table[(c2 & 0x0F) << 2]);
				res.push('=');
				break;
			}
			var c3 = utf8.charCodeAt(i++);
			res.push(this.table[((c1 & 0x3) << 4) | ((c2 >> 4) & 0x0F)]);
			res.push(this.table[((c2 & 0x0F) << 2) | ((c3 & 0xC0) >> 6)]);
			res.push(this.table[c3 & 0x3F]);
		}

		return res.join('');
	},
	decode : function(str) {
		if (!str) {
			return '';
		}

		var len = str.length;
		var i = 0;
		var res = [];

		while (i < len) {
			code1 = this.table.indexOf(str.charAt(i++));
			code2 = this.table.indexOf(str.charAt(i++));
			code3 = this.table.indexOf(str.charAt(i++));
			code4 = this.table.indexOf(str.charAt(i++));

			c1 = (code1 << 2) | (code2 >> 4);
			c2 = ((code2 & 0xF) << 4) | (code3 >> 2);
			c3 = ((code3 & 0x3) << 6) | code4;

			res.push(String.fromCharCode(c1));

			if (code3 != 64) {
				res.push(String.fromCharCode(c2));
			}
			if (code4 != 64) {
				res.push(String.fromCharCode(c3));
			}

		}

		return this.UTF8ToUTF16(res.join(''));
	}
};

// 将用户存进cookie中
function setCookie() {

	var username = $("input[name=username]").val();
	var password = $("input[name=password]").val();
	var rememberMeFlag = $("input[name='rememberMe']").is(':checked');
	if (rememberMeFlag) {// 存cookie
		var Days = 30;
		var exp = new Date();
		exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
		document.cookie = "username=" + Base64.encode(username) + ";expires="
				+ exp.toGMTString();
		document.cookie = "password=" + Base64.encode(password) + ";expires="
				+ exp.toGMTString();
	}
}
// 读取cookie
function readCookies() {

	var cookies = document.cookie.split("; ");
	for (var i = 0; i < cookies.length; i++) {
		var arr = cookies[i].split("=");
		if (arr[0] == "username") {
			var username = Base64.decode(arr[1]);
			$("input[name=username]").val(username);
		}
		if (arr[0] == "password") {
			var password = Base64.decode(arr[1]);
			$("input[name=password]").val(password);
		}
	}
}