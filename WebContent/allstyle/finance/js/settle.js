var index = 1;//新增的第几个资费
var supern=0;
window.onload=function(){

	/* 正则 */
	var numReg = new RegExp("^[0-9]*$"); 
	/* 正则 */

	/* 方法调用 */
	getDataList(getAjaxName());
	initMone();
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
		changeOn($('.tab > span'),n);
		getDataList(getAjaxName());
	});
	$('#closeMask').click(function () {
		   retract();
	})
	
	//选项卡
	$('.ptab > span').click(function(){
		var n = $(this).index();
		changeOn($('.ptab > span'),n);
		switch (n){
			case 0:$('.contList').css('display','none');$('.agency_notAudit').css('display','table');$('.pljs').css('display','block');break;
			case 1:$('.contList').css('display','none');$('.agency_notPay').css('display','table');$('.pljs').css('display','none');break;
			case 2:$('.contList').css('display','none');$('.agency_endPay').css('display','table');$('.pljs').css('display','none');break;
			case 3:$('.contList').css('display','none');$('.by_appeal').css('display','table');$('.pljs').css('display','none');break;
		}
		getDataList(getAjaxName());
	});

	/* 修改起始金额和结算周期 */
	$('.cRatio').click(function(){
		$('.MDinp').css('display','block');
		$('.setMDbtn').click(function(){
			var money = $('.startMoney').val();
			var period = $('.period').val();
			if(money==""||period==""||money==0||period==0){
				$(".win>span").html("请输入正确金额或周期");
				winHint();
			}else{
				updateInitMone();
			}
			return false;
		});
		return false;
	});

	$('.cleMDbtn').click(function(){
		$('.MDinp').css('display','none');
	});
	$('.MDinp').click(function(){return false;});
	/* 修改起始金额和结算周期 */

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
	
	//-----------------------------
	
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
		$('.MDinp').css('display','none');
		$('.costType > ul').css('display','none');
	});

	


	//显示被申诉原因
	$('.psuyy').hover(function(){
		var n = $('.psuyy').index(this);
		$('.suYy').eq(n).css('display','block');
	},function(){
		$('.suYy').css('display','none');
	});

	/* 跳转到某页 */
	$('.skip').click(function(){
		var n = parseInt($('.page_to').val());
		console.log($('.num.on').text())
		if(n>0&&n<=$('.gong').attr('data-zong')){
			if(n!=$('.num.on').text()){
				pageNum(n);
			}
		}
		$('.page_to').val('');
	});
	/* 跳转到某页 */

	/* 关闭右侧弹出层 */
	$('.m_title > span').click(function(){
		retract();
	});

	$('.btns > button').eq(1).click(function(){
		retract();
	});
	/* 关闭右侧弹出层 */

	/* 添加其他资费 */
	
	$('.add_zf').click(function(){
		if($('.addmod').length>=1){
			n = $('.addmod').length+1;
		}
		$.ajax({
			type: 'post',
			url: ctx+'/SettlementRatio/getMoneyType',
			data: {
			},
			success: function(data){
				data = JSON.parse(data);
				var htmls='';
				htmls+='<div class="mod1 addmod">'+
							'<p>新增资费'+index+'</p>'+
							'<div>'+
								'<div class="costType">费用类型：<span class="seleType tip">'+data.data[0]+'</span>'+
									'<ul>';
				for(var i=0;i<data.data.length;i++){
					htmls+='<li>'+data.data[i]+'</li>';
				}
							htmls+='</ul>'+
								'</div>'+
								'<div class="upPic">'+
									'<span>上传图片附件</span>'+
									'<p class="upLoad tip">'+
										'<span class="round">+</span>'+
										'<span class="upText">上传图片</span>'+
										'<input type="file" class="tip choose" accept="image/*" multiple>'+
									'</p>'+
								'</div>'+
								'<p class="bz_text"><span>备注：</span><textarea placeholder="费用类型（可不填）"></textarea></p>'+
							'</div>'+
						'</div>';
				$('.btns').before(htmls);
				//$('.costType > ul').html(htmls);
				/* 选择费用类型 */
				$('.seleType').unbind('click');
				$('.seleType').click(function(){
					var nn = $('.seleType').index(this);
					$('.costType > ul').eq(nn).css('display','block');
					return false;
				});
				$('.costType > ul > li').unbind('click');
				$('.costType > ul > li').click(function(){
					var nnd = $('.costType > ul > li').index(this);
					console.log(nnd);
					var str = $('.costType > ul > li').eq(nnd).text();
					console.log(str);
					$('.costType > ul > li').eq(nnd).parent().prev().text(str);
					$('.costType > ul').css('display','none');
				});
				$('.costType > ul').unbind('click');
				$('.costType > ul').click(function(){
					return false;
				});
				/* 选择费用类型 */
				/* 上传图片按钮 */
				$('.choose').unbind('click');
				$('.choose').click(function(){
					var n = $('.choose').index(this);
					console.log(n)
					upImg(undefined,n);
				});
				/* 上传图片按钮 */
				index++;
			}
		});
	});
	/* 添加其他资费 */

	/* 保存金额修改 */
	$('.saveCgMoney').click(function(){
		if($(".change_money input").val()!=""){
			setChangeInfo();
		}else{
			$(".win>span").html("请输入修改金额");
			winHint();
		}
	});
	/* 保存金额修改 */

};

