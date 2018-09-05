/**
 * 用户中心js
 */
var imgScal;
var imgAreaSelectApi;


var d = new Date();
var year = d.getFullYear();
var mon = d.getMonth() + 1;
if (mon < 10) {
	mon = "0" + mon;
}
var day = d.getDate();
if (day < 10) {
	day = "0" + day;
}

var d2 = new Date(new Date().getTime() - (7*24*60*60*1000));

var year2 = d2.getFullYear();
var mon2 = d2.getMonth() + 1;
if (mon2 < 10) {
	mon2 = "0" + mon2;
}

var day2 = d2.getDate();
if (day2 < 10) {
	day2 = "0" + day2;
}
//=============初始化日期查询控件，结束时间为当前时间开始时间默认为一周前==============
$("#startTime").attr("value", year2 + "-" +  mon2 + "-" + day2);
$("#endTime").attr("value", year + "-" + mon + "-" + day);
//$("#startTime").datepicker("setValue",2014 + "-" + 11 + "-" +24 );
//$("#endTime").datepicker("setValue",2014 + "-" + 01 + "-" +01 );
//=============end==============
//格式化日期
Date.prototype.format = function(format) {
	var o = {
		"M+" : this.getMonth() + 1, // month
		"d+" : this.getDate(), // day
		"h+" : this.getHours(), // hour
		"m+" : this.getMinutes(), // minute
		"s+" : this.getSeconds(), // second
		"q+" : Math.floor((this.getMonth() + 3) / 3), // quarter
		"S" : this.getMilliseconds()
	// millisecond
	}
	if (/(y+)/.test(format))
		format = format.replace(RegExp.$1, (this.getFullYear() + "")
				.substr(4 - RegExp.$1.length));
	for ( var k in o)
		if (new RegExp("(" + k + ")").test(format))
			format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k]
					: ("00" + o[k]).substr(("" + o[k]).length));
	return format;
};
$(function() {
	search(1);
	$('#personal').addClass("active");
		getUserOrderList(1);//加载用户的订单列表
		
	
	if (navigator.appName == "Microsoft Internet Explorer"
			&& navigator.appVersion.match(/8./i) == "8.") {

		$("#ie81").css("width", "810px");
		$("#ie82").css("width", "828px");
		$("#ie83").css("width", "828px");
	}

	setTimeout("$('#oldPassword').val('')", 200);
	setTimeout("$('#newPassword').val('')", 200);
	setTimeout("$('#confirmPass').val('')", 200);

	var href = window.location.href;
	// var type = 1;
	// if (href.indexOf("?") > 0) {
	// type = href.split("?")[1].split("=")[1];
	// }

	// 初始化上传图片结束
	switch (type) {
	case "1":
		$('#personalTab a[href="#pAccount"]').tab('show');// 我的账户
		break;
	case "2":
		$('#personalTab a[href="#pBaseinfo"]').tab('show');// 基本资料.
		break;
	case "3":
		$('#personalTab a[href="#pOrder"]').tab('show');// 我的订单
		break;
	case "4":
		$('#personalTab a[href="#pSafe"]').tab('show');// 安全中心
		break;
	// case "5":
	// $('#personalTab a[href="#pMessage"]').tab('show');//我的消息
	// break;
	case "6":
		$('#personalTab a[href="#pAvator"]').tab('show');// 修改头像
		break;
	default:
		break;
	}

	$('#personalTab a').click(function(e) {
		if (imgAreaSelectApi) {
			imgAreaSelectApi.cancelSelection();
		}
	});
	$('#personalTab a[href="#pAvator"]').click(function(e) {
		$("#imaPreview1").attr("src", curPath + "/img/logo.jpg");
		$("#storeLogoImg").attr("src", curPath + "/img/drawBackground.jpg");
		resetUploadImg();
		// 回复预览区图片显示像素

		$(".p_photo_l").find('img').css({
			width : "108px",
			height : "108px",
			overflow : "hidden",
			margin : "auto"
		});
		if (imgAreaSelectApi) {
			imgAreaSelectApi.cancelSelection();
		}
	});
	
	// 点击“充值”按钮，跳转到充值页面
	$(".toRechargeBtn").click(function() {
		location.href="../goRecharge";
		//window.open("/merchant/personal/pRecharge.jsp", "_blank");
	});
	// 点击“提现”按钮，跳转到提现页面
	$(".toWithDrawBtn").click(function() {
		location.href="../goWithDraw";
//		window.open("/pay/withdraw.jsp", "_blank");
	});

	// ---------------------------我的账户模块----begin--------------------//
	$("#accountDetail").hide();// 初始化收支详情隐藏

	// 收支详情，返回收支列表
	$("#backToAccountBtn").click(function() {
		$("#accountTable").show();
		$("#accountDetail").hide();
	});
	// 初始化日期控件
	// datepicker plugin 
	$('.datepicker').datepicker({
		format : "yyyy-mm-dd"
	}).on('changeDate', function(ev) {
		$(this).datepicker('hide');
	});
	
	
	// ---------------------------我的账户模块----begin--------------------//

	// 保存基本资料
	$(".doSaveBaseInfoBtn").click(function() {
		// toastr.success('保存成功');
		$("#editUserBaseInfo").submit();
	});

	// ---------------------------我的订单模块----begin--------------------//
	// ”立即支付“按钮，事件
	$(".toPromptPayBtn").each(function() {
		var id = $(this).parents("tr").attr("id");
		$(this).click(function() {
			window.location.href = "pCashier.jsp?id=" + id;
		});
	});

	

	// 除了订单列表之外的div隐藏
	$(".orderOperate").hide();



	// 返回订单列表
	$(".toOrderlistBtn").click(function() {
		$('.orderOperate').hide();
		$('#orderList').show();
	});

	// 投放广告订单中，广告图片预览效果
	$('#adServiceOrderImg').tooltip({
		placement : 'right',
		html : true,
		title : '<img src="../style/img/ad.gif" style="height:50%;" />',
	});

	// ---------------------------我的订单模块----begin--------------------//

	getUserInfo();

	$("#storeLogoImg").load(function() {
		DrawImage(this, 550, 400);
	});
	
	/**
	 * 为搜索日期控件注册时间，完成对开始时间是否小于结束时间的校验
	 */
	$('#startTime').datepicker().on('changeDate', function(ev) {
		var flag = checkDateIsOk($('#startTime').val(),$('#endTime').val());
		if (flag) {
			$("#searchButton").attr("disabled", false);
		} else {
			$("#searchButton").attr("disabled", true);
		}
		
	});
	/**
	 * 为搜索日期控件注册时间，完成对开始时间是否小于结束时间的校验
	 */
	$('#endTime').datepicker().on('changeDate', function(ev) {
		var flag = checkDateIsOk($('#startTime').val(),$('#endTime').val());
		if (flag){
			$("#searchButton").attr("disabled", false);
		} else {
			$("#searchButton").attr("disabled", true);
		}
	});
	

});

