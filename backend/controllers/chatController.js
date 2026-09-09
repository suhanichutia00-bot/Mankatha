const {
  generateChatResponse,
} = require("../services/chatService");

const chat = async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message cannot be empty.",
      });
    }

    const response = await generateChatResponse(
      message.trim(),
      Array.isArray(history) ? history : []
    );

    return res.status(200).json({
      success: true,
      response,
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
