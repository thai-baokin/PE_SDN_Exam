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
      <header className="sticky top-0 z-50 border-b border-muc/10 bg-nga/80 backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-between px-4 sm:px-8 py-3.5">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-full bg-muc/10 animate-pulse" />
            <span className="text-xl font-serif font-bold text-muc">ReadLog</span>
          </div>
          <div className="h-8 w-28 rounded-pill bg-muc/10 animate-pulse" />
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 border-b border-muc/10 bg-nga/85 backdrop-blur-md shadow-subtle">
      <div className="container mx-auto flex items-center justify-between px-4 sm:px-8 py-3.5">
        {/* Editorial Logo */}
        <Link href="/" className="group flex items-center gap-2.5 transition-transform hover:scale-[1.02]">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muc text-nga shadow-xs transition-colors group-hover:bg-sanho">
            <BookOpen className="h-4 w-4" />
          </div>
          <span className="text-xl font-serif font-black tracking-tight text-muc">
            ReadLog
          </span>
        </Link>

        {/* Navigation Actions */}
        <nav className="flex items-center gap-2 sm:gap-3">
          {user ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-1.5 rounded-pill border border-muc/15 bg-kem/60 py-1 px-2.5">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-muc text-nga shrink-0">
                  <User className="h-2.5 w-2.5" />
                </div>
                <span
                  data-testid="user-email"
                  className="text-xs font-medium text-muc max-w-[120px] sm:max-w-[200px] truncate"
                >
                  {user.email}
                </span>
              </div>

              <Link
                href="/reading-logs"
                data-testid="link-reading-logs"
                className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-muc hover:text-sanho transition-colors"
              >
                <span>Reading Logs</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>

              <Button
                data-testid="btn-logout"
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="btn-pill-outline gap-1.5 text-xs px-3.5 py-1.5 h-auto cursor-pointer"
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
                className="btn-pill-outline text-xs px-4 py-2 h-auto cursor-pointer border-transparent hover:border-muc/20"
              >
                Login
              </Button>
              <Button
                data-testid="btn-register"
                size="sm"
                onClick={() => router.push("/register")}
                className="btn-pill-dark text-xs px-4 py-2 h-auto cursor-pointer"
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