// 我添加的新规则（验证 详细地址是否合法）
jQuery.validator.addMethod("checkAddress", function(value, element) {
	var reg = /^[\u4E00-\u9FA5A-Z0-9a-z_-]+$/;
	return this.optional(element) || reg.test(value);
}, "地址不能包含特殊字符");

// 我添加的新规则（验证 姓名是否合法）
jQuery.validator.addMethod("checkRealName", function(value, element) {
	var reg = /^[\u4E00-\u9FA5A-Za-z]+$/;
	return this.optional(element) || reg.test(value);
}, "姓名不能包含特殊字符");

// 我添加的新规则（验证QQ号码是否合法）
jQuery.validator.addMethod("checkQQNum", function(value, element) {
	var reg = /^[1-9][0-9]{4,20}$/;
	return this.optional(element) || reg.test(value);
}, "您输入的QQ号码有误");

var aCity = {
	11 : "北京",
	12 : "天津",
	13 : "河北",
	14 : "山西",
	15 : "内蒙古",
	21 : "辽宁",
	22 : "吉林",
	23 : "黑龙江",
	31 : "上海",
	32 : "江苏",
	33 : "浙江",
	34 : "安徽",
	35 : "福建",
	36 : "江西",
	37 : "山东",
	41 : "河南",
	42 : "湖北",
	43 : "湖南",
	44 : "广东",
	45 : "广西",
	46 : "海南",
	50 : "重庆",
	51 : "四川",
	52 : "贵州",
	53 : "云南",
	54 : "西藏",
	61 : "陕西",
	62 : "甘肃",
	63 : "青海",
	64 : "宁夏",
	65 : "新疆",
	71 : "台湾",
	81 : "香港",
	82 : "澳门",
	91 : "国外"
};
// 我添加的新规则（验证身份证号码是否合法）
jQuery.validator.addMethod("sfzCheck", function(value, element) {
	var iSum = 0;
	if (!/^\d{17}(\d|x)$/i.test(value))
		return this.optional(element) || false;
	value = value.replace(/x$/i, "a");
	if (aCity[parseInt(value.substr(0, 2))] == null)
		return this.optional(element) || false;
	sBirthday = value.substr(6, 4) + "-" + Number(value.substr(10, 2)) + "-"
			+ Number(value.substr(12, 2));
	var d = new Date(sBirthday.replace(/-/g, "/"));
	if (sBirthday != (d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d
			.getDate()))
		return this.optional(element) || false;
	for (var i = 17; i >= 0; i--)
		iSum += (Math.pow(2, i) % 11) * parseInt(value.charAt(17 - i), 11);
	if (iSum % 11 != 1)
		return this.optional(element) || false;
	return this.optional(element) || true;
}, "请您输入正确的身份证号码");

