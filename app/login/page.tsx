"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";

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
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Sign In</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            data-testid="login-form"
            noValidate
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                data-testid="login-email"
                type="email"
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
                placeholder="you@example.com"
              />
              {errors.email && (
                <p
                  data-testid="error-email"
                  className="text-sm text-red-500"
                >
                  {errors.email}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                data-testid="login-password"
                type="password"
                value={password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                placeholder="••••••"
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

            {authError && (
              <p data-testid="error-auth" className="text-sm text-red-500">
                {authError}
              </p>
            )}

            <Button
              data-testid="login-submit"
              type="submit"
              className="w-full"
            >
              Sign In
            </Button>

            <p className="text-center text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-blue-600 hover:underline">
                Register
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
