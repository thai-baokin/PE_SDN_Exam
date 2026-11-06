"use client";

import Header from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { BookOpen, Compass, Clock, ArrowUpRight } from "lucide-react";

const features = [
  {
    icon: <BookOpen className="h-5 w-5 text-muc" />,
    number: "01",
    title: "Log every session",
    description:
      "Capture which book you read, minutes spent, genre, personal reflection notes, and favorite highlights.",
  },
  {
    icon: <Compass className="h-5 w-5 text-sanho" />,
    number: "02",
    title: "Sort by genre",
    description:
      "Easily organize across Fiction, Non-Fiction, Sci-Fi, Biography or Other to observe your reading variety.",
  },
  {
    icon: <Clock className="h-5 w-5 text-muc" />,
    number: "03",
    title: "See minutes read",
    description:
      "A live summary breaks down total volume and minutes per genre, providing immediate clarity on your progress.",
  },
];

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-kem text-muc flex flex-col font-sans selection:bg-sanho/20">
      <Header />

      <main className="container mx-auto px-4 sm:px-8 py-12 sm:py-20 flex-1 flex flex-col justify-center max-w-6xl">
        {/* Editorial Hero */}
        <div className="max-w-3xl mx-auto text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-pill border border-muc/15 bg-nga px-3.5 py-1 shadow-subtle">
            <span className="h-1.5 w-1.5 rounded-full bg-sanho" />
            <span className="text-[11px] font-bold tracking-[0.18em] text-muc uppercase">
              Mindful Reading Journal
            </span>
          </div>

          <h1
            data-testid="home-title"
            className="mb-6 text-6xl sm:text-7xl md:text-8xl font-serif font-black tracking-tight text-muc leading-[0.95]"
          >
            ReadLog
          </h1>

          <p className="mb-10 text-base sm:text-lg font-normal leading-relaxed text-muc/75 max-w-xl mx-auto">
            A quiet sanctuary for your personal reading journey. Track time spent between the pages, explore genres, and nurture thoughtful reading habits.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3.5">
            <Button
              size="lg"
              onClick={() => router.push("/register")}
              className="btn-pill-dark px-8 py-6 text-sm font-semibold cursor-pointer shadow-subtle group gap-2"
            >
              <span>Start Your Log</span>
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => router.push("/login")}
              className="btn-pill-outline px-8 py-6 text-sm font-semibold cursor-pointer bg-nga/50 hover:bg-nga"
            >
              Sign In
            </Button>
          </div>
        </div>

        {/* 3 Shelf Cards */}
        <div className="mt-16 sm:mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {features.map((f, i) => (
            <Card
              key={i}
              className={`card-editorial p-7 relative ${
                i === 1 ? "md:-translate-y-2 border-sanho/30 shadow-glass" : ""
              }`}
            >
              <CardContent className="p-0">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-kem border border-muc/10">
                    {f.icon}
                  </div>
                  <span className="text-xs font-serif font-bold text-muc/35 tracking-widest">
                    {f.number}
                  </span>
                </div>
                <h3 className="text-xl font-serif font-bold text-muc mb-2.5">
                  {f.title}
                </h3>
                <p className="text-xs sm:text-sm leading-relaxed text-muc/70 font-normal">
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
