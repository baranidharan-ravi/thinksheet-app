import React, { useState, useEffect } from 'react';
import {
  Rocket,
  Sparkles,
  Smile,
  Calendar,
  Key,
  Clock,
  Timer,
  Plus,
  Minus,
  ExternalLink,
  X,
  Check
} from 'lucide-react';
import { playButtonPop, speakText } from '../utils/audioSynthesis';
import { getStoredApiKey, setStoredApiKey } from '../services/aiGenerator';
import {
  getStoredTimerConfig,
  saveStoredTimerConfig
} from '../utils/progressTracker';

export default function KidNameModal({
  isOpen,
  onSaveProfile,
  onClose,
  currentName = '',
  currentAge = 5,
  soundEnabled = true
}) {
  const [nameInput, setNameInput] = useState('');
  const [ageInput, setAgeInput] = useState(5);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [isCustomAge, setIsCustomAge] = useState(false);
  const [timerEnabled, setTimerEnabled] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(90);
  const [isCustomTimer, setIsCustomTimer] = useState(false);
  const [error, setError] = useState('');

  const quickAges = [3, 4, 5, 6, 7, 8];

  useEffect(() => {
    if (isOpen) {
      const existingName = currentName || '';
      const existingAge = currentAge || 5;
      const existingKey = getStoredApiKey() || '';
      const existingTimer = getStoredTimerConfig();

      setNameInput(existingName);
      setAgeInput(existingAge);
      setApiKeyInput(existingKey);
      setIsCustomAge(!quickAges.includes(Number(existingAge)));
      setTimerEnabled(Boolean(existingTimer.enabled));
      setTimerSeconds(Number(existingTimer.secondsPerQuestion) || 90);
      setIsCustomTimer(![45, 60, 90, 120, 180].includes(Number(existingTimer.secondsPerQuestion)));
      setError('');
    }
  }, [isOpen, currentName, currentAge]);

  if (!isOpen) return null;

  const canDismiss = Boolean(currentName && getStoredApiKey());

  const handleQuickAgeSelect = (age) => {
    playButtonPop(soundEnabled);
    setAgeInput(age);
    setIsCustomAge(false);
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

  const handleStepTimer = (delta) => {
    playButtonPop(soundEnabled);
    const curr = timerSeconds || 90;
    const nextSec = Math.min(300, Math.max(15, curr + delta));
    setTimerSeconds(nextSec);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedName = nameInput.trim();
    if (!trimmedName) {
      setError('Please enter the child’s name! 😊');
      return;
    }

    const numAge = parseInt(ageInput, 10);
    if (!numAge || numAge < 2 || numAge > 14) {
      setError('Please enter a valid age between 2 and 14 years old! 🎂');
      return;
    }

    const trimmedKey = apiKeyInput.trim();
    if (!trimmedKey) {
      setError('Google Gemini API Key is mandatory for real-time AI questions! 🔑');
      return;
    }

    playButtonPop(soundEnabled);

    // 1. Save API Key
    setStoredApiKey(trimmedKey);

    // 2. Save Timer Config
    const updatedTimerConfig = {
      enabled: timerEnabled,
      secondsPerQuestion: timerSeconds
    };
    saveStoredTimerConfig(updatedTimerConfig);

    // 3. Save Kid Profile
    onSaveProfile({
      name: trimmedName,
      age: numAge,
      apiKey: trimmedKey,
      timerConfig: updatedTimerConfig
    });

    speakText(`Welcome, ${trimmedName}! Let's start learning adventures!`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300 select-none overflow-y-auto">
      <div className="bg-gradient-to-b from-[#1C1F5E] via-[#141846] to-[#0D1030] border-4 border-amber-400/90 rounded-3xl max-w-lg w-full p-5 sm:p-7 shadow-[0_0_60px_rgba(251,191,36,0.35)] text-white relative my-auto max-h-[95vh] overflow-y-auto">
        {/* Decorative Dismiss Button (if already has profile) */}
        {canDismiss && onClose && (
          <button
            type="button"
            onClick={() => {
              playButtonPop(soundEnabled);
              onClose();
            }}
            className="absolute top-4 right-4 p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Modal Header */}
        <div className="text-center mb-5">
          <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-2xl bg-gradient-to-tr from-amber-400 to-pink-500 flex items-center justify-center shadow-xl mb-2.5 animate-bounce-short">
            <Rocket className="w-7 h-7 sm:w-8 sm:h-8 text-slate-950" />
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide flex items-center justify-center gap-2">
            <span>Explorer & AI Setup</span>
            <Sparkles className="w-5 h-5 text-amber-300" />
          </h2>
          <p className="text-xs font-semibold text-slate-300 mt-0.5">
            Configure your child's profile and Gemini AI Key to start learning.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Section 1: Child's Name */}
          <div className="bg-[#090B24]/80 p-3 sm:p-3.5 rounded-2xl border border-[#2C3380]">
            <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Smile className="w-4 h-4 text-pink-400" />
              <span>Child's Name <span className="text-pink-400">*</span></span>
            </label>
            <input
              type="text"
              maxLength={25}
              value={nameInput}
              onChange={(e) => {
                setNameInput(e.target.value);
                if (error) setError('');
              }}
              placeholder="e.g. Leo, Mia, Aaron..."
              className="w-full bg-[#0D1030] border border-[#2C3380] focus:border-pink-400 text-white text-sm sm:text-base font-bold rounded-xl px-3.5 py-2.5 placeholder:text-slate-500 focus:outline-none transition-all"
            />
          </div>

          {/* Section 2: Child's Age */}
          <div className="bg-[#090B24]/80 p-3 sm:p-3.5 rounded-2xl border border-[#2C3380]">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>Child's Age <span className="text-amber-400">*</span></span>
              </label>
              <span className="text-xs font-black text-pink-300 bg-pink-500/20 px-2.5 py-0.5 rounded-full border border-pink-500/30">
                🎂 {ageInput} Years Old
              </span>
            </div>

            {/* Quick Age Buttons */}
            <div className="grid grid-cols-7 gap-1 sm:gap-1.5 mb-2">
              {quickAges.map((age) => (
                <button
                  type="button"
                  key={age}
                  onClick={() => handleQuickAgeSelect(age)}
                  className={`py-1.5 sm:py-2 rounded-xl font-black text-xs transition-all border ${
                    !isCustomAge && Number(ageInput) === age
                      ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white border-white ring-2 ring-pink-400/50 shadow-md'
                      : 'bg-[#0D1030] text-slate-300 border-[#2C3380] hover:bg-[#1E2568]'
                  }`}
                >
                  {age}
                </button>
              ))}

              <button
                type="button"
                onClick={() => {
                  playButtonPop(soundEnabled);
                  setIsCustomAge(true);
                  if (error) setError('');
                }}
                className={`py-1.5 sm:py-2 rounded-xl font-black text-xs transition-all border flex items-center justify-center ${
                  isCustomAge
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-white ring-2 ring-cyan-400/50 shadow-md'
                    : 'bg-[#0D1030] text-cyan-300 border-[#2C3380] hover:bg-[#1E2568]'
                }`}
              >
                <span>Edit ✍️</span>
              </button>
            </div>

            {/* Custom Age Stepper */}
            {isCustomAge && (
              <div className="flex items-center gap-2 bg-[#0D1030] border border-cyan-500/50 rounded-xl p-1.5 animate-in fade-in duration-200">
                <button
                  type="button"
                  onClick={() => handleIncrementAge(-1)}
                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center font-bold text-sm"
                >
                  <Minus className="w-3.5 h-3.5" />
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
                    className="w-full bg-transparent text-center text-base font-black text-cyan-300 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-400 block -mt-1">
                    (Ages 2 to 14)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleIncrementAge(1)}
                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center font-bold text-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Section 3: Google Gemini API Key (MANDATORY) */}
          <div className="bg-[#090B24]/80 p-3 sm:p-3.5 rounded-2xl border-2 border-amber-400/60 shadow-inner">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <Key className="w-4 h-4 text-amber-400" />
                <span>Google Gemini API Key <span className="text-rose-400">* (Mandatory)</span></span>
              </label>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-bold text-cyan-300 hover:text-cyan-200 underline flex items-center gap-1"
              >
                <span>Get Free Key</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <input
              type="password"
              value={apiKeyInput}
              onChange={(e) => {
                setApiKeyInput(e.target.value);
                if (error) setError('');
              }}
              placeholder="Paste your Gemini API key (AIzaSy...)"
              className="w-full bg-[#0D1030] border border-amber-400/50 focus:border-amber-400 text-white font-mono text-xs sm:text-sm rounded-xl px-3.5 py-2.5 placeholder:text-slate-500 focus:outline-none transition-all"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              Required to generate 100% personalized, real-time AI questions.
            </span>
          </div>

          {/* Section 4: Question Timer Challenge (Optional) */}
          <div className="bg-[#090B24]/80 p-3 sm:p-3.5 rounded-2xl border border-[#2C3380]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold text-slate-300">Question Timer Limit</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  playButtonPop(soundEnabled);
                  setTimerEnabled((prev) => !prev);
                }}
                className={`px-3 py-1 rounded-full text-xs font-black transition-all border ${
                  timerEnabled
                    ? 'bg-amber-400 text-slate-950 border-amber-300 shadow'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                }`}
              >
                {timerEnabled ? '⏱️ Timer ON' : 'Timer OFF'}
              </button>
            </div>

            {timerEnabled ? (
              <div className="space-y-2 animate-in fade-in duration-200">
                <div className="flex items-center gap-1 flex-wrap">
                  {[
                    { label: '45s', sec: 45 },
                    { label: '60s', sec: 60 },
                    { label: '90s (Default)', sec: 90 },
                    { label: '2m', sec: 120 },
                    { label: '3m', sec: 180 }
                  ].map((preset) => (
                    <button
                      type="button"
                      key={preset.sec}
                      onClick={() => {
                        playButtonPop(soundEnabled);
                        setTimerSeconds(preset.sec);
                        setIsCustomTimer(false);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                        timerSeconds === preset.sec && !isCustomTimer
                          ? 'bg-amber-400 text-slate-950 font-black shadow'
                          : 'bg-[#0D1030] text-slate-300 border border-[#2C3380] hover:bg-[#1E2568]'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() => {
                      playButtonPop(soundEnabled);
                      setIsCustomTimer((prev) => !prev);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all border ${
                      isCustomTimer
                        ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white border-white font-black'
                        : 'bg-[#0D1030] text-slate-300 border-[#2C3380]'
                    }`}
                  >
                    Custom ✍️
                  </button>
                </div>

                {isCustomTimer && (
                  <div className="flex items-center gap-2 bg-[#0D1030] border border-amber-400/50 rounded-xl p-1.5">
                    <button
                      type="button"
                      onClick={() => handleStepTimer(-15)}
                      className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center font-bold text-xs"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <div className="flex-1 text-center font-mono font-black text-xs text-amber-300">
                      {timerSeconds} seconds per question
                    </div>
                    <button
                      type="button"
                      onClick={() => handleStepTimer(15)}
                      className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center font-bold text-xs"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                )}
                <span className="text-[10px] text-slate-400 block font-semibold">
                  Shows solution for 5 seconds if time expires before auto-advancing.
                </span>
              </div>
            ) : (
              <span className="text-[10px] text-slate-400 block font-semibold">
                Relaxed mode: Unlimited time per question.
              </span>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-rose-500/20 border border-rose-500/40 rounded-xl p-2 text-xs font-bold text-rose-300 text-center animate-shake">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-pink-500 to-purple-600 hover:opacity-95 text-white font-black text-sm sm:text-base tracking-wider uppercase shadow-[0_10px_25px_rgba(245,158,11,0.4)] transform hover:scale-[1.01] active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Launch Thinksheet 🚀</span>
          </button>
        </form>
      </div>
    </div>
  );
}
