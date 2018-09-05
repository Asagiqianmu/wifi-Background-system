/**
 * Created by Administrator on 2016/9/28.
 */
(function () {
    //展开收起左侧菜单
    $('.module').click(function(){
        shouzhan();
    });
    $('.incline').click(function(){
        shouzhan();
    });
    checkAgentName();
    
    getList(1);
    
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

    $('body').click(function(){
        $('.costType > ul').css('display','none');
    });
 
    // 点击下拉框
    var seleType = $('.seleType');
    var costTypeUl = $('.costType > ul');
    var costTypeLi = $('.costType > ul > li');
    var index;
    seleType.unbind('click')
    seleType.click(function(){
        var nn = seleType.index(this);
        index = nn;
        costTypeUl.eq(nn).css('display','block');
        return false;
    });
    costTypeLi.unbind('click');
    costTypeLi.click(function(){
        var nnd = costTypeLi.index(this);
        var str = costTypeLi.eq(nnd).text();
        seleType.eq(index).text(str);
        costTypeUl.css('display','none');
    });
    costTypeUl.unbind('click');
    costTypeUl.click(function(){
        return false;
    });
    
    $('.chorseType>li').click(function(){
    	var n = $('.chorseType>li').index(this);
    	 var type = $('.chorseType>li').eq(n).attr('paytype');
    	 var typeText = $('.chorseType>li').eq(n).text();
    	 $('#payMode').attr('payty',type)
    	  $('#payMode').text(typeText);
    });
    

    // 点击导出excel表按钮
  /*  $('#exportExcel').click(function () {
    	var siteid = $("#place").attr('siteid');
    	var username = $("#userId").val();
    	var paytype = $("#payMode").attr('payty');
    	var stime = $("#startAt").val();
    	var etime = $("#endAt").val();
    	window.location.href=ctx+'/SettlementRatio/exportIncomeByType?';
    })*/

})();
 

function getList(currentPage){
	// 点击查询按钮

    $('#queryBtn').unbind('click')
    $('#queryBtn').click(function () {
    	$('#queryBtn').attr("disabled",true).css('background-color','#CCCCCC');
    	setTimeout(function(){
    		$('#queryBtn').attr("disabled",false).css('background-color','#57C6D4');
    	}, 5000);
		$('#tbList >tr').remove();
		$('#pages').empty();
    	var siteid = $('#place').attr('siteid');
    	if(siteid==undefined){
    		var siteid = $('.sitelist>li').eq(0).attr('siteid');
    		if(siteid==undefined){
    			$(".win>span").html("代理商暂未开通场所");
    			winHint();
    			return;
    		}else{
    			$(".win>span").html("请选择要查询的场所");
    			winHint();
    			return;
    		}
    	}
    	
    	
        /* 生成列表开始 */
        /* 列表ajax */
    	if($('#place').text()=='请选择'){
    		$(".win>span").html("请选择要查询的场所");
			winHint();
			return;
    	}else{
    		 var stime = $('#startAt').val();
    		 var etime = $('#endAt').val();
    		 if(stime==''||etime==""){
    			 $(".win>span").html("请输入查询时间");
					 winHint();
    			 return ;
    		 }
    		 var sdate = new Date(stime);
    		 var edate = new Date(etime);
    		 var between = edate.getTime()-sdate.getTime();
    		 if(parseInt(between)>parseInt(31*24*60*60*1000)){
    			 $(".win>span").html("时间查询不能大于31天");
					 winHint();
    			 return ;
    		 }else{
    			 getListPage(currentPage);
    			 getListTotal();
    		 }
    		/* 列表ajax */
    	}
    });
}

