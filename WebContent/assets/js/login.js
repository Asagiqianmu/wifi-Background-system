//记住用户名密码
function Save() {
    if ($("#checkbox_pwd").attr("checked")) {
      	var str_username = $("#doc-ipt-email-1").val();
      	var str_password = $("#doc-ipt-pwd-1").val();
      	$.cookie("rmbUser", "true", { expires: 7 }); //存储一个带7天期限的cookie
      	$.cookie("username", str_username, { expires: 7 });
      	$.cookie("password", str_password, { expires: 7 });
    } else {
      	$.cookie("rmbUser", "false", { expire: -1 });
      	$.cookie("username", "", { expires: -1 });
      	$.cookie("password", "", { expires: -1 });
    }
};


$(function() {
	//登陆js
	$("#sub_btn").on("click", function() {
		var username = $.trim($("#userName").val());
		var password = $("#passWord").val();
		if (username == "") {
			$("#userName").focus();
			return false;
		} else if (password == "") {
			$("#passWord").focus();
			return false;
		}else{
			toLogin(username,password)
		}
	});

});

//去登陆
function toLogin(username,password) {
	$.ajax({
		type : "post",
		url : ctx + "/doLogin",
		data : {
			userName : username,
			passWord : password
		},
		success : function(data) {
			if (data.code == 200) {
				alert("登录成功！！");
//				地址栏跳转访问
//				window.location.href=ctx+"/userList"
			} else {
				alert("登录失败@-@");
			}
		}

	});
}

