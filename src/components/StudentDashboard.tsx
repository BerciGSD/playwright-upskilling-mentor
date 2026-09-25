import React, { useState, useMemo } from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Cell, 
  ReferenceLine 
} from 'recharts';
import { 
  CheckCircle2, 
  Clock, 
  Lock, 
  AlertCircle, 
  Award, 
  BookOpen, 
  Code2, 
  Sparkles, 
  ArrowRight, 
  TrendingUp, 
  ShieldCheck, 
  Target,
  RefreshCw,
  Compass,
  Terminal,
  Crosshair,
  Layers,
  Wrench,
  Globe,
  Workflow,
  Crown,
  Flame,
  Medal,
  Trophy,
  ChevronDown,
  ChevronUp,
  MessageSquareQuote,
  FileCode,
  Dumbbell
} from 'lucide-react';
import { ModuleData, StudentProgress, RoadmapStage } from '../types';
import { getApprovedDrillExplanation } from '../data/drillExplanations';

interface StudentDashboardProps {
  modules: ModuleData[];
  progress: StudentProgress;
  onSelectModule: (moduleId: string) => void;
  onNavigateTab: (tab: 'canvas' | 'drills' | 'project' | 'sandbox' | 'terminal' | 'dashboard' | 'pom-mentor') => void;
  onUpdateModuleStatus?: (moduleId: string, status: 'locked' | 'in-progress' | 'mastered' | 'needs-revisit') => void;
  onMarkAllUpTo?: (moduleId: string) => void;
  onRestorePomSubmissions?: () => void;
}

