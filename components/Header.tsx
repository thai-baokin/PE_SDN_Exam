"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { BookOpen, LogOut, ArrowRight, User } from "lucide-react";

export default function Header() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  if (loading) {
    return (
      <header className="sticky top-0 z-50 border-b border-amber-900/10 bg-amber-50/70 backdrop-blur-md shadow-xs">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-amber-700 to-amber-900 shadow-md animate-pulse" />
            <span className="text-xl font-bold text-amber-950">
              ReadLog
            </span>
          </div>
          <div className="h-9 w-32 animate-pulse rounded-lg bg-amber-200/50" />
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 border-b border-amber-950/10 bg-[#FAF7F2]/80 backdrop-blur-lg shadow-[0_4px_24px_rgba(44,36,25,0.04)]">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        {/* Editorial Brand Logo */}
        <Link href="/" className="group flex items-center gap-2.5 transition-transform hover:scale-[1.02]">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-800 via-amber-700 to-amber-600 text-amber-50 shadow-[0_4px_14px_rgba(180,83,9,0.25)] transition-all group-hover:rotate-3 group-hover:shadow-[0_6px_20px_rgba(180,83,9,0.35)]">
            <BookOpen className="h-5 w-5" />
          </div>
          <span className="text-xl font-serif font-black tracking-tight text-amber-950">
            ReadLog
          </span>
        </Link>

        {/* Navigation Actions */}
        <nav className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-full border border-amber-200/70 bg-amber-100/40 py-1 pl-1.5 pr-3 shadow-inner">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-800 text-white shadow-xs">
                  <User className="h-3.5 w-3.5" />
                </div>
                <span
                  data-testid="user-email"
                  className="text-xs sm:text-sm font-medium text-amber-950"
                >
                  {user.email}
                </span>
              </div>

              <Link
                href="/reading-logs"
                data-testid="link-reading-logs"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-900 transition-colors hover:text-amber-700"
              >
                <span>My Reading Logs</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Button
                data-testid="btn-logout"
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="gap-1.5 rounded-lg border-amber-300/80 bg-white/80 font-medium text-amber-950 shadow-xs hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 transition-all hover:scale-105 cursor-pointer"
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
                className="font-medium text-amber-950 hover:text-amber-800 hover:bg-amber-100/60 cursor-pointer"
              >
                Login
              </Button>
              <Button
                data-testid="btn-register"
                size="sm"
                onClick={() => router.push("/register")}
                className="bg-amber-800 hover:bg-amber-900 font-semibold text-white rounded-lg px-4 shadow-md transition-all hover:scale-105 cursor-pointer"
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
