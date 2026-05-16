const evaluator = require('../src/services/evaluator');

describe('Prompt Evaluator', () => {
  describe('Basic Evaluation', () => {
    test('should return low score for vague prompts', () => {
      const result = evaluator.evaluateBasic('Write something');
      expect(result.overallScore).toBeLessThan(5);
    });

    test('should return high score for detailed prompts', () => {
      const prompt = 'Act as a senior developer. Write a Python function that takes a list of integers and returns the top 3 most frequent elements. Include type hints, docstring, and handle edge cases. Format the response as a code block with comments.';
      const result = evaluator.evaluateBasic(prompt);
      expect(result.overallScore).toBeGreaterThan(6);
    });

    test('should return suggestions for improvement', () => {
      const result = evaluator.evaluateBasic('Help me with code');
      expect(result.suggestions.length).toBeGreaterThan(0);
    });

    test('should include all criteria in results', () => {
      const result = evaluator.evaluateBasic('Test prompt for evaluation.');
      expect(result.criteria).toHaveProperty('clarity');
      expect(result.criteria).toHaveProperty('specificity');
      expect(result.criteria).toHaveProperty('context');
      expect(result.criteria).toHaveProperty('structure');
      expect(result.criteria).toHaveProperty('actionability');
    });

    test('should have grade in results', () => {
      const result = evaluator.evaluateBasic('Test prompt.');
      expect(result.grade).toHaveProperty('letter');
      expect(result.grade).toHaveProperty('label');
    });

    test('should handle empty-ish prompts gracefully', () => {
      const result = evaluator.evaluateBasic('Hi');
      expect(result.overallScore).toBeLessThan(3);
    });
  });

  describe('Score Ranges', () => {
    test('scores should be between 0 and 10', () => {
      const prompts = [
        'x',
        'Write code',
        'Please create a detailed analysis of market trends in the tech industry for Q4 2024, focusing on AI adoption rates.'
      ];

      prompts.forEach(prompt => {
        const result = evaluator.evaluateBasic(prompt);
        expect(result.overallScore).toBeGreaterThanOrEqual(0);
        expect(result.overallScore).toBeLessThanOrEqual(10);
      });
    });
  });
});
