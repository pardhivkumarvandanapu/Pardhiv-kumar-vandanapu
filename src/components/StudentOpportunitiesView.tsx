import React, { useState } from 'react';
import { 
  GraduationCap, 
  Target, 
  Cpu, 
  Layers, 
  Check, 
  Copy, 
  ArrowRight, 
  Clock, 
  Award,
  ChevronDown,
  ChevronUp,
  FileText
} from 'lucide-react';

export interface StudentOpportunity {
  title: string;
  exactExtension: string;
  targetedPerformanceMetric: string;
  recommendedTechStack: string[];
  resumeBulletPoint?: string;
  difficulty?: string;
  estimatedTimeWeeks?: number;
  prerequisites?: string[];
  stepByStepGuide?: string[];
}

interface StudentOpportunitiesViewProps {
  opportunities: StudentOpportunity[];
  paperTitle?: string;
}

export const StudentOpportunitiesView: React.FC<StudentOpportunitiesViewProps> = ({ 
  opportunities, 
  paperTitle 
}) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const handleCopyResumeBullet = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const getDifficultyBadge = (difficulty?: string) => {
    switch (difficulty) {
      case 'Beginner-Friendly':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'Intermediate':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'Advanced (Standout)':
      default:
        return 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-4 bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 rounded-xl text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">
              Undergraduate CS Research & Resume Lab
            </h3>
            <p className="text-xs text-indigo-200/80">
              3 high-impact extensions engineered for 3rd-year CS students targeting ML systems internships
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-medium text-indigo-200 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10 backdrop-blur-xs self-start sm:self-auto">
          <Award className="w-4 h-4 text-amber-300" />
          <span>Google XYZ Resume Format Included</span>
        </div>
      </div>

      {/* 3 Ideas Grid */}
      <div className="space-y-4">
        {opportunities.map((opp, idx) => {
          const isExpanded = expandedIndex === idx;
          const defaultResumeBullet = opp.resumeBulletPoint || 
            `Engineered ${opp.exactExtension}, achieving ${opp.targetedPerformanceMetric} using ${opp.recommendedTechStack.join(', ')}.`;

          return (
            <div 
              key={idx}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs hover:border-indigo-300 dark:hover:border-indigo-700/60 transition"
            >
              {/* Card Header */}
              <div 
                onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                className="p-5 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-850/50 hover:bg-slate-50 dark:hover:bg-slate-800/70 transition"
              >
                <div className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-600 text-white font-mono font-bold text-xs shrink-0 mt-0.5">
                    0{idx + 1}
                  </span>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                        {opp.title}
                      </h4>
                      {opp.difficulty && (
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getDifficultyBadge(opp.difficulty)}`}>
                          {opp.difficulty}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                      {opp.exactExtension}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end md:self-auto">
                  {opp.estimatedTimeWeeks && (
                    <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span>~{opp.estimatedTimeWeeks} weeks</span>
                    </div>
                  )}
                  <button className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Card Body */}
              {isExpanded && (
                <div className="p-5 space-y-5 border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900">
                  {/* Extension & Metric Dual Panel */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* The Exact Extension */}
                    <div className="p-4 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 space-y-2">
                      <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
                        <Layers className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">
                          The Exact Extension
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                        {opp.exactExtension}
                      </p>
                    </div>

                    {/* Targeted Performance Metric */}
                    <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50 space-y-2">
                      <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
                        <Target className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">
                          Targeted Performance Metric
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                        {opp.targetedPerformanceMetric}
                      </p>
                    </div>
                  </div>

                  {/* Recommended Tech Stack */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 text-xs font-bold uppercase tracking-wider">
                      <Cpu className="w-3.5 h-3.5" />
                      <span>Recommended Tech Stack</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {opp.recommendedTechStack.map((tech, tIdx) => (
                        <span 
                          key={tIdx}
                          className="px-2.5 py-1 rounded-md text-xs font-mono font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Resume Ready Bullet Point (Google XYZ format) */}
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-750 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                        <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        <span className="text-xs font-bold uppercase tracking-wider">
                          Resume Bullet Point (FAANG / XYZ Format)
                        </span>
                      </div>
                      <button
                        onClick={() => handleCopyResumeBullet(defaultResumeBullet, idx)}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition"
                      >
                        {copiedIndex === idx ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-600 font-semibold">Copied to Clipboard</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy Bullet</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-xs sm:text-sm font-sans text-slate-800 dark:text-slate-200 italic pl-3 border-l-2 border-indigo-500">
                      "{defaultResumeBullet}"
                    </p>
                  </div>

                  {/* Step-by-Step Implementation Roadmap */}
                  {opp.stepByStepGuide && opp.stepByStepGuide.length > 0 && (
                    <div className="space-y-2 pt-2">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                        4-Step Undergraduate Execution Roadmap
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {opp.stepByStepGuide.map((step, sIdx) => (
                          <div 
                            key={sIdx}
                            className="p-3 rounded-lg border border-slate-150 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2.5"
                          >
                            <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-700 dark:text-slate-300 shrink-0 mt-0.5">
                              {sIdx + 1}
                            </span>
                            <span className="leading-relaxed">{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
