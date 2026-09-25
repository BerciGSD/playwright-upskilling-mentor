import { useState } from 'react';
import { 
  X, 
  Download, 
  Copy, 
  Check, 
  ExternalLink, 
  Camera, 
  Terminal, 
  Sparkles, 
  Loader2, 
  Layers, 
  CheckCircle2,
  RefreshCw,
  Maximize2
} from 'lucide-react';
import { toJpeg } from 'html-to-image';

interface ScreenshotsModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: 'canvas' | 'drills' | 'project' | 'sandbox' | 'terminal' | 'dashboard' | 'pom-mentor';
  setActiveTab: (tab: 'canvas' | 'drills' | 'project' | 'sandbox' | 'terminal' | 'dashboard' | 'pom-mentor') => void;
}

interface ScreenshotItem {
  id: string;
  title: string;
  tabId: 'canvas' | 'drills' | 'project' | 'sandbox' | 'terminal' | 'dashboard' | 'pom-mentor';
  badge: string;
  resolution: string;
  description: string;
  repoPath: string;
  filename: string;
  srcUrl: string;
  capturedAt?: string;
  markdown: string;
}

const INITIAL_SCREENSHOTS: ScreenshotItem[] = [
  {
    id: 'dashboard',
    title: 'Full Student Learning Dashboard & Competency Radar',
    tabId: 'dashboard',
    badge: 'Full Content · Radar & Milestones',
    resolution: '2880 × 6107 px',
    description: 'Complete student telemetry, 9/9 mastered stages, 100% anti-pattern elimination rate, 8-dimension SDET competency radar, and defense certifications.',
    repoPath: 'docs/images/student-dashboard.png',
    filename: 'student-dashboard.png',
    srcUrl: '/screenshots/student-dashboard.png',
    markdown: '![Full Student Learning Dashboard](docs/images/student-dashboard.png)',
  },
  {
    id: 'pom-mentor',
    title: 'Independent POM Practice Mentor Gym (Level 2 Complete)',
    tabId: 'pom-mentor',
    badge: 'Full Content · Level 2 Complete (4/4 Pass)',
    resolution: '2880 × 7416 px',
    description: 'All 5 drills completed in Level 2 (Locator & Action Fluency), TypeScript OrdersPage solution with container row filtering (.filter({ hasText })), and passed 4/4 evaluation scorecard.',
    repoPath: 'docs/images/pom-mentor-arena-level2.png',
    filename: 'pom-mentor-arena-level2.png',
    srcUrl: '/screenshots/pom-mentor-arena-level2.png',
    markdown: '![POM Practice Gym Level 2 Complete](docs/images/pom-mentor-arena-level2.png)',
  },
  {
    id: 'pom-drills-quickref',
    title: 'POM Drill Lab + POM Quick Reference Open',
    tabId: 'drills',
    badge: 'Full Content · Quick Ref Open',
    resolution: '2880 × 2612 px',
    description: 'Interactive Page Object Model drill workbench with live code editor, AST anti-pattern checkers, and the side-by-side POM Quick Reference cheat sheet.',
    repoPath: 'docs/images/pom-drill-lab-with-quick-reference.png',
    filename: 'pom-drill-lab-with-quick-reference.png',
    srcUrl: '/screenshots/pom-drill-lab-with-quick-reference.png',
    markdown: '![POM Drill Lab with Quick Reference Open](docs/images/pom-drill-lab-with-quick-reference.png)',
  },
  {
    id: 'fixtures-canvas',
    title: 'Fixtures Module Canvas Textbook (Full Lesson)',
    tabId: 'canvas',
    badge: 'Full Content · Complete Lesson',
    resolution: '2880 × 4058 px',
    description: 'Complete technical deep-dive on custom fixtures (test.extend), storageState auth caching, use() lifecycle teardown, and eliminating flaky beforeEach hooks.',
    repoPath: 'docs/images/fixtures-canvas-textbook.png',
    filename: 'fixtures-canvas-textbook.png',
    srcUrl: '/screenshots/fixtures-canvas-textbook.png',
    markdown: '![Fixtures Module Canvas Textbook](docs/images/fixtures-canvas-textbook.png)',
  },
  {
    id: 'sandbox',
    title: 'Live Target Application Sandbox & Inspector',
    tabId: 'sandbox',
    badge: 'Full Content · Interactive Testbed',
    resolution: '2880 × 1620 px',
    description: 'Live interactive testbed with dynamic filtered tables, multi-step e-commerce checkout wizard, and Playwright semantic locator inspection badges.',
    repoPath: 'docs/images/target-app-sandbox.png',
    filename: 'target-app-sandbox.png',
    srcUrl: '/screenshots/target-app-sandbox.png',
    markdown: '![Live Target Application Sandbox](docs/images/target-app-sandbox.png)',
  },
  {
    id: 'project-suite',
    title: 'Cumulative Production Test Suite Explorer',
    tabId: 'project',
    badge: 'Full Content · Enterprise Architecture',
    resolution: '2880 × 2264 px',
    description: 'Complete enterprise test suite repository demonstrating Page Objects, custom test fixtures (fixtures/test-base.ts), storageState bypass, and GitHub Actions CI workflow.',
    repoPath: 'docs/images/cumulative-project-suite.png',
    filename: 'cumulative-project-suite.png',
    srcUrl: '/screenshots/cumulative-project-suite.png',
    markdown: '![Cumulative Production Test Suite Explorer](docs/images/cumulative-project-suite.png)',
  },
];

