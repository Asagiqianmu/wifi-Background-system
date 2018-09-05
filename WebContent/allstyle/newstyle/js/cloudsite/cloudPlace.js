var imgPath = ctx+"/allstyle/newstyle/img";
var usernames = $('#usernames').val();
var usernamesPA = $('#usernamesPA').val();
function buffers() {
	 
	$('.barcontainer').css('display', 'block') ;
	$('.barcontainer').fadeOut(800);
}

$(function(){
	if(from=="1"){
		$('.add_place_cont .rl-name span').eq(0).text('新增场所');
		$('.mask').css('display','block');
		$('.add_place_cont').css('display','block').animate({'right':'0px'});
		$('.name_inp').val("");//场所名称
		$('.pepnum_inp').val("");//场所总数
		$('#s_province').val("省份")
		$('#s_city').val("地级市")
		$('#county').val("");//场所地址
		$('.zd_num').val("");//同一账号允许最多终端登录的数
		$('.img_box').remove();
		$('#sy_time').val("1小时");
		$('.swicth').removeClass('d').addClass('m');
		$('.swicth > i').css('left','1px');
	}
	addDevice();
	_init_area();

	getSiteList(1);
	getTotalPage();
	addCloudSite();
	upLoad();
	buffers();
	pAuthList();
	// 退出按钮
	$('.menu > li.exit').click(function(){
		window.location.href=ctx+"/logOut";
	});
	$('.menu > li.personageCenter').click(function(){
		window.location.href=ctx+"/personalCenter/toPersonalCenter";
	});
	
	$('body').click(function(){//隐藏下拉框
		$('.speed-list1').css("display","none");
		$('.speed-list2').css("display","none");
	});

	$('.dhqx_btn').click(function(){// 对话框取消事件
		$('.mask').css('z-index','1000');
		$('.dhk').css('display','none');
		$('#xiugai').val('');
	});

	$('.authtimes').mouseover(function(){
		$('.floatauth').css('display','inline-block');
	})
	$('.authtimes').mouseout(function(){
		$('.floatauth').css('display','none');
	})
	
	//提示框
	$('.wh_ts').hover(function(){
		$(this).next().css('display','block');
	},function(){
		$(this).next().css('display','none');
	});

	//AC详情
/*	$('.AC_info').click(function(){
		var n = $('.AC_info').index(this);
		$('.mask').css('display','block');
		$('.AC_info_cont').css('display','block').animate({'right':'0px'});
	});*/


	//添加AC
	/*$('.add_ac').click(function(){
		$('.rs-cont').css("display","none").eq(0).css("display","block");
		$('.sele-box').find('img').attr("src",imgPath+"/sfalse.png").eq(0).attr("src",imgPath+"/strue.png");
		var n = $('.add_ac').index(this);
		$('.mask').css('display','block');
		$('.requiment-list .rl-name span').eq(0).text('添加设备');
		$('.requiment-list').removeAttr('data-index');
		$('.requiment-list').css('display','block').animate({'right':'0px'});
	});*/

	//关闭添加AC
	$('#goclose').click(function() {
		dhkalt('是否确定当前操作？',function(){
			if($('.requiment-list').attr('data-index')){
				$('.requiment-list').css('display','none').animate({'right':'-610px'});
				$('.AC_info_cont').css('display','block').animate({'right':'0px'});
				$('.requiment-list').removeAttr('data-index');
				return;
			}
			$('.AC_info_cont').animate({'right':'-707px'},function(){
				$('.mask').css('display','none');
				$('.AC_info_cont').css('display','none');
			});
			$('.requiment-list').animate({'right':'-610px'},function(){
				$('.mask').css('display','none');
				$('.requiment-list').css('display','none');
			});
			$('.add_place_cont').animate({'right':'-712px'},function(){
				$('.mask').css('display','none');
				$('.add_place_cont').css('display','none');
			});
		});
	});
	
	
	$('.requiment-list > .rl-name >.rl-exit').click(function(){
		
		dhkalt('是否确定当前操作？',function(){
			if($('.requiment-list').attr('data-index')){
				$('.requiment-list').css('display','none').animate({'right':'-610px'});
				$('.AC_info_cont').css('display','block').animate({'right':'0px'});
				$('.requiment-list').removeAttr('data-index');
				return;
			}
			$('.AC_info_cont').animate({'right':'-707px'},function(){
				$('.mask').css('display','none');
				$('.AC_info_cont').css('display','none');
			});
			$('.requiment-list').animate({'right':'-610px'},function(){
				$('.mask').css('display','none');
				$('.requiment-list').css('display','none');
			});
			$('.add_place_cont').animate({'right':'-712px'},function(){
				$('.mask').css('display','none');
				$('.add_place_cont').css('display','none');
			});
		});
	});
	$('.add_place_cont > .rl-name >.rl-exit').click(function(){
		dhkalt('是否确定当前操作？',function(){
			$('.add_place_cont').animate({'right':'-712px'},function(){
				$('.mask').css('display','none');
				$('.add_place_cont').css('display','none');
			});
		});
	});
	//关闭添加AC
	$('.AC_info_cont >.rl-name > .rl-exit').click(function(){
		dhkalt('是否确定当前操作？',function(){
			
				$('.AC_info_cont').animate({'right':'-707px'},400);
				$('.mask').css('display','none');
		});
	});
	
	
	//选择场所类型
	$('.type_list li').click(function(){
		var n = $('.type_list li').index(this);
		$('.fd_sel').attr("src",imgPath+"/sfalse.png").eq(n).attr("src",imgPath+"/strue.png");
		$('.pic').removeClass('on').eq(n).addClass("on");


	})

	/* 开关 */
	$('.swicth').unbind('click');
	$('.swicth').click(function(){
		var str = $(this).attr('class');
		if(str=='swicth d'){
				$(this).attr('class','swicth m');
			$(this).children().animate({left:'1px'},80);
		}else{
				$(this).attr('class','swicth d');
			$(this).children().animate({left:'31px'},80);
		}
	});
	/* 开关 */


	//场所设置
	$('.operation').find('img').css("display","block");
	$('.hover-show').css("display","none");	
	$('.operation').hover(function(){
		var Timg = $(this).find('img');
		var Tstage = Timg.attr("display");
		Timg.css("display","none");
		$(this).css("background","#57C6D4");
		$('.hover-show').css("display","block");	
	},function(){
		$(this).css("background","#AFEAF1");
		$('.operation').find('img').css("display","block");
		$('.hover-show').css("display","none");	
	});

	//用户速度设置
	$('.speed-list1').css("display","none");
	$('.speed-list2').css("display","none");
	$('.upSpeed-set').click(function(){
		$('.speed-list1').toggle();
		return false;
	})
	$('.downSpeed-set').click(function(){
		$('.speed-list2').toggle();
		return false;
	})
	$('.speed-list1 > li').click(function(){
		if($(this).text()=="自定义"){
			$('.upSpeed-set > input').val("");
		}else{
			$('.upSpeed-set > input').val($(this).text());
		}
		$('.speed-list1').css("display","none");
	})
	$('.speed-list2 > li').click(function(){
		if($(this).text()=="自定义"){
			$('.downSpeed-set > input').val("");
		}else{
			$('.downSpeed-set > input').val($(this).text());
		}
		$('.speed-list2').css("display","none");
	})

	//生成配置文件
	$('.down-config').css("display","none");
	$('.config-change').css("display","none");
	$('.config-btn').click(function(){
		if(!$('.config-input > input').val()==""){
			if(!/^[0-9a-zA-Z]*$/.test($('.config-input > input').eq(0).val())&&!/^[0-9a-zA-Z]*$/.test($('.config-input > input').eq(1).val())){
				msg('WAN端口或LAN端口格式不正确',false);
				return false;
			}else{
				$(this).hide();
				$('.config-input > input').attr('readonly','readonly');
				$('.down-config').css("display","block");
				$('.config-change').css("display","block");
				 downloadConfig();
			}
		}else{
			msg('请输入WAN端口LAN端口',false);
			return false;
		}
		
		
	})

	$('.config-change').click(function(){
		$('.down-config').css("display","none");
		$('.config-change').css("display","none");
		$('.config-btn').css("display","block");
		$('.config-input > input').removeAttr('readonly','readonly');
	});

	//如何绑定提示
	$('.how-bind').mouseover(function(){
		$('.ask-tip').css("display","block");
	})
	$('.how-bind').mouseout(function(){
		$('.ask-tip').css("display","none");
	})

	//选择设备类型
	$('.rs-cont').css("display","none").eq(0).css("display","block");
	$('.sele-box').find('img').attr("src",imgPath+"/sfalse.png").eq(0).attr("src",imgPath+"/strue.png");
	$('.rs-list').click(function(){
		var n = $('.rs-list').index(this);
		if($('.requiment-list .rl-name span').eq(0).text()=='修改设备'){
			msg('设备类型不能修改',false);
			return;
		}else{
			var type = $('.rs-list').eq(n).attr('ctype');
			var siteId = $('#siteid').val();
			getSecret(siteId,$('.nas-code'));
			if("wifidog"==type){
				getNasid($('.wf_dog_gwid'));
				$('.btn-sureAdd').text('确认添加');
			}else if("coovachilli"==type){
				getNasid($('.coova_nsid'));
				$('.btn-sureAdd').text('确认添加');
			}else if("ikuai"==type){
				getNasid($('.iKuai_nsid'));
				$('.btn-sureAdd').text('确认添加');
			}else if("ros"==type){
				getNasid($('.RouterOS_nsid'));
				$('.btn-sureAdd').text('确认添加');
			}else if("h3c"==type){
				getNasid($('.h3c_nsid'));
				$('.btn-sureAdd').text('确认添加');
			}else if("moto"==type){
				getNasid($('.moto_nsid'));
				$('.btn-sureAdd').text('确认添加');
			}else if("dunchong"==type){
				getNasid($('.dunchong_nsid'));
				$('.btn-sureAdd').text('确认添加');
			}else{
				$('.btn-sureAdd').text('申请对接');
			}
		}
		$('.requiment-list input').val('');
		var n = $('.rs-list').index(this);
		$('.rs-list').removeClass('on').eq(n).addClass('on')
		//$('.nas-code').val('4dadf5a');
		$('.sele-box').find('img').attr("src",imgPath+"/sfalse.png").eq(n).attr("src",imgPath+"/strue.png");
		$('.rs-cont').css("display","none").eq(n).css("display","block");
		
		
		
	})


	//取消场所编辑
	$('.qx_edit').click(function(){
		dhkalt('是否确定当前操作？',function(){
			$('.add_place_cont').animate({'right':'-712px'},function(){
				$('.mask').css('display','none');
				$('.add_place_cont').css('display','none');
			});
		});
	});

	//新增场所按钮
	$('.add_new_place').click(function(){
		$(".tel-support").val("");
		$('.add_place_cont .rl-name span').eq(0).text('新增场所');
		$('.mask').css('display','block');
		$('.add_place_cont').css('display','block').animate({'right':'0px'});
		$('.name_inp').val("");//场所名称
		$('.pepnum_inp').val("");//场所总数
		$('#s_province').val("省份")
		$('#s_city').val("地级市")
		$('#county').val("");//场所地址
		$('.zd_num').val("");//同一账号允许最多终端登录的数
		$('.img_box').remove();
		$('#sy_time').val("1小时");
		$('.swicth').removeClass('d').addClass('m');
		$('.swicth > i').css('left','1px');
		
	});

	//场所设置
	$('.operation').click(function(){
		var n = $('.operation').index(this);
		$('.add_place_cont .rl-name span').eq(0).text('场所设置');
		$('.add_place_cont').attr('data-index',n);
		var siteName = $('.placeName:eq('+n+') span').eq(0).text();
		var siteAds = $('.pndetail').eq(n).text();
		var sc = $('.try_out').eq(n).text();
		var zd = $('.max_terminal i').eq(n).text();
		var rz = $('.autonym').eq(n).text();
		var exTime = $('.exTime').eq(n).text();
		$('.name_inp').val(siteName);
		$('#s_province option').each(function(){
			if($(this).text()==chaifen(siteAds)[0]){
				$(this).attr('selected','selected');
				change(1);
			}
		});
		$('#s_city option').each(function(){
			if($(this).text()==chaifen(siteAds)[1]){
				
				$(this).attr('selected','selected');
			}
		});
		$('#county').val(chaifen(siteAds)[2]);
		$('.zd_num').val(zd);
		$('#sy_time option').each(function(){
			if($(this).text()==sc){
				$(this).attr('selected','selected');
			}
		});

		if(rz=='已开启'){
			$('.swicth').removeClass('m').addClass('d');
			$('.swicth').children().animate({left:'31px'},80);
		}else{
			$('.swicth').removeClass('d').addClass('m');
			$('.swicth').children().animate({left:'1px'},80);
		}
		
	/*	var imgsrc = $('.placePic:eq('+n+') img').attr('src').split('1.')[0];
		$('.fd_sel').each(function(){
			$(this).attr('src',imgPath+'/sfalse.png');
		});
		$('.tp_pic').each(function(){
			if($(this).attr('src').split('.')[0]==imgsrc){
				$(this).next().attr('src',imgPath+'/strue.png');
			}
		});*/
		var imgsrc = $('.placePic:eq('+n+') img').attr('src').split('.')[0];
		imgsrc = imgsrc.split("/")[imgsrc.split("/").length-1].split('s.')[0]+"."+imgsrc.split("/")[imgsrc.split("/").length-1].split('s.')[1];
		$('.fd_sel').each(function(){
			$(this).attr('src',imgPath+'/sfalse.png');
		});
		$('.tp_pic').each(function(){
			var img  = $(this).attr('src').split('.')[0].split("/")[imgsrc.split("/").length-1].split('s.')[0]+"."+imgsrc.split("/")[imgsrc.split("/").length-1].split('s.')[1];
			if(img==imgsrc){
				$(this).next().attr('src',imgPath+'/strue.png');
			}
		});
		//$('.mask').css('display','none');
		$('.add_place_cont').css('display','block').animate({'right':'0px'});
	});

	//复制nasid按钮
	$('.copy-btn').click(function(){
		$(this).prev().select();
		document.execCommand("Copy");
		msg('复制成功',true);
	});

	
	/* 场所分页 */
	$('.content .page_pre').unbind('click').click(function(){//上一页
		var dang = $('.content .page_cont > i').eq(0).text();
		if(dang!=1){
			dang--;
		}
		firstDisp(dang);
		$('.content .page_cont > i').eq(0).text(dang);
		getSiteList(dang);
		 
	});

	$('.content .page_next').unbind('click').click(function(){//下一页
		var dang = $('.content .page_cont > i').eq(0).text();
		if(dang!=$('.content .page_cont > i').eq(1).text()){
			dang++;
		}
		firstDisp(dang);
		$('.content .page_cont > i').eq(0).text(dang);
		//执行获取当前页ajax
		getSiteList(dang);
		
	});

	$('.content .page_last').click(function(){//尾页按钮
		$('.content .page_cont > i').eq(0).text($('.content .page_cont > i').eq(1).text());
		firstDisp($('.content .page_cont > i').eq(0).text());
		getSiteList($('.content .page_cont > i').eq(0).text());
	});

	$('.content .page_first').click(function(){//首页按钮
		$('.content .page_cont > i').eq(0).text(1);
		firstDisp(1);
		getSiteList(1);
	});

	$('.content .skip').unbind('click').click(function(){//跳转到某页
		var n = parseInt($('.content .page_to').val()==""?1:$('.content .page_to').val());
		if(n==''||n<1||n>$('.content .page_cont > i').eq(1).text()){
			$('.content .page_to').val('');
			return;
		}
		$('.content .page_cont > i').eq(0).text(n);
		firstDisp(n);
		$('.content .page_to').val('');
		getSiteList(n);
	});

	$('.content .page_to').unbind('keypress').keypress(function(e){//跳转到某页回车事件
		if(e.keyCode==13){
			var n = parseInt($('.content .page_to').val()==""?1:$('.content .page_to').val());
			if(n==''||n<1||n>$('.content .page_cont > i').eq(1).text()){
				$('.content .page_to').val('');
				return;
			}
			$('.content .page_cont > i').eq(0).text(n);
			firstDisp(n);
			$('.content .page_to').val('');
			getSiteList(n);
		}
	});
/* 场所分页 */
	/* 设备分页 */
	$('.ac_list_cont .page_pre').unbind('click').click(function(){//上一页
		var siteId = $('#siteid').val();
		var dang = $('.ac_list_cont .page_cont > i').eq(0).text();
		if(dang!=1){
			dang--;
		}
		firstDisp(dang);
		$('.ac_list_cont .page_cont > i').eq(0).text(dang);
		getAClist(siteId,dang);
	});

	$('.ac_list_cont .page_next').click(function(){//下一页
		var siteId = $('#siteid').val();
		var dang = $('.ac_list_cont .page_cont > i').eq(0).text();
		if(dang!=$('.ac_list_cont .page_cont > i').eq(1).text()){
			dang++;
		}
		firstDisp(dang);
		$('.ac_list_cont .page_cont > i').eq(0).text(dang);
		//执行获取当前页ajax
		getAClist(siteId,dang);
	});

	$('.ac_list_cont .page_last').click(function(){//尾页按钮
		var siteId = $('#siteid').val();
		$('.ac_list_cont .page_cont > i').eq(0).text($('.ac_list_cont .page_cont > i').eq(1).text());
		firstDisp($('.ac_list_cont .page_cont > i').eq(0).text());
		getAClist(siteId,$('.ac_list_cont .page_cont > i').eq(0).text());
	});

	$('.ac_list_cont .page_first').click(function(){//首页按钮
		var siteId = $('#siteid').val();
		$('.ac_list_cont .page_cont > i').eq(0).text(1);
		firstDisp(1);
		getAClist(siteId,1);
	});

	$('.ac_list_cont .skip').click(function(){//跳转到某页
		var siteId = $('#siteid').val();
		var n = parseInt($('.ac_list_cont .page_to').val()==""?1:$('.ac_list_cont .page_to').val());
		if(n==''||n<1||n>$('.ac_list_cont .page_cont > i').eq(1).text()){
			$('.ac_list_cont .page_to').val('');
			return;
		}
		$('.ac_list_cont .page_cont > i').eq(0).text(n);
		firstDisp(n);
		$('.ac_list_cont .page_to').val('');
		getAClist(siteId,n);
	});

	$('.ac_list_cont .page_to').keypress(function(e){//跳转到某页回车事件
		var siteId = $('#siteid').val();
		if(e.keyCode==13){
			var n = parseInt($('.ac_list_cont .page_to').val()==""?1:$('.ac_list_cont .page_to').val());
			if(n==''||n<1||n>$('.ac_list_cont .page_cont > i').eq(1).text()){
				$('.ac_list_cont .page_to').val('');
				return;
			}
			$('.ac_list_cont .page_cont > i').eq(0).text(n);
			firstDisp(n);
			$('.ac_list_cont .page_to').val('');
			getAClist(siteId,n);
		}
	});
/* 设备分页 */
	
	
})

