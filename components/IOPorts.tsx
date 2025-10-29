'use client';

import { useSimulatorStore } from '@/lib/store';
import { Card } from '@/components/ui/card';

export function IOPorts() {
  const { processorType, getPorts } = useSimulatorStore();
  const ports = getPorts();

  if (processorType === '8086') {
    return null;
  }

  const formatHex = (value: number) => {
    return '0x' + value.toString(16).toUpperCase().padStart(2, '0');
  };

  const formatBinary = (value: number) => {
    return value.toString(2).padStart(8, '0');
  };

  return (
    <Card className="border-2">
      <div className="p-4">
        <h3 className="font-semibold text-sm mb-3">I/O Ports (8051)</h3>
        <div className="space-y-3">
          {ports && Object.entries(ports).map(([portName, portValue]) => (
            <div key={portName} className="border rounded-lg p-3">
              <div className="font-semibold text-sm mb-2 text-blue-600 dark:text-blue-400">
                {portName}
              </div>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Hex:</span>
                  <span className="font-mono bg-muted px-2 py-1 rounded">
                    {formatHex(portValue)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Dec:</span>
                  <span className="font-mono bg-muted px-2 py-1 rounded">
                    {portValue}
                  </span>
                </div>
              </div>
              <div className="mt-2">
                <div className="text-xs text-muted-foreground mb-1">Binary:</div>
                <div className="flex gap-1 font-mono text-xs">
                  {formatBinary(portValue).split('').map((bit, idx) => (
                    <div
                      key={idx}
                      className={`px-1.5 py-0.5 rounded ${
                        bit === '1'
                          ? 'bg-green-500 text-white'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {bit}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
