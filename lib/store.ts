import { create } from 'zustand';
import { Emulator8086, Registers8086, Flags8086 } from './emulator/8086';
import { Emulator8051, Registers8051, Flags8051 } from './emulator/8051';
import { assembleCode, parseAssemblyLine } from './assembler';

export type ProcessorType = '8086' | '8051';

interface ConsoleMessage {
  type: 'info' | 'error' | 'success';
  message: string;
  timestamp: number;
}

interface SimulatorStore {
  processorType: ProcessorType;
  code: string;
  emulator8086: Emulator8086;
  emulator8051: Emulator8051;
  consoleMessages: ConsoleMessage[];
  consoleOpen: boolean;
  isRunning: boolean;
  currentLine: number;

  setProcessorType: (type: ProcessorType) => void;
  setCode: (code: string) => void;
  addConsoleMessage: (type: ConsoleMessage['type'], message: string) => void;
  clearConsole: () => void;
  toggleConsole: () => void;
  setConsoleOpen: (open: boolean) => void;

  assembleLine: () => void;
  disassembleLine: () => void;
  runProgram: () => void;
  stepInstruction: () => void;
  resetSimulator: () => void;
  stopExecution: () => void;

  getRegisters: () => Registers8086 | Registers8051;
  getFlags: () => Flags8086 | Flags8051;
  getMemory: (start: number, count: number) => number[];
  getPorts: () => { P0: number; P1: number; P2: number; P3: number } | null;
}

export const useSimulatorStore = create<SimulatorStore>((set, get) => ({
  processorType: '8086',
  code: '; Example 8086 Assembly Code\nMOV AX, 10\nMOV BX, 20\nADD AX, BX\nMOV CX, AX\nNOP\nHLT',
  emulator8086: new Emulator8086(),
  emulator8051: new Emulator8051(),
  consoleMessages: [],
  consoleOpen: true,
  isRunning: false,
  currentLine: 0,

  setProcessorType: (type) => {
    const exampleCode = type === '8086'
      ? '; Example 8086 Assembly Code\nMOV AX, 10\nMOV BX, 20\nADD AX, BX\nMOV CX, AX\nNOP\nHLT'
      : '; Example 8051 Assembly Code\nMOV A, #10H\nMOV R0, #20H\nADD A, R0\nMOV R1, A\nNOP';

    set({ processorType: type, code: exampleCode });
    get().resetSimulator();
    get().addConsoleMessage('info', `Switched to ${type} processor`);
  },

  setCode: (code) => set({ code }),

  addConsoleMessage: (type, message) =>
    set((state) => ({
      consoleMessages: [
        ...state.consoleMessages,
        { type, message, timestamp: Date.now() },
      ],
    })),

  clearConsole: () => set({ consoleMessages: [] }),

  toggleConsole: () => set((state) => ({ consoleOpen: !state.consoleOpen })),

  setConsoleOpen: (open) => set({ consoleOpen: open }),

  assembleLine: () => {
    const { code, processorType, addConsoleMessage } = get();
    const lines = code.split('\n');

    addConsoleMessage('info', '--- Line Assembly ---');

    const { instructions, errors } = assembleCode(code);

    if (errors.length > 0) {
      errors.forEach(error => addConsoleMessage('error', error));
      return;
    }

    instructions.forEach((inst, idx) => {
      addConsoleMessage('success', `Line ${idx + 1}: ${inst.mnemonic} ${inst.operands.join(', ')}`);
    });

    addConsoleMessage('info', `Total instructions: ${instructions.length}`);
  },

  disassembleLine: () => {
    const { code, addConsoleMessage } = get();

    addConsoleMessage('info', '--- Disassembly ---');

    const { instructions } = assembleCode(code);

    instructions.forEach((inst, idx) => {
      const disassembled = `${inst.mnemonic} ${inst.operands.join(', ')}`;
      addConsoleMessage('info', `${String(idx).padStart(4, '0')}: ${disassembled}`);
    });
  },

  runProgram: () => {
    const { code, processorType, addConsoleMessage, emulator8086, emulator8051 } = get();

    set({ isRunning: true, currentLine: 0 });
    addConsoleMessage('info', '--- Running Program ---');

    const { instructions } = assembleCode(code);
    const emulator = processorType === '8086' ? emulator8086 : emulator8051;

    instructions.forEach((inst, idx) => {
      if (emulator.halted) return;

      const result = emulator.executeInstruction(inst);
      addConsoleMessage('success', `[${idx}] ${result}`);
      set({ currentLine: idx });
    });

    set({ isRunning: false });
    addConsoleMessage('info', 'Program execution completed');
  },

  stepInstruction: () => {
    const { code, processorType, addConsoleMessage, emulator8086, emulator8051, currentLine } = get();

    const { instructions } = assembleCode(code);
    const emulator = processorType === '8086' ? emulator8086 : emulator8051;

    if (currentLine >= instructions.length) {
      addConsoleMessage('info', 'Program execution completed');
      return;
    }

    if (emulator.halted) {
      addConsoleMessage('info', 'Processor halted');
      return;
    }

    const inst = instructions[currentLine];
    const result = emulator.executeInstruction(inst);

    addConsoleMessage('success', `[${currentLine}] ${result}`);
    set({ currentLine: currentLine + 1 });
  },

  resetSimulator: () => {
    const { emulator8086, emulator8051, addConsoleMessage } = get();

    emulator8086.reset();
    emulator8051.reset();

    set({ isRunning: false, currentLine: 0 });
    addConsoleMessage('info', 'Simulator reset');
  },

  stopExecution: () => {
    set({ isRunning: false });
    get().addConsoleMessage('info', 'Execution stopped');
  },

  getRegisters: () => {
    const { processorType, emulator8086, emulator8051 } = get();
    return processorType === '8086' ? emulator8086.registers : emulator8051.registers;
  },

  getFlags: () => {
    const { processorType, emulator8086, emulator8051 } = get();
    return processorType === '8086' ? emulator8086.flags : emulator8051.flags;
  },

  getMemory: (start: number, count: number) => {
    const { processorType, emulator8086, emulator8051 } = get();
    const emulator = processorType === '8086' ? emulator8086 : emulator8051;
    const memory: number[] = [];

    for (let i = 0; i < count; i++) {
      memory.push(emulator.readMemory(start + i));
    }

    return memory;
  },

  getPorts: () => {
    const { processorType, emulator8051 } = get();
    return processorType === '8051' ? emulator8051.ports : null;
  },
}));
