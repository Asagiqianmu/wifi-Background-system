var phoneReg = /^(((13[0-9]{1})|(14[4-7]{1})|(15[0-9]{1})|(170)|(17[1-8]{1})|(18[0-9]{1}))+\d{8})$/;// 手机号码判断正则
var falg=true;
var isok=true;
var mssg="";
var sindex = 0;
var rand = Math.random();

var local = {
	onLine :'online', // 本地 在线用户 键名
	regUser: 'regUser', // 本地 注册用户and付费用户 键名
	noPay : 'noPay',  // 本地 注册未充值用户 键名
	runOff : 'runOff',	// 本地 流失用户 键名
	autonym : 'autonym' // 本地 实名认证 键名
};
var date={
	online: new Date().getTime(),	
	regUser1: new Date().getTime(),	
	regUser2: new Date().getTime(),	
	noPay: new Date().getTime(),	
	runOff: new Date().getTime(),	
	autonym: new Date().getTime(),	
}; 
var pageCount = {
	onLine : 'onlineCount',
	regUser : 'regUser',
	noPay : 'noPayCount',
	runOff : 'runOffCount',
	autonym : 'autonymCount'
};


window.onload=function(){
	init();

	/* 事件绑定 */

	$('.wh_ts').hover(function(){
		$(this).next().css('display','block');
	},function(){
		$(this).next().css('display','none');
	});
	/* 退出按钮*/
	$('.menu > li.exit').click(function(){
		window.location.href=ctx+"/logOut";
	});
	/*个人中心*/
	$('.menu > li.personageCenter').click(function(){
		window.location.href=ctx+"/personalCenter/toPersonalCenter";
	});

	if(state==1){
		$(".imgShow").css("display","none");
		$('.cn_table span').removeClass('on').eq(4).addClass('on');
		$('.user_table').css('display','none');
		$('.us_query').css('display','none');
		$('.l_user_table').css('display','block');
		$('.l_us_query').css('display','block');
		$('.sn_user_table').css('display','none');
		$('.s_us_query').css('display','none');
		$('.l_num').css('display','block');
		$('.w_user_table').css('display','none');
		$('.s_user_table').css('display','none');
		$('.s_num').css('display','none');
		$('.in_user_table').css('display','none');
		$(".nameby").val("");
		$(".fn_select span").text("全部");
		$(".fn_select span").attr("siteId","");
		$(".addUserBtn").css("display","none");
		getRunOfflist(1);//获取流失人数
		getRunOffAcount();//获取流失人数总页数
	}
	/********用户累计时长的操作*********/
	//用户累计时长点击查询
	$('#a_btn').click(function() {
		//开始时间
		var startDate =$('#sTime1').val();
		//结束时间
		var endDate =$('#ueTime').val();
		var userName=$('#userNameTotal').val();
	    findUserTotalTime(startDate,endDate,1);
	});
	//用户输入手机号检索数据
	$('#qu_btn_total').click(function() {
		var obj = document.getElementById("select_bs"); //定位id
		var index = obj.selectedIndex; // 选中索引
		var siteId = obj.options[index].value; // 选中值
		//开始时间
		var startDate =$('#sTime1').val();
		//结束时间
		var endDate =$('#ueTime').val();
		var userName=$('#userNameTotal').val();
		if(!phoneReg.test(userName)){
			msg("请输入正确的用户名",false);
			return;
		}
	    findUserTotalTime(siteId,userName,startDate,endDate,1);
	});
	
	/*********用户累计时长的分页**************/
	$('#cloudpage .page_pre').unbind('click').click(function(){//上一页
		//开始时间
		var startDate =$('#sTime1').val();
		//结束时间
		var endDate =$('#ueTime').val();
		var userName=$('#userNameTotal').val();
		var dang = $('#cloudpage .page_cont > i').eq(0).text();
		if(dang!=1){
			dang--;
		}
		$('#cloudpage .page_cont > i').eq(0).text(dang);
		//调用查询
		findUserTotalTime(startDate,endDate,dang);
	});

	$('#cloudpage .page_next').unbind('click').click(function(){//下一页
		//开始时间
		var startDate =$('#sTime1').val();
		//结束时间
		var endDate =$('#ueTime').val();
		var userName=$('#userNameTotal').val();
		var dang = $('#cloudpage .page_cont > i').eq(0).text();
		if(dang!=$('#cloudpage .page_cont > i').eq(1).text() && $('#cloudpage .page_cont > i').eq(1).text() != 0){
			dang++;
		}
		firstDisp(dang);
		$('#cloudpage .page_cont > i').eq(0).text(dang);
		//调用查询
		findUserTotalTime(startDate,endDate,dang);
	});

	$('#cloudpage .page_last').unbind('click').click(function(){//尾页按钮
		//开始时间
		var startDate =$('#sTime1').val();
		//结束时间
		var endDate =$('#ueTime').val();
		var userName=$('#userNameTotal').val();
		$('#cloudpage .page_cont > i').eq(0).text($('#cloudpage .page_cont > i').eq(1).text());
		$('#cloudpage .page_first').show();
		$('#cloudpage .page_last').hide();
		//调用查询
		findUserTotalTime(startDate,endDate,$('#cloudpage .page_cont > i').eq(0).text());
	});

	$('#cloudpage  .page_first').unbind('click').click(function(){//首页按钮
		//开始时间
		var startDate =$('#sTime1').val();
		//结束时间
		var endDate =$('#ueTime').val();
		var userName=$('#userNameTotal').val();
		$('#cloudpage .page_first').hide();
		$('#cloudpage .page_last').show();
		$('#cloudpage  .page_cont > i').eq(0).text(1);
		findUserTotalTime(startDate,endDate,1);
	});

	$('#cloudpage  .skip').unbind('click').click(function(){//跳转到某页
		//开始时间
		var startDate =$('#sTime1').val();
		//结束时间
		var endDate =$('#ueTime').val();
		var userName=$('#userNameTotal').val();
		var n = parseInt($('#cloudpage   .page_to').val()==""?1:$('#cloudpage   .page_to').val());
		if(n==''||n<1||n>$('#cloudpage  .page_cont > i').eq(1).text()){
			$('#cloudpage  .page_to').val('');
			return;
		}
		$('#cloudpage  .page_cont > i').eq(0).text(n);
		$('#cloudpage  .page_to').val('');
		findUserTotalTime(startDate,endDate,n);
	});

	$('#cloudpage  .page_to').unbind('keypress').keypress(function(e){//跳转到某页回车事件
		//开始时间
		var startDate =$('#sTime1').val();
		//结束时间
		var endDate =$('#ueTime').val();
		var userName=$('#userNameTotal').val();
		if(e.keyCode==13){
			var n = parseInt($('#cloudpage  .page_to').val()==""?1:$('#cloudpage   .page_to').val());
			if(n==''||n<1||n>$('#cloudpage   .page_cont > i').eq(1).text()){
				$('#cloudpage   .page_to').val('');
				return;
			}
			$('#cloudpage   .page_cont > i').eq(0).text(n);
			$('#cloudpage   .page_to').val('');
			findUserTotalTime(startDate,endDate,n);
		}
	});
    /* 用户累计时长的分页 */
	
	
	
	/********用户累计时长的操作*********/
	/*导出excel*/
	$(".big").click(function(){
		var siteId=$(".l_us_query .fn_select span").attr("siteid")==undefined?'':$(".l_us_query .fn_select span").attr("siteid");
		if(siteId==""){
			msg('请选择场所',true);
			return;
		}
		var startTime=$("#sTime").val()==undefined?'':$("#sTime").val();
		var endTime=$("#eTime").val()==undefined?'':$("#eTime").val();
		if(startTime==""&&endTime==""){
			msg('导出时请至少选择一个时间段',true);
			return;
		}
		if(startTime!=""&&endTime!=""){
			if(getDays(startTime,endTime)>31){
				msg('导出时间仅限一个月之内',true);
				return;
			}
		}
		if(startTime==""&&endTime!=""){
			startTime=addDate(endTime,1);
		}else if(startTime!=""&&endTime==""){
			endTime=addDate(startTime,0);
		}
		window.location.href=ctx+"/siteCustomer/exportExport?siteId="+siteId+"&startTime="+startTime+"&endTime="+endTime;
	});	
	/* 关闭查看大图 */
	$('.close').click(function(){
		$('.mask').css('display','none');
		$('.us_card').css('display','none');
	});
	/* 关闭查看大图 */

	/* 选择性别 */
	$('.sex i').click(function(){
		$('.sex i').removeClass('on').eq($('.sex i').index(this)).addClass('on');
	});
	/* 选择性别 */

	/* 新增用户按钮 */
	$('.addUserBtn').click(function(){
		$('.add_user input').val('');
		$('.mask').css('display','block');
		$('.add_user').css('display','block');
		
	});
	/*校验手机号是否注册*/
	$('#cj_phone').bind('input propertychange',function(){
		var userName=$("#cj_phone").val().trim();
		if($("#cj_phone").val().length==11&&phoneReg.test($("#cj_phone").val())){
			$.ajax({
				type:"post",
				url:ctx+"/siteCustomer/checkUser",
				data:{
					userName:userName
				},
				success:function(data){
					eval("data="+data);
					if(data.code==201){
						falg=false;
						msg(data.msg,false);
					}else{
						falg=true;
					}
				}
			})
			
		}
		
	});
	/*重置*/
	$(".rebeat").click(function(){
		$("#sTime").val("");
		$("#eTime").val("");
		getRunOfflist(1);//获取流失人数
		getRunOffAcount();//获取流失人数总页数
	})
	/*流失用户查询*/
	$(".date_query").click(function(){
		$(".imgShow").css("display","none");
		getRunOfflist(1);//获取流失人数
		getRunOffAcount();//获取流失人数总页数
	})
	/*取消提示按钮*/
	$('.dhqx_btn').click(function(){// 对话框取消事件
		$('.mask').css('display','none');
		$('.dhk').css('display','none');
	});
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
	
	
	/* 下拉列表方法 */

	/* 事件绑定 */
}

