!function(e){e.ajaxSetup({error:function(){return alert("调用接口失败"),!1}}),e.getJSON("http://www.easy-mock.com/mock/59841572a1d30433d8532e72/message/list/message/list",function(t){var a=e("#notice-template").html(),m=Handlebars.compile(a)(t);e("#main").html(m)})}(jQuery);