import { X, ShieldCheck, Award, RefreshCw, Zap, BookCheck, Terminal, AlertTriangle } from 'lucide-react';

interface RuleGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RuleGuideModal({ isOpen, onClose }: RuleGuideModalProps) {
  if (!isOpen) return null;

  const rules = [
    {
      num: 'Rule 1',
      title: 'Curriculum Roadmap Tracking',
      desc: 'Every module tracks where you are: Setup → Basics → Assertions → Debugging → POM → Fixtures → API → CI/CD → Capstone.',
      icon: BookCheck,
      color: 'text-cyan-400',
    },
    {
      num: 'Rule 2',
      title: 'One Cumulative Project',
      desc: 'All drills build into a single growing repository started in Module 1. Tests in Module 2 are refactored into Page Objects (Module 5) and Fixtures (Module 6).',
      icon: ShieldCheck,
      color: 'text-emerald-400',
    },
    {
      num: 'Rule 3',
      title: 'Just-in-Time TypeScript',
      desc: 'TypeScript is taught strictly as needed when Playwright requires it (async/await, types, interfaces, generics) — never as detached theory.',
      icon: Zap,
      color: 'text-indigo-400',
    },
    {
      num: 'Rule 4 & 13',
      title: 'Modern Craftsmanship & Clean Code',
      desc: 'Enforce web-first locators (getByRole, getByText). Strictly ban waitForTimeout(). Messy or repetitive code triggers a refactor loop.',
      icon: AlertTriangle,
      color: 'text-amber-400',
    },
    {
      num: 'Rule 10',
      title: 'Tiered Hinting System',
      desc: 'Tier 1: Conceptual explanation. Tier 2: Concept name without syntax. Tier 3: Full corrected code. Never skips ahead.',
      icon: Zap,
      color: 'text-cyan-400',
    },
    {
      num: 'Rule 11',
      title: 'Strict Mastery Gate & Escape Valve',
      desc: 'Graduate to the next module only by: (a) solving the final exercise perfectly on the first submission, AND (b) explaining why it works. After 3 failed rounds, the escape valve unlocks a worked walkthrough.',
      icon: Award,
      color: 'text-amber-400',
    },
    {
      num: 'Rule 12',
      title: 'Spaced Interleaving',
      desc: 'Every 2-3 modules, forced-recall questions bring back past topics to lock knowledge into long-term memory.',
      icon: RefreshCw,
      color: 'text-indigo-400',
    },
    {
      num: 'Rule 15',
      title: 'Portfolio Capstone',
      desc: 'A complete GitHub repository with POM, custom fixtures, auth bypass, mock API routes, and a passing CI badge on Ubuntu.',
      icon: Terminal,
      color: 'text-emerald-400',
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900/95 backdrop-blur">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">Mentorship Rules & Pedagogy</h3>
            <p className="text-xs text-slate-400">
              The 15 engineering principles guiding your journey from beginner to QA Architect.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {rules.map((rule, idx) => {
              const Icon = rule.icon;
              return (
                <div
                  key={idx}
                  className="bg-slate-950 border border-slate-800/80 rounded-xl p-3.5 space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <Icon className={`w-4 h-4 ${rule.color}`} />
                    <span className="text-xs font-bold text-slate-200">{rule.title}</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{rule.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-end">
          <button
            onClick={onClose}
            className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-4 py-1.5 rounded-lg text-xs cursor-pointer"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
}
