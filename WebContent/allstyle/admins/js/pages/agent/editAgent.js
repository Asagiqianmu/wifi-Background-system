/**
 * 
 */

$(function() {

	$("#agent").addClass("active");
	$("#agent").find("ul").addClass("active");

	var pointer = $("<div/>").addClass("pointer");
	var arrow = $("<div/>").addClass("arrow").appendTo(pointer);
	var arrow_border = $("<div/>").addClass("arrow_border").appendTo(pointer);
	$("#agent").prepend(pointer);

	// 取消按钮，click跳转至代理商页面
	$(".toAgentList").click(function() {
		window.location.href = ctx + "/admins/getAllAgent";
	});

	// 保存按钮，click
	$(".doEditAgentBtn").click(function() {
		$("#editAgentForm").submit();
	});

	// select2 plugin for select elements
	$(".select2").select2({
		placeholder : "请选择"
	});
	
	$(".select2-container").css("margin-left", "0px")
	.css("margin-right", "5px");

	if ($("#oldChannelId").val() == "") {
		loadChannel();
	}
	

});

// 加载渠道经理
function loadChannel() {
	$.ajax({
		url : ctx+"/admins/getChannelList",
		success : function(data) {
			eval("data = " + data);
			if (data.code == 200) {
				if (data.data == null || data.data == undefined
						|| data.data == "") {
					alert("暂无渠道经理");
				} else {
					var select = $("#channelId1");
					for (var i = 0; i < data.data.length; i++) {
						var obj = data.data[i];
						var option = $("<option/>").attr("value", obj.id).text(
								obj.name).appendTo(select);
					}
					$("#channelId1").select2("val",  data.data[0].id);
				}
			} else {
				alert("获取渠道经理失败");
			}
		},
		error : function() {
			alert("获取渠道经理失败");
		}
	});
}

function changeCity(val) {

	$("#areaId1").val(val);
	if (val != -1) {
		$.ajax({
			url : ctx + "/store/changeCity/" + val,
			success : function(shi) {
				// alert("返回数据"+shi);

				var aa = new Array();
				aa = shi.split(":");
				document.getElementById("shi1").options.length = 0;
				document.getElementById("xian1").options.length = 0;

				document.getElementById("shi1").options.add(new Option(
						"请选择市/区", -1));
				document.getElementById("xian1").options.add(new Option(
						"请选择县/街道", -1));

				for (var i = 0; i < aa.length; i++) {
					var bb = new Array();
					bb = aa[i].split(",");
					document.getElementById("shi1").options.add(new Option(
							bb[1], bb[0]));
				}
			}
		});
	} else {
		document.getElementById("shi1").options.length = 0;
		document.getElementById("xian1").options.length = 0;
		document.getElementById("shi1").options.add(new Option("请选择市/区", -1));
		document.getElementById("xian1").options.add(new Option("请选择县/街道", -1));
	}
}
// 改变县，同时将乡制空
function changeXian(val) {
	$("#areaId1").val(val);
	if (val != -1) {
		$.ajax({
			url : ctx + "/store/changeXian/" + val,
			success : function(shi) {
				// alert("返回数据"+shi);

				var aa = new Array();
				aa = shi.split(":");
				document.getElementById("xian1").options.length = 0;

				document.getElementById("xian1").options.add(new Option(
						"请选择县/街道", -1));
				for (var i = 0; i < aa.length; i++) {
					var bb = new Array();
					bb = aa[i].split(",");
					document.getElementById("xian1").options.add(new Option(
							bb[1], bb[0]));
				}
			}
		});
	} else {
		document.getElementById("xian1").options.length = 0;
		document.getElementById("xian1").options.add(new Option("请选择县/街道", -1));
	}
}

// 县,3级改变时，将三级的id给areaId
function xianChange(val) {
	if (val > 0) {
		$("#areaId1").val(val);
	} else {
		$("#areaId1").val($("#shi1").val());
	}

	$("#areaId1").val(val);
}

// 第三步表单提交校验
$("#editAgentForm").validate({
	errorPlacement : function(error, element) {
		element.parent().append(error.css({
			display : "inline",
			color : "#ee7676",
			position : "relative",
			float : "right"
		}));
	},
	submitHandler : function(form) {
		doEditAgent();
	},
	rules : {
		sheng1 : {
			required : true,
			min : 0
		},
		shi1 : {
			required : true,
			min : 0
		},
		note : {
			maxlength : 128
		}
	},
	messages : {
		sheng1 : {
			required : "请选择省",
			min : "请选择省"
		},
		shi1 : {
			required : "请选择市",
			min : "请选择市"
		},
		note : {
			maxlength : "备注最大长度为{0}"
		}
	}
});

function doEditAgent() {

	$.ajax({
		type : "POST",
		url : ctx + "/admins/editAgent",
		data : {
			agentId : parseInt($("#agentId").val()),
			note : $("#note").val(),
			areaId1 : parseInt($("#areaId1").val()),
			channelId : $("#channelId1").val()
		},
		success : function(data) {

			if (data == "true") {

				alert("修改成功！");
				window.location.href = ctx + "/admins/getAllAgent";

			} else {
				alert("修改失败！");
				return;
			}
		},
		error : function() {
			alert("修改失败！");
			return;
		}
	});

}