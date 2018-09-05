/**
 * 模板装修js
 */

var color = store.theme;// 店铺主题颜色
var curUpload = 1;// 1：免认证页上传，2：认证页上传，3：认证广告页上传
var curImg = "";// 当前操作图片
var curMarker;// 当前图片对应字段名称
var submitFlag = true;

if (navigator.appName == "Microsoft Internet Explorer"
		&& navigator.appVersion.match(/8./i) == "8.") {

	$("#ie81").css("width", "848px");
	$("#ie82").css("width", "848px");
}

$(function() {

	$("#webManage").addClass("active");
	$("#webFlag").removeClass("icon-chevron-right").addClass(
			"icon-chevron-down");
	// 模板装修选中
	$("#sDecorate").addClass("active");
	// 左侧菜单：网站管理
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
	// 初始化单选按钮样式
	$('[data-toggle="radio"]').radiocheck();

	$("#m1").css("border-color", "#2EAFBB");
	// 选择不同的风格，对应不同的风格
	// $(".mbImgs").each(
	// function() {
	// $(this).click(
	// function() {
	// var id = $(this).attr("id");
	// $(".mbImgs").css("border-color", "white");
	// $(this).css("border-color", "#2EAFBB");
	// var imgs = $(".imgRowFluid").find("img");
	// for (var i = 0; i < imgs.length; i++) {
	// imgs[i].src = "../style/img/decorate/" + id
	// + "/" + id + "_" + (i + 1) + ".png";
	//
	// }
	// });
	// });

	// ---------------------------▼搭配色▼----------------------------//

	// 初始化主题颜色选中
	if (typeof (color) == "undefined" || color == null || color == 0) {
		color = "9633865";// 默认颜色
	}
	$("#" + color).css("border-color", "#2EAFBB");

	// 点击色值，执行click事件
	$(".divColor").each(function() {
		$(this).click(function() {
			var _this = $(this);
			_color = $(this).attr("id");// 颜色10进制值
			if (color == _color) {
				toastr.warning("您当前未做任何修改！");
				return false;
			} else {
				showLoading2("保存中...");
				$.ajax({
					type : "POST",
					url : "saveColor",
					data : {
						theme : parseInt(_color)
					},
					success : function(data) {
						if (data == "success") {
							changeToSuccess(2);
							toastr.success("保存成功！");
							$(".divColor").css("border-color", "white");// 所有颜色去掉选中效果
							_this.css("border-color", "#2EAFBB");// 当前颜色选中
							color = _color;
						} else {
							changeToError(2);
							toastr.error("操作失败，请重试！");
						}
					},
					error : function(XMLHttpRequest, textStatus, errorThrown) {
						changeToError(2);
						toastr.error("操作失败，请重试！");
					}
				});

			}

		});
	});

	// ---------------------------▲搭配色▲----------------------------//

	// ----------------------------------▼装修▼---------------------------------------//

	// 三个页面装修切换
	$('input[name="fitmentPage"]').click(
			function() {
				var _this = $('input[name="fitmentPage"]:checked').val();
				$("input[name='fitmentPage'][value=" + _this + "]").attr(
						"checked", 'checked');

				$(".pages").hide();
				$("#page" + _this).fadeIn();
			});

	// ---------------------------▼免认证页装修▼----------------------------//

	// 初始化免认证页数据
	initRenovation1();

	// 店铺名称改变，对应左边手机中店铺名称改变
	$("#storeNameInput1").keyup(function() {
		$("#storeName1").text($("#storeNameInput1").val());
	});

	// 返回免认证页装修主界面
	$(".toPage1Btn").click(function() {
		$("#page1Upload").fadeOut();
		$("#pageRadio").fadeIn();
		$("#page1Content").fadeIn();
		curImg = "";
		curMarker = "";

	});

	// ---------------------------▲免认证页装修▲----------------------------//

	// ---------------------------▼认证页装修▼----------------------------//

	// 初始化认证页数据
	initRenovation2();

	// 店铺名称改变，对应左边手机中店铺名称改变
	$("#storeNameInput2").keyup(function() {
		$("#storeName2").text($("#storeNameInput2").val());
	});

	// 返回免认证页装修主界面
	$(".toPage2Btn").click(function() {

		if (curImg != "") {// 删除
			deleteImg2(1);
		}

		$("#page2Upload").fadeOut();
		$("#pageRadio").fadeIn();
		$("#page2Content").fadeIn();
		curImg = "";
		curMarker = "";

	});
	// ---------------------------▲认证页装修▲----------------------------//

	// ---------------------------▼认证广告页装修▼----------------------------//

	initRenovation3(); // 设置背景图片

	// 广告展现时长改变，对应左边手机中广告展现时长改变
	$("#skipTimesInput").keyup(function() {
		var times = $("#skipTimesInput").val();
		if (times == "") {
			times = "";
		} else {
			times = parseInt(times);
		}
		$("#skipTimes").html("&nbsp;" + times + "&nbsp;");
	});

	// 返回免认证页装修主界面
	$(".toPage3Btn").click(function() {

		if (curImg != "") {// 删除
			deleteImg3(1);
		}

		$("#pageRadio").fadeIn();
		$("#page3Content").fadeIn();
		$("#page3Upload").fadeOut();
		$("#adsHrefs").fadeOut();
		curImg = "";
		curMarker = "";

	});
	// ---------------------------▲认证广告页装修▲----------------------------//

	// --------------------------------------▲装修▲-----------------------------------------//
});

// ------------------------------------------------▼免认证页装修▼------------------------------------------------//

