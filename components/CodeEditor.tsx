'use client';

import { useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { useSimulatorStore } from '@/lib/store';
import { Card } from '@/components/ui/card';

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

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
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
