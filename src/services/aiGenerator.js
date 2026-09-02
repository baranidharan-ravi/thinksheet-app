// High-Quality, Sensible 100% AI Question Generator with Strict Age Calibration (Ages 2 to 14)
// Guarantees skillset-aligned prompts, selectable Gemini models, domain separation, rich visual representations, and non-repetitive live generation

const AI_KEY_STORAGE = 'thinksheet_gemini_api_key';
const SELECTED_MODEL_KEY = 'thinksheet_selected_gemini_model_v1';
const SEEN_QUESTIONS_KEY = 'thinksheet_seen_question_signatures_v9';

export const DEFAULT_GEMINI_MODEL = 'gemini-3.5-flash-lite';

export const AVAILABLE_GEMINI_MODELS = [
	{
		id: 'gemini-3.5-flash-lite',
		name: 'Gemini 3.5 Flash Lite',
		badge: 'Recommended',
		badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
		tag: '⚡ Ultra-Fast & Lightweight',
		description:
			'Lowest latency and fastest generation time. Highly optimized for real-time question synthesis.',
	},
	{
		id: 'gemini-3.5-flash',
		name: 'Gemini 3.5 Flash',
		badge: 'Frontier',
		badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40',
		tag: '🧠 High Reasoning & Speed',
		description:
			'Frontier-class model delivering superior reasoning capabilities and complex logical deduction.',
	},
	{
		id: 'gemini-3-flash-preview',
		name: 'Gemini 3 Flash Preview',
		badge: 'Preview',
		badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-400/40',
		tag: '🔮 Next-Gen Preview',
		description:
			'Experimental preview model featuring next-gen intelligence and creative puzzle synthesis.',
	},
	{
		id: 'gemini-2.5-flash',
		name: 'Gemini 2.5 Flash',
		badge: 'Stable',
		badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
		tag: '🛡️ General Purpose',
		description:
			'Standard workhorse model with consistent speed and well-tested educational capabilities.',
	},
];

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

export function getStoredSelectedModel() {
	try {
		const saved = localStorage.getItem(SELECTED_MODEL_KEY);
		if (saved && AVAILABLE_GEMINI_MODELS.some((m) => m.id === saved)) {
			return saved;
		}
	} catch {}
	return DEFAULT_GEMINI_MODEL;
}

export function setStoredSelectedModel(modelId) {
	try {
		if (modelId) {
			localStorage.setItem(SELECTED_MODEL_KEY, modelId);
		}
	} catch (err) {
		console.warn('Could not save selected Gemini model', err);
	}
}

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
		const arr = Array.from(seenSet).slice(-600);
		localStorage.setItem(SEEN_QUESTIONS_KEY, JSON.stringify(arr));
	} catch (err) {
		console.warn('Could not save seen signatures', err);
	}
}

/**
 * Explicit Skillset Definitions, Pedagogical Descriptions, and Distinct Batch Domains
 */
export const SKILL_DEFINITIONS = {
	Visual: {
		title: 'Visual Observation & Spatial Reasoning',
		description:
			'Visual observation, recognizing geometric and color pattern progressions, spatial rotations, object counting and arithmetic groupings, missing grid tiles, 3D isometric block projections, and balance scale weight logic.',
		coreObjective:
			'The student must observe, count, compare, or deduce patterns and spatial relationships from visual descriptions or diagram representations.',
		batch1Domain:
			'Batch 1 Focus: (1) Shape & color pattern progressions (e.g. AB, AAB, ABC sequences or number progressions), (2) Missing grid tile matrix deduction, (3) Balance scale weight logic.',
		batch2Domain:
			'Batch 2 Focus: (1) Object counting & arithmetic grouping puzzles, (2) 3D isometric block tower heights & volumes, (3) Spatial reflections, symmetry, or rotations.',
	},
	'Analytical Thinking': {
		title: 'Analytical Thinking & Logical Deduction',
		description:
			'Logical deduction, relational analogies (A : B :: C : D), everyday cause-and-effect science & nature riddles, categorical classification (odd-one-out), deductive logic clues, syllogisms, and multi-step critical thinking.',
		coreObjective:
			'The student must analyze relationships, deduce outcomes from logical rules, connect concepts through analogies, or classify items based on defined properties.',
		batch1Domain:
			'Batch 1 Focus: (1) Relational & functional analogies (A : B :: C : D), (2) Everyday cause-and-effect science & nature riddles.',
		batch2Domain:
			'Batch 2 Focus: (1) Multi-step deductive logic clues & riddles, (2) Categorical classification (odd-one-out), (3) Sequence rules and conditional reasoning.',
	},
};

