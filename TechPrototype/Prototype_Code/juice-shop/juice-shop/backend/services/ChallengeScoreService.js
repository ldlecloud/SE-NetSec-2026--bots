exports.calculateScore = function(isSuccess, challengeType) {
    if (!isSuccess) return 0;

    switch (challengeType) {
        case "prompt-ignore":
            return 10;
        case "role-impersonate":
            return 15;
        case "indirect-injection":
            return 20;
        default:
            return 10;
    }
};