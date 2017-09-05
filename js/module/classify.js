(function ($) {
    function renderTemplate(templateSelector, data, htmlSelector) {
        var t = $(templateSelector).html();
        var f = Handlebars.compile(t);
        var h = f(data);
        $(htmlSelector).html(h);
    }

    $.ajax({
        type: "GET",
        url: "http://www.easy-mock.com/mock/59857638a1d30433d854d1c2/classify/list/classify/message",
        dataType: "json",
        success: function (data) {//data:responseText
            renderTemplate($("#ul1-template"), data.guessLike, $("#ul"));
            renderTemplate($("#newest-template"), data.newGoods[0], $("#coffee"));
            renderTemplate($("#newest1-template"), data.newGoods[1], $("#coffee2"));
            renderTemplate($("#right-template"), data, $("#more"));
            renderTemplate($("#name-template"), data.newGoods[0], $("#coffee-shop"));
            renderTemplate($("#name1-template"), data.newGoods[1], $("#coffee-shop1"));
            renderTemplate($("#hotPic-template"),data.hotGoods,$("#hotPic1"));
            Handlebars.registerHelper("add",function (v1,v2) {
                console.log(v1 + "?id=" + v2);
                return v1 + "?id=" + v2;

            });
            renderTemplate($("#hot-template"), data, $("#right"));
            $("#ul").html($("#ul").html() + $("#ul").html());
            $("#ul").css("height",$("#ul li")[0].offsetHeight * 4);

            touchFunc($(".all")[0], "click", function () {
                if (isOn) {
                    isOn = false;
                    nowImg++;
                    $(".banner_01").velocity({"top": (-$("#ul li")[0].offsetHeight * nowImg - 20)}, {
                            duration: 500,
                            complete: function () {
                                if (nowImg === 2) {
                                    nowImg = 0;
                                    $("#ul").css("top", 0);
                                }
                                isOn = true;
                            }
                        }
                    );
                }
            });
        },
        error: function (jqXHR) {
            alert("发生错误：" + jqXHR.status);
        }
    });
//换一换
    var nowImg = 0;
    var isOn = true;
    touchFunc($(".all")[0], "click", function () {
        $(".all .iconfont").css({"animation": "rond 0.5s "});
    });

    function touchFunc(obj, type, func) {
        var init = {x: 5, y: 5, sx: 0, sy: 0, ex: 0, ey: 0};
        var sTime = 0;
        var eTime = 0;
        type = type.toLowerCase();
        obj.addEventListener("touchstart", function (ev) {
            var ev = ev || event;
            sTime = new Date().getTime();
            init.sx = ev.targetTouches[0].pageX;
            init.sy = ev.targetTouches[0].pageY;
            init.ex = init.sx;
            init.ey = init.sy;
            if (type.indexOf("start") != -1) {
                func();
            }
        }, "false");
        obj.addEventListener("touchmove", function (ev) {
            init.ex = ev.targetTouches[0].pageX;
            init.ey = ev.targetTouches[0].pageY;
            if (type.indexOf("move") != -1) {
                func();
            }
        }, false);
        obj.addEventListener("touchend", function () {
            var changeX = init.ex - init.sx;
            var changeY = init.ey - init.sy;
            if (Math.abs(changeX) > Math.abs(changeY) && Math.abs(changeY) > init.y) {
                if (changeX > 0) {
                    if (type.indexOf("right") != -1) {
                        func();
                    }
                } else {
                    if (type.indexOf("left") != -1) {
                        func();
                    }
                }
            } else if (Math.abs(changeY) > Math.abs(changeX) && Math.abs(changeX) > init.x) {
                if (changeY > 0) {
                    if (type.indexOf("bottom") != -1) {
                        func();
                    }
                } else {
                    if (type.indexOf("top") != -1) {
                        func();
                    }
                }
            } else if (Math.abs(changeX) < init.x && Math.abs(changeY) < init.y) {
                eTime = new Date().getTime();
                if (eTime - sTime > 300) {
                    if (type.indexOf("long") != -1) {
                        func();
                    }
                } else {
                    if (type.indexOf("click") != -1) {
                        func();
                    }
                }
            }
        }, false);
    };

})(jQuery);

