<template>
  <view class="page-container page-has-bg">
    <NavBar title="个人资料" color="#fff" />

    <scroll-view class="page-scroll-content" scroll-y>
      <view class="scroll-wrapper flex-column items-center">
        <!-- 头像 -->
        <image class="avatar" src="/static/logo.png" mode="aspectFill"></image>

        <!-- 信息列表卡片 -->
        <view class="info-card">
          <view v-for="(row, index) in infoRows" :key="index" class="info-row flex-between py-32" @click="handleRowClick(row.action)">
            <text class="info-label">{{ row.label }}</text>
            <view class="info-right flex-1 flex items-center justify-end">
              <text v-if="row.value" :class="row.warning ? 'info-value-warn' : 'info-value'">{{ row.value }}</text>
              <text v-if="row.arrow" class="iconfont icon-jinru info-arrow"></text>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 底部退出登录按钮 -->
    <view class="page-bottom-bar">
      <button class="btn-primary" @click="handleLogout">退出登录</button>
    </view>
  </view>
</template>

<script>
export default {
  name: 'ProfilePage',

  data() {
    return {
      infoRows: [
        { label: '昵称', value: '爱打球的狐狸小姐。', action: 'nickname', arrow: true },
        { label: '真实姓名', value: '王*思' },
        { label: '身份证号', value: '320614****8888' },
        { label: '手机号', value: '189****8888' },
        { label: '用户协议', action: 'agreement', arrow: true },
        { label: '会员服务协议', action: 'memberAgreement', arrow: true },
        { label: '注销账号', value: '注销后账号无法恢复，请谨慎操作', action: 'deleteAccount', arrow: true, warning: true },
      ],
    };
  },

  methods: {
    handleRowClick(action) {
      if (!action) return;
      const actions = {
        nickname: () => uni.showToast({ title: '编辑昵称', icon: 'none' }),
        agreement: () => router.push('userAgreement', { type: 'user' }),
        memberAgreement: () => router.push('userAgreement', { type: 'member' }),
        deleteAccount: () => {
          uni.showModal({
            title: '提示',
            content: '确定要注销账号吗？注销后账号无法恢复。',
            success: (res) => {
              if (res.confirm) {
                uni.showToast({ title: '已提交注销申请', icon: 'none' });
              }
            },
          });
        },
      };
      actions[action]?.();
    },

    handleLogout() {
      uni.showModal({
        title: '提示',
        content: '确定要退出登录吗？',
        success: (res) => {
          if (res.confirm) {
            uni.showToast({ title: '已退出登录', icon: 'success' });
          }
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped src="./profile.scss"></style>
