# System Architecture Guide

**Author:** Amaljith M V

## Overview

MPMC is a modular microprocessor emulator built with React/Next.js and TypeScript. The system is organized into three layers:

```
┌─────────────────────────────────────┐
│       UI Layer (React Components)    │  app/, components/
├─────────────────────────────────────┤
│   State Management (Zustand Store)  │  lib/store.ts
├─────────────────────────────────────┤
│  Execution Layer (Assembler & VM)   │  lib/codeGenerator.ts
├─────────────────────────────────────┤
│   Opcode Tables & Emulator Core     │  lib/opcodes/, lib/emulator/
└─────────────────────────────────────┘
```

---

## Layer 1: Opcode & Emulator Layer

### Purpose
Define instruction sets and implement CPU/microcontroller simulation.

### Components

#### Opcode Tables (`lib/opcodes/`)
- **8051.ts** - Complete 8051 instruction set mapping
- **8086.ts** - Complete 8086 instruction set mapping

**Responsibilities:**
- Map mnemonics → machine code bytes
- Define operand encoding schemes
- Provide disassembly functions
- Document addressing modes

**Data Structure:**
```typescript
interface OpcodeEntry {
  mnemonic: string;           // "MOV"
  opcode: number | number[];  // 0x74 or [0xE5, 0xF0]
  operands: string;           // "A, #imm8"
  bytes: number;              // Instruction length
  description: string;        // Help text
  modrm?: boolean;           // ModR/M byte flag (8086)
  displacement?: string;     // Addressing mode
}
```

#### Emulator Classes (`lib/emulator/`)
- **8051.ts** - Emulator8051 class
- **8086.ts** - Emulator8086 class

**Responsibilities:**
- Maintain CPU state (registers, flags, memory)
- Execute instructions (direct call pattern)
- Memory read/write operations
- Program/external memory loading
- Instruction fetch from program memory

**Key Methods:**
```typescript
// Loading
loadProgram(bytes: number[])           // Load bytecode at PC=0
loadExternalMemory(addr, values)       // Load test data

// Execution
executeInstruction(instruction)        // Direct execution (legacy)
fetchByte(address?)                    // Fetch from program memory
fetchWord(address?)                    // Fetch 16-bit value

// Memory
readMemory(address: number)            // Read byte
writeMemory(address: number, value)    // Write byte
```

---

## Layer 2: Execution Layer

### Code Generator (`lib/codeGenerator.ts`)

**Purpose:** Convert assembly → machine code

**Three Phases:**

#### Phase 1: Parsing
```typescript
parseAssembly(code, processorType): {
  instructions: AssemblyInstruction[];
  errors: AssemblyError[];
}
```
- Tokenizes assembly lines
- Extracts mnemonic + operands
- Handles comments
- Basic syntax validation

**Input:**
```asm
MOV A, #10H    ; comment
MOV B, A
; ignore this line
NOP
```

**Output:**
```typescript
[
  {
    mnemonic: "MOV",
    operands: ["A", "#10H"],
    raw: "MOV A, #10H"
  },
  {
    mnemonic: "MOV",
    operands: ["B", "A"],
    raw: "MOV B, A"
  },
  {
    mnemonic: "NOP",
    operands: [],
    raw: "NOP"
  }
]
```

#### Phase 2: Code Generation
```typescript
assemble(code, processorType): {
  bytes: number[];
  instructions: AssemblyInstruction[];  // With address & bytes
  errors: AssemblyError[];
}
```

For each parsed instruction:
1. Match mnemonic against opcode table
2. Encode operands (immediates, registers)
3. Generate byte sequence
4. Track instruction length & address
5. Aggregate all bytes

**Example:**
```
Input:  "MOV AX, #10"
Mnemonic: "MOV"
Operands: ["AX", "#10"]
Lookup:   MOV_AX_IMM → opcode 0xB8, 3 bytes
Encode:   0xB8 (opcode) + 0x0A (imm low) + 0x00 (imm high)
Output:   [0xB8, 0x0A, 0x00]
```

