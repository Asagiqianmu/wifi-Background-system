/**
*微信连WIFI管理界面需要的js
*
**/


$(function() {
	// --------------------左侧菜单---------------------------//
	$("#webManage").addClass("active");
	var flag = 1;
	$("#webManage").css("margin-bottom", "0px");
	$("#webManage").find("a").css("border-radius", "5px 5px 0px 0px");
	$("#webManage").click(function() {
		if (flag == 1) {
			$("#webManage").css("margin-bottom", "4px");
			$("#webManage").find("a").css("border-radius", "5px 5px 5px 5px");
			flag = 2;
		} else {
			$("#webManage").css("margin-bottom", "0px");
			$("#webManage").find("a").css("border-radius", "5px 5px 0px 0px");
			flag = 1;
		}
		$("#sAuth").toggle();
		$("#sDecorate").toggle();
		$("#sApply").toggle();
	});
	// --------------------左侧菜单---------------------------//

	// 初始化：认证设置按钮开关
	$('input[type="checkbox"]').bootstrapSwitch();
	
	// 初始化，左侧菜单中“设备管理”选中状态
	$("#sApply").addClass("active");

	// 返回店铺应用click事件
	$(".toApplyMainBtn").click(function() {
		window.location.href = "../appManage/gotoAppStore";
	});
	
	initDevGrid();
	initDevGrid2();
	
	$(".payOkBtn").click(function() {
		window.location.href = window.location.href.replace(/#/g,''); 
	});

	$(".payErrorBtn").click(function() {
		window.location.href = ctx + "/comm/faq";
	});
});

/**
 * 初始化加载已开通微信连WIFI功能的设备列表
 */
function initDevGrid(){
	//======财务详情列表-=====
    $("#openWxJoinWifiDev").bs_grid({
        ajaxFetchDataURL:ctx + "/wxJoinWifi/getStoreAllWxRouters",//数据url
        row_primary_key: "id",//记录的主键
    	rowsPerPage: 5,//每页显示几行
    	bootstrap_version: "2",
    	useSortableLists: false,//是否使用排序
    	showSortingIndicator : false,//是否使用排序图标
    	rowSelectionMode: false, //列表是否支持选择，"single"、"multiple"分别为单选和多选，设置为false取消选择
//    	selected_ids:[],//如果列表开启了选择功能，则被选行的主键集合通过 $("#demo_grid1").bs_grid('selectedRows','get_ids');方法获得{id1,id2,id3}
   	    showRowNumbers: true,//是否显示行号，默认为显示行号，需要关闭设置为false即可
        columns: [//列表字段，字段展示顺序由该项配置的顺序决定,如果需要对某个字段进行排序页配置sortable:"yes"否则为"no"
            {field: "id", header: "id", sortable: "no",visible:"no"},
            {field: "mac", header: "设备mac地址", sortable: "no"},
            {field: "qrCodeUrl", header: "二维码",  sortable: "no",type:"img"},//如果字段配置了type属性则会显示相应的元素
            {field: "createTime", header: "开通时间",  sortable: "no"}
        ],
        rowSeting:true,//是否增加"操作"列，如果增加则相应的要配置setingConfig返回一个Html标签string,用以完成按钮的自定义设置
        setingConfig:function(rowRecord){//返回一个Html标签string,用以完成按钮的自定义设置
          	var menu = "<a href='javascript:;' onclick='restQrCodeUrl(\"" +rowRecord.mac+"\")'>重新生成二维码</a>";
          	menu=menu+"<br/><a href='javascript:;' onclick='setAdInfo(\"" +rowRecord.mac+"\")'>设置主页</a>";
			return menu;
        },
        /*sorting: [
                  {sortingName: "交易时间", field: "createTime", order: "descending"},
              ],
        tools:[{
        	toolType:"refresh"
    	}] ,  */
        //设置分页 显示规则
        paginationOptions: {
            showRowsPerPage: false,
            containerClass : null
        }, 
       serarchSeting:[],
        useFilters: false,//是否使用过滤条件
    });	
	
}
/**
 * 新增微信连wifi
 * @param mac {设备mac地址}
 */
function addWxJoinWifi(mac){

	//校验该路由固件版本是否支持微信连wifi
	$.ajax({
 		type : "POST",
 		url : ctx +"/storeRouter/isSupportWxJoinWifi",
 		data : {
 			mac : mac
 		},
 		success : function(msg) {
 			if (msg=="true") {//支持微信连wifi
 				$("#WxJoinWifiForm")[0].reset();	//重置form
 				wxJoinWifiForm.resetForm();
 				$("#devMac").val(mac);
 				$("#myModal").modal("show");
 			} else {//不支持微信连wifi
 				toastr.error('很抱歉！您当前的设备固件暂不支持微信连wifi,若要使用该功能请升级至最新版本');
 			};
 		}
 	}); 
}


//----------------开启微信连wifi----beigin-----------//

$(".addWXRouter").unbind("click");
$(".addWXRouter").click(function() {
	

	$("#WxJoinWifiForm").submit();
});
//----------------开启微信连wifi----end-----------//


//----------------取消添加微信连wifi----begin---//

$(".cancelWxRouter").unbind("click");
$(".cancelWxRouter").click(function() {
	$("#myModal").modal("hide");
});
//----------------取消添加微信连wifi----end---//

/**
 * 初始化加载未开通微信连WIFI功能的设备列表
 */
function initDevGrid2(){
	//======财务详情列表-=====
    $("#openWxJoinWifiDev2").bs_grid({
        ajaxFetchDataURL:ctx + "/wxJoinWifi/findStoreRouters",//数据url
        row_primary_key: "id",//记录的主键
    	rowsPerPage: 5,//每页显示几行
    	bootstrap_version: "2",
    	useSortableLists: false,//是否使用排序
    	showSortingIndicator : false,//是否使用排序图标
    	rowSelectionMode: false, //列表是否支持选择，"single"、"multiple"分别为单选和多选，设置为false取消选择
//    	selected_ids:[],//如果列表开启了选择功能，则被选行的主键集合通过 $("#demo_grid1").bs_grid('selectedRows','get_ids');方法获得{id1,id2,id3}
   	    showRowNumbers: true,//是否显示行号，默认为显示行号，需要关闭设置为false即可
        columns: [//列表字段，字段展示顺序由该项配置的顺序决定,如果需要对某个字段进行排序页配置sortable:"yes"否则为"no"
            {field: "id", header: "id", sortable: "no",visible:"no"},
            {field: "ssid", header: "SSID",  sortable: "no"},
            {field: "model", header: "设备型号",  sortable: "no"},
            {field: "mac", header: "设备mac地址", sortable: "no"},
            {field: "installPosition", header: "安装位置",  sortable: "no"}
        ],
        rowSeting:true,//是否增加"操作"列，如果增加则相应的要配置setingConfig返回一个Html标签string,用以完成按钮的自定义设置
        setingConfig:function(rowRecord){//返回一个Html标签string,用以完成按钮的自定义设置
        	var menu = "<a href='javascript:;' onclick='addWxJoinWifi(\"" +rowRecord.mac+"\")'>开通</a>";
			return menu;
        },
        /*sorting: [
                  {sortingName: "交易时间", field: "createTime", order: "descending"},
              ],
        tools:[{
        	toolType:"refresh"
    	}] ,  */
        //设置分页 显示规则
        paginationOptions: {
            showRowsPerPage: false,
            containerClass : null
        }, 
       serarchSeting:[],
        useFilters: false,//是否使用过滤条件
    });	
	
}

var wxJoinWifiForm = $("#WxJoinWifiForm").validate({
	errorPlacement : function(error, element) {
        //错误提示样式,在下方提示
		  //  $('<br/>').appendTo(element.parent());	//有这句就在下方提示错误信息
		    error.css({
					display : "inline",
					color : "#F00",
					position : "relative",
				}).appendTo(element.parent().addClass(
					"error"));
	},
	submitHandler:function(form) {
		  form.submit();
			$("#myModal").modal("hide");
		  $("#payMsg").modal('show');
/*		$.ajax({
	 		type : "POST",
	 		url : ctx +"/wxJoinWifi/addApToWx",
	 		data : {
	 			mac : $("#devMac").val(),
	 			bandOpr : $("#bandOpr").val(),
	 			bandWidth:$("#bandWidth").val()
	 		},
	 		success : function(msg) {//返回需有用户名、密码
	 			if (msg=="true") {
	 				toastr.success('开通成功');
	 				 $("#openWxJoinWifiDev").bs_grid("displayGrid",true);
	 				 $("#openWxJoinWifiDev2").bs_grid("displayGrid",true);
	 				$("#myModal").modal("hide");
//					location = ctx + "/storeRouter/goDeviceManage?curPage="+curPage;
	 			} else {//添加失败
	 				toastr.error('开通失败');
	 			};
	 		}
	 	}); */
	},
	rules : {
		bandWidth : {
			required : true,
			maxlength : 10
			
		},
		bandOpr : {
			required : true,
			maxlength : 10
		}
	},
	messages : {
		bandWidth : {
			required : "请输入您的带宽，如: 100M",
			maxlength :"我想中国还没有这么高的带宽吧！"
		},
		bandOpr : {
			required : "请输入您的宽带运营商，如: 中国联通、中国电信",
			maxlength :"您输入的的太长了，简称就好了"
		}
	}
});
/**
 * 重新生成url
 * @param mac
 */
function restQrCodeUrl(mac){
	showLoading2("重置中...");
	$.ajax({
 		type : "POST",
 		url : ctx +"/wxJoinWifi/resetQrCodeUrl",
 		data : {
 			mac : mac
 		},
 		success : function(msg) {//返回需有用户名、密码
 			if (msg=="true") {
 				hideLoading();
 				toastr.success('OK ,  重置二维码成功');
 				 $("#openWxJoinWifiDev").bs_grid("displayGrid",true);
//				location = ctx + "/storeRouter/goDeviceManage?curPage="+curPage;
 			} else {//添加失败
 				toastr.error('重置二维码失败！');
 			};
 		}
 	}); 
	
	
}
//设置广告内容
function setAdInfo(mac){
	//将用户点击的设备的mac地址赋值给公共变量，apMac,该变量将在apInfo.js中使用，分别用来回显已设置广告和设置广告
	apMac=mac;

	$.ajax({
 		type : "POST",
 		url : ctx +"/wxAdInfo/getAdInfo",
 		data : {
 			mac : mac
 		},
 		success : function(msg) {//返回需有用户名、密码

 			//转换返回结果为json
 			var adInfo = eval("(" + msg + ")");
 			if (adInfo.id) {	//回显广告
 					$("#adInfo_id").val(adInfo.id);//广告编号

 					//左预览
 					$("#read_bg").attr("src",adInfo.backgroundImg);
 					$("#read_logo").attr("src",adInfo.logo);
 					if(adInfo.mapAccount!=null&&adInfo.mapAccount!=""){
 						$("#read_mapAccount").val(adInfo.mapAccount);
 					}
 					$("#span_adGo").val(adInfo.textTitle);
 					var i=adInfo.wxAdDetails.length;
 					
 					if(i==1){
 						$("#read_icon1").attr("src",adInfo.wxAdDetails[0].iconImg);
 						$("#icon_content1").html(adInfo.wxAdDetails[0].iconTitle);
 					}else if(i==2){
 						$("#read_icon1").attr("src",adInfo.wxAdDetails[0].iconImg);
 						$("#icon_content1").html(adInfo.wxAdDetails[0].iconTitle);
 						
 						$("#read_icon2").attr("src",adInfo.wxAdDetails[1].iconImg);
 						$("#icon_content2").html(adInfo.wxAdDetails[1].iconTitle);
 					}else{
 						$("#read_icon1").attr("src",adInfo.wxAdDetails[0].iconImg);
 						$("#icon_content1").html(adInfo.wxAdDetails[0].iconTitle);
 						
 						$("#read_icon2").attr("src",adInfo.wxAdDetails[1].iconImg);
 						$("#icon_content2").html(adInfo.wxAdDetails[1].iconTitle);
 						
 						$("#read_icon3").attr("src",adInfo.wxAdDetails[2].iconImg);
 						$("#icon_content3").html(adInfo.wxAdDetails[2].iconTitle);
 					}
 					//右编辑
 					$("#input_bg").val(adInfo.backgroundImg);
 					$("#input_logo").val(adInfo.logo);
 					$("#input_weXin").val(adInfo.mpAccount);
 					$("#input_content").val(adInfo.textTitle);
 					$("#input_link").val(adInfo.textUrl);
 					
 					if(i==1){
 						$("#ad_icon_link1").val(adInfo.wxAdDetails[0].iconImg);
 						$("#ad_icon_inner1").val(adInfo.wxAdDetails[0].adURL);
 						$("#ad_icon_content1").val(adInfo.wxAdDetails[0].iconTitle);
 					}else if(i==2){
 						addIcon_info=1;
 						$("#icon_ad_isDisplay1").removeClass("adInfo_dispnone");
 						$("#icon_ad_isDisplay1").addClass("adInfo_disp");
 						$("#ad_icon_link1").val(adInfo.wxAdDetails[0].iconImg);
 						$("#ad_icon_inner1").val(adInfo.wxAdDetails[0].adURL);
 						$("#ad_icon_content1").val(adInfo.wxAdDetails[0].iconTitle);
 						
 						$("#ad_icon_link2").val(adInfo.wxAdDetails[1].iconImg);
 						$("#ad_icon_inner2").val(adInfo.wxAdDetails[1].adURL);
 						$("#ad_icon_content2").val(adInfo.wxAdDetails[1].iconTitle);
 					}else{
 						addIcon_info=0;
 						$("#icon_ad_isDisplay2").removeClass("adInfo_dispnone");
 						$("#icon_ad_isDisplay2").addClass("adInfo_disp");
 						$("#addAdIcon").addClass("adInfo_dispnone");
 						$("#ad_icon_link1").val(adInfo.wxAdDetails[0].iconImg);
 						$("#ad_icon_inner1").val(adInfo.wxAdDetails[0].adURL);
 						$("#ad_icon_content1").val(adInfo.wxAdDetails[0].iconTitle);
 						
 						$("#ad_icon_link2").val(adInfo.wxAdDetails[1].iconImg);
 						$("#ad_icon_inner2").val(adInfo.wxAdDetails[1].adURL);
 						$("#ad_icon_content2").val(adInfo.wxAdDetails[1].iconTitle);
 						
 						$("#ad_icon_link3").val(adInfo.wxAdDetails[2].iconImg);
 						$("#ad_icon_inner3").val(adInfo.wxAdDetails[2].adURL);
 						$("#ad_icon_content3").val(adInfo.wxAdDetails[2].iconTitle);
 					}
 					
 			} else { //新增广告
 				
 				//重置界面表单
 	 			$("#form_adInfo")[0].reset();
 	 			saveAdInfoForm.resetForm();
 	 			$(".arrow2").removeClass("adInfo_dispnones");
 	 			$(".arrow2").removeClass("adInfo_disp");
 	 			//重置预览页面
 	 			$("#span_adGo").val("文字广告                                                    >");
 	 			$("#icon_content1").html("图标广告1");
 	 			$("#icon_content2").html("图标广告2");
 	 			$("#icon_content3").html("图标广告3");
 	 			$("#read_bg").attr("src","");
 	 			$("#read_logo").attr("src","");
 	 			$("#read_icon1").attr("src","");
 	 			$("#read_icon2").attr("src","");
 	 			$("#read_icon3").attr("src","");
 	 			
 			}
 			//显示广告设置界面，隐藏非广告设置界面
 			$("#closeAp").hide();
 			$("#successAP").hide();
 			$("#page2").show();	
 		}
 	}); 
}