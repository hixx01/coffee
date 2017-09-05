// 餐桌

(function ($) {
    // var GETCART = "http://sandias.xin:8989/ShopCar/selectAllShopCarGoods";
    // var GETUPDATE = "http://sandias.xin:8989/ShopCar/updateGoodsNum";
    // var GETACCOUNT = "http://sandias.xin:8989/ShopCar/updateShopCarTotal";
    // var GETDELETE = "http://sandias.xin:8989/ShopCar/deleteGoods";
    // var GETGOODSDETAIL = "http://sandias.xin:8989/goodsDetail/findGoodsInform";


    var GETCART = "http://www.easy-mock.com/mock/598700b1a1d30433d856c3e5/cafe/dinTable/cart";
    var GETUPDATE = "http://www.easy-mock.com/mock/598700b1a1d30433d856c3e5/cafe/dinTable/update";
    var GETACCOUNT = "http://www.easy-mock.com/mock/598700b1a1d30433d856c3e5/cafe/dinTable/account";
    var GETDELETE = "http://www.easy-mock.com/mock/598700b1a1d30433d856c3e5/cafe/dinTable/delete";
    var GETGOODSDETAIL = "http://www.easy-mock.com/mock/598700b1a1d30433d856c3e5/cafe/dinTable/goodsDetail";

    $.ajaxSetup({
        error: function () {
            alert("调用接口失败");
            return false;
        }
    });

    function renderTemplate(templateSelector, data, htmlSelector) {
        var t = $(templateSelector).html();
        var f = Handlebars.compile(t);
        var h = f(data);
        $(htmlSelector).html(h);
    }

    var arrCart = [];

    var arrGoods = [];

    $.ajax({
        "url": GETCART,
        "dataType": "json",
        "success": function (data) {
            arrCart = [];
            for (var i = 0; i < data.cart.length; i++) {
                arrCart.push(data.cart[i]);
            }
            if (arrCart.length == 0) {
                $(".empty").css({"display":"block"});
                return false;
            }
            function refreshCart(num) {
                renderTemplate("#sequence-template", arrCart[num], "#img-sequence");
                $(".img-count").html(arrCart.length);
                renderTemplate("#image-template", arrCart, "#goodsImage-ul");
                $(".goodsImage-ul").css({"width": 2 * arrCart.length * $(".goodsImage-div")[0].offsetWidth});
                $(".goodsImage-ul").html($(".goodsImage-ul").html()+$(".goodsImage-ul").html());
                renderTemplate("#name-template", arrCart[num], "#goods-name");
                renderTemplate("#price-template", arrCart[num], "#goods-price");
                renderTemplate("#count-template", arrCart[num], "#goods-count");
            }
            refreshCart(0);

            // img carousel call start
            touchFunc($(".goodsImage-div")[0], "left", function () {
                toLeft();
                refreshCart(num);
            });
            touchFunc($(".left")[0], "click", function () {
                toRight();
                refreshCart(num);
            });
            touchFunc($(".goodsImage-div")[0], "right", function () {
                toRight();
                refreshCart(num);
            });
            touchFunc($(".right")[0], "click", function () {
                toLeft();
                refreshCart(num);
            });
            // img carousel call end


            // add start
            function add () {
                $.get(GETUPDATE, {
                    goodsDetailId : arrCart[num].id,
                    count : arrCart[num].count+1
                }, function (data) {
                    if(data.status) {
                        var igoodsCountValue = $(".goodsCount-value").html();
                        igoodsCountValue++;
                        $(".goodsCount-value").html(igoodsCountValue);
                        arrCart[num].count = igoodsCountValue;
                    }
                });
            }
            // add end

            // minus start
            function minus () {
                var igoodsCountValue = $(".goodsCount-value").html();
                if(igoodsCountValue > 0) {
                    igoodsCountValue--;
                }
                if (igoodsCountValue == 0) {
                    $.get(GETDELETE, {
                        goodsDetailId : arrCart[num].id,
                        visi : 1
                    }, function (data) {
                        if (data.status) {
                            var iMinus = arrCart[num].number;
                            arrCart.splice(iMinus,1);
                            if (arrCart.length == 0) {
                                $(".empty").css({"display":"block"});
                                return false;
                            }
                            if (iMinus == arrCart.length) {
                                num-=1;
                                toRight();
                                refreshCart(num);
                            } else {
                                for (var i = iMinus; i < arrCart.length; i++) {
                                    arrCart[i].number = arrCart[i].number-1;
                                }
                                refreshCart(num);
                            }
                            return false;
                        }
                    });
                } else {
                    $.get(GETUPDATE, {
                        goodsDetailId : arrCart[num].id,
                        count : igoodsCountValue
                    }, function (data) {
                        if (data.status) {
                            $(".goodsCount-value").html(igoodsCountValue);
                            arrCart[num].count = igoodsCountValue;
                        }
                    });
                }
            }
            // minus end

            // minus call start
            touchFunc($(".goods-count .iconfont:eq(0)")[0], "click", function () {
                minus();
            });
            // minus call end

            // add call start
            touchFunc($(".goods-count .iconfont:eq(1)")[0], "click", function () {
                add();
            });
            // add call end
        },
        "error": function () {
            alert("error!");
        }
    });

    Handlebars.registerHelper("addOne", function (v) {
        return v+1;
    });


    // touchFunc start
    function touchFunc(obj,type,func) {
        var init = {x:5, y:5, sx:0, sy:0, ex:0, ey:0};
        var sTime = 0;
        var eTime = 0;
        type = type.toLowerCase();
        obj.addEventListener("touchstart", function(ev) {
            var ev = ev || event;
            sTime = new Date().getTime();
            init.sx = ev.targetTouches[0].pageX;
            init.sy = ev.targetTouches[0].pageY;
            init.ex = init.sx;
            init.ey = init.sy;
            if(type.indexOf("start") != -1){
                func();
            }
        }, "false");
        obj.addEventListener("touchmove", function(ev) {
            init.ex = ev.targetTouches[0].pageX;
            init.ey = ev.targetTouches[0].pageY;
            if(type.indexOf("move") != -1){
                func();
            }
        }, false);
        obj.addEventListener("touchend", function() {
            var changeX = init.ex - init.sx;
            var changeY = init.ey - init.sy;
            if(Math.abs(changeX) > Math.abs(changeY) && Math.abs(changeY) > init.y){
                if(changeX > 0){
                    if(type.indexOf("right") != -1){
                        func();
                    }
                } else{
                    if(type.indexOf("left") != -1){
                        func();
                    }
                }
            }else if(Math.abs(changeY) > Math.abs(changeX) && Math.abs(changeX) > init.x) {
                if(changeY > 0){
                    if(type.indexOf("bottom") != -1){
                        func();
                    }
                }else{
                    if(type.indexOf("top") != -1){
                        func();
                    }
                }
            }else if(Math.abs(changeX) < init.x && Math.abs(changeY) < init.y){
                eTime = new Date().getTime();
                if(eTime - sTime > 300){
                    if(type.indexOf("long") != -1){
                        func();
                    }
                }else{
                    if(type.indexOf("click") != -1){
                        func();
                    }
                }
            }
        },false);
    }
    // touchFunc end


    // img carousel start
    var iImgNum = 0;
    var num = iImgNum;
    var isOn = true;
    function toLeft() {
        if(isOn){
            isOn = false;
            iImgNum++;
            num = iImgNum;
            $(".goodsImage-ul").velocity({left: - iImgNum * $(".goodsImage-div")[0].offsetWidth},
                {
                    duration: 400,
                    complete: function () {
                        if(iImgNum == $(".goodsImage-ul li").length/2) {
                            iImgNum = 0;
                            num = iImgNum;
                            $(".goodsImage-ul").css({"left":0});
                        }
                        $(".now-sequence").html((iImgNum+1) + "/");
                        isOn = true;
                    }
                });
            if (num == $(".goodsImage-ul li").length / 2) {
                num = 0;
            }
        }
    }
    function toRight() {
        if(isOn) {
            isOn = false;
            if(iImgNum == 0) {
                iImgNum = $(".goodsImage-ul li").length / 2;
                num = iImgNum;
                $(".goodsImage-ul").css({"left": - iImgNum * $(".goodsImage-ul li")[0].offsetWidth});
            }
            iImgNum--;
            num = iImgNum;
            $(".goodsImage-ul").velocity({"left": - iImgNum * $(".goodsImage-ul li")[0].offsetWidth},
                {
                    duration: 400,
                    complete: function () {
                        $(".now-sequence").html((iImgNum+1) + "/");
                        isOn = true;
                    }
                });
        }
    }
    // img carousel end

    // showall start
    var allshow = true;
    function showall () {
        if (allshow) {
            $(".overlap").css({"display" : "block"});
            $(".paydetail").velocity({"bottom" : 0},{
                "duration" : 200
            });
        } else {
            $(".overlap").css({"display" : "none"});
            $(".paydetail").velocity({"bottom" : "-4rem" },{
                "duration" : 200
            });
        }
        allshow = !allshow;
    }
    // showall end

    // showaccount start
    var accountshow = true;
    function showaccount () {
        if (accountshow) {
            $(".account").velocity({"bottom" : 0},{"duration" : 200});
        } else {
            $(".account").velocity({"bottom" : "-4rem"},{
                "duration" : 200
            });
        }
        accountshow = !accountshow;
    }
    // showaccount end

    // showsuccess start
    var successshow = true;
    function showsuccess () {
        if (successshow) {
            $(".success").velocity({"bottom" : 0},{"duration" : 200});
        } else {
            $(".success").velocity({"bottom" : "-4rem"},{
                "duration" : 200
            });
        }
        successshow = !successshow;
    }
    // showsuccess end

    var allCount = 0;
    var allPrice = 0;

    // pay start
    touchFunc($(".settlement")[0], "click", function () {
        $.get(GETCART, function (data) {
            arrGoods = [];
            allCount = 0;
            allPrice = 0;
            for (var i = 0; i < data.cart.length; i++) {
                arrGoods.push(data.cart[i]);
            }
            for (var i = 0; i < arrGoods.length; i++) {
                allCount += arrGoods[i].count;
                allPrice += arrGoods[i].count * arrGoods[i].price;
            }
            // refreshGoods start
            function refreshGoods () {
                renderTemplate("#all-template", arrGoods, "#all");
                $(".all-price").html("总计:"+allPrice+"元");
                $(".all-count").html("数量:"+allCount);
                renderTemplate("#detail-template", arrGoods, "#goodsdetail");
            }
            // refreshGoods end

            refreshGoods();

            for (var i = 0; i < $("#goodsdetail li").length; i++) {
                $("#goodsdetail li")[i].bOn = true;
                $("#goodsdetail li")[i].index = i;
                $("#goodsdetail li")[i].onclick = function () {
                    var changeThis = this;
                    if (this.bOn) {
                        $.get(GETDELETE, {
                            goodsDetailId : arrCart[num].id,
                            visi : 1
                        }, function (data) {
                            if (data.status) {
                                $(changeThis).css({"background-color":"#fffff5"});
                                $(changeThis).find("i").css({"color":"#cccccc"});
                                allCount -= arrGoods[changeThis.index].count;
                                allPrice -= arrGoods[changeThis.index].count * arrGoods[changeThis.index].price;
                                $(".all-price").html("总计:"+allPrice+"元");
                                $(".all-count").html("数量:"+allCount);
                            }
                        });
                    }else {
                        $.get(GETDELETE, {
                            goodsDetailId : arrCart[num].goodsDetailId,
                            visi : 0
                        }, function () {
                            $(changeThis).css({"background-color":"#fbebf0"});
                            $(changeThis).find("i").css({"color":"#a8c001"});
                            allCount += arrGoods[changeThis.index].count;
                            allPrice += arrGoods[changeThis.index].count * arrGoods[changeThis.index].price;
                            $(".all-price").html("总计:"+allPrice+"元");
                            $(".all-count").html("数量:"+allCount);
                        });
                    }
                    changeThis.bOn = !changeThis.bOn;
                }
            }
            showall();
        });
    });
    // pay end

    // paybtn click start
    touchFunc($(".paybtn")[0], "click", function () {
        $.get(GETACCOUNT, function (data) {
            renderTemplate("#needpay-template", data, "#needpay");
            $(".needpay-span").html("需支付："+allPrice+"元");
            showaccount();
        });
    });
    // paybtn click end

    // sure click start
    touchFunc($(".surebtn")[0], "click", function () {
        showsuccess();
    });
    // sure click end

    // overlap click start
    touchFunc($(".overlap")[0], "click", function () {
        allshow = false;
        accountshow = false;
        successshow = false;
        $(".overlap").velocity({"opacity":0.5},{
            "duration": 100,
            "complete": function () {
                showall();
                showaccount();
                showsuccess();
            }
        });
    });
    // overlap click end
})(jQuery);
