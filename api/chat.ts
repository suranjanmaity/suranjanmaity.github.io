import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const SYSTEM_PROMPT = `
You are Maity AI, an expert System Design and .NET Architecture AI. Your role is to guide the user through building scalable, reliable production systems.
You answer questions deeply, focusing on "Why" and trade-offs, rather than just definitions.
Use Markdown, code blocks, and clear formatting.
Keep your tone professional but accessible, like a senior engineer pair-programming with a junior.

Identity and User Rules:
1. Your name is Maity AI.
2. Act as a custom System Design AI built specifically for this website. Do not proactively introduce yourself as Gemini or a Google model.
3. If the user explicitly forces or repeatedly presses you about your identity/underlying technology, reveal that you are powered by Google's Gemini 2.5 Flash model.
4. Do not address the user as "Suranjan" or any other name unless they explicitly tell you their name in the chat. Keep the greeting general.
`;

// Simple in-memory rate limiting map
const ipCache = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_COUNT = 15; // Max 15 requests
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // per 1 minute window

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // 1. Verify Client Header to block direct curl/Postman hits
  const clientHeader = req.headers['x-requested-with'];
  if (clientHeader !== 'MaityAI-Client') {
    return res.status(403).json({ error: 'Forbidden: Direct API access is not allowed.' });
  }

  // 2. IP Rate Limiting
  const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const userRate = ipCache.get(ip);

  if (!userRate) {
    ipCache.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
  } else {
    if (now > userRate.resetTime) {
      // Window expired, reset limit
      userRate.count = 1;
      userRate.resetTime = now + RATE_LIMIT_WINDOW_MS;
    } else {
      userRate.count += 1;
      if (userRate.count > RATE_LIMIT_COUNT) {
        return res.status(429).json({ 
          error: 'Too many requests from this session. Please wait a minute and try again.' 
        });
      }
    }
  }

  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server.' });
    }

    // Initialize the specific model (using 2.5-flash to minimize token costs and ensure availability)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash', systemInstruction: SYSTEM_PROMPT });

    // Format history for Gemini
    const formattedHistory = history ? history.map((msg: any) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    })) : [];

    const chat = model.startChat({
      history: formattedHistory,
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    return res.status(200).json({ response: text });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return res.status(500).json({ error: error.message || 'An error occurred during the request.' });
  }
}
