const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const SYSTEM_INSTRUCTION = `
You are Mankatha, an AI mental wellness companion.

Your role is to provide supportive, empathetic and respectful
conversational support.

You are NOT a doctor, therapist, or medical professional.

You must:
1. Be warm, calm and non-judgmental.
2. Never diagnose a mental health condition.
3. Never prescribe medication.
4. Never judge or shame the user.
5. Give supportive and practical responses when appropriate.
6. Encourage the user to talk to trusted people or professionals
   when appropriate.
7. If there are signs of immediate danger, serious self-harm,
   suicide, or harm to another person, prioritize safety and
   encourage immediate emergency or trusted-person support.
8. Respond in the user's selected language.
9. Keep the response understandable and reasonably concise.

You must return ONLY valid JSON.

Required format:

{
  "riskLevel": "LOW",
  "reason": "short explanation",
  "recommendedAction": "short supportive recommendation",
  "response": "supportive response to the user"
}

Risk levels:

LOW:
Normal sadness, loneliness, stress, frustration, academic pressure,
relationship problems, or everyday emotional difficulties without
signs of immediate danger.

MODERATE:
Significant emotional distress, hopelessness, severe struggle,
or concerning statements without clear immediate danger.

HIGH:
Clear indication of immediate danger, suicidal intent,
serious self-harm intent, a stated plan to seriously harm
oneself or another person, or an emergency situation.

Important:
Do not assume HIGH risk without evidence.
`;

async function analyzeMessage(
  message,
  history = [],
  mood = null,
  language = "English"
) {
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

  const context = `
Selected language:
${language}

Detected mood from Mankatha's local mood detection model:
${mood || "unknown"}

Current user message:
${message}

Analyze the user's emotional safety risk and provide an appropriate
supportive response.

Return JSON only.
`;

  contents.push({
    role: "user",
    parts: [
      {
        text: context,
      },
    ],
  });

  const response = await ai.models.generateContent({
    model: "gemini-3.8-flash",

    contents,

    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.3,
      maxOutputTokens: 500,
      responseMimeType: "application/json",
      thinkingConfig: {
        thinkingLevel: "low",
      },
    },
  });

  const text = response.text.trim();

  let result;

  try {
    result = JSON.parse(text);
  } catch (error) {
    console.error("Invalid JSON from Gemini:", text);
    throw new Error("Gemini returned invalid JSON.");
  }

  if (!["LOW", "MODERATE", "HIGH"].includes(result.riskLevel)) {
    throw new Error("Invalid risk level returned by Gemini.");
  }

  return result;
}

module.exports = {
  analyzeMessage,
};
