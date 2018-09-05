var regmail= /[a-zA-Z0-9]{1,10}@[a-zA-Z0-9]{1,5}\.[a-zA-Z0-9]{1,5}/;
var regtel = /^(((13[0-9]{1})|(14[4-7]{1})|(15[0-9]{1})|(170)|(17[1-8]{1})|(18[0-9]{1}))+\d{8})$/;// 手机号码判断正则
var isFind = false;
window.onload=function(){
	selAccountLog(1,$(".tx_tab>.on").attr("data-status"));
	getWithDrawMoney();
	selAccountLogTotalNum($(".tx_tab>.on").attr("data-status"));
	
	/* 事件绑定 */
	$('.getWithdraw').click(function(){
		//$(this).attr('disabled',true);
		//console.log($(this));
		initHua('register','#dom_id');
		getCard();
	});
	$("#inuser").blur(function(){
		  var name = $("#inuser").val();
		  if(/[^\u4E00-\u9FA5]/g.test(name)){
			  msg('只能输入中文名',false);
			  return false;
		  }
	});
	
	// 退出按钮
	$('.menu > li.exit').click(function(){
		window.location.href=ctx+"/logOut";
	});
	
	$('.menu > li.personageCenter').click(function(){
		window.location.href=ctx+"/personalCenter/toPersonalCenter";
	});
	/*场所类型*/
	$(".collegeType1 ").click(function(){
		$(".collegeType1>ul").css("display","block");
		var n=$('.collegeType1').index(this);
		$(".dev_se>ul").css("display","block");
		return false;
	});
	/*收入明细查询按钮*/
	$(".a_btn").click(function(){
		var slist=$(".cn_table .on").attr("value");
		switch (slist) {
		case "txmx":
			withDrawFlow(1);
			withdrawGetAllPage();
			break;
		case "srmx":
			getSiteIncome(1);
			getPage();
			getTotalAmount();
			break;
		}
		
	})
	
	
	/*充值类型按钮绑定*/
	$('.collegeType').click(function(){
		var n=$('.collegeType').index(this);
		$(".type_se>ul").css("display","block");
		return false;
	});
	$(".sqtx").click(function(){
		$('.mask').css('display','none');
		$('.ask_for').css('display','none');
		clearInterval(time);
		$('.getcode').html('获取验证码');
		$('.getcode').removeAttr("disabled");
		$('.getcode').css('background','#57c6d4');
	});	
	/*申请提现取消按钮*/
	$(".calloff").click(function(){
		$('.mask').css('display','none');
		$('.ask_for').css('display','none');
		clearInterval(time);
		$('.getcode').html('获取验证码');
		$('.getcode').removeAttr("disabled");
		$('.getcode').css('background','#57c6d4');
	});
	/*申请提现确认按钮*/
	$(".calltx").click(function(){
		$(".calltx").css('background','#ccc').attr("disabled",true);
		sumbitWithdraw();
		
		setTimeout(function(){
			$(".calltx").css('background','#57c6d4').attr("disabled",false);
		},3000);
		
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
	/* 分页 */
	$('.page_pre').unbind('click').click(function(){//上一页
		if($('.page_cont > i').eq(0).text()=="1"||$('.page_cont > i').eq(0).text()=="0"){
			return;
		}
		var alldang=$("")
		var dang = $('.page_cont > i').eq(0).text();
		if(dang!=1){
			dang--;
		}
		firstDisp(dang);
		$('.page_cont > i').eq(0).text(dang);
		//执行获取当前页ajax
		var slist=$(".cn_table .on").attr("value");
		switch (slist) {
		case "txsq":
			selAccountLog(dang,$(".tx_tab>.on").attr("data-status"));
			break;
		case "txmx":
			withDrawFlow(dang);
			break;
		case "srmx":
			getSiteIncome(dang);
			break;
		}

	});

	$('.page_next').unbind('click').click(function(){//下一页
		if($('.page_cont > i').eq(1).text()=="1"||$('.page_cont > i').eq(1).text()=="0"){
			return;
		}
		if($('.page_cont > i').eq(0).text()==$('.page_cont > i').eq(1).text()){
			return;
		}
		var dang = $('.page_cont > i').eq(0).text();
		if(dang!=$('.page_cont > i').eq(1).text()){
			dang++;
		}
		firstDisp(dang);
		$('.page_cont > i').eq(0).text(dang);
		//执行获取当前页ajax
		var slist=$(".cn_table .on").attr("value");
		switch (slist) {
		case "txsq":
			selAccountLog(dang,$(".tx_tab>.on").attr("data-status"));
			break;
		case "txmx":
			withDrawFlow(dang);
			break;
		case "srmx":
			getSiteIncome(dang);
			break;
		}

	});

	$('.page_last').unbind('click').click(function(){//尾页按钮
		if($('.page_cont > i').eq(1).text()=="1"||$('.page_cont > i').eq(1).text()=="0"){
			return;
		}
		if($('.page_cont > i').eq(0).text()==$('.page_cont > i').eq(1).text()){
			return;
		}
		$('.page_cont > i').eq(0).text($('.page_cont > i').eq(1).text());
		firstDisp($('.page_cont > i').eq(0).text());
		var slist=$(".cn_table .on").attr("value");
		switch (slist) {
		case "txsq":
			selAccountLog($('.page_cont > i').eq(0).text(),$(".tx_tab>.on").attr("data-status"));
			break;
		case "txmx":
			withDrawFlow($('.page_cont > i').eq(0).text());
			break;
		case "srmx":
			getSiteIncome($('.page_cont > i').eq(0).text());
			break;
		}

	});

	$('.page_first').unbind('click').click(function(){//首页按钮
		if($('.page_cont > i').eq(0).text()=="1"||$('.page_cont > i').eq().text()=="0"){
			return;
		}
	
		$('.page_cont > i').eq(0).text(1);
		firstDisp(1);
		var slist=$(".cn_table .on").attr("value");
		switch (slist) {
		case "txsq":
			selAccountLog(1,$(".tx_tab>.on").attr("data-status"));
			break;
		case "txmx":
			withDrawFlow(1);
			break;
		case "srmx":
			getSiteIncome(1);
			break;
		}
	});

	$('.skip').unbind('click').click(function(){//跳转到某页
		if($('.page_cont > i').eq(0).text()=="1"&&$('.page_cont > i').eq(1).text()=="1"){
			$('.page_to').val("");
			return;
		}
		if($('.page_to').val()==""){
			return;
		}
		var n = parseInt($('.page_to').val());
		if(n==''||n<1||n>$('.page_cont > i').eq(1).text()){
			$('.page_to').val('');
			return;
		}
		$('.page_cont > i').eq(0).text(n);
		firstDisp(n);
		$('.page_to').val('');
		var slist=$(".cn_table .on").attr("value");
		switch (slist) {
		case "txsq":
			selAccountLog(n,$(".tx_tab>.on").attr("data-status"));
			break;
		case "txmx":
			withDrawFlow(n);
			break;
		case "srmx":
			getSiteIncome(n);
			break;
		}

	});

	$('.page_to').unbind('keypress').keypress(function(e){//跳转到某页回车事件
		if($('.page_cont > i').eq(0).text()=="1"&&$('.page_cont > i').eq(1).text()=="1"){
			$('.page_to').val("");
			return;
		}
		if(e.keyCode==13){
			if($('.page_to').val()==""){
				return;
			}
			var n = parseInt($('.page_to').val());
			if(n==''||n<1||n>$('.page_cont > i').eq(1).text()){
				$('.page_to').val('');
				return;
			}
			$('.page_cont > i').eq(0).text(n);
			firstDisp(n);
			$('.page_to').val('');
			var slist=$(".cn_table .on").attr("value");
			switch (slist) {
			case "txsq":
				selAccountLog(n,$(".tx_tab>.on").attr("data-status"));
				break;
			case "txmx":
				withDrawFlow(n);
				break;
			case "srmx":
				getSiteIncome(n);
				break;
			}

		}
	});
	/*按日期查询*/
	$(".seldate").click(function(){
		selAccountLog(1,$(".tx_tab>.on").attr("data-status"));
		selAccountLogTotalNum($(".tx_tab>.on").attr("data-status"));
		
	});
	//资金管理选项卡切换

	$('.cn_table span').click(function(){
		var n = $(this).index();
		$('.cn_table span').removeClass('on').eq(n).addClass('on');
		switch (n){
			case 0: $('.with_info').css('display','block');
					$('.tx_cont').css('display','block');
					$('.tx_list').css('display','block');
					$('.ls_date').css('display','none');
					$('.ls_list').css('display','none');
					$('.mx_box').css('display','none');
					$('.ms_list').css('display','none');
					$('.tx_tab span').removeClass('on').eq(0).addClass('on');
					selAccountLogTotalNum("");
					selAccountLog(1,'');
					break;
			case 1: $('.with_info').css('display','none');
					$('.tx_cont').css('display','none');
					$('.tx_list').css('display','none');
					$('.ls_date').css('display','block');
					$('.ls_list').css('display','block');
					$('.mx_box').css('display','none');
					$('.ms_list').css('display','none');
					withDrawFlow(1);
					withdrawGetAllPage();
					break;
			case 2: $('.with_info').css('display','none');
					$('.tx_cont').css('display','none');
					$('.tx_list').css('display','none');
					$('.ls_date').css('display','none');
					$('.ls_list').css('display','none');
					$('.mx_box').css('display','block');
					$('.ms_list').css('display','block');
					getUserSite();
					getSiteIncome(1);
					getPage();
					getTotalAmount();
					break;
		}
	});

	//限制文本域输入字符数
	var times; //节流计时器
	$('.cause_txt').keyup(function(){
		clearTimeout(times);
		times = setTimeout(function(){
			var ln = $('.cause_txt').val().length;
			if(ln>200){
				$('.cause_txt').val($('.cause_txt').val().substring(0,199));
			}
			$('.xz i').eq(0).text(ln);
		},50);
	});


	//关闭调价详情
	$('.ch_close').click(function(){
		$('.change_info').animate({'right':'-540px'},function(){
			$('.change_info').css('display','none');
			$('.mask').css('display','none');
		});
	});
	//关闭调价详情
	$('.mask').click(function(){
		$('.change_info').animate({'right':'-540px'},function(){
			$('.change_info').css('display','none');
			$('.mask').css('display','none');
		});
	});
	/*确认申诉*/
	$(".ss_qd").unbind("click");
	$(".ss_qd").click(function(){
		var contId=$(".hid").val();
		var status=$(".hsta").val();
		updateWithDrawStu(status,contId);
	})
	//取消申诉
	$('.ss_qx').click(function(){
		$('.mask').css('display','none');
		$('.cause').css('display','none');
		$(".hid").val("");
		$(".hsta").val("");
	});

	//提现 状态选项卡切换
	$('.tx_tab span').click(function(){
		var n = $('.tx_tab span').index(this);
		$('.tx_tab span').removeClass('on').eq(n).addClass('on');
		selAccountLog(1,$(".tx_tab>.on").attr("data-status"));
		selAccountLogTotalNum($(".tx_tab>.on").attr("data-status"));
	});

	// 提现遮罩点击
	$('.ask_mask').click(function(){
		$('.ask_mask').css('display','none');
		$('.add_ask_for').css('display','none');
	});

	//  支付宝银行卡切换
	$('.tx_type i').click(function(){
		var n = $('.tx_type i').index(this);
		$('.tx_type i').removeClass('on').eq(n).addClass('on');
		if(n!=0){
			$('.yh').css('display','none');
			$('.zf').css('display','block');
			$("#inuser").val("");
			$("#bankcarNums").val("");
			$("#bankDeposits").val("");
			$("#banktype").val("");
		}else{
			$('.yh').css('display','block');
			$('.zf').css('display','none');
			$("#zfuser").val("");
			$("#zfcard").val("");
		}
	});

	// 取消添加银行卡
	$('.qx_add').click(function(){
		$('.ask_mask').css('display','none');
		$('.add_ask_for').css('display','none');
	});

	// 确定添加银行卡
	$('.qr_add').click(function(){
		var tj = $('.tx_type i.on').text();
		var state = 0;
		if(tj=='银行卡'){
			var usName = $('.yh input').eq(0).val();// 用户名
			var usCard = $('.yh input').eq(1).val();// 卡号
			var uskhAds = $('.yh input').eq(2).val();// 开户银行
			var uszhName = $('.yh input').eq(3).val();// 支行名称
			if(usName==""||usName==null||usName==undefined){
				msg("请输入收款人名称",false);
				return;
			}
			if(/[^\u4E00-\u9FA5]/g.test(name)){
				  msg('只能输入中文名',false);
				  return false;
			  }
			if(usCard==""||usCard==null||usCard==undefined){
				msg("请输入收款卡号",false);
				return;
			}
			if(!isFind ){
				msg("未知发卡银行,请输入发卡银行名称",false);
				return;
			}
			if(uskhAds==""||uskhAds==null||uskhAds==undefined){
				msg("请输入开户银行",false);
				return;
			}
			if(uszhName==""||uszhName==null||uszhName==undefined){
				msg("请输入支行名称",false);
				return;
			}
			
		}else{
			var usName = $('.zf input').eq(0).val();// 用户名
			var usCard = $('.zf input').eq(1).val();// 支付宝账号
			var uskhAds = 'null';
			var uszhName = 'null';
			 state = 1;
			if(usName==""||usName==null||usName==undefined){
				msg("请输入用户名",false);
				return;
			}
			if(/[^\u4E00-\u9FA5]/g.test(name)){
				  msg('只能输入中文名',false);
				  return false;
			  }
			if(usCard==""||usCard==null||usCard==undefined){
				msg("请输入支付宝账号",false);
				return;
			}
			if(!(regmail.test(usCard)||regtel.test(usCard))){
				msg("支付宝账号格式不对",false);
				return;
			}
		}
		$.ajax({
			type: 'post',
			url: ctx+'/personalCenter/insertBankAndZhi',
			data: {
				usName:usName,
				usCard:usCard,
				uskhAds:uskhAds,
				uszhName:uszhName,
				state:state
			},
			success: function(data){
				data = JSON.parse(data);
				if(data.code==200){
					if(tj=='银行卡'){
						msg('银行卡添加成功',true);
					}else{
						msg('支付宝添加成功',true);
					}
					$('.ask_mask').css('display','none');
					$('.add_ask_for').css('display','none');
					$('.mask').css('display','none');
					$('.add_ask_for input').val('');
					getCard();
				}else if(data.code==202){
					if(tj=='银行卡'){
						msg('银行卡已存在,请更换账号',false);
					}else{
						msg('支付宝已存在,请更换账号',false);
					}
				}else{
					if(tj=='银行卡'){
						msg('银行卡添加失败',false);
					}else{
						msg('支付宝添加失败',false);
					}
				}
			}
		});
	});

	$('.qr_add').click(function(){
		var tj = $('.tx_type i.on').text();
		var state = 0;
		if(tj=='银行卡'){
			var usName = $('.yh input').eq(0).val();// 用户名
			var usCard = $('.yh input').eq(1).val();// 卡号
			var uskhAds = $('.yh input').eq(2).val();// 开户银行
			var uszhName = $('.yh input').eq(3).val();// 支行名称
		}else{
			var usName = $('.zf input').eq(0).val();// 用户名
			var usCard = $('.zf input').eq(1).val();// 支付宝账号
			var uskhAds = 'null';
			var uszhName = 'null';
			state = 1
		}
	
			
		
	});
	
	
	/*获取提现验证码*/
	$(".getcode").click(function(){
		toTelCode();
		
	});
	
	
	/* 事件绑定 */
	
	
}

/**
*获取验证码等待时间
*/
var time;
function countDown(obj,n){
	obj.attr({"disabled":"true"});
	obj.html('('+n+')重新获取');
	obj.css('background','#ccc');
	obj.removeClass('on');
	time=setInterval(function(){
		n--;
		obj.html('('+n+')重新获取');
		if(n==0){
			clearInterval(time);
			obj.html('获取验证码');
			obj.removeAttr("disabled");
			obj.css('background','#57c6d4');
		}
	},1000);
};


function getCard(){//获取提现账号
	$.ajax({
		url: ctx+"/withDraw/getUserBankInfos",
		type: "POST",
		success: function(data){
			data = JSON.parse(data);
			$('.gath_list li').remove();
			var htmls = '';
			if(data.code==200){
				for(var i=0;i<data.data.length;i++){
					htmls+='<li class="'+(i==0?"on":"")+' "value="'+data.data[i].id+'"><span></span>'+data.data[i].bankDeposit.split("-")[0]+substrDemo(data.data[i].bankcarNum)+' </li>';
				}
				htmls+='<li class="add_card"><span></span>添加新卡号</li>';
				$('.gath_list').html(htmls);

				$('.mask').css('display','block');
				$('.ask_for').css('display','block');

				/* 选择提现账号 */
				$('.gath_list li').unbind('click');
				$('.gath_list li').click(function(){
					var n = $('.gath_list li').index(this);
					$('.gath_list li').removeClass('on').eq(n).addClass('on');
					if(n == $('.gath_list li').length-1){
						//$('.add_ask_for input').val('');
						$('.ask_mask').css('display','block');
						$('.add_ask_for').css('display','block');
						$('.gath_list li').removeClass('on').eq(0).addClass('on');
					}
				});
				/* 选择提现账号 */
			}else{
				htmls+='<li class="add_card"><span></span>添加新卡号</li>';
				$('.gath_list').html(htmls);
				$('.mask').css('display','block');
				$('.ask_for').css('display','block');
				$(".getcode").attr("disabled",true);
				$(".getcode").css("background","#ccc");
				/* 选择提现账号 */
				$('.gath_list li').unbind('click');
				$('.gath_list li').click(function(){
					var n = $('.gath_list li').index(this);
					$('.gath_list li').removeClass('on').eq(n).addClass('on');
					if(n == $('.gath_list li').length-1){
						//$('.add_ask_for input').val('');
						$('.ask_mask').css('display','block');
						$('.add_ask_for').css('display','block');
						$('.gath_list li').removeClass('on').eq(0).addClass('on');
					}
				});
			}
		}
	});
}

function getTxList(){//获取提现信息列表
	$.ajax({
		type: 'post',
		url: '',
		data: {
			id: 0
		},
		success: function(data){
			data = JSON.parse(data);
			if(data.code==200){
				var htmls = '';
				for(var i=0;i<data.data.length;i++){
					htmls+='<li><span class="tx1">2016.6.6-2016.7.1</span><span class="tx2"><img src="img/gsyh.png">6222545222145236525</span><span class="tx3">100.00</span><span class="tx4">100.00</span><span class="tx5">20.00</span><span class="tx6">20.00</span><span class="tx7">160.00<img class="tip" src="img/ts.png"></span><span class="tx8">已支付</span><span class="tx9"><i class="i_btn">确认</i></span></li>';
				}
				$('.tx_list_info').html(htmls);

				/* 确认提现按钮 */
				$('.qr_with').unbind('click');
				$('.qr_with').click(function(){

				});
				/* 确认提现按钮 */

				/* 申诉 */
				$('.tx_ss').unbind('click');
				$('.tx_ss').click(function(){
					$('.mask').css('display','block');
					$('.cause').css('display','block');
				});
				/* 申诉 */
			}
		}
	});
}
function getTjInfo(sn){
	$.ajax({
		type: 'post',
		url: ctx+"/withDraw/getChangeAccount",
		data: {
			accountId: sn
		},
		success: function(data){
			data = JSON.parse(data);
			if (data.code == 200) {
				if (true) {// 判断有没有申诉原因
					$('.ss_cause').text('');
				}
				var htmls = '';
				$('.zf_sm').remove();
				for (var i = 0; i < data.data.length; i++) {
					$('.cg_money > span:eq(0) i').text(
							data.data[i].before_money);// 改前金额
					$('.cg_money > span:eq(1) i')
							.text(data.data[i].after_money);// 改后金额
					for (var j = 0; j < data.data[i].list.length; j++) {
						var maps = data.data[i].list[j];
						var fileurls = maps.reason_fileurl.split(';')
						htmls += '<div class="zf_sm">' + '<p></p><div>' + '费用类型：' + maps.reason_type;
						for (var x = 0; x < fileurls.length; x++) {
							if (fileurls[x] == "" || fileurls[x] == undefined ||fileurls[x] == 'undefined') {
							} else {
								var imgs = 'http://183.240.147.102:8082/cloud/' + fileurls[x];
								htmls += '<p><img class="fr" src="' + imgs + '"></p>';
							}
						}
						htmls += '备注：' + maps.reason_content + '</div></div>';
					}
				}
				$('.cg_money').after(htmls);
				$('.mask').css('display', 'block');
				$('.change_info').css('display', 'block').animate({
					'right' : '0px'
				});
			}
		}
	});
}

function change(str){//修改日期‘-’变‘.’
	return str.replace(/-/g,'.');
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
				$(".with_info p span").eq(0).text(parseFloat(data.data.withDrawMoney).toFixed2(2));
				$(".with_info p span").eq(1).text(data.data.withDrawTime);
				$(".getWithdraw").attr('disabled',false);
				$(".getWithdraw").css("background","#57c6d4");
			}else{
				$(".with_info p span").eq(0).text(parseFloat(data.data.withDrawMoney).toFixed2(2));
				$(".with_info p span").eq(1).text(data.data.withDrawTime);
				$(".getWithdraw").attr('disabled',true);
				$(".getWithdraw").css("background","#ccc");
			}
		}
	});
}

