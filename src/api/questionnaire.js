import http from './http'
import { generateUuid } from '@/utils/uuid'

/**
 * 真实 API 调用 —— 当前后端未就绪，此处仅为接口契约（路径/方法/参数预留）。
 * 后端联调时把 export default 改为 apiQuestionnaire 即可。
 */
export const apiQuestionnaire = {
  list(params) {
    return http.get('/questionnaire/list', { params })
  },
  detail(questionnaireId) {
    return http.get(`/questionnaire/${questionnaireId}`)
  },
  create(payload) {
    return http.post('/questionnaire', payload)
  },
  update(questionnaireId, payload) {
    return http.put(`/questionnaire/${questionnaireId}`, payload)
  },
  remove(questionnaireId) {
    return http.delete(`/questionnaire/${questionnaireId}`)
  }
}

// ===== 本地 mock 实现 =====
// 仅用于无后端时让前端流程跑通，结构与真实 API 保持一致
const STORAGE_KEY = 'feedback-admin:questionnaire-list'

const readStore = () => {
  if (typeof localStorage === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

const writeStore = (list) => {
  if (typeof localStorage === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

const delay = (data, ms = 200) =>
  new Promise((resolve) => setTimeout(() => resolve(data), ms))

// 初始化一些示例数据，方便首页直接看到效果
const seedIfEmpty = () => {
  const list = readStore()
  if (list.length) return
  const seed = [
    {
      questionnaireId: 'wj_demo_001',
      title: '示例问卷 —— 水果偏好调研',
      description: '你觉得西瓜和橘子哪个更好吃？',
      anonymous: false,
      questions: [],
      success: { textMode: 'default', customText: '', redirectUrl: '' }
    },
    {
      questionnaireId: 'wj_demo_002',
      title: '示例问卷 —— 用户体验反馈',
      description: '帮我们更好地优化产品',
      anonymous: true,
      questions: [],
      success: { textMode: 'default', customText: '', redirectUrl: '' }
    }
  ]
  writeStore(seed)
}

export const mockQuestionnaire = {
  list() {
    seedIfEmpty()
    const list = readStore().map((q) => ({
      questionnaireId: q.questionnaireId,
      title: q.title
    }))
    return delay({ list, total: list.length })
  },
  detail(questionnaireId) {
    seedIfEmpty()
    const list = readStore()
    const target = list.find((q) => q.questionnaireId === questionnaireId)
    if (!target) return Promise.reject(new Error('问卷不存在'))
    return delay(JSON.parse(JSON.stringify(target)))
  },
  create(payload) {
    const list = readStore()
    const item = {
      ...payload,
      questionnaireId: payload.questionnaireId || `wj_${generateUuid()}`
    }
    list.push(item)
    writeStore(list)
    return delay({ questionnaireId: item.questionnaireId })
  },
  update(questionnaireId, payload) {
    const list = readStore()
    const idx = list.findIndex((q) => q.questionnaireId === questionnaireId)
    if (idx === -1) return Promise.reject(new Error('问卷不存在'))
    list[idx] = { ...list[idx], ...payload, questionnaireId }
    writeStore(list)
    return delay({ questionnaireId })
  },
  remove(questionnaireId) {
    const list = readStore().filter(
      (q) => q.questionnaireId !== questionnaireId
    )
    writeStore(list)
    return delay({ success: true })
  }
}

// 当前默认走 mock；接入真实后端后将下一行改为 export default apiQuestionnaire 即可。
export default mockQuestionnaire
