import React, { useState } from 'react';
import { Rocket, Sparkles, Smile } from 'lucide-react';
import { playButtonPop, speakText } from '../utils/audioSynthesis';

export default function KidNameModal({ isOpen, onSaveName, currentName = '', soundEnabled = true }) {
  const [nameInput, setNameInput] = useState(currentName || '');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = nameInput.trim();
    if (!trimmed) {
      setError('Please type your name or nickname! 😊');
      return;
    }
    playButtonPop(soundEnabled);
    speakText(`Welcome, ${trimmed}! Let's start our Thinksheet adventure!`);
    onSaveName(trimmed);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300 select-none">
      <div className="bg-gradient-to-b from-[#1C1F5E] via-[#141846] to-[#0D1030] border-4 border-pink-500/80 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-[0_0_50px_rgba(255,91,132,0.4)] text-white text-center relative overflow-hidden">
        {/* Decorative ambient glow */}
        <div className="absolute -top-16 -left-16 w-32 h-32 bg-pink-500/20 rounded-full blur-2xl" />
        <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-cyan-500/20 rounded-full blur-2xl" />

        {/* Animated Icon */}
        <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center shadow-xl mb-5 animate-bounce">
          <Rocket className="w-10 h-10 text-white" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-white mb-2 tracking-wide flex items-center justify-center gap-2">
          <span>Welcome, Explorer!</span>
          <Sparkles className="w-6 h-6 text-amber-300" />
        </h2>

        <p className="text-sm font-semibold text-slate-300 mb-6 leading-relaxed">
          What is your name? Let's personalize your learning adventure!
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <Smile className="w-6 h-6 text-pink-400" />
            </div>
            <input
              type="text"
              autoFocus
              maxLength={20}
              value={nameInput}
              onChange={(e) => {
                setNameInput(e.target.value);
                if (error) setError('');
              }}
              placeholder="Type your name here..."
              className="w-full bg-[#090B24] border-2 border-[#2C3380] focus:border-pink-400 text-white text-lg sm:text-xl font-extrabold rounded-2xl pl-13 pr-4 py-3.5 placeholder:text-slate-500 focus:outline-none shadow-inner transition-all text-center"
            />
          </div>

          {error && (
            <p className="text-xs font-bold text-rose-400 animate-shake">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#FF5B84] to-[#FF435A] hover:from-[#FF435A] hover:to-[#E11D48] text-white font-black text-lg sm:text-xl tracking-wider uppercase shadow-[0_10px_25px_rgba(255,91,132,0.5)] transform hover:scale-[1.02] active:scale-95 transition-all mt-2 cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Let's Play! 🚀</span>
          </button>
        </form>
      </div>
    </div>
  );
}
