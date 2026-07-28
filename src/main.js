import { createSSRApp } from 'vue'
import * as Pinia from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'
import App from './App.vue'

// 引入全局组件与路由工具
import NavBar from '@/components/NavBar/NavBar.vue'
import Popup from '@/components/Popup/Popup.vue'
import router from '@/utils/router'

// 挂载全局 router 变量，使全项目所有 <script setup> 无需 import router 即可使用 router.push(...)
globalThis.router = router

export function createApp() {
  const app = createSSRApp(App)

  // 1. 全局注册 NavBar、Popup 组件 (全项目模板无需 import 即可直接使用)
  app.component('NavBar', NavBar)
  app.component('Popup', Popup)

  // 2. 全局挂载 $router 属性
  app.config.globalProperties.$router = router

  // 3. 初始化 Pinia 状态管理
  const pinia = Pinia.createPinia()

  // 配置持久化存储插件 (适配 uni-app 的 uni.setStorageSync / uni.getStorageSync)
  pinia.use(
    createPersistedState({
      storage: {
        getItem: (key) => uni.getStorageSync(key),
        setItem: (key, value) => uni.setStorageSync(key, value),
        removeItem: (key) => uni.removeStorageSync(key)
      }
    })
  )

  app.use(pinia)

  return {
    app,
    Pinia
  }
}