function getListPage(currentPage){
	var siteid = $("#place").attr('siteid');
	var username = $("#userId").val();
	var paytype = $("#payMode").attr('payty');
	var stime = $("#startAt").val();
	var etime = $("#endAt").val();
	 $.ajax({
         type:'POST',
         url:ctx+"/SettlementRatio/getIncomeByType",
         data : {
        	 siteId:siteid,
        	 username:username,
        	 paytype:paytype,
        	 startTime:stime,
        	 endTime:etime,
        	 curpage:currentPage
         },
         success: function(data){
        	 eval('data='+data);
        	/* $('.sitelist>li').remove();*/
        	 $('#tbList >tr').remove();
             /* 生成列表开始 */
             var html = '';
             //生成列表
             if(data.code==201){
            	  $(".win>span").html("暂无数据");
     			  winHint();
     			  $('#ku').hide();
            	  $('.excelBox').css('display','none');
            	  $('#tbList').html("");
            	  $('#tbList >tr').remove();
            	  $('#pages').empty();
             }else{
            	 $('.excelBox').css('display','block');
            	  $('#ku').hide();
                  $('#tableBox').show();
            	 for(var i=0;i<data.data.length;i++){
            		 html += '<tr>'+
            		 '<td>'+data.data[i].user_name+'</td>'+
            		 '<td>'+data.data[i].site_name+'</td>'+
            		 '<td>'+data.data[i].param_json+'</td>'+
            		 '<td>'+(data.data[i].pay_type==1?'支付宝':(data.data[i].pay_type==2?'京东':'微信'))+'</td>'+
            		 '<td>'+data.data[i].finish_time+'</td>'+
            		 '</tr>';
            	 }
            	 $('#tbList').html(html);
            	 $('#exportExcel').click(function () {
            		 $('#exportExcel').attr("disabled",true).css('background-color','#CCCCCC');
        	    	 setTimeout(function(){
        	    		$('#exportExcel').attr("disabled",false).css('background-color','#57C6D4');
        	    	 }, 5000);
            	     window.location.href=ctx+'/SettlementRatio/exportIncomeByType?siteId='+siteid+'&username='+username+'&paytype='+paytype+'&startTime='+stime+'&endTime='+etime;
            	 })
             }
			}
		});
}

    function getListTotal(currentPage){
		var siteid = $("#place").attr('siteid');
		var username = $("#userId").val();
		var paytype = $("#payMode").attr('payty');
		var stime = $("#startAt").val();
		var etime = $("#endAt").val();
	    $.ajax({
		type : 'POST',
		url : ctx + "/SettlementRatio/getIncomeByTypePage",
		data : {
			siteId : siteid,
			username : username,
			paytype : paytype,
			startTime : stime,
			endTime : etime,
		},
		success : function(data) {
			eval('data=' + data);
			// 分页
			if(data.code!=201&&data.data!=0){
				pages(data.data);
			}
		}
	});
}