//弹出对话框，str == 对话框显示内容 callback == 点确定之后需要执行的方法
function dhkalt(str,callback){
	
	$('.d_txt').html(str);
	$('.mask').css({'display':'block','z-index':'1098'});
	$('.dhk').css({'display':'block','z-index':'1099'});
	$('.dhqd_btn').unbind('click');
	$('.dhqd_btn').click(function(){
		if(callback){
			callback();
		}
		$('.wf_dog_dvAds').val('');
		$('.mask').css('z-index','1000');
		$('.dhk').css('display','none');
		$('#siteid').val('');
		/*if($('.requiment-list').attr('data-index')){
			location.reload();
		}*/
	});
}

function chaifen(str){
	var nArr = [];
	if(str.indexOf('省')>0){
		nArr.push(str.split('省')[0]+'省');
		nArr.push(str.split('省')[1].split('市')[0]+'市');
		nArr.push(str.split('省')[1].split('市')[1]);
	}else{
		nArr = str.split('市');
		nArr[0] = nArr[0]+'市';
		nArr[1] = nArr[1]+'市';
	}
	return nArr;
}

//获取AC设备信息列表,列表详情
function getAClist(siteId,curPage){
	$('.opacity').unbind('click');
	$('.opacity').click(function(){
		$('.AC_info_cont').animate({'right':'-707px'});
		$('.opacity').css('display','none');
		getSiteList(1);
		getTotalPage();
	});
	$.ajax({
		type: 'post',
		url: ctx+'/CloudSiteManage/getDeviceInfos',
		data: {
			siteId:siteId,
			curPage:curPage,
			pageSize:10
		},
		success: function(data){
			if(data=="loseSession"){
				 window.location.href=ctx+"/toLogin";
				 return;
			}	
			data = JSON.parse(data);
			if(data.code==200){
				$('.ac_detail >li').remove();
				var htmls = '';
				for(var i=0;i<data.data.length;i++){
					var typeimg = "";
					if(data.data[i].deviceType=='ikuai'){
						typeimg = "<img src='/cloud/allstyle/newstyle/img/aikuai.png' style='width:36px;margin-top:-4px'/>";
					}else if(data.data[i].deviceType=='wifidog'){
						typeimg = "<img src='/cloud/allstyle/newstyle/img/wifidog.png' style='width:36px;margin-top:-4px'/>";
					}else if(data.data[i].deviceType=='ros'){
						typeimg = "<img src='/cloud/allstyle/newstyle/img/router.png' style='width:36px;margin-top:-4px'/>";
					}else if(data.data[i].deviceType=='coovachilli'){
						typeimg = "<img src='/cloud/allstyle/newstyle/img/lajiao.png' style='width:36px;margin-top:-4px'/>";
					}else if(data.data[i].deviceType=='h3c'){
						typeimg = "<img src='/cloud/allstyle/newstyle/img/h3c.png' style='width:36px;margin-top:-4px'/>";
					}else if(data.data[i].deviceType=='moto'){
						typeimg = "<img src='/cloud/allstyle/newstyle/img/moto.png' style='width:36px;margin-top:-4px'/>";
					}else{
						typeimg = "<img src='/cloud/allstyle/newstyle/img/otherequ.png' style='width:36px;margin-top:-4px'/>";
					}
					htmls+='<li><span>'+data.data[i].nasid+'</span><span class="sb_type tip">'+typeimg+'</span><span>'+data.data[i].secretKey+'</span><span>'+(data.data[i].state==1?'异常':'正常')+'</span><span title='+data.data[i].position+'>'+data.data[i].position+'</span>'
					if(usernamesPA != usernames){
					htmls+='<span class="cz"><i class="i_btn download" dtype='+data.data[i].deviceType+' maxup='+data.data[i].maxup+' maxdown='+data.data[i].maxdown+'>下载配置文件</i>&nbsp;&nbsp;&nbsp;<i class="i_btn change_ac" id='+data.data[i].id+' dtype='+data.data[i].deviceType+' maxups='+data.data[i].maxup+' maxdowns='+data.data[i].maxdown+'>修改</i>&nbsp;&nbsp;&nbsp;<img class="delete_ac tip" src="'+imgPath+'/delete.png" id='+data.data[i].id+' nasid='+data.data[i].nasid+'></span>'
					}else{
						htmls+='<span class="cz">无</span>'
					}
					htmls+='<p class="float">系统运行时间：'+data.data[i].runTime+'<br>CPU占用：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+data.data[i].cpu+'</p></li>';
				}
				$('.ac_detail').html(htmls);

				$('.download').unbind('click')
				$('.download').click(function(){// 下载该AC配置文件
					var n = $('.download').index(this);
					var type = $('.download').eq(n).attr('dtype');
					var nasid = $('.download').eq(n).parent().parent().children().eq(0).text();
					var secretKey = $('.download').eq(n).parent().parent().children().eq(2).text();
					var address = $('.download').eq(n).parent().parent().children().eq(4).text();
					var maxup = $('.download').eq(n).attr('maxup');
					var maxdown = $('.download').eq(n).attr('maxdown')
					setTimeout(function(){
						window.location.href = ctx+ '/CloudSiteManage/downloadDeviceConfig?type='+type+'&nasid='+nasid+'&secret='+secretKey+'&address='+address+'&up='+maxup+'&down='+maxdown+'';
					},2000);
					downloadWhileList();
				});
				$('.sb_type').mouseover(function(){
					var n = $('.sb_type').index(this);
					$('.float').eq(n).css('display','inline-block');
				})
				$('.sb_type').mouseout(function(){
					var n = $('.sb_type').index(this);
					$('.float').eq(n).css('display','none');
				})
				
				
				$('.change_ac').unbind('click');
				$('.change_ac').click(function(){
					$('.btn-sureAdd').text("确认修改");
					$('#xiugai').val('xiugai');
				    $('.opacity').unbind('click');
					var n = $('.change_ac').index(this);
					var maxups = ($('.change_ac').eq(n).attr('maxups')==''?'':$('.change_ac').eq(n).attr('maxups').replace(/[^0-9]/ig,""));
					var maxdowns = ($('.change_ac').eq(n).attr('maxdowns')==''?'':$('.change_ac').eq(n).attr('maxdowns').replace(/[^0-9]/ig,""));
					var id =  $('.change_ac').eq(n).attr('id');
					var type =$('.change_ac').eq(n).attr('dtype');
					var nsId = $('.ac_detail li:eq('+n+') > span').eq(0).text();
					//var type = $('.ac_detail li:eq('+n+') > span').eq(1).text().split('系统')[0];
					var miyao = $('.ac_detail li:eq('+n+') > span').eq(2).text();
					var deviceAds = $('.ac_detail li:eq('+n+') > span').eq(4).text();
					if(type=='wifidog'){
						$('.wf_dog_gwid').val(nsId);
						$('.wf_dog_dvAds').val(deviceAds);
						$('.rs-cont').css("display","none").eq(0).css("display","block");
						$('.sele-box').find('img').attr("src",imgPath+"/sfalse.png").eq(0).attr("src",imgPath+"/strue.png");
						$('.rs-list').removeClass('on').eq(0).addClass("on");
					}else if(type=='coovachilli'){
						$('.coova_nsid').val(nsId);
						$('.coova_nas_code').text(miyao);//360浏览器兼容问题待解
						$('.coova_nas_code').val(miyao);//谷歌浏览器兼容问题待解
						$('.coova_dvAds').val(deviceAds);
						$('.rs-cont').css("display","none").eq(1).css("display","block");
						$('.sele-box').find('img').attr("src",imgPath+"/sfalse.png").eq(1).attr("src",imgPath+"/strue.png");
						$('.rs-list').removeClass('on').eq(1).addClass("on");
						$('#coll1').val(maxups/8);
						$('#coll2').val(maxdowns/8);
					}else if(type=='ikuai'){
						$('.iKuai_nsid').val(nsId);
						$('.iKuai_nas_code').text(miyao);
						$('.iKuai_nas_code').val(miyao);
						$('.iKuai_dvAds').val(deviceAds);
						$('.rs-cont').css("display","none").eq(2).css("display","block");
						$('.sele-box').find('img').attr("src",imgPath+"/sfalse.png").eq(2).attr("src",imgPath+"/strue.png");
						$('.rs-list').removeClass('on').eq(2).addClass("on");
						$('#ikuai1').val(maxups);
						$('#ikuai2').val(maxdowns);
					}else if(type=='ros'){
						$('.RouterOS_nsid').val(nsId);
						$('.RouterOS_nas_code').text(miyao);
						$('.RouterOS_nas_code').val(miyao);
						$('.RouterOS_dvAds').val(deviceAds);
						$('.rs-cont').css("display","none").eq(3).css("display","block");
						$('.sele-box').find('img').attr("src",imgPath+"/sfalse.png").eq(3).attr("src",imgPath+"/strue.png");
						$('.rs-list').removeClass('on').eq(3).addClass("on");
						$('#ros1').val(maxups*100);
						$('#ros2').val(maxdowns*100);
					}else if(type=='h3c'){
						$('.h3c_nsid').val(nsId).attr("readonly","readonly");
						$('.h3c_nas_code').text(miyao);
						$('.h3c_nas_code').val(miyao);
						$('.h3c_dvAds').val(deviceAds);
						$('.rs-cont').css("display","none").eq(4).css("display","block");
						$('.sele-box').find('img').attr("src",imgPath+"/sfalse.png").eq(4).attr("src",imgPath+"/strue.png");
						$('.rs-list').removeClass('on').eq(4).addClass("on");
						$('#h3c_coll1').val(maxups/8);
						$('#h3c_coll2').val(maxdowns/8);
					}else if(type=='moto'){
						$('.moto_nsid').val(nsId).attr("readonly","readonly");
						$('.moto_nas_code').text(miyao);
						$('.moto_nas_code').val(miyao);
						$('.moto_dvAds').val(deviceAds);
						$('.rs-cont').css("display","none").eq(5).css("display","block");
						$('.sele-box').find('img').attr("src",imgPath+"/sfalse.png").eq(5).attr("src",imgPath+"/strue.png");
						$('.rs-list').removeClass('on').eq(5).addClass("on");
						$('#moto_coll1').val(maxups/8);
						$('#moto_coll2').val(maxdowns/8);
					}else{
						$('.rs-list').removeClass('on').eq(4).addClass("on");
					}


					$('.requiment-list .rl-name span').eq(0).text('修改设备');
					$('.AC_info_cont').css('display','none').animate({'right':'-707px'});
					$('.mask').css({'display':'block'});
					$('.requiment-list').css('display','block').animate({'right':'0px'});
					$('.requiment-list').attr('data-index',n);
				});
				
				$('.delete_ac').unbind('click');
				$('.delete_ac').click(function(){
					var n = $('.delete_ac').index(this);
					var id = $('.delete_ac').eq(n).attr('id');
					var nasid = $('.delete_ac').eq(n).attr('nasid');
					dhkalt('是否要删除该设备',function(){
						var siteId = $('#siteid').val();
						deleteDevice(id,nasid,n,siteId);
					});
				});
			} 
		}
	});
}

