$(function() {
	// 详情
	$(document).on("tap", ".details-btn", function() {
		$(this).parent().siblings().show();
		$(this).parent().remove();
	});
	// 分享
	$(document).on("tap", ".share", function() {
		var shares = $(this).find(".ul-way");
		var img = $(this).find(".img-choose").children();
		if ($(this).hasClass("shared")) {
			shares.transition({
				scale : 0,
				opacity : 0
			}, 400);
			$(this).removeClass("shared");
			img.eq(0).css("display", "block").next().hide();
		} else {
			shares.show().css({
				opacity : 0,
				scale : 0
			}).transition({
				scale : 1,
				opacity : 1
			}, 400);
			$(this).addClass("shared");
			img.eq(0).hide().next().css({
				"display" : "block"
			});
		}
	});
	// 回到顶部
	$(document).on("tap", ".fixed", function(event) {
		event.preventDefault();
		$(window).scrollTop(0);
	});
	// 点赞
	$(document).on("tap", ".praise", function() {
		if (!$(this).hasClass("praised")) {
			$(this).addClass("praised")
			var img = $(this).find(".img-choose").children();
			img.eq(0).hide().next().css("display", "block");
			var img2 = img.eq(0).hide().next();
			img2.transition({
				scale : 2,
				complete : function() {
					$(this).transition({
						scale : 1,
						compelte : function() {
							var span = $(this).parent().next();
							var html = parseInt(span.html());
							span.html(html + 1);
						}
					}, 300);
				}
			}, 500);
		}
	});
	// 周边活动飘移
	if ($(".activity").length) {
		var top = $(".activity").offset().top;
		$(window).scroll(
				function() {
					if (document.documentElement.scrollTop
							+ document.body.scrollTop > top) {
						$(".activitys").css({
							"position" : "fixed",
							"top" : 0
						}).height(88).find("h3").show().next().hide();
						$(".header").hide();
					} else {
						$(".activitys").css({
							"position" : "relative",
							"top" : 0
						}).height("").find("h3").hide().next().show();
						$(".header").show();
					}
				});
	}
	// 标题轮播
	nameScroll = function(div) {
		var html = div.html();
		var length = html.length;
		var start = 0;
		var end = 4
		setInterval(function() {
			var newHtml = html.substring(start, end);
			start++;
			end++;
			div.html(newHtml);
			if (end == length + 1) {
				start = 0;
				end = 4
			}
		}, 500);
	}
	$(".name").each(function() {
		if ($(this).html().length > 4) {
			nameScroll($(this));
		}
	});
	// //视频页面
	// if ( $("#video").length )
	// {
	// window.onload = function()
	// {
	// video = document.getElementById("video");
	// video.play();
	// autos = setInterval(function(){
	// if ( video.currentTime != 0 )
	// {
	// clearInterval(autos);
	// time = parseInt(video.duration);
	// autovideo = setInterval(function(){
	// plays();
	// },100)
	// }
	// },100)
	// }
	// function plays()
	// {
	// if ( !video.paused )
	// {
	// clearInterval(autovideo);
	// $(".ontime").html(time).show();
	// autovideos = setInterval(function(){
	// time--;
	// $(".ontime").html(time);
	// if ( video.ended )
	// {
	// clearInterval(autovideos);
	// $(".ontime").hide();
	// time = parseInt(video.duration);
	// }
	// paused();
	// },1000)
	// }
	// }
	// function paused()
	// {
	// if ( video.paused )
	// {
	// clearInterval(autovideos);
	// autovideo = setInterval(function(){
	// plays();
	// },100)
	// }
	// }
	// $(document).on("tap",".voice",function(){
	// if ( video.muted )
	// {
	// video.muted=false;
	// $(this).removeClass("voiced");
	// }
	// else
	// {
	// video.muted=true;
	// $(this).addClass("voiced");
	// }
	// })
	// }
	// ajax
	var isajax = false;
	var totalheight = 0;
	function loadData() {
		totalheight = parseFloat(document.documentElement.clientHeight)
				+ parseFloat(document.documentElement.scrollTop
						+ document.body.scrollTop);
		if (document.body.clientHeight - 30 <= totalheight) { // 说明滚动条已达底部
			if (isajax == false) {
				isajax = true;
				ajax();
			}
		}
		console.log(totalheight)
		console.log(document.body.clientHeight)
	}
	//每次滑动滚动条都提一次数据预存
	$(window).scroll(function() {
		loadData();
	});
	//打开页面时加载数据
	loadData();
	//更多
	$(".more").one("click", function() {
		loadData();
	});
	//后台请求
	function ajax() {
		var container = $(".main"); // 加载容器
		var data = {}; // 查询参数
		jQuery.ajax({
			type : "GET",
			url : "ajax.html",
			dataType : "html",
			beforeSend : function(XMLHttpRequest) {
				$(".activity").find("h3").html('周边活动加载中...');
			},
			success : function(data) {
				container.append(data);
				$(".activity").find("h3").html('周边活动');
				$(".activity").nextAll().find(".name").each(function() {
					if ($(this).html().length > 4) {
						nameScroll($(this));
					}
				});
			},
			error : function() {
				isajax = false;
				$(".activity").addClass("loadagin").find("h3").html(
						'周边活动加载失败，点击重新加载')
			}
		});
	}
	$(document).on("click", ".loadagin", function() {
		ajax();
	});
	//加载当前店铺数据
	loadown();
	/////////////////加载事件结尾、、、、、、、、、、、、、
});


