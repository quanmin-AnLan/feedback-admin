<template>
  <div class="home">
    <el-card shadow="never">
      <div slot="header" class="home__header">
        <span class="home__title">问卷列表</span>
        <div class="home__actions">
          <el-tooltip
            :content="`需要 level ≥ ${writeLevel} 的账号`"
            :disabled="canEdit"
            placement="bottom"
          >
            <span>
              <el-button
                :disabled="!canEdit"
                @click="defaultTypesVisible = true"
              >
                默认问卷配置
              </el-button>
            </span>
          </el-tooltip>
          <el-tooltip
            :content="`需要 level ≥ ${writeLevel} 的账号`"
            :disabled="canEdit"
            placement="bottom"
          >
            <span>
              <el-button
                type="warning"
                icon="el-icon-plus"
                :disabled="!canEdit"
                @click="onCreate"
              >
                新建问卷
              </el-button>
            </span>
          </el-tooltip>
        </div>
      </div>

      <div class="home__default-url">
        <span class="home__default-url-label">默认问卷地址：</span>
        <questionnaire-url-link :url="defaultQuestionnaireUrl" />
      </div>

      <el-table
        v-loading="loading"
        :data="list"
        border
        stripe
        empty-text="暂无问卷，点击右上角创建"
      >
        <el-table-column
          prop="questionnaireId"
          label="问卷 ID"
          width="280"
        />
        <el-table-column prop="title" label="问卷标题" min-width="160" show-overflow-tooltip />
        <el-table-column label="独立问卷地址" min-width="300">
          <template #default="{ row }">
            <questionnaire-url-link :url="questionnaireUrl(row.questionnaireId)" />
          </template>
        </el-table-column>
        <el-table-column
          prop="answerCount"
          label="作答人数"
          width="100"
          align="center"
        />
        <el-table-column label="操作" width="320" align="center">
          <template #default="{ row }">
            <div class="home__row-actions">
              <el-badge
                :value="row.pendingCount"
                :max="99"
                :hidden="!row.pendingCount"
                class="home__view-badge"
              >
                <el-button type="text" class="home__action-btn" @click="onViewAnswers(row)">
                  查看数据
                </el-button>
              </el-badge>
              <el-button type="text" class="home__action-btn" @click="onViewStatistics(row)">
                查看统计
              </el-button>
              <el-button
                type="text"
                class="home__action-btn"
                :disabled="!canEdit"
                @click="onEdit(row)"
              >
                编辑
              </el-button>
              <el-button
                type="text"
                class="home__action-btn home__danger"
                :disabled="!canEdit"
                @click="onDelete(row)"
              >
                删除
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <default-types-dialog v-model="defaultTypesVisible" :list="list" />
  </div>
</template>

<script>
import DefaultTypesDialog from '@/components/DefaultTypesDialog.vue'
import QuestionnaireUrlLink from '@/components/QuestionnaireUrlLink.vue'
import questionnaireApi from '@/api/questionnaire'
import { WRITE_LEVEL } from '@/store/modules/app'
import {
  getDefaultQuestionnaireEntryUrl,
  getIndependentQuestionnaireUrl
} from '@/utils/questionnaireUrl'

export default {
  name: 'HomeView',
  components: { DefaultTypesDialog, QuestionnaireUrlLink },
  data() {
    return {
      loading: false,
      list: [],
      writeLevel: WRITE_LEVEL,
      defaultTypesVisible: false
    }
  },
  computed: {
    canEdit() {
      return this.$store.getters['app/canEdit']
    },
    defaultQuestionnaireUrl() {
      return getDefaultQuestionnaireEntryUrl()
    }
  },
  created() {
    this.fetchList()
  },
  methods: {
    questionnaireUrl(questionnaireId) {
      return getIndependentQuestionnaireUrl(questionnaireId)
    },
    async fetchList() {
      this.loading = true
      try {
        const res = await questionnaireApi.list()
        this.list = (res && res.list) || []
      } catch {
        // 错误已在 axios 拦截器统一提示
      } finally {
        this.loading = false
      }
    },
    onCreate() {
      this.$router.push({ name: 'questionnaire-create' })
    },
    onViewAnswers(row) {
      this.$router.push({
        name: 'questionnaire-answers',
        params: { questionnaireId: row.questionnaireId }
      })
    },
    onViewStatistics(row) {
      this.$router.push({
        name: 'questionnaire-statistics',
        params: { questionnaireId: row.questionnaireId }
      })
    },
    onEdit(row) {
      this.$router.push({
        name: 'questionnaire-edit',
        params: { questionnaireId: row.questionnaireId }
      })
    },
    onDelete(row) {
      this.$confirm(`确认删除问卷「${row.title}」？`, '提示', {
        type: 'warning'
      })
        .then(async () => {
          try {
            await questionnaireApi.remove(row.questionnaireId)
            this.$message.success('删除成功')
            this.fetchList()
          } catch {
            // 错误已在 axios 拦截器统一提示
          }
        })
        .catch(() => {})
    }
  }
}
</script>

<style scoped>
.home {
  max-width: 1240px;
  margin: 0 auto;
}

.home__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.home__title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.home__actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.home__default-url {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  font-size: 13px;
}

.home__default-url-label {
  flex-shrink: 0;
  color: #606266;
}

.home__danger {
  color: #f56c6c;
}

.home__row-actions {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0 4px;
}

.home__action-btn {
  padding-left: 8px !important;
  padding-right: 8px !important;
}

.home__view-badge {
  display: inline-flex;
  align-items: center;
  line-height: 1;
  overflow: visible;
}

.home__view-badge .home__action-btn {
  padding-right: 4px !important;
}

.home__view-badge ::v-deep .el-badge__content {
  border: none;
  top: 8px;
  right: 8px;
  height: 14px;
  line-height: 14px;
  min-width: 14px;
  padding: 0 3px;
  font-size: 10px;
  transform: translateY(-50%) translateX(100%);
}

/* 操作列角标需露出单元格，避免顶部被裁切 */
.home ::v-deep .el-table__body td:last-child .cell {
  overflow: visible;
}
</style>
