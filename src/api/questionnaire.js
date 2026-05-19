import http from './http'

/**
 * 问卷接口（与 anlan-server /questionnaire 前缀的路由一一对应）
 * 请求/响应字段命名与 farm-feedback 已拉齐：
 *   - 问卷外层 id 字段：questionnaireId
 *   - 问卷说明字段：description
 *   - 题目结构字段：与 components/questionnaire/utils.js 中 createQuestion 输出对齐
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
  },
  // ===== 答卷相关 =====
  listAnswers(questionnaireId, params) {
    return http.get(`/questionnaire/${questionnaireId}/answers`, { params })
  }
}

export default apiQuestionnaire
