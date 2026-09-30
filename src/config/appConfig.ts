import { ENV_DICTIONARY, type EnvConfig } from './environments'

/** 识别当前 Vite 构建/启动传入的 --mode 参数 (如 hangzhou / qdgx / sportsdev / development) */
const currentMode = import.meta.env.MODE || 'development'

/** 从集中字典中自动匹配环境配置，未匹配到则回退至 development */
const matchedConfig: EnvConfig = ENV_DICTIONARY[currentMode] || ENV_DICTIONARY['development']

/** 导出冷冻保护的全局环境配置实例 */
export const wechatParam: Readonly<EnvConfig> = Object.freeze(matchedConfig)

export const env = wechatParam

export default wechatParam
