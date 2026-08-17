import type { RoastApiPayload, ApiResponse } from '../types/roast';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const LAMBDA_URL = import.meta.env.VITE_API_URL || '';

const GEMINI_MODELS = [
  'gemini-3.7-flash',
  'gemini-3.5-flash',
  'gemini-3.1-flash-lite',
  'gemini-flash-latest'
];

function buildPrompts(code: string, language: string, roastLevel: string) {
  const systemPrompt = `You are a savage, witty, world-class 80s arcade code roaster.
Your goal is to inspect code, analyze its flaws, and produce a hilarious, brutal, but technically insightful roast and refactoring.
The roast intensity level is: ${roastLevel.toUpperCase()}.

You MUST return ONLY valid JSON matching this exact schema:
{
  "roast": "A punchy, creative, memorable roast quote (1-3 sentences) criticizing their code.",
  "severity": 8, // integer from 1 to 10
  "summary": "Short technical diagnosis of what is wrong.",
  "issues": [
    {
      "title": "Issue title (e.g. Memory Leak Risk)",
      "description": "Specific explanation of the bug or bad practice.",
      "severity": "high" // "low" | "medium" | "high" | "critical"
    }
  ],
  "improvements": [
    "Actionable bullet point 1",
    "Actionable bullet point 2"
  ],
  "betterCode": "// Fully refactored, beautiful, idiomatic, and clean code that fixes all issues",
  "developerVerdict": "A final 1-sentence snarky arcade verdict."
}`;

  const userPrompt = `Language: ${language}
Level: ${roastLevel}
Code to roast:
\`\`\`${language}
${code}
\`\`\``;

  return { systemPrompt, userPrompt };
}

async function callDirectGemini(payload: RoastApiPayload): Promise<any> {
  if (!GEMINI_API_KEY) {
    throw new Error('VITE_GEMINI_API_KEY is not configured');
  }

  const { systemPrompt, userPrompt } = buildPrompts(payload.code, payload.language, payload.roastLevel);
  let lastError: any = null;

  for (const model of GEMINI_MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: `${systemPrompt}\n\nTask:\n${userPrompt}` }]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1500,
            responseMimeType: 'application/json'
          }
        })
      });

      if (!res.ok) {
        const errText = await res.text();
        console.warn(`Direct Gemini model ${model} HTTP ${res.status}:`, errText);
        lastError = new Error(`HTTP ${res.status}: ${errText}`);
        continue;
      }

      const data = await res.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) continue;

      let clean = rawText.trim();
      const match = clean.match(/\{[\s\S]*\}/);
      if (match) clean = match[0];

      return {
        result: JSON.parse(clean),
        modelUsed: `Google ${model}`
      };
    } catch (err: any) {
      console.warn(`Direct Gemini ${model} error:`, err.message);
      lastError = err;
    }
  }

  throw lastError || new Error('All Gemini models failed');
}

export async function submitRoastRequest(payload: RoastApiPayload): Promise<ApiResponse> {
  if (!payload.code || !payload.code.trim()) {
    return {
      success: false,
      error: 'Even the AI needs something to roast. Paste some code first. 🔥'
    };
  }

  if (payload.code.length > 10000) {
    return {
      success: false,
      error: 'Code payload exceeds maximum size limit (10,000 characters). Please paste a concise snippet.'
    };
  }

  // 1. Try Direct Google Gemini API if configured
  if (GEMINI_API_KEY) {
    try {
      const directRes = await callDirectGemini(payload);
      if (directRes && directRes.result) {
        return {
          success: true,
          result: directRes.result,
          modelUsed: directRes.modelUsed,
          isMocked: false,
        };
      }
    } catch (directErr: any) {
      console.warn('Direct Gemini call failed, trying Lambda fallback...', directErr.message);
    }
  }

  // 2. Fallback to AWS Lambda
  if (LAMBDA_URL) {
    try {
      const response = await fetch(LAMBDA_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.success && data.result) {
          return {
            success: true,
            result: data.result,
            modelUsed: data.modelUsed || 'AI Engine',
            isMocked: false,
          };
        }
      }
    } catch (lambdaErr: any) {
      console.warn('Lambda proxy failed:', lambdaErr.message);
    }
  }

  return {
    success: false,
    error: 'Could not connect to the AI model. Please verify your environment configuration.'
  };
}
