"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { Wallet, LogIn, AlertCircle } from "lucide-react";

function validateEmail(email: string) {
  if (!email) return "Email is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return "Please enter a valid email address";
  return "";
}

function validatePassword(password: string) {
  if (!password) return "Password is required";
  return "";
}

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [authError, setAuthError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const e = {
      email: validateEmail(email),
      password: validatePassword(password),
    };
    setErrors(e);
    return !e.email && !e.password;
  };

  const handleEmailChange = (v: string) => {
    setEmail(v);
    if (submitted) setErrors((prev) => ({ ...prev, email: validateEmail(v) }));
  };

  const handlePasswordChange = (v: string) => {
    setPassword(v);
    if (submitted)
      setErrors((prev) => ({ ...prev, password: validatePassword(v) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setAuthError("");
    if (!validate()) return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const data = await res.json();
        login(data);
        router.push("/expenses");
      } else {
        const data = await res.json();
        setAuthError(data.error || "Login failed");
      }
    } catch {
      setAuthError("Failed to connect to server");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-mesh-gradient px-4 py-12 relative overflow-hidden">
      {/* 3D Decorative Floating Ambient Spheres */}
      <div className="pointer-events-none absolute -top-20 -left-20 h-72 w-72 rounded-full bg-blue-500/15 blur-3xl animate-float-slow" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-purple-500/15 blur-3xl animate-float-slow" style={{ animationDelay: "-3s" }} />

      <Card className="w-full max-w-md glass-panel relative z-10 rounded-2xl border-white/80 shadow-[0_20px_50px_rgba(0,0,0,0.06)] overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
        
        <CardHeader className="text-center pt-8 pb-4">
          <Link href="/" className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-[0_4px_14px_rgba(37,99,235,0.4)] transition-transform hover:scale-105">
            <Wallet className="h-6 w-6" />
          </Link>
          <CardTitle className="text-2xl font-extrabold text-gray-900 tracking-tight">Sign In</CardTitle>
          <CardDescription className="text-sm text-gray-500">
            Welcome back to ExpenseTrail. Track your spending today.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 pb-8">
          <form
            data-testid="login-form"
            noValidate
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-gray-700">
                Email
              </Label>
              <Input
                id="email"
                data-testid="login-email"
                type="email"
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
                placeholder="you@example.com"
                className="h-11 rounded-xl border-gray-200 bg-white/90 shadow-inner focus-visible:ring-4 focus-visible:ring-blue-500/15 transition-all text-sm"
              />
              {errors.email && (
                <p
                  data-testid="error-email"
                  className="text-xs font-medium text-red-500 flex items-center gap-1 mt-1"
                >
                  {errors.email}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-gray-700">
                Password
              </Label>
              <Input
                id="password"
                data-testid="login-password"
                type="password"
                value={password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                placeholder="••••••••"
                className="h-11 rounded-xl border-gray-200 bg-white/90 shadow-inner focus-visible:ring-4 focus-visible:ring-blue-500/15 transition-all text-sm"
              />
              {errors.password && (
                <p
                  data-testid="error-password"
                  className="text-xs font-medium text-red-500 flex items-center gap-1 mt-1"
                >
                  {errors.password}
                </p>
              )}
            </div>

            {authError && (
              <div className="rounded-xl border border-red-200 bg-red-50/90 p-3 shadow-xs">
                <p data-testid="error-auth" className="text-xs font-medium text-red-600 flex items-center gap-1.5">
                  <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
                  <span>{authError}</span>
                </p>
              </div>
            )}

            <Button
              data-testid="login-submit"
              type="submit"
              disabled={isLoading}
              className="button-3d-primary w-full h-11 font-bold text-white rounded-xl shadow-md cursor-pointer mt-2"
            >
              <LogIn className="mr-2 h-4 w-4" />
              <span>{isLoading ? "Signing in..." : "Sign In"}</span>
            </Button>

            <p className="text-center text-xs text-gray-500 pt-3 border-t border-gray-100">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="font-semibold text-blue-600 hover:text-blue-800 hover:underline">
                Register now
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