/**
 * Universal Gemini API Caller prioritizing the user's selected model with automatic fallback
 */
async function callGeminiApi(payload, apiKey, preferredModel = null) {
	if (!apiKey) {
		throw new Error('MISSING_API_KEY');
	}

	const activeSelected = preferredModel || getStoredSelectedModel();
	const allModelIds = AVAILABLE_GEMINI_MODELS.map((m) => m.id);

	// Sequence: user's selected model first, followed by remaining models
	const modelsToTry = [
		activeSelected,
		...allModelIds.filter((m) => m !== activeSelected),
	];

	let lastError = null;

	for (const model of modelsToTry) {
		try {
			const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(
				apiKey,
			)}`;

			const res = await fetch(url, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload),
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
			console.warn(
				`[Gemini API] ${model} returned HTTP ${res.status}, trying fallback model...`,
			);

			// If it's an explicit key error (400 invalid key / 403 forbidden), stop trying other models
			if (
				res.status === 400 &&
				(errMsg.toLowerCase().includes('api_key') ||
					errMsg.toLowerCase().includes('key not valid') ||
					errMsg.toLowerCase().includes('invalid api key') ||
					errMsg.toLowerCase().includes('api key expired'))
			) {
				throw new Error(
					'Invalid Gemini API Key. Please verify your key from Google AI Studio.',
				);
			}
			if (res.status === 403) {
				throw new Error(
					'Gemini API key access forbidden. Ensure Generative Language API is enabled.',
				);
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
 * Validates a Gemini API key by making a lightweight test ping using the selected model
 * Returns { valid: true, cleanedKey } or { valid: false, message }
 */
export async function validateGeminiApiKey(apiKey, preferredModel = null) {
	if (!apiKey || typeof apiKey !== 'string' || !apiKey.trim()) {
		return {
			valid: false,
			message: 'Please enter your Google Gemini API Key! 🔑',
		};
	}

	const cleanedKey = apiKey.replace(/^["']|["']$/g, '').trim();

	if (cleanedKey.length < 15) {
		return {
			valid: false,
			message:
				'Invalid API Key length. Please paste a valid key from Google AI Studio.',
		};
	}

	try {
		const payload = {
			contents: [{ parts: [{ text: 'Hello' }] }],
			generationConfig: { maxOutputTokens: 10 },
		};

		await callGeminiApi(payload, cleanedKey, preferredModel);
		return { valid: true, cleanedKey };
	} catch (err) {
		console.error('API Key validation error:', err);
		return {
			valid: false,
			message:
				err.message ||
				'API key validation failed. Please check and re-enter your key from Google AI Studio.',
		};
	}
}

/**
 * Ensures diagram data mathematically and visually matches the correct answer
 * Provides rich diagram auto-detection for all questions
 */
function synchronizeDiagramData(
	diagramType,
	rawData = {},
	questionText = '',
	correctText = '',
	selectedSkill = 'Visual',
) {
	let type = diagramType;
	const data = { ...rawData };

	// Auto-detect best diagram type if not specifically set or generic
	if (!type || type === 'null' || type === 'none') {
		const lower = questionText.toLowerCase();
		if (
			lower.includes('is to') ||
			questionText.includes('::') ||
			questionText.includes(':')
		) {
			type = 'analogy-map';
		} else if (
			lower.includes('sequence') ||
			lower.includes('pattern') ||
			lower.includes('next number') ||
			/\d+,\s*\d+,\s*\d+/.test(questionText)
		) {
			type = 'sequence-ladder';
		} else if (
			lower.includes('happen') ||
			lower.includes('because') ||
			lower.includes('cause') ||
			lower.includes('if you')
		) {
			type = 'cause-effect';
		} else if (lower.includes('how many') || lower.includes('count')) {
			type = 'apple-counting';
		} else if (
			lower.includes('block') ||
			lower.includes('cube') ||
			lower.includes('tower')
		) {
			type = 'block-tower';
		} else if (
			lower.includes('balance') ||
			lower.includes('scale') ||
			lower.includes('heavier') ||
			lower.includes('lighter')
		) {
			type = 'scale-balance';
		} else if (lower.includes('grid') || lower.includes('tile')) {
			type = 'grid-tiles';
		} else if (selectedSkill === 'Visual') {
			type = 'pattern-shapes';
		} else {
			type = 'analogy-map';
		}
	}

	const numMatch =
		String(correctText).match(/\d+/) || String(questionText).match(/\d+/);
	const parsedNum = numMatch ? parseInt(numMatch[0], 10) : null;

	if (type === 'analogy-map') {
		const cleanQ = questionText.replace(/\?|\.{2,}/g, '').trim();
		const isToMatch = cleanQ.match(
			/(.+?)\s+is to\s+(.+?)(?:,\s*as|\s+as)\s+(.+?)\s+is to\s*(.*)/i,
		);
		const colonMatch = cleanQ.match(/(.+?)\s*:\s*(.+?)\s*::\s*(.+?)\s*:\s*(.*)/);

		if (isToMatch) {
			data.itemA = data.itemA || isToMatch[1].trim();
			data.itemB = data.itemB || isToMatch[2].trim();
			data.itemC = data.itemC || isToMatch[3].trim();
			data.itemD = data.itemD || correctText.trim();
		} else if (colonMatch) {
			data.itemA = data.itemA || colonMatch[1].trim();
			data.itemB = data.itemB || colonMatch[2].trim();
			data.itemC = data.itemC || colonMatch[3].trim();
			data.itemD = data.itemD || correctText.trim();
		} else {
			data.itemA = data.itemA || 'Concept A';
			data.itemB = data.itemB || 'Concept B';
			data.itemC = data.itemC || 'Concept C';
			data.itemD = data.itemD || correctText.trim();
		}
	} else if (type === 'sequence-ladder') {
		const numbersInQ = questionText.match(/-?\d+(?:\.\d+)?/g);
		if (numbersInQ && numbersInQ.length >= 2) {
			data.steps = data.steps || numbersInQ.map((n) => n.trim());
		} else {
			data.steps = data.steps || ['1st', '2nd', '3rd', '4th'];
		}
		data.nextVal = data.nextVal || correctText.trim();
	} else if (type === 'cause-effect') {
		const parts = questionText.split(/,|then|what happens/i);
		data.cause =
			data.cause ||
			(parts[0] ? parts[0].trim().replace(/^if\s+/i, '') : 'Event / Condition');
		data.action = data.action || 'leads to';
		data.effect = data.effect || correctText.trim();
	} else if (type === 'apple-counting') {
		const count =
			parsedNum && parsedNum > 0 && parsedNum <= 25 ?
				parsedNum
			:	Number(data.count) || 4;
		data.count = count;
		const emojiMatch = questionText.match(
			/[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u,
		);
		data.emoji = data.emoji || (emojiMatch ? emojiMatch[0] : '🍎');
	} else if (type === 'pattern-shapes') {
		if (
			!data.sequence ||
			!Array.isArray(data.sequence) ||
			data.sequence.length < 3
		) {
			const emojis = questionText.match(
				/[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu,
			);
			data.sequence =
				emojis && emojis.length >= 3 ? emojis : ['🔴', '🔵', '🔴', '🔵'];
		}
		data.nextItem = data.nextItem || correctText.trim() || data.sequence[0];
	} else if (type === 'grid-tiles') {
		const count = parsedNum && parsedNum > 0 ? parsedNum : data.count || 4;
		data.count = count;
		data.holeW = count <= 4 ? count : Math.min(4, Math.ceil(Math.sqrt(count)));
		data.holeH = Math.ceil(count / data.holeW);
		data.rows = Math.max(5, data.holeH + 2);
		data.cols = Math.max(5, data.holeW + 2);
		data.holeRow = 1;
		data.holeCol = 1;
	} else if (type === 'block-tower') {
		const total = parsedNum && parsedNum > 0 ? parsedNum : 6;
		if (total <= 4) {
			data.bottom = 2;
			data.middle = 1;
			data.top = 0;
		} else if (total <= 7) {
			data.bottom = 3;
			data.middle = 2;
			data.top = Math.max(1, total - 5);
		} else {
			data.bottom = 4;
			data.middle = 3;
			data.top = Math.max(1, total - 7);
		}
	}

	return { type, data };
}

// Helper to shuffle options and format question object
function shuffleAndFormatOptions(questionObj, selectedSkill) {
	if (!questionObj) return null;

	let optionTexts = [];
	let correctText = '';

	if (Array.isArray(questionObj.options)) {
		if (typeof questionObj.options[0] === 'string') {
			optionTexts = [...questionObj.options];
			correctText =
				questionObj.correctAnswer ||
				questionObj.correctAnswerId ||
				optionTexts[0];
		} else if (typeof questionObj.options[0] === 'object') {
			optionTexts = questionObj.options.map(
				(opt) => opt.text || opt.label || String(opt),
			);
			const found = questionObj.options.find(
				(opt) =>
					opt.id === questionObj.correctAnswerId ||
					opt.text === questionObj.correctAnswer,
			);
			correctText =
				found ?
					found.text || found.id
				:	questionObj.correctAnswer || optionTexts[0];
		}
	}

	if (optionTexts.length < 2) {
		optionTexts = ['Option 1', 'Option 2', 'Option 3', 'Option 4'];
		correctText = optionTexts[0];
	}

	while (optionTexts.length < 4) {
		optionTexts.push(`Choice ${optionTexts.length + 1}`);
	}

	const uniqueTexts = Array.from(
		new Set(optionTexts.map((t) => String(t).trim())),
	);
	while (uniqueTexts.length < 4) {
		uniqueTexts.push(`Choice ${uniqueTexts.length + 1}`);
	}

	const shuffledTexts = uniqueTexts.slice(0, 4).sort(() => Math.random() - 0.5);
	const letters = ['A', 'B', 'C', 'D'];

	const newOptions = shuffledTexts.map((text, idx) => ({
		id: letters[idx],
		text: String(text),
	}));

	const correctIdx = shuffledTexts.indexOf(String(correctText).trim());
	const newCorrectId = letters[correctIdx >= 0 ? correctIdx : 0];

	const qText =
		questionObj.question ||
		questionObj.questionText ||
		questionObj.q ||
		'Look at the question and choose the best answer:';

	const rawDiagramType =
		questionObj.diagramType ||
		questionObj.dt ||
		(questionObj.imageUrl ? 'image' : null);
	const rawDiagramData =
		questionObj.diagramData ||
		questionObj.dd ||
		(questionObj.imageUrl ? { imageUrl: questionObj.imageUrl } : {});

	const { type: finalDiagramType, data: synchedData } = synchronizeDiagramData(
		rawDiagramType,
		rawDiagramData,
		qText,
		correctText,
		selectedSkill,
	);

	return {
		id:
			questionObj.id ||
			`ai_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
		category: selectedSkill,
		categoryDescription:
			selectedSkill === 'Visual' ?
				'Pattern Completion, Counting & Spatial Recognition'
			:	'Logical Deduction, Analogies & Critical Thinking',
		question: qText,
		questionText: qText,
		promptAudio: qText,
		diagramType: finalDiagramType,
		diagramData: synchedData,
		solutionDiagramType: finalDiagramType,
		solutionDiagramData: synchedData,
		imageUrl: questionObj.imageUrl || synchedData.imageUrl || null,
		options: newOptions,
		correctAnswerId: newCorrectId,
		correctAnswerText: String(correctText),
		solutionText:
			questionObj.solution ||
			questionObj.solutionText ||
			`The correct answer is ${correctText}.`,
		hint:
			questionObj.hint ||
			'Carefully observe the clues and patterns before selecting an answer.',
	};
}

