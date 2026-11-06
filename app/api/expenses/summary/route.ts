import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

const CATEGORY_ORDER = ["Food", "Transport", "Bills", "Shopping", "Other"] as const;
type Category = typeof CATEGORY_ORDER[number];

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category") || undefined;
  const starred = searchParams.get("starred") || undefined;
  const q = searchParams.get("q") || undefined;

  const where: Prisma.ExpenseWhereInput = { userId: session.userId };

  if (category && CATEGORY_ORDER.includes(category as Category)) {
    where.category = category as Category;
  }
  if (starred === "true") {
    where.starred = true;
  }
  if (q) {
    const qt = q.trim();
    if (qt) {
      where.OR = [
        { title: { contains: qt, mode: "insensitive" } },
        { note: { contains: qt, mode: "insensitive" } },
      ];
    }
  }

  const expenses = await prisma.expense.findMany({ where });

  const totalAmount = expenses.reduce(
    (sum, e) => sum + parseFloat(e.amount.toString()),
    0
  );
  const starredCount = expenses.filter((e) => e.starred).length;

  // Build breakdown
  const categoryMap = new Map<Category, { count: number; total: number }>();
  for (const e of expenses) {
    const cat = e.category as Category;
    const existing = categoryMap.get(cat) || { count: 0, total: 0 };
    categoryMap.set(cat, {
      count: existing.count + 1,
      total: existing.total + parseFloat(e.amount.toString()),
    });
  }

  const breakdown = Array.from(categoryMap.entries())
    .map(([cat, data]) => ({
      category: cat,
      count: data.count,
      total: data.total,
    }))
    .sort((a, b) => {
      if (b.total !== a.total) return b.total - a.total;
      return CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category);
    });

  return NextResponse.json({
    count: expenses.length,
    starredCount,
    totalAmount,
    breakdown,
  });
}
