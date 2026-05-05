const express = require('express');
const router = express.Router();
const aiController = require('./ai-challenge.controller');

// 挂载到 Juice Shop 的 /api/ai 路由前缀
router.post('/chat', aiController.handleChatRequest);
router.get('/challenge/status/:userId', aiController.getChallengeStatus);

module.exports = router;