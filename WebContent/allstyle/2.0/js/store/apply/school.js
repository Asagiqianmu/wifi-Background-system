/**
 * 校园卡js
 */
var flag = 1;// flag为2 时，刷新页面
$("#endDate").text(new Date().DateAdd('m', 1).format('yyyy-MM-dd'));
var curId = 1;

//定义不同类型收费价格公共变量，以方便页面处理消费金额的动态改变;
var month_price_value;//按月付款，单月价格
var term_price_value;//按学期付款,单月价格
var year_price_value;//按年付款，单月价格

//用以控制学期模式下的结束时间
var last_term_time;//上半学期
var next_term_time;//下班学期


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
	// 返回会员管理click事件
	$(".toApplyMemberBtn").click(function() {
		window.location.href = "../school/goMemberManage";
	});
	//加载会员列表
	getSchoolMemberList(1);
	// 日历控件设置
	$('.form_datetime').datepicker({
		format : 'yyyy-mm-dd',
		 autoclose: true
	});
	// 初始化下拉列表样式
	$(".select2").select2({
		placeholder : "Select a State"
	});

	$("#month").keyup(function() {
		var _val = $(this).val();
		if (_val != "") {
			$("input[name='expirationTimeRadio']").each(function() {
				$(this).prop("checked", false);
			});
			try {
				_val = parseInt(_val);
				if(isNaN(_val)||_val>12){
					_val=1;
					toastr.warning("最多只能选择输入1-12之间的数字");
				}
			} catch (e) {
				_val = 1;
			}
			$("#month").val(_val);
			$("#endDate").text(new Date().DateAdd('m', _val).format('yyyy-MM-dd'));
			$("#payMoney").text(month_price_value *  _val);
		} else {
			$("#time1").prop("checked", true);
			$("#endDate").text(new Date().DateAdd('m', 1).format('yyyy-MM-dd'));
		}
	});

	$("input[name='expirationTimeRadio']").click(function() {
		$("#month").val("");
		$(this).parent().find("label").remove();
		var _val = $(this).val();
		$("#endDate").text(new Date().DateAdd('m', parseInt(_val)).format('yyyy-MM-dd'));
		$("#payMoney").text(month_price_value *  _val);
	});

});

function financeInfoGrid(){
	//======财务详情列表-=====
    $("#financeinfoGrid").bs_grid({
        ajaxFetchDataURL:ctx + "/schoolFinanceInfo/schoolFinanceInfoList",//数据url
        row_primary_key: "id",//记录的主键?
    	rowsPerPage: 5,//每页显示几行
    	bootstrap_version: "2",
    	useSortableLists: false,//是否使用排序
    	showSortingIndicator : true,//是否使用排序图标
    	rowSelectionMode: false, //列表是否支持选择，"single"、"multiple"分别为单选和多选，设置为false取消选择
//    	selected_ids:[],//如果列表开启了选择功能，则被选行的主键集合通过 $("#demo_grid1").bs_grid('selectedRows','get_ids');方法获得{id1,id2,id3}
   	    showRowNumbers: true,//是否显示行号，默认为显示行号，需要关闭设置为false即可
        columns: [//列表字段，字段展示顺序由该项配置的顺序决定,如果需要对某个字段进行排序页配置sortable:"yes"否则为"no"
            {field: "id", header: "id", sortable: "no",visible:"no"},
            {field: "transactionAmount", header: "交易金额", sortable: "no"},
            {field: "createTime", header: "交易时间",  sortable: "yes"},
            {field: "transactionName", header: "交易人",  sortable: "no"},
            {field: "telephone", header: "联系方式",  sortable: "no"}
        ],
        sorting: [
                  {sortingName: "交易时间", field: "createTime", order: "descending"},
              ],
        tools:[{
        	toolType:"refresh"
    	}        
        ],
        //设置分页 显示规则
        paginationOptions: {
            showRowsPerPage: false,
            containerClass : null
        }, 
        serarchSeting:[
             {serarchFiled:'transactionName',serarchName:"交易人", dataType:'string',serarchType:'like'},
             {serarchFiled:'telephone',serarchName:"联系方式",dataType:'number',serarchType:'equal'},
             {serarchFiled:'createTime',serarchName:"交易时间",dataType:'date',serarchType:'between'}
         ],
        useFilters: false,//是否使用过滤条件
        rowSeting:false//是否增加"操作"列，如果增加则相应的要配置setingConfig返回一个Html标签string,用以完成按钮的自定义设置
    });	
}

