/**
 * 认证管理js
 */

var isExecuteEvent = 1;// 1:执行事件，2:只执行拨动样式
var loginType = method;// 初始化登录方式
var curUpload = 1;// 当前是1：QQ上传，2：微博

$(function() {

	// --------------------左侧菜单---------------------------//
	$("#webManage").addClass("active");// 左侧菜单：网站管理选中状态
	$("#webFlag").removeClass("icon-chevron-right").addClass(
			"icon-chevron-down");
	$("#sAuth").addClass("active");// 左侧菜单：认证设置选中状态
	var flag = 1;
	$("#webManage").click(
			function() {
				if (flag == 2) {
					$("#webFlag").removeClass("icon-chevron-right").addClass(
							"icon-chevron-down");
					$("#webManage").css("margin-bottom", "0px");
					$("#webManage").find("a").css("border-radius",
							"5px 5px 0px 0px");
					flag = 1;
				} else {
					$("#webFlag").removeClass("icon-chevron-down").addClass(
							"icon-chevron-right");
					$("#webManage").css("margin-bottom", "4px");
					$("#webManage").find("a").css("border-radius",
							"5px 5px 5px 5px");
					flag = 2;
				}
				$("#sAuth").toggle();
				$("#sDecorate").toggle();
				$("#sApply").toggle();
			});
	// --------------------左侧菜单---------------------------//

	// 初始化：认证设置按钮开关
	$('input[type="checkbox"]').bootstrapSwitch();

	// -------------------------------------------▼▼▼▼认证设置▼▼▼-------------------------------------------------------------//
	if (loginType == 0) {// 一键登录
		loginType = 1;
		$("#loginY").hide();
	} else {
		$("#loginN").hide();
	}
	loginNY(loginType, 0);
	// 获取认证方式百分比
	initAuthMethodPercent();
	// 初始化分享设置
	initTelConfig();
	initQqSaleConfig();
	initWeiboSaleConfig();
	initWechartSaleConfig();
	$("#pwdPassword").val(oldPassword);

	// 一键登录与账户登录效果切换
	$('input[name="loginType"]').click(function() {
		var _this = $('input[name="loginType"]:checked').val();
		if (loginType != _this) {
			loginType = _this;
			loginNY(_this, 1);
			isExecuteEvent = 1;
		}
	});
	
	
	//微信设置中：若微信号为null，则显示solarsys.cn
	$("#wechatCommonNum").blur(function(){
		if ($(this).val()=="") {
			$("#copyId").val("solarsys_cn");
		}
	});
	

	// 账户登录中，认证方式开关click事件
	$('input[name="switch-auth"]').on(
			'switch-change',
			function(event, data) {
				if (isExecuteEvent == 1) {
					var _val = data.el.val();
					var flag = data.value;
					var _this = data.el.closest(".loginYs").attr("class")
							.split(" ")[2];
					// alert(_val + "----" + flag + "----" + _this);
					isExecuteEvent = 2;
					if (flag) {// 该认证方式开启
						doSelect($("." + _this), true);// 选中该认证方式
						if (_val == 8) {// 手机号
							// 校园卡、密码登录取消选中
							cancelSelect($(".school"), false);
							cancelSelect($(".pwd"), false);
							isExecuteEvent = 1;
						} else if (_val == 16) {// 校园卡
							// 所有登录方式取消选中
							memberIsAlreadyBuy(1);
							cancelSelect($(".tel"), false);
							cancelSelect($(".qq"), false);
							cancelSelect($(".weibo"), false);
							cancelSelect($(".weChat"), false);
							cancelSelect($(".pwd"), false);
							isExecuteEvent = 1;
						} else if (_val == 32) {// 密码登录
							// 校园卡、手机号登录取消选中
							cancelSelect($(".tel"), false);
							cancelSelect($(".school"), false);
							isExecuteEvent = 1;
						} else {// 微博、QQ、微信
							// 校园卡取消选中
							cancelSelect($(".school"), false);
							isExecuteEvent = 1;
						}
					} else {// 关闭该认证方式
						cancelSelect($("." + _this), true);
						isExecuteEvent = 1;
					}
					editAuthMethod();
				}
			});

	// 设置按钮、click事件
	$(".settingBtn").click(function() {
		var div = $(this).attr("role");
		if (div == "schoolSetting") {
			memberIsAlreadyBuy(2);
		} else {
			$("#" + div).show();
			$("#authMain").hide();
		}
	});

	// 校园卡设置：提示弹框中，立即前往按钮
	$(".goApply").click(function() {
		window.location.href = ctx + "/appManage/gotoAppStore";
	});

	// 返回认证设置主页
	$(".toAuthMainBtn").click(function() {
		$(".loginSetting").hide();
		$("#authMain").show();
	});

	// -------------------------------------------▲▲▲认证设置▲▲▲-------------------------------------------------------------//

	// 手机号登录：保存设置
	$(".doSaveTelAuthBtn").click(function() {
		$("#telSettingForm").submit();
	});

	// ---------------------------▼QQ登录设置----------------------------//

	// 保存设置
	$(".doSaveQqSettingBtn").click(function() {
		$("#qqSettingForm").submit();
	});

	// 上传按钮、重新上传按钮click事件
	$(".qqToUploadBtn").click(
			function() {

				curUpload = 1;

				$("#qqSettingForm").hide();
				$(".toAuthMainBtn").hide();
				$("#qqUpload").show();
				$("#qqFlash").empty();
				if (navigator.appName == "Microsoft Internet Explorer"
						&& navigator.appVersion.match(/8./i) == "8.") {
					showflash(curPath + "/swf/banner.swf", "640px", "540px",
							"qqFlash", ctx + "/sale/qqUpload");// 显示flash
				} else {
					showflash(curPath + "/swf/banner.swf", "800px", "680px",
							"qqFlash", ctx + "/sale/qqUpload");// 显示flash
				}
			});

	// 返回QQ登录设置主界面click
	$(".toQQSettingFormBtn").click(function() {

		$("#qqSettingForm").show();
		$(".toAuthMainBtn").show();
		$("#qqUpload").hide();
		$("#qqFlash").empty();

	});
	// ---------------------------▲QQ登录设置----------------------------//

	// ---------------------------▼微博登录设置----------------------------//

	// 保存设置
	$(".doSaveWeiboSettingBtn").click(function() {
		$("#weiboSettingForm").submit();
	});

	// 上传按钮、重新上传按钮click事件
	$(".weiboToUploadBtn").click(
			function() {
				curUpload = 2;
				$("#weiboSettingForm").hide();
				$(".toAuthMainBtn").hide();
				$("#weiboFlash").empty();
				$("#weiboUpload").show();
				if (navigator.appName == "Microsoft Internet Explorer"
						&& navigator.appVersion.match(/8./i) == "8.") {
					showflash(curPath + "/swf/banner.swf", "640px", "540px",
							"weiboFlash", ctx + "/sale/microblogUpload");// 显示flash
				} else {
					showflash(curPath + "/swf/banner.swf", "800px", "680px",
							"weiboFlash", ctx + "/sale/microblogUpload");// 显示flash
				}

			});

	// 返回微博登录设置主界面click
	$(".toWeiboSettingFormBtn").click(function() {

		$("#weiboSettingForm").show();
		$(".toAuthMainBtn").show();
		$("#weiboUpload").hide();
		$("#weiboFlash").empty();

	});
	// ---------------------------▲微博登录设置----------------------------//

	// ---------------------------▼微信登录设置----------------------------//

	initCopy();// 复制链接js效果

	// 保存设置
	$(".doSaveWeChatSettingBtn").click(function() {
		$("#wechartSettingForm").submit();
	});

	$("#wechatCommonNum").keyup(function() {
		var _val = $("#wechatCommonNum").val();
		$("#copyId").text(_val);
	});

	// ---------------------------▲微信登录设置----------------------------//

	// 密码设置中，保存按钮click事件
	$(".doSavePwdPasswordBtn").click(function() {
		$("#pwdSettingForm").submit();
	});

	// -------------------------------------------▼▼▼▼其它设置▼▼▼-------------------------------------------------------------//

	// 初始化其它设置
	$.ajax({
		url : ctx + "/store/getCommCountData", // 请求的url地址
		// async: true, //请求是否异步，默认为异步，这也是ajax重要特性
		type : "post",
		success : function(req) {
			var configInfo = eval('(' + req + ')');
			$("#macs").text(configInfo.macs);
			$("#ips").text(configInfo.ips);
			if (configInfo.countdown == "" || configInfo.countdown == 0) {
				$("#adTime").val(8);
			} else {
				$("#adTime").val(configInfo.countdown);
			}
			if (configInfo.timeout == "" || configInfo.timeout == 0) {
				$("#authTimeout").val(30);
			} else {
				$("#authTimeout").val(configInfo.timeout);
			}
			$("#ssid").val(configInfo.ssid);
			if (configInfo.gotoUrl && configInfo.gotoUrl != "") {
				$("#homePortalUrl").val(2);
				$("#customHomPtag").show();
				$("#customHom").val(configInfo.gotoUrl);

			} else {
				$("#homePortalUrl").val(1);
				$("#customHom").val("");
			}
		}
	});

	$("#manageMacBtn").click(function() {
		$("#other").hide();
		$("#macSetting").show();
		// 加载公共白名单列表
		getCommenWhiteList(1);

	});

	$("#manageWebBtn").click(function() {
		$("#other").hide();
		$("#webSetting").show();
		getCommenWhiteYuMingList(1);
	});

	$("#authAdtimeSetingBtn").click(function() {
		$("#authAdtimeSetingForm").submit();
	});

	$("#authTimeoutBtn").click(function() {
		$("#authTimeoutForm").submit();
	});

	$("#ssidSetingBtn").click(function() {
		$("#ssidSetingForm").submit();
	});

	$("#customHomBtn").click(function() {
		$("#customHomBtn").submit();
	});

	$(".toOther").click(function() {
		$("#macSetting").hide();
		$("#webSetting").hide();
		$("#other").show(function() {
			$.ajax({
				url : ctx + "/store/getCommCountData", // 请求的url地址
				// async: true, //请求是否异步，默认为异步，这也是ajax重要特性
				type : "post",
				success : function(req) {
					var configInfo = eval('(' + req + ')');
					$("#macs").text(configInfo.macs);
					$("#ips").text(configInfo.ips);
					$("#adTime").val(configInfo.countdown);
					$("#authTimeout").val(configInfo.timeout);
					$("#ssid").val(configInfo.ssid);
					if (configInfo.gotoUrl && configInfo.gotoUrl != "") {
						$("#homePortalUrl").val(2);
						$("#customHomPtag").show();
						$("#customHom").val(configInfo.gotoUrl);

					} else {
						$("#homePortalUrl").val(1);
						$("#customHom").val("");
					}
				}
			});
		});
	});

	// 添加白名单
	$("#toAddMac").click(function() {
		document.getElementById("edit-profile").reset();
		editProfileFor.resetForm();
		$("#addMac").show();
		$("#macSetting").hide();
	});

	$("#toAddWeb").click(function() {
		document.getElementById("addWebUrlForm").reset();
		addWebUrlForm.resetForm();
		$("#addWeb").show();
		$("#webSetting").hide();
	});

	$("#cancelSaveMacBtn").click(function() {
		$("#addMac").hide();
		$("#macSetting").show();
	});

	// 保存公共白名单
	$("#doSaveMacBtn").click(function() {
		$("#edit-profile").submit();
	});

	$(".toDeleteMacBtn").click(function() {

		$('#deleteMac').modal({
			backdrop : 'static'
		});
	});

	$(".doDeleteMacBtn").click(function() {
		// 更新数据库
		$.ajax({
			url : ctx + "/storeRouter/deleteCommWhiteList", // 请求的url地址
			// async: true, //请求是否异步，默认为异步，这也是ajax重要特性
			data : {
				mac : $("#deleteWhiteMAC").val()
			}, // 参数值
			type : "post",
			success : function(req) {
				if (req == "true") {
					// 提示保存成功
					toastr.success('删除成功');
					getCommenWhiteList(1);
					$("#macSetting").show();
					// 取消所有账户登录选中并保留一个手机号认证登录

				} else {
					// 提示保存成功
					toastr.error('删除失败');
				}
				$('#deleteMac').modal("hide");
			},
			error : function(data, status, e) {
				toastr.error('删除失败');
				$('#deleteMac').modal("hide");
			}
		});
	});

	$("#cancelSaveWebBtn").click(function() {
		$("#addWeb").hide();
		$("#webSetting").show();
	});

	/**
	 * 保存公共域名白名单
	 */
	$("#doSaveWebBtn").click(function() {
		$("#addWebUrlForm").submit();
	});

	$(".toDeleteWebBtn").click(function() {
		$('#deleteWeb').modal({
			backdrop : 'static'
		});
	});

	$(".doDeleteWebBtn").click(function() {
		// 更新数据库
		$.ajax({
			url : ctx + "/storeRouter/deleteCommIpOrYuMing", // 请求的url地址
			// async: true, //请求是否异步，默认为异步，这也是ajax重要特性
			data : {
				ipOrYuMing : $("#deleteWhiteYuMing").val()
			}, // 参数值
			type : "post",
			success : function(req) {
				if (req == "true") {
					// 提示保存成功
					toastr.success('删除成功');
					getCommenWhiteYuMingList(1);
					$("#webSetting").show();
				} else {
					// 提示保存成功
					toastr.error('删除失败');
				}
				$('#deleteWeb').modal("hide");
			},
			error : function(data, status, e) {
				toastr.error('删除失败');
				$('#deleteWeb').modal("hide");
			}
		});
	});

	// -------------------------------------------▲▲▲其它设置▲▲▲-------------------------------------------------------------//
});

