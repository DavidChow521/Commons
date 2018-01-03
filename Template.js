/**
 * Created by user on yyyy-MM-dd.
 * 命名规范遵从小驼峰式命名法（lower camel case）：第一个单字以小写字母开始
 */

var viewModel = function () {
    //是否可以提交
    this.isPost = true;

    //初始化(所有的事件注册全在这里)
    this.init = function (callback) {
        if (callback && typeof callback == "function") {
            callback(this);
        } else {
            throw 'viewModel.init() 初始化失败！';
        }
    }
}

viewModel.prototype = {
    //初始化获取隐藏input标签值
    jsVal: (function () {
        var _jsVal = {};
        //格式:<input type="hidden" name="列" value="值" class="jsVal"/>
        $(document).find("input[type=hidden].jsVal").each(function (k, v) {
            if ($(v).attr("name") != undefined) {
                _jsVal[$(v).attr("name")] = $.trim($(v).val());
            }
        })
        return _jsVal;
    })(),
    //获取普通元素值
    getVal: function () {
        var field = arguments[0],
            _getVal = {};
        $(document).find("input:not([type=hidden],[type=file],[type=button]),select,textarea").each(function (k, v) {
            if ($(v).attr("name") != undefined) {
                _getVal[$(v).attr("name")] = $.trim($(v).val());
            }
        })
        if (field != undefined && field != "" && field != null) {
            return _getVal[field] || null;
        }
        return _getVal
    },
}