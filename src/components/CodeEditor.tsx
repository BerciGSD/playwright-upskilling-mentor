import { useRef, useEffect, useState, useMemo } from 'react';
import SimpleEditor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import { Copy, Check, Code2, Trash2, Send } from 'lucide-react';

// Resolve CJS / ESM default export mismatch for react-simple-code-editor
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Editor: any = (SimpleEditor as any)?.default || SimpleEditor;

interface CodeEditorProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  onSubmit?: () => void;
  readOnly?: boolean;
  placeholder?: string;
  minHeight?: string;
  className?: string;
  isApproved?: boolean;
}

export function CodeEditor({
  id = 'drill-code-input',
  value,
  onChange,
  onClear,
  onSubmit,
  readOnly = false,
  placeholder = '// Write your Playwright TypeScript code here...',
  minHeight = '340px',
  className = '',
  isApproved = false,
}: CodeEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 });

  // Calculate lines count
  const linesCount = useMemo(() => {
    const count = (value || '').split('\n').length;
    return Math.max(count, 1);
  }, [value]);

  const lineNumbers = useMemo(() => {
    return Array.from({ length: linesCount }, (_, i) => i + 1);
  }, [linesCount]);

  // Synchronize line number gutter scroll with editor scroll
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = e.currentTarget.scrollTop;
    }
  };

  // Track cursor position from textarea
  const updateCursorPosition = () => {
    const textarea = containerRef.current?.querySelector('textarea');
    if (!textarea) return;
    const pos = textarea.selectionStart || 0;
    const textBefore = textarea.value.substring(0, pos);
    const lines = textBefore.split('\n');
    setCursorPos({
      line: lines.length,
      col: (lines[lines.length - 1]?.length || 0) + 1,
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  // Prism highlighter function passed directly to react-simple-code-editor
  const highlightWithPrism = (codeText: string) => {
    try {
      const grammar = Prism.languages.typescript || Prism.languages.javascript || Prism.languages.clike;
      if (grammar) {
        return Prism.highlight(codeText || '', grammar, 'typescript');
      }
      return escapeHtml(codeText || '');
    } catch {
      return escapeHtml(codeText || '');
    }
  };

  useEffect(() => {
    const textarea = containerRef.current?.querySelector('textarea');
    if (!textarea) return;

    textarea.id = id;
    if (placeholder) {
      textarea.placeholder = placeholder;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        onSubmit?.();
      }
    };

    const handleEvent = () => updateCursorPosition();
    textarea.addEventListener('keyup', handleEvent);
    textarea.addEventListener('click', handleEvent);
    textarea.addEventListener('select', handleEvent);
    textarea.addEventListener('keydown', handleKeyDown);

    return () => {
      textarea.removeEventListener('keyup', handleEvent);
      textarea.removeEventListener('click', handleEvent);
      textarea.removeEventListener('select', handleEvent);
      textarea.removeEventListener('keydown', handleKeyDown);
    };
  }, [id, placeholder, onSubmit]);

  return (
    <div className={`relative flex flex-col bg-slate-950 text-xs sm:text-sm ${className}`}>
      {/* Editor Main Canvas with Line Numbers Gutter */}
      <div className="relative flex overflow-hidden border-b border-slate-900" style={{ minHeight }}>
        {/* Line Numbers Gutter */}
        <div
          ref={lineNumbersRef}
          aria-hidden="true"
          className="select-none py-3 pl-3 pr-2.5 text-right bg-slate-950 border-r border-slate-800/80 text-slate-600 font-mono text-[12px] overflow-hidden w-12 shrink-0 leading-[22px] pointer-events-none"
        >
          {lineNumbers.map((num) => (
            <div
              key={num}
              className={`h-[22px] flex items-center justify-end ${
                num === cursorPos.line ? 'text-cyan-400 font-bold' : ''
              }`}
            >
              {num}
            </div>
          ))}
        </div>

        {/* Code Input Area with react-simple-code-editor */}
        <div
          ref={containerRef}
          onScroll={handleScroll}
          className="relative flex-1 bg-slate-950/70 overflow-auto"
        >
          <Editor
            value={value}
            onValueChange={onChange}
            highlight={highlightWithPrism}
            padding={12}
            tabSize={2}
            insertSpaces={true}
            readOnly={readOnly}
            className="prism-code-editor font-mono"
            style={{
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
              fontSize: 13,
              lineHeight: '22px',
              minHeight: '100%',
              backgroundColor: 'transparent',
              caretColor: '#22d3ee', // cyan-400
              color: '#f8fafc',
            }}
          />
        </div>
      </div>

      {/* Editor Bottom Status Bar */}
      <div className="flex items-center justify-between px-3.5 py-2 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-400">
        <div className="flex items-center space-x-3">
          <span className="flex items-center space-x-1 text-cyan-400/90 font-medium">
            <Code2 className="w-3.5 h-3.5" />
            <span>TypeScript • Syntax Colored</span>
          </span>
          <span className="text-slate-600">|</span>
          <span className="font-mono">
            Ln {cursorPos.line}, Col {cursorPos.col}
          </span>
          <span className="text-slate-600">|</span>
          <span className="font-mono">
            {linesCount} {linesCount === 1 ? 'line' : 'lines'}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {isApproved && (
            <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-semibold text-[10px] flex items-center space-x-1">
              <Check className="w-3 h-3 text-emerald-400" />
              <span>Approved Solution</span>
            </span>
          )}
          {onClear && (
            <button
              type="button"
              onClick={onClear}
              title="Clear editor to restart practice"
              className="flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-900 hover:bg-rose-950/80 text-rose-400 hover:text-rose-200 border border-slate-800 hover:border-rose-800 transition cursor-pointer"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear Editor</span>
            </button>
          )}
          <button
            type="button"
            onClick={handleCopy}
            title="Copy code to clipboard"
            className="flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400 font-medium">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copy</span>
              </>
            )}
          </button>
          {onSubmit && (
            <button
              type="button"
              onClick={onSubmit}
              title="Submit code for review (or press Ctrl+Enter / ⌘+Enter)"
              className="flex items-center space-x-1.5 px-3 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-sm transition cursor-pointer"
            >
              <Send className="w-3 h-3" />
              <span>Submit (Ctrl+Enter)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
