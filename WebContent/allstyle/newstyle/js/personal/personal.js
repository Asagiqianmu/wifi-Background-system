
var reg = /^(((13[0-9]{1})|(14[4-7]{1})|(15[0-9]{1})|(170)|(17[1-8]{1})|(18[0-9]{1}))+\d{8})$/;// 手机号码
var verify = false;
window.onload=function(){
	
	getUserInfo();
	
	//-----------------验证码------------------------//
    $('#mpanel').pointsVerify({
    	defaultNum : 4,	//默认的文字数量
    	checkNum : 2,	//校对的文字数量
    	vSpace : 5,	//间隔
    	imgName : ['../../allstyle/newstyle/img/1.jpg', '../../allstyle/newstyle/img/2.jpg'],
    	imgSize : {
        	width: '255px',
        	height: '150px',
        },
        barSize : {
        	width : '255px',
        	height : '40px',
        },
        ready : function() {
    	},
        success : function() {
        	$("#errorCode").html(" ");
        	verify = true;
        	//......后续操作
        },
        error : function() {
        	$("#errorCode").html("抱歉,验证失败！");
        }
        
    });
	
	$("#givename").blur(function(){
		  var name = $("#givename").val();
		  if(/[^\u4E00-\u9FA5]/g.test(name)){
			  msg('只能输入中文名',false);
			  return false;
		  }
		/*  var ename = name.replace(/[^\u4E00-\u9FA5]/g,'');
		  $("#givename").val(ename);*/
	});
/*	$("#zhifuname").blur(function(){
		  var name = $("#zhifuname").val();
		  if(/[^\u4E00-\u9FA5]/g.test(name)){
			  msg('只能输入中文名',false);
			  return false;
		  }
		  var ename = name.replace(/[^\u4E00-\u9FA5]/g,'');
		  $("#givename").val(ename);
	});*/
	/* 事件绑定 */
	// 退出按钮
	$('.menu > li.exit').click(function(){
		window.location.href=ctx+"/logOut";
	});
	$('.menu > li.personageCenter').click(function(){
		window.location.href=ctx+"/personalCenter/toPersonalCenter";
	});
	
	$('.dhqx_btn').click(function(){// 对话框取消事件
		$('.mask').css('display','none');
		$('.dhk').css('display','none');
	});

	$('.photo_list > li').click(function(){//选择头像
		var n = $(this).index();
		$('.photo_list > li .pd_xd').each(function(){
			$(this).attr('src','/cloud/allstyle/newstyle/img/sfalse.png');
		});
		$('.photo_list > li .pd_xd').eq(n).attr('src','/cloud/allstyle/newstyle/img/strue.png');
		$('.photo_list > li').removeClass('on').eq(n).addClass('on');
	});

	$('.edit_info_btn').click(function(){//编辑个人资料
		$('.mask').css('display','block');
		$('.edit_info').css('display','block').animate({'right':'0px'});
		var pic = parseInt($('.photo img').attr('src').split('_')[1].substring(1,2));
		$('.photo_list > li .pd_xd').each(function(){
			$(this).attr('src','/cloud/allstyle/newstyle/img/sfalse.png');
		});
		$('.photo_list > li .pd_xd').eq(pic-1).attr('src','/cloud/allstyle/newstyle/img/strue.png');
		$('.photo_list > li').removeClass('on').eq(pic-1).addClass('on');

		$('#cg_name').val($('.name span').text());
		$('#cg_com').val($('.com span').text());
		$('#cg_tel').val($('.tel span').text());
		$('#cg_email').val($('.email span').text());
		$('#cg_ads').val($('.ads span').text());
	});

	$('#cardnum').blur(function(){
		var str=$(this).val();
		getBankName(str);
	});
	
	$('.bc_edit').click(function(){// 保存编辑个人资料
		var photo = $('.photo_list > li.on .pt_img').attr('src');
		var imgpath = $('.photo_list > li.on').attr("imgadd");
		var name = $('#cg_name').val();
		var com = $('#cg_com').val();
		var tel = $('#cg_tel').val();
		var email = $('#cg_email').val();
		var ads = $('#cg_ads').val();
		if(name==""||name==undefined){
			msg("请输入用户名",false);
			return;
		}
		if(tel==""||tel==undefined){
			msg("请输入联系手机号",false);
			return;
		}
		if(!/^(((13[0-9]{1})|(14[4-7]{1})|(15[0-9]{1})|(170)|(17[1-8]{1})|(18[0-9]{1}))+\d{8})$/.test(tel)){
			msg("手机号格式错误",false);
			return;
		}
		$.ajax({
			type: 'post',
			url: ctx+'/personalCenter/updateUserInfo',
			data: {
				username:name,
				company:com,
				telephone:tel,
				email:email,
				address:ads,
				imgpath:imgpath
			},
			success: function(data){
				data = JSON.parse(data);
				if(data.code==200){
					msg('保存成功',true);
					$('.edit_info').animate({'right':'-525px'},function(){
						$('.photo img').attr('src',photo);
						$('.name span').text(name);
						$('.com span').text(com);
						$('.tel span').text(tel);
						$('.email span').text(email);
						$('.ads span').text(ads);
						$('.mask').css('display','none');
						$(this).css('display','none');
					});
				}
			},
			error:function(){
				msg('保存失败',false);
			}
		});
	});

	$('.ed_close').click(function(){//取消编辑
		$('.edit_info').animate({'right':'-525px'},function(){
			$('.mask').css('display','none');
			$(this).css('display','none');
		});
	});

	$('.qx_edit').click(function(){//取消编辑
		$('.edit_info').animate({'right':'-525px'},function(){
			$('.mask').css('display','none');
			$(this).css('display','none');
		});
	});

	//添加收款账号
	$('.add_card').click(function(){
		$('.add_ask_for input').val('');
		$('.mask').css('display','block');
		$('.add_ask_for').css('display','block');
	});

	//  支付宝银行卡切换
	$('.tx_type i').click(function(){
		var n = $('.tx_type i').index(this);
		$('.tx_type i').removeClass('on').eq(n).addClass('on');
		if(n!=0){
			$('.yh').css('display','none');
			$('.zf').css('display','block');
		}else{
			$('.yh').css('display','block');
			$('.zf').css('display','none');
		}
	    $('.yh input').eq(0).val("");// 用户名
        $('.yh input').eq(1).val("");// 卡号
	    $('.yh input').eq(2).val("");// 开户银行
		$('.yh input').eq(3).val("");// 支行名称
        $('.zf input').eq(0).val("");// 用户名
		$('.zf input').eq(1).val("");
	});

	// 取消添加银行卡
	$('.qx_add').click(function(){
		$('.mask').css('display','none');
		$('.add_ask_for').css('display','none');
	});

	// 确定添加银行卡
	$('.qr_add').unbind("click")
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
		if(usName!=''&&usCard!=''&&uskhAds!=''&&uszhName!=''){
			var emailregext = /[a-zA-Z0-9]{1,10}@[a-zA-Z0-9]{1,5}\.[a-zA-Z0-9]{1,5}/;
			var telregext =  /^(((13[0-9]{1})|(14[4-7]{1})|(15[0-9]{1})|(170)|(17[1-8]{1})|(18[0-9]{1}))+\d{8})$/;
			if(state==1){
				
				/* if(/[^\u4E00-\u9FA5]/g.test(usName)){
					  msg('只能输入中文名',false);
					  return false;
				  }*/
				
				if(emailregext.test(usCard)||telregext.test(usCard)){
				}else{
					msg('支付宝格式不正确',false);
					return false;
				}
			}else{
				if(/[^\u4E00-\u9FA5]/g.test(usName)){
					  msg('只能输入中文名',false);
					  return false;
			    }
				
				 if(!luhmCheck(usCard)){
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
						getUserInfo();
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
		}else{
			msg('请完善信息',false);
		}
	});

	//密码强度检测
	$('#fpass').keyup(function(){
		var strongRegex = new RegExp("^(?=.{6,20})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])", "g"); 
		var mediumRegex = new RegExp("^(?=.{6,20})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9])))", "g"); 
		var enoughRegex = new RegExp("^(?=.{6,20})((?=.*[A-Z])|(?=.*[a-z])|(?=.*[0-9]))", "g"); 
	
		if (strongRegex.test($(this).val())) { 
			$('.vd_pass').removeClass('ruo'); 
			$('.vd_pass').removeClass('zhong'); 
			$('.vd_pass').removeClass('qiang');
			$('.vd_pass').addClass('qiang');
			 //密码为6位及以上并且字母数字特殊字符三项都包括,强度最强 
			  
		} 
		else if (mediumRegex.test($(this).val())) {
			$('.vd_pass').removeClass('ruo'); 
			$('.vd_pass').removeClass('zhong'); 
			$('.vd_pass').removeClass('qiang');
			$('.vd_pass').addClass('zhong');
			//密码为6位及以上并且字母、数字、特殊字符三项中有两项，强度是中等
			
		}
		else if (enoughRegex.test($(this).val())) { 
			$('.vd_pass').removeClass('ruo'); 
			$('.vd_pass').removeClass('zhong'); 
			$('.vd_pass').removeClass('qiang');
			$('.vd_pass').addClass('ruo');
			  //如果密码为6为及以下，就算字母、数字、特殊字符三项都包括，强度也是弱的 
		} 
		else { 
			$('.vd_pass').removeClass('ruo'); 
			$('.vd_pass').removeClass('zhong'); 
			$('.vd_pass').removeClass('qiang');
			 //密码小于六位的时候，密码强度图片都为灰色
		} 
	
	});

	$('.edit_pas').click(function(){ //修改密码显示
		$('.cg_pass input').val('');
		$('.mask').css('display','block');
		$('.cg_pass').css('display','block');
	});

	$('.qx_cg').click(function(){ //取消修改密码
		$('.mask').css('display','none');
		$('.cg_pass').css('display','none');
	});

	$('.cg_add').click(function(){ //确定修改密码
		var pas1 = $('#fpass').val();
		var pas2 = $('#spass').val();
		var username = $('.userName').attr("usename");
		if(pas1!=''&&pas2!=''){
			if(pas1.length>=6&&pas2.length>=6){
				if(pas1==pas2){
					$.ajax({
						type: 'post',
						url: ctx+'/personalCenter/updatePassWord',
						data:{
							userName:username,
							passWord:pas1
						},
						success: function(data){
							data = JSON.parse(data);
							if(data.code==200){
								msg('密码修改成功',true);
								$('.mask').css('display','none');
								$('.cg_pass').css('display','none');
							}
						}
					});
				}else{
					msg('两次密码不一致',false);
				}
			}else{
				msg('密码长度不正确',false);
			}
		}else{
			msg('请完善信息',false);
		}
	});

	//修改提现手机号 按钮
	$('.edit_txp').click(function(){
		$('.cg_tx_phone input').val('');
		$('.mask').css('display','block');
		$('.cg_tx_phone').css('display','block');
		var username = $('.txPhone').attr("data-phone");
		$("#jphone").val(username);
		/*initHua('register','#dom_id');*/
	});

	//获取验证码按钮
	$('.get_code').click(function(){
		var ophone = $('#jphone').val();
		if(verify){
		if(ophone==$('.txPhone').attr('data-phone')){
			var nphone = $('#nphone').val();
			if(nphone!=''){
				if( /^(((13[0-9]{1})|(14[4-7]{1})|(15[0-9]{1})|(170)|(17[1-8]{1})|(18[0-9]{1}))+\d{8})$/.test(nphone)){
					if(ophone==nphone){
						msg('新手机与旧手机号一致',false);
						return ;
					}else{
						sendtixiancode(ophone);
					}
				}else{
					msg('请输入正确的手机号',false);
		            return;
				}
			}else{
				msg('请输入手机号',false);
				return;
			}
		}else{
			msg('旧的手机号码不正确',false);
			return;
		}
		}else{
			msg('请点击验证码进行验证',false);
			return;
		}
	});

	$('.pqx_cg').click(function(){ //取消修改提现手机号
		$('.mask').css('display','none');
		$('.cg_tx_phone').css('display','none');
		clearInterval(timer);
		$('.get_code').attr('disabled',false);
		$('.get_code').css('background','#57c6d4');
		$('.get_code').css('color','#fff');
		$('.get_code').text('获取验证码');
	});

	// 确定修改提现手机号
	$('.pcg_add').click(function(){
		var nphone = $('#nphone').val();
		var jphone = $('#jphone').val();
		var vcode = $('#code').val();
		if(vcode!=''&&vcode.length==4){
			$.ajax({
				type: 'post',
				url: ctx+'/personalCenter/updateCloudUser',
				data: {	
					username:nphone,
					code:vcode,
					jphone:jphone
				},
				success: function(data){
					data = JSON.parse(data);
					if(data.code==200){
						msg('修改成功',true);
						$("#nphone").val("");
						$("#code").val("");
						clearInterval(timer);
						$('.get_code').attr('disabled',false);
						$('.get_code').css('background','#57c6d4');
						$('.get_code').css('color','#fff');
						$('.get_code').text('获取验证码');
						$('.mask').css('display','none');
						$('.cg_tx_phone').css('display','none');
						$('.txPhone').attr('data-phone',nphone);
						$('.txPhone').text(substrDemo(nphone));
					}else{
						msg(data.msg,false);
						return ;
					}
				}
			});
		}else{
			msg('验证码不正确',false);
		}
	});

	/* 事件绑定 */
}

