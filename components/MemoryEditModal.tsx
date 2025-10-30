'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { useSimulatorStore } from '@/lib/store';

interface MemoryEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MemoryEditModal({ open, onOpenChange }: MemoryEditModalProps) {
  const { processorType, emulator8086, emulator8051, addConsoleMessage } = useSimulatorStore();

  const emulator: any = processorType === '8086' ? emulator8086 : emulator8051;
  const maxAddr = emulator?.memory?.length ? emulator.memory.length - 1 : 0xFFFF;

  const [addressHex, setAddressHex] = useState('0000');
  const [valueHex, setValueHex] = useState('00');
  const [error, setError] = useState<string | null>(null);
  const [confirmWrites, setConfirmWrites] = useState(true);

  // Prefill address for 8051 with DPTR
  useEffect(() => {
    if (!open) return;
    if (processorType === '8051') {
      const dptr = emulator8051.registers.DPTR || 0;
      setAddressHex(dptr.toString(16).toUpperCase().padStart(4, '0'));
    } else {
      setAddressHex('0000');
    }
    setValueHex('00');
    setError(null);
  }, [open, processorType, emulator8051]);

  const parseHex = (s: string) => {
    const cleaned = s.trim().replace(/^0x/i, '');
    const n = parseInt(cleaned, 16);
    return Number.isNaN(n) ? null : n;
  };

  const handleRead = () => {
    setError(null);
    const addr = parseHex(addressHex);
    if (addr === null) return setError('Invalid address');
    if (addr < 0 || addr > maxAddr) return setError(`Address out of range (0..${maxAddr.toString(16).toUpperCase()})`);
    try {
      const val = emulator.readMemory(addr) & 0xFF;
      setValueHex(val.toString(16).toUpperCase().padStart(2, '0'));
      addConsoleMessage('info', `Read 0x${val.toString(16).toUpperCase()} from ${addr.toString(16).toUpperCase()}`);
    } catch (e: any) {
      setError(String(e || 'Read failed'));
    }
  };

  const handleReadWord = () => {
    setError(null);
    const addr = parseHex(addressHex);
    if (addr === null) return setError('Invalid address');
    if (addr < 0 || addr > maxAddr) return setError(`Address out of range (0..${maxAddr.toString(16).toUpperCase()})`);
    try {
      const lo = emulator.readMemory(addr) & 0xFF;
      const hi = emulator.readMemory(addr + 1) & 0xFF;
      const word = (hi << 8) | lo;
      setValueHex(word.toString(16).toUpperCase().padStart(4, '0'));
      addConsoleMessage('info', `Read word 0x${word.toString(16).toUpperCase()} from ${addr.toString(16).toUpperCase()}`);
    } catch (e: any) {
      setError(String(e || 'Read failed'));
    }
  };

  const handleWrite = () => {
    setError(null);
    const addr = parseHex(addressHex);
    const val = parseHex(valueHex);
    if (addr === null) return setError('Invalid address');
    if (val === null) return setError('Invalid value');
    if (addr < 0 || addr > maxAddr) return setError(`Address out of range (0..${maxAddr.toString(16).toUpperCase()})`);
    if (val < 0 || val > 0xFFFFFFFF) return setError('Invalid value');
    // If value fits in a byte -> byte write; if it's wider treat based on length
    const isWord = valueHex.length > 2;
    if (isWord && val > 0xFFFF) return setError('Value must fit in word (0000-FFFF)');
    if (!isWord && (val < 0 || val > 0xFF)) return setError('Value must be a byte (00-FF)');
    if (confirmWrites) {
      const ok = window.confirm(`Write ${valueHex} to ${addressHex}?`);
      if (!ok) return;
    }
    try {
      if (isWord) {
        // write little-endian
        const lo = val & 0xFF;
        const hi = (val >> 8) & 0xFF;
        emulator.writeMemory(addr, lo);
        emulator.writeMemory(addr + 1, hi);
        addConsoleMessage('success', `Wrote word 0x${val.toString(16).toUpperCase()} to ${addr.toString(16).toUpperCase()} (LE)`);
      } else {
        emulator.writeMemory(addr, val & 0xFF);
        addConsoleMessage('success', `Wrote 0x${val.toString(16).toUpperCase()} to ${addr.toString(16).toUpperCase()}`);
      }
      onOpenChange(false);
    } catch (e: any) {
      setError(String(e || 'Write failed'));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Memory Editor</DialogTitle>
          <DialogDescription>
            Read or write a single memory byte. For 8051 external accesses (MOVX @DPTR), use DPTR or type the external address.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-4">
          <div className="flex items-center gap-2">
            <label className="text-xs">Address (hex)</label>
            <input
              className="ml-auto px-2 py-1 w-28 font-mono text-sm rounded border"
              value={addressHex}
              onChange={(e) => setAddressHex(e.target.value.toUpperCase())}
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs">Value (hex)</label>
            <input
              className="ml-auto px-2 py-1 w-40 font-mono text-sm rounded border"
              value={valueHex}
              onChange={(e) => setValueHex(e.target.value.toUpperCase())}
            />
          </div>

          <div className="flex items-center gap-2 text-xs">
            <input type="checkbox" checked={confirmWrites} onChange={(e) => setConfirmWrites(e.target.checked)} />
            <span>Confirm writes</span>
          </div>

          {error && <div className="text-sm text-red-500">{error}</div>}

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={handleRead}>Read Byte</Button>
            <Button variant="outline" onClick={handleReadWord}>Read Word</Button>
            <Button onClick={handleWrite}>Write</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default MemoryEditModal;
