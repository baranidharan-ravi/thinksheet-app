import React, { useState } from 'react';
import { Sparkles, Image as ImageIcon } from 'lucide-react';

/**
 * Lazy-loaded visual image component with skeleton placeholder and smooth transitions
 */
export function LazyVisualImage({ src, alt, caption = '' }) {
	const [loaded, setLoaded] = useState(false);
	const [error, setError] = useState(false);

	if (!src || error) {
		return (
			<div className='flex flex-col items-center justify-center p-4 bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl text-slate-400 my-2'>
				<ImageIcon className='w-6 h-6 text-slate-400 mb-1' />
				<span className='text-xs font-semibold'>Visual Diagram</span>
			</div>
		);
	}

	return (
		<div className='relative flex flex-col items-center justify-center my-2 max-w-md w-full'>
			{/* Skeleton Shimmer while loading */}
			{!loaded && (
				<div className='w-full h-40 sm:h-48 bg-slate-100 rounded-2xl animate-pulse flex items-center justify-center border border-slate-200'>
					<div className='flex items-center gap-2 text-slate-400 text-xs font-bold'>
						<div className='w-4 h-4 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin' />
						<span>Loading visual clue...</span>
					</div>
				</div>
			)}
			<img
				src={src}
				alt={alt || 'Question Visual Clue'}
				loading='lazy'
				decoding='async'
				onLoad={() => setLoaded(true)}
				onError={() => setError(true)}
				className={`max-h-52 w-auto max-w-full rounded-2xl object-contain shadow-md border-2 border-slate-200 transition-all duration-500 ${
					loaded ? 'opacity-100 block' : 'opacity-0 hidden'
				}`}
			/>
			{caption && loaded && (
				<span className='text-[11px] font-bold text-slate-500 mt-1.5 text-center'>
					{caption}
				</span>
			)}
		</div>
	);
}

/**
 * Renders custom SVG graphical puzzles, analogy cards, sequence ladders, and lazy images.
 * Supports both static presets and dynamic procedural puzzle data.
 */
