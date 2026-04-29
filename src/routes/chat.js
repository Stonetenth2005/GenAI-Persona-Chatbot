/**
 * Chat API Route
 *
 * POST /api/chat
 * Accepts { message, persona, history } and returns an AI-generated reply
 * using the Meta Llama 3.1 8B model primed with the selected persona.
 */

import { Router } from 'express';
import { HfInference } from '@huggingface/inference';
import { personas, COT_SUFFIX } from '../config/personas.js';

const router = Router();

// Lazy-init Hugging Face client
let hf = null;
function getHF() {
  if (!hf) {
    if (!process.env.HUGGINGFACE_TOKEN) {
      throw new Error('HUGGINGFACE_TOKEN is missing in .env file');
    }
    hf = new HfInference(process.env.HUGGINGFACE_TOKEN);
  }
  return hf;
}

router.post('/', async (req, res) => {
  try {
    const { message, persona, history } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required.' });
    }

    if (!personas[persona]) {
      return res.status(400).json({ error: 'Invalid persona selected.' });
    }

    const systemPrompt = personas[persona].systemInstruction + COT_SUFFIX;

    // Format history for Llama (Hugging Face chatCompletion expects role/content)
    const messages = [
      { role: 'system', content: systemPrompt },
      ...(history || []).map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      })),
      { role: 'user', content: message }
    ];

    const response = await getHF().chatCompletion({
      model: 'meta-llama/Llama-3.1-8B-Instruct',
      messages: messages,
      max_tokens: 1024,
      temperature: 0.7,
    });

    const reply = response.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error('Hugging Face API Error:', error.message || error);
    res.status(500).json({ 
      error: error.message.includes('token') 
        ? 'Hugging Face Token missing or invalid.' 
        : 'Failed to generate response. Please try again.' 
    });
  }
});

export default router;
