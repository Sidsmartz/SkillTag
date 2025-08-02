'use client';

import { SessionProvider } from 'next-auth/react';
import CompaniesNavbar from '@/components/CompaniesNavbar';

export default function CompaniesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <div className="flex min-h-screen bg-black">
        <CompaniesNavbar />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </SessionProvider>
  );
}
