/**
 * Assembler - Convert assembly instructions to machine code
 * Supports both 8051 and 8086
 */

import { OPCODES_8051 } from './opcodes/8051';
import { OPCODES_8086 } from './opcodes/8086';

export interface AssemblyInstruction {
  mnemonic: string;
  operands: string[];
  raw: string;
  address?: number;
  bytes?: number[];
}

export interface AssemblyError {
  line: number;
  instruction: string;
  error: string;
}

/**
 * Parse assembly code into instructions
 */
export function parseAssembly(code: string, processorType: '8051' | '8086'): {
  instructions: AssemblyInstruction[];
  errors: AssemblyError[];
} {
  const lines = code.split('\n');
  const instructions: AssemblyInstruction[] = [];
  const errors: AssemblyError[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Skip empty lines and comments
    if (!line || line.startsWith(';') || line.startsWith('//')) continue;

    // Remove inline comments
    const commentIndex = line.indexOf(';');
    const cleanLine = commentIndex !== -1 ? line.substring(0, commentIndex).trim() : line;

    if (!cleanLine) continue;

    // Parse mnemonic and operands
    const parts = cleanLine.split(/\s+/);
    const mnemonic = parts[0].toUpperCase();
    const operands = parts.slice(1).join(' ').split(',').map((op) => op.trim());

    instructions.push({
      mnemonic,
      operands: operands.filter((op) => op),
      raw: cleanLine,
      address: undefined,
      bytes: undefined,
    });
  }

  return { instructions, errors };
}

/**
 * Generate machine code for 8051 instruction
 */
function generate8051(instruction: AssemblyInstruction): number[] {
  const { mnemonic, operands } = instruction;
  const bytes: number[] = [];

  try {
    switch (mnemonic) {
      // MOV instructions
      case 'MOV':
        if (operands[0] === 'A' && operands[1].startsWith('#')) {
          // MOV A, #imm8
          const imm = parseNumber(operands[1].substring(1));
          bytes.push(0x74, imm & 0xFF);
        } else if (operands[0] === 'DPTR' && operands[1].startsWith('#')) {
          // MOV DPTR, #imm16
          const imm = parseNumber(operands[1].substring(1));
          bytes.push(0x90, (imm >> 8) & 0xFF, imm & 0xFF);
        } else if (operands[0] === 'A' && operands[1] === 'B') {
          // MOV A, B
          bytes.push(0xE5);
        } else if (operands[0] === 'B' && operands[1] === 'A') {
          // MOV B, A
          bytes.push(0xF5);
        }
        break;

      // MOVX instructions
      case 'MOVX':
        if (operands[0] === 'A' && operands[1] === '@DPTR') {
          // MOVX A, @DPTR
          bytes.push(0xE0);
        } else if (operands[0] === '@DPTR' && operands[1] === 'A') {
          // MOVX @DPTR, A
          bytes.push(0xF0);
        } else if (operands[0] === 'B' && operands[1] === '@DPTR') {
          // MOVX B, @DPTR
          bytes.push(0xE5, 0xF0);
        }
        break;

      // Arithmetic instructions
      case 'ADD':
        if (operands[0] === 'A' && operands[1].startsWith('#')) {
          // ADD A, #imm8
          const imm = parseNumber(operands[1].substring(1));
          bytes.push(0x24, imm & 0xFF);
        } else if (operands[0] === 'A' && operands[1] === 'B') {
          // ADD A, B
          bytes.push(0x28);
        }
        break;

      case 'SUB':
        if (operands[0] === 'A' && operands[1].startsWith('#')) {
          // SUBB A, #imm8 (subtract with borrow)
          const imm = parseNumber(operands[1].substring(1));
          bytes.push(0x94, imm & 0xFF);
        }
        break;

      case 'MUL':
        if (operands[0] === 'AB') {
          // MUL AB
          bytes.push(0xA4);
        }
        break;

      case 'DIV':
        if (operands[0] === 'AB') {
          // DIV AB
          bytes.push(0x84);
        }
        break;

      // Increment/Decrement
      case 'INC':
        if (operands[0] === 'A') {
          bytes.push(0x04);
        } else if (operands[0] === 'B') {
          bytes.push(0x05);
        } else if (operands[0] === 'DPTR') {
          bytes.push(0xA3);
        }
        break;

      case 'DEC':
        if (operands[0] === 'A') {
          bytes.push(0x14);
        } else if (operands[0] === 'B') {
          bytes.push(0x15);
        }
        break;

      // Logical instructions
      case 'ANL':
        if (operands[0] === 'A' && operands[1].startsWith('#')) {
          const imm = parseNumber(operands[1].substring(1));
          bytes.push(0x54, imm & 0xFF);
        }
        break;

      case 'ORL':
        if (operands[0] === 'A' && operands[1].startsWith('#')) {
          const imm = parseNumber(operands[1].substring(1));
          bytes.push(0x44, imm & 0xFF);
        }
        break;

      case 'XRL':
        if (operands[0] === 'A' && operands[1].startsWith('#')) {
          const imm = parseNumber(operands[1].substring(1));
          bytes.push(0x64, imm & 0xFF);
        }
        break;

      // Rotate instructions
      case 'RLC':
        if (operands[0] === 'A') {
          bytes.push(0x33);
        }
        break;

      case 'RRC':
        if (operands[0] === 'A') {
          bytes.push(0x13);
        }
        break;

      case 'RL':
        if (operands[0] === 'A') {
          bytes.push(0x23);
        }
        break;

      case 'RR':
        if (operands[0] === 'A') {
          bytes.push(0x03);
        }
        break;

      // Bit operations
      case 'CLR':
        if (operands[0] === 'A') {
          bytes.push(0xE4);
        } else if (operands[0] === 'C') {
          bytes.push(0xC3);
        }
        break;

      case 'SETB':
        if (operands[0] === 'C') {
          bytes.push(0xD3);
        }
        break;

      case 'CPL':
        if (operands[0] === 'A') {
          bytes.push(0xF4);
        } else if (operands[0] === 'C') {
          bytes.push(0xB3);
        }
        break;

      // Jump instructions
      case 'SJMP':
        if (operands[0].startsWith('$')) {
          // Relative jump (simplified - offset would need calculation)
          const offset = 0; // Placeholder
          bytes.push(0x80, offset & 0xFF);
        }
        break;

      case 'JZ':
        bytes.push(0x60, 0x00); // Placeholder offset
        break;

      case 'JNZ':
        bytes.push(0x70, 0x00); // Placeholder offset
        break;

      case 'JC':
        bytes.push(0x40, 0x00); // Placeholder offset
        break;

      case 'JNC':
        bytes.push(0x50, 0x00); // Placeholder offset
        break;

      // Control flow
      case 'NOP':
        bytes.push(0x00);
        break;

      case 'HLT':
        // Halt — for 8051 this project uses a custom opcode 0xFF, for 8086 we'll map to 0xF4
        bytes.push(0xFF);
        break;

      default:
        throw new Error(`Unknown instruction: ${mnemonic}`);
    }
  } catch (e) {
    throw new Error(`Failed to generate code for ${mnemonic}: ${(e as Error).message}`);
  }

  return bytes;
}

