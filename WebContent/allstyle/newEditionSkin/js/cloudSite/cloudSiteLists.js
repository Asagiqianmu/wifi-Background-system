var dang = 0;
var dangs = 0;
var infoSiteId = '';
//存储banner图片的数组
var srcArr = new Array();
//存储srcArrCopy
var srcArrCopy = new Array();
// 缓冲条
function buffer() {
	$('.barcontainer').css('display', 'block');
	$('.barcontainer').fadeOut(800);
}

/**
 * 下载配置文件
 */
function downloadConfig(wanPort,lanPort,nasid,secret){
	window.location.href="downloadRosConfig?wanPort="+wanPort+"&lanPort="+lanPort+"&nasid="+nasid+"&secret="+secret;
}

$(function() {
	/*$('html').contextmenu(function() {
		return false;
	});*/
	$('#devieBut').click(function() {
		maskDisp(1);
	});
	endBuild();
	addMac();
	buffer();
	getTotalPage();
	getsitesList(1);
	goPage();
	// 初始化下一页参数
	var typeDang = 0;// 出事化指示条参数
	var moveW = $('.move').width();
	zong();
	numdisp(dang);
	addCloudSite();	
	// toDevicePage();
	// 用户信息下拉菜单
	$('.admin').click(function() {
		var str = $('.menu').css('display');
		if (str == 'none') {
			$('.menu').css('display', 'block');
		} else {
			$('.menu').css('display', 'none');
		}
	});
	// 退出按钮
	$('.menu > li.exit').click(function() {
		window.location.href = ctx + "/logOut";
	});
	$('.menu > li.personageCenter').click(function() {
		window.location.href = ctx + "/personalCenter/toPersonalCenter";
	});
	
	
	$('#setInput').click(function() {
		setInput($('#setInput').attr('siteId'));
	});
	$('.placePullDown > span').click(function() {
		var str = $('.placePullDown > ul').css('display');
		if (str == 'none') {
			$('.placePullDown > ul').css('display', 'block');
		} else {
			$('.placePullDown > ul').css('display', 'none');
		}
	});
	
	
	$('.radiusNAS > button').click(function(){
		copyUrl2()
	});

	$('.nashov').hover(function(){
		$('.nasImg').css('display','block');
		$('.nasImg').animate({'opacity':'1','filter':'Alpha(opacity=100)'});
	},function(){
		$('.nasImg').animate({'opacity':'0','filter':'Alpha(opacity=0)'},function(){
			$('.nasImg').css('display','none');
		});
	});
	
	/* 上传图片 */
	upLoad();
	$('.funBtn > span').click(function(){
		var src = $('.imgShow').attr('data-src');
		console.log(src);
		if(src==''||src==undefined){
			return false;
		}
		var htmls = '<div class="image">'+
							'<img class="picBase" src="'+src+'">'+
							'<p><span class="changeImg">修改</span>|<span class="delectImg">删除</span></p>'+
						'</div>';
		//console.log(src);
		if($('.image').length==3){
			$('.image').eq(2).remove();
			$('.image').eq(0).before(htmls);
		}else if($('.image').length>=1){
			$('.image').eq(0).before(htmls);
		}else{
			$('#upload').before(htmls);
		}
		$('.picCrop img').attr('src','');
		$('.showRight > span').css('background','url('+src+') no-repeat center');
		$('.showRight > span').css('background-size','cover');
		$('.changeImg').unbind('click');
		$('.delectImg').unbind('click');
		$('.changeImg').click(function(){
			var n = $('.changeImg').index(this);
			var changeSrc = $('.image').eq(n).find('img').attr('src');
			//console.log(changeSrc);
			$('.imgShow').css('background','url('+src+') no-repeat center');
			$('.imgShow').css('background-size','cover');
			$('.imgShow').attr('data-src',src);
			//$('.showRight > img')
		});
		$('.delectImg').click(function(){
			var n = $('.delectImg').index(this);
			$('.image').eq(n).remove();
		});
	});
	/* 上传图片 */
	
	/* 生成配置文件 按钮 */
	$('.produceFile').click(function(){
		var wanreg = /^[0-9a-zA-Z]*$/;
		if(wanreg.test($('#wanPort').val())){
		}else{
			floatAlert(200, 50, "请输入正确的Wan口", 2500);
			return ;
		}
		if(wanreg.test($('#lanPort').val())){
		}else{
			floatAlert(200, 50, "请输入正确的Lan口", 2500);
			return ;
		}
		var str1 = $('#wanPort').val();
		var str2 = $('#lanPort').val();
		if(str1==''||str2==''){
			floatAlert(200, 50, "输入不合法无法生成配置文件", 2500);
			$('#lanPort').select();
		}else{
			$('.produceFile').css('display','none');
			$('.downloadFile').css('display','block');
			$('.changeFile').css('display','block');
			$('.produceBox > input').attr('readonly','readonly');
		}
	});

	$('.changeFile').click(function(){
		$('.produceFile').css('display','block');
		$('.downloadFile').css('display','none');
		$('.changeFile').css('display','none');
		$('.produceBox > input').removeAttr('readonly');
	});

	$('#speed_down').click(function(){
		$('#speed_down').next().css('display','none');
		$('#speed_down').next().css('display','block');
	});
	$('#speed_up').click(function(){
		$('#speed_up').next().css('display','none');
		$('#speed_up').next().css('display','block');
	});
	$('.speedBox .downSpeed > ul > li').click(function(){
		var n = $('.downSpeed > ul > li').index(this);
		var str = $('.downSpeed > ul > li').eq(n).text();
		if(str=='不限'){
			str = 0;
		}
		$('#speed_down').val(str);
		$('.downSpeed > ul').css('display','none');
	});
	$('.speedBox .upSpeed > ul > li').click(function(){
		var n = $('.upSpeed > ul > li').index(this);
		var str = $('.upSpeed > ul > li').eq(n).text();
		if(str=='不限'){
			str = 0;
		}
		$('#speed_up').val(str);
		$('.upSpeed > ul').css('display','none');
	});
	/* 生成配置文件 按钮 */
});



/** *************************************获得场所列表点击分页出发事件******************************************** */
function goPage() {
	$(".num").unbind('click');
	$('.num').click(function() {
		if (dang == undefined) {
			dang == 0;
		}
		;
		dang = $('.num').index(this);
		$('.num').removeClass('on').eq(dang).addClass('on');
		numdisp(dang);
		var dangs = $('.num.on').text();
		getsitesList(parseInt(dangs));

	});
	$("#lefts").unbind('click');
	$('#lefts').click(function() {
		if (dang == undefined) {
			dang == 0;
		}
		;
		dang--;
		if (dang < 0) {
			dang = 0;
			numdisp(dang);

		} else {
			$('.num').removeClass('on').eq(dang).addClass('on');
			numdisp(dang);
			var dangs = $('.num.on').text();
			getsitesList(parseInt(dangs));
		}

	});
	$("#rights").unbind('click');
	$('#rights').click(function() {
		if (dang == undefined) {
			dang == 0;
		}
		;
		dang++;
		if (dang > $('.num').length - 1) {
			dang = $('.num').length - 1;
			numdisp(dang);

		} else {
			$('.num').removeClass('on').eq(dang).addClass('on');
			numdisp(dang);
			var dangs = $('.num.on').text();
			getsitesList(parseInt(dangs));
		}
	});
}// $(".yesOrNo").unbind('click');
/** **********************************获得场所列表点击分页出发事件结束******************************************************** */
function load() {

	$('#exitSite').click(function() {
		$('.whether').css('display', 'block');

		$('.whether>.yesbutton').click(function() {
			$("#siteName").val('');
			$("#address").val('');
			$("#siteTotal").val('');
			whetherDisp(0);
		});
	});
	$('#exupSite').click(function() {
		$('.whether').css('display', 'block');

		$('.whether>.yesbutton').click(function() {
			$("#sitenames").val('');
			$("#siteadd").val('');
			$("#sitenum").val('');
			whetherDisp(0);
		});
	});

	$('.icon-false').click(function() {
		$('.whether>.yesbutton').click(function() {
			$("#siteName").val('');
			$("#address").val('');
			$("#siteTotal").val('');
			whetherDisp(0);
		});
	});

	$('.btn').click(function() {
		$('.editFloa').css('display', 'none');
		$('.floa').css('display', 'none');
		$('.addfloa').css('display', 'none');
		$('input').val('');
		$('.cloud').css('display', 'none');
		$('.clouds').text('');
		$('.cloudnum').text('');
		$('.cloudnums').val('');
		/* location.reload(); */
	});
	// 出现是否确定这样的操作的页面.
	$('.whether>button').click(function() {
		var n = $('.whether>button').index(this);
		whetherDisp(n);
	});
	$('.whethers>#whethers').click(function() {
		$('.whethers').css('display', 'none');
	});

	$('.new>h2>i').click(function() {
		maskDisp(1);
	});
	$('.plistContant>li>i.fn-i').click(function() {
		$('.floa').css('display', 'none');
		$('.addfloa').css('display', 'none');
		$('.editFloa').css('display', 'none');
		var n = $('.plistContant>li>i.fn-i').index(this);
		var obj = $('.floa');
		floaBlock(obj, n);
	});
	$('.plistContant>li>i.fn-ii').click(function() {
		$('.floa').css('display', 'none');
		$('.addfloa').css('display', 'none');
		$('.editFloa').css('display', 'none');
		var n = $('.plistContant>li>i.fn-ii').index(this);
		var obj = $('.editFloa');
		floaBlock(obj, n);
	});
	// 设备详情
	/*
	 * $('.deviceBtn').click(function(){ $('.new').css('display','none');
	 * $('.mask').css('display','block');
	 * $('.DeviceInfo').css('display','block');
	 * $('.newly').animate({left:'20%'},1000); });
	 */
	/*$('.add-floa').click(function() {
		$('.floa').css('display', 'none');
		$('.addfloa').css('display', 'none');
		$('.editFloa').css('display', 'none');
		var n = $('.add-floa').index(this);
		var obj = $('.addfloa');
		floaBlock(obj, n);
	});*/

	$('.newAdd').click(function() {
		$('.premises > h2').html('新增场所<i class="icon icon-false"></i>');
		$(".new").css('display', 'none');
		$(".premises").css('display', 'block');
		$('.mask').css('display', 'block');
		$('.newly').animate({
			left : '20%'
		}, 1000);
		$('.btns').animate({
			left : '20%'
		}, 1000);
		$('.new>h2>i').unbind('click');
		$('.new>h2>i').click(function() {
			maskDisp(1);
		});
	});

	/*
	 * $('.deviceBtns').click(function() { $(".premises").css('display',
	 * 'none'); $('.mask').css('display', 'block'); $('.newly').animate({ left :
	 * '20%' }, 1000); $('.btns').animate({left:'20%'},1000); });
	 */
	/* --------------添加设备4.1.1--------------- */
	$('.add-floa').click(function() {
		var n = $('.add-floa').index(this);
		//获取nasid触发
		getNasid();
		var siteId = $('.add-floa').eq(n).attr('id');
		$('#setInput').attr('siteId', siteId);
		$('.new').css('display', 'none');
		$('.addPlace').css('display', 'block');
		$('.mask').css('display', 'block');
		$('.newly').animate({
			left : '20%'
		}, 1000);
		$('.new>h2>i').click(function() {
			maskDisp(1);
		});
		$('.btns').animate({
			left : '20%'
		}, 1000);
		addPlaceType(siteId);

	})
	

}

