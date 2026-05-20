<template>
  <div class="q-stats">
    <el-card v-loading="loading" shadow="never">
      <div slot="header" class="q-stats__header">
        <el-button type="text" icon="el-icon-arrow-left" @click="goBack">
          返回列表
        </el-button>
        <span class="q-stats__title">{{ pageTitle }}</span>
        <span v-if="stats" class="q-stats__meta">
          回收 {{ stats.totalSubmissions }} 份
        </span>
      </div>

      <template v-if="stats">
        <el-empty
          v-if="!stats.questions.length"
          description="该问卷暂无题目"
        />
        <div
          v-for="(q, idx) in stats.questions"
          :key="q.id || idx"
          class="q-stats__block"
        >
          <div class="q-stats__block-head">
            <span class="q-stats__q-title">{{ q.title || q.id }}</span>
            <el-tag size="small" type="info">{{ q.typeLabel || q.type }}</el-tag>
            <span
              v-if="q.totalRespondents != null && q.supported !== false"
              class="q-stats__count"
            >
              有效作答 {{ q.totalRespondents }} 人
            </span>
          </div>

          <el-alert
            v-if="q.supported === false"
            type="info"
            :closable="false"
            show-icon
            title="该题型暂不支持统计展示"
          />

          <el-table
            v-else-if="q.options"
            :data="q.options"
            border
            size="small"
            empty-text="暂无选项数据"
          >
            <el-table-column prop="label" label="选项" min-width="120" />
            <el-table-column prop="count" label="人数" width="80" align="center" />
            <el-table-column label="占比" width="90" align="center">
              <template #default="{ row }">{{ row.percent }}%</template>
            </el-table-column>
            <el-table-column label="填空内容" min-width="160">
              <template #default="{ row }">
                <template v-if="row.children && row.children.length">
                  <div
                    v-for="(text, i) in row.children"
                    :key="i"
                    class="q-stats__child"
                  >
                    {{ text }}
                  </div>
                </template>
                <span v-else class="q-stats__muted">—</span>
              </template>
            </el-table-column>
          </el-table>

          <el-table
            v-else-if="q.answers"
            :data="q.answers"
            border
            size="small"
            empty-text="暂无文本作答"
          >
            <el-table-column prop="text" label="作答内容" min-width="200" />
            <el-table-column
              prop="submitTime"
              label="提交时间"
              width="180"
              show-overflow-tooltip
            />
          </el-table>
        </div>
      </template>
    </el-card>
  </div>
</template>

<script>
import questionnaireApi from '@/api/questionnaire'

export default {
  name: 'QuestionnaireStatistics',
  props: {
    questionnaireId: { type: String, required: true }
  },
  data() {
    return {
      loading: false,
      stats: null
    }
  },
  computed: {
    pageTitle() {
      if (!this.stats) {
        return `答卷统计 · ${this.questionnaireId}`
      }
      return `答卷统计 · ${this.stats.title || this.questionnaireId}`
    }
  },
  created() {
    this.fetchStatistics()
  },
  methods: {
    goBack() {
      this.$router.push({ name: 'home' })
    },
    async fetchStatistics() {
      this.loading = true
      try {
        this.stats = await questionnaireApi.getStatistics(this.questionnaireId)
      } catch {
        this.stats = null
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.q-stats {
  max-width: 960px;
  margin: 0 auto;
}

.q-stats__header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.q-stats__title {
  flex: 1;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.q-stats__meta {
  font-size: 13px;
  color: #909399;
}

.q-stats__block {
  margin-bottom: 28px;
}

.q-stats__block:last-child {
  margin-bottom: 0;
}

.q-stats__block-head {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.q-stats__q-title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.q-stats__count {
  font-size: 13px;
  color: #909399;
}

.q-stats__child {
  font-size: 13px;
  line-height: 1.6;
  word-break: break-all;
}

.q-stats__muted {
  color: #c0c4cc;
}
</style>
