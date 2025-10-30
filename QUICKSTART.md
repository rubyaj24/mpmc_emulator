# Quick Start Guide: Machine Code & Disassembly

**Author:** Amaljith M V

## For Users

### 1. Write Assembly Code
```asm
; Example: Add two numbers
MOV AX, #10
MOV BX, #20
ADD AX, BX
NOP
```

### 2. View Machine Code
Look at the **Disassembly** panel below the editor:

```
Address | Bytes          | Instruction
--------|----------------|----------
0x0000  | B8 0A 00       | MOV AX, #10
0x0003  | BB 14 00       | MOV BX, #20
0x0006  | 03 C3          | ADD AX, BX
0x0008  | 90             | NOP
```

Each row shows:
- **Address** - Memory location (in hex)
- **Bytes** - Machine code bytes (in hex)
- **Instruction** - Human-readable assembly

### 3. Run or Step Through
- Click **Run (R)** to execute the entire program
- Click **Step (S)** to execute one instruction at a time
- Watch the **Registers** panel update in real-time

### 4. See Results
- **Console** shows execution trace with register values
- **Registers** panel displays current register state
- **Memory** can be inspected with the Memory button (M)

---

## For Developers

### Understanding the Compilation Pipeline

```
User Code (Assembly)
    ↓ parseAssembly()
Parsed Instructions
    ↓ generate*()
Machine Code (Bytes)
    ↓ loadProgram()
Emulator Memory
    ↓ executeInstruction()
Register/Memory Changes
    ↓ Console Output
Results
```

### Key APIs

**Assembling Code:**
```typescript
import { assemble } from '@/lib/codeGenerator';

const code = "MOV AX, #10\nNOP";
const result = assemble(code, '8086');

console.log(result.bytes);          // [0xB8, 0x0A, 0x00, 0x90]
console.log(result.instructions);   // Array with address & bytes
console.log(result.errors);         // Any assembly errors
```

**Loading into Emulator:**
```typescript
import { Emulator8086 } from '@/lib/emulator/8086';

const emulator = new Emulator8086();
emulator.loadProgram(result.bytes);  // Load at IP=0

// Now emulator.memory contains the bytecode
```

**Disassembling:**
```typescript
import { generateDisassemblyListing } from '@/lib/codeGenerator';

const listing = generateDisassemblyListing(result.bytes, '8086');
console.log(listing);  // Tabular format with addresses & mnemonics
```

### Adding New Instructions

**1. Add to Opcode Table** (`lib/opcodes/8051.ts` or `8086.ts`)
```typescript
'MY_INST': {
  mnemonic: 'MYINST',
  opcode: 0xAA,
  operands: 'A, B',
  bytes: 1,
  description: 'My custom instruction'
}
```

**2. Add Code Generator** (`lib/codeGenerator.ts`)
```typescript
case 'MYINST':
  if (operands[0] === 'A' && operands[1] === 'B') {
    bytes.push(0xAA);
  }
  break;
```

**3. Add Emulator Handler** (`lib/emulator/8051.ts`)
```typescript
case 'MYINST':
  return this.executeMYINST(operands);

private executeMYINST(operands: string[]): string {
  // Do something interesting
  return 'MYINST executed';
}
```

### Common Tasks

#### Check if Code Assembles
```typescript
const { errors } = assemble(userCode, '8051');
if (errors.length > 0) {
  console.error('Assembly failed:', errors);
}
```

#### Get Machine Code Size
```typescript
const { bytes } = assemble(code, '8086');
console.log(`Program size: ${bytes.length} bytes`);
```

#### Debug Assembly Output
```typescript
const { instructions } = assemble(code, '8086');
instructions.forEach(inst => {
  console.log(
    `${inst.mnemonic} @ 0x${inst.address?.toString(16)} = ${inst.bytes?.map(b => b.toString(16)).join(' ')}`
  );
});
```

---

## Common Issues & Solutions

### Issue: "Unknown instruction: XYZ"
**Cause:** Instruction not in opcode table
**Solution:** 
1. Check spelling (case-insensitive)
2. Verify processor type (8051 vs 8086)
3. Add to OPCODES_* if it's a new instruction

### Issue: Disassembly shows "???" for bytes
**Cause:** Opcode not mapped in table
**Solution:** Check opcode table for that byte value; may need entry for multi-byte encoding

### Issue: Numbers interpreted as decimal instead of hex
**Solution:** Use `#0x` prefix or `#` suffix (e.g., `#0x10`, `#10H`)

### Issue: MOVX not working on registers other than A
**Solution:** Already fixed! MOVX now supports all registers: `MOVX B, @DPTR`

---

## Example Programs

### 8051: External Memory Read/Write
```asm
; Write 0x42 to address 0x8500
MOV DPTR, #8500H
MOV A, #42H
MOVX @DPTR, A

; Read it back
MOVX A, @DPTR      ; A should be 0x42
```

### 8086: Simple Arithmetic
```asm
MOV AX, #100
MOV BX, #50
ADD AX, BX         ; AX = 150
SUB AX, #25        ; AX = 125
```

### 8051: Division
```asm
MOV A, #12H        ; A = 18 decimal
MOV B, #04H        ; B = 4
DIV AB             ; A = 4 (quotient), B = 2 (remainder)
```

---

## Performance Tips

1. **Use "Step" for Debugging** - Slower but shows each instruction
2. **Use "Run" for Testing** - Faster execution with final state
3. **Check Disassembly First** - Verify bytecode before running
4. **Use Memory Inspector** - Verify writes with (M) button

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `R` | Run program |
| `S` | Step to next instruction |
| `X` | Reset simulator |
| `M` | Open memory inspector |
| `?` | Show help |
| `C` | Toggle console |

---

## What's Next?

### Coming Soon (Phase 2)
- Breakpoint support
- Instruction cycle counting
- Memory watchpoints

### Under Consideration
- Visual program counter animation
- Full 8086 segment addressing visualization
- Interrupt simulation
- Multi-file projects

---

## Getting Help

1. **Keyboard Shortcuts** - Press `?` for reference
2. **Mnemonics** - Click "Mnemonics" button for instruction guide
3. **Documentation** - See README.md and OPCODE_REFERENCE.md
4. **Architecture** - See ARCHITECTURE.md for technical details

---

## Report Issues

If you find a bug:
1. Write a simple test case
2. Check if it's a known issue
3. Describe expected vs actual behavior
4. Provide the assembly code that triggers it

---

## Credits

Built with:
- **React 18** - UI framework
- **Next.js 13** - Full-stack framework
- **Monaco Editor** - Code editor
- **Tailwind CSS** - Styling
- **TypeScript** - Type safety

---

Happy coding! 🚀