// -------------------------------------------▼▼▼▼认证设置▼▼▼-------------------------------------------------------------//
// 初始化认证方式百分比
function initAuthMethodPercent() {
	$.ajax({
		url : ctx + "/store/getAuthMethodPercent",
		type : "post",
		success : function(data) {
			eval("data = " + data);
			if (data.code == 200) {
				var sum = data.data.sum;
				var method1 = Math.round(data.data[1] / sum * 10000) / 100.00
						+ "%";
				var method2 = Math.round(data.data[2] / sum * 10000) / 100.00
						+ "%";
				var method4 = Math.round(data.data[4] / sum * 10000) / 100.00
						+ "%";
				var method8 = Math.round(data.data[8] / sum * 10000) / 100.00
						+ "%";
				var method16 = Math.round(data.data[16] / sum * 10000) / 100.00
						+ "%";
				var method32 = Math.round(data.data[32] / sum * 10000) / 100.00
						+ "%";
				$("#telPercent").text(method8);
				$("#qqPercent").text(method1);
				$("#weiboPercent").text(method4);
				$("#weChatPercent").text(method2);
				$("#schoolPercent").text(method16);
				$("#pwdPercent").text(method32);
			} else {
				toastr.error(data.msg);
			}
		},
		error : function() {
			toastr.error('请求失败!');
		}
	});
}

