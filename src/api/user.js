import http from '@/utils/request';
import wechatParam from '@/config/appConfig';

/**
 * 使用微信登录凭证换取 openId / unionId
 * POST /yacht/mini/login
 */
export const loginByWechatCode = data => {
  return http.post('/yacht/mini/login', data);
};

/**
 * 通过 openId 查询小程序用户信息（静默登录用）
 * GET /api/miniApp/user/queryUserByOpenId
 *
 * ⚠️ 该接口「查不到用户」时同样返回 { error: 0 }，只是没有用户数据。
 *    所以不能靠 error 判定成败，必须校验返回体里是否真的有用户对象，
 *    否则会把「未注册」当成「已登录」，得到 isLoggedIn 为 true 但资料全空的状态。
 *
 * @param {object} params { openId, miniAppId, centerId }
 */
export const queryUserByOpenId = (params = {}) => {
  return http.get(
    '/api/miniApp/user/queryUserByOpenId',
    {
      miniAppType: 'wechat',
      ...params
    },
    { loading: false }
  );
};

/**
 * 获取用户个人资料
 */
export const getUserProfile = () => {
  return http.get('/api/user/profile');
};

/**
 * 发送登录短信验证码
 */
export const sendLoginVerifyCode = data => {
  return http.get('/api/miniApp/user/sendLoginVerifyCode', data);
};

/**
 * 通过微信手机号授权信息或短信验证码绑定用户
 */
export const bindMiniAppUser = data => {
  return http.post('/api/miniApp/user/bind', data, { selfHandleError: true });
};

/**
 * 解绑小程序用户（退出登录）
 * GET /api/miniApp/user/unbind
 * @param {object} params { netUserId, miniAppId, miniAppType, openId }
 */
export const unbindMiniAppUser = params => {
  return http.get('/api/miniApp/user/unbind', params);
};

/* ==================================================================
 * H5 端登录（与小程序端登录链路完全独立）
 *
 * ⚠️ 以下两个接口路径为占位，接入 H5 时替换为实际接口即可，
 *    页面层 src/pages-common/loginH5/index.vue 无需改动。
 * ================================================================== */

/**
 * H5 端发送登录短信验证码
 */
export const h5SendLoginVerifyCode = data => {
  return http.post('/TODO/h5/user/sendLoginVerifyCode', data);
};

/**
 * H5 端登录（手机号 + 验证码）
 */
export const h5Login = data => {
  return http.post('/TODO/h5/user/login', data);
};
