/**
 * 商家管理js
 */

$(function() {
	// 左侧菜单中"店铺管理"为选中状态
	$('#store').addClass("active");
	
	// 创建店铺按钮点击，跳转进创建店铺页面
	$(".toCreateStoreBtn").click(function() {
		$.ajax({
	        type: "POST",
	        url: ctx + "/store/checkIsCanCreateStore",
	        success: function(msg){
	        	if(msg=="true"){
	        		window.location.href = ctx + "/store/goCreateStore";
	        	}else {
	        		toastr.error("您有一个店铺没有设备，所以不能创建新店铺！");
	        	}
	        },
	        error : function() {
	        	changeToError(1);
	        	toastr.error('提交失败！');
			}
	    });
	});
	
	getStoreList(1);
	
	
});

/**
 * 加载店铺列表
 */
function getStoreList(num){
	if(num==undefined)return;
	if(isNaN(num))return;
	showLoading();
	$.ajax({
        type: "POST",
        url: "storeList",
        data: {
        	comefrom:"js",
        	curPage:num,
        	pageSize:6
        },
        success: function(data){
        	changeToSuccess(1);
        	eval("data = " + data);
        	if(data.code==200){
        		if(data.data.totalPages){
        			//引导页
        			
        		}
        		//调用分页
				pageHandle("pager","storeList",data.data,num,getStoreList,buildTable);
        	}else {
        		toastr.error(data.msg);
        	}
        },
        error : function() {
        	changeToError(1);
        	toastr.error('提交失败！');
		}
    });
}
/**
 * 生成店铺列表table
 * @param data
 * @param tableId
 */
function buildTable(data,tableId){
	var table="";
	data=data.data;
	for(var i=0;i<data.length;i++){
		table+= "<div class='plan-container' id='"+data[i].id+"'>"+
		"<div class='plan "+(data[i].status==1?'red':(data[i].status==2?'blue':(data[i].status==3?'':'orange')))+"'>"+
			"<div class='plan-header'>"+
				"<div class='plan-title' >"+
				data[i].name+"<span class='pull-right'><a href='javascript:;'"+
						"style='color: white;' class='toSettingBtn'><i "+
							"class='icon-cog'></i></a></span>"+
				"</div>"+
				"<div class='plan-price' >"+
					"<span class='note'>@</span>"+data[i].num+"<span class='term'>在线人数</span>"+
				"</div>"+
			"</div>"+
			"<div class='plan-features'>"+
				"<ul>"+
					"<li><strong>今日人气</strong>&nbsp;&nbsp;"+data[i].pv+"</li>"+
					"<li><strong>"+data[i].routerNum+"&nbsp;</strong> 台设备</li>"+
					"<li><strong>类型</strong>&nbsp;&nbsp;"+data[i].type+"</li>"+
					"<li><strong>电话</strong>&nbsp;&nbsp;"+data[i].tele+"</li>"+
					"<li><strong >地址</strong>&nbsp;&nbsp; "+subStr(data[i].address)+"</li>"+
				"</ul>"+
			"</div>"+
			"<div class='plan-actions'>"+
				"<a href='javascript:;' class='btn manageStoreBtn'>管理店铺</a>"+
			"</div>"+
		"</div>"+
	"</div>";
	}
	$("#"+tableId).html(table);
	setTimeout('loadBtn();',1000);
}

function subStr(str){
	if(str.length<11){return str;}
	return "<span data-toggle='tooltip' class='tooltipMsg' title='"+str+"'>"+ str.substring(0,8)+"..."+"</span>";
}

function loadBtn(){

	// "管理店铺"按钮的click事件
	$(".manageStoreBtn").each(function() {
		var id = $(this).parents(".plan-container").attr("id");
		$(this).click(function() {
			//window.location.href = "/merchant/store/sOperate.jsp?id=" + id;
//			window.location.href = "gosauth/"+id;
			window.location.href = "../collect/goCollect/"+id;
			
		});
	});

	// "设置图标"的click事件
	$(".toSettingBtn").each(function() {
		var id = $(this).parents(".plan-container").attr("id");
		$(this).click(function() {
			window.location.href = "goupdateStore/" + id;
		});
	});
	
	$('.tooltipMsg').tooltip();
	
}














