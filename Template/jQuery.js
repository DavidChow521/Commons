/**
         * Created by user on yyyy-MM-dd.
         * [Modified Log]
         * yyyy-MM-dd HH:mm         user                      description
         *
         * [Sample Code]
         *  例1：$.helloWorld()
         *  例2：$(".class").helloWorld();
         */

        (function (global, factory, plug) {
            //call和apply的作用都是在特定的作用域中将函数绑定到另外一个对象上去运行，即可以用来重新定义函数的执行环境，两者仅在定义参数方式上有所区别
            // 接收参数方面不同：
            //                 call和apply的第一个参数都是需要调用的函数对象，在函数体内这个参数就是this的值，剩余的参数是需要传递给函数的值，
            //                 call与apply的不同就是call传的值可以是任意的，而apply传的剩余值必须为数组
            factory.call(global, global.jQuery, plug);
        })(window, function ($, plug) {
            //私有两划线
            var _DEFS_ = {
                _find_: "input,textarea",
                _filter_: "[type=submit],[type=reset],[type=button],[type=image]",
            }
            var _OPS_ = {
                //变量全小写
                name: "小民"
            }
            //常量全大写
            const WORD = "helloWorld"
            //闭包
            $.fn[plug] = function () {
                var $this = $(this);
                $.extend(_OPS_,option,_OPS_);
                $this.find(_DEFS_._find_).not(_DEFS_._filter_).text(_OPS_.name + WORD);
                $this.find(_DEFS_._find_).not(_DEFS_._filter_).val(_OPS_.name + WORD);
            }
        }, "helloWorld");
