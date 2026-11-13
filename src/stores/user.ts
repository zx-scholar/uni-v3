import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { UserInfo, WechatSession } from '@/types';

/**
 * 判断一个 netUserId 是否为有效用户标识
 *
 * 登录判定的唯一依据就是它 —— 不看接口是否调用成功、不看有没有 openId /
 * accessToken。后端在「查无此人」时同样返回 error: 0，接口成功不等于用户存在。
 *
 * 这里额外排除 '0' / 'null' / 'undefined' 这类"长得像有值"的字符串：
 * 后端字段为 Long、前端可能拿到字符串，空值被序列化成这些字面量时
 * 用 !!value 会误判成已登录。
 */
export function hasValidUserId(id?: number | string | null): boolean {
  if (id === undefined || id === null) return false;
  const value = String(id).trim();
  return value !== '' && value !== '0' && value !== 'null' && value !== 'undefined';
}

/**
 * netUser 中可映射到 userInfo 的字段白名单
 * 只保留展示层需要的资料字段，token / accessToken 等凭证不进 userInfo
 */
const USER_DETAIL_KEYS = [
  'netUserId',
  'name',
  'nickName',
  'mobileNum',
  'email',
  'gender',
  'status',
  'centerId',
  'createTime',
  'updateTime'
];

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
    const openId = ref<string>('');
    const unionId = ref<string>('');
    const accessToken = ref<string>('');
    const accountId = ref<string>('');
    const coAppId = ref<string>('');
    const mobileNum = ref<string>('');

    // ========== 非持久化状态（用户详情） ==========
    const netUserId = ref<number | string>('');
    const userInfo = ref<UserInfo>({});
    /**
     * 用户资料（头像 + 昵称）是否完整
     * 注意：登录流程已不再强制用户填写资料（改用默认头像/昵称兜底），
     * 该标记仅保留给「资料完善」类场景使用，不作为登录前置条件。
     */
    const isProfileReady = ref<boolean>(false);

    // ========== Getters ==========
    const loginInfo = computed(() => ({
      openId: openId.value,
      unionId: unionId.value,
      accessToken: accessToken.value,
      accountId: accountId.value,
      coAppId: coAppId.value,
      mobileNum: mobileNum.value
    }));

    /**
     * 是否已登录 —— 全应用唯一的登录判据
     *
     * 唯一条件：netUserId 有效。不看 openId / accessToken / 接口是否成功。
     * 页面与工具层一律读这个 getter，不要自己拼 `!!openId` 之类的判断。
     */
    const isLoggedIn = computed(() => hasValidUserId(netUserId.value));

    // ========== Actions ==========

    /** 设置登录凭证（wx.login 换取后调用） */
    function setWechatSession(session: WechatSession = {}) {
      if (session.openId !== undefined) openId.value = session.openId;
      if (session.unionId !== undefined) unionId.value = session.unionId;
      if (session.accessToken !== undefined) accessToken.value = session.accessToken;
      if (session.accountId !== undefined) accountId.value = session.accountId;
      if (session.coAppId !== undefined) coAppId.value = session.coAppId;
      if (session.mobileNum !== undefined) mobileNum.value = session.mobileNum;
    }

    /** 设置用户个人信息（头像、昵称等） */
    function setUserInfo(info: UserInfo = {}) {
      userInfo.value = { ...userInfo.value, ...info };
      if (info.avatarUrl && info.nickName) {
        isProfileReady.value = true;
      }
    }

    /**
     * 写入后端用户对象（netUser）
     *
     * 后端 /api/miniApp/user/queryUserByOpenId 与 /api/miniApp/user/bind 返回同构：
     *   { sysdate, netUser: { netUserId, name, mobileNum, email, status, centerId,
     *                         createTime, updateTime, token, accessToken,
     *                         coAccountId, coAppId }, error, message }
     *
     * ⚠️ 两个接口在「查不到用户」时同样返回 error: 0，只是没有 netUser。
     *    调用方必须先校验用户对象存在，再调本方法；不要把 error: 0 当登录成功。
     *
     * 职责：把 netUser 拆成「持久化凭证」与「会话级用户详情」两部分写入，是
     * 登录成功后写用户信息的唯一入口（页面不要自己拼字段）。
     */
    function setNetUser(netUser: Record<string, any> = {}) {
      if (!netUser || typeof netUser !== 'object') return;

      // ========== 登录凭证（persist 持久化） ==========
      if (netUser.openId) openId.value = netUser.openId;
      if (netUser.unionId) unionId.value = netUser.unionId;
      if (netUser.accessToken) accessToken.value = netUser.accessToken;
      if (netUser.coAccountId) accountId.value = String(netUser.coAccountId);
      if (netUser.coAppId) coAppId.value = String(netUser.coAppId);
      if (netUser.mobileNum) mobileNum.value = netUser.mobileNum;

      // ========== 用户详情（内存级） ==========
      // netUserId 只在有效时写入：它是登录判据，不能被 '0' / '' 这类值污染
      if (hasValidUserId(netUser.netUserId)) netUserId.value = netUser.netUserId;

      // 白名单取值：避免把 token / accessToken 等凭证混进 UI 层的数据对象
      const detail: Record<string, any> = {};
      USER_DETAIL_KEYS.forEach(key => {
        const value = netUser[key];
        if (value !== undefined && value !== null && value !== '') detail[key] = value;
      });

      // 昵称：后端 netUser 用 name（真实姓名/账号名），部分接口回 nickName，两个字段互兜底
      if (!detail.nickName && detail.name) detail.nickName = detail.name;
      if (!detail.name && detail.nickName) detail.name = detail.nickName;

      // 头像：后端字段名为 avatar，前端展示统一用 avatarUrl
      const avatar = netUser.avatarUrl || netUser.avatar;
      if (avatar) {
        detail.avatar = avatar;
        detail.avatarUrl = avatar;
      }

      userInfo.value = { ...userInfo.value, ...detail };

      if (userInfo.value.avatarUrl && userInfo.value.nickName) {
        isProfileReady.value = true;
      }
    }

    /**
     * 登录成功后写入完整用户数据
     *
     * 兼容两种后端返回形态：
     *   1. { netUser: {...}, error: 0, message: 'ok' }  ← 当前 bind / 查询接口
     *   2. 扁平的 netUser 字段（历史接口、H5 登录接口）
     *
     * @param {object} data 接口原始返回
     * @param {string} phone 兜底手机号（后端未返回 mobileNum 时使用）
     */
    function setLoginResult(data: Record<string, any> = {}, phone = '') {
      const netUser =
        data && typeof data.netUser === 'object' && data.netUser ? data.netUser : data;
      // 没有有效 netUserId 就不是一次成功的登录：不写任何状态，保持未登录
      if (!netUser || !hasValidUserId(netUser.netUserId)) {
        console.warn('[user] setLoginResult 未拿到有效 netUserId，保持未登录', data);
        return;
      }
      setNetUser(netUser);
      if (phone && !mobileNum.value) mobileNum.value = phone;
    }

    /**
     * 设置后端用户 ID（兼容旧调用；新代码请统一走 setNetUser / setLoginResult）
     * 传入无效值时等同清空，避免用非法 ID 撑起「已登录」状态
     */
    function setNetUserId(id: number | string) {
      if (!hasValidUserId(id)) {
        netUserId.value = '';
        const rest = { ...userInfo.value };
        delete rest.netUserId;
        userInfo.value = rest;
        return;
      }
      netUserId.value = id;
      userInfo.value = { ...userInfo.value, netUserId: id };
    }

    /** 清空登录态（退出登录） */
    function clearLogin() {
      openId.value = '';
      unionId.value = '';
      accessToken.value = '';
      accountId.value = '';
      coAppId.value = '';
      mobileNum.value = '';
      netUserId.value = '';
      userInfo.value = {};
      isProfileReady.value = false;
    }

    return {
      // 原始状态
      openId,
      unionId,
      accessToken,
      accountId,
      coAppId,
      mobileNum,
      netUserId,
      userInfo,
      isProfileReady,
      // getters
      loginInfo,
      isLoggedIn,
      // actions
      setWechatSession,
      setUserInfo,
      setNetUser,
      setLoginResult,
      setNetUserId,
      clearLogin
    };
  },
  {
    persist: {
      // 存储键是数据身份标识，一经发布不可改名（改名等于丢弃用户已有的持久化数据）
      key: 'user-store',
      // 只持久化登录凭证，用户详情每次启动重新获取（避免客户端缓存脏用户数据）
      // ⚠️ 字段名必须是 pick：v3 的 paths 在 v4 已废弃，写错会被静默忽略（不报错、不生效）
      pick: ['openId', 'unionId', 'accessToken', 'accountId', 'coAppId', 'mobileNum']
    }
  }
);
