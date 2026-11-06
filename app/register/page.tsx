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
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6">
      <Card className="w-full max-w-md flix-frame p-6 sm:p-8 rounded-[28px] relative overflow-hidden">
        <CardHeader className="text-center p-0 pb-6">
          <Link
            href="/"
            className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-flix-dark text-white shadow-subtle transition-transform hover:scale-105"
          >
            <BookOpen className="h-6 w-6" />
          </Link>
          <CardTitle className="text-3xl font-black text-flix-dark tracking-tight">
            Create Account
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm text-flix-dark/75 mt-1 font-medium">
            Join ReadLog and begin tracking your reading sessions.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          <form
            data-testid="register-form"
            onSubmit={handleSubmit}
            noValidate
            className="space-y-4"
          >
            {/* Email Field */}
            <div className="space-y-1.5">
              <Label
                htmlFor="email"
                className="text-[11px] font-bold text-flix-dark uppercase tracking-wider"
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                data-testid="register-email"
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
                placeholder="reader@example.com"
                className={`rounded-[14px] border bg-white/70 px-4 py-2.5 text-sm transition-all focus:border-flix-dark focus:ring-1 focus:ring-flix-dark text-flix-dark placeholder:text-flix-dark/40 ${
                  errors.email ? "border-flix-error bg-red-50/50" : "border-white/60"
                }`}
              />
              {errors.email && (
                <p
                  data-testid="error-email"
                  className="text-xs font-semibold text-flix-error flex items-center gap-1 mt-1"
                >
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  <span>{errors.email}</span>
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <Label
                htmlFor="password"
                className="text-[11px] font-bold text-flix-dark uppercase tracking-wider"
              >
                Password
              </Label>
              <Input
                id="password"
                type="password"
                data-testid="register-password"
                value={password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                placeholder="At least 6 characters"
                className={`rounded-[14px] border bg-white/70 px-4 py-2.5 text-sm transition-all focus:border-flix-dark focus:ring-1 focus:ring-flix-dark text-flix-dark placeholder:text-flix-dark/40 ${
                  errors.password ? "border-flix-error bg-red-50/50" : "border-white/60"
                }`}
              />
              {errors.password && (
                <p
                  data-testid="error-password"
                  className="text-xs font-semibold text-flix-error flex items-center gap-1 mt-1"
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
                className="text-[11px] font-bold text-flix-dark uppercase tracking-wider"
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
                className={`rounded-[14px] border bg-white/70 px-4 py-2.5 text-sm transition-all focus:border-flix-dark focus:ring-1 focus:ring-flix-dark text-flix-dark placeholder:text-flix-dark/40 ${
                  errors.confirmPassword
                    ? "border-flix-error bg-red-50/50"
                    : "border-white/60"
                }`}
              />
              {errors.confirmPassword && (
                <p
                  data-testid="error-confirm-password"
                  className="text-xs font-semibold text-flix-error flex items-center gap-1 mt-1"
                >
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  <span>{errors.confirmPassword}</span>
                </p>
              )}
            </div>

            {/* Auth API Error */}
            {authError && (
              <div className="rounded-[14px] border border-flix-error/40 bg-red-100/60 p-3">
                <p
                  data-testid="error-auth"
                  className="text-xs font-bold text-flix-error flex items-center gap-1.5"
                >
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{authError}</span>
                </p>
              </div>
            )}

            {/* Form Success Message */}
            {success && (
              <div className="rounded-[14px] border border-white/60 bg-flix-dark text-white p-3 shadow-subtle">
                <p
                  data-testid="form-success"
                  className="text-xs font-bold flex items-center gap-2"
                >
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                  <span>Registration successful</span>
                </p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              data-testid="register-submit"
              disabled={isLoading}
              className="w-full btn-flix-dark py-5 text-sm font-bold cursor-pointer mt-2 shadow-subtle"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Registering...</span>
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  <span>Register</span>
                </span>
              )}
            </Button>

            <div className="pt-2 text-center text-xs text-flix-dark/75 font-medium">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-bold text-flix-dark hover:underline"
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
