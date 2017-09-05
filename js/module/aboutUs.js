//  关于我们

//传送数据
/*(function($){
    $.ajaxSetup({
        error:function(){
            alert('调用接口失败');
            return false;
        }
    });

    var GETCLASSES = "http://www.easy-mock.com/mock/5984035aa1d30433d8531301/aboutUs/list/aboutUs/list";
    $.getJSON(GETCLASSES,function (data) {
        console.log(data.data);
        var t=$("#card-template").html();
        var f=Handlebars.compile(t);
        var h=f(data);
        $("#sel-list").html(h);
    });
})(jQuery);*/

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

//展开合起效果
$(".list").attr("bOn","true");
//console.log($(".list").length);
for(var i=0;i<$(".list").length;i++){
    ;(function (i){
        touchFunc($(".list").eq(i)[0],"click",function () {
            $(".spread").css("display","none");
            $(".shrink").css("display","block");
            //布尔值开关
            if( $(".list").eq(i).attr("bOn")==="true" ){
                //展开
                $(".list").eq(i).attr("bOn","false");
                //展开的右三角
                $(".spread").eq(i).css("display","block");
                $(".shrink").eq(i).css("display","none");
            }else{
                //收起
                $(".list").eq(i).attr("bOn","true");
                //收起的下三角
                $(".spread").eq(i).css("display","none");
                $(".shrink").eq(i).css("display","block");
            }
            //文字区展合效果
            $(".text").eq(i).slideToggle(600);
            $(".list").eq(i).next().css("display","block").parents("li").siblings().find(".text").css("display","none");
            //让未选中的$(".list").bOn变为true
            $(".list").eq(i).next().css("display","block").parents("li").siblings().find(".list").attr("bOn","true");
        });
    })(i)
}