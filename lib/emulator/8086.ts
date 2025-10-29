export interface Registers8086 {
  AX: number;
  BX: number;
  CX: number;
  DX: number;
  SI: number;
  DI: number;
  BP: number;
  SP: number;
  IP: number;
  CS: number;
  DS: number;
  SS: number;
  ES: number;
}

export interface Flags8086 {
  CF: boolean;
  PF: boolean;
  AF: boolean;
  ZF: boolean;
  SF: boolean;
  OF: boolean;
  IF: boolean;
  DF: boolean;
  TF: boolean;
}

export class Emulator8086 {
  registers: Registers8086;
  flags: Flags8086;
  memory: Uint8Array;
  running: boolean;
  halted: boolean;

  constructor() {
    this.registers = {
      AX: 0,
      BX: 0,
      CX: 0,
      DX: 0,
      SI: 0,
      DI: 0,
      BP: 0,
      SP: 0xFFFE,
      IP: 0,
      CS: 0,
      DS: 0,
      SS: 0,
      ES: 0,
    };

    this.flags = {
      CF: false,
      PF: false,
      AF: false,
      ZF: false,
      SF: false,
      OF: false,
      IF: true,
      DF: false,
      TF: false,
    };

    this.memory = new Uint8Array(0x100000);
    this.running = false;
    this.halted = false;
  }

  reset() {
    this.registers = {
      AX: 0,
      BX: 0,
      CX: 0,
      DX: 0,
      SI: 0,
      DI: 0,
      BP: 0,
      SP: 0xFFFE,
      IP: 0,
      CS: 0,
      DS: 0,
      SS: 0,
      ES: 0,
    };

    this.flags = {
      CF: false,
      PF: false,
      AF: false,
      ZF: false,
      SF: false,
      OF: false,
      IF: true,
      DF: false,
      TF: false,
    };

    this.memory.fill(0);
    this.running = false;
    this.halted = false;
  }

  getRegister8(name: string): number {
    switch (name.toUpperCase()) {
      case 'AL': return this.registers.AX & 0xFF;
      case 'AH': return (this.registers.AX >> 8) & 0xFF;
      case 'BL': return this.registers.BX & 0xFF;
      case 'BH': return (this.registers.BX >> 8) & 0xFF;
      case 'CL': return this.registers.CX & 0xFF;
      case 'CH': return (this.registers.CX >> 8) & 0xFF;
      case 'DL': return this.registers.DX & 0xFF;
      case 'DH': return (this.registers.DX >> 8) & 0xFF;
      default: return 0;
    }
  }

  setRegister8(name: string, value: number) {
    value = value & 0xFF;
    switch (name.toUpperCase()) {
      case 'AL':
        this.registers.AX = (this.registers.AX & 0xFF00) | value;
        break;
      case 'AH':
        this.registers.AX = (this.registers.AX & 0x00FF) | (value << 8);
        break;
      case 'BL':
        this.registers.BX = (this.registers.BX & 0xFF00) | value;
        break;
      case 'BH':
        this.registers.BX = (this.registers.BX & 0x00FF) | (value << 8);
        break;
      case 'CL':
        this.registers.CX = (this.registers.CX & 0xFF00) | value;
        break;
      case 'CH':
        this.registers.CX = (this.registers.CX & 0x00FF) | (value << 8);
        break;
      case 'DL':
        this.registers.DX = (this.registers.DX & 0xFF00) | value;
        break;
      case 'DH':
        this.registers.DX = (this.registers.DX & 0x00FF) | (value << 8);
        break;
    }
  }

  getRegister16(name: string): number {
    const key = name.toUpperCase() as keyof Registers8086;
    return this.registers[key] || 0;
  }

  setRegister16(name: string, value: number) {
    value = value & 0xFFFF;
    const key = name.toUpperCase() as keyof Registers8086;
    if (key in this.registers) {
      (this.registers as any)[key] = value;
    }
  }

  readMemory(address: number): number {
    return this.memory[address & 0xFFFFF] || 0;
  }

  writeMemory(address: number, value: number) {
    this.memory[address & 0xFFFFF] = value & 0xFF;
  }

