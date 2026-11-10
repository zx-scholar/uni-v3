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
      // 存储键是数据身份标识，一经发布不可改名（改名等于丢弃用户已有的持久化数据）
      key: 'app-store-state',
      // ⚠️ 字段名必须是 pick（pinia-plugin-persistedstate v4；v3 时代的 paths 已废弃）。
      // 写成 paths 不会报错，会被插件静默忽略 —— 等于没有任何过滤，整个 $state 全量持久化。
      // 当前 $state 恰好只有这两项，所以历史上没出问题；但一旦后续往 store 里加 ref
      // （缓存、定位、草稿……），就会在无人察觉的情况下被写进本地存储。
      //
      // 另注：envConfig 是普通冻结对象（非 ref / 非 reactive），根本不会进入 $state，
      // 所以它本来就不会被持久化。但不要依赖这个巧合 —— 显式 pick 才是护栏。
      pick: ['miniAppInfo', 'isLoaded']
    }
  }
)
