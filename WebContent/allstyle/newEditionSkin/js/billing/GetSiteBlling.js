var submitFlag=false;
var returnFlag=false;
var chargeIsStop=false;
var updateSubmitCheck=false;
var divNum;//获得焦点的未停用的div按钮
var divUseNum;//获得焦点的启用的div按钮
var updateNum;//获得未停用div修改按钮焦点
var comb=true;
var addStr='<input type="text" class="newAppNum" value="" placeholder="如:138211" onkeyup="this.value=this.value.replace(/\\D/g,\'\')" onafterpaste="this.value=this.value.replace(/\\D/g,\'\')" maxlength="7" >';
var dang=0;
var timeOrFlow=0;
//var hasChargePrice=0;
$(function() {
	addNewPage()
	/* -----------------时长流量切换  新--------------------- */
	$('#liul').click(function(){
		var ht="";
			ht+=" <li value='4'>M</li>";
			ht+=" <li value='5'>G</li>";
		$(".charging .payMold .payList li").remove();
		$(".charging .payList").html(ht);
		$(".charging .payMold > span").text('M');
		$(".charging .favorable > span").text('M');
		$(".add_price_type").val("4");
		$(".add_give_type").val("4");
		
		addNewPage();
	});
	$('#shic').click(function(){
		var ht="";
			ht+=" <li value='0'>时</li>";
			ht+=" <li value='1'>天</li>";
			ht+=" <li value='2'>月</li>";
		$(".charging .payList li").remove();
		$(".charging .payList").html(ht);
		$(".charging .payMold > span").text('时');
		$(".charging .favorable > span").text('时');
		$(".add_price_type").val("0");
		$(".add_give_type").val("0");
		addNewPage();
	});
	
	/* ---------------------------------------------- */
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
	
	/*$('html').contextmenu(function(){
		return false;
	});*/
	$(".icon-seek").click(function(){
		SitePriceConfigList();
	});
	buffer();
	//checkout();
	numdisp(dang);
	SitePriceConfigList();
	//getTotalPage();
	init();//初始化
	//新增计费绑定按钮
	$('.charging .appendNum').click(function(){
		$('.charging .appendNum').before(addStr);
		 $(".charging .comboNumList>input").blur(function () {
			 var inputResult=[];
			 var thisIndex=$('.charging .comboNumList>input').index(this);//当前失去焦点input的下标   -----用以排除当前元素value
			  $(".charging .comboNumList>input").each(function(){
				inputResult.push($(this).val());
			 });
			  if($(this).val()!=""){
				  for(var i=0;i<inputResult.length-1;i++){
					  if(inputResult[i]!="" && i!=thisIndex){
						  if(inputResult[i]==$(this).val()){
							  $(this).val("");
							  $(".win>span").html("您输入的套餐号段重复");
							  winHint();
							  return false;
						  }
					  }
				  }
				 
			  }
				 
		});
		checkCom();
	});
	
	//修改页面新增计费绑定按钮
	$('.amend .appendNum').click(function(){
		$('.amend .comboNumList .appendNum').before(addStr);
		 $(".amend .comboNumList>input").blur(function () {
			 var inputResult=[];
			 var thisIndex=$('.amend .comboNumList>input').index(this);//当前失去焦点input的下标   -----用以排除当前元素value
			  $(".amend .comboNumList>input").each(function(){
				inputResult.push($(this).val());
			 });
			  if($(this).val()!=""){
				  for(var i=0;i<inputResult.length-1;i++){
					  if(inputResult[i]!="" && i!=thisIndex){
						  if(inputResult[i]==$(this).val()){
							  $(this).val("");
							  $(".win>span").html("您输入的套餐号段重复");
							  winHint();
							  return false;
						  }
					  }
				  }
			  }
			 
		});
		 checkRepeat();
	});
	
	//归属集团绑定按钮
	$('.group').click(function(){
		if($('.group>ul').css('display')=='none'){
			$('.group>ul').css('display','block');
		}else{
			$('.group>ul').css('display','none');
		}
	});
	//归属集团选择绑定按钮
	$('.group>ul>li').click(function(){
		$('.group>ul').css('display','none');
		var n=$('.group>ul>li').index(this);
		var str=$('.group>ul>li').eq(n).html();
		$("#charge_attach").val($('.group>ul>li').eq(n).attr("value"));
		$('.group>span').html(str);
		return false;
	});
	
	$('.LorR').click(function(){
		var n=$('.LorR').index(this);
		var obj=$('.fessType>ul');
		var one=$('.fessType>ul>li').width();
		var zong=obj.width();
		var move=parseInt(obj.css('left'));
		if(n==1){
			dang++;
			if(dang>5){
				dang=5;
			}else{
				obj.animate({left:-dang*one});
			}
		}else{
			dang--;
			if(dang<0){
				dang=0;
			}else{
				obj.animate({left:-dang*one});
			}
		}
	});
	
	//新增计费页面归属集团绑定按钮
	$('.bloc').click(function(){
		if($('.blocList').css('display')=="none"){
			$('.blocList').css('display','block');
		}else{
			$('.blocList').css('display','none');
		}
	});
	//新增计费选择时间单位绑定按钮
	$('.charging .payMold>span').click(function(){
		if($('.jiu').css('display')=="none"){
			$('.jiu').css('display','block');
			if(timeOrFlow=0){
				
			}
		}else{
			$('.jiu').css('display','none');
		}
	});
	$('.charging .favorable>span').click(function(){
		if($('.xin').css('display')=="none"){
			$('.xin').css('display','block');
		}else{
			$('.xin').css('display','none');
		}
	});
	//启用和未启用按钮绑定
	$('.state>li').click(function(){
		var n=$('.state>li').index(this);
		$('.state>li').removeClass('on').eq(n).addClass('on');
		$('.stateList').css('display','none').eq(n).css('display','block');
		var val=$('.state>li').eq(1).attr("value");
		//val为0时调用查询方法,1的时候不在调用
		if(n==1&&val==0){
			$('.state>li').eq(1).attr("value","1");
			$(".blockList >.fuseCombo").remove();
			//$(".blockList .notFuseCombo").remove();
				getStopedPrice();
		}
		
	});
	//是否实行绑定按钮
	$('.yesOrNo').click(function(){
		var lang=$('.yesOrNo').length;
		var n=$('.yesOrNo').index(this);
		var str=$('.yesOrNo').eq(n).attr('class');
		if(n==lang-3){
			if("yesOrNo"==str){
				on_off(str,n);
				charge_on_off(str);
				
			}else{
				$('.yesOrNo').eq(1).addClass('on');
				$('.operator').css('display','none');
				on_off(str,n);
				charge_on_off(str);
				$(".fn-btn").attr("disabled", false);
			}
			
		}else if(n==lang-2){
			if("yesOrNo"==str){
				on_off(str,n);
				fuse_on_off(str);
			}else{
				on_off(str,n);
				fuse_on_off(str);
			}
			
		}else{
			on_off(str,n);
			PackageDetails_on_off(str);
		}
	});
	$('.goLeft').click(function(){
		dang--;
		if(dang<0){
			dang=0;
			numdisp(dang);
		}else{
			buffer();
			$('.num').removeClass('on').eq(dang).addClass('on');
			var nowPage=$('.num').eq(dang).html();
			SitePriceConfigList(nowPage);
			numdisp(dang);
		}
	});
	$('.goRight').click(function(){
		dang++;
		if(dang>$('.num').length-1){
			dang=$('.num').length-1;
			numdisp(dang);
		}else{
			buffer();
			$('.num').removeClass('on').eq(dang).addClass('on');
			var nowPage=$('.num').eq(dang).html();
			SitePriceConfigList(nowPage);
			numdisp(dang);
		}
	});
});

function init(){
	
//	$(".yesOrNo").eq(2).addClass("on");
//	$('.PackageDetails').css('display','none');
	
}
function fuse_on_off(str){
	if(str=="yesOrNo"){
		$(".PackageDetails").css('display','none');
		$('.fuse>.yesOrNo').addClass('on');
		$('.operator').css('display','none');
	}else{
		$('.fuse>.yesOrNo').removeClass('on');
		$('.operator').css('display','block');
		$(".PackageDetails").css('display','block');
	}
}
function charge_on_off(str){
	if(str=="yesOrNo"){
		
		$('.import').css('display','none');
		$('.fuse').css('display','none');
	}else{
		$(".PackageDetails").css('display','block');
		$('.import').css('display','block');
		
	}
}
function PackageDetails_on_off(str){
	if(str=="yesOrNo"){
		$('.PackageDetails').css('display','none');
	}else{
		$('.PackageDetails').css('display','block');
	}
}
function on_off(str,n){
	if(str=="yesOrNo"){
		$('.yesOrNo').eq(n).addClass('on');
	}else{
		$('.yesOrNo').eq(n).removeClass('on');
	}
	
}
function newPage(n){
	if(n!=0){
		$('.whether').css('display','block');
		
	}
};
//场所查询绑定回车事件
function goFindSite(e){
	var e=e||window.event;
    if (e.keyCode == 13) {
    	buffer();
    	SitePriceConfigList();
    	//getTotalPage();
    } 
	
}
function selAll(){
	buffer();
	SitePriceConfigList();
	//getTotalPage();
}

