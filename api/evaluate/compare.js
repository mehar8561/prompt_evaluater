const evaluator = require('../../src/services/evaluator');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { prompt1, prompt2 } = req.body;

    if (!prompt1 || !prompt2) {
      return res.status(400).json({ error: 'Both prompts are required' });
    }

    const eval1 = evaluator.evaluateBasic(prompt1.trim());
    const eval2 = evaluator.evaluateBasic(prompt2.trim());

    res.status(200).json({
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
};