var timer;
function sendMsgCode(obj,n){//验证码倒计时
		obj.css('background','#ccc');
		obj.css('color','#fff');
		obj.attr('disabled',true);
		obj.text(n+'秒后重新获取');
	    timer = setInterval(function(){
			n--;
			if(n==0){
				clearInterval(timer);
				obj.attr('disabled',false);
				obj.css('background','#57c6d4');
				obj.css('color','#fff');
				obj.text('获取验证码');
			}else{
				obj.text(n+'秒后重新获取');
			}
		},1000);
	}

/**
 * 修改提现手机号发送验证码
 * @param userName
 */
function sendtixiancode(userName){
	
	$.ajax({
		type:"post",
		url:ctx+"/TelCodeManage/checkAutoAndCode",
		dataType: "json",
		data:{
			tel:userName,
			templateCode:encodeDES("SMS_136855624"),
			msgtext:'平台修改提现手机号验证码',
			csessionid:encodeDES(document.getElementById('csessionid').value),
			sig:encodeDES(document.getElementById('sig').value),
			token:encodeDES(document.getElementById('token').value),
			scene: encodeDES(document.getElementById('scene').value)
		},
		success:function(data){
			eval("data="+data);
			if(data==3){
				msg('请按住滑块重新验证',false);
				/*initHua('register','#dom_id');*/
			}else{
				if(data==-2){
					clearInterval(timer);
					$('.get_code').attr('disabled',false);
					$('.get_code').css('background','#57c6d4');
					$('.get_code').css('color','#fff');
					$('.get_code').text('获取验证码');
					msg('请不要频繁发送验证码',false);
					/*initHua('register','#dom_id');*/
				}else if(data==-1){
					clearInterval(timer);
					$('.get_code').attr('disabled',false);
					$('.get_code').css('background','#57c6d4');
					$('.get_code').css('color','#fff');
					$('.get_code').text('获取验证码');
					msg('验证码发送失败',false);
					/*initHua('register','#dom_id');*/
				}else{
					sendMsgCode($('.get_code'),60);
				}
			}
		},
		error:function(){
			msg('网络服务忙,请稍后重新发送',false);
		}
	});
}
/**
 *获取用户信息 包括账号，密码，提现手机号，和收款账号列表信息
 */
