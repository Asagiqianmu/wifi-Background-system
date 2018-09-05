$(function() {
	SitePriceConfigList(1); // 默认调用查询
	$('#sub').on('click', function() { // 绑定更新操作保存按钮
		submitUpdate();
	});
	doAddPriceBtn
	$('#doAddPriceBtn').on('click', function() { // 绑定新增操作保存按钮
		$("#addPriceForm").submit();
	});
	SectionList();// 加载section
	$('#btSelect').on('click', function() { // 绑定查询按钮
		SitePriceConfigList(1);
	});
	$('#btAddPrice').on('click', function() { // 绑定增加计费按钮
		addPrice();
	});
	

	SectionSiteList();	//查询用户账户下所有的场所，并追加到新增计费价格form的section中
	
});
function SitePriceConfigList(num){
	var selectVal=$("#selectValues").val();
	showLoading();
	if (num == undefined)
		return;
	if (isNaN(num))
		return;
	$.ajax({
		type : "POST",
		url : "getSitePriceConfigList",
		data : {
			curPage : num,
			pageSize : 5,
			siteName:selectVal
		},
		success :function(data){
			eval("data = " + data);
			if(data.code==1){
				pageHandle("pager", "recordsTbody", data.data, num, SitePriceConfigList, htmlTable);
			}
			if(data.code==-1){
				toastr.error("服务不可用，请稍后再试");
			}
			//SitePriceConfigList(1)
			
			changeToSuccess(1);
		}
	});
}
function htmlTable(data,tableId){
	var tbody = $("#" + tableId);
	tbody.empty();
	var tableHtml="";
	$.each(data.data,function(index,str){
		tableHtml+="<tr><td>"+str.site_name+"</td>" +
		"<td>"+str.address+"</td>" +
		"<td>"+translate.chargeType(str.charge_type)+"</td>" +
				"<td>"+translate.priceType(str.price_type)+"</td>" +
				"<td>"+str.unit_price+"元</td>" +
				"<td>"+str.name+"</td>" +
				"<td>"+translate.isStoped(str.is_stoped)+"</td>" +
				"<td>"+str.create_time+"</td>" +
				"<td>" +
				"<button  class='btn btn-primary  btn-mini dropdown-toggle'  onclick='updateClick("+str.id+","+str.unit_price+","+str.is_stoped+")'>修改</button></td>" +
				"</tr>";
	});
	tbody.html(tableHtml);
}
//翻译
var translate = {
	priceType : function(str) { //收费类型
		if (str == 0) {
			return "小时";
		}
		if (str == 1) {
			return "天";
		}
		if (str == 2) {
			return "月";
		}
		if (str == 3) {
			return "包年";
		}
		if (str == 4) {
			return "包两年";
		}
		return "";
	},
	isStoped : function(str) { //是否作废
		if (str == 0) {
			return "否";
		}
		if (str == 1) {
			return "是";
		}
		return "";
	},
	chargeType : function(str){//归属集团
		if(str == 0){
			return "无归属";
		}
		if(str == 1){
			return "电信集团";
		}
	}
};
//修改按钮
function updateClick(id,price,is_stoped){
	$("#updatePrice")[0].reset();
	$('#addDeviceModel').modal({
		backdrop : 'static'
	});
	$("#price").val(price);
	if(is_stoped==0){
		$("#stoped").find("option").eq(1).removeAttr("selected");
		$("#stoped").find("option").eq(0).attr("selected","selected");
	}
	if(is_stoped==1){
		$("#stoped").find("option").eq(0).removeAttr("selected");
		$("#stoped").find("option").eq(1).attr("selected","selected");
	}
	 $("#priceId").val(id);
}
function submitUpdate(){  //更改当前规则
	$("#updatePrice").submit();
}
jQuery.validator.addMethod("lrunlv", function(value, element) {         
    return this.optional(element) || /^\d+(\.\d{1,2})?$/.test(value);         
}, "小数位不能超过三位"); 

$("#updatePrice").validate({
	errorPlacement : function(error, element) {
		error.css({
			display : "inline",
			color : "#F00",
			position : "relative",
		}).appendTo(element.parent().addClass("error"));
	},
	submitHandler : function() {
		var id= $("#priceId").val();
		var stoped=	$("#stoped").val();
		var price=$("#price").val();
		$.post(ctx+"/updateprice", {
			"id" : id,
			"stoped" : stoped,
			"price" : price
		}, function(data) {
			eval("data = " + data);
			if (data.code == 1) {
				$('#addDeviceModel').modal("hide");
				toastr.success('更改成功');
			} else {
				toastr.error("服务不可用，请稍后再试");
			}
			SitePriceConfigList(1);
		});
	},	
	rules : { //验证
		price : {
			required : true,
			number:true,
			min:0.01,
			//maxlength : 10,
			max:9999,
			lrunlv:true
		},
		
	},
	messages : { //错误提示
		price : {
			required : "请输入合法的数字(不能小于0.01)",
			//maxlength : "最大长度为10",
			min:"不能再便宜了！"	,
			max:"太贵了！",
			lrunlv:" 小数不能超过三位!"
		},
	}
});


/**
 * 校验新增计费规则表单
 */
$("#addPriceForm").validate({
	errorPlacement : function(error, element) {
		error.css({
			display : "inline",
			color : "#F00",
			position : "relative",
		}).appendTo(element.parent().addClass("error"));
	},
	submitHandler : function() {
		var price=$("#new_price").val();
		var priceType = $("#priceType").val();
		var chargeType = $("#chargeType").val();
		var site_id = $("#site").val();
		var name = $("#name").val();
		$.post(ctx+"/addprice", {
			"is_stoped" : 0,
			"price_type" : priceType,
			"unit_price" : price,
			"charge_type" : chargeType,
			"site_id" : site_id,
			"name" : name
		}, function(data) {
			eval("data = " + data);
			if (data.code == 1) {
				$('#addPriceModel').modal("hide");
				toastr.success('添加成功');
			} else {
				toastr.error("服务不可用，请稍后再试");
			}
			SitePriceConfigList(1);
		});
	},	
	rules : { //验证
		name:{
			required : true,
			maxlength :32
		},
		price : {
			required : true,
			number:true,
			min:0.01,
			//maxlength : 10,
			max:9999,
			lrunlv:true
		},
		
	},
	messages : { //错误提示
		price : {
			required : "请输入合法的数字(不能小于0.01)",
			//maxlength : "最大长度为10",
			min:"不能再便宜了！"	,
			max:"太贵了！",
			lrunlv:" 小数不能超过三位!"
		},
		name:{
			required : "请填写自定义收费名称",
			max:"名称太长了，最多输入32个汉字"
		},
	}
});
//按场所名称查询
function SectionList(){
	$.post(ctx+"/getSiteList",function(data){
		eval("data = " + data);
		var sectionHtml="";
		$.each(data.data,function(index,str){
			sectionHtml+="<option value='"+str.site_name+"'>"+str.site_name+"</option>";
		});
		$("#selectValues").append(sectionHtml);
	});
}

/**
 * 新增计费规则
 */
function addPrice(){


	$("#addPriceForm")[0].reset();
	$('#addPriceModel').modal({
		backdrop : 'static'
	});
}

//绑定价格归属场所下拉控件使用
function SectionSiteList(){
	$.post(ctx+"/getSiteList",function(data){
		eval("data = " + data);
		var sectionHtml="";
		$.each(data.data,function(index,str){
			sectionHtml+="<option value='"+str.id+"'>"+str.site_name+"</option>";
		});
		$("#site").append(sectionHtml);
	});
}