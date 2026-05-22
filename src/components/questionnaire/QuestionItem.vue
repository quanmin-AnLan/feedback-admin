<template>
  <div class="q-item">
    <!-- 题目标题 -->
    <div class="q-item__title">
      <span class="q-item__index">{{ index + 1 }}.</span>
      <el-input
        :value="value.title"
        :placeholder="titlePlaceholder"
        size="small"
        class="q-item__title-input"
        @input="updateField('title', $event)"
      />
    </div>

    <!-- 题目主体（由具体题型实现） -->
    <div class="q-item__body">
      <slot />
    </div>

    <!-- 底部工具栏 -->
    <div class="q-item__footer">
      <div class="q-item__footer-left">
        <el-checkbox
          v-if="enableLink"
          :value="relation.enabled"
          @change="onToggleLink"
        >
          关联题目
        </el-checkbox>
        <el-checkbox
          :value="value.require"
          @change="updateField('require', $event)"
        >
          设为必填
        </el-checkbox>
        <el-checkbox
          v-if="canDuplicateCheck"
          :value="duplicateCheck.enabled"
          @change="onToggleDuplicateCheck"
        >
          校验重复
        </el-checkbox>
      </div>
      <div class="q-item__footer-right">
        <el-button type="text" @click="$emit('remove')">删除</el-button>
        <el-button
          type="text"
          class="q-item__drag-handle"
          icon="el-icon-rank"
        >
          移动
        </el-button>
      </div>
    </div>

    <!-- 关联题目设置 -->
    <div v-if="enableLink && relation.enabled" class="q-item__link">
      <el-select
        :value="relation.dependOnQuestionId"
        placeholder="请选关联题目"
        size="small"
        clearable
        class="q-item__link-select"
        @change="onDependOnQuestionChange"
      >
        <el-option
          v-for="opt in linkableQuestions"
          :key="opt.id"
          :label="opt.label"
          :value="opt.id"
        />
      </el-select>
      <el-select
        :value="relation.showWhenOptionsSelected"
        placeholder="请选择关联选项（可多选）"
        size="small"
        multiple
        collapse-tags
        :disabled="!relation.dependOnQuestionId"
        class="q-item__link-select q-item__link-select--wide"
        @change="updateRelation('showWhenOptionsSelected', $event)"
      >
        <el-option
          v-for="opt in linkableOptions"
          :key="opt.value"
          :label="opt.label"
          :value="opt.value"
        />
      </el-select>
    </div>

    <div v-if="canDuplicateCheck && duplicateCheck.enabled" class="q-item__dup">
      <span class="q-item__dup-label">重复提示字段名</span>
      <el-input
        :value="duplicateCheck.fieldLabel"
        size="small"
        placeholder="如：手机号、订单号（用于提示文案中的 xx）"
        class="q-item__dup-input"
        @input="updateDuplicateCheck('fieldLabel', $event)"
      />
    </div>
  </div>
</template>

<script>
const DUPLICATE_CHECK_TYPES = ['input', 'textarea', 'radio', 'date']

export default {
  name: 'QuestionItem',
  props: {
    value: { type: Object, required: true },
    index: { type: Number, required: true },
    questions: { type: Array, default: () => [] },
    enableLink: { type: Boolean, default: true },
    titlePlaceholder: { type: String, default: '请输入题目' }
  },
  computed: {
    canDuplicateCheck() {
      return DUPLICATE_CHECK_TYPES.includes(this.value.type)
    },
    duplicateCheck() {
      return (
        this.value.duplicateCheck || {
          enabled: false,
          fieldLabel: ''
        }
      )
    },
    relation() {
      return (
        this.value.relation || {
          enabled: false,
          dependOnQuestionId: null,
          showWhenOptionsSelected: []
        }
      )
    },
    // 可被关联的题目：排除自身、且必须是单选 / 多选
    linkableQuestions() {
      return this.questions
        .map((q, i) => ({ q, i }))
        .filter(
          ({ q }) =>
            q.id !== this.value.id &&
            (q.type === 'radio' || q.type === 'checkbox')
        )
        .map(({ q, i }) => ({
          id: q.id,
          label: `第 ${i + 1} 题：${q.title || '未命名'}`
        }))
    },
    linkableOptions() {
      const target = this.questions.find(
        (q) => q.id === this.relation.dependOnQuestionId
      )
      if (!target || !target.options) return []
      return target.options.map((o, i) => ({
        value: o.value,
        label: o.label || `选项 ${i + 1}`
      }))
    }
  },
  methods: {
    updateField(field, val) {
      this.$emit('input', { ...this.value, [field]: val })
    },
    updateRelation(field, val) {
      this.$emit('input', {
        ...this.value,
        relation: { ...this.relation, [field]: val }
      })
    },
    onToggleLink(val) {
      const nextRelation = {
        ...this.relation,
        enabled: val
      }
      if (!val) {
        nextRelation.dependOnQuestionId = null
        nextRelation.showWhenOptionsSelected = []
      }
      this.$emit('input', { ...this.value, relation: nextRelation })
    },
    onDependOnQuestionChange(val) {
      // 切换关联题目时清空已选关联选项
      this.$emit('input', {
        ...this.value,
        relation: {
          ...this.relation,
          dependOnQuestionId: val,
          showWhenOptionsSelected: []
        }
      })
    },
    updateDuplicateCheck(field, val) {
      this.$emit('input', {
        ...this.value,
        duplicateCheck: { ...this.duplicateCheck, [field]: val }
      })
    },
    onToggleDuplicateCheck(val) {
      const next = {
        ...this.duplicateCheck,
        enabled: val
      }
      if (val && !String(next.fieldLabel || '').trim()) {
        next.fieldLabel = this.value.title || ''
      }
      if (!val) next.fieldLabel = ''
      this.$emit('input', { ...this.value, duplicateCheck: next })
    }
  }
}
</script>

<style scoped>
.q-item {
  border: 1px solid #ebeef5;
  background: #fff;
  border-radius: 6px;
  padding: 16px;
  margin-bottom: 16px;
}

.q-item__title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.q-item__index {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  min-width: 22px;
}

.q-item__title-input {
  flex: 1;
}

.q-item__body {
  padding: 4px 0 12px;
}

.q-item__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 12px;
  border-top: 1px dashed #ebeef5;
}

.q-item__footer-left {
  display: flex;
  align-items: center;
  gap: 18px;
}

.q-item__footer-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.q-item__drag-handle {
  cursor: move;
}

.q-item__link {
  display: flex;
  gap: 12px;
  margin-top: 12px;
}

.q-item__link-select {
  width: 220px;
}

.q-item__link-select--wide {
  flex: 1;
  width: auto;
  max-width: 360px;
}

.q-item__dup {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  padding: 10px 12px;
  background: #fafafa;
  border-radius: 4px;
}

.q-item__dup-label {
  flex: 0 0 108px;
  font-size: 12px;
  color: #606266;
}

.q-item__dup-input {
  flex: 1;
  max-width: 360px;
}
</style>
