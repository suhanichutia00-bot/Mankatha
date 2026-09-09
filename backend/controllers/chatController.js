const {
  analyzeMessage,
} = require("../services/chatService");

const chat = async (req, res) => {
  try {
    const {
      message,
      history,
      mood,
      language,
    } = req.body;

    console.log("Chat API request received");
    console.log("Message:", message);
    console.log("Mood:", mood);
    console.log("Language:", language);

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message cannot be empty.",
      });
    }

    const result = await analyzeMessage(
      message.trim(),
      Array.isArray(history) ? history : [],
      mood || null,
      language || "English"
    );

    console.log("Integrated AI result:", result);

    return res.status(200).json({
      success: true,
      riskLevel: result.riskLevel,
      reason: result.reason,
      recommendedAction: result.recommendedAction,
      response: result.response,
    });

  } catch (error) {
    console.error("Chatbot error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to generate AI response.",
    });
  }
};

module.exports = {
  chat,
};