function getUserInfo(){ 
	$.ajax({
		type: 'post',
		url: ctx+'/personalCenter/getCloudInfoAndPhone',
		success: function(data){
			data = JSON.parse(data);
			if(data.code==200){
				$('.photo img').attr('src',data.data[0].img==""?"/cloud/allstyle/newstyle/img/photo_03.png":"/cloud/allstyle/newstyle/img/"+(data.data[0].img==undefined?'photo_03.png':data.data[0].img));// 头像链接
				$('.ads span').text(data.data[0].address==""?"未知":data.data[0].address);//联系地址
				$('.name span').text(data.data[0].real_name==""?"未知":data.data[0].real_name);// 使用者姓名
				$('.com span').text(data.data[0].company==""?"未知":data.data[0].company); // 所在公司
				$('.tel span').text(data.data[0].telephone==""?"未知":data.data[0].telephone); // 联系电话
				$('.email span').text(data.data[0].email==""?"未知":data.data[0].email); // 邮箱
				$('.userName').html('<img class="tou" src="/cloud/allstyle/newstyle/img/usn.png">登录账号：'+data.data[0].user_name);//登录账号
				$('.userName').attr("usename",data.data[0].user_name);
				$('.txPhone').text(data.data[0].withdraw_phone==""?substrDemo(data.data[0].user_name):substrDemo(data.data[0].withdraw_phone)).attr('data-phone',data.data[0].withdraw_phone==""?data.data[0].user_name:data.data[0].withdraw_phone);//提现手机号
				var msgs = JSON.parse(data.msg);
				if(msgs.length==0){
					
				}else{
					var htmls = '';
					for(var i=0;i<msgs.length;i++){
						htmls +='<li><span>'+msgs[i].accountName+'</span><span>'+msgs[i].branchName+substrDemo(msgs[i].bankcarNum)+'</span><span>'+(msgs[i].dstate==0?'<i class="l_txt set_mr" id='+msgs[i].id+'>默认收款账号</i>':'<i class="i_btn set_mr" id='+msgs[i].id+'>设为默认收款账号</i>')+'<img class="tip det_zh" src="/cloud/allstyle/newstyle/img/delete.png" id='+msgs[i].id+'></span></li>'
					}
					$('.sk_list').html(htmls);
				}

				$('.set_mr').unbind('click');
				$('.set_mr').click(function(){// 设为默认账号
					var n = $('.set_mr').index(this);
					var id = $('.set_mr').eq(n).attr("id");
					if($(this).text()!='默认收款账号'){
						var cardInfo = $('.sk_list li').eq(n).find('span').eq(1).text();
						dhkalt('是否设置<span>'+cardInfo+'</span>为默认收款账号',function(){
						$.ajax({
							type: 'post',
							url: ctx+'/personalCenter/changeDefaltBank',
							data: {
								bankId:id
							},
							success: function(data){
								data = JSON.parse(data);
								if(data.code==200){
									$('.sk_list li').eq(0).find('span').eq(2).find('i').eq(0).removeClass('l_txt set_mr').addClass('i_btn set_mr').text('设为默认收款账号');
									$('.sk_list li').eq(n).find('span').eq(2).find('i').eq(0).removeClass('i_btn set_mr').addClass('l_txt set_mr').text('默认收款账号');
									$('.sk_list').prepend($('.sk_list li').eq(n));
									msg('设置成功',true);
								}else{
									msg('设置失败',false);
								}
							}
						});
					  });
					}
				});

				$('.det_zh').unbind('click');
				$('.det_zh').click(function(){
					var n = $('.det_zh').index(this);
					var cardInfo = $('.sk_list li').eq(n).find('span').eq(1).text();
					var bandid = $('.det_zh').eq(n).attr("id");
					dhkalt('是否删除<span>'+cardInfo+'</span>账号',function(){
						$.ajax({
							type: 'post',
							url: ctx+'/personalCenter/deleteBand',
							data: {
								bankId:bandid
							},
							success: function(data){
								data = JSON.parse(data);
								if(data.code==200){
									msg('删除成功',true);
									$('.sk_list li').eq(n).remove();
								}else{
									msg('删除失败',false);
								}
							}
						});
					});
				});
			}
		}
	});
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

/**
* 处理字符串显示几位中间以‘*’号显示
* 只能用作回显银行卡号
*/
function substrDemo(str){//接受需要处理的字符串
	return (str.substr(0,3)+'****'+str.substr(str.length-4,4));//直接返回处理好的字符串
}

/**
*根据银行卡号获取发卡行名称
*/
var getBankName = function (bankCard) {
            if (bankCard == null || bankCard == "") {
                return "";
            }
            $.ajax({
            	url: ctx+"/allstyle/newstyle/js/personal/bankData.json",
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
		                msg('未知发卡银行,请输入发卡银行名称',false);
		            }
            	},
            	error: function(){
            		msg('网络服务忙,请稍后重新发送',false);
            	}
            });
        }
/**
 * 校验银行卡
 * @param bankno
 * @returns {Boolean}
 */
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
    }else{
    	msg("银行卡不符合规范",false);
    	return false;
    }        
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
