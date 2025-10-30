'use client';

import { useState, useEffect } from 'react';
import { useSimulatorStore } from '@/lib/store';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

export function MemoryDisplay() {
  const [startAddress, setStartAddress] = useState(0);
  const [rowCount] = useState(16);
  // Keep a controlled input value so the input stays in sync and we can
  // format/pad the address shown to the user while still allowing typing.
  // Initialize to a sensible default; formatHex is defined later.
  const [inputValue, setInputValue] = useState('0000');

  // Keep inputValue in-sync when startAddress changes from other places.
  useEffect(() => {
    setInputValue(formatHex(startAddress, 4));
  }, [startAddress]);
  const { getMemory } = useSimulatorStore();

  const memory = getMemory(startAddress, rowCount * 16);

  const formatHex = (value: number, width: number = 2) => {
    return value.toString(16).toUpperCase().padStart(width, '0');
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value || '';
    setInputValue(raw.toUpperCase());

    const cleaned = raw.trim().replace(/^0x/i, '');
    if (cleaned === '') {
      setStartAddress(0);
      return;
    }

    const parsed = parseInt(cleaned, 16);
    if (!Number.isNaN(parsed)) {
      setStartAddress(parsed);
    }
  };

  return (
    <Card className="border-2">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-sm">Memory View</h3>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Address:</span>
              <Input
                type="text"
                placeholder="0000"
                className="w-20 h-7 text-xs font-mono"
                value={inputValue}
                onChange={handleAddressChange}
              />
            </div>
        </div>

        <ScrollArea className="h-64">
          <div className="font-mono text-xs">
            <div className="flex gap-2 pb-2 border-b mb-2 text-muted-foreground sticky top-0 bg-background">
              <span className="w-16">Addr</span>
              {Array.from({ length: 16 }, (_, i) => (
                <span key={i} className="w-6 text-center">
                  {formatHex(i, 1)}
                </span>
              ))}
            </div>

            {Array.from({ length: rowCount }, (_, row) => {
              const addr = startAddress + row * 16;
              return (
                <div key={row} className="flex gap-2 py-1 hover:bg-muted/50">
                  <span className="w-16 text-blue-600 dark:text-blue-400">
                    {formatHex(addr, 4)}
                  </span>
                  {Array.from({ length: 16 }, (_, col) => {
                    const value = memory[row * 16 + col] ?? 0;
                    return (
                      <span
                        key={col}
                        className="w-6 text-center"
                      >
                        {formatHex(value, 2)}
                      </span>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </div>
    </Card>
  );
}