// 初始化免认证页数据
function initRenovation1() {

	if (store != null) {

		// 回显店铺名称
		if (store.name != null && store.name != "") {
			$("#storeName1").text(store.name);
			$("#storeNameInput1").val(store.name);
			$("#storeName2").text(store.name);
			$("#storeNameInput2").val(store.name);
		}

		var imgs = [];
		if (null != store.imgUrl1 && "" != store.imgUrl1) {
			imgs.push([ "imgUrl1", store.imgUrl1 ]);
		}
		if (null != store.imgUrl2 && "" != store.imgUrl2) {
			imgs.push([ "imgUrl2", store.imgUrl2 ]);
		}
		if (null != store.imgUrl3 && "" != store.imgUrl3) {
			imgs.push([ "imgUrl3", store.imgUrl3 ]);
		}
		if (null != store.imgUrl4 && "" != store.imgUrl4) {
			imgs.push([ "imgUrl4", store.imgUrl4 ]);
		}

		if (imgs != null && imgs.length > 0) {
			var ul = $("#window_bg1");
			var ulDiv = $("#page1Form").find(".zxImgUlDiv");
			ul.empty();
			for (var i = 0; i < imgs.length; i++) {
				// 手机中图片显示
				var li = $("<li/>").attr("marker", imgs[i][0]).appendTo(ul);
				var src = "http://" + imageServer + imgs[i][1];
				var img = $("<img/>").css("width", "271px").css("height",
						"465px").attr("src", src).appendTo(li);
				var _liDiv = ulDiv[i];
				_liDiv = $(_liDiv);
				_liDiv.attr("id", imgs[i][0]);
				var input = _liDiv.find("input");
				input.removeClass("toUploadImg1Btn").val("背景图" + (i + 1));
				var i1 = $("<i/>").addClass(" icon-eye-open i2 showI").css(
						"cursor", "pointer").css("color", "green").appendTo(
						_liDiv);
				var i2 = $("<i/>").addClass(" icon-trash i3 deleteI").css(
						"cursor", "pointer").css("color", "red").attr("url",
						imgs[i][1]).appendTo(_liDiv);

			}

		}

	}

	setIphone1();
	// 初始化事件
	initEvent1();

}

// 免认证页装修保存校验
$("#page1Form").validate({
	errorPlacement : function(error, element) {
		// 错误提示样式,在下方提示
		$('<br/>').appendTo(element.parent()); // 有这句就在下方提示错误信息
		error.css({
			display : "inline",
			color : "#ee7676",
			position : "relative",
		}).appendTo(element.parent().addClass("error"));
	},
	submitHandler : function(form) {
		doSavePage1Form();
	},
	rules : {
		name : {// 店铺名称
			required : true,
			maxlength : 10
		}
	},
	messages : {
		name : {
			required : "请输入店铺名称",
			maxlength : "店铺名称最大长度为{0}"
		}
	}
});

// 点击上传图片，转向上传图片模块
function toUploadImg1() {

	curImg = 1;
	curUpload = 1;

	var lis = $("#window_bg1").find("li");

	if (lis.length < 4) {

		curImg = "";

		$("#pageRadio").hide();
		$("#page1Content").hide();
		$("#page1Upload").show();
		$("#flash1").empty();
		showflash(curPath + "/swf/background.swf", "800px", "680px", "flash1",
				ctx + "/store/bigPicUpload");// 显示flash

	} else {

		toastr.warning("您当前只可上传四张图片");
		return false;

	}

}
// 免认证页保存
function doSavePage1Form() {

	showLoading2("保存中...");

	var name = $("#storeNameInput1").val();
	$.ajax({
		type : "POST",
		url : "saveStoreName",
		data : {
			name : name
		},
		success : function(data) {
			if (data == "true") {

				changeToSuccess(2);
				$("#storeNameInput2").val(name);
				$("#storeName2").text(name);

			} else {
				changeToError(2);
			}
		},
		error : function(XMLHttpRequest, textStatus, errorThrown) {
			changeToError(2);
		}
	});

}

// 初始化事件
function initEvent1() {

	$(".toUploadImg1Btn").unbind("click");
	// 去上传图片模块
	$(".toUploadImg1Btn").click(function() {
		toUploadImg1();
	});

	$("#page1Content").find(".deleteI").unbind("click");
	// 删除图片，click，弹出删除提示框
	$("#page1Content").find(".deleteI").click(function() {
		var marker = $(this).parent().attr("id");
		var url = $(this).attr("url");
		var flag = $(this).closest("form").attr("id").substring(4, 5);
		toDeleteImg(marker, url, flag);
	});
	$(".doDeleteImgBtn").unbind("click");
	// 删除弹框中，确认删除按钮，click
	$(".doDeleteImgBtn").click(function() {
		doDeleteImg();
	});
	// 查看按钮，鼠标移上，显示该图片
	$("#page1Content").find(".showI").mouseenter(
			function() {
				var _this = $(this).parent().attr("id");
				$('#window_bg1').cycle('destroy');
				$('#window_bg1').cycle(
						{
							fx : 'scrollRight', // 运动方式向右转动
							speed : 50, // 转动速度，数值越小越快
							pause : true,
							timeout : 2000,
							startingSlide : $('#window_bg1').find(
									"li[marker='" + _this + "']").index()
						});
				$('#window_bg1').cycle('pause');
			}).mouseleave(function() {
		$('#window_bg1').cycle('resume');
	});

}

/**
 * 设置窗体
 */
