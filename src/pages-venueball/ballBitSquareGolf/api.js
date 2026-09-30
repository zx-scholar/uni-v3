import http from '@/utils/request';
import { useUserStore } from '@/stores/user';

const { get, post } = http;
const netUserId = useUserStore().userInfo.netUserId;
const centerId = useUserStore().userInfo.centerId;

// /api/ticket/queryUserTicketsWithFriend

export const queryUserTicketsWithFriend = (data) => {
  data.netUserId = netUserId;
  data.centerId = centerId;
  return get('/api/ticket/queryUserTicketsWithFriend', data);
};
