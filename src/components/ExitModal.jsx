import { Download, LogOut } from 'lucide-react';
import { playButtonPop } from '../utils/audioSynthesis';
import { exportSessionToFile } from '../utils/storage';

export default function ExitModal({
	isOpen,
	onClose,
	onConfirmExit,
	sessionState,
	soundEnabled,
}) {
	if (!isOpen) return null;

	const handleExport = () => {
		playButtonPop(soundEnabled);
		exportSessionToFile(sessionState);
	};

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200 select-none'>
			<div className='bg-[#141846] border-2 border-[#2C3480] text-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative flex flex-col gap-4'>
				{/* Header */}
				<div className='flex items-center gap-3'>
					<div className='w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400'>
						<LogOut className='w-6 h-6' />
					</div>
					<div>
						<h3 className='text-xl font-black text-white'>Take a Break?</h3>
						<span className='text-xs font-semibold text-gray-300'>
							Your Thinksheet progress is safely auto-saved!
						</span>
					</div>
				</div>

				<p className='text-sm font-medium text-slate-300'>
					You can resume anytime by refreshing the page or download your
					progress file to review later.
				</p>

				{/* Action Buttons */}
				<div className='flex flex-col gap-2.5 mt-2'>
					{/* Download JSON Progress */}
					<button
						onClick={handleExport}
						className='w-full py-3 px-4 rounded-xl bg-[#1F266A] hover:bg-[#29328A] border border-[#3C47A8] text-cyan-300 font-bold text-sm flex items-center justify-center gap-2 transition-all'>
						<Download className='w-4 h-4' />
						<span>Download Progress (.json file)</span>
					</button>

					{/* Continue Playing */}
					<button
						onClick={() => {
							playButtonPop(soundEnabled);
							onClose();
						}}
						className='w-full py-3.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-extrabold text-base shadow-lg hover:brightness-110 transition-all'>
						Keep Playing 🚀
					</button>

					{/* Exit / Reset */}
					<button
						onClick={() => {
							playButtonPop(soundEnabled);
							onConfirmExit();
						}}
						className='w-full py-2.5 text-xs font-bold text-gray-400 hover:text-rose-400 transition-colors'>
						Quit to Start Screen
					</button>
				</div>
			</div>
		</div>
	);
}
