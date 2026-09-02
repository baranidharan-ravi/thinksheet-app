import { Clock, Edit2, Info, Settings, Sparkles, Timer } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getStoredApiKey } from '../services/aiGenerator';
import { playButtonPop } from '../utils/audioSynthesis';
import { calculateSkillLevel } from '../utils/progressTracker';

export default function SkillSelectionDashboard({
	profileStats,
	onSelectSkill,
	soundEnabled,
	kidName,
	kidAge = 5,
	onEditKidName,
	onAnimationComplete,
	timerConfig = { enabled: false, secondsPerQuestion: 90 },
	onUpdateTimerConfig,
}) {
	const [infoModalTopic, setInfoModalTopic] = useState(null);
	const [hasApiKey, setHasApiKey] = useState(false);
	const [animationPhase, setAnimationPhase] = useState('center'); // 'center' | 'shrinking' | 'docked'

	useEffect(() => {
		const key = getStoredApiKey();
		setHasApiKey(Boolean(key));

		// Step 1: Display in center with big font, then start shrinking to top header
		const shrinkTimer = setTimeout(() => {
			setAnimationPhase('shrinking');
		}, 750);

		// Step 2: Settle into docked position and notify parent
		const dockTimer = setTimeout(() => {
			setAnimationPhase('docked');
			if (onAnimationComplete) {
				onAnimationComplete();
			}
		}, 1500);

		return () => {
			clearTimeout(shrinkTimer);
			clearTimeout(dockTimer);
		};
	}, [onAnimationComplete]);

	const visualLevel = calculateSkillLevel(
		profileStats.visualSolved || 0,
		profileStats.visualScores || [],
	);

	const analyticalLevel = calculateSkillLevel(
		profileStats.analyticalSolved || 0,
		profileStats.analyticalScores || [],
	);

	const handleCardClick = (skill) => {
		playButtonPop(soundEnabled);
		onSelectSkill(skill);
	};

	const isIntroActive = animationPhase === 'center';

	return (
		<div className='min-h-screen bg-gradient-to-b from-[#5646B6] via-[#483B9D] to-[#392E83] text-white flex flex-col justify-between p-4 sm:p-6 select-none relative overflow-x-hidden font-sans'>
			{/* Top Bar: Left Kid Name Badge + Center Green "Thinksheet" Badge + Right Profile/AI Settings Button */}
			<header className='w-full max-w-5xl mx-auto flex items-center justify-between pt-2 pb-4 relative min-h-[56px]'>
				{/* Kid Name & Age Personalization Badge */}
				<button
					type='button'
					onClick={() => {
						playButtonPop(soundEnabled);
						onEditKidName();
					}}
					className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-pink-200 transition-all duration-700 cursor-pointer shadow-md transform hover:scale-105 ${
						isIntroActive ?
							'opacity-0 -translate-y-4 pointer-events-none'
						:	'opacity-100 translate-y-0'
					}`}
					title='Edit Profile, Age, API Key & Timer'>
					<span>
						👋 {kidName || 'Explorer'} (Age {kidAge || 5})
					</span>
					<Edit2 className='w-3 h-3 text-pink-300 opacity-80' />
				</button>

				{/* Green Center ThinkSheet Badge with Animated Shrink-to-Top Transition */}
				{animationPhase !== 'docked' ?
					<>
						{/* Placeholder so header layout stays aligned */}
						<div className='w-40 sm:w-48 h-12 invisible' />

						{/* Animated Floating Thinksheet Banner */}
						<div
							className={`fixed left-1/2 -translate-x-1/2 z-50 transition-all duration-700 ease-[cubic-bezier(0.34,1.3,0.64,1)] flex items-center justify-center pointer-events-none ${
								animationPhase === 'center' ?
									'top-1/2 -translate-y-1/2 scale-110 sm:scale-135'
								:	'top-6 -translate-y-0 scale-100'
							}`}>
							<div
								className={`bg-[#22C55E] text-white rounded-3xl border-4 border-[#16A34A] flex items-center justify-center transition-all duration-700 shadow-2xl ${
									animationPhase === 'center' ?
										'px-10 py-5 sm:px-14 sm:py-6 shadow-[0_0_80px_rgba(34,197,94,0.8)] animate-pulse-glow'
									:	'px-8 py-2.5 border-2 rounded-2xl shadow-xl'
								}`}>
								<h1
									className={`font-black tracking-wide drop-shadow-md text-white transition-all duration-700 flex items-center gap-3 ${
										animationPhase === 'center' ?
											'text-4xl sm:text-6xl md:text-7xl font-heading'
										:	'text-xl sm:text-2xl font-heading'
									}`}>
									{animationPhase === 'center' && (
										<Sparkles className='w-7 h-7 sm:w-10 sm:h-10 text-yellow-300 animate-spin-slow' />
									)}
									<span>Thinksheet</span>
									{animationPhase === 'center' && (
										<span className='text-3xl sm:text-5xl animate-bounce'>
											🚀
										</span>
									)}
								</h1>
							</div>
							{/* Decorative side ribbon tabs */}
							<div className='absolute -left-2 top-3 w-3 h-5 bg-white rounded-l-md opacity-90 shadow-sm' />
							<div className='absolute -right-2 top-3 w-3 h-5 bg-white rounded-r-md opacity-90 shadow-sm' />
						</div>
					</>
				:	/* Fully Docked Header Badge in Normal DOM Flow */
					<div className='relative flex items-center justify-center animate-in fade-in duration-300'>
						<div className='bg-[#22C55E] text-white px-8 py-2.5 rounded-2xl shadow-xl border-2 border-[#16A34A] flex items-center justify-center'>
							<h1 className='text-xl sm:text-2xl font-black tracking-wide drop-shadow-md font-heading'>
								Thinksheet
							</h1>
						</div>
						{/* Decorative side ribbon tabs */}
						<div className='absolute -left-2 top-2.5 w-3 h-5 bg-white rounded-l-md opacity-90 shadow-sm' />
						<div className='absolute -right-2 top-2.5 w-3 h-5 bg-white rounded-r-md opacity-90 shadow-sm' />
					</div>
				}

				{/* Unified Setup & Settings Button */}
				<button
					onClick={() => {
						playButtonPop(soundEnabled);
						onEditKidName();
					}}
					className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-lg transition-all duration-700 border ${
						hasApiKey ?
							'bg-amber-400/20 text-amber-300 border-amber-400/40 hover:bg-amber-400/30'
						:	'bg-rose-500/30 text-rose-200 border-rose-400/50 hover:bg-rose-500/40 animate-pulse'
					} ${
						isIntroActive ?
							'opacity-0 -translate-y-4 pointer-events-none'
						:	'opacity-100 translate-y-0'
					}`}
					title='Setup Profile, Gemini API Key & Timer'>
					<Settings className='w-3.5 h-3.5 text-amber-300 animate-spin-slow' />
					<span>Setup & Key</span>
				</button>
			</header>

			{/* Main Content Area */}
			<main
				className={`w-full max-w-5xl mx-auto flex flex-col items-center flex-1 justify-center py-4 sm:py-6 transition-all duration-700 delay-100 ${
					isIntroActive ?
						'opacity-0 translate-y-8 pointer-events-none'
					:	'opacity-100 translate-y-0'
				}`}>
				{/* AI Active Indicator */}
				<div className='flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/15 px-4 py-1.5 rounded-full text-xs font-bold text-cyan-200 mb-3 shadow-sm'>
					<Sparkles className='w-4 h-4 text-amber-300' />
					<span>AI-Powered Dynamic Question Engine Active</span>
				</div>

				{/* Question Timer & Settings Summary Card */}
				<div className='w-full bg-white/10 backdrop-blur-md border border-white/15 rounded-3xl p-3.5 sm:p-4 mb-5 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4'>
					{/* Left: Info */}
					<div className='flex items-center gap-3 w-full sm:w-auto'>
						<div
							className={`w-10 h-10 rounded-2xl flex items-center justify-center border flex-shrink-0 transition-all ${
								timerConfig.enabled ?
									'bg-amber-400/20 border-amber-400/40 text-amber-300'
								:	'bg-white/10 border-white/20 text-slate-300'
							}`}>
							<Clock className='w-5 h-5' />
						</div>
						<div>
							<div className='flex items-center gap-2'>
								<span className='font-extrabold text-sm sm:text-base text-white'>
									⏱️ Question Timer Limit
								</span>
								<span
									className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
										timerConfig.enabled ?
											'bg-amber-400 text-slate-950 shadow-sm'
										:	'bg-white/20 text-slate-300'
									}`}>
									{timerConfig.enabled ? 'Enabled' : 'Optional'}
								</span>
							</div>
							<p className='text-xs text-slate-300 font-semibold mt-0.5'>
								{timerConfig.enabled ?
									`⏱️ ${timerConfig.secondsPerQuestion}s limit per question (auto-reveals answer for 7s on timeout)`
								:	'Relaxed mode: Unlimited time per question (default)'}
							</p>
						</div>
					</div>

					{/* Right: Quick Settings Button */}
					<button
						onClick={() => {
							playButtonPop(soundEnabled);
							onEditKidName();
						}}
						className='px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-white font-extrabold text-xs transition-all shadow-md flex items-center gap-1.5'>
						<Timer className='w-3.5 h-3.5 text-amber-300' />
						<span>Configure Settings ⚙️</span>
					</button>
				</div>

				{/* Call to Action Heading */}
				<h2 className='text-xl sm:text-2xl font-extrabold text-white text-center mb-6 tracking-wide drop-shadow'>
					Select a skill and solve thinksheets
				</h2>

				{/* Two Interactive Skill Cards */}
				<div className='w-full grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8'>
					{/* Skill Card 1: VISUAL */}
					<div
						onClick={() => handleCardClick('Visual')}
						className='group bg-white text-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl border-4 border-cyan-400 hover:border-cyan-300 cursor-pointer transform hover:-translate-y-1.5 active:translate-y-0 transition-all duration-200 flex flex-col justify-between min-h-[240px]'>
						<div>
							{/* Header Row: Icon, Title & Solved / Open count */}
							<div className='flex items-start justify-between gap-3 mb-4'>
								<div className='flex items-center gap-3.5'>
									{/* Colorful Bar Chart Icon */}
									<div className='w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-end justify-center p-2 gap-1 shadow-inner'>
										<div className='w-2 h-4 bg-amber-400 rounded-t-sm' />
										<div className='w-2 h-7 bg-cyan-400 rounded-t-sm' />
										<div className='w-2 h-5 bg-blue-500 rounded-t-sm' />
										<div className='w-2 h-9 bg-rose-500 rounded-t-sm' />
									</div>

									<div>
										<div className='flex items-center gap-2'>
											<h3 className='text-xl sm:text-2xl font-black text-slate-800 group-hover:text-indigo-600 transition-colors'>
												Visual
											</h3>
											<button
												type='button'
												onClick={(e) => {
													e.stopPropagation();
													playButtonPop(soundEnabled);
													setInfoModalTopic('Visual');
												}}
												className='text-slate-400 hover:text-indigo-600 p-1 rounded-full hover:bg-slate-100 transition-all'
												title='Skill Information'>
												<Info className='w-4 h-4' />
											</button>
										</div>
										<p className='text-xs text-slate-400 font-semibold'>
											Spatial puzzles, patterns & counting
										</p>
									</div>
								</div>

								{/* Solved Badge Counter */}
								<div className='text-right'>
									<span className='inline-block text-xs sm:text-sm font-extrabold text-indigo-900 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full'>
										{profileStats.visualSolved || 0} Solved
									</span>
								</div>
							</div>

							{/* Level Progress Indicator */}
							<div className='my-3'>
								<div className='flex items-center justify-between text-xs font-black text-slate-500 mb-1.5'>
									<span className='text-cyan-700 font-extrabold'>
										{visualLevel.levelName}
									</span>
									<span>Level {visualLevel.levelNumber} / 5</span>
								</div>
								{/* Level track */}
								<div className='w-full h-3.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200'>
									<div
										className='h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-500 shadow-sm'
										style={{
											width: `${visualLevel.progressPercent}%`,
										}}
									/>
								</div>
							</div>
						</div>

						{/* Bottom Row Action Button */}
						<div className='mt-4 pt-3 border-t border-slate-100 flex items-center justify-between'>
							<span className='text-xs font-bold text-slate-400'>
								Age {kidAge || 5} • 10 Challenges
							</span>
							<button className='px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 group-hover:from-cyan-400 group-hover:to-blue-500 text-white font-extrabold text-xs shadow-md transition-all'>
								Start Sheet 🚀
							</button>
						</div>
					</div>

					{/* Skill Card 2: ANALYTICAL THINKING */}
					<div
						onClick={() => handleCardClick('Analytical Thinking')}
						className='group bg-white text-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl border-4 border-purple-400 hover:border-purple-300 cursor-pointer transform hover:-translate-y-1.5 active:translate-y-0 transition-all duration-200 flex flex-col justify-between min-h-[240px]'>
						<div>
							{/* Header Row: Icon, Title & Solved / Open count */}
							<div className='flex items-start justify-between gap-3 mb-4'>
								<div className='flex items-center gap-3.5'>
									{/* Brain & Puzzle Icon container */}
									<div className='w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center p-2 shadow-inner'>
										<div className='w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white text-base font-black shadow-sm'>
											🧩
										</div>
									</div>

									<div>
										<div className='flex items-center gap-2'>
											<h3 className='text-xl sm:text-2xl font-black text-slate-800 group-hover:text-purple-600 transition-colors'>
												Analytical Thinking
											</h3>
											<button
												type='button'
												onClick={(e) => {
													e.stopPropagation();
													playButtonPop(soundEnabled);
													setInfoModalTopic('Analytical Thinking');
												}}
												className='text-slate-400 hover:text-purple-600 p-1 rounded-full hover:bg-slate-100 transition-all'
												title='Skill Information'>
												<Info className='w-4 h-4' />
											</button>
										</div>
										<p className='text-xs text-slate-400 font-semibold'>
											Analogies, categories & reasoning
										</p>
									</div>
								</div>

								{/* Solved Badge Counter */}
								<div className='text-right'>
									<span className='inline-block text-xs sm:text-sm font-extrabold text-purple-900 bg-purple-50 border border-purple-100 px-3 py-1 rounded-full'>
										{profileStats.analyticalSolved || 0} Solved
									</span>
								</div>
							</div>

							{/* Level Progress Indicator */}
							<div className='my-3'>
								<div className='flex items-center justify-between text-xs font-black text-slate-500 mb-1.5'>
									<span className='text-purple-700 font-extrabold'>
										{analyticalLevel.levelName}
									</span>
									<span>Level {analyticalLevel.levelNumber} / 5</span>
								</div>
								{/* Level track */}
								<div className='w-full h-3.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200'>
									<div
										className='h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500 shadow-sm'
										style={{
											width: `${analyticalLevel.progressPercent}%`,
										}}
									/>
								</div>
							</div>
						</div>

						{/* Bottom Row Action Button */}
						<div className='mt-4 pt-3 border-t border-slate-100 flex items-center justify-between'>
							<span className='text-xs font-bold text-slate-400'>
								Age {kidAge || 5} • 10 Challenges
							</span>
							<button className='px-5 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 group-hover:from-purple-400 group-hover:to-pink-500 text-white font-extrabold text-xs shadow-md transition-all'>
								Start Sheet 🚀
							</button>
						</div>
					</div>
				</div>
			</main>

			{/* Skill Info Modal */}
			{infoModalTopic && (
				<div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200'>
					<div className='bg-[#141846] border-2 border-[#2C3480] text-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative'>
						<h3 className='text-lg sm:text-xl font-black text-white mb-2 flex items-center gap-2'>
							<Sparkles className='w-5 h-5 text-amber-400' />
							<span>{infoModalTopic} Skill Info</span>
						</h3>

						<p className='text-sm font-semibold text-slate-300 leading-relaxed my-3'>
							{infoModalTopic === 'Visual' &&
								'Develop your ability to analyze and/or spot visual information in order to solve a problem.'}
							{infoModalTopic === 'Analytical Thinking' &&
								'Develop your ability to plan and breakdown information in order to analyze and solve complex problems.'}
						</p>

						<button
							onClick={() => setInfoModalTopic(null)}
							className='w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-extrabold text-sm shadow-lg mt-2'>
							Got It! 👍
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