#### Phase 3: Disassembly
```typescript
disassemble8051(bytes, startAddress): {
  mnemonic: string;
  operands: string;
  length: number;
} | null

generateDisassemblyListing(bytes, processorType): string
```

Reverse of code generation:
1. Read byte(s) from program memory
2. Look up opcode in reverse table
3. Decode operands from bytes
4. Format as human-readable instruction

**Example:**
```
Bytes:   [0x74, 0x08]
Lookup:  opcode 0x74 → MOV
Decode:  operand 0x08 → #imm8
Output:  {
           mnemonic: "MOV",
           operands: "A, 0x08",
           length: 2
         }
```

---

## Layer 3: State & UI Layer

### State Management (`lib/store.ts`)

**Zustand Store** - Single source of truth

**State:**
```typescript
{
  processorType: '8086' | '8051',
  code: string,                           // Assembly code
  emulator8086: Emulator8086,
  emulator8051: Emulator8051,
  consoleMessages: ConsoleMessage[],
  isRunning: boolean,
  currentLine: number,
  // ... more
}
```

**Actions:**
```typescript
setProcessorType(type)                 // Switch processor
setCode(code)                          // Update editor
runProgram()                           // Execute all
stepInstruction()                      // Execute one
resetSimulator()                       // Clear state
addConsoleMessage(type, message)       // Log output
```

**Key Implementation:**
```typescript
runProgram: () => {
  const { code, processorType } = get();
  const { instructions } = assembleCode(code);
  const emulator = processorType === '8086' 
    ? get().emulator8086 
    : get().emulator8051;
  
  instructions.forEach((inst) => {
    const result = emulator.executeInstruction(inst);
    addConsoleMessage('success', result);
  });
}
```

### UI Components

#### Editor Panel
- **CodeEditor.tsx** - Monaco editor with completion
- **DisassemblyPanel.tsx** - Machine code viewer

#### Information Panels
- **RegistersDisplay.tsx** - Current register values
- **MemoryDisplay.tsx** - Memory inspector
- **IOPorts.tsx** - Port simulation (8051)

#### Modals
- **WelcomeModal.tsx** - First-time tutorial
- **KeyboardHelpModal.tsx** - Shortcut reference
- **MnemonicsModal.tsx** - Instruction reference
- **MemoryEditModal.tsx** - R/W memory
- **ExternalMemoryLoadModal.tsx** - Load test data

#### Utilities
- **KeyboardHandler.tsx** - Global keyboard shortcuts
- **HelpSidebar.tsx** - Collapsible help
- **Console.tsx** - Execution trace

### Main Layout (`app/page.tsx`)

**Orchestrates:**
1. Component rendering
2. Modal state management
3. Code persistence (localStorage)
4. Processor switching
5. Event delegation (Run, Step, Reset, etc.)

**Data Flow:**
```
User Input (Editor, Buttons)
        ↓
Event Handlers (onClick, onChange)
        ↓
Store Actions (runProgram, setCode, etc.)
        ↓
State Update
        ↓
Components Re-render
        ↓
Display Update (Registers, Memory, Console)
```

---

## Data Flow Examples

### Example 1: Running a Program

```
1. User clicks "Run" button
   ↓
2. KeyboardHandler fires or button onClick
   ↓
3. Store.runProgram() called
   ↓
4. assembleCode(store.code) → instructions[]
   ↓
5. For each instruction:
     - emulator.executeInstruction(inst)
     - addConsoleMessage(result)
   ↓
6. Store state updated: consoleMessages, registers
   ↓
7. Components re-render
   ↓
8. User sees:
     - Console output
     - Updated register values
     - Memory changes
```

### Example 2: Disassembly Display

