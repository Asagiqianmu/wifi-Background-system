/**
 * 幸运转盘
 * 
 * @author PengL
 */

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

	// 初始化，左侧菜单中“设备管理”选中状态
	$("#sApply").addClass("active");

	// 初始化按钮下拉
//	$('.dropdown-toggle').dropdown();

	// 日历控件设置
	$('.form_datetime').datepicker({
		format : 'yyyy-mm-dd',
		autoclose : true
	});

	// 回到店铺活动管理列表，click事件
	$(".toManageListBtn").unbind("click");
	$(".toManageListBtn").click(function() {
		$(".manageOperate").hide();
		$("#manageList").show();
	});

	// 返回店铺应用click事件
	$(".toApplyMainBtn").unbind("click");
	$(".toApplyMainBtn").click(function() {
		window.location.href = "../appManage/gotoAppStore";
	});

	// 新增活动，click事件
	$(".toAddActivityBtn").unbind("click");
	$(".toAddActivityBtn").click(function() {
		$("#manageList").hide();
		$("#addActivity").show();
	});

	// 新增活动中：保存按钮，click
	$(".doSaveAddActivityBtn").unbind("click");
	$(".doSaveAddActivityBtn").click(function() {
		toastr.success("保存成功");
		$("#manageList").show();
		$("#addActivity").hide();
	});

	// 奖品兑换：查询按钮，click
	$(".searchBtn").unbind("click");
	$(".searchBtn").click(function() {
		$("#winningDetails").show();
	});

	// 奖品兑换详情中：领取奖品按钮，click
	$(".doGetPrizeBtn").unbind("click");
	$(".doGetPrizeBtn").click(function() {
		toastr.success("领取成功");
	});

	// 奖品兑换详情中：取消按钮，click
	$(".cancelGetPrizeBtn").unbind("click");
	$(".cancelGetPrizeBtn").click(function() {
		$("#winningDetails").hide();
	});

	// 列表加载后，将此方法移在生成表格之后，初始化列表的click事件
	initEvent();

});

// 初始化事件
function initEvent() {

	// 查看详情按钮，click
	$(".toDetailBtn").unbind("click");
	$(".toDetailBtn").click(function() {
		$("#manageList").hide();
		$("#activityDetail").show();
	});
	
	// 暂停活动按钮，click
	$(".stopActivityBtn").unbind("click");
	$(".stopActivityBtn").click(function() {
		$("#manageList").hide();
		$("#stopActivity").show();
	});
	
	// 暂停活动中，确定暂停按钮，click
	$(".doStopActivityBtn").unbind("click");
	$(".doStopActivityBtn").click(function() {
		toastr.success("操作成功");
		$("#stopActivity").hide();
		$("#manageList").show();
	});
	
	// 开始活动按钮，click
	$(".startActivityBtn").unbind("click");
	$(".startActivityBtn").click(function() {
		toastr.success("操作成功");
	});
	
	
	
	
	
}
