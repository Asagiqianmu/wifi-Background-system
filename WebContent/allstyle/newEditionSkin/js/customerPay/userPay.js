;$(function(){
	var dang=0;//初始化下一页参数
	var	typeDang=0;//出事化指示条参数
	var moveW=$('.move').width();
	//loader();
	$('.pullDs>li').click(function(){
		document.getElementById('tiShi').innerHTML = "";
		var n=$('.pullDs>li').index(this);
		var str=$('.pullDs>li').eq(n).html()+'<i class="icon icon-down"></i>';
		$('#userPay').html(str);
		$(".pullDs").hide();
		total();
	});
	$('#userPay').click(function(){
		collDisps();
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
	$('.whether>button').click(function(){
		var n=$('.whether>button').index(this);
		whetherDisp(n)
	})
	$('.new>h2>i').click(function(){
		$("em>label.error").html("");
		maskDisp(1);
	});
	$('.group').click(function(){
		if($('.group>ul').css('display')=='none'){
			$('.group>ul').css('display','block');
		}else{
			$('.group>ul').css('display','none');
		}
	});
	
	$('.fn-sex>li').click(function(){
		var n=$('.fn-sex>li').index(this);
		$('.fn-sex>li').removeClass('on').eq(n).addClass('on');
	});
});

var floaBlock=function(obj,n){
	obj.css('display','none').eq(n).css('display','block');
}

var loader=function(){
	$('.barcontainer').css('display','block');
}

function collDisps(){
	$(".pullDs").toggle();
	return false;
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
	$('.win').css('display','block').fadeOut(1500);
}
var maskDisp=function(n){
	if(n==0){
		$('.newly').animate({left:2000},1000);
		$('.btns').animate({left:2000},1000);
		win();

		setTimeout(function(){
			$('.mask').css('display','none');
		},500)
	}else{
		$('.whether').css('display','block');
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

var total=function(){
	if($('.college').html()=='查看全部'){
		$('.site>li>em').css('display','inline');
	}else{
		$('.site>li>em').css('display','none');
	}
}
 
;$(function(){
	var dang=0;//初始化下一页参数
	var	typeDang=0;//出事化指示条参数
	var moveW=$('.move').width();
	$('.college').click(function(){
		collDisp();
	});
	$('.pullD>li').click(function(){
		var n=$('.pullD>li').index(this);
		var str=$('.pullD>li').eq(n).html()+'<i class="icon icon-down"></i>';
		var siteId = $('.pullD>li').eq(n).attr("value");
		$('.college').attr("sites",siteId);
		$('.college').html(str);
		$(".pullD").hide();
		total();
		 
		
	});
	$('.ui-nav>ul>li').click(function(){
		var obj=$('.ui-nav>ul>li');
		var n=obj.index(this);
		listDispOn(obj,n);
	})
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
	$('.whether>button').click(function(){
		var n=$('.whether>button').index(this);
		whetherDisp(n)
	})
	$('.new>h2>i').click(function(){
		maskDisp(1)
	});
	$('.recharge').click(function(){
		$('.premises').css('display','block');
		$('.addUser').css('display','none');
		$('.mask').css('display','block');
		$('.newly').animate({left:'20%'},1000);
		$('.btns').animate({left:'20%'},1000);
	});
	
	$('.fn-sex>li').click(function(){
		var n=$('.fn-sex>li').index(this);
		$('.fn-sex>li').removeClass('on').eq(n).addClass('on');
	});
	$('.fn-addUser').click(function(){
		$("#uname").val("");
		$("#pwd").val("");
		if($.trim($(".college").text())=="请选择场所"){
			$(".win>span").html("请先选择场所");
			win();
			return false;
		}
		$('.premises').css('display','none');
		$('.addUser').css('display','block');
		$('.mask').css('display','block');
		$('.newly').animate({left:'20%'},1000);
		$('.btns').animate({left:'20%'},1000);
	})
	$('html').contextmenu(function(){
		return false;
	});
})
var listDispOn=function(obj,n){
	obj.removeClass('on').eq(n).addClass('on');
}
var collDisp=function(){
	$(".pullD").toggle();
}

var whetherDisp=function(n){
	if(n==0){
		$('.whether').css('display','none');
		$('.newly').animate({left:2000},1000);
		$('.btns').animate({left:2000},1000);
		//win();

		setTimeout(function(){
			$('.mask').css('display','none');
		},500)
	}else{
		$('.whether').css('display','none');
	}
}

var on_off=function(str,n){
	if(str=="yesOrNo"){
		$('.yesOrNo').eq(n).addClass('on');
	}else{
		$('.yesOrNo').eq(n).removeClass('on');
	}
}
