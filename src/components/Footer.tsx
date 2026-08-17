import React from 'react';
import { PixelFlame } from './PixelFlame';
import { GithubIcon } from './GithubIcon';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t-4 border-black bg-[#14142b] py-8 sm:py-12 text-slate-400 font-pixel text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6">
        
        {/* Left branding */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-[#1c1c3a] border-2 border-black flex items-center justify-center shadow-pixel-sm shrink-0">
            <PixelFlame className="w-5 h-5 sm:w-6 sm:h-6" size={22} />
          </div>
          <div>
            <div className="font-pixel text-xs sm:text-sm text-white flex items-center">
              <span>ROAST MY CODE</span>
            </div>
            <p className="text-[9px] sm:text-[10px] text-slate-500 font-mono mt-0.5">
              "YOUR CODE HAS BUGS. WE HAVE JOKES."
            </p>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="text-[9px] sm:text-[10px] text-center text-slate-400 max-w-md font-mono flex items-center justify-center gap-1.5 flex-wrap">
          <span>MADE FOR DEVELOPERS WITH</span>
          <PixelFlame className="w-3.5 h-3.5" size={14} />
          <span>. PASTE CODE. GET ROASTED. FIX BUGS.</span>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-4 text-[9px] sm:text-[10px]">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-cyan-400 transition-colors flex items-center gap-1.5 text-slate-300"
          >
            <GithubIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>GITHUB REPOSITORY</span>
          </a>
        </div>

      </div>
    </footer>
  );
};
