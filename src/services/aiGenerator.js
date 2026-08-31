// Browser-Native AI Question Generator for 5-Year-Old Learners
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
 * Generate 10 AI-Powered questions strictly customized for 5-Year-Old Kids
 * using Google Gemini REST API with robust multi-model fallback
 */
export async function generateAIQuestions(selectedSkill = 'Visual', sheetNumber = 1) {
  const apiKey = getStoredApiKey();

  if (!apiKey) {
    // Fallback to procedural/internet generator if key is not configured
    return null;
  }

  const prompt = `
Role: You are a friendly preschool teacher and early-childhood specialist designing a fun Thinksheet for 5-YEAR-OLD KINDERGARTEN KIDS.

Topic: "${selectedSkill}".
Sheet: #${sheetNumber}.

CRITICAL AGE RULES FOR 5-YEAR-OLD LEARNERS:
- DO NOT use complex, abstract, or multi-step logic.
- DO NOT use difficult adult vocabulary (keep words simple, joyful, and short).
- Every question MUST be intuitive, relatable, and easily understandable for a 5-year-old child who knows:
  * Familiar animals (Puppy, Kitten, Cow, Duck, Bird, Bee, Frog, Fish, Lion, Elephant)
  * Everyday body parts & senses (Eyes see, Ears hear, Nose smells, Hands touch/wear gloves, Feet walk/wear shoes)
  * Simple basic opposites (Big/Small, Fast/Slow, Hot/Cold, Up/Down, Day/Night, Clean/Dirty)
  * Daily objects (Beds, Chairs, Pencils, Scissors, Toys, Balloons, Ice Cream, Apples)
  * Colors & Basic Shapes (Red, Blue, Yellow, Green, Circle, Square, Triangle, Star)
  * Simple visual counting (numbers 1 to 9)

QUESTION REQUIREMENTS BASED ON SELECTED SKILL:

If Topic is "Analytical Thinking":
Generate 10 simple early-reasoning questions:
1. Picture Analogies with Emojis:
   - "If Puppy is to Dog 🐕, then Kitten is to?" -> Cat 🐈
   - "If Fast is to Slow 🐢, then Good is to?" -> Bad ❌
   - "If Eye is to See 👁️, then Ear is to?" -> Hear 👂
   - "If Glove is to Hand 🧤, then Sock is to?" -> Foot 🦶
   - "If Day is to Sun ☀️, then Night is to?" -> Moon 🌙
   - "If Bird is to Nest 🪺, then Bee is to?" -> Beehive 🐝
   - "If Caterpillar turns into a Butterfly 🦋, what does a Tadpole turn into?" -> Frog 🐸
2. Odd-One-Out (Picture Classification):
   - "Which one does NOT fly in the sky?" -> Goldfish 🐟
   - "Which one is NOT a sweet fruit to eat?" -> Toy Car 🚗
   - "Which one is NOT an animal with four legs?" -> Yellow Duck 🦆
3. Gentle Cause & Effect:
   - "If you leave an ice cube 🧊 in the warm sun ☀️, what will happen?" -> It melts into water 💧
   - "What happens when you water a little plant seed 🌱?" -> It grows into a flower 🌸
   - "Which lightweight toy will float in the bathtub 🛁?" -> Rubber Duck 🦆

If Topic is "Visual":
Generate 10 visual and spatial challenges:
1. Grid Area Tile Counting (diagramType: "grid-tiles", diagramData: { rows: 5, cols: 5, holeRow: 1, holeCol: 1, holeW: 2, holeH: 2, count: 4 })
2. Shape/Fruit Patterns (diagramType: "pattern-shapes", diagramData: { sequence: ["🍎", "🍌", "🍎", "🍌", "🍎"], nextItem: "🍌" })
3. Object Counting (diagramType: "apple-counting", diagramData: { count: 6, emoji: "⭐" })
4. Seesaw Balance (diagramType: "scale-balance", diagramData: { leftEmoji: "🐘", rightEmoji: "🐭", heavySide: "left" })
5. 3D Block Pyramid (diagramType: "block-tower", diagramData: { bottom: 3, middle: 2, top: 1 })
6. Paper cut corners (diagramType: "paper-cut")
7. Butterfly Symmetry (diagramType: "butterfly-symmetry")
8. Rocket Maze (diagramType: "rocket-maze")

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
    "question": "Short 1-sentence question with friendly emojis (suitable for 5-year-old)",
    "promptAudio": "Simple voice read-aloud sentence for the child",
    "diagramType": ${selectedSkill === 'Visual' ? '"pattern-shapes"' : 'null'},
    "diagramData": {},
    "options": [
      { "id": "A", "text": "Option 1 (with emoji)" },
      { "id": "B", "text": "Option 2 (with emoji)" },
      { "id": "C", "text": "Option 3 (with emoji)" },
      { "id": "D", "text": "Option 4 (with emoji)" }
    ],
    "correctAnswerId": "A",
    "solutionText": "1 joyful, encouraging sentence explaining the answer to a 5-year-old kid.",
    "solutionDiagramType": ${selectedSkill === 'Visual' ? '"pattern-shapes"' : 'null'},
    "solutionDiagramData": {},
    "hint": "1 simple, friendly clue to help the child think."
  }
]

IMPORTANT: Output ONLY the valid JSON array. No markdown wrap, no other text.
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
        continue; // Try next model
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
            id: `ai_5yo_${Date.now()}_${idx}_${Math.random().toString(36).substr(2, 4)}`,
            category: selectedSkill,
            isAIGenerated: true
          };
        });
      }
    } catch (err) {
      console.warn(`Network/fetch error for model ${modelName}:`, err);
    }
  }

  // If all Gemini REST calls fail (e.g. invalid key or network block), return null so procedural generator activates
  return null;
}
