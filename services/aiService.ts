import { GoogleGenAI } from "@google/genai";

const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

export const generateHRResponse = async (prompt: string): Promise<string> => {
  const ai = getAIClient();
  if (!ai) {
    return "API Key is missing. Please configure the environment.";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "You are a helpful, professional, and empathetic HR assistant named 'Nexus AI'. You assist HR managers with drafting emails, policy explanations, job descriptions, and general HR advice. Keep responses concise and formatted with Markdown.",
      }
    });
    return response.text || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("AI Error:", error);
    return "An error occurred while communicating with the AI service.";
  }
};