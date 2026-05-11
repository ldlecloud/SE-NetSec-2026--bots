const users = require('../models/User');

// 根据ID获取用户
function getUserById(userId) {
  return users.find(u => u.id === userId);
}

// 更新用户积分
function updateUserScore(userId, newScore) {
  const user = getUserById(userId);
  if (user) user.score = newScore;
  return user;
}

module.exports = {
  getUserById,
  updateUserScore
};