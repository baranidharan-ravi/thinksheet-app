// Blazing Fast 100% AI Question Generator for Kids
// Uses ultra-low latency gemini-3.5-flash-lite with concise prompting & memory prefetch

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
  if (!questionObj || !Array.isArray(questionObj.options) || questionObj.options.length === 0) {
    return questionObj;
  }

  const correctOption = questionObj.options.find(
    (opt) => opt.id === questionObj.correctAnswerId
  ) || questionObj.options[0];
  const correctText = correctOption ? correctOption.text : '';

  const allTexts = questionObj.options.map((opt) => opt.text);
  const shuffledTexts = [...allTexts].sort(() => Math.random() - 0.5);

  const letters = ['A', 'B', 'C', 'D'];
  const newOptions = shuffledTexts.slice(0, 4).map((text, idx) => ({
    id: letters[idx],
    text
  }));

  const newCorrectIdx = shuffledTexts.indexOf(correctText);
  const newCorrectId = letters[newCorrectIdx >= 0 ? newCorrectIdx : 0];

  return {
    ...questionObj,
    options: newOptions,
    correctAnswerId: newCorrectId
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
 * Generate 10 AI-Powered questions with ultra-low latency
 * Uses gemini-3.5-flash-lite as first priority for fastest response speed
 */
export async function generateAIQuestions(selectedSkill = 'Visual', sheetNumber = 1, kidAge = 5) {
  const apiKey = getStoredApiKey();

  if (!apiKey) {
    throw new Error('MISSING_API_KEY');
  }

  // Ultra-compact, high-speed prompt
  const prompt = `
Create 10 fun ${selectedSkill} questions for a ${kidAge}-year-old child (Sheet #${sheetNumber}).
Age rule: Strictly for age ${kidAge}. Use simple words and playful emojis.

${
  selectedSkill === 'Visual'
    ? 'Include spatial puzzles: grid-tiles, pattern-shapes, apple-counting, scale-balance, block-tower, butterfly-symmetry.'
    : 'Include picture analogies (e.g. Puppy:Dog::Kitten:Cat), odd-one-out categories, and simple cause-effect.'
}

Output JSON Array of 10 items.
Format:
[
  {
    "id": "q1",
    "category": "${selectedSkill}",
    "categoryDescription": "${
      selectedSkill === 'Visual'
        ? 'Develop your ability to spot visual information'
        : 'Develop your ability to analyze and solve problems'
    }",
    "question": "Short question text with emoji",
    "promptAudio": "Voice read-aloud prompt",
    "diagramType": ${selectedSkill === 'Visual' ? '"pattern-shapes"' : 'null'},
    "diagramData": {},
    "options": [
      { "id": "A", "text": "Option 1" },
      { "id": "B", "text": "Option 2" },
      { "id": "C", "text": "Option 3" },
      { "id": "D", "text": "Option 4" }
    ],
    "correctAnswerId": "A",
    "solutionText": "Simple 1-sentence explanation for a ${kidAge}yo child.",
    "solutionDiagramType": ${selectedSkill === 'Visual' ? '"pattern-shapes"' : 'null'},
    "solutionDiagramData": {},
    "hint": "1 friendly clue."
  }
]
Return ONLY the JSON array.`;

  // Fastest models listed first for maximum speed
  const models = ['gemini-3.5-flash-lite', 'gemini-3.6-flash', 'gemini-3.7-flash'];
  let lastErrorText = '';

  for (const modelName of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${encodeURIComponent(
        apiKey
      )}`;

      const bodyPayload = {
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.6,
          maxOutputTokens: 2048
        }
      };

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bodyPayload)
      });

      if (!res.ok) {
        const errData = await res.text();
        lastErrorText = `Status ${res.status}: ${errData}`;
        continue;
      }

      const data = await res.json();
      const rawText =
        data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

      const parsed = parseGeminiJsonResponse(rawText);
      if (Array.isArray(parsed) && parsed.length >= 6) {
        return parsed.slice(0, 10).map((q, idx) => {
          const formatted = shuffleAndFormatOptions(q);
          return {
            ...formatted,
            id: `ai_${kidAge}yo_${Date.now()}_${idx}_${Math.random().toString(36).substr(2, 4)}`,
            category: selectedSkill,
            isAIGenerated: true
          };
        });
      }
    } catch (err) {
      lastErrorText = err.message || 'Network error';
    }
  }

  throw new Error(`API_ERROR: ${lastErrorText || 'Failed to generate questions from Gemini API'}`);
}
