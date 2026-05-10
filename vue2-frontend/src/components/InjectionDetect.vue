<template>
    <div class="page">
      <h2>提示注入风险检测</h2>
      <input v-model="testText" placeholder="输入测试内容" />
      <button @click="detect">检测</button>
      <p>风险等级：{{level}}</p>
    </div>
  </template>
  
  <script>
  import axios from 'axios'
  export default {
    data(){return{testText:'',level:'无'}},
    methods:{async detect(){
      let r=await axios.post('/api/ai-challenge/check-injection',{input:this.testText})
      this.level=['无','低','中','高'][r.data.riskLevel]
    }}
  }
  </script>