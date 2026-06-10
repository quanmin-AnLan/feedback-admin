/**
 * 应用级状态：登录态、登录弹窗显隐
 * 设计参考 game-center 项目的 store/modules/app.js
 */
/** 写操作（问卷 CRUD、默认问卷、答卷状态/删除）所需的最低 level */
export const WRITE_LEVEL = 6

const app = {
  namespaced: true,
  state: {
    loginVisible: false,
    userInfo: {}
  },
  getters: {
    isLogin: (state) => !!state.userInfo && !!state.userInfo.uuid,
    userLevel: (state) =>
      state.userInfo && state.userInfo.level != null
        ? Number(state.userInfo.level)
        : 0,
    // 是否具备写权限（新建/编辑/删除问卷、默认问卷、答卷状态更新与删除）
    canEdit: (_state, getters) => getters.userLevel >= WRITE_LEVEL
  },
  mutations: {
    SetLoginVisible: (state, value) => {
      state.loginVisible = value
    },
    SetUserInfo: (state, value) => {
      state.userInfo = value || {}
    }
  },
  actions: {
    UpdateLoginVisible: (ctx, value) => {
      ctx.commit('SetLoginVisible', value)
    },
    UpdateUserInfo: (ctx, value) => {
      ctx.commit('SetUserInfo', value)
    }
  }
}

export default app
