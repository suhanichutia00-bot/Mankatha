const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const RISK_SYSTEM_INSTRUCTION = `
You are the Risk Detection component of Mankatha,
an AI-powered mental wellness support platform.

Analyze the user's message and classify the safety risk.

Return exactly one of:

LOW
MODERATE
HIGH

LOW:
Normal stress, sadness, loneliness, frustration, academic
pressure, relationship problems, or everyday emotional
difficulties without signs of immediate danger.

MODERATE:
Significant emotional distress, hopelessness, severe
struggle, or concerning statements without clear immediate
danger or a clear intention to seriously harm themselves
or another person.

HIGH:
Clear indication of immediate danger, suicidal intent,
serious self-harm intent, a stated plan to seriously harm
oneself or another person, or an emergency situation.

Important:
- Do not diagnose mental health conditions.
- Do not provide medical diagnoses.
- Do not judge the user.
- Do not assume high risk without evidence.
- Explicit immediate self-harm or harm-to-others intent should
  be classified as HIGH.
- Return ONLY valid JSON.

Required JSON format:

{
  "riskLevel": "LOW",
  "reason": "short explanation",
  "recommendedAction": "short supportive recommendation"
}
`;

async function detectRisk(message) {
  const maxAttempts = 3;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      console.log(`Risk detection attempt ${attempt}/${maxAttempts}`);

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",

        contents: [
          {
            role: "user",
            parts: [
              {
                text: message,
              },
            ],
          },
        ],

        config: {
          systemInstruction: RISK_SYSTEM_INSTRUCTION,
          temperature: 0.1,
          maxOutputTokens: 300,
          responseMimeType: "application/json",

          thinkingConfig: {
            thinkingLevel: "low",
          },
        },
      });

      const text = response.text;

      const result = JSON.parse(text);

      if (!["LOW", "MODERATE", "HIGH"].includes(result.riskLevel)) {
        throw new Error("Invalid risk level returned by AI.");
      }

      console.log("Risk detection successful.");

      return result;

    } catch (error) {

      console.error(
        `Risk detection attempt ${attempt} failed:`,
        error.message
      );

      if (attempt === maxAttempts) {
        throw error;
      }

      const delay = attempt * 2000;

      console.log(`Retrying in ${delay / 1000} seconds...`);

      await new Promise((resolve) => {
        setTimeout(resolve, delay);
      });
    }
  }
}

module.exports = {
  detectRisk,
};
