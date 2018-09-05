<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ page import="java.util.Date"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<c:set var="cssPath" value="${ctx}/allstyle/newstyle/css" />
<c:set var="jsPath" value="${ctx}/allstyle/newstyle" />
<c:set var="imgPath" value="${ctx}/allstyle/newstyle/img" />
<!DOCTYPE html>
<html>
<%
long getTimestamp=new Date().getTime(); //时间戳
%>

<head>
<meta charset="utf-8">
<title>后台管理</title>
<link rel="stylesheet" type="text/css" href="${cssPath}/common.css">
<link rel="stylesheet" type="text/css" href="${cssPath}/general.css">
<link rel="stylesheet" type="text/css" href="${cssPath}/cloudPlace.css">
<style type="text/css">
#sy_time{
    width: 150px;
    height: 30px;
    padding-left: 60px;
    border: 1px solid #03A1B9;
    text-align: center;
    display: block;
    }
    #sy_other_input{
      width: 50px;
      margin-left: 30px;
      margin-right: 4px;
    height: 30px;
    border: 1px solid #03A1B9;
    text-align: center;
    }
    #father_div{
        display: none;
    }
    
  
 .upSpeed-Aset{

    position: relative;
}
#select{
       width: 74px;
    height: 26px;
    border: 1px solid #03A1B9;
    padding-left: 5px;
    margin-left: 10px;
    font-size: 12px;
}
.sele-img{
position: absolute;
    right: 368px;
    top: 477px;
} 
#authStatuss{
border: 1px solid #03A1B9;
width: 261px;
height: 30px;
border: 1px solid #03A1B9;
float: right;
text-align: center;
display: block;float: left;
padding-left: 98px;
}
</style>
<script type="text/javascript">
	var ctx = "${ctx}";
	var from="${fromUrl}";
</script>
<script>
	(function() {
		if (!
		/*@cc_on!@*/
		0)
			return;
		var e = "abbr, article, aside, audio, canvas, datalist, details, dialog, eventsource, figure, footer, header, hgroup, mark, menu, meter, nav, output, progress, section, time, video"
				.split(', ');
		var i = e.length;
		while (i--) {
			document.createElement(e[i]);
		}
		$('html').contextmenu(function() {
			return false;
		});
	});
