<template>
  <question-item
    :value="value"
    :index="index"
    :questions="questions"
    title-placeholder="请输入单选题题目"
    @input="emitChange"
    @remove="$emit('remove')"
  >
    <div class="radio-q">
      <div
        v-for="(opt, idx) in value.options"
        :key="opt.value"
        class="radio-q__option"
      >
        <div class="radio-q__option-main">
          <el-radio disabled :label="opt.value" :value="''" class="radio-q__indicator">
            <span></span>
          </el-radio>

          <el-input
            :value="opt.label"
            placeholder="请输入选项内容"
            size="small"
            class="radio-q__input"
            @input="updateOption(idx, 'label', $event)"
          />

          <div class="radio-q__option-actions">
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

        <!-- 开放式选项的扩展配置 -->
        <div v-if="opt.openInput" class="radio-q__open-config">
          <span class="radio-q__open-label">开放输入提示</span>
          <el-input
            :value="opt.openInputPlaceholder"
            placeholder="请输入"
            size="small"
            class="radio-q__open-input"
            @input="updateOption(idx, 'openInputPlaceholder', $event)"
          />
          <span class="radio-q__open-label">字数限制</span>
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
        class="radio-q__add"
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
  name: 'RadioQuestion',
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
      // 通知父层清理对该选项 value 的关联引用
      this.$emit('option-removed', removed.value)
    }
  }
}
</script>

<style scoped>
.radio-q__option {
  padding: 6px 0;
}

.radio-q__option-main {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.radio-q__indicator {
  margin-right: 0;
}

.radio-q__input {
  flex: 1;
  min-width: 220px;
}

.radio-q__option-actions {
  display: flex;
  align-items: center;
  gap: 14px;
}

.radio-q__option-actions >>> .el-button--text {
  color: #f0a500;
}

.radio-q__open-config {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin: 8px 0 4px 30px;
  padding: 8px 12px;
  background: #fafafa;
  border-radius: 4px;
}

.radio-q__open-label {
  font-size: 12px;
  color: #606266;
}

.radio-q__open-input {
  width: 180px;
}

.radio-q__add {
  padding-left: 0;
  color: #409eff;
}
</style>