// 提现列表 初始化ajax---查询用户提现记录日志列表
var selAccountLog=function(n,str){
	$(".imgShow").css("display","none");
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
			$('.tx_list_info li').remove();
			eval("data="+data);
			if(data.code==200){
				var htmls='';
				for(var i=0,len=data.data.length;i<len;i++){
				htmls+='<li  data-contId='+data.data[i].account_id+' style="background:'+(data.data[i].status=='806'?'#faedeb':data.data[i].status=='801'?'':data.data[i].status=='803'?'':data.data[i].status=='802'?'':data.data[i].status=='805'||data.data[i].status=='808'?'#eaf8f5':'')+';">'+
							'<span class="tx1" style="line-height: 18px;">'+data.data[i].start_time.replace(/-/g,'.')+'-'+data.data[i].end_time.replace(/-/g,'.')+'</span>'+
							'<span class= "tx2">'+data.data[i].bank_info_id+'</span>'+
							'<span class= "tx3">'+parseFloat(data.data[i].account_platform_income).toFixed2(2)+'</span>'+
							'<span class= "tx4">'+parseFloat(data.data[i].account_offline_income).toFixed2(2)+'</span>';
							if(data.data[i].status=='801'){
							htmls+='<span class="txk">飞讯无限财务正在审核账单中</span>';
							}else if(data.data[i].status=='803'){
								htmls+='<span class="txk">飞讯无限财务正在打款中</span>';
							}else if(data.data[i].status=='806'){
								htmls+='<span class="txk">飞讯无限财务审核申诉账单中</span>';
							}else{
								htmls+='<span class="tx5">'+parseFloat(data.data[i].account_refund).toFixed2(2)+'</span>'+
								'<span class="tx6">'+parseFloat(data.data[i].charge_rate).toFixed2(2)+'</span>';
								if(data.data[i].after_money==undefined||data.data[i].after_money==''||data.data[i].after_money==null){
									htmls+='<span class="tx7">'+parseFloat(data.data[i].account_balance_after).toFixed2(2)+'</span>';
								}else{
									htmls+='<span class="tx7">'+parseFloat(data.data[i].account_balance_after).toFixed2(2)+'<img class="tip tj_info" src='+imgPath+'/ts.png></span>';
								}
							}
							htmls+='<span class="tx8">'+(data.data[i].status=='806'?'申诉中 ':data.data[i].status=='801'?'审核中':data.data[i].status=='803'?'收款中':data.data[i].status=='802'?'待结算':data.data[i].status=='805'||data.data[i].status=='808'?'已支付':'申诉完成<img class="mo_ts" src='+imgPath+'/ts.png> ')+'<span class="new-tip">'+data.data[i].appeal_content+'</span></span>'+
							'<span class="tx9 ckpz">'+(data.data[i].status=='802'?'<i class="i_btn qr_with">确认提现</i><i class="i_btn tx_ss">申诉</i>':data.data[i].status=='805'?'<i class="i_btn proof">查看凭证</i><span class="float">'+data.data[i].flow_code+'</span><i class="i_btn su_que">确认</i>':data.data[i].status=='808'?'':data.data[i].status=='807'?'<i class="i_btn qr_with">确认提现</i><i class="i_btn tx_ss">申诉</i>':'')+'</span>'+
						'</li>';
				}
				$('.tx_list_info').html(htmls);
				$(".pager").css("display","block");
				$('.new-tip').css('display','none');
				$('.mo_ts').mouseover(function(){
					var n=$(".mo_ts").index(this);
					$('.new-tip').eq(n).css('display','block');
				})
				$('.mo_ts').mouseout(function(){
					$('.new-tip').css('display','none');
				})
				/*商户已支付确定按钮*/
				$(".su_que").unbind('click');
				$(".su_que").click(function(){
					var n = $(".su_que").index(this);
					var status='808';
					var contId = $(".su_que").eq(n).parent().parent().attr('data-contId');
					updateWithDrawStu(status,contId);
				})
				/*商户待结算确认提现*/
				$(".qr_with").unbind("click");
				$(".qr_with").click(function(){
					var n = $(".qr_with").index(this);
					var status='803';
					var contId = $(".qr_with").eq(n).parent().parent().attr('data-contId');
					updateWithDrawStu(status,contId);
				})
				/*商户待结算申诉*/
				$(".tx_ss").unbind("click");
				$(".tx_ss").click(function(){
					var n = $(".tx_ss").index(this);
					var status='806';
					var contId = $(".tx_ss").eq(n).parent().parent().attr('data-contId');
					$('.mask').css('display','block');
					$('.cause').css('display','block');
					$(".hid").val(contId);
					$(".hsta").val(status);
					
				}) 
				/*查看凭证*/
				
				$(".proof").unbind("hover");
				$(".proof").hover(function(){
					var n = $(".proof").index(this);
					$(".ckpz .float").eq(n).css('display','inline-block');
				},function(){
					$(".ckpz .float").css('display','none');
				}); 
				//查看调价详情
				$('.tj_info').click(function(){
					var n = $(".tj_info").index(this);
					var contId = $(".tj_info").eq(n).parent().parent().attr('data-contId');
					getTjInfo(contId);
				});
			}else if(data.code==201){
				$(".pager").css("display","none");
				$(".barcontainer").hide();
				$('.selec1>ul>li').remove();
				//msg("暂无数据",false);
				$(".imgShow").css("display","block");
				$(".marked").text("当前列表暂无数据");
			}
		},
		error: function(){
			msg("系统繁忙请稍后!",false);
		}
	});
};
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
			$(".page_cont i").eq(0).text(data.data==0?0:1);
			$(".page_cont i").eq(1).text(data.data);
			
		},
		error: function(){
			msg("系统繁忙请稍后!",false);
		}
	});
};
/*修改用户提现操作状态*/
function updateWithDrawStu(status,contId){
	var content=$(".cause_txt").val();
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
				$('.mask').css('display','none');
				$('.cause').css('display','none');
				$(".hid").val("");
				$(".hsta").val("");
				selAccountLog(1,$(".tx_tab>.on").attr("data-status"));
				selAccountLogTotalNum($(".tx_tab>.on").attr("data-status"));
			}else{
				msg("系统繁忙请稍后!",false);
			}
		}
		
	})
} 
/**
* 处理字符串显示几位中间以‘*’号显示
* 只能用作回显银行卡号
*/
function substrDemo(str){//接受需要处理的字符串
	return (str.substr(0,5)+'****'+str.substr(str.length-4,4));//直接返回处理好的字符串
}
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
		                msg("未知发卡银行,请输入发卡银行名称",false);
		            }
            	},
            	error: function(){
            		 msg("网络服务忙,请稍后再试····",false);
            	}
            });
}
/*获取用户的提现明细*/
function withDrawFlow(n){
	$(".imgShow").css("display","none");
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
			$("ls_list_info>li").remove();
			eval("data="+data);
			if(data.code==200){
				var htmls='';
				for(var i=0,len=data.data.length;i<len;i++){
				htmls+='<li>'+
							'<span style="line-height: 18px;" class="date_span" data-d="'+data.data[i].start_time1+ ','+ data.data[i].end_time1+'">'+data.data[i].start_time1.replace(/-/g,'.')+'-'+data.data[i].end_time1.replace(/-/g,'.')+'</span>'+
							'<span style="overflow:hidden;height:40px;cursor:pointer;" title="'+data.data[i].flow_code+'">'+data.data[i].flow_code+'</span>'+
							'<span>'+parseFloat(data.data[i].account_platform_income).toFixed2(2)+'</span>'+
							'<span>'+parseFloat(data.data[i].account_offline_income).toFixed2(2)+'</span>'+
							'<span>'+parseFloat(data.data[i].account_refund).toFixed2(2)+'</span>'+
							'<span>'+parseFloat(data.data[i].poundage).toFixed2(2)+'</span>'+
							'<span>'+parseFloat(data.data[i].accountincome).toFixed2(2)+'</span>'+
							'<span><i class="i_btn load">下载明细</i><span>'+
						'</li>';
				}
				$('.ls_list_info').html(htmls);
				
				$(".load").unbind("click");
				$(".load").click(function(){
					var n = $(".load").index(this);
					var times = $(".load").eq(n).parent().parent().find('span').eq(0).attr("data-d").split(",");
					window.location.href=ctx+"/withDraw/importExcle?startTime="+times[0]+"&endTime="+times[1];
				})
				
			}else{
				$(".imgShow").css("display","block");
				$(".marked").text("当前列表暂无数据");
			}
		}
		
	});
	
}

