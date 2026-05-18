const express = require('express');
const router = express.Router();
const authController = require('../controllers/AuthController');

// 登录
router.post('/login', authController.login);

// 注册（新增）
router.post('/register', authController.register);

// 验证码（新增）
router.get('/code', authController.getCode);
router.get('/codeText', authController.getCodeText);

module.exports = router;