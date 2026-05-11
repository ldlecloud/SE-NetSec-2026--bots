const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// 数据库文件路径
const dbPath = path.join(__dirname, 'database', 'ai_challenge.db');

// 确保 database 文件夹存在
const fs = require('fs');
if (!fs.existsSync(path.dirname(dbPath))) {
  fs.mkdirSync(path.dirname(dbPath));
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error('数据库连接失败:', err);
  else console.log('数据库连接成功');
});

// 创建所有表（根据你的E-R图）
db.serialize(() => {
  // 1. Users 表
  db.run(`CREATE TABLE IF NOT EXISTS Users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  )`);

  // 2. Challenges 表
  db.run(`CREATE TABLE IF NOT EXISTS Challenges (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    score INTEGER NOT NULL
  )`);

  // 3. AIChallengeProgress 表（用户-挑战进度）
  db.run(`CREATE TABLE IF NOT EXISTS AIChallengeProgress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    challenge_id INTEGER NOT NULL,
    is_completed BOOLEAN DEFAULT 0,
    completed_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (challenge_id) REFERENCES Challenges(id),
    UNIQUE(user_id, challenge_id)
  )`);

  // 4. VulnerableCode 表
  db.run(`CREATE TABLE IF NOT EXISTS VulnerableCode (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    challenge_id INTEGER NOT NULL,
    vuln_code TEXT NOT NULL,
    fixed_code TEXT,
    highlight_lines TEXT,
    FOREIGN KEY (challenge_id) REFERENCES Challenges(id)
  )`);

  // 5. PromptInjectionPayload 表
  db.run(`CREATE TABLE IF NOT EXISTS PromptInjectionPayload (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    payload TEXT NOT NULL,
    type TEXT,
    risk_level TEXT,
    description TEXT
  )`);

  console.log('所有表创建完成');
});

db.close();