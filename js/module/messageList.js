//  留言列表

(function ($) {
    var GETCOMMENT = "http://sandias.xin:8989/Comment/showAllComment";
    var GETLIKE = "http://sandias.xin:8989/Comment/updatelike";
    var GETGOODSDETAIL = "http://sandias.xin:8989/goodsDetail/findGoodsInform";

    $.ajaxSetup({
        error: function () {
            alert("调用接口失败");
            return false;
        }
    });

    var str = location.search;

    function renderTemplate(templateSelector, data, htmlSelector) {
        var t = $(templateSelector).html();
        var f = Handlebars.compile(t);
        var h = f(data);
        $(htmlSelector).html(h);
    }

    $.getJSON(GETCOMMENT+str, function (data) {
        renderTemplate("#return-template", data.goods, "#return");
        renderTemplate("#goods-template", data.goods, "#comment-goods");
        renderTemplate("#infor-template", data.comment, "#comment-infor");
        for (var i = 0; i < $("#comment-infor li i").length; i++) {
            $("#comment-infor li i")[i].bOn = true;
            $("#comment-infor li i")[i].index = i;
            $("#comment-infor li i")[i].onclick = function () {
                var changeThis = this;
                var index = this.index;
                if (this.bOn) {
                    $.get(GETLIKE, {
                        isLike: 1,
                        commentId: data.comment[index].commentId
                    }, function (data) {
                        if(data.status) {
                            changeThis.style.color = "#d81e06";
                            $(changeThis).siblings("span")[0].style.color = "#d81e06";
                            var num = $(changeThis).siblings("span").html();
                            num++;
                            $(changeThis).siblings("span").html(num);
                        }
                    });
                } else {
                    $.get(GETLIKE, {
                        isLike: -1,
                        commentId: data.comment[index].commentId
                    }, function (data) {
                        if (data.status) {
                            changeThis.style.color = "#cccccc";
                            $(changeThis).siblings("span")[0].style.color = "#000000";
                            var num = $(changeThis).siblings("span").html();
                            num--;
                            $(changeThis).siblings("span").html(num);
                        }
                    });
                }
                this.bOn = !this.bOn;
            }
        }
    });

    Handlebars.registerHelper("formatDate", function (value) {
        if(!value) {
            return "";
        }
        var d = new Date(value);
        var year = d.getFullYear();
        var month = d.getMonth() +1;
        var date = d.getDate();
        var hours = d.getHours();
        var minute = d.getMinutes();
        var second = d.getSeconds();
        var str = year + "-" + month + "-" + date + "&nbsp;&nbsp;&nbsp;" + hours + ":" + minute + ":" + second;
        return str;
    });

})(jQuery);