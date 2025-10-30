'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HelpSidebarProps {
  onOpenWelcome?: () => void;
}

export function HelpSidebar({ onOpenWelcome }: HelpSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>('quickstart');

  const sections = [
    {
      id: 'quickstart',
      title: '🚀 Quick Start',
      content: (
        <ul className="space-y-2 text-sm">
          <li>1. Select processor (8086 or 8051)</li>
          <li>2. Write assembly code</li>
          <li>3. Click Run (R) or Step (S)</li>
          <li>4. Check Console for results</li>
        </ul>
      ),
    },
    {
      id: 'shortcuts',
      title: '⌨️ Keyboard Shortcuts',
      content: (
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><code>R</code><span>Run</span></div>
          <div className="flex justify-between"><code>S</code><span>Step</span></div>
          <div className="flex justify-between"><code>X</code><span>Reset</span></div>
          <div className="flex justify-between"><code>M</code><span>Memory</span></div>
          <div className="flex justify-between"><code>?</code><span>Help</span></div>
        </div>
      ),
    },
    {
      id: 'external-memory',
      title: '💾 External Memory (8051)',
      content: (
        <div className="space-y-2 text-sm">
          <p>For programs using MOVX instructions:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Click &quot;Ext Mem&quot; button</li>
            <li>Enter address (hex): 8500</li>
            <li>Enter values (hex): 03,04</li>
            <li>Click Load Memory</li>
            <li>Run your program</li>
          </ol>
        </div>
      ),
    },
    {
      id: 'memory',
      title: '🔍 Memory Inspector',
      content: (
        <div className="space-y-2 text-sm">
          <p>Use the Memory button (or M key) to:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Read bytes/words from memory</li>
            <li>Write values to memory</li>
            <li>Inspect execution results</li>
            <li>Debug your program</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'mnemonics',
      title: '📖 Mnemonics',
      content: (
        <div className="space-y-2 text-sm">
          <p>Click the Mnemonics button to:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>View all instructions</li>
            <li>See syntax examples</li>
            <li>Copy examples to editor</li>
            <li>Filter by processor type</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'tips',
      title: '💡 Tips',
      content: (
        <ul className="space-y-2 text-sm">
          <li><strong>8051 Numbers:</strong> Plain numbers are hex (8500 = 0x8500)</li>
          <li><strong>Auto-save:</strong> Code is saved per processor type</li>
          <li><strong>Console:</strong> Toggle with C key to see execution trace</li>
          <li><strong>Registers:</strong> View on right panel during execution</li>
        </ul>
      ),
    },
  ];

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        title="Help & Guide (click to open)"
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center font-bold text-lg"
      >
        ?
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 w-80 max-h-[80vh] bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg shadow-xl overflow-hidden flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800">
        <h3 className="font-semibold flex items-center gap-2">
          <HelpCircle className="w-5 h-5" />
          Help & Guide
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(false)}
          className="h-6 w-6 p-0"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="overflow-y-auto flex-1 p-4">
        <div className="space-y-2">
          {sections.map((section) => (
            <div key={section.id} className="border border-gray-200 dark:border-slate-700 rounded">
              <button
                onClick={() =>
                  setExpandedSection(
                    expandedSection === section.id ? null : section.id
                  )
                }
                className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-slate-800 text-left"
              >
                <span className="font-medium text-sm">{section.title}</span>
                {expandedSection === section.id ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>

              {expandedSection === section.id && (
                <div className="px-3 pb-3 border-t border-gray-200 dark:border-slate-700 pt-2 bg-gray-50 dark:bg-slate-800">
                  {section.content}
                </div>
              )}
            </div>
          ))}

          <button
            onClick={() => {
              onOpenWelcome?.();
              setIsOpen(false);
            }}
            className="w-full mt-4 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded font-medium"
          >
            Open Full Welcome Guide
          </button>
        </div>
      </div>
    </div>
  );
}
