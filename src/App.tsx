/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Sparkles, 
  ExternalLink, 
  Download, 
  Copy, 
  Check, 
  BookOpen, 
  GitBranch, 
  GraduationCap, 
  Layers, 
  RotateCcw,
  Zap,
  AlertCircle,
  FileCode2,
  Share2
} from 'lucide-react';
import { MermaidRenderer } from './components/MermaidRenderer';
import { CoreConceptView } from './components/CoreConceptView';
import { StudentOpportunitiesView, StudentOpportunity } from './components/StudentOpportunitiesView';
import { TokenBudgetMeter } from './components/TokenBudgetMeter';
import { ArchitectureInspector } from './components/ArchitectureInspector';

interface PaperAnalysisData {
  paperMeta: {
    title: string;
    authors: string[];
    publication?: string;
    year?: string;
    arxivId?: string;
    url?: string;
    pdfUrl?: string;
    tl_dr?: string;
  };
  coreConcept: {
    wordCount?: number;
    problemStatement: string;
    primaryMethodology: string;
    mathematicalBreakthroughs: string;
    fullSummaryUnder300Words: string;
  };
  architecturalFlowchart: {
    mermaidSyntax: string;
    components?: any[];
    dataInputs?: string[];
    modelLayers?: string[];
    dataOutputs?: string[];
  };
  studentOpportunities: StudentOpportunity[];
  tokenUsage?: {
    promptTokens: number;
    candidatesTokens: number;
    totalTokens: number;
    tokenCapLimit?: number;
    efficiencyPercent?: number;
  };
}

