/**
 * 项目全局业务与数据模型 TypeScript 类型定义
 */

/** 用户个人信息模型 */
export interface UserInfo {
  netUserId?: number | string;
  avatarUrl?: string;
  avatar?: string;
  nickName?: string;
  name?: string;
  mobileNum?: string;
  gender?: string;
  status?: string;
  createTime?: string;
  updateTime?: string;
}

/** 微信登录 Session 模型 */
export interface WechatSession {
  openId?: string;
  unionId?: string;
  accessToken?: string;
  accountId?: string;
  coAccountId?: string;
  coAppId?: string;
  mobileNum?: string;
}

/** 小程序后台场馆基础信息 */
export interface MiniAppInfo {
  id?: number;
  name?: string;
  centerId?: number;
  logo?: string;
  theme?: string;
  [key: string]: any;
}

/** 统一 API 通用响应接口 */
export interface ApiResponse<T = any> {
  code: number;
  error?: number;
  message?: string;
  msg?: string;
  data?: T;
  miniApp?: MiniAppInfo;
  [key: string]: any;
}
