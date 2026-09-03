import {
	AlertTriangle,
	ArrowLeft,
	Calendar,
	Check,
	Clock,
	Cpu,
	ExternalLink,
	Eye,
	EyeOff,
	FastForward,
	Key,
	Minus,
	Plus,
	RefreshCw,
	Rocket,
	Smile,
	Sparkles,
} from 'lucide-react';
import { memo, useEffect, useState } from 'react';
import {
	fetchOnlineGeminiModels,
	getAvailableGeminiModels,
	getStoredApiKey,
	getStoredSelectedModel,
	setStoredApiKey,
	setStoredSelectedModel,
	validateGeminiApiKey,
} from '../../services/aiGenerator';
import { playButtonPop, speakText } from '../../utils/audioSynthesis';
import {
	getStoredKidAge,
	getStoredKidName,
	getStoredShowVisualDiagrams,
	getStoredTimerConfig,
	saveStoredKidProfile,
	saveStoredShowVisualDiagrams,
	saveStoredTimerConfig,
} from '../../utils/progressTracker';

const SettingsScreen = memo(function SettingsScreen({
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
	const [showVisualDiagrams, setShowVisualDiagrams] = useState(
		getStoredShowVisualDiagrams,
	);

	// Gemini Model selection state
	const [selectedModel, setSelectedModel] = useState(() =>
		getStoredSelectedModel(),
	);

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

	// Dynamic Models State
	const [modelsList, setModelsList] = useState(() =>
		getAvailableGeminiModels(),
	);
	const [isFetchingModels, setIsFetchingModels] = useState(false);
	const [fetchModelStatus, setFetchModelStatus] = useState(null);

	const quickAges = [3, 4, 5, 6, 7, 8];

	const handleFetchLiveModels = async () => {
		playButtonPop(soundEnabled);
		const targetKey = apiKey.trim() || getStoredApiKey();
		if (!targetKey) {
			setFetchModelStatus({
				type: 'error',
				text: 'Please enter your Gemini API key in the field above before fetching live models.',
			});
			return;
		}

		setIsFetchingModels(true);
		setFetchModelStatus(null);
		try {
			const liveModels = await fetchOnlineGeminiModels(targetKey);
			setModelsList(liveModels);
			setFetchModelStatus({
				type: 'success',
				text: `✓ Successfully fetched ${liveModels.length} live Gemini models from Google AI!`,
			});
		} catch (err) {
			setFetchModelStatus({
				type: 'error',
				text:
					err.message ||
					'Could not fetch models from Google Gemini API. Please check your API key.',
			});
		} finally {
			setIsFetchingModels(false);
		}
	};

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

		// Validate API Key live against the selected Gemini model
		const validationResult = await validateGeminiApiKey(
			trimmedKey,
			selectedModel,
		);

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

		// 2. Save Selected Gemini Model
		setStoredSelectedModel(selectedModel);

		// 3. Save Kid Profile
		saveStoredKidProfile(trimmedName, numAge);

		// 4. Save Settings, Timer Config & Visual Diagrams Preference
		const updatedConfig = {
			enabled: timerEnabled,
			secondsPerQuestion: timerSeconds,
			autoAdvanceEnabled,
			autoAdvanceSeconds,
		};
		saveStoredTimerConfig(updatedConfig);
		saveStoredShowVisualDiagrams(showVisualDiagrams);

		setIsValidating(false);
		setSaveSuccess(true);

		speakText(`Settings saved for ${trimmedName}!`);

		if (onSaveAndReturn) {
			onSaveAndReturn({
				name: trimmedName,
				age: numAge,
				apiKey: validationResult.cleanedKey,
				selectedModel,
				timerConfig: updatedConfig,
				showVisualDiagrams,
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
							Configure child profile, Gemini API Key, AI model, and question
							pacing.
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
					{/* Name Card */}
					<div className='bg-[#090B24]/80 p-4 sm:p-5 rounded-2xl border border-[#2C3380]'>
						<label className='text-xs sm:text-sm font-bold text-slate-200 flex items-center gap-1.5 mb-2'>
							<Smile className='w-4 h-4 text-pink-400' />
							<span>Child's Name</span>
						</label>
						<input
							type='text'
							maxLength={30}
							disabled={isValidating}
							value={nameInput}
							onChange={(e) => {
								setNameInput(e.target.value);
								if (error) setError('');
							}}
							placeholder='e.g. Leo, Maya, Alex...'
							className='w-full bg-[#0D1030] border border-pink-500/40 focus:border-pink-400 text-white font-bold text-sm sm:text-base rounded-xl px-4 py-3 placeholder:text-slate-500 focus:outline-none transition-all'
						/>
						<span className='text-[11px] text-slate-400 mt-1.5 block'>
							Used to personalize questions, voice feedback & reports.
						</span>
					</div>

					{/* Age Card */}
					<div className='bg-[#090B24]/80 p-4 sm:p-5 rounded-2xl border border-[#2C3380]'>
						<div className='flex items-center justify-between mb-2'>
							<label className='text-xs sm:text-sm font-bold text-slate-200 flex items-center gap-1.5'>
								<Calendar className='w-4 h-4 text-cyan-400' />
								<span>Child's Age</span>
							</label>
							<span className='text-xs font-black text-cyan-300 bg-cyan-950/80 border border-cyan-500/40 px-2 py-0.5 rounded-full'>
								{ageInput} Years Old
							</span>
						</div>

						{/* Quick Selection Pills */}
						<div className='grid grid-cols-3 sm:grid-cols-6 gap-1.5'>
							{quickAges.map((age) => (
								<button
									key={age}
									type='button'
									disabled={isValidating}
									onClick={() => handleQuickAgeSelect(age)}
									className={`py-2 rounded-xl text-xs font-black transition-all border cursor-pointer ${
										Number(ageInput) === age && !isCustomAge ?
											'bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-cyan-300 shadow-md scale-105'
										:	'bg-[#0D1030] text-slate-300 border-slate-700/80 hover:bg-slate-800'
									}`}>
									{age} yo
								</button>
							))}
						</div>

						{/* Custom Age Toggle */}
						<div className='flex items-center justify-between mt-2 pt-2 border-t border-white/10'>
							<span className='text-[11px] text-slate-400'>
								Other Age (2 to 14):
							</span>
							<button
								type='button'
								disabled={isValidating}
								onClick={() => {
									playButtonPop(soundEnabled);
									setIsCustomAge((prev) => !prev);
								}}
								className={`text-[11px] font-bold px-2 py-0.5 rounded-lg border transition-all cursor-pointer ${
									isCustomAge ?
										'bg-cyan-500/30 text-cyan-300 border-cyan-400'
									:	'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
								}`}>
								{isCustomAge ? 'Custom Stepper Active' : 'Change Age Range'}
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

				{/* Section 3: Gemini AI Model Engine Selection */}
				<div className='bg-[#090B24]/80 p-4 sm:p-5 rounded-2xl border border-cyan-500/40 shadow-inner'>
					<div className='flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-2.5'>
						<div className='flex items-center gap-2'>
							<Cpu className='w-4 h-4 text-cyan-400' />
							<span className='text-xs sm:text-sm font-bold text-white'>
								Gemini AI Model Engine
							</span>
						</div>
						<div className='flex items-center gap-2 flex-wrap'>
							<button
								type='button'
								disabled={isFetchingModels || isValidating}
								onClick={handleFetchLiveModels}
								className='flex items-center gap-1.5 px-3 py-1 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/50 text-cyan-300 font-bold text-[11px] shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50'>
								<RefreshCw
									className={`w-3.5 h-3.5 ${
										isFetchingModels ? 'animate-spin text-cyan-200' : ''
									}`}
								/>
								<span>
									{isFetchingModels ?
										'Fetching Models...'
									:	'Fetch Latest Models 🔄'}
								</span>
							</button>
							<span className='text-[10px] font-black px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'>
								Active:{' '}
								{modelsList.find((m) => m.id === selectedModel)?.name ||
									selectedModel}
							</span>
						</div>
					</div>

					<p className='text-xs text-slate-300 mb-2'>
						Select which Google Gemini AI model generates questions in real
						time:
					</p>

					{fetchModelStatus && (
						<div
							className={`mb-3 p-2.5 rounded-xl text-xs font-semibold border flex items-center justify-between gap-2 ${
								fetchModelStatus.type === 'success' ?
									'bg-emerald-500/20 border-emerald-400 text-emerald-200'
								:	'bg-rose-500/20 border-rose-400 text-rose-200'
							}`}>
							<span>{fetchModelStatus.text}</span>
							<button
								type='button'
								onClick={() => setFetchModelStatus(null)}
								className='text-slate-400 hover:text-white text-xs font-black cursor-pointer px-1'>
								✕
							</button>
						</div>
					)}

					<div className='grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[360px] overflow-y-auto pr-1'>
						{modelsList.map((model) => {
							const isSelected = selectedModel === model.id;
							return (
								<button
									key={model.id}
									type='button'
									disabled={isValidating || isFetchingModels}
									onClick={() => {
										playButtonPop(soundEnabled);
										setSelectedModel(model.id);
										if (error) setError('');
									}}
									className={`p-3.5 rounded-2xl border text-left transition-all relative cursor-pointer flex flex-col justify-between gap-1.5 ${
										isSelected ?
											'bg-cyan-500/20 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.35)] ring-2 ring-cyan-400/50'
										:	'bg-[#0D1030] border-slate-700/80 hover:border-slate-500 hover:bg-[#121644]'
									}`}>
									<div className='flex items-center justify-between gap-2'>
										<span
											className={`text-xs font-black ${
												isSelected ? 'text-cyan-300' : 'text-white'
											}`}>
											{model.name}
										</span>
										<span
											className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${model.badgeColor}`}>
											{model.badge}
										</span>
									</div>
									<div className='text-[11px] font-bold text-slate-300 flex items-center gap-1'>
										<span>{model.tag}</span>
									</div>
									<p className='text-[10px] text-slate-400 leading-snug'>
										{model.description}
									</p>
									{isSelected && (
										<div className='absolute top-3 right-3 w-4 h-4 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center shadow'>
											<Check className='w-3 h-3 stroke-[3]' />
										</div>
									)}
								</button>
							);
						})}
					</div>
				</div>

				{/* Section 4: Per-Question Time Limit */}
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
										key={preset.sec}
										type='button'
										disabled={isValidating}
										onClick={() => {
											playButtonPop(soundEnabled);
											setTimerSeconds(preset.sec);
											setIsCustomTimer(false);
										}}
										className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all border cursor-pointer ${
											timerSeconds === preset.sec && !isCustomTimer ?
												'bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 border-amber-300 shadow-md font-black'
											:	'bg-[#0D1030] text-slate-300 border-slate-700 hover:bg-slate-800'
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
											'bg-amber-400/30 text-amber-300 border-amber-400'
										:	'bg-[#0D1030] text-slate-400 border-slate-700 hover:text-white'
									}`}>
									Custom Duration
								</button>
							</div>

							{isCustomTimer && (
								<div className='flex items-center gap-3 bg-[#0D1030] border border-amber-500/40 rounded-xl p-2 max-w-xs animate-in fade-in duration-200'>
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

				{/* Section 5: Next Question Auto-Advance Delay */}
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
									{autoAdvanceEnabled ? 'Auto-Next Active' : 'Manual Next'}
								</span>
							</div>
							<p className='text-xs text-slate-400 mt-0.5'>
								Controls how long the solution is displayed before moving to the
								next question.
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
							{autoAdvanceEnabled ? '⏩ Auto Next ON' : 'Manual Next'}
						</button>
					</div>

					{!autoAdvanceEnabled && (
						<div className='p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300 font-semibold'>
							💡 <strong>Manual Next Mode:</strong> The solution stays on screen
							indefinitely until you click <em>Next Question ➔</em>.
						</div>
					)}

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
										key={preset.sec}
										type='button'
										disabled={isValidating}
										onClick={() => {
											playButtonPop(soundEnabled);
											setAutoAdvanceSeconds(preset.sec);
											setIsCustomAutoAdvance(false);
										}}
										className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all border cursor-pointer ${
											(
												autoAdvanceSeconds === preset.sec &&
												!isCustomAutoAdvance
											) ?
												'bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 border-emerald-300 shadow-md font-black'
											:	'bg-[#0D1030] text-slate-300 border-slate-700 hover:bg-slate-800'
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
											'bg-emerald-400/30 text-emerald-300 border-emerald-400'
										:	'bg-[#0D1030] text-slate-400 border-slate-700 hover:text-white'
									}`}>
									Custom Delay
								</button>
							</div>

							{isCustomAutoAdvance && (
								<div className='flex items-center gap-3 bg-[#0D1030] border border-emerald-500/40 rounded-xl p-2 max-w-xs animate-in fade-in duration-200'>
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

				{/* Section 6: Visual Diagrams & Clues Display */}
				<div className='bg-[#090B24]/80 p-4 sm:p-5 rounded-2xl border border-indigo-500/40 shadow-inner'>
					<div className='flex items-center justify-between mb-2'>
						<div className='flex items-center gap-2'>
							<Eye className='w-4 h-4 text-indigo-400' />
							<span className='text-xs sm:text-sm font-bold text-white'>
								Visual Diagrams & Clues
							</span>
							<span
								className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
									showVisualDiagrams ?
										'bg-indigo-500 text-white shadow'
									:	'bg-slate-800 text-slate-400'
								}`}>
								{showVisualDiagrams ? 'Enabled' : 'Disabled'}
							</span>
						</div>

						<button
							type='button'
							disabled={isValidating}
							onClick={() => {
								playButtonPop(soundEnabled);
								setShowVisualDiagrams((prev) => !prev);
							}}
							className={`px-3.5 py-1.5 rounded-full text-xs font-black transition-all border cursor-pointer ${
								showVisualDiagrams ?
									'bg-indigo-500 text-white border-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.4)]'
								:	'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
							}`}>
							{showVisualDiagrams ? '👁️ Shown' : '🙈 Hidden'}
						</button>
					</div>

					<p className='text-xs text-slate-300 leading-relaxed'>
						Choose whether interactive visual diagrams, 3x3 matrices, sequence
						patterns, and STEM illustrations appear alongside questions and option choices.
					</p>

					{/* Warning Notice for Dynamic Visual Generation */}
					<div className='mt-3 p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs flex items-start gap-2.5'>
						<AlertTriangle className='w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5' />
						<div className='leading-relaxed'>
							<span className='font-bold text-amber-300'>Note on Dynamic Visual Generation:</span>{' '}
							Visual diagrams and option shapes are dynamically synthesized based on algorithmic models and AI prompts. Occasional visual discrepancies or slight mismatches between the text and rendered shapes may occur.
						</div>
					</div>
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
});

export default SettingsScreen;