/**
 * Generate machine code for 8086 instruction
 */
function generate8086(instruction: AssemblyInstruction): number[] {
  const { mnemonic, operands } = instruction;
  const bytes: number[] = [];

  try {
    switch (mnemonic) {
      // MOV instructions
      case 'MOV':
        if (operands[0] === 'AX' && operands[1].startsWith('#')) {
          // MOV AX, #imm16
          const imm = parseNumber(operands[1].substring(1));
          bytes.push(0xB8, imm & 0xFF, (imm >> 8) & 0xFF);
        } else if (operands[0] === 'BX' && operands[1].startsWith('#')) {
          // MOV BX, #imm16
          const imm = parseNumber(operands[1].substring(1));
          bytes.push(0xBB, imm & 0xFF, (imm >> 8) & 0xFF);
        } else if (operands[0] === 'CX' && operands[1].startsWith('#')) {
          // MOV CX, #imm16
          const imm = parseNumber(operands[1].substring(1));
          bytes.push(0xB9, imm & 0xFF, (imm >> 8) & 0xFF);
        } else if (operands[0] === 'DX' && operands[1].startsWith('#')) {
          // MOV DX, #imm16
          const imm = parseNumber(operands[1].substring(1));
          bytes.push(0xBA, imm & 0xFF, (imm >> 8) & 0xFF);
        }
        break;

      // ADD instructions
      case 'ADD':
        if (operands[0] === 'AX' && operands[1].startsWith('#')) {
          // ADD AX, #imm16
          const imm = parseNumber(operands[1].substring(1));
          bytes.push(0x05, imm & 0xFF, (imm >> 8) & 0xFF);
        } else if (operands[0] === 'AX' && operands[1] === 'BX') {
          // ADD AX, BX (ModR/M: 0xC3)
          bytes.push(0x03, 0xC3);
        }
        break;

      // SUB instructions
      case 'SUB':
        if (operands[0] === 'AX' && operands[1].startsWith('#')) {
          // SUB AX, #imm16
          const imm = parseNumber(operands[1].substring(1));
          bytes.push(0x2D, imm & 0xFF, (imm >> 8) & 0xFF);
        }
        break;

      // MUL instruction
      case 'MUL':
        if (operands[0] === 'BX') {
          // MUL BX (ModR/M: 0xE3)
          bytes.push(0xF7, 0xE3);
        }
        break;

      // DIV instruction
      case 'DIV':
        if (operands[0] === 'BX') {
          // DIV BX (ModR/M: 0xF3)
          bytes.push(0xF7, 0xF3);
        }
        break;

      // INC instructions
      case 'INC':
        if (operands[0] === 'AX') bytes.push(0x40);
        else if (operands[0] === 'BX') bytes.push(0x43);
        else if (operands[0] === 'CX') bytes.push(0x41);
        else if (operands[0] === 'DX') bytes.push(0x42);
        break;

      // DEC instructions
      case 'DEC':
        if (operands[0] === 'AX') bytes.push(0x48);
        else if (operands[0] === 'BX') bytes.push(0x4B);
        else if (operands[0] === 'CX') bytes.push(0x49);
        else if (operands[0] === 'DX') bytes.push(0x4A);
        break;

      // Jump instructions
      case 'JMP':
        if (operands[0].startsWith('$')) {
          bytes.push(0xEB, 0x00); // Short jump
        } else {
          bytes.push(0xE9, 0x00, 0x00); // Near jump
        }
        break;

      case 'JE':
      case 'JZ':
        bytes.push(0x74, 0x00); // Placeholder offset
        break;

      case 'JNE':
      case 'JNZ':
        bytes.push(0x75, 0x00); // Placeholder offset
        break;

      case 'JC':
        bytes.push(0x72, 0x00); // Placeholder offset
        break;

      case 'JNC':
        bytes.push(0x73, 0x00); // Placeholder offset
        break;

      // Stack operations
      case 'PUSH':
        if (operands[0] === 'AX') bytes.push(0x50);
        else if (operands[0] === 'BX') bytes.push(0x53);
        break;

      case 'POP':
        if (operands[0] === 'AX') bytes.push(0x58);
        else if (operands[0] === 'BX') bytes.push(0x5B);
        break;

      // NOP
      case 'NOP':
        bytes.push(0x90);
        break;

      case 'HLT':
        // Map HLT to 0xF4 (8086 HLT instruction)
        bytes.push(0xF4);
        break;

      default:
        throw new Error(`Unknown instruction: ${mnemonic}`);
    }
  } catch (e) {
    throw new Error(`Failed to generate code for ${mnemonic}: ${(e as Error).message}`);
  }

  return bytes;
}

