import http from '@/utils/request'

/**
 * 上传微信头像
 */
export const uploadUserAvatar = (filePath) => {
  return http.upload('/api/common/uploadFile', filePath, {
    path: 'gameImage'
  })
}

/**
 * 通用文件上传
 */
export const uploadFile = (filePath, data = {}) => {
  return http.upload('/api/common/uploadFile', filePath, {
    path: 'gameImage',
    ...data
  })
}
