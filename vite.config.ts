import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Local dev in-memory rate limiter
const ipCache = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT_COUNT = 15
const RATE_LIMIT_WINDOW_MS = 60 * 1000

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables from .env files (including .env.local)
  const env = loadEnv(mode, process.cwd(), '')
  const GEMINI_API_KEY = env.GEMINI_API_KEY

  return {
    plugins: [
      react(),
      {
        name: 'api-chat-dev-middleware',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            if (req.url?.startsWith('/api/chat') && req.method === 'POST') {
              // 1. Verify Client Header to block direct curl/Postman hits
              const clientHeader = req.headers['x-requested-with']
              if (clientHeader !== 'MaityAI-Client') {
                res.statusCode = 403
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ error: 'Forbidden: Direct API access is not allowed.' }))
                return
              }

              // 2. IP Rate Limiting
              const ip = (req.headers['x-forwarded-for'] as string) || req.socket?.remoteAddress || 'unknown'
              const now = Date.now()
              const userRate = ipCache.get(ip)

              if (!userRate) {
                ipCache.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS })
              } else {
                if (now > userRate.resetTime) {
                  userRate.count = 1
                  userRate.resetTime = now + RATE_LIMIT_WINDOW_MS
                } else {
                  userRate.count += 1
                  if (userRate.count > RATE_LIMIT_COUNT) {
                    res.statusCode = 429
                    res.setHeader('Content-Type', 'application/json')
                    res.end(JSON.stringify({ 
                      error: 'Too many requests from this session. Please wait a minute and try again.' 
                    }))
                    return
                  }
                }
              }

              try {
                let body = ''
                req.on('data', (chunk) => {
                  body += chunk
                })
                req.on('end', async () => {
                  try {
                    const { message, history } = JSON.parse(body)
                    
                    if (!GEMINI_API_KEY) {
                      res.statusCode = 500
                      res.setHeader('Content-Type', 'application/json')
                      res.end(JSON.stringify({ 
                        error: 'GEMINI_API_KEY is not defined in your environment or .env.local' 
                      }))
                      return
                    }

                    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
                    
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
`

                    const model = genAI.getGenerativeModel({ 
                      model: 'gemini-2.5-flash', 
                      systemInstruction: SYSTEM_PROMPT 
                    })

                    const formattedHistory = history ? history.map((msg: any) => ({
                      role: msg.role === 'assistant' ? 'model' : 'user',
                      parts: [{ text: msg.content }],
                    })) : []

                    const chat = model.startChat({
                      history: formattedHistory,
                    })

                    const result = await chat.sendMessage(message)
                    const responseText = result.response.text()

                    res.statusCode = 200
                    res.setHeader('Content-Type', 'application/json')
                    res.end(JSON.stringify({ response: responseText }))
                  } catch (err: any) {
                    console.error('Local dev API error:', err)
                    res.statusCode = 500
                    res.setHeader('Content-Type', 'application/json')
                    res.end(JSON.stringify({ error: err.message || 'Error processing request in local dev API' }))
                  }
                })
              } catch (err: any) {
                res.statusCode = 500
                res.end(err.message)
              }
            } else {
              next()
            }
          })
        }
      }
    ]
  }
})
