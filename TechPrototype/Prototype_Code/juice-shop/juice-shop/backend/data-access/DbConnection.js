const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../../database.sqlite3');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error('数据库连接失败', err);
  else console.log('✅ 数据库已连接');
});

// 自动创建用户表
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      score INTEGER DEFAULT 0
    )
  `);
});

// 正确导出 db ✅
module.exports = db;