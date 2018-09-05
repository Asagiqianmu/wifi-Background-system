/* 左侧展开收起 */
$('.module').click(function() {
	shouzhan();
});
$('.incline').click(function() {
	shouzhan();
});

/* 左侧展开收起 */
goToPage();

/* 下拉列表方法 */
$('body').click(function() {
	$('.fn_select ul').css('display', 'none');
});

// $('.fn_select > span').click(function(){
// $(this).next().toggle();
// return false;
// });
//
// $('.fn_select ul').click(function(){
// return false;
// });

/*
 * $('.fn_select ul > li').click(function(){ var str = $(this).text();
 * $(this).parent().prev().text(str); $(this).parent().css('display','none');
 * }); 下拉列表方法
 * 
 * 开关 $('.swicth').click(function(){ var str = $(this).attr('class');
 * if(str=='swicth d'){ $(this).attr('class','swicth m');
 * $(this).children().animate({left:'1px'},80); }else{
 * $(this).attr('class','swicth d');
 * $(this).children().animate({left:'23px'},80); } });
 */
/* 开关 */

function click(e) {

	if (document.all) {
		if (event.button == 2 || event.button == 3) {
			oncontextmenu = 'return false';
		}
	}
	if (document.layers) {
		if (e.which == 3) {
			oncontextmenu = 'return false';
		}
	}
}
if (document.layers) {
	document.captureEvents(Event.MOUSEDOWN);
}
document.onmousedown = click;
document.oncontextmenu = new Function("return false;")
document.onkeydown = document.onkeyup = document.onkeypress = function() {
	if (window.event.keyCode == 123) {
		window.event.returnValue = false;
		return (false);
	}
}

/**
 * 跳转到对应的页面 通用的方法
 */
function goToPage() {
	$(".linkList>li").click(function() {
		var n = $(".linkList>li").index(this);
		var name = $(".linkList>li").eq(n).children(":first").text();
		if (name == "运营概览") {
			window.location.href = ctx + "/allSiteOfReportStatistics/index";
		} else if (name == "场所管理") {
			window.location.href = ctx + "/CloudSiteManage/index";
		} else if (name == "计费管理") {
			window.location.href = ctx + "/SitePriceBilling/toSiteBilling";
		} else if (name == "用户管理") {
			window.location.href = ctx + "/siteCustomer/toSiteCustomerList";
		} else if (name == "资金管理") {
			window.location.href = ctx + "/withDraw/toWithDrawIndex";
		}else if(name == "数据中心"){
			window.location.href = ctx + "/allSiteOfReportStatistics/toUserOnlineData";
		} else {
			window.location.href = ctx + "/personalCenter/toPersonalCenter";
		}
	});
}

/*
 * 分页 // $('.page_pre').click(function(){//上一页 // var dang = $('.page_cont >
 * i').eq(0).text(); // if(dang!=1){ // dang--; // } // firstDisp(dang); //
 * $('.page_cont > i').eq(0).text(dang); // //执行获取当前页ajax // }); // //
 * $('.page_next').click(function(){//下一页 // var dang = $('.page_cont >
 * i').eq(0).text(); // if(dang!=$('.page_cont > i').eq(1).text()){ // dang++; // } //
 * firstDisp(dang); // $('.page_cont > i').eq(0).text(dang); // //执行获取当前页ajax //
 * }); // // $('.page_last').click(function(){//尾页按钮 // $('.page_cont >
 * i').eq(0).text($('.page_cont > i').eq(1).text()); // firstDisp($('.page_cont >
 * i').eq(0).text()); // }); // // $('.page_first').click(function(){//首页按钮 //
 * $('.page_cont > i').eq(0).text(1); // firstDisp(1); // }); // //
 * $('.skip').click(function(){//跳转到某页 // var n = parseInt($('.page_to').val()); //
 * if(n==''||n<1||n>$('.page_cont > i').eq(1).text()){ //
 * $('.page_to').val(''); // return; // } // $('.page_cont > i').eq(0).text(n); //
 * firstDisp(n); // $('.page_to').val(''); // }); // //
 * $('.page_to').keypress(function(e){//跳转到某页回车事件 // if(e.keyCode==13){ // var n =
 * parseInt($('.page_to').val()); // if(n==''||n<1||n>$('.page_cont >
 * i').eq(1).text()){ // $('.page_to').val(''); // return; // } // $('.page_cont >
 * i').eq(0).text(n); // firstDisp(n); // $('.page_to').val(''); // } // }); 分页
 */

// 展开收起左侧菜单
function shouzhan() {
	var str = $('#leftNav').attr('class');
	if (str == 'on') {
		$('#leftNav').removeClass('on');
		$('.inBtn').removeClass('on');
		$('.cTitle').addClass('on');
		$('.content').addClass('on');
		$('.incline').addClass('on');
	} else {
		$('#leftNav').addClass('on');
		$('.inBtn').addClass('on');
		$('.cTitle').removeClass('on');
		$('.content').removeClass('on');
		$('.incline').removeClass('on');
	}
}

function firstDisp(n) {// 检测是否显示首/尾页按钮
	if (n == 1) {
		$('.page_first').css('display', 'none');
	} else {
		$('.page_first').css('display', 'inline-block');
	}
	if (n == $('.page_cont i').eq(1).text()) {
		$('.page_last').css('display', 'none');
	} else {
		$('.page_last').css('display', 'inline-block');
	}
}

/* 修改截取小数后两位原型方法 */
Number.prototype.toFixed2 = function() {
	return parseFloat(this.toString().replace(/(\.\d{2})\d+$/, "$1"));
}
/* 修改截取小数后两位原型方法 */

function msg(str, torf) {
	var $msgObj = document.createElement('p');
	$msgObj.setAttribute("id", "msgp")
	var $img = document.createElement('img');
	if (torf) {
		$img.src = ctx + '/allstyle/newstyle/img/s.png';
		$msgObj.style.color = '#56c6d4';
		$msgObj.style.boxShadow = '0 0 10px #56c6d4';
		$msgObj.style.border = '1px solid #56c6d4';

	} else {
		$img.src = ctx + '/allstyle/newstyle/img/e.png';
		$msgObj.style.color = '#fe7f6e';
		$msgObj.style.boxShadow = '0 0 10px #fe7f6e';
		$msgObj.style.border = '1px solid #fe7f6e';
	}
	$img.style.marginRight = '15px';
	$msgObj.appendChild($img);
	$msgObj.innerHTML += str;
	$msgObj.style.minWidth = '200px';
	$msgObj.style.padding = '15px 15px';
	$msgObj.style.background = '#fff';
	$msgObj.style.textAlign = 'center';
	$msgObj.style.fontSize = '16px';
	$msgObj.style.position = 'fixed';
	$msgObj.style.zIndex = '99999';
	$msgObj.style.left = '50%';
	$msgObj.style.top = '50%';
	$msgObj.style.borderRadius = '5px';
	$('body').append($msgObj);

	var w = $msgObj.offsetWidth;
	var h = $msgObj.offsetHeight;
	$msgObj.style.marginLeft = -w / 2 + 'px';
	$msgObj.style.marginTop = -h / 2 + 'px';
	setTimeout(function() {
		$("#msgp").remove();
	}, 2500);
}