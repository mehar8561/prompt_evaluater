const { Configuration, OpenAIApi } = require('openai');
const EVALUATION_CRITERIA = require('../utils/criteria');

const openai = new OpenAIApi(new Configuration({ apiKey: process.env.OPENAI_API_KEY }));

class PromptEvaluator {
  evaluateBasic(prompt) {
    const results = {
      clarity: this.evaluateClarity(prompt),
      specificity: this.evaluateSpecificity(prompt),
      context: this.evaluateContext(prompt),
      structure: this.evaluateStructure(prompt),
      actionability: this.evaluateActionability(prompt)
    };

    let totalScore = 0;
    let totalWeight = 0;

    for (const [criterion, data] of Object.entries(results)) {
      const weight = EVALUATION_CRITERIA[criterion].weight;
      totalScore += data.score * weight;
      totalWeight += weight;
    }

    const overallScore = Math.round((totalScore / totalWeight) * 100) / 100;

    return {
      overallScore,
      maxScore: 10,
      percentage: Math.round(overallScore * 10),
      criteria: results,
      suggestions: this.generateSuggestions(results),
      grade: this.getGrade(overallScore)
    };
  }

  evaluateClarity(prompt) {
    let score = 0;
    const feedback = [];

    if (prompt.length > 20) {
      score += 2;
    } else {
      feedback.push('Prompt is too short to be clear');
    }

    if (prompt.includes('?') || /^(create|write|explain|describe|list|generate|build|design)/i.test(prompt.trim())) {
      score += 3;
    } else {
      feedback.push('Consider starting with a clear action verb or question');
    }

    if (/[.!?]$/.test(prompt.trim())) {
      score += 2;
    } else {
      feedback.push('Add proper punctuation at the end');
    }

    const ambiguousWords = ['thing', 'stuff', 'something', 'whatever', 'etc'];
    if (!ambiguousWords.some(word => prompt.toLowerCase().includes(word))) {
      score += 3;
    } else {
      feedback.push("Avoid vague words like 'thing', 'stuff', 'something'");
    }

    return { score: Math.min(score, 10), maxScore: 10, feedback };
  }

  evaluateSpecificity(prompt) {
    let score = 0;
    const feedback = [];
    const wordCount = prompt.split(/\s+/).filter(Boolean).length;

    if (wordCount >= 10) score += 2;
    if (wordCount >= 25) score += 1;
    if (wordCount < 10) feedback.push('Add more detail - aim for at least 10-25 words');

    if (/\d+/.test(prompt)) {
      score += 2;
    } else {
      feedback.push('Consider adding specific numbers or quantities');
    }

    const formatWords = ['format', 'list', 'table', 'json', 'markdown', 'bullet', 'paragraph', 'steps'];
    if (formatWords.some(word => prompt.toLowerCase().includes(word))) {
      score += 2;
    } else {
      feedback.push('Specify the desired output format');
    }

    const constraintWords = ['must', 'should', 'need', 'require', 'limit', 'maximum', 'minimum', 'between'];
    if (constraintWords.some(word => prompt.toLowerCase().includes(word))) {
      score += 2;
    } else {
      feedback.push('Add constraints or requirements to narrow the response');
    }

    if (/example|e\.g\.|for instance|such as|like/i.test(prompt)) {
      score += 1;
    } else {
      feedback.push('Consider providing an example of desired output');
    }

    return { score: Math.min(score, 10), maxScore: 10, feedback };
  }

  evaluateContext(prompt) {
    let score = 0;
    const feedback = [];

    if (/you are|act as|as a|role of|persona/i.test(prompt)) {
      score += 3;
    } else {
      feedback.push("Consider defining a role (e.g., 'Act as a senior developer...')");
    }

    if (/audience|reader|user|beginner|expert|professional|student/i.test(prompt)) {
      score += 2;
    } else {
      feedback.push('Specify the target audience');
    }

    if (/purpose|goal|objective|aim|in order to|so that/i.test(prompt)) {
      score += 3;
    } else {
      feedback.push('State the purpose or goal of the request');
    }

    if (prompt.split(/\s+/).filter(Boolean).length > 15) {
      score += 2;
    } else {
      feedback.push('Provide more background context');
    }

    return { score: Math.min(score, 10), maxScore: 10, feedback };
  }