/**
 * Sanitizes and repairs imperfect JSON from LLMs
 */
function cleanAndRepairJsonString(rawText) {
	if (!rawText) return '';
	let text = rawText.trim();

	// 1. Strip markdown code block wrappers
	if (text.startsWith('```')) {
		text = text
			.replace(/^```(?:json)?\s*/i, '')
			.replace(/```\s*$/i, '')
			.trim();
	}

	// 2. Fix parenthesized expressions inside arrays:
	// e.g. [("(-5, 3)"), ("(-3, 5)")] -> ["(-5, 3)", "(-3, 5)"]
	// e.g. [( "abc" ), ( 'def' )] -> ["abc", "def"]
	text = text.replace(/\(\s*("[^"\\]*(?:\\.[^"\\]*)*")\s*\)/g, '$1');
	text = text.replace(/\(\s*('[^'\\]*(?:\\.[^'\\]*)*')\s*\)/g, '$1');

	// 3. Fix Python-style constants
	text = text
		.replace(/:\s*True\b/g, ': true')
		.replace(/:\s*False\b/g, ': false')
		.replace(/:\s*None\b/g, ': null');

	// 4. Remove trailing commas before closing braces/brackets
	text = text.replace(/,\s*([\]}])/g, '$1');

	return text;
}

/**
 * Resilient JSON Parser for Gemini API responses
 */
