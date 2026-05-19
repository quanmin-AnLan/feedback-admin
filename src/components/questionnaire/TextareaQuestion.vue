<template>
  <question-item
    :value="value"
    :index="index"
    :questions="questions"
    title-placeholder="请输入题目（多行输入）"
    @input="emitChange"
    @remove="$emit('remove')"
  >
    <div class="textarea-q">
      <el-input
        type="textarea"
        :rows="3"
        disabled
        :placeholder="value.placeholder || '请输入'"
      />

      <div class="textarea-q__settings">
        <div class="textarea-q__settings-item">
          <span class="textarea-q__label">占位文案</span>
          <el-input
            :value="value.placeholder"
            placeholder="请输入"
            size="small"
            class="textarea-q__settings-input"
            @input="updateField('placeholder', $event)"
          />
        </div>
        <div class="textarea-q__settings-item">
          <span class="textarea-q__label">字数限制</span>
          <el-input-number
            :value="value.maxLength"
            size="small"
            :min="1"
            :max="99999"
            :step="50"
            controls-position="right"
            @change="updateField('maxLength', $event)"
          />
        </div>
      </div>
    </div>
  </question-item>
</template>

<script>
import QuestionItem from './QuestionItem.vue'

export default {
  name: 'TextareaQuestion',
  components: { QuestionItem },
  props: {
    value: { type: Object, required: true },
    index: { type: Number, required: true },
    questions: { type: Array, default: () => [] }
  },
  methods: {
    emitChange(next) {
      this.$emit('input', next)
    },
    updateField(field, val) {
      this.$emit('input', { ...this.value, [field]: val })
    }
  }
}
</script>

<style scoped>
.textarea-q {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.textarea-q__settings {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
  padding: 10px 12px;
  background: #fafafa;
  border-radius: 4px;
}

.textarea-q__settings-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.textarea-q__label {
  font-size: 12px;
  color: #606266;
}

.textarea-q__settings-input {
  width: 180px;
}
</style>
