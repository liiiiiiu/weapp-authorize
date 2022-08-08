# weapp-authorize

💯 微信小程序“授权”封装

在微信小程序中使用地理位置、相册、摄像头等API前，需要调用对应的授权接口，而且在用户拒绝授权的情况下还需进行二次授权的处理；

weapp-authorize 对这些接口所需的授权逻辑进行了封装，仅需调用 `check` `auth` 两个函数即可完成复杂的授权流程。

## 安装

```bash
npm i weapp-authorize --save
```

## 使用

```javascript
// index.js
import authorize from 'weapp-authorize'

Page({
  onLoad() {
    // 检查是否已授权“地理位置”
    authorize.check('userLocation')

    // 可以一次性检查多个授权状态
    // 检查是否已授权“添加到相册”
    // authorize.check('writePhotosAlbum')
  },

  // 获取地理位置
  getLocation(e: any) {
    authorize.auth(e, 'userLocation', () => {
      console.log('userLocation authorize successful')
      // 获得授权后的回调
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

根据传入 `check` `auth` 函数内的 scope 参数，Authorize会自动生成对应的data值：

- userLocationAuth
- userLocationBackgroundAuth
- recordAuth
- cameraAuth
- ...

视图层可使用对应data作为条件判断渲染不同的节点。

```html
<!-- index.html -->

<!-- userLocationAuth 状态由Authorize类生成、管理 -->
<button wx:if="{{ userLocationAuth }}" bindtap="getLocation">获取地理位置</button>
<!-- 该按钮用于兼容用户拒绝授权的场景 -->
<button wx:else openType="openSetting" bindopensetting="getLocation">获取地理位置</button>
```
