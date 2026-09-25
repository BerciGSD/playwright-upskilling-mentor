import { useState } from 'react';
import { X, Download, Copy, Check, ExternalLink, Image as ImageIcon, Terminal, Sparkles } from 'lucide-react';

interface ScreenshotsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ScreenshotItem {
  id: string;
  title: string;
  badge: string;
  description: string;
  repoPath: string;
  srcUrl: string;
  markdown: string;
}

const SCREENSHOTS: ScreenshotItem[] = [
  {
    id: 'pom-mentor',
    title: 'POM Architecture Mentor Gym & Evaluator',
    badge: 'Core Feature · 7 Levels / 35 Drills',
    description: 'Displays the 7-level Page Object Model architectural arena, real-time static AST anti-pattern analysis, and rubric scorecards.',
    repoPath: 'docs/images/pom-mentor-arena.jpg',
    srcUrl: '/screenshots/pom-mentor-arena.jpg',
    markdown: '![POM Architecture Mentor Gym](docs/images/pom-mentor-arena.jpg)',
  },
  {
    id: 'target-sandbox',
    title: 'Live Target Application Sandbox',
    badge: 'Interactive Testbed',
    description: 'Features the embedded multi-scenario web app (checkout wizards, async loaders, dialogs) for realistic locator resilience testing.',
    repoPath: 'docs/images/target-app-sandbox.jpg',
    srcUrl: '/screenshots/target-app-sandbox.jpg',
    markdown: '![Live Target App Sandbox](docs/images/target-app-sandbox.jpg)',
  },
  {
    id: 'student-dashboard',
    title: 'Student Analytics & POM Skills Radar',
    badge: 'SDET Competency Radar',
    description: 'Visualizes proficiency progression across 8 core test architecture dimensions, anti-pattern elimination metrics, and drill tracking.',
    repoPath: 'docs/images/student-dashboard.jpg',
    srcUrl: '/screenshots/student-dashboard.jpg',
    markdown: '![Student Competency Dashboard](docs/images/student-dashboard.jpg)',
  },
];

export function ScreenshotsModal({ isOpen, onClose }: ScreenshotsModalProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const gitPushCommand = 'git add docs/images/ README.md && git commit -m "docs: add screenshots to README" && git push';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90 sticky top-0 z-10">
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold text-slate-100">
                  GitHub Repository Screenshots & Media Kit
                </h2>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-cyan-950 text-cyan-300 border border-cyan-800">
                  docs/images/
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Pre-generated 1080p high-fidelity UI assets ready to push directly to your public GitHub repo
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

        {/* Git Push Action Bar */}
        <div className="bg-slate-950/60 border-b border-slate-800/80 px-6 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2 text-slate-300 font-mono">
            <Terminal className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="text-slate-400">1-Line Push:</span>
            <code className="bg-slate-900 px-2 py-1 rounded border border-slate-800 text-cyan-300 font-mono text-[11px] truncate max-w-md">
              {gitPushCommand}
            </code>
          </div>
          <button
            onClick={() => handleCopy(gitPushCommand, 'git-push')}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/15 text-cyan-300 hover:bg-cyan-500/25 border border-cyan-500/30 transition cursor-pointer shrink-0 font-medium"
          >
            {copiedId === 'git-push' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Push Command</span>
              </>
            )}
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {SCREENSHOTS.map((item) => (
              <div
                key={item.id}
                className="bg-slate-950/80 border border-slate-800/90 rounded-xl overflow-hidden flex flex-col group hover:border-slate-700 transition shadow-lg"
              >
                {/* Image Preview with click to enlarge */}
                <div
                  className="relative aspect-video bg-slate-900 overflow-hidden cursor-pointer group"
                  onClick={() => setSelectedImg(item.srcUrl)}
                  title="Click to view full-size"
                >
                  <img
                    src={item.srcUrl}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-slate-950/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-slate-900/90 text-cyan-300 text-[11px] font-medium px-2.5 py-1 rounded-md border border-cyan-500/40 shadow-lg flex items-center space-x-1">
                      <ExternalLink className="w-3 h-3" />
                      <span>Enlarge Preview</span>
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-950 text-indigo-300 border border-indigo-800/60 mb-1.5">
                      {item.badge}
                    </span>
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
                        download={`${item.id}.jpg`}
                        className="flex items-center justify-center space-x-1 px-2.5 py-1.5 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 text-xs font-medium border border-cyan-500/40 transition cursor-pointer"
                      >
                        <Download className="w-3 h-3" />
                        <span className="text-[11px]">Download JPG</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* GitHub Portfolio Advice Card */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950/20 to-slate-900 border border-slate-800 rounded-xl p-4 flex items-start space-x-3 text-xs">
            <div className="h-8 w-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="space-y-1 text-slate-300 leading-relaxed">
              <h4 className="font-semibold text-slate-100 flex items-center space-x-2">
                <span>Already Saved In Your Project's `docs/images/` Directory</span>
              </h4>
              <p className="text-slate-400">
                These screenshots are already saved in <code className="text-cyan-300 font-mono">docs/images/</code> and referenced inside your root <code className="text-cyan-300 font-mono">README.md</code>. When you push this project to GitHub, GitHub automatically renders them in your repository homepage without requiring external image hosting.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/90 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition cursor-pointer"
          >
            Close Panel
          </button>
        </div>
      </div>

      {/* Full-Screen Zoom Modal */}
      {selectedImg && (
        <div
          className="fixed inset-0 z-60 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setSelectedImg(null)}
        >
          <div className="relative max-w-6xl w-full">
            <img
              src={selectedImg}
              alt="Enlarged screenshot"
              className="w-full h-auto rounded-xl shadow-2xl border border-slate-800"
            />
            <p className="text-center text-slate-400 text-xs mt-3">
              Click anywhere to close full preview
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
