// Pure Web Audio API Sound Generator & Web Speech API Narration
// Zero external asset files needed, 100% reliable & zero latency

let audioCtx = null;

function getAudioContext() {
	try {
		if (!audioCtx) {
			const AudioContext = window.AudioContext || window.webkitAudioContext;
			if (AudioContext) {
				audioCtx = new AudioContext();
			}
		}
		if (audioCtx && audioCtx.state === 'suspended') {
			audioCtx.resume().catch(() => {});
		}
		return audioCtx;
	} catch (err) {
		console.warn('Web Audio API not supported or restricted by browser', err);
		return null;
	}
}

/**
 * Play a cheerful, bright chime for correct answers
 */
export function playCorrectSound(enabled = true) {
	if (!enabled) return;
	const ctx = getAudioContext();
	if (!ctx) return;

	const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 (Major arpeggio)
	const now = ctx.currentTime;

	notes.forEach((freq, index) => {
		const osc = ctx.createOscillator();
		const gain = ctx.createGain();

		osc.type = 'sine';
		osc.frequency.setValueAtTime(freq, now + index * 0.08);

		gain.gain.setValueAtTime(0, now + index * 0.08);
		gain.gain.linearRampToValueAtTime(0.25, now + index * 0.08 + 0.02);
		gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.08 + 0.35);

		osc.connect(gain);
		gain.connect(ctx.destination);

		osc.start(now + index * 0.08);
		osc.stop(now + index * 0.08 + 0.36);
	});
}

/**
 * Play a gentle, encouraging cartoon "Uh oh" boing for incorrect answers
 */
export function playIncorrectSound(enabled = true) {
	if (!enabled) return;
	const ctx = getAudioContext();
	if (!ctx) return;

	const now = ctx.currentTime;

	// Gentle low-pass filtered cartoon boing
	const osc1 = ctx.createOscillator();
	const osc2 = ctx.createOscillator();
	const gain = ctx.createGain();
	const filter = ctx.createBiquadFilter();

	filter.type = 'lowpass';
	filter.frequency.setValueAtTime(600, now);

	osc1.type = 'triangle';
	osc1.frequency.setValueAtTime(260, now);
	osc1.frequency.exponentialRampToValueAtTime(140, now + 0.3);

	osc2.type = 'sine';
	osc2.frequency.setValueAtTime(220, now + 0.1);
	osc2.frequency.exponentialRampToValueAtTime(120, now + 0.38);

	gain.gain.setValueAtTime(0.25, now);
	gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

	osc1.connect(filter);
	osc2.connect(filter);
	filter.connect(gain);
	gain.connect(ctx.destination);

	osc1.start(now);
	osc1.stop(now + 0.4);
	osc2.start(now + 0.1);
	osc2.stop(now + 0.4);
}

/**
 * Play a tactile click/tap for button presses
 */
export function playButtonPop(enabled = true) {
	if (!enabled) return;
	const ctx = getAudioContext();
	if (!ctx) return;

	const now = ctx.currentTime;
	const osc = ctx.createOscillator();
	const gain = ctx.createGain();

	osc.type = 'sine';
	osc.frequency.setValueAtTime(600, now);
	osc.frequency.exponentialRampToValueAtTime(200, now + 0.05);

	gain.gain.setValueAtTime(0.15, now);
	gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

	osc.connect(gain);
	gain.connect(ctx.destination);

	osc.start(now);
	osc.stop(now + 0.06);
}

/**
 * Play shimmering star sound
 */
export function playStarSound(index = 0, enabled = true) {
	if (!enabled) return;
	const ctx = getAudioContext();
	if (!ctx) return;

	const pitches = [587.33, 739.99, 880.0]; // D5, F#5, A5
	const freq = pitches[index % pitches.length] || 880;
	const now = ctx.currentTime;

	const osc = ctx.createOscillator();
	const gain = ctx.createGain();

	osc.type = 'sine';
	osc.frequency.setValueAtTime(freq, now);

	gain.gain.setValueAtTime(0.2, now);
	gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

	osc.connect(gain);
	gain.connect(ctx.destination);

	osc.start(now);
	osc.stop(now + 0.5);
}

