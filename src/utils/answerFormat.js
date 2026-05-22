import { formatDateTime, looksLikeIsoDateTime } from '@/utils/formatDateTime'

/**
 * 解析上传题答案为文件列表（farm 提交格式：[{ url, name }]）
 */
export function parseUploadFiles(raw) {
  if (raw === undefined || raw === null || raw === '') return []
  const list = Array.isArray(raw) ? raw : [raw]
  return list
    .map((item) => {
      if (typeof item === 'string' && item.trim()) {
        return { url: item.trim(), name: '' }
      }
      if (item && typeof item === 'object' && item.url) {
        return {
          url: String(item.url),
          name: item.name ? String(item.name) : ''
        }
      }
      return null
    })
    .filter(Boolean)
}

/**
 * 将单题原始答案格式化为可读文本（与 anlan-server 答卷/统计解析约定一致）
 */
export function formatAnswerValue(raw, question) {
  if (raw === undefined || raw === null || raw === '') return '—'
  const type = question && question.type

  if (type === 'radio') {
    const parsed =
      typeof raw === 'string' ? { value: raw, openTexts: {} } : raw || {}
    const opt = (question.options || []).find(
      (o) => String(o.value) === String(parsed.value)
    )
    let text = (opt && opt.label) || parsed.value || ''
    const extras = parsed.openTexts
      ? Object.values(parsed.openTexts).filter(Boolean)
      : []
    if (extras.length) text += `（${extras.join('；')}）`
    return text || '—'
  }

  if (type === 'checkbox') {
    const values = Array.isArray(raw)
      ? raw
      : Array.isArray(raw.values)
        ? raw.values
        : []
    const openTexts =
      raw && typeof raw === 'object' && raw.openTexts ? raw.openTexts : {}
    const labels = values.map((v) => {
      const opt = (question.options || []).find(
        (o) => String(o.value) === String(v)
      )
      let text = (opt && opt.label) || v
      const extra = openTexts[v]
      if (extra) text += `（${extra}）`
      return text
    })
    return labels.length ? labels.join('、') : '—'
  }

  if (type === 'upload') {
    const files = parseUploadFiles(raw)
    if (!files.length) return '—'
    return files.map((f) => f.name || f.url).join('、')
  }

  if (type === 'date') {
    const text = String(raw).trim()
    if (!text) return '—'
    if (looksLikeIsoDateTime(text)) return formatDateTime(text)
    return text
  }

  return String(raw).trim() || '—'
}
