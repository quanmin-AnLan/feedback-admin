import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import store from '@/store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { requiresAuth: true }
  },
  {
    path: '/questionnaire/config',
    name: 'questionnaire-create',
    component: () => import('../views/QuestionnaireConfig.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/questionnaire/config/:questionnaireId',
    name: 'questionnaire-edit',
    component: () => import('../views/QuestionnaireConfig.vue'),
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 守卫：需要登录的路由若无 uuid 则停留并弹登录窗
router.beforeEach((to, from, next) => {
  const uuid = store?.state?.app?.userInfo?.uuid
  if (to.meta && to.meta.requiresAuth && !uuid) {
    store.dispatch('app/UpdateLoginVisible', true)
    // 若是从空白页直接进来，仍然 next 到目标路由：App.vue 已渲染登录遮罩
    if (from.name) {
      next(false)
      return
    }
  }
  next()
})

export default router
