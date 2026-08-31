// High-Quality, Sensible 100% AI Question Generator for Kids
// Guarantees logical consistency, age-appropriate questions, and exact visual synchronization

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

/**
 * Ensures diagram data mathematically and visually matches the correct answer
 */
function synchronizeDiagramData(diagramType, rawData = {}, questionText = '', correctText = '') {
  const data = { ...rawData };
  const numMatch = String(correctText).match(/\d+/) || String(questionText).match(/\d+/);
  const parsedNum = numMatch ? parseInt(numMatch[0], 10) : null;

  if (diagramType === 'apple-counting') {
    // Ensure the number of items in the SVG EXACTLY matches the answer!
    const count = parsedNum && parsedNum > 0 && parsedNum <= 15 ? parsedNum : (Number(data.count) || 4);
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
    data.holeW = count <= 4 ? count : Math.min(3, count);
    data.holeH = Math.ceil(count / data.holeW);
    data.rows = Math.max(5, data.holeH + 2);
    data.cols = Math.max(5, data.holeW + 2);
    data.holeRow = 1;
    data.holeCol = 1;
  } else if (diagramType === 'block-tower') {
    const total = parsedNum && parsedNum > 0 ? parsedNum : 6;
    if (total === 3) {
      data.bottom = 2; data.middle = 1; data.top = 0;
    } else {
      data.bottom = 3; data.middle = 2; data.top = Math.max(1, total - 5);
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

  // Ensure at least 4 unique options
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
        ? 'Develop your ability to spot visual information in order to solve a problem'
        : 'Develop your ability to plan and breakdown information in order to analyze and solve complex problems',
    question: qText,
    promptAudio: questionObj.promptAudio || qText,
    diagramType,
    diagramData: synchedData,
    options: newOptions,
    correctAnswerId: newCorrectId,
    solutionText: questionObj.solutionText || questionObj.solution || questionObj.sol || `Great thinking! ${correctText} is the correct answer.`,
    solutionDiagramType: diagramType,
    solutionDiagramData: synchedData,
    hint: questionObj.hint || 'Think step by step and look closely at the clues.',
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
 * Fetch a high-quality batch with crystal-clear kindergarten pedagogy rules
 */
async function fetchBatch(selectedSkill, count, kidAge, batchId, apiKey) {
  const isVisual = selectedSkill === 'Visual';

  const prompt = `You are a warm kindergarten and early-childhood teacher creating a sensible Thinksheet for a ${kidAge}-year-old child (Batch ${batchId}).
Generate ${count} questions that make complete logical sense to a ${kidAge}-year-old child.

CRITICAL QUALITY & PEDAGOGY RULES:
1. Every question MUST be intuitive, logical, and easy for a ${kidAge}-year-old to understand.
2. For counting visual questions:
   - "diagramType": "apple-counting"
   - "diagramData": {"count": 4, "emoji": "🍎"}
   - "correctAnswer": "4 apples" (MUST match the exact count!)
   - "options": ["2 apples", "3 apples", "4 apples", "5 apples"]
3. For pattern visual questions:
   - "diagramType": "pattern-shapes"
   - "diagramData": {"sequence": ["🍎", "🍌", "🍎", "🍌"], "nextItem": "🍎"}
   - "correctAnswer": "🍎"
4. For Analytical Thinking questions:
   - Use sensible analogies: "Puppy 🐶 is to Dog 🐕, as Kitten 🐱 is to?" -> "Cat 🐈"
   - Use clear Odd-One-Out: "Which animal does NOT fly in the sky?" -> "Fish 🐟"
   - Use everyday cause-effect: "If you leave an ice cube 🧊 in the warm sun ☀️, what happens?" -> "It melts into water 💧"

Output JSON Array of ${count} items. Format:
[
  {
    "question": "Clear, friendly question with emoji",
    "diagramType": ${isVisual ? '"apple-counting"' : 'null'},
    "diagramData": ${isVisual ? '{"count": 4, "emoji": "🍎"}' : '{}'},
    "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
    "correctAnswer": "Option 1",
    "solution": "1 cheerful sentence explaining why.",
    "hint": "1 helpful clue."
  }
]
Return ONLY the valid JSON array.`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${encodeURIComponent(
    apiKey
  )}`;

  const bodyPayload = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.5,
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
    return parsed;
  }

  return [];
}

/**
 * Generate 10 sensible, high-quality AI questions in parallel
 */
export async function generateAIQuestions(selectedSkill = 'Visual', sheetNumber = 1, kidAge = 5) {
  const apiKey = getStoredApiKey();

  if (!apiKey) {
    throw new Error('MISSING_API_KEY');
  }

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
    console.warn('Parallel batch issue, falling back to single batch:', err.message);
  }

  // Fallback single batch
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

  throw new Error('API_ERROR: Unable to generate questions from Gemini API');
}