function init(){
	$('.user_table').css('display','none');
	$('.us_query').css('display','none');
	$('.l_user_table').css('display','none');
	$('.l_us_query').css('display','none');
	$('.sn_user_table').css('display','block');
	$('.s_us_query').css('display','block');
	$('.l_num').css('display','none');
	$('.w_user_table').css('display','none');
	$('.s_user_table').css('display','none');
	$('.s_num').css('display','none');
	$('.in_user_table').css('display','none');
	$(".nameby").val("");
	$(".fn_select span").text("全部");
	$(".fn_select span").attr("siteId","");
	$(".addUserBtn").css("display","none");
	var startDate =$('#sTime1').val();
	//结束时间
	var endDate =$('#ueTime').val();
	findUserTotalTime(startDate,endDate,1);
	$(".imgShow").css("display","none");
//	if(state==1){
//		getRunOfflist(1);//获取流失人数
//		getRunOffAcount();//获取流失人数总页数
//	}else{
//		getOnLineList(1);//获取在线人数
//		getOnLineCount();//获取在线人数总页数
//	}	
}
function make(){
	/* 充值按钮 */
	$(".toPay").unbind("click");
	$('.toPay').click(function(){
		$('.mask').css('display','block');
		$('.pay').css('display','block');
		$("#p_num").val("1");
		sindex = $('.toPay').index(this);
		var username = $(this).parent().parent().find('span').eq(0).text();
		var siteId=$(this).parent().parent().attr('value');
		$.ajax({
			type:"post",
			url:ctx+"/siteCustomer/getPaymentType",
			data:{
				siteId :siteId,
				userName: username
			},
			success:function(data){
				eval("data="+data);
				var htmls="";
				for(var i=0;i<data.data.length;i++){
					 var sitePrice = data.data[i];
					 htmls += "<li siteid='"+data.data[i].site_id+"' value='"+data.data[i].id+"' priceType='"+data.data[i].price_type+"' addNum='"+data.data[i].giveMeal+"' descript='"+data.data[i].describe+"' addUnit='"+data.data[i].giveMealUnit+"' prices='"+data.data[i].unit_price+"' priceNum='"+data.data[i].price_num+"'>" + data.data[i].name +"</li>";
				}
				$(".pay>.payType>ul").html(htmls);
				$(".pay>.payType>ul li").eq(0).addClass("on");
				$(".pay>.payType>#p_type").html(data.data[0].name);
				$(".pay>.payType>#p_type").attr('value',data.data[0].unit_price);
				$(".pay_user span").text(username);
				$('.payType ul > li').unbind('click');
				$('.payType ul > li').click(function(){ 
					var str = $(this).text();
					$(this).parent().prev().text(str);
					$(this).parent().prev().attr('value',$(this).attr("prices"));
					$(this).parent().css('display','none');
					var n= $(".payType ul > li").index(this);
					$(".payType ul > li").removeClass("on").eq(n).addClass("on");
					
					sumMoney();
				});
				sumMoney();
			}
		
		})
	});
	/* 充值按钮 */

	/* 确定充值按钮 */
	$(".lj_pay").unbind("click");
	$('.lj_pay').click(function(){
		var siteId=$(".payType ul > .on").attr("siteid");//场所id
		var userName=$(".pay_user span").text();
		var paytype=$(".payType ul > .on").attr("value");
		var amount=$("#p_allNum").text();
		var buyNum=$("#p_num").val();
		var payName=$(".payType ul > .on").html();
		var priceNum=$(".payType ul > .on").attr("pricenum");
		var giveNum=$(".payType ul > .on").attr("addnum");
		var giveUnit=$(".payType ul > .on").attr("addunit");
		var priceType=$(".payType ul > .on").attr("pricetype");
		var mealType=1;
		if(priceType>3){
			mealType=2;
		}
		if(buyNum==''||buyNum==null||buyNum==undefined||buyNum==0){
			msg("请输入购买数量",false);
		}
		$.ajax({
			type: 'post',
			url: ctx+"/siteCustomer/updateCustomerPay",
			data: {
				siteId: siteId,
				username: userName,
				configId: paytype,
				amount: amount,
				buyNum: buyNum,
				payName: payName,
				priceNum: priceNum,
				giveNum: giveNum,
				giveUnit:giveUnit,
				mealType:mealType
				
			},
			success: function(data){
				data = JSON.parse(data);
				if(data.code==200){
					var tablelist=$(".cn_table .on").text();
					$('.mask').css('display','none');
					$('.pay').css('display','none');
					msg('充值成功',true);
					if(tablelist=="付费用户"){
						$('.ta_list > li').eq(sindex).find('span').eq(1).find("span").eq(mealType==1?0:1).text(mealType==1?data.data:data.data/1024);
						$('.ta_list > li').eq(sindex).find('span').eq(2).find("span").text(parseFloat(amount).toFixed2(2));
						$('.ta_list > li').eq(sindex).find('span').eq(4).text(parseFloat(amount).toFixed2(2));
						var moneyl = parseFloat($('.ta_list > li').eq(sindex).find('span').eq(5).text())+parseFloat(amount);
						$('.ta_list > li').eq(sindex).find('span').eq(5).text(moneyl.toFixed2(2));
						var sum = parseInt($('.ta_list > li').eq(sindex).find('span').eq(6).text());
						$('.ta_list > li').eq(sindex).find('span').eq(6).text(++sum);
						sessionStorage.removeItem(local.regUser+2);

					}else if(tablelist=="注册用户"){
						$('.ta_list > li').eq(sindex).find('span').eq(2).text(parseFloat(amount).toFixed2(2));
						var moneyl = parseFloat($('.ta_list > li').eq(sindex).find('span').eq(3).text())+parseFloat(amount);
						$('.ta_list > li').eq(sindex).find('span').eq(3).text(moneyl);
						var sum = parseInt($('.ta_list > li').eq(sindex).find('span').eq(4).text());
						$('.ta_list > li').eq(sindex).find('span').eq(4).text(++sum);
						sessionStorage.removeItem(local.regUser+1);
					}else{
						$('.ta_list > li').eq(sindex).find('span').eq(2).text(parseFloat(amount).toFixed2(2));
						var moneyl = parseFloat($('.ta_list > li').eq(sindex).find('span').eq(3).text())+parseFloat(amount);
						$('.ta_list > li').eq(sindex).find('span').eq(3).text(moneyl);
						var sum = parseInt($('.ta_list > li').eq(sindex).find('span').eq(4).text());
						$('.ta_list > li').eq(sindex).find('span').eq(4).text(++sum);
						sessionStorage.removeItem(local.onLine);
					}
					
					
				}else if(data.code==201){
					$('.mask').css('display','none');
					$('.pay').css('display','none');
					msg(data.msg,false);
				}else if(data.code==202){
					$('.mask').css('display','none');
					$('.pay').css('display','none');
					msg(data.msg,false);
				}
			}
		});
	});
	/* 确定充值按钮 */

	/* 取消充值按钮 */
	$('.qx_pay').unbind("click");
	$('.qx_pay').click(function(){
		$('.mask').css('display','none');
		$('.pay').css('display','none');
		$(".p_num").val("1");
		sumMoney();
		
	});
	/* 取消充值按钮 */
	/*故障恢复*/
	$(".block").click(function(){
		var username = $(this).parent().parent().find('span').eq(0).text();
		var siteId=$(this).parent().parent().attr('value');
		dhkalt("是否恢复故障",function(){
			$.ajax({
				type:"post",
				url:ctx+'/siteCustomer/updateUserOut',
				data:{
					userName:username,
				},
				success:function(data){
					eval("data="+data);
					if(data.code==200){
						getOnLineList(1);//获取在线人数
						getOnLineCount();//获取在线人数总页数
						msg(data.msg,true);
					}else if(data.code==201){
						msg(data.msg,false);
					}
				}
			});
		});
		
	});
	/* 解锁按钮 */
	$('.clear').unbind('click');
	$('.clear').click(function(){
		var n = $('.clear').index(this);
		var username = $('.ta_list > li').eq(n).find('span').eq(0).text();
		var siteId=$('.ta_list > li').eq(n).attr("value");
		dhkalt("您确定解锁该用户的账户?",function(){
			$.ajax({
				type:"post",
				url:ctx+'/siteCustomer/unLock',
				data:{
					userName:username,
					siteId:siteId
				},
				success:function(data){
					eval("data="+data);
					if(data.code==200){
						msg(data.msg,true);
					}else if(data.code==201){
						msg(data.msg,false);
					}
				}
			})
		})
		
	});
	

	/* 停用按钮 */
	$('.ty').unbind('click');
	$('.ty').click(function(){
		var n = $('.ty').index(this);
		var username = $('.ta_list > li').eq(n).find('span').eq(0).text();
		var str= $('.ta_list > li>.t7').eq(n).find('i').eq(2).text();
		var strs='';
		var state=0;
		if(str=="启用"){
			strs="您确定启用该用户账户";
		}
		if(str=="停用"){
			strs="您确定停用该用户账户";
			state=1;
		}
		var siteId=$('.ta_list > li').eq(n).attr("value");
		dhkalt(strs,function(){
			
			$.ajax({
				type:"post",
				url:ctx+'/siteCustomer/blockUp',
				data:{
					username:username,
					siteId:siteId,
					status:state
				},
				success:function(data){
					eval("data="+data);
					if(data.code==200){
						if(state=="0"){
							var str= $('.ta_list > li>.t7').eq(n).find('i').eq(2).text("停用");
						}
						if(state=="1"){
							var str= $('.ta_list > li>.t7').eq(n).find('i').eq(2).text("启用");
						}
						sessionStorage.removeItem(local.regUser+2);
						msg(data.msg,true);
					}else if(data.code==201){
						msg(data.msg,false);
					}else if(data.code==202){
						msg(data.msg,false);
					}else if(data.code==203){
						msg(data.msg,true);
					}
				}
			})
		});
	})
	/* 停用按钮 */
} 
function sumMoney(){
	var price=$(".pay>.payType>#p_type").attr('value');
	var num=$("#p_num").val();
	if(num==0){
		msg("购买数量不能为零",false);
		return;
	}
	if(num==""||num==undefined||num==null){
		msg("请输入购买数量",false);
		return;
	}
	var sumMoney = parseFloat(price * num);
	$("#p_allNum").text(sumMoney.toFixed2(2));
}


