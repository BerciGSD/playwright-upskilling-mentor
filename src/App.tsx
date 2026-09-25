import { useState, useEffect } from 'react';
import { MODULES_DATA } from './data/curriculumData';
import { getApprovedDrillExplanation } from './data/drillExplanations';
import { Header } from './components/Header';
import { RoadmapNav } from './components/RoadmapNav';
import { CanvasLesson } from './components/CanvasLesson';
import { InteractiveDrillLab } from './components/InteractiveDrillLab';
import { CumulativeProjectExplorer } from './components/CumulativeProjectExplorer';
import { TargetAppSandbox } from './components/TargetAppSandbox';
import { UbuntuTerminalCompanion } from './components/UbuntuTerminalCompanion';
import { StudentDashboard } from './components/StudentDashboard';
import { RuleGuideModal } from './components/RuleGuideModal';
import { PomMentorArena } from './components/PomMentorArena';
import { StudentProgress, SavedDrillSolution } from './types';
import { 
  BookOpen, 
  HelpCircle, 
  CheckCircle2, 
  Sparkles, 
  FileText, 
  Terminal,
  ShieldAlert
} from 'lucide-react';

const STORAGE_KEY = 'playwright_student_progress_v2';

// Detect and eliminate placeholder/boilerplate explanations so only real student answers are saved
export function isBoilerplateExplanation(text?: string): boolean {
  if (!text) return true;
  const t = text.trim();
  return (
    t === '' ||
    t === 'Verified solution utilizing idiomatic Playwright TypeScript patterns.' ||
    t === 'Adheres strictly to modern Playwright conventions: avoids arbitrary timeouts, relies on auto-waiting locators, and uses web-first assertions.' ||
    t.startsWith('Verified solution utilizing idiomatic') ||
    t.startsWith('Adheres strictly to modern Playwright')
  );
}

