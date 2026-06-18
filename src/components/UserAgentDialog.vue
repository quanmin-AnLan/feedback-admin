<template>
  <el-dialog
    title="User-Agent 详情"
    :visible.sync="visible"
    width="560px"
    append-to-body
    class="ua-dialog"
    @closed="onClosed"
  >
    <div v-if="parsed" class="ua-dialog__body">
      <div v-if="parsed.summary" class="ua-dialog__summary">
        {{ parsed.summary }}
      </div>

      <div v-if="parsed.deviceNote" class="ua-dialog__note">
        {{ parsed.deviceNote }}
      </div>

      <div
        v-for="section in parsed.sections"
        :key="section.title"
        class="ua-dialog__section"
      >
        <div class="ua-dialog__section-title">{{ section.title }}</div>
        <div class="ua-dialog__grid">
          <div
            v-for="item in section.items"
            :key="`${section.title}-${item.label}`"
            class="ua-dialog__row"
          >
            <span class="ua-dialog__label">{{ item.label }}</span>
            <span class="ua-dialog__value">{{ item.value }}</span>
          </div>
        </div>
      </div>

      <div class="ua-dialog__section">
        <div class="ua-dialog__section-title">原始 UA</div>
        <div class="ua-dialog__raw">{{ parsed.raw }}</div>
      </div>
    </div>
    <el-empty v-else description="无 UA 信息" :image-size="72" />

    <template slot="footer">
      <el-button
        v-if="parsed && parsed.raw"
        size="small"
        @click="copyRaw"
      >
        复制原始 UA
      </el-button>
      <el-button type="primary" size="small" @click="visible = false">
        关闭
      </el-button>
    </template>
  </el-dialog>
</template>

<script>
const LEGACY_NOTE =
  '该答卷提交于服务端解析功能上线前，仅保留原始 UA，无结构化设备信息。'

export default {
  name: 'UserAgentDialog',
  props: {
    value: { type: Boolean, default: false },
    userAgent: { type: String, default: '' },
    deviceInfo: { type: Object, default: null }
  },
  computed: {
    visible: {
      get() {
        return this.value
      },
      set(v) {
        this.$emit('input', v)
      }
    },
    parsed() {
      const ua = this.userAgent != null ? String(this.userAgent).trim() : ''
      if (this.deviceInfo && typeof this.deviceInfo === 'object') {
        return {
          ...this.deviceInfo,
          raw: this.deviceInfo.raw || ua
        }
      }
      if (!ua) return null
      return {
        summary: '暂无设备解析数据',
        sections: [],
        raw: ua,
        deviceNote: LEGACY_NOTE
      }
    }
  },
  methods: {
    onClosed() {
      this.$emit('closed')
    },
    async copyRaw() {
      const text = this.parsed && this.parsed.raw
      if (!text) return
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(text)
        } else {
          const ta = document.createElement('textarea')
          ta.value = text
          ta.style.position = 'fixed'
          ta.style.left = '-9999px'
          document.body.appendChild(ta)
          ta.select()
          document.execCommand('copy')
          document.body.removeChild(ta)
        }
        this.$message.success('已复制到剪贴板')
      } catch {
        this.$message.error('复制失败')
      }
    }
  }
}
</script>

<style scoped>
.ua-dialog__body {
  max-height: 60vh;
  overflow-y: auto;
}

.ua-dialog__summary {
  margin-bottom: 16px;
  padding: 10px 12px;
  font-size: 13px;
  line-height: 1.5;
  color: #303133;
  background: #f5f7fa;
  border-radius: 4px;
  word-break: break-all;
}

.ua-dialog__note {
  margin-bottom: 16px;
  padding: 10px 12px;
  font-size: 12px;
  line-height: 1.6;
  color: #e6a23c;
  background: #fdf6ec;
  border: 1px solid #faecd8;
  border-radius: 4px;
}

.ua-dialog__section + .ua-dialog__section {
  margin-top: 16px;
}

.ua-dialog__section-title {
  margin-bottom: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #606266;
}

.ua-dialog__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px 16px;
}

.ua-dialog__row {
  display: flex;
  gap: 8px;
  font-size: 13px;
  line-height: 1.5;
}

.ua-dialog__label {
  flex: 0 0 72px;
  color: #909399;
}

.ua-dialog__value {
  flex: 1;
  color: #303133;
  word-break: break-all;
}

.ua-dialog__raw {
  padding: 10px 12px;
  font-size: 12px;
  line-height: 1.6;
  color: #606266;
  background: #fafafa;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  word-break: break-all;
  white-space: pre-wrap;
}
</style>
