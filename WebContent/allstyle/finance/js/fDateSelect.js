var reg = /^(((13[0-9]{1})|(14[4-7]{1})|(15[0-9]{1})|(170)|(17[1-8]{1})|(18[0-9]{1}))+\d{8})$/;// 手机号码判断正则

window.onload=function(){
	
	
	/* 正则 */
	var numReg = new RegExp("^[0-9]*$"); 
	/* 正则 */

	/* 方法调用 */
//	getTxInfo();
	getPageAll();
	getDlWithdrawList();
	/* 方法调用 */
	/*$('.user_phone').hover(function(){
		$('.menu').css('display','block');
	},function(){
		$('.menu').css('display','none');
	});*/

	//展开收起左侧菜单
	$('.module').click(function(){
		shouzhan();
	});
	$('.incline').click(function(){
		shouzhan();
	});
	/*$('#leftNav').mouseout(function(){
		$('#leftNav').addClass('on');
		$('.inBtn').addClass('on');
		return false;
	});*/
	//结算比例Tab
	$('.tab > span').click(function(){
		var n = $('.tab > span').index(this);
		changeOn($('.tab > span'),n)
		$('.contList').css('display','none');
		if(n==0){
			$('.neiro').css('display','none');
			$('.daili').css('display','block');
		}else{
			$('.daili').css('display','none');
			$('.neiro').css('display','block');
		}
	});
	
	//选项卡
	$('.ptab > span').click(function(){
		var n = $(this).index();
		changeOn($('.ptab > span'),n);
		switch (n){
			case 0:$('.contList').css('display','none');$('.agency_notAudit').css('display','table');break;
			case 1:$('.contList').css('display','none');$('.agency_notPay').css('display','table');break;
			case 2:$('.contList').css('display','none');$('.agency_endPay').css('display','table');break;
			case 3:$('.contList').css('display','none');$('.by_appeal').css('display','table');break;
		}
	});

	//批量结算比例修改
	$('.batch').click(function(){
		$('.batchList').css('display','block');
		var n = $('.contList > tbody > tr').length;
		//console.log(n);
		if(n<=2){
			$('.batchList').css('top','40px');
		}else{
			$('.batchList').css('top','-270px');
		}
		$('.batchList').css('display','block');
		return false;
	});
	$('.batchList li').click(function(){
		var n = $('.batchList li').index(this);
		var str = $('.batchList li').eq(n).text();
		$('.batch').val(str);
		$('.batchList').css('display','none');
	});

	$('.ratio').click(function(){
		var n = $('.ratio').index(this);
		if(n>1){
			$('.raList').eq(n).css('top','-215px');
		}
		$('.raList').css('display','none').eq(n).css('display','block');

		$('.raList > li').unbind('click');
		$('.raList > li').click(function(){
			var str = $(this).text();
			//console.log(str,n);
			$('.ratio').eq(n).val(str);
		});
		return false;
	});
	
	/* 修改结算比例 */
	//修改结算比例按钮
	$('.pass').click(function(){
		var n = $('.pass').index(this);
		//console.log(n)
		$('.paBox').css('display','none').eq(n).css('display','block');

		$('.pqd').unbind('click');
		//修改结算比例确定按钮
		$('.pqd').click(function(){
			//var n = $('.cqd').index(this);
			//var str = $('.cinp').eq(n).val();
			//console.log(str)
			
			$('.paBox').css('display','none');
			//$('.crBox input').val('');
		});
		return false;
	});
	
	
	$('.pqx').click(function(){
		$('.paBox').css('display','none');
	});
	$('.paBox').click(function(){return false;});
	//-----------------------------
	$('.subProof').click(function(){
		var n = $('.subProof').index(this);
		$('.suBox').css('display','none').eq(n).css('display','block');
		$('.sqd').click(function(){
			//var n = $('.cqd').index(this);
			//var str = $('.cinp').eq(n).val();
			//console.log(str)
			
			$('.suBox').css('display','none');
			//$('.crBox input').val('');
		});
		return false;
	});

	$('.sqx').click(function(){
		$('.suBox').css('display','none');
	});

	$('.suBox').click(function(){return false;});
	/* 修改结算比例 */

	/* 全选按钮 */
	$("input[name='chkSelectAll']").click(function () {
		if ($(this).attr("checked")) {
			$("input[name='chkSelectAll']").attr("checked", "checked");
			$("input[name='chkSelect']").attr("checked", "checked");
		}
		else {
			$("input[name='chkSelectAll']").attr("checked", null);
			$("input[name='chkSelect']").attr("checked", null);
		}
	});
	/* 全选按钮 */

	$('body').click(function(){
		$('.batchList').css('display','none');
		$('.raList').css('display','none');
		$('.paBox').css('display','none');
		$('.suBox').css('display','none');
	});

	/* 上传图片按钮 */
	$('.upLoad').click(function(){
		upImg();
	});
	/* 上传图片按钮 */


	//显示被申诉原因
	$('.psuyy').hover(function(){
		var n = $('.psuyy').index(this);
		$('.suYy').eq(n).css('display','block');
	},function(){
		$('.suYy').css('display','none');
	});

	/* 查询按钮 */
	$('.dlSelect').click(function(){
		var str = $('.query input').val();
//		if(str==''){
//			return;
//		}
		if(!reg.test(str)){
			$(".win>span").html("请输入正确的商户账号");
			winHint();
			return;
		}
		getTxInfo(str);
	});
	/* 查询按钮 */
	
	

	/* 选择月份 */
	$('.dateQuery').click(function(){// 
		var str = $('.query input').val();
		if(!reg.test(str)){
			$(".win>span").html("请输入商户账号后查询");
			winHint();
			return;
		}
		var sdate = $('.date.daili input').eq(0).val();
		var edate = $('.date.daili input').eq(1).val();
//		getTxInfo(str?str:null);
		$.ajax({
			type: 'post',
			url: ctx + "/SettlementRatio/getWithdrawList",
			data: {
				userId: str,
				startDate: sdate,
				endDate: edate,
				indexPage : 1
			},
			success: function(data){
				if(data=="loseSession"){
					 window.location.href=ctx+"/toLogin";
					 return;
				}	 
				dataForHtml(data);
				getPageAll();
			}
		});
	});
	/* 选择月份 */
	//TODO 跳转页面触发
	$('.skip').click(function() {
		var n = parseInt($('.page_to').val());
		if (n > 0 && n <= $('.gong').attr('data-zong')) {
			if (n != $('.num.on').text()) {
				pageNum(n);
			}
		}
		$('.page_to').val('');
	});
	/* 跳转到某页 */
}

