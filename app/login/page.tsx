"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LoginForm from "@/components/login-form";

export default function Page() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      // Check if user has completed onboarding
      const checkUserOnboarding = async () => {
        try {
          const response = await fetch('/api/user/details');
          if (response.ok) {
            // If we can fetch user details, assume onboarding is complete
            router.replace('/home');
          } else {
            // If user details don't exist, redirect to onboarding
            router.replace('/login/details');
          }
        } catch (error) {
          console.error('Error checking user onboarding status:', error);
          // In case of error, redirect to onboarding
          router.replace('/login/details');
        }
      };
      
      checkUserOnboarding();
    }
  }, [session, status, router]);

  // Show loading state while checking session
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-[#ADFF00] text-xl">Loading...</div>
      </div>
    );
  }

  // If not authenticated, show the login form
  if (status === "unauthenticated") {
    return <LoginForm />;
  }

  // If authenticated, the useEffect will handle redirection
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-[#ADFF00] text-xl">Redirecting...</div>
    </div>
  );
}
