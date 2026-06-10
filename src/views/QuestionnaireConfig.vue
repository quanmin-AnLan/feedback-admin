<template>
  <div class="q-config">
    <!-- 左侧：新增题目按钮组（fixed 悬浮，始终可见） -->
    <aside class="q-config__sidebar">
      <div class="q-config__sidebar-title">新增题目</div>
      <el-button
        v-for="btn in addButtons"
        :key="btn.type"
        type="warning"
        :disabled="!canEdit"
        class="q-config__add-btn"
        @click="addQuestion(btn.type)"
      >
        <span class="q-config__add-btn-text">+ {{ btn.label }}</span>
      </el-button>
    </aside>

    <!-- 中间：配置卡片 -->
    <section class="q-config__main" v-loading="loading">
      <el-card shadow="never" class="q-config__card">
        <div slot="header" class="q-config__header">
          {{ isEdit ? '编辑问卷' : '配置问卷卡' }}
        </div>

        <div v-if="!canEdit" class="q-config__perm-tip">
          当前账号 level 不足 {{ writeLevel }}，仅可浏览，无法保存
        </div>

        <!-- 问卷基础信息 -->
        <el-form label-position="top" class="q-config__form">
          <el-form-item label="问卷标题">
            <el-input
              v-model="form.title"
              placeholder="你觉得西瓜和橘子哪个比较好吃?"
            />
          </el-form-item>
          <el-form-item label="问卷说明（选填）">
            <el-input
              v-model="form.description"
              type="textarea"
              :rows="2"
              placeholder="你觉得西瓜和橘子哪个好吃? 是不是个人喜好的问题?"
            />
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="form.anonymous">匿名问卷</el-checkbox>
          </el-form-item>
        </el-form>

        <!-- 题目列表（可拖拽排序） -->
        <draggable
          v-model="form.questions"
          handle=".q-item__drag-handle"
          ghost-class="q-config__ghost"
          animation="200"
          class="q-config__questions"
        >
          <component
            :is="componentMap[q.type]"
            v-for="(q, idx) in form.questions"
            :key="q.id"
            :value="q"
            :index="idx"
            :questions="form.questions"
            @input="updateQuestion(idx, $event)"
            @remove="removeQuestion(idx)"
            @option-removed="onOptionRemoved"
          />
        </draggable>
        <el-empty
          v-if="!form.questions.length"
          description="暂无题目，点击左侧按钮添加"
        />

        <group-require-panel
          v-model="form.groupRequires"
          :questions="form.questions"
          :can-edit="canEdit"
        />

        <!-- 提交成功页页面设置 -->
        <div class="q-config__success">
          <div class="q-config__success-title">提交成功页 页面设置</div>
          <el-form label-position="left" label-width="80px">
            <el-form-item label="文本提示">
              <el-radio-group v-model="form.success.textMode">
                <el-radio label="default">默认文本：提交成功，感谢您的参与</el-radio>
                <el-radio label="custom">自定义文本</el-radio>
              </el-radio-group>
              <el-input
                v-if="form.success.textMode === 'custom'"
                v-model="form.success.customText"
                type="textarea"
                :rows="3"
                placeholder="输入文本，不超过 220 字"
                maxlength="220"
                class="q-config__success-input"
              />
            </el-form-item>
            <el-form-item label="跳转链接">
              <el-input
                v-model="form.success.redirectUrl"
                placeholder="请输入跳转地址"
              />
            </el-form-item>
          </el-form>
        </div>

        <!-- 底部操作 -->
        <div class="q-config__actions">
          <el-button @click="handleCancel">取消</el-button>
          <el-tooltip
            :content="`需要 level ≥ ${writeLevel} 的账号`"
            :disabled="canEdit"
            placement="top"
          >
            <span>
              <el-button
                type="warning"
                :loading="submitting"
                :disabled="!canEdit"
                @click="handleSubmit"
              >
                {{ isEdit ? '保存' : '提交' }}
              </el-button>
            </span>
          </el-tooltip>
        </div>
      </el-card>
    </section>

    <el-dialog
      title="问卷创建成功"
      :visible.sync="createSuccessVisible"
      width="520px"
      append-to-body
      :close-on-click-modal="false"
      @closed="onCreateSuccessClosed"
    >
      <p class="q-config__create-tip">问卷已创建，可将以下地址分享给用户填写：</p>
      <el-input
        :value="createdQuestionnaireUrl"
        readonly
        class="q-config__create-url"
      >
        <el-button slot="append" @click="copyQuestionnaireUrl">复制</el-button>
      </el-input>
      <template slot="footer">
        <el-button type="warning" @click="createSuccessVisible = false">
          知道了
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import RadioQuestion from '@/components/questionnaire/RadioQuestion.vue'
import CheckboxQuestion from '@/components/questionnaire/CheckboxQuestion.vue'
import InputQuestion from '@/components/questionnaire/InputQuestion.vue'
import TextareaQuestion from '@/components/questionnaire/TextareaQuestion.vue'
import UploadQuestion from '@/components/questionnaire/UploadQuestion.vue'
import DateQuestion from '@/components/questionnaire/DateQuestion.vue'
import GroupRequirePanel from '@/components/questionnaire/GroupRequirePanel.vue'
import { createQuestion, QUESTION_TYPES } from '@/components/questionnaire/utils'
import {
  normalizeGroupRequires,
  pruneGroupRequiresOnQuestionRemove,
} from '@/components/questionnaire/groupRequire'
import questionnaireApi from '@/api/questionnaire'
import { WRITE_LEVEL } from '@/store/modules/app'