/**
 * Convert assembly code to machine code (byte array)
 */
export function assemble(
  code: string,
  processorType: '8051' | '8086',
): {
  bytes: number[];
  instructions: AssemblyInstruction[];
  errors: AssemblyError[];
} {
  const { instructions, errors } = parseAssembly(code, processorType);
  const allBytes: number[] = [];
  let currentAddress = 0;

  for (let i = 0; i < instructions.length; i++) {
    const instr = instructions[i];
    instr.address = currentAddress;

    try {
      const genFn = processorType === '8051' ? generate8051 : generate8086;
      const instrBytes = genFn(instr);

      instr.bytes = instrBytes;
      allBytes.push(...instrBytes);
      currentAddress += instrBytes.length;
    } catch (e) {
      errors.push({
        line: i + 1,
        instruction: instr.raw,
        error: (e as Error).message,
      });
    }
  }

  return {
    bytes: allBytes,
    instructions,
    errors,
  };
}

/**
 * Parse a number (supports hex with 0x prefix or plain decimal/hex)
 */
function parseNumber(value: string): number {
  const trimmed = value.trim();
  if (trimmed.toLowerCase().startsWith('0x')) {
    return parseInt(trimmed, 16);
  }
  // For 8051, default to hex per convention
  return parseInt(trimmed, 16);
}

/**
 * Generate a disassembly listing with addresses and bytes
 */
export function generateDisassemblyListing(
  bytes: number[],
  processorType: '8051' | '8086',
): string {
  const lines: string[] = [];
  let i = 0;
  let address = 0;

  const disassembleFn = processorType === '8051'
    ? require('./opcodes/8051').disassemble8051
    : require('./opcodes/8086').disassemble8086;

  lines.push('Address | Bytes          | Mnemonic');
  lines.push('--------|----------------|----------- ');

  while (i < bytes.length) {
    const addr = address.toString(16).toUpperCase().padStart(4, '0');
    const chunk = bytes.slice(i, i + 4);
    const chunkStr = chunk.map((b) => b.toString(16).toUpperCase().padStart(2, '0')).join(' ');

    const result = disassembleFn(chunk.slice(), address);
    const mnemonic = result
      ? `${result.mnemonic} ${result.operands}`
      : '???';

    lines.push(
      `0x${addr}  | ${chunkStr.padEnd(14)} | ${mnemonic}`,
    );

    if (result) {
      i += result.length;
      address += result.length;
    } else {
      i++;
      address++;
    }
  }

  return lines.join('\n');
}
