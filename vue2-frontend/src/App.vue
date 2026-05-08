<template>
    <div id="app">
      <!-- 路由出口：页面会在这里渲染 -->
      <router-view />
    </div>
  </template>
  
  <script>
  export default {
    name: "App"
  };
  </script>
  
  <style>
  /* 全局基础样式（可选，保证页面铺满） */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  #app {
    width: 100%;
    min-height: 100vh;
  }
  </style>