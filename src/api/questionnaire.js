import http from './http'

/**
 * 问卷接口（与 anlan-server /questionnaire 前缀的路由一一对应）
 * 请求/响应字段命名与 farm-feedback 已拉齐：
 *   - 问卷外层 id 字段：questionnaireId
 *   - 问卷说明字段：description
 *   - 题目结构字段：与 components/questionnaire/utils.js 中 createQuestion 输出对齐
 *   - 组合必填：groupRequires[]，与 groupRequire.js 约定对齐
 *   - 列表项含 answerCount：该问卷答卷条数
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
  /**
   * @param {object} params - page, size；reviewStatus 为多选状态（pending 等），逗号分隔，不传为全部
   */
  listAnswers(questionnaireId, params) {
    return http.get(`/questionnaire/${questionnaireId}/answers`, { params })
  },
  /** 删除答卷（单条/批量），body: { answerIds: string[] } */
  deleteAnswers(questionnaireId, answerIds) {
    return http.post(
      `/questionnaire/${questionnaireId}/answers/delete`,
      { answerIds },
    )
  },
  /** 更新单条答卷状态，body: { reviewStatus } */
  updateAnswerReviewStatus(questionnaireId, answerId, reviewStatus) {
    return http.put(
      `/questionnaire/${questionnaireId}/answers/${answerId}/review-status`,
      { reviewStatus },
    )
  },
  getStatistics(questionnaireId) {
    return http.get(`/questionnaire/${questionnaireId}/statistics`)
  },
  /** 获取默认题型配置，data 为 string[] */
  getDefaultConfig() {
    return http.get('/questionnaire/defaultConfig')
  },
  /** 保存默认题型配置 */
  updateDefaultConfig(defaultTypes) {
    return http.put('/questionnaire/defaultConfig', defaultTypes)
  }
}

export default apiQuestionnaire
