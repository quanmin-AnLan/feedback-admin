<template>
  <div class="about">
    <el-card shadow="hover">
      <div slot="header">
        <span>关于</span>
      </div>
      <p>Vue 2.7 + Element UI + Vue Router + Axios</p>
      <p class="hint">
        可在项目根目录创建 <code>.env.development</code>，设置
        <code>VUE_APP_API_BASE_URL</code> 指向真实后端地址。
      </p>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'AboutView'
}
</script>

<style scoped>
.about {
  max-width: 720px;
}

.hint {
  margin-top: 12px;
  color: #909399;
  font-size: 14px;
}

.hint code {
  padding: 2px 6px;
  background: #f4f4f5;
  border-radius: 4px;
}
</style>
