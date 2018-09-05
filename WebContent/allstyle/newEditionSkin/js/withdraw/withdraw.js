var time;
var dang=0;
var kjsmoney=0;
var gunTime;
//加载条
function buffer(){
	$('.barcontainer').css('display','block');
	$('.barcontainer').fadeOut(800);
}
window.onload=function(){
	selAccountLog(1,$(".con_tabel>.on").attr("data-status"));
	getWithDrawMoney();
	selAccountLogTotalNum($(".con_tabel>.on").attr("data-status"));
	buffer();
	// 用户信息下拉菜单
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
	/*商户点击提现申请和账户流水*/
	$('.title>span').click(function(){
		var obj=$('.title>span');
		var n=obj.index(this);
		on(obj,n);
		$('.ui-content').css('display','none').eq(n).css('display','block');
		if(n==0){
			selAccountLog(1,$(".con_tabel>.on").attr("data-status"));
			//getWithDrawMoney();
			selAccountLogTotalNum($(".con_tabel>.on").attr("data-status"));
		}else{
			withDrawFlow(1);
			withdrawGetAllPage();
//			withdrawStateList();
//			withdrawGetAllPage();
			$('.selec5').css('display','block');
		}
	});
	/*商户在提现申请页面点击查询*/
	$('#setAccountLog').click(function(){
		buffer();
		selAccountLog(1,$(".con_tabel>.on").attr("data-status"));
	//	getWithDrawMoney();
		selAccountLogTotalNum($(".con_tabel>.on").attr("data-status"));
	});
	/*商户在账户流水页面点击查询*/
	$('#setStateList').click(function(){
		withDrawFlow(1);
		withdrawGetAllPage();
	});
	/*待支付,已支付,结算中点击*/
	$('.con_tabel > span').click(function(){
		var n = $('.con_tabel > span').index(this);
		on($('.con_tabel > span'),n);
		selAccountLogTotalNum($(".con_tabel>.on").attr("data-status"));
		selAccountLog(1,$(".con_tabel>.on").attr("data-status"));
	});
	
	/**
	* 新增账号 银行卡号input 事件
	* onfocus--判断input框有没有值
	* onkeypress--往input框键入时候的操作
	* onblur--隐藏bigNum回显框
	*/
	$('#bankcarNums').focus(function(){
		if($('#bankcarNums').val().length>0){
			$('.bigNum').css('display','block');
			var str=$('#bankcarNums').val();
			$('.bigNum').text(bankNumSpace(str));
		}else{
			$('.bigNum').css('display','none');
			$('.bigNum').text('');
		}
	});
	$('#bankcarNums').blur(function(){
		$('.bigNum').css('display','none');
		$('.bigNum').text('');
		var str=$(this).val();
		getBankName(str);
	});
	$('#bankcarNums').bind('input propertychange',function(){
		$('.bigNum').css('display','block');
		
		setTimeout(function(){
			var str=$('#bankcarNums').val();
			$('.bigNum').text(bankNumSpace(str));
		},100);
	});
	
	/*
	 * verifyNum--验证码输入框  
	 * 回车提交事件
	 * */
	$('#verifyNum').keypress(function(event){
	    var e = event || window.event || arguments.callee.caller.arguments[0];
	     if(e && e.keyCode==13){ 
	         //要做的事情
	    	 withdrawVerify();
	    }
	});
	/**
	 *提现日志表
	 */
	$('#numLog').keypress(function(event){
	    var e = event || window.event || arguments.callee.caller.arguments[0];
	     if(e && e.keyCode==13){ 
	         //要做的事情
	    	 if($('#numLog').val()!=""){
	    	
	    	 var num=parseInt($('#numLog').val());
	    	 var zong = parseInt($('#zongLog').text().replace(/[^0-9]/ig,""));
	    		if(num>=zong){
	    			num = zong;
	    		}else if(num<=0){
	    			num=1;
	    		}
	    		
	    		$('.num').removeClass('on').eq(num-1).addClass('on');
	    		selAccountLog(num);
	    		numdisp(num-1);
	    		$('#numLog').val("");
	    	 }
	    };
	});
	/**
	 * 提现记录跳转按钮CLIKC事件
	 */
	$('#jumpToLog').click(function(){
		if($('#numLog').val()!=""){
			var num=parseInt($('#numLog').val());
			var zong = parseInt($('#zongLog').text().replace(/[^0-9]/ig,""));
			if(num>=zong){
				num = zong;
			}else if(num<=0){
				num=1;
			}
			
			$('.num').removeClass('on').eq(num-1).addClass('on');
			selAccountLog(num);
			numdisp(num-1);
			$('#numLog').val("");
		}
	});
	/**
	 * 待提现记录跳转按钮CLIKC事件
	 */
	$('#numToPage').keypress(function(event){
	    var e = event || window.event || arguments.callee.caller.arguments[0];
	     if(e && e.keyCode==13){ 
	         //要做的事情
	    	 if($('#numToPage').val()!=""){
	    		 var num=parseInt($('#numToPage').val());
	    		 var zong = parseInt($('#daiLog').text().replace(/[^0-9]/ig,""));
	    		 if(num>=zong){
	    			 num = zong;
	    		 }else if(num<=0){
	    			 num=1;
	    		 }
	    		 
	    		 $('.num').removeClass('on').eq(num-1).addClass('on');
	    		 withdrawStateList(num);
	    		 numdisp(num-1);
	    		 $('#numToPage').val("");
	    	 }
	    };
	});
	/**
	 * 待提现记录跳转按钮CLIKC事件
	 */
	$('#jumpToPage').click(function(){
		 if($('#numToPage').val()!=""){
			 var num=parseInt($('#numToPage').val());
			 var zong = parseInt($('#daiLog').text().replace(/[^0-9]/ig,""));
			 if(num>=zong){
				 num = zong;
			 }else if(num<=0){
				 num=1;
			 }
			 $('.num').removeClass('on').eq(num-1).addClass('on');
			 withdrawStateList(num);
			 numdisp(num-1);
			 $('#numToPage').val("");
		 }
	});
	/*
	 * 提现提交按钮
	 * 回车提交事件
	 * */
	$('#moneyGeg').keypress(function(event){
	    var e = event || window.event || arguments.callee.caller.arguments[0];
	     if(e && e.keyCode==13){ 
	         //要做的事情
	    	 wihdrawSubmit();
	    }
	});
	
	
	/**
	*限制提现输入框的输入规则
	*/
	$("#moneyGeg").bind('input propertychange', function (event) {
		clearTimeout(gunTime);
	    var $amountInput = $(this);
	    //响应鼠标事件，允许左右方向键移动 
	    event = window.event || event;
	    if (event.keyCode == 37 | event.keyCode == 39) {
	        return;
	    }
	    //先把非数字的都替换掉，除了数字和. 
	    $amountInput.val($amountInput.val().replace(/[^\d.]/g, "").
	        //只允许一个小数点              
	        replace(/^\./g, "").replace(/\.{2,}/g, ".").
	        //只能输入小数点后两位
	        replace(".", "$#$").replace(/\./g, "").replace("$#$", ".").replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'));

	    gunTime=setTimeout(function(){
	    	$('.mayMoneyGeg').addClass('gun');
	    	 var str=$amountInput.val();
	    	 $('.mayMoneyGeg').text(parseFloat(kjsmoney-str).toFixed(2)+'元'); 
	    	 setTimeout(function(){
	    		$('.mayMoneyGeg').removeClass('gun');
	    	},1000);
	    },1000);

	});
	$("#moneyGeg").on('blur', function () {
	    var $amountInput = $(this);
	    //最后一位是小数点的话，移除
	    $amountInput.val(($amountInput.val().replace(/\.$/g, "")));
	});

	// 提现按钮
	 
	$('.extract').click(function(){
		$('.extract').attr("disabled","disabled");
		withdrawDeposit();
	});
	$('.fn-gain').click(function(){
		countDown($('.fn-gain'),90);//获取验证码方法
		toTelCode();
	});
	// 验证码确定按钮
	$('.fn-pass').click(function(){
		withdrawVerify();
	});
	//选择收款账号
	$('.fn-select').unbind("click");
	$('.fn-select').click(function(){
		listClosedid();
	});
	$(".icon-false").click(function(){
		var obj=new dfgsWithdraw();
		obj.close();

	});
	
	
	// 验证码 取消按钮
	$('.fn-close').click(function(){
		var obj=new dfgsWithdraw();
		obj.close();
	});
	
	/* 鼠标移入 hover 事件 start */
	
	/* 鼠标移入 hover 事件 end */
	// 新增账号提交按钮
	$('#newAddCard').click(function(){
		 $("#bankcarNums").removeData("previousValue");
		$('#newAddCardName').submit();
		$('.revealP').css('display','block');
		
	});
	$('#newAddCard').change(function(){
		 $("#bankcarNums").removeData("previousValue");
		 
	});
	
	//新增支付宝绑定提交
	$('#newAddAlipay').click(function(){
		subajax();
		$('.revealP').css('display','none');
	});
	
	$('#selectBankCard').click(function(){
		var selectBankCardId=$('.closedidList>li.on').attr('data');
		var str = $('.closedidList>li.on .text').text();
		if(str=='支付宝'){
			$('.revealP').css('display','none');
		}else{
			$('.revealP').css('display','block');
		}
		if(selectBankCardId){
			selectBankCard();
		}else{
			win("新增银行卡账号",2500);
		}
	});
	$('.show>h4>i').click(function(){
		var n=$('.show>h4>i').index(this);
		var obj=new dfgsWithdraw();
		if(n==0){
			obj.close();
		}else if(n==1){
			obj.show1();
		}else if(n==2){
			obj.show1();
		}else if(n==3){
			obj.show1();
		}
	});
	$('#wihdrawSubmit').click(function(){
		if($('#accountName').val()==""||$('#bankcarNum').val()==""||$('#bankDeposit').val()==""||$('#branchName').val()==""){
			win("请选择收款账号");
			return false;
		}
		wihdrawSubmit();
	});
};
 

var on=function(obj,n){//自用方法---用来区分当前的焦点元素
	obj.removeClass('on').eq(n).addClass('on');
	if(n==0){
		$('#dateStart2').val("");
		$('#dateEnd2').val("");
		buffer();
	}else{
		$('#dateStart1').val("");
		$('#dataEnd1').val("");
		buffer();
	}
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
/**
*获取验证码等待时间
*/
var countDown=function(obj,n){
	obj.html('('+n+')秒后重新获取');
	obj.removeClass('on');
	time=setInterval(function(){
		n--;
		obj.html('('+n+')秒后重新获取');
		obj.attr({"disabled":"true"});
		if(n==0){
			clearInterval(time);
			obj.html('重新获取验证码');
			obj.removeAttr("disabled");
			obj.addClass('on');
		}
	},1000);
};
/**
*东方高盛，提现系列弹窗
*/
function dfgsWithdraw(){
	/**
	*打开验证码输入框
	*/
	this.verifyAlert=function(callback){
		$('.mask').css('display','block');
		$('.show').css('display','none');
		$('.alertVerify').css('display','block');
		countDown($('.fn-gain'),90);//
		if(callback)callback();//执行回掉函数
	};
	/**
	*所有关闭操作
	*/
	this.close=function(){
		$('.mask').css('display','none');
		$('.extract').removeAttr("disabled");
		clearInterval(time);
		clear();
	};
	/**
	*通过验证码验证后的显示
	*/
	this.show1=function(callback){
		$('.show').css('display','none').eq(0).css('display','block');
		$('.alertVerify').css('display','none');
		listClosedid();
		if(callback)callback();//执行回掉函数
	};
	
};
/**
* 处理字符串显示几位中间以‘*’号显示
* 只能用作回显银行卡号
*/
function substrDemo(str){//接受需要处理的字符串
	return (str.substr(0,5)+'****'+str.substr(str.length-4,4));//直接返回处理好的字符串
}
/**
* 处理银行卡号4为加一个空格
* 只能用作回显银行卡号
*/
function bankNumSpace(str){
	var arr=new Array(),
		str1='',
		len=parseInt(str.length/4);
	if(str.length!=16){
		for(var i=0;i<len+1;i++){
			if(i==len){
				arr.push(str.substr(i*4,4));
			}else{
				arr.push(str.substr(i*4,4)+" ");
			}
		}
	}else{
		for(var i=0;i<len;i++){
			if(i==len-1){
				arr.push(str.substr(i*4,4));
			}else{
				arr.push(str.substr(i*4,4)+" ");
			}
		}
	}
	for(var i=0;i<arr.length;i++){
		str1+=arr[i];
	}
	return str1;
}
//获得用户可提现余额与结算时间与用户电话号码
function getWithDrawMoney(){
	$.ajax({
		url: ctx+"/withDraw/selCanWithDraw",
		type: "post",
		success: function(data){
			if(data=="loseSession"){
				 window.location.href=ctx+"/toLogin";
				 return;
			}	 
			eval("data="+data);
			if(data.code==200){
				$('.sumMoney').text(data.data.withDrawMoney+'元');
				$('.closeTime').text(data.data.withDrawTime);
				$(".extract").attr('disabled',false);
				$(".extract").css("background","#57c6d4");
			}else{
				$('.sumMoney').text(data.data.withDrawMoney+'元');
				$('.closeTime').text(data.data.withDrawTime);
				$(".extract").attr('disabled',true);
				$(".extract").css("background","#ccc");
			}
		}
	});
}

// 提现列表 初始化ajax---查询用户提现记录日志列表
var selAccountLog=function(n,str){
	var start=$('#dateStart1').val(),
		end=$('#dataEnd1').val(),
		curPage=n==undefined?1:n;
	var status="";
	switch (str){
		case 'djs':status=802;break;
		case 'yzf':status=805;break;
		case 'suz':status=807;break;
		default : status='';break;
	}	
	buffer();
	$.ajax({
		url: ctx+"/withDraw/selUserAllDraw",
		type: "post",
		data: {
			startTime : start,
			endTime : end,
			curPage : curPage,
			status : status
		},
		success: function(data){
			if(data=="loseSession"){
				 window.location.href=ctx+"/toLogin";
				 return;
			}	 
			eval("data="+data);
			if(data.code==200){
				$(".barcontainer").hide();
				var htmls='';
				for(var i=0,len=data.data.length;i<len;i++){
				htmls+='<li data-contId='+data.data[i].account_id+'>'+
							'<span>'+data.data[i].start_time.replace(/-/g,'.')+'-'+data.data[i].end_time.replace(/-/g,'.')+'</span>'+
							'<span>'+parseFloat(data.data[i].account_platform_income).toFixed2(2)+'</span>'+
							'<span>'+parseFloat(data.data[i].account_offline_income).toFixed2(2)+'</span>';
							if(data.data[i].status=='801'){
							htmls+='<span></span>'+
							'<span>飞讯无限财务正在审核账单中</span>'+
							'<span></span>';
							}else if(data.data[i].status=='803'){
								htmls+='<span></span>'+
								'<span>飞讯无限财务正在打款中</span>'+
								'<span></span>';
							}else if(data.data[i].status=='806'){
								htmls+='<span></span>'+
								'<span>飞讯无限财务审核申诉账单中</span>'+
								'<span></span>';
							}else{
								htmls+='<span>'+parseFloat(data.data[i].account_refund).toFixed2(2)+'</span>'+
								'<span>'+parseFloat(data.data[i].charge_rate).toFixed2(2)+'</span>'+
								'<span>'+parseFloat(data.data[i].account_balance_after).toFixed2(2)+'</span>';
							}
							htmls+='<span>'+(data.data[i].status=='806'?'申诉中':data.data[i].status=='801'?'待结算':data.data[i].status=='803'?'收款中':data.data[i].status=='802'?'待结算'+(data.data[i].after_money==undefined?'':'<img class="mo_ts" src="'+imgPath+'/ts.png">'):data.data[i].status=='805'||data.data[i].status=='808'?'已支付':'申诉<img class="mo_ts" src="'+imgPath+'/ts.png"> ')+'</span>'+
							'<span>'+(data.data[i].status=='802'?'<i class="su_withdraw">确认提现</i><i class="su_ss">申诉</i>':data.data[i].status=='805'?'<i class="su_que">确认</i>':'')+'</span>'+
						'</li>';
				}
				$('.selec1>ul').html(htmls);
				/*$('.gathering').hover(function(){
					var n=$('.gathering').index(this);
					$('.gatheringNum').css('display','none').eq(n).css('display','block');
				},function(){
					$('.gatheringNum').css('display','none');
				});
				$('.procedure').hover(function(){
					var n=$('.procedure').index(this);
					$('.poundage').css('display','none').eq(n).css('display','block');
				},function(){
					$('.poundage').css('display','none');
				});
				$('.downloadEarning').click(function(){
				     var fileName =  encodeURI(encodeURI($(this).attr('data')));
					window.location.href=ctx+"/withDraw/downloadConfigFile?fileName="+fileName;
					
				});*/
				/*商户已支付确定按钮*/
				$(".su_que").unbind('click');
				$(".su_que").click(function(){
					var n = $(".su_que").index(this);
					var status='808';
					var contId = $(".su_que").eq(n).parent().parent().attr('data-contId');
					updateWithDrawStu(n,status,contId);
				})
				/*商户待结算确认提现*/
				$(".su_withdraw").unbind("click");
				$(".su_withdraw").click(function(){
					var n = $(".su_withdraw").index(this);
					var status='803';
					var contId = $(".su_withdraw").eq(n).parent().parent().attr('data-contId');
					updateWithDrawStu(n,status,contId);
				})
				/*商户待结算申诉*/
				$(".su_ss").unbind("click");
				$(".su_ss").click(function(){
					var n = $(".su_ss").index(this);
					var status='806';
					var contId = $(".su_ss").eq(n).parent().parent().attr('data-contId');
					updateWithDrawStu(n,status,contId);
				}) 
			}else if(data.code==201){
				$(".barcontainer").hide();
				$('.selec1>ul>li').remove();
				win("暂无数据");
			}
		},
		error: function(){
			win("系统繁忙请稍后!");
		}
	});
};
function updateWithDrawStu(n,status,contId){
	var content="";
	$.ajax({
		type:"post",
		url:ctx+"/withDraw/userAgree",
		data:{
			accountId:contId,
			status:status,
			content	:content
		},
		success:function(data){
			if(data=="loseSession"){
				 window.location.href=ctx+"/toLogin";
				 return;
			}	 
			eval("data="+data);
			if(data.code==200){
				selAccountLog(1,$(".con_tabel>.on").attr("data-status"));
				selAccountLogTotalNum($(".con_tabel>.on").attr("data-status"));
			}else{
				win("系统繁忙请稍后!");
			}
		}
		
	})
} 
//查询提现记录日志总页数接口
var selAccountLogTotalNum=function(str){
	var start=$('#dateStart1').val(),
		end=$('#dataEnd1').val();
	var status="";
	switch (str){
		case 'djs':status=802;break;
		case 'yzf':status=805;break;
		case 'suz':status=807;break;
		default :status='';break;
	}
	$.ajax({
		url: ctx+"/withDraw/getPageCount",
		type: "post",
		data: {
			startTime : start,
			endTime : end,
			status :status,
		},
		success: function(data){
			if(data=="loseSession"){
				 window.location.href=ctx+"/toLogin";
				 return;
			}	 
			eval("data="+data);
			if(data.code==200){
				$('.num').remove();
				var htmls='';
				$('.zong').text("共"+data.data+"页");
				for(var i=1;i<=data.data;i++){
					if(i==1){
						htmls+='<li class="num on">1</li>';
					}else{
						htmls+='<li class="num">'+i+'</li>';
					}
				}
				$('.goRight').eq(0).before(htmls);
				dang=0;
				numdisp(dang);
				$('.num').click(function(){
					if($('.num').index(this)!=dang){
						dang=$('.num').index(this);
						$('.num').removeClass('on').eq(dang).addClass('on');
						numdisp(dang);
						selAccountLog(dang+1,$(".con_tabel>.on").attr("data-status"));
					}
				});
				$('.goLeft').eq(0).click(function(){
					dang--;
					if(dang<0){
						dang=0;
						numdisp(dang);
					}else{
						$('.num').removeClass('on').eq(dang).addClass('on');
						numdisp(dang);
						selAccountLog(dang+1,$(".con_tabel>.on").attr("data-status"));
					}
				});
				$('.goRight').eq(0).click(function(){
					dang++;
					if(dang>$('.num').length-1){
						dang=$('.num').length-1;
						numdisp(dang);
					}else{
						$('.num').removeClass('on').eq(dang).addClass('on');
						numdisp(dang);
						selAccountLog(dang+1,$(".con_tabel>.on").attr("data-status"));
					}
				});
			}else if(data.code==201){
				$('.num').remove();
				$('.zong').text("共"+0+"页");
				$('.goRight').eq(0).before('<li class="num">'+0+'</li>');
			}
		},
		error: function(){
			win("系统繁忙请稍后!");
		}
	});
};
/*获取用户的账户流水*/
function withDrawFlow(n){
	var startTime=$("#dateStart2").val();
	var endTime=$("#dateEnd2").val();
	$.ajax({
		url: ctx+"/withDraw/getWithDrawFlow",
		type: "post",
		data: {
			startTime : startTime,
			endTime : endTime,
			curPage : n
		},
		success: function(data){
			if(data=="loseSession"){
				 window.location.href=ctx+"/toLogin";
				 return;
			}	 
			eval("data="+data);
			if(data.code==200){
				$(".selec5>ul>li").remove();
				$(".barcontainer").hide();
				var htmls='';
				for(var i=0,len=data.data.length;i<len;i++){
				htmls+='<li>'+
							'<span data-d="'+data.data[i].start_time1+ ','+ data.data[i].end_time1+'">'+data.data[i].start_time.replace(/-/g,'.')+'-'+data.data[i].end_time.replace(/-/g,'.')+'</span>'+
							'<span>'+data.data[i].flow_code+'</span>'+
							'<span>'+parseFloat(data.data[i].account_platform_income).toFixed2(2)+'</span>'+
							'<span>'+parseFloat(data.data[i].account_offline_income).toFixed2(2)+'</span>'+
							'<span>'+parseFloat(data.data[i].account_refund).toFixed2(2)+'</span>'+
							'<span>'+parseFloat(data.data[i].poundage).toFixed2(2)+'</span>'+
							'<span>'+parseFloat(data.data[i].accountincome).toFixed2(2)+'</span>'+
							'<span><i class="load">下载明细</i><span>'+
						'</li>';
				}
				$('.selec5>ul').html(htmls);
				
				$(".load").unbind("click");
				$(".load").click(function(){
					var n = $(".load").index(this);
					var times = $(".load").eq(n).parent().parent().find('span').eq(0).attr("data-d").split(",");
					window.location.href=ctx+"/withDraw/importExcle?startTime="+times[0]+"&endTime="+times[1];
				})
				
			}else{
				$(".barcontainer").hide();
				$('.selec5>ul>li').remove();
				win("暂无数据");
			}
		}
		
	});
	
}


/**
*当提现操作成功后执行跳转到获得待提现记录页面 
*初始化提现状态页面
*单击查询按钮触发
*单击页数触发
*单击下一页或上一页触发的ajax
*/
var withdrawStateList=function(n){
	var startTime=$('#dateStart2').val(),//开始日期
	 	endTime=$('#dateEnd2').val(),//结束日期
		curPage=n==undefined?1:n;
	buffer();
	$.ajax({
		url: ctx+"/withDraw/getUserAccountLogInfo",
		type: "POST",
		data: {
			startTime: startTime,
			endTime: endTime,
			curPage: curPage,//当前
			pageSize:9
		},
		success: function(data){
			if(data=="loseSession"){
				 window.location.href=ctx+"/toLogin";
				 return;
			}	 
		    eval("data="+data);
			if(data.code==200){
				$(".barcontainer").hide();
				var htmls='';
				for(var i=0,len=data.data.length;i<len;i++){
					if(data.data[i].withdrawState==0){
						htmls+= '<li>'+
									'<span>'+data.data[i].createTime+'</span>'+
									'<span>'+parseInt(data.data[i].withdrawMoney*100)/100+'</span>'+
									'<span>'+substrDemo(data.data[i].bankCardNum)+'</span>'+
									'<span style="color:#6bbdec">审核中<i></i></span>'+
								'</li>';
					}else if(data.data[i].withdrawState==1){
						htmls+= '<li>'+
									'<span>'+data.data[i].createTime+'</span>'+
									'<span>'+parseInt(data.data[i].withdrawMoney*100)/100+'</span>'+
									'<span>'+substrDemo(data.data[i].bankCardNum)+'</span>'+
									'<span style="color:#54cc47">已打款<i></i></span>'+
								'</li>';
					}else{
						htmls+= '<li>'+
									'<span>'+data.data[i].createTime+'</span>'+
									'<span>'+parseInt(data.data[i].withdrawMoney*100)/100+'</span>'+
									'<span>'+substrDemo(data.data[i].bankCardNum)+'</span>'+
									'<span style="color:#d25e5e">审核未通过（<i class="why">原因</i>）</span>'+
									'<p class="cause">'+data.data[i].notPassResason+'</p>'+
								'</li>';
					}
				}
				$('.selec2>ul').html(htmls);
				/**
				*数据渲染上之后绑定hover事件
				*/
				$('.why').hover(function(){
					var n=$('.why').index(this);
					$('.cause').css('display','none').eq(n).css('display','block');
				},function(){
					$('.cause').css('display','none');
				});
			}else{
				$(".barcontainer").hide();
				$('.selec2>ul>li').remove();
				win('暂无数据');
			}
		},
		error: function(){
			win('网络繁忙，请稍后再试...');
		}
	});
};
/**
*获得 待提现的总页数接口
*/
var withdrawGetAllPage=function(){
	var startTime=$('#dateStart2').val();//开始日期
	var endTime=$('#dateEnd2').val();//结束日期
	$.ajax({
	    url: ctx+"/withDraw/getPageCount",
		type: "post",
		data: {
			startTime : startTime,
			endTime : endTime,
			status :'808',
		},
		success: function(data){
			if(data=="loseSession"){
				 window.location.href=ctx+"/toLogin";
				 return;
			}	 
			 eval("data="+data);
			if(data.code==200){
				$('.num').remove();
				var htmls='';
				$('.zong').text("共"+data.data+"页");
				    if(data.data==0){
				    	htmls+='<li class="num on">'+0+'</li>';
				    }else{
				    	for(var i=1;i<=data.data;i++){
				    		if(i==1){
				    			htmls+='<li class="num on">'+i+'</li>';
				    		}else{
				    			htmls+='<li class="num">'+i+'</li>';
				    		}
				    	}
				    }
				 
				$('.goRight').eq(1).before(htmls);
				dang=0;
				numdisp(dang);
				$('.num').click(function(){
					if($('.num').index(this)!=dang){
						dang=$('.num').index(this);
						$('.num').removeClass('on').eq(dang).addClass('on');
						numdisp(dang);
						withdrawStateList(dang+1);
					}
				});
				$('.goLeft').eq(1).click(function(){
					dang--;
					if(dang<0){
						dang=0;
						numdisp(dang);
					}else{
						$('.num').removeClass('on').eq(dang).addClass('on');
						numdisp(dang);
						withdrawStateList(dang+1);
					}
				});
				$('.goRight').eq(1).click(function(){
					dang++;
					if(dang>$('.num').length-1){
						dang=$('.num').length-1;
						numdisp(dang);
					}else{
						$('.num').removeClass('on').eq(dang).addClass('on');
						numdisp(dang);
						withdrawStateList(dang+1);
					}
				});
			} 
		},
		error: function(){
			win("网络异常,请稍后再试····");
		}
	});
};

// 提现按钮动作
var withdrawDeposit=function(){
		var obj=new dfgsWithdraw();
		obj.verifyAlert(toTelCode);
};
/**
 * 发送验证码ajax
 */
var toTelCode = function(){
	var userName = $('.adname').text(),
		content = "已弃用";
	$.ajax({
		type:"post",
		url:ctx+"/TelCodeManage/sendTelCode",
		data:{
			tel:userName,
			//content:content
			templateCode:"SMS_136855624",
			msgtext:'平台:'+content
		},
		success:function(data){
			eval("data="+data);
			if(data==-2){
				clearInterval(time);
				$('.fn-gain').html('重新获取验证码');
				$('.fn-gain').removeAttr("disabled");
				$('.fn-gain').addClass('on');
				//alert("请不要频繁发送验证码,谢谢您的配合与支持!");
				floatAlert(280,55,'请不要频繁发送验证码,谢谢您的配合与支持!',2300);
			}
		},
	});
};
// 检验验证码ajax
var withdrawVerify=function(){
	var code=$('#verifyNum').val();
	var userName = $('.adname').text();
	$.ajax({
		type: "post",
		url: ctx+"/CheckVierifyCode/checkedCode",
		data: {
			yzmNumber: code,
			telephone:userName
		},
		success:function(data){
			eval("data="+data);
			if(data.code==200){
				withdrawForm();
			}else if(data.code==201){
				$('#verifyNum').val('');
				win("验证码失效，请重新获取");
			}else if(data.code==203){
				$('#verifyNum').val('');
				win("请输入验证码");
			}else{
				$('#verifyNum').val('');
				win("验证码不正确");
			} 
		},
	});
};

// 提现表单回显ajax
var withdrawForm=function (){
	
	$.ajax({ 
		type: "POST",
		url: ctx+"/withDraw/getUserBankInfo",
		 
		success: function(data){
			if(data=="loseSession"){
				 window.location.href=ctx+"/toLogin";
				 return;
			}	 
			eval('data='+data);
			if (data.code==200) {
				var obj=new dfgsWithdraw();
				obj.show1();
			}else{
				 win("暂无银行卡,正在为您跳转个人中心新增银行卡····");
				 setTimeout(function(){
					window.location.href=ctx+"/personalCenter/toPersonalCenter";
				 }, 2500);
			};
      	},
      	error: function(){
      		win("网络服务忙,请稍后");
      	}
  	});
};
// 选择账号回显 ajax
var listClosedid=function (){
	$.ajax({
		url: ctx+"/withDraw/getUserBankInfos",
		type: "POST",
		success: function(data){
			if(data=="loseSession"){
				 window.location.href=ctx+"/toLogin";
				 return;
			}	 
			eval('data='+data);
			if (data.code==200) {
				
				$('.closedidList').html('');
				var htmls="";
				for(var i=0,len=data.data.length;i<len;i++){
					if(i==0){
						htmls+= '<li class="on" data="'+data.data[i].id+'">'+
									'<span class="ico abs"><i class="icon icon-true"></i></span>'+
									'<span class="text">'+data.data[i].bankDeposit+'</span>'+
									'<span class="text1">'+substrDemo(data.data[i].bankcarNum)+'</span>'+
									'<span class="ico"><i class="icon icon-trash trash"></i></span>'+
								'</li>';
					}else{
						htmls+= '<li data="'+data.data[i].id+'">'+
									'<span class="ico abs"><i class="icon icon-true"></i></span>'+
									'<span class="text">'+data.data[i].bankDeposit+'</span>'+
									'<span class="text1">'+substrDemo(data.data[i].bankcarNum)+'</span>'+
									'<span class="ico"><i class="icon icon-trash trash"></i></span>'+
								'</li>';
					}
				}
				$('.closedidList').html(htmls);
				$('.closedidList>li').click(function(){
					var n=$('.closedidList>li').index(this);
					
					$('.closedidList>li').removeClass('on').eq(n).addClass('on');
				});
				$(".trash").change(function(){
					 $("#bankcarNums").removeData("previousValue");
				});
				 
				// 删除账号按钮
				$('.trash').click(function(){
					
					var n=$('.trash').index(this);
					
					var i=$('.closedidList>li').eq(n).attr('data');
					if(confirm("你确定要删除该提现账号？")){
						deleteBankCard(i);
						 $("#bankcarNums").removeData("previousValue");
					}else{
						return false;
					}
				});
			}else{
				$('.closedidList').html("");
				 win("暂无银行卡,正在为您跳转新增卡片页面···");
				 setTimeout(function(){
					 var obj=new dfgsWithdraw();
					 obj.show1(); 
				 }, 2500); 
			}; 
      	},
      	error: function(){
      		win("网络异常,请稍后····");
      	}
	});
};


// 选择银行卡确定按钮ajax
var selectBankCard=function(){
	var selectBankCardId=$('.closedidList>li.on').attr('data');
	var withdrawMoney=$(".sumMoney").text().replace( /[\u4e00-\u9fa5]+/g, '');
	$.ajax({
		url: ctx+"/withDraw/getCanWithDraw",
		type: "POST",
		data:{
			bankNumId:selectBankCardId,
			withdrawMoney:withdrawMoney
		},
		success: function(data){
			if(data=="loseSession"){
				 window.location.href=ctx+"/toLogin";
				 return;
			}	 
			eval('data='+data);
			if(data.code==200){
				var obj=new dfgsWithdraw();
				obj.close();
				win("提现成功",1500);
				getWithDrawMoney();
				selAccountLog(1,"");
				selAccountLogTotalNum("");
			}else if(data.code==201){
				win(data.msg,1500);
			}else if(data.code==202){
				win(data.msg,1500);
			}else if(data.code==203){
				win(data.msg,1500);
			}else if(data.code==204){
				win(data.msg,1500);
			}
		},
	});
};


// 提交提现表单ajax
var wihdrawSubmit=function (){
	var inBankInfoId=$('#withdrawForm').attr('data'),
		moneryGeg=$('#moneyGeg').val(),
		bankcarNum=$('#bankcarNum').val(),
		mayMoneyGeg=kjsmoney,
		phone=$('#userPone').attr('data');
	if(moneryGeg!=""&&moneryGeg!=0){
 
		if(parseFloat(moneryGeg)<=parseFloat(mayMoneyGeg)){
			$.ajax({
				url: ctx+"/withDraw/setAccountRecords",
				type: "post",
				data: {
					withdrawPhone: phone,
					inBankInfoId: inBankInfoId,
					moneryGeg: moneryGeg,
					bankcarNum: bankcarNum
				},
				success: function(data){
					eval('data='+data);
					if(data.code==200){
						var obj1=$('.label>li');
						on(obj1,1);
						$('.ui-content').css('display','none').eq(1).css('display','block');
						withdrawStateList();
						withdrawGetAllPage();
						var obj=new dfgsWithdraw();
						obj.close();
					}else if(data.code=201){
						win(data.msg);
					}else{
						win("提现金额不能大于可提现余额");
					}
				},
				error: function(){
					win("系统繁忙,请稍后再试!");
				}
			});
		}else{
			win("提现金额不能大于可以提现的金额");
		}
	}else if(moneryGeg==""){
		win("请添加提现金额");
	
	}else if(moneryGeg==0){
		win("提现金额不能为零");
	}
};
 
// 自定义银行卡号validate
jQuery.validator.addMethod("bank", function(value, element) { 
    return this.optional(element) || luhmCheck(value);
}, "请输入正确的银行卡号");

// validate 新增账号校验
var newAddCardName =$("#newAddCardName").validate({
	
	errorPlacement : function(error, element) {
			error.css({
			}).appendTo(element.next().addClass("error"));
		},
	submitHandler : function(form) {
		subajax();
	},
	rules : {
		accountNames: {
			required:true,
			maxlength:25
		},
		bankcarNums: {
			required:true,
			digits:true,
			rangelength:[16,19],
			bank:true,
			remote:{
			    url: ctx+"/withDraw/isHaveBank",     //后台处理程序
			    type: "post",   
			    async : false,
			    data: {                     //要传递的数据
			    	bankcarNums: function() {
			            return $("#bankcarNums").val();
			        }
			    }
			}
		},
		branchNames: {
			required:true,
			minlength:4
		}
	},
	messages : {
		accountNames: {
			required:'请输入收款账号名称',
			maxlength:'收款账号名称不能大于25个字符'
		},
		bankcarNums: {
			required:'请输入银行卡号',
			digits:'只能输入数字',
			rangelength:'请输入正确的卡号位数',
			bank:'请输入正确的银行卡号',
			remote: '该银行卡号已存在'
		},
		branchNames: {
			required:'请输入开户行支行名称',
			minlength:'支行名称不能少于4个字符'
		}
	}
});


//验证银行卡号
function luhmCheck(bankno){
    var lastNum=bankno.substr(bankno.length-1,1);//取出最后一位（与luhm进行比较）
 
    var first15Num=bankno.substr(0,bankno.length-1);//前15或18位
    var newArr=new Array();
    for(var i=first15Num.length-1;i>-1;i--){    //前15或18位倒序存进数组
        newArr.push(first15Num.substr(i,1));
    }
    var arrJiShu=new Array();  //奇数位*2的积 <9
    var arrJiShu2=new Array(); //奇数位*2的积 >9
     
    var arrOuShu=new Array();  //偶数位数组
    for(var j=0;j<newArr.length;j++){
        if((j+1)%2==1){//奇数位
            if(parseInt(newArr[j])*2<9)
            arrJiShu.push(parseInt(newArr[j])*2);
            else
            arrJiShu2.push(parseInt(newArr[j])*2);
        }
        else //偶数位
        arrOuShu.push(newArr[j]);
    }
     
    var jishu_child1=new Array();//奇数位*2 >9 的分割之后的数组个位数
    var jishu_child2=new Array();//奇数位*2 >9 的分割之后的数组十位数
    for(var h=0;h<arrJiShu2.length;h++){
        jishu_child1.push(parseInt(arrJiShu2[h])%10);
        jishu_child2.push(parseInt(arrJiShu2[h])/10);
    }        
     
    var sumJiShu=0; //奇数位*2 < 9 的数组之和
    var sumOuShu=0; //偶数位数组之和
    var sumJiShuChild1=0; //奇数位*2 >9 的分割之后的数组个位数之和
    var sumJiShuChild2=0; //奇数位*2 >9 的分割之后的数组十位数之和
    var sumTotal=0;
    for(var m=0;m<arrJiShu.length;m++){
        sumJiShu=sumJiShu+parseInt(arrJiShu[m]);
    }
     
    for(var n=0;n<arrOuShu.length;n++){
        sumOuShu=sumOuShu+parseInt(arrOuShu[n]);
    }
     
    for(var p=0;p<jishu_child1.length;p++){
        sumJiShuChild1=sumJiShuChild1+parseInt(jishu_child1[p]);
        sumJiShuChild2=sumJiShuChild2+parseInt(jishu_child2[p]);
    }      
    //计算总和
    sumTotal=parseInt(sumJiShu)+parseInt(sumOuShu)+parseInt(sumJiShuChild1)+parseInt(sumJiShuChild2);
     
    //计算Luhm值
    var k= parseInt(sumTotal)%10==0?10:parseInt(sumTotal)%10;        
    var luhm= 10-k;
     
    if(lastNum==luhm){
    	return true;
    }
    else{
    	return false;
    }        
}

// 显示提示信息
var win=function(str,num){
	$('.win > span').text(str);
	var disappearTime=parseInt(str.length/3)*500+1000;
	$('.win').css('display','block').fadeOut(num==null?disappearTime:num);
};

// 清空已输入的数据

var clear=function(){
	$('.mask input').val("");
};

/**
*根据银行卡号获取发卡行名称
*/
var getBankName = function (bankCard) {
            if (bankCard == null || bankCard == "") {
                return "";
            }
            $.ajax({
            	url: ctx+"/allstyle/newEditionSkin/js/withdraw/bankData.json",
            	type: "post",
				dataType: "json",
            	success: function(data){
            		
            		var bankBin = 0;
		            var isFind = false;
		            for (var key = 10; key >= 2; key--) {
		                bankBin = bankCard.substring(0, key);
		                $.each(data, function (i, item) {
		                    if (item.bin == bankBin) {
		                        isFind = true;
		                        $('#bankDeposits').val(item.bankName);
		                    }
		                });
		            }
		            if (!isFind) {
		                win("未知发卡银行,请输入发卡银行名称");
		            }
            	},
            	error: function(){
            		 win("网络服务忙,请稍后再试····");
            	}
            });
        }
/* 修改截取小数后两位原型方法 */
Number.prototype.toFixed2=function (){
	return parseFloat(this.toString().replace(/(\.\d{2})\d+$/,"$1"));
}
/* 修改截取小数后两位原型方法 */