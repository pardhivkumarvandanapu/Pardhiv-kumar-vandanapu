import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { ZoomIn, ZoomOut, RotateCcw, Copy, Check, Maximize2, Minimize2, Code, Eye } from 'lucide-react';

interface MermaidRendererProps {
  chart: string;
  className?: string;
  onNodeClick?: (nodeId: string) => void;
}

export const MermaidRenderer: React.FC<MermaidRendererProps> = ({ chart, className = '', onNodeClick }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [copied, setCopied] = useState<boolean>(false);
  const [showRaw, setShowRaw] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'neutral',
      securityLevel: 'loose',
      fontFamily: 'ui-sans-serif, system-ui, sans-serif',
      flowchart: {
        curve: 'basis',
        htmlLabels: true,
        useMaxWidth: false,
      }
    });
  }, []);

  useEffect(() => {
    let isMounted = true;
    const renderDiagram = async () => {
      if (!chart || !chart.trim()) return;
      setError(null);

      // Clean diagram string: remove possible ```mermaid blocks if present
      let cleanChart = chart.trim();
      if (cleanChart.startsWith('```mermaid')) {
        cleanChart = cleanChart.replace(/^```mermaid\s*/, '').replace(/```$/, '').trim();
      } else if (cleanChart.startsWith('```')) {
        cleanChart = cleanChart.replace(/^```\s*/, '').replace(/```$/, '').trim();
      }

      // Ensure graph TD or flowchart TD header exists
      if (!cleanChart.startsWith('graph') && !cleanChart.startsWith('flowchart')) {
        cleanChart = `graph TD\n${cleanChart}`;
      }

      try {
        const id = `mermaid-${Math.random().toString(36).substring(2, 9)}`;
        const { svg } = await mermaid.render(id, cleanChart);
        if (isMounted) {
          setSvgContent(svg);
        }
      } catch (err: any) {
        console.error('Mermaid render error:', err);
        if (isMounted) {
          setError(err?.message || 'Failed to render flowchart. The syntax is shown in the Code tab.');
        }
      }
    };

    renderDiagram();

    return () => {
      isMounted = false;
    };
  }, [chart]);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.2, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.4));
  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (showRaw) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleCopyCode = async () => {
    try {
      const labeledMermaid = `[FLOWCHART]\n${chart.trim()}`;
      await navigator.clipboard.writeText(labeledMermaid);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className={`relative border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-50/50 dark:bg-slate-900/60 backdrop-blur-sm ${isFullscreen ? 'fixed inset-4 z-50 shadow-2xl bg-white dark:bg-slate-950 flex flex-col' : ''} ${className}`}>
      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between px-4 py-2.5 bg-slate-100/80 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700/60 text-xs font-medium text-slate-600 dark:text-slate-300">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded font-mono font-semibold text-[11px] bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60">
            [FLOWCHART]
          </span>
          <span className="text-slate-500 dark:text-slate-400 hidden sm:inline">
            Interactive Architecture Graph
          </span>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          {/* View Mode Toggle */}
          <button
            onClick={() => setShowRaw(!showRaw)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            title="Toggle between Graph view and Mermaid Code"
          >
            {showRaw ? <Eye className="w-3.5 h-3.5" /> : <Code className="w-3.5 h-3.5" />}
            <span>{showRaw ? 'Visual Graph' : 'Mermaid Code'}</span>
          </button>

          {!showRaw && (
            <div className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-0.5">
              <button
                onClick={handleZoomIn}
                className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] font-mono px-1 min-w-[2.5rem] text-center text-slate-500">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={handleZoomOut}
                className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleResetZoom}
                className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition"
                title="Reset View"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Copy Button */}
          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 transition text-slate-700 dark:text-slate-200"
            title="Copy [FLOWCHART] Mermaid.js snippet"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy Code'}</span>
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition"
            title={isFullscreen ? 'Exit Fullscreen' : 'View Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Visual Canvas or Raw Code */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={`relative overflow-hidden w-full select-none ${
          isFullscreen ? 'flex-1 min-h-0' : 'h-[460px]'
        } ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} ${showRaw ? 'cursor-auto' : ''}`}
      >
        {showRaw ? (
          <div className="h-full overflow-auto p-4 font-mono text-xs bg-slate-900 text-slate-100 selection:bg-indigo-500 selection:text-white">
            <div className="text-slate-400 mb-2 font-semibold">// [FLOWCHART] Mermaid Specification</div>
            <pre className="whitespace-pre-wrap">{chart}</pre>
          </div>
        ) : error ? (
          <div className="h-full flex flex-col items-center justify-center p-6 text-center">
            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-lg text-amber-800 dark:text-amber-200 max-w-md text-xs">
              <p className="font-semibold mb-1">Diagram Rendering Notice</p>
              <p className="mb-3">{error}</p>
              <button
                onClick={() => setShowRaw(true)}
                className="px-3 py-1 bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-100 rounded text-xs font-medium hover:opacity-90"
              >
                Inspect Mermaid Syntax
              </button>
            </div>
          </div>
        ) : svgContent ? (
          <div
            className="w-full h-full flex items-center justify-center transition-transform duration-75 ease-out"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: 'center center',
            }}
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-slate-400 text-xs">
            Rendering architectural flowchart...
          </div>
        )}

        {/* Pan helper hint */}
        {!showRaw && !error && (
          <div className="absolute bottom-2 right-3 pointer-events-none text-[10px] text-slate-400 dark:text-slate-500 bg-white/80 dark:bg-slate-900/80 px-2 py-0.5 rounded backdrop-blur-xs border border-slate-200/50 dark:border-slate-800/50">
            Drag to pan • Use + / - to zoom
          </div>
        )}
      </div>
    </div>
  );
};
