import React, { useState, useEffect } from 'react';
import {
	ArrowLeft,
	Calendar,
	Check,
	Clock,
	ExternalLink,
	Eye,
	EyeOff,
	FastForward,
	Key,
	Minus,
	Plus,
	Rocket,
	Smile,
	Sparkles,
	Timer,
	Zap,
} from 'lucide-react';
import { playButtonPop, speakText } from '../utils/audioSynthesis';
import {
	getStoredApiKey,
	setStoredApiKey,
	validateGeminiApiKey,
} from '../services/aiGenerator';
import {
	getStoredKidAge,
	getStoredKidName,
	getStoredTimerConfig,
	saveStoredKidProfile,
	saveStoredTimerConfig,
} from '../utils/progressTracker';

export default function SettingsScreen({
	onSaveAndReturn,
	onBack,
	soundEnabled = true,
	pendingSkill = null,
}) {
	const [nameInput, setNameInput] = useState(() => getStoredKidName() || '');
	const [ageInput, setAgeInput] = useState(() => getStoredKidAge() || 5);
	const [apiKeyInput, setApiKeyInput] = useState(() => getStoredApiKey() || '');
	const [showApiKey, setShowApiKey] = useState(false);
	const [isCustomAge, setIsCustomAge] = useState(false);

	// Question Timer Challenge state
	const [timerEnabled, setTimerEnabled] = useState(false);
	const [timerSeconds, setTimerSeconds] = useState(90);
	const [isCustomTimer, setIsCustomTimer] = useState(false);

	// Next Question Auto-Advance state
	const [autoAdvanceEnabled, setAutoAdvanceEnabled] = useState(true);
	const [autoAdvanceSeconds, setAutoAdvanceSeconds] = useState(7);
	const [isCustomAutoAdvance, setIsCustomAutoAdvance] = useState(false);

	const [isValidating, setIsValidating] = useState(false);
	const [error, setError] = useState('');
	const [saveSuccess, setSaveSuccess] = useState(false);

	const quickAges = [3, 4, 5, 6, 7, 8];

	useEffect(() => {
		const existingTimer = getStoredTimerConfig();
		setTimerEnabled(Boolean(existingTimer.enabled));
		setTimerSeconds(Number(existingTimer.secondsPerQuestion) || 90);
		setIsCustomTimer(
			![45, 60, 90, 120, 180].includes(
				Number(existingTimer.secondsPerQuestion),
			),
		);

		setAutoAdvanceEnabled(
			existingTimer.autoAdvanceEnabled !== undefined ?
				Boolean(existingTimer.autoAdvanceEnabled)
			:	true,
		);
		setAutoAdvanceSeconds(Number(existingTimer.autoAdvanceSeconds) || 7);
		setIsCustomAutoAdvance(
			![3, 5, 7, 10, 15].includes(Number(existingTimer.autoAdvanceSeconds)),
		);

		setIsCustomAge(!quickAges.includes(Number(getStoredKidAge() || 5)));
	}, []);

	const handleQuickAgeSelect = (age) => {
		playButtonPop(soundEnabled);
		setAgeInput(age);
		setIsCustomAge(false);
		if (error) setError('');
	};

	const handleIncrementAge = (delta) => {
		playButtonPop(soundEnabled);
		const curr = parseInt(ageInput, 10) || 5;
		const nextAge = Math.min(14, Math.max(2, curr + delta));
		setAgeInput(nextAge);
		if (!quickAges.includes(nextAge)) {
			setIsCustomAge(true);
		}
	};

	const handleStepTimer = (delta) => {
		playButtonPop(soundEnabled);
		const curr = timerSeconds || 90;
		const nextSec = Math.min(300, Math.max(15, curr + delta));
		setTimerSeconds(nextSec);
	};

	const handleStepAutoAdvance = (delta) => {
		playButtonPop(soundEnabled);
		const curr = autoAdvanceSeconds || 7;
		const nextSec = Math.min(30, Math.max(2, curr + delta));
		setAutoAdvanceSeconds(nextSec);
	};

	const handleSave = async (e) => {
		if (e) e.preventDefault();
		if (isValidating) return;

		const trimmedName = nameInput.trim();
		if (!trimmedName) {
			setError('Please enter the explorer’s name! 😊');
			return;
		}

		const numAge = parseInt(ageInput, 10);
		if (!numAge || numAge < 2 || numAge > 14) {
			setError('Please select a valid age between 2 and 14 years old! 🎂');
			return;
		}

		const trimmedKey = apiKeyInput.trim();
		if (!trimmedKey) {
			setError(
				'Google Gemini API Key is mandatory for real-time AI questions! 🔑',
			);
			return;
		}

		setError('');
		setIsValidating(true);
		playButtonPop(soundEnabled);

		// Validate API Key live against Gemini API
		const validationResult = await validateGeminiApiKey(trimmedKey);

		if (!validationResult.valid) {
			setIsValidating(false);
			setError(
				validationResult.message ||
					'Invalid Google Gemini API Key. Please verify your key from Google AI Studio.',
			);
			return;
		}

		// 1. Save API Key
		setStoredApiKey(validationResult.cleanedKey);

		// 2. Save Kid Profile
		saveStoredKidProfile(trimmedName, numAge);

		// 3. Save Settings & Timer Config
		const updatedConfig = {
			enabled: timerEnabled,
			secondsPerQuestion: timerSeconds,
			autoAdvanceEnabled,
			autoAdvanceSeconds,
		};
		saveStoredTimerConfig(updatedConfig);

		setIsValidating(false);
		setSaveSuccess(true);

		speakText(`Settings saved for ${trimmedName}!`);

		if (onSaveAndReturn) {
			onSaveAndReturn({
				name: trimmedName,
				age: numAge,
				apiKey: validationResult.cleanedKey,
				timerConfig: updatedConfig,
			});
		}
	};

	const isKeyError =
		error &&
		(error.toLowerCase().includes('key') ||
			error.toLowerCase().includes('gemini') ||
			error.toLowerCase().includes('api'));

	const hasProfile = Boolean(getStoredKidName() && getStoredApiKey());

	return (
		<div className='min-h-screen space-background flex flex-col text-white font-sans overflow-x-hidden select-none py-4 px-3 sm:px-6'>
			{/* Top Bar Header */}
			<div className='max-w-3xl w-full mx-auto flex items-center justify-between gap-4 mb-6'>
				<div className='flex items-center gap-3'>
					{hasProfile && onBack && (
						<button
							onClick={() => {
								playButtonPop(soundEnabled);
								onBack();
							}}
							className='p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-slate-200 hover:text-white transition-all shadow-md cursor-pointer'
							title='Back to Dashboard'>
							<ArrowLeft className='w-5 h-5' />
						</button>
					)}
					<div>
						<h1 className='text-xl sm:text-2xl font-black text-white flex items-center gap-2'>
							<span>Explorer Profile & Settings</span>
							<Sparkles className='w-5 h-5 text-amber-300' />
						</h1>
						<p className='text-xs text-slate-300 font-semibold'>
							Configure child profile, Gemini API Key, and question pacing.
						</p>
					</div>
				</div>

				{pendingSkill && (
					<div className='hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-black shadow'>
						<span>Ready to launch:</span>
						<span className='text-white'>{pendingSkill}</span>
					</div>
				)}
			</div>

			{/* Main Settings Form */}
			<div className='max-w-3xl w-full mx-auto bg-gradient-to-b from-[#1C1F5E]/90 via-[#141846]/95 to-[#0D1030] border-4 border-amber-400/80 rounded-3xl p-5 sm:p-8 shadow-[0_0_60px_rgba(251,191,36,0.25)] flex flex-col gap-6 backdrop-blur-md'>
				{/* Section 1: Child Name & Age */}
				<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
					{/* Name Input */}
					<div className='bg-[#090B24]/80 p-4 rounded-2xl border border-[#2C3380]'>
						<label className='block text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5'>
							<Smile className='w-4 h-4 text-pink-400' />
							<span>
								Child's Name <span className='text-pink-400'>*</span>
							</span>
						</label>
						<input
							type='text'
							maxLength={25}
							disabled={isValidating}
							value={nameInput}
							onChange={(e) => {
								setNameInput(e.target.value);
								if (error) setError('');
							}}
							placeholder='e.g. Leo, Mia, Aaron...'
							className='w-full bg-[#0D1030] border border-[#2C3380] focus:border-pink-400 text-white text-base font-bold rounded-xl px-4 py-3 placeholder:text-slate-500 focus:outline-none transition-all'
						/>
					</div>

					{/* Age Selector */}
					<div className='bg-[#090B24]/80 p-4 rounded-2xl border border-[#2C3380] flex flex-col justify-between'>
						<div className='flex items-center justify-between mb-2'>
							<label className='text-xs font-bold text-slate-300 flex items-center gap-1.5'>
								<Calendar className='w-4 h-4 text-amber-400' />
								<span>
									Child's Age <span className='text-amber-400'>*</span>
								</span>
							</label>
							<span className='text-xs font-black text-pink-300 bg-pink-500/20 px-2.5 py-0.5 rounded-full border border-pink-500/30'>
								🎂 {ageInput} Years Old
							</span>
						</div>

						{/* Quick Ages */}
						<div className='grid grid-cols-7 gap-1 sm:gap-1.5'>
							{quickAges.map((age) => (
								<button
									type='button'
									key={age}
									disabled={isValidating}
									onClick={() => handleQuickAgeSelect(age)}
									className={`py-2 rounded-xl font-black text-xs transition-all border cursor-pointer ${
										!isCustomAge && Number(ageInput) === age ?
											'bg-gradient-to-r from-pink-500 to-rose-500 text-white border-white ring-2 ring-pink-400/50 shadow-md'
										:	'bg-[#0D1030] text-slate-300 border-[#2C3380] hover:bg-[#1E2568]'
									}`}>
									{age}
								</button>
							))}

							<button
								type='button'
								disabled={isValidating}
								onClick={() => {
									playButtonPop(soundEnabled);
									setIsCustomAge(true);
									if (error) setError('');
								}}
								className={`py-2 rounded-xl font-black text-xs transition-all border flex items-center justify-center cursor-pointer ${
									isCustomAge ?
										'bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-white ring-2 ring-cyan-400/50 shadow-md'
									:	'bg-[#0D1030] text-cyan-300 border-[#2C3380] hover:bg-[#1E2568]'
								}`}>
								<span>Edit ✍️</span>
							</button>
						</div>

						{/* Custom Age Stepper */}
						{isCustomAge && (
							<div className='flex items-center gap-2 bg-[#0D1030] border border-cyan-500/50 rounded-xl p-1.5 mt-2 animate-in fade-in duration-200'>
								<button
									type='button'
									disabled={isValidating}
									onClick={() => handleIncrementAge(-1)}
									className='w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center font-bold text-sm cursor-pointer'>
									<Minus className='w-3.5 h-3.5' />
								</button>
								<div className='flex-1 text-center'>
									<input
										type='number'
										min={2}
										max={14}
										disabled={isValidating}
										value={ageInput}
										onChange={(e) => {
											const val = parseInt(e.target.value, 10);
											setAgeInput(isNaN(val) ? '' : val);
											if (error) setError('');
										}}
										className='w-full bg-transparent text-center text-base font-black text-cyan-300 focus:outline-none'
									/>
									<span className='text-[10px] text-slate-400 block -mt-1'>
										(Ages 2 to 14)
									</span>
								</div>
								<button
									type='button'
									disabled={isValidating}
									onClick={() => handleIncrementAge(1)}
									className='w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center font-bold text-sm cursor-pointer'>
									<Plus className='w-3.5 h-3.5' />
								</button>
							</div>
						)}
					</div>
				</div>

				{/* Section 2: Google Gemini API Key (Mandatory with Live Validation) */}
				<div
					className={`bg-[#090B24]/80 p-4 sm:p-5 rounded-2xl border-2 transition-all shadow-inner ${
						isKeyError ?
							'border-rose-500 ring-2 ring-rose-400/40 animate-shake'
						:	'border-amber-400/60'
					}`}>
					<div className='flex items-center justify-between mb-2'>
						<label className='text-xs sm:text-sm font-bold text-amber-300 flex items-center gap-1.5'>
							<Key className='w-4 h-4 text-amber-400' />
							<span>
								Google Gemini API Key{' '}
								<span className='text-rose-400'>* (Mandatory)</span>
							</span>
						</label>
						<a
							href='https://aistudio.google.com/app/apikey'
							target='_blank'
							rel='noopener noreferrer'
							className='text-xs font-bold text-cyan-300 hover:text-cyan-200 underline flex items-center gap-1'>
							<span>Get Free Key from Google</span>
							<ExternalLink className='w-3.5 h-3.5' />
						</a>
					</div>

					<div className='relative flex items-center'>
						<input
							type={showApiKey ? 'text' : 'password'}
							disabled={isValidating}
							value={apiKeyInput}
							onChange={(e) => {
								setApiKeyInput(e.target.value);
								if (error) setError('');
							}}
							placeholder='Paste your Gemini API key here (AIzaSy...)'
							className={`w-full bg-[#0D1030] border text-white font-mono text-xs sm:text-sm rounded-xl pl-4 pr-12 py-3 placeholder:text-slate-500 focus:outline-none transition-all ${
								isKeyError ?
									'border-rose-400 focus:border-rose-500'
								:	'border-amber-400/50 focus:border-amber-400'
							}`}
						/>
						<button
							type='button'
							disabled={isValidating}
							onClick={() => {
								playButtonPop(soundEnabled);
								setShowApiKey((prev) => !prev);
							}}
							className='absolute right-3 p-1.5 rounded-lg text-slate-400 hover:text-amber-300 hover:bg-white/10 transition-all cursor-pointer'
							title={showApiKey ? 'Hide API Key' : 'Show API Key'}>
							{showApiKey ?
								<EyeOff className='w-4 h-4 text-amber-400' />
							:	<Eye className='w-4 h-4' />}
						</button>
					</div>
					<span className='text-[11px] text-slate-400 mt-1.5 block'>
						Required for 100% real-time AI generation. Validated live with
						Google Gemini API upon saving.
					</span>
				</div>

				{/* Section 3: Per-Question Time Limit */}
				<div className='bg-[#090B24]/80 p-4 sm:p-5 rounded-2xl border border-[#2C3380]'>
					<div className='flex items-center justify-between mb-2.5'>
						<div>
							<div className='flex items-center gap-2'>
								<Clock className='w-4 h-4 text-cyan-400' />
								<span className='text-xs sm:text-sm font-bold text-white'>
									Per-Question Time Limit
								</span>
								<span
									className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
										timerEnabled ?
											'bg-amber-400 text-slate-950 shadow'
										:	'bg-slate-800 text-slate-400'
									}`}>
									{timerEnabled ? 'Enabled' : 'Optional'}
								</span>
							</div>
							<p className='text-xs text-slate-400 mt-0.5'>
								Sets a countdown challenge for each individual question.
							</p>
						</div>

						<button
							type='button'
							disabled={isValidating}
							onClick={() => {
								playButtonPop(soundEnabled);
								setTimerEnabled((prev) => !prev);
							}}
							className={`px-3.5 py-1.5 rounded-full text-xs font-black transition-all border cursor-pointer ${
								timerEnabled ?
									'bg-amber-400 text-slate-950 border-amber-300 shadow'
								:	'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
							}`}>
							{timerEnabled ? '⏱️ Timer ON' : 'Timer OFF'}
						</button>
					</div>

					{timerEnabled && (
						<div className='space-y-3 pt-2 animate-in fade-in duration-200 border-t border-white/10'>
							<div className='flex items-center gap-1.5 flex-wrap'>
								{[
									{ label: '45s', sec: 45 },
									{ label: '60s', sec: 60 },
									{ label: '90s (Default)', sec: 90 },
									{ label: '2m', sec: 120 },
									{ label: '3m', sec: 180 },
								].map((preset) => (
									<button
										type='button'
										key={preset.sec}
										disabled={isValidating}
										onClick={() => {
											playButtonPop(soundEnabled);
											setTimerSeconds(preset.sec);
											setIsCustomTimer(false);
										}}
										className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
											timerSeconds === preset.sec && !isCustomTimer ?
												'bg-amber-400 text-slate-950 font-black shadow'
											:	'bg-[#0D1030] text-slate-300 border border-[#2C3380] hover:bg-[#1E2568]'
										}`}>
										{preset.label}
									</button>
								))}

								<button
									type='button'
									disabled={isValidating}
									onClick={() => {
										playButtonPop(soundEnabled);
										setIsCustomTimer((prev) => !prev);
									}}
									className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
										isCustomTimer ?
											'bg-gradient-to-r from-pink-500 to-purple-600 text-white border-white font-black'
										:	'bg-[#0D1030] text-slate-300 border-[#2C3380]'
									}`}>
									Custom ✍️
								</button>
							</div>

							{isCustomTimer && (
								<div className='flex items-center gap-3 bg-[#0D1030] border border-amber-400/50 rounded-xl p-2 max-w-xs'>
									<button
										type='button'
										disabled={isValidating}
										onClick={() => handleStepTimer(-15)}
										className='w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center font-bold text-sm cursor-pointer'>
										<Minus className='w-4 h-4' />
									</button>
									<div className='flex-1 text-center font-mono font-black text-sm text-amber-300'>
										{timerSeconds} seconds
									</div>
									<button
										type='button'
										disabled={isValidating}
										onClick={() => handleStepTimer(15)}
										className='w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center font-bold text-sm cursor-pointer'>
										<Plus className='w-4 h-4' />
									</button>
								</div>
							)}
						</div>
					)}
				</div>

				{/* Section 4: Next Question Auto-Advance Delay (Optional) */}
				<div className='bg-[#090B24]/80 p-4 sm:p-5 rounded-2xl border border-[#2C3380]'>
					<div className='flex items-center justify-between mb-2.5'>
						<div>
							<div className='flex items-center gap-2'>
								<FastForward className='w-4 h-4 text-emerald-400' />
								<span className='text-xs sm:text-sm font-bold text-white'>
									Next Question Auto-Advance
								</span>
								<span
									className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
										autoAdvanceEnabled ?
											'bg-emerald-400 text-slate-950 shadow'
										:	'bg-slate-800 text-slate-400'
									}`}>
									{autoAdvanceEnabled ? 'Auto' : 'Manual'}
								</span>
							</div>
							<p className='text-xs text-slate-400 mt-0.5'>
								{autoAdvanceEnabled ?
									'Automatically loads the next question after solution review.'
								:	'Manual Mode: Solution stays on screen until you tap Next.'}
							</p>
						</div>

						<button
							type='button'
							disabled={isValidating}
							onClick={() => {
								playButtonPop(soundEnabled);
								setAutoAdvanceEnabled((prev) => !prev);
							}}
							className={`px-3.5 py-1.5 rounded-full text-xs font-black transition-all border cursor-pointer ${
								autoAdvanceEnabled ?
									'bg-emerald-400 text-slate-950 border-emerald-300 shadow'
								:	'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
							}`}>
							{autoAdvanceEnabled ? '⏩ Auto ON' : 'Manual (OFF)'}
						</button>
					</div>

					{autoAdvanceEnabled && (
						<div className='space-y-3 pt-2 animate-in fade-in duration-200 border-t border-white/10'>
							<div className='flex items-center gap-1.5 flex-wrap'>
								{[
									{ label: '3s', sec: 3 },
									{ label: '5s', sec: 5 },
									{ label: '7s (Default)', sec: 7 },
									{ label: '10s', sec: 10 },
									{ label: '15s', sec: 15 },
								].map((preset) => (
									<button
										type='button'
										key={preset.sec}
										disabled={isValidating}
										onClick={() => {
											playButtonPop(soundEnabled);
											setAutoAdvanceSeconds(preset.sec);
											setIsCustomAutoAdvance(false);
										}}
										className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
											autoAdvanceSeconds === preset.sec && !isCustomAutoAdvance ?
												'bg-emerald-400 text-slate-950 font-black shadow'
											:	'bg-[#0D1030] text-slate-300 border border-[#2C3380] hover:bg-[#1E2568]'
										}`}>
										{preset.label}
									</button>
								))}

								<button
									type='button'
									disabled={isValidating}
									onClick={() => {
										playButtonPop(soundEnabled);
										setIsCustomAutoAdvance((prev) => !prev);
									}}
									className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
										isCustomAutoAdvance ?
											'bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-white font-black'
										:	'bg-[#0D1030] text-slate-300 border-[#2C3380]'
									}`}>
									Custom ✍️
								</button>
							</div>

							{isCustomAutoAdvance && (
								<div className='flex items-center gap-3 bg-[#0D1030] border border-emerald-400/50 rounded-xl p-2 max-w-xs'>
									<button
										type='button'
										disabled={isValidating}
										onClick={() => handleStepAutoAdvance(-1)}
										className='w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center font-bold text-sm cursor-pointer'>
										<Minus className='w-4 h-4' />
									</button>
									<div className='flex-1 text-center font-mono font-black text-sm text-emerald-300'>
										{autoAdvanceSeconds} seconds delay
									</div>
									<button
										type='button'
										disabled={isValidating}
										onClick={() => handleStepAutoAdvance(1)}
										className='w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center font-bold text-sm cursor-pointer'>
										<Plus className='w-4 h-4' />
									</button>
								</div>
							)}
						</div>
					)}
				</div>

				{/* Error Alert */}
				{error && (
					<div className='bg-rose-500/20 border border-rose-500/50 rounded-2xl p-4 text-xs sm:text-sm font-bold text-rose-200 text-center animate-shake shadow-lg'>
						⚠️ {error}
					</div>
				)}

				{/* Save / Launch Action Bar */}
				<div className='flex flex-col sm:flex-row gap-3 items-center justify-end pt-2 border-t border-white/10'>
					{hasProfile && onBack && (
						<button
							type='button'
							disabled={isValidating}
							onClick={() => {
								playButtonPop(soundEnabled);
								onBack();
							}}
							className='w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm transition-all cursor-pointer'>
							Cancel
						</button>
					)}

					<button
						type='button'
						disabled={isValidating}
						onClick={handleSave}
						className={`w-full sm:w-auto px-8 py-4 rounded-2xl font-black text-sm sm:text-base tracking-wider uppercase shadow-[0_10px_25px_rgba(245,158,11,0.4)] transition-all flex items-center justify-center gap-2.5 ${
							isValidating ?
								'bg-gradient-to-r from-amber-600 via-pink-600 to-purple-700 opacity-90 cursor-wait animate-pulse text-white'
							:	'bg-gradient-to-r from-amber-400 via-pink-500 to-purple-600 hover:opacity-95 text-white hover:scale-105 active:scale-95 cursor-pointer'
						}`}>
						{isValidating ?
							<>
								<Sparkles className='w-5 h-5 text-amber-300 animate-spin' />
								<span>Validating Key with Gemini... ⏳</span>
							</>
						: pendingSkill ?
							<>
								<Rocket className='w-5 h-5 text-amber-300' />
								<span>Save & Launch {pendingSkill} 🚀</span>
							</>
						:	<>
								<Check className='w-5 h-5 stroke-[3]' />
								<span>Save Settings 🚀</span>
							</>
						}
					</button>
				</div>
			</div>
		</div>
	);
}
