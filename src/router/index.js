import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import store from '@/store'
import apiMonitor from '@/api/monitor'

Vue.use(VueRouter)

/** 项目名作为 spm 中段，与 game-center 风格保持一致 */
const SPM_PROJECT = 'feedback-admin'

/** 判断 path 末段是否是 id（应从 spm 中剥离，避免 spm 爆炸） */
function isIdSegment(seg) {
  if (!seg) return false
  if (/^\d+$/.test(seg) && seg !== '404') return true
  if (/^(wj|ans)_/i.test(seg)) return true
  if (/^[0-9a-f]{8}-[0-9a-f-]+$/i.test(seg)) return true
  return false
}

function pathToSpmC(path) {
  if (!path || path === '/') return 'home'
  const segs = path.split('/').filter(Boolean)
  if (segs.length && isIdSegment(segs[segs.length - 1])) segs.pop()
  return segs.join('-') || 'home'
}

function pad2(n) {
  return n < 10 ? `0${n}` : String(n)
}

function reportRouteEnter(to) {
  try {
    const now = new Date()
    const setDate = `${now.getFullYear()}/${pad2(now.getMonth() + 1)}/${pad2(now.getDate())}`
    const spm = `smpc.${SPM_PROJECT}.${pathToSpmC(to.path)}`
    apiMonitor.reportPV({ setDate, spm })
  } catch {
    /* 上报失败静默：不影响业务 */
  }
}

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
    path: '/questionnaire/:questionnaireId/answers',
    name: 'questionnaire-answers',
    component: () => import('../views/QuestionnaireAnswers.vue'),
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: '/questionnaire/:questionnaireId/statistics',
    name: 'questionnaire-statistics',
    component: () => import('../views/QuestionnaireStatistics.vue'),
    props: true,
    meta: { requiresAuth: true }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: import.meta.env.BASE_URL,
  routes
})

// 守卫：登录态校验 + PV 上报
router.beforeEach((to, from, next) => {
  // 1. PV 上报：每次路由进入都打一次（含登录页 / 空状态页都计入）
  reportRouteEnter(to)

  // 2. 需要登录的路由若无 uuid 则停留并弹登录窗
  const uuid = store?.state?.app?.userInfo?.uuid
  if (to.meta && to.meta.requiresAuth && !uuid) {
    store.dispatch('app/UpdateLoginVisible', true)
    if (from.name) {
      next(false)
      return
    }
  }
  next()
})

export default router