// 请求列表ajax
function listAjax(res,fn) {

	if(res.curPage==1){
		switch (res.type) {
		case local.onLine:
			date.online= new Date().getTime();break;
		case local.regUser+1:
			date['regUser'+1]= new Date().getTime();break;
		case local.regUser+2:
			date['regUser'+2]= new Date().getTime();break;
		case local.noPay:
			date.noPay= new Date().getTime();break;
		case local.runOff:
			date.runOff= new Date().getTime();break;
		case local.autonym:
			date.autonym= new Date().getTime();break;
		}
		
	}
	$.ajax({
		type: 'post',
		url: ctx+res.url,
		data: {
			siteId: res.siteId,
			userName:res.userName,
			curPage:res.curPage,
			rand:res.rand,
			status:res.status,
			startTime:res.startTime,
			endTime:res.endTime,
			times:date[res.type]
		},
		success: function(data){
			if(data=="loseSession"){
				window.location.href=ctx+"/toLogin";
				return;
			}
			//setDataList(data,res.type,res.curPage,res.keyName);
			$('.ta_list li').remove();
			data = JSON.parse(data);
			if(data.code==202){
				sessionStorage.removeItem(res.type);
			}else{
				setDataList(JSON.stringify(data),res.type,res.curPage,res.keyName);

			}
			fn(data,res.status);
		}
	});
}