/**
 * Play complete victory fanfare
 */
export function playVictoryFanfare(enabled = true) {
	if (!enabled) return;
	const ctx = getAudioContext();
	if (!ctx) return;

	const melody = [
		{ freq: 523.25, time: 0.0, dur: 0.15 }, // C5
		{ freq: 659.25, time: 0.15, dur: 0.15 }, // E5
		{ freq: 783.99, time: 0.3, dur: 0.15 }, // G5
		{ freq: 1046.5, time: 0.45, dur: 0.45 }, // C6
		{ freq: 880.0, time: 0.9, dur: 0.2 }, // A5
		{ freq: 1046.5, time: 1.1, dur: 0.7 }, // C6 (hold)
	];

	const now = ctx.currentTime;

	melody.forEach((note) => {
		const osc = ctx.createOscillator();
		const gain = ctx.createGain();

		osc.type = 'triangle';
		osc.frequency.setValueAtTime(note.freq, now + note.time);

		gain.gain.setValueAtTime(0.25, now + note.time);
		gain.gain.exponentialRampToValueAtTime(0.001, now + note.time + note.dur);

		osc.connect(gain);
		gain.connect(ctx.destination);

		osc.start(now + note.time);
		osc.stop(now + note.time + note.dur + 0.05);
	});
}

// Emoji-to-word dictionary for emoji-only prompts (e.g. pattern sequences "🍎 🍌 🍎 🍌")
const EMOJI_SPEECH_MAP = {
	'🍎': 'apple',
	'🍏': 'green apple',
	'🍌': 'banana',
	'🍓': 'strawberry',
	'🍇': 'grapes',
	'🍊': 'orange',
	'🍉': 'watermelon',
	'🐶': 'puppy',
	'🐕': 'dog',
	'🐱': 'kitten',
	'🐈': 'cat',
	'🦆': 'duck',
	'🐄': 'cow',
	'🐮': 'cow',
	'🐦': 'bird',
	'🐟': 'fish',
	'🦁': 'lion',
	'🐸': 'frog',
	'🐝': 'bee',
	'🦋': 'butterfly',
	'🔴': 'red circle',
	'🔵': 'blue circle',
	'🟡': 'yellow circle',
	'🟢': 'green circle',
	'🔷': 'blue diamond',
	'⭐': 'star',
	'⬛': 'black square',
	'⬜': 'white square',
	'🚗': 'car',
	'🚀': 'rocket',
	'🎈': 'balloon',
	'🧊': 'ice cube',
	'☀️': 'sun',
	'🌙': 'moon',
	'🧢': 'hat',
	'🧦': 'socks',
};

const EMOJI_REGEX =
	/\p{Extended_Pictographic}|\p{Emoji_Presentation}|[\uFE00-\uFE0F\u200D\u20E3]/gu;

// Pre-warm and cache speech synthesis voices across browser engines
let cachedVoices = [];
function populateVoiceList() {
	if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
		try {
			cachedVoices = window.speechSynthesis.getVoices() || [];
		} catch {}
	}
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
	populateVoiceList();
	if (window.speechSynthesis.onvoiceschanged !== undefined) {
		window.speechSynthesis.onvoiceschanged = populateVoiceList;
	}
}

/**
 * Returns all available browser voices, loading them fresh if needed.
 */
export function getAvailableVoices() {
	if (typeof window === 'undefined' || !('speechSynthesis' in window))
		return [];
	const voices =
		cachedVoices.length > 0 ? cachedVoices : window.speechSynthesis.getVoices();
	cachedVoices = voices;
	return voices || [];
}

const VOICE_URI_KEY = 'thinksheet_voice_uri';

