'use client';

import { SessionProvider } from 'next-auth/react';
import Navbar from '@/components/Navbar';

export default function CompaniesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <div className="flex min-h-screen bg-black">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </SessionProvider>
  );
}