// 分页ajax
function pageCountAjax(res,fn) {
	$.ajax({
		type: 'post',
		url: ctx+res.url,
		data: {
			siteId: res.siteId,
			userName:res.userName,
			rand:res.rand,
			status:res.status,
			startTime:res.startTime,
			endTime:res.endTime,
		},
		success: function(data){
			if(data=="loseSession"){
				window.location.href=ctx+"/toLogin";
				return;
			}
			data = JSON.parse(data);
			setPageData(data,res.type,res.keyName);
			$(".page_cont i").eq(0).text(data.totoalNum==0?1:1);
			$(".page_cont i").eq(1).text(data.totoalNum);

			if (fn) {
				fn(data)
			}

		}
	});
}

// 是否更新ajax
function isUpdate(type,keyName) {
//	var isUp = false;
	$.ajax({
		type: 'post',
		url: ctx+"/siteCustomer/checkNewJson",
		async:false,
		data: {
			times:date[keyName]-60*1000,
			types:type
		},
		success: function(data){
			eval("data="+data);
			if(data.code==1){
				sessionStorage.removeItem(keyName);
				sessionStorage.removeItem(keyName+"Count");
			}
			//isUp = data;
		}
	});

//	return isUp;
}
 function addDate(date,dats){   
     var d=new Date(date);
     if(dats==1){
    	 d.setMonth(d.getMonth()-1);   
     }else{
    	 d.setMonth(d.getMonth()+1);    
     }
     var month=d.getMonth()+1;   
     var day = d.getDate();  
     if(month<10){  
         month = "0"+month;  
     }  
     if(day<10){  
         day = "0"+day;  
     }  
     var val = d.getFullYear()+"-"+month+"-"+day;   
     return val;  
 }   
 function getDays(strDateStart,strDateEnd){
	 var strSeparator = "-"; //日期分隔符
	 var oDate1;
	 var oDate2;
	 var iDays;
	 oDate1= strDateStart.split(strSeparator);
	 oDate2= strDateEnd.split(strSeparator);
	 var strDateS = new Date(oDate1[0], oDate1[1]-1, oDate1[2]);
	 var strDateE = new Date(oDate2[0], oDate2[1]-1, oDate2[2]);
	 iDays = parseInt(Math.abs(strDateS - strDateE ) / 1000 / 60 / 60 /24)//把相差的毫秒数转换为天数
	 return iDays ;
}