/** Persist the user's chosen voice URI to localStorage */
export function setStoredVoiceURI(uri) {
	try {
		if (uri) {
			localStorage.setItem(VOICE_URI_KEY, uri);
		} else {
			localStorage.removeItem(VOICE_URI_KEY);
		}
	} catch {}
}

/** Read the user's stored voice URI, or null if not set */
export function getStoredVoiceURI() {
	try {
		return localStorage.getItem(VOICE_URI_KEY) || null;
	} catch {
		return null;
	}
}

/**
 * Pick the voice to use, in priority order:
 * 1. User-selected voice URI from settings
 * 2. Preferred English voice (Natural / Google / Samantha / Jenny / Guy / Aria / David / Zira)
 * 3. Any English voice
 * 4. First available voice
 */
function resolveVoice(voices) {
	if (!voices || voices.length === 0) return null;

	// 1. User-selected
	const storedUri = getStoredVoiceURI();
	if (storedUri) {
		const match = voices.find((v) => v.voiceURI === storedUri);
		if (match) return match;
	}

	// 2. Preferred English voice names
	const preferred = voices.find(
		(v) =>
			v.lang.startsWith('en') &&
			(v.name.includes('Natural') ||
				v.name.includes('Google') ||
				v.name.includes('Samantha') ||
				v.name.includes('Jenny') ||
				v.name.includes('Guy') ||
				v.name.includes('Aria') ||
				v.name.includes('David') ||
				v.name.includes('Zira') ||
				v.name.includes('Child')),
	);
	if (preferred) return preferred;

	// 3. Any English voice
	const anyEn = voices.find((v) => v.lang.startsWith('en'));
	if (anyEn) return anyEn;

	// 4. Fallback
	return voices[0];
}

let activeUtterance = null; // Hold module-level reference to prevent Chromium garbage collection

/**
 * Web Speech API Voice Narrator for Kids
 * Resilient against Chromium paused state and garbage collection quirks.
 * Always cancels any previous speech before starting a new one (single voice guarantee).
 */
export function speakText(text, onStart = null, onEnd = null) {
	try {
		if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
			console.warn('Speech synthesis not supported on this browser.');
			if (onEnd) onEnd();
			return;
		}

		// Cancel any ongoing speech — guarantees one voice at a time
		if (window.speechSynthesis.paused) {
			window.speechSynthesis.resume();
		}
		window.speechSynthesis.cancel();
		activeUtterance = null;

		const cleaned = cleanTextForSpeech(text);
		if (!cleaned) {
			if (onEnd) onEnd();
			return;
		}

		const utterance = new SpeechSynthesisUtterance(cleaned);
		activeUtterance = utterance; // Prevent garbage collection during speech in V8

		utterance.rate = 0.92; // natural pace for young learners
		utterance.pitch = 1.1; // friendly tone
		utterance.lang = 'en-US';

		// Resolve and apply voice (respects user's saved preference)
		const voices =
			cachedVoices.length > 0 ?
				cachedVoices
			:	window.speechSynthesis.getVoices();
		const voice = resolveVoice(voices);
		if (voice) {
			utterance.voice = voice;
			utterance.lang = voice.lang || 'en-US';
		}

		utterance.onstart = () => {
			if (onStart) onStart();
		};

		utterance.onend = () => {
			activeUtterance = null;
			if (onEnd) onEnd();
		};

		utterance.onerror = (err) => {
			console.warn('Speech synthesis utterance error:', err);
			activeUtterance = null;
			if (onEnd) onEnd();
		};

		// Chromium workaround: small setTimeout ensures cancel() resolves cleanly before speak()
		setTimeout(() => {
			if (window.speechSynthesis.paused) {
				window.speechSynthesis.resume();
			}
			window.speechSynthesis.speak(utterance);
		}, 40);
	} catch (err) {
		console.warn('Speech synthesis error', err);
		if (onEnd) onEnd();
	}
}

export function stopSpeaking() {
	try {
		if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
			window.speechSynthesis.cancel();
		}
		activeUtterance = null;
	} catch (err) {
		console.warn('Speech synthesis stop error', err);
	}
}
