import { X, ZoomIn, ZoomOut } from 'lucide-react';
import React from 'react';
import { playButtonPop } from './audioSynthesis';
import VisualDiagram from './VisualDiagrams';

const ZoomModal = React.memo(function ZoomModal({
	diagramType,
	diagramData,
	isOpen,
	onClose,
	soundEnabled,
}) {
	const [scale, setScale] = React.useState(1.4);

	if (!isOpen || !diagramType) return null;

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200'>
			<div className='bg-white text-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative flex flex-col items-center animate-in zoom-in-95 duration-200'>
				{/* Top Controls */}
				<div className='w-full flex items-center justify-between pb-3 border-b border-slate-200 mb-4'>
					<span className='font-extrabold text-slate-700 text-lg'>
						🔍 Close-up Diagram View
					</span>

					<div className='flex items-center gap-2'>
						<button
							onClick={() => setScale((s) => Math.min(s + 0.2, 2.2))}
							className='p-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-bold'
							title='Zoom In'>
							<ZoomIn className='w-4 h-4' />
						</button>
						<button
							onClick={() => setScale((s) => Math.max(s - 0.2, 0.8))}
							className='p-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-bold'
							title='Zoom Out'>
							<ZoomOut className='w-4 h-4' />
						</button>
						<button
							onClick={() => {
								playButtonPop(soundEnabled);
								onClose();
							}}
							className='p-2 bg-slate-100 hover:bg-rose-100 hover:text-rose-600 rounded-lg text-slate-700 ml-2'
							title='Close'>
							<X className='w-5 h-5' />
						</button>
					</div>
				</div>

				{/* Scaled Diagram */}
				<div className='w-full overflow-auto flex items-center justify-center p-8 bg-slate-50 rounded-2xl min-h-[300px]'>
					<div
						style={{
							transform: `scale(${scale})`,
							transition: 'transform 0.2s ease-out',
						}}>
						<VisualDiagram
							type={diagramType}
							data={diagramData}
						/>
					</div>
				</div>

				{/* Done button */}
				<button
					onClick={() => {
						playButtonPop(soundEnabled);
						onClose();
					}}
					className='mt-5 w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold shadow-md'>
					Done Looking ✨
				</button>
			</div>
		</div>
	);
});

export default ZoomModal;
