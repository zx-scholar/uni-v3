import fs from 'fs'
import path from 'path'
import { pathToFileURL } from 'url'

const pagesJsonPath = path.resolve(process.cwd(), 'src/pages.json')
const routesTsPath = path.resolve(process.cwd(), 'src/utils/routes.ts')

/**
 * 动态加载 src/config/routes-alias.mjs 自定义别名映射（可选文件）
 * 未创建该文件时视为无自定义别名；导出结构异常则直接抛错
 */
async function loadAliasMap() {
  const aliasPath = path.resolve(process.cwd(), 'src/config/routes-alias.mjs')
  if (!fs.existsSync(aliasPath)) {
    console.log('[Auto Routes] 未找到 src/config/routes-alias.mjs，跳过自定义别名')
    return {}
  }
  const imported = await import(`${pathToFileURL(aliasPath).href}?t=${Date.now()}`)
  const map = imported && imported.default
  if (!map || typeof map !== 'object' || Array.isArray(map)) {
    throw new Error('[Auto Routes] src/config/routes-alias.mjs 导出结构异常，应为 { 路径: [别名...] }')
  }
  return map
}

export async function generateRoutes() {
  if (!fs.existsSync(pagesJsonPath)) {
    console.warn('[Auto Routes] src/pages.json 不存在')
    return
  }

  try {
    // pages.json 由 gen-pages.mjs 以 JSON.stringify 生成，恒为纯 JSON，无需剥离注释
    const json = JSON.parse(fs.readFileSync(pagesJsonPath, 'utf-8'))
    const aliasMap = await loadAliasMap()

    const routesMap = {}
    const tabPaths = new Set(
      (json.tabBar?.list || []).map(
        (item) => `/${String(item.pagePath || '').replace(/^\//, '')}`
      )
    )

    function pathToKeys(fullPath) {
      if (aliasMap[fullPath]) {
        return aliasMap[fullPath]
      }
      const parts = fullPath.split('/').filter(Boolean)
      const last = parts[parts.length - 1]
      let key = last === 'index' && parts.length > 1 ? parts[parts.length - 2] : last
      key = key.replace(/-([a-z])/g, (_, g) => g.toUpperCase())
      return [key]
    }

    /** 注册别名：同名但指向不同路径时告警（保持既有"后写覆盖"行为不变） */
    function registerAlias(key, routeItem) {
      const existing = routesMap[key]
      if (existing && existing.path !== routeItem.path) {
        console.warn(
          `⚠️ [Auto Routes] 路由别名冲突: "${key}" 同时对应 ${existing.path} 与 ${routeItem.path}，保留后者，` +
            `被覆盖页面请用完整路径跳转`
        )
      }
      routesMap[key] = routeItem
    }

    // 1. 收集主包页面
    ;(json.pages || []).forEach((page) => {
      const fullPath = `/${page.path}`
      const keys = pathToKeys(fullPath)
      const routeItem = {
        path: fullPath,
        ...(tabPaths.has(fullPath) ? { tab: true } : {})
      }
      keys.forEach((key) => registerAlias(key, routeItem))
    })

    // 2. 收集分包页面
    ;(json.subPackages || []).forEach((sub) => {
      const root = (sub.root || '').replace(/\/+$/, '')
      ;(sub.pages || []).forEach((page) => {
        const fullPath = `/${root}/${page.path}`
        const keys = pathToKeys(fullPath)
        const routeItem = { path: fullPath }
        keys.forEach((key) => registerAlias(key, routeItem))
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

    // 内容比对时归一化行尾并剔除时间戳行：路由实质未变化则跳过写入，
    // 避免每次编译都产生 git diff 噪音与无谓的 watch 重编译
    // （git autocrlf 检出的 CRLF 文件与脚本生成的 LF 也能正确比对）
    const stripTimestamp = (content) =>
      content.replace(/\r\n/g, '\n').replace(/^ \* 自动生成时间:.*$/m, '')
    if (
      fs.existsSync(routesTsPath) &&
      stripTimestamp(fs.readFileSync(routesTsPath, 'utf-8')) === stripTimestamp(tsContent)
    ) {
      console.log('✅ [Auto Routes] src/utils/routes.ts 内容无变化，跳过写入')
      return
    }

    fs.writeFileSync(routesTsPath, tsContent, 'utf-8')
    console.log('⚡ [Auto Routes] 已成功根据 pages.json 编译生成 src/utils/routes.ts')
  } catch (err) {
    console.error('[Auto Routes] 编译路由失败:', err)
  }
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  generateRoutes()
}