function setIphone1() {

	var w = '274px'; // 获取内部窗口的宽
	var h = '486px'; // 获取内部窗口的高

	// 设置背景的宽高
	$("#window_bg1").css({
		"width" : w,
		"height" : h
	});
	// 设置背景图片的缩放
	$("ul#window_bg1 li").css({
		"width" : w,
		"height" : h
	});

	$("ul#window_bg1 li img").css("width", w);

	var size = $("ul#window_bg1 li img").length;

	if (size > 1) {

		$('#window_bg1').cycle({
			fx : 'scrollRight', // 运动方式向右转动
			speed : 50, // 转动速度，数值越小越快
			pause : true,
			timeout : 2000
		});

	} else {

		$("ul#window_bg1 li").css("z-index", "1");

	}

}
// 删除免认证页图片
function deleteImg1() {

	showLoading2("删除中...");

	$
			.ajax({
				type : "POST",
				url : "delPic",
				data : {
					delBigPicUrl : curImg
				},
				success : function(msg) {

					if (msg != null && msg != "") {

						if (msg = "success") {

							changeToSuccess(2);
							toastr.success("删除成功！");

							$('#deleteImg').modal("hide");

							var ul = $("#window_bg1");
							var liSize = $("#window_bg1").find("li").length;

							if (liSize == 1) {

								ul.empty();

								var li = $("<li/>").appendTo(ul);
								var img = $("<img/>")
										.css("width", "271px")
										.css("height", "465px")
										.attr(
												"src",
												curPath
														+ "/img/decorate/01.jpg")
										.appendTo(li);

							} else {

								var li = $("#window_bg1").find(
										"li[marker='" + curMarker + "']");
								li.remove();

							}

							var objDiv = $("#page1Form").find(
									".zxImgUlDiv[id='" + curMarker + "']");

							objDiv.find("input").addClass("toUploadImg1Btn")
									.val("未上传");
							objDiv.find(".i2,.i3").remove();
							objDiv.removeAttr("id");

							curImg = "";
							curMarker = "";

							// 设置循环
							setIphone1();
							initEvent1();

						} else {

							changeToError(2);
							toastr.error("删除失败，请重试！");

						}
					} else {

						changeToError(2);
						toastr.error("删除失败，请重试！");

					}
				},
				error : function(XMLHttpRequest, textStatus, errorThrown) {

					changeToError(2);
					toastr.error("删除失败，请重试！");
				}
			});

}

/**
 * 在右侧表单中，插入新上传成功的图片
 * 
 * @param window_bg
 *            左侧手机div
 * @param content
 *            //左侧图片UL
 * @param img
 *            //新图片url
 * @param name
 *            //新图片所在字段
 * @param width
 *            //图片宽
 * @param height
 *            //图片高
 */
function insertLi1(window_bg, content, img, name, width, height) {

	var ul = window_bg;

	var obj = ul.children()[0];
	$obj = $(obj);

	if (typeof ($obj.attr("marker")) == "undefined") {// 当前图片为默认数据
		ul.empty();
	}

	var li = $("<li/>").attr("marker", name).prependTo(ul);
	var src = "http://" + imageServer + img;
	var img = $("<img/>").css("width", width).css("height", height).attr(
			"marker", name).attr("src", src).appendTo(li);

	var ulDiv = content.find(".zxImgUlDiv");

	for (var i = 0; i < ulDiv.length; i++) {

		var obj = ulDiv[i];
		$obj = $(obj);

		if (typeof ($obj.attr("id")) == "undefined") {// 当前文本框没有数据，插入

			$obj.attr("id", name);
			var input = $obj.find("input");
			input.removeClass("toUploadImg1Btn").val("背景图" + (i + 1));
			var i1 = $("<i/>").addClass(" icon-eye-open i2 showI").css(
					"cursor", "pointer").css("color", "green").appendTo($obj);
			var i2 = $("<i/>").addClass(" icon-trash i3 deleteI").css("cursor",
					"pointer").css("color", "red").attr("url", img).appendTo(
					$obj);

			return;

		}

	}

}

// ----------------------------------------------▲免认证页装修▲--------------------------------------//

// -----------------------------------------------▼认证页装修▼----------------------------------//

// 初始化认证页数据
function initRenovation2() {

	if (store != null) {

		// 回显店铺名称
		if (store.name != null && store.name != "") {
			$("#storeName2").text(store.name);
			$("#storeNameInput2").val(store.name);
			$("#storeName1").text(store.name);
			$("#storeNameInput1").val(store.name);
		}

		var imgs = [], desc = [];
		if (null != store.imgUrl5 && "" != store.imgUrl5) {
			imgs.push([ "imgUrl5", store.imgUrl5 ]);
			desc.push([ "imgDesc5", store.imgDesc5 ]);
		}
		if (null != store.imgUrl6 && "" != store.imgUrl6) {
			imgs.push([ "imgUrl6", store.imgUrl6 ]);
			desc.push([ "imgDesc6", store.imgDesc6 ]);
		}
		if (null != store.imgUrl7 && "" != store.imgUrl7) {
			imgs.push([ "imgUrl7", store.imgUrl7 ]);
			desc.push([ "imgDesc7", store.imgDesc7 ]);
		}
		if (null != store.imgUrl8 && "" != store.imgUrl8) {
			imgs.push([ "imgUrl8", store.imgUrl8 ]);
			desc.push([ "imgDesc8", store.imgDesc8 ]);
		}

		if (imgs != null && imgs.length > 0) {
			var ul = $("#window_bg2");
			var ulDiv = $("#page2Form").find(".zxImgUlDiv");
			var ulDesc = $("#shade");
			ul.empty();
			ulDesc.empty();
			for (var i = 0; i < imgs.length; i++) {
				// 手机中图片显示
				var li = $("<li/>").attr("marker", imgs[i][0]).appendTo(ul);
				var src = "http://" + imageServer + imgs[i][1];
				var img = $("<img/>").css("width", "274px").css("height",
						"154px").attr("src", src).appendTo(li);

				var _desc = $("<li/>").text(desc[i][1]).attr("marker",
						imgs[i][0]).appendTo(ulDesc);

				var _liDiv = ulDiv[i];
				_liDiv = $(_liDiv);
				_liDiv.attr("id", imgs[i][0]);
				var input = _liDiv.find("input");
				if (desc[i][1] == "") {
					input.removeClass("toUploadImg2Btn").removeAttr("readonly")
							.attr("placeholder", "请输入标题").val("未上传");
				} else {
					input.removeClass("toUploadImg2Btn").removeAttr("readonly")
							.val(desc[i][1]);
				}
				var i1 = $("<i/>").addClass(" icon-eye-open i2 showI").css(
						"cursor", "pointer").css("color", "green").appendTo(
						_liDiv);
				var i2 = $("<i/>").addClass(" icon-trash i3 deleteI").css(
						"cursor", "pointer").css("color", "red").attr("url",
						imgs[i][1]).appendTo(_liDiv);

			}

		}

	}

	setIphone2();

	// 初始化事件
	initEvent2();

}

