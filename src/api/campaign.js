/**
 * 赛事域接口 (CampaignController)
 * URL 前缀: /api/camp/enroll
 * 返回统一包装 WebResult: { error: 0, message: 'ok', ...业务字段 }
 */
import http from '@/utils/request'

/**
 * 赛事列表
 * GET /api/camp/enroll/getCampaignList
 *
 * 实测（golf 正式环境）：
 *  - 列表字段名是 campaignList，分页信息在根节点 totalPage
 *  - 分页参数是 pageNo（pageSize 实测不生效，服务端固定 10 条/页）
 *  - 关键词搜索参数是 title（模糊匹配赛事标题）
 *
 * @param {Object} params
 * @param {number} [params.pageNo]        页码，从 1 开始
 * @param {string} [params.title]         赛事标题关键词
 * @param {string} [params.campStartDate] 赛事开始时间筛选下限 yyyy-MM-dd
 * @param {string} [params.campEndDate]   赛事结束时间筛选上限 yyyy-MM-dd（含当日整天）
 * @param {Object} [options] 透传给 http.get 的扩展配置（loading / hideErrorToast / selfHandleError）
 */
export const getCampaignList = (params = {}, options = {}) => {
  return http.get('/api/camp/enroll/getCampaignList', params, options)
}
