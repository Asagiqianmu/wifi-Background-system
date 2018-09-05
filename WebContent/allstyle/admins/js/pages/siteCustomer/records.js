
$(function() {
	
	$("#refresh").click(function(){
		getCustomerList(1);
	});
	
	getCustomerList(1);
	
});	
	


function getCustomerList(num) {
	
	var userName=$("#userName").val();
	var addressRule = /^[\u4E00-\u9FA5A-Za-z0-9]+$/;
	if(userName!=""&&!(addressRule.test(userName)&&userName.length>3&&userName.length<17)){
		$("#userName").val("请输入中英文或数字，长度4~16");
		$("#userName").focus(function(){//绑定聚焦事件，清空内容并解绑事件
			$("#userName").val("");
			$("#userName").unbind("focus");
		});
		return ;
	}
	
	var siteId=$("#siteId").val();
	
	showLoading();
	if (num == undefined)
		return;
	if (isNaN(num))
		return;
	$.ajax({
		type : "POST",
		url : "getUserInfoList",
		data : {
			curPage : num,
			username : userName,
			siteId : siteId,
			pageSize : 10
		},
		success : function(data) {
			eval("data = " + data);
			if (data.code == 200) {
				// 调用分页
				pageHandle("pager", "recordsTbody", data.data, num, getCustomerList, buildTable);
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

function buildTable(data, tableId) {
	var tbody = $("#" + tableId);
	tbody.empty();
	data = data.data;
	var tableHtml="";
	for (var i = 0; i < data.length; i++) {
		tableHtml+="<tr>" +
				"<td>"+data[i].userName+"</td>" +
				"<td>"+data[i].createTime+"</td>" +
				"<td>"+data[i].expirationTime+"</td>" +
				"<td>"+(data[i].transactionAmount==undefined?"0":data[i].transactionAmount)+"</td>" +
				"<td>"+(data[i].countAmount==undefined?"0":data[i].countAmount)+"</td>" +
				"<td>"+data[i].siteName+"</td>" +
				"</tr>";
	}
	tbody.html(tableHtml);
}















