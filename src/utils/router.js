/**
 * 页面路由别名字典与导航封装 (已配置主包与分包映射)
 *
 * 约定:
 *  - routes 中 tab: true 表示 tabBar 页面: push 会自动降级为 switchTab
 *  - 参数传递: 对象/数组等复杂值会自动 JSON 序列化并带 'j:' 前缀,
 *    页面 onLoad 请用 parseParams() 还原; 普通字符串保持原样
 *  - push 内置 300ms 防连点与失败降级 (navigateTo -> redirectTo),
 *    页面栈接近上限 (10 层) 时自动改用 redirectTo
 */

// 路由配置: 新增页面时同步维护 src/utils/routes.js 与 pages.json
import { routes } from '@/utils/routes'

export { routes }

const tabPaths = new Set(
  Object.values(routes)
    .filter((route) => route.tab)
    .map((route) => route.path)
)

/** 复杂参数前缀: onLoad 收到 'j:...' 时用 parseParams 还原为原值 */
const JSON_PREFIX = 'j:'

/** 防连点窗口 (仅 push) */
const NAV_COOLDOWN = 300

/** uni-app 页面栈最大层数 */
const MAX_PAGE_STACK = 10

let lastNavTime = 0

/** 解析别名或原始路径 -> 路由配置 (未找到返回 null) */
function resolveRoute(nameOrPath) {
  if (typeof nameOrPath !== 'string') return null
  return routes[nameOrPath] || routes[nameOrPath.toLowerCase()] || null
}

/** 解析别名或原始路径 -> 页面绝对路径 (不含 query) */
function resolvePath(nameOrPath) {
  const route = resolveRoute(nameOrPath)
  if (route) return route.path
  if (typeof nameOrPath === 'string' && nameOrPath.startsWith('/')) {
    return nameOrPath.split('?')[0]
  }
  return null
}

/** 判断别名/路径是否为 tabBar 页面 */
export function isTabPage(nameOrPath) {
  const path = resolvePath(nameOrPath)
  return !!path && tabPaths.has(path)
}

/** 编码单个参数值: 复杂值 JSON 序列化 + 'j:' 前缀, 其余原样字符串化 */
function encodeParamValue(value) {
  if (value === undefined || value === null) return ''
  if (typeof value === 'object') {
    return JSON_PREFIX + encodeURIComponent(JSON.stringify(value))
  }
  return String(value)
}

/** 将对象格式的 params 自动格式化为 URL Query 字符串 */
function buildQueryString(params = {}) {
  const keys = Object.keys(params)
  if (!keys.length) return ''
  const queryStr = keys
    .map((key) => {
      const val = encodeParamValue(params[key])
      return `${encodeURIComponent(key)}=${encodeURIComponent(val)}`
    })
    .join('&')
  return `?${queryStr}`
}

/**
 * 还原 onLoad 收到的路由参数 (uni 已自动解码一次):
 *  - 'j:' 前缀的值会尝试 JSON.parse 还原为对象/数组
 *  - 其余值原样返回
 * 示例: onLoad(options) { const params = parseParams(options) }
 */
export function parseParams(options = {}) {
  const result = {}
  Object.keys(options).forEach((key) => {
    const raw = options[key]
    if (typeof raw === 'string' && raw.startsWith(JSON_PREFIX)) {
      const body = raw.slice(JSON_PREFIX.length)
      try {
        result[key] = JSON.parse(body)
        return
      } catch (error) {
        try {
          result[key] = JSON.parse(decodeURIComponent(body))
          return
        } catch (error2) {
          // 解析失败按普通字符串处理
        }
      }
    }
    result[key] = raw
  })
  return result
}

/**
 * 获取当前页面完整 URL (路径 + query),
 * 用于 401 登录失效时记录来源页、登录成功后跳回
 */
export function getCurrentPageUrl() {
  const pages = getCurrentPages()
  const current = pages[pages.length - 1]
  if (!current) return ''
  const route = `/${current.route || ''}`
  return route + buildQueryString(current.options || {})
}

/** 基础跳转封装 (不做任何降级) */
function doNavigate(fn, url, description) {
  return new Promise((resolve, reject) => {
    fn({
      url,
      success: resolve,
      fail: (err) => {
        console.error(`[router] ${description} 失败:`, err)
        reject(err)
      },
    })
  })
}

/** push 专用: navigateTo 失败时自动降级为 redirectTo */
function openPage(url, description) {
  return new Promise((resolve, reject) => {
    uni.navigateTo({
      url,
      success: resolve,
      fail: (err) => {
        console.warn(`[router] ${description} 失败, 自动降级为 redirectTo:`, err)
        uni.redirectTo({
          url,
          success: resolve,
          fail: (fallbackErr) => {
            console.error(`[router] ${description} 降级跳转仍然失败:`, fallbackErr)
            reject(fallbackErr)
          },
        })
      },
    })
  })
}

