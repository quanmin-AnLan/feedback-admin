<template>
  <div class="q-url-link">
    <el-tooltip :content="url" placement="top" :disabled="!url">
      <a
        class="q-url-link__anchor"
        :href="url"
        target="_blank"
        rel="noopener noreferrer"
      >{{ url }}</a>
    </el-tooltip>
    <el-button
      type="text"
      class="q-url-link__copy"
      @click="onCopy"
    >
      复制
    </el-button>
  </div>
</template>

<script>
import { copyTextToClipboard } from '@/utils/questionnaireUrl'

export default {
  name: 'QuestionnaireUrlLink',
  props: {
    url: { type: String, default: '' }
  },
  methods: {
    async onCopy() {
      if (!this.url) return
      try {
        const ok = await copyTextToClipboard(this.url)
        if (ok) this.$message.success('已复制到剪贴板')
        else this.$message.error('复制失败')
      } catch {
        this.$message.error('复制失败')
      }
    }
  }
}
</script>

<style scoped>
.q-url-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  max-width: 100%;
}

.q-url-link__anchor {
  color: #409eff;
  text-decoration: none;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.q-url-link__anchor:hover {
  text-decoration: underline;
}

.q-url-link__copy {
  flex-shrink: 0;
  padding: 0 !important;
  color: #909399 !important;
}

.q-url-link__copy:hover {
  color: #606266 !important;
}
</style>