// 摸态框弹出和隐藏
function modelShowOrHide(model,index) {
	model.hide();
	model.eq(index).show()
}

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

/* 关闭右侧方法 */
function retract(){
	$('.m_content').animate({left:'2000px'},800,function(){
		$('.mask').css('display','none');
		$('.addmod').remove();
		index = 1;
	});
	$('.saveCgMoney').attr('data_id',"");
	$('.saveCgMoney').attr("value","");
	$('.change_money > input').val('');
	
}
/* 关闭右侧方法 */

/* 分页方法 */

//获取总页数方法
function getPageAll(status){
	$("#pages").css("display","block");
	$.ajax({
		type: 'post',
		url: ctx+'/SettlementRatio/getPageCount',
		data:{
			num: 5,
			status: status
		},
		success: function(data){
			data = JSON.parse(data);
			if(data.data==0)$("#pages").css("display","none");
			else{
				/*分页*/
				pages(
					data.data,
					function (currentPage){
						getPageData(currentPage,getAjaxName());
					});
				}
			}
		});

}
//切换当前页
function pageNum(n){
	$('.num').removeClass('on').eq(n-1).addClass('on');
	numDisp(n-1);
	getPageData(n-1,getAjaxName());
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
		console.log(dang+1)
		getPageData(dang+1,getAjaxName());
	}else{
		var n = $('.num.on').text()-0;
		if(n==1){
			return false;
		}
		pageNum(n-1)
		console.log(n-1)
		getPageData(n-1,getAjaxName());
	}
}

/* 分页方法 */

/* 上传图片功能 */
function upImg(n,nn){
	/* 上传图片功能 */
	var canvas=document.createElement('canvas');
	var ctx=canvas.getContext('2d');
	var maxsize = 1024;
	var choose=document.getElementsByClassName('choose')[nn];
	var cha_img = document.getElementsByClassName('cha_img')[nn];
	console.log(cha_img)
	// choose. click();
	if (choose) {
		choose.onchange=function(){
			choose.blur();
			var file = choose.files[0];
			// alert(file);
			ImageFileResize(file, 1000, 1000, function (dataUrl) {
				choose.value='';
				if(n==undefined){
					var htmls = '<p class="imgBox" data-base="'+dataUrl+'" style="background: #fff url('+dataUrl+') no-repeat center;background-size: contain;">'+
						'<span>修改<input type="file" class="cha_img"></span><span class="del_img">删除</span>'+
						'</p>';
					$('.upLoad').eq(nn).before(htmls);

					$('.cha_img').unbind('click');
					$('.del_img').unbind('click');
					$('.cha_img').click(function(){
						var n = $('.cha_img').index(this);
						console.log(n);
						upImg(n,n);
					});
					$('.del_img').click(function(){
						var dn = $('.del_img').index(this);
						//upImg(n);
						$('.imgBox').eq(dn).remove();
						$('.upPic').each(function(){
							if($(this).find('.imgBox').length<2){
								$(this).find('.upLoad').css('display','inline-block');
							}
						});

					});
				}
				// console.log(dataUrl);
				// window.open(dataUrl)
				if($('.upPic:eq('+nn+') .imgBox').length==2){
					$('.upPic:eq('+nn+') .upLoad').css('display','none');
				}
			});
		};
	}

	// 修改图片
	if (cha_img) {
		cha_img.onchange=function(){
			cha_img.blur();
			var file = cha_img.files[0];
			// alert(file);
			ImageFileResize(file, 1000, 1000, function (dataUrl) {
				$('.imgBox').eq(n).css({'background':'#fff url('+dataUrl+') no-repeat center','background-size':'contain'});
			});
		}
	}

	function ImageFileResize(file, maxWidth, maxHeight, callback) {
		var Img = new Image;
		var canvas = document.createElement('canvas');
		var ctx = canvas.getContext('2d');
		Img.onload = function() {
			if (Img.width>maxWidth || Img.height>maxHeight) {
				var bili = Math.max(Img.width/maxWidth, Img.height/maxHeight);
				canvas.width = Img.width/bili;
				canvas.height = Img.height/bili;
			}else{
				canvas.width = Img.width;
				canvas.height = Img.height;
			}
			ctx.drawImage(Img, 0, 0, Img.width, Img.height, 0, 0, canvas.width, canvas.height);
			var imgDataUrl = canvas.toDataURL('image/jpeg');
			callback(imgDataUrl);
		};
		try{
			Img.src = window.URL.createObjectURL(file);
		}catch(err){
			try{
				Img.src = window.webkitURL.createObjectURL(file);
			}catch(err){
				//alert(err.message);
			}
		}
	}
	/* 上传图片功能 */
}
/* 上传图片功能 */

/* 返回当前应该请求的数据 */
function getAjaxName(){
	var b = $('.tab span.on').attr('data-if');
	var s = $('.ptab span.on').attr('data-if');
	return b+s;
}
/* 返回当前应该请求的数据 */

