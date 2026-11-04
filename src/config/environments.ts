/**
 * 环境配置模型声明
 */
export interface EnvConfig {
  title: string;
  name: string;
  appid: string;
  apiKey: string;
  apiSecret: string;
  tencentMapKey: string;
  /** 后端域名：小程序/App 端 baseURL = origin + webRoot；H5 dev 走 Vite 代理只用 webRoot */
  origin: string;
  /** 后端 API 路径前缀，同时作为 dev 环境 Vite 代理的匹配路径 */
  webRoot: string;
  /** 静态资源 OSS 基址（以 / 结尾），与 variables.scss 的 $img-base 对应 */
  ossPrefix: string;
  /** 额外数据应用 ID（仅 tangfang / lanzhou 等环境需要） */
  extraDataAppId?: string;
  /** 小程序业务 ID（仅 lanzhou 等环境需要） */
  miniAppId?: string;
}

/**
 * 静态资源 OSS 基址（全部环境统一使用 prd 桶，以 / 结尾）
 * ⚠️ 需与 src/styles/variables.scss 的 $img-base 保持一致（SCSS 侧无尾斜杠，拼接时补 /）
 */
const OSS_PREFIX = 'https://xports-prd.oss-cn-hangzhou.aliyuncs.com/prd/';

/**
 * 集中式多环境字典配置中心
 * 键名为对应启动命令的 --mode 参数 (如 hangzhou / qdgx / sportsdev / development / production)
 */
export const ENV_DICTIONARY: Record<string, EnvConfig> = {
  // 1. 杭州奥体测试环境 (--mode hangzhou)
  hangzhou: {
    title: '杭州奥体',
    name: 'xports-jian',
    appid: 'wx7a26c58e9b0f27bf',
    apiKey: '7bf4f3eb3f61fc97',
    apiSecret: '32d15e969489fee3',
    tencentMapKey: 'PIEBZ-B5QRV-QAQPF-UJ7T3-SELT7-KXBMC',
    origin: 'https://web.xports.cn',
    webRoot: '/aisports-api',
    ossPrefix: OSS_PREFIX,
  },

  // 2. 青岛国信测试环境 (--mode qdgx)
  qdgx: {
    title: '伏见桃山演示馆-青岛国信测试',
    name: 'xports-qdgx-test',
    appid: 'wx74ff1858ef8d829a',
    apiKey: '9f1c9242486b564f',
    apiSecret: 'e3b35fcbfc4c9aa5',
    tencentMapKey: 'PIEBZ-B5QRV-QAQPF-UJ7T3-SELT7-KXBMC',
    origin: 'https://webtest.wishare.com.cn',
    webRoot: '/aisports-api',
    ossPrefix: OSS_PREFIX,
  },

  // 3. 菠菜测试环境 (--mode sportsdev)
  sportsdev: {
    title: '菠菜测试',
    name: 'xports-jian',
    appid: 'wx048708c8747e08e5',
    apiKey: 'a278cb1498a744f4',
    apiSecret: 'ca92c90a416bea7c',
    tencentMapKey: 'PIEBZ-B5QRV-QAQPF-UJ7T3-SELT7-KXBMC',
    origin: 'https://sportsdev.wishare.com.cn',
    webRoot: '/sports-api',
    ossPrefix: OSS_PREFIX,
  },
  // 4. 默认开发环境 fallback (--mode development)
  development: {
    title: '杭州奥体(开发)',
    name: 'xports-jian',
    appid: 'wx7a26c58e9b0f27bf',
    apiKey: '7bf4f3eb3f61fc97',
    apiSecret: '32d15e969489fee3',
    tencentMapKey: 'PIEBZ-B5QRV-QAQPF-UJ7T3-SELT7-KXBMC',
    origin: 'https://web.xports.cn',
    webRoot: '/aisports-api',
    ossPrefix: OSS_PREFIX,
  },

  // 5. 生产构建默认 fallback (--mode production)
  production: {
    title: '杭州奥体(生产)',
    name: 'xports-jian',
    appid: 'wx7a26c58e9b0f27bf',
    apiKey: '7bf4f3eb3f61fc97',
    apiSecret: '32d15e969489fee3',
    tencentMapKey: 'PIEBZ-B5QRV-QAQPF-UJ7T3-SELT7-KXBMC',
    origin: 'https://web.xports.cn',
    webRoot: '/aisports-api',
    ossPrefix: OSS_PREFIX,
  },
  tangfang: {
    title: '塘坊体育公园',
    name: 'xports-tangfang',
    appid: 'wx14673a4cddc243e5',
    apiKey: '2b30002c2450ccf3',
    apiSecret: '1a37ee47914fbe31',
    tencentMapKey: 'BW3BZ-CK7KQ-M3G5H-BNLUD-XDPHQ-PNBTJ',
    extraDataAppId: '2073475230',
    origin: 'https://web.xports.cn',
    webRoot: '/aisports-api',
    ossPrefix: OSS_PREFIX,
  },
  lanzhou: {
    title: '兰州',
    name: 'xports-lanzhou',
    appid: 'wx6f747f38cf44c641',
    apiKey: '967de425b6f41bf3',
    apiSecret: '9bbc1b8aad98bb81',
    tencentMapKey: 'BW3BZ-CK7KQ-M3G5H-BNLUD-XDPHQ-PNBTJ',
    extraDataAppId: '2073475230',
    origin: 'https://web.xports.cn',
    webRoot: '/aisports-api',
    ossPrefix: OSS_PREFIX,
    miniAppId: '1034',
  },
};
