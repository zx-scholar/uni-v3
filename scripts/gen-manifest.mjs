import fs from 'fs'
import path from 'path'
import { pathToFileURL } from 'url'
import { ENV_DICTIONARY } from '../src/config/environments.ts'

/**
 * 按当前 --mode 将环境身份信息同步写入 src/manifest.json
 *
 * 为什么需要这一步：
 *   uni-app CLI 读取的是 src/manifest.json 里的 mp-weixin.appid，它对 --mode 一无所知。
 *   此前 environments.ts 里为每个环境声明的 appid 只被接口层当作入参使用，
 *   产物 appid 恒等于 manifest.json 里写死的那个值（构建 golf 包出来仍是 qdgx 的号）。
 *   在这里把两边接上，--mode 才真正决定"打包到谁的账号下"。
 *
 * 约定与 pages.json 一致：内容无变化则跳过写入，行尾归一化，serve 失败仅警告。
 */

const rootDir = process.cwd()
const manifestPath = path.resolve(rootDir, 'src/manifest.json')

/** 需要按环境覆写的 manifest 字段：(manifest 路径, 环境配置取值函数) */
const ENV_MANIFEST_FIELDS = [
  {
    label: 'mp-weixin.appid',
    read: (manifest) => manifest['mp-weixin'] && manifest['mp-weixin'].appid,
    write: (manifest, envConfig) => {
      manifest['mp-weixin'].appid = envConfig.appid
    },
  },
]

/**
 * 同步 manifest.json
 * @param {string} mode - 当前构建环境模式
 * @param {'serve' | 'build'} command - serve 失败仅警告；build 失败抛错终止
 */
export async function syncManifest(mode = 'development', command = 'build') {
  try {
    const envConfig = ENV_DICTIONARY[mode]
    if (!envConfig) {
      throw new Error(
        `[Manifest Sync] 未知构建环境 mode="${mode}"，未在 src/config/environments.ts 的 ENV_DICTIONARY 中注册。` +
          `可用环境: [${Object.keys(ENV_DICTIONARY).join(', ')}]`
      )
    }
    if (!envConfig.appid) {
      throw new Error(
        `[Manifest Sync] 环境 [${mode}] 缺少必填配置 appid，请在 src/config/environments.ts 中补齐`
      )
    }

    if (!fs.existsSync(manifestPath)) {
      throw new Error('[Manifest Sync] 未找到 src/manifest.json')
    }

    const rawContent = fs.readFileSync(manifestPath, 'utf-8').replace(/\r\n/g, '\n')
    const manifest = JSON.parse(rawContent)
    const endsWithNewline = rawContent.endsWith('\n')

    // 同步前记录旧值，便于日志对比
    const changes = []

    for (const field of ENV_MANIFEST_FIELDS) {
      const before = field.read(manifest)
      field.write(manifest, envConfig)
      const after = field.read(manifest)
      if (before !== after) {
        changes.push(`${field.label}: ${before || '(空)'} -> ${after}`)
      }
    }

    if (changes.length === 0) {
      console.log(`✅ [Manifest Sync] src/manifest.json 已与环境 [${mode}] 一致，跳过写入`)
      return
    }

    const outputContent = JSON.stringify(manifest, null, 2) + (endsWithNewline ? '\n' : '')
    fs.writeFileSync(manifestPath, outputContent, 'utf-8')

    console.log(`🌐 [Manifest Sync] 环境 [${mode}] (${envConfig.title})`)
    changes.forEach((change) => console.log(`⚡ [Manifest Sync] ${change}`))
  } catch (err) {
    if (command === 'serve') {
      // dev 场景不中断开发，保留磁盘上现有的 manifest.json
      console.error(
        '❌ [Manifest Sync] 同步 manifest.json 失败 (serve 仅警告，继续使用现有文件):',
        err
      )
      return
    }
    // 构建场景 fail-fast，避免带着错误 appid 打出产物
    throw err
  }
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  const modeArg = process.argv[2] || 'development'
  syncManifest(modeArg)
}
