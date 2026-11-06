import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "ReadLog - Personal Reading Log",
  description: "Track your personal reading sessions, books, and genre insights",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-kem text-muc font-sans selection:bg-sanho/20 selection:text-muc">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
