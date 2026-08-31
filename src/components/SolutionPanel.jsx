import React from 'react';
import {
  CheckCircle2,
  HelpCircle,
  Lightbulb,
  Volume2,
  XCircle,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { playButtonPop, speakText } from '../utils/audioSynthesis';
import VisualDiagram from './VisualDiagrams';

export default function SolutionPanel({
  isCorrect,
  question,
  onAskDoubt,
  soundEnabled,
  onNext
}) {
  const handleListenSolution = () => {
    playButtonPop(soundEnabled);
    speakText(question.solutionText);
  };

  return (
    <div className="flex flex-col gap-3.5 sm:gap-4 animate-in fade-in slide-in-from-right-4 duration-300">
      {/* Feedback Banner with Celebratory Animation on Correct */}
      <div
        className={`rounded-2xl sm:rounded-3xl p-4 sm:p-5 flex items-center gap-3.5 shadow-xl border-2 transition-all relative overflow-hidden ${
          isCorrect
            ? 'bg-[#E8F8F0] border-[#00D166] text-[#0A5D37] ring-4 ring-emerald-400/40 shadow-[0_0_20px_rgba(0,209,102,0.3)] animate-bounce-short'
            : 'bg-[#FFF0F2] border-[#FF435A] text-[#9E1B2D]'
        }`}
      >
        <div className="flex-shrink-0">
          {isCorrect ? (
            <div className="relative">
              <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-[#00D166] fill-[#00D166]/20 animate-pulse" />
              <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400 absolute -top-1 -right-1 animate-spin-slow" />
            </div>
          ) : (
            <XCircle className="w-8 h-8 sm:w-10 sm:h-10 text-[#FF435A] fill-[#FF435A]/20" />
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-black leading-tight">
              {isCorrect ? 'Correct! 🎉' : 'Incorrect!'}
            </h3>
            {isCorrect && (
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-xs font-black shadow-sm animate-pulse">
                +5 XP ✨
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm font-semibold opacity-90 mt-0.5">
            {isCorrect
              ? 'Great thinking! You got it right.'
              : "Don't worry, See the solution to know why"}
          </p>
        </div>
      </div>

      {/* Solution Card */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-slate-800 shadow-xl border-4 border-white/90 flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2 text-purple-700 font-extrabold text-sm sm:text-base">
              <Lightbulb className="w-5 h-5 text-amber-500 fill-amber-400" />
              <span>Solution</span>
            </div>
            <button
              onClick={handleListenSolution}
              className="p-1 rounded-full text-purple-600 hover:bg-purple-50 transition-all"
              title="Listen to solution"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>

          {/* Solution Explanation Text */}
          <p className="text-xs sm:text-sm md:text-base font-bold text-slate-700 leading-relaxed mb-3">
            {question.solutionText}
          </p>

          {/* Solution Visual Diagram */}
          {question.solutionDiagramType && (
            <div className="bg-slate-50 rounded-2xl p-2 flex justify-center items-center border border-slate-200/80 my-2">
              <VisualDiagram
                type={question.solutionDiagramType}
                data={question.solutionDiagramData || question.diagramData}
                isSolution={true}
              />
            </div>
          )}
        </div>

        {/* Bottom Helper */}
        <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-center">
          <button
            onClick={() => {
              playButtonPop(soundEnabled);
              onAskDoubt();
            }}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-pink-500 hover:text-pink-600 transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
            <span>? Ask Doubt</span>
          </button>
        </div>
      </div>

      {/* NEXT BUTTON: Positioned right below the Solution section for instant access */}
      {onNext && (
        <div className="flex justify-end mt-1">
          <button
            onClick={onNext}
            className="w-full sm:w-auto px-10 py-3.5 sm:py-4 rounded-full bg-[#FF5B84] hover:bg-[#FF435A] text-white font-black text-sm sm:text-lg tracking-wider uppercase hover:scale-105 active:scale-95 shadow-[0_8px_20px_rgba(255,91,132,0.5)] flex items-center justify-center gap-2 cursor-pointer transition-all animate-bounce-short"
          >
            <span>Next</span>
            <ArrowRight className="w-5 h-5 stroke-[3]" />
          </button>
        </div>
      )}
    </div>
  );
}
