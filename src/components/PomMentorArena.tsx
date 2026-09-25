import { useState, useEffect, useRef } from 'react';
import { 
  Dumbbell, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  ChevronRight, 
  RotateCcw, 
  Send, 
  Sparkles, 
  BookOpen, 
  ShieldCheck, 
  Award, 
  BrainCircuit,
  Eye,
  EyeOff,
  Lightbulb,
  Code2,
  Trash2,
  GraduationCap,
  ChevronDown,
  X,
  Loader2,
  Clock
} from 'lucide-react';
import { POM_LEVELS, POM_MENTOR_DRILLS, PomMentorDrill, getDrillStarterCodeWithComments } from '../data/pomMentorData';
import { getRubricForDrill, DRILL_RUBRICS, DEFAULT_SDET_RUBRICS } from '../data/pomRubrics';
import { CodeEditor } from './CodeEditor';
import { HighlightedCodeSnippet } from './HighlightedCodeSnippet';

interface PomMentorProgress {
  currentDrillId: string;
  drillAttempts: Record<string, number>;
  masteryScores: Record<string, number>; // 0 to 4
  completedDrillIds: string[];
  savedCode: Record<string, string>;
  revealedHints: Record<string, boolean>;
  skillsMastered: string[];
  skillsNeedingPractice: string[];
}

const POM_PROGRESS_STORAGE_KEY = 'playwright_pom_mentor_v1';
const USER_SUBMITTED_DRILL_IDS = [
  'pom-drill-1-1',
  'pom-drill-1-2',
  'pom-drill-1-3',
  'pom-drill-1-4',
  'pom-drill-1-5',
  'pom-drill-2-1',
  'pom-drill-2-2',
  'pom-drill-2-3',
  'pom-drill-2-4',
  'pom-drill-2-5',
];

function getInitialMentorProgress(): PomMentorProgress {
  const defaultSavedCode: Record<string, string> = {};
  USER_SUBMITTED_DRILL_IDS.forEach(id => {
    const drill = POM_MENTOR_DRILLS.find(d => d.id === id);
    if (drill) {
      defaultSavedCode[drill.id] = drill.validation.solutionCode;
    }
  });

  const level1Skills = POM_LEVELS[0].focusSkills;
  const level2Skills = POM_LEVELS[1].focusSkills;
  const initialMasteredSkills = [...level1Skills, ...level2Skills];
  const initialScores: Record<string, number> = {};
  POM_LEVELS.flatMap(lvl => lvl.focusSkills).forEach(skill => {
    initialScores[skill] = initialMasteredSkills.includes(skill) ? 4 : 0;
  });

  const defaultProgress: PomMentorProgress = {
    currentDrillId: 'pom-drill-2-5',
    drillAttempts: {
      'pom-drill-1-1': 1,
      'pom-drill-1-2': 1,
      'pom-drill-1-3': 1,
      'pom-drill-1-4': 1,
      'pom-drill-1-5': 1,
      'pom-drill-2-1': 1,
      'pom-drill-2-2': 1,
      'pom-drill-2-3': 1,
      'pom-drill-2-4': 1,
      'pom-drill-2-5': 1,
    },
    masteryScores: initialScores,
    completedDrillIds: [...USER_SUBMITTED_DRILL_IDS],
    savedCode: defaultSavedCode,
    revealedHints: {},
    skillsMastered: [...initialMasteredSkills],
    skillsNeedingPractice: []
  };

  try {
    const saved = localStorage.getItem(POM_PROGRESS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      const mergedSavedCode = {
        ...defaultSavedCode,
        ...(parsed.savedCode || {})
      };
      USER_SUBMITTED_DRILL_IDS.forEach(id => {
        const drill = POM_MENTOR_DRILLS.find(d => d.id === id);
        if (drill && (!mergedSavedCode[drill.id] || mergedSavedCode[drill.id].trim() === '')) {
          mergedSavedCode[drill.id] = drill.validation.solutionCode;
        }
      });

      // Keep user's Level 1 & Level 2 submitted drills plus any completed drills across all levels
      const validCompleted = Array.isArray(parsed.completedDrillIds)
        ? Array.from(new Set([...USER_SUBMITTED_DRILL_IDS, ...parsed.completedDrillIds]))
        : [...USER_SUBMITTED_DRILL_IDS];

      const mergedScores = {
        ...initialScores,
        ...(parsed.masteryScores || {})
      };

      initialMasteredSkills.forEach(skill => {
        mergedScores[skill] = 4;
      });

      validCompleted.forEach(drillId => {
        const drill = POM_MENTOR_DRILLS.find(d => d.id === drillId);
        if (drill) {
          const skills = getDrillFocusSkills(drill);
          skills.forEach(s => {
            mergedScores[s] = 4;
          });
        }
      });

      const mergedAttempts = {
        ...defaultProgress.drillAttempts,
        ...(parsed.drillAttempts || {})
      };

      return {
        ...defaultProgress,
        ...parsed,
        drillAttempts: mergedAttempts,
        savedCode: mergedSavedCode,
        completedDrillIds: validCompleted,
        masteryScores: mergedScores,
        skillsMastered: Array.from(new Set([
          ...initialMasteredSkills,
          ...POM_LEVELS.flatMap(lvl => lvl.focusSkills).filter(s => (mergedScores[s] || 0) >= 4)
        ])),
        skillsNeedingPractice: []
      };
    }
  } catch (e) {
    console.error('Failed to parse pom mentor progress', e);
  }

  return defaultProgress;
}

function getDrillFocusSkills(drill: PomMentorDrill): string[] {
  if (drill.isMasteryAssessment || drill.isReviewChallenge) {
    const levelObj = POM_LEVELS.find(l => l.level === drill.level);
    if (levelObj) {
      return levelObj.focusSkills;
    }
  }
  if (drill.focusSkills && drill.focusSkills.length > 0) {
    return drill.focusSkills;
  }
  const levelObj = POM_LEVELS.find(l => l.level === drill.level);
  return levelObj ? levelObj.focusSkills : [];
}

