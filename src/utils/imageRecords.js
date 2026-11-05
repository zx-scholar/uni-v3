/**
 * 上传图片记录
 *
 * 用途：把每次上传成功后返回的图片地址持久化到本地（uni.storage / localStorage），
 * 供 pages-common/imageRecord 页面集中查看、点击复制。
 *
 * 存储结构：[{ url, name, type, time }]，按时间倒序（最新在前），同一 url 只保留一条。
 */
const STORAGE_KEY = 'upload_image_records';

/** 最多保留条数，避免无限增长把 storage 撑爆 */
const MAX_RECORDS = 200;

/** 读取全部记录 */
export function getImageRecords() {
  try {
    const raw = uni.getStorageSync(STORAGE_KEY);
    if (!raw) return [];
    const list = typeof raw === 'string' ? JSON.parse(raw) : raw;
    return Array.isArray(list) ? list : [];
  } catch (e) {
    console.error('[imageRecords] 读取记录失败:', e);
    return [];
  }
}

/** 覆盖写入 */
function saveImageRecords(records) {
  try {
    uni.setStorageSync(STORAGE_KEY, records);
  } catch (e) {
    console.error('[imageRecords] 写入记录失败:', e);
  }
  return records;
}

/**
 * 新增一条记录（同一 url 会去重后置顶，保证"最近上传的排前面"）
 * @param {{ url: string, name?: string, type?: string }} record
 */
export function addImageRecord({ url, name = '', type = '' } = {}) {
  if (!url) return getImageRecords();

  const records = getImageRecords().filter((item) => item.url !== url);
  records.unshift({
    url,
    name,
    type,
    time: Date.now(),
  });

  return saveImageRecords(records.slice(0, MAX_RECORDS));
}

/** 删除单条记录 */
export function removeImageRecord(url) {
  const records = getImageRecords().filter((item) => item.url !== url);
  return saveImageRecords(records);
}

/** 清空全部记录 */
export function clearImageRecords() {
  return saveImageRecords([]);
}