export default function App() {
  const [inputQuery, setInputQuery] = useState<string>('https://arxiv.org/abs/1706.03762');
  const [activeTab, setActiveTab] = useState<'all' | 'concept' | 'flowchart' | 'opportunities'>('all');
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [analysisData, setAnalysisData] = useState<PaperAnalysisData | null>(null);
  const [copiedAll, setCopiedAll] = useState<boolean>(false);

  // Initial load with default classic benchmark "Attention Is All You Need"
  useEffect(() => {
    handleAnalyze('1706.03762');
  }, []);

  const handleAnalyze = async (queryToAnalyze?: string) => {
    const targetQuery = (queryToAnalyze !== undefined ? queryToAnalyze : inputQuery).trim();
    if (!targetQuery) return;

    setLoading(true);
    setError(null);
    setLoadingStep('Ingesting paper citation and verifying metadata...');

    try {
      setTimeout(() => setLoadingStep('Extracting core mathematical breakthroughs (< 300 words)...'), 600);
      setTimeout(() => setLoadingStep('Synthesizing [FLOWCHART] Mermaid architecture graph...'), 1200);
      setTimeout(() => setLoadingStep('Formulating 3 resume-ready student project specifications...'), 1800);

      const response = await fetch('/api/analyze-paper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetQuery })
      });

      const resJson = await response.json();

      if (!response.ok) {
        throw new Error(resJson.error || 'Failed to analyze paper.');
      }

      setAnalysisData(resJson.data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred while analyzing the academic paper.');
    } finally {
      setLoading(false);
      setLoadingStep('');
    }
  };

  const handleCopyFullMarkdown = async () => {
    if (!analysisData) return;
    const meta = analysisData.paperMeta;
    const core = analysisData.coreConcept;
    const opps = analysisData.studentOpportunities;
    const flowchart = analysisData.architecturalFlowchart;

    const md = `# Academic Analysis: ${meta.title}
**Authors:** ${meta.authors.join(', ')}  
**ArXiv / Publication:** ${meta.arxivId || meta.publication || 'Preprint'} | ${meta.year || ''}  
**URL:** ${meta.url || ''}

---

## 1. CORE CONCEPT EXTRACTION (< 300 Words)
**Problem Statement:**
${core.problemStatement}

**Primary Methodology:**
${core.primaryMethodology}

**Key Mathematical & Algorithmic Breakthroughs:**
${core.mathematicalBreakthroughs}

**Executive Abstract (< 300 words):**
${core.fullSummaryUnder300Words}

---

## 2. ARCHITECTURAL FLOWCHART (Mermaid.js)
[FLOWCHART]
\`\`\`mermaid
${flowchart.mermaidSyntax}
\`\`\`

---

## 3. FUTURE WORK & INTERNSHIP OPPORTUNITIES (For 3rd-Year CS Students)
${opps.map((o, idx) => `
### Project 0${idx + 1}: ${o.title}
- **Exact Extension:** ${o.exactExtension}
- **Targeted Performance Metric:** ${o.targetedPerformanceMetric}
- **Recommended Tech Stack:** ${o.recommendedTechStack.join(', ')}
- **Resume Ready Bullet (XYZ Format):** "${o.resumeBulletPoint || ''}"
`).join('\n')}
`;

    try {
      await navigator.clipboard.writeText(md);
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDownloadMarkdown = () => {
    if (!analysisData) return;
    const element = document.createElement('a');
    const safeTitle = (analysisData.paperMeta.title || 'paper-analysis').replace(/[^a-zA-Z0-9]/g, '_');
    const file = new Blob([
      `# ${analysisData.paperMeta.title}\n\n` +
      `[FLOWCHART]\n\`\`\`mermaid\n${analysisData.architecturalFlowchart.mermaidSyntax}\n\`\`\`\n\n` +
      `## Summary\n${analysisData.coreConcept.fullSummaryUnder300Words}\n\n` +
      `## Student Projects\n${JSON.stringify(analysisData.studentOpportunities, null, 2)}`
    ], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = `${safeTitle}_analysis.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation Bar */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-bold text-white tracking-tight">
                  CS Research Agent
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950/80 text-emerald-400 border border-emerald-800">
                  Token-Efficient Engine
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Academic Paper Parsing • System Architecture Flowcharts • Student Resume Opportunities
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {analysisData && (
              <>
                <button
                  onClick={handleCopyFullMarkdown}
                  className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-200 transition"
                  title="Copy full synthesis as Markdown"
                >
                  {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedAll ? 'Copied Full Report' : 'Copy Synthesis'}</span>
                </button>
                <button
                  onClick={handleDownloadMarkdown}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-sm"
                  title="Download .md file"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Export .md</span>
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Paper Ingestion Hero & Search */}
        <section className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="max-w-3xl space-y-3 mb-5">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Analyze Any Academic Paper
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Enter an arXiv URL, paper title, or DOI. The agent extracts problem breakthroughs in under 300 words, renders a syntactically verified Mermaid.js <code className="text-indigo-400 font-mono">[FLOWCHART]</code>, and maps 3 high-impact resume extensions for 3rd-year CS students.
            </p>
          </div>

          {/* Search Input Bar */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleAnalyze();
            }}
            className="flex flex-col sm:flex-row gap-2.5"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Paste arXiv link (e.g. https://arxiv.org/abs/2312.00752), arXiv ID (1706.03762), or paper title..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !inputQuery.trim()}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium text-xs sm:text-sm rounded-xl transition flex items-center justify-center gap-2 shrink-0 shadow-lg shadow-indigo-600/20"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Parse & Architect</span>
                </>
              )}
            </button>
          </form>

          {/* Benchmark Quick-Presets */}
          <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 text-[11px] font-medium flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-400" /> Quick Benchmark Papers:
            </span>
            {[
              { label: 'Attention Is All You Need', id: '1706.03762', tag: 'Transformer' },
              { label: 'Mamba SSM', id: '2312.00752', tag: 'Linear SSM' },
              { label: 'DeepSeek-R1', id: 'deepseek-r1', tag: 'Pure RL' },
              { label: 'FlashAttention', id: 'flashattention', tag: 'IO-Aware' },
            ].map((paper) => (
              <button
                key={paper.id}
                type="button"
                onClick={() => {
                  setInputQuery(paper.id);
                  handleAnalyze(paper.id);
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700 text-[11px] transition flex items-center gap-1.5"
              >
                <span>{paper.label}</span>
                <span className="text-[10px] px-1 py-0.2 bg-slate-900 text-indigo-400 rounded font-mono">
                  {paper.tag}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Loading Spinner & Radar */}
        {loading && (
          <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-4">
            <div className="w-12 h-12 rounded-full border-3 border-indigo-500/20 border-t-indigo-500 animate-spin mx-auto" />
            <div>
              <p className="text-sm font-semibold text-white">Agent Operating under &lt; 25,000 Token Ceiling</p>
              <p className="text-xs text-indigo-400 animate-pulse mt-1">{loadingStep}</p>
            </div>
            <p className="text-[11px] text-slate-400 max-w-md mx-auto">
              Extracting mathematical definitions, formulating syntactically verified Mermaid flowcharts, and targeting resume metrics.
            </p>
          </div>
        )}

        {/* Error Notification */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-200 text-xs flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold">Analysis Notice</p>
              <p>{error}</p>
              <p className="text-slate-400 text-[11px]">
                Tip: You can click any of the Quick Benchmark Papers above for instantaneous verified analysis.
              </p>
            </div>
          </div>
        )}

        {/* Active Analysis Content */}
        {analysisData && !loading && (
          <div className="space-y-6">
            {/* Paper Header Card */}
            <div className="p-5 sm:p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-950 text-indigo-300 border border-indigo-800">
                      {analysisData.paperMeta.arxivId ? `arXiv:${analysisData.paperMeta.arxivId}` : 'ACADEMIC PREPRINT'}
                    </span>
                    {analysisData.paperMeta.year && (
                      <span className="text-[11px] text-slate-400 font-mono">
                        Published {analysisData.paperMeta.year}
                      </span>
                    )}
                    {analysisData.paperMeta.publication && (
                      <span className="text-[11px] text-slate-400">
                        • {analysisData.paperMeta.publication}
                      </span>
                    )}
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                    {analysisData.paperMeta.title}
                  </h2>
                  <p className="text-xs text-slate-400">
                    {analysisData.paperMeta.authors.join(', ')}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {analysisData.paperMeta.url && (
                    <a
                      href={analysisData.paperMeta.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Original Paper</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Token Efficiency Meter */}
              <TokenBudgetMeter tokenUsage={analysisData.tokenUsage} />
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'all'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Unified Overview</span>
              </button>
              <button
                onClick={() => setActiveTab('concept')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'concept'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>1. Core Concept (&lt;300 Words)</span>
              </button>
              <button
                onClick={() => setActiveTab('flowchart')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'flowchart'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <GitBranch className="w-3.5 h-3.5" />
                <span>2. Architectural Flowchart</span>
              </button>
              <button
                onClick={() => setActiveTab('opportunities')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'opportunities'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>3. Student Resume Lab (3 Ideas)</span>
              </button>
            </div>

            {/* TAB CONTENTS */}
            {/* 1. All Overview Mode */}
            {activeTab === 'all' && (
              <div className="space-y-8">
                {/* 1. Core Concept Extraction */}
                <section className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-mono font-bold text-xs">
                      1
                    </span>
                    <h3 className="text-base font-bold text-white tracking-tight">
                      Core Concept Extraction
                    </h3>
                  </div>
                  <CoreConceptView 
                    data={analysisData.coreConcept} 
                    paperTitle={analysisData.paperMeta.title} 
                  />
                </section>

                {/* 2. Architectural Flowchart */}
                <section className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono font-bold text-xs">
                        2
                      </span>
                      <h3 className="text-base font-bold text-white tracking-tight">
                        Architectural Flowchart (Mermaid.js)
                      </h3>
                    </div>
                  </div>
                  <MermaidRenderer 
                    chart={analysisData.architecturalFlowchart.mermaidSyntax} 
                  />
                  <ArchitectureInspector 
                    dataInputs={analysisData.architecturalFlowchart.dataInputs}
                    modelLayers={analysisData.architecturalFlowchart.modelLayers}
                    dataOutputs={analysisData.architecturalFlowchart.dataOutputs}
                    components={analysisData.architecturalFlowchart.components}
                  />
                </section>

                {/* 3. Student Opportunities */}
                <section className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-mono font-bold text-xs">
                      3
                    </span>
                    <h3 className="text-base font-bold text-white tracking-tight">
                      Future Work & Internship Opportunities (3rd-Year CS Student)
                    </h3>
                  </div>
                  <StudentOpportunitiesView 
                    opportunities={analysisData.studentOpportunities} 
                    paperTitle={analysisData.paperMeta.title}
                  />
                </section>
              </div>
            )}

            {/* Individual Tab 1: Core Concept */}
            {activeTab === 'concept' && (
              <CoreConceptView 
                data={analysisData.coreConcept} 
                paperTitle={analysisData.paperMeta.title} 
              />
            )}

            {/* Individual Tab 2: Flowchart */}
            {activeTab === 'flowchart' && (
              <div className="space-y-4">
                <MermaidRenderer 
                  chart={analysisData.architecturalFlowchart.mermaidSyntax} 
                />
                <ArchitectureInspector 
                  dataInputs={analysisData.architecturalFlowchart.dataInputs}
                  modelLayers={analysisData.architecturalFlowchart.modelLayers}
                  dataOutputs={analysisData.architecturalFlowchart.dataOutputs}
                  components={analysisData.architecturalFlowchart.components}
                />
              </div>
            )}

            {/* Individual Tab 3: Opportunities */}
            {activeTab === 'opportunities' && (
              <StudentOpportunitiesView 
                opportunities={analysisData.studentOpportunities} 
                paperTitle={analysisData.paperMeta.title}
              />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 mt-12 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            CS Research Agent • Operates within strict token efficiency bounds (&lt; 25,000 tokens)
          </p>
          <p className="font-mono text-[11px] text-slate-400">
            Mermaid.js [FLOWCHART] Engine • Google XYZ Resume Formulation
          </p>
        </div>
      </footer>
    </div>
  );
}
