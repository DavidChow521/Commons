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
        var jsVal = document.getElementsByClassName('jsVal');
        for (i = 0; i < jsVal.length; i++) {
            _jsVal[jsVal[i].name] = jsVal[i].value.trim();
        }
        return _jsVal;
    })(),
    //获取普通元素值
    getVal: function () {
        var field = arguments[0],
            _getVal = {};
        var getVal = document.getElementsByTagName('input');
        for (var i = 0; i < getVal.length; i++) {
            if (getVal[i].type !== "hidden" && getVal[i].type !== "file" && getVal[i].type !== "button" && getVal[i].name !== undefined) {
                _getVal[getVal[i].name] = getVal[i].value.trim();
            }
        }
        var select = document.getElementsByTagName('select');
        for (var i = 0; i < select.length; i++) {
            if (select[i].name !== undefined) {
                _getVal[select[i].name] = select[i].value.trim();
            }
        }
        var textarea = document.getElementsByTagName('textarea');
        for (var i = 0; i < textarea.length; i++) {
            if (textarea[i].name !== undefined) {
                _getVal[textarea[i].name] = textarea[i].value.trim();
            }
        }
        if (field != undefined && field != "" && field != null) {
            return _getVal[field] || null;
        }
        return _getVal
    },
}