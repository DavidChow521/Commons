/*
 * AUTHOR:         David Chow.
 * CREATEDATE:     August 03st 2017.
 * DESCRIPTION:    js工具类
 *[Change Log]
 *
 *[Import Of]
 *                 此处省略。。。
 *[Depend On]
 * JQuery v1.11.0+
 *[Sample Code]
 //复制此方法放在需要调用的地方(详情请看 tools.js    by mark David Chow)
 tools.Formatting.方法名(参数);
 */

if (jQuery) {
    //tools.js
    var tools = {
        //格式化基类
        Formatting: {},

        //校验基类
        Checkout: {},

        //字符串基类
        String: {},

        //浏览器基类
        Brower: {}
    };


    //银行卡(卡号,格式字符,分割数)
    tools.Formatting.BackCardNo = function (cardno, replacing, index) {
        var i = 4,
            r = " ";
        if (!tools.Checkout.IsNullOrEmpty(index)) {
            if ($.isNumeric(index))
                i = index;
        }
        if (typeof (replacing) !== undefined && $.trim(replacing) !== "")
            r = replacing;
        eval("var regex = /(\\d{" + i + "})(?=\\d)/g");
        return cardno.replace(/[\s]/g, '').replace(regex, "$1" + r);
    }

    //Json日期(日期,格式字符,时间显示)
    tools.Formatting.JsonDateTime = function (date, replacing, showtime) {
        var r = "-",
            s = true;
        if (typeof (replacing) !== undefined && $.trim(replacing) !== "")
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
    tools.Formatting.MoneyRoundOff = function (money, index, currency) {
        var i = 2;
        if (!tools.Checkout.IsNullOrEmpty(index)) {
            if ($.isNumeric(index))
                i = index;
        }
        if ($.isNumeric(money)) {
            if (!tools.Checkout.IsNullOrEmpty(currency)) {
                return currency + (parseFloat(money)).toFixed(i);
            }
            return (parseFloat(money)).toFixed(i);
        }
        return null;
    }

    //去除首尾中间空白字符(参数,中间空格)
    tools.Formatting.TrimAll = function (value, center) {
        var c = true,
            value = $.trim(value);
        if (!tools.Checkout.IsNullOrEmpty(center))
            c = center;
        if (c) {
            return value.replace(/[\s]/g, '');
        }
        return value;

    }

    //判断传入的字符串是否为Null或者为空字符串。
    tools.Checkout.IsNullOrEmpty = function (value) {
        return value === undefined || value === null || value === "";
    };

    //判断传入的字符串是否为Null或者为空字符串或者全是空格。
    tools.Checkout.IsNullOrWhiteSpace = function (value) {
        return tools.Checkout.isNullOrEmpty(value) || $.trim(String(value)) === "";
    };

    //判断当前value是否是正确的 电子邮箱地址(Email) 格式。
    tools.Checkout.IsEmail = function (value) {
        str = tools.Checkout.isNullOrEmpty(value) ? "" : String(value);
        return /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i.test(value);
    };

    //判断当前value是否是正确的 邮政编码(中国) 格式。
    tools.Checkout.IsZipCode = function (value) {
        str = tools.Checkout.isNullOrEmpty(value) ? "" : String(value);
        return /^[\d]{6}$/.test(value);
    };

    //验证中文
    tools.Checkout.IsChinese = function (value) {
        str = tools.Checkout.IsNullOrEmpty(value) ? "" : String(value);
        return /^[\u0391-\uFFE5]+$/i.test(value);
    };

    //验证英文
    tools.Checkout.IsEnglish = function (value) {
        str = tools.Checkout.IsNullOrEmpty(value) ? "" : String(value);
        return /^[A-Za-z]+$/i.test(value);
    };

    //是否存在
    tools.Checkout.IsExists = function (s) {
        var hash = {};
        for (var i in s) {
            if (hash[s[i]])
                return true;
            hash[s[i]] = true;
        }
        return false;
    }

    //去重
    tools.String.Distinct = function (value) {
        var r = [], hash = {};
        for (var i = 0, v; (v = value[i]) != null; i++) {
            if (!hash[v]) {
                r.push(v);
                hash[v] = true;
            }
        }
        return r;
    }


    //  获取浏览器的名称以及版本号。
    //  判断浏览器版本示例：判断浏览器是否为IE：  coreUtil.browser.msie == true，判断浏览器是否为 Chrome：window.browser.chrome == true
    //  判断浏览器版本号：IE下可能的值为 6.0/7.0/8.0/9.0/10.0 等等。
    var _matched, _browser;
    var _userAgentMatch = function (userAgent) {
        userAgent = userAgent.toLowerCase();
        var match = /(chrome)[ \/]([\w.]+)/.exec(userAgent) ||
            /(webkit)[ \/]([\w.]+)/.exec(userAgent) ||
            /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(userAgent) ||
            /(msie) ([\w.]+)/.exec(userAgent) ||
            userAgent.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(userAgent) || [];
        return { browser: match[1] || "", version: match[2] || "0" };
    };
    _matched = _userAgentMatch(window.navigator.userAgent);
    _browser = {};
    if (_matched.browser) { _browser[_matched.browser] = true; _browser.version = _matched.version; }
    if (_browser.chrome) { _browser.webkit = true; } else if (_browser.webkit) { _browser.safari = true; }

    tools.Brower.basic = _browser;

    //当前网页链接指定的key值
    tools.Brower.Request = function (key) {
        var regexp = new RegExp("(^|&)" + key + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(regexp);
        if (r != null)
            return unescape(r[2]);
        return null;
    }


} else {
    throw new ReferenceError("tools.js Depend On JQuery !")
}