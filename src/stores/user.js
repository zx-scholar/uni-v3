import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useUserStore = defineStore(
  'user',
  () => {
    const userInfo = ref({})
    const loginInfo = ref({})
    const netUserId = ref('')
    const phoneNum = ref('')

    const isProfileReady = computed(() => Boolean(userInfo.value.nickName))
    const isLoggedIn = computed(() => Boolean(netUserId.value && loginInfo.value.accessToken))

    function setUserInfo(info = {}) {
      userInfo.value = { ...userInfo.value, ...info }
    }

    function setWechatSession(info = {}) {
      loginInfo.value = {
        ...loginInfo.value,
        openId: info.openId || '',
        unionId: info.unionId || ''
      }
    }

    function setLoginResult(data = {}, mobile = '') {
      const netUser = data.netUser || {}
      netUserId.value = data.netUserId || netUser.id || ''
      phoneNum.value = mobile || netUser.mobileNum || ''
      loginInfo.value = {
        ...loginInfo.value,
        accessToken: netUser.accessToken || data.accessToken || '',
        accountId: netUser.coAccountId || data.accountId || '',
        coAppId: netUser.coAppId || data.coAppId || '',
        mobileNum: phoneNum.value
      }

      if (netUser.avatar || netUser.nickName) {
        setUserInfo({
          avatarUrl: netUser.avatar || userInfo.value.avatarUrl || '',
          nickName: userInfo.value.nickName || netUser.nickName || ''
        })
      }

      if (loginInfo.value.accessToken) {
        uni.setStorageSync('token', loginInfo.value.accessToken)
      }
      uni.setStorageSync('netUserId', netUserId.value)
      uni.setStorageSync('phoneNum', phoneNum.value)
    }

    function clearLogin() {
      userInfo.value = {}
      loginInfo.value = {}
      netUserId.value = ''
      phoneNum.value = ''
      uni.removeStorageSync('token')
      uni.removeStorageSync('openId')
      uni.removeStorageSync('unionId')
      uni.removeStorageSync('netUserId')
      uni.removeStorageSync('phoneNum')
    }

    return {
      userInfo,
      loginInfo,
      netUserId,
      phoneNum,
      isProfileReady,
      isLoggedIn,
      setUserInfo,
      setWechatSession,
      setLoginResult,
      clearLogin
    }
  },
  {
    persist: {
      key: 'user-store-state'
    }
  }
)
