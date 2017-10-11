/**
 * @AUTHOR:                     David Chow
 * @CREATEDATE:                 August 03st 2017.
 * @NAME:                       Jsdk v1.3.5
 * @DESCRIPTION:                常用js工具类,命名规范符合驼峰式大小写格式
 * @BLOG:                       http://blog.csdn.net/baidu_25382371
 * @License:                    You may use Jsdk-js under the terms of the MIT License (SeeLICENSE).
 * -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
 *[Import Of]
 *[Depend On]
 * JQuery v1.11.0+
 *[Sample Code]
 */
(function (global, factory) {
    var

        defaults = {
            //版本
            vsrsion: '1.3.5',
            //开启调试
            debug: true,
            //当前时间
            now: new Date()
        },
        //声明函数
        methods = [
            "backCardNo", "jsonDate", "moneyRoundOff", "chinese", "chineseAmt", "trimAll",
            "isNullOrEmpty", "isNullOrWhiteSpace", "isEmail", "isZipCode", "isChinese", "isEnglish", "isExists",
            "distinct", "format", "newGuid", "ajax",
            "basic", "request", "submit", "setCache", "getCache", "removeCache", "clearCache", "downloadCanvas"
        ];
    factory.prototype = {
        //初始化控件
        Init: function () {
            var self = this;
            methods.forEach(function (f, e) {
                defaults[f] = function () {
                    return call(this, f, arguments);
                    //return eval("self."+f).apply(defaults[f], arguments);
                };
            })
            function call(that, fn, args) {
                return eval("self." + fn).apply(that, args);
            }

            //调试日志
            if (defaults.debug) {
                console.log(defaults);
                console.log("%c Jsdk初始化成功！", "color:#5EB0FA");
            }

            return defaults || {};
        }
    }

    global.Jsdk = new factory().Init();

    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['Jsdk'], factory);
    } else if (typeof exports === 'object') {
        // CommonJS
        require('Jsdk');
    }
}(this, function () {
    'use strict';

    var that = this;

    /**
     *  格式化银行卡
     *  @cardno  卡号
     *  @replacing   格式字符
     *  @index  分割数
     *  @return  字符串
     *  @samplecode
     *    1.Jsdk.backCardNo('17072615244558938683') return '1707 2615 2445 5893 8683'
     *    2.Jsdk.backCardNo('17072615244558938683','-') return '1707-2615-2445-5893-8683'
     *    3.Jsdk.backCardNo('17072615244558938683',',',3) return '170,726,152,445,589,386,83'
     **/
    this.backCardNo = function (cardno, replacing, index) {
        var i = 4,
            r = " ";
        if (!that.isNullOrEmpty(index)) {
            if ($.isNumeric(index))
                i = index;
        }
        if (typeof (replacing) !== undefined && !that.isNullOrEmpty(replacing))
            r = replacing;
        eval("var regex = /(\\d{" + i + "})(?=\\d)/g");
        var regex = /(\\d{" + i + "})(?=\\d)/g;
        return cardno.replace(/[\s]/g, '').replace(regex, "$1" + r);
    }

    //Json日期(日期,格式字符,时间显示)
    /**
     *   格式化Json日期
     *   @date  json日期
     *   @replacing   格式字符
     *   @showtime  是否显示时间
     *   @return 正确的日期
     *   @samplecode
     *     1.Jsdk.jsonDate("/Date(1405056837780)/") return 2014-07-11 13:33:57
     *     2.Jsdk.jsonDate("/Date(1405056837780)/","/") return 2014/07/11 13:33:57
     *     3.Jsdk.jsonDate("/Date(1405056837780)/","/",false) return 2014/07/11
     */
    this.jsonDate = function (date, replacing, showtime) {
        var r = "-",
            s = true;
        if (typeof (replacing) !== undefined && String(replacing).trim() !== "")
            r = replacing;
        if (typeof (showtime) !== undefined && typeof (showtime) === "boolean")
            s = showtime;
        function f(e) {
            return e < 10 ? "0" + e.toString() : e;
        }

        date = eval('new ' + date.replace('/', '', 'g').replace('/', '', 'g'));
        var year = date.getFullYear(),
            month = f(date.getMonth() + 1),
            dates = f(date.getDate()),
            hours = f(date.getHours()),
            minutes = f(date.getMinutes()),
            Seconds = f(date.getSeconds());
        if (s) {
            return year + r + month + r + dates + " " + hours + ":" + minutes + ":" + Seconds;
        }
        return year + r + month + r + dates;
    }

    //金额四舍五入(数额,保留位数,币种符号)
    this.moneyRoundOff = function (money, index, currency) {
        var i = 2;
        if (!that.isNullOrEmpty(index)) {
            if ($.isNumeric(index))
                i = index;
        }
        if ($.isNumeric(money)) {
            if (!that.isNullOrEmpty(currency)) {
                return currency + (parseFloat(money)).toFixed(i);
            }
            return (parseFloat(money)).toFixed(i);
        }
        return null;
    };

    //阿拉伯数字转为中文大写
    this.chinese = function (arabnum) {
        if (!/^\d*(\.\d*)?$/.test(arabnum)) {
            alert("Number is wrong!");
            return "Number is wrong!";
        }
        var A = new Array("零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖");
        var B = new Array("", "拾", "佰", "仟", "万", "億", "点", "");
        var a = ("" + arabnum).replace(/(^0*)/g, "").split("."), k = 0, re = "";
        for (var i = a[0].length - 1; i >= 0; i--) {
            switch (k) {
                case 0:
                    re = B[7] + re;
                    break;
                case 4:
                    if (!new RegExp("0{4}\\d{" + (a[0].length - i - 1) + "}$").test(a[0]))
                        re = B[4] + re;
                    break;
                case 8:
                    re = B[5] + re;
                    B[7] = B[5];
                    k = 0;
                    break;
            }
            if (k % 4 == 2 && a[0].charAt(i + 2) != 0 && a[0].charAt(i + 1) == 0) re = A[0] + re;
            if (a[0].charAt(i) != 0) re = A[a[0].charAt(i)] + B[k % 4] + re;
            k++;
        }

        if (a.length > 1) //加上小数部分(如果有小数部分)
        {
            re += B[6];
            for (var i = 0; i < a[1].length; i++) re += A[a[1].charAt(i)];
        }
        return re;
    };

    //阿拉伯数字金额转为中文大写金额,精度到分
    this.chineseAmt = function (arabnum) {
        if (!/^\d*(\.\d*)?$/.test(arabnum)) return ""; //{ alert("Number is wrong!"); return "Number is wrong!"; }
        arabnum = parseFloat(arabnum).toFixed(2);
        var cnNum = that.chinese(arabnum);
        var a = cnNum.split("点");
        var ret = "";
        ret += (a[0] + "圆");
        if (a.length > 1) {
            for (var i = 0; i < a[1].length; i++) {
                ret += a[1][i];
                if (i == 0) ret += "角";
                else if (i == 1) ret += "分";
            }
        }
        else {
            ret += "整";
        }

        return ret;
    }

    //去除首尾中间空白字符(参数,中间空格)
    this.trimAll = function (value, center) {
        var c = true,
            value = String(value).trim();
        if (!that.isNullOrEmpty(center))
            c = center;
        if (c) {
            return value.replace(/[\s]/g, '');
        }
        return value;

    }

    //判断传入的字符串是否为Null或者为空字符串。
    this.isNullOrEmpty = function (value) {
        return value === undefined || value === null || value.trim() === "" || typeof (value) === undefined;
    };

    //判断传入的字符串是否为Null或者为空字符串或者全是空格。
    this.isNullOrWhiteSpace = function (value) {
        return that.isNullOrEmpty(value) || String(value).trim() === "";
    };

    //判断当前value是否是正确的 电子邮箱地址(Email) 格式。
    this.isEmail = function (value) {
        value = that.isNullOrEmpty(value) ? "" : String(value);
        return /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i.test(value);
    };

    //判断当前value是否是正确的 邮政编码(中国) 格式。
    this.isZipCode = function (value) {
        value = that.isNullOrEmpty(value) ? "" : String(value);
        return /^[\d]{6}$/.test(value);
    };

    //验证中文
    this.isChinese = function (value) {
        value = that.isNullOrEmpty(value) ? "" : String(value);
        return /^[\u0391-\uFFE5]+$/i.test(value);
    };

    //验证英文
    this.isEnglish = function (value) {
        value = that.isNullOrEmpty(value) ? "" : String(value);
        return /^[A-Za-z]+$/i.test(value);
    };

    //是否存在
    this.isExists = function (s) {
        var hash = {};
        for (var i in s) {
            if (hash[s[i]])
                return true;
            hash[s[i]] = true;
        }
        return false;
    }

    //是否有效IPv4
    this.isIPv4 = function (ipv4) {
        var reg = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
        if (reg.exec(ipv4) == null) {
            if (RegExp.$1 < 0 || RegExp.$1 > 255) return false;
            if (RegExp.$2 < 0 || RegExp.$2 > 255) return false;
            if (RegExp.$3 < 0 || RegExp.$3 > 255) return false;
            if (RegExp.$4 < 0 || RegExp.$4 > 255) return false;
        }
        else {
            return false
        }
        return true;
    }

    //去重
    this.distinct = function (value) {
        var r = [], hash = {};
        for (var i = 0, v; (v = value[i]) != null; i++) {
            if (!hash[v]) {
                r.push(v);
                hash[v] = true;
            }
        }
        return r;
    }

    /**
     *   类似于 .NET 中的 string.Format 函数功能
     *   @teturn 字符串
     *   @samplecode
     *   Jsdk.Format("{0},Hello World ！","小明")
     **/
    this.format = function () {
        var str = that.isNullOrEmpty(arguments[0]) ? "" : String(arguments[0]);
        if ($.isArray(arguments[1])) {
            for (var i = 0; i < arguments[1].length; i++) {
                var value = arguments[1][i] ? arguments[1][i] : "";
                str = str.replace(new RegExp("\\{" + i + "}", "gm"), value);
            }
        } else {
            var data = $(arguments).slice(1, arguments.length);
            for (var i = 0; i < data.length; i++) {
                str = str.replace(new RegExp("\\{" + i + "}", "gm"), data[i]);
            }
        }
        return str;
    }

    //创建GUID唯一标识
    this.newGuid = function (len) {
        len = len || 32;
        var guid = "";
        for (var i = 1; i <= len; i++) {
            var n = Math.floor(Math.random() * 16.0).toString(16);
            guid += n;
        }
        return guid;
    };

    //  获取浏览器的名称以及版本号。
    //  判断浏览器版本示例：判断浏览器是否为IE：  coreUtil.browser.msie == true，判断浏览器是否为 Chrome：window.browser.chrome == true
    //  判断浏览器版本号：IE下可能的值为 6.0/7.0/8.0/9.0/10.0 等等。
    this.basic = function () {
        var _matched, _browser;
        var _userAgentMatch = function (userAgent) {
            userAgent = userAgent.toLowerCase();
            var match = /(chrome)[ \/]([\w.]+)/.exec(userAgent) ||
                /(webkit)[ \/]([\w.]+)/.exec(userAgent) ||
                /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(userAgent) ||
                /(msie) ([\w.]+)/.exec(userAgent) ||
                userAgent.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(userAgent) || [];
            return {browser: match[1] || "", version: match[2] || "0"};
        };
        _matched = _userAgentMatch(window.navigator.userAgent);
        _browser = {};
        if (_matched.browser) {
            _browser[_matched.browser] = true;
            _browser.version = _matched.version;
        }
        if (_browser.chrome) {
            _browser.webkit = true;
        } else if (_browser.webkit) {
            _browser.safari = true;
        }
        return _browser;
    }

    /**
     *  获取当前网页参数
     *  @key 取值参数
     *  @return 值
     *  @samplecode
     *    Jsdk.Request("key")
     */
    this.request = function (key) {
        var regexp = new RegExp("(^|&)" + key + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(regexp);
        if (r != null)
            return unescape(r[2]);
        return null;
    }

    /**
     *  创建<form>表单提交
     *  @action  请求地址
     *  @object  对象参数
     *  @return  <form>标签对象
     *  @samplecode
     *  Jsdk.submit("/Controller/Action",{
	 *      Name:'小明',Age:18,Sex:1
     *  });
     **/
    this.submit = function (action, object) {
        var form = document.forms["_JSDK.SUBMIT_"];
        //这样处理可以减少<form>冗余
        if (form) {
            form.innerHTML = "";
        } else {
            //创建表单
            form = document.createElement("form");
            form.name = "_JSDK.SUBMIT_";
            form.style = "display:none";
            form.method = "post"
            form.target = "_blank";
        }

        form.id = that.format("_SUBMIT_{0}", new Date().getTime());
        form.action = action;

        //创建参数
        $.each(object, function (k, v) {
            var input = document.createElement("input");
            input.name = k;
            input.value = v;
            input.type = "hidden";
            form.appendChild(input);
        })

        //最新的HTML规范只有当页面中存在form时，submit(); 方法才会被激活
        document.body.appendChild(form);
        form.submit();
        //document.body.removeChild(form);
    }

    /**设置缓存
     * @key 键
     * @value 值（只支持字符串）
     */
    this.setCache = function (key, value) {
        localStorage.setItem(key, value);
    };
    /**获取缓存
     * @key 键
     * @return 字符串
     */
    this.getCache = function (key) {
        return localStorage.getItem(key);
    };
    //删除指定缓存数据
    this.removeCache = function (key) {
        localStorage.removeItem(key);
    };
    //清除缓存
    this.clearCache = function () {
        localStorage.clear();
    };

    /**保存canvas图片(不支持移动端)
     * @canvas 对象
     * @filename 文件名称
     * @image 保存类型
     */
    this.downloadCanvas = function (canvas, filename, image) {
        //声明保存类型
        var img = "image/png",
            //图片名称
            name = that.newGuid(),
            //创建a标签元素
            a = document.createElement('a');
        if (!that.isNullOrEmpty(filename)) {
            name = filename;
        }
        a.download = name;
        if (!that.isNullOrEmpty(image)) {
            img = image;
        }
        a.href = canvas.toDataURL(img);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    //创建httpRequest请求
    this.ajax = function (options) {
        options = options || {};
        options.async = options.async || true;
        options.type = (options.type || "POST").toUpperCase();
        options.dataType = options.dataType || "json";
        options.contenttype = options.contenttype || "application/json; charset=utf8";
        options.data = options.data || null;
        var params = null;
        if (options.data != undefined && options.data != null && options.data != "") {
            params = formatParams(options.data)
        }

        //创建 - 非IE6 - 第一步
        if (window.XMLHttpRequest) {
            var xhr = new XMLHttpRequest();
        } else {
            var xhr = new ActiveXObject("Microsoft.XMLHTTP");
        }

        //连接 和 发送 - 第二步
        if (options.type == "GET") {
            xhr.open("GET", options.url + "?" + params, options.async);
            xhr.send(null);
        } else if (options.type == "POST") {
            xhr.open("POST", options.url, options.async);
            // 添加http头，发送信息至服务器时内容编码类型
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhr.send(params);
        }

        //接收 - 第三步
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                var status = xhr.status;
                if (status >= 200 && status < 300) {
                    options.success && options.success(parseJSON(xhr.response), xhr);
                } else {
                    options.error && options.error(status);
                }
            }
        }

        //格式化参数
        function formatParams(data) {
            var arr = [];
            for (var name in data) {
                arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]));
            }
            arr.push(("v=" + Math.random()).replace(".", ""));
            return arr.join("&");
        }

        function parseJSON(data) {
            if (typeof data !== "string" || !data) {
                return null;
            }

            //去除首尾空格
            data = String(data).trim();

            // 使用本地自带JSON解析
            if (window.JSON && window.JSON.parse) {
                return window.JSON.parse(data);
            }

            //确保数据为JSON 格式
            // Logic borrowed from http://json.org/json2.js
            if (/^[\],:{}\s]*$/.test(data.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@")
                    .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]")
                    .replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) {

                return (new Function("return " + data))();

            }
            console.error("Invalid Jsdk: " + data);
        }
    }


}))