function getInitialProgress(): StudentProgress {
  // Pre-completed drills for modules 1-5 (including all 6 POM drills: 5.1 through 5.6)
  const initialCompletedDrills = [
    ...MODULES_DATA.slice(0, 5).flatMap((m) => m.drills.map((d) => d.id)),
  ];

  // Pre-populate approved solutions for all completed drills with specific, authentic defenses
  const defaultSavedSolutions: Record<string, SavedDrillSolution> = {};
  MODULES_DATA.forEach((mod) => {
    mod.drills.forEach((drill) => {
      if (initialCompletedDrills.includes(drill.id)) {
        defaultSavedSolutions[drill.id] = {
          code: drill.validation.solutionCode,
          explanation: getApprovedDrillExplanation(drill.id),
          passedAt: new Date(Date.now() - 3600000).toISOString(),
          isMasteryGate: drill.isMasteryGate,
        };
      }
    });
  });

  const defaultProgress: StudentProgress = {
    currentModuleId: 'pom',
    completedDrillIds: initialCompletedDrills,
    savedSolutions: defaultSavedSolutions,
    draftSolutions: {},
    moduleStatus: {
      setup: 'mastered',
      basics: 'mastered',
      assertions: 'mastered',
      debugging: 'mastered',
      pom: 'mastered',
      fixtures: 'in-progress',
      api: 'locked',
      cicd: 'locked',
      capstone: 'locked',
    },
    drillAttempts: {},
    currentHintTier: {},
    penaltyCount: {},
    spacedReviewQueue: [],
  };

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.completedDrillIds)) {
        // Ensure all POM drills are restored and completed alongside any existing progress
        const combinedCompleted = Array.from(
          new Set([...initialCompletedDrills, ...parsed.completedDrillIds])
        );

        const mergedSavedSolutions: Record<string, SavedDrillSolution> = {
          ...defaultSavedSolutions,
        };
        if (parsed.savedSolutions) {
          Object.keys(parsed.savedSolutions).forEach((drillId) => {
            const item = parsed.savedSolutions[drillId];
            const rawExp = item?.explanation || '';
            const cleanedExp = isBoilerplateExplanation(rawExp) 
              ? getApprovedDrillExplanation(drillId) 
              : rawExp;

            mergedSavedSolutions[drillId] = {
              ...defaultSavedSolutions[drillId],
              ...item,
              explanation: cleanedExp,
            };
          });
        }

        // Ensure all completed drills have a saved solution and valid defense
        combinedCompleted.forEach((drillId: string) => {
          if (!mergedSavedSolutions[drillId]) {
            const drillObj = MODULES_DATA.flatMap((m) => m.drills).find((d) => d.id === drillId);
            if (drillObj) {
              mergedSavedSolutions[drillId] = {
                code: drillObj.validation.solutionCode,
                explanation: getApprovedDrillExplanation(drillId),
                passedAt: new Date().toISOString(),
                isMasteryGate: drillObj.isMasteryGate,
              };
            }
          } else if (!mergedSavedSolutions[drillId].explanation || isBoilerplateExplanation(mergedSavedSolutions[drillId].explanation)) {
            mergedSavedSolutions[drillId].explanation = getApprovedDrillExplanation(drillId);
          }
        });

        const cleanedDrafts: Record<string, { code: string; explanation?: string }> = {};
        if (parsed.draftSolutions) {
          Object.keys(parsed.draftSolutions).forEach((drillId) => {
            const draft = parsed.draftSolutions[drillId];
            if (draft) {
              const rawExp = draft.explanation || '';
              cleanedDrafts[drillId] = {
                code: draft.code,
                explanation: isBoilerplateExplanation(rawExp) ? '' : rawExp,
              };
            }
          });
        }

        const mergedModuleStatus = {
          ...defaultProgress.moduleStatus,
          ...(parsed.moduleStatus || {}),
          pom: 'mastered', // POM submissions restored and mastered
        };

        if (mergedModuleStatus.fixtures === 'locked') {
          mergedModuleStatus.fixtures = 'in-progress';
        }

        return {
          ...defaultProgress,
          ...parsed,
          completedDrillIds: combinedCompleted,
          savedSolutions: mergedSavedSolutions,
          draftSolutions: cleanedDrafts,
          moduleStatus: mergedModuleStatus,
        };
      }
    }
  } catch (err) {
    console.warn('Could not read saved progress from localStorage:', err);
  }

  return defaultProgress;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'canvas' | 'drills' | 'project' | 'sandbox' | 'terminal' | 'dashboard' | 'pom-mentor'>('pom-mentor');
  const [currentModuleId, setCurrentModuleId] = useState<string>('pom');
  const [isRuleModalOpen, setIsRuleModalOpen] = useState<boolean>(false);
  const [checkpointModalModuleId, setCheckpointModalModuleId] = useState<string | null>(null);

  const [progress, setProgress] = useState<StudentProgress>(getInitialProgress);

  // Sync progress to localStorage on any state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (err) {
      console.warn('Could not persist progress to localStorage:', err);
    }
  }, [progress]);

  const currentModule = MODULES_DATA.find((m) => m.id === currentModuleId) || MODULES_DATA[0];

  const masteredModulesCount = Object.values(progress.moduleStatus).filter(
    (s) => s === 'mastered'
  ).length;

  const handleDrillCompleted = (
    drillId: string, 
    isMasteryGatePassed: boolean,
    solution?: { code: string; explanation?: string }
  ) => {
    setProgress((prev) => {
      const newCompleted = prev.completedDrillIds.includes(drillId)
        ? prev.completedDrillIds
        : [...prev.completedDrillIds, drillId];

      const exp = solution?.explanation?.trim()
        ? solution.explanation
        : (prev.savedSolutions?.[drillId]?.explanation || getApprovedDrillExplanation(drillId));

      const newSavedSolutions = {
        ...prev.savedSolutions,
        [drillId]: {
          code: solution?.code ?? prev.savedSolutions?.[drillId]?.code ?? '',
          explanation: exp,
          passedAt: new Date().toISOString(),
          isMasteryGate: isMasteryGatePassed,
        },
      };

      const newDrafts = { ...prev.draftSolutions };
      delete newDrafts[drillId];

      return {
        ...prev,
        completedDrillIds: newCompleted,
        savedSolutions: newSavedSolutions,
        draftSolutions: newDrafts,
      };
    });
  };

  const handleSaveDraft = (drillId: string, code: string, explanation?: string) => {
    setProgress((prev) => ({
      ...prev,
      draftSolutions: {
        ...prev.draftSolutions,
        [drillId]: { code, explanation },
      },
    }));
  };

  const handleSaveExplanation = (drillId: string, explanation: string) => {
    setProgress((prev) => {
      const existing = prev.savedSolutions?.[drillId];
      if (existing) {
        return {
          ...prev,
          savedSolutions: {
            ...prev.savedSolutions,
            [drillId]: {
              ...existing,
              explanation,
            },
          },
        };
      }
      return {
        ...prev,
        draftSolutions: {
          ...prev.draftSolutions,
          [drillId]: {
            code: prev.draftSolutions?.[drillId]?.code || '',
            explanation,
          },
        },
      };
    });
  };

  const handleModuleMastered = (moduleId: string, status: 'mastered' | 'needs-revisit') => {
    setProgress((prev) => {
      const currentIdx = MODULES_DATA.findIndex((m) => m.id === moduleId);
      const nextModule = MODULES_DATA[currentIdx + 1];

      const newModuleStatus = { ...prev.moduleStatus };
      newModuleStatus[moduleId] = status;

      if (nextModule && newModuleStatus[nextModule.id] === 'locked') {
        newModuleStatus[nextModule.id] = 'in-progress';
      }

      return {
        ...prev,
        moduleStatus: newModuleStatus,
      };
    });

    // Open Checkpoint modal to test No-Notes Checkpoint (Rule 14)
    setCheckpointModalModuleId(moduleId);
  };

  const handleUpdateModuleStatus = (
    moduleId: string,
    status: 'locked' | 'in-progress' | 'mastered' | 'needs-revisit'
  ) => {
    setProgress((prev) => ({
      ...prev,
      moduleStatus: {
        ...prev.moduleStatus,
        [moduleId]: status,
      },
    }));
  };

  const handleMarkAllUpTo = (targetModuleId: string) => {
    const targetIdx = MODULES_DATA.findIndex((m) => m.id === targetModuleId);
    if (targetIdx === -1) return;

    const newStatus: Record<string, 'locked' | 'in-progress' | 'mastered' | 'needs-revisit'> = {};
    const newDrillIds: string[] = [];

    MODULES_DATA.forEach((mod, idx) => {
      if (idx <= targetIdx) {
        newStatus[mod.id] = 'mastered';
        mod.drills.forEach((d) => newDrillIds.push(d.id));
      } else if (idx === targetIdx + 1) {
        newStatus[mod.id] = 'in-progress';
      } else {
        newStatus[mod.id] = 'locked';
      }
    });

    setProgress((prev) => ({
      ...prev,
      moduleStatus: newStatus,
      completedDrillIds: Array.from(new Set([...prev.completedDrillIds, ...newDrillIds])),
    }));
  };

  const handleRestorePomSubmissions = () => {
    const pomModule = MODULES_DATA.find((m) => m.id === 'pom');
    if (!pomModule) return;

    const pomDrillIds = pomModule.drills.map((d) => d.id);
    const restoredSolutions: Record<string, SavedDrillSolution> = {};

    pomModule.drills.forEach((drill) => {
      restoredSolutions[drill.id] = {
        code: drill.validation.solutionCode,
        explanation: getApprovedDrillExplanation(drill.id),
        passedAt: new Date().toISOString(),
        isMasteryGate: drill.isMasteryGate,
      };
    });

    setProgress((prev) => {
      const updatedSolutions = {
        ...prev.savedSolutions,
        ...restoredSolutions,
      };
      const updatedCompleted = Array.from(
        new Set([...prev.completedDrillIds, ...pomDrillIds])
      );
      const updatedStatus: Record<string, 'locked' | 'in-progress' | 'mastered' | 'needs-revisit'> = {
        ...prev.moduleStatus,
        pom: 'mastered',
      };
      if (updatedStatus.fixtures === 'locked') {
        updatedStatus.fixtures = 'in-progress';
      }

      return {
        ...prev,
        completedDrillIds: updatedCompleted,
        savedSolutions: updatedSolutions,
        moduleStatus: updatedStatus,
      };
    });
  };

  const handleSelectModule = (modId: string) => {
    setCurrentModuleId(modId);
  };

  const activeCheckpointModule = MODULES_DATA.find((m) => m.id === checkpointModalModuleId);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Primary Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentStage={currentModule.stage}
        masteredModulesCount={masteredModulesCount}
        totalModulesCount={MODULES_DATA.length}
      />

      {/* Roadmap Progression Bar */}
      <RoadmapNav
        modules={MODULES_DATA}
        currentModuleId={currentModuleId}
        onSelectModule={handleSelectModule}
        moduleStatus={progress.moduleStatus}
      />

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {activeTab === 'dashboard' && (
          <StudentDashboard
            modules={MODULES_DATA}
            progress={progress}
            onSelectModule={handleSelectModule}
            onNavigateTab={setActiveTab}
            onUpdateModuleStatus={handleUpdateModuleStatus}
            onMarkAllUpTo={handleMarkAllUpTo}
            onRestorePomSubmissions={handleRestorePomSubmissions}
          />
        )}

        {activeTab === 'pom-mentor' && <PomMentorArena />}

        {activeTab === 'canvas' && (
          <CanvasLesson
            module={currentModule}
            onGoToDrills={() => setActiveTab('drills')}
          />
        )}

        {activeTab === 'drills' && (
          <InteractiveDrillLab
            module={currentModule}
            progress={progress}
            onDrillCompleted={handleDrillCompleted}
            onModuleMastered={handleModuleMastered}
            onSaveDraft={handleSaveDraft}
            onSaveExplanation={handleSaveExplanation}
          />
        )}

        {activeTab === 'project' && <CumulativeProjectExplorer />}

        {activeTab === 'sandbox' && <TargetAppSandbox />}

        {activeTab === 'terminal' && <UbuntuTerminalCompanion />}
      </main>

      {/* Floating Rules / Help Button */}
      <aside aria-label="Floating Help" className="fixed bottom-4 right-4 z-30">
        <button
          id="rules-guide-fab"
          onClick={() => setIsRuleModalOpen(true)}
          className="flex items-center space-x-2 bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-700/80 px-3.5 py-2 rounded-full shadow-lg text-xs font-medium backdrop-blur transition cursor-pointer"
        >
          <HelpCircle className="w-4 h-4 text-cyan-400" />
          <span>Mentorship Rules (1–15)</span>
        </button>
      </aside>

      {/* Rule Guide Modal */}
      <RuleGuideModal
        isOpen={isRuleModalOpen}
        onClose={() => setIsRuleModalOpen(false)}
      />

      {/* Rule 14: End-of-Module No-Notes Checkpoint Modal */}
      {checkpointModalModuleId && activeCheckpointModule && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-cyan-800/80 rounded-2xl max-w-xl w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center space-x-2 text-cyan-400">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              <h3 className="text-lg font-bold text-white">
                {activeCheckpointModule.checkpointScenario.title}
              </h3>
            </div>

            <div className="space-y-2 text-sm text-slate-300 bg-slate-950 p-4 rounded-xl border border-slate-800 leading-relaxed">
              <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Rule 14: Plain-Language Scenario (No Notes Visible)
              </div>
              <p>{activeCheckpointModule.checkpointScenario.scenario}</p>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-400">Success Criteria Checklist:</span>
              <ul className="space-y-1 text-xs text-slate-300">
                {activeCheckpointModule.checkpointScenario.successCriteria.map((crit, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>{crit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2 flex justify-end space-x-3">
              <button
                onClick={() => setCheckpointModalModuleId(null)}
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-5 py-2 rounded-lg text-xs cursor-pointer"
              >
                Checkpoint Confirmed — Continue Roadmap
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