var loader = function() {
	$('.barcontainer').css('display', 'block');
};
var floaBlock = function(obj, n) {

	obj.css('display', 'none').eq(n).css('display', 'block');
};

var listDispOn = function(obj, n) {
	obj.removeClass('on').eq(n).addClass('on');
};
var collDisp = function() {
	$(".pullD").toggle();
};
var numdisp = function(n) {

	if (n == 0) {
		$('.num').css('display', 'none');
		$('.num').eq(0).css('display', 'block');
		$('.num').eq(1).css('display', 'block');
		$('.num').eq(2).css('display', 'block');
		$('.num').eq(3).css('display', 'block');
	} else if (n == $('.num').length - 1) {
		$('.num').css('display', 'none');
		$('.num').eq(n - 3).css('display', 'block');
		$('.num').eq(n - 2).css('display', 'block');
		$('.num').eq(n - 1).css('display', 'block');
		$('.num').eq(n).css('display', 'block');
	} else if (n == $('.num').length - 2) {
		$('.num').css('display', 'none');
		$('.num').eq(n - 1).css('display', 'block');
		$('.num').eq(n).css('display', 'block');
		$('.num').eq(n + 1).css('display', 'block');
		$('.num').eq(n - 2).css('display', 'block');
	} else {
		$('.num').css('display', 'none');
		$('.num').eq(n - 1).css('display', 'block');
		$('.num').eq(n).css('display', 'block');
		$('.num').eq(n + 1).css('display', 'block');
		$('.num').eq(n + 2).css('display', 'block');
	}
};
var zong = function() {

	var n = $('.num').length;

	$('.zong').html('共' + n + '页');
};
var win = function() {
	$('.win').css('display', 'block').fadeOut(5000);
};

var maskDisp = function(n) {
	if ($('.whiteAdd').css('display') == 'block') {
		$('.new').css('display', 'none');
		$('.DeviceInfo').css('display', 'block');
		$('.whether').css('display', 'none');
	} else {
		if (n == 0) {
			$('.newly').animate({
				left : 2000
			}, 1000);
			$('.btns').animate({
				left : 2000
			}, 1000);
			setTimeout(function() {
				$('.mask').css('display', 'none');
			}, 500);
		} else {
			$('.whether').css('display', 'block');
		}
	}
};
var maskDispS = function(n) {
	if ($('.whiteAdd').css('display') == 'block') {
		$('.new').css('display', 'none');
		$('.DeviceInfo').css('display', 'block');
		$('.whether').css('display', 'none');
	}
};
var whetherDisp = function(n) {
	if ($('.whiteAdd').css('display') == 'block') {
		$('.new').css('display', 'none');
		$('.DeviceInfo').css('display', 'block');
		$('.whether').css('display', 'none');
	} else {
		if (n == 0) {
			$('.whether').css('display', 'none');
			$('.newly').animate({
				left : 2000
			}, 1000);
			$('.btns').animate({
				left : 2000
			}, 1000);
			setTimeout(function() {
				$('.mask').css('display', 'none');
			}, 500);
			setTimeout(function() {
				location.reload();
			}, 500);
		} else {
			$('.whether').css('display', 'none');
		}
	}
};

var fuse_on_off = function(str) {
	if (str == "yesOrNo") {
		$('.fuse>.yesOrNo').addClass('on');

		$('.operator').css('display', 'none');
	} else {
		$('.fuse>.yesOrNo').removeClass('on');

		$('.operator').css('display', 'block');
	}
};
var charge_on_off = function(str) {
	if (str == "yesOrNo") {
		// $('.charge>.yesOrNo').addClass('on');
		$('.import').css('display', 'none');
		$('.fuse').css('display', 'none');
	} else {
		// $('.charge>.yesOrNo').removeClass('on');
		$('.import').css('display', 'block');
		$('.fuse').css('display', 'block');
	}
};
var on_off = function(str, n) {
	if (str == "yesOrNo") {
		$('.yesOrNo').eq(n).addClass('on');
	} else {
		$('.yesOrNo').eq(n).removeClass('on');
	}
};
// /////////////////
var fuse_on_offs = function(str) {
	if (str == "yesOrNos") {
		$('.fuse>.yesOrNos').addClass('on');

		$('.operator').css('display', 'none');
	} else {
		$('.fuse>.yesOrNos').removeClass('on');

		$('.operator').css('display', 'block');
	}
};
var charge_on_offs = function(str) {
	if (str == "yesOrNos") {
		// $('.charge>.yesOrNo').addClass('on');
		$('.import').css('display', 'none');
		$('.fuse').css('display', 'none');
	} else {
		// $('.charge>.yesOrNo').removeClass('on');
		$('.import').css('display', 'block');
		$('.fuse').css('display', 'block');
	}
};
var on_offs = function(str, n) {
	if (str == "yesOrNos") {
		$('.yesOrNos').eq(n).addClass('on');
	} else {
		$('.yesOrNos').eq(n).removeClass('on');
	}
};

// ///////////////////

var fuse_on_offss = function(str) {
	if (str == "yesOrNoss") {
		$('.fuse>.yesOrNoss').addClass('on');

		$('.operator').css('display', 'none');
	} else {
		$('.fuse>.yesOrNoss').removeClass('on');

		$('.operator').css('display', 'block');
	}
};
var charge_on_offss = function(str) {
	if (str == "yesOrNoss") {
		// $('.charge>.yesOrNo').addClass('on');
		$('.import').css('display', 'none');
		$('.fuse').css('display', 'none');
	} else {
		// $('.charge>.yesOrNo').removeClass('on');
		$('.import').css('display', 'block');
		$('.fuse').css('display', 'block');
	}
};
var on_offss = function(str, n) {
	if (str == "yesOrNoss") {
		$('.yesOrNoss').eq(n).addClass('on');
	} else {
		$('.yesOrNoss').eq(n).removeClass('on');
	}
};

var colorsLoad = function() {
	var colors = [ '#fc5050', '#6bbdec', '#cacaca' ];
	var obj = $('.deviceList>p>span>button');
	for (var i = 0; i < obj.length; i++) {
		// var str=$(obj[i]).html();
		var str = $(obj[i]).html();
		if (str == '异常') {
			$(obj[i]).css('color', colors[0]);
		} else if (str == '正常') {
			$(obj[i]).css('color', colors[1]);
		} else if (str == '空闲') {
			$(obj[i]).css('color', colors[2]);
		}
	}
};
/** *******************************场所列表********************************* */
function getsitesList(num) {

	if (num == undefined)
		return;
	if (isNaN(num))
		return;
	$.ajax({
		type : "get",
		url : ctx + "/CloudSiteManage/getUserSiteLists?date=" + Math.random(),
		data : {
			curPage : num,
			pageSize : 9
		},
		success : function(data) {
			eval("data = " + data);
			if (data.code == 200) {
				buffer();
				buildTable(data);
				load();
				// 调用分页
				goPage();
				updateSiteName();
				updateSiteAddress();
				updateSiteTrySwitch();
				updateTerminalNumber();
				addDevice();
				getsiteId();
				// getaDeviceInfo(1);
				updataAuthSwith();
				// getdevicePage();
			} else {
				$(".win>span").html(data.msg);
				win();
			}
		},
		error : function() {
			$(".win>span").html(data.msg);
			win();
		}
	});

}

function pullDownd(obj, n) {
	if (obj.eq(n).css('display') == 'none') {
		obj.css('display', 'none').eq(n).css('display', 'block');
	} else {
		obj.css('display', 'none')
	}

}

/**
 * 渲染列表
 * @param data
 */
