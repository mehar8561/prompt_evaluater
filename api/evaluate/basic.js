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

    if (prompt.length > 5000) {
      return res.status(400).json({ error: 'Prompt too long (max 5000 characters)' });
    }

    const result = evaluator.evaluateBasic(prompt.trim());
    res.status(200).json({ success: true, evaluation: result });
  } catch (error) {
    console.error('Evaluation error:', error);
    res.status(500).json({ error: 'Evaluation failed' });
  }
};
