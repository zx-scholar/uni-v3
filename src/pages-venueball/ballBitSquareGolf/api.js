import http from '@/utils/request';
import { useUserStore } from '@/stores/user';

const { get } = http;

// /api/ticket/queryUserTicketsWithFriend

/**
 * ⚠️ netUserId / centerId 必须调用时再读：
 * store 在模块导入阶段可能还没被 Pinia 安装，且登录前后值会变，
 * 在模块顶层快照会永久锁死成空值（表现为登录了还查不到票）。
 */
export const queryUserTicketsWithFriend = data => {
  const userStore = useUserStore();
  return get('/api/ticket/queryUserTicketsWithFriend', {
    netUserId: userStore.netUserId,
    centerId: userStore.userInfo.centerId,
    ...data
  });
};
