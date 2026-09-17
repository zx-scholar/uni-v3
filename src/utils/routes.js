/**
 * 页面路由配置 (页面路径别名字典)
 *
 * 约定:
 *  - 新增页面时同步维护本文件与 pages.json
 *  - tab: true 表示 tabBar 页面, router.push 会自动降级为 switchTab
 */
export const routes = {
  // === 主包页面 ===
  home: { path: '/pages/index/index', tab: true },
  mine: { path: '/pages/mine/mine', tab: true },
  login: { path: '/pages/login/login' },
  profile: { path: '/pages/profile/profile' },
  template: { path: '/pages/template/template' },
  uploadImage: { path: '/pages/uploadImage/uploadImage' },

  // === 功能分包页面 ===
  demo: { path: '/pages-golf/demo/demo' },
  browsingHistory: { path: '/pages-golf/browsingHistory/browsingHistory' },
  eventsPlan: { path: '/pages-golf/eventsPlan/eventsPlan' },
  ballBitSquareGolf: { path: '/pages-golf/ballBitSquareGolf/index' },
  ballBitDetail: { path: '/pages-golf/ballBitDetail/index' },
  ballBitEvaluateGolf: { path: '/pages-golf/ballBitEvaluateGolf/index' },
  ballBitMyList: { path: '/pages-golf/ballBitMyList/index' },
  myPoints: { path: '/pages-golf/myPoints/index' },
    paymentSuccess: { path: '/pages-golf/paymentSuccess/index' },
      orderInfo: { path: '/pages-golf/orderInfo/index' },
        orderDetail: { path: '/pages-golf/orderDetail/index' },


  // === pages-common 分包页面 ===
  personInfo: { path: '/pages-common/personInfo/personInfo' },
  userAgreement: { path: '/pages-common/userAgreement/userAgreement' },
  insuranceService: { path: '/pages-common/insuranceService/insuranceService' },
  pagesBasic: { path: '/pages-common/pagesBasic/index' },
}
