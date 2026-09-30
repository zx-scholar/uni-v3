/**
 * ⚠️ 本文件由 scripts/gen-routes.mjs 根据 src/pages.json 自动编译生成，请勿手动修改！
 * 自动生成时间: 2026/9/30 16:45:05
 */

export interface RouteItem {
  path: string
  tab?: boolean
}

export const routes = {
  "home": {
    "path": "/pages/index/index",
    "tab": true
  },
  "index": {
    "path": "/pages/index/index",
    "tab": true
  },
  "mine": {
    "path": "/pages/mine/mine",
    "tab": true
  },
  "login": {
    "path": "/pages/login/login"
  },
  "event": {
    "path": "/pages/event/event",
    "tab": true
  },
  "personInfo": {
    "path": "/pages-common/personInfo/personInfo"
  },
  "userAgreement": {
    "path": "/pages-common/userAgreement/userAgreement"
  },
  "insuranceService": {
    "path": "/pages-common/insuranceService/insuranceService"
  },
  "profile": {
    "path": "/pages-common/profile/profile"
  },
  "uploadImage": {
    "path": "/pages-common/uploadImage/uploadImage"
  },
  "eventList": {
    "path": "/pages-event/eventList/index"
  },
  "eventProject": {
    "path": "/pages-event/eventProject/index"
  },
  "eventRanking": {
    "path": "/pages-event/eventRanking/index"
  },
  "eventsPlan": {
    "path": "/pages-event/eventsPlan/eventsPlan"
  },
  "browsingHistory": {
    "path": "/pages-golf/browsingHistory/browsingHistory"
  },
  "playerHome": {
    "path": "/pages-golf/playerHome/index"
  },
  "orderDetailGolf": {
    "path": "/pages-pay/orderDetailGolf/index"
  },
  "orderInfoGolf": {
    "path": "/pages-pay/orderInfoGolf/index"
  },
  "paymentSuccess": {
    "path": "/pages-pay/paymentSuccess/index"
  },
  "myPoints": {
    "path": "/pages-point/myPoints/index"
  },
  "pointsDetail": {
    "path": "/pages-point/pointsDetail/index"
  },
  "demo": {
    "path": "/pages-template/demo/demo"
  },
  "pagesBasic": {
    "path": "/pages-template/pagesBasic/index"
  },
  "template": {
    "path": "/pages-template/template/template"
  },
  "venueList": {
    "path": "/pages-venue/venueList/index"
  },
  "ballBitDetail": {
    "path": "/pages-venueball/ballBitDetail/index"
  },
  "ballBitEvaluateGolf": {
    "path": "/pages-venueball/ballBitEvaluateGolf/index"
  },
  "ballBitMyList": {
    "path": "/pages-venueball/ballBitMyList/index"
  },
  "ballBitSquareGolf": {
    "path": "/pages-venueball/ballBitSquareGolf/index"
  },
  "cardList": {
    "path": "/pages-venuecard/cardList/index"
  },
  "courseList": {
    "path": "/pages-venuecourse/courseList/index"
  },
  "myTicketDetail": {
    "path": "/pages-venueticket/myTicketDetail/index"
  },
  "myTicketList": {
    "path": "/pages-venueticket/myTicketList/index"
  }
} as const

export type RouteMap = typeof routes
export type RouteName = keyof RouteMap
