/**
 * 网址导航
 * 
 * @author PengL
 */

// 原有信息，用以判断页面数据是否未做修改
var url = "";

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

	// 返回店铺应用click事件
	$(".toApplyMainBtn").unbind("click");
	$(".toApplyMainBtn").click(function() {
		window.location.href = "../appManage/gotoAppStore";
	});

	// 保存按钮，click事件
	$(".doSaveWebGuideBtn").unbind("click");
	$(".doSaveWebGuideBtn").click(function() {
		$("#webGuideForm").submit();
	});

	$("#defaultUrl").text(defaultSaleConfig.webGuideUrl);
	if (saleConfig != null) {
		$("#url").val(saleConfig.webGuideUrl);
		url = saleConfig.webGuideUrl;
	}

});

$("#webGuideForm").validate({
	errorPlacement : function(error, element) {
		$('<br/>').appendTo(element.parent()); // 有这句就在下方提示错误信息
		error.css({
			display : "inline",
			color : "#ee7676",
			position : "relative",
		}).appendTo(element.parent().addClass("error"));

	},
	submitHandler : function() {
		if ($("#url").val().replace(/^\s+|\s+$/g, "") == url) {
			toastr.warning("您当前未做修改");
			return;
		}
		showLoading2("保存中...");
		$.ajax({
			type : "POST",
			url : "saveWebGuide",
			data : {
				url : $("#url").val().replace(/^\s+|\s+$/g, "")
			},
			success : function(data) {
				eval("data = " + data);
				if (data.code == 200) {
					changeToSuccess(1);
					toastr.success("保存成功！");
					url = $("#url").val().replace(/^\s+|\s+$/g, "");
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
		url : {
			rangelength : [ 0, 128 ],
			url : true
		}
	},
	messages : {
		url : {
			rangelength : "URL长度在{0}与{1}之间",
			url : "请输入正确的地址，注意前后不可包含空格"
		}
	}

});
