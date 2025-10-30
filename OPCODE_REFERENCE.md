# Opcode System Documentation

**Author:** Amaljith M V

## Overview

The MPMC emulator uses a two-tier system for instruction handling:
1. **Opcode Tables** (`lib/opcodes/`) - Machine code reference
2. **Code Generator** (`lib/codeGenerator.ts`) - Assembly → bytecode compiler

This enables both direct execution (legacy) and memory-based execution (future).

---

## Opcode Tables

### Purpose
Opcode tables map assembly mnemonics to their machine code representations, including operand encoding schemes.

### 8051 Instruction Set (`lib/opcodes/8051.ts`)

#### Data Movement
```
MOV A, #imm8        0x74 imm8
MOV DPTR, #imm16    0x90 imm16_h imm16_l
MOV A, B            0xE5
MOV B, A            0xF5
MOVX A, @DPTR       0xE0                (external mem read)
MOVX @DPTR, A       0xF0                (external mem write)
MOVX B, @DPTR       0xE5 0xF0           (read into B)
```

#### Arithmetic
```
ADD A, #imm8        0x24 imm8
ADD A, B            0x28
SUBB A, #imm8       0x94 imm8           (subtract with carry)
MUL AB              0xA4
DIV AB              0x84
INC A               0x04
INC B               0x05
INC DPTR            0xA3                (16-bit increment)
DEC A               0x14
DEC B               0x15
```

#### Logical Operations
```
ANL A, #imm8        0x54 imm8
ORL A, #imm8        0x44 imm8
XRL A, #imm8        0x64 imm8
CLR A               0xE4                (clear = set to 0)
CPL A               0xF4                (bitwise NOT)
```

#### Rotate & Shift
```
RLC A               0x33                (rotate left through carry)
RRC A               0x13                (rotate right through carry)
RL A                0x23                (rotate left)
RR A                0x03                (rotate right)
```

#### Bit Operations
```
SETB C              0xD3                (set carry flag)
CLR C               0xC3                (clear carry flag)
CPL C               0xB3                (toggle carry)
```

#### Jump Instructions
```
SJMP addr           0x80 rel8           (short jump, signed offset)
JZ addr             0x60 rel8           (jump if A = 0)
JNZ addr            0x70 rel8           (jump if A ≠ 0)
JC addr             0x40 rel8           (jump if carry set)
JNC addr            0x50 rel8           (jump if carry clear)
```

#### Control
```
NOP                 0x00
```

### 8086 Instruction Set (`lib/opcodes/8086.ts`)

#### Immediate Mode (Reg ← Imm16)
```
MOV AX, imm16       0xB8 imm16_l imm16_h
MOV BX, imm16       0xBB imm16_l imm16_h
MOV CX, imm16       0xB9 imm16_l imm16_h
MOV DX, imm16       0xBA imm16_l imm16_h
```

#### Register Mode (Reg ← Reg)
```
MOV reg16, reg16    0x89 ModR/M
ADD reg16, reg16    0x01 ModR/M
SUB reg16, reg16    0x29 ModR/M
AND reg16, reg16    0x21 ModR/M
OR reg16, reg16     0x09 ModR/M
XOR reg16, reg16    0x31 ModR/M
CMP reg16, reg16    0x39 ModR/M
```

#### Immediate Operations (Reg ← Imm16)
```
ADD AX, imm16       0x05 imm16_l imm16_h
SUB AX, imm16       0x2D imm16_l imm16_h
AND AX, imm16       0x25 imm16_l imm16_h
OR AX, imm16        0x0D imm16_l imm16_h
XOR AX, imm16       0x35 imm16_l imm16_h
CMP AX, imm16       0x3D imm16_l imm16_h
```

#### Single-Operand
```
INC AX              0x40
INC BX              0x43
DEC AX              0x48
DEC BX              0x4B
NOT AX              0xF7 0xD0 (ModR/M)
NEG AX              0xF7 0xD8 (ModR/M)
MUL BX              0xF7 0xE3 (DX:AX ← AX × BX)
DIV BX              0xF7 0xF3 (AX ← DX:AX ÷ BX)
```

#### Shift/Rotate
```
SHL AX, 1           0xD1 0xE0 (ModR/M)
SHL AX, CL          0xD3 0xE0
SHR AX, 1           0xD1 0xE8
SAR AX, 1           0xD1 0xF8
ROL AX, 1           0xD1 0xC0
ROR AX, 1           0xD1 0xC8
```

