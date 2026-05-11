const db = require('../data-access/DbConnection');
const svgCaptcha = require('svg-captcha');

// 全局保存验证码
let currentCodeStr = '';

// 获取验证码图片
exports.getCode = (req, res) => {
  const captcha = svgCaptcha.create({
    size: 4,       // 4位验证码
    noise: 2,      // 干扰线
    color: true,
    background: '#fff'
  });
  currentCodeStr = captcha.text; // 保存验证码文字
  res.type('svg');
  res.send(captcha.data);
};

// 获取验证码文本（前端校验用）
exports.getCodeText = (req, res) => {
  res.json({ code: currentCodeStr });
};

// 登录
exports.login = (req, res) => {
  const { username, password } = req.body;
  db.get('SELECT * FROM users WHERE username = ? AND password = ?',
    [username, password], (err, user) => {
      if (err || !user) {
        return res.json({ ok: false, msg: '账号或密码错误' });
      }
      res.json({
        ok: true,
        userId: user.id,
        username: user.username
      });
    });
};

// 注册（带用户名重复检查）
exports.register = (req, res) => {
  const { username, password } = req.body;

  // 先查用户名是否已存在
  db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
    if (row) {
      return res.json({ ok: false, msg: '用户名已存在' });
    }

    // 不存在 → 插入数据库
    db.run(
      'INSERT INTO users (username, password, score) VALUES (?, ?, 0)',
      [username, password],
      (err) => {
        if (err) {
          return res.json({ ok: false, msg: '注册失败' });
        }
        res.json({ ok: true, msg: '注册成功' });
      }
    );
  });
};