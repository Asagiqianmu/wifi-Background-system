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

var reg1 = /^\d{1,11}$/;// 1-11位的数字
var reg2 = /^[0-9]{1}([.]{1}[0-9]{1}){0,1}$/;// 折扣额度校验
var reg3 = /^[1-9]\d{0,3}$/;// 优惠金额校验
var reg4 = /^[1-9]\d{0,2}$/;// 优惠券数量
var reg5 = /^[a-zA-Z0-9\u4e00-\u9fa5-_]{1,64}$/;// 优惠券使用规则
var reg6 = /^[\s\S]{1,100}$/;// 优惠券使用说明
var reg7=/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;//email
var reg8=/^[A-Za-z0-9_-]{6,16}$/;//密码

var reg9=/^(((13[0-9]{1})|(14[4-7]{1})|(15[0-9]{1})|(170)|(17[6-8]{1})|(18[0-9]{1}))+\d{8})$/;//手机号码：
var reg10 =/^(((13[0-9]{1})|(14[4-7]{1})|(15[0-9]{1})|(170)|(17[6-8]{1})|(18[0-9]{1}))+\d{8})$|(^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$)/;//邮箱或手机号

var reg11 = /^[a-zA-Z0-9\u4e00-\u9fa5-_]{1,16}$/;// 1-16位中英文数字
var reg12 = /^https?:\/\/(([a-zA-Z0-9_-])+(\.)?)*(:\d+)?(\/((\.)?(\?)?=?&?[a-zA-Z0-9_-](\?)?)*)*$/;
var reg13=/^[a-zA-Z\u4e00-\u9fa5]{2,6}$/;
var reg14=/^[1-9][0-9]{4,20}$/;//qq号
var reg15=/^([0-9])\d{10}$/;//手机号码：

