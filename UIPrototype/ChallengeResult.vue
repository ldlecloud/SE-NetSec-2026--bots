<template>
    <div class="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div class="bg-[#1e293b] border border-purple-500 rounded-lg p-8 max-w-md w-full text-center animate-bounce-in">
        <div class="text-6xl mb-4">🎉</div>
        <h2 class="text-2xl font-bold text-green-400 mb-2">挑战成功！</h2>
        <p class="text-gray-300 mb-6">你成功完成了提示注入攻击，获得了以下奖励</p>
        
        <div class="bg-[#0f172a] rounded-lg p-4 mb-6">
          <div class="text-4xl font-bold text-yellow-400 mb-2">+{{ points }} pts</div>
          <p class="text-sm text-gray-400">积分已添加到你的账户</p>
        </div>
  
        <div class="space-y-3">
          <button @click="$emit('close')" class="w-full bg-purple-600 hover:bg-purple-700 py-3 rounded-lg transition-colors font-bold">
            继续挑战
          </button>
          <button @click="goToCodeCompare" class="w-full bg-gray-700 hover:bg-gray-600 py-3 rounded-lg transition-colors">
            查看漏洞代码解析
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useRouter } from 'vue-router'
  
  const props = defineProps<{
    points: number
  }>()
  
  const emit = defineEmits<{
    close: []
  }>()
  
  const router = useRouter()
  
  const goToCodeCompare = () => {
    emit('close')
    router.push('/code-compare')
  }
  </script>
  
  <style scoped>
  @keyframes bounce-in {
    0% { transform: scale(0.5); opacity: 0; }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); opacity: 1; }
  }
  .animate-bounce-in {
    animation: bounce-in 0.3s ease-out;
  }
  </style>