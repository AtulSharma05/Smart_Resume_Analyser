require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MODELS = [ 'gemini-2.5-flash', 'gemini-2.5-flash-lite','gemma-4-31b-it', 'gemma-4-26b-a4b-it'];

async function callGeminiAPI(prompt, modelIndex = 0) {
  if (modelIndex >= MODELS.length) {
    throw new Error('All models failed. Please try again later.');
  }

  const model = MODELS[modelIndex];

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await response.json();

    // Check for quota errors or API errors
    if (data.error?.message?.includes('quota') || data.error?.message?.includes('Quota exceeded')) {
      console.log(`Model ${model} quota exceeded, trying fallback...`);
      return callGeminiAPI(prompt, modelIndex + 1);
    }

    if (data.error) {
      console.error(`Model ${model} API error:`, data.error.message);
      return callGeminiAPI(prompt, modelIndex + 1);
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    
    // Validate that response looks like JSON
    const trimmed = text.replace(/```json|```/g, "").trim();
    if (!trimmed.startsWith('{')) {
      console.log(`Model ${model} returned non-JSON response, trying fallback...`);
      return callGeminiAPI(prompt, modelIndex + 1);
    }
    
    return { text, model };
  } catch (e) {
    console.error(`Model ${model} failed:`, e.message);
    return callGeminiAPI(prompt, modelIndex + 1);
  }
}

app.post('/api/analyse', async (req, res) => {
  try {
    const { prompt } = req.body;
    const result = await callGeminiAPI(prompt);
    res.json({ text: result.text, model: result.model });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(3001, () => console.log('Proxy running on http://localhost:3001'));