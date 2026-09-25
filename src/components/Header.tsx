import { BookOpen, Code2, Terminal, Layers, Compass, BarChart3, Dumbbell } from 'lucide-react';
import { RoadmapStage } from '../types';

interface HeaderProps {
  activeTab: 'canvas' | 'drills' | 'project' | 'sandbox' | 'terminal' | 'dashboard' | 'pom-mentor';
  setActiveTab: (tab: 'canvas' | 'drills' | 'project' | 'sandbox' | 'terminal' | 'dashboard' | 'pom-mentor') => void;
  currentStage: RoadmapStage;
  masteredModulesCount: number;
  totalModulesCount: number;
}

export function Header({
  activeTab,
  setActiveTab,
  currentStage,
  masteredModulesCount,
  totalModulesCount,
}: HeaderProps) {
  const tabs = [
    { id: 'dashboard' as const, label: 'Student Dashboard', icon: BarChart3 },
    { id: 'pom-mentor' as const, label: 'POM Mentor Gym (Anytime)', icon: Dumbbell },
    { id: 'canvas' as const, label: 'Canvas (Textbook)', icon: BookOpen },
    { id: 'drills' as const, label: 'Drill Lab (Course)', icon: Code2 },
    { id: 'project' as const, label: 'Cumulative Project', icon: Layers },
    { id: 'sandbox' as const, label: 'Target App Sandbox', icon: Compass },
    { id: 'terminal' as const, label: 'Ubuntu Terminal', icon: Terminal },
  ];

  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3 gap-3">
          {/* Brand & Subtitle */}
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white font-bold shadow-md shadow-cyan-900/30">
              PW
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg font-bold text-slate-100 tracking-tight">
                  Playwright Automation Canvas & Mentor Lab
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800/80">
                  Ubuntu 24.04 Ready
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Zero to Advanced QA Architect • Cumulative Test Project • Strict Mastery Gate
              </p>
            </div>
          </div>

          {/* Status Indicators */}
          <div className="flex items-center space-x-4 self-end md:self-auto">
            <div className="flex items-center space-x-2 text-xs bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60">
              <span className="text-slate-400">Roadmap:</span>
              <span className="font-semibold text-cyan-400">{currentStage}</span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-300">
                {masteredModulesCount} / {totalModulesCount} Mastered
              </span>
            </div>

            <div className="hidden lg:flex items-center space-x-1.5 text-xs text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>VS Code + Playwright</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 border-t border-slate-800/80 pt-2 pb-1 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
