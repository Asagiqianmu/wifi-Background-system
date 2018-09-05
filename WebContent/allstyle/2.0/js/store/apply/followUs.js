/**
 * 关注我们
 * 
 * @author PengL
 */

// 原有信息，用以判断页面数据是否未做修改
var wechatCommonNum = "", officialWebsite = "", tencentMicroblog = "", sinaMicroblog = "";

$(function() {

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

	// 初始化，左侧菜单中“设备管理”选中状态
	$("#sApply").addClass("active");

	initData(saleConfig);

	// 返回店铺应用click事件
	$(".toApplyMainBtn").unbind("click");
	$(".toApplyMainBtn").click(function() {
		window.location.href = "../appManage/gotoAppStore";
	});

	// 保存按钮，click事件
	$(".doSaveFollowUsBtn").unbind("click");
	$(".doSaveFollowUsBtn").click(function() {
		$("#followUsForm").submit();
	});

	$(".inputVal").each(
			function() {
				$(this).blur(
						function() {
							var id = $(this).attr("id");
							var _val = $(this).val();
							_val = _val.replace(/^\s+|\s+$/g, "");
							if (_val == "") {
								$("#" + id + "Div").hide();
							} else {
								$("#" + id + "Div").show();
								$(".followUs_msg").hide();
							}
							if ($("#wechatCommonNum").val() == ""
									&& $("#officialWebsite").val() == ""
									&& $("#tencentMicroblog").val() == ""
									&& $("#sinaMicroblog").val() == "") {
								$(".followUs_msg").show();
								$(".once").hide();
							}
						});
			});

	$("#wechatCommonNum").unbind("keyup");
	$("#wechatCommonNum")
			.keyup(
					function() {
						var _val = $(this).val();
						_val = _val.replace(/^\s+|\s+$/g, "");
						if (_val == "") {
							$("#wechatDiv").html();
							$("#wechatCommonNumDiv").hide();
						} else {
							if (_val.length > 10) {
								$("#wechatDiv").html(
										"&nbsp;" + _val.substr(0, 10) + "...");
							} else {
								$("#wechatDiv").html("&nbsp;" + _val);
							}
							$("#wechatCommonNumDiv").show();
						}
						if ($("#wechatCommonNum").val().replace(/^\s+|\s+$/g,
								"") == ""
								&& $("#officialWebsite").val().replace(
										/^\s+|\s+$/g, "") == ""
								&& $("#tencentMicroblog").val().replace(
										/^\s+|\s+$/g, "") == ""
								&& $("#sinaMicroblog").val().replace(
										/^\s+|\s+$/g, "") == "") {
							$(".followUs_msg").show();
							$(".once").hide();
						} else {
							$(".followUs_msg").hide();
						}
					});

});

