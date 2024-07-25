type ScopeNameType = 'userLocation' | 'userLocationBackground' | 'record' | 'camera' | 'bluetooth' | 'writePhotosAlbum' | 'addPhoneContact' | 'addPhoneCalendar' | 'werun';
declare class Authorize {
    protected scopeNames: ScopeNameType[];
    protected scopeMap: number[][];
    constructor();
    protected get page(): {
        setData: Function;
    };
    private init;
    protected genCharCode(value: string): number[];
    protected compare(value: any): void;
    protected authStateSettle(scopeName: ScopeNameType, state: boolean): void;
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
    protected recheck(scopeName: ScopeNameType, successCallback?: (data?: any) => any, failCallback?: (data?: any) => any): void;
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
    protected opensetting(e: any, scopeName: ScopeNameType, successCallback?: (data?: any) => any, failCallback?: (data?: any) => any): void;
    /**
     * 检查用户授权状态，如还未授权则使用 wx.authorize 呼出授权弹框；
     *
     * 建议在调用需授权接口之前，提前向用户发起授权请求，如页面 onLoad 阶段。
     *
     * @param {string} scopeName 需要授权的 scope
     * @param {Function} successCallback 授权成功的回调函数
     * @param {Function} failCallback 授权失败的回调函数
     */
    check(scopeName: ScopeNameType, successCallback?: (data?: any) => any, failCallback?: (data?: any) => any): void;
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
    auth(e: any, scopeName: ScopeNameType, successCallback?: (data?: any) => any, failCallback?: (data?: any) => any): void;
}
/**
 * 🌞 微信小程序“授权”封装
 *
 * scope 如下：'userLocation'|'userLocationBackground'|'record'|'camera'|'bluetooth'|'writePhotosAlbum'|'addPhoneContact'|'addPhoneCalendar'|'werun';
 *
 * 对应传入的 scope，Authorize类会生成相应的 userLocationAuth、userLocationBackgroundAuth、recordAuth...等data数据，并发送到视图层，视图层可使用该值作为条件判断渲染不同的节点;
 *
 * scope 授权详情查看：https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/authorize.html
 */
declare const authorize: Authorize;
export default authorize;
