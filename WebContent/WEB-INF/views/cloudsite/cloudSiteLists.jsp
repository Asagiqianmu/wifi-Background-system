<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ page import="java.util.Date"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<c:set var="cssPath" value="${ctx}/allstyle/newEditionSkin/css" />
<c:set var="publicPath" value="${ctx}/allstyle/newEditionSkin/js" />
<c:set var="jsPath" value="${publicPath}/cloudSite" />
<!DOCTYPE html>
<html>
<%
long getTimestamp=new Date().getTime(); //时间戳
%>
<head>
<meta name="renderer" content="webkit">
	<title></title>
	<link rel="stylesheet" type="text/css" href="${cssPath}/font-icon.css?<%=getTimestamp%>">
	<link rel="stylesheet" type="text/css" href="${cssPath}/style.css?<%=getTimestamp%>">
	<link rel="stylesheet" type="text/css" href="${cssPath}/place.css?<%=getTimestamp%>">
	<script type="text/javascript" src="${publicPath}/jquery-2.1.4.min.js"></script>
 	<script type="text/javascript">
            var ctx="${ctx}";
     </script>
     <script> 
	   (function() {
			 if (! 
			 /*@cc_on!@*/
			 0) return;
			 var e = "abbr, article, aside, audio, canvas, datalist, details, dialog, eventsource, figure, footer, header, hgroup, mark, menu, meter, nav, output, progress, section, time, video".split(', ');
			 var i= e.length;
			 while (i--){
				 document.createElement(e[i]);
			 }
			 $('html').contextmenu(function(){
					return false;
				});
		});
	</script>
	
</head>
<body>
<header class="ui-header">
	<h1>
		<span class="first"></span>
		<span class="sun">Wi-Fi运营系统&nbsp;·&nbsp;</span>
		<span class="back">后台管理员</span>
	</h1>
	<span class="icon icon-ask"></span>
	<div class="admin">
		<i class="icon icon-admin"></i>
		<span class="adname">${user.userName}</span>
		<i class="icon icon-down"></i>
		<ul class="menu">
			<li class="personageCenter">个人中心</li>
			<li class="exit">退出</li>
		</ul>
	</div>
</header>
<nav class="ui-nav">
	<h2 class="list"><a href="${ctx}/allSiteOfReportStatistics/index"><i class="icon icon-oper"></i>运营概览</a></h2>
	<h2 class="list on"><a href="${ctx}/CloudSiteManage/index"><i class="icon icon-place"></i>场所管理</a></h2>
	<h2 class="list"><a href="${ctx}/SitePriceBilling/toSiteBilling"><i class="icon icon-billing"></i>计费管理</a></h2>
	<%-- <h2 class="list "><a href="${ctx}/siteCustomer/toSiteCustomerList"><i class="icon icon-user"></i>用户管理<i class="icon icon-goLeft"></i></a></h2> --%>
	<h2 class="list"><a href="${ctx}/siteCustomer/toChurnUserList"><i class="icon icon-user"></i>用户管理<i class="icon icon-goLeft"></i></a></h2>
	<h2 class="list"><a href="${ctx}/siteIncome/toSiteCustomerList"><i class="icon icon-fund"></i>资金管理<i class="icon icon-goLeft"></i></a></h2>
	<h2 class="list"><a href="${ctx}/personalCenter/toPersonalCenter"><i class="icon icon-personage"></i>个人中心</a></h2>
</nav>
<div class="container">
	<div class="content place">
		<h3 class="title">场所管理</h3>
		<p class="newAdd manage"><i class="icon icon-add"></i>新增场所</p>
		<span class="siteListTitle">场所列表</span>
		<p class="plistT">
			<span>场所名称</span>
			<span>场所地址</span>
			<span>设备数量</span>
			<span>试用时间</span>
			<span title='允许每个用户多终端的登录台数'>锁定账号数</span>
			<span>实名认证开关</span>
			<span>充值人数</span>
			<span>在线人数</span>
			<span>操作</span>
		</p>
        <ul class="paging" id="paging">  
 				 
		</ul> 
		
	</div>
