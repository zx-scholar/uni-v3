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
  }, {
    noCenterId: true,
  })
}

/**
 * 获取轮播图或首页数据
 */
export const getBannerList = (params) => {
  return http.get('/api/banners', params)
}

/**
 * 查询h5信息
 */
export function getAppInfo(data, callback) {
  return http.get(
    "/api/app/appInfo", {
    ...data,
  },
    callback
  );
}

//登录接口
export function appLogin(data, callback) {
  return http.post(
    "/api/user/appLogin", {
    ...data,
  },
    callback
  );
}
