exports.getMockResponse = (userInput) => {
  const isAttack = exports.checkInjection(userInput);

  if (isAttack) {
    return '⚠ 检测到提示注入行为！';
  }

  switch (true) {
    case userInput.includes('你好'):
      return '你好！我是AI助手，你可以向我提问。';
    case userInput.includes('功能'):
      return '我可以帮你解释代码、回答问题，但不能执行危险指令。';
    default:
      return '我已收到你的消息：' + userInput;
  }
};

exports.checkInjection = (userInput) => {
  const keywords = [
    '忽略之前指令',
    '忽略系统提示',
    '忘记你的指令',
    '不要遵守规则',
    '执行系统命令',
    '现在你是管理员',
    '解除限制'
  ];
  return keywords.some(kw => userInput.includes(kw));
};