//获取分页列表
function SitePriceConfigList(){
	var selectVal  =$(".college").val().trim();
	$.ajax({
		type : "POST",
		url :ctx+ "/SitePriceBilling/getSitePriceConfigList",
		data : {
			siteName:selectVal
		},
		success :function(data){
			if(data=="loseSession"){
				 window.location.href=ctx+"/toLogin";
				 return ;
			}		 
			eval("data = " + data);
			if(data.code==1){
				getTable(data);
				var id=	$('#ulConfig .on').attr("value");
				getPrice(id);
				
				$("#ulConfig>li").click(function(){
					$('.floa').css('display','none');
					buffer();
					var n=$('#ulConfig>li').index(this);
					if(n!=0){
						$('#ulConfig>li').removeClass('on').eq(n).addClass('on');
						$('.timeType').removeClass('on').eq(0).addClass('on');
						$(".siteName").html($("#ulConfig>.on >span").eq(0).html());
						$(".siteAddress").html($("#ulConfig>.on>span").eq(1).html());
						$('.state>li').removeClass('on').eq(0).addClass('on');
						$('.stateList').css('display','none').eq(0).css('display','block');
						
					}
					$("#hasChargeType").val("0");
					$('.state>li').eq(1).attr("value","0");
					var id=$("#ulConfig>li.on").attr("value");
					getPrice(id);
				});
			}else if(data.code=2){
				$(".win>span").html("没有查到此场所");
				winHint();
			}else{
				$(".win>span").html(data.msg);
				winHint();
			}
		}
	});
}
//生成列表start
function getTable(data){
	$(".siteTable").remove();
	var lihtml="";
	for(var i = 0;i<data.data.length;i++){
			lihtml+="<li class='siteTable' value="+data.data[i].id+"><span title='"+data.data[i].site_name+"'>"+data.data[i].site_name+"</span><span title='"+data.data[i].address+"'>"+data.data[i].address+"</span><i class='icon icon-left'></i></li>";
	}
	$("#firstLi").after(lihtml);
	$(".siteTable").eq(0).addClass("on");
	$(".siteName").html($(".on >span").eq(0).html());
	$(".siteAddress").html($(".on>span").eq(1).html());
}
//获取未停用付费类型 时,日,月
function getPrice(id){
	$.ajax({
		type:"POST",
		url:ctx+"/SitePriceBilling/getUserSiteNoStopedPayType",
		data:{
			sendTime: (new Date()).getTime(),
			uId:id
		},
		success: function(data){
			if(data=="loseSession"){
				 window.location.href=ctx+"/toLogin";
				 return;
			}	 
			eval("data = " + data);
			if(data.code==200){
				getUserPrice(data);
				addNewPage();
			}else{
				$(".useList>div").remove();
				$(".win>span").html("该场所下未设置套餐,请添加收费套餐");
				win();
			}
			
		}
	});
}

//获取已停用付费类型 时,日,月
function getStopedPrice(){
	var id=$("#ulConfig>li.on").attr("value");
	$.ajax({
		type:"POST",
		url:ctx+"/SitePriceBilling/getUserSiteIsStopedPayType",
		data:{
			sendTime: (new Date()).getTime(),
			uId:id
		},
		success: function(data){
			if(data=="loseSession"){
				 window.location.href=ctx+"/toLogin";
				 return;
			}	
			eval("data = " + data);
			if(data.code==200){
				getUserStopedPrice(data);
				addNewPage();
			}else{
				$(".blockList .fuseCombo").remove();
				$(".win>span").html("该场所下无停用的套餐");
				winHint();
			}
			
		}
	});
}
//获得已停用套餐价格列表
function getUserStopedPrice(data){
	$(".blockList .fuseCombo").remove();
	$(".move").attr("style",0);
	var priceHtml="";
	
	for(var i=0;i<data.data.length;i++){
		for(var j=i+1;j<data.data.length;j++){
				if(data.data[i].name==data.data[j].name&&data.data[i].comboNumber!=data.data[j].comboNumber&&data.data[i].name!=undefined&&data.data[j].name!=undefined){
					if(data.data[i].comboNumber==undefined){	
						priceHtml+="<div class='fuseCombo fuseComboStop'>";
						priceHtml+="<div class='chargeInfo'>";
						priceHtml+="<div class='zfInfo'>";
						priceHtml+="<p class='short qyShort' ypriceType="+data.data[i].v2_givemeal_unit+"  yPirceNum="+data.data[i].v2_give_meal+" recommendValue="+data.data[i].v2_recommend_state +"  value="+data.data[i].price_num+" payType="+data.data[i].price_type+">资费名称：<span class='zfName'>"+data.data[i].name+"</span></p>";
						if(data.data[j].price_type>3){
							
							priceHtml+="<p>资费类型：<span class='zfType'>流量</span></p>";
						}else{
							priceHtml+="<p>资费类型：<span class='zfType'>时长</span></p>";
						}
						priceHtml+="<p class='short shortStopPrice'>收费价格：<span class='zfMoney'>"+data.data[i].unit_price+"元</span></p>";
						if(data.data[j].charge_type==1){
							priceHtml+="<p class='qyMeal' value="+data.data[j].charge_type+">融合套餐：<span class='rhMoney'>"+data.data[j].unit_price+"元</span>&nbsp;&nbsp;<span class='rhName'>中国电信</span></p>";
						}else if(data.data[j].charge_type==2){
							priceHtml+="<p class='qyMeal' value="+data.data[j].charge_type+">融合套餐：<span class='rhMoney'>"+data.data[j].unit_price+"元</span>&nbsp;&nbsp;<span class='rhName'>中国移动</span></p>";
						}else{
							priceHtml+="<p class='qyMeal' value="+data.data[j].charge_type+">融合套餐：<span class='rhMoney'>"+data.data[j].unit_price+"元</span>&nbsp;&nbsp;<span class='rhName'>中国联通</span></p>";
						}
						priceHtml+="</div>";
						if(data.data[j].v2_describe!=""){
							
							priceHtml+="<div class='zfExplain'>";
							priceHtml+="<h6>资费说明：</h6>";
							priceHtml+="<p title="+data.data[j].v2_describe+">"+data.data[j].v2_describe+"</p>";
							priceHtml+="</div>";
						}
						priceHtml+="</div>";
						//if(data.data[j].comboNumber.split(";").length>2){
							priceHtml+="<input class='dnseg' type='hidden' value="+data.data[j].comboNumber+">";
//						}else{
//							priceHtml+="<input class='dnseg' type='hidden' value="+data.data[j].comboNumber.replace(";",",")+">";
//						}
						priceHtml+="<p class='operate'><span class='qy'>启&nbsp;用</span></p>";
						priceHtml+="<em class='edit'><i class='icon icon-edit'></i></em>";
						priceHtml+="</div>";
					}
					if(data.data[j].comboNumber==undefined){
						priceHtml+="<div class='fuseCombo fuseComboStop'>";
						priceHtml+="<div class='chargeInfo'>";
						priceHtml+="<div class='zfInfo'>";
						priceHtml+="<p class='short qyShort' ypriceType="+data.data[j].v2_givemeal_unit+"  yPirceNum="+data.data[j].v2_give_meal+" recommendValue="+data.data[j].v2_recommend_state +" value="+data.data[j].price_num+" payType="+data.data[j].price_type+">资费名称：<span class='zfName'>"+data.data[j].name+"</span></p>";
						
						if(data.data[i].price_type>3){
							
							priceHtml+="<p>资费类型：<span class='zfType'>流量</span></p>";
						}else{
							priceHtml+="<p>资费类型：<span class='zfType'>时长</span></p>";
						}
						priceHtml+="<p class='short shortStopPrice'>收费价格：<span class='zfMoney'>"+data.data[j].unit_price+"元</span></p>";
	
						if(data.data[i].charge_type==1){
							priceHtml+="<p class='qyMeal' value="+data.data[i].charge_type+">融合套餐：<span class='rhMoney'>"+data.data[i].unit_price+"元</span>&nbsp;&nbsp;<span class='rhName'>中国电信</span></p>";
						}else if(data.data[j].charge_type==2){
							priceHtml+="<p class='qyMeal' value="+data.data[i].charge_type+">融合套餐：<span class='rhMoney'>"+data.data[i].unit_price+"元</span>&nbsp;&nbsp;<span class='rhName'>中国移动</span></p>";
						}else{
							priceHtml+="<p  class='qyMeal' value="+data.data[i].charge_type+">融合套餐：<span class='rhMoney'>"+data.data[i].unit_price+"元</span>&nbsp;&nbsp;<span class='rhName'>中国联通</span></p>";
						}
						
						priceHtml+="</div>";
						if(data.data[i].v2_describe!=""){
							
							priceHtml+="<div class='zfExplain'>";
							priceHtml+="<h6>资费说明：</h6>";
							priceHtml+="<p title="+data.data[i].v2_describe+">"+data.data[i].v2_describe+"</p>";
							priceHtml+="</div>";
						}
						priceHtml+="</div>";
						//if(data.data[i].comboNumber.split(";").length>2){
							priceHtml+="<input class='dnseg' type='hidden' value="+data.data[i].comboNumber+">";
//						}else{
//							priceHtml+="<input class='dnseg' type='hidden' value="+data.data[i].comboNumber.replace(";",",")+">";
//						}
						priceHtml+="<p class='operate'><span class='qy'>启&nbsp;用</span></p>";
						priceHtml+="<em class='edit'><i class='icon icon-edit'></i></em>";
						priceHtml+="</div>";
	
				}
				$(".blockList").html(priceHtml);
				continue;
			}
		}
	}	
	var reu=data.data;
	for(var i=0;i<reu.length;i++){
		for(var j=i+1;j<reu.length;j++){
			if(reu[i]!=undefined&&reu[j]!=undefined){
				if(reu[i].name==reu[j].name&&reu[i].comboNumber!=reu[j].comboNumber){
					delete reu[i];
					delete reu[j];
					break;
				}
			}
		}
	}
	for(var i=0;i<reu.length;i++){
		if(reu[i]!=undefined){
			
			priceHtml+="<div class='fuseCombo fuseComboStop'>"+
			"<div class='chargeInfo'>"+
			"<div class='zfInfo'>"+
			"<p class='short qyShort' ypriceType="+reu[i].v2_givemeal_unit+"  yPirceNum="+reu[i].v2_give_meal+" recommendValue="+reu[i].v2_recommend_state +"  value="+reu[i].price_num+" payType="+reu[i].price_type+">资费名称：<span class='zfName'>"+reu[i].name+"</span></p>";
			
			if(reu[i].price_type>3){
				
				priceHtml+="<p>资费类型：<span class='zfType'>流量</span></p>";
			}else{
				priceHtml+="<p>资费类型：<span class='zfType'>时长</span></p>";
			}
			priceHtml+="<p class='short shortStopPrice'>收费价格：<span class='zfMoney'>"+reu[i].unit_price+"元</span></p>";
			
			
			priceHtml+="</div>";
			if(reu[i].v2_describe!=""){
				
				priceHtml+="<div class='zfExplain'>";
				priceHtml+="<h6>资费说明：</h6>";
				priceHtml+="<p title="+reu[i].v2_describe+">"+reu[i].v2_describe+"</p>";
				priceHtml+="</div>";
			}
			priceHtml+="</div>";
			priceHtml+="<p class='operate'><span class='qy'>启&nbsp;用</span></p>";
			priceHtml+="<em class='edit'><i class='icon icon-edit'></i></em>";
			priceHtml+="</div>";
		}
		$(".blockList").html(priceHtml);
	}
		wouldClick();
	
}

