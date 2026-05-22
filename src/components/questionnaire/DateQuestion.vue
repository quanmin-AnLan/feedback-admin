<template>
  <question-item
    :value="value"
    :index="index"
    :questions="questions"
    title-placeholder="请输入题目（日期）"
    @input="emitChange"
    @remove="$emit('remove')"
  >
    <div class="date-q">
      <el-date-picker
        disabled
        type="datetime"
        :placeholder="value.placeholder || '请选择日期时间'"
        value-format="yyyy-MM-dd HH:mm:ss"
        format="yyyy-MM-dd HH:mm:ss"
        class="date-q__preview"
      />

      <div class="date-q__settings">
        <div class="date-q__settings-item">
          <span class="date-q__label">占位文案</span>
          <el-input
            :value="value.placeholder"
            placeholder="请选择日期时间"
            size="small"
            class="date-q__settings-input"
            @input="updateField('placeholder', $event)"
          />
        </div>
      </div>
    </div>
  </question-item>
</template>

<script>
import QuestionItem from './QuestionItem.vue'

export default {
  name: 'DateQuestion',
  components: { QuestionItem },
  props: {
    value: { type: Object, required: true },
    index: { type: Number, required: true },
    questions: { type: Array, default: () => [] },
  },
  methods: {
    emitChange(next) {
      this.$emit('input', next)
    },
    updateField(field, val) {
      this.$emit('input', { ...this.value, [field]: val })
    },
  },
}
</script>

<style scoped>
.date-q {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.date-q__preview {
  max-width: 360px;
}

.date-q__settings {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
  padding: 10px 12px;
  background: #fafafa;
  border-radius: 4px;
}

.date-q__settings-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.date-q__label {
  font-size: 12px;
  color: #606266;
}

.date-q__settings-input {
  width: 220px;
}
</style>
