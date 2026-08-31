import React, { useState, useEffect } from 'react';
import { Info, Sparkles, Key, Check, Edit2, User } from 'lucide-react';
import { playButtonPop } from '../utils/audioSynthesis';
import { calculateSkillLevel } from '../utils/progressTracker';
import { getStoredApiKey } from '../services/aiGenerator';
import AISetupModal from './AISetupModal';

export default function SkillSelectionDashboard({
  profileStats,
  onSelectSkill,
  soundEnabled,
  kidName,
  kidAge = 5,
  onEditKidName
}) {
  const [infoModalTopic, setInfoModalTopic] = useState(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);

  useEffect(() => {
    const key = getStoredApiKey();
    setHasApiKey(Boolean(key));
  }, []);

  const handleKeySaved = (key) => {
    setHasApiKey(Boolean(key));
  };

  const visualLevel = calculateSkillLevel(
    profileStats.visualSolved || 0,
    profileStats.visualScores || []
  );

  const analyticalLevel = calculateSkillLevel(
    profileStats.analyticalSolved || 0,
    profileStats.analyticalScores || []
  );

  const handleCardClick = (skill) => {
    playButtonPop(soundEnabled);
    onSelectSkill(skill);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#5646B6] via-[#483B9D] to-[#392E83] text-white flex flex-col justify-between p-4 sm:p-6 select-none relative overflow-x-hidden font-sans">
      {/* Top Bar: Left Kid Name Badge + Center Green "Thinksheet" Badge + Right AI Settings Button */}
      <header className="w-full max-w-5xl mx-auto flex items-center justify-between pt-2 pb-4 relative">
        {/* Kid Name & Age Personalization Badge */}
        <button
          onClick={() => {
            playButtonPop(soundEnabled);
            onEditKidName();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-pink-200 transition-all cursor-pointer shadow-md transform hover:scale-105"
          title="Click to edit profile (Name & Age)"
        >
          <span>👋 {kidName || 'Explorer'} (Age {kidAge || 5})</span>
          <Edit2 className="w-3 h-3 text-pink-300 opacity-80" />
        </button>

        {/* Green Center Pill Badge */}
        <div className="relative flex items-center justify-center">
          <div className="bg-[#22C55E] text-white px-8 py-2.5 rounded-2xl shadow-xl border-2 border-[#16A34A] flex items-center justify-center">
            <h1 className="text-xl sm:text-2xl font-black tracking-wide drop-shadow-md">
              Thinksheet
            </h1>
          </div>
          {/* Decorative side ribbon tabs */}
          <div className="absolute -left-2 top-2.5 w-3 h-5 bg-white rounded-l-md opacity-90 shadow-sm" />
          <div className="absolute -right-2 top-2.5 w-3 h-5 bg-white rounded-r-md opacity-90 shadow-sm" />
        </div>

        {/* AI Generator Settings Button */}
        <button
          onClick={() => {
            playButtonPop(soundEnabled);
            setIsAiModalOpen(true);
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg transition-all border ${
            hasApiKey
              ? 'bg-amber-400/20 text-amber-300 border-amber-400/40 hover:bg-amber-400/30'
              : 'bg-white/10 text-white/80 border-white/20 hover:bg-white/20'
          }`}
          title="AI Generation Settings"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin-slow" />
          <span className="hidden sm:inline">AI Setup</span>
        </button>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-5xl mx-auto flex flex-col items-center flex-1 justify-center py-6">
        {/* AI Active Indicator */}
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/15 px-4 py-1.5 rounded-full text-xs font-bold text-cyan-200 mb-4 shadow-sm">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>AI-Powered Dynamic Question Engine Active</span>
        </div>

        {/* Call to Action Heading */}
        <h2 className="text-xl sm:text-2xl font-extrabold text-white text-center mb-8 tracking-wide drop-shadow">
          Select a skill and solve thinksheets
        </h2>

        {/* Two Interactive Skill Cards */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Skill Card 1: VISUAL */}
          <div
            onClick={() => handleCardClick('Visual')}
            className="group bg-white text-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl border-4 border-cyan-400 hover:border-cyan-300 cursor-pointer transform hover:-translate-y-1.5 active:translate-y-0 transition-all duration-200 flex flex-col justify-between min-h-[240px]"
          >
            <div>
              {/* Header Row: Icon, Title & Solved / Open count */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3.5">
                  {/* Colorful Bar Chart Icon */}
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-end justify-center p-2 gap-1 shadow-inner">
                    <div className="w-2 h-4 bg-amber-400 rounded-t-sm" />
                    <div className="w-2 h-7 bg-cyan-400 rounded-t-sm" />
                    <div className="w-2 h-5 bg-blue-500 rounded-t-sm" />
                    <div className="w-2 h-9 bg-rose-500 rounded-t-sm" />
                  </div>

                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                      Visual
                    </h3>
                    <div className="flex items-center gap-4 text-xs font-bold text-slate-500 mt-0.5">
                      <span>Solved:{profileStats.visualSolved || 0}</span>
                      <span>Open:0</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setInfoModalTopic('Visual');
                  }}
                  className="text-slate-400 hover:text-indigo-600 p-1"
                  title="Skill Information"
                >
                  <Info className="w-5 h-5" />
                </button>
              </div>

              {/* Level Badge */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-black tracking-wider uppercase text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                  LEVEL {visualLevel.levelNumber}
                </span>
                <span className="text-xs font-bold text-slate-700">
                  {visualLevel.levelTitle}
                </span>
              </div>

              {/* Pink Striped Progress Bar Track */}
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5 border border-slate-200 relative mb-2">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-pink-500 via-rose-400 to-pink-500 shadow-sm transition-all duration-700"
                  style={{
                    width: `${visualLevel.progressPercent}%`,
                    backgroundImage:
                      'repeating-linear-gradient(45deg, rgba(255,255,255,0.25) 0, rgba(255,255,255,0.25) 6px, transparent 6px, transparent 12px)'
                  }}
                />
              </div>

              {/* Level Markers (LV1 - LV5) */}
              <div className="flex justify-between items-center text-[10px] font-extrabold text-slate-400 px-1">
                {[
                  { lvl: 'LV1', color: '#EAB308' },
                  { lvl: 'LV2', color: '#22C55E' },
                  { lvl: 'LV3', color: '#EC4899' },
                  { lvl: 'LV4', color: '#8B5CF6' },
                  { lvl: 'LV5', color: '#06B6D4' }
                ].map((item) => (
                  <div key={item.lvl} className="flex flex-col items-center">
                    <div
                      className="w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-b-[4px] mb-0.5"
                      style={{ borderBottomColor: item.color }}
                    />
                    <span>{item.lvl}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tap to Start Action Pill */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-cyan-600 font-extrabold text-xs">
              <span>🎯 10 AI Visual Puzzles</span>
              <span className="group-hover:translate-x-1 transition-transform">
                Start Sheet →
              </span>
            </div>
          </div>

          {/* Skill Card 2: ANALYTICAL THINKING */}
          <div
            onClick={() => handleCardClick('Analytical Thinking')}
            className="group bg-white text-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl border-4 border-cyan-400 hover:border-cyan-300 cursor-pointer transform hover:-translate-y-1.5 active:translate-y-0 transition-all duration-200 flex flex-col justify-between min-h-[240px]"
          >
            <div>
              {/* Header Row: Icon, Title & Solved / Open count */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3.5">
                  {/* Clipboard / Checklist Icon */}
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center p-2 shadow-inner">
                    <div className="w-8 h-10 border-2 border-slate-400 rounded bg-white relative flex flex-col items-center justify-center pt-2">
                      <div className="absolute -top-1.5 w-4 h-2 bg-amber-500 rounded-sm" />
                      <div className="w-4 h-0.5 bg-slate-300 mb-1" />
                      <div className="text-emerald-600 font-bold text-xs leading-none">
                        ✓
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                      Analytical Thinking
                    </h3>
                    <div className="flex items-center gap-4 text-xs font-bold text-slate-500 mt-0.5">
                      <span>Solved:{profileStats.analyticalSolved || 0}</span>
                      <span>Open:0</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setInfoModalTopic('Analytical Thinking');
                  }}
                  className="text-slate-400 hover:text-indigo-600 p-1"
                  title="Skill Information"
                >
                  <Info className="w-5 h-5" />
                </button>
              </div>

              {/* Level Badge */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-black tracking-wider uppercase text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                  LEVEL {analyticalLevel.levelNumber}
                </span>
                <span className="text-xs font-bold text-slate-700">
                  {analyticalLevel.levelTitle}
                </span>
              </div>

              {/* Pink Striped Progress Bar Track */}
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5 border border-slate-200 relative mb-2">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-pink-500 via-rose-400 to-pink-500 shadow-sm transition-all duration-700"
                  style={{
                    width: `${analyticalLevel.progressPercent}%`,
                    backgroundImage:
                      'repeating-linear-gradient(45deg, rgba(255,255,255,0.25) 0, rgba(255,255,255,0.25) 6px, transparent 6px, transparent 12px)'
                  }}
                />
              </div>

              {/* Level Markers (LV1 - LV5) */}
              <div className="flex justify-between items-center text-[10px] font-extrabold text-slate-400 px-1">
                {[
                  { lvl: 'LV1', color: '#EAB308' },
                  { lvl: 'LV2', color: '#22C55E' },
                  { lvl: 'LV3', color: '#EC4899' },
                  { lvl: 'LV4', color: '#8B5CF6' },
                  { lvl: 'LV5', color: '#06B6D4' }
                ].map((item) => (
                  <div key={item.lvl} className="flex flex-col items-center">
                    <div
                      className="w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-b-[4px] mb-0.5"
                      style={{ borderBottomColor: item.color }}
                    />
                    <span>{item.lvl}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tap to Start Action Pill */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-purple-600 font-extrabold text-xs">
              <span>🧠 10 AI Reasoning Puzzles</span>
              <span className="group-hover:translate-x-1 transition-transform">
                Start Sheet →
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* AI Key & Settings Modal */}
      <AISetupModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onKeySaved={handleKeySaved}
        soundEnabled={soundEnabled}
      />

      {/* Skill Info Modal */}
      {infoModalTopic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#141846] border-2 border-[#2C3480] text-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
            <h3 className="text-lg sm:text-xl font-black text-white mb-2 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>{infoModalTopic} Skill Info</span>
            </h3>

            <p className="text-sm font-semibold text-slate-300 leading-relaxed my-3">
              {infoModalTopic === 'Visual' &&
                'Develop your ability to analyze and/or spot visual information in order to solve a problem.'}
              {infoModalTopic === 'Analytical Thinking' &&
                'Develop your ability to plan and breakdown information in order to analyze and solve complex problems.'}
            </p>

            <button
              onClick={() => setInfoModalTopic(null)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-extrabold text-sm shadow-lg mt-2"
            >
              Got It! 👍
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
