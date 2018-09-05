var dang=0;
buffer();
$(function() {
	$('body').click(function(){
		$('.pullD').css('display','none');
	});
	init();
	getCustomerList(1);
	getTotalAmount();
	getToTalNum(); 
	$('.goLeft').click(function(){
		dang--;
		if(dang<0){
			dang=0;
			numdisp(dang);
		}else{
			buffer();
			$('.num').removeClass('on').eq(dang).addClass('on');
			var nowPage=$('.num').eq(dang).html();
			getCustomerList(nowPage);
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
			getCustomerList(nowPage);
			numdisp(dang);
		}
	});
	//跳转绑定事件
	$("#jump").click(function(){
		var num=$("#num").val();
		  var totalPage=$(".zong").text().replace(/[^0-9]/ig,"");//总页数
		if(num!=""){
			buffer();
			if(parseInt(num)<=0){
				num = 1;
			}else if(parseInt(num)>=parseInt(totalPage)){
				num = totalPage;
			};
			$('.num').removeClass('on').eq(num-1).addClass('on');
			getCustomerList(num);
			numdisp(num-1);
		}
	});
	//分页查询回车事件
	$("#num").keypress(function(event){
		var e=event || window.event || arguments.callee.caller.arguments[0];
		  if(e && e.keyCode==13){
			  var num=$("#num").val();
			  if(num !=""){
				  buffer();
				  var totalPage=$(".zong").text().replace(/[^0-9]/ig,"");//总页数
				  if(parseInt(num)>parseInt(totalPage)){//如果大于总页数则使用总页数查询否则使用当前页查询
					  $('.num').removeClass('on').eq(totalPage-1).addClass('on');
					  getCustomerList(totalPage);
					  numdisp(totalPage-1);
				  }else{
					  if(parseInt(num)<0){
						  num=1;
					  }
					  $('.num').removeClass('on').eq(num-1).addClass('on');
					  getCustomerList(num);
					  numdisp(num-1);
				  }
			  } 
		  }
	});
	//用户名查询回车事件
	$("#selByUserName").keypress(function(event){
		var e=event || window.event || arguments.callee.caller.arguments[0];
		  if(e && e.keyCode==13){
			  	buffer();
				getCustomerList(1);
				getTotalAmount();
				getToTalNum();
		  }
		  
	});
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
	//场所查询绑定按钮
	$('#collegeSite').unbind("click");
	$('#collegeSite').click(function(){
		var n=$('#collegeSite').index(this);
		collDisp1(n);
		return false;
	});
	$('#pullDsite>li').click(function(){
		buffer();
		var n=$('#pullDsite>li').index(this);
		var str=$('#pullDsite>li').eq(n).html()+'<i class="icon icon-down"></i>';
		$("#site_id").val($('#pullDsite>li').eq(n).attr("value"));
		$('#collegeSite').html(str);
		$("#pullDsite").hide();
		$(".collegeType").html("全部"+'<i class="icon icon-down"></i>');
			getPayName();
			return false;
	});
	//查询按钮绑定事件
	$("#selBtn").click(function(){
		buffer();
		getCustomerList(1);
		getTotalAmount();
		getToTalNum();
	});
	//充值类型按钮绑定
	$('.collegeType').click(function(){
		var n=$('.collegeType').index(this);
		collDisp(n);
		return false;
	});
	$('.pullDtype>li').click(function(){
		buffer();
		var n=$('.pullDtype>li').index(this);
		var str=$('.pullDtype>li').eq(n).html()+'<i class="icon icon-down"></i>';
		$('.collegeType').html(str);  
		$(".pullDtype").hide();
		getCustomerList(1);
		getTotalAmount();
		getToTalNum();
	});
	$(".download").click(function(){
		exportExport();
	});
	$('.switch').eq(0).click(function(){
		buffer();
		$('.dateSelect').css('display','none');
		$('.rechargeType').css('display','none');
		$('.names').css('display','block');
		$("#selByUserName").val("");
		getCustomerList(1);
		getTotalAmount();
		getToTalNum();
	});
	$('.switch').eq(1).click(function(){
		buffer();
		$('.dateSelect').css('display','block');
		$('.rechargeType').css('display','block');
		$('.names').css('display','none');
		$('.collegeType').html("全部"+'<i class="icon icon-down"></i>');
		$("#selByUserName").val("");
		getCustomerList(1);
		getTotalAmount();
		getToTalNum();
	});
});	
	