var validEditUserBaseInfo = $("#editUserBaseInfo").validate({
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
		$(".doSaveBaseInfoBtn").attr("disabled", true);

		// 更新数据库
		$.ajax({
			url : "../changeUserinfo", // 请求的url地址
			// async: true, //请求是否异步，默认为异步，这也是ajax重要特性
			data : {
				realName : $("#realName").val(),
				qqnumber : $("#qqnumber").val(),
				// $('input[name="testradio"]').filter(':checked');
				sex : $('input[name="sex"]').filter(':checked').val(),
				address : $("#address").val(),
				sfzNum : $("#sfzNum").val()
			}, // 参数值
			type : "post",
			success : function(req) {
				$(".doSaveBaseInfoBtn").attr("disabled", false);
				if (req == "success") {
					toastr.success('保存成功');
				} else {
					toastr.error('保存失败');
				}
			}
		});
		setTimeout('$(".doSaveBaseInfoBtn").attr("disabled",false);', 3000);
	},
	rules : {
		realName : {// 字符，2-6
			rangelength : [ 2, 6 ],
			checkRealName : true
		},
		qqnumber : {// QQ号
			checkQQNum : true
		},
		address : {// 居住地,1-64
			rangelength : [ 1, 64 ],
			checkAddress : true
		},
		sfzNum : {// 身份证号码
			sfzCheck : true
		}

	},
	messages : {
		realName : {
			rangelength : "请输入2到6位长度的字符",
			checkRealName : "姓名不能包含特殊字符"
		},
		qqnumber : {
			checkQQNum : "您输入的QQ号码有误"
		},
		address : {
			rangelength : "请输入1到64位长度的字符",
			checkAddress : "地址不能包含特殊字符"
		},
		sfzNum : {
			sfzCheck : "请您输入正确的身份证号码"
		}
	}

});

function getUserInfo() {//
	$.ajax({
		url : "../getUserInfo", // 请求的url地址
		// async: true, //请求是否异步，默认为异步，这也是ajax重要特性
		data : {

		}, // 参数值
		type : "post",
		success : function(data) {
			eval("data = " + data);
			if (data.code == 200) {
				$("#email").val(data.data.email);
				$("#telePhone").val(data.data.telePhone);
				$("#realName").val(data.data.realName);
				$("#qqnumber").val(data.data.qqnumber);
				// $("#sex").val(data.data.sex);
				// $("input[type=radio]").attr("checked",false);
				$("input[name='sex'][value=" + data.data.sex + "]").prop(
						"checked", 'checked');
				$("#sfzNum").val(data.data.sfzNum);

			} else {
				toastr.error(data.msg);
			}
		},
		error : function(XMLHttpRequest, textStatus, errorThrown) {
			toastr.error('操作失败，请稍后再试');
		}
	});

}

jQuery.validator
.addMethod(
		"notSameToOld",
		function(value, element) {
			var op = $("#oldPassword").val();
			var np = $("#newPassword").val();
			return this.optional(element) || op != np;
		}, "新密码与旧密码一样！");