function buildTable(data) {
	var table = $(".container>div>ul.plistContant");
	table.remove();
	data = data.data.data;
	var tableHtml = '';
	for (var i = 0; i < data.length; i++) {
		tableHtml += "<ul class='plistContant' id='" + data[i].id + "'>";
		tableHtml += "<p class='unu' style='"+(data[i].yiChang=='ok'?'display:block':'display:none')+"'><span>该场所设备出现异常</span></p>"
		tableHtml += "<li title='" + data[i].site_name + "'><p>"
				+ data[i].site_name
				+ "</p><i class='icon icon-edit on fn-i' id='" + data[i].id
				+ "'></i>";
		tableHtml += "<div class='floa'>";
		tableHtml += "<input type='text' placeholder='场所名称' class='"
				+ data[i].id + "' value=''>";
		tableHtml += "<span style='display:none' id='name" + data[i].id
				+ "' class='cloud'>场所名称不能为空</span>";
		tableHtml += "<p><button class='btn ok'>确定</button><button class='btn'>取消</button></p>";
		tableHtml += "</div>";
		tableHtml += "</li>";
		tableHtml += "<li title='" + data[i].address + "'><p>"
				+ data[i].address + "</p><i class='icon icon-edit fn-i' id='"
				+ data[i].id + "'></i>";
		tableHtml += "<div class='floa'>";
		tableHtml += "<input type='text' placeholder='场所地址'class='c"
				+ data[i].id + "' value=''>";
		tableHtml += "<span style='display:none' id='address" + data[i].id
				+ "' class='cloud'>场所地址不能为空</span>";
		tableHtml += "<p><button class='btn okconfig'>确定</button><button class='btn'>取消</button></p>";
		tableHtml += "</div>";
		tableHtml += "</li>";
		tableHtml += "<li>"
				+ data[i].mac_num
				+ "&nbsp;&nbsp;<span class='add-floa' id='"
				+ data[i].id + "' >添加</span>&nbsp;&nbsp;<span class='deviceInfoBtn' id='"
				+ data[i].id + "'>设备详情</span>";
		tableHtml += "<div class='addfloa' id='addfloa'>";
		tableHtml += "<input type='text' id ='mac" + data[i].id
				+ "' placeholder='请输入MAC地址'>";
		tableHtml += "<span>注：设备必须在线且未绑定</span>";
		tableHtml += "<input type='text' id = 'macAddress" + data[i].id
				+ "' placeholder='请输入设备安装地址'>";
		tableHtml += "<span id='span" + data[i].id + "' class='clouds'></span>";
		tableHtml += "<p><button class='btno okmac' id='" + data[i].id
				+ "'>确定</button><button class='btn'>取消</button></p>";
		tableHtml += "</div>";
		tableHtml += "</li>";
		tableHtml += "<li class='pullDownd'>";
		tableHtml += "<span>"
				+ (data[i].is_probative == 0 ? '关闭' : data[i].is_probative)
				+ "</span>";
		tableHtml += "<ul>";
		tableHtml += "<li aid='" + data[i].id + "'>关闭</li>";
		tableHtml += "<li aid='" + data[i].id + "'>1小时</li>";
		tableHtml += "<li aid='" + data[i].id + "'>2小时</li>";
		tableHtml += "<li aid='" + data[i].id + "'>3小时</li>";
		tableHtml += "<li aid='" + data[i].id + "'>4小时</li>";
		tableHtml += "<li aid='" + data[i].id + "'>5小时</li>";
		tableHtml += "</ul>";
		tableHtml += "</li>";
		tableHtml += "<li><=" + data[i].allow_client_num
				+ "台<i class='icon icon-edit fn-ii' id='" + data[i].id
				+ "' title='输入设备数量'></i>";
		tableHtml += "<div class='editFloa'>";
		tableHtml += "<input type='text' id = 'finalnum" + data[i].id
				+ "' placeholder='请输入设备终端数' class='cloudnums'>";
		tableHtml += "<span id='fnum" + data[i].id
				+ "' class='cloudnum'></span>";
		tableHtml += "<p><button class='btnnum cloudnums'>确定</button><button class='btn'>取消</button></p>";
		tableHtml += "</div></li>";
		// tableHtml += "<li>"+data[i].macs+"</li>";
		tableHtml += "<li class='nameAuther'>";
		tableHtml += "<div class='"
				+ (data[i].state == 0 ? 'yesOrNoss' : 'yesOrNoss on')
				+ "' id='" + data[i].id + "'>";
		tableHtml += "<div class='bal'></div>";
		tableHtml += "<span class='yes'>ON</span>";
		tableHtml += "<span class='no'>OFF</span>";
		tableHtml += "</div>";
		tableHtml += "</li>";

		tableHtml += "<li>" + data[i].portalUserNum + "</li>";
		tableHtml += "<li>" + data[i].create_time + "</li>";
		tableHtml += "<li><button class='deviceBtns' id='" + data[i].id
				+ "'>场所管理</button></li>";
		tableHtml += "</ul>";
	}
	;
	$(".container>div>p.plistT").after(tableHtml);
	$('.pullDownd').click(function() {
		var n = $('.pullDownd').index(this);
		pullDownd($('.pullDownd > ul'), n)
	});
	updateSiteTrySwitch();// 更改试用时间

	/**
	 * 点击设备详情触发事件
	 */
	$('.deviceInfoBtn').unbind("click");
	$('.deviceInfoBtn').click(function() {
		$('.new').css('display', 'none');
		$('.mask').css('display', 'block');
		$('.DeviceInfo').css('display', 'block');
		$('.newly').animate({
			left : '20%'
		}, 1000);
		$('.btns').animate({
			left : '20%'
		}, 1000);
		var n = $('.deviceInfoBtn').index(this);
		var siteId = $('.deviceInfoBtn').eq(n).attr("id");
		getaDeviceInfo(1, siteId);
		$("#siteId").val(siteId);
		getdevicePage(siteId);
	});

};
/**
 * 场所列表总页数
 */
function getTotalPage() {
	$
			.ajax({
				type : "POST",
				url : ctx + "/CloudSiteManage/getTotalPage",
				data : {
					pageSize : 9
				},
				success : function(data) {
					eval("data = " + data);
					var total = parseInt(data);
					var html = "";
					// html += " <ul class='paging'>";
					html += "<li class='zong' id='zongDevice'>共  " + total
							+ " 页</li>";
					html += "<li class='goLeft' id='lefts'><i class='icon icon-left'></i></li>";

					for (var i = 1; i <= total; i++) {
						if (i == 1) {
							html += "<li class='num on'>" + i + "</li>";
						} else {
							html += " <li class='num'> " + i + " </li>";
						}
					}
					html += "<li class='goRight' id='rights'><i class='icon icon-right'></i></li>";
					html += "<p>跳转至<input style='width:50px;height:20px;border:1px solid skyblue' id='numToPages' type='tel'>页 <button id='jumpToPages' class='jumpGoToNum'>跳转</button></p>";
					// html += "</ul>";
					$("#paging").html(html);
					$('#jumpToPages').unbind('click');
					$('#jumpToPages')
							.click(
									function() {
										if ($('#numToPages').val() != "") {
											if (!isNaN($('#numToPages').val())) {
												var num = parseInt($(
														'#numToPages').val());
												var zong = parseInt($(
														'#zongDevice')
														.text()
														.replace(/[^0-9]/ig, ""));
												if (num >= zong) {
													num = zong;
												} else if (num <= 0) {
													num = 1;
												}
												$('.num').removeClass('on').eq(
														num - 1).addClass('on');
												getsitesList(num);
												numdisp(num - 1);
												$('#numToPages').val("");
											} else {
												$('#numToPages').val("");
											}
										}
									});
					$('#numToPages')
							.keypress(
									function(event) {
										var e = event
												|| window.event
												|| arguments.callee.caller.arguments[0];
										if (e && e.keyCode == 13) {
											// 要做的事情
											if ($('#numToPages').val() != "") {
												if (!isNaN($('#numToPages')
														.val())) {
													var num = parseInt($(
															'#numToPages')
															.val());
													var zong = parseInt($(
															'#zongDevice')
															.text().replace(
																	/[^0-9]/ig,
																	""));

													if (num >= zong) {
														num = zong;
													} else if (num <= 0) {
														num = 1;
													}
													$('.num').removeClass('on')
															.eq(num - 1)
															.addClass('on');
													getsitesList(num);
													numdisp(num - 1);
													$('#numToPages').val("");
												} else {
													$('#numToPages').val("");
												}
											}
										}
										;
									});
				},
				error : function() {
					$(".win>span").html('获得总页数失败!');
					win();
				}
			});
}
/** *******************************获得场所列表结束********************************* */
// 更改认证开关
function updataAuthSwith() {
	var siteId = '';
	var state = '';
	// $(".yesOrNos").unbind('click');
	$('.yesOrNoss').click(function() {
		var lang = $('.yesOrNoss').length;
		var n = $('.yesOrNoss').index(this);
		var str = $('.yesOrNoss').eq(n).attr('class');
		if (str == 'yesOrNoss') {
			states = $(".yesOrNoss>span.yes").eq(n).text();
		} else {
			states = $(".yesOrNoss>span.no").eq(n).text();
		}

		siteId = $(".yesOrNoss").eq(n).attr("id");

		if (n == lang - 2) {
			on_offss(str, n);
			charge_on_offss(str);
		} else if (n == lang - 1) {
			on_offss(str, n);
			fuse_on_offss(str);
		} else {
			on_offss(str, n);
		}
		if (states == 'ON') {
			state = 1;
		} else {
			state = 0;

		}

		$.ajax({
			type : "POST",
			url : ctx + "/CloudSiteManage/updateSiteRealNameSwitch",
			data : {
				state : $.trim(state),
				siteId : siteId
			},
			success : function(data) {
				eval("data=" + data);
				if (data.code == 200) {
					// getaDeviceInfo(1);
					$(".win>span").html(data.msg);
					win();

				} else {
					$(".win>span").html(data.msg);
					win();
				}
			},
			error : function() {
				$(".win>span").html('服务不可用');
				win();
			}
		});
	});
}

