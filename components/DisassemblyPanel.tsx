'use client';

import React, { useState, useMemo } from 'react';
import { useSimulatorStore } from '@/lib/store';
import { assemble } from '@/lib/codeGenerator';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Copy } from 'lucide-react';
import { toast } from 'sonner';

export const DisassemblyPanel: React.FC = () => {
  const { code, processorType } = useSimulatorStore();
  const [isExpanded, setIsExpanded] = useState(false);

  const { assemblyData, errors } = useMemo(() => {
    if (!code.trim()) return { assemblyData: [], errors: [] };

    const result = assemble(code, processorType as '8051' | '8086');
    return {
      assemblyData: result.instructions,
      errors: result.errors,
    };
  }, [code, processorType]);

  const handleCopyListing = () => {
    let listing = 'Address | Bytes          | Mnemonic\n';
    listing += '--------|----------------|----------\n';

    assemblyData.forEach((instr) => {
      const addr = (instr.address || 0).toString(16).toUpperCase().padStart(4, '0');
      const bytesStr = (instr.bytes || [])
        .map((b) => b.toString(16).toUpperCase().padStart(2, '0'))
        .join(' ')
        .padEnd(14);
      const mnemonic = `${instr.mnemonic} ${instr.operands.join(', ')}`;
      listing += `0x${addr}  | ${bytesStr} | ${mnemonic}\n`;
    });

    navigator.clipboard.writeText(listing);
    toast.success('Disassembly listing copied to clipboard');
  };

  return (
    <Card className="w-full bg-slate-900 border-slate-700 text-slate-100 rounded-lg">
      {/* Header */}
      <div
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-800 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-blue-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-blue-400" />
          )}
          <h3 className="text-sm font-semibold text-blue-300">Disassembly</h3>
          <span className="text-xs px-2 py-1 bg-blue-900/50 rounded text-blue-300">
            {assemblyData.length} instructions
          </span>
        </div>
        {isExpanded && (
          <Button
            size="sm"
            variant="ghost"
            className="text-slate-300 hover:text-white"
            onClick={(e) => {
              e.stopPropagation();
              handleCopyListing();
            }}
          >
            <Copy className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="border-t border-slate-700">
          {errors.length > 0 ? (
            <div className="p-4 space-y-2">
              {errors.map((error, idx) => (
                <div key={idx} className="text-xs text-red-400">
                  <span className="text-red-500">✕</span> Line {error.line}: {error.error}
                </div>
              ))}
            </div>
          ) : assemblyData.length === 0 ? (
            <div className="p-4 text-xs text-slate-400">No instructions</div>
          ) : (
            <div className="p-4 overflow-x-auto">
              <div className="font-mono text-xs space-y-1 bg-slate-950 p-3 rounded border border-slate-700">
                {/* Header Row */}
                <div className="flex gap-4 text-slate-500 pb-2 border-b border-slate-700">
                  <div className="w-12">Addr</div>
                  <div className="w-24">Bytes</div>
                  <div className="flex-1">Instruction</div>
                </div>

                {/* Instruction Rows */}
                {assemblyData.map((instr, idx) => (
                  <div key={idx} className="flex gap-4 text-slate-300 hover:bg-slate-800 p-1 rounded transition-colors">
                    <div className="w-12 text-cyan-400">
                      0x{(instr.address || 0).toString(16).toUpperCase().padStart(4, '0')}
                    </div>
                    <div className="w-24 text-yellow-400 font-mono">
                      {(instr.bytes || [])
                        .map((b) => b.toString(16).toUpperCase().padStart(2, '0'))
                        .join(' ')
                        .padEnd(14) || '—'}
                    </div>
                    <div className="flex-1 text-green-400">
                      {instr.mnemonic} {instr.operands.join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};
