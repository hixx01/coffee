//数据格式
//  我的
// var data = [{
//    headUrl: "img/perCenter/headImage.jpg",
//    name:'淡定的灰机',
//    score:666,
//    discount	:8,
//    levelUrl:"img/perCenter/Lv4.png"
//    isNotice:1,
// }];

(function($){
    /*$.ajaxSetup({
        error:function(){
            alert('调用接口失败');
            return false;
        }
    });
    //emock生成的数据url
    //404解决:先在easymock和hanbars联网跑通服务器,先用网上图片（因为服务器还没有主机图片，但是可以获取联网图片）；等跑通后，在数据的url写本机图片
    var GETCLASSES = "http://www.easy-mock.com/mock/598300c6a1d30433d8527433/perCenter/perCenter/list";
    $.getJSON(GETCLASSES,function (data) {
        console.log(data)
        var t=$("#card-template").html();
        var f=Handlebars.compile(t);
        var h=f(data);
        $("#wrapInner").html(h);
    });*/

    function renderTemplate(templateSelector,data,htmlSelector){
        var t=$(templateSelector).html();
        var f=Handlebars.compile(t);
        var h=f(data);
        $(htmlSelector).html(h);
    }

    var url="http://sandias.xin:8989/homePage/showHomepage";

    $.ajax({
        type: "get",
        url: url+"?id=1",
        dataType: "json",
        success: function (data) {
            console.log(data.noticeHerfUrl);
            renderTemplate($("#card-template"),data,$("#wrapInner"));
        },
        error: function () {
            console.log('调用借口失败!');
        }
    });

    Handlebars.registerHelper("linkUrl", function(v1,v2){
        return v1+"?id="+v2;
    });

    //touch
    function touchFunc(obj,type,func) {
        var init = {x:5,y:5,sx:0,sy:0,ex:0,ey:0};
        var sTime = 0, eTime = 0;
        type = type.toLowerCase();

        //1.添加手指落下事件
        obj.addEventListener("touchstart",function(){
            sTime = new Date().getTime();
            //获取并记录：起始手指位置
            init.sx = event.targetTouches[0].pageX;
            init.sy = event.targetTouches[0].pageY;
            init.ex = init.sx;
            init.ey = init.sy;
            if(type.indexOf("start") != -1) func();
        }, false);

        //2.添加手指滑动事件
        obj.addEventListener("touchmove",function() {
            event.preventDefault();
            //获取并记录：手指抬起位置
            init.ex = event.targetTouches[0].pageX;
            init.ey = event.targetTouches[0].pageY;
            if(type.indexOf("move")!=-1) func();
        }, false);

        //3.触摸结束，根据时间、方向，判断执行事件的类型
        obj.addEventListener("touchend",function() {
            var changeX = init.sx - init.ex;//起始-结束
            var changeY = init.sy - init.ey;
            if(Math.abs(changeX)>Math.abs(changeY)&&(changeY)>init.y) {//滑动范围大于5  且偏于水平滑动 Math.abs：绝对值
                if(changeX > 0) {
                    if(type.indexOf("left")!=-1) func();//此代码中没有写鼠标上下滑事件，可根据左右滑动类推
                }else{
                    if(type.indexOf("right")!=-1) func();
                }
            }
            else if(Math.abs(changeY)>Math.abs(changeX)&&Math.abs(changeX)>init.x){//同上  判断垂直
                if(changeY > 0) {
                    if(type.indexOf("top")!=-1) func();
                }else{
                    if(type.indexOf("down")!=-1) func();
                }
            }
            else if(Math.abs(changeX)<init.x && Math.abs(changeY)<init.y){//若改变范围<5,则默认为点击事件
                eTime = new Date().getTime();
                if((eTime - sTime) > 300) {//长按事件
                    if(type.indexOf("long")!=-1) func();
                }
                else {//点击事件
                    if(type.indexOf("click")!=-1) func();
                }
            }
            if(type.indexOf("end")!=-1) func();
        }, false);
    };

    //尾部nav
    /*var b = document.querySelectorAll(".nav a");
    for (var i = 0; i < b.length; i++) {
        (function (i) {
            touchFunc(b[i],"click",function () {
                $(b[i]).css("color","#d91c06");
                $(b).not(b[i]).css("color","#2c2c2c");
            });
        })(i)
    }*/
})(jQuery);