  updateFlags(result: number, size: 8 | 16 = 16) {
    const mask = size === 8 ? 0xFF : 0xFFFF;
    result = result & mask;

    this.flags.ZF = result === 0;
    this.flags.SF = size === 8 ? !!(result & 0x80) : !!(result & 0x8000);

    let parity = 0;
    for (let i = 0; i < 8; i++) {
      if (result & (1 << i)) parity++;
    }
    this.flags.PF = parity % 2 === 0;
  }

  executeInstruction(instruction: ParsedInstruction): string {
    const { mnemonic, operands } = instruction;

    try {
      switch (mnemonic.toUpperCase()) {
        case 'MOV':
          return this.executeMOV(operands);
        case 'ADD':
          return this.executeADD(operands);
        case 'SUB':
          return this.executeSUB(operands);
        case 'INC':
          return this.executeINC(operands);
        case 'DEC':
          return this.executeDEC(operands);
        case 'JMP':
          return this.executeJMP(operands);
        case 'JE':
        case 'JZ':
          return this.executeJE(operands);
        case 'JNE':
        case 'JNZ':
          return this.executeJNE(operands);
        case 'CMP':
          return this.executeCMP(operands);
        case 'AND':
          return this.executeAND(operands);
        case 'OR':
          return this.executeOR(operands);
        case 'XOR':
          return this.executeXOR(operands);
        case 'NOP':
          return 'NOP executed';
        case 'HLT':
          this.halted = true;
          return 'HLT - Program halted';
        default:
          return `Unknown instruction: ${mnemonic}`;
      }
    } catch (error) {
      return `Error executing ${mnemonic}: ${error}`;
    }
  }

  private executeMOV(operands: string[]): string {
    if (operands.length !== 2) return 'MOV requires 2 operands';

    const dest = operands[0].trim();
    const src = operands[1].trim();

    const value = this.getOperandValue(src);
    this.setOperandValue(dest, value);

    return `MOV ${dest}, ${src} (value: ${value})`;
  }

  private executeADD(operands: string[]): string {
    if (operands.length !== 2) return 'ADD requires 2 operands';

    const dest = operands[0].trim();
    const src = operands[1].trim();

    const destValue = this.getOperandValue(dest);
    const srcValue = this.getOperandValue(src);
    const result = (destValue + srcValue) & 0xFFFF;

    this.setOperandValue(dest, result);
    this.updateFlags(result);
    this.flags.CF = (destValue + srcValue) > 0xFFFF;

    return `ADD ${dest}, ${src} (result: ${result})`;
  }

  private executeSUB(operands: string[]): string {
    if (operands.length !== 2) return 'SUB requires 2 operands';

    const dest = operands[0].trim();
    const src = operands[1].trim();

    const destValue = this.getOperandValue(dest);
    const srcValue = this.getOperandValue(src);
    const result = (destValue - srcValue) & 0xFFFF;

    this.setOperandValue(dest, result);
    this.updateFlags(result);
    this.flags.CF = destValue < srcValue;

    return `SUB ${dest}, ${src} (result: ${result})`;
  }

  private executeINC(operands: string[]): string {
    if (operands.length !== 1) return 'INC requires 1 operand';

    const dest = operands[0].trim();
    const value = this.getOperandValue(dest);
    const result = (value + 1) & 0xFFFF;

    this.setOperandValue(dest, result);
    this.updateFlags(result);

    return `INC ${dest} (result: ${result})`;
  }

  private executeDEC(operands: string[]): string {
    if (operands.length !== 1) return 'DEC requires 1 operand';

    const dest = operands[0].trim();
    const value = this.getOperandValue(dest);
    const result = (value - 1) & 0xFFFF;

    this.setOperandValue(dest, result);
    this.updateFlags(result);

    return `DEC ${dest} (result: ${result})`;
  }

  private executeJMP(operands: string[]): string {
    if (operands.length !== 1) return 'JMP requires 1 operand';

    const target = operands[0].trim();
    const address = this.parseNumber(target);
    this.registers.IP = address;

    return `JMP ${target} (IP: ${address})`;
  }

