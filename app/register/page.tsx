"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BookOpen, UserPlus, AlertCircle, CheckCircle2 } from "lucide-react";

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
    if (submitted) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: validateConfirmPassword(password, v),
      }));
    }
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
    <div className="flex min-h-screen items-center justify-center bg-[#FAF7F2] px-4 py-12 relative overflow-hidden font-sans">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute -top-20 -right-20 h-72 w-72 rounded-full bg-amber-300/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-emerald-200/30 blur-3xl" />

      <Card className="w-full max-w-md relative z-10 rounded-3xl border border-white/80 bg-white/75 shadow-[0_20px_50px_rgba(44,36,25,0.06)] backdrop-blur-xl overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900" />
        
        <CardHeader className="text-center pt-8 pb-4">
          <Link href="/" className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-800 text-amber-50 shadow-[0_4px_14px_rgba(180,83,9,0.3)] transition-transform hover:scale-105">
            <BookOpen className="h-6 w-6" />
          </Link>
          <CardTitle className="text-2xl font-serif font-black text-amber-950 tracking-tight">Create Account</CardTitle>
          <CardDescription className="text-sm text-amber-900/70">
            Join ReadLog and start cataloging your books
          </CardDescription>
        </CardHeader>

        <CardContent className="px-6 sm:px-8 pb-8">
          <form
            data-testid="register-form"
            onSubmit={handleSubmit}
            noValidate
            className="space-y-4"
          >
            {/* Email Field */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-bold text-amber-950 uppercase tracking-wider">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                data-testid="register-email"
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
                placeholder="reader@example.com"
                className={`rounded-xl border bg-white/90 px-3.5 py-2.5 text-sm transition-all focus:border-amber-800 focus:ring-2 focus:ring-amber-800/20 ${
                  errors.email ? "border-rose-400 bg-rose-50/20" : "border-amber-900/15"
                }`}
              />
              {errors.email && (
                <p
                  data-testid="error-email"
                  className="text-xs font-medium text-rose-600 flex items-center gap-1 mt-1"
                >
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  <span>{errors.email}</span>
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-bold text-amber-950 uppercase tracking-wider">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                data-testid="register-password"
                value={password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                placeholder="At least 6 characters"
                className={`rounded-xl border bg-white/90 px-3.5 py-2.5 text-sm transition-all focus:border-amber-800 focus:ring-2 focus:ring-amber-800/20 ${
                  errors.password ? "border-rose-400 bg-rose-50/20" : "border-amber-900/15"
                }`}
              />
              {errors.password && (
                <p
                  data-testid="error-password"
                  className="text-xs font-medium text-rose-600 flex items-center gap-1 mt-1"
                >
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  <span>{errors.password}</span>
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-1.5">
              <Label
                htmlFor="confirmPassword"
                className="text-xs font-bold text-amber-950 uppercase tracking-wider"
              >
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                data-testid="register-confirm-password"
                value={confirmPassword}
                onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                placeholder="Repeat password"
                className={`rounded-xl border bg-white/90 px-3.5 py-2.5 text-sm transition-all focus:border-amber-800 focus:ring-2 focus:ring-amber-800/20 ${
                  errors.confirmPassword
                    ? "border-rose-400 bg-rose-50/20"
                    : "border-amber-900/15"
                }`}
              />
              {errors.confirmPassword && (
                <p
                  data-testid="error-confirm-password"
                  className="text-xs font-medium text-rose-600 flex items-center gap-1 mt-1"
                >
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  <span>{errors.confirmPassword}</span>
                </p>
              )}
            </div>

            {/* API Auth Error Message */}
            {authError && (
              <div className="rounded-xl border border-rose-200 bg-rose-50/80 p-3">
                <p data-testid="error-auth" className="text-xs font-medium text-rose-700 flex items-center gap-1.5">
                  <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                  <span>{authError}</span>
                </p>
              </div>
            )}

            {/* Form Success Message */}
            {success && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-3">
                <p
                  data-testid="form-success"
                  className="text-xs font-semibold text-emerald-800 flex items-center gap-1.5"
                >
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                  <span>Registration successful</span>
                </p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              data-testid="register-submit"
              disabled={isLoading}
              className="w-full bg-amber-900 hover:bg-amber-950 text-amber-50 font-semibold py-6 rounded-xl shadow-md transition-all hover:-translate-y-0.5 cursor-pointer mt-2"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Registering...</span>
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  <span>Register</span>
                </span>
              )}
            </Button>

            <div className="pt-2 text-center text-xs text-amber-900/70">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-bold text-amber-900 hover:underline"
              >
                Sign in here
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