const createEmptyForm = () => ({
  title: '',
  description: '',
  anonymous: false,
  questions: [],
  groupRequires: [],
  success: {
    textMode: 'default',
    customText: '',
    redirectUrl: ''
  }
})

export default {
  name: 'QuestionnaireConfig',
  components: {
    draggable,
    RadioQuestion,
    CheckboxQuestion,
    InputQuestion,
    TextareaQuestion,
    UploadQuestion,
    DateQuestion,
    GroupRequirePanel,
  },
  props: {
    // 由路由 props: true 注入，编辑模式下存在
    questionnaireId: { type: String, default: '' }
  },
  data() {
    return {
      loading: false,
      submitting: false,
      addButtons: [
        { type: QUESTION_TYPES.RADIO, label: '单选题' },
        { type: QUESTION_TYPES.CHECKBOX, label: '多选题' },
        { type: QUESTION_TYPES.INPUT, label: '单行输入' },
        { type: QUESTION_TYPES.TEXTAREA, label: '多行输入' },
        { type: QUESTION_TYPES.UPLOAD, label: '图片上传' },
        { type: QUESTION_TYPES.DATE, label: '日期' }
      ],
      componentMap: {
        [QUESTION_TYPES.RADIO]: 'RadioQuestion',
        [QUESTION_TYPES.CHECKBOX]: 'CheckboxQuestion',
        [QUESTION_TYPES.INPUT]: 'InputQuestion',
        [QUESTION_TYPES.TEXTAREA]: 'TextareaQuestion',
        [QUESTION_TYPES.UPLOAD]: 'UploadQuestion',
        [QUESTION_TYPES.DATE]: 'DateQuestion'
      },
      form: createEmptyForm(),
      createSuccessVisible: false,
      createdQuestionnaireUrl: ''
    }
  },
  computed: {
    isEdit() {
      return !!this.questionnaireId
    },
    canEdit() {
      return this.$store.getters['app/canEdit']
    },
    writeLevel() {
      return WRITE_LEVEL
    }
  },
  created() {
    if (this.isEdit) {
      this.fetchDetail()
    }
  },
  methods: {
    async fetchDetail() {
      this.loading = true
      try {
        const detail = await questionnaireApi.detail(this.questionnaireId)
        // 兼容字段缺失：与空模板合并后再覆盖
        this.form = {
          ...createEmptyForm(),
          ...detail,
          success: {
            ...createEmptyForm().success,
            ...(detail && detail.success ? detail.success : {})
          },
          questions:
            detail && Array.isArray(detail.questions) ? detail.questions : [],
          groupRequires: normalizeGroupRequires(
            detail && detail.groupRequires,
            detail && Array.isArray(detail.questions)
              ? detail.questions.map((q) => q.id)
              : [],
          ),
        }
      } catch {
        // 错误已在 axios 拦截器统一提示
      } finally {
        this.loading = false
      }
    },
    addQuestion(type) {
      this.form.questions.push(createQuestion(type))
    },
    updateQuestion(idx, next) {
      this.$set(this.form.questions, idx, next)
    },
    removeQuestion(idx) {
      this.$confirm('确认删除该题目？', '提示', { type: 'warning' })
        .then(() => {
          const removed = this.form.questions[idx]
          this.form.questions.splice(idx, 1)
          if (!removed) return
          // 关联到被删题目的，重置 relation
          this.form.questions = this.form.questions.map((q) => {
            const dep = q.relation && q.relation.dependOnQuestionId
            if (dep && dep === removed.id) {
              return {
                ...q,
                relation: {
                  enabled: false,
                  dependOnQuestionId: null,
                  showWhenOptionsSelected: []
                }
              }
            }
            return q
          })
          this.form.groupRequires = pruneGroupRequiresOnQuestionRemove(
            this.form.groupRequires,
            removed.id,
          )
        })
        .catch(() => {})
    },
    onOptionRemoved(removedValue) {
      // 子题删除了某个选项后，清理其他题对该选项 value 的关联引用
      this.form.questions = this.form.questions.map((q) => {
        const sel =
          q.relation && Array.isArray(q.relation.showWhenOptionsSelected)
            ? q.relation.showWhenOptionsSelected
            : null
        if (!sel || !sel.includes(removedValue)) return q
        return {
          ...q,
          relation: {
            ...q.relation,
            showWhenOptionsSelected: sel.filter((v) => v !== removedValue)
          }
        }
      })
    },
    onCreateSuccessClosed() {
      this.createdQuestionnaireUrl = ''
      if (this.$route.name !== 'home') {
        this.$router.push({ name: 'home' })
      }
    },
    async copyQuestionnaireUrl() {
      const text = this.createdQuestionnaireUrl
      if (!text) return
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(text)
        } else {
          const input = document.createElement('textarea')
          input.value = text
          input.style.position = 'fixed'
          input.style.opacity = '0'
          document.body.appendChild(input)
          input.select()
          document.execCommand('copy')
          document.body.removeChild(input)
        }
        this.$message.success('已复制到剪贴板')
      } catch {
        this.$message.error('复制失败，请手动复制')
      }
    },
    handleCancel() {
      this.$confirm('确认放弃当前配置？', '提示', { type: 'warning' })
        .then(() => {
          this.$router.push({ name: 'home' })
        })
        .catch(() => {})
    },
    async handleSubmit() {
      if (!this.canEdit) {
        this.$message.warning(`权限不足：需要 level ≥ ${this.writeLevel} 的账号`)
        return
      }
      if (!this.form.title.trim()) {
        this.$message.warning('请填写问卷标题')
        return
      }
      if (!this.form.questions.length) {
        this.$message.warning('请至少添加一道题目')
        return
      }
      this.submitting = true
      try {
        const payload = JSON.parse(JSON.stringify(this.form))
        payload.groupRequires = normalizeGroupRequires(
          payload.groupRequires,
          payload.questions.map((q) => q.id),
        )
        if (this.isEdit) {
          await questionnaireApi.update(this.questionnaireId, payload)
          this.$message.success('问卷已更新')
          this.$router.push({ name: 'home' })
        } else {
          const res = await questionnaireApi.create(payload)
          const id = res && res.questionnaireId
          this.createdQuestionnaireUrl =
            (res && res.url) ||
            (id ? `http://farm.anlan.xyz/feedback/${id}` : '')
          if (!this.createdQuestionnaireUrl) {
            this.$message.warning('问卷已创建，但未获取到问卷地址')
            this.$router.push({ name: 'home' })
            return
          }
          this.createSuccessVisible = true
        }
      } catch {
        // 错误已在 axios 拦截器统一提示
      } finally {
        this.submitting = false
      }
    }
  }
}
</script>

