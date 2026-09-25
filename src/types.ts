export type RoadmapStage = 
  | 'Setup' 
  | 'Basics' 
  | 'Assertions' 
  | 'Debugging' 
  | 'POM' 
  | 'Fixtures' 
  | 'API' 
  | 'CI/CD' 
  | 'Capstone';

export type DrillType = 
  | 'predict' 
  | 'spot-and-fix' 
  | 'build-from-scratch' 
  | 'explain-concept'
  | 'checkpoint-no-notes';

export interface TieredHint {
  tier1Concept: string; // Conceptual explanation
  tier2Partial: string; // Concept name / nudge without syntax
  tier3Solution: string; // Full corrected code
}

export interface DrillValidation {
  requiredKeywords?: string[];
  forbiddenKeywords?: string[]; // e.g., waitForTimeout
  expectedPatterns?: RegExp[];
  conceptCheckPrompt?: string;
  expectedExplanationKeywords?: string[];
  solutionCode: string;
}

export interface Drill {
  id: string;
  moduleId: string;
  drillNumber: string; // e.g. "1.1", "1.2"
  title: string;
  type: DrillType;
  prompt: string;
  starterCode?: string;
  targetApp?: 'the-internet' | 'saucedemo' | 'demoqa' | 'ubuntu-cli';
  targetAppScenario?: string;
  hints: TieredHint;
  validation: DrillValidation;
  isMasteryGate?: boolean; // Final exercise of sequence requiring perfect first try + explanation
  isPenaltyAlternative?: boolean;
}

export interface ProjectFile {
  path: string;
  description: string;
  content: string;
  language: 'typescript' | 'json' | 'yaml' | 'markdown';
  highlightLines?: number[];
  moduleIntroduced: RoadmapStage;
  refactorNote?: string;
}

export interface ModuleData {
  id: string;
  stage: RoadmapStage;
  title: string;
  subtitle: string;
  estimatedTime: string;
  targetApp: string;
  theorySections: {
    title: string;
    content: string;
    codeSnippet?: {
      language: string;
      code: string;
      caption?: string;
    };
    callout?: {
      type: 'tip' | 'warning' | 'ubuntu' | 'typescript';
      title: string;
      text: string;
    };
  }[];
  justInTimeTs: {
    concept: string;
    whyNow: string;
    explanation: string;
    codeExample: string;
  };
  ubuntuTerminalCommands: {
    command: string;
    description: string;
    expectedOutput?: string;
  }[];
  drills: Drill[];
  checkpointScenario: {
    title: string;
    scenario: string;
    successCriteria: string[];
  };
}

export interface SavedDrillSolution {
  code: string;
  explanation?: string;
  passedAt: string;
  isMasteryGate?: boolean;
}

export interface StudentProgress {
  currentModuleId: string;
  completedDrillIds: string[];
  savedSolutions: Record<string, SavedDrillSolution>; // drillId -> approved solution & explanation
  draftSolutions?: Record<string, { code: string; explanation?: string }>; // drillId -> active draft in progress
  moduleStatus: Record<string, 'locked' | 'in-progress' | 'mastered' | 'needs-revisit'>;
  drillAttempts: Record<string, number>; // drillId -> count of attempts
  currentHintTier: Record<string, number>; // drillId -> tier unlocked (0, 1, 2, 3)
  penaltyCount: Record<string, number>; // concept -> failed count (for escape valve after 3)
  spacedReviewQueue: string[]; // concepts to review
}
