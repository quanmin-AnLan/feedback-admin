import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    appName: 'Feedback Admin'
  },
  getters: {},
  mutations: {
    SET_APP_NAME(state, name) {
      state.appName = name
    }
  },
  actions: {},
  modules: {}
})