/**
 * 删除设备详情
 * @param id -设备id
 */
function deleteDevice(id,nasid,n,siteId){
	 $.ajax({
			type : "POST",
			url : ctx + "/CloudSiteManage/deleteDevice",
			data : {
				nasid : nasid,
				id:id
			},
			success : function(data) {
				if(data=="loseSession"){
					 window.location.href=ctx+"/toLogin";
					 return;
				}	
				eval("data = " + data);
				if(data.code==200){
					$('.ac_detail li').remove();
					getDeviceTotalPages(siteId,10);
					getAClist(siteId,1)
					getSiteList(1);
				    getTotalPage();
				}else{
					msg("删除设备失败",false);
					return;
				}
			},
			error : function() {
				msg("系统繁忙,请稍后",false);
			}
		});
	
}


/**
 * 场所设备总页数
 */
function getDeviceTotalPages(siteId,pageSize) {
    $.ajax({
			type : "POST",
			url : ctx + "/CloudSiteManage/getDeviceTotalPages",
			data : {
				siteId : siteId,
				pageSize:pageSize
			},
			success : function(data) {
				if(data=="loseSession"){
					 window.location.href=ctx+"/toLogin";
					 return;
				}	
				eval("data = " + data);
				var total = parseInt(data);
				if(total==0){
					$('.pager').css('display','none');
				}else{
					$('.pager').css('display','block');
					$('.ac_list_cont>.pager>.page_cont > i').eq(1).text(total)
				}
			},
			error : function() {
				msg("系统繁忙,请稍后",false);
			}
		});
}