/** *******************************更改场所名字开始********************************* */
function updateSiteName() {
	var siteId = '';
	$('input').click(function() {
		$('.cloud').css('display', 'none');
	});
	// $(".container>div>ul.plistContant>li>i.icon.icon-edit").unbind('click');
	$(".container>div>ul.plistContant>li>i.icon.icon-edit")
			.click(
					function() {
						var index = $(
								".container>div>ul.plistContant>li>i.icon.icon-edit")
								.index(this);
						$(".container>div>ul.plistContant>li>i.icon.icon-edit")
								.removeClass("on").eq(index).addClass("on");
						siteId = $(
								".container>div>ul.plistContant>li>i.icon.icon-edit.on")
								.attr("id");
						$("." + siteId).keypress(function() {
							$("#name" + siteId).css("display", "none");
						});
					});
	$(".btn.ok").unbind('click');
	$(".btn").click(function() {
		$("#name" + siteId).css("display", "none");
	});
	$(".btn.ok").click(
			function() {
				siteName = $("." + siteId).val();
				if ($.trim(siteName) == null || $.trim(siteName) == ""
						|| $.trim(siteName) == undefined) {
					$("#name" + siteId).css("display", "block");
					return false;
				} else {

					$.ajax({
						type : "POST",
						data : {
							siteName : $.trim(siteName),
							siteId : siteId
						},
						url : ctx + "/CloudSiteManage/updateSiteName",
						success : function(data) {
							eval("data=" + data);
							if (data.code == 200) {
								buffer();
								$(".win>span").html(data.msg);
								win();
								getsitesList(1);

							} else {
								$(".win>span").html(data.msg);
								win();
							}
						},
						error : function() {
							$(".win>span").html('网路异常请重新修改...');
							win();
						}
					});
				}
			});
}
/** *******************************更改场所名字结束********************************* */
/** *******************************更改场所地址结束********************************* */
function updateSiteAddress() {
	var siteId = '';
	// $(".container>div>ul.plistContant>li>i.icon.icon-edit").unbind('click');
	$(".container>div>ul.plistContant>li>i.icon.icon-edit")
			.click(
					function() {
						var index = $(
								".container>div>ul.plistContant>li>i.icon.icon-edit")
								.index(this);
						$(".container>div>ul.plistContant>li>i.icon.icon-edit")
								.removeClass("on").eq(index).addClass("on");
						siteId = $(
								".container>div>ul.plistContant>li>i.icon.icon-edit.on")
								.attr("id");
						$(".c" + siteId).keypress(function() {
							$("#address" + siteId).css("display", "none");
						});
					});
	$(".btn.okconfig").unbind('click');
	$(".btn.okconfig").click(
			function() {

				siteAddress = $(".c" + siteId).val();
				if ($.trim(siteAddress) == null || $.trim(siteAddress) == ""
						|| $.trim(siteAddress) == undefined) {
					$("#address" + siteId).css("display", "block");
					return false;
				} else {
					$.ajax({
						type : "POST",
						url : ctx + "/CloudSiteManage/updateSiteAddress",
						data : {
							siteAddress : $.trim(siteAddress),
							siteId : siteId
						},
						success : function(data) {
							eval("data=" + data);
							if (data.code == 200) {
								$(".win>span").html(data.msg);
								win();
								getsitesList(1);
							} else {
								$(".win>span").html(data.msg);
								win();
							}
						},
						error : function() {
							$(".win>span").html('网路异常请重新修改...');
							win();
						}
					});
				}
			});
}
/** *******************************更改场所列表结束********************************* */
/** *******************************更改使用开关开始********************************* */
function updateSiteTrySwitch() {
	$('.pullDownd > ul > li').click(function() {
		var n = $('.pullDownd > ul > li').index(this);
		var str = $('.pullDownd > ul > li').eq(n).text();
		str = str.replace(/[^0-9]/ig, "");
		var siteId = $('.pullDownd > ul > li').eq(n).attr("aid");
		if (str == "" || str == null) {
			str = 0;
			$('.pullDownd > ul > li').eq(n).parent().prev().text("关闭");
		} else {
			$('.pullDownd > ul > li').eq(n).parent().prev().text(str);
		}
		$('.pullDownd > ul').css('display', 'none');

		$.ajax({
			type : "POST",
			url : ctx + "/CloudSiteManage/updateSiteTrySwitch",
			data : {
				switchState : str,
				siteId : siteId
			},
			success : function(data) {
				eval("data=" + data);
				if (data.code == 200) {
					$(".win>span").html("试用时间修改成功!");
					win();
					// getsitesList(1);
				} else {
					$(".win>span").html("试用时间修改失败!");
					win();
				}
			},
			error : function() {
				$(".win>span").html('网路异常请重新修改...');
				win();
			}
		});
		return false;
	});
}
/** *******************************更改使用开关结束********************************* */
/** *******************************更改终端数量********************************* */
function updateTerminalNumber() {
	$('input').click(function() {
		$('.cloudnum').text('');
	});
	var y = /^[1-9]+[0-9]*]*$/;
	var siteId = '';
	$('.plistContant>li>i.fn-ii').click(function() {
		var n = $('.plistContant>li>i.fn-ii').index(this);
		siteId = $('.plistContant>li>i.fn-ii').eq(n).attr('id');
	});
	$('.btnnum.cloudnums').click(function() {
		var input = $.trim($("#finalnum" + siteId).val());
		if (y.test(input) == false) {
			$("#fnum" + siteId).text('请输入大于0的正整数!');
			return false;
		} else {
			$.ajax({
				type : 'POST',
				url : ctx + "/CloudSiteManage/updateAllowMacNum",
				data : {
					macNum : input,
					siteId : siteId
				},
				success : function(data) {
					eval("data=" + data);
					if (data.code == 200) {
						$(".win>span").html(data.msg);
						win();
						getsitesList(1);
					} else {
						$(".win>span").html(data.msg);
						win();
					}
				},
				error : function() {
					$(".win>span").html("服务不可用，请稍后再试");
					win();
				}
			});
		}
	});

}
/** *******************************更改终端数量********************************* */

/** ******************************* 添加场所 ********************************* */
function addCloudSite() {
	$('#siteTotal').keypress(function() {
		$('#sNum').text('');
	});
	$('#siteTotal').click(function() {
		$('#sNum').text('');
	});
	$('#siteName').click(function() {
		$('#sName').text('');
	});
	$('#address').click(function() {
		$('#sAddress').text('');
	});
	$("#savaSite").unbind('click');
	$("#savaSite")
			.click(
					//新增方法
					function() {
						var siteName = $.trim($("#siteName").val());
						var address = $.trim($("#address").val());
						var siteNum = $.trim($("#siteTotal").val());
						//TODO
//						var picBase64 = $(".imgShow").attr("data-src");
						if (siteName == '' || siteName == null
								|| siteName == undefined) {
							$('#sName').text('场所名不能为空!');
							$('#sNum').text('');
							$('#sAddress').text('');
							return false;
						} else if (address == '' || address == null
								|| address == undefined) {
							$('#sName').text('');
							$('#sNum').text('');
							$('#sAddress').text('场所地址不能为空');
							return false;
						} else if (siteNum == '' || siteNum == null
								|| siteNum == undefined) {
							$('#sNum').text('场所人数不能为空!');
							$('#sName').text('');
							$('#sAddress').text('');
						} else if (parseInt(siteNum) <= 0) {
							$('#sNum').text('场所人数必须大于0的整数!');
							$('#sName').text('');
							$('#sAddress').text('');
							return false;
						} else {
							$.ajax({
								type : "POST",
								url : ctx
										+ "/CloudSiteManage/addCloudSite?time="
										+ Math.random(),
								data : {
									siteName : siteName,
									address : address,
									siteNum : siteNum,
									baseOne : $('.picBase').eq(0).attr("src"),
									baseTwo : $('.picBase').eq(1).attr("src"),
									baseThree : $('.picBase').eq(2).attr("src"),
								},
								success : function(data) {
									eval("data = " + data);
									if (data.code == 200) {
										$(".win>span").html(data.msg);
										win();
										getsitesList(1);
										$("#siteName").val('');
										$("#address").val('');
										$("#siteTotal").val('');
										maskDisp(0);
									} else {
										$(".win>span").html(data.msg);
										win();
										$("#siteName").val('');
										$("#address").val('');
										$("#siteTotal").val('');

									}
								},
								error : function() {
									$(".win>span").html("服务不可用，请稍后再试");
									win();
									$("#siteName").val('');
									$("#address").val('');
									$("#siteTotal").val('');
									$('.mask').css('display', 'block');
								}
							});
						}
					});
}
/** *******************************添加场所********************************* */

/** ******************************* 修改场所 ********************************* */
function updateCloudSite(siteId) {
	$('#siteTotal').keypress(function() {
		$('#sNum').text('');
	});
	$('#siteTotal').click(function() {
		$('#sNum').text('');
	});
	$('#siteName').click(function() {
		$('#sName').text('');
	});
	$('#address').click(function() {
		$('#sAddress').text('');
	});
	$("#savaSite").unbind('click');
	$("#savaSite").click(function() {
		//更新方法
		var siteName = $.trim($("#siteName").val());
		var address = $.trim($("#address").val());
		var siteNum = $.trim($("#siteTotal").val());
		if (siteName == '' || siteName == null || siteName == undefined) {
			$('#sName').text('场所名不能为空!');
			$('#sNum').text('');
			$('#sAddress').text('');
			return false;
		} else if (address == '' || address == null || address == undefined) {
			$('#sName').text('');
			$('#sNum').text('');
			$('#sAddress').text('场所地址不能为空');
			return false;
		} else if (siteNum == '' || siteNum == null || siteNum == undefined) {
			$('#sNum').text('请输入场所人数');
			$('#sName').text('');
			$('#sAddress').text('');
		} else if (parseInt(siteNum) <= 0) {
			$('#sNum').text('场所人数必须大于0的整数!');
			$('#sName').text('');
			$('#sAddress').text('');
			return false;
		} else {
			$.ajax({
				type : "POST",
				url : ctx + "/CloudSiteManage/updateCloudSite",
				data : {
					siteName : siteName,
					address : address,
					siteNum : siteNum,
					siteId : siteId,
					baseone : $('.picBase').eq(0).attr("src"),
					baseTwo : $('.picBase').eq(1).attr("src"),
					baseThree : $('.picBase').eq(2).attr("src"),
					nameOne : srcArrCopy[0],
					nameTwo : srcArrCopy[1],
					nameThree : srcArrCopy[2],
				},
				success : function(data) {
					eval("data = " + data);
					if (data.code == 200) {
						getsitesList(1);
						$("#siteName").val('');
						$("#address").val('');
						$("#siteTotal").val('');
						maskDisp(0);
					} else {
						$(".win>span").html(data.msg);
						win();
					}
				},
				error : function() {
					$(".win>span").html("服务不可用，请稍后再试");
					win();
					$('.mask').css('display', 'block');
				}
			});
		}
	});
}
/** *******************************修改场所********************************* */

/** *******************************添加设备********************************* */
function addDevice() {
	// $('.btn.okmac').unbind('click');
	$('input').click(function() {
		$('.clouds').text('');
	});
	$('.btno.okmac')
			.click(
					function() {
						var n = $('.btno.okmac').index(this);
						var siteId = $('.btno.okmac').eq(n).attr('id');
						var macs = /^[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}$/;
						var getmac = $.trim($('#mac' + siteId).val());
						//TODO
						var macAddress = $.trim($('#macAddress' + siteId).val()) != "" ? $.trim($('#macAddress' + siteId).val()) : $.trim($('#addressRos').val());
						var re = new RegExp(macs);
						var flag = re.test(getmac);
						if (getmac == "") {
							$("#span" + siteId).text('设备地址不能为空!');

							return false;
						}
						if (flag == false) {
							$("#span" + siteId).text('格式不正确(连接符号":"必须为英文符号)');

							return false;
						}
						if (macAddress == '') {
							$("#span" + siteId).text('设备所在安装位置不能为空!');
							return false;
						} else {
							$.ajax({
								type : "POST",
								url : ctx + "/CloudSiteManage/addDevice?time="
										+ Math.random(),
								data : {
									mac : getmac,
									siteId : siteId,
									macAddress : macAddress
								},
								success : function(data) {
									eval("data = " + data);
									if (data.code == 200) {
										$(".win>span").html('添加设备成功!');
										win();
										getsitesList(1);
										$.trim($("#mac").val(''));
										$.trim($("#macAddress").val(''));
										$("#span" + siteId).text('');
									} else {
										$(".win>span").html(
												data.msg + "错误码：" + data.code);
										win();
									}
								},
								error : function() {
									$(".win>span").html("服务不可用，请稍后再试");
									win();
								}
							});
						}
					});
}

