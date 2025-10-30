'use client';

import { useEffect } from 'react';
import { useSimulatorStore } from '@/lib/store';

interface KeyboardHandlerProps {
  onShowHelp: () => void;
  onOpenMemory?: () => void;
}

export function KeyboardHandler({ onShowHelp, onOpenMemory }: KeyboardHandlerProps) {
  const {
    assembleLine,
    disassembleLine,
    runProgram,
    stepInstruction,
    resetSimulator,
    stopExecution,
    clearConsole,
    isRunning,
  } = useSimulatorStore();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Prefer checking document.activeElement instead of the event target.
      // Some editors/terminals (Monaco, xterm, etc.) don't surface the focused
      // element as the `e.target` for global events, so check the active
      // element and skip handling when the user is typing in an editor or
      // terminal.
      const active = document.activeElement as HTMLElement | null;
      if (active) {
        const tag = active.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || active.isContentEditable) {
          return;
        }

        // If the focused element is inside Monaco editor or a terminal-like
        // container, don't run shortcuts.
        if (
          typeof active.closest === 'function' &&
          active.closest('.monaco-editor, .terminal, [data-terminal]')
        ) {
          return;
        }
      }

      const key = e.key.toLowerCase();

      switch (key) {
        case 'l':
          e.preventDefault();
          assembleLine();
          break;
        case 'u':
          e.preventDefault();
          disassembleLine();
          break;
        case 'r':
          e.preventDefault();
          if (!isRunning) {
            runProgram();
          }
          break;
        case 's':
          e.preventDefault();
          if (!isRunning) {
            stepInstruction();
          }
          break;
        case 'x':
          e.preventDefault();
          resetSimulator();
          break;
        case 'escape':
          e.preventDefault();
          if (isRunning) {
            stopExecution();
          } else {
            clearConsole();
          }
          break;
        case '?':
          e.preventDefault();
          onShowHelp();
          break;
        case 'm':
          e.preventDefault();
          if (typeof onOpenMemory === 'function') onOpenMemory();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [
    assembleLine,
    disassembleLine,
    runProgram,
    stepInstruction,
    resetSimulator,
    stopExecution,
    clearConsole,
    isRunning,
    onShowHelp,
    onOpenMemory,
  ]);

  return null;
}
