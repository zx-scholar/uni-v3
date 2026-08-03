<template>
  <view class="login-page">
    <NavBar title="登录" color="#111827" background="#ffffff" />

    <view v-if="step === 'profile'" class="profile-section">
      <image class="authorize-image" src="/static/logo.png" mode="aspectFit" />
      <text class="profile-title">请完成授权，开启{{ appName }}</text>
      <text class="profile-desc">头像和昵称将用于展示您的用户信息</text>

      <!-- #ifdef MP-WEIXIN -->
      <button class="avatar-picker" open-type="chooseAvatar" @chooseavatar="handleChooseAvatar">
        <image v-if="avatarUrl" class="avatar" :src="avatarUrl" mode="aspectFill" />
        <text v-else class="avatar-placeholder">选择头像</text>
      </button>
      <!-- #endif -->

      <!-- #ifndef MP-WEIXIN -->
      <view class="avatar-picker avatar-picker-disabled">
        <image class="avatar" :src="avatarUrl || defaultLogo" mode="aspectFill" />
      </view>
      <!-- #endif -->

      <view class="nickname-field">
        <text class="field-label">昵称</text>
        <input v-model.trim="nickName" class="field-input" type="nickname" maxlength="30" placeholder="请输入昵称" />
      </view>

      <button class="primary-button" :loading="uploading" :disabled="uploading" @click="confirmProfile">下一步</button>
    </view>

    <view v-else class="login-section">
      <view class="brand">
        <image class="brand-logo" :src="logo" mode="aspectFit" />
        <text class="brand-name">{{ appName }}</text>
      </view>

      <template v-if="step === 'methods'">
        <!-- #ifdef MP-WEIXIN -->
        <button class="wechat-button" open-type="getPhoneNumber" :loading="submitting" :disabled="!openId || submitting" @getphonenumber="handleGetPhoneNumber">
          手机号快捷登录
        </button>
        <!-- #endif -->

        <button class="secondary-button" :disabled="submitting" @click="showPhoneLogin">其他手机号登录</button>
        <text class="login-hint">若手机号尚未注册，将自动为您创建账号</text>
      </template>

      <template v-else>
        <view class="form-field">
          <text class="field-label">手机号码</text>
          <input v-model="phoneNum" class="field-input" type="number" maxlength="11" placeholder="请输入手机号" />
        </view>

        <view class="form-field code-field">
          <view class="code-input-wrap">
            <text class="field-label">验证码</text>
            <input v-model="verifyCode" class="field-input" type="number" maxlength="6" placeholder="请输入验证码" />
          </view>
          <button class="code-button" :disabled="countdown > 0 || sendingCode" @click="sendVerifyCode">
            {{ codeButtonText }}
          </button>
        </view>

        <button class="primary-button" :loading="submitting" :disabled="submitting" @click="submitPhoneLogin">登录</button>
        <button class="text-button" :disabled="submitting" @click="step = 'methods'">返回其他登录方式</button>
        <text class="login-hint">若手机号尚未注册，将自动为您创建账号</text>
      </template>
    </view>
  </view>
</template>

<script>
import { bindMiniAppUser, loginByWechatCode, queryMiniAppInfo, sendLoginVerifyCode, uploadUserAvatar } from '@/api';
import { useAppStore } from '@/stores/app';
import { useUserStore } from '@/stores/user';
import { parseParams } from '@/utils/router';

// 用户 Store 别名字段映射，方便模板中使用
const DEFAULT_LOGO = '/static/logo.png';

