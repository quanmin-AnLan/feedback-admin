import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import app from './modules/app'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: { app },
  plugins: [
    createPersistedState({
      key: 'feedback-admin',
      storage: window.localStorage
    })
  ]
})
