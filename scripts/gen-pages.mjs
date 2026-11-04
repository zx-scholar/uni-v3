import fs from 'fs'
import path from 'path'
import { pathToFileURL } from 'url'
import { generateRoutes } from './gen-routes.mjs'

const rootDir = process.cwd()
const srcDir = path.resolve(rootDir, 'src')
const basePagesPath = path.resolve(rootDir, 'src/pages.base.json')
const targetPagesPath = path.resolve(rootDir, 'src/pages.json')

/**
 * 递归扫描子包目录下的所有 .vue 页面组件
 */
function scanVuePages(dir, rootSubDir, pagesList = []) {
  if (!fs.existsSync(dir)) return pagesList
  const entries = fs.readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      scanVuePages(fullPath, rootSubDir, pagesList)
    } else if (entry.isFile() && entry.name.endsWith('.vue')) {
      if (entry.name !== 'index.vue' && /^[A-Z]/.test(entry.name)) {
        continue
      }
      const relativePath = path.relative(rootSubDir, fullPath).replace(/\\/g, '/')
      const pagePathWithoutExt = relativePath.replace(/\.vue$/, '')
      pagesList.push({
        path: pagePathWithoutExt,
        style: { navigationStyle: 'custom' },
      })
    }
  }
  return pagesList
}

/**
 * 自动扫描 src/ 目录下所有 pages-* 格式的子包目录
 */
function discoverSubpackageModules() {
  const map = {}
  if (!fs.existsSync(srcDir)) return map

  const entries = fs.readdirSync(srcDir, { withFileTypes: true })
  entries.forEach((entry) => {
    if (entry.isDirectory() && entry.name.startsWith('pages-')) {
      const folderName = entry.name
      const featureKey = folderName.replace(/^pages-/, '')
      const configPath = path.join('src', folderName, 'pages.config.mjs')
      map[featureKey] = {
        configPath,
        root: folderName,
        folderPath: path.join(srcDir, folderName),
      }
    }
  })
  return map
}

/**
 * 动态加载 src/config/features.config.mjs 子包白名单配置
 * （与子包 pages.config.mjs 使用同一套动态 import 机制，天然支持 JS 全量语法）
 */
async function loadFeatureConfig() {
  const configPath = path.resolve(rootDir, 'src/config/features.config.mjs')

  if (!fs.existsSync(configPath)) {
    throw new Error('[Pluggable Pages] 未找到 src/config/features.config.mjs，无法确定子包白名单')
  }

  // ?t= 时间戳绕过 Node ESM import 缓存，保证配置修改后立即生效
  const imported = await import(`${pathToFileURL(configPath).href}?t=${Date.now()}`)
  const config = imported && imported.default

  if (!config || typeof config !== 'object' || !Array.isArray(config.default)) {
    throw new Error(
      `[Pluggable Pages] ${path.relative(rootDir, configPath)} 导出结构异常，应为 { default: [], environments: {} }`
    )
  }
  return config
}

/**
 * 根据编译环境 mode 自动扫描并组装生成 pages.json
 * @param {string} mode - 当前构建环境模式
 * @param {'serve' | 'build'} command - Vite 命令：serve 失败仅警告不中断，build 失败抛错终止构建
 */