var aCity = {
	11 : "北京",
	12 : "天津",
	13 : "河北",
	14 : "山西",
	15 : "内蒙古",
	21 : "辽宁",
	22 : "吉林",
	23 : "黑龙江",
	31 : "上海",
	32 : "江苏",
	33 : "浙江",
	34 : "安徽",
	35 : "福建",
	36 : "江西",
	37 : "山东",
	41 : "河南",
	42 : "湖北",
	43 : "湖南",
	44 : "广东",
	45 : "广西",
	46 : "海南",
	50 : "重庆",
	51 : "四川",
	52 : "贵州",
	53 : "云南",
	54 : "西藏",
	61 : "陕西",
	62 : "甘肃",
	63 : "青海",
	64 : "宁夏",
	65 : "新疆",
	71 : "台湾",
	81 : "香港",
	82 : "澳门",
	91 : "国外"
};

// （验证身份证号码是否合法）
jQuery.validator.addMethod("sfzCheck", function(value, element) {
	var idType=$("#idType").val();
	if (idType==2) {//身份证
		var iSum = 0;
		if (!/^\d{17}(\d|x)$/i.test(value))
			return this.optional(element) || false;
		value = value.replace(/x$/i, "a");
		if (aCity[parseInt(value.substr(0, 2))] == null)
			return this.optional(element) || false;
		sBirthday = value.substr(6, 4) + "-" + Number(value.substr(10, 2)) + "-"
				+ Number(value.substr(12, 2));
		var d = new Date(sBirthday.replace(/-/g, "/"));
		if (sBirthday != (d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d
				.getDate()))
			return this.optional(element) || false;
		for (var i = 17; i >= 0; i--)
			iSum += (Math.pow(2, i) % 11) * parseInt(value.charAt(17 - i), 11);
		if (iSum % 11 != 1)
			return this.optional(element) || false;
		return this.optional(element) || true;
	}else if(idType==12){
		return this.optional(element) || true;
	}
}, "请您输入正确的身份证号码");

//（验证学生证号是否合法）
jQuery.validator.addMethod("xszCheck", function(value, element) {
	var idType=$("#idType").val();
	if (idType==2) {//身份证
		return this.optional(element) || true;
	}else if(idType==12){
		if (!/^\d{8,18}$/.test(value)){
			return this.optional(element) || false;
		}
		return this.optional(element) || true;
	}
}, "学生证号为数字，请仔细核对");



//（验证身份证号码是否合法）
jQuery.validator.addMethod("sfzCheck2", function(value, element) {
	var idType=$("#idType2").val();
	if (idType==2) {//身份证
		var iSum = 0;
		if (!/^\d{17}(\d|x)$/i.test(value))
			return this.optional(element) || false;
		value = value.replace(/x$/i, "a");
		if (aCity[parseInt(value.substr(0, 2))] == null)
			return this.optional(element) || false;
		sBirthday = value.substr(6, 4) + "-" + Number(value.substr(10, 2)) + "-"
				+ Number(value.substr(12, 2));
		var d = new Date(sBirthday.replace(/-/g, "/"));
		if (sBirthday != (d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d
				.getDate()))
			return this.optional(element) || false;
		for (var i = 17; i >= 0; i--)
			iSum += (Math.pow(2, i) % 11) * parseInt(value.charAt(17 - i), 11);
		if (iSum % 11 != 1)
			return this.optional(element) || false;
		return this.optional(element) || true;
	}else if(idType==12){
		return this.optional(element) || true;
	}
}, "请您输入正确的身份证号码");

//（验证学生证号是否合法）
jQuery.validator.addMethod("xszCheck2", function(value, element) {
	var idType=$("#idType2").val();
	if (idType==2) {//身份证
		return this.optional(element) || true;
	}else if(idType==12){
		if (!/^\d{8,18}$/.test(value)){
			return this.optional(element) || false;
		}
		return this.optional(element) || true;
	}
}, "学生证号为数字，请仔细核对");

// 加载会员列表
function getSchoolMemberList(num) {

	showLoading();

	if (num == undefined)
		return;
	if (isNaN(num))
		return;

	$.ajax({
		type : "POST",
		url : "getMemberManageList",
		data : {
			curPage : num,
			pageSize : 10,
			cardNum : $.trim($("#cardNum").val())
		},
		success : function(data) {
			eval("data = " + data);
			if (data.code == 200) {
				$('body,html').animate({
					scrollTop : 0
				}, 1000);
				// 调用分页
				pageHandle("pager", "schoolTbody", data.data, num,
						getSchoolMemberList, buildTable);

				initEvent();
				changeToSuccess(1);

			} else {
				changeToError(1);
			}
		},
		error : function() {
			changeToError(1);
		}
	});

}

/**
 * 生成店铺列表table
 * 
 * @param data
 * @param tableId
 */
