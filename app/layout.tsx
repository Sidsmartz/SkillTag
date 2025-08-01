import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SkillTag",
  description:
    "Join the waitlist for SkillTag - your gateway to micro gigs and skill tags.",
};

import { Providers } from './providers';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={poppins.className}>
      <Providers>
        <body>{children}</body>
      </Providers>
    </html>
  );
}