// 展开收起左侧菜单
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
// changeon修改on
function changeOn(obj,n){
	obj.removeClass('on').eq(n).addClass('on');
}

/* 分页方法 */

//获取总页数方法
function getPageAll(){// 
	$("#pages").css("display","block");
	var str = $('.query input').val();
	var sdate = $('.date.daili input').eq(0).val();
	var edate = $('.date.daili input').eq(1).val();
	$.ajax({
		type: 'post',
		url: ctx + "/SettlementRatio/getWithdrawPageNum",//getWithdrawPageNum
		data:{
			userId: str,
			startDate: sdate,
			endDate: edate
		},
		success: function(data){
			data=JSON.parse(data);
			if(data.data==0)$("#pages").css("display","none");
			else{
				/*分页*/
				pages(
					data.data,
					function (currentPage){
						var str = $('.query input').val();
						var sdate = $('.date.daili input').eq(0).val();
						var edate = $('.date.daili input').eq(1).val();
						getDlWithdrawList(str,sdate,edate,currentPage);
					});
				}
			}
//				var num = data.data>5?parseInt(data.data/5):1;
//				for(var i=1;i<=num;i++){//
//					if(i==1){
//						htmls += '<a href="javascript:pageNum(1)" class="num on">1</a>';
//						//console.log(htmls)
//					}else{
//						htmls += '<a href="javascript:pageNum('+i+')" class="num">'+i+'</a>';
//					}
//				}
//				$('.page_next').before(htmls);
//				$('.gong').text('共'+num+'页').attr('data-zong',num);//
//				numDisp(0);
//			}
//		}
	});
	/*$.ajax({
		type:'post',  
        url : 'http://1.wxtoupiao.applinzi.com/jsonp.php?loginuser=lee&loginpass=123456&callback=1',  
        dataType : 'jsonp',
        jsonp:"jsoncallback",
        success  : function(data) {
            alert("用户名："+ data.user +" 密码："+ data.pass);
        },
        error : function() {
            alert('fail');
        } 
	});*/
}
//切换当前页
function pageNum(n){//TODO
	$('.num').removeClass('on').eq(n-1).addClass('on');
	var str = $('.query input').val();
	var sdate = $('.date.daili input').eq(0).val();
	var edate = $('.date.daili input').eq(1).val();
	getDlWithdrawList(str,sdate,edate,n);
	numDisp(n-1);
}
//显示隐藏
function numDisp(n){
	if(n==0){
		$('.num').css('display','none');
		$('.num').eq(0).css('display','inline-block');
		$('.num').eq(1).css('display','inline-block');
		$('.num').eq(2).css('display','inline-block');
		$('.num').eq(3).css('display','inline-block');
	}else if(n==$('.num').length-1){
		$('.num').css('display','none');
		$('.num').eq(n-3).css('display','inline-block');
		$('.num').eq(n-2).css('display','inline-block');
		$('.num').eq(n-1).css('display','inline-block');
		$('.num').eq(n).css('display','inline-block');
	}else if(n==$('.num').length-2){
		$('.num').css('display','none');
		$('.num').eq(n-1).css('display','inline-block');
		$('.num').eq(n).css('display','inline-block');
		$('.num').eq(n+1).css('display','inline-block');
		$('.num').eq(n-2).css('display','inline-block');
	}else{
		$('.num').css('display','none');
		$('.num').eq(n-1).css('display','inline-block');
		$('.num').eq(n).css('display','inline-block');
		$('.num').eq(n+1).css('display','inline-block');
		$('.num').eq(n+2).css('display','inline-block');
	}
}
//点上一页下一页
function page(str){
	var strr = $('.query input').val();
	var sdate = $('.date.daili input').eq(0).val();
	var edate = $('.date.daili input').eq(1).val();
	if(str){
		var dang = $('.num.on').text()-0;
		var n = $('.num').length;
		if(dang==n){
			return false;
		}
		pageNum(dang+1);
//		getDlWithdrawList(strr,sdate,edate,dang+1);
	}else{
		var n = $('.num.on').text()-0;
		if(n==1){
			return false;
		}
		pageNum(n-1);
//		getDlWithdrawList(strr,sdate,edate,n-1);
	}
}

