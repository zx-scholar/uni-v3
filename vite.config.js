import { defineConfig } from 'vite';
import uni from '@dcloudio/vite-plugin-uni';
import { generatePagesJson, watchAutoScanPages } from './scripts/gen-pages.mjs';
import { syncManifest } from './scripts/gen-manifest.mjs';
import { ENV_DICTIONARY } from './src/config/environments';

/**
 * 自定义 Vite 插件：与环境 mode 联动的可插拔模块化编译插件
 * - 自动识别当前环境模式 (--mode qdgx / hangzhou / sportsdev / tangfang 等)
 * - 动态匹配 src/config/features.config.ts 生成对应环境的 src/pages.json 和 src/utils/routes.ts
 * - 按同一 mode 覆写 src/manifest.json 的 mp-weixin.appid（否则产物 appid 与本环境脱钩）
 */
const pluggablePagesPlugin = (mode, command) => ({
  name: 'vite-plugin-pluggable-pages',
  // 构建场景安全网：build --watch 下每次重建重新生成（幂等）。
  // 首次生成已在 defineConfig 回调体最开头完成（早于 uni 插件的所有钩子）。
  async buildStart() {
    if (command === 'build') {
      await syncManifest(mode, command)
      await generatePagesJson(mode, command)
    }
  },
  // dev 场景：自动扫描型分包（无 pages.config.mjs）的 .vue 增删联动重新生成
  configureServer(server) {
    watchAutoScanPages(server, mode);
  },
  async handleHotUpdate({ file }) {
    const normalized = String(file).replace(/\\/g, '/')

    // environments.ts 变了：appid 等身份信息需要重新落到 manifest.json
    if (normalized.includes('config/environments.ts')) {
      await syncManifest(mode, 'serve')
      return
    }

    if (
      normalized.includes('features.config.mjs') ||
      normalized.includes('routes-alias.mjs') ||
      normalized.includes('pages.base.json') ||
      normalized.includes('pages.config.mjs')
    ) {
      // dev 场景：配置热更新时重新生成，失败仅警告不中断
      await generatePagesJson(mode, 'serve')
    }
  },
});

/**
 * 自定义 PostCSS 插件：自动将 CSS 中的 px 单位编译转换为 uni-app 的 rpx 单位
 * - 转换比例：1px = 1rpx (基于标准的 750px 微信小程序/uni-app 设计稿尺寸，1:1 转换)
 * - 自动忽略：0px、1px (1px 细边框保持不变) 或带有  no  注释的行
 */
const pxToRpxPlugin = (options = {}) => {
  const multiplier = options.multiplier || 1;
  return {
    postcssPlugin: 'postcss-px-to-rpx',
    Declaration(decl) {
      if (!decl.value || !decl.value.includes('px')) return;
      // 保护带注释的样式行
      if (decl.value.includes('/* no */') || decl.value.includes('/* px */')) return;

      decl.value = decl.value.replace(/(\d+(\.\d+)?)px/g, (match, p1) => {
        const num = parseFloat(p1);
        // 0px 或 1px 细边框保持原样不变
        if (num === 0 || num === 1) return match;
        return `${num * multiplier}rpx`;
      });
    },
  };
};
pxToRpxPlugin.postcss = true;

// https://vitejs.dev/config/
export default defineConfig(async ({ mode, command }) => {
  // ⏱ 尽早生成配置产物：用户 config 函数先于所有插件钩子执行，
  // 确保 uni CLI/插件首次读取 src/pages.json、src/manifest.json 时已是本次环境的最新内容。
  // （此前挂在 buildStart 里，uni 早期阶段读到的是上一次运行留下的旧文件）
  //
  // ⚠️ 顺序不能反：先落 manifest 的 appid，再生成 pages.json —— 后者会联动重写 routes.ts，
  // 两者都必须在 uni 插件读取配置之前完成。
  await syncManifest(mode, command);
  await generatePagesJson(mode, command);

  // 从集中式多环境字典 src/config/environments.ts 读取当前 mode 的代理配置
  // 未知 mode / 缺少必填字段一律抛错：绝不静默回退到默认环境或生产域名
  const targetEnv = ENV_DICTIONARY[mode];
  if (!targetEnv) {
    throw new Error(
      `[vite] 未知构建环境 mode="${mode}"，未在 src/config/environments.ts 的 ENV_DICTIONARY 中注册。` +
        `可用环境: [${Object.keys(ENV_DICTIONARY).join(', ')}]`
    );
  }
  const { origin, webRoot } = targetEnv;
  if (!origin || !webRoot) {
    throw new Error(
      `[vite] 环境 [${mode}] 缺少代理必需配置 origin / webRoot，请在 src/config/environments.ts 中补齐`
    );
  }

  return {
    plugins: [
      pluggablePagesPlugin(mode, command),
      uni(),
    ],
    css: {
      preprocessorOptions: {
        scss: {
          // Vite 5.x 仍通过 Dart Sass 的 legacy API 编译 scss，
          // 这里静音其弃用提示（仅关闭提示，不影响编译结果）
          silenceDeprecations: ['legacy-js-api'],
        },
      },
      postcss: {
        plugins: [
          pxToRpxPlugin({ multiplier: 1 }), // 1px -> 1rpx 精准编译转换 (基于 750px 设计稿)
        ],
      },
    },
    server: {
      host: '0.0.0.0',
      port: 5173,
      proxy: {
        [webRoot]: {
          target: origin,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