/**
 * //获取已上传的banner
 * 
 */
function getBanner(siteId){
	$.ajax({
		type: 'post',
		url: ctx+'/CloudSiteManage/getBannerUrl',
		data: {
			siteId:siteId
		},
		success: function(data){
			if(data=="loseSession"){
				 window.location.href=ctx+"/toLogin";
				 return;
			}	
			data = JSON.parse(data);
			if(data.code==200){//有图片
				$('.img_box').remove();
				var htmls = '';
				for(var i=0;i<data.data.length;i++){
					htmls+='<p class="gg_cont img_box">'+
								'<img src="'+data.data[i]+'">'+
								'<span class="cg_img">修改</span><span class="de_img">删除</span>'+
							'</p>';
				}
				$('.sl_file').before(htmls);


				$('.cg_img').unbind('click');
	           	$('.cg_img').click(function(){// 修改图片按钮
	           		var n = $('.cg_img').index(this);
	           		$('#choose').attr('data-index',n);
	           		choose.click();
	           	});

	           	$('.de_img').unbind('click');
	           	$('.de_img').click(function(){// 删除图片按钮
	           		var n = $('.de_img').index(this);
	           		dhkalt('是否删除该图片？',function(){
	           			$('.img_box').eq(n).remove();
	           		});
	           	});
			}
			var msg = data.msg;
			if(msg==""){
				$('.pic').removeClass('on').eq(0).addClass('on');
			}else{
				var n = $('.pic').length;
				for(var i=0;i<n;i++){
					var text = $('.pic').eq(i).next().text();
					if(text==msg.split(',')[1]){
						$('.pic').removeClass('on').eq(i).addClass('on');
						$('.pic').eq(i).children().eq(1).attr('src',imgPath+'/strue.png')
						break;
					}
				}
			}
		}
	});
}

