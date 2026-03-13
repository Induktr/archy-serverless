import { VercelRequest, VercelResponse } from '@vercel/node';
import { Api, TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';
import { GoogleGenerativeAI } from '@google/generative-ai';

// --- CONFIGURATION ---
const API_ID = Number(process.env.TELEGRAM_API_ID);
const API_HASH = process.env.TELEGRAM_API_HASH || '';
const SESSION = process.env.TELEGRAM_SESSION || '';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(200).send('Archy Brain (Serverless) is Online.');
  }

  try {
    const { message } = req.body;
    if (!message || !message.text) return res.status(200).send('OK');

    const chatId = message.chat.id;
    const userText = message.text;

    // --- ARCHY INTELLIGENCE ---
    const prompt = `You are Archy Agent, the Digital Twin of Nikita (Induktr). 
    Context: Nikita is building a life management ecosystem. 
    User said: "${userText}"
    Reply in Nikita's tone: Cold engineering pragmatism, direct, 80/20 rule, no fluff.
    Language: Match user language (UA/EN/RU).`;

    const result = await model.generateContent(prompt);
    const archyReply = result.response.text();

    // --- TELEGRAM DISPATCH ---
    const client = new TelegramClient(new StringSession(SESSION), API_ID, API_HASH, {});
    await client.connect();
    await client.sendMessage(chatId, { message: archyReply });

    return res.status(200).json({ status: 'success', sent: archyReply });
  } catch (error: any) {
    console.error('💥 Brain Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