</div>
<div class="mask">
<input type='hidden' value="" id="yierror">
<input type='hidden' value="" id="updateSiteId">
	<div class="newly">
		<div class="new premises" style="display:block;">
			<h2>新增场所<i class="icon icon-false"></i></h2>
			<ul>
				<li>场&nbsp;所&nbsp;名&nbsp;称<input type="text" id="siteName" placeholder="请输入场所名称" maxlength="12"><em id="sName"></em></li>
				<li>场&nbsp;所&nbsp;地&nbsp;址<input type="text" id="address" placeholder="请输入场所地址"><em id="sAddress"></em></li>
				<li>场所总人数<input type="text" id='siteTotal' placeholder="请输入场所人数" onkeyup="this.value=this.value.replace(/\D/g,'')"><em id="sNum"></em></li>
			</ul>
			<div class="upPic">
				<p>配置首页banner图</p>
				<div class="show">
					<p class="showTitle">
						<span>示意图</span><br>这里为Banner<br>显示的位置→
					</p>
					<div class="showRight">
						<span>banner</span>
						<p>当上传多张banner时，用户<br>登录时将随机展示其中一张</p>
					</div>
				</div>
				<div class="picEdit">
					<p class="editTitle">图片展示</p>
					<div class="picCrop">
						<p class="imgShow">暂未上传图片</p>
						<p class="picMask"></p>
						<span></span>
					</div>
					<!-- <div class="shrink">
						<span class="big">+</span><p class="rMove"></p><span class="small">-</span>
					</div> -->
					<p class="funBtn">
						<!-- <span>更改图片</span> -->
						<span>确定</span>
					</p>
				</div>
				<div class="picList">
					<p class="editTitle">选择图片</p>
					
					<div id="upload" class="addImg">
						<input id="choose" type="file" accept="image/*" style="display:none;">
						<span>+</span>
						<p>最多上传3张图片若<br>再上传将覆盖第一张</p>
					</div>
				</div>
			</div>
			<div class="btns">
				<p>
					<button type="button" id="savaSite">保存</button>
					<button type="button" id="exitSite">取消</button>
				</p>
			</div>
		</div>
		
		<!-- <div class="new premiseses" style="display:block;">
			<h2>修改场所<i class="icon icon-false"></i></h2>
			<ul>
				<li>场&nbsp;所&nbsp;名&nbsp;称<input type="text" id="sitenames" placeholder="请输入场所名称" maxlength="12"><em id="sNames"></em></li>
				<li>场&nbsp;所&nbsp;地&nbsp;址<input type="text" id="siteadd" placeholder="请输入场所地址"><em id="sAddresss"></em></li>
				<li>场所总人数<input type="text" id='sitenum' placeholder="请输入场所人数" onkeyup="this.value=this.value.replace(/\D/g,'')"><em id="sNums"></em></li>
			</ul>
			<div class="btns">
				<p>
					<button type="button" id="upSite">保存</button>
					<button type="button" id="exupSite">取消</button>
				</p>
			</div>
		</div> -->
		
		
		<div class="new DeviceInfo" style="display:none">
			<h2>设备详情<i class="icon icon-false"></i></h2>
			<div class="deviceList" id="deviceListInfo">
				<h6>
					<span>ID</span>
					<!-- <span>认证人数</span> -->
					<span>安装位置</span>
					<!-- <span>热点名称</span> -->
					<span>运行时间</span>
					<span>离线时间</span>
					<span>设备类型</span>
					<span>nasid</span>
					<!-- <span>认证开关</span> --> 
					<span>设备状态</span>
					<span>操作</span>
				</h6>
				<!--  <p> -->
					<!-- <span>182765345E1D</span>
					<span>2</span>
					<span>未知</span>
					<span style="line-height:19px;">2015.05.08 18:01:36</span>
					<span>20150508</span>
					<span style="line-height:19px;">http://edu.solarsys.cn/deck</span>
					<span>开启</span>
					<span><button>异常</button></span> -->
				<!-- </p>   -->
				 <div>
				 <ul class="paging">
				 
				 </ul>
				 </div>
			</div>
		</div>
		<div class="new whiteAdd" style="display:none;">
			<h2>白名单<i class="icon icon-false"></i></h2>
			<span>MAC地址</span>
			<div class="MACinfo" id="MACinfo">
				<!-- <p class="MACtent"><input type="text" id='addMac' placeholder="请输入MAC地址" value=""><span><i class="icon icon-false"></i></span></p>
				<span class="addMAC"><i class="icon icon-add"></i>新增白名单</span> -->
			</div>
			<div class="btns">
				<p>
					<button type="button" id="saveMac">保存</button>
					<button type="button" id="exiteMac">取消</button>
				</p>
			</div>
		</div>
		<div class="new addPlace" style="display:none;">
			<h2>添加设备<i class="icon icon-false"></i></h2>
			<div class="placePullDown">
				选择设备类型
				<span data-key=""></span>
				<ul>
				</ul>
			</div>
			<div class="radiusNAS">
				NASID
				<input id="nasid" readonly="readonly"><button type="button">复制到剪贴板</button>
				<p>请使用该radiusNAS码在爱快后台进行绑定 <span class="nashov">如何绑定?</span></p>
				<div class="nasImg"></div>
			</div>
			<div class="deviceDetailInfo">
				<p>设备详细信息</p>
				<div class="inputs">
					<span>注：设备必须在线且未绑定</span>
				</div>
			</div>
			<div class="ros produce">
				<span>生成配置文件</span>
				<div class="produceBox">
					<p><label>NASID</label><input type="text" id="nasidRos" readonly="readonly"></p>
					<p style="float: right"><label>设备密钥</label><input type="text" id="secretRos" value="fxwxwl" readonly="readonly"></p>
					<input id="wanPort" type="text" value="" name="" placeholder="请输入设备WAN口端口" maxlength="20">
					<input id="lanPort" style="float: right" type="text" value="" name="" placeholder="请输入设备LAN口端口" maxlength="20">
					<button class="produceFile">生成配置文件</button>
					<button class="changeFile">修改</button><button class="downloadFile">下载配置文件</button>
				</div>
			</div>
			<div class="ros install">设备安装地址<input type="text" name="" id="addressRos" maxlength="20" placeholder="请输入设备安装地址"></div>
			<div class="ros speed">
				<span>用户速度设置</span>
				<div class="speedBox">
					<div class="upSpeed">
						<input class="addInput" id="speed_up" type="text" maxlength="10" placeholder="请输入设备上传速度">KB
						<ul>
							<li>不限</li>
							<li>50</li>
							<li>100</li>
							<li>200</li>
							<li>300</li>
							<li>400</li>
							<li>500</li>
						</ul>
					</div>
					<div class="downSpeed">
						<input class="addInput" id="speed_down" type="text" maxlength="10" placeholder="请输入设备下载速度">KB
						<ul>
							<li>不限</li>
							<li>50</li>
							<li>100</li>
							<li>200</li>
							<li>300</li>
							<li>400</li>
							<li>500</li>
						</ul>
					</div>
					<span>注：设备必须在线且未绑定</span>
				</div>
			</div>
			<div class="btns">
				<p>
					<button id="setInput" type="button">保存</button>
					<button type="button" id="devieBut">取消</button>
				</p>
			</div>
		</div>
	</div>
</div>
<div class="win">
	<span>操作成功</span>
</div>
<div class="whether">
	<span>是否确定当前操作？</span>
	<button id="yes" class='yesbutton'>是</button><button id="whether" style="border:none;">否</button>
</div>
 <div class="whethers">
	<span>是否确定当前操作？</span>
	<button id="yes">是</button><button id="whethers" style="border:none;">否</button>
</div>
<input type="hidden" id="siteId">
<div class="barcontainer"><div class="meter"></div></div>
<script type="text/javascript" src="${jsPath}/cloudSiteLists.js"></script>
<script type="text/javascript" src="${publicPath}/floatAlert.js"></script>
</body>
</html>