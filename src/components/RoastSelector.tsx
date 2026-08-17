import React from 'react';
import type { RoastLevel } from '../types/roast';
import { PixelFlame } from './PixelFlame';

interface RoastSelectorProps {
  selectedLevel: RoastLevel;
  onSelectLevel: (level: RoastLevel) => void;
  disabled?: boolean;
}

export const RoastSelector: React.FC<RoastSelectorProps> = ({
  selectedLevel,
  onSelectLevel,
  disabled = false,
}) => {
  const levels: {
    id: RoastLevel;
    emoji: string;
    title: string;
    selectedStyle: string;
    hasFlame?: boolean;
  }[] = [
    {
      id: 'gentle',
      emoji: '🌶️',
      title: 'GENTLE',
      selectedStyle: 'bg-yellow-400 text-black border-yellow-300 shadow-pixel-yellow',
    },
    {
      id: 'savage',
      emoji: '',
      title: 'SAVAGE',
      selectedStyle: 'bg-orange-500 text-black border-orange-400 shadow-pixel-orange',
      hasFlame: true,
    },
    {
      id: 'nuclear',
      emoji: '💀',
      title: 'NUCLEAR',
      selectedStyle: 'bg-pink-600 text-white border-pink-400 shadow-pixel-pink',
    },
  ];

  return (
    <div className="w-full my-4 sm:my-6">
      <div className="flex items-center gap-2 mb-2.5 sm:mb-3">
        <PixelFlame className="w-4 h-4" size={18} />
        <label className="text-[10px] sm:text-xs font-pixel uppercase tracking-wider text-cyan-400">
          SELECT ROAST LEVEL:
        </label>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {levels.map((lvl) => {
          const isSelected = selectedLevel === lvl.id;
          return (
            <button
              key={lvl.id}
              type="button"
              disabled={disabled}
              onClick={() => onSelectLevel(lvl.id)}
              className={`py-2.5 sm:py-3 px-1 sm:px-2 border-2 sm:border-3 border-black font-pixel text-[9px] sm:text-xs flex items-center justify-center gap-1 sm:gap-2 transition-all active:translate-y-0.5 ${
                isSelected
                  ? `${lvl.selectedStyle} scale-[1.02]`
                  : 'bg-[#14142b] text-slate-300 hover:text-white hover:border-cyan-400 shadow-pixel'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {lvl.hasFlame ? <PixelFlame className="w-3.5 h-3.5 sm:w-4 sm:h-4" size={16} /> : <span>{lvl.emoji}</span>}
              <span className="truncate">{lvl.title}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