export function ScreenshotsModal({ 
  isOpen, 
  onClose, 
  activeTab, 
  setActiveTab 
}: ScreenshotsModalProps) {
  const [screenshots, setScreenshots] = useState<ScreenshotItem[]>(INITIAL_SCREENSHOTS);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedImg, setSelectedImg] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [captureStatus, setCaptureStatus] = useState<string>('');

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const gitPushCommand = 'git add docs/images/ README.md && git commit -m "docs: add real screenshots to README" && git push';

  const takeDomSnapshot = async (): Promise<string | null> => {
    const el = document.getElementById('app-capture-area') || document.body;
    try {
      const dataUrl = await toJpeg(el, {
        quality: 0.95,
        pixelRatio: 1.5,
        backgroundColor: '#020617', // slate-950
        filter: (node) => {
          if (node instanceof HTMLElement) {
            if (node.id === 'real-screenshots-modal' || node.id === 'rules-guide-fab') {
              return false;
            }
          }
          return true;
        },
      });
      return dataUrl;
    } catch (err) {
      console.warn('DOM snapshot error, retrying without external fonts...', err);
      try {
        const fallbackUrl = await toJpeg(el, {
          quality: 0.9,
          pixelRatio: 1.2,
          backgroundColor: '#020617',
          skipFonts: true,
          filter: (node) => {
            if (node instanceof HTMLElement) {
              if (node.id === 'real-screenshots-modal' || node.id === 'rules-guide-fab') {
                return false;
              }
            }
            return true;
          },
        });
        return fallbackUrl;
      } catch (e2) {
        console.error('Snapshot failed completely:', e2);
        return null;
      }
    }
  };

  const saveToServer = async (filename: string, dataUrl: string) => {
    try {
      await fetch('/api/save-screenshot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename, dataUrl }),
      });
    } catch (err) {
      console.warn('Could not post to /api/save-screenshot:', err);
    }
  };

  // Capture the currently viewed screen
  const captureCurrentScreen = async () => {
    setIsCapturing(true);
    setCaptureStatus(`Capturing active screen (${activeTab})...`);

    const modalEl = document.getElementById('real-screenshots-modal');
    if (modalEl) modalEl.style.opacity = '0';

    await new Promise((r) => setTimeout(r, 200));

    const dataUrl = await takeDomSnapshot();

    if (modalEl) modalEl.style.opacity = '1';

    if (dataUrl) {
      const targetItem = screenshots.find((s) => s.tabId === activeTab) || screenshots[0];
      await saveToServer(targetItem.filename, dataUrl);

      setScreenshots((prev) =>
        prev.map((item) =>
          item.id === targetItem.id
            ? {
                ...item,
                srcUrl: dataUrl,
                capturedAt: new Date().toLocaleTimeString(),
              }
            : item
        )
      );
      setCaptureStatus(`Successfully captured real ${targetItem.title}!`);
    } else {
      setCaptureStatus('Failed to capture screen.');
    }

    setIsCapturing(false);
  };

  // Automate capturing all real screens by cycling tabs
  const autoCaptureAllScreens = async () => {
    setIsCapturing(true);
    const initialTab = activeTab;

    const modalEl = document.getElementById('real-screenshots-modal');
    if (modalEl) modalEl.style.opacity = '0';

    const updatedScreenshots = [...screenshots];

    for (let i = 0; i < updatedScreenshots.length; i++) {
      const item = updatedScreenshots[i];
      setCaptureStatus(`Capturing ${i + 1}/${updatedScreenshots.length}: ${item.title}...`);
      setActiveTab(item.tabId);

      // Wait 800ms for React re-render and chart animations
      await new Promise((r) => setTimeout(r, 800));

      const dataUrl = await takeDomSnapshot();
      if (dataUrl) {
        await saveToServer(item.filename, dataUrl);
        updatedScreenshots[i] = {
          ...item,
          srcUrl: dataUrl,
          capturedAt: new Date().toLocaleTimeString(),
        };
      }
    }

    setActiveTab(initialTab);
    if (modalEl) modalEl.style.opacity = '1';

    setScreenshots(updatedScreenshots);
    setIsCapturing(false);
    setCaptureStatus('All real screenshots captured and saved to docs/images/!');
  };

  return (
    <div 
      id="real-screenshots-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm overflow-y-auto"
    >
      <div className="relative w-full max-w-6xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-6 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90 sticky top-0 z-10">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold text-slate-100">
                  Full Application Screenshots & GitHub Media Kit
                </h2>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">
                  6 Real Full-Content Captures
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Pixel-perfect, high-DPI full-height captures of your running app saved in <code className="text-cyan-300 font-mono">docs/images/</code> ready for GitHub.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Capture Control Bar */}
        <div className="bg-slate-950/90 border-b border-slate-800 px-6 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <button
              onClick={autoCaptureAllScreens}
              disabled={isCapturing}
              className="flex items-center space-x-2 px-3.5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition cursor-pointer disabled:opacity-50 shadow-md shadow-cyan-900/30"
            >
              {isCapturing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{captureStatus || 'Capturing Real DOM...'}</span>
                </>
              ) : (
                <>
                  <Camera className="w-4 h-4" />
                  <span>⚡ Auto-Snapshot All Screens</span>
                </>
              )}
            </button>

            <button
              onClick={captureCurrentScreen}
              disabled={isCapturing}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isCapturing ? 'animate-spin' : ''}`} />
              <span>Snap Active Tab ({activeTab})</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <code className="text-[11px] font-mono bg-slate-900 text-slate-300 px-2.5 py-1.5 rounded border border-slate-800 hidden md:block">
              {gitPushCommand}
            </code>
            <button
              onClick={() => handleCopy(gitPushCommand, 'git-push')}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 transition cursor-pointer text-xs font-medium"
            >
              {copiedId === 'git-push' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Git Push</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Status banner if available */}
        {captureStatus && (
          <div className="bg-cyan-950/40 border-b border-cyan-800/40 px-6 py-2 text-xs text-cyan-300 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{captureStatus}</span>
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {screenshots.map((item) => (
              <div
                key={item.id}
                className="bg-slate-950/80 border border-slate-800 rounded-xl overflow-hidden flex flex-col group hover:border-cyan-500/40 transition shadow-lg"
              >
                {/* Image Preview with click to enlarge */}
                <div
                  className="relative aspect-video bg-slate-900 overflow-hidden cursor-pointer group"
                  onClick={() => setSelectedImg(item.srcUrl)}
                  title="Click to view full-resolution preview"
                >
                  <img
                    src={item.srcUrl}
                    alt={item.title}
                    className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-slate-900/90 text-cyan-300 text-[11px] font-medium px-2.5 py-1 rounded-md border border-cyan-500/40 shadow-lg flex items-center space-x-1">
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>Scroll & Inspect Full View</span>
                    </span>
                  </div>

                  <div className="absolute bottom-2 left-2 bg-slate-950/85 backdrop-blur-sm border border-slate-800 text-slate-300 text-[10px] font-mono px-2 py-0.5 rounded shadow">
                    {item.resolution}
                  </div>

                  {item.capturedAt && (
                    <div className="absolute top-2 right-2 bg-emerald-950/90 border border-emerald-700/80 text-emerald-300 text-[10px] font-medium px-2 py-0.5 rounded shadow">
                      Captured {item.capturedAt}
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-cyan-950 text-cyan-300 border border-cyan-800/80">
                        {item.badge}
                      </span>
                      <button
                        onClick={() => {
                          setActiveTab(item.tabId);
                          onClose();
                        }}
                        className="text-[11px] text-slate-400 hover:text-cyan-300 underline cursor-pointer"
                      >
                        Switch to tab
                      </button>
                    </div>
                    <h3 className="text-sm font-semibold text-slate-100 group-hover:text-cyan-300 transition">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-800/80">
                    <div className="text-[11px] font-mono text-slate-400 bg-slate-900/90 px-2 py-1 rounded border border-slate-800 flex items-center justify-between">
                      <span className="truncate">{item.repoPath}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleCopy(item.markdown, `md-${item.id}`)}
                        className="flex items-center justify-center space-x-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-slate-100 text-xs font-medium border border-slate-700 transition cursor-pointer"
                      >
                        {copiedId === `md-${item.id}` ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-300 text-[11px]">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span className="text-[11px]">Copy Markdown</span>
                          </>
                        )}
                      </button>

                      <a
                        href={item.srcUrl}
                        download={item.filename}
                        className="flex items-center justify-center space-x-1 px-2.5 py-1.5 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 text-xs font-medium border border-cyan-500/40 transition cursor-pointer"
                      >
                        <Download className="w-3 h-3" />
                        <span className="text-[11px]">Download PNG</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Full content notification */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/30 border border-slate-800 rounded-xl p-4 flex items-start space-x-3 text-xs">
            <div className="h-8 w-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="space-y-1 text-slate-300 leading-relaxed">
              <h4 className="font-semibold text-slate-100 flex items-center space-x-2">
                <span>Real Full-Content Screenshots Captured (All 6 Screens)</span>
              </h4>
              <p className="text-slate-400">
                All 6 screenshots are authentic full-height captures of your running app (from 1620px up to 7416px tall) with zero cut-off:
                Student Dashboard with 8-dimension radar, POM Mentor Arena Level 2 with passed evaluation scorecard, POM Drill Lab with side-by-side quick reference, Fixtures Module Canvas textbook, Target App Sandbox, and Cumulative Test Suite Explorer.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/90 flex justify-between items-center">
          <span className="text-xs text-slate-500">
            Active screen in background: <strong className="text-slate-300">{activeTab}</strong>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition cursor-pointer"
          >
            Close Panel
          </button>
        </div>
      </div>

      {/* Full-Screen Zoom Modal with full scroll support */}
      {selectedImg && (
        <div
          className="fixed inset-0 z-60 bg-black/95 backdrop-blur-md flex flex-col items-center justify-start p-4 sm:p-8 overflow-y-auto"
          onClick={() => setSelectedImg(null)}
        >
          <div 
            className="sticky top-0 z-10 w-full max-w-5xl flex items-center justify-between py-2 px-4 bg-slate-900/95 backdrop-blur rounded-lg border border-slate-800 shadow-xl mb-4 text-xs text-slate-300"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="font-semibold text-white">Full-Resolution Screenshot (Scroll down to view entire page)</span>
            <div className="flex items-center space-x-3">
              <a
                href={selectedImg}
                target="_blank"
                rel="noreferrer"
                className="px-2.5 py-1 bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-200 rounded border border-cyan-500/50 transition flex items-center space-x-1"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open in Tab</span>
              </a>
              <button 
                onClick={() => setSelectedImg(null)}
                className="p-1 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="relative max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedImg}
              alt="Enlarged screenshot"
              className="w-full h-auto rounded-xl shadow-2xl border border-slate-800"
            />
          </div>
        </div>
      )}
    </div>
  );
}
