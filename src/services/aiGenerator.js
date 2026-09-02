// High-Quality, Sensible 100% AI Question Generator with Strict Age Calibration (Ages 2 to 14)
// Guarantees logical consistency, exact age-appropriate difficulty, diagram synchronization, and multi-model fallbacks

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

// Current supported models in Google AI Studio
const GEMINI_MODELS = [
  'gemini-3.5-flash-lite',
  'gemini-3.5-flash',
  'gemini-3-flash-preview',
  'gemini-2.5-flash'
];

/**
 * Universal Gemini API Caller with automatic multi-model fallback
 */
async function callGeminiApi(payload, apiKey) {
  if (!apiKey) {
    throw new Error('MISSING_API_KEY');
  }

  let lastError = null;

  for (const model of GEMINI_MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(
        apiKey
      )}`;

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        return data;
      }

      const errText = await res.text();
      let parsedErr = null;
      try {
        parsedErr = JSON.parse(errText);
      } catch {}

      const errMsg = parsedErr?.error?.message || errText;
      lastError = new Error(`Model ${model} (${res.status}): ${errMsg}`);
      console.warn(`[Gemini API] ${model} returned HTTP ${res.status}, trying fallback model...`);

      // If it's an explicit key error (400 invalid key / 403 forbidden), stop trying other models
      if (
        res.status === 400 &&
        (errMsg.toLowerCase().includes('api_key') ||
          errMsg.toLowerCase().includes('key not valid') ||
          errMsg.toLowerCase().includes('invalid api key') ||
          errMsg.toLowerCase().includes('api key expired'))
      ) {
        throw new Error('Invalid Gemini API Key. Please verify your key from Google AI Studio.');
      }
      if (res.status === 403) {
        throw new Error('Gemini API key access forbidden. Ensure Generative Language API is enabled.');
      }
    } catch (err) {
      if (
        err.message.includes('Invalid Gemini API Key') ||
        err.message.includes('access forbidden')
      ) {
        throw err;
      }
      lastError = err;
    }
  }

  throw lastError || new Error('All Gemini API model endpoints failed.');
}

/**
 * Validates a Gemini API key by making a lightweight test ping
 * Returns { valid: true, cleanedKey } or { valid: false, message }
 */
export async function validateGeminiApiKey(apiKey) {
  if (!apiKey || typeof apiKey !== 'string' || !apiKey.trim()) {
    return { valid: false, message: 'Please enter your Google Gemini API Key! 🔑' };
  }

  const cleanedKey = apiKey.replace(/^["']|["']$/g, '').trim();

  if (cleanedKey.length < 15) {
    return {
      valid: false,
      message: 'Invalid API Key length. Please paste a valid key from Google AI Studio.'
    };
  }

  try {
    const payload = {
      contents: [{ parts: [{ text: 'Hello' }] }],
      generationConfig: { maxOutputTokens: 10 }
    };

    await callGeminiApi(payload, cleanedKey);
    return { valid: true, cleanedKey };
  } catch (err) {
    console.error('API Key validation error:', err);
    return {
      valid: false,
      message:
        err.message ||
        'API key validation failed. Please check and re-enter your key from Google AI Studio.'
    };
  }
}

/**
 * Ensures diagram data mathematically and visually matches the correct answer
 */
function synchronizeDiagramData(diagramType, rawData = {}, questionText = '', correctText = '') {
  const data = { ...rawData };
  const numMatch = String(correctText).match(/\d+/) || String(questionText).match(/\d+/);
  const parsedNum = numMatch ? parseInt(numMatch[0], 10) : null;

  if (diagramType === 'apple-counting') {
    const count = parsedNum && parsedNum > 0 && parsedNum <= 25 ? parsedNum : (Number(data.count) || 4);
    data.count = count;
    const emojiMatch = questionText.match(/[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u);
    data.emoji = data.emoji || (emojiMatch ? emojiMatch[0] : '🍎');
  } else if (diagramType === 'pattern-shapes') {
    if (!data.sequence || !Array.isArray(data.sequence) || data.sequence.length < 3) {
      data.sequence = ['🍎', '🍌', '🍎', '🍌'];
    }
    data.nextItem = data.nextItem || correctText.trim() || data.sequence[0];
  } else if (diagramType === 'grid-tiles') {
    const count = parsedNum && parsedNum > 0 ? parsedNum : (data.count || 4);
    data.count = count;
    data.holeW = count <= 4 ? count : Math.min(4, Math.ceil(Math.sqrt(count)));
    data.holeH = Math.ceil(count / data.holeW);
    data.rows = Math.max(5, data.holeH + 2);
    data.cols = Math.max(5, data.holeW + 2);
    data.holeRow = 1;
    data.holeCol = 1;
  } else if (diagramType === 'block-tower') {
    const total = parsedNum && parsedNum > 0 ? parsedNum : 6;
    if (total <= 4) {
      data.bottom = 2; data.middle = 1; data.top = 0;
    } else if (total <= 7) {
      data.bottom = 3; data.middle = 2; data.top = Math.max(1, total - 5);
    } else {
      data.bottom = 4; data.middle = 3; data.top = Math.max(1, total - 7);
    }
  }

  return data;
}

// Helper to shuffle options and format question object
function shuffleAndFormatOptions(questionObj, selectedSkill) {
  if (!questionObj) return null;

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

  while (optionTexts.length < 4) {
    optionTexts.push(`Choice ${optionTexts.length + 1}`);
  }

  const uniqueTexts = Array.from(new Set(optionTexts.map((t) => String(t).trim())));
  while (uniqueTexts.length < 4) {
    uniqueTexts.push(`Choice ${uniqueTexts.length + 1}`);
  }

  const shuffledTexts = uniqueTexts.slice(0, 4).sort(() => Math.random() - 0.5);
  const letters = ['A', 'B', 'C', 'D'];

  const newOptions = shuffledTexts.map((text, idx) => ({
    id: letters[idx],
    text: String(text)
  }));

  const correctIdx = shuffledTexts.indexOf(String(correctText).trim());
  const newCorrectId = letters[correctIdx >= 0 ? correctIdx : 0];

  const qText = questionObj.question || questionObj.q || 'Look at the question and choose the best answer:';
  const diagramType = questionObj.diagramType || questionObj.dt || (selectedSkill === 'Visual' ? 'pattern-shapes' : null);
  const rawDiagramData = questionObj.diagramData || questionObj.dd || {};
  const synchedData = diagramType ? synchronizeDiagramData(diagramType, rawDiagramData, qText, correctText) : {};

  return {
    id: questionObj.id || `ai_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    category: selectedSkill,
    categoryDescription:
      selectedSkill === 'Visual'
        ? 'Pattern Completion, Counting & Spatial Recognition'
        : 'Logical Deduction, Analogies & Critical Thinking',
    questionText: qText,
    diagramType,
    diagramData: synchedData,
    solutionDiagramType: diagramType,
    solutionDiagramData: synchedData,
    options: newOptions,
    correctAnswerId: newCorrectId,
    correctAnswerText: String(correctText),
    solutionText:
      questionObj.solution ||
      questionObj.solutionText ||
      `The correct answer is ${correctText}.`,
    hint:
      questionObj.hint ||
      'Carefully observe the clues and patterns before selecting an answer.'
  };
}