// 认证页保存
function doSavePage2Form() {

	showLoading2("保存中...");

	var name = $("#storeNameInput2").val();
	var inputS = $("#page2Form").find(".zxImgUlDiv");
	var desc = "";
	for (var i = 0; i < inputS.length; i++) {
		var obj = inputS[i];
		var $obj = $(obj);
		if ($obj.attr("id") != "" && typeof ($obj.attr("id")) != "undefined") {// 当前是标题
			desc += $obj.attr("id") + ":" + $(inputS[i]).find("input").val()
					+ ",";
		}
	}

	$.ajax({
		type : "POST",
		url : "savePicDescribe",
		data : {
			name : name,
			desc : desc
		},
		success : function(msg) {

			if ("success" == msg) {

				$("#storeNameInput1").val(name);
				$("#storeName1").text(name);

				var ulDesc = $("#shade li");

				for (var i = 0; i < ulDesc.length; i++) {

					var obj = ulDesc[i];
					$obj = $(obj);

					var values = desc.split(",");

					for (var j = 0; j < values.length; j++) {

						if ($obj.attr("marker") == values[j].split(":")[0]) {
							$obj.text(values[j].split(":")[1]);
						}

					}

				}

				changeToSuccess(2);
				toastr.success("保存成功！");

			} else {

				changeToError(2);
				toastr.error("保存失败，请重试！");

			}
		},
		error : function(XMLHttpRequest, textStatus, errorThrown) {

			changeToError(2);
			toastr.error("保存失败，请重试！");

		}
	});

}

// 初始化事件
function initEvent2() {

	$(".toUploadImg2Btn").unbind("click");

	// 去上传图片模块
	$(".toUploadImg2Btn").click(function() {
		toUploadImg2();
	});

	$("#page2Content").find(".deleteI").unbind("click");
	// 删除图片，click，弹出删除提示框
	$("#page2Content").find(".deleteI").click(function() {
		var marker = $(this).parent().attr("id");
		var url = $(this).attr("url");
		var flag = $(this).closest("form").attr("id").substring(4, 5);
		toDeleteImg(marker, url, flag);
	});
	$(".doDeleteImgBtn").unbind("click");
	// 删除弹框中，确认删除按钮，click
	$(".doDeleteImgBtn").click(function() {
		doDeleteImg();
	});

	// 查看按钮，鼠标移上，显示该图片
	$("#page2Content").find(".showI").mouseenter(
			function() {
				var _this = $(this).parent().attr("id");
				$('#window_bg2').cycle('destroy');
				$('#shade').cycle('destroy');
				$('#window_bg2').cycle(
						{
							fx : 'scrollRight', // 运动方式向右转动
							speed : 50, // 转动速度，数值越小越快
							// pause : true,
							timeout : 2000,
							startingSlide : $('#window_bg2').find(
									"li[marker='" + _this + "']").index()
						});
				$('#shade').cycle(
						{
							fx : 'scrollRight', // 运动方式向右转动
							speed : 50, // 转动速度，数值越小越快
							// pause : true,
							timeout : 2000,
							startingSlide : $('#shade').find(
									"li[marker='" + _this + "']").index()
						});
				$('#window_bg2').cycle('pause');
				$('#shade').cycle('pause');
			}).mouseleave(function() {
		$('#window_bg2').cycle('resume');
		$('#shade').cycle('resume');
	});

}

// 点击上传图片，转向上传图片模块
function toUploadImg2() {

	curUpload = 2;

	var lis = $("#window_bg2").find("li");

	curImg = "";

	if (lis.length < 4) {

		$("#pageRadio").hide();
		$("#page2Content").hide();
		$("#ImgDescs").hide();
		$("#flash2").show();
		$("#flash2").empty();
		$("#page2Upload").show();
		showflash(curPath + "/swf/banner.swf", "800px", "680px", "flash2", ctx
				+ "/store/bannerUpload");// 显示flash

	} else {

		toastr.warning("您当前只可上传四张图片");
		return false;

	}

}

/**
 * 设置窗体
 */
