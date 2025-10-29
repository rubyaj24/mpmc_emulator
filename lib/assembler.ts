import { ParsedInstruction } from './emulator/8086';

export function parseAssemblyLine(line: string): ParsedInstruction | null {
  line = line.trim();

  if (!line || line.startsWith(';') || line.startsWith('//')) {
    return null;
  }

  const commentIndex = line.indexOf(';');
  if (commentIndex !== -1) {
    line = line.substring(0, commentIndex).trim();
  }

  const parts = line.split(/\s+/);
  if (parts.length === 0) return null;

  const mnemonic = parts[0].toUpperCase();
  const operandStr = parts.slice(1).join(' ');

  const operands = operandStr
    ? operandStr.split(',').map(op => op.trim())
    : [];

  return { mnemonic, operands };
}

export function assembleCode(code: string): {
  instructions: ParsedInstruction[];
  errors: string[];
} {
  const lines = code.split('\n');
  const instructions: ParsedInstruction[] = [];
  const errors: string[] = [];

  lines.forEach((line, index) => {
    const parsed = parseAssemblyLine(line);
    if (parsed) {
      instructions.push(parsed);
    }
  });

  return { instructions, errors };
}

export function disassembleInstruction(instruction: ParsedInstruction): string {
  const { mnemonic, operands } = instruction;

  if (operands.length === 0) {
    return mnemonic;
  }

  return `${mnemonic} ${operands.join(', ')}`;
}

export function generateMachineCode(instruction: ParsedInstruction, processorType: '8086' | '8051'): string {
  const { mnemonic, operands } = instruction;

  if (processorType === '8086') {
    switch (mnemonic.toUpperCase()) {
      case 'MOV':
        return '8B C0';
      case 'ADD':
        return '03 C0';
      case 'SUB':
        return '2B C0';
      case 'INC':
        return '40';
      case 'DEC':
        return '48';
      case 'JMP':
        return 'EB FE';
      case 'NOP':
        return '90';
      default:
        return 'XX XX';
    }
  } else {
    switch (mnemonic.toUpperCase()) {
      case 'MOV':
        return '74 00';
      case 'ADD':
        return '24 00';
      case 'SUBB':
        return '94 00';
      case 'INC':
        return '04';
      case 'DEC':
        return '14';
      case 'SJMP':
        return '80 FE';
      case 'NOP':
        return '00';
      default:
        return 'XX';
    }
  }
}
