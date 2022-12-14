# weapp-authorize

ð¯ å¾®ä¿¡å°ç¨åºâææâå°è£

å¨å¾®ä¿¡å°ç¨åºä¸­ä½¿ç¨å°çä½ç½®ãç¸åãæåå¤´ç­APIåï¼éè¦è°ç¨å¯¹åºçæææ¥å£ï¼èä¸å¨ç¨æ·æç»ææçæåµä¸è¿éè¿è¡äºæ¬¡ææçå¤çï¼

weapp-authorize å¯¹è¿äºæ¥å£æéçææé»è¾è¿è¡äºå°è£ï¼ä»éè°ç¨ `check` `auth` ä¸¤ä¸ªå½æ°å³å¯å®æå¤æçæææµç¨ã

## å®è£

```bash
npm i weapp-authorize --save
```

## ä½¿ç¨

å¨ wxml ä¸­ï¼æä»¬ç¨ä¸¤ä¸ªæé®åå«å¤ç âå·²ææâ ä»¥å âæç»ææâ è¿ä¸¤ç§æåµï¼

ä»¥ä½ç½®ææä¸ºä¾ï¼

å¯ä»¥éè¿ `userLocationAuth` æ¥å¤æ­æ¯å¦è·å¾äºç¨æ·çææï¼è¯¥åéç± weapp-authorize çæãç®¡çï¼

å½ç¨æ· âæç»ææâ åï¼æ³è¦åæ¬¡å¼¹åºæææ¡ï¼buttonæé®å¿é¡»å ä¸ `openType="openSetting"` å±æ§ï¼

ä½ä¸ç®¡ç¨æ· âå·²ææâ è¿æ¯ âæç»ææâï¼é½æ¯éè¿ç»å® `getLocation` èªå®ä¹å½æ°è·åå°çä½ç½®ä¿¡æ¯ï¼

```html
<!-- index.html -->

<button wx:if="{{ userLocationAuth }}" bindtap="getLocation">è·åå°çä½ç½®</button>
<!-- è¯¥æé®ç¨äºå¼å®¹ç¨æ·æç»ææçåºæ¯ -->
<button wx:else openType="openSetting" bindopensetting="getLocation">è·åå°çä½ç½®</button>
```

---

**å¨é»è¾å±ä¸­ï¼éåè°ç¨ `check` å½æ°æ£æ¥ææç¶æï¼ç¶åè°ç¨ `auth` å½æ°å¤çææé»è¾ï¼**

æ ¹æ®ä¼ å¥å½æ°ç scope åæ°ï¼weapp-authorize ä¼èªå¨çæå¯¹åºçdataå¼ï¼

- userLocationAuth
- userLocationBackgroundAuth
- recordAuth
- cameraAuth
- ...

> scope éåå®æ¹ææ¡£çä¿æä¸è´ï¼[scope åè¡¨](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/authorize.html)

```javascript
// index.js
import authorize from 'weapp-authorize'

Page({
  // ä¸è¬å¨é¡µé¢ onLoad é¶æ®µæ£æ¥ææç¶æ
  onLoad() {
    // æ£æ¥æ¯å¦å·²ææâå°çä½ç½®âï¼å¹¶çæ userLocationAuth åéæä¾ç»è§å¾å±
    authorize.check('userLocation')

    // ä¹å¯ä»¥ä¸æ¬¡æ§æ£æ¥å¤ä¸ªææç¶æ
    // æ£æ¥æ¯å¦å·²ææâæ·»å å°ç¸åâï¼å¹¶çæ writePhotosAlbumAuth åéæä¾ç»è§å¾å±
    authorize.check('writePhotosAlbum')
  },

  // è·åå°çä½ç½®
  getLocation(e: any) {
    // auth å½æ°ä¼æ ¹æ®ä¼ å¥ç e åæ°ï¼å¤çææç¸å³çä¸ç³»åé»è¾
    authorize.auth(e, 'userLocation', () => {
      // å¨æææååï¼å°±å¯ä»¥è°ç¨å¯¹åºæ¥å£ç»§ç»­å¤çä¸å¡é»è¾
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
