import fs from 'fs'
import path from 'path'
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
 * 安全解析 src/config/features.config.ts 配置文件中的数组列表
 */
function loadFeatureConfig() {
  const tsPath = path.resolve(rootDir, 'src/config/features.config.ts')
  const jsPath = path.resolve(rootDir, 'src/config/features.config.js')
  const targetPath = fs.existsSync(tsPath) ? tsPath : jsPath

  if (!fs.existsSync(targetPath)) return { default: [], environments: {} }

  const raw = fs.readFileSync(targetPath, 'utf-8')
  // 剥离注释与 export 关键字提取对象字面量
  const clean = raw
    .replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '')
    .replace(/export\s+const\s+features(?::\s*[^=]+)?\s*=\s*/, 'return ')
    .replace(/export\s+default\s+features;?/, '')
    .trim()

  try {
    const fn = new Function(clean)
    return fn()
  } catch (err) {
    console.error('❌ [Pluggable Pages] 解析 features.config.ts 失败:', err)
    return { default: [], environments: {} }
  }
}

/**
 * 根据编译环境 mode 自动扫描并组装生成 pages.json
 * @param {string} mode - 当前构建环境模式
 */
export async function generatePagesJson(mode = 'development') {
  try {
    // 1. 读取 TypeScript 功能开关数组配置
    const featureConfig = loadFeatureConfig()

    // 2. 环境模式匹配：若 environments[mode] 存在且为数组，优先使用，否则使用 default 数组
    const enabledList =
      featureConfig.environments && Array.isArray(featureConfig.environments[mode])
        ? featureConfig.environments[mode]
        : Array.isArray(featureConfig.default)
        ? featureConfig.default
        : []

    console.log(`🌐 [Pluggable Pages] 匹配构建环境: [${mode}]`)
    console.log(`📋 [Pluggable Pages] 编译打入子包白名单: [${enabledList.join(', ')}]`)

    // 3. 读取基础页面配置 (主包)
    if (!fs.existsSync(basePagesPath)) {
      console.warn('[Pluggable Pages] 未找到 src/pages.base.json')
      return
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
          const subModule = await import(`file://${absoluteConfigPath}?t=${Date.now()}`)
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

    // 5. 动态生成分包预加载规则 (若包含 pages-golf)
    if (enabledPackageRoots.includes('pages-golf')) {
      finalConfig.preloadRule = {
        'pages/index/index': {
          network: 'all',
          packages: ['pages-golf'],
        },
      }
    } else {
      delete finalConfig.preloadRule
    }

    // 6. 写入最终的 src/pages.json
    const outputContent = JSON.stringify(finalConfig, null, 2)
    fs.writeFileSync(targetPagesPath, outputContent, 'utf-8')
    console.log('⚡ [Pluggable Pages] src/pages.json 成功组装生成！')

    // 7. 联动重新编译生成 src/utils/routes.ts 路由别名字典
    generateRoutes()
  } catch (err) {
    console.error('❌ [Pluggable Pages] 编译 pages.json 抛出异常:', err)
  }
}

if (process.argv[1] && process.argv[1].includes('gen-pages.mjs')) {
  const modeArg = process.argv[2] || 'development'
  generatePagesJson(modeArg)
}
