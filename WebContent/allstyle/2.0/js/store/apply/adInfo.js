$(function(){
	
	//点击上传背景图片
	$("#ad_bg").on("click",function(){
		$("#show_img").removeClass("p_photo_2");
		$("#show_img").addClass("p_photo_l");
		$("#anyIcon").val("1");
		$("#load_images").modal('show');
	});
	//点击上传logo图片
	$("#ad_logo").on("click",function(){
		$("#show_img").removeClass("p_photo_l");
		$("#show_img").addClass("p_photo_2");
		$("#anyIcon").val("2");
		$("#load_images").modal('show');
	});
	//点击上传图标广告1图片
	$("#icon_load1").on("click",function(){
		$("#show_img").removeClass("p_photo_l");
		$("#show_img").addClass("p_photo_2");
		$("#anyIcon").val("3");
		$("#load_images").modal('show');
	});
	//点击上传图标广告2图片
	$("#icon_load2").on("click",function(){
		$("#show_img").removeClass("p_photo_l");
		$("#show_img").addClass("p_photo_2");
		$("#anyIcon").val("4");
		$("#load_images").modal('show');
	});
	//点击上传图标广告3图片
	$("#icon_load3").on("click",function(){
		$("#show_img").removeClass("p_photo_l");
		$("#show_img").addClass("p_photo_2");
		$("#anyIcon").val("5");
		$("#load_images").modal('show');
	});
//	//bar设置联动
//	$("#successInfo").on("keyup",function(){
////		if($("#successInfo").val().length>16){
////			$("#successInfo").val($("#successInfo").val().substring(0,16));
////		}
//		$("#barInfo").html($("#successInfo").val());
//		
//	});
	//文字广告设置联动
	$("#input_content").on("keyup",function(){
//		if($("#input_content").val().length>16){
//			$("#input_content").val($("#input_content").val().substring(0,16));
//		}
		$("#span_adGo").val($("#input_content").val());
	});
	//图标广告1设置联动
	$("#ad_icon_content1").on("keyup",function(){
//		if($("#ad_icon_content1").val().length>4){
//			$("#ad_icon_content1").val($("#ad_icon_content1").val().substring(0,4));
//		}
		$("#icon_content1").html($("#ad_icon_content1").val());
	});
	//图标广告2设置联动
	$("#ad_icon_content2").on("keyup",function(){
//		if($("#ad_icon_content2").val().length>4){
//			$("#ad_icon_content2").val($("#ad_icon_content2").val().substring(0,4));
//		}
		$("#icon_content2").html($("#ad_icon_content2").val());
	});
	//图标广告3设置联动
	$("#ad_icon_content3").on("keyup",function(){
//		if($("#ad_icon_content3").val().length>4){
//			$("#ad_icon_content3").val($("#ad_icon_content3").val().substring(0,4));
//		}
		$("#icon_content3").html($("#ad_icon_content3").val());
	});
//	//公众号输入限制
//	$("#input_weXin").on("keyup",function(){
//		if($("#input_weXin").val().length>20){
//			$("#input_weXin").val($("#input_weXin").val().substring(0,20));
//		}
//	});
//	//文字广告链接输入限制
//	$("#input_link").on("keyup",function(){
//		if($("#input_link").val().length>20){
//			$("#input_link").val($("#input_link").val().substring(0,20));
//		}
//	});
	//提交按钮
	$("#saveAdInfo").unbind("click");
	$("#saveAdInfo").on("click",function(){
		$("#saveAdInfoForm").submit();
	});
//	//隐藏图标选项
//	$("#icon_ad_isDisplay1").addClass("adInfo_dispnone");
//	$("#icon_ad_isDisplay2").addClass("adInfo_dispnone");
	//新增一条图标添加项
	$("#addAdIcon").unbind("click");
	$("#addAdIcon").on("click",function(){
		if(addIcon_info==0){
			$("#icon_ad_isDisplay1").removeClass("adInfo_dispnone");
			$("#icon_ad_isDisplay1").addClass("adInfo_disp");
			addIcon_info=1;
		}else if(addIcon_info==1){
			$("#icon_ad_isDisplay2").removeClass("adInfo_dispnone");
			$("#icon_ad_isDisplay2").addClass("adInfo_disp");
			addIcon_info=0;
			$("#addAdIcon").addClass("adInfo_dispnone");
		}
		
	});
	/////////////////////////////////////加载事件、、、、、、、、、
});
/////////////////////////其他事件、、、、、、、、、、、
//文本框闪动
function normal(id,times)
{
        var obj=$("#"+id);
        obj.css("background-color","#FFF");
        if(times<0)
        {
                return;
        }
        times=times-1;
        setTimeout("error1('"+id+"',"+times+")",150);
}
function error1(id,times)
{
        var obj=$("#"+id);
        obj.css("background-color","#F6CECE");
        times=times-1;
        setTimeout("normal('"+id+"',"+times+")",150);
}
////自定义验证
//jQuery.validator.addMethod("isAdOnly", function(value,element) {   
//	  var flag=false;
//    var flag1=true;
//    var flag2=true;
//    var flag3=true;
//    if($("#ad_icon_link1").val()==""||$("#ad_icon_content1").val()==""||$("#ad_icon_inner1").val()==""){
//    	flag1=false;
//    }
//    if($("#ad_icon_link2").val()==""||$("#ad_icon_content2").val()==""||$("#ad_icon_inner2").val()==""){
//    	flag2=false;
//    }
//    if($("#ad_icon_link3").val()==""||$("#ad_icon_content3").val()==""||$("#ad_icon_inner3").val()==""){
//    	flag3=false;
//    }
//    if(flag1||flag2||flag3){
//    	flag=true;
//    }
//    
//    return flag;
//}, "最少添加一条图标广告");
//表单验证
var saveAdInfoForm=$("#form_adInfo").validate({
	submitHandler:function(form) {
		var wxAdDetils=new Array();
		var icon_submit1 = {iconTitle:$("#ad_icon_content1").val(),iconImg:$("#ad_icon_link1").val(),adURL:$("#ad_icon_inner1").val()};
		wxAdDetils.push(icon_submit1);
		if($("#ad_icon_content2").val()!=""){
			var icon_submit2 = {iconTitle:$("#ad_icon_content2").val(),iconImg:$("#ad_icon_link2").val(),adURL:$("#ad_icon_inner2").val()};
			wxAdDetils.push(icon_submit2);
		}
		
		if($("#ad_icon_content3").val()!=""){
			var icon_submit3 = {iconTitle:$("#ad_icon_content3").val(),iconImg:$("#ad_icon_link3").val(),adURL:$("#ad_icon_inner3").val()};
			wxAdDetils.push(icon_submit3);
		}
		showLoading2("保存中...");
		$.ajax({
			type : "POST",
			datatype:"json",
		    contentType:'application/json;charset=UTF-8',
			url:"../wxAdInfo/setAdInfo",
			data: $.toJSON({
				id:$("#adInfo_id").val(),
				mac : apMac,
				logo : $("#input_logo").val(),
				backgroundImg : $("#input_bg").val(),
				mpAccount : $("#input_weXin").val(),
				textTitle : $("#input_content").val(),
				textUrl : $("#input_link").val(),
				wxAdDetails : wxAdDetils 

			}),success: function(msg) {
				hideLoading();
				if (msg!=""&&msg!=null) {
						if(msg!="accountUndefined"){
						toastr.success('OK ,  广告设置成功！请使用微信查看设置效果。');
						$("#closeAp").show();
						$("#successAP").show();
						$("#page2").hide();
					}else{
						toastr.error('您设置的公众账号不存在，请检查输入是否有误或者您是否拥有微信公众号。');
						$("#input_weXin").focus();
					}
				}else{
					
					toastr.error('广告设置失败！请稍后再试。');
				}
				
			}
		});

	},
	errorPlacement : function(error, element) {
        //错误提示样式,在下方提示
		    $('<br/>').appendTo(element.parent());	//有这句就在下方提示错误信息

		    error.css({
					display : "inline",
					color : "#F00",
					position : "relative",
				}).appendTo(element.parent().addClass(
					"error"));
	},
	rules:{
		successInfo:{
			maxlength:16
		},
		input_bg:"required",
		input_logo:"required",
		input_weXin:{
			maxlength:20,
		},
		input_content:{
			required:true,
			maxlength:16
		},
		input_link:{
			required:true,
			maxlength:255
		},
		ad_icon_link1:"required",
		ad_icon_content1:{
			required:true,
			maxlength:4
		},
		ad_icon_inner1:{
			required:true,
			maxlength:255
		},
		ad_icon_link2:"required",
		ad_icon_content2:{
			required:true,
			maxlength:4
		},
		ad_icon_inner2:{
			required:true,
			maxlength:255
		},
		ad_icon_link3:"required",
		ad_icon_content3:{
			required:true,
			maxlength:4
		},
		ad_icon_inner3:{
			required:true,
			maxlength:255
		}
		
	},
	messages:{
		successInfo:{

			maxlength:"提示信息的最大长度为16"
		},
		input_bg:"请上传图片",
		input_logo:"请上传logo",
		input_weXin:{
			maxlength:"公众号超长，应小于20个字符"
		},
		input_content:{
			required:"请输入广告内容",
			maxlength:"广告内容最大长度为16"
		},
		input_link:{
			required:"请填入广告跳转链接",
			maxlength:"链接过长，应小于255个字符"
		},
		ad_icon_link1:"请上传图片",
		ad_icon_content1:{
			required:"请输入图标广告标识文字",
			maxlength:"文字内容过长，应小于4"
		},
		ad_icon_inner1:{
			required:"请输入图标广告链接",
			maxlength:"链接过长，应小于255"
		},
		ad_icon_link2:"请上传图片",
		ad_icon_content2:{
			required:"请输入图标广告标识文字",
			maxlength:"文字内容过长，应小于4"
		},
		ad_icon_inner2:{
			required:"请输入图标广告链接",
			maxlength:"链接过长，应小于255"
		},
		ad_icon_link3:"请上传图片",
		ad_icon_content3:{
			required:"请输入图标广告标识文字",
			maxlength:"文字内容过长，应小于4"
		},
		ad_icon_inner3:{
			required:"请输入图标广告链接",
			maxlength:"链接过长，应小于255"
		}
	}
});
