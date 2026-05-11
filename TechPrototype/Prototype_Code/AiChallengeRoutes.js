const express = require('express');
const router = express.Router();
const AiChallengeController = require('../controllers/AiChallengeController');
const { checkLogin } = require('../middleware/AuthMiddleware');

// 必须登录才能获取分数
router.get('/score', checkLogin, AiChallengeController.getUserScore);

// 必须登录才能发送消息、得分
router.post('/send', checkLogin, AiChallengeController.sendMessage);

module.exports = router;