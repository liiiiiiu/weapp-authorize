type ScopeNameType = 'userLocation'|'userLocationBackground'|'record'|'camera'|'bluetooth'|'writePhotosAlbum'|'addPhoneContact'|'addPhoneCalendar'|'werun'

class Authorize {
  protected scopeNames: ScopeNameType[]

  protected scopeMap!: number[][]

  constructor() {
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
    ]

    this.init()
  }

  protected get page(): {
    setData: Function
  } {
    const pages = getCurrentPages()
    return pages[pages.length - 1]
  }

  private init() {
    this.scopeMap = Array.from({length: this.scopeNames.length}, () => [])

    Array.from(this.scopeNames, (scopeName: string, index: number) => {
      this.scopeMap[index] = this.genCharCode(scopeName)
    })
  }

  protected genCharCode(value: string): number[] {
    if (!value) return []

    const tempArr: number[] = Array.from({length: 26}, () => 0)
    let i = -1
    while (++i < value.length) {
      tempArr[value[i].toLowerCase().charCodeAt(0) - 'a'.charCodeAt(0)] += 1
    }
    return tempArr
  }

  protected compare(value: any) {
    if (!value) {
      throw Error(`scope "${value ? value : ''}" not found, do you mean "${this.scopeNames[0]}"?`)
    }

    if (this.scopeNames.includes(value)) return

    let vCharCode: number[] = this.genCharCode(value),
      dif = 0,
      minDif = 0,
      nearest = ''

    Array.from(this.scopeMap, (charCode: number[], index: number) => {
      dif = 0

      for (let i = 0; i < 26; i++) {
        dif += Math.abs(charCode[i] - vCharCode[i])
      }

      let illegal = value.match(/[^a-zA-Z]*/g)
      if (illegal && illegal.length) {
        dif += illegal.join('').length
      }
      minDif = !minDif ? dif : Math.min(dif, minDif)
      nearest = Math.min(dif, minDif) === dif ? this.scopeNames[index] : nearest

      console.log('compare', value, this.scopeNames[index], dif, minDif, nearest)
    })

    throw Error(`scope "${value}" not found, do you mean "${nearest}"?`)
  }

  protected authStateSettle(scopeName: ScopeNameType, state: boolean) {
    this.page.setData({ [scopeName + 'Auth']: state })
  }

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
  protected recheck(scopeName: ScopeNameType, successCallback?: (data?: any) => any, failCallback?: (data?: any) => any) {
    this.compare(scopeName)

    const scope = 'scope.' + scopeName

    wx.getSetting({
      success: (settingRes: any) => {
        if (settingRes.authSetting[scope]) {
          this.authStateSettle(scopeName, true)

          successCallback && successCallback(settingRes)

          return
        }

        wx.openSetting({
          success: (authRes) => {
            this.authStateSettle(scopeName, true)

            successCallback && successCallback(authRes)
          },
          fail: error => {
            this.authStateSettle(scopeName, false)

            failCallback && failCallback(error)
          }
        })
      },
      fail: settingError => {
        this.authStateSettle(scopeName, false)

        failCallback && failCallback(settingError)
      }
    })
  }

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
  protected opensetting(e: any, scopeName: ScopeNameType, successCallback?: (data?: any) => any, failCallback?: (data?: any) => any) {
    this.compare(scopeName)

    const scope = 'scope.' + scopeName

    if (e.detail.authSetting[scope]) {
      this.authStateSettle(scopeName, true)

      successCallback && successCallback('')
    } else {
      this.authStateSettle(scopeName, false)

      failCallback && failCallback('')
    }
  }

  /**
   * 检查用户授权状态，如还未授权则使用 wx.authorize 呼出授权弹框；
   *
   * 建议在调用需授权接口之前，提前向用户发起授权请求，如页面 onLoad 阶段。
   *
   * @param {string} scopeName 需要授权的 scope
   * @param {Function} successCallback 授权成功的回调函数
   * @param {Function} failCallback 授权失败的回调函数
   */
  public check(scopeName: ScopeNameType, successCallback?: (data?: any) => any, failCallback?: (data?: any) => any) {
    this.compare(scopeName)

    const scope = 'scope.' + scopeName

    wx.getSetting({
      success: (settingRes: any) => {
        if (settingRes.authSetting[scope]) {
          this.authStateSettle(scopeName, true)

          successCallback && successCallback(settingRes)

          return
        }

        wx.authorize({
          scope,
          success: (authRes) => {
            this.authStateSettle(scopeName, true)

            successCallback && successCallback(authRes)
          },
          fail: error => {
            this.authStateSettle(scopeName, false)

            failCallback && failCallback(error)
          }
        })
      },
      fail: settingError => {
        this.authStateSettle(scopeName, false)

        failCallback && failCallback(settingError)
      }
    })
  }

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
  public auth(e: any, scopeName: ScopeNameType, successCallback?: (data?: any) => any, failCallback?: (data?: any) => any) {
    if (typeof e === 'string') {
      e = null
      scopeName = e

      this.recheck(scopeName, successCallback, failCallback)

      return
    }

    let _scopeName = scopeName
    if (typeof e === 'object') {
      if (!scopeName || typeof scopeName === 'function') {
        _scopeName = e.currentTarget.dataset.scope
      }

      !e.detail.authSetting
        ? this.recheck(_scopeName, successCallback, failCallback)
        : this.opensetting(e, _scopeName, successCallback, failCallback)
    }
  }
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
const authorize:Authorize = new Authorize()

export default authorize