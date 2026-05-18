class UserProgressRecord {
  constructor(userId, challengeId, score, status) {
    this.userId = userId;
    this.challengeId = challengeId;
    this.score = score;
    this.status = status;
  }
}
module.exports = UserProgressRecord;