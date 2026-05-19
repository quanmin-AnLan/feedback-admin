import { generateUuid } from '@/utils/uuid'

/**
 * 题型枚举（与下游接口约定）：input | textarea | radio | checkbox | upload
 */
export const QUESTION_TYPES = {
  INPUT: 'input',
  TEXTAREA: 'textarea',
  RADIO: 'radio',
  CHECKBOX: 'checkbox',
  UPLOAD: 'upload'
}

/**
 * 选项数据结构（与下游约定）：
 *   { label, value, openInput, openInputPlaceholder, openInputMaxLength }
 *   - value 作为提交字段，使用 uuid 保证关联关系稳定，不暴露给用户
 */
export const createOption = (label = '') => ({
  label,
  value: generateUuid(),
  openInput: false,
  openInputPlaceholder: '请输入',
  openInputMaxLength: 100
})

/**
 * 题目数据结构（与下游约定）：
 *   {
 *     id, title, type, require,
 *     placeholder?, maxLength?, isNum?,        // input / textarea / upload
 *     options?[],                              // radio / checkbox
 *     relation: { enabled, dependOnQuestionId, showWhenOptionsSelected[] }
 *   }
 */
export const createQuestion = (type) => {
  const base = {
    id: generateUuid(),
    type,
    title: '',
    require: false,
    relation: {
      enabled: false,
      dependOnQuestionId: null,
      showWhenOptionsSelected: []
    }
  }

  if (type === QUESTION_TYPES.INPUT) {
    return {
      ...base,
      placeholder: '请输入',
      maxLength: 100,
      isNum: false
    }
  }
  if (type === QUESTION_TYPES.TEXTAREA) {
    return {
      ...base,
      placeholder: '请输入',
      maxLength: 500
    }
  }
  if (type === QUESTION_TYPES.RADIO || type === QUESTION_TYPES.CHECKBOX) {
    return {
      ...base,
      options: [createOption('选项1'), createOption('选项2')]
    }
  }
  if (type === QUESTION_TYPES.UPLOAD) {
    return {
      ...base,
      placeholder: '',
      uploadLimit: 9
    }
  }
  return base
}

export const questionTypeLabel = (type) => {
  const map = {
    [QUESTION_TYPES.INPUT]: '单行输入',
    [QUESTION_TYPES.TEXTAREA]: '多行输入',
    [QUESTION_TYPES.RADIO]: '单选题',
    [QUESTION_TYPES.CHECKBOX]: '多选题',
    [QUESTION_TYPES.UPLOAD]: '图片上传'
  }
  return map[type] || type
}