function init(){
	$("#site_id").val($('#pullDsite>li').eq(0).attr("value"));
	
	if($("#pullDsite li").length!=0){
		$('#collegeSite').html($('#pullDsite>li').eq(0).html()+'<i class="icon icon-down"></i>');
	}	
	//$(".collegeType").html($(".pullDtype>li").eq(0).html()+'<i class="icon icon-down"></i>');
	
}
$(".user-college").blur(function(){
var userName=$(".user-college").val();
	
	var addressRule = /^(((13[0-9]{1})|(14[4-7]{1})|(15[0-9]{1})|(170)|(17[1-8]{1})|(18[0-9]{1}))+\d{8})$/;
	if(userName!=""&&!(addressRule.test(userName))){
		$(".win").html("请输入正确的用户名");
		win();
		return;
	}
});

function collDisp1(n){
	$("#pullDsite").toggle();
}
function collDisp(n){
	$(".pullDtype").toggle();
}; 
function getPayName(){
	var siteId=$("#site_id").val();//场所id
	$.ajax({
		type:"POST",
		url:ctx+"/siteIncome/getNameList",
		data:{
			id:siteId
		},
		success:function(data){
			if(data=="loseSession"){
				 window.location.href=ctx+"/toLogin";
				 return;
			}	
			eval("data="+data);
			if(data.code=200){
				bulidLi(data);
			}
		}
	});
}
function bulidLi(data){
	$(".pullDtype>#temp").remove();
	var payHtml="";
	for (var j = 0; j < data.data.length; j++) {
		if(data.data[j]!=0){
			if(data.data[j].name!=""){
				payHtml+="<li id='temp'>"+data.data[j].name+"</li>";
			}
		}
	}
	$(".pullDtype>li:eq(0)").after(payHtml);
	//$(".collegeType").html($(".pullDtype>li").eq(0).html()+'<i class="icon icon-down"></i>');
	getCustomerList(1);
	getTotalAmount();
	getToTalNum();
	//充值类型按钮绑定
	$('.collegeType').unbind("click");
	$('.collegeType').click(function(){
		var n=$('.collegeType').index(this);
		collDisp(n);
		return false;
	});
	$('.pullDtype>li').click(function(){
		buffer();
		var n=$('.pullDtype>li').index(this);
		var str=$('.pullDtype>li').eq(n).html()+'<i class="icon icon-down"></i>';
		$('.collegeType').html(str);  
		$(".pullDtype").hide();
		getCustomerList(1);
		getTotalAmount();
		getToTalNum();
	});
	
}
//获得列表
function getCustomerList(num) {
	var siteId=$("#site_id").val();//场所id
	if(siteId==""){
		siteId=-1;
	}
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
	if (num == undefined)
		return;
	if (isNaN(num))
		return;
	$.ajax({
		type : "POST",
		url : ctx+"/siteIncome/getUserInfoList",
		data : {
			siteId : siteId,
			startDate:startDate,
			endDate:endDate,
			payName:payName,
			userName:userName,
			curPage : num,
			pageSize : 9
		},
		success : function(data) {
			if(data=="loseSession"){
				 window.location.href=ctx+"/toLogin";
				 return;
			}	
			eval("data = " + data);
			if (data.code == 200) {
				$(".download").removeAttr("disabled");
				$(".download").css('background','#57c6d4');
				buildTable(data);	
				$("#num").val("");
			}else if(data.code == 202){
				$(".win>span").html("该用户无场所,请添加场所");
				$(".download").css('background','#ccc');
				$(".download").attr("disabled", true);
				win();
			}else{
				if($(".names").css("display")!="none"){
					$(".download").css('background','#ccc');
					$(".download").attr("disabled", true);
					$(".win>span").html("该场所下没有此缴费用户");
					win();
					$(".timeType").remove();
					
				}else{
					$(".download").css('background','#ccc');
					$(".download").attr("disabled", true);
					$(".win>span").html("没有该付费类型的缴费用户");
					win();
					$(".timeType").remove();
				}
			}
			$('.barcontainer').css('display','none');
		}
	});
}

