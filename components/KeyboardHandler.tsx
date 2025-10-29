'use client';

import { useEffect, useState } from 'react';
import { useSimulatorStore } from '@/lib/store';

interface KeyboardHandlerProps {
  onShowHelp: () => void;
}

export function KeyboardHandler({ onShowHelp }: KeyboardHandlerProps) {
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
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
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
  ]);

  return null;
}
