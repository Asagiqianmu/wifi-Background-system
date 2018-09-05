;$(function(){
	var submitFlag=false;
	var dang=0;//初始化下一页参数
	var	typeDang=0;//出事化指示条参数
	var moveW=$('.move').width();
	var addStr='<input type="text" value="" placeholder="如:138211">';
	$('.college').click(function(){
		collDisp();
	});
	zong();
//	$('.whether>button').click(function(){
//		var n=$('.whether>button').index(this);
//		whetherDisp(n);
//	});
	$('.new>h2>i').click(function(){
		maskDisp(1);
	});
	
	
	$('.siteList>ul>li').click(function(){
		var obj=$('.siteList>ul>li');
		var n=obj.index(this);
		listDispOn(obj,n);
	});
//	$('.state>li').click(function(){
//		alert(1);
//		var n=$('.state>li').index(this);
//		$('.state>li').removeClass('on').eq(n).addClass('on');
//		$('.stateList').css('display','none').eq(n).css('display','block');
//	});
//	$('.stateList > div > em.edit').click(function(){
//		$('.mask').css('display','block');
//		$('.new').css('display','none');
//		$('.amend').css('display','block');
//		$('.newly').animate({left:'20%'},1000);
//	});
});
var loader=function(){
	$('.barcontainer').css('display','block');
};
var floaBlock=function(obj,n){
	obj.css('display','none').eq(n).css('display','block');
};

var listDispOn=function(obj,n){
	obj.removeClass('on').eq(n).addClass('on');
};
var collDisp=function(){
	$(".pullD").toggle();
};

var zong=function(){
	
	var n=$('.num').length;
	
	$('.zong').html('共'+n+'页');
};
var whetherDisp=function(n){
	if(n==0){//点---是
		$('.whether').css('display','none');
		$('.newly').animate({left:2000},1000);
		//win();
		setTimeout(function(){
			$('.mask').css('display','none');
		},500);
		
		$(".charging input").each(function(){
			
			$(this).val("");
		});
		$(".new #price_type").val("0");
		$("#charge_type").val("1");
		$(".groupList").html("中国电信");
		$(".payMold>span").html("时");
		$(".amend .zifeiSm textarea").val("");
		$(".appNum").val("");
		$(".comboNumList>.newAppNum").remove();
		$('.fuseAdd>.yesOrNo').eq(0).addClass('on');
		$(".PackageDetails").css("display","none");
	}else{// 点--否
		$('.whether').css('display','none');
		
	}
};
var maskDisp=function(n){
	if(n==0){
		$('.newly').animate({left:2000},1000);
		win();
		setTimeout(function(){
			$('.mask').css('display','none');
		},500);
		//$(".error").html("");
	}else{
		$('.whether').css('display','block');
	}
};