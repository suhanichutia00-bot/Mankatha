const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const LANGUAGE_INSTRUCTION = `
You are the multilingual language component of Mankatha,
an AI-powered mental wellness support platform.

Your task is to translate the user's message into the selected
language while preserving the original meaning, emotion, and tone.

Supported languages:
- English
- Hindi
- Assamese
- Bengali

Rules:
1. Preserve the meaning of the original message.
2. Preserve emotional context.
3. Do not add new information.
4. Do not remove important information.
5. Do not diagnose mental health conditions.
6. Return only the translated text.
`;

async function translateMessage(message, language) {
  const prompt = `
Translate the following message into ${language}.

Message:
${message}
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.8-flash",

    contents: [
      {
        role: "user",
        parts: [
          {
            text: prompt,
          },
        ],
      },
    ],

    config: {
      systemInstruction: LANGUAGE_INSTRUCTION,
      temperature: 0.2,
      maxOutputTokens: 500,

      thinkingConfig: {
        thinkingLevel: "low",
      },
    },
  });

  return response.text.trim();
}

module.exports = {
  translateMessage,
};