var validChangePasswordForm = $("#changePasswordForm")
		.validate(
				{
					errorPlacement : function(error, element) {
						// 错误提示样式,在下方提示
						// $('<br/>').appendTo(element.parent());
						error.css({
							display : "inline",
							color : "#ee7676",
							position : "relative",
						}).appendTo(element.parent().addClass("error"));
					},
					submitHandler : function() {
//						$("#saveNewPassword").attr("disabled", true);
//
//						var op = $("#oldPassword").val();
//						var np = $("#newPassword").val();
//
//						if (op == np) {
//							$("#passError").text("新密码与旧密码一样！");
//							setTimeout( '$("#saveNewPassword").attr("disabled",false);', 1000);
//							return;
//						}

						// 更新数据库
						$
								.ajax({
									url : "../editPassword", // 请求的url地址
									// async: true, //请求是否异步，默认为异步，这也是ajax重要特性
									data : {
										oldPassword : $("#oldPassword").val(),
										newPassword : $("#newPassword").val()
									}, // 参数值
									type : "post",
									success : function(req) {
										$("#saveNewPassword").attr("disabled",
												false);
										if (req == "success") {
											toastr
													.success('修改成功,两秒中后将退出系统，请重新登录!');
											setTimeout(
													'window.location.href="../../comm/logout";',
													2000);
										} else {
											toastr.error('修改失败');
										}
									},
									error : function(XMLHttpRequest,
											textStatus, errorThrown) {
										toastr.error('操作失败，请稍后再试');
									}
								});
						setTimeout(
								'$("#saveNewPassword").attr("disabled",false);',
								3000);
					},
					rules : {
						oldPassword : {
							required : true,
							minlength : 2,
							maxlength : 16
						},
						newPassword : {
							required : true,
							minlength : 6,
							maxlength : 16,
							notSameToOld : true
						},
						confirmPass : {
							required : true,
							equalTo : "#newPassword",
							minlength : 6,
							maxlength : 16
						}

					},
					messages : {
						oldPassword : {
							required : "请填写旧密码",
							minlength : "最小长度为2",
							maxlength : "最大长度为16"
						},
						newPassword : {
							required : "请填写新密码",
							minlength : "最小长度为6",
							maxlength : "最大长度为16"
						},
						confirmPass : {
							required : "请确认新密码",
							equalTo : "两次输入密码不一致",
							minlength : "最小长度为6",
							maxlength : "最大长度为16"
						}
					}

				});

var store_logo_url;
/**
 * 上传店铺logo
 * 
 * @returns
 */
function ajaxFileUpload() {

	showLoading2("上传中···");

	$.ajaxFileUpload({
		url : "../uploadLogo", // 用于文件上传的服务器端请求地址
		type : 'post',
		secureuri : false, // 是否需要安全协议，一般设置为false
		fileElementId : 'file1', // 文件上传域的ID
		dataType : 'json', // 返回值类型 一般设置为json,
		data : {
			maxSize : 1024
		// 限制大小500kb

		},
		success : function(data, status) // 服务器成功响应处理函数
		{
			if (data.isSuccess == "true") {
				changeToSuccess(1);
				toastr.success('加载成功！');
				store_logo_url = data.picUrl;
				$("#kkk").show();
				$("#resetImgBtn").show();
				$("#inputFileDiv").hide();

				data.picUrl = data.picUrl + "?temp=" + Math.random();

				$("#storeLogoImg").attr("src", data.picUrl);
				$("#imaPreview1").attr("src", data.picUrl);
				$("#imaPreview2").attr("src", data.picUrl);
				$("#imaPreview3").attr("src", data.picUrl);

				// 构造imgAreaSelectApi
				imgAreaSelectApi = $('#storeLogoImg').imgAreaSelect({
					persistent : true, // true，选区以外点击不会启用一个新选区（只能移动/调整现有选区）
					instance : true, // true，返回一个imgAreaSelect绑定到的图像的实例，可以使用api方法
					onSelectChange : preview, // 改变选区时的回调函数
					show : true, // 选区会显示
					handles : true, // true，调整手柄则会显示在选择区域内
					resizable : true, // true， 选区面积可调整大小
					minWidth : Math.floor(20), // 选取的最小宽度
					minHeight : Math.floor(20), // 选取的最小高度 *
					aspectRatio : '20:20' // 选区的显示比率 400:300
				});
				

			} else {
				// changeToError(1);
				hideLoading();
				if (data.errorType == "1") {
					toastr.error('上传图片过大，请控制在 1M 以内！');
				}
				if (data.errorType == "2") {
					toastr.error('请上传图片文件！');
				}
				;
			}
		},
		error : function(data, status, e)// 服务器响应失败处理函数
		{
			// changeToError(1);
			hideLoading();
			toastr.error('上传失败！');
		}
	});
	return false;
}
function saveStoreLogo() {

	showLoading2("保存中");

	var areaSelection = imgAreaSelectApi.getSelection();
	$
			.ajax({
				url : "../saveLogo", // 请求的url地址
				// async: true, //请求是否异步，默认为异步，这也是ajax重要特性
				type : "post",
				data : {
					x : Math.round(areaSelection.x1 * imgScal),
					y : Math.round(areaSelection.y1 * imgScal),
					width : Math.round((areaSelection.x2 - areaSelection.x1) * imgScal),
					height : Math.round((areaSelection.y2 - areaSelection.y1) * imgScal)
				},
				success : function(req) {
					// 重新设置x、y、w、h的值

					if (req == "false") {
						changeToError(1);
						toastr.error('保存失败！');
						// 截图失败
					} else {
						changeToSuccess(1);
						toastr.success('保存成功！');
						$("#kkk").hide();
						$("#resetImgBtn").hide();
						$("#inputFileDiv").show();

						$("#oldLogo").attr("src", req);
						$("#leftLogo").attr("src", req);

					}
					imgAreaSelectApi.cancelSelection();
				},
				error : function()// 服务器响应失败处理函数
				{
					changeToError(1);
					toastr.error('保存失败！');
				}
			});
}

