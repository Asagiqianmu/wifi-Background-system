<%@ page contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<c:set var="curPath" value="${ctx}/allstyle/admins" />
<c:set var="curJsp" value="/commonJsp/" />

<!DOCTYPE html>
<html>
<head>
<title>设备中心</title>
<link rel="icon" href="${curPath}/favicon.ico">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1.0" />

<!-- styles -->
<link href="${curPath}/css/bootstrap/bootstrap.css" type="text/css"	rel="stylesheet" />
<link href="${curPath}/css/bootstrap/bootstrap-responsive.css" type="text/css"	rel="stylesheet" />
<link href="${curPath}/css/bootstrap/bootstrap-overrides.css" type="text/css"	rel="stylesheet" />
<link href="${curPath}/css/lib/select2.css" type="text/css"	rel="stylesheet" />
<link href="${curPath}/css/layout.css" type="text/css"	rel="stylesheet" />
<link href="${curPath}/css/elements.css" type="text/css"	rel="stylesheet" />
<link href="${curPath}/css/icons.css" type="text/css"	rel="stylesheet" />
<link href="${curPath}/css/lib/font-awesome.css" type="text/css"	rel="stylesheet" />
<link href="${curPath}/css/compiled/tables.css" type="text/css"	rel="stylesheet" media="screen" />
<link href='${curPath}/css/fonts.googleapis.com.css' type="text/css"	rel="stylesheet" />
<link href="${curPath}/css/lib/iosOverlay.css" type="text/css"	rel="stylesheet" />
<link href="${curPath}/css/lib/toastr.css" type="text/css" rel="stylesheet" />

<!--[if lt IE 9]>
      <script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>
    <![endif]-->
<script type="text/javascript">
var ctx="${ctx}";
</script>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

</head>

<body>

 <jsp:include page="../header.jsp"></jsp:include>

	<jsp:include page="../left.jsp"></jsp:include>

	<!-- main container -->
	<div class="content">
		<div class="container-fluid">
			<div id="pad-wrapper">
				<div class="table-wrapper products-table section">
					<div class="row-fluid head">
						<div class="span12">
							<h4>
								<i class="icon-th"></i>计费管理
							</h4>
						</div>
					</div>

					<div class="row-fluid filter-block">
						<div  id="siteSection" style="text-align: right;">
						<span>场所名称：</span>
							<select id='selectValues' class='span2'>
								<option  value='-1'>查看全部</option>
							</select>
							<input id="btSelect" type="button" value="查询"/>
							<input id="btAddPrice" type="button" value="新增计费"/>
						</div>
					</div>

					<div class="row-fluid">
						<table class="table table-hover">
							<thead>
								<tr>
									<!--  规则列表 -->
									<th class="span2"><span class="line"></span>场所名称</th>
									<th class="span2"><span class="line"></span>场所地址</th>
									<th class="span2"><span class="line"></span>归属集团</th>
									<th class="span2"><span class="line"></span>收费类型</th>
									<th class="span2"><span class="line"></span>收费单价</th>
									<th class="span2"><span class="line"></span>收费名称</th>
									<th class="span3"><span class="line"></span>是否作废</th>
									<th class="span2"><span class="line"></span>创建时间</th>
									<th class="span2"><span class="line"></span>操作</th>
								</tr>
							</thead>
							<tbody id="recordsTbody">
							</tbody>
						</table>

						<br />
						<div id="pager" class="pagination" ></div>
						
					</div>
				</div>

			</div>
		</div>
	</div>
	<!-- end main container -->

