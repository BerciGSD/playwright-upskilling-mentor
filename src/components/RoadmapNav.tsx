import { CheckCircle2, ChevronRight, Lock, CircleDot, AlertTriangle } from 'lucide-react';
import { ModuleData, RoadmapStage } from '../types';

interface RoadmapNavProps {
  modules: ModuleData[];
  currentModuleId: string;
  onSelectModule: (moduleId: string) => void;
  moduleStatus: Record<string, 'locked' | 'in-progress' | 'mastered' | 'needs-revisit'>;
}

export function RoadmapNav({
  modules,
  currentModuleId,
  onSelectModule,
  moduleStatus,
}: RoadmapNavProps) {
  return (
    <div className="bg-slate-900/60 border-b border-slate-800/80 px-4 py-3 overflow-x-auto no-scrollbar">
      <div className="max-w-7xl mx-auto flex items-center space-x-2 min-w-max">
        {modules.map((m, index) => {
          const isCurrent = m.id === currentModuleId;
          const status = moduleStatus[m.id] || 'locked';

          return (
            <div key={m.id} className="flex items-center space-x-2">
              <button
                id={`roadmap-btn-${m.id}`}
                onClick={() => onSelectModule(m.id)}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-cyan-500 text-slate-950 font-semibold shadow-md shadow-cyan-500/20 ring-1 ring-cyan-300'
                    : status === 'mastered'
                    ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/50 hover:bg-emerald-900/50'
                    : status === 'needs-revisit'
                    ? 'bg-amber-950/60 text-amber-300 border border-amber-800/50 hover:bg-amber-900/50'
                    : 'bg-slate-800/60 text-slate-400 border border-slate-700/40 hover:text-slate-200'
                }`}
              >
                {status === 'mastered' ? (
                  <CheckCircle2 className={`w-3.5 h-3.5 ${isCurrent ? 'text-slate-950' : 'text-emerald-400'}`} />
                ) : status === 'needs-revisit' ? (
                  <AlertTriangle className={`w-3.5 h-3.5 ${isCurrent ? 'text-slate-950' : 'text-amber-400'}`} />
                ) : isCurrent ? (
                  <CircleDot className="w-3.5 h-3.5 text-slate-950 animate-pulse" />
                ) : (
                  <span className="w-4 h-4 rounded-full bg-slate-700/80 text-[10px] flex items-center justify-center text-slate-300 font-mono">
                    {index + 1}
                  </span>
                )}
                <span>{m.stage}</span>
              </button>

              {index < modules.length - 1 && (
                <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
