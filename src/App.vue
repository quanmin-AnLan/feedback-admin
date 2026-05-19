<template>
  <div id="app">
    <el-container class="layout">
      <el-header class="header">
        <span class="title">Feedback Admin</span>
        <el-menu
          :default-active="activeMenu"
          mode="horizontal"
          router
          class="header-menu"
        >
          <el-menu-item index="/">首页</el-menu-item>
          <el-menu-item index="/about">关于</el-menu-item>
        </el-menu>
      </el-header>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'App',
  computed: {
    activeMenu() {
      // 配置问卷页（含编辑）仍归属"首页"高亮
      if (this.$route.path.startsWith('/questionnaire')) return '/'
      return this.$route.path
    }
  }
}
</script>

<style>
#app {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Microsoft YaHei',
    Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #303133;
  min-height: 100vh;
}

.layout {
  min-height: 100vh;
}

.header {
  display: flex;
  align-items: center;
  gap: 24px;
  border-bottom: solid 1px #e6e6e6;
}

.title {
  font-size: 18px;
  font-weight: 600;
}

.header-menu {
  flex: 1;
  border-bottom: none !important;
}
</style>
