import React, { useEffect, useRef, useState } from 'react';
import type { RoastResponseData, RoastLevel } from '../types/roast';
import { IssueList } from './IssueList';
import { CodeSuggestion } from './CodeSuggestion';
import { PixelFlame } from './PixelFlame';
import { RotateCcw, Copy, Check, Share2, X, Download } from 'lucide-react';
import confetti from 'canvas-confetti';
import { toPng } from 'html-to-image';

interface RoastResultProps {
  data: RoastResponseData;
  roastLevel: RoastLevel;
  onReset: () => void;
}

export const RoastResult: React.FC<RoastResultProps> = ({
  data,
  roastLevel,
  onReset,
}) => {
  const resultRef = useRef<HTMLDivElement>(null);
  const cardElementRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [copiedShareCard, setCopiedShareCard] = useState(false);
  const [showShareCard, setShowShareCard] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#ff2e93', '#00f0ff', '#ffe600', '#ff5500'],
      });
    } catch (e) {
      // ignore
    }

    if (resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [data]);

  const handleCopyRoast = () => {
    const text = `ROAST: "${data.roast}"\n\nPROBLEMS FOUND:\n${data.issues.map(i => `- ${i.title}: ${i.description}`).join('\n')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyShareCardText = () => {
    const cardText = `🔥 ROAST MY CODE 🔥\n\n"${data.roast}"\n\nLevel: ${roastLevel.toUpperCase()}\nSeverity: ${data.severity}/10\n\n${data.developerVerdict}\n\n👉 Test your code at roastmycode.dev`;
    navigator.clipboard.writeText(cardText);
    setCopiedShareCard(true);
    setTimeout(() => setCopiedShareCard(false), 2000);
  };

  const handleDownloadCard = async () => {
    if (!cardElementRef.current) return;
    try {
      setIsDownloading(true);
      const dataUrl = await toPng(cardElementRef.current, {
        cacheBust: true,
        pixelRatio: 2,
      });
      const link = document.createElement('a');
      link.download = `roast-my-code-${roastLevel}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export share card:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div ref={resultRef} className="w-full max-w-4xl mx-auto my-6 sm:my-8 space-y-4 sm:space-y-6">
      
      {/* 1. Main Roast Punchline Card */}
      <div className="p-4 sm:p-6 bg-[#14142b] border-3 sm:border-4 border-black shadow-pixel-pink font-pixel">
        <div className="flex items-center justify-between gap-2 mb-2 sm:mb-3">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <PixelFlame className="w-4 h-4 sm:w-5 sm:h-5" size={20} />
            <h2 className="text-xs sm:text-sm font-pixel text-white text-pixel-pink">
              THE ROAST
            </h2>
          </div>
          <span className="text-[8px] sm:text-[9px] font-pixel uppercase px-2 py-0.5 bg-pink-600 text-white border-2 border-black">
            {roastLevel}
          </span>
        </div>

        <blockquote className="text-[11px] sm:text-sm font-pixel text-yellow-400 my-2.5 sm:my-3 leading-5 sm:leading-6 text-pixel-yellow">
          "{data.roast}"
        </blockquote>
      </div>

      {/* 2. Problems Found in Code */}
      <IssueList issues={data.issues} />

      {/* 3. Suggested Fixed Code */}
      <CodeSuggestion betterCode={data.betterCode} />

      {/* Share Card Modal / Preview */}
      {showShareCard && (
        <div className="bg-[#14142b] p-3.5 sm:p-6 border-3 sm:border-4 border-black shadow-pixel-cyan relative font-mono">
          <div className="flex items-center justify-between pb-2.5 sm:pb-3 border-b-2 border-slate-700 mb-3 sm:mb-4 font-pixel text-[10px] sm:text-xs">
            <span className="text-cyan-400 flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-pink-500" />
              <span>SHARE CARD PREVIEW</span>
            </span>
            <button
              onClick={() => setShowShareCard(false)}
              className="text-slate-400 hover:text-white flex items-center gap-1 text-[9px] sm:text-[10px] cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>CLOSE</span>
            </button>
          </div>

          {/* Rendered Share Card (captured for PNG export) */}
          <div 
            ref={cardElementRef}
            className="p-4 sm:p-6 bg-[#090915] border-3 sm:border-4 border-black shadow-pixel-pink text-slate-100 font-pixel"
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <PixelFlame className="w-5 h-5 sm:w-6 sm:h-6" size={24} />
                <span className="text-[11px] sm:text-sm text-white">ROAST MY CODE</span>
              </div>
              <span className="text-[8px] sm:text-[9px] px-1.5 sm:px-2 py-0.5 sm:py-1 bg-pink-600 text-white border-2 border-black font-bold uppercase">
                {roastLevel} LEVEL
              </span>
            </div>

            <blockquote className="text-[11px] sm:text-sm text-yellow-400 my-3 sm:my-4 leading-5 sm:leading-6">
              "{data.roast}"
            </blockquote>

            <div className="my-3 sm:my-4 p-2.5 sm:p-3 bg-[#121226] border-2 border-black flex items-center justify-between text-[9px] sm:text-[10px]">
              <span className="text-slate-400">ROAST SEVERITY:</span>
              <span className="text-cyan-400 font-bold">{data.severity} / 10</span>
            </div>

            <div className="text-[9px] sm:text-[10px] text-slate-300 italic mb-3 sm:mb-4 font-mono leading-relaxed">
              {data.developerVerdict}
            </div>

            <div className="flex items-center justify-between text-[8px] sm:text-[9px] text-slate-500 pt-2.5 sm:pt-3 border-t border-slate-800">
              <span>ROAST MY CODE</span>
              <span>roastmycode.dev</span>
            </div>
          </div>

          {/* Card Download & Copy Buttons */}
          <div className="mt-3 sm:mt-4 flex items-center justify-end gap-2 sm:gap-3 flex-wrap font-pixel text-[9px] sm:text-[10px]">
            <button
              onClick={handleCopyShareCardText}
              className="flex-1 sm:flex-none px-3 sm:px-4 py-2 sm:py-2.5 bg-[#1c1c3a] hover:bg-pink-600 text-white border-2 border-black shadow-pixel-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {copiedShareCard ? (
                <>
                  <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-green-400" />
                  <span>COPIED TEXT!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-400" />
                  <span>COPY TEXT</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownloadCard}
              disabled={isDownloading}
              className="flex-1 sm:flex-none px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-pink-600 to-orange-500 hover:from-pink-500 hover:to-orange-400 text-black font-bold border-2 border-black shadow-pixel-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Download className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>{isDownloading ? 'SAVING...' : 'DOWNLOAD PNG'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Action Buttons: Copy, Share Card & Roast Another */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 sm:pt-4 border-t-2 border-slate-800 font-pixel text-[9px] sm:text-xs">
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <button
            onClick={handleCopyRoast}
            className="flex-1 sm:flex-none px-3 sm:px-4 py-2 sm:py-2.5 bg-[#1c1c3a] hover:bg-pink-600 text-white border-2 sm:border-3 border-black shadow-pixel-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-green-400" />
                <span>COPIED!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-cyan-400" />
                <span>COPY ROAST</span>
              </>
            )}
          </button>

          <button
            onClick={() => setShowShareCard(!showShareCard)}
            className="flex-1 sm:flex-none px-3 sm:px-4 py-2 sm:py-2.5 bg-[#1c1c3a] hover:bg-cyan-600 text-cyan-300 hover:text-white border-2 sm:border-3 border-black shadow-pixel-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{showShareCard ? 'HIDE CARD' : 'SHARE CARD'}</span>
          </button>
        </div>

        <button
          onClick={onReset}
          className="w-full sm:w-auto px-4 sm:px-5 py-2.5 sm:py-2.5 bg-gradient-to-r from-orange-500 to-yellow-400 hover:from-orange-400 hover:to-yellow-300 text-black border-2 sm:border-3 border-black shadow-pixel-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 text-black" />
          <span>ROAST ANOTHER CODE</span>
        </button>
      </div>

    </div>
  );
};
