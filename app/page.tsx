"use client";

import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { TrendingUp, Tag, PieChart, Sparkles, ShieldCheck, Zap } from "lucide-react";

const features = [
  {
    icon: <TrendingUp className="h-7 w-7 text-blue-600" />,
    gradient: "from-blue-500/15 via-blue-400/10 to-transparent",
    iconBg: "bg-gradient-to-tr from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/30",
    title: "Track Spending",
    description:
      "Log every expense with title, amount, category and date. Never lose track of where your money goes.",
  },
  {
    icon: <Tag className="h-7 w-7 text-emerald-600" />,
    gradient: "from-emerald-500/15 via-emerald-400/10 to-transparent",
    iconBg: "bg-gradient-to-tr from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/30",
    title: "Sort into Categories",
    description:
      "Organize expenses by Food, Transport, Bills, Shopping or Other — filter and search with ease.",
  },
  {
    icon: <PieChart className="h-7 w-7 text-purple-600" />,
    gradient: "from-purple-500/15 via-purple-400/10 to-transparent",
    iconBg: "bg-gradient-to-tr from-purple-500 to-pink-600 text-white shadow-md shadow-purple-500/30",
    title: "See Where It Goes",
    description:
      "Live summary shows totals by category so you always know your spending breakdown at a glance.",
  },
];

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-mesh-gradient relative overflow-hidden flex flex-col">
      <Header />

      {/* 3D Decorative Floating Ambient Spheres */}
      <div className="pointer-events-none absolute -top-24 left-1/4 h-96 w-96 rounded-full bg-blue-400/15 blur-3xl animate-float-slow" />
      <div className="pointer-events-none absolute top-1/3 -right-24 h-96 w-96 rounded-full bg-purple-400/15 blur-3xl animate-float-slow" style={{ animationDelay: "-3s" }} />

      <main className="container mx-auto px-4 py-16 sm:py-24 relative z-10 flex-1 flex flex-col justify-center">
        {/* Hero Section */}
        <div className="mx-auto max-w-3xl text-center">
          {/* 3D Floating Pill Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-white/80 px-4 py-1.5 shadow-[0_4px_16px_rgba(59,130,246,0.12)] backdrop-blur-md transition-transform hover:scale-105">
            <Sparkles className="h-4 w-4 text-blue-600" />
            <span className="text-xs font-semibold tracking-wide text-blue-900 uppercase">
              Smart Personal Budgeting
            </span>
          </div>

          {/* Exact data-testid for Home Title */}
          <h1
            data-testid="home-title"
            className="mb-6 text-5xl sm:text-6xl font-black tracking-tight text-gray-900 drop-shadow-xs"
          >
            ExpenseTrail
          </h1>

          <p className="mb-10 text-lg sm:text-xl font-normal leading-relaxed text-gray-600 max-w-2xl mx-auto">
            Your personal finance companion. Track spending, stay organised and
            always know where your money goes.
          </p>

          {/* 3D Interactive Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button
              size="lg"
              onClick={() => router.push("/register")}
              className="button-3d-primary font-bold text-base px-8 py-6 rounded-xl shadow-lg cursor-pointer"
            >
              Get Started
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => router.push("/login")}
              className="glass-panel font-semibold text-base text-gray-800 px-8 py-6 rounded-xl border-white/80 shadow-md hover:bg-white hover:shadow-lg transition-all hover:-translate-y-0.5 cursor-pointer"
            >
              Sign In
            </Button>
          </div>

          {/* Trust Highlights */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-gray-500">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>HttpOnly JWT Security</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-amber-500" />
              <span>Real-time Category Analytics</span>
            </div>
          </div>
        </div>

        {/* 3D Feature Cards Grid */}
        <div className="mt-20 grid gap-8 sm:grid-cols-3 max-w-5xl mx-auto w-full">
          {features.map((f) => (
            <Card
              key={f.title}
              className="card-3d glass-panel relative overflow-hidden rounded-2xl border-white/70 p-2"
            >
              <div className={`absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br ${f.gradient} blur-xl`} />
              
              <CardHeader className="items-center text-center pb-2 pt-6">
                <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${f.iconBg} transform transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                  {f.icon}
                </div>
                <CardTitle className="text-xl font-bold text-gray-900 tracking-tight">
                  {f.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center text-sm leading-relaxed text-gray-600 pb-6 px-4">
                {f.description}
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
