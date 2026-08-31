import { useEffect, useState } from 'react';
import AISetupModal from './components/AISetupModal';
import AskDoubtModal from './components/AskDoubtModal';
import Header from './components/Header';
import HintModal from './components/HintModal';
import KidNameModal from './components/KidNameModal';
import NewSheetModal from './components/NewSheetModal';
import OptionsGrid from './components/OptionsGrid';
import QuestionCard from './components/QuestionCard';
import QuestionSummary from './components/QuestionSummary';
import ResultOverview from './components/ResultOverview';
import SkillSelectionDashboard from './components/SkillSelectionDashboard';
import SolutionPanel from './components/SolutionPanel';
import ZoomModal from './components/ZoomModal';

import confetti from 'canvas-confetti';
import { ArrowLeft, Key, RefreshCw, Sparkles, Zap } from 'lucide-react';
import { getStoredApiKey } from './services/aiGenerator';
import {
	getFreshThinksheetSession,
	prefetchThinksheetSession,
} from './services/questionService';
import {
	playButtonPop,
	playCorrectSound,
	playIncorrectSound,
	speakText,
} from './utils/audioSynthesis';
import {
	getStoredKidAge,
	getStoredKidName,
	loadProfileStats,
	recordCompletedSheet,
	saveStoredKidProfile,
} from './utils/progressTracker';
import {
	clearSessionState,
	exportSessionToFile,
	saveSessionState,
} from './utils/storage';

