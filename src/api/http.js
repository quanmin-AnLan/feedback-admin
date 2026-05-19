import axios from 'axios'
import { Message } from 'element-ui'

/**
 * 全局 axios 实例
 * - 统一 baseURL / 超时
 * - 请求拦截器：注入鉴权 token、统一请求头
 * - 响应拦截器：剥离 data 外壳、统一错误提示
 *
 * 接入真实后端时只需调整 baseURL 与 token 取值方式即可。
 */
const http = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL || '/api',
  timeout: 15000
})

// ===== 请求拦截器 =====
http.interceptors.request.use(
  (config) => {
    // 鉴权 token 注入（按需替换为 store / localStorage 等取值）
    const token =
      (typeof localStorage !== 'undefined' && localStorage.getItem('token')) ||
      ''
    if (token) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ===== 响应拦截器 =====
http.interceptors.response.use(
  (response) => {
    // 约定后端返回 { code, message, data } 结构；兼容直接返回 data 的情况
    const payload = response.data
    if (payload && typeof payload === 'object' && 'code' in payload) {
      if (payload.code === 0 || payload.code === 200) {
        return payload.data
      }
      const msg = payload.message || '请求失败'
      Message.error(msg)
      return Promise.reject(new Error(msg))
    }
    return payload
  },
  (error) => {
    const msg =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      '网络异常，请稍后重试'
    Message.error(msg)
    return Promise.reject(error)
  }
)

export default http