export default {
  name: 'LoginPage',
  data() {
    return {
      step: 'profile',
      avatarUrl: '',
      nickName: '',
      phoneNum: '',
      verifyCode: '',
      countdown: 0,
      countdownTimer: null,
      uploading: false,
      sendingCode: false,
      submitting: false,
      returnUrl: '',
    };
  },
  computed: {
    appStore() {
      return useAppStore();
    },
    userStore() {
      return useUserStore();
    },
    defaultLogo() {
      return DEFAULT_LOGO;
    },
    logo() {
      return this.appStore.logo || DEFAULT_LOGO;
    },
    appName() {
      return this.appStore.appName || '伏见桃山演示馆';
    },
    openId() {
      return this.userStore.openId || '';
    },
    codeButtonText() {
      return this.countdown > 0 ? `${this.countdown}s` : '获取验证码';
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
  },
  async onLoad(options = {}) {
    const params = parseParams(options);
    this.returnUrl = params.returnUrl || params.url || params.r || '';
    // 从 store 恢复已有信息
    this.avatarUrl = this.userStore.userInfo.avatarUrl || DEFAULT_LOGO;
    this.nickName = this.userStore.userInfo.nickName || '微信用户';
    this.step = this.userStore.isProfileReady ? 'methods' : 'profile';

    await this.ensureMiniAppInfo();
    // #ifdef MP-WEIXIN
    await this.ensureWechatSession();
    // #endif
  },
  onUnload() {
    this.clearCountdown();
  },
  methods: {
    async ensureMiniAppInfo() {
      if (this.miniAppId) return;
      try {
        const data = await queryMiniAppInfo();
        if (data && data.miniApp) {
          this.appStore.setMiniAppInfo(data.miniApp);
        }
      } catch (error) {
        // 请求层已统一提示错误，此处保留页面状态供用户重试。
      }
    },
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
          wechatMiniAppId: this.miniAppId,
        });
        // 写入 store（持久化由 Pinia persist 自动处理）
        this.userStore.setWechatSession(session);
        return Boolean(session.openId);
      } catch (error) {
        uni.showToast({
          title: error.message || error.errMsg || '无法获取微信登录凭证',
          icon: 'none',
        });
        return false;
      }
    },
    async handleChooseAvatar(event) {
      const detail = event.detail || (event.mp && event.mp.detail) || {};
      if (!detail.avatarUrl) return;
      this.uploading = true;
      try {
        const data = await uploadUserAvatar(detail.avatarUrl);
        this.avatarUrl = data.url || detail.avatarUrl;
      } finally {
        this.uploading = false;
      }
    },
    confirmProfile() {
      if (!this.avatarUrl) {
        uni.showToast({ title: '请选择头像', icon: 'none' });
        return;
      }
      if (!this.nickName) {
        uni.showToast({ title: '请输入昵称', icon: 'none' });
        return;
      }
      this.userStore.setUserInfo({ avatarUrl: this.avatarUrl, nickName: this.nickName });
      this.step = 'methods';
    },
    showPhoneLogin() {
      this.step = 'phone';
    },
    async handleGetPhoneNumber(event) {
      const detail = event.detail || (event.mp && event.mp.detail) || {};
      if (detail.errMsg && !detail.errMsg.includes(':ok')) {
        uni.showToast({ title: '需要授权手机号后才能登录', icon: 'none' });
        return;
      }
      if (!detail.encryptedData || !detail.iv) {
        uni.showToast({ title: '未获取到手机号授权信息', icon: 'none' });
        return;
      }
      if (!(await this.ensureWechatSession())) return;
      await this.bindUser({ encryptedData: detail.encryptedData, iv: detail.iv });
    },
    isValidPhone() {
      return /^1\d{10}$/.test(this.phoneNum);
    },
    async sendVerifyCode() {
      if (!this.isValidPhone()) {
        uni.showToast({ title: '请输入正确的手机号', icon: 'none' });
        return;
      }
      if (!this.openId) {
        // #ifdef MP-WEIXIN
        if (!(await this.ensureWechatSession())) return;
        // #endif
      }
      this.sendingCode = true;
      try {
        const data = await sendLoginVerifyCode({
          centerId: this.centerId,
          phoneNum: this.phoneNum,
          verifyCodeType: this.verifyCodeType,
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
    async bindUser(credentials) {
      if (!this.openId) {
        uni.showToast({ title: '微信登录凭证无效，请重试', icon: 'none' });
        return;
      }
      this.submitting = true;
      try {
        const data = await bindMiniAppUser({
          openId: this.openId,
          centerId: this.centerId,
          miniAppId: this.miniAppId,
          miniAppType: 'wechat',
          verifyCodeType: this.verifyCodeType,
          nickName: this.userStore.userInfo.nickName,
          avatar: this.userStore.userInfo.avatarUrl,
          ...credentials,
        });
        this.userStore.setLoginResult(data, credentials.phoneNum || '');
        uni.showToast({ title: data.isNewUser === 1 ? '注册成功' : '登录成功', icon: 'success' });
        setTimeout(() => this.finishLogin(), 800);
      } catch (error) {
        if (error && error.error === 1106) {
          this.userStore.clearLogin();
          uni.showToast({ title: `${error.message || '登录凭证失效'}，请重试`, icon: 'none' });
          // #ifdef MP-WEIXIN
          await this.ensureWechatSession(true);
          // #endif
        } else {
          uni.showToast({
            title: (error && (error.message || error.msg)) || '登录失败，请重试',
            icon: 'none',
          });
        }
      } finally {
        this.submitting = false;
      }
    },
    finishLogin() {
      const targetUrl = (this.returnUrl || '').trim();
      if (targetUrl.startsWith('/')) {
        // tabBar 页面必须用 switchTab, 其余用 redirectTo (均保留页面栈)
        if (router.isTabPage(targetUrl)) {
          uni.switchTab({ url: targetUrl.split('?')[0], fail: () => router.back() });
          return;
        }
        uni.redirectTo({ url: targetUrl, fail: () => router.back() });
        return;
      }
      router.back();
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
    },
  },
};
</script>

<style lang="scss" scoped src="./login.scss"></style>
