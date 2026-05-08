import Vue from 'vue'
import Router from 'vue-router'
import AiChallenge from '@/components/AiChallenge.vue'

Vue.use(Router)

export default new Router({
  routes: [
    // 默认根路径 → 直接进入 AI 挑战页面
    {
      path: '/',
      name: 'AiChallenge',
      component: AiChallenge
    }
  ]
})