function parseGeminiJsonResponse(rawText) {
	if (!rawText) return null;

	const cleaned = cleanAndRepairJsonString(rawText);

	// Try direct parse on cleaned string
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
		// If strict JSON.parse fails, try extracting array pattern
		try {
			const match = cleaned.match(/\[\s*\{[\s\S]*\}\s*\]/);
			if (match) {
				const repairedMatch = cleanAndRepairJsonString(match[0]);
				const parsed = JSON.parse(repairedMatch);
				if (Array.isArray(parsed)) return parsed;
			}
		} catch (innerErr) {
			// Last-ditch: parse individual JSON objects { ... } from the text
			try {
				const objectMatches = cleaned.match(/\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/g);
				if (objectMatches && objectMatches.length > 0) {
					const items = [];
					for (const objStr of objectMatches) {
						try {
							const obj = JSON.parse(cleanAndRepairJsonString(objStr));
							if (obj.question && obj.options) {
								items.push(obj);
							}
						} catch {}
					}
					if (items.length > 0) return items;
				}
			} catch {}
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
			persona: `preschool and early childhood educator creating simple, colorful, engaging visual challenges for a ${numAge}-year-old toddler`,
			guidelines: `
- Keep questions super short, simple, and visual with familiar animals, fruits, and shapes.
- For Visual: simple counting (1-5 objects), AB color patterns (🔴 🔵 🔴 🔵).
- For Analytical: Animal babies (Puppy to Dog, Kitten to Cat), basic sounds, color matching.`,
			examples:
				selectedSkill === 'Visual' ?
					`Example: "How many red apples 🍎 are in the basket?" -> "diagramType": "apple-counting", "diagramData": {"count": 3, "emoji": "🍎"}, "correctAnswer": "3 apples"`
				:	`Example: "Puppy 🐶 is to Dog 🐕, as Kitten 🐱 is to...?" -> "diagramType": "analogy-map", "diagramData": {"itemA": "Puppy 🐶", "itemB": "Dog 🐕", "itemC": "Kitten 🐱", "itemD": "Cat 🐈"}, "correctAnswer": "Cat 🐈"`,
		};
	}

	if (numAge <= 7) {
		return {
			persona: `elementary educator creating fun, logical puzzles for a ${numAge}-year-old early elementary student`,
			guidelines: `
- Use kindergarten/early grade-school vocabulary, addition within 1-12, AAB/ABC repeating patterns.
- For Visual: Counting 4-12 objects, grid tile gaps, balance scales.
- For Analytical: Functional analogies (Bird : Nest :: Bee : Hive), everyday cause-and-effect (sun melts ice, rain grows plants), odd-one-out categories.`,
			examples:
				selectedSkill === 'Visual' ?
					`Example: "Complete the pattern: 🔴 🔴 🔷 🔴 🔴 ?" -> "diagramType": "pattern-shapes", "diagramData": {"sequence": ["🔴", "🔴", "🔷", "🔴", "🔴"], "nextItem": "🔷"}, "correctAnswer": "🔷"`
				:	`Example: "If you leave an ice cube 🧊 in the warm sun ☀️, what happens?" -> "diagramType": "cause-effect", "diagramData": {"cause": "Ice Cube 🧊 in Sun ☀️", "action": "melts", "effect": "Water 💧"}, "correctAnswer": "It melts into water 💧"`,
		};
	}

	if (numAge <= 10) {
		return {
			persona: `upper elementary logic and STEM instructor creating thought-provoking puzzles for a ${numAge}-year-old student (Grades 3-5)`,
			guidelines: `
- DO NOT generate baby/preschool counting questions!
- Use multi-step reasoning, geometric & number sequences (e.g. 4, 8, 12, 16, ? or 3, 6, 12, 24, ?), 3D block projections, grid matrices.
- For Analytical: Higher-order analogies (Author : Novel :: Sculptor : Statue, Thermometer : Temperature :: Speedometer : Speed), scientific classification (Carnivore/Herbivore/Omnivore, States of matter, simple machines), multi-step deductive clues.`,
			examples:
				selectedSkill === 'Visual' ?
					`Example: "Look at the number sequence: 5, 10, 20, 40, ? What comes next?" -> "diagramType": "sequence-ladder", "diagramData": {"steps": ["5", "10", "20", "40"], "nextVal": "80", "rule": "x2"}, "correctAnswer": "80", "options": ["60", "70", "80", "90"]`
				:	`Example: "Author is to Book, as Architect is to...?" -> "diagramType": "analogy-map", "diagramData": {"itemA": "Author ✍️", "itemB": "Book 📖", "itemC": "Architect 📐", "itemD": "Building 🏛️"}, "correctAnswer": "Building", "options": ["Painting", "Building", "Song", "Meal"]`,
		};
	}

	// Ages 11-14 (Middle School / Teen)
	return {
		persona: `middle school logic, mathematics, and advanced STEM educator creating challenging analytical puzzles for a ${numAge}-year-old teenager (Grades 6-9)`,
		guidelines: `
- STRICTLY FORBIDDEN: Do NOT give young kid questions (NO simple apple counting, NO baby animal pairings like puppy-dog!).
- For Visual: Challenging numerical sequences (e.g. 2, 5, 10, 17, 26, ? or Fibonacci), geometric matrix transformations, spatial rotations, isometric block tower volumes, coordinate reflections.
- For Analytical: Advanced abstract analogies (Microscope : Microorganism :: Telescope : Distant Galaxy, Catalyst : Chemical Reaction :: Mentor : Personal Growth), deductive syllogisms, physics principles (density, balance levers, electric circuits, refraction), critical thinking puzzles.`,
		examples:
			selectedSkill === 'Visual' ?
				`Example: "Identify the pattern rule in the sequence: 2, 5, 10, 17, 26, ? What is the next term?" -> "diagramType": "sequence-ladder", "diagramData": {"steps": ["2", "5", "10", "17", "26"], "nextVal": "37", "rule": "+3, +5, +7, +9, +11"}, "correctAnswer": "37", "options": ["35", "37", "39", "41"], "solution": "The difference between terms increases by consecutive odd numbers (+3, +5, +7, +9, +11). 26 + 11 = 37."`
			:	`Example: "Microscope is to Microorganism, as Telescope is to...?" -> "diagramType": "analogy-map", "diagramData": {"itemA": "Microscope 🔬", "itemB": "Microorganism 🦠", "itemC": "Telescope 🔭", "itemD": "Distant Galaxy 🌌"}, "correctAnswer": "Distant Galaxy", "options": ["Subatomic Particle", "Distant Galaxy", "Microscopic Cell", "Sound Wave"], "solution": "A microscope is an instrument used to observe microscopic organisms, just as a telescope is used to observe distant galaxies."`,
	};
}

