<template>
  <view class="page-container">
    <NavBar title="登录" color="#000" />

    <scroll-view class="page-scroll-content scrollbar-hide" scroll-y>
      <view class="scroll-wrapper px-24">
        <!-- ============== 品牌区 ============== -->
        <view class="flex-column items-center pt-40 mb-24">
          <image class="brand-logo w-160 h-160 radius-full" :src="logo" mode="aspectFit" />
          <text class="fz-36 fw-6 c-t-primary mt-24 text-center">{{ appName }}</text>
          <text class="fz-24 c-t-sub text-center mt-8">使用手机号验证码登录</text>
        </view>

        <!-- ============== 登录表单 ============== -->
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
              @click="sendCode"
            >
              {{ codeButtonText }}
            </view>
          </view>
        </view>

        <button
          class="btn-primary mt-32"
          :loading="submitting"
          :disabled="submitting"
          @click="submit"
        >
          登录
        </button>

        <text class="fz-24 c-t-sub text-center mt-24">未注册的手机号将自动创建账号</text>
      </view>
    </scroll-view>
  </view>
</template>

<script>
/**
 * H5 端专属登录页
 *
 * 与小程序端 pages/login 完全独立：
 *   - 小程序端走微信授权 + 手机号快捷登录，依赖 openId
 *   - H5 端没有微信授权链路，走账号体系（手机号 + 短信验证码）
 *
 * ⚠️ 接口接入点：src/api/user.js 中的 h5SendLoginVerifyCode / h5Login，
 *    目前为占位路径，替换为实际 H5 接口即可，本页无需改动。
 */
import { h5SendLoginVerifyCode, h5Login, queryMiniAppInfo } from '@/api';
import { useAppStore } from '@/stores/app';
import { useUserStore } from '@/stores/user';
import { parseParams, isTabPage } from '@/utils/router';

/** 后端未返回头像时的默认值 */
const DEFAULT_AVATAR = '/static/logo.png';
/** H5 端默认昵称（与小程序端的「微信用户」区分开） */
const DEFAULT_NICKNAME = '用户';

export default {
  name: 'LoginH5Page',

  data() {
    return {
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
    centerId() {
      const info = this.appStore.miniAppInfo || {};
      return info.initCenterId || info.centerId || '';
    },
    verifyCodeType() {
      return (this.appStore.miniAppInfo || {}).verifyCodeType || '';
    },
    codeButtonText() {
      return this.countdown > 0 ? `${this.countdown}s` : '获取验证码';
    }
  },

  async onLoad(options) {
    const params = parseParams(options);
    this.returnUrl = params.returnUrl || params.url || params.r || '';

    // 已登录直接回跳，不再展示登录表单
    if (this.userStore.isLoggedIn) {
      this.finishLogin();
      return;
    }

    await this.ensureMiniAppInfo();
  },

  onUnload() {
    this.clearCountdown();
  },

  methods: {
    /** 加载小程序信息（appName / logo / centerId / 验证码类型） */
    async ensureMiniAppInfo() {
      if (this.appStore.miniAppInfo && this.appStore.miniAppInfo.id) return;
      try {
        const data = await queryMiniAppInfo();
        if (data && data.miniApp) {
          this.appStore.setMiniAppInfo(data.miniApp);
        }
      } catch (error) {
        // 请求层已统一提示，保留页面状态供重试
      }
    },

    isValidPhone() {
      return /^1\d{10}$/.test(this.phoneNum);
    },

    /** 发送短信验证码（60s 倒计时） */
    async sendCode() {
      if (this.countdown > 0 || this.sendingCode) return;
      if (!this.isValidPhone()) {
        uni.showToast({ title: '请输入正确的手机号', icon: 'none' });
        return;
      }
      this.sendingCode = true;
      try {
        await h5SendLoginVerifyCode({
          centerId: this.centerId,
          phoneNum: this.phoneNum,
          verifyCodeType: this.verifyCodeType
        });
        this.startCountdown();
        uni.showToast({ title: '验证码已发送', icon: 'none' });
      } catch (error) {
        uni.showToast({
          title: (error && (error.message || error.msg)) || '验证码发送失败',
          icon: 'none'
        });
      } finally {
        this.sendingCode = false;
      }
    },

    /** 提交登录 */
    async submit() {
      if (!this.isValidPhone()) {
        uni.showToast({ title: '请输入正确的手机号', icon: 'none' });
        return;
      }
      if (!/^\d{6}$/.test(this.verifyCode)) {
        uni.showToast({ title: '请输入6位验证码', icon: 'none' });
        return;
      }

      this.submitting = true;
      try {
        const data = await h5Login({
          centerId: this.centerId,
          phoneNum: this.phoneNum,
          code: this.verifyCode,
          verifyCodeType: this.verifyCodeType
        });
        this.userStore.setLoginResult(data, this.phoneNum);
        // 后端未返回昵称/头像时前端兜底展示（不写库）
        if (!this.userStore.userInfo.avatarUrl) {
          this.userStore.setUserInfo({ avatarUrl: DEFAULT_AVATAR });
        }
        if (!this.userStore.userInfo.nickName) {
          this.userStore.setUserInfo({ nickName: DEFAULT_NICKNAME });
        }
        uni.showToast({ title: '登录成功', icon: 'success' });
        setTimeout(() => this.finishLogin(), 600);
      } catch (error) {
        uni.showToast({
          title: (error && (error.message || error.msg)) || '登录失败，请重试',
          icon: 'none'
        });
      } finally {
        this.submitting = false;
      }
    },

    /** 登录完成后的跳转：回来源页 → 首页 */
    finishLogin() {
      const targetUrl = (this.returnUrl || '').trim();

      if (targetUrl.startsWith('/')) {
        if (isTabPage(targetUrl)) {
          uni.switchTab({ url: targetUrl.split('?')[0], fail: () => this.goHome() });
          return;
        }
        uni.redirectTo({ url: targetUrl, fail: () => this.goHome() });
        return;
      }
      this.goHome();
    },

    /** H5 端首页是 tabBar 页，必须 switchTab */
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
