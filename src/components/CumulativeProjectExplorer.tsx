import { useState } from 'react';
import { CUMULATIVE_PROJECT_FILES } from '../data/curriculumData';
import { ProjectFile } from '../types';
import { 
  FileCode2, 
  FolderTree, 
  Copy, 
  Check, 
  GitBranch, 
  RefreshCw,
  Layers,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

export function CumulativeProjectExplorer() {
  const [selectedFilePath, setSelectedFilePath] = useState<string>(CUMULATIVE_PROJECT_FILES[0].path);
  const [copied, setCopied] = useState(false);

  const selectedFile = CUMULATIVE_PROJECT_FILES.find((f) => f.path === selectedFilePath) || CUMULATIVE_PROJECT_FILES[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      {/* Intro Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-xs font-semibold bg-cyan-950 text-cyan-300 border border-cyan-800">
              Rule 2: Cumulative Suite
            </span>
            <h2 className="text-lg font-bold text-white">Cumulative Test Project Workspace</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            A single evolving enterprise repository. Watch as basic scripts in Module 2 seamlessly refactor into Page Objects (Module 5) and Fixtures (Module 6).
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs text-slate-400 bg-slate-950 px-3 py-2 rounded-lg border border-slate-800">
          <GitBranch className="w-4 h-4 text-cyan-400" />
          <span>Branch: <code className="text-cyan-300">main</code></span>
        </div>
      </div>

      {/* Explorer Layout: Sidebar + Code Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: File Tree */}
        <div className="lg:col-span-4 bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300 border-b border-slate-800 pb-2.5">
            <span className="flex items-center space-x-2">
              <FolderTree className="w-4 h-4 text-cyan-400" />
              <span>Project Files ({CUMULATIVE_PROJECT_FILES.length})</span>
            </span>
            <span className="text-[11px] text-slate-500 font-mono">playwright-mastery/</span>
          </div>

          <div className="space-y-1.5 max-h-[520px] overflow-y-auto pr-1">
            {CUMULATIVE_PROJECT_FILES.map((file) => {
              const isSelected = file.path === selectedFilePath;
              return (
                <button
                  key={file.path}
                  id={`file-btn-${file.path.replace(/[^a-zA-Z0-9]/g, '-')}`}
                  onClick={() => setSelectedFilePath(file.path)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-mono transition-all flex flex-col space-y-1 cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-500/15 text-cyan-200 border border-cyan-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="flex items-center space-x-2 truncate font-semibold">
                      <FileCode2 className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`} />
                      <span className="truncate">{file.path}</span>
                    </span>
                    <span className="text-[10px] text-slate-500 px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 shrink-0 ml-2">
                      {file.moduleIntroduced}
                    </span>
                  </div>
                  {file.refactorNote && (
                    <span className="text-[10px] text-amber-400/90 truncate flex items-center space-x-1 pl-5">
                      <RefreshCw className="w-2.5 h-2.5 shrink-0 animate-spin-slow" />
                      <span>{file.refactorNote}</span>
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Architecture Card */}
          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 space-y-2 bg-slate-950/40 p-3 rounded-lg">
            <div className="flex items-center space-x-1.5 font-semibold text-slate-300">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>Project Architectural Flow:</span>
            </div>
            <p className="leading-relaxed">
              <code className="text-cyan-300">playwright.config.ts</code> boots <code className="text-indigo-300">tests/auth.setup.ts</code> to generate session state, which <code className="text-emerald-300">fixtures/test-base.ts</code> reuses alongside POM classes.
            </p>
          </div>
        </div>

        {/* Right: Code Viewer */}
        <div className="lg:col-span-8 bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
          {/* File Header */}
          <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs font-bold text-slate-200">{selectedFile.path}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                  Introduced: {selectedFile.moduleIntroduced}
                </span>
              </div>
              <p className="text-xs text-slate-400">{selectedFile.description}</p>
            </div>

            <button
              onClick={handleCopy}
              className="flex items-center space-x-1.5 text-xs text-slate-400 hover:text-cyan-300 bg-slate-800 px-2.5 py-1.5 rounded-md border border-slate-700 transition cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          {/* Refactor Callout if applicable */}
          {selectedFile.refactorNote && (
            <div className="bg-amber-950/30 border-b border-amber-900/40 px-4 py-2 text-xs text-amber-300 flex items-center space-x-2">
              <RefreshCw className="w-3.5 h-3.5 shrink-0" />
              <span><strong>Refactoring Note:</strong> {selectedFile.refactorNote}</span>
            </div>
          )}

          {/* Code Viewer Body */}
          <div className="p-4 bg-slate-950 overflow-x-auto flex-1 font-mono text-xs leading-relaxed text-slate-200">
            <pre>
              {selectedFile.content.split('\n').map((line, idx) => (
                <div key={idx} className="table-row hover:bg-slate-900/80">
                  <span className="table-cell text-slate-600 select-none pr-4 text-right text-[11px] w-8">
                    {idx + 1}
                  </span>
                  <span className="table-cell whitespace-pre">{line}</span>
                </div>
              ))}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