// 保存列表
function setDataList(list,type,page,name) {

	if (sessionStorage[type]) {
		var data = JSON.parse(sessionStorage[type]);
		// data[page] = list;
		if (!data[name]) {
			data[name] = [];
		}

		data[name][page] = list;
		sessionStorage[type] = JSON.stringify(data)
	} else {
		// var NewData = [];
		// NewData[page] = list;
		// console.log(NewData);
		// sessionStorage[type] = JSON.stringify(NewData);

		var NewData = {};
		NewData[name] = [];
		NewData[name][page] = list;
		console.log(NewData);
		sessionStorage[type] = JSON.stringify(NewData);
	}
}

// 取出列表
function getDataList(type,page,name) {
	var temp = sessionStorage[type];
	if (temp) {
		temp = JSON.parse(temp);
		if (temp[name]) {
			if (temp[name][page]) {
				return JSON.parse(temp[name][page])
			}
		}
	}
	return false;
}

// 保存分页
function setPageData(list,type,name) {
	if (sessionStorage[type]) {
		var data = JSON.parse(sessionStorage[type]);
		// data[page] = list;
		data[name] = list;

		sessionStorage[type] = JSON.stringify(data)
	} else {
		// var NewData = [];
		// NewData[page] = list;
		// console.log(NewData);
		// sessionStorage[type] = JSON.stringify(NewData);

		var NewData = {};
		NewData[name] = list;
		console.log(NewData);
		sessionStorage[type] = JSON.stringify(NewData);
	}
}

