const { getUserById } = require('../services/UserService');

function checkLogin(req, res, next) {
  // 1. 获取请求头（小写写法，最稳定）
  const userId = req.headers['user-id'];

  // 2. 空值判断
  if (!userId) {
    return res.status(401).json({ message: '请先登录' });
  }

  // 🔥 核心修复：把字符串转为数字！！！解决 === 不匹配问题
  const parsedId = parseInt(userId);
  
  // 3. 调用你的同步方法查询用户
  const user = getUserById(parsedId);
  if (!user) {
    return res.status(401).json({ message: '用户不存在' });
  }

  // 4. 校验通过，放行
  req.user = user;
  next();
}

module.exports = { checkLogin };