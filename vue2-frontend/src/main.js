// src/main.js 【无错终极版】
import Vue from 'vue'
import App from './App.vue'

// 1. 直接在这里注册路由（彻底避免引入失败）
import VueRouter from 'vue-router'
Vue.use(VueRouter) // 必须加这行！！！修复 <router-view> 报错

// 2. 引入路由实例
import router from './router'

// 3. 引入axios
import axios from 'axios'
Vue.prototype.$axios = axios

Vue.config.productionTip = false

new Vue({
  router, // 挂载路由
  render: h => h(App)
}).$mount('#app')