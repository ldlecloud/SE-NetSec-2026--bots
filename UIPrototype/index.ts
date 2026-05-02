import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '../layouts/MainLayout.vue'

const routes = [
  {
    path: '/',
    component: MainLayout,
    redirect: '/ai-lab',
    children: [
      {
        path: 'ai-lab',
        name: 'AiLab',
        component: () => import('../views/AiLab.vue')
      },
      {
        path: 'code-compare',
        name: 'CodeCompare',
        component: () => import('../views/CodeCompare.vue')
      },
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('../views/Dashboard.vue')
      },
      {
        path: 'vulnerability-scan',
        name: 'VulnerabilityScan',
        component: () => import('../views/VulnerabilityScan.vue')
      },
      {
        path: 'alerts',
        name: 'Alerts',
        component: () => import('../views/Alerts.vue')
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('../views/Settings.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router