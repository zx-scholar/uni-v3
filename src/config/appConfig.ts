import { ENV_DICTIONARY, type EnvConfig } from './environments'

/** 识别当前 Vite 构建/启动传入的 --mode 参数 (如 hangzhou / qdgx / sportsdev / development) */
const currentMode = import.meta.env.MODE || 'development'

/** 从集中字典中匹配环境配置；未注册的环境直接报错，避免静默请求到其它环境的后端 */
const matchedConfig: EnvConfig | undefined = ENV_DICTIONARY[currentMode]
if (!matchedConfig) {
  throw new Error(
    `[config] 未知构建环境 mode="${currentMode}"，未在 src/config/environments.ts 的 ENV_DICTIONARY 中注册。` +
      `可用环境: [${Object.keys(ENV_DICTIONARY).join(', ')}]`
  )
}

/** 必填配置校验：缺失时立刻暴露，而不是等到线上请求 404 才排查 */
const REQUIRED_FIELDS = ['origin', 'webRoot', 'appid', 'apiKey', 'apiSecret'] as const
const missingFields = REQUIRED_FIELDS.filter((field) => !matchedConfig[field])
if (missingFields.length > 0) {
  throw new Error(
    `[config] 环境 [${currentMode}] 缺少必填配置: [${missingFields.join(', ')}]，请在 src/config/environments.ts 中补齐`
  )
}

/** 导出冷冻保护的全局环境配置实例 */
export const wechatParam: Readonly<EnvConfig> = Object.freeze(matchedConfig)

export const env = wechatParam

export default wechatParam
