import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [uni()],
  server: {
    port: 5173,
    proxy: {
      // 在 H5 本地开发环境将 /aisports-api 代理请求转发到目标测试服务器，解决 CORS 跨域问题
      '/aisports-api': {
        target: 'https://webtest.wishare.com.cn',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
