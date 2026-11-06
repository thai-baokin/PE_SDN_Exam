import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import {
  GENRE_ORDER,
  GenreType,
  toPrismaGenre,
  fromPrismaGenre,
} from "@/lib/reading-log-helpers";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const genre = searchParams.get("genre") || undefined;
  const favorite = searchParams.get("favorite") || undefined;
  const q = searchParams.get("q") || undefined;

  const where: Prisma.ReadingLogWhereInput = { userId: session.userId };

  if (genre && GENRE_ORDER.includes(genre as GenreType)) {
    where.genre = toPrismaGenre(genre);
  }
  if (favorite === "true") {
    where.favorite = true;
  }
  if (q) {
    const qt = q.trim();
    if (qt) {
      where.OR = [
        { bookTitle: { contains: qt, mode: "insensitive" } },
        { note: { contains: qt, mode: "insensitive" } },
      ];
    }
  }

  const logs = await prisma.readingLog.findMany({ where });

  const totalMinutes = logs.reduce((sum, item) => sum + item.minutesRead, 0);
  const favoriteCount = logs.filter((item) => item.favorite).length;

  // Build breakdown
  const genreMap = new Map<GenreType, { count: number; total: number }>();
  for (const item of logs) {
    const g = fromPrismaGenre(item.genre);
    const existing = genreMap.get(g) || { count: 0, total: 0 };
    genreMap.set(g, {
      count: existing.count + 1,
      total: existing.total + item.minutesRead,
    });
  }

  const breakdown = Array.from(genreMap.entries())
    .map(([g, data]) => ({
      genre: g,
      count: data.count,
      total: data.total,
    }))
    .sort((a, b) => {
      if (b.total !== a.total) return b.total - a.total;
      return GENRE_ORDER.indexOf(a.genre) - GENRE_ORDER.indexOf(b.genre);
    });

  return NextResponse.json({
    count: logs.length,
    favoriteCount,
    totalMinutes,
    breakdown,
  });
}