```
1. User edits code in editor
   ↓
2. CodeEditor onChange → store.setCode()
   ↓
3. Store.code updated
   ↓
4. DisassemblyPanel useMemo runs:
     - codeGenerator.assemble(code)
     - generates bytes + instructions[]
   ↓
5. DisassemblyPanel renders:
     - Address | Bytes | Instruction
     - 0x0000  | 74 08 | MOV A, #08
     - 0x0002  | E5 F0 | MOVX B, @DPTR
   ↓
6. User sees real-time disassembly
```

### Example 3: Memory Inspection

```
1. User clicks "Memory" button
   ↓
2. MemoryEditModal opens
   ↓
3. User enters: address=0x8500, value=0x42, clicks Write
   ↓
4. Modal calls:
     - store.emulator.writeMemory(0x8500, 0x42)
     - store.addConsoleMessage('success', 'Written...')
   ↓
5. Store state updated
   ↓
6. Console shows success message
   ↓
7. User can read back with MOVX A, @DPTR
```

---

## Extension Points

### Adding a New Instruction (8051 Example)

**Step 1: Add opcode entry** (`lib/opcodes/8051.ts`)
```typescript
export const OPCODES_8051 = {
  // ... existing entries
  'MY_NEW_INSTR': {
    mnemonic: 'NEWINST',
    opcode: 0xAB,
    operands: 'A, B',
    bytes: 1,
    description: 'My new instruction'
  }
};
```

**Step 2: Add code generator** (`lib/codeGenerator.ts`, `generate8051()`)
```typescript
case 'NEWINST':
  if (operands[0] === 'A' && operands[1] === 'B') {
    bytes.push(0xAB);
  }
  break;
```

**Step 3: Add emulator handler** (`lib/emulator/8051.ts`)
```typescript
case 'NEWINST':
  return this.executeNEWINST(operands);

private executeNEWINST(operands: string[]): string {
  // Implementation
  return `NEWINST A, B executed`;
}
```

**Step 4: Update mnemonics reference** (`lib/mnemonics.ts`)
```typescript
export const MNEMONICS_8051 = {
  // ...
  NEWINST: {
    description: 'My new instruction',
    example: 'NEWINST A, B',
    usage: 'Does something special'
  }
};
```

### Adding a New Component

**Example: Instruction Counter**

**File: `components/InstructionCounter.tsx`**
```typescript
import { useSimulatorStore } from '@/lib/store';

export const InstructionCounter: React.FC = () => {
  const { currentLine } = useSimulatorStore();
  return <div>Instruction #{currentLine}</div>;
};
```

**Integration: `app/page.tsx`**
```typescript
import { InstructionCounter } from '@/components/InstructionCounter';

export default function Home() {
  return (
    <main>
      {/* ... existing layout ... */}
      <InstructionCounter />
    </main>
  );
}
```

---

## Performance Considerations

### Memory Usage
- **8051 Emulator:** ~64KB (memory array)
- **8086 Emulator:** ~1MB (memory array)
- **Opcode Tables:** ~5KB each
- **UI State:** ~10KB (Zustand store + React tree)

### Execution Speed
- **Direct Execution:** ~1ms per 100 instructions
- **Assembly Parsing:** O(n) where n = lines
- **Code Generation:** O(n) where n = instructions
- **Disassembly:** O(n) where n = bytes

### Optimization Opportunities
1. **Lazy loading** - Load opcode tables on demand
2. **Memoization** - Cache parsed instructions
3. **Web Workers** - Offload long-running execution
4. **Virtual scrolling** - For large disassembly listings

---

## Testing Strategy

### Unit Tests
```typescript
// opcodes/8051.test.ts
test('MOV A, #imm8', () => {
  const result = assemble('MOV A, #08H', '8051');
  expect(result.bytes).toEqual([0x74, 0x08]);
});
```

### Integration Tests
```typescript
// store.test.ts
test('runProgram execution', () => {
  const store = useSimulatorStore.getState();
  store.setCode('NOP\nNOP');
  store.runProgram();
  expect(store.consoleMessages.length).toBeGreaterThan(0);
});
```