$("#followUsForm")
		.validate(
				{
					errorPlacement : function(error, element) {
						$('<br/>').appendTo(element.parent()); // 有这句就在下方提示错误信息
						error.css({
							display : "inline",
							color : "#ee7676",
							position : "relative",
						}).appendTo(element.parent().addClass("error"));

					},
					submitHandler : function() {
						if ($("#wechatCommonNum").val().replace(/^\s+|\s+$/g,
								"") == wechatCommonNum
								&& $("#officialWebsite").val().replace(
										/^\s+|\s+$/g, "") == officialWebsite
								&& $("#tencentMicroblog").val().replace(
										/^\s+|\s+$/g, "") == tencentMicroblog
								&& $("#sinaMicroblog").val().replace(
										/^\s+|\s+$/g, "") == tencentMicroblog) {
							toastr.warning("您当前未做修改");
							return;
						}
						showLoading2("保存中...");
						$.ajax({
							type : "POST",
							url : "saveFollowUs",
							data : {
								wechatCommonNum : $("#wechatCommonNum").val()
										.replace(/^\s+|\s+$/g, ""), // 微信公众号
								officialWebsite : $("#officialWebsite").val()
										.replace(/^\s+|\s+$/g, ""), // 官方网址
								tencentMicroblog : $("#tencentMicroblog").val()
										.replace(/^\s+|\s+$/g, ""), // 腾讯微博地址
								sinaMicroblog : $("#sinaMicroblog").val()
										.replace(/^\s+|\s+$/g, "")
							// 新浪微博地址
							},
							success : function(data) {
								eval("data = " + data);
								if (data.code == 200) {
									changeToSuccess(1);
									toastr.success("保存成功！");
									wechatCommonNum = $("#wechatCommonNum")
											.val().replace(/^\s+|\s+$/g, "");
									officialWebsite = $("#officialWebsite")
											.val().replace(/^\s+|\s+$/g, "");
									tencentMicroblog = $("#tencentMicroblog")
											.val().replace(/^\s+|\s+$/g, "");
									sinaMicroblog = $("#sinaMicroblog").val()
											.replace(/^\s+|\s+$/g, "");
								} else {
									toastr.error(data.msg);
									changeToError(1);
								}
							},
							error : function() {
								changeToError(1);
							}
						});
					},
					rules : {
						wechatCommonNum : {
							rangelength : [ 0, 32 ]
						},
						officialWebsite : {
							rangelength : [ 0, 128 ],
							url : true
						},
						tencentMicroblog : {
							rangelength : [ 0, 128 ],
							url : true
						},
						sinaMicroblog : {
							rangelength : [ 0, 128 ],
							url : true
						}
					},
					messages : {
						wechatCommonNum : {
							rangelength : "微信公众号长度在{0}与{1}之间"
						},
						officialWebsite : {
							rangelength : "官方网址长度在{0}与{1}之间",
							url : "请输入正确的地址，前后不可包含空格"
						},
						tencentMicroblog : {
							rangelength : "腾讯微博长度在{0}与{1}之间",
							url : "请输入正确的地址，前后不可包含空格"
						},
						sinaMicroblog : {
							rangelength : "新浪微博长度在{0}与{1}之间",
							url : "请输入正确的地址，前后不可包含空格"
						}
					}

				});

function initData(saleConfig) {
	if (saleConfig == null) {// 没有数据
	} else {// 已修改过，没有值的隐藏
		wechatCommonNum = saleConfig.wechatCommonNum;
		officialWebsite = saleConfig.officialWebsite;
		tencentMicroblog = saleConfig.tencentMicroblog;
		sinaMicroblog = saleConfig.sinaMicroblog;
		if ((officialWebsite == "" || officialWebsite == null)
				&& (tencentMicroblog == "" || tencentMicroblog == null)
				&& (sinaMicroblog == "" || sinaMicroblog == null)) {
			// 关注我们没有配置过
		} else {
			$("#officialWebsite").val(officialWebsite);
			$("#tencentMicroblog").val(tencentMicroblog);
			$("#sinaMicroblog").val(sinaMicroblog);
			if (sinaMicroblog == "" || sinaMicroblog == null) {
				$("#sinaMicroblogDiv").hide();
			}
			if (officialWebsite == "" || officialWebsite == null) {
				$("#officialWebsiteDiv").hide();
			}
			if (tencentMicroblog == "" || tencentMicroblog == null) {
				$("#tencentMicroblogDiv").hide();
			}
		}
		$("#wechatCommonNum").val(wechatCommonNum);
		if (wechatCommonNum != "" || wechatCommonNum != null) {
			wechatCommonNum = wechatCommonNum.replace(/^\s+|\s+$/g, "");
			if (wechatCommonNum.length == 0) {
				$("#wechatCommonNumDiv").hide();
			} else if (wechatCommonNum.length > 10) {
				$("#wechatDiv").html(
						"&nbsp;" + wechatCommonNum.substr(0, 10) + "...");
			} else {
				$("#wechatDiv").html("&nbsp;" + wechatCommonNum);
			}
		}
	}
}