// 判断是否购买会员管理
function memberIsAlreadyBuy(type) {
	$.ajax({
		url : ctx + "/store/memberIsAlreadyBuy",
		async : false,
		type : "post",
		success : function(data) {
			eval("data = " + data);
			if (data.code == 200) {
				if (data.data == "false") {
					// 弹出提示
					$('#schoolMsg').modal({
						backdrop : 'static'
					});
				} else {
					if (type == 2) {
						window.location.href = memeberUrl;
					}
				}
			} else {
				toastr.error(data.msg);
			}
		},
		error : function() {
			toastr.error('请求失败!');
		}
	});
}

/**
 * 账户登录中，将某个登录方式设为选中状态
 * 
 * @param obj
 *            登录方式所在div
 * @param flagMsg
 *            true:提示语句，false:不提示
 */
function doSelect(obj, flagMsg) {
	var parents = obj.children();
	if (parents.length == 7) {
		return;
	}
	var marker;
	var logo = parents[0];
	marker = logo.alt;
	var src = curPath + "/img/auth/" + marker + "1.png";
	logo.src = src;
	var img = $("<img>").attr("src", curPath + "/img/auth/ribbon.png")
			.addClass("tile-hot-ribbon").attr("alt", "ribbon");
	obj.prepend(img);
	if (flagMsg) {
		var h3 = parents.parent().find("h3");
		toastr.success(h3.text() + '方式已开启');
	}
	var p1 = $(obj.parent().find("p")[0]);
	var p2 = $(obj.parent().find("p")[1]);
	p1.hide();
	p2.show();
	// 开关按钮
	var switchBtn = parents.find("input");
	isExecuteEvent = 2;
	switchBtn.bootstrapSwitch('setState', true);
}

/**
 * 账户登录中，将某个登录方式取消选中状态
 * 
 * @param obj
 *            登录方式所在div
 * @param flagMsg
 *            true:提示语句，false:不提示
 */
function cancelSelect(obj, flagMsg) {

	var parents = obj.children();
	if (parents.length == 6) {
		return;
	}
	// 开关按钮
	var switchBtn = parents.find("input");

	if (loginType != 1) {
		// 检查是否仅剩一个，如果仅剩一个，则不能关闭
		var length = $("#loginY").find("img").length;
		if (length <= 8) {// 当前只有一个开启
			toastr.warning('至少保留一个认证方式！');
			isExecuteEvent = 2;
			switchBtn.bootstrapSwitch('setState', true);
			return;
		}
	}

	if (flagMsg) {
		var h3 = parents.parent().find("h3");
		toastr.success(h3.text() + '方式已取消');
	}
	for (var i = 0; i < parents.length; i++) {
		var _this = parents[i];
		if (_this.alt == "ribbon") {// ”已启用“效果
			_this = $(_this);
			_this.remove();
			i = i - 1;
			parents = obj.children();
		} else if (_this.alt != "ribbon" && typeof (_this.alt) != "undefined") {// 认证图片
			var marker = _this.alt;
			var src = curPath + "/img/auth/" + marker + "2.png";
			_this.src = src;
		}
	}

	var p1 = $(obj.parent().find("p")[0]);
	var p2 = $(obj.parent().find("p")[1]);
	p1.show();
	p2.hide();

	isExecuteEvent = 2;
	switchBtn.bootstrapSwitch('setState', false);
}

// 切换登录方式，js效果， 1、一键登录，2、账户登录
function loginNY(flag, type) {
	if (flag == 1) {
		$("input[name='loginType'][value=" + flag + "]").attr("checked",
				'checked');
		$("#loginN").show();
		$("#loginY").hide();
		$("#loginY").find(".loginYs").each(function() {
			cancelSelect($(this), false);
		});
		if (type == 1) {
			var resultFlag = editAuthMethod();
			if (resultFlag) {
				toastr.success('一键登录方式已开启');
			}
		}
	} else {
		$("input[name='loginType'][value=2]").attr("checked", 'checked');
		$("#loginY").show();
		$("#loginN").hide();
		if (type == 1) {// 保存
			doSelect($(".tel"), true);// 选中手机号登录认证方式
			editAuthMethod();
		} else {// 初始化
			if (method & 1) {
				doSelect($(".qq"), false);// 选中QQ登录认证方式
			}
			if (method & 2) {
				doSelect($(".weChat"), false);// 选中微信认证方式
			}
			if (method & 4) {
				doSelect($(".weibo"), false);// 选中微博登录认证方式
			}
			if (method & 8) {
				doSelect($(".tel"), false);// 选中手机号登录认证方式
			}
			if (method & 16) {
				doSelect($(".school"), false);// 选中校园卡登录认证方式
			}
			if (method & 32) {
				doSelect($(".pwd"), false);// 选中密码登录认证方式
			}
			isExecuteEvent = 1;
		}
	}
}

