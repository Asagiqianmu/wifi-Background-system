var sIndex = 0;
var cIndex = 0;
var rIndex = 0;
var mIndex = 0;
var submitFlag = false;
var rex = /^\d+(\.\d+)?$/;
$(function() {
	/* 查询场所 */
	getSiteList(1);
	getPageCount();
	// 退出按钮
	$('.menu > li.exit').click(function() {
		window.location.href = ctx + "/logOut";
	});
	$('.menu > li.personageCenter').click(function() {
		window.location.href = ctx + "/personalCenter/toPersonalCenter";
	});
	/* 按场所查询 */
	$(".searchPic").click(function() {
		getSiteList(1);
		getPageCount();
	})
	/* 按场所查询回车事件 */
	$('.place-search').keypress(function(e) {
		if (e.keyCode == 13) {
			getSiteList(1);
			getPageCount();
		}
	});
	$('.page_pre').unbind('click').click(
			function() {// 上一页
				if ($('.page_cont > i').eq(0).text() == "1"
						|| $('.page_cont > i').eq(0).text() == "0") {
					return;
				}
				var dang = $('.page_cont > i').eq(0).text();
				if (dang != 1) {
					dang--;
				}
				firstDisp(dang);
				$('.page_cont > i').eq(0).text(dang);
				// 执行获取当前页
				getSiteList($('.page_cont > i').eq(0).text());// 获取场所列表

			});

	$('.page_next').unbind('click').click(
			
			function() {// 下一页
				if ($('.page_cont > i').eq(1).text() == "1" || $('.page_cont > i').eq(1).text() == "0") {
					return;
				}
				if ($('.page_cont > i').eq(0).text() == $('.page_cont > i').eq(1).text()) {
					return;
				}
				var dang = $('.page_cont > i').eq(0).text();
				if (dang != $('.page_cont > i').eq(1).text()) {
					dang++;
				}
				firstDisp(dang);
				// 执行获取当前页ajax
				getSiteList($('.page_cont > i').eq(0).text());// 获取场所列表
				$('.page_cont > i').eq(0).text(dang);
			});

	$('.page_last').click(
			function() {// 尾页按钮

				if ($('.page_cont > i').eq(1).text() == "1"|| $('.page_cont > i').eq(1).text() == "0") {
					return;
				}
				if ($('.page_cont > i').eq(0).text() == $('.page_cont > i').eq(1).text()) {
					return;
				}
				$('.page_cont > i').eq(0).text($('.page_cont > i').eq(1).text());
				firstDisp($('.page_cont > i').eq(0).text());
				getSiteList($('.page_cont > i').eq(0).text());// 获取场所列表
			});

	$('.page_first').click(
			function() {// 首页按钮
				if ($('.page_cont > i').eq(0).text() == 1
						|| $('.page_cont > i').eq(0).text() == 0) {
					return;
				}
				$('.page_cont > i').eq(0).text(1);
				firstDisp(1);
				getSiteList($('.page_cont > i').eq(0).text());// 获取场所列表

			});

	$('.skip').click(
			function() {// 跳转到某页
				if ($('.page_cont > i').eq(0).text() == "1"
						&& $('.page_cont > i').eq(1).text() == "1") {
					$('.page_to').val("");
					return;
				}
				if ($('.page_to').val() == "") {
					return;
				}
				var n = parseInt($('.page_to').val());
				if (n == '' || n < 1 || n > $('.page_cont > i').eq(1).text()) {
					$('.page_to').val('');
					return;
				}
				$('.page_cont > i').eq(0).text(n);
				firstDisp(n);
				$('.page_to').val('');
				getSiteList($('.page_cont > i').eq(0).text());// 获取场所列表

			});

	$('.page_to').keypress(
			function(e) {// 跳转到某页回车事件
				if ($('.page_cont > i').eq(0).text() == "1"
						&& $('.page_cont > i').eq(1).text() == "1") {
					$('.page_to').val("");
					return;
				}
				if (e.keyCode == 13) {
					if ($('.page_to').val() == "") {
						return;
					}
					var n = parseInt($('.page_to').val());
					if (n == '' || n < 1
							|| n > $('.page_cont > i').eq(1).text()
							|| n == undefined) {
						$('.page_to').val('');
						return;
					}
					$('.page_cont > i').eq(0).text(n);
					firstDisp(n);
					$('.page_to').val('');
					getSiteList($('.page_cont > i').eq(0).text());// 获取场所列表

				}
			});

	// 鼠标移入显示场所类型
	$('.show-pStyle').css("display", "none");
	$('.cm-listPic').mouseover(function() {
		var n = $('.cm-listPic').index(this);
		$('.show-pStyle').eq(n).css("display", "block");
	})
	$('.cm-listPic').mouseout(function() {
		var n = $('.cm-listPic').index(this);
		$('.show-pStyle').eq(n).css("display", "none");
	})
	// 弹出用户列表
	var oddNum = $('.ul_cont > li').length;
	// $('.cm-num > span').text(oddNum);
	if (oddNum < 7) {
		$('.page_show').css('display', 'none');
	} else {
		$('.page_show').css('display', 'block');
	}
	// 新增计费保存提示框
	$('.btn-sureAdd').click(function() {
		inputEmpty();
	})

	// 输入框必填项为空报错
	function inputEmpty() {
		if ($(".charge-design").val() == ""
				|| $(".charge-design").val() == undefined) {
			$(".charge-design").addClass('f');
			msg('资费名称不能为空', false);
			return;
		} else {
			$(".charge-design").removeClass('f');
		}
		if ($("#priceMeal").val() == '' || $("#priceMeal").val() == 0) {
			$("#priceMeal").addClass('f');
			msg('收费单价不能为零', false);
			return;
		} else if (!rex.test($("#priceMeal").val())) {
			$("#priceMeal").addClass('f');
			msg('请输入正确金额格式', false);
			return;
		} else {
			$("#priceMeal").removeClass('f');
		}
		if ($("#priceNum").val() == 0 || $("#priceNum").val() == ''
				|| $("#priceNum").val() == undefined) {
			$("#priceNum").addClass('f');
			msg('计费数量不能为空或零', false);
			return;
		} else {
			$("#priceNum").removeClass('f');
		}
		// 融合套餐开关开启/关闭
		if ($('.yesOrNo').hasClass('on')) {// 套餐开启
			if ($('.charge-package').val() == ''
					|| $('.charge-package').val() == 0) {
				$('.charge-package').css('border', '1px solid red');
				msg('套餐收费不能为零', false);
				return;
			} else {
				$('.charge-package').css('border', '1px solid #2cb3c4');
			}
			var len = $(".package-num").length;
			for (var i = 0; i < len; i++) {
				if ($(".package-num").eq(i).val() == '') {
					$('.package-num').eq(i).css('border', '1px solid red');
					msg('融合套餐套餐号段不能为空', false);
					return;
				}
				if ($(".package-num").eq(i).val().length < 3) {
					$('.package-num').eq(i).css('border', '1px solid red');
					msg('融合套餐套餐号段长度不能少于三位', false);
					return;
				}
			}
			var sta1 = $(".shi").css("display");
			var sta2 = $(".liu").css("display");
			if ($('.shi').hasClass('add')) {
				if (checkName()) {
					showNewCharge(1);
				}
			} else {
				showNewCharge(1);
			}
			$('.fusion-meal').css('display', 'block');
			var charge7 = $('.bs-group option:selected').val();
			$('.tc-style').text("");
			$('.tc-style').text(charge7);
		} else {
			$('.tc-style').text("");
			$('.fusion-meal').css('display', 'none');
			var sta1 = $(".shi").css("display");
			var sta2 = $(".liu").css("display");
			if ($('.shi').hasClass('add')) {
				if (checkName()) {
					showNewCharge(0);
				}
			} else {
				showNewCharge(0);
			}
		}
	}
	// 保存新增计费方法
	function showNewCharge(state) {
		$(".mask").css("z-index", "1002");
		if ($('.cn-input').hasClass('f')) {
			return false;
		} else if ($('.charge-package').hasClass('f')) {
			return false;
		} else {
			$(".new-billing").css("display", "none").animate({
				'right' : '-537px'
			});
			$('.charge-tipBox').css('display', 'block');
			// 保存内容的信息
			var charge1 = $('.charge-design').val(); // 资费名称
			var charge2 = $('.charge-price').val(); // 收费单价
			var charge3 = $('.charge-num').val(); // 计费数量
			var charge4 = $('.bs-unit option:selected').val(); // 计费单位
			var charge5 = $('.giving-num').val(); // 赠送数量
			var chargeZ = $('.bs-unit1 option:selected').text(); // 赠送单位
			var charge6 = $('.charge-instro').val(); // 资费说明
			var charge7 = $(".charge-package").val();// 套餐收费
			$('.ct-chargeName').text(charge1);
			$('.ct-common').text(charge2 + '元');
			if ($(".bill-style .on").text() == "时长") {
				$(".ct-chargeStyle").text("时长");
			} else {
				$(".ct-chargeStyle").text("流量");
			}
			if (state == 1) {
				$(".ct-fuck").css("display", "block");
				$('.ct-charge').text(charge7 + '元');
			} else {
				$(".ct-fuck").css("display", "none");
				$('.ct-charge').text('');
			}
			$('.ct-chargeNum').text(charge3 + charge4);
			if (charge5 == '') {
				$('.ct-preferNum').text('0' + chargeZ);
			} else {
				$('.ct-preferNum').text(charge5 + chargeZ);
			}
			if (charge6 == '') {
				$('.ct-chargeIntro').text('无');
			} else {
				$('.ct-chargeIntro').text(charge6);
			}
			$(".sureAdd-btn").attr("value", $(".btn-sureAdd").attr("value"));
		}
	}
	// 点击取消或关闭按钮操作显示提示框
	$('.rl-exit').click(function() {
		cancleBtn();
	})
	$('.btn-cancle').click(function() {
		cancleBtn();
	})
	$('.ct-exit').click(function() {
		changeMsg();
	})
	$('.giveUp-save').click(function() {
		changeMsg();
	})

	// -----------------用户列表点击操作对应变化------------------------//

	// 取消按钮操作
	function cancleBtn() {
		$('.btn-tipBox').css('display', 'block');
		var nowStage = $('.new-billing').css("display");
		$('.btbtn-sure').click(function() {
			if (nowStage == "block") {
				$('.shi').find('img').attr('src', imgPath + '/sele1.png');
				$('.liu').find('img').attr('src', imgPath + '/sele2.png');
				$(".shi").removeClass("add");
				$('.package-cont').css('display', 'none');
				$(".opacity").css("background", "#fff");
				$(".opacity").css("display", "block");
				$(".mask").css("display", "block");
				$('.btn-tipBox').css('display', 'none');
				$(".new-billing").css("display", "none").animate({
					'right' : '-537px'
				});
				var sty = $(".user_list").css("display");
				if (sty == "none") {
					$(".mask").css("display", "none");
				}
				$(".code-detail").eq(0).nextAll().remove();
				$('.code-detail > input').attr("value", "");

			} else {
				$('.btn-tipBox').css('display', 'none');
				$(".mask").css("display", "none");
				$(".opacity").css("display", "none");
			}
		})
		$('.btbtn-cancle').click(function() {
			$('.btn-tipBox').css('display', 'none');
			$(".new-billing").css("display", "block").animate({
				'right' : '0px'
			});

		})
	}
	;
	// 保存或取消操作提示
	function changeMsg() {
		$(".new-billing").css("display", "block").animate({
			'right' : '0px'
		});
		$('.charge-tipBox').css('display', 'none');
		$(".mask").css("z-index", "10");
		$(".ct-rightName").text("");
	}

	// 切换页码--场所列表下
	$('.current-page').text(1);
	$('.total-page').text(10);
	$('.right-to').click(function() {
		var totalPage = $('.total-page').text();
		var currentPage = $('.current-page').text();
		if (currentPage > totalPage - 1) {
			return false;
		}
		$('.current-page').text(++currentPage);
	})
	$('.left-to').click(function() {
		var totalPage = $('.total-page').text();
		var currentPage = $('.current-page').text();
		if (currentPage == 1) {
			return false;
		}
		$('.current-page').text(--currentPage);
	})

	// 融合套餐-开关
	$('.yesOrNo').click(function() {
		if ($('.package-cont').css('display') == 'none') {
			$('.yesOrNo').addClass('on');
		} else {
			$('.yesOrNo').removeClass('on');
		}
		$('.package-cont').toggle();
	})
	/* 时间选卡 */
	$(".shi")
			.click(
					function() {
						$('.shi').find('img').attr('src',
								imgPath + '/sele1.png');
						$('.liu').find('img').attr('src',
								imgPath + '/sele2.png');
						$('.yj').find('img')
								.attr('src', imgPath + '/sele2.png');
						$(".shi").addClass("on");
						$(".liu").removeClass("on");
						$('.ct-chargeStyle').text('时长');
						$('.bs-unit').html(
								'<option value="时">时</option>'
										+ '<option value="天">天</option>'
										+ '<option value="月">月</option>');
						$('.bs-unit1').html(
								'<option value="时">时</option>'
										+ '<option value="天">天</option>'
										+ '<option value="月">月</option>');
						$('.bs-contInput').css("display", "block");
						$('.package-switch').css("display", "block");
						$('.addCodeBtn').css("display", "block");
						$('.bs-contCode').css("display", "block");

						$('.zf-name')
								.html(
										'<input maxlength="6" type="text" class="charge-name cn-input charge-design" id="" value=""  />')

					})
	/* 流量选项 */
	$(".liu")
			.click(
					function() {
						$('.shi').find('img').attr('src',
								imgPath + '/sele2.png');
						$('.liu').find('img').attr('src',
								imgPath + '/sele1.png');
						$('.yj').find('img')
								.attr('src', imgPath + '/sele2.png');
						$(".liu").addClass("on");
						$(".shi").removeClass("on");
						$('.ct-chargeStyle').text('流量');
						$('.bs-unit').html(
								'<option value="G">G</option>'
										+ '<option value="M">M</option>')
						$('.bs-unit1').html(
								'<option value="G">G</option>'
										+ '<option value="M">M</option>')
						$('.bs-contInput').css("display", "block");
						$('.package-switch').css("display", "block");
						$('.addCodeBtn').css("display", "block");
						$('.bs-contCode').css("display", "block");
						$('.zf-name')
								.html(
										'<input maxlength="6" type="text" class="charge-name cn-input charge-design" id="" value=""  />')
					})
	/* 押金 */
	$(".yj")
			.click(
					function() {
						$('.shi').find('img').attr('src',
								imgPath + '/sele2.png');
						$('.liu').find('img').attr('src',
								imgPath + '/sele2.png');
						$('.yj').find('img')
								.attr('src', imgPath + '/sele1.png');

						$('.bs-contInput').css("display", "none");
						$('.package-switch').css("display", "none");
						$('.addCodeBtn').css("display", "none");
						$('.bs-contCode').css("display", "none");

						$('.zf-name')
								.html(
										'<input maxlength="6" type="text" class="charge-name cn-input charge-design" id="" value="押金"  disabled="disabled" />')
					})

	// 增加号段操作
	$('.addCodeBtn')
			.click(
					function() {
						var htmls = '<span class="code-detail"><input type="text" maxlength="7" placeholder="如:138211" class="package-num" id="" value="" onkeyup="this.value=this.value.replace(/\\D/g,\'\')"/><span class="dele-code">X</span></span>';
						var len = $(".package-num").length;
						for (var i = 0; i < len; i++) {
							if ($(".package-num").eq(i).val() == "") {
								msg("请输入套餐号段后再新增号段", false);
								return;
							}
							if ($(".package-num").eq(i).val().length < 3) {
								msg("您输入的套餐号段长度不能少于三位", false);
								$(".package-num").eq(i).val("");
								return;
							}
							for (var j = 0; j < len; j++) {
								if (i != j) {
									if ($(".package-num").eq(i).val() == $(
											".package-num").eq(j).val()) {
										$(".package-num").eq(j).val("");
										msg("套餐号段重复,请重新输入", false);
										return;
									}
								}
							}
						}
						$('.number-list').append(htmls);
						$('.dele-code').unbind('click');
						$('.dele-code').click(function() {
							var n = $('.dele-code').index(this);
							if ($('.code-detail').length == 1) {
								$('.code-detail > input').attr("value", "");
							} else {
								$('.code-detail').eq(n).remove();
							}
						})
					})
	// 新增计费相关说明
	$('.bs-contInput > .qu-pic').mouseover(function() {
		var n = $('.bs-contInput > .qu-pic').index(this);
		$('.ask-answer').eq(n).css('display', 'inline-block');
	})
	$('.bs-contInput > .qu-pic').mouseout(function() {
		var n = $('.bs-contInput > .qu-pic').index(this);
		$('.ask-answer').eq(n).css('display', 'none');
	})
})
/* 获取场所列表 */
function getSiteList(curPage) {
	$(".imgShow").css("display", "none");
	var siteName = $(".place-search").val();
	$
			.ajax({
				type : "post",
				url : ctx + "/SitePriceBilling/getSiteList",
				data : {
					siteName : siteName,
					curPage : curPage
				},
				success : function(data) {
					if (data == "loseSession") {
						window.location.href = ctx + "/toLogin";
						return;
					}
					$(".cm-list li").remove();
					var htmls = '';
					eval("data=" + data);
					if (data.code == 200) {
						for (var i = 0; i < data.data.length; i++) {

							var imgpaths = imgPath
									+ '/'
									+ (data.data[i].site_type.split(',')[0]
											.split('.')[0] == '' ? 'xuexiao'
											: data.data[i].site_type.split(',')[0]
													.split('.')[0]) + 's.png';
							var ismain = imgPath
									+ '/'
									+ (data.data[i].status == 900 ? "place-shou.png"
											: "place-mian.png");
							htmls += '<li value="'
									+ data.data[i].id
									+ '">'
									+ '<p class="cm-listPic"><img src="'
									+ imgpaths
									+ '"><span class="sm-pic"><img src="'
									+ ismain
									+ '"></span></p >'
									+ '<p class="cm-listName">'
									+ data.data[i].site_name
									+ '</p >'
									+ '<p class="cm-listAddress">地址 : <span>'
									+ data.data[i].address
									+ '</span></p >'
									+ '<p class="'
									+ (data.data[i].status == 900 ? 'charge-place'
											: 'charge-place on')
									+ '">'
									+ (data.data[i].status == 900 ? '收费场所'
											: '免费场所')
									+ '</p >'
									+ '<p class="cm-num">场所下套餐数量 : <span>'
									+ data.data[i].nums
									+ '</span></p >'
									+ '<p class="list-msg"><img src="'
									+ imgPath
									+ '/charge1.png" /></p >'
									+ '<p class="addPlaceBtn"><span value='
									+ data.data[i].router_type
									+ '>+</span>新增计费</p >'
									+ '<p imgpaths='
									+ ismain
									+ ' class="'
									+ (data.data[i].status == 900 ? 'placeChange'
											: 'placeChange on')
									+ '">'
									+ (data.data[i].status == 900 ? '设为免费场所'
											: '设为收费场所')
									+ '</p >'
									+ '<div class="show-pStyle">场所类型：<span class="place-style">'
									+ data.data[i].site_type.split(",")[1]
									+ '</span></div>' + '</li>';

						}
						$(".cm-list").html(htmls);

						$(".pager").css("display", "block");
						make();
					} else if (data.code == 201) {
						$(".imgShow").css("display", "block");
						$(".marked").text(data.msg);
						$(".pager").css("display", "none");
						$(".newSite").unbind("click");
						$(".newSite")
								.click(
										function() {
											window.location.href = ctx
													+ "/CloudSiteManage/index?fromTo=1";
										});

					} else if (data.code == 202) {
						$(".imgShow").css("display", "block");
						$(".marked").text(data.msg);
						$(".newSite").css("display", "none");
						$(".pager").css("display", "none");
					}
				}

			})
}
/* 获取场所列表总页数 */
function getPageCount() {
	var siteName = $(".place-search").val();
	$.ajax({
		type : "post",
		url : ctx + "/SitePriceBilling/getTotalPage",
		data : {
			siteName : siteName
		},
		success : function(data) {
			console.log(data);
			if (data == "loseSession") {
				window.location.href = ctx + "/toLogin";
				return;
			}
			eval("data=" + data);
			$(".page_cont i").eq(0).text(data.totoalNum == 0 ? 0 : 1);
			$(".page_cont i").eq(1).text(
					data.totoalNum == 0 ? 0 : data.totoalNum);
		}

	})
}
/* 操作 */
function make() {
	// 鼠标移入显示场所类型
	$('.show-pStyle').css("display", "none");
	$('.cm-listPic').mouseover(function() {
		var n = $('.cm-listPic').index(this);
		$('.show-pStyle').eq(n).css("display", "block");
	})
	$('.cm-listPic').mouseout(function() {
		var n = $('.cm-listPic').index(this);
		$('.show-pStyle').eq(n).css("display", "none");
	})
	// 弹出用户列表
	var oddNum = $('.ul_cont > li').length;
	// $('.cm-num > span').text(oddNum);
	if (oddNum < 7) {
		$('.page_show').css('display', 'none');
	} else {
		$('.page_show').css('display', 'block');
	}
	/* 查看套餐 */
	$(".list-msg").click(
			function() {
				var n = $('.list-msg').index(this);
				var picStage = $(".list-msg").eq(n).find('img').attr('src');
				$(".list-msg").eq(n).find('img').attr('src',
						imgPath + '/user-down.png');
				$(".user_list").prepend(
						$('.changeManage .cm-list > li').eq(n).clone());
				getMeal($(".list-msg").eq(n).parent().attr("value"));

				$(".user_list > li").unbind('click');
				$(".user_list > li").click(
						function() {
							$(".list-msg").eq(n).find('img').attr('src',
									imgPath + '/charge1.png');
							$(".mask").css("display", "none");
							$(".opacity").css("display", "none");
							$(".user_list").css("display", "none");
							$('.user_list > li').first().remove();
						})
				$(".opacity").css("background", "#fff");
				$(".mask").css("display", "block");
				$(".opacity").css("display", "block");
				$(".user_list").css("display", "block");
			});
	// 场所收费-免费切换
	$('.placeChange').unbind("click")
	$('.placeChange').click(function() {
		var n = $('.placeChange').index(this);
		var imgpaths = $('.placeChange').eq(n).attr('imgpaths');
		if ($('.placeChange').eq(n).text() == "设为免费场所") {
			upateSitePay(n, 901, imgpaths);
		} else if ($('.placeChange').eq(n).text() == "设为收费场所") {
			upateSitePay(n, 900, imgpaths);
		}
	})
	$('.sureAdd-btn').unbind('click');
	$('.sureAdd-btn').click(
			function() {
				var charge1 = $('.charge-design').val(); // 资费名称
				var charge2 = $('.charge-price').val(); // 收费单价
				var charge3 = $('.charge-num').val(); // 计费数量
				var chargeS = $('.ct-chargeStyle').text();
				var charge4 = $('.bs-unit option:selected').val(); // 计费单位
				var charge5 = $('.giving-num').val(); // 赠送数量
				var chargeZ = $('.bs-unit1 option:selected').val(); // 赠送单位
				var charge6 = $('.charge-instro').val(); // 资费说明
				var chargeP = $('.charge-package').val(); // 套餐收费
				var charge7 = $('.bs-group option:selected').val(); // 所属集团
				var btnText = $('.sureAdd-btn').text();
				if (btnText == '确认修改') {
					$('.opacity').css('background', '#fff');
					$('.opacity').css('display', 'block');
					$('.mask').css('display', 'block');
					$('.charge-tipBox').css('display', 'none');
					$('.cn-name').eq(sIndex).text(charge1); // 资费名称
					$('.cn-price').eq(sIndex).text(charge2); // 收费单价
					$('.cs-name').eq(sIndex).text(chargeS); // 时长
					$('.fusion-num').eq(sIndex).text(chargeP); // 融合套餐开启
					if (charge6 == '') {
						$('.on-line').eq(sIndex).css('display', 'none'); // 没有资费说明
						$('.charge-inst').eq(sIndex).text('');
					} else {
						$('.on-line').eq(sIndex).css('display', 'block'); // 有资费说明
						$('.charge-inst').eq(sIndex).text(charge6);
					}
					if ($('.yesOrNo').hasClass('on')) {
						$('.ul_single').eq(sIndex).css('display', 'block'); // 有厂商
						$('.taocan').eq(sIndex).css('display', 'block'); // 有融合套餐
						$('.vendor-style').eq(sIndex).text(charge7);
						// 厂商类型
						if (charge7 == '中国电信') {
							$('.ul_single').eq(sIndex).find('img').attr('src',
									imgPath + '/place6.png');
						} else if (charge7 == '中国移动') {
							$('.ul_single').eq(sIndex).find('img').attr('src',
									imgPath + '/place6_06.png');
						} else if (charge7 == '中国联通') {
							$('.ul_single').eq(sIndex).find('img').attr('src',
									imgPath + '/place6_08.png');
						}
						updateChargePrice();

					} else {
						$('.ul_single').eq(sIndex).css('display', 'none'); // 没有厂商
						$('.taocan').eq(sIndex).css('display', 'none'); // 没有融合套餐
						updateChargePrice();
					}

				} else { // 新增的计费信息
					$(".mask").css("display", "none");
					$(".opacity").css("display", "none");
					$('.charge-tipBox').css('display', 'none');
					addChargePrice();
				}
			})
	// 新增计费
	$('.addPlaceBtn').unbind('click');
	$(".addPlaceBtn")
			.click(
					function() {
						var n = $(".addPlaceBtn").index(this);
						var siteId = $(".addPlaceBtn").eq(n).parent().attr(
								"value");
						$
								.ajax({
									type : "post",
									url : ctx + "/SitePriceBilling/getMaxNums",
									data : {
										siteId : siteId
									},
									success : function(data) {
										eval("data=" + data);
										if (data.code == 200) {
											if ($(".addPlaceBtn span").eq(n)
													.attr('value') == "ikuai"
													|| $(".addPlaceBtn span")
															.eq(n)
															.attr('value') == "h3c") {
												$(".liu")
														.css("display", "none");
											} else {
												$(".liu").css("display",
														"block");
											}
											$(".shi").addClass("add");
											$(".shi").css("display", "block");
											$(".bs-flow").removeClass("on");
											$(".bs-time").addClass("on");
											$(".charge-design").attr(
													"disabled", false);
											var mIndex = $(".addPlaceBtn")
													.index(this);
											$('.sureAdd-btn').attr(
													'data-index', mIndex);
											$('.package-cont').css('display',
													'none');
											$(".mask").css("display", "block");
											$(".opacity").css("background",
													"#000");
											$(".opacity").css("display",
													"block");
											$(".new-billing").css("display",
													"block").animate({
												'right' : '0px'
											});
											$('.bs-item').find('img').attr(
													'src',
													imgPath + '/sele2.png').eq(
													0).attr('src',
													imgPath + '/sele1.png');
											$('.bs-unit')
													.html(
															'<option value="时">时</option>'
																	+ '<option value="天">天</option>'
																	+ '<option value="月">月</option>')
											$('.bs-unit1')
													.html(
															'<option value="时">时</option>'
																	+ '<option value="天">天</option>'
																	+ '<option value="月">月</option>')
											$('.charge-package').val('');
											$('.charge-design').val('');
											$('.charge-price').val('');
											$('.charge-num').val('1'); // 计费数量
											$('.giving-num').val('0'); // 赠送数量
											$('.charge-instro').val(''); // 资费说明
											$('.yesOrNo').removeClass('on');
											$('.newadd-charge').text('新 增 计 费');
											$('.new-detailName').text('新增资费明细');
											$('.sureAdd-btn').text('确认保存');
											$(".btn-sureAdd").attr("value",
													siteId);
											$("#sel1").attr("disabled", false);
										} else if (data.code == 201) {
											msg(data.msg, false);
										}
									}

								})

					});

}

