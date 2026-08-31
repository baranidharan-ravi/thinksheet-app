import React, { useState, useEffect } from 'react';
import { Sparkles, Check, Key, ExternalLink, X } from 'lucide-react';
import { playButtonPop } from '../utils/audioSynthesis';
import { getStoredApiKey, setStoredApiKey } from '../services/aiGenerator';

export default function AISetupModal({
  isOpen,
  onClose,
  onKeySaved,
  soundEnabled = true
}) {
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [hasExistingKey, setHasExistingKey] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const key = getStoredApiKey();
      setApiKeyInput(key);
      setHasExistingKey(Boolean(key));
      setSavedSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    playButtonPop(soundEnabled);
    const cleaned = apiKeyInput.trim();
    setStoredApiKey(cleaned);
    setHasExistingKey(Boolean(cleaned));
    setSavedSuccess(true);

    if (onKeySaved) {
      onKeySaved(cleaned);
    }

    setTimeout(() => {
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div className="bg-gradient-to-b from-[#1C1F5E] via-[#141846] to-[#0D1030] border-4 border-amber-400/80 text-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-[0_0_50px_rgba(245,158,11,0.3)] relative overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-300 animate-spin-slow" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-white">
                Google Gemini AI Setup
              </h3>
              <p className="text-xs text-amber-300 font-semibold">
                Required for real-time 100% AI question generation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs sm:text-sm font-semibold text-slate-300 leading-relaxed mb-4">
          All questions and visual challenges are generated live using Google Gemini AI. Please paste your API key below:
        </p>

        {/* API Key Input */}
        <div className="mb-4">
          <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Key className="w-3.5 h-3.5 text-amber-400" />
            <span>Google Gemini API Key:</span>
          </label>
          <input
            type="password"
            autoFocus
            value={apiKeyInput}
            onChange={(e) => setApiKeyInput(e.target.value)}
            placeholder="AIzaSy..."
            className="w-full bg-[#090B24] border-2 border-[#2C3380] focus:border-amber-400 rounded-xl px-3.5 py-3 text-sm text-white font-mono placeholder:text-slate-500 focus:outline-none shadow-inner transition-all"
          />
          <div className="flex items-center justify-between mt-2">
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-cyan-300 hover:text-cyan-200 underline flex items-center gap-1"
            >
              <span>Get a free Gemini API key</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            {hasExistingKey && (
              <span className="text-[11px] text-emerald-400 font-bold">
                ✓ Key configured
              </span>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2.5 mt-6">
          <button
            onClick={handleSave}
            className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm sm:text-base shadow-lg flex items-center justify-center gap-1.5 transition-all transform hover:scale-[1.02] active:scale-95"
          >
            {savedSuccess ? (
              <>
                <Check className="w-5 h-5 stroke-[3] text-emerald-950" />
                <span>Saved!</span>
              </>
            ) : (
              <span>Save & Connect 🚀</span>
            )}
          </button>
          <button
            onClick={onClose}
            className="px-5 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
