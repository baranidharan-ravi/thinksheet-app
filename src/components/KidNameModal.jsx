import React, { useState } from 'react';
import { Rocket, Sparkles, Smile, Calendar, Plus, Minus, Edit3 } from 'lucide-react';
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
  const [isCustomAge, setIsCustomAge] = useState(
    () => ![3, 4, 5, 6, 7, 8].includes(Number(currentAge))
  );
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const quickAges = [3, 4, 5, 6, 7, 8];

  const handleQuickAgeSelect = (age) => {
    playButtonPop(soundEnabled);
    setAgeInput(age);
    setIsCustomAge(false);
    if (error) setError('');
  };

  const handleCustomToggle = () => {
    playButtonPop(soundEnabled);
    setIsCustomAge(true);
    if (error) setError('');
  };

  const handleIncrementAge = (delta) => {
    playButtonPop(soundEnabled);
    const curr = parseInt(ageInput, 10) || 5;
    const nextAge = Math.min(14, Math.max(2, curr + delta));
    setAgeInput(nextAge);
    if (!quickAges.includes(nextAge)) {
      setIsCustomAge(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedName = nameInput.trim();
    if (!trimmedName) {
      setError('Please type your name or nickname! 😊');
      return;
    }

    const numAge = parseInt(ageInput, 10);
    if (!numAge || numAge < 2 || numAge > 14) {
      setError('Please enter a valid age between 2 and 14 years old! 🎂');
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
        <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-3xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center shadow-xl mb-3 sm:mb-4 animate-bounce">
          <Rocket className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-white mb-1.5 tracking-wide flex items-center justify-center gap-2">
          <span>Welcome, Explorer!</span>
          <Sparkles className="w-6 h-6 text-amber-300" />
        </h2>

        <p className="text-xs sm:text-sm font-semibold text-slate-300 mb-4 leading-relaxed">
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
                className="w-full bg-[#090B24] border-2 border-[#2C3380] focus:border-pink-400 text-white text-base sm:text-lg font-extrabold rounded-2xl pl-11 pr-4 py-2.5 sm:py-3 placeholder:text-slate-500 focus:outline-none shadow-inner transition-all"
              />
            </div>
          </div>

          {/* Age Selection Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>How old are you?</span>
              </label>
              <span className="text-xs font-black text-pink-400 bg-pink-500/10 px-2.5 py-0.5 rounded-full border border-pink-500/20">
                🎂 {ageInput} Years Old
              </span>
            </div>

            {/* Quick Age Buttons + Custom Toggle */}
            <div className="grid grid-cols-7 gap-1 sm:gap-1.5 mb-2">
              {quickAges.map((age) => (
                <button
                  type="button"
                  key={age}
                  onClick={() => handleQuickAgeSelect(age)}
                  className={`py-2 rounded-xl font-black text-xs sm:text-sm transition-all border ${
                    !isCustomAge && Number(ageInput) === age
                      ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white border-white ring-2 ring-pink-400/50 scale-105 shadow-md'
                      : 'bg-[#090B24] text-slate-300 border-[#2C3380] hover:bg-[#1E2568] hover:text-white'
                  }`}
                >
                  {age}
                </button>
              ))}

              {/* Custom Age Button */}
              <button
                type="button"
                onClick={handleCustomToggle}
                className={`py-2 rounded-xl font-black text-xs transition-all border flex items-center justify-center ${
                  isCustomAge
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-white ring-2 ring-cyan-400/50 scale-105 shadow-md'
                    : 'bg-[#090B24] text-cyan-300 border-[#2C3380] hover:bg-[#1E2568]'
                }`}
                title="Type a custom age"
              >
                <span>Edit ✍️</span>
              </button>
            </div>

            {/* Custom Age Stepper & Direct Input */}
            {isCustomAge && (
              <div className="flex items-center gap-2 bg-[#090B24] border-2 border-cyan-500/50 rounded-2xl p-2 animate-in fade-in slide-in-from-top-1 duration-200">
                <button
                  type="button"
                  onClick={() => handleIncrementAge(-1)}
                  className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-white flex items-center justify-center font-bold text-lg transition-all"
                >
                  <Minus className="w-4 h-4" />
                </button>

                <div className="flex-1 text-center">
                  <input
                    type="number"
                    min={2}
                    max={14}
                    value={ageInput}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      setAgeInput(isNaN(val) ? '' : val);
                      if (error) setError('');
                    }}
                    placeholder="Age"
                    className="w-full bg-transparent text-center text-xl font-black text-cyan-300 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-400 block -mt-1 font-semibold">
                    (2 to 14 years old)
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleIncrementAge(1)}
                  className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-white flex items-center justify-center font-bold text-lg transition-all"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {error && (
            <p className="text-xs font-bold text-rose-400 text-center animate-shake">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-[#FF5B84] to-[#FF435A] hover:from-[#FF435A] hover:to-[#E11D48] text-white font-black text-base sm:text-lg tracking-wider uppercase shadow-[0_10px_25px_rgba(255,91,132,0.5)] transform hover:scale-[1.02] active:scale-95 transition-all mt-1 sm:mt-2 cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Let's Play! 🚀</span>
          </button>
        </form>
      </div>
    </div>
  );
}
