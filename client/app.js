document.addEventListener('DOMContentLoaded', () => {
  const promptInput = document.getElementById('prompt-input');
  const evaluateBtn = document.getElementById('evaluate-btn');
  const evaluateAiBtn = document.getElementById('evaluate-ai-btn');
  const clearBtn = document.getElementById('clear-btn');
  const charCounter = document.getElementById('char-counter');
  const resultsSection = document.getElementById('results-section');

  promptInput.addEventListener('input', () => {
    charCounter.textContent = promptInput.value.length;
  });

  evaluateBtn.addEventListener('click', async () => {
    const prompt = promptInput.value.trim();
    if (!prompt) {
      alert('Please enter a prompt to evaluate');
      return;
    }

    evaluateBtn.disabled = true;
    evaluateBtn.textContent = '⏳ Evaluating...';

    try {
      const response = await fetch('/api/evaluate/basic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });

      const data = await response.json();
      if (data.success) {
        displayResults(data.evaluation);
      } else {
        alert(data.error || 'Evaluation failed');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to connect to server');
    } finally {
      evaluateBtn.disabled = false;
      evaluateBtn.textContent = '📊 Evaluate Prompt';
    }
  });

  evaluateAiBtn.addEventListener('click', async () => {
    const prompt = promptInput.value.trim();
    if (!prompt) {
      alert('Please enter a prompt to evaluate');
      return;
    }

    evaluateAiBtn.disabled = true;
    evaluateAiBtn.textContent = '⏳ AI Analyzing...';

    try {
      const response = await fetch('/api/evaluate/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });

      const data = await response.json();
      if (data.success) {
        displayResults(data.evaluation);
      } else {
        alert(data.error || 'AI evaluation not available. Try basic evaluation.');
      }
    } catch (error) {
      console.error('AI evaluation failed:', error);
      alert('AI evaluation failed. Try basic evaluation instead.');
    } finally {
      evaluateAiBtn.disabled = false;
      evaluateAiBtn.textContent = '🤖 AI Evaluation';
    }
  });

  clearBtn.addEventListener('click', () => {
    promptInput.value = '';
    charCounter.textContent = '0';
    resultsSection.classList.add('hidden');
  });

  document.querySelectorAll('.example-card').forEach(card => {
    card.addEventListener('click', () => {
      const prompt = card.dataset.prompt;
      promptInput.value = prompt;
      charCounter.textContent = prompt.length;
      promptInput.focus();
    });
  });

  function displayResults(evaluation) {
    resultsSection.classList.remove('hidden');

    document.getElementById('overall-score').textContent = evaluation.overallScore.toFixed(1);
    const scoreCircle = document.querySelector('.score-circle');
    scoreCircle.style.setProperty('--score-percent', evaluation.percentage);

    document.getElementById('grade-letter').textContent = evaluation.grade.letter;
    document.getElementById('grade-label').textContent = evaluation.grade.label;

    const criteriaBars = document.getElementById('criteria-bars');
    criteriaBars.innerHTML = '';

    if (evaluation.criteria) {
      for (const [name, data] of Object.entries(evaluation.criteria)) {
        const percentage = (data.score / data.maxScore) * 100;
        const color = percentage >= 70 ? 'var(--success)' : percentage >= 40 ? 'var(--warning)' : 'var(--danger)';
        criteriaBars.innerHTML += `
          <div class="criteria-bar">
            <div class="criteria-bar-header">
              <span>${name.charAt(0).toUpperCase() + name.slice(1)}</span>
              <span>${data.score}/${data.maxScore}</span>
            </div>
            <div class="criteria-bar-track">
              <div class="criteria-bar-fill" style="width: ${percentage}%; background: ${color}"></div>
            </div>
          </div>
        `;
      }
    }

    const suggestionsList = document.getElementById('suggestions-list');
    suggestionsList.innerHTML = '';
    const suggestions = evaluation.suggestions || [];
    if (suggestions.length === 0) {
      suggestionsList.innerHTML = '<li style="border-left-color: var(--success)">✅ Great job! Your prompt looks well-crafted.</li>';
    } else {
      suggestions.forEach(suggestion => {
        suggestionsList.innerHTML += `<li>⚡ ${suggestion}</li>`;
      });
    }

    const feedbackDetails = document.getElementById('feedback-details');
    feedbackDetails.innerHTML = '';

    if (evaluation.criteria) {
      for (const [name, data] of Object.entries(evaluation.criteria)) {
        if (data.feedback && data.feedback.length > 0) {
          feedbackDetails.innerHTML += `
            <div style="margin-bottom: 1rem;">
              <strong>${name.charAt(0).toUpperCase() + name.slice(1)}:</strong>
              <ul style="margin-top: 0.5rem; padding-left: 1.5rem;">
                ${data.feedback.map(f => `<li style="color: var(--text-muted); margin-bottom: 0.25rem;">${f}</li>`).join('')}
              </ul>
            </div>
          `;
        }
      }
    }

    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
});
