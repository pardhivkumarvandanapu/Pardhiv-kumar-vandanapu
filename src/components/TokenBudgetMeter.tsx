import React from 'react';
import { Gauge, ShieldCheck, Zap } from 'lucide-react';

interface TokenUsage {
  promptTokens: number;
  candidatesTokens: number;
  totalTokens: number;
  tokenCapLimit?: number;
  efficiencyPercent?: number;
}

interface TokenBudgetMeterProps {
  tokenUsage?: TokenUsage;
}

export const TokenBudgetMeter: React.FC<TokenBudgetMeterProps> = ({ tokenUsage }) => {
  const cap = tokenUsage?.tokenCapLimit || 25000;
  const total = tokenUsage?.totalTokens || 1540;
  const promptTokens = tokenUsage?.promptTokens || 420;
  const candidatesTokens = tokenUsage?.candidatesTokens || 1120;
  const percentage = Math.min(Math.round((total / cap) * 1000) / 10, 100);
  const remainingTokens = Math.max(cap - total, 0);

  const getStatusColor = () => {
    if (percentage <= 25) return 'text-emerald-500';
    if (percentage <= 60) return 'text-blue-500';
    if (percentage <= 85) return 'text-amber-500';
    return 'text-rose-500';
  };

  const getBarColor = () => {
    if (percentage <= 25) return 'bg-emerald-500';
    if (percentage <= 60) return 'bg-blue-500';
    if (percentage <= 85) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl text-white shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-indigo-500/20 text-indigo-400">
            <Gauge className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-semibold text-slate-200">
            Token Efficiency Budget
          </span>
          <span className="text-[10px] text-slate-400 font-mono">
            (Constraint: strictly &lt; 25,000 tokens)
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-mono font-bold text-emerald-400">
            {total.toLocaleString()} / {cap.toLocaleString()}
          </span>
          <span className="text-slate-400 text-[11px]">({percentage}% used)</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden mb-2">
        <div 
          className={`h-full rounded-full transition-all duration-500 ${getBarColor()}`}
          style={{ width: `${Math.max(percentage, 3)}%` }}
        />
      </div>

      {/* Token details */}
      <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2">
        <div className="flex items-center gap-3">
          <span>Prompt: <strong className="text-slate-300 font-mono">{promptTokens.toLocaleString()}</strong></span>
          <span>Output: <strong className="text-slate-300 font-mono">{candidatesTokens.toLocaleString()}</strong></span>
          <span>Headroom: <strong className="text-emerald-400 font-mono">+{remainingTokens.toLocaleString()}</strong></span>
        </div>
        <div className="flex items-center gap-1 text-emerald-400 font-medium text-[10px]">
          <Zap className="w-3 h-3" />
          <span>Optimal Token Headroom ({100 - percentage}% available)</span>
        </div>
      </div>
    </div>
  );
};
