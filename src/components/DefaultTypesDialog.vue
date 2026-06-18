<template>
  <el-dialog
    title="默认题型配置"
    :visible.sync="visible"
    width="420px"
    append-to-body
    @open="onOpen"
    @closed="onClosed"
  >
    <div v-loading="loading" class="default-types-dialog">
      <p class="default-types-dialog__tip">
        勾选的问卷会出现在
        <a
          :href="defaultQuestionnaireUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="default-types-dialog__link"
        >默认问卷地址</a>
        中，用户打开该页面即可选择填写；未勾选的不会显示。
      </p>
      <el-checkbox-group v-model="selectedTypes" :disabled="!canEdit">
        <el-checkbox
          v-for="opt in list"
          :key="opt.questionnaireId"
          :label="opt.questionnaireId"
          class="default-types-dialog__item"
        >
        {{ opt.title }}
        </el-checkbox>
      </el-checkbox-group>
    </div>
    <template slot="footer">
      <el-button @click="visible = false" class="default-types-dialog__cancel">取消</el-button>
      <el-tooltip
        :content="`需要 level ≥ ${writeLevel} 的账号`"
        :disabled="canEdit"
        placement="top"
      >
        <span>
          <el-button
            type="warning"
            :loading="saving"
            :disabled="!canEdit"
            @click="handleSave"
          >
            保存
          </el-button>
        </span>
      </el-tooltip>
    </template>
  </el-dialog>
</template>

<script>
import questionnaireApi from '@/api/questionnaire'
import { QUESTION_TYPES, questionTypeLabel } from '@/components/questionnaire/utils'
import { WRITE_LEVEL } from '@/store/modules/app'
import { getDefaultQuestionnaireEntryUrl } from '@/utils/questionnaireUrl'

const ALL_TYPES = [
  QUESTION_TYPES.RADIO,
  QUESTION_TYPES.CHECKBOX,
  QUESTION_TYPES.INPUT,
  QUESTION_TYPES.TEXTAREA,
  QUESTION_TYPES.UPLOAD,
  QUESTION_TYPES.DATE
]

export default {
  name: 'DefaultTypesDialog',
  props: {
    value: { type: Boolean, default: false },
    list: { type: Array, default: () => [] }
  },
  data() {
    return {
      loading: false,
      saving: false,
      selectedTypes: [],
      writeLevel: WRITE_LEVEL,
      typeOptions: ALL_TYPES.map((value) => ({
        value,
        label: questionTypeLabel(value)
      }))
    }
  },
  computed: {
    visible: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    },
    canEdit() {
      return this.$store.getters['app/canEdit']
    },
    defaultQuestionnaireUrl() {
      return getDefaultQuestionnaireEntryUrl()
    }
  },
  methods: {
    normalizeTypes(data) {
      if (!Array.isArray(data)) return []
      return data
        .map((item) => (typeof item === 'string' ? item : item?.value))
        .filter(Boolean)
    },
    async onOpen() {
      this.loading = true
      try {
        const data = await questionnaireApi.getDefaultConfig()
        this.selectedTypes = this.normalizeTypes(data)
      } catch {
        this.selectedTypes = []
      } finally {
        this.loading = false
      }
    },
    onClosed() {
      this.selectedTypes = []
      this.loading = false
      this.saving = false
    },
    async handleSave() {
      if (!this.canEdit) {
        this.$message.warning(`权限不足：需要 level ≥ ${this.writeLevel} 的账号`)
        return
      }
      this.saving = true
      try {
        await questionnaireApi.updateDefaultConfig(this.selectedTypes)
        this.$message.success('默认问卷已保存')
        this.visible = false
        this.$emit('saved', [...this.selectedTypes])
      } catch {
        // 错误已在 axios 拦截器统一提示
      } finally {
        this.saving = false
      }
    }
  }
}
</script>

<style scoped>
.default-types-dialog {
  min-height: 120px;
}

.default-types-dialog__tip {
  margin: 0 0 16px;
  padding: 10px 12px;
  font-size: 13px;
  line-height: 1.6;
  color: #606266;
  background: #f4f4f5;
  border-radius: 4px;
}

.default-types-dialog__link {
  color: #409eff;
  text-decoration: none;
}

.default-types-dialog__link:hover {
  text-decoration: underline;
}

.default-types-dialog__item {
  display: block;
  margin: 0 0 12px;
}
.default-types-dialog__cancel {
  margin-right: 30px;
}
</style>
