// index.ts
import authorize from '../../weapp-authorize'

Page({
  data: {
  },

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
