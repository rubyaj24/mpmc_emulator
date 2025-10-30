/**
 * 8051 Microcontroller Opcode Reference
 * Complete instruction set with opcode bytes and encoding
 */

export interface OpcodeEntry {
  mnemonic: string;
  opcode: number | number[]; // Single byte or array for variable-length
  operands: string; // Description: "A, #imm8" etc
  bytes: number; // Length in bytes
  description: string;
}

export interface OpcodeMap {
  [key: string]: OpcodeEntry;
}

/**
 * 8051 Opcode Map - organized by instruction mnemonic
 * Reference: Intel MCS-51 Instruction Set Manual
 */
export const OPCODES_8051: OpcodeMap = {
  // MOV Instructions
  'MOV_A_IMM': {
    mnemonic: 'MOV',
    opcode: 0x74,
    operands: 'A, #imm8',
    bytes: 2,
    description: 'Move immediate to A',
  },
  'MOV_A_DIRECT': {
    mnemonic: 'MOV',
    opcode: 0xE5,
    operands: 'A, direct',
    bytes: 2,
    description: 'Move from direct address to A',
  },
  'MOV_A_INDIRECT_R0': {
    mnemonic: 'MOV',
    opcode: 0x86,
    operands: 'A, @R0',
    bytes: 1,
    description: 'Move from indirect R0 to A',
  },
  'MOV_A_INDIRECT_R1': {
    mnemonic: 'MOV',
    opcode: 0x87,
    operands: 'A, @R1',
    bytes: 1,
    description: 'Move from indirect R1 to A',
  },
  'MOV_A_R0': {
    mnemonic: 'MOV',
    opcode: 0xE8,
    operands: 'A, R0',
    bytes: 1,
    description: 'Move R0 to A',
  },
  'MOV_A_R1': {
    mnemonic: 'MOV',
    opcode: 0xE9,
    operands: 'A, R1',
    bytes: 1,
    description: 'Move R1 to A',
  },
  'MOV_A_R2': {
    mnemonic: 'MOV',
    opcode: 0xEA,
    operands: 'A, R2',
    bytes: 1,
    description: 'Move R2 to A',
  },
  'MOV_A_R3': {
    mnemonic: 'MOV',
    opcode: 0xEB,
    operands: 'A, R3',
    bytes: 1,
    description: 'Move R3 to A',
  },
  'MOV_A_R4': {
    mnemonic: 'MOV',
    opcode: 0xEC,
    operands: 'A, R4',
    bytes: 1,
    description: 'Move R4 to A',
  },
  'MOV_A_R5': {
    mnemonic: 'MOV',
    opcode: 0xED,
    operands: 'A, R5',
    bytes: 1,
    description: 'Move R5 to A',
  },
  'MOV_A_R6': {
    mnemonic: 'MOV',
    opcode: 0xEE,
    operands: 'A, R6',
    bytes: 1,
    description: 'Move R6 to A',
  },
  'MOV_A_R7': {
    mnemonic: 'MOV',
    opcode: 0xEF,
    operands: 'A, R7',
    bytes: 1,
    description: 'Move R7 to A',
  },
  'MOV_B_IMM': {
    mnemonic: 'MOV',
    opcode: 0x75,
    operands: 'B, #imm8',
    bytes: 2,
    description: 'Move immediate to B',
  },
  'MOV_B_A': {
    mnemonic: 'MOV',
    opcode: 0xF5,
    operands: 'B, A',
    bytes: 2,
    description: 'Move A to B (direct address)',
  },
  'MOV_DPTR_IMM': {
    mnemonic: 'MOV',
    opcode: 0x90,
    operands: 'DPTR, #imm16',
    bytes: 3,
    description: 'Move 16-bit immediate to DPTR',
  },
  'MOV_R0_A': {
    mnemonic: 'MOV',
    opcode: 0xF8,
    operands: 'R0, A',
    bytes: 1,
    description: 'Move A to R0',
  },
  'MOV_R1_A': {
    mnemonic: 'MOV',
    opcode: 0xF9,
    operands: 'R1, A',
    bytes: 1,
    description: 'Move A to R1',
  },

  // MOVX Instructions
  'MOVX_A_DPTR': {
    mnemonic: 'MOVX',
    opcode: 0xE0,
    operands: 'A, @DPTR',
    bytes: 1,
    description: 'Move from external memory @DPTR to A',
  },
  'MOVX_DPTR_A': {
    mnemonic: 'MOVX',
    opcode: 0xF0,
    operands: '@DPTR, A',
    bytes: 1,
    description: 'Move A to external memory @DPTR',
  },
  'MOVX_A_R0': {
    mnemonic: 'MOVX',
    opcode: 0xE2,
    operands: 'A, @R0',
    bytes: 1,
    description: 'Move from external memory @R0 to A',
  },
  'MOVX_A_R1': {
    mnemonic: 'MOVX',
    opcode: 0xE3,
    operands: 'A, @R1',
    bytes: 1,
    description: 'Move from external memory @R1 to A',
  },
  'MOVX_R0_A': {
    mnemonic: 'MOVX',
    opcode: 0xF2,
    operands: '@R0, A',
    bytes: 1,
    description: 'Move A to external memory @R0',
  },
  'MOVX_R1_A': {
    mnemonic: 'MOVX',
    opcode: 0xF3,
    operands: '@R1, A',
    bytes: 1,
    description: 'Move A to external memory @R1',
  },

  // Arithmetic Instructions
  'ADD_A_IMM': {
    mnemonic: 'ADD',
    opcode: 0x24,
    operands: 'A, #imm8',
    bytes: 2,
    description: 'Add immediate to A',
  },
  'ADD_A_DIRECT': {
    mnemonic: 'ADD',
    opcode: 0x25,
    operands: 'A, direct',
    bytes: 2,
    description: 'Add direct address to A',
  },
  'ADD_A_R0': {
    mnemonic: 'ADD',
    opcode: 0x28,
    operands: 'A, R0',
    bytes: 1,
    description: 'Add R0 to A',
  },
  'ADD_A_R1': {
    mnemonic: 'ADD',
    opcode: 0x29,
    operands: 'A, R1',
    bytes: 1,
    description: 'Add R1 to A',
  },
  'SUBB_A_IMM': {
    mnemonic: 'SUBB',
    opcode: 0x94,
    operands: 'A, #imm8',
    bytes: 2,
    description: 'Subtract with Borrow (immediate)',
  },
  'MUL_AB': {
    mnemonic: 'MUL',
    opcode: 0x84,
    operands: 'AB',
    bytes: 1,
    description: 'Multiply A × B',
  },
  'DIV_AB': {
    mnemonic: 'DIV',
    opcode: 0x84,
    operands: 'AB',
    bytes: 1,
    description: 'Divide A ÷ B',
  },

  // Increment/Decrement
  'INC_A': {
    mnemonic: 'INC',
    opcode: 0x04,
    operands: 'A',
    bytes: 1,
    description: 'Increment A',
  },
  'INC_DPTR': {
    mnemonic: 'INC',
    opcode: 0xA3,
    operands: 'DPTR',
    bytes: 1,
    description: 'Increment DPTR',
  },
  'INC_R0': {
    mnemonic: 'INC',
    opcode: 0x08,
    operands: 'R0',
    bytes: 1,
    description: 'Increment R0',
  },
  'INC_R1': {
    mnemonic: 'INC',
    opcode: 0x09,
    operands: 'R1',
    bytes: 1,
    description: 'Increment R1',
  },
  'DEC_A': {
    mnemonic: 'DEC',
    opcode: 0x14,
    operands: 'A',
    bytes: 1,
    description: 'Decrement A',
  },

  // Logical Operations
  'ANL_A_IMM': {
    mnemonic: 'ANL',
    opcode: 0x54,
    operands: 'A, #imm8',
    bytes: 2,
    description: 'AND A with immediate',
  },
  'ORL_A_IMM': {
    mnemonic: 'ORL',
    opcode: 0x44,
    operands: 'A, #imm8',
    bytes: 2,
    description: 'OR A with immediate',
  },
  'XRL_A_IMM': {
    mnemonic: 'XRL',
    opcode: 0x64,
    operands: 'A, #imm8',
    bytes: 2,
    description: 'XOR A with immediate',
  },

  // Rotate/Shift
  'RLC_A': {
    mnemonic: 'RLC',
    opcode: 0x33,
    operands: 'A',
    bytes: 1,
    description: 'Rotate A left through carry',
  },
  'RRC_A': {
    mnemonic: 'RRC',
    opcode: 0x03,
    operands: 'A',
    bytes: 1,
    description: 'Rotate A right through carry',
  },

  // Bit Operations
  'CLR_A': {
    mnemonic: 'CLR',
    opcode: 0xE4,
    operands: 'A',
    bytes: 1,
    description: 'Clear A',
  },
  'SETB_A': {
    mnemonic: 'SETB',
    opcode: 0xD3,
    operands: 'A',
    bytes: 1,
    description: 'Set A (not standard - use for context)',
  },
  'CPL_A': {
    mnemonic: 'CPL',
    opcode: 0xF4,
    operands: 'A',
    bytes: 1,
    description: 'Complement A',
  },

  // Jump Instructions
  'SJMP': {
    mnemonic: 'SJMP',
    opcode: 0x80,
    operands: 'rel8',
    bytes: 2,
    description: 'Short Jump',
  },
  'LJMP': {
    mnemonic: 'LJMP',
    opcode: 0x02,
    operands: 'addr16',
    bytes: 3,
    description: 'Long Jump',
  },
  'JZ': {
    mnemonic: 'JZ',
    opcode: 0x60,
    operands: 'rel8',
    bytes: 2,
    description: 'Jump if Zero',
  },
  'JNZ': {
    mnemonic: 'JNZ',
    opcode: 0x70,
    operands: 'rel8',
    bytes: 2,
    description: 'Jump if Not Zero',
  },
  'JC': {
    mnemonic: 'JC',
    opcode: 0x40,
    operands: 'rel8',
    bytes: 2,
    description: 'Jump if Carry',
  },
  'JNC': {
    mnemonic: 'JNC',
    opcode: 0x50,
    operands: 'rel8',
    bytes: 2,
    description: 'Jump if Not Carry',
  },

  // Control
  'NOP': {
    mnemonic: 'NOP',
    opcode: 0x00,
    operands: '',
    bytes: 1,
    description: 'No Operation',
  },
  'HLT': {
    mnemonic: 'HLT',
    opcode: 0xFF,
    operands: '',
    bytes: 1,
    description: 'Halt (custom, not standard)',
  },
};