function buildTable(data) {
	$(".timeType").remove();
	var tableHtml="";
	for (var i = 0; i < data.data.length; i++) {
		tableHtml+="<li class='timeType'><p>";
		tableHtml+=	"<p>"+data.data[i].payAmount==undefined?"0":data.data[i].payAmount+"</p>";
		if(data.data[i].payName=="0"){
			tableHtml+=	"<p>-</p>";
		}else{
			tableHtml+=	"<p>"+data.data[i].payName+"</p>";
		}
		if(+data.data[i].buyNum=="0"){
			tableHtml+=	"<p>-</p>";
		}else{
			
			tableHtml+=	"<p>"+data.data[i].buyNum+"</p>";
		}
		if(data.data[i].userName.indexOf("0")==0){
			tableHtml+=	"<p>营业厅充值</p>";
		}else{
			tableHtml+=	"<p>自助充值</p>";
		}
		if(data.data[i].userName.indexOf("0")==0){
			tableHtml+=	"<p>"+data.data[i].userName.replace(0,"").trim()+"</p>";
		}else{
			tableHtml+=	"<p>"+data.data[i].userName+"</p>";
		}
		tableHtml+=	"<p>"+data.data[i].createTime+"</p>";
		tableHtml+= "</li>";
		
	}
	
	$(".user-list>ul>h6").after(tableHtml);
	
}
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
function page(){
	 $(".num").unbind('click');	
	$('.num').click(function(){
		dang=$('.num').index(this);
		$('.num').removeClass('on').eq(dang).addClass('on');
		var numPage=$('.num').eq(dang).html();
		getCustomerList(numPage);
		numdisp(dang);
		buffer();
	});
}

function getToTalNum(){
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
			type:"POST",
			url :ctx+ "/siteIncome/getTotalPage",
			data:{
				siteId : siteId,
				startDate:startDate,
				endDate:endDate,
				payName:payName,
				userName:userName,
				pageSize : 9,
			},
			success:function(data){
				if(data=="loseSession"){
					 window.location.href=ctx+"/toLogin";
					 return;
				}	
				eval("data="+data);
				getPage(data);
				numdisp(0);
			}
		});
}
function getPage(data){
	$(".num").remove();
	var pageHtml="";
	if(data.totoalNum>0){
		
		for(var j=1;j<=data.totoalNum;j++){
			pageHtml+="<li class='num'>"+j+"</li>";
		}
		$(".goLeft").after(pageHtml);
		$('.num').eq(0).addClass('on');
		$(".zong").text("共"+data.totoalNum+"页");
	}else{
		pageHtml+="<li class='num'>"+0+"</li>";
		$(".goLeft").after(pageHtml);
		$(".zong").text("共"+0+"页");
	}
	
	page();
	
}
//导出文件
function exportExport(){
	var siteId=$("#site_id").val();//场所id
	var startDate=$("#startDate").val();//按日期的开始时间
	var endDate=$("#endDate").val();//到日期的结束时间
	var payName=$(".collegeType").text();//付费类型
	var userName=$("#selByUserName").val();//用户名
	if($(".names").css("display")!="none"){
		payName="";
	}
	if("全部"==payName){
		payName="";
	}
	window.location.href=ctx+"/siteIncome/exportExport?siteId="+siteId+"&startTime="+startDate+
							"&endTime="+endDate+"&payName="+payName+"&userName="+userName;
		
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
	//$('.barcontainer').fadeOut(800);
}
function win(){
	$('.win').css('display','block').fadeOut(2500);
};