/** *******************************添加设备********************************* */
/** *******************************获得设备详情开始********************************* */


var site_ids = '';
function getsiteId() {
	//图片个数
	var numPic = 0;
	$('.deviceBtns').unbind('click');
	$('.deviceBtns').click(function() {
		$(".premiseses").css('display', 'none');
		$(".premises").css('display', 'block');
		$('.mask').css('display', 'block');
		$('.newly').animate({
			left : '20%'
		}, 1000);
		$('.btns').animate({
			left : '20%'
		}, 1000);
		$('.premises > h2').html('修改场所<i class="icon icon-false"></i>');
		$('.new>h2>i').unbind('click');
		$('.new>h2>i').click(function() {
			maskDisp(1);
		});
		var n = $('.deviceBtns').index(this);
		infoSiteId = $('.deviceBtns').eq(n).attr('id');
		site_ids = infoSiteId;
		//清除缓存srcArr
		srcArr = new Array();
		//获得图片数据
		$.ajax({
			type : 'post',
			url : ctx + "/CloudSiteManage/getBannerUrl",
			async: false,
			data : {
				siteId : site_ids
			},
			success : function(data) {
				data = JSON.parse(data);
				if (data.code == 200) {
					srcArr=data.data;
				} else {
					floatAlert(200, 50, data.msg, 2500)
				}
			},
			error:function(){
			}
		});
//		$.post(ctx + "/CloudSiteManage/getBannerUrl",
//				{ siteId:site_ids}, 
//				function(data) {
//			  alert('cm');
//			});
//		srcArr.push("http://school-pic.oss-cn-beijing.aliyuncs.com/school_pic/69/20160629151441.jpg");
		for(var i = 0 ; i < srcArr.length ; i ++){
			if(srcArr[i] != ''){
				srcArrCopy[i] = srcArr[i];
				numPic++;
			}
			
		}
		//渲染图片至页面
		getImg(srcArr, numPic);
		getCloudSiteInfo(site_ids);
		updateCloudSite(site_ids);
	});
}


// 获得当前的场所信息
function getCloudSiteInfo(siteId) {
	$.ajax({
		type : "POST",
		url : ctx + "/CloudSiteManage/getCloudById",
		data : {
			siteId : siteId
		},
		success : function(data) {
			eval("data = " + data);
			if (data.code == 200) {
				$("#siteName").val(data.data.site_name);
				$("#address").val(data.data.address);
				$("#siteTotal").val(data.data.siteNum);
				$("#updateSiteId").val(data.data.id);
				var url = data.data.bannerUrl;
				if (url == "" || null == url || undefined == url) {
				} else {
					var urls = url.split(",");
					for (var i = 0; i < urls.length; i++) {
						// 渲染bannerurl
					}
				}
			} else {
				$(".win>span").html(data.msg);
				win();
			}
		},
		error : function() {
			$(".win>span").html("服务不可用，请稍后再试");
			win();
		}
	});
}

function getaDeviceInfo(num, siteId) {
	if (num == undefined)
		return;
	if (isNaN(num))
		return;
	$("#deviceListInfo>ul").remove();
	$
	        .ajax({
				type : "POST",
				url : ctx + "/CloudSiteManage/getaDeviceInfo?time="
						+ Math.random(),
				data : {
					curPage : num,
					siteId : siteId,
					pageSize : 9
				},
				async : false,
				success : function(data) {
					eval("data = " + data);
					if (data.code == 200) {
						buffer();
						var data = data.data.data;
						var htmls = "";

						for (var i = 0; i < data.length; i++) {
							htmls += "<ul class='deviceInfos'>";
							htmls += "<li>" + data[i].mac + "</li>";
							/* htmls += "<li>"+data[i].authcount+"</li>"; */
							htmls += "<li title='"+ (data[i].install_position == '' ? '未知位置': data[i].install_position)+ "'>"
									+ (data[i].install_position == '' ? '未知位置': data[i].install_position)+ "</li>";
							/*htmls += "<li>"
									+ (data[i].ssid == '' ? '未知' : data[i].ssid)
									+ "</li>";*/
							htmls += "<li>" + data[i].homeurl + "</li>";
							htmls += "<li title='" + (data[i].statue == '正常' ? '---' : (data[i].last_time==undefined?'未知':data[i].last_time)) + "'>"
									+ (data[i].statue == '正常' ? '---' : (data[i].last_time==undefined?'未知':data[i].last_time)) + "</li>";
							htmls += "<li>" + data[i].version + "</li>";
							/*htmls += "<li>";
							htmls += "<div class='"
									+ (parseInt(data[i].authStatue) == 0 ? 'yesOrNos on'
											: 'yesOrNos') + "' id='"
									+ data[i].mac + "'>";
							htmls += "<span class='yes'>ON</span>";
							htmls += "<div class='bal'></div>";
							htmls += "<span class='no'>OFF</span>";
							htmls += "</div>";
							htmls += "</li>";*/
							htmls += "<li>" + (data[i].nasid==undefined?'暂无':data[i].nasid) + "</li>";
							htmls += "<li style='color:"+ (data[i].statue == '正常' ? '#6bbdec': (data[i].statue == '异常' ? '#fc5050': '#cacaca')) + "'>"
									+ data[i].statue + "</li>";
							htmls += "<li>";
							
							htmls += "<p class='fn-addWhite' id='"
									+ data[i].mac + "'>添加白名单</p><button id='"
									+ data[i].mac
									+ "' class='whiteDelete'>删除</button>";
							htmls += "</li>";
							htmls += "</ul>";
						}
						$("#deviceListInfo>h6").after(htmls);
						loadclick();
						deleteErrorDevice();

						updateAuthSwitch();
						getWhiteList();
					} else {
						$(".win>span").html(data.msg);
						win();
					}
				},
				error : function() {
					$(".win>span").html("服务不可用，请稍后再试");
					win();
				}
			});
	/* }); */
}
/** *******************************获得设备详情结束********************************* */

function loadclick() {
	$('.fn-addWhite').click(function() {
		$('.new').css('display', 'none');
		$('.whiteAdd').css('display', 'block');
	});

}
function addMac(mac) {
	$(".addMAC").unbind('click');
	$('.addMAC')
			.click(
					function() {
						var htm = "<p class='MACtents'><input id='"
								+ mac
								+ "' type='text' placeholder='请输入MAC地址' value='' class='addMacs'><span><i class='icon icon-false'></i></span></p>";
						var len = $('.MACtents').length - 1;
						$('.addMAC').before(htm);
						endBuild();
						if ($("input[id='" + mac + "']").val() == '') {
							$(".win>span").html('您有未添加的设备mac地址!');
							win();
							return false;
						}

					});

}
function endBuild() {
	$(".MACtents>span").unbind('click');
	$('.MACtents>span').click(function() {
		var n = $('.MACtents>span').index(this);
		$('.MACtents').eq(n).remove();
		return false;
	});
}
/** *******************************获得设备详情分页开始********************************* */
function getdevicePage(siteId) {
	$
			.ajax({
				type : "POST",
				url : ctx + "/CloudSiteManage/getaDeviceInfo?data="
						+ Math.random(),
				data : {
					pageSize : 9,
					siteId : siteId
				},
				success : function(data) {
					eval("data = " + data);
					var total = parseInt(data.data.totalPages);
					var html = "";

					// html += " <ul class='paging'>";
					html += "<li class='zong' id='zongTo'>共  " + (total==0?1:total)
							+ " 页</li>";
					html += "<li class='goLeft'  id='left'><i class='icon icon-left'></i></li>";
					if(total==0){
						html += "<li class='num on n'>" + 1 + "</li>";
					}else{
						for (var i = 1; i <= total; i++) {
							if (i == 1) {
								html += "<li class='num on n'>" + i + "</li>";
							} else {
								html += " <li class='num n'>" + i + " </li>";
							}
						}
					}
					html += "<li class='goRight' id='right'><i class='icon icon-right'></i></li>";
					html += "<p>跳转至<input style='width:50px;height:20px;border:1px solid skyblue' id='numToPage' type='tel'>页 <button id='jumpToPage' class='jumpGoToNum'>跳转</button></p>";
					// html += "</ul>";

					$(".new>.deviceList>div>ul.paging").html(html);
					toDevicePage();
					/**
					 * 设备详情查询回车事件
					 */
					$('#numToPage')
							.keypress(
									function(event) {
										var siteId = $("#siteId").val();
										var e = event
												|| window.event
												|| arguments.callee.caller.arguments[0];
										if (e && e.keyCode == 13) {
											// 要做的事情
											if ($('#numToPage').val() != "") {
												if (!isNaN($('#numToPage')
														.val())) {
													var num = parseInt($(
															'#numToPage').val());
													var zong = parseInt($(
															'#zongTo').text()
															.replace(
																	/[^0-9]/ig,
																	""));
													if (num >= zong) {
														num = zong;
													} else if (num <= 0) {
														num = 1;
													}
													$('.num').removeClass('on')
															.eq(num).addClass(
																	'on');
													numdisp(num);
													getaDeviceInfo(num, siteId);
													$('#numToPage').val("");
												} else {
													$('#numToPage').val("");
												}
											}
										}
										;
									});
					/**
					 * 设备详情跳转按钮CLIKC事件
					 */
					$('#jumpToPage').click(
							function() {
								var siteId = $("#siteId").val();
								if ($('#numToPage').val() != "") {
									if (!isNaN($('#numToPage').val())) {
										var num = parseInt($('#numToPage')
												.val());
										var zong = parseInt($('#zongTo').text()
												.replace(/[^0-9]/ig, ""));
										if (num >= zong) {
											num = zong;
										} else if (num <= 0) {
											num = 1;
										}
										$('.num').removeClass('on').eq(num)
												.addClass('on');
										getaDeviceInfo(num, siteId);
										numdisp(num);
										$('#numToPage').val("");
									} else {
										$('#numToPage').val("");
									}
								}
							});

				},
				error : function() {
					$(".win>span").html('获得设备详情总页数失败!');
					win();
				}
			});
}

