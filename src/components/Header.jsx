import {
	Clock,
	Download,
	LayoutGrid,
	Maximize,
	Mic,
	MicOff,
	Minimize,
	Plus,
	Volume2,
	VolumeX,
} from 'lucide-react';
import React from 'react';
import { playButtonPop } from '../utils/audioSynthesis';

export default function Header({
	questionIndex,
	totalQuestions,
	history,
	xp,
	timerSeconds,
	soundEnabled,
	onToggleSound,
	speechEnabled,
	onToggleSpeech,
	onDownloadClick,
	onCreateNewSheetClick,
	onHomeClick,
}) {
	const [isFullscreen, setIsFullscreen] = React.useState(false);

	// Format MM:SS
	const formatTime = (secs) => {
		const m = Math.floor(secs / 60)
			.toString()
			.padStart(2, '0');
		const s = (secs % 60).toString().padStart(2, '0');
		return `${m}:${s}`;
	};

	const toggleFullscreen = () => {
		playButtonPop(soundEnabled);
		if (!document.fullscreenElement) {
			document.documentElement.requestFullscreen().catch(() => {});
			setIsFullscreen(true);
		} else {
			document.exitFullscreen().catch(() => {});
			setIsFullscreen(false);
		}
	};

	return (
		<header className='w-full max-w-7xl mx-auto px-3 sm:px-6 py-3 flex items-center justify-between gap-2 sm:gap-4 select-none'>
			{/* Skill Thinksheet Badge */}
			<div className='flex flex-col items-center bg-[#151747] border border-[#2B3075] rounded-xl px-3 py-1 sm:px-4 sm:py-1.5 shadow-lg'>
				<span className='text-white font-extrabold text-sm sm:text-base tracking-wider bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent'>
					SKILL
				</span>
				<span className='text-[10px] sm:text-xs font-semibold text-gray-300 tracking-wide uppercase'>
					THINKSHEET
				</span>
			</div>

			{/* 10-Segment Segmented Progress Bar */}
			<div className='flex-1 max-w-xl mx-1.5 sm:mx-4 bg-[#141846] p-1.5 rounded-full border border-[#252C7A] flex gap-1 sm:gap-1.5 shadow-inner'>
				{Array.from({ length: totalQuestions }).map((_, idx) => {
					const item = history[idx];
					let bgClass = 'bg-[#31387A]/50'; // Default unvisited
					let borderClass = 'border-transparent';

					if (item) {
						if (item.isCorrect) {
							bgClass =
								'bg-gradient-to-r from-[#00D166] to-[#10B981] shadow-[0_0_8px_#00D166]';
						} else {
							bgClass =
								'bg-gradient-to-r from-[#FF435A] to-[#F43F5E] shadow-[0_0_8px_#FF435A]';
						}
					} else if (idx === questionIndex) {
						bgClass = 'bg-[#4B56B2] animate-pulse';
						borderClass = 'border border-white/60';
					}

					return (
						<div
							key={idx}
							className={`h-2.5 sm:h-3 flex-1 rounded-full transition-all duration-300 ${bgClass} ${borderClass}`}
							title={`Question ${idx + 1}`}
						/>
					);
				})}
			</div>

			{/* Right Controls Area: XP, Timer, Audio, Speech, Download, New Sheet */}
			<div className='flex items-center gap-1 sm:gap-2.5'>
				{/* XP Counter */}
				<div className='flex items-center gap-1.5 bg-[#121644] border border-[#29307A] px-2 sm:px-3 py-1.5 rounded-xl shadow-md'>
					<span className='text-cyan-400 font-extrabold text-xs sm:text-sm'>
						XP
					</span>
					<span className='text-white font-bold text-xs sm:text-sm'>{xp}</span>
				</div>

				{/* Timer */}
				<div className='flex items-center gap-1.5 bg-[#121644] border border-[#29307A] px-2 sm:px-2.5 py-1.5 rounded-xl text-pink-300 font-bold text-xs sm:text-sm shadow-md'>
					<Clock className='w-3.5 h-3.5 text-pink-400 animate-spin-slow' />
					<span>{formatTime(timerSeconds)}</span>
				</div>

				{/* Read-Aloud Voice Narrator for 5yo Kids */}
				<button
					onClick={() => {
						playButtonPop(soundEnabled);
						onToggleSpeech();
					}}
					className={`p-2 rounded-xl border transition-all ${
						speechEnabled ?
							'bg-purple-600/40 border-purple-400 text-purple-200'
						:	'bg-[#121644] border-[#29307A] text-gray-400 hover:text-white'
					}`}
					title={speechEnabled ? 'Voice Narrator On' : 'Voice Narrator Off'}>
					{speechEnabled ?
						<Mic className='w-4 h-4' />
					:	<MicOff className='w-4 h-4' />}
				</button>

				{/* Sound Effects Toggle */}
				<button
					onClick={() => {
						playButtonPop(soundEnabled);
						onToggleSound();
					}}
					className={`p-2 rounded-xl border transition-all ${
						soundEnabled ?
							'bg-[#121644] border-[#29307A] text-gray-200 hover:text-white'
						:	'bg-rose-950/40 border-rose-800 text-rose-300'
					}`}
					title={soundEnabled ? 'Mute Sounds' : 'Unmute Sounds'}>
					{soundEnabled ?
						<Volume2 className='w-4 h-4' />
					:	<VolumeX className='w-4 h-4' />}
				</button>

				{/* Fullscreen Toggle */}
				<button
					onClick={toggleFullscreen}
					className='hidden md:block p-2 rounded-xl bg-[#121644] border border-[#29307A] text-gray-300 hover:text-white hover:bg-[#1E2568] transition-all'
					title='Toggle Fullscreen'>
					{isFullscreen ?
						<Minimize className='w-4 h-4' />
					:	<Maximize className='w-4 h-4' />}
				</button>

				{/* Download Sheet Button */}
				<button
					onClick={() => {
						playButtonPop(soundEnabled);
						onDownloadClick();
					}}
					className='p-2 rounded-xl bg-[#121644] border border-[#29307A] text-cyan-300 hover:text-white hover:bg-cyan-900/40 hover:border-cyan-500/50 shadow-md transition-all flex items-center gap-1.5'
					title='Download Thinksheet Progress'>
					<Download className='w-4 h-4' />
					<span className='hidden lg:inline text-xs font-bold'>Download</span>
				</button>

				{/* Skills Hub / Home Button */}
				{onHomeClick && (
					<button
						onClick={() => {
							playButtonPop(soundEnabled);
							onHomeClick();
						}}
						className='p-2 rounded-xl bg-[#121644] border border-[#29307A] text-purple-300 hover:text-white hover:bg-purple-900/40 hover:border-purple-500/50 shadow-md transition-all flex items-center gap-1'
						title='Back to Skills Hub'>
						<LayoutGrid className='w-4 h-4' />
						<span className='hidden sm:inline text-xs font-bold'>Skills</span>
					</button>
				)}

				{/* Create New Sheet Button */}
				<button
					onClick={() => {
						playButtonPop(soundEnabled);
						onCreateNewSheetClick();
					}}
					className='px-2.5 sm:px-3.5 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-extrabold text-xs sm:text-xs flex items-center gap-1.5 shadow-lg hover:scale-105 active:scale-95 transition-all'
					title='Create New Thinksheet'>
					<Plus className='w-3.5 h-3.5 stroke-[3]' />
					<span>New Sheet</span>
				</button>
			</div>
		</header>
	);
}
