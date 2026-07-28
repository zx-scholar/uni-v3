/**
 * 页面路由别名字典与导航封装 (已配置主包与分包映射)
 */

// 页面名称/别名 -> 绝对路径 映射字典
export const routes = {
  // === 主包页面 ===
  home: '/pages/index/index',
  mine: '/pages/mine/mine',
  login: '/pages/login/login',
  profile: '/pages/profile/profile',
  template: '/pages/template/template',
  uploadImage: '/pages/uploadImage/uploadImage',

  // === 功能分包页面 ===
  demo: '/page-golf/demo/demo',
  browsingHistory: '/page-golf/browsingHistory/browsingHistory',
  eventsPlan: '/page-golf/eventsPlan/eventsPlan'
}

/**
 * 辅助函数：将对象格式的 params 自动格式化为 URL Query 字符串
 */
function buildQueryString(params = {}) {
  const keys = Object.keys(params)
  if (!keys.length) return ''
  const queryStr = keys
    .map((key) => {
      const val = params[key]
      return `${encodeURIComponent(key)}=${encodeURIComponent(val !== undefined && val !== null ? val : '')}`
    })
    .join('&')
  return `?${queryStr}`
}

/**
 * 获取目标的完整 URL（支持别名或直接路径）
 */
function resolveUrl(nameOrPath, params = {}) {
  const targetPath = routes[nameOrPath] || routes[nameOrPath.toLowerCase()] || nameOrPath
  return targetPath + buildQueryString(params)
}

/**
 * 优雅的 Router 工具对象
 */
export const router = {
  /**
   * 普通跳转 (对应 uni.navigateTo，主包/分包均支持)
   * 示例：router.push('login') 或 router.push('demo', { id: 1 })
   */
  push(nameOrPath, params = {}) {
    return new Promise((resolve, reject) => {
      uni.navigateTo({
        url: resolveUrl(nameOrPath, params),
        success: resolve,
        fail: (err) => {
          console.error('路由跳转失败:', err)
          reject(err)
        }
      })
    })
  },

  /**
   * 重定向跳转 (对应 uni.redirectTo)
   */
  replace(nameOrPath, params = {}) {
    return new Promise((resolve, reject) => {
      uni.redirectTo({
        url: resolveUrl(nameOrPath, params),
        success: resolve,
        fail: reject
      })
    })
  },

  /**
   * 重新加载打开页面 (对应 uni.reLaunch)
   */
  reLaunch(nameOrPath, params = {}) {
    return new Promise((resolve, reject) => {
      uni.reLaunch({
        url: resolveUrl(nameOrPath, params),
        success: resolve,
        fail: reject
      })
    })
  },

  /**
   * Tab 切换 (对应 uni.switchTab)
   */
  switchTab(nameOrPath) {
    return new Promise((resolve, reject) => {
      uni.switchTab({
        url: resolveUrl(nameOrPath),
        success: resolve,
        fail: reject
      })
    })
  },

  /**
   * 返回上一页 (对应 uni.navigateBack)
   */
  back(delta = 1) {
    return new Promise((resolve) => {
      uni.navigateBack({
        delta,
        success: resolve,
        fail: () => {
          router.reLaunch('home').then(resolve)
        }
      })
    })
  }
}

export default router
