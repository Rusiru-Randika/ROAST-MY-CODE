import React from 'react';
import { PixelFlame } from './PixelFlame';
import { GithubIcon } from './GithubIcon';

interface HeaderProps {
  onNavigate: (sectionId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  return (
    <header className="sticky top-0 z-40 bg-[#14142b]/95 backdrop-blur-md border-b-4 border-black shadow-pixel-cyan">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        
        <div 
          onClick={() => onNavigate('editor')} 
          className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group"
        >
          <div className="w-9 h-9 sm:w-12 sm:h-12 bg-[#1c1c3a] border-2 sm:border-3 border-black shadow-pixel-sm flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
            <PixelFlame className="w-6 h-6 sm:w-8 sm:h-8" size={24} />
          </div>
          <div>
            <div className="flex items-center">
              <span className="font-pixel text-xs sm:text-base text-white tracking-wider group-hover:text-cyan-400 transition-colors text-pixel-cyan">
                ROAST MY CODE
              </span>
            </div>
            <span className="hidden sm:block font-pixel text-[9px] text-pink-400 uppercase tracking-widest mt-0.5">
              [AI CODE REVIEW ENGINE]
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1.5 sm:px-3 sm:py-2 bg-[#1c1c3a] hover:bg-pink-600 text-white font-pixel text-[9px] sm:text-[10px] border-2 sm:border-3 border-black shadow-pixel-sm hover:shadow-pixel-pink transition-all flex items-center gap-1.5"
            title="View Source Code"
          >
            <GithubIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>GITHUB</span>
          </a>
        </div>

      </div>
    </header>
  );
};
