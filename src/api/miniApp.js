import http from '@/utils/request'
import wechatParam from '@/config/appConfig'

/**
 * 查询小程序信息
 */
export const queryMiniAppInfo = (data = {}) => {
  return http.get('/api/miniApp/queryMiniAppInfo', {
    miniAppType: 'wechat',
    appId: wechatParam.appid,
    ...data
  })
}

/**
 * 获取轮播图或首页数据
 */
export const getBannerList = (params) => {
  return http.get('/api/banners', params)
}