/* 获取列表数据并渲染 */
function getDataList(str){
	switch (str){
	case 'dlw':getPageAll(801);getPageData(1,'dlw');break;
	case 'dld':getPageAll(803);getPageData(1,'dld');break;
	case 'dly':getPageAll(805);getPageData(1,'dly');break;
	case 'dlb':getPageAll(806);getPageData(1,'dlb');break;
	}
}

/* 获取列表数据并渲染 */
function getPageData(n,str){
	var status = 801;
	switch (str){
	case 'dlw':status=801;break;
	case 'dld':status=803;break;
	case 'dly':status=805;break;
	case 'dlb':status=806;break;
	}
	$.ajax({
		type: 'post',
		url:ctx+'/SettlementRatio/getSettlement',
		data: {
			status: status,
			page: n
		},
		success: function(data){
			if(data=="loseSession"){
				 window.location.href=ctx+"/toLogin";
				 return;
			}	 
			data = JSON.parse(data);
			switch (getAjaxName()){
				case 'dlw':addAgNotData(data);break;
				case 'dld':addDaiZFData(data);break;
				case 'dly':addYiZFData(data);break;
				case 'dlb':addBeiSSData(data);break;
			}
		}
	});
}

/* 渲染数据方法 */
function addAgNotData(data){//代理商--未审核方法
	if(data.code==200){
		var htmls = '';
		for(var i=0;i<data.data.length;i++){
			htmls +='<tr data-id="'+data.data[i].acctID+'">'+
						'<td class="infoShow posi">'+
							'<p>代理商账号:'+data.data[i].userId+'</p>'+
							'<p>申请结算金额:'+parseFloat(data.data[i].accountPlatformIncome).toFixed2(2)+'</p>'+
							'<div class="userInfo">'+
								'<p>姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名： '+(data.data[i].realName==undefined?"未知":data.data[i].realName)+'</p>'+
								'<p>电&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;话： '+(data.data[i].userTel==undefined?"未知":data.data[i].userTel)+'</p>'+
								'<p>邮&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;箱： '+(data.data[i].userMail==undefined?"未知":data.data[i].userMail)+'</p>'+
								'<p>地&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;址： '+(data.data[i].userAddress==undefined?"未知":data.data[i].userAddress)+'</p>'+
								'<p>公司名称： '+(data.data[i].companyName==undefined?"未知":data.data[i].companyName)+'</p>'+
							'</div>'+
						'</td>'+
						'<td class="">'+
							'<p>结算周期:<span>'+data.data[i].startTime.replace(/\-/g,".")+"-"+data.data[i].endTime.replace(/\-/g,".")+'</span></p>'+
							'<p>收款账号:&nbsp;&nbsp; '+data.data[i].bankCard+'</p>'+
						'</td>'+
						'<td class="">'+
							'<p>线上缴费:'+parseFloat(data.data[i].accountPlatformIncome).toFixed2(2)+'</p>'+
							'<p>线下缴费:'+parseFloat(data.data[i].accountOfflineIncome).toFixed2(2)+'</p>'+
						'</td>'+
						'<td class="">'+
							'<p>用户退费:'+parseFloat(data.data[i].accountRefund).toFixed2(2)+'</p>'+
							'<p>技术支持费:'+parseFloat(data.data[i].chargeRate*data.data[i].accountIncome).toFixed2(2)+'</p>'+
						'</td>'+
						'<td class=" posi">'+
							'<p>应结算总金额:<span>'+parseFloat(data.data[i].accountBalanceAfter).toFixed2(2)+'</span> &nbsp;&nbsp;<img class="hand editBtn" src="'+imgPath+'/edit.png"/></p>'+
							'<p>状态:<span class="font-blue">待审核</span>&nbsp;&nbsp;&nbsp;&nbsp;<button class="blue-btn adoptBtn">通过</button> <button class="blue-btn blue-load">下载明细</button></p>'+

							'<div class="adoptModel">'+
								'<span>你确定该类容提供商账单</span><br/><span>已通过审核？</span>'+
								'<div class="btnBox"><button class="blue-btn adoptAssign">确定</button><button class="white-btn adoptCancel">取消</button></div>'+
							'</div>'+
						'</td>'+
					'</tr>';
		}
		$('.agency_notAudit tbody').html(htmls);

		/* 修改应结算总金额 */
		$('.editBtn').unbind('click');
		$('.editBtn').click(function(){
			var n = $('.editBtn').index(this);
			var accId=$('.agency_notAudit tbody tr').eq(n).attr("data-id");
			var beforMoney=$('.agency_notAudit tbody tr').eq(n).find("td").eq(4).find("p").eq(0).find("span").text();
			$('.mask').css('display','block');
			$('#edit-money').animate({left:'20%'},800);
			$(".saveCgMoney").attr("value",beforMoney);
			$(".saveCgMoney").attr("data_id",accId);
			supern=n;
		});
		/* 修改应结算总金额 */

		/* 通过审核按钮 */
		$('.adoptBtn').unbind('click');
		$('.adoptCancel').unbind('click');
		// 未审核-通过按钮
		$('.adoptBtn').click(function () {
			var index = $('.adoptBtn').index(this);
			$('.adoptModel').css('display','none').eq(index).css('display','block');
		});

		// 未审核-取消按钮
		$('.adoptCancel').click(function () {
			var index = $('.adoptCancel').index(this);
			$('.adoptModel').eq(index).hide();
		});

		/* 通过审核按钮 */

		// 却定通过审核
		$('.adoptAssign').click(function () {
			var index = $('.adoptAssign').index(this);
			var accId=$(".agency_notAudit tbody tr").eq(index).attr("data-id");
			var dt = {
				status:801,
				acctoudID:accId
			}
			var url=ctx+'/SettlementRatio/saveOrderStatus';
			pass(url,dt);
		});
		/*下载明细*/
		$(".agency_notAudit .blue-load").unbind("click")
		$('.agency_notAudit .blue-load').click(function(){
			var index=$(".agency_notAudit .blue-load").index(this);
			var username=$(".agency_notAudit tbody tr").eq(index).find("td").eq(0).find("p").eq(0).text().replace(/[^0-9]+/g, '').trim();
			var times=$(".agency_notAudit tbody tr").eq(index).find("td").eq(1).find("p").eq(0).find("span").text();
			downLoad(username,times);
		});
		
	}
}

