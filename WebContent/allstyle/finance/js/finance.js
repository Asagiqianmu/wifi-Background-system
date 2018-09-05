var chkArr = [];  //全局变量  获取复选框被选中的索引
var numReg = new RegExp("^[0-9]*$"); 
var reg = /^(((13[0-9]{1})|(14[4-7]{1})|(15[0-9]{1})|(170)|(17[1-8]{1})|(18[0-9]{1}))+\d{8})$/;// 手机号码判断正则
$(function(){

	/* 正则 */
	/* 正则 */

	/* 方法调用 */
	//setAllBili()
	getPageAll();
	getPageData(1);
	getRatio();
	/* 方法调用 */

	//展开收起左侧菜单
	$('.module').click(function(){
		shouzhan();
	});
	$('.incline').click(function(){
		shouzhan();
	});
	//结算比例Tab
	$('.tab > span').click(function(){
		var n = $('.tab > span').index(this);
		changeOn($('.tab > span'),n)
		$('.contList').css('display','none').eq(n).css('display','table');
	});

	/* 修改结算比例 */

	//批量结算比例修改
	$('.batch').click(function(){
		$('.batchList').css('display','block');
		var n = $('.contList > tbody > tr').length;
		// console.log(n);
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
			$('.ratio').eq(n).val(str);
		});
		return false;
	});

	//----------------------
	$('.setDef').click(function(){
		$('.deBox').css('display','block');

		$('.dqd').unbind('click');
		//修改结算比例确定按钮
		$('.dqd').click(function(){
			var str = $('.dinp').val();
			if(str!=''&&str!=null&&str!=undefined){
				if(numReg.test(str)){
					if(str<100){
						updateRatio(str);
					}
				}
			}
			$('.deBox').css('display','none');
			$('.deBox input').val('');
		});
		return false;
	});
	$('.dqx').click(function(){
		$('.deBox').css('display','none');
	});
	$('.deBox').click(function(){return false;});

	//----------------------------
	$('.setAgency').click(function(){
		$('.agBox').css('display','block');

		$('.aqd').unbind('click');
		//修改结算比例确定按钮
		$('.aqd').click(function(){
			var str = $('.ainp').val();
			if(str!=''&&str!=null&&str!=undefined){
				if(numReg.test(str)){
					if(str<100){
						if(getTat()=='代理商比例'){
							updateSelect(chkArr,str);
							$("input[name='chkSelect']").attr("checked", null);
							chkArr = [];
						}else{
							for(var i in chkArr){
								$('.ratio').eq(chkArr[i]).val(str+'%');
								$("input[name='chkSelect']").attr("checked", null);
							}
						}
					}
				}
			}
			$('.agBox').css('display','none');
			$('.agBox input').val('');
		});
		return false;
	});
	$('.aqx').click(function(){
		$('.agBox').css('display','none');
	});
	$('.agBox').click(function(){return false;});
	/* 修改结算比例 */
	
	$(".page_to").keydown(function(event){
		var e = event || window.event || arguments.callee.caller.arguments[0];
		 if(e && e.keyCode==13){ 
			var n = parseInt($('.page_to').val());
			pageNum(n);
		 }
	})

	/* 跳转到某页 */
	$('.skip').click(function(){
		var n = parseInt($('.page_to').val());
		if(n>0&&n<=$('.gong').attr('data-zong')){
			if(n!=$('.num.on').text()){
				pageNum(n);
			}
		}
		$('.page_to').val('');
	});
	/* 跳转到某页 */
	
	/* 查询按钮 */
	$('.queryBtn').click(function(){
		var qStr = $('.qInp').val();
		if(qStr==""||reg.test(qStr)){
			
			getPageData(1);
			getPageAll();
		}else{
			$(".win>span").html("请输入正确的商户账号");
			winHint();
		}
	});

	$('.qInp').keypress(function(e){
		if(e.keyCode==13){
			var qStr = $('.qInp').val();
			if(qStr==""||reg.test(qStr)){
				getPageData(1);
				getPageAll();
			}else{
				$(".win>span").html("请输入正确的商户账号");
				winHint();
			}
		}
	});
	/* 查询按钮 */
	
	$('body').click(function(){
		$('.batchList').css('display','none');
		$('.raList').css('display','none');
		$('.crBox').css('display','none');
		$('.deBox').css('display','none');
		$('.agBox').css('display','none');
	});

})

