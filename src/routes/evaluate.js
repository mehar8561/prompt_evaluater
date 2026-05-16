const express = require('express');
const router = express.Router();
const evaluator = require('../services/evaluator');

router.post('/basic', (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || prompt.trim().length === 0) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    if (prompt.length > 5000) {
      return res.status(400).json({ error: 'Prompt too long (max 5000 characters)' });
    }

    const result = evaluator.evaluateBasic(prompt.trim());
    res.json({ success: true, evaluation: result });
  } catch (error) {
    console.error('Evaluation error:', error);
    res.status(500).json({ error: 'Evaluation failed' });
  }
});

router.post('/ai', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || prompt.trim().length === 0) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(503).json({ error: 'AI evaluation not configured' });
    }

    const result = await evaluator.evaluateWithAI(prompt.trim());
    res.json({ success: true, evaluation: result });
  } catch (error) {
    console.error('AI Evaluation error:', error);
    res.status(500).json({ error: 'AI evaluation failed' });
  }
});

router.post('/compare', (req, res) => {
  try {
    const { prompt1, prompt2 } = req.body;

    if (!prompt1 || !prompt2) {
      return res.status(400).json({ error: 'Both prompts are required' });
    }

    const eval1 = evaluator.evaluateBasic(prompt1.trim());
    const eval2 = evaluator.evaluateBasic(prompt2.trim());

    res.json({
      success: true,
      comparison: {
        prompt1: { text: prompt1, evaluation: eval1 },
        prompt2: { text: prompt2, evaluation: eval2 },
        winner: eval1.overallScore >= eval2.overallScore ? 'prompt1' : 'prompt2',
        scoreDifference: Math.abs(eval1.overallScore - eval2.overallScore)
      }
    });
  } catch (error) {
    console.error('Comparison error:', error);
    res.status(500).json({ error: 'Comparison failed' });
  }
});

module.exports = router;
