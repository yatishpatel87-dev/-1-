import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Google GenAI
const apiKey = process.env.GEMINI_API_KEY || '';

const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const GUJARATI_SYSTEM_INSTRUCTION = `તમે "જ્ઞાન સહાયક" (Gyan Sahayak AI) છો - ગુજરાત બોર્ડ (GSEB / GCERT) ના અદ્યતન (Latest Rationalized) અભ્યાસક્રમ મુજબના નિષ્ણાત AI શિક્ષક અને બહુભાષીય માર્ગદર્શક.

૧૦૦% સાચા અને સંપૂર્ણ જવાબો આપવાનો સર્વોચ્ચ નિયમ (100% Accuracy & Complete Answer Mandate):
૧. ૧૦૦% સાચો અને અધિકૃત ઉત્તર:
   - તમારા દ્વારા અપાતો દરેક જવાબ GSEB / GCERT ના સત્તાવાર પાઠ્યપુસ્તક અને અભ્યાસક્રમ મુજબ ૧૦૦% સાચો, તથ્યાત્મક અને વ્યાકરણબદ્ધ હોવો જોઈએ.
   - ગણિત (Mathematics): દરેક દાખલાની ગણતરી (સરવાળા, બાદબાકી, ગુણાકાર, ભાગાકાર, અવયવ, સમીકરણ, વર્ગમૂળ, ઘનમૂળ, ક્ષેત્રફળ) બે વાર ચકાસીને ૧૦૦% સાચી જ આપવી. દરેક પગથિયું (Step-by-Step) સ્પષ્ટ લખવું.
   - વિજ્ઞાન (Science): વૈજ્ઞાનિક વ્યાખ્યાઓ, વૈજ્ઞાનિક કારણો, પ્રયોગો અને રાસાયણિક સમીકરણો પાઠ્યપુસ્તક મુજબ અચૂક સાચા હોવા જોઈએ.
   - સામાજિક વિજ્ઞાન (Social Science): ઇતિહાસની સાલવારી, નકશા વાચન, ભૂગોળ અને બંધારણીય કલમો સત્તાવાર તથ્યો આધારિત જ હોવી જોઈએ.
   - ભાષાઓ (ગુજરાતી, હિન્દી, અંગ્રેજી, સંસ્કૃત): વ્યાકરણ નિયમો, કાળ (Tenses), સંજ્ઞા, સમાસ, સંધિ, જોડણી અને શ્લોકોમાં એક પણ ભૂલ ન હોવી જોઈએ.

૨. સંપૂર્ણ લખાણ (Complete & Fully Readable Response):
   - ઉત્તર કોઈપણ સંજોગોમાં અધૂરો કે અડધો ન છોડવો.
   - પ્રશ્નના તમામ પેટા-મુદ્દાઓનું શરૂઆતથી અંત સુધી સંપૂર્ણ નિરાકરણ આપવું જેથી વિદ્યાર્થી આખો જવાબ પૂરેપૂરો વાંચી શકે.

૩. લાગુ પડતી ભાષામાં ઉત્તર આપવાનો નિયમ (Strict Language Rule):
   - હિન્દીમાં પૂછે તો: સંપૂર્ણ જવાબ શુદ્ધ, વ્યાકરણબદ્ધ હિન્દી લિપિ (Devanagari) માં આપવો.
   - અંગ્રેજીમાં પૂછે તો: સંપૂર્ણ જવાબ વ્યાકરણશુદ્ધ, સ્પષ્ટ અંગ્રેજી (English) માં આપવો.
   - સંસ્કૃતમાં પૂછે તો: શ્લોક અને ઉત્તર સંસ્કૃત (देवनागरी) માં તથા તેનો શબ્દાર્થ અને ગુજરાતી ભાવાર્થ આપવો.
   - ગુજરાતીમાં પૂછે તો: શુદ્ધ, સરળ અને વ્યાકરણબદ્ધ ગુજરાતીમાં જ જવાબ આપવો.

૪. પરીક્ષાલક્ષી ઉત્તર પદ્ધતિ:
   - શાળાની એકમ કસોટી (PAT) અને પરીક્ષા માટે મુદ્દાસર (Bullet points), બોલ્ડ હેડિંગ અને સ્પષ્ટ રચના સાથે ઉત્તર આપવો.

૫. જ્ઞાન સહાયક સંપર્ક / હેલ્પલાઇન નંબર (Gyan Sahayak Helpline Information):
   - જો કોઈ વિદ્યાર્થી કે શિક્ષક "જ્ઞાન સહાયક નંબર", "હેલ્પલાઇન નંબર" કે શિક્ષણ સહાય સંપર્ક વિશે પૂછે તો:
     * ગુજરાત શાળા શિક્ષણ / વિદ્યા સમીક્ષા કેન્દ્ર (VSK) ટોલ-ફ્રી નંબર: ૧૮૦૦-૨૩૩-૭૯૬૫ (1800-233-7965)
     * સમગ્ર શિક્ષા ગાંધીનગર હેલ્પલાઇન: ૦૭૯-૨૩૨૫૩૪૪૪ (079-23253444)
     * GSEB બોર્ડ હેલ્પલાઇન: 1800 233 5500
     આ નંબર અને વિદ્યાર્થીઓને મળતી સહાય વિશે સ્પષ્ટ અને સચોટ માહિતી આપવી.`;

