const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

// 挂载路由
const authRoutes = require('./backend/routes/AuthRoutes');
const aiChallengeRoutes = require('./backend/routes/AiChallengeRoutes');

app.use('/api', authRoutes);          // 登录接口：/api/login
app.use('/api/ai-challenge', aiChallengeRoutes);

app.listen(port, () => {
  console.log(`✅ 服务运行在 http://localhost:${port}`);
});