  private executeJE(operands: string[]): string {
    if (operands.length !== 1) return 'JE/JZ requires 1 operand';

    if (this.flags.ZF) {
      const target = operands[0].trim();
      const address = this.parseNumber(target);
      this.registers.IP = address;
      return `JE ${target} (taken, IP: ${address})`;
    }

    return `JE ${operands[0]} (not taken)`;
  }

  private executeJNE(operands: string[]): string {
    if (operands.length !== 1) return 'JNE/JNZ requires 1 operand';

    if (!this.flags.ZF) {
      const target = operands[0].trim();
      const address = this.parseNumber(target);
      this.registers.IP = address;
      return `JNE ${target} (taken, IP: ${address})`;
    }

    return `JNE ${operands[0]} (not taken)`;
  }

  private executeCMP(operands: string[]): string {
    if (operands.length !== 2) return 'CMP requires 2 operands';

    const op1 = operands[0].trim();
    const op2 = operands[1].trim();

    const value1 = this.getOperandValue(op1);
    const value2 = this.getOperandValue(op2);
    const result = (value1 - value2) & 0xFFFF;

    this.updateFlags(result);
    this.flags.CF = value1 < value2;

    return `CMP ${op1}, ${op2} (ZF: ${this.flags.ZF}, CF: ${this.flags.CF})`;
  }

  private executeAND(operands: string[]): string {
    if (operands.length !== 2) return 'AND requires 2 operands';

    const dest = operands[0].trim();
    const src = operands[1].trim();

    const destValue = this.getOperandValue(dest);
    const srcValue = this.getOperandValue(src);
    const result = destValue & srcValue;

    this.setOperandValue(dest, result);
    this.updateFlags(result);
    this.flags.CF = false;
    this.flags.OF = false;

    return `AND ${dest}, ${src} (result: ${result})`;
  }

  private executeOR(operands: string[]): string {
    if (operands.length !== 2) return 'OR requires 2 operands';

    const dest = operands[0].trim();
    const src = operands[1].trim();

    const destValue = this.getOperandValue(dest);
    const srcValue = this.getOperandValue(src);
    const result = destValue | srcValue;

    this.setOperandValue(dest, result);
    this.updateFlags(result);
    this.flags.CF = false;
    this.flags.OF = false;

    return `OR ${dest}, ${src} (result: ${result})`;
  }

  private executeXOR(operands: string[]): string {
    if (operands.length !== 2) return 'XOR requires 2 operands';

    const dest = operands[0].trim();
    const src = operands[1].trim();

    const destValue = this.getOperandValue(dest);
    const srcValue = this.getOperandValue(src);
    const result = destValue ^ srcValue;

    this.setOperandValue(dest, result);
    this.updateFlags(result);
    this.flags.CF = false;
    this.flags.OF = false;

    return `XOR ${dest}, ${src} (result: ${result})`;
  }

  private getOperandValue(operand: string): number {
    const reg8 = ['AL', 'AH', 'BL', 'BH', 'CL', 'CH', 'DL', 'DH'];
    const reg16 = ['AX', 'BX', 'CX', 'DX', 'SI', 'DI', 'BP', 'SP', 'IP', 'CS', 'DS', 'SS', 'ES'];

    const upperOp = operand.toUpperCase();

    if (reg8.includes(upperOp)) {
      return this.getRegister8(upperOp);
    } else if (reg16.includes(upperOp)) {
      return this.getRegister16(upperOp);
    } else {
      return this.parseNumber(operand);
    }
  }

  private setOperandValue(operand: string, value: number) {
    const reg8 = ['AL', 'AH', 'BL', 'BH', 'CL', 'CH', 'DL', 'DH'];
    const reg16 = ['AX', 'BX', 'CX', 'DX', 'SI', 'DI', 'BP', 'SP', 'IP', 'CS', 'DS', 'SS', 'ES'];

    const upperOp = operand.toUpperCase();

    if (reg8.includes(upperOp)) {
      this.setRegister8(upperOp, value);
    } else if (reg16.includes(upperOp)) {
      this.setRegister16(upperOp, value);
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
      return parseInt(str, 10);
    }
  }
}

export interface ParsedInstruction {
  mnemonic: string;
  operands: string[];
}
