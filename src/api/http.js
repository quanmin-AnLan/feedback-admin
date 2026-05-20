import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'

/**
 * 全局 axios 实例
 * - 设计参考 game-center 项目的 services/index.js
 * - 鉴权：从 store.state.app.userInfo.uuid 读 uuid 注入到请求头
 * - 响应：约定后端返回 { code, success, data, msg }
 *     code === 200 才视为成功；剥离 data 外壳返回业务侧
 */
const http = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL || 'http://api.anlan.xyz',
  timeout: 15000
})

http.interceptors.request.use(
  (config) => {
    const uuid = store?.state?.app?.userInfo?.uuid
    if (uuid) {
      config.headers = config.headers || {}
      config.headers.uuid = uuid
    }
    return config
  },
  (error) => Promise.reject(error)
)

http.interceptors.response.use(
  (response) => {
    const payload = response.data
    const silent = !!(response.config && response.config.silent)
    if (payload && typeof payload === 'object' && 'code' in payload) {
      if (payload.code === 200) {
        return payload.data
      }
      const msg = payload.msg || payload.message || '请求失败'
      // 401 + uuid 失效 → 清空登录态并弹出登录窗
      if (payload.code === 401) {
        store.dispatch('app/UpdateUserInfo', {})
        store.dispatch('app/UpdateLoginVisible', true)
      }
      if (!silent) Message.error(msg)
      return Promise.reject(new Error(msg))
    }
    return payload
  },
  (error) => {
    const data = error.response && error.response.data
    const silent = !!(error.config && error.config.silent)
    const msg =
      (data && (data.msg || data.message)) ||
      error.message ||
      '网络异常，请稍后重试'
    if (!silent) Message.error(msg)
    return Promise.reject(error)
  }
)

export default http