<!-- 修改信息-->
<div id="addDeviceModel" class="modal hide fade form-page" tabindex="-1"
	role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
	<div class="modal-header">
		<button type="button" class="close" data-dismiss="modal"
			aria-hidden="true">×</button>
		<h3>
			<i class="icon-plus"></i> 修改信息
		</h3>
	</div>
	<div class="modal-body form-wrapper" style="padding: 20px 20px 20px 20px;">
			<!-- div class="field-box" style="margin-bottom: 0px;">
				<div class="alert">
					<strong>注意!</strong> 设备必须在线且未绑定
				</div>
			</div> -->
		<form id="updatePrice">
			<div class="field-box">
			<input id="priceId" value=""  name="priceId" style="display: none;"/>  <!-- 用来保存当前规则ID -->
				<label>当前收费规则</label>
				<div>
				 <table>
				 <tr>
				 <td>收费单价：</td>
				 <td ><input id="price" class="span2" type="text" value="" name="price"/>&nbsp;&nbsp;元</td>

				 </tr>
				 <tr>
				 <td>是否作废：</td>
				  <td >
				  	<select id="stoped" class="span2" style="height:30px;">
				  	<option value="0">否</option>
				  	<option value="1">是</option>
				  	</select>
				  </td>
				 </tr>
				 </table>
				</div>
			</div>
			
		</form>
	</div>
	
	<div class="modal-footer">
		<button id="sub" class="btn btn-info doAddDeviceBtn">保存</button>
		<button class="btn" data-dismiss="modal" aria-hidden="true">取消</button>
	</div>
</div>
<!-- 修改场所 完 -->

<!-- 新增收费规则-->
<div id="addPriceModel" class="modal hide fade form-page" tabindex="-1"
	role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
	<div class="modal-header">
		<button type="button" class="close" data-dismiss="modal"
			aria-hidden="true">×</button>
		<h3>
			<i class="icon-plus"></i> 新增计费规则
		</h3>
	</div>
	<div class="modal-body form-wrapper" style="padding: 20px 20px 20px 20px;">
			<!-- div class="field-box" style="margin-bottom: 0px;">
				<div class="alert">
					<strong>注意!</strong> 设备必须在线且未绑定
				</div>
			</div> -->
		<form id="addPriceForm">
				 <table>
 				 <tr>
					 <td>自定义收费名称：</td>
					 <td ><input id="name" class="span2" type="text" value="" name="name"/></td>

				 </tr>
				 
 				 <tr>
					 <td>收费单价：</td>
					 <td ><input id="new_price" class="span2" type="text" value="" name="price"/>&nbsp;&nbsp;元</td>

				 </tr>
				 
 				 <tr>
					 <td>收费类型：</td>
					  <td >
					  	<select id="priceType" class="span2" style="height:30px;">
					  	<option value="0">按时</option>
					  	<option value="1">按天</option>
	  				  	<option value="2">按月</option>
	  				  	<option value="3">按一年</option>
	  				  	<option value="4">按两年</option>
					  	</select>
					  </td>
				 </tr>
   				 <tr>
					 <td>所属集团：</td>
					  <td >
					  	<select id="chargeType" class="span2" style="height:30px;">
					  	<option value="0">无归属</option>
					  	<option value="1">电信集团</option>
					  	</select>
					  </td>
				 </tr>
				 
 				 <tr>
					 <td>添加到场所：</td>
					  <td >
					  	<select id="site" class="span2" style="height:30px;">
					  	</select>
					  </td>
				 </tr>
				 
				 </table>
	
			
		</form>
	</div>
	
	<div class="modal-footer">
		<button id="doAddPriceBtn"   class="btn btn-info doAddPriceBtn">保存</button>
		<button class="btn" data-dismiss="modal" aria-hidden="true">取消</button>
	</div>
</div>
	<!-- scripts -->
	<script src="${curPath}/js/jquery.min.js" type="text/javascript"></script>
	<script src="${curPath}/js/bootstrap.min.js" type="text/javascript"></script>
	<script src="${curPath}/js/select2.min.js" type="text/javascript"></script>
	<script src="${curPath}/js/spin.min.js" type="text/javascript"></script>
	<script src="${curPath}/js/iosOverlay.js" type="text/javascript"></script>
	<script src="${curPath}/js/external/toastr.js" type="text/javascript"></script>
	<script src="${curPath}/js/jquery.pager.js" type="text/javascript"></script>
	<script src="${curPath}/js/theme.js" type="text/javascript"></script>
	<script src="${curPath}/js/jquery.validate.min.js" type="text/javascript"></script>
    <script src="${curPath}/js/jquery.validate.messages_cn.js" type="text/javascript"></script> 
	<%-- <script src="${curPath}/js/pages/device/records.js" type="text/javascript"></script> --%>
	<script src="${curPath}/js/pages/SitePriceConfig/SitePriceConfig.js" type="text/javascript"></script>
	<script type="text/javascript">
		$("#tradeRules").addClass("active");
	
	</script>
</body>
</html>