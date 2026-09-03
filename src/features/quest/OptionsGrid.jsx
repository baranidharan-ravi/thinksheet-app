import { Check, Sparkles, X as XIcon } from 'lucide-react';
import { memo, useEffect, useRef, useState } from 'react';
import { getAiImageForOption } from '../../services/aiGenerator';
import { playButtonPop } from '../../utils/audioSynthesis';
import {
	DynamicSvgShape,
	hasShapeOrVisualConcept,
	parseDynamicShape,
} from '../../utils/shapeGenerator';
import { getConceptVisual } from '../../utils/VisualDiagrams';

/**
 * Inline image component for option cards — mirrors LazyVisualImage logic
 * (handles base64 data URIs that don't re-fire onLoad after browser caching)
 */
function OptionImage({ src, alt, className }) {
	const [loaded, setLoaded] = useState(false);
	const [error, setError] = useState(false);
	const imgRef = useRef(null);

	useEffect(() => {
		setLoaded(false);
		setError(false);
	}, [src]);

	// Catch already-decoded base64 images that won't re-fire onLoad
	useEffect(() => {
		if (!loaded && imgRef.current?.complete && imgRef.current?.naturalWidth > 0) {
			setLoaded(true);
		}
	});

	if (!src || error) return null;

	return (
		<>
			{!loaded && (
				<div className='w-full h-full rounded-xl bg-slate-200 animate-pulse flex items-center justify-center'>
					<div className='w-4 h-4 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin' />
				</div>
			)}
			<img
				ref={imgRef}
				src={src}
				alt={alt}
				onLoad={() => setLoaded(true)}
				onError={() => setError(true)}
				className={`${className} transition-opacity duration-300 ${
					loaded ? 'opacity-100' : 'opacity-0 absolute -z-10 pointer-events-none'
				}`}
			/>
		</>
	);
}

/**
 * Single option card with AI image support
 */
