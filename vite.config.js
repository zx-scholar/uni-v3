import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'

/**
 * 自定义 PostCSS 插件：自动将 CSS 中的 px 单位编译转换为 uni-app 的 rpx 单位
 * - 默认转换比例：1px = 2rpx (基于 375px 视觉设计稿，写入 16px 会自动编译为 32rpx)
 * - 自动忽略：0px、1px (细边框保护) 或带有 / *no* / 标注的 CSS 行
 */
const pxToRpxPlugin = (options = {}) => {
  const multiplier = options.multiplier || 2
  return {
    postcssPlugin: 'postcss-px-to-rpx',
    Declaration(decl) {
      if (!decl.value || !decl.value.includes('px')) return
      // 保护注释
      if (decl.value.includes('/* no */') || decl.value.includes('/* px */')) return

      decl.value = decl.value.replace(/(\d+(\.\d+)?)px/g, (match, p1) => {
        const num = parseFloat(p1)
        // 0px 或 1px 细边框保持不变
        if (num === 0 || num === 1) return match
        return `${num * multiplier}rpx`
      })
    }
  }
}
pxToRpxPlugin.postcss = true

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [uni()],
  css: {
    postcss: {
      plugins: [
        pxToRpxPlugin({ multiplier: 2 }) // 1px -> 2rpx 自动编译转换
      ]
    }
  },
  server: {
    port: 5173,
    proxy: {
      '/aisports-api': {
        target: 'https://webtest.wishare.com.cn',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
