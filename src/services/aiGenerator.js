// Browser-Native AI Question Generator with Strict Age Calibration
// Uses direct Gemini REST API calls with multi-model fallback and JSON parsing

const AI_KEY_STORAGE = 'thinksheet_gemini_api_key';

export function getStoredApiKey() {
  let key =
    localStorage.getItem(AI_KEY_STORAGE) ||
    import.meta.env.VITE_GEMINI_API_KEY ||
    '';

  // Clean key of any accidental quotes or whitespace
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

  // Find the text of the correct option
  const correctOption = questionObj.options.find(
    (opt) => opt.id === questionObj.correctAnswerId
  ) || questionObj.options[0];
  const correctText = correctOption ? correctOption.text : '';

  // Shuffle option texts
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

  // Strip ```json ... ``` markdown code fences if present
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim();
  }

  try {
    const parsed = JSON.parse(cleaned);
    if (Array.isArray(parsed)) return parsed;
    if (parsed && Array.isArray(parsed.questions)) return parsed.questions;
  } catch (err) {
    console.warn('Could not parse JSON directly, attempting regex extraction...', err);
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
 * Generate 10 AI-Powered questions strictly customized for the child's exact age
 * using Google Gemini REST API with robust multi-model fallback
 * @param {'Visual' | 'Analytical Thinking'} selectedSkill
 * @param {number} sheetNumber
 * @param {number} kidAge (e.g. 3, 4, 5, 6, 7, 8)
 */
export async function generateAIQuestions(selectedSkill = 'Visual', sheetNumber = 1, kidAge = 5) {
  const apiKey = getStoredApiKey();

  if (!apiKey) {
    // Fallback to procedural/internet generator if key is not configured
    return null;
  }

  const prompt = `
Role: You are an expert child psychologist and early-childhood educator designing a fun Thinksheet for a ${kidAge}-YEAR-OLD CHILD.

Topic: "${selectedSkill}".
Sheet: #${sheetNumber}.
Target Age: ${kidAge} YEARS OLD.

STRICT AGE RULES FOR A ${kidAge}-YEAR-OLD LEARNER:
- The questions MUST be strictly tailored for a ${kidAge}-year-old child.
- DO NOT generate any questions or vocabulary that are above ${kidAge} years old.
- No abstract mathematics, no complex word problems, no adult concepts.
- Everything must be intuitive, joyful, and visually clear with emojis.

If child is 3-4 years old:
- Keep questions super simple: animal sounds, basic colors/shapes (Circle, Star), basic opposites (Big/Small, Hot/Cold), counting 1 to 5.

If child is 5 years old:
- Standard kindergarten reasoning: CogAT picture analogies (Puppy:Dog :: Kitten:Cat, Ear:Headphones :: Eye:Glasses), odd-one-out categories, cause-and-effect (melting ice, seed growing), counting up to 9.

If child is 6-8 years old:
- Early elementary reasoning: habitat logic, tool functions, simple sequences, 3D block pyramids, mirror symmetry.

QUESTION SPECIFICATIONS FOR TOPIC "${selectedSkill}":

If Topic is "Analytical Thinking":
- 10 simple analogies, odd-one-out classification, and everyday logic suitable for a ${kidAge}-year-old.

If Topic is "Visual":
- 10 visual spatial puzzles (grid-tiles, pattern-shapes, apple-counting, scale-balance, block-tower, paper-cut, butterfly-symmetry, rocket-maze) sized appropriately for age ${kidAge}.

JSON RESPONSE SPECIFICATION:
Return a JSON Array of exactly 10 question objects:
[
  {
    "id": "q1",
    "category": "${selectedSkill}",
    "categoryDescription": "${
      selectedSkill === 'Visual'
        ? 'Develop your ability to analyze and/or spot visual information in order to solve a problem'
        : 'Develop your ability to plan and breakdown information in order to analyze and solve complex problems'
    }",
    "question": "Short question text with friendly emojis (strictly suitable for ${kidAge}-year-old)",
    "promptAudio": "Simple voice read-aloud sentence for the ${kidAge}-year-old child",
    "diagramType": ${selectedSkill === 'Visual' ? '"pattern-shapes"' : 'null'},
    "diagramData": {},
    "options": [
      { "id": "A", "text": "Option 1 (with emoji)" },
      { "id": "B", "text": "Option 2 (with emoji)" },
      { "id": "C", "text": "Option 3 (with emoji)" },
      { "id": "D", "text": "Option 4 (with emoji)" }
    ],
    "correctAnswerId": "A",
    "solutionText": "1 joyful, encouraging sentence explaining the answer to a ${kidAge}-year-old kid.",
    "solutionDiagramType": ${selectedSkill === 'Visual' ? '"pattern-shapes"' : 'null'},
    "solutionDiagramData": {},
    "hint": "1 simple, friendly clue."
  }
]

IMPORTANT: Output ONLY the valid JSON array.
`;

  // Models to try in order of capability
  const models = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];

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
          temperature: 0.7
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
        console.warn(`Gemini API returned status ${res.status} for model ${modelName}:`, errData);
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
      console.warn(`Network/fetch error for model ${modelName}:`, err);
    }
  }

  return null;
}
