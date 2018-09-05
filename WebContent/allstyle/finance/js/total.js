/**
 * Created by Administrator on 2016/9/22.
 */
(function () {
	
	/* 开关 */
	$('.swicth').click(function(){
		var str = $(this).attr('class');
		if(str=='swicth d'){
				$(this).attr('class','swicth m');
			$(this).children().animate({left:'1px'},80);
		}else{
				$(this).attr('class','swicth d');
			$(this).children().animate({left:'23px'},80);
		}
	});
	/* 开关 */
	
	// 退出按钮
	$('.menu > li.exit').click(function(){
		window.location.href=ctx+"/logOut";
	});
	
	//getTotal();
	checkAgentName();
	//选择框
	  var seleType = $('.seleType');
      var costTypeUl = $('.sitelist');
      var costTypeLi = $('.sitelist > li');
      
      
      seleType.unbind('click')
      seleType.click(function(){
          var nn = seleType.index(this);
          costTypeUl.eq(nn).css('display','block');
          return false;
      });
      costTypeLi.unbind('click');
      costTypeLi.click(function(){
          var nnd = costTypeLi.index(this);
          console.log(nnd);
          var str = costTypeLi.eq(nnd).text();
          console.log(str);
          seleType.text(str);
          costTypeUl.css('display','none');

          console.log(seleType.text())
      });
      costTypeUl.unbind('click');
      costTypeUl.click(function(){
          return false;
      });
      /* 选择费用类型 */

      $('body').click(function(){
          costTypeUl.css('display','none');
      });
	

    //展开收起左侧菜单
    $('.module').click(function(){
        shouzhan();
    });
    $('.incline').click(function(){
        shouzhan();
    });
   
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
    // 查询一个时间段内的总收入
    $('#history').click(function () {
    	var siteid = $('.seleType').attr('siteid');
    	var startTime = $('#startAt').val();
    	var endTime = $('#endAt').val();
    	if((siteid==undefined||siteid=='')&&$('.seleType').text()!='查看全部'){
    		$(".win>span").html("请先选择场所");
			winHint();
    		return;
    	}else{
    		if(startTime==''||endTime==''){
    			$(".win>span").html("请输入查询时间");
    			winHint();
        		return ;
        	}
    		if($('.seleType').text()=='查看全部'){
    			var agentName = $('#agentname').val();
    			if(agentName==''){
    				$(".win>span").html("请填入商户名");
    				winHint();
    	    		return;
    			}
    			getTotal(-2,agentName,startTime,endTime)
    		}else{
    			getTotal(siteid,agentName,startTime,endTime)
    		}
    	}
    })
    
     $('#zhuanhua').click(function () {
    	     var siteid = $('.seleType').attr('siteid');
    		 var agentname = $('#agentname').val();
    		 var end = $("#endAt3").val();
    		 var start = $("#startAt3").val();
    		 if(agentname==""){
    			 $(".win>span").html("请输入代理商账号");
    				winHint();
    	    		return;
    		 }
    		 if(start==""||end==""){
    			 $(".win>span").html("请输入查询时间");
    				winHint();
    	    		return;
    		 }
    	getOtherBili(agentname,start,end)
    })
    
})();

function getTotaldate(){
	$('.sitelist>li').click(function(){
		var n = $('.sitelist>li').index(this);
		var siteid = $('.sitelist>li').eq(n).attr("siteid");
	    var sitename = $('.sitelist>li').eq(n).text();
	    $('.seleType').text(sitename);
	    $('.sitelist').css('display','none');
	    $('.seleType').attr('siteid',siteid);
		//getTotal(siteid);
	});
}


var clearTime;
function checkAgentName(){
	$("#agentname").keydown(function(){
		clearTimeout(clearTime);
		clearTime = setTimeout(function(){
			var agentname = $.trim($("#agentname").val());
			var pattern = /^1[34578]\d{9}$/;
			if(pattern.test(agentname)){
				 $('.seleType').removeAttr('siteid');
				 $('.seleType').text("请选择");
				 getCloudSiteByName(agentname);
			}else{
				if(agentname.length==11){
					$(".win>span").html("请输入正确的手机号");
					winHint();
					return;
				}
			}
		},1000);
	});
}
/**
 * 根据代理商账号获得所有的场所
 * @param username
 */
function getCloudSiteByName(username){
	$('.sitelist>li').remove();
	$.ajax({
		type:'post',
		data:{
			username:username
		},
		url:ctx+"/SettlementRatio/getCloudSiteByName",
		success:function(data){
			eval("data="+data)
			if(data.code==200){
				var htmls = "<li>查看全部</li>";
				for (var i = 0; i < data.data.length; i++) {
					htmls+="<li siteid='"+data.data[i].id+"'>"+data.data[i].site_name+"</li>";
				}
				$('.sitelist').html(htmls);
				$('.sitelist').css('display','block');
				getTotaldate();
			}else{
				$(".win>span").html("代理商暂未开通场所");
				winHint();
				return;
			}
		},
		error:function(){
			$(".win>span").html("网络繁忙请稍后");
			winHint();
		}
	});
}
function getTotal(siteid,agentName,startTime,endTime){
 $.ajax({
    	type:"post",
    	url:ctx+"/SettlementRatio/getYesTodincome",
    	data:{
    		siteId:siteid,
    		agentName:agentName,
    		startTime:startTime,
    		endTime:endTime
    	},
    	success:function(data){
    		if(data=="loseSession"){
				 window.location.href=ctx+"/toLogin";
				 return;
			}	
    		 eval("data="+data)
			// 线下收入
		    $('#offincome').text(data.data.off);
		    // 今天收入
		    $('#lineincome').text(data.data.line);
		    // 总收入
		    $('#total').text(data.data.total);
    	}
    });
}


function getOtherBili(username,startTime,endTime){
	$.ajax({
    	type:"post",
    	url:ctx+"/SettlementRatio/getOtherBili",
    	data:{
    		username:username,
    		startTime:startTime,
    		endTime:endTime
    	},
    	success:function(data){
    		if(data=="loseSession"){
				 window.location.href=ctx+"/toLogin";
				 return;
			}	
    		 eval("data="+data)
		     $('.show-num3').eq(0).text(data.data[1].uvbili);
    		 $('.show-num3').eq(1).text(data.data[1].payBili);
    		 $('.show-num3').eq(3).text(data.data[0].count);
    		 $('.show-num3').eq(2).text(data.data[0].suma);
    	}
    });
}
 
function win(){
	$('.win').css('display','block').fadeOut(3000);
};
function winHint(){
	$('.win').css('display','block').fadeOut(2000);
};