import http from './http'

/**
 * 用户相关接口（与 anlan-server /user/* 一一对应）
 * 接口契约与 game-center 项目保持一致
 */
export const apiUser = {
  login(params) {
    return http.post('/user/login', params)
  },
  register(params) {
    return http.post('/user/register', params)
  },
  getUserInfo(params) {
    return http.get('/user/getUserInfo', { params })
  },
  editUser(params) {
    return http.post('/user/edit', params)
  }
}

export default apiUser
