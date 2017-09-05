//  消息列表
(function ($) {
    var GETNOTICE = "http://www.easy-mock.com/mock/59841572a1d30433d8532e72/message/list/message/list";

    $.ajaxSetup({
        error:function () {
            alert('调用接口失败');
            return false;
        }
    });

    $.getJSON(GETNOTICE,function(data){
        var t = $("#notice-template").html();
        var f = Handlebars.compile(t);
        var h = f(data);
        $("#main").html(h);
    });

    // $("#main .section").on('click',function () {
    //
    // })
})(jQuery);