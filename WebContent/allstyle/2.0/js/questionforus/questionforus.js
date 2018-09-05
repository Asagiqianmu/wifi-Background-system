$(function(){
	//循环显示隐藏
	clk();
	//关闭窗口
	$(".question_close").on("click",function(){
		$("#img_question").unbind("click");
		$(".navbar2").css("display","none");
		clk();
	});
	//多行文本检查事件
	$("#question_txt").on("keyup",function(){
		var leng=$("#question_txt").val();
		var maxleng=leng.length;
		if(maxleng>=599){
			$("#question_txt").val("");
			var world=leng.substring(0, 600);
			$("#question_txt").val(world);
			maxleng=600;
		} 
		$(".question_msg").html("");
		 $("#question_num").html(maxleng);
	});
	//问题提交
	$("#btn_ques").on("click",function(){

		if(check()==true){	
			$("#btn_ques").attr("disabled","disabled");
			$("#question_txt").attr("readonly","readonly");
			$('#contact').attr("readonly","readonly");
			var title="";
			var question="";
			title=title+"问题反馈人联系方式(自主填写)："+$("#contact").val();
			question=question+"反馈内容如下：\n"+questions();
			sub(title,question);
		}
	});
	//alert(parseInt(253/50));

});
//循环显示隐藏
function clk(){
	$("#img_question").toggle(
			function(){	
				$(".navbar2").css("display","");
				$("#btn_ques").removeAttr("disabled","disabled");
				$("#question_txt").removeAttr("readonly","readonly");
				$('#contact').removeAttr("readonly","readonly");
				$("#contact").val("");
				$("#question_txt").val("");
				$("#question_num").html(0);
				$(".question_msg").html("");
				$("#question_txt").focus();
			},
			function(){
				$(".navbar2").css("display","none");
			}
		);
}
//内容处理
function questions(){
	var con="";
	var val=$("#question_txt").val();
	var num=val.length;
	var i=parseInt(num/50);
	if(num%50!=0){i+=1}
	var begins=0;
	var ends=50;
	for(var j=1;j<=i;j++){
		con=con+val.substring(begins, ends)+"\n";
		begins=ends;
		ends+=50;
	}
	return con;
}
//提交
function sub(title,question){
	$.ajax({
		type : "POST",
		url : ctx+"/sendQuestion/sends",
		data : {
			title:title,
			question:question,
		},
		success : function(msg) {

			eval("msg="+msg);

			if(msg.msg=="false"){
				$(".question_msg").html("");
				$(".question_msg").html("<font color='#FF0000'><b>服务器内部错误!反馈失败!请稍后重试!</b><div id='tim_last'>5</div>秒后关闭窗口...</font>");
			}else if(msg.msg=="errors"){
				$(".question_msg").html("");
				$(".question_msg").html("<font  color='#FF0000'><b>您的提交过频繁,请3分钟后重试</b><div><span id='tim_last'>5</span>秒后关闭窗口...</div></font>");
			}else{
				$(".question_msg").html("");
				$(".question_msg").html("<font  color='#11a7c8'><b>您的反馈信息已成功提交！</b><div><span id='tim_last'>5</span>秒后关闭窗口...</div></font>");
			}
			
			
			timego();
		},
		error : function() {
			$(".question_msg").html("");
			$(".question_msg").html("<font color='#FF0000'>由于网络原因,反馈失败!</font>");
		}
	});
}
//验证
function check(){
	if($("#question_txt").val()==""||$("#question_txt").val()==null){
			$(".question_msg").html("");
			$(".question_msg").html("<font color='#FF0000'>反馈内容不能为空！</font>");
			$("#question_txt").focus();
			return false;
		}
	return true;
}
//倒计时
var MyMar;
function timego(){
	 MyMar=setInterval(timlast,1000);
}

//clearInterval(MyMar);
function timlast(){

	if($("#tim_last").html()==0){
		clearInterval(MyMar);
		$("#img_question").unbind("click");
		
		$(".navbar2").css("display","none");
		clk();
		return ;
	}
	$("#tim_last").html($("#tim_last").html()-1);
	
}
