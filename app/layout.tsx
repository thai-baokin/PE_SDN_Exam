import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "ReadLog - Frosted Glass Reading Dashboard",
  description: "Track your personal reading sessions with Flix.id frosted glassmorphism",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen text-flix-dark font-sans relative selection:bg-flix-dark/15 selection:text-flix-dark">
        {/* Fixed Ambient Glass Depth Blobs */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute -top-32 -left-32 w-[34rem] h-[34rem] rounded-full bg-[#6C8FB3]/40 blur-[100px]" />
          <div className="absolute top-1/3 -right-24 w-[36rem] h-[36rem] rounded-full bg-[#C9B7A6]/45 blur-[120px]" />
          <div className="absolute -bottom-32 left-1/4 w-[38rem] h-[38rem] rounded-full bg-[#6C8FB3]/35 blur-[110px]" />
        </div>

        <div className="relative z-10 min-h-screen flex flex-col">
          <AuthProvider>{children}</AuthProvider>
        </div>
      </body>
    </html>
  );
}
