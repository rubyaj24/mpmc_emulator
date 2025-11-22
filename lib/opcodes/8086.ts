/**
 * Intel 8086 Opcode Reference
 * Complete instruction set with opcode bytes and encoding
 */

export interface Opcode8086Entry {
  mnemonic: string;
  opcode: number | string; // Hex string or number
  operands: string;
  bytes: number; // Variable length instructions
  description: string;
  modrm?: boolean; // Has ModR/M byte
  displacement?: string; // 'none', 'byte', 'word'
}

export interface Opcode8086Map {
  [key: string]: Opcode8086Entry;
}

/**
 * 8086 Opcode Map - organized by instruction
 * Reference: Intel 8086 Instruction Set Manual
 */
export const OPCODES_8086: Opcode8086Map = {
  // MOV Instructions
  'MOV_REG_IMM': {
    mnemonic: 'MOV',
    opcode: '0xB8-0xBF',
    operands: 'reg, imm16',
    bytes: 3,
    description: 'Move immediate to register',
  },
  'MOV_MEM_IMM': {
    mnemonic: 'MOV',
    opcode: '0xC7',
    operands: '[addr], imm16',
    bytes: 4,
    description: 'Move immediate to memory',
    modrm: true,
    displacement: 'word',
  },
  'MOV_REG_REG': {
    mnemonic: 'MOV',
    opcode: '0x89',
    operands: 'dest, src',
    bytes: 2,
    description: 'Move register to register',
    modrm: true,
  },
  'MOV_REG_MEM': {
    mnemonic: 'MOV',
    opcode: '0x8B',
    operands: 'reg, [addr]',
    bytes: 2,
    description: 'Move memory to register',
    modrm: true,
    displacement: 'byte',
  },
  'MOV_MEM_REG': {
    mnemonic: 'MOV',
    opcode: '0x89',
    operands: '[addr], reg',
    bytes: 2,
    description: 'Move register to memory',
    modrm: true,
    displacement: 'byte',
  },
  'MOV_AX_IMM': {
    mnemonic: 'MOV',
    opcode: '0xB8',
    operands: 'AX, imm16',
    bytes: 3,
    description: 'Move immediate to AX',
  },
  'MOV_BX_IMM': {
    mnemonic: 'MOV',
    opcode: '0xBB',
    operands: 'BX, imm16',
    bytes: 3,
    description: 'Move immediate to BX',
  },
  'MOV_CX_IMM': {
    mnemonic: 'MOV',
    opcode: '0xB9',
    operands: 'CX, imm16',
    bytes: 3,
    description: 'Move immediate to CX',
  },
  'MOV_DX_IMM': {
    mnemonic: 'MOV',
    opcode: '0xBA',
    operands: 'DX, imm16',
    bytes: 3,
    description: 'Move immediate to DX',
  },

  // ADD Instructions
  'ADD_AX_IMM': {
    mnemonic: 'ADD',
    opcode: '0x05',
    operands: 'AX, imm16',
    bytes: 3,
    description: 'Add immediate to AX',
  },
  'ADD_BX_IMM': {
    mnemonic: 'ADD',
    opcode: '0x81',
    operands: 'BX, imm16',
    bytes: 4,
    description: 'Add immediate to BX',
    modrm: true,
  },
  'ADD_REG_REG': {
    mnemonic: 'ADD',
    opcode: '0x01',
    operands: 'dest, src',
    bytes: 2,
    description: 'Add register to register',
    modrm: true,
  },
  'ADD_AX_BX': {
    mnemonic: 'ADD',
    opcode: '0x03',
    operands: 'AX, BX',
    bytes: 2,
    description: 'Add BX to AX',
    modrm: true,
  },

  // SUB Instructions
  'SUB_AX_IMM': {
    mnemonic: 'SUB',
    opcode: '0x2D',
    operands: 'AX, imm16',
    bytes: 3,
    description: 'Subtract immediate from AX',
  },
  'SUB_REG_REG': {
    mnemonic: 'SUB',
    opcode: '0x29',
    operands: 'dest, src',
    bytes: 2,
    description: 'Subtract register from register',
    modrm: true,
  },

  // MUL Instructions
  'MUL_AX_BX': {
    mnemonic: 'MUL',
    opcode: '0xF7',
    operands: 'BX',
    bytes: 2,
    description: 'Multiply AX by BX (unsigned)',
    modrm: true,
  },
  'IMUL_AX_BX': {
    mnemonic: 'IMUL',
    opcode: '0xF7',
    operands: 'BX',
    bytes: 2,
    description: 'Multiply AX by BX (signed)',
    modrm: true,
  },

  // DIV Instructions
  'DIV_AX_BX': {
    mnemonic: 'DIV',
    opcode: '0xF7',
    operands: 'BX',
    bytes: 2,
    description: 'Divide DX:AX by BX (unsigned)',
    modrm: true,
  },
  'IDIV_AX_BX': {
    mnemonic: 'IDIV',
    opcode: '0xF7',
    operands: 'BX',
    bytes: 2,
    description: 'Divide DX:AX by BX (signed)',
    modrm: true,
  },

  // INC Instructions
  'INC_AX': {
    mnemonic: 'INC',
    opcode: '0x40',
    operands: 'AX',
    bytes: 1,
    description: 'Increment AX',
  },
  'INC_BX': {
    mnemonic: 'INC',
    opcode: '0x43',
    operands: 'BX',
    bytes: 1,
    description: 'Increment BX',
  },
  'INC_CX': {
    mnemonic: 'INC',
    opcode: '0x41',
    operands: 'CX',
    bytes: 1,
    description: 'Increment CX',
  },
  'INC_DX': {
    mnemonic: 'INC',
    opcode: '0x42',
    operands: 'DX',
    bytes: 1,
    description: 'Increment DX',
  },

  // DEC Instructions
  'DEC_AX': {
    mnemonic: 'DEC',
    opcode: '0x48',
    operands: 'AX',
    bytes: 1,
    description: 'Decrement AX',
  },
  'DEC_BX': {
    mnemonic: 'DEC',
    opcode: '0x4B',
    operands: 'BX',
    bytes: 1,
    description: 'Decrement BX',
  },

  // AND Instructions
  'AND_AX_IMM': {
    mnemonic: 'AND',
    opcode: '0x25',
    operands: 'AX, imm16',
    bytes: 3,
    description: 'AND AX with immediate',
  },
  'AND_REG_REG': {
    mnemonic: 'AND',
    opcode: '0x21',
    operands: 'dest, src',
    bytes: 2,
    description: 'AND register with register',
    modrm: true,
  },

  // OR Instructions
  'OR_AX_IMM': {
    mnemonic: 'OR',
    opcode: '0x0D',
    operands: 'AX, imm16',
    bytes: 3,
    description: 'OR AX with immediate',
  },
  'OR_REG_REG': {
    mnemonic: 'OR',
    opcode: '0x09',
    operands: 'dest, src',
    bytes: 2,
    description: 'OR register with register',
    modrm: true,
  },

  // XOR Instructions
  'XOR_AX_IMM': {
    mnemonic: 'XOR',
    opcode: '0x35',
    operands: 'AX, imm16',
    bytes: 3,
    description: 'XOR AX with immediate',
  },
  'XOR_REG_REG': {
    mnemonic: 'XOR',
    opcode: '0x31',
    operands: 'dest, src',
    bytes: 2,
    description: 'XOR register with register',
    modrm: true,
  },

  // NOT Instructions
  'NOT_AX': {
    mnemonic: 'NOT',
    opcode: '0xF7',
    operands: 'AX',
    bytes: 2,
    description: 'NOT (bitwise complement) AX',
    modrm: true,
  },

  // NEG Instructions
  'NEG_AX': {
    mnemonic: 'NEG',
    opcode: '0xF7',
    operands: 'AX',
    bytes: 2,
    description: 'Negate (two\'s complement) AX',
    modrm: true,
  },

  // Shift Instructions
  'SHL_AX_1': {
    mnemonic: 'SHL',
    opcode: '0xD1',
    operands: 'AX, 1',
    bytes: 2,
    description: 'Shift AX left by 1',
    modrm: true,
  },
  'SHL_AX_CL': {
    mnemonic: 'SHL',
    opcode: '0xD3',
    operands: 'AX, CL',
    bytes: 2,
    description: 'Shift AX left by CL',
    modrm: true,
  },
  'SHR_AX_1': {
    mnemonic: 'SHR',
    opcode: '0xD1',
    operands: 'AX, 1',
    bytes: 2,
    description: 'Shift AX right by 1 (logical)',
    modrm: true,
  },
  'SAR_AX_1': {
    mnemonic: 'SAR',
    opcode: '0xD1',
    operands: 'AX, 1',
    bytes: 2,
    description: 'Shift AX right by 1 (arithmetic)',
    modrm: true,
  },

  // Rotate Instructions
  'ROL_AX_1': {
    mnemonic: 'ROL',
    opcode: '0xD1',
    operands: 'AX, 1',
    bytes: 2,
    description: 'Rotate AX left by 1',
    modrm: true,
  },
  'ROR_AX_1': {
    mnemonic: 'ROR',
    opcode: '0xD1',
    operands: 'AX, 1',
    bytes: 2,
    description: 'Rotate AX right by 1',
    modrm: true,
  },

  // Compare Instructions
  'CMP_AX_IMM': {
    mnemonic: 'CMP',
    opcode: '0x3D',
    operands: 'AX, imm16',
    bytes: 3,
    description: 'Compare AX with immediate',
  },
  'CMP_REG_REG': {
    mnemonic: 'CMP',
    opcode: '0x39',
    operands: 'dest, src',
    bytes: 2,
    description: 'Compare register with register',
    modrm: true,
  },

  // Jump Instructions
  'JMP_SHORT': {
    mnemonic: 'JMP',
    opcode: '0xEB',
    operands: 'rel8',
    bytes: 2,
    description: 'Short unconditional jump',
  },
  'JMP_NEAR': {
    mnemonic: 'JMP',
    opcode: '0xE9',
    operands: 'rel16',
    bytes: 3,
    description: 'Near unconditional jump',
  },
  'JE': {
    mnemonic: 'JE',
    opcode: '0x74',
    operands: 'rel8',
    bytes: 2,
    description: 'Jump if Equal (ZF=1)',
  },
  'JZ': {
    mnemonic: 'JZ',
    opcode: '0x74',
    operands: 'rel8',
    bytes: 2,
    description: 'Jump if Zero (ZF=1)',
  },
  'JNE': {
    mnemonic: 'JNE',
    opcode: '0x75',
    operands: 'rel8',
    bytes: 2,
    description: 'Jump if Not Equal (ZF=0)',
  },
  'JNZ': {
    mnemonic: 'JNZ',
    opcode: '0x75',
    operands: 'rel8',
    bytes: 2,
    description: 'Jump if Not Zero (ZF=0)',
  },
  'JL': {
    mnemonic: 'JL',
    opcode: '0x7C',
    operands: 'rel8',
    bytes: 2,
    description: 'Jump if Less (SF≠OF)',
  },
  'JG': {
    mnemonic: 'JG',
    opcode: '0x7F',
    operands: 'rel8',
    bytes: 2,
    description: 'Jump if Greater (SF=OF, ZF=0)',
  },
  'JC': {
    mnemonic: 'JC',
    opcode: '0x72',
    operands: 'rel8',
    bytes: 2,
    description: 'Jump if Carry (CF=1)',
  },
  'JNC': {
    mnemonic: 'JNC',
    opcode: '0x73',
    operands: 'rel8',
    bytes: 2,
    description: 'Jump if Not Carry (CF=0)',
  },

  // Call Instructions
  'CALL_NEAR': {
    mnemonic: 'CALL',
    opcode: '0xE8',
    operands: 'rel16',
    bytes: 3,
    description: 'Call near procedure',
  },

  // Return Instructions
  'RET': {
    mnemonic: 'RET',
    opcode: '0xC3',
    operands: '',
    bytes: 1,
    description: 'Return from procedure',
  },

  // Stack Instructions
  'PUSH_AX': {
    mnemonic: 'PUSH',
    opcode: '0x50',
    operands: 'AX',
    bytes: 1,
    description: 'Push AX to stack',
  },
  'PUSH_BX': {
    mnemonic: 'PUSH',
    opcode: '0x53',
    operands: 'BX',
    bytes: 1,
    description: 'Push BX to stack',
  },
  'POP_AX': {
    mnemonic: 'POP',
    opcode: '0x58',
    operands: 'AX',
    bytes: 1,
    description: 'Pop from stack to AX',
  },
  'POP_BX': {
    mnemonic: 'POP',
    opcode: '0x5B',
    operands: 'BX',
    bytes: 1,
    description: 'Pop from stack to BX',
  },

  // NOP
  'NOP': {
    mnemonic: 'NOP',
    opcode: '0x90',
    operands: '',
    bytes: 1,
    description: 'No Operation',
  },

  // HLT
  'HLT': {
    mnemonic: 'HLT',
    opcode: '0xF4',
    operands: '',
    bytes: 1,
    description: 'Halt (HLT opcode 0xF4)',
  },
};

