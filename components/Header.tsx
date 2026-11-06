"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Wallet, LogOut, ArrowRight, User } from "lucide-react";

export default function Header() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  if (loading) {
    return (
      <header className="sticky top-0 z-50 border-b border-white/60 bg-white/70 backdrop-blur-md shadow-sm">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-md animate-pulse" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent">
              ExpenseTrail
            </span>
          </div>
          <div className="h-9 w-32 animate-pulse rounded-lg bg-gray-200" />
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/60 bg-white/75 backdrop-blur-lg shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        {/* 3D Brand Logo */}
        <Link href="/" className="group flex items-center gap-2.5 transition-transform hover:scale-[1.02]">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-blue-500 to-indigo-500 text-white shadow-[0_4px_12px_rgba(37,99,235,0.35)] transition-all group-hover:rotate-3 group-hover:shadow-[0_6px_16px_rgba(37,99,235,0.45)]">
            <Wallet className="h-5 w-5" />
          </div>
          <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
            ExpenseTrail
          </span>
        </Link>

        {/* Navigation Actions */}
        <nav className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/70 py-1 pl-1.5 pr-3 shadow-inner">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white shadow-xs">
                  <User className="h-3.5 w-3.5" />
                </div>
                <span
                  data-testid="user-email"
                  className="text-xs sm:text-sm font-medium text-blue-950"
                >
                  {user.email}
                </span>
              </div>

              <Link
                href="/expenses"
                data-testid="link-expenses"
                className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 transition-colors hover:text-blue-800"
              >
                <span>My Expenses</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Button
                data-testid="btn-logout"
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="gap-1.5 rounded-lg border-gray-200 bg-white/80 font-medium text-gray-700 shadow-xs hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all hover:scale-105"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Logout</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <Button
                data-testid="btn-login"
                variant="ghost"
                size="sm"
                onClick={() => router.push("/login")}
                className="font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50/70"
              >
                Login
              </Button>
              <Button
                data-testid="btn-register"
                size="sm"
                onClick={() => router.push("/register")}
                className="button-3d-primary font-semibold text-white rounded-lg px-4"
              >
                Register
              </Button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
