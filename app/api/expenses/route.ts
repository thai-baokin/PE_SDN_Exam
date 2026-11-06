import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

const CATEGORY_ORDER = ["Food", "Transport", "Bills", "Shopping", "Other"] as const;
type Category = typeof CATEGORY_ORDER[number];

function formatExpense(expense: {
  id: string;
  title: string;
  amount: Prisma.Decimal;
  category: string;
  note: string;
  starred: boolean;
  spentAt: Date;
  createdAt: Date;
}) {
  return {
    id: expense.id,
    title: expense.title,
    amount: parseFloat(expense.amount.toString()),
    category: expense.category,
    note: expense.note,
    starred: expense.starred,
    spentAt: expense.spentAt.toISOString().split("T")[0],
    createdAt: expense.createdAt.toISOString(),
  };
}

function buildWhereClause(
  userId: string,
  params: { category?: string; starred?: string; q?: string }
) {
  const where: Prisma.ExpenseWhereInput = { userId };

  if (params.category && CATEGORY_ORDER.includes(params.category as Category)) {
    where.category = params.category as Category;
  }

  if (params.starred === "true") {
    where.starred = true;
  }

  if (params.q) {
    const q = params.q.trim();
    if (q) {
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { note: { contains: q, mode: "insensitive" } },
      ];
    }
  }

  return where;
}

// GET /api/expenses
export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category") || undefined;
  const starred = searchParams.get("starred") || undefined;
  const q = searchParams.get("q") || undefined;

  const where = buildWhereClause(session.userId, { category, starred, q });

  const expenses = await prisma.expense.findMany({
    where,
    orderBy: [
      { spentAt: "desc" },
      { title: "asc" },
    ],
  });

  return NextResponse.json(expenses.map(formatExpense));
}

// POST /api/expenses
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, amount, category, note, spentAt } = body;

    // Validation
    if (!title || typeof title !== "string" || title.trim().length === 0) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }
    if (title.trim().length > 80) {
      return NextResponse.json(
        { error: "Title must be at most 80 characters" },
        { status: 400 }
      );
    }
    if (amount === undefined || amount === null || amount === "") {
      return NextResponse.json({ error: "Amount is required" }, { status: 400 });
    }
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      return NextResponse.json(
        { error: "Amount must be a positive number" },
        { status: 400 }
      );
    }
    if (!category) {
      return NextResponse.json(
        { error: "Please choose a category" },
        { status: 400 }
      );
    }
    if (!CATEGORY_ORDER.includes(category as Category)) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }
    if (!spentAt) {
      return NextResponse.json({ error: "Date is required" }, { status: 400 });
    }
    const spentAtDate = new Date(spentAt);
    if (isNaN(spentAtDate.getTime())) {
      return NextResponse.json({ error: "Date is required" }, { status: 400 });
    }
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    if (spentAtDate > today) {
      return NextResponse.json(
        { error: "Date cannot be in the future" },
        { status: 400 }
      );
    }

    // Check duplicate
    const existing = await prisma.expense.findFirst({
      where: {
        userId: session.userId,
        title: title.trim(),
        amount: new Prisma.Decimal(amountNum.toFixed(2)),
        spentAt: spentAtDate,
      },
    });
    if (existing) {
      return NextResponse.json(
        {
          error:
            "Duplicate expense: an expense with the same title, amount and date already exists",
        },
        { status: 409 }
      );
    }

    const expense = await prisma.expense.create({
      data: {
        userId: session.userId,
        title: title.trim(),
        amount: new Prisma.Decimal(amountNum.toFixed(2)),
        category: category as Category,
        note: note || "",
        spentAt: spentAtDate,
      },
    });

    return NextResponse.json(formatExpense(expense), { status: 201 });
  } catch (error) {
    console.error("Create expense error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