//获取场所列表
function getSiteList(curPage){
	$.ajax({
		type: 'post',
		url: ctx+'/CloudSiteManage/getUserSiteLists',
		data: {
			curPage:curPage,
			pageSize:5
		},
		success: function(success){
			if(success=="loseSession"){
				 window.location.href=ctx+"/toLogin";
				 return;
			}	
			
			success = JSON.parse(success);
			if(success.code==200){
			    $('.barcontainer').css('display', 'none');
				var data = success.data.data;
				var htmls = '';
				if(data.length<=0){
					//$('.placeList').html("暂无场所,请先添加场所");
					$("#ku").show();
				}else{
					$("#ku").hide();
				for(var i=0;i<data.length;i++){
					var imgpath = "";
					if(data[i].site_type==""||data[i].site_type==undefined){
						imgpath = imgPath+"/xuexiaos.png";
					}else{
						imgpath = imgPath+"/"+data[i].site_type.split(',')[0].split('.')[0]+'s.png';
					}
					var sitehtml = "";
					if(data[i].mac_num==0){
							sitehtml +='<span class="add_equiment" id="equimentAdd"><img class="tip add_ac" src="'+imgPath+'/add-re.png" siteid='+data[i].id+' /></span>'
							+'<span class="add_equiment" style="color: #2CB3C4;">绑定设备</span>';
					  }else{
						 sitehtml+= '<span>在线AC数</span>'+
							        '<span>在线AP数</span>'+
							         '<span class="operatePic"><img class="tip add_ac" src="'+imgPath+'/place3.png" siteid='+data[i].id+' /></span>'+
							        '<span class="numColor">'+data[i].mac_num+'<img class="AC_info tip" src="'+imgPath+'/place4.png" siteid='+data[i].id+' /></span>'+
							        '<span class="numColor">0<img src="'+imgPath+'/place4.png"/></span>';
					  }
				
					htmls+='<li>'+
								'<p class="placePic"><img src="'+imgpath+'" /></p>'+
								'<p class="placeName" title='+data[i].site_name+' value='+data[i].site_admin+'><span>'+data[i].site_name+'</span><span class="pndetail" title='+data[i].address+'>'+data[i].address+'</span></p>'+
								'<p class="placeNum">'+ sitehtml +'</p>'+
								'<p class="use-msg">'+
									'<span>试用时长</span>'+
									'<span>无流量下线</span>'+
									'<span>最大终端数</span>'+
									'<span>实名认证状态</span>'+
									'<span>充值人数</span>'+
									'<span>在线人数</span>'+
									'<span class="try_out">'+(data[i].is_probative == 0 ? '关闭' : (data[i].is_probative+'小时'))+'</span>'+
									'<span class="exTime">'+(data[i].exTime==3600?'1小时':(parseInt(data[i].exTime/60))+'分钟')+'</span>'+
									'<span class="max_terminal">&lt;=<i>'+data[i].allow_client_num+'</i>台</span>'+
									'<span class="autonym">'+(data[i].state == 0 ? '已开启' : '已关闭')+'</span>'+
									'<span>'+data[i].portalUserNum+'</span>'+
									'<span>'+data[i].create_time+'</span>'+
								'</p>'+
								'<p class="operation" id='+data[i].id+' sitenum='+data[i].siteNum+'><img src="'+imgPath+'/place1.png" /><span class="hover-show" siteid='+data[i].id+'>场所设置</span></p>'+
							'</li>';
				}
				$('.placeList').html(htmls);

				//场所设置 鼠标移入移出
				$('.operation').find('img').css("display","block");
				$('.hover-show').css("display","none");
				$('.operation').unbind('hover');
				$('.operation').hover(function(){
					var Timg = $(this).find('img');
					var Tstage = Timg.attr("display");
					Timg.css("display","none");
					$(this).css("background","#57C6D4");
					$('.hover-show').css("display","block");
				},function(){
					$(this).css("background","#AFEAF1");
					$('.operation').find('img').css("display","block");
					$('.hover-show').css("display","none");	
				});

				//场所设置
				$('.operation').unbind('click');
				$('.operation').click(function(){
					$(".tel-support").val("");
					var n = $('.operation').index(this);
					var tel=$('.placeName').eq(n).attr('value');
					if(tel!=undefined&&tel!=""&&tel!="undefined"){
						$(".tel-support").val(tel);
					}
					var siteId = $('.operation').eq(n).attr('id');
					findeAuth(siteId);
					$("#savesite").attr('siteId',siteId)
					var sitenum = $('.operation').eq(n).attr('sitenum');
					 getBanner(siteId);
					$('.add_place_cont .rl-name span').eq(0).text('场所设置');
					$('.add_place_cont').attr('data-index',n);
					var siteName = $('.placeName:eq('+n+') span').eq(0).text();
					var siteAds = $('.pndetail').eq(n).text();
					var sc = $('.try_out').eq(n).text();
					var zd = $('.max_terminal i').eq(n).text();
					 $('.pepnum_inp').val(sitenum)
					var rz = $('.autonym').eq(n).text();
					var exTime = $('.exTime').eq(n).text();
					$('.name_inp').val(siteName);
					$('#s_province option').each(function(){
						if($(this).text()==chaifen(siteAds)[0]){
							$(this).attr('selected','selected');
							change(1);
						}
					});
					$('#s_city option').each(function(){
						if($(this).text()==chaifen(siteAds)[1]){
							
							$(this).attr('selected','selected');
						}
					});
					$('#county').val(chaifen(siteAds)[2]);
					$('.zd_num').val(zd);
					$('#sy_time option').each(function(){
						if($(this).text()==sc){
							$(this).attr('selected','selected');
						}else{
							$("#sy_time option").eq($('#sy_time option').length-1).attr('selected','selected');
							$("#father_div").show();
							$('#sy_other_input').val(sc.replace(/\D/g,''));
						}
					});

					if(rz=='已开启'){
						$('.swicth').removeClass('m').addClass('d');
						$('.swicth').children().animate({left:'31px'},80);
					}else{
						$('.swicth').removeClass('d').addClass('m');
						$('.swicth').children().animate({left:'1px'},80);
					}
					
					var imgsrc = $('.placePic:eq('+n+') img').attr('src').split('.')[0];
					imgsrc = imgsrc.split("/")[imgsrc.split("/").length-1].split('s.')[0]+"."+imgsrc.split("/")[imgsrc.split("/").length-1].split('s.')[1];
					$('.fd_sel').each(function(){
						$(this).attr('src',imgPath+'/sfalse.png');
					});
					$('.tp_pic').each(function(){
						var img  = $(this).attr('src').split('.')[0].split("/")[imgsrc.split("/").length-1].split('s.')[0]+"."+imgsrc.split("/")[imgsrc.split("/").length-1].split('s.')[1];
						if(img==imgsrc){
							$(this).next().attr('src',imgPath+'/strue.png');
						}
					});
					$('#authtime').val(exTime);
					// console.log(chaifen(siteAds));
					$('.mask').css('display','block');
					$('.add_place_cont').css('display','block').animate({'right':'0px'});
				});

				//添加AC
				$('.add_ac').unbind('click');
				$('.opacity').unbind('click');
				$('.add_ac').click(function(){
					$('.h3c_nsid').removeAttr("readonly");
					$('.rs-cont').css("display","none").eq(0).css("display","block");
					$('.sele-box').find('img').attr("src",imgPath+"/sfalse.png").eq(0).attr("src",imgPath+"/strue.png");
					var n = $('.add_ac').index(this);
					$('.mask').css('display','block');
					$('.requiment-list .rl-name span').eq(0).text('添加设备');
					$('.requiment-list').removeAttr('data-index');
					$('.requiment-list').css('display','block').animate({'right':'0px'});
					$('.rs-list').removeClass('on').eq(0).addClass('on');
					var siteId = $('.add_ac').eq(n).attr('siteid');
					$('#siteid').val(siteId);
					getNasid($('.wf_dog_gwid'));
					getSecret(siteId,$('.nas-code'));
					$('.btn-sureAdd').text('确认添加');
				});

				//AC详情
				$('.AC_info').unbind('click');
				$('.AC_info').click(function(){
					var n = $('.AC_info').index(this);
					var siteId = $('.AC_info').eq(n).attr('siteid');
					$('#siteid').val(siteId)
					$('.mask').css('display','block');
					$('.AC_info_cont').css('display','block').animate({'right':'0px'});
					$('.ac_detail >li').remove();
					getAClist(siteId,1);
					getDeviceTotalPages(siteId,10);
				});
			}
			}
		}
	  });
}

