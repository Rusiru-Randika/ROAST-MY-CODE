import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';
import { buildSystemPrompt, buildUserPrompt } from './promptTemplates.mjs';

const region = process.env.AWS_REGION || 'us-east-1';
const bedrockClient = new BedrockRuntimeClient({ region });

// Gemini API Key from Lambda environment variable
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

// Top stable Google Gemini models in priority order
const GEMINI_MODELS = [
  'gemini-3.5-flash',
  'gemini-3.1-flash-lite',
  'gemini-flash-latest',
  'gemini-3.7-flash',
  'gemini-pro-latest'
];

// Note: When CORS is enabled in AWS Lambda Function URL configuration,
// AWS automatically injects Access-Control-Allow-Origin headers.
// We only specify Content-Type here to prevent the duplicate '*, *' CORS browser error.
const RESPONSE_HEADERS = {
  'Content-Type': 'application/json',
};

async function callGeminiApi(systemPrompt, userPrompt, apiKey) {
  let lastError = null;

  for (const modelName of GEMINI_MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
      
      const payload = {
        contents: [
          {
            role: 'user',
            parts: [
              { text: `${systemPrompt}\n\nTask:\n${userPrompt}` }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1500,
          responseMimeType: 'application/json'
        }
      };

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errText = await res.text();
        console.warn(`Model ${modelName} HTTP ${res.status}: ${errText.substring(0, 100)}`);
        lastError = new Error(`HTTP ${res.status}: ${errText}`);
        continue;
      }

      const data = await res.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!rawText) {
        continue;
      }

      let cleanJsonStr = rawText.trim();
      const jsonMatch = cleanJsonStr.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        cleanJsonStr = jsonMatch[0];
      }

      return {
        result: JSON.parse(cleanJsonStr),
        modelUsed: `Google ${modelName}`
      };
    } catch (err) {
      console.warn(`Gemini model ${modelName} error:`, err.message);
      lastError = err;
    }
  }

  throw lastError || new Error('All Gemini models failed');
}

export const handler = async (event) => {
  // Support both Payload format 1.0 (event.httpMethod) and 2.0 (event.requestContext.http.method)
  const method = (event.httpMethod || event.requestContext?.http?.method || '').toUpperCase();

  // Handle CORS OPTIONS preflight
  if (method === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: RESPONSE_HEADERS,
      body: JSON.stringify({ message: 'CORS preflight OK' }),
    };
  }

  try {
    if (!event.body) {
      return {
        statusCode: 400,
        headers: RESPONSE_HEADERS,
        body: JSON.stringify({ success: false, error: 'Request body is empty' }),
      };
    }

    // Handle base64 encoded bodies from Function URLs
    let rawBody = event.body;
    if (event.isBase64Encoded && typeof rawBody === 'string') {
      rawBody = Buffer.from(rawBody, 'base64').toString('utf-8');
    }

    const payload = typeof rawBody === 'string' ? JSON.parse(rawBody) : rawBody;
    const { code, language = 'javascript', roastLevel = 'savage' } = payload || {};

    // Validate inputs
    if (!code || typeof code !== 'string' || !code.trim()) {
      return {
        statusCode: 400,
        headers: RESPONSE_HEADERS,
        body: JSON.stringify({ success: false, error: 'Source code is required' }),
      };
    }

    if (code.length > 10000) {
      return {
        statusCode: 400,
        headers: RESPONSE_HEADERS,
        body: JSON.stringify({ success: false, error: 'Source code exceeds maximum length of 10,000 characters' }),
      };
    }

    // Construct prompts
    const systemPrompt = buildSystemPrompt(roastLevel);
    const userPrompt = buildUserPrompt(code, language, roastLevel);

    let structuredResult = null;
    let modelUsed = '';
    let geminiError = null;

    // 1. Primary: Invoke Google Gemini
    if (GEMINI_API_KEY) {
      try {
        const geminiRes = await callGeminiApi(systemPrompt, userPrompt, GEMINI_API_KEY);
        structuredResult = geminiRes.result;
        modelUsed = geminiRes.modelUsed;
      } catch (geminiErr) {
        console.error('Gemini error:', geminiErr);
        geminiError = geminiErr;
      }
    }

    // 2. Secondary fallback: Amazon Bedrock
    if (!structuredResult) {
      const BEDROCK_MODELS = [
        process.env.BEDROCK_MODEL_ID || 'amazon.titan-text-express-v1',
        'amazon.titan-text-lite-v1',
        'amazon.nova-micro-v1:0',
      ];

      for (const modelId of BEDROCK_MODELS) {
        try {
          let requestBody;
          if (modelId.startsWith('amazon.titan')) {
            requestBody = {
              inputText: `${systemPrompt}\n\nTask:\n${userPrompt}`,
              textGenerationConfig: {
                maxTokenCount: 1500,
                temperature: 0.7,
                topP: 0.9,
              },
            };
          } else {
            requestBody = {
              inferenceConfig: {
                max_new_tokens: 1500,
                temperature: 0.7,
                top_p: 0.9,
              },
              system: [{ text: systemPrompt }],
              messages: [
                {
                  role: 'user',
                  content: [{ text: userPrompt }],
                },
              ],
            };
          }

          const command = new InvokeModelCommand({
            modelId,
            contentType: 'application/json',
            accept: 'application/json',
            body: JSON.stringify(requestBody),
          });

          const response = await bedrockClient.send(command);
          const responseString = new TextDecoder().decode(response.body);
          const responseJson = JSON.parse(responseString);

          let aiTextOutput = '';
          if (modelId.startsWith('amazon.titan')) {
            aiTextOutput = responseJson.results?.[0]?.outputText || '';
          } else {
            aiTextOutput = responseJson.output?.message?.content?.[0]?.text || '';
          }

          let cleanJsonStr = aiTextOutput.trim();
          const jsonMatch = cleanJsonStr.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            cleanJsonStr = jsonMatch[0];
          }

          structuredResult = JSON.parse(cleanJsonStr);
          modelUsed = modelId;
          break;
        } catch (err) {
          console.warn(`Bedrock model ${modelId} failed:`, err.message);
        }
      }
    }

    if (!structuredResult) {
      throw new Error(geminiError ? geminiError.message : 'AI generation failed');
    }

    return {
      statusCode: 200,
      headers: RESPONSE_HEADERS,
      body: JSON.stringify({
        success: true,
        result: structuredResult,
        modelUsed,
      }),
    };
  } catch (error) {
    console.error('Error in Roast My Code Lambda:', error);
    return {
      statusCode: 500,
      headers: RESPONSE_HEADERS,
      body: JSON.stringify({
        success: false,
        error: 'The roasting server caught fire. Please try again in a moment.',
        details: error.message,
      }),
    };
  }
};
