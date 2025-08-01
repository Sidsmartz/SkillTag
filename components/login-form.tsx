"use client";

import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Add this import for NextAuth
import { signIn } from "next-auth/react";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("register");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (containerRef.current && contentRef.current) {
      const container = containerRef.current;
      setTimeout(() => {
        const currentHeight = container.offsetHeight;
        gsap.set(container, { height: "auto" });
        const targetHeight = container.offsetHeight;
        gsap.set(container, { height: currentHeight });
        gsap.to(container, {
          height: targetHeight,
          duration: 0.6,
          ease: "elastic",
        });
      }, 10);
    }
  }, [activeTab]);

  // Handle login form submit
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
      callbackUrl: "/login/details",
    });
    setLoading(false);
    if (res && res.ok) {
      router.push(res.url || "/login/details");
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        background: `
    radial-gradient(circle at 20% -20%, #c4f542 0%, #c4f542 15%, rgba(196, 245, 66, 0.6) 35%, rgba(196, 245, 66, 0.2) 50%, transparent 70%),
    radial-gradient(circle at 80% -10%, #c4f542 0%, #c4f542 8%, rgba(196, 245, 66, 0.4) 20%, rgba(196, 245, 66, 0.1) 35%, transparent 50%),
    #f8f9fa
  `,
      }}
    >
      <div
        ref={containerRef}
        className="w-full max-w-md bg-white rounded-md shadow-lg overflow-hidden"
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-100 rounded-none rounded-t-md p-0 h-auto">
            <TabsTrigger
              value="register"
              className="rounded-none rounded-tl-md px-6 py-4 text-sm font-medium transition-all data-[state=active]:shadow-none data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=inactive]:text-gray-600 data-[state=inactive]:bg-gray-100"
            >
              Register
            </TabsTrigger>
            <TabsTrigger
              value="login"
              className="rounded-none rounded-tr-md px-6 py-4 text-sm font-medium transition-all data-[state=active]:shadow-none data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=inactive]:text-gray-600 data-[state=inactive]:bg-gray-100"
            >
              Login
            </TabsTrigger>
          </TabsList>

          <div ref={contentRef} className="p-8">
            <TabsContent value="login" className="space-y-6 mt-0">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-6">
                  Welcome back!
                </h1>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-sm font-medium text-gray-700"
                    >
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-[45px] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="password"
                      className="text-sm font-medium text-gray-400"
                    >
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full h-[45px] px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox id="keep-logged" />
                    <Label
                      htmlFor="keep-logged"
                      className="text-sm text-gray-700"
                    >
                      Keep me logged in
                    </Label>
                  </div>
                  {error && <div className="text-red-500 text-sm">{error}</div>}
                  <Button
                    className="w-full bg-black hover:bg-gray-800 text-white py-3 rounded-lg font-medium"
                    style={{ color: "#c4f542" }}
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? "Logging in..." : "Continue"}
                  </Button>

                  <div className="text-center">
                    <Link
                      href="/forgot-password"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">or</span>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full py-3 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center space-x-2 bg-transparent"
                    onClick={() =>
                      signIn("google", { callbackUrl: "/login/details" })
                    }
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    <span className="text-gray-700">Sign in with Google</span>
                  </Button>
                </form>
              </div>
            </TabsContent>

            <TabsContent value="register" className="space-y-6 mt-0">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-6">
                  Create an account
                </h1>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="personal-email"
                      className="text-sm font-medium text-gray-700"
                    >
                      Personal Email
                    </Label>
                    <Input
                      id="personal-email"
                      type="email"
                      defaultValue="dummy_username@gmail.com"
                      className="w-full h-[45px] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <Button
                    className="w-full bg-black hover:bg-gray-800 text-white py-3 rounded-lg font-medium"
                    style={{ color: "#c4f542" }}
                  >
                    Continue
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">or</span>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full py-3 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center space-x-2 bg-transparent"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    <span className="text-gray-700">Sign in with Google</span>
                  </Button>

                  <div className="text-center text-sm text-gray-600 mt-4">
                    <p>
                      By continuing to create an account, you agree to SkillTag{" "}
                      <Link
                        href="/terms"
                        className="text-blue-600 hover:underline"
                      >
                        Terms & Conditions
                      </Link>{" "}
                      and{" "}
                      <Link
                        href="/privacy"
                        className="text-blue-600 hover:underline"
                      >
                        Privacy Policy
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </div>

          <div className="px-8 pb-8">
            <div className="pt-6 border-t border-gray-200">
              <div className="flex justify-center space-x-6 text-sm text-gray-600 font-sans">
                <Link href="/support" className="hover:text-gray-900">
                  Support
                </Link>
                <span>•</span>
                <Link href="/privacy" className="hover:text-gray-900">
                  Privacy Policy
                </Link>
                <span>•</span>
                <Link href="/terms" className="hover:text-gray-900">
                  Terms & Conditions
                </Link>
              </div>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