function setIphone2() {

	var w = '274px'; // 获取内部窗口的宽
	var h = '154px'; // 获取内部窗口的高

	var w2 = '274px'; // 获取内部窗口的宽
	var h2 = '33px'; // 获取内部窗口的高

	// 设置背景的宽高
	$("#window_bg2").css({
		"width" : w,
		"height" : h
	});
	// 设置背景图片的缩放
	$("ul#window_bg2 li").css({
		"width" : w,
		"height" : h
	});
	$("ul#window_bg2 li img").css("width", w);

	$("#shade").css({
		"width" : w2,
		"height" : h2
	});
	$("ul#shade li").css({
		"width" : w2,
		"height" : h2
	});

	var size = $("ul#window_bg2 li img").length;

	if (size > 1) {

		$('#window_bg2').cycle({
			fx : 'scrollRight', // 运动方式向右转动
			speed : 50, // 转动速度，数值越小越快
			// pause : true,
			timeout : 2000
		});

		$('#shade').cycle({
			fx : 'scrollRight', // 运动方式向右转动
			speed : 50, // 转动速度，数值越小越快
			// pause : true,
			timeout : 2000
		});

	} else {

		$("ul#window_bg2 li").css("z-index", "1");
		$("ul#shade li").css("z-index", "1");

	}

}

// 认证页装修保存校验
$("#page2Form").validate({
	errorPlacement : function(error, element) {
		// 错误提示样式,在下方提示
		$('<br/>').appendTo(element.parent()); // 有这句就在下方提示错误信息
		error.css({
			display : "inline",
			color : "#ee7676",
			position : "relative",
		}).appendTo(element.parent().addClass("error"));
	},
	submitHandler : function(form) {
		doSavePage2Form();
	},
	rules : {
		name : {// 店铺名称
			required : true,
			maxlength : 10
		},
		input1 : {
			required : true,
			maxlength : 8
		},
		input2 : {
			required : true,
			maxlength : 8
		},
		input3 : {
			required : true,
			maxlength : 8
		},
		input4 : {
			required : true,
			maxlength : 8
		}
	},
	messages : {
		name : {
			required : "请输入店铺名称",
			maxlength : "店铺名称最大长度为{0}"
		},
		input1 : {
			required : "请输入图片标题",
			maxlength : "图片标题最大长度为8"
		},
		input2 : {
			required : "请输入图片标题",
			maxlength : "图片标题最大长度为8"
		},
		input3 : {
			required : "请输入图片标题",
			maxlength : "图片标题最大长度为8"
		},
		input4 : {
			required : "请输入图片标题",
			maxlength : "图片标题最大长度为8"
		}
	}
});

// 保存单个banner的描述信息
function doSaveOneBanner() {

	showLoading2("保存中...");

	var desc = curMarker + ":" + $("#bannerFormDesc").val() + ",";

	$.ajax({
		type : "POST",
		url : "saveBanner",
		data : {
			desc : desc
		},
		success : function(msg) {
			if (msg == "true") {

				changeToSuccess(2);

				toastr.success("保存成功！");

				$("#pageRadio").show();
				$("#page2Content").show();
				$("#page2Upload").hide();
				$("#ImgDescs").hide();
				$("#flash2").show();

				// 在右侧表单中，插入新上传成功的图片
				insertLi2($("#window_bg2"), $("#page2Content"), curImg,
						curMarker, $("#bannerFormDesc").val(), 274, 154);

				$("#bannerFormDesc").val("");

				// 设置循环
				setIphone2();
				// 初始化事件
				initEvent2();

			} else {

				changeToError(2);

				toastr.error("保存失败，请重试！");
			}

		},
		error : function(XMLHttpRequest, textStatus, errorThrown) {
			changeToError(2);

			toastr.error("保存失败，请重试！");
		}
	});

}

// 免认证页装修保存校验
$("#bannerForm").validate({
	errorPlacement : function(error, element) {
		error.css({
			display : "inline",
			color : "#ee7676",
			position : "relative",
		}).appendTo(element.parent().addClass("error"));
	},
	submitHandler : function(form) {
		doSaveOneBanner();
	},
	rules : {
		desc : {// 广告标题
			required : true,
			maxlength : 8
		}
	},
	messages : {
		desc : {
			required : "请输入广告标题",
			maxlength : "广告标题最大长度为8"
		}
	}
});

// 删除认证页图片
function deleteImg2(type) {

	if (type == 2) {
		showLoading2("删除中...");
	}

	$.ajax({
		type : "POST",
		url : "delBannerPic",
		data : {
			delUrl : curImg
		},
		success : function(msg) {

			if (msg != null && msg != "") {

				if (msg = "true") {

					if (type == 2) {
						changeToSuccess(2);
						toastr.success("删除成功！");
					}

					$('#deleteImg').modal("hide");

					var ul = $("#window_bg2");
					var liSize = $("#window_bg2").find("li").length;
					var ulDesc = $("#shade");

					if (liSize == 1) {

						ul.empty();
						ulDesc.empty();

						var li = $("<li/>").appendTo(ul);
						var img = $("<img/>").css("width", "274px").css(
								"height", "154px").attr("src",
								curPath + "/img/decorate/02.jpg").appendTo(li);

						var li = $("<li/>").text("广告标题").appendTo(ulDesc);

					} else {

						var li = $("#window_bg2").find(
								"li[marker='" + curMarker + "']");
						li.remove();

						var li = $("#shade").find(
								"li[marker='" + curMarker + "']");
						li.remove();

					}

					var objDiv = $("#page2Form").find(
							".zxImgUlDiv[id='" + curMarker + "']");

					objDiv.find("input").addClass("toUploadImg2Btn").attr(
							"readonly", "readonly").attr("placeholder", "未上传")
							.val("未上传");
					objDiv.find(".i2,.i3").remove();
					objDiv.removeAttr("id");

					curImg = "";
					curMarker = "";

					// 设置循环
					setIphone2();
					initEvent2();

				} else {

					if (type == 2) {
						changeToError(2);
						toastr.error("删除失败，请重试！");
					}

				}
			} else {

				if (type == 2) {
					changeToError(2);
					toastr.error("删除失败，请重试！");
				}

			}
		},
		error : function(XMLHttpRequest, textStatus, errorThrown) {

			if (type == 2) {
				changeToError(2);
				toastr.error("删除失败，请重试！");
			}

		}
	});

}

