/**
 * 路由别名映射配置（可选文件）
 *
 * 键 = 页面完整路径（以 / 开头、不含扩展名），值 = 该页面可用的别名数组。
 * 命中的页面不再走默认的"末段目录名"推导，完全以此处为准；
 * 修改本文件后 dev 服务器会自动重新生成 src/utils/routes.ts。
 */
export default {
  '/pages/index/index': ['home', 'index'],
  '/pages-golf/orderInfoGolf/index': ['orderInfo', 'orderInfoGolf'],
  '/pages-golf/orderDetailGolf/index': ['orderDetail', 'orderDetailGolf'],
}
