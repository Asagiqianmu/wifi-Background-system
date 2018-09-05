var dang=0;
var wdang = 0;
window.onload=function(){
	
	selRealNameUserNum();
	getPassListPage();
	getWeiListPage();
	/*
	 * 分页左右
	 
	$('.pass .goLeft').click(function(){
		dang--;
		if(dang<0){
			dang=0;
			numdisp(dang);
		}else{
			$('.num').removeClass('on').eq(dang).addClass('on');
			numdisp(dang);
			//selAccountLog(dang+1);
		}
	});
	$('.pass .goRight').click(function(){
		dang++;
		if(dang>$('.num').length-1){
			dang=$('.num').length-1;
			numdisp(dang);
		}else{
			$('.num').removeClass('on').eq(dang).addClass('on');
			numdisp(dang);
			//selAccountLog(dang+1);
		}
	});
	
	$('.wei .goLeft').click(function(){
		wdang--;
		if(dang<0){
			wdang=0;
			numdisp(dang);
		}else{
			$('.num').removeClass('on').eq(dang).addClass('on');
			numdisp(dang);
			//selAccountLog(dang+1);
		}
	});
	$('.wei .goRight').click(function(){
		wdang++;
		if(dang>$('.num').length-1){
			wdang=$('.num').length-1;
			numdisp(dang);
		}else{
			$('.num').removeClass('on').eq(dang).addClass('on');
			numdisp(dang);
			//selAccountLog(dang+1);
		}
	});
	* */
	/**
	*选项卡切换功能--fan
	*/
	$('.label>li').click(function(){
		var obj=$('.label>li');
		var n=obj.index(this);
		on(obj,n);
		$('#binding input').val("");
		$('.ui-content').css('display','none').eq(n).css('display','block');
		$('#binding span').text("");
		if(n==2){
			//获取已认证list
			getPassList();
			//获取已认证总页数
			getPassListPage();
		}else if(n==3){
			//获取未认证list
			getNoPassList();
			//获取未认证总页数
			getWeiListPage();
		}
	});
	/**
	*个人中心和退出入口--fan
	*/
	$('.menu > li.exit').click(function(){
		window.location.href=ctx+"/logOut";
	});
	$('.menu > li.personageCenter').click(function(){
		window.location.href=ctx+"/personalCenter/toPersonalCenter";
	});

	/**
	*身份证旋转按钮操作--fan
	*逆时针旋转（每次90deg）--fan
	*/
	$('.identityCard .anticlockwise').click(function(){
		var obj=$('.identityCard .image');
		rotate(0,obj);
	});
	/**
	*身份证旋转按钮操作--fan
	*顺时针旋转（每次90deg）--fan
	*/
	$('.identityCard .clockwise').click(function(){
		var obj=$('.identityCard .image');
		rotate(1,obj);
	});
	/**
	*用户头像旋转按钮操作--fan
	*逆时针旋转（每次90deg）--fan
	*/
	$('.userPhoto .anticlockwise').click(function(){
		var obj=$('.userPhoto .image');
		rotate(0,obj);
	});
	/**
	*用户头像旋转按钮操作--fan
	*顺时针旋转（每次90deg）--fan
	*/
	$('.userPhoto .clockwise').click(function(){
		var obj=$('.userPhoto .image');
		rotate(1,obj);
	});
	/**
	* 放大图旋转功能
	*/
	$('.rotaten').click(function(){
		var obj=$('.bigImg > p');
		rotatesn(1,obj);
		return false;
	});
	$('.rotates').click(function(){
		var obj=$('.bigImg > p');
		rotatesn(0,obj);
		return false;
	});
	/**
	*通过审核按钮--fan
	*/
	$('.pass').click(function(){
		$('.operation>button').attr('disabled','disabled');
		var num=parseInt($('#pepNum').text());
		if(num>0){
			checkSuccess();
		}
	});
	/**
	*拒绝通过按钮--fan
	*/
	$('.fail').click(function(){
		$('.operation>button').attr('disabled','disabled');
		var num=parseInt($('#pepNum').text());
		if(num>0){
			checkFail();
		}
	});
	/**
	*手动绑定提交按钮--fan
	*/
	$('#bindingSub').click(function(){
		$('#binding').submit();
	});
	
	$('.image').click(function(){
		var n=$('.image').index(this);
		var srcT=$('.image').eq(n).css('background-image');
		$('.mask').css('display','block');
		$('.bigImg > p').css('background-image',srcT);
	});
	$('.mask').click(function(){
		$('.mask').css('display','none');
		$('.bigImg > p').attr('class','rotate0')
	});
};

