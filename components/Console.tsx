'use client';

import { useEffect, useRef } from 'react';
import { useSimulatorStore } from '@/lib/store';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Terminal } from 'lucide-react';

export function Console() {
  const { consoleMessages, consoleOpen, clearConsole, setConsoleOpen } = useSimulatorStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [consoleMessages]);

  if (!consoleOpen) {
    return null;
  }

  return (
    <Card className="border-2" data-terminal>
      <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/30">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4" />
          <h3 className="font-semibold text-sm">Console Output</h3>
          <span className="text-xs text-muted-foreground">
            ({consoleMessages.length} messages)
          </span>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={clearConsole}
            className="h-7 text-xs"
          >
            Clear
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setConsoleOpen(false)}
            className="h-7 w-7 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <ScrollArea className="h-48" ref={scrollRef as any}>
        <div className="p-4 font-mono text-xs space-y-1">
          {consoleMessages.length === 0 ? (
            <div className="text-muted-foreground italic">
              Console output will appear here...
            </div>
          ) : (
            consoleMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`py-0.5 ${
                  msg.type === 'error'
                    ? 'text-red-500'
                    : msg.type === 'success'
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-foreground'
                }`}
              >
                <span className="text-muted-foreground mr-2">
                  [{new Date(msg.timestamp).toLocaleTimeString()}]
                </span>
                {msg.message}
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </Card>
  );
}
