<template>
  <question-item
    :value="value"
    :index="index"
    :questions="questions"
    title-placeholder="请输入题目（单行输入）"
    @input="emitChange"
    @remove="$emit('remove')"
  >
    <div class="input-q">
      <!-- 答题者预览 -->
      <el-input
        disabled
        :placeholder="value.placeholder || '请输入'"
        class="input-q__preview"
      />

      <!-- 配置项 -->
      <div class="input-q__settings">
        <div class="input-q__settings-item">
          <span class="input-q__label">占位文案</span>
          <el-input
            :value="value.placeholder"
            placeholder="请输入"
            size="small"
            class="input-q__settings-input"
            @input="updateField('placeholder', $event)"
          />
        </div>
        <div class="input-q__settings-item">
          <span class="input-q__label">字数限制</span>
          <el-input-number
            :value="value.maxLength"
            size="small"
            :min="1"
            :max="9999"
            :step="10"
            controls-position="right"
            @change="updateField('maxLength', $event)"
          />
        </div>
        <el-checkbox
          :value="value.isNum"
          @change="updateField('isNum', $event)"
        >
          仅允许数字
        </el-checkbox>
      </div>
    </div>
  </question-item>
</template>

<script>
import QuestionItem from './QuestionItem.vue'

export default {
  name: 'InputQuestion',
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
.input-q {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.input-q__preview {
  max-width: 480px;
}

.input-q__settings {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
  padding: 10px 12px;
  background: #fafafa;
  border-radius: 4px;
}

.input-q__settings-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.input-q__label {
  font-size: 12px;
  color: #606266;
}

.input-q__settings-input {
  width: 180px;
}
</style>
