// test.js

import dotenv from "dotenv";
dotenv.config();

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

try {
  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: "Hello",
  });

  console.log(response.text);
} catch (e) {
  console.error(e);
}