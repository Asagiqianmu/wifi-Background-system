var tel = /^(((13[0-9]{1})|(14[4-7]{1})|(15[0-9]{1})|(170)|(17[1-8]{1})|(18[0-9]{1}))+\d{8})$/;
$(function(){
	
	$(".linkList li").click(function(){
		var n=$(".linkList li").index(this);
		var jumpPath="";
		switch (n) {
			case 1:jumpPath="/SettlementRatio/jumpFance"; break;
			case 2:jumpPath="/SettlementRatio/getPageHtml"; break;
			case 3:jumpPath="/SettlementRatio/getAccount"; break;
			case 0:jumpPath="/SettlementRatio/getTotalIncome"; break;
			case 4:jumpPath="/SettlementRatio/getSiftings"; break;
			case 5:jumpPath="/SettlementRatio/getAgency"; break;
		}
		window.location.href=ctx+jumpPath
	})
	
	// 退出按钮
	$('.menu > li.exit').click(function(){
		window.location.href=ctx+"/logOut";
	});
	


})
/* 渲染数据方法 */
function winHint(){
	$('.win').css('display','block').fadeOut(2500);
};