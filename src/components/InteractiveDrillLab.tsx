import { useState, useEffect, useRef } from 'react';
import { ModuleData, Drill, StudentProgress } from '../types';
import { getApprovedDrillExplanation } from '../data/drillExplanations';
import { 
  Play, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  RotateCcw, 
  Lightbulb, 
  ChevronRight, 
  Send,
  Award,
  BookOpen,
  Check,
  Layers,
  Sparkles,
  FileCheck2,
  Undo2,
  Save,
  MessageSquareQuote
} from 'lucide-react';
import { POMQuickReference } from './POMQuickReference';
import { POMTemplateGeneratorModal } from './POMTemplateGeneratorModal';
import { CodeEditor } from './CodeEditor';

interface InteractiveDrillLabProps {
  module: ModuleData;
  progress: StudentProgress;
  onDrillCompleted: (
    drillId: string, 
    isMasteryGatePassed: boolean, 
    solution?: { code: string; explanation?: string }
  ) => void;
  onModuleMastered: (moduleId: string, status: 'mastered' | 'needs-revisit') => void;
  onSaveDraft?: (drillId: string, code: string, explanation?: string) => void;
  onSaveExplanation?: (drillId: string, explanation: string) => void;
}

export function InteractiveDrillLab({
  module,
  progress,
  onDrillCompleted,
  onModuleMastered,
  onSaveDraft,
  onSaveExplanation,
}: InteractiveDrillLabProps) {
  const [isPOMRefOpen, setIsPOMRefOpen] = useState<boolean>(module.id === 'pom');
  const [isGeneratorOpen, setIsGeneratorOpen] = useState<boolean>(false);
  const firstUncompletedIndex = module.drills.findIndex(
    (d) => !progress.completedDrillIds.includes(d.id)
  );
  const [activeDrillIndex, setActiveDrillIndex] = useState(
    firstUncompletedIndex !== -1 ? firstUncompletedIndex : 0
  );

  // Sync active drill when switching modules
  useEffect(() => {
    const uncompletedIdx = module.drills.findIndex(
      (d) => !progress.completedDrillIds.includes(d.id)
    );
    setActiveDrillIndex(uncompletedIdx !== -1 ? uncompletedIdx : 0);
  }, [module.id]);

  const currentDrill = module.drills[activeDrillIndex] || module.drills[0];

  const savedSolution = progress.savedSolutions?.[currentDrill.id];
  const draftSolution = progress.draftSolutions?.[currentDrill.id];
  const isCompleted = progress.completedDrillIds.includes(currentDrill.id);
  const isApproved = Boolean(savedSolution || isCompleted);
  const approvedExplanation = (savedSolution?.explanation && savedSolution.explanation.trim().length > 0)
    ? savedSolution.explanation
    : (isApproved ? getApprovedDrillExplanation(currentDrill.id) : '');

  const [userCode, setUserCode] = useState<string>(
    savedSolution?.code || (isCompleted ? currentDrill.validation.solutionCode : draftSolution?.code) || currentDrill.starterCode || ''
  );
  const [userExplanation, setUserExplanation] = useState<string>(
    approvedExplanation || draftSolution?.explanation || ''
  );
  
  // Feedback state
  const [feedback, setFeedback] = useState<{
    status: 'idle' | 'success' | 'error' | 'cleanliness-warning';
    title: string;
    message: string;
    details?: string[];
  }>({ status: 'idle', title: '', message: '' });

  // Hint Tier state (0 = locked, 1 = concept, 2 = partial, 3 = solution)
  const [hintTier, setHintTier] = useState<number>(0);

  // Attempt count for this specific drill in current session
  const [attemptCount, setAttemptCount] = useState<number>(0);
  const [isExplanationSavedRecently, setIsExplanationSavedRecently] = useState<boolean>(false);
  const prevDrillIdRef = useRef<string>('');

  // Sync userCode & explanation ONLY when switching to a different drill
  useEffect(() => {
    if (prevDrillIdRef.current === currentDrill.id) {
      return;
    }
    prevDrillIdRef.current = currentDrill.id;

    const isComp = progress.completedDrillIds.includes(currentDrill.id);
    const saved = progress.savedSolutions?.[currentDrill.id];
    const draft = progress.draftSolutions?.[currentDrill.id];

    if (saved) {
      setUserCode(saved.code);
      const effectiveExp = (saved.explanation && saved.explanation.trim().length > 0)
        ? saved.explanation
        : getApprovedDrillExplanation(currentDrill.id);
      setUserExplanation(effectiveExp);
      setFeedback({
        status: 'success',
        title: currentDrill.isMasteryGate ? 'Mastery Gate Passed' : 'Approved Solution Loaded',
        message: 'Your saved approved solution and explanation are displayed below.',
        details: [
          saved.passedAt
            ? `Passed on ${new Date(saved.passedAt).toLocaleDateString()} at ${new Date(saved.passedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
            : 'Verified solution by Playwright mentor rules.',
          'You can modify code or defense anytime, or click "Reset to Starter" to re-drill.',
        ],
      });
    } else if (isComp) {
      const code = currentDrill.validation.solutionCode;
      const exp = getApprovedDrillExplanation(currentDrill.id);
      setUserCode(code);
      setUserExplanation(exp);
      setFeedback({
        status: 'success',
        title: currentDrill.isMasteryGate ? 'Mastery Gate Passed' : 'Approved Solution Loaded',
        message: 'Your saved approved solution and explanation are displayed below.',
        details: [
          'Verified solution by Playwright mentor rules.',
          'You can modify code or defense anytime, or click "Reset to Starter" to re-drill.',
        ],
      });
    } else if (draft) {
      setUserCode(draft.code);
      setUserExplanation(draft.explanation || '');
      setFeedback({ status: 'idle', title: '', message: '' });
    } else {
      setUserCode(currentDrill.starterCode || '');
      setUserExplanation('');
      setFeedback({ status: 'idle', title: '', message: '' });
    }
    setHintTier(progress.currentHintTier?.[currentDrill.id] || 0);
    setAttemptCount(progress.drillAttempts?.[currentDrill.id] || 0);
  }, [currentDrill.id]);

  const handleUnlockNextHint = () => {
    if (hintTier < 3) {
      setHintTier((prev) => prev + 1);
    }
  };

  const handleCodeChange = (newCode: string) => {
    setUserCode(newCode);
    onSaveDraft?.(currentDrill.id, newCode, userExplanation);
  };

  const handleExplanationChange = (newExplanation: string) => {
    setUserExplanation(newExplanation);
    onSaveDraft?.(currentDrill.id, userCode, newExplanation);
  };

  const handleSaveExplanationClick = () => {
    onSaveExplanation?.(currentDrill.id, userExplanation);
    setIsExplanationSavedRecently(true);
    setTimeout(() => setIsExplanationSavedRecently(false), 2000);
  };

  const handleRestoreApprovedExplanation = () => {
    const targetExp = (savedSolution?.explanation && savedSolution.explanation.trim().length > 0)
      ? savedSolution.explanation
      : getApprovedDrillExplanation(currentDrill.id);
    setUserExplanation(targetExp);
    onSaveDraft?.(currentDrill.id, userCode, targetExp);
    onSaveExplanation?.(currentDrill.id, targetExp);
    setIsExplanationSavedRecently(true);
    setTimeout(() => setIsExplanationSavedRecently(false), 2000);
  };

  const handleResetCode = () => {
    const starter = currentDrill.starterCode || '';
    setUserCode(starter);
    onSaveDraft?.(currentDrill.id, starter, userExplanation);
    setFeedback({ 
      status: 'idle', 
      title: 'Reset to Starter Code', 
      message: 'Starter template restored. You can practice solving this drill again.' 
    });
  };

  const handleRestoreApprovedSolution = () => {
    const code = savedSolution?.code || currentDrill.validation.solutionCode;
    const exp = (savedSolution?.explanation && savedSolution.explanation.trim().length > 0)
      ? savedSolution.explanation
      : getApprovedDrillExplanation(currentDrill.id);
    setUserCode(code);
    setUserExplanation(exp);
    onSaveDraft?.(currentDrill.id, code, exp);
    setFeedback({
      status: 'success',
      title: 'Approved Solution Restored',
      message: 'Your previously passed solution and explanation have been restored.',
    });
  };

  const handleValidateSubmission = () => {
    const newAttempt = attemptCount + 1;
    setAttemptCount(newAttempt);

    const code = userCode;
    const explanation = userExplanation.trim();
    const val = currentDrill.validation;
    const codeWithoutComments = code.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '');

    // RULE 4 & RULE 13: Strictly forbid waitForTimeout unless explicitly demonstrating it
    if (val.forbiddenKeywords) {
      for (const forbidden of val.forbiddenKeywords) {
        if (codeWithoutComments.includes(forbidden)) {
          setFeedback({
            status: 'error',
            title: 'Critical Rule Violation: Anti-Pattern Detected',
            message: `Your submission contains the strictly forbidden pattern "${forbidden}".`,
            details: [
              'Rule 4 & Rule 13 enforce modern craftsmanship: never use waitForTimeout().',
              'Playwright automatically waits for actionability (visible, stable, enabled).',
              'Rely on auto-waiting or web-first assertions like await expect(locator).toBeVisible().',
            ],
          });
          return;
        }
      }
    }

    // Check for required keywords
    const missingKeywords: string[] = [];
    if (val.requiredKeywords) {
      for (const req of val.requiredKeywords) {
        if (!code.includes(req)) {
          missingKeywords.push(req);
        }
      }
    }

    if (missingKeywords.length > 0) {
      setFeedback({
        status: 'error',
        title: 'Review Needed: Missing Expected Elements',
        message: 'Your script is missing key components needed for modern Playwright execution.',
        details: missingKeywords.map((k) => `Expected code to incorporate: "${k}"`),
      });
      return;
    }

    // RULE 11: Mastery Gate requires explanation in own words!
    if (currentDrill.isMasteryGate) {
      if (explanation.length < 15) {
        setFeedback({
          status: 'error',
          title: 'Mastery Gate Requirement: Explain-It Missing',
          message: 'Under Rule 11, a passing script alone does not count. You must explain in your own words why this solution works and adheres to best practices.',
          details: ['Please write at least 1-2 complete sentences in the explanation box below.'],
        });
        return;
      }

      // Check for explanation depth if expected keywords defined
      if (val.expectedExplanationKeywords && val.expectedExplanationKeywords.length > 0) {
        const hasExplanationKey = val.expectedExplanationKeywords.some((kw) =>
          explanation.toLowerCase().includes(kw.toLowerCase())
        );
        if (!hasExplanationKey) {
          setFeedback({
            status: 'cleanliness-warning',
            title: 'Explanation Needs Conceptual Depth',
            message: 'Your explanation is a start, but it needs to touch on the underlying architectural concept (e.g., performance overhead, auto-waiting, isolation, or accessibility).',
            details: [
              `Try mentioning why this pattern matters conceptually (${val.expectedExplanationKeywords.slice(0, 3).join(', ')}).`,
            ],
          });
          return;
        }
      }
    }

    // If it passed all checks!
    const isFirstTry = newAttempt === 1 && hintTier === 0;

    setFeedback({
      status: 'success',
      title: currentDrill.isMasteryGate ? 'Mastery Gate Passed!' : 'Drill Completed Successfully!',
      message: currentDrill.isMasteryGate
        ? 'Outstanding! You demonstrated both clean, idiomatic Playwright script execution and clear theoretical grasp.'
        : 'Spot on. Your code is clean, free of arbitrary waits, and utilizes web-first conventions.',
      details: [
        isFirstTry ? 'Achieved on the very first try with zero hints!' : `Completed after ${newAttempt} submission(s).`,
        'All assertions, locators, and TypeScript asynchronous patterns verified and saved.',
      ],
    });

    onDrillCompleted(
      currentDrill.id, 
      currentDrill.isMasteryGate || false,
      { code: userCode, explanation: userExplanation }
    );

    if (currentDrill.isMasteryGate) {
      onModuleMastered(module.id, 'mastered');
    }
  };

  const handleNextDrill = () => {
    if (activeDrillIndex < module.drills.length - 1) {
      setActiveDrillIndex((prev) => prev + 1);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      {/* Drills Header & Progress Tabs */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded text-xs font-semibold bg-cyan-950 text-cyan-300 border border-cyan-800">
                Rule 8 & 9: Retrieval Drills
              </span>
              <span className="text-xs text-slate-400">
                Drill {activeDrillIndex + 1} of {module.drills.length}
              </span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">{currentDrill.title}</h2>
          </div>

          <div className="flex items-center space-x-2 flex-wrap gap-y-2">
            {module.id === 'pom' && (
              <>
                <button
                  id="open-pom-generator-btn"
                  onClick={() => setIsGeneratorOpen(true)}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/80 transition-all cursor-pointer shadow-sm hover:shadow-emerald-900/30"
                  title="Open POM Template Generator"
                >
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>POM Generator</span>
                </button>

                <button
                  id="toggle-pom-quick-reference-btn"
                  onClick={() => setIsPOMRefOpen(!isPOMRefOpen)}
                  className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
                    isPOMRefOpen
                      ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/20'
                      : 'bg-cyan-950/70 hover:bg-cyan-900/80 text-cyan-300 border-cyan-800/80'
                  }`}
                  title="Toggle POM Quick Reference Panel"
                >
                  <Layers className="w-4 h-4" />
                  <span>POM Reference</span>
                </button>
              </>
            )}

            {currentDrill.isMasteryGate && (
              <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-amber-950/70 border border-amber-800/80 text-amber-300 text-xs font-semibold">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Strict Mastery Gate (Rule 11)</span>
              </div>
            )}
          </div>
        </div>

        {/* Drill Selector Tabs */}
        <div className="flex space-x-2 border-t border-slate-800 pt-3 overflow-x-auto no-scrollbar">
          {module.drills.map((d, idx) => {
            const isCompleted = progress.completedDrillIds.includes(d.id);
            const isCurrent = idx === activeDrillIndex;
            return (
              <button
                key={d.id}
                onClick={() => setActiveDrillIndex(idx)}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  isCurrent
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                    : isCompleted
                    ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-800/60'
                    : 'bg-slate-800/60 text-slate-400 border border-slate-700/40 hover:text-slate-200'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className={`w-3.5 h-3.5 ${isCurrent ? 'text-slate-950' : 'text-emerald-400'}`} />
                ) : (
                  <span className="font-mono text-[11px]">{d.drillNumber}</span>
                )}
                <span>{d.title.split(':')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Drill Prompt Box */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
            Scenario Prompt
          </span>
          <span className="text-xs text-slate-400">
            Type: <code className="text-slate-300 font-mono">{currentDrill.type}</code>
          </span>
        </div>
        <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-line">
          {currentDrill.prompt}
        </p>
      </div>

      {/* Code Editor & Submission Area */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        {/* Editor Toolbar */}
        <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            <span className="text-xs font-mono text-slate-400 ml-2">tests/drill.spec.ts</span>
            {savedSolution && (
              <span className="ml-2 inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800/80">
                <FileCheck2 className="w-3 h-3 text-emerald-400" />
                <span>Approved Solution Saved</span>
              </span>
            )}
            {!savedSolution && draftSolution && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-950/60 text-amber-300 border border-amber-800/60">
                <span>In-progress Draft</span>
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {savedSolution && userCode !== savedSolution.code && (
              <button
                onClick={handleRestoreApprovedSolution}
                title="Restore your approved passing code"
                className="flex items-center space-x-1 text-xs text-emerald-400 hover:text-emerald-300 px-2.5 py-1 rounded bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-800/60 transition cursor-pointer"
              >
                <Undo2 className="w-3 h-3" />
                <span>Restore Approved</span>
              </button>
            )}

            <button
              onClick={handleResetCode}
              title="Reset code to starter template"
              className="flex items-center space-x-1 text-xs text-slate-400 hover:text-slate-200 px-2.5 py-1 rounded bg-slate-800/80 hover:bg-slate-700 transition cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset to Starter</span>
            </button>
          </div>
        </div>

        {/* Syntax-Highlighted Code Editor */}
        <CodeEditor
          id="drill-code-input"
          value={userCode}
          onChange={handleCodeChange}
          onSubmit={handleValidateSubmission}
          placeholder="// Type or edit your Playwright TypeScript code here..."
          minHeight="320px"
          isApproved={Boolean(savedSolution && userCode === savedSolution.code)}
        />

        {/* Explain-It Box (Mandatory for Mastery Gate Rule 11, saved with every drill) */}
        <div className="border-t border-slate-800/80 bg-slate-900/60 p-4 space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <label htmlFor="drill-explanation-input" className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
                <MessageSquareQuote className="w-3.5 h-3.5 text-cyan-400" />
                <span>Explain-It: Why your solution works</span>
                {currentDrill.isMasteryGate && (
                  <span className="text-[10px] text-amber-400 font-bold bg-amber-950/70 border border-amber-800/60 px-1.5 py-0.5 rounded">
                    Required for Mastery Gate
                  </span>
                )}
              </label>

              {(isApproved || (savedSolution?.explanation && savedSolution.explanation.trim().length > 0)) && (
                <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800/80">
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span>Defense Saved</span>
                </span>
              )}
              {isExplanationSavedRecently && (
                <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-cyan-950 text-cyan-300 border border-cyan-800/80">
                  <Check className="w-3 h-3 text-cyan-400" />
                  <span>Saved!</span>
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2 text-xs">
              {isApproved && userExplanation !== approvedExplanation && (
                <button
                  type="button"
                  onClick={handleRestoreApprovedExplanation}
                  title="Revert to your previously saved approved defense"
                  className="flex items-center space-x-1 text-xs text-emerald-400 hover:text-emerald-300 px-2 py-1 rounded bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-800/60 transition cursor-pointer"
                >
                  <Undo2 className="w-3 h-3" />
                  <span>Restore Saved Defense</span>
                </button>
              )}

              {userExplanation !== (savedSolution?.explanation || approvedExplanation) && (
                <button
                  type="button"
                  onClick={handleSaveExplanationClick}
                  title="Save this conceptual explanation to your permanent record"
                  className="flex items-center space-x-1 text-xs text-cyan-400 hover:text-cyan-300 px-2.5 py-1 rounded bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-800/60 transition cursor-pointer"
                >
                  <Save className="w-3 h-3" />
                  <span>{userExplanation.trim().length > 0 ? 'Save Defense' : 'Clear Defense'}</span>
                </button>
              )}

              <span className="text-[11px] text-slate-500 hidden sm:inline">Plain-English conceptual defense</span>
            </div>
          </div>
          <textarea
            id="drill-explanation-input"
            value={userExplanation}
            onChange={(e) => handleExplanationChange(e.target.value)}
            rows={3}
            placeholder="Explain why this locator/method/assertion is correct and why anti-patterns were avoided (automatically saved and restored with your drill solution)..."
            className="w-full bg-slate-950 text-slate-200 text-xs sm:text-sm rounded-lg p-3 border border-slate-800 focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/40 outline-none leading-relaxed placeholder-slate-600"
          />
        </div>

        {/* Action Bar */}
        <div className="bg-slate-950 px-4 py-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Tiered Hint System */}
          <div className="flex items-center space-x-2 self-start sm:self-auto">
            <button
              id="unlock-hint-btn"
              onClick={handleUnlockNextHint}
              disabled={hintTier >= 3}
              className={`flex items-center space-x-1.5 text-xs px-3 py-1.5 rounded-lg border transition cursor-pointer ${
                hintTier >= 3
                  ? 'bg-slate-900 text-slate-600 border-slate-800 cursor-not-allowed'
                  : 'bg-amber-950/40 text-amber-300 border-amber-800/60 hover:bg-amber-900/40'
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              <span>
                {hintTier === 0
                  ? 'Unlock Tier 1: Concept'
                  : hintTier === 1
                  ? 'Unlock Tier 2: Partial'
                  : hintTier === 2
                  ? 'Unlock Tier 3: Full Solution'
                  : 'All Hints Unlocked'}
              </span>
            </button>
          </div>

          {/* Validate Button */}
          <div className="flex items-center space-x-3 self-end sm:self-auto">
            {feedback.status === 'success' && activeDrillIndex < module.drills.length - 1 && (
              <button
                id="next-drill-btn"
                onClick={handleNextDrill}
                className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-4 py-2 rounded-lg transition cursor-pointer"
              >
                <span>Next Drill</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}

            <button
              id="verify-drill-btn"
              onClick={handleValidateSubmission}
              className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs sm:text-sm font-bold px-5 py-2 rounded-lg shadow-lg shadow-cyan-500/20 transition cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Submit & Review</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tiered Hints Display (Rule 10) */}
      {hintTier > 0 && (
        <div className="bg-slate-900/90 border border-amber-800/50 rounded-xl p-5 space-y-4">
          <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
            <Lightbulb className="w-4 h-4" />
            <span>Mentor Hinting System (Tier {hintTier} of 3)</span>
          </div>

          {/* Tier 1 */}
          <div className="space-y-1">
            <span className="text-xs font-semibold text-amber-300">Tier 1: Conceptual Explanation</span>
            <p className="text-xs text-slate-300 leading-relaxed">{currentDrill.hints.tier1Concept}</p>
          </div>

          {/* Tier 2 */}
          {hintTier >= 2 && (
            <div className="space-y-1 pt-2 border-t border-amber-950/80">
              <span className="text-xs font-semibold text-amber-300">Tier 2: Partial Nudge (Concept Named)</span>
              <p className="text-xs text-slate-300 leading-relaxed">{currentDrill.hints.tier2Partial}</p>
            </div>
          )}

          {/* Tier 3 */}
          {hintTier >= 3 && (
            <div className="space-y-1 pt-2 border-t border-amber-950/80">
              <span className="text-xs font-semibold text-amber-300">Tier 3: Full Corrected Reference Code</span>
              <div className="bg-slate-950 rounded-lg p-3 font-mono text-xs text-slate-200 border border-slate-800 overflow-x-auto">
                <pre>{currentDrill.hints.tier3Solution}</pre>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Mentor Review Feedback Card */}
      {feedback.status !== 'idle' && (
        <div
          className={`rounded-xl p-5 border text-sm space-y-2 shadow-lg ${
            feedback.status === 'success'
              ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-200'
              : feedback.status === 'cleanliness-warning'
              ? 'bg-amber-950/40 border-amber-800/60 text-amber-200'
              : 'bg-rose-950/40 border-rose-800/60 text-rose-200'
          }`}
        >
          <div className="flex items-center space-x-2">
            {feedback.status === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : feedback.status === 'cleanliness-warning' ? (
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            ) : (
              <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
            )}
            <h4 className="font-bold text-base">{feedback.title}</h4>
          </div>

          <p className="leading-relaxed opacity-95">{feedback.message}</p>

          {feedback.details && feedback.details.length > 0 && (
            <ul className="list-disc list-inside text-xs space-y-1 pt-1 opacity-90">
              {feedback.details.map((d, i) => (
                <li key={i}>{d}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* POM Quick Reference Floating Panel */}
      {module.id === 'pom' && (
        <>
          <POMQuickReference
            isOpen={isPOMRefOpen}
            onClose={() => setIsPOMRefOpen(false)}
            onToggle={() => setIsPOMRefOpen(!isPOMRefOpen)}
            onOpenGenerator={() => setIsGeneratorOpen(true)}
          />

          <POMTemplateGeneratorModal
            isOpen={isGeneratorOpen}
            onClose={() => setIsGeneratorOpen(false)}
            onApplyToDrill={(generatedCode) => setUserCode(generatedCode)}
          />
        </>
      )}
    </div>
  );
}
