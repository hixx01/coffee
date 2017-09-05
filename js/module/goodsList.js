//  商品列表
(function ($) {

    // var GETLISTS = "http://www.easy-mock.com/mock/59814286a1d30433d8505f84/coffeeDemo/list/coffee/goodsList";
    //
    // $.ajaxSetup({
    //     error:function () {
    //         alert("调用接口失败");
    //         return false;
    //     }
    // });

    function renderTemplate(templateSelector,data,htmlSelector) {
        var t = $(templateSelector).html();
        var f = Handlebars.compile(t);
        var h = f(data);
        $(htmlSelector).html(h);
    }

    // $.getJSON(GETLISTS,function (data) {
    //     //console.log(data);
    //     renderTemplate ( $("#lists-template") , data , $("#lists") );
    //     var arr=data.list;
    //     console.log(arr);
    //     for(var i=0 ; i<$("li").length ; i++) {
    //         var oBtn=true;
    //
    //         (function (i) {
    //             if(oBtn){
    //                 $("a").eq(i).click(function () {
    //                     return true;
    //                 })
    //             }
    //             touchFunc($("li")[i],"left",function () {
    //                 console.log(i);
    //                  $(".liWrap").eq(i).animate({width:"7.15rem"},200);
    //                  $(".delBtn").eq(i).animate({width:"1.5rem"},200);
    //                  $(".cancelBtn").eq(i).animate({width:"1.5rem"},200);
    //             });
    //             touchFunc($(".cancelBtn")[i],"click",function () {
    //                 $(".liWrap").eq(i).animate({width:"0"},300);
    //                 $(".delBtn").eq(i).animate({width:"0"},300);
    //                 $(".cancelBtn").eq(i).animate({width:"0"},300);
    //             })
    //             touchFunc($(".delBtn")[i],"click",function () {
    //                 console.log(arr[i].name);
    //                 $(".delBtn").eq(i).velocity({width:0},{duration:300,delay:100});
    //                 $(".cancelBtn").eq(i).velocity({width:0},{duration:300,delay:100});
    //                 $(".liWrap").eq(i).velocity({width:0},{duration:300,delay:200,complete:function () {
    //                     $("li").eq(i).css("display","none");
    //                 }});
    //
    //                 $.ajax({
    //                     type:"POST",
    //                     url:"http://sandias.xin:8989/goods/findGoodsByCreateTime",
    //                     data:"id="+arr[i].id,
    //                     success:function () {
    //                         alert("发送数据成功");
    //                     },
    //                     error:function () {
    //                         alert("发送数据失败");
    //                     }
    //                 });
    //             })
    //
    //         }(i)
    //         );
    //     }
    //
    //
    // })

    $.ajax({
        type:"GET",
        url:"http://sandias.xin:8989/goods/findGoodsByCreateTime",
        dataType:"json",
        success:function (data) {
            console.log(data);
            renderTemplate ( $("#lists-template") , data , $("#lists") );
            var arr=data.list;
            console.log(arr);
            for(var i=0 ; i<$("li").length ; i++) {
                var oBtn=true;

                (function (i) {
                        if(oBtn){
                            $("a").eq(i).click(function () {
                                return true;
                            })
                        }
                        touchFunc($("li")[i],"left",function () {
                            console.log(i);
                            $(".liWrap").eq(i).animate({width:"7.15rem"},200);
                            $(".delBtn").eq(i).animate({width:"1.5rem"},200);
                            $(".cancelBtn").eq(i).animate({width:"1.5rem"},200);
                            console.log(arr[i].goodsHerfUrl);
                        });
                        touchFunc($(".cancelBtn")[i],"click",function () {
                            $(".liWrap").eq(i).animate({width:"0"},300);
                            $(".delBtn").eq(i).animate({width:"0"},300);
                            $(".cancelBtn").eq(i).animate({width:"0"},300);
                        })
                        touchFunc($(".delBtn")[i],"click",function () {
                            console.log(arr[i].name);
                            $(".delBtn").eq(i).velocity({width:0},{duration:300,delay:100});
                            $(".cancelBtn").eq(i).velocity({width:0},{duration:300,delay:100});
                            $(".liWrap").eq(i).velocity({width:0},{duration:300,delay:200,complete:function () {
                                $("li").eq(i).css("display","none");
                            }});

                            $.ajax({
                                type:"POST",
                                url:"http://sandias.xin:8989/goods/findGoodsByCreateTime",
                                data:"id="+arr[i].id,
                                success:function () {
                                    alert("发送数据成功");
                                },
                                error:function () {
                                    alert("发送数据失败");
                                }
                            });
                        })

                    }(i)
                );
            }
        },
        error:function () {
            alert("调用接口失败");
        }
    })


    function touchFunc(obj,type,func){
        var init={x:5,y:5,sx:0,sy:0,ex:0,ey:0};
        var sTime=0;
        var eTime=0;
        type=type.toLowerCase();
        obj.addEventListener("touchstart",function(ev){
            var ev=ev||event;
            sTime=new Date().getTime();
            init.sx=ev.targetTouches[0].pageX;
            init.sy=ev.targetTouches[0].pageY;
            init.ex=init.sx;
            init.ey=init.sy;
            if(type.indexOf("start")!=-1){
                func();
            }
        },true);

        obj.addEventListener("touchmove",function(ev){
            init.ex=ev.targetTouches[0].pageX;
            init.ey=ev.targetTouches[0].pageY;
            if(type.indexOf("move")!=-1){
                func();
            }
        },true);

        obj.addEventListener("touchend",function(){
            var changeX=init.ex-init.sx;
            var changeY=init.ey-init.sy;
            if(Math.abs(changeX)>Math.abs(changeY)&&Math.abs(changeY)>init.y){
                if(changeX>0){
                    if(type.indexOf("right")!=-1){
                        func();
                    }
                }else{
                    if(type.indexOf("left")!=-1){
                        func();
                    }
                }
            }else if(Math.abs(changeY)>Math.abs(changeX)&&Math.abs(changeX)>init.x){
                if(changeY>0){
                    if(type.indexOf("bottom")!=-1){
                        func();
                    }
                }else{
                    if(type.indexOf("top")!=-1){
                        func();
                    }
                }
            }else if(Math.abs(changeX)<init.x&&Math.abs(changeY)<init.y){
                eTime=new Date().getTime();
                if(eTime-sTime>300){
                    if(type.indexOf("long")!=-1){
                        func();
                    }
                }else{
                    if(type.indexOf("click")!=-1){
                        func();
                    }
                }
            }
        },true);
    }

    touchFunc(document.body,"touchmove",function () {
        var scrollTop=document.body.scrollTop;
        if(scrollTop>50){
            $("#return").css({"background-color":"grey","opacity":"0.5"});
            if(scrollTop>700){
                $("#rollBack").css("display","block");
            }
        }
        else {
            $("#return").css({"background-color":"transparent","opacity":"1"});
            $("#rollBack").css("display","none");
        }
    });

    var rollTimer=0;
    touchFunc($("#rollBack")[0],"click",function () {
        // document.body.scrollTop = document.documentElement.scrollTop = 0;
        // $("#return").css({"background-color":"transparent","opacity":"1"});
        // setTimeout(function () {
        //     $("#rollBack").css("display","none");
        // },10);
        cancelAnimationFrame(rollTimer);
        rollTimer = requestAnimationFrame(function fn(){
            var oTop = document.body.scrollTop || document.documentElement.scrollTop;
            if(oTop > 0){
                scrollTo(0,oTop-300);
                rollTimer = requestAnimationFrame(fn);
            }else{
                cancelAnimationFrame(rollTimer);
            }
        });
    })

})(jQuery);