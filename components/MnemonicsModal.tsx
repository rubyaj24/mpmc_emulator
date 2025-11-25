'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { getMnemonicsFor } from '@/lib/mnemonics';
import { useSimulatorStore } from '@/lib/store';

interface MnemonicsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MnemonicsModal({ open, onOpenChange }: MnemonicsModalProps) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<string | null>(null);

  const processorType = useSimulatorStore((s) => s.processorType);

  const list = useMemo(() => {
    const all = getMnemonicsFor(processorType);
    const q = query.trim().toLowerCase();
    if (!q) return all;
    return all.filter(
      (m) => m.mnemonic.toLowerCase().includes(q) || m.description.toLowerCase().includes(q)
    );
  }, [query, processorType]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">Instruction Mnemonics</DialogTitle>
          <DialogDescription>
            Reference and quick tutorial for {processorType === '8086' ? '8086' : '8051'} mnemonics. Use the search to filter.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="flex items-center gap-2 mb-3">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              className="flex-1 px-3 py-1 rounded border bg-background text-sm"
              placeholder="Search mnemonic or description"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 p-1 sm:grid-cols-2 gap-2 max-h-64 overflow-auto">
            {list.map((m, idx) => {
              const itemKey = `${m.mnemonic}-${idx}`;
              return (
                <button
                  key={itemKey}
                  onClick={() => setSelected(itemKey)}
                  className={`text-left p-2 rounded bg-muted/40 hover:bg-muted transition ${selected === itemKey ? 'ring-2 ring-blue-400' : ''}`}
                >
                  <div className="font-mono font-semibold">{m.mnemonic}</div>
                  <div className="text-xs text-muted-foreground">{m.description}</div>
                </button>
              );
            })}
          </div>

          {selected && (
            <div className="mt-4 p-3 border rounded bg-background/50">
              {(() => {
                const entryIndex = list.findIndex((x, i) => `${x.mnemonic}-${i}` === selected);
                if (entryIndex === -1) return null;
                const entry = list[entryIndex];
                return (
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-mono font-semibold text-lg">{entry.mnemonic}</div>
                        <div className="text-sm text-muted-foreground">{entry.description}</div>
                      </div>
                      <div className="ml-4 flex flex-col gap-2">
                        {entry.example && (
                          <>
                            <button
                              onClick={() => navigator.clipboard?.writeText(entry.example || '')}
                              className="px-2 py-1 text-xs rounded bg-primary text-primary-foreground"
                            >
                              Copy example
                            </button>
                            <button
                              onClick={() => window.dispatchEvent(new CustomEvent('insertSnippet', { detail: entry.example }))}
                              className="px-2 py-1 text-xs rounded border bg-background text-foreground"
                            >
                              Insert into editor
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {entry.example && (
                      <pre className="mt-3 p-3 bg-slate-900 text-white rounded font-mono text-sm overflow-auto">
                        {entry.example}
                      </pre>
                    )}
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default MnemonicsModal;
