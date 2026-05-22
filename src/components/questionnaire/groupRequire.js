import { generateUuid } from '@/utils/uuid'

/**
 * 组合必填规则（问卷级，与下游 farm-feedback / anlan-server 约定）：
 *   { id, questionIds: string[], minFill?: number, message?: string }
 * - 组内至少 minFill 道题有有效作答（默认 1）
 */
export function createGroupRequire(questionIds = []) {
  return {
    id: `grp_${generateUuid()}`,
    questionIds: questionIds.map(String),
    minFill: 1,
    message: '',
  }
}

export function normalizeGroupRequires(raw, questionIds) {
  if (!Array.isArray(raw)) return []
  const valid = new Set((questionIds || []).map(String))
  return raw
    .map((g) => {
      if (!g || typeof g !== 'object') return null
      const ids = Array.isArray(g.questionIds)
        ? g.questionIds.map(String).filter((id) => valid.has(id))
        : []
      if (ids.length < 2) return null
      const minFill = Math.max(
        1,
        Math.min(ids.length, Number(g.minFill) || 1),
      )
      return {
        id: g.id ? String(g.id) : `grp_${generateUuid()}`,
        questionIds: ids,
        minFill,
        message: g.message != null ? String(g.message) : '',
      }
    })
    .filter(Boolean)
}

/** 题目序号文案，用于默认提示 */
export function formatQuestionIndexes(questions, ids) {
  const indexMap = new Map(questions.map((q, i) => [String(q.id), i + 1]))
  return ids
    .map((id) => indexMap.get(String(id)))
    .filter((n) => n != null)
    .sort((a, b) => a - b)
}

export function defaultGroupRequireMessage(questions, group) {
  const nums = formatQuestionIndexes(questions, group.questionIds)
  const min = group.minFill || 1
  if (nums.length === 0) return `请至少完成 ${min} 项`
  if (nums.length === 1) return `第 ${nums[0]} 题为必填`
  const range =
    nums.length === 2
      ? `第 ${nums[0]}、${nums[1]} 题`
      : `第 ${nums.slice(0, -1).join('、')}、${nums[nums.length - 1]} 题`
  return `${range}至少填写 ${min} 项`
}

export function pruneGroupRequiresOnQuestionRemove(groups, removedId) {
  const rid = String(removedId)
  return (groups || [])
    .map((g) => ({
      ...g,
      questionIds: (g.questionIds || []).filter((id) => String(id) !== rid),
    }))
    .filter((g) => g.questionIds && g.questionIds.length >= 2)
}

export function getGroupsForQuestion(groups, questionId) {
  const qid = String(questionId)
  return (groups || []).filter((g) =>
    (g.questionIds || []).some((id) => String(id) === qid),
  )
}
