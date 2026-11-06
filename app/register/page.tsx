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
    <div className="flex min-h-screen items-center justify-center bg-kem px-4 py-12 font-sans selection:bg-sanho/20">
      <Card className="w-full max-w-md card-editorial p-6 sm:p-8 relative">
        <CardHeader className="text-center p-0 pb-6">
          <Link
            href="/"
            className="mx-auto mb-3.5 flex h-11 w-11 items-center justify-center rounded-full bg-muc text-nga shadow-xs transition-colors hover:bg-sanho"
          >
            <BookOpen className="h-5 w-5" />
          </Link>
          <CardTitle className="text-3xl font-serif font-black text-muc tracking-tight">
            Create Account
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm text-muc/70 mt-1">
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
                className="text-[11px] font-bold text-muc uppercase tracking-[0.15em]"
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
                className={`rounded-[12px] border bg-nga px-3.5 py-2.5 text-sm transition-all focus:border-sanho focus:ring-1 focus:ring-sanho ${
                  errors.email ? "border-sanho bg-sanho/5" : "border-muc/15"
                }`}
              />
              {errors.email && (
                <p
                  data-testid="error-email"
                  className="text-xs font-medium text-sanho flex items-center gap-1 mt-1"
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
                className="text-[11px] font-bold text-muc uppercase tracking-[0.15em]"
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
                className={`rounded-[12px] border bg-nga px-3.5 py-2.5 text-sm transition-all focus:border-sanho focus:ring-1 focus:ring-sanho ${
                  errors.password ? "border-sanho bg-sanho/5" : "border-muc/15"
                }`}
              />
              {errors.password && (
                <p
                  data-testid="error-password"
                  className="text-xs font-medium text-sanho flex items-center gap-1 mt-1"
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
                className="text-[11px] font-bold text-muc uppercase tracking-[0.15em]"
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
                className={`rounded-[12px] border bg-nga px-3.5 py-2.5 text-sm transition-all focus:border-sanho focus:ring-1 focus:ring-sanho ${
                  errors.confirmPassword
                    ? "border-sanho bg-sanho/5"
                    : "border-muc/15"
                }`}
              />
              {errors.confirmPassword && (
                <p
                  data-testid="error-confirm-password"
                  className="text-xs font-medium text-sanho flex items-center gap-1 mt-1"
                >
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  <span>{errors.confirmPassword}</span>
                </p>
              )}
            </div>

            {/* Auth API Error */}
            {authError && (
              <div className="rounded-[12px] border border-sanho/30 bg-sanho/10 p-3">
                <p
                  data-testid="error-auth"
                  className="text-xs font-medium text-sanho flex items-center gap-1.5"
                >
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{authError}</span>
                </p>
              </div>
            )}

            {/* Form Success Message */}
            {success && (
              <div className="rounded-[12px] border border-muc/20 bg-muc text-nga p-3 shadow-subtle">
                <p
                  data-testid="form-success"
                  className="text-xs font-semibold flex items-center gap-2"
                >
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-sanho" />
                  <span>Registration successful</span>
                </p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              data-testid="register-submit"
              disabled={isLoading}
              className="w-full btn-pill-dark py-5 text-sm font-semibold cursor-pointer mt-2"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-nga border-t-transparent" />
                  <span>Registering...</span>
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  <span>Register</span>
                </span>
              )}
            </Button>

            <div className="pt-2 text-center text-xs text-muc/70">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-bold text-muc hover:text-sanho transition-colors underline"
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
