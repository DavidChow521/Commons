/**
 * Created by user on 2018-01-04.
 * The naming specification follows the small hump nomenclature:the first single word begins with a lowercase letter.
 * [Modified Log]
 * yyyy-MM-dd HH:mm         user            line[number]             description
 *
 * [Sample Code]
 *  例1：$.helloWorld()
 *  例2：$(".class").helloWorld();
 */

!(function (global, $, undefined) {

    //例1：jQuery本身的扩展方法（全局扩展）
    $.extend({
        helloWorld: function () {
            alert("世界你好！");
        }
    })

    //例2： jQuery 所选对象扩展方法（当前扩展）jQuery.fn==jQuery.prototype
    $.fn.extend({
        helloWorld: function (parameters) {
            $(this).text("世界你好！");
        }
    });
    $.fn.helloWorld = function (parameters) {
        $(this).text("世界你好！");
    }

})(this, jQuery)