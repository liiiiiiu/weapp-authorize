# weapp-authorize

## weapp-authorize 不再更新，请使用 [Chafingdish](https://github.com/liiiiiiu/chafingdish)

💯 微信小程序“授权”封装

在微信小程序中使用地理位置、相册、摄像头等API前，需要调用对应的授权接口，而且在用户拒绝授权的情况下还需进行二次授权的处理；

weapp-authorize 对这些接口所需的授权逻辑进行了封装，仅需调用 `check` `auth` 两个函数即可完成复杂的授权流程。

## 安装

```bash
npm i weapp-authorize --save
```

## 使用

在 wxml 中，我们用两个按钮分别处理 “已授权” 以及 “拒绝授权” 这两种情况；

以位置授权为例：

可以通过 `userLocationAuth` 来判断是否获得了用户的授权，该变量由 weapp-authorize 生成、管理；

当用户 “拒绝授权” 后，想要再次弹出授权框，button按钮必须加上 `openType="openSetting"` 属性；

但不管用户 “已授权” 还是 “拒绝授权”，都是通过绑定 `getLocation` 自定义函数获取地理位置信息；

```html
<!-- index.html -->

<button wx:if="{{ userLocationAuth }}" bindtap="getLocation">获取地理位置</button>
<!-- 该按钮用于兼容用户拒绝授权的场景 -->
<button wx:else openType="openSetting" bindopensetting="getLocation">获取地理位置</button>
```

---

**在逻辑层中，需先调用 `check` 函数检查授权状态，然后调用 `auth` 函数处理授权逻辑；**

根据传入函数的 scope 参数，weapp-authorize 会自动生成对应的data值：

- userLocationAuth
- userLocationBackgroundAuth
- recordAuth
- cameraAuth
- ...

> scope 需和官方文档的保持一致：[scope 列表](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/authorize.html)

```javascript
// index.js
import authorize from 'weapp-authorize'

Page({
  // 一般在页面 onLoad 阶段检查授权状态
  onLoad() {
    // 检查是否已授权“地理位置”，并生成 userLocationAuth 变量提供给视图层
    authorize.check('userLocation')

    // 也可以一次性检查多个授权状态
    // 检查是否已授权“添加到相册”，并生成 writePhotosAlbumAuth 变量提供给视图层
    authorize.check('writePhotosAlbum')
  },

  // 获取地理位置
  getLocation(e: any) {
    // auth 函数会根据传入的 e 参数，处理授权相关的一系列逻辑
    authorize.auth(e, 'userLocation', () => {
      // 在授权成功后，就可以调用对应接口继续处理业务逻辑
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
      console.log('userLocation authorize failed')
    })
  },
})
```
