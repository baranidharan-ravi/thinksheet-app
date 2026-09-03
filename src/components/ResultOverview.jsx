import confetti from 'canvas-confetti';
import { Award, Download, LayoutGrid, RefreshCw } from 'lucide-react';
import { useEffect } from 'react';
import { LEADERBOARD_DATA } from '../data/leaderboardData';
import {
	playButtonPop,
	playStarSound,
	playVictoryFanfare,
} from '../utils/audioSynthesis';

export default function ResultOverview({
	scorePercent,
	correctCount,
	totalCount,
	earnedXp,
	onStartNextSheet,
	onViewSummary,
	onDownloadPdf,
	activeTab,
	setActiveTab,
	soundEnabled,
	onBackToDashboard,
	kidName = '',
	history = [],
}) {
	// Determine star count based on score
	const starCount =
		scorePercent >= 80 ? 3
		: scorePercent >= 50 ? 2
		: 1;

	useEffect(() => {
		// Trigger joyful celebration confetti
		try {
			confetti({
				particleCount: 120,
				spread: 70,
				origin: { y: 0.6 },
			});
		} catch {
			// Confetti fallback
		}

		// Play victory fanfare sound
		playVictoryFanfare(soundEnabled);

		// Staggered star sounds
		for (let i = 0; i < starCount; i++) {
			setTimeout(
				() => {
					playStarSound(i, soundEnabled);
				},
				(i + 1) * 350,
			);
		}
	}, []);

	return (
		<div className='w-full max-w-6xl mx-auto px-4 py-6 flex flex-col items-center select-none animate-in fade-in zoom-in-95 duration-500'>
			{/* Top Tabs: RESULT OVERVIEW vs QUESTION SUMMARY */}
			<div className='flex items-center gap-3 mb-8'>
				<button
					onClick={() => {
						playButtonPop(soundEnabled);
						setActiveTab('overview');
					}}
					className={`px-6 py-2.5 rounded-full font-black text-xs sm:text-sm uppercase tracking-wider transition-all shadow-lg ${
						activeTab === 'overview' ?
							'bg-[#FF5B84] text-white ring-4 ring-pink-500/30'
						:	'bg-[#15184C] text-gray-300 hover:text-white border border-[#2B3280]'
					}`}>
					Result Overview
				</button>

				<button
					onClick={() => {
						playButtonPop(soundEnabled);
						setActiveTab('summary');
					}}
					className={`px-6 py-2.5 rounded-full font-black text-xs sm:text-sm uppercase tracking-wider transition-all shadow-lg ${
						activeTab === 'summary' ?
							'bg-[#FF5B84] text-white ring-4 ring-pink-500/30'
						:	'bg-[#15184C] text-gray-300 hover:text-white border border-[#2B3280]'
					}`}>
					Question Summary
				</button>
			</div>

			{/* Main Content Grid: Left Score/Stars, Right Leaderboard */}
			<div className='w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center'>
				{/* Left Side: Glowing Stars & Ribbon */}
				<div className='lg:col-span-6 flex flex-col items-center justify-center text-center p-6 sm:p-10 relative'>
					{/* Animated 3D Stars */}
					<div className='flex items-center justify-center gap-4 mb-6'>
						{Array.from({ length: 3 }).map((_, idx) => {
							const isFilled = idx < starCount;
							return (
								<div
									key={idx}
									className={`text-5xl sm:text-7xl transition-all duration-700 transform ${
										isFilled ?
											'scale-110 drop-shadow-[0_0_20px_#FBBF24] animate-bounce-short'
										:	'opacity-30 scale-90 grayscale'
									}`}
									style={{ animationDelay: `${idx * 200}ms` }}>
									⭐
								</div>
							);
						})}
					</div>

					{/* COMPLETED Ribbon Banner */}
					<div className='ribbon-banner px-8 py-3.5 rounded-2xl mb-6 shadow-2xl transform hover:scale-105 transition-transform'>
						<h1 className='text-2xl sm:text-4xl font-black tracking-widest text-white uppercase drop-shadow-md'>
							COMPLETED
						</h1>
					</div>

					{/* Score Percentage */}
					<div className='flex flex-col items-center'>
						<span className='text-gray-300 font-bold text-lg sm:text-xl tracking-wide mb-1'>
							Your Score
						</span>
						<span className='text-5xl sm:text-7xl font-black text-white tracking-tight drop-shadow-lg bg-gradient-to-b from-white to-gray-200 bg-clip-text text-transparent'>
							{scorePercent}%
						</span>
					</div>

					{/* Encouraging Kid-Friendly Message */}
					<p className='mt-4 text-sm sm:text-base font-bold text-cyan-300 bg-cyan-950/40 border border-cyan-800/60 px-4 py-2 rounded-full'>
						{scorePercent >= 80 ?
							'🌟 Outstanding Job, Super Astronaut!'
						: scorePercent >= 50 ?
							'🚀 Great Effort! Keep exploring and learning!'
						:	'🌱 Good try! Practice makes you stronger!'}
					</p>
				</div>

				{/* Right Side: Correct Answers & Space Cadet League Leaderboard */}
				<div className='lg:col-span-6 flex flex-col gap-4'>
					{/* Correct Answers & XP Pill Card */}
					<div className='bg-white text-slate-800 rounded-2xl p-4 sm:p-5 flex items-center justify-between shadow-xl border-2 border-white'>
						<div className='flex items-center gap-3'>
							<span className='text-2xl sm:text-3xl'>🎉</span>
							<div>
								<span className='font-extrabold text-sm sm:text-lg text-slate-800 block leading-tight'>
									{correctCount} Correct Answers
								</span>
								{history?.some((h) => h?.skipped) && (
									<span className='text-xs font-bold text-amber-600 block mt-0.5'>
										⏭️ {history.filter((h) => h?.skipped).length} Skipped
									</span>
								)}
							</div>
						</div>
						<div className='bg-cyan-50 text-cyan-700 font-black text-sm sm:text-lg px-4 py-1.5 rounded-xl border border-cyan-200'>
							+{earnedXp} XP
						</div>
					</div>

					{/* Space Cadet League Card */}
					<div className='bg-[#121644] border-2 border-[#2C3480] rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col justify-between'>
						<div>
							{/* League Header */}
							<div className='flex items-center gap-3 mb-4 pb-3 border-b border-[#252C7A]'>
								<div className='w-10 h-10 rounded-xl bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center text-white font-bold text-xl shadow-inner'>
									<Award className='w-6 h-6 text-yellow-300' />
								</div>
								<div>
									<h3 className='font-extrabold text-white text-base sm:text-lg leading-tight'>
										Space Cadet
									</h3>
									<p className='text-xs font-semibold text-pink-300'>
										⏱️ Ends in 6 days
									</p>
								</div>
							</div>

							{/* Leaderboard Table List */}
							<div className='flex flex-col gap-2.5'>
								{LEADERBOARD_DATA.slice(0, 3).map((player) => (
									<div
										key={player.rank}
										className={`rounded-2xl p-3 flex items-center justify-between transition-all ${
											player.isUser ?
												'bg-gradient-to-r from-purple-900/60 to-indigo-900/60 border-2 border-pink-400/80 shadow-lg scale-[1.02]'
											:	'bg-[#181D52]/80 border border-[#2B3378]'
										}`}>
										<div className='flex items-center gap-3'>
											{/* Rank Medal */}
											<span className='text-xl sm:text-2xl font-bold'>
												{player.rank === 1 ?
													'🥇'
												: player.rank === 2 ?
													'🥈'
												:	'🥉'}
											</span>

											{/* Avatar */}
											<div
												className={`w-9 h-9 rounded-full ${player.avatarBg} flex items-center justify-center text-lg shadow-md`}>
												{player.avatar}
											</div>

											{/* Name */}
											<span className='font-bold text-white text-xs sm:text-sm'>
												{player.isUser ?
													kidName ?
														`${kidName} (You)`
													:	'You'
												:	player.name}
											</span>
										</div>

										{/* Gems & XP */}
										<div className='flex items-center gap-3'>
											<span className='text-xs sm:text-sm font-black text-pink-400'>
												{player.gems}
											</span>
											<div className='text-right'>
												<span className='text-[10px] text-gray-400 uppercase font-semibold block leading-none'>
													XP
												</span>
												<span className='text-xs sm:text-sm font-bold text-cyan-300'>
													{player.isUser ? player.xp + earnedXp : player.xp}
												</span>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>

						{/* Next Sheet / Action Button */}
						<button
							onClick={() => {
								playButtonPop(soundEnabled);
								onStartNextSheet();
							}}
							className='mt-6 w-full py-4 rounded-2xl bg-gradient-to-r from-[#FF5B84] to-[#FF435A] hover:from-[#FF435A] hover:to-[#E11D48] text-white font-extrabold text-base sm:text-lg shadow-[0_10px_25px_rgba(255,91,132,0.4)] hover:shadow-[0_12px_30px_rgba(255,91,132,0.6)] transform hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 cursor-pointer'>
							<RefreshCw className='w-5 h-5 animate-spin-slow' />
							<span>Start Next Thinksheet (10 New Questions)</span>
						</button>

						{/* Download PDF Report Button */}
						{onDownloadPdf && (
							<button
								onClick={() => {
									playButtonPop(soundEnabled);
									onDownloadPdf();
								}}
								className='mt-3 w-full py-3.5 rounded-2xl bg-[#0F143D] hover:bg-[#1A205E] border-2 border-cyan-400 text-cyan-300 hover:text-white font-extrabold text-sm sm:text-base shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-0.5'>
								<Download className='w-5 h-5' />
								<span>Download PDF Report 📄</span>
							</button>
						)}

						{/* Back to Skills Hub Button */}
						{onBackToDashboard && (
							<button
								onClick={() => {
									playButtonPop(soundEnabled);
									onBackToDashboard();
								}}
								className='mt-3 w-full py-3 rounded-2xl bg-[#1C2263] hover:bg-[#252D80] border border-[#3A45A8] text-slate-300 hover:text-white font-extrabold text-sm sm:text-base transition-all flex items-center justify-center gap-2 cursor-pointer'>
								<LayoutGrid className='w-4 h-4' />
								<span>Back to Skills Hub</span>
							</button>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