function addDaiZFData(data){//代理商--待支付
	if(data.code==200){
		var htmls = '';
		for(var i=0;i<data.data.length;i++){
			htmls +='<tr data-id="'+data.data[i].acctID+'">'+
						'<td class="infoShow posi">'+
							'<p>代理商账号:'+data.data[i].userId+'</p>'+
							'<p>申请结算金额(元):'+parseFloat(data.data[i].accountPlatformIncome).toFixed2(2)+'</p>'+
							'<div class="userInfo">'+
								'<p>姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名： '+(data.data[i].realName==undefined?"未知":data.data[i].realName)+'</p>'+
								'<p>电&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;话： '+(data.data[i].userTel==undefined?"未知":data.data[i].userTel)+'</p>'+
								'<p>邮&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;箱： '+(data.data[i].userMail==undefined?"未知":data.data[i].userMail)+'</p>'+
								'<p>地&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;址： '+(data.data[i].userAddress==undefined?"未知":data.data[i].userAddress)+'</p>'+
								'<p>公司名称： '+(data.data[i].companyName==undefined?"未知":data.data[i].companyName)+'</p>'+
							'</div>'+
						'</td>'+
						'<td class="">'+
							'<p>结算周期:<span>'+data.data[i].startTime.replace(/\-/g,".")+"-"+data.data[i].endTime.replace(/\-/g,".")+'</span></p>'+
							'<p>收款账号:&nbsp;&nbsp;'+data.data[i].bankCard+'</p>'+
						'</td>'+
						'<td class="">'+
							'<p>线上缴费:'+parseFloat(data.data[i].accountPlatformIncome).toFixed2(2)+'</p>'+
							'<p>线下缴费:'+parseFloat(data.data[i].accountOfflineIncome).toFixed2(2)+'</p>'+
						'</td>'+
						'<td class="">'+
							'<p>用户退费:'+parseFloat(data.data[i].accountRefund).toFixed2(2)+'</p>'+
							'<p>技术支持费:'+parseFloat(data.data[i].chargeRate*data.data[i].accountIncome).toFixed2(2)+'</p>'+
						'</td>'+
						'<td class="posi">'+
								'<p>应结算总金额:<span>'+parseFloat(data.data[i].accountBalanceAfter).toFixed2(2)+'</span>&nbsp;&nbsp;<img class="hand detailsBtn" src="'+imgPath+'/ts.png"/></p>'+
							'<p>状态:<span class="font-blue">待支付</span>&nbsp;&nbsp;&nbsp;&nbsp;<button class="blue-btn payVoucher">提交支付凭证</button>&nbsp;&nbsp;&nbsp;&nbsp;<button class="blue-btn blue-load">下载明细</button></p>'+
							'<div class="payMethod"><div><label class="font-blue">支付方式&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label> <input class="payText payType" type="text"/></div>'+
							'<div><label class="font-blue">支付流水账号&nbsp;</label><input class="payText payNum" type="text"/></div>'+
							'<div class="payBtn"><button class="blue-btn conPay">确认支付</button><button class="white-btn payCancel">取消</button></div></div>'+
						'</td>'+
					'</tr>';
		}
		$('.agency_notPay tbody').html(htmls);

		/* 调价详情 */
		$('.detailsBtn').unbind('click');
		$('.detailsBtn').click(function(){
			var n = $('.detailsBtn').index(this);
			var accId=$('.agency_notPay tbody tr').eq(n).attr("data-id");
			getChangeMoney(accId);
			$('.mask').show();
			$('#payDetails').animate({left:'20%'}, 800);
		});
		/* 修改应结算总金额 */

		/* 提交支付凭证按钮 */
		// 提价支付凭证按钮
		$('.payVoucher').unbind("click")
		$('.payVoucher').click(function () {
			var index = $('.payVoucher').index(this);
			$('.payMethod').css('display','none').eq(index).css('display','block');
		});

		// 提价支付凭证弹窗取消按钮
		$('.payCancel').unbind("click")
		$('.payCancel').click(function () {
			var index = $('.payCancel').index(this);
			$('.payMethod').eq(index).hide();
		});
		/* 提交支付凭证按钮 */

		// 确认支付
		$('.conPay').unbind("click")
		$('.conPay').click(function () {
			var index = $('.conPay').index(this);
			var payType = $('.payType').eq(index).val();
			var payNum = $('.payNum').eq(index).val();
			var accId=$(".agency_notPay tr").eq(index).attr("data-id");
			var dt1 = {
				account_id: accId,
				paytype: payType,
				account_from:payNum
			};
			var url= ctx+'/SettlementRatio/saveOrderEvidence';
			pass(url,dt1);
		});
		/*下载明细*/
		$(".agency_notPay .blue-load").unbind("click")
		$('.agency_notPay .blue-load').click(function(){
			var index=$(".agency_notPay .blue-load").index(this);
			var username=$(".agency_notPay tbody tr").eq(index).find("td").eq(0).find("p").eq(0).text().replace(/[^0-9]+/g, '').trim();
			var times=$(".agency_notPay tbody tr").eq(index).find("td").eq(1).find("p").eq(0).find("span").text();
			downLoad(username,times);
		});
	}
}