/*获取体现明细总页数*/
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
			$(".page_cont i").eq(0).text(data.data==0?0:1);
			$(".page_cont i").eq(1).text(data.data);
			
		},
		error: function(){
			msg("网络异常,请稍后再试····",false);
		}
	});
};
/*获得收入明细总页数*/
function getTotalAmount(){
	var siteId=$("#site_id").val();//场所id
	var startDate=$("#startDate").val();//按日期的开始时间
	var endDate=$("#endDate").val();//到日期的结束时间
	var payName=$(".collegeType").text();//付费类型
	if("全部"==payName){
		payName="";
	}
	var userName=$("#selByUserName").val();//用户名
	if($(".names").css("display")!="none"){
		payName="";
	}
	$.ajax({
		type : "POST",
		url : ctx+"/siteIncome/getTotalAmount",
		data : {
			siteId : siteId,
			startDate:startDate,
			endDate:endDate,
			payName:payName,
			userName:userName
		},
		success : function(data) {
			if(data=="loseSession"){
				 window.location.href=ctx+"/toLogin";
				 return;
			}	
			eval("data = " + data);
			if (data.code == 200) {
				$("#money").html(data.data[0].totalAmount+"元");
			}else{	
				$("#money").html(0+"元");
			}
		}
	});
	
}
/**
 * 发送验证码ajax
 */
