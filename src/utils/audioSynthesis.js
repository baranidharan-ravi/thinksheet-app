// Pure Web Audio API Sound Generator (No external asset files needed, 100% reliable & zero latency)

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

/**
 * Web Speech API Voice Narrator for 5-Year-Old Kids
 */
export function speakText(text) {
	try {
		if (!('speechSynthesis' in window)) return;
		window.speechSynthesis.cancel(); // cancel any ongoing speech

		const utterance = new SpeechSynthesisUtterance(text);
		utterance.rate = 0.9; // slightly slower & friendly
		utterance.pitch = 1.15; // slightly cheerful pitch

		// Pick an English voice if available
		const voices = window.speechSynthesis.getVoices();
		if (voices && voices.length > 0) {
			const preferredVoice = voices.find(
				(v) =>
					(v.name.includes('Natural') ||
						v.name.includes('Google') ||
						v.name.includes('Samantha') ||
						v.name.includes('Child')) &&
					v.lang.startsWith('en'),
			);
			if (preferredVoice) {
				utterance.voice = preferredVoice;
			}
		}

		window.speechSynthesis.speak(utterance);
	} catch (err) {
		console.warn('Speech synthesis error', err);
	}
}

export function stopSpeaking() {
	try {
		if ('speechSynthesis' in window) {
			window.speechSynthesis.cancel();
		}
	} catch (err) {
		console.warn('Speech synthesis stop error', err);
	}
}