### Component Tests
```typescript
// DisassemblyPanel.test.tsx
test('renders instruction list', () => {
  render(<DisassemblyPanel />);
  expect(screen.getByText(/disassembly/i)).toBeInTheDocument();
});
```

---

## Debugging Guide

### Enable Verbose Logging

**In store.ts:**
```typescript
const DEBUG = true;

const log = (msg: string) => {
  if (DEBUG) console.log(`[STORE] ${msg}`);
};
```

### Browser DevTools

**Inspect State:**
```javascript
// In browser console:
localStorage.getItem('code-8086')  // Saved code
// Zustand store access (if exposed)
```

**Monitor Instructions:**
```javascript
// Add to console.log in runProgram()
console.table(instructions);
```

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Instructions not executing | Store not initialized | Check setProcessorType called |
| Memory not persisting | localStorage full | Clear browser storage |
| Disassembly shows "???" | Unknown opcode | Add entry to opcode table |
| Registers not updating | Instruction not modifying state | Check executeInstruction implementation |

---

## Future Architecture Evolution

### Phase 2: Memory-Based Execution
Replace direct execution with fetch-decode-execute loop:
```
PC → fetchByte(PC) → decode → execute → PC += length
```

### Phase 3: Cycle Counting
Add cycle timing to each opcode:
```typescript
interface OpcodeEntry {
  // ... existing
  cycles: number;  // 1-4 cycles per instruction
}
```

### Phase 4: Interrupt Support
Add interrupt handling:
```typescript
class Emulator {
  interruptQueue: Interrupt[];
  handleInterrupt(vector: number) { }
}
```

### Phase 5: Visualization
- Animated register updates
- Memory write/read highlighting
- Program counter animation
- Flag change notifications

---

## File Manifest

```
root/
├── lib/
│   ├── opcodes/
│   │   ├── 8051.ts          # 8051 instruction mapping
│   │   └── 8086.ts          # 8086 instruction mapping
│   ├── emulator/
│   │   ├── 8051.ts          # 8051 CPU class
│   │   └── 8086.ts          # 8086 CPU class
│   ├── codeGenerator.ts      # Assembly → bytecode
│   ├── assembler.ts          # Legacy (being replaced)
│   ├── store.ts              # Zustand state
│   ├── mnemonics.ts          # Instruction reference
│   └── utils.ts              # Utilities
├── components/
│   ├── CodeEditor.tsx        # Monaco editor
│   ├── DisassemblyPanel.tsx  # Bytecode viewer
│   ├── RegistersDisplay.tsx  # Register inspector
│   ├── MemoryDisplay.tsx     # Memory inspector
│   ├── MemoryEditModal.tsx   # Memory R/W
│   ├── MnemonicsModal.tsx    # Instruction ref
│   ├── WelcomeModal.tsx      # Tutorial
│   ├── HelpSidebar.tsx       # Help panel
│   ├── KeyboardHandler.tsx   # Shortcuts
│   ├── Console.tsx           # Output log
│   └── ui/                   # Radix UI components
├── app/
│   ├── page.tsx              # Main layout
│   └── layout.tsx            # Root layout
├── OPCODE_REFERENCE.md       # Instruction docs
├── README.md                 # Main guide
└── package.json              # Dependencies
```

---

## Contributor Guidelines

1. **Code Style** - Use TypeScript strict mode
2. **Comments** - Document complex logic with JSDoc
3. **Tests** - Add tests for new features
4. **Performance** - Profile before optimizing
5. **Documentation** - Update README/OPCODE_REFERENCE
6. **Git** - Descriptive commit messages

---

## References

- [Intel 8086 Manual](https://en.wikipedia.org/wiki/Intel_8086)
- [Intel 8051 Manual](https://en.wikipedia.org/wiki/Intel_8051)
- [Next.js Documentation](https://nextjs.org/docs)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [Monaco Editor API](https://microsoft.github.io/monaco-editor/)

