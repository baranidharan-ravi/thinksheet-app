import { generateAIQuestions } from './aiGenerator';

// Question Service: 100% Real-Time AI Generation Only
// NO offline/static question templates are used.

const SEEN_QUESTIONS_KEY = 'thinksheet_infinite_unseen_signatures_v4';

export const CATEGORY_DESCRIPTIONS = {
  Visual:
    'Develop your ability to analyze and/or spot visual information in order to solve a problem',
  'Analytical Thinking':
    'Develop your ability to plan and breakdown information in order to analyze and solve complex problems'
};

function getSeenSignatures() {
  try {
    const raw = localStorage.getItem(SEEN_QUESTIONS_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function saveSeenSignatures(seenSet) {
  try {
    const arr = Array.from(seenSet).slice(-500);
    localStorage.setItem(SEEN_QUESTIONS_KEY, JSON.stringify(arr));
  } catch (err) {
    console.warn('Could not save seen signatures to localStorage', err);
  }
}

/**
 * Fetches exactly 10 fresh, unseen questions strictly from Google Gemini AI API
 * @param {'Visual' | 'Analytical Thinking'} selectedSkill
 * @param {number} sheetNumber
 * @param {number} kidAge (e.g. 3, 4, 5, 6, 7, 8)
 * @throws {Error} Throws if API key is missing or AI request fails
 */
export async function getFreshThinksheetSession(
  selectedSkill = 'Visual',
  sheetNumber = 1,
  kidAge = 5
) {
  const seenSignatures = getSeenSignatures();

  // Exclusively generate questions from AI API
  const aiQuestions = await generateAIQuestions(selectedSkill, sheetNumber, kidAge);

  if (aiQuestions && Array.isArray(aiQuestions) && aiQuestions.length >= 6) {
    aiQuestions.forEach((q) => {
      if (q.signature) seenSignatures.add(q.signature);
    });
    saveSeenSignatures(seenSignatures);
    return aiQuestions.slice(0, 10);
  }

  throw new Error('AI_INVALID_RESPONSE');
}