<style scoped>
.q-config {
  position: relative;
  /* 给左侧 fixed 侧边栏让出空间：宽度 140 + gap 20 */
  padding-left: 160px;
}

/* 侧边栏使用 fixed，相对视口始终悬浮可见 */
.q-config__sidebar {
  position: fixed;
  /* 60 = el-header 默认高度，20 = el-main 默认 padding */
  top: 80px;
  left: 20px;
  width: 140px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 10;
}

.q-config__sidebar-title {
  font-size: 13px;
  color: #909399;
  margin-bottom: 4px;
}

/* 让 4 个按钮等宽、文本左对齐 + 起始位置一致，并消除 Element 默认的连续按钮 margin-left */
.q-config__add-btn {
  width: 100%;
  margin: 0;
  padding: 10px 16px;
  background: #ffd026;
  border-color: #ffd026;
  color: #303133;
  text-align: left;
  display: block;
}

.q-config__add-btn + .q-config__add-btn {
  margin-left: 0;
}

.q-config__add-btn:hover,
.q-config__add-btn:focus {
  background: #ffc107;
  border-color: #ffc107;
  color: #303133;
}

.q-config__add-btn-text {
  display: inline-block;
  width: 100%;
  text-align: left;
}

.q-config__main {
  min-width: 0;
}

.q-config__card {
  background: #f5f7fa;
}

.q-config__header {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.q-config__perm-tip {
  margin: 12px 0 16px;
  padding: 10px 14px;
  background: #fdf6ec;
  border-left: 4px solid #e6a23c;
  color: #b88230;
  font-size: 13px;
  border-radius: 4px;
}

.q-config__form {
  background: #fff;
  padding: 16px;
  border-radius: 6px;
  margin-bottom: 16px;
}

.q-config__questions {
  margin-bottom: 16px;
}

.q-config__ghost {
  opacity: 0.5;
  background: #fff5cc;
  border: 1px dashed #ffd026 !important;
}

.q-config__success {
  background: #fff;
  padding: 16px;
  border-radius: 6px;
  margin-bottom: 16px;
}

.q-config__success-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #303133;
}

.q-config__success-input {
  margin-top: 8px;
}

.q-config__actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  padding: 16px 0;
}

.q-config__create-tip {
  margin: 0 0 12px;
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
}

.q-config__create-url {
  width: 100%;
}

/* 小屏兼容：屏幕较窄时把侧边栏从 fixed 还原到顶部静态布局 */
@media (max-width: 768px) {
  .q-config {
    padding-left: 0;
  }
  .q-config__sidebar {
    position: static;
    width: 100%;
    flex-direction: row;
    flex-wrap: wrap;
    margin-bottom: 16px;
  }
  .q-config__add-btn {
    width: auto;
    flex: 1 1 auto;
  }
}
</style>
