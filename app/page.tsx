'use client';

import { useState, useEffect } from 'react';
import { useSimulatorStore } from '@/lib/store';
import { CodeEditor } from '@/components/CodeEditor';
import { RegistersDisplay } from '@/components/RegistersDisplay';
import { MemoryDisplay } from '@/components/MemoryDisplay';
import { IOPorts } from '@/components/IOPorts';
import { Console } from '@/components/Console';
import { KeyboardHandler } from '@/components/KeyboardHandler';
import { KeyboardHelpModal } from '@/components/KeyboardHelpModal';
import MemoryEditModal from '@/components/MemoryEditModal';
import { MnemonicsModal } from '@/components/MnemonicsModal';
import { ExternalMemoryLoadModal } from '@/components/ExternalMemoryLoadModal';
import { WelcomeModal } from '@/components/WelcomeModal';
import { HelpSidebar } from '@/components/HelpSidebar';
import { DisassemblyPanel } from '@/components/DisassemblyPanel';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Play,
  SkipForward,
  RotateCcw,
  Terminal,
  Keyboard,
  Cpu,
  Save,
  FolderOpen,
} from 'lucide-react';
import HeaderDrawer from '@/components/HeaderDrawer';

export default function Home() {
  const {
    processorType,
    setProcessorType,
    runProgram,
    stepInstruction,
    resetSimulator,
    setConsoleOpen,
    consoleOpen,
    isRunning,
    code,
    setCode,
  } = useSimulatorStore();

  const [helpOpen, setHelpOpen] = useState(false);
  const [mnemonicsOpen, setMnemonicsOpen] = useState(false);
  const [memoryOpen, setMemoryOpen] = useState(false);
  const [externalMemoryOpen, setExternalMemoryOpen] = useState(false);
  const [welcomeOpen, setWelcomeOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Show welcome modal on first visit
    const hasVisited = localStorage.getItem('has-visited');
    if (!hasVisited) {
      setWelcomeOpen(true);
      localStorage.setItem('has-visited', 'true');
    }
  }, []);

  useEffect(() => {
    const savedCode = localStorage.getItem(`code-${processorType}`);
    if (savedCode) {
      setCode(savedCode);
    }
  }, [processorType, setCode]);

  useEffect(() => {
    localStorage.setItem(`code-${processorType}`, code);
  }, [code, processorType]);

  useEffect(() => {
    // initialize and listen for window size changes
    handleMobile();
    window.addEventListener('resize', handleMobile);
    return () => window.removeEventListener('resize', handleMobile);
  }, []);

  const handleSaveCode = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `program-${processorType}.asm`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleMobile = () => {
    if (window.innerWidth <= 768) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  }

  const handleLoadCode = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.asm,.txt';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          setCode(content);
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const [githubOpen, setGithubOpen] = useState(false);

  const handleOpenGithub = () => {
    setGithubOpen(true);
    // Open GitHub in new tab
    window.open('https://github.com/rubyaj24/mpmc_emulator', '_blank');
  };

  return (
      <>
  <KeyboardHandler onShowHelp={() => setHelpOpen(true)} onOpenMemory={() => setMemoryOpen(true)} />
  <KeyboardHelpModal open={helpOpen} onOpenChange={setHelpOpen} />
  <MnemonicsModal open={mnemonicsOpen} onOpenChange={setMnemonicsOpen} />
  <MemoryEditModal open={memoryOpen} onOpenChange={setMemoryOpen} />
  <ExternalMemoryLoadModal open={externalMemoryOpen} onOpenChange={setExternalMemoryOpen} />
  <WelcomeModal open={welcomeOpen} onOpenChange={setWelcomeOpen} />
  <HelpSidebar onOpenWelcome={() => setWelcomeOpen(true)} />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Cpu className="w-8 h-8 text-blue-600" />
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">
                    {isMobile
                      ? processorType === '8086'
                        ? 'MP Simulator'
                        : 'MC Simulator'
                      : processorType === '8086'
                      ? 'Microprocessor Simulator'
                      : 'Microcontroller Simulator'}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    {isMobile 
                      ? processorType === '8086'
                         ? 'Intel 8086 Emulator' 
                         : 'Intel 8051 Emulator' 
                         : 'Educational'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Select
                  value={processorType}
                  onValueChange={(value: '8086' | '8051') => setProcessorType(value)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="8086">Intel 8086</SelectItem>
                    <SelectItem value="8051">Intel 8051</SelectItem>
                  </SelectContent>
                </Select>

                {/* Keep processor select visible; move other header tools into drawer */}
                <HeaderDrawer
                  onOpenHelp={() => setHelpOpen(true)}
                  onOpenMnemonics={() => setMnemonicsOpen(true)}
                  onOpenGithub={() => handleOpenGithub()}
                />
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
              <div className="flex gap-2 flex-nowrap sm:flex-wrap overflow-x-auto">
                <Button onClick={runProgram} disabled={isRunning} size="sm">
                  <Play className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Run (R)</span>
                </Button>
                <Button onClick={stepInstruction} disabled={isRunning} size="sm" variant="outline">
                  <SkipForward className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Step (S)</span>
                </Button>
                <Button onClick={resetSimulator} size="sm" variant="outline">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Reset (X)</span>
                </Button>
                <Button
                  onClick={() => setConsoleOpen(!consoleOpen)}
                  size="sm"
                  variant="outline"
                >
                  <Terminal className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Console</span>
                </Button>
                <div className="ml-auto flex gap-2">
                  <Button onClick={() => setMemoryOpen(true)} size="sm" variant="outline">
                    <span className="sr-only">Memory</span>
                    <span className="inline sm:hidden">M</span>
                    <span className="hidden sm:inline">Memory</span>
                  </Button>
                  {processorType === '8051' && (
                    <Button onClick={() => setExternalMemoryOpen(true)} size="sm" variant="outline" title="Load external memory for testing">
                      <span className="sr-only">Load Ext Memory</span>
                      <span className="text-xs">Ext Mem</span>
                    </Button>
                  )}
                  <Button onClick={handleSaveCode} size="sm" variant="outline">
                    <Save className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Save</span>
                  </Button>
                  <Button onClick={handleLoadCode} size="sm" variant="outline">
                    <FolderOpen className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Load</span>
                  </Button>
                </div>
              </div>

              <div className="h-[500px]">
                <CodeEditor />
              </div>

              <DisassemblyPanel />

              {consoleOpen && <Console />}
            </div>

            <div className="space-y-6">
              <RegistersDisplay />
              <MemoryDisplay />
              {processorType === '8051' && <IOPorts />}
            </div>
          </div>
        </main>

        <footer className="border-t mt-12 py-6">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            <p>Web-based Microprocessor Simulator</p>
            <p className="mt-1">
              Press <kbd className="px-2 py-0.5 bg-muted rounded text-xs font-mono">?</kbd> for
              keyboard shortcuts
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