function addYiZFData(data){//代理商--已支付
	if(data.code==200){
		var htmls = '';
		for(var i=0;i<data.data.length;i++){
			htmls +='<tr data-id="'+data.data[i].acctID+'">'+
						'<td class="infoShow posi">'+
							'<p>代理商账号:'+data.data[i].userId+'</p>'+
							'<p>申请结算金额(元):'+parseFloat(data.data[i].accountPlatformIncome).toFixed2(2)+'</p>'+
							'<div class="userInfo">'+
								'<p>姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名： '+(data.data[i].realName==undefined?"未知":data.data[i].realName)+'</p>'+
								'<p>电&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;话： '+(data.data[i].userTel==undefined?"未知":data.data[i].userTel)+'</p>'+
								'<p>邮&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;箱： '+(data.data[i].userMail==undefined?"未知":data.data[i].userMail)+'</p>'+
								'<p>地&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;址： '+(data.data[i].userAddress==undefined?"未知":data.data[i].userAddress)+'</p>'+
								'<p>公司名称： '+(data.data[i].companyName==undefined?"未知":data.data[i].companyName)+'</p>'+
							'</div>'+
						'</td>'+
						'<td class="">'+
							'<p>结算周期:<span>'+data.data[i].startTime.replace(/\-/g,".")+"-"+data.data[i].endTime.replace(/\-/g,".")+'</span></p>'+
							'<p>收款账号:&nbsp;&nbsp;'+data.data[i].bankCard+'</p>'+
						'</td>'+
						'<td class="">'+
							'<p>线上缴费:'+parseFloat(data.data[i].accountPlatformIncome).toFixed2(2)+'</p>'+
							'<p>线下缴费:'+parseFloat(data.data[i].accountOfflineIncome).toFixed2(2)+'</p>'+
						'</td>'+
						'<td class="">'+
							'<p>用户退费:'+parseFloat(data.data[i].accountRefund).toFixed2(2)+'</p>'+
							'<p>技术支持费:'+parseFloat(data.data[i].chargeRate*data.data[i].accountIncome).toFixed2(2)+'</p>'+
						'</td>'+
						'<td class="posi">'+
							'<p>应结算总金额:<span>'+parseFloat(data.data[i].accountBalanceAfter).toFixed2(2)+'</span>&nbsp;&nbsp;<img class="hand yzfDetails" src="'+imgPath+'/ts.png"/></p>'+
							'<p>状态:<span class="font-blue serial">'+data.data[i].accountStatus+'</span>&nbsp;&nbsp;&nbsp;&nbsp;<button class="blue-btn blue-load">下载明细</button></p>'+

							'<div class="serialNum">支付流水号账号 : '+data.data[i].flowId+'</div>'+
						'</td>'+
						'</tr>';
		}
		$('.agency_endPay tbody').html(htmls);
		/*下载明细*/
		$(".agency_endPay .blue-load").unbind("click");
		$('.agency_endPay .blue-load').click(function(){
			var index=$(".agency_endPay .blue-load").index(this);
			var username=$(".agency_endPay tbody tr").eq(index).find("td").eq(0).find("p").eq(0).text().replace(/[^0-9]+/g, '').trim();
			var times=$(".agency_endPay tbody tr").eq(index).find("td").eq(1).find("p").eq(0).find("span").text();
			downLoad(username,times);
		});
		/* 调价详情 */
		$('.yzfDetails').unbind('click');
		$('.yzfDetails').click(function(){
			var n = $('.yzfDetails').index(this);
			var accId=$('.agency_endPay tbody tr').eq(n).attr("data-id");
			getChangeMoney(accId);
			$('.mask').show();
			$('#payDetails').animate({left:'20%'}, 800);
		});
		
		// 流水账号
		$('.serial').hover(function () {
			var i = $('.serial').index(this);
			$('.serialNum').eq(i).show();
		},function () {
			var i = $('.serial').index(this);
			$('.serialNum').eq(i).hide();
		});
	}
}