function toTelCode(){
	var userName = $('#txtel').val();
	$.ajax({
		type:"post",
		url:ctx+"/TelCodeManage/checkAutoAndCode",
		data:{
			tel:userName,
			//content:content
			templateCode:encodeDES("SMS_136855624"),
			msgtext:'平台提现验证码',
			csessionid:encodeDES(document.getElementById('csessionid').value),
			sig:encodeDES(document.getElementById('sig').value),
			token:encodeDES(document.getElementById('token').value),
			scene: encodeDES(document.getElementById('scene').value),
		 
		},
		success:function(data){
			eval("data="+data);
			if(data==3){
				initHua('register','#dom_id');
				msg('请滑动滑块重新验证');
			}else{
				if(data==-2){
					clearInterval(time);
					$('.fn-gain').html('重新获取验证码');
					$('.fn-gain').removeAttr("disabled");
					$('.fn-gain').addClass('on');
					msg('请不要频繁发送验证码,谢谢您的配合与支持!');
				}else if(data==-1){
					initHua('register','#dom_id');
					msg('验证码发送失败!');
				}else{
					countDown($('.getcode'),90);//获取验证码方法
				}
			}
		},
	});
};
/*点击提现确认按钮*/
function sumbitWithdraw(){
		var code=$(".codeNum").val();
		var bankcard=$(".gath_list .on").attr("value");
		var withdrawMoney=$(".with_info p").eq(0).find("span").text();
		$.ajax({
			url: ctx+"/withDraw/getCanWithDraw",
			type: "POST",
			data:{
				bankNumId:bankcard,
				withdrawMoney:withdrawMoney,
				code:code
			},
			success: function(data){
				if(data=="loseSession"){
					 window.location.href=ctx+"/toLogin";
					 return;
				}	 
				eval('data='+data);
				if(data.code==200){
					msg("提现成功",true);
					getWithDrawMoney();
					selAccountLog(1,"");
					selAccountLogTotalNum("");
					$('.mask').css('display','none');
					$('.ask_for').css('display','none');
				}else if(data.code==201){
					msg(data.msg,false);
				}else if(data.code==202){
					msg(data.msg,false);
				}else if(data.code==203){
					msg(data.msg,false);
				}else if(data.code==204){
					msg(data.msg,false);
					$('.mask').css('display','none');
					$('.ask_for').css('display','none');
				}else if(data.code==205){
					msg(data.msg,false);
				}else if(data.code==206){
					msg(data.msg,false);
				}else if(data.code==207){
					msg(data.msg,false);
				}else if(data.code==208){
					msg(data.msg,false);
				}else if(data.code==209){
					msg(data.msg,false);
				}
			},
		});
}
/*获取用户场所*/
function getUserSite(){
	$('.pullDtype1 li').remove();
	$.ajax({
		type : "POST",
		url : ctx+"/siteIncome/getSite",
		async:false,
		data:{
		},
		success:function(data){
			if(data=="loseSession"){
				 window.location.href=ctx+"/toLogin";
				 return;
			}	
			eval("data="+data);
			htmls='';
			if(data.code==200){
				
				for (var i = 0; i < data.data.length; i++) {
					htmls+="<li value='"+data.data[i].id+"'>"+data.data[i].site_name+"</li>";
				}
				$('.pullDtype1').html(htmls);
				$(".collegeType1").html($('.pullDtype1 li').eq(0).text());
				$(".collegeType1").attr("value",$('.pullDtype1>li').eq(0).attr("value"));
				$('.pullDtype1>li').click(function(){
					var n=$('.pullDtype1>li').index(this);
					var str=$('.pullDtype1>li').eq(n).text();
					var siteId=$('.pullDtype1>li').eq(n).attr("value");
					$('.collegeType1').html(str);  
					$(".collegeType1").attr("value",$('.pullDtype1>li').eq(n).attr("value"));
					$(".pullDtype1").hide();
					$(".collegeType").html("全部");
					getMealPay(siteId);
				});
				getMealPay($('.pullDtype1>li').eq(0).attr("value"));
			}else if(data.code==201){
				msg("暂无场所",false);
			}
		}
	});
}
/*获取场所下的套餐*/
function getMealPay(siteId){
	$('.pullDtype .meal').remove();
	$.ajax({
		type : "POST",
		url : ctx+"/siteIncome/getMealPay",
		data:{
			siteId:siteId
		},
		success:function(data){
			if(data=="loseSession"){
				 window.location.href=ctx+"/toLogin";
				 return;
			}	
			eval("data="+data);
			htmls='';
			for (var i = 0; i < data.data.length; i++) {
				htmls+="<li class='meal'>"+data.data[i].name+"</li>";
			}
			$('.pullDtype li').eq(0).after(htmls);
			
			$('.pullDtype>li').click(function(){
				var n=$('.pullDtype>li').index(this);
				console.log(n);
				var str=$('.pullDtype>li').eq(n).text();
				console.log(str);
				$('.collegeType').html(str);  
				$(".pullDtype").hide();
			});
		}
	});
}
/*获取收入明细*/
function getSiteIncome(curPage){
	$(".imgShow").css("display","none");
	var siteId=	$(".collegeType1").attr("value");
	var sTime=$(".incomeDate1").val();
	var	eTime=$(".incomeDate2").val();
	var payType=$(".collegeType").text();
	switch (payType) {
	case "全部":
			payType="";break;
	default:
		payType=payType;break;
	}
	var userName=$(".mx_unquery input").val();
	$.ajax({
		type : "POST",
		url : ctx+"/siteIncome/getUserInfoList",
		data:{
			siteId:siteId,
			startDate:sTime,
			endDate:eTime,
			payName:payType,
			curPage:curPage,
			userName:userName
		},
		success:function(data){
			if(data=="loseSession"){
				 window.location.href=ctx+"/toLogin";
				 return;
			}	
			eval("data="+data);
			htmls='';
			$(".ms_list_info li").remove();
			if(data.code==200){
				
				for (var i = 0; i < data.data.length; i++) {
					htmls+="<li>";
						if(data.data[i].userName.indexOf("0")==0){
							htmls+=	"<span>"+data.data[i].userName.replace(0,"").trim()+"</span>";
						}else{
							htmls+=	"<span>"+data.data[i].userName+"</span>";
						}
						htmls+="<span>"+data.data[i].payAmount+"</span><span>"+data.data[i].payName+"</span><span>"+data.data[i].buyNum+"</span>";
								
						if(data.data[i].userName.indexOf("0")==0){
							htmls+=	"<span>营业厅充值</span>";
						}else{
							htmls+=	"<span>自助充值</span>";
						}		
						htmls+=	"<span>"+data.data[i].createTime+"</span></li>";
				}
				$(".ms_list_info").html(htmls);
				$(".pager").css("display","block");
			}else{
				$(".pager").css("display","none");
			}
		}
	});
}
/*收入明细总页数*/
function getPage(){
	var siteId=	$(".collegeType1").attr("value");
	var sTime=$(".incomeDate1").val();
	var	eTime=$(".incomeDate2").val();
	var payType=$(".collegeType").text();
	switch (payType) {
	case "全部":
			payType="";break;
	default:
		payType=payType;break;
	}
	var userName=$(".mx_unquery input").val();
	$.ajax({
		type : "POST",
		url : ctx+"/siteIncome/getTotalPage",
		data:{
			siteId:siteId,
			startDate:sTime,
			endDate:eTime,
			payName:payType,
			userName:userName
		},
		success:function(data){
			if(data=="loseSession"){
				 window.location.href=ctx+"/toLogin";
				 return;
			}	
			eval("data="+data);
			$(".page_cont i").eq(0).text(data.totoalNum==0?0:1);
			$(".page_cont i").eq(1).text(data.totoalNum);
		}
	});
	
}
/*获取总收入*/
function getTotalAmount(){
	var siteId=	$(".collegeType1").attr("value");
	var sTime=$(".incomeDate1").val();
	var	eTime=$(".incomeDate2").val();
	var payType=$(".collegeType").text();
	switch (payType) {
	case "全部":
			payType="";break;
	default:
		payType=payType;break;
	}
	var userName=$(".mx_unquery input").val();
	$.ajax({
		type : "POST",
		url : ctx+"/siteIncome/getTotalAmount",
		data : {
			siteId:siteId,
			startDate:sTime,
			endDate:eTime,
			payName:payType,
			userName:userName
		},
		success : function(data) {
			if(data=="loseSession"){
				 window.location.href=ctx+"/toLogin";
				 return;
			}	
			eval("data = " + data);
			if (data.code == 200) {
				$(".ms_list span i").html(data.data[0].totalAmount);
			}else{	
				$(".ms_list span i").html(0);
			}
		}
	});
	
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

/**
 * @param scene--->场景,不可更改(login,register两种参数)
 * @param renderTo--->渲染到该DOM ID指定的Div位置
 * 
 * 滑动插件共用类
 */
function initHua(scene,renderTo){
	document.getElementById('csessionid').value = '';
	document.getElementById('sig').value = '';
	document.getElementById('token').value = '';
    document.getElementById('scene').value = '';
	var nc = new noCaptcha();
	var nc_appkey = 'FFFF000000000167FABE';  // 应用标识,不可更改
    var nc_scene = scene;  //场景,不可更改
	var nc_token = [nc_appkey, (new Date()).getTime(), Math.random()].join(':');
	var nc_option = {
		renderTo: renderTo,//渲染到该DOM ID指定的Div位置
		appkey: nc_appkey,
        scene: nc_scene,
		token: nc_token,
        /*trans: '{"name1":"code100"}',*///测试用，特殊nc_appkey时才生效，正式上线时请务必要删除；code0:通过;code100:点击验证码;code200:图形验证码;code300:恶意请求拦截处理
		callback: function (data) {// 校验成功回调
			document.getElementById('csessionid').value = data.csessionid;
			document.getElementById('sig').value = data.sig;
			document.getElementById('token').value = nc_token;
            document.getElementById('scene').value = nc_scene;
		}
	};
	nc.init(nc_option);
}
function floatAlert(width,height,str,time) {
	// body...
	var dom = document;
	var body = dom.getElementsByTagName('body')[0];
	var div = dom.createElement('div');
	var string = dom.createTextNode(str);
	var p = dom.createElement("span");
	p.appendChild(string);
	body.appendChild(div);
	div.appendChild(p);
	//div.appendChild(string);
	p.style.textAlign='center';
	div.style.position = 'fixed';
	div.style.top = '50%';
	div.style.left = '50%';
	div.style.background = 'rgba(0,0,0,.6)';
	div.style.width = width+'px';
	div.style.height = height+'px';
	div.style.color = '#fff';
	div.style.textAlign = 'center';
	div.style.boxShadow = '0 0 8px 3px rgba(0,0,0,.6)';
	div.style.padding = '10px';
	div.style.borderRadius = '5px';
	div.style.marginTop = -Math.floor(height/2)+5+'px';
	div.style.marginLeft = -Math.floor(width/2)+5+'px';
	div.style.filter = 'alpha(opacity=100)';
	div.style.opacity = '1';
	div.style.zIndex = '200';
	div.style.lineHeight = height+'px';
	setTimeout(function(){
		var a = 100;
		var timer = setInterval(function(){
			if(a==0){
				div.style.filter = 'alpha(opacity='+a+')';
				div.style.opacity = a/100;
				clearInterval(timer);
				body.removeChild(div);
			}else{
				div.style.filter = 'alpha(opacity='+a+')';
				div.style.opacity = a/100;
			}
			a-=10;
		},50);
	},time);
} 