// 获得设备分页条
function toDevicePage() {
	dang = 0;
	$(".num.n").unbind('click');
	$('.num.n').click(function() {
		var siteId = $("#siteId").val();
		// if(dangs==undefined){dangs==0;};
		dang = $('.num.n').index(this);
		$('.num.n').removeClass('on').eq(dang).addClass('on');
		numdisp(dang);
		dangs = $('.num.n.on').text();
		getaDeviceInfo(parseInt(dangs), siteId);
	});
	$("#left").unbind('click');
	$('#left').click(function() {
		var siteId = $("#siteId").val();
		// if(dangs==undefined){dangs==0;};
		dang--;
		if (dang < 0) {
			dang = 0;
			numdisp(dang);

		} else {
			$('.num.n').removeClass('on').eq(dang).addClass('on');
			numdisp(dang);
			dangs = $('.num.on.n').text();
			getaDeviceInfo(parseInt(dangs), siteId);
		}
	});
	$("#right").unbind('click');
	$('#right').click(function() {
		var siteId = $("#siteId").val();
		// if(dangs==undefined){dangs==0;};
		dang++;
		if (dang > $('.num.n').length - 1) {
			dang = $('.num.n').length - 1;
			numdisp(dang);

		} else {
			$('.num.n').removeClass('on').eq(dang).addClass('on');
			numdisp(dang);
			dangs = $('.num.on.n').text();
			getaDeviceInfo(parseInt(dangs), siteId);
		}
	});
}
/** *******************************获得设备详情分页结束的位置********************************* */

/** *******************************删除异常的设备开始位置********************************* */
function deleteErrorDevice() {
	$('.deviceInfos>li>.whiteDelete').click(function() {
		var siteId = $("#siteId").val();
		$('.whethers').css('display', 'block');
		var n = $('.deviceInfos>li>.whiteDelete').index(this);
		var mac = $.trim($('.deviceInfos>li>.whiteDelete').eq(n).attr('id'));
		$('.whethers>#yes').unbind('click');
		$('.whethers>#yes').click(function() {
			$('.whethers').css('display', 'none');
			$.ajax({
				type : 'POST',
				url : ctx + '/CloudSiteManage/deleteNotNormalDevice',
				data : {
					mac : mac
				},
				success : function(data) {
					eval('data=' + data);
					if (data.code == 200) {
						buffer();
						getaDeviceInfo(1, siteId);
						$(".win>span").html(data.msg);
						win();
					} else {
						$(".win>span").html(data.msg);
						win();
					}
				},
				error : function() {
					$(".win>span").html('网络服务不可用');
					win();
				}
			});
		});
	});
}

/** ******************************删除异常的设备结束的位置********************************* */

/** ******************************更改认证开关的位置********************************* */
function updateAuthSwitch() {
	var authState = '';
	var mac = '';
	var states = '';
	// $(".yesOrNos").unbind('click');
	$('.yesOrNos').click(function() {
		var lang = $('.yesOrNos').length;
		var n = $('.yesOrNos').index(this);
		var str = $('.yesOrNos').eq(n).attr('class');
		if (str == 'yesOrNos') {
			states = $(".yesOrNos>span.yes").eq(n).text();
		} else {
			states = $(".yesOrNos>span.no").eq(n).text();
		}

		mac = $(".yesOrNos").eq(n).attr("id");
		if (n == lang - 2) {
			on_offs(str, n);
			charge_on_offs(str);
		} else if (n == lang - 1) {
			on_offs(str, n);
			fuse_on_offs(str);
		} else {
			on_offs(str, n);
		}
		if (states == 'ON') {
			authStates = 0;
		} else {
			authStates = 1;

		}
		$.ajax({
			type : "POST",
			url : ctx + "/CloudSiteManage/updateAuthSwith",
			data : {
				anthState : $.trim(authStates),
				mac : mac
			},
			success : function(data) {
				eval("data=" + data);
				if (data.code == 200) {
					// getaDeviceInfo(1);
					$(".win>span").html(data.msg);
					win();

				} else {
					$(".win>span").html(data.msg);
					win();
				}
			},
			error : function() {
				$(".win>span").html('服务不可用');
				win();
			}
		});
	});
}

/** ******************************更改认证开关的位置结束的位置********************************* */

/** ******************************查找白名单结束的位置********************************* */
function getWhiteList() {
	var mac = '';
	$('.deviceInfos>li>.fn-addWhite')
			.click(
					function() {
						var n = $('.deviceInfos>li>.fn-addWhite').index(this);
						mac = $.trim($('.deviceInfos>li>.fn-addWhite').eq(n)
								.attr('id'));
						$
								.ajax({
									type : "POST",
									url : ctx + "/CloudSiteManage/getWhiteList",
									data : {
										mac : mac
									},
									success : function(data) {
										eval("data=" + data);
										if (data.code == 200) {
											var htm = '';
											var len = $('.MACtent').length;
											for (var i = 0; i < data.data.length; i++) {
												htm += "<p class='MACtent'><input id='"
														+ mac
														+ "' type='text' placeholder='请输入MAC地址' value='"
														+ data.data[i]
														+ "' class='addMacs'><span><i class='icon icon-false'></i></span></p>";
											}
											// htm+="<p class='MACtents'><input
											// id='"+mac+"' type='text'
											// placeholder='请输入MAC地址' value=''
											// class='addMacs'><span><i
											// class='icon
											// icon-false'></i></span></p>";
											htm += "<span class='addMAC'><i class='icon icon-add'></i>新增白名单</span>";
											$('.MACinfo').html(htm);
											loadclick();
											deleteWhiteList(mac);
											addMacList(mac);
											addMac(mac);
											endBuild();
											exitMac();
										} else {
											htms = "<p class='MACtents'><input id='"
													+ mac
													+ "' type='text' placeholder='请输入MAC地址' value='' class='addMacs'><span><i class='icon icon-false'></i></span></p>";
											htms += "<span class='addMAC'><i class='icon icon-add'></i>新增白名单</span>";
											$('.MACinfo').html(htms);
											addMac(mac);
											loadclick();
											deleteWhiteList(mac);
											addMacList(mac);
											endBuild();
											exitMac();
											$(".win>span").html(data.msg);
											win();
										}
									},
									error : function() {
										$(".win>span").html("网络服务忙,请稍后·····");
										win();
									}

								});

					});

}
/** ******************************获得白名单结束的位置********************************* */
/** ******************************删除白名单开始的位置********************************* */
function deleteWhiteList(mac) {

	$(".MACtent>span").unbind('click');
	$('.MACtent>span').click(function() {

		var n = $('.MACtent>span').index(this);
		var name = $('.MACtent>span').eq(n).prev().val();
		if (name == null || name == "") {
			$('.MACtent').eq(n).remove();
			return false;
		} else {

			$.ajax({
				type : 'POST',
				url : ctx + '/CloudSiteManage/deleteMacList',
				data : {
					mac : mac,
					deleteMac : name
				},
				success : function(data) {
					eval("data=" + data);
					if (data.code == 200) {
						$(".win>span").html(data.msg);
						win();
						$('.MACtent').eq(n).remove();
						return false;
					} else {
						$(".win>span").html(data.msg);
						win();
					}
				},
				error : function() {
					$(".win>span").html("网络服务忙,请稍后·····");
					win();
				}
			});
		}
	});

}
/** ******************************删除白名单结束的位置********************************* */

/** ******************************增加白名单结束的位置********************************* */
function addMacList(mac) {
	var macs = /^[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}$/;
	$('#saveMac').click(function() {
		var last = $.trim(jQuery("input[id='" + mac + "']:last").val());
		var result = [];
		var leng = jQuery("input[id='" + mac + "']").length;
		jQuery("input[id='" + mac + "']").each(function(i) {
			var val = $.trim(jQuery(this).val());
			var ismac = macs.test(val);
			if (i != leng - 1) {
				if (last == val) {
					$(".win>span").html("您输入的mac地址" + val + "与原有mac重复!");
					win();
					result = [];
					return false;
				}
			}
			if (val == '') {
				$(".win>span").html("您有未添加的设备mac地址,请添加mac或者取消操作!");
				win();
				result = [];
				return false;
			} else {
				if (ismac == false) {
					$(".win>span").html("mac格式不正确,正确样式AC:A2:13:9C:DE:FC");
					win();
					result = [];
					return false;
				} else {
					result.push(val);
				}
			}
		});
		if (result[0] == "" || result[0] == null) {
			return false;
		} else {
			$.ajax({
				type : 'POST',
				url : ctx + '/CloudSiteManage/addMacList',
				data : {
					mac : mac,
					addMac : result.toString()
				},
				success : function(data) {
					eval('data=' + data);
					if (data.code == 200) {
						$(".win>span").html(data.msg);
						win();
						maskDispS(1);
					} else {
						$(".win>span").html("以上mac已经添加,请添加新设备mac地址或者取消本次操作!");
						win();
					}
				},
				error : function() {
					$(".win>span").html("网络服务忙,请稍后·····");
					win();
				}
			});
		}
	});
}

/** ******************************增加白名单结束的位置********************************* */
function exitMac() {
	$('#exiteMac').click(function() {
		maskDispS(1);
	});
	
	
}


