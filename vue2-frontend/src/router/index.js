import Vue from 'vue'
import Router from 'vue-router'

// 已全部修改为 components 目录路径
import AiChallenge from '@/components/AiChallenge'
import VulnerableCode from '@/components/VulnerableCode'
import UserStatus from '@/components/UserStatus'
import InjectionDetect from '@/components/InjectionDetect'

Vue.use(Router)

export default new Router({
  mode: 'history', // 去掉URL中的#号，更美观
  routes: [
    { path: '/', redirect: '/challenge' },
    { path: '/challenge', component: AiChallenge },
    { path: '/vulnerable-code', component: VulnerableCode },
    { path: '/user-status', component: UserStatus },
    { path: '/injection-detect', component: InjectionDetect }
  ]
})