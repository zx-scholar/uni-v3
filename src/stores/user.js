import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

/**
 * 用户认证与个人信息 Store（登录/用户数据的唯一数据源）
 *
 * 持久化策略：
 *   - 登录凭证（openId / unionId / token 等）→ 自动持久化到 Storage
 *   - 用户详情（netUser / userInfo / netUserId）→ 内存级，每次启动重新获取
 */
export const useUserStore = defineStore(
  'user',
  () => {
    // ========== 持久化状态（登录凭证） ==========
    const openId = ref('')
    const unionId = ref('')
    const accessToken = ref('')
    const accountId = ref('')
    const coAppId = ref('')
    const mobileNum = ref('')

    // ========== 非持久化状态（用户详情） ==========
    const netUserId = ref('')
    const userInfo = ref({})           // { avatarUrl, nickName, ... }
    const isProfileReady = ref(false)  // 是否已完成头像昵称设置

    // ========== Getters ==========
    const loginInfo = computed(() => ({
      openId: openId.value,
      unionId: unionId.value,
      accessToken: accessToken.value,
      accountId: accountId.value,
      coAppId: coAppId.value,
      mobileNum: mobileNum.value,
    }))

    const isLoggedIn = computed(() => !!netUserId.value)
    const hasUserInfo = computed(() => !!netUserId.value)

    // ========== Actions ==========

    /** 设置登录凭证（wx.login 换取后调用） */
    function setWechatSession(session = {}) {
      if (session.openId !== undefined) openId.value = session.openId
      if (session.unionId !== undefined) unionId.value = session.unionId
      if (session.accessToken !== undefined) accessToken.value = session.accessToken
      if (session.accountId !== undefined) accountId.value = session.accountId
      if (session.coAppId !== undefined) coAppId.value = session.coAppId
      if (session.mobileNum !== undefined) mobileNum.value = session.mobileNum
    }

    /** 设置用户个人信息（头像、昵称等） */
    function setUserInfo(info = {}) {
      userInfo.value = { ...userInfo.value, ...info }
      if (info.avatarUrl && info.nickName) {
        isProfileReady.value = true
      }
    }

    /** 登录成功后设置完整用户数据（兼容 initialize 静默登录 + 页面绑定登录） */
    function setLoginResult(data = {}, phone = '') {
      if (data.openId) openId.value = data.openId
      if (data.unionId) unionId.value = data.unionId
      if (data.accessToken) accessToken.value = data.accessToken
      if (data.coAccountId) accountId.value = data.coAccountId
      if (data.coAppId) coAppId.value = data.coAppId
      if (data.mobileNum) mobileNum.value = data.mobileNum
      if (data.netUserId) netUserId.value = data.netUserId
      if (data.avatar || data.nickName) {
        setUserInfo({ avatarUrl: data.avatar, nickName: data.nickName })
      }
    }

    /** 设置后端用户 ID（queryUserinfoByUnionId 返回后调用） */
    function setNetUserId(id) {
      netUserId.value = id
      userInfo.value = { ...userInfo.value, netUserId: id }
    }

    /** 清空登录态（退出登录） */
    function clearLogin() {
      openId.value = ''
      unionId.value = ''
      accessToken.value = ''
      accountId.value = ''
      coAppId.value = ''
      mobileNum.value = ''
      netUserId.value = ''
      userInfo.value = {}
      isProfileReady.value = false
    }

    return {
      // 原始状态
      openId, unionId, accessToken, accountId, coAppId, mobileNum,
      netUserId, userInfo, isProfileReady,
      // getters
      loginInfo, isLoggedIn, hasUserInfo,
      // actions
      setWechatSession, setUserInfo, setLoginResult, setNetUserId, clearLogin,
    }
  },
  {
    persist: {
      key: 'user-store',
      // 只持久化登录凭证，用户详情每次启动重新获取
      pick: ['openId', 'unionId', 'accessToken', 'accountId', 'coAppId', 'mobileNum'],
    },
  }
)