/**
*针对实名认证额面的旋转功能模块--fan
*n==0/1（0代表逆时针，1代表顺时针）--fan
*obj==要旋转的元素--fan
*/
function rotate(n,obj){
	var str=obj.attr('class');
	if(n==0){
		if(str=='image rotate0'){
			obj.attr('class','image rotate270');
		}else if(str=='image rotate270'){
			obj.attr('class','image rotate180');
		}else if(str=='image rotate180'){
			obj.attr('class','image rotate90');
		}else if(str=='image rotate90'){
			obj.attr('class','image rotate0');
		};
	}else{
		if(str=='image rotate0'){
			obj.attr('class','image rotate90');
		}else if(str=='image rotate270'){
			obj.attr('class','image rotate0');
		}else if(str=='image rotate180'){
			obj.attr('class','image rotate270');
		}else if(str=='image rotate90'){
			obj.attr('class','image rotate180');
		};
	};
};

/**
*
*/
function rotatesn(n,obj){
	var str=obj.attr('class');
	if(n==0){
		if(str=='rotate0'){
			obj.attr('class','rotate270');
		}else if(str=='rotate270'){
			obj.attr('class','rotate180');
		}else if(str=='rotate180'){
			obj.attr('class','rotate90');
		}else if(str=='rotate90'){
			obj.attr('class','rotate0');
		};
	}else{
		if(str=='rotate0'){
			obj.attr('class','rotate90');
		}else if(str=='rotate270'){
			obj.attr('class','rotate0');
		}else if(str=='rotate180'){
			obj.attr('class','rotate270');
		}else if(str=='rotate90'){
			obj.attr('class','rotate180');
		};
	};
}

