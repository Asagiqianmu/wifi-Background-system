
$(function(){
	var dang=0;//初始化下一页参数
	var	typeDang=0;//出事化指示条参数
	var moveW=$('.move').width();
	
	$('.college').click(function(){
		collDisp();
	});
	$('.pullD>li').click(function(){
		var n=$('.pullD>li').index(this);
		var str=$('.pullD>li').eq(n).html();
		$('.college').html(str+'<i class="icon icon-down"></i>');
		$('.college').attr('title',str);
		$(".pullD").hide();
	});
	$('.ui-nav>ul>li').click(function(){
		var obj=$('.ui-nav>ul>li');
		var n=obj.index(this);
		listDispOn(obj,n);
	});
	zong();
	
	numdisp(dang);
	$('.goLeft').click(function(){
		dang--;
		if(dang<0){
			dang=0;
			numdisp(dang);
		}else{
			$('.num').removeClass('on').eq(dang).addClass('on');
			numdisp(dang);
		}
	});
	$('.goRight').click(function(){
		dang++;
		if(dang>$('.num').length-1){
			dang=$('.num').length-1;
			numdisp(dang);
		}else{
			$('.num').removeClass('on').eq(dang).addClass('on');
			numdisp(dang);
		}
	});
	$('.num').click(function(){
		dang=$('.num').index(this);
		$('.num').removeClass('on').eq(dang).addClass('on');
		numdisp(dang);
	});
	$('.timeType').click(function(){
		typeDang=$('.timeType').index(this);
		$('.timeType').removeClass('on').eq(typeDang).addClass('on');
		$('.move').animate({left:moveW*typeDang+'px'});
	});
	$('.yesOrNo').click(function(){
		var lang=$('.yesOrNo').length
		var n=$('.yesOrNo').index(this);
		var str=$('.yesOrNo').eq(n).attr('class');
		if(n==lang-2){
			on_off(str,n);
			charge_on_off(str);
		}else if(n==lang-1){
			on_off(str,n);
			fuse_on_off(str);
		}else{
			on_off(str,n);
		}
	})
	$('.group').click(function(){
		if($('.group>ul').css('display')=='none'){
			$('.group>ul').css('display','block');
		}else{
			$('.group>ul').css('display','none');
		}
	});
	$('.group>ul>li').click(function(){
		$('.group>ul').css('display','none');
		var n=$('.group>ul>li').index(this);
		var str=$('.group>ul>li').eq(n).html();
		$('.group>span').html(str);
		return false;
	});
	$('.payMold>span').click(function(){
		if($('.payList').css('display')=="none"){
			$('.payList').css('display','block');
		}else{
			$('.payList').css('display','none');
		}
	});
	$('.payList>li').click(function(){
		var n=$('.payList>li').index(this);
		var str=$('.payList>li').eq(n).html();
		$('.payMold>span').html(str);
		$('.payList').css('display','none');
		return false;
	});
	$('.bloc').click(function(){
		if($('.blocList').css('display')=="none"){
			$('.blocList').css('display','block');
		}else{
			$('.blocList').css('display','none');
		}
	});
	$('.blocList>li').click(function(){
		var n=$('.blocList>li').index(this);
		var str=$('.blocList>li').eq(n).html();
		$('.bloc>span').html(str);
		$('.blocList').css('display','none');
		return false;
	});
	$('.fessType>ul>.newAdd').click(function(){
		$('.mask').css('display','block');
		$('.newly').animate({left:'20%'},1000);
	})
	$('.btns>button').click(function(){
		var n=$('.btns>button').index(this);
		maskDisp(n%2);
	});
	$('.btn').click(function(){
		$('.floa').css('display','none');
		$('.addfloa').css('display','none');
	})
	$('.whether>button').click(function(){
		var n=$('.whether>button').index(this);
		whetherDisp(n)
	})
	$('.new>h2>i').click(function(){
		maskDisp(1)
	})
	$('.siteList>ul>li').click(function(){
		var obj=$('.siteList>ul>li');
		var n=obj.index(this);
		listDispOn(obj,n);
	})
	$('.plistContant>li>i').click(function(){
		var n=$('.plistContant>li>i').index(this);
		var obj=$('.floa');
		floaBlock(obj,n);
	})
	$('.add-floa').click(function(){
		var n=$('.add-floa').index(this);
		var obj=$('.addfloa');
		floaBlock(obj,n);
	})
	// 用户信息下拉菜单
	$('.admin').click(function(){
		var str=$('.menu').css('display');
		//alert(str)
		if(str=='none'){
			$('.menu').css('display','block');
		}else{
			$('.menu').css('display','none');
		}
	});
	// 退出按钮
	$('.menu > li.exit').click(function(){
		window.location.href=ctx+"/logOut";
	});
	$('.menu > li.personageCenter').click(function(){
		window.location.href=ctx+"/personalCenter/toPersonalCenter";
	});
	
})
var loader=function(){
	$('.barcontainer').css('display','block');
}
var floaBlock=function(obj,n){
	obj.css('display','none').eq(n).css('display','block');
}

