import React from 'react';

/**
 * Renders custom SVG graphical puzzles and their solution overlays.
 * Supports both static presets and dynamic procedural puzzle data.
 */
export default function VisualDiagram({ type, data = {}, isSolution = false }) {
  switch (type) {
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
        <div className="flex flex-col items-center justify-center p-3">
          <svg viewBox="0 0 240 240" className="w-48 h-48 sm:w-56 sm:h-56">
            {/* Outer grid boundary */}
            <rect x={startX} y={startY} width={size} height={size} fill="#F8FAFC" stroke="#94A3B8" strokeWidth="2" rx="4" />

            {/* Vertical grid lines */}
            {Array.from({ length: cols + 1 }).map((_, i) => (
              <line
                key={`v-${i}`}
                x1={startX + i * cellW}
                y1={startY}
                x2={startX + i * cellW}
                y2={startY + size}
                stroke="#CBD5E1"
                strokeWidth="1.5"
              />
            ))}

            {/* Horizontal grid lines */}
            {Array.from({ length: rows + 1 }).map((_, i) => (
              <line
                key={`h-${i}`}
                x1={startX}
                y1={startY + i * cellH}
                x2={startX + size}
                y2={startY + i * cellH}
                stroke="#CBD5E1"
                strokeWidth="1.5"
              />
            ))}

            {/* Clean white mask for the empty hole */}
            <rect
              x={holeX}
              y={holeY}
              width={holeWidth}
              height={holeHeight}
              fill="#FFFFFF"
            />

            {/* If solution mode, show red frame, inner lines, and tile numbers */}
            {isSolution ? (
              <g>
                {/* Red boxed area */}
                <rect
                  x={holeX}
                  y={holeY}
                  width={holeWidth}
                  height={holeHeight}
                  fill="#FFE4E6"
                  stroke="#EF4444"
                  strokeWidth="3"
                  rx="2"
                />

                {/* Subdivided red inner grid lines */}
                {Array.from({ length: holeW - 1 }).map((_, i) => (
                  <line
                    key={`sol-v-${i}`}
                    x1={holeX + (i + 1) * cellW}
                    y1={holeY}
                    x2={holeX + (i + 1) * cellW}
                    y2={holeY + holeHeight}
                    stroke="#EF4444"
                    strokeWidth="2"
                  />
                ))}

                {Array.from({ length: holeH - 1 }).map((_, i) => (
                  <line
                    key={`sol-h-${i}`}
                    x1={holeX}
                    y1={holeY + (i + 1) * cellH}
                    x2={holeX + holeWidth}
                    y2={holeY + (i + 1) * cellH}
                    stroke="#EF4444"
                    strokeWidth="2"
                  />
                ))}

                {/* Numbered tiles */}
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
                      fill="#DC2626"
                      fontSize={holeW > 3 ? '16' : '20'}
                      fontWeight="bold"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontFamily="Nunito, sans-serif"
                    >
                      {i + 1}
                    </text>
                  );
                })}
              </g>
            ) : null}
          </svg>
        </div>
      );
    }

    case 'paper-cut': {
      const corners = data.corners || 4;
      return (
        <div className="flex flex-col items-center justify-center p-3">
          <svg viewBox="0 0 280 180" className="w-56 h-36 sm:w-64 sm:h-40">
            {/* Base paper outline */}
            <path
              d="M 40 140 L 40 60 L 240 60 L 240 140"
              fill="none"
              stroke="#0F172A"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Vertical dashed cut line */}
            <line
              x1="90"
              y1="25"
              x2="90"
              y2="155"
              stroke="#0F172A"
              strokeWidth="5"
              strokeDasharray="8 8"
              strokeLinecap="round"
            />

            {/* If solution mode, show the resulting right piece with labeled corners */}
            {isSolution && (
              <g>
                <rect x="90" y="60" width="150" height="80" fill="#EFF6FF" stroke="#3B82F6" strokeWidth="2" strokeDasharray="4 4" opacity="0.3" />
                <circle cx="90" cy="60" r="10" fill="#EF4444" />
                <text x="90" y="64" fill="#FFFFFF" fontSize="12" fontWeight="bold" textAnchor="middle" dominantBaseline="middle">1</text>

                <circle cx="90" cy="140" r="10" fill="#EF4444" />
                <text x="90" y="144" fill="#FFFFFF" fontSize="12" fontWeight="bold" textAnchor="middle" dominantBaseline="middle">2</text>

                <circle cx="240" cy="60" r="10" fill="#EF4444" />
                <text x="240" y="64" fill="#FFFFFF" fontSize="12" fontWeight="bold" textAnchor="middle" dominantBaseline="middle">3</text>

                <circle cx="240" cy="140" r="10" fill="#EF4444" />
                <text x="240" y="144" fill="#FFFFFF" fontSize="12" fontWeight="bold" textAnchor="middle" dominantBaseline="middle">4</text>
              </g>
            )}
          </svg>
        </div>
      );
    }

    case 'pattern-shapes': {
      const items = data.sequence || ['●', '▲', '■', '●', '▲'];
      const nextItem = data.nextItem || '■';

      return (
        <div className="flex items-center justify-center flex-wrap gap-2.5 sm:gap-3.5 p-4 bg-purple-50 rounded-2xl border-2 border-purple-100 my-2">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-indigo-600 text-white font-bold text-2xl flex items-center justify-center shadow-md transform hover:scale-105 transition-transform"
            >
              {item}
            </div>
          ))}
          {/* Question placeholder */}
          <div
            className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center font-bold text-2xl shadow-inner transition-all ${
              isSolution
                ? 'bg-rose-500 text-white animate-bounce'
                : 'bg-white border-2 border-dashed border-purple-400 text-purple-600'
            }`}
          >
            {isSolution ? nextItem : '?'}
          </div>
        </div>
      );
    }

    case 'apple-counting': {
      const count = data.count || 7;
      const emoji = data.emoji || '🍎';
      return (
        <div className="flex flex-col items-center justify-center p-2">
          <div className="bg-emerald-50 border-2 border-emerald-200 rounded-3xl p-4 sm:p-5 flex flex-wrap items-center justify-center gap-3 max-w-sm shadow-inner">
            {Array.from({ length: count }).map((_, idx) => (
              <div
                key={idx}
                className="relative flex items-center justify-center w-11 h-11 bg-white rounded-2xl shadow-sm border border-emerald-100 transform hover:scale-110 transition-transform"
              >
                <span className="text-2xl">{emoji}</span>
                {isSolution && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow">
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
      const heavySide = data.heavySide || 'right'; // 'left' | 'right'

      const isRightHeavy = heavySide === 'right';

      return (
        <div className="flex flex-col items-center justify-center p-3">
          <svg viewBox="0 0 260 160" className="w-56 h-36">
            {/* Fulcrum / Triangle base */}
            <polygon points="130,110 110,150 150,150" fill="#64748B" />

            {/* Tilted Lever */}
            <line
              x1="30"
              y1={isRightHeavy ? 85 : 125}
              x2="230"
              y2={isRightHeavy ? 125 : 85}
              stroke="#334155"
              strokeWidth="6"
              strokeLinecap="round"
            />

            {/* Left Pan */}
            <line
              x1="45"
              y1={isRightHeavy ? 88 : 128}
              x2="45"
              y2={isRightHeavy ? 110 : 145}
              stroke="#94A3B8"
              strokeWidth="2"
            />
            <path
              d={isRightHeavy ? 'M 25 110 Q 45 120 65 110' : 'M 25 145 Q 45 155 65 145'}
              fill="none"
              stroke="#64748B"
              strokeWidth="3"
            />
            <text x="45" y={isRightHeavy ? 100 : 135} fontSize="24" textAnchor="middle">
              {leftItem}
            </text>

            {/* Right Pan */}
            <line
              x1="215"
              y1={isRightHeavy ? 122 : 88}
              x2="215"
              y2={isRightHeavy ? 145 : 110}
              stroke="#94A3B8"
              strokeWidth="2"
            />
            <path
              d={isRightHeavy ? 'M 195 145 Q 215 155 235 145' : 'M 195 110 Q 215 120 235 110'}
              fill="none"
              stroke="#64748B"
              strokeWidth="3"
            />
            <text x="215" y={isRightHeavy ? 135 : 100} fontSize="24" textAnchor="middle">
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
      const total = bottom + middle + top;

      return (
        <div className="flex flex-col items-center justify-center p-3">
          <svg viewBox="0 0 200 160" className="w-48 h-40">
            {/* Layer 1 (Bottom) */}
            {Array.from({ length: bottom }).map((_, i) => {
              const x = 100 - (bottom * 40) / 2 + i * 40 + 2.5;
              return (
                <rect
                  key={`b-${i}`}
                  x={x}
                  y="110"
                  width="35"
                  height="35"
                  fill="#3B82F6"
                  stroke="#1D4ED8"
                  strokeWidth="2"
                  rx="4"
                />
              );
            })}

            {/* Layer 2 (Middle) */}
            {Array.from({ length: middle }).map((_, i) => {
              const x = 100 - (middle * 40) / 2 + i * 40 + 2.5;
              return (
                <rect
                  key={`m-${i}`}
                  x={x}
                  y="70"
                  width="35"
                  height="35"
                  fill="#F59E0B"
                  stroke="#B45309"
                  strokeWidth="2"
                  rx="4"
                />
              );
            })}

            {/* Layer 3 (Top) */}
            {Array.from({ length: top }).map((_, i) => {
              const x = 100 - (top * 40) / 2 + i * 40 + 2.5;
              return (
                <rect
                  key={`t-${i}`}
                  x={x}
                  y="30"
                  width="35"
                  height="35"
                  fill="#EC4899"
                  stroke="#BE185D"
                  strokeWidth="2"
                  rx="4"
                />
              );
            })}

            {isSolution && (
              <g fill="#FFFFFF" fontWeight="bold" fontSize="16" textAnchor="middle">
                {Array.from({ length: bottom }).map((_, i) => (
                  <text key={`bn-${i}`} x={100 - (bottom * 40) / 2 + i * 40 + 20} y="133">
                    {i + 1}
                  </text>
                ))}
                {Array.from({ length: middle }).map((_, i) => (
                  <text key={`mn-${i}`} x={100 - (middle * 40) / 2 + i * 40 + 20} y="93">
                    {bottom + i + 1}
                  </text>
                ))}
                {Array.from({ length: top }).map((_, i) => (
                  <text key={`tn-${i}`} x={100 - (top * 40) / 2 + i * 40 + 20} y="53">
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
        <div className="flex flex-col items-center justify-center p-3">
          <svg viewBox="0 0 200 160" className="w-52 h-40">
            <line x1="100" y1="20" x2="100" y2="140" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="4 4" />
            <ellipse cx="100" cy="80" rx="6" ry="30" fill="#475569" />
            <path d="M 96 60 C 50 10 20 40 50 80 C 20 110 50 140 96 100 Z" fill="#8B5CF6" stroke="#6D28D9" strokeWidth="2" />
            <circle cx="60" cy="60" r="8" fill="#FDE047" />
            <circle cx="65" cy="100" r="6" fill="#F43F5E" />

            {isSolution ? (
              <g>
                <path d="M 104 60 C 150 10 180 40 150 80 C 180 110 150 140 104 100 Z" fill="#8B5CF6" stroke="#6D28D9" strokeWidth="2" />
                <circle cx="140" cy="60" r="8" fill="#FDE047" />
                <circle cx="135" cy="100" r="6" fill="#F43F5E" />
              </g>
            ) : (
              <path d="M 104 60 C 150 10 180 40 150 80 C 180 110 150 140 104 100 Z" fill="none" stroke="#94A3B8" strokeWidth="2" strokeDasharray="4 4" />
            )}
          </svg>
        </div>
      );
    }

    case 'rocket-maze': {
      return (
        <div className="flex flex-col items-center justify-center p-2">
          <svg viewBox="0 0 240 160" className="w-56 h-36">
            <text x="20" y="85" fontSize="28">🚀</text>

            <path d="M 50 60 Q 100 20 140 60 T 200 40" fill="none" stroke={isSolution ? '#EF4444' : '#94A3B8'} strokeWidth={isSolution ? '4' : '2'} />
            <text x="120" y="30" fill="#6B7280" fontSize="11" fontWeight="bold">Path A 🪐</text>

            <path d="M 50 80 C 90 80 110 120 150 100 S 190 70 200 80" fill="none" stroke={isSolution ? '#10B981' : '#3B82F6'} strokeWidth={isSolution ? '5' : '3'} strokeDasharray={isSolution ? 'none' : '4 2'} />
            <text x="120" y="85" fill="#2563EB" fontSize="11" fontWeight="bold">Path B ⭐ (Target)</text>

            <path d="M 50 100 Q 90 140 140 120 T 200 130" fill="none" stroke={isSolution ? '#9CA3AF' : '#94A3B8'} strokeWidth="2" />
            <text x="120" y="140" fill="#6B7280" fontSize="11" fontWeight="bold">Path C 🛸</text>

            <text x="210" y="85" fontSize="28">⭐</text>
          </svg>
        </div>
      );
    }

    case 'color-mix': {
      const c1 = data.color1 || 'Blue 🔵';
      const c2 = data.color2 || 'Yellow 🟡';
      const result = data.result || 'Green 🟢';
      return (
        <div className="flex items-center justify-center gap-3 p-4 bg-slate-50 rounded-2xl border-2 border-slate-200 my-2">
          <div className="px-3 py-2 rounded-xl bg-blue-100 text-blue-800 font-extrabold text-sm">{c1}</div>
          <span className="text-xl font-black text-slate-400">+</span>
          <div className="px-3 py-2 rounded-xl bg-yellow-100 text-yellow-800 font-extrabold text-sm">{c2}</div>
          <span className="text-xl font-black text-slate-400">=</span>
          <div className={`px-4 py-2 rounded-xl font-black text-sm shadow ${isSolution ? 'bg-emerald-500 text-white animate-bounce' : 'bg-white border-2 border-dashed border-slate-400 text-slate-500'}`}>
            {isSolution ? result : '?'}
          </div>
        </div>
      );
    }

    default:
      return null;
  }
}