/**
 * Disassemble a single instruction from bytes
 */
export function disassemble8086(bytes: number[], startAddress: number = 0): { mnemonic: string; operands: string; length: number } | null {
  if (!bytes || bytes.length === 0) return null;

  const opcode = bytes[0];

  // Find by opcode
  for (const entry of Object.values(OPCODES_8086)) {
    const entryOpcode = typeof entry.opcode === 'string'
      ? parseInt(entry.opcode.split('-')[0], 16)
      : entry.opcode;

    if (entryOpcode === opcode) {
      let operands = entry.operands;

      // Decode operands
      if (operands.includes('imm16') && bytes.length > 2) {
        const low = bytes[1];
        const high = bytes[2];
        const imm = (high << 8) | low;
        operands = operands.replace('imm16', `0x${imm.toString(16).toUpperCase()}`);
      }
      if (operands.includes('rel8') && bytes.length > 1) {
        const offset = bytes[1];
        operands = operands.replace('rel8', `0x${offset.toString(16).toUpperCase()}`);
      }
      if (operands.includes('rel16') && bytes.length > 2) {
        const low = bytes[1];
        const high = bytes[2];
        const addr = (high << 8) | low;
        operands = operands.replace('rel16', `0x${addr.toString(16).toUpperCase()}`);
      }

      return {
        mnemonic: entry.mnemonic,
        operands,
        length: entry.bytes,
      };
    }
  }

  return null;
}
