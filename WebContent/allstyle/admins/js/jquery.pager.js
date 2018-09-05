
(function($) {

    $.fn.pager = function(options) {

        var opts = $.extend({}, $.fn.pager.defaults, options);

        return this.each(function() {

        // empty out the destination element and then render out the pager with the supplied options
            $(this).empty().append(renderpager(parseInt(options.pagenumber), parseInt(options.pagecount),parseInt(options.recordStart),parseInt(options.recordEnd), options.buttonClickCallback));
            
            // specify correct cursor activity
//            $('.pages li').mouseover(function() { document.body.style.cursor = "pointer"; }).mouseout(function() { document.body.style.cursor = "auto"; });
        });
    };

    // render and return the pager with the supplied options
    function renderpager(pagenumber, pagecount,recordStart,recordEnd, buttonClickCallback) {
    	if(pagenumber>pagecount)pagenumber=pagecount;
    	if(pagenumber<2)pagenumber=1;
    	if(recordStart<2)recordStart=1;
    	
    	
    	var $pager = $("<ul style='box-shadow:0px;'></ul>");
    	var fronter=$("<li></li>");//上一页
    	if(pagenumber==1){
    		fronter.append($("<a href='javascript:void(0);'>&lt;</a>"));
    	}else {
    			fronter.append(renderButton((pagenumber - 1),"&lt;",buttonClickCallback));
    	}
    	fronter.appendTo($pager);
    	
    	if(recordStart > 1){
//    		$pager.append($("<li><a href='javascript:void(0);'>...</a></li>"));
    		$pager.append($("<li></li>").append(renderButton(recordStart-1,"...",buttonClickCallback)));
    	}
    	
    	for (var i = recordStart; i <= recordEnd; i++) {
    		var currentButten;
			if (pagenumber == i) {
				currentButten=$("<li class='active'></li>");
				currentButten.append(renderButton(i,i,buttonClickCallback));
			} else {
				currentButten=$("<li></li>");
				currentButten.append(renderButton(i,i,buttonClickCallback));
			}
			currentButten.appendTo($pager);
		}
    	
    	if (recordEnd < pagecount) {
//			$("<li><a href='javascript:void(0);'>...</a></li>").appendTo($pager);
    		$pager.append($("<li></li>").append(renderButton(recordEnd+1,"...",buttonClickCallback)));
		}
    	
    	if(pagenumber==pagecount){
    		$("<li></li>").append($("<a href='javascript:void(0);'>&gt;</a>")).appendTo($pager);
    	}else{
    		if (pagecount>recordEnd) {
    			$("<li></li>").append(renderButton(pagecount,pagecount,buttonClickCallback)).appendTo($pager);
			}
    		$("<li></li>").append(renderButton((parseInt(pagenumber) + parseInt(1)),"&gt;",buttonClickCallback)).appendTo($pager);
    	}
		
    	$("<li></li>").append($("<div class='input-append'></div>")
    	.append($("<input type='text' id='txt223' class='span5' value=" + pagenumber + ">"))
		.append(renderDIVButton(pagecount,buttonClickCallback)))
		.appendTo($pager);
    	return $pager;
    }
    
    function renderButton(num,value,buttonClickCallback){
    	var $Button =$("<a href='javascript:void(0);'>"+value+"</a>");
    	$Button.click(function() { buttonClickCallback(num); });
    	return $Button;
    }
    
    function renderDIVButton(pagecount,buttonClickCallback){
    	var $Button =$("<span class='add-on' style='cursor:pointer;'>查看</span>");
    	$Button.click(function() { 
	    		if(parseInt($('#txt223').val())>pagecount){
	    			toastr.warning("亲，您输入的页数大于总页数了！");
	    			return;
	    		}
	    		buttonClickCallback($('#txt223').val()); 
    		});
    	return $Button;
    }


    // pager defaults. hardly worth bothering with in this case but used as placeholder for expansion in the next version
    $.fn.pager.defaults = {
        pagenumber: 1,
        pagecount: 1,
        recordStart:1,
        recordEnd:1
    };

})(jQuery);

function pageHandle(divId,tableId,data,curPage,selfFunc,showTableFunc){
	if(data==null||data==undefined||data==""||data.data==undefined||data.data.length==0){
		var tdL=$("#"+tableId).parent().find("thead").find("tr").children().length;
		$("#"+tableId).html("<tr><td style='text-align:center;'  colspan='"+tdL+"'>没有获取到数据</td></tr>");
		$("#"+divId).html("");
		return;
	}
//	生成table并回显到页面
	if(showTableFunc==undefined){
		showDefultTable(data,tableId);
	}else{
		showTableFunc(data,tableId);
	}
	var totalPages=data.totalPages;//ajax get from server
	var recordStart=data.recordStart;
	var recordEnd=data.recordEnd;
	//生成分页条
//	fenyeTab(divId,curPage,totalPages,recordStart,recordEnd,selfFunc);
	$("#"+divId).pager({ pagenumber: curPage, pagecount: totalPages,recordStart:recordStart,recordEnd:recordEnd, buttonClickCallback: function(pageclickednumber) {
		selfFunc(pageclickednumber);
	} });
}	
//生成查询的缴费表格
function pageHandleCustomerPay(divId,tableId,data,curPage,selfFunc,showTableFunc){
	if(data==null||data==undefined||data==""||data.data==undefined||data.data.length==0){
		var tdL=$("#"+tableId).parent().find("thead").find("tr").children().length;
		$("#"+tableId).html("<tr><td style='text-align:center;'  colspan='"+tdL+"'>该用户不存在，是否需要&nbsp;&nbsp;&nbsp;&nbsp;<button  class='btn btn-primary  btn-mini dropdown-toggle' onclick='RegistClick()'>注册</button></td></tr>");
		$("#"+divId).html("");
		return;
	}
//	生成table并回显到页面
	if(showTableFunc==undefined){
		showDefultTable(data,tableId);
	}else{
		showTableFunc(data,tableId);
	}
}	
//在不同场所进行缴费
function HandleCustomerPay(divId,tableId,data,curPage,selfFunc,showTableFunc,siteId){
	
//	生成table并回显到页面
	if(showTableFunc==undefined){
		showDefultTable(data,tableId);
	}else{
		showTableFunc(data,tableId);
	}
}	