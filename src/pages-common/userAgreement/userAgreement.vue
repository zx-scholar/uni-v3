<template>
  <view class="page-container page-has-bg">
    <NavBar :title="currentAgreement.title" color="#fff" />

    <scroll-view class="page-scroll-content" scroll-y>
      <view class="scroll-wrapper">
        <view class="agreement-card">
          <text class="agreement-intro">{{ currentAgreement.intro }}</text>
          <view v-for="(section, index) in currentAgreement.sections" :key="index" class="agreement-section">
            <text class="section-heading">{{ section.heading }}</text>
            <text class="section-body">{{ section.body }}</text>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
// 协议内容本地配置（按 type 区分；当前为占位内容，后续替换为正式条款）
const AGREEMENTS = {
  user: {
    title: '用户协议',
    intro: '欢迎使用本小程序（以下简称"本服务"）。请您在使用本服务前仔细阅读并充分理解本协议全部内容。',
    sections: [
      {
        heading: '一、服务说明',
        body: '本服务为用户提供场馆信息展示、赛事资讯、预约报名等相关功能，具体功能以页面实际提供的为准。（占位内容，待替换）',
      },
      {
        heading: '二、账号与安全',
        body: '您应妥善保管账号及登录凭证，因您保管不善导致的账号被盗用等损失由您自行承担。（占位内容，待替换）',
      },
      {
        heading: '三、用户行为规范',
        body: '您在使用本服务过程中不得发布违法违规内容，不得从事任何损害平台或他人合法权益的行为。（占位内容，待替换）',
      },
      {
        heading: '四、隐私保护',
        body: '我们重视您的个人信息保护，具体处理规则详见隐私政策相关说明。（占位内容，待替换）',
      },
      {
        heading: '五、协议的变更与终止',
        body: '我们有权根据业务发展需要修订本协议，修订后的协议将提前公示，您继续使用本服务即视为同意修订内容。（占位内容，待替换）',
      },
      {
        heading: '六、联系我们',
        body: '如对本协议有任何疑问，可通过小程序内客服渠道与我们联系。（占位内容，待替换）',
      },
    ],
  },
  member: {
    title: '会员服务协议',
    intro: '欢迎开通本小程序会员服务。请您在开通前仔细阅读并充分理解本协议全部内容。',
    sections: [
      {
        heading: '一、会员服务内容',
        body: '会员可享受专属权益，包括但不限于优惠折扣、专属活动等，具体权益以开通页面展示为准。（占位内容，待替换）',
      },
      {
        heading: '二、开通与有效期',
        body: '会员服务按您选择的周期计费，自开通成功之日起生效，到期后自动失效。（占位内容，待替换）',
      },
      {
        heading: '三、退订与退款',
        body: '会员服务开通后原则上不支持退款，因平台原因导致服务无法继续提供的除外。（占位内容，待替换）',
      },
      {
        heading: '四、免责声明',
        body: '因不可抗力或第三方原因导致会员服务中断的，平台不承担相应责任，但将尽力恢复服务。（占位内容，待替换）',
      },
    ],
  },
};

export default {
  name: 'UserAgreementPage',

  data() {
    return {
      type: 'user',
      agreements: AGREEMENTS,
    };
  },

  computed: {
    currentAgreement() {
      return this.agreements[this.type] || this.agreements.user;
    },
  },

  onLoad(options) {
    if (options && options.type && this.agreements[options.type]) {
      this.type = options.type;
    }
  },
};
</script>

<style lang="scss" scoped src="./userAgreement.scss"></style>
