import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { MiniAppInfo } from '@/types'
import { env } from '@/config/appConfig'

/**
 * 应用全局基础信息 Store
 */
export const useAppStore = defineStore(
  'app',
  () => {
    // 1. 挂载不可变的环境配置单例 (供 Vue 页面/模板响应式读取)
    const envConfig = env

    // 2. 状态定义
    const miniAppInfo = ref<MiniAppInfo>({})
    const isLoaded = ref<boolean>(false)

    // 3. 计算属性 Getters
    const centerId = computed(() => miniAppInfo.value.centerId || '')
    const appName = computed(() => miniAppInfo.value.name || envConfig.title || '')
    const logo = computed(() => miniAppInfo.value.logo || '')
    const theme = computed(() => miniAppInfo.value.theme || 'primary-blue')

    // 4. 动作 Actions
    function setMiniAppInfo(info: MiniAppInfo = {}) {
      miniAppInfo.value = info
      isLoaded.value = true
    }

    function clearMiniAppInfo() {
      miniAppInfo.value = {}
      isLoaded.value = false
    }

    return {
      envConfig,
      miniAppInfo,
      isLoaded,
      centerId,
      appName,
      logo,
      theme,
      setMiniAppInfo,
      clearMiniAppInfo
    }
  },
  {
    persist: {
      key: 'app-store-state',
      paths: ['miniAppInfo', 'isLoaded']
    }
  }
)
