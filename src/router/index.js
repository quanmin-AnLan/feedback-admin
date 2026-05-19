import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/questionnaire/config',
    name: 'questionnaire-create',
    component: () => import('../views/QuestionnaireConfig.vue')
  },
  {
    path: '/questionnaire/config/:questionnaireId',
    name: 'questionnaire-edit',
    component: () => import('../views/QuestionnaireConfig.vue'),
    props: true
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

export default router
