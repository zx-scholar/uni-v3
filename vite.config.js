import { defineConfig, loadEnv } from 'vite';
import uni from '@dcloudio/vite-plugin-uni';

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
  // 读取当前环境的 .env 文件，用于代理目标等配置
  const env = loadEnv(mode, process.cwd(), 'VITE_');

  return {
    plugins: [uni()],
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
        '/aisports-api': {
          target: env.VITE_APP_PREFIX || 'https://webtest.wishare.com.cn',
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