_Jsdk = (function () {
    var Jsdk = function () {
        //版本
        this.vsrsion = '1.3.5';
        //开启调试
        this.debug = true;
        //当前时间
        this.now = new Date();
        //函数
        this.methods = [
            "backCardNo", "jsonDate", "moneyRoundOff", "chinese", "chineseAmt", "trimAll",
            "isNullOrEmpty", "isNullOrWhiteSpace", "isEmail", "isZipCode", "isChinese", "isEnglish", "isExists",
            "distinct", "format", "newGuid", "ajax",
            "basic", "request", "submit", "setCache", "getCache", "removeCache", "clearCache", "downloadCanvas"
        ];
    }
    /**
     *  格式化银行卡
     *  @cardno  卡号
     *  @replacing   格式字符
     *  @index  分割数
     *  @return  字符串
     *  @samplecode
     *    1.Jsdk.backCardNo('17072615244558938683') return '1707 2615 2445 5893 8683'
     *    2.Jsdk.backCardNo('17072615244558938683','-') return '1707-2615-2445-5893-8683'
     *    3.Jsdk.backCardNo('17072615244558938683',',',3) return '170,726,152,445,589,386,83'
     **/
    Jsdk.prototype.backCardNo = function (cardno, replacing, index) {
        var i = 4,
            r = " ";
        if (!that.isNullOrEmpty(index)) {
            if ($.isNumeric(index))
                i = index;
        }
        if (typeof (replacing) !== undefined && !that.isNullOrEmpty(replacing))
            r = replacing;
        eval("var regex = /(\\d{" + i + "})(?=\\d)/g");
        var regex = /(\\d{" + i + "})(?=\\d)/g;
        return cardno.replace(/[\s]/g, '').replace(regex, "$1" + r);
    }

    //Json日期(日期,格式字符,时间显示)
    /**
     *   格式化Json日期
     *   @date  json日期
     *   @replacing   格式字符
     *   @showtime  是否显示时间
     *   @return 正确的日期
     *   @samplecode
     *     1.Jsdk.jsonDate("/Date(1405056837780)/") return 2014-07-11 13:33:57
     *     2.Jsdk.jsonDate("/Date(1405056837780)/","/") return 2014/07/11 13:33:57
     *     3.Jsdk.jsonDate("/Date(1405056837780)/","/",false) return 2014/07/11
     */
    Jsdk.prototype.jsonDate = function (date, replacing, showtime) {
        var r = "-",
            s = true;
        if (typeof (replacing) !== undefined && String(replacing).trim() !== "")
            r = replacing;
        if (typeof (showtime) !== undefined && typeof (showtime) === "boolean")
            s = showtime;
        function f(e) {
            return e < 10 ? "0" + e.toString() : e;
        }

        date = eval('new ' + date.replace('/', '', 'g').replace('/', '', 'g'));
        var year = date.getFullYear(),
            month = f(date.getMonth() + 1),
            dates = f(date.getDate()),
            hours = f(date.getHours()),
            minutes = f(date.getMinutes()),
            Seconds = f(date.getSeconds());
        if (s) {
            return year + r + month + r + dates + " " + hours + ":" + minutes + ":" + Seconds;
        }
        return year + r + month + r + dates;
    }

    //金额四舍五入(数额,保留位数,币种符号)
    Jsdk.prototype.moneyRoundOff = function (money, index, currency) {
        var i = 2;
        if (!that.isNullOrEmpty(index)) {
            if ($.isNumeric(index))
                i = index;
        }
        if ($.isNumeric(money)) {
            if (!that.isNullOrEmpty(currency)) {
                return currency + (parseFloat(money)).toFixed(i);
            }
            return (parseFloat(money)).toFixed(i);
        }
        return null;
    };

    //阿拉伯数字转为中文大写
    Jsdk.prototype.chinese = function (arabnum) {
        if (!/^\d*(\.\d*)?$/.test(arabnum)) {
            alert("Number is wrong!");
            return "Number is wrong!";
        }
        var A = new Array("零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖");
        var B = new Array("", "拾", "佰", "仟", "万", "億", "点", "");
        var a = ("" + arabnum).replace(/(^0*)/g, "").split("."), k = 0, re = "";
        for (var i = a[0].length - 1; i >= 0; i--) {
            switch (k) {
                case 0:
                    re = B[7] + re;
                    break;
                case 4:
                    if (!new RegExp("0{4}\\d{" + (a[0].length - i - 1) + "}$").test(a[0]))
                        re = B[4] + re;
                    break;
                case 8:
                    re = B[5] + re;
                    B[7] = B[5];
                    k = 0;
                    break;
            }
            if (k % 4 == 2 && a[0].charAt(i + 2) != 0 && a[0].charAt(i + 1) == 0) re = A[0] + re;
            if (a[0].charAt(i) != 0) re = A[a[0].charAt(i)] + B[k % 4] + re;
            k++;
        }

        if (a.length > 1) //加上小数部分(如果有小数部分)
        {
            re += B[6];
            for (var i = 0; i < a[1].length; i++) re += A[a[1].charAt(i)];
        }
        return re;
    };

    //阿拉伯数字金额转为中文大写金额,精度到分
    Jsdk.prototype.chineseAmt = function (arabnum) {
        if (!/^\d*(\.\d*)?$/.test(arabnum)) return ""; //{ alert("Number is wrong!"); return "Number is wrong!"; }
        arabnum = parseFloat(arabnum).toFixed(2);
        var cnNum = that.chinese(arabnum);
        var a = cnNum.split("点");
        var ret = "";
        ret += (a[0] + "圆");
        if (a.length > 1) {
            for (var i = 0; i < a[1].length; i++) {
                ret += a[1][i];
                if (i == 0) ret += "角";
                else if (i == 1) ret += "分";
            }
        }
        else {
            ret += "整";
        }

        return ret;
    }

    //去除首尾中间空白字符(参数,中间空格)
    Jsdk.prototype.trimAll = function (value, center) {
        var c = true,
            value = String(value).trim();
        if (!that.isNullOrEmpty(center))
            c = center;
        if (c) {
            return value.replace(/[\s]/g, '');
        }
        return value;

    }

    //判断传入的字符串是否为Null或者为空字符串。
    Jsdk.prototype.isNullOrEmpty = function (value) {
        return value === undefined || value === null || value.trim() === "" || typeof (value) === undefined;
    };

    //判断传入的字符串是否为Null或者为空字符串或者全是空格。
    Jsdk.prototype.isNullOrWhiteSpace = function (value) {
        return that.isNullOrEmpty(value) || String(value).trim() === "";
    };

    //判断当前value是否是正确的 电子邮箱地址(Email) 格式。
    Jsdk.prototype.isEmail = function (value) {
        value = that.isNullOrEmpty(value) ? "" : String(value);
        return /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i.test(value);
    };

    //判断当前value是否是正确的 邮政编码(中国) 格式。
    Jsdk.prototype.isZipCode = function (value) {
        value = that.isNullOrEmpty(value) ? "" : String(value);
        return /^[\d]{6}$/.test(value);
    };

    //验证中文
    Jsdk.prototype.isChinese = function (value) {
        value = that.isNullOrEmpty(value) ? "" : String(value);
        return /^[\u0391-\uFFE5]+$/i.test(value);
    };

    //验证英文
    Jsdk.prototype.isEnglish = function (value) {
        value = that.isNullOrEmpty(value) ? "" : String(value);
        return /^[A-Za-z]+$/i.test(value);
    };

    //是否存在
    Jsdk.prototype.isExists = function (s) {
        var hash = {};
        for (var i in s) {
            if (hash[s[i]])
                return true;
            hash[s[i]] = true;
        }
        return false;
    }

    //是否有效IPv4
    Jsdk.prototype.isIPv4 = function (ipv4) {
        var reg = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
        if (reg.exec(ipv4) == null) {
            if (RegExp.$1 < 0 || RegExp.$1 > 255) return false;
            if (RegExp.$2 < 0 || RegExp.$2 > 255) return false;
            if (RegExp.$3 < 0 || RegExp.$3 > 255) return false;
            if (RegExp.$4 < 0 || RegExp.$4 > 255) return false;
        }
        else {
            return false
        }
        return true;
    }

    //去重
    Jsdk.prototype.distinct = function (value) {
        var r = [], hash = {};
        for (var i = 0, v; (v = value[i]) != null; i++) {
            if (!hash[v]) {
                r.push(v);
                hash[v] = true;
            }
        }
        return r;
    }

    /**
     *   类似于 .NET 中的 string.Format 函数功能
     *   @teturn 字符串
     *   @samplecode
     *   Jsdk.Format("{0},Hello World ！","小明")
     **/
    Jsdk.prototype.format = function () {
        var str = that.isNullOrEmpty(arguments[0]) ? "" : String(arguments[0]);
        if ($.isArray(arguments[1])) {
            for (var i = 0; i < arguments[1].length; i++) {
                var value = arguments[1][i] ? arguments[1][i] : "";
                str = str.replace(new RegExp("\\{" + i + "}", "gm"), value);
            }
        } else {
            var data = $(arguments).slice(1, arguments.length);
            for (var i = 0; i < data.length; i++) {
                str = str.replace(new RegExp("\\{" + i + "}", "gm"), data[i]);
            }
        }
        return str;
    }

    //创建GUID唯一标识
    Jsdk.prototype.newGuid = function (len) {
        len = len || 32;
        var guid = "";
        for (var i = 1; i <= len; i++) {
            var n = Math.floor(Math.random() * 16.0).toString(16);
            guid += n;
        }
        return guid;
    };

    //  获取浏览器的名称以及版本号。
    //  判断浏览器版本示例：判断浏览器是否为IE：  coreUtil.browser.msie == true，判断浏览器是否为 Chrome：window.browser.chrome == true
    //  判断浏览器版本号：IE下可能的值为 6.0/7.0/8.0/9.0/10.0 等等。
    Jsdk.prototype.basic = function () {
        var _matched, _browser;
        var _userAgentMatch = function (userAgent) {
            userAgent = userAgent.toLowerCase();
            var match = /(chrome)[ \/]([\w.]+)/.exec(userAgent) ||
                /(webkit)[ \/]([\w.]+)/.exec(userAgent) ||
                /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(userAgent) ||
                /(msie) ([\w.]+)/.exec(userAgent) ||
                userAgent.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(userAgent) || [];
            return {browser: match[1] || "", version: match[2] || "0"};
        };
        _matched = _userAgentMatch(window.navigator.userAgent);
        _browser = {};
        if (_matched.browser) {
            _browser[_matched.browser] = true;
            _browser.version = _matched.version;
        }
        if (_browser.chrome) {
            _browser.webkit = true;
        } else if (_browser.webkit) {
            _browser.safari = true;
        }
        return _browser;
    }

    /**
     *  获取当前网页参数
     *  @key 取值参数
     *  @return 值
     *  @samplecode
     *    Jsdk.Request("key")
     */
    Jsdk.prototype.request = function (key) {
        var regexp = new RegExp("(^|&)" + key + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(regexp);
        if (r != null)
            return unescape(r[2]);
        return null;
    }

    /**
     *  创建<form>表单提交
     *  @action  请求地址
     *  @object  对象参数
     *  @return  <form>标签对象
     *  @samplecode
     *  Jsdk.submit("/Controller/Action",{
	 *      Name:'小明',Age:18,Sex:1
     *  });
     **/
    Jsdk.prototype.submit = function (action, object) {
        var form = document.forms["_JSDK.SUBMIT_"];
        //这样处理可以减少<form>冗余
        if (form) {
            form.innerHTML = "";
        } else {
            //创建表单
            form = document.createElement("form");
            form.name = "_JSDK.SUBMIT_";
            form.style = "display:none";
            form.method = "post"
            form.target = "_blank";
        }

        form.id = that.format("_SUBMIT_{0}", new Date().getTime());
        form.action = action;

        //创建参数
        $.each(object, function (k, v) {
            var input = document.createElement("input");
            input.name = k;
            input.value = v;
            input.type = "hidden";
            form.appendChild(input);
        })

        //最新的HTML规范只有当页面中存在form时，submit(); 方法才会被激活
        document.body.appendChild(form);
        form.submit();
        //document.body.removeChild(form);
    }

    /**设置缓存
     * @key 键
     * @value 值（只支持字符串）
     */
    Jsdk.prototype.setCache = function (key, value) {
        localStorage.setItem(key, value);
    };
    /**获取缓存
     * @key 键
     * @return 字符串
     */
    Jsdk.prototype.getCache = function (key) {
        return localStorage.getItem(key);
    };
    //删除指定缓存数据
    Jsdk.prototype.removeCache = function (key) {
        localStorage.removeItem(key);
    };
    //清除缓存
    Jsdk.prototype.clearCache = function () {
        localStorage.clear();
    };

    /**保存canvas图片(不支持移动端)
     * @canvas 对象
     * @filename 文件名称
     * @image 保存类型
     */
    Jsdk.prototype.downloadCanvas = function (canvas, filename, image) {
        //声明保存类型
        var img = "image/png",
            //图片名称
            name = that.newGuid(),
            //创建a标签元素
            a = document.createElement('a');
        if (!that.isNullOrEmpty(filename)) {
            name = filename;
        }
        a.download = name;
        if (!that.isNullOrEmpty(image)) {
            img = image;
        }
        a.href = canvas.toDataURL(img);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    //创建httpRequest请求
    Jsdk.prototype.ajax = function (options) {
        options = options || {};
        options.async = options.async || true;
        options.type = (options.type || "POST").toUpperCase();
        options.dataType = options.dataType || "json";
        options.contenttype = options.contenttype || "application/json; charset=utf8";
        options.data = options.data || null;
        var params = null;
        if (options.data != undefined && options.data != null && options.data != "") {
            params = formatParams(options.data)
        }

        //创建 - 非IE6 - 第一步
        if (window.XMLHttpRequest) {
            var xhr = new XMLHttpRequest();
        } else {
            var xhr = new ActiveXObject("Microsoft.XMLHTTP");
        }

        //连接 和 发送 - 第二步
        if (options.type == "GET") {
            xhr.open("GET", options.url + "?" + params, options.async);
            xhr.send(null);
        } else if (options.type == "POST") {
            xhr.open("POST", options.url, options.async);
            // 添加http头，发送信息至服务器时内容编码类型
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhr.send(params);
        }

        //接收 - 第三步
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                var status = xhr.status;
                if (status >= 200 && status < 300) {
                    options.success && options.success(parseJSON(xhr.response), xhr);
                } else {
                    options.error && options.error(status);
                }
            }
        }

        //格式化参数
        function formatParams(data) {
            var arr = [];
            for (var name in data) {
                arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]));
            }
            arr.push(("v=" + Math.random()).replace(".", ""));
            return arr.join("&");
        }

        function parseJSON(data) {
            if (typeof data !== "string" || !data) {
                return null;
            }

            //去除首尾空格
            data = String(data).trim();

            // 使用本地自带JSON解析
            if (window.JSON && window.JSON.parse) {
                return window.JSON.parse(data);
            }

            //确保数据为JSON 格式
            // Logic borrowed from http://json.org/json2.js
            if (/^[\],:{}\s]*$/.test(data.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@")
                    .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]")
                    .replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) {

                return (new Function("return " + data))();

            }
            console.error("Invalid Jsdk: " + data);
        }
    }

    return new Jsdk();
})()