/**
*初始化通过图片 和-1--fan
*/
function initPic(){
	$('.operation>button').removeAttr('disabled','disabled');
	$('.details>img').css('width','200px');
	$('.details>img').css('display','none');
	$('.surplus > em').css('top','0px');
};
/**
*自用方法---用来区分当前的焦点元素--fan
*/
var on=function(obj,n){//
	obj.removeClass('on').eq(n).addClass('on');
};
// 显示提示信息--fan
var win=function(str,num){
	$('.win > span').text(str);
	var disappearTime=parseInt(str.length/3)*500+1000;
	$('.win').css('display','block').fadeOut(num==null?disappearTime:num);
};
/**
*获取剩余审核人数--fan
*获取待审核人信息和图片--fan
*/
function selRealNameUserNum(){
	$.ajax({
		url: ctx+"/personalRealName/selRealNameUserNum",
		type: "post",
		success: function(data){
			if(data=="loseSession"){
				 window.location.href=ctx+"/toLogin";
				 return;
			}	
			eval('data='+data);
			if(data.code==200){
				if(data.data.length==0){
					
						$('#pepNum').text(0);
						$('.phone>span').text("");
						$('.name>span').text("");
						$('.userId>span').text("");
						$('.identityCard>.image').css('background-image','url('+imgPath+'/poto.png)');
						$('.userPhoto>.image').css('background-image','url('+imgPath+'/poto.png)');
						$('.userinfo').removeAttr('data');
						initPic();
					win("暂无需要实名认证的用户!");
				}else{
					$('#pepNum').text(data.totoalNum);
					$('.phone>span').text(data.data[0].telephone);
					$('.name>span').text(data.data[0].userName);
					$('.userId>span').text(data.data[0].idCard);
					$('.identityCard>.image').css('background-image','url('+upLoadPath+data.data[0].cardImg+')');
					$('.userPhoto>.image').css('background-image','url('+upLoadPath+data.data[0].userImg+')');
					$('.userinfo').attr('data',data.data[0].id);
					initPic();
				}
			}else if(data.code==201){
				win(data.msg);
				$('.operation>button').attr('disabled');
			};
		}
	});
}
/**
* 拒绝通过按钮 Ajax--fan
*/
function checkFail(){
	var telephone=$('.phone>span').text(),
		realNameId=$('.userinfo').attr('data');
	$.ajax({
		url: ctx+"/personalRealName/checkFail",
		type: "post",
		data: {
			telepone : telephone,
			realNameId : realNameId
		},
		success: function(data){
			if(data=="loseSession"){
				 window.location.href=ctx+"/toLogin";
				 return;
			}	
			eval('data='+data);
			if(data.code==200){
				$('.details>img.refuse').css('display','block');//
				$('.details>img.refuse').animate({width:'120px'},200);
				$('.surplus > em').css('display','block');
				$('.surplus > em').animate({top:'-40px'},250,function(){
					$('.surplus > em').fadeOut(50);
				});
				setTimeout(function(){
					selRealNameUserNum();
				},450);
			}else{
				win(data.msg);
			}
		}
	});
}
/**
* 通过审核 ajax--fan
*/
function checkSuccess(){
	var telephone=$('.phone>span').text(),
		realNameId=$('.userinfo').attr('data');
	$.ajax({
		url: ctx+"/personalRealName/checkSuccess",
		type: "post",
		data: {
			telephone : telephone,
			realNameId : realNameId
		},
		success: function(data){
			if(data=="loseSession"){
				 window.location.href=ctx+"/toLogin";
				 return;
			}	
			eval('data='+data);
			if(data.code==200){
				var num=parseInt($('#pepNum').text());
				if(num>0){
					$('.details>img.pas').css('display','block');//
					$('.details>img.pas').animate({width:'120px'},200);
					$('.surplus > em').css('display','block');
					$('.surplus > em').animate({top:'-40px'},250,function(){
						$('.surplus > em').fadeOut(50);
					});
				};
				setTimeout(function(){
					selRealNameUserNum();
				},450);
			}else{
				win(data.msg);
			}
		}
	});
}
/**
* 手动绑定表单提交ajax--fan
*/
var realNameAuth=function(){
	$.ajax({
		url: ctx+"/personalRealName/realNameAuth",
		type: "post",
		data: {
			telephone : $('#userNum').val(),
			userName : $('#userName').val(),
			idCard : $('#userId').val(),
			positation : $('#userLocat').val()
		},
		success: function(data){
			if(data=="loseSession"){
				 window.location.href=ctx+"/toLogin";
				 return;
			}	
			eval('data='+data);
			if(data.code==200){
				$('#binding input').val('');
				win(data.msg);
			}else if(data.code==201){
				win(data.msg);
			}else if(data.code==202){
				win(data.msg);
			}
		},
		error: function(){

		}
	});
};

/**
*手机号  正则--fan
*/
var addressRule = /^(((13[0-9]{1})|(14[4-7]{1})|(15[0-9]{1})|(170)|(17[1-8]{1})|(18[0-9]{1}))+\d{8})$/;
/**
* 身份证   正则--fan
*/
var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;