// 修改认证方式，入库
function editAuthMethod() {
	var flag = false;
	var method = 0;
	var _val = $("input[name='loginType']:checked").val();
	if (_val == 1) {// 一键登录
		method = 0;
	} else {// 账号登录
		var parents = $("#loginY").find(".loginYs");
		for (var i = 0; i < parents.length; i++) {
			var obj = $($("#loginY").find(".loginYs")[i]);
			var isSelect = $(obj.find("p")[1]).css("display");
			if (isSelect == "block") {// 选中
				var _val = obj.find("input").val();
				method = parseInt(method) + parseInt(_val);
			}
		}
	}
	$.ajax({
		url : ctx + "/store/saveRenzhengFangshi", // 请求的url地址
		async : false, // 请求是否异步，默认为异步，这也是ajax重要特性
		data : {
			"method" : method
		}, // 参数值
		type : "post",
		success : function(req) {
			if (req == "success") {
				flag = true;
			} else {
				flag = false;
			}
		},
		error : function() {
			toastr.error('请求失败!');
		}
	});
	return flag;
}

// -------------------------------------------▲▲▲认证设置▲▲▲-------------------------------------------------------------//

// -------------------------------------------▼微信登录设置---------------------------------------------//

// 复制链接js效果
function initCopy() {
	ZeroClipboard.setMoviePath(curPath + '/swf/ZeroClipboard.swf'); // 和html不在同一目录需设置setMoviePath
	var clip = new ZeroClipboard.Client(); // 新建一个对象

	clip.setHandCursor(true);
	clip.setText("1111"); // 设置要复制的文本。
	clip.addEventListener("mouseUp", function(client) {
		alert("复制卡号成功！");
	});
	clip.glue("copycardid1"); // 和上一句位置不可调换
}

// -------------------------------------------▲微信登录设置-------------------------------------------//

// -------------修改qq分享图片---------
function updateQqUpdateImg() {
	$("#updateShareimgForQQ").hide();
	$("#qqShareImg").hide();
	$("#222")
			.before(
					'<input type=file id=file1 name=Filedata  onchange=checkFileValidate(\'file1\',\'222\',\'checkFileState\') />');

}

// -------------修改qq分享图片---------

function updateWeiboUpdateImg() {
	$("#updateShareimgForWeibo").hide();
	$("#weiboShareImg").hide();
	$("#fileAlertWeibo")
			.before(
					'<input type=file id=file2 name=Filedata  onchange=checkFileValidate(\'file2\',\'fileAlertWeibo\',\'checkFileStateWeibo\') />');
}

// -------------------------------------------▼初始化店铺认证设置---------------------------------------------//
/**
 * 初始化微信分享设置
 */
function initWechartSaleConfig() {

	if (saleConfig) {
		$("#wechartSettingForm").find("input").each(function() {
			var inputTag = $(this);
			for ( var name in saleConfig) {
				if (name == inputTag.attr("name")) {
					inputTag.val(saleConfig[name]);
				}
			}
		});
		if (typeof saleConfig.searchType=="undefined"){
			$("#searchType").val(2);
		}else{
			$("#searchType").val(saleConfig.searchType);
		}
		if (saleConfig['wechatCommonNum'] != "") {
			$("#copyId").text(saleConfig['wechatCommonNum']);
		}
	}
}

/**
 * 初始化微博分享设置
 */
