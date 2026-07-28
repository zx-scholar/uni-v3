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
 * 使用微信登录凭证换取 openId / unionId
 * POST /yacht/mini/login
 */
export const loginByWechatCode = (data) => {
  return http.post('/yacht/mini/login', data)
}

/**
 * 通过 unionId 查询用户完整信息
 * GET /yacht/query-userinfo-by-union-id
 */
export const queryUserinfoByUnionId = (openId, unionId, centerId) => {
  return http.get('/yacht/query-userinfo-by-union-id', {
    openId,
    unionId: unionId || '',
    centerId,
    miniAppType: 'wechat',
  }, { loading: false })
}

/**
 * 获取用户个人资料
 */
export const getUserProfile = () => {
  return http.get('/api/user/profile')
}

// ========== 以下为原有 API，保持不变 ==========

// 获取轮播图或首页数据
export const getBannerList = (params) => {
  return http.get('/api/banners', params)
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
    path: 'gameImage'
  })
}

// 通用文件上传
export const uploadFile = (filePath, data = {}) => {
  return http.upload('/api/common/uploadFile', filePath, {
    path: 'gameImage',
    ...data
  })
}