//获得未停用套餐价格列表
function getUserPrice(data){
	$(".useList .fuseCombo").remove();
	//$(".useList .notFuseCombo").remove();
	$(".move").attr("style",0);
	var priceHtml="";
		for(var i=0;i<data.data.length;i++){
			for(var j=i+1;j<data.data.length;j++){
				if(data.data[i].name==data.data[j].name&&data.data[i].comboNumber!=data.data[j].comboNumber){
					if(data.data[i].comboNumber==undefined){	
						priceHtml+="<div class='fuseCombo fuseComboUse'>";
						priceHtml+="<div class='chargeInfo'>";
						priceHtml+="<div class='zfInfo'>";
						priceHtml+="<p class='short tyShort' ypriceType="+data.data[i].v2_givemeal_unit+"  yPirceNum="+data.data[i].v2_give_meal+"  recommendValue="+data.data[i].v2_recommend_state +"  value="+data.data[i].price_num+" payType="+data.data[i].price_type+">资费名称：<span class='zfName'>"+data.data[i].name+"</span></p>";
						if(data.data[j].price_type>3){
							
							priceHtml+="<p>资费类型：<span class='zfType'>流量</span></p>";
						}else{
							priceHtml+="<p>资费类型：<span class='zfType'>时长</span></p>";
						}
						priceHtml+="<p class='short shortUsePrice'>收费价格：<span class='zfMoney'>"+data.data[i].unit_price+"元</span></p>";
						if(data.data[j].charge_type==1){
							priceHtml+="<p  class='tyMeal' value="+data.data[j].charge_type+">融合套餐：<span class='rhMoney'>"+data.data[j].unit_price+"元</span>&nbsp;&nbsp;<span class='rhName'>中国电信</span></p>";
						}else if(data.data[j].charge_type==2){
							priceHtml+="<p class='tyMeal' value="+data.data[j].charge_type+">融合套餐：<span class='rhMoney'>"+data.data[j].unit_price+"元</span>&nbsp;&nbsp;<span class='rhName'>中国移动</span></p>";
						}else{
							priceHtml+="<p class='tyMeal' value="+data.data[j].charge_type+">融合套餐：<span class='rhMoney'>"+data.data[j].unit_price+"元</span>&nbsp;&nbsp;<span class='rhName'>中国联通</span></p>";
						}
						priceHtml+="</div>";		
						if(data.data[j].v2_describe!=""){
							
							priceHtml+="<div class='zfExplain'>";
							priceHtml+="<h6>资费说明：</h6>";
							priceHtml+="<p title="+data.data[j].v2_describe+">"+data.data[j].v2_describe+"</p>";
							priceHtml+="</div>";
						}
						priceHtml+="</div>";
						//if(data.data[j].comboNumber.split(";").length>2){
							priceHtml+="<input class='dnseg' type='hidden' value="+data.data[j].comboNumber+">";
//						}else{
//							priceHtml+="<input class='dnseg' type='hidden' value="+data.data[j].comboNumber.replace(";",",")+">";
//						}
						priceHtml+="<p class='operate'><span class='ty'>停&nbsp;用</span><span class='tj'>推&nbsp;荐</span></p>";
						priceHtml+="<em class='edit'><i class='icon icon-edit'></i></em>";
						priceHtml+="</div>";
					}
					if(data.data[j].comboNumber==undefined){
						priceHtml+="<div class='fuseCombo fuseComboUse'>";
						priceHtml+="<div class='chargeInfo'>";
						priceHtml+="<div class='zfInfo'>";
						priceHtml+="<p class='short tyShort' ypriceType="+data.data[j].v2_givemeal_unit+"  yPirceNum="+data.data[j].v2_give_meal+"  recommendValue="+data.data[j].v2_recommend_state +"  value="+data.data[j].price_num+" payType="+data.data[j].price_type+">资费名称：<span class='zfName'>"+data.data[j].name+"</span></p>";
						
						if(data.data[i].price_type>3){
							
							priceHtml+="<p>资费类型：<span class='zfType'>流量</span></p>";
						}else{
							priceHtml+="<p>资费类型：<span class='zfType'>时长</span></p>";
						}
						priceHtml+="<p class='short shortUsePrice'>收费价格：<span class='zfMoney'>"+data.data[j].unit_price+"元</span></p>";

						if(data.data[i].charge_type==1){
							priceHtml+="<p class='tyMeal' value="+data.data[i].charge_type+">融合套餐：<span class='rhMoney'>"+data.data[i].unit_price+"元</span>&nbsp;&nbsp;<span class='rhName'>中国电信</span></p>";
						}else if(data.data[i].charge_type==2){
							priceHtml+="<p class='tyMeal' value="+data.data[i].charge_type+">融合套餐：<span class='rhMoney'>"+data.data[i].unit_price+"元</span>&nbsp;&nbsp;<span class='rhName'>中国移动</span></p>";
						}else{
							priceHtml+="<p class='tyMeal' value="+data.data[i].charge_type+">融合套餐：<span class='rhMoney'>"+data.data[i].unit_price+"元</span>&nbsp;&nbsp;<span class='rhName'>中国联通</span></p>";
						}
						
						priceHtml+="</div>";
						if(data.data[i].v2_describe!=""){
							
							priceHtml+="<div class='zfExplain'>";
							priceHtml+="<h6>资费说明：</h6>";
							priceHtml+="<p title="+data.data[i].v2_describe+">"+data.data[i].v2_describe+"</p>";
							priceHtml+="</div>";
						}	var comboNumber='000000;'
							comboNumber.length-1
						priceHtml+="</div>";
					//	if(data.data[i].comboNumber.split(";").length>2){
							priceHtml+="<input class='dnseg' type='hidden' value="+data.data[i].comboNumber+">";
//						}else{
//							priceHtml+="<input class='dnseg' type='hidden' value="+data.data[i].comboNumber.replace(";",",")+">";
//						}
						priceHtml+="<p class='operate'><span class='ty'>停&nbsp;用</span><span class='tj'>推&nbsp;荐</span></p>";
						priceHtml+="<em class='edit'><i class='icon icon-edit'></i></em>";
						priceHtml+="</div>";
				}
				$(".useList").html(priceHtml);
				
				continue;
			}
		}
		}
		var reu=data.data;
		for(var i=0;i<reu.length;i++){
			for(var j=i+1;j<reu.length;j++){
				if(reu[i]!=undefined&&reu[j]!=undefined){
					if(reu[i].name==reu[j].name&&reu[i].comboNumber!=reu[j].comboNumber){
						delete reu[i];
						delete reu[j];
						break;
					}
				}
			}
		}
		for(var i=0;i<reu.length;i++){
			if(reu[i]!=undefined){
				
				priceHtml+="<div class='fuseCombo fuseComboUse'>"+
				"<div class='chargeInfo'>"+
				"<div class='zfInfo'>"+
				"<p class='short tyShort' ypriceType="+reu[i].v2_givemeal_unit+"  yPirceNum="+reu[i].v2_give_meal+"  recommendValue="+reu[i].v2_recommend_state +" value="+reu[i].price_num+" payType="+reu[i].price_type+">资费名称：<span class='zfName'>"+reu[i].name+"</span></p>";
				
				if(reu[i].price_type>3){
					
					priceHtml+="<p>资费类型：<span class='zfType'>流量</span></p>";
				}else{
					priceHtml+="<p>资费类型：<span class='zfType'>时长</span></p>";
				}
				priceHtml+="<p class='short shortUsePrice'>收费价格：<span class='zfMoney'>"+reu[i].unit_price+"元</span></p>";
				
				
				priceHtml+="</div>";
				if(reu[i].v2_describe!=""){
					
					priceHtml+="<div class='zfExplain'>";
					priceHtml+="<h6>资费说明：</h6>";
					priceHtml+="<p title="+reu[i].v2_describe+">"+reu[i].v2_describe+"</p>";
					priceHtml+="</div>";
				}
				priceHtml+="</div>";
				priceHtml+="<p class='operate'><span class='ty'>停&nbsp;用</span><span class='tj'>推&nbsp;荐</span></p>";
				priceHtml+="<em class='edit'><i class='icon icon-edit'></i></em>";
				priceHtml+="</div>";
				
			}
			$(".useList").html(priceHtml);
		}
		var len= $(".fuseComboUse").length;
		for(var i=0; i<len;i++){
			if($(".tyShort").eq(i).attr("recommendValue")==1){
				$('.fuseComboUse>.chargeInfo').eq(i).addClass('recommend');
				$('.tj').eq(i).text("取消推荐");
				if(i!=0){
					$(".fuseComboUse").eq(0).before($(".fuseComboUse").eq(i));
				}
				break;	
			}
			
		}
		
		wouldClick();
	
}
 
