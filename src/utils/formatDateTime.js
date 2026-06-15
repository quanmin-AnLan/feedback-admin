/** 管理后台统一展示的本地日期时间格式 */
export const DATETIME_DISPLAY_FORMAT = 'YYYY-MM-DD HH:mm:ss'

function pad2(n) {
  return n < 10 ? `0${n}` : String(n)
}

/**
 * 将接口返回的时间（ISO / 时间戳 / 可解析字符串）格式化为客户端本地时间
 * 服务端统一返回 ISO 时间戳，原生 Date 即可可靠解析并转为本地时区展示，
 * 因此无需引入 moment 等重量级日期库。
 * @param {string|number|Date} value
 * @param {string} [fallback='—']
 */
export function formatDateTime(value, fallback = '—') {
  if (value === undefined || value === null || value === '') return fallback
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)
  const y = date.getFullYear()
  const mo = pad2(date.getMonth() + 1)
  const d = pad2(date.getDate())
  const h = pad2(date.getHours())
  const mi = pad2(date.getMinutes())
  const s = pad2(date.getSeconds())
  return `${y}-${mo}-${d} ${h}:${mi}:${s}`
}

/**
 * 判断字符串是否像 ISO 日期时间（用于答案展示等场景）
 */
export function looksLikeIsoDateTime(str) {
  if (typeof str !== 'string') return false
  const s = str.trim()
  return /^\d{4}-\d{2}-\d{2}T/.test(s) || /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(s)
}