function addBeiSSData(data){//代理商--被申诉
	if(data.code==200){
		var htmls = '';
		for(var i=0;i<data.data.length;i++){
			htmls +='<tr data-id="'+data.data[i].acctID+'">'+
						'<td class="infoShow posi">'+
							'<p>代理商账号:'+data.data[i].userId+'</p>'+
							'<p>申请结算金额(元):'+parseFloat(data.data[i].accountPlatformIncome).toFixed2(2)+'</p>'+
							'<div class="userInfo">'+
								'<p>姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名： '+(data.data[i].realName==undefined?"未知":data.data[i].realName)+'</p>'+
								'<p>电&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;话： '+(data.data[i].userTel==undefined?"未知":data.data[i].userTel)+'</p>'+
								'<p>邮&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;箱： '+(data.data[i].userMail==undefined?"未知":data.data[i].userMail)+'</p>'+
								'<p>地&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;址： '+(data.data[i].userAddress==undefined?"未知":data.data[i].userAddress)+'</p>'+
								'<p>公司名称： '+(data.data[i].companyName==undefined?"未知":data.data[i].companyName)+'</p>'+
							'</div>'+
						'</td>'+
						'<td class="">'+
							'<p>结算周期:<span>'+data.data[i].startTime.replace(/\-/g,".")+"-"+data.data[i].endTime.replace(/\-/g,".")+'</span></p>'+
							'<p>收款账号:&nbsp;&nbsp;'+data.data[i].bankCard+'</p>'+
						'</td>'+
						'<td class="">'+
							'<p>线上缴费:'+parseFloat(data.data[i].accountPlatformIncome).toFixed2(2)+'</p>'+
							'<p>线下缴费:'+parseFloat(data.data[i].accountOfflineIncome).toFixed2(2)+'</p>'+
						'</td>'+
						'<td class="">'+
							'<p>用户退费:'+parseFloat(data.data[i].accountRefund).toFixed2(2)+'</p>'+
							'<p>技术支持费:'+parseFloat(data.data[i].chargeRate*data.data[i].accountIncome).toFixed2(2)+'</p>'+
						'</td>'+
						'<td class=" posi">'+
							'<p>应结算总金额:<span>'+parseFloat(data.data[i].accountBalanceAfter).toFixed2(2)+'</span>&nbsp;&nbsp;<img class="hand complainEditBtn" src="'+imgPath+'/edit.png"/></p>'+
							'<p>状态:<span class="font-blue">被申诉</span>&nbsp;<img class="complain" src="'+imgPath+'/ts.png"/>&nbsp;&nbsp;&nbsp; <button class="blue-btn complainMBtn">通过</button> <button class="blue-btn blue-load">下载明细</button></p>'+
							'<div class="complainModel"><p class="font-blue">申诉原因</p><span>'+(data.data[i].applean==undefined?'无':data.data[i].applean)+'</span></div>'+
							'<div class="complainM"><p class="font-blue">你确定通过该申诉的款项？</p><div class="btnBox"><button class="blue-btn SSCon">确认</button><button class="white-btn complainCancel">取消</button></div></div>'+
						'</div>'+
						'</td>'+
					'</tr>';
		}
		$('.by_appeal tbody').html(htmls);

		/* 修改应结算总金额 */
		$('.complainEditBtn').unbind('click');
		$('.complainEditBtn').click(function(){
			var n = $('.complainEditBtn').index(this);
			var accId = $(".by_appeal tbody tr").eq(n).attr("data-id");
			var beforMoney=$('.by_appeal tbody tr').eq(n).find("td").eq(4).find("p").eq(0).find("span").text();
			$('.mask').css('display','block');
			$('#edit-money').animate({left:'20%'},800);
			$(".saveCgMoney").attr("value",beforMoney);
			$(".saveCgMoney").attr("data_id",accId);
			supern=n;
		});
		/* 修改应结算总金额 */

		// 通过按钮
		$('.complainMBtn').click(function () {
			var index = $('.complainMBtn').index(this);
			var model = $('.complainM');
			modelShowOrHide(model,index)
		});

		// 取消按钮
		$('.complainCancel').click(function () {
			var index = $('.complainCancel').index(this);
			$('.complainM').eq(index).hide()

		});
		$(".SSCon").unbind("click");
		$(".SSCon").click(function(){
			var index = $('.SSCon').index(this);
			var accId=$(".by_appeal tbody tr").eq(index).attr("data-id");
			var dt = {
				status:806,
				acctoudID:accId
			}
			var url=ctx+'/SettlementRatio/saveOrderStatus';
			pass(url,dt);
			
		});
		
		/*下载明细*/
		$(".by_appeal .blue-load").unbind("click")
		$('.by_appeal .blue-load').click(function(){
			var index=$(".by_appeal .blue-load").index(this);
			var username=$(".by_appeal tbody tr").eq(index).find("td").eq(0).find("p").eq(0).text().replace(/[^0-9]+/g, '').trim();
			var times=$(".by_appeal tbody tr").eq(index).find("td").eq(1).find("p").eq(0).find("span").text();
			downLoad(username,times);
		});
		
		$('.complain').hover(function () {
			var i = $('.complain').index(this);
			$('.complainModel').eq(i).show();
		},function () {
			var i = $('.complain').index(this);
			$('.complainModel').eq(i).hide();
		});
		
	}
}
/* 渲染数据方法 */