/**
 * 在右侧表单中，插入新上传成功的图片
 * 
 * @param window_bg
 *            左侧手机div
 * @param content
 *            //左侧图片UL
 * @param img
 *            //新图片url
 * @param name
 *            //新图片所在字段
 * @param width
 *            //图片宽
 * @param height
 *            //图片高
 */
function insertLi2(window_bg, content, img, name, desc, width, height) {

	var ul = window_bg;
	var ulDesc = $("#shade");

	var obj = ul.children()[0];
	$obj = $(obj);

	if (typeof ($obj.attr("marker")) == "undefined") {// 当前图片为默认数据
		ul.empty();
		ulDesc.empty();
	}

	var li = $("<li/>").attr("marker", name).prependTo(ul);
	var src = "http://" + imageServer + img;
	var img = $("<img/>").css("width", width).css("height", height).attr(
			"marker", name).attr("src", src).appendTo(li);

	var li = $("<li/>").text(desc).attr("marker", name).prependTo(ulDesc);

	var ulDiv = content.find(".zxImgUlDiv");

	for (var i = 0; i < ulDiv.length; i++) {

		var obj = ulDiv[i];
		$obj = $(obj);

		if (typeof ($obj.attr("id")) == "undefined") {// 当前文本框没有数据，插入

			$obj.attr("id", name);
			var input = $obj.find("input");
			input.removeClass("toUploadImg2Btn").attr("readonly", false).val(
					desc);
			input.unbind("click");
			var i1 = $("<i/>").addClass(" icon-eye-open i2 showI").css(
					"cursor", "pointer").css("color", "green").appendTo($obj);
			var i2 = $("<i/>").addClass(" icon-trash i3 deleteI").css("cursor",
					"pointer").css("color", "red").attr("url", img).appendTo(
					$obj);

			return;

		}

	}

}
// ---------------------------------------------▲认证页装修▲----------------------------//

// -----------------------------------------------▼认证广告页装修▼----------------------------------//

// 初始化认证广告页数据
function initRenovation3() {

	if (store != null) {

		var skipTimes = store.countdown;
		if (skipTimes == null || skipTimes == 0) {
			skipTimes = 8;
		}
		$("#skipTimesInput").val(skipTimes);
		$("#skipTimes").text(skipTimes);

	}

	if (storeAds != null && storeAds != -1 && storeAds.length > 0) {

		var ul = $("#window_bg3");
		ul.empty();
		var ulDiv = $("#page3Form").find(".zxImgUlDiv");

		for (var i = 0; i < storeAds.length; i++) {
			var obj = storeAds[i];
			if (obj != null) {
				var li = $("<li/>").attr("marker", obj.id).appendTo(ul);
				var src = "http://" + imageServer + obj.imgUrl;
				var img = $("<img/>").css("width", "271px").css("height",
						"465px").attr("src", src).appendTo(li);
				var _liDiv = ulDiv[i];
				_liDiv = $(_liDiv);
				_liDiv.attr("id", obj.id);
				var input = _liDiv.find("input");
				input.removeClass("toUploadImg3Btn").removeAttr("readonly")
						.attr("placeholder", "请输入广告链接").val(obj.url);

				var i1 = $("<i/>").addClass(" icon-eye-open i2 showI").css(
						"cursor", "pointer").css("color", "green").appendTo(
						_liDiv);
				var i2 = $("<i/>").addClass(" icon-trash i3 deleteI").css(
						"cursor", "pointer").css("color", "red").attr("url",
						obj.imgUrl).appendTo(_liDiv);
			}
		}
	}

	setIphone3();

	initEvent3();
}

// 初始化事件3
function initEvent3() {

	$(".toUploadImg3Btn").unbind("click");

	// 去上传图片模块
	$(".toUploadImg3Btn").click(function() {
		toUploadImg3();
	});

	$("#page3Content").find(".deleteI").unbind("click");
	// 删除图片，click，弹出删除提示框
	$("#page3Content").find(".deleteI").click(function() {
		var marker = $(this).parent().attr("id");
		var url = $(this).attr("url");
		var flag = $(this).closest("form").attr("id").substring(4, 5);
		toDeleteImg(marker, url, flag);
	});
	$(".doDeleteImgBtn").unbind("click");
	// 删除弹框中，确认删除按钮，click
	$(".doDeleteImgBtn").click(function() {
		doDeleteImg();
	});

	// 查看按钮，鼠标移上，显示该图片
	$("#page3Content").find(".showI").mouseenter(
			function() {
				var _this = $(this).parent().attr("id");
				$('#window_bg3').cycle('destroy');
				$('#window_bg3').cycle(
						{
							fx : 'scrollRight', // 运动方式向右转动
							speed : 50, // 转动速度，数值越小越快
							pause : true,
							timeout : 2000,
							startingSlide : $('#window_bg3').find(
									"li[marker='" + _this + "']").index()
						});
				$('#window_bg3').cycle('pause');
			}).mouseleave(function() {
		$('#window_bg3').cycle('resume');
	});
}

// 点击上传图片，转向上传图片模块
function toUploadImg3() {

	curUpload = 3;

	var lis = $("#window_bg3").find("li");

	curImg = "";

	if (lis.length < 4) {

		$("#pageRadio").hide();
		$("#page3Content").hide();
		$("#page3Upload").show();
		$("#flash3").show();
		$("#flash3").empty();
		showflash(curPath + "/swf/background.swf", "800px", "680px", "flash3",
				ctx + "/storeAds/uploadStoreAds");// 显示flash

	} else {

		toastr.warning("您当前只可上传四张图片");
		return false;

	}

}