// 自定义手机号validate--fan
jQuery.validator.addMethod("phoneNum", function(value, element) { 
    return this.optional(element) || addressRule.test(value);
}, "请输入正确的手机号");
//自定义身份证 validate--fan
jQuery.validator.addMethod("userIdNum", function(value, element) { 
    return this.optional(element) || reg.test(value);
}, "请输入正确身份证号");
// validate 手动认证校验--fan
var binding =$("#binding").validate({
	
	errorPlacement : function(error, element) {
		
		//$(".error").html("");
			error.css({
			}).appendTo(element.next().addClass("error"));
		},
	submitHandler : function(form) {
		realNameAuth();
	},
	rules : {
		userNum: {
			required:true,
			maxlength:11,
			phoneNum: true,
			remote:{
				url: ctx+"/personalRealName/validateName",     //后台处理程序
			    type: "post", 
			    data: {                     //要传递的数据
			    	telephone: function() {
			            return $("#userNum").val();
			        }
			    }
			}
		},
		userName: {
			required:true
		},
		userId: {
			required:true,
			maxlength:18,
			userIdNum:true,
			remote:{
				url: ctx+"/personalRealName/isHaveIdCard",     //后台处理程序
			    type: "post",               //数据发送方式
			    data: {                     //要传递的数据
			    	idCard: function() {
			            return $('#userId').val();
			        }
			    }
			} 
		},
		userLocat: {
			required:true
		}
	},
	messages : {
		userNum: {
			required:'请输入要认证的手机号',
			maxlength:'手机号不能大于11个字符',
			phoneNum: '请输入正确的手机号',
			remote: '手机号已认证或未注册'
		},
		userName: {
			required:'请输入真实姓名'
		},
		userId: {
			required:'请输入身份证号',
			minlength:'身份证号不能大于18位',
			userIdNum: '请输入正确身份证号',
			remote:'身份证号已绑定'
		},
		userLocat: {
			required:'请输入宿舍位置'
		}
	}
});
$("#userNum").keypress(function(){
	$("#userNum").removeData("previousValue");
	}); 


/**
* 获取已认证列表
* TODO
*/
function getPassList(n){
	
	//这里需要获取当前页
	var curPage = n?n:1;
	var pageSize = 10;
	$.ajax({
		type: 'post',
		url: ctx+"/personalRealName/getRealList",
		data: {
			curPage : curPage,
			pageSize : pageSize
		},
		success: function(data){
			if(data=="loseSession"){
				 window.location.href=ctx+"/toLogin";
				 return;
			}	
			data = JSON.parse(data);
			if(data.code==200){
				var htmls = '';
				for(var i=0;i<data.data.length;i++){
					//[{id=1, site_id=62, user_name=哈哈哈, telephone=18888888888, id_card=211411199806020907, address=四号床铺}
					htmls += '<li><span>'+data.data[i].user_name+'</span><span>'+data.data[i].id_card+'</span><span>'+data.data[i].telephone+'</span><span>'+data.data[i].address+'</span></li>';
				}
				$('.rzList').html(htmls);
			}
		}
	});
}

/**
* 获取未认证列表
*/
function getNoPassList(n){
	//这里需要获取当前页
	console.log(n);
	var curPage = n?n:1;
	var pageSize = 10;
	$.ajax({
		type: 'post',
		url: ctx+"/personalRealName/getNoRealList",
		data: {
			curPage : curPage,
			pageSize : pageSize
		},
		success: function(data){
			if(data=="loseSession"){
				 window.location.href=ctx+"/toLogin";
				 return;
			}	
			data = JSON.parse(data);
			if(data.code==200){
				var htmls = '';
				for(var i=0;i<data.data.length;i++){
					htmls += '<li><span>'+data.data[i].user_name+'</span><span>'+data.data[i].id_card+'</span><span>'+data.data[i].telephone+'</span><span>'+data.data[i].address+'</span></li>';
				}
				$('.wrzList').html(htmls);
			}
		}
	});
}



/**
 * 分页
 */
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
};

/*
 * 总页数
 * */
