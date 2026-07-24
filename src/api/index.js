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
 * 示例 API 模块
 */

// 获取轮播图或首页数据
export const getBannerList = (params) => {
  return http.get('/api/banners', params)
}

// 模拟用户登录
export const login = (data) => {
  return http.post('/api/user/login', data)
}

// 获取用户信息
export const getUserProfile = () => {
  return http.get('/api/user/profile')
}
