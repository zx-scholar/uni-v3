<template>
  <view class="page-container">
    <NavBar title="登录" color="#000" />

    <scroll-view class="page-scroll-content scrollbar-hide" scroll-y>
      <view class="scroll-wrapper px-24">
        <!-- ============== 品牌区 ============== -->
        <view class="flex-column items-center pt-40 mb-24">
          <image class="brand-logo w-160 h-160 radius-full" :src="logo" mode="aspectFit" />
          <text class="fz-36 fw-6 c-t-primary mt-24 text-center">{{ appName }}</text>
        </view>

        <!-- ============== 第一步：选择登录方式 ============== -->
        <template v-if="step === 'methods'">
          <view class="bg-card radius-16 shadow-2 p-24">
            <!-- #ifdef MP-WEIXIN -->
            <button
              class="btn-primary"
              open-type="getPhoneNumber"
              :loading="submitting"
              :disabled="!openId || submitting"
              @getphonenumber="handleGetPhoneNumber"
            >
              手机号快捷登录
            </button>
            <text v-if="!openId" class="fz-24 c-t-sub text-center mt-16">
              正在获取微信登录凭证，请稍候…
            </text>
            <!-- #endif -->

            <button class="btn-secondary mt-24" :disabled="submitting" @click="showPhoneLogin">
              其他手机号登录
            </button>
          </view>

          <text class="fz-24 c-t-sub text-center mt-24">未注册的手机号将自动创建账号</text>
        </template>

        <!-- ============== 第二步：手机号 + 验证码 ============== -->
        <template v-else>
          <view class="bg-card radius-16 shadow-2 overflow-hidden">
            <view class="form-row flex items-center px-24">
              <text class="fz-26 c-t-secondary w-120">手机号码</text>
              <input
                v-model="phoneNum"
                class="flex-1 fz-30 c-t-primary"
                type="number"
                maxlength="11"
                placeholder="请输入手机号"
                placeholder-class="fz-30 c-t-sub"
                :cursor-spacing="120"
              />
            </view>

            <view class="mx-24 list-divider"></view>

            <view class="form-row flex items-center px-24">
              <text class="fz-26 c-t-secondary w-120">验证码</text>
              <input
                v-model="verifyCode"
                class="flex-1 fz-30 c-t-primary"
                type="number"
                maxlength="6"
                placeholder="请输入验证码"
                placeholder-class="fz-30 c-t-sub"
                :cursor-spacing="120"
              />
              <view
                class="code-button"
                :class="{ 'code-button--disabled': countdown > 0 || sendingCode }"
                @click="sendVerifyCode"
              >
                {{ codeButtonText }}
              </view>
            </view>
          </view>

          <button
            class="btn-primary mt-32"
            :loading="submitting"
            :disabled="submitting"
            @click="submitPhoneLogin"
          >
            登录
          </button>

          <text class="step-back fz-26 c-t-secondary text-center mt-24" @click="step = 'methods'">
            返回其他登录方式
          </text>
          <text class="fz-24 c-t-sub text-center mt-24">未注册的手机号将自动创建账号</text>
        </template>
      </view>
    </scroll-view>
  </view>
</template>

<script>
/**
 * 微信小程序端专属登录页
 *
 * 定位：仅服务微信小程序（依赖 uni.login 换 openId + 微信手机号授权）。
 * H5 端有独立登录页 pages-common/loginH5，本页在 H5 下会自动重定向过去。
 *
 * 流程：进入 → 静默换取微信会话 → 选择登录方式（手机号快捷 / 短信验证码）
 *       → bindMiniAppUser 绑定 → setLoginResult 写入 netUser → 回跳来源页
 */
import { bindMiniAppUser, loginByWechatCode, queryMiniAppInfo, sendLoginVerifyCode } from '@/api';
import { useAppStore } from '@/stores/app';
import { useUserStore, hasValidUserId } from '@/stores/user';
import { parseParams, isTabPage, LOGIN_PAGE } from '@/utils/router';

/** 默认头像：登录不再要求用户选择头像，后端未返回时统一兜底展示 */
const DEFAULT_AVATAR = '/static/logo.png';
/** 默认昵称：登录不再要求用户填写昵称 */
const DEFAULT_NICKNAME = '微信用户';

