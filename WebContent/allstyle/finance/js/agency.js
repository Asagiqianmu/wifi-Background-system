/**
 * Created by Administrator on 2016/9/28.
 */
(function() {
	// 展开收起左侧菜单
	$('.module').click(function() {
		shouzhan();
	});
	$('.incline').click(function() {
		shouzhan();
	});

	// 展开收起左侧菜单
	function shouzhan() {
		var str = $('#leftNav').attr('class');
		if (str == 'on') {
			$('#leftNav').removeClass('on');
			$('.inBtn').removeClass('on');
			$('.cTitle').addClass('on');
			$('.content').addClass('on');
			$('.incline').addClass('on');
		} else {
			$('#leftNav').addClass('on');
			$('.inBtn').addClass('on');
			$('.cTitle').removeClass('on');
			$('.content').removeClass('on');
			$('.incline').removeClass('on');
		}
	}

	queryByNameOrTel(1, 1);
	getListTotal(1)

	$('#search').click(function() {
		// if ($('#ag-input').val()) {
		queryByNameOrTel(1, 1);
		getListTotal(1)
		// }

	})
})()

/**
 * 根据代理商账号获得所有的场所
 * 
 * @param username
 */
function queryByNameOrTel(currentPage, isNext) {

	var name = $('#ag-input').val();

	// console.log(name);
	var username = '';
	var realname = '';
	if (!(/^1[34578]\d{9}$/.test(name))) {
		console.log('不是手机号');
		realname = name;
		// console.log('realname：'+realname,'username：'+ username);
	} else {
		console.log('是手机号');
		username = name;
		// console.log('realname：'+realname,'username：'+ username);
	}

	$.ajax({
		type : 'post',
		data : {
			username : username,
			realname : realname,
			currentPage : currentPage
		},
		url : ctx + "/SettlementRatio/queryByNameOrTel",
		success : function(data) {
			// eval("data="+data)
			// console.log(data)
			data = JSON.parse(data)
			console.log(data)
			if (data.code == 200) {
				$('#ku').hide();
				listHtml1(data);
//				if (isNext) {
//					
//				}
			} else {
				$(".win>span").html("代理商暂未开通场所");
				winHint();
				$('#dataList').html('');
				$('#ku').show();
				return;
			}
		},
		error : function() {
			$(".win>span").html("网络繁忙请稍后");
			winHint();
		}
	});
}
function getListTotal(currentPage){
	var name = $('#ag-input').val();

	// console.log(name);
	var username = '';
	var realname = '';
	if (!(/^1[34578]\d{9}$/.test(name))) {
		console.log('不是手机号');
		realname = name;
		// console.log('realname：'+realname,'username：'+ username);
	} else {
		console.log('是手机号');
		username = name;
		// console.log('realname：'+realname,'username：'+ username);
	}

    $.ajax({
	type : 'POST',
	url : ctx + "/SettlementRatio/getTotalPage",
	data : {
		username : username,
		realname : realname,
		currentPage : currentPage
	},
	success : function(data) {
		eval('data=' + data);
		
		// 分页
		if(data.code!=201&&data.data!=0){
			pages(data.totoalNum,function(Cpage){
				queryByNameOrTel(Cpage)
			});
		}
	}
});
}
function listHtml1(data) {
	var list = '';
	$('#dataList').html('');
	list = '<tr><th>代理商姓名</th><th>电话</th><th>运营场所</th><th>支付宝</th><th>银行卡</th><th>管理员</th><th>管理员电话</th></tr>'
	for (var i = 0; i < data.data.length; i++) {
		list += '<tr>' + '<td>' + (data.data[i].real_name==undefined?'未知':(data.data[i].real_name==null?'未知':data.data[i].real_name)) + '</td>' + '<td>'
				+ data.data[i].user_name + '</td>' + '<td>'
				+ data.data[i].site_name + '</td>';
		if (pay(data.data[i].bankcar_num) && !email(data.data[i].bankcar_num)) {
			list += '<td>未知</td>' + '<td>' + data.data[i].bankcar_num + '</td>';
		} else {
			list += '<td>' + data.data[i].bankcar_num + '</td>' + '<td>未知</td>';
		}
		list += '<td>未知</td>' + '<td>未知</td>' + '</tr>';

	}
	$('#dataList').append(list)

}
//邮箱正则
function email(content) {
	var regex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	if (regex.test(content)) {
		return true;
	}
	return false;
}
//银行卡正则
function pay(content) {
	var regex = /^\d{16}|\d{19}$/;
	if (regex.test(content)) {
		return true;
	}
	return false;
}