//弹出新的增加收费类型的页面
function addNewPage(){
	//新增计费按钮绑定
	$(".newAdd").unbind("click");
	$(".newAdd").click(function(){
		getSiteType();
		
	});
	//付费类型 时,日,月按钮绑定
	$('.timeType').click(function(){
		$('.floa').css('display','none');
		var moveW=$('.move').width();
		typeDang=$('.timeType').index(this);
		$('.timeType').removeClass('on').eq(typeDang).addClass('on');
		$('.move').animate({left:moveW*typeDang+'px'});
		if($("#priceUl .on").attr("isstop")==1){
			$('.import').css('display','none');
			$('.fuse').css('display','none');
			$(".yesOrNo").eq(0).addClass("on");
		}else{
			$('.import').css('display','block');
			$('.fuse').css('display','block');
			$(".yesOrNo").eq(0).removeClass("on");
		}
		$("#hasChargeType").val("0");
		buffer();
		getValue();
		wouldClick();
		
	});
	
	//新增页面付费单位按钮绑定
	$(".charging .jiu>li").unbind("click");
	$('.charging .jiu>li').click(function(){
		var n=$('.charging .payList>li').index(this);
		var str=$('.charging .payList>li').eq(n).html();
		var type=$('.charging .payList>li').eq(n).attr("value");
		$(".add_price_type").val(type);
		$('.charging .payMold>span').html(str);
		$('.payList').css('display','none');
		return false;
	});
	//新增页面付费单位按钮绑定
	$(".charging .xin>li").unbind("click");
	$('.charging .xin>li').click(function(){
		var n=$('.charging .xin>li').index(this);
		var str=$('.charging .xin>li').eq(n).html();
		console.log(str);
		var type=$('.charging .xin>li').eq(n).attr("value");
		$(".add_give_type").val(type);
		$('.favorable>span').html(str);
		$('.payList').css('display','none');
		return false;
	});
	//新增页面归属集团按钮绑定
	$('.blocList>li').click(function(){
		var n=$('.blocList>li').index(this);
		var str=$('.blocList>li').eq(n).html();
		var chargeTpye=$('.blocList>li').eq(n).attr("value");
		$("#charge_type").val(chargeTpye);
		$('.bloc>span').html(str);
		$('.blocList').css('display','none');
		return false;
	});
}
//获取场所使用的系统是是否是ikuai,如果是ikuai系统,则不支持设置流量套餐
function getSiteType(){
	var siteId=$("#ulConfig .on").attr("value");
	$.ajax({
		type:"post",
		async:false,
		url:ctx+"/SitePriceBilling/getSiteSolarsys",
		data:{
			siteId:siteId
		},
		success:function(data){
			if(data=="loseSession"){
				 window.location.href=ctx+"/toLogin";
				 return;
			}	
			eval("data="+data);
			if(data.code==0){
				$('.mask').css('display','block');
				$('.new').css('display','none');
				$('.charging').css('display','block');
				$('.newly').animate({left:'20%'},1000);
				$('.btns').animate({left:'20%'},1000);
				$('.yesOrNo').eq(0).addClass('on');
				$(".PackageDetails").css('display','none');
				$("#liul").prop("checked",false);
				$("#shic").prop("checked",true);
				$(".mask .charging ul li:eq(0) p").eq(0).css("display","block");
				$(".mask .charging ul li:eq(0) p").eq(1).css("margin-right","10px");
			}else{
				$('.mask').css('display','block');
				$('.new').css('display','none');
				$('.charging').css('display','block');
				$('.newly').animate({left:'20%'},1000);
				$('.btns').animate({left:'20%'},1000);
				$('.yesOrNo').eq(0).addClass('on');
				$(".PackageDetails").css('display','none');
				$("#liul").prop("checked",false);
				$("#shic").prop("checked",true);
				$(".mask .charging ul li:eq(0) p").eq(0).css("display","none");
				$(".mask .charging ul li:eq(0) p").eq(1).css("margin-right","150px");
			}
		}
	})
	
}

//作废套餐类型
function updateStop(){
	var name=$(".tyShort>.zfName").eq(divNum).text();
	var id=$("#ulConfig .on").attr("value");
	$.ajax({
		type:"POST",
		async:false,
		url:ctx+"/SitePriceBilling/updateIsStop",
		data:{
			name:name,
			id:id
		},
		success:function(data){
			if(data=="loseSession"){
				 window.location.href=ctx+"/toLogin";
				 return;
			}	
			eval("data="+data);
			if(data.code==200){
				removeMeal();
				$(".win>span").html("停用成功");
				winHint();
				return false;
			}else{
				$(".win>span").html("服务不可用,请稍后尝试");
				winHint();
				return false;
				
			}
		}
		
	});
}
//使用套餐类型
function updateNoStop(){
	var name=$(".qyShort>.zfName").eq(divUseNum).text();
	var id=$("#ulConfig .on").attr("value");
	$.ajax({
		type:"POST",
		url:ctx+"/SitePriceBilling/updateNoStop",
		data:{
			name:name,
			id:id
		},
		success:function(data){
			if(data=="loseSession"){
				 window.location.href=ctx+"/toLogin";
				 return;
			}	
			eval("data="+data);
			if(data.code==200){
				removeStopedMeal();
				$(".win>span").html("启用成功");
				winHint();
				return false;
			}else{
				$(".win>span").html("服务不可用,请稍后尝试");
				winHint();
				return false;
			}
		}
		
	});
	
}

//查询融合套餐是否启用
function selchargePrice(){
	var name=$("#priceUl .on").text();
	var id=$("#priceUl .on").attr("siteid");
	$.ajax({
		type:"POST",
		async:false,
		url:ctx+"/SitePriceBilling/selChargeIsStop",
		data:{
			name:name,
			siteId:id
		},
		success:function(data){
			if(data=="loseSession"){
				 window.location.href=ctx+"/toLogin";
				 return;
			}	
			eval("data="+data);
			if(data.code==200){
				$('.yesOrNo').eq(1).removeClass('on');
				$('.operator').css('display','block');
			}else if(data.code==201){
				$('.yesOrNo').eq(1).addClass('on');
				$('.operator').css('display','none');
			}else if(data.code==202){
				$('.yesOrNo').eq(1).addClass('on');
				$('.operator').css('display','none');
			}
			
		}
		
	});
	
}			
//提交时校验
function checksubmit(){
	var pName=$(".addName input").val();
	var pMoney=$(".addPrice input").val();
	var newPayNum=$("#addNum").val();
	var content =$(".charging .zifeiSm textarea").val(); 
	var reg=/[^\u4e00-\u9fa5a-zA-Z0-9]/ig;
	if(content!=""){
		if(reg.test(content)){
			submitFlag=false;
			$(".win>span").html("资费说明不能有特殊符号");
			winHint();
			return;
		}
		if(content.length>40){
			submitFlag=false;
			$(".win>span").html("资费说明长度不能超过40字");
			winHint();
			return;
		}
	}
	if(pName==""||pName==null){
		submitFlag=false;
		$(".win>span").html("收费名称不能为空");
		winHint();
		return;
	}
	if(pMoney==null||pMoney==0){
		
		submitFlag=false;
		$(".win>span").html("收费单价不能为空或零");
		winHint();
		return;
	}
	if(pMoney.split(".").length>2){
		$(".win>span").html("收费单价不符合规范");
		submitFlag=false;
		winHint();
		return;
	}
	if(newPayNum==null||newPayNum==0){
		submitFlag=false;
		$(".win>span").html("计费数量不能为空或零");
		winHint();
		return;
	}
		
	submitFlag=true;
	return submitFlag;
} 
//提交时校验两个
function checkTwoSubmit(){
	var pName=$(".addName input").val();
	var pMoney=$(".addPrice input").val();
	var payAmount=$("#mPrice").val();	//融合收费价格
	var newPayNum=$("#addNum").val();
	var comboNumber= "";//套餐套餐号段
	var content =$(".charging .zifeiSm textarea").val(); 
	var reg=/[^\u4e00-\u9fa5a-zA-Z0-9]/ig;
	if(content!=""){
		if(reg.test(content)){
			submitFlag=false;
			$(".win>span").html("资费说明不能有特殊符号");
			winHint();
			return;
		}
		if(content.length>40){
			submitFlag=false;
			$(".win>span").html("资费说明长度不能超过40字");
			winHint();
			return;
		}
	}
	$(".comboNumList>input").each(function(){
		if($(this).val()!=""){
			comboNumber+=$(this).val()+";";
		}
	});
	if(pName==""||pName==null){
		submitFlag=false;
		$(".win>span").html("收费名称不能为空");
		winHint();
		return;
	}
	if(pMoney==null||pMoney==0){
		submitFlag=false;
		$(".win>span").html("收费单价不能为空或零");
		winHint();
		return;
	}
	if(pMoney.split(".").length>2){
		$(".win>span").html("收费单价不符合规范");
		submitFlag=false;
		winHint();
		return;
	}
	if(newPayNum==null||newPayNum==0){
		submitFlag=false;
		$(".win>span").html("计费数量不能为空或零");
		winHint();
		return;
	}
	if(payAmount==null||payAmount==0){
		submitFlag=false;
		$(".win>span").html("套餐收费不能为空或零");
		winHint();
		return;
	}
	if(payAmount.split(".").length>2){
		$(".win>span").html("套餐收费不符合规范");
		submitFlag=false;
		winHint();
		return;
	}
	if(comboNumber==""||comboNumber.length<3){
		submitFlag=false;
		$(".win>span").html("套餐号段不能为空或少于三位");
		winHint();
		return;
	}
	submitFlag=true;
	return submitFlag;
} 
$(".comboNumList>input").keyup(function(){
	$(".comboNumList>input").each(function(){
		if($(this).val()==""||$(this).val().length<3){
			submitFlag=false;
			$(".win>span").html("套餐号段不能为空或少于三位");
			winHint();
			return;
		}
	});
});
//检验输入的长度	
function checkout(){
	submitFlag=true;
	var input = []; 
	//把不为空的放在数组中
	$(".comboNumList>input").each(function(){
		if($(this).val()!=""){
			 input.push($(this).val());
		}
	});
	//遍历不为空的值是否长度小于三位
	for(var i = 0;i<input.length;i++){
		if(input[i].length<3){
			submitFlag=false;
			$(".win>span").html("套餐号段不能为空或少于三位");
			winHint();
			return;
		}
	}
		return submitFlag;
}
//新增计费
$("#save").click(function(){
	var str=$('.yesOrNo').eq(0).attr("class");
		if(str!='yesOrNo'){//未开融合套餐
			if(checksubmit()){
				savePayType();
			}
		}else{
			if(checkTwoSubmit()&&checkout()){
				savePayType();
			}
		}
});
//新增收费类型
function savePayType(){
	var comboNumber= "";//套餐套餐号段
	$(".comboNumList>input").each(function(){
		if($(this).val()!=""){
			comboNumber+=$(this).val()+";";
		}
	});
	if(comboNumber==""){
		comboNumber="1";
	}
	var payNumber=$("#addNum").val();//计费数量
	var payType=$(".add_price_type").val();//收费类型 时,日,月
	var payAmount=$("#mPrice").val();//融合收费价格
	var payName=$(".addName input").val();//收费名称
	var payMoney=$(".addPrice input").val();//非融合收费价格
	var site_id=$("#ulConfig .on").attr("value");
	var stoped=0;//是否作废  0不是，1是
	var charge_type=$(".add_charge_type").val();//融合套餐所属集团
	var give_num=$("#favorablePrice").val();//优惠数量
	var give_type=$(".add_give_type").val();//优惠单价
	var describe=$(".charging .zifeiSm textarea").val();//套餐描述
	
	var hasOrNo=0;
	var str=$('.yesOrNo').eq(0).attr("class");
	if(str=='yesOrNo'){//设置了融合套餐
		hasOrNo=1;
	}
	$.ajax({
		type:"POST",
		url:ctx+"/SitePriceBilling/addprice",
		data:{
			is_stoped :stoped,
			price_type :payType,
			unit_price :payMoney,
			chargePrice:payAmount,
			charge_type:charge_type,
			site_id :site_id,
			name :payName,
			comboNumber:comboNumber,
			price_num :payNumber,
			hasOrNo:hasOrNo,
			giveNum:give_num,
			giveType:give_type,
			describe:describe
		},
		success:function(data){
			if(data=="loseSession"){
				 window.location.href=ctx+"/toLogin";
				 return;
			}	
			eval("data="+data);
			if(data.code==200){
				$(".charging input").each(function(){
					$(this).val("");
				});
				$("#price_type").val("0");
				$("#charge_type").val("1");
				$(".charging .groupList").html("中国电信");
				$(".charging .payMold>span").html("时");
				$(".charging .appNum").val("");
				$('.fuseAdd>.yesOrNo').eq(0).addClass('on');
				$(".charging .comboNumList>.newAppNum").remove();
				
				$("#liul").val('流量');
				$("#shic").val('时长');
				$(".add_give_type").val("0");
				$(".add_price_type").val("0");
				$(".add_charge_type").val("0");
				var ht="";
				ht+=" <li value='0'>时</li>";
				ht+=" <li value='1'>天</li>";
				ht+=" <li value='2'>月</li>";
				$(".charging .payList li").remove();
				$(".charging .payList").html(ht);
				$(".charging .payMold > span").text('时');
				$(".charging .favorable > span").text('时');
				addNewPage();
				getPrice(site_id);
				$(".win>span").html("添加成功");
				winHint();
				$('.newly').animate({left:2000},1000);
				$('.whether').css('display','none');
				setTimeout(function(){
					$('.mask').css('display','none');
				},500);
				
			}
			if(data.code==202){
				$(".win>span").html("该套餐已存在,请修改套餐名称");
				win();
				$('.mask').css('display','block');
			}
			if(data.code==201){
				$('.mask').css('display','block');
				$(".win>span").html("服务不可用，请稍后再试");
				winHint();
			};
		}
	});
}

