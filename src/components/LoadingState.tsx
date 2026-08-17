import React, { useState, useEffect } from 'react';
import { LOADING_MESSAGES } from '../data/loadingMessages';
import { PixelFlame } from './PixelFlame';
import { Cpu } from 'lucide-react';

export const LoadingState: React.FC = () => {
  const [msgIndex, setMsgIndex] = useState(0);
  const [progress, setProgress] = useState(10);

  useEffect(() => {
    const msgInterval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 1800);

    const progressInterval = setInterval(() => {
      setProgress((prev) => (prev >= 90 ? 90 : prev + 15));
    }, 300);

    return () => {
      clearInterval(msgInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="w-full p-8 my-8 text-center bg-[#14142b] border-4 border-black shadow-pixel-pink relative overflow-hidden font-pixel">
      
      <div className="flex flex-col items-center justify-center max-w-md mx-auto">
        
        {/* Animated Flame Spinner */}
        <div className="relative mb-6">
          <div className="w-16 h-16 bg-[#1c1c3a] border-3 border-black shadow-pixel-sm flex items-center justify-center animate-spin" style={{ animationDuration: '3s' }}>
            <Cpu className="w-8 h-8 text-cyan-400" />
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <PixelFlame className="w-9 h-9" size={32} />
          </div>
        </div>

        {/* Dynamic Rotating Quote */}
        <div className="min-h-[50px] flex items-center justify-center mb-4">
          <p className="text-xs text-yellow-400 font-pixel leading-relaxed">
            "{LOADING_MESSAGES[msgIndex].toUpperCase()}"
          </p>
        </div>

        {/* Retro Progress Bar */}
        <div className="w-full max-w-xs bg-[#090915] border-3 border-black p-1 mb-2">
          <div 
            className="h-4 bg-gradient-to-r from-pink-500 to-cyan-400 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-[10px] text-cyan-400 font-pixel mb-4">
          LOADING... {progress}%
        </span>

        <div className="flex items-center gap-2 text-[10px] text-slate-300 bg-[#090915] px-3 py-1.5 border-2 border-black">
          <span className="w-2 h-2 bg-pink-500 animate-ping"></span>
          <span>AI ENGINE PROCESSING</span>
        </div>

      </div>
    </div>
  );
};
