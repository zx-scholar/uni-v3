import { useAppStore } from '@/stores/app'
import { queryMiniAppInfo } from '@/api'
import login from '@/auth/login'

/**
 * 小程序启动初始化（App.onLaunch 时调用）
 *
 * 执行顺序：
 *   1. 获取小程序基础信息（场馆配置、主题等）
 *   2. 静默登录 + 获取用户信息
 */
export default async function initialize() {
  // ======================== 1. 获取小程序基础信息 ========================
  let data
  try {
    data = await queryMiniAppInfo()
  } catch (err) {
    console.error('[initialize] queryMiniAppInfo 失败', err)
    return
  }

  if (!data?.miniApp) {
    console.warn('[initialize] 未获取到小程序信息')
    return
  }

  const appStore = useAppStore()
  appStore.setMiniAppInfo(data.miniApp)

  // ======================== 2. 静默登录 & 获取用户信息 ========================
  await login()
}
