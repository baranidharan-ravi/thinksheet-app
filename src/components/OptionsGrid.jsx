import { Check, X as XIcon } from 'lucide-react';
import { playButtonPop } from '../utils/audioSynthesis';

export default function OptionsGrid({
	options,
	selectedOptionId,
	onSelectOption,
	isSubmitted,
	correctAnswerId,
	soundEnabled,
}) {
	return (
		<div className='grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 h-full'>
			{options.map((opt) => {
				const isSelected = selectedOptionId === opt.id;
				const isCorrect = opt.id === correctAnswerId;

				let cardStyle =
					'bg-white text-slate-800 border-2 border-transparent hover:border-indigo-300';
				let badgeStyle = 'bg-[#302B63] text-white';

				if (!isSubmitted) {
					if (isSelected) {
						// Selected (active before submit): Vibrant Orange
						cardStyle =
							'bg-[#FF9500] text-white shadow-xl scale-[1.02] border-2 border-white ring-4 ring-orange-400/40';
						badgeStyle = 'bg-[#2A1D54] text-white';
					}
				} else {
					// Submitted states
					if (isCorrect) {
						// Correct Answer: Bright Emerald Green
						cardStyle =
							'bg-[#00D166] text-white shadow-xl scale-[1.02] border-2 border-white ring-4 ring-emerald-400/40';
						badgeStyle = 'bg-[#0F5132] text-white';
					} else if (isSelected && !isCorrect) {
						// User selected wrong answer: Coral Red
						cardStyle =
							'bg-[#FF435A] text-white shadow-xl scale-[1.02] border-2 border-white ring-4 ring-rose-400/40';
						badgeStyle = 'bg-[#842029] text-white';
					} else {
						// Other non-selected wrong answers: Dimmed
						cardStyle =
							'bg-white/90 text-slate-400 opacity-60 pointer-events-none';
						badgeStyle = 'bg-slate-300 text-slate-600';
					}
				}

				return (
					<button
						key={opt.id}
						disabled={isSubmitted}
						onClick={() => {
							playButtonPop(soundEnabled);
							onSelectOption(opt.id);
						}}
						className={`option-card-hover rounded-2xl sm:rounded-3xl p-4 sm:p-5 flex items-center justify-start gap-4 transition-all duration-200 text-left min-h-[90px] sm:min-h-[110px] ${cardStyle}`}>
						{/* Letter Badge (A, B, C, D) */}
						<div
							className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center font-extrabold text-sm sm:text-base flex-shrink-0 shadow-sm ${badgeStyle}`}>
							{isSubmitted && isCorrect ?
								<Check className='w-5 h-5 sm:w-6 sm:h-6 text-white stroke-[3]' />
							: isSubmitted && isSelected && !isCorrect ?
								<XIcon className='w-5 h-5 sm:w-6 sm:h-6 text-white stroke-[3]' />
							:	opt.id}
						</div>

						{/* Option Content Text */}
						<span className='text-base sm:text-xl font-bold tracking-wide'>
							{opt.text}
						</span>
					</button>
				);
			})}
		</div>
	);
}
