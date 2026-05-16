const evaluator = require('../../src/services/evaluator');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { prompt } = req.body;

    if (!prompt || prompt.trim().length === 0) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(503).json({ error: 'AI evaluation not configured' });
    }

    const result = await evaluator.evaluateWithAI(prompt.trim());
    res.status(200).json({ success: true, evaluation: result });
  } catch (error) {
    console.error('AI Evaluation error:', error);
    res.status(500).json({ error: 'AI evaluation failed' });
  }
};
