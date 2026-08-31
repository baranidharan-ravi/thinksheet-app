import { GoogleGenAI } from '@google/genai';

const AI_KEY_STORAGE = 'thinksheet_gemini_api_key';

export function getStoredApiKey() {
  return (
    localStorage.getItem(AI_KEY_STORAGE) ||
    import.meta.env.VITE_GEMINI_API_KEY ||
    ''
  );
}

export function setStoredApiKey(key) {
  if (key) {
    localStorage.setItem(AI_KEY_STORAGE, key.trim());
  } else {
    localStorage.removeItem(AI_KEY_STORAGE);
  }
}

/**
 * Generate 10 AI-Powered questions using Google Gemini API for 5-year-old learners
 */
export async function generateAIQuestions(selectedSkill = 'Visual', sheetNumber = 1) {
  const apiKey = getStoredApiKey();

  if (!apiKey) {
    // No API key provided; will fallback to procedural internet generator
    return null;
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
You are an expert early-childhood curriculum designer and child psychologist creating a Thinksheet for 5-year-old kids.
Topic: "${selectedSkill}".
Sheet Number: ${sheetNumber}.

Target Audience:
- 5-year-old early learners (Kindergarten / Pre-K)
- Friendly, playful language with clear emojis
- SFW, age-appropriate, encouraging

Requirements:
Generate a JSON array of exactly 10 high-quality, non-repeating educational questions for this topic.

If selectedSkill is "Visual":
Create visual and spatial reasoning puzzles such as:
1. Grid missing tile counting (diagramType: "grid-tiles", diagramData: { rows: 6, cols: 6, holeRow: 1, holeCol: 2, holeW: 3, holeH: 3, count: 9 })
2. Shape and fruit pattern completion (diagramType: "pattern-shapes", diagramData: { sequence: ["🍎", "🍌", "🍎", "🍌", "🍎"], nextItem: "🍌" })
3. Object and animal counting (diagramType: "apple-counting", diagramData: { count: 6, emoji: "⭐" })
4. Seesaw balance physics (diagramType: "scale-balance", diagramData: { leftEmoji: "🐘", rightEmoji: "🐭", heavySide: "left" })
5. 3D pyramid block tower counting (diagramType: "block-tower", diagramData: { bottom: 3, middle: 2, top: 1 })
6. Paper cut corner logic (diagramType: "paper-cut")
7. Butterfly mirror symmetry (diagramType: "butterfly-symmetry")
8. Rocket maze navigation (diagramType: "rocket-maze")

If selectedSkill is "Analytical Thinking":
Create cognitive reasoning questions such as:
1. Picture & verbal analogies (e.g. "If Ear is to Headphones 🎧, then Eye is to?")
2. Classification & Odd-One-Out (e.g. "Which one does NOT fly in the sky?")
3. Cause-and-effect everyday logic (e.g. "If you water a seed in soil 🌱, what will happen?")
4. Habitats, animal families, opposite concepts (Fast/Slow, Hot/Cold, Heavy/Light).

JSON Schema per question:
{
  "id": "ai_q_1",
  "category": "${selectedSkill}",
  "categoryDescription": "${
    selectedSkill === 'Visual'
      ? 'Develop your ability to analyze and/or spot visual information in order to solve a problem'
      : 'Develop your ability to plan and breakdown information in order to analyze and solve complex problems'
  }",
  "question": "Question text with friendly emojis",
  "promptAudio": "Clear short read-aloud prompt for voice synthesis",
  "diagramType": "${selectedSkill === 'Visual' ? 'grid-tiles' : null}",
  "diagramData": {},
  "options": [
    { "id": "A", "text": "Option 1" },
    { "id": "B", "text": "Option 2" },
    { "id": "C", "text": "Option 3" },
    { "id": "D", "text": "Option 4" }
  ],
  "correctAnswerId": "A",
  "solutionText": "Clear, encouraging explanation for a 5yo child.",
  "solutionDiagramType": "${selectedSkill === 'Visual' ? 'grid-tiles' : null}",
  "solutionDiagramData": {},
  "hint": "Gentle clue to help the child think."
}

Return ONLY valid JSON array with 10 questions.
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.7
      }
    });

    const parsed = JSON.parse(response.text.trim());
    if (Array.isArray(parsed) && parsed.length >= 8) {
      return parsed.slice(0, 10).map((q, idx) => ({
        ...q,
        id: `ai_${Date.now()}_${idx}_${Math.random().toString(36).substr(2, 4)}`,
        isAIGenerated: true
      }));
    }
  } catch (err) {
    console.warn('AI Generation call encountered error, activating procedural fallback:', err);
    return null;
  }

  return null;
}