function buildTable(data, tableId) {
	var tbody = $("#" + tableId);
	tbody.empty();
	data = data.data;

	for (var i = 0; i < data.length; i++) {

		var tr = $("<tr/>").attr("id", data[i].id).appendTo(tbody);
		var td1 = $("<td/>").text(i + 1).appendTo(tr);
		var td2 = $("<td/>").text(data[i].name).appendTo(tr);
		var sex = data[i].sex;
		if (sex == 3) {
			var tdSex = $("<td/>").attr("marker", sex).text("男").appendTo(tr);
		} else if (sex == 4) {
			var tdSex = $("<td/>").attr("marker", sex).text("女").appendTo(tr);
		} else {
			var tdSex = $("<td/>").attr("marker", sex).text("----")
					.appendTo(tr);
		}
		var td3 = $("<td/>").text(data[i].username).appendTo(tr);
		var td4 = $("<td/>").text(data[i].telephone).appendTo(tr);
		var idType = data[i].idType;
		if (idType == 2) {
			var tdIdType = $("<td/>").attr("marker", data[i].idType)
					.text("身份证").appendTo(tr);
		} else if (idType == 12) {
			var tdIdType = $("<td/>").attr("marker", data[i].idType)
					.text("学生证").appendTo(tr);
		} else {
			var tdIdType = $("<td/>").attr("marker", data[i].idType).text("无")
					.appendTo(tr);
		}
		var td6 = $("<td/>").text(data[i].idNumber).appendTo(tr);
		var td7 = $("<td/>").text(
				new Date(data[i].expirationTime.time).format("yyyy-MM-dd"))
				.appendTo(tr);

		var td8 = $("<td/>").appendTo(tr);
		var div = $("<div/>").addClass("btn-group").appendTo(td8);
		var button = $("<button/>").attr("data-toggle", "dropdown").addClass(
				"btn dropdown-toggle").html("更多设置<span class='caret'></span>")
				.appendTo(div);
		var ul = $("<ul/>").addClass("dropdown-menu").appendTo(div);
		var li = $("<li/>").appendTo(ul);
		var a1 = $("<a/>").attr("href", "javascript:;").addClass("toRenewBtn")
				.html("<i class='icon-tags'></i> 续费").appendTo(li);
		var a2 = $("<a/>").attr("href", "javascript:;").addClass(
				"toEditCampusBtn").html("<i class='icon-pencil'></i> 修改")
				.appendTo(li);
		var a3 = $("<a/>").attr("href", "javascript:;").addClass(
				"toDeleteCampusBtn").html("<i class='icon-trash'></i> 删除")
				.appendTo(li);

	}

}

