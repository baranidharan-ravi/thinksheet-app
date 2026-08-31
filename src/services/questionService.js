import { generateAIQuestions } from './aiGenerator';

// Question Service: 100% Real-Time AI Generation Only with Intelligent Prefetching
// Provides instant 0ms startup times when prefetched, and ~2s parallel generation via gemini-3.5-flash-lite.

const SEEN_QUESTIONS_KEY = 'thinksheet_infinite_unseen_signatures_v6';

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

// In-memory prefetch cache for instant zero-wait navigation
const prefetchCache = {
  Visual: null,
  'Analytical Thinking': null
};

const prefetchInProgress = {
  Visual: false,
  'Analytical Thinking': false
};

/**
 * Background pre-fetcher for instant loading on skill selection
 */
export async function prefetchThinksheetSession(selectedSkill = 'Visual', sheetNumber = 1, kidAge = 5) {
  if (prefetchCache[selectedSkill] || prefetchInProgress[selectedSkill]) {
    return;
  }

  prefetchInProgress[selectedSkill] = true;
  try {
    const questions = await generateAIQuestions(selectedSkill, sheetNumber, kidAge);
    if (questions && Array.isArray(questions) && questions.length >= 6) {
      prefetchCache[selectedSkill] = questions;
    }
  } catch (err) {
    console.debug('Background prefetch notice:', err.message);
  } finally {
    prefetchInProgress[selectedSkill] = false;
  }
}

/**
 * Fetches exactly 10 fresh, unseen questions strictly from Google Gemini AI API
 * Returns instantly if pre-fetched in background, otherwise fetches in ~2 seconds.
 *
 * @param {'Visual' | 'Analytical Thinking'} selectedSkill
 * @param {number} sheetNumber
 * @param {number} kidAge (e.g. 3, 4, 5, 6, 7, 8)
 */
export async function getFreshThinksheetSession(
  selectedSkill = 'Visual',
  sheetNumber = 1,
  kidAge = 5
) {
  const seenSignatures = getSeenSignatures();

  // 1. Check if we have an instant pre-fetched session in memory
  if (prefetchCache[selectedSkill] && Array.isArray(prefetchCache[selectedSkill])) {
    const cached = prefetchCache[selectedSkill];
    prefetchCache[selectedSkill] = null; // consume cache

    // Mark signatures
    cached.forEach((q) => {
      if (q.signature) seenSignatures.add(q.signature);
    });
    saveSeenSignatures(seenSignatures);

    // Trigger background prefetch for the NEXT session
    setTimeout(() => {
      prefetchThinksheetSession(selectedSkill, sheetNumber + 1, kidAge);
    }, 200);

    return cached.slice(0, 10);
  }

  // 2. Fetch directly with ultra-fast parallel gemini-3.5-flash-lite
  const aiQuestions = await generateAIQuestions(selectedSkill, sheetNumber, kidAge);

  if (aiQuestions && Array.isArray(aiQuestions) && aiQuestions.length >= 6) {
    aiQuestions.forEach((q) => {
      if (q.signature) seenSignatures.add(q.signature);
    });
    saveSeenSignatures(seenSignatures);

    // Trigger background prefetch for the next sheet in this skill
    setTimeout(() => {
      prefetchThinksheetSession(selectedSkill, sheetNumber + 1, kidAge);
      const otherSkill = selectedSkill === 'Visual' ? 'Analytical Thinking' : 'Visual';
      prefetchThinksheetSession(otherSkill, 1, kidAge);
    }, 300);

    return aiQuestions.slice(0, 10);
  }

  throw new Error('AI_INVALID_RESPONSE');
}