function  upLoad(){
	var choose=document.getElementById('choose');
	document.getElementById('upload').onclick=function(){
		$('#choose').removeAttr('data-index');
		choose.click();
	};

	choose.onchange=function(){
        ImageFileResize(this.files[0], 640, 360, function (dataUrl) {
        	if($('#choose').attr('data-index')){
        		$('.img_box').eq($('#choose').attr('data-index')).find('img').attr('src',dataUrl);
        	}else if($('.img_box').length>=3){
           		$('.img_box').eq(2).remove();
           		var htmls = '<p class="gg_cont img_box">'+
								'<img src="'+dataUrl+'">'+
								'<span class="cg_img">修改</span><span class="de_img">删除</span>'+
							'</p>';
				
				$('.img_box').eq(0).before(htmls);
				$('.banner_pic').attr('src',dataUrl)
           	}else if($('.img_box').length<3){
           		var htmls = '<p class="gg_cont img_box">'+
								'<img src="'+dataUrl+'">'+
								'<span class="cg_img">修改</span><span class="de_img">删除</span>'+
							'</p>';
				$('.sl_file').before(htmls);
				$('.banner_pic').attr('src',dataUrl)
           	}

           	$('.cg_img').unbind('click');
           	$('.cg_img').click(function(){// 修改图片按钮
           		var n = $('.cg_img').index(this);
           		$('#choose').attr('data-index',n);
           		choose.click();
           	});

           	$('.de_img').unbind('click');
           	$('.de_img').click(function(){// 删除图片按钮
           		var n = $('.de_img').index(this);
           		dhkalt('是否删除该图片？',function(){
           			$('.img_box').eq(n).remove();
           		});
           	});

            choose.value='';
        });   
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
}

/**
 * 场所列表总页数
 */
function getTotalPage() {
    $.ajax({
			type : "POST",
			url : ctx + "/CloudSiteManage/getTotalPage",
			data : {
				pageSize : 5
			},
			success : function(data) {
				if(data=="loseSession"){
					 window.location.href=ctx+"/toLogin";
					 return;
				}	
				eval("data = " + data);
				var total = parseInt(data);
				if(total==0){
					$('.pager').css('display','none');
				}else{
					$('.pager').css('display','block');
					$('.page_cont > i').eq(1).text(total)
				}
			},
			error : function() {
				msg("系统繁忙,请稍后",false);
			}
		});
}

//场所添加
function addCloudSite(){
	$('.bc_edit').click(function(){
		var imgpath = $('.type_list .on .tp_pic').attr('src');
		var text = $('.type_list .on').next().text();
		var index = imgpath .lastIndexOf("\/");  
		var site_type  = imgpath .substring(index + 1, imgpath.length)+","+text;//场所类型
		var sitename = $('.name_inp').val();//场所名称
		var sitenum = $('.pepnum_inp').val();//场所总数
		var address = $('#s_province').val()+$('#s_city').val()+$('#county').val();//场所地址
		var zd_num = $('.zd_num').val();//同一账号允许最多终端登录的数
		var sy_time = '';//试用时间
		var authtime = $('#authtime').val().replace(/[^0-9]/ig,"");
		var tel=$(".tel-support").val();
		if($('#sy_time').val()=='关闭'){
			sy_time=0;
		}else if($('#sy_time').val()=='自定义'){
			sy_time= $('#sy_other_input').val();
			if($('#sy_other_input').val()==""){
				msg("请输入试用时长",false);
				return;
			}
		}else{
			sy_time = $('#sy_time').val().replace(/[^\d\.]/g,"");
		}
		var state = '';//认证状态
		if($('.swicth').attr('class').indexOf('m')!=-1){
			state = 1;
		}else{
			state = 0;
		}
		var n = $('.img_box').length;
		var img = "";//bannerurl
		for (var i = 0; i < n; i++) {
		    img += $('.img_box').eq(i).children().eq(0).attr('src')+"@";
		}
		if(sitename==""){
			msg("请填写场所名称",false);
			return;
		}
		if(sitenum==""){
			msg("请填写场所总人数",false);
		    return;
		}
		if(zd_num==""){
			msg("请输入最大允许终端数",false);
			return;
		}
		if(tel.length != 11 || !(/^1[3578][0-9]{9}$/.test(tel))) {
			msg("请输入正确的手机号",false);
			return;
		}
		var isadd = $('#isadd').text();
		var authStates=document.getElementById("authStatuss");
	    var selected_val = authStates.options[authStates.selectedIndex].value;
	    //获取APP信息
	    var appinfo=document.getElementById("app_select");
	    var appInfoId = "";//appinfo.options[appinfo.selectedIndex].value;
	    var appName = "";
	    var appId = "";
	    var appSecretKey = "";
	    if(appInfoId == "0"){
	    	appName = $('#appName').val();
	    	appId = $('#appId').val();
	    	appSecretKey = $('#appSecretKey').val();
	    	if(appName==""){
	    		msg('请输入APP名称',false);
	    		$('.btn-sureAdd').attr("disabled", false); 
	    		return ;
	    	}
	    	if(appId==""){
	    		msg('请输入APPID',false);
	    		$('.btn-sureAdd').attr("disabled", false); 
	    		return ;
	    	}
	    	if(appSecretKey==""){
	    		msg('请输入APP密钥',false);
	    		$('.btn-sureAdd').attr("disabled", false); 
	    		return ;
	    	}
	    }
		if(isadd=="新增场所"){
		    $.ajax({
			type:'post',
			url :ctx+'/CloudSiteManage/addCloudSite',
			data:{
				siteType:site_type,
				siteName:sitename,
				siteNum:sitenum,
				address:address,
				zd_num:zd_num,
				sy_time:sy_time,
				state:state,
				imgstr:img,
				exTime:authtime,
				tel:tel,
				autnStates:selected_val,
				appName:appName,
				appId:appId,
				appSecretKey:appSecretKey,
				appInfoId:appInfoId
			},
			success:function(data){
				if(data=="loseSession"){
					 window.location.href=ctx+"/toLogin";
					 return;
				}	
				eval("data="+data);
				if(data.code==200){
					getSiteList(1);
					getTotalPage();
					 $('.barcontainer').css('display', 'none');
					$('.add_place_cont').css('display','none'); 
					$('.mask').css('display','none');
					msg("场所添加成功",true);
				}else{
					msg(data.msg,false);
				}
			},
			error:function(){
				msg("网络异常,请稍后",false);
			}
		}); 
		}else{
			var siteId = $("#savesite").attr('siteId');
			console.log("siteType:",site_type,"siteName:",sitename,"siteNum:",sitenum==undefined?1:sitenum,
						"address:",address,"zd_num:",zd_num,"sy_time:",sy_time,"state:",state,"imgstr:",img,
						"siteId:",siteId,"exTime:",authtime,"tel:",tel,"autnStates:",selected_val,
						"appName:",appName,"appId:",appId,"appSecretKey:",appSecretKey,"appInfoId:",appInfoId);
			 $.ajax({
					type:'post',
					url :ctx+'/CloudSiteManage/updateCloudSites',
					data:{
						siteType:site_type,
						siteName:sitename,
						siteNum:sitenum==undefined?1:sitenum,
						address:address,
						zd_num:zd_num,
						sy_time:sy_time,
						state:state,
						imgstr:img,
						siteId:siteId,
						exTime:authtime,
						tel:tel,
						autnStates:selected_val,
						appName:appName,
						appId:appId,
						appSecretKey:appSecretKey,
						appInfoId:appInfoId
					},
					success:function(data){
						eval("data="+data);
						if(data.code==200){
							getSiteList(1);
							 $('.barcontainer').css('display', 'none');
							$('.add_place_cont').css('display','none'); 
							$('.mask').css('display','none');
							msg("场所信息更新成功",true);
						}else{
							msg(data.msg,false);
						}
					},
					error:function(){
						msg("网络异常,请稍后",false);
					}
				}); 
		}
	})
}
//获取nasid方法
//obj 传入$("#ss")  的格式
function getNasid(obj){
	//AJAX请求获取ansid
	$.ajax({
		type : 'post',
		url : ctx + "/CloudSiteManage/generateNasid",
		success : function(data) {
			data = JSON.parse(data);
			if (data.code == 200) {
				//待处理
				obj.val(data.data);
			} else {
				msg("获取nasid失败",false);
				return;
			}
		}
	});
}

/**
 * 获取密匙操作
 * @param siteId
 * 
 * obj 传入$("#ss")  的格式
 */
function getSecret(siteId,obj){
	$.ajax({
		type : 'post',
		url : ctx + "/CloudSiteManage/getSecret",
		data : {
			siteId : siteId
		},
		success : function(data) {
			data = JSON.parse(data);
			if (data.code == 200) {
				//待处理
				obj.text(data.data);
                //秘钥默认全是fxwxwl
			} else {
				 msg("网络异常,请稍后",false);
				return ;
			}
		}
	});
}
/**
 * 添加设备
 */
function addDevice(){
	$('.btn-sureAdd').click(function(){
		$('.btn-sureAdd').attr("disabled", true); 
		setTimeout(function(){
			$('.btn-sureAdd').attr("disabled", false); 
		}, 10000);
		var type= $('.rs-list.tip.on').attr('ctype');
		var siteId=$('#siteid').val();
		var secretKey = $('.nas-code').eq(0).text();
		if("wifidog"==type){
			var macAddress = $('.wf_dog_dvAds').val();
			var nasid = $('.wf_dog_gwid').val();
			if(macAddress==""){
				msg('请输入设备安装地址',false);
				$('.btn-sureAdd').attr("disabled", false); 
				return ;
			}
			if($('.requiment-list .rl-name span').eq(0).text()=='修改设备'){
				updateDevice(nasid,macAddress,"100","100",siteId);
			}else{
				if(secretKey==""){
					msg('请输入设备密匙',false);
					$('.btn-sureAdd').attr("disabled", false); 
					return ;
				}
				if(nasid==""){
					msg('请输入设备GWID',false);
					$('.btn-sureAdd').attr("disabled", false); 
					return ;
				}
				addDecive(nasid,"",macAddress,"1.0.0.1",secretKey,"100","100",siteId,"wifidog");
			}
		}else if("coovachilli"==type){
			var nasid = $('.coova_nsid').val();
			var macAddress = $('.coova_dvAds').val();
			var maxUpSpeed = $('.speed-show').eq(0).val();
			var maxDownSpeed = $('.speed-show').eq(1).val();
			
			if(macAddress==""){
				msg('请输入设备安装地址',false);
				$('.btn-sureAdd').attr("disabled", false); 
				return ;
			}
			if(maxUpSpeed==""||maxDownSpeed==""){
				msg('上传与下载限速不能为空',false);
				$('.btn-sureAdd').attr("disabled", false); 
				return ;
			}
			if($('.requiment-list .rl-name span').eq(0).text()=='修改设备'){
				updateDevice(nasid,macAddress,maxUpSpeed,maxDownSpeed,siteId);
			}else{
				if(secretKey==""){
					msg('请输入设备密匙',false);
					$('.btn-sureAdd').attr("disabled", false); 
					return ;
				}
				addDecive(nasid,"",macAddress,"1.0.0.0.0",secretKey,maxUpSpeed,maxDownSpeed,siteId,"coovachilli");
			}
		}else if("ikuai"==type){
			var nasid = $('.iKuai_nsid').val();
			var macAddress = $('.iKuai_dvAds').val();
			var maxUpSpeed = $('.speed-show1').eq(0).val();
			var maxDownSpeed = $('.speed-show1').eq(1).val();
			
			if(macAddress==""){
				msg('请输入设备安装地址',false);
				$('.btn-sureAdd').attr("disabled", false); 
				return ;
			}
			if(maxUpSpeed==""||maxDownSpeed==""){
				msg('上传与下载限速不能为空',false);
				$('.btn-sureAdd').attr("disabled", false); 
				return ;
			}
			if($('.requiment-list .rl-name span').eq(0).text()=='修改设备'){
				updateDevice(nasid,macAddress,maxUpSpeed,maxDownSpeed,siteId);
			}else{
				if(secretKey==""){
					msg('请输入设备密匙',false);
					$('.btn-sureAdd').attr("disabled", false); 
					return ;
				}
				addDecive(nasid,"",macAddress,"1.0.0.0.0",secretKey,maxUpSpeed,maxDownSpeed,siteId,"ikuai");
			}
		}else if("ros"==type){
			var nasid= $('.RouterOS_nsid').val();
			var macAddress = $('.RouterOS_dvAds').val();
			var maxUpSpeed = $('.speed-show2').eq(0).val();
			var maxDownSpeed = $('.speed-show2').eq(1).val();
			
			if(macAddress==""){
				msg('请输入设备安装地址',false);
				$('.btn-sureAdd').attr("disabled", false); 
				return ;
			}
			if(maxUpSpeed==""||maxDownSpeed==""){
				msg('上传与下载限速不能为空',false);
				$('.btn-sureAdd').attr("disabled", false); 
				return ;
			}
			if($('.requiment-list .rl-name span').eq(0).text()=='修改设备'){
				updateDevice(nasid,macAddress,maxUpSpeed,maxDownSpeed,siteId);
			}else{
				if(secretKey==""){
					msg('请输入设备密匙',false);
					$('.btn-sureAdd').attr("disabled", false); 
					return ;
				}
				addDecive(nasid,"",macAddress,"1.0.0.0.0",secretKey,maxUpSpeed,maxDownSpeed,siteId,"ros");
			}
		}else if("h3c"==type){
			var nasid = $('.h3c_nsid').val();
			var macAddress = $('.h3c_dvAds').val();
			var maxUpSpeed = $('.speed-show').eq(0).val();
			var maxDownSpeed = $('.speed-show').eq(1).val();
			if(nasid==""){
				msg('请输入设备nasid',false);
				$('.btn-sureAdd').attr("disabled", false); 
				return ;
			}
			if(macAddress==""){
				msg('请输入设备安装地址',false);
				$('.btn-sureAdd').attr("disabled", false); 
				return ;
			}
			if(maxUpSpeed==""||maxDownSpeed==""){
				msg('上传与下载限速不能为空',false);
				$('.btn-sureAdd').attr("disabled", false); 
				return ;
			}
			if($('.requiment-list .rl-name span').eq(0).text()=='修改设备'){
				updateDevice(nasid,macAddress,maxUpSpeed,maxDownSpeed,siteId);
			}else{
				if(secretKey==""){
					msg('请输入设备密匙',false);
					$('.btn-sureAdd').attr("disabled", false); 
					return ;
				}
				addDecive(nasid,"",macAddress,"1.0.0.0.0",secretKey,maxUpSpeed,maxDownSpeed,siteId,"h3c");
			}
		}else if("moto"==type){
			var nasid = $('.moto_nsid').val();
			var macAddress = $('.moto_dvAds').val();
			var maxUpSpeed = $('.speed-show').eq(0).val();
			var maxDownSpeed = $('.speed-show').eq(1).val();
			if(nasid==""){
				msg('请输入设备nasid',false);
				$('.btn-sureAdd').attr("disabled", false); 
				return ;
			}
			if(macAddress==""){
				msg('请输入设备安装地址',false);
				$('.btn-sureAdd').attr("disabled", false); 
				return ;
			}
			if(maxUpSpeed==""||maxDownSpeed==""){
				msg('上传与下载限速不能为空',false);
				$('.btn-sureAdd').attr("disabled", false); 
				return ;
			}
			if($('.requiment-list .rl-name span').eq(0).text()=='修改设备'){
				updateDevice(nasid,macAddress,maxUpSpeed,maxDownSpeed,siteId);
			}else{
				if(secretKey==""){
					msg('请输入设备密匙',false);
					$('.btn-sureAdd').attr("disabled", false); 
					return ;
				}
				addDecive(nasid,"",macAddress,"1.0.0.0.0",secretKey,maxUpSpeed,maxDownSpeed,siteId,"moto");
			}
		}else if("dunchong"==type){
			var nasid = $('.dunchong_nsid').val();
			var macAddress = $('.dunchong_dvAds').val();
			var maxUpSpeed = $('.speed-show').eq(0).val();
			var maxDownSpeed = $('.speed-show').eq(1).val();
			if(nasid==""){
				msg('请输入设备nasid',false);
				$('.btn-sureAdd').attr("disabled", false); 
				return ;
			}
			if(macAddress==""){
				msg('请输入设备安装地址',false);
				$('.btn-sureAdd').attr("disabled", false); 
				return ;
			}
			if(maxUpSpeed==""||maxDownSpeed==""){
				msg('上传与下载限速不能为空',false);
				$('.btn-sureAdd').attr("disabled", false); 
				return ;
			}
			if($('.requiment-list .rl-name span').eq(0).text()=='修改设备'){
				updateDevice(nasid,macAddress,maxUpSpeed,maxDownSpeed,siteId);
			}else{
				if(secretKey==""){
					msg('请输入设备密匙',false);
					$('.btn-sureAdd').attr("disabled", false); 
					return ;
				}
				addDecive(nasid,"",macAddress,"1.0.0.0.0",secretKey,maxUpSpeed,maxDownSpeed,siteId,"dunchong");
			}
		}else{
			var reg = /^(((13[0-9]{1})|(14[4-7]{1})|(15[0-9]{1})|(170)|(17[1-8]{1})|(18[0-9]{1}))+\d{8})$/;
			var emreg =  /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
			var deviceType = $('#deviceType').val();
			var version = $('#version').val();
			var nameline = $('#nameline').val();
			var telephone = $('#telephone').val();
			var email = $('#email').val();
			if(deviceType==""){
				msg('请输入设备名称',false);
				$('.btn-sureAdd').attr("disabled", false); 
				return ;
			}
			if(version==""){
				msg('请输入设备版本号',false);
				$('.btn-sureAdd').attr("disabled", false); 
				return ;
			}
			if(nameline==""){
				msg('请输入联系人姓名',false);
				$('.btn-sureAdd').attr("disabled", false); 
				return ;
			}
			if(telephone==""){
				msg('请输入联系人电话',false);
				$('.btn-sureAdd').attr("disabled", false); 
				return ;
			}
			if(!reg.test(telephone)){
				msg('联系人电话格式不正确',false);
				$('.btn-sureAdd').attr("disabled", false); 
				return ;
			}
			if(email==""){
				msg('请输入联系人邮箱',false);
				$('.btn-sureAdd').attr("disabled", false); 
				return ;
			}
			if(!emreg.test(email)){
				msg('联系人邮箱不正确',false);
				$('.btn-sureAdd').attr("disabled", false); 
				return ;
			}
			$.ajax({
				type : 'post',
				url : ctx + "/CloudSiteManage/sendEmailToOur",
				data : {
					deviceType :deviceType,
					version : version,
					nameline : nameline,
					telephone : telephone,
					email : email,
				},
				success : function(data) {
					data = JSON.parse(data);
					if (data.code == 200) {
						 $('.barcontainer').css('display', 'none');
						msg("已通知到我们的技术人员,请等待",true);
					} else {
						msg("网络异常,请稍后",false);
						return;
					}
				}
			});
		}
	});
}
/**
 * 添加设备
 * @param nasid
 * @param mac
 * @param macAddress
 * @param ip
 * @param secretKey
 * @param maxUpSpeed
 * @param maxDownSpeed
 * @param siteId
 * @param routerType
 */
function addDecive(nasid,mac,macAddress,ip,secretKey,maxUpSpeed,maxDownSpeed,siteId,routerType){
	$.ajax({
		type : 'post',
		url : ctx + "/CloudSiteManage/addDevice",
		data : {
			nasid : nasid,
			mac : mac,
			macAddress : macAddress,
			ip : ip,
			secretKey :secretKey,
			maxUpSpeed :maxUpSpeed,
			maxDownSpeed : maxDownSpeed,
			siteId : siteId,
			routerType : routerType
		},
		success : function(data) {
			if(data=="loseSession"){
				 window.location.href=ctx+"/toLogin";
				 return;
			}	
			data = JSON.parse(data);
			if (data.code == 200) {
				$('.requiment-list').css('display','none');
				//Z直接去设备详情页D
				getDeviceTotalPages(siteId,10);
				getAClist(siteId,1)
				getSiteList(1);
			    getTotalPage();
				$('.mask').css('display','block');
		        $('.AC_info_cont').css('display','block').animate({'right':'0px'});
				msg("设备添加成功",true);
			} else {
				msg(data.msg,false);
				return;
			}
		}
	});
}
//认证方式，状态展示
function pAuthList(){
	$.ajax({
		type: 'post',
		url: ctx+'/CloudSiteManage/pAuthList',
		data: {},
		success: function(data){
			eval("data="+data);
			var authHtml = "";
			if(data.data.length > 0){
                    authHtml += '<select id="authStatuss" name="authenticationStatus">'
				for (var i = 0; i < data.data.length; i++) {
					authHtml += '<option value='+data.data[i].id+'>' + data.data[i].name +'</option>';
				}
                     authHtml += '</select>';
				$('#authStatus').html(authHtml);
			 }
			$('#authStatuss').change(function () {
				var authStates=document.getElementById("authStatuss");
				var selected_val = authStates.options[authStates.selectedIndex].value;
				if(selected_val == "7"){
					appInfoList();
				}
			})
			}
		})
}
function appInfoList(){
	$.ajax({
		type: 'post',
		url: ctx+'/CloudSiteManage/findAppInfo',
		data: {},
		success: function(data){
			eval("data="+data);
			var authHtml = "";
			var appIList = data.data;
			if(data.code ==  200){
				authHtml += '<span style="margin-left: -5px;">请选择APP&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><select id="app_select"><option>全部</option>'
					for (var i = 0; i < appIList.length; i++) {
						authHtml += '<option value='+appIList[i].id+'>' + appIList[i].appName +'</option>';
					}
				authHtml += '<option value="0">自定义</option></select>';
				$('#APPselect').html(authHtml);
				$("#app_select").change(function(){
					var authStates=document.getElementById("app_select");
					var selected_val = authStates.options[authStates.selectedIndex].text;
					if(selected_val=="自定义"){
						$("#ident").show();
					}else{
						$("#ident").hide();
					}
				});
			}
		}
	})
}
function findeAuth(siteId){
	$.ajax({
		type: 'post',
		url: ctx+'/CloudSiteManage/findAuth',
		data: {siteId:siteId},
		success: function(data){
			eval("data="+data);
			$("#authStatuss").find("option[value='"+data.msg+"']").attr("selected",true); 
			if(data.msg == "7"){//APP展示
				appInfoList();
			}
		}
	})
}
/**
 * 更改设备
 * @param nasid
 * @param macAddress
 * @param maxUpSpeed
 * @param maxDownSpeed
 */
function updateDevice(nasid,macAddress,maxUpSpeed,maxDownSpeed,siteId){
	$.ajax({
		type : 'post',
		url : ctx + "/CloudSiteManage/updateDevice",
		data : {
			nasid : nasid,
			macAddress : macAddress,
			maxUpSpeed :maxUpSpeed,
			maxDownSpeed : maxDownSpeed,
		},
		success : function(data) {
			if(data=="loseSession"){
				 window.location.href=ctx+"/toLogin";
				 return;
			}	
			if(data=="loseSession"){
				window.location.href=ctx+"/toLogin";
				return;
			}	
			data = JSON.parse(data);
			if (data.code == 200) {
				$('.requiment-list').css('display','none');
				//Z直接去设备详情页D
				getDeviceTotalPages(siteId,10);
				getAClist(siteId,1)
				$('.mask').css('display','block');
		        $('.AC_info_cont').css('display','block').animate({'right':'0px'});
				msg("设备更新成功",true);
			} else {
				msg(data.msg,false);
				return;
			}
		}
	});
}

/**
 * 下载配置文件
 * @param wanPort--wan 口
 * @param lanPort LAN 口
 * @param nasid 
 * @param secret
 */
function downloadConfig(){
	$('.down-config').click(function(){
	 var wanPort = $('#wankou').val();
	 var lanPort = $('#lankou').val();
	 var nasid = $('.RouterOS_nsid').val();
	 var secretKey = $('.nas-code').eq(0).text();
	 if(secretKey==""){
			msg('设备密匙不存在',false);
			$('.btn-sureAdd').attr("disabled", false); 
			return ;
		}
	 if(nasid==""){
			msg('设备nasid不存在',false);
			$('.btn-sureAdd').attr("disabled", false); 
			return ;
		}
	 window.location.href=ctx+"/CloudSiteManage/downloadRosConfig?wanPort="+wanPort+"&lanPort="+lanPort+"&nasid="+nasid+"&secret="+secretKey;
	});
}
 //插入对应APP认证相关信息
function insertAppInfo(){
	$.ajax({
		type : 'post',
		url : ctx + "/CloudSiteManage/insertAppInfo",
		data : {
			siteId : siteId,
			appName : appName,
			appId :appId,
			appSecretKey : appSecretKey
		},
		success : function(data) {
			
			}
		})
}
/**
 * 下载白名单
 */
function downloadWhileList(){
	try {
		 window.location.href= ctx+"/CloudSiteManage/downloadWhileList";
	} catch (e) {
		msg('下载配置文件失败',false);
	}
}

