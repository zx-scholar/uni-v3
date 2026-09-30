/**
 * 可插拔子包功能清单配置
 *
 * 规则：
 * 1. 数组中列出的子包才会被编译打入产物；不在数组中的子包自动屏蔽。
 * 2. 支持按启动环境 (--mode) 定制：若 environments 中配置了当前环境，优先使用当前环境的数组。
 */
export const features = {
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
  },
};

export default features;
