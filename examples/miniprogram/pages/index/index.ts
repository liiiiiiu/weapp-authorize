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

  // 获取用户的位置信息
  getUserLocation(e: any) {
    authorize.auth(e, 'userLocation', () => {
      console.log('userLocation authorize successful')
    }, () => {
      console.log('userLocation authorize failed')
    })
  },
})
