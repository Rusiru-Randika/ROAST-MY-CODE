import type { RoastApiPayload, ApiResponse } from '../types/roast';

const BACKEND_URL = import.meta.env.VITE_API_URL || '';

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

  if (!BACKEND_URL) {
    return {
      success: false,
      error: 'Backend API URL (VITE_API_URL) is not configured. Please set VITE_API_URL in your .env file.'
    };
  }

  try {
    const response = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const message = errorData?.error || `Server returned error (${response.status})`;
      return {
        success: false,
        error: message,
      };
    }

    const data = await response.json();
    if (data && data.success && data.result) {
      return {
        success: true,
        result: data.result,
        modelUsed: data.modelUsed || 'AI Engine',
        isMocked: false,
      };
    }

    return {
      success: false,
      error: data?.error || 'Invalid response received from roasting server.',
    };
  } catch (err: any) {
    console.error('API request error:', err);
    return {
      success: false,
      error: 'Could not connect to the backend server. Please check your network or API URL configuration.',
    };
  }
}
