var imgAreaSelectApi;
var minwidth=10;
var minheight=20;
var aspectRatio="80:80";

$(function(){


	$("#storeLogoImg").load(function() {
		DrawImage(this, 550, 400);
	});
	//图片上传
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
			width : "260px",
			height : "130px",
			overflow : "hidden",
			margin : "auto"
		});
		if (imgAreaSelectApi) {
			imgAreaSelectApi.cancelSelection();
		}
	});
	///
	$("#btn_close").on("click",function(){
		$("#show_img").html("");
		$("#show_img").html('<img src="${curPath }/img/logo.jpg" id="imaPreview1"  class="nophoto_l"/>');
		$("#imaPreview1").attr("src", curPath + "/img/logo.jpg");
		$("#storeLogoImg").attr("src", curPath + "/img/drawBackground.jpg");
		 resetUploadImg();
		 if (imgAreaSelectApi) {
				imgAreaSelectApi.cancelSelection();
			}
	});
	//
});
function ajaxFileUpload() {

	
	
	
	showLoading2("上传中···");
	
    var scaling=$("#anyIcon").val();
    if(scaling=="1"){
    	minwidth=Math.floor(80);
    	minheight=Math.floor(40);
    	aspectRatio="40:20";
    }else{
    	minwidth=Math.floor(40);
    	minheight=Math.floor(40);
    	aspectRatio="40:40";
    }
	$.ajaxFileUpload({
		url : "../wxAdInfo/uploadImg", // 用于文件上传的服务器端请求地址
		type : 'post',
		secureuri : false, // 是否需要安全协议，一般设置为false
		fileElementId : 'file1', // 文件上传域的ID
		dataType : 'json', // 返回值类型 一般设置为json,
		data : {
			maxSize : 5120
			// 限制大小5M
		},
		success : function(data, status) // 服务器成功响应处理函数
		{
			
			if (data.isSuccess == "true") {
				changeToSuccess(1);
				toastr.success('上传成功！');
				store_logo_url = data.picUrl;
				$("#kkk").show();
				$("#resetImgBtn").show();
				$("#inputFileDiv").hide();

				data.picUrl = data.picUrl + "?temp=" + Math.random();

				$("#storeLogoImg").attr("src", data.picUrl);
				$("#imaPreview1").attr("src", data.picUrl);
				// 构造imgAreaSelectApi
				imgAreaSelectApi = $('#storeLogoImg').imgAreaSelect({
					persistent : true, // true，选区以外点击不会启用一个新选区（只能移动/调整现有选区）
					instance : true, // true，返回一个imgAreaSelect绑定到的图像的实例，可以使用api方法
					onSelectChange : preview, // 改变选区时的回调函数
					show : true, // 选区会显示
					handles : true, // true，调整手柄则会显示在选择区域内
					resizable : true, // true， 选区面积可调整大小
					minWidth : minwidth, // 选取的最小宽度
					minHeight : minheight, // 选取的最小高度 *
					aspectRatio :aspectRatio // 选区的显示比率 400:300
				});
				var sel = {
					x1: 0,
		            y1: 0,
		            x2:260,
		            y2: 130,
		            width: 260,
		            height: 130};
				preview(null,sel);
			//	alert("==x==" + imgAreaSelectApi.getSelection().width + "==y==" + imgAreaSelectApi.getSelection().height);
				//preview(null,imgAreaSelectApi.getSelection());
			} else {
				// changeToError(1);
				hideLoading();
				if (data.errorType == "1") {
					toastr.error('上传图片过大，请控制在 5M 以内！');
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
	var fileName="";
	var whichImg=$("#anyIcon").val();
	if(whichImg=="1"){
		fileName=apMac+"1";
	}else if(whichImg=="2"){
		fileName=apMac+"2";
	}else if(whichImg=="3"){
		fileName=apMac+"3";
	}else if(whichImg=="4"){
		fileName=apMac+"4";
	}else if(whichImg=="5"){
		fileName=apMac+"5";
	}
	var areaSelection = imgAreaSelectApi.getSelection();
		$.ajax({
				url : "../wxAdInfo/saveImg", // 请求的url地址
				// async: true, //请求是否异步，默认为异步，这也是ajax重要特性
				type : "post",
				data : {
					fileName:fileName,
					x : Math.round(areaSelection.x1 * imgScal),
					y : Math.round(areaSelection.y1 * imgScal),
					width : Math.round((areaSelection.x2 - areaSelection.x1)
							* imgScal),
					height : Math.round((areaSelection.y2 - areaSelection.y1)
							* imgScal)
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
						//重置上传页、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、
						$("#show_img").html("");
						$("#show_img").html('<img  id="imaPreview1"  class="nophoto_l"/>');
						$("#imaPreview1").attr("src", curPath + "/img/logo.jpg");
						$("#storeLogoImg").attr("src", curPath + "/img/drawBackground.jpg");
						$("#file1").val("");
						$("#inputFileDiv").show();
						$("#resetImgBtn").hide();
						$("#kkk").hide();
						$('#load_images').modal('hide');
						//////////////////////////////////////图片显示
						if(whichImg=="1"){
							$("#read_bg").attr("src",req+ "?temp=" + Math.random());
							$("#input_bg").val(req);
						}else if(whichImg=="2"){
							$("#read_logo").attr("src",req+ "?temp=" + Math.random());
							$("#input_logo").val(req);
						}else if(whichImg=="3"){
							$("#read_icon1").attr("src",req+ "?temp=" + Math.random());
							$("#ad_icon_link1").val(req);
						}else if(whichImg=="4"){
							$("#read_icon2").attr("src",req+ "?temp=" + Math.random());
							$("#ad_icon_link2").val(req);
						}else if(whichImg=="5"){
							$("#read_icon3").attr("src",req+ "?temp=" + Math.random());
							$("#ad_icon_link3").val(req);
						}else{
							toastr.error('操作有误！');
						}
						
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
	var whichImg=$("#anyIcon").val();
	if(whichImg=="1"){

		preview_photo('p_photo_l', selection);
	}else{
		preview_photo('p_photo_2', selection);
	}
	
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
	$("#imaPreview1").removeAttr("style");
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
			imgAreaSelectApi.setSelection(0, 0, minwidth, minheight);
			imgAreaSelectApi.update();
		}

	});
	image.src = ImgD.src;

}