function initEvent() {

	// 点击"查询"按钮，执行事件
	$(".doSearchBtn").unbind("click");
	$(".doSearchBtn").click(function() {
		getSchoolMemberList(1);
	});

	// 点击"新增会员"按钮，执行事件
	$(".toAddCampusBtn").unbind("click");
	$(".toAddCampusBtn").click(function() {
		//初始化开通类型select选项元素
		$.ajax({
			type : "POST",
			url : ctx + "/schoolPriceInfo/getAllPriceInfos",
			success : function(data) {
				  var allPifs = $.evalJSON(data);
				  if(allPifs.length > 0){
					//初始化新增会员页面
					$("#addCampusForm")[0].reset();
					$("#memberTerm").hide();
					document.getElementById("priceType").innerHTML = "";//清空select选项
					$("#username").text("");
					$("#password").text("");
					for(var i=0; i < allPifs.length; i++){
						if(allPifs[i].priceStatus >0){
							var optionName ;
							switch (allPifs[i].priceType){
							case 0 : 
								optionName = "按月";
								month_price_value = allPifs[i].priceValue;

								break;
							case 1 :
								optionName = "按学期";
								term_price_value = allPifs[i].priceValue; 
								last_term_time  = allPifs[i].lastTermEndTime;
								next_term_time =  allPifs[i].nextTermEndTime;
								break;
							case 2 : 
								optionName = "按年";
								year_price_value = allPifs[i].priceValue;
								break;
							}
							document.getElementById("priceType").options.add(new Option(optionName, allPifs[i].priceType,true));
						}

					}
				$('#priceType')[0].selectedIndex  =0;//设为默认选中项
				$('#priceType').change();
				$("#campusList").hide();
				$("#addCampus").show();
				$("#time1").prop("checked", true);
				$("#idType").select2("val", 2);
				$("#month").val("");
				}else{//提示用户先设置价格
						
					toastr.warning('您尚未设置收费价格，请先在\"价格管理\"中设置好收费价格后再添加会员！');
				}
				
			}})

	});
	
	//点击"价格管理"按钮，打开相应界面
	$(".toPriceManager").unbind("click");
	$(".toPriceManager").click(function() {
		//清空表单，防止数据陈旧
		$("#priceManagerForm")[0].reset();
		//从数据库中读取该店铺的价格信息
		$.ajax({
			type : "POST",
			url : ctx + "/schoolPriceInfo/getAllPriceInfos",
			success : function(data) {
				    var allPifs = $.evalJSON(data);
				    
					if (allPifs.length > 0) {
						//存在价格数据
						for(var i = 0; i < allPifs.length; i++){
							switch(allPifs[i].priceType){
								case 0 ://按月
									$("#priceMonth").val(allPifs[i].priceValue);
									$("#priceMonthID").val(allPifs[i].id);
									if(allPifs[i].priceStatus >0){
										//已开启
										$("#priceMonthStatus").bootstrapSwitch('setState', true);
									}else{
										//未开启
										$("#priceMonthStatus").bootstrapSwitch('setState', false);
									}
									break;
								case 1://按学期
									$("#priceTermID").val(allPifs[i].id);
									$("#priceTerm").val(allPifs[i].priceValue);
									$("#lastTermEndTime").val(allPifs[i].lastTermEndTime);
									$("#nextTermEndTime").val(allPifs[i].nextTermEndTime);
									if(allPifs[i].priceStatus >0){
										//已开启
										$("#priceTermStatus").bootstrapSwitch('setState', true);
										$('#termTimeManagerDiv').show();
									}else{
										//未开启
										$("#priceTermStatus").bootstrapSwitch('setState', false);
									}
									break;
								case 2 ://按年
									$("#priceYearID").val(allPifs[i].id);
									$("#priceYear").val(allPifs[i].priceValue);
									if(allPifs[i].priceStatus >0){
										//已开启
										$("#priceYearStatus").bootstrapSwitch('setState', true);
									}else{
										//未开启
										$("#priceYearStatus").bootstrapSwitch('setState', false);
									}
									break;
							}
						}
					}
					//隐藏会员列表
					$("#campusList").hide();
					//显示价格管理界面
					$("#priceManager").show();		
			},
			error : function() {
				toastr.error("查询失败!请再次尝试");
			}
		});

	});
	
	//点击"财务信息"按钮，打开相应界面
	$(".toFinanceInfo").unbind("click");
	$(".toFinanceInfo").click(function() {
		//1、ajax请求最新财务信息
		getTotalFinanace();
		financeInfoGrid();
		//界面交互操
		$("#campusList").hide();
		$("#financeInfo").show();
		
	});

	// 新增会员中，点击"保存"按钮，执行事件
	$(".doAddCampusBtn").unbind("click");
	$(".doAddCampusBtn").click(function() {
		$("#addCampusForm").submit();
	});
	//为“开通类型”绑定选中事件
	$("#priceType").unbind("change");
	$("#priceType").change(function(){
		var priceType = $("#priceType").val();
		switch(priceType){
			case "0":
				//按月付费
				$("#memberTerm").show();
				$("#termEndTimeDiv").hide();
				$("#payMoney").text(month_price_value );
				$("input[name='expirationTimeRadio']")[0].click();
/*				$("input[name='expirationTimeRadio']:eq(0)").attr("checked",'checked'); */
				break;
			case "1" :
				//按学期付费
				
				$("#termEndTimeDiv").show();
				$("#memberTerm").hide();
				$("#payMoney").text(term_price_value );
				setEndTime();
				break;
			case "2" :
				//按年付费
				$("#memberTerm").hide();
				$("#termEndTimeDiv").show();
				$("#payMoney").text(year_price_value );
				setYearTypeEndTime();
				break;
		
		}
	});
	//保存自定义价格
	
	$(".doPriceManagerBtn").unbind("click");
	$(".doPriceManagerBtn").click(function() {
		$("#priceManagerForm").submit();
	});
	
	
	// 返回会员管理主界面
	$(".toCampusListBtn").unbind("click");
	$(".toCampusListBtn").click(function() {
		$("#campusList").show();
		$(".campusOperate").hide();
		if (flag == 2) {
			getSchoolMemberList(1);
		}
	});

	// 点击"续费"按钮，执行事件
	$(".toRenewBtn").unbind("click");
	$(".toRenewBtn").click(function() {
		curId = $(this).closest("tr").attr("id");
		//初始化开通类型select选项元素
		$.ajax({
			type : "POST",
			url : ctx + "/schoolPriceInfo/getAllPriceInfos",
			success : function(data) {
				  var allPifs = $.evalJSON(data);
				  if(allPifs.length > 0){
					  //-------初始化续费界面
					  document.getElementById("renewType").innerHTML = "";//清空select选项
					  $("#renewForm")[0].reset();
						$("#campusList").hide();
						$("#renew").show();
					  //-------初始化----end
						for(var i=0; i < allPifs.length; i++){
							if(allPifs[i].priceStatus >0){
								var optionName ;
								switch (allPifs[i].priceType){
								case 0 : 
									optionName = "按月";
									break;
								case 1 :
									optionName = "按学期";
							
									break;
								case 2 : 
									optionName = "按年";
									break;
								}
								document.getElementById("renewType").options.add(new Option(optionName, allPifs[i].priceType,true));
								$('#renewType')[0].selectedIndex  =0;//设为默认选中项
								$('#renewType').change();
							}
						}
				  }else{//提示用户先设置价格
						
						toastr.warning('您尚未设置收费价格，请先在\"价格管理\"中设置好收费价格后再进行续费！');
					}
			}
		});
/*		$("#renewForm")[0].reset();
		$("#campusList").hide();
		$("#renew").show();
		curId = $(this).closest("tr").attr("id");*/
	});
	
	//r
	$("#renewType").unbind("click");
	$("#renewType").on("change",function(){
		var selVal = $("#renewType").val();
		switch(selVal){
			case  "0" : //选择了按月续费模式
				$("#renewMonthDiv").show();
				$("#renewOtherDiv").hide();
				break;
			case  "1" : //选择了按学期续费模式
				$("#renewMonthDiv").hide();
				$("#renewOtherDiv").find("span").text("1学期");
				$("#renewOtherDiv").show();
				break;
			case "2" ://选择了按年续费模式
				$("#renewMonthDiv").hide();
				$("#renewOtherDiv").find("span").text("1年");
				$("#renewOtherDiv").show();
				break;
		}
	});

	// 续费中，点击"保存"按钮，执行事件
	$(".doRenewBtn").unbind("click");
	$(".doRenewBtn").click(function() {
		$("#renewForm").submit();
	});

	// 点击"修改会员"按钮，执行事件
	$(".toEditCampusBtn").unbind("click");
	$(".toEditCampusBtn").click(function() {
		$("#editCampusForm")[0].reset();
		$("#campusList").hide();
		$("#editCampus").show();
		curId = $(this).closest("tr").attr("id");
		var tds = $(this).closest("tr").find("td");
		var sex = $(tds[2]).attr("marker");
		$("#telephone2").val($(tds[4]).text());
		$("#idNumber2").val($(tds[6]).text());
		$("#password2").val("******");
		$("#date").text($(tds[7]).text());
		$("#name2").val($(tds[1]).text());
		$("#idType2").select2("val", $(tds[5]).attr("marker"));
		$("input[name=sex2][value=" + sex + "]").prop("checked", true);

	});

	// 修改会员中，"保存"按钮，执行事件
	$(".doEditCampusBtn").unbind("click");
	$(".doEditCampusBtn").click(function() {
		$("#editCampusForm").submit();
	});

	// 点击"删除会员"按钮，执行事件
	$(".toDeleteCampusBtn").unbind("click");
	$(".toDeleteCampusBtn").click(function() {
		$('#deleteCampus').modal({
			backdrop : 'static'
		});
		curId = $(this).closest("tr").attr("id");
	});

	// 删除会员中"确定"按钮，执行事件
	$(".doDeleteCampusBtn").unbind("click");
	$(".doDeleteCampusBtn").click(function() {
		$(".doDeleteCampusBtn").attr("disabled", "disabled").text("删除中...");
		showLoading2("删除中...");
		$.ajax({
			type : "POST",
			url : ctx + "/school/deleteSchoolMember",
			data : {
				id : curId
			},
			success : function(msg) {
				if (msg == "success") {
					$('#deleteCampus').modal("hide");
					$("#" + curId).remove();
					changeToSuccess(1);
					$(".doDeleteCampusBtn").removeAttr("disabled").text("确定");
				} else {
					changeToError(1);
					$(".doDeleteCampusBtn").removeAttr("disabled").text("确定");
				}
			},
			error : function() {
				changeToError(1);
				$(".doDeleteCampusBtn").removeAttr("disabled").text("确定");
			}
		});
	});
//	// 初始化：认证设置按钮开关
//	$('input[type="checkbox"]').bootstrapSwitch();
	//设置月价格
	$('input[name="priceMonthStatus"]').unbind("switch-change");
	$('input[name="priceMonthStatus"]').on(
			'switch-change',
			function(event, data) {
				if(data.value){
					$('#priceMonthStatus').val(1);//设置开启状态值为正数,表示在新增会员时该收费类型能够被使用
					$('#priceMonth').attr("disabled",false); 
				}else{
					if(isAllcloseSwitch(this.name)){
						
						$('#priceMonthStatus').val(-1);//设置开状态值为负数，表示在新增会员时不显示该收费类型
						$('#priceMonth').attr("disabled",true); 
					}else{
						toastr.warning('至少保留一种收费方式！');
						$(this).bootstrapSwitch('setState', true);
					}
				}
			}
	);
	//设置学期价格
	$('input[name="priceTermStatus"]').unbind("switch-change");
	$('input[name="priceTermStatus"]').on(
			'switch-change',
			function(event, data) {
				if(data.value){
					$('#priceTermStatus').val(1);//设置开启状态值为正数,表示在新增会员时该收费类型能够被使用
					$('#termTimeManagerDiv').show();
					$('#priceTerm').attr("disabled",false); 

				}else{
					if(isAllcloseSwitch(this.name)){
						
						$('#priceTermStatus').val(-1);//设置开状态值为负数，表示在新增会员时不显示该收费类型
						$('#termTimeManagerDiv').hide();
						$('#priceTerm').attr("disabled",true); 
					}else{
						toastr.warning('至少保留一种收费方式！');
						$(this).bootstrapSwitch('setState', true);
					}
				}
			}
	);
	//设置年价格
	$('input[name="priceYearStatus"]').unbind("switch-change");
	$('input[name="priceYearStatus"]').on(
			'switch-change',
			function(event, data) {
				if(data.value){				
					$('#priceYear').attr("disabled",false); 
					$('#priceYearStatus').val(1);//设置开启状态值为正数,表示在新增会员时该收费类型能够被使用
				}else{
					if(isAllcloseSwitch(this.name)){
						$('#priceYearStatus').val(-1);//设置开状态值为负数，表示在新增会员时不显示该收费类型
						$('#priceYear').attr("disabled",true); 
					}else{
						toastr.warning('至少保留一种收费方式！');
						$(this).bootstrapSwitch('setState', true);
					}
				}
			}
	);

	
	// 新增会员成功之后，"继续添加"按钮，执行事件
	$(".doContinueAddCampusBtn").unbind("click");
	$(".doContinueAddCampusBtn").click(function() {
		$('#priceType')[0].selectedIndex  =0;//设为默认选中项
		$('#priceType').change();
		$("#addCampus").show();
		$("#time1").prop("checked", true);
		$("#idType").select2("val", 2);
		$("#month").val("");
	});

}

