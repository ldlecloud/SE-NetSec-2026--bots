<template>
  <div class="page">
    <h2>AI提示注入挑战</h2>
    <div class="chat-box">
      <div v-for="(msg,i) in list" :key="i" :class="msg.user?'me':'ai'">
        {{msg.content}}
      </div>
    </div>
    <div class="input-bar">
      <input v-model="text" @keyup.enter="send" placeholder="输入..." />
      <button @click="send">发送</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      userId: localStorage.userId || (localStorage.userId='user_'+Math.random().toString(36).slice(2)),
      text:'',
      list:[{content:'你好！我是AI助手',ai:true}]
    }
  },
  methods:{
    async send(){
      if(!this.text)return
      this.list.push({content:this.text,user:true})
      let res = await axios.post('/api/ai-challenge/request',{
        userId:this.userId, input:this.text
      })
      this.list.push({content:res.data.aiResponse,ai:true})
      this.text=''
    }
  }
}
</script>

<style scoped>
.page{padding:20px;max-width:800px;margin:0 auto;}
.chat-box{margin:20px 0;display:flex;flex-direction:column;gap:10px;}
.me{align-self:flex-end;background:#3498db;color:white;padding:10px 14px;border-radius:12px;}
.ai{align-self:flex-start;background:#eee;padding:10px 14px;border-radius:12px;}
.input-bar{display:flex;gap:10px;}
input{flex:1;padding:10px;border:1px solid #ddd;border-radius:8px;}
button{padding:10px 16px;background:#3498db;color:white;border:none;border-radius:8px;}
</style>