/**
 * Resilient JSON Parser for Gemini API responses
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
    if (parsed && typeof parsed === 'object') {
      for (const key of Object.keys(parsed)) {
        if (Array.isArray(parsed[key]) && parsed[key].length > 0) {
          return parsed[key];
        }
      }
    }
  } catch (err) {
    try {
      const match = cleaned.match(/\[\s*\{[\s\S]*\}\s*\]/);
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
 * Generates age-specific pedagogy rules, teacher personas, and relevant examples
 */
function getAgeSpecificPedagogy(age, selectedSkill) {
  const numAge = parseInt(age, 10) || 5;

  if (numAge <= 4) {
    return {
      persona: `preschool and early childhood educator creating simple, colorful, engaging challenges for a ${numAge}-year-old toddler`,
      guidelines: `
- Keep questions super short, simple, and visual with familiar animals, fruits, and shapes.
- For Visual: simple counting (1-5 objects), AB color patterns (🔴 🔵 🔴 🔵).
- For Analytical: Animal babies (Puppy to Dog, Kitten to Cat), basic sounds, color matching.`,
      examples: selectedSkill === 'Visual'
        ? `Example: "How many red apples 🍎 are in the basket?" -> "diagramType": "apple-counting", "diagramData": {"count": 3, "emoji": "🍎"}, "correctAnswer": "3 apples"`
        : `Example: "Puppy 🐶 is to Dog 🐕, as Kitten 🐱 is to...?" -> "correctAnswer": "Cat 🐈"`
    };
  }

  if (numAge <= 7) {
    return {
      persona: `elementary educator creating fun, logical puzzles for a ${numAge}-year-old early elementary student`,
      guidelines: `
- Use kindergarten/early grade-school vocabulary, addition within 1-12, AAB/ABC repeating patterns.
- For Visual: Counting 4-12 objects, grid tile gaps, balance scales.
- For Analytical: Functional analogies (Bird : Nest :: Bee : Hive), everyday cause-and-effect (sun melts ice, rain grows plants), odd-one-out categories.`,
      examples: selectedSkill === 'Visual'
        ? `Example: "Complete the pattern: 🔴 🔴 🔷 🔴 🔴 ?" -> "diagramType": "pattern-shapes", "diagramData": {"sequence": ["🔴", "🔴", "🔷", "🔴", "🔴"], "nextItem": "🔷"}, "correctAnswer": "🔷"`
        : `Example: "If you leave an ice cube 🧊 in the warm sun ☀️, what happens?" -> "correctAnswer": "It melts into water 💧"`
    };
  }

  if (numAge <= 10) {
    return {
      persona: `upper elementary logic and STEM instructor creating thought-provoking puzzles for a ${numAge}-year-old student (Grades 3-5)`,
      guidelines: `
- DO NOT generate baby/preschool counting questions!
- Use multi-step reasoning, geometric & number sequences (e.g. 4, 8, 12, 16, ? or 3, 6, 12, 24, ?), 3D block projections, grid matrices.
- For Analytical: Higher-order analogies (Author : Novel :: Sculptor : Statue, Thermometer : Temperature :: Speedometer : Speed), scientific classification (Carnivore/Herbivore/Omnivore, States of matter, simple machines), multi-step deductive clues.`,
      examples: selectedSkill === 'Visual'
        ? `Example: "Look at the number sequence: 5, 10, 20, 40, ? What comes next?" -> "correctAnswer": "80", "options": ["60", "70", "80", "90"]`
        : `Example: "Author is to Book, as Architect is to...?" -> "correctAnswer": "Building", "options": ["Painting", "Building", "Song", "Meal"]`
    };
  }

  // Ages 11-14 (Middle School / Teen)
  return {
    persona: `middle school logic, mathematics, and advanced STEM educator creating challenging analytical puzzles for a ${numAge}-year-old teenager (Grades 6-9)`,
    guidelines: `
- STRICTLY FORBIDDEN: Do NOT give young kid questions (NO simple apple counting, NO baby animal pairings like puppy-dog!).
- For Visual: Challenging numerical sequences (e.g. 2, 5, 10, 17, 26, ? or Fibonacci), geometric matrix transformations, spatial rotations, isometric block tower volumes, coordinate reflections.
- For Analytical: Advanced abstract analogies (Microscope : Microorganism :: Telescope : Distant Galaxy, Catalyst : Chemical Reaction :: Mentor : Personal Growth), deductive syllogisms, physics principles (density, balance levers, electric circuits, refraction), critical thinking puzzles.`,
    examples: selectedSkill === 'Visual'
      ? `Example: "Identify the pattern rule in the sequence: 2, 5, 10, 17, 26, ? What is the next term?" -> "correctAnswer": "37", "options": ["35", "37", "39", "41"], "solution": "The difference between terms increases by consecutive odd numbers (+3, +5, +7, +9, +11). 26 + 11 = 37."`
      : `Example: "Microscope is to Microorganism, as Telescope is to...?" -> "correctAnswer": "Distant Galaxy", "options": ["Subatomic Particle", "Distant Galaxy", "Microscopic Cell", "Sound Wave"], "solution": "A microscope is an instrument used to observe microscopic organisms, just as a telescope is used to observe distant galaxies."`
  };
}