#### Jump Instructions
```
JMP short rel8      0xEB rel8
JMP near rel16      0xE9 rel16_l rel16_h
JE rel8             0x74 rel8
JZ rel8             0x74 rel8
JNE rel8            0x75 rel8
JNZ rel8            0x75 rel8
JL rel8             0x7C rel8
JG rel8             0x7F rel8
JC rel8             0x72 rel8
JNC rel8            0x73 rel8
```

#### Stack Operations
```
PUSH AX             0x50
PUSH BX             0x53
POP AX              0x58
POP BX              0x5B
```

#### Procedure Calls
```
CALL near rel16     0xE8 rel16_l rel16_h
RET                 0xC3
```

---

## Code Generator API

### Parsing Phase

```typescript
interface AssemblyInstruction {
  mnemonic: string;      // Uppercase instruction name
  operands: string[];    // Individual operands (trimmed)
  raw: string;           // Original assembly line
  address?: number;      // Address in program memory
  bytes?: number[];      // Generated machine code
}

function parseAssembly(
  code: string,
  processorType: '8051' | '8086'
): {
  instructions: AssemblyInstruction[];
  errors: AssemblyError[];
}
```

**Example:**
```typescript
const { instructions } = parseAssembly(
  "MOV AX, #10\nADD AX, BX\nNOP",
  '8086'
);
// Returns:
// [
//   { mnemonic: "MOV", operands: ["AX", "#10"] },
//   { mnemonic: "ADD", operands: ["AX", "BX"] },
//   { mnemonic: "NOP", operands: [] }
// ]
```

### Code Generation Phase

```typescript
function assemble(
  code: string,
  processorType: '8051' | '8086'
): {
  bytes: number[];              // Complete program bytecode
  instructions: AssemblyInstruction[];  // With bytes & address set
  errors: AssemblyError[];
}
```

**Example:**
```typescript
const result = assemble("MOV AX, #10\nNOP", '8086');
console.log(result.bytes);
// [0xB8, 0x0A, 0x00, 0x90]
//  ↑     ↑     ↑     ↑
//  MOV   10    00    NOP

console.log(result.instructions[0]);
// {
//   mnemonic: "MOV",
//   operands: ["AX", "#10"],
//   address: 0,
//   bytes: [0xB8, 0x0A, 0x00]
// }
```

### Disassembly Phase

```typescript
function disassemble8051(
  bytes: number[],
  startAddress: number = 0
): {
  mnemonic: string;
  operands: string;
  length: number;
} | null

function generateDisassemblyListing(
  bytes: number[],
  processorType: '8051' | '8086'
): string  // Tabular format
```

**Example:**
```typescript
const bytes = [0x74, 0x08];  // MOV A, #08H
const result = disassemble8051(bytes);
// {
//   mnemonic: "MOV",
//   operands: "A, 0x08",
//   length: 2
// }
```

---

## Assembly Syntax

### Supported Formats

#### Immediates
- Hexadecimal: `#0x10`, `#10H`, `#10`
- Binary: `#1010B`
- Decimal: Generally treated as hex for 8051 (convention)

#### Registers (8051)
- Accumulators: `A`, `B`
- Work Registers: `R0`-`R7`
- Special: `DPTR`, `PC`, `SP`, `PSW`

#### Registers (8086)
- 16-bit: `AX`, `BX`, `CX`, `DX`, `SI`, `DI`, `BP`, `SP`
- 8-bit: `AL`, `AH`, `BL`, `BH`, `CL`, `CH`, `DL`, `DH`
- Segment: `CS`, `DS`, `ES`, `SS`

#### Addressing Modes
- **Register**: `MOV A, B`
- **Immediate**: `MOV A, #10H`
- **Memory Direct**: `MOVX A, @DPTR` (8051)
- **Indexed**: Not yet supported

#### Comments
- Semicolon: `; comment`
- Slash pair: `// comment`

### Examples

**8051 Program**
```asm
; Division example
MOV A, #08H          ; A = 8
MOV B, #04H          ; B = 4
DIV AB               ; A = 2, B = 0
```

**8086 Program**
```asm
; Multiplication example
MOV AX, #10          ; AX = 10
MOV BX, #20          ; BX = 20
MUL BX               ; DX:AX = AX * BX = 200
```

---