/* 分页方法 */


/* 获取提现信息方法 */
function getTxInfo(sid){//
	$.ajax({
		type: 'post',
		url: ctx + "/SettlementRatio/getWithdrawInfo",
		data: {
			userId: sid
		},
		success: function(data){
			if(data=="loseSession"){
				 window.location.href=ctx+"/toLogin";
				 return;
			}	 
			data = JSON.parse(data);
			if(data.code==200){
				console.log(data.data.realName);
				$('.daili .tabNr span').eq(0).text(data.data.real_name)
				$('.daili .tabNr span').eq(1).text(parseFloat(data.data.platform_income).toFixed2(2)+parseFloat(data.data.offline_income).toFixed2(2)-parseFloat(data.data.account_refund).toFixed2(2));
				$('.daili .tabNr span').eq(2).text(data.data.withdraw_time);
			}
		},
		error: function(){
			alert('fail')
		}
	});
}
/* 获取提现信息方法 */

/* 获取代理商提现记录数据 */
function getDlWithdrawList(str,sdate,edate,n){//
	if(!sdate){
		sdate = "";
	}
	if(!edate){
		edate = "";
	}
	if(!n){
		n = 0
	}
	
	$.ajax({
		type: 'post',
		url: ctx + "/SettlementRatio/getWithdrawList",
		data: {
			userId: str,
			startDate: sdate,
			endDate: edate,
			pageIndex: n?n:null,
		},
		success: function(data){
			dataForHtml(data);
		}
	});
}
/* 获取代理商提现记录数据 */

/* 渲染数据方法 */
function dataForHtml(data){
	data = JSON.parse(data);
	if(data.code==200){
		var htmls = '';
		var wWidth = document.body.clientWidth; 
		if(wWidth>1292){
			var lh = 40;
		}else{
			var lh = 18;
		}
		for(var i=0;i<data.data.length;i++){
			htmls+='<li><span>'+(data.data[i].realName=="null"?"未知":data.data[i].realName)+'</span><span>'+parseFloat(data.data[i].accountIncome).toFixed2(2)+'</span><span>'+parseFloat(data.data[i].accountPlatformIncome).toFixed2(2)+'</span><span>'+parseFloat(data.data[i].accountOfflineIncome).toFixed2(2)+'</span><span>'+parseFloat(data.data[i].accountRefund).toFixed2(2)+'</span><span>'+(parseFloat(data.data[i].chargeRate)*parseFloat(data.data[i].accountIncome)).toFixed2(2)+'</span><span>'+parseFloat(data.data[i].accountBalanceAfter).toFixed2(2)+'</span><span style="line-height: '+lh+'px" data-time="'+data.data[i].startTime+'.'+data.data[i].endTime+'">'+data.data[i].startTime.substring(0,10).replace(/-/g,'.')+'-'+data.data[i].endTime.substring(0,10).replace(/-/g,'.')+'</span><span><button data-usId="'+data.data[i].userId+'" class="downLoadInfo">下载账单详情</button></span></li>';
		}
		$('.daili .byList').html(htmls);
		//test TODO
		$('.downLoadInfo').unbind('click');
		$('.downLoadInfo').click(function(){
			var n = $('.downLoadInfo').index(this);
			var userId = $('.downLoadInfo').eq(n).attr('data-usId');
			var ndate = $('.daili .byList > li').eq(n).find('span').eq(7).attr('data-time');
			var dateArr = ndate.split('.');
			console.log(dateArr);
//			var startDate = dateArr[0];
//			var endDate = dateArr[1];
			var startDate = "2015-05-05";
			var endDate ="2016-07-30";
			window.open( ctx + "/SettlementRatio/getWithdrawDetail?userId="+userId+"&startDate="+startDate+"&endDate="+endDate);
		})
	}
}
/* 渲染数据方法 */


/* 修改截取小数后两位原型方法 */
Number.prototype.toFixed2=function (){
	return parseFloat(this.toString().replace(/(\.\d{2})\d+$/,"$1"));
}
/* 修改截取小数后两位原型方法 */