class Authorize {
  constructor() {
    this.scopeNames = [
      "userLocation",
      "userLocationBackground",
      "record",
      "camera",
      "bluetooth",
      "writePhotosAlbum",
      "addPhoneContact",
      "addPhoneCalendar",
      "werun"
    ];
    this.init();
  }
  get page() {
    const pages = getCurrentPages();
    return pages[pages.length - 1];
  }
  init() {
    this.scopeMap = Array.from({ length: this.scopeNames.length }, () => []);
    Array.from(this.scopeNames, (scopeName, index) => {
      this.scopeMap[index] = this.genCharCode(scopeName);
    });
  }
  genCharCode(value) {
    if (!value)
      return [];
    const tempArr = Array.from({ length: 26 }, () => 0);
    let i = -1;
    while (++i < value.length) {
      tempArr[value[i].toLowerCase().charCodeAt(0) - "a".charCodeAt(0)] += 1;
    }
    return tempArr;
  }
  compare(value) {
    if (!value) {
      throw Error(`scope "${value ? value : ""}" not found, do you mean "${this.scopeNames[0]}"?`);
    }
    if (this.scopeNames.includes(value))
      return;
    let vCharCode = this.genCharCode(value), dif = 0, minDif = 0, nearest = "";
    Array.from(this.scopeMap, (charCode, index) => {
      dif = 0;
      for (let i = 0; i < 26; i++) {
        dif += Math.abs(charCode[i] - vCharCode[i]);
      }
      let illegal = value.match(/[^a-zA-Z]*/g);
      if (illegal && illegal.length) {
        dif += illegal.join("").length;
      }
      minDif = !minDif ? dif : Math.min(dif, minDif);
      nearest = Math.min(dif, minDif) === dif ? this.scopeNames[index] : nearest;
      console.log("compare", value, this.scopeNames[index], dif, minDif, nearest);
    });
    throw Error(`scope "${value}" not found, do you mean "${nearest}"?`);
  }
  authStateSettle(scopeName, state) {
    this.page.setData({ [scopeName + "Auth"]: state });
  }
  recheck(scopeName, successCallback, failCallback) {
    this.compare(scopeName);
    const scope = "scope." + scopeName;
    wx.getSetting({
      success: (settingRes) => {
        if (settingRes.authSetting[scope]) {
          this.authStateSettle(scopeName, true);
          successCallback && successCallback(settingRes);
          return;
        }
        wx.openSetting({
          success: (authRes) => {
            this.authStateSettle(scopeName, true);
            successCallback && successCallback(authRes);
          },
          fail: (error) => {
            this.authStateSettle(scopeName, false);
            failCallback && failCallback(error);
          }
        });
      },
      fail: (settingError) => {
        this.authStateSettle(scopeName, false);
        failCallback && failCallback(settingError);
      }
    });
  }
  opensetting(e, scopeName, successCallback, failCallback) {
    this.compare(scopeName);
    const scope = "scope." + scopeName;
    if (e.detail.authSetting[scope]) {
      this.authStateSettle(scopeName, true);
      successCallback && successCallback("");
    } else {
      this.authStateSettle(scopeName, false);
      failCallback && failCallback("");
    }
  }
  check(scopeName, successCallback, failCallback) {
    this.compare(scopeName);
    const scope = "scope." + scopeName;
    wx.getSetting({
      success: (settingRes) => {
        if (settingRes.authSetting[scope]) {
          this.authStateSettle(scopeName, true);
          successCallback && successCallback(settingRes);
          return;
        }
        wx.authorize({
          scope,
          success: (authRes) => {
            this.authStateSettle(scopeName, true);
            successCallback && successCallback(authRes);
          },
          fail: (error) => {
            this.authStateSettle(scopeName, false);
            failCallback && failCallback(error);
          }
        });
      },
      fail: (settingError) => {
        this.authStateSettle(scopeName, false);
        failCallback && failCallback(settingError);
      }
    });
  }
  auth(e, scopeName, successCallback, failCallback) {
    if (typeof e === "string") {
      e = null;
      scopeName = e;
      this.recheck(scopeName, successCallback, failCallback);
      return;
    }
    let _scopeName = scopeName;
    if (typeof e === "object") {
      if (!scopeName || typeof scopeName === "function") {
        _scopeName = e.currentTarget.dataset.scope;
      }
      !e.detail.authSetting ? this.recheck(_scopeName, successCallback, failCallback) : this.opensetting(e, _scopeName, successCallback, failCallback);
    }
  }
}
const authorize = new Authorize();
export { authorize as default };