## Operand Encoding

### Immediate Values
- **8-bit**: 0-255 (0x00-0xFF)
- **16-bit**: 0-65535 (0x0000-0xFFFF)
- **Little-Endian**: Low byte first, high byte second

Example:
```
MOV AX, #0x1234     → 0xB8 0x34 0x12
                       ↑    ↑    ↑
                      opcode lo   hi
```

### ModR/M Byte (8086 only)
Format: `[Mod:2][Reg:3][R/M:3]`
- **Mod**: Addressing mode (00=indirect, 01=disp8, 10=disp16, 11=register)
- **Reg**: Register field
- **R/M**: Register or memory field

Example:
```
ADD AX, BX          → 0x01 0xC3
                       ↑    ↑
                      opcode ModR/M
                               11 000 011
                               ↑  ↑    ↑
                               reg mode AX,BX
```

### Relative Offsets (Jumps)
- **Signed**: 8-bit (-128 to +127) for short jumps
- **Signed**: 16-bit (-32768 to +32767) for near jumps
- **Relative**: Offset from end of jump instruction

Example:
```
JZ .target           → 0x60 0x05
Address 0x0100              (offset to reach 0x0107)
```

---

## Error Handling

### Parsing Errors
- Invalid opcode: `Unknown instruction: XYZ`
- Missing operands: `SUBB requires 2 operands`
- Invalid operand format: `Failed to generate code`

### Code Generation Errors
- Out-of-range immediates
- Invalid register combinations
- Unsupported addressing modes

### Error Structure
```typescript
interface AssemblyError {
  line: number;         // Line number (1-based)
  instruction: string;  // Raw assembly line
  error: string;        // Error message
}
```

---

## Performance Considerations

### Assembly
- O(n) parsing where n = number of lines
- O(n) code generation
- Operand resolution: O(1) via lookup tables

### Memory Usage
- 8051 program: 4KB max typical (64KB limit)
- 8086 program: 64KB max typical (1MB limit)
- Opcode table cache: ~5KB per processor type

### Future: Memory-Based Execution
Currently implements direct execution via `executeInstruction()`. Future enhancement:
- Load bytecode via `emulator.loadProgram(bytes)`
- Fetch via `emulator.fetchByte(PC)`
- Execute via instruction decode loop
- Enables cycle counting and profiling

---

## Integration Example

### Complete Workflow
```typescript
// 1. Write assembly code
const code = `
  MOV AX, #10
  MOV BX, #20
  ADD AX, BX
  NOP
`;

// 2. Assemble to machine code
const { bytes, instructions, errors } = assemble(code, '8086');

if (errors.length > 0) {
  console.error("Assembly failed:", errors);
  return;
}

// 3. Load into emulator memory
const emulator = new Emulator8086();
emulator.loadProgram(bytes);

// 4. Execute via fetch-decode-execute (future)
while (!emulator.halted) {
  const opcode = emulator.fetchByte();  // Get byte at IP
  // ... decode and execute
  emulator.registers.IP += instructionLength;
}

// 5. Generate disassembly listing
const listing = generateDisassemblyListing(bytes, '8086');
console.log(listing);
```

---

## Testing

### Unit Tests (Recommended)
```typescript
test('8051 MOV assembly', () => {
  const { bytes } = assemble("MOV A, #08H", '8051');
  expect(bytes).toEqual([0x74, 0x08]);
});

test('8086 ADD assembly', () => {
  const { bytes } = assemble("ADD AX, #10", '8086');
  expect(bytes).toEqual([0x05, 0x0A, 0x00]);
});

test('Assembly error handling', () => {
  const { errors } = assemble("INVALID A", '8051');
  expect(errors.length).toBeGreaterThan(0);
});
```

### Manual Testing via UI
1. Type assembly code in editor
2. Observe **Disassembly Panel** update in real-time
3. Click **Run** to execute bytecode
4. Check **Console** for trace output
5. Verify **Registers** show expected values

---

## Roadmap

### Phase 1: Complete ✅
- 8051 opcode table
- 8086 opcode table  
- Basic code generator
- Disassembly UI

### Phase 2: In Progress 🔄
- Program memory loading
- Fetch-execute cycle
- Instruction profiling

### Phase 3: Planned 📋
- Full 8086 ModR/M encoding
- Segment addressing UI
- Interrupt simulation
- Breakpoint support
- Memory watch expressions