/**
 * 重新上传图片
 */
function resetUploadImg() {
	$("#file1").val("");
	$("#inputFileDiv").show();
	$("#resetImgBtn").hide();
	$("#kkk").hide();
}

// preview方法 img图片参数，selection选区参数
function preview(img, selection) {
	// $('div.preview_div img').attr('src',"/sun/allstyle/2.0/img/mm.jpg");

	// preview_photo() 左一的图片调整（与选区的图片显示一致）
	preview_photo('p_photo_l', selection);
	// preview_icon() 左二，左三的图片调整
	// （与选区的图片显示一致，为何不用preview_photo()方法呢，因为左一的是长方形，左二左三是正方形）
}

// preview_photo()方法 左一的图片调整（与选区的图片显示一致）
// div_class是对应div的class
function preview_photo(div_class, selection) {
	var div = $('div.' + div_class);
	// 获取div的宽度与高度
	var width = div.outerWidth();
	var height = div.outerHeight();
	// 显示区域与选区图片比例 宽度之比，高度之比
	// 获取比例的用处是：
	// 当选区的图片大于显示区域时，要相应的缩写图片。
	// 当选区的图片小于显示区域时，要相应的放大图片。
	// selection的宽高之比是4:3,div的宽高之比也是4:3
	// scaleX scaleY之比为1:1
	var scaleX = width / selection.width;
	var scaleY = height / selection.height;

	// css 控制图片的缩放以及偏移量
	// width height 控制img区域的大小，如果只做他俩的限定可以实现图片的缩放
	// 但是有一点缺陷，width height大于div的outerWidth outerHeight时，图片显示不完全
	// 由此我们要引入偏移量 marginLeft marginTop 显示出来的就是局部缩放
	div.find('img').css({
		width : Math.round(scaleX * $('#storeLogoImg').outerWidth()) + 'px',
		height : Math.round(scaleY * $('#storeLogoImg').outerHeight()) + 'px',
		marginLeft : '-' + Math.round(scaleX * selection.x1) + 'px',
		marginTop : '-' + Math.round(scaleY * selection.y1) + 'px'
	});
}

// preview_icon()方法 左二左三的图片调整 和preview_photo()相似 （我们这里要求的缩放的宽高之比1:1不是4:3）
function preview_icon(div_class, selection) {
	var div = $('div.' + div_class);

	// 获取div的宽度与高度 因为这里div的宽度和高度相同
	var height = div.outerWidth();

	// 获取显示区域与选区图片比例
	// 这里因为显示区域的宽度和高度相同
	// 根据显示区域与选区图片的 宽高之比是否一致。一致才能实现等比例缩放如上边的就是4:3与4:3
	// 不能各取显示区域与选区图片 宽度之比 高度之比
	// 这里我们取 高度之比，此值相度 宽度之比大
	var scaleY = height / selection.height;

	// css 控制图片的缩放以及偏移量
	// 这里左边偏移量舍弃了一部分(selection.width - selection.height)/2
	div
			.find('img')
			.css(
					{
						width : Math.round(scaleY
								* $('#storeLogoImg').outerWidth())
								+ 'px',
						height : Math.round(scaleY
								* $('#storeLogoImg').outerHeight())
								+ 'px',
						marginLeft : '-'
								+ Math
										.round(scaleY
												* (selection.x1 + (selection.width - selection.height) / 2))
								+ 'px',
						marginTop : '-' + Math.round(scaleY * selection.y1)
								+ 'px'
					});
}
function DrawImage(ImgD, FitWidth, FitHeight) {
	// 初始化上传图片

	// 按比例缩放图片，并记录比例对截取的像素进行还原
	var image = new Image();
	var imgeJquery = $(image);
	imgeJquery.load(function() {
		if (image.width > 0 && image.height > 0) {
			if (image.width / image.height >= FitWidth / FitHeight) {
				if (image.width > FitWidth) {
					ImgD.width = FitWidth;
					ImgD.height = (image.height * FitWidth) / image.width;
				} else {
					ImgD.width = image.width;
					ImgD.height = image.height;
				}
				imgScal = image.width / ImgD.width;
				// $("#scale").val(image.width/ImgD.width);
			} else {
				if (image.height > FitHeight) {
					ImgD.height = FitHeight;
					ImgD.width = (image.width * FitHeight) / image.height;
				} else {
					ImgD.width = image.width;
					ImgD.height = image.height;
				}
				imgScal = image.width / ImgD.width;
				// $("#scale").val(image.width/ImgD.width);
			}

		}
		if (imgAreaSelectApi) {
			imgAreaSelectApi.setSelection(0, 0, 108, 108);
			imgAreaSelectApi.update();
		}

	});
	image.src = ImgD.src;

}

