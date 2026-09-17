<template>
  <view class="basic-template-page">
    <!-- 顶部自定义导航栏 -->
    <NavBar :title="pageTitle" color="#ffffff" :showBack="true" />

    <!-- 主体滚动区域 -->
    <scroll-view class="page-scroll" scroll-y>
      <view class="page-content">

        <!-- 状态提示（如 “还差 x 位成团” / “未在截止时间前成团” ） -->
        <view v-if="tipText" class="info-tip">{{ tipText }}</view>

        <!-- 卡片 1：活动信息 -->
        <view class="info-card">
          <view class="info-card__header">
            <view class="info-card__title">
              <text>{{ activityInfo.mainTitle }}</text>
              <text v-if="activityInfo.subTitle" class="info-card__title-sep">·</text>
              <text>{{ activityInfo.subTitle }}</text>
            </view>
            <view class="info-card__deposit">
              <text class="info-card__deposit-label">订金¥</text>
              <text class="info-card__deposit-amount">{{ activityInfo.deposit }}</text>
            </view>
          </view>

          <view class="info-card__row">
            <text class="iconfont icon-shijian1 info-card__row-icon"></text>
            <text class="info-card__row-text">{{ activityInfo.dateTime }}</text>
          </view>

          <view class="info-card__row">
            <text class="iconfont icon-weizhi3 info-card__row-icon"></text>
            <text class="info-card__row-text">{{ activityInfo.location }}</text>
          </view>

          <view class="info-card__divider"></view>

          <view class="info-card__tags">
            <view v-for="(tag, idx) in activityInfo.tags" :key="idx" class="info-card__tag" :class="['info-card__tag--' + (tag.colorType || 'green')]">{{ tag.text }}</view>
          </view>
        </view>

        <!-- 卡片 2：球友信息 -->
        <view class="players-card">
          <view class="players-card__title">
            球友信息(
            <text class="players-card__count">{{ playersInfo.joinedCount }}</text>
            /{{ playersInfo.totalCount }})
          </view>
          <view class="players-card__list">
            <view v-for="(player, idx) in playersInfo.list" :key="idx" class="players-card__item">
              <view class="players-card__avatar-wrap">
                <view v-if="player.role" class="players-card__role" :class="{ 'players-card__role--outline': idx !== 0 }">{{ player.role }}</view>
                <view v-if="!player.avatar" class="players-card__avatar-placeholder">
                  <view class="iconfont icon-geren"></view>
                </view>
                <view v-else class="players-card__avatar" :class="{ 'players-card__avatar--starter': idx === 0 }" :style="{ backgroundImage: `url(${player.avatar})` }" />
              </view>
              <text class="players-card__name" :class="{ 'players-card__name--placeholder': !player.avatar }">{{ player.name }}</text>
              <view v-if="player.rating" class="players-card__rating">
                <text class="iconfont icon-wujiaoxing1"></text>
                <text>{{ player.rating }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 底部固定按钮栏 -->
    <view v-if="bottomButtons.length > 0" class="page-bottom-bar">
      <button
        v-for="(btn, idx) in bottomButtons"
        :key="btn.action"
        class="page-bottom-bar__btn"
        :class="['page-bottom-bar__btn--' + btnVariant(idx), { 'page-bottom-bar__btn--full': isFullWidth() }]"
        @click="handleButtonClick(btn.action)"
      >
        {{ btn.text }}
      </button>
    </view>

    <!-- 取消约球确认弹窗 -->
    <BasePopup
      :visible="cancelPopupVisible"
      mode="center"
      width="600px"
      :title="null"
      :closeable="false"
      @update:visible="cancelPopupVisible = $event"
    >
      <view class="cancel-popup">
        <view class="cancel-popup__text">是否取消约球？</view>
        <view class="cancel-popup__btns">
          <button class="cancel-popup__btn cancel-popup__btn--cancel" @click="cancelPopupVisible = false">暂不取消</button>
          <button class="cancel-popup__btn cancel-popup__btn--confirm" @click="confirmCancel">确认取消</button>
        </view>
      </view>
    </BasePopup>
  </view>
</template>

<script>
// 默认头像（OSS 地址，示例数据统一使用）
const DEFAULT_AVATAR = 'https://xports-prd.oss-cn-hangzhou.aliyuncs.com/prd/gameImage435e535355054676b75a1dc774fb80b3.png';

/**
 * 页面底部按钮配置
 * 按 (角色 × 球局状态) 描述应显示的按钮
 */
// 空状态：标题保留（用于 NavBar），按钮不显示
const EMPTY = (title) => ({ title, buttons: [] });

const pageConfig = {
  // 我是发起人
  creator: {
    forming: {
      title: '成团中',
      buttons: [
        { text: '取消约球', action: 'cancel' },
        { text: '邀请好友', action: 'invite' },
      ],
    },
    formed: {
      title: '已成团',
      buttons: [{ text: '取消约球', action: 'cancel' }],
    },
    completed: {
      title: '已完成',
      buttons: [{ text: '去评价/查看评价', action: 'evaluate' }],
    },
    expired: EMPTY('已失效'),
    cancelled: EMPTY('已取消'),
  },
  // 我不是发起人，但已参与
  joined: {
    forming: {
      title: '成团中',
      buttons: [
        { text: '退出约球', action: 'quit' },
        { text: '邀请好友', action: 'invite' },
      ],
    },
    formed: {
      title: '已成团',
      buttons: [{ text: '退出约球', action: 'quit' }],
    },
    completed: {
      title: '已完成',
      buttons: [{ text: '去评价/查看评价', action: 'evaluate' }],
    },
    expired: EMPTY('已失效'),
    cancelled: EMPTY('已取消'),
  },
  // 我不是发起人，也没有参与
  notJoined: {
    forming: {
      title: '成团中',
      buttons: [
        { text: '分享球局', action: 'share' },
        { text: '参与约球', action: 'join' },
      ],
    },
    formed: EMPTY('已成团'),
    completed: EMPTY('已完成'),
    expired: EMPTY('已失效'),
    cancelled: EMPTY('已取消'),
  },
};

export default {
  name: 'BallBitDetailPage',

  data() {
    return {
      // 卡片 1：活动信息
      activityInfo: {
        mainTitle: '周六约球',
        subTitle: '102练习场',
        deposit: 80,
        dateTime: '08/08 周六 14:00–16:00',
        location: 'GOLFZON PARK 南京旗舰店',
        tags: [
          { text: '差点18以内', colorType: 'green' },
          { text: '室内禁烟', colorType: 'green' },
        ],
      },
      // 卡片 2：球友信息
      playersInfo: {
        joinedCount: 3,
        totalCount: 4,
        list: [
          { avatar: DEFAULT_AVATAR, name: '世界第一网球...', rating: 4.9, role: '发起人' },
          { avatar: DEFAULT_AVATAR, name: '老虎伍兹', rating: 4.9, role: '我' },
          { avatar: DEFAULT_AVATAR, name: '小鸟伊人', rating: 4.9, role: '' },
          { avatar: '', name: '待加入', rating: '', role: '' },
        ],
      },
      // 当前用户角色：'creator' | 'joined' | 'notJoined'（接接口时由后端返回）
      currentRole: 'creator',
      // 当前球局状态：'forming' | 'formed' | 'completed' | 'expired' | 'cancelled'
      currentStatus: 'forming',
      // 成团中还差几人成团（接接口后用后端返回的字段，例如 remainCount）
      remainCount: 1,
      // 取消约球确认弹窗
      cancelPopupVisible: false,
    };
  },

  computed: {
    // 根据 (currentRole, currentStatus) 从 pageConfig 查表得到按钮数组
    bottomButtons() {
      const group = pageConfig[this.currentRole]?.[this.currentStatus];
      return group?.buttons || [];
    },
    // 当前页面的描述性标题（"成团中" / "已失效" 等），可用于 NavBar 副标题
    pageTitle() {
      const group = pageConfig[this.currentRole]?.[this.currentStatus];
      return group?.title || '';
    },
    // 当前按钮区是否只有一个按钮（决定宽度与样式）
    isSingleBtn() {
      return this.bottomButtons.length === 1;
    },
    // 状态提示文案：按 currentStatus 给出对应提示，其他状态不提示
    tipText() {
      switch (this.currentStatus) {
        case 'forming':
          return `还差 ${this.remainCount} 位球友可以成团`;
        case 'expired':
          return '未在截止时间前成团，球局已自动失效';
        default:
          return '';
      }
    },
  },

  methods: {
    // 根据按钮位置返回样式修饰符：单按钮 = outline -full;多按钮时第一个 outline，其余 solid
    btnVariant(idx) {
      if (this.isSingleBtn) return 'outline';
      return idx === 0 ? 'outline' : 'solid';
    },
    isFullWidth() {
      return this.isSingleBtn;
    },

    // 统一按钮点击入口：根据 action 名字分派到具体处理函数
    handleButtonClick(action) {
      switch (action) {
        case 'cancel': return this.handleCancel();
        case 'quit': return uni.showToast({ title: '退出约球', icon: 'none' });
        case 'invite': return uni.showToast({ title: '邀请好友', icon: 'none' });
        case 'share': return uni.showToast({ title: '分享球局', icon: 'none' });
        case 'join': return uni.showToast({ title: '参与约球', icon: 'none' });
        case 'evaluate': return uni.showToast({ title: '去评价/查看评价', icon: 'none' });
        default: console.warn(`[ballBitDetail] 未处理的 action: ${action}`);
      }
    },

    // 点击 “取消约球”：仅打开确认弹窗
    handleCancel() {
      this.cancelPopupVisible = true;
    },

    // 点击弹窗 “确认取消” 后真正提交取消
    confirmCancel() {
      this.cancelPopupVisible = false;
      uni.showToast({ title: '已取消约球', icon: 'success' });
      // TODO：调接口取消约球，成功后刷新页面数据
    },
  },
};
</script>

<style lang="scss" scoped src="./index.scss"></style>