// 通过ajax
function pass(url,data) {
	$.ajax({
		type: 'post',
		url :url,
		data: data,
		success: function(data){
			eval("data="+data);
			if(data.data==true){
				getDataList(getAjaxName());
				$('.payMethod').css('display','none');
				$('.adoptModel').css('display','none');
			}else{
				$(".win>span").html("网络繁忙请稍后重试");
				winHint();
			}
		}
		
	})
}


/* 修改截取小数后两位原型方法 */
Number.prototype.toFixed2=function (){
	return parseFloat(this.toString().replace(/(\.\d{2})\d+$/,"$1"));
}
/* 修改截取小数后两位原型方法 */


/* 获取修改金额已有资费 */
function getMoneInfo(userId){
	var acctid=
	$.ajax({
		type: 'post',
		 url : ctx+'/SettlementRatio/getOrderEvidence', 
		data: {
			account_id: acctid
		},
		success: function(data){
			// data = JSON.parse(data);
			if(data.code==200){
				var htmls = '';
				for(var i=0;i<data.data.length;i++){
					console.log(data);
					var types = '';
					for (var v = 0, TPlen = data.data[i].types.length; v<TPlen; v++ ) {
						types += '<li>'+data.data[i].types[v]+'</li>';
					}

					var iconNum = data.data[i].icon.length;
					var icons;
					if (iconNum === 0) {
						icons = '' +
							'<p class="upLoad tip">'+
							'<span class="round">+</span>'+
							'<span class="upText">上传图片</span>'+
							'<input type="file" class="tip choose" accept="image/*" multiple>'+
							'</p>'
					} else if (iconNum === 1) {
						icons = '<p class="imgBox" data-base="'+data.data[i].icon[0]+'" style="background: #fff url('+data.data[i].icon[0]+') no-repeat center;background-size: contain;">'+
						'<span>修改<input type="file" class="cha_img"></span><span class="del_img">删除</span>'+
						'</p>' +
							'<p class="upLoad tip">'+
							'<span class="round">+</span>'+
							'<span class="upText">上传图片</span>'+
							'<input type="file" class="tip choose" accept="image/*" multiple>'+
							'</p>';
					} else if (iconNum ===2) {
						icons = '<p class="imgBox" data-base="'+data.data[i].icon[0]+'" style="background: #fff url('+data.data[i].icon[0]+') no-repeat center;background-size: contain;">'+
							'<span>修改<input type="file" class="cha_img"></span><span class="del_img">删除</span>'+
							'</p>' +
							'<p class="imgBox" data-base="'+data.data[i].icon[1]+'" style="background: #fff url('+data.data[i].icon[1]+') no-repeat center;background-size: contain;">'+
							'<span>修改<input type="file" class="cha_img"></span><span class="del_img">删除</span>'+
							'</p>' +

							'<p class="upLoad tip">'+
							'<span class="round">+</span>'+
							'<span class="upText">上传图片</span>'+
							'<input type="file" class="tip choose" accept="image/*" multiple>'+
							'</p>';
					}
					htmls += '<div class="mod1 addmod">'+
									'<p>新增资费'+index+'</p>'+
									'<div>'+
										'<div class="costType">费用类型：<span class="seleType tip">'+data.data[i].type+'</span>'+
											'<ul>'+
												types+
											'</ul>'+
										'</div>'+

											'<div class="upPic">'+
											'<span>上传图片附件</span>'+
											icons+
											'</div>'+
										'<p class="bz_text"><span>备注：</span><textarea placeholder="费用类型（可不填）">'+data.data[i].note+'</textarea></p>'+
									'</div>'+
								'</div>';

					index++;

				}
				$('.btns').before(htmls);

				var picLen = $('.upPic').length;
				for (var p = 0; p < picLen; p++) {
					if($('.upPic:eq('+p+') .imgBox').length==2){
						$('.upPic:eq('+p+') .upLoad').css('display','none');
					}
				}



				$('.seleType').unbind('click');
				$('.seleType').click(function(){
					var nn = $('.seleType').index(this);
					$('.costType > ul').eq(nn).css('display','block');
					return false;
				});
				$('.costType > ul > li').unbind('click');
				$('.costType > ul > li').click(function(){
					var nnd = $('.costType > ul > li').index(this);
					console.log(nnd);
					var str = $('.costType > ul > li').eq(nnd).text();
					console.log(str);
					$('.costType > ul > li').eq(nnd).parent().prev().text(str);
					$('.costType > ul').css('display','none');
				});
				$('.costType > ul').unbind('click');
				$('.costType > ul').click(function(){
					return false;
				});
				/* 选择费用类型 */
				/* 上传图片按钮 */
				$('.choose').unbind('click');
				$('.choose').click(function(){
					var n = $('.choose').index(this);
					upImg(undefined,n);
				});
				/* 上传图片按钮 */

				$('.cha_img').click(function(){
					var n = $('.cha_img').index(this);
					console.log(n)
					upImg(n,n);
				});

				$('.del_img').click(function(){
					var dn = $('.del_img').index(this);
					//upImg(n);
					$('.imgBox').eq(dn).remove();
					$('.upPic').each(function(){
						if($(this).find('.imgBox').length<2){
							$(this).find('.upLoad').css('display','inline-block');
						}
					});

				});
			}
		}
	});
}
/* 获取修改金额已有资费 */

