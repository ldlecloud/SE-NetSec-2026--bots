const express = require('express');
const app = express();
const port = 3000;
const path = require('path');

// 解决图片加载报错（CSP策略）
app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'");
  next();
});

app.use(express.json());

// 映射public文件夹（核心功能）
app.use(express.static(path.join(__dirname, 'public')));

// 挂载你的接口
const authRoutes = require('./backend/routes/AuthRoutes');
const aiChallengeRoutes = require('./backend/routes/AiChallengeRoutes');

app.use('/api', authRoutes);
app.use('/api/ai-challenge', aiChallengeRoutes);

// 启动服务
app.listen(port, () => {
  console.log(`✅ 服务运行在 http://localhost:${port}`);
});