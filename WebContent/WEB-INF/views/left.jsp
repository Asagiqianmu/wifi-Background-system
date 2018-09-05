<%@ page contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<c:set var="curPath" value="${ctx}/allstyle/admins" />
<c:set var="curJsp" value="/commonJsp/" />

<div id="sidebar-nav">
	<ul id="dashboard-menu">

		<li id="index">
			<a href="${ctx}/CloudSiteManage/index"><i class="icon-inbox"></i><span>场所管理</span></a>
		</li>
		
		<li id="tradeRules">
			<a href="${ctx}/SitePriceConfig"><i class="icon-leaf"></i><span>计费管理</span></a>
		</li>
		
		<li id="siteCustomer">
			<%-- <a href="${ctx }/siteCustomer/toSiteCustomerList"><i class="icon-user"></i><span>用户管理</span></a> --%>
			
			
			<a class="dropdown-toggle" href="#" data-toggle="dropdown">
				<i class="icon-user"></i><span>用户管理</span><i class="icon-chevron-down"></i>
			</a>
			<ul class="submenu">
				<li><a href="${ctx }/siteCustomer/toSiteCustomerList" id="IncomeDetails">收入明细</a></li>
				<li><a href="${ctx }/siteCustomer/toCustomerPay" id="CustomerPayCost">用户缴费</a></li>
			</ul>
			
			
		</li>

		<li id="dataCenter">
			<a class="dropdown-toggle" href="#" data-toggle="dropdown">
				<i class="icon-user"></i><span>数据中心</span><i class="icon-chevron-down"></i>
			</a>
			<ul class="submenu">
				<li><a href="#" id="orderByMonth">月统计</a></li>
				<li><a href="#" id="orderBySelfDef">范围统计</a></li>
			</ul>
		</li>

<!-- 		<li id="index"> -->
<!-- 			<a href="#"><i class="icon-hdd"></i><span>数据中心</span></a> -->
<!-- 		</li> -->



<!-- 		<li id="agent"><a class="dropdown-toggle" href="#" -->
<!-- 			data-toggle="dropdown"> <i class="icon-leaf"></i><span>代理商</span><i -->
<!-- 				class="icon-chevron-down"></i> -->
<!-- 		</a> -->
<!-- 			<ul class="submenu"> -->
<%-- 				<li><a href="${ctx}/admins/goAddAgent" id="addAgent">添加代理商</a></li> --%>
<%-- 				<li><a href="${ctx}/admins/getAllAgent" id="agentList">查看代理商</a></li> --%>
<!-- 			</ul></li> -->

<%-- 		<li id="userList"><a href="${ctx}/admins/goAllUser"> <i --%>
<!-- 				class="icon-user"></i> <span>用户管理</span> -->
<!-- 		</a></li> -->

<%-- 		<li id="deviceList"><a href="${ctx}/admins/goStoreRouterList"> --%>
<!-- 				<i class="icon-inbox"></i> <span>设备管理</span> -->
<!-- 		</a></li> -->

<%-- 		<li id="reviewAds"><a href="${ctx}/admins/auditAdList"> <i --%>
<!-- 				class="icon-signal"></i> <span>广告管理</span> -->
<!-- 		</a></li> -->

<!-- 		<li id="mess"><a class="dropdown-toggle" href="#" -->
<!-- 			data-toggle="dropdown"> <i class="icon-envelope"></i><span>短信管理</span><i -->
<!-- 				class="icon-chevron-down"></i> -->
<!-- 		</a> -->
<!-- 			<ul class="submenu"> -->
<!-- 				<li><a href="javascript:void(0);" id="messSale">营销短信</a></li> -->
<%-- 				<li><a href="${ctx}/admins/goMessAuthList" id="messAuth">认证短信</a></li> --%>
<!-- 			</ul></li> -->
		
<!-- 		<li id="vipIncomeRecords"> -->
<%-- 			<a href="${ctx}/admins/goRecordsList">  --%>
<!-- 				<i class="icon-th-list"></i> <span>会员充值记录</span> -->
<!-- 			</a> -->
<!-- 		</li> -->

<%-- 		<li id="storeList"><a href="${ctx}/admins/goStoreList"> <i --%>
<!-- 				class="icon-th"></i> <span>店铺管理</span> -->
<!-- 		</a></li> -->


<!-- 		<li id="money"><a class="dropdown-toggle" href="#" -->
<!-- 			data-toggle="dropdown"> <i class="icon-credit-card"></i><span>平台账户</span><i -->
<!-- 				class="icon-chevron-down"></i> -->
<!-- 		</a> -->
<!-- 			<ul class="submenu"> -->
<%-- 				<li><a href="${ctx}/admins/goGetMoneyList" id="messSale">提现申请列表</a></li> --%>
<!-- 			</ul></li> -->


	</ul>
</div>
