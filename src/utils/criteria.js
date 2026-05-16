const EVALUATION_CRITERIA = {
  clarity: {
    weight: 0.2,
    description: 'How clear and unambiguous is the prompt?',
    checks: [
      { name: 'no_ambiguity', description: 'Prompt avoids ambiguous terms' },
      { name: 'clear_intent', description: 'The intent is easily understood' },
      { name: 'proper_grammar', description: 'Uses proper grammar and punctuation' }
    ]
  },
  specificity: {
    weight: 0.25,
    description: 'How specific and detailed is the prompt?',
    checks: [
      { name: 'detailed_requirements', description: 'Includes specific requirements' },
      { name: 'defined_scope', description: 'Has a well-defined scope' },
      { name: 'measurable_output', description: 'Describes expected output format' }
    ]
  },
  context: {
    weight: 0.2,
    description: 'Does the prompt provide sufficient context?',
    checks: [
      { name: 'background_info', description: 'Provides necessary background' },
      { name: 'audience_defined', description: 'Target audience is clear' },
      { name: 'constraints_stated', description: 'Constraints are explicitly stated' }
    ]
  },
  structure: {
    weight: 0.15,
    description: 'Is the prompt well-structured?',
    checks: [
      { name: 'logical_flow', description: 'Ideas flow logically' },
      { name: 'organized', description: 'Well-organized with sections if needed' },
      { name: 'appropriate_length', description: 'Neither too short nor too long' }
    ]
  },
  actionability: {
    weight: 0.2,
    description: 'Can the AI act on this prompt effectively?',
    checks: [
      { name: 'clear_task', description: 'Task is clearly defined' },
      { name: 'achievable', description: 'Request is achievable by AI' },
      { name: 'success_criteria', description: 'Success criteria are implied or stated' }
    ]
  }
};

module.exports = EVALUATION_CRITERIA;