// 推荐
function setRecommend(rIndex) {
	var srValue = $('.set-recom').eq(rIndex).text();
	if (srValue == "设为推荐") {
		// $('.ulPic').find('img').each(function() {
		// $(this).attr("src", imgPath+"/qiyong.png");
		// })

		$('.set-recom').text("设为推荐");
		$('.set-recom').css("display", "inline-block");
		$('.set-recom').eq(rIndex).text("取消推荐");
		$('.ulPic').eq(rIndex).find('img')
				.attr("src", imgPath + "/tuijian.png");
		$('.ul_cont').prepend($('.ul_cont >li').eq(rIndex));
	} else {
		$('.set-recom').eq(rIndex).text("设为推荐");
		$('.set-recom').eq(rIndex).css("display", "inline-block");
		$('.ulPic').eq(rIndex).find('img').attr("src", imgPath + "/qiyong.png");
	}
}
// 停用
function stopUse(cIndex) {
	var cmValue = $('.cm-disable').eq(cIndex).text();
	if (cmValue == "停 用") {
		$('.btn-tipBox').css('display', 'block');
		// 停用提示
		$(".btbtn-sure").unbind("click");
		$('.btbtn-sure').click(function() {
			startOrStop(cIndex);
		})
		$(".btbtn-cancle").unbind("click");
		$('.btbtn-cancle').click(function() {
			$('.btn-tipBox').css('display', 'none');
			return;
		})
	} else {
		startOrStop(cIndex);

	}
}
/* 获取场所下设置的套餐 */
function getMeal(siteId) {
	$
			.ajax({
				type : "post",
				url : ctx + "/SitePriceBilling/getUserMeal",
				data : {
					siteId : siteId
				},
				success : function(data) {
					if (data == "loseSession") {
						window.location.href = ctx + "/toLogin";
						return;
					}
					eval("data=" + data);
					$(".ul_cont li").remove();
					var htmls = '';
					if (data.code == 200) {
						for (var i = 0; i < data.data.length; i++) {
							htmls += '<li value="'
									+ data.data[i].priceNum
									+ '" gNume='
									+ data.data[i].giveNum
									+ ' gType='
									+ data.data[i].giveType
									+ ' siteId='
									+ data.data[i].siteId
									+ ' comder='
									+ data.data[i].comder
									+ ' remod='
									+ data.data[i].recommend
									+ '  priceType='
									+ data.data[i].chargeType
									+ '>'
									+ '<p class="ulPic"><img src="'
									+ imgPath
									+ "/"
									+ (data.data[i].recommend == 0 ? (data.data[i].isStoped != 0 ? "tingyong.png"
											: "qiyong.png")
											: "tuijian.png")
									+ '" /></p>'
									+ '<p class="charge-sty"><span>资费名称 :<i class="cn-name">'
									+ data.data[i].chargeName
									+ '</i></span><span>收费价格 :<i class="cn-price">'
									+ parseFloat(data.data[i].commPrice)
											.toFixed2(2) + '</i>元</span></p>';
							if (data.data[i].fusePrice == undefined) {
								htmls += '<p class="ul_long"><span>资费类型 :<i class="cs-name">'
										+ data.data[i].comboTpe
										+ '</i></span><span class="taocan"><i class="fusion-num"></i></span></p>';
							} else {
								htmls += '<p class="ul_long"><span>资费类型 :<i class="cs-name">'
										+ data.data[i].comboTpe
										+ '</i></span><span class="taocan">融合套餐 :<i class="fusion-num">'
										+ parseFloat(data.data[i].fusePrice)
												.toFixed2(2)
										+ '</i>元</span></p>';

							}
							if (data.data[i].groupType == 1) {
								htmls += '<p class="ul_single"><span><img src="'
										+ imgPath
										+ '/place6.png" alt="" /><i class="vendor-style">中国电信</i></span></p>';
							} else if (data.data[i].groupType == 2) {
								htmls += '<p class="ul_single"><span><img src="'
										+ imgPath
										+ '/place6_06.png" alt="" /><i class="vendor-style">中国移动</i></span></p>';
							} else if (data.data[i].groupType == 3) {
								htmls += '<p class="ul_single"><span><img src="'
										+ imgPath
										+ '/place6_08.png" alt="" /><i class="vendor-style">中国联通</i></span></p>';
							} else {
								htmls += '<p class="ul_single"><span><img src="" alt="" /><i class="vendor-style"></i></span></p>';
							}
							htmls += '<p class="on-line"><span class="ci-name">资费说明 :</span><span class="charge-inst">'
									+ data.data[i].describe + '</span></p>';
							if (data.data[i].isStoped == 0) {
								htmls += '<p class="ul_play"><button class="cm-edit">编 辑</button><button class="cm-disable">停 用</button><button class="set-recom">'
										+ (data.data[i].recommend == 0 ? "设为推荐"
												: "取消推荐")
										+ '</button></p>'
										+ '</li>';
							} else {
								htmls += '<p class="ul_play"><button class="cm-edit">编 辑</button><button class="cm-disable">启 用</button><button class="set-recom" style="display:none">'
										+ (data.data[i].recommend == 0 ? "设为推荐"
												: "取消推荐")
										+ '</button></p>'
										+ '</li>';
							}

						}
						$(".ul_cont").html(htmls);
						for (var i = 0; i < $(".ul_cont li").length; i++) {
							if ($(".ul_cont li").eq(i).attr("remod") == 1) {
								if (i != 0)
									$(".ul_cont li").eq(0).before(
											$(".ul_cont li").eq(i));
								break;
							}
						}

						// 停用操作
						$('.cm-disable').unbind("click");
						$('.cm-disable').click(function() {
							cIndex = $('.cm-disable').index(this);
							stopUse(cIndex);
						})
						// 设为推荐
						$('.set-recom').unbind("click");
						$('.set-recom').click(function() {
							var rIndex = $('.set-recom').index(this);
							recomd(rIndex);
						})
						// 编辑操作
						$('.cm-edit').unbind("click");
						$('.cm-edit').click(function() {
							$('.opacity').css('background', '#000');
							$('.opacity').css('display', 'block');
							sIndex = $('.cm-edit').index(this);
							editDetail(sIndex, 'xg');
						})

					} else if (data.code == 201) {
						msg(data.msg, false);
					}
				}
			})
}
/* 设为免费场所 */
function upateSitePay(n, stau, imgPaths) {
	var siteId = $(".placeChange").eq(n).parent().attr("value");
	$.ajax({
		type : "post",
		url : ctx + "/SitePriceBilling/updatesitePay",
		data : {
			siteId : siteId,
			status : stau
		},
		success : function(data) {
			if (data == "loseSession") {
				window.location.href = ctx + "/toLogin";
				return;
			}
			eval("data=" + data);
			if (data.code == 200) {
				if ($('.placeChange').eq(n).text() == "设为免费场所") {
					$('.placeChange').eq(n).text("设为收费场所");
					$('.placeChange').eq(n).css("background", "#FEC66E");
					$('.placeChange').eq(n).css("color", "#fff");
					$(".charge-place").eq(n).text("免费场所");
					$(".charge-place").eq(n).css("color", "#FFAF66");
					$(".cm-listPic").eq(n).find('.sm-pic').find('img').attr(
							"src", imgPath + '/' + "place-mian.png")
				} else if ($('.placeChange').eq(n).text() == "设为收费场所") {
					$('.placeChange').eq(n).text("设为免费场所");
					$('.placeChange').eq(n).css("background", "#C2EBEF");
					$('.placeChange').eq(n).css("color", "#4CADB9");
					$(".charge-place").eq(n).text("收费场所");
					$(".charge-place").eq(n).css("color", "#4cadb9");
					$(".cm-listPic").eq(n).find('.sm-pic').find('img').attr(
							"src", imgPath + '/' + "place-shou.png")
					$('.placeChange').eq(n).removeClass('on');
					$(".charge-place").eq(n).removeClass('on');
				}
			} else if (data.code == 201) {
				msg(data.msg, false);
			}
		}
	})
}
/* 停用, 启用套餐 */
function startOrStop(n) {
	var state = 0;
	var cmValue = $('.cm-disable').eq(n).text();
	var name = $('.cn-name').eq(n).text();
	var siteId = $('.cm-disable').eq(n).parent().parent().attr("siteId");
	if (cmValue == "停 用") {
		state = 1;
	}
	$.ajax({
		type : "post",
		url : ctx + "/SitePriceBilling/updateIsStop",
		data : {
			siteId : siteId,
			name : name,
			state : state
		},
		success : function(data) {
			if (data == "loseSession") {
				window.location.href = ctx + "/toLogin";
				return;
			}
			eval("data=" + data);
			$('.btn-tipBox').css('display', 'none');
			if (data.code == 200) {
				if (state == 1) {
					$('.btn-tipBox').css('display', 'none');
					$('.cm-disable').eq(n).text("启 用");
					$('.set-recom').eq(n).text("设为推荐");
					$('.set-recom').eq(n).css("display", "none");
					$('.ulPic').eq(n).find('img').attr("src",
							imgPath + "/tingyong.png");
				} else {
					$('.cm-disable').eq(n).text("停 用");
					$('.set-recom').eq(n).css("display", "inline-block");
					$('.ulPic').eq(n).find('img').attr("src",
							imgPath + "/qiyong.png");
				}
			}
			if (data.code == 201) {
				msg(data.msg, false);
				return;
			}
			if (data.code == 202) {
				msg(data.msg, false);
				return;
			}
		}
	})
}
/* 推荐套餐 */
function recomd(n) {
	var srValue = $('.set-recom').eq(n).text();
	var state = 0;
	if (srValue == "设为推荐") {
		state = 1;
	}
	var name = $('.cn-name').eq(n).text();
	var siteId = $('.set-recom').eq(n).parent().parent().attr("siteId");
	$.ajax({
		type : "post",
		url : ctx + "/SitePriceBilling/recommendMeal",
		data : {
			mealName : name,
			siteId : siteId,
			type : state
		},
		success : function(data) {
			if (data == "loseSession") {
				window.location.href = ctx + "/toLogin";
				return;
			}
			eval("data=" + data);
			if (data.code == 200) {
				getMeal(siteId);
			} else if (data.code == 201) {
				msg(data.msg, false);
				return;
			} else if (data.code == 202) {
				msg(data.msg, false);
				return;
			}
		}
	})
}

