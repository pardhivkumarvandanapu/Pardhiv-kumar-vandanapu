import React from 'react';
import { Layers, ArrowDownRight, Database, Cpu, Network } from 'lucide-react';

interface ComponentDetail {
  id: string;
  name: string;
  type: string;
  description: string;
}

interface ArchitectureInspectorProps {
  dataInputs?: string[];
  modelLayers?: string[];
  dataOutputs?: string[];
  components?: ComponentDetail[];
}

export const ArchitectureInspector: React.FC<ArchitectureInspectorProps> = ({
  dataInputs = [],
  modelLayers = [],
  dataOutputs = [],
  components = []
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
      {/* 1. Data Inputs */}
      <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
          <Database className="w-4 h-4" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            Data Inputs
          </h4>
        </div>
        <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
          {dataInputs.length > 0 ? (
            dataInputs.map((item, i) => (
              <li key={i} className="flex items-start gap-1.5 font-mono text-[11px]">
                <ArrowDownRight className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))
          ) : (
            <li className="text-slate-400 italic">Raw sequence / multi-modal tensors</li>
          )}
        </ul>
      </div>

      {/* 2. Model Layers */}
      <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
          <Cpu className="w-4 h-4" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            Model Layers & Compute
          </h4>
        </div>
        <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
          {modelLayers.length > 0 ? (
            modelLayers.map((item, i) => (
              <li key={i} className="flex items-start gap-1.5 font-mono text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                <span>{item}</span>
              </li>
            ))
          ) : (
            <li className="text-slate-400 italic">Attention / Recurrent / Convolutional blocks</li>
          )}
        </ul>
      </div>

      {/* 3. Data Outputs */}
      <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
        <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
          <Network className="w-4 h-4" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            Data Outputs & Heads
          </h4>
        </div>
        <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
          {dataOutputs.length > 0 ? (
            dataOutputs.map((item, i) => (
              <li key={i} className="flex items-start gap-1.5 font-mono text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0 mt-1.5" />
                <span>{item}</span>
              </li>
            ))
          ) : (
            <li className="text-slate-400 italic">Logits, loss surfaces, transformed states</li>
          )}
        </ul>
      </div>
    </div>
  );
};
