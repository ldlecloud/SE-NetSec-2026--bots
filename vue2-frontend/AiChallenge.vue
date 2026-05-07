<template>
    <div class="app-container">
      <!-- 顶部导航栏 -->
      <header class="app-header">
        <h1 class="app-title">AI提示注入挑战</h1>
        <div class="header-info">
          <span class="user-id">用户ID: {{ userId }}</span>
          <span class="score">分数: {{ score }}</span>
        </div>
      </header>
  
      <main class="main-content">
        <!-- 左侧状态面板 -->
        <aside class="sidebar">
          <!-- 挑战状态卡片 -->
          <div class="card">
            <h3 class="card-title">挑战状态</h3>
            <div class="card-content">
              <p class="status-item">
                <span class="label">挑战完成:</span>
                <span :class="status.isCompleted ? 'status-done' : 'status-pending'">
                  {{ status.isCompleted ? '是' : '否' }}
                </span>
              </p>
              <p class="status-item">
                <span class="label">完成时间:</span>
                <span>{{ status.completeTime || '--' }}</span>
              </p>
              <p class="status-item">
                <span class="label">进度信息:</span>
                <span>{{ status.progressInfo || '未开始' }}</span>
              </p>
            </div>
          </div>
  
          <!-- 注入风险检测卡片 -->
          <div class="card">
            <h3 class="card-title">注入风险检测</h3>
            <div class="card-content">
              <p class="status-item">
                <span class="label">风险等级:</span>
                <span :class="riskClass">{{ riskText }}</span>
              </p>
              <p class="status-item">
                <span class="label">注入类型:</span>
                <span>{{ riskInfo.type || '--' }}</span>
              </p>
            </div>
          </div>
  
          <!-- 挑战目标卡片 -->
          <div class="card">
            <h3 class="card-title">挑战目标</h3>
            <div class="card-content">
              <p class="challenge-desc">通过提示注入攻击，让AI泄露内部Flag，完成挑战获得100分！</p>
            </div>
          </div>
        </aside>
  
        <!-- 右侧对话区域 -->
        <section class="chat-section">
          <!-- 消息列表 -->
          <div ref="chatContainer" class="chat-container">
            <div 
              v-for="(msg, index) in chatList" 
              :key="index" 
              class="chat-msg"
              :class="msg.isUser ? 'user-msg' : 'ai-msg'"
            >
              <div class="msg-bubble">
                {{ msg.content }}
              </div>
            </div>
          </div>
  
          <!-- 输入框区域 -->
          <div class="input-area">
            <input
              v-model="inputText"
              @keyup.enter="sendMessage"
              type="text"
              placeholder="输入你的提示指令..."
              class="input-box"
            >
            <button
              @click="sendMessage"
              :disabled="loading"
              class="btn btn-primary"
            >
              {{ loading ? '发送中...' : '发送' }}
            </button>
            <button
              @click="resetChat"
              class="btn btn-secondary"
            >
              重置
            </button>
          </div>
        </section>
      </main>
    </div>
  </template>
  
  <script>
  import axios from 'axios'
  
  export default {
    name: 'AiChallenge',
    data() {
      return {
        baseUrl: '/api/ai-challenge',
        userId: 'user_' + Math.random().toString(36).slice(2, 10),
        inputText: '',
        loading: false,
        chatList: [],
        status: {
          isCompleted: false,
          completeTime: '',
          progressInfo: ''
        },
        score: 0,
        riskInfo: {
          level: 0,
          type: ''
        }
      }
    },
    computed: {
      riskText() {
        const map = { 0: '无风险', 1: '低风险', 2: '中风险', 3: '高风险' }
        return map[this.riskInfo.level] || '未知'
      },
      riskClass() {
        const map = { 0: 'risk-safe', 1: 'risk-low', 2: 'risk-medium', 3: 'risk-high' }
        return map[this.riskInfo.level]
      }
    },
    mounted() {
      this.initPage()
    },
    methods: {
      async initPage() {
        this.initChat()
        await this.getChallengeStatus()
        await this.getChallengeScore()
      },
      initChat() {
        this.chatList = [
          { content: '你好！我是Juice Shop的AI助手，我可以帮你查询订单、推荐饮品或解答问题。请问有什么可以帮您？', isUser: false }
        ]
        this.riskInfo = { level: 0, type: '' }
      },
      async sendAiRequest(input) {
        return axios.post(`${this.baseUrl}/request`, {
          userId: this.userId,
          input
        })
      },
      async getChallengeStatus() {
        try {
          const res = await axios.get(`${this.baseUrl}/status?userId=${this.userId}`)
          this.status = res.data
        } catch (err) {
          console.error('获取状态失败', err)
        }
      },
      async awardScore() {
        try {
          const res = await axios.post(`${this.baseUrl}/award-score`, { userId: this.userId })
          if (res.data.success) {
            this.score = res.data.currentScore
          }
        } catch (err) {
          console.error('加分失败', err)
        }
      },
      async getChallengeScore() {
        try {
          const res = await axios.get(`${this.baseUrl}/score?userId=${this.userId}`)
          this.score = res.data.score
        } catch (err) {
          console.error('获取分数失败', err)
        }
      },
      async checkInjection(input) {
        return axios.post(`${this.baseUrl}/check-injection`, { input })
      },
      async sendMessage() {
        const content = this.inputText.trim()
        if (!content || this.loading) return
  
        this.chatList.push({ content, isUser: true })
        this.inputText = ''
        this.scrollToBottom()
        this.loading = true
  
        try {
          const injectRes = await this.checkInjection(content)
          this.riskInfo = {
            level: injectRes.data.riskLevel,
            type: injectRes.data.injectionType
          }
  
          const aiRes = await this.sendAiRequest(content)
          const data = aiRes.data
          this.chatList.push({ content: data.aiResponse, isUser: false })
          this.scrollToBottom()
  
          if (data.isChallengeComplete) {
            this.chatList.push({ content: '🎉 恭喜你完成挑战！正在发放分数...', isUser: false })
            await this.awardScore()
            await this.getChallengeStatus()
          }
        } catch (err) {
          this.chatList.push({ content: '❌ 服务异常，请重试', isUser: false })
          console.error('请求失败', err)
        } finally {
          this.loading = false
          this.scrollToBottom()
        }
      },
      resetChat() {
        this.inputText = ''
        this.initChat()
      },
      scrollToBottom() {
        this.$nextTick(() => {
          const dom = this.$refs.chatContainer
          dom.scrollTop = dom.scrollHeight
        })
      }
    }
  }
  </script>
  
  <style scoped>
  /* 全局重置 */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: "Microsoft Yahei", sans-serif;
  }
  
  .app-container {
    min-height: 100vh;
    background-color: #f5f7fa;
  }
  
  /* 顶部导航 */
  .app-header {
    background-color: #2c3e50;
    color: white;
    padding: 16px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }
  
  .app-title {
    font-size: 22px;
    font-weight: 600;
  }
  
  .header-info {
    display: flex;
    gap: 24px;
    font-size: 14px;
  }
  
  .user-id {
    color: #bdc3c7;
  }
  
  .score {
    color: #f1c40f;
    font-weight: 600;
  }
  
  /* 主体布局 */
  .main-content {
    display: flex;
    padding: 24px;
    gap: 24px;
    max-width: 1400px;
    margin: 0 auto;
  }
  
  /* 左侧边栏 */
  .sidebar {
    width: 280px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  
  .card {
    background: white;
    border-radius: 8px;
    padding: 16px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    border: 1px solid #e8eef2;
  }
  
  .card-title {
    font-size: 16px;
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid #eee;
  }
  
  .card-content {
    font-size: 14px;
    color: #34495e;
  }
  
  .status-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
  }
  
  .label {
    color: #7f8c8d;
  }
  
  .status-done {
    color: #27ae60;
    font-weight: 600;
  }
  
  .status-pending {
    color: #7f8c8d;
  }
  
  .risk-safe { color: #27ae60; }
  .risk-low { color: #f39c12; }
  .risk-medium { color: #e67e22; }
  .risk-high { color: #e74c3c; font-weight: 600; }
  
  .challenge-desc {
    line-height: 1.6;
    color: #7f8c8d;
  }
  
  /* 右侧对话区 */
  .chat-section {
    flex: 1;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    border: 1px solid #e8eef2;
    display: flex;
    flex-direction: column;
    height: calc(100vh - 140px);
  }
  
  .chat-container {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  
  .chat-msg {
    display: flex;
    max-width: 75%;
  }
  
  .user-msg {
    align-self: flex-end;
  }
  
  .ai-msg {
    align-self: flex-start;
  }
  
  .msg-bubble {
    padding: 12px 16px;
    border-radius: 12px;
    line-height: 1.5;
    font-size: 14px;
  }
  
  .user-msg .msg-bubble {
    background-color: #3498db;
    color: white;
    border-bottom-right-radius: 4px;
  }
  
  .ai-msg .msg-bubble {
    background-color: #ecf0f1;
    color: #2c3e50;
    border-bottom-left-radius: 4px;
  }
  
  /* 输入区域 */
  .input-area {
    padding: 16px;
    border-top: 1px solid #eee;
    display: flex;
    gap: 12px;
  }
  
  .input-box {
    flex: 1;
    padding: 12px 16px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 14px;
    outline: none;
    transition: border-color 0.2s;
  }
  
  .input-box:focus {
    border-color: #3498db;
  }
  
  .btn {
    padding: 12px 20px;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .btn-primary {
    background-color: #3498db;
    color: white;
  }
  
  .btn-primary:hover:not(:disabled) {
    background-color: #2980b9;
  }
  
  .btn-secondary {
    background-color: #ecf0f1;
    color: #2c3e50;
  }
  
  .btn-secondary:hover {
    background-color: #bdc3c7;
  }
  
  /* 滚动条美化 */
  .chat-container::-webkit-scrollbar {
    width: 6px;
  }
  
  .chat-container::-webkit-scrollbar-thumb {
    background-color: #ddd;
    border-radius: 3px;
  }
  </style>