import React from 'react';
import type { RoastIssue } from '../types/roast';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';

interface IssueListProps {
  issues: RoastIssue[];
}

export const IssueList: React.FC<IssueListProps> = ({ issues }) => {
  if (!issues || issues.length === 0) return null;

  const getSeverityBadge = (sev: string) => {
    switch (sev.toLowerCase()) {
      case 'high':
        return (
          <span className="px-1.5 sm:px-2 py-0.5 text-[8px] sm:text-[9px] font-pixel bg-pink-600 text-white border-2 border-black flex items-center gap-1 shrink-0">
            <AlertTriangle className="w-2.5 sm:w-3 h-2.5 sm:h-3" />
            HIGH
          </span>
        );
      case 'medium':
        return (
          <span className="px-1.5 sm:px-2 py-0.5 text-[8px] sm:text-[9px] font-pixel bg-yellow-400 text-black border-2 border-black flex items-center gap-1 shrink-0">
            <AlertCircle className="w-2.5 sm:w-3 h-2.5 sm:h-3" />
            MEDIUM
          </span>
        );
      default:
        return (
          <span className="px-1.5 sm:px-2 py-0.5 text-[8px] sm:text-[9px] font-pixel bg-cyan-400 text-black border-2 border-black flex items-center gap-1 shrink-0">
            <Info className="w-2.5 sm:w-3 h-2.5 sm:h-3" />
            LOW
          </span>
        );
    }
  };

  return (
    <div className="bg-[#14142b] p-4 sm:p-6 border-3 sm:border-4 border-black shadow-pixel my-4 sm:my-6">
      <div className="flex items-center gap-2 mb-3 sm:mb-4">
        <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-pink-500 shrink-0" />
        <h3 className="text-xs sm:text-sm font-pixel text-white tracking-wider text-pixel-pink">
          🚨 PROBLEMS IN YOUR CODE
        </h3>
      </div>

      <div className="space-y-2.5 sm:space-y-3">
        {issues.map((issue, idx) => (
          <div
            key={idx}
            className="p-3 sm:p-4 bg-[#090915] border-2 border-black hover:border-cyan-400 transition-colors"
          >
            <div className="flex items-start sm:items-center justify-between gap-2 mb-1.5 sm:mb-2">
              <h4 className="font-pixel text-[11px] sm:text-xs text-yellow-400 leading-snug">
                {issue.title}
              </h4>
              {getSeverityBadge(issue.severity)}
            </div>
            <p className="text-[11px] sm:text-xs text-slate-200 leading-relaxed font-mono">
              {issue.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
