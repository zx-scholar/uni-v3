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

// 使用微信登录凭证换取 openId / unionId
export const loginByWechatCode = (data) => {
  return http.post('/yacht/mini/login', data)
}

// 发送登录短信验证码
export const sendLoginVerifyCode = (data) => {
  return http.get('/api/miniApp/user/sendLoginVerifyCode', data)
}

// 通过微信手机号授权信息或短信验证码绑定用户
export const bindMiniAppUser = (data) => {
  return http.post('/api/miniApp/user/bind', data, { selfHandleError: true })
}

// 上传微信头像
export const uploadUserAvatar = (filePath) => {
  return http.upload('/api/common/uploadFile', filePath, {
    path: 'gameImage',
    enctype: 'multipart/form-data'
  })
}

// 获取用户信息
export const getUserProfile = () => {
  return http.get('/api/user/profile')
}