jQuery.validator
		.addMethod(
				"telephone",
				function(value, element) {
					var tel = /^(((13[0-9]{1})|(14[4-7]{1})|(15[0-9]{1})|(170)|(17[6-8]{1})|(18[0-9]{1}))+\d{8})$/;
					return this.optional(element) || tel.test(value);
				}, "手机号格式不正确");

// 新增会员，表单验证
$("#addCampusForm").validate({
	errorPlacement : function(error, element) {
		error.css({
			display : "inline",
			color : "#F00",
			position : "relative",
		}).appendTo(element.parent().addClass("error"));
	},
	submitHandler : function(form) {

		var sex = $("input[name='sex']:checked").val();
		var month = 1;
		var radioMonth = $("input[name='expirationTimeRadio']:checked").val();
		if (typeof (radioMonth) == "undefined") {
			var inputMonth = $("#month").val();
			if (typeof (radioMonth) != "undefined" && inputMonth != "") {
				month = inputMonth;
			}
		} else {
			month = radioMonth;
		}

		showLoading2("保存中...");

		$.ajax({
			type : "POST",
			url : ctx + "/school/addSchoolMember",
			data : {
				telephone : $.trim($("#telephone").val()),
				idNumber : $.trim($("#idNumber").val()),
				idType : $.trim($("#idType").val()),
				sex : parseInt(sex),
				realname : $.trim($("#name").val()),
				expirationTime : $("#endDate").text(),
				payMoney : $("#payMoney").text()
			//	month : parseInt(month)
			},
			success : function(msg) {// 返回需有用户名、密码
				if (!msg.username) {
					changeToError(1);
				} else {
					$("#addCampus").hide();
					$("#addCampusSuccess").show();
					$("#username").text(msg.username);
					$("#password").text(msg.password);
					$("#addCampusForm")[0].reset();
					changeToSuccess(1);
					flag = 2;
				}
			},
			error : function() {
				changeToError(1);
			}
		});

	},
	rules : {
		telephone : {
			required : true,
			telephone : true,
			remote : {
				type : "POST",
				url : ctx + "/school/telIsExist",
				data : {
					telephone : function() {
						return $("#telephone").val();
					}
				}
			}
		},
		idNumber : {
			required : true,
			rangelength : [ 8, 18 ],
			xszCheck : true,
			sfzCheck : true
		},
		month : {
			number : true,
			digits : true,
			range : [ 1, 12 ]
		},
		name : {
			required : true,
			rangelength : [ 2, 10 ]
		}
	},
	messages : {
		telephone : {
			required : "请输入联系方式",
			telephone : "联系方式格式不正确",
			remote : "该手机号已存在"
		},
		idNumber : {
			required : "请输入证件号码",
			rangelength : "证件号码长度在{0}与{1}之间"
		},
		month : {
			number : "月份为数字",
			digits : "月份为整数",
			range : "月份范围在{0}与{1}月之间"
		},
		name : {
			required : "请输入姓名",
			rangelength : "姓名长度在{0}与{1}之间"
		}
	}
});