var listDispOn=function(obj,n){
	obj.removeClass('on').eq(n).addClass('on');
}
var collDisp=function(){
	$(".pullD").toggle();
}
var numdisp=function(n){
	
	if(n==0){
		$('.num').css('display','none');
		$('.num').eq(0).css('display','block');
		$('.num').eq(1).css('display','block');
		$('.num').eq(2).css('display','block');
		$('.num').eq(3).css('display','block');
	}else if(n==$('.num').length-1){
		$('.num').css('display','none');
		$('.num').eq(n-3).css('display','block');
		$('.num').eq(n-2).css('display','block');
		$('.num').eq(n-1).css('display','block');
		$('.num').eq(n).css('display','block');
	}else if(n==$('.num').length-2){
		$('.num').css('display','none');
		$('.num').eq(n-1).css('display','block');
		$('.num').eq(n).css('display','block');
		$('.num').eq(n+1).css('display','block');
		$('.num').eq(n-2).css('display','block');
	}else{
		$('.num').css('display','none');
		$('.num').eq(n-1).css('display','block');
		$('.num').eq(n).css('display','block');
		$('.num').eq(n+1).css('display','block');
		$('.num').eq(n+2).css('display','block');
	}
}
var zong=function(){
	
	var n=$('.num').length;
	
	$('.zong').html('共'+n+'页');
}
var win=function(){
	$('.win').css('display','block').fadeOut(5000);
}
var maskDisp=function(n){
	if(n==0){
		$('.newly').animate({left:2000},1000);
		win();

		setTimeout(function(){
			$('.mask').css('display','none');
		},500)
	}else{
		$('.whether').css('display','block');
	}
}
var whetherDisp=function(n){
	if(n==0){
		$('.whether').css('display','none');
		$('.newly').animate({left:2000},1000);
		//win();

		setTimeout(function(){
			$('.mask').css('display','none');
		},500)
	}else{
		$('.whether').css('display','none');
	}
}
var fuse_on_off=function(str){
	if(str=="yesOrNo"){
		$('.fuse>.yesOrNo').addClass('on');
			
		$('.operator').css('display','none');
	}else{
		$('.fuse>.yesOrNo').removeClass('on');
			
		$('.operator').css('display','block');
	}
}
var charge_on_off=function(str){
	if(str=="yesOrNo"){
		//$('.charge>.yesOrNo').addClass('on');
		$('.import').css('display','none');
		$('.fuse').css('display','none');
	}else{
		//$('.charge>.yesOrNo').removeClass('on');
		$('.import').css('display','block');
		$('.fuse').css('display','block');
	}
}
var on_off=function(str,n){
	if(str=="yesOrNo"){
		$('.yesOrNo').eq(n).addClass('on');
	}else{
		$('.yesOrNo').eq(n).removeClass('on');
	}
	
}