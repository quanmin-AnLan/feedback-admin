import moment from 'moment'

/** 管理后台统一展示的本地日期时间格式 */
export const DATETIME_DISPLAY_FORMAT = 'YYYY-MM-DD HH:mm:ss'

/**
 * 将接口返回的时间（ISO / 时间戳 / 可解析字符串）格式化为客户端本地时间
 * @param {string|number|Date} value
 * @param {string} [fallback='—']
 */
export function formatDateTime(value, fallback = '—') {
  if (value === undefined || value === null || value === '') return fallback
  const m = moment(value)
  if (!m.isValid()) return String(value)
  return m.format(DATETIME_DISPLAY_FORMAT)
}

/**
 * 判断字符串是否像 ISO 日期时间（用于答案展示等场景）
 */
export function looksLikeIsoDateTime(str) {
  if (typeof str !== 'string') return false
  const s = str.trim()
  return /^\d{4}-\d{2}-\d{2}T/.test(s) || /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(s)
}
