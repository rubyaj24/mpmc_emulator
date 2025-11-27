// @ts-ignore: allow importing global CSS with no type declarations
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import ThemeProviderWrapper from '@/components/ThemeProviderWrapper';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MPMC Emulator',
  description: 'Educational Microprocessor Emulator for Intel 8086 and 8051 Assembly Language',
  icons: {
    icon: '/favicon.svg', // used by browsers (SVG favicon)
    shortcut: '/favicon.svg', // small shortcut icon
    apple: '/favicon.svg', // iOS / touch icon (SVG)
  },
  metadataBase: new URL('http://localhost:3000'), // optional: ensures absolute URLs for some metadata
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProviderWrapper>{children}</ThemeProviderWrapper>
      </body>
    </html>
  );
}
