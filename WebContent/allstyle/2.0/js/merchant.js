/**
 * 商家后台共用js
 */

$(function() {



	var wid = $(".sonHeader").width();
	$(".sonContent").css("width", wid);
	window.onresize = function() {
		var wid = $(".sonHeader").width();
		$(".sonContent").css("width", wid);
	}

	// 提示信息，参数配置
	toastr.options = {
		"closeButton" : true,
		"debug" : false,
		"positionClass" : "toast-top-left",
		// "positionClass" : "toast-top-right",
		"onclick" : null,
		"showDuration" : "3000",
		"hideDuration" : "3000",
		"timeOut" : "3000",
		"extendedTimeOut" : "3000",
		"showEasing" : "swing",
		"hideEasing" : "linear",
		"showMethod" : "fadeIn",
		"hideMethod" : "fadeOut"
	}
	
});

// 格式化日期
Date.prototype.format = function(format) {
	var o = {
		"M+" : this.getMonth() + 1, // month
		"d+" : this.getDate(), // day
		"h+" : this.getHours(), // hour
		"m+" : this.getMinutes(), // minute
		"s+" : this.getSeconds(), // second
		"q+" : Math.floor((this.getMonth() + 3) / 3), // quarter
		"S" : this.getMilliseconds()
	// millisecond
	}
	if (/(y+)/.test(format))
		format = format.replace(RegExp.$1, (this.getFullYear() + "")
				.substr(4 - RegExp.$1.length));
	for ( var k in o)
		if (new RegExp("(" + k + ")").test(format))
			format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k]
					: ("00" + o[k]).substr(("" + o[k]).length));
	return format;
}

// 日期 + 计算
Date.prototype.DateAdd = function(strInterval, Number) {
	var dtTmp = this;
	switch (strInterval) {
	case 's':
		return new Date(Date.parse(dtTmp) + (1000 * Number));
	case 'n':
		return new Date(Date.parse(dtTmp) + (60000 * Number));
	case 'h':
		return new Date(Date.parse(dtTmp) + (3600000 * Number));
	case 'd':
		return new Date(Date.parse(dtTmp) + (86400000 * Number));
	case 'w':
		return new Date(Date.parse(dtTmp) + ((86400000 * 7) * Number));
	case 'q':
		return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + Number * 3,
				dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp
						.getSeconds());
	case 'm':
		return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + Number, dtTmp
				.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp
				.getSeconds());
	case 'y':
		return new Date((dtTmp.getFullYear() + Number), dtTmp.getMonth(), dtTmp
				.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp
				.getSeconds());
	}
}

// 日期 - 计算
Date.prototype.DateDiff = function(strInterval, Number) {
	var dtTmp = this;
	switch (strInterval) {
	case 's':
		return new Date(Date.parse(dtTmp) - (1000 * Number));
	case 'n':
		return new Date(Date.parse(dtTmp) - (60000 * Number));
	case 'h':
		return new Date(Date.parse(dtTmp) - (3600000 * Number));
	case 'd':
		return new Date(Date.parse(dtTmp) - (86400000 * Number));
	case 'w':
		return new Date(Date.parse(dtTmp) - ((86400000 * 7) * Number));
	case 'q':
		return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) - Number * 3,
				dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp
						.getSeconds());
	case 'm':
		return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) - Number, dtTmp
				.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp
				.getSeconds());
	case 'y':
		return new Date((dtTmp.getFullYear() - Number), dtTmp.getMonth(), dtTmp
				.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp
				.getSeconds());
	}
}

// 两个时间的天数差 日期格式为 YYYY-MM-dd
function daysBetween(DateOne, DateTwo) {
	var OneMonth = DateOne.substring(5, DateOne.lastIndexOf('-'));
	var OneDay = DateOne
			.substring(DateOne.length, DateOne.lastIndexOf('-') + 1);
	var OneYear = DateOne.substring(0, DateOne.indexOf('-'));

	var TwoMonth = DateTwo.substring(5, DateTwo.lastIndexOf('-'));
	var TwoDay = DateTwo
			.substring(DateTwo.length, DateTwo.lastIndexOf('-') + 1);
	var TwoYear = DateTwo.substring(0, DateTwo.indexOf('-'));

	var cha = ((Date.parse(OneMonth + '/' + OneDay + '/' + OneYear) - Date
			.parse(TwoMonth + '/' + TwoDay + '/' + TwoYear)) / 86400000);
	return Math.abs(cha) + 1;
}

/**
 * 生成flash
 * 
 * @param swf
 *            flash文件所在位置
 * @param width
 *            flash宽度
 * @param heigth
 *            flash高度
 * @param content
 *            flash所在div
 * @param url
 *            图片上传url
 */

function showflash(swf, width, heigth, content, url) {
	var mc = new FlashObject(swf, "addAdsFlash", width, heigth, "8");
	mc.addParam("quality", "high");
	mc.addParam("play", "true");
	mc.addParam("loop", "true");
	mc.addParam("wmode", "window");
	mc.addParam("scale", "showall");
	mc.addParam("menu", "true");
	mc.addParam("devicefont", "false");
	mc.addParam("salign", "");
	mc.addParam("FlashVars", "uploadurl=" + url);
	mc.addParam("allowScriptAccess", "sameDomain");
	mc.write(content);
}