// 删除认证页图片
function deleteImg3(type) {

	if (type == 2) {
		showLoading2("删除中...");
	}

	$.ajax({
		type : "POST",
		url : "deleteAds",
		data : {
			adsId : curMarker
		},
		success : function(msg) {

			if (msg != null && msg != "") {

				if (msg = "success") {

					if (type == 2) {
						changeToSuccess(2);
						toastr.success("删除成功！");
					}

					$('#deleteImg').modal("hide");

					var ul = $("#window_bg3");
					var liSize = $("#window_bg3").find("li").length;

					if (liSize == 1) {

						ul.empty();

						var li = $("<li/>").appendTo(ul);
						var img = $("<img/>").css("width", "274px").css(
								"height", "465px").attr("src",
								curPath + "/img/decorate/01.jpg").appendTo(li);

					} else {

						var li = $("#window_bg3").find(
								"li[marker='" + curMarker + "']");
						li.remove();

					}

					var objDiv = $("#page3Form").find(
							".zxImgUlDiv[id='" + curMarker + "']");

					objDiv.find("input").addClass("toUploadImg3Btn").attr(
							"readonly", "readonly").attr("placeholder",
							"请输入广告链接").val("http://www.样例.com");
					objDiv.find(".i2,.i3").remove();
					objDiv.removeAttr("id");

					curImg = "";
					curMarker = "";

					// 设置循环
					setIphone3();
					initEvent3();

				} else {

					if (type == 2) {
						changeToError(2);
						toastr.error("删除失败，请重试！");
					}

				}
			} else {

				if (type == 2) {
					changeToError(2);
					toastr.error("删除失败，请重试！");
				}

			}
		},
		error : function(XMLHttpRequest, textStatus, errorThrown) {

			if (type == 2) {
				changeToError(2);
				toastr.error("删除失败，请重试！");
			}
		}
	});

}
// 保存单个广告的链接信息
function doSaveOneAds() {

	var url = $("#href").val();

	showLoading2("保存中...");

	var urls = curMarker + "!" + url + ",";

	$.ajax({
		type : "POST",
		url : ctx + "/storeAds/saveFourAdUrl",
		data : {
			urls : urls
		},
		success : function(msg) {

			if (msg == "success") {

				changeToSuccess(2);
				toastr.success("保存成功！");

			} else {

				changeToError(2);
				toastr.error("保存失败，请重试！");
			}

		},
		error : function(XMLHttpRequest, textStatus, errorThrown) {

			changeToError(2);
			toastr.error("保存失败，请重试！");
		}
	});

	$("#pageRadio").show();
	$("#page3Content").show();
	$("#page3Upload").hide();
	$("#adsHrefs").hide();
	$("#flash3").show();

	// 在右侧表单中，插入新上传成功的图片
	insertLi3($("#window_bg3"), $("#page3Content"), curImg, curMarker, url,
			274, 465);

	$("#href").val("");

	// 设置循环
	setIphone3();
	// 初始化事件
	initEvent3();

	curImg = "";
	curMarker = "";

}

/**
 * 在右侧表单中，插入新上传成功的图片
 * 
 * @param window_bg
 *            左侧手机div
 * @param content
 *            //左侧图片UL
 * @param img
 *            //新图片url
 * @param name
 *            //新图片所在字段
 * @param width
 *            //图片宽
 * @param height
 *            //图片高
 */
function insertLi3(window_bg, content, img, name, url, width, height) {

	var ul = window_bg;

	var obj = ul.children()[0];
	$obj = $(obj);

	if (typeof ($obj.attr("marker")) == "undefined") {// 当前图片为默认数据
		ul.empty();
	}

	var li = $("<li/>").attr("marker", name).prependTo(ul);
	var src = "http://" + imageServer + img;
	var img = $("<img/>").css("width", width).css("height", height).attr(
			"marker", name).attr("src", src).appendTo(li);

	var ulDiv = content.find(".zxImgUlDiv");

	for (var i = 0; i < ulDiv.length; i++) {

		var obj = ulDiv[i];
		$obj = $(obj);

		if (typeof ($obj.attr("id")) == "undefined") {// 当前文本框没有数据，插入

			$obj.attr("id", name);
			var input = $obj.find("input");
			input.removeClass("toUploadImg3Btn").attr("readonly", false).attr(
					"placeholder", "请输入广告链接").val(url);
			input.unbind("click");
			var i1 = $("<i/>").addClass(" icon-eye-open i2 showI").css(
					"cursor", "pointer").css("color", "green").appendTo($obj);
			var i2 = $("<i/>").addClass(" icon-trash i3 deleteI").css("cursor",
					"pointer").css("color", "red").attr("url", img).appendTo(
					$obj);

			return;

		}

	}

}

// 免认证页装修保存校验
$("#adsForm").validate({
	errorPlacement : function(error, element) {
		error.css({
			display : "inline",
			color : "#ee7676",
			position : "relative",
		}).appendTo(element.parent().addClass("error"));
	},
	submitHandler : function(form) {
		doSaveOneAds();
	},
	rules : {
		href : {// 广告链接
			maxlength : 400,
			url : true
		}
	},
	messages : {
		href : {
			maxlength : "广告链接最大长度为{0}",
			url : "请输入合法的网址"
		}
	}
});
/**
 * 设置窗体
 */
