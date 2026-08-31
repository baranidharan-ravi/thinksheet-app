import { Download, Plus, Sparkles, X } from 'lucide-react';
import { playButtonPop } from '../utils/audioSynthesis';
import { exportSessionToFile } from '../utils/storage';

export default function NewSheetModal({
	isOpen,
	onClose,
	onConfirmNewSheet,
	sessionState,
	soundEnabled,
}) {
	if (!isOpen) return null;

	const handleDownload = () => {
		playButtonPop(soundEnabled);
		exportSessionToFile(sessionState, `thinksheet_session_${Date.now()}.json`);
	};

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200 select-none'>
			<div className='bg-[#141846] border-2 border-[#2C3480] text-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative flex flex-col gap-4'>
				{/* Close Button */}
				<button
					onClick={() => {
						playButtonPop(soundEnabled);
						onClose();
					}}
					className='absolute top-4 right-4 p-2 rounded-full bg-[#20276E] text-gray-300 hover:text-white'>
					<X className='w-4 h-4' />
				</button>

				{/* Header with Sparkles */}
				<div className='flex items-center gap-3'>
					<div className='w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 to-indigo-600 flex items-center justify-center shadow-lg text-white'>
						<Sparkles className='w-6 h-6 animate-pulse' />
					</div>
					<div>
						<h3 className='text-xl font-black text-white'>
							Create a New Sheet?
						</h3>
						<span className='text-xs font-semibold text-pink-300'>
							Ready for 10 fresh Analytical Thinking questions!
						</span>
					</div>
				</div>

				<p className='text-sm font-medium text-slate-300'>
					Starting a new sheet will generate a brand new set of unseen reasoning
					challenges for your little explorer.
				</p>

				{/* Action Buttons */}
				<div className='flex flex-col gap-3 mt-2'>
					{/* Create New Sheet Action */}
					<button
						onClick={() => {
							playButtonPop(soundEnabled);
							onConfirmNewSheet();
						}}
						className='w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-extrabold text-base flex items-center justify-center gap-2 shadow-lg hover:scale-[1.02] active:scale-95 transition-all'>
						<Plus className='w-5 h-5' />
						<span>Start Fresh New Sheet (10 Questions)</span>
					</button>

					{/* Download Current Sheet First */}
					<button
						onClick={handleDownload}
						className='w-full py-3 px-4 rounded-xl bg-[#1F266A] hover:bg-[#29328A] border border-[#3C47A8] text-cyan-300 font-bold text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.01]'>
						<Download className='w-4 h-4' />
						<span>Download Current Sheet Progress (.json)</span>
					</button>

					{/* Cancel */}
					<button
						onClick={() => {
							playButtonPop(soundEnabled);
							onClose();
						}}
						className='w-full py-2.5 text-xs font-bold text-gray-400 hover:text-white transition-colors'>
						Cancel & Keep Playing
					</button>
				</div>
			</div>
		</div>
	);
}
