"use client";

import type React from "react";

import { loginAction } from "@/actions/user-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Routes } from "@/routes/Routes";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useUserStore } from "@/stores/useUserStore";
import { Turnstile } from "@marsidev/react-turnstile";
import { useApplicationStore } from "@/stores/useApplicationStore";

export default function TutorLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { setCaptchaToken, captchaToken } = useApplicationStore();

  const { setUser } = useUserStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic validation
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    // Simulate API call
    try {
      const res = await loginAction(email, password, captchaToken);
      const parsedRes = JSON.parse(res);

      if (!parsedRes.success) {
        setError(parsedRes.data.msg);
        return;
      }

      setUser(parsedRes.data);

      router.push(Routes.UserList);
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-pink-50 flex flex-col">
      {/* Main content */}
      <main className="relative z-10 flex-grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-pink-100 mb-4">
                <Lock className="w-6 h-6 text-[#DB5461]" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Tutor Login</h1>
              <p className="mt-2 text-gray-600">
                Access the tutor portal to manage your students and sessions
              </p>
              <div className="h-1 w-12 bg-[#DB5461] mx-auto mt-4 rounded-full"></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Mail className="w-4 h-4 text-gray-400" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href=""
                    className="text-xs text-[#DB5461] hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Lock className="w-4 h-4 text-gray-400" />
                  </div>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className="pl-10 pr-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    ) : (
                      <Eye className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-[#DB5461] hover:bg-[#c64854] text-white"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
            <div className="mt-4">
              <Turnstile
                siteKey={process.env.NEXT_PUBLIC_SITE_KEY!}
                onSuccess={(token: string) => {
                  setCaptchaToken(token);
                }}
                onError={() => router.push("/error")}
                options={{
                  theme: "light",
                  size: "normal",
                }}
                scriptOptions={{
                  appendTo: "body",
                }}
              />
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <div className="inline-flex items-center justify-center px-2 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">
                Tutor Access Only
              </div>
              <p className="mt-2 text-xs text-gray-500">
                If you're a student, please return to the main site.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
