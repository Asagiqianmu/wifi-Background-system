/**
* 文本框校验 20140827
* 
* @param obj
*            文本框对象
* @param isNull
*            1,不可为空，0可为空
* @param objDiv
*            文本框所在DIV
* @param objError
*            错误信息位置
* @param objReg
*            正则校验
* @returns {Boolean} ok、false
*/
function checkInput(ob, isNotNull, objReg) {
	var objFlag = false;
	var obj=$("#"+ob.id);
	var content = obj.val();
	content=content.replace(/^(\s|\u00A0)+/,'').replace(/(\s|\u00A0)+$/,'');
	var objDiv = $("#"+ob.id+"Div");
	var objError = $("#"+ob.id+"Error");
	if (content) {
		if (objReg != "") {// 正则校验
			if (objReg.test(content)) {// ok
					objFlag = true;
					objDiv.removeClass("error");
					objError.text("");
			} else {
				objFlag = false;
				objDiv.addClass("error");
				objError.text("格式错误");
				//obj.focus();
				//obj.val(obj.val());
			}
		} else {
			// 正则校验规则错为空
		}
	} else {
		if (1 == isNotNull) {// 不可为空
			objFlag = false;
			objDiv.addClass("error");
			objError.text("不能为空");
			//obj.focus();
			//obj.val(obj.val());
		} else {
			objFlag = true;
			objDiv.removeClass("error");
			objError.text("");
		}
	}
	return objFlag;
}

function checkInput(ob, isNotNull, objReg,str) {
	var objFlag = false;
	var obj=$("#"+ob.id);
	var content = obj.val();
	if(content!=undefined){
		content=content.replace(/^(\s|\u00A0)+/,'').replace(/(\s|\u00A0)+$/,'');
	}
	var objError = $("#"+ob.id+"Error");
	if (content) {
		if (objReg != "") {// 正则校验
			if (objReg.test(content)) {// ok
					objFlag = true;
					objError.text("");
			} else {
				objFlag = false;
				objError.text(str);
			}
		} else {
			// 正则校验规则错为空
		}
	} else {
		if (1 == isNotNull) {// 不可为空
			objFlag = false;
			objError.text(str);
			//obj.focus();
			//obj.val(obj.val());
		} else {
			objFlag = true;
			objError.text("");
		}
	}
	return objFlag;
}

function checkNewPassword(oldPass,ob,i){
	var flag=checkInput(ob,i,reg8);
	if(flag){
		var pas=ob.value;
		if(oldPass==pas){
			flag=false;
			$("#"+ob.id+"Div").addClass("error");
			$("#"+ob.id+"Error").text("新密码不能与旧密码一样！");
		}
	}
	return flag;
}

function confirmNewPassword(newPass,ob,i){
	var flag=checkInput(ob,i,reg8);
	if(flag){
		var pas=ob.value;
		if(newPass!=pas){
			flag=false;
			$("#"+ob.id+"Div").addClass("error");
			$("#"+ob.id+"Error").text("两次输入密码不一样！");
		}
	}
	return flag;
}

function checkDateInput(ob,errorId){
	var objFlag = false;
	var content = ob.val();
	if ("" == content) {
		objFlag = false;
		$("#"+errorId+"Error").text("不能为空");
	} else {
		objFlag = true;
		$("#"+errorId+"Error").text("不能为空");
	}
	return objFlag;
}


//比较两个日期大小
function checkDateIsOk(startTime, endTime,divId) {
	var flag = false;
	if ("" != startTime) {
		if ("" != endTime) {
			
			var myDate = new Date();
			var dateStr=myDate.getFullYear()+"/"+(myDate.getMonth()+1)+"/"+myDate.getDate();
			
			startTime=startTime.replace(/-/g, "/");
			endTime=endTime.replace(/-/g, "/");
			var startTime = new Date(startTime).getTime();
			var endTime = new Date(endTime).getTime();
			if(startTime<new Date(dateStr).getTime()||endTime<new Date(dateStr).getTime()){
				flag = false;
				$("#"+divId+"Error").text("日期不能小于当前时间");
			}else if (startTime > endTime) {
				$("#"+divId+"Error").text("结束日期不能小于开始日期");
				return false;
			} else {
				$("#"+divId+"Error").text("");
				return true;
			}
		} else {
			$("#"+divId+"Error").text("结束日期未填写");
			return false;
		}
	} else {
		$("#"+divId+"Error").text("开始日期未填写");
		return false;
	}
	
}

var reg1 = /^\d{1,12}$/;// 1-12位的数字
var str1="请输入1-12位的数字";
var reg2 = /^[1-9]{1}([.]{1}[0-9]{1}){0,1}$|^[0]{1}([.]{1}[1-9]{1}){0,1}$/;// 折扣额度校验
var str2="请输入数字，格式类似为‘8.5’";
var reg3 = /^[1-9]\d{0,3}$|^10000$/;// 优惠金额校验
var str3="请输入数字，不能超过10000";
var reg4 = /^[1-9]\d{0,3}$|^10000$/;// 优惠券数量
var str4="请输入数字，不能超过10000";
var reg5 = /^[a-zA-Z0-9\u4e00-\u9fa5-_()（）.]{1,16}$/;// 优惠券使用规则
var str5="请输入中英文、汉字或下划线括号和点，16个字符以内";
var reg6 = /^[\s\S]{1,100}$/;// 优惠券使用说明
var str6="输入字符长度在100以内";
var reg7=/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;//email
var str7="请输入email地址";
var reg8=/^[A-Za-z0-9_-]{6,16}$/;//密码
var str8="请输入字母数字下划线短横，6-16位长度";
var reg9 = /^(((13[0-9]{1})|(14[4-7]{1})|(15[0-9]{1})|(170)|(17[6-8]{1})|(18[0-9]{1}))+\d{8})$/;// 手机号正则
var str9="请输入手机号码";
var reg10 =/^(((13[0-9]{1})|(14[4-7]{1})|(15[0-9]{1})|(170)|(17[6-8]{1})|(18[0-9]{1}))+\d{8})$|(^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$)/;//邮箱或手机号
var str10="请输入手机号码或email地址";
var reg11 = /^[a-zA-Z0-9\u4e00-\u9fa5-_]{1,16}$/;// 1-16位中英文数字
var str11="请输入字母数字下划线短横，1-16位长度";
var reg12 = /^https?:\/\/(([a-zA-Z0-9_-])+(\.)?)*(:\d+)?(\/((\.)?(\?)?=?&?[a-zA-Z0-9_-](\?)?)*)*$/;
var str12="请输入URL地址";
var reg13=/^[a-zA-Z\u4e00-\u9fa5]{2,6}$/;
var str13="请输入中英文字母、汉字，2-6个字符以内";
var reg14=/^[1-9][0-9]{4,20}$/;//qq号
var str14="请输入QQ号码";
var reg15=/^([0-9])\d{10}$/;//
var str15="请输入数字，长度11位以内";

