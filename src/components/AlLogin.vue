<template>
  <el-dialog
    :visible="$store.state.app.loginVisible"
    :title="typeMap[type]"
    :close-on-click-modal="false"
    width="420px"
    @close="handleCancel"
  >
    <div v-for="item in visibleFields" :key="item.prop" class="al-login__row">
      <div class="al-login__label">
        <span v-if="item.required" class="al-login__req">*</span>
        {{ item.name }}
      </div>
      <el-input
        v-model.trim="item.value"
        :placeholder="item.placeholder"
        :show-password="!!item.password"
        :class="['al-login__input', item.prop, { 'is-wrong': wrongMap[item.prop] }]"
        clearable
        @input="onInput(item.prop)"
      />
    </div>

    <span slot="footer">
      <el-button @click="handleCancel">取 消</el-button>
      <template v-if="type === 'login'">
        <el-button type="primary" :loading="submitting" @click="login">登 录</el-button>
        <el-button type="text" @click="type = 'register'">还没账号？去注册</el-button>
      </template>
      <template v-else>
        <el-button type="primary" :loading="submitting" @click="register">注 册</el-button>
        <el-button type="text" @click="type = 'login'">返回登录</el-button>
      </template>
    </span>
  </el-dialog>
</template>

<script>
import apiUser from '@/api/user'

const buildConfig = () => [
  {
    name: '用户名',
    prop: 'user',
    placeholder: '请输入用户名',
    required: true,
    scene: ['login', 'register'],
    submit: true,
    value: ''
  },
  {
    name: '密码',
    prop: 'password',
    placeholder: '请输入密码',
    required: true,
    password: true,
    scene: ['login', 'register'],
    submit: true,
    value: ''
  },
  {
    name: '二次确认',
    prop: 'repeatPwd',
    placeholder: '请再次输入密码',
    required: true,
    password: true,
    scene: ['register'],
    submit: false,
    value: ''
  }
]

export default {
  name: 'AlLogin',
  data() {
    return {
      type: 'login',
      config: buildConfig(),
      wrongMap: {},
      submitting: false,
      typeMap: { login: '登录', register: '注册' }
    }
  },
  computed: {
    visibleFields() {
      return this.config.filter((item) => item.scene.includes(this.type))
    }
  },
  methods: {
    onInput(prop) {
      if (this.wrongMap[prop]) this.$set(this.wrongMap, prop, false)
    },
    checkData() {
      let ok = true
      this.wrongMap = {}
      for (const item of this.visibleFields) {
        if (item.required && !item.value) {
          ok = false
          this.$set(this.wrongMap, item.prop, true)
          this.$message.warning(`${item.placeholder}！`)
          break
        }
      }
      if (ok && this.type === 'register') {
        const pwd = this.config.find((i) => i.prop === 'password').value
        const repeat = this.config.find((i) => i.prop === 'repeatPwd').value
        if (pwd !== repeat) {
          this.$message.error('两次输入密码不一致！')
          ok = false
        }
      }
      return ok
    },
    collectParams() {
      const params = {}
      for (const item of this.visibleFields) {
        if (item.submit) params[item.prop] = item.value
      }
      return params
    },
    async login() {
      if (!this.checkData()) return
      this.submitting = true
      try {
        const res = await apiUser.login(this.collectParams())
        if (res && res.uuid) {
          const userInfo = { ...res, level: Number(res.level) }
          this.$store.dispatch('app/UpdateUserInfo', userInfo)
          this.$message.success('登录成功')
          this.handleCancel()
        }
      } catch {
        // 错误已在 axios 拦截器统一提示
      } finally {
        this.submitting = false
      }
    },
    async register() {
      if (!this.checkData()) return
      this.submitting = true
      try {
        await apiUser.register(this.collectParams())
        this.$message.success('注册成功，请登录')
        this.type = 'login'
        this.config = buildConfig()
      } catch {
        /* ignore */
      } finally {
        this.submitting = false
      }
    },
    handleCancel() {
      this.type = 'login'
      this.config = buildConfig()
      this.wrongMap = {}
      this.$store.dispatch('app/UpdateLoginVisible', false)
    }
  }
}
</script>

<style scoped>
.al-login__row {
  margin-bottom: 16px;
}
.al-login__label {
  line-height: 32px;
  font-size: 14px;
  color: #606266;
}
.al-login__req {
  color: #f56c6c;
  margin-right: 4px;
}
.al-login__input >>> .is-wrong .el-input__inner,
.al-login__input.is-wrong >>> .el-input__inner {
  border-color: #f56c6c;
}
</style>
