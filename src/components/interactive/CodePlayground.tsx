import { useState, useRef, useCallback } from 'react';

interface Props {
  initialCode?: string;
  language?: string;
  title?: string;
}

export default function CodePlayground({
  initialCode = '// Write your code here\nconsole.log("Hello, world!");',
  language = 'javascript',
  title = 'Code Playground',
}: Props) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const runCode = useCallback(() => {
    if (language !== 'javascript') {
      setOutput(`// Execution not supported for ${language}\n// This is a display-only editor.`);
      return;
    }

    try {
      const logs: string[] = [];
      const mockConsole = {
        log: (...args: unknown[]) => logs.push(args.map(String).join(' ')),
        error: (...args: unknown[]) => logs.push(`Error: ${args.map(String).join(' ')}`),
        warn: (...args: unknown[]) => logs.push(`Warning: ${args.map(String).join(' ')}`),
      };

      const fn = new Function('console', code);
      fn(mockConsole);
      setOutput(logs.join('\n') || '// No output');
    } catch (err) {
      setOutput(`Error: ${(err as Error).message}`);
    }
  }, [code, language]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.target as HTMLTextAreaElement;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const newCode = code.substring(0, start) + '  ' + code.substring(end);
      setCode(newCode);
      requestAnimationFrame(() => {
        target.selectionStart = target.selectionEnd = start + 2;
      });
    }
  };

  return (
    <div className="code-playground">
      <div className="playground-header">
        <span className="playground-title">{title}</span>
        <div className="playground-actions">
          <span className="playground-lang">{language}</span>
          {language === 'javascript' && (
            <button onClick={runCode} className="run-btn">
              Run ▶
            </button>
          )}
        </div>
      </div>
      <div className="playground-body">
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={handleKeyDown}
          className="playground-editor"
          spellCheck={false}
        />
        {output && (
          <div className="playground-output">
            <div className="output-label">Output</div>
            <pre>{output}</pre>
          </div>
        )}
      </div>

      <style>{`
        .code-playground {
          border: 1px solid var(--color-border);
          border-radius: 8px;
          overflow: hidden;
          margin: 1.5rem 0;
          font-family: 'JetBrains Mono', monospace;
        }
        .playground-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 1rem;
          background: var(--color-surface);
          border-bottom: 1px solid var(--color-border);
          font-size: 0.8rem;
        }
        .playground-title {
          color: var(--color-heading);
          font-weight: 500;
        }
        .playground-actions {
          display: flex;
          gap: 0.75rem;
          align-items: center;
        }
        .playground-lang {
          color: var(--color-muted);
          font-size: 0.75rem;
        }
        .run-btn {
          padding: 0.25rem 0.75rem;
          border: 1px solid var(--color-accent);
          border-radius: 4px;
          background: transparent;
          color: var(--color-accent);
          cursor: pointer;
          font-family: inherit;
          font-size: 0.8rem;
          transition: all 0.15s ease;
        }
        .run-btn:hover {
          background: var(--color-accent);
          color: var(--color-bg);
        }
        .playground-editor {
          width: 100%;
          min-height: 150px;
          padding: 1rem;
          border: none;
          background: var(--color-bg);
          color: var(--color-text);
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.875rem;
          line-height: 1.6;
          resize: vertical;
          outline: none;
          tab-size: 2;
        }
        .playground-output {
          border-top: 1px solid var(--color-border);
          background: var(--color-surface);
        }
        .output-label {
          padding: 0.35rem 1rem;
          font-size: 0.7rem;
          color: var(--color-muted);
          border-bottom: 1px solid var(--color-border);
        }
        .playground-output pre {
          padding: 1rem;
          margin: 0;
          font-size: 0.85rem;
          color: var(--color-accent);
          white-space: pre-wrap;
          background: transparent;
          border: none;
          border-radius: 0;
        }
      `}</style>
    </div>
  );
}
