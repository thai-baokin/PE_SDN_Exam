"use client";

import Header from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { BookOpen, Compass, Clock, ArrowUpRight, Sparkles } from "lucide-react";

const features = [
  {
    icon: <BookOpen className="h-6 w-6 text-white" />,
    iconBg: "bg-gradient-to-tr from-[#1E3F8F] to-[#3B6FD8]",
    title: "Log every session",
    description:
      "Capture which book you read, minutes spent, genre, personal reflection notes, and favorite highlights.",
  },
  {
    icon: <Compass className="h-6 w-6 text-white" />,
    iconBg: "bg-gradient-to-tr from-[#C8641E] to-[#F2994A]",
    title: "Sort by genre",
    description:
      "Easily organize across Fiction, Non-Fiction, Sci-Fi, Biography or Other to observe your reading variety.",
  },
  {
    icon: <Clock className="h-6 w-6 text-white" />,
    iconBg: "bg-gradient-to-tr from-[#3A2A8C] to-[#7B5CE0]",
    title: "See minutes read",
    description:
      "A live summary breaks down total volume and minutes per genre, providing immediate clarity on your progress.",
  },
];

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="py-6 sm:py-10 px-3 sm:px-6 max-w-7xl mx-auto w-full flex-1 flex flex-col justify-center">
      {/* Large Flix.id Frosted Glass Frame */}
      <div className="flix-frame overflow-hidden flex flex-col">
        <Header />

        <main className="p-6 sm:p-10 md:p-14 flex-1 flex flex-col justify-center">
          {/* Top Cinema-Style Colored Banner */}
          <div className="rounded-[28px] genre-fiction p-8 sm:p-12 text-white relative overflow-hidden shadow-flix mb-10">
            {/* Subtle decorative circle in banner */}
            <div className="pointer-events-none absolute -right-12 -top-12 w-64 h-64 rounded-full bg-white/10 blur-2xl" />
            
            <div className="max-w-2xl relative z-10">
              <div className="inline-flex items-center gap-2 rounded-pill bg-white/20 backdrop-blur-md px-3.5 py-1 text-xs font-bold uppercase tracking-wider mb-4 border border-white/30">
                <Sparkles className="h-3.5 w-3.5 text-flix-star" />
                <span>Cinematic Reading Dashboard</span>
              </div>

              <h1
                data-testid="home-title"
                className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight mb-5 leading-[0.95]"
              >
                ReadLog
              </h1>

              <p className="text-base sm:text-lg text-white/85 font-normal leading-relaxed mb-8 max-w-xl">
                Track personal reading sessions, discover balanced genres, and visualize your progress with a modern frosted glass interface.
              </p>

              <div className="flex flex-wrap items-center gap-3.5">
                <Button
                  size="lg"
                  onClick={() => router.push("/register")}
                  className="btn-flix-white px-8 py-6 text-sm font-bold cursor-pointer group gap-2"
                >
                  <span>Start Reading Log</span>
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => router.push("/login")}
                  className="rounded-pill bg-white/20 hover:bg-white/30 text-white font-bold text-sm px-8 py-6 border border-white/40 cursor-pointer backdrop-blur-md"
                >
                  Sign In
                </Button>
              </div>
            </div>
          </div>

          {/* 3 Feature Frosted Glass Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <Card
                key={i}
                className="flix-card rounded-[24px] p-7 transition-all duration-200 hover:-translate-y-1 hover:shadow-flix"
              >
                <CardContent className="p-0">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-subtle mb-6 ${f.iconBg}`}>
                    {f.icon}
                  </div>
                  <h3 className="text-xl font-bold text-flix-dark mb-2.5">
                    {f.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-flix-dark/75 font-normal">
                    {f.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