  evaluateStructure(prompt) {
    let score = 0;
    const feedback = [];

    if (prompt.includes('\n') || prompt.includes('\\n')) {
      score += 2;
    } else if (prompt.split(/\s+/).filter(Boolean).length > 30) {
      feedback.push('Consider breaking long prompts into sections');
    } else {
      score += 1;
    }

    if (/\d\.|[-•*]|\n-/g.test(prompt)) {
      score += 2;
    }

    const connectors = ['first', 'then', 'next', 'finally', 'also', 'additionally', 'however', 'moreover'];
    if (connectors.some(word => prompt.toLowerCase().includes(word))) {
      score += 2;
    }

    const sentences = prompt.split(/[.!?]+/).filter(Boolean);
    if (sentences.length >= 2 && sentences.length <= 10) {
      score += 2;
    } else if (sentences.length > 10) {
      feedback.push('Consider condensing - very long prompts can lose focus');
      score += 1;
    } else {
      feedback.push('Consider using multiple sentences for better structure');
    }

    const wordCount = prompt.split(/\s+/).filter(Boolean).length;
    if (wordCount >= 15 && wordCount <= 200) {
      score += 2;
    } else if (wordCount > 200) {
      feedback.push('Prompt may be too long - consider being more concise');
      score += 1;
    }

    return { score: Math.min(score, 10), maxScore: 10, feedback };
  }

  evaluateActionability(prompt) {
    let score = 0;
    const feedback = [];

    const actionVerbs = ['create', 'write', 'explain', 'describe', 'list', 'generate', 'build', 'design', 'analyze', 'compare', 'summarize', 'translate', 'convert', 'optimize', 'review', 'suggest', 'recommend', 'help'];
    if (actionVerbs.some(verb => prompt.toLowerCase().includes(verb))) {
      score += 3;
    } else {
      feedback.push('Use clear action verbs (create, write, explain, analyze, etc.)');
    }

    if (prompt.includes('?')) {
      score += 2;
    }

    if (/output|result|response|return|give me|provide|show/i.test(prompt)) {
      score += 2;
    } else {
      feedback.push('Specify what output you expect');
    }

    const taskIndicators = prompt.match(/\b(and|also|plus|additionally)\b/gi) || [];
    if (taskIndicators.length <= 2) {
      score += 2;
    } else {
      feedback.push('Consider breaking multiple tasks into separate prompts');
      score += 1;
    }

    if (prompt.split(/\s+/).filter(Boolean).length >= 5) {
      score += 1;
    } else {
      feedback.push('Prompt is too vague to be actionable');
    }

    return { score: Math.min(score, 10), maxScore: 10, feedback };
  }

  generateSuggestions(results) {
    const suggestions = [];

    for (const data of Object.values(results)) {
      if (data.score < 6) {
        suggestions.push(...data.feedback);
      }
    }

    return suggestions.slice(0, 5);
  }

  getGrade(score) {
    if (score >= 9) return { letter: 'A+', label: 'Excellent' };
    if (score >= 8) return { letter: 'A', label: 'Great' };
    if (score >= 7) return { letter: 'B+', label: 'Good' };
    if (score >= 6) return { letter: 'B', label: 'Above Average' };
    if (score >= 5) return { letter: 'C', label: 'Average' };
    if (score >= 4) return { letter: 'D', label: 'Below Average' };
    return { letter: 'F', label: 'Needs Significant Improvement' };
  }

  async evaluateWithAI(prompt) {
    if (!process.env.OPENAI_API_KEY) {
      return this.evaluateBasic(prompt);
    }

    try {
      const response = await openai.createChatCompletion({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are a prompt engineering expert. Evaluate the given prompt on these criteria (score 1-10 each):\n1. Clarity - Is it clear and unambiguous?\n2. Specificity - Is it specific and detailed?\n3. Context - Does it provide sufficient context?\n4. Structure - Is it well-organized?\n5. Actionability - Can an AI effectively act on it?\n\nRespond in JSON format:\n{\n  "scores": { "clarity": X, "specificity": X, "context": X, "structure": X, "actionability": X },\n  "overallScore": X,\n  "strengths": ["..."],\n  "weaknesses": ["..."],\n  "improvedVersion": "...",\n  "suggestions": ["..."]\n}`
          },
          {
            role: 'user',
            content: `Evaluate this prompt: "${prompt}"`
          }
        ],
        temperature: 0.3
      });

      const content = response.data.choices[0].message.content;
      return JSON.parse(content);
    } catch (error) {
      console.error('AI Evaluation error:', error);
      return this.evaluateBasic(prompt);
    }
  }
}

module.exports = new PromptEvaluator();
