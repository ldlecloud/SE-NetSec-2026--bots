<template>
    <div class="page">
      <h2>我的挑战状态</h2>
      <p>用户ID：{{userId}}</p>
      <p>分数：{{score}}</p>
      <p>挑战完成：{{done?'是':'否'}}</p>
    </div>
  </template>
  
  <script>
  import axios from 'axios'
  export default {
    data(){return{userId:localStorage.userId,score:0,done:false}},
    async mounted(){
      let s = await axios.get('/api/ai-challenge/score?userId='+this.userId)
      this.score = s.data.score
    }
  }
  </script>