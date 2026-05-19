import http from './http'

/**
 * 监控/上报相关接口，与 anlan-server /report/* 对应
 * 设计参考 game-center 项目的 ApiCommon
 */
export const apiMonitor = {
  /** GET /report/pv?setDate=YYYY/MM/DD&spm=smpc.xxx.yyy */
  reportPV(params) {
    // 上报失败静默：不影响业务也不弹消息
    return http.get('/report/pv', { params, silent: true })
  }
}

export default apiMonitor