// 续费，表单验证
$("#renewForm").validate({
	errorPlacement : function(error, element) {
		error.css({
			display : "inline",
			color : "#F00",
			position : "relative",
		}).appendTo(element.parent().addClass("error"));
	},
	submitHandler : function(form) {

		$(".doRenewBtn").attr("disabled", "disabled").text("保存中...");
		showLoading2("保存中...");
		
		$.ajax({
			type : "POST",
			url : ctx + "/school/renew",
			data : {
				month : $.trim($("#renewMonth").val()),
				priceType: $("#renewType").val(),
				id : curId
			},
			success : function(msg) {// 返回需有用户名、密码
				if (msg == "success") {
					$("#renew").hide();
					$("#campusList").show();
					$("#renewForm")[0].reset();
					$(".doRenewBtn").removeAttr("disabled").text("确定");
					changeToSuccess(1);
					getSchoolMemberList(1);
				} else {
					changeToError(1);
					$(".doRenewBtn").removeAttr("disabled").text("确定");
				}
			},
			error : function() {
				changeToError(1);
				$(".doRenewBtn").removeAttr("disabled").text("确定");
			}
		});

	},
	rules : {
		renewMonth : {
			number : true,
			digits : true,
			range : [ 1, 12 ]
		}
	},
	messages : {
		renewMonth : {
			number : "月份为数字",
			digits : "月份为整数",
			range : "月份范围在{0}与{1}月之间"
		}
	}
});