export default function App() {
	// Kid Profile & Name State
	const [kidName, setKidName] = useState(getStoredKidName);
	const [kidAge, setKidAge] = useState(getStoredKidAge);
	const [isNameModalOpen, setIsNameModalOpen] = useState(
		() => !getStoredKidName(),
	);

	// Navigation State
	const [currentScreen, setCurrentScreen] = useState('dashboard'); // 'dashboard' | 'thinksheet'
	const [selectedSkill, setSelectedSkill] = useState('Visual'); // 'Visual' | 'Analytical Thinking'
	const [profileStats, setProfileStats] = useState(loadProfileStats);

	// Thinksheet Session State
	const [sheetNumber, setSheetNumber] = useState(1);
	const [questions, setQuestions] = useState([]);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [selectedOptionId, setSelectedOptionId] = useState(null);
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [history, setHistory] = useState([]);
	const [xp, setXp] = useState(0);
	const [timerSeconds, setTimerSeconds] = useState(0);
	const [isCompleted, setIsCompleted] = useState(false);
	const [resultTab, setResultTab] = useState('overview'); // 'overview' | 'summary'
	const [isLoadingSheet, setIsLoadingSheet] = useState(false);
	const [aiError, setAiError] = useState(null); // null | 'MISSING_KEY' | 'API_ERROR' | 'GENERIC_ERROR'

	// Settings & Audio Controls
	const [soundEnabled, setSoundEnabled] = useState(true);
	const [speechEnabled, setSpeechEnabled] = useState(true);

	// Modals
	const [isHintOpen, setIsHintOpen] = useState(false);
	const [isZoomOpen, setIsZoomOpen] = useState(false);
	const [isNewSheetOpen, setIsNewSheetOpen] = useState(false);
	const [isAskDoubtOpen, setIsAskDoubtOpen] = useState(false);
	const [isAiSetupOpen, setIsAiSetupOpen] = useState(false);

	// Always start with the skill selection dashboard on load
	useEffect(() => {
		setCurrentScreen('dashboard');
	}, []);

	// Background pre-fetch sessions when on dashboard for instant opening (0ms wait)
	useEffect(() => {
		if (currentScreen === 'dashboard' && getStoredApiKey()) {
			prefetchThinksheetSession('Visual', 1, kidAge);
			prefetchThinksheetSession('Analytical Thinking', 1, kidAge);
		}
	}, [currentScreen, kidAge]);

	// Save session state to localStorage
	useEffect(() => {
		if (
			questions.length > 0 &&
			!isLoadingSheet &&
			currentScreen === 'thinksheet' &&
			!aiError
		) {
			saveSessionState({
				currentScreen,
				selectedSkill,
				sheetNumber,
				questions,
				currentIndex,
				selectedOptionId,
				isSubmitted,
				history,
				xp,
				timerSeconds,
				isCompleted,
			});
		}
	}, [
		currentScreen,
		selectedSkill,
		sheetNumber,
		questions,
		currentIndex,
		selectedOptionId,
		isSubmitted,
		history,
		xp,
		timerSeconds,
		isCompleted,
		isLoadingSheet,
		aiError,
	]);

	// Live Timer
	useEffect(() => {
		if (
			isCompleted ||
			isLoadingSheet ||
			currentScreen !== 'thinksheet' ||
			aiError
		)
			return;
		const interval = setInterval(() => {
			setTimerSeconds((prev) => prev + 1);
		}, 1000);
		return () => clearInterval(interval);
	}, [isCompleted, isLoadingSheet, currentScreen, aiError]);

	// Current Question Object
	const currentQuestion = questions[currentIndex] || {};

	// Auto-read question for kids
	useEffect(() => {
		if (
			speechEnabled &&
			currentQuestion &&
			!isCompleted &&
			!isSubmitted &&
			!isLoadingSheet &&
			!aiError &&
			currentScreen === 'thinksheet'
		) {
			const textToRead =
				currentQuestion.promptAudio || currentQuestion.question;
			speakText(textToRead);
		}
	}, [
		currentIndex,
		isCompleted,
		sheetNumber,
		isLoadingSheet,
		currentScreen,
		aiError,
	]);

	// Handle saving kid's profile (name and age)
	const handleSaveKidProfile = ({ name, age }) => {
		saveStoredKidProfile(name, age);
		setKidName(name);
		setKidAge(age);
		setIsNameModalOpen(false);
	};

	// Start Sheet for a selected skill (100% Real-Time AI Generation)
	const handleSelectSkill = async (skill) => {
		setSelectedSkill(skill);
		setIsLoadingSheet(true);
		setAiError(null);
		setCurrentScreen('thinksheet');
		setCurrentIndex(0);
		setSelectedOptionId(null);
		setIsSubmitted(false);
		setHistory([]);
		setTimerSeconds(0);
		setIsCompleted(false);

		try {
			const freshQuestions = await getFreshThinksheetSession(skill, 1, kidAge);
			setQuestions(freshQuestions);
		} catch (err) {
			console.error('AI Question Generation Failed:', err);
			if (err.message === 'MISSING_API_KEY') {
				setAiError('MISSING_KEY');
			} else {
				setAiError('API_ERROR');
			}
		} finally {
			setIsLoadingSheet(false);
		}
	};

	// Handle Option Select
	const handleSelectOption = (optionId) => {
		if (isSubmitted) return;
		setSelectedOptionId(optionId);
	};

	// Handle Submit
	const handleSubmit = () => {
		if (!selectedOptionId || isSubmitted) return;

		const isCorrect = selectedOptionId === currentQuestion.correctAnswerId;
		setIsSubmitted(true);

		if (isCorrect) {
			playCorrectSound(soundEnabled);
			setXp((prev) => prev + 5);

			// Trigger Confetti Celebration
			try {
				confetti({
					particleCount: 90,
					spread: 70,
					origin: { y: 0.6 },
					colors: ['#00D166', '#FFD166', '#00E5FF', '#FF5B84', '#B845ED'],
					shapes: ['star', 'circle'],
					scalar: 1.2,
				});
			} catch (err) {
				console.warn('Confetti error', err);
			}

			if (speechEnabled) {
				speakText('Correct! Great thinking! You got it right.');
			}
		} else {
			playIncorrectSound(soundEnabled);
			if (speechEnabled) {
				speakText("Don't worry! Let's look at the solution to see why.");
			}
		}

		// Save to history
		const newHistory = [...history];
		newHistory[currentIndex] = {
			questionId: currentQuestion.id,
			selectedOptionId,
			isCorrect,
			timestamp: Date.now(),
		};
		setHistory(newHistory);
	};

	// Handle Next Question
	const handleNext = () => {
		playButtonPop(soundEnabled);

		if (currentIndex + 1 < questions.length) {
			setCurrentIndex((prev) => prev + 1);
			setSelectedOptionId(null);
			setIsSubmitted(false);
		} else {
			// Completed all 10 questions!
			const correctCount = history.filter((h) => h && h.isCorrect).length;
			const score = Math.round((correctCount / questions.length) * 100);

			// Update and record profile stats
			const updatedProfile = recordCompletedSheet(selectedSkill, score);
			setProfileStats(updatedProfile);

			setIsCompleted(true);
			setResultTab('overview');
		}
	};

	// Start Next Sheet in same skill
	const handleStartNextSheet = async () => {
		playButtonPop(soundEnabled);
		setIsLoadingSheet(true);
		setAiError(null);

		const nextSheetNum = sheetNumber + 1;
		try {
			const newQuestions = await getFreshThinksheetSession(
				selectedSkill,
				nextSheetNum,
				kidAge,
			);
			setSheetNumber(nextSheetNum);
			setQuestions(newQuestions);
			setCurrentIndex(0);
			setSelectedOptionId(null);
			setIsSubmitted(false);
			setHistory([]);
			setIsCompleted(false);
			setResultTab('overview');
		} catch (err) {
			console.error('AI Next Sheet Failed:', err);
			if (err.message === 'MISSING_API_KEY') {
				setAiError('MISSING_KEY');
			} else {
				setAiError('API_ERROR');
			}
		} finally {
			setIsLoadingSheet(false);
		}
	};

	// Download Sheet Progress
	const handleDownloadSheet = () => {
		playButtonPop(soundEnabled);
		exportSessionToFile(
			{
				studentName: kidName || 'Explorer',
				studentAge: kidAge || 5,
				selectedSkill,
				sheetNumber,
				date: new Date().toISOString(),
				scorePercent,
				correctCount,
				totalQuestions: questions.length,
				xp,
				timerSeconds,
				questions,
				history,
			},
			`Thinksheet_${kidName || 'Explorer'}_Age${kidAge}_${selectedSkill}_Sheet${sheetNumber}_${Date.now()}.json`,
		);
	};

	// Confirm Creating a New Sheet
	const handleConfirmNewSheet = async () => {
		clearSessionState();
		setIsNewSheetOpen(false);
		setIsLoadingSheet(true);
		setAiError(null);

		try {
			const freshQuestions = await getFreshThinksheetSession(
				selectedSkill,
				sheetNumber + 1,
				kidAge,
			);
			setSheetNumber((prev) => prev + 1);
			setQuestions(freshQuestions);
			setCurrentIndex(0);
			setSelectedOptionId(null);
			setIsSubmitted(false);
			setHistory([]);
			setTimerSeconds(0);
			setIsCompleted(false);
		} catch (err) {
			console.error('AI Confirm New Sheet Failed:', err);
			if (err.message === 'MISSING_API_KEY') {
				setAiError('MISSING_KEY');
			} else {
				setAiError('API_ERROR');
			}
		} finally {
			setIsLoadingSheet(false);
		}
	};

	// Calculate score
	const correctCount = history.filter((h) => h && h.isCorrect).length;
	const scorePercent =
		questions.length > 0 ?
			Math.round((correctCount / questions.length) * 100)
		:	0;

	// Render Skill Selection Dashboard
	if (currentScreen === 'dashboard') {
		return (
			<>
				<SkillSelectionDashboard
					profileStats={profileStats}
					onSelectSkill={handleSelectSkill}
					soundEnabled={soundEnabled}
					kidName={kidName}
					kidAge={kidAge}
					onEditKidName={() => setIsNameModalOpen(true)}
				/>
				<KidNameModal
					isOpen={isNameModalOpen}
					onSaveProfile={handleSaveKidProfile}
					currentName={kidName}
					currentAge={kidAge}
					soundEnabled={soundEnabled}
				/>
			</>
		);
	}

	// Render Active Thinksheet Session
	return (
		<div className='min-h-screen space-background flex flex-col justify-between text-white font-sans overflow-x-hidden relative'>
			{/* Top Header */}
			<Header
				questionIndex={currentIndex}
				totalQuestions={questions.length || 10}
				history={history}
				xp={xp}
				timerSeconds={timerSeconds}
				soundEnabled={soundEnabled}
				onToggleSound={() => setSoundEnabled((prev) => !prev)}
				speechEnabled={speechEnabled}
				onToggleSpeech={() => setSpeechEnabled((prev) => !prev)}
				onDownloadClick={handleDownloadSheet}
				onCreateNewSheetClick={() => setIsNewSheetOpen(true)}
				onHomeClick={() => setCurrentScreen('dashboard')}
			/>

			{/* Main Screen Body */}
			<main className='flex-1 flex flex-col justify-center items-center px-3 sm:px-6 py-2 sm:py-4 w-full max-w-7xl mx-auto'>
				{isLoadingSheet ?
					/* Loading Cosmic State */
					<div className='flex flex-col items-center justify-center p-12 text-center animate-in fade-in'>
						<div className='w-20 h-20 rounded-3xl bg-gradient-to-tr from-pink-500 to-indigo-600 flex items-center justify-center shadow-2xl animate-bounce mb-6'>
							<Sparkles className='w-10 h-10 text-amber-300 animate-spin-slow' />
						</div>
						<h2 className='text-2xl sm:text-3xl font-black text-white mb-2'>
							Generating {selectedSkill} Challenges via AI... 🤖
						</h2>
						<p className='text-sm sm:text-base font-bold text-cyan-300'>
							Synthesizing 10 brand-new puzzles for {kidName || 'Explorer'} (Age{' '}
							{kidAge})...
						</p>
					</div>
				: aiError ?
					/* AI Error / API Key Setup Prompt Screen */
					<div className='w-full max-w-xl mx-auto p-6 sm:p-8 bg-gradient-to-b from-[#1C1F5E] via-[#141846] to-[#0D1030] border-4 border-amber-400/80 rounded-3xl shadow-2xl text-center animate-in fade-in'>
						<div className='w-16 h-16 rounded-3xl bg-amber-400/20 border border-amber-400/50 flex items-center justify-center mx-auto mb-4 text-amber-300'>
							<Key className='w-8 h-8' />
						</div>

						<h2 className='text-xl sm:text-2xl font-black text-white mb-2'>
							{aiError === 'MISSING_KEY' ?
								'Google Gemini API Key Required'
							:	'AI Generation Connection Error'}
						</h2>

						<p className='text-sm text-slate-300 font-semibold mb-6 leading-relaxed'>
							{aiError === 'MISSING_KEY' ?
								'All thinksheet challenges are generated live by Google Gemini AI. Please configure your API key to start generating customized questions.'
							:	'Unable to connect to the Gemini AI API. Please check your internet connection or verify your API key in AI Setup.'
							}
						</p>

						<div className='flex flex-col sm:flex-row gap-3 justify-center'>
							<button
								onClick={() => {
									playButtonPop(soundEnabled);
									setIsAiSetupOpen(true);
								}}
								className='px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black text-sm sm:text-base shadow-lg flex items-center justify-center gap-2 transform hover:scale-105 transition-all'>
								<Sparkles className='w-4 h-4' />
								<span>Configure Gemini API Key</span>
							</button>

							<button
								onClick={() => handleSelectSkill(selectedSkill)}
								className='px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm flex items-center justify-center gap-2'>
								<RefreshCw className='w-4 h-4' />
								<span>Try Again</span>
							</button>

							<button
								onClick={() => {
									playButtonPop(soundEnabled);
									setCurrentScreen('dashboard');
								}}
								className='px-4 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm flex items-center justify-center gap-1.5'>
								<ArrowLeft className='w-4 h-4' />
								<span>Skills Hub</span>
							</button>
						</div>
					</div>
				: !isCompleted ?
					/* Question Playing View */
					<div className='w-full flex flex-col justify-center'>
						{/* Layout when NOT submitted */}
						{!isSubmitted ?
							<div className='grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-stretch'>
								{/* Left: Question Card */}
								<div className='lg:col-span-6 flex flex-col'>
									<QuestionCard
										question={currentQuestion}
										currentIndex={currentIndex}
										totalQuestions={questions.length}
										onZoomClick={() => setIsZoomOpen(true)}
										soundEnabled={soundEnabled}
									/>
								</div>

								{/* Right: Options 2x2 Grid + Submit Bar */}
								<div className='lg:col-span-6 flex flex-col justify-between gap-4'>
									<OptionsGrid
										options={currentQuestion.options || []}
										selectedOptionId={selectedOptionId}
										onSelectOption={handleSelectOption}
										isSubmitted={false}
										correctAnswerId={currentQuestion.correctAnswerId}
										soundEnabled={soundEnabled}
									/>

									{/* Action Bar directly below Options on right */}
									<div className='flex items-center justify-end gap-3 mt-2 select-none'>
										{/* Power-up Hint Button */}
										<button
											onClick={() => {
												playButtonPop(soundEnabled);
												setIsHintOpen(true);
											}}
											className='w-12 h-12 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 hover:scale-110 active:scale-95 text-white flex items-center justify-center shadow-lg transition-all border-2 border-white/40 flex-shrink-0'
											title='Hint Clue'>
											<Zap className='w-6 h-6 fill-white' />
										</button>

										{/* Submit Button */}
										<button
											disabled={!selectedOptionId}
											onClick={handleSubmit}
											className={`px-8 sm:px-12 py-3.5 sm:py-4 rounded-full font-black text-sm sm:text-lg tracking-wider uppercase transition-all shadow-xl ${
												selectedOptionId ?
													'bg-[#FF5B84] hover:bg-[#FF435A] text-white hover:scale-105 active:scale-95 shadow-[0_8px_20px_rgba(255,91,132,0.4)] cursor-pointer'
												:	'bg-slate-300 text-slate-500 cursor-not-allowed opacity-70'
											}`}>
											Submit
										</button>
									</div>
								</div>
							</div>
						:	/* Layout when SUBMITTED: Question Card & compact Options on Left, Solution Panel with NEXT button on Right */
							<div className='grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start'>
								{/* Left Column: Question Card & compact Options */}
								<div className='lg:col-span-7 flex flex-col gap-3'>
									<QuestionCard
										question={currentQuestion}
										currentIndex={currentIndex}
										totalQuestions={questions.length}
										onZoomClick={() => setIsZoomOpen(true)}
										soundEnabled={soundEnabled}
										isSubmitted={true}
									/>
									<OptionsGrid
										options={currentQuestion.options || []}
										selectedOptionId={selectedOptionId}
										onSelectOption={handleSelectOption}
										isSubmitted={true}
										correctAnswerId={currentQuestion.correctAnswerId}
										soundEnabled={soundEnabled}
									/>
								</div>

								{/* Right Column: Solution & Feedback Panel with NEXT BUTTON right below solution! */}
								<div className='lg:col-span-5 flex flex-col'>
									<SolutionPanel
										isCorrect={
											selectedOptionId === currentQuestion.correctAnswerId
										}
										question={currentQuestion}
										onAskDoubt={() => setIsAskDoubtOpen(true)}
										soundEnabled={soundEnabled}
										onNext={handleNext}
									/>
								</div>
							</div>
						}
					</div>
				:	/* Completion & Summary View */
					<div className='w-full'>
						{resultTab === 'overview' ?
							<ResultOverview
								scorePercent={scorePercent}
								correctCount={correctCount}
								totalCount={questions.length}
								earnedXp={correctCount * 5}
								onStartNextSheet={handleStartNextSheet}
								onViewSummary={() => setResultTab('summary')}
								activeTab={resultTab}
								setActiveTab={setResultTab}
								soundEnabled={soundEnabled}
								onBackToDashboard={() => setCurrentScreen('dashboard')}
								kidName={kidName}
							/>
						:	<QuestionSummary
								questions={questions}
								history={history}
								onStartNextSheet={handleStartNextSheet}
								activeTab={resultTab}
								setActiveTab={setResultTab}
								soundEnabled={soundEnabled}
								onBackToDashboard={() => setCurrentScreen('dashboard')}
							/>
						}
					</div>
				}
			</main>

			{/* Interactive Modals */}
			<HintModal
				hintText={currentQuestion.hint}
				isOpen={isHintOpen}
				onClose={() => setIsHintOpen(false)}
				soundEnabled={soundEnabled}
			/>

			<ZoomModal
				diagramType={currentQuestion.diagramType}
				diagramData={currentQuestion.diagramData}
				isOpen={isZoomOpen}
				onClose={() => setIsZoomOpen(false)}
				soundEnabled={soundEnabled}
			/>

			<AskDoubtModal
				question={currentQuestion}
				isOpen={isAskDoubtOpen}
				onClose={() => setIsAskDoubtOpen(false)}
				soundEnabled={soundEnabled}
			/>

			<NewSheetModal
				isOpen={isNewSheetOpen}
				onClose={() => setIsNewSheetOpen(false)}
				onConfirmNewSheet={handleConfirmNewSheet}
				sessionState={{
					selectedSkill,
					sheetNumber,
					questions,
					currentIndex,
					selectedOptionId,
					history,
					xp,
					timerSeconds,
					isCompleted,
				}}
				soundEnabled={soundEnabled}
			/>

			<KidNameModal
				isOpen={isNameModalOpen}
				onSaveProfile={handleSaveKidProfile}
				currentName={kidName}
				currentAge={kidAge}
				soundEnabled={soundEnabled}
			/>

			<AISetupModal
				isOpen={isAiSetupOpen}
				onClose={() => setIsAiSetupOpen(false)}
				onKeySaved={() => {
					setIsAiSetupOpen(false);
					handleSelectSkill(selectedSkill);
				}}
				soundEnabled={soundEnabled}
			/>
		</div>
	);
}
