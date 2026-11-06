"use client";

import Header from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { BookOpen, Compass, Clock, Sparkles, ShieldCheck, BookmarkCheck } from "lucide-react";

const features = [
  {
    icon: <BookOpen className="h-6 w-6 text-amber-800" />,
    tag: "TRACKING",
    title: "Log Every Session",
    description:
      "Capture every book, pages read and duration in minutes with personal reflections and favorite tags.",
  },
  {
    icon: <Compass className="h-6 w-6 text-emerald-800" />,
    tag: "EXPLORATION",
    title: "Sort by Genre",
    description:
      "Organize seamlessly across Fiction, Non-Fiction, Sci-Fi, Biography or Other to balance your reading diet.",
  },
  {
    icon: <Clock className="h-6 w-6 text-stone-800" />,
    tag: "INSIGHTS",
    title: "See Minutes Read",
    description:
      "Live analytics break down your total reading volume by genre, giving you clear insights into your habits.",
  },
];

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-amber-950 relative overflow-hidden flex flex-col font-sans">
      <Header />

      {/* Warm Ambient Floating Spheres */}
      <div className="pointer-events-none absolute -top-32 left-1/4 h-[32rem] w-[32rem] rounded-full bg-amber-200/35 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 -right-24 h-[28rem] w-[28rem] rounded-full bg-emerald-100/40 blur-3xl" />

      <main className="container mx-auto px-4 py-16 sm:py-24 relative z-10 flex-1 flex flex-col justify-center">
        {/* Hero Section */}
        <div className="mx-auto max-w-3xl text-center">
          {/* Editorial Tag */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-900/10 bg-white/80 px-4 py-1.5 shadow-[0_4px_16px_rgba(180,83,9,0.08)] backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-amber-700" />
            <span className="text-[11px] font-bold tracking-[0.2em] text-amber-900 uppercase">
              Mindful Reading Journal
            </span>
          </div>

          {/* Exact data-testid for Home Title */}
          <h1
            data-testid="home-title"
            className="mb-6 text-5xl sm:text-7xl font-serif font-black tracking-tight text-amber-950"
          >
            ReadLog
          </h1>

          <p className="mb-10 text-lg sm:text-xl font-normal leading-relaxed text-amber-900/80 max-w-2xl mx-auto">
            Your personal reading companion. Track every session, discover patterns across genres, and cultivate a deeper reading habit.
          </p>

          {/* Warm Editorial Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button
              size="lg"
              onClick={() => router.push("/register")}
              className="bg-amber-900 hover:bg-amber-950 text-amber-50 font-semibold text-base px-8 py-6 rounded-full shadow-[0_10px_25px_rgba(120,53,15,0.25)] transition-all hover:-translate-y-0.5 cursor-pointer"
            >
              Start Your Log
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => router.push("/login")}
              className="bg-white/70 hover:bg-white text-amber-950 font-semibold text-base px-8 py-6 rounded-full border border-amber-900/15 shadow-sm transition-all hover:-translate-y-0.5 cursor-pointer"
            >
              Sign In
            </Button>
          </div>

          {/* Features Highlights */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-amber-900/60">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-700" />
              <span>HttpOnly JWT Security</span>
            </div>
            <div className="flex items-center gap-1.5">
              <BookmarkCheck className="h-4 w-4 text-amber-700" />
              <span>Real-time Genre Metrics</span>
            </div>
          </div>
        </div>

        {/* 3 Feature Cards */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto w-full">
          {features.map((f, i) => (
            <Card
              key={i}
              className="group relative rounded-3xl border border-white/80 bg-white/60 p-6 shadow-[0_12px_36px_rgba(44,36,25,0.04)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(44,36,25,0.08)]"
            >
              <CardContent className="p-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100/70 border border-amber-200/50 shadow-xs mb-5">
                  {f.icon}
                </div>
                <span className="text-[10px] font-bold tracking-[0.2em] text-amber-800/70 uppercase block mb-1">
                  {f.tag}
                </span>
                <h3 className="text-xl font-serif font-bold text-amber-950 mb-2">
                  {f.title}
                </h3>
                <p className="text-sm leading-relaxed text-amber-900/70 font-normal">
                  {f.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
