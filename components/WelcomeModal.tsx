'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Zap, Keyboard, Cpu, BookOpen } from 'lucide-react';

interface WelcomeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WelcomeModal({ open, onOpenChange }: WelcomeModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Welcome to Microprocessor Emulator</DialogTitle>
          <DialogDescription>
            Intel 8086 & 8051 Assembly Simulator
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="quickstart" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="quickstart">Quick Start</TabsTrigger>
            <TabsTrigger value="shortcuts">Shortcuts</TabsTrigger>
            <TabsTrigger value="8051">8051 Guide</TabsTrigger>
            <TabsTrigger value="tips">Tips</TabsTrigger>
          </TabsList>

          <TabsContent value="quickstart" className="space-y-4 mt-4">
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Zap className="w-4 h-4" /> Getting Started
              </h3>
              
              <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg space-y-3">
                <div className="flex gap-3">
                  <div className="font-bold text-blue-600 dark:text-blue-400 min-w-6">1</div>
                  <div>
                    <p className="font-semibold">Select Processor</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Choose 8086 or 8051 from the dropdown</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="font-bold text-blue-600 dark:text-blue-400 min-w-6">2</div>
                  <div>
                    <p className="font-semibold">Write Assembly Code</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Type your assembly instructions in the editor</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="font-bold text-blue-600 dark:text-blue-400 min-w-6">3</div>
                  <div>
                    <p className="font-semibold">Run or Step</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Execute all at once (Run) or line-by-line (Step)</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="font-bold text-blue-600 dark:text-blue-400 min-w-6">4</div>
                  <div>
                    <p className="font-semibold">Check Results</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">View registers, memory, and console output</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="shortcuts" className="space-y-4 mt-4">
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Keyboard className="w-4 h-4" /> Keyboard Shortcuts
              </h3>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-gray-100 dark:bg-gray-800 rounded">
                  <code className="text-sm font-mono">R</code>
                  <span className="text-sm">Run program</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-100 dark:bg-gray-800 rounded">
                  <code className="text-sm font-mono">S</code>
                  <span className="text-sm">Step to next instruction</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-100 dark:bg-gray-800 rounded">
                  <code className="text-sm font-mono">X</code>
                  <span className="text-sm">Reset simulator</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-100 dark:bg-gray-800 rounded">
                  <code className="text-sm font-mono">M</code>
                  <span className="text-sm">Open Memory editor</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-100 dark:bg-gray-800 rounded">
                  <code className="text-sm font-mono">?</code>
                  <span className="text-sm">Show help</span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="8051" className="space-y-4 mt-4">
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Cpu className="w-4 h-4" /> 8051 External Memory
              </h3>
              
              <p className="text-sm text-gray-600 dark:text-gray-400">
                To test 8051 programs that use external memory (MOVX instructions):
              </p>

              <div className="bg-amber-50 dark:bg-amber-950 p-4 rounded-lg space-y-2">
                <p className="text-sm"><strong>Step 1:</strong> Click the <Badge>Ext Mem</Badge> button</p>
                <p className="text-sm"><strong>Step 2:</strong> Enter start address (hex): <code className="bg-white dark:bg-gray-900 px-2 py-1 rounded">8500</code></p>
                <p className="text-sm"><strong>Step 3:</strong> Enter values (hex): <code className="bg-white dark:bg-gray-900 px-2 py-1 rounded">03,04</code></p>
                <p className="text-sm"><strong>Step 4:</strong> Click &quot;Load Memory&quot;</p>
                <p className="text-sm"><strong>Step 5:</strong> Run your program</p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded text-sm">
                <p><strong>Example:</strong> Load 0x03 at address 0x8500 and 0x04 at 0x8501, then multiply: 3 × 4 = 12</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="tips" className="space-y-4 mt-4">
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <BookOpen className="w-4 h-4" /> Tips & Tricks
              </h3>
              
              <ul className="space-y-2 text-sm">
                <li className="flex gap-2">
                  <span>💡</span>
                  <span><strong>Number Format:</strong> In 8051, plain numbers are hex (e.g., 8500 = 0x8500). Use H suffix or 0x prefix if needed.</span>
                </li>
                <li className="flex gap-2">
                  <span>💡</span>
                  <span><strong>Memory Inspector:</strong> Press M or click Memory button to read/write any address after running.</span>
                </li>
                <li className="flex gap-2">
                  <span>💡</span>
                  <span><strong>Mnemonics:</strong> Click the Mnemonics button to see all available instructions with examples.</span>
                </li>
                <li className="flex gap-2">
                  <span>💡</span>
                  <span><strong>Save Code:</strong> Your code is auto-saved per processor. Use Save button to export as .asm file.</span>
                </li>
                <li className="flex gap-2">
                  <span>💡</span>
                  <span><strong>Console:</strong> Toggle console with C key to see detailed execution trace.</span>
                </li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 mt-6">
          <Button onClick={() => onOpenChange(false)} className="w-full">
            Get Started
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
