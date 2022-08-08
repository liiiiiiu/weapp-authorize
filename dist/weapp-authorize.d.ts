export declare const authorize: {
  /**
   * 检查用户授权状态，如还未授权则使用 wx.authorize 呼出授权弹框；
   *
   * 建议在调用需授权接口之前，提前向用户发起授权请求，如页面 onLoad 阶段。
   *
   * @param {string} scopeName 需要授权的 scope
   * @param {Function} successCallback 授权成功的回调函数
   * @param {Function} failCallback 授权失败的回调函数
   */
  check: Function
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
  auth: Function
};