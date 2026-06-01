/** 答卷登记/审核状态，与 anlan-server ANSWER_REVIEW_STATUSES 一致 */
export const ANSWER_REVIEW_STATUS = {
  PENDING: 'pending',
  REGISTERED: 'registered',
  APPROVED: 'approved',
  REJECTED: 'rejected'
}

export const ANSWER_REVIEW_STATUS_OPTIONS = [
  { value: ANSWER_REVIEW_STATUS.PENDING, label: '待登记' },
  { value: ANSWER_REVIEW_STATUS.REGISTERED, label: '已登记' },
  { value: ANSWER_REVIEW_STATUS.APPROVED, label: '通过' },
  { value: ANSWER_REVIEW_STATUS.REJECTED, label: '驳回' }
]

const LABEL_MAP = Object.fromEntries(
  ANSWER_REVIEW_STATUS_OPTIONS.map((o) => [o.value, o.label])
)

const TAG_TYPE_MAP = {
  [ANSWER_REVIEW_STATUS.PENDING]: 'info',
  [ANSWER_REVIEW_STATUS.REGISTERED]: '',
  [ANSWER_REVIEW_STATUS.APPROVED]: 'success',
  [ANSWER_REVIEW_STATUS.REJECTED]: 'danger'
}

export function answerReviewStatusLabel(status) {
  return LABEL_MAP[status] || LABEL_MAP[ANSWER_REVIEW_STATUS.PENDING]
}

export function answerReviewStatusTagType(status) {
  return TAG_TYPE_MAP[status] != null ? TAG_TYPE_MAP[status] : 'info'
}

export function normalizeAnswerReviewStatus(status) {
  return LABEL_MAP[status] ? status : ANSWER_REVIEW_STATUS.PENDING
}