/** 页面栈深度是否接近上限 (push 前判断, 避免 navigateTo 失败) */
function isStackAlmostFull() {
  try {
    return getCurrentPages().length >= MAX_PAGE_STACK
  } catch (error) {
    return false
  }
}

/** 防连点: NAV_COOLDOWN 内仅允许一次 push */
function checkCooldown() {
  const now = Date.now()
  if (now - lastNavTime < NAV_COOLDOWN) {
    console.warn(`[router] 跳转过于频繁 (${NAV_COOLDOWN}ms 内), 已忽略本次 push`)
    return false
  }
  lastNavTime = now
  return true
}

/**
 * 优雅的 Router 工具对象
 */
export const router = {
  /**
   * 普通跳转 (对应 uni.navigateTo, 主包/分包均支持)
   *  - 目标是 tabBar 页面时自动降级为 switchTab
   *  - 页面栈接近上限时自动降级为 redirectTo
   *  - 内置 300ms 防连点
   * 示例: router.push('login') / router.push('demo', { id: 1 })
   *      / router.push('demo', { filter: { page: 1, size: 10 } })
   */
  push(nameOrPath, params = {}) {
    const path = resolvePath(nameOrPath)
    if (!path) {
      const message = `[router] 未找到路由: ${nameOrPath}`
      console.error(message)
      return Promise.reject(new Error(message))
    }
    if (!checkCooldown()) {
      return Promise.resolve(false)
    }
    if (isTabPage(path)) {
      if (Object.keys(params || {}).length) {
        console.warn(`[router] ${path} 是 tabBar 页面, 携带的参数会被忽略: ${JSON.stringify(params)}`)
      }
      return doNavigate(uni.switchTab, path, `switchTab(${path})`)
    }
    const url = path + buildQueryString(params)
    if (isStackAlmostFull()) {
      console.warn(`[router] 页面栈接近上限, push(${path}) 降级为 redirectTo`)
      return doNavigate(uni.redirectTo, url, `redirectTo(${url})`)
    }
    return openPage(url, `push(${url})`)
  },

  /**
   * 重定向跳转 (对应 uni.redirectTo, 替换当前页, 保留页面栈)
   *  - 目标是 tabBar 页面时改用 reLaunch (redirectTo 无法打开 tab 页)
   */
  replace(nameOrPath, params = {}) {
    const path = resolvePath(nameOrPath)
    if (!path) {
      const message = `[router] 未找到路由: ${nameOrPath}`
      console.error(message)
      return Promise.reject(new Error(message))
    }
    const url = path + buildQueryString(params)
    if (isTabPage(path)) {
      console.warn(`[router] ${path} 是 tabBar 页面, replace 降级为 reLaunch`)
      return doNavigate(uni.reLaunch, url, `reLaunch(${url})`)
    }
    return doNavigate(uni.redirectTo, url, `redirectTo(${url})`)
  },

  /**
   * 重新加载打开页面 (对应 uni.reLaunch, 清空页面栈)
   */
  reLaunch(nameOrPath, params = {}) {
    const path = resolvePath(nameOrPath)
    if (!path) {
      const message = `[router] 未找到路由: ${nameOrPath}`
      console.error(message)
      return Promise.reject(new Error(message))
    }
    return doNavigate(uni.reLaunch, path + buildQueryString(params), `reLaunch(${path})`)
  },

  /**
   * Tab 切换 (对应 uni.switchTab, 不支持携带参数)
   */
  switchTab(nameOrPath, params = {}) {
    const path = resolvePath(nameOrPath)
    if (!path) {
      const message = `[router] 未找到路由: ${nameOrPath}`
      console.error(message)
      return Promise.reject(new Error(message))
    }
    const paramKeys = Object.keys(params || {})
    if (paramKeys.length) {
      console.warn(`[router] switchTab 不支持携带参数, 已忽略: ${JSON.stringify(params)}`)
    }
    if (!isTabPage(path)) {
      console.warn(`[router] ${path} 不是 tabBar 页面, switchTab 可能失败`)
    }
    return doNavigate(uni.switchTab, path, `switchTab(${path})`)
  },

  /**
   * 返回上一页 (对应 uni.navigateBack)
   *  - 页面栈仅剩 1 层(或为空)时无法返回, 直接回首页
   *  - 失败时同样兜底回首页
   */
  back(delta = 1) {
    return new Promise((resolve) => {
      let stackLength = 0
      try {
        stackLength = getCurrentPages().length
      } catch (error) {
        stackLength = 0
      }

      const backToHome = () =>
        doNavigate(uni.switchTab, routes.home.path, `switchTab(${routes.home.path})`)
          .then(resolve)
          .catch(resolve)

      if (stackLength <= 1) {
        backToHome()
        return
      }
      uni.navigateBack({
        delta,
        success: resolve,
        fail: () => {
          console.warn('[router] navigateBack 失败, 返回首页')
          backToHome()
        },
      })
    })
  },
}

export default router