export default function VisualDiagram({ type, data = {}, isSolution = false }) {
	// If direct image URL is passed, render lazy visual image
	if (type === 'image' || data?.imageUrl || data?.src) {
		const imgSrc = data?.imageUrl || data?.src || '';
		return (
			<LazyVisualImage
				src={imgSrc}
				alt={data?.alt || 'Question Diagram'}
				caption={data?.caption}
			/>
		);
	}

	switch (type) {
		case 'analogy-map': {
			const itemA = data.itemA || 'Item A';
			const itemB = data.itemB || 'Item B';
			const itemC = data.itemC || 'Item C';
			const itemD = data.itemD || data.target || '?';

			return (
				<div className='flex flex-col items-center justify-center p-3.5 my-2 bg-gradient-to-br from-indigo-50/90 via-purple-50/70 to-pink-50/90 rounded-2xl border-2 border-indigo-100 shadow-sm max-w-lg w-full animate-in fade-in duration-300'>
					{/* Top pair: A -> B */}
					<div className='flex items-center justify-center gap-2 sm:gap-3 w-full mb-1.5'>
						<div className='px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-white border border-indigo-200 text-indigo-950 font-extrabold text-xs sm:text-sm shadow-sm text-center max-w-[140px] truncate'>
							{itemA}
						</div>
						<div className='flex items-center text-indigo-600 font-black text-sm'>
							➔
						</div>
						<div className='px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-indigo-600 text-white font-extrabold text-xs sm:text-sm shadow-sm text-center max-w-[140px] truncate'>
							{itemB}
						</div>
					</div>

					{/* Linking text */}
					<div className='flex items-center gap-2 text-[10px] font-black uppercase text-purple-600 tracking-widest my-1'>
						<span>:: as ::</span>
					</div>

					{/* Bottom pair: C -> ? (or Solution) */}
					<div className='flex items-center justify-center gap-2 sm:gap-3 w-full mt-1.5'>
						<div className='px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-white border border-pink-200 text-pink-950 font-extrabold text-xs sm:text-sm shadow-sm text-center max-w-[140px] truncate'>
							{itemC}
						</div>
						<div className='flex items-center text-pink-600 font-black text-sm'>
							➔
						</div>
						<div
							className={`px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl font-extrabold text-xs sm:text-sm shadow-md transition-all text-center max-w-[140px] truncate ${
								isSolution ?
									'bg-emerald-500 text-white ring-2 ring-emerald-300 animate-bounce'
								:	'bg-white border-2 border-dashed border-purple-400 text-purple-600'
							}`}>
							{isSolution ? itemD : '?'}
						</div>
					</div>
				</div>
			);
		}

		case 'cause-effect': {
			const cause = data.cause || 'Cause / Action';
			const action = data.action || 'leads to';
			const effect = data.effect || '?';

			return (
				<div className='flex items-center justify-center flex-wrap gap-2 sm:gap-3 p-3.5 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-200 shadow-sm my-2 max-w-lg w-full animate-in fade-in duration-300'>
					<div className='px-3.5 py-2.5 rounded-xl bg-white border border-amber-300 text-amber-950 font-extrabold text-xs sm:text-sm shadow-sm max-w-[150px] text-center truncate'>
						{cause}
					</div>
					<div className='flex items-center gap-1 text-orange-500 font-black text-xs'>
						<span>➔ {action} ➔</span>
					</div>
					<div
						className={`px-3.5 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm shadow-md transition-all max-w-[150px] text-center truncate ${
							isSolution ?
								'bg-emerald-500 text-white ring-2 ring-emerald-300 animate-bounce'
							:	'bg-white border-2 border-dashed border-orange-400 text-orange-600'
						}`}>
						{isSolution ? effect : '?'}
					</div>
				</div>
			);
		}

		case 'sequence-ladder': {
			const steps = Array.isArray(data.steps) ? data.steps : [2, 4, 6, 8];
			const nextVal = data.nextVal || '?';
			const rule = data.rule || '';

			return (
				<div className='flex flex-col items-center justify-center p-3.5 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl border-2 border-cyan-200 shadow-sm my-2 max-w-lg w-full animate-in fade-in duration-300'>
					<div className='flex items-center justify-center flex-wrap gap-1.5 sm:gap-2'>
						{steps.map((step, idx) => (
							<div key={idx} className='flex items-center gap-1 sm:gap-1.5'>
								<div className='w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-cyan-600 text-white font-black text-xs sm:text-sm flex items-center justify-center shadow-md'>
									{step}
								</div>
								{idx < steps.length - 1 && (
									<span className='text-xs font-black text-cyan-400'>➔</span>
								)}
							</div>
						))}
						<span className='text-xs font-black text-cyan-400'>➔</span>
						<div
							className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center shadow-md transition-all ${
								isSolution ?
									'bg-emerald-500 text-white ring-2 ring-emerald-300 animate-bounce'
								:	'bg-white border-2 border-dashed border-cyan-500 text-cyan-600'
							}`}>
							{isSolution ? nextVal : '?'}
						</div>
					</div>
					{rule && (
						<span className='text-[10px] font-bold text-slate-500 mt-2'>
							Pattern Rule: {rule}
						</span>
					)}
				</div>
			);
		}

		case 'classification-venn': {
			const category = data.category || 'Category';
			const items = Array.isArray(data.items) ? data.items : ['Item 1', 'Item 2'];
			const oddItem = data.oddItem || 'Odd Item';

			return (
				<div className='flex flex-col items-center justify-center p-3.5 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border-2 border-emerald-200 shadow-sm my-2 max-w-lg w-full animate-in fade-in duration-300'>
					<div className='text-[11px] font-black uppercase text-emerald-800 tracking-wider mb-2'>
						📂 Category: {category}
					</div>
					<div className='flex items-center justify-center flex-wrap gap-2'>
						{items.map((it, idx) => (
							<span
								key={idx}
								className='px-3 py-1.5 rounded-lg bg-white border border-emerald-300 text-emerald-900 font-bold text-xs shadow-sm'>
								{it}
							</span>
						))}
						{isSolution && (
							<span className='px-3 py-1.5 rounded-lg bg-rose-500 text-white font-black text-xs shadow-md ring-2 ring-rose-300 animate-bounce'>
								🚫 Odd: {oddItem}
							</span>
						)}
					</div>
				</div>
			);
		}

		case 'matrix-grid': {
			const grid = data.grid || [
				['🔴', '🔵'],
				['🔵', '?'],
			];
			const answer = data.answer || '🔴';

			return (
				<div className='flex flex-col items-center justify-center p-3 bg-purple-50 rounded-2xl border-2 border-purple-200 my-2'>
					<div className='grid grid-cols-2 gap-2 bg-white p-2.5 rounded-xl border border-purple-200 shadow-inner'>
						{grid.flat().map((cell, idx) => {
							const isTarget = cell === '?' || idx === grid.flat().length - 1;
							return (
								<div
									key={idx}
									className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-xl transition-all shadow-sm ${
										isTarget ?
											isSolution ?
												'bg-emerald-500 text-white ring-2 ring-emerald-300 animate-bounce'
											:	'bg-purple-100 border-2 border-dashed border-purple-400 text-purple-600'
										:	'bg-slate-50 border border-slate-200 text-slate-800'
									}`}>
									{isTarget ?
										isSolution ?
											answer
										:	'?'
									:	cell}
								</div>
							);
						})}
					</div>
				</div>
			);
		}

		case 'grid-tiles': {
			// Configurable grid puzzle (default 6x6 with 3x3 hole in center)
			const rows = data.rows || 6;
			const cols = data.cols || 6;
			const holeRow = data.holeRow ?? 1;
			const holeCol = data.holeCol ?? 2;
			const holeW = data.holeW ?? 3;
			const holeH = data.holeH ?? 3;
			const totalHoleTiles = holeW * holeH;

			const size = 200;
			const cellW = size / cols;
			const cellH = size / rows;
			const startX = 20;
			const startY = 20;

			const holeX = startX + holeCol * cellW;
			const holeY = startY + holeRow * cellH;
			const holeWidth = holeW * cellW;
			const holeHeight = holeH * cellH;

			return (
				<div className='flex flex-col items-center justify-center p-3'>
					<svg viewBox='0 0 240 240' className='w-48 h-48 sm:w-56 sm:h-56'>
						<rect
							x={startX}
							y={startY}
							width={size}
							height={size}
							fill='#F8FAFC'
							stroke='#94A3B8'
							strokeWidth='2'
							rx='4'
						/>
						{Array.from({ length: cols + 1 }).map((_, i) => (
							<line
								key={`v-${i}`}
								x1={startX + i * cellW}
								y1={startY}
								x2={startX + i * cellW}
								y2={startY + size}
								stroke='#CBD5E1'
								strokeWidth='1.5'
							/>
						))}
						{Array.from({ length: rows + 1 }).map((_, i) => (
							<line
								key={`h-${i}`}
								x1={startX}
								y1={startY + i * cellH}
								x2={startX + size}
								y2={startY + i * cellH}
								stroke='#CBD5E1'
								strokeWidth='1.5'
							/>
						))}
						<rect
							x={holeX}
							y={holeY}
							width={holeWidth}
							height={holeHeight}
							fill='#FFFFFF'
						/>
						{isSolution ?
							<g>
								<rect
									x={holeX}
									y={holeY}
									width={holeWidth}
									height={holeHeight}
									fill='#FFE4E6'
									stroke='#EF4444'
									strokeWidth='3'
									rx='2'
								/>
								{Array.from({ length: holeW - 1 }).map((_, i) => (
									<line
										key={`sol-v-${i}`}
										x1={holeX + (i + 1) * cellW}
										y1={holeY}
										x2={holeX + (i + 1) * cellW}
										y2={holeY + holeHeight}
										stroke='#EF4444'
										strokeWidth='2'
									/>
								))}
								{Array.from({ length: holeH - 1 }).map((_, i) => (
									<line
										key={`sol-h-${i}`}
										x1={holeX}
										y1={holeY + (i + 1) * cellH}
										x2={holeX + holeWidth}
										y2={holeY + (i + 1) * cellH}
										stroke='#EF4444'
										strokeWidth='2'
									/>
								))}
								{Array.from({ length: totalHoleTiles }).map((_, i) => {
									const r = Math.floor(i / holeW);
									const c = i % holeW;
									const tx = holeX + (c + 0.5) * cellW;
									const ty = holeY + (r + 0.5) * cellH + 2;
									return (
										<text
											key={`num-${i}`}
											x={tx}
											y={ty}
											fill='#DC2626'
											fontSize={holeW > 3 ? '16' : '20'}
											fontWeight='bold'
											textAnchor='middle'
											dominantBaseline='middle'
											fontFamily='Nunito, sans-serif'>
											{i + 1}
										</text>
									);
								})}
							</g>
						:	null}
					</svg>
				</div>
			);
		}

		case 'pattern-shapes': {
			const items = data.sequence || ['●', '▲', '■', '●', '▲'];
			const nextItem = data.nextItem || '■';

			return (
				<div className='flex items-center justify-center flex-wrap gap-2.5 sm:gap-3.5 p-4 bg-purple-50 rounded-2xl border-2 border-purple-100 my-2'>
					{items.map((item, idx) => (
						<div
							key={idx}
							className='w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-indigo-600 text-white font-bold text-2xl flex items-center justify-center shadow-md transform hover:scale-105 transition-transform'>
							{item}
						</div>
					))}
					<div
						className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center font-bold text-2xl shadow-inner transition-all ${
							isSolution ?
								'bg-rose-500 text-white animate-bounce'
							:	'bg-white border-2 border-dashed border-purple-400 text-purple-600'
						}`}>
						{isSolution ? nextItem : '?'}
					</div>
				</div>
			);
		}

		case 'apple-counting': {
			const count = Number(data.count) > 0 ? Number(data.count) : 4;
			const emoji = data.emoji || '🍎';
			return (
				<div className='flex flex-col items-center justify-center p-2'>
					<div className='bg-emerald-50 border-2 border-emerald-200 rounded-3xl p-4 sm:p-5 flex flex-wrap items-center justify-center gap-3 max-w-sm shadow-inner'>
						{Array.from({ length: count }).map((_, idx) => (
							<div
								key={idx}
								className='relative flex items-center justify-center w-11 h-11 bg-white rounded-2xl shadow-sm border border-emerald-100 transform hover:scale-110 transition-transform'>
								<span className='text-2xl'>{emoji}</span>
								{isSolution && (
									<span className='absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow'>
										{idx + 1}
									</span>
								)}
							</div>
						))}
					</div>
				</div>
			);
		}

		case 'scale-balance': {
			const leftItem = data.leftEmoji || '🎈';
			const rightItem = data.rightEmoji || '🪨';
			const heavySide = data.heavySide || 'right';

			const isRightHeavy = heavySide === 'right';

			return (
				<div className='flex flex-col items-center justify-center p-3'>
					<svg viewBox='0 0 260 160' className='w-56 h-36'>
						<polygon points='130,110 110,150 150,150' fill='#64748B' />
						<line
							x1='30'
							y1={isRightHeavy ? 85 : 125}
							x2='230'
							y2={isRightHeavy ? 125 : 85}
							stroke='#334155'
							strokeWidth='6'
							strokeLinecap='round'
						/>
						<line
							x1='45'
							y1={isRightHeavy ? 88 : 128}
							x2='45'
							y2={isRightHeavy ? 110 : 145}
							stroke='#94A3B8'
							strokeWidth='2'
						/>
						<path
							d={
								isRightHeavy ?
									'M 25 110 Q 45 120 65 110'
								:	'M 25 145 Q 45 155 65 145'
							}
							fill='none'
							stroke='#64748B'
							strokeWidth='3'
						/>
						<text
							x='45'
							y={isRightHeavy ? 100 : 135}
							fontSize='24'
							textAnchor='middle'>
							{leftItem}
						</text>
						<line
							x1='215'
							y1={isRightHeavy ? 122 : 88}
							x2='215'
							y2={isRightHeavy ? 145 : 110}
							stroke='#94A3B8'
							strokeWidth='2'
						/>
						<path
							d={
								isRightHeavy ?
									'M 195 145 Q 215 155 235 145'
								:	'M 195 110 Q 215 120 235 110'
							}
							fill='none'
							stroke='#64748B'
							strokeWidth='3'
						/>
						<text
							x='215'
							y={isRightHeavy ? 135 : 100}
							fontSize='24'
							textAnchor='middle'>
							{rightItem}
						</text>
					</svg>
				</div>
			);
		}

		case 'block-tower': {
			const bottom = data.bottom || 3;
			const middle = data.middle || 2;
			const top = data.top || 1;

			return (
				<div className='flex flex-col items-center justify-center p-3'>
					<svg viewBox='0 0 200 160' className='w-48 h-40'>
						{Array.from({ length: bottom }).map((_, i) => {
							const x = 100 - (bottom * 40) / 2 + i * 40 + 2.5;
							return (
								<rect
									key={`b-${i}`}
									x={x}
									y='110'
									width='35'
									height='35'
									fill='#3B82F6'
									stroke='#1D4ED8'
									strokeWidth='2'
									rx='4'
								/>
							);
						})}
						{Array.from({ length: middle }).map((_, i) => {
							const x = 100 - (middle * 40) / 2 + i * 40 + 2.5;
							return (
								<rect
									key={`m-${i}`}
									x={x}
									y='70'
									width='35'
									height='35'
									fill='#F59E0B'
									stroke='#B45309'
									strokeWidth='2'
									rx='4'
								/>
							);
						})}
						{Array.from({ length: top }).map((_, i) => {
							const x = 100 - (top * 40) / 2 + i * 40 + 2.5;
							return (
								<rect
									key={`t-${i}`}
									x={x}
									y='30'
									width='35'
									height='35'
									fill='#EC4899'
									stroke='#BE185D'
									strokeWidth='2'
									rx='4'
								/>
							);
						})}
						{isSolution && (
							<g
								fill='#FFFFFF'
								fontWeight='bold'
								fontSize='16'
								textAnchor='middle'>
								{Array.from({ length: bottom }).map((_, i) => (
									<text
										key={`bn-${i}`}
										x={100 - (bottom * 40) / 2 + i * 40 + 20}
										y='133'>
										{i + 1}
									</text>
								))}
								{Array.from({ length: middle }).map((_, i) => (
									<text
										key={`mn-${i}`}
										x={100 - (middle * 40) / 2 + i * 40 + 20}
										y='93'>
										{bottom + i + 1}
									</text>
								))}
								{Array.from({ length: top }).map((_, i) => (
									<text
										key={`tn-${i}`}
										x={100 - (top * 40) / 2 + i * 40 + 20}
										y='53'>
										{bottom + middle + i + 1}
									</text>
								))}
							</g>
						)}
					</svg>
				</div>
			);
		}

		case 'butterfly-symmetry': {
			return (
				<div className='flex flex-col items-center justify-center p-3'>
					<svg viewBox='0 0 200 160' className='w-52 h-40'>
						<line
							x1='100'
							y1='20'
							x2='100'
							y2='140'
							stroke='#CBD5E1'
							strokeWidth='2'
							strokeDasharray='4 4'
						/>
						<ellipse cx='100' cy='80' rx='6' ry='30' fill='#475569' />
						<path
							d='M 96 60 C 50 10 20 40 50 80 C 20 110 50 140 96 100 Z'
							fill='#8B5CF6'
							stroke='#6D28D9'
							strokeWidth='2'
						/>
						<circle cx='60' cy='60' r='8' fill='#FDE047' />
						<circle cx='65' cy='100' r='6' fill='#F43F5E' />

						{isSolution ?
							<g>
								<path
									d='M 104 60 C 150 10 180 40 150 80 C 180 110 150 140 104 100 Z'
									fill='#8B5CF6'
									stroke='#6D28D9'
									strokeWidth='2'
								/>
								<circle cx='140' cy='60' r='8' fill='#FDE047' />
								<circle cx='135' cy='100' r='6' fill='#F43F5E' />
							</g>
						:	<path
								d='M 104 60 C 150 10 180 40 150 80 C 180 110 150 140 104 100 Z'
								fill='none'
								stroke='#94A3B8'
								strokeWidth='2'
								strokeDasharray='4 4'
							/>
						}
					</svg>
				</div>
			);
		}

		default:
			return null;
	}
}
