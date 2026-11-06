"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Create Account</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            data-testid="register-form"
            noValidate
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                data-testid="register-email"
                type="email"
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
                placeholder="you@example.com"
              />
              {errors.email && (
                <p data-testid="error-email" className="text-sm text-red-500">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                data-testid="register-password"
                type="password"
                value={password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                placeholder="At least 6 characters"
              />
              {errors.password && (
                <p
                  data-testid="error-password"
                  className="text-sm text-red-500"
                >
                  {errors.password}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                data-testid="register-confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                placeholder="Repeat your password"
              />
              {errors.confirmPassword && (
                <p
                  data-testid="error-confirm-password"
                  className="text-sm text-red-500"
                >
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {authError && (
              <p data-testid="error-auth" className="text-sm text-red-500">
                {authError}
              </p>
            )}

            {success && (
              <p
                data-testid="form-success"
                className="text-sm font-medium text-green-600"
              >
                Registration successful
              </p>
            )}

            <Button
              data-testid="register-submit"
              type="submit"
              className="w-full"
            >
              Create Account
            </Button>

            <p className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-600 hover:underline">
                Sign In
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