function loadown(){
	$.ajax({
		type : "POST",
		url : "/v2/StoreActivityForPhone",
		data : {
			
		},
		success : function(data) {
			eval("data = " + data);
			if (data.code == 200) {

				// 组建页面
				buildActivityList_phone(data,"activityList_all");

			} else {
				$("#activityList_all").html("暂无");
			}
		},
		error : function() {
			$("#activityList_all").html("加载失败，请稍后重试");
		}
	});
}
//构造页面(按DIV父子级次序)
function buildActivityList_phone(data,divId){
	var div_parent=$("#"+divId);
	div_parent.empty();
	data = data.data;
	for (var i = 0; i < data.length; i++) {
		var div1=$("<div/>").addClass("show").appendTo(div_parent);
		var div2=$("<div/>").addClass("hot").appendTo(div_parent);
		var img_hot=$("<img/>").attr("src",data[i].signUrl).appendTo(div2);
		var span_hot=$("<span/>").html(data[i].sign).appendTo(div2);
		var div3=$("<div/>").addClass("img-show").appendTo(div_parent);
		var img_div3=$("<img/>").attr("src",data[i].imgUrl).appendTo(div3);
		var div3_1=$("<div/>").addClass("choose").appendTo(div3);
		var div3_1_1=$("<div/>").addClass("choose-tit").text(data[i].topical).appendTo(div3_1);
		var div3_1_2=$("<div/>").addClass("praise").appendTo(div3_1_1);
		var div3_1_2_1=$("<div/>").addClass("img-choose").appendTo(div3_1_2);
		var div3_1_2_1_img1=$("<img/>").attr("src","${curPath}/img/storeActivity/praise-no.png").appendTo(div3_1_2_1);
		var div3_1_2_1_img2=$("<img/>").attr("src","${curPath}/img/storeActivity/praise-ok.png").appendTo(div3_1_2_1);
		var div3_1_2_span=$("<span/>").text(data[i].likeCount).appendTo(div3_1_2);
		var div3_1_3=$("<div/>").addClass("share").appendTo(div3_1);
		var div3_1_3_1=$("<div/>").addClass("share-btn").appendTo(div3_1_3);
		var div3_1_3_1_1=$("<div/>").addClass("img-choose").appendTo(div3_1_3_1);
		var div3_1_3_1_1_img1=$("<img/>").attr("src","${curPath}/img/storeActivity/share-no.png").appendTo(div3_1_3_1_1);
		var div3_1_3_1_1_img2=$("<img/>").attr("src","${curPath}/img/storeActivity/share-ok.png").appendTo(div3_1_3_1_1);
		var div3_1_3_1_span=$("<span/>").text(data[i].shareCount).appendTo(div3_1_3_1);
		var div3_1_ul=$("<ul/>").addClass("ul-way").appendTo(div3_1_3);
		var li1=$("<li/>").addClass("way1").appendTo(div3_1_ul);
		var li1_a=$("<a/>").appendTo(li1);
		var li1_a_img=$("<img/>").attr("src","${curPath}/img/storeActivity/kongjian.png").appendTo(li1_a);
		var li2=$("<li/>").addClass("way2").appendTo(div3_1_ul);
		var li2_a=$("<a/>").appendTo(li2);
		var li2_a_img=$("<img/>").attr("src","${curPath}/img/storeActivity/sina.png").appendTo(li2_a);
		var li3=$("<li/>").addClass("way3").appendTo(div3_1_ul);
		var li3_a=$("<a/>").appendTo(li3);
		var li3_a_img=$("<img/>").attr("src","${curPath}/img/storeActivity/weixin.png").appendTo(li3_a);
		var div4=$("<div/>").addClass("show-tit").appendTo(div_parent);
		var div4_1=$("<div/>").addClass("name-wrap").appendTo(div4);
		var div4_1_1=$("<div/>").text("[").appendTo(div4_1);
		var div4_1_2=$("<div/>").addClss("name").text(data[i].storeName).appendTo(div4_1);
		var div4_1_3=$("<div/>").text("]").appendTo(div4_1);
		var div4_2=$("<p/>").text(data[i].name).appendTo(div4);
		var div5=$("<div/>").addClass("details").appendTo(div_parent);
		var div5_1=$("<div/>").addClass("details-time").text(data[i].start+"日-"+data[i].end+"日").appendTo(div5);
		var div5_1_em=$("<em/>").addClass("time").appendTo(div5_1);
		var div5_1_span=$("<span/>").addClass("details-btn").text("查看详情").appendTo(div5_1);
		var div5_2=$("<div/>").addClass("details-info").appendTo(div5);
		var div5_2_dl1=$("<dl/>").appendTo(div5_2);
		var div5_2_dl1_dt=$("<dt/>").text("活动日期").appendTo(div5_2_dl1);
		var div5_2_dl1_dd=$("<dd/>").text(data[i].start+"日-"+data[i].end+"日").appendTo(div5_2_dl1);
		var div5_2_dl2=$("<dl/>").appendTo(div5_2);
		var div5_2_dl2_dt=$("<dt/>").text("活动简介").appendTo(div5_2_dl2);
		var div5_2_dl2_dd=$("<dd/>").text(data[i].decision).appendTo(div5_2_dl2);
//		var div5_2_dl3=$("<dl/>").appendTo(div5_2);
//		var div5_2_dl3_dt=$("<dt/>").appendTo(div5_2_dl3);
//		var div5_2_dl3_dd=$("<dd/>").appendTo(div5_2_dl3);
	}
	
	//依照以下格式
//	1<div class="show">
//	2<div class="hot"><img src="${curPath}/img/storeActivity/rec.png"/>
// 	 <span>推荐</span>
//  </div>
//	3<div class="img-show">
//		<img src="${curPath}/img/storeActivity/3.jpg"/>
//		<div class="choose">
//			<div class="choose-tit">正宗口水鸡</div>
//			<div class="praise">
//				<div class="img-choose">
//					<img src="${curPath}/img/storeActivity/praise-no.png"/>
//					<img src="${curPath}/img/storeActivity/praise-ok.png"/>
//				</div>
//				<span>256</span>
//			</div>
//			<div class="share">
//				<div class="share-btn">
//					<div class="img-choose">
//						<img src="${curPath}/img/storeActivity/share-no.png"/>
//						<img src="${curPath}/img/storeActivity/share-ok.png"/>
//					</div>
//					<span>368</span>
//				</div>
//				<ul class="ul-way">
//					<li class="way-1"><a><img src="${curPath}/img/storeActivity/kongjian.png"/></a></li>
//					<li class="way-2"><a><img src="${curPath}/img/storeActivity/sina.png"/></a></li>
//					<li class="way-3"><a><img src="${curPath}/img/storeActivity/weixin.png"/></a></li>
//				</ul>
//			</div>	
//		</div>
//	</div>
	
//	4<div class="show-tit">
//		<div class="name-wrap">
//			<div>[</div>
//			<div class="name">北京西四环大地店</div>
//			<div>]</div>
//		</div>
//		<p>来店可免费领取啤酒一瓶</p>
//	</div>
//	5<div class="details">
//		<div class="details-time">
//			<em class="time">12.03日-12.23日</em>
//			<span class="details-btn">详情>></span>
//		</div>
//		<div class="details-info">
//			<dl>
//				<dt>活动日期：</dt>
//				<dd>12.03日-12.23日</dd>
//			</dl>
//			<dl>
//				<dt>活动内容：</dt>
//				<dd>凡活动期内来店可免费领取啤酒一瓶，外 边吃边送，快来带小伙伴们一起来吃吧。</dd>
//			</dl>
//			
//			<dl>
//				<dt>商品介绍：</dt>
//				<dd>我是什么材质的，用什么做的，我是什么 材质的，用什么做的，</dd>
//			</dl>
//		</div>
//	</div>
//</div>
}