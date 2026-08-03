/**
 * 路由配置一致性校验 (仅 dev 环境调用)
 *
 * 校验 src/utils/routes.js 与 src/pages.json 是否保持一致:
 *  1. routes 中存在但 pages.json 未注册的页面路径
 *  2. pages.json 中已注册但 routes 缺失的页面路径
 *  3. tabBar 页面路径与 routes 中 tab: true 标记是否双向匹配
 * 全部输出 console.warn, 不阻断启动
 */
import pagesJson from '@/pages.json'
import { routes } from '@/utils/routes'

/** 收集 pages.json 中所有真实页面路径 (主包 + 分包) */
function collectRealPaths(json) {
  const paths = new Set()
  ;(json.pages || []).forEach((page) => {
    paths.add(`/${page.path}`)
  })
  ;(json.subPackages || []).forEach((sub) => {
    const root = (sub.root || '').replace(/\/+$/, '')
    ;(sub.pages || []).forEach((page) => {
      paths.add(`/${root}/${page.path}`)
    })
  })
  return paths
}

/** 收集 routes 中配置的页面路径与 tab 标记 */
function collectRoutePaths() {
  const paths = new Set()
  const tabPaths = new Set()
  Object.values(routes).forEach((route) => {
    paths.add(route.path)
    if (route.tab) tabPaths.add(route.path)
  })
  return { paths, tabPaths }
}

/**
 * 校验 routes.js 与 pages.json 一致性
 * 发现差异仅 console.warn, 不抛错
 */
export function checkRoutesConsistency() {
  const realPaths = collectRealPaths(pagesJson)
  const { paths: routePaths, tabPaths: routeTabPaths } = collectRoutePaths()
  let hasIssue = false

  // 1. routes 有而 pages.json 没有 -> 跳转会失败
  routePaths.forEach((path) => {
    if (!realPaths.has(path)) {
      hasIssue = true
      console.warn(`[routeCheck] routes.js 中 "${path}" 未在 pages.json 注册, 跳转会失败`)
    }
  })

  // 2. pages.json 有而 routes 没有 -> 无法用别名跳转
  realPaths.forEach((path) => {
    if (!routePaths.has(path)) {
      hasIssue = true
      console.warn(`[routeCheck] pages.json 中 "${path}" 未在 routes.js 配置别名`)
    }
  })

  // 3. tabBar 与 routes tab 标记双向匹配
  const realTabPaths = new Set(
    ((pagesJson.tabBar && pagesJson.tabBar.list) || []).map(
      (item) => `/${String(item.pagePath || '').replace(/^\//, '')}`
    )
  )
  routeTabPaths.forEach((path) => {
    if (!realTabPaths.has(path)) {
      hasIssue = true
      console.warn(`[routeCheck] routes.js 标记 tab: "${path}" 但 pages.json tabBar 未包含`)
    }
  })
  realTabPaths.forEach((path) => {
    if (!routeTabPaths.has(path)) {
      hasIssue = true
      console.warn(`[routeCheck] pages.json tabBar 包含 "${path}" 但 routes.js 未标记 tab`)
    }
  })

  if (!hasIssue) {
    console.log('[routeCheck] routes.js 与 pages.json 配置一致')
  }
}

export default checkRoutesConsistency