export default {
  name: 'LoginPage',

  data() {
    return {
      /** 'methods' 选择登录方式 | 'phone' 手机号验证码登录 */
      step: 'methods',
      phoneNum: '',
      verifyCode: '',
      countdown: 0,
      countdownTimer: null,
      sendingCode: false,
      submitting: false,
      returnUrl: ''
    };
  },

  computed: {
    appStore() {
      return useAppStore();
    },
    userStore() {
      return useUserStore();
    },
    logo() {
      return this.appStore.logo || DEFAULT_AVATAR;
    },
    appName() {
      return this.appStore.appName || '伏见桃山演示馆';
    },
    openId() {
      return this.userStore.openId || '';
    },
    miniAppId() {
      return this.appStore.miniAppInfo.id || '';
    },
    centerId() {
      const info = this.appStore.miniAppInfo;
      return info.initCenterId || info.centerId || '';
    },
    verifyCodeType() {
      return this.appStore.miniAppInfo.verifyCodeType || '';
    },
    codeButtonText() {
      return this.countdown > 0 ? `${this.countdown}s` : '获取验证码';
    }
  },

  async onLoad(options) {
    const params = parseParams(options);
    this.returnUrl = params.returnUrl || params.url || params.r || '';

    // 本页为微信小程序专属；H5 端有独立登录页（pages-common/loginH5）
    // #ifdef H5
    router.replace(LOGIN_PAGE.route, { returnUrl: this.returnUrl });
    return;
    // #endif

    // 已登录直接回跳，不再展示登录表单
    // 判据是 userStore.isLoggedIn（内部只看 netUserId 是否有效），
    // 与"接口是否调用成功""是否拿到 openId"无关
    if (this.userStore.isLoggedIn) {
      this.finishLogin();
      return;
    }

    await this.ensureMiniAppInfo();

    // #ifdef MP-WEIXIN
    await this.ensureWechatSession();
    // #endif
  },

  onUnload() {
    this.clearCountdown();
  },

  methods: {
    /** 加载当前小程序信息（appName / logo / centerId / 验证码类型） */
    async ensureMiniAppInfo() {
      if (this.miniAppId) return;
      try {
        const data = await queryMiniAppInfo();
        if (data && data.miniApp) {
          this.appStore.setMiniAppInfo(data.miniApp);
        }
      } catch (error) {
        // 请求层已统一提示错误，此处保留页面状态供用户重试
      }
    },

    /**
     * 静默获取微信登录凭证（openId / unionId）
     * 小程序端所有登录方式都依赖它，拿不到时后续绑定会失败
     * @param {boolean} force 是否强制重新获取（凭证失效时使用）
     * @returns {Promise<boolean>} 是否拿到可用凭证
     */
    async ensureWechatSession(force = false) {
      if (this.openId && !force) return true;
      try {
        const loginResult = await new Promise((resolve, reject) => {
          uni.login({ provider: 'weixin', success: resolve, fail: reject });
        });
        if (!loginResult.code) throw new Error('未获取到微信登录凭证');
        if (!this.miniAppId) await this.ensureMiniAppInfo();
        if (!this.miniAppId) throw new Error('小程序信息尚未加载');

        const session = await loginByWechatCode({
          code: loginResult.code,
          wechatMiniAppId: this.miniAppId
        });
        // 写入 store（持久化由 Pinia persist 自动处理）
        this.userStore.setWechatSession(session);
        return Boolean(session.openId);
      } catch (error) {
        uni.showToast({
          title: error.message || error.errMsg || '无法获取微信登录凭证',
          icon: 'none'
        });
        return false;
      }
    },

    /** 切换到手机号 + 验证码登录 */
    showPhoneLogin() {
      this.step = 'phone';
    },

    /**
     * 微信手机号快捷登录（旧版「获取手机号加密数据」协议）
     *
     * 本项目按旧版协议对接：前端把 detail.encryptedData + detail.iv 透传给
     * bindMiniAppUser，由服务端解密取得手机号。
     *
     * 微信另有新版「手机号快速验证」——只返回 detail.code，由服务端用 code
     * 换取手机号。若个别基础库不再返回 encryptedData / iv，此处引导用户改用
     * 其他手机号登录，不会静默失败。
     * 协议细节以微信官方文档「手机号快速验证组件」章节为准。
     */
    async handleGetPhoneNumber(event) {
      const detail = event.detail || (event.mp && event.mp.detail) || {};
      if (detail.errMsg && !detail.errMsg.includes(':ok')) {
        uni.showToast({ title: '需要授权手机号后才能登录', icon: 'none' });
        return;
      }
      // 旧版协议必须有加密字段；缺失说明该基础库只回 code，引导走短信登录
      if (!detail.encryptedData || !detail.iv) {
        uni.showToast({ title: '手机号授权失败，请改用其他手机号登录', icon: 'none' });
        return;
      }
      if (!(await this.ensureWechatSession())) return;
      await this.bindUser({ encryptedData: detail.encryptedData, iv: detail.iv });
    },

    isValidPhone() {
      return /^1\d{10}$/.test(this.phoneNum);
    },

    /** 发送短信验证码（60s 倒计时） */
    async sendVerifyCode() {
      if (this.countdown > 0 || this.sendingCode) return;
      if (!this.isValidPhone()) {
        uni.showToast({ title: '请输入正确的手机号', icon: 'none' });
        return;
      }
      // #ifdef MP-WEIXIN
      if (!this.openId) {
        if (!(await this.ensureWechatSession())) return;
      }
      // #endif
      this.sendingCode = true;
      try {
        const data = await sendLoginVerifyCode({
          centerId: this.centerId,
          phoneNum: this.phoneNum,
          verifyCodeType: this.verifyCodeType
        });
        this.startCountdown();
        if (data && data.message) {
          uni.showToast({ title: data.message, icon: 'none' });
        }
      } finally {
        this.sendingCode = false;
      }
    },

    async submitPhoneLogin() {
      if (!this.isValidPhone()) {
        uni.showToast({ title: '请输入正确的手机号', icon: 'none' });
        return;
      }
      if (!/^\d{6}$/.test(this.verifyCode)) {
        uni.showToast({ title: '请输入6位验证码', icon: 'none' });
        return;
      }
      await this.bindUser({ phoneNum: this.phoneNum, code: this.verifyCode });
    },

    /**
     * 绑定 / 创建小程序用户并完成登录
     * @param {object} credentials 手机号授权信息或短信验证码（两者择一）
     */
    async bindUser(credentials) {
      if (!this.openId) {
        uni.showToast({ title: '微信登录凭证无效，请重试', icon: 'none' });
        return;
      }
      this.submitting = true;
      try {
        const profile = this.userStore.userInfo || {};
        const payload = {
          openId: this.openId,
          centerId: this.centerId,
          miniAppId: this.miniAppId,
          miniAppType: 'wechat',
          verifyCodeType: this.verifyCodeType,
          ...credentials
        };
        // 仅在已有真实资料时透传，避免用默认值覆盖后端已存的用户昵称与头像
        if (profile.nickName) payload.nickName = profile.nickName;
        if (profile.avatarUrl) payload.avatar = profile.avatarUrl;

        const data = await bindMiniAppUser(payload);
        // bind 返回结构与 /api/miniApp/user/queryUserByOpenId 同构：
        // { sysdate, netUser: { netUserId, name, mobileNum, token, accessToken ... }, error, message }
        // ⚠️ 注意 error: 0 只代表「请求成功」，不代表拿到了用户，必须校验 netUserId
        const netUser = (data && (data.netUser || data)) || {};
        // 登录成功的唯一标志：拿到有效 netUserId（与 userStore.isLoggedIn 同一判据）
        if (!hasValidUserId(netUser.netUserId)) {
          throw new Error('登录失败：未获取到用户信息');
        }
        this.userStore.setLoginResult(data, credentials.phoneNum || '');
        // 后端未返回昵称/头像时，前端用默认值兜底展示（不写库）
        if (!this.userStore.userInfo.avatarUrl) {
          this.userStore.setUserInfo({ avatarUrl: DEFAULT_AVATAR });
        }
        if (!this.userStore.userInfo.nickName) {
          this.userStore.setUserInfo({ nickName: DEFAULT_NICKNAME });
        }
        const isNewUser = data.isNewUser === 1 || data.isNewUser === '1' || data.isNewUser === true;
        uni.showToast({ title: isNewUser ? '注册成功' : '登录成功', icon: 'success' });
        setTimeout(() => this.finishLogin(), 800);
      } catch (error) {
        // 登录凭证失效：清空本地登录态并重新换取，让用户可直接重试
        if (error && error.error === 1106) {
          this.userStore.clearLogin();
          uni.showToast({ title: `${error.message || '登录凭证失效'}，请重试`, icon: 'none' });
          // #ifdef MP-WEIXIN
          await this.ensureWechatSession(true);
          // #endif
        } else {
          uni.showToast({
            title: (error && (error.message || error.msg)) || '登录失败，请重试',
            icon: 'none'
          });
        }
      } finally {
        this.submitting = false;
      }
    },

    /** 登录完成后的跳转：优先回来源页，其次返回上一页（router.back 内置回首页兜底） */
    finishLogin() {
      const targetUrl = (this.returnUrl || '').trim();

      if (targetUrl.startsWith('/')) {
        // tabBar 页面必须用 switchTab，其余用 redirectTo（保留页面栈）
        if (isTabPage(targetUrl)) {
          uni.switchTab({ url: targetUrl.split('?')[0], fail: () => this.goHome() });
          return;
        }
        uni.redirectTo({ url: targetUrl, fail: () => this.goHome() });
        return;
      }

      router.back();
    },

    /** 兜底回首页（登录页可能是首个页面或页面栈异常） */
    goHome() {
      uni.switchTab({
        url: '/pages/index/index',
        fail: () => uni.reLaunch({ url: '/pages/index/index' })
      });
    },

    startCountdown() {
      this.clearCountdown();
      this.countdown = 60;
      this.countdownTimer = setInterval(() => {
        this.countdown -= 1;
        if (this.countdown <= 0) this.clearCountdown();
      }, 1000);
    },

    clearCountdown() {
      if (this.countdownTimer) clearInterval(this.countdownTimer);
      this.countdownTimer = null;
      if (this.countdown < 0) this.countdown = 0;
    }
  }
};
</script>

<style lang="scss" scoped src="./index.scss"></style>