/********************************************************原生函数扩展********************************************************/

String.prototype.Equals = function (str) {
    return this === str;
}
String.prototype.format = function () {
    that.format.apply(this, arguments);
}
String.prototype.getBytes = function () {
    return this.replace(/[^\x00-\xff]/g, "**").length;
}
Array.prototype.contains = function (obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
}
Date.prototype.ToString = function (format) {
    var date = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S+": this.getMilliseconds()
    };
    if (/(y+)/i.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in date) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1
                ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
        }
    }
    return format;
};
Date.prototype.Equals = function (date) {
    return Date.parse(this) == Date.parse(date);
}
Date.prototype.addYears = function (year) {
    this.setFullYear(this.getFullYear() + year)
    return this;
}
Date.prototype.addMonths = function (month) {
    this.setMonth(this.getMonth() + month)
    return this;
}
Date.prototype.addDays = function (day) {
    this.setDate(this.getDate() + day)
    return this;
}
Date.prototype.addHours = function (hour) {
    this.setHours(this.getHours() + hour)
    return this;
}
Date.prototype.addMinutes = function (minute) {
    this.setMinutes(this.getMinutes() + minute)
    return this;
}
Date.prototype.getLastDay = function () {
    return new Date(new Date(this.getYear(), this.getMonth() + 1, 1).getTime() - 1000 * 60 * 60 * 24).getDate();
}
Date.prototype.getWeekFirstDay = function () {
    return new Date(new Date(this.getFullYear(), this.getMonth(), this.getDate() - this.getDay())).getDate();
}
Date.prototype.getWeekFirstDate = function () {
    return new Date(new Date(this.getFullYear(), this.getMonth(), this.getDate() - this.getDay()));
}

/********************************************************原生函数扩展********************************************************/


