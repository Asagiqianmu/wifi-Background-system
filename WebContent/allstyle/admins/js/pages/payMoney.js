$(function(){
	//页面加载
	loadWaitArgee();
	//下拉列表绑定事件
	$("#Select_show").on("change",function(){
		var val_select=$("#Select_show").val();
		if(val_select=="1"){
			//未审核
			loadWaitArgee();
			$("#info_show").html("待审核提现申请列表");
		}else if(val_select=="2"){
			//成功打款
			loadSuccessPay();
			$("#info_show").html("成功打款列表");
		}else if(val_select=="3"){
			//打款失败
			loadFailPay();
			$("#info_show").html("未成功打款列表");
		}else{
			//显示待审核列表
			loadWaitArgee();
			$("#info_show").html("待审核提现申请列表");
		}
	});
});
//待审核列表
function loadWaitArgee(){
	
}
//成功打款列表
function loadSuccessPay(){
	
}
//打款失败列表
function loadFailPay(){
	
}