//展开收起左侧菜单
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
/*获取结算比例*/
function getRatio(){
	$.ajax({
		type:"post",
		url:ctx+"/SettlementRatio/getRatioConfig",
		data:{},
		success:function(data){
			if(data=="loseSession"){
				 window.location.href=ctx+"/toLogin";
				 return;
			}	 
			data=JSON.parse(data);
			if(data.code==200){
				var ratio=parseFloat(data.data)*100;
				$(".sett").text(ratio+"%");
			}
		}
		
	})
}
/*修改配置结算比例*/
function updateRatio(str){
	$.ajax({
		type:"post",
		url:ctx+"/SettlementRatio/saveUserRatio	",
		data:{
			radiao:str
		},
		success:function(data){
			if(data=="loseSession"){
				 window.location.href=ctx+"/toLogin";
				 return;
			}	 
			data=JSON.parse(data);
			if(data.code==200){
				$('.sett').text(str+'%');
			}
		}
	
	})
	
}
/*修改选中部分的结算比例*/
function updateSelect(chkArr,str){
	var userId = '';
	for(var i in chkArr){
		userId += $('.agency > tbody tr').eq(chkArr[i]).attr('data-id')+',';
	}
	$.ajax({
		type:"post",
		url:ctx+"/SettlementRatio/saveUserRatio",
		data:{
			userId:userId.substring(0, userId.length-1),
			radiao:str
		},
		success:function(data){
			if(data=="loseSession"){
				 window.location.href=ctx+"/toLogin";
				 return;
			}	 
			data=JSON.parse(data);
			if(data.code==200){
				for(var i in chkArr){
					$('.crq').eq(chkArr[i]).text(str+'%');
				}
			}
		}
		
	})
}
/*修改个人结算比例*/
function updatePalRatio(n,str){
	var userId=$('.agency > tbody tr').eq(n).attr("data-id");
	$.ajax({
		type:"post",
		url:ctx+"/SettlementRatio/saveUserRatio",
		data:{
			userId:userId,
			radiao:str
		},
		success:function(data){
			if(data=="loseSession"){
				 window.location.href=ctx+"/toLogin";
				 return;
			}	 
			data=JSON.parse(data);
			if(data.code==200){
				$('.crq').eq(n).text(str+'%');
			}
		}
		
	})
}
/* 分页方法 */

//获取总页数方法
function getPageAll(){
	$("#pages").css("display","block");
	var qStr = $('.qInp').val();
	$.ajax({
		type: 'post',
		url: ctx+"/SettlementRatio/getPageCount",
		data:{
			userName:qStr
		},
		success: function(data){
			data=JSON.parse(data);
			if(data.data==0)$("#pages").css("display","none");
			else{
				/*分页*/
				pages(
					data.data,
					function (currentPage){
						getPageData(currentPage);
					});
				}
			}
//			if(data.code==200){
//				var htmls = '';
//				for(var i=1;i<=data.data;i++){
//					if(i==1){
//						htmls += '<a href="javascript:pageNum(1)" class="num on">1</a>';
//						// console.log(htmls)
//					}else{
//						htmls += '<a href="javascript:pageNum('+i+')" class="num">'+i+'</a>';
//					}
//				}
//				$('.page_next').before(htmls);
//				$('.gong').text('共'+data.data+'页').attr('data-zong',data.data);
//				numDisp(0);
//			}else{
//				$('.gong').text('共'+0+'页').attr('data-zong',data.data);
//				numDisp(0);
//			}
//		}
	});
}
//切换当前页
function pageNum(n){
	//console.log()
	if(n==$('.num.on').text()) return;
	$('.num').removeClass('on').eq(n-1).addClass('on');
	numDisp(n-1);
	getPageData(n);
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
	if(str){
		var dang = $('.num.on').text()-0;
		var n = $('.num').length;
		if(dang==n){
			return false;
		}
		pageNum(dang+1);
	}else{
		var n = $('.num.on').text()-0;
		if(n==1){
			return false;
		}
		pageNum(n-1);
	}
}

/* 分页方法 */


/* 获取当前选项卡 */
function getTat(){
	return $('.tab > span.on').text();
}
/* 获取当前选项卡 */
/* 获取某一页的数据 */
function getPageData(n){
	var qStr = $('.qInp').val();
	$.ajax({
		type: 'post',
		url: ctx+"/SettlementRatio/getUserRadiao",
		data: {
			curPage: n,
			userName:qStr
		},
		success: function(data){
			if(data=="loseSession"){
				 window.location.href=ctx+"/toLogin";
			}else{
				data = JSON.parse(data);
				if(data.code==200){
					addData(data);
					
				}else{
					addData(data);
					$(".win>span").html("查无次商户,请确认商户账号是否正确");
					winHint();
				}
			}
		},

	});
}
/* 获取某一页的数据 */

