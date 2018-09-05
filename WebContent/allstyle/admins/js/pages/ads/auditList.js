/**
 * 
 */

var curId;

Date.prototype.Format = function(fmt) { // author: meizz
	var o = {
		"M+" : this.getMonth() + 1, // 月份
		"d+" : this.getDate(), // 日
		"h+" : this.getHours(), // 小时
		"m+" : this.getMinutes(), // 分
		"s+" : this.getSeconds(), // 秒
		"q+" : Math.floor((this.getMonth() + 3) / 3), // 季度
		"S" : this.getMilliseconds()
	// 毫秒
	};
	if (/(y+)/.test(fmt))
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "")
				.substr(4 - RegExp.$1.length));
	for ( var k in o)
		if (new RegExp("(" + k + ")").test(fmt))
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k])
					: (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
}

// 默认筛选条件
var _val = 1;
var _text = "请输入您要搜索的广告主";
$(function() {

	// 审核广告选中状态
	$("#reviewAds").addClass("active");
	// 左侧箭头指向审核广告菜单
	var pointer = $("<div/>").addClass("pointer");
	var arrow = $("<div/>").addClass("arrow").appendTo(pointer);
	var arrow_border = $("<div/>").addClass("arrow_border").appendTo(pointer);
	$("#reviewAds").prepend(pointer);

	// select2 plugin for select elements
	$(".select2").select2({
		placeholder : "Select a State"
	});

	getAdsList(1);

	// 搜索按钮执行事件
	$(".searchBtn").click(function() {
		getAdsList(1);
	});

	// 筛选列表改变，执行事件
	$("#adsSelect").change(
			function() {
				_val = $("#adsSelect").val();
				if (_val == "4") {
					$("#searchInput").hide();
					$("#roleSeletDiv").show();
				} else {
					$("#searchInput").show();
					$("#roleSeletDiv").hide();
					var _text = $("select[name=userSelect]").find(
							"option:selected").text();
					$("#searchInput").val("").attr("placeholder",
							"请输入您要搜索的" + _text);
				}

			});

});

/**
 * 加载广告列表
 */
