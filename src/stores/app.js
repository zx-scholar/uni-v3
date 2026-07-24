import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

/**
 * 应用全局基础信息 Store
 */
export const useAppStore = defineStore(
  'app',
  () => {
    // 状态定义
    const miniAppInfo = ref({})
    const isLoaded = ref(false)

    // 计算属性 Getters
    const centerId = computed(() => miniAppInfo.value.centerId || '')
    const appName = computed(() => miniAppInfo.value.name || '')
    const logo = computed(() => miniAppInfo.value.logo || '')
    const theme = computed(() => miniAppInfo.value.theme || 'primary-blue')

    // 动作 Actions
    function setMiniAppInfo(info = {}) {
      miniAppInfo.value = info
      isLoaded.value = true

      // 如果有 centerId，同步保持到本地独立的 centerId 缓存（供请求加密拦截使用）
      if (info.centerId) {
        uni.setStorageSync('centerId', info.centerId)
      }
    }

    function clearMiniAppInfo() {
      miniAppInfo.value = {}
      isLoaded.value = false
      uni.removeStorageSync('centerId')
    }

    return {
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
    // 启用自动持久化存储（借助 main.js 配置的 uni-storage 适配器）
    persist: {
      key: 'app-store-state'
    }
  }
)