$(".floa>input").keyup(function(){
	var val=$(".floa>input").val();
	if(val.length<3){
		$(".win>span").html("套餐号段长度不能少于三位");
		winHint();
		$("#SureAddCombo").attr("disabled", true);
	}else{
		$("#SureAddCombo").attr("disabled", false);
	}
	
});
//修改套餐号段
$("#SureAddCombo").click(function(){
	var checkCom=true;
	var newComboNumber= $(".floa>input").val();
	var oldComboNumber=$("#comboValue").val();
	for(var j =0;j<oldComboNumber.split(";").length-1;j++){
		if(oldComboNumber.split(";")[j]==newComboNumber){
			checkCom=false;
			$(".win>span").html("套餐号段不能相同");
			win();
			return;
		}
	}
	if(checkCom){
		if(newComboNumber!=""&&newComboNumber!=null ){
			$("#comboValue").val(oldComboNumber+newComboNumber+";");
		}
		var comboNumber=$("#comboValue").val();
		var id=$("#priceUl .on").attr("siteid");//场所id
		var priceName=$("#priceUl .on").text();//套餐名称
		var interimCombo=[];
		var numberHtml="";
		interimCombo=comboNumber.split(";");
		for(var i =0;i<interimCombo.length-1;i++){
			numberHtml+="<li>"+interimCombo[i]+"</li>";
		};
		$("#comboNumber").html(numberHtml);
		$(".floa>input").val("");
	}
});

//修改绑定确定按钮
$(".amend .btns button:eq(0)").click(function(){
	if("yesOrNo"!=$('.yesOrNo').eq(1).attr("class")){//只修改普通套餐
		if(updateCheck()){
			$('.wether').css('display','block');
		}
	}else{
		if(updateTwoCheck()){
			$('.wether').css('display','block');
		}
	}
});
//修改绑定取消按钮
$(".amend .btns button:eq(1)").click(function(){
	$('.whether').css('display','block');
});
//添加绑定取消按钮
$(".charging .btns button:eq(1)").click(function(){
	$('.whether').css('display','block');
});
//更改时校验
function updateCheck(){
	var noChargePrice=$("#copyPrice").val();//非融合套餐价格
	var priceTypeNum=$(".amend>ul>.payMold>input").val();//非融合套餐收费类型
	var content =$(".amend .zifeiSm textarea").val(); 
	var reg=/[^\u4e00-\u9fa5a-zA-Z0-9]/ig;
	if(content!=""){
		if(reg.test(content)){
			submitFlag=false;
			$(".win>span").html("资费说明不能有特殊符号");
			winHint();
			return;
		}
		if(content.length>40){
			submitFlag=false;
			$(".win>span").html("资费说明长度不能超过40字");
			winHint();
			return;
		}
	}
	if(noChargePrice==0||noChargePrice==null){
		updateSubmitCheck=false;
		$(".win>span").html("收费单价价格不能为空");
		win();
		return;
	}
	if(noChargePrice.split(".").length>2){
		$(".win>span").html("收费单价不符合规范");
		updateSubmitCheck=false;
		winHint();
		return;
	}
	
	if(priceTypeNum==0||priceTypeNum==null){
		updateSubmitCheck=false;
		$(".win>span").html("计费数量不能为空");
		winHint();
		return;
	}
	updateSubmitCheck=true;
	return updateSubmitCheck;
}
//更改时校验两个
function updateTwoCheck(){
	var noChargePrice=$("#copyPrice").val();//非融合套餐价格
	var priceTypeNum=$(".amend>ul>.payMold>input").val();//非融合套餐收费类型
	var chargePrice=$(".amend .setMeal input").val();//融合套餐收费价格
	var content =$(".amend .zifeiSm textarea").val(); 
	var reg=/[^\u4e00-\u9fa5a-zA-Z0-9]/ig;
	if(content!=""){
		if(reg.test(content)){
			submitFlag=false;
			$(".win>span").html("资费说明不能有特殊符号");
			winHint();
			return;
		}
		if(content.length>40){
			submitFlag=false;
			$(".win>span").html("资费说明长度不能超过40字");
			winHint();
			return;
		}
	}
	var comboNumber= "";//套餐套餐号段
	$(".amend .comboNumList input").each(function(){
		if($(this).val()!=""){
			comboNumber+=$(this).val()+";";
		}
	});
	if(noChargePrice==0||noChargePrice==null){
		updateSubmitCheck=false;
		$(".win>span").html("收费价格不能为空");
		winHint();
		return;
	}
	if(noChargePrice.split(".").length>2){
		$(".win>span").html("收费单价不符合规范");
		updateSubmitCheck=false;
		winHint();
		return;
	}
	if(priceTypeNum==0||priceTypeNum==null){
		updateSubmitCheck=false;
		$(".win>span").html("计费数量不能为空");
		winHint();
		return;
	}
	if(chargePrice==0||chargePrice==null){
		updateSubmitCheck=false;
		$(".win>span").html("套餐收费不能为空");
		winHint();
		return;
	}
	if(chargePrice.split(".").length>2){
		$(".win>span").html("套餐收费不符合规范");
		updateSubmitCheck=false;
		winHint();
		return;
	}
	if("无归属"==$(".amend .groupList").html()){
		updateSubmitCheck=false;
		$(".win>span").html("请选择归属集团");
		winHint();
		return;
	}
	if(comboNumber==""){
		updateSubmitCheck=false;
		$(".win>span").html("套餐号段不能为空");
		winHint();
		return;
	}
	updateSubmitCheck=true;
	return updateSubmitCheck;
	
}
//修改套餐号段时,校验重复
function checkCom(){
	$(".charging .comboNumList>input").blur(function () {
		var inputResult=[];
		var thisIndex=$('.charging .comboNumList>input').index(this);//当前失去焦点input的下标   -----用以排除当前元素value
		$(".charging .comboNumList>input").each(function(){
			inputResult.push($(this).val());
		});
		if($(this).val()!=""){
			for(var i=0;i<inputResult.length;i++){
				if($(this).val().length<=2){
					$(this).val("");
					$(".win>span").html("您输入的套餐号段长度不能少于三位");
					winHint();
					return false;
				}else{
					
					if(inputResult[i]!="" && i!=thisIndex){
						if(inputResult[i]==$(this).val()){
							$(this).val("");
							$(".win>span").html("您输入的套餐号段重复");
							winHint();
							return false;
						}
					}
				}
			}
		}
	});
}
function checkRepeat(){
	$(".amend .comboNumList>input").blur(function () {
		var inputResult=[];
		var thisIndex=$('.amend .comboNumList>input').index(this);//当前失去焦点input的下标   -----用以排除当前元素value
		$(".amend .comboNumList>input").each(function(){
			inputResult.push($(this).val());
		});
		if($(this).val()!=""){
			for(var i=0;i<inputResult.length;i++){
				if($(this).val().length<=2){
					$(this).val("");
					$(".win>span").html("您输入的套餐号段长度不能少于三位");
					winHint();
					return false;
				}else{
					if(inputResult[i]!="" && i!=thisIndex){
						if(inputResult[i]==$(this).val()){
							$(this).val("");
							$(".win>span").html("您输入的套餐号段重复");
							winHint();
							return false;
						}
					}
				}
			}
		}
	});
}


