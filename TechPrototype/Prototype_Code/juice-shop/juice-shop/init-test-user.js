const db = require('./backend/data-access/DbConnection');

db.run(`INSERT OR IGNORE INTO users (username, password, score) 
VALUES (?, ?, ?), (?, ?, ?)`,
['user1', '123456', 0],
['admin', '123456', 999],
function (err) {
  if (err) console.log(err);
  else console.log('✅ 测试账号创建成功！');
  process.exit();
});