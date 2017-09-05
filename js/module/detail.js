//  详情

(function ($){
    function renderTemplate(templateSelector, data, htmlSelector) {
        var t = $(templateSelector).html();
        var f = Handlebars.compile(t);
        var h = f(data);
        $(htmlSelector).html(h);
    }
    var str = location.search;

    $.ajax({
        type: 'get',
        url:'http://sandias.xin:8989/goodsDetail/findGoodsInform' + str,
        dataType:'json',

        success: function (data) {
            renderTemplate($("#goods-template"),data,$("#sec-top"));
            //var detailImg = JSON.parse(data.detailImg);
            renderTemplate($("#three-template"),data.detailImg,$("#sec-bottom"));
           
//收藏变色
            var b = document.querySelector(".buyCollectIcon");
            var isOn = true;
            touchFunc(b,"click",function () {
                if (isOn) {
                    $(b).css("color","#d81e07");
                   $.get("http://sandias.xin:8989/goodsDetail/collect",{
                       id:str.replace(/[^0-9]+/g,'')
                   },function (){
                       var a = str.replace(/[^0-9]+/g,'');

                       $.ajax({
                           type : "GET",
                           url : "http://sandias.xin:8989/goodsDetail/collect?id=" + a,
                           dataType : "json",
                           success : function(data){
                               console.log(data.status);
                           }
                       })
                   })
                }else{
                    $(b).css("color","#71767f");
                    $.get("http://sandias.xin:8989/collectionfind/deleteCollection",{
                        id:str.replace(/[^0-9]+/g,'')
                    },function (){
                        var a = str.replace(/[^0-9]+/g,'');

                        $.ajax({
                            type : "GET",
                            url : "http://sandias.xin:8989/collectionfind/deleteCollection?id=" + a,
                            dataType : "json",
                            success : function(data){
                                console.log(data.status);
                            }
                        })
                    })
                }
                isOn = !isOn;
            });




            //touch封装
            function touchFunc(obj,type,func) {//对象  时间 执行的函数//滑动范围在5x5内则做点击处理，s是开始，e是结束
                var init = {x:5,y:5,sx:0,sy:0,ex:0,ey:0};//判断手指是点击还是拖拽（不超过5 点击） 落下时起始位置 落下的开始之间 抬起的的时间
                var sTime = 0, eTime = 0;
                type = type.toLowerCase();//字符串中大写转小写

                obj.addEventListener("touchstart",function(){
                    sTime = new Date().getTime();//起始时间
                    init.sx = event.targetTouches[0].pageX;//当前手指位置
                    init.sy = event.targetTouches[0].pageY;
                    init.ex = init.sx;//结束时=开始时
                    init.ey = init.sy;
                    if(type.indexOf("start") != -1) func();
                }, false);//点击开始

                obj.addEventListener("touchmove",function() {
                    event.preventDefault();//阻止触摸时浏览器的缩放、滚动条滚动
                    init.ex = event.targetTouches[0].pageX;//结束为止永远=当前位置
                    init.ey = event.targetTouches[0].pageY;
                    if(type.indexOf("move")!=-1) func();//move的时候干什么  写到这
                }, false);

                obj.addEventListener("touchend",function() {
                    var changeX = init.sx - init.ex;//手指起始位置-抬起时位置，用正负判断移动方向
                    var changeY = init.sy - init.ey;
                    if(Math.abs(changeX)>Math.abs(changeY)&&Math.abs(changeY)>init.y) {
                        //左右事件 （往哪个方向移动，）
                        if(changeX > 0) {//向左移动
                            if(type.indexOf("left")!=-1) func();
                        }else{//右
                            if(type.indexOf("right")!=-1) func();
                        }
                    }
                    else if(Math.abs(changeY)>Math.abs(changeX)&&Math.abs(changeX)>init.x){
                        //上下事件
                        if(changeY > 0) {
                            if(type.indexOf("top")!=-1) func();
                        }else{
                            if(type.indexOf("down")!=-1) func();
                        }
                    }
                    else if(Math.abs(changeX)<init.x && Math.abs(changeY)<init.y){//点击事件
                        eTime = new Date().getTime();
                        //点击事件，此处根据时间差细分下
                        if((eTime - sTime) > 300) {
                            if(type.indexOf("long")!=-1) func(); //长按
                        }
                        else {
                            if(type.indexOf("click")!=-1) func(); //当点击处理
                        }
                    }
                    if(type.indexOf("end")!=-1) func();//touch结束
                }, false);
            };

//立即购买

            touchFunc($(".addCar")[0],"click",function (){
                $(".goodsSize").velocity({"bottom":0+"rem"},{duration:200});
                $(".hide").css("display","block").velocity({"opacity":"0.7"},{duration:300})
                $("#ensure2").css("display","none");
                $("#ensure1").css("display","flex");
            });

            touchFunc($("#ensure1")[0],"click",function(){
              
                var sizeStr = encodeURI(encodeURI($(".size span.checked").html()));
                if(sizeStr == '%25E5%25A4%25A7'){
                    size = 'big';

                }else if(sizeStr == '%25E4%25B8%25AD'){
                    size = 'mid';
                }else{
                    size = 'small';
                }

                $(".hide").velocity({"opacity":"0"},{duration:200}).css("display","none");
                $(".goodsSize").velocity({"bottom":"-5rem"},{duration:300});
                $.get("http://sandias.xin:8989/goodsDetail/addGoods",{
                    id:str.replace(/[^0-9]+/g,''),
                    size:size,
                    count:$(".count").html()
                },function (data){
                   alert(data.status);
                })

            });

            touchFunc($("#ensure2")[0],"click",function(){
                var sizeStr = encodeURI(encodeURI($(".size span.checked").html()));
                if(sizeStr == '%25E5%25A4%25A7'){
                    size = 'big';
                }else if(sizeStr == '%25E4%25B8%25AD'){
                    size = 'mid';
                }else{
                    size = 'small';
                }
                $.get("http://sandias.xin:8989/goodsDetail/addGoods",{
                    id:str.replace(/[^0-9]+/g,''),
                    size:size,
                    count:$(".count").html()
                },function (){
                    var a = str.replace(/[^0-9]+/g,'');
                    var b = size;
                    var c = $(".count").html();
                    $.ajax({
                        type : "GET",
                        url : "http://sandias.xin:8989/goodsDetail/addGoods?id=" + a + "&size=" + b + "&count=" + c,
                        dataType : "json",
                        success : function(data){
                            alert(data.status);
                        }
                    })
                })
            });
            touchFunc($(".hide")[0],"click",function(){
                $(".hide").velocity({"opacity":"0"},{duration:200}).css("display","none");
                $(".goodsSize").velocity({"bottom":"-5rem"},{duration:300});

            });

            touchFunc($(".buyNow")[0],"click",function (){
                $(".goodsSize").velocity({"bottom":0+"rem"},{duration:200});
                $(".hide").css("display","block").velocity({"opacity":"0.7"},{duration:300})
                $("#ensure1").css("display","none");
                $("#ensure2").css("display","flex");
            });


            for (var i = 0; i < $(".size span").length; i++) {
                (function (i) {
                    touchFunc($(".size span")[i],"click",function () {
                        $($(".size span")[i]).addClass("checked");
                        $($(".size span")).not($(".size span")[i]).removeClass("checked");
                    })
                })(i)
            };


            touchFunc($(".minusIcon")[0],"click",function(){
                var a = $(".count")[0].innerHTML;
                if(a > 1){
                    a--;
                    $(".count").html(a);
                };
            });


            touchFunc($(".addIcon")[0],"click",function(){
                var a = $(".count")[0].innerHTML;
                a++;
                $(".count").html(a);
            });
        }
    });
//收藏变色






})(jQuery);