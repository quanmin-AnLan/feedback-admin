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
        </el-menu>
        <div class="user-area">
          <el-dropdown
            v-if="userInfo.uuid"
            placement="bottom"
            @command="onDropdown"
          >
            <span class="user-area__text">
              {{ userInfo.user }}
              <i class="el-icon-arrow-down el-icon--right" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-button v-else type="text" @click="openLogin">登录</el-button>
        </div>
      </el-header>
      <el-main>
        <template v-if="userInfo.uuid">
          <router-view />
        </template>
        <el-empty v-else description="请先登录后使用问卷管理后台">
          <el-button type="warning" @click="openLogin">立即登录</el-button>
        </el-empty>
      </el-main>
    </el-container>
    <al-login />
  </div>
</template>

<script>
import AlLogin from '@/components/AlLogin.vue'
import apiUser from '@/api/user'

export default {
  name: 'App',
  components: { AlLogin },
  computed: {
    userInfo() {
      return this.$store.state.app.userInfo || {}
    },
    activeMenu() {
      if (this.$route.path.startsWith('/questionnaire')) return '/'
      return this.$route.path
    }
  },
  mounted() {
    this.refreshUserInfo()
  },
  methods: {
    openLogin() {
      this.$store.dispatch('app/UpdateLoginVisible', true)
    },
    async refreshUserInfo() {
      const uuid = this.userInfo.uuid
      if (!uuid) return
      try {
        const res = await apiUser.getUserInfo({ id: uuid, type: 'uuid' })
        if (res && res.uuid) {
          this.$store.dispatch('app/UpdateUserInfo', {
            ...res,
            level: Number(res.level)
          })
        }
      } catch {
        /* 拦截器已弹错误提示；uuid 失效会清空登录态 */
      }
    },
    onDropdown(command) {
      if (command === 'logout') {
        this.$store.dispatch('app/UpdateUserInfo', {})
        this.$message.success('已退出登录')
        if (this.$route.path !== '/') {
          this.$router.push({ name: 'home' })
        }
      }
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

.user-area {
  margin-left: auto;
}

.user-area__text {
  cursor: pointer;
  color: #303133;
  font-size: 14px;
}
</style>
