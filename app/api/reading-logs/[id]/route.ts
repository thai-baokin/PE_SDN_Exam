import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import {
  GENRE_ORDER,
  GenreType,
  toPrismaGenre,
  formatReadingLog,
} from "@/lib/reading-log-helpers";

// PATCH /api/reading-logs/:id
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const log = await prisma.readingLog.findUnique({
    where: { id: params.id },
  });

  if (!log || log.userId !== session.userId) {
    return NextResponse.json({ error: "Reading log not found" }, { status: 404 });
  }

  try {
    const body = await req.json();
    const { bookTitle, minutesRead, genre, note, readOn, favorite } = body;
    const updateData: Prisma.ReadingLogUpdateInput = {};

    if (bookTitle !== undefined) {
      if (typeof bookTitle !== "string" || bookTitle.trim().length === 0) {
        return NextResponse.json({ error: "Book title is required" }, { status: 400 });
      }
      if (bookTitle.trim().length > 80) {
        return NextResponse.json(
          { error: "Book title must be at most 80 characters" },
          { status: 400 }
        );
      }
      updateData.bookTitle = bookTitle.trim();
    }

    if (minutesRead !== undefined) {
      const mins = Number(minutesRead);
      if (!Number.isInteger(mins) || mins <= 0) {
        return NextResponse.json(
          { error: "Minutes read must be a positive number" },
          { status: 400 }
        );
      }
      updateData.minutesRead = mins;
    }

    if (genre !== undefined) {
      if (!GENRE_ORDER.includes(genre as GenreType)) {
        return NextResponse.json({ error: "Invalid genre" }, { status: 400 });
      }
      updateData.genre = toPrismaGenre(genre);
    }

    if (note !== undefined) {
      updateData.note = typeof note === "string" ? note : "";
    }

    if (readOn !== undefined) {
      const readOnDate = new Date(readOn);
      if (isNaN(readOnDate.getTime())) {
        return NextResponse.json({ error: "Date is required" }, { status: 400 });
      }
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      if (readOnDate > today) {
        return NextResponse.json(
          { error: "Date cannot be in the future" },
          { status: 400 }
        );
      }
      updateData.readOn = readOnDate;
    }

    if (favorite !== undefined) {
      updateData.favorite = Boolean(favorite);
    }

    // Check duplicate if any of bookTitle, minutesRead or readOn is changed
    if (
      updateData.bookTitle !== undefined ||
      updateData.minutesRead !== undefined ||
      updateData.readOn !== undefined
    ) {
      const checkTitle =
        updateData.bookTitle !== undefined
          ? (updateData.bookTitle as string)
          : log.bookTitle;
      const checkMins =
        updateData.minutesRead !== undefined
          ? (updateData.minutesRead as number)
          : log.minutesRead;
      const checkDate =
        updateData.readOn !== undefined
          ? (updateData.readOn as Date)
          : log.readOn;

      const duplicate = await prisma.readingLog.findFirst({
        where: {
          userId: session.userId,
          bookTitle: checkTitle,
          minutesRead: checkMins,
          readOn: checkDate,
          NOT: { id: log.id },
        },
      });

      if (duplicate) {
        return NextResponse.json(
          {
            error:
              "Duplicate reading session: a reading session with the same book title, minutes and date already exists",
          },
          { status: 409 }
        );
      }
    }

    const updated = await prisma.readingLog.update({
      where: { id: params.id },
      data: updateData,
    });

    return NextResponse.json(formatReadingLog(updated));
  } catch (error) {
    console.error("Update reading log error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/reading-logs/:id
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const log = await prisma.readingLog.findUnique({
    where: { id: params.id },
  });

  if (!log || log.userId !== session.userId) {
    return NextResponse.json({ error: "Reading log not found" }, { status: 404 });
  }

  await prisma.readingLog.delete({ where: { id: params.id } });

  return NextResponse.json({ success: true });
}
