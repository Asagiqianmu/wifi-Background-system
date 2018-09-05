/**
 * 
 */

$(function() {
	$("#storeList").addClass("active");

	var pointer = $("<div/>").addClass("pointer");
	var arrow = $("<div/>").addClass("arrow").appendTo(pointer);
	var arrow_border = $("<div/>").addClass("arrow_border").appendTo(pointer);
	$("#storeList").prepend(pointer);
	
	// select2 plugin for select elements
	$(".select2").select2({
		placeholder : "Select a State"
	});
	
});

function tijiao2() {
	var agentId = document.getElementById("daili").value;
	var storeId = document.getElementById("id").value;
	var flag = false;
	$.ajax({
		url : ctx + "/admins/editStore", // 请求的url地址
		async : true, // 请求是否异步，默认为异步，这也是ajax重要特性
		type : "post",
		data : {
			agentId : agentId,
			storeId : storeId
		},
		success : function(shi) {
			if ("true" == shi) {
				toastr.success("保存成功！");
				window.location.href = ctx + "/admins/goStoreList";
			} else {
				toastr.error("修改失败");
				flag = false;
				return;
			}
		},
		error : function() {
			toastr.error("系统错误");
		}
	});
}

function gengxin() {
	var newid = document.getElementById("daili").value;
	$.ajax({
		url : ctx + "/admins/getCompanyByAgentId", // 请求的url地址
		async : true, // 请求是否异步，默认为异步，这也是ajax重要特性
		type : "post",
		data : {
			newid : newid
		},
		success : function(shi) {
			var com = "";
			eval("com = " + shi); // 将一个json字符串转成对象
			$("#b").text(com.tel); // 给服务商热线赋值
		},
		error : function() {
			toastr.error("系统错误");
		}
	});
}