//更改非融合套餐
function updateNoChargePrice(){
	var noChargePrice=$(".amend>ul>.xPrice> #copyPrice").val();//非融合套餐价格
	var stoped=0;//是否使用
	if("未启用"==$(".state .on").html()){
		stoped=1;
	}	
	var priceName=$(".amend>ul>.xName>input").val();//套餐名称
	var id=$("#ulConfig .on").attr("value");//场所id
	var priceTypeNum=$(".amend>ul>.payMold>input").val();//非融合套餐收费数量
	var price_type=$(".new_price_type").val(); //套餐类型 分别代表时 日 月 M G
	var giveType=$(".new_yprice_type").val();//优惠赠送的类型单位时 日 月 M G
	var giveNum=$(".amend .favorable input").val();//优惠赠送的套餐数量
	var describe=$(".amend .zifeiSm textarea").text();//套餐优惠描述
	$.ajax({
		type:"post",
		url:ctx+"/SitePriceBilling/updateNoChargePrice",
		data:{
			priceName: priceName,
			noChargePrice:noChargePrice,
			stoped:stoped,
			siteId:id,
			price_num:priceTypeNum,
			price_type:price_type,
			give_type:giveType,
			give_num:giveNum,
			describe:describe
		},
		success:function(data){
			if(data=="loseSession"){
				 window.location.href=ctx+"/toLogin";
				 return;
			}	
			eval("data="+data);
			if(data.code==200){
				$(".win>span").html("更改成功");
				winHint();
				$(".priceName:eq("+updateNum+")").attr("paytype",price_type);
				$(".priceName:eq("+updateNum+")").attr("value",priceTypeNum);
				$(".lastPrice:eq("+updateNum+") span").html(noChargePrice);
				return false;
			}else{
				$(".win>span").html("服务不可用,请稍后重试");
				winHint();
				return false;
			}
		}
	});
}

//更改收费价格
function updateChargePrice(){ 
	var noChargePrice=$(".amend>ul>.xPrice> #copyPrice").val();//非融合套餐价格
	var priceTypeNum=$(".amend>ul>.payMold>input").val();//非融合套餐收费类型
	var chargePrice=$(".amend .setMeal input").val();//融合套餐收费价格
	var stoped=0;//0代表未停用的列表,1代表已停用的列表
	if("未启用"==$(".state .on").html()){
		stoped=1;
	}	
	var newCharge_type=$(".new_charge_type").val();//新的套餐归属集团
	var id=$("#ulConfig .on").attr("value");//场所id
	var priceName=$(".amend>ul>.xName>input").val();//套餐名称
	var price_type=$(".new_price_type").val(); //套餐类型分别代表 时日月
	var giveType=$(".new_yprice_type").val();//优惠赠送的类型单位时 日 月 M G
	var giveNum=$(".amend .favorable input").val();//优惠赠送的套餐数量
	var describe=$(".amend .zifeiSm textarea").val();//套餐优惠描述
	var comboNumber= "";//套餐套餐号段
	$(".amend .comboNumList input").each(function(){
		if($(this).val()!=""){
			comboNumber+=$(this).val()+";";
		}
	});
	var hasOrNo=0;//0代表没有融合套餐,如果打开融合套餐需要添加融合套餐.1代表修改非融合套餐和融合套餐
	if(stoped==0){
		if($(".useList .chargeInfo:eq("+updateNum+") .tyMeal").length>0){
			hasOrNo=1;
		}
	}else{
		if($(".blockList .chargeInfo:eq("+updateNum+") .qyMeal").length>0){
			hasOrNo=1;
		}
	}
	$.ajax({
		type:"post",
		url:ctx+"/SitePriceBilling/updateprice",
		data:{
			priceName: priceName,
			chargePrice:chargePrice,
			noChargePrice:noChargePrice,
			newCharge_type:newCharge_type,
			siteId:id,
			comboNumber:comboNumber,
			price_num:priceTypeNum,
			price_type:price_type,
			hasOrNo:hasOrNo,
			stoped:stoped,
			give_type:giveType,
			give_num:giveNum,
			describe:describe
		},
		success:function(data){
			if(data=="loseSession"){
				 window.location.href=ctx+"/toLogin";
				 return;
			}	
			eval("data="+data);
			if(data.code==200){
				$(".win>span").html("更改成功");
				winHint();
				$(".amend .zifeiSm textarea").val("");
				if(stoped==0){
					getPrice(id);
				}else{
					getStopedPrice();
				}
				return false;
			}else{
				$(".win>span").html("服务不可用，请稍后再试");
				winHint();
				return false;
					
			}
		}
	});
	
}