//修改会员：密码校验
jQuery.validator.addMethod("password2", function(value, element) {
	var password2=$("#password2").val();
	if (password2=="******") {//密码未做修改
		return this.optional(element) || true;
	}else{
		if (!/^\d{4,16}$/.test(value)){
			return this.optional(element) || false;
		}else{
			return this.optional(element) || true;
		}
	}
}, "密码只能为数字");



// 修改会员，表单验证
$("#editCampusForm").validate({
	errorPlacement : function(error, element) {
		error.css({
			display : "inline",
			color : "#F00",
			position : "relative",
		}).appendTo(element.parent().addClass("error"));
	},
	submitHandler : function(form) {

		var sex = $("input[name='sex2']:checked").val();

		showLoading2("保存中...");

		$.ajax({
			type : "POST",
			url : ctx + "/school/updateSchoolMember",
			data : {
				id : curId,
				telephone : $.trim($("#telephone2").val()),
				idNumber : $.trim($("#idNumber2").val()),
				idType : $.trim($("#idType2").val()),
				sex : parseInt(sex),
				realname : $.trim($("#name2").val()),
				password : $.trim($("#password2").val()),
			},
			success : function(msg) {// 返回需有用户名、密码
				if (msg == "success") {
					changeToSuccess(1);
					$("#editCampus").hide();
					$("#campusList").show();
					getSchoolMemberList(1);
				} else {
					changeToError(1);
				}
			},
			error : function() {
				changeToError(1);
			}
		});

	},
	rules : {
		telephone2 : {
			required : true,
			telephone : true,
			remote : {
				type : "POST",
				url : ctx + "/school/telephoneIsExistInUpdate",
				data : {
					telephone : function() {
						return $("#telephone2").val();
					},
					schoolMemberId:function(){
						return curId;
					}
				}
			}
		},
		password2:{
			required : true,
			rangelength : [ 4, 16 ],
			password2:true
		},
		idNumber2 : {
			required : true,
			rangelength : [ 8, 18 ],
			xszCheck2 : true,
			sfzCheck2 : true
		},
		name2 : {
			required : true,
			rangelength : [ 2, 10 ]
		}
	},
	messages : {
		telephone2 : {
			required : "请输入联系方式",
			telephone : "联系方式格式不正确",
			remote : "该手机号已存在"
		},
		password2:{
			required : "请输入密码",
			rangelength : "密码长度在{0}与{1}之间"
		},
		idNumber2 : {
			required : "请输入证件号码",
			rangelength : "证件号码长度在{0}与{1}之间"
		},
		name2 : {
			required : "请输入姓名",
			rangelength : "姓名长度在{0}与{1}之间"
		}
	}
});

