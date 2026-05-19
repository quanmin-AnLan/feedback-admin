<template>
  <div class="home">
    <el-card shadow="never">
      <div slot="header" class="home__header">
        <span class="home__title">问卷列表</span>
        <el-button type="warning" icon="el-icon-plus" @click="onCreate">
          新建问卷
        </el-button>
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
        <el-table-column prop="title" label="问卷标题" show-overflow-tooltip />
        <el-table-column label="操作" width="160" align="center">
          <template #default="{ row }">
            <el-button type="text" @click="onEdit(row)">编辑</el-button>
            <el-button type="text" class="home__danger" @click="onDelete(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import questionnaireApi from '@/api/questionnaire'

export default {
  name: 'HomeView',
  data() {
    return {
      loading: false,
      list: []
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
  max-width: 960px;
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

.home__danger {
  color: #f56c6c;
}
</style>
