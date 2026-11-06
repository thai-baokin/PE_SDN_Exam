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

function buildWhereClause(
  userId: string,
  params: { genre?: string; favorite?: string; q?: string }
) {
  const where: Prisma.ReadingLogWhereInput = { userId };

  if (params.genre && GENRE_ORDER.includes(params.genre as GenreType)) {
    where.genre = toPrismaGenre(params.genre);
  }

  if (params.favorite === "true") {
    where.favorite = true;
  }

  if (params.q) {
    const q = params.q.trim();
    if (q) {
      where.OR = [
        { bookTitle: { contains: q, mode: "insensitive" } },
        { note: { contains: q, mode: "insensitive" } },
      ];
    }
  }

  return where;
}

// GET /api/reading-logs
export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const genre = searchParams.get("genre") || undefined;
  const favorite = searchParams.get("favorite") || undefined;
  const q = searchParams.get("q") || undefined;

  const where = buildWhereClause(session.userId, { genre, favorite, q });

  const logs = await prisma.readingLog.findMany({
    where,
    orderBy: [
      { readOn: "desc" },
      { bookTitle: "asc" },
    ],
  });

  // Strict case-insensitive alphabetical tie-breaker on bookTitle
  logs.sort((a, b) => {
    const dateA = a.readOn.toISOString().split("T")[0];
    const dateB = b.readOn.toISOString().split("T")[0];
    if (dateA !== dateB) {
      return dateB.localeCompare(dateA);
    }
    return a.bookTitle.localeCompare(b.bookTitle, undefined, { sensitivity: "base" });
  });

  return NextResponse.json(logs.map(formatReadingLog));
}

// POST /api/reading-logs
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { bookTitle, minutesRead, genre, note, readOn } = body;

    // Validation
    if (!bookTitle || typeof bookTitle !== "string" || bookTitle.trim().length === 0) {
      return NextResponse.json({ error: "Book title is required" }, { status: 400 });
    }
    if (bookTitle.trim().length > 80) {
      return NextResponse.json(
        { error: "Book title must be at most 80 characters" },
        { status: 400 }
      );
    }

    if (minutesRead === undefined || minutesRead === null || minutesRead === "") {
      return NextResponse.json({ error: "Minutes read is required" }, { status: 400 });
    }
    const mins = Number(minutesRead);
    if (!Number.isInteger(mins) || mins <= 0) {
      return NextResponse.json(
        { error: "Minutes read must be a positive number" },
        { status: 400 }
      );
    }

    if (!genre) {
      return NextResponse.json(
        { error: "Please choose a genre" },
        { status: 400 }
      );
    }
    if (!GENRE_ORDER.includes(genre as GenreType)) {
      return NextResponse.json({ error: "Invalid genre" }, { status: 400 });
    }

    if (!readOn) {
      return NextResponse.json({ error: "Date is required" }, { status: 400 });
    }
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

    // Duplicate check: same bookTitle, minutesRead, and readOn for this user
    const existing = await prisma.readingLog.findFirst({
      where: {
        userId: session.userId,
        bookTitle: bookTitle.trim(),
        minutesRead: mins,
        readOn: readOnDate,
      },
    });

    if (existing) {
      return NextResponse.json(
        {
          error:
            "Duplicate reading session: a reading session with the same book title, minutes and date already exists",
        },
        { status: 409 }
      );
    }

    const created = await prisma.readingLog.create({
      data: {
        userId: session.userId,
        bookTitle: bookTitle.trim(),
        minutesRead: mins,
        genre: toPrismaGenre(genre),
        note: note || "",
        readOn: readOnDate,
      },
    });

    return NextResponse.json(formatReadingLog(created), { status: 201 });
  } catch (error) {
    console.error("Create reading log error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
