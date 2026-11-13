<template>
  <view class="page-container page-has-bg">
    <NavBar title="个人资料" color="#fff" />

    <scroll-view class="page-scroll-content" scroll-y>
      <view class="scroll-wrapper flex-column items-center">
        <!-- 头像 -->
        <image class="avatar" :src="avatarUrl" mode="aspectFill"></image>

        <!-- 信息列表卡片 -->
        <view class="info-card">
          <view
            v-for="(row, index) in infoRows"
            :key="index"
            class="info-row flex-between py-32"
            @click="handleRowClick(row.action)"
          >
            <text class="info-label">{{ row.label }}</text>
            <view class="info-right flex-1 flex items-center justify-end">
              <text v-if="row.value" :class="row.warning ? 'info-value-warn' : 'info-value'">
                {{ row.value }}
              </text>
              <text v-if="row.arrow" class="iconfont icon-jinru info-arrow"></text>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 底部退出登录按钮 -->
    <view class="page-bottom-bar">
      <button
        class="btn-primary"
        :loading="loggingOut"
        :disabled="loggingOut"
        @click="handleLogout"
      >
        退出登录
      </button>
    </view>
  </view>
</template>

<script>
import { unbindMiniAppUser } from '@/api';
import { useAppStore } from '@/stores/app';
import { useUserStore } from '@/stores/user';

/** 手机号脱敏：18251852533 → 182****2533 */
function maskPhone(phone = '') {
  return String(phone).replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2');
}

/** 姓名脱敏：王思思 → 王*思；两字姓名 → 王* */
function maskName(name = '') {
  const text = String(name);
  if (text.length <= 1) return text;
  if (text.length === 2) return `${text[0]}*`;
  return `${text[0]}${'*'.repeat(text.length - 2)}${text[text.length - 1]}`;
}

/** 身份证脱敏：保留前 6 位与后 4 位 */
function maskIdCard(id = '') {
  const text = String(id);
  if (text.length <= 10) return text;
  return `${text.slice(0, 6)}${'*'.repeat(text.length - 10)}${text.slice(-4)}`;
}

export default {
  name: 'PersonInfoPage',

  data() {
    return {
      /** 退出登录请求进行中：防重复点击 */
      loggingOut: false
    };
  },

  computed: {
    appStore() {
      return useAppStore();
    },
    userStore() {
      return useUserStore();
    },
    /** 头像：优先后端返回，缺失时用默认图 */
    avatarUrl() {
      return this.userStore.userInfo.avatarUrl || '/static/logo.png';
    },
    /**
     * 资料列表：全部取自 userStore（登录时由 bind 接口返回的 netUser 写入）
     * 后端暂无对应字段的行不展示，避免出现假数据
     */
    infoRows() {
      const info = this.userStore.userInfo || {};
      const nickName = info.nickName || info.name || '';
      const rows = [
        { label: '昵称', value: nickName || '未设置', action: 'nickname', arrow: true }
      ];

      if (info.realName) rows.push({ label: '真实姓名', value: maskName(info.realName) });
      if (info.idCard) rows.push({ label: '身份证号', value: maskIdCard(info.idCard) });
      if (info.mobileNum) rows.push({ label: '手机号', value: maskPhone(info.mobileNum) });

      rows.push({ label: '用户协议', action: 'agreement', arrow: true });
      rows.push({
        label: '注销账号',
        value: '注销后账号无法恢复，请谨慎操作',
        action: 'deleteAccount',
        arrow: true,
        warning: true
      });
      return rows;
    }
  },

  methods: {
    handleRowClick(action) {
      if (!action) return;
      const actions = {
        nickname: () => uni.showToast({ title: '编辑昵称', icon: 'none' }),
        agreement: () => uni.showToast({ title: '用户协议', icon: 'none' }),
        deleteAccount: () => {
          uni.showModal({
            title: '提示',
            content: '确定要注销账号吗？注销后账号无法恢复。',
            success: res => {
              if (res.confirm) {
                uni.showToast({ title: '已提交注销申请', icon: 'none' });
              }
            }
          });
        }
      };
      actions[action]?.();
    },

    /**
     * 退出登录
     * 1. 二次确认
     * 2. 调用 /api/miniApp/user/unbind 解绑当前小程序用户
     * 3. 无论接口成功与否都清空本地登录态（网络异常时也要让用户退得出去）
     * 4. 回到「我的」页面
     */
    async handleLogout() {
      if (this.loggingOut) return;

      const { confirm } = await new Promise(resolve => {
        uni.showModal({
          title: '提示',
          content: '确定要退出登录吗？',
          success: resolve,
          fail: () => resolve({ confirm: false })
        });
      });
      if (!confirm) return;

      this.loggingOut = true;
      try {
        await unbindMiniAppUser({
          netUserId: this.userStore.netUserId,
          miniAppId: this.appStore.miniAppInfo.id,
          miniAppType: 'wechat',
          openId: this.userStore.loginInfo.openId
        });
      } catch (error) {
        // 解绑失败不阻断本地登出：用户退出意图明确，避免网络异常时退不出去
        console.warn('[personInfo] 解绑接口失败，仍执行本地登出:', error);
      } finally {
        this.userStore.clearLogin();
        this.loggingOut = false;
      }

      uni.showToast({ title: '已退出登录', icon: 'success' });
      setTimeout(() => {
        // 「我的」是 tabBar 页面，必须用 switchTab
        uni.switchTab({
          url: '/pages/mine/mine',
          fail: () => uni.reLaunch({ url: '/pages/index/index' })
        });
      }, 600);
    }
  }
};
</script>

<style lang="scss" scoped src="./personInfo.scss"></style>
