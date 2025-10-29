'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Keyboard } from 'lucide-react';

interface KeyboardHelpModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function KeyboardHelpModal({ open, onOpenChange }: KeyboardHelpModalProps) {
  const shortcuts = [
    { key: 'L', description: 'Line Assembler - Assemble all instructions' },
    { key: 'U', description: 'Disassemble - Show disassembly of code' },
    { key: 'R', description: 'Run - Execute the entire program' },
    { key: 'S', description: 'Step - Execute one instruction' },
    { key: 'X', description: 'Reset - Reset the simulator state' },
    { key: 'Esc', description: 'Stop execution or clear console' },
    { key: '?', description: 'Show this help dialog' },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="w-5 h-5" />
            Keyboard Shortcuts
          </DialogTitle>
          <DialogDescription>
            Use these shortcuts to control the simulator efficiently
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-4">
          {shortcuts.map((shortcut) => (
            <div
              key={shortcut.key}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
            >
              <span className="text-sm">{shortcut.description}</span>
              <kbd className="px-3 py-1.5 text-sm font-mono font-semibold bg-background border border-border rounded shadow-sm">
                {shortcut.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg">
          <strong>Note:</strong> Keyboard shortcuts are disabled when typing in the editor.
          Press outside the editor to use shortcuts.
        </div>
      </DialogContent>
    </Dialog>
  );
}
