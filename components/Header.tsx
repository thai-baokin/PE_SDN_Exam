"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

export default function Header() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  if (loading) {
    return (
      <header className="border-b bg-white shadow-sm">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <Link href="/" className="text-xl font-bold text-blue-600">
            ExpenseTrail
          </Link>
          <div className="h-10 w-32 animate-pulse rounded bg-gray-200" />
        </div>
      </header>
    );
  }

  return (
    <header className="border-b bg-white shadow-sm">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/" className="text-xl font-bold text-blue-600">
          ExpenseTrail
        </Link>
        <nav className="flex items-center gap-3">
          {user ? (
            <>
              <span
                data-testid="user-email"
                className="text-sm text-gray-700"
              >
                {user.email}
              </span>
              <Link
                href="/expenses"
                data-testid="link-expenses"
                className="text-sm text-blue-600 hover:underline"
              >
                My Expenses
              </Link>
              <Button
                data-testid="btn-logout"
                variant="outline"
                size="sm"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                data-testid="btn-login"
                variant="ghost"
                size="sm"
                onClick={() => router.push("/login")}
              >
                Login
              </Button>
              <Button
                data-testid="btn-register"
                size="sm"
                onClick={() => router.push("/register")}
              >
                Register
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
