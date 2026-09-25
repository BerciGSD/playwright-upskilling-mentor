import { useState } from 'react';
import { Compass, Sparkles, Copy, Check, MousePointerClick, ShieldCheck, AlertCircle } from 'lucide-react';

export function TargetAppSandbox() {
  const [activeApp, setActiveApp] = useState<'saucedemo' | 'the-internet' | 'demoqa'>('saucedemo');
  const [selectedElement, setSelectedElement] = useState<{
    name: string;
    role: string;
    accessibleName: string;
    recommendedLocator: string;
    fallbackCss: string;
    explanation: string;
  } | null>(null);

  const [copied, setCopied] = useState(false);

  // Target app demo states
  const [sauceUsername, setSauceUsername] = useState('standard_user');
  const [saucePassword, setSaucePassword] = useState('secret_sauce');
  const [sauceLoggedIn, setSauceLoggedIn] = useState(false);
  const [sauceCartCount, setSauceCartCount] = useState(0);

  const [checkbox1, setCheckbox1] = useState(false);
  const [checkbox2, setCheckbox2] = useState(true);

  const [dynamicLoading, setDynamicLoading] = useState(false);
  const [dynamicLoaded, setDynamicLoaded] = useState(false);

  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const handleCopyLocator = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      {/* Intro Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-xs font-semibold bg-cyan-950 text-cyan-300 border border-cyan-800">
              Rule 4 & 5: Practice Sandbox
            </span>
            <h2 className="text-lg font-bold text-white">Target Apps & Accessible Locator Inspector</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Click on any interactive element below to inspect its accessible role, accessible name, and exact web-first Playwright locator.
          </p>
        </div>

        {/* App Switcher */}
        <div className="flex space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => {
              setActiveApp('saucedemo');
              setSelectedElement(null);
            }}
            className={`px-3 py-1.5 rounded text-xs font-medium transition cursor-pointer ${
              activeApp === 'saucedemo'
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            SauceDemo.com
          </button>
          <button
            onClick={() => {
              setActiveApp('the-internet');
              setSelectedElement(null);
            }}
            className={`px-3 py-1.5 rounded text-xs font-medium transition cursor-pointer ${
              activeApp === 'the-internet'
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            The-Internet
          </button>
          <button
            onClick={() => {
              setActiveApp('demoqa');
              setSelectedElement(null);
            }}
            className={`px-3 py-1.5 rounded text-xs font-medium transition cursor-pointer ${
              activeApp === 'demoqa'
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            DemoQA.com
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Simulated Target App */}
        <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-xl flex flex-col">
          {/* Fake Browser Chrome */}
          <div className="bg-slate-900 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            </div>
            <div className="bg-slate-950 px-4 py-1 rounded-md text-[11px] font-mono text-slate-300 border border-slate-800 truncate max-w-xs">
              {activeApp === 'saucedemo'
                ? 'https://www.saucedemo.com'
                : activeApp === 'the-internet'
                ? 'https://the-internet.herokuapp.com'
                : 'https://demoqa.com/books'}
            </div>
            <span className="text-[10px] text-cyan-400 font-semibold uppercase">Live DOM</span>
          </div>

          {/* App Body Container */}
          <div className="p-6 bg-slate-900/40 flex-1 flex flex-col justify-center">
            {/* 1. SauceDemo Simulator */}
            {activeApp === 'saucedemo' && (
              <div className="space-y-6 max-w-sm mx-auto w-full bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg">
                {!sauceLoggedIn ? (
                  <div className="space-y-4">
                    <div className="text-center space-y-1">
                      <h3 className="text-xl font-bold text-white tracking-wider">SWAG LABS</h3>
                      <p className="text-xs text-slate-400">Sign in to explore inventory</p>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <input
                          type="text"
                          placeholder="Username"
                          value={sauceUsername}
                          onChange={(e) => setSauceUsername(e.target.value)}
                          onClick={() =>
                            setSelectedElement({
                              name: 'Username Input',
                              role: 'textbox',
                              accessibleName: 'Username',
                              recommendedLocator: "page.getByPlaceholder('Username')",
                              fallbackCss: "page.locator('#user-name')",
                              explanation:
                                'Input uses a clear placeholder attribute. getByPlaceholder is web-first and human-readable.',
                            })
                          }
                          className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-400 outline-none"
                        />
                      </div>

                      <div>
                        <input
                          type="password"
                          placeholder="Password"
                          value={saucePassword}
                          onChange={(e) => setSaucePassword(e.target.value)}
                          onClick={() =>
                            setSelectedElement({
                              name: 'Password Input',
                              role: 'textbox',
                              accessibleName: 'Password',
                              recommendedLocator: "page.getByPlaceholder('Password')",
                              fallbackCss: "page.locator('#password')",
                              explanation:
                                'Consistent with username. Resilient against HTML structural changes.',
                            })
                          }
                          className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-400 outline-none"
                        />
                      </div>

                      <button
                        onClick={() => {
                          setSauceLoggedIn(true);
                          setSelectedElement({
                            name: 'Login Submit Button',
                            role: 'button',
                            accessibleName: 'Login',
                            recommendedLocator: "page.getByRole('button', { name: 'Login' })",
                            fallbackCss: "page.locator('#login-button')",
                            explanation:
                              'Accessible Role "button" with accessible name "Login". This is the gold-standard locator.',
                          });
                        }}
                        className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2 rounded text-xs transition cursor-pointer"
                      >
                        Login
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <span className="font-bold text-white text-sm">Products</span>
                      <div
                        onClick={() =>
                          setSelectedElement({
                            name: 'Shopping Cart Link',
                            role: 'link',
                            accessibleName: 'Shopping Cart',
                            recommendedLocator: "page.locator('.shopping_cart_link')",
                            fallbackCss: "page.locator('#shopping_cart_container')",
                            explanation:
                              'A persistent navigation header icon. The badge reveals item counts.',
                          })
                        }
                        className="relative cursor-pointer px-2 py-1 bg-slate-800 rounded border border-slate-700 text-xs"
                      >
                        🛒 Cart: <span className="text-cyan-300 font-bold">{sauceCartCount}</span>
                      </div>
                    </div>

                    <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-xs text-cyan-300">Sauce Labs Backpack</h4>
                          <p className="text-[11px] text-slate-400">$29.99</p>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setSauceCartCount((c) => c + 1);
                          setSelectedElement({
                            name: 'Add to Cart Button',
                            role: 'button',
                            accessibleName: 'Add to cart',
                            recommendedLocator: "page.getByRole('button', { name: 'Add to cart' })",
                            fallbackCss: "page.locator('#add-to-cart-sauce-labs-backpack')",
                            explanation:
                              'Using getByRole with name "Add to cart" mirrors what screen readers and sighted users encounter.',
                          });
                        }}
                        className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-1.5 rounded text-xs transition cursor-pointer"
                      >
                        Add to cart
                      </button>
                    </div>

                    <button
                      onClick={() => setSauceLoggedIn(false)}
                      className="text-[11px] text-slate-400 hover:text-slate-200 underline cursor-pointer"
                    >
                      ← Reset / Log out
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* 2. The-Internet Simulator */}
            {activeApp === 'the-internet' && (
              <div className="space-y-6 max-w-md mx-auto w-full bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg">
                <div className="border-b border-slate-800 pb-3">
                  <h3 className="text-base font-bold text-white">The Internet Practice Lab</h3>
                  <p className="text-xs text-slate-400">Select an interaction below to test locators</p>
                </div>

                {/* Checkboxes section */}
                <div className="space-y-2 bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <span className="text-xs font-semibold text-slate-300">Checkboxes:</span>
                  <div className="space-y-2">
                    <label
                      onClick={() =>
                        setSelectedElement({
                          name: 'Checkbox 1',
                          role: 'checkbox',
                          accessibleName: 'checkbox 1',
                          recommendedLocator: "page.getByRole('checkbox').first()",
                          fallbackCss: "page.locator('#checkboxes input').first()",
                          explanation:
                            'Actionable with await checkbox.check() or await checkbox.uncheck(). Never click manually.',
                        })
                      }
                      className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={checkbox1}
                        onChange={(e) => setCheckbox1(e.target.checked)}
                        className="rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-0"
                      />
                      <span>Checkbox 1</span>
                    </label>

                    <label
                      onClick={() =>
                        setSelectedElement({
                          name: 'Checkbox 2',
                          role: 'checkbox',
                          accessibleName: 'checkbox 2',
                          recommendedLocator: "page.getByRole('checkbox').nth(1)",
                          fallbackCss: "page.locator('#checkboxes input').nth(1)",
                          explanation: 'Second checkbox in form.',
                        })
                      }
                      className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={checkbox2}
                        onChange={(e) => setCheckbox2(e.target.checked)}
                        className="rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-0"
                      />
                      <span>Checkbox 2</span>
                    </label>
                  </div>
                </div>

                {/* Dynamic Loading section */}
                <div className="space-y-2 bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <span className="text-xs font-semibold text-slate-300">Dynamic Loading Example:</span>
                  <div>
                    <button
                      onClick={() => {
                        setDynamicLoading(true);
                        setDynamicLoaded(false);
                        setTimeout(() => {
                          setDynamicLoading(false);
                          setDynamicLoaded(true);
                        }, 1200);
                        setSelectedElement({
                          name: 'Start Button',
                          role: 'button',
                          accessibleName: 'Start',
                          recommendedLocator: "page.getByRole('button', { name: 'Start' })",
                          fallbackCss: "page.locator('#start button')",
                          explanation: 'Triggers asynchronous element rendering into the DOM.',
                        });
                      }}
                      className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded text-xs font-bold cursor-pointer"
                    >
                      Start
                    </button>
                  </div>

                  {dynamicLoading && (
                    <div id="loading" className="text-xs text-amber-400 font-mono animate-pulse">
                      ⏳ Loading...
                    </div>
                  )}

                  {dynamicLoaded && (
                    <h4
                      onClick={() =>
                        setSelectedElement({
                          name: 'Dynamic Heading',
                          role: 'heading',
                          accessibleName: 'Hello World!',
                          recommendedLocator: "page.getByRole('heading', { name: 'Hello World!' })",
                          fallbackCss: "page.locator('#finish h4')",
                          explanation:
                            'Auto-retrying assertion target: await expect(page.getByRole("heading", { name: "Hello World!" })).toBeVisible()',
                        })
                      }
                      className="text-emerald-400 font-bold text-sm cursor-pointer p-1 bg-emerald-950/40 rounded border border-emerald-800/40"
                    >
                      Hello World!
                    </h4>
                  )}
                </div>

                {/* JS Alert */}
                <div className="space-y-2 bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <span className="text-xs font-semibold text-slate-300">JavaScript Alert:</span>
                  <div>
                    <button
                      onClick={() => {
                        setAlertMessage('You successfully clicked an alert');
                        setSelectedElement({
                          name: 'JS Alert Trigger',
                          role: 'button',
                          accessibleName: 'Click for JS Alert',
                          recommendedLocator: "page.getByRole('button', { name: 'Click for JS Alert' })",
                          fallbackCss: "page.locator('button[onclick=\"jsAlert()\"]')",
                          explanation:
                            'Register page.once("dialog", dialog => dialog.accept()) BEFORE clicking this button.',
                        });
                      }}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded text-xs font-medium cursor-pointer"
                    >
                      Click for JS Alert
                    </button>
                  </div>

                  {alertMessage && (
                    <p id="result" className="text-xs text-cyan-300 font-mono">
                      Result: {alertMessage}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* 3. DemoQA Simulator */}
            {activeApp === 'demoqa' && (
              <div className="space-y-4 max-w-md mx-auto w-full bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg">
                <div className="border-b border-slate-800 pb-2">
                  <h3 className="text-base font-bold text-white">Book Store API Table</h3>
                  <p className="text-xs text-slate-400">Target for page.route() network interception</p>
                </div>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs space-y-2">
                  <div className="flex items-center justify-between text-slate-400 font-semibold border-b border-slate-800 pb-1">
                    <span>Title</span>
                    <span>Author</span>
                  </div>
                  <div
                    onClick={() =>
                      setSelectedElement({
                        name: 'Table Row',
                        role: 'row',
                        accessibleName: 'Git Pocket Guide',
                        recommendedLocator: "page.getByRole('row', { name: 'Git Pocket Guide' })",
                        fallbackCss: "page.locator('.rt-tr-group').first()",
                        explanation:
                          'When intercepting **/api/books, return mock JSON to test how the table handles edge cases.',
                      })
                    }
                    className="flex items-center justify-between text-slate-200 hover:bg-slate-900 p-1 rounded cursor-pointer"
                  >
                    <span>Git Pocket Guide</span>
                    <span className="text-slate-400">Richard E. Silverman</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Inspector Details Panel */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4 flex flex-col justify-between shadow-xl">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-cyan-400 border-b border-slate-800 pb-3">
              <MousePointerClick className="w-5 h-5" />
              <h3 className="font-bold text-slate-100 text-base">Playwright Locator Inspector</h3>
            </div>

            {selectedElement ? (
              <div className="space-y-4">
                <div>
                  <span className="text-[11px] text-slate-400 font-mono uppercase">Element Inspected</span>
                  <h4 className="text-base font-bold text-white">{selectedElement.name}</h4>
                </div>

                {/* Role & Name badges */}
                <div className="flex space-x-2 text-xs">
                  <div className="bg-slate-950 px-2.5 py-1 rounded border border-slate-800 text-slate-300">
                    Role: <code className="text-cyan-400 font-mono">{selectedElement.role}</code>
                  </div>
                  <div className="bg-slate-950 px-2.5 py-1 rounded border border-slate-800 text-slate-300">
                    Name: <code className="text-emerald-400 font-mono">"{selectedElement.accessibleName}"</code>
                  </div>
                </div>

                {/* Gold Standard Locator */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400 flex items-center space-x-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Recommended Web-First Locator</span>
                    </span>
                    <button
                      onClick={() => handleCopyLocator(selectedElement.recommendedLocator)}
                      className="text-xs text-slate-400 hover:text-cyan-300 flex items-center space-x-1 cursor-pointer"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="bg-slate-950 rounded-lg p-3 font-mono text-xs text-emerald-300 border border-emerald-900/60 break-all">
                    {selectedElement.recommendedLocator}
                  </div>
                </div>

                {/* Fallback CSS Locator (Warning) */}
                <div className="space-y-1">
                  <span className="text-xs text-rose-400/90 font-medium">Brittle Fallback (Avoid):</span>
                  <div className="bg-slate-950 rounded p-2 font-mono text-[11px] text-rose-300/80 border border-rose-950">
                    {selectedElement.fallbackCss}
                  </div>
                </div>

                {/* Architectural Reason */}
                <div className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-lg border border-slate-800/80 leading-relaxed">
                  <span className="font-semibold text-slate-200">Architectural Note:</span> {selectedElement.explanation}
                </div>
              </div>
            ) : (
              <div className="py-12 text-center space-y-3">
                <Compass className="w-10 h-10 text-slate-600 mx-auto animate-pulse" />
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Click on any button, input, checkbox, or table item inside the preview to inspect its exact Playwright accessible locator!
                </p>
              </div>
            )}
          </div>

          <div className="border-t border-slate-800 pt-3 text-[11px] text-slate-500">
            Rule 4: Web-first locators are prioritized by accessible role, label, and text.
          </div>
        </div>
      </div>
    </div>
  );
}
