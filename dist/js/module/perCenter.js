!function(e){function t(e,t,n){var a={x:5,y:5,sx:0,sy:0,ex:0,ey:0},o=0,c=0;t=t.toLowerCase(),e.addEventListener("touchstart",function(){o=(new Date).getTime(),a.sx=event.targetTouches[0].pageX,a.sy=event.targetTouches[0].pageY,a.ex=a.sx,a.ey=a.sy,-1!=t.indexOf("start")&&n()},!1),e.addEventListener("touchmove",function(){event.preventDefault(),a.ex=event.targetTouches[0].pageX,a.ey=event.targetTouches[0].pageY,-1!=t.indexOf("move")&&n()},!1),e.addEventListener("touchend",function(){var e=a.sx-a.ex,r=a.sy-a.ey;Math.abs(e)>Math.abs(r)&&r>a.y?e>0?-1!=t.indexOf("left")&&n():-1!=t.indexOf("right")&&n():Math.abs(r)>Math.abs(e)&&Math.abs(e)>a.x?r>0?-1!=t.indexOf("top")&&n():-1!=t.indexOf("down")&&n():Math.abs(e)<a.x&&Math.abs(r)<a.y&&((c=(new Date).getTime())-o>300?-1!=t.indexOf("long")&&n():-1!=t.indexOf("click")&&n()),-1!=t.indexOf("end")&&n()},!1)}e.ajaxSetup({error:function(){return alert("调用接口失败"),!1}});e.getJSON("http://www.easy-mock.com/mock/598300c6a1d30433d8527433/perCenter/perCenter/list",function(t){console.log(t);var n=e("#card-template").html(),a=Handlebars.compile(n)(t);e("#wrapInner").html(a)});for(var n=document.querySelectorAll(".nav a"),a=0;a<n.length;a++)!function(a){t(n[a],"click",function(){e(n[a]).css("color","#d91c06"),e(n).not(n[a]).css("color","#2c2c2c")})}(a)}(jQuery);