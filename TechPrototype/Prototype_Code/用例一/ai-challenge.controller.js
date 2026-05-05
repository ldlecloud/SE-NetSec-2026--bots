const PromptInjectionDetector = require('./detector');
const LlmMockService = require('./llm-mock.service');
const ChallengeScoreService = require('./challenge-score.service');
const AiChallengeProgress = require('../models/ai-challenge-progress.model');

const detector = new PromptInjectionDetector();
const llmService = new LlmMockService();
const scoreService = new ChallengeScoreService();

/**
 * AI 挑战核心控制器
 */
class AiChallengeController {
  /**
   * 处理 AI 对话请求
   * POST /api/ai/chat
   */
  async handleChatRequest(req, res) {
    try {
      const { userId, prompt } = req.body;

      // 参数校验
      if (!userId || !prompt) {
        return res.status(400).json({
          success: false,
          error: '缺少必要参数：userId 和 prompt'
        });
      }

      // 1. 检测提示注入
      const detectionResult = detector.detect(prompt);

      // 2. 生成 LLM 响应
      const llmResponse = llmService.generateResponse(prompt, detectionResult);

      // 3. 检查是否已完成挑战
      const existingProgress = await AiChallengeProgress.findOne({
        where: { user_id: userId, challenge_id: 999 } // 999 为 AI 提示注入挑战 ID
      });

      let scoreAwarded = false;
      let newScore = 0;

      // 4. 如果注入成功且未完成过，发放积分
      if (llmResponse.flagLeaked && !existingProgress?.is_completed) {
        const scoreResult = await scoreService.awardScore(userId, 999, 500); // 500 分
        scoreAwarded = scoreResult.success;
        newScore = scoreResult.newScore;

        // 记录挑战完成
        await AiChallengeProgress.create({
          user_id: userId,
          challenge_id: 999,
          is_completed: true,
          completed_at: new Date()
        });
      }

      // 5. 返回结果
      return res.json({
        success: true,
        response: llmResponse.response,
        detection: detectionResult,
        flagLeaked: llmResponse.flagLeaked,
        flag: llmResponse.flag,
        scoreAwarded,
        newScore,
        challengeCompleted: !existingProgress?.is_completed && llmResponse.flagLeaked
      });

    } catch (error) {
      console.error('[AI Challenge] 处理请求失败:', error);
      return res.status(500).json({
        success: false,
        error: '服务器内部错误'
      });
    }
  }

  /**
   * 获取挑战状态
   * GET /api/ai/challenge/status/:userId
   */
  async getChallengeStatus(req, res) {
    try {
      const { userId } = req.params;

      const progress = await AiChallengeProgress.findOne({
        where: { user_id: userId, challenge_id: 999 }
      });

      return res.json({
        success: true,
        isCompleted: progress?.is_completed || false,
        completedAt: progress?.completed_at || null
      });

    } catch (error) {
      console.error('[AI Challenge] 获取状态失败:', error);
      return res.status(500).json({ success: false, error: '获取状态失败' });
    }
  }
}

module.exports = new AiChallengeController();