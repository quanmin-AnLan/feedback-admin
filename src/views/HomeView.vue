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
                默认问卷
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
        <el-table-column
          prop="answerCount"
          label="作答人数"
          width="100"
          align="center"
        />
        <el-table-column label="操作" width="320" align="center">
          <template #default="{ row }">
            <el-button type="text" @click="onViewAnswers(row)">
              查看数据
            </el-button>
            <el-button type="text" @click="onViewStatistics(row)">
              查看统计
            </el-button>
            <el-button
              type="text"
              :disabled="!canEdit"
              @click="onEdit(row)"
            >
              编辑
            </el-button>
            <el-button
              type="text"
              class="home__danger"
              :disabled="!canEdit"
              @click="onDelete(row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <default-types-dialog v-model="defaultTypesVisible" :list="list" />
  </div>
</template>

<script>
import DefaultTypesDialog from '@/components/DefaultTypesDialog.vue'
import questionnaireApi from '@/api/questionnaire'
import { WRITE_LEVEL } from '@/store/modules/app'

export default {
  name: 'HomeView',
  components: { DefaultTypesDialog },
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
    }
  },
  created() {
    this.fetchList()
  },
  methods: {
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

.home__danger {
  color: #f56c6c;
}
</style>
