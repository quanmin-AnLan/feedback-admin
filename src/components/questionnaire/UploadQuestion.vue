<template>
  <question-item
    :value="value"
    :index="index"
    :questions="questions"
    title-placeholder="请输入题目（图片上传）"
    @input="emitChange"
    @remove="$emit('remove')"
  >
    <div class="upload-q">
      <div class="upload-q__uploader">
        <i class="el-icon-plus"></i>
        <span class="upload-q__uploader-text">上传图片</span>
      </div>
      <div class="upload-q__settings-item">
        <span class="upload-q__label">上传要求提示</span>
        <el-input
          type="textarea"
          :rows="2"
          :value="value.placeholder"
          placeholder="例如：支持 jpg/png，单张不超过 2MB（选填）"
          class="upload-q__settings-input"
          @input="updateField('placeholder', $event)"
        />
      </div>
    </div>
  </question-item>
</template>

<script>
import QuestionItem from './QuestionItem.vue'

export default {
  name: 'UploadQuestion',
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
.upload-q {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.upload-q__uploader {
  width: 100px;
  height: 100px;
  border: 1px dashed #dcdfe6;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #909399;
  background: #fafafa;
  cursor: not-allowed;
}

.upload-q__uploader i {
  font-size: 24px;
  margin-bottom: 4px;
}

.upload-q__uploader-text {
  font-size: 12px;
}

.upload-q__settings-item {
  display: flex;
  gap: 12px;
}

.upload-q__label {
  font-size: 12px;
  color: #606266;
  margin-top: 6px;
  min-width: 84px;
}

.upload-q__settings-input {
  flex: 1;
  max-width: 480px;
}
</style>