function getAdsList(num) {

	showLoading();

	if (num == undefined)
		return;
	if (isNaN(num))
		return;

	var _val = $("#adsSelect").val();
	var text = $("#searchInput").val();
	if (_val == "4") {
		text = $("#roleSelect").val();
	}

	$.ajax({
		type : "POST",
		url : "getAudiList",
		data : {
			curPage : num,
			pageSize : 30,
			val : _val,
			text : text

		},
		success : function(data) {
			eval("data = " + data);
			if (data.code == 200) {
				$('body,html').animate({
					scrollTop : 0
				}, 1000);
				// 调用分页
				pageHandle("pager", "adsTbody", data.data, num, getAdsList,
						buildTable);
				changeToSuccess(1);
				initEvent();
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
		if (i == 0) {
			tr.addClass("first");

		}
		var img = $("<img/>").attr("src", data[i].imageUrl).addClass(
				"img-circle avatar hidden-phone showBigImg");
		if(data[i].adType==2){//视频广告 
			img=$("<a href='javascript:void(0);' videoUrl='"+data[i].imageUrl+"' name='adVideo'/>").append($("<span/>").attr("src", data[i].videoPicUrl).addClass(
			" icon-film avatar hidden-phone showBigImg"));
			
		}
		
		var tdImg = $("<td/>").append(img).appendTo(tr);
		
		var tdDesc = $("<td/>").html(subStr(data[i].title+"__"+data[i].txtView)).appendTo(tr);
		var tdImgUrl = $("<td/>").html("<a href='"+data[i].adUrl+"' target='_blank'>"+subStr(data[i].adUrl)+"</a>").appendTo(tr);
		var tdUser = $("<td/>").text(data[i].realname).appendTo(tr);
		var tdContact = $("<td/>").text(data[i].contact).appendTo(tr);
		var tdPMCM = $("<td/>").text(data[i].num + "/" + data[i].pnum)
				.appendTo(tr);
		var tdAreaName = $("<td/>").html(
				(data[i].areaName == "") ? ("全国") : (subStr(data[i].areaName)))
				.appendTo(tr);
		$("<td/>").html("<a href='javascript:void(0);' typeIds='"+data[i].typeIds+"' typeNames='"+data[i].typeNames+"' adType='"+data[i].adType+"' videoNameUrl='"+data[i].imageUrl+"' isPass='"+data[i].isPass+"' name='changeTargType'>"+subStr(data[i].typeNames)+"</a>").appendTo(tr);
		var status = data[i].status;
		if (status == 1) {// 1待审核
			var tdStatus = $("<td/>").addClass("status").html(
					"<span class='label label-info'>待审核</span>").appendTo(tr);
			var tdOperate = $("<td/>").appendTo(tr);
			var ul = $("<ul/>").addClass("actions ul operate").appendTo(
					tdOperate);
			var li1 = $("<li/>").appendTo(ul);
			var i1 = $("<i/>").attr("data-toggle", "tooltip").attr("title",
					"通过").addClass("icon-ok msg ok").css("cursor", "pointer")
					.appendTo(li1);
			var li2 = $("<li/>").appendTo(ul);
			var i2 = $("<i/>").attr("data-toggle", "tooltip").attr("title",
					"不通过").addClass("icon-remove msg fail").css("cursor",
					"pointer").appendTo(li2);
			var li3 = $("<li/>").appendTo(ul);
			var i3 = $("<i/>").attr("data-toggle", "tooltip").attr("title",
					"查看报表").addClass("icon-eye-open msg toAdLogBtn").css(
					"cursor", "pointer").appendTo(li3);
		} else if (status == 2) {// 2投放中
			var tdStatus = $("<td/>").addClass("status").html(
					"<span class='label label-success'>投放中</span>")
					.appendTo(tr);
			var tdOperate = $("<td/>").appendTo(tr);
			var ul = $("<ul/>").addClass("actions ul operate").appendTo(
					tdOperate);
			var li1 = $("<li/>").appendTo(ul);
			var i1 = $("<i/>").attr("data-toggle", "tooltip").attr("title",
					"暂停投放").addClass("icon-pause msg stopPutBtn").css("cursor",
					"pointer").appendTo(li1);
			var li2 = $("<li/>").appendTo(ul);
			var i2 = $("<i/>").attr("data-toggle", "tooltip").attr("title",
					"查看报表").addClass("icon-eye-open msg toAdLogBtn").css(
					"cursor", "pointer").appendTo(li2);
		} else if (status == 3) {// 3未通过审核
			var tdStatus = $("<td/>").addClass("status").html(
					"<span class='label'>未通过</span>").appendTo(tr);
			var tdOperate = $("<td/>").appendTo(tr);
			var ul = $("<ul/>").addClass("actions operate").appendTo(tdOperate);
			var li3 = $("<li/>").appendTo(ul);
			var i3 = $("<i/>").attr("data-toggle", "tooltip").attr("title",
					"查看报表").addClass("icon-eye-open msg toAdLogBtn").css(
					"cursor", "pointer").appendTo(li3);
		} else if (status == 4) {// 4暂停中
			var tdStatus = $("<td/>").addClass("status").html(
					"<span class='label label-warning'>暂停中</span>")
					.appendTo(tr);
			var tdOperate = $("<td/>").appendTo(tr);
			var ul = $("<ul/>").addClass("actions operate").appendTo(tdOperate);
			var li1 = $("<li/>").appendTo(ul);
			var i1 = $("<i/>").attr("data-toggle", "tooltip").attr("title",
					"继续投放").addClass("icon-play msg startPutBtn").css("cursor",
					"pointer").appendTo(li1);
			var li2 = $("<li/>").appendTo(ul);
			var i2 = $("<i/>").attr("data-toggle", "tooltip").attr("title",
					"查看报表").addClass("icon-eye-open msg toAdLogBtn").css(
					"cursor", "pointer").appendTo(li2);
		} else if (status == 5) {// 5投放结束
			var tdStatus = $("<td/>").addClass("status").html(
					"<span class='label'>已结束</span>").appendTo(tr);
			var tdOperate = $("<td/>").appendTo(tr);
			var ul = $("<ul/>").addClass("actions operate").appendTo(tdOperate);
			var li2 = $("<li/>").appendTo(ul);
			var i2 = $("<i/>").attr("data-toggle", "tooltip").attr("title",
					"查看报表").addClass("icon-eye-open msg toAdLogBtn").css(
					"cursor", "pointer").appendTo(li2);
		} else {
			var tdStatus = $("<td/>").addClass("status").html("").appendTo(tr);
			var tdOperate = $("<td/>").appendTo(tr);
			var ul = $("<ul/>").addClass("actions").appendTo(tdOperate);
		}

	}

}
// 字符太多，显示几个，鼠标以上显示全部字符
function subStr(str) {
	if (str.length < 15) {
		return str;
	}
	return "<span data-toggle='tooltip' class='msg' title='" + str + "'>"
			+ str.substring(0, 12) + "..." + "</span>";
}

function initEvent() {
	$('.msg').tooltip('hide');

	// 列表中，鼠标移在图片上，显示预览
	$(".showBigImg").each(function() {
		var img = $(this).attr("src");
		$(this).popover({
			trigger : 'hover',
			placement : 'right',
			html : 'true',
			content : '<img src="' + img + '" />',
			animation : false
		}).on("mouseover", function() {
			var _this = this;
			$(this).popover("show");
			$(this).siblings(".popover").on("mouseleave", function() {
				$(_this).popover('hide');
			});
		}).on("mouseout", function() {
			var _this = this;
			setTimeout(function() {
				if (!$(".popover:hover").length) {
					$(_this).popover("hide");
				}
			}, 100);
		});
	});

	$(".ok").unbind("click");
	$(".ok").click(function() {
		curId = $(this).closest("tr").attr("id");
		var isPass =$(this).closest("td").prev().prev().find("a").attr("isPass");
		var adType =$(this).closest("td").prev().prev().find("a").attr("adType");
		var videoNameUrl=$(this).closest("td").prev().prev().find("a").attr("videoNameUrl");

		if(isPass!=""&&isPass.indexOf("1")==-1){
			alert("请先选择广告投放的类型，再审核通过！");
			return ;
		}
		if(adType==2){
			if(videoNameUrl.indexOf("_ok")==-1){
				alert("请先上传转换过的视频文件，再审核通过！");
				return ;
			}
		}
		
		$("#okModal").modal({
			backdrop : "static"
		});
	});

	$(".doOkBtn").unbind("click");
	$(".doOkBtn")
			.click(
					function() {
						$
								.ajax({
									async : false,
									type : "post",
									url : "setAdsStatus",
									data : {
										id : curId,
										status : 2,
										auditingOption : ""
									},
									success : function(msg) {
										if ("true" == msg) {
											alert("操作成功");
											$("#" + curId)
													.find(".status")
													.html(
															"<span class='label label-success'>已通过</span>");
											$("#" + curId).find(".ul").empty();
											$("#okModal").modal("hide");
										} else {
											alert("操作失败");
										}
									}
								});
					});

	//修改广告投放店铺类型
	$("a[name='changeTargType']").unbind("click");
	// 暂停投放按钮，click事件
	$("a[name='changeTargType']").click(function() {
		curId = $(this).closest("tr").attr("id");
		var typeIds= $(this).attr("typeIds").split(",");
		var typeNames= $(this).attr("typeNames").split(",");
		var isPass=$(this).attr("isPass").split(",");
		var html="";
		for(var i=0;i<typeIds.length;i++){
			if(isPass[i]==1)html+="<input type='checkbox' name='types' value='"+typeIds[i]+"' checked>"+"&nbsp;"+typeNames[i]+"&nbsp;|&nbsp;";
			else html+="<input type='checkbox' name='types' value='"+typeIds[i]+"'>"+"&nbsp;"+typeNames[i]+"&nbsp;|&nbsp;";
			
			if(i!=0&&(i+1)%7==0){html+="<br>";}
			
		}
		$("#typeCheck").html(html);
		$("#checkAdTargType").modal({
			backdrop : "static"
		});
	});
	
	
	$(".disSelectAll").unbind("click");
	$(".disSelectAll").click(function() {
		var typesIds=$("input[name='types']");
		for(var i=0;i<typesIds.length;i++){
			typesIds[i].checked=false;
		}
		
	});
	
	$(".doCheckOkBtn").unbind("click");
	$(".doCheckOkBtn").click(function() {
		var typesIds=$("input[name='types']:checked");
		var Ids="";
		for(var i=0;i<typesIds.length;i++){
			if(i==typesIds.length-1)Ids+=typesIds[i].value;
			else Ids+=typesIds[i].value+",";
		}
		
		if(Ids==""){
			$("#adTypeInfo").html("请选择广告投放类型");
			setTimeout("$('#adTypeInfo').html('');",3000);
			return;
		}
		$.ajax({
			type : "post",
			url : "setTargTypes",
			data : {
				typeIds : Ids,
				adId:curId
			},
			success : function(data) {
				eval("data = " + data);
				if (data.code == 200) {
					toastr.success("操作成功");
					$("#checkAdTargType").modal("hide");
					window.location.reload();
				} else {
					toastr.error(data.msg);
				}
			},
			error : function() {
				toastr.error("修改失败");
			}
		});
		
	});
	

	//修改广告video
	$("a[name='adVideo']").unbind("click");
	$("a[name='adVideo']").click(function() {
		curId = $(this).closest("tr").attr("id");
		var videoUrl=$(this).attr("videoUrl");
		$(".downLoadVideo").attr("href",videoUrl);
		$("#changeAdVideo").modal({
			backdrop : "static"
		});
	});
	
	$(".doChangeAdVideoOkBtn").unbind("click");
	$(".doChangeAdVideoOkBtn").click(function() {
		var fileValue=$("#videoAd").val();
		if(fileValue==""||fileValue.indexOf(".mp4")==-1){
			$("#changeAdVideoInfo").html("请上传后缀为mp4的文件");
			return;}
		$("#changeAdVideoInfo").html("");
		$(".doChangeAdVideoOkBtn").html("正在上传");
		$(".doChangeAdVideoOkBtn").attr("disabled",true);
		
		$.ajaxFileUpload({
			url : "uploadVideo", // 用于文件上传的服务器端请求地址
			type : 'post',
			secureuri : false, // 是否需要安全协议，一般设置为false
			fileElementId : 'videoAd', // 文件上传域的ID
			dataType : 'json', // 返回值类型 一般设置为json,
			data : {
				maxSize : 10240,
				adId:curId,
				path:$(".downLoadVideo").attr("href")
				// 限制大小10m
			},
			success : function(data, status) // 服务器成功响应处理函数
			{
				$(".doChangeAdVideoOkBtn").attr("disabled",false);
				$(".doChangeAdVideoOkBtn").html("确认");
				if (data.isSuccess == "true") {
					toastr.success('上传视频成功！');
					
					$("#changeAdVideo").modal("hide");
					window.location.reload();
				} else {
					if (data.errorType == "1") {
						toastr.error('上传视频过大，请控制在 10M 以内！');
					}
					if (data.errorType == "2") {
						toastr.error('请上传视频文件！');
					}
					if (data.errorType == "3") {
						toastr.error('参数有误，请刷新再试！');
					}
				}
			},
			error : function(data, status, e)// 服务器响应失败处理函数
			{
				toastr.error('上传失败！');
				$(".doChangeAdVideoOkBtn").attr("disabled",false);
				$(".doChangeAdVideoOkBtn").html("确认");
			}
		});
		setTimeout(function(){
			$(".doChangeAdVideoOkBtn").attr("disabled",false);
			$(".doChangeAdVideoOkBtn").html("确认");
		},4000);
		
	});
	
	$(".stopPutBtn").unbind("click");
	// 暂停投放按钮，click事件
	$(".stopPutBtn").click(function() {
		curId = $(this).closest("tr").attr("id");
		$("#stopPutModal").modal({
			backdrop : "static"
		});
	});

	$(".doStopPutBtn").unbind("click");
	$(".doStopPutBtn")
			.click(
					function() {
						$
								.ajax({
									async : false,
									type : "post",
									url : "stopOrStartPublish",
									data : {
										id : curId,
										type : 1
									},
									success : function(data) {
										eval("data = " + data);
										if (data.code == 200) {
											toastr.success("操作成功");
											$("#" + curId)
													.find(".status")
													.html(
															"<span class='label label-warning'>暂停中</span>");
											var ul = $("#" + curId).find(
													".operate");
											ul.empty();
											var li1 = $("<li/>").appendTo(ul);
											var a1 = $("<a/>").addClass(
													"startPutBtn").css(
													"cursor", "pointer").text(
													"继续投放").appendTo(li1);
											initEvent();
											$("#stopPutModal").modal("hide");
										} else {
											toastr.error(data.msg);
										}
									},
									error : function() {
										toastr.error("修改失败");
									}
								});
					});

	// 查看报表按钮，click事件
	$(".toAdLogBtn").unbind("click");
	$(".toAdLogBtn").click(function() {
		curId = $(this).closest("tr").attr("id");
		window.location.href = ctx + "/admins/goAdLog/" + curId;
	});

	$(".startPutBtn").unbind("click");
	// 暂停投放按钮，click事件
	$(".startPutBtn").click(function() {
		curId = $(this).closest("tr").attr("id");
		$("#startPutModal").modal({
			backdrop : "static"
		});
	});

	$(".doStartPutBtn").unbind("click");
	$(".doStartPutBtn")
			.click(
					function() {
						$
								.ajax({
									async : false,
									type : "post",
									url : "stopOrStartPublish",
									data : {
										id : curId,
										type : 2
									},
									success : function(data) {
										eval("data = " + data);
										if (data.code == 200) {
											toastr.success("操作成功");
											$("#" + curId)
													.find(".status")
													.html(
															"<span class='label label-success'>投放中</span>");
											var ul = $("#" + curId).find(
													".operate");
											ul.empty();
											var li1 = $("<li/>").appendTo(ul);
											var a1 = $("<a/>").addClass(
													"stopPutBtn").css("cursor",
													"pointer").text("暂停投放")
													.appendTo(li1);
											initEvent();
											$("#startPutModal").modal("hide");
										} else {
											toastr.error(data.msg);
										}
									},
									error : function() {
										toastr.error("修改失败");
									}
								});
					});

	$(".fail").unbind("click");
	$(".fail").click(function() {
		curId = $(this).closest("tr").attr("id");
		$("#failModal").modal({
			backdrop : "static"
		});
	});

	$(".doFailBtn").unbind("click");
	$(".doFailBtn").click(
			function() {
				var auditingOption = $("#auditingOption").val();
				if (auditingOption.length < 1 || auditingOption.length > 250) {
					alert("意见长度限制在0-250字符内！");
					return false;
				}
				$.ajax({
					async : false,
					type : "post",
					url : "setAdsStatus",
					data : {
						id : curId,
						status : 3,
						auditingOption : $("#auditingOption").val()
					},
					success : function(msg) {
						if ("true" == msg) {
							toastr.success("操作成功");
							$("#" + curId).find(".status").html(
									"<span class='label'>未通过</span>");
							$("#" + curId).find(".ul").empty();
							$("#failModal").modal("hide");
							$("#auditingOption").val("");
						} else {
							toastr.error("操作失败");
						}
					},
					error : function() {
						toastr.error("操作失败");
					}
				});
			});
}
