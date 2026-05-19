/**
 * 生成 RFC 4122 v4 规范的唯一 ID。
 * - 现代浏览器优先走原生 crypto.randomUUID（更快、更安全）
 * - 老浏览器降级到 Math.random 实现，保证可用性
 */
export function generateUuid() {
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return crypto.randomUUID()
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export default generateUuid
