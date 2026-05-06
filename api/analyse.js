const MODELS = ['gemini-2.5-flash', 'gemini-2.5-flash-lite', 'gemma-4-31b-it', 'gemma-4-26b-a4b-it'];
const REQUEST_TIMEOUT = 240000; // 15 seconds per request

async function callSingleModel(prompt, apiKey, model) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        }),
        signal: controller.signal
      }
    );

    const data = await response.json();

    // Check for quota errors or API errors
    if (data.error?.message?.includes('quota') || data.error?.message?.includes('Quota exceeded')) {
      throw new Error(`Quota exceeded`);
    }

    if (data.error) {
      throw new Error(data.error.message);
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    
    // Validate that response looks like JSON
    const trimmed = text.replace(/```json|```/g, "").trim();
    if (!trimmed.startsWith('{')) {
      throw new Error('Non-JSON response');
    }
    
    return { text, model };
  } catch (e) {
    throw new Error(`${model}: ${e.message}`);
  } finally {
    clearTimeout(timeout);
  }
}

async function callGeminiAPI(prompt, apiKey) {
  const errors = [];

  // Try models in parallel batches (2 at a time) - whichever succeeds first wins
  for (let i = 0; i < MODELS.length; i += 2) {
    const batch = MODELS.slice(i, i + 2);
    const promises = batch.map(model => callSingleModel(prompt, apiKey, model));
    
    try {
      const result = await Promise.race(promises);
      console.log(`✓ Success with model: ${result.model}`);
      return result;
    } catch (e) {
      errors.push(e.message);
      console.log(`Batch ${i / 2 + 1} failed, trying next batch...`);
    }
  }

  throw new Error(`All models failed: ${errors.join('; ')}`);
}

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt } = req.body;
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY not configured' });
    }

    const result = await callGeminiAPI(prompt, GEMINI_API_KEY);
    res.json({ text: result.text, model: result.model });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
