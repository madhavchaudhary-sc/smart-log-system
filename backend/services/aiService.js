const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function explainAnomaly(log) {
  const prompt = `
You are a production log analysis assistant.

This log has ALREADY been flagged as anomalous by
a deterministic application-side algorithm.

Do NOT decide whether the log is anomalous.

Your job is only to explain the flagged event.

Analyze the following log and return JSON with exactly these fields:

{
  "explanation": "...",
  "rootCause": "...",
  "nextStep": "..."
}

Requirements:
- explanation: explain what happened in simple English
- rootCause: give the most likely technical cause, but clearly indicate uncertainty
- nextStep: give one practical debugging or remediation step
- Do not invent facts that are not present in the log

Log:
${JSON.stringify(log, null, 2)}
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
    },
  });

  return JSON.parse(response.text);
}

module.exports = {
  explainAnomaly,
};