import { X, Zap } from 'lucide-react';
import { playButtonPop } from '../utils/audioSynthesis';

export default function HintModal({ hintText, isOpen, onClose, soundEnabled }) {
	if (!isOpen) return null;

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200'>
			<div className='bg-[#15194D] border-2 border-[#38419D] text-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative transform animate-in zoom-in-95 duration-200'>
				{/* Close Button */}
				<button
					onClick={() => {
						playButtonPop(soundEnabled);
						onClose();
					}}
					className='absolute top-4 right-4 p-2 rounded-full bg-[#20276E] text-gray-300 hover:text-white transition-colors'>
					<X className='w-4 h-4' />
				</button>

				{/* Header with Zap */}
				<div className='flex items-center gap-3 mb-4'>
					<div className='w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-pink-500 flex items-center justify-center shadow-lg'>
						<Zap className='w-7 h-7 text-white fill-white animate-bounce-short' />
					</div>
					<div>
						<h3 className='text-xl font-black text-white'>
							Super Explorer Hint! 💡
						</h3>
						<span className='text-xs font-semibold text-pink-300'>
							Here is a friendly clue to help you think
						</span>
					</div>
				</div>

				{/* Hint Body */}
				<div className='bg-white text-slate-800 rounded-2xl p-4 sm:p-5 font-bold text-sm sm:text-base leading-relaxed shadow-inner my-4'>
					{hintText ||
						'Look closely at the shapes, colors, and patterns! You can do it!'}
				</div>

				{/* Got It Button */}
				<button
					onClick={() => {
						playButtonPop(soundEnabled);
						onClose();
					}}
					className='w-full py-3.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-extrabold text-base shadow-lg transition-all'>
					Got It! Let's Try 🚀
				</button>
			</div>
		</div>
	);
}