function setIphone3() {

	var w = '274px'; // 获取内部窗口的宽
	var h = '486px'; // 获取内部窗口的高

	// 设置背景的宽高
	$("#window_bg3").css({
		"width" : w,
		"height" : h
	});
	// 设置背景图片的缩放
	$("ul#window_bg3 li").css({
		"width" : w,
		"height" : h
	});
	$("ul#window_bg3 li img").css("width", w);

	var size = $("ul#window_bg3 li img").length;

	if (size > 1) {

		$('#window_bg3').cycle({
			fx : 'scrollRight', // 运动方式向右转动
			speed : 50, // 转动速度，数值越小越快
			pause : true,
			timeout : 2000
		});

	} else {

		$("ul#window_bg3 li").css("z-index", "1");

	}

}

// 认证页保存
function doSavePage3Form() {

	var countdown = $("#skipTimesInput").val();
	var inputS = $("#page3Form").find(".zxImgUlDiv");
	var urls = "";

	for (var i = 0; i < inputS.length; i++) {
		var obj = inputS[i];
		var $obj = $(obj);
		if ($obj.attr("id") != "" && typeof ($obj.attr("id")) != "undefined") {// 当前是标题
			urls += $obj.attr("id") + "!" + $(inputS[i]).find("input").val()
					+ ",";
		}
	}

	showLoading2("保存中...");

	$.ajax({
		type : "POST",
		url : ctx + "/storeAds/saveFourAdUrl",
		data : {
			countdown : parseInt(countdown),
			urls : urls
		},
		success : function(msg) {
			if ("success" == msg) {

				$("#storeNameInput1").val(name);
				$("#storeName1").text(name);

				changeToSuccess(2);
				toastr.success("保存成功！");

			} else {

				changeToError(2);
				toastr.error("保存失败，请重试！");

			}
		},
		error : function(XMLHttpRequest, textStatus, errorThrown) {

			changeToError(2);
			toastr.error("保存失败，请重试！");

		}
	});

}

// 认证广告页装修保存校验
$("#page3Form").validate({
	errorPlacement : function(error, element) {
		// 错误提示样式,在下方提示
		$('<br/>').appendTo(element.parent()); // 有这句就在下方提示错误信息
		error.css({
			display : "inline",
			color : "#ee7676",
			position : "relative",
		}).appendTo(element.parent().addClass("error"));
	},
	submitHandler : function(form) {
		doSavePage3Form();
	},
	rules : {
		skipTimesInput : {// 倒计时时间
			required : true,
			number : true,
			digits : true,
			range : [ 4, 60 ]
		},
		skipTimeInput : {
			maxlength : 400,
			url : true
		},
		skipTimeInput : {
			maxlength : 400,
			url : true
		},
		skipTimeInput : {
			maxlength : 400,
			url : true
		},
		skipTimeInput : {
			maxlength : 400,
			url : true
		}
	},
	messages : {
		skipTimesInput : {
			required : "请输入广告展现时长",
			number : "广告时长为合法的数字",
			digits : "广告时长为数字",
			range : "广告时长需在 {0}和{1}之间"
		},
		skipTimeInput : {
			maxlength : "广告链接最大长度为{0}",
			url : "请输入合法的网址"
		},
		skipTimeInput : {
			maxlength : "广告链接最大长度为{0}",
			url : "请输入合法的网址"
		},
		skipTimeInput : {
			maxlength : "广告链接最大长度为{0}",
			url : "请输入合法的网址"
		},
		skipTimeInput : {
			maxlength : "广告链接最大长度为{0}",
			url : "请输入合法的网址"
		}
	}
});
// ---------------------------------------------▲认证广告页装修▲----------------------------//

// 弹出删除提示弹框
function toDeleteImg(marker, url, flag) {

	curImg = url;
	curMarker = marker;
	curUpload = flag;

	$('#deleteImg').modal({
		backdrop : 'static'
	});

}

/**
 * 删除图片
 * 
 * @param img
 *            图片src
 * @param name
 *            图片所在字段
 */
function doDeleteImg() {

	if (curUpload == "1") {// 免认证
		deleteImg1();
		return;
	} else if (curUpload == "2") {// 认证
		deleteImg2(2);
		return;
	} else if (curUpload == "3") {// 广告认证
		deleteImg3(2);
		return;
	}

}

// 上传图片以后自动调用此方法
function setPicUrl(url) {

	// showLoading();

	if (url != null && url != "") {

		var result = url.split(",");
		var img = result[0];// 图片路径
		var name = result[1];// 图片ID，即该图片字段名

		if (url != "false") {

			curImg = img;
			curMarker = name;

			// changeToSuccess(1);
			toastr.success("您成功上传了一张图片！");

			if (curUpload == "1") {// 免认证页上传回调

				$("#page1Upload").hide();
				$("#pageRadio").show();
				$("#page1Content").show();

				// 在右侧表单中，插入新上传成功的图片
				insertLi1($("#window_bg1"), $("#page1Content"), img, name, 271,
						465);
				// 设置循环
				setIphone1();
				// 初始化事件
				initEvent1();

			} else if (curUpload == "2") {// 认证页上传回调

				$("#flash2").hide();
				$("#ImgDescs").show();
				var src = "http://" + imageServer + curImg;
				$("#ImgDescs").find("img").attr("src", src);

			} else if (curUpload == "3") {// 认证页上传回调

				$("#flash3").hide();
				$("#adsHrefs").show();
				var src = "http://" + imageServer + curImg;
				$("#adsHrefs").find("img").attr("src", src);

			}

		} else {

			// changeToError(1);
			toastr.error("上传失败，请重新上传！");

		}
	} else {

		// changeToError(1);
		toastr.error("上传失败，请重新上传！");

	}

}
