import React, { useState } from 'react';
import type { SupportedLanguage } from '../types/roast';
import { Trash2, Copy, Check, Terminal } from 'lucide-react';

interface CodeEditorProps {
  code: string;
  setCode: (code: string) => void;
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  disabled?: boolean;
}

const LANGUAGES: { value: SupportedLanguage; label: string }[] = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'c', label: 'C' },
  { value: 'cpp', label: 'C++' },
  { value: 'csharp', label: 'C#' },
  { value: 'php', label: 'PHP' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'sql', label: 'SQL' },
  { value: 'other', label: 'Other' },
];

export const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  setCode,
  language,
  setLanguage,
  disabled = false,
}) => {
  const [copied, setCopied] = useState(false);

  const lines = code ? code.split('\n') : [''];
  const lineCount = lines.length;
  const charCount = code.length;

  const handleCopy = () => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setCode('');
  };

  return (
    <div className="w-full bg-[#14142b] p-3.5 sm:p-6 border-3 sm:border-4 border-black shadow-pixel-cyan relative font-mono mb-6">
      
      {/* Top Controls Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-3 sm:pb-4 border-b-2 border-slate-700 mb-3 sm:mb-4">
        
        {/* Language selector */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <label className="text-[10px] sm:text-xs font-pixel uppercase tracking-wider text-cyan-400 flex items-center gap-1.5 shrink-0">
            <Terminal className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-pink-500" />
            <span>LANGUAGE:</span>
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
            disabled={disabled}
            className="flex-1 sm:flex-none bg-[#0b0b1a] text-cyan-300 border-2 border-black px-2.5 py-1.5 text-[10px] sm:text-xs font-pixel focus:outline-none focus:border-pink-500 cursor-pointer shadow-pixel-sm min-w-[130px] sm:w-56"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-end gap-2 font-pixel text-[9px] sm:text-[10px]">
          <button
            onClick={handleClear}
            disabled={disabled || !code}
            className="text-slate-400 hover:text-pink-500 disabled:opacity-40 transition-colors flex items-center gap-1 px-2.5 py-1.5 bg-[#1c1c3a] border-2 border-black cursor-pointer"
            title="Clear code"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>CLEAR</span>
          </button>
          
          <button
            onClick={handleCopy}
            disabled={disabled || !code}
            className="text-slate-400 hover:text-cyan-400 disabled:opacity-40 transition-colors flex items-center gap-1 px-2.5 py-1.5 bg-[#1c1c3a] border-2 border-black cursor-pointer"
            title="Copy code"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-green-400" />
                <span className="text-green-400 font-bold">COPIED</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>COPY</span>
              </>
            )}
          </button>
        </div>

      </div>

      {/* Editor Frame */}
      <div className="rounded-none bg-[#090915] border-2 sm:border-3 border-black shadow-inner font-mono text-xs sm:text-sm overflow-hidden">
        
        {/* Retro Window Bar */}
        <div className="bg-[#1c1c3a] px-3 sm:px-4 py-1.5 sm:py-2 border-b-2 sm:border-b-3 border-black flex items-center justify-between font-pixel text-[9px] sm:text-[10px]">
          <div className="flex items-center gap-1.5 sm:gap-2 text-cyan-400">
            <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 bg-pink-500 inline-block"></span>
            <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 bg-yellow-400 inline-block"></span>
            <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 bg-green-400 inline-block"></span>
            <span className="ml-1 sm:ml-2 text-slate-300 text-[8px] sm:text-[10px] truncate max-w-[170px] sm:max-w-none">
              [ROAST_TERMINAL.{language === 'javascript' ? 'JS' : language === 'typescript' ? 'TS' : 'CODE'}]
            </span>
          </div>
        </div>

        {/* Textarea with Left Line Numbers */}
        <div className="flex relative min-h-[190px] sm:min-h-[260px] max-h-[500px] overflow-y-auto bg-[#090915]">
          <div className="bg-[#121226] select-none py-2.5 sm:py-3 px-2 sm:px-3 text-right text-slate-500 border-r-2 border-black font-mono text-[11px] sm:text-xs w-9 sm:w-12 shrink-0 leading-5 sm:leading-6">
            {lines.map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            disabled={disabled}
            placeholder="// Paste your code here..."
            spellCheck={false}
            className="w-full bg-[#090915] text-cyan-300 p-2.5 sm:p-3 code-editor-font text-xs sm:text-sm leading-5 sm:leading-6 resize-none focus:outline-none placeholder-slate-600 selection:bg-pink-500/40"
            style={{ tabSize: 2 }}
          />
        </div>

        {/* Bottom Editor Status Bar */}
        <div className="bg-[#121226] border-t-2 border-black px-3 sm:px-4 py-1.5 text-[9px] sm:text-[10px] text-slate-400 font-pixel flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <span>LINES: {lineCount}</span>
            <span>CHARS: {charCount}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-none bg-pink-500 animate-ping"></span>
            <span className="uppercase text-cyan-400 font-bold">{language}</span>
          </div>
        </div>

      </div>

    </div>
  );
};