//比较两个日期大小
function checkDateIsOk(startTime, endTime) {
	var flag = false;	
	var myDate = new Date();
	var dateStr=myDate.getFullYear()+"/"+(myDate.getMonth()+1)+"/"+myDate.getDate();
	
	startTime=startTime.replace(/-/g, "/");
	endTime=endTime.replace(/-/g, "/");
	var startTime = new Date(startTime).getTime();
	var endTime = new Date(endTime).getTime();
	if (startTime > endTime) {
		$("#searchAlertDiv").addClass("alert-error");
		$("#searchAlertSpan").text("错误!");
		$("#serchAlertContent").text("请重新选择查询日期,结束日期不能小于开始日期")
		return false;
	} else {
		$("#searchAlertDiv").removeClass("alert-error");
		$("#searchAlertSpan").text("注意!");
		$("#serchAlertContent").text("查询开始时间不能大于查询结束时间")
		return true;
	}	
}
/**
 * 定义全局变量，接收后台传来的交易记录Json数据，用以展示详情时复用。
 */
var jsonData;
/**
 * 根据用户输入的时间范围查找该范围内的所有财务记录
 * dengfei E-mail:dengfei200857@163.com 
 * 2014-12-04
 */
function search(curPage){
	var businessType = $("#businessType").val();
	var startTime = $('#startTime').val() + " 00:00:00";
	var endTime = $('#endTime').val() + " 23:59:59";
	
		// 更新数据库
		$.ajax({
			url : "../moneyChangeLogList", // 请求的url地址
			// async: true, //请求是否异步，默认为异步，这也是ajax重要特性
			data : {
				curPage : curPage,
				pageSize : 5,
				businessType : businessType,
				startTime : startTime,
				endTime : endTime
				
			}, // 参数值
			type : "post",
			success : function(data){
	        	//changeToSuccess(1);
				eval("data = " + data);
				jsonData = data.data.data;
	        	if(data.code==200){
	        		//调用分页
					pageHandle("pager1","moneyChangeList",data.data,curPage,search,buildTable);
					//为查看详情按钮注册点击事件
					registerClickEven();
	        	}else {
	        		toastr.error(data.msg);
	        	}
	        },error : function() {
	        	//changeToError(1);
	        	toastr.error('提交失败！');
			}
		});
	
}
function buildTable(data,tableId){
	var table="";
	data=data.data;
	for(var i=0;i<data.length;i++){
		table += "<tr> "
				+ "<td>"+(i+1)+"</td> "
				+ "<td>"+data[i].serialNum+"</td> "
				+ "<td>"+changeTypeToString(data[i].changeType)+"</td> "
				+ "<td>"+changeReasonToString(data[i].reason)+"</td> "
				+ "<td>"+data[i].createTime+"</td> "
				+ "<td style='color: #3C0;'>"+amountType(data[i].changeType,data[i].amount,1)+"</td> "
				+ "<td style='color: #F60;'>"+amountType(data[i].changeType,data[i].amount,2)+"</td> "
				+ "<td style='color: #3C0;'>"+data[i].balance.toFixed(2) +"</td> "
				+ "<td> <button class='btn toShowDetalBtn'>&nbsp;查看详细</button> </td> </tr>";
	}
	$("#"+tableId).html(table);
}
/**
 * 
 * @param changeType 业务类型 : 1、收入2、支出3、充值4、提现
 * @return 业务中文名称
 * @author dengfei E-mail:dengfei200857@163.com 
 * date 2014-12-05
 *
 */
function changeTypeToString(changeType){
	var changeTypeChinese = "未知";
	switch(changeType){
		case 1:
			changeTypeChinese = "收入";
			break;
		case 2:
			changeTypeChinese = "支出";
			break;
		case 3:
			changeTypeChinese = "充值";
			break;
		case 4:
			changeTypeChinese = "提现";
			break;
	}
	return changeTypeChinese;
}

/**
 * 
 * @param reason 业务备注 : 3001、充值 3002、平台向用户转账 3003、提现 3004、消费  3005、 校园卡充值
 * @return 业务备注中文名称
 * @author PengL
 * date 2014-12-10
 *
 */
