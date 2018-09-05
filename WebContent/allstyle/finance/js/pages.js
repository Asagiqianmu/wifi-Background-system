/**
 * Created by Administrator on 2016/9/18.
 */
window.onload = function () {
};



/* 分页
 * total 总页数
 * backFn 回调函数，获取当前第几页
 */
function pages(total,backFn) {

    var pages = document.getElementById('pages');
    pages.innerHTML = '<div class="page1">'+
                        '<span id="firstPage" class="pageBtn font-w pagePointer mgn-5">首页</span>'+
                        '<span id="prePage" class="pageBtn font-w pagePointer mgn-5"><img src="'+imgPath+'/pre.png"></span>'+
                        '<span class="mgn-5"><span id="currentPage" class="font-b">1</span>/<span id="totalPage">8</span></span>'+
                        '<span id="nextPage" class="pageBtn font-w pagePointer mgn-5"><img src="'+imgPath+'/next.png"></span>'+
                        '<span id="lastPage" class="pageBtn font-w pagePointer mgn-5">尾页</span>'+
                        '<input id="numPage" class="pageNum mgn-5" type="number"/>'+
                        '<span id="jumpPage" class="pageBtn font-w pagePointer mgn-5">跳转</span>'+
                      '</div>';



    var cPage = document.getElementById('currentPage');
    var firstPage = document.getElementById('firstPage');
    var prePage = document.getElementById('prePage');
    var nextPage = document.getElementById('nextPage');
    var lastPage = document.getElementById('lastPage');
    var numPage = document.getElementById('numPage');
    var jumpPage = document.getElementById('jumpPage');
    var totalPage = document.getElementById('totalPage');

    totalPage.textContent = total;

    isFirstPage();
    isLastPage();

    // 首页
    firstPage.onclick = function () {
        lastPage.style.display = 'inline';
        nextPage.style.display = 'inline';
        cPage.textContent = 1;
        isFirstPage();
        // 回调方法
        backFn(cPage.textContent)
    };

    // 尾页
    lastPage.onclick = function () {
        cPage.textContent = totalPage.textContent;
        firstPage.style.display = 'inline';
        prePage.style.display = 'inline';
        isLastPage();
        // 回调方法
        backFn(cPage.textContent)
    };


    // 下一页
    nextPage.onclick = function () {
        firstPage.style.display = 'inline';
        prePage.style.display = 'inline';
        cPage.textContent = +cPage.textContent +1;
        isLastPage();

        // 回调方法
        backFn(cPage.textContent)
    };

    // 上一页
    prePage.onclick = function () {
        lastPage.style.display = 'inline';
        nextPage.style.display = 'inline';
        cPage.textContent = +cPage.textContent -1;
        isFirstPage();

        // 回调方法
        backFn(cPage.textContent)
    };

    // 跳转到第几页
    jumpPage.onclick = function () {
        // console.log(numPage.value);
        var num = +numPage.value;
        if (num >= 1 && num <= +totalPage.textContent && parseInt(num)===num) {
            cPage.textContent = num;
            lastPage.style.display = 'inline';
            nextPage.style.display = 'inline';
            firstPage.style.display = 'inline';
            prePage.style.display = 'inline';
            isFirstPage();
            isLastPage();
            $("#numPage").val("");
            // 回调方法
            backFn(cPage.textContent);
            
        }
    };
    
    numPage.onkeydown=function(event){
    	var e = event || window.event || arguments.callee.caller.arguments[0];
          
    	if(e && e.keyCode==13){ // enter 键
    		var num = +numPage.value;
            if (num >= 1 && num <= +totalPage.textContent && parseInt(num)===num) {
                cPage.textContent = num;
                lastPage.style.display = 'inline';
                nextPage.style.display = 'inline';
                firstPage.style.display = 'inline';
                prePage.style.display = 'inline';
                isFirstPage();
                isLastPage();
                $("#numPage").val("");
                // 回调方法
                backFn(cPage.textContent);
                
            }
    	}
    }; 


    // 判断是否是第一页
    function isFirstPage() {
        if (cPage.textContent === '1' ) {
            firstPage.style.display = 'none';
            prePage.style.display = 'none';
        }
    }

    // 判断是否是最后一页
    function isLastPage() {
        if (cPage.textContent === totalPage.textContent) {
            lastPage.style.display = 'none';
            nextPage.style.display = 'none';
        }

    }
}