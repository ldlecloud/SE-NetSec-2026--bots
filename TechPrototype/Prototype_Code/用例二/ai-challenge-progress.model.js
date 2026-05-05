const { DataTypes } = require('sequelize');

/**
 * 用户挑战进度表模型
 * 与 Juice Shop 原生 Users 和 Challenges 表关联
 */
module.exports = (sequelize) => {
  const AiChallengeProgress = sequelize.define('AiChallengeProgress', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users', // Juice Shop 原生用户表
        key: 'id'
      },
      comment: '关联用户 ID'
    },
    challenge_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Challenges', // Juice Shop 原生挑战表
        key: 'id'
      },
      comment: '关联挑战 ID'
    },
    is_completed: {
      type: DataTypes.TINYINT(1),
      allowNull: false,
      defaultValue: 0,
      comment: '是否完成挑战'
    },
    completed_at: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: '完成时间'
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      onUpdate: DataTypes.NOW
    }
  }, {
    tableName: 'ai_challenge_progress',
    timestamps: false,
    indexes: [
      {
        unique: true,
        name: 'uk_user_challenge',
        fields: ['user_id', 'challenge_id']
      },
      {
        name: 'idx_completed',
        fields: ['is_completed']
      }
    ]
  });

  return AiChallengeProgress;
};