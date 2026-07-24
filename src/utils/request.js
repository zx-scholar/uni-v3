/**
 * 原生 uni.request 封装
 * 支持：自动参数 MD5 加密签名、全端跨端、请求/响应拦截器、Token 状态保持、错误统一提示
 */
import { getCodedParam } from '@/utils/crypto'
import wechatParam from '@/config/appConfig'

// 基础配置：H5 端本地开发走 Vite 代理，小程序/App 端走全路径域名
// #ifdef H5
const defaultBaseUrl = wechatParam.webRoot || ''
// #endif

// #ifndef H5
const defaultBaseUrl = wechatParam.prefix + (wechatParam.webRoot || '')
// #endif

const config = {
  baseUrl: defaultBaseUrl,
  timeout: 10000,
  header: {
    'content-type': 'application/x-www-form-urlencoded'
  }
}

/**
 * 获取完整服务器请求地址
 */
function getServerAddress(url, requestOps = {}) {
  const { apiName, specPrefix } = requestOps
  if (apiName) {
    // #ifdef H5
    const prefix = ''
    // #endif
    // #ifndef H5
    const prefix = wechatParam[`${apiName}Prefix`] || ''
    // #endif
    const webRoot = wechatParam[`${apiName}WebRoot`] || ''
    return prefix + webRoot + url
  }
  if (specPrefix) {
    return wechatParam['specPrefix'] + (wechatParam.webRoot || '') + url
  }
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  return config.baseUrl + (url.startsWith('/') ? url : '/' + url)
}

/**
 * 获取相对路径（用于签名计算）
 */
function getRelativeAddress(url, apiName = '') {
  if (apiName) {
    return (wechatParam[`${apiName}WebRoot`] || '') + url
  }
  return (wechatParam.webRoot || '') + url
}

/**
 * 请求拦截器：对参数进行 MD5 签名加密
 */
const requestInterceptor = (options) => {
  const { url, data = {}, apiName, method = 'GET' } = options

  // 计算拼接后的请求地址
  options.url = getServerAddress(url, options)

  // 对请求数据计算签名（获取相对路径参与加密算法）
  const relativeUrl = getRelativeAddress(url, apiName)
  
  // 核心签名注入
  options.data = getCodedParam(relativeUrl, data, apiName, options)

  // Header 补全
  options.header = Object.assign({}, config.header, options.header)

  // POST 默认 Form 表单格式设置
  if (method.toUpperCase() === 'POST' && !options.header['content-type']) {
    options.header['content-type'] = 'application/x-www-form-urlencoded'
  }

  // Token 自动携带
  const token = uni.getStorageSync('token')
  if (token) {
    options.header['Authorization'] = `Bearer ${token}`
  }

  options.timeout = options.timeout || config.timeout

  return options
}

/**
 * 响应拦截器
 */
const responseInterceptor = (response, options) => {
  const { statusCode, data } = response

  if (statusCode >= 200 && statusCode < 300) {
    if (data && typeof data === 'object') {
      const isSuccess = data.error === 0 || data.code === 200 || data.code === 0
      
      if (isSuccess) {
        return data
      } else if (data.code === 401 || data.error === 401) {
        uni.showToast({
          title: data.message || data.msg || '登录失效，请重新登录',
          icon: 'none'
        })
        uni.removeStorageSync('token')
        return Promise.reject(data)
      } else {
        if (!options.hideErrorToast && !options.selfHandleError) {
          uni.showToast({
            title: data.message || data.msg || '请求异常',
            icon: 'none'
          })
        }
        return Promise.reject(data)
      }
    }
    return data
  } else {
    if (!options.hideErrorToast && !options.selfHandleError) {
      uni.showToast({
        title: `网络请求错误 (${statusCode})`,
        icon: 'none'
      })
    }
    return Promise.reject(response)
  }
}

/**
 * 核心 request 方法
 */
const request = (options = {}) => {
  if (options.loading !== false) {
    uni.showLoading({ title: '加载中...', mask: true })
  }

  const finalOptions = requestInterceptor(options)

  return new Promise((resolve, reject) => {
    uni.request({
      ...finalOptions,
      success: (res) => {
        if (options.loading !== false) {
          uni.hideLoading()
        }
        try {
          const result = responseInterceptor(res, finalOptions)
          if (result && typeof result.then === 'function') {
            result.then(resolve).catch(reject)
          } else {
            resolve(result)
          }
        } catch (error) {
          reject(error)
        }
      },
      fail: (err) => {
        if (options.loading !== false) {
          uni.hideLoading()
        }
        if (!finalOptions.hideErrorToast && !finalOptions.selfHandleError) {
          uni.showToast({
            title: err.errMsg || '网络请求失败，请稍后再试',
            icon: 'none'
          })
        }
        reject(err)
      }
    })
  })
}

// 快捷请求 API
const http = {
  request,
  get(url, data = {}, options = {}) {
    return request({ url, method: 'GET', data, ...options })
  },
  post(url, data = {}, options = {}) {
    return request({ url, method: 'POST', data, ...options })
  },
  put(url, data = {}, options = {}) {
    return request({ url, method: 'PUT', data, ...options })
  },
  delete(url, data = {}, options = {}) {
    return request({ url, method: 'DELETE', data, ...options })
  }
}

export default http
