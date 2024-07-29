# Weapp Authorize

🌞 微信小程序“授权”封装

在微信小程序中使用地理位置、相册、摄像头等十多种API前，需要用户选择对 scope 来进行授权，当授权给一个 scope 之后，其对应的所有接口都可以直接使用，而在用户拒绝授权的情况下还需进行二次授权的处理；在开发时对这些授权的处理以及兼容无疑是非常麻烦的；

weapp-authorize 对这些接口进行了封装，仅需调用 `check` `auth` 两个函数即可实现所有授权接口的逻辑

[代码片段](https://developers.weixin.qq.com/s/UeK3qWmk7NSb)

> 更多微信小程序开发工具，查看 [微信小程序开发全家桶](https://www.liiiiiiu.com/dev/weapp-dev-bucket)

## 安装

```bash
npm i weapp-authorize
```

## 使用

使用前需要先了解微信小程序 [授权](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/authorize.html) 机制

> 在小程序中使用npm包前，需先[构建 npm](https://developers.weixin.qq.com/miniprogram/dev/devtools/npm.html)

### 视图层

```html
<!-- index.wxml -->

<!-- 以位置授权为例
放置两个按钮处理 “已授权” 以及 “拒绝授权” 两种情况；
你可以通过 `userLocationAuth` 来判断是否获得了用户的授权，该变量由 weapp-authorize 自动生成并管理 -->
<button wx:if="{{ userLocationAuth }}" bindtap="getLocation">获取地理位置</button>
<!-- 当用户 “拒绝授权” 后，想要再次弹出授权框，button按钮必须加上 `openType="openSetting"` 属性 -->
<button wx:else openType="openSetting" bindopensetting="getLocation">获取地理位置</button>
```

### 逻辑层

```javascript
// index.js
import authorize from 'weapp-authorize'
// const authorize = require('../path/to/weapp-authorize')

Page({
  onLoad() {
    // 在页面加载阶段，可以调用 check 函数提前向用户发起授权请求；
    // 该 scope 用于检查是否已授权【地理位置】权限
    authorize.check('userLocation', () => {
      // 如果用户未接受或拒绝过此权限，会弹窗询问用户，用户点击同意后方可调用接口；
      // 如果用户已授权，可以直接调用接口
      wx.getLocation({
        type: 'wgs84',
        success: res => {
          // ...
        },
      })
    }, () => {
      // 如果用户已拒绝授权，则不会出现弹窗，而是直接进入接口 fail 回调
    })

    // 也可以继续检查其他 scope 的授权状态
    authorize.check('writePhotosAlbum')
  },

  // 在发生用户点击交互时，需调用 auth 函数
  getLocation(e: any) {
    // auth 函数需接收点击按钮的 event 参数；
    // auth 函数兼容了用户拒绝授权的场景
    authorize.auth(e, 'userLocation', () => {
      wx.getLocation({
        type: 'wgs84',
        success: res => {
          const { latitude, longitude } = res
          wx.chooseLocation({
            latitude: latitude,
            longitude: longitude,
            success: r => {
              console.log(r)
            }
          })
        },
      })
    }, () => {
      // 授权失败的回调函数
      console.log('userLocation authorize failed')
    })
  },
})
```

## 注意事项

> 调用 check 与 auth 函数都需要传入 scope 参数，传入的 scope 需和官方文档的保持一致：[scope 列表](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/authorize.html)

根据传入函数的 scope 参数，weapp-authorize 会生成对应的data值提供给开发者，以此来判断用户对该 scope 的授权状态：

- userLocationAuth
- userLocationBackgroundAuth
- recordAuth
- cameraAuth
- ...

> 使用定位等接口时，需要在 app.json 中配置 `permission` `requiredPrivateInfos` 等字段
