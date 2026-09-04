import { Brain, Eye, Volume2, ZoomIn } from 'lucide-react';
import { memo, useState } from 'react';
import { playButtonPop, speakText, stopSpeaking } from '../../utils/audioSynthesis';
import VisualDiagram from '../../utils/VisualDiagrams';

const QuestionCard = memo(function QuestionCard({
	question,
	currentIndex,
	totalQuestions,
	onZoomClick,
	soundEnabled,
	isSubmitted = false,
	showVisualDiagrams = false,
}) {
	const [isSpeaking, setIsSpeaking] = useState(false);

	const handleListenQuestion = () => {
		playButtonPop(soundEnabled);
		if (isSpeaking) {
			stopSpeaking();
			setIsSpeaking(false);
			return;
		}

		const textToRead =
			question.promptAudio || question.question || question.questionText || '';
		if (!textToRead) return;

		setIsSpeaking(true);
		speakText(
			textToRead,
			() => setIsSpeaking(true),
			() => setIsSpeaking(false),
		);
	};

	const isVisual = question.category === 'Visual';

	return (
		<div
			className={`bg-white text-[#1E293B] rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 shadow-2xl flex flex-col justify-between border-4 border-white/90 relative overflow-hidden transition-all duration-300 flex-1 h-full w-full min-h-0 ${
				isSubmitted ?
					'min-h-[180px] sm:min-h-[220px]'
				:	'min-h-[240px] sm:min-h-[280px]'
			}`}>
			{/* Top Bar: Question Index, Category Badge, Zoom Button */}
			<div className='flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5 mb-2'>
				{/* Step Indicator */}
				<div className='bg-[#302B63] text-white text-xs sm:text-sm font-black px-3 py-1 rounded-lg shadow-sm'>
					{currentIndex + 1}/{totalQuestions}
				</div>

				{/* Category Badge */}
				<div className='flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-sm border bg-slate-50 text-slate-700 border-slate-200'>
					{isVisual ?
						<>
							<Eye className='w-3.5 h-3.5 text-sky-600' />
							<span className='text-sky-700 font-extrabold'>Visual</span>
						</>
					:	<>
							<Brain className='w-3.5 h-3.5 text-purple-600' />
							<span className='text-purple-700 font-extrabold'>
								Analytical Thinking
							</span>
						</>
					}
				</div>

				{/* Zoom Button */}
				{showVisualDiagrams && question.diagramType ?
					<button
						type='button'
						onClick={() => {
							playButtonPop(soundEnabled);
							onZoomClick();
						}}
						className='flex items-center gap-1 text-[11px] sm:text-xs font-bold text-slate-500 hover:text-indigo-600 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg transition-all cursor-pointer'
						title='Zoom image'>
						<ZoomIn className='w-3.5 h-3.5' />
						<span>ZOOM</span>
					</button>
				:	<div className='w-12' />}
			</div>

			{/* Skill Objective Subtitle */}
			<div className='text-[11px] sm:text-xs font-semibold text-slate-500 bg-slate-50 border border-slate-100 rounded-xl px-3 py-1.5 mb-2 text-center'>
				{isVisual ?
					'🎯 Goal: Spot & analyze visual details to solve the puzzle'
				:	'🎯 Goal: Plan & break down relationships to solve the problem'}
			</div>

			{/* Center Section: Question Prompt & Diagram */}
			<div className='flex-1 min-h-0 overflow-y-auto pr-1 flex flex-col justify-center my-auto py-1 sm:py-2'>
				{/* Question Prompt */}
				<div className='flex items-start gap-3 my-2'>
					<h2 className='text-base sm:text-xl md:text-2xl font-extrabold text-slate-800 leading-snug'>
						{question.question || question.questionText}
					</h2>

					{/* Read-Aloud Speaker Button */}
					<button
						type='button'
						onClick={handleListenQuestion}
						className={`p-1.5 rounded-full transition-all shadow-sm flex-shrink-0 mt-0.5 cursor-pointer ${
							isSpeaking ?
								'bg-purple-300 text-purple-900 ring-2 ring-purple-500 scale-110 animate-pulse'
							:	'bg-purple-100 text-purple-700 hover:bg-purple-200 hover:scale-110 active:scale-95'
						}`}
						title='Listen to question'>
						<Volume2
							className={`w-4 h-4 sm:w-5 sm:h-5 ${isSpeaking ? 'animate-bounce text-purple-950' : ''}`}
						/>
					</button>
				</div>

				{/* Visual Diagram (only if question has a diagram type defined) */}
				{showVisualDiagrams && question.diagramType && (
					<div className='flex flex-col justify-center items-center py-2'>
						<VisualDiagram
							type={question.diagramType}
							data={question.diagramData}
						/>
					</div>
				)}
			</div>

			{/* Footer cue */}
			<div className='mt-auto pt-2 text-center text-xs font-semibold text-slate-400 border-t border-slate-50'>
				✨ Tap an answer choice on the right
			</div>
		</div>
	);
});

export default QuestionCard;