/* ----------------------添加设备4.1.1---------------------------- */
function addPlaceType(siteId) {
	$.ajax({
		type : 'post',
		url : ctx + "/CloudSiteManage/getRouterTypeList",
		success : function(data) {
			data = JSON.parse(data);
			if (data.code == 200) {
				var htmls = '';
				for (var i = 0; i < data.data.length; i++) {
					htmls += '<li data-key="' + data.data[i].router_type + '">'
							+ data.data[i].router_name + '</li>';
				}
				$('.placePullDown > ul').html(htmls);
				$('.placePullDown > span').text(data.data[0].router_name);
				$('.placePullDown > span').attr('data-key',
						data.data[0].router_type);
				radiusNAS(data.data[0].router_type);
				inputs($('.placePullDown > span').attr('data-key'));
				$('.placePullDown > ul > li').unbind("click")
				$('.placePullDown > ul > li').click(function() {
					$('.inputs > span').before("");
					var obj = $('.placePullDown > ul > li');
					var n = obj.index(this);
					var str = obj.eq(n).text();
					var key = obj.eq(n).attr('data-key');
					$('.placePullDown > span').text(str);
					$('.placePullDown > span').attr('data-key', key);
					$('.placePullDown > ul').css('display', 'none');
					inputs(key,siteId);
					radiusNAS(key);
					getNasid();
				});
			}
		}
	});
}
function radiusNAS(str){
	if(str=='wifidog'){
		$('.radiusNAS').css('display','block');
		$('.radiusNAS > p').css('display','none');
		$('.ros').css('display','none');
		$('.deviceDetailInfo').css('display','block');
	}else if(str=='coovachilli'){
		$('.radiusNAS').css('display','block');
		$('.radiusNAS > p').css('display','none');
		$('.ros').css('display','none');
		$('.deviceDetailInfo').css('display','block');
	}else if(str=='ikuai'){
		$('.radiusNAS').css('display','block');
		$('.radiusNAS > p').css('display','block');
		$('.ros').css('display','none');
		$('.deviceDetailInfo').css('display','block');
	}else if(str=='ros'){
		$('.radiusNAS').css('display','none');
		$('.deviceDetailInfo').css('display','none');
		$('.ros').css('display','block');
		$('#wanPort').val('');
		$('#lanPort').val('');
	}
}
function inputs(str,siteId) {
	$('.inputs .addInput').remove();
	$('.inputs .upSpeed').remove();
	$('.inputs .downSpeed').remove();
	$('.sikeyImg').remove();
	$('.gwidImg').remove();
	$('.ik').remove();
	$('.gwid').parent().remove();
	if (str == 'wifidog') {
		$('.nasid').html('')
		var inputsHtml = '<input class="addInput" id="router_mac" type="text" placeholder="请输入MAC地址">'
				+ '<input class="addInput" id="router_side" type="text" placeholder="请输入设备安装地址">'
				+'<span>注：设备必须在线且未绑定</span>';
		$('.inputs').html(inputsHtml);
		 
	} else if (str == 'coovachilli') {
		$('.nasid').html('<input type="text" id="nasid" value="" readonly="readonly">NASID');
		var inputsHtml = '<input class="addInput" id="router_mac" type="text" placeholder="请输入MAC地址">'
				+ '<input class="addInput" id="router_side" type="text" placeholder="请输入设备安装地址">'
				+ '<input class="addInput" id="router_ip" type="text" placeholder="请输入设备外网IP地址">'
				+ '<input class="addInput" id="router_key" type="text" placeholder="请输入设备密钥" readonly="readonly">'+
				 '<div class="upSpeed">'+
					'<input class="addInput" id="router_up" type="text" placeholder="请输入设备上传速度">KB'+
					'<ul>'+
						'<li>不限</li>'+
						'<li>50</li>'+
						'<li>100</li>'+
						'<li>200</li>'+
						'<li>300</li>'+
						'<li>500</li>'+
					'</ul>'+
				'</div>'+
				'<div class="downSpeed">'+
					'<input class="addInput" id="router_down" type="text" placeholder="请输入设备下载速度">KB'+
					'<ul>'+
						'<li>不限</li>'+
						'<li>50</li>'+
						'<li>100</li>'+
						'<li>200</li>'+
						'<li>300</li>'+
						'<li>500</li>'+
					'</ul>'+
				'</div>';
		  		
		$('.inputs').html(inputsHtml);
		$('#router_down').click(function(){
			$('.upSpeed > ul').css('display','none');
			$('.downSpeed > ul').css('display','block');
		});
		$('#router_up').click(function(){
			$('.downSpeed > ul').css('display','none');
			$('.upSpeed > ul').css('display','block');
		});
		$('.downSpeed > ul > li').click(function(){
			var n = $('.downSpeed > ul > li').index(this);
			var str = $('.downSpeed > ul > li').eq(n).text();
			if(n==0){
				str = 0;
			}
			$('#router_down').val(str);
			$('.downSpeed > ul').css('display','none');
		});
		$('.upSpeed > ul > li').click(function(){
			var n = $('.upSpeed > ul > li').index(this);
			var str = $('.upSpeed > ul > li').eq(n).text();
			if(n==0){
				str = 0;
			}
			$('#router_up').val(str);
			$('.upSpeed > ul').css('display','none');
		});
		getNasid();
		
		//AJAX请求获取密钥
		$.ajax({
			type : 'post',
			url : ctx + "/CloudSiteManage/getSecret",
			data : {
				siteId : siteId
			},
			success : function(data) {
				data = JSON.parse(data);
				if (data.code == 200) {
					$('#router_key').val(data.data);
//					$('#router_key').val("fxwxwl");//秘钥默认全是fxwxwl
				} else {
					floatAlert(200, 50, data.msg, 2500)
					return ;
				}
			}
		});
		
	} else if (str == 'ikuai') {
		$('.nasid').html('<input type="text" value="" id="nasid" readonly="readonly">请将NASID复制到爱快后台请将NASID复制到爱快后台');
		var inputsHtml = '<input class="addInput" id="router_mac" type="text" placeholder="请粘贴爱快后台的GWID于此">'+
							'<input class="addInput" id="router_side" type="text" placeholder="请输入设备安装地址">'+
							'<p><span class="gwid">如何获取GWID?</span></p>'+
							'<div class="gwidImg"></div>'+
							'<input class="addInput" id="router_ip" type="text" placeholder="请输入设备IP地址">'+
							'<input class="addInput" id="router_key" type="text" placeholder="请输入设备密钥" readonly="readonly">'+
							'<p class="ik"><span class="sikey">请与爱快后台的设备密钥保持一致?</span></p>'+
							'<div class="sikeyImg"></div>'+
							'<div class="upSpeed">'+
								'<input class="addInput" id="router_up" type="text" placeholder="请输入设备上传速度">KB'+
								'<ul>'+
									'<li>不限</li>'+
									'<li>50</li>'+
									'<li>100</li>'+
									'<li>200</li>'+
									'<li>300</li>'+
									'<li>500</li>'+
								'</ul>'+
							'</div>'+
							'<div class="downSpeed">'+
								'<input class="addInput" id="router_down" type="text" placeholder="请输入设备下载速度">KB'+
								'<ul>'+
									'<li>不限</li>'+
									'<li>50</li>'+
									'<li>100</li>'+
									'<li>200</li>'+
									'<li>300</li>'+
									'<li>500</li>'+
								'</ul>'+
							'</div>';
		$('.inputs').html(inputsHtml);
		$('.gwid').hover(function(){
			$('.gwidImg').css('display','block');
			$('.gwidImg').animate({'opacity':'1','filter':'Alpha(opacity=100)'});
		},function(){
			$('.gwidImg').animate({'opacity':'0','filter':'Alpha(opacity=0)'},function(){
				$('.gwidImg').css('display','none');
			});
		});
		$('.sikey').hover(function(){
			$('.sikeyImg').css('display','block');
			$('.sikeyImg').animate({'opacity':'1','filter':'Alpha(opacity=100)'});
		},function(){
			$('.sikeyImg').animate({'opacity':'0','filter':'Alpha(opacity=0)'},function(){
				$('.sikeyImg').css('display','none');
			});
		});
		$('#router_down').click(function(){
			$('.upSpeed > ul').css('display','none');
			$('.downSpeed > ul').css('display','block');
		});
		$('#router_up').click(function(){
			$('.downSpeed > ul').css('display','none');
			$('.upSpeed > ul').css('display','block');
		});
		$('.downSpeed > ul > li').click(function(){
			var n = $('.downSpeed > ul > li').index(this);
			var str = $('.downSpeed > ul > li').eq(n).text();
			if(n==0){
				str = 0;
			}
			$('#router_down').val(str);
			$('.downSpeed > ul').css('display','none');
		});
		$('.upSpeed > ul > li').click(function(){
			var n = $('.upSpeed > ul > li').index(this);
			var str = $('.upSpeed > ul > li').eq(n).text();
			if(n==0){
				str = 0;
			}
			$('#router_up').val(str);
			$('.upSpeed > ul').css('display','none');
		});
		//AJAX请求获取ansid
		$.ajax({
			type : 'post',
			url : ctx + "/CloudSiteManage/generateNasid",
			data : {
				
			},
			success : function(data) {
				data = JSON.parse(data);
				if (data.code == 200) {
//					$('.nasid').html('<input type="text" id="nasid" value="'+data.data+'" readonly="readonly">请将NASID复制到爱快后台请将NASID复制到爱快后台');
					$('#nasid').val(data.data);
				} else {
					floatAlert(200, 50, data.msg, 2500)
				}
			}
		});
		//AJAX请求获取密钥
		$.ajax({
			type : 'post',
			url : ctx + "/CloudSiteManage/getSecret",
			data : {
				siteId : siteId
			},
			success : function(data) {
				data = JSON.parse(data);
				if (data.code == 200) {
					$('#router_key').val(data.data);
//					$('#router_key').val("fxwxwl");
				} else {
					floatAlert(200, 50, data.msg, 2500)
				}
			}
		});
	}else if(str == 'ros'){
		//AJAX请求获取ansid
		$.ajax({
			type : 'post',
			url : ctx + "/CloudSiteManage/generateNasid",
			data : {
				
			},
			success : function(data) {
				data = JSON.parse(data);
				if (data.code == 200) {
					$('#nasidRos').val(data.data);
				} else {
					floatAlert(200, 50, data.msg, 2500)
				}
			}
		});
		//AJAX请求获取密钥
		$.ajax({
			type : 'post',
			url : ctx + "/CloudSiteManage/getSecret",
			data : {
				siteId : siteId
			},
			success : function(data) {
				data = JSON.parse(data);
				if (data.code == 200) {
					$('#secretRos').val(data.data);
				} else {
					floatAlert(200, 50, data.msg, 2500)
				}
			}
		});
	}
	/*************************mac地址输入框失去焦点事件 by:cuimiao**********************************************/
	$('#router_ip').blur(function(){
		var ipreg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
		var domainreg = /^[0-9a-zA-Z]+[0-9a-zA-Z\.-]*\.[a-zA-Z]{2,4}$/;
		 if(ipreg.test($('#router_ip').val()) || domainreg.test($('#router_ip').val()))
	     {
			 
	     }
	     else{
	    	 floatAlert(200, 50, "请输入正确格式的ip或域名", 2500)
	     }
	});
	
	/**
	 * 替换字符
	 */
	function replace(str)
	{
	   re=new RegExp("l","g");
	   var newstart=str.replace(re,"t");
	   alert(newstr);
	}
	
	/**
	 * 上传下载触发校验
	 * */
	$('#router_up').blur(function(){
		var numreg = /^[0-9]*$/;
		if(numreg.test($('#router_up').val())){
			
		}else{
			floatAlert(200, 50, "请输入正确的上传速度", 2500)
		}
	});
	$('#router_down').blur(function(){
		var numreg = /^[0-9]*$/;
		if(numreg.test($('#router_down').val())){
			
		}else{
			floatAlert(200, 50, "请输入正确的下载速度", 2500)
		}
	});
	
	//wan lan 端口校验
	$('#wanPort').blur(function(){
		var numreg = /^[0-9a-zA-Z]*$/;
		if(numreg.test($('#wanPort').val())){
			
		}else{
			floatAlert(200, 50, "请输入正确的Wan口", 2500)
		}
	});
	
	//wan lan 端口校验
	$('#lanPort').blur(function(){
		var numreg = /^[0-9a-zA-Z]*$/;
		if(numreg.test($('#lanPort').val())){
			
		}else{
			floatAlert(200, 50, "请输入正确的Lan口", 2500)
		}
	});
	
	/**
	 * 上传下载触发校验
	 * */
	$('#speed_up').blur(function(){
		var numreg = /^[0-9]*$/;
		if(numreg.test($('#speed_up').val())){
			
		}else{
			floatAlert(200, 50, "请输入正确的上传速度", 2500)
		}
	});
	$('#speed_down').blur(function(){
		var numreg = /^[0-9]*$/;
		if(numreg.test($('#speed_down').val())){
			
		}else{
			floatAlert(200, 50, "请输入正确的下载速度", 2500)
		}
	});
	
	//判断该mac是否可以绑定，并检查mac格式
	$('#router_mac').blur(function(){
		//十六进制正则表达式
//		var sixteenreg = /^[0-9a-fA-F]{1,3}$/;
		var sixteenreg = /^[0-9a-fA-F]{12}$/;
		var mac = $('#router_mac').val().replace(/-/gm,'').replace(/:/gm,'').replace(/ /gm,'').toUpperCase();
//		//支持Mac地址以空格,"-",":"分开
//		var macreg = /^([0-9a-fA-F]{2})(([/\s:-][0-9a-fA-F]{2}){5})$/;
//		//支持中间没有任何符号
//		var macreg2 = /^([0-9a-fA-F]{2})(([0-9a-fA-F]{2}){5})$/;
		if($('.placePullDown > span').attr('data-key') != 'ikuai'){
			if(sixteenreg.test(mac)){
				$.ajax({
					type : 'post',
					url : ctx + "/CloudSiteManage/isHaveBindByMac",
					data : {
						mac : $('#router_mac').val() ? $('#router_mac').val() : ''
					},
					success : function(data) {
						data = JSON.parse(data);
						if (data.code == 200) {
							if(data.data){
								//该设备已经绑定，不能再次绑定
//								alert('该设备已经绑定，不能再次绑定');
								floatAlert(200, 50, '该设备已经绑定，不能再次绑定', 2500)
								return ;
							}
						}else{
							floatAlert(200, 50, data.msg, 2500)
						}
					}
				});
			}else{
				floatAlert(200, 50, "请输入正确的mac地址", 2500)
			}
		}
		
	});
	/*************************mac地址输入框失去焦点事件 end**********************************************/
	
	/**点击 下载配置文件触发*/
	$('.downloadFile').click(function(){
		//调用下载配置文件方法
		downloadConfig($('#wanPort').val(),$('#lanPort').val(),$('#nasidRos').val(),$('#secretRos').val());
	});
}
function copyUrl2(){
	var obj=document.getElementById("nasid");
	obj.select(); // 选择对象
	document.execCommand("Copy"); // 执行浏览器复制命令
	alert('复制成功')
}



