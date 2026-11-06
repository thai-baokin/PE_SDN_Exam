"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Wallet, UserPlus, AlertCircle, CheckCircle2 } from "lucide-react";

function validateEmail(email: string) {
  if (!email) return "Email is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return "Please enter a valid email address";
  return "";
}

function validatePassword(password: string) {
  if (!password) return "Password is required";
  if (password.length < 6) return "Password must be at least 6 characters";
  return "";
}

function validateConfirmPassword(password: string, confirm: string) {
  if (!confirm) return "Confirm password is required";
  if (confirm !== password) return "Passwords do not match";
  return "";
}

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [authError, setAuthError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const e = {
      email: validateEmail(email),
      password: validatePassword(password),
      confirmPassword: validateConfirmPassword(password, confirmPassword),
    };
    setErrors(e);
    return !e.email && !e.password && !e.confirmPassword;
  };

  const handleEmailChange = (v: string) => {
    setEmail(v);
    if (submitted) setErrors((prev) => ({ ...prev, email: validateEmail(v) }));
  };

  const handlePasswordChange = (v: string) => {
    setPassword(v);
    if (submitted) {
      setErrors((prev) => ({
        ...prev,
        password: validatePassword(v),
        confirmPassword: validateConfirmPassword(v, confirmPassword),
      }));
    }
  };

  const handleConfirmPasswordChange = (v: string) => {
    setConfirmPassword(v);
    if (submitted)
      setErrors((prev) => ({
        ...prev,
        confirmPassword: validateConfirmPassword(password, v),
      }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setAuthError("");
    setSuccess(false);
    if (!validate()) return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, confirmPassword }),
      });

      if (res.ok) {
        setSuccess(true);
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setSubmitted(false);
        setErrors({ email: "", password: "", confirmPassword: "" });
      } else {
        const data = await res.json();
        setAuthError(data.error || "Registration failed");
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
      <div className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-blue-500/15 blur-3xl animate-float-slow" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-indigo-500/15 blur-3xl animate-float-slow" style={{ animationDelay: "-3s" }} />

      <Card className="w-full max-w-md glass-panel relative z-10 rounded-2xl border-white/80 shadow-[0_20px_50px_rgba(0,0,0,0.06)] overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
        
        <CardHeader className="text-center pt-8 pb-4">
          <Link href="/" className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-[0_4px_14px_rgba(37,99,235,0.4)] transition-transform hover:scale-105">
            <Wallet className="h-6 w-6" />
          </Link>
          <CardTitle className="text-2xl font-extrabold text-gray-900 tracking-tight">Create Account</CardTitle>
          <CardDescription className="text-sm text-gray-500">
            Start tracking and mastering your budget today.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 pb-8">
          <form
            data-testid="register-form"
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
                data-testid="register-email"
                type="email"
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
                placeholder="you@example.com"
                className="h-11 rounded-xl border-gray-200 bg-white/90 shadow-inner focus-visible:ring-4 focus-visible:ring-blue-500/15 transition-all text-sm"
              />
              {errors.email && (
                <p data-testid="error-email" className="text-xs font-medium text-red-500 flex items-center gap-1 mt-1">
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
                data-testid="register-password"
                type="password"
                value={password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                placeholder="At least 6 characters"
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

            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword" className="text-xs font-semibold uppercase tracking-wider text-gray-700">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                data-testid="register-confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                placeholder="Repeat your password"
                className="h-11 rounded-xl border-gray-200 bg-white/90 shadow-inner focus-visible:ring-4 focus-visible:ring-blue-500/15 transition-all text-sm"
              />
              {errors.confirmPassword && (
                <p
                  data-testid="error-confirm-password"
                  className="text-xs font-medium text-red-500 flex items-center gap-1 mt-1"
                >
                  {errors.confirmPassword}
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

            {success && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/90 p-3 shadow-xs">
                <p
                  data-testid="form-success"
                  className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5"
                >
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                  <span>Registration successful</span>
                </p>
              </div>
            )}

            <Button
              data-testid="register-submit"
              type="submit"
              disabled={isLoading}
              className="button-3d-primary w-full h-11 font-bold text-white rounded-xl shadow-md cursor-pointer mt-2"
            >
              <UserPlus className="mr-2 h-4 w-4" />
              <span>{isLoading ? "Creating Account..." : "Create Account"}</span>
            </Button>

            <p className="text-center text-xs text-gray-500 pt-3 border-t border-gray-100">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-800 hover:underline">
                Sign In
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
