import { useAppStore } from '@/stores/app';
import { useUserStore } from '@/stores/user';
import { loginByWechatCode, queryUserinfoByUnionId } from '@/api';

/**
 * 小程序初始化时执行静默登录，获取微信用户信息
 *
 * 流程：
 *   1. uni.login() 获取微信临时 code
 *   2. 缓存中有 openId？ → 直接复用 / 否则调接口换取
 *   3. 缓存中有 netUser？ → 直接更新 store / 否则调接口查询
 *
 * @returns {Promise<object|null>} netUser 用户信息对象，失败返回 null
 */
export default async function login() {
  const appStore = useAppStore();
  const userStore = useUserStore();

  // 前置检查：小程序信息必须已就绪
  if (!appStore.miniAppInfo?.id) {
    console.warn('[login] appInfo 未就绪，跳过登录');
    return null;
  }

  // #ifdef H5
  // H5 端仅开发环境使用 Mock 用户（生产构建 import.meta.env.DEV 为 false，走真实登录流程）
  if (import.meta.env.DEV) {
    return h5MockLogin(userStore);
  }
  // #endif

  try {
    // ======================== 1. 获取微信临时登录凭证 ========================
    const wxLoginRes = await uni.login();
    if (!wxLoginRes.code) {
      console.error('[login] uni.login 失败', wxLoginRes);
      return null;
    }

    // ======================== 2. 获取 / 从缓存读取 openId / unionId ========================
    let { openId, unionId } = userStore;

    if (!openId) {
      const loginRes = await loginByWechatCode({
        code: wxLoginRes.code,
        wechatMiniAppId: appStore.miniAppInfo.id,
      });

      openId = loginRes.openId;
      unionId = loginRes.unionId;

      // 更新 Pinia store（持久化自动写入 Storage）
      userStore.setWechatSession({ openId, unionId });
    }

    // ======================== 3. 获取用户详情（缓存命中则跳过请求） ========================
    if (userStore.isLoggedIn) {
      return userStore.userInfo;
    }

    const { netUser = {} } = await queryUserinfoByUnionId(openId, unionId || '', appStore.centerId);

    if (!netUser?.netUserId) {
      console.warn('[login] 未查询到用户信息', netUser);
      return netUser;
    }

    // 写入 store（accessToken 等自动持久化，netUser 会话级）
    userStore.setLoginResult(netUser);
    userStore.setNetUserId(netUser.netUserId);
    userStore.setUserInfo({ ...netUser, avatarUrl: netUser.avatar });

    return netUser;
  } catch (error) {
    console.error('[login] 登录异常:', error);
    return null;
  }
}

/** H5 环境：使用默认测试用户数据，绕过 wx.login */
// #ifdef H5
function h5MockLogin(userStore) {
  console.log('h5环境');
  const DEFAULT_USER = {
    avatar: "http://xports-test.oss-cn-hangzhou.aliyuncs.com/dev/center/10000000/venueImage/00f1b345a4d644b4a088b862d8d847b4.png",
    centerId: 10000000,
    createTime: "2024-01-16 14:12:49",
    gender: "0",
    mobileNum: "18251852533",
    name: "18251852533",
    netUserId: 2024011600001334,
    nickName: "%E5%BE%AE%E4%BF%A1%E7%94%A8%E6%88%B7112",
    status: "1",
    token: "88093e4c626180d8d0dbf0ad71b05d47",
    tokenTime: "2024-01-16 14:12:49",
    updateTime: "2024-01-16 14:12:49"
  };

  userStore.setLoginResult(DEFAULT_USER);
  userStore.setNetUserId(DEFAULT_USER.netUserId);
  userStore.setUserInfo({ ...DEFAULT_USER, avatarUrl: '' });
  console.log('[login] H5 模式使用默认测试用户:', DEFAULT_USER.netUserId);
  return DEFAULT_USER;
}
// #endif
