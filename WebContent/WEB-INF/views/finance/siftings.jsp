<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ page import="java.util.Date"  %>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<c:set var="cssPath" value="${ctx}/allstyle/finance/css" />
<c:set var="jsPath" value="${ctx}/allstyle/finance/js" />
<c:set var="imgPath" value="${ctx}/allstyle/finance/img" />
<!DOCTYPE html>
<html>
<%
long getTimestamp=new Date().getTime(); //时间戳
%>
<head>
    <meta charset="UTF-8">
    <title>财务总览</title>
    <link rel="stylesheet" type="text/css" href="${cssPath}/common.css">
    <link rel="stylesheet" type="text/css" href="${cssPath}/siftings.css">
</head>
<script type="text/javascript">
	var ctx="${ctx}";
	var imgPath="${imgPath}";
</script>

<body>
<div id="header">
    <div class="fl msg_title">
        <img src="${imgPath}/fxwx.png" class="fl"/>
        <span><i>Wi-Fi 运营系统 &#149;</i>后台管理员 </span>
    </div>
    <div class="fr user_msg">
        <div class="user_phone tip"><img src="${imgPath}/new_cont_06.png" class="fl"/>${user.userName}
            <ul class="menu">
                <li class="exit">退出</li>
            </ul>
        </div>
        <img src="${imgPath}/new_cont_09.png" class="fr msg_tip tip"/>
    </div>
</div>
<div id="leftNav" class="on">
    <span class="module tip"></span>
    <ul class="linkList">
        <li class="tip"><img class="fl" src="${imgPath}/pandect.png"><span>收入总览</span><p>收入总览</p></li>
        <li class="tip"><img class="fl" src="${imgPath}/ratio.png"><span>结算比例</span><p>结算比例</p></li>
        <li class="tip"><img class="fl" src="${imgPath}/settle.png"><span>结算审核</span><p>结算审核</p></li>
        <li class="tip"><img class="fl" src="${imgPath}/query.png"><span>财务数据查询</span><p>财务数据查询</p></li>
        <li class="tip on"><img class="fl icon-size" src="${imgPath}/siftings2.png"><span>用户收入明细</span><p>用户收入明细</p></li>
        <li class="tip"><img class="fl icon-size" src="${imgPath}/dls.png"><span>代理商信息总览</span><p>代理商信息总览</p></li>
    	
    </ul>
    <p class="incline"></p>
</div>
<div class="container">
    <p class="cTitle"><span>用户收入明细</span></p>

    <div class="topBox">
        <div class="Sbox-left">
            <p class="subTitle">按代理商查询</p>
            <div class="costType inputBox" >
                <input id="agent" class="iText" id="agentname" type="text" placeholder="请输入代理商姓名" maxlength="11" onkeyup="this.value=this.value.replace(/\D/g,'')">
            </div>
        </div>
    </div>

    <p class="p_title" style="">高级搜索:</p>

    <div class="topBox">
        <div class="Sbox-left">
            <p class="color-b4">按场所查询</p>
            <div id="placeDown" class="costType">
                <span id="place" class="seleType tip">请选择</span>
                <ul class="sitelist">
                     
                </ul>
            </div>
        </div>

        <div class="Sbox-left">
            <p class="color-b4">按用户名查询</p>
            <div class="costType">
                <input id="userId" class="iText" type="text" placeholder="请输入用户名">
            </div>
        </div>

        <div class="Sbox-left">
            <p class="color-b4">按支付方式查询</p>
            <div id="payDown" class="costType">
                <span id="payMode" class="seleType tip" payTy="1">支付宝</span>
                <ul class="chorseType">
                    <li paytype="1">支付宝</li>
                    <li paytype="3">微信</li>
                    <li paytype="2">京东</li>
                </ul>
            </div>
        </div>

        <div class="Sbox-left">
            <p class="color-b4">日期范围</p>
            <div class="date">
                <input type="text" readonly="readonly" placeholder="请输入查询时间" onclick="WdatePicker({dateFmt:'yyyy-MM-dd',maxDate:'%y-%M-%d'})" value="" id="startAt" class="Wdate">
                &nbsp;至&nbsp;
                <input type="text" readonly="readonly" placeholder="请输入查询时间" onclick="WdatePicker({dateFmt:'yyyy-MM-dd',maxDate:'%y-%M-%d'})" value="" id="endAt" class="Wdate">
            </div>
        </div>

        <div class="Sbox-left">
            <p class="color-b4">&nbsp;</p>
            <div>
                <button id="queryBtn" class="siftingsBtn">查询</button>
            </div>
        </div>
    </div>

    <div id="tableBox" style="display: none">
        <div class="excelBox">
            <button id="exportExcel" class="excelBtn">导出EXCEL表格</button>
        </div>
        <div class="excelBox">
            <table class="siftings-tab">
                <thead>
                <tr>
                    <th>用户名</th>
                    <th>场所</th>
                    <th>充值金额(元)</th>
                    <th>支付方式</th>
                    <th>充值时间</th>
                </tr>
                </thead>
                <tbody id="tbList">
                <!-- <tr>
                    <td>123456789111</td>
                    <td>山西同文学院</td>
                    <td>5.00</td>
                    <td>支付宝</td>
                    <td>2016-3-6 23:11</td>
                </tr> -->
                </tbody>
            </table>
        </div>
        <div class="excelBox">
            <div id="pages" style="float: right"></div>
        </div>
    </div>

    <div id="ku" class="ku">
        <img src="${imgPath}/ku.jpg">
        <p class="ku-p">请输入筛选条件</p>
    </div>
</div>
<div class="win">
	<span></span>
</div>
</body>
<script type="text/javascript" src="${jsPath}/WdatePicker.js"></script>
<script type="text/javascript" src="${ctx}/allstyle/newEditionSkin/js/jquery-2.1.4.min.js"></script>
<script type="text/javascript" src="${jsPath}/siftings.js"></script>
<script type="text/javascript" src="${jsPath}/common.js"></script>
</html>