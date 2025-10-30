'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSimulatorStore } from '@/lib/store';

interface ExternalMemoryLoadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ExternalMemoryLoadModal({
  open,
  onOpenChange,
}: ExternalMemoryLoadModalProps) {
  const { processorType, emulator8051, addConsoleMessage } = useSimulatorStore();
  const [startAddress, setStartAddress] = useState('8500');
  const [values, setValues] = useState('03,04');
  const [error, setError] = useState('');

  const handleLoad = () => {
    try {
      setError('');

      // Parse start address
      const addr = parseInt(startAddress, 16);
      if (isNaN(addr) || addr < 0 || addr > 0xFFFF) {
        setError('Invalid start address (0x0000 - 0xFFFF)');
        return;
      }

      // Parse values (comma-separated hex or decimal)
      const valueStr = values.trim();
      if (!valueStr) {
        setError('Enter at least one value');
        return;
      }

      const valueList = valueStr.split(',').map((v) => {
        const trimmed = v.trim();
        const num = trimmed.includes('H') || trimmed.startsWith('0x')
          ? parseInt(trimmed.replace('H', '').replace('0x', ''), 16)
          : parseInt(trimmed, 16);

        if (isNaN(num) || num < 0 || num > 0xFF) {
          throw new Error(`Invalid value: ${v}`);
        }

        return num;
      });

      // Load into 8051 external memory
      if (processorType === '8051') {
        emulator8051.loadExternalMemory(addr, valueList);

        // Verify what was loaded
        const verifyRead0 = emulator8051.readMemory(addr);
        const verifyRead1 = emulator8051.readMemory(addr + 1);

        const hexStr = valueList.map((v) => `0x${v.toString(16).toUpperCase()}`).join(', ');
        addConsoleMessage(
          'success',
          `Loaded external memory at 0x${addr.toString(16).toUpperCase()}: ${hexStr}`
        );
        
        addConsoleMessage(
          'info',
          `Verification: mem[0x${addr.toString(16).toUpperCase()}]=0x${verifyRead0.toString(16).toUpperCase()}, mem[0x${(addr+1).toString(16).toUpperCase()}]=0x${verifyRead1.toString(16).toUpperCase()}`
        );

        onOpenChange(false);
      } else {
        setError('External memory loading only available for 8051');
      }
    } catch (err: any) {
      setError(err.message || 'Error parsing values');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Load External Memory (8051)</DialogTitle>
          <DialogDescription>
            Pre-load external memory for testing. Example: address 8500 with values 03,04
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="addr">Start Address (hex)</Label>
            <Input
              id="addr"
              placeholder="8500"
              value={startAddress}
              onChange={(e) => setStartAddress(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="vals">
              Values (hex, comma-separated)
            </Label>
            <Input
              id="vals"
              placeholder="03,04"
              value={values}
              onChange={(e) => setValues(e.target.value)}
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              Example: 03,04 or 0x03, 0x04 or 03H, 04H
            </p>
          </div>

          {error && (
            <div className="text-sm text-red-500 bg-red-50 p-2 rounded">
              {error}
            </div>
          )}

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleLoad}>Load Memory</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
