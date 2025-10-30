# Microprocessor Emulator (MPMC)

A comprehensive web-based emulator for Intel 8086 and 8051 microprocessors. This platform provides real-time assembly code execution, debugging capabilities, and a complete opcode reference.

**Author:** Amaljith M V

## Features

### 🎯 Core Emulation
- **Intel 8086** - 16-bit microprocessor with full instruction set
- **Intel 8051** - 8-bit microcontroller with external memory support
- **Real-time Execution** - Step through code line-by-line or run complete programs
- **Register Display** - Live view of all registers and flags
- **Memory Inspector** - View and edit memory contents (RAM, external memory)
- **I/O Ports** - Monitor and simulate port operations (8051 only)

### 🔧 Development Tools
- **Monaco Code Editor** - Syntax highlighting and intelligent code completion
- **Mnemonics Reference** - Searchable instruction guide with examples
- **Disassembly Panel** - Real-time visualization of machine code
- **Opcode Tables** - Complete instruction set mapping with byte-level details
- **Code Generator** - Convert assembly → machine code (bytecode)

### 💾 Persistence & Import/Export
- **Code Persistence** - Auto-save per processor type using localStorage
- **File Operations** - Save/load assembly files (.asm, .txt)
- **External Memory Loader** - Pre-load test data before execution

### ⌨️ Keyboard Shortcuts
- `R` - Run program
- `S` - Step to next instruction
- `X` - Reset simulator
- `M` - Open memory inspector
- `?` - Show keyboard help
- `C` - Toggle console

---

## Architecture

### Opcode System

#### 8051 Opcode Table (`lib/opcodes/8051.ts`)
Complete mapping of 8051 instructions to machine code:
- **MOV** (15+ variants) - Register, immediate, memory addressing
- **MOVX** - External memory read/write with automatic register selection
- **Arithmetic** - ADD, SUBB, MUL, DIV with flag updates
- **Logical** - ANL, ORL, XRL, CPL operations
- **Rotate** - RLC, RRC, RL, RR (rotate/shift operations)
- **Bit Operations** - CLR, SETB, bit addressing
- **Jumps** - SJMP, JZ, JNZ, JC, JNC with 16-bit addressing
- **Control** - NOP and halt states

Example:
```typescript
MOV_A_IMM: {
  mnemonic: 'MOV',
  opcode: 0x74,
  operands: 'A, #imm8',
  bytes: 2,
  description: 'Move immediate to A'
}
```

#### 8086 Opcode Table (`lib/opcodes/8086.ts`)
Complete 8086 instruction mapping with ModR/M encoding:
- **MOV** - Register-to-register, immediate, memory operations
- **Arithmetic** - ADD, SUB, MUL, DIV with 16-bit operands
- **Logical** - AND, OR, XOR, NOT, NEG
- **Shifts** - SHL, SHR, SAR, ROL, ROR
- **Jumps** - Short, near, and conditional jumps (JE, JNE, JL, JG, JC, JNC)
- **Stack** - PUSH, POP operations
- **Control** - CALL, RET, NOP, HLT

### Code Generation (`lib/codeGenerator.ts`)

**Assembly Parser**
```typescript
parseAssembly(code: string, processorType: '8051' | '8086')
  → { instructions, errors }
```
- Tokenizes assembly code
- Extracts mnemonics and operands
- Handles comments (`;` and `//`)
- Reports line-by-line parsing errors

**Machine Code Generator**
```typescript
assemble(code: string, processorType: '8051' | '8086')
  → { bytes, instructions, errors }
```
- Converts parsed instructions to bytecode
- Generates operand-specific encodings
- Tracks instruction lengths and addresses
- Returns full program as byte array

**Disassembly**
```typescript
generateDisassemblyListing(bytes: number[], processorType: '8051' | '8086')
  → string (tabular format)
```
- Byte-to-instruction decoding
- Address-relative display
- Formatted opcode/mnemonic columns

### Emulator Core

#### 8051 Emulator (`lib/emulator/8051.ts`)
- **Memory** - 64KB unified memory (program + data + external)
- **Registers** - A, B, R0-R7, DPTR, PC, SP, PSW
- **Flags** - Carry, Auxiliary Carry, Overflow, Parity
- **External Memory** - Loadable test data via XRAM
- **Program Loading** - `loadProgram(bytes)` for bytecode execution
- **Instruction Fetch** - `fetchByte(address)` for PC-based execution

#### 8086 Emulator (`lib/emulator/8086.ts`)
- **Memory** - 1MB segmented memory (up to 0xFFFFF)
- **Registers** - AX, BX, CX, DX, SI, DI, BP, SP, segment registers
- **Flags** - Carry, Parity, Auxiliary, Zero, Sign, Overflow, Interrupt, Direction, Trap
- **Program Loading** - `loadProgram(bytes)` at CS:IP
- **Segmentation** - CS, DS, SS, ES support (simplified model)
- **Instruction Fetch** - `fetchByte()` respects segment:offset addressing