function changeReasonToString(reason){
	var result = "未知";
	switch(reason){
		case "3001":
			result = "充值";
			break;
		case "3002":
			result = "平台向用户转账";
			break;
		case "3003":
			result = "提现";
			break;
		case "3004":
			result = "消费";
			break;
		case "3005":
			result = "校园卡充值";
			break;
	}
	return result;
}
/**
 * 根据业务类型判断出是收入还是支出,并返回相应的值
 * @param changeType 金额类型
 * @param amount 操作金额
 * @param cloumnType 操作的哪一列：1、收入列2、支出列
 * @returns 
 */
function amountType(changeType,amount,cloumnType){
	if((changeType == 1 || changeType ==3) && cloumnType ==1 ){//判断是否是在操作收入列
		
		return "+" + amount.toFixed(2);
	}else if((changeType == 2 || changeType ==4) && cloumnType ==2){//操作的是支出列
		
		return "-" + amount.toFixed(2) ;		
	}
	return "";
}

/**
 * 为所有查看详情按钮注册点击事件
 * @author dengfei E-mail:dengfei200857@163.com 
 */
function registerClickEven(){	// 查看详情按钮，点击执行事件
	$(".toShowDetalBtn").each(function() {

		$(this).click(function() {
			//隐藏列表
			$("#accountTable").hide();
			
			//设置详情内容
			var sid = $(this).parents("tr").children().eq(1).html();
			for(var i =0 ; i < jsonData.length;i++){
	
				if(jsonData[i].serialNum == sid){
					$("#serialnumber").text(jsonData[i].serialNum);
					$("#changeType").text(changeTypeToString(jsonData[i].changeType));
					if(jsonData[i].changeType == 1 || jsonData[i].changeType == 3){//支入类型，如果为支入类型则操作前的金额等于:当前余额-操作金额
						$("#beforeAmount").text((jsonData[i].balance-jsonData[i].amount).toFixed(2) + " (元)");
					}else{
						$("#beforeAmount").text((jsonData[i].balance+jsonData[i].amount).toFixed(2) + " (元)");
					}
					$("#amount").text(jsonData[i].amount.toFixed(2) + " (元)");
					$("#createTime").text(jsonData[i].createTime);
					$("#reason").text(changeReasonToString(jsonData[i].reason));
				}
			}
			
			//显示详情界面
			$("#accountDetail").show();
		});
	});
}

var tnum=0;
function getUserOrderList(num) {
	if (num == undefined)
		return;
	if (isNaN(num))
		return;
	$.ajax({
		type : "POST",
		async : true,
		url : "../getUserOrderList",
		data : {
			curPage : num,
			pageSize : 10
		},
		success : function(data) {
			eval("data = " + data);
			if (data.code == 200) {
				// 调用分页
				pageHandle("pager", "userOrderList", data.data, num, getUserOrderList,
						getUserOrderListTable);
				innitMenu();
				tnum=num;
			} else {
				toastr.error(data.msg);
			}
		},
		error : function(XMLHttpRequest, textStatus, errorThrown) {
			toastr.error('订单数据获取失败');
		}
	});
}

function getUserOrderListTable(data,tableId){
	data = data.data;
	var table = "";
	for(var i=0;i<data.length;i++){
		table+= "<tr id='"+data[i].id+"' > "+
		"<td>"+((tnum==0?0:tnum-1)*10+i+1)+"</td><td>"+data[i].serialNum+"</td> "+
		"<td>"+data[i].name+"</td> "+
		"<td>"+data[i].amount+"&nbsp;元</td> "+
		"<td>"+data[i].createTime+"</td> "+
		getStatueHtml(data[i])+
	"</tr> ";
	}	
	
	$("#" + tableId).html(table);
}

