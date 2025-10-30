 'use client';

import { useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { useSimulatorStore } from '@/lib/store';
import { Card } from '@/components/ui/card';
import { getMnemonicsFor } from '@/lib/mnemonics';

export function CodeEditor() {
  const { code, setCode, currentLine, processorType } = useSimulatorStore();
  const editorRef = useRef<any>(null);

  useEffect(() => {
    if (editorRef.current) {
      const editor = editorRef.current;
      const model = editor.getModel();

      if (model) {
        const decorations = editor.deltaDecorations(
          [],
          currentLine >= 0
            ? [
                {
                  range: {
                    startLineNumber: currentLine + 1,
                    startColumn: 1,
                    endLineNumber: currentLine + 1,
                    endColumn: 1,
                  },
                  options: {
                    isWholeLine: true,
                    className: 'current-line-highlight',
                    glyphMarginClassName: 'current-line-glyph',
                  },
                },
              ]
            : []
        );
      }
    }
  }, [currentLine]);

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;

    // Register a simple completion provider for mnemonics once per page.
    try {
      if (typeof window !== 'undefined' && !(window as any).__mnemonicsCompletionRegistered) {
        (window as any).__mnemonicsCompletionRegistered = true;

        monaco.languages.registerCompletionItemProvider('plaintext', {
          provideCompletionItems: (model: any, position: any) => {
            const word = model.getWordUntilPosition(position);
            const range = {
              startLineNumber: position.lineNumber,
              endLineNumber: position.lineNumber,
              startColumn: word.startColumn,
              endColumn: word.endColumn,
            };

            const mnemonics = getMnemonicsFor(processorType);

            const suggestions = mnemonics.map((m) => ({
              label: m.mnemonic,
              kind: monaco.languages.CompletionItemKind.Function,
              documentation: m.description,
              insertText: m.mnemonic + ' ',
              range,
            }));

            return { suggestions };
          },
        });
      }
    } catch (e) {
      // If monaco isn't available or registration fails, silently ignore.
      // This is non-critical UX enhancement.
      // console.warn('Failed to register mnemonics completion', e);
    }

    // Listen for insertSnippet events to allow other components (e.g. mnemonics)
    // to insert example snippets into the editor at the current cursor.
    const insertHandler = (ev: Event) => {
      try {
        const detail = (ev as CustomEvent).detail as string | undefined;
        if (!detail) return;
        const ed = editorRef.current;
        if (!ed) return;
        const position = ed.getPosition();
        ed.executeEdits('insert-snippet', [
          {
            range: {
              startLineNumber: position.lineNumber,
              startColumn: position.column,
              endLineNumber: position.lineNumber,
              endColumn: position.column,
            },
            text: detail,
            forceMoveMarkers: true,
          },
        ]);
        ed.focus();
      } catch (err) {
        // ignore
      }
    };

    window.addEventListener('insertSnippet', insertHandler as EventListener);

    // cleanup when editor unmounts
    (editor as any)._disposeInsertHandler = () => {
      window.removeEventListener('insertSnippet', insertHandler as EventListener);
    };
  };

  return (
    <Card className="h-full overflow-hidden border-2">
      <div className="h-full flex flex-col">
        <div className="px-4 py-2 border-b bg-muted/30">
          <h3 className="font-semibold text-sm">Assembly Editor</h3>
        </div>
        <div className="flex-1">
          <Editor
            height="100%"
            defaultLanguage="plaintext"
            value={code}
            onChange={(value) => setCode(value || '')}
            onMount={handleEditorDidMount}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 2,
              wordWrap: 'on',
            }}
          />
        </div>
      </div>
      <style jsx global>{`
        .current-line-highlight {
          background: rgba(59, 130, 246, 0.2);
          border-left: 3px solid #3b82f6;
        }
        .current-line-glyph {
          background: #3b82f6;
          width: 5px !important;
          margin-left: 3px;
        }
      `}</style>
    </Card>
  );
}