// Sarvam AI for authentic Gujarati / Hindi / English Text-to-Speech
const sarvamApiKey = process.env.SARVAM_API_KEY || 'sk_lhfze6j4_vy4DGa7yPMPZ3L5lGaOd8zSe';

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    botName: 'જ્ઞાન સહાયક',
    apiKeyConfigured: Boolean(apiKey && apiKey !== 'MY_GEMINI_API_KEY'),
    sarvamConfigured: Boolean(sarvamApiKey),
  });
});

// High-fidelity Multilingual Text-to-Speech powered by Sarvam AI (gu-IN, hi-IN, en-IN)
app.post('/api/tts', async (req: Request, res: Response) => {
  try {
    const { text, speaker = 'aditya', pace = 1.0, languageCode } = req.body;

    if (!text || typeof text !== 'string') {
      res.status(400).json({ error: 'લખાણ જરૂરી છે.' });
      return;
    }

    if (!sarvamApiKey) {
      res.status(500).json({ error: 'Sarvam API કી ગોઠવેલ નથી.' });
      return;
    }

    // Clean markdown for clear speech
    const cleanedText = text
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/#{1,6}\s+/g, '')
      .replace(/```[\s\S]*?```/g, 'કોડ')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/\[(.*?)\]\(.*?\)/g, '$1')
      .replace(/[•\-\*]\s+/g, '')
      .trim();

    // Use full response chunk up to 2000 chars, breaking cleanly at sentence end
    let speechChunk = cleanedText.slice(0, 2000);
    if (cleanedText.length > 2000) {
      const lastPunct = Math.max(
        speechChunk.lastIndexOf('.'),
        speechChunk.lastIndexOf('!'),
        speechChunk.lastIndexOf('?'),
        speechChunk.lastIndexOf('।'),
        speechChunk.lastIndexOf('\n')
      );
      if (lastPunct > 500) {
        speechChunk = speechChunk.slice(0, lastPunct + 1);
      }
    }

    // Smart language detection: Hindi/Sanskrit (Devanagari), English (Latin), or Gujarati
    let targetLanguage = languageCode;
    if (!targetLanguage) {
      const devanagariCount = (speechChunk.match(/[\u0900-\u097F]/g) || []).length;
      const gujaratiCount = (speechChunk.match(/[\u0A80-\u0AFF]/g) || []).length;
      const englishCount = (speechChunk.match(/[a-zA-Z]/g) || []).length;

      if (devanagariCount > gujaratiCount && devanagariCount > englishCount) {
        targetLanguage = 'hi-IN';
      } else if (englishCount > gujaratiCount && englishCount > devanagariCount && englishCount > 20) {
        targetLanguage = 'en-IN';
      } else {
        targetLanguage = 'gu-IN';
      }
    }

    const sarvamResponse = await fetch('https://api.sarvam.ai/text-to-speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-subscription-key': sarvamApiKey,
      },
      body: JSON.stringify({
        inputs: [speechChunk],
        target_language_code: targetLanguage,
        speaker: speaker || 'aditya',
        pitch: 0,
        pace: pace || 1.0,
        model: 'bulbul:v3',
        enable_preprocessing: true,
      }),
    });

    if (!sarvamResponse.ok) {
      const errBody = await sarvamResponse.text();
      res.status(sarvamResponse.status).json({ error: 'Sarvam TTS API ભૂલ', details: errBody });
      return;
    }

    const data: any = await sarvamResponse.json();
    if (data && data.audios && data.audios[0]) {
      res.json({
        audio: data.audios[0],
        format: 'wav',
        speaker,
        language: targetLanguage,
      });
    } else {
      res.status(500).json({ error: 'ઓડિયો તૈયાર થઈ શક્યો નથી.' });
    }
  } catch (error: any) {
    console.error('Sarvam TTS error:', error);
    res.status(500).json({ error: 'ઓડિયો સેવા અપ્રાપ્ય છે.', details: error?.message });
  }
});

function getModelConfig(modelName: string) {
  if (modelName === 'gemini-3.8-flash') {
    return {
      systemInstruction: GUJARATI_SYSTEM_INSTRUCTION,
      temperature: 0.15, // Low temperature for 100% factual, mathematical, and grammatical accuracy
      maxOutputTokens: 8192,
      thinkingConfig: {
        thinkingLevel: ThinkingLevel.LOW,
      },
    };
  }
  return {
    systemInstruction: GUJARATI_SYSTEM_INSTRUCTION,
    temperature: 0.15,
    maxOutputTokens: 8192,
  };
}

