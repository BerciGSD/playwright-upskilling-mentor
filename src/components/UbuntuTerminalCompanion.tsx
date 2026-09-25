import { useState } from 'react';
import { Terminal, Copy, Check, Play, Info, AlertTriangle, ShieldCheck } from 'lucide-react';

export function UbuntuTerminalCompanion() {
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [terminalHistory, setTerminalHistory] = useState<
    { command: string; output: string; status: 'success' | 'info' | 'error' }[]
  >([
    {
      command: 'uname -a',
      output: 'Linux ubuntu-noble 6.8.0-31-generic #31-Ubuntu SMP PREEMPT_DYNAMIC x86_64 GNU/Linux (Ubuntu 24.04 LTS)',
      status: 'info',
    },
    {
      command: 'npx playwright --version',
      output: 'Version 1.49.0',
      status: 'success',
    },
  ]);

  const [inputCommand, setInputCommand] = useState('');

  const sampleCommands = [
    {
      label: 'Install Linux OS Deps',
      cmd: 'npx playwright install --with-deps',
      desc: 'Installs Chromium, Firefox, WebKit and required Ubuntu apt shared libraries (.so)',
      output: `Downloading Chromium 131.0.6778.33 (build 1148)...
Downloading Firefox 132.0 (build 1466)...
Downloading WebKit 18.2 (build 2083)...
Installing dependencies for browsers via apt-get...
All dependencies installed successfully!`,
      status: 'success' as const,
    },
    {
      label: 'Run Headless Suite',
      cmd: 'npx playwright test',
      desc: 'Executes all test specifications headlessly across parallel worker threads',
      output: `Running 6 tests using 4 workers
  ✓ [chromium] › tests/e2e/login.spec.ts:4:1 › standard user login (1.2s)
  ✓ [firefox]  › tests/e2e/login.spec.ts:4:1 › standard user login (1.5s)
  ✓ [webkit]   › tests/e2e/login.spec.ts:4:1 › standard user login (1.6s)
  ✓ [chromium] › tests/e2e/inventory.spec.ts:5:1 › add item to cart (1.4s)
  ✓ [firefox]  › tests/e2e/inventory.spec.ts:5:1 › add item to cart (1.7s)
  ✓ [webkit]   › tests/e2e/inventory.spec.ts:5:1 › add item to cart (1.8s)

  6 passed (4.2s)`,
      status: 'success' as const,
    },
    {
      label: 'Interactive UI Mode',
      cmd: 'npx playwright test --ui',
      desc: 'Launches graphical UI mode for time-travel debugging and watch mode (requires desktop/X11)',
      output: `Listening on http://localhost:44222
Open URL in browser to view the interactive test dashboard and locator playground.`,
      status: 'info' as const,
    },
    {
      label: 'Open Trace Viewer',
      cmd: 'npx playwright show-trace test-results/trace.zip',
      desc: 'Opens time-travel debugger on failed test execution artifact with DOM & network waterfall',
      output: `Serving trace viewer at http://127.0.0.1:9323
Press Ctrl+C to stop.`,
      status: 'info' as const,
    },
    {
      label: 'Launch Inspector',
      cmd: 'npx playwright test --debug',
      desc: 'Steps through tests line by line pausing execution at each action',
      output: `[Playwright Inspector] Paused on line 5: await page.goto('/')
Stepping into action...`,
      status: 'info' as const,
    },
  ];

  const handleRunCommand = (cmd: string, output: string, status: 'success' | 'info' | 'error') => {
    setTerminalHistory((prev) => [
      ...prev,
      { command: cmd, output, status },
    ]);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCommand.trim()) return;

    const trimmed = inputCommand.trim();
    const matched = sampleCommands.find((s) => s.cmd.toLowerCase() === trimmed.toLowerCase());

    if (matched) {
      handleRunCommand(matched.cmd, matched.output, matched.status);
    } else {
      handleRunCommand(
        trimmed,
        `Executed '${trimmed}'. (Command logged in simulated Ubuntu 24.04 terminal)`,
        'info'
      );
    }
    setInputCommand('');
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(text);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">
              Ubuntu 24.04 LTS (Noble Numbat)
            </span>
            <h2 className="text-lg font-bold text-white">Linux CLI Companion & Cheatsheet</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Official terminal commands, flags, and debugging utilities verified for Ubuntu 24.04 and GitHub Actions.
          </p>
        </div>
      </div>

      {/* Linux Architecture Specifics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center space-x-2 text-cyan-400 font-semibold text-xs">
            <Info className="w-4 h-4" />
            <span>Wayland vs X11 on Ubuntu 24.04</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Ubuntu 24.04 defaults to Wayland. When running headed tests (`--headed`), Chromium and WebKit run seamlessly, but in headless CI or SSH environments, Playwright uses headless mode (`headless: true`), which requires zero display servers.
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center space-x-2 text-emerald-400 font-semibold text-xs">
            <ShieldCheck className="w-4 h-4" />
            <span>Why --with-deps Is Mandatory on Linux</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Unlike Windows or macOS where browser frameworks ship self-contained, Linux browsers dynamically link against host C/C++ libraries (`libasound`, `libgbm`, `libxcomposite`). `--with-deps` uses `apt-get` to install these safely.
          </p>
        </div>
      </div>

      {/* Quick Run Buttons */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          Click to Simulate & Copy Ubuntu Commands
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {sampleCommands.map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-900/70 border border-slate-800 hover:border-slate-700 rounded-xl p-3 space-y-2 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200">{item.label}</span>
                  <button
                    onClick={() => handleCopy(item.cmd)}
                    className="text-slate-500 hover:text-slate-300 text-[11px] flex items-center space-x-1 cursor-pointer"
                  >
                    {copiedCmd === item.cmd ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug mt-1">{item.desc}</p>
              </div>

              <button
                onClick={() => handleRunCommand(item.cmd, item.output, item.status)}
                className="w-full mt-2 bg-slate-950 hover:bg-slate-800 text-cyan-300 font-mono text-[11px] py-1.5 px-2 rounded border border-slate-800 flex items-center justify-between cursor-pointer"
              >
                <span className="truncate">$ {item.cmd}</span>
                <Play className="w-3 h-3 shrink-0 ml-1 text-cyan-400" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Simulated Terminal Window */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
        {/* Terminal Title Bar */}
        <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            <span className="text-slate-300 font-mono ml-2 text-[11px]">ubuntu@noble: ~/playwright-mastery</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">bash 5.2.21</span>
        </div>

        {/* Terminal Output Area */}
        <div className="p-4 font-mono text-xs space-y-3 max-h-96 overflow-y-auto">
          {terminalHistory.map((item, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center space-x-2 text-emerald-400">
                <span className="text-cyan-400">ubuntu@noble:~/playwright-mastery$</span>
                <span className="text-slate-100">{item.command}</span>
              </div>
              <div className="text-slate-300 pl-4 whitespace-pre-wrap leading-relaxed opacity-90 border-l border-slate-800">
                {item.output}
              </div>
            </div>
          ))}

          {/* Active Input Line */}
          <form onSubmit={handleCustomSubmit} className="flex items-center space-x-2 pt-2 text-emerald-400">
            <span className="text-cyan-400 shrink-0">ubuntu@noble:~/playwright-mastery$</span>
            <input
              type="text"
              value={inputCommand}
              onChange={(e) => setInputCommand(e.target.value)}
              placeholder="Type command (e.g. npx playwright test) and press Enter..."
              className="w-full bg-transparent text-slate-100 outline-none text-xs font-mono placeholder-slate-600"
            />
          </form>
        </div>
      </div>
    </div>
  );
}
