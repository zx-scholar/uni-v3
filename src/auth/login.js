import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'
import { loginByWechatCode, queryUserinfoByUnionId } from '@/api'

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
  const appStore = useAppStore()
  const userStore = useUserStore()

  // 前置检查：小程序信息必须已就绪
  if (!appStore.miniAppInfo?.id) {
    console.warn('[login] appInfo 未就绪，跳过登录')
    return null
  }

  try {
    // ======================== 1. 获取微信临时登录凭证 ========================
    const wxLoginRes = await uni.login()
    if (!wxLoginRes.code) {
      console.error('[login] uni.login 失败', wxLoginRes)
      return null
    }

    // ======================== 2. 获取 / 从缓存读取 openId / unionId ========================
    let { openId, unionId } = userStore

    if (!openId) {
      const loginRes = await loginByWechatCode({
        code: wxLoginRes.code,
        wechatMiniAppId: appStore.miniAppInfo.id,
      })

      openId = loginRes.openId
      unionId = loginRes.unionId

      // 更新 Pinia store（持久化自动写入 Storage）
      userStore.setWechatSession({ openId, unionId })
    }

    // ======================== 3. 获取用户详情（缓存命中则跳过请求） ========================
    if (userStore.hasUserInfo) {
      return userStore.userInfo
    }

    const { netUser = {} } = await queryUserinfoByUnionId(
      openId,
      unionId || '',
      appStore.centerId,
    )

    if (!netUser?.netUserId) {
      console.warn('[login] 未查询到用户信息', netUser)
      return netUser
    }

    // 写入 store（accessToken 等自动持久化，netUser 会话级）
    userStore.setLoginResult(netUser)
    userStore.setNetUserId(netUser.netUserId)
    userStore.setUserInfo({ ...netUser, avatarUrl: netUser.avatar })

    return netUser
  } catch (error) {
    console.error('[login] 登录异常:', error)
    return null
  }
}
