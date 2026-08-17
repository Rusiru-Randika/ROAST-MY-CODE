import React from 'react';
import { PixelFlame } from './PixelFlame';

interface RoastButtonProps {
  onRoast: () => void;
  isLoading: boolean;
  disabled?: boolean;
}

export const RoastButton: React.FC<RoastButtonProps> = ({
  onRoast,
  isLoading,
  disabled = false,
}) => {
  return (
    <div className="w-full flex flex-col items-center my-6">
      <button
        onClick={onRoast}
        disabled={isLoading || disabled}
        className={`w-full max-w-xs py-3.5 px-6 font-pixel text-sm tracking-wider uppercase border-3 border-black transition-all duration-150 transform flex items-center justify-center gap-2.5 relative overflow-hidden ${
          isLoading || disabled
            ? 'bg-slate-800 text-slate-500 cursor-not-allowed shadow-none border-slate-700'
            : 'bg-gradient-to-r from-pink-600 via-orange-500 to-yellow-400 text-black shadow-pixel-orange hover:shadow-pixel-pink hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer'
        }`}
      >
        <PixelFlame className="w-5 h-5" size={20} />
        <span>{isLoading ? 'ROASTING...' : 'ROAST'}</span>
      </button>
    </div>
  );
};