/**
 * Fetch a high-quality batch with age-calibrated pedagogy rules
 */
async function fetchBatch(selectedSkill, count, kidAge, batchId, apiKey) {
  const isVisual = selectedSkill === 'Visual';
  const pedagogy = getAgeSpecificPedagogy(kidAge, selectedSkill);

  const prompt = `You are an expert ${pedagogy.persona} (Batch ${batchId}).
Generate ${count} engaging, non-repeating questions STRICTLY CALIBRATED FOR A ${kidAge}-YEAR-OLD.

AGE PEDAGOGY GUIDELINES (Age ${kidAge}):
${pedagogy.guidelines}

${pedagogy.examples}

CRITICAL RULES:
1. The complexity, vocabulary, and concepts MUST match the cognitive level of a ${kidAge}-year-old.
2. Every question must have 4 clear, plausible multiple-choice options with exactly 1 correct answer.
3. For ${kidAge >= 11 ? 'Teenagers (Age 11-14)' : `${kidAge}-year-olds`}, ensure the questions are genuinely engaging, mature, and intellectually stimulating.

Output a valid JSON Array of ${count} items. Format:
[
  {
    "question": "Age-appropriate question text",
    "diagramType": ${isVisual ? (kidAge >= 8 ? '"block-tower"' : '"apple-counting"') : 'null'},
    "diagramData": ${isVisual ? (kidAge >= 8 ? '{"count": 6}' : '{"count": 4, "emoji": "🍎"}') : '{}'},
    "options": ["Choice 1", "Choice 2", "Choice 3", "Choice 4"],
    "correctAnswer": "Choice 1",
    "solution": "1-2 sentences explaining why this is the correct logical answer.",
    "hint": "1 helpful clue that guides the thinking process."
  }
]
Return ONLY the valid JSON array without any markdown preamble.`;

  const bodyPayload = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.7,
      maxOutputTokens: 8192
    }
  };

  const data = await callGeminiApi(bodyPayload, apiKey);
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
  const parsed = parseGeminiJsonResponse(rawText);

  if (Array.isArray(parsed) && parsed.length > 0) {
    return parsed;
  }

  console.warn('[Gemini API] Failed to parse JSON response batch:', rawText);
  return [];
}