function setInput(siteId) {
	
	//根据不同路由进行判断，是否可以注册
	var flagByType = false;
	
	//校验数字，校验上传下载速度
	var numreg = /^[0-9]*$/;
	if($('.placePullDown > span').attr('data-key') != 'wifidog'){
		if( (numreg.test($('#router_up').val()) && numreg.test($('#router_down').val())) || (numreg.test($('#speed_up').val()) && numreg.test($('#speed_down').val()))){
			flagByType = true;  
		}else{
			flagByType = false;
			floatAlert(200, 50, "请输入正确上传下载速度", 2500)
			return ;
		}
		if($('.placePullDown > span').attr('data-key') != 'ros'){
			if( $('#router_up').val() == '' || $('#router_down').val() == ''){
				floatAlert(200, 50, "请输入上传下载速度", 2500)
				return ;
			}
		}else{
			if( $('#speed_up').val() == '' || $('#speed_down').val() == ''){
				floatAlert(200, 50, "请输入上传下载速度", 2500)
				return ;
			}
		}
		
	}
	
	var wanreg = /^[0-9a-zA-Z]*$/;
	if(wanreg.test($('#wanPort').val())){
		flagByType = true;
	}else{
		flagByType = false;
		floatAlert(200, 50, "请输入正确的Wan口", 2500);
		return ;
	}
	if(wanreg.test($('#lanPort').val())){
		flagByType = true;
	}else{
		flagByType = false;
		floatAlert(200, 50, "请输入正确的Lan口", 2500);
		return ;
	}
	
	if($('.placePullDown > span').attr('data-key') == 'wifidog' || $('.placePullDown > span').attr('data-key') == 'ikuai' || $('.placePullDown > span').attr('data-key') == 'coovachilli'){
		var sixteenreg = /^[0-9a-fA-F]{12}$/;
		//标准mac地址，无：和-
		var macStandard = $('#router_mac').val().replace(/-/gm,'').replace(/:/gm,'').replace(/ /gm,'').toUpperCase();
		if($('.placePullDown > span').attr('data-key') != 'ikuai'){
			if(sixteenreg.test(macStandard)){
				flagByType = true;
			}else{
				flagByType = false;
				floatAlert(200, 50, "请输入正确的mac地址", 2500)
				return ;
			}
		}
		
		var ipreg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
		var domainreg = /^[0-9a-zA-Z]+[0-9a-zA-Z\.-]*\.[a-zA-Z]{2,4}$/;
		
		if($('.placePullDown > span').attr('data-key') != 'wifidog'){
			if(ipreg.test($('#router_ip').val()) || domainreg.test($('#router_ip').val()) ){
				flagByType = true;
			}else{
				flagByType = false;
				floatAlert(200, 50, "请输入正确的ip或域名", 2500)
				return ;
			}
		}else{
			//wifidao
			flagByType = true;
		}
	}
	
	
	
	
	if(flagByType){
		$
		.ajax({
			type : 'post',
			url : ctx + "/CloudSiteManage/addDevice",
			data : {
				nasid : $('#nasid').val() ? $('#nasid').val() : $('#nasidRos').val(),//这次真是烂到不行不行了~
				mac : macStandard ? macStandard : '',
				macAddress : $('#router_side').val() ? $('#router_side')
						.val() : $('#addressRos').val(),
				ip : $('#router_ip').val() ? $('#router_ip').val() : '',
				secretKey : $('#router_key').val() ? $('#router_key').val(): $('#secretRos').val(),
				maxUpSpeed : $('#router_up').val() ? $('#router_up').val()
						: $('#speed_up').val(),
				maxDownSpeed : $('#router_down').val() ? $('#router_down')
						.val() : $('#speed_down').val(),
				siteId : siteId,
				routerType : $('.placePullDown > span').attr('data-key')
			},
			success : function(data) {
				data = JSON.parse(data);
				if (data.code == 200) {
					$('.newly').animate({
						left : 2000
					}, 1000);
					$('.btns').animate({
						left : 2000
					}, 1000);
					$('#setInput').removeAttr('siteId');
					//重新加载设备列表
					getsitesList(1);
					setTimeout(function() {
						$('.mask').css('display', 'none');
					}, 500)
				} else {
					floatAlert(200, 50, data.msg, 2500)
					return;
				}
			}
		});
	}else{
//		floatAlert(200, 50, "请检查参数", 2500)
		return;
	}
}

/* ------------------上传文件------------------- */
function  upLoad(){
	var canvas=document.createElement('canvas');
    var ctx=canvas.getContext('2d');
	var choose=document.getElementById('choose');
	document.getElementById('upload').onclick=function(){
		choose.click();
	};
	choose.onchange=function(){
        ImageFileResize(this.files[0], 800, 800, function (dataUrl) {
            //console.log(dataUrl);
            $('.imgShow').css('background','url('+dataUrl+') no-repeat center');
            $('.imgShow').css('background-size','cover');
            $('.imgShow').attr('data-src',dataUrl);
        });   
	}
    function ImageFileResize(file, maxWidth, maxHeight, callback) {
        var Img = new Image;
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        Img.onload = function() {
            if (Img.width>maxWidth || Img.height>maxHeight) {
                var bili = Math.max(Img.width/maxWidth, Img.height/maxHeight);
                canvas.width = Img.width/bili;
                canvas.height = Img.height/bili;
            }else{
                canvas.width = Img.width;
                canvas.height = Img.height;
            }
            ctx.drawImage(Img, 0, 0, Img.width, Img.height, 0, 0, canvas.width, canvas.height);
            var imgDataUrl = canvas.toDataURL('image/jpeg');
            callback(imgDataUrl);
        };
        try{
            Img.src = window.URL.createObjectURL(file);
        }catch(err){
            try{
                Img.src = window.webkitURL.createObjectURL(file);
            }catch(err){
                alert(err.message);
            }
        }
    }
}

/**
 * 更新时显示的图片
 * @param srcArr
 * @param n
 */
function getImg(srcArr,n){
//	alert(n);
	var htmls = '';
	//$('.image').remover();
	for(var i=0;i<n;i++){
		htmls += '<div class="image">'+
					'<img class="picBase" src="'+srcArr[i]+'">'+
					'<p><span class="changeImg">修改</span>|<span class="delectImg">删除</span></p>'+
				'</div>';
	}
	if($('.image').length>0){
		$('.image').remove();
		$('#upload').before(htmls);
	}else{
		$('#upload').before(htmls);
	}
	$('.changeImg').unbind('click');
	$('.delectImg').unbind('click');
	$('.changeImg').click(function(){
		var n = $('.changeImg').index(this);
		var changeSrc = $('.image').eq(n).find('img').attr('src');
		//console.log(changeSrc);
		$('.imgShow').css('background','url('+src+') no-repeat center');
		$('.imgShow').css('background-size','cover');
		$('.imgShow').attr('data-src',src);
		//$('.showRight > img')
	});
	$('.delectImg').click(function(){
		var n = $('.delectImg').index(this);
		$('.image').eq(n).remove();
	});
}

//获取nasid方法
function getNasid(){
	//AJAX请求获取ansid
	$.ajax({
		type : 'post',
		url : ctx + "/CloudSiteManage/generateNasid",
		data : {
			
		},
		success : function(data) {
			data = JSON.parse(data);
			if (data.code == 200) {
//				$('.nasid').html('<input type="text" id="nasid" value="'+data.data+'" readonly="readonly">NASID');
				$('#nasid').val(data.data);
			} else {
				floatAlert(200, 50, data.msg, 2500)
				return;
			}
		}
	});
	
}