// Chat endpoint with SSE streaming support
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { message, history = [], stream = true } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'સંદેશ જરૂરી છે.' });
      return;
    }

    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      res.status(500).json({
        error: 'Gemini API કી ગોઠવેલ નથી. કૃપા કરીને AI Studio ના Settings > Secrets માં GEMINI_API_KEY ઉમેરો.',
      });
      return;
    }

    // Prepare contents formatted for Gemini
    const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

    if (Array.isArray(history)) {
      for (const item of history) {
        if (item && item.text && (item.role === 'user' || item.role === 'model')) {
          contents.push({
            role: item.role,
            parts: [{ text: item.text }],
          });
        }
      }
    }

    // Add current user message
    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const CANDIDATE_MODELS = ['gemini-flash-latest', 'gemini-3.8-flash', 'gemini-3.1-flash-lite'];

    if (stream) {
      let streamSucceeded = false;
      let lastErr: any = null;

      for (const modelName of CANDIDATE_MODELS) {
        try {
          const config = getModelConfig(modelName);
          const responseStream = await ai.models.generateContentStream({
            model: modelName,
            contents,
            config,
          });

          // Headers sent only after stream is successfully created
          if (!res.headersSent) {
            res.setHeader('Content-Type', 'text/event-stream');
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Connection', 'keep-alive');
            res.flushHeaders?.();
          }

          let fullText = '';
          for await (const chunk of responseStream) {
            const chunkText = chunk.text || '';
            if (chunkText) {
              fullText += chunkText;
              res.write(`data: ${JSON.stringify({ chunk: chunkText })}\n\n`);
            }
          }

          res.write(`data: ${JSON.stringify({ done: true, fullText })}\n\n`);
          res.end();
          streamSucceeded = true;
          break;
        } catch (err: any) {
          lastErr = err;
          // If headers weren't sent yet, we can try the next candidate model
          if (!res.headersSent) {
            continue;
          } else {
            // Already streaming, cannot switch models mid-flight
            break;
          }
        }
      }

      if (!streamSucceeded && !res.headersSent) {
        throw lastErr || new Error('બધા મોડલ અપ્રાપ્ય છે.');
      }
    } else {
      // Non-streaming fallback with model chain
      let reply = '';
      let nonStreamSucceeded = false;
      let lastErr: any = null;

      for (const modelName of CANDIDATE_MODELS) {
        try {
          const config = getModelConfig(modelName);
          const response = await ai.models.generateContent({
            model: modelName,
            contents,
            config,
          });
          reply = response.text || 'હું આપને કેવી રીતે મદદ કરી શકું?';
          nonStreamSucceeded = true;
          break;
        } catch (err: any) {
          lastErr = err;
          continue;
        }
      }

      if (!nonStreamSucceeded) {
        throw lastErr || new Error('બધા મોડલ અપ્રાપ્ય છે.');
      }

      res.json({ reply });
    }
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    const errorMessage = error?.message || 'અજ્ઞાત ભૂલ';

    // Tailored Gujarati error explanations
    let friendlyGujaratiError = 'ક્ષમા કરશો, ટેકનિકલ કારણોસર જવાબ આપી શકાયો નથી. કૃપા કરીને ફરી પ્રયાસ કરો.';
    if (errorMessage.includes('RESOURCE_EXHAUSTED') || error?.status === 429) {
      friendlyGujaratiError = 'વિનંતીઓની મર્યાદા સમાપ્ત થઈ ગઈ છે. કૃપા કરીને થોડી ક્ષણો પછી ફરી પ્રયત્ન કરો.';
    } else if (errorMessage.includes('UNAVAILABLE') || error?.status === 503) {
      friendlyGujaratiError = 'AI સેવા પર હાલ વધુ ટ્રાફિક છે. કૃપા કરીને થોડી જ સેકન્ડમાં ફરીથી પ્રયાસ કરો.';
    } else if (errorMessage.includes('API_KEY_INVALID') || error?.status === 400) {
      friendlyGujaratiError = 'API કી અમાન્ય જણાય છે. કૃપા કરીને સેટિંગ્સમાં સાચી કી ચકાસો.';
    } else if (errorMessage.includes('PERMISSION_DENIED') || error?.status === 403) {
      friendlyGujaratiError = 'API વપરાશની પરવાનગી નથી. કૃપા કરીને Gemini API કી તપાસો.';
    }

    if (!res.headersSent) {
      res.status(500).json({ error: friendlyGujaratiError, details: errorMessage });
    } else {
      res.write(`data: ${JSON.stringify({ error: friendlyGujaratiError })}\n\n`);
      res.end();
    }
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT} (mode: ${isProduction ? 'prod' : 'dev'})`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
