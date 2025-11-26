"use client";

import React from 'react';
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from '@/components/ui/drawer';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Menu, Keyboard, Cpu, FileText, Book, SunMoon, GitFork, Github } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

interface HeaderDrawerProps {
  onOpenHelp: () => void;
  onOpenMnemonics: () => void;
  onOpenTutorials?: () => void;
  onOpenGithub?: () => void;
}

export default function HeaderDrawer({ onOpenHelp, onOpenMnemonics, onOpenTutorials, onOpenGithub }: HeaderDrawerProps) {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const content = (
    <div className="p-2 w-full">
      <div className="flex flex-col gap-2 mb-2">
        <Button variant="ghost" onClick={onOpenHelp} className="w-full justify-start">
          <Keyboard className="w-4 h-4 mr-2" />
          Shortcuts
        </Button>
        <Button variant="ghost" onClick={onOpenMnemonics} className="w-full justify-start">
          <Cpu className="w-4 h-4 mr-2" />
          Mnemonics
        </Button>
        <Button
          variant="ghost"
          onClick={onOpenGithub} className='w-full justify-start'>
            <Github className="w-4 h-4 mr-2" />
            Github
          </Button>
      </div>

      <div className="pt-2">
        <div className="text-sm text-muted-foreground mb-2">Theme</div>
        <ThemeToggle />
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="outline" size="sm" aria-label="Open menu">
            <Menu className="w-4 h-4" />
          </Button>
        </DrawerTrigger>

        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Tools & Resources</DrawerTitle>
            <DrawerDescription>Quick access to shortcuts, mnemonics, and documentation.</DrawerDescription>
          </DrawerHeader>

          {content}

          <DrawerFooter>
            <div className="w-full text-center">
              {/* <DrawerClose asChild>
                <Button size="sm">Close</Button>
              </DrawerClose> */}
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  // Desktop: use a popover (toggle list) instead of a full drawer
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" aria-label="Open menu">
          <Menu className="w-4 h-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56">
        <div className="flex flex-col">{content}</div>
      </PopoverContent>
    </Popover>
  );
}