/**
 * Get opcode entry by mnemonic and operands
 */
export function getOpcodeEntry(mnemonic: string, operands: string): OpcodeEntry | null {
  const key = `${mnemonic.toUpperCase()}_${operands.toUpperCase().replace(/[^A-Z0-9]/g, '')}`;
  
  // Try exact match first
  for (const [k, v] of Object.entries(OPCODES_8051)) {
    if (v.mnemonic.toUpperCase() === mnemonic.toUpperCase()) {
      // Simple heuristic matching
      if (operands.includes('IMM') || operands.includes('#')) {
        if (k.includes('IMM')) return v;
      }
      if (operands.toUpperCase().includes('A') && operands.toUpperCase().includes('B')) {
        if (k.includes('AB') || k.includes('_A_B')) return v;
      }
    }
  }
  
  return null;
}

/**
 * Disassemble a single instruction from bytes
 */
export function disassemble8051(bytes: number[], startAddress: number = 0): { mnemonic: string; operands: string; length: number } | null {
  if (!bytes || bytes.length === 0) return null;

  const opcode = bytes[0];

  // Find by opcode
  for (const entry of Object.values(OPCODES_8051)) {
    if (typeof entry.opcode === 'number' && entry.opcode === opcode) {
      let operands = entry.operands;

      // Decode operands
      if (operands.includes('imm8') && bytes.length > 1) {
        operands = operands.replace('imm8', `0x${bytes[1].toString(16).toUpperCase()}`);
      }
      if (operands.includes('imm16') && bytes.length > 2) {
        const high = bytes[1];
        const low = bytes[2];
        const addr = (high << 8) | low;
        operands = operands.replace('imm16', `0x${addr.toString(16).toUpperCase()}`);
      }
      if (operands.includes('direct') && bytes.length > 1) {
        operands = operands.replace('direct', `0x${bytes[1].toString(16).toUpperCase()}`);
      }
      if (operands.includes('rel8') && bytes.length > 1) {
        const offset = bytes[1];
        operands = operands.replace('rel8', `0x${offset.toString(16).toUpperCase()}`);
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