// 取出分页
function getPageData(type,name) {
	var temp = sessionStorage[type];
	if (temp) {
		temp = JSON.parse(temp);
		if (temp[name]) {
			return temp[name]
		}
	}
	return false;
}

//获取用户的累计时长
function findUserTotalTime(startDate,endDate,curPage){
	$('#cloudpage').hide();
	var d1=new Date(startDate);
	var d2=new Date(endDate);
	if(d1>new Date()){
		msg("请选择正确的时间范围",true);
		return false;
	}
	if(d1>d2){
		$('#total_time_list').html("");
		msg("暂无数据",true);
		return false;
	}
	$.ajax({
		type: 'post',
		url: ctx+'/allSiteOfReportStatistics/getUserOnlineData',
		data: {
			sDate:startDate,
			eDate:endDate,
			curPage:curPage,
			pageSize:10
		},
		success: function(data){
			$('#total_time_list').html("");
			//进行渲染
			data = JSON.parse(data);
                if(data.code == 200){
				var listUserTotalTimeInfo=data.data;
				var htmls = '';
				for(var i=0;i<listUserTotalTimeInfo.length;i++){
					htmls +='<ul class="ls_list_info  ta_list" style="height: 56px;"><li class="sup-li" style="width:13%;">'+listUserTotalTimeInfo[i].create_time+'</li>'
					+'<li style="width:13%;">'+listUserTotalTimeInfo[i].android_homepage_pv+'/'+listUserTotalTimeInfo[i].ios_homepage_pv+'</li>'
					+'<li style="width:13%;">'+listUserTotalTimeInfo[i].android_homepage_uv+'/'+listUserTotalTimeInfo[i].ios_homepage_uv+'</li>'
					+'<li style="width:13%;">'+listUserTotalTimeInfo[i].android_button_pv+'/'+listUserTotalTimeInfo[i].ios_button_pv+'</li>'
					+'<li style="width:13%;">'+listUserTotalTimeInfo[i].android_button_uv+'/'+listUserTotalTimeInfo[i].ios_button_uv+'</li>'
					+'<li style="width:13%;">'+listUserTotalTimeInfo[i].jump_down__page_pv+'</li>'
					+'<li style="width:13%;">'+listUserTotalTimeInfo[i].auth_user_uv+'</ul>';
				}
				//数据渲染
				$('#total_time_list').html(htmls);
				//展示分页
				$('#cloudpage').show();
				//总页数展示
				if(curPage<=1){  $('.page_cont i').eq(0).text(1); $('#count').text(data.totoalNum);}
                }else{
                	msg("暂无数据",true);
                }
			}
	})
}

//防止重复点击
function noRepeatClick(self) {
 self.setAttribute("disabled", true); // 禁止点击
 self.timer = setTimeout(function () {
     self.removeAttribute("disabled");
     clearTimeout(self.timer);
 },1000)
}