export async function generatePagesJson(mode = 'development', command = 'build') {
  try {
    // 1. 读取子包白名单配置（文件缺失/结构异常均直接抛错）
    const featureConfig = await loadFeatureConfig()

    // 2. 环境模式严格校验：仅 development/production 允许回退 default 白名单；
    //    其余 mode 必须在 environments 中显式注册，防止环境名拼错时静默打入全量子包
    const knownModes = new Set([
      'development',
      'production',
      ...Object.keys(featureConfig.environments || {}),
    ])
    if (!knownModes.has(mode)) {
      throw new Error(
        `[Pluggable Pages] 未知构建环境 mode="${mode}"，可用环境: [${[...knownModes].join(', ')}]。` +
          `请在 src/config/features.config.mjs 的 environments 中注册该环境，或检查 --mode 拼写`
      )
    }

    const enabledList =
      featureConfig.environments && Array.isArray(featureConfig.environments[mode])
        ? featureConfig.environments[mode]
        : featureConfig.default

    console.log(`🌐 [Pluggable Pages] 匹配构建环境: [${mode}]`)
    console.log(`📋 [Pluggable Pages] 编译打入子包白名单: [${enabledList.join(', ')}]`)

    // 3. 读取基础页面配置 (主包)
    if (!fs.existsSync(basePagesPath)) {
      throw new Error('[Pluggable Pages] 未找到 src/pages.base.json，无法组装主包页面')
    }

    const baseContent = fs.readFileSync(basePagesPath, 'utf-8')
    const finalConfig = JSON.parse(baseContent)

    finalConfig.subPackages = []
    const enabledPackageRoots = []

    // 4. 动态识别 src/ 下所有 pages-* 格式的子包，判断是否包含在白名单数组中
    const subPackageMap = discoverSubpackageModules()

    for (const [key, meta] of Object.entries(subPackageMap)) {
      // 🔑 规则：包含在数组里即编译打入，未包含即忽略屏蔽
      const isEnabled = enabledList.includes(key)

      if (isEnabled) {
        const absoluteConfigPath = path.resolve(rootDir, meta.configPath)

        if (fs.existsSync(absoluteConfigPath)) {
          const subModule = await import(`${pathToFileURL(absoluteConfigPath).href}?t=${Date.now()}`)

          // 校验清单结构：必须是 { root, pages: [...] } 形态
          if (!subModule.default || !Array.isArray(subModule.default.pages)) {
            throw new Error(
              `[Pluggable Pages] 子包 [${key}] 的 ${meta.configPath} 导出结构异常，应为 { root, name, pages: [] }`
            )
          }

          // 逐条校验页面路径对应的 .vue 文件真实存在，尽早暴露路径手误
          const missingPages = subModule.default.pages
            .map((page) => page && page.path)
            .filter((pagePath) => !pagePath || !fs.existsSync(path.join(meta.folderPath, `${pagePath}.vue`)))
          if (missingPages.length > 0) {
            throw new Error(
              `[Pluggable Pages] 子包 [${key}] 的 ${meta.configPath} 配置了不存在的页面: [${missingPages.join(', ')}]`
            )
          }

          finalConfig.subPackages.push(subModule.default)
          enabledPackageRoots.push(meta.root)
          console.log(`🔌 [Pluggable Pages] 已挂载子包: [${key}] (${meta.root})`)
        } else {
          const scannedPages = scanVuePages(meta.folderPath, meta.folderPath)
          if (scannedPages.length > 0) {
            const autoSubpackage = {
              root: meta.root,
              name: meta.root,
              pages: scannedPages,
            }
            finalConfig.subPackages.push(autoSubpackage)
            enabledPackageRoots.push(meta.root)
            console.log(`✨ [Pluggable Pages] 自动扫描挂载子包: [${key}] (包含 ${scannedPages.length} 个页面)`)
          }
        }
      } else {
        console.log(`🚫 [Pluggable Pages] 已排除子包(未包含在数组中): [${key}]`)
      }
    }

    // 5. 按配置生成分包预下载规则：packages 过滤为当前环境实际打入的分包，
    //    某条规则的 packages 全部被剔除时该规则整体不生成
    const generatedPreload = {}
    for (const [pagePath, rule] of Object.entries(featureConfig.preloadRule || {})) {
      const activePackages = ((rule && Array.isArray(rule.packages)) ? rule.packages : [])
        .filter((pkg) => enabledPackageRoots.includes(pkg))
      if (activePackages.length > 0) {
        generatedPreload[pagePath] = { ...rule, packages: activePackages }
      }
    }
    if (Object.keys(generatedPreload).length > 0) {
      finalConfig.preloadRule = generatedPreload
    } else {
      delete finalConfig.preloadRule
    }

    // 6. 写入最终的 src/pages.json（内容无变化时跳过，减少无谓重编译；
    //    行尾归一化，兼容 git autocrlf 检出的 CRLF 文件）
    const outputContent = JSON.stringify(finalConfig, null, 2)
    const existingContent = fs.existsSync(targetPagesPath)
      ? fs.readFileSync(targetPagesPath, 'utf-8').replace(/\r\n/g, '\n')
      : null
    if (existingContent === outputContent) {
      console.log('✅ [Pluggable Pages] src/pages.json 内容无变化，跳过写入')
    } else {
      fs.writeFileSync(targetPagesPath, outputContent, 'utf-8')
      console.log('⚡ [Pluggable Pages] src/pages.json 成功组装生成！')
    }

    // 7. 联动重新编译生成 src/utils/routes.ts 路由别名字典
    await generateRoutes()
  } catch (err) {
    if (command === 'serve') {
      // dev 场景不中断开发，保留磁盘上现有的 pages.json
      console.error('❌ [Pluggable Pages] 生成 pages.json 失败 (serve 仅警告，继续使用现有文件):', err)
      return
    }
    // 构建/CI 场景 fail-fast，避免带着过期路由表打出错误产物
    throw err
  }
}

/**
 * dev 服务器用：监听自动扫描型分包（无 pages.config.mjs）的 .vue 文件增删，
 * 联动重新生成 pages.json（仅 serve 场景使用，失败仅警告不中断）
 */
export function watchAutoScanPages(server, mode) {
  let timer = null

  const handleFileChange = (file) => {
    const normalized = String(file).replace(/\\/g, '/')
    // 匹配 src/pages-xxx/ 下的文件（包名后必须是 / 或结尾，兼容直接位于分包根的页面）
    const match = normalized.match(/\/src\/(pages-[^/]+)(\/|$)/)
    if (!match) return

    const folderName = match[1]
    // 有 pages.config.mjs 的分包由清单显式管理，新增 .vue 不改变路由
    if (fs.existsSync(path.join(srcDir, folderName, 'pages.config.mjs'))) return

    // 去抖：编辑器保存/目录拖拽可能触发一连串事件
    clearTimeout(timer)
    timer = setTimeout(() => {
      console.log(`👁 [Pluggable Pages] 检测到分包 [${folderName}] 页面文件变动，重新生成...`)
      generatePagesJson(mode, 'serve').catch(() => {})
    }, 200)
  }

  server.watcher.on('add', handleFileChange)
  server.watcher.on('unlink', handleFileChange)
  server.watcher.on('unlinkDir', handleFileChange)
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  const modeArg = process.argv[2] || 'development'
  generatePagesJson(modeArg)
}
