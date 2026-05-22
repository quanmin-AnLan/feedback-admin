<template>
  <div class="group-req-panel">
    <div class="group-req-panel__head">
      <span class="group-req-panel__title">组合必填</span>
      <span class="group-req-panel__hint">同一组内多题至少填写指定数量即通过</span>
      <el-button
        type="text"
        icon="el-icon-plus"
        :disabled="!canEdit || questionOptions.length < 2"
        @click="addGroup"
      >
        添加组合
      </el-button>
    </div>

    <el-empty
      v-if="!inner.length"
      description="暂无组合必填，可添加「多题至少填一项」等规则"
      :image-size="64"
    />

    <div v-for="(group, idx) in inner" :key="group.id" class="group-req-panel__item">
      <div class="group-req-panel__item-head">
        <span>组合 {{ idx + 1 }}</span>
        <el-button type="text" class="group-req-panel__del" @click="removeGroup(idx)">
          删除
        </el-button>
      </div>
      <div class="group-req-panel__row">
        <span class="group-req-panel__label">包含题目</span>
        <el-select
          :value="group.questionIds"
          multiple
          collapse-tags
          placeholder="请选择 2 道及以上题目"
          size="small"
          class="group-req-panel__select"
          :disabled="!canEdit"
          @change="(val) => updateGroup(idx, 'questionIds', val)"
        >
          <el-option
            v-for="opt in questionOptions"
            :key="opt.id"
            :label="opt.label"
            :value="opt.id"
          />
        </el-select>
      </div>
      <div class="group-req-panel__row">
        <span class="group-req-panel__label">至少填写</span>
        <el-input-number
          :value="group.minFill"
          :min="1"
          :max="Math.max(1, (group.questionIds || []).length)"
          size="small"
          controls-position="right"
          :disabled="!canEdit"
          @change="(val) => updateGroup(idx, 'minFill', val)"
        />
        <span class="group-req-panel__unit">项</span>
      </div>
      <div class="group-req-panel__row">
        <span class="group-req-panel__label">提示文案</span>
        <el-input
          :value="group.message"
          size="small"
          placeholder="留空则自动生成，如：第 1、2、3 题至少填写 1 项"
          class="group-req-panel__input"
          :disabled="!canEdit"
          @input="(val) => updateGroup(idx, 'message', val)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { createGroupRequire } from './groupRequire'

export default {
  name: 'GroupRequirePanel',
  props: {
    value: { type: Array, default: () => [] },
    questions: { type: Array, default: () => [] },
    canEdit: { type: Boolean, default: true },
  },
  computed: {
    inner: {
      get() {
        return Array.isArray(this.value) ? this.value : []
      },
      set(val) {
        this.$emit('input', val)
      },
    },
    questionOptions() {
      return (this.questions || []).map((q, i) => ({
        id: String(q.id),
        label: `第 ${i + 1} 题：${q.title || '未命名'}`,
      }))
    },
  },
  methods: {
    addGroup() {
      this.inner = [...this.inner, createGroupRequire()]
    },
    removeGroup(idx) {
      const next = [...this.inner]
      next.splice(idx, 1)
      this.inner = next
    },
    updateGroup(idx, field, val) {
      const next = [...this.inner]
      const g = { ...next[idx], [field]: val }
      if (field === 'questionIds') {
        const len = Array.isArray(val) ? val.length : 0
        if (g.minFill > len) g.minFill = Math.max(1, len)
      }
      next[idx] = g
      this.inner = next
    },
  },
}
</script>

<style scoped>
.group-req-panel {
  margin-top: 24px;
  padding: 16px;
  background: #fafafa;
  border: 1px dashed #dcdfe6;
  border-radius: 6px;
}

.group-req-panel__head {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px 12px;
  margin-bottom: 12px;
}

.group-req-panel__title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.group-req-panel__hint {
  flex: 1;
  font-size: 12px;
  color: #909399;
}

.group-req-panel__item {
  padding: 12px;
  margin-bottom: 12px;
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 4px;
}

.group-req-panel__item:last-child {
  margin-bottom: 0;
}

.group-req-panel__item-head {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 13px;
  font-weight: 600;
  color: #606266;
}

.group-req-panel__del {
  color: #f56c6c;
}

.group-req-panel__row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.group-req-panel__row:last-child {
  margin-bottom: 0;
}

.group-req-panel__label {
  flex: 0 0 72px;
  font-size: 12px;
  color: #606266;
}

.group-req-panel__select {
  flex: 1;
  max-width: 480px;
}

.group-req-panel__input {
  flex: 1;
  max-width: 480px;
}

.group-req-panel__unit {
  font-size: 12px;
  color: #909399;
}
</style>