// 编辑
function editDetail(n, str) {
	if (str == 'xg') {
		$('.new-billing').css('display', 'block').animate({
			'right' : '0px'
		});
		$('.newadd-charge').text('修 改 套 餐 信 息');
		var cont1 = $('.cn-name').eq(n).text(); // 资费名称
		var cont2 = $('.cn-price').eq(n).text(); // 收费单价
		var cont3 = $('.fusion-num').eq(n).text(); // 融合套餐开启
		var cont4 = $('.charge-inst').eq(n).text(); // 资费说明
		var cont5 = $('.vendor-style').eq(n).text(); // 套餐收费
		var cont6 = $('.cs-name').eq(n).text(); // 时长
		var cont7 = $('.cs-name').eq(n).parent().parent().parent()
				.attr("value");// 计费数量
		var cont8 = $('.cs-name').eq(n).parent().parent().parent()
				.attr("gnume");// 赠送数量
		var cont9 = $('.cs-name').eq(n).parent().parent().parent()
				.attr("gtype");// 赠送单位
		var cont10 = $('.cs-name').eq(n).parent().parent().parent().attr(
				"comder");// 套餐号段
		var cont11 = $('.cs-name').eq(n).parent().parent().parent().attr(
				"siteId");// 场所id
		var cont12 = $('.cs-name').eq(n).parent().parent().parent().attr(
				"pricetype");// 套餐单位
		$('.charge-design').val(cont1); // 资费名称
		$('.charge-price').val(cont2); // 收费单价
		$("#priceNum").val(cont7);
		$(".giving-num").val(cont8);
		if (cont6 == '时长') {
			$(".bs-flow").removeClass("on");
			$(".bs-time").addClass("on");
			$(".liu").css("display", "none");
			$(".shi").css("display", "block");
			$('.bs-unit').html(
					'<option value='
							+ (cont12 == 0 ? "时" : cont12 == 1 ? "天" : "月")
							+ '>'
							+ (cont12 == 0 ? "时" : cont12 == 1 ? "天" : "月")
							+ '</option>')
			var ls = '<option value="' + cont9 + '">'
					+ (cont9 == 0 ? "时" : cont9 == 1 ? "天" : "月") + '</option>';
			if (cont9 == 0) {
				ls += '<option value="1">天</option>'
						+ '<option value="2">月</option>';
			}
			if (cont9 == 1) {
				ls += '<option value="0">时</option>'
						+ '<option value="2">月</option>';
			}
			if (cont9 == 2) {
				ls += '<option value="0">时</option>'
						+ '<option value="1">天</option>';
			}
			$('.bs-unit1').html(ls);
		} else {
			$(".bs-time").removeClass("on");
			$(".bs-flow").addClass("on");
			$(".shi").css("display", "none");
			$(".liu").css("display", "block");
			$(".liu img").attr("src", imgPath + "/sele1.png");
			$('.bs-unit').html(
					'<option value="' + (cont12 == 4 ? "M" : "G") + '">'
							+ (cont12 == 4 ? "M" : "G") + '</option>')
			var flowLs = '<option value="' + cont9 + '">'
					+ (cont9 == 4 ? "M" : "G") + '</option>';
			if (cont9 == 4) {
				flowLs += '<option value="5">G</option>';
			}
			if (cont9 == 5) {
				flowLs += '<option value="4">M</option>';
			}
			$('.bs-unit1').html(flowLs);
		}
		$("#sel1").attr("disabled", true)
		if (!cont4 == '') {
			$('.charge-instro').val(cont4); // 资费说明
		} else {
			$('.charge-instro').val(''); // 资费说明
		}
		if (!cont3 == '') { // 融合套餐开启
			$('.yesOrNo').addClass('on');
			$('.package-cont').css('display', 'block');
			$('.charge-package').val(cont3); // 套餐收费
			option(cont5);
			var htmls = '';
			if (cont10 != "" && cont10 != undefined) {
				for (var i = 0; i < cont10.split(";").length - 1; i++) {
					htmls += '<span class="code-detail"><input type="text" maxlength="7" placeholder="如:138211" class="package-num" id="" value='
							+ cont10.split(";")[i]
							+ ' onkeyup="this.value=this.value.replace(/\\D/g,\'\')"/><span class="dele-code">X</span></span>';
				}
				$('.code-detail').remove();
				$('.number-list').html(htmls);
			}
			$('.dele-code').unbind('click');
			$('.dele-code').click(function() {
				var n = $('.dele-code').index(this);
				if ($('.code-detail').length == 1) {
					$('.code-detail > input').attr("value", "");
				} else {
					$('.code-detail').eq(n).remove();
				}
			})
		} else { // 融合套餐未开启
			$('.yesOrNo').removeClass('on');
			$('.package-cont').css('display', 'none');
		}
		$(".charge-design").attr("disabled", true);
		$('.sureAdd-btn').text('确认修改');
		$(".btn-sureAdd").attr("value", cont11);
		$('.new-detailName').text('修改资费明细');

		$('.btn-cancle').click(function() {
			// cancleBtn();

			$('.btn-tipBox').css('display', 'block');
			var nowStage = $('.new-billing').css("display");
			$('.btbtn-sure').unbind("click");
			$('.btbtn-sure').click(function() {
				if (nowStage == "block") {
					$('.shi').find('img').attr('src', imgPath + '/sele1.png');
					$('.liu').find('img').attr('src', imgPath + '/sele2.png');
					$(".shi").removeClass("add");
					$('.package-cont').css('display', 'none');
					$(".opacity").css("background", "#fff");
					$(".opacity").css("display", "block");
					$(".mask").css("display", "block");
					$('.btn-tipBox').css('display', 'none');
					$(".new-billing").css("display", "none").animate({
						'right' : '-537px'
					});
					var sty = $(".user_list").css("display");
					if (sty == "none") {
						$(".mask").css("display", "none");
					}
					$(".code-detail").eq(0).nextAll().remove();
					$('.code-detail > input').attr("value", "");

				} else {
					$('.btn-tipBox').css('display', 'none');
					$(".mask").css("display", "none");
					$(".opacity").css("display", "none");
				}
			})
			$('.btbtn-cancle').click(function() {
				$('.btn-tipBox').css('display', 'none');
				$(".new-billing").css("display", "block").animate({
					'right' : '0px'
				});

			})

		})
	}
}
/* 修改截取小数后两位原型方法 */
Number.prototype.toFixed2 = function() {
	return parseFloat(this.toString().replace(/(\.\d{2})\d+$/, "$1"));
}
/* 编辑套餐 */
function updateChargePrice() {
	var name = $('.ct-chargeName').text().replace(/\s+/g, "");// 资费名称
	var noChargePrice = $('.ct-common').text().replace(/[\u4e00-\u9fa5]+/g, '')
			.trim();// 收费单价
	var chargePrice = $('.ct-charge').text().replace(/[\u4e00-\u9fa5]+/g, '')
			.trim();// 套餐收费
	var priceNum = $('.ct-chargeNum').text().replace(/[^0-9]+/g, '').trim();// 计费数量
	var priceUnit = $('.ct-chargeNum').text().charAt(
			$('.ct-chargeNum').text().length - 1);// 计费单位
	var giveNum = $(".ct-preferNum").text().replace(/[^0-9]+/g, '').trim();// 优惠数量
	var giveUnit = $(".ct-preferNum").text().charAt(
			$('.ct-preferNum').text().length - 1);// 优惠单位
	var describe = $(".ct-chargeIntro").text() == "无" ? "" : $(
			".ct-chargeIntro").text();// 资费说明
	var chargeGroup = $(".tc-style").text();// 归属集团
	var siteId = $('.sureAdd-btn').attr("value");// 场所id
	var comboNumber = "";
	for (var int = 0; int < $(".package-num").length; int++) {
		if (comboNumber.indexOf($(".package-num").eq(int).val()) < 0
				&& $(".package-num").eq(int).val() != ""
				& $(".package-num").eq(int).val() != undefined) {
			comboNumber += $(".package-num").eq(int).val() + ";";
		}
	}
	switch (priceUnit) {
	case '时':
		priceUnit = 0;
		break;
	case '天':
		priceUnit = 1;
		break;
	case '月':
		priceUnit = 2;
		break;
	case 'M':
		priceUnit = 4;
		break;
	case 'G':
		priceUnit = 5;
		break;
	}
	switch (giveUnit) {
	case '时':
		giveUnit = 0;
		break;
	case '天':
		giveUnit = 1;
		break;
	case '月':
		giveUnit = 2;
		break;
	case 'M':
		giveUnit = 4;
		break;
	case 'G':
		giveUnit = 5;
		break;
	}
	switch (chargeGroup) {
	case '中国电信':
		chargeGroup = 1;
		break;
	case '中国移动':
		chargeGroup = 2;
		break;
	case '中国联通':
		chargeGroup = 3;
		break;
	}
	$.ajax({
		type : "post",
		url : ctx + "/SitePriceBilling/updateprice",
		data : {
			priceName : name,
			chargePrice : chargePrice,
			noChargePrice : noChargePrice,
			charge_type : chargeGroup,
			siteId : siteId,
			comboNumber : comboNumber,
			price_num : priceNum,
			price_type : priceUnit,
			give_type : giveUnit,
			give_num : giveNum,
			describe : describe
		},
		success : function(data) {
			if (data == "loseSession") {
				window.location.href = ctx + "/toLogin";
				return;
			}
			eval("data=" + data);
			if (data.code == 200) {
				msg('修改成功', true);
				$(".ct-rightName").text("");
				$(".mask").css("z-index", "10");
				$('.bs-group option').attr('selected', false);
				getMeal(siteId);
				return;
			} else {
				$(".ct-rightName").text("");
				$(".mask").css("z-index", "10");
				$('.bs-group option').attr('selected', false);
				msg('网络繁忙请稍后重试', false);
				return;
			}
		}
	});

}
/* 新增套餐 */
function addChargePrice() {
	var name = $('.ct-chargeName').text().replace(/\s+/g, "");// 资费名称
	var noChargePrice = $('.ct-common').text().replace(/[\u4e00-\u9fa5]+/g, '')
			.trim();// 收费单价
	var chargePrice = $('.ct-charge').text().replace(/[\u4e00-\u9fa5]+/g, '')
			.trim();// 套餐收费
	var priceNum = $('.ct-chargeNum').text().replace(/[^0-9]+/g, '').trim();// 计费数量
	var priceUnit = $('.ct-chargeNum').text().replace(/[^\u4e00-\u9fa5]/g, "");// 计费单位
	if (priceUnit == "") {
		priceUnit = $('.ct-chargeNum').text().replace(/[^a-zA-Z]/g, "");
	}
	var giveNum = $(".ct-preferNum").text().replace(/[^0-9]+/g, '').trim();// 优惠数量
	var giveUnit = $(".ct-preferNum").text().replace(/[^\u4e00-\u9fa5]/g, "");// 优惠单位
	if (giveUnit == "") {
		giveUnit = $(".ct-preferNum").text().replace(/[^a-zA-Z]/g, "");
	}
	var describe = $(".ct-chargeIntro").text() == "无" ? "" : $(
			".ct-chargeIntro").text();// 资费说明
	var chargeGroup = $(".tc-style").text();// 归属集团
	var siteId = $('.sureAdd-btn').attr("value");// 场所id
	var comboNumber = "";
	for (var int = 0; int < $(".package-num").length; int++) {
		if (comboNumber.indexOf($(".package-num").eq(int).val()) < 0
				&& $(".package-num").eq(int).val() != ""
				& $(".package-num").eq(int).val() != undefined) {
			comboNumber += $(".package-num").eq(int).val() + ";";
		}
	}

	switch (priceUnit) {
	case '时':
		priceUnit = 0;
		break;
	case '天':
		priceUnit = 1;
		break;
	case '月':
		priceUnit = 2;
		break;
	case 'M':
		priceUnit = 4;
		break;
	case 'G':
		priceUnit = 5;
		break;
	}
	switch (giveUnit) {
	case '时':
		giveUnit = 0;
		break;
	case '天':
		giveUnit = 1;
		break;
	case '月':
		giveUnit = 2;
		break;
	case 'M':
		giveUnit = 4;
		break;
	case 'G':
		giveUnit = 5;
		break;
	}
	switch (chargeGroup) {
	case '中国电信':
		chargeGroup = 1;
		break;
	case '中国移动':
		chargeGroup = 2;
		break;
	case '中国联通':
		chargeGroup = 3;
		break;
	}
	$.ajax({
		type : "post",
		url : ctx + "/SitePriceBilling/addprice",
		data : {
			priceName : name,
			chargePrice : chargePrice,
			noChargePrice : noChargePrice,
			charge_type : chargeGroup,
			site_id : siteId,
			comboNumber : comboNumber,
			price_num : priceNum,
			price_type : priceUnit,
			give_type : giveUnit,
			give_num : giveNum,
			describe : describe
		},
		success : function(data) {
			if (data == "loseSession") {
				window.location.href = ctx + "/toLogin";
				return;
			}
			eval("data=" + data);
			if (data.code == 200) {
				$('.shi').find('img').attr('src', imgPath + '/sele1.png');
				$('.liu').find('img').attr('src', imgPath + '/sele2.png');
				$('.shi').removeClass('add');
				msg('添加成功', true);
				$(".ct-rightName").text("");
				$(".mask").css("z-index", "10");
				$(".right-box input").val("");
				$(".code-detail").eq(0).nextAll().remove();
				$('.code-detail > input').attr("value", "");
				getSiteList($(".page_cont i").eq(0).text());
				return;
			} else {
				$('.shi').find('img').attr('src', imgPath + '/sele1.png');
				$('.liu').find('img').attr('src', imgPath + '/sele2.png');
				$(".ct-rightName").text("");
				$(".mask").css("z-index", "10");
				$(".right-box input").val("");
				$(".code-detail").eq(0).nextAll().remove();
				$('.code-detail > input').attr("value", "");
				msg('网络繁忙请稍后重试', false);
				return;
			}
		}
	});

}
/* 查询是否已有相同名称的套餐 */
function checkName() {
	var name = $(".charge-design").val().replace(/\s+/g, "");
	var siteId = $(".btn-sureAdd").attr("value");
	$.ajax({
		type : "post",
		url : ctx + "/SitePriceBilling/checkName",
		async : false,
		data : {
			siteId : siteId,
			name : name
		},
		success : function(data) {
			eval("data=" + data);
			if (data.code == 200) {
				submitFlag = true;
			} else if (data.code == 201) {
				msg(data.msg, false);
				submitFlag = false;
			}
		}
	})
	return submitFlag;
}

// option对应值
function option(str) {
	var n = 0;
	$('.bs-group option').eq(0).attr('selected', true);
	$('.bs-group option').eq(n).val(str).text(str);
	var yys = [ '中国电信', '中国移动', '中国联通' ];
	for ( var i in yys) {
		n++;
		if (yys[i] != str) {
			$('.bs-group option').eq(n).val(yys[i]).text(yys[i]);
		} else {
			n--;
		}
	}
}