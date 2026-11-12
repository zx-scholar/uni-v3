/**
 * 微信原生能力桥接层（WeChat Native Bridge）
 *
 * 为什么需要它：
 *   uni-app 只把常用能力封装进 uni.xxx，微信后续新增的官方接口往往还没有 uni 版本。
 *   但编译到 mp-weixin 后产物就是标准小程序包，wx 全局对象完整存在，
 *   因此「最新接口」可以直接调 wx.xxx —— 既不用等框架适配，也不用换技术栈。
 *
 * 本层解决三件事：
 *   1. 条件编译隔离：H5 / App 端产物里不残留 wx 引用，避免运行时 "wx is not defined"
 *   2. 能力检测：基础库版本 + wx.canIUse 双重判断，不支持时给出明确的降级信号
 *   3. Promise 化 + 统一错误：把 success / fail 回调收敛成 Promise，便于 async/await
 *
 * 使用约束：
 *   - 只在「微信端独有能力」上使用；通用能力仍优先用 uni.xxx（保证多端一致）
 *   - 调用方必须自己处理"不支持"的分支，见 callWithFallback 的 fallback 参数
 */

/** 是否为微信小程序运行时（H5 / App 端恒为 false） */
let isWxNative = false
/** 基础库版本，如 '3.5.0'；非微信端为 '0.0.0' */
let cachedSdkVersion = ''

// #ifdef MP-WEIXIN
isWxNative = typeof wx !== 'undefined'
// #endif

/**
 * 语义化版本比较
 * @param {string} v1
 * @param {string} v2
 * @returns {number} v1 > v2 返回 1，相等返回 0，小于返回 -1
 */
export function compareVersion(v1, v2) {
  const a = String(v1 || '0').split('.')
  const b = String(v2 || '0').split('.')
  const len = Math.max(a.length, b.length)
  for (let i = 0; i < len; i++) {
    const n1 = parseInt(a[i], 10) || 0
    const n2 = parseInt(b[i], 10) || 0
    if (n1 > n2) return 1
    if (n1 < n2) return -1
  }
  return 0
}

/**
 * 获取当前基础库版本（惰性读取 + 缓存）
 * 优先走 wx.getAppBaseInfo（getSystemInfoSync 已在较新基础库中标记废弃）
 * @returns {string} 非微信端返回 '0.0.0'
 */
export function getSdkVersion() {
  if (cachedSdkVersion) return cachedSdkVersion

  let version = '0.0.0'
  // #ifdef MP-WEIXIN
  try {
    if (typeof wx.getAppBaseInfo === 'function') {
      version = (wx.getAppBaseInfo() || {}).SDKVersion || version
    } else if (typeof wx.getSystemInfoSync === 'function') {
      version = (wx.getSystemInfoSync() || {}).SDKVersion || version
    }
  } catch (err) {
    console.warn('[wechat-native] 读取基础库版本失败:', err)
  }
  // #endif

  cachedSdkVersion = version
  return version
}

/**
 * 判断基础库版本是否满足最低要求
 * @param {string} minVersion 最低基础库版本，如 '3.0.0'
 * @returns {boolean}
 */
export function supportsSdk(minVersion) {
  if (!isWxNative) return false
  if (!minVersion) return true
  return compareVersion(getSdkVersion(), minVersion) >= 0
}

/**
 * wx.canIUse 的安全包装（非微信端恒为 false）
 * @param {string} apiPath 形如 'getFuzzyLocation' 或 'button.open-type.contact'
 * @returns {boolean}
 */
export function canIUse(apiPath) {
  let result = false
  // #ifdef MP-WEIXIN
  if (typeof wx !== 'undefined' && typeof wx.canIUse === 'function') {
    result = wx.canIUse(apiPath)
  }
  // #endif
  return result
}

/**
 * 调用任意微信原生异步接口，返回 Promise
 *
 * @param {string} apiName 接口名，不带 wx. 前缀，如 'getFuzzyLocation'
 * @param {object} [options] 接口入参（success / fail 会被本层接管，请勿自行传入）
 * @returns {Promise<any>} resolve 值为接口 success 回调的 res
 *
 * @example
 * const res = await callWxApi('getFuzzyLocation', { type: 'wgs84' })
 */
export function callWxApi(apiName, options = {}) {
  return new Promise((resolve, reject) => {
    // #ifdef MP-WEIXIN
    if (typeof wx === 'undefined' || typeof wx[apiName] !== 'function') {
      reject(
        new Error(
          `[wechat-native] 当前环境不支持 wx.${apiName}，基础库版本 ${getSdkVersion()}，请检查最低基础库设置`
        )
      )
      return
    }
    try {
      wx[apiName]({
        ...options,
        success: resolve,
        fail: reject
      })
    } catch (err) {
      reject(err)
    }
    return
    // #endif

    // #ifndef MP-WEIXIN
    reject(new Error(`[wechat-native] wx.${apiName} 仅在微信小程序端可用`))
    // #endif
  })
}

/**
 * 带降级的新接口调用：不支持时执行 fallback，而不是直接抛错
 *
 * @param {object} params
 * @param {string} params.apiName 微信接口名
 * @param {string} [params.minSdk] 最低基础库版本，可选
 * @param {object} [params.options] 接口入参
 * @param {Function} [params.fallback] 不支持时的降级实现，可为 async
 * @returns {Promise<{ supported: boolean, data?: any }>}
 *
 * @example
 * const { supported, data } = await callWithFallback({
 *   apiName: 'getFuzzyLocation',
 *   minSdk: '2.25.0',
 *   options: { type: 'gcj02' },
 *   fallback: () => uni.getLocation({ type: 'gcj02' })
 * })
 */
export async function callWithFallback({ apiName, minSdk, options, fallback }) {
  const supported = isWxNative && (minSdk ? supportsSdk(minSdk) : true) && canIUse(apiName)

  if (supported) {
    try {
      const data = await callWxApi(apiName, options)
      return { supported: true, data }
    } catch (err) {
      // 接口存在但调用失败（用户拒绝授权等），交给上层决策，不静默降级
      throw err
    }
  }

  if (typeof fallback === 'function') {
    const data = await fallback()
    return { supported: false, data }
  }

  throw new Error(
    `[wechat-native] wx.${apiName} 不可用且未提供 fallback，基础库版本 ${getSdkVersion()}`
  )
}

/** 当前是否运行在微信小程序端 */
export function isWechatMiniProgram() {
  return isWxNative
}

export default {
  compareVersion,
  getSdkVersion,
  supportsSdk,
  canIUse,
  callWxApi,
  callWithFallback,
  isWechatMiniProgram
}
