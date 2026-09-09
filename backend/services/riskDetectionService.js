function detectRiskFromAIResult(result) {
  if (!result) {
    throw new Error("AI risk result is missing.");
  }

  const allowedLevels = ["LOW", "MODERATE", "HIGH"];

  if (!allowedLevels.includes(result.riskLevel)) {
    throw new Error("Invalid risk level returned by AI.");
  }

  return {
    riskLevel: result.riskLevel,
    reason: result.reason || "",
    recommendedAction: result.recommendedAction || "",
  };
}

module.exports = {
  detectRiskFromAIResult,
};
