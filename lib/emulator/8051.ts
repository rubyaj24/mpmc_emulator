export interface Registers8051 {
  A: number;
  B: number;
  R0: number;
  R1: number;
  R2: number;
  R3: number;
  R4: number;
  R5: number;
  R6: number;
  R7: number;
  DPTR: number;
  PC: number;
  SP: number;
  PSW: number;
}

export interface Flags8051 {
  C: boolean;
  AC: boolean;
  OV: boolean;
  P: boolean;
}

export class Emulator8051 {
  registers: Registers8051;
  flags: Flags8051;
  memory: Uint8Array;
  ports: { P0: number; P1: number; P2: number; P3: number };
  running: boolean;
  halted: boolean;

  constructor() {
    this.registers = {
      A: 0,
      B: 0,
      R0: 0,
      R1: 0,
      R2: 0,
      R3: 0,
      R4: 0,
      R5: 0,
      R6: 0,
      R7: 0,
      DPTR: 0,
      PC: 0,
      SP: 0x07,
      PSW: 0,
    };

    this.flags = {
      C: false,
      AC: false,
      OV: false,
      P: false,
    };

    this.memory = new Uint8Array(0x10000);
    this.ports = { P0: 0xFF, P1: 0xFF, P2: 0xFF, P3: 0xFF };
    this.running = false;
    this.halted = false;
  }

  reset() {
    this.registers = {
      A: 0,
      B: 0,
      R0: 0,
      R1: 0,
      R2: 0,
      R3: 0,
      R4: 0,
      R5: 0,
      R6: 0,
      R7: 0,
      DPTR: 0,
      PC: 0,
      SP: 0x07,
      PSW: 0,
    };

    this.flags = {
      C: false,
      AC: false,
      OV: false,
      P: false,
    };

    this.memory.fill(0);
    this.ports = { P0: 0xFF, P1: 0xFF, P2: 0xFF, P3: 0xFF };
    this.running = false;
    this.halted = false;
  }

  /**
   * Load program bytes into program memory (starting at address 0x0000)
   */
  loadProgram(bytes: number[]) {
    for (let i = 0; i < bytes.length; i++) {
      this.memory[i] = bytes[i] & 0xFF;
    }
    this.registers.PC = 0;
  }

  /**
   * Load external memory (like XRAM) at specified address
   */
  loadExternalMemory(address: number, values: number[]) {
    for (let i = 0; i < values.length; i++) {
      this.writeMemory(address + i, values[i]);
    }
  }

  /**
   * Fetch instruction byte(s) from program memory at current PC
   */
  fetchByte(address?: number): number {
    const addr = address ?? this.registers.PC;
    return this.memory[addr & 0xFFFF] || 0;
  }

  /**
   * Fetch 16-bit word from program memory
   */
  fetchWord(address?: number): number {
    const addr = address ?? this.registers.PC;
    const low = this.memory[addr & 0xFFFF] || 0;
    const high = this.memory[(addr + 1) & 0xFFFF] || 0;
    return (high << 8) | low;
  }

  readMemory(address: number): number {
    return this.memory[address & 0xFFFF] || 0;
  }

  writeMemory(address: number, value: number) {
    this.memory[address & 0xFFFF] = value & 0xFF;
  }

  getRegisterValue(name: string): number {
    const upperName = name.toUpperCase();
    if (upperName in this.registers) {
      return (this.registers as any)[upperName];
    }
    return 0;
  }

  setRegisterValue(name: string, value: number) {
    const upperName = name.toUpperCase();
    if (upperName in this.registers) {
      if (upperName === 'DPTR') {
        (this.registers as any)[upperName] = value & 0xFFFF;
      } else {
        (this.registers as any)[upperName] = value & 0xFF;
      }
    }
  }

  updateFlags(result: number) {
    result = result & 0xFF;

    let parity = 0;
    for (let i = 0; i < 8; i++) {
      if (result & (1 << i)) parity++;
    }
    this.flags.P = parity % 2 !== 0;
  }

