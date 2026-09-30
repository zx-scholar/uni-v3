import fs from 'fs'
import path from 'path'

const pagesJsonPath = path.resolve(process.cwd(), 'src/pages.json')
const routesTsPath = path.resolve(process.cwd(), 'src/utils/routes.ts')

// 路径别名精准映射映射（确保 100% 兼容项目既有路由命名规范）
const ALIAS_MAP = {
  '/pages/index/index': ['home', 'index'],
  '/pages-golf/orderInfoGolf/index': ['orderInfo', 'orderInfoGolf'],
  '/pages-golf/orderDetailGolf/index': ['orderDetail', 'orderDetailGolf'],
}

export function generateRoutes() {
  if (!fs.existsSync(pagesJsonPath)) {
    console.warn('[Auto Routes] src/pages.json 不存在')
    return
  }

  try {
    const rawContent = fs.readFileSync(pagesJsonPath, 'utf-8')
    const cleanContent = rawContent.replace(/\/\/.*/g, '')
    const json = JSON.parse(cleanContent)

    const routesMap = {}
    const tabPaths = new Set(
      (json.tabBar?.list || []).map(
        (item) => `/${String(item.pagePath || '').replace(/^\//, '')}`
      )
    )

    function pathToKeys(fullPath) {
      if (ALIAS_MAP[fullPath]) {
        return ALIAS_MAP[fullPath]
      }
      const parts = fullPath.split('/').filter(Boolean)
      const last = parts[parts.length - 1]
      let key = last === 'index' && parts.length > 1 ? parts[parts.length - 2] : last
      key = key.replace(/-([a-z])/g, (_, g) => g.toUpperCase())
      return [key]
    }

    // 1. 收集主包页面
    ;(json.pages || []).forEach((page) => {
      const fullPath = `/${page.path}`
      const keys = pathToKeys(fullPath)
      const routeItem = {
        path: fullPath,
        ...(tabPaths.has(fullPath) ? { tab: true } : {})
      }
      keys.forEach((key) => {
        routesMap[key] = routeItem
      })
    })

    // 2. 收集分包页面
    ;(json.subPackages || []).forEach((sub) => {
      const root = (sub.root || '').replace(/\/+$/, '')
      ;(sub.pages || []).forEach((page) => {
        const fullPath = `/${root}/${page.path}`
        const keys = pathToKeys(fullPath)
        const routeItem = { path: fullPath }
        keys.forEach((key) => {
          routesMap[key] = routeItem
        })
      })
    })

    // 3. 构造生成的 TypeScript 模块内容
    const tsContent = `/**
 * ⚠️ 本文件由 scripts/gen-routes.mjs 根据 src/pages.json 自动编译生成，请勿手动修改！
 * 自动生成时间: ${new Date().toLocaleString()}
 */

export interface RouteItem {
  path: string
  tab?: boolean
}

export const routes = ${JSON.stringify(routesMap, null, 2)} as const

export type RouteMap = typeof routes
export type RouteName = keyof RouteMap
`

    fs.writeFileSync(routesTsPath, tsContent, 'utf-8')
    console.log('⚡ [Auto Routes] 已成功根据 pages.json 编译生成 src/utils/routes.ts')
  } catch (err) {
    console.error('[Auto Routes] 编译路由失败:', err)
  }
}

if (process.argv[1] && process.argv[1].includes('gen-routes.mjs')) {
  generateRoutes()
}
