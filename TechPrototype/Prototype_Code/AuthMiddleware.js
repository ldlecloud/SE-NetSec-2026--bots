const { getUserById } = require('../services/UserService');

function checkLogin(req, res, next) {
  const userId = req.headers['user-id'];
  if (!userId) {
    return res.status(401).json({ message: '请先登录' });
  }

  const user = getUserById(parseInt(userId));
  if (!user) {
    return res.status(401).json({ message: '用户不存在' });
  }

  req.user = user;
  next();
}

module.exports = { checkLogin };