  executeInstruction(instruction: ParsedInstruction): string {
    const { mnemonic, operands } = instruction;

    try {
      switch (mnemonic.toUpperCase()) {
        case 'MOV':
          return this.executeMOV(operands);
        case 'MOVX':
          return this.executeMOVX(operands);
        case 'ADD':
          return this.executeADD(operands);
        case 'SUBB':
          return this.executeSUBB(operands);
        case 'INC':
          return this.executeINC(operands);
        case 'DEC':
          return this.executeDEC(operands);
        case 'MUL':
          return this.executeMUL(operands);
        case 'DIV':
          return this.executeDIV(operands);
        case 'RLC':
          return this.executeRLC(operands);
        case 'ANL':
          return this.executeANL(operands);
        case 'ORL':
          return this.executeORL(operands);
        case 'XRL':
          return this.executeXRL(operands);
        case 'CLR':
          return this.executeCLR(operands);
        case 'SETB':
          return this.executeSETB(operands);
        case 'CPL':
          return this.executeCPL(operands);
        case 'SJMP':
          return this.executeSJMP(operands);
        case 'JZ':
          return this.executeJZ(operands);
        case 'JNZ':
          return this.executeJNZ(operands);
        case 'JC':
          return this.executeJC(operands);
        case 'JNC':
          return this.executeJNC(operands);
        case 'NOP':
          return 'NOP executed';
        default:
          return `Unknown instruction: ${mnemonic}`;
      }
    } catch (error) {
      return `Error executing ${mnemonic}: ${error}`;
    }
  }

  private executeMOVX(operands: string[]): string {
    if (operands.length !== 2) return 'MOVX requires 2 operands';

    const dest = operands[0].trim();
    const src = operands[1].trim();

    // MOVX <reg>, @DPTR  -> read external memory at DPTR into register
    if (src.toUpperCase() === '@DPTR') {
      const addr = this.registers.DPTR & 0xffff;
      const val = this.readMemory(addr) & 0xff;
      
      if (dest.toUpperCase() === 'A') {
        this.registers.A = val;
        this.updateFlags(this.registers.A);
      } else {
        // For other registers (B, R0-R7, etc)
        this.setRegisterValue(dest, val);
      }
      
      return `MOVX ${dest}, @DPTR (${dest}=0x${val.toString(16).toUpperCase()}, DPTR=${addr})`;
    }

    // MOVX @DPTR, <reg> -> write register to external memory at DPTR
    if (dest.toUpperCase() === '@DPTR') {
      const addr = this.registers.DPTR & 0xffff;
      const val = this.getOperandValue(src) & 0xff;
      this.writeMemory(addr, val);
      return `MOVX @DPTR, ${src} (Wrote 0x${val.toString(16).toUpperCase()} to ${addr})`;
    }

    return 'MOVX: unsupported addressing mode';
  }

  private executeMOV(operands: string[]): string {
    if (operands.length !== 2) return 'MOV requires 2 operands';

    const dest = operands[0].trim();
    const src = operands[1].trim();

    const value = this.getOperandValue(src);
    this.setOperandValue(dest, value);

    return `MOV ${dest}, ${src} (value: ${value}, registers: A=${this.registers.A}, B=${this.registers.B})`;
  }

  private executeADD(operands: string[]): string {
    if (operands.length !== 2) return 'ADD requires 2 operands';

    const dest = operands[0].trim();
    const src = operands[1].trim();

    if (dest.toUpperCase() !== 'A') {
      return 'ADD destination must be A';
    }

    const destValue = this.registers.A;
    const srcValue = this.getOperandValue(src);
    const result = destValue + srcValue;

    this.registers.A = result & 0xFF;
    this.flags.C = result > 0xFF;
    this.flags.AC = ((destValue & 0x0F) + (srcValue & 0x0F)) > 0x0F;
    this.flags.OV = ((destValue & 0x80) === (srcValue & 0x80)) &&
                     ((destValue & 0x80) !== (result & 0x80));
    this.updateFlags(this.registers.A);

    return `ADD A, ${src} (result: ${this.registers.A})`;
  }

  private executeSUBB(operands: string[]): string {
    if (operands.length !== 2) return 'SUBB requires 2 operands';

    const dest = operands[0].trim();
    const src = operands[1].trim();

    if (dest.toUpperCase() !== 'A') {
      return 'SUBB destination must be A';
    }

    const destValue = this.registers.A;
    const srcValue = this.getOperandValue(src);
    const carry = this.flags.C ? 1 : 0;
    const result = destValue - srcValue - carry;

    this.registers.A = result & 0xFF;
    this.flags.C = result < 0;
    this.updateFlags(this.registers.A);

    return `SUBB A, ${src} (result: ${this.registers.A})`;
  }