</script>
</head>
<body>
		<div class="mask opacity"></div>
		<div class="container">
			<p class="cTitle"><span>场所管理</span></p>
			<div class="content">
				<p><span>场所列表</span>
				<c:if test="${user.userName != userNamePA}">
				<button style="float: right;" class="a_btn big add_new_place"><img src="${imgPath}/add.png">&nbsp;&nbsp;&nbsp;新增场所</button>
				</c:if>
				<c:if test="${user.userName == userNamePA}">
				<button style="float: right;" disabled="disabled" class="a_btn big add_new_place"><img src="${imgPath}/add.png">&nbsp;&nbsp;&nbsp;新增场所</button>
				</c:if>
				</p>
				<div class="placeManage">
					<ul class="placeList">
					</ul>
				</div>
				<div class="pager" id="cloudpage">
					<span class="page_first bt">首页</span>
					<span class="page_pre bt">◀</span>
					<span class="page_cont"><i>1</i>/<i>1</i></span>
					<span class="page_next bt">▶</span>
					<span class="page_last bt">尾页</span>
					<input class="page_to" type="text" name="" onkeyup="this.value=this.value.replace(/\D/g,'')">
					<span class="skip bt">跳转</span>
				</div>
			</div>
		</div>
		<!--右侧滑出菜单-->
		<div class="requiment-list">
			<p class="rl-name"><span>添 加 设 备</span><span class="rl-exit tip">&times;</span></p>
			<!--添加设备-->
			<div class="requiment-sty">
				<p style="display: inline-block;">
				<span class="rs-name">选 择 设 备 类 型</span>
				<span class="rs-list tip" ctype="wifidog"><img src="${imgPath}/wifidog.png"/><span class="sele-box"><img src="${imgPath}/strue.png"/></span><br>wifiDog</span>
				<span class="rs-list tip" ctype="coovachilli"><img src="${imgPath}/lajiao.png"/><span class="sele-box"><img src="${imgPath}/sfalse.png"/></span><br>小辣椒</span>
				<span class="rs-list tip" ctype="ikuai"><img src="${imgPath}/aikuai.png"/><span class="sele-box"><img src="${imgPath}/sfalse.png"/></span><br>爱快</span>
				<span class="rs-list tip" ctype="ros"><img src="${imgPath}/router.png"/><span class="sele-box"><img src="${imgPath}/sfalse.png"/></span><br>RouterOS</span>
				<span class="rs-list tip" ctype="h3c"><img src="${imgPath}/h3c.png"/><span class="sele-box"><img src="${imgPath}/sfalse.png"/></span><br>H3C</span>
				<span class="rs-list tip" ctype="moto"><img src="${imgPath}/moto.png"/><span class="sele-box"><img src="${imgPath}/sfalse.png"/></span><br>MOTO</span>
				<span class="rs-list tip" ctype="dunchong"><img src="${imgPath}/dunchong.png"/><span class="sele-box"><img src="${imgPath}/sfalse.png"/></span><br>敦崇</span>
				<span class="rs-list tip" ctype="othere"><img src="${imgPath}/otherequ.png"/><span class="sele-box"><img src="${imgPath}/sfalse.png"/></span><br>其他设备</span>
				</p>
				<!--wifidog-->
				<div class="rs-cont" style="display: none;">
					<p class="input-line"><span class="rs-inputName">G W I D</span><input class="wf_dog_gwid" type="text" placeholder="请输入设备的GWID" readonly="readonly"/></p>
					<p class="input-line"><span class="rs-inputName">设 备 安 装 地 址</span><input class="wf_dog_dvAds" type="text" placeholder="请输入设备安装地址"/></p>	
				</div>
				<!--小辣椒-->
				<div class="rs-cont" style="display: none;">
					<p class="input-line"><span class="rs-inputName nas-tpy">RadiusNAS码<br>(NASID)</span><input class="coova_nsid" readonly="readonly" type="text" value="a56asd9"><span class="copy-btn">复制到剪贴板</span></p>
					<p class="input-line"><span class="rs-inputName">设 备 秘 钥</span><span class="nas-code coova_nas_code"></span></p>
					<p class="input-line"><span class="rs-inputName">设 备 安 装 地 址</span><input class="coova_dvAds" type="text" placeholder="请输入设备安装地址"/></p>
					<p class="input-line"><span class="rs-inputName">用 户 速 度 设 置</span>
						<span class="upSpeed-set">
							<input type="text" class="speed-show" placeholder="请输入设备上传速度" id="coll1" value="" onkeyup="this.value=this.value.replace(/\D/g,'')" maxlength="20"/>
							<span class="sele-pic"><img src="${imgPath}/sele-down.png"/></span>
						</span><span class="danwei" style="margin-right: 30px;"> K B </span>
						<span class="downSpeed-set">
							<input type="text" class="speed-show" placeholder="请输入设备下载速度" id="coll2" value="" onkeyup="this.value=this.value.replace(/\D/g,'')" maxlength="20"/>
							<span class="sele-pic"><img src="${imgPath}/sele-down.png"/></span>
						</span><span class="danwei"> K B </span>
					</p>
					<ul class="speed-list1">
						<li>50</li>
						<li>100</li>
						<li>200</li>
						<li>300</li>
						<li>400</li>
						<li>自定义</li>
					</ul>
					<ul class="speed-list2">
						<li>50</li>
						<li>100</li>
						<li>200</li>
						<li>300</li>
						<li>400</li>
						<li>自定义</li>
					</ul>
				</div>
				<!--爱快-->
				<div class="rs-cont" style="display: none;">
					<p class="input-line"><span class="rs-inputName nas-tpy">RadiusNAS码<br>(NASID)</span><input class="iKuai_nsid" readonly="readonly" type="text" value="a56asd9"><span class="copy-btn">复制到剪贴板</span></p>
					<p class="how-to"><span class="rc-tip">注:请使用该RadiusNAS码在爱快后台进行绑定</span><span class="how-bind">如何绑定&nbsp;<img src="${imgPath}/ask.png"/></span><span class="ask-tip"><img src="${imgPath}/tipPic.png"/></span></p>
					<p class="input-line"><span class="rs-inputName">设 备 秘 钥</span><span class="nas-code iKuai_nas_code"></span></p>
					<p><span class="rc-tip">注:请与爱快后台的秘钥保持一致</span></p>
					<p class="input-line"><span class="rs-inputName">设 备 安 装 地 址</span><input type="text" class="iKuai_dvAds" placeholder="请输入设备安装地址"/></p>
					<p class="input-line"><span class="rs-inputName">用 户 速 度 设 置</span>
						<span class="upSpeed-set">
							<input type="text" class="speed-show1" placeholder="请输入设备上传速度" id="ikuai1" value="" />
							<span class="sele-pic"><img src="${imgPath}/sele-down.png"/></span>
						</span><span class="danwei" style="margin-right: 30px;"> K B</span>
						<span class="downSpeed-set">
							<input type="text" class="speed-show1" placeholder="请输入设备下载速度" id="ikuai2" value="" />
							<span class="sele-pic"><img src="${imgPath}/sele-down.png"/></span>
						</span><span class="danwei"> K B</span>
					</p>
					<ul class="speed-list1">
						<li>50</li>
						<li>100</li>
						<li>200</li>
						<li>300</li>
						<li>400</li>
						<li>自定义</li>
					</ul>
					<ul class="speed-list2">
						<li>50</li>
						<li>100</li>
						<li>200</li>
						<li>300</li>
						<li>400</li>
						<li>自定义</li>
					</ul>
				</div>
				<!--RouterOS-->
				<div class="rs-cont" style="display: none;">
					<p class="input-line"><span class="rs-inputName nas-tpy">RadiusNAS码<br>(NASID)</span><input class="RouterOS_nsid" value="" readonly="readonly"></input></p>
					<!--<p><span class="rc-tip">注:请使用该RadiusNAS码在爱快后台进行绑定</span></p>-->
					<p class="input-line"><span class="rs-inputName">设 备 秘 钥</span><span class="nas-code RouterOS_nas_code"></span></p>
					<!--<p><span class="rc-tip">注:请与爱快后台的秘钥保持一致</span></p>-->
					<p class="input-line"><span class="rs-inputName">设 备 安 装 地 址</span><input class="RouterOS_dvAds" type="text" placeholder="请输入设备安装地址"/></p>
					<p class="input-line"><span class="rs-inputName">用 户 速 度 设 置</span>
						<span class="upSpeed-set">
							<input type="text" class="speed-show2" placeholder="请输入设备上传速度" id="ros1" value="" />
							<span class="sele-pic"><img src="${imgPath}/sele-down.png"/></span>
						</span><span class="danwei" style="margin-right: 30px;"> K B </span>
						<span class="downSpeed-set">
							<input type="text" class="speed-show2" placeholder="请输入设备下载速度" id="ros2" value="" />
							<span class="sele-pic"><img src="${imgPath}/sele-down.png"/></span>
						</span><span class="danwei"> K B </span>
					</p>
					<ul class="speed-list1">
						<li>50</li>
						<li>100</li>
						<li>200</li>
						<li>300</li>
						<li>400</li>
						<li>自定义</li>
					</ul>
					<ul class="speed-list2">
						<li>50</li>
						<li>100</li>
						<li>200</li>
						<li>300</li>
						<li>400</li>
						<li>自定义</li>
					</ul>
					<div class="conf-cont">
						<span>生 成 配 置 文 件</span>
						<p class="confige">
							<span class="config-input" style="margin-top: 0px;"><input type="text" placeholder="请输入设备WAN口端口" id="wankou"/></span>
							<span class="config-input" style="margin-top: 0px;"><input type="text" placeholder="请输入设备LAN口端口" id="lankou"/></span>
							<span class="config-btn">生成配置文件</span>
							<span class="down-config">下载配置文件</span>
							<span class="config-change">修  改</span>	
						</p>
					</div>
				</div>
				<!--H3C-->
				<div class="rs-cont" style="display: none;">
					<p class="input-line"><span class="rs-inputName nas-tpy">RadiusNAS码<br>(NASID)</span><input class="h3c_nsid" onKeyUp="value=value.replace(/[\W]/g,'')" type="text" value=""><span class="copy-btn">复制到剪贴板</span></p>
					<p class="input-line"><span class="rs-inputName">设 备 秘 钥</span><span class="nas-code h3c_nas_code"></span></p>
					<p class="input-line"><span class="rs-inputName">设 备 安 装 地 址</span><input class="h3c_dvAds" type="text" placeholder="请输入设备安装地址"/></p>
					<p class="input-line"><span class="rs-inputName">用 户 速 度 设 置</span>
						<span class="upSpeed-set">
							<input type="text" class="speed-show" placeholder="请输入设备上传速度" id="h3c_coll1" value="" onkeyup="this.value=this.value.replace(/\D/g,'')" maxlength="20"/>
							<span class="sele-pic"><img src="${imgPath}/sele-down.png"/></span>
						</span><span class="danwei" style="margin-right: 30px;"> K B </span>
						<span class="downSpeed-set">
							<input type="text" class="speed-show" placeholder="请输入设备下载速度" id="h3c_coll2" value="" onkeyup="this.value=this.value.replace(/\D/g,'')" maxlength="20"/>
							<span class="sele-pic"><img src="${imgPath}/sele-down.png"/></span>
						</span><span class="danwei"> K B </span>
					</p>
					<p class="input-line">
					<span class="rs-inputName">认证加密方式</span>
					<select id="select">
					   <option>PAP1</option>
					   <option>PAP2</option>
					   <option>CHAP1</option>
					   <option>CHAP2</option>	
					</select>
					<span class="sele-img"><img src="${imgPath}/sele-down.png"/></span>
					<!-- <i style="color:#333;margin-left:5px;">5555555555555555555</i> -->
					</p>
					<ul class="speed-list1">
						<li>50</li>
						<li>100</li>
						<li>200</li>
						<li>300</li>
						<li>400</li>
						<li>自定义1</li>
					</ul>
					<ul class="speed-list2">
						<li>50</li>
						<li>100</li>
						<li>200</li>
						<li>300</li>
						<li>400</li>
						<li>自定义</li>
					</ul>
				</div>
						<!--MOTO-->
				<div class="rs-cont" style="display: none;">
					<p class="input-line"><span class="rs-inputName nas-tpy">RadiusNAS码<br>(NASID)</span><input class="moto_nsid" onKeyUp="value=value.replace(/[\W]/g,'')" type="text" value=""><span class="copy-btn">复制到剪贴板</span></p>
					<p class="input-line"><span class="rs-inputName">设 备 秘 钥</span><span class="nas-code moto_nas_code"></span></p>
					<p class="input-line"><span class="rs-inputName">设 备 安 装 地 址</span><input class="moto_dvAds" type="text" placeholder="请输入设备安装地址"/></p>
					<p class="input-line"><span class="rs-inputName">用 户 速 度 设 置</span>
						<span class="upSpeed-set">
							<input type="text" class="speed-show" placeholder="请输入设备上传速度" id="moto_coll1" value="" onkeyup="this.value=this.value.replace(/\D/g,'')" maxlength="20"/>
							<span class="sele-pic"><img src="${imgPath}/sele-down.png"/></span>
						</span><span class="danwei" style="margin-right: 30px;"> K B </span>
						<span class="downSpeed-set">
							<input type="text" class="speed-show" placeholder="请输入设备下载速度" id="moto_coll2" value="" onkeyup="this.value=this.value.replace(/\D/g,'')" maxlength="20"/>
							<span class="sele-pic"><img src="${imgPath}/sele-down.png"/></span>
						</span><span class="danwei"> K B </span>
					</p>
					<p class="input-line">
					<span class="rs-inputName">认证加密方式</span>
					<select id="select">
					   <option>PAP1</option>
					   <option>PAP2</option>
					   <option>CHAP1</option>
					   <option>CHAP2</option>	
					</select>
					<span class="sele-img"><img src="${imgPath}/sele-down.png"/></span>
					<!-- <i style="color:#333;margin-left:5px;">5555555555555555555</i> -->
					</p>
					<ul class="speed-list1">
						<li>50</li>
						<li>100</li>
						<li>200</li>
						<li>300</li>
						<li>400</li>
						<li>自定义1</li>
					</ul>
					<ul class="speed-list2">
						<li>50</li>
						<li>100</li>
						<li>200</li>
						<li>300</li>
						<li>400</li>
						<li>自定义</li>
					</ul>
				</div>
				<!--敦崇-->
				<div class="rs-cont" style="display: none;">
					<p class="input-line"><span class="rs-inputName nas-tpy">RadiusNAS码<br>(NASID)</span><input class="dunchong_nsid" onKeyUp="value=value.replace(/[\W]/g,'')" type="text" value=""><span class="copy-btn">复制到剪贴板</span></p>
					<p class="input-line"><span class="rs-inputName">设 备 秘 钥</span><span class="nas-code dunchong_nas_code"></span></p>
					<p class="input-line"><span class="rs-inputName">设 备 安 装 地 址</span><input class="dunchong_dvAds" type="text" placeholder="请输入设备安装地址"/></p>
					<p class="input-line"><span class="rs-inputName">用 户 速 度 设 置</span>
						<span class="upSpeed-set">
							<input type="text" class="speed-show" placeholder="请输入设备上传速度" id="dunchong_coll1" value="" onkeyup="this.value=this.value.replace(/\D/g,'')" maxlength="20"/>
							<span class="sele-pic"><img src="${imgPath}/sele-down.png"/></span>
						</span><span class="danwei" style="margin-right: 30px;"> K B </span>
						<span class="downSpeed-set">
							<input type="text" class="speed-show" placeholder="请输入设备下载速度" id="dunchong_coll2" value="" onkeyup="this.value=this.value.replace(/\D/g,'')" maxlength="20"/>
							<span class="sele-pic"><img src="${imgPath}/sele-down.png"/></span>
						</span><span class="danwei"> K B </span>
					</p>
					<p class="input-line">
					<span class="rs-inputName">认证加密方式</span>
					<select id="select">
					   <option>PAP1</option>
					   <option>PAP2</option>
					   <option>CHAP1</option>
					   <option>CHAP2</option>	
					</select>
					<span class="sele-img"><img src="${imgPath}/sele-down.png"/></span>
					<!-- <i style="color:#333;margin-left:5px;">5555555555555555555</i> -->
					</p>
					<ul class="speed-list1">
						<li>50</li>
						<li>100</li>
						<li>200</li>
						<li>300</li>
						<li>400</li>
						<li>自定义1</li>
					</ul>
					<ul class="speed-list2">
						<li>50</li>
						<li>100</li>
						<li>200</li>
						<li>300</li>
						<li>400</li>
						<li>自定义</li>
					</ul>
				</div>
				<!--其他-->
				<div class="rs-cont" style="display: none;">
					<p class="rc-other"><span><img src="${imgPath}/yihan.png"/></span><span class="other-tip">抱歉！本公司暂未和其他设备类型进行对接，请您提供需对接的设备详情及联系方式，一旦对接会马上通知您！</span></p>
					<p class="input-line"><span class="rs-inputName">设 备 类 型 名 称</span><input type="text" placeholder="请输入设备类型" id="deviceType"/></p>
					<p class="input-line"><span class="rs-inputName">设 备 版 本 号</span><input type="text" placeholder="请输入设备版本号" id="version"/></p>
					<p class="input-line"><span class="rs-inputName">联 系 人 姓 名</span><input type="text" placeholder="请输入联系人姓名" id="nameline"/></p>
					<p class="input-line"><span class="rs-inputName">联 系 电 话</span><input type="text" placeholder="请输入联系电话" maxlength="11" id="telephone" onkeyup="this.value=this.value.replace(/\D/g,'')"/></p>
					<p class="input-line"><span class="rs-inputName">联 系 邮 箱</span><input type="text" placeholder="请输入联系邮箱" id="email"/></p>
				</div>
				<p class="add-btn" style="left: 168px; bottom: -15px;">
					<button class="btn-sureAdd">确 认 添 加</button>
					<button class="btn-cancle rl-exit" id="goclose">取  消</button>
				</p>
			</div>
		</div>
		<div class="AC_info_cont">
			<p class="rl-name"><span>网关设备详情</span><span class="rl-exit tip">&times;</span></p>
			<div class="ac_list_cont">
				<p class="ac_tit"><span>NASID/GWID</span><span>客户端类型</span><span>秘钥</span><span>设备状态</span><span>安装位置</span><span class="cz">操作</span>
				</p>
				<ul class="ac_detail">
					<%-- <li><span>FCDBC8</span><span class="sb_type tip">wifiDog</span><span>CWOA1231</span><span>正常</span><span>餐厅</span><span class="cz"><i class="i_btn">下载配置文件</i>&nbsp;&nbsp;&nbsp;<i class="i_btn change_ac">修改</i>&nbsp;&nbsp;&nbsp;<img class="delete_ac tip" src="${imgPath}/delete.png"></span></li>
					<li><span>aaBC8</span><span class="sb_type tip">coova<span class="float">系统运行时间：3天10小时48分<br>CPU占用：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;20%</span></span><span>CWOA1231</span><span>正常</span><span>教室</span><span class="cz"><i class="i_btn">下载配置文件</i>&nbsp;&nbsp;&nbsp;<i class="i_btn change_ac">修改</i>&nbsp;&nbsp;&nbsp;<img class="delete_ac tip" src="${imgPath}/delete.png"></span></li>
					<li><span>bbDBC8</span><span class="sb_type tip">iKuai<span class="float">系统运行时间：3天10小时48分<br>CPU占用：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;20%</span></span><span>CWOA1231</span><span>正常</span><span>宿舍</span><span class="cz"><i class="i_btn">下载配置文件</i>&nbsp;&nbsp;&nbsp;<i class="i_btn change_ac">修改</i>&nbsp;&nbsp;&nbsp;<img class="delete_ac tip" src="${imgPath}/delete.png"></span></li>
					<li><span>ccDBC8</span><span class="sb_type tip">RouterOS<span class="float">系统运行时间：3天10小时48分<br>CPU占用：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;20%</span></span><span>CWOA1231</span><span>正常</span><span>图书馆</span><span class="cz"><i class="i_btn">下载配置文件</i>&nbsp;&nbsp;&nbsp;<i class="i_btn change_ac">修改</i>&nbsp;&nbsp;&nbsp;<img class="delete_ac tip" src="${imgPath}/delete.png"></span></li>
					<li><span>ddDBC8</span><span class="sb_type tip">iKuai<span class="float">系统运行时间：3天10小时48分<br>CPU占用：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;20%</span></span><span>CWOA1231</span><span>正常</span><span>马路</span><span class="cz"><i class="i_btn">下载配置文件</i>&nbsp;&nbsp;&nbsp;<i class="i_btn change_ac">修改</i>&nbsp;&nbsp;&nbsp;<img class="delete_ac tip" src="${imgPath}/delete.png"></span></li> --%>
				</ul>
				<div class="pager">
					<span class="page_first bt">首页</span>
					<span class="page_pre bt">◀</span>
					<span class="page_cont"><i>1</i>/<i>1</i></span>
					<span class="page_next bt">▶</span>
					<span class="page_last bt">尾页</span>
					<input class="page_to" type="text" name="" onkeyup="this.value=this.value.replace(/\D/g,'')">
					<span class="skip bt">跳转</span>
				</div>
			</div>
		</div>
		<div class="add_place_cont">
			<p class="rl-name"><span id="isadd">新增场所</span><span class="rl-exit tip">&times;</span></p>
			<div class="type_select">
				<span>场所类型</span>
				<ul class="type_list">
					<li><span class="pic on"><img class="tp_pic" src="${imgPath}/gongyu.png"><img class="fd_sel" src="${imgPath}/strue.png"></span><span>公寓</span></li>
					<li><span class="pic"><img class="tp_pic" src="${imgPath}/yiyuan.png"><img class="fd_sel" src="${imgPath}/sfalse.png"></span><span>医院</span></li>
					<li><span class="pic"><img class="tp_pic" src="${imgPath}/jingqu.png"><img class="fd_sel" src="${imgPath}/sfalse.png"></span><span>景区</span></li>
					<li><span class="pic"><img class="tp_pic" src="${imgPath}/xuexiao.png"><img class="fd_sel" src="${imgPath}/sfalse.png"></span><span>学校</span></li>
					<li><span class="pic"><img class="tp_pic" src="${imgPath}/jiudian.png"><img class="fd_sel" src="${imgPath}/sfalse.png"></span><span>酒店</span></li>
					<li><span class="pic"><img class="tp_pic" src="${imgPath}/shangchang.png"><img class="fd_sel" src="${imgPath}/sfalse.png"></span><span>商场</span></li>
					<li><span class="pic"><img class="tp_pic" src="${imgPath}/qita.png"><img class="fd_sel" src="${imgPath}/sfalse.png"></span><span>其他</span></li>
				</ul>
			</div>
			<div class="site_set_box">
				<p class="left_inp site_name">场所名称<input class="name_inp" type="text" maxlength="20"></p>
				<p class="right_inp site_pepnum">场所总人数<input class="pepnum_inp" onkeyup="this.value=this.value.replace(/\D/g,'')" type="text" name=""><img src="${imgPath}/wh.png" class="wh_ts"><span class="float">该值表示您覆盖场所的总人数，即若 您覆盖的是学校，该值为全校师生的总人数。</span></p>
			</div>
			<div class="site_set_box">
				<div class="left_inp" style="width: 55%;">场所地址<div class="ads_sel_box" style="width: 284px;"><select id="s_province" name="s_province"></select><select id="s_city" name="s_city" ></select><input id="county" type="text" name="county" maxlength="20">区/县</div></div>
				<div class="right_inp max_num">允许最大终端数&nbsp;&nbsp;&nbsp;≤&nbsp;&nbsp;&nbsp;<input onkeyup="this.value=this.value.replace(/\D/g,'')" class="zd_num" type="text" name="">&nbsp;&nbsp;台&nbsp;&nbsp;<img src="${imgPath}/wh.png" class="wh_ts"><span class="float">同一账号允许最多终端登录的数 量，0为不限制</span></div>
			</div>
			<div class="site_set_box">
				<div class="left_inp">
				
				<div style="float:left;margin-right: 40px;">试用时间</div>
				<div style="float:left;">
				  <select id="sy_time" name="sy_time">
				    <option>关闭</option>
					<option>1小时</option>
					<option>2小时</option>
					<option>3小时</option>
					<option>4小时</option>
					<option>5小时</option>
					<option>自定义</option>
				</select>
				</div>
					<div style="float:left;" id="father_div" >
					     <input type="text" id="sy_other_input"  onkeyup="this.value=this.value.replace(/\D/g,'')" onafterpaste="this.value=this.value.replace(/\D/g,'')">/小时 
					</div>	
					<div style="clear:both;"></div>	
				</div>
				
				<div class="right_inp">实名认证开关<span class="swicth d"><i></i></span></div>
			</div>
			<div class="site_set_box">
				<div class="left_inp">无流量下线<select id="authtime" name="authtime"><option>10分钟</option><option>20分钟</option><option>30分钟</option><option>40分钟</option><option>50分钟</option><option>1小时</option></select>&nbsp;&nbsp;<img src="${imgPath}/wh.png" class="authtimes"><span class="floatauth" style="left:294px;top:373px;">该值表示用户下线后再次登录不需 portal认证，直接放行的间隔时间。</span></div>
				<div class="right_inp">技术支持&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input class="tel-support" style="width: 150px;border: 1px solid #57c6d4;height: 30px;" type="text" maxlength="11" placeholder="请输入手机号"  onKeyUp="value=value.replace(/[^\d]/g,'')" ></div>
			</div>
			<div class="site_set_box">
					<div class="left_inp APP_inp" >
			   <div style="margin-top: 6px;float: left;margin-left: 8px;margin-right: 31px;">认证方式</div>
			   <div id="authStatus">
			   </div>
			   <div id="APPselect"  style="float:right;">
			   </div>
			   
			   <div id="ident" style="display:none"> <p class="ident_p">APP名称&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input id="appName" class="ident_inp" type="text" placeholder="APP名称" /></p>
	          <br/><p class="ident_p1"> APPID&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input id="appId" class="ident_inp" type="text" placeholder="APPID" /></p>
	           <br/><p class="ident_p2">APP密钥&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input id="appSecretKey" class="ident_inp" type="text" placeholder="APP密钥" /></p>
	           </div>
			</div>
			</div>
			<div class="banner_cont">
				<p>配置首页banner图</p>
				<p class="banner_show">
					效果示意图<br><br><img src="${imgPath}/banner_show.jpg"><img alt="banner" class="banner_pic" src="">
				</p>
				<p class="ban_wz">这里为banner 显示的位置<img src="${imgPath}/zhixiang.png"></p>
				<div class="up_pic_box">
					<p>上传图片<span class="red">(建议上传尺寸640X360)</span><br><br></p>
					
					<p class="gg_cont sl_file" id="upload"><img src="${imgPath}/up.png">&nbsp;&nbsp;&nbsp;上传图片</p>
					<input id="choose" type="file" accept="image/*" style="display:none;">
				</div>
			</div>
			<div class="btn_box">
				<button class="a_btn bc_edit" id="savesite">保存</button>
				<button class="q_btn qx_edit">取消</button>
			</div>
		</div>
		<div class="dhk">
			<p class="d_txt">对话文本</p>
			<p class="d_btns"><button class="a_btn dhqd_btn">确定</button><button class="q_btn dhqx_btn">取消</button></p>
		</div>
		<div id="ku" class="ku" style="display:none">
	        <img src="${ctx}/allstyle/finance/img/ku.jpg">
	        <p class="ku-p">请输入筛选条件</p>
        </div>
		<div class="barcontainer"><div class="meter"></div></div>
		<input type="hidden" value="" id="siteid">
		<input type="hidden" value="" id="xiugai">
		<input type="hidden" value="" id="flag">
		<script type="text/javascript" src="${jsPath}/jquery-2.1.4.min.js"></script>
		<script type="text/javascript" src="${jsPath}/general.js"></script>
		<script type="text/javascript" src="${jsPath}/js/cloudsite/cloudPlace.js"></script>
		<script class="resources library" type="text/javascript" src="${jsPath}/js/cloudsite/area.js"></script>
		<script type="text/javascript">
		
		$(document).ready(function(){
			$(function() {
				$(".place").addClass("on");
				
				$("#sy_time").change(function(){
					var sy_val=$("#sy_time").val();
					if(sy_val=="自定义"){
						$("#father_div").show();
					}else{
						$("#father_div").hide();
					}
				});
				})
		});
		</script>
	</body>
</html>