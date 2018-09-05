/**
 * 创建店铺页面js
 */

$(function() {

	// 左侧菜单中，“店铺管理”选中状态
	$('#store').addClass("active");

	// 初始化单选按钮效果
	$('[data-toggle="radio"]').radiocheck();

	// 所属行业中，点击行业图标，执行事件
	$(".indusImg").each(function() {
		$(this).click(function() {
			
			var id = $(this).attr("id");// 父ID
			$("#industry span").remove();// 取消所有行业的选中效果
			
			if (id=="9900") {
				
				for (var i = 0; i < $(".indusImg").length; i++) {
					var obj=$(".indusImg")[i];
					obj.src = curPath + "/img/industry/a" + (i + 1) + ".png";
				}
				
				$("#industrialTypeId").val("9900");
				$("#9900").attr("src",curPath + "/img/industry/b8.png");
				
				var son = $("<span>").text("其他");
				$(this).after(son);
				
			}else{
				
				for (var i = 0; i < $(".indusImg").length; i++) {
					
					var obj = $(".indusImg")[i];
					var cur = (i + 1) * 100;
					
					if (cur == id) {// 使当前行业选中
						obj.src = curPath + "/img/industry/b" + (i + 1) + ".png";
					} else {// 其他行业显示为未选中状态
						obj.src = curPath + "/img/industry/a" + (i + 1) + ".png";
					}
					
				}
				
			}
			
			
			
		});
	});


	// 每个行业，子行业click事件
	$("#industry li").each(function() {
		$(this).click(function() {
			var text = $(this).text();
			$("#industry span").remove();
			var img = $(this).parent().prev();
			var son = $("<span>").text(text);
			var inId = $(this).find("a").attr("id");
			$("#industrialTypeId").val(inId);
			img.after(son);
		});
	});

	$('.tooltipMsg').tooltip("hide");

	// 保存按钮
	$(".doEditStoreBtn").click(function() {
		tijiao();
	});

	// 取消按钮
	$(".toIndexBtn").click(function() {
		location=ctx + "/store/index";
	});

});

// 我添加的新规则（验证 详细地址是否合法）
jQuery.validator.addMethod("checkAddress", function(value, element) {
	var reg = /^[\u4E00-\u9FA5A-Z0-9a-z_-]+$/;
	return this.optional(element) || reg.test(value);
}, "详细地址不能包含特殊字符");

//校验14位的tel，只能是-和数字
jQuery.validator.addMethod("check14Tel", function(value, element) {
	var flag = true;
	for(var i=0;i<value.length;i++){
		var s = value.substring(i,i+1);
		if(!(s=='0' || s=='1' || s=='2' || s=='3' || s=='4' || s=='5' || s=='6' || s=='7' || s=='8' || s=='9' || s=='+' || s=='-')){
			flag = false;
		}
	}
	return this.optional(element) || flag;
}, "联系电话格式不对");




// 校验店铺中的所有控件
$("#dianpu").validate({
	errorPlacement : function(error, element) {
		// 错误提示样式,在下方提示
		// $('<br/>').appendTo(element.parent()); //有这句就在下方提示错误信息

		error.css({
			display : "inline",
			color : "#ee7676",
			position : "relative",
		}).appendTo(element.parent().addClass("error"));
	},
	submitHandler : function(form) {
		// $("#dianpu").submit();
		form.submit();
		document.getElementById("saveStore").disabled = true;	//提交后，将保存按钮禁用
	},
	rules : {
		// 店铺名称
		name : {
			required : true,
			maxlength : 10
		},
		// 店铺负责人
		contact : {
			required : true,
			maxlength : 10
		},
		// 联系方式（可以是手机、电话）
		tel : {
			required : true,
			maxlength : 14,
			check14Tel : true
		},
		// 详细地址
		address : {
			required : true,
			maxlength : 32,
			checkAddress : true
		},
		// 活动描述
		welcome : {
			maxlength : 10
		},
		//商家简介
		description : {
			maxlength : 500
		}
	},
	messages : {
		name : {
			required : "请输入店铺名称",
			maxlength : "店铺名称最大长度为10"
		},
		contact : {
			required : "请输入联系人",
			maxlength : "联系人最大长度是10"
		},
		tel : {
			required : "请输入联系方式",
			maxlength : "联系方式最大长度是14"
		},
		address : {
			required : "请填写店铺详细地址",
			maxlength : "详细地址最大为32",
			checkAddress : "详细地址不能包含特殊字符"
		},
		welcome : {
			maxlength : "活动描述最大长度为10"
		},
		description:"商家简介最大长度是500"
	}
});

// 验证经纬
function checkJingWei() {
	if (jing == 0 && wei == 0) {
		toastr.error("您还没有在地图上选择店铺位置");
		return false;
	} else {
		return true;
	}
}

//校验是否选择了行业类型
function checkIndustry() {
	var span = $("#industry").find("span");
	if ( null != span&&span.text()!="" ) {
		return true;
	} else {
		toastr.error("请选择行业！");
		return false;
	}
}
//改变代理商 
function changAgent(val){
	$("#agentId").val(val);	//给agentId隐藏域赋值
}

