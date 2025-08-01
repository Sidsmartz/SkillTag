"use client";

import Link from "next/link";
import { Home, BarChart3, Bookmark, User } from "lucide-react";
import { usePathname } from "next/navigation";

export default function SidebarNav({ student = false }: { student?: boolean }) {
  const pathname = usePathname();

  // Sidebar links for company and student
  const links = student
    ? [
        { name: "Home", href: "/home", icon: Home },
        { name: "My Zigs", href: "/my-zigs", icon: BarChart3 },
        { name: "Shortlist", href: "/shortlist", icon: Bookmark },
        { name: "Profile", href: "/profile", icon: User },
      ]
    : [
        { name: "Home", href: "/companies", icon: Home },
        { name: "My Zigs", href: "/companies/my-zigs", icon: BarChart3 },
        { name: "Shortlist", href: "/companies/shortlist", icon: Bookmark },
        { name: "Profile", href: "/companies/profile", icon: User },
      ];

  return (
    <div className="w-64 bg-black text-white flex flex-col min-h-screen p-6">
      {/* Logo */}
      <div className="flex flex-col items-center mb-12 mt-0">
        <img
          src="/zigwork-logo.svg"
          alt="Zigwork Logo"
          width={64}
          height={64}
          className="w-16 h-16 mb-2"
          onError={e => {
            (e.currentTarget as HTMLImageElement).onerror = null;
            (e.currentTarget as HTMLImageElement).src = "/vite.svg";
          }}
        />
        <span className="text-xl font-bold">zigwork</span>
      </div>

      {/* Navigation */}
      <nav className="space-y-2 mb-auto">
        {links.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm font-medium border border-transparent ${
              pathname === link.href
                ? "bg-[#5E17EB]/20 text-[#5E17EB] border-[#5E17EB]/30"
                : "text-gray-400 hover:text-white hover:bg-gray-800/50"
            }`}
          >
            <link.icon className="w-4 h-4" />
            <span>{link.name}</span>
          </Link>
        ))}
      </nav>

      {/* Footer Links */}
      <div className="space-y-2 text-xs text-gray-400 px-3 mb-4 mt-auto">
        <div className="hover:text-white cursor-pointer transition-colors">Support</div>
        <div className="hover:text-white cursor-pointer transition-colors">Privacy Policy</div>
        <div className="hover:text-white cursor-pointer transition-colors">Terms & Conditions</div>
        <div className="text-xs mt-4 text-gray-500">©All Rights Reserved Zigwork</div>
      </div>
    </div>
  );
}
