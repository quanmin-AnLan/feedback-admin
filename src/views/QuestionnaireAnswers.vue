<template>
  <div class="q-answers">
    <el-card v-loading="loading" shadow="never">
      <div slot="header" class="q-answers__header">
        <el-button type="text" icon="el-icon-arrow-left" @click="goBack">
          返回列表
        </el-button>
        <span class="q-answers__title">{{ pageTitle }}</span>
        <span v-if="total >= 0" class="q-answers__meta">共 {{ total }} 条</span>
        <el-tooltip
          :content="`需要 level ≥ ${writeLevel} 的账号`"
          :disabled="canEdit"
          placement="top"
        >
          <span>
            <el-button
              type="danger"
              size="small"
              plain
              :disabled="!canEdit || !selectedRows.length"
              :loading="deleting"
              @click="onBatchDelete"
            >
              批量删除
            </el-button>
          </span>
        </el-tooltip>
      </div>

      <el-table
        ref="answersTable"
        :data="list"
        border
        stripe
        empty-text="暂无答卷"
        @selection-change="onSelectionChange"
      >
        <el-table-column
          type="selection"
          width="48"
          :selectable="() => canEdit"
        />
        <el-table-column type="expand" width="48">
          <template #default="{ row }">
            <div class="q-answers__expand">
              <div
                v-for="q in questions"
                :key="q.id"
                class="q-answers__row"
              >
                <span class="q-answers__label">{{ q.title || q.id }}</span>
                <div class="q-answers__value">
                  <template v-if="q.type === uploadType">
                    <span
                      v-if="!getUploadFiles(row.answers[q.id]).length"
                      class="q-answers__empty"
                    >—</span>
                    <div v-else class="q-answers__uploads">
                      <div
                        v-for="(file, fi) in getUploadFiles(row.answers[q.id])"
                        :key="fi"
                        class="q-answers__upload-item"
                      >
                        <el-image
                          :src="file.url"
                          :preview-src-list="getUploadPreviewUrls(row.answers[q.id])"
                          fit="cover"
                          class="q-answers__thumb"
                        />
                      </div>
                    </div>
                  </template>
                  <template v-else>{{
                    formatAnswer(row.answers[q.id], q)
                  }}</template>
                </div>
              </div>
              <el-empty
                v-if="!questions.length"
                description="问卷无题目"
                :image-size="60"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="answerId" label="答卷 ID" width="220" />
        <el-table-column label="提交时间" width="180" show-overflow-tooltip>
          <template #default="{ row }">
            {{ formatDateTime(row.submitTime) }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="!anonymous"
          prop="submitterUuid"
          label="提交人 UUID"
          min-width="200"
          show-overflow-tooltip
        />
        <el-table-column prop="userAgent" label="UA" width="200" show-overflow-tooltip />
        <el-table-column label="操作" width="88" align="center" fixed="right">
          <template #default="{ row }">
            <el-button
              type="text"
              class="q-answers__danger"
              :disabled="!canEdit"
              @click="onDeleteOne(row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-if="total > 0"
        class="q-answers__pager"
        background
        layout="total, prev, pager, next, sizes"
        :current-page="page"
        :page-size="size"
        :page-sizes="[20, 50, 100]"
        :total="total"
        @current-change="onPageChange"
        @size-change="onSizeChange"
      />
    </el-card>
  </div>
</template>

<script>
import questionnaireApi from '@/api/questionnaire'
import { QUESTION_TYPES } from '@/components/questionnaire/utils'
import { formatAnswerValue, parseUploadFiles } from '@/utils/answerFormat'
import { formatDateTime } from '@/utils/formatDateTime'
import { WRITE_LEVEL } from '@/store/modules/app'

export default {
  name: 'QuestionnaireAnswers',
  props: {
    questionnaireId: { type: String, required: true }
  },
  data() {
    return {
      loading: false,
      title: '',
      anonymous: true,
      questions: [],
      list: [],
      total: -1,
      page: 1,
      size: 50,
      uploadType: QUESTION_TYPES.UPLOAD,
      writeLevel: WRITE_LEVEL,
      selectedRows: [],
      deleting: false
    }
  },
  computed: {
    canEdit() {
      return this.$store.getters['app/canEdit']
    },
    pageTitle() {
      return this.title
        ? `答卷数据 · ${this.title}`
        : `答卷数据 · ${this.questionnaireId}`
    }
  },
  created() {
    this.fetchAll()
  },
  methods: {
    formatDateTime,
    formatAnswer(raw, question) {
      return formatAnswerValue(raw, question)
    },
    getUploadFiles(raw) {
      return parseUploadFiles(raw)
    },
    getUploadPreviewUrls(raw) {
      return parseUploadFiles(raw).map((f) => f.url)
    },
    goBack() {
      this.$router.push({ name: 'home' })
    },
    async fetchAll() {
      this.loading = true
      try {
        const detail = await questionnaireApi.detail(this.questionnaireId)
        this.title = (detail && detail.title) || ''
        this.anonymous = !!(detail && detail.anonymous)
        this.questions = (detail && detail.questions) || []
        await this.fetchAnswers()
      } catch {
        // 错误已在 axios 拦截器统一提示
      } finally {
        this.loading = false
      }
    },
    async fetchAnswers() {
      try {
        const res = await questionnaireApi.listAnswers(this.questionnaireId, {
          page: this.page,
          size: this.size
        })
        this.list = (res && res.list) || []
        this.total = res && res.total != null ? Number(res.total) : 0
        if (res && res.page) this.page = Number(res.page)
        if (res && res.size) this.size = Number(res.size)
      } catch {
        this.list = []
        this.total = 0
      }
    },
    async onPageChange(page) {
      this.page = page
      this.loading = true
      try {
        await this.fetchAnswers()
      } finally {
        this.loading = false
      }
    },
    async onSizeChange(size) {
      this.size = size
      this.page = 1
      this.loading = true
      try {
        await this.fetchAnswers()
      } finally {
        this.loading = false
      }
    },
    onSelectionChange(rows) {
      this.selectedRows = rows || []
    },
    clearSelection() {
      this.selectedRows = []
      const ref = this.$refs.answersTable
      if (ref && ref.clearSelection) ref.clearSelection()
    },
    confirmDelete(count) {
      return this.$confirm(`确认删除选中的 ${count} 条答卷？删除后不可恢复。`, '提示', {
        type: 'warning'
      })
    },
    async onDeleteOne(row) {
      if (!this.canEdit) {
        this.$message.warning(`权限不足：需要 level ≥ ${this.writeLevel} 的账号`)
        return
      }
      try {
        await this.confirmDelete(1)
      } catch {
        return
      }
      this.deleting = true
      try {
        await questionnaireApi.deleteAnswers(this.questionnaireId, [row.answerId])
        this.$message.success('删除成功')
        this.clearSelection()
        await this.fetchAnswers()
      } catch {
        // 错误已在 axios 拦截器统一提示
      } finally {
        this.deleting = false
      }
    },
    async onBatchDelete() {
      if (!this.canEdit) {
        this.$message.warning(`权限不足：需要 level ≥ ${this.writeLevel} 的账号`)
        return
      }
      const ids = this.selectedRows.map((r) => r.answerId).filter(Boolean)
      if (!ids.length) return
      try {
        await this.confirmDelete(ids.length)
      } catch {
        return
      }
      this.deleting = true
      try {
        await questionnaireApi.deleteAnswers(this.questionnaireId, ids)
        this.$message.success('删除成功')
        this.clearSelection()
        if (this.list.length <= ids.length && this.page > 1) {
          this.page -= 1
        }
        await this.fetchAnswers()
      } catch {
        // 错误已在 axios 拦截器统一提示
      } finally {
        this.deleting = false
      }
    }
  }
}
</script>

<style scoped>
.q-answers {
  max-width: 960px;
  margin: 0 auto;
}

.q-answers__header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.q-answers__title {
  flex: 1;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.q-answers__meta {
  font-size: 13px;
  color: #909399;
}

.q-answers__pager {
  margin-top: 16px;
  text-align: right;
}

.q-answers__expand {
  padding: 8px 16px;
}

.q-answers__row {
  display: flex;
  gap: 12px;
  padding: 6px 0;
  font-size: 13px;
  line-height: 1.5;
}

.q-answers__label {
  flex: 0 0 160px;
  color: #909399;
}

.q-answers__value {
  flex: 1;
  color: #303133;
  word-break: break-all;
}

.q-answers__empty {
  color: #c0c4cc;
}

.q-answers__uploads {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.q-answers__upload-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
}

.q-answers__thumb {
  width: 80px;
  height: 80px;
  border-radius: 4px;
  border: 1px solid #ebeef5;
  cursor: pointer;
}

.q-answers__fname {
  font-size: 12px;
  color: #409eff;
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.q-answers__danger {
  color: #f56c6c;
}
</style>
