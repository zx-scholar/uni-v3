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
  origin: string;
  prefix: string;
  webRoot: string;
  ossUrl: string;
  imgUrl: string;
  relativePath: string;
  [key: string]: string;
}

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
    prefix: 'https://web.xports.cn',
    webRoot: '/aisports-api',
    ossUrl: 'http://xports-test.oss-cn-hangzhou.aliyuncs.com/',
    imgUrl: 'https://xports-test.oss-cn-hangzhou.aliyuncs.com/',
    relativePath: 'dev/public/miniapp/material/',
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
    prefix: 'https://webtest.wishare.com.cn',
    webRoot: '/aisports-api',
    ossUrl: 'http://xports-test.oss-cn-hangzhou.aliyuncs.com/',
    imgUrl: 'https://xports-test.oss-cn-hangzhou.aliyuncs.com/',
    relativePath: 'dev/public/miniapp/material/',
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
    prefix: 'https://sportsdev.wishare.com.cn',
    webRoot: '/sports-api',
    ossUrl: 'http://xports-test.oss-cn-hangzhou.aliyuncs.com/',
    imgUrl: 'https://xports-test.oss-cn-hangzhou.aliyuncs.com/',
    relativePath: 'dev/public/miniapp/material/',
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
    prefix: 'https://web.xports.cn',
    webRoot: '/aisports-api',
    ossUrl: 'http://xports-test.oss-cn-hangzhou.aliyuncs.com/',
    imgUrl: 'https://xports-test.oss-cn-hangzhou.aliyuncs.com/',
    relativePath: 'dev/public/miniapp/material/',
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
    prefix: 'https://web.xports.cn',
    webRoot: '/aisports-api',
    ossUrl: 'http://xports-test.oss-cn-hangzhou.aliyuncs.com/',
    imgUrl: 'https://xports-test.oss-cn-hangzhou.aliyuncs.com/',
    relativePath: 'dev/public/miniapp/material/',
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
    prefix: 'https://web.xports.cn',
    webRoot: '/aisports-api',
    ossUrl: 'http://xports-test.oss-cn-hangzhou.aliyuncs.com/',
    imgUrl: 'https://xports-test.oss-cn-hangzhou.aliyuncs.com/',
    relativePath: 'dev/public/miniapp/material/',
  },
};
