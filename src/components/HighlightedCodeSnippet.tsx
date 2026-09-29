import { useState, useMemo } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-yaml';
import { Copy, Check, Code2 } from 'lucide-react';

interface HighlightedCodeSnippetProps {
  code: string;
  language?: string;
  filename?: string;
  className?: string;
  maxHeight?: string;
  showHeader?: boolean;
  textSize?: string;
  padding?: string;
}

export function HighlightedCodeSnippet({
  code,
  language = 'typescript',
  filename,
  className = '',
  maxHeight = '420px',
  showHeader = true,
  textSize = 'text-xs',
  padding = 'p-3.5',
}: HighlightedCodeSnippetProps) {
  const [copied, setCopied] = useState(false);

  const highlighted = useMemo(() => {
    try {
      const normalizedLang = language === 'ts' ? 'typescript' : language === 'js' ? 'javascript' : language === 'sh' || language === 'shell' ? 'bash' : language === 'md' ? 'markdown' : language;
      const grammar = Prism.languages[normalizedLang] || Prism.languages.typescript || Prism.languages.javascript;
      if (grammar) {
        return Prism.highlight(code || '', grammar, normalizedLang);
      }
      return escapeHtml(code || '');
    } catch {
      return escapeHtml(code || '');
    }
  }, [code, language]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lineCount = useMemo(() => (code || '').split('\n').length, [code]);

  return (
    <div className={`rounded-xl border border-slate-800 bg-slate-950 overflow-hidden shadow-inner ${className}`}>
      {showHeader && (
        <div className="flex items-center justify-between px-3.5 py-2 bg-slate-900/90 border-b border-slate-800 text-[11px] text-slate-400">
          <div className="flex items-center space-x-1.5 font-mono text-cyan-400">
            <Code2 className="w-3.5 h-3.5" />
            <span>{filename || (language === 'bash' || language === 'shell' ? 'terminal.sh' : language === 'markdown' || language === 'md' ? 'README.md' : 'snippet.ts')}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-slate-500 text-[10px]">{lineCount} lines</span>
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center space-x-1 text-slate-400 hover:text-slate-200 transition cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      <div className={`${padding} overflow-x-auto`} style={{ maxHeight }}>
        <pre className={`font-mono ${textSize} leading-relaxed text-slate-200 whitespace-pre`}>
          <code
            className={`language-${language}`}
            dangerouslySetInnerHTML={{ __html: highlighted }}
          />
        </pre>
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