function numdisp(n){
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
function buffer(){
	$('.barcontainer').css('display','block');
	$('.barcontainer').fadeOut(800);
}
$('.addCombo').click(function(){
	$('.floa').css('display','block');
});
$('.btn').click(function(){
	$('.floa').css('display','none');
	$(".floa>input").val("");
	return false;
});
function win(){
	$('.win').css('display','block').fadeOut(3000);
};
function winHint(){
	$('.win').css('display','block').fadeOut(1500);
};
function wouldClick(){
	//停用按钮绑定事件
	$(".ty").unbind("click");
	$(".ty").click(function(){
		 divNum=$(".ty").index(this);
		$('.wether').css('display','block');
	});
	//推荐按钮事件
	$('.tj').unbind("click");
	$('.tj').click(function(){
		var n = $('.tj').index(this);
		if($(".tj").eq(n).html()=="取消推荐"){
			recommend(n,0);
		}else{
			recommend(n,1);
		}
		
	});
	//启用按钮绑定事件
	$(".qy").unbind("click");
	$(".qy").click(function(){
		divUseNum=$(".qy").index(this);
		$('.wether').css('display','block');
	});
	//未停用修改按钮绑定事件
	$(".useList > div > em.edit").unbind("click");
	$('.useList > div > em.edit').click(function(){
		updateNum=$(".useList>div>em.edit").index(this);
		$('.mask').css('display','block');
		$('.new').css('display','none');
		$('.amend').css('display','block');
		copyPrice(updateNum);
		$('.newly').animate({left:'20%'},1000);
		$('.btns').animate({left:'20%'},1000);
	});
	//已停用修改按钮绑定事件
	$(".blockList > div > em.edit").unbind("click");
	$('.blockList > div > em.edit').click(function(){
		updateNum=$(".blockList>div>.edit").index(this);
		$('.mask').css('display','block');
		$('.new').css('display','none');
		$('.amend').css('display','block');
		copyPrice(updateNum);
		$('.newly').animate({left:'20%'},1000);
		$('.btns').animate({left:'20%'},1000);
	});
	if("yesOrNo"!=$(".yesOrNo").eq(0).attr("class")){
		$(".fn-btn").attr("disabled", true);
	}else{
		$(".fn-btn").attr("disabled", false);
	}
	
	$('#liul').click(function(){
		var ht="";
			ht+=" <li value='4'>M</li>";
			ht+=" <li value='5'>G</li>";
		$(".charging .payMold .payList li").remove();
		$(".charging .payList").html(ht);
		$(".charging .payMold > span").text('M');
		$(".charging .favorable > span").text('M');
		timeOrFlow=0;
		addNewPage();
	});
	$('#shic').click(function(){
		var ht="";
			ht+=" <li value='0'>时</li>";
			ht+=" <li value='1'>天</li>";
			ht+=" <li value='2'>月</li>";
		$(".charging .payList li").remove();
		$(".charging .payList").html(ht);
		$(".charging .payMold > span").text('时');
		$(".charging .favorable > span").text('时');
		timeOrFlow=1;
		addNewPage();
	});
	//修改页面收费类型 时,日,月 按钮绑定
	$('.amend .jiu>li').click(function(){
		var n=$('.amend .jiu>li').index(this);
		var str=$('.amend .jiu>li').eq(n).html();
		var type=$('.amend .jiu>li').eq(n).attr("value");
		$("#price_type").val(type);
		$('.amend .payMold>span').html(str);
		if("时"==str){
			$(".new_price_type").val(0);
		}
		if("天"==str){
			$(".new_price_type").val(1);
		}
		if("月"==str){
			$(".new_price_type").val(2);
		}
		if("M"==str){
			$(".new_price_type").val(4);
		}
		if("G"==str){
			$(".new_price_type").val(5);
		}
		$('.amend .payList').css('display','none');
		return false;
	});

	$('.amend .xin>li').click(function(){
		var n=$('.amend .xin>li').index(this);
		var str=$('.amend .xin>li').eq(n).html();
		var type=$('.amend .xin>li').eq(n).attr("value");
		$("#price_type").val(type);
		$('.amend .favorable>span').html(str);
		if("时"==str){
			$(".new_yprice_type").val(0);
		}
		if("天"==str){
			$(".new_yprice_type").val(1);
		}
		if("月"==str){
			$(".new_yprice_type").val(2);
		}
		if("M"==str){
			$(".new_yprice_type").val(4);
		}
		if("G"==str){
			$(".new_yprice_type").val(5);
		}
		$('.amend .payList').css('display','none');
		return false;
	});
	
}
//给修改页面赋值
function copyPrice(updateNum){
	//已启用页面
	var newNum=updateNum;
	if("已启用"==$(".state .on").html()){
		var mealName=$(".tyShort>.zfName").eq(updateNum).text();
		var priceValue=$(".shortUsePrice .zfMoney").eq(updateNum).text().replace("元","").trim();
		var payType=$(".tyShort").eq(updateNum).attr("paytype");//付费类型
		for(var i=0;i<newNum;i++){
			if($(".useList .zfInfo:eq("+i+")>p").length<4){
				newNum=newNum-1;
			}
		}
		var chargeType=$(".tyMeal").eq(newNum).attr("value");//归属集团类型
		var yPirceType=$(".tyShort").eq(updateNum).attr("ypriceType");//优惠类型单位
		var yPirceNum=$(".tyShort").eq(updateNum).attr("yPirceNum");//优惠数量
		$(".amend>ul>.xName>input").val(mealName);//收费名称
		$(".amend>ul>.xPrice> #copyPrice").val(priceValue);//收费单价
		$(".amend>ul>.payMold>input").val($(".tyShort").eq(updateNum).attr("value"));//收费类型
		$(".amend .favorable input").val(yPirceNum);
		//套餐文字说明
		if($(".useList .chargeInfo").eq(updateNum).children().length>1){
			var newDnum=updateNum;
			for(var i=0;i<updateNum;i++){
				if($(".useList .chargeInfo").eq(i).children().length<2){
					newDnum=newDnum-1;
				}
			}
			$(".amend .zifeiSm textarea").val($(".useList .zfExplain p").eq(newDnum).text());
		}
		var comber="";
		var ht="";
		if(payType>3){
			$('.p1').text('流量');
			ht+=" <li>M</li>";
			ht+=" <li>G</li>";
			if(yPirceType==0||yPirceType==4){
				$(".amend .favorable span").text("M");
				$(".new_yprice_type").val("4");
			}
			if(yPirceType==5){
				$(".amend .favorable span").text("G");
				$(".new_yprice_type").val("5");
			}
		}else{
			$('.p1').text('时长');
			ht+=" <li>时</li>";
			ht+=" <li>天</li>";
			ht+=" <li>月</li>";
			if(yPirceType==0){
				$(".amend .favorable span").text("时");
				$(".new_yprice_type").val("0");
			}
			if(yPirceType==1){
				$(".amend .favorable span").text("天");
				$(".new_yprice_type").val("1");
			}
			if(yPirceType==2){
				$(".amend .favorable span").text("月");
				$(".new_yprice_type").val("2");
			}
		}
		$(".amend .payMold .payList li").remove();
		$(".amend .payMold .payList").html(ht);
		$(".amend .favorable .payList li").remove();
		$(".amend .favorable .payList").html(ht);
		
		if(payType==0){
			$(".amend>ul>.payMold>span").html("时");
			$(".new_price_type").val(0);
		}
		if(payType==1){
			$(".amend>ul>.payMold>span").html("天");
			$(".new_price_type").val(1);
		}
		if(payType==2){
			$(".amend>ul>.payMold>span").html("月");
			$(".new_price_type").val(2);
		}
		if(payType==4){
			$(".amend>ul>.payMold>span").html("M");
			$(".new_price_type").val(4);
		}
		if(payType==5){
			$(".amend>ul>.payMold>span").html("G");
			$(".new_price_type").val(5);
		}
		if($(".useList .zfInfo:eq("+updateNum+")>p").length>3){//判断是否有融合套餐他如果有
			comber=$(".useList .dnseg ").attr("value");
			$(".yesOrNo").eq(1).removeClass("on");
			$('.PackageDetails').css('display','block');
			$(".amend .setMeal input").val($(".useList .chargeInfo:eq("+updateNum+") .rhMoney").text().replace("元","").trim());
			
			if(1==chargeType){
				$(".amend .groupList").html("中国电信");
				$(".new_charge_type").val("1");
			}
			if(2==chargeType){
				$(".amend .groupList").html("中国移动");
				$(".new_charge_type").val("2");
			}
			if(3==chargeType){
				$(".amend .groupList").html("中国联通");
				$(".new_charge_type").val("3");
			}
			var comInput="";
			if(comber!=""&&comber!=undefined){
				for(var i=0;i<comber.split(";").length-1;i++){
					comInput+='<input type="text" class="newAppNum" value="'+comber.split(";")[i]+'" placeholder="如:138211" onkeyup="this.value=this.value.replace(/\\D/g,\'\')" onafterpaste="this.value=this.value.replace(/\\D/g,\'\')" maxlength="7" >';
				}
				if(comInput!=""){
					$(".amend .comboNumList input").remove();
					$(".amend .comboNumList .appendNum").before(comInput);
				};
			};
		}else{
			$(".yesOrNo").eq(1).addClass("on");
			$('.PackageDetails').css('display','none');
			$(".amend .setMeal input").val("");
			$(".amend .comboNumList>input").val("");
			if(undefined==chargeType){
				$(".amend .groupList").html("中国电信");
				$(".new_charge_type").val(1);
			}
		}
	}
	//未启用页面
	if("未启用"==$(".state .on").html()){
		var mealName=$(".qyShort>.zfName").eq(updateNum).text();
		var priceValue=$(".shortStopPrice>.zfMoney").eq(updateNum).text().replace("元","").trim();
		var payType=$(".qyShort").eq(updateNum).attr("paytype");//付费类型
		for(var i=0;i<newNum;i++){
			if($(".blockList .zfInfo:eq("+i+")>p").length<4){
				newNum=newNum-1;
			}
		}
		var chargeType=$(".qyMeal").eq(newNum).attr("value")//归属集团类型
		var yPirceType=$(".qyShort").eq(updateNum).attr("ypriceType");//优惠类型单位
		var yPirceNum=$(".qyShort").eq(updateNum).attr("yPirceNum");//优惠数量
		$(".amend>ul>.xName>input").val(mealName);//收费名称
		$(".amend>ul>.xPrice> #copyPrice").val(priceValue);//收费单价
		$(".amend>ul>.payMold>input").val($(".qyShort").eq(updateNum).attr("value"));//收费类型
		$(".amend .favorable input").val(yPirceNum);
		if($(".blockList .chargeInfo").eq(updateNum).children().length>1){
			//修改赋值套餐描述时,如果前面包含仅仅只有非融合套餐，会渲染出错
			var newDnum=updateNum;
			for(var i=0;i<updateNum;i++){
				if($(".blockList .chargeInfo").eq(i).children().length<2){
					newDnum=newDnum-1;
				}
			}
			$(".amend .zifeiSm textarea").val($(".blockList .zfExplain p").eq(newDnum).text());
		}
		var comber="";
		var ht="";
		if(payType>3){
			$('.p1').text('流量');
			ht+=" <li>M</li>";
			ht+=" <li>G</li>";
			if(yPirceType==0||yPirceType==4){
				$(".amend .favorable span").text("M");
				$(".new_yprice_type").val("4");
			}
			if(yPirceType==5){
				$(".amend .favorable span").text("G");
				$(".new_yprice_type").val("5");
			}
		}else{
			$('.p1').text('时长');
			ht+=" <li>时</li>";
			ht+=" <li>天</li>";
			ht+=" <li>月</li>";
			if(yPirceType==0){
				$(".amend .favorable span").text("时");
				$(".new_yprice_type").val("0");
			}
			if(yPirceType==1){
				$(".amend .favorable span").text("天");
				$(".new_yprice_type").val("1");
			}
			if(yPirceType==2){
				$(".amend .favorable span").text("月");
				$(".new_yprice_type").val("2");
			}
		}
		if(payType==0){
			$(".amend>ul>.payMold>span").html("时");
			$(".new_price_type").val(0);
		}
		if(payType==1){
			$(".amend>ul>.payMold>span").html("天");
			$(".new_price_type").val(1);
		}
		if(payType==2){
			$(".amend>ul>.payMold>span").html("月");
			$(".new_price_type").val(2);
		}
		if(payType==4){
			$(".amend>ul>.payMold>span").html("M");
			$(".new_price_type").val(4);
		}
		if(payType==5){
			$(".amend>ul>.payMold>span").html("G");
			$(".new_price_type").val(5);
		}
		if($(".blockList .zfInfo:eq("+updateNum+")>p").length>3){//如果停用的套餐有融合套餐类型
			comber=$(".blockList .dnseg").attr("value");
			$(".yesOrNo").eq(1).removeClass("on");
			$('.PackageDetails').css('display','block');
			
			$(".amend .setMeal input").val($(".blockList .chargeInfo:eq("+updateNum+") .rhMoney").text().replace("元","").trim());
			
			if(1==chargeType){
				$(".amend .groupList").html("中国电信");
				$(".new_charge_type").val("1");
			}
			if(2==chargeType){
				$(".amend .groupList").html("中国移动");
				$(".new_charge_type").val("2");
			}
			if(3==chargeType){
				$(".amend .groupList").html("中国联通");
				$(".new_charge_type").val("3");
			}
			var comInput="";
			if(comber!=""&&comber!=undefined){
				for(var i=0;i<comber.split(";").length-1;i++){
					comInput+='<input type="text" class="newAppNum" value="'+comber.split(";")[i]+'" placeholder="如:138211" onkeyup="this.value=this.value.replace(/\\D/g,\'\')" onafterpaste="this.value=this.value.replace(/\\D/g,\'\')" maxlength="7" >';
				}
				if(comInput!=""){
					$(".amend .comboNumList input").remove();
					$(".amend .comboNumList .appendNum").before(comInput);
				};
			};
		}else{
			$(".yesOrNo").eq(1).addClass("on");
			$('.PackageDetails').css('display','none');
			$(".amend .setMeal input").val("");
			$(".amend .comboNumList>input").val("");
			if(undefined==chargeType){
				$(".amend .groupList").html("中国电信");
				$(".new_charge_type").val("1");
			}
		}
	}	
	wouldClick();
	checkRepeat();	
}
//移除未停用套餐列表,添加在已停用的套餐列表
function removeMeal(){
	$(".tyShort").eq(divNum).attr("class","short qyShort");
	$(".tyShort").eq(divNum).attr("recommendValue","0");
	$(".ty").eq(divNum).html("启&nbsp;用");
	$(".ty").eq(divNum).attr("class","qy");
	$(".tj").eq(divNum).remove()
	$(".shortUsePrice").eq(divNum).attr("class","short shortStopPrice");
	$(".fuseComboUse").eq(divNum).attr("class","fuseCombo fuseComboStop");
	$(".tyMeal").eq(divNum).attr("class","qyMeal")
	if($(".blockList>div").length==0){
		$(".blockList").html($(".useList>div").eq(divNum));
	}else{
		$(".blockList>div").eq(0).before($(".useList>div").eq(divNum));
	}
	wouldClick();
	return false;
}
//移除停用套餐列表,添加在未停用的套餐列表
function removeStopedMeal(){
	$(".qyShort").eq(divUseNum).attr("class","short tyShort");
	$(".qy").eq(divUseNum).html("停&nbsp;用");
	$(".qy").eq(divUseNum).after("<span class='tj'>推&nbsp;荐</span>");
	$(".qy").eq(divUseNum).attr("class","ty");
	$(".shortStopPrice").eq(divUseNum).attr("class","short shortUsePrice");
	$(".fuseComboStop").eq(divUseNum).attr("class","fuseCombo fuseComboUse");
	$(".qyMeal").eq(divUseNum).attr("class","tyMeal")
	
	if($(".useList>div").length==0){
		$(".useList").html($(".blockList>div").eq(divUseNum));
	}else{
		$(".useList>div").eq(0).before($(".blockList>div").eq(divUseNum));
	}
	wouldClick();
	return false;
}
//修改页面收费类型 时,日,月 按钮绑定
$('.amend .jiu>li').click(function(){
	var n=$('.amend .jiu>li').index(this);
	var str=$('.amend .jiu>li').eq(n).html();
	var type=$('.amend .jiu>li').eq(n).attr("value");
	$("#price_type").val(type);
	$('.amend .payMold>span').html(str);
	if("时"==str){
		$(".new_price_type").val(0);
	}
	if("天"==str){
		$(".new_price_type").val(1);
	}
	if("月"==str){
		$(".new_price_type").val(2);
	}
	$('.amend .payList').css('display','none');
	return false;
});

$('.amend .xin>li').click(function(){
	var n=$('.amend .xin>li').index(this);
	var str=$('.amend .xin>li').eq(n).html();
	var type=$('.amend .xin>li').eq(n).attr("value");
	$("#price_type").val(type);
	$('.amend .favorable>span').html(str);
	if("时"==str){
		$(".new_price_type").val(0);
	}
	if("天"==str){
		$(".new_price_type").val(1);
	}
	if("月"==str){
		$(".new_price_type").val(2);
	}
	$('.amend .payList').css('display','none');
	return false;
});

$('.amend .payMold>span').click(function(){
	if($('.amend .jiu').css('display')=="none"){
		$('.amend .jiu').css('display','block');
	}else{
		$('.amend .payList').css('display','none');
	}
});
$('.amend .favorable>span').click(function(){
	if($('.amend .xin').css('display')=="none"){
		$('.amend .xin').css('display','block');
	}else{
		$('.amend .payList').css('display','none');
	}
});
//修改页面归属集团选择按钮绑定
$('.amend .teamGroup>ul>li').click(function(){
	var obj=$('.amend .teamGroup>button');
	var n=$('.amend .teamGroup>ul>li').index(this);
	var str=$('.amend .teamGroup>ul>li').eq(n).html();
	if("中国电信"==str){
		$(".new_charge_type").val("1");
	}
	if("中国移动"==str){
		$(".new_charge_type").val("2");
	}
	if("中国联通"==str){
		$(".new_charge_type").val("3");
	}
	$('.amend .teamGroup>ul').css('display','none');
	obj.html(str);
	return false;
});
//新增页面归属集团选择按钮绑定
$('.charging .teamGroup>ul>li').click(function(){
	var obj=$('.charging .teamGroup>button');
	var n=$('.charging .teamGroup>ul>li').index(this);
	var str=$('.charging .teamGroup>ul>li').eq(n).html();
	if("中国电信"==str){
		$(".add_charge_type").val(1);
	}
	if("中国移动"==str){
		$(".add_charge_type").val(2);
	}
	if("中国联通"==str){
		$(".add_charge_type").val(3);
	}
	$('.teamGroup>ul').css('display','none');
	obj.html(str);
	return false;
});
$('.teamGroup').click(function(){
	var str=$('.charging .teamGroup>ul').css('display');
	if(str=='block'){
		$('.charging .teamGroup>ul').css('display','none');
	}else{
		$('.charging .teamGroup>ul').css('display','block');
	}
});
$('.amend .teamGroup').click(function(){
	var str=$('.amend .teamGroup>ul').css('display');
	if(str=='block'){
		$('.amend .teamGroup>ul').css('display','none');
	}else{
		$('.amend .teamGroup>ul').css('display','block');
	}
});
$('.whether>button').click(function(){
	var n=$('.whether>button').index(this);
	whetherDisp(n);
});
$('.wether>button').click(function(){
	var n=$('.wether>button').index(this);
	whetherSure(n);
});
function whetherDisp(n){
	if(n==0){//点---是
		$('.whether').css('display','none');
		$('.newly').animate({left:2000},1000);
		$('.btns').animate({left:2000},1000);
		setTimeout(function(){
			$('.mask').css('display','none');
		},500); 
		$(".charging input").each(function(){
			$(this).val("");
		});
		$(".charging .newAppNum").remove();
		$("#price_type").val("0");
		$("#charge_type").val("1");
		$(".charging .groupList").html("中国电信");
		$(".charging .payMold>span").html("时");
		$(".amend .zifeiSm textarea").val("");
		$(".charging .appNum").val("");
		$(".amend .comboNumList>input").remove();
		$(".amend .appendNum").before('<input type="text"  value="" placeholder="如:138211" onkeyup="this.value=this.value.replace(/\\D/g,\'\')" onafterpaste="this.value=this.value.replace(/\\D/g,\'\')" maxlength="7" >');
		$('.fuseAdd>.yesOrNo').eq(0).addClass('on');
		$(".PackageDetails").css("display","none");
		$("#liul").val('流量');
		$("#shic").val('时长');
		$(".add_give_type").val("0");
		$(".add_price_type").val("0");
		$(".add_charge_type").val("1");
		$(".new_charge_type").val("1");
		var ht="";
		ht+=" <li value='0'>时</li>";
		ht+=" <li value='1'>天</li>";
		ht+=" <li value='2'>月</li>";
		$(".charging .payList li").remove();
		$(".charging .payList").html(ht);
		$(".charging .payMold > span").text('时');
		$(".charging .favorable > span").text('时');
		addNewPage();
	
	}else{// 点--否
		$('.whether').css('display','none');
	}
};
function whetherSure(n){
	if(n==0){//点---是
		$('.wether').css('display','none');
		$('.newly').animate({left:2000},1000);
		$('.btns').animate({left:2000},1000);
		setTimeout(function(){
			$('.mask').css('display','none');
		},500);
		//修改提交时的判断
		if($(".mask").css("display")!="none"){
			if("yesOrNo"!=$('.yesOrNo').eq(1).attr("class")&&updateSubmitCheck){
				updateNoChargePrice();
			}
			if("yesOrNo"==$('.yesOrNo').eq(1).attr("class")&&updateSubmitCheck){	
				updateChargePrice();	
			}	
		}else{
			//停用套餐	
			if("已启用"==$(".state .on").html()){
				updateStop();
			}
			//启用套餐
			if("未启用"==$(".state .on").html()){
				updateNoStop();
			};	
	  }
	}else{// 点--否
		$('.wether').css('display','none');
	}
};
//用户推荐套餐
function recommend(n,type){
	var name=$(".tyShort>.zfName").eq(n).text();
	var id=$("#ulConfig .on").attr("value"); 
	$.ajax({
		type:"post",
		url:ctx+"/SitePriceBilling/recommendMeal",
		data:{
			mealName:name,
			siteId:id,
			type:type//type==0时为取消推荐  1为推荐
		},
		success:function(data){
			if(data=="loseSession"){
				 window.location.href=ctx+"/toLogin";
				 return;
			}	
			eval("data="+data);
			if(type==0){
				if(data.code=200){
					$('.chargeInfo').eq(n).removeClass('recommend');
					$('.tj').eq(n).text("推 荐");
					$(".tyShort").eq(n).attr("recommendvalue","0");
					return false;
				}else{
					$(".win>span").html("网络出错请稍后重试");
					winHint();
					return false;
				}
			}else{
				if(data.code==200){
					$('.chargeInfo').eq(n).addClass('recommend');
					$('.tj').eq(n).text("取消推荐");
					$(".tyShort").eq(n).attr("recommendvalue","1");
					if(n!=0){
						$(".fuseComboUse").eq(0).before($(".fuseComboUse").eq(n));
					}
					
					return false;
					
				}else if(data.code==201){
					$(".win>span").html("网络出错请稍后重试");
					winHint();
					return false;
				}else{
					$(".win>span").html("已有推荐套餐,请先取消再推荐");
					winHint();
					return false;
				}
			}	
		}
		
	})
}
