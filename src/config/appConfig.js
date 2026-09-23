/**
 * 项目环境配置:从 Vite 环境变量加载 (.env.development / .env.production / 自定义 mode)
 *
 * 切换环境:
 *   - 开发默认: npm run dev:*              → 读取 .env.development (杭州奥体测试)
 *   - 生产默认: npm run build:*            → 读取 .env.production (杭州奥体生产)
 *   - 指定环境: npm run dev:mp-weixin:qdgx → 读取 .env.qdgx (青岛国信测试)
 *   - 指定环境: npm run dev:mp-weixin:hangzhou → 读取 .env.hangzhou
 *   - 指定环境: npm run dev:mp-weixin:sportsdev → 读取 .env.sportsdev (菠菜测试)
 *   - 通用写法: npm run dev:mp-weixin -- --mode qdgx → 读取 .env.qdgx
 *
 * 注意:VITE_ 前缀变量会被编译期静态注入 import.meta.env,未配置时返回 undefined
 */
export const wechatParam = {
  title: import.meta.env.VITE_APP_TITLE || '',
  name: import.meta.env.VITE_APP_NAME || '',
  appid: import.meta.env.VITE_APP_APPID || '',
  apiKey: import.meta.env.VITE_APP_API_KEY || '',
  apiSecret: import.meta.env.VITE_APP_API_SECRET || '',
  tencentMapKey: import.meta.env.VITE_APP_TENCENT_MAP_KEY || '',
  origin: import.meta.env.VITE_APP_ORIGIN || '',
  prefix: import.meta.env.VITE_APP_PREFIX || '',
  webRoot: import.meta.env.VITE_APP_WEB_ROOT || '',
  ossUrl: import.meta.env.VITE_APP_OSS_URL || '',
  imgUrl: import.meta.env.VITE_APP_IMG_URL || '',
  relativePath: import.meta.env.VITE_APP_RELATIVE_PATH || '',
}

export default wechatParam