/* 获取调价详情信息 */
function getChangeMoney(accId){
	var htmls = '';
	$.ajax({
		type: 'post',
		 url : ctx+'/SettlementRatio/getOrderEvidence', 
		data: {
			account_id: accId
		},
		success: function(data){
			data = JSON.parse(data);
			if(data.code==200){
				var htmlstring = "";
        		for(var k=0;k<data.data.length;k++){
        		htmlstring +='<p class="change_money">改前金额：<span class="change_money_after">'+data.data[k].before_money+'</span>元';
        		htmlstring +='	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
        		htmlstring +='&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;改后金额：';
        		htmlstring +='<span class="change_money_former">'+data.data[k].after_money+'</span>元</p>';
        		for(var i=0;i<data.data[k].list.length;i++){
        			var maps = data.data[k].list[i];
        			var fileurls = maps.reason_fileurl.split(';');
        			htmlstring+='<div class="mod1"><p>新增资费'+(i+1)+'</p><div><p class="costType">费用类型：';
        			htmlstring+='<span>'+maps.reason_type+'</span></p><div class="pics">';
        			for(var kk=0;kk<fileurls.length;kk++){
        				htmlstring+='<div class="imgdiv"><img src="http://183.240.147.102:8082/cloud/'+fileurls[kk]+'"></div>';
        			}
        			htmlstring+='</div><p><span>备注：'+maps.reason_content+'</span></p></div></div>';
        		}}
				$('#content_m').html(htmlstring);
			}
		}
	});
}
/* 获取调价详情信息 */

/* 修改调价详情 */
function setChangeInfo(){
	var cgData = [];
	for(var i=0;i<$('.addmod').length;i++){
		var moneyType = $('.seleType').eq(i).text();
		var imgBase1 = $('.addmod').find('.imgBox').eq(0).attr('data-base');
		var imgBase2 = $('.addmod').find('.imgBox').eq(1).attr('data-base');
		var remark = $('.bz_text textarea').val();
		if(remark==''&&imgBase1==''&&imgBase2=='') return;
		imgBase1=imgBase1==undefined?"":imgBase1;
		imgBase2=imgBase2==undefined?"":imgBase2;
		cgData.push('{'+
				'"moneyType":"'+moneyType+'",'+
				'"imgBase1":"'+imgBase1+'",'+
				'"imgBase2":"'+imgBase2+'",'+
				'"remark":"'+remark+
			'"}');
	}
	var data =  '['+cgData+']';
	var money= $('.change_money > input').val();
	$.ajax({
		type: 'post',
		url: ctx+'/SettlementRatio/saveTotalAmount',
		data: {
			data: data,
			acctId: $('.saveCgMoney').attr('data_id'),
			money:money,
			bfMoney:  $('.saveCgMoney').attr("value")
		},
		success: function(data){
			data = JSON.parse(data);
			if(data.code==200){
				switch (getAjaxName()){
					case 'dlw':
						$('.agency_notAudit tbody tr').eq(supern).find("td").eq(4).find("p").eq(0).find("span").text(money);break;
					case 'dlb':
						$('.by_appeal tbody tr').eq(supern).find("td").eq(4).find("p").eq(0).find("span").text(money);break;
				};
				retract();
				$('.addmod').remove();
			}
		}
	});
}

/*获取场所收费配置*/
function initMone(){
	$.ajax({
		type:'post',  
	    url : ctx+'/SettlementRatio/getCommonMoney',  
	    success  : function(data) {
	    	if(data=="loseSession"){
				 window.location.href=ctx+"/toLogin";
				 return;
			}	 
	    	data = JSON.parse(data);
	        $('.configMoney').text(data.data[0].commonminmoney);
	        $('.configDay').text(data.data[0].commonbalanceday);
	    }
	});
}
function updateInitMone(){
	var money=$(".startMoney").val();
	var period=$(".period").val();
	$.ajax({
		type:'post',  
        url : ctx+'/SettlementRatio/saveCommonMoney', 
        data:{
        	money:money,
        	timeday:period
        },
        success  : function(data) {
        	if(data=="loseSession"){
				 window.location.href=ctx+"/toLogin";
				 return;
			}	 
        	data = JSON.parse(data);
        	if(data.data==true){
        		$('.MDinp input').val('');
    			$('.MDinp').css('display','none');
    			$(".configMoney").text(money);
    			$(".configDay").text(period);
        	}else{
        		$(".win>span").html("网络繁忙请稍后重试");
    			winHint();
        	}
        }
	});
}

/*下载明细*/
function downLoad(uname,strs){
	console.log(strs);
	var startTime=strs.split("-")[0].replace(/\./g,"-");
	var endTime=strs.split("-")[1].replace(/\./g,"-");
	console.log(startTime)
	console.log(endTime)
	window.location.href=ctx+"/SettlementRatio/importExcle?userName="+uname+"&startTime="+startTime+"&endTime="+endTime;
	
}
