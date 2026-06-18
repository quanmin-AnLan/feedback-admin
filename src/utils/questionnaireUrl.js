const FARM_BASE_URL = 'http://farm.anlan.xyz'

/** farm 站点根地址 */
export function getFarmBaseUrl() {
  return FARM_BASE_URL
}

/** 默认问卷入口（farm 首页） */
export function getDefaultQuestionnaireEntryUrl() {
  return getFarmBaseUrl()
}

/** 独立问卷地址：/feedback/{questionnaireId} */
export function getIndependentQuestionnaireUrl(questionnaireId) {
  const id = questionnaireId != null ? String(questionnaireId).trim() : ''
  if (!id) return ''
  return `${getFarmBaseUrl()}/feedback/${id}`
}

export async function copyTextToClipboard(text) {
  const value = text != null ? String(text).trim() : ''
  if (!value) return false
  if (navigator.clipboard && navigator.clipboard.writeText) {
    await navigator.clipboard.writeText(value)
    return true
  }
  const ta = document.createElement('textarea')
  ta.value = value
  ta.style.position = 'fixed'
  ta.style.left = '-9999px'
  document.body.appendChild(ta)
  ta.select()
  const ok = document.execCommand('copy')
  document.body.removeChild(ta)
  return ok
}