export function StudentDashboard({
  modules,
  progress,
  onSelectModule,
  onNavigateTab,
  onUpdateModuleStatus,
  onMarkAllUpTo,
  onRestorePomSubmissions,
}: StudentDashboardProps) {
  const [metricView, setMetricView] = useState<'mastery' | 'drills'>('mastery');
  const [badgeFilter, setBadgeFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [selectedBarModuleId, setSelectedBarModuleId] = useState<string | null>(null);
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(null);

  // Calculate metrics per module
  const chartData = useMemo(() => {
    return modules.map((mod, idx) => {
      const status = progress.moduleStatus[mod.id] || 'locked';
      const totalDrills = mod.drills.length;
      const completedDrills = mod.drills.filter((d) =>
        progress.completedDrillIds.includes(d.id)
      ).length;

      let masteryPct = 0;
      if (status === 'mastered') {
        masteryPct = 100;
      } else if (status === 'in-progress') {
        // Base 25% for starting, plus percentage of completed drills up to 85%
        const drillRatio = totalDrills > 0 ? completedDrills / totalDrills : 0;
        masteryPct = Math.min(85, Math.round(25 + drillRatio * 60));
      } else if (status === 'needs-revisit') {
        masteryPct = 50;
      } else {
        masteryPct = 0;
      }

      return {
        id: mod.id,
        index: idx + 1,
        name: mod.stage,
        fullName: mod.title,
        status,
        masteryPct,
        completedDrills,
        totalDrills,
        targetApp: mod.targetApp,
        estimatedTime: mod.estimatedTime,
        checkpointTitle: mod.checkpointScenario.title,
      };
    });
  }, [modules, progress]);

  // Overall aggregate stats
  const totalModules = modules.length;
  const masteredCount = modules.filter(
    (m) => progress.moduleStatus[m.id] === 'mastered'
  ).length;
  const inProgressCount = modules.filter(
    (m) => progress.moduleStatus[m.id] === 'in-progress'
  ).length;

  const totalCurriculumDrills = useMemo(() => {
    return modules.reduce((acc, m) => acc + m.drills.length, 0);
  }, [modules]);

  const totalCompletedDrills = progress.completedDrillIds.length;

  const overallMasteryPct = Math.round(
    ((masteredCount * 100 + inProgressCount * 45) / (totalModules * 100)) * 100
  );

  // Badges configuration with Lucide icons and mastery criteria
  const badges = useMemo(() => {
    return [
      {
        id: 'badge-setup',
        title: 'Linux Pioneer',
        category: 'Stage Mastery',
        description: 'Mastered headless Playwright configuration and dependencies on Ubuntu 24.04.',
        requirement: 'Module 1: Setup Mastered',
        icon: Terminal,
        unlocked: progress.moduleStatus['setup'] === 'mastered',
        progressText: progress.moduleStatus['setup'] === 'mastered' ? 'Unlocked' : (progress.moduleStatus['setup'] === 'in-progress' ? 'In Progress' : 'Locked'),
        moduleId: 'setup',
        colorClasses: {
          border: 'border-emerald-500/40 hover:border-emerald-400',
          bg: 'from-emerald-950/40 to-slate-900',
          iconBg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
          badgePill: 'bg-emerald-950/80 text-emerald-300 border-emerald-700/80',
        },
      },
      {
        id: 'badge-basics',
        title: 'Locator Specialist',
        category: 'Stage Mastery',
        description: 'Trained in accessibility-first semantic locators and auto-waiting actionability.',
        requirement: 'Module 2: Basics Mastered',
        icon: Crosshair,
        unlocked: progress.moduleStatus['basics'] === 'mastered',
        progressText: progress.moduleStatus['basics'] === 'mastered' ? 'Unlocked' : (progress.moduleStatus['basics'] === 'in-progress' ? 'In Progress' : 'Locked'),
        moduleId: 'basics',
        colorClasses: {
          border: 'border-cyan-500/40 hover:border-cyan-400',
          bg: 'from-cyan-950/40 to-slate-900',
          iconBg: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
          badgePill: 'bg-cyan-950/80 text-cyan-300 border-cyan-700/80',
        },
      },
      {
        id: 'badge-assertions',
        title: 'Assertion Architect',
        category: 'Stage Mastery',
        description: 'Replaced fragile point-in-time snapshots with auto-retrying web-first assertions.',
        requirement: 'Module 3: Assertions Mastered',
        icon: ShieldCheck,
        unlocked: progress.moduleStatus['assertions'] === 'mastered',
        progressText: progress.moduleStatus['assertions'] === 'mastered' ? 'Unlocked' : (progress.moduleStatus['assertions'] === 'in-progress' ? 'In Progress' : 'Locked'),
        moduleId: 'assertions',
        colorClasses: {
          border: 'border-blue-500/40 hover:border-blue-400',
          bg: 'from-blue-950/40 to-slate-900',
          iconBg: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
          badgePill: 'bg-blue-950/80 text-blue-300 border-blue-700/80',
        },
      },
      {
        id: 'badge-debugging',
        title: 'Trace Detective',
        category: 'Stage Mastery',
        description: 'Diagnosed locator timeouts, network waterfalls, and DOM states with Trace Viewer.',
        requirement: 'Module 4: Debugging Mastered',
        icon: Compass,
        unlocked: progress.moduleStatus['debugging'] === 'mastered',
        progressText: progress.moduleStatus['debugging'] === 'mastered' ? 'Unlocked' : (progress.moduleStatus['debugging'] === 'in-progress' ? 'In Progress' : 'Locked'),
        moduleId: 'debugging',
        colorClasses: {
          border: 'border-purple-500/40 hover:border-purple-400',
          bg: 'from-purple-950/40 to-slate-900',
          iconBg: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
          badgePill: 'bg-purple-950/80 text-purple-300 border-purple-700/80',
        },
      },
      {
        id: 'badge-pom',
        title: 'POM Craftsman',
        category: 'Stage Mastery',
        description: 'Architected reusable, modular Page Object Models with clean locator encapsulation.',
        requirement: 'Module 5: POM Mastered',
        icon: Layers,
        unlocked: progress.moduleStatus['pom'] === 'mastered',
        progressText: progress.moduleStatus['pom'] === 'mastered' ? 'Unlocked' : (progress.moduleStatus['pom'] === 'in-progress' ? 'In Progress' : 'Locked'),
        moduleId: 'pom',
        colorClasses: {
          border: 'border-amber-500/40 hover:border-amber-400',
          bg: 'from-amber-950/40 to-slate-900',
          iconBg: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
          badgePill: 'bg-amber-950/80 text-amber-300 border-amber-700/80',
        },
      },
      {
        id: 'badge-fixtures',
        title: 'Fixture Virtuoso',
        category: 'Stage Mastery',
        description: 'Engineered custom fixtures for worker-scoped state isolation and zero teardown leaks.',
        requirement: 'Module 6: Fixtures Mastered',
        icon: Wrench,
        unlocked: progress.moduleStatus['fixtures'] === 'mastered',
        progressText: progress.moduleStatus['fixtures'] === 'mastered' ? 'Unlocked' : (progress.moduleStatus['fixtures'] === 'in-progress' ? 'In Progress' : 'Locked'),
        moduleId: 'fixtures',
        colorClasses: {
          border: 'border-indigo-500/40 hover:border-indigo-400',
          bg: 'from-indigo-950/40 to-slate-900',
          iconBg: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
          badgePill: 'bg-indigo-950/80 text-indigo-300 border-indigo-700/80',
        },
      },
      {
        id: 'badge-api',
        title: 'API Maestro',
        category: 'Stage Mastery',
        description: 'Intercepted socket routes, mocked backend responses, and combined API with UI tests.',
        requirement: 'Module 7: API Mastered',
        icon: Globe,
        unlocked: progress.moduleStatus['api'] === 'mastered',
        progressText: progress.moduleStatus['api'] === 'mastered' ? 'Unlocked' : (progress.moduleStatus['api'] === 'in-progress' ? 'In Progress' : 'Locked'),
        moduleId: 'api',
        colorClasses: {
          border: 'border-teal-500/40 hover:border-teal-400',
          bg: 'from-teal-950/40 to-slate-900',
          iconBg: 'bg-teal-500/15 text-teal-400 border-teal-500/30',
          badgePill: 'bg-teal-950/80 text-teal-300 border-teal-700/80',
        },
      },
      {
        id: 'badge-cicd',
        title: 'CI/CD Champion',
        category: 'Stage Mastery',
        description: 'Orchestrated matrix shards, headless Linux execution, and automated report uploads.',
        requirement: 'Module 8: CI/CD Mastered',
        icon: Workflow,
        unlocked: progress.moduleStatus['cicd'] === 'mastered',
        progressText: progress.moduleStatus['cicd'] === 'mastered' ? 'Unlocked' : (progress.moduleStatus['cicd'] === 'in-progress' ? 'In Progress' : 'Locked'),
        moduleId: 'cicd',
        colorClasses: {
          border: 'border-sky-500/40 hover:border-sky-400',
          bg: 'from-sky-950/40 to-slate-900',
          iconBg: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
          badgePill: 'bg-sky-950/80 text-sky-300 border-sky-700/80',
        },
      },
      {
        id: 'badge-capstone',
        title: 'Capstone Architect',
        category: 'Stage Mastery',
        description: 'Shipped a production-grade enterprise automation framework with 100% test coverage.',
        requirement: 'Module 9: Capstone Mastered',
        icon: Crown,
        unlocked: progress.moduleStatus['capstone'] === 'mastered',
        progressText: progress.moduleStatus['capstone'] === 'mastered' ? 'Unlocked' : (progress.moduleStatus['capstone'] === 'in-progress' ? 'In Progress' : 'Locked'),
        moduleId: 'capstone',
        colorClasses: {
          border: 'border-rose-500/40 hover:border-rose-400',
          bg: 'from-rose-950/40 to-slate-900',
          iconBg: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
          badgePill: 'bg-rose-950/80 text-rose-300 border-rose-700/80',
        },
      },
      {
        id: 'badge-halfway',
        title: 'Midway Vanguard',
        category: 'Milestone',
        description: 'Crossed the critical curriculum halfway mark with at least 4 mastered stages.',
        requirement: 'Master 4+ Modules',
        icon: Flame,
        unlocked: masteredCount >= 4,
        progressText: masteredCount >= 4 ? 'Unlocked (4+ Modules)' : `${masteredCount} / 4 Modules`,
        colorClasses: {
          border: 'border-orange-500/40 hover:border-orange-400',
          bg: 'from-orange-950/40 to-slate-900',
          iconBg: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
          badgePill: 'bg-orange-950/80 text-orange-300 border-orange-700/80',
        },
      },
      {
        id: 'badge-drills',
        title: 'Drill Centurion',
        category: 'Dedication',
        description: 'Successfully completed 10 or more hands-on code drills across the workbench.',
        requirement: 'Complete 10+ Drills',
        icon: Medal,
        unlocked: totalCompletedDrills >= 10,
        progressText: totalCompletedDrills >= 10 ? `Unlocked (${totalCompletedDrills} Drills)` : `${totalCompletedDrills} / 10 Drills`,
        colorClasses: {
          border: 'border-fuchsia-500/40 hover:border-fuchsia-400',
          bg: 'from-fuchsia-950/40 to-slate-900',
          iconBg: 'bg-fuchsia-500/15 text-fuchsia-400 border-fuchsia-500/30',
          badgePill: 'bg-fuchsia-950/80 text-fuchsia-300 border-fuchsia-700/80',
        },
      },
      {
        id: 'badge-mastery-gate',
        title: 'Mastery Gatekeeper',
        category: 'Milestone',
        description: 'Surpassed 75% overall curriculum mastery through strict no-notes checkpoints.',
        requirement: 'Overall Mastery ≥ 75%',
        icon: Trophy,
        unlocked: overallMasteryPct >= 75,
        progressText: overallMasteryPct >= 75 ? `Unlocked (${overallMasteryPct}%)` : `${overallMasteryPct}% / 75%`,
        colorClasses: {
          border: 'border-amber-400/40 hover:border-amber-300',
          bg: 'from-amber-950/50 to-slate-900',
          iconBg: 'bg-amber-400/15 text-amber-300 border-amber-400/30',
          badgePill: 'bg-amber-950/80 text-amber-200 border-amber-600/80',
        },
      },
    ];
  }, [progress, masteredCount, totalCompletedDrills, overallMasteryPct]);

  const unlockedBadgesCount = useMemo(() => {
    return badges.filter((b) => b.unlocked).length;
  }, [badges]);

  const filteredBadges = useMemo(() => {
    if (badgeFilter === 'unlocked') return badges.filter((b) => b.unlocked);
    if (badgeFilter === 'locked') return badges.filter((b) => !b.unlocked);
    return badges;
  }, [badges, badgeFilter]);

  // Status color mapping for chart and badges
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'mastered':
        return '#10b981'; // emerald-500
      case 'in-progress':
        return '#06b6d4'; // cyan-500
      case 'needs-revisit':
        return '#f59e0b'; // amber-500
      case 'locked':
      default:
        return '#334155'; // slate-700
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'mastered':
        return {
          label: 'Mastered',
          bg: 'bg-emerald-950/80 text-emerald-300 border-emerald-800',
          icon: CheckCircle2,
          textColor: 'text-emerald-400',
        };
      case 'in-progress':
        return {
          label: 'In Progress',
          bg: 'bg-cyan-950/80 text-cyan-300 border-cyan-800',
          icon: Clock,
          textColor: 'text-cyan-400',
        };
      case 'needs-revisit':
        return {
          label: 'Needs Revisit',
          bg: 'bg-amber-950/80 text-amber-300 border-amber-800',
          icon: AlertCircle,
          textColor: 'text-amber-400',
        };
      case 'locked':
      default:
        return {
          label: 'Locked',
          bg: 'bg-slate-900 text-slate-400 border-slate-800',
          icon: Lock,
          textColor: 'text-slate-500',
        };
    }
  };

  // Custom Chart Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      const badge = getStatusBadge(item.status);
      const BadgeIcon = badge.icon;

      return (
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-3.5 shadow-2xl backdrop-blur-md max-w-xs text-xs space-y-2 pointer-events-none z-50">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-bold text-slate-100 text-sm">
              Module {item.index}: {item.name}
            </span>
            <span
              className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-medium border ${badge.bg}`}
            >
              <BadgeIcon className="w-3 h-3" />
              <span>{badge.label}</span>
            </span>
          </div>

          <div className="space-y-1.5 text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">Mastery Level:</span>
              <span className="font-semibold text-emerald-400">{item.masteryPct}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Drills Completed:</span>
              <span className="font-semibold text-cyan-300">
                {item.completedDrills} / {item.totalDrills}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Target App:</span>
              <span className="font-medium text-slate-200">{item.targetApp}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Est. Duration:</span>
              <span className="text-slate-300">{item.estimatedTime}</span>
            </div>
          </div>

          <div className="pt-1.5 border-t border-slate-800/80 text-[11px] text-slate-400">
            Click bar to navigate directly to this module.
          </div>
        </div>
      );
    }
    return null;
  };

  const handleBarClick = (data: any) => {
    if (data && data.id) {
      setSelectedBarModuleId(data.id);
      onSelectModule(data.id);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Dashboard Top Header */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 backdrop-blur shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-gradient-to-tr from-cyan-600/30 to-emerald-600/30 border border-cyan-500/30 text-cyan-400">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  Student Learning Dashboard
                </h2>
                <p className="text-sm text-slate-400">
                  Comprehensive mastery visualization across the 9 Playwright automation stages
                </p>
              </div>
            </div>
          </div>

          {/* Quick Progress Simulation Controls (Useful for testing & instructor demos) */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium mr-1 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Demo Presets:
            </span>
            <button
              onClick={() => onMarkAllUpTo?.('assertions')}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer"
            >
              Set Modules 1-3 Mastered
            </button>
            <button
              onClick={() => onMarkAllUpTo?.('debugging')}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 transition cursor-pointer"
            >
              Set Modules 1-4 Mastered
            </button>
            <button
              onClick={() => onMarkAllUpTo?.('capstone')}
              className="px-3 py-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 transition cursor-pointer"
            >
              Full Mastered
            </button>
          </div>
        </div>

        {/* 4 Summary Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {/* Stat 1: Overall Mastery */}
          <div className="bg-slate-950/70 border border-slate-800/90 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Overall Mastery</span>
              <Award className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-extrabold text-white tracking-tight">
                {overallMasteryPct}%
              </span>
              <span className="text-xs text-emerald-400 font-medium">Curriculum</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-cyan-500 to-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${overallMasteryPct}%` }}
              />
            </div>
          </div>

          {/* Stat 2: Modules Mastered */}
          <div className="bg-slate-950/70 border border-slate-800/90 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Modules Mastered</span>
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-extrabold text-cyan-300 tracking-tight">
                {masteredCount}
              </span>
              <span className="text-xs text-slate-400">of {totalModules} Completed</span>
            </div>
            <div className="text-xs text-slate-400 flex items-center justify-between">
              <span>{inProgressCount} in progress</span>
              <span>{totalModules - masteredCount - inProgressCount} locked</span>
            </div>
          </div>

          {/* Stat 3: Drills Completed */}
          <div className="bg-slate-950/70 border border-slate-800/90 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Drills Practiced</span>
              <Code2 className="w-4 h-4 text-purple-400" />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-extrabold text-purple-300 tracking-tight">
                {totalCompletedDrills}
              </span>
              <span className="text-xs text-slate-400">of {totalCurriculumDrills} Exercises</span>
            </div>
            <div className="text-xs text-slate-400">
              {Math.round((totalCompletedDrills / Math.max(1, totalCurriculumDrills)) * 100)}% exercises resolved
            </div>
          </div>

          {/* Stat 4: Next Target */}
          <div className="bg-slate-950/70 border border-slate-800/90 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Current Focus</span>
              <Target className="w-4 h-4 text-amber-400" />
            </div>
            <div className="truncate">
              <span className="text-lg font-bold text-slate-100 block truncate">
                {modules.find((m) => progress.moduleStatus[m.id] === 'in-progress')?.stage ||
                  'Capstone Architect'}
              </span>
              <span className="text-xs text-slate-400">
                Next: Rule 14 No-Notes Checkpoint
              </span>
            </div>
            <div className="text-xs text-cyan-400 font-medium flex items-center gap-1">
              <span>Ubuntu 24.04 Target</span>
            </div>
          </div>
        </div>

        {/* Independent POM Mentor Gym Quick Access */}
        <div className="mt-5 p-4 rounded-xl bg-gradient-to-r from-indigo-950/60 via-slate-950 to-slate-900 border border-indigo-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 shrink-0">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="text-sm font-bold text-white">Independent POM Practice Mentor</h4>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                  Anytime • No Course Blockers
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                7 levels of focused Page Object Model drills, locator quality reviews, and beginner-to-senior test architecture.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('pom-mentor')}
            className="self-start sm:self-auto px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow cursor-pointer flex items-center space-x-1.5 shrink-0"
          >
            <span>Open POM Mentor Gym</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Recharts Bar Chart: Mastery Percentage per Module */}
      <section className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 backdrop-blur shadow-lg space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <Award className="w-5 h-5 text-cyan-400" />
              <span>Module Mastery Percentage Visualizer</span>
            </h3>
            <p className="text-xs text-slate-400">
              Calculated mastery proficiency (0–100%) across the curriculum. Click any bar to inspect that module.
            </p>
          </div>

          {/* View Toggle */}
          <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs self-start sm:self-auto">
            <button
              onClick={() => setMetricView('mastery')}
              className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                metricView === 'mastery'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Mastery %
            </button>
            <button
              onClick={() => setMetricView('drills')}
              className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                metricView === 'drills'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Drills Count
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1">
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded bg-emerald-500 inline-block" />
            <span>Mastered (100%)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded bg-cyan-500 inline-block" />
            <span>In Progress (25–85%)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded bg-amber-500 inline-block" />
            <span>Needs Revisit (50%)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded bg-slate-700 inline-block" />
            <span>Locked (0%)</span>
          </div>
        </div>

        {/* Recharts Container */}
        <div className="w-full min-h-[340px] pt-4">
          <ResponsiveContainer width="100%" height={340}>
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 20, left: 0, bottom: 25 }}
              onClick={(state: any) => {
                if (state && state.activePayload && state.activePayload.length) {
                  handleBarClick(state.activePayload[0].payload);
                }
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis
                dataKey="name"
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                interval={0}
                angle={-15}
                textAnchor="end"
                height={50}
              />
              <YAxis
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                domain={[0, 100]}
                unit={metricView === 'mastery' ? '%' : ''}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(51, 65, 85, 0.3)' }} />
              {metricView === 'mastery' && (
                <ReferenceLine
                  y={100}
                  stroke="#10b981"
                  strokeDasharray="4 4"
                  label={{
                    value: '100% Mastery Gate',
                    position: 'top',
                    fill: '#10b981',
                    fontSize: 10,
                  }}
                />
              )}
              <Bar
                dataKey={metricView === 'mastery' ? 'masteryPct' : 'completedDrills'}
                radius={[6, 6, 0, 0]}
                className="cursor-pointer transition-all duration-300"
              >
                {chartData.map((entry) => (
                  <Cell
                    key={`cell-${entry.id}`}
                    fill={getStatusColor(entry.status)}
                    stroke={selectedBarModuleId === entry.id ? '#ffffff' : 'transparent'}
                    strokeWidth={selectedBarModuleId === entry.id ? 2 : 0}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Badges System Section */}
      <section id="student-badges-system" className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 backdrop-blur shadow-lg space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center space-x-2.5">
              <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Curriculum Mastery Badges</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-950/80 text-amber-300 border border-amber-800/80">
                  {unlockedBadgesCount} / {badges.length} Unlocked
                </span>
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Honors and certifications unlocked when specific mastery thresholds, rigorous code drills, or checkpoint criteria are fulfilled.
            </p>
          </div>

          {/* Badges Filter Controls */}
          <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs self-start sm:self-auto">
            <button
              onClick={() => setBadgeFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                badgeFilter === 'all'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All ({badges.length})
            </button>
            <button
              onClick={() => setBadgeFilter('unlocked')}
              className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                badgeFilter === 'unlocked'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Unlocked ({unlockedBadgesCount})
            </button>
            <button
              onClick={() => setBadgeFilter('locked')}
              className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                badgeFilter === 'locked'
                  ? 'bg-slate-700 text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Locked ({badges.length - unlockedBadgesCount})
            </button>
          </div>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredBadges.map((badge) => {
            const Icon = badge.icon;
            return (
              <div
                key={badge.id}
                className={`relative rounded-xl p-4 border transition-all duration-300 flex flex-col justify-between space-y-3 ${
                  badge.unlocked
                    ? `bg-gradient-to-b ${badge.colorClasses.bg} ${badge.colorClasses.border} shadow-lg shadow-black/40`
                    : 'bg-slate-950/50 border-slate-800/80 text-slate-400 opacity-75 hover:opacity-100 hover:border-slate-700'
                }`}
              >
                {/* Badge Card Header */}
                <div className="flex items-start justify-between gap-2">
                  <div
                    className={`p-2.5 rounded-xl border transition-transform ${
                      badge.unlocked
                        ? `${badge.colorClasses.iconBg} shadow-sm`
                        : 'bg-slate-900 border-slate-800 text-slate-500'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      {badge.category}
                    </span>
                    {badge.unlocked ? (
                      <span className="inline-flex items-center space-x-1 text-[11px] font-semibold text-emerald-300 bg-emerald-950/90 px-2 py-0.5 rounded-full border border-emerald-700/80">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>Unlocked</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 text-[10px] font-medium text-slate-400 bg-slate-900/90 px-2 py-0.5 rounded-full border border-slate-800">
                        <Lock className="w-3 h-3 text-slate-500" />
                        <span>{badge.progressText}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Badge Title & Description */}
                <div className="space-y-1">
                  <h4
                    className={`text-sm font-bold tracking-tight ${
                      badge.unlocked ? 'text-white' : 'text-slate-300'
                    }`}
                  >
                    {badge.title}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {badge.description}
                  </p>
                </div>

                {/* Requirement & Action Footer */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                  <div className="text-slate-400 truncate pr-1">
                    <span className="text-slate-500">Req: </span>
                    <span className={badge.unlocked ? 'text-slate-300 font-medium' : 'text-slate-400'}>
                      {badge.requirement}
                    </span>
                  </div>

                  {badge.moduleId && (
                    <button
                      onClick={() => {
                        onSelectModule(badge.moduleId!);
                        onNavigateTab('canvas');
                      }}
                      className="text-cyan-400 hover:text-cyan-300 font-semibold shrink-0 flex items-center gap-1 transition cursor-pointer"
                    >
                      <span>Go</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Chronological Learning Journey Timeline */}
      <section className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 backdrop-blur shadow-lg space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <Clock className="w-5 h-5 text-cyan-400" />
              <span>Chronological Modules Milestone Timeline</span>
            </h3>
            <p className="text-xs text-slate-400">
              Detailed breakdown of prerequisites, core skills acquired, and Rule 14 checkpoint validation across each roadmap stage.
            </p>
          </div>
        </div>

        {/* Timeline Stack */}
        <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-cyan-500 before:via-emerald-500/50 before:to-slate-800">
          {modules.map((mod, idx) => {
            const status = progress.moduleStatus[mod.id] || 'locked';
            const badge = getStatusBadge(status);
            const BadgeIcon = badge.icon;
            const isCompleted = status === 'mastered';
            const isInProgress = status === 'in-progress';
            const totalDrills = mod.drills.length;
            const completedDrills = mod.drills.filter((d) =>
              progress.completedDrillIds.includes(d.id)
            ).length;

            return (
              <div key={mod.id} className="relative group">
                {/* Timeline node icon */}
                <div
                  className={`absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs font-bold transition-transform group-hover:scale-110 shadow-lg ${
                    isCompleted
                      ? 'bg-emerald-500 text-slate-950 ring-4 ring-emerald-950'
                      : isInProgress
                      ? 'bg-cyan-500 text-slate-950 ring-4 ring-cyan-950 animate-pulse'
                      : status === 'needs-revisit'
                      ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-950'
                      : 'bg-slate-800 text-slate-500 ring-4 ring-slate-950 border border-slate-700'
                  }`}
                >
                  {isCompleted ? '✓' : idx + 1}
                </div>

                {/* Card Container */}
                <div
                  className={`p-5 rounded-xl border transition-all ${
                    isInProgress
                      ? 'bg-slate-950/80 border-cyan-500/40 shadow-md shadow-cyan-950/20'
                      : isCompleted
                      ? 'bg-slate-950/60 border-slate-800 hover:border-emerald-700/50'
                      : 'bg-slate-950/40 border-slate-800/80 opacity-85'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-800/60">
                          Stage {idx + 1}: {mod.stage}
                        </span>
                        <span
                          className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${badge.bg}`}
                        >
                          <BadgeIcon className="w-3 h-3" />
                          <span>{badge.label}</span>
                        </span>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Compass className="w-3.5 h-3.5 text-slate-500" />
                          <span>App: {mod.targetApp}</span>
                        </span>
                      </div>

                      <h4 className="text-base font-bold text-white tracking-tight">
                        {mod.title}
                      </h4>
                      <p className="text-xs text-slate-400 max-w-3xl">
                        {mod.subtitle}
                      </p>
                    </div>

                    {/* Action buttons & drill progress */}
                    <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
                      <div className="text-right pr-2 hidden sm:block">
                        <div className="text-xs font-semibold text-slate-300">
                          {completedDrills} / {totalDrills} Drills
                        </div>
                        <div className="text-[10px] text-slate-400">{mod.estimatedTime}</div>
                      </div>

                      <button
                        onClick={() => {
                          onSelectModule(mod.id);
                          onNavigateTab('canvas');
                        }}
                        className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition cursor-pointer"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Textbook</span>
                      </button>

                      <button
                        onClick={() => {
                          onSelectModule(mod.id);
                          onNavigateTab('drills');
                        }}
                        className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition shadow-sm cursor-pointer"
                      >
                        <Code2 className="w-3.5 h-3.5" />
                        <span>Drill Lab</span>
                      </button>

                      <button
                        onClick={() => setExpandedModuleId(expandedModuleId === mod.id ? null : mod.id)}
                        className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer ${
                          expandedModuleId === mod.id
                            ? 'bg-slate-800 text-cyan-300 border-cyan-800/80'
                            : 'bg-slate-900/90 text-slate-300 hover:text-slate-100 border-slate-700/80 hover:bg-slate-800'
                        }`}
                        title="Review saved code solutions and Explain-It conceptual defenses"
                      >
                        <MessageSquareQuote className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Defenses ({completedDrills})</span>
                        {expandedModuleId === mod.id ? (
                          <ChevronUp className="w-3 h-3 ml-0.5" />
                        ) : (
                          <ChevronDown className="w-3 h-3 ml-0.5" />
                        )}
                      </button>

                      {mod.id === 'pom' && onRestorePomSubmissions && (
                        <button
                          onClick={onRestorePomSubmissions}
                          className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 border border-indigo-700/60 transition cursor-pointer"
                          title="Ensure all POM module drills & defenses are restored and saved"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                          <span>Restore & Save POM</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Skills tags & Rule 14 Checkpoint banner */}
                  <div className="mt-4 pt-3.5 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-slate-400 font-medium mr-1">Core Competencies:</span>
                      {mod.theorySections.slice(0, 3).map((sec, sIdx) => (
                        <span
                          key={sIdx}
                          className="bg-slate-900 text-slate-300 px-2 py-0.5 rounded border border-slate-800 text-[11px]"
                        >
                          {sec.title}
                        </span>
                      ))}
                    </div>

                    {/* Rule 14 Checkpoint badge */}
                    <div className="flex items-center space-x-1.5 text-slate-400 text-[11px] bg-slate-900/90 px-2.5 py-1 rounded-lg border border-slate-800">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Rule 14 Checkpoint:</span>
                      <span className="text-slate-200 font-medium truncate max-w-[200px]">
                        {mod.checkpointScenario.title}
                      </span>
                    </div>
                  </div>

                  {/* Collapsible Drills & Explain-It Defenses Portfolio Drawer */}
                  {expandedModuleId === mod.id && (
                    <div className="mt-4 pt-4 border-t border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <h5 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                          <MessageSquareQuote className="w-4 h-4 text-cyan-400" />
                          <span>Drills & Conceptual Defenses Portfolio</span>
                        </h5>
                        <span className="text-[11px] text-slate-400">
                          {completedDrills} of {totalDrills} saved
                        </span>
                      </div>

                      <div className="space-y-2.5">
                        {mod.drills.map((drill) => {
                          const isDrillPassed = progress.completedDrillIds.includes(drill.id);
                          const saved = progress.savedSolutions?.[drill.id];

                          return (
                            <div
                              key={drill.id}
                              className={`p-3.5 rounded-xl border text-xs space-y-2 transition ${
                                isDrillPassed
                                  ? 'bg-slate-900/90 border-slate-800 hover:border-emerald-700/60'
                                  : 'bg-slate-950/60 border-slate-800/60 opacity-70'
                              }`}
                            >
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <div className="flex items-center space-x-2">
                                  <span className={`w-2 h-2 rounded-full ${isDrillPassed ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                                  <span className="font-semibold text-slate-200">
                                    {drill.drillNumber}: {drill.title}
                                  </span>
                                  {drill.isMasteryGate && (
                                    <span className="text-[10px] text-amber-400 bg-amber-950/60 border border-amber-800/60 px-1.5 py-0.5 rounded font-bold">
                                      Mastery Gate
                                    </span>
                                  )}
                                </div>

                                <div className="flex items-center space-x-2">
                                  {isDrillPassed ? (
                                    <span className="inline-flex items-center space-x-1 text-emerald-400 text-[11px] font-medium bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
                                      <CheckCircle2 className="w-3 h-3" />
                                      <span>Passed</span>
                                    </span>
                                  ) : (
                                    <span className="text-slate-500 text-[11px]">Pending</span>
                                  )}

                                  <button
                                    onClick={() => {
                                      onSelectModule(mod.id);
                                      onNavigateTab('drills');
                                    }}
                                    className="text-cyan-400 hover:text-cyan-300 text-[11px] hover:underline cursor-pointer"
                                  >
                                    Open in Lab →
                                  </button>
                                </div>
                              </div>

                              {/* Saved Conceptual Defense */}
                              {(() => {
                                const exp = saved?.explanation?.trim() || (isDrillPassed ? getApprovedDrillExplanation(drill.id) : '');
                                if (exp) {
                                  return (
                                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/90 text-slate-300 space-y-1">
                                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                                        <span className="flex items-center space-x-1 text-cyan-400">
                                          <MessageSquareQuote className="w-3 h-3" />
                                          <span>Explain-It Defense</span>
                                        </span>
                                        {saved?.passedAt && (
                                          <span className="text-slate-500 font-normal">
                                            {new Date(saved.passedAt).toLocaleDateString()}
                                          </span>
                                        )}
                                      </div>
                                      <p className="text-xs text-slate-200 leading-relaxed font-sans italic">
                                        "{exp}"
                                      </p>
                                    </div>
                                  );
                                }
                                return null;
                              })()}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer Mentorship Note */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-400 flex items-start space-x-3">
        <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-semibold text-slate-200">
            Automated Mastery Gate Progression (Rule 6 & Rule 14)
          </span>
          <p className="leading-relaxed">
            Progress is strictly gated: each stage unlocks only when all previous drills pass without syntax crutches and you successfully pass the plain-language No-Notes Checkpoint. If you fail an exercise three times, the 24-hour spaced repetition escape valve unlocks to review foundational concepts without stalling momentum.
          </p>
        </div>
      </div>
    </div>
  );
}
