import React, { useState } from 'react';
import { BookOpen, Check, Copy, Sparkles, Target, Cpu, Sigma } from 'lucide-react';

interface CoreConceptProps {
  data: {
    wordCount?: number;
    problemStatement: string;
    primaryMethodology: string;
    mathematicalBreakthroughs: string;
    fullSummaryUnder300Words: string;
  };
  paperTitle?: string;
}

export const CoreConceptView: React.FC<CoreConceptProps> = ({ data, paperTitle }) => {
  const [copied, setCopied] = useState(false);

  // Calculate actual word count of the summary
  const summaryText = data.fullSummaryUnder300Words || `${data.problemStatement} ${data.primaryMethodology} ${data.mathematicalBreakthroughs}`;
  const actualWordCount = summaryText.trim().split(/\s+/).filter(Boolean).length;
  const wordLimit = 300;
  const isUnderLimit = actualWordCount <= wordLimit;

  const handleCopySummary = async () => {
    try {
      await navigator.clipboard.writeText(summaryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Word Count Badge & Copy */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              Core Concept Extraction
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Plain-language technical breakdown strictly constrained under 300 words
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Word Count Indicator */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700">
            <span className="text-slate-500 dark:text-slate-400">Word Count:</span>
            <span
              className={`font-mono font-bold ${
                isUnderLimit
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {actualWordCount} / {wordLimit} words
            </span>
            {isUnderLimit && (
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse ml-0.5" />
            )}
          </div>

          <button
            onClick={handleCopySummary}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied Summary' : 'Copy Summary'}</span>
          </button>
        </div>
      </div>

      {/* Structured Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 1. Problem Statement */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl space-y-3 relative overflow-hidden group hover:border-indigo-300 dark:hover:border-indigo-700/50 transition">
          <div className="w-1.5 h-full bg-amber-500 absolute top-0 left-0" />
          <div className="flex items-center gap-2 pl-2">
            <Target className="w-4 h-4 text-amber-500" />
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[11px]">
              1. The Problem Statement
            </h4>
          </div>
          <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300 pl-2">
            {data.problemStatement}
          </p>
        </div>

        {/* 2. Primary Methodology */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl space-y-3 relative overflow-hidden group hover:border-indigo-300 dark:hover:border-indigo-700/50 transition">
          <div className="w-1.5 h-full bg-indigo-500 absolute top-0 left-0" />
          <div className="flex items-center gap-2 pl-2">
            <Cpu className="w-4 h-4 text-indigo-500" />
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[11px]">
              2. Primary Methodology
            </h4>
          </div>
          <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300 pl-2">
            {data.primaryMethodology}
          </p>
        </div>

        {/* 3. Mathematical & Algorithmic Breakthroughs */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl space-y-3 relative overflow-hidden group hover:border-indigo-300 dark:hover:border-indigo-700/50 transition">
          <div className="w-1.5 h-full bg-emerald-500 absolute top-0 left-0" />
          <div className="flex items-center gap-2 pl-2">
            <Sigma className="w-4 h-4 text-emerald-500" />
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[11px]">
              3. Key Mathematical Breakthroughs
            </h4>
          </div>
          <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300 pl-2">
            {data.mathematicalBreakthroughs}
          </p>
        </div>
      </div>

      {/* Accessible Plain-Language Synthesis Card */}
      <div className="p-5 bg-gradient-to-br from-indigo-50/60 via-white to-slate-50 dark:from-indigo-950/20 dark:via-slate-900 dark:to-slate-900/60 border border-indigo-100 dark:border-indigo-900/40 rounded-xl">
        <div className="flex items-center gap-2 mb-2 text-indigo-700 dark:text-indigo-300">
          <Sparkles className="w-4 h-4" />
          <h4 className="text-xs font-bold tracking-wide uppercase">
            Unified Executive Abstract (&lt; 300 words)
          </h4>
        </div>
        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
          {summaryText}
        </p>
      </div>
    </div>
  );
};