function initWeiboSaleConfig() {
	if (saleConfig.microblogName) {

		$("#weiboSettingForm").find("input").each(function() {
			var inputTag = $(this);
			for ( var name in saleConfig) {
				if (name == inputTag.attr("name")) {
					inputTag.val(saleConfig[name]);
				}
			}
		});
		var tt = saleConfig.microblogShareContent + "";
		tt = tt.replace(/##/g, '\n');
		$("#microblogShareContent").val(tt);

		if (saleConfig.microblogPicUrl.indexOf("null") > 0) {// 为空
			$("#weiboShareImgControls").hide();
		} else {
			$(".weiboUpload1").hide();
			$(".weiboUpload2").show();
			$("#weiboShareImgControls").show();
			$("#weiboShareImgControls").find("img").attr('src',
					saleConfig.microblogPicUrl);
		}

	}

}

/**
 * 初始化QQ分享设置
 */
function initQqSaleConfig() {
	if (saleConfig.qqCaption) {

		$("#qqSettingForm").find("input").each(function() {
			var inputTag = $(this);
			for ( var name in saleConfig) {
				if (name == inputTag.attr("name")) {
					inputTag.val(saleConfig[name]);
				}
			}
		});

		var ttr = saleConfig.qqContent + "";
		ttr = ttr.replace(/##/g, "\n");
		$("#qqContent").val(ttr);
		if (saleConfig.qqPicUrl.indexOf("null") > 0) {// 为空
			$("#qqShareImgControls").hide();
		} else {
			$(".qqUpload1").hide();
			$(".qqUpload2").show();
			$("#qqShareImgControls").show();
			$("#qqShareImgControls").find("img").attr('src',
					saleConfig.qqPicUrl);
		}
	}

}

/**
 * 将微信接口地址复制到内存剪切板中
 */
function copyText() {
	var interfaceText = $("#weichatInterfaceText").text();
	interfaceText = $.trim(interfaceText);
	if ("\v" == "v") {
		// IE浏览器执行代码
		window.clipboardData.clearData();
		window.clipboardData.setData("Text", interfaceText);
	} else {
		ZeroClipboard.setMoviePath(curPath + '/swf/ZeroClipboard.swf'); // 和html不在同一目录需设置setMoviePath
		var clip = new ZeroClipboard.Client(); // 新建一个对象

		clip.setHandCursor(true);
		clip.setText(interfaceText); // 设置要复制的文本。
		clip.glue("copycardid1"); // 和上一句位置不可调换
	}

	toastr.success('微信接口连接复制成功!');

}

/**
 * 自定义主页选择发生改变时触发的事件
 * 
 * @param obj
 */
function customHomChange(obj) {
	if (obj.value == 2) {
		$("#customHomPtag").show();
	} else {
		$("#customHom").val("");
		$("#customHomPtag").hide();
	}

}

function checkFileValidate(fileId, alertId, uploadStateId) {
	$.ajaxFileUpload({
		url : ctx + "/sale/checkFile", // 用于文件上传的服务器端请求地址
		type : 'post',
		secureuri : false, // 是否需要安全协议，一般设置为false
		fileElementId : fileId, // 文件上传域的ID
		dataType : 'json', // 返回值类型 一般设置为json,
		data : {
			maxSize : 500
		},
		success : function(data, status) // 服务器成功响应处理函数
		{
			if (data.isSuccess == 'true') {
				$("#" + alertId).css("display", "none");
				$("#" + uploadStateId).val("true");
			} else {
				$("#" + uploadStateId).val("");
				$("#" + alertId).css("display", "inline");

			}
		},
		error : function(data, status, e)// 服务器响应失败处理函数
		{
			alert(e);
		}
	});

}

// ----------------------------------------------qq登录分享设置表单校验--------------------------------//
/**
 * 校验输入分享内容不能包含英文单引号
 */
jQuery.validator.addMethod("isContainEQuotes", function(value, element) {
	if (value.indexOf("'") < 0) {
		return this.optional(element) || true;
	} else {
		return this.optional(element) || false;
	}
}, "请不要输入中英文字符");

$("#qqSettingForm").validate({
	errorPlacement : function(error, element) {
		// 错误提示样式,在下方提示
		error.css({
			display : "inline",
			color : "#ee7676",
			position : "relative",
		}).appendTo(element.parent().addClass("error"));

	},
	submitHandler : function() {
		saveQQ();
	},
	rules : {
		qqCaption : {
			required : true,
			maxlength : 32,
			isContainEQuotes : true
		},
		qqSummary : {
			required : true,
			maxlength : 64,
			isContainEQuotes : true
		},
		qqContent : {
			required : true,
			maxlength : 255,
			isContainEQuotes : true
		}
	},
	messages : {
		qqCaption : {
			required : "请输入qq空间标题",
			maxlength : "标题太长了,最多32个汉字或字母"
		},
		qqSummary : {
			required : "请输入qq分享摘要",
			maxlength : "摘要太长了，最多64个汉字或字母"
		},
		qqContent : {
			required : "请输入qq分享内容",
			maxlength : "分享的内容太长了，最多255个汉字或字母"
		}
	}

});

// ----------------------------------------------qq分享登录设置校验--------------------------------//

// ----------------------------------------------微博登录分享设置表单校验--------------------------------//
$("#weiboSettingForm").validate({
	errorPlacement : function(error, element) {
		// 错误提示样式,在下方提示
		error.css({
			display : "inline",
			color : "#ee7676",
			position : "relative",
		}).appendTo(element.parent().addClass("error"));

	},
	submitHandler : function() {
		$.ajax({
			url : ctx + "/sale/uploadMicroBlog", // 用于文件上传的服务器端请求地址
			type : 'post',
			data : {
				microblogName : $("#microblogName").val(),
				microblogShareContent : $("#microblogShareContent").val()
			},
			success : function(data, status) // 服务器成功响应处理函数
			{
				if (data == "true") {
					toastr.success('保存成功');
					setTimeout(function() {
						location.reload();
					}, 1000);

				} else {
					toastr.error('保存失败');
				}
			},
			error : function(data, status, e)// 服务器响应失败处理函数
			{
				toastr.error('保存失败');
			}
		});

	},
	rules : {
		microblogName : {
			required : true,
			maxlength : 32,
			isContainEQuotes : true
		},
		microblogShareContent : {
			required : true,
			maxlength : 64,
			isContainEQuotes : true
		}
	},
	messages : {
		microblogName : {
			required : "请输入您店铺的微博昵称",
			maxlength : "标题太长了,最多32个汉字或字母"
		},
		microblogShareContent : {
			required : "请输入您要分享的微博内容",
			maxlength : "内容太长了，最多64个汉字或字母"
		}
	}

});

// ----------------------------------------------微博登录分享设置表单校验--------------------------------//

// ----------------------------------------------微信登录分享设置表单校验--------------------------------//
$("#wechartSettingForm").validate({
	errorPlacement : function(error, element) {
		// 错误提示样式,在下方提示
		error.css({
			display : "inline",
			color : "#ee7676",
			position : "relative",
		}).appendTo(element.parent().addClass("error"));

	},
	submitHandler : function() {
		// 更新数据库
		$.ajax({
			url : ctx + "/sale/saveWechat", // 请求的url地址
			// async: true, //请求是否异步，默认为异步，这也是ajax重要特性
			data : {
				wechatCommonNum : $("#wechatCommonNum").val(),
				wechatCommonName : $("#wechatCommonName").val(),
				searchType : $("#searchType").val()
			}, // 参数值
			type : "post",
			success : function(req) {
				if (req == "true") {
					toastr.success('保存成功');
					setTimeout(function() {
						location.reload();
					}, 1000);

				} else {

					toastr.error('保存失败');
				}
			}
		});
	},
	rules : {
		wechatCommonNum : {
			required : true,
			maxlength : 32
		},
		wechatCommonName : {
			required : true,
			maxlength : 32
		}
	},
	messages : {
		wechatCommonNum : {
			required : "请输入您的微信公众账号",
			maxlength : "微信公众账号太长了,最多32个字母"
		},
		wechatCommonName : {
			required : "请输入您的微信公众名称",
			maxlength : "微信公众名称太长了,最多32个汉字或字母"
		}
	}

});

// ----------------------------------------------微信登录分享设置表单校验--------------------------------//
// ---------------------------ajaxuploadFile------------------------------------//

// 保存QQ信息
function saveQQ() {
	$.ajax({
		url : ctx + "/sale/saveQQ", // 用于文件上传的服务器端请求地址
		type : 'post',
		data : {
			qqCaption : $("#qqCaption").val(),
			qqSummary : $("#qqSummary").val(),
			qqContent : $("#qqContent").val()

		},
		success : function(data, status) // 服务器成功响应处理函数
		{
			if (data == "true") {

				toastr.success('保存成功');
				setTimeout(function() {
					location.reload();
				}, 1000);

			} else {
				toastr.error('保存失败');
			}
		},
		error : function(data, status, e)// 服务器响应失败处理函数
		{
			toastr.error('保存失败');
		}
	});
	return false;
}
// ---------------------------ajaxuploadFile------------------------------------//

// ---------------------------ajaxuploadFile------------------------------------//

// ------------------------广告倒计时设置表单校验------------------------------//
$("#authAdtimeSetingForm").validate({
	errorPlacement : function(error, element) {
		// 错误提示样式,在下方提示
		error.css({
			display : "inline",
			color : "#ee7676",
			position : "relative",
		}).appendTo(element.parent().addClass("error"));

	},
	submitHandler : function() {
		// 更新数据库
		$.ajax({
			url : ctx + "/storeRouter/setAllRouterCountdown", // 请求的url地址
			// async: true, //请求是否异步，默认为异步，这也是ajax重要特性
			data : {
				second : $("#adTime").val()
			}, // 参数值
			type : "post",
			success : function(req) {
				if (req == "success") {
					toastr.success('设置成功');
				} else {
					toastr.error('设置失败失败');
				}
			}
		});
	},
	rules : {
		second : {
			required : true,
			digits : true,
			range : [ 4, 60 ]
		}
	},
	messages : {
		second : {
			required : "请输入广告倒计时时间",
			range : "倒计时时间最少为4秒，最多为60秒",
			digits : "倒计时时间只能是整数"
		}
	}

});
// ------------------------广告倒计时设置表单校验------------------------------//

// -----------------------超时时间设置表单校验-------------------------------//

$("#authTimeoutForm").validate({
	errorPlacement : function(error, element) {
		// 错误提示样式,在下方提示
		error.css({
			display : "inline",
			color : "#ee7676",
			position : "relative",
		}).appendTo(element.parent().addClass("error"));

	},
	submitHandler : function() {
		// 更新数据库
		$.ajax({
			url : ctx + "/storeRouter/setAllRouterTimeout", // 请求的url地址
			// async: true, //请求是否异步，默认为异步，这也是ajax重要特性
			data : {
				second : $("#authTimeout").val()
			}, // 参数值
			type : "post",
			success : function(req) {
				if (req == "success") {
					toastr.success('保存成功');
				} else if (req == "notFindRouter") {
					toastr.error('保存失败，您还没有添加设备！');
				} else {

					toastr.error('保存失败');
				}
			}
		});
	},
	rules : {
		second : {
			required : true,
			range : [ 10, 1440 ],
			digits : true
		}
	},
	messages : {
		second : {
			required : "请输入认证超时时间",
			digits : "超时时间只能是整数",
			range : "超时时间最少为10分钟，最多为一天"
		}
	}

});
// -------------------------超时时间设置表单校验-------------------//

/**
 * 校验输入的热点名称不能大于20个字母或10个汉字
 */
jQuery.validator.addMethod("chinesemaxlength", function(value, element) {
	var text = $.trim(value);
	var n = 0;
	for (var i = 0; i < text.length; i++) {
		if (text.charCodeAt(i) >= 10000) {
			n++;
		}
	}
	var strLength = n * 2 + (text.length - n);
	return this.optional(element) || strLength > 20 ? false : true;
}, "热点名称最多为10个汉字或20个字母，如果您输入的是汉字及字母的组合则一个汉字相当于两个字母");

// -------------------------ssid设置表单校验------------------------//
$("#ssidSetingForm").validate({
	errorPlacement : function(error, element) {
		// 错误提示样式,在下方提示
		error.css({
			display : "inline",
			color : "#ee7676",
			position : "relative",
		}).appendTo(element.parent().addClass("error"));

	},
	submitHandler : function() {
		// 更新数据库
		$.ajax({
			url : ctx + "/storeRouter/setAllRouterSsid", // 请求的url地址
			// async: true, //请求是否异步，默认为异步，这也是ajax重要特性
			data : {
				ssid : $("#ssid").val()
			}, // 参数值
			type : "post",
			success : function(req) {
				if (req == "success") {
					toastr.success('保存成功');
				} else if (req == "notFindRouter") {
					toastr.error('保存失败，您还没有添加设备！');
				} else {

					toastr.error('保存失败');
				}
			}
		});
	},
	rules : {
		ssid : {
			required : true,
			chinesemaxlength : true
		// maxlength : 8
		}
	},
	messages : {
		ssid : {
			required : "请输入热点名称"// ,
		// maxlength : "热点名称太长了，最长为8个字母或汉字"
		}
	}

});
// -------------------------ssid设置表单校验------------------------//

// -------------------------自定义主页表单校验----------------------//
$("#customHomForm").validate({
	errorPlacement : function(error, element) {
		// 错误提示样式,在下方提示
		error.css({
			display : "inline",
			color : "#ee7676",
			position : "relative",
		}).appendTo(element.parent().addClass("error"));

	},
	submitHandler : function() {
		// 更新数据库
		$.ajax({
			url : ctx + "/storeRouter/setAllRouterUrl", // 请求的url地址
			// async: true, //请求是否异步，默认为异步，这也是ajax重要特性
			data : {
				url : $("#customHom").val()
			}, // 参数值
			type : "post",
			success : function(req) {
				if (req == "success") {
					toastr.success('保存成功');
				} else {

					toastr.error('保存失败');
				}
			}
		});
	},
	rules : {
		url : {
			required : true,
			url : true
		}
	},
	messages : {
		url : {
			required : "请输入自定义主页url",
			url : "网址格式错误，标准格式为'http://xxx.xx.com'"
		}
	}

});
// -------------------------自定义主页表单校验----------------------//

// 我添加的新规则（验证mac地址）
jQuery.validator
		.addMethod(
				"isMac",
				function(value, element) {
					var mac = /^[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}$/;

					return this.optional(element) || mac.test(value);
				}, "请输入正确格式的mac地址，例：15:22:44:6a:22:77");
// ------------------------保存公共白名单---------------------------//
var editProfileFor = $("#edit-profile").validate({
	errorPlacement : function(error, element) {
		// 错误提示样式,在下方提示
		error.css({
			display : "inline",
			color : "#ee7676",
			position : "relative",
		}).appendTo(element.parent().addClass("error"));

	},
	submitHandler : function() {
		// 更新数据库
		$.ajax({
			url : ctx + "/storeRouter/addCommWhiteList", // 请求的url地址
			// async: true, //请求是否异步，默认为异步，这也是ajax重要特性
			data : {
				mac : $("#allMacWhite").val(),
				deviceName : $("#macWhiteRemake").val()
			}, // 参数值
			type : "post",
			success : function(req) {
				if (req == "success") {
					toastr.success('保存成功');
					$("#addMac").hide();
					$("#macSetting").show();
					getCommenWhiteList(1);

				} else if (req == "notFindRouter") {
					toastr.error('保存失败，您还没有添加设备！');
				} else {

					toastr.error('保存失败');
				}
			}
		});
	},
	rules : {
		mac : {
			required : true,
			isMac : true,
			remote : { // 验证mac是否存在
				type : "POST",
				url : ctx + "/storeRouter/commWhiteListIsExist",
				data : {
					mac : function() {
						return $("#allMacWhite").val();
					}
				}
			}
		},
		deviceName : {
			required : true,
			maxlength : 32
		}
	},
	messages : {
		mac : {
			required : "请输入您要填加设备mac",
			remote : "该mac已经添加至白名单列表"
		},
		deviceName : {
			required : "给设备起个名称，方便您后期查询",
			maxlength : "设备名称太长了，最多为32个汉字或字母"
		}
	}

});
// -----------------------保存公共白名单----------------------------//

// ----------------------添加公共域名白名单表单校验----------------//
// 我添加的新规则（验证mac地址）
jQuery.validator
		.addMethod(
				"isUrlOrIp",
				function(value, element) {
					var url = /^([\w-]+\.)+((com)|(net)|(org)|(gov\.cn)|(info)|(cc)|(com\.cn)|(net\.cn)|(org\.cn)|(name)|(biz)|(tv)|(cn)|(mobi)|(name)|(sh)|(ac)|(io)|(tw)|(com\.tw)|(hk)|(com\.hk)|(ws)|(travel)|(us)|(tm)|(la)|(me\.uk)|(org\.uk)|(ltd\.uk)|(plc\.uk)|(in)|(eu)|(it)|(jp))$/;
					var ip = /^(25[0-5]|2[0-4][0-9]|[1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])$/;
					var flag = false;
					if (url.test(value)) {
						flag = true;
					} else if (ip.test(value)) {
						flag = true;
					}
					;
					return this.optional(element) || flag;
				}, "请输入正确格式的域名地址或ip地址，例：www.solarsys.cn 或 192.168.0.1");

var addWebUrlForm = $("#addWebUrlForm").validate({
	errorPlacement : function(error, element) {
		// 错误提示样式,在下方提示
		error.css({
			display : "inline",
			color : "#ee7676",
			position : "relative",
		}).appendTo(element.parent().addClass("error"));

	},
	submitHandler : function() {
		// 更新数据库
		$.ajax({
			url : ctx + "/storeRouter/addCommIpOrYuMing", // 请求的url地址
			// async: true, //请求是否异步，默认为异步，这也是ajax重要特性
			data : {
				ipOrYuMing : $("#allUrlWhite").val()
			}, // 参数值
			type : "post",
			success : function(req) {
				if (req == "success") {
					toastr.success('保存成功');
					$("#addWeb").hide();
					$("#webSetting").show();
					getCommenWhiteYuMingList(1);
				} else if (req == "notFindRouter") {
					toastr.error('保存失败，您还没有添加设备！');
				} else if (req == "isExsit") {
					toastr.warning('该域名白名单已经存在！');
				} else if (req == "isCommList") {
					toastr.warning('该域名已在出厂时设为公共白名单，无需手动添加！');
				} else {
					toastr.w('保存失败');
				}
			}
		});
	},
	rules : {
		ipOrYuMing : {
			required : true,
			isUrlOrIp : true
		/*
		 * , remote : { // 验证域名白名单是否存在 type : "POST", url : ctx +
		 * "/storeRouter/commIpIsExist", data : { ip : function() { return
		 * $("#allUrlWhite").val(); } } }
		 */
		}
	},
	messages : {
		ipOrYuMing : {
			required : "请输入您要添加的域名白名单地址"
		/*
		 * , remote : "该域名白名单已经存在"
		 */
		}
	}

});
// ----------------------添加公共域名白名单表单校验----------------//

// ------------------分页相关-------------------------------//
// 公共白名单分页
function getCommenWhiteList(num) {
	if (num == undefined)
		return;
	if (isNaN(num))
		return;
	// showLoading();
	$.ajax({
		type : "POST",
		url : "../storeRouter/getCommWhiteList",
		data : {
			curPage : num,
			pageSize : 5
		},
		success : function(data) {
			// changeToSuccess(1);
			eval("data = " + data);
			if (data.code == 200) {
				// alert(data.data.data[0].tele);
				// 调用分页
				pageHandle("whitelistPager", "commenWhiteListTable", data.data,
						num, getCommenWhiteList, getWhiteListHtml);
			} else {
				// changeToError(1);
				toastr.error(data.msg);
			}
		},
		error : function() {
			// changeToError(1);
			toastr.error('提交失败！');
		}
	});
}
function getWhiteListHtml(data, tableId) {// 公共白名单分页html
	data = data.data;
	var table = "";
	for (var i = 0; i < data.length; i++) {
		table += "<tr>" + "<td>" + (i + 1) + "</td>" + "<td>" + data[i].mac
				+ "</td>" + "<td>mac</td>" + "<td>" + data[i].deviceName
				+ "</td>" + "<td><button class='btn toDeleteMacBtn' id='"
				+ data[i].mac + "'>&nbsp;移&nbsp;&nbsp;除&nbsp;</button></td>"
				+ "</tr>";
	}

	$("#" + tableId).html(table);
	$(".toDeleteMacBtn").click(function() {
		$('#deleteMac').modal({
			backdrop : 'static'
		});
		$("#deleteWhiteMAC").val(this.id);
	});
}

// 域名白名单分页
function getCommenWhiteYuMingList(num) {
	if (num == undefined)
		return;
	if (isNaN(num))
		return;
	// showLoading();
	$.ajax({
		type : "POST",
		url : "../storeRouter/getCommIpOrYuMing",
		data : {
			curPage : num,
			pageSize : 5
		},
		success : function(data) {
			// changeToSuccess(1);
			eval("data = " + data);
			if (data.code == 200) {
				// alert(data.data.data[0].tele);
				// 调用分页
				pageHandle("whiteYuMinglistPager", "WhiteYuMingListTable",
						data.data, num, getCommenWhiteYuMingList,
						getWhiteYuMingListHtml);
			} else {
				// changeToError(1);
				toastr.error(data.msg);
			}
		},
		error : function() {
			// changeToError(1);
			toastr.error('提交失败！');
		}
	});
}
function getWhiteYuMingListHtml(data, tableId) {// 域名白名单分页html
	data = data.data;
	var table = "";
	for (var i = 0; i < data.length; i++) {
		table += "<tr>" + "<td>" + (i + 1) + "</td>" + "<td>" + (data[i])
				+ "</td>" + "<td><button class='btn toDeleteWebBtn' id='"
				+ data[i] + "'>&nbsp;移&nbsp;&nbsp;除&nbsp;</button></td>"
				+ "</tr>";
	}

	$("#" + tableId).html(table);
	$(".toDeleteWebBtn").click(function() {
		$('#deleteWeb').modal({
			backdrop : 'static'
		});
		$("#deleteWhiteYuMing").val(this.id);
	});
}

// ------------------分页相关-------------------------------//

// flash上传图片以后自动调用此方法
function setPicUrl(url) {
	if (url != null && url != "") {
		if (curUpload == 1) {// QQ上传

			$("#qqSettingForm").show();
			$(".toAuthMainBtn").show();
			$("#qqUpload").hide();

			$(".qqUpload1").hide();
			$(".qqUpload2").show();

			$("#qqShareImgControls").show();
			$("#qqShareImgControls").find("img").attr("src", url).css("width",
					"60%").css("height", "60%");

			$("#qqFlash").empty();

		} else if (curUpload == 2) {// 新浪上传

			$("#weiboSettingForm").show();
			$(".toAuthMainBtn").show();
			$("#weiboUpload").hide();

			$(".weiboUpload1").hide();
			$(".weiboUpload2").show();

			$("#weiboShareImgControls").show();
			$("#weiboShareImgControls").find("img").attr("src", url).css(
					"width", "60%").css("height", "60%");

			$("#weiboFlash").empty();

		}
	}

}

// -------------------------------------------▼▼▼▼手机号登录设置▼▼▼-------------------------------------------------------------//

/**
 * 校验输入的短信内容字符、数字、中文
 */
jQuery.validator.addMethod("isTelContent", function(value, element) {
	var reg = /^[\u4E00-\u9FA5A-Z0-9a-z,.!()*，。！（）-]+$/;
	return this.optional(element) || reg.test(value) ? true : false;
}, "短信内容不能包含特殊字符，可用中英文，。！（）");

/**
 * 校验输入的短信内容是否包含密码（***）
 */
jQuery.validator.addMethod("isContainPwd", function(value, element) {
	var n = value.indexOf("***");
	return this.optional(element) || n < 0 ? false : true;
}, "短信内容必须包含三个***，用以提示密码");

$("#telSettingForm").validate({
	errorPlacement : function(error, element) {
		$('<br/>').appendTo(element.parent()); // 有这句就在下方提示错误信息
		error.css({
			display : "inline",
			color : "#ee7676",
			position : "relative",
		}).appendTo(element.parent().addClass("error"));

	},
	submitHandler : function() {
		var content = $("#content1").val();
		if (content == oldContent) {
			toastr.warning("您当前未做任何修改");
			return;
		}
		$.ajax({
			url : ctx + "/store/saveTelContent",
			data : {
				content : content
			},
			type : "post",
			success : function(data) {
				eval("data = " + data);
				if (data.code == 200) {
					toastr.success('保存成功');
					oldContent = $("#content1").val();
					$("#telSetting").hide();
					$("#authMain").show();
				} else {
					toastr.error(data.msg);
				}
			},
			error : function() {
				toastr.error('请求失败，请稍后再试！');
			}
		});
	},
	rules : {
		content : {
			required : true,
			rangelength : [ 3, 50 ],
			isTelContent : true
//			isContainPwd : true
		}
	},
	messages : {
		content : {
			required : "请输入您的顾客获取密码的短信内容",
			rangelength : "短信内容长度在{0}与{1}字之间"
		}
	}

});

// -------------------------------------------▲▲▲手机号登录设置▲▲▲-------------------------------------------------------------//

// -------------------------------------------▼▼▼▼密码设置▼▼▼-------------------------------------------------------------//

/**
 * 校验输入的密码字符、数字
 */
jQuery.validator.addMethod("isCharacter", function(value, element) {
	var reg = /^[A-Za-z0-9]{3,16}$/;
	reg.test(value);
	return this.optional(element) || reg.test(value);
}, "密码只能由数字、字符串组成");

$("#pwdSettingForm").validate({
	errorPlacement : function(error, element) {
		error.css({
			display : "inline",
			color : "#ee7676",
			position : "relative",
		}).appendTo(element.parent().addClass("error"));

	},
	submitHandler : function() {
		var password = $("#pwdPassword").val();
		if (password == oldPassword) {
			toastr.warning("您当前未做任何修改");
			return;
		}
		$.ajax({
			url : ctx + "/store/savePwdPassword",
			data : {
				password : $("#pwdPassword").val()
			},
			type : "post",
			success : function(data) {
				eval("data = " + data);
				if (data.code == 200) {
					toastr.success('保存成功');
					oldPassword = $("#pwdPassword").val();
					$("#pwdSetting").hide();
					$("#authMain").show();
				} else {
					toastr.error(data.msg);
				}
			},
			error : function() {
				toastr.error('请求失败，请稍后再试！');
			}
		});
	},
	rules : {
		pwdPassword : {
			required : true,
			rangelength : [ 3, 16 ],
			number:true,
			digits:true
		}
	},
	messages : {
		pwdPassword : {
			required : "请输入您的WI-FI密码",
			rangelength : "密码长度在{0}与{1}之间",
			number : "密码只能为数字，请重新输入",
			digits : "密码只能为数字，请重新输入"
		}
	}

});

// -------------------------------------------▲▲▲密码设置▲▲▲-------------------------------------------------------------//

// ---------------------------▼手机号登录设置----------------------------//

// 初始化手机号登录设置
function initTelConfig() {
	if (oldContent == "") {
		oldContent = "凭此手机号和密码可登录全国所有与太阳系(SolarSys)合作的商家Wi-Fi，密码永久有效";
	}
	$("#content1").text(oldContent);
	if (status == 1) {
		$("#status").text("未审核");
	} else if (status == 2) {
		$("#status").text("已通过");
	} else if (status == 3) {
		$("#status").text("已驳回");
	}else{
		$("#status").text("-------");
	}
}

// ---------------------------▲手机号登录设置----------------------------//
