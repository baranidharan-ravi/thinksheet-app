import React from 'react';
import { clearSessionState } from './storage';

/**
 * AstroQuest Cosmic Error Boundary
 * Catches JavaScript errors anywhere in child component tree,
 * logs them, and displays a friendly fallback UI instead of crashing.
 */
export default class ErrorBoundary extends React.Component {
	constructor(props) {
		super(props);
		this.state = { hasError: false, error: null, errorInfo: null };
	}

	static getDerivedStateFromError(error) {
		return { hasError: true, error };
	}

	componentDidCatch(error, errorInfo) {
		console.error('AstroQuest ErrorBoundary caught an error:', error, errorInfo);
		this.setState({ errorInfo });
	}

	handleRestart = () => {
		this.setState({ hasError: false, error: null, errorInfo: null });
		window.location.reload();
	};

	handleResetAndRestart = () => {
		clearSessionState();
		localStorage.removeItem('thinksheet_active_session_v1');
		this.setState({ hasError: false, error: null, errorInfo: null });
		window.location.reload();
	};

	render() {
		if (this.state.hasError) {
			return (
				<div className='min-h-screen bg-gradient-to-b from-[#0A0C27] via-[#121644] to-[#0A0C27] text-white flex items-center justify-center p-6 select-none font-sans'>
					<div className='max-w-lg w-full bg-[#15194D]/90 border-2 border-[#38419D] rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col items-center text-center'>
						{/* Cosmic Graphic */}
						<div className='w-20 h-20 rounded-3xl bg-gradient-to-tr from-pink-500 to-indigo-600 flex items-center justify-center text-4xl shadow-xl animate-bounce mb-5'>
							🚀
						</div>

						{/* Title */}
						<h1 className='text-2xl sm:text-3xl font-black text-white tracking-wide mb-2'>
							Cosmic Bump Detected!
						</h1>

						{/* Kid-Friendly Subtitle */}
						<p className='text-sm sm:text-base text-cyan-200 font-semibold mb-6 leading-relaxed'>
							AstroQuest hit a little stardust! Don&apos;t worry, your progress and settings are safe.
						</p>

						{/* Action Buttons */}
						<div className='w-full flex flex-col gap-3'>
							<button
								onClick={this.handleRestart}
								className='w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#FF5B84] to-[#FF435A] hover:from-[#FF435A] hover:to-[#E11D48] text-white font-extrabold text-base shadow-lg transition-all cursor-pointer transform hover:scale-[1.02] active:scale-98'>
								🔄 Refresh & Continue 🚀
							</button>

							<button
								onClick={this.handleResetAndRestart}
								className='w-full py-3 rounded-2xl bg-[#1C2263] hover:bg-[#252D80] border border-[#3A45A8] text-slate-300 hover:text-white font-extrabold text-sm transition-all cursor-pointer'>
								🧹 Reset Session Cache & Restart
							</button>
						</div>

						{/* Technical Error Details (Collapsible for debugging) */}
						{this.state.error && (
							<details className='mt-6 w-full text-left bg-black/40 border border-slate-700/60 rounded-xl p-3 text-xs text-slate-400'>
								<summary className='cursor-pointer font-bold text-slate-300 hover:text-cyan-300 transition-colors'>
									Technical Details
								</summary>
								<pre className='mt-2 overflow-x-auto text-[11px] text-rose-300 whitespace-pre-wrap font-mono'>
									{this.state.error.toString()}
									{this.state.errorInfo?.componentStack}
								</pre>
							</details>
						)}
					</div>
				</div>
			);
		}

		return this.props.children;
	}
}
