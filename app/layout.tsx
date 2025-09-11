import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../src/app/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Project Poppy - AI Canvas',
  description: 'Interactive AI-powered canvas with React Flow',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}