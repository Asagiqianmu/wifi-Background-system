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
	//用户累计时长选中场所切换数据
	$("#select_bs").on("change", function() {
		var obj = document.getElementById("select_bs"); //定位id
		var index = obj.selectedIndex; // 选中索引
		var siteId = obj.options[index].value; // 选中值
		//开始时间
		var startDate =$('#sTime1').val();
		//结束时间
		var endDate =$('#ueTime').val();
		var userName=$('#userNameTotal').val();
		findUserTotalTime(siteId,userName,startDate,endDate,1);
	});
	//用户累计时长点击查询
	$('#a_btn').click(function() {
		var obj = document.getElementById("select_bs"); //定位id
		var index = obj.selectedIndex; // 选中索引
		var siteId = obj.options[index].value; // 选中值
		//开始时间
		var startDate =$('#sTime1').val();
		//结束时间
		var endDate =$('#ueTime').val();
		var userName=$('#userNameTotal').val();
	    findUserTotalTime(siteId,userName,startDate,endDate,1);
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
	$('#cloudpage .page_pre').click(function(){//上一页
		var obj = document.getElementById("select_bs"); //定位id
		var index = obj.selectedIndex; // 选中索引
		var siteId = obj.options[index].value; // 选中值
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
		findUserTotalTime(siteId,userName,startDate,endDate,dang);
	});

	$('#cloudpage .page_next').click(function(){//下一页
		var obj = document.getElementById("select_bs"); //定位id
		var index = obj.selectedIndex; // 选中索引
		var siteId = obj.options[index].value; // 选中值
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
		findUserTotalTime(siteId,userName,startDate,endDate,dang);
	});

	$('#cloudpage .page_last').click(function(){//尾页按钮
		var obj = document.getElementById("select_bs"); //定位id
		var index = obj.selectedIndex; // 选中索引
		var siteId = obj.options[index].value; // 选中值
		//开始时间
		var startDate =$('#sTime1').val();
		//结束时间
		var endDate =$('#ueTime').val();
		var userName=$('#userNameTotal').val();
		$('#cloudpage .page_cont > i').eq(0).text($('#cloudpage .page_cont > i').eq(1).text());
		$('#cloudpage .page_first').show();
		$('#cloudpage .page_last').hide();
		//调用查询
		findUserTotalTime(siteId,userName,startDate,endDate,$('#cloudpage .page_cont > i').eq(0).text());
	});

	$('#cloudpage  .page_first').click(function(){//首页按钮
		var obj = document.getElementById("select_bs"); //定位id
		var index = obj.selectedIndex; // 选中索引
		var siteId = obj.options[index].value; // 选中值
		//开始时间
		var startDate =$('#sTime1').val();
		//结束时间
		var endDate =$('#ueTime').val();
		var userName=$('#userNameTotal').val();
		$('#cloudpage .page_first').hide();
		$('#cloudpage .page_last').show();
		$('#cloudpage  .page_cont > i').eq(0).text(1);
		findUserTotalTime(siteId,userName,startDate,endDate,1);
	});

	$('#cloudpage  .skip').click(function(){//跳转到某页
		var obj = document.getElementById("select_bs"); //定位id
		var index = obj.selectedIndex; // 选中索引
		var siteId = obj.options[index].value; // 选中值
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
		findUserTotalTime(siteId,userName,startDate,endDate,n);
	});

	$('#cloudpage  .page_to').keypress(function(e){//跳转到某页回车事件
		var obj = document.getElementById("select_bs"); //定位id
		var index = obj.selectedIndex; // 选中索引
		var siteId = obj.options[index].value; // 选中值
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
			findUserTotalTime(siteId,userName,startDate,endDate,n);
		}
	});
    /* 用户累计时长的分页 */
	
	
	
	/********用户累计时长的操作*********/
	//用户管理选项卡切换
	$('.cn_table span').click(function(){
		$(".imgShow").css("display","none");
		var n = $(this).index();
		$('.cn_table span').removeClass('on').eq(n).addClass('on');
		switch (n){
			case 0: $('.user_table').css('display','none');
					$('.us_query').css('display','block');
					$('.l_user_table').css('display','none');
					$('.l_us_query').css('display','none');
					$('.sn_user_table').css('display','none');
					$('.s_us_query').css('display','none');
					$('.l_num').css('display','none');
					$('.w_user_table').css('display','none');
					$('.s_user_table').css('display','none');
					$('.s_num').css('display','none');
					$('.in_user_table').css('display','block');
					$(".nameby").val("");
					$(".fn_select span").text("全部");
					$(".fn_select span").attr("siteId","");
					$(".addUserBtn").css("display","none");
					getOnLineList(1);//获取在线人数
					getOnLineCount();//获取在线人数总页数
					break;
			case 1: $('.user_table').css('display','none');
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
				//获取用户的累计时长
				//场所ID获取
				var obj = document.getElementById("select_bs"); //定位id
				var index = obj.selectedIndex; // 选中索引
				var siteId = obj.options[index].value; // 选中值
				//开始时间
				var startDate =$('#sTime1').val();
				//结束时间
				var endDate =$('#ueTime').val();
				findUserTotalTime(siteId,"",startDate,endDate,1);
				break;
			case 2: $('.user_table').css('display','block');
					$('.us_query').css('display','block');
					$('.l_user_table').css('display','none');
					$('.l_us_query').css('display','none');
				    $('.sn_user_table').css('display','none');
				    $('.s_us_query').css('display','none');
					$('.l_num').css('display','none');
					$('.w_user_table').css('display','none');
					$('.s_user_table').css('display','none');
					$('.s_num').css('display','none');
					$('.in_user_table').css('display','none');
					$(".nameby").val("");
					$(".fn_select span").text("全部");
					$(".fn_select span").attr("siteId","");
					$(".addUserBtn").css("display","none");
					getRegList(1,n);//获取注册人数
					getRigCount(n);//获取注册人数总页数
					break;
			case 3: $('.user_table').css('display','block');
					$('.us_query').css('display','block');
					$('.l_user_table').css('display','none');
					$('.l_us_query').css('display','none');
				    $('.sn_user_table').css('display','none');
				    $('.s_us_query').css('display','none');
					$('.l_num').css('display','none');
					$('.w_user_table').css('display','none');
					$('.s_user_table').css('display','none');
					$('.s_num').css('display','none');
					$('.in_user_table').css('display','none');
					$(".nameby").val("");
					$(".fn_select span").text("全部");
					$(".fn_select span").attr("siteId","");
					$(".addUserBtn").css("display","none");
					getRegList(1,n);//获取付费人数
					getRigCount(n);//获取付费人数总页数
					break;
			case 4: $('.user_table').css('display','none');
					$('.us_query').css('display','block');
					$('.l_user_table').css('display','none');
					$('.l_us_query').css('display','none');
				    $('.sn_user_table').css('display','none');
				    $('.s_us_query').css('display','none');
					$('.l_num').css('display','none');
					$('.w_user_table').css('display','block');
					$('.s_user_table').css('display','none');
					$('.s_num').css('display','none');
					$('.in_user_table').css('display','none');
					$(".nameby").val("");
					$(".fn_select span").text("全部");
					$(".fn_select span").attr("siteId","");
					$(".addUserBtn").css("display","none");
					getRegNoPay(1);//获取注册未付费用户
					getRegNoPayCount();//获取注册未付费人数总页数
					break;
			case 5: $('.user_table').css('display','none');
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
					break;
			case 6: $('.user_table').css('display','none');
					$('.us_query').css('display','none');
					$('.l_user_table').css('display','none');
					$('.l_us_query').css('display','none');
				    $('.sn_user_table').css('display','none');
				    $('.s_us_query').css('display','none');
					$('.l_num').css('display','none');
					$('.w_user_table').css('display','none');
					$('.s_user_table').css('display','block');
					$('.s_num').css('display','block');
					$('.in_user_table').css('display','none');
					$(".nameby").val("");
					$(".fn_select span").text("全部");
					$(".fn_select span").attr("siteId","");
					$(".addUserBtn").css("display","none");
					getAutonym(1);//获取实名认证待处理人数
					getRealUserCount();//获取实名认证待审核人数总页数
					break;
		}
	});


	/* 分页 */
		$('.page_pre').unbind('click').click(function(){//上一页
			rand = Math.random(); 
			if($('.page_cont > i').eq(0).text()=="1"||$('.page_cont > i').eq(0).text()=="0"){
				return;
			}
			var dang = $('.page_cont > i').eq(0).text();
			if(dang!=1){
				dang--;
			}
			firstDisp(dang);
			$('.page_cont > i').eq(0).text(dang);
			//执行获取当前页
			var tableNum=$('.cn_table .on').index();
			switch (tableNum) {
			case 0:
				getOnLineList($('.page_cont > i').eq(0).text());//获取在线人数
				break;
			case 1:
				getRegList($('.page_cont > i').eq(0).text(),tableNum);//获取注册人数
				break;
			case 2:
				getRegList($('.page_cont > i').eq(0).text(),tableNum);//获取付费人数
				break;
			case 3:
				getRegNoPay($('.page_cont > i').eq(0).text());//获取注册未付费人数
				break;
			case 4:
				getRunOfflist($('.page_cont > i').eq(0).text());//获取流失人数
				break;
			case 5:
				getAutonym($('.page_cont > i').eq(0).text());//获取实名认证待处理人数
				break;
			}

		});

		$('.page_next').unbind('click').click(function(){//下一页
			rand = Math.random(); 
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
			var tableNum=$('.cn_table .on').index();
			switch (tableNum) {
			case 0:
				getOnLineList($('.page_cont > i').eq(0).text());//获取在线人数
				break;
			case 1:
				getRegList($('.page_cont > i').eq(0).text(),tableNum);//获取注册人数
				break;
			case 2:
				getRegList($('.page_cont > i').eq(0).text(),tableNum);//获取付费人数
				break;
			case 3:
				getRegNoPay($('.page_cont > i').eq(0).text());//获取注册未付费人数
				break;
			case 4:
				getRunOfflist($('.page_cont > i').eq(0).text());//获取流失人数
				break;
			case 5:
				getAutonym($('.page_cont > i').eq(0).text());//获取实名认证待处理人数
				break;
			}

		});

		$('.page_last').unbind('click').click(function(){//尾页按钮
			rand = Math.random(); 
			if($('.page_cont > i').eq(1).text()=="1"||$('.page_cont > i').eq(1).text()=="0"){
				return;
			}
			if($('.page_cont > i').eq(0).text()==$('.page_cont > i').eq(1).text()){
				return;
			}
			$('.page_cont > i').eq(0).text($('.page_cont > i').eq(1).text());
			firstDisp($('.page_cont > i').eq(0).text());
			var tableNum=$('.cn_table .on').index();
			switch (tableNum) {
			case 0:
				getOnLineList($('.page_cont > i').eq(0).text());//获取在线人数
				break;
			case 1:
				getRegList($('.page_cont > i').eq(0).text(),tableNum);//获取注册人数
				break;
			case 2:
				getRegList($('.page_cont > i').eq(0).text(),tableNum);//获取付费人数
				break;
			case 3:
				getRegNoPay($('.page_cont > i').eq(0).text());//获取注册未付费人数
				break;
			case 4:
				getRunOfflist($('.page_cont > i').eq(0).text());//获取流失人数
				break;
			case 5:
				getAutonym($('.page_cont > i').eq(0).text());//获取实名认证待处理人数
				break;
			}

		});

		$('.page_first').unbind('click').click(function(){//首页按钮
			rand = Math.random(); 
			if($('.page_cont > i').eq(0).text()==1||$('.page_cont > i').eq(0).text()==0){
				return;
			}
			$('.page_cont > i').eq(0).text(1);
			firstDisp(1);
			var tableNum=$('.cn_table .on').index();
			switch (tableNum) {
			case 0:
				getOnLineList($('.page_cont > i').eq(0).text());//获取在线人数
				break;
			case 1:
				getRegList($('.page_cont > i').eq(0).text(),tableNum);//获取注册人数
				break;
			case 2:
				getRegList($('.page_cont > i').eq(0).text(),tableNum);//获取付费人数
				break;
			case 3:
				getRegNoPay($('.page_cont > i').eq(0).text());//获取注册未付费人数
				break;
			case 4:
				getRunOfflist($('.page_cont > i').eq(0).text());//获取流失人数
				break;
			case 5:
				getAutonym($('.page_cont > i').eq(0).text());//获取实名认证待处理人数
				break;
			}

		});

		$('.skip').unbind('click').click(function(){//跳转到某页
			rand = Math.random(); 
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
			var tableNum=$('.cn_table .on').index();
			switch (tableNum) {
			case 0:
				getOnLineList($('.page_cont > i').eq(0).text());//获取在线人数
				break;
			case 1:
				getRegList($('.page_cont > i').eq(0).text(),tableNum);//获取注册人数
				break;
			case 2:
				getRegList($('.page_cont > i').eq(0).text(),tableNum);//获取付费人数
				break;
			case 3:
				getRegNoPay($('.page_cont > i').eq(0).text());//获取注册未付费人数
				break;
			case 4:
				getRunOfflist($('.page_cont > i').eq(0).text());//获取流失人数
				break;
			case 5:
				getAutonym($('.page_cont > i').eq(0).text());//获取实名认证待处理人数
				break;
			}

		});

		$('.page_to').unbind('keypress').keypress(function(e){//跳转到某页回车事件
			rand = Math.random(); 
			if($('.page_cont > i').eq(0).text()=="1"&&$('.page_cont > i').eq(1).text()=="1"){
				$('.page_to').val("");
				return;
			}
			if(e.keyCode==13){
				if($('.page_to').val()==""){
					return;
				}
				var n = parseInt($('.page_to').val());
				if(n==''||n<1||n>$('.page_cont > i').eq(1).text()||n==undefined){
					$('.page_to').val('');
					return;
				}
				$('.page_cont > i').eq(0).text(n);
				firstDisp(n);
				$('.page_to').val('');
				var tableNum=$('.cn_table .on').index();
				switch (tableNum) {
				case 0:
					getOnLineList($('.page_cont > i').eq(0).text());//获取在线人数
					break;
				case 1:
					getRegList($('.page_cont > i').eq(0).text(),tableNum);//获取注册人数
					break;
				case 2:
					getRegList($('.page_cont > i').eq(0).text(),tableNum);//获取付费人数
					break;
				case 3:
					getRegNoPay($('.page_cont > i').eq(0).text());//获取注册未付费人数
					break;
				case 4:
					getRunOfflist($('.page_cont > i').eq(0).text());//获取流失人数
					break;
				case 5:
					getAutonym($('.page_cont > i').eq(0).text());//获取实名认证待处理人数
					break;
				}
			}
		});
		
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
	/* 新增用户确定按钮 */
	$(".lj_cj").unbind("click");
	$('.lj_cj').click(function(){
		noRepeatClick(this);
		var userName = $('#cj_phone').val(),
			sex = $('#sex i.on').text(),
			pwd = $('#cj_pwd').val(),
			siteId=$(".fn_select >span").attr("siteid");
			dates=new Date().getTime()-60*1000;
		if(userName==""||userName==null||userName==undefined){
			msg("请输入用户名",false);
			return;
		}
		if(!phoneReg.test(userName)){
			msg("用户名不符合手机格式",false);
			return;
		}
		if(pwd==""||pwd==null||pwd==undefined){
			msg("请输入密码",false);
			return;
		}
		if(pwd.length<6){
			msg("密码长度不能少于6位",false);
			return;
		}
		if(!falg){
			msg("该用户已注册",false);
			return;
		}
		$.ajax({
			type: 'post',
			url: ctx+"/siteCustomer/doRegistSD",
			data: {
				gender: sex=="男"?1:0,
				uname: userName,
				pwd: pwd,
				siteId:siteId,
				dates:dates
			},
			success: function(data){
				data = JSON.parse(data);
				if(data.code==200){
					$('.mask').css('display','none');
					$('.add_user').css('display','none');
					msg('创建成功',true);
					var tablelist=$(".cn_table .on").text();
					if(tablelist=="在线用户"){
						getOnLineList(1);//获取在线人数
						getOnLineCount();//获取在线人数总页数
					}else if(tablelist=="注册用户"){
						getRegList(1,1);//获取付费人数
						getRigCount(1);//获取付费人数总页数
					}else if(tablelist=="付费用户"){
						getRegList(1,2);//获取付费人数
						getRigCount(2);//获取付费人数总页数
					}else{
						getRegNoPay(1);//获取注册未付费用户
						getRegNoPayCount();//获取注册未付费人数总页数
					}
				}
			}
		});
	});

	/* 新增用户取消按钮 */
	$('.qx_cj').click(function(){
		$('.mask').css('display','none');
		$('.add_user').css('display','none');
	});
	/* 新增用户取消按钮 */
	
	/* 现场认证按钮 */
	$('.nowAuth').click(function(){
		$('.sb_bd input').val('');
		$('.mask').css('display','block');
		$('.sb_bd').css('display','block');
	});
	/*现场认证用户名校验*/
	$('#x_phone').bind('input propertychange',function(){
		if($("#x_phone").val().length==11&&phoneReg.test($("#x_phone").val())){
			$.ajax({
				type:"post",
				url:ctx+"/personalRealName/validateName",
				data:{
					telephone:$("#x_phone").val().trim()
				},
				success:function(data){
					eval("data="+data);
					if(data.code==201){
						isok=false;
						msg(data.msg,false);
						mssg=data.msg;
					}else if(data.code==202){
						isok=false;
						msg(data.msg,false);
						mssg=data.msg;
					}
				}
			})
		}
	})
	
	/* 现场认证确定按钮 */
	$(".lj_bd").unbind("click");
	$('.lj_bd').click(function(){
		var phone = $('#x_phone').val(),
			name = $('#x_name').val(),      
			card = $('#x_card').val(),
			ads = $('#x_ads').val();
		if(phone==""||phone==null||phone==undefined){
			msg("请输入手机号",false);
			return;
		}
		if(!phoneReg.test(phone)){
			msg("请输入正确手机号",false);
			return;
		}
		if(name==""||name==null||name==undefined){
			msg("请输入真实姓名",false);
			return;
		}
		if(card==""||card==null||card==undefined){
			msg("请输入身份证号",false);
			return;
		}
		if(ads==""||ads==null||ads==undefined){
			msg("请输入宿舍位置",false);
			return;
		}
		if(!IdentityCodeValid(card)){
			return;
		}
		if(!isok){
			msg(mssg,false);
			return;
		}
		$.ajax({
			type: 'post',
			url: ctx+'/personalRealName/realNameAuth',
			data: {
				telephone: phone,
				userName: name,
				idCard: card,
				positation: ads
			},
			success: function(data){
				data = JSON.parse(data);
				if(data.code==200){
					$('.mask').css('display','none');
					$('.sb_bd').css('display','none');
					msg('认证成功',true);
				}else if(data.code==201){
					$('.mask').css('display','none');
					$('.sb_bd').css('display','none');
					msg(data.msg,true);
				}else if(data.code==202){
					$('.mask').css('display','none');
					$('.sb_bd').css('display','none');
					msg(data.msg,true);
				}
			}
		});
	});

	/* 现场认证取消按钮 */
	$('.qx_bd').click(function(){
		$('.mask').css('display','none');
		$('.sb_bd').css('display','none');
	});
	/* 现场认证取消按钮 */

	/* 关闭按钮 */
	$('.gb_close').click(function(){
		$('.mask').css('display','none');
		$('.sb_bd').css('display','none');
		$('.pay').css('display','none');
		$('.add_user').css('display','none');
		$(".p_num").val("1");
		sumMoney();
	});
	/* 关闭按钮 */

	/*计算总额*/
	$('#p_num').bind('input propertychange',function(){
		sumMoney();
		
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

	$('.fn_select ul > li').click(function(){
		$(".imgShow").css("display","none");
		var str = $(this).text();
		$(this).parent().prev().text(str);
		$(this).parent().prev().attr('siteid',$(this).attr("value"));
		if($(this).parent().prev().text()=="全部"){
			//$(".addUserBtn").css("display","none");
			$(".addUserBtn").attr("disabled","ture");
			$(".addUserBtn").addClass("btuuseradd")
		}else{
			$(".addUserBtn").removeAttr("disabled");
			$(".addUserBtn").removeClass("btuuseradd")
			//$(".addUserBtn").css("display","block");
		}
		$(this).parent().css('display','none');
		var tableNum=$('.cn_table .on').index();
		switch (tableNum) {
		case 0:
			getOnLineList(1);//获取在线人数
			getOnLineCount();//获取在线人数总页数
			break;
		case 1:
			getRegList(1,tableNum);//获取注册人数
			getRigCount(tableNum);//获取注册人数总页数
			break;
		case 2:
			getRegList(1,tableNum);//获取付费人数
			getRigCount(tableNum);//获取付费人数总页数
			break;
		case 3:
			getRegNoPay(1);//获取注册未付费人数
			getRegNoPayCount();//获取注册未付费人数总页数
			break;
		case 4:
			getRunOfflist(1);//获取流失人数
			getRunOffAcount();//获取流失人数总页数
			break;
		case 5:
			getAutonym(1);//获取实名认证待处理人数
			getRealUserCount();//获取实名认证待审核人数总页数
			break;
		}
		
	});
	$(".qu_btn").click(function(){
		$(".imgShow").css("display","none");
		if(!phoneReg.test($(".nameby").val())){
			msg("请输入正确的用户名",false);
			return;
		}
		var tableNum=$('.cn_table .on').index();
		switch (tableNum) {
		case 0:
			getOnLineList(1);//获取在线人数
			getOnLineCount();//获取在线人数总页数
			break;
		case 1:
			getRegList(1,tableNum);//获取注册人数
			getRigCount(tableNum);//获取注册人数总页数
			break;
		case 2:
			getRegList(1,tableNum);//获取付费人数
			getRigCount(tableNum);//获取付费人数总页数
			break;
		case 3:
			getRegNoPay(1);//获取注册未付费人数
			getRegNoPayCount();//获取注册未付费人数总页数
			break;
		case 4:
			getRunOfflist(1);//获取流失人数
			getRunOffAcount();//获取流失人数总页数
			break;
		case 5:
			getAutonym(1);//获取实名认证待处理人数;
			getRealUserCount();//获取实名认证待审核人数总页数
			break;
		}
	})
	
	$('.nameby').keypress(function(e){//跳转到某页回车事件
		$(".imgShow").css("display","none");
		if(e.keyCode==13){
			if(!phoneReg.test($(".nameby").val())){
				msg("请输入正确的用户名",false);
				return;
			}
			var tableNum=$('.cn_table .on').index();
			switch (tableNum) {
			case 0:
				getOnLineList(tableNum);//获取在线人数
				getOnLineCount();//获取在线人数总页数
				break;
			case 1:
				getRegList(1,tableNum);//获取注册人数
				getRigCount(tableNum);//获取注册人数总页数
				break;
			case 2:
				getRegList(1,tableNum);//获取付费人数
				getRigCount(tableNum);//获取付费人数总页数
				break;
			case 3:
				getRegNoPay(1);//获取注册未付费人数
				getRegNoPayCount();//获取注册未付费人数总页数
				break;
			case 4:
				getRunOfflist(1);//获取流失人数
				getRunOffAcount();//获取流失人数总页数
				break;
			case 5:
				getAutonym(1);//获取实名认证待处理人数;
				getRealUserCount();//获取实名认证待审核人数总页数
				break;
			}
			
		}
	});
	
	
	/* 下拉列表方法 */

	/* 事件绑定 */
}

function init(){
	$(".imgShow").css("display","none");
	if(state==1){
		getRunOfflist(1);//获取流失人数
		getRunOffAcount();//获取流失人数总页数
	}else{
		getOnLineList(1);//获取在线人数
		getOnLineCount();//获取在线人数总页数
	}	
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


function getOnLineList(n){//获取在线用户
	$(".imgShow").css("display","none");
	rand = Math.random(); 
	var siteId=$(".fn_select span").attr("siteid")==undefined?'':$(".fn_select span").attr("siteid");
	var userName=$(".nameby").val();

	var type = local.onLine;
	var keyName = local.onLine + siteId+userName;

	var myData = getDataList(type,n,keyName);
	if(n==1&&date[type]&&myData){
		isUpdate(0,type);
	}
	if (myData && true) {
		$('.ta_list li').remove();
		onLineHtml(myData);
	} else {
		
		listAjax({
			url:'/siteCustomer/getOnlineUser',
			siteId: siteId,
			userName:userName,
			curPage:n,
			rand:rand,
			keyName:keyName,
			type:type
		},onLineHtml)
	}
}

// 在线用户渲染
function onLineHtml(data) {
	if(data.code==200){
		var htmls = '';
		for(var i=0;i<data.data.length;i++){
			htmls+='<li value='+data.data[i].siteid+'>'+
				'<span class="t1">'+data.data[i].username+'</span>'+
				'<span class="t2">'+(data.data[i].state=='0'?'未认证':data.data[i].state=='1'?'未认证':data.data[i].state=='2'?'未认证':'已认证')+'</span>'+
				'<span class="t3">'+parseFloat(data.data[i].transaction_amount).toFixed2(2)+'</span>'+
				'<span class="t4">'+parseFloat(data.data[i].allMoney).toFixed2(2)+'</span>'+
				'<span class="t5">'+data.data[i].allNum+'</span>'+
				'<span class="t6">'+data.data[i].site_name+'</span>'+
				'<span class="t7"><i class="i_btn toPay">充值</i><i class="i_btn block">故障恢复</i></span>'+
				'</li>';
		}
		$('.in_user_table .ta_list').html(htmls);
		$(".nameby").val("");
		$(".pager").css("display","block");
		make();
	}else if(data.code==201){
		$(".pager").css("display","none");
		$(".imgShow").css("display","block");
		$(".marked").text(data.msg);
	}else if(data.code==202){
		$(".pager").css("display","none");
		$(".imgShow").css("display","block");
		$(".marked").text(data.msg);
	}
}

/*获取在线人数总页数*/
function getOnLineCount(){
	rand = Math.random(); 
	var siteId=$(".fn_select span").attr("siteid")==undefined?'':$(".fn_select span").attr("siteid");
	var userName=$(".nameby").val();

	var type = pageCount.onLine;
	var keyName = pageCount.onLine + siteId +userName;

	var pageData = getPageData(type,keyName);
	if (pageData) {
		$(".page_cont i").eq(0).text(pageData.totoalNum==0?0:1);
		$(".page_cont i").eq(1).text(pageData.totoalNum);
	} else {
		pageCountAjax({
			url:'/siteCustomer/getOnlineUserCount',
			siteId: siteId,
			userName:userName,
			rand:rand,
			keyName:keyName,
			type:type
		})
	}



	// $.ajax({
	// 	type: 'post',
	// 	url: ctx+'/siteCustomer/getOnlineUserCount',
	// 	data: {
	// 		siteId: siteId,
	// 		userName:userName,
	// 		rand:rand
	// 	},
	// 	success: function(data){
	// 		if(data=="loseSession"){
	// 			 window.location.href=ctx+"/toLogin";
	// 			 return;
	// 		}
	// 		data = JSON.parse(data);
	// 		$(".page_cont i").eq(0).text(data.totoalNum==0?0:1);
	// 		$(".page_cont i").eq(1).text(data.totoalNum);
    //
	// 	}
	// });
}
/*获取用户使用时长*/
function getOnLineTimeList(n){//获取在线用户
	$(".imgShow").css("display","none");
	rand = Math.random();
	var siteId=$(".fn_select span").attr("siteid")==undefined?'':$(".fn_select span").attr("siteid");
	var userName=$(".nameby").val();

	var type = local.onLine;
	var keyName = local.onLine + siteId+userName;

	var myData = getDataList(type,n,keyName);
	if(n==1&&date[type]&&myData){
		isUpdate(0,type);
	}
	if (myData && true) {
		$('.ta_list li').remove();
		onLineHtml(myData);
	} else {

		listAjax({
			url:'/siteCustomer/getOnlineUser',
			siteId: siteId,
			userName:userName,
			curPage:n,
			rand:rand,
			keyName:keyName,
			type:type
		},onLineHtml)
	}
}
/*获取在线时长人数总页数*/
function getOnLineTimeCount(status){

}
/********用户使用时长界面渲染*********/
// 在线用户渲染
function onLineHtml(data) {
	if(data.code==200){
		var htmls = '';
		for(var i=0;i<data.data.length;i++){
			htmls+='<li value='+data.data[i].siteid+'>'+
				'<span class="t1">'+data.data[i].username+'</span>'+
				'<span class="t2">'+parseFloat(data.data[i].transaction_amount).toFixed2(2)+'</span>'+
				'<span class="t3">'+parseFloat(data.data[i].allMoney).toFixed2(2)+'</span>'+
				'<span class="t4">'+data.data[i].allNum+'</span>'+
				'</li>';
		}
		$('.un_user_table .ta_list').html(htmls);
		$(".nameby").val("");
		$(".pager").css("display","block");
		make();
	}else if(data.code==201){
		$(".pager").css("display","none");
		$(".imgShow").css("display","block");
		$(".marked").text(data.msg);
	}else if(data.code==202){
		$(".pager").css("display","none");
		$(".imgShow").css("display","block");
		$(".marked").text(data.msg);
	}
}
/*************获取注册用户*******************/
function getRegList(n,status){//获取注册用户
	rand = Math.random(); 
	var siteId=$(".fn_select span").attr("siteid")==undefined?'':$(".fn_select span").attr("siteid");
	var userName=$(".nameby").val();
	var type = local.regUser + status;
	var keyName = local.regUser+status +siteId +userName;
	var myData = getDataList(type,n,keyName);
	console.log(n+"----"+date[type]+"----"+myData);
	
	if(n==1&&date[type]&&myData){
		if(status==1){
			isUpdate(1,type);
		}else{
		    isUpdate(2,type);
		}
	}
	
//	getRigCount(status);//获取注册人数总页数
	
	myData = getDataList(type,n,keyName);
	
	if (myData && true) {
		$('.ta_list li').remove();
		regHtml(myData,status);
	} else {
		listAjax({
			url:'/siteCustomer/getUserInfos',
			siteId: siteId,
			userName:userName,
			curPage:n,
			rand:rand,
			status:status,
			keyName:keyName,
			type:type
		},regHtml)
	}

	// $.ajax({
	// 	type: 'post',
	// 	url: ctx+'/siteCustomer/getUserInfos',
	// 	data: {
	// 		siteId: siteId,
	// 		userName:userName,
	// 		curPage:n,
	// 		status:status,
	// 		rand:rand
	// 	},
	// 	success: function(data){
	// 		if(data=="loseSession"){
	// 			 window.location.href=ctx+"/toLogin";
	// 			 return;
	// 		}
	// 		setDataList(data,keyName,n)
	// 		data = JSON.parse(data);
	// 		$('.ta_list li').remove();
	//
	// 	}
	// });
}

// 注册用户渲染
function regHtml(data,status) {
	if(data.code==200){
		var htmls = '';
		if(status==1){
			$(".user_table .t2").text("实名认证");
			for(var i=0;i<data.data.length;i++){
				htmls+='<li value='+data.data[i].siteid+'>'+
					'<span class="t1">'+data.data[i].user_name+'</span>'+
					'<span class="t2">'+(data.data[i].state=='0'?'未认证':data.data[i].state=='1'?'未认证':data.data[i].state=='2'?'未认证':'已认证')+'</span>'+
					'<span class="t3">'+parseFloat(data.data[i].transaction_amount).toFixed2(2)+'</span>'+
					'<span class="t4">'+parseFloat(data.data[i].allMoney).toFixed2(2)+'</span>'+
					'<span class="t5">'+data.data[i].allNum+'</span>'+
					'<span class="t6">'+data.data[i].site_name+'</span>';
				if(status=="1"){
					htmls+=	'<span class="t7"><i class="i_btn toPay">充值</i></span>';
				}else{
					console.log(data.data[i].isLock)
					if(data.data[i].isLock==0){
						htmls+='<span class="t7"><i class="i_btn toPay">充值</i><i class="i_btn noclear">解锁</i><i class="i_btn ty">'+(data.data[i].is_try=='0'?'停用':'启用')+'</i></span>';
					}else if(data.data[i].isLock==1){
						htmls+='<span class="t7"><i class="i_btn toPay">充值</i><i class="i_btn clear">解锁</i><i class="i_btn ty">'+(data.data[i].is_try=='0'?'停用':'启用')+'</i></span>';

					}
				}
				htmls+='</li>';
			}

		}else{
			$(".user_table .t2").text("账户余量");
			for(var i=0;i<data.data.length;i++){
				console.log(data.data[i].total_flow)
				htmls+='<li value='+data.data[i].siteid+'>'+
					'<span class="t1">'+data.data[i].user_name+'</span>'+
					'<span class="t2">'+
					'<span style="width:100%;height:20px;font-size:10px;float:left;line-height:20px;color:#333;" class="'+(data.data[i].expiration_time=="null"?"noFlow":"")+'">'+(data.data[i].expiration_time=="null"?"":data.data[i].expiration_time)+'</span>' +
					'<span style="width:100%;height:20px;float:left;font-size:10px;line-height:20px;color:#333;" class="'+(data.data[i].total_flow=="null"?"noFlow":data.data[i].total_flow==0?"noFlow":"")+'">' +(data.data[i].total_flow=="null"?0:data.data[i].total_flow==undefined?0:data.data[i].total_flow==0?0:((parseInt(data.data[i].total_flow)-parseInt(data.data[i].used_flow==undefined?0:data.data[i].used_flow))/1024))+'&nbsp;M</span>' +
					'</span>'+
					'<span class="t3">'+parseFloat(data.data[i].transaction_amount).toFixed2(2)+'</span>'+
					'<span class="t4">'+parseFloat(data.data[i].allMoney).toFixed2(2)+'</span>'+
					'<span class="t5">'+data.data[i].allNum+'</span>'+
					'<span class="t6">'+data.data[i].site_name+'</span>';
				if(status=="1"){
					htmls+=	'<span class="t7"><i class="i_btn toPay">充值</i></span>';
				}else{
					if(data.data[i].isLock==0){
						htmls+='<span class="t7"><i class="i_btn toPay">充值</i><i class="i_btn noclear">解锁</i><i class="i_btn ty">'+(data.data[i].is_try=='0'?'停用':'启用')+'</i></span>';
					}else if(data.data[i].isLock==1){
						htmls+='<span class="t7"><i class="i_btn toPay">充值</i><i class="i_btn clear">解锁</i><i class="i_btn ty">'+(data.data[i].is_try=='0'?'停用':'启用')+'</i></span>';

					}
				}
				htmls+='</li>';
			}

		}
		$('.user_table .ta_list').html(htmls);
		$(".pager").css("display","block");
		$(".noFlow").css("text-decoration","line-through");
		make();

	}else if(data.code==201){
		$(".imgShow").css("display","block");
		$(".marked").text(data.msg);
		$(".pager").css("display","none");
	}else if(data.code==202){
		$(".imgShow").css("display","block");
		$(".marked").text(data.msg);
		$(".pager").css("display","none");
	}
}

/*获取注册人数总页数*/
function getRigCount(status){
	rand = Math.random(); 
	var siteId=$(".fn_select span").attr("siteid")==undefined?'':$(".fn_select span").attr("siteid");
	var userName=$(".nameby").val();

	var type = pageCount.regUser + status + 'Count';
	var keyName = type + siteId +userName;

	var pageData = getPageData(type,keyName);
	if (pageData) {

		$(".page_cont i").eq(0).text(pageData.totoalNum==0?0:1);
		$(".page_cont i").eq(1).text(pageData.totoalNum);
	} else {
		pageCountAjax({
			url:'/siteCustomer/getUserInfoCount',
			siteId: siteId,
			userName:userName,
			rand:rand,
			status:status,
			keyName:keyName,
			type:type
		})
	}



	// $.ajax({
	// 	type: 'post',
	// 	url: ctx+'/siteCustomer/getUserInfoCount',
	// 	data: {
	// 		siteId: siteId,
	// 		userName:userName,
	// 		status:status,
	// 		rand:rand
	// 	},
	// 	success: function(data){
	// 		if(data=="loseSession"){
	// 			 window.location.href=ctx+"/toLogin";
	// 			 return;
	// 		}
	// 		data = JSON.parse(data);
	// 		$(".page_cont i").eq(0).text(data.totoalNum==0?0:1);
	// 		$(".page_cont i").eq(1).text(data.totoalNum);
    //
	// 	}
	// });
}

function getRegNoPay(n){//获取注册未付费用户
	rand = Math.random(); 
	var siteId=$(".fn_select span").attr("siteid")==undefined?'':$(".fn_select span").attr("siteid");
	var userName=$(".nameby").val();

	var type = local.noPay;
	var keyName = local.noPay + siteId +userName;

	var myData = getDataList(type,n,keyName);
	console.log(myData);
	console.log(date[type]);
	if(n==1&&date[type]&&myData){
		isUpdate(3,type);
	}
	if (myData && true) {
		$('.ta_list li').remove();
		noPayHtml(myData);
	} else {
		listAjax({
			url:'/siteCustomer/getUserNoPay',
			siteId: siteId,
			userName:userName,
			curPage:n,
			rand:rand,
			keyName:keyName,
			type:type
		},noPayHtml)
	}




	// $.ajax({
	// 	type: 'post',
	// 	url: ctx+'/siteCustomer/getUserNoPay',
	// 	data: {
	// 		siteId: siteId,
	// 		userName:userName,
	// 		curPage:n,
	// 		rand:rand
	// 	},
	// 	success: function(data){
	// 		if(data=="loseSession"){
	// 			 window.location.href=ctx+"/toLogin";
	// 			 return;
	// 		}
	// 		$('.ta_list li').remove();
	// 		data = JSON.parse(data);
	// 		noPayHtml(data)
	//
	// 	}
	// });
}

function noPayHtml(data) {
	if(data.code==200){
		var htmls = '';
		for(var i=0;i<data.data.length;i++){
			htmls+='<li value='+data.data[i].siteid+'>'+
				'<span class="t1">'+data.data[i].user_name+'</span>'+
				'<span class="t2">'+(data.data[i].state=='0'?'未认证':data.data[i].state=='1'?'未认证':data.data[i].state=='2'?'未认证':'已认证')+'</span>'+
				'<span class="t6">'+data.data[i].site_name+'</span>'+
				//'<span class="t7"><i class="i_btn toPay">充值</i></span>'+//<i class="i_btn clear">解锁</i><i class="i_btn ty">停用</i>
				'</li>'
		}
		$('.w_user_table .ta_list').html(htmls);
		$(".pager").css("display","block");
		make();
	}else if(data.code==201){
		$(".imgShow").css("display","block");
		$(".marked").text(data.msg);
		$(".pager").css("display","none");
	}else if(data.code==202){
		$(".imgShow").css("display","block");
		$(".marked").text(data.msg);
		$(".pager").css("display","none");
	}
}
/*获取注册未付费人数总页数*/
function getRegNoPayCount(){
	rand = Math.random(); 
	var siteId=$(".fn_select span").attr("siteid")==undefined?'':$(".fn_select span").attr("siteid");
	var userName=$(".nameby").val();

	var type = pageCount.noPay;
	var keyName = pageCount.noPay + siteId +userName;

	var pageData = getPageData(type,keyName);
	if (pageData) {

		$(".page_cont i").eq(0).text(pageData.totoalNum==0?0:1);
		$(".page_cont i").eq(1).text(pageData.totoalNum);
	} else {
		pageCountAjax({
			url:'/siteCustomer/getUserNoPayCount',
			siteId: siteId,
			userName:userName,
			rand:rand,
			keyName:keyName,
			type:type
		})
	}

	// $.ajax({
	// 	type: 'post',
	// 	url: ctx+'/siteCustomer/getUserNoPayCount',
	// 	data: {
	// 		siteId: siteId,
	// 		userName:userName,
	// 		rand:rand
	// 	},
	// 	success: function(data){
	// 		if(data=="loseSession"){
	// 			 window.location.href=ctx+"/toLogin";
	// 			 return;
	// 		}
	// 		data = JSON.parse(data);
	// 		$(".page_cont i").eq(0).text(data.totoalNum==0?0:1);
	// 		$(".page_cont i").eq(1).text(data.totoalNum);
    //
	// 	}
	// });
}
function getRunOfflist(n){//获取流失用户
	rand = Math.random(); 
	var siteId=$(".l_us_query .fn_select span").attr("siteid")==undefined?'':$(".l_us_query .fn_select span").attr("siteid");
	var startTime=$("#sTime").val()==undefined?'':$("#sTime").val();
	var endTime=$("#eTime").val()==undefined?'':$("#eTime").val();

	var type = local.runOff;
	var keyName = local.runOff + siteId +startTime+endTime;

	var myData = getDataList(type,n,keyName);
	console.log(myData);
	if(n==1&&date[type]&&myData){
		isUpdate(4,type);
	}
	if (myData && true) {
		$('.ta_list li').remove();
		runOffHtml(myData);
	} else {
		listAjax({
			url:'/siteCustomer/getRunOffUser',
			siteId: siteId,
			curPage:n,
			rand:rand,
			startTime:startTime,
			endTime:endTime,
			keyName:keyName,
			type:type
		},runOffHtml)
	}
	
	// $.ajax({
	// 	type: 'post',
	// 	url:  ctx+'/siteCustomer/getRunOffUser',
	// 	data: {
	// 		siteId: siteId,
	// 		startTime:startTime,
	// 		endTime:endTime,
	// 		curPage:n,
	// 		rand:rand
	// 	},
	// 	success: function(data){
	// 		if(data=="loseSession"){
	// 			 window.location.href=ctx+"/toLogin";
	// 			 return;
	// 		}
	// 		$('.ta_list li').remove();
	// 		data = JSON.parse(data);
	// 		runOffHtml(data)
	// 	}
	// });
}

function runOffHtml(data) {
	if(data.code==200){
		var htmls = '';
		for(var i=0;i<data.data.length;i++){
			htmls+='<li>'+
				'<span class="t1">'+data.data[i].user_name+'</span>'+
				'<span class="t3">'+data.data[i].expiration_time+'</span>'+
				'<span class="t3">'+parseFloat(data.data[i].transaction_amount).toFixed2(2)+'</span>'+
				'<span class="t4">'+parseFloat(data.data[i].allMoney).toFixed2(2)+'</span>'+
				'<span class="t5">'+data.data[i].allNum+'</span>'+
				'<span class="t6">'+data.data[i].site_name+'</span>'+
				'</li>'
		}
		$('.l_user_table .ta_list').html(htmls);
		$(".pager").css("display","block");
		make();
	}else if(data.code==201){
		$(".imgShow").css("display","block");
		$(".marked").text(data.msg);
		$(".pager").css("display","none");
	}else if(data.code==202){
		$(".imgShow").css("display","block");
		$(".marked").text(data.msg);
		$(".pager").css("display","none");
	}
}
/*获取流失用户人数的总页数*/
function getRunOffAcount(){
	rand = Math.random(); 
	var siteId=$(".l_us_query .fn_select span").attr("siteid")==undefined?'':$(".l_us_query .fn_select span").attr("siteid");
	var startTime=$("#sTime").val()==undefined?'':$("#sTime").val();
	var endTime=$("#eTime").val()==undefined?'':$("#eTime").val();
	var type = pageCount.runOff;
	var keyName = pageCount.runOff + siteId +startTime+endTime;

	var pageData = getPageData(type,keyName);
	if (pageData) {

		$(".page_cont i").eq(0).text(pageData.totoalNum==0?0:1);
		$(".page_cont i").eq(1).text(pageData.totoalNum);
		$(".l_num span").text(pageData.data);
	} else {
		pageCountAjax({
			url:'/siteCustomer/getRunOffUserCount',
			siteId: siteId,
			startTime:startTime,
			endTime:endTime,
			rand:rand,
			keyName:keyName,
			type:type
		},function (data) {
			$(".l_num span").text(data.data);
		})
	}

	// $.ajax({
	// 	type: 'post',
	// 	url:  ctx+'/siteCustomer/getRunOffUserCount',
	// 	data: {
	// 		siteId: siteId,
	// 		startTime:startTime,
	// 		endTime:endTime,
	// 		rand:rand
	// 	},
	// 	success: function(data){
	// 		if(data=="loseSession"){
	// 			 window.location.href=ctx+"/toLogin";
	// 			 return;
	// 		}
	// 		data = JSON.parse(data);
	// 		$(".page_cont i").eq(0).text(data.totoalNum==0?0:1);
	// 		$(".page_cont i").eq(1).text(data.totoalNum);
	// 		$(".l_num span").text(data.data);
	// 	}
	// });
}


function getAutonym(n){//获取实名认证列表
	rand = Math.random();

	var type = local.autonym;
	var keyName = local.autonym;

	var myData = getDataList(type,n,keyName);
	console.log(myData);
	if(n==1&&date[type]&&myData){
		isUpdate(5,type);
	}
	if (myData && true) {
		$('.ta_list li').remove();
		realUser(myData);
	} else {
		listAjax({
			url:'/personalRealName/selRealNameUserNum',
			curPage:n,
			rand:rand,
			keyName:keyName,
			type:type
		},realUser)
	}

	// $.ajax({
	// 	type: 'post',
	// 	url: ctx+'/personalRealName/selRealNameUserNum',
	// 	data: {
	// 		curPage:n,
	// 		rand:rand
	// 	},
	// 	success: function(data){
	// 		if(data=="loseSession"){
	// 			 window.location.href=ctx+"/toLogin";
	// 			 return;
	// 		}
	// 		$('.ta_list li').remove();
	// 		data = JSON.parse(data);
	// 		realUser(data)
	// 	}
	// });
}

// 实名html渲染
function realUser(data) {
	if(data.code==200){
		var htmls = '';
		for(var i=0;i<data.data.length;i++){
			htmls+='<li value='+data.data[i].id+'>'+
				'<span>'+data.data[i].telephone+'</span>'+
				'<span>'+data.data[i].userName+'</span>'+
				'<span>'+data.data[i].idCard+'</span>'+
				'<span>'+data.data[i].siteName+'</span>'+
				'<span style="line-height: 20px; padding: 10px 0;">'+data.data[i].address+'</span>'+
				'<span><img class="car1 tip" src="'+upLoadPath+data.data[i].cardImg+'"><img class="car2 tip" src="'+upLoadPath+data.data[i].userImg+'"></span>'+
				'<span><i style="margin-right: 2px" class="i_btn pass">通过审核</i><i class="i_btn refuse">拒绝通过</i></span>'+
				'</li>'
		}
		$('.s_user_table .ta_list').html(htmls);
		$(".pager").css("display","block");
		/* 查看身份证大图 */
		$('.car1').unbind('click');
		$('.car2').unbind('click');
		$('.car1').click(function(){
			var src1 = $(this).attr('src');
			var src2 = $(this).next().attr('src');
			$('.card1 img').attr('src',src1);
			$('.card2 img').attr('src',src2);
			$('.mask').css('display','block');
			$('.us_card').css('display','block');
		});
		$('.car2').click(function(){
			var src1 = $(this).prev().attr('src');
			var src2 = $(this).attr('src');
			$('.card1 img').attr('src',src1);
			$('.card2 img').attr('src',src2);
			$('.mask').css('display','block');
			$('.us_card').css('display','block');
		});
		/* 查看身份证大图 */

		/* 通过审核 */
		$('.pass').unbind('click');
		$('.pass').click(function(){
			rand = Math.random();
			var n = $('.pass').index(this);
			var realNameId= $('.s_user_table li').eq(n).attr("value");
			var userName= $('.s_user_table li').eq(n).find('span').eq(0).text();
			dhkalt("您是否通过实名认证审核",function(){
				$.ajax({
					type: 'post',
					url: ctx+'/personalRealName/checkSuccess',
					data: {
						realNameId:realNameId,
						telephone:userName,
						rand:rand
					},
					success: function(data){
						if(data=="loseSession"){
							window.location.href=ctx+"/toLogin";
							return;
						}
						data = JSON.parse(data);
						if(data.code==200){
							getAutonym(1);
							getRealUserCount();
						}else if(data.code==201){
							msg(data.msg,false);
						}
					}
				});
			})
		});
		/* 通过审核 */

		/* 拒绝通过审核 */
		$('.refuse').unbind('click');
		$('.refuse').click(function(){
			rand = Math.random();
			var n = $('.refuse').index(this);
			var realNameId= $('.s_user_table li').eq(n).attr("value");
			var userName= $('.s_user_table li').eq(n).find('span').eq(0).text();
			dhkalt("您是否拒绝实名认证审核",function(){
				$.ajax({
					type: 'post',
					url: ctx+'/personalRealName/checkFail',
					data: {
						realNameId:  realNameId,
						telepone: userName,
						rand:rand
					},
					success: function(data){
						if(data=="loseSession"){
							window.location.href=ctx+"/toLogin";
							return;
						}
						data = JSON.parse(data);
						if(data.code==200){
							getAutonym(1);
							getRealUserCount();
						}
						else if(data.code==201){
							msg(data.msg,false);
						}
					}
				});
			})
		});
		/* 拒绝通过审核 */
	}else if(data.code==201){
		$(".imgShow").css("display","block");
		$(".marked").text(data.msg);
		$(".pager").css("display","none");
	}else if(data.code==202){
		$(".imgShow").css("display","block");
		$(".marked").text(data.msg);
		$(".pager").css("display","none");
	}
}

function getRealUserCount(){
	rand = Math.random();

	var type = pageCount.autonym;
	var keyName = pageCount.autonym;

	var pageData = getPageData(type,keyName);
	if (pageData) {

		$(".page_cont i").eq(0).text(pageData.totoalNum==0?0:1);
		$(".page_cont i").eq(1).text(pageData.totoalNum);
		$(".s_num span").text(pageData.data);
	} else {
		pageCountAjax({
			url:'/personalRealName/getRealUserCount',
			rand:rand,
			keyName:keyName,
			type:type
		},function (data) {
			$(".s_num span").text(data.data);
		})
	}

	// $.ajax({
	// 	type: 'post',
	// 	url:  ctx+'/personalRealName/getRealUserCount',
	// 	data: {
	// 		rand:rand
	// 	},
	// 	success: function(data){
	// 		if(data=="loseSession"){
	// 			 window.location.href=ctx+"/toLogin";
	// 			 return;
	// 		}
	// 		data = JSON.parse(data);
	// 		$(".page_cont i").eq(0).text(data.totoalNum==0?0:1);
	// 		$(".page_cont i").eq(1).text(data.totoalNum);
	// 		$(".s_num span").text(data.data);
	// 	}
	// });
}

 function IdentityCodeValid(code) { 
    var city={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江 ",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北 ",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏 ",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外 "};
    var tip = "";
    var pass= true;
            
    if(!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)){
        tip = "身份证号格式错误";
        pass = false;
    }
            
    else if(!city[code.substr(0,2)]){
        tip = "地址编码错误";
        pass = false;
    }
    else{
        //18位身份证需要验证最后一位校验位
        if(code.length == 18){
            code = code.split('');
    //∑(ai×Wi)(mod 11)
    //加权因子
    var factor = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ];
    //校验位
    var parity = [ 1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2 ];
    var sum = 0;
    var ai = 0;
    var wi = 0;
    for (var i = 0; i < 17; i++)
            {
                ai = code[i];
                wi = factor[i];
                sum += ai * wi;
            }
            var last = parity[sum % 11];
            if(parity[sum % 11] != code[17]){
                tip = "校验位错误";
                pass =false;
            }
        }
    }
    if(!pass) msg(tip,false);
    return pass;
}
 function dhkalt(str,callback){//弹出对话框，str == 对话框显示内容 callback == 点确定之后需要执行的方法
		$('.d_txt').html(str);
		$('.mask').css('display','block');
		$('.dhk').css('display','block');
		$('.dhqd_btn').unbind('click');
		$('.dhqd_btn').click(function(){
			if(callback){
				callback();
			}
			$('.mask').css('display','none');
			$('.dhk').css('display','none');
		});
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
function findUserTotalTime(siteId,userName,startDate,endDate,curPage){
	var d1=new Date(startDate);
	var d2=new Date(endDate);
	if(d1>new Date()){
		msg("请选择正确的时间范围",true);
		$('#cloudpage').hide();
		return false;
	}
	if(d1>d2){
//		alert(d2.getFullYear() + '-' + (d2.getMonth() + 1) + '-' + (d2.getDate()-1));
		$('#total_time_list').html("");
		msg("暂无数据",true);
		$("#cloudpage").css("display","none");
		$('#cloudpage').hide();
		return false;
	}
	var d3=d2.getFullYear() + '-' + (d2.getMonth() + 1) + '-' + (d2.getDate());
	var d4=new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + (new Date().getDate());
	var d5=d1.getFullYear() + '-' + (d1.getMonth() + 1) + '-' + (d1.getDate());
	if(startDate==endDate&&d3==d4){
		startDate=d2.getFullYear() + '-' + (d2.getMonth() + 1) + '-' + (d2.getDate()-1);
		endDate=d2.getFullYear() + '-' + (d2.getMonth() + 1) + '-' + (d2.getDate()-1);
	}else if(startDate==endDate&&d3<d4){
		
	}else if(startDate!=endDate&&d3==d4){
		endDate=d2.getFullYear() + '-' + (d2.getMonth() + 1) + '-' + (d2.getDate()-1);
	}else if(startDate!=endDate&&d3>d4&&d5==d4){
		startDate=d1.getFullYear() + '-' + (d1.getMonth() + 1) + '-' + (d1.getDate()-1);
	}
	$.ajax({
		type: 'post',
		url: ctx+'/allSiteOfReportStatistics/findUserTotalTime',
		data: {
			siteId:siteId,
			userName:userName,
			startDate:startDate,
			endDate:endDate,
			curPage:curPage,
			pageSize:10
		},
		success: function(data){
			$('#total_time_list').html("");
			//进行渲染
			data = JSON.parse(data);
                if(data.code == 200){
				var listUserTotalTimeInfo=data.data.listUserTotalTime;
				var htmls = '';
				for(var i=0;i<listUserTotalTimeInfo.length;i++){
					htmls +='<ul class="ls_list_info  ta_list" style="height: 56px;"><li style="width:16%;">'+listUserTotalTimeInfo[i].userName+'</li>'
					+'<li style="width:16%;">'+listUserTotalTimeInfo[i].siteName+'</li>'
					+'<li style="width:16%;">'+listUserTotalTimeInfo[i].total_time+'</li>'
					+'<li style="width:16%;">'+listUserTotalTimeInfo[i].startDate+'</li>'
					+'<li style="width:16%;">'+listUserTotalTimeInfo[i].endDate+'</li>'
					+'<li style="width:16%;">'+listUserTotalTimeInfo[i].create_time+'</li></ul>';
				}
				//数据渲染
				$('#total_time_list').html(htmls);
				//展示分页
				$('#cloudpage').show();
				//总页数展示
				$('#count').text(data.data.cout);
                }else{
                	msg("暂无数据",true);
                	$('#cloudpage').hide();
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