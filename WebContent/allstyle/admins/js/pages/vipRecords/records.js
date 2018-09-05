
$(function() {
	
	getRecordsList(1);
	
	$("#downExcel").click(function(){
		
		window.open("downLoadRecordsExcel");
		
	});
	
});

function getRecordsList(num) {
	showLoading();
	if (num == undefined)
		return;
	if (isNaN(num))
		return;

	$.ajax({
		type : "POST",
		url : "getPaymentRec",
		data : {
			curPage : num,
			pageSize : 20
		},
		success : function(data) {
			eval("data = " + data);
			if (data.code == 200) {
//				$('body,html').animate({
//					scrollTop : 0
//				}, 1000);

				// 调用分页
				pageHandle("pager", "recordsTbody", data.data, num, getRecordsList, buildTable);
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
		
		tableHtml+="<tr><td>"+data[i].storeName+"</td><td>"+data[i].userCode+"</td><td>"+data[i].amount+"</td><td>"+data[i].createTime+"</td></tr>";
		
		
	}

	tbody.html(tableHtml);
}























