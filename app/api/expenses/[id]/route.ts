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

// PATCH /api/expenses/:id
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const expense = await prisma.expense.findUnique({
    where: { id: params.id },
  });

  if (!expense || expense.userId !== session.userId) {
    return NextResponse.json({ error: "Expense not found" }, { status: 404 });
  }

  try {
    const body = await req.json();
    const { title, amount, category, note, spentAt, starred } = body;
    const updateData: Prisma.ExpenseUpdateInput = {};

    if (title !== undefined) {
      if (typeof title !== "string" || title.trim().length === 0) {
        return NextResponse.json({ error: "Title is required" }, { status: 400 });
      }
      if (title.trim().length > 80) {
        return NextResponse.json(
          { error: "Title must be at most 80 characters" },
          { status: 400 }
        );
      }
      updateData.title = title.trim();
    }

    if (amount !== undefined) {
      const amountNum = parseFloat(amount);
      if (isNaN(amountNum) || amountNum <= 0) {
        return NextResponse.json(
          { error: "Amount must be a positive number" },
          { status: 400 }
        );
      }
      updateData.amount = new Prisma.Decimal(amountNum.toFixed(2));
    }

    if (category !== undefined) {
      if (!CATEGORY_ORDER.includes(category as Category)) {
        return NextResponse.json({ error: "Invalid category" }, { status: 400 });
      }
      updateData.category = category as Category;
    }

    if (note !== undefined) {
      updateData.note = note;
    }

    if (spentAt !== undefined) {
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
      updateData.spentAt = spentAtDate;
    }

    if (starred !== undefined) {
      updateData.starred = Boolean(starred);
    }

    // Check duplicate if relevant fields changed
    if (
      updateData.title !== undefined ||
      updateData.amount !== undefined ||
      updateData.spentAt !== undefined
    ) {
      const checkTitle =
        updateData.title !== undefined
          ? (updateData.title as string)
          : expense.title;
      const checkAmount =
        updateData.amount !== undefined
          ? (updateData.amount as Prisma.Decimal)
          : expense.amount;
      const checkDate =
        updateData.spentAt !== undefined
          ? (updateData.spentAt as Date)
          : expense.spentAt;

      const duplicate = await prisma.expense.findFirst({
        where: {
          userId: session.userId,
          title: checkTitle,
          amount: checkAmount,
          spentAt: checkDate,
          NOT: { id: expense.id },
        },
      });
      if (duplicate) {
        return NextResponse.json(
          {
            error:
              "Duplicate expense: an expense with the same title, amount and date already exists",
          },
          { status: 409 }
        );
      }
    }

    const updated = await prisma.expense.update({
      where: { id: params.id },
      data: updateData,
    });

    return NextResponse.json(formatExpense(updated));
  } catch (error) {
    console.error("Update expense error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/expenses/:id
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const expense = await prisma.expense.findUnique({
    where: { id: params.id },
  });

  if (!expense || expense.userId !== session.userId) {
    return NextResponse.json({ error: "Expense not found" }, { status: 404 });
  }

  await prisma.expense.delete({ where: { id: params.id } });

  return NextResponse.json({ success: true });
}