//价格管理表单校验
$("#priceManagerForm").validate({
	errorPlacement : function(error, element) {
		$('<br/>').appendTo(element.parent()); // 有这句就在下方提示错误信息
		error.css({
			display : "inline",
			color : "#F00",
			position : "relative",
		}).appendTo(element.parent().addClass("error"));
	},
	submitHandler : function(form) {
		var priceArray = new Array();//定义数组来存储多个价格信息
		//月付价格json
		var priceMonthJson = {id:$("#priceMonthID").val(),priceType:0,priceValue:$("#priceMonth").val(),priceStatus:$("#priceMonthStatus").val()};
		priceArray.push(priceMonthJson);
		//学期付价格json
		var priceTermJson =  {id:$("#priceTermID").val(),priceType:1,priceValue:$("#priceTerm").val(),priceStatus:$("#priceTermStatus").val(),lastTermEndTime:$("#lastTermEndTime").val(),nextTermEndTime:$("#nextTermEndTime").val()};
		priceArray.push(priceTermJson);
		//年付价格json
		var priceYearJson = {id:$("#priceYearID").val(),priceType:2,priceValue:$("#priceYear").val(),priceStatus:$("#priceYearStatus").val()};
		priceArray.push(priceYearJson);
		//发送数组数据到后台一并保存三种价格
		showLoading2("保存中...");
		$.ajax({
			type : "POST",
			datatype:"json",
		    contentType:'application/json;charset=UTF-8',
			url : ctx + "/schoolPriceInfo/saveSchoolManyPriceInfo",
			data : $.toJSON(priceArray),
			success : function(data) {
					if (data > 0) {
						//保存成功
						toastr.success("保存成功!您可以在新增会员时选择对应的收费方式");
						//隐藏会员列表
						changeToSuccess(1);
						$("#campusList").show();
						//显示价格管理界面
						$("#priceManager").hide();
					}else{
						changeToError(1);
						//保存失败
						toastr.error("保存失败!请再次尝试");
					}
			},
			error : function() {
				changeToError(1);
				toastr.error("保存失败!请再次尝试");
			}
		});
	},rules : {
		priceMonth:{
			required:true,
			digits:true,
			maxlength:4
		},
		priceTerm:{
			required:true,
			digits:true,
			required:true,
			maxlength:4
		},priceYear:{
			required:true,
			digits:true,
			maxlength:4
		},
		lastTermEndTime : {
			required:true
		},nextTermEndTime : {
			required:true
		}
	},messages:{
		priceMonth : {
			required:"请输入金额",
			digits : "只能输入整数!",
			maxlength:"是不是太贵了？还是便宜点儿吧!"
		},priceTerm : {
			required:"请输入金额",
			digits : "只能输入整数!",
			maxlength:"是不是太贵了？还是便宜点儿吧!"
		},priceYear : {
			required:"请输入金额",
			digits : "只能输入整数!",
			maxlength:"是不是太贵了？还是便宜点儿吧!"
		},lastTermEndTime:{
			required:"请选择上半学期结束时间"
		},nextTermEndTime:{
			required:"请选择下半学期结束时间"
		}
	}
});
/**
 * 判断是否全部关闭了switch标签
 * @returns flag (true 为可以关闭标签，false为不可以关闭标签)
 */
function isAllcloseSwitch( objName ){
	var checkboxs = $('input[type="checkbox"]');
	var checkStatus = false;
	for(var i = 0; i < checkboxs.length; i++){
		if(checkboxs[i].name != objName){
			if($(checkboxs[i]).val()>0){
				checkStatus = true;
			}
		}
	}
	return checkStatus;
}
/**
 * 设置会员卡到期时间,仅针对“按学期“收费模式
 */
function setEndTime(){
	var endDate;
	var nowDate = new Date();
	var nowMonth = nowDate.getMonth();
	if(1<nowMonth && nowMonth <7){//判断当前日期是否是在下班半学期(js,Date对象中月份是从0开始的)
		var nextDate = next_term_time.split("-") ;
		endDate = new Date(nowDate.getFullYear() + "-" +nextDate[1] + "-" + nextDate[2] );
	}else{//当前时间为上班半学期
		var  lastDate= last_term_time.split("-") ;
		endDate = new Date((nowDate.getFullYear()+1) + "-" + lastDate[1] + "-" +lastDate[2]);
	}
	$("#endDate").text(endDate.format('yyyy-MM-dd'));
	
}
/**
 * 年收费模式下到期时间设置
 */
function setYearTypeEndTime(){
		$("#endDate").text(new Date().DateAdd('y', 1).format('yyyy-MM-dd'));
}
/**
 * 获取校园财务概览信息
 */
function getTotalFinanace(){
	
	$.ajax({
		type : "POST",
		url : ctx + "/schoolFinanceInfo/totalFinanace",
		success : function(data) {
			  var totalFinanace = $.evalJSON(data);
			  if(totalFinanace.totalFinanace){
				  $("#totlFinance").text(totalFinanace.totalFinanace);
			  }
			  if(totalFinanace.currentMonthTotal){
				  $("#currentMonth").text(totalFinanace.currentMonthTotal);
			  }
			  if(totalFinanace.lastMonthTotal){
				  $("#lastMonth").text(totalFinanace.lastMonthTotal);
			  }
		},
		error : function() {
			toastr.error("查询失败!请再次尝试");
		}
	});
}