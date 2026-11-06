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
      <header className="py-4 px-4 sm:px-8 border-b border-white/30 bg-white/20 backdrop-blur-md">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-full bg-white/40 animate-pulse" />
            <span className="text-xl font-bold text-flix-dark">ReadLog</span>
          </div>
          <div className="h-8 w-28 rounded-pill bg-white/40 animate-pulse" />
        </div>
      </header>
    );
  }

  return (
    <header className="py-4 px-4 sm:px-8 border-b border-white/40 bg-white/25 backdrop-blur-md">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Flix.id Brand Logo */}
        <Link href="/" className="group flex items-center gap-2.5 transition-transform hover:scale-[1.02]">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-flix-dark text-white shadow-subtle transition-all group-hover:rotate-6">
            <BookOpen className="h-5 w-5" />
          </div>
          <span className="text-2xl font-black tracking-tight text-flix-dark">
            ReadLog
          </span>
        </Link>

        {/* Navigation Action Pills */}
        <nav className="flex items-center gap-2 sm:gap-3">
          {user ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-2 rounded-pill border border-white/60 bg-white/50 py-1 px-3 backdrop-blur-sm shadow-subtle">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-flix-dark text-white shrink-0">
                  <User className="h-3 w-3" />
                </div>
                <span
                  data-testid="user-email"
                  className="text-xs font-semibold text-flix-dark max-w-[130px] sm:max-w-[220px] truncate"
                >
                  {user.email}
                </span>
              </div>

              <Link
                href="/reading-logs"
                data-testid="link-reading-logs"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-flix-dark hover:text-blue-900 transition-colors px-3 py-1.5 rounded-pill hover:bg-white/40"
              >
                <span>Reading Logs</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>

              <Button
                data-testid="btn-logout"
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="btn-flix-dark gap-1.5 text-xs px-4 py-2 h-auto cursor-pointer border-0"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Logout</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                data-testid="btn-login"
                variant="ghost"
                size="sm"
                onClick={() => router.push("/login")}
                className="flix-glass-pill text-xs font-bold px-5 py-2 h-auto cursor-pointer rounded-pill text-flix-dark border-white/60"
              >
                Login
              </Button>
              <Button
                data-testid="btn-register"
                size="sm"
                onClick={() => router.push("/register")}
                className="btn-flix-dark text-xs px-5 py-2 h-auto cursor-pointer shadow-subtle"
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
