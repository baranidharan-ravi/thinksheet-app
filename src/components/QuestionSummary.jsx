import {
	CheckCircle2,
	ChevronDown,
	ChevronUp,
	LayoutGrid,
	Lightbulb,
	RefreshCw,
	XCircle,
} from 'lucide-react';
import { useState } from 'react';
import { playButtonPop } from '../utils/audioSynthesis';
import VisualDiagram from './VisualDiagrams';

export default function QuestionSummary({
	questions,
	history,
	onStartNextSheet,
	activeTab,
	setActiveTab,
	soundEnabled,
	onBackToDashboard,
}) {
	const [expandedIndex, setExpandedIndex] = useState(null);

	const toggleExpand = (idx) => {
		playButtonPop(soundEnabled);
		setExpandedIndex(expandedIndex === idx ? null : idx);
	};

	return (
		<div className='w-full max-w-5xl mx-auto px-4 py-6 flex flex-col items-center select-none animate-in fade-in zoom-in-95 duration-500'>
			{/* Top Tabs */}
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

			{/* Questions Accordion List */}
			<div className='w-full flex flex-col gap-3'>
				{questions.map((q, idx) => {
					const userResult = history[idx] || {};
					const isCorrect = userResult.isCorrect;
					const isExpanded = expandedIndex === idx;
					const userOption = q.options.find(
						(o) => o.id === userResult.selectedOptionId,
					);
					const correctOption = q.options.find(
						(o) => o.id === q.correctAnswerId,
					);

					return (
						<div
							key={q.id || idx}
							className='bg-[#121644] border-2 border-[#29317D] rounded-2xl overflow-hidden shadow-lg transition-all'>
							{/* Accordion Header */}
							<button
								onClick={() => toggleExpand(idx)}
								className='w-full p-4 sm:p-5 flex items-center justify-between gap-3 text-left hover:bg-[#181D58] transition-colors'>
								<div className='flex items-center gap-3'>
									{/* Status Icon */}
									{isCorrect ?
										<CheckCircle2 className='w-6 h-6 text-[#00D166] flex-shrink-0' />
									:	<XCircle className='w-6 h-6 text-[#FF435A] flex-shrink-0' />}

									{/* Question Index & Text */}
									<div>
										<div className='flex items-center gap-2'>
											<span className='text-xs font-black text-slate-400'>
												Q{idx + 1}/{questions.length}
											</span>
											<span className='text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full bg-[#202766] text-cyan-300 border border-[#313C96]'>
												{q.category}
											</span>
										</div>
										<p className='text-sm sm:text-base font-bold text-white mt-1 line-clamp-1'>
											{q.question}
										</p>
									</div>
								</div>

								{/* Right Arrow */}
								<div className='p-2 rounded-xl bg-[#1B215E] text-gray-300'>
									{isExpanded ?
										<ChevronUp className='w-4 h-4' />
									:	<ChevronDown className='w-4 h-4' />}
								</div>
							</button>

							{/* Accordion Body (Expanded View) */}
							{isExpanded && (
								<div className='p-5 bg-white text-slate-800 border-t-2 border-slate-200 flex flex-col gap-4 animate-in fade-in duration-200'>
									{/* Full Question Text */}
									<div className='font-extrabold text-base sm:text-lg text-slate-900'>
										{q.question}
									</div>

									{/* Question Visual if any */}
									{q.diagramType && (
										<div className='bg-slate-50 p-3 rounded-2xl border border-slate-200 flex justify-center'>
											<VisualDiagram
												type={q.diagramType}
												data={q.diagramData}
											/>
										</div>
									)}

									{/* Answers Comparison */}
									<div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
										<div
											className={`p-3.5 rounded-xl border-2 ${
												isCorrect ?
													'bg-emerald-50 border-emerald-400 text-emerald-900'
												:	'bg-rose-50 border-rose-400 text-rose-900'
											}`}>
											<span className='text-xs font-black uppercase tracking-wider block mb-1'>
												Your Answer:
											</span>
											<span className='font-bold text-sm sm:text-base'>
												{userOption ?
													`${userOption.id}. ${userOption.text}`
												:	'Not answered'}
											</span>
										</div>

										<div className='p-3.5 rounded-xl border-2 bg-emerald-50 border-emerald-400 text-emerald-900'>
											<span className='text-xs font-black uppercase tracking-wider block mb-1'>
												Correct Answer:
											</span>
											<span className='font-bold text-sm sm:text-base'>
												{correctOption ?
													`${correctOption.id}. ${correctOption.text}`
												:	''}
											</span>
										</div>
									</div>

									{/* Solution Card with Visual */}
									<div className='bg-purple-50 rounded-2xl p-4 border border-purple-200'>
										<div className='flex items-center gap-2 text-purple-800 font-black text-sm mb-2'>
											<Lightbulb className='w-4 h-4 text-amber-500 fill-amber-400' />
											<span>Solution Explanation</span>
										</div>
										<p className='text-xs sm:text-sm font-semibold text-slate-700 leading-relaxed mb-3'>
											{q.solutionText}
										</p>
										{q.solutionDiagramType && (
											<div className='bg-white p-2 rounded-xl border border-purple-100 flex justify-center'>
												<VisualDiagram
													type={q.solutionDiagramType}
													data={q.solutionDiagramData || q.diagramData}
													isSolution={true}
												/>
											</div>
										)}
									</div>
								</div>
							)}
						</div>
					);
				})}
			</div>

			{/* Bottom Action Buttons */}
			<div className='mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-lg'>
				<button
					onClick={() => {
						playButtonPop(soundEnabled);
						onStartNextSheet();
					}}
					className='w-full py-3.5 sm:py-4 px-6 rounded-2xl bg-gradient-to-r from-[#FF5B84] to-[#FF435A] hover:from-[#FF435A] hover:to-[#E11D48] text-white font-extrabold text-sm sm:text-base shadow-[0_10px_25px_rgba(255,91,132,0.4)] flex items-center justify-center gap-2 transform hover:-translate-y-0.5 transition-all'>
					<RefreshCw className='w-4 h-4 animate-spin-slow' />
					<span>Start Next Thinksheet (10 New Questions)</span>
				</button>

				{onBackToDashboard && (
					<button
						onClick={() => {
							playButtonPop(soundEnabled);
							onBackToDashboard();
						}}
						className='w-full sm:w-auto py-3.5 sm:py-4 px-6 rounded-2xl bg-[#1C2263] hover:bg-[#252D80] border border-[#3A45A8] text-cyan-300 hover:text-white font-extrabold text-sm sm:text-base transition-all flex items-center justify-center gap-2'>
						<LayoutGrid className='w-4 h-4' />
						<span>Back to Skills Hub</span>
					</button>
				)}
			</div>
		</div>
	);
}