/* 渲染数据方法 */
function addData(data){
	$('.agency tbody tr').remove();
	if(data.code==200){
		var htmls = '';
		for(var i=0;i<data.data.length;i++){
			if(data.data[i].siteList.length>1){
				htmls +='<tr data-id="'+data.data[i].userId+'">'+
							'<td class="short"><input class="chbox" data-state="0" type="checkbox" name="chkSelect"/></td>'+
							'<td class="short"><img src='+imgPath+'/photo.png></td>'+
							'<td class="long">'+(data.data[i].realName=="null"?"未知":data.data[i].realName)+'</td>'+
							'<td class="long">'+data.data[i].userAccount+'</td>'+
							'<td class="long duo posi">'+data.data[i].siteList.length+'所'+
								'<div class="school">';
								for(var j=0;j<data.data[i].siteList.length;j++){
									htmls += '<p>场所'+parseInt(j+1)+'：'+data.data[i].siteList[j]+'</p>';
								}
								htmls+='</div>'+
							'</td>'+
							'<td class="long wrench posi"><span class="crq">'+data.data[i].scale*100+'%</span><img class="cRatio tip" src='+imgPath+'/wrench.png>'+
								'<div class="crBox">'+
									'<span class="crt">结算比例</span>'+
									'<p><input class="fl cinp" type="text" name="" placeholder="请输入结算比例">%</p>'+
									'<span class="msg">注：范围0-100整数</span>'+
									'<p><button class="fl tip cqd" type="button">应用</button><button class="fr tip cqx" type="button">取消</button></p>'+
								'</div>'+
							'</td>'+
						'</tr>';
			}else{
				htmls += '<tr data-id="'+data.data[i].userId+'">'+
							'<td class="short"><input class="chbox" data-state="0" type="checkbox" name="chkSelect"/></td>'+
							'<td class="short"><img src='+imgPath+'/photo.png></td>'+
							'<td class="long">'+(data.data[i].realName=="null"?"未知":data.data[i].realName)+'</td>'+
							'<td class="long">'+data.data[i].userAccount+'</td>'+
							'<td class="long">'+data.data[i].siteList[0]+'</td>'+
							'<td class="long wrench posi"><span class="crq">'+data.data[i].scale*100+'%</span><img class=cRatio tip" src='+imgPath+'/wrench.png>'+
								'<div class="crBox">'+
									'<span class="crt">结算比例</span>'+
									'<p><input class="fl cinp" type="text" name="" placeholder="请输入结算比例">%</p>'+
									'<span class="msg">注：范围0-100整数</span>'+
									'<p><button class="fl tip cqd" type="button">应用</button><button class="fr tip cqx" type="button">取消</button></p>'+
								'</div>'+
							'</td>'+
						'</tr>';
			}
		}
		$('.agency tbody').html(htmls);
		//修改结算比例按钮
		$('.cRatio').unbind('click');
		$('.cqx').unbind('click');
		$('.crBox').unbind('click');
		$('.cRatio').click(function(){
			var n = $('.cRatio').index(this);
			$('.crBox').css('display','none').eq(n).css('display','block');

			$('.cqd').unbind('click');
			//修改结算比例确定按钮
			$('.cqd').click(function(){
				//var n = $('.cqd').index(this);
				var str = $('.cinp').eq(n).val();
				
				// console.log(str)
				if(str!=''&&str!=null&&str!=undefined){
					if(numReg.test(str)){
						if(str<100){
							updatePalRatio(n,str)
						}
					}
				}
				$('.crBox').css('display','none');
				$('.crBox input').val('');
			});
			return false;
		});
		
		
		$('.cqx').click(function(){
			$('.crBox').css('display','none');
		});
		$('.crBox').click(function(){return false;});
		/* 修改结算比例 */
		
		/* 复选框 操作 */
		
		$("input[name='chkSelect']").click(function(){
			var n = $("input[name='chkSelect']").index(this);
			if($("input[name='chkSelect']").eq(n).attr('data-state')==0){
				$("input[name='chkSelect']").eq(n).attr('data-state',1);
				chkArr.push(n);
			}else{
				$("input[name='chkSelect']").eq(n).attr('data-state',0);
				for(var i in chkArr){
					if(chkArr[i]==n){
						chkArr.splice(n,1);
					}
				}
			}
		});
		/* 复选框 操作 */
		$('.page_to').val('');
	}
}
