<template>
    <div class="min-h-screen bg-[#0f172a] text-gray-100 flex">
      <!-- 左侧侧边栏 -->
      <aside class="w-64 bg-[#1e293b] border-r border-gray-700 flex flex-col">
        <div class="p-4 border-b border-gray-700">
          <h1 class="text-xl font-bold text-purple-400">AI Security v2.0</h1>
          <p class="text-xs text-gray-400">2026-04-21 系统就绪</p>
        </div>
        <nav class="flex-1 p-2">
          <router-link 
            v-for="item in menuItems" 
            :key="item.path" 
            :to="item.path"
            class="flex items-center gap-3 px-4 py-3 rounded-lg mb-1 hover:bg-purple-900/30 transition-colors"
            :class="{ 'bg-purple-600 text-white': $route.path === item.path }"
          >
            <span>{{ item.icon }}</span>
            <span>{{ item.name }}</span>
          </router-link>
        </nav>
      </aside>
  
      <!-- 主内容区 -->
      <main class="flex-1 flex flex-col">
        <header class="h-16 bg-[#1e293b] border-b border-gray-700 flex items-center justify-between px-6">
          <slot name="header"></slot>
          <div class="flex items-center gap-4">
            <span class="text-yellow-400">⭐ 我的积分: {{ userScore }}</span>
          </div>
        </header>
        <div class="flex-1 p-6 overflow-auto">
          <router-view />
        </div>
      </main>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  
  const userScore = ref(1250)
  
  const menuItems = [
    { path: '/dashboard', name: '态势感知首页', icon: '📊' },
    { path: '/ai-lab', name: '注入挑战实验室', icon: '💉' },
    { path: '/vulnerability-scan', name: '漏洞监测评估', icon: '🔍' },
    { path: '/alerts', name: '告警响应中心', icon: '🚨' },
    { path: '/settings', name: '系统配置管理', icon: '⚙️' }
  ]
  </script>