var zong=function(){
	
	var n=$('.num').length;
	
	$('.zong').html('共'+n+'页');
};


//已认证列表总页数
var getPassListPage=function(){
	$.ajax({
		url: ctx+"/personalRealName/getRealListNum",
		type: "post",
		success: function(data){
			if(data=="loseSession"){
				 window.location.href=ctx+"/toLogin";
				 return;
			}	
			eval("data="+data);
			if(data.code==200){
				$('.passr .num').remove();
				var htmls='';
				$('.passr .zong').text("共"+data.data+"页");
				for(var i=1;i<=data.data;i++){
					if(i==1){
						htmls+='<li class="num on">1</li>';
					}else{
						htmls+='<li class="num">'+i+'</li>';
					}
				}
				$('.passr .goRight').before(htmls);
				dang=0;
				numdisp(dang);
				$('.passr .num').click(function(){
					if($('.passr .num').index(this)!=dang){
						dang=$('.passr .num').index(this);
						$('.passr .num').removeClass('on').eq(dang).addClass('on');
						numdisp(dang);
						getPassList(dang+1);
					}
				});
				$('.passr .goLeft').click(function(){
					dang--;
					if(dang<0){
						dang=0;
						numdisp(dang);
					}else{
						$('.passr .num').removeClass('on').eq(dang).addClass('on');
						numdisp(dang);
						getPassList(dang+1);
					}
				});
				$('.passr .goRight').click(function(){
					dang++;
					if(dang>$('.passr .num').length-1){
						dang=$('.passr .num').length-1;
						numdisp(dang);
					}else{
						$('.passr .num').removeClass('on').eq(dang).addClass('on');
						numdisp(dang);
						getPassList(dang+1);
					}
				});
			}else if(data.code==201){
				$('.passr .num').remove();
				$('.passr .zong').text("共"+data.data+"页");
				$('.passr .goRight').before('<li class="num">'+0+'</li>');
			}
		},
		error: function(){
			win("系统繁忙请稍后!");
		}
	});
};




//未认证列表总页数
var getWeiListPage=function(){
	$.ajax({
		url: ctx+"/personalRealName/getNoRealListNum",
		type: "post",
		success: function(data){
			if(data=="loseSession"){
				 window.location.href=ctx+"/toLogin";
				 return;
			}	
			eval("data="+data);
			if(data.code==200){
				$('.wei .num').remove();
				var htmls='';
				$('.wei .zong').text("共"+data.data+"页");
				for(var i=1;i<=data.data;i++){
					if(i==1){
						htmls+='<li class="num on">1</li>';
					}else{
						htmls+='<li class="num">'+i+'</li>';
					}
				}
				$('.wei .goRight').before(htmls);
				dang=0;
				numdisp(dang);
				$('.wei .num').click(function(){
					if($('.wei .num').index(this)!=dang){
						dang=$('.wei .num').index(this);
						$('.wei .num').removeClass('on').eq(dang).addClass('on');
						numdisp(dang);
						getNoPassList(dang+1);
					}
				});
				$('.wei .goLeft').click(function(){
					dang--;
					if(dang<0){
						dang=0;
						numdisp(dang);
					}else{
						$('.wei .num').removeClass('on').eq(dang).addClass('on');
						numdisp(dang);
						getNoPassList(dang+1);
					}
				});
				$('.wei .goRight').click(function(){
					dang++;
					if(dang>$('.wei .num').length-1){
						dang=$('.wei .num').length-1;
						numdisp(dang);
					}else{
						$('.wei .num').removeClass('on').eq(dang).addClass('on');
						numdisp(dang);
						getNoPassList(dang+1);
					}
				});
			}else if(data.code==201){
				$('.wei .num').remove();
				$('.wei .zong').text("共"+data.data+"页");
				$('.wei .goRight').before('<li class="num">'+0+'</li>');
			}
		},
		error: function(){
			win("系统繁忙请稍后!");
		}
	});
};