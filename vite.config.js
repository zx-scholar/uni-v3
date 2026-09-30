import { defineConfig } from 'vite';
import uni from '@dcloudio/vite-plugin-uni';
import { generatePagesJson } from './scripts/gen-pages.mjs';
import { ENV_DICTIONARY } from './src/config/environments';

/**
 * 自定义 Vite 插件：与环境 mode 联动的可插拔模块化编译插件
 * - 自动识别当前环境模式 (--mode qdgx / hangzhou / sportsdev / tangfang 等)
 * - 动态匹配 src/config/features.config.ts 生成对应环境的 src/pages.json 和 src/utils/routes.ts
 */
const pluggablePagesPlugin = (mode) => ({
  name: 'vite-plugin-pluggable-pages',
  async buildStart() {
    await generatePagesJson(mode);
  },
  async handleHotUpdate({ file }) {
    if (
      file.includes('features.config.ts') ||
      file.includes('features.config.js') ||
      file.includes('pages.base.json') ||
      file.includes('pages.config.mjs')
    ) {
      await generatePagesJson(mode);
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
export default defineConfig(({ mode }) => {
  // 从集中式多环境字典 src/config/environments.ts 读取当前 mode 的代理配置
  const targetEnv = ENV_DICTIONARY[mode] || ENV_DICTIONARY['development'];
  const webRoot = targetEnv.webRoot || '/aisports-api';
  const targetPrefix = targetEnv.prefix || targetEnv.origin || 'https://web.xports.cn';

  return {
    plugins: [
      pluggablePagesPlugin(mode),
      uni(),
    ],
    css: {
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
          target: targetPrefix,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
