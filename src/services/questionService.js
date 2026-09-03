import { generateAIQuestions } from './aiGenerator';

// Question Service: 100% Real-Time Live AI Generation (No In-Memory Caching)
// Each session fetches completely fresh, non-repetitive questions directly from Gemini API

export const CATEGORY_DESCRIPTIONS = {
	Visual:
		'Develop your ability to analyze and spot visual patterns, spatial arrangements, and geometric relationships.',
	'Analytical Thinking':
		'Develop your ability to plan, break down logical analogies, and deduce cause-and-effect relationships.',
};

/**
 * Fetches exactly 10 fresh, unseen questions strictly calibrated to the kid's age and selected skill
 * Directly calls the Google Gemini API with zero in-memory caching.
 *
 * @param {'Visual' | 'Analytical Thinking'} selectedSkill
 * @param {number} sheetNumber
 * @param {number} kidAge (e.g. 2 to 14)
 */
export async function getFreshThinksheetSession(
	selectedSkill = 'Visual',
	sheetNumber = 1,
	kidAge = 5,
) {
	const aiQuestions = await generateAIQuestions(
		selectedSkill,
		sheetNumber,
		kidAge,
	);

	if (aiQuestions && Array.isArray(aiQuestions) && aiQuestions.length > 0) {
		return aiQuestions.slice(0, 10);
	}

	throw new Error('API_ERROR: Unable to generate questions from Gemini API.');
}

export const getFreshAstroQuestSession = getFreshThinksheetSession;
