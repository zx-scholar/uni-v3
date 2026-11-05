/**
 * 可插拔子包功能清单配置
 *
 * 规则：
 * 1. 数组中列出的子包才会被编译打入产物；不在数组中的子包自动屏蔽。
 * 2. 支持按启动环境 (--mode) 定制：若 environments 中配置了当前环境，优先使用当前环境的数组。
 * 3. 本文件由 scripts/gen-pages.mjs 在编译期动态 import，请保持纯数据结构
 *    （勿使用 TypeScript 语法、勿引入外部依赖），否则路由生成会直接报错终止。
 */
export default {
  // 默认编译启用的子包清单
  default: ['common', 'event', 'golf', 'pay', 'point', 'template', 'venue', 'venueball', 'venuecard','venuecourse', 'venueticket'],

  // 按编译环境 (--mode) 覆盖定制
  environments: {
    // 青岛国信环境 (--mode qdgx)
    qdgx: ['common', 'event', 'golf', 'pay', 'point', 'template', 'venueball', 'venueticket'],
    // 杭州奥体环境 (--mode hangzhou)
    hangzhou: ['common', 'event', 'golf', 'pay', 'point', 'venueball', 'venueticket'],
    // 菠菜测试环境 (--mode sportsdev)
    sportsdev: ['common', 'event', 'pay', 'point', 'template'],
    // 塘坊体育公园环境 (--mode tangfang)
    tangfang: ['common', 'event', 'golf', 'pay', 'point', 'template', 'venue', 'venueball', 'venuecard', 'venuecourse', 'venueticket'],
    // 兰州奥体环境 (--mode lanzhou)
    lanzhou: ['common', 'event', 'golf', 'pay', 'point', 'template', 'venue', 'venueball', 'venuecard', 'venuecourse', 'venueticket'],
    // 尊享体育高尔夫环境 (--mode golf)
    golf: ['common', 'event', 'golf', 'pay', 'point', 'template', 'venue', 'venueball', 'venuecard', 'venuecourse', 'venueticket'],
    // 尊享体育高尔夫测试环境 (--mode golf-test)
    'golf-test': ['common', 'event', 'golf', 'pay', 'point', 'template', 'venue', 'venueball', 'venuecard', 'venuecourse', 'venueticket'],
  },

  // 分包预下载规则 (可选)：键为主包页面路径，值为 uni-app preloadRule 条目；
  // packages 列出的分包会按当前环境白名单自动过滤——未打入即剔除，
  // 某条规则的 packages 全部被剔除时该规则整体不生成
  preloadRule: {
    'pages/index/index': {
      network: 'all',
      packages: ['pages-golf'],
    },
  },
};
