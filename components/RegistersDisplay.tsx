'use client';

import { useSimulatorStore } from '@/lib/store';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Registers8086, Flags8086 } from '@/lib/emulator/8086';
import { Registers8051, Flags8051 } from '@/lib/emulator/8051';

export function RegistersDisplay() {
  const { processorType, getRegisters, getFlags } = useSimulatorStore();
  const registers = getRegisters();
  const flags = getFlags();

  const formatHex = (value: number, width: number = 4) => {
    return '0x' + value.toString(16).toUpperCase().padStart(width, '0');
  };

  return (
    <Card className="border-2">
      <div className="p-4">
        <h3 className="font-semibold text-sm mb-3">Registers</h3>
        <div className="space-y-2 text-sm">
          {processorType === '8086' ? (
            <>
              <RegisterRow label="AX" value={(registers as Registers8086).AX} />
              <RegisterRow label="BX" value={(registers as Registers8086).BX} />
              <RegisterRow label="CX" value={(registers as Registers8086).CX} />
              <RegisterRow label="DX" value={(registers as Registers8086).DX} />
              <div className="border-t pt-2 mt-2">
                <RegisterRow label="SI" value={(registers as Registers8086).SI} />
                <RegisterRow label="DI" value={(registers as Registers8086).DI} />
                <RegisterRow label="BP" value={(registers as Registers8086).BP} />
                <RegisterRow label="SP" value={(registers as Registers8086).SP} />
              </div>
              <div className="border-t pt-2 mt-2">
                <RegisterRow label="IP" value={(registers as Registers8086).IP} />
                <RegisterRow label="CS" value={(registers as Registers8086).CS} />
                <RegisterRow label="DS" value={(registers as Registers8086).DS} />
                <RegisterRow label="SS" value={(registers as Registers8086).SS} />
                <RegisterRow label="ES" value={(registers as Registers8086).ES} />
              </div>
            </>
          ) : (
            <>
              <RegisterRow label="A" value={(registers as Registers8051).A} width={2} />
              <RegisterRow label="B" value={(registers as Registers8051).B} width={2} />
              <div className="border-t pt-2 mt-2">
                <RegisterRow label="R0" value={(registers as Registers8051).R0} width={2} />
                <RegisterRow label="R1" value={(registers as Registers8051).R1} width={2} />
                <RegisterRow label="R2" value={(registers as Registers8051).R2} width={2} />
                <RegisterRow label="R3" value={(registers as Registers8051).R3} width={2} />
                <RegisterRow label="R4" value={(registers as Registers8051).R4} width={2} />
                <RegisterRow label="R5" value={(registers as Registers8051).R5} width={2} />
                <RegisterRow label="R6" value={(registers as Registers8051).R6} width={2} />
                <RegisterRow label="R7" value={(registers as Registers8051).R7} width={2} />
              </div>
              <div className="border-t pt-2 mt-2">
                <RegisterRow label="DPTR" value={(registers as Registers8051).DPTR} />
                <RegisterRow label="PC" value={(registers as Registers8051).PC} />
                <RegisterRow label="SP" value={(registers as Registers8051).SP} width={2} />
              </div>
            </>
          )}
        </div>
      </div>

      <div className="border-t p-4">
        <h3 className="font-semibold text-sm mb-3">Flags</h3>
        <div className="flex flex-wrap gap-2">
          {processorType === '8086' ? (
            <>
              <FlagBadge label="CF" value={(flags as Flags8086).CF} />
              <FlagBadge label="PF" value={(flags as Flags8086).PF} />
              <FlagBadge label="AF" value={(flags as Flags8086).AF} />
              <FlagBadge label="ZF" value={(flags as Flags8086).ZF} />
              <FlagBadge label="SF" value={(flags as Flags8086).SF} />
              <FlagBadge label="OF" value={(flags as Flags8086).OF} />
              <FlagBadge label="IF" value={(flags as Flags8086).IF} />
              <FlagBadge label="DF" value={(flags as Flags8086).DF} />
              <FlagBadge label="TF" value={(flags as Flags8086).TF} />
            </>
          ) : (
            <>
              <FlagBadge label="C" value={(flags as Flags8051).C} />
              <FlagBadge label="AC" value={(flags as Flags8051).AC} />
              <FlagBadge label="OV" value={(flags as Flags8051).OV} />
              <FlagBadge label="P" value={(flags as Flags8051).P} />
            </>
          )}
        </div>
      </div>
    </Card>
  );
}

function RegisterRow({ label, value, width = 4 }: { label: string; value: number; width?: number }) {
  const formatHex = (val: number, w: number) => {
    return '0x' + val.toString(16).toUpperCase().padStart(w, '0');
  };

  return (
    <div className="flex justify-between items-center py-1">
      <span className="font-mono font-semibold text-blue-600 dark:text-blue-400">{label}</span>
      <div className="flex gap-2">
        <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
          {formatHex(value, width)}
        </span>
        <span className="font-mono text-xs text-muted-foreground">
          {value}
        </span>
      </div>
    </div>
  );
}

function FlagBadge({ label, value }: { label: string; value: boolean }) {
  return (
    <Badge variant={value ? 'default' : 'outline'} className="font-mono text-xs">
      {label}: {value ? '1' : '0'}
    </Badge>
  );
}