---

## UI Components

### Main Editor Interface (`app/page.tsx`)
- **Processor Selector** - Switch between 8086/8051
- **Toolbar** - Run, Step, Reset, Memory, Save/Load buttons
- **Editor Panel** - Code input with Monaco editor
- **Disassembly Panel** - Collapsible machine code view
- **Console** - Execution trace and error reporting
- **Sidebar Panels**:
  - Registers Display
  - Memory Display
  - I/O Ports (8051 only)
  - Help Sidebar (floating button)

### Modal Dialogs
- **Welcome Modal** - First-time tutorial (4 tabs)
- **Keyboard Help** - Shortcut reference
- **Mnemonics Modal** - Searchable instruction reference
- **Memory Editor** - Read/write single bytes/words
- **External Memory Loader** - Pre-populate test data
- **Disassembly Panel** - Real-time instruction breakdown

---

## Usage Examples

### Example 1: 8051 Division
```asm
MOV A, #08H        ; A = 8
MOV B, #04H        ; B = 4
DIV AB             ; A = 2 (quotient), B = 0 (remainder)
```

### Example 2: 8086 Arithmetic
```asm
MOV AX, #10        ; AX = 10
MOV BX, #20        ; BX = 20
ADD AX, BX         ; AX = 30
```

### Example 3: 8051 External Memory
```asm
MOV DPTR, #8500H   ; Set external memory address
MOV A, #06H        ; Prepare data
MOVX @DPTR, A      ; Write to external memory
INC DPTR           ; Next address
MOVX A, @DPTR      ; Read from external memory
```

---

## Running the Simulator

### Prerequisites
- Node.js 16+ (LTS recommended)
- npm or yarn

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
# Open http://localhost:3000
```

### Production Build
```bash
npm run build
npm start
```

---

## Technical Stack

- **Frontend** - Next.js 13 (React)
- **Editor** - Monaco Editor (@monaco-editor/react)
- **Styling** - Tailwind CSS
- **State** - Zustand (global store)
- **Components** - Radix UI (headless)
- **Notifications** - Sonner (toast)
- **Language** - TypeScript

---

## Data Structures

### AssemblyInstruction
```typescript
{
  mnemonic: string;      // e.g., "MOV"
  operands: string[];    // e.g., ["A", "#10"]
  raw: string;           // Original line
  address?: number;      // Program address (set during assembly)
  bytes?: number[];      // Machine code bytes
}
```

### OpcodeEntry (8051/8086)
```typescript
{
  mnemonic: string;         // e.g., "ADD"
  opcode: number | number[]; // Machine code byte(s)
  operands: string;         // e.g., "A, #imm8"
  bytes: number;            // Instruction length in bytes
  description: string;      // Help text
  modrm?: boolean;          // Has ModR/M byte (8086)
  displacement?: string;    // Addressing mode
}
```

---

## Future Enhancements

- [ ] Breakpoint support
- [ ] Code profiling (cycle counting)
- [ ] Interrupt simulation
- [ ] Full 8086 ModR/M encoding
- [ ] Segment addressing visualization
- [ ] Memory watchpoints
- [ ] Visual stack display
- [ ] Program counter animation
- [ ] Multi-file assembly projects
- [ ] Instruction cache simulation

---

## File Structure

```
lib/
  ├── opcodes/
  │   ├── 8051.ts       # 8051 opcode table & disassembler
  │   └── 8086.ts       # 8086 opcode table & disassembler
  ├── emulator/
  │   ├── 8051.ts       # 8051 core emulation
  │   └── 8086.ts       # 8086 core emulation
  ├── codeGenerator.ts  # Assembler & code generation
  ├── store.ts          # Zustand state management
  ├── mnemonics.ts      # Instruction reference data
  └── assembler.ts      # Legacy assembler (being replaced)

components/
  ├── CodeEditor.tsx         # Monaco editor with completion
  ├── DisassemblyPanel.tsx   # Machine code viewer
  ├── RegistersDisplay.tsx   # Register values
  ├── MemoryDisplay.tsx      # Memory inspector
  ├── MemoryEditModal.tsx    # Memory R/W dialog
  ├── MnemonicsModal.tsx     # Instruction reference
  ├── KeyboardHandler.tsx    # Keyboard shortcuts
  ├── WelcomeModal.tsx       # First-time guide
  ├── HelpSidebar.tsx        # Collapsible help
  └── ui/                    # Radix UI components

app/
  └── page.tsx               # Main layout & orchestration
```

---

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes to lib/opcodes or components
4. Test on both 8086 and 8051 modes
5. Submit pull request

---

## License

MIT License - See LICENSE file for details

---

## Credits

- Intel 8086 & 8051 instruction set documentation
- Monaco Editor by Microsoft
- Radix UI components
- Tailwind CSS framework

