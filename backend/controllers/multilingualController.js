const {
  translateMessage,
} = require("../services/multilingualService");

const translate = async (req, res) => {
  try {
    const { message, language } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message cannot be empty.",
      });
    }

    if (!language) {
      return res.status(400).json({
        success: false,
        message: "Language is required.",
      });
    }

    const allowedLanguages = [
      "English",
      "Hindi",
      "Assamese",
      "Bengali",
    ];

    if (!allowedLanguages.includes(language)) {
      return res.status(400).json({
        success: false,
        message: "Unsupported language.",
      });
    }

    const translatedText = await translateMessage(
      message.trim(),
      language
    );

    return res.status(200).json({
      success: true,
      language,
      translatedText,
    });

  } catch (error) {
    console.error("Multilingual error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to translate message.",
    });
  }
};

module.exports = {
  translate,
};