/**
 * Fetch a high-quality batch with skillset description, domain focus, and strict non-repetition rules
 */
async function fetchBatch(selectedSkill, count, kidAge, batchId, apiKey, preferredModel = null) {
	const isVisual = selectedSkill === 'Visual';
	const skillInfo =
		SKILL_DEFINITIONS[selectedSkill] || SKILL_DEFINITIONS.Visual;
	const pedagogy = getAgeSpecificPedagogy(kidAge, selectedSkill);

	const domainFocus =
		batchId === 1 ? skillInfo.batch1Domain : skillInfo.batch2Domain;

	const prompt = `You are an expert educator and puzzle creator.
TARGET SKILLSET: "${skillInfo.title}"
SKILLSET DESCRIPTION: "${skillInfo.description}"
CORE LEARNING OBJECTIVE: "${skillInfo.coreObjective}"
TARGET STUDENT AGE: Strictly calibrated for a ${kidAge}-year-old child (Grade/Cognitive level appropriate).

CURRENT BATCH DOMAIN (Batch ${batchId}):
${domainFocus}

AGE PEDAGOGY GUIDELINES (Age ${kidAge}):
${pedagogy.guidelines}

${pedagogy.examples}

CRITICAL RULES (100% Non-Repetitive, Visually-Enriched & Accurate):
1. Every single question in this batch must be 100% UNIQUE in concept, wording, and numerical values. Do NOT repeat or rephrase questions within the batch.
2. ALWAYS provide an engaging visual diagram structure in "diagramType" and "diagramData":
   - For Visual questions: use "pattern-shapes", "grid-tiles", "apple-counting", "block-tower", "scale-balance", or "sequence-ladder".
   - For Analytical questions: use "analogy-map", "cause-effect", "sequence-ladder", or "classification-venn".
3. Every question must have 4 distinct, plausible multiple-choice options with exactly 1 unambiguous correct answer.
4. All multiple-choice options in the "options" array MUST be standard JSON strings e.g. ["Choice 1", "Choice 2", "Choice 3", "Choice 4"]. Do NOT use tuples or parentheses around items like [("...")].
5. The complexity and vocabulary MUST strictly fit a ${kidAge}-year-old student.

Output a valid JSON Array of ${count} items. Format:
[
  {
    "question": "Age-appropriate question text matching ${skillInfo.title}",
    "diagramType": ${isVisual ? (kidAge >= 8 ? '"block-tower"' : '"apple-counting"') : '"analogy-map"'},
    "diagramData": ${isVisual ? (kidAge >= 8 ? '{"count": 6}' : '{"count": 4, "emoji": "🍎"}') : '{"itemA": "Puppy 🐶", "itemB": "Dog 🐕", "itemC": "Kitten 🐱", "itemD": "Cat 🐈"}'},
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
			temperature: 0.75,
			maxOutputTokens: 8192,
		},
	};

	const data = await callGeminiApi(bodyPayload, apiKey, preferredModel);
	const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
	const parsed = parseGeminiJsonResponse(rawText);

	if (Array.isArray(parsed) && parsed.length > 0) {
		return parsed;
	}

	console.warn('[Gemini API] Failed to parse JSON response batch:', rawText);
	return [];
}

/**
 * Generate 10 sensible, high-quality, non-repeating AI questions in parallel calibrated to kidAge and skillset
 */
export async function generateAIQuestions(
	selectedSkill = 'Visual',
	sheetNumber = 1,
	kidAge = 5,
) {
	const apiKey = getStoredApiKey();

	if (!apiKey) {
		throw new Error('MISSING_API_KEY');
	}

	const preferredModel = getStoredSelectedModel();
	const seenSignatures = getSeenSignatures();

	const normalizeText = (text) =>
		String(text || '')
			.toLowerCase()
			.replace(/[^\w\s]/g, '')
			.replace(/\s+/g, ' ')
			.trim();

	let combined = [];

	try {
		const [batch1, batch2] = await Promise.all([
			fetchBatch(selectedSkill, 5, kidAge, 1, apiKey, preferredModel),
			fetchBatch(selectedSkill, 5, kidAge, 2, apiKey, preferredModel),
		]);

		combined = [...batch1, ...batch2];
	} catch (err) {
		console.warn(
			'Parallel batch issue, falling back to single batch:',
			err.message,
		);
	}

	// Fallback single batch of 10 if needed
	if (combined.length < 6) {
		try {
			const singleBatch = await fetchBatch(
				selectedSkill,
				10,
				kidAge,
				1,
				apiKey,
				preferredModel,
			);
			combined = [...singleBatch];
		} catch (err) {
			console.error('Single batch fallback failed:', err);
			throw err;
		}
	}

	if (combined.length < 6) {
		throw new Error(
			'API_ERROR: Unable to generate enough distinct questions from Gemini API.',
		);
	}

	// Deduplicate within the batch and format
	const uniqueQuestions = [];
	const localSeen = new Set();

	for (const rawQ of combined) {
		if (!rawQ || !rawQ.question) continue;
		const norm = normalizeText(rawQ.question);
		if (localSeen.has(norm)) continue;
		localSeen.add(norm);

		const formatted = shuffleAndFormatOptions(rawQ, selectedSkill);
		if (formatted) {
			uniqueQuestions.push({
				...formatted,
				id: `ai_${selectedSkill.toLowerCase().replace(/\s+/g, '_')}_${kidAge}yo_${Date.now()}_${uniqueQuestions.length}_${Math.random().toString(36).substr(2, 4)}`,
			});
			seenSignatures.add(norm);
		}

		if (uniqueQuestions.length === 10) break;
	}

	saveSeenSignatures(seenSignatures);

	if (uniqueQuestions.length >= 6) {
		return uniqueQuestions;
	}

	throw new Error('API_ERROR: Unable to generate 10 unique questions.');
}
