import { ArrowRight, Download, LogOut, Play, X } from 'lucide-react';
import { memo } from 'react';
import { playButtonPop } from '../../utils/audioSynthesis';

const ExitConfirmationModal = memo(function ExitConfirmationModal({
	isOpen,
	onClose,
	onEndAndDownload,
	onExitWithoutDownload,
	currentIndex = 0,
	totalQuestions = 10,
	selectedSkill = 'Visual',
	soundEnabled = true,
}) {
	if (!isOpen) return null;

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 select-none'>
			<div className='bg-gradient-to-b from-[#1C1F5E] via-[#141846] to-[#0D1030] border-4 border-rose-400/80 rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-[0_0_50px_rgba(244,63,94,0.35)] text-white relative animate-in zoom-in-95 duration-200'>
				{/* Top Close / Cancel Button */}
				<button
					type='button'
					onClick={() => {
						playButtonPop(soundEnabled);
						onClose();
					}}
					className='absolute top-4 right-4 p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all cursor-pointer'
					title='Close'>
					<X className='w-5 h-5' />
				</button>

				{/* Header Icon & Title */}
				<div className='text-center mb-5'>
					<div className='w-14 h-14 mx-auto rounded-2xl bg-rose-500/20 border border-rose-400/40 flex items-center justify-center shadow-lg mb-3 text-rose-300'>
						<LogOut className='w-7 h-7' />
					</div>

					<h2 className='text-xl sm:text-2xl font-black text-white tracking-wide'>
						Exit AstroQuest?
					</h2>
					<p className='text-xs font-semibold text-slate-300 mt-1'>
						You are on Question {currentIndex + 1} of {totalQuestions} in{' '}
						<span className='text-cyan-300 font-bold'>{selectedSkill}</span>.
					</p>
				</div>

				{/* Options Selection */}
				<div className='flex flex-col gap-3'>
					{/* Option 1: End Sheet and Download Report */}
					<button
						type='button'
						onClick={() => {
							playButtonPop(soundEnabled);
							onEndAndDownload();
						}}
						className='w-full p-3.5 rounded-2xl bg-[#0F143D] hover:bg-[#1A205E] border-2 border-cyan-500/50 hover:border-cyan-400 text-left transition-all shadow-md group cursor-pointer flex items-center justify-between'>
						<div className='flex items-center gap-3'>
							<div className='w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform'>
								<Download className='w-5 h-5' />
							</div>
							<div>
								<div className='text-sm font-extrabold text-white group-hover:text-cyan-300 transition-colors'>
									End Sheet & Download PDF 📄
								</div>
								<div className='text-[11px] font-semibold text-slate-400'>
									Save fully expanded Q&A PDF report and exit
								</div>
							</div>
						</div>
						<ArrowRight className='w-4 h-4 text-slate-400 group-hover:text-cyan-300 transition-colors' />
					</button>

					{/* Option 2: Exit Without Downloading */}
					<button
						type='button'
						onClick={() => {
							playButtonPop(soundEnabled);
							onExitWithoutDownload();
						}}
						className='w-full p-3.5 rounded-2xl bg-[#0F143D] hover:bg-[#1A205E] border-2 border-rose-500/50 hover:border-rose-400 text-left transition-all shadow-md group cursor-pointer flex items-center justify-between'>
						<div className='flex items-center gap-3'>
							<div className='w-10 h-10 rounded-xl bg-rose-500/20 text-rose-300 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform'>
								<LogOut className='w-5 h-5' />
							</div>
							<div>
								<div className='text-sm font-extrabold text-white group-hover:text-rose-300 transition-colors'>
									Exit Without Downloading 🚪
								</div>
								<div className='text-[11px] font-semibold text-slate-400'>
									Return directly to Skill Selection
								</div>
							</div>
						</div>
						<ArrowRight className='w-4 h-4 text-slate-400 group-hover:text-rose-300 transition-colors' />
					</button>

					{/* Option 3: Continue Thinksheet */}
					<button
						type='button'
						onClick={() => {
							playButtonPop(soundEnabled);
							onClose();
						}}
						className='w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-extrabold text-sm tracking-wide shadow-lg transform hover:scale-[1.01] active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2 mt-1'>
						<Play className='w-4 h-4 fill-white' />
						<span>Continue AstroQuest 🚀</span>
					</button>
				</div>
			</div>
		</div>
	);
});

export default ExitConfirmationModal;
