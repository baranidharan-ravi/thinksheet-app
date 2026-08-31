// Ultra-Fast 100% AI Question Generator for Kids
// Uses gemini-3.5-flash-lite with parallel batching and compact token schema for maximum speed

const AI_KEY_STORAGE = 'thinksheet_gemini_api_key';

export function getStoredApiKey() {
  let key =
    localStorage.getItem(AI_KEY_STORAGE) ||
    import.meta.env.VITE_GEMINI_API_KEY ||
    '';

  if (typeof key === 'string') {
    key = key.replace(/^["']|["']$/g, '').trim();
  }
  return key;
}

export function setStoredApiKey(key) {
  if (key) {
    const cleaned = key.replace(/^["']|["']$/g, '').trim();
    localStorage.setItem(AI_KEY_STORAGE, cleaned);
  } else {
    localStorage.removeItem(AI_KEY_STORAGE);
  }
}

// Helper to shuffle options and re-assign letters A, B, C, D
function shuffleAndFormatOptions(questionObj) {
  if (!questionObj) return questionObj;

  let optionTexts = [];
  let correctText = '';

  if (Array.isArray(questionObj.options)) {
    if (typeof questionObj.options[0] === 'string') {
      optionTexts = [...questionObj.options];
      correctText = questionObj.correctAnswer || questionObj.correctAnswerId || optionTexts[0];
    } else if (typeof questionObj.options[0] === 'object') {
      optionTexts = questionObj.options.map((opt) => opt.text || opt.label || String(opt));
      const found = questionObj.options.find(
        (opt) => opt.id === questionObj.correctAnswerId || opt.text === questionObj.correctAnswer
      );
      correctText = found ? (found.text || found.id) : (questionObj.correctAnswer || optionTexts[0]);
    }
  }

  if (optionTexts.length < 2) {
    optionTexts = ['Option 1', 'Option 2', 'Option 3', 'Option 4'];
    correctText = optionTexts[0];
  }

  // Ensure at least 4 options
  while (optionTexts.length < 4) {
    optionTexts.push(`Choice ${optionTexts.length + 1}`);
  }

  const shuffledTexts = [...optionTexts.slice(0, 4)].sort(() => Math.random() - 0.5);
  const letters = ['A', 'B', 'C', 'D'];

  const newOptions = shuffledTexts.map((text, idx) => ({
    id: letters[idx],
    text: String(text)
  }));

  const correctIdx = shuffledTexts.indexOf(correctText);
  const newCorrectId = letters[correctIdx >= 0 ? correctIdx : 0];

  return {
    id: questionObj.id || `ai_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    category: questionObj.category || 'Visual',
    categoryDescription:
      questionObj.category === 'Visual'
        ? 'Develop your ability to analyze and spot visual information'
        : 'Develop your ability to plan and breakdown information to solve problems',
    question: questionObj.question || questionObj.q || 'Look at the picture. What is the correct answer?',
    promptAudio: questionObj.promptAudio || questionObj.question || questionObj.q || 'What is the answer?',
    diagramType: questionObj.diagramType || questionObj.dt || null,
    diagramData: questionObj.diagramData || questionObj.dd || {},
    options: newOptions,
    correctAnswerId: newCorrectId,
    solutionText: questionObj.solutionText || questionObj.solution || questionObj.sol || 'Great thinking! That is the correct answer.',
    solutionDiagramType: questionObj.diagramType || questionObj.dt || null,
    solutionDiagramData: questionObj.diagramData || questionObj.dd || {},
    hint: questionObj.hint || 'Take a close look and think step by step.',
    isAIGenerated: true
  };
}

/**
 * Clean and parse raw Gemini text output into a valid JSON array
 */
function parseGeminiJsonResponse(rawText) {
  if (!rawText) return null;
  let cleaned = rawText.trim();

  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim();
  }

  try {
    const parsed = JSON.parse(cleaned);
    if (Array.isArray(parsed)) return parsed;
    if (parsed && Array.isArray(parsed.questions)) return parsed.questions;
  } catch (err) {
    try {
      const match = cleaned.match(/\[\s*\{.*\}\s*\]/s);
      if (match) {
        return JSON.parse(match[0]);
      }
    } catch {
      return null;
    }
  }
  return null;
}

/**
 * Fast single batch fetcher using gemini-3.5-flash-lite
 */
async function fetchBatch(selectedSkill, count, kidAge, batchId, apiKey) {
  const isVisual = selectedSkill === 'Visual';

  const prompt = `Create ${count} fun ${selectedSkill} puzzles for a ${kidAge}-year-old child (Batch ${batchId}).
Age rule: Strictly for age ${kidAge}. Use simple words and playful emojis.
${
  isVisual
    ? 'Visual spatial puzzles (grid-tiles, pattern-shapes, apple-counting, scale-balance, block-tower).'
    : 'Analytical picture analogies (e.g. Puppy:Dog::Kitten:Cat), odd-one-out categories, simple cause-effect.'
}
JSON Array format:
[{"question":"...","diagramType":${isVisual ? '"pattern-shapes"' : 'null'},"diagramData":{},"options":["A","B","C","D"],"correctAnswer":"A","solution":"...","hint":"..."}]
Return ONLY valid JSON array.`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${encodeURIComponent(
    apiKey
  )}`;

  const bodyPayload = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.6,
      maxOutputTokens: 1024
    }
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bodyPayload)
  });

  if (!res.ok) {
    const errData = await res.text();
    throw new Error(`Status ${res.status}: ${errData}`);
  }

  const data = await res.json();
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
  const parsed = parseGeminiJsonResponse(rawText);

  if (Array.isArray(parsed) && parsed.length > 0) {
    return parsed.map((item) => ({ ...item, category: selectedSkill }));
  }

  return [];
}

/**
 * Generate 10 AI-Powered questions with ultra-fast parallel batch execution
 * @param {'Visual' | 'Analytical Thinking'} selectedSkill
 * @param {number} sheetNumber
 * @param {number} kidAge (e.g. 3, 4, 5, 6, 7, 8)
 */
export async function generateAIQuestions(selectedSkill = 'Visual', sheetNumber = 1, kidAge = 5) {
  const apiKey = getStoredApiKey();

  if (!apiKey) {
    throw new Error('MISSING_API_KEY');
  }

  try {
    // Run 2 small batches of 5 items concurrently in parallel for 2.5x speed
    const [batch1, batch2] = await Promise.all([
      fetchBatch(selectedSkill, 5, kidAge, 1, apiKey),
      fetchBatch(selectedSkill, 5, kidAge, 2, apiKey)
    ]);

    const combined = [...batch1, ...batch2];

    if (combined.length >= 6) {
      return combined.slice(0, 10).map((q, idx) => {
        const formatted = shuffleAndFormatOptions(q);
        return {
          ...formatted,
          id: `ai_${kidAge}yo_${Date.now()}_${idx}_${Math.random().toString(36).substr(2, 4)}`,
          category: selectedSkill
        };
      });
    }
  } catch (err) {
    console.warn('Parallel batch encountered issue, falling back to single batch:', err.message);
  }

  // Fallback: single batch of 10 if parallel fetch had an issue
  const singleBatch = await fetchBatch(selectedSkill, 10, kidAge, 1, apiKey);
  if (singleBatch.length >= 6) {
    return singleBatch.slice(0, 10).map((q, idx) => {
      const formatted = shuffleAndFormatOptions(q);
      return {
        ...formatted,
        id: `ai_${kidAge}yo_${Date.now()}_${idx}_${Math.random().toString(36).substr(2, 4)}`,
        category: selectedSkill
      };
    });
  }

  throw new Error('API_ERROR: Unable to generate questions from Gemini API');
}
