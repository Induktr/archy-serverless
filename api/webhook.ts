import { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';

// --- CONFIG ---
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const BOT_TOKEN = process.env.BOT_TOKEN || '';

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(200).send('Archy Brain (Bot-Mode) is Online.');
  }

  try {
    const { message } = req.body;
    if (!message || !message.text) return res.status(200).send('OK');

    const chatId = message.chat.id;
    const userText = message.text;

    // --- ARCHY INTELLIGENCE ---
    const prompt = `You are Archy Agent, the Digital Twin of Nikita (Induktr). 
    Context: You are managing the Induktr Portfolio Bot. 
    User said: "${userText}"
    Instruction: Reply in Nikita's tone: Cold engineering pragmatism, direct, 80/20 rule, no fluff.
    Language: Match user language (UA/EN/RU).`;

    const result = await model.generateContent(prompt);
    const archyReply = result.response.text();

    // --- TELEGRAM BOT API (Fastest for Serverless) ---
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: archyReply }),
    });

    return res.status(200).json({ status: 'success' });
  } catch (error: any) {
    console.error('💥 Brain Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
