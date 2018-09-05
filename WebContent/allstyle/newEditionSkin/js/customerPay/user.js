var dang = 0;
var result = "true";
//缓冲条
function buffer(){
	$('.barcontainer').css('display','block');
}

;$(function(){
	$('.admin').click(function(){
		var str=$('.menu').css('display');
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
	
	var dang=0;//初始化下一页参数
	var	typeDang=0;//出事化指示条参数
	var moveW=$('.move').width();
	$('.college').click(function(){
		collDisp();
	});
	buffer();
	getChurnUserPage();
	 getChurnUserList(1);  
	 
	 queryForList();
	 exportExcel();
	 pageClickThing();
	 reset();
	$('.pullDD>li').click(function(){
		 
		var startTime = $.trim($('#start').val(""));
		var endTime = $.trim($('#end').val(""));
		var n=$('.pullDD>li').index(this);
		var str=$('.pullDD>li').eq(n).html();
		if($.trim(str)!=$.trim("查看全部")){
			$('.college').removeAttr("value");
			var id=$('.pullDD>li').eq(n).attr("value");
			$('.college').attr("value",id);
		 
		}else{
			$('.college').removeAttr("value");
			$('.college').attr("value","all");
		}
		$('.college').html(str);
		$(".pullDD").hide();
	
		total();
		 getChurnUserList(1);
		getChurnUserPage(); 
		 buffer();
	});
	$('.ui-nav>ul>li').click(function(){
		 
		var startTime = $.trim($('#start').val(""));
		var endTime = $.trim($('#end').val(""));
		var obj=$('.ui-nav>ul>li');
		var n=obj.index(this);
		listDispOn(obj,n);
		 buffer();
	});
	
	$('.whether>button').click(function(){
		var n=$('.whether>button').index(this);
		whetherDisp(n);
	});
	$('.new>h2>i').click(function(){
		maskDisp(1);
	});
	$('.recharge').click(function(){
		$('.premises').css('display','block');
		$('.addUser').css('display','none');
		$('.mask').css('display','block');
		$('.newly').animate({left:'20%'},1000);
		$('.btns').animate({left:'20%'},1000);
	});
	$('.btns>button').click(function(){
		var n=$('.btns>button').index(this);
		maskDisp(n%2);
	});
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
	$('.fn-sex>li').click(function(){
		var n=$('.fn-sex>li').index(this);
		$('.fn-sex>li').removeClass('on').eq(n).addClass('on');
	});
	$('.fn-addUser').click(function(){
		$('.premises').css('display','none');
		$('.addUser').css('display','block');
		$('.mask').css('display','block');
		$('.newly').animate({left:'20%'},1000);
		$('.btns').animate({left:'20%'},1000);
	});
	$('html').contextmenu(function(){
		return false;
	});
	 
	/**
	 *流失用户分页查询回车事件 
	 */
	$('#numToPage').keypress(function(event){
	    var e = event || window.event || arguments.callee.caller.arguments[0];
	     if(e && e.keyCode==13){ 
	         //要做的事情
	    		var num=parseInt($('#numToPage').val());
	    		var zong = parseInt($('.zong').text().replace(/[^0-9]/ig,""));
	    		if(num>=zong){
	    			num = zong;
	    		}else if(num<=0){
	    			num=1;
	    		}
	    		
	    		$('.num').removeClass('on').eq(num-1).addClass('on');
	    		 getChurnUserList(num);  
	    		numdisp(num-1);
	    		$('#numToPage').val("");
	    };
	});
	/**
	 * 流失用户跳转按钮CLIKC事件
	 */
	$('#jumpToPage').click(function(){
		 
		var num=parseInt($('#numToPage').val());
		var zong = parseInt($('.zong').text().replace(/[^0-9]/ig,""));
		if(num>=zong){
			num = zong;
		}else if(num<=0){
			num=1;
		}
		$('.num').removeClass('on').eq(num-1).addClass('on');
		getChurnUserList(num);  
		numdisp(num-1);
		$('#numToPage').val("");
	});
});

function pageClickThing(){
 
	$('.goLeft').unbind('click');
	$('.goLeft').click(function(){
		$('.barcontainer').hide();
		dang--;
		if(dang<0){
			dang=0;
			numdisp(dang);
		}else{
			buffer();
			$('.num').removeClass('on').eq(dang).addClass('on');
			var dangs = $('.num.on').text();
			getChurnUserList(parseInt(dangs));
			numdisp(dang);
		}
	});
	$('.goRight').unbind('click');
	$('.goRight').click(function(){
		$('.barcontainer').hide();
		dang++;
		if(dang>$('.num').length-1){
			dang=$('.num').length-1;
			numdisp(dang);
			
		}else{
			buffer();
			$('.num').removeClass('on').eq(dang).addClass('on');
			var dangs = $('.num.on').text();
			getChurnUserList(parseInt(dangs));
			numdisp(dang);
		}
	});
	$('.num').unbind('click');
	$('.num').click(function(){
		 
		buffer();
		dang=$('.num').index(this);
		$('.num').removeClass('on').eq(dang).addClass('on');
		var dangs = $('.num.on').text();
		getChurnUserList(parseInt(dangs));
		numdisp(dang);
	});
}
 //流失用户列表
	 function getChurnUserList(curPage){
		 if(curPage==undefined){
			 curPage =1;
		 }
		$('.user-list>ul>li').remove();
		var siteId = $.trim($('.college').attr("value"));
		var startTime = $.trim($('#start').val());
		var endTime = $.trim($('#end').val());
		if(siteId=="all"){
			siteId = -1;
		}
		getSiteChurnUser(siteId,startTime,endTime,curPage);
	}
	//场所的用户流失列表
    function getSiteChurnUser(siteId,startTime,endTime,curPage){
    	$('.user-list>ul>li').remove();
    	$.ajax({
			type:"post",
			url:ctx+"/siteCustomer/getChurnUserList",
			data:{
				siteId:siteId,
				startTime:startTime,
				endTime:endTime,
				curPage:curPage,
				pageSize:10
			},
			success:function(data){
				if(data=="loseSession"){
					 window.location.href=ctx+"/toLogin";
					 return;
				}	
				eval("data="+data);
				if(data.code==200){
					$('.barcontainer').hide();
					$('#churnUserCount').text(data.totoalNum);
					 
					var names = "";
					var html= "";
					for(var i=0;i<data.data.length;i++){
						var user_name = data.data[i].portal_user_name;
						if(user_name!=null){
							if(user_name.charAt(0)==0){
								names = user_name.substr(1,user_name.length);
							}else{
								names = user_name;
							}
							html +="<li><p>"+names+"</p>"; 
							html +="<p>"+data.data[i].expiration_time.substr(0,data.data[i].expiration_time.length-2)+"</p>"; 
							html +="<p>"+data.data[i].transaction_amount+"</p>"; 
							html +="<p>"+data.data[i].total+"</p>"; 
							html +="<p>"+data.data[i].count+"</p>"; 
							html +="<p>"+data.data[i].site_name+"</p></li>"; 
						}
					}
					$('.user-list>ul>h6').after(html);
					//numdisp(0);
					$(".download").attr("disabled", false);
					$(".download").css("background-color","#6bbdec");
					// numdisp(0);
				}else{
					$('#churnUserCount').text(0);
					$('.barcontainer').hide();
					$('.win>span').html("暂无数据···");
					win();
					$(".download").attr("disabled", true);
					$(".download").css("background-color","#ccc");
				}
			},
			error:function(){
				$('#churnUserCount').text(0);
				$('.barcontainer').hide();
				$('.win>span').html("网络服务忙,请稍后···");
				win();
			}
		});
	}

    //获得流失的用户总页数
    function getChurnUserPage(){
    	 $('.paging>li').remove();
    	var siteId = $.trim($('.college').attr("value"));
		var startTime = $.trim($('#start').val());
		var endTime = $.trim($('#end').val());
    	if(siteId=="all"){
    		siteId=-1;
    	}
    	buildSitePage(startTime,endTime,siteId);
    }
//创建场所下的分页导航
function buildSitePage(startTime,endTime,siteId){
	 $('.paging>li').remove();
	$.ajax({
		type:'post',
		url:ctx+"/siteCustomer/getChurnTotalPage",
		data:{
			startTime:startTime,
			endTime:endTime,
			pageSize:10,
			siteId:siteId
		},
		success:function(data){
			if(data=="loseSession"){
				 window.location.href=ctx+"/toLogin";
				 return;
			}	
			$('.barcontainer').hide();
			eval("data="+data);
			var total = parseInt($.trim(data));
			var html = "";
			html+="<li class='zong'>共"+total+"页</li>";
			html+="<li class='goLeft on'><i class='icon icon-left'></i></li>";
			html += "<li class='num on'>"+1+"</li>";
			for (var i = 2; i <= total; i++) {
					html += " <li class='num'> " + i + " </li>";
			}
			html+="<li class='goRight on'><i class='icon icon-right'></i></li>";
			html+="<p>跳转至<input style='width:50px;height:20px;border:1px solid skyblue' id='numToPage' type='tel'>页 <button id='jumpToPage' class='jumpGoToNum'>跳转</button></p>";
			$('.paging').html(html);
			 pageClickThing();
			    zong();
			    numdisp(0);
			    /**
				 *流失用户分页查询回车事件 
				 */
				$('#numToPage').keypress(function(event){
				    var e = event || window.event || arguments.callee.caller.arguments[0];
				     if(e && e.keyCode==13){ 
				         //要做的事情
				    	 if($('#numToPage').val()!=""){
				    		 if(!isNaN($('#numToPage').val())){
				    			 var num=parseInt($('#numToPage').val());
				    			 var zong = parseInt($('.zong').text().replace(/[^0-9]/ig,""));
				    			 if(num>=zong){
				    				 num = zong;
				    			 }else if(num<=0){
				    				 num=1;
				    			 }
				    			 
				    			 $('.num').removeClass('on').eq(num-1).addClass('on');
				    			 getChurnUserList(num);  
				    			 numdisp(num-1);
				    			 $('#numToPage').val("");
				    		 }else{
				    			 $('#numToPage').val("");
				    		 }
				    	 }
				    };
				});
				/**
				 * 流失用户跳转按钮CLIKC事件
				 */
				$('#jumpToPage').click(function(){
					if($('#numToPage').val()!=""){
						if(!isNaN($('#numToPage').val())){
							var num=parseInt($('#numToPage').val());
							var zong = parseInt($('.zong').text().replace(/[^0-9]/ig,""));
							if(num>=zong){
								num = zong;
							}else if(num<=0){
								num=1;
							}
							$('.num').removeClass('on').eq(num-1).addClass('on');
							getChurnUserList(num);  
							numdisp(num-1);
							$('#numToPage').val("");
						}else{
							$('#numToPage').val("");
						}
					}
				});
		},
		error:function(){
			$('.win>span').html("网络服务忙,请稍后···");
			win();
		}
	});
}
function queryForList(){
	$('#queryForList').unbind("click");
	$('#queryForList').click(function(){
		getChurnUserPage();
		buffer();
		 $('.paging>li').remove();
		 var startTime = $.trim($('#start').val());
		 var endTime = $.trim($('#end').val());
		 if(compareTime(startTime,endTime)==false){
			 $('.barcontainer').hide();
			 return false;
		 }else{
			 $('.barcontainer').hide();
			 getChurnUserPage();
			 getChurnUserList(1);
			 numdisp(0);
		 }
	});
}
//比较时间的大小与是否为空
function compareTime(startTime,endTime){
	if(startTime==""){
		 $('.win>span').html("温馨提示:开始时间不能为空");
			win();
			$('.barcontainer').hide();
		 return false;
	}
	if(endTime==""){
		 $('.win>span').html("温馨提示:结束时间不能为空");
			win();
			$('.barcontainer').hide();
		 return false;
	}
	 var timeStart = startTime.replace("-","").replace("-","");
	 var timeEnd = endTime.replace("-","").replace("-","");
	 if(parseInt(timeStart)>parseInt(timeEnd)){
		 $('.win>span').html("温馨提示:开始时间不能大于结束时间");
			win();
			$('.barcontainer').hide();
		 return false;
	 }
}
//导出excel
function exportExcel(){
	//TODO
	$('.download').click(function(){
		var siteId = $.trim($('.college').attr("value"));
		var startTime = $.trim($('#start').val());
		var endTime = $.trim($('#end').val());
		if(siteId=="all"){
			siteId = -1;
		}
		//判断是否有导出的数据,若有result设置为true，反之false
		checkHaveResult(siteId,startTime,endTime);
		if(result=="true"){
			    try{
				$('.barcontainer').hide();
				 window.location.href=ctx+"/siteCustomer/exportExport?startTime="+startTime+"&endTime="+endTime+"&siteId="+siteId;
				 $('.win>span').html("温馨提示:导出EXCEL成功");
					win();
				}catch(e){
				 $('.win>span').html("温馨提示:导出EXCEL失败");
					win();
				}
		}else{
			 $('.win>span').html("温馨提示:导出EXCEL失败,因为此时间段下暂无数据");
				win();
		}
	});
}

//重置按钮
function reset(){
	$('#reset').click(function(){
		buffer();
		$.trim($('#start').val(""));
		$.trim($('#end').val(""));
		getChurnUserList(1);
	 
			getChurnUserPage();
			numdisp(0);
		 
	});
}
//判断是否有导出的数据
function checkHaveResult(siteId,startTime,endTime){
	$.ajax({
		type:"post",
		url:ctx+"/siteCustomer/checkHaveResult",
		data:{
			siteId:siteId,
			startTime:startTime,
			endTime:endTime
		},
		 async : false,
		success:function(data){
			if(data=="loseSession"){
				 window.location.href=ctx+"/toLogin";
				 return;
			}	
			if(data=="true"){
				result = "true";
			}else{
				result= "false";
			}
		},
		error:function(){
			result= "false";
		}
	});
}


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
	$(".pullDD").toggle();
};
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
var zong=function(){
	
	var n=$('.num').length;
	
	$('.zong').html('共'+n+'页');
};
var win=function(){
	$('.win').css('display','block').fadeOut(5000);
};
var maskDisp=function(n){
	if(n==0){
		$('.newly').animate({left:2000},1000);
		$('.btns').animate({left:2000},1000);
		win();

		setTimeout(function(){
			$('.mask').css('display','none');
		},500);
	}else{
		$('.whether').css('display','block');
	}
};
var whetherDisp=function(n){
	if(n==0){
		$('.whether').css('display','none');
		$('.newly').animate({left:2000},1000);
		$('.btns').animate({left:2000},1000);
		//win();

		setTimeout(function(){
			$('.mask').css('display','none');
		},500);
	}else{
		$('.whether').css('display','none');
	}
};
var fuse_on_off=function(str){
	if(str=="yesOrNo"){
		$('.fuse>.yesOrNo').addClass('on');
			
		$('.operator').css('display','none');
	}else{
		$('.fuse>.yesOrNo').removeClass('on');
			
		$('.operator').css('display','block');
	}
};
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
};
var on_off=function(str,n){
	if(str=="yesOrNo"){
		$('.yesOrNo').eq(n).addClass('on');
	}else{
		$('.yesOrNo').eq(n).removeClass('on');
	}
};
var total=function(){
	if($('.college').html()=='查看全部'){
		$('.site>li>em').css('display','inline');
	}else{
		$('.site>li>em').css('display','none');
	}
};