export function PomMentorArena() {
  const [progress, setProgress] = useState<PomMentorProgress>(getInitialMentorProgress);
  const [selectedLevel, setSelectedLevel] = useState<number>(() => {
    const drill = POM_MENTOR_DRILLS.find(d => d.id === progress.currentDrillId);
    return drill ? drill.level : 2;
  });
  const [showHint, setShowHint] = useState<boolean>(false);
  const [showSolution, setShowSolution] = useState<boolean>(false);
  const [showBeginnerGuide, setShowBeginnerGuide] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const reviewFeedbackRef = useRef<HTMLDivElement>(null);
  const [reviewResult, setReviewResult] = useState<{
    classification: 'Correct' | 'Partially Correct' | 'Incorrect' | 'Unreliable' | 'Not Production-Ready';
    primaryIssue?: string;
    explanation: string;
    followUpQuestion?: string;
    score: number; // 0 to 4
    scoreBreakdown?: {
      criterion: string;
      awarded: number;
      max: number;
      notes: string;
      rationale?: string;
      goodExample?: string;
      badExample?: string;
    }[];
  } | null>(null);

  const [expandedRubricExamples, setExpandedRubricExamples] = useState<Record<number, boolean>>({
    0: true,
    1: true,
    2: true,
    3: true
  });
  const [showDrillRubricSection, setShowDrillRubricSection] = useState<boolean>(true);
  const [expandedDrillRubricCards, setExpandedDrillRubricCards] = useState<Record<number, boolean>>({
    0: true,
    1: true,
    2: true,
    3: true
  });
  const [showRubricModal, setShowRubricModal] = useState<boolean>(false);
  const [rubricModalSelectedLevel, setRubricModalSelectedLevel] = useState<number>(1);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [isModifiedSinceReview, setIsModifiedSinceReview] = useState<boolean>(false);
  const [evaluationTimestamp, setEvaluationTimestamp] = useState<string | null>(null);
  const [evaluationKey, setEvaluationKey] = useState<number>(0);

  const activeDrill = POM_MENTOR_DRILLS.find(d => d.id === progress.currentDrillId) || POM_MENTOR_DRILLS[0];

  const getEffectiveDrillCode = (drill: PomMentorDrill, saved?: string) => {
    if (!saved) return getDrillStarterCodeWithComments(drill);
    // If the saved code is the older raw starter code without comments, upgrade it
    if (saved.trim() === drill.startingCode.trim()) {
      return getDrillStarterCodeWithComments(drill);
    }
    return saved;
  };

  const [code, setCode] = useState<string>(() => getEffectiveDrillCode(activeDrill, progress.savedCode[activeDrill.id]));

  useEffect(() => {
    localStorage.setItem(POM_PROGRESS_STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  // When active drill changes, load code
  useEffect(() => {
    setCode(getEffectiveDrillCode(activeDrill, progress.savedCode[activeDrill.id]));
    setShowHint(Boolean(progress.revealedHints[activeDrill.id]));
    setShowSolution(false);
    setReviewResult(null);
    setIsModifiedSinceReview(false);
    setIsEvaluating(false);
    setEvaluationTimestamp(null);
  }, [activeDrill.id]);

  const handleSelectDrill = (drill: PomMentorDrill) => {
    setProgress(prev => ({
      ...prev,
      currentDrillId: drill.id
    }));
    setSelectedLevel(drill.level);
  };

  const handleResetCode = () => {
    const starterWithComments = getDrillStarterCodeWithComments(activeDrill);
    setCode(starterWithComments);
    setReviewResult(null);
    setShowSolution(false);
    setProgress(prev => {
      const nextSaved = { ...prev.savedCode };
      delete nextSaved[activeDrill.id];
      return {
        ...prev,
        savedCode: nextSaved
      };
    });
  };

  const handleClearCode = () => {
    // Clear code to an empty snippet so the user can write from a clean slate
    setCode('');
    setReviewResult(null);
    setShowSolution(false);
    setProgress(prev => {
      const nextSaved = { ...prev.savedCode };
      delete nextSaved[activeDrill.id];
      return {
        ...prev,
        savedCode: nextSaved
      };
    });
  };

  const [restoreNotification, setRestoreNotification] = useState<string | null>(null);

  const handleRestoreUserSubmissions = () => {
    const restoredCode: Record<string, string> = { ...progress.savedCode };
    USER_SUBMITTED_DRILL_IDS.forEach(id => {
      const drill = POM_MENTOR_DRILLS.find(d => d.id === id);
      if (drill) {
        restoredCode[drill.id] = drill.validation.solutionCode;
      }
    });

    const initialMasteredSkills = [...POM_LEVELS[0].focusSkills, ...POM_LEVELS[1].focusSkills];
    const scores: Record<string, number> = { ...progress.masteryScores };
    initialMasteredSkills.forEach(skill => {
      scores[skill] = 4;
    });

    const updated: PomMentorProgress = {
      ...progress,
      completedDrillIds: Array.from(new Set([...USER_SUBMITTED_DRILL_IDS, ...progress.completedDrillIds])),
      savedCode: restoredCode,
      masteryScores: scores,
      skillsMastered: Array.from(new Set([...progress.skillsMastered, ...initialMasteredSkills])),
      skillsNeedingPractice: []
    };

    setProgress(updated);
    if (USER_SUBMITTED_DRILL_IDS.includes(activeDrill.id)) {
      setCode(restoredCode[activeDrill.id] || activeDrill.validation.solutionCode);
    }
    setRestoreNotification('Restored your Level 1 & Level 2 drill submissions (Drills 1.1 through 2.5)!');
    setTimeout(() => {
      setRestoreNotification(null);
    }, 4000);
  };

  const handleToggleHint = () => {
    setShowHint(prev => {
      const next = !prev;
      setProgress(p => ({
        ...p,
        revealedHints: {
          ...p.revealedHints,
          [activeDrill.id]: next
        }
      }));
      return next;
    });
  };

  const handleSubmitReview = () => {
    setIsSubmitting(true);
    setIsEvaluating(true);

    // Brief delay to provide responsive feedback that a re-evaluation is in flight
    setTimeout(() => {
      runEvaluation();
    }, 280);
  };

  const runEvaluation = () => {
    const userCode = code.trim();
    const starterWithComments = getDrillStarterCodeWithComments(activeDrill).trim();
    const attempts = (progress.drillAttempts[activeDrill.id] || 0) + 1;
    const currentLevelObj = POM_LEVELS.find(l => l.level === activeDrill.level);
    const targetSkills = getDrillFocusSkills(activeDrill);

    // Helper to finish submit, update state, and scroll down to review
    const completeReview = (result: NonNullable<typeof reviewResult>) => {
      const drillRubrics = getRubricForDrill(activeDrill.id);

      // Ensure every criterion under Architectural Evaluation Rubric & Scoring Rationale has good and bad code examples
      const enrichedBreakdown = (result.scoreBreakdown && result.scoreBreakdown.length > 0)
        ? result.scoreBreakdown.map((item, idx) => {
            const fallback = drillRubrics[idx] || drillRubrics.find(r => r.criterion.toLowerCase().includes(item.criterion.toLowerCase())) || drillRubrics[idx % drillRubrics.length];
            return {
              ...item,
              rationale: item.rationale || fallback?.rationale || 'SDET Architectural Standard',
              goodExample: item.goodExample || fallback?.goodExample,
              badExample: item.badExample || fallback?.badExample,
              notes: item.notes || fallback?.notes || 'Adherence to Playwright Page Object Model design patterns.'
            };
          })
        : drillRubrics.map((r) => ({
            criterion: r.criterion,
            awarded: 0,
            max: 1,
            notes: r.notes,
            rationale: r.rationale,
            goodExample: r.goodExample,
            badExample: r.badExample
          }));

      // Make sure all good vs bad code examples are expanded and visible by default
      const allOpen: Record<number, boolean> = {};
      enrichedBreakdown.forEach((_, idx) => {
        allOpen[idx] = true;
      });
      setExpandedRubricExamples(allOpen);

      const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

      setReviewResult({
        ...result,
        scoreBreakdown: enrichedBreakdown
      });
      setEvaluationTimestamp(nowTime);
      setEvaluationKey(prev => prev + 1);
      setIsModifiedSinceReview(false);
      setIsEvaluating(false);
      setIsSubmitting(false);

      setProgress(prev => {
        const evalScore = result.score;
        const updatedScores = { ...prev.masteryScores };
        targetSkills.forEach(skill => {
          updatedScores[skill] = Math.max(updatedScores[skill] || 0, evalScore);
        });

        const isPassed = evalScore === 4;
        const nextCompletedDrills = isPassed
          ? Array.from(new Set([...prev.completedDrillIds, activeDrill.id]))
          : prev.completedDrillIds;

        const allSkills = POM_LEVELS.flatMap(lvl => lvl.focusSkills);
        const newMastered = Array.from(new Set(
          allSkills.filter(skill => (updatedScores[skill] || 0) >= 4)
        ));
        const nextSkillsNeed = Array.from(new Set(
          (currentLevelObj?.focusSkills || []).filter(skill => (updatedScores[skill] || 0) < 4)
        ));

        return {
          ...prev,
          drillAttempts: {
            ...prev.drillAttempts,
            [activeDrill.id]: attempts
          },
          completedDrillIds: nextCompletedDrills,
          savedCode: {
            ...prev.savedCode,
            [activeDrill.id]: userCode
          },
          skillsMastered: newMastered,
          skillsNeedingPractice: nextSkillsNeed,
          masteryScores: updatedScores
        };
      });

      setTimeout(() => {
        reviewFeedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 50);
    };

    // 1. Missing or empty check
    if (!userCode || userCode === starterWithComments || userCode === activeDrill.startingCode.trim()) {
      completeReview({
        classification: 'Incorrect',
        primaryIssue: 'No changes detected. You submitted the starter code without attempting the task.',
        explanation: 'Before we can review your Page Object, write your code attempt in the editor above.',
        score: 0,
        scoreBreakdown: [
          { criterion: 'Valid Syntax & Structure', awarded: 0, max: 1, notes: 'Starter template unchanged' },
          { criterion: 'Locator & Type Declarations', awarded: 0, max: 1, notes: 'No modifications' },
          { criterion: 'Action Implementation', awarded: 0, max: 1, notes: 'No code written' },
          { criterion: 'POM Architecture', awarded: 0, max: 1, notes: 'Task not attempted' }
        ]
      });
      return;
    }

    // Strip comments and string literals for semantic AST/brace checks
    const codeWithoutComments = userCode.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '');
    const codeStrippedOfLiterals = codeWithoutComments
      .replace(/(["'`])(?:(?=(\\?))\2[\s\S])*?\1/g, '')
      .replace(/\/((?![*+?])(?:[^\r\n\[/\\]|\\.|\[(?:[^\r\n\]\\]|\\.)*\])+)\//g, '');

    // 1.5 TypeScript / JavaScript Syntax & Structural checks
    // A) Check for unbalanced braces or parentheses
    const openBraces = (codeStrippedOfLiterals.match(/\{/g) || []).length;
    const closeBraces = (codeStrippedOfLiterals.match(/\}/g) || []).length;
    if (openBraces !== closeBraces) {
      const isMissingClassBrace = openBraces === closeBraces + 1 && /export\s+class\s+\w+/.test(codeWithoutComments);
      const classNameMatch = codeWithoutComments.match(/export\s+class\s+(\w+)/);
      const className = classNameMatch ? classNameMatch[1] : 'PageObject';

      completeReview({
        classification: 'Partially Correct',
        primaryIssue: isMissingClassBrace
          ? `Syntax Error: Missing closing curly brace '}' for class ${className}.`
          : `Syntax Error: Unbalanced curly braces { } (opened: ${openBraces}, closed: ${closeBraces}).`,
        explanation: isMissingClassBrace
          ? `Your code is missing the final closing curly brace '}' at the bottom of the file to close 'export class ${className} {'. Add '}' after your last method.`
          : 'Your code has a mismatched number of curly braces. Make sure all class and method blocks are properly opened and closed.',
        followUpQuestion: isMissingClassBrace
          ? `What error does the TypeScript compiler output if a class body is left unclosed?`
          : 'Did a method accidentally get defined outside the class closing brace?',
        score: 1,
        scoreBreakdown: [
          { criterion: 'Valid Syntax & AST Structure', awarded: 0, max: 1, notes: isMissingClassBrace ? `Missing closing '}' for class ${className}` : `Mismatched braces { } (${openBraces} open, ${closeBraces} close)` },
          { criterion: 'Locator & Type Declarations', awarded: 1, max: 1, notes: 'Locators declared correctly' },
          { criterion: 'Action & Execution Flow', awarded: 1, max: 1, notes: 'Actions implemented' },
          { criterion: 'POM Architecture & Separation', awarded: 0, max: 1, notes: 'Unclosed class definition' }
        ]
      });
      return;
    }

    const openParens = (codeStrippedOfLiterals.match(/\(/g) || []).length;
    const closeParens = (codeStrippedOfLiterals.match(/\)/g) || []).length;
    if (openParens !== closeParens) {
      completeReview({
        classification: 'Partially Correct',
        primaryIssue: `Syntax Error: Unbalanced parentheses ( ) (opened: ${openParens}, closed: ${closeParens}).`,
        explanation: 'Check your method calls, constructor definitions, and locator expressions for missing closing parentheses.',
        followUpQuestion: 'Did a locator like getByRole() or getByLabel() miss its closing parenthesis?',
        score: 1,
        scoreBreakdown: [
          { criterion: 'Valid Syntax & AST Structure', awarded: 0, max: 1, notes: `Mismatched parentheses ( ) (${openParens} open, ${closeParens} close)` },
          { criterion: 'Locator & Type Declarations', awarded: 1, max: 1, notes: 'Partially analyzed' },
          { criterion: 'Action & Execution Flow', awarded: 0, max: 1, notes: 'Syntax blocked full validation' },
          { criterion: 'POM Architecture & Separation', awarded: 0, max: 1, notes: 'Unbalanced file structure' }
        ]
      });
      return;
    }

    // B) Capitalized Page assignment error: this.page = Page;
    if (/this\.page\s*=\s*Page\b/.test(codeWithoutComments)) {
      completeReview({
        classification: 'Partially Correct',
        primaryIssue: "Type Error: 'this.page = Page;' assigns the TypeScript interface type rather than the constructor argument.",
        explanation: "'Page' (capitalized) is the Playwright interface type. The parameter passed into constructor(page: Page) is lowercase 'page'. Use 'this.page = page;'.",
        followUpQuestion: 'What is the difference between a TypeScript type annotation and an instantiated runtime object?',
        score: 2,
        scoreBreakdown: [
          { criterion: 'Valid Syntax & AST Structure', awarded: 1, max: 1, notes: 'Syntax structure valid' },
          { criterion: 'Type Safety & Dependency Injection', awarded: 0, max: 1, notes: 'Assigned Page interface instead of runtime instance' },
          { criterion: 'Action Encapsulation', awarded: 1, max: 1, notes: 'Methods present' },
          { criterion: 'POM Architecture', awarded: 0, max: 1, notes: 'Constructor dependency assignment invalid' }
        ]
      });
      return;
    }

    // C) Unquoted role name e.g. { name: Submit } or { name: Sign in }
    if (/getByRole\s*\(\s*['"]\w+['"]\s*,\s*\{\s*name\s*:\s*[A-Za-z]+(?:\s+[A-Za-z]+)*\s*\}?/.test(codeWithoutComments) &&
        !/getByRole\s*\(\s*['"]\w+['"]\s*,\s*\{\s*name\s*:\s*(?:['"`]|(?:\/[^/]+\/))/.test(codeWithoutComments)) {
      completeReview({
        classification: 'Partially Correct',
        primaryIssue: "Syntax Error: Locator option 'name' requires a quoted string or RegExp (e.g., { name: 'Sign in' } or { name: /sign in/i }).",
        explanation: "In JavaScript/TypeScript, unquoted words like { name: Submit } are treated as variable references rather than string literals, causing a runtime ReferenceError.",
        followUpQuestion: 'Why does Playwright recommend using RegExp for name options (e.g., /sign in/i) in accessible queries?',
        score: 2,
        scoreBreakdown: [
          { criterion: 'Valid Syntax & AST Structure', awarded: 0, max: 1, notes: 'Unquoted name literal causes ReferenceError' },
          { criterion: 'Accessible Locators', awarded: 1, max: 1, notes: 'getByRole used' },
          { criterion: 'Action Encapsulation', awarded: 1, max: 1, notes: 'Valid action signatures' },
          { criterion: 'Design Rules', awarded: 0, max: 1, notes: 'Invalid object literal argument' }
        ]
      });
      return;
    }

    // D) Empty fill() calls: .fill() without arguments
    if (/\.fill\s*\(\s*\)/.test(codeWithoutComments)) {
      completeReview({
        classification: 'Partially Correct',
        primaryIssue: "Runtime Error: Locator.fill() called with no arguments.",
        explanation: "locator.fill(value) requires a string argument to simulate user keystrokes. For example: await this.usernameInput.fill(username);",
        followUpQuestion: 'What does locator.fill() do under the hood in Playwright before typing the characters?',
        score: 2,
        scoreBreakdown: [
          { criterion: 'Action Method Signatures', awarded: 1, max: 1, notes: 'Action methods defined' },
          { criterion: 'Playwright Action Execution', awarded: 0, max: 1, notes: '.fill() invoked without value' },
          { criterion: 'Locator Integrity', awarded: 1, max: 1, notes: 'Locators declared' },
          { criterion: 'Runtime Reliability', awarded: 0, max: 1, notes: 'Will fail at runtime' }
        ]
      });
      return;
    }

    // E) await. operator syntax error
    if (/\bawait\s*\./.test(codeWithoutComments)) {
      completeReview({
        classification: 'Partially Correct',
        primaryIssue: "Syntax Error: Invalid 'await.' operator syntax.",
        explanation: "'await' is a JavaScript keyword, not an object. Remove the dot after 'await' (write 'await this.locator.click()' instead of 'await.this...').",
        followUpQuestion: 'Why is await an operator rather than a property on an object?',
        score: 1,
        scoreBreakdown: [
          { criterion: 'Valid Syntax & AST Structure', awarded: 0, max: 1, notes: "Typo 'await.' creates an illegal member expression" },
          { criterion: 'Locator & Type Declarations', awarded: 1, max: 1, notes: 'Locators declared' },
          { criterion: 'Action & Execution Flow', awarded: 0, max: 1, notes: 'Syntax error prevents execution' },
          { criterion: 'POM Architecture', awarded: 1, max: 1, notes: 'Component structure present' }
        ]
      });
      return;
    }

    // F) Calling assertion matcher directly on locator without expect(...)
    if (/(?:^|[^\w])(?:this\.)?\w+\.toBeVisible\s*\(/.test(codeWithoutComments) && !/expect\s*\(/.test(codeWithoutComments)) {
      completeReview({
        classification: 'Incorrect',
        primaryIssue: "Runtime Error: '.toBeVisible()' is an assertion matcher, not a Locator method.",
        explanation: "In Playwright, '.toBeVisible()' only exists inside expect: 'await expect(locator).toBeVisible()'. Furthermore, in Page Object Models, assertions belong in the test spec, while POM methods return Locators or perform actions.",
        followUpQuestion: 'What is the difference between a Playwright Locator and a Playwright test expectation?',
        score: 1,
        scoreBreakdown: [
          { criterion: 'Valid Syntax & AST Structure', awarded: 0, max: 1, notes: 'Called assertion matcher directly on Locator instance' },
          { criterion: 'Locator & Type Declarations', awarded: 1, max: 1, notes: 'Locators declared' },
          { criterion: 'Playwright API Standard', awarded: 0, max: 1, notes: 'Invalid method call on Locator' },
          { criterion: 'POM Separation of Concerns', awarded: 0, max: 1, notes: 'Assertion attempted inside POM method' }
        ]
      });
      return;
    }

    // G) Invalid locator.click('sub-selector')
    if (/\.click\s*\(\s*['"][a-zA-Z0-9_\-\.]+['"]/.test(codeWithoutComments)) {
      completeReview({
        classification: 'Incorrect',
        primaryIssue: "Playwright API Error: locator.click() does not accept a selector string.",
        explanation: "Playwright's locator.click() only accepts click options (like { timeout, button }), not a sub-selector string. Scope down to the target element first: 'await card.getByRole('button', { name: 'Add to Cart' }).click();'",
        followUpQuestion: 'How does container scoping prevent Playwright strict mode violations?',
        score: 1,
        scoreBreakdown: [
          { criterion: 'Valid Syntax & AST Structure', awarded: 1, max: 1, notes: 'Syntax valid' },
          { criterion: 'Playwright Action API', awarded: 0, max: 1, notes: "Passed string selector to .click() instead of scoping container" },
          { criterion: 'Container Scoping Standard', awarded: 0, max: 1, notes: 'Did not properly isolate nested child element' },
          { criterion: 'Action Encapsulation', awarded: 1, max: 1, notes: 'Method declared' }
        ]
      });
      return;
    }

    // H) Reference to method parameters inside constructor
    const constructorMatch = codeWithoutComments.match(/constructor\s*\([^)]*\)\s*\{([^}]*)\}/);
    if (constructorMatch && /\bhasText\s*:\s*(?:title|name|id)\b/.test(constructorMatch[1])) {
      completeReview({
        classification: 'Incorrect',
        primaryIssue: "Runtime ReferenceError: Variable used in constructor before it is declared.",
        explanation: "The constructor only accepts '(page: Page)', so 'title' is undefined here. In the constructor, store the generic collection of all cards ('page.getByRole(\"listitem\")'). Then parameterize your dynamic locator in 'getProductCard(title: string)'.",
        followUpQuestion: 'Why should the constructor store the collection while methods handle dynamic parameters?',
        score: 1,
        scoreBreakdown: [
          { criterion: 'Valid Syntax & AST Structure', awarded: 0, max: 1, notes: 'ReferenceError: title is undefined in constructor scope' },
          { criterion: 'Parameterized Locator Architecture', awarded: 0, max: 1, notes: 'Prematurely filtered in constructor instead of helper method' },
          { criterion: 'Dependency Injection', awarded: 0, max: 1, notes: 'Constructor scope error' },
          { criterion: 'Action Encapsulation', awarded: 1, max: 1, notes: 'Methods declared' }
        ]
      });
      return;
    }

    // I) Malformed method declaration missing body or braces
    if (/(?:async\s+)?\w+\s*\([^)]*\)\s*:\s*(?:await|[a-zA-Z_]\w*\.)/.test(codeWithoutComments)) {
      completeReview({
        classification: 'Partially Correct',
        primaryIssue: "Syntax Error: Method declaration is missing a return type and opening brace '{'.",
        explanation: "TypeScript methods must specify their return type and open a block with '{'. For example: 'getProductCard(title: string): Locator { return ... }'.",
        followUpQuestion: 'Why must methods have a defined block body { ... } in TypeScript classes?',
        score: 1,
        scoreBreakdown: [
          { criterion: 'Valid Syntax & AST Structure', awarded: 0, max: 1, notes: 'Missing method return type or opening brace' },
          { criterion: 'Locator & Type Declarations', awarded: 1, max: 1, notes: 'Properties declared' },
          { criterion: 'Action Implementation', awarded: 0, max: 1, notes: 'Malformed method header' },
          { criterion: 'TypeScript Strictness', awarded: 0, max: 1, notes: 'Invalid class method syntax' }
        ]
      });
      return;
    }

    // 2. Anti-pattern checks (Unreliable / Not Production-Ready)
    if (activeDrill.validation.forbiddenKeywords) {
      for (const forbidden of activeDrill.validation.forbiddenKeywords) {
        let isForbiddenDetected = false;
        if (forbidden === 'waitForTimeout') {
          isForbiddenDetected = /\bwaitForTimeout\s*\(/.test(codeWithoutComments);
        } else if (forbidden === 'expect(') {
          isForbiddenDetected = /\bexpect\s*\(/.test(codeWithoutComments);
        } else if (forbidden === ': any' || forbidden === 'any') {
          isForbiddenDetected = /(?::\s*any\b|\bany\[\]|\bas\s+any\b)/.test(codeWithoutComments);
        } else {
          isForbiddenDetected = codeWithoutComments.includes(forbidden);
        }

        if (isForbiddenDetected) {
          if (forbidden === 'waitForTimeout') {
            completeReview({
              classification: 'Unreliable',
              primaryIssue: 'Arbitrary wait anti-pattern detected: waitForTimeout().',
              explanation: 'Playwright features automatic waiting (actionability checks) for visibility, enabled state, and stability on click/fill. Using waitForTimeout() introduces unnecessary slowness and pipeline flakiness.',
              followUpQuestion: 'What does Playwright automatically wait for before executing a .click() action?',
              score: 1,
              scoreBreakdown: [
                { criterion: 'Playwright Auto-Waiting Standard', awarded: 0, max: 1, notes: 'Used anti-pattern waitForTimeout()' },
                { criterion: 'Locator Resiliency', awarded: 1, max: 1, notes: 'Locators defined' },
                { criterion: 'Clean Async Flow', awarded: 0, max: 1, notes: 'Arbitrary sleep pollutes test run' },
                { criterion: 'Production Quality', awarded: 0, max: 1, notes: 'Flaky test suite smell' }
              ]
            });
            return;
          }
          if (forbidden === 'expect(') {
            completeReview({
              classification: 'Not Production-Ready',
              primaryIssue: 'Assertion placed inside the Page Object class.',
              explanation: 'Rule of POM: Page Objects model page interactions and locators. Assertions belong in the test specification (*.spec.ts) so failure stack traces clearly show which business rule failed.',
              followUpQuestion: 'Why does hiding an expect() assertion inside a Page Object make negative testing difficult?',
              score: 2,
              scoreBreakdown: [
                { criterion: 'POM Single Responsibility Principle', awarded: 0, max: 1, notes: 'expect() assertion buried in Page Object' },
                { criterion: 'Locator & Action Encapsulation', awarded: 1, max: 1, notes: 'Locators and methods defined' },
                { criterion: 'Separation of Concerns', awarded: 0, max: 1, notes: 'Assertions must stay in test spec' },
                { criterion: 'Negative Test Reusability', awarded: 1, max: 1, notes: 'Page methods defined' }
              ]
            });
            return;
          }
          if (forbidden === ': any' || forbidden === 'any') {
            completeReview({
              classification: 'Not Production-Ready',
              primaryIssue: 'TypeScript strictness issue: `: any` type detected.',
              explanation: 'In modern Playwright with TypeScript, avoid `any`. Declare locators explicitly with `readonly locatorName: Locator;` and methods with explicit `Promise<void>` return types.',
              followUpQuestion: 'Why does using `Locator` types instead of `any` give your IDE superpowers for auto-completion?',
              score: 2,
              scoreBreakdown: [
                { criterion: 'TypeScript Type Safety', awarded: 0, max: 1, notes: 'Contains loose `: any` type annotations' },
                { criterion: 'Locator Declaration', awarded: 1, max: 1, notes: 'Locators declared' },
                { criterion: 'Action Implementation', awarded: 1, max: 1, notes: 'Methods defined' },
                { criterion: 'Production Quality', awarded: 0, max: 1, notes: 'Strict typing required' }
              ]
            });
            return;
          }
          // Generic forbidden keyword handler
          completeReview({
            classification: 'Not Production-Ready',
            primaryIssue: `Forbidden anti-pattern detected: "${forbidden}".`,
            explanation: `Your code contains "${forbidden}" which violates the architectural rules for this drill. Please refactor to remove it.`,
            score: 1,
            scoreBreakdown: [
              { criterion: 'Production Quality & Clean Code', awarded: 0, max: 1, notes: `Contains forbidden pattern: ${forbidden}` },
              { criterion: 'Locator Resiliency', awarded: 1, max: 1, notes: 'Partially completed' },
              { criterion: 'Clean Async Flow', awarded: 0, max: 1, notes: 'Violates drill constraints' },
              { criterion: 'Architecture Standard', awarded: 0, max: 1, notes: 'Anti-pattern present' }
            ]
          });
          return;
        }
      }
    }

    // 3. Keyword / Requirements checks
    const missingKeywords: string[] = [];
    if (activeDrill.validation.requiredKeywords) {
      for (const kw of activeDrill.validation.requiredKeywords) {
        if (!userCode.includes(kw)) {
          missingKeywords.push(kw);
        }
      }
    }

    // 4. Regex checks if any
    if (activeDrill.validation.regexPatterns) {
      for (const r of activeDrill.validation.regexPatterns) {
        const regex = new RegExp(r.pattern, 'm');
        if (!regex.test(userCode)) {
          completeReview({
            classification: 'Partially Correct',
            primaryIssue: r.message,
            explanation: `Your solution is close, but misses an important TypeScript or Playwright design standard: ${r.message}. Check your types and syntax.`,
            followUpQuestion: 'How does explicit TypeScript typing (like readonly and explicit Promise return types) improve IDE auto-completion for your entire QA team?',
            score: 2,
            scoreBreakdown: [
              { criterion: 'TypeScript Type Strictness', awarded: 0, max: 1, notes: r.message },
              { criterion: 'Playwright Locator Best Practices', awarded: 1, max: 1, notes: 'Accessible locators present' },
              { criterion: 'Action Encapsulation', awarded: 1, max: 1, notes: 'Actions provided' },
              { criterion: 'Architectural Contract', awarded: 0, max: 1, notes: 'Missing required contract pattern' }
            ]
          });
          return;
        }
      }
    }

    if (missingKeywords.length > 0) {
      completeReview({
        classification: 'Partially Correct',
        primaryIssue: `Missing required element: "${missingKeywords[0]}"`,
        explanation: `Your attempt has the right idea, but is missing critical structure (${missingKeywords.join(', ')}). Review the success criteria and fix this before we pass this drill.`,
        followUpQuestion: 'What happens if a locator is not declared as readonly?',
        score: 2,
        scoreBreakdown: [
          { criterion: 'Required API/Contract Elements', awarded: 0, max: 1, notes: `Missing: ${missingKeywords.join(', ')}` },
          { criterion: 'Core Playwright Syntax', awarded: 1, max: 1, notes: 'Playwright constructs used' },
          { criterion: 'Code Structure', awarded: 1, max: 1, notes: 'File skeleton in place' },
          { criterion: 'Task Completion', awarded: 0, max: 1, notes: 'Unfinished requirements' }
        ]
      });
      return;
    }

    // Success! A clean solution meeting all production criteria earns full marks (4/4)
    const finalScore = 4;

    // Dynamic criteria breakdown based on the active drill with in-depth SDET architectural rationales
    const drillRubricItems = getRubricForDrill(activeDrill.id);
    const breakdown = drillRubricItems.map(item => ({
      criterion: item.criterion,
      awarded: 1,
      max: 1,
      rationale: item.rationale,
      notes: item.notes,
      badExample: item.badExample,
      goodExample: item.goodExample
    }));

    // Ensure all 4 rubric examples are visible/expanded by default
    setExpandedRubricExamples({ 0: true, 1: true, 2: true, 3: true });

    completeReview({
      classification: 'Correct',
      explanation: activeDrill.validation.explanation,
      followUpQuestion: activeDrill.validation.followUpQuestion,
      score: finalScore,
      scoreBreakdown: breakdown
    });
  };

  const nextDrillIndex = POM_MENTOR_DRILLS.findIndex(d => d.id === activeDrill.id) + 1;
  const nextDrill = POM_MENTOR_DRILLS[nextDrillIndex];

  // Current Level Skills and Mastery status
  const currentLevelObj = POM_LEVELS.find(l => l.level === selectedLevel) || POM_LEVELS[0];
  const currentLevelSkills = currentLevelObj.focusSkills;
  const levelSkillsMastered = currentLevelSkills.filter(s => (progress.masteryScores[s] || 0) >= 4);
  const levelSkillsNeedingPractice = currentLevelSkills.filter(s => (progress.masteryScores[s] || 0) < 4);
  const isLevelFullyMastered = currentLevelSkills.length > 0 && levelSkillsNeedingPractice.length === 0;

  const currentLevelDrills = POM_MENTOR_DRILLS.filter(d => d.level === selectedLevel);
  const levelCompletedCount = currentLevelDrills.filter(d => progress.completedDrillIds.includes(d.id)).length;
  const isLevelAllDrillsPassed = levelCompletedCount === currentLevelDrills.length;
  const nextLevelObj = POM_LEVELS.find(l => l.level === selectedLevel + 1);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/60 border border-indigo-800/40 rounded-2xl p-5 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                <Dumbbell className="w-5 h-5 text-indigo-400" />
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Independent POM Practice Mentor & Gym
              </h2>
              <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                Independent Module • No Course Blockers
              </span>
            </div>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              Step-by-step mentor-guided drills to build rock-solid Playwright Page Object Model muscle memory. Practice anytime from Beginner fundamentals up to Senior SDET framework architecture.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setShowRubricModal(true)}
              className="flex items-center space-x-1.5 px-3 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 rounded-xl text-xs font-semibold transition cursor-pointer shadow-sm hover:text-white"
              title="Open Evaluation Rubrics with Good & Bad Code Examples"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-300" />
              <span>Rubrics & Examples Guide</span>
            </button>
            <button
              onClick={handleRestoreUserSubmissions}
              className="flex items-center space-x-1.5 px-3 py-2 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/40 rounded-xl text-xs font-semibold transition cursor-pointer shadow-sm hover:text-white"
              title="Restore Level 1 & Level 2 submissions (Drills 1.1–2.5)"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Restore My Submissions</span>
            </button>
            <div className="flex items-center space-x-3 bg-slate-950/80 px-4 py-2.5 rounded-xl border border-slate-800 text-xs">
              <div className="text-right">
                <div className="text-slate-400 text-[11px]">Gym Drills Mastered</div>
                <div className="text-indigo-400 font-bold text-sm">
                  {progress.completedDrillIds.length} / {POM_MENTOR_DRILLS.length}
                </div>
              </div>
              <Award className="w-6 h-6 text-amber-400" />
            </div>
          </div>
        </div>

        {restoreNotification && (
          <div className="mt-3 p-2.5 bg-emerald-950/90 border border-emerald-500/50 rounded-xl text-xs text-emerald-200 flex items-center space-x-2 animate-in fade-in slide-in-from-top-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{restoreNotification}</span>
          </div>
        )}

        {/* Level Navigation Selector */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {POM_LEVELS.map(lvl => {
            const isSelected = selectedLevel === lvl.level;
            const levelDrills = POM_MENTOR_DRILLS.filter(d => d.level === lvl.level);
            const levelPassed = levelDrills.filter(d => progress.completedDrillIds.includes(d.id)).length;

            return (
              <button
                key={lvl.level}
                onClick={() => {
                  setSelectedLevel(lvl.level);
                  const firstDrillOfLevel = levelDrills[0];
                  if (firstDrillOfLevel) {
                    handleSelectDrill(firstDrillOfLevel);
                  }
                }}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-slate-950/70 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <span>Level {lvl.level}: {lvl.title.split(':')[0]}</span>
                {levelPassed > 0 && (
                  <span className="text-[10px] bg-slate-900/60 px-1.5 py-0.2 rounded text-emerald-300 font-bold">
                    {levelPassed}/{levelDrills.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Split Layout: Drill List & Active Drill */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Drills in Current Level */}
        <div className="lg:col-span-4 min-w-0 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3 overflow-hidden">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Level {selectedLevel} Drills
              </h3>
              <span className="text-[11px] text-slate-500 shrink-0">
                {POM_MENTOR_DRILLS.filter(d => d.level === selectedLevel).length} Drills
              </span>
            </div>

            <div className="space-y-2">
              {POM_MENTOR_DRILLS.filter(d => d.level === selectedLevel).map(drill => {
                const isActive = drill.id === activeDrill.id;
                const isPassed = progress.completedDrillIds.includes(drill.id);

                return (
                  <button
                    key={drill.id}
                    onClick={() => handleSelectDrill(drill)}
                    className={`w-full text-left p-3 rounded-lg border transition cursor-pointer flex items-start justify-between gap-2.5 overflow-hidden ${
                      isActive
                        ? 'bg-indigo-950/70 border-indigo-500/80 text-white shadow-sm'
                        : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-indigo-300 font-bold shrink-0">
                          {drill.drillNumber}
                        </span>
                        {drill.isReviewChallenge && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 shrink-0">
                            Mastery Gate
                          </span>
                        )}
                      </div>
                      <div className="text-xs font-semibold leading-tight break-words">
                        {drill.title}
                      </div>
                      {drill.focusSkills && drill.focusSkills.length > 0 && (
                        <div className="text-[10px] text-slate-400 truncate pt-0.5 font-sans">
                          {drill.focusSkills.slice(0, 2).join(' • ')}
                          {drill.focusSkills.length > 2 ? ` (+${drill.focusSkills.length - 2} more)` : ''}
                        </div>
                      )}
                    </div>
                    <div className="shrink-0 pt-0.5">
                      {isPassed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-600" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mentor Status & Progress Card (Strict Format from Instructions) */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3 overflow-hidden">
            <div className="flex items-center space-x-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
              <BrainCircuit className="w-4 h-4" />
              <span>Mentor Progress Tracker</span>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/90 font-mono text-[11px] space-y-2 text-slate-300">
              <div>
                <span className="text-slate-500">Current level:</span>{' '}
                <span className="text-cyan-300 font-bold">Level {selectedLevel}: {POM_LEVELS.find(l => l.level === selectedLevel)?.title}</span>
              </div>

              <div>
                <span className="text-slate-500">Skills mastered:</span>{' '}
                {levelSkillsMastered.length > 0 ? (
                  <ul className="list-disc list-inside text-emerald-400 mt-1">
                    {levelSkillsMastered.map((s, i) => (
                      <li key={i} className="text-[10px]">{s}</li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-slate-400 italic">None yet (Solve Drill {selectedLevel}.1)</span>
                )}
              </div>

              <div>
                <span className="text-slate-500">Skills needing practice:</span>{' '}
                {levelSkillsNeedingPractice.length > 0 ? (
                  <ul className="list-disc list-inside text-amber-400 mt-1">
                    {levelSkillsNeedingPractice.map((s, i) => (
                      <li key={i} className="text-[10px]">{s}</li>
                    ))}
                  </ul>
                ) : (
                  <div className="mt-1 flex items-center space-x-1.5 text-emerald-400 font-semibold text-[10px] bg-emerald-950/60 border border-emerald-800/60 px-2 py-1.5 rounded">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                    <span>All Level {selectedLevel} skills mastered ({levelSkillsMastered.length}/{currentLevelSkills.length})!</span>
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Mastery scores (0-4 scale):</span>
                  <span className="text-[10px] text-indigo-400 font-semibold">Level {selectedLevel} Focus ({levelSkillsMastered.length}/{currentLevelSkills.length})</span>
                </div>
                <div className="space-y-1.5 mt-2">
                  {currentLevelSkills.map((skill) => {
                    const score = progress.masteryScores[skill] || 0;
                    return (
                      <div key={skill} className="flex items-center justify-between bg-slate-900/90 border border-slate-800/80 px-2.5 py-1.5 rounded-md min-w-0 gap-2">
                        <div className="flex items-center space-x-1.5 pr-1 leading-tight min-w-0 flex-1">
                          {score >= 4 ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          ) : score > 0 ? (
                            <div className="w-3.5 h-3.5 rounded-full border border-indigo-400/60 bg-indigo-500/20 shrink-0" />
                          ) : (
                            <div className="w-3.5 h-3.5 rounded-full border border-slate-700 bg-slate-800 shrink-0" />
                          )}
                          <span className={`text-[11px] font-sans truncate ${score >= 4 ? 'text-slate-200 font-medium' : 'text-slate-400'}`} title={skill}>
                            {skill}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 shrink-0">
                          <div className="w-12 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${
                                score >= 4 ? 'bg-emerald-400' : score > 0 ? 'bg-indigo-400' : 'bg-slate-700'
                              }`}
                              style={{ width: `${(score / 4) * 100}%` }}
                            />
                          </div>
                          <span className={`font-bold font-mono text-[11px] w-6 text-right ${
                            score >= 4 ? 'text-emerald-400' : score > 0 ? 'text-indigo-300' : 'text-slate-500'
                          }`}>
                            {score}/4
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Next Drill / Next Level Navigation */}
              <div className="pt-2 border-t border-slate-800 space-y-2">
                {isLevelFullyMastered && nextLevelObj ? (
                  <div className="p-2.5 bg-indigo-950/70 border border-indigo-500/50 rounded-lg space-y-1.5">
                    <div className="flex items-center space-x-1.5 text-indigo-300 font-bold text-[11px]">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>Level {selectedLevel} Mastered! Ready for Level {selectedLevel + 1}</span>
                    </div>
                    <p className="text-[10px] text-slate-300">
                      {nextLevelObj.title}: Explore {nextLevelObj.focusSkills[0]} & more.
                    </p>
                    <button
                      onClick={() => {
                        const firstNextDrill = POM_MENTOR_DRILLS.find(d => d.level === selectedLevel + 1);
                        if (firstNextDrill) {
                          handleSelectDrill(firstNextDrill);
                        }
                      }}
                      className="w-full flex items-center justify-center space-x-1.5 py-1.5 px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-bold text-[11px] transition cursor-pointer shadow"
                    >
                      <span>Advance to Level {selectedLevel + 1} ({POM_MENTOR_DRILLS.find(d => d.level === selectedLevel + 1)?.drillNumber})</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : nextDrill ? (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Next drill:</span>
                      <button
                        onClick={() => handleSelectDrill(nextDrill)}
                        className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold underline cursor-pointer"
                      >
                        Jump to {nextDrill.drillNumber} →
                      </button>
                    </div>
                    <span className="text-indigo-300 font-bold block">{nextDrill.drillNumber}: {nextDrill.title}</span>
                    <div>
                      <span className="text-slate-500">Reason for the next drill:</span>{' '}
                      <span className="text-slate-300 block text-[10px] mt-0.5">
                        {nextDrill.id === 'drill-1-2'
                          ? 'Connect your newly created LoginPage to a real Playwright test specification (*.spec.ts) and verify expectations using web-first assertions.'
                          : nextDrill.scenario}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="text-emerald-400 text-[11px] font-bold flex items-center space-x-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>All Page Object Model drills completed!</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Active Drill Workspace */}
        <div className="lg:col-span-8 min-w-0 space-y-5">
          {/* Drill Specification Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
              <div>
                <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">
                  {activeDrill.levelTitle}
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  {activeDrill.drillNumber}: {activeDrill.title}
                </h3>
                {activeDrill.focusSkills && activeDrill.focusSkills.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 mt-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Drill Skills:</span>
                    {activeDrill.focusSkills.map((skill, sIdx) => {
                      const isSkillMastered = (progress.masteryScores[skill] || 0) >= 4;
                      return (
                        <span
                          key={sIdx}
                          className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-mono border ${
                            isSkillMastered
                              ? 'bg-emerald-950/70 border-emerald-800/80 text-emerald-300'
                              : 'bg-slate-800/80 border-slate-700/80 text-slate-300'
                          }`}
                        >
                          <CheckCircle2 className={`w-3 h-3 ${isSkillMastered ? 'text-emerald-400' : 'text-slate-500'}`} />
                          <span>{skill}</span>
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>

              {progress.completedDrillIds.includes(activeDrill.id) && (
                <span className="inline-flex items-center space-x-1 bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs font-bold px-2.5 py-1 rounded-full self-start sm:self-auto">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Mastered</span>
                </span>
              )}
            </div>

            {/* 0. Beginner-Friendly Explanation & Sample Block */}
            {activeDrill.beginnerGuide && (
              <div className="bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-slate-950 border border-indigo-800/60 rounded-xl overflow-hidden shadow-sm">
                <button
                  type="button"
                  onClick={() => setShowBeginnerGuide(prev => !prev)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-indigo-950/60 hover:bg-indigo-900/50 transition cursor-pointer text-left border-b border-indigo-800/40"
                >
                  <div className="flex items-center space-x-2.5">
                    <span className="p-1 rounded-md bg-indigo-500/20 text-indigo-300">
                      <GraduationCap className="w-4 h-4" />
                    </span>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
                          Beginner Guide & Concept Explanation
                        </span>
                        <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-1.5 py-0.5 rounded font-medium">
                          Essential Concept
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-white mt-0.5">
                        {activeDrill.beginnerGuide.concept}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1.5 text-xs text-indigo-300 font-medium">
                    <span>{showBeginnerGuide ? 'Collapse' : 'Show Explanation & Sample'}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showBeginnerGuide ? 'rotate-180' : ''}`} />
                  </div>
                </button>

                {showBeginnerGuide && (
                  <div className="p-4 space-y-3.5 text-xs">
                    {/* Why It Matters */}
                    <div className="space-y-1">
                      <span className="font-bold text-indigo-300 flex items-center space-x-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Why This Matters:</span>
                      </span>
                      <p className="text-slate-300 leading-relaxed pl-5 whitespace-pre-line">
                        {activeDrill.beginnerGuide.whyItMatters}
                      </p>
                    </div>

                    {/* Mental Model */}
                    <div className="space-y-1 bg-indigo-950/30 border border-indigo-800/30 rounded-lg p-2.5">
                      <span className="font-bold text-amber-300 flex items-center space-x-1.5">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                        <span>Mental Model to Remember:</span>
                      </span>
                      <p className="text-slate-300 leading-relaxed pl-5 whitespace-pre-line">
                        {activeDrill.beginnerGuide.mentalModel}
                      </p>
                    </div>

                    {/* Code Sample */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between text-[11px] text-slate-300">
                        <span className="font-bold text-cyan-300 flex items-center space-x-1.5">
                          <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Code Sample & Blueprint:</span>
                        </span>
                        <span className="text-slate-400 text-[11px] italic">
                          {activeDrill.beginnerGuide.sampleDescription}
                        </span>
                      </div>
                      <HighlightedCodeSnippet
                        code={activeDrill.beginnerGuide.sampleCode}
                        language="typescript"
                        filename="ReferenceSample.ts"
                        maxHeight="260px"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 1. Short Scenario */}
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                1. Scenario
              </h4>
              <p className="text-xs text-slate-200 bg-slate-950 p-3 rounded-lg border border-slate-800/90 leading-relaxed">
                {activeDrill.scenario}
              </p>
            </div>

            {/* 2. The Task */}
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                2. Task Requirements
              </h4>
              <div className="text-xs text-slate-200 bg-slate-950 p-3 rounded-lg border border-slate-800/90 leading-relaxed whitespace-pre-line">
                {activeDrill.task}
              </div>
            </div>

            {/* 3. Success Criteria */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                3. Success Criteria
              </h4>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-1.5 text-xs text-slate-300">
                {activeDrill.successCriteria.map((criterion, idx) => (
                  <li key={idx} className="flex items-start space-x-2 bg-slate-950/60 p-2 rounded border border-slate-800/60">
                    <span className="text-indigo-400 font-bold shrink-0 mt-0.5">▪</span>
                    <span>{criterion}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 4. Architectural Evaluation Rubric & Code Standards (Good vs. Bad Code) */}
            <div className="pt-3 border-t border-slate-800 space-y-2.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                  <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                    4. Evaluation Rubric & Code Standards (Good vs. Bad Code)
                  </h4>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      const anyOpen = Object.values(expandedDrillRubricCards).some(Boolean);
                      setExpandedDrillRubricCards({
                        0: !anyOpen,
                        1: !anyOpen,
                        2: !anyOpen,
                        3: !anyOpen
                      });
                    }}
                    className="text-[10px] text-indigo-300 hover:text-indigo-200 font-semibold cursor-pointer px-2 py-0.5 bg-indigo-950/80 rounded border border-indigo-800/60 transition"
                  >
                    {Object.values(expandedDrillRubricCards).some(Boolean) ? 'Collapse All Examples' : 'Expand All Examples'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDrillRubricSection(prev => !prev)}
                    className="text-[11px] text-slate-400 hover:text-slate-200 font-semibold cursor-pointer flex items-center space-x-1 transition"
                  >
                    <span>{showDrillRubricSection ? 'Hide Section' : 'Show Section'}</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showDrillRubricSection ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </div>

              {showDrillRubricSection && (
                <div className="space-y-3 pt-1 animate-in fade-in duration-200">
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    This drill is evaluated against the following 4 SDET architectural criteria. Review the rationales and compare the <span className="text-rose-300 font-semibold">Anti-Pattern (What to Avoid)</span> against the <span className="text-emerald-300 font-semibold">Best Practice (Production Standard)</span>:
                  </p>

                  <div className="space-y-2.5">
                    {getRubricForDrill(activeDrill.id).map((item, idx) => (
                      <div key={idx} className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0"></span>
                            <span className="text-xs font-bold text-slate-200">{item.criterion}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/60 font-mono">
                              {item.rationale}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setExpandedDrillRubricCards(prev => ({ ...prev, [idx]: !prev[idx] }))}
                            className="text-[11px] text-amber-300 hover:text-amber-200 font-medium flex items-center space-x-1 cursor-pointer self-start sm:self-auto"
                          >
                            <span>{expandedDrillRubricCards[idx] ? 'Hide Examples' : 'Show Good vs Bad Examples'}</span>
                            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${expandedDrillRubricCards[idx] ? 'rotate-180' : ''}`} />
                          </button>
                        </div>

                        <p className="text-[11px] text-slate-300 bg-slate-900/90 p-2.5 rounded-lg border border-slate-800/80 leading-relaxed">
                          <strong className="text-slate-400 font-medium">SDET Architectural Rationale: </strong>
                          {item.notes}
                        </p>

                        {expandedDrillRubricCards[idx] && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1 animate-in fade-in duration-200">
                            <div className="bg-rose-950/30 border border-rose-900/60 rounded-lg p-2.5 space-y-1.5">
                              <div className="text-xs font-bold text-rose-300 flex items-center space-x-1.5">
                                <span>❌ Anti-Pattern (What to Avoid)</span>
                              </div>
                              <pre className="p-2.5 bg-slate-950 rounded border border-rose-900/50 font-mono text-[10px] text-rose-200 overflow-x-auto whitespace-pre leading-relaxed">
                                {item.badExample}
                              </pre>
                            </div>

                            <div className="bg-emerald-950/30 border border-emerald-900/60 rounded-lg p-2.5 space-y-1.5">
                              <div className="text-xs font-bold text-emerald-300 flex items-center space-x-1.5">
                                <span>✅ SDET Best Practice (Production Standard)</span>
                              </div>
                              <pre className="p-2.5 bg-slate-950 rounded border border-emerald-900/50 font-mono text-[10px] text-emerald-200 overflow-x-auto whitespace-pre leading-relaxed">
                                {item.goodExample}
                              </pre>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 5. One Hint Only */}
            <div className="pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleToggleHint}
                  className="flex items-center space-x-1.5 text-xs text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>{showHint ? 'Hide Hint' : 'Need One Hint? (Click to Reveal)'}</span>
                </button>
              </div>

              {showHint && (
                <div className="mt-2 bg-amber-950/30 border border-amber-800/60 text-amber-200 text-xs p-3 rounded-lg leading-relaxed">
                  <strong>Mentor Hint:</strong> {activeDrill.hint}
                </div>
              )}
            </div>
          </div>

          {/* Interactive Code Editor */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
            <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-500"></span>
                <span>PageObject.ts (TypeScript Editor)</span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleSubmitReview}
                  disabled={isSubmitting || isEvaluating}
                  title="Submit code for Mentor Review (Ctrl+Enter or ⌘+Enter)"
                  className="flex items-center space-x-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 px-2.5 py-1 rounded shadow transition cursor-pointer"
                >
                  {isEvaluating ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Send className="w-3 h-3" />
                  )}
                  <span>{isEvaluating ? 'Evaluating...' : 'Submit Code'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleClearCode}
                  title="Clear snippet to start practice from scratch"
                  className="flex items-center space-x-1 text-xs text-rose-400 hover:text-rose-200 px-2 py-1 rounded bg-slate-900 hover:bg-rose-950/60 border border-slate-800 hover:border-rose-900 transition cursor-pointer"
                >
                  <Trash2 className="w-3 h-3 text-rose-400" />
                  <span>Clear</span>
                </button>
                <button
                  type="button"
                  onClick={handleResetCode}
                  title="Reset to original drill template"
                  className="flex items-center space-x-1 text-xs text-slate-400 hover:text-slate-200 px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 transition cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            <CodeEditor
              id="pom-mentor-code-editor"
              value={code}
              onChange={(val) => {
                setCode(val);
                if (reviewResult) {
                  setIsModifiedSinceReview(true);
                }
                setProgress(p => ({
                  ...p,
                  savedCode: {
                    ...p.savedCode,
                    [activeDrill.id]: val
                  }
                }));
              }}
              onClear={handleClearCode}
              onSubmit={handleSubmitReview}
              minHeight="320px"
              isApproved={progress.completedDrillIds.includes(activeDrill.id)}
            />

            {/* Action Buttons */}
            <div className="p-4 bg-slate-900 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-[11px] text-slate-400">
                Rule 7: Code is evaluated for reliability, accessibility, and clean POM design. Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px] border border-slate-700">Ctrl+Enter</kbd> or <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px] border border-slate-700">⌘+Enter</kbd> to submit anytime.
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleSubmitReview}
                  disabled={isSubmitting || isEvaluating}
                  className="flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold px-4 py-2 rounded-lg transition shadow-md cursor-pointer"
                >
                  {isEvaluating ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                  <span>{isEvaluating ? 'Evaluating Page Object...' : 'Submit for Mentor Review'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Alert if code was modified after review */}
          {isModifiedSinceReview && reviewResult && !isEvaluating && (
            <div className="bg-amber-950/40 border border-amber-500/50 text-amber-200 px-4 py-3 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-md animate-in fade-in duration-200">
              <div className="flex items-center space-x-2 text-xs">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  <strong className="text-amber-300">Code modified:</strong> The evaluation below reflects your previous attempt. Re-submit your updated script to re-evaluate.
                </span>
              </div>
              <button
                type="button"
                onClick={handleSubmitReview}
                disabled={isSubmitting || isEvaluating}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-3 py-1 rounded-lg text-xs cursor-pointer shrink-0 transition flex items-center space-x-1"
              >
                <Send className="w-3 h-3" />
                <span>Re-Submit Now</span>
              </button>
            </div>
          )}

          {/* Active Evaluation Shimmer */}
          {isEvaluating && (
            <div className="p-5 rounded-xl border border-indigo-700/60 bg-indigo-950/40 text-indigo-200 flex items-center space-x-3.5 shadow-xl animate-pulse">
              <Loader2 className="w-6 h-6 text-indigo-400 animate-spin shrink-0" />
              <div className="space-y-0.5">
                <div className="text-sm font-bold text-white flex items-center space-x-2">
                  <span>Evaluating Page Object Script...</span>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-indigo-900 border border-indigo-700 text-indigo-200">
                    Analyzing
                  </span>
                </div>
                <div className="text-xs text-indigo-300">
                  Running SDET architectural rubric checks: AST validation, locators, return types, and Playwright auto-waiting rules.
                </div>
              </div>
            </div>
          )}

          {/* Review Feedback Result */}
          {reviewResult && !isEvaluating && (
            <div
              key={evaluationKey}
              ref={reviewFeedbackRef}
              tabIndex={-1}
              className={`p-5 rounded-xl border space-y-3 scroll-mt-6 animate-in fade-in zoom-in-[0.99] duration-250 ${
              reviewResult.classification === 'Correct'
                ? 'bg-emerald-950/40 border-emerald-800/80 text-emerald-200'
                : reviewResult.classification === 'Partially Correct'
                ? 'bg-amber-950/40 border-amber-800/80 text-amber-200'
                : 'bg-rose-950/40 border-rose-800/80 text-rose-200'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-1 border-b border-white/10">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                    reviewResult.classification === 'Correct'
                      ? 'bg-emerald-900 text-emerald-200 border border-emerald-700'
                      : 'bg-rose-900 text-rose-200 border border-rose-700'
                  }`}>
                    Classification: {reviewResult.classification}
                  </span>
                  <span className="text-xs font-semibold text-slate-300">
                    Mastery Score: <strong className="text-white">{reviewResult.score}/4</strong>
                  </span>
                  {evaluationTimestamp && (
                    <span className="flex items-center space-x-1 text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900/90 border border-slate-700/70 text-slate-300">
                      <Clock className="w-3 h-3 text-cyan-400" />
                      <span>Evaluated at {evaluationTimestamp}</span>
                    </span>
                  )}
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900/90 border border-slate-700/70 text-slate-400">
                    Attempt #{progress.drillAttempts[activeDrill.id] || 1}
                  </span>
                </div>

                {nextDrill && reviewResult.classification === 'Correct' && (
                  <button
                    type="button"
                    onClick={() => handleSelectDrill(nextDrill)}
                    className="flex items-center space-x-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition cursor-pointer self-start sm:self-auto shadow"
                  >
                    <span>Next Drill: {nextDrill.drillNumber}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Mentor Diagnosis Callout Card */}
              <div className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start gap-3 shadow-lg ${
                reviewResult.classification === 'Correct'
                  ? 'bg-emerald-950/70 border-emerald-700/80 text-emerald-100'
                  : reviewResult.classification === 'Partially Correct'
                  ? 'bg-amber-950/70 border-amber-600/80 text-amber-100'
                  : 'bg-rose-950/70 border-rose-700/80 text-rose-100'
              }`}>
                <div className="p-2 rounded-lg bg-black/40 shrink-0 mt-0.5">
                  {reviewResult.classification === 'Correct' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-amber-400" />
                  )}
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs uppercase font-bold tracking-wider opacity-90">
                      Mentor Diagnosis:
                    </span>
                    {reviewResult.primaryIssue && (
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-black/50 border border-white/20 text-white shadow-sm">
                        {reviewResult.primaryIssue}
                      </span>
                    )}
                  </div>
                  <p className="text-xs leading-relaxed text-slate-200 pt-0.5">
                    {reviewResult.explanation}
                  </p>
                  {reviewResult.followUpQuestion && (
                    <div className="text-xs text-indigo-300 pt-1.5 flex items-start space-x-1.5 font-medium">
                      <HelpCircle className="w-3.5 h-3.5 shrink-0 text-indigo-400 mt-0.5" />
                      <span><strong className="text-indigo-200">SDET Follow-Up:</strong> {reviewResult.followUpQuestion}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Explicit Rubric & Architectural Rationale on Canvas */}
              {reviewResult.scoreBreakdown && reviewResult.scoreBreakdown.length > 0 && (
                <div className="bg-slate-950/95 rounded-xl p-4 sm:p-5 border border-slate-800 shadow-xl space-y-4 mt-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 gap-2.5">
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></div>
                        <span className="text-sm font-bold text-amber-300 uppercase tracking-wider">
                          Architectural Evaluation Rubric & Scoring Rationale
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 pl-4.5">
                        Production code standards, grading breakdown, and side-by-side Good vs. Bad code implementations:
                      </p>
                    </div>

                    <div className="flex items-center space-x-2 self-start sm:self-auto">
                      <button
                        type="button"
                        onClick={() => {
                          const anyOpen = Object.values(expandedRubricExamples).some(v => v !== false);
                          const nextState: Record<number, boolean> = {};
                          reviewResult.scoreBreakdown?.forEach((_, i) => {
                            nextState[i] = !anyOpen;
                          });
                          setExpandedRubricExamples(nextState);
                        }}
                        className="text-[11px] font-semibold px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-lg transition cursor-pointer flex items-center space-x-1"
                      >
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${Object.values(expandedRubricExamples).some(v => v !== false) ? 'rotate-180' : ''}`} />
                        <span>{Object.values(expandedRubricExamples).some(v => v !== false) ? 'Collapse Code Examples' : 'Expand All Code Examples'}</span>
                      </button>
                      <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-200">
                        Score: <strong className={reviewResult.score === 4 ? 'text-emerald-400' : 'text-amber-400'}>{reviewResult.score}/4</strong>
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 pt-1">
                    {reviewResult.scoreBreakdown.map((item, idx) => {
                      const isExpanded = expandedRubricExamples[idx] !== false;
                      return (
                        <div key={idx} className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-2 transition">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                            <div className="flex items-center space-x-2">
                              <span className={`w-5 h-5 flex items-center justify-center rounded-full text-xs font-bold shrink-0 ${
                                item.awarded === item.max
                                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/80'
                                  : 'bg-rose-950 text-rose-300 border border-rose-700/80'
                              }`}>
                                {item.awarded === item.max ? '✓' : '✗'}
                              </span>
                              <span className="text-xs sm:text-sm font-bold text-slate-100">{item.criterion}</span>
                              {item.rationale && (
                                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-950/80 text-indigo-300 border border-indigo-800/80 font-mono">
                                  {item.rationale}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center space-x-2 self-start sm:self-auto">
                              {(item.goodExample || item.badExample) && (
                                <button
                                  type="button"
                                  onClick={() => setExpandedRubricExamples(prev => ({ ...prev, [idx]: !isExpanded }))}
                                  className="text-[11px] text-amber-300 hover:text-amber-200 font-medium flex items-center space-x-1 cursor-pointer"
                                >
                                  <span>{isExpanded ? 'Hide Code' : 'Show Good vs Bad Code'}</span>
                                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                                </button>
                              )}
                              <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded shrink-0 ${
                                item.awarded === item.max
                                  ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/60'
                                  : 'bg-rose-950/60 text-rose-400 border border-rose-800/60'
                              }`}>
                                +{item.awarded}/{item.max}
                              </span>
                            </div>
                          </div>

                          <div className="text-[11px] text-slate-300 pl-7 leading-relaxed bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                            <strong className="text-slate-400 font-medium">SDET Architectural Rationale: </strong>
                            {item.notes}
                          </div>

                          {(item.goodExample || item.badExample) && isExpanded && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 mt-2 pl-7 pt-1 animate-in fade-in duration-200">
                              {item.badExample && (
                                <div className="bg-rose-950/40 border border-rose-800/80 rounded-lg p-2.5 space-y-1.5">
                                  <div className="text-xs font-bold text-rose-300 flex items-center space-x-1.5">
                                    <span>❌ Anti-Pattern (What to Avoid)</span>
                                  </div>
                                  <pre className="p-2.5 bg-slate-950 rounded border border-rose-900/60 font-mono text-[10px] text-rose-200 overflow-x-auto whitespace-pre leading-relaxed">
                                    {item.badExample}
                                  </pre>
                                </div>
                              )}
                              {item.goodExample && (
                                <div className="bg-emerald-950/40 border border-emerald-800/80 rounded-lg p-2.5 space-y-1.5">
                                  <div className="text-xs font-bold text-emerald-300 flex items-center space-x-1.5">
                                    <span>✅ SDET Best Practice (Production Standard)</span>
                                  </div>
                                  <pre className="p-2.5 bg-slate-950 rounded border border-emerald-900/60 font-mono text-[10px] text-emerald-200 overflow-x-auto whitespace-pre leading-relaxed">
                                    {item.goodExample}
                                  </pre>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {reviewResult.followUpQuestion && (
                <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800 text-xs text-cyan-300 space-y-1">
                  <span className="font-bold uppercase tracking-wider text-[10px] text-cyan-400">
                    Mentor Understanding Check:
                  </span>
                  <p>{reviewResult.followUpQuestion}</p>
                </div>
              )}

              <div className="pt-2 flex items-center justify-between border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={() => setShowSolution(!showSolution)}
                  className="flex items-center space-x-1.5 text-xs text-slate-400 hover:text-slate-200 cursor-pointer"
                >
                  {showSolution ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showSolution ? 'Hide Reference Solution' : 'Show Reference Solution & Defense'}</span>
                </button>
              </div>

              {showSolution && (
                <div className="mt-3 bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                    Reference Approved Solution
                  </span>
                  <HighlightedCodeSnippet
                    code={activeDrill.validation.solutionCode}
                    filename="ApprovedPageObject.ts"
                    language="typescript"
                  />
                  <p className="text-xs text-slate-400 italic">
                    Defense: {activeDrill.validation.explanation}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Global Evaluation Rubrics & Code Examples Modal */}
      {showRubricModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  <ShieldCheck className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    SDET Evaluation Rubric & Code Standards Guide
                  </h3>
                  <p className="text-xs text-slate-400">
                    Production quality benchmarks and side-by-side anti-pattern comparisons for all POM drills.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowRubricModal(false)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Level & Drill Selector in Modal */}
            <div className="px-6 py-3 border-b border-slate-800 bg-slate-950/40 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-slate-400 mr-1">Filter by Level:</span>
              {POM_LEVELS.map(lvl => (
                <button
                  key={lvl.level}
                  type="button"
                  onClick={() => setRubricModalSelectedLevel(lvl.level)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    rubricModalSelectedLevel === lvl.level
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 border border-slate-700'
                  }`}
                >
                  Level {lvl.level}: {lvl.title.split(' ')[0]}
                </button>
              ))}
            </div>

            {/* Modal Content: Scrollable Rubrics */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {POM_MENTOR_DRILLS.filter(d => d.level === rubricModalSelectedLevel).map(drill => {
                const rubrics = getRubricForDrill(drill.id);
                return (
                  <div key={drill.id} className="bg-slate-950/90 border border-slate-800 rounded-xl p-4 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-800/80 gap-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                          {drill.drillNumber}
                        </span>
                        <h4 className="text-sm font-bold text-white">{drill.title}</h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          handleSelectDrill(drill);
                          setShowRubricModal(false);
                        }}
                        className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold underline cursor-pointer self-start sm:self-auto"
                      >
                        Load this drill in workspace →
                      </button>
                    </div>

                    <div className="space-y-3">
                      {rubrics.map((item, idx) => (
                        <div key={idx} className="bg-slate-900/80 border border-slate-800/90 rounded-lg p-3 space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                            <span className="text-xs font-bold text-slate-200">{item.criterion}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/60 font-mono">
                              {item.rationale}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-300 bg-slate-950/60 p-2 rounded border border-slate-800/80 leading-relaxed">
                            <strong className="text-slate-400 font-medium">SDET Architectural Rationale: </strong>
                            {item.notes}
                          </p>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
                            <div className="bg-rose-950/30 border border-rose-900/60 rounded-lg p-2.5 space-y-1.5">
                              <div className="text-xs font-bold text-rose-300 flex items-center space-x-1.5">
                                <span>❌ Anti-Pattern (What to Avoid)</span>
                              </div>
                              <pre className="p-2.5 bg-slate-950 rounded border border-rose-900/50 font-mono text-[10px] text-rose-200 overflow-x-auto whitespace-pre leading-relaxed">
                                {item.badExample}
                              </pre>
                            </div>

                            <div className="bg-emerald-950/30 border border-emerald-900/60 rounded-lg p-2.5 space-y-1.5">
                              <div className="text-xs font-bold text-emerald-300 flex items-center space-x-1.5">
                                <span>✅ SDET Best Practice (Production Standard)</span>
                              </div>
                              <pre className="p-2.5 bg-slate-950 rounded border border-emerald-900/50 font-mono text-[10px] text-emerald-200 overflow-x-auto whitespace-pre leading-relaxed">
                                {item.goodExample}
                              </pre>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Playwright POM Mentorship • Continuous SDET Evaluation Standards
              </span>
              <button
                type="button"
                onClick={() => setShowRubricModal(false)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition cursor-pointer"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
