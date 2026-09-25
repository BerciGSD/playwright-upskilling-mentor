import { useState } from 'react';
import { ModuleData } from '../types';
import { 
  BookOpen, 
  Terminal, 
  Code2, 
  AlertTriangle, 
  Info, 
  Check, 
  Copy, 
  ArrowRight,
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface CanvasLessonProps {
  module: ModuleData;
  onGoToDrills: () => void;
}

export function CanvasLesson({ module, onGoToDrills }: CanvasLessonProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Module Hero Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-950/80 text-cyan-300 border border-cyan-800/60">
              <span>Stage: {module.stage}</span>
              <span>•</span>
              <span>Est: {module.estimatedTime}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {module.title}
            </h2>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl">
              {module.subtitle}
            </p>
          </div>

          <button
            id="start-drills-hero-btn"
            onClick={onGoToDrills}
            className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-cyan-500/20 transition cursor-pointer"
          >
            <span>Practice Drills ({module.drills.length})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center space-x-1.5">
            <span className="font-semibold text-slate-200">Target Application:</span>
            <span className="text-cyan-400 font-mono">{module.targetApp}</span>
          </span>
          <span className="hidden sm:inline">Linux Platform: Ubuntu 24.04 LTS (Noble Numbat)</span>
        </div>
      </div>

      {/* Just-In-Time TypeScript Spotlight */}
      <div className="bg-slate-900/90 border border-indigo-900/60 rounded-xl p-6 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/30 text-indigo-400 shrink-0 mt-0.5">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="space-y-3 flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-indigo-200">
                Just-in-Time TypeScript: {module.justInTimeTs.concept}
              </h3>
              <span className="text-[11px] font-mono text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800/50">
                Rule 3: Organic Learning
              </span>
            </div>
            <p className="text-xs text-indigo-300/80 italic">
              <strong>Why right now?</strong> {module.justInTimeTs.whyNow}
            </p>
            <p className="text-sm text-slate-300 leading-relaxed">
              {module.justInTimeTs.explanation}
            </p>
            <div className="bg-slate-950 rounded-lg p-3 font-mono text-xs text-indigo-200/90 border border-slate-800 overflow-x-auto">
              <pre>{module.justInTimeTs.codeExample}</pre>
            </div>
          </div>
        </div>
      </div>

      {/* Theory & Architecture Sections */}
      <div className="space-y-8">
        {module.theorySections.map((sec, idx) => (
          <section
            key={idx}
            className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 sm:p-7 space-y-4"
          >
            <div className="flex items-center space-x-2.5 text-cyan-400">
              <BookOpen className="w-5 h-5 shrink-0" />
              <h3 className="text-lg font-bold text-slate-100">{sec.title}</h3>
            </div>

            <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {sec.content}
            </div>

            {/* Code Snippet with Copy */}
            {sec.codeSnippet && (
              <div className="space-y-2 mt-4">
                {sec.codeSnippet.caption && (
                  <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                    <span className="font-mono text-slate-400">{sec.codeSnippet.caption}</span>
                    <button
                      onClick={() => handleCopy(sec.codeSnippet!.code, idx)}
                      className="flex items-center space-x-1 hover:text-cyan-400 transition cursor-pointer text-[11px]"
                    >
                      {copiedIndex === idx ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy code</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
                <div className="bg-slate-950 rounded-xl p-4 border border-slate-800/80 font-mono text-xs text-slate-200 overflow-x-auto shadow-inner">
                  <pre className="leading-relaxed">{sec.codeSnippet.code}</pre>
                </div>
              </div>
            )}

            {/* Callouts */}
            {sec.callout && (
              <div
                className={`rounded-xl p-4 border text-xs sm:text-sm flex items-start space-x-3 mt-4 ${
                  sec.callout.type === 'warning'
                    ? 'bg-rose-950/40 border-rose-800/50 text-rose-200'
                    : sec.callout.type === 'ubuntu'
                    ? 'bg-amber-950/40 border-amber-800/50 text-amber-200'
                    : 'bg-cyan-950/40 border-cyan-800/50 text-cyan-200'
                }`}
              >
                <div className="shrink-0 mt-0.5">
                  {sec.callout.type === 'warning' ? (
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                  ) : sec.callout.type === 'ubuntu' ? (
                    <Terminal className="w-4 h-4 text-amber-400" />
                  ) : (
                    <Info className="w-4 h-4 text-cyan-400" />
                  )}
                </div>
                <div>
                  <h4 className="font-bold mb-1">{sec.callout.title}</h4>
                  <p className="leading-relaxed opacity-90">{sec.callout.text}</p>
                </div>
              </div>
            )}
          </section>
        ))}
      </div>

      {/* Ubuntu 24.04 Terminal Commands */}
      <section className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-emerald-400">
            <Terminal className="w-5 h-5 shrink-0" />
            <h3 className="text-base font-bold text-slate-100">
              Ubuntu 24.04 Shell Commands for this Module
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-mono">Terminal Reference</span>
        </div>

        <div className="space-y-3">
          {module.ubuntuTerminalCommands.map((cmd, idx) => (
            <div
              key={idx}
              className="bg-slate-950 border border-slate-800 rounded-lg p-3 space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">{cmd.description}</span>
                <button
                  onClick={() => handleCopy(cmd.command, 900 + idx)}
                  className="text-slate-500 hover:text-slate-300 text-[11px] flex items-center space-x-1 cursor-pointer"
                >
                  {copiedIndex === 900 + idx ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              </div>
              <div className="font-mono text-xs text-emerald-300">
                <span className="text-slate-500 select-none">$ </span>
                {cmd.command}
              </div>
              {cmd.expectedOutput && (
                <div className="text-[11px] font-mono text-slate-500 border-t border-slate-900 pt-1">
                  Output: {cmd.expectedOutput.split('\n')[0]}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Next Step CTA */}
      <div className="bg-gradient-to-r from-cyan-950/40 via-slate-900 to-blue-950/40 border border-cyan-800/40 rounded-2xl p-6 text-center space-y-3">
        <h4 className="text-lg font-bold text-slate-100">Ready to put this theory to work?</h4>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Per our Strict Mastery Gate, solve the progressive retrieval drills. Remember to explain why your solution works in plain English!
        </p>
        <button
          id="ready-to-drill-btn"
          onClick={onGoToDrills}
          className="inline-flex items-center space-x-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-6 py-2.5 rounded-xl shadow-lg shadow-cyan-500/20 transition cursor-pointer"
        >
          <span>Begin Module Drills</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
