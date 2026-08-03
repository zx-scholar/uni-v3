import md5 from 'js-md5'
import wechatParam from '@/config/appConfig'
import { useAppStore } from '@/stores/app'

/**
 * 根据 temp.js 规范生成带 MD5 签名的加密请求参数
 * @param {string} url - 相对路径
 * @param {Object} data - 请求业务数据
 * @param {string} [apiName] - 模块 API 名称 (如 community)
 * @param {Object} [requestOps] - 扩展控制配置
 */
export function getCodedParam(url, data = {}, apiName = '', requestOps = {}) {
  try {
    let apiKey
    let apiSecret
    if (apiName) {
      apiKey = wechatParam[`${apiName}ApiKey`]
      apiSecret = wechatParam[`${apiName}ApiSecret`]
    } else {
      apiKey = wechatParam.apiKey
      apiSecret = wechatParam.apiSecret
    }

    const timestamp = new Date().getTime()

    // 构造基础参数字典
    const fullData = Object.assign(
      {
        apiKey,
        timestamp,
        channelId: uni.getStorageSync('channelId') || '11'
      },
      data
    )

    // 处理可选的 centerId / tenantId
    // centerId 唯一来源是 Pinia appStore（初始化时由 queryMiniAppInfo 写入并持久化）
    const centerId = useAppStore().centerId
    const tenantId = uni.getStorageSync('tenantId')

    if (centerId && fullData.centerId === undefined && !(requestOps || {}).noCenterId) {
      fullData.centerId = centerId
    }
    if (tenantId && fullData.tenantId === undefined) {
      fullData.tenantId = tenantId
    }

    // 1. 将 key 升序排序并拼接
    const fullDataArr = Object.keys(fullData).map((key) => ({
      key,
      value: fullData[key] === undefined || fullData[key] === null ? '' : fullData[key]
    }))

    fullDataArr.sort((a, b) => a.key.localeCompare(b.key))

    const signStr = fullDataArr.reduce((last, v) => `${last}${v.key}=${v.value}`, '')

    // 2. 拼接 url + signStr + apiSecret 并做 URI 编码
    let enCodeSign = encodeURIComponent(url + signStr + apiSecret)

    // 3. 特殊字符转义修饰
    enCodeSign = enCodeSign
      .replace(/\(/g, '%28')
      .replace(/\)/g, '%29')
      .replace(/'/g, '%27')
      .replace(/!/g, '%21')
      .replace(/~/g, '%7E')

    // 4. MD5 加密得到 sign
    const sign = md5(enCodeSign)

    return Object.assign({}, fullData, { sign })
  } catch (e) {
    console.error('签名生成异常:', e)
    return data
  }
}
