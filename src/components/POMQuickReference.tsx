import React, { useState } from 'react';
import { 
  Layers, 
  X, 
  Copy, 
  Check, 
  Minimize2, 
  Maximize2, 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle, 
  Code2, 
  BookOpen, 
  Crosshair, 
  CheckCircle2,
  Terminal
} from 'lucide-react';

interface POMQuickReferenceProps {
  isOpen: boolean;
  onClose: () => void;
  onToggle: () => void;
  onOpenGenerator?: () => void;
}

type TabKey = 'rules' | 'locators' | 'template' | 'antipatterns';

export function POMQuickReference({ isOpen, onClose, onToggle, onOpenGenerator }: POMQuickReferenceProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('rules');
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const canonicalCode = `import { type Page, type Locator } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly finishButton: Locator;
  readonly orderConfirmation: Locator;

  constructor(page: Page) {
    this.page = page;
    // 1. Accessibility-first semantic locators
    this.firstNameInput = page.getByPlaceholder('First Name');
    this.lastNameInput = page.getByPlaceholder('Last Name');
    this.postalCodeInput = page.getByPlaceholder('Zip/Postal Code');
    this.continueButton = page.getByRole('button', { name: 'Continue' });
    this.finishButton = page.getByRole('button', { name: 'Finish' });
    this.orderConfirmation = page.getByRole('heading', { name: /thank you/i });
  }

  // 2. High-level action methods (HOW)
  async fillShippingInfo(first: string, last: string, zip: string) {
    await this.firstNameInput.fill(first);
    await this.lastNameInput.fill(last);
    await this.postalCodeInput.fill(zip);
    await this.continueButton.click();
  }

  async completeOrder() {
    await this.finishButton.click();
  }
}`;

  const specCode = `import { test, expect } from '@playwright/test';
import { CheckoutPage } from '../../pages/CheckoutPage';

test('submits order successfully', async ({ page }) => {
  const checkoutPage = new CheckoutPage(page);

  // Actions reside in Page Object
  await checkoutPage.fillShippingInfo('Ada', 'Lovelace', '90210');
  await checkoutPage.completeOrder();

  // Assertions strictly reside in Test Spec
  await expect(checkoutPage.orderConfirmation).toBeVisible();
});`;

  // Minimized floating launcher bar
  if (!isOpen) {
    return (
      <button
        id="pom-quick-ref-launcher"
        onClick={onToggle}
        className="fixed bottom-5 right-6 z-40 flex items-center space-x-2.5 bg-slate-900/90 hover:bg-slate-800 text-cyan-400 hover:text-cyan-300 border border-cyan-500/40 hover:border-cyan-400 px-4 py-2.5 rounded-full shadow-2xl shadow-cyan-950/60 backdrop-blur-md transition-all duration-200 cursor-pointer font-medium text-xs group"
        title="Open POM Quick Reference"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
        </span>
        <Layers className="w-4 h-4 text-cyan-400 group-hover:rotate-12 transition-transform" />
        <span className="font-semibold text-slate-100">POM Quick Reference</span>
        <span className="px-1.5 py-0.5 rounded bg-cyan-950 text-[10px] text-cyan-300 font-mono border border-cyan-800/80">
          Cheatsheet
        </span>
      </button>
    );
  }

  return (
    <aside
      id="pom-quick-reference-panel"
      aria-label="POM Quick Reference Panel"
      className={`fixed bottom-5 right-6 z-50 w-full sm:w-[490px] max-w-[calc(100vw-2rem)] bg-slate-900/95 border border-cyan-500/40 rounded-2xl shadow-2xl shadow-black/80 backdrop-blur-xl flex flex-col transition-all duration-200 overflow-hidden ${
        isMinimized ? 'h-14' : 'max-h-[85vh] h-[640px]'
      }`}
    >
      {/* Panel Top Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-950/90 border-b border-slate-800 select-none">
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-bold text-white tracking-tight">POM Quick Reference</h3>
              <span className="text-[10px] px-2 py-0.2 rounded-full font-mono bg-cyan-950 text-cyan-300 border border-cyan-800">
                Rule 14
              </span>
            </div>
            {!isMinimized && (
              <p className="text-[11px] text-slate-400">
                Locators, constructors & assertion separation guide
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition cursor-pointer"
            title={isMinimized ? 'Expand panel' : 'Minimize panel'}
          >
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition cursor-pointer"
            title="Close reference"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Navigation Sub-Tabs */}
          <div className="flex border-b border-slate-800/90 bg-slate-950/50 px-2 pt-1">
            <button
              onClick={() => setActiveTab('rules')}
              className={`flex items-center space-x-1.5 px-3 py-2 text-xs font-medium border-b-2 transition cursor-pointer ${
                activeTab === 'rules'
                  ? 'border-cyan-400 text-cyan-300 font-semibold bg-cyan-950/20'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Core Rules</span>
            </button>

            <button
              onClick={() => setActiveTab('locators')}
              className={`flex items-center space-x-1.5 px-3 py-2 text-xs font-medium border-b-2 transition cursor-pointer ${
                activeTab === 'locators'
                  ? 'border-cyan-400 text-cyan-300 font-semibold bg-cyan-950/20'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <Crosshair className="w-3.5 h-3.5" />
              <span>Locators</span>
            </button>

            <button
              onClick={() => setActiveTab('template')}
              className={`flex items-center space-x-1.5 px-3 py-2 text-xs font-medium border-b-2 transition cursor-pointer ${
                activeTab === 'template'
                  ? 'border-cyan-400 text-cyan-300 font-semibold bg-cyan-950/20'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Canonical Template</span>
            </button>

            <button
              onClick={() => setActiveTab('antipatterns')}
              className={`flex items-center space-x-1.5 px-3 py-2 text-xs font-medium border-b-2 transition cursor-pointer ${
                activeTab === 'antipatterns'
                  ? 'border-amber-400 text-amber-300 font-semibold bg-amber-950/20'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Anti-Patterns</span>
            </button>
          </div>

          {/* Tab Content Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-slate-300 text-xs">
            {/* TAB 1: CORE RULES */}
            {activeTab === 'rules' && (
              <div className="space-y-3.5">
                <div className="p-3 bg-cyan-950/30 border border-cyan-800/40 rounded-xl space-y-1.5">
                  <div className="flex items-center space-x-2 text-cyan-300 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                    <span>The Golden Rule: Separation of Concerns</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Page Objects describe <strong className="text-white">HOW</strong> to interact with the screen. Test specs define <strong className="text-white">WHAT</strong> business behavior is expected.
                  </p>
                </div>

                <div className="space-y-2.5">
                  <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/90 space-y-1">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-400 inline-flex items-center justify-center text-[10px]">1</span>
                      <span>Constructor & Readonly Properties</span>
                    </span>
                    <p className="text-slate-400 text-[11px]">
                      Declare all element handles as <code className="text-cyan-300 font-mono">readonly prop: Locator;</code> in class fields and assign them once in <code className="text-cyan-300 font-mono">constructor(page: Page)</code>.
                    </p>
                    <div className="mt-1 text-[11px] text-slate-400 bg-slate-900 p-2 rounded border border-slate-800 font-mono">
                      {`this.submitBtn = page.getByRole('button', { name: 'Sign in' });`}
                    </div>
                  </div>

                  <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/90 space-y-1">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-400 inline-flex items-center justify-center text-[10px]">2</span>
                      <span>Encapsulated Action Methods</span>
                    </span>
                    <p className="text-slate-400 text-[11px]">
                      Methods like <code className="text-emerald-300 font-mono">fillShippingInfo()</code> and <code className="text-emerald-300 font-mono">submitPayment()</code> group physical actions (<code className="text-slate-300">fill</code>, <code className="text-slate-300">click</code>, <code className="text-slate-300">check</code>). They create readable user journey steps.
                    </p>
                  </div>

                  <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/90 space-y-1">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-400 inline-flex items-center justify-center text-[10px]">3</span>
                      <span>Assertions Strictly in Test Specs</span>
                    </span>
                    <p className="text-slate-400 text-[11px]">
                      Never bury <code className="text-amber-300 font-mono">expect()</code> inside page methods. Keep assertions in the test spec:
                    </p>
                    <div className="mt-1 text-[11px] text-emerald-300 bg-slate-900 p-2 rounded border border-slate-800 font-mono">
                      await expect(checkoutPage.orderConfirmation).toBeVisible();
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">
                      Why? Produces clean stack traces pointing directly to the test requirement rather than internal POM plumbing.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: LOCATORS */}
            {activeTab === 'locators' && (
              <div className="space-y-3">
                <p className="text-[11px] text-slate-400">
                  Prefer accessibility-first locators that match how users navigate:
                </p>

                <div className="space-y-2 font-mono text-[11px]">
                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 space-y-1">
                    <div className="text-cyan-300 font-semibold">1. Role Locators (Buttons, Links, Headings)</div>
                    <div className="text-slate-300">{`page.getByRole('button', { name: 'Checkout' })`}</div>
                    <div className="text-slate-300">{`page.getByRole('heading', { name: /products/i })`}</div>
                  </div>

                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 space-y-1">
                    <div className="text-cyan-300 font-semibold">2. Label & Placeholder Locators (Form Inputs)</div>
                    <div className="text-slate-300">{`page.getByLabel('Email Address')`}</div>
                    <div className="text-slate-300">{`page.getByPlaceholder('Zip/Postal Code')`}</div>
                  </div>

                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 space-y-1">
                    <div className="text-cyan-300 font-semibold">3. Scoped Sub-Locators (Tables / Catalog Cards)</div>
                    <div className="text-slate-300">{`// Good: Filter on parent container`}</div>
                    <div className="text-emerald-300">{`this.page.locator('.cart_item').filter({ hasText: itemName })`}</div>
                    <div className="text-slate-500 text-[10px] font-sans mt-0.5">
                      Never concatenate dynamic XPath strings like <code className="text-rose-400 font-mono">{`//div[text()="\${name}"]`}</code>.
                    </div>
                  </div>

                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 space-y-1">
                    <div className="text-cyan-300 font-semibold">4. Component Object Model (COM)</div>
                    <p className="text-slate-400 font-sans text-[11px]">
                      Extract shared headers, menus, or footers into nested classes:
                    </p>
                    <div className="text-purple-300">{`this.header = new HeaderComponent(page);`}</div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: CANONICAL TEMPLATE */}
            {activeTab === 'template' && (
              <div className="space-y-3">
                {onOpenGenerator && (
                  <div className="p-3 bg-gradient-to-r from-cyan-950/40 via-slate-900 to-emerald-950/30 border border-cyan-800/40 rounded-xl flex items-center justify-between gap-2">
                    <div>
                      <div className="text-white font-semibold text-[11px] flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Interactive POM Template Generator</span>
                      </div>
                      <p className="text-slate-400 text-[10.5px]">
                        Input custom URLs and element labels to generate bespoke Page Objects.
                      </p>
                    </div>
                    <button
                      onClick={onOpenGenerator}
                      className="px-2.5 py-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg text-[10.5px] transition cursor-pointer shadow whitespace-nowrap"
                    >
                      Open Generator
                    </button>
                  </div>
                )}

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white text-[11px] flex items-center gap-1.5">
                      <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Page Class (`pages/CheckoutPage.ts`)</span>
                    </span>
                    <button
                      onClick={() => handleCopy('class', canonicalCode)}
                      className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded text-[10px] font-mono flex items-center space-x-1 cursor-pointer transition"
                    >
                      {copiedKey === 'class' ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy Class</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-[10.5px] font-mono text-slate-300 overflow-x-auto leading-relaxed max-h-52">
                    {canonicalCode}
                  </pre>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white text-[11px] flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Test Spec (`tests/e2e/checkout.spec.ts`)</span>
                    </span>
                    <button
                      onClick={() => handleCopy('spec', specCode)}
                      className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded text-[10px] font-mono flex items-center space-x-1 cursor-pointer transition"
                    >
                      {copiedKey === 'spec' ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy Spec</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-[10.5px] font-mono text-slate-300 overflow-x-auto leading-relaxed max-h-40">
                    {specCode}
                  </pre>
                </div>
              </div>
            )}

            {/* TAB 4: ANTI-PATTERNS */}
            {activeTab === 'antipatterns' && (
              <div className="space-y-3">
                <div className="p-3 bg-amber-950/30 border border-amber-800/40 rounded-xl space-y-1">
                  <div className="flex items-center space-x-2 text-amber-300 font-semibold">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <span>Practices Strictly Prohibited by Modern Standards</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    Avoid these 4 common pitfalls when writing Page Objects.
                  </p>
                </div>

                <div className="space-y-2 text-[11px]">
                  <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800 space-y-1">
                    <div className="text-rose-400 font-semibold">❌ 1. Calling waitForTimeout()</div>
                    <p className="text-slate-400 leading-normal">
                      Never use <code className="text-rose-300 font-mono">await page.waitForTimeout(2000)</code>. Playwright automatically auto-waits for actionability (visible, stable, enabled) before clicking or filling.
                    </p>
                  </div>

                  <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800 space-y-1">
                    <div className="text-rose-400 font-semibold">❌ 2. Assertions Hidden in Page Methods</div>
                    <p className="text-slate-400 leading-normal">
                      Don't write <code className="text-rose-300 font-mono">await expect(item).toBeVisible()</code> inside <code className="text-slate-200 font-mono">removeItem()</code>. It prevents reusing the method in negative tests and obscures failure traces.
                    </p>
                  </div>

                  <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800 space-y-1">
                    <div className="text-rose-400 font-semibold">❌ 3. Querying Locators Dynamically in Actions</div>
                    <p className="text-slate-400 leading-normal">
                      Don't call <code className="text-rose-300 font-mono">this.page.locator('.btn')</code> inside every action method. Locators are lazy references; initialize them once in the constructor.
                    </p>
                  </div>

                  <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800 space-y-1">
                    <div className="text-rose-400 font-semibold">❌ 4. Fragile DOM Path Chaining</div>
                    <p className="text-slate-400 leading-normal">
                      Avoid <code className="text-rose-300 font-mono">{"page.locator('div > ul > li:nth-child(2) > a')"}</code>. Prefer accessible labels, semantic roles, or <code className="text-emerald-300 font-mono">{".filter({ hasText })"}</code>.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Panel Footer */}
          <div className="px-4 py-2.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px]">
            <div className="text-slate-500">
              Tip: Keep this cheatsheet open side-by-side while coding drills!
            </div>
            <button
              onClick={onClose}
              className="text-cyan-400 hover:text-cyan-300 font-semibold transition cursor-pointer"
            >
              Dock
            </button>
          </div>
        </>
      )}
    </aside>
  );
}
