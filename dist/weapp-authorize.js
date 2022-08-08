"use strict";
exports.__esModule = true;
var Authorize = /** @class */ (function () {
    function Authorize() {
        this.scopeNames = [
            'userLocation',
            'userLocationBackground',
            'record',
            'camera',
            'bluetooth',
            'writePhotosAlbum',
            'addPhoneContact',
            'addPhoneCalendar',
            'werun',
        ];
        this.init();
    }
    Object.defineProperty(Authorize.prototype, "page", {
        get: function () {
            var pages = getCurrentPages();
            return pages[pages.length - 1];
        },
        enumerable: false,
        configurable: true
    });
    Authorize.prototype.init = function () {
        var _this = this;
        this.scopeMap = Array.from({ length: this.scopeNames.length }, function () { return []; });
        Array.from(this.scopeNames, function (scopeName, index) {
            _this.scopeMap[index] = _this.genCharCode(scopeName);
        });
    };
    Authorize.prototype.genCharCode = function (value) {
        if (!value)
            return [];
        var tempArr = Array.from({ length: 26 }, function () { return 0; });
        var i = -1;
        while (++i < value.length) {
            tempArr[value[i].toLowerCase().charCodeAt(0) - 'a'.charCodeAt(0)] += 1;
        }
        return tempArr;
    };
    Authorize.prototype.compare = function (value) {
        var _this = this;
        if (!value) {
            throw Error("scope \"".concat(value ? value : '', "\" not found, do you mean \"").concat(this.scopeNames[0], "\"?"));
        }
        if (this.scopeNames.includes(value))
            return;
        var vCharCode = this.genCharCode(value), dif = 0, minDif = 0, nearest = '';
        Array.from(this.scopeMap, function (charCode, index) {
            dif = 0;
            for (var i = 0; i < 26; i++) {
                dif += Math.abs(charCode[i] - vCharCode[i]);
            }
            var illegal = value.match(/[^a-zA-Z]*/g);
            if (illegal && illegal.length) {
                dif += illegal.join('').length;
            }
            minDif = !minDif ? dif : Math.min(dif, minDif);
            nearest = Math.min(dif, minDif) === dif ? _this.scopeNames[index] : nearest;
            console.log('compare', value, _this.scopeNames[index], dif, minDif, nearest);
        });
        throw Error("scope \"".concat(value, "\" not found, do you mean \"").concat(nearest, "\"?"));
    };
    Authorize.prototype.authStateSettle = function (scopeName, state) {
        var _a;
        this.page.setData((_a = {}, _a[scopeName + 'Auth'] = state, _a));
    };
    /**
     * 检查用户授权状态，如还未授权则使用 wx.authorize 呼出授权弹框；
     *
     * 建议在调用需授权接口之前，提前向用户发起授权请求，如页面 onLoad 阶段。
     *
     * @param {string} scopeName 需要授权的 scope
     * @param {Function} successCallback 授权成功的回调函数
     * @param {Function} failCallback 授权失败的回调函数
     */
    Authorize.prototype.check = function (scopeName, successCallback, failCallback) {
        var _this = this;
        this.compare(scopeName);
        var scope = 'scope.' + scopeName;
        wx.getSetting({
            success: function (settingRes) {
                if (settingRes.authSetting[scope]) {
                    _this.authStateSettle(scopeName, true);
                    successCallback && successCallback(settingRes);
                    return;
                }
                wx.authorize({
                    scope: scope,
                    success: function (authRes) {
                        _this.authStateSettle(scopeName, true);
                        successCallback && successCallback(authRes);
                    },
                    fail: function (error) {
                        _this.authStateSettle(scopeName, false);
                        failCallback && failCallback(error);
                    }
                });
            },
            fail: function (settingError) {
                _this.authStateSettle(scopeName, false);
                failCallback && failCallback(settingError);
            }
        });
    };
    /**
     * 在调用需授权接口时要再次确认是否获得了用户授权；
     *
     * 如获得授权，继续执行该接口；
     *
     * 如未获得授权，调用 wx.openSetting 打开设置界面，引导用户开启授权；
     *
     * 注意：设置界面中只会出现小程序向用户请求过的权限！也就是说必须要先调用 check 函数弹出 wx.authorize 的授权框，不管用户同意还是拒绝，该 scope 才会出现在设置界面里。
     *
     * @param {string} scopeName 需要授权的 scope
     * @param {Function} successCallback 授权成功的回调函数
     * @param {Function} failCallback 授权失败的回调函数
     */
    Authorize.prototype.recheck = function (scopeName, successCallback, failCallback) {
        var _this = this;
        this.compare(scopeName);
        var scope = 'scope.' + scopeName;
        wx.getSetting({
            success: function (settingRes) {
                if (settingRes.authSetting[scope]) {
                    _this.authStateSettle(scopeName, true);
                    successCallback && successCallback(settingRes);
                    return;
                }
                wx.openSetting({
                    success: function (authRes) {
                        _this.authStateSettle(scopeName, true);
                        successCallback && successCallback(authRes);
                    },
                    fail: function (error) {
                        _this.authStateSettle(scopeName, false);
                        failCallback && failCallback(error);
                    }
                });
            },
            fail: function (settingError) {
                _this.authStateSettle(scopeName, false);
                failCallback && failCallback(settingError);
            }
        });
    };
    /**
     * 兼容用户拒绝授权的场景；
     *
     * 仅在该授权第一次被拒绝后由用户点击 openType 按钮手动触发。
     *
     * @param {Object} e 点击按钮后返回的 event 对象
     * @param {string} scopeName 需要授权的 scope
     * @param {Function} successCallback 授权成功的回调函数
     * @param {Function} failCallback 授权失败的回调函数
     */
    Authorize.prototype.opensetting = function (e, scopeName, successCallback, failCallback) {
        this.compare(scopeName);
        var scope = 'scope.' + scopeName;
        if (e.detail.authSetting[scope]) {
            this.authStateSettle(scopeName, true);
            successCallback && successCallback('');
        }
        else {
            this.authStateSettle(scopeName, false);
            failCallback && failCallback('');
        }
    };
    /**
     * 在调用需授权接口时要再次确认是否获得了用户授权；
     *
     * 如获得授权，继续执行该接口；
     *
     * 如未获得授权，调用 wx.openSetting 打开设置界面，引导用户开启授权；
     *
     * 函数内兼容了用户拒绝授权的场景；
     *
     * 注意：设置界面中只会出现小程序向用户请求过的权限！也就是说必须要先调用 check 函数弹出 wx.authorize 的授权框，不管用户同意还是拒绝，该 scope 才会出现在设置界面里。
     *
     * @param {Object} e 点击按钮后返回的 event 对象
     * @param {string} scopeName 需要授权的 scope
     * @param {Function} successCallback 授权成功的回调函数
     * @param {Function} failCallback 授权失败的回调函数
     */
    Authorize.prototype.auth = function (e, scopeName, successCallback, failCallback) {
        if (typeof e === 'string') {
            e = null;
            scopeName = e;
            this.recheck(scopeName, successCallback, failCallback);
            return;
        }
        var _scopeName = scopeName;
        if (typeof e === 'object') {
            if (!scopeName || typeof scopeName === 'function') {
                _scopeName = e.currentTarget.dataset.scope;
            }
            !e.detail.authSetting
                ? this.recheck(_scopeName, successCallback, failCallback)
                : this.opensetting(e, _scopeName, successCallback, failCallback);
        }
    };
    return Authorize;
}());
/**
 * 💯 微信小程序“授权”封装
 *
 * scope 如下：'userLocation'|'userLocationBackground'|'record'|'camera'|'bluetooth'|'writePhotosAlbum'|'addPhoneContact'|'addPhoneCalendar'|'werun';
 *
 * 对应传入的 scope，Authorize类会生成相应的 userLocationAuth、userLocationBackgroundAuth、recordAuth...等data数据，并发送到视图层，视图层可使用该值作为条件判断渲染不同的节点;
 *
 * scope 授权详情查看：https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/authorize.html
 */
var authorize = new Authorize();
exports["default"] = authorize;
