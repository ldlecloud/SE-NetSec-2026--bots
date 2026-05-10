<template>
    <div id="app">
      <nav class="nav">
        <router-link to="/challenge">AI挑战</router-link>
        <router-link to="/vulnerable-code">漏洞代码</router-link>
        <router-link to="/user-status">我的状态</router-link>
        <router-link to="/injection-detect">注入检测</router-link>
      </nav>
      <router-view />
    </div>
  </template>
  
  <style>
  * { margin:0;padding:0;box-sizing:border-box;font-family: "Microsoft Yahei"; }
  .nav {
    background: #2c3e50;
    padding: 16px;
    display: flex;
    gap: 20px;
  }
  .nav a {
    color: white;
    text-decoration: none;
    font-size: 15px;
  }
  .nav a:hover { color: #f1c40f; }
  </style>