function OptionCard({
	opt,
	idx,
	isSelected,
	isCorrect,
	isSubmitted,
	showVisualDiagrams,
	soundEnabled,
	onSelectOption,
	question,
}) {
	const text = String(opt.text || '');
	const [aiOptionImageUrl, setAiOptionImageUrl] = useState(null);
	const [isGenerating, setIsGenerating] = useState(false);

	const isShapeOption = showVisualDiagrams && hasShapeOrVisualConcept(text);
	const parsedShape = isShapeOption ? parseDynamicShape(text) : null;
	const conceptVisual =
		showVisualDiagrams && !parsedShape ? getConceptVisual(text) : null;
	// Use server-provided image, AI-generated image, or null
	const staticOptionImage =
		showVisualDiagrams ? opt.imageUrl || opt.image || null : null;
	const displayImage = staticOptionImage || aiOptionImageUrl;

	// Fetch AI option image if no static image and visual diagrams are enabled
	useEffect(() => {
		if (!showVisualDiagrams || staticOptionImage || !question) return;
		let isMounted = true;
		setAiOptionImageUrl(null);
		setIsGenerating(true);
		getAiImageForOption(
			question.question || question.questionText || '',
			text,
		)
			.then((imgUri) => {
				if (isMounted) {
					if (imgUri) setAiOptionImageUrl(imgUri);
					setIsGenerating(false);
				}
			})
			.catch(() => {
				if (isMounted) setIsGenerating(false);
			});
		return () => {
			isMounted = false;
		};
	}, [opt.id, showVisualDiagrams, question?.id]);

	// Distinct Card Background & Ring State
	let cardStyle =
		'bg-white text-slate-800 border-2 border-slate-200 hover:border-indigo-400 shadow-md hover:shadow-lg hover:scale-[1.01]';
	let badgeStyle = 'bg-[#2A2368] text-white';
	let contrastBoxStyle = 'bg-slate-100/90 border border-slate-300 shadow-inner';

	if (!isSubmitted) {
		if (isSelected) {
			cardStyle =
				'bg-gradient-to-tr from-[#FF9500] to-[#FF6B00] text-white shadow-2xl scale-[1.02] border-2 border-white ring-4 ring-orange-400/80 ring-offset-2 ring-offset-[#0d1033]';
			badgeStyle = 'bg-[#1F174B] text-white ring-2 ring-white/60';
			contrastBoxStyle = 'bg-white/95 border-2 border-white shadow-md text-slate-900';
		}
	} else {
		if (isCorrect) {
			cardStyle =
				'bg-gradient-to-tr from-[#00D166] to-[#059669] text-white shadow-2xl scale-[1.02] border-2 border-white ring-4 ring-emerald-400/80 ring-offset-2 ring-offset-[#0d1033]';
			badgeStyle = 'bg-[#093D22] text-white ring-2 ring-white/60';
			contrastBoxStyle = 'bg-white/95 border-2 border-white shadow-md text-slate-900';
		} else if (isSelected && !isCorrect) {
			cardStyle =
				'bg-gradient-to-tr from-[#FF435A] to-[#DC2626] text-white shadow-2xl scale-[1.02] border-2 border-white ring-4 ring-rose-400/80 ring-offset-2 ring-offset-[#0d1033]';
			badgeStyle = 'bg-[#5C0F17] text-white ring-2 ring-white/60';
			contrastBoxStyle = 'bg-white/95 border-2 border-white shadow-md text-slate-900';
		} else {
			cardStyle =
				'bg-white/80 text-slate-400 opacity-55 pointer-events-none border-slate-200';
			badgeStyle = 'bg-slate-200 text-slate-500';
			contrastBoxStyle = 'bg-slate-100 border border-slate-200 opacity-60';
		}
	}

	return (
		<button
			type='button'
			disabled={isSubmitted}
			onClick={() => {
				playButtonPop(soundEnabled);
				onSelectOption(opt.id);
			}}
			className={`rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 flex items-center justify-start gap-3 sm:gap-3.5 transition-all duration-200 text-left flex-1 h-full min-h-[92px] sm:min-h-[110px] cursor-pointer relative overflow-hidden ${cardStyle}`}
		>
			{/* Letter Badge (A, B, C, D) */}
			<div
				className={`w-9 h-9 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center font-black text-sm sm:text-base flex-shrink-0 shadow-md ${badgeStyle}`}
			>
				{isSubmitted && isCorrect ?
					<Check className='w-5 h-5 sm:w-6 sm:h-6 text-white stroke-[3]' />
				: isSubmitted && isSelected && !isCorrect ?
					<XIcon className='w-5 h-5 sm:w-6 sm:h-6 text-white stroke-[3]' />
				:	opt.id}
			</div>

			{/* Option Image (static or AI-generated), Dynamic Shape, or Concept Icon */}
			{displayImage ?
				<div
					className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center flex-shrink-0 overflow-hidden ${contrastBoxStyle}`}
				>
					<OptionImage
						src={displayImage}
						alt={`Option ${opt.id}`}
						className='w-full h-full object-contain p-1'
					/>
					{aiOptionImageUrl && !staticOptionImage && (
						<div className='absolute -top-1.5 -right-1.5 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full w-4 h-4 flex items-center justify-center shadow-md z-10'>
							<Sparkles className='w-2 h-2 text-white fill-white' />
						</div>
					)}
				</div>
			: isGenerating ?
				<div
					className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center flex-shrink-0 ${contrastBoxStyle}`}
				>
					<div className='w-4 h-4 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin' />
				</div>
			: parsedShape ?
				<div
					className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all ${contrastBoxStyle}`}
				>
					<DynamicSvgShape
						parsed={parsedShape}
						size={52}
						patternId={`opt-hatch-${opt.id}-${idx}`}
					/>
				</div>
			: conceptVisual?.icon && conceptVisual.icon !== '💡' ?
				<div
					className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl flex-shrink-0 transition-all ${contrastBoxStyle}`}
				>
					{conceptVisual.icon}
				</div>
			:	null}

			{/* Option Content Text */}
			<div className='flex flex-col justify-center flex-1 min-w-0'>
				<span
					className={`text-sm sm:text-base md:text-lg font-black tracking-tight leading-snug break-words ${
						isSelected && !isSubmitted ? 'text-white' : ''
					}`}
				>
					{text}
				</span>
			</div>
		</button>
	);
}

const OptionsGrid = memo(function OptionsGrid({
	options,
	selectedOptionId,
	onSelectOption,
	isSubmitted,
	correctAnswerId,
	soundEnabled,
	showVisualDiagrams = true,
	question,
}) {
	return (
		<div className='grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4.5 p-1 flex-1 h-full w-full'>
			{options.map((opt, idx) => (
				<OptionCard
					key={opt.id}
					opt={opt}
					idx={idx}
					isSelected={selectedOptionId === opt.id}
					isCorrect={opt.id === correctAnswerId}
					isSubmitted={isSubmitted}
					showVisualDiagrams={showVisualDiagrams}
					soundEnabled={soundEnabled}
					onSelectOption={onSelectOption}
					question={question}
				/>
			))}
		</div>
	);
});

export default OptionsGrid;
