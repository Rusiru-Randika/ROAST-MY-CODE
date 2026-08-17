import React, { useState } from 'react';
import { Sparkles, Copy, Check } from 'lucide-react';

interface CodeSuggestionProps {
  betterCode: string;
}

export const CodeSuggestion: React.FC<CodeSuggestionProps> = ({ betterCode }) => {
  const [copied, setCopied] = useState(false);

  if (!betterCode) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(betterCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#14142b] p-4 sm:p-6 border-3 sm:border-4 border-black shadow-pixel-green my-4 sm:my-6">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 mb-3 sm:mb-4">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 shrink-0" />
          <h3 className="text-xs sm:text-sm font-pixel text-white tracking-wider">
            ✨ SUGGESTED REFACTORED CODE
          </h3>
        </div>

        <button
          onClick={handleCopy}
          className="self-end sm:self-auto px-2.5 sm:px-3 py-1 sm:py-1.5 bg-[#1c1c3a] hover:bg-green-600 text-white font-pixel text-[9px] sm:text-[10px] border-2 border-black shadow-pixel-sm transition-all flex items-center gap-1.5 cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-green-300" />
              <span className="text-green-300 font-bold">COPIED!</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400" />
              <span>COPY CODE</span>
            </>
          )}
        </button>
      </div>

      <div className="bg-[#090915] border-2 sm:border-3 border-black font-mono text-xs sm:text-sm overflow-hidden shadow-inner">
        <div className="bg-[#121226] px-3 sm:px-4 py-1.5 border-b-2 border-black flex items-center justify-between text-[8px] sm:text-[10px] font-pixel text-slate-400">
          <span className="flex items-center gap-1 text-green-400 truncate max-w-[200px] sm:max-w-none">
            <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-green-400 animate-ping" />
            OPTIMIZED & REFACTORED
          </span>
          <span className="text-slate-500 hidden sm:inline">[REFACTORED_CODE.EXE]</span>
        </div>

        <pre className="p-3 sm:p-4 overflow-x-auto text-green-300 code-editor-font text-[11px] sm:text-xs leading-relaxed whitespace-pre selection:bg-green-500/40">
          <code>{betterCode}</code>
        </pre>
      </div>

    </div>
  );
};
