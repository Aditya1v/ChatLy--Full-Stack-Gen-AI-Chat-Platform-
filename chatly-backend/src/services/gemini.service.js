import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

/**
 * Stream chat response
 */
export const streamGeminiChat = async ({ contents, onChunk }) => {
  const model = process.env.GEMINI_CHAT_MODEL || "gemini-2.5-flash";

  let stream;

try {
  stream = await ai.models.generateContentStream({
    model,
    contents,
  });
} catch (err) {
  console.error("SDK ERROR");
  console.error(err);
  throw err;
}
  let fullText = "";

  for await (const chunk of stream) {

   
    const text = chunk.text;

    if (!text) continue;

    fullText += text;
    onChunk(text);
  }

  return fullText;
};

/**
 * Create embeddings
 */
export const embedText = async (text) => {
  const model =
    process.env.GEMINI_EMBED_MODEL || "gemini-embedding-001";

  const response = await ai.models.embedContent({
    model,
    contents: text,
  });

  return response.embeddings[0].values;
};