function getStatueHtml(data){
	if(data.status==3){
		return "<td><span class='label'>已取消</span></td> "+
		"<td> "+
			"<div class='btn-group'> "+
				"<button class='btn'>更多设置</button> "+
				"<button data-toggle='dropdown' class='btn dropdown-toggle'> "+
					"<span class='caret'></span> "+
				"</button> "+
				"<ul class='dropdown-menu'> "+
					"<li><a href='javascript:void(0)' class='toOrderDetailBtn'><i class='icon-eye-open'></i> 查看订单</a></li> "+
				"</ul> "+
			"</div> "+
		"</td> ";
	}else if(data.status==2){
		return "<td><span class='label label-success'>已完成</span></td> "+
		"<td> "+
			"<div class='btn-group'> "+
				"<button class='btn'>更多设置</button> "+
				"<button data-toggle='dropdown' class='btn dropdown-toggle'> "+
					"<span class='caret'></span> "+
				"</button> "+
				"<ul class='dropdown-menu'> "+
					"<li><a href='javascript:void(0)' class='toOrderDetailBtn'><i class='icon-eye-open'></i> 查看订单</a></li> "+
				"</ul> "+
			"</div> "+
		"</td> ";
		
	}else{
		return "<td><span class='label label-important'>待支付</span></td> "+
		"<td> "+
			"<div class='btn-group'> "+
				"<button class='btn'>更多设置</button> "+
				"<button data-toggle='dropdown' class='btn dropdown-toggle'> "+
					"<span class='caret'></span> "+
				"</button> "+
				"<ul class='dropdown-menu'> "+
					"<li><a href='javascript:void(0)' class='toPayBtn'  name='"+data.serialNum+"'><i class='icon-tags'></i> 立即支付</a><a "+
						"href='javascript:void(0)' class='toOrderDetailBtn'><i class='icon-eye-open'></i> 查看订单</a><a "+
						"href='javascript:void(0)' class='toDeleteOrderBtn'><i "+
							"class='icon-trash'></i> 取消订单</a></li> "+
				"</ul> "+
			"</div> "+
		"</td> ";
	}
	
}	

function innitMenu(){
	
	// 查看订单详情按钮
	$(".toOrderDetailBtn").each(function() {
		var id = $(this).parents("tr").attr("id");
		var type = $(this).parents("tr").attr("marker");
		$(this).click(function() {
			$('#orderList').hide();
//			if (type == "1") {// 群发短信类订单
//				$('#smsOrderDetail').show();
//			} else if (type == "2") {// 投放广告类订单
//				$('#adServiceOrderDetail').show();
//			} else if (type == "3") {// 屏蔽广告类订单
				$('#adSweepOrderDetail').show();
				//获取订单信息
				getOrderDetail(id);
//			}
		});
	});
	
	// ”取消订单“按钮，事件
	$(".toDeleteOrderBtn").each(function() {
		var id = $(this).parents("tr").attr("id");
		$("#deleteOrderIdHidden").val(id);
		$(this).click(function() {
			$('#deleteOrder').modal({
				backdrop : 'static'
			});
		});
	});

	// 取消订单弹框中，确认取消按钮事件
	$(".doDeleteOrderBtn").click(function() {
		
		var deleteOrderIdHidden =$("#deleteOrderIdHidden").val();
		
		if(deleteOrderIdHidden!=""){
			$.ajax({
				type : "POST",
				async : true,
				url : ctx+"/allLog/updateOrderStatusToFail",
				data : {
					orderId:deleteOrderIdHidden
				},
				success : function(data) {
					if (data=="true") {
						toastr.success('订单取消成功！');
						$('#deleteOrder').modal("hide");
						getUserOrderList(1);
					} else {
						toastr.error('订单取消失败，请刷新再试!');
					}
				},
				error : function(XMLHttpRequest, textStatus, errorThrown) {
					toastr.error('数据获取失败');
				}
			});
		}
		
	});
	
	$(".toPayBtn").click(function(){
		var serialNum = $(this).attr("name");
		$("#orderNumber").val(serialNum);//appManage/gotoCashier
		$("#toPayForm").submit();
		
	});
	
}

function getOrderDetail(orderId) {
	$.ajax({
		type : "POST",
		async : true,
		url : "../getOrderDetail",
		data : {
			orderId:orderId
		},
		success : function(data) {
			eval("data = " + data);
			if (data.code == 200) {
				var product=data.data.product;
				var order=data.data.order;
				$("#statu").html(order.status==1?("未完成"):(order.status==2?"已完成":"已取消"));
				$("#orderNum").html(order.serialNum);
				$("#orderType").html(order.name);
				$("#orderTime").html(order.createTime);
				$("#orderAmount").html(order.amount+"元");
				var chargeType=product.chargeType;
				if (chargeType==1) {//一次性付费
					$("#monthsLabel").hide();
					$("#numOfEqpLabel").hide();
					$("#months").html("");
					$("#numOfEqp").html("");
				}else{//按月付费
					$("#monthsLabel").show();
					$("#numOfEqpLabel").show();
					$("#months").html(order.time+"个月");
					$("#numOfEqp").html(order.num+"台");
				}
			} else {
				toastr.error(data.msg);
			}
		},
		error : function(XMLHttpRequest, textStatus, errorThrown) {
			toastr.error('订单数据获取失败');
		}
	});
}



