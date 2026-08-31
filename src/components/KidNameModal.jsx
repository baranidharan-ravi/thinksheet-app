import React, { useState } from 'react';
import { Rocket, Sparkles, Smile, Calendar } from 'lucide-react';
import { playButtonPop, speakText } from '../utils/audioSynthesis';

export default function KidNameModal({
  isOpen,
  onSaveProfile,
  currentName = '',
  currentAge = 5,
  soundEnabled = true
}) {
  const [nameInput, setNameInput] = useState(currentName || '');
  const [ageInput, setAgeInput] = useState(currentAge || 5);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const quickAges = [3, 4, 5, 6, 7, 8];

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedName = nameInput.trim();
    if (!trimmedName) {
      setError('Please type your name or nickname! 😊');
      return;
    }

    const numAge = parseInt(ageInput, 10);
    if (!numAge || numAge < 3 || numAge > 12) {
      setError('Please select an age between 3 and 12 years old! 🎂');
      return;
    }

    playButtonPop(soundEnabled);
    speakText(`Welcome, ${trimmedName}! Let's start learning adventures for ${numAge} year olds!`);
    onSaveProfile({ name: trimmedName, age: numAge });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300 select-none">
      <div className="bg-gradient-to-b from-[#1C1F5E] via-[#141846] to-[#0D1030] border-4 border-pink-500/80 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-[0_0_50px_rgba(255,91,132,0.4)] text-white text-center relative overflow-hidden">
        {/* Decorative ambient glow */}
        <div className="absolute -top-16 -left-16 w-32 h-32 bg-pink-500/20 rounded-full blur-2xl" />
        <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-cyan-500/20 rounded-full blur-2xl" />

        {/* Animated Icon */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-3xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center shadow-xl mb-4 animate-bounce">
          <Rocket className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-white mb-1.5 tracking-wide flex items-center justify-center gap-2">
          <span>Welcome, Explorer!</span>
          <Sparkles className="w-6 h-6 text-amber-300" />
        </h2>

        <p className="text-xs sm:text-sm font-semibold text-slate-300 mb-5 leading-relaxed">
          Tell us your name and age so we can tailor the challenges perfectly for you!
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
          {/* Name Field */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Your Name:
            </label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <Smile className="w-5 h-5 text-pink-400" />
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
                className="w-full bg-[#090B24] border-2 border-[#2C3380] focus:border-pink-400 text-white text-base sm:text-lg font-extrabold rounded-2xl pl-11 pr-4 py-3 placeholder:text-slate-500 focus:outline-none shadow-inner transition-all"
              />
            </div>
          </div>

          {/* Age Selection Field */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>How old are you? ({ageInput} years old)</span>
            </label>

            {/* Quick Age Buttons */}
            <div className="grid grid-cols-6 gap-1.5 sm:gap-2">
              {quickAges.map((age) => (
                <button
                  type="button"
                  key={age}
                  onClick={() => {
                    playButtonPop(soundEnabled);
                    setAgeInput(age);
                    if (error) setError('');
                  }}
                  className={`py-2.5 rounded-xl font-black text-sm sm:text-base transition-all border ${
                    ageInput === age
                      ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white border-white ring-2 ring-pink-400/50 scale-105 shadow-md'
                      : 'bg-[#090B24] text-slate-300 border-[#2C3380] hover:bg-[#1E2568] hover:text-white'
                  }`}
                >
                  {age}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p className="text-xs font-bold text-rose-400 text-center animate-shake">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-[#FF5B84] to-[#FF435A] hover:from-[#FF435A] hover:to-[#E11D48] text-white font-black text-base sm:text-lg tracking-wider uppercase shadow-[0_10px_25px_rgba(255,91,132,0.5)] transform hover:scale-[1.02] active:scale-95 transition-all mt-2 cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Let's Play! 🚀</span>
          </button>
        </form>
      </div>
    </div>
  );
}
