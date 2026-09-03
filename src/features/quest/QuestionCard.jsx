import { Brain, Eye, Sparkles, Volume2, ZoomIn } from 'lucide-react';
import { memo, useEffect, useState } from 'react';
import { getAiImageForQuestion } from '../../services/aiGenerator';
import { playButtonPop, speakText } from '../../utils/audioSynthesis';
import VisualDiagram from '../../utils/VisualDiagrams';

const QuestionCard = memo(function QuestionCard({
	question,
	currentIndex,
	totalQuestions,
	onZoomClick,
	soundEnabled,
	isSubmitted = false,
	showVisualDiagrams = true,
}) {
	const [isSpeaking, setIsSpeaking] = useState(false);
	const [aiImageUrl, setAiImageUrl] = useState(null);
	const [isGeneratingAiImage, setIsGeneratingAiImage] = useState(false);

	useEffect(() => {
		let isMounted = true;
		setAiImageUrl(null);

		if (showVisualDiagrams && question) {
			setIsGeneratingAiImage(true);
			getAiImageForQuestion(question)
				.then((imgUri) => {
					if (isMounted) {
						if (imgUri) setAiImageUrl(imgUri);
						setIsGeneratingAiImage(false);
					}
				})
				.catch(() => {
					if (isMounted) setIsGeneratingAiImage(false);
				});
		} else {
			setIsGeneratingAiImage(false);
		}

		return () => {
			isMounted = false;
		};
	}, [question?.id, showVisualDiagrams]);

	const handleListenQuestion = () => {
		playButtonPop(soundEnabled);
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
			className={`bg-white text-[#1E293B] rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl flex flex-col justify-between border-4 border-white/90 relative overflow-hidden transition-all duration-300 flex-1 h-full w-full ${
				isSubmitted ?
					'min-h-[200px] sm:min-h-[240px]'
				:	'min-h-[380px] sm:min-h-[460px]'
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
			<div className='flex-1 flex flex-col justify-center my-auto py-2'>
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

				{/* Visual Diagram (If Enabled & Question has Diagram or AI Image) */}
				{showVisualDiagrams && (question.diagramType || aiImageUrl) && (
					<div className='flex flex-col justify-center items-center py-2'>
						{isGeneratingAiImage && !aiImageUrl && (
							<div className='flex items-center gap-1.5 px-3 py-1 mb-2 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-[11px] font-bold animate-pulse shadow-sm'>
								<Sparkles className='w-3 h-3 text-indigo-500 animate-spin' />
								<span>Generating AI Visual Illustration...</span>
							</div>
						)}
						{aiImageUrl ?
							<div className='relative group flex flex-col items-center'>
								<div className='absolute -top-2.5 right-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-md z-10 flex items-center gap-1'>
									<Sparkles className='w-2.5 h-2.5 fill-white' />
									<span>AI Image</span>
								</div>
								<VisualDiagram
									type='image'
									data={{ imageUrl: aiImageUrl, alt: question.question || 'Question Diagram' }}
								/>
							</div>
						:	<VisualDiagram
								type={question.diagramType}
								data={question.diagramData}
							/>
						}
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