  private executeINC(operands: string[]): string {
    if (operands.length !== 1) return 'INC requires 1 operand';

    const dest = operands[0].trim();
    const value = this.getOperandValue(dest);
    // DPTR is 16-bit and must be handled specially
    if (dest.toUpperCase() === 'DPTR') {
      const result = (value + 1) & 0xFFFF;
      this.setRegisterValue('DPTR', result);
      return `INC ${dest} (result: ${result})`;
    }

    const result = (value + 1) & 0xFF;
    this.setOperandValue(dest, result);

    return `INC ${dest} (result: ${result})`;
  }

  private executeDEC(operands: string[]): string {
    if (operands.length !== 1) return 'DEC requires 1 operand';

    const dest = operands[0].trim();
    const value = this.getOperandValue(dest);
    // DPTR is 16-bit and must be handled specially
    if (dest.toUpperCase() === 'DPTR') {
      const result = (value - 1) & 0xFFFF;
      this.setRegisterValue('DPTR', result);
      return `DEC ${dest} (result: ${result})`;
    }

    const result = (value - 1) & 0xFF;
    this.setOperandValue(dest, result);

    return `DEC ${dest} (result: ${result})`;
  }

  private executeMUL(operands: string[]): string {
    if (operands.length !== 1 || operands[0].trim().toUpperCase() !== 'AB') {
      return 'MUL requires operand AB';
    }

    const result = this.registers.A * this.registers.B;
    this.registers.A = result & 0xFF;
    this.registers.B = (result >> 8) & 0xFF;
    this.flags.C = false;
    this.flags.OV = this.registers.B !== 0;

    return `MUL AB (A: ${this.registers.A}, B: ${this.registers.B})`;
  }

  private executeDIV(operands: string[]): string {
    if (operands.length !== 1 || operands[0].trim().toUpperCase() !== 'AB') {
      return 'DIV requires operand AB';
    }

    const dividend = this.registers.A;
    const divisor = this.registers.B;

    if (divisor === 0) {
      this.flags.OV = true;
      return 'DIV AB (Division by zero)';
    }

    const quotient = Math.floor(dividend / divisor);
    const remainder = dividend % divisor;

    this.registers.A = quotient & 0xFF;
    this.registers.B = remainder & 0xFF;
    this.flags.C = false;
    this.flags.OV = false;

    return `DIV AB (${dividend} ÷ ${divisor} = A: ${this.registers.A}, B: ${this.registers.B})`;
  }

  private executeRLC(operands: string[]): string {
    // RLC A  -> rotate accumulator left through carry
    if (operands.length === 0 || (operands.length === 1 && operands[0].trim().toUpperCase() === 'A')) {
      const a = this.registers.A & 0xFF;
      const carryIn = this.flags.C ? 1 : 0;
      const newCarry = (a & 0x80) !== 0;
      const result = ((a << 1) | carryIn) & 0xFF;
      this.registers.A = result;
      this.flags.C = newCarry;
      // RLC affects carry; update parity flag for A as well
      this.updateFlags(this.registers.A);
      return `RLC A (result: ${this.registers.A}, C: ${this.flags.C})`;
    }

    return 'RLC: unsupported operand';
  }

  private executeANL(operands: string[]): string {
    if (operands.length !== 2) return 'ANL requires 2 operands';

    const dest = operands[0].trim();
    const src = operands[1].trim();

    const destValue = this.getOperandValue(dest);
    const srcValue = this.getOperandValue(src);
    const result = destValue & srcValue;

    this.setOperandValue(dest, result);
    if (dest.toUpperCase() === 'A') {
      this.updateFlags(result);
    }

    return `ANL ${dest}, ${src} (result: ${result})`;
  }

  private executeORL(operands: string[]): string {
    if (operands.length !== 2) return 'ORL requires 2 operands';

    const dest = operands[0].trim();
    const src = operands[1].trim();

    const destValue = this.getOperandValue(dest);
    const srcValue = this.getOperandValue(src);
    const result = destValue | srcValue;

    this.setOperandValue(dest, result);
    if (dest.toUpperCase() === 'A') {
      this.updateFlags(result);
    }

    return `ORL ${dest}, ${src} (result: ${result})`;
  }

  private executeXRL(operands: string[]): string {
    if (operands.length !== 2) return 'XRL requires 2 operands';

    const dest = operands[0].trim();
    const src = operands[1].trim();

    const destValue = this.getOperandValue(dest);
    const srcValue = this.getOperandValue(src);
    const result = destValue ^ srcValue;

    this.setOperandValue(dest, result);
    if (dest.toUpperCase() === 'A') {
      this.updateFlags(result);
    }

    return `XRL ${dest}, ${src} (result: ${result})`;
  }

