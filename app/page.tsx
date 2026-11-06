"use client";

import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { TrendingUp, Tag, PieChart } from "lucide-react";

const features = [
  {
    icon: <TrendingUp className="h-6 w-6 text-blue-500" />,
    title: "Track Spending",
    description:
      "Log every expense with title, amount, category and date. Never lose track of where your money goes.",
  },
  {
    icon: <Tag className="h-6 w-6 text-green-500" />,
    title: "Sort into Categories",
    description:
      "Organize expenses by Food, Transport, Bills, Shopping or Other — filter and search with ease.",
  },
  {
    icon: <PieChart className="h-6 w-6 text-purple-500" />,
    title: "See Where It Goes",
    description:
      "Live summary shows totals by category so you always know your spending breakdown at a glance.",
  },
];

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1
            data-testid="home-title"
            className="mb-4 text-5xl font-extrabold text-gray-900"
          >
            ExpenseTrail
          </h1>
          <p className="mb-8 text-xl text-gray-600">
            Your personal finance companion. Track spending, stay organised and
            always know where your money goes.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" onClick={() => router.push("/register")}>
              Get Started
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => router.push("/login")}
            >
              Sign In
            </Button>
          </div>
        </div>

        <div className="mt-20 grid gap-8 sm:grid-cols-3">
          {features.map((f) => (
            <Card
              key={f.title}
              className="transition-shadow hover:shadow-md"
            >
              <CardHeader className="items-center text-center">
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                  {f.icon}
                </div>
                <CardTitle className="text-lg">{f.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-sm text-gray-600">
                {f.description}
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