var clearTime;
function checkAgentName(){
	$("#agent").keydown(function(){
		clearTimeout(clearTime);
		clearTime = setTimeout(function(){
			var agentname = $.trim($("#agent").val());
			var pattern = /^1[34578]\d{9}$/;
			if(pattern.test(agentname)){
				 getCloudSiteByName(agentname);
				 $('#place').text('请选择')
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
	 $('#tbList >tr').remove();
	 $('.excelBox').css('display','none');
	 $('#pages').empty();
	$.ajax({
		type:'post',
		data:{
			username:username
		},
		url:ctx+"/SettlementRatio/getCloudSiteByName",
		success:function(data){
			eval("data="+data)
			if(data.code==200){
				var htmls = "";
				for (var i = 0; i < data.data.length; i++) {
					htmls+="<li siteid='"+data.data[i].id+"'>"+data.data[i].site_name+"</li>";
				}
				$('.sitelist').html(htmls);
				getTotaldate();
			}else{
				$(".win>span").html("代理商暂未开通场所");
				winHint();
			    $('.sitelist>li').remove();
				return;
			}
		},
		error:function(){
			$(".win>span").html("网络繁忙请稍后");
			winHint();
		}
	});
}
function getTotaldate(){
	$('.sitelist>li').click(function(){
		var n = $('.sitelist>li').index(this);
		var siteid = $('.sitelist>li').eq(n).attr("siteid");
	    var sitename = $('.sitelist>li').eq(n).text();
	    $('#placeDown >.seleType').text(sitename);
	    $('.sitelist').css('display','none');
	    $('.seleType').attr('siteid',siteid);
	});
}
/* 分页
 * total 总页数
 * backFn 回调函数，获取当前第几页
 */
function pages(total) {

    var pages = document.getElementById('pages');
    pages.innerHTML = '<div class="MyPage">'+
        '<span id="firstPage" class="pageBtn font-w pagePointer mgn-5">首页</span>'+
        '<span id="prePage" class="pageBtn font-w pagePointer mgn-5"><img src="/cloud/allstyle/finance/img/pre.png"></span>'+
        '<span class="mgn-5"><span id="currentPage" class="font-b">1</span>/<span id="totalPage">8</span></span>'+
        '<span id="nextPage" class="pageBtn font-w pagePointer mgn-5"><img src="/cloud/allstyle/finance/img/next.png"></span>'+
        '<span id="lastPage" class="pageBtn font-w pagePointer mgn-5">尾页</span>'+
        '<input id="numPage" class="pageNum mgn-5" type="number"/>'+
        '<span id="jumpPage" class="pageBtn font-w pagePointer mgn-5">跳转</span>'+
        '</div>';



    var cPage = document.getElementById('currentPage');
    var firstPage = document.getElementById('firstPage');
    var prePage = document.getElementById('prePage');
    var nextPage = document.getElementById('nextPage');
    var lastPage = document.getElementById('lastPage');
    var numPage = document.getElementById('numPage');
    var jumpPage = document.getElementById('jumpPage');
    var totalPage = document.getElementById('totalPage');

    totalPage.textContent = total;

    isFirstPage();
    isLastPage();

    // 首页
    firstPage.onclick = function () {
        lastPage.style.display = 'inline';
        nextPage.style.display = 'inline';
        cPage.textContent = 1;
        isFirstPage();
        // 回调方法
        getListPage(cPage.textContent)
    };

    // 尾页
    lastPage.onclick = function () {
        cPage.textContent = totalPage.textContent;
        firstPage.style.display = 'inline';
        prePage.style.display = 'inline';
        isLastPage();
        // 回调方法
        getListPage(cPage.textContent)
    };


    // 下一页
    nextPage.onclick = function () {
        firstPage.style.display = 'inline';
        prePage.style.display = 'inline';
        cPage.textContent = +cPage.textContent +1;
        isLastPage();

        // 回调方法
        getListPage(cPage.textContent)
    };

    // 上一页
    prePage.onclick = function () {
        lastPage.style.display = 'inline';
        nextPage.style.display = 'inline';
        cPage.textContent = +cPage.textContent -1;
        isFirstPage();

        // 回调方法
        getListPage(cPage.textContent)
    };

    // 跳转到第几页
    jumpPage.onclick = function () {
        // console.log(numPage.value);
        var num = +numPage.value;
        if (num >= 1 && num <= +totalPage.textContent && parseInt(num)===num) {
            cPage.textContent = num;
            lastPage.style.display = 'inline';
            nextPage.style.display = 'inline';
            firstPage.style.display = 'inline';
            prePage.style.display = 'inline';
            isFirstPage();
            isLastPage();

            // 回调方法
            getListPage(cPage.textContent)
        }

    };

    // 判断是否是第一页
    function isFirstPage() {
        if (cPage.textContent === '1' ) {
            firstPage.style.display = 'none';
            prePage.style.display = 'none';
        }
    }

    // 判断是否是最后一页
    function isLastPage() {
        if (cPage.textContent === totalPage.textContent) {
            lastPage.style.display = 'none';
            nextPage.style.display = 'none';
        }

    }
}
function win(){
	$('.win').css('display','block').fadeOut(3000);
};
function winHint(){
	$('.win').css('display','block').fadeOut(2000);
};