  private executeCLR(operands: string[]): string {
    if (operands.length !== 1) return 'CLR requires 1 operand';

    const dest = operands[0].trim().toUpperCase();

    if (dest === 'A') {
      this.registers.A = 0;
      return 'CLR A (A = 0)';
    } else if (dest === 'C') {
      this.flags.C = false;
      return 'CLR C (Carry cleared)';
    }

    return `CLR ${dest}`;
  }

  private executeSETB(operands: string[]): string {
    if (operands.length !== 1) return 'SETB requires 1 operand';

    const dest = operands[0].trim().toUpperCase();

    if (dest === 'C') {
      this.flags.C = true;
      return 'SETB C (Carry set)';
    }

    return `SETB ${dest}`;
  }

  private executeCPL(operands: string[]): string {
    if (operands.length !== 1) return 'CPL requires 1 operand';

    const dest = operands[0].trim().toUpperCase();

    if (dest === 'A') {
      this.registers.A = (~this.registers.A) & 0xFF;
      this.updateFlags(this.registers.A);
      return `CPL A (result: ${this.registers.A})`;
    } else if (dest === 'C') {
      this.flags.C = !this.flags.C;
      return `CPL C (Carry: ${this.flags.C})`;
    }

    return `CPL ${dest}`;
  }

  private executeSJMP(operands: string[]): string {
    if (operands.length !== 1) return 'SJMP requires 1 operand';

    const target = operands[0].trim();
    const address = this.parseNumber(target);
    this.registers.PC = address;

    return `SJMP ${target} (PC: ${address})`;
  }

  private executeJZ(operands: string[]): string {
    if (operands.length !== 1) return 'JZ requires 1 operand';

    if (this.registers.A === 0) {
      const target = operands[0].trim();
      const address = this.parseNumber(target);
      this.registers.PC = address;
      return `JZ ${target} (taken, PC: ${address})`;
    }

    return `JZ ${operands[0]} (not taken)`;
  }

  private executeJNZ(operands: string[]): string {
    if (operands.length !== 1) return 'JNZ requires 1 operand';

    if (this.registers.A !== 0) {
      const target = operands[0].trim();
      const address = this.parseNumber(target);
      this.registers.PC = address;
      return `JNZ ${target} (taken, PC: ${address})`;
    }

    return `JNZ ${operands[0]} (not taken)`;
  }

  private executeJC(operands: string[]): string {
    if (operands.length !== 1) return 'JC requires 1 operand';

    if (this.flags.C) {
      const target = operands[0].trim();
      const address = this.parseNumber(target);
      this.registers.PC = address;
      return `JC ${target} (taken, PC: ${address})`;
    }

    return `JC ${operands[0]} (not taken)`;
  }

  private executeJNC(operands: string[]): string {
    if (operands.length !== 1) return 'JNC requires 1 operand';

    if (!this.flags.C) {
      const target = operands[0].trim();
      const address = this.parseNumber(target);
      this.registers.PC = address;
      return `JNC ${target} (taken, PC: ${address})`;
    }

    return `JNC ${operands[0]} (not taken)`;
  }

  private getOperandValue(operand: string): number {
    const upperOp = operand.toUpperCase();

    if (upperOp in this.registers) {
      return (this.registers as any)[upperOp];
    } else if (operand.startsWith('#')) {
      return this.parseNumber(operand.slice(1));
    } else {
      return this.parseNumber(operand);
    }
  }

  private setOperandValue(operand: string, value: number) {
    const upperOp = operand.toUpperCase();

    if (upperOp in this.registers) {
      this.setRegisterValue(upperOp, value);
    }
  }

  private parseNumber(str: string): number {
    str = str.trim();

    if (str.endsWith('H')) {
      return parseInt(str.slice(0, -1), 16);
    } else if (str.startsWith('0X') || str.startsWith('0x')) {
      return parseInt(str, 16);
    } else if (str.endsWith('B')) {
      return parseInt(str.slice(0, -1), 2);
    } else {
      // 8051 assembly convention: plain numbers are hexadecimal
      // e.g., 8500 means 0x8500, not 8500 decimal
      return parseInt(str, 16);
    }
  }
}

export interface ParsedInstruction {
  mnemonic: string;
  operands: string[];
}
