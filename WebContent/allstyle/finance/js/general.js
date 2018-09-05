/* 左侧展开收起 */
$('.module').click(function(){
	shouzhan();
});
$('.incline').click(function(){
	shouzhan();
});
/* 左侧展开收起 */

/* 下拉列表方法 */
$('body').click(function(){
	$('.fn_select ul').css('display','none');
});

$('.fn_select > span').click(function(){
	$(this).next().toggle();
	return false;
});

$('.fn_select ul').click(function(){
	return false;
});

$('.fn_select ul > li').click(function(){
	var str = $(this).text();
	$(this).parent().prev().text(str);
	$(this).parent().css('display','none');
});
/* 下拉列表方法 */

/* 开关 */
$('.swicth').click(function(){
	var str = $(this).attr('class');
	if(str=='swicth d'){
			$(this).attr('class','swicth m');
		$(this).children().animate({left:'1px'},80);
	}else{
			$(this).attr('class','swicth d');
		$(this).children().animate({left:'23px'},80);
	}
});
/* 开关 */

/* 分页 */
	$('.page_pre').click(function(){//上一页
		var dang = $('.page_cont > i').eq(0).text();
		if(dang!=1){
			dang--;
		}
		firstDisp(dang);
		$('.page_cont > i').eq(0).text(dang);
		//执行获取当前页ajax
	});

	$('.page_next').click(function(){//下一页
		var dang = $('.page_cont > i').eq(0).text();
		if(dang!=$('.page_cont > i').eq(1).text()){
			dang++;
		}
		firstDisp(dang);
		$('.page_cont > i').eq(0).text(dang);
		//执行获取当前页ajax
	});

	$('.page_last').click(function(){//尾页按钮
		$('.page_cont > i').eq(0).text($('.page_cont > i').eq(1).text());
		firstDisp($('.page_cont > i').eq(0).text());
	});

	$('.page_first').click(function(){//首页按钮
		$('.page_cont > i').eq(0).text(1);
		firstDisp(1);
	});

	$('.skip').click(function(){//跳转到某页
		var n = parseInt($('.page_to').val());
		if(n==''||n<1||n>$('.page_cont > i').eq(1).text()){
			$('.page_to').val('');
			return;
		}
		$('.page_cont > i').eq(0).text(n);
		firstDisp(n);
		$('.page_to').val('');
	});

	$('.page_to').keypress(function(e){//跳转到某页回车事件
		if(e.keyCode==13){
			var n = parseInt($('.page_to').val());
			if(n==''||n<1||n>$('.page_cont > i').eq(1).text()){
				$('.page_to').val('');
				return;
			}
			$('.page_cont > i').eq(0).text(n);
			firstDisp(n);
			$('.page_to').val('');
		}
	});
/* 分页 */


//展开收起左侧菜单
function shouzhan(){
	var str = $('#leftNav').attr('class');
	if(str=='on'){
		$('#leftNav').removeClass('on');
		$('.inBtn').removeClass('on');
		$('.cTitle').addClass('on');
		$('.content').addClass('on');
		$('.incline').addClass('on');
	}else{
		$('#leftNav').addClass('on');
		$('.inBtn').addClass('on');
		$('.cTitle').removeClass('on');
		$('.content').removeClass('on');
		$('.incline').removeClass('on');
	}
}

function firstDisp(n){//检测是否显示首/尾页按钮
	if(n==1){
		$('.page_first').css('display','none');
	}else{
		$('.page_first').css('display','inline-block');
	}
	if(n==$('.page_cont i').eq(1).text()){
		$('.page_last').css('display','none');
	}else{
		$('.page_last').css('display','inline-block');
	}
}