/**
 * API 统一出口:按业务域拆分在 user / miniApp / upload 中,
 * 页面统一从 '@/api' 导入,新增接口按域添加到对应文件即可。
 */
export * from './user'
export * from './miniApp'
export * from './upload'
