const { Challenges, Users, Scores } = require('juice-shop').models; // 复用 Juice Shop 原生模型
const AiChallengeProgress = require('../models/ai-challenge-progress.model');

/**
 * 挑战积分服务
 * 对接 Juice Shop 原生积分系统
 */
class ChallengeScoreService {
  /**
   * 发放挑战积分
   * @param {number} userId - 用户 ID
   * @param {number} challengeId - 挑战 ID
   * @param {number} score - 积分数
   * @returns {Object} 发放结果
   */
  async awardScore(userId, challengeId, score) {
    const transaction = await sequelize.transaction();

    try {
      // 1. 检查是否已发放过积分
      const existingProgress = await AiChallengeProgress.findOne({
        where: { user_id: userId, challenge_id: challengeId },
        transaction
      });

      if (existingProgress?.is_completed) {
        await transaction.rollback();
        return {
          success: false,
          error: '挑战已完成，积分已发放过',
          alreadyAwarded: true
        };
      }

      // 2. 获取挑战信息
      const challenge = await Challenges.findByPk(challengeId, { transaction });
      if (!challenge) {
        await transaction.rollback();
        return { success: false, error: '挑战不存在' };
      }

      // 3. 获取用户信息
      const user = await Users.findByPk(userId, { transaction });
      if (!user) {
        await transaction.rollback();
        return { success: false, error: '用户不存在' };
      }

      // 4. 写入积分记录（复用 Juice Shop 原生 Scores 表）
      const finalScore = score || challenge.difficulty * 100;
      await Scores.create({
        UserId: userId,
        ChallengeId: challengeId,
        score: finalScore,
        createdAt: new Date()
      }, { transaction });

      // 5. 更新用户总积分
      user.totalScore = (user.totalScore || 0) + finalScore;
      await user.save({ transaction });

      // 6. 更新挑战进度
      if (existingProgress) {
        existingProgress.is_completed = true;
        existingProgress.completed_at = new Date();
        await existingProgress.save({ transaction });
      } else {
        await AiChallengeProgress.create({
          user_id: userId,
          challenge_id: challengeId,
          is_completed: true,
          completed_at: new Date()
        }, { transaction });
      }

      await transaction.commit();

      return {
        success: true,
        scoreAwarded: finalScore,
        newScore: user.totalScore,
        challengeId,
        userId
      };

    } catch (error) {
      await transaction.rollback();
      console.error('[Score Service] 发放积分失败:', error);
      return {
        success: false,
        error: '发放积分失败: ' + error.message
      };
    }
  }

  /**
   * 检查用户是否已完成挑战
   */
  async isChallengeCompleted(userId, challengeId) {
    const progress = await AiChallengeProgress.findOne({
      where: { user_id: userId, challenge_id: challengeId }
    });
    return progress?.is_completed || false;
  }
}

module.exports = ChallengeScoreService;