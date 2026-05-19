<template>
  <question-item
    :value="value"
    :index="index"
    :questions="questions"
    title-placeholder="请输入多选题题目"
    @input="emitChange"
    @remove="$emit('remove')"
  >
    <div class="checkbox-q">
      <div
        v-for="(opt, idx) in value.options"
        :key="opt.value"
        class="checkbox-q__option"
      >
        <div class="checkbox-q__option-main">
          <el-checkbox disabled class="checkbox-q__indicator">
            <span></span>
          </el-checkbox>

          <el-input
            :value="opt.label"
            placeholder="请输入选项内容"
            size="small"
            class="checkbox-q__input"
            @input="updateOption(idx, 'label', $event)"
          />

          <div class="checkbox-q__option-actions">
            <el-button
              type="text"
              :disabled="value.options.length <= 1"
              @click="removeOption(idx)"
            >
              删除
            </el-button>
            <el-checkbox
              :value="opt.openInput"
              @change="updateOption(idx, 'openInput', $event)"
            >
              开放式选项
            </el-checkbox>
          </div>
        </div>

        <div v-if="opt.openInput" class="checkbox-q__open-config">
          <span class="checkbox-q__open-label">开放输入提示</span>
          <el-input
            :value="opt.openInputPlaceholder"
            placeholder="请输入"
            size="small"
            class="checkbox-q__open-input"
            @input="updateOption(idx, 'openInputPlaceholder', $event)"
          />
          <span class="checkbox-q__open-label">字数限制</span>
          <el-input-number
            :value="opt.openInputMaxLength"
            size="small"
            :min="1"
            :max="9999"
            :step="10"
            controls-position="right"
            @change="updateOption(idx, 'openInputMaxLength', $event)"
          />
        </div>
      </div>

      <el-button
        type="text"
        icon="el-icon-plus"
        class="checkbox-q__add"
        @click="addOption"
      >
        新增选项
      </el-button>
    </div>
  </question-item>
</template>

<script>
import QuestionItem from './QuestionItem.vue'
import { createOption } from './utils'

export default {
  name: 'CheckboxQuestion',
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
    updateOption(idx, field, val) {
      const options = this.value.options.map((o, i) =>
        i === idx ? { ...o, [field]: val } : o
      )
      this.$emit('input', { ...this.value, options })
    },
    addOption() {
      const options = [
        ...this.value.options,
        createOption(`选项${this.value.options.length + 1}`)
      ]
      this.$emit('input', { ...this.value, options })
    },
    removeOption(idx) {
      const removed = this.value.options[idx]
      const options = this.value.options.filter((_, i) => i !== idx)
      this.$emit('input', { ...this.value, options })
      this.$emit('option-removed', removed.value)
    }
  }
}
</script>

<style scoped>
.checkbox-q__option {
  padding: 6px 0;
}

.checkbox-q__option-main {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.checkbox-q__indicator {
  margin-right: 0;
}

.checkbox-q__input {
  flex: 1;
  min-width: 220px;
}

.checkbox-q__option-actions {
  display: flex;
  align-items: center;
  gap: 14px;
}

.checkbox-q__option-actions >>> .el-button--text {
  color: #f0a500;
}

.checkbox-q__open-config {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin: 8px 0 4px 30px;
  padding: 8px 12px;
  background: #fafafa;
  border-radius: 4px;
}

.checkbox-q__open-label {
  font-size: 12px;
  color: #606266;
}

.checkbox-q__open-input {
  width: 180px;
}

.checkbox-q__add {
  padding-left: 0;
  color: #409eff;
}
</style>
