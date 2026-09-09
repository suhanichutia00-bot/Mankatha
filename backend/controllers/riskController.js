const analyzeRisk = async (req, res) => {
  return res.status(410).json({
    success: false,
    message:
      "Risk detection is now integrated into the AI Chatbot.",
  });
};

module.exports = {
  analyzeRisk,
};
