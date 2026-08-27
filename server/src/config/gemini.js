import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

let genAI = null;
const apiKey = process.env.GEMINI_API_KEY;

if (apiKey && apiKey !== 'your_gemini_api_key_here') {
  genAI = new GoogleGenerativeAI(apiKey);
  console.log('[AI Engine] Google Gemini Pro initialized successfully.');
} else {
  console.warn('[AI Engine Warning] GEMINI_API_KEY is not set. Platform will operate with clinical rule-based intelligence fallback.');
}

export const getGeminiModel = (modelName = 'gemini-1.5-flash') => {
  if (!genAI) return null;
  return genAI.getGenerativeModel({ model: modelName });
};
