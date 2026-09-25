import React, { useState, useMemo } from 'react';
import {
  X,
  Sparkles,
  Copy,
  Check,
  Plus,
  Trash2,
  Code2,
  FileCode,
  Download,
  Terminal,
  Globe,
  Sliders,
  CheckCircle2,
  Layers,
  ArrowRight,
  ShieldCheck,
  Send
} from 'lucide-react';

export interface ElementDefinition {
  id: string;
  label: string;
  role: 'textbox' | 'button' | 'heading' | 'checkbox' | 'link' | 'combobox' | 'alert' | 'custom';
  strategy: 'getByRole' | 'getByLabel' | 'getByPlaceholder' | 'getByText' | 'locator';
  customSelector?: string;
}

interface POMTemplateGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyToDrill?: (code: string) => void;
}

type OutputView = 'class' | 'spec' | 'both';

export function POMTemplateGeneratorModal({
  isOpen,
  onClose,
  onApplyToDrill,
}: POMTemplateGeneratorModalProps) {
  // Input states
  const [pageName, setPageName] = useState<string>('CheckoutPage');
  const [targetUrl, setTargetUrl] = useState<string>('https://www.saucedemo.com/checkout-step-one.html');
  const [includeGoto, setIncludeGoto] = useState<boolean>(true);
  const [includeActionMethod, setIncludeActionMethod] = useState<boolean>(true);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [outputView, setOutputView] = useState<OutputView>('class');

  // Interactive element rows
  const [elements, setElements] = useState<ElementDefinition[]>([
    {
      id: 'el-1',
      label: 'First Name',
      role: 'textbox',
      strategy: 'getByPlaceholder',
    },
    {
      id: 'el-2',
      label: 'Last Name',
      role: 'textbox',
      strategy: 'getByPlaceholder',
    },
    {
      id: 'el-3',
      label: 'Zip/Postal Code',
      role: 'textbox',
      strategy: 'getByPlaceholder',
    },
    {
      id: 'el-4',
      label: 'Continue',
      role: 'button',
      strategy: 'getByRole',
    },
    {
      id: 'el-5',
      label: 'Cancel',
      role: 'button',
      strategy: 'getByRole',
    },
  ]);

  // Bulk input text for students who prefer quick comma/line separated pasting
  const [bulkInput, setBulkInput] = useState<string>('');
  const [isBulkOpen, setIsBulkOpen] = useState<boolean>(false);

  // Helper to convert label to camelCase property name
  const toCamelCaseProperty = (label: string, role: string): string => {
    const cleaned = label
      .replace(/[^a-zA-Z0-9 ]/g, '')
      .split(' ')
      .filter(Boolean)
      .map((word, idx) =>
        idx === 0
          ? word.toLowerCase()
          : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      )
      .join('');

    if (!cleaned) return 'element';

    // Append semantic suffix if not already present
    const lower = cleaned.toLowerCase();
    if (role === 'button' && !lower.includes('button') && !lower.includes('btn')) {
      return `${cleaned}Button`;
    }
    if (role === 'textbox' && !lower.includes('input') && !lower.includes('field')) {
      return `${cleaned}Input`;
    }
    if (role === 'heading' && !lower.includes('heading') && !lower.includes('title')) {
      return `${cleaned}Heading`;
    }
    if (role === 'checkbox' && !lower.includes('checkbox') && !lower.includes('box')) {
      return `${cleaned}Checkbox`;
    }
    if (role === 'link' && !lower.includes('link')) {
      return `${cleaned}Link`;
    }
    if (role === 'combobox' && !lower.includes('select') && !lower.includes('dropdown')) {
      return `${cleaned}Dropdown`;
    }
    return cleaned;
  };

  // Add new element row
  const handleAddElement = () => {
    const newId = `el-${Date.now()}`;
    setElements((prev) => [
      ...prev,
      {
        id: newId,
        label: 'New Element',
        role: 'button',
        strategy: 'getByRole',
      },
    ]);
  };

  // Delete element row
  const handleDeleteElement = (id: string) => {
    setElements((prev) => prev.filter((el) => el.id !== id));
  };

  // Update element field
  const handleUpdateElement = (
    id: string,
    field: keyof ElementDefinition,
    value: string
  ) => {
    setElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, [field]: value } : el))
    );
  };

  // Process bulk input
  const handleApplyBulk = () => {
    if (!bulkInput.trim()) return;
    const lines = bulkInput
      .split(/[\n,]+/)
      .map((s) => s.trim())
      .filter(Boolean);

    const parsed: ElementDefinition[] = lines.map((line, idx) => {
      let role: ElementDefinition['role'] = 'textbox';
      let strategy: ElementDefinition['strategy'] = 'getByLabel';
      let label = line;

      const lower = line.toLowerCase();
      if (lower.includes('button') || lower.includes('btn') || lower.includes('submit') || lower.includes('continue') || lower.includes('login') || lower.includes('save')) {
        role = 'button';
        strategy = 'getByRole';
      } else if (lower.includes('title') || lower.includes('heading')) {
        role = 'heading';
        strategy = 'getByRole';
      } else if (lower.includes('check') || lower.includes('agree') || lower.includes('terms') || lower.includes('remember')) {
        role = 'checkbox';
        strategy = 'getByRole';
      } else if (lower.includes('link')) {
        role = 'link';
        strategy = 'getByRole';
      } else if (lower.includes('select') || lower.includes('dropdown')) {
        role = 'combobox';
        strategy = 'getByRole';
      } else {
        role = 'textbox';
        strategy = 'getByLabel';
      }

      return {
        id: `bulk-${idx}-${Date.now()}`,
        label,
        role,
        strategy,
      };
    });

    if (parsed.length > 0) {
      setElements(parsed);
      setIsBulkOpen(false);
      setBulkInput('');
    }
  };

  // Presets
  const handleLoadPreset = (presetKey: 'login' | 'checkout' | 'search' | 'profile') => {
    if (presetKey === 'login') {
      setPageName('LoginPage');
      setTargetUrl('https://www.saucedemo.com');
      setElements([
        { id: 'p1', label: 'Username', role: 'textbox', strategy: 'getByPlaceholder' },
        { id: 'p2', label: 'Password', role: 'textbox', strategy: 'getByPlaceholder' },
        { id: 'p3', label: 'Login', role: 'button', strategy: 'getByRole' },
        { id: 'p4', label: 'Epic sadface', role: 'alert', strategy: 'getByText' },
      ]);
    } else if (presetKey === 'checkout') {
      setPageName('CheckoutShippingPage');
      setTargetUrl('https://www.saucedemo.com/checkout-step-one.html');
      setElements([
        { id: 'c1', label: 'First Name', role: 'textbox', strategy: 'getByPlaceholder' },
        { id: 'c2', label: 'Last Name', role: 'textbox', strategy: 'getByPlaceholder' },
        { id: 'c3', label: 'Zip/Postal Code', role: 'textbox', strategy: 'getByPlaceholder' },
        { id: 'c4', label: 'Continue', role: 'button', strategy: 'getByRole' },
        { id: 'c5', label: 'Cancel', role: 'button', strategy: 'getByRole' },
      ]);
    } else if (presetKey === 'search') {
      setPageName('CatalogPage');
      setTargetUrl('https://www.saucedemo.com/inventory.html');
      setElements([
        { id: 's1', label: 'Products', role: 'heading', strategy: 'getByText' },
        { id: 's2', label: 'Open Menu', role: 'button', strategy: 'getByRole' },
        { id: 's3', label: 'Filter', role: 'combobox', strategy: 'getByRole' },
        { id: 's4', label: 'Shopping Cart', role: 'link', strategy: 'getByRole' },
      ]);
    } else if (presetKey === 'profile') {
      setPageName('UserProfilePage');
      setTargetUrl('https://app.example.com/settings/profile');
      setElements([
        { id: 'pr1', label: 'Display Name', role: 'textbox', strategy: 'getByLabel' },
        { id: 'pr2', label: 'Email Address', role: 'textbox', strategy: 'getByLabel' },
        { id: 'pr3', label: 'Subscribe to newsletter', role: 'checkbox', strategy: 'getByRole' },
        { id: 'pr4', label: 'Save Changes', role: 'button', strategy: 'getByRole' },
      ]);
    }
  };

  // Generate Page Object TypeScript code
  const generatedClassCode = useMemo(() => {
    const className = pageName.trim().endsWith('Page')
      ? pageName.trim()
      : `${pageName.trim()}Page`;

    const propDeclarations = elements.map((el) => {
      const propName = toCamelCaseProperty(el.label, el.role);
      return `  readonly ${propName}: Locator;`;
    });

    const constructorInitializers = elements.map((el) => {
      const propName = toCamelCaseProperty(el.label, el.role);
      let initCode = '';

      switch (el.strategy) {
        case 'getByRole':
          initCode = `this.${propName} = page.getByRole('${el.role}', { name: '${el.label}' });`;
          break;
        case 'getByLabel':
          initCode = `this.${propName} = page.getByLabel('${el.label}');`;
          break;
        case 'getByPlaceholder':
          initCode = `this.${propName} = page.getByPlaceholder('${el.label}');`;
          break;
        case 'getByText':
          initCode = `this.${propName} = page.getByText('${el.label}');`;
          break;
        case 'locator':
          initCode = `this.${propName} = page.locator('${el.customSelector || `[data-test="${el.label.toLowerCase().replace(/\s+/g, '-')}"]`}');`;
          break;
        default:
          initCode = `this.${propName} = page.getByRole('${el.role}', { name: '${el.label}' });`;
      }
      return `    ${initCode}`;
    });

    // Generate action methods
    const inputs = elements.filter((el) => el.role === 'textbox');
    const primaryButton = elements.find(
      (el) =>
        el.role === 'button' &&
        (el.label.toLowerCase().includes('continue') ||
          el.label.toLowerCase().includes('login') ||
          el.label.toLowerCase().includes('submit') ||
          el.label.toLowerCase().includes('save'))
    ) || elements.find((el) => el.role === 'button');

    let actionMethodCode = '';
    if (includeActionMethod && (inputs.length > 0 || primaryButton)) {
      const params = inputs
        .map((inp) => `${toCamelCaseProperty(inp.label, inp.role).replace(/Input$/, '')}: string`)
        .join(', ');

      const fillStatements = inputs
        .map(
          (inp) =>
            `    await this.${toCamelCaseProperty(inp.label, inp.role)}.fill(${toCamelCaseProperty(inp.label, inp.role).replace(/Input$/, '')});`
        )
        .join('\n');

      const clickStatement = primaryButton
        ? `    await this.${toCamelCaseProperty(primaryButton.label, primaryButton.role)}.click();`
        : '';

      const methodName = inputs.length > 0 ? 'fillAndSubmit' : 'submit';

      actionMethodCode = `
  /**
   * Encapsulated action method combining user interaction steps.
   * Keeps test specs declarative and high-level (HOW vs WHAT).
   */
  async ${methodName}(${params}) {
${fillStatements}
${clickStatement}
  }`;
    }

    const gotoMethod = includeGoto
      ? `
  /**
   * Direct navigation to target page.
   */
  async goto() {
    await this.page.goto('${targetUrl}');
  }`
      : '';

    return `import { type Page, type Locator } from '@playwright/test';

/**
 * ${className}
 * Best Practices:
 * - Readonly locators initialized in constructor (Rule 14).
 * - Accessibility-first semantic locator strategies.
 * - Encapsulated user actions without internal assertions.
 */
export class ${className} {
  readonly page: Page;
${propDeclarations.join('\n')}

  constructor(page: Page) {
    this.page = page;
${constructorInitializers.join('\n')}
  }
${gotoMethod}${actionMethodCode}
}
`;
  }, [pageName, targetUrl, elements, includeGoto, includeActionMethod]);

  // Generate companion test spec code
  const generatedSpecCode = useMemo(() => {
    const className = pageName.trim().endsWith('Page')
      ? pageName.trim()
      : `${pageName.trim()}Page`;
    const varName = className.charAt(0).toLowerCase() + className.slice(1);

    const inputs = elements.filter((el) => el.role === 'textbox');
    const sampleArgs = inputs.map((inp) => `'test_${inp.label.toLowerCase().replace(/\s+/g, '_')}'`).join(', ');

    const headingOrAlert = elements.find(
      (el) => el.role === 'heading' || el.role === 'alert'
    ) || elements[0];
    const assertProp = headingOrAlert ? toCamelCaseProperty(headingOrAlert.label, headingOrAlert.role) : 'page';

    return `import { test, expect } from '@playwright/test';
import { ${className} } from '../../pages/${className}';

test('completes workflow using ${className}', async ({ page }) => {
  const ${varName} = new ${className}(page);

  // 1. Navigation (HOW)
  ${includeGoto ? `await ${varName}.goto();` : `await page.goto('${targetUrl}');`}

  // 2. High-level user interaction (HOW)
  ${includeActionMethod && inputs.length > 0 ? `await ${varName}.fillAndSubmit(${sampleArgs});` : `// Execute action methods`}

  // 3. Assertions strictly placed in the test spec (WHAT)
  // Ensures crystal-clear failure stack traces and separation of concerns
  await expect(${varName}.${assertProp}).toBeVisible();
});
`;
  }, [pageName, targetUrl, elements, includeGoto, includeActionMethod]);

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDownload = () => {
    const className = pageName.trim().endsWith('Page')
      ? pageName.trim()
      : `${pageName.trim()}Page`;
    const blob = new Blob([generatedClassCode], { type: 'text/typescript;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${className}.ts`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  return (
    <div
      id="pom-template-generator-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl max-h-[92vh] bg-slate-900 border border-cyan-500/40 rounded-2xl shadow-2xl shadow-cyan-950/70 flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold text-white tracking-tight">
                  POM Template Generator
                </h2>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-cyan-950 text-cyan-300 border border-cyan-800">
                  Rule 14 Compliant
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Generate clean, production-grade Page Object classes with constructor initialization and semantic locators.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Main Body: 2 Columns on Desktop */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
          {/* Left Column: Form Configuration (5 cols) */}
          <div className="lg:col-span-5 p-5 space-y-5 bg-slate-950/40 overflow-y-auto">
            {/* Quick Presets */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Sample Presets</span>
                </span>
                <span className="text-[11px] text-slate-500">Click to autofill</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleLoadPreset('checkout')}
                  className="px-2.5 py-1.5 rounded-lg text-xs bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-800 hover:border-cyan-500/40 text-left transition cursor-pointer"
                >
                  🛒 Checkout Step 1
                </button>
                <button
                  type="button"
                  onClick={() => handleLoadPreset('login')}
                  className="px-2.5 py-1.5 rounded-lg text-xs bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-800 hover:border-cyan-500/40 text-left transition cursor-pointer"
                >
                  🔐 Login Form
                </button>
                <button
                  type="button"
                  onClick={() => handleLoadPreset('search')}
                  className="px-2.5 py-1.5 rounded-lg text-xs bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-800 hover:border-cyan-500/40 text-left transition cursor-pointer"
                >
                  📦 Catalog Products
                </button>
                <button
                  type="button"
                  onClick={() => handleLoadPreset('profile')}
                  className="px-2.5 py-1.5 rounded-lg text-xs bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-800 hover:border-cyan-500/40 text-left transition cursor-pointer"
                >
                  👤 User Settings
                </button>
              </div>
            </div>

            {/* Target Page Info */}
            <div className="space-y-3 pt-2 border-t border-slate-800/80">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Page Class Name
                </label>
                <input
                  type="text"
                  value={pageName}
                  onChange={(e) => setPageName(e.target.value)}
                  placeholder="e.g. CheckoutPage"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                  <span>Target Page URL</span>
                  <span className="text-[10px] text-slate-500">Used in goto() method</span>
                </label>
                <div className="relative">
                  <Globe className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={targetUrl}
                    onChange={(e) => setTargetUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-8 pr-3 py-2 text-xs text-white font-mono focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Elements Definition */}
            <div className="space-y-3 pt-2 border-t border-slate-800/80">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Element Locators ({elements.length})
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Defines constructor properties &amp; Playwright locators
                  </p>
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    type="button"
                    onClick={() => setIsBulkOpen(!isBulkOpen)}
                    className="px-2 py-1 text-[11px] bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded transition cursor-pointer"
                  >
                    {isBulkOpen ? 'Builder' : 'Paste Bulk'}
                  </button>
                  <button
                    type="button"
                    onClick={handleAddElement}
                    className="px-2 py-1 text-[11px] bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded flex items-center gap-1 transition cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add</span>
                  </button>
                </div>
              </div>

              {/* Bulk paste toggle */}
              {isBulkOpen ? (
                <div className="space-y-2 bg-slate-900 p-3 rounded-xl border border-slate-800">
                  <label className="block text-[11px] text-slate-300">
                    Paste element labels (separated by lines or commas):
                  </label>
                  <textarea
                    rows={4}
                    value={bulkInput}
                    onChange={(e) => setBulkInput(e.target.value)}
                    placeholder="First Name, Last Name, Postal Code, Continue Button, Cancel Button"
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-xs text-slate-200 font-mono focus:border-cyan-400 focus:outline-none"
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setIsBulkOpen(false)}
                      className="px-2.5 py-1 text-xs text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleApplyBulk}
                      className="px-3 py-1 text-xs bg-cyan-500 text-slate-950 font-bold rounded hover:bg-cyan-400"
                    >
                      Parse &amp; Populate
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {elements.map((el) => (
                    <div
                      key={el.id}
                      className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800/80 space-y-2 group hover:border-slate-700 transition"
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={el.label}
                          onChange={(e) => handleUpdateElement(el.id, 'label', e.target.value)}
                          placeholder="Label or Name"
                          className="flex-1 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-white focus:border-cyan-400 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => handleDeleteElement(el.id)}
                          className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 transition cursor-pointer"
                          title="Delete element"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div>
                          <span className="text-[10px] text-slate-500 block mb-0.5">Role / Type</span>
                          <select
                            value={el.role}
                            onChange={(e) =>
                              handleUpdateElement(el.id, 'role', e.target.value as ElementDefinition['role'])
                            }
                            className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-200 focus:outline-none"
                          >
                            <option value="textbox">textbox (input)</option>
                            <option value="button">button</option>
                            <option value="heading">heading</option>
                            <option value="checkbox">checkbox</option>
                            <option value="link">link</option>
                            <option value="combobox">combobox (select)</option>
                            <option value="alert">alert / banner</option>
                          </select>
                        </div>

                        <div>
                          <span className="text-[10px] text-slate-500 block mb-0.5">Strategy</span>
                          <select
                            value={el.strategy}
                            onChange={(e) =>
                              handleUpdateElement(el.id, 'strategy', e.target.value as ElementDefinition['strategy'])
                            }
                            className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-200 focus:outline-none font-mono text-[10px]"
                          >
                            <option value="getByRole">getByRole</option>
                            <option value="getByLabel">getByLabel</option>
                            <option value="getByPlaceholder">getByPlaceholder</option>
                            <option value="getByText">getByText</option>
                            <option value="locator">locator (custom)</option>
                          </select>
                        </div>
                      </div>

                      {el.strategy === 'locator' && (
                        <div>
                          <input
                            type="text"
                            value={el.customSelector || ''}
                            onChange={(e) => handleUpdateElement(el.id, 'customSelector', e.target.value)}
                            placeholder="e.g. [data-test='item-badge']"
                            className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-[11px] text-cyan-300 font-mono focus:border-cyan-400 focus:outline-none"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Generator Flags */}
            <div className="space-y-2 pt-2 border-t border-slate-800/80">
              <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeGoto}
                  onChange={(e) => setIncludeGoto(e.target.checked)}
                  className="rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-0"
                />
                <span>Include <code className="text-cyan-400 font-mono">goto()</code> navigation method</span>
              </label>

              <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeActionMethod}
                  onChange={(e) => setIncludeActionMethod(e.target.checked)}
                  className="rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-0"
                />
                <span>Include high-level user action method (<code className="text-emerald-400 font-mono">fillAndSubmit</code>)</span>
              </label>
            </div>
          </div>

          {/* Right Column: Code Output Preview (7 cols) */}
          <div className="lg:col-span-7 p-5 flex flex-col space-y-3 bg-slate-950/80">
            {/* View switcher & Action bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
                <button
                  type="button"
                  onClick={() => setOutputView('class')}
                  className={`px-3 py-1 rounded-lg font-medium transition cursor-pointer flex items-center gap-1.5 ${
                    outputView === 'class'
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5" />
                  <span>Page Class</span>
                </button>
                <button
                  type="button"
                  onClick={() => setOutputView('spec')}
                  className={`px-3 py-1 rounded-lg font-medium transition cursor-pointer flex items-center gap-1.5 ${
                    outputView === 'spec'
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Test Spec</span>
                </button>
                <button
                  type="button"
                  onClick={() => setOutputView('both')}
                  className={`px-3 py-1 rounded-lg font-medium transition cursor-pointer flex items-center gap-1.5 ${
                    outputView === 'both'
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Both</span>
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() =>
                    handleCopy(
                      'main',
                      outputView === 'spec' ? generatedSpecCode : generatedClassCode
                    )
                  }
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer border border-slate-700 hover:border-cyan-500/40"
                >
                  {copiedKey === 'main' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleDownload}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition cursor-pointer border border-slate-700 hover:text-white"
                  title="Download .ts file"
                >
                  <Download className="w-4 h-4" />
                </button>

                {onApplyToDrill && (
                  <button
                    type="button"
                    onClick={() => {
                      onApplyToDrill(generatedClassCode);
                      onClose();
                    }}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 transition cursor-pointer shadow-md shadow-emerald-950/40"
                    title="Send code into current drill editor"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Apply to Drill</span>
                  </button>
                )}
              </div>
            </div>

            {/* Code Output Window */}
            <div className="flex-1 overflow-y-auto space-y-4">
              {(outputView === 'class' || outputView === 'both') && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-mono text-cyan-300">pages/{pageName.endsWith('Page') ? pageName : `${pageName}Page`}.ts</span>
                    <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Constructor Initialized</span>
                    </span>
                  </div>
                  <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800/90 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed max-h-[500px]">
                    {generatedClassCode}
                  </pre>
                </div>
              )}

              {(outputView === 'spec' || outputView === 'both') && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-mono text-emerald-300">tests/e2e/{pageName.toLowerCase().replace(/page$/, '')}.spec.ts</span>
                    <span className="text-[11px] text-cyan-400 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Assertions in Spec</span>
                    </span>
                  </div>
                  <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800/90 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed max-h-[400px]">
                    {generatedSpecCode}
                  </pre>
                </div>
              )}
            </div>

            {/* Best Practice Note */}
            <div className="p-3 bg-cyan-950/20 border border-cyan-800/40 rounded-xl flex items-start gap-2.5 text-[11px] text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white font-semibold">Rule 14 Rule of Thumb: </strong>
                All element references are instantiated as <code className="text-cyan-300 font-mono">readonly</code> properties in the constructor. Action methods encapsulate browser interactions, and all <code className="text-emerald-300 font-mono">expect()</code> assertions stay in the spec.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