/**
 * Generate 10 sensible, high-quality AI questions in parallel calibrated to kidAge
 */
export async function generateAIQuestions(selectedSkill = 'Visual', sheetNumber = 1, kidAge = 5) {
  const apiKey = getStoredApiKey();

  if (!apiKey) {
    throw new Error('MISSING_API_KEY');
  }

  let parallelError = null;

  try {
    const [batch1, batch2] = await Promise.all([
      fetchBatch(selectedSkill, 5, kidAge, 1, apiKey),
      fetchBatch(selectedSkill, 5, kidAge, 2, apiKey)
    ]);

    const combined = [...batch1, ...batch2];

    if (combined.length >= 6) {
      return combined.slice(0, 10).map((q, idx) => {
        const formatted = shuffleAndFormatOptions(q, selectedSkill);
        return {
          ...formatted,
          id: `ai_${kidAge}yo_${Date.now()}_${idx}_${Math.random().toString(36).substr(2, 4)}`
        };
      });
    }
  } catch (err) {
    parallelError = err;
    console.warn('Parallel batch issue, falling back to single batch:', err.message);
  }

  // Fallback single batch of 10
  try {
    const singleBatch = await fetchBatch(selectedSkill, 10, kidAge, 1, apiKey);
    if (singleBatch.length >= 6) {
      return singleBatch.slice(0, 10).map((q, idx) => {
        const formatted = shuffleAndFormatOptions(q, selectedSkill);
        return {
          ...formatted,
          id: `ai_${kidAge}yo_${Date.now()}_${idx}_${Math.random().toString(36).substr(2, 4)}`
        };
      });
    }
  } catch (err) {
    console.error('Single batch fallback failed:', err);
    throw err;
  }

  throw (
    parallelError ||
    new Error('API_ERROR: Unable to generate questions from Gemini API. Please check your key.')
  );
}
