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
  /**
   * 业务资源 OSS 基址（以 / 结尾）：后端返回的封面/头像等可能是相对路径
   * （如 `prd-venue/center/xxx.jpg`），需用它拼成完整地址；
   * 未配置时回落到 ossPrefix
   */
  ossUrl?: string;
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
 * 各环境公共默认值：多数环境取值相同的字段在此统一收口。
 * 环境条目省略的字段自动回落到这里，仅需覆盖差异项。
 * （extraDataAppId / miniAppId 等少数环境才用的可选字段不设默认值，避免其他环境凭空带上）
 */
const DEFAULT_ENV_CONFIG = {
  tencentMapKey: 'PIEBZ-B5QRV-QAQPF-UJ7T3-SELT7-KXBMC',
  origin: 'https://web.xports.cn',
  webRoot: '/aisports-api',
  ossPrefix: OSS_PREFIX,
} satisfies Partial<EnvConfig>;

/**
 * 环境差异项类型：身份字段（title / name / appid / apiKey / apiSecret）每个环境必填，
 * 其余字段省略时回落 DEFAULT_ENV_CONFIG
 */
type EnvOverrides = Partial<EnvConfig> &
  Pick<EnvConfig, 'title' | 'name' | 'appid' | 'apiKey' | 'apiSecret'>;

/** 环境条目构造器：公共默认值 + 差异覆盖 */
const defineEnv = (overrides: EnvOverrides): EnvConfig => ({
  ...DEFAULT_ENV_CONFIG,
  ...overrides,
});

/**
 * 集中式多环境字典配置中心
 * 键名为对应启动命令的 --mode 参数 (如 hangzhou / qdgx / sportsdev / development / production)
 */
export const ENV_DICTIONARY: Record<string, EnvConfig> = {
  // 1. 杭州奥体测试环境 (--mode hangzhou)
  hangzhou: defineEnv({
    title: '杭州奥体',
    name: 'xports-jian',
    appid: 'wx7a26c58e9b0f27bf',
    apiKey: '7bf4f3eb3f61fc97',
    apiSecret: '32d15e969489fee3',
  }),

  // 2. 青岛国信测试环境 (--mode qdgx)
  qdgx: defineEnv({
    title: '伏见桃山演示馆-青岛国信测试',
    name: 'xports-qdgx-test',
    appid: 'wx74ff1858ef8d829a',
    apiKey: '9f1c9242486b564f',
    apiSecret: 'e3b35fcbfc4c9aa5',
    origin: 'https://webtest.wishare.com.cn',
  }),

  // 3. 菠菜测试环境 (--mode sportsdev)
  sportsdev: defineEnv({
    title: '菠菜测试',
    name: 'xports-jian',
    appid: 'wx048708c8747e08e5',
    apiKey: 'a278cb1498a744f4',
    apiSecret: 'ca92c90a416bea7c',
    origin: 'https://sportsdev.wishare.com.cn',
    webRoot: '/sports-api',
  }),

  // 4. 默认开发环境 fallback (--mode development)
  development: defineEnv({
    title: '杭州奥体(开发)',
    name: 'xports-jian',
    appid: 'wx7a26c58e9b0f27bf',
    apiKey: '7bf4f3eb3f61fc97',
    apiSecret: '32d15e969489fee3',
  }),

  // 5. 生产构建默认 fallback (--mode production)
  production: defineEnv({
    title: '杭州奥体(生产)',
    name: 'xports-jian',
    appid: 'wx7a26c58e9b0f27bf',
    apiKey: '7bf4f3eb3f61fc97',
    apiSecret: '32d15e969489fee3',
  }),

  // 6. 塘坊体育公园环境 (--mode tangfang)
  tangfang: defineEnv({
    title: '塘坊体育公园',
    name: 'xports-tangfang',
    appid: 'wx14673a4cddc243e5',
    apiKey: '2b30002c2450ccf3',
    apiSecret: '1a37ee47914fbe31',
    tencentMapKey: 'BW3BZ-CK7KQ-M3G5H-BNLUD-XDPHQ-PNBTJ',
    extraDataAppId: '2073475230',
  }),

  // 7. 兰州奥体环境 (--mode lanzhou)
  lanzhou: defineEnv({
    title: '兰州',
    name: 'xports-lanzhou',
    appid: 'wx6f747f38cf44c641',
    apiKey: '967de425b6f41bf3',
    apiSecret: '9bbc1b8aad98bb81',
    tencentMapKey: 'BW3BZ-CK7KQ-M3G5H-BNLUD-XDPHQ-PNBTJ',
    extraDataAppId: '2073475230',
    miniAppId: '1034',
  }),

  // 8. 尊享体育高尔夫环境 (--mode golf)
  // 说明：老项目 golf 配置中的 prefix / testPrefix / relativePath / logo / ossUrl / imgUrl /
  // tabBarList / mineMenuList / centerId / tenantId / id 不属于本项目 EnvConfig 模型：
  // - 域名统一由 origin 承载（prefix / testPrefix 不单独维护）
  // - centerId / tenantId 由 queryMiniAppInfo 接口回填，不入配置
  // - 静态资源统一走 ossPrefix（与 variables.scss 的 $img-base 同源，此处沿用默认 prd 桶）
  golf: defineEnv({
    title: '尊享体育',
    name: 'xports-golf',
    appid: 'wxa46dd68b420369af',
    apiKey: '1a20a7c8451c60fb',
    apiSecret: 'e0e4e17c7cca9765',
    origin: 'https://golf.xports.cn',
    webRoot: '/sports-api',
    extraDataAppId: '2073475230',
    // 后台封面等业务图片所在桶（接口返回相对路径时拼接用）
    ossUrl: 'https://golf-sports.oss-cn-hangzhou.aliyuncs.com/',
  }),

  // 9. 尊享体育高尔夫测试环境 (--mode golf-test)
  // 后端即菠菜测试(sportsdev)同一套服务，故 apiKey / apiSecret 与 sportsdev 共用；
  // appid 也用测试号 wx048708c8747e08e5，与线上 golf 的 wxa46dd68b420369af 区分。
  'golf-test': defineEnv({
    title: '尊享体育-测试',
    name: 'xports-golf-test',
    appid: 'wx048708c8747e08e5',
    apiKey: 'a278cb1498a744f4',
    apiSecret: 'ca92c90a416bea7c',
    origin: 'https://sportsdev.wishare.com.cn',
    webRoot: '/sports-api',
    extraDataAppId: '2073475230',
    // 测试桶（老项目 golf 配置的 ossUrl）
    ossUrl: 'https://sports-oss.zjzhty.cn/group1/',
  }),
};
