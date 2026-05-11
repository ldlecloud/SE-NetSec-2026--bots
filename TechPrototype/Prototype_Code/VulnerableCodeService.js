exports.getVulnerableCodeByDifficulty = (difficulty) => {
  const codeList = {
    easy: {
      id: 1,
      title: "基础提示注入漏洞",
      vulnerableCode: `// 漏洞代码：未限制用户输入，直接拼接prompt
function buildPrompt(userInput) {
  return "你是一个助手：" + userInput;
}`,
      fixedCode: `// 修复后：对用户输入进行转义与过滤
function buildPrompt(userInput) {
  const sanitized = userInput.replace(/["';]/g, '');
  return "你是一个助手：" + sanitized;
}`
    },
    medium: {
      id: 2,
      title: "指令覆盖漏洞",
      vulnerableCode: `// 漏洞代码：用户输入可覆盖系统指令
function chat(userInput) {
  const systemPrompt = "只能回答天气问题";
  const fullPrompt = systemPrompt + userInput;
  return llm(fullPrompt);
}`,
      fixedCode: `// 修复后：系统指令与用户输入隔离
function chat(userInput) {
  const systemPrompt = "只能回答天气问题";
  const fullPrompt = systemPrompt + "\\n用户：" + userInput;
  return llm(fullPrompt);
}`
    },
    hard: {
      id: 3,
      title: "多轮对话注入漏洞",
      vulnerableCode: `// 漏洞代码：历史对话无限制，用户可篡改上下文
function multiTurnChat(history, newMsg) {
  history.push({role: "user", content: newMsg});
  return llm(history);
}`,
      fixedCode: `// 修复后：对历史对话做角色隔离
function multiTurnChat(history, newMsg) {
  history.push({role: "user", content: newMsg});
  const safeHistory = history.filter(h => h.role !== "system");
  return llm(safeHistory);
}`
    }
  };
  return codeList[difficulty] || codeList.easy;
};