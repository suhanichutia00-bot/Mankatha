const { detectRisk } = require("../services/riskDetectionService");

const analyzeRisk = async (req, res) => {
  console.log("Risk API request received");

  try {
    const { message } = req.body;

    console.log("Message received:", message);

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message cannot be empty.",
      });
    }

    console.log("Starting risk detection...");

    const result = await detectRisk(message.trim());

    console.log("Risk detection result:", result);

    const responseData = {
      success: true,
      riskLevel: result.riskLevel,
      reason: result.reason,
      recommendedAction: result.recommendedAction,
    };

    console.log("Sending response:", responseData);

    return res.status(200).json(responseData);

  } catch (error) {
    console.error("Risk detection error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to analyze risk at this time.",
    });
  }
};

module.exports = {
  analyzeRisk,
};
