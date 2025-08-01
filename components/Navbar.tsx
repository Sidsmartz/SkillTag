"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  FileText,
  Clock3,
  CheckCircle,
  User,
  Bell,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import TransitionLink from "./TransitionLink";
import { signOut } from "next-auth/react";

const navItems = [
  { name: "Home", href: "/home", icon: Home },
  { name: "My Zigs", href: "/my-zigs", icon: FileText },
  { name: "Notifications", href: "/notifications", icon: Bell },
  { name: "Profile", href: "/profile", icon: User },
];

export default function Navbar() {
  const pathname = usePathname();
  const showNavbar = [
    "/home",
    "/my-zigs",
    "/notifications",
    "/profile",
  ].includes(pathname);
  if (!showNavbar) return null;

  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <>
      {/* Desktop Navbar (hidden on small screens) */}
      <div className="w-64 bg-black p-6 flex-col min-h-screen hidden lg:fixed lg:flex lg:top-0 lg:left-0 lg:h-screen">
        {/* Logo */}
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="w-16 h-16 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
            <div className="w-8 h-12 bg-white transform rotate-12 rounded-sm"></div>
          </div>
          <span className="text-white text-2xl font-light text-center">
            zig<span className="font-normal">work</span>
          </span>
        </div>
        {/* Navigation */}
        <nav className="flex-1 space-y-2 flex flex-col justify-center">
          {navItems.map(({ name, href, icon: Icon }) => (
            <TransitionLink href={href} key={href}>
              <Button
                asChild
                className={`w-full justify-start bg-transparent ${
                  pathname === href
                    ? "text-purple-400 hover:bg-transparent hover:text-purple-200"
                    : "text-gray-400 hover:bg-transparent hover:text-purple-200"
                }`}
              >
                <span className="flex items-center">
                  <Icon className="w-5 h-5 mr-3" />
                  {name}
                </span>
              </Button>
            </TransitionLink>
          ))}
        </nav>
        {/* Footer Links */}
        <div className="space-y-2 text-sm text-gray-500 mt-8">
          <div className="flex gap-4">
            <button className="hover:text-gray-300">Support</button>
            <button className="hover:text-gray-300">Privacy Policy</button>
          </div>
          <button className="hover:text-gray-300">Terms & Conditions</button>
        </div>
        {/* Logout Button */}
        <div className="mt-6">
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-900/20"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </Button>
        </div>
      </div>

      {/* Mobile Navbar (hidden on large screens) */}
      <div className="absolute bottom-4 inset-x-0 w-full px-4 py-4 rounded-3xl z-40 lg:hidden bg-purple-600">
        <div className="flex items-center justify-around">
          {navItems.map(({ name, href, icon: Icon }) => (
            <TransitionLink href={href} key={href}>
              <Button
                asChild
                variant="ghost"
                size="icon"
                className={`h-12 w-12 ${
                  pathname === href ? "text-white" : "text-purple-200"
                } hover:bg-purple-500`}
              >
                <span className="flex flex-col items-center">
                  <Icon className="w-6 h-6 fill-current" />
                  <span className="text-xs mt-1">{name}</span>
                </span>
              </Button>
            </TransitionLink>
          ))}
        </div>
      </div>
    </>
  );
}
