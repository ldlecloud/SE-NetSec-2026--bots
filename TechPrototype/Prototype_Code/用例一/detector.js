/**
 * 提示注入检测核心模块
 * 采用正则匹配 + 语义特征检测的混合方案
 */
class PromptInjectionDetector {
    constructor() {
      // 已知攻击载荷正则库
      this.attackPatterns = [
        { regex: /ignore all (previous|prior) instructions/i, type: 'direct_injection', risk: 3 },
        { regex: /disregard (all|previous) (rules|instructions)/i, type: 'direct_injection', risk: 3 },
        { regex: /you are now (a|an|the)/i, type: 'role_play', risk: 2 },
        { regex: /act as (a|an|the)/i, type: 'role_play', risk: 2 },
        { regex: /repeat after me/i, type: 'command_injection', risk: 2 },
        { regex: /output the (system|initial) prompt/i, type: 'prompt_leak', risk: 3 },
        { regex: /leak the (secret|flag|password)/i, type: 'data_leak', risk: 3 },
        { regex: /forget everything/i, type: 'direct_injection', risk: 2 }
      ];
  
      // 可疑关键词库
      this.suspiciousKeywords = [
        'ignore', 'disregard', 'forget', 'act as', 'pretend',
        'system prompt', 'secret', 'flag', 'password', 'bypass'
      ];
    }
  
    /**
     * 检测输入是否为提示注入攻击
     * @param {string} prompt - 用户输入
     * @returns {Object} 检测结果
     */
    detect(prompt) {
      if (!prompt || typeof prompt !== 'string') {
        return { isInjection: false, type: 'invalid', riskLevel: 0, confidence: 1.0 };
      }
  
      const lowerPrompt = prompt.toLowerCase().trim();
  
      // 第一步：正则匹配已知攻击载荷
      for (const pattern of this.attackPatterns) {
        if (pattern.regex.test(prompt)) {
          return {
            isInjection: true,
            type: pattern.type,
            riskLevel: pattern.risk,
            confidence: 0.95,
            matchedPattern: pattern.regex.toString()
          };
        }
      }
  
      // 第二步：语义特征检测
      let keywordCount = 0;
      for (const keyword of this.suspiciousKeywords) {
        if (lowerPrompt.includes(keyword)) {
          keywordCount++;
        }
      }
  
      // 短文本 + 多个可疑关键词 = 高疑似注入
      if (keywordCount >= 2 && prompt.length < 200) {
        return {
          isInjection: true,
          type: 'suspicious_keyword',
          riskLevel: 2,
          confidence: 0.7,
          matchedKeywords: this.suspiciousKeywords.filter(k => lowerPrompt.includes(k))
        };
      }
  
      return {
        isInjection: false,
        type: 'normal',
        riskLevel: 0,
        confidence: 0.9
      };
    }
  }
  
  module.exports = PromptInjectionDetector;