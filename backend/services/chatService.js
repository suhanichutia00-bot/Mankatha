const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const SYSTEM_INSTRUCTION = `
You are Mankatha, an AI mental wellness companion.

Your role is to provide supportive, empathetic and respectful conversational
support to users.

Rules:
1. Listen carefully to what the user says.
2. Respond in a warm, calm and non-judgmental way.
3. Do not diagnose mental health conditions.
4. Do not claim to be a doctor, therapist or medical professional.
5. Do not prescribe medicines or give medical diagnoses.
6. Encourage healthy coping strategies when appropriate.
7. Ask gentle follow-up questions when they may help the conversation.
8. Keep responses understandable and reasonably concise.
9. If the user appears to be in immediate danger or talks about seriously
   hurting themselves or someone else, encourage them to contact local
   emergency services or a trusted person immediately.
10. Never shame or judge the user.
11. Mankatha is a wellness support tool and not a replacement for
   professional mental health care.

Always prioritize the user's safety and wellbeing.
`;

async function generateChatResponse(message, history = []) {
  const contents = [];

  for (const item of history) {
    contents.push({
      role: item.role,
      parts: [
        {
          text: item.text,
        },
      ],
    });
  }

  contents.push({
    role: "user",
    parts: [
      {
        text: message,
      },
    ],
  });

  const response = await ai.models.generateContent({
    model: "gemini-3.7-flash",
    contents,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.7,
      maxOutputTokens: 500,
    },
  });

  return response.text;
}

module.exports = {
  generateChatResponse,
};
