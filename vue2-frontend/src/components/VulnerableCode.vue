<template>
    <div class="page">
      <h2>漏洞代码展示</h2>
      <pre class="code">{{code}}</pre>
    </div>
  </template>
  
  <script>
  export default {
    data(){return{code:`// 存在提示注入漏洞的代码
  app.post('/api/chat',(req,res)=>{
    const input = req.body.input
    const prompt = \`系统指令...\${input}\`
    res.send({response:prompt})
  })`}}
  }
  </script>
  
  <style scoped>
  .page{padding:20px;max-width:900px;margin:0 auto;}
  .code{background:#2c3e50;color:white;padding:20px;border-radius:8px